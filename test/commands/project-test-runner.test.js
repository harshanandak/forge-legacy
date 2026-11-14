const { test, expect } = require('bun:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseTestCounts } = require('../../lib/commands/validate');
const { runAllTests } = require('../../lib/commands/validate');
const { captureOutput } = require('../../lib/project-test-runner');

async function project(manifest, run) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-project-test-'));
	try {
		fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(manifest));
		return await run(root);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
}

test.each(['npm', 'bun', 'pnpm', 'yarn'])('honors %s scripts.test', async manager => {
	await project({ packageManager: `${manager}@1.0.0`, scripts: { test: 'node --test' } }, async root => {
		const calls = [];
		const result = await runAllTests((...args) => { calls.push(args); return '# tests 2\n# pass 2\n# fail 0'; }, root);
		expect(calls[0][0]).toBe(manager);
		expect(calls[0][1]).toEqual(['run', 'test']);
		expect(calls[0][2].cwd).toBe(root);
		expect(result).toMatchObject({ success: true, total: 2, passed: 2 });
	});
});

test('parses Node TAP summaries', () => {
	expect(parseTestCounts('# tests 5\n# pass 4\n# fail 1')).toMatchObject({ passed: 4, failed: 1, total: 5 });
});

test('runs a real npm script with quoted arguments and captures both streams', async () => {
	await project({ packageManager: 'npm@11.0.0', scripts: { test: 'node "fixture with spaces.cjs"' } }, async root => {
		fs.writeFileSync(path.join(root, 'fixture with spaces.cjs'), 'console.log("# tests 2\\n# pass 2\\n# fail 0"); console.error("ℹ tests 3\\nℹ pass 3\\nℹ fail 0")');
		expect(await runAllTests(undefined, root)).toMatchObject({ success: true, total: 5, passed: 5, failed: 0 });
	});
});

test('propagates child script failure after passing summary output', async () => {
	await project({ scripts: { test: 'node child.cjs' } }, async root => {
		fs.writeFileSync(path.join(root, 'child.cjs'), 'console.error("# tests 3\\n# pass 3\\n# fail 0"); process.exitCode=7');
		const result = await runAllTests(undefined, root);
		expect(result.success).toBe(false);
		expect(result.passed).toBe(3);
		expect(result.failed).toBeGreaterThan(0);
	});
});

test('captures summaries after more than one MiB of normal suite output', async () => {
	let output, errorCode;
	try {
		output = captureOutput(process.execPath, ['-e', 'process.stdout.write("x".repeat(2 * 1024 * 1024) + "\\n# tests 2\\n# pass 2\\n# fail 0\\n")'], { encoding: 'utf8', timeout: 10000 });
	} catch (error) { errorCode = error.code; }
	expect(errorCode).toBeUndefined();
	expect(output).toContain('# pass 2');
});

test.each([
	['Node unicode', 'ℹ tests 3\nℹ pass 2\nℹ fail 0\nℹ skipped 1', 2, 0, 1, 3],
	['multiple child suites', '# tests 2\n# pass 2\n# fail 0\nℹ tests 3\nℹ pass 2\nℹ fail 1', 4, 1, 0, 5],
	['Vitest', ' Test Files  1 failed | 2 passed (3)\n      Tests  2 failed | 7 passed | 1 skipped (10)', 7, 2, 1, 10],
	['multiple Vitest suites', ' Tests  3 passed (3)\n Tests  1 failed | 2 passed (3)', 5, 1, 0, 6],
	['multiple Bun suites', ' 2 pass\n 0 fail\nRan 2 tests across 1 file.\n 3 pass\n 1 fail\nRan 4 tests across 2 files.', 5, 1, 0, 6],
])('parses %s', (_label, output, passed, failed, skipped, total) => {
	expect(parseTestCounts(output)).toMatchObject({ passed, failed, skipped, total, testsFound: true });
});

test('does not skip reported errors when zero tests ran', async () => {
	await project({}, async root => {
		const result = await runAllTests(() => '0 pass\n0 fail\n1 error\nRan 0 tests across 0 files.', root);
		expect(result.success).toBe(false);
		expect(result.skipped).not.toBe(true);
	});
});

test('reports an all-skipped suite as skipped rather than passed', async () => {
	await project({}, async root => {
		const result = await runAllTests(() => 'Tests  3 skipped (3)', root);
		expect(result.skipped).toBe(true);
		expect(result.message).not.toContain('tests passed');
	});
});

test('parses long malformed Vitest summaries without backtracking', () => {
	const start = performance.now();
	expect(parseTestCounts(`Tests  ${'1'.repeat(60000)} pending`)).toMatchObject({ passed: 0, failed: 0, total: 0 });
	expect(performance.now() - start).toBeLessThan(1000);
});
