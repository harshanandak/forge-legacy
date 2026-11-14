/**
 * Validate Command - Validation Orchestration
 * Runs all validation checks (type/lint/security/tests) in sequence
 *
 * Security: Uses execFileSync for command execution to prevent injection
 * Validation: Orchestrates multiple check types with configurable options
 *
 * @module commands/validate
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { secureExecFileSync } = require('../shell-utils');
const validationReceipt = require('../validation-receipt');
const { runProjectTests, parseProjectTestCounts } = require('../project-test-runner');

// Constants
const CHECK_TYPES = {
	CONFLICT_MARKERS: 'conflictMarkers',
	TYPE_CHECK: 'typeCheck',
	LINT: 'lint',
	SECURITY: 'security',
	TESTS: 'tests',
};

const CONFLICT_MARKER_IGNORE_DIRS = new Set([
	'.beads',
	'.git',
	'.next',
	'coverage',
	'dist',
	'node_modules',
]);
const CONFLICT_MARKER_ALLOWED_DOT_DIRS = new Set([
	'.claude',
	'.codex',
	'.cursor',
	'.forge',
	'.github',
	'.husky',
	'.sonarlint',
]);
const CONFLICT_START_PATTERN = /^<<<<<<<(?: .*)?$/;
const CONFLICT_DIVIDER_PATTERN = /^=======$/;
const CONFLICT_END_PATTERN = /^>>>>>>>.*$/;
const GIT_CONFLICT_SCAN_MAX_BUFFER = 16 * 1024 * 1024;
const VALIDATION_COMMAND_TIMEOUT_MS = 600000;
// Match the full-suite runner's measured headroom; its verbose output exceeds 1 MiB.
const FULL_SUITE_TIMEOUT_MS = 25 * 60 * 1000;
const FULL_SUITE_MAX_BUFFER = 16 * 1024 * 1024;

function validationTimeoutMessage(label, timeoutMs = VALIDATION_COMMAND_TIMEOUT_MS) {
	return `${label} timed out after ${Math.round(timeoutMs / 60000)} minutes`;
}

function listConflictScanFiles(rootDir, exec = execFileSync) {
	try {
		const output = exec(
			'git',
			['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
			{ encoding: 'utf8', cwd: rootDir, timeout: 120000, maxBuffer: GIT_CONFLICT_SCAN_MAX_BUFFER },
		);
		return output
			.split('\0')
			.filter(file => file.length > 0)
			.map(file => path.join(rootDir, file));
	} catch (error) {
		if (!isGitListingUnavailableError(error)) {
			throw error;
		}
		return null;
	}
}

function shouldSkipConflictScanPath(relativePath) {
	const segments = String(relativePath || '')
		.split(/[\\/]+/)
		.filter(Boolean);
	const directorySegments = segments.slice(0, -1);
	return directorySegments.some(segment => (
		(segment.startsWith('.') && !CONFLICT_MARKER_ALLOWED_DOT_DIRS.has(segment))
		|| CONFLICT_MARKER_IGNORE_DIRS.has(segment)
	));
}

/** Build bounded process options, with extra headroom only for Forge's full suite. */
function getExecOptions(rootDir = process.cwd(), fullSuite = false) {
	const options = {
		encoding: 'utf8',
		cwd: rootDir,
		timeout: fullSuite ? FULL_SUITE_TIMEOUT_MS : VALIDATION_COMMAND_TIMEOUT_MS,
	};
	if (fullSuite) options.maxBuffer = FULL_SUITE_MAX_BUFFER;
	return options;
}

const ERROR_PATTERNS = {
	NO_LOCK_FILE: ['requires an existing', 'package-lock'],
	GIT_LISTING_UNAVAILABLE: [
		'not a git repository',
		'maxBuffer',           // git ls-files output exceeds maxBuffer
		'ENOBUFS',             // OS-level buffer overflow
		'ETIMEDOUT',           // subprocess timeout
		'EPERM',               // permission denied
		'EACCES',              // access denied
		'spawnSync',           // general spawn failure
	],
};

/**
 * Check if error indicates command not found
 * @private
 */
function isCommandNotFound(error) {
	return error?.code === 'ENOENT';
}

function isGitListingUnavailableError(error) {
	if (!error || typeof error.message !== 'string') {
		return false;
	}
	return isCommandNotFound(error)
		|| ERROR_PATTERNS.GIT_LISTING_UNAVAILABLE.some(pattern => error.message.includes(pattern));
}

/**
 * Parse number from regex match
 * @private
 */
function parseNumber(match, index = 1, defaultValue = 0) {
	return match ? Number.parseInt(match[index], 10) : defaultValue;
}

/**
 * Get status label for check result
 * @private
 */
function getCheckStatus(check) {
	if (!check) return null;
	if (check.skipped === true) return 'SKIPPED';
	return check.success ? 'PASS' : 'FAIL';
}

function scanForConflictMarkers(rootDir = process.cwd(), exec = execFileSync) {
	const filesWithMarkers = [];

	function inspectFile(absolutePath) {
		const relativePath = path.relative(rootDir, absolutePath) || path.basename(absolutePath);
		if (shouldSkipConflictScanPath(relativePath)) {
			return;
		}

		try {
			if (!fs.lstatSync(absolutePath).isFile()) {
				return;
			}
		} catch (error) {
			if (!canSkipConflictScanStatError(error)) {
				throw error;
			}
			return;
		}

		const startLine = findConflictMarkerStartLine(readConflictScanFile(absolutePath));
		if (startLine === null) {
			return;
		}

		filesWithMarkers.push({ path: relativePath, line: startLine });
	}

	function walk(currentDir) {
		for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
			if (shouldSkipConflictScanEntry(entry)) {
				continue;
			}

			if (entry.isDirectory()) {
				walk(path.join(currentDir, entry.name));
				continue;
			}

			if (!entry.isFile()) {
				continue;
			}

			inspectFile(path.join(currentDir, entry.name));
		}
	}

	const trackedFiles = listConflictScanFiles(rootDir, exec);
	if (trackedFiles) {
		for (const absolutePath of trackedFiles) {
			inspectFile(absolutePath);
		}
	} else {
		walk(rootDir);
	}
	filesWithMarkers.sort((left, right) => {
		if (left.path === right.path) {
			return left.line - right.line;
		}
		return left.path.localeCompare(right.path);
	});

	return {
		success: filesWithMarkers.length === 0,
		files: filesWithMarkers,
		message: filesWithMarkers.length === 0
			? 'No conflict markers found'
			: `Conflict markers found in ${filesWithMarkers.length} file(s)`,
	};
}

function shouldSkipConflictScanEntry(entry) {
	return entry.isDirectory() && (
		(entry.name.startsWith('.') && !CONFLICT_MARKER_ALLOWED_DOT_DIRS.has(entry.name))
		|| CONFLICT_MARKER_IGNORE_DIRS.has(entry.name)
	);
}

function canSkipConflictScanStatError(error) {
	return Boolean(error && ['ENOENT', 'ENOTDIR', 'ELOOP'].includes(error.code));
}

function readConflictScanFile(absolutePath) {
	try {
		return fs.readFileSync(absolutePath, 'utf8');
	} catch (_error) {
		return null;
	}
}

function findConflictMarkerStartLine(content) {
	const lines = String(content || '').split(/\r?\n/);
	let activeStartLine = null;
	let sawDivider = false;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const lineNumber = index + 1;
		if (activeStartLine === null) {
			if (CONFLICT_START_PATTERN.test(line)) {
				activeStartLine = lineNumber;
				sawDivider = false;
			} else if (CONFLICT_END_PATTERN.test(line)) {
				return lineNumber;
			}
			continue;
		}

		if (!sawDivider) {
			if (CONFLICT_DIVIDER_PATTERN.test(line)) {
				sawDivider = true;
			} else if (CONFLICT_START_PATTERN.test(line)) {
				activeStartLine = index + 1;
			}
			continue;
		}

		if (CONFLICT_END_PATTERN.test(line)) {
			return activeStartLine;
		}
	}

	return activeStartLine;
}

/**
 * Parse vulnerability counts from audit output
 * @private
 */
function parseVulnerabilities(output) {
	return {
		critical: parseNumber(/(\d+) critical/i.exec(output)),  // NOSONAR S5852 - bounded \d+ pattern, no backtracking
		high: parseNumber(/(\d+) high/i.exec(output)),  // NOSONAR S5852 - bounded \d+ pattern, no backtracking
		moderate: parseNumber(/(\d+) moderate/i.exec(output)),  // NOSONAR S5852 - bounded \d+ pattern, no backtracking
		low: parseNumber(/(\d+) low/i.exec(output)),  // NOSONAR S5852 - bounded \d+ pattern, no backtracking
	};
}

/**
 * Run TypeScript type checking
 * Executes tsc --noEmit if TypeScript is configured
 *
 * @returns {Promise<{success: boolean, duration: number, errors?: number, skipped?: boolean, message?: string}>} Type check result
 * @example
 * const result = await runTypeCheck();
 * if (!result.success) console.log(`Type errors: ${result.errors}`);
 */
async function runTypeCheck(exec = execFileSync, rootDir = process.cwd()) {
	const startTime = Date.now();

	// Check if TypeScript is configured
	const tsconfigPath = path.join(rootDir, 'tsconfig.json');
	if (!fs.existsSync(tsconfigPath)) {
		return {
			success: true,
			skipped: true,
			notConfigured: true,
			duration: Date.now() - startTime,
			message: 'TypeScript not configured (no tsconfig.json)',
		};
	}

	try {
		// Run tsc --noEmit for type checking only
		exec('tsc', ['--noEmit'], getExecOptions(rootDir));  // NOSONAR S4036 - hardcoded CLI command, no user input, developer tool context

		return {
			success: true,
			duration: Date.now() - startTime,
			errors: 0,
			message: 'Type checking passed',
		};
	} catch (error) {
		// Check for timeout
		if (error.killed && error.signal === 'SIGTERM') {
			return {
				success: false,
				duration: Date.now() - startTime,
				message: validationTimeoutMessage('Type check'),
			};
		}

		// tsc not found or type errors
		if (isCommandNotFound(error)) {
			return {
				success: true,
				skipped: true,
				duration: Date.now() - startTime,
				message: 'TypeScript compiler not found (skipping type check)',
			};
		}

		// Parse error output for error count
		const errorMatch = /Found (\d+) error/.exec(error.stdout);
		const errors = parseNumber(errorMatch, 1, 1);

		return {
			success: false,
			duration: Date.now() - startTime,
			errors,
			message: `Type checking failed: ${errors} error(s) found`,
			output: error.stdout || error.message,
		};
	}
}

/**
 * Run ESLint
 * Executes eslint . --max-warnings 0 in rootDir; any error or warning fails the gate
 *
 * @param {typeof execFileSync} exec - Synchronous process runner
 * @param {string} [rootDir] - Directory eslint runs in
 * @returns {Promise<{success: boolean, duration: number, warnings?: number, errors?: number, message?: string}>} Lint result
 * @example
 * const result = await runLint();
 * console.log(`Warnings: ${result.warnings}, Errors: ${result.errors}`);
 */
async function runLint(exec = secureExecFileSync, rootDir = process.cwd()) {
	const startTime = Date.now();

	try {
		// --max-warnings 0 makes eslint exit non-zero on any warning, so the exit code alone
		// decides success; the summary line is parsed only to report counts.
		const output = exec('eslint', ['.', '--max-warnings', '0'], getExecOptions(rootDir));  // NOSONAR S4036 - hardcoded CLI command, no user input, developer tool context
		const { errors, warnings } = parseLintProblems(output);

		return {
			success: true,
			duration: Date.now() - startTime,
			warnings,
			errors,
			message: 'Linting passed (eslint exited 0 with --max-warnings 0)',
		};
	} catch (error) {
		// Check for timeout
		if (error.killed && error.signal === 'SIGTERM') {
			return {
				success: false,
				duration: Date.now() - startTime,
				message: validationTimeoutMessage('Lint check'),
			};
		}

		// eslint not found - skip gracefully (consistent with tsc behavior)
		if (isCommandNotFound(error)) {
			return {
				success: true,
				skipped: true,
				duration: Date.now() - startTime,
				message: 'ESLint not found (skipping lint check). Install with: bun add -D eslint',
			};
		}

		// Any non-zero eslint exit fails the gate: errors, warnings, or a crash.
		return lintFailureResult(startTime, error);
	}
}

function parseLintProblems(output) {
	const problemsMatch = /(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/.exec(String(output || ''));  // NOSONAR S5852 - bounded quantifiers, no backtracking
	return { errors: parseNumber(problemsMatch, 2, 0), warnings: parseNumber(problemsMatch, 3, 0) };
}

function lintFailureResult(startTime, error) {
	const stdout = String(error.stdout || '');
	const stderr = String(error.stderr || '');
	const output = [stdout, stderr].filter(Boolean).join('\n') || error.message;
	const hasSummary = /\d+ problems? \(\d+ errors?, \d+ warnings?\)/.test(output);  // NOSONAR S5852 - bounded quantifiers, no backtracking
	const { errors, warnings } = parseLintProblems(output);
	const exitLabel = Number.isInteger(error.status) ? `exit ${error.status}` : 'non-zero exit';
	const detail = stderr.trim().split(/\r?\n/).filter(Boolean).slice(-1)[0] || error.message;
	return {
		success: false,
		duration: Date.now() - startTime,
		warnings,
		errors,
		message: hasSummary
			? `Linting failed: ${errors} error(s), ${warnings} warning(s)`
			: `Linting failed (${exitLabel}): ${detail}`,
		output,
	};
}

/**
 * Run security audit
 * Executes bun audit or npm audit to check for vulnerabilities
 *
 * @returns {Promise<{success: boolean, duration: number, vulnerabilities?: {critical: number, high: number, moderate: number, low: number}, message?: string}>} Security scan result
 * @example
 * const result = await runSecurityScan();
 * if (result.vulnerabilities.critical > 0) console.log('Critical vulnerabilities found!');
 */
async function runSecurityScan(exec = null, rootDir = process.cwd()) { // NOSONAR S3776
	const startTime = Date.now();
	const bunExec = exec || execFileSync;
	const npmExec = exec || secureExecFileSync;

	try {
		// Try bun audit first (faster and works without package-lock.json)
		const result = bunExec('bun', ['audit'], getExecOptions(rootDir));  // NOSONAR S4036 - hardcoded CLI command, no user input, developer tool context

		// Parse bun audit output
		const vulnerabilities = parseVulnerabilities(result);
		const totalVulns = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
		const hasCritical = vulnerabilities.critical > 0 || vulnerabilities.high > 0;

		return {
			success: !hasCritical, // Fail only on critical/high
			duration: Date.now() - startTime,
			vulnerabilities,
			message: totalVulns === 0
				? 'No vulnerabilities found'
				: `Found ${totalVulns} ${totalVulns === 1 ? 'vulnerability' : 'vulnerabilities'} (${vulnerabilities.critical} critical, ${vulnerabilities.high} high)`,  // NOSONAR S3358 - simple format string
		};
	} catch (error) {
		// Check if bun audit timed out - don't retry with npm audit
		if (error.killed && error.signal === 'SIGTERM') {
			return {
				success: false,
				duration: Date.now() - startTime,
				message: validationTimeoutMessage('Security audit'),
			};
		}
		// bun audit exits non-zero when vulnerabilities are found; stdout still contains the data
		if (error.stdout) {
			const vulnerabilities = parseVulnerabilities(error.stdout);
			const totalVulns = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
			const hasCritical = vulnerabilities.critical > 0 || vulnerabilities.high > 0;
			return {
				success: !hasCritical,
				duration: Date.now() - startTime,
				vulnerabilities,
				message: totalVulns === 0
					? 'No vulnerabilities found'
					: `Found ${totalVulns} ${totalVulns === 1 ? 'vulnerability' : 'vulnerabilities'} (${vulnerabilities.critical} critical, ${vulnerabilities.high} high)`,  // NOSONAR S3358 - simple format string
			};
		}
		// bun audit failed without output, try npm audit
		// Note: npm audit exits non-zero for ANY vulnerability (including low/moderate).
		// Capture stdout from the error object to parse JSON output even on non-zero exit.
		try {
			let npmRawOutput = null;
			try {
				npmRawOutput = npmExec('npm', ['audit', '--json', '--production'], getExecOptions(rootDir));  // NOSONAR S4036 - hardcoded CLI command, no user input, developer tool context
			} catch (npmExitError) {
				if (npmExitError.killed && npmExitError.signal === 'SIGTERM') {
					return {
						success: false,
						duration: Date.now() - startTime,
						message: validationTimeoutMessage('Security audit'),
					};
				}
				// npm audit exits non-zero when it finds any vulnerability - stdout still has JSON
				if (npmExitError.stdout) {
					npmRawOutput = npmExitError.stdout;
				} else {
					throw npmExitError; // Genuine failure (not found, no lock file, etc.)
				}
			}

			if (npmRawOutput !== null) {
				let vulnerabilities;
				try {
					const auditData = JSON.parse(npmRawOutput);
					const meta = auditData.metadata?.vulnerabilities || auditData.vulnerabilities || {};
					vulnerabilities = {
						critical: meta.critical || 0,
						high: meta.high || 0,
						moderate: meta.moderate || 0,
						low: meta.low || 0,
					};
				} catch { // JSON parse failed — npm audit returned plain text
					return {
						success: true,
						skipped: true,
						duration: Date.now() - startTime,
						message: 'Security audit skipped (npm audit returned non-JSON output)',
					};
				}
				const totalVulns = Object.values(vulnerabilities).reduce((sum, n) => sum + n, 0);
				const hasCritical = vulnerabilities.critical > 0 || vulnerabilities.high > 0;
				const vulnSuffix = totalVulns === 1 ? 'y' : 'ies';
				return {
					success: !hasCritical,
					duration: Date.now() - startTime,
					vulnerabilities,
					message: totalVulns === 0
						? 'No vulnerabilities found (npm audit)'
						: `Found ${totalVulns} vulnerabilit${vulnSuffix} (${vulnerabilities.critical} critical, ${vulnerabilities.high} high)`,
				};
			}
			// Defensive fallback: npmRawOutput was null (unreachable in practice)
			return {
				success: true,
				skipped: true,
				duration: Date.now() - startTime,
				message: 'Security audit skipped (no audit output available)',
			};
		} catch (npmError) {
			// Check for timeout first
			if (npmError.killed && npmError.signal === 'SIGTERM') {
				return {
					success: false,
					duration: Date.now() - startTime,
					message: validationTimeoutMessage('Security audit'),
				};
			}

			// Both failed - check if it's because tools aren't available
			const bunNotFound = isCommandNotFound(error);
			const noLockFile = ERROR_PATTERNS.NO_LOCK_FILE.some(pattern =>
				npmError.message?.includes(pattern),
			);

			if (bunNotFound || noLockFile) {
				return {
					success: true,
					skipped: true,
					duration: Date.now() - startTime,
					message: 'Security audit skipped (no package manager audit available)',
				};
			}

			// Audit found issues
			return {
				success: false,
				duration: Date.now() - startTime,
				message: 'Security audit failed. Run: npm audit or bun audit to see details',
				output: npmError.message || error.message,
			};
		}
	}
}

/**
 * Run all tests
 * Uses Forge's full-suite runner when present, otherwise the project's declared test script
 *
 * @returns {Promise<{success: boolean, duration: number, passed: number, failed: number, total: number, message?: string}>} Test execution result
 * @example
 * const result = await runAllTests();
 * console.log(`${result.passed}/${result.total} tests passed`);
 */
function parseTestCounts(output) {
	const text = String(output || '');
	const effectiveBudgetMatch = /Full suite resource budget: requested=(default|\d+) effective=(\d+)/.exec(text);
	const rejectedBudgetMatch = /Full suite resource budget: requested=(\d+) minimum=(\d+) outcome=rejected/.exec(text);
	let resourceBudget;
	if (effectiveBudgetMatch) {
		resourceBudget = {
			requested: effectiveBudgetMatch[1] === 'default' ? null : Number(effectiveBudgetMatch[1]),
			effective: Number(effectiveBudgetMatch[2]),
		};
	} else if (rejectedBudgetMatch) {
		resourceBudget = {
			requested: Number(rejectedBudgetMatch[1]),
			minimum: Number(rejectedBudgetMatch[2]),
			outcome: 'rejected',
		};
	}
	const aggregateMatches = [...text.matchAll(
		/Full suite aggregate: status=(PASS|FAIL|INCOMPLETE) tests=(\d+) assertions=\d+ passed=(\d+) failed=(\d+) errors=(\d+) skipped=(\d+)/g,
	)]; // NOSONAR S5852 - fixed tokens and bounded numeric fields
	const aggregate = aggregateMatches.at(-1);
	if (aggregate) {
		const total = parseNumber(aggregate, 2);
		return {
			status: aggregate[1],
			resourceBudget,
			passed: parseNumber(aggregate, 3),
			failed: parseNumber(aggregate, 4),
			errors: parseNumber(aggregate, 5),
			skipped: parseNumber(aggregate, 6),
			total,
			testsFound: total > 0,
		};
	}
	return { ...parseProjectTestCounts(text), resourceBudget };
}

function parseResourceBudget(args = []) {
	let budget = null;
	for (let index = 0; index < args.length; index += 1) {
		if (args[index] !== '--shards') continue;
		const value = args[index + 1];
		if (!/^[1-9]\d*$/.test(String(value ?? ''))) {
			throw new TypeError('--shards must be a positive integer resource budget');
		}
		budget = Number(value);
		if (!Number.isSafeInteger(budget)) {
			throw new TypeError('--shards must be a positive integer resource budget');
		}
		index += 1;
	}
	return budget;
}

function isForgeCheckout(rootDir) {
	try {
		const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
		return manifest.name === 'forge-workflow'
			&& manifest.bin?.forge === 'bin/forge.js'
			&& manifest.scripts?.['test:full:parallel'] === 'node scripts/test-full-suite.js'
			&& fs.existsSync(path.join(rootDir, 'scripts', 'test-full-suite.js'));
	} catch (error) {
		if (error instanceof SyntaxError || error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
		throw error;
	}
}

function isValidationRootAvailable(rootDir) {
	try {
		return fs.statSync(rootDir).isDirectory();
	} catch {
		return false;
	}
}

function unavailableValidationRootResult(startTime) {
	return {
		success: false,
		testsFound: false,
		fullSuite: false,
		duration: Date.now() - startTime,
		passed: 0,
		failed: 0,
		total: 0,
		message: 'Test execution failed: validation root directory is unavailable',
	};
}

function testExecutionErrorResult(error, startTime, rootDir, useFullSuite, timeout) {
	const output = [error.stdout, error.stderr].filter(Boolean).join('\n') || error.message;
	const counts = parseTestCounts(output);
	const budgetEvidence = counts.resourceBudget ? { resourceBudget: counts.resourceBudget } : {};
	if (error.code === 'ETIMEDOUT' || (error.killed && error.signal === 'SIGTERM')) {
		// Keep whatever the runner printed before it was killed; counts stay zero because the run is incomplete.
		const capturedOutput = [error.stdout, error.stderr].filter(Boolean).join('\n');
		return {
			success: false,
			timedOut: true,
			fullSuite: useFullSuite,
			...budgetEvidence,
			duration: Date.now() - startTime,
			passed: 0,
			failed: 0,
			total: 0,
			message: validationTimeoutMessage('Test execution', timeout),
			...(capturedOutput ? { output: capturedOutput } : {}),
		};
	}

	if (isCommandNotFound(error)) {
		if (!isValidationRootAvailable(rootDir)) {
			return { ...unavailableValidationRootResult(startTime), ...budgetEvidence };
		}
		return {
			success: true,
			skipped: true,
			testsFound: false,
			fullSuite: useFullSuite,
			...budgetEvidence,
			duration: Date.now() - startTime,
			passed: 0,
			failed: 0,
			total: 0,
			message: 'Tests skipped: test runner not found. Install Node.js and Bun to run tests.',
		};
	}

	if (counts.resourceBudget?.outcome === 'rejected') {
		return {
			success: false,
			testsFound: false,
			fullSuite: useFullSuite,
			resourceBudget: counts.resourceBudget,
			duration: Date.now() - startTime,
			passed: 0,
			failed: 0,
			total: 0,
			message: `Full suite resource budget rejected: requested=${counts.resourceBudget.requested} minimum=${counts.resourceBudget.minimum}`,
			output,
		};
	}
	const passed = counts.passed;
	const failed = counts.failed > 0 ? counts.failed : Math.max(1, counts.errors || 0);
	const total = counts.total > 0 ? counts.total : passed + failed + counts.skipped;

	return {
		success: false,
		testsFound: counts.testsFound,
		fullSuite: useFullSuite,
		resourceBudget: counts.resourceBudget,
		duration: Date.now() - startTime,
		passed,
		failed,
		total,
		message: `${failed}/${total} tests failed`,
		output,
	};
}

async function runAllTests(exec = execFileSync, rootDir = process.cwd(), resourceBudget = null) {
	const startTime = Date.now();
	if (!isValidationRootAvailable(rootDir)) return unavailableValidationRootResult(startTime);
	const useFullSuite = isForgeCheckout(rootDir);
	if (resourceBudget !== null && !useFullSuite) {
		return {
			success: false,
			testsFound: false,
			fullSuite: false,
			duration: Date.now() - startTime,
			passed: 0,
			failed: 0,
			total: 0,
			message: '--shards requires the canonical Forge full-suite runner',
		};
	}
	const args = ['scripts/test-full-suite.js'];
	if (useFullSuite && resourceBudget !== null) args.push('--shards', String(resourceBudget));
	const execOptions = getExecOptions(rootDir, useFullSuite);

	try {
		const result = useFullSuite
			? exec('node', args, execOptions)
			: runProjectTests(exec, rootDir, execOptions);

		const {
			status,
			passed,
			failed,
			errors = 0,
			skipped,
			total,
			testsFound,
			resourceBudget: budgetEvidence,
		} = parseTestCounts(result);
		if (useFullSuite && status !== 'PASS') {
			return {
				success: false,
				testsFound,
				fullSuite: true,
				resourceBudget: budgetEvidence,
				duration: Date.now() - startTime,
				passed,
				failed,
				skipped,
				total,
				message: 'Full suite did not report a passing terminal aggregate',
			};
		}
		const success = failed === 0 && errors === 0 && (status === undefined || status === 'PASS');

		// B2 (N1): a bun run that executes 0 tests must NEVER report PASS — that
		// manufactures false confidence. Surface it as an explicit SKIP instead.
		if (passed + failed + errors === 0 && success) {
			return {
				success: true,
				skipped: true,
				testsFound: false,
				fullSuite: useFullSuite,
				duration: Date.now() - startTime,
				passed,
				failed,
				total,
				message: 'No tests found — 0 tests executed (SKIP, not a pass). Add tests or check the runner config.',
			};
		}

		return {
			success,
			testsFound,
			fullSuite: useFullSuite,
			resourceBudget: budgetEvidence,
			duration: Date.now() - startTime,
			passed,
			failed,
			skipped,
			total,
			message: success ? `All ${total} tests passed` : `${failed + errors}/${total} tests failed`,
		};
	} catch (error) {
		return testExecutionErrorResult(error, startTime, rootDir, useFullSuite, execOptions.timeout);
	}
}

/**
 * Execute all checks
 * Orchestrates type checking, linting, security scanning, and tests
 *
 * @param {{skip?: string[], continueOnError?: boolean, rootDir?: string, exec?: typeof execFileSync}} [options] - Execution options; every gate runs in rootDir
 * @returns {Promise<{
 *   success: boolean,
 *   checks: {
 *     typeCheck?: object,
 *     lint?: object,
 *     security?: object,
 *     tests?: object
 *   },
 *   summary: string,
 *   failedChecks?: string[],
 *   errors?: string[]
 * }>} Execution result
 * @example
 * const result = await executeValidate({ skip: ['typeCheck'] });
 * console.log(result.summary);
 */
async function executeValidate(options = {}) { // NOSONAR S3776
	const {
		skip = [],
		continueOnError = true,
		rootDir = process.cwd(),
		resourceBudget = null,
		exec = null,
	} = options || {};
	const startTime = Date.now();
	if (!isValidationRootAvailable(rootDir)) {
		const checks = { tests: unavailableValidationRootResult(startTime) };
		const result = buildResult(checks, [CHECK_TYPES.TESTS], [], startTime);
		result.validationReceipt = false;
		return result;
	}
	const receiptApi = options?.validationReceipt || validationReceipt;
	const testRunner = options?.runAllTests || runAllTests;
	const validationSnapshot = receiptApi.beginValidation(rootDir);
	const receiptSnapshot = skip.length === 0 ? validationSnapshot : null;

	const checks = {};
	const failedChecks = [];
	const errors = [];
	// 0. Conflict markers
	if (!skip.includes(CHECK_TYPES.CONFLICT_MARKERS)) {
		try {
			checks.conflictMarkers = scanForConflictMarkers(rootDir, exec || execFileSync);
			if (!checks.conflictMarkers.success) {
				failedChecks.push(CHECK_TYPES.CONFLICT_MARKERS);
				if (!continueOnError) {
					return buildResult(checks, failedChecks, errors, startTime);
				}
			}
		} catch (error) {
			errors.push(`Conflict marker scan error: ${error.message}`);
			checks.conflictMarkers = { success: false, message: error.message };
		}
	}

	// 1. Type checking
	if (!skip.includes(CHECK_TYPES.TYPE_CHECK)) {
		try {
			checks.typeCheck = await runTypeCheck(exec || execFileSync, rootDir);
			if (!checks.typeCheck.success && !checks.typeCheck.skipped) {
				failedChecks.push(CHECK_TYPES.TYPE_CHECK);
				if (!continueOnError) {
					return buildResult(checks, failedChecks, errors, startTime);
				}
			}
		} catch (error) {
			errors.push(`Type check error: ${error.message}`);
			checks.typeCheck = { success: false, message: error.message };
		}
	}

	// 2. Linting
	if (!skip.includes(CHECK_TYPES.LINT)) {
		try {
			checks.lint = await runLint(exec || secureExecFileSync, rootDir);
			if (!checks.lint.success && !checks.lint.skipped) {
				failedChecks.push(CHECK_TYPES.LINT);
				if (!continueOnError) {
					return buildResult(checks, failedChecks, errors, startTime);
				}
			}
		} catch (error) {
			errors.push(`Lint error: ${error.message}`);
			checks.lint = { success: false, message: error.message };
		}
	}

	// 3. Security scanning
	if (!skip.includes(CHECK_TYPES.SECURITY)) {
		try {
			checks.security = await runSecurityScan(exec, rootDir);
			if (!checks.security.success && !checks.security.skipped) {
				failedChecks.push(CHECK_TYPES.SECURITY);
				if (!continueOnError) {
					return buildResult(checks, failedChecks, errors, startTime);
				}
			}
		} catch (error) {
			errors.push(`Security scan error: ${error.message}`);
			checks.security = { success: false, message: error.message };
		}
	}

	// 4. Tests
	if (!skip.includes(CHECK_TYPES.TESTS)) {
		try {
			checks.tests = await testRunner(exec || execFileSync, rootDir, resourceBudget);
			if (!checks.tests.success && checks.tests.skipped !== true) {
				failedChecks.push(CHECK_TYPES.TESTS);
				if (!continueOnError) {
					return buildResult(checks, failedChecks, errors, startTime);
				}
			}
		} catch (error) {
			errors.push(`Test execution error: ${error.message}`);
			checks.tests = { success: false, message: error.message };
		}
	}

	const result = buildResult(checks, failedChecks, errors, startTime);
	result.validationReceipt = receiptApi.completeValidation(rootDir, receiptSnapshot, result);
	return result;
}

/**
 * Build final result object
 * @private
 */
function buildResult(checks, failedChecks, errors, startTime) {
	const success = failedChecks.length === 0 && errors.length === 0;
	const duration = Date.now() - startTime;

	// Build summary using getCheckStatus helper
	const checkResults = [];
	const checkLabels = {
		conflictMarkers: 'Conflict Markers',
		typeCheck: 'Type',
		lint: 'Lint',
		security: 'Security',
		tests: 'Tests',
	};

	for (const [key, label] of Object.entries(checkLabels)) {
		const status = getCheckStatus(checks[key]);
		if (status) {
			checkResults.push(`${label}: ${status}`);
		}
	}

	const summary = success
		? `All checks passed (${checkResults.join(', ')})`
		: `Checks failed: ${failedChecks.join(', ')}`;

	const result = {
		success,
		checks,
		summary,
		duration,
	};

	if (failedChecks.length > 0) {
		result.failedChecks = failedChecks;
	}

	if (errors.length > 0) {
		result.errors = errors;
	}

	return result;
}

/**
 * Execute 4-phase debug mode gate when validation fails.
 * Always starts at D1 (Reproduce); D2 (Root-cause) → D3 (Fix) → D4 (Verify)
 * progression is driven by validate.md workflow instructions, not by this function.
 * This function only gates on escalation (3+ attempts) and weak completion claims.
 *
 * @param {{fixAttempts?: number, claim?: string}} [options] - Debug options
 * @returns {{escalate: boolean, phase?: string, message?: string, valid?: boolean, reason?: string}} Debug result
 */
function executeDebugMode({ fixAttempts = 0, claim } = {}) {
	// Escalation takes priority — even if claim is also weak, escalation fires first.
	if (fixAttempts >= 3) {
		return { escalate: true, message: 'STOP: 3+ fixes. Question architecture before Fix #4.' };
	}
	// If claim uses forbidden phrases from dev.md HARD-GATE (exact phrases, not bare words)
	if (claim && /should pass|looks good|seems to work/i.test(claim)) {
		return { valid: false, reason: 'No fresh verification evidence — run validation fresh' };
	}
	// Otherwise start at Phase D1
	return { escalate: false, phase: 'D1' };
}

module.exports = {
	name: 'validate',
	description: 'Run validation checks across type, lint, security, and tests',
	usage: 'forge validate [--shards N]',
	flags: {
		'--shards N': 'Set the full-suite resource budget',
	},
	handler: async (args = [], _flags = {}, projectRoot = process.cwd(), deps = {}) => {
		let resourceBudget;
		try {
			resourceBudget = parseResourceBudget(args);
		} catch (error) {
			return { success: false, error: error.message };
		}
		const result = await (deps.executeValidate || executeValidate)({
			rootDir: projectRoot,
			resourceBudget,
		});
		const errorParts = Array.isArray(result.errors) ? result.errors.filter(Boolean) : [];
		for (const check of Object.values(result.checks || {})) {
			if (check?.success !== false || check.skipped === true || !check.message) continue;
			if (!errorParts.some(error => error.endsWith(check.message))) errorParts.push(check.message);
		}
		const tests = result.checks?.tests;
		const budget = tests?.resourceBudget;
		const budgetOutput = Number.isInteger(budget?.effective)
			? `Full suite resource budget: requested=${budget.requested ?? 'default'} effective=${budget.effective}`
			: null;
		const timeoutOutput = tests?.timedOut === true ? tests.output : null;
		const output = [result.success ? result.summary : null, budgetOutput, timeoutOutput].filter(Boolean).join('\n');
		const error = result.error || result.message || errorParts.join('; ') || result.summary;
		return {
			...result,
			...(output ? { output } : {}),
			...(!result.success && error ? { error } : {}),
		};
	},
	runTypeCheck,
	runLint,
	runSecurityScan,
	runAllTests,
	parseResourceBudget,
	parseTestCounts,
	scanForConflictMarkers,
	executeValidate,
	executeDebugMode,
};
