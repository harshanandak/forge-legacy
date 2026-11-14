// Builds the narrow beta4 patch in memory; the caller owns backups and installation.
function replaceOnce(source, before, after) {
	const start = source.indexOf(before);
	if (start < 0 || source.indexOf(before, start + before.length) >= 0) {
		throw new Error(`Validator does not match the expected beta4 source at ${before}; no patch generated`);
	}
	return source.slice(0, start) + after + source.slice(start + before.length);
}

function backportProjectValidator(original) {
	let source = String(original).replace(/\r\n/g, '\n');
	source = replaceOnce(source,
		"const { secureExecFileSync } = require('../shell-utils');",
		"const { secureExecFileSync } = require('../shell-utils');\nconst { runProjectTests, parseProjectTestCounts } = require('../project-test-runner');");
	const parserStart = source.indexOf('function parseTestCounts(output) {');
	const runnerStart = source.indexOf('async function runAllTests(exec = execFileSync) {');
	if (parserStart < 0 || runnerStart <= parserStart) throw new Error('Expected beta4 parser and runner not found');
	source = source.slice(0, parserStart)
		+ 'function parseTestCounts(output) {\n\treturn parseProjectTestCounts(output);\n}\n\n'
		+ source.slice(runnerStart);
	source = replaceOnce(source, 'async function runAllTests(exec = execFileSync) {',
		'async function runAllTests(exec = execFileSync, rootDir = process.cwd()) {');
	source = replaceOnce(source, "exec('bun', ['test', '--timeout', '30000'], getExecOptions())",
		'runProjectTests(exec, rootDir, { ...getExecOptions(), cwd: rootDir })');
	source = replaceOnce(source, 'const { passed, failed, skipped, total, testsFound } = parseTestCounts(result);',
		'const { passed, failed, skipped, errors, total, testsFound } = parseTestCounts(result);');
	source = replaceOnce(source, 'if (!testsFound) {', 'if (passed + failed + errors === 0) {');
	source = replaceOnce(source, 'success: failed === 0,', 'success: failed === 0 && errors === 0,');
	source = replaceOnce(source, 'message: failed === 0\n', 'message: failed === 0 && errors === 0\n');
	const start = source.indexOf('async function runAllTests(');
	const end = source.indexOf('\n/**', start);
	const runner = source.slice(start, end);
	let patchedRunner = replaceOnce(runner, 'if (isCommandNotFound(error)) {', "if (error.code === 'ENOENT') {")
		.replace('if (error.killed && error.signal === \'SIGTERM\') {', "if (error.code === 'ETIMEDOUT' || (error.killed && error.signal === 'SIGTERM')) {")
		.replace('Math.max(1, counts.failed)', 'Math.max(1, counts.errors || 0)')
		.replace('Tests skipped: bun test runner not found. Install bun to run tests.', 'Tests skipped: test runner not found. Install the declared package manager to run tests.');
	patchedRunner = replaceOnce(patchedRunner, 'const output = error.stdout || error.message;',
		"const output = [error.stdout, error.stderr].filter(Boolean).join('\\n') || error.message;");
	source = source.slice(0, start) + patchedRunner + source.slice(end);
	source = replaceOnce(source, 'checks.tests = await runAllTests();', 'checks.tests = await runAllTests(undefined, rootDir);');
	return source;
}

module.exports = { backportProjectValidator };
