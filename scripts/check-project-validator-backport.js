const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const { backportProjectValidator } = require('./backport-project-validator');

async function checkBackport(validatorPath, { installed = false } = {}) {
	const filename = path.resolve(validatorPath);
	const original = fs.readFileSync(filename, 'utf8');
	const patched = installed ? original : backportProjectValidator(original);
	const loaded = new Module(filename, module);
	loaded.filename = filename;
	loaded.paths = Module._nodeModulePaths(path.dirname(filename));
	const nativeRequire = loaded.require.bind(loaded);
	loaded.require = name => !installed && name === '../project-test-runner' ? require('../lib/project-test-runner') : nativeRequire(name);
	loaded._compile(patched, filename);
	const { runAllTests } = loaded.exports;
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-beta4-backport-'));
	try {
		fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ packageManager: 'npm@11.0.0', scripts: { test: 'node "child suite.cjs"' } }));
		fs.writeFileSync(path.join(root, 'child suite.cjs'), 'console.log("# tests 2\\n# pass 2\\n# fail 0"); console.error("ℹ tests 3\\nℹ pass 3\\nℹ fail 0")');
		let calls = 0;
		const selection = await runAllTests((command, args, options) => {
			assert.equal(command, 'npm');
			assert.deepEqual(args, ['run', 'test']);
			assert.equal(options.cwd, root);
			calls += 1;
			return 'Tests  2 passed (2)';
		}, root);
		assert.equal(calls, 1);
		assert.equal(selection.success, true);
		const passing = await runAllTests(undefined, root);
		assert.equal(passing.success, true);
		assert.equal(passing.total, 5);
		assert.equal(passing.passed, 5);
		fs.writeFileSync(path.join(root, 'child suite.cjs'), 'console.error("# tests 2\\n# pass 2\\n# fail 0"); process.exitCode=7');
		const failing = await runAllTests(undefined, root);
		assert.equal(failing.success, false);
		assert.equal(failing.passed, 2);
		assert.ok(failing.failed > 0);
		const childNotFound = await runAllTests(() => { const error = new Error('child module not found'); error.status = 1; throw error; }, root);
		assert.equal(childNotFound.success, false);
		assert.notEqual(childNotFound.skipped, true);
		const zero = await runAllTests(() => '# tests 0\n# pass 0\n# fail 0', root);
		assert.equal(zero.testsFound, false);
		assert.equal(zero.skipped, true);
		const errors = await runAllTests(() => '0 pass\n0 fail\n1 error\nRan 0 tests', root);
		assert.equal(errors.success, false);
		assert.notEqual(errors.skipped, true);
		assert.equal(fs.readFileSync(filename, 'utf8'), original);
		console.log(`Beta4 ${installed ? 'installed validator' : 'backport in memory'} verified: selection, cwd, quoting, both streams, child failures, zero tests; source unchanged by this check.`);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
}

if (require.main === module) {
	checkBackport(process.argv[2], { installed: process.argv.includes('--installed') })
		.catch(error => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { checkBackport };
