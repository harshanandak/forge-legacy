const { describe, test, expect, setDefaultTimeout } = require('bun:test');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
	handler: validateHandler,
	parseResourceBudget,
	runTypeCheck,
	runLint,
	runSecurityScan,
	runAllTests,
	parseTestCounts,
	scanForConflictMarkers,
	executeValidate,
	executeDebugMode,
} = require('../../lib/commands/validate.js');
const { resolveReceiptPath, validationIsComplete } = require('../../lib/validation-receipt.js');

setDefaultTimeout(30000);

describe('Validate Command - Validation Orchestration', () => {
	describe('Resource budget', () => {
		test.each(['0', '-1', '1.5', '2x', undefined])(
			'rejects invalid --shards value %s',
			(value) => {
				const args = value === undefined ? ['--shards'] : ['--shards', value];
				expect(() => parseResourceBudget(args)).toThrow(TypeError);
				expect(() => parseResourceBudget(args)).toThrow('--shards must be a positive integer resource budget');
			},
		);

		test('accepts a positive integer unchanged and preserves the absent default', () => {
			expect(parseResourceBudget(['--shards', '2'])).toBe(2);
			expect(parseResourceBudget([])).toBeNull();
		});

		test('validates every repeated budget and keeps the last valid value', () => {
			expect(() => parseResourceBudget(['--shards', '2', '--shards', '0']))
				.toThrow('--shards must be a positive integer resource budget');
			expect(parseResourceBudget(['--shards', '2', '--shards', '3'])).toBe(3);
		});

		test('threads a validated budget through the command handler', async () => {
			const calls = [];
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async (options) => {
					calls.push(options);
					return { success: true, summary: 'validated' };
				},
			});

			expect(calls).toEqual([{ rootDir: 'C:/repo', resourceBudget: 2 }]);
			expect(result.output).toBe('validated');
		});

		test('surfaces an accepted budget through the registry dispatcher output contract', async () => {
			const tests = {
				success: true,
				message: 'All 8777 tests passed',
				resourceBudget: { requested: 2, effective: 2 },
			};
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async () => ({ success: true, summary: 'validated', checks: { tests } }),
			});

			expect(result).toMatchObject({ success: true, checks: { tests } });
			expect(result.output).toBe([
				'validated',
				'Full suite resource budget: requested=2 effective=2',
			].join('\n'));
		});

		test('surfaces the automatic default budget through the registry dispatcher output contract', async () => {
			const tests = {
				success: true,
				message: 'All 8777 tests passed',
				resourceBudget: { requested: null, effective: 4 },
			};
			const result = await validateHandler([], {}, 'C:/repo', {
				executeValidate: async () => ({ success: true, summary: 'validated', checks: { tests } }),
			});

			expect(result.output).toBe([
				'validated',
				'Full suite resource budget: requested=default effective=4',
			].join('\n'));
		});

		test('retains an accepted budget when tests fail after starting', async () => {
			const tests = {
				success: false,
				skipped: 3,
				message: '2/8777 tests failed',
				resourceBudget: { requested: 2, effective: 2 },
			};
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: tests',
					checks: { tests },
					failedChecks: ['tests'],
				}),
			});

			expect(result).toMatchObject({ success: false, error: '2/8777 tests failed', checks: { tests } });
			expect(result.output).toBe('Full suite resource budget: requested=2 effective=2');
		});

		test('reports only the failed check when tests pass', async () => {
			const lint = { success: false, message: 'Linting failed: 2 errors, 0 warnings' };
			const tests = {
				success: true,
				message: 'All 8777 tests passed',
				resourceBudget: { requested: 2, effective: 2 },
			};
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: lint',
					checks: { lint, tests },
					failedChecks: ['lint'],
				}),
			});

			expect(result.error).toBe('Linting failed: 2 errors, 0 warnings');
			expect(result.output).toBe('Full suite resource budget: requested=2 effective=2');
		});

		test('reports every failed check and retains the accepted budget', async () => {
			const lint = { success: false, message: 'Linting failed: 2 errors, 0 warnings' };
			const tests = {
				success: false,
				message: '2/8777 tests failed',
				resourceBudget: { requested: 2, effective: 2 },
			};
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: lint, tests',
					checks: { lint, tests },
					failedChecks: ['lint', 'tests'],
				}),
			});

			expect(result.error).toBe('Linting failed: 2 errors, 0 warnings; 2/8777 tests failed');
			expect(result.output).toBe('Full suite resource budget: requested=2 effective=2');
		});

		test('uses caught check errors and ignores skipped checks when failedChecks is incomplete', async () => {
			const result = await validateHandler(['--shards', '2'], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: ',
					errors: ['Lint error: lint crashed'],
					checks: {
						lint: { success: false, message: 'lint crashed' },
						typeCheck: { success: false, skipped: true, message: 'TypeScript not configured' },
						tests: {
							success: true,
							message: 'All 8777 tests passed',
							resourceBudget: { requested: 2, effective: 2 },
						},
					},
				}),
			});

			expect(result.error).toBe('Lint error: lint crashed');
			expect(result.output).toBe('Full suite resource budget: requested=2 effective=2');
		});

		test('preserves an explicit error without tests or budget evidence', async () => {
			const result = await validateHandler([], {}, 'C:/repo', {
				executeValidate: async () => ({ success: false, error: 'Explicit validation failure' }),
			});

			expect(result).toEqual({ success: false, error: 'Explicit validation failure' });
		});

		test('surfaces a rejected budget through the registry dispatcher error contract', async () => {
			const message = 'Full suite resource budget rejected: requested=1 minimum=2';
			const tests = {
				success: false,
				resourceBudget: { requested: 1, minimum: 2, outcome: 'rejected' },
				message,
			};
			const result = await validateHandler(['--shards', '1'], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: tests',
					checks: { tests },
					failedChecks: ['tests'],
				}),
			});

			expect(result).toMatchObject({
				success: false,
				error: message,
				checks: { tests },
				failedChecks: ['tests'],
			});
			expect(result.output).toBeUndefined();
		});

		test('rejects an invalid handler budget before validation starts', async () => {
			let called = false;
			const result = await validateHandler(['--shards'], {}, 'C:/repo', {
				executeValidate: async () => {
					called = true;
					return { success: true, summary: 'unexpected' };
				},
			});

			expect(result).toEqual({
				success: false,
				error: '--shards must be a positive integer resource budget',
			});
			expect(called).toBe(false);
		});

		test('threads the budget through executeValidate without minting a targeted receipt', async () => {
			const calls = [];
			const result = await executeValidate({
				rootDir: path.resolve(__dirname, '..', '..'),
				resourceBudget: 2,
				skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
				runAllTests: async (...args) => {
					calls.push(args);
					return { success: true, testsFound: true, passed: 1, failed: 0, total: 1 };
				},
				validationReceipt: {
					beginValidation: () => ({ head: 'unused-targeted-snapshot' }),
					completeValidation: (_rootDir, snapshot) => {
						expect(snapshot).toBeNull();
						return false;
					},
				},
			});

			expect(calls).toHaveLength(1);
			expect(calls[0][1]).toBe(path.resolve(__dirname, '..', '..'));
			expect(calls[0][2]).toBe(2);
			expect(result.validationReceipt).toBe(false);
		});

		const timeoutStdout = [
			'Full suite resource budget: requested=2 effective=2',
			'Resource lane exclusive: files=17 shards=17 concurrency=1',
			'3 pass',
			'1 fail',
			'Ran 4 tests across 1 file.',
		].join('\n');
		const timeoutStderr = 'shard exclusive-2 still running';
		const timeoutBudgetLine = 'Full suite resource budget: requested=2 effective=2';
		test.each([
			['ETIMEDOUT', { code: 'ETIMEDOUT' }],
			['killed SIGTERM', { killed: true, signal: 'SIGTERM' }],
		].flatMap(([terminal, terminalState]) => [
			[terminal, 'stdout and stderr', terminalState, { stdout: timeoutStdout, stderr: timeoutStderr }, `${timeoutStdout}\n${timeoutStderr}`],
			[terminal, 'stdout only', terminalState, { stdout: timeoutStdout }, timeoutStdout],
			[terminal, 'stderr only', terminalState, { stderr: timeoutStderr }, timeoutStderr],
			[terminal, 'empty capture', terminalState, { stdout: '', stderr: '' }, undefined],
		]))('renders captured timeout evidence through the public handler (%s, %s)', async (_terminal, _capture, terminalState, streams, captured) => {
			const rootDir = path.resolve(__dirname, '..', '..');
			const receiptResults = [];
			const result = await validateHandler(['--shards', '2'], {}, rootDir, {
				executeValidate: (options) => executeValidate({
					...options,
					skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
					runAllTests: (_exec, testRoot, budget) => runAllTests(() => {
						throw Object.assign(new Error('spawnSync node ETIMEDOUT'), terminalState, streams);
					}, testRoot, budget),
					validationReceipt: {
						beginValidation: () => ({ head: 'timeout-snapshot' }),
						completeValidation: (_root, _snapshot, validation) => {
							receiptResults.push(validationIsComplete(validation));
							return false;
						},
					},
				}),
			});

			const budgetEvidence = streams.stdout ? { resourceBudget: { requested: 2, effective: 2 } } : {};
			expect(result).toMatchObject({
				success: false,
				error: 'Test execution timed out after 25 minutes',
				checks: { tests: { success: false, timedOut: true, ...budgetEvidence, passed: 0, failed: 0, total: 0 } },
				failedChecks: ['tests'],
				validationReceipt: false,
			});
			expect(result.checks.tests.skipped).toBeUndefined();
			expect(result.checks.tests.output).toBe(captured);
			expect(result.output).toBe(
				[streams.stdout ? timeoutBudgetLine : null, captured].filter(Boolean).join('\n') || undefined,
			);
			expect(receiptResults).toEqual([false]);
		});

		test('keeps ordinary test-failure output out of the public handler render', async () => {
			const tests = { success: false, message: '1/4 tests failed', output: '3 pass\n1 fail' };
			const result = await validateHandler([], {}, 'C:/repo', {
				executeValidate: async () => ({
					success: false,
					summary: 'Checks failed: tests',
					checks: { tests },
					failedChecks: ['tests'],
				}),
			});

			expect(result.error).toBe('1/4 tests failed');
			expect(result.output).toBeUndefined();
		});
	});
	describe('Type checking', () => {
		test.skip('should run type check successfully', async () => {
			const result = await runTypeCheck();
			expect(result.success !== undefined).toBeTruthy();
			expect(result.duration).toBeTruthy();
		});

		test('should handle missing type checker gracefully', async () => {
			// When no tsconfig.json or type checker available
			const result = await runTypeCheck();
			// Should skip or return a boolean success value
			expect(typeof result.success).toBe('boolean');
		});
	});

	describe('Linting', () => {
		test.skip('should run ESLint successfully', async () => {
			const result = await runLint();
			expect(result.success !== undefined).toBeTruthy();
			expect(result.warnings !== undefined || result.errors !== undefined).toBeTruthy();
		});

		test('should handle ESLint errors', async () => {
			let invocations = 0;
			const result = await runLint(() => {
				invocations += 1;
				const error = new Error('ESLint failed');
				error.stdout = '2 problems (2 errors, 0 warnings)';
				throw error;
			});

			expect(invocations).toBe(1);
			expect(result).toMatchObject({ success: false, errors: 2, warnings: 0 });
		});

		test.skipIf(process.platform !== 'win32')('default executor runs a local Windows ESLint cmd shim under Node', () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-eslint-shim-'));
			const binDir = path.join(rootDir, 'node_modules', '.bin');
			const nodeExecutable = process.env.FORGE_TEST_NODE_EXECUTABLE || globalThis.Bun?.which?.('node') || 'node';
			try {
				fs.mkdirSync(binDir, { recursive: true });
				fs.writeFileSync(path.join(binDir, 'eslint.cmd'), '@echo off\r\nexit /b 0\r\n');
				const script = [
					`const { runLint } = require(${JSON.stringify(path.resolve(__dirname, '..', '..', 'lib', 'commands', 'validate.js'))});`,
					"runLint().then((result) => process.stdout.write(JSON.stringify(result)));",
				].join('\n');
				const output = execFileSync(nodeExecutable, ['-e', script], {
					cwd: rootDir,
					encoding: 'utf8',
					env: { ...process.env, PATH: binDir },
				});
				const result = JSON.parse(output);
				expect(result).toMatchObject({ success: true, errors: 0, warnings: 0 });
				expect(result.skipped).not.toBe(true);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('preserves the missing ESLint consumer fallback', async () => {
			const result = await runLint(() => {
				throw Object.assign(new Error('spawnSync eslint ENOENT'), { code: 'ENOENT' });
			});

			expect(result).toMatchObject({ success: true, skipped: true });
			expect(result.message).toMatch(/ESLint not found/);
		});
	});

	describe('Security scanning', () => {
		test.skip('should run security audit successfully', async () => {
			const result = await runSecurityScan();
			expect(result.success !== undefined).toBeTruthy();
		});

		test.skip('should handle missing package-lock.json', async () => {
			// When using Bun (no package-lock.json)
			const result = await runSecurityScan();
			// Should use bun audit or skip gracefully
			expect(result.success !== undefined).toBeTruthy();
		});

		test.skip('should detect vulnerabilities if present', async () => {
			const result = await runSecurityScan();
			expect(result.vulnerabilities !== undefined || result.success !== undefined).toBeTruthy();
		});
	});

	describe('Test execution', () => {
		test('fails closed when the validation root directory is missing', async () => {
			const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-missing-root-'));
			const rootDir = path.join(parentDir, 'missing');
			try {
				const result = await runAllTests(undefined, rootDir);

				expect(result.success).toBe(false);
				expect(result.skipped).not.toBe(true);
				expect(result.message).toMatch(/root directory/i);
				expect(result.resourceBudget).toBeUndefined();
			} finally {
				fs.rmSync(parentDir, { recursive: true, force: true });
			}
		});

		test('fails closed when the validation root disappears before an ENOENT result', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-removed-root-'));
			try {
				const result = await runAllTests(() => {
					fs.rmSync(rootDir, { recursive: true, force: true });
					throw Object.assign(new Error('spawnSync bun ENOENT'), { code: 'ENOENT' });
				}, rootDir);

				expect(result.success).toBe(false);
				expect(result.skipped).not.toBe(true);
				expect(result.message).toMatch(/root directory/i);
				expect(result.resourceBudget).toBeUndefined();
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test.skip('should run all tests successfully', async () => {
			const result = await runAllTests();
			expect(result.success !== undefined).toBeTruthy();
			expect(result.passed !== undefined).toBeTruthy();
			expect(result.failed !== undefined).toBeTruthy();
			expect(result.total !== undefined).toBeTruthy();
		});

		test.skip('should report test failures', async () => {
			const result = await runAllTests();
			if (!result.success) {
				expect(result.failed > 0).toBeTruthy();
			}
		});

		test('keeps ordinary validation commands bounded and preserves the external Bun fallback', () => {
			const source = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'commands', 'validate.js'), 'utf8');
			expect(source).toMatch(/VALIDATION_COMMAND_TIMEOUT_MS\s*=\s*600000/);
			expect(source).toMatch(/timeout:\s*fullSuite\s*\?\s*FULL_SUITE_TIMEOUT_MS\s*:\s*VALIDATION_COMMAND_TIMEOUT_MS/);
			const projectRunner = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'project-test-runner.js'), 'utf8');
			expect(source).toContain('runProjectTests(exec, rootDir, execOptions)');
			expect(projectRunner).toMatch(/\[\s*'test'\s*,\s*'--timeout'\s*,\s*'30000'\s*\]/);
			expect(source).not.toContain('timed out after 2 minutes');
		});

		test('reserves measured full-suite headroom and bounded output capacity only for the Forge runner', async () => {
			const rootDir = path.resolve(__dirname, '..', '..');
			let options;
			const result = await runAllTests((_command, _args, opts) => {
				options = opts;
				return 'Full suite aggregate: status=PASS tests=1 assertions=1 passed=1 failed=0 errors=0 skipped=0';
			}, rootDir);
			expect(result.success).toBe(true);
			expect(options).toEqual({
				encoding: 'utf8', cwd: rootDir, timeout: 25 * 60 * 1000, maxBuffer: 16 * 1024 * 1024,
			});
		});

		test('does not expand the lint execution limits', async () => {
			let options;
			await runLint((_command, _args, opts) => { options = opts; return ''; });
			expect(options).toEqual({ encoding: 'utf8', cwd: process.cwd(), timeout: 600000 });
		});

		test.each([0, 1])('captures verbose full-suite output and its final verdict without truncation (exit %s)', async (exitCode) => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-verbose-'));
			const aggregate = exitCode === 0
				? 'Full suite aggregate: status=PASS tests=5 assertions=8 passed=5 failed=0 errors=0 skipped=0'
				: 'Full suite aggregate: status=FAIL tests=5 assertions=8 passed=3 failed=2 errors=0 skipped=0';
			const paddingBytes = 2 * 1024 * 1024;
			let captured = '';
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow', bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), [
					"const fs = require('node:fs');",
					`fs.writeSync(1, 'x'.repeat(${paddingBytes}) + '\\n');`,
					`fs.writeSync(2, 'y'.repeat(${paddingBytes}) + '\\n');`,
					`fs.writeSync(1, ${JSON.stringify(aggregate + '\n')});`,
					`process.exitCode = ${exitCode};`,
				].join('\n'));
				const result = await runAllTests((command, args, options) => {
					try {
						captured = execFileSync(command, args, { ...options, stdio: 'pipe' });
						return captured;
					} catch (error) {
						captured = error.stdout || '';
						throw error;
					}
				}, rootDir);
				expect(result.success).toBe(exitCode === 0);
				expect(result.failed).toBe(exitCode === 0 ? 0 : 2);
				expect(result.total).toBe(5);
				expect(Buffer.byteLength(captured)).toBe(paddingBytes + 1 + Buffer.byteLength(aggregate) + 1);
				expect(captured.endsWith(aggregate + '\n')).toBe(true);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test.each([
			['ETIMEDOUT', { code: 'ETIMEDOUT' }],
			['killed SIGTERM', { killed: true, signal: 'SIGTERM' }],
		])('reports the full-suite timeout and captured budget for %s without waiting', async (_name, terminalState) => {
			const result = await runAllTests(() => {
				throw Object.assign(new Error('full suite terminated'), terminalState, {
					stdout: 'Full suite resource budget: requested=2 effective=2',
				});
			}, path.resolve(__dirname, '..', '..'), 2);
			expect(result.success).toBe(false);
			expect(result.message).toBe('Test execution timed out after 25 minutes');
			expect(result).toMatchObject({
				passed: 0,
				failed: 0,
				total: 0,
				resourceBudget: { requested: 2, effective: 2 },
			});
		});

		test('does not invent budget evidence when a full-suite timeout has no output', async () => {
			const result = await runAllTests(() => {
				throw Object.assign(new Error('spawnSync node ETIMEDOUT'), { code: 'ETIMEDOUT' });
			}, path.resolve(__dirname, '..', '..'), 2);

			expect(result).toMatchObject({ success: false, passed: 0, failed: 0, total: 0 });
			expect(result.resourceBudget).toBeUndefined();
		});
	});

	describe('Full validate orchestration', () => {
		test('fails validation when rootDir is missing even if the other checks are skipped', async () => {
			const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-missing-root-'));
			const rootDir = path.join(parentDir, 'missing');
			try {
				const result = await executeValidate({
					rootDir,
					skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.tests.skipped).not.toBe(true);
				expect(result.failedChecks).toEqual(['tests']);
				expect(result.validationReceipt).toBe(false);
			} finally {
				fs.rmSync(parentDir, { recursive: true, force: true });
			}
		});

		test.each([
			['PASS', 2, 1, 0, 1, true, 'Tests: PASS'],
			['FAIL', 3, 1, 1, 1, false, 'Checks failed: tests'],
			['INCOMPLETE', 2, 1, 0, 1, false, 'Checks failed: tests'],
			['PASS', 0, 0, 0, 0, true, 'Tests: SKIPPED'],
		])('distinguishes skipped-test counts from a skipped check (%s, %s tests)', async (status, total, passed, failed, skipped, success, summary) => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-skip-summary-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow', bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				const aggregate = `Full suite aggregate: status=${status} tests=${total} assertions=1 passed=${passed} failed=${failed} errors=0 skipped=${skipped}`;
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), `console.log(${JSON.stringify(aggregate)});`);
				const result = await executeValidate({
					rootDir, skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
				});
				expect(result.success).toBe(success);
				expect(result.checks.tests.skipped).toBe(total === 0 ? true : skipped);
				expect(result.summary).toContain(summary);
				if (!success) expect(result.failedChecks).toEqual(['tests']);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('does not skip a failed full-suite child whose diagnostics contain "not found"', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-failed-child-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow', bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), [
					"console.error('fixture module not found');",
					"console.log('Full suite aggregate: status=FAIL tests=1 assertions=1 passed=0 failed=1 errors=0 skipped=0');",
					'process.exitCode = 1;',
				].join('\n'));
				execFileSync('git', ['init', '--quiet'], { cwd: rootDir });
				execFileSync('git', ['config', 'user.name', 'Forge Test'], { cwd: rootDir });
				execFileSync('git', ['config', 'user.email', 'forge-test@example.invalid'], { cwd: rootDir });
				execFileSync('git', ['add', '.'], { cwd: rootDir });
				execFileSync('git', ['commit', '--quiet', '-m', 'test fixture'], { cwd: rootDir });
				const receiptPath = resolveReceiptPath(rootDir);
				fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
				fs.writeFileSync(receiptPath, 'stale receipt');

				const result = await executeValidate({
					rootDir, skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.tests.skipped).not.toBe(true);
				expect(result.summary).not.toContain('All checks passed');
				expect(result.failedChecks).toEqual(['tests']);
				expect(result.validationReceipt).toBe(false);
				expect(fs.existsSync(receiptPath)).toBe(false);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('should fail fast when conflict markers are present', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-conflicts-'));
			try {
				fs.writeFileSync(
					path.join(tmpDir, 'broken.js'),
					'<<<<<<< HEAD\nconst a = 1;\n=======\nconst a = 2;\n>>>>>>> branch\n',
				);

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.failedChecks).toContain('conflictMarkers');
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: 'broken.js' }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should ignore standalone separator lines that are not full conflict blocks', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-separators-'));
			try {
				fs.writeFileSync(
					path.join(tmpDir, 'notes.md'),
					'Heading\n=======\nBody copy\n',
				);

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(true);
				expect(result.checks.conflictMarkers.files).toEqual([]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should skip hidden directories that are not explicitly allowlisted while scanning tracked dotdirs', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-dotdirs-'));
			try {
				fs.mkdirSync(path.join(tmpDir, '.hidden'), { recursive: true });
				fs.mkdirSync(path.join(tmpDir, '.forge'), { recursive: true });
				fs.mkdirSync(path.join(tmpDir, '.github'), { recursive: true });
				fs.writeFileSync(
					path.join(tmpDir, '.hidden', 'ignored.js'),
					'<<<<<<< HEAD\nignore me\n=======\nignore me too\n>>>>>>> branch\n',
				);
				fs.writeFileSync(
					path.join(tmpDir, '.forge', 'tracked.md'),
					'<<<<<<< HEAD\ntracked dotdir\n=======\ntracked dotdir updated\n>>>>>>> branch\n',
				);
				fs.writeFileSync(
					path.join(tmpDir, '.github', 'workflow.yml'),
					'<<<<<<< HEAD\nscan me\n=======\nscan me too\n>>>>>>> branch\n',
				);

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: path.join('.forge', 'tracked.md') }),
					expect.objectContaining({ path: path.join('.github', 'workflow.yml') }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should skip ignored directories and non-allowlisted dotdirs when scanning Git-listed files', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-git-fast-path-'));
			try {
				execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
				execFileSync('git', ['config', 'user.name', 'Forge Test'], { cwd: tmpDir, stdio: 'ignore' });
				execFileSync('git', ['config', 'user.email', 'forge@example.com'], { cwd: tmpDir, stdio: 'ignore' });
				fs.mkdirSync(path.join(tmpDir, '.beads'), { recursive: true });
				fs.mkdirSync(path.join(tmpDir, '.hidden'), { recursive: true });
				fs.mkdirSync(path.join(tmpDir, '.forge'), { recursive: true });
				fs.mkdirSync(path.join(tmpDir, 'dist'), { recursive: true });
				fs.writeFileSync(
					path.join(tmpDir, '.beads', 'metadata.json'),
					'<<<<<<< HEAD\nbeads\n=======\nbeads\n>>>>>>> branch\n',
				);
				fs.writeFileSync(
					path.join(tmpDir, '.hidden', 'ignored.js'),
					'<<<<<<< HEAD\nhidden\n=======\nhidden\n>>>>>>> branch\n',
				);
				fs.writeFileSync(
					path.join(tmpDir, '.forge', 'tracked.md'),
					'<<<<<<< HEAD\ntracked dotdir\n=======\ntracked dotdir updated\n>>>>>>> branch\n',
				);
				fs.writeFileSync(
					path.join(tmpDir, 'dist', 'bundle.js'),
					'<<<<<<< HEAD\ndist\n=======\ndist\n>>>>>>> branch\n',
				);
				execFileSync('git', ['add', '.'], { cwd: tmpDir, stdio: 'ignore' });
				execFileSync('git', ['commit', '-m', 'seed tracked files'], { cwd: tmpDir, stdio: 'ignore' });

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: path.join('.forge', 'tracked.md') }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should preserve leading whitespace in Git-indexed file paths', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-whitespace-paths-'));
			try {
				const spacedFile = ' leadingspace.js';
				execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
				fs.writeFileSync(
					path.join(tmpDir, spacedFile),
					'<<<<<<< HEAD\nwhitespace path\n=======\nwhitespace path updated\n>>>>>>> branch\n',
				);
				execFileSync('git', ['add', '.'], { cwd: tmpDir, stdio: 'ignore' });

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: spacedFile }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should handle large Git-indexed file lists without overflowing the default exec buffer', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-large-git-index-'));
			try {
				const totalFiles = 5000;
				const longNameSuffix = 'a'.repeat(150);
				execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });

				for (let index = 0; index < totalFiles; index += 1) {
					const fileName = `${String(index).padStart(5, '0')}-${longNameSuffix}.js`;
					fs.writeFileSync(path.join(tmpDir, fileName), 'console.log("safe");\n');
				}

				execFileSync('git', ['add', '.'], { cwd: tmpDir, stdio: 'ignore' });

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(true);
				expect(result.checks.conflictMarkers.files).toEqual([]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		}, 60000 /* extend timeout: staging 5 000 files can be slow on CI */);

		test('should skip tracked symlinks in Git-indexed scans', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-symlink-paths-'));
			const outsideTargetPath = path.join(os.tmpdir(), `forge-validate-symlink-target-${Date.now()}.txt`);
			try {
				execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
				fs.writeFileSync(
					path.join(tmpDir, 'tracked.js'),
					'console.log("safe");\n',
				);
				fs.writeFileSync(
					outsideTargetPath,
					'<<<<<<< HEAD\noutside\n=======\noutside\n>>>>>>> branch\n',
				);

				try {
					fs.symlinkSync(
						outsideTargetPath,
						path.join(tmpDir, 'linked.txt'),
					);
				} catch (error) {
					if (error && (error.code === 'EPERM' || error.code === 'EACCES' || error.code === 'UNKNOWN')) {
						return;
					}
					throw error;
				}

				execFileSync('git', ['add', '.'], { cwd: tmpDir, stdio: 'ignore' });

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(true);
				expect(result.checks.conflictMarkers.files).toEqual([]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
				fs.rmSync(outsideTargetPath, { force: true });
			}
		});

		test('should flag unterminated conflict marker blocks', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-partial-conflicts-'));
			try {
				fs.writeFileSync(
					path.join(tmpDir, 'partial.js'),
					'<<<<<<< HEAD\nconst a = 1;\n=======\nconst a = 2;\n',
				);

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: 'partial.js', line: 1 }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should flag orphaned closing conflict markers', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-orphaned-closing-'));
			try {
				fs.writeFileSync(
					path.join(tmpDir, 'orphaned.md'),
					'Normal content\n>>>>>>> feature-branch\nMore content\n',
				);

				const result = await executeValidate({
					rootDir: tmpDir,
					skip: ['typeCheck', 'lint', 'security', 'tests'],
				});

				expect(result.success).toBe(false);
				expect(result.checks.conflictMarkers.files).toEqual([
					expect.objectContaining({ path: 'orphaned.md', line: 2 }),
				]);
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should run all checks in sequence', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-sequence-'));
			try {
				// Skip heavy checks (lint/security/tests call real CLI tools).
				// Use an empty temp root so conflict-marker scanning stays deterministic and fast.
				const result = await executeValidate({ rootDir: tmpDir, skip: ['lint', 'security', 'tests'] });
				expect(typeof result.success).toBe('boolean');
				expect(result.checks).toBeTruthy();
				expect('conflictMarkers' in result.checks).toBeTruthy();
				expect('typeCheck' in result.checks).toBeTruthy();
				expect(typeof result.summary).toBe('string');
				expect(typeof result.duration).toBe('number');
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should return summary of all checks', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-summary-'));
			try {
				const result = await executeValidate({ rootDir: tmpDir, skip: ['lint', 'security', 'tests'] });
				expect(result.summary).toBeTruthy();
				expect(typeof result.summary).toBe('string');
				expect(result.summary.length > 0).toBeTruthy();
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test('should fail if any critical check fails', async () => {
			const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-critical-'));
			try {
				const result = await executeValidate({ rootDir: tmpDir, skip: ['lint', 'security', 'tests'] });
				if (!result.success) {
					expect(Array.isArray(result.failedChecks)).toBeTruthy();
					expect(result.failedChecks.length > 0).toBeTruthy();
				} else {
					expect(result.success).toBe(true);
					expect(!result.failedChecks || result.failedChecks.length === 0).toBeTruthy();
				}
			} finally {
				fs.rmSync(tmpDir, { recursive: true, force: true });
			}
		});

		test.skip('should allow skipping specific checks', async () => {
			const result = await executeValidate({ skip: ['typeCheck'] });
			expect(result.checks).toBeTruthy();
			// typeCheck should be skipped
			if (result.checks.typeCheck) {
				expect(result.checks.typeCheck.skipped).toBe(true);
			}
		});

		test.skip('should handle custom skip list', async () => {
			const result = await executeValidate({ skip: ['typeCheck'] });
			expect(result.checks).toBeTruthy();
		});

		test.skip('should validate options parameter', async () => {
			// Invalid options should use defaults
			const result1 = await executeValidate(null);
			expect(result1.success !== undefined).toBeTruthy();

			const result2 = await executeValidate({});
			expect(result2.success !== undefined).toBeTruthy();
		});

		test.skip('should return execution time for each check', async () => {
			const result = await executeValidate();
			expect(result.checks).toBeTruthy();
			Object.values(result.checks).forEach(check => {
				if (check && !check.skipped) {
					expect(check.duration !== undefined).toBeTruthy();
				}
			});
		});
	});

	describe('Error handling', () => {
		test.skip('should handle command not found errors', async () => {
			// When bun test or eslint not available
			const result = await executeValidate();
			expect(result.success !== undefined).toBeTruthy();
			// Should report which commands failed
			if (!result.success && result.errors) {
				expect(Array.isArray(result.errors)).toBeTruthy();
			}
		});

		test.skip('should continue checks even if one fails', async () => {
			// If lint fails, should still run tests
			const result = await executeValidate({ continueOnError: true });
			expect(result.checks).toBeTruthy();
			// Should have results for all checks attempted
			const checkCount = Object.keys(result.checks).length;
			expect(checkCount >= 2).toBeTruthy(); // At least 2 checks attempted
		});
	});

	describe('Export verification', () => {
		test('should export executeValidate function', () => {
			const { executeValidate } = require('../../lib/commands/validate.js');
			expect(typeof executeValidate).toBe('function');
		});

		test('should export scanForConflictMarkers function', () => {
			expect(typeof scanForConflictMarkers).toBe('function');
		});
	});

	describe('File existence', () => {
		test('check.md should no longer exist', () => {
			const fs = require('node:fs');
			const path = require('node:path');
			const checkMdPath = path.join(__dirname, '../../.claude/commands/check.md');
			expect(fs.existsSync(checkMdPath)).toBe(false);
		});
	});

	describe('AGENTS.md references', () => {
		test('AGENTS.md should reference /validate not /check', () => {
			const fs = require('node:fs');
			const path = require('node:path');
			const agentsPath = path.join(__dirname, '../../AGENTS.md');
			const content = fs.readFileSync(agentsPath, 'utf8');
			expect(content).toContain('/validate');
			expect(content).not.toContain('/check');
		});
	});

	describe('Debug mode', () => {
		test('should enter debug mode at Phase D1 on first failure', () => {
			const result = executeDebugMode({ fixAttempts: 0 });
			expect(result).toEqual({ escalate: false, phase: 'D1' });
		});

		test('should escalate when 3+ fix attempts', () => {
			const result = executeDebugMode({ fixAttempts: 3 });
			expect(result.escalate).toBe(true);
			expect(result.message).toEqual(expect.stringContaining('STOP'));
		});

		test('should reject completion claim without fresh evidence', () => {
			const result = executeDebugMode({ fixAttempts: 1, claim: 'looks good to me' });
			expect(result.valid).toBe(false);
			expect(result.reason).toEqual(expect.stringContaining('fresh'));
		});

		test('should escalate when both fixAttempts>=3 and claim is weak (escalation takes priority)', () => {
			const result = executeDebugMode({ fixAttempts: 3, claim: 'looks good probably' });
			expect(result.escalate).toBe(true);
			expect(result.message).toEqual(expect.stringContaining('STOP'));
		});
	});

	// B2 (N1): a green Tests result must mean tests actually ran and passed.
	describe('runAllTests — never false-green on 0 tests (B2)', () => {
		const fakeExec = (out) => () => out;

		test('bun ran but executed 0 tests => explicit SKIP, never PASS', async () => {
			const result = await runAllTests(fakeExec('0 pass\n0 fail\nRan 0 tests across 0 files. [1.00ms]'), os.tmpdir());
			expect(result.skipped).toBe(true);
			expect(result.testsFound).toBe(false);
			expect(result.total).toBe(0);
			expect(result.resourceBudget).toBeUndefined();
			// Forge's full-suite producer rejects zero-test shard receipts as INCOMPLETE
			// before this branch; raw Bun is the reachable zero-test producer here.
			// The status label must not read PASS when nothing ran.
			expect(getCheckStatus(result)).toBe('SKIPPED');
			expect(result.message).toMatch(/no tests|0 tests/i);
		});

		test('real passing run => success and testsFound true', async () => {
			const result = await runAllTests(fakeExec('5 pass\n0 fail\nRan 5 tests across 2 files. [1.00s]'), os.tmpdir());
			expect(result.success).toBe(true);
			expect(result.testsFound).toBe(true);
			expect(result.total).toBe(5);
			expect(getCheckStatus(result)).toBe('PASS');
		});

		test('failing run => success false with failed count', async () => {
			const exec = () => {
				const e = new Error('bun test failed');
				e.stdout = '3 pass\n2 fail\nRan 5 tests across 2 files.';
				throw e;
			};
			const result = await runAllTests(exec);
			expect(result.success).toBe(false);
			expect(result.failed).toBe(2);
		});

		test.each([
			['POSIX', 'spawn bun ENOENT'],
			['Windows', 'spawnSync bun ENOENT'],
		])('%s missing Bun executable => explicit SKIP, not silent PASS', async (_platform, message) => {
			const exec = () => { const e = new Error(message); e.code = 'ENOENT'; throw e; };
			const result = await runAllTests(exec);
			expect(result.skipped).toBe(true);
			expect(result.resourceBudget).toBeUndefined();
			expect(getCheckStatus(result)).toBe('SKIPPED');
			expect(result.message).toMatch(/bun|test runner/i);
		});

		test('uses the repository full-suite runner and its final aggregate', async () => {
			const rootDir = path.resolve(__dirname, '..', '..');
			const calls = [];
			const result = await runAllTests((...args) => {
				calls.push(args);
				return [
					'Full suite aggregate: status=FAIL tests=2 assertions=2 passed=1 failed=1 errors=0 skipped=0',
					'Full suite aggregate: status=PASS tests=7 assertions=9 passed=6 failed=0 errors=0 skipped=1',
				].join('\n');
			}, rootDir);

			expect(calls).toHaveLength(1);
			expect(calls[0][0]).toBe('node');
			expect(calls[0][1]).toEqual(['scripts/test-full-suite.js']);
			expect(calls[0][2].cwd).toBe(rootDir);
			expect(result).toMatchObject({ success: true, passed: 6, failed: 0, skipped: 1, total: 7 });
		});

		test('forwards and records the selected full-suite resource budget', async () => {
			const rootDir = path.resolve(__dirname, '..', '..');
			const calls = [];
			const result = await runAllTests((...args) => {
				calls.push(args);
				return [
					'Full suite resource budget: requested=2 effective=2',
					'Full suite aggregate: status=PASS tests=7 assertions=9 passed=7 failed=0 errors=0 skipped=0',
				].join('\n');
			}, rootDir, 2);

			expect(calls[0][1]).toEqual(['scripts/test-full-suite.js', '--shards', '2']);
			expect(result.resourceBudget).toEqual({ requested: 2, effective: 2 });

			const defaultResult = await runAllTests(
				() => [
					'Full suite resource budget: requested=default effective=4',
					'Full suite aggregate: status=PASS tests=7 assertions=9 passed=7 failed=0 errors=0 skipped=0',
				].join('\n'),
				rootDir,
			);
			expect(defaultResult.resourceBudget).toEqual({ requested: null, effective: 4 });
		});

		test('rejects an explicit budget before running a non-Forge consumer command', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-budget-consumer-'));
			let called = false;
			try {
				const result = await runAllTests(() => {
					called = true;
					return '1 pass\n0 fail\nRan 1 tests across 1 file.';
				}, rootDir, 2);

				expect(result).toMatchObject({
					success: false,
					fullSuite: false,
					message: '--shards requires the canonical Forge full-suite runner',
				});
				expect(called).toBe(false);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('falls back to raw Bun outside Forge even when the script path exists', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-bun-fallback-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'external-project',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				const calls = [];
				await runAllTests((...args) => {
					calls.push(args);
					return '1 pass\n0 fail\nRan 1 tests across 1 file.';
				}, rootDir);

				expect(calls[0][0]).toBe('bun');
				expect(calls[0][1]).toEqual(['test', '--timeout', '30000']);
				expect(calls[0][2]).toEqual({ encoding: 'utf8', cwd: rootDir, timeout: 600000 });
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('uses the full-suite runner from a Forge checkout outside the CLI install path', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-checkout-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				const calls = [];
				await runAllTests((...args) => {
					calls.push(args);
					return 'Full suite aggregate: status=PASS tests=1 assertions=1 passed=1 failed=0 errors=0 skipped=0';
				}, rootDir);

				expect(calls[0][0]).toBe('node');
				expect(calls[0][1]).toEqual(['scripts/test-full-suite.js']);
				expect(calls[0][2].cwd).toBe(rootDir);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('fails a successful full-suite process without a terminal aggregate', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-missing-aggregate-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));

				const result = await runAllTests(
					() => '5 pass\n0 fail\nRan 5 tests across 1 file.',
					rootDir,
				);

				expect(result).toMatchObject({ success: false, fullSuite: true, testsFound: true });
				expect(result.message).toMatch(/terminal aggregate/i);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('fails empty full-suite output before the no-tests skip', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-empty-full-suite-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));

				const result = await runAllTests(() => '', rootDir);

				expect(result).toMatchObject({ success: false, fullSuite: true, testsFound: false });
				expect(result.skipped).not.toBe(true);
				expect(result.message).toMatch(/terminal aggregate/i);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('retains rejected budget evidence without synthesizing test failures', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-full-suite-exit-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				const output = 'Full suite resource budget: requested=1 minimum=2 outcome=rejected';
				expect(parseTestCounts(output).resourceBudget).toEqual({
					requested: 1,
					minimum: 2,
					outcome: 'rejected',
				});
				const exec = () => {
					const error = new Error('full suite exited 1');
					error.stdout = output;
					throw error;
				};

				const result = await runAllTests(exec, rootDir, 1);
				expect(result).toMatchObject({
					success: false,
					testsFound: false,
					passed: 0,
					failed: 0,
					total: 0,
					resourceBudget: { requested: 1, minimum: 2, outcome: 'rejected' },
					message: 'Full suite resource budget rejected: requested=1 minimum=2',
				});
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('keeps a non-zero full-suite exit failed when the aggregate reports zero failures', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-full-suite-exit-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({
					name: 'forge-workflow',
					bin: { forge: 'bin/forge.js' },
					scripts: { 'test:full:parallel': 'node scripts/test-full-suite.js' },
				}));
				const exec = () => {
					const error = new Error('full suite exited 1');
					error.stdout = 'Full suite aggregate: status=FAIL tests=10 assertions=12 passed=10 failed=0 errors=0 skipped=0';
					throw error;
				};

				const result = await runAllTests(exec, rootDir);
				expect(result).toMatchObject({
					success: false,
					testsFound: true,
					fullSuite: true,
					passed: 10,
					failed: 1,
					total: 10,
				});
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('parses the final full-suite aggregate before Bun shard summaries', () => {
			const result = parseTestCounts([
				'99 pass',
				'Full suite aggregate: status=FAIL tests=4 assertions=5 passed=3 failed=1 errors=0 skipped=0',
				'Full suite aggregate: status=PASS tests=8 assertions=10 passed=7 failed=0 errors=0 skipped=1',
			].join('\n'));
			expect(result).toMatchObject({ status: 'PASS', passed: 7, failed: 0, errors: 0, skipped: 1, total: 8 });
		});

		test('treats an INCOMPLETE full-suite aggregate as a failed run', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-incomplete-'));
			try {
				fs.mkdirSync(path.join(rootDir, 'scripts'));
				fs.writeFileSync(path.join(rootDir, 'scripts', 'test-full-suite.js'), '');
				const result = await runAllTests(
					() => '99 pass\nFull suite aggregate: status=INCOMPLETE tests=8 assertions=10 passed=7 failed=0 errors=0 skipped=1',
					rootDir,
				);
				expect(result).toMatchObject({ success: false, testsFound: true, passed: 7, failed: 0, total: 8 });
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('executeValidate forwards rootDir to the test runner', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-root-'));
			try {
				fs.writeFileSync(
					path.join(rootDir, 'root-dir.test.js'),
					"import { expect, test } from 'bun:test'; test('rootDir', () => { expect(true).toBe(true); });\n",
				);
				const result = await executeValidate({
					rootDir,
					skip: ['conflictMarkers', 'typeCheck', 'lint', 'security'],
				});
				expect(result.success).toBe(true);
				expect(result.checks.tests).toMatchObject({ testsFound: true, passed: 1, total: 1 });
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});
	});

	describe('Gate integrity', () => {
		const noReceipt = {
			beginValidation: () => ({ head: 'gate-integrity-snapshot' }),
			completeValidation: (_rootDir, _snapshot, result) => validationIsComplete(result),
		};

		test('runs every gate in rootDir, not process.cwd()', async () => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-gate-root-'));
			const calls = [];
			try {
				expect(path.resolve(rootDir)).not.toBe(path.resolve(process.cwd()));
				fs.writeFileSync(path.join(rootDir, 'tsconfig.json'), '{}');
				const result = await executeValidate({
					rootDir,
					validationReceipt: noReceipt,
					exec: (command, args, options) => {
						calls.push({ command, args, cwd: options?.cwd });
						if (command === 'bun' && args[0] === 'test') return '1 pass\n0 fail\nRan 1 tests across 1 file.';
						return '';
					},
				});

				const commands = calls.map(call => call.command);
				expect(commands).toEqual(expect.arrayContaining(['git', 'tsc', 'eslint', 'bun']));
				expect(calls.find(call => call.command === 'bun' && call.args[0] === 'audit')).toBeDefined();
				expect(calls.find(call => call.command === 'bun' && call.args[0] === 'test')).toBeDefined();
				for (const call of calls) expect(call.cwd).toBe(rootDir);
				// tsconfig lookup honoured rootDir: tsc actually ran instead of "not configured"
				expect(result.checks.typeCheck.notConfigured).not.toBe(true);
				expect(result.checks.typeCheck.success).toBe(true);
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		});

		test('passes --max-warnings 0 to eslint', async () => {
			let lintArgs;
			await runLint((_command, args) => { lintArgs = args; return ''; });
			expect(lintArgs).toEqual(expect.arrayContaining(['--max-warnings', '0']));
			expect(lintArgs[lintArgs.indexOf('--max-warnings') + 1]).toBe('0');
		});

		const lintFailure = (status, fields) => () => {
			throw Object.assign(new Error(`Command failed: eslint (exit ${status})`), { status, stdout: '', stderr: '', ...fields });
		};
		const runWithLint = async (lintExec) => {
			const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-validate-lint-exit-'));
			try {
				return await executeValidate({
					rootDir,
					validationReceipt: noReceipt,
					runAllTests: async () => ({
						success: true, testsFound: true, fullSuite: true, passed: 1, failed: 0, total: 1,
					}),
					exec: (command, args, options) => {
						if (command === 'eslint') return lintExec(command, args, options);
						if (command === 'bun' && args[0] === 'audit') return 'No vulnerabilities found';
						return '';
					},
				});
			} finally {
				fs.rmSync(rootDir, { recursive: true, force: true });
			}
		};

		test.each([
			['exit 1, warnings summary on stdout', lintFailure(1, {
				stdout: '✖ 2 problems (0 errors, 2 warnings)\n\nESLint found too many warnings (maximum: 0).',
			}), { success: false, errors: 0, warnings: 2 }],
			['exit 1, warnings only on stderr', lintFailure(1, {
				stderr: '✖ 2 problems (0 errors, 2 warnings)\nESLint found too many warnings (maximum: 0).',
			}), { success: false, errors: 0, warnings: 2 }],
			['exit 2, config crash', lintFailure(2, {
				stderr: 'Oops! Something went wrong! :(\nError: Cannot find module eslint-plugin-missing',
			}), { success: false }],
			['exit 0 with a summary line', () => '✖ 2 problems (0 errors, 2 warnings)\n', { success: true }],
			['exit 0 with no summary line', () => '[{"filePath":"a.js","warningCount":2}]', { success: true }],
			['exit 0, clean', () => '', { success: true, errors: 0, warnings: 0 }],
		])('lint success is the eslint exit code (%s)', async (_name, lintExec, expected) => {
			const lint = await runLint(lintExec);
			expect(lint).toMatchObject(expected);

			const result = await runWithLint(lintExec);
			expect(result.checks.lint.success).toBe(expected.success);
			expect(result.success).toBe(expected.success);
			expect(result.validationReceipt).toBe(expected.success);
			if (!expected.success) expect(result.failedChecks).toContain('lint');
		});

		test('a crashed eslint surfaces its stderr in the lint message', async () => {
			const lint = await runLint(lintFailure(2, {
				stderr: 'Oops! Something went wrong! :(\nError: Cannot find module eslint-plugin-missing',
			}));
			expect(lint.success).toBe(false);
			expect(lint.message).toContain('exit 2');
			expect(lint.message).toContain('Cannot find module eslint-plugin-missing');
		});

		test('missing eslint is a skipped lint gate and mints no receipt end to end', async () => {
			const result = await runWithLint(() => {
				throw Object.assign(new Error('spawnSync eslint ENOENT'), { code: 'ENOENT' });
			});
			expect(result.checks.lint).toMatchObject({ success: true, skipped: true });
			expect(result.validationReceipt).toBe(false);
		});

		test('receipt refuses a skipped lint gate', () => {
			expect(validationIsComplete({
				success: true,
				checks: {
					conflictMarkers: { success: true },
					typeCheck: { success: true, skipped: true, notConfigured: true },
					lint: { success: true, skipped: true },
					security: { success: true },
					tests: { success: true, fullSuite: true, testsFound: true, total: 1, failed: 0 },
				},
			})).toBe(false);
		});
	});
});

// getCheckStatus is internal; re-derive the same rule the summary uses for the
// assertions above (boolean skipped => SKIPPED, else PASS/FAIL).
function getCheckStatus(check) {
	if (!check) return null;
	if (check.skipped === true) return 'SKIPPED';
	return check.success ? 'PASS' : 'FAIL';
}
