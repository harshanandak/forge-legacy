const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { stripVTControlCharacters } = require('node:util');
const { secureExecFileSync } = require('./shell-utils');

const LOCKFILES = [
	['bun', ['bun.lock', 'bun.lockb']],
	['pnpm', ['pnpm-lock.yaml']],
	['yarn', ['yarn.lock']],
	['npm', ['package-lock.json', 'npm-shrinkwrap.json']],
];

function projectTestCommand(rootDir) {
	let manifest;
	try {
		manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
	if (typeof manifest?.scripts?.test !== 'string' || !manifest.scripts.test.trim()) {
		return { command: 'bun', args: ['test', '--timeout', '30000'] };
	}
	const declared = /^(npm|bun|pnpm|yarn)(?:@|$)/.exec(manifest.packageManager || '');
	if (manifest.packageManager && !declared) {
		throw new Error('Unsupported packageManager for the declared test script');
	}
	const detected = LOCKFILES.find(([, names]) => names.some(name => fs.existsSync(path.join(rootDir, name))));
	return { command: declared?.[1] || detected?.[0] || 'npm', args: ['run', 'test'] };
}

// execFileSync returns stdout only; Bun and Node's terminal reporter also use stderr.
function captureOutput(command, args, options) {
	const result = spawnSync(command, args, { ...options, maxBuffer: options.maxBuffer ?? 16 * 1024 * 1024 });
	if (result.error || result.status !== 0) {
		const error = result.error || new Error(`Test command exited with status ${result.status}`);
		Object.assign(error, { status: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr });
		throw error;
	}
	return [result.stdout, result.stderr].filter(Boolean).join('\n');
}

function runProjectTests(exec = execFileSync, rootDir = process.cwd(), options = {}) {
	const { command, args } = projectTestCommand(rootDir);
	if (exec !== execFileSync) return exec(command, args, options);
	return secureExecFileSync(command, args, { ...options, _execFileSync: captureOutput });
}

function addVitestCounts(summary, counts) {
	let total = 0;
	for (const part of summary.split('|')) {
		const tokens = part.trim().split(/\s+/);
		const key = { passed: 'passed', failed: 'failed', skipped: 'skipped', todo: 'skipped' }[tokens[1]];
		if (key && /^\d+$/.test(tokens[0])) {
			const count = Number(tokens[0]);
			counts[key] += count;
			total += count;
		}
	}
	const tail = summary.trim().split(/\s+/).at(-1);
	const explicitTotal = /^\((\d+)\)$/.exec(tail);
	counts.total += explicitTotal ? Number(explicitTotal[1]) : total;
}

function parseProjectTestCounts(output) {
	const text = stripVTControlCharacters(String(output || ''));
	const counts = { passed: 0, failed: 0, skipped: 0, errors: 0, total: 0 };
	let declaredTotals = 0;
	for (const line of text.split(/\r?\n/)) {
		const node = /^(?:#|ℹ\uFE0F?) (tests|pass|fail|skipped|cancelled) (\d+)\s*$/.exec(line.trim());
		if (node) {
			const key = { tests: 'total', pass: 'passed', fail: 'failed', skipped: 'skipped', cancelled: 'errors' }[node[1]];
			counts[key] += Number(node[2]);
			if (key === 'total') declaredTotals += 1;
			continue;
		}
		const vitest = line.trimStart();
		if (vitest.startsWith('Tests ')) {
			addVitestCounts(vitest.slice(6), counts);
			declaredTotals += 1;
			continue;
		}
		const bun = /^\s*(\d+) (pass|fail|skip|todo|error)(?:\s|$)/.exec(line);
		if (bun) {
			const key = { pass: 'passed', fail: 'failed', skip: 'skipped', todo: 'skipped', error: 'errors' }[bun[2]];
			counts[key] += Number(bun[1]);
		}
		const ran = /^\s*Ran (\d+) tests?\b/.exec(line);
		if (ran) { counts.total += Number(ran[1]); declaredTotals += 1; }
	}
	if (!declaredTotals) counts.total = counts.passed + counts.failed + counts.skipped;
	return { ...counts, testsFound: counts.total > 0 };
}

module.exports = { projectTestCommand, runProjectTests, parseProjectTestCounts, captureOutput };
