// forge-test-resource: exclusive
'use strict';

const { describe, expect, test } = require('bun:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const releaseCommand = require('../lib/commands/release');
const { secureExecFileSync } = require('../lib/shell-utils');
const protectedStateAuthority = require('../lib/protected-state-authority');
const { hashProtectedContent } = require('../lib/protected-state-surfaces');
const {
	NPM_PUBLISH_WORKFLOW_PATH,
	generateNpmPublishWorkflow,
	renderNpmPublishWorkflow,
} = require('../lib/npm-publish-workflow');
const {
	BUN_WORKFLOW_SPECS,
	readCompleteBunPinBatch,
	readPinnedBunVersion,
	renderBunWorkflowPin,
	updateBunWorkflowPins,
} = require('../lib/bun-workflow-pins');
const {
	TEST_WORKFLOW_PATH,
	TEST_WORKFLOW_TEMPLATE_PATH,
	renderTestWorkflow,
} = require('../lib/test-workflow');
const { SIZE_WORKFLOW_PATH, renderSizeWorkflow } = require('../lib/size-workflow');

const TEST_HEAD = 'a'.repeat(40);
const repoRoot = path.resolve(__dirname, '..');

function fixtureContent(spec, version = '1.3.12') {
	if (spec.path.endsWith('build-binary.yml')) {
		return `name: Build\n\nenv:\n  BUN_VERSION: ${version}\n`;
	}
	return Array.from({ length: spec.count }, (_, index) => (
		`      - name: Setup ${index + 1}\n        with:\n          bun-version: ${version}\n`
	)).join('');
}

function createFixture() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-pins-'));
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ packageManager: 'bun@1.4.2' }));
	for (const spec of BUN_WORKFLOW_SPECS) {
		const fullPath = path.join(root, spec.path);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, fixtureContent(spec));
	}
	const npmPath = path.join(root, NPM_PUBLISH_WORKFLOW_PATH);
	fs.mkdirSync(path.dirname(npmPath), { recursive: true });
	fs.writeFileSync(npmPath, renderNpmPublishWorkflow('1.3.12'));
	const testTemplate = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
	fs.mkdirSync(path.dirname(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), { recursive: true });
	fs.writeFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), testTemplate);
	fs.writeFileSync(path.join(root, TEST_WORKFLOW_PATH), renderTestWorkflow(testTemplate, '1.3.12'));
	fs.writeFileSync(path.join(root, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.3.12'));
	return root;
}

function batchFixtureOptions() {
	return {
		readSourcePackageManifest: () => Buffer.from('{"packageManager":"bun@1.3.12"}'),
		readSourceNpmPublishWorkflow: () => Buffer.from(renderNpmPublishWorkflow('1.3.12')),
		readIndexedNpmPublishWorkflow: () => Buffer.from(renderNpmPublishWorkflow('1.3.12')),
		resolveTestWorkflowUpdate: projectRoot => {
			const template = fs.readFileSync(path.join(projectRoot, TEST_WORKFLOW_TEMPLATE_PATH));
			return {
				path: TEST_WORKFLOW_PATH,
				version: '1.4.2',
				baseline: renderTestWorkflow(template, '1.3.12'),
				content: renderTestWorkflow(template, '1.4.2'),
				indexedWorkflow: renderTestWorkflow(template, '1.4.2'),
				snapshot: { existed: true, content: fs.readFileSync(path.join(projectRoot, TEST_WORKFLOW_PATH)) },
			};
		},
		generateTestWorkflow: async projectRoot => {
			const update = batchFixtureOptions().resolveTestWorkflowUpdate(projectRoot);
			fs.writeFileSync(path.join(projectRoot, TEST_WORKFLOW_PATH), update.content);
			return { success: true, path: TEST_WORKFLOW_PATH };
		},
		resolveSizeWorkflowUpdate: projectRoot => ({
			path: SIZE_WORKFLOW_PATH,
			version: '1.4.2',
			baseline: renderSizeWorkflow('1.3.12'),
			content: renderSizeWorkflow('1.4.2'),
			indexedWorkflow: renderSizeWorkflow('1.3.12'),
			snapshot: { existed: true, content: fs.readFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH)) },
		}),
		generateSizeWorkflow: async projectRoot => {
			fs.writeFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.4.2'));
			return { success: true, path: SIZE_WORKFLOW_PATH };
		},
	};
}

function createSameVersionProjectionFixture({ includeTemplate = true } = {}) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-test-workflow-projection-'));
	const run = (args, options = {}) => spawnSync('git', args, { cwd: root, encoding: 'utf8', ...options });
	expect(run(['init']).status).toBe(0);
	expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
	expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
	fs.writeFileSync(path.join(root, 'package.json'), '{"name":"forge-workflow","packageManager":"bun@1.4.2"}');
	const template = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
	if (includeTemplate) {
		fs.mkdirSync(path.dirname(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), { recursive: true });
		fs.mkdirSync(path.dirname(path.join(root, TEST_WORKFLOW_PATH)), { recursive: true });
		fs.writeFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), template);
		fs.writeFileSync(path.join(root, TEST_WORKFLOW_PATH), renderTestWorkflow(template, '1.4.2'));
	}
	expect(run(['add', '.']).status).toBe(0);
	expect(run(['commit', '-m', 'base']).status).toBe(0);
	return { root, run, template };
}

describe('Forge-owned Bun workflow pins', () => {
	test('derives one exact stable Bun version and rewrites only allowlisted pin fields', () => {
		expect(readPinnedBunVersion('{"packageManager":"bun@1.4.2"}')).toBe('1.4.2');
		expect(() => readPinnedBunVersion('{"packageManager":"bun@latest"}')).toThrow('exact stable');
		expect(BUN_WORKFLOW_SPECS).toHaveLength(7);
		expect(BUN_WORKFLOW_SPECS).toContainEqual({ path: '.github/workflows/pr-title.yml', key: 'bun-version', count: 1 });
		expect(BUN_WORKFLOW_SPECS.every(Object.isFrozen)).toBe(true);
		expect(BUN_WORKFLOW_SPECS.some(spec => spec.path.endsWith('npm-publish.yml'))).toBe(false);
		expect(BUN_WORKFLOW_SPECS.some(spec => spec.path.endsWith('test.yml'))).toBe(false);
		expect(BUN_WORKFLOW_SPECS.some(spec => spec.path.endsWith('size-check.yml'))).toBe(false);

		for (const spec of BUN_WORKFLOW_SPECS) {
			const source = fixtureContent(spec);
			const rendered = renderBunWorkflowPin(spec.path, source, '1.4.2');
			expect(rendered.replaceAll('1.4.2', '1.3.12')).toBe(source);
			expect(rendered.match(/1\.4\.2/g)).toHaveLength(spec.count);
		}

		expect(() => renderBunWorkflowPin('.github/workflows/other.yml', 'bun-version: 1.3.12\n', '1.4.2'))
			.toThrow('allowlisted');
		expect(() => renderBunWorkflowPin(BUN_WORKFLOW_SPECS[0].path, 'name: no pin\n', '1.4.2'))
			.toThrow('exactly 1');
	});

	test('reads the complete source and index Bun pin snapshot in four Git calls', () => {
		const root = createFixture();
		const run = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
		try {
			expect(run(['init']).status).toBe(0);
			expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
			expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
			expect(run(['add', '.']).status).toBe(0);
			expect(run(['commit', '-m', 'base']).status).toBe(0);
			const sourceHead = run(['rev-parse', 'HEAD']).stdout.trim();
			const gitCalls = [];
			const snapshot = readCompleteBunPinBatch(root, sourceHead, [NPM_PUBLISH_WORKFLOW_PATH],
				(command, args, options) => {
					gitCalls.push(args);
					return secureExecFileSync(command, args, options);
				});

			expect(gitCalls).toHaveLength(4);
			expect(snapshot.source.get('package.json')).toEqual(fs.readFileSync(path.join(root, 'package.json')));
			expect(snapshot.source.size).toBe(1 + BUN_WORKFLOW_SPECS.length);
			expect(snapshot.indexed.size).toBe(2 + BUN_WORKFLOW_SPECS.length);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('checks only the test workflow projection when the staged Bun pin is unchanged', async () => {
		const packageManifest = Buffer.from('{"name":"forge-workflow","packageManager":"bun@1.4.2"}');
		let batchReads = 0;
		let projectionReads = 0;
		const result = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites('C:\\fixture', [], {
			sourceHead: TEST_HEAD,
			readSourcePackageManifest: () => packageManifest,
			readIndexedPackageManifest: () => packageManifest,
			readTestWorkflowProjection: () => {
				projectionReads += 1;
				return {
					sourcePackage: packageManifest,
					indexedPackage: packageManifest,
					sourceTemplate: null,
					indexedTemplate: null,
					indexedWorkflow: null,
				};
			},
			readCompleteBunPinBatch: () => {
				batchReads += 1;
				throw new Error('workflow snapshot should not be read');
			},
		});

		expect(result).toEqual({ success: true, decisions: [] });
		expect(batchReads).toBe(0);
		expect(projectionReads).toBe(1);
	});

	test('does not load the npm workflow before detecting an unchanged staged Bun pin', () => {
		const authorityPath = path.join(repoRoot, 'lib', 'protected-state-authority.js');
		const npmWorkflowPath = path.join(repoRoot, 'lib', 'npm-publish-workflow.js');
		const script = `
			const Module = require('node:module');
			const authorityPath = process.argv[1];
			const npmWorkflowPath = process.argv[2];
			const originalLoad = Module._load;
			let invalidManifestReads = 0;
			Module._load = function(request, parent, isMain) {
				if (request === '../package.json' && parent?.filename === npmWorkflowPath) {
					invalidManifestReads += 1;
					return { packageManager: 'bun@latest' };
				}
				return originalLoad.call(this, request, parent, isMain);
			};
			(async () => {
				const authority = require(authorityPath);
				const manifest = version => Buffer.from(JSON.stringify({
					name: 'forge-workflow',
					packageManager: 'bun@' + version,
				}));
				const unchanged = await authority.authorizeAndConsumeProtectedStateWrites('C:\\\\fixture', [], {
					sourceHead: '${TEST_HEAD}',
					readSourcePackageManifest: () => manifest('1.4.2'),
					readIndexedPackageManifest: () => manifest('1.4.2'),
					readTestWorkflowProjection: () => ({
						sourcePackage: manifest('1.4.2'),
						indexedPackage: manifest('1.4.2'),
						sourceTemplate: null,
						indexedTemplate: null,
						indexedWorkflow: null,
					}),
				});
				const readsAfterUnchanged = invalidManifestReads;
				const changed = await authority.authorizeAndConsumeProtectedStateWrites('C:\\\\fixture', [], {
					sourceHead: '${TEST_HEAD}',
					readSourcePackageManifest: () => manifest('1.3.12'),
					readIndexedPackageManifest: () => manifest('1.4.2'),
				});
				process.stdout.write(JSON.stringify({ unchanged, readsAfterUnchanged, changed, invalidManifestReads }));
			})().catch(error => {
				process.stderr.write(error.stack || error.message);
				process.exitCode = 1;
			});
		`;
		const isolated = spawnSync('node', ['-e', script, authorityPath, npmWorkflowPath], {
			cwd: repoRoot,
			encoding: 'utf8',
		});

		expect(isolated.status, isolated.stderr).toBe(0);
		const result = JSON.parse(isolated.stdout);
		expect(result.unchanged).toEqual({ success: true, decisions: [] });
		expect(result.readsAfterUnchanged).toBe(0);
		expect(result.changed).toMatchObject({
			success: false,
			batchDecision: { reason: expect.stringContaining('package.json must pin an exact stable Bun version') },
		});
		expect(result.invalidManifestReads).toBe(1);
	});

	test('updates pin-only workflows and delegates both full workflow renderers', async () => {
		const root = createFixture();
		const issued = [];
		const completed = [];
		let npmCalls = 0;
		let testCalls = 0;
		let sizeCalls = 0;
		try {
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				env: {
					FORGE_PROTECTED_STATE_ACTOR: 'protected-state-actor',
					FORGE_ACTOR: 'forge-actor',
					USER: 'user-actor',
					USERNAME: 'username-actor',
				},
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async (_root, params, authorizationOptions) => {
					issued.push(params);
					return { success: true, capabilityId: authorizationOptions.capabilityId };
				},
				completeAuthorization: async (_root, params) => {
					completed.push(params.path);
					return { success: true };
				},
				writeProtectedFile: (projectRoot, workflowPath, content, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					expect(fs.readFileSync(fullPath)).toEqual(options.expectedContent);
					fs.writeFileSync(fullPath, content);
					return { allowed: true, contentHash: `hash-${workflowPath}` };
				},
				recordProtectedStateAuditEvent: () => ({ success: true }),
				generateNpmPublishWorkflow: async (_root, options) => {
					npmCalls += 1;
					expect(options.actor).toBe('protected-state-actor');
					expect(options.expectedHead).toBe(TEST_HEAD);
					return { success: true, path: '.github/workflows/npm-publish.yml' };
				},
				generateTestWorkflow: async (projectRoot, options) => {
					testCalls += 1;
					expect(options.actor).toBe('protected-state-actor');
					expect(options.expectedHead).toBe(TEST_HEAD);
					const update = batchFixtureOptions().resolveTestWorkflowUpdate(projectRoot);
					expect(options.expectedUpdate).toEqual({ version: update.version, content: update.content });
					fs.writeFileSync(path.join(projectRoot, TEST_WORKFLOW_PATH), update.content);
					return { success: true, path: TEST_WORKFLOW_PATH };
				},
				generateSizeWorkflow: async (projectRoot, options) => {
					sizeCalls += 1;
					expect(options.actor).toBe('protected-state-actor');
					expect(options.expectedHead).toBe(TEST_HEAD);
					expect(options.expectedUpdate).toEqual({ version: '1.4.2', content: renderSizeWorkflow('1.4.2') });
					fs.writeFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.4.2'));
					return { success: true, path: SIZE_WORKFLOW_PATH };
				},
			});

			expect(result.success).toBe(true);
			expect(sizeCalls).toBe(1);
			expect(result.paths).toContain(SIZE_WORKFLOW_PATH);
			expect(fs.readFileSync(path.join(root, SIZE_WORKFLOW_PATH))).toEqual(renderSizeWorkflow('1.4.2'));
			expect(issued.map(record => record.path)).toEqual(BUN_WORKFLOW_SPECS.map(spec => spec.path));
			expect(issued.every(record => record.actor === 'protected-state-actor')).toBe(true);
			expect(completed).toEqual(issued.map(record => record.path));
			expect(npmCalls).toBe(1);
			expect(testCalls).toBe(1);
			for (const spec of BUN_WORKFLOW_SPECS) {
				expect(fs.readFileSync(path.join(root, spec.path), 'utf8')).toContain('1.4.2');
			}
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH), 'utf8')).toContain('1.4.2');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('fails before authority or writes when a workflow has unrelated local edits', async () => {
		const root = createFixture();
		let authorityCalls = 0;
		try {
			fs.appendFileSync(path.join(root, BUN_WORKFLOW_SPECS[0].path), '# unrelated\n');
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async () => {
					authorityCalls += 1;
					return { success: true };
				},
			});

			expect(result.success).toBe(false);
			expect(result.error).toContain('unrelated local edits');
			expect(authorityCalls).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('rejects pre-existing npm workflow edits before issuing any batch authority', async () => {
		for (const staged of [false, true]) {
			const root = createFixture();
			let authorityCalls = 0;
			try {
				if (!staged) fs.appendFileSync(path.join(root, NPM_PUBLISH_WORKFLOW_PATH), '# unrelated\n');
				const result = await updateBunWorkflowPins(root, {
					...batchFixtureOptions(),
					expectedHead: TEST_HEAD,
					resolveHead: () => TEST_HEAD,
					readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
					readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
						BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
					)),
					readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
						BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
					)),
					...(staged ? { readIndexedNpmPublishWorkflow: () => Buffer.from('name: unrelated staged npm workflow\n') } : {}),
					issueAuthorization: async () => {
						authorityCalls += 1;
						return { success: true };
					},
				});

				expect(result).toMatchObject({ success: false });
				expect(result.error).toContain(staged ? 'unrelated staged edits' : 'unrelated local edits');
				expect(authorityCalls).toBe(0);
				for (const spec of BUN_WORKFLOW_SPECS) {
					expect(fs.readFileSync(path.join(root, spec.path), 'utf8')).toBe(fixtureContent(spec));
				}
			} finally {
				fs.rmSync(root, { recursive: true, force: true });
			}
		}
	});

	test('fails before authority or writes when the working Bun pin differs from the index', async () => {
		const root = createFixture();
		let authorityCalls = 0;
		try {
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => Buffer.from('{"packageManager":"bun@1.3.12"}'),
				issueAuthorization: async () => {
					authorityCalls += 1;
					return { success: true };
				},
			});

			expect(result).toMatchObject({ success: false });
			expect(result.error).toContain('differs from the Git index');
			expect(authorityCalls).toBe(0);
			for (const spec of BUN_WORKFLOW_SPECS) {
				expect(fs.readFileSync(path.join(root, spec.path), 'utf8')).toBe(fixtureContent(spec));
			}
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('restores the compare-and-swap snapshot when completion fails', async () => {
		const root = createFixture();
		const first = BUN_WORKFLOW_SPECS[0];
		try {
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async (_root, _params, authorizationOptions) => ({ success: true, capabilityId: authorizationOptions.capabilityId }),
				completeAuthorization: async () => ({ success: false, error: 'injected completion failure' }),
				cancelAuthorizations: async (_root, records) => ({ success: true, results: records.map(record => ({ ...record, success: true })) }),
				writeProtectedFile: (projectRoot, workflowPath, content, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
						return { allowed: false, reason: 'compare-and-swap mismatch' };
					}
					fs.writeFileSync(fullPath, content);
					return { allowed: true, contentHash: 'hash' };
				},
				recordProtectedStateAuditEvent: () => ({ success: true }),
			});

			expect(result).toMatchObject({ success: false, recovery: { allowed: true } });
			expect(fs.readFileSync(path.join(root, first.path), 'utf8')).toBe(fixtureContent(first));
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('restores every earlier workflow for each post-preflight failure path', async () => {
		const scenarios = [
			'authorization failure',
			'authorization throw',
			'write denied',
			'write throw after mutation',
			'audit failure',
			'audit throw',
			'completion failure',
			'completion throw',
			'npm failure',
			'npm throw',
			'test workflow failure',
			'test workflow throw',
			'size workflow failure',
			'size workflow throw',
		];

		for (const scenario of scenarios) {
			const root = createFixture();
			let authorizationCalls = 0;
			let writeCalls = 0;
			let auditCalls = 0;
			let completionCalls = 0;
			try {
				const result = await updateBunWorkflowPins(root, {
					...batchFixtureOptions(),
					expectedHead: TEST_HEAD,
					resolveHead: () => TEST_HEAD,
					readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
					readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
						BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
					)),
					readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
						BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
					)),
					issueAuthorization: async (_root, _params, authorizationOptions) => {
						const call = authorizationCalls++;
						if (call === 1 && scenario === 'authorization throw') throw new Error('authorization throw');
						if (call === 1 && scenario === 'authorization failure') return { success: false, error: 'authorization failure' };
						return { success: true, capabilityId: authorizationOptions.capabilityId };
					},
					completeAuthorization: async () => {
						const call = completionCalls++;
						if (call === 1 && scenario === 'completion throw') throw new Error('completion throw');
						if (call === 1 && scenario === 'completion failure') return { success: false, error: 'completion failure' };
						return { success: true };
					},
					writeProtectedFile: (projectRoot, workflowPath, content, options) => {
						const fullPath = path.join(projectRoot, workflowPath);
						if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
							return { allowed: false, reason: 'compare-and-swap mismatch' };
						}
						if (options.operation === 'update_bun_workflow_pin') {
							const call = writeCalls++;
							if (call === 1 && scenario === 'write denied') return { allowed: false, reason: 'write denied' };
							fs.writeFileSync(fullPath, content);
							if (call === 1 && scenario === 'write throw after mutation') throw new Error('write throw after mutation');
						} else {
							fs.writeFileSync(fullPath, content);
						}
						return { allowed: true, contentHash: 'hash' };
					},
					removeProtectedFile: (projectRoot, workflowPath, options) => {
						const fullPath = path.join(projectRoot, workflowPath);
						if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
							return { allowed: false, reason: 'compare-and-swap mismatch' };
						}
						fs.rmSync(fullPath);
						return { allowed: true };
					},
					recordProtectedStateAuditEvent: () => {
						const call = auditCalls++;
						if (call === 1 && scenario === 'audit throw') throw new Error('audit throw');
						if (call === 1 && scenario === 'audit failure') return { success: false, error: 'audit failure' };
						return { success: true };
					},
					cancelAuthorizations: async (_root, records) => ({ success: true, results: records.map(record => ({ ...record, success: true })) }),
					generateNpmPublishWorkflow: async () => {
						if (scenario === 'npm throw') throw new Error('npm throw');
						if (scenario === 'npm failure') return { success: false, error: 'npm failure' };
						return { success: true, path: NPM_PUBLISH_WORKFLOW_PATH };
					},
					generateTestWorkflow: async projectRoot => {
						const update = batchFixtureOptions().resolveTestWorkflowUpdate(projectRoot);
						fs.writeFileSync(path.join(projectRoot, TEST_WORKFLOW_PATH), update.content);
						if (scenario === 'test workflow throw') throw new Error('test workflow throw');
						if (scenario === 'test workflow failure') return { success: false, error: 'test workflow failure' };
						return { success: true, path: TEST_WORKFLOW_PATH };
					},
					generateSizeWorkflow: async projectRoot => {
						fs.writeFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.4.2'));
						if (scenario === 'size workflow throw') throw new Error('size workflow throw');
						if (scenario === 'size workflow failure') return { success: false, error: 'size workflow failure' };
						return { success: true, path: SIZE_WORKFLOW_PATH };
					},
				});

				expect(result.success, scenario).toBe(false);
				expect(result.recovery.allowed, scenario).toBe(true);
				for (const spec of BUN_WORKFLOW_SPECS) {
					expect(fs.readFileSync(path.join(root, spec.path), 'utf8'), scenario).toBe(fixtureContent(spec));
				}
				expect(fs.readFileSync(path.join(root, NPM_PUBLISH_WORKFLOW_PATH), 'utf8'), scenario)
					.toBe(renderNpmPublishWorkflow('1.3.12'));
				expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH), 'utf8'), scenario)
					.toBe(renderTestWorkflow(fs.readFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), '1.3.12').toString());
				expect(fs.readFileSync(path.join(root, SIZE_WORKFLOW_PATH), 'utf8'), scenario)
					.toBe(renderSizeWorkflow('1.3.12').toString());
			} finally {
				fs.rmSync(root, { recursive: true, force: true });
			}
		}
	});

	test('removes a partially generated npm workflow and continues after a recovery failure', async () => {
		const root = createFixture();
		const first = BUN_WORKFLOW_SPECS[0];
		const second = BUN_WORKFLOW_SPECS[1];
		try {
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async (_root, _params, authorizationOptions) => ({ success: true, capabilityId: authorizationOptions.capabilityId }),
				completeAuthorization: async () => ({ success: true }),
				cancelAuthorizations: async (_root, records) => ({ success: true, results: records.map(record => ({ ...record, success: true })) }),
				writeProtectedFile: (projectRoot, workflowPath, content, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					if (options.operation === 'recover_bun_workflow_pin' && workflowPath === second.path) {
						throw new Error('injected recovery failure');
					}
					if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
						return { allowed: false, reason: 'compare-and-swap mismatch' };
					}
					fs.writeFileSync(fullPath, content);
					return { allowed: true, contentHash: 'hash' };
				},
				removeProtectedFile: (projectRoot, workflowPath, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					expect(fs.readFileSync(fullPath)).toEqual(Buffer.from(options.expectedContent));
					fs.rmSync(fullPath);
					return { allowed: true };
				},
				recordProtectedStateAuditEvent: () => ({ success: true }),
				generateNpmPublishWorkflow: async projectRoot => {
					const npmPath = path.join(projectRoot, NPM_PUBLISH_WORKFLOW_PATH);
					fs.mkdirSync(path.dirname(npmPath), { recursive: true });
					fs.writeFileSync(npmPath, renderNpmPublishWorkflow('1.4.2'));
					throw new Error('npm failed after write');
				},
			});

			expect(result).toMatchObject({ success: false, error: 'npm failed after write', recovery: { allowed: false } });
			expect(fs.readFileSync(path.join(root, NPM_PUBLISH_WORKFLOW_PATH), 'utf8')).toBe(renderNpmPublishWorkflow('1.3.12'));
			expect(fs.readFileSync(path.join(root, first.path), 'utf8')).toBe(fixtureContent(first));
			expect(fs.readFileSync(path.join(root, second.path), 'utf8')).toContain('1.4.2');
			expect(result.recovery.files.find(file => file.path === second.path).reason).toBe('injected recovery failure');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('preserves an npm workflow changed after batch preflight and restores earlier writes', async () => {
		const root = createFixture();
		const npmPath = path.join(root, NPM_PUBLISH_WORKFLOW_PATH);
		const originalNpm = Buffer.from(renderNpmPublishWorkflow('1.3.12'));
		const concurrentNpm = Buffer.from('name: concurrent npm workflow\n');
		fs.mkdirSync(path.dirname(npmPath), { recursive: true });
		fs.writeFileSync(npmPath, originalNpm);
		try {
			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				expectedHead: TEST_HEAD,
				resolveHead: () => TEST_HEAD,
				readIndexedPackageManifest: () => fs.readFileSync(path.join(root, 'package.json')),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async (_root, _params, authorizationOptions) => ({ success: true, capabilityId: authorizationOptions.capabilityId }),
				completeAuthorization: async () => ({ success: true }),
				cancelAuthorizations: async (_root, records) => ({ success: true, results: records.map(record => ({ ...record, success: true })) }),
				writeProtectedFile: (projectRoot, workflowPath, content, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
						return { allowed: false, reason: 'compare-and-swap mismatch' };
					}
					fs.writeFileSync(fullPath, content);
					return { allowed: true, contentHash: 'hash' };
				},
				recordProtectedStateAuditEvent: () => ({ success: true }),
				generateNpmPublishWorkflow: async (projectRoot, options) => {
					fs.writeFileSync(npmPath, concurrentNpm);
					return generateNpmPublishWorkflow(projectRoot, {
						...options,
						prepareNpmPublishWorkflowAuthorization: async () => {
							throw new Error('authority must not run after snapshot drift');
						},
					});
				},
			});

			expect(result.success).toBe(false);
			expect(result.error).toContain('changed after Bun pin batch preflight');
			expect(result.recovery.allowed).toBe(false);
			expect(fs.readFileSync(npmPath)).toEqual(concurrentNpm);
			for (const spec of BUN_WORKFLOW_SPECS) {
				expect(fs.readFileSync(path.join(root, spec.path), 'utf8')).toBe(fixtureContent(spec));
			}
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('rejects staged package drift during npm generation and restores earlier batch writes', async () => {
		const root = createFixture();
		const run = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
		try {
			expect(run(['init']).status).toBe(0);
			expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
			expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
			fs.writeFileSync(path.join(root, 'package.json'), '{"packageManager":"bun@1.3.12"}');
			expect(run(['add', '.']).status).toBe(0);
			expect(run(['commit', '-m', 'base']).status).toBe(0);
			const sourceHead = run(['rev-parse', 'HEAD']).stdout.trim();
			fs.writeFileSync(path.join(root, 'package.json'), '{"packageManager":"bun@1.4.2"}');
			expect(run(['add', 'package.json']).status).toBe(0);

			const result = await updateBunWorkflowPins(root, {
				...batchFixtureOptions(),
				generateTestWorkflow: undefined,
				expectedHead: sourceHead,
				resolveHead: () => sourceHead,
				readIndexedPackageManifest: () => Buffer.from(run(['show', ':package.json']).stdout),
				readSourceWorkflow: (_root, _head, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				readIndexedWorkflow: (_root, workflowPath) => Buffer.from(fixtureContent(
					BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath),
				)),
				issueAuthorization: async (_root, _params, authorizationOptions) => ({
					success: true,
					capabilityId: authorizationOptions.capabilityId,
				}),
				completeAuthorization: async () => ({ success: true }),
				cancelAuthorizations: async (_root, records) => ({
					success: true,
					results: records.map(record => ({ ...record, success: true })),
				}),
				writeProtectedFile: (projectRoot, workflowPath, content, options) => {
					const fullPath = path.join(projectRoot, workflowPath);
					if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
						return { allowed: false, reason: 'compare-and-swap mismatch' };
					}
					fs.writeFileSync(fullPath, content);
					return { allowed: true, contentHash: 'hash' };
				},
				recordProtectedStateAuditEvent: () => ({ success: true }),
				generateNpmPublishWorkflow: async () => {
					fs.writeFileSync(path.join(root, 'package.json'), '{"packageManager":"bun@1.4.3"}');
					expect(run(['add', 'package.json']).status).toBe(0);
					return { success: true, path: NPM_PUBLISH_WORKFLOW_PATH };
				},
			});

			expect(result).toMatchObject({ success: false, recovery: { allowed: true } });
			expect(result.error).toContain('changed after Bun pin batch preflight');
			for (const spec of BUN_WORKFLOW_SPECS) {
				expect(fs.readFileSync(path.join(root, spec.path), 'utf8')).toBe(fixtureContent(spec));
			}
			expect(fs.readFileSync(path.join(root, NPM_PUBLISH_WORKFLOW_PATH), 'utf8'))
				.toBe(renderNpmPublishWorkflow('1.3.12'));
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH), 'utf8'))
				.toBe(renderTestWorkflow(fs.readFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), '1.3.12').toString());
			expect(run(['show', ':package.json']).stdout).toContain('bun@1.4.3');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 20_000);

	test('release exposes the single-shot command without replacing issue release behavior', async () => {
		let called;
		const result = await releaseCommand.handler(
			['update-bun-pins', '--expect-head', TEST_HEAD],
			{},
			'C:/repo',
			{
				updateBunWorkflowPins: async (root, options) => {
					called = { root, options };
					return { success: true, version: '1.4.2', paths: BUN_WORKFLOW_SPECS.map(spec => spec.path) };
				},
			},
		);

		expect(result.success).toBe(true);
		expect(called.root).toBe('C:/repo');
		expect(called.options.expectedHead).toBe(TEST_HEAD);
		expect(result.output).toContain('Bun 1.4.2');
	});

	test('the hook authority accepts only exact command-owned Bun workflow evidence', async () => {
		const workflowPath = BUN_WORKFLOW_SPECS[0].path;
		const content = renderBunWorkflowPin(workflowPath, fixtureContent(BUN_WORKFLOW_SPECS[0]), '1.4.2');
		const worktreeScope = 'bun-pin-scope';
		const capabilityId = 'bun-pin-capability';
		const event = (eventType, operation) => ({
			entity_type: 'protected_state',
			entity_id: protectedStateAuthority.authorizationEntityId(worktreeScope, workflowPath),
			event_type: eventType,
			actor: 'bun-pin-test',
			origin: 'cli',
			created_at: '2026-09-09T00:00:00.000Z',
			payload_json: JSON.stringify({
				version: 1,
				capabilityId,
				actor: 'bun-pin-test',
				path: workflowPath,
				surface: 'workflows',
				contentHash: hashProtectedContent(content),
				sourceHead: TEST_HEAD,
				worktreeScope,
				writeIntent: 'update',
				targetBunVersion: '1.4.2',
				operation,
				viaForgeApi: true,
				sourceCommand: 'forge release update-bun-pins',
			}),
		});
		const rows = [
			event(protectedStateAuthority.PROTECTED_STATE_AUTHORIZATION_ISSUED, 'update_bun_workflow_pin'),
			event(protectedStateAuthority.PROTECTED_STATE_WRITE_COMPLETED, 'update_bun_workflow_pin_completed'),
		];

		expect(protectedStateAuthority.evaluateAuthorization({
			actor: 'bun-pin-test',
			path: workflowPath,
			surface: 'workflows',
			content,
			sourceHead: TEST_HEAD,
			worktreeScope,
		}, rows)).toMatchObject({ allowed: true, capabilityId });
		const stagedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-hook-target-'));
		try {
			const run = args => spawnSync('git', args, { cwd: stagedRoot, encoding: 'utf8' });
			expect(run(['init']).status).toBe(0);
			fs.writeFileSync(path.join(stagedRoot, 'package.json'), '{"packageManager":"bun@1.4.3"}');
			expect(run(['add', 'package.json']).status).toBe(0);
			const hook = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(stagedRoot, [{
				actor: 'bun-pin-test',
				path: workflowPath,
				surface: 'workflows',
				content,
				sourceHead: TEST_HEAD,
			}], {
				worktreeScope,
				validateCompleteBunPinBatch: () => ({ success: true }),
				deps: {
					kernelBroker: { config: {} },
					kernelDriver: {
						listKernelEvents: async () => rows,
						insertKernelEvent: async () => {
							throw new Error('changed target must be rejected before consumption');
						},
					},
				},
			});
			expect(hook).toMatchObject({ success: false });
			expect(hook.decisions[0].reason).toContain('changed after workflow generation');
		} finally {
			fs.rmSync(stagedRoot, { recursive: true, force: true });
		}
		const kernelRows = [...rows];
		const cancellation = await protectedStateAuthority.cancelBunWorkflowBatchAuthorizations('C:/repo', [{
			actor: 'bun-pin-test',
			path: workflowPath,
			sourceHead: TEST_HEAD,
			capabilityId,
		}], {
			worktreeScope,
			deps: {
				kernelBroker: { config: {} },
				kernelDriver: {
					listKernelEvents: async () => kernelRows,
					insertKernelEvent: async event => {
						kernelRows.push(event);
						return event;
					},
				},
			},
		});
		expect(cancellation).toMatchObject({ success: true });
		expect(protectedStateAuthority.evaluateAuthorization({
			actor: 'bun-pin-test',
			path: workflowPath,
			surface: 'workflows',
			content,
			sourceHead: TEST_HEAD,
			worktreeScope,
		}, kernelRows)).toMatchObject({ allowed: false });
		expect(protectedStateAuthority.evaluateAuthorization({
			actor: 'bun-pin-test',
			path: '.github/workflows/npm-publish.yml',
			surface: 'workflows',
			content,
			sourceHead: TEST_HEAD,
			worktreeScope,
		}, rows).allowed).toBe(false);

		const rejected = await protectedStateAuthority.issueBunWorkflowAuthorization('C:/repo', {
			actor: 'bun-pin-test',
			path: '.github/workflows/other.yml',
			sourceHead: TEST_HEAD,
		});
		expect(rejected).toMatchObject({ success: false });
	});

	test('the commit hook rejects a same-version template change without its exact generated workflow', async () => {
		const { root, run, template } = createSameVersionProjectionFixture();
		try {
			fs.appendFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), '# staged template change\n');
			expect(run(['add', TEST_WORKFLOW_TEMPLATE_PATH]).status).toBe(0);
			const sourceHead = run(['rev-parse', 'HEAD']).stdout.trim();
			const packageManifest = fs.readFileSync(path.join(root, 'package.json'));
			const indexedTemplate = fs.readFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH));
			const indexedWorkflow = fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH));
			const hook = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'protected-state-check.js')], {
				cwd: root,
				encoding: 'utf8',
				env: { ...process.env, FORGE_PROTECTED_STATE_ACTOR: 'test-workflow-template-batch' },
			});

			expect(hook.status).toBe(1);
			expect(`${hook.stdout}${hook.stderr}`).toContain(TEST_WORKFLOW_PATH);
			let kernelReads = 0;
			let kernelWrites = 0;
			let projectionReads = 0;
			const rejected = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, [{
				actor: 'test-workflow-template-batch',
				path: TEST_WORKFLOW_PATH,
				surface: 'workflows',
				content: indexedWorkflow,
				sourceHead,
			}], {
				sourceHead,
				readSourcePackageManifest: () => packageManifest,
				readIndexedPackageManifest: () => packageManifest,
				readTestWorkflowProjection: () => {
					projectionReads += 1;
					return {
						sourcePackage: packageManifest,
						indexedPackage: packageManifest,
						sourceTemplate: template,
						indexedTemplate,
						indexedWorkflow,
					};
				},
				deps: {
					kernelBroker: { config: {} },
					kernelDriver: {
						listKernelEvents: async () => { kernelReads += 1; return []; },
						insertKernelEvent: async () => { kernelWrites += 1; },
					},
				},
			});
			expect(rejected).toMatchObject({
				success: false,
				batchDecision: {
					reason: `${TEST_WORKFLOW_PATH} does not match the staged canonical template for Bun 1.4.2.`,
				},
			});
			expect(projectionReads).toBe(1);
			expect(kernelReads).toBe(0);
			expect(kernelWrites).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 15_000);

	test('accepts only complete same-version staged test workflow projections', async () => {
		const fixtures = [];
		try {
			const established = createSameVersionProjectionFixture();
			fixtures.push(established.root);
			expect(await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(established.root, []))
				.toEqual({ success: true, decisions: [] });
			fs.appendFileSync(path.join(established.root, TEST_WORKFLOW_TEMPLATE_PATH), '# unstaged only\n');
			expect(await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(established.root, []))
				.toEqual({ success: true, decisions: [] });
			expect(established.run(['rm', '--cached', TEST_WORKFLOW_TEMPLATE_PATH]).status).toBe(0);
			const deletedTemplate = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(established.root, []);
			expect(deletedTemplate).toMatchObject({ success: false });
			expect(deletedTemplate.batchDecision.reason).toContain(TEST_WORKFLOW_TEMPLATE_PATH);

			const legacy = createSameVersionProjectionFixture({ includeTemplate: false });
			fixtures.push(legacy.root);
			expect(await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(legacy.root, []))
				.toEqual({ success: true, decisions: [] });

			fs.mkdirSync(path.dirname(path.join(legacy.root, TEST_WORKFLOW_TEMPLATE_PATH)), { recursive: true });
			fs.mkdirSync(path.dirname(path.join(legacy.root, TEST_WORKFLOW_PATH)), { recursive: true });
			fs.writeFileSync(path.join(legacy.root, TEST_WORKFLOW_TEMPLATE_PATH), legacy.template);
			fs.writeFileSync(path.join(legacy.root, TEST_WORKFLOW_PATH), renderTestWorkflow(legacy.template, '1.4.2'));
			expect(legacy.run(['add', TEST_WORKFLOW_TEMPLATE_PATH, TEST_WORKFLOW_PATH]).status).toBe(0);
			expect(await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(legacy.root, []))
				.toEqual({ success: true, decisions: [] });

			fs.appendFileSync(path.join(legacy.root, TEST_WORKFLOW_PATH), '# mismatched target\n');
			expect(legacy.run(['add', TEST_WORKFLOW_PATH]).status).toBe(0);
			const mismatchedBootstrap = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(legacy.root, []);
			expect(mismatchedBootstrap).toMatchObject({ success: false });
			expect(mismatchedBootstrap.batchDecision.reason).toContain(TEST_WORKFLOW_PATH);

			expect(legacy.run(['rm', '--cached', TEST_WORKFLOW_PATH]).status).toBe(0);
			const missingTarget = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(legacy.root, []);
			expect(missingTarget).toMatchObject({ success: false });
			expect(missingTarget.batchDecision.reason).toContain(TEST_WORKFLOW_PATH);
		} finally {
			for (const root of fixtures) fs.rmSync(root, { recursive: true, force: true });
		}
	}, 20_000);

	test('the commit boundary rejects incomplete Bun pin batches before consuming authority', async () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-complete-batch-'));
		const run = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
		try {
			expect(run(['init']).status).toBe(0);
			expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
			expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
			fs.writeFileSync(path.join(root, 'package.json'), '{"name":"forge-workflow","packageManager":"bun@1.3.12"}');
			for (const spec of BUN_WORKFLOW_SPECS) {
				const fullPath = path.join(root, spec.path);
				fs.mkdirSync(path.dirname(fullPath), { recursive: true });
				fs.writeFileSync(fullPath, fixtureContent(spec));
			}
			const npmPath = path.join(root, NPM_PUBLISH_WORKFLOW_PATH);
			fs.writeFileSync(npmPath, renderNpmPublishWorkflow('1.3.12'));
			const template = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
			fs.mkdirSync(path.dirname(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), { recursive: true });
			fs.writeFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), template);
			fs.writeFileSync(path.join(root, TEST_WORKFLOW_PATH), renderTestWorkflow(template, '1.3.12'));
			fs.writeFileSync(path.join(root, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.3.12'));
			expect(run(['add', '.']).status).toBe(0);
			expect(run(['commit', '-m', 'base']).status).toBe(0);
			const sourceHead = run(['rev-parse', 'HEAD']).stdout.trim();

			fs.writeFileSync(path.join(root, 'package.json'), '{"name":"forge-workflow","packageManager":"bun@1.4.2"}');
			expect(run(['add', 'package.json']).status).toBe(0);
			let kernelReads = 0;
			const blocked = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, [{
				actor: 'bun-pin-test',
				path: BUN_WORKFLOW_SPECS[0].path,
				surface: 'workflows',
				content: Buffer.from(fixtureContent(BUN_WORKFLOW_SPECS[0], '1.4.2')),
				sourceHead,
			}], {
				deps: {
					kernelBroker: { config: {} },
					kernelDriver: { listKernelEvents: async () => { kernelReads += 1; return []; } },
				},
			});
			expect(blocked).toMatchObject({ success: false });
			expect(blocked.batchDecision.reason).toContain(BUN_WORKFLOW_SPECS[0].path);
			expect(kernelReads).toBe(0);

			const hook = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'protected-state-check.js')], {
				cwd: root,
				encoding: 'utf8',
				env: { ...process.env, FORGE_PROTECTED_STATE_ACTOR: 'bun-pin-test' },
			});
			expect(hook.status).toBe(1);
			expect(`${hook.stdout}${hook.stderr}`).toContain('complete generated workflow set');

			for (const spec of BUN_WORKFLOW_SPECS) {
				fs.writeFileSync(path.join(root, spec.path), fixtureContent(spec, '1.4.2'));
			}
			expect(run(['add', ...BUN_WORKFLOW_SPECS.map(spec => spec.path)]).status).toBe(0);
			const withoutNpm = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, []);
			expect(withoutNpm).toMatchObject({ success: false });
			expect(withoutNpm.batchDecision.reason).toContain(NPM_PUBLISH_WORKFLOW_PATH);

			fs.writeFileSync(npmPath, renderNpmPublishWorkflow('1.4.2'));
			expect(run(['add', NPM_PUBLISH_WORKFLOW_PATH]).status).toBe(0);
			const withoutTest = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, []);
			expect(withoutTest).toMatchObject({ success: false });
			expect(withoutTest.batchDecision.reason).toContain(TEST_WORKFLOW_PATH);
			fs.writeFileSync(path.join(root, TEST_WORKFLOW_PATH), renderTestWorkflow(template, '1.4.2'));
			expect(run(['add', TEST_WORKFLOW_PATH]).status).toBe(0);
			const withoutSize = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, []);
			expect(withoutSize).toMatchObject({ success: false });
			expect(withoutSize.batchDecision.reason).toContain(SIZE_WORKFLOW_PATH);
			fs.writeFileSync(path.join(root, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.4.2'));
			expect(run(['add', SIZE_WORKFLOW_PATH]).status).toBe(0);
			expect(await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, []))
				.toEqual({ success: true, decisions: [] });

			const workflowPath = BUN_WORKFLOW_SPECS[0].path;
			const content = Buffer.from(fixtureContent(BUN_WORKFLOW_SPECS[0], '1.4.2'));
			const worktreeScope = 'complete-batch-race-scope';
			const capabilityId = 'complete-batch-race-capability';
			const event = (eventType, operation) => ({
				entity_type: 'protected_state',
				entity_id: protectedStateAuthority.authorizationEntityId(worktreeScope, workflowPath),
				event_type: eventType,
				actor: 'bun-pin-test',
				origin: 'cli',
				payload_json: JSON.stringify({
					version: 1,
					capabilityId,
					actor: 'bun-pin-test',
					path: workflowPath,
					surface: 'workflows',
					contentHash: hashProtectedContent(content),
					sourceHead,
					worktreeScope,
					writeIntent: 'update',
					targetBunVersion: '1.4.2',
					operation,
					viaForgeApi: true,
					sourceCommand: 'forge release update-bun-pins',
				}),
			});
			let consumed = 0;
			const raced = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, [{
				actor: 'bun-pin-test',
				path: workflowPath,
				surface: 'workflows',
				content,
				sourceHead,
			}], {
				worktreeScope,
				deps: {
					kernelBroker: { config: {} },
					kernelDriver: {
						listKernelEvents: async () => {
							fs.writeFileSync(path.join(root, workflowPath), fixtureContent(BUN_WORKFLOW_SPECS[0]));
							expect(run(['add', workflowPath]).status).toBe(0);
							return [
								event(protectedStateAuthority.PROTECTED_STATE_AUTHORIZATION_ISSUED, 'update_bun_workflow_pin'),
								event(protectedStateAuthority.PROTECTED_STATE_WRITE_COMPLETED, 'update_bun_workflow_pin_completed'),
							];
						},
						insertKernelEvent: async () => { consumed += 1; },
					},
				},
			});
			expect(raced).toMatchObject({ success: false });
			expect(raced.batchDecision.reason).toContain(workflowPath);
			expect(consumed).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('public authority cannot replace the immutable Git baseline through test seams', async () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-authority-'));
		try {
			const run = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
			expect(run(['init']).status).toBe(0);
			expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
			expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
			fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ packageManager: 'bun@1.4.2' }));
			expect(run(['add', 'package.json']).status).toBe(0);
			expect(run(['commit', '-m', 'base']).status).toBe(0);
			const head = run(['rev-parse', 'HEAD']).stdout.trim();
			const mismatchedNpmIssue = await protectedStateAuthority.issueNpmPublishWorkflowAuthorization(root, {
				actor: 'bun-pin-test',
				sourceHead: head,
				bunVersion: '1.3.12',
				targetBunVersion: '1.4.2',
			});
			const mismatchedNpmCompletion = await protectedStateAuthority.completeNpmPublishWorkflowAuthorization(root, {
				actor: 'bun-pin-test',
				sourceHead: head,
				capabilityId: 'mismatched-npm-capability',
				bunVersion: '1.3.12',
				targetBunVersion: '1.4.2',
			});
			expect(mismatchedNpmIssue).toMatchObject({ success: false });
			expect(mismatchedNpmCompletion).toMatchObject({ success: false });

			const result = await protectedStateAuthority.issueBunWorkflowAuthorization(root, {
				actor: 'bun-pin-test',
				path: BUN_WORKFLOW_SPECS[0].path,
				sourceHead: head,
				targetBunVersion: '1.4.2',
			}, {
				readSourceWorkflow: () => Buffer.from('run: attacker-controlled\nenv:\n  BUN_VERSION: 1.3.12\n'),
			});

			expect(result).toMatchObject({ success: false });
			expect(result.error).toContain('not a regular workflow file');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('authority rechecks live HEAD and the manifest after awaited Kernel reads', async () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-race-'));
		try {
			const run = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
			const spec = BUN_WORKFLOW_SPECS[0];
			const fullPath = path.join(root, spec.path);
			expect(run(['init']).status).toBe(0);
			expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
			expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
			fs.mkdirSync(path.dirname(fullPath), { recursive: true });
			fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ packageManager: 'bun@1.4.2' }));
			fs.writeFileSync(fullPath, fixtureContent(spec));
			expect(run(['add', '.']).status).toBe(0);
			expect(run(['commit', '-m', 'base']).status).toBe(0);
			const sourceHead = run(['rev-parse', 'HEAD']).stdout.trim();

			fs.writeFileSync(path.join(root, 'note.txt'), 'new head\n');
			expect(run(['add', 'note.txt']).status).toBe(0);
			expect(run(['commit', '-m', 'move head']).status).toBe(0);
			const stale = await protectedStateAuthority.issueBunWorkflowAuthorization(root, {
				actor: 'bun-pin-test',
				path: spec.path,
				sourceHead,
				targetBunVersion: '1.4.2',
			});
			expect(stale).toMatchObject({ success: false });
			expect(stale.error).toContain('source HEAD changed');

			const currentHead = run(['rev-parse', 'HEAD']).stdout.trim();
			let inserts = 0;
			const raced = await protectedStateAuthority.issueBunWorkflowAuthorization(root, {
				actor: 'bun-pin-test',
				path: spec.path,
				sourceHead: currentHead,
				targetBunVersion: '1.4.2',
			}, {
				deps: {
					kernelBroker: { config: {} },
					kernelDriver: {
						listKernelEvents: async () => {
							fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ packageManager: 'bun@1.4.3' }));
							return [];
						},
						insertKernelEvent: async () => {
							inserts += 1;
							throw new Error('must not insert');
						},
					},
				},
			});
			expect(raced).toMatchObject({ success: false });
			expect(raced.error).toMatch(/target changed|pin differs/);
			expect(inserts).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});
});

function createCommittedBunFixture() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-bun-pins-to-'));
	const run = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
	expect(run(['init']).status).toBe(0);
	expect(run(['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
	expect(run(['config', 'user.name', 'Forge Test']).status).toBe(0);
	expect(run(['config', 'core.autocrlf', 'false']).status).toBe(0);
	const manifest = '{\n  "name": "forge-workflow",\n  "packageManager": "bun@1.3.12",\n  "private": true\n}\n';
	fs.writeFileSync(path.join(root, 'package.json'), manifest);
	for (const spec of BUN_WORKFLOW_SPECS) {
		const fullPath = path.join(root, spec.path);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, fixtureContent(spec));
	}
	fs.writeFileSync(path.join(root, NPM_PUBLISH_WORKFLOW_PATH), renderNpmPublishWorkflow('1.3.12'));
	const template = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
	fs.mkdirSync(path.dirname(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), { recursive: true });
	fs.writeFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), template);
	fs.writeFileSync(path.join(root, TEST_WORKFLOW_PATH), renderTestWorkflow(template, '1.3.12'));
	fs.writeFileSync(path.join(root, SIZE_WORKFLOW_PATH), renderSizeWorkflow('1.3.12'));
	expect(run(['add', '.']).status).toBe(0);
	expect(run(['commit', '-m', 'base']).status).toBe(0);
	const head = run(['rev-parse', 'HEAD']).stdout.trim();
	return { root, run, head, manifest };
}

function toFixtureOptions(counters = {}) {
	return {
		issueAuthorization: async (_root, _params, authorizationOptions) => {
			counters.issued = (counters.issued || 0) + 1;
			return { success: true, capabilityId: authorizationOptions.capabilityId };
		},
		completeAuthorization: async () => ({ success: true }),
		cancelAuthorizations: async () => ({ success: true, results: [] }),
		writeProtectedFile: (projectRoot, workflowPath, content) => {
			fs.writeFileSync(path.join(projectRoot, workflowPath), content);
			return { allowed: true };
		},
		recordProtectedStateAuditEvent: () => ({ success: true }),
		generateNpmPublishWorkflow: async (projectRoot, options) => {
			fs.writeFileSync(path.join(projectRoot, NPM_PUBLISH_WORKFLOW_PATH), renderNpmPublishWorkflow(options.bunVersion));
			return { success: true, path: NPM_PUBLISH_WORKFLOW_PATH };
		},
		generateTestWorkflow: async (projectRoot, options) => {
			fs.writeFileSync(path.join(projectRoot, TEST_WORKFLOW_PATH), options.expectedUpdate.content);
			return { success: true, path: TEST_WORKFLOW_PATH };
		},
		resolveSizeWorkflowUpdate: projectRoot => ({
			path: SIZE_WORKFLOW_PATH,
			version: '1.4.3',
			content: renderSizeWorkflow('1.4.3'),
			snapshot: { existed: true, content: fs.readFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH)) },
		}),
		generateSizeWorkflow: async (projectRoot, options) => {
			fs.writeFileSync(path.join(projectRoot, SIZE_WORKFLOW_PATH), options.expectedUpdate.content);
			return { success: true, path: SIZE_WORKFLOW_PATH };
		},
	};
}

describe('update-bun-pins --to <version>', () => {
	test('stages the manifest pin and pins every Bun surface to the explicit stable version', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		try {
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(),
				expectedHead: head,
				targetVersion: '1.4.3',
			});

			expect(result.error).toBeUndefined();
			expect(result.success).toBe(true);
			expect(result.version).toBe('1.4.3');
			const expectedManifest = manifest.replace('bun@1.3.12', 'bun@1.4.3');
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(expectedManifest);
			expect(run(['show', ':package.json']).stdout).toBe(expectedManifest);
			const surfaces = [...BUN_WORKFLOW_SPECS.map(spec => spec.path), NPM_PUBLISH_WORKFLOW_PATH, TEST_WORKFLOW_PATH, SIZE_WORKFLOW_PATH];
			for (const surface of surfaces) {
				const content = fs.readFileSync(path.join(root, surface), 'utf8');
				expect({ surface, pinned: content.includes('1.4.3'), stale: content.includes('1.3.12') })
					.toEqual({ surface, pinned: true, stale: false });
			}
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('refuses prerelease, canary and malformed versions before any write or authority', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		const counters = {};
		try {
			for (const targetVersion of ['1.5.0-canary.1', '1.5.0-beta', 'canary', 'latest', 'v1.4.3', '1.4', '', '1.4.3\n']) {
				const result = await updateBunWorkflowPins(root, {
					...toFixtureOptions(counters),
					expectedHead: head,
					targetVersion,
				});
				expect({ targetVersion, success: result.success }).toEqual({ targetVersion, success: false });
				expect(result.error).toContain('exact stable');
			}
			expect(counters.issued).toBeUndefined();
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(manifest);
			expect(run(['show', ':package.json']).stdout).toBe(manifest);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('keeps the head-mismatch refusal and leaves the manifest untouched', async () => {
		const { root, run, manifest } = createCommittedBunFixture();
		const counters = {};
		try {
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(counters),
				expectedHead: 'b'.repeat(40),
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('does not match current HEAD');
			expect(counters.issued).toBeUndefined();
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(manifest);
			expect(run(['show', ':package.json']).stdout).toBe(manifest);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('restores the staged manifest when the pin batch fails', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		try {
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(),
				issueAuthorization: async () => ({ success: false, error: 'authority offline' }),
				expectedHead: head,
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('authority offline');
			expect(result.manifestRecovery).toMatchObject({ restored: true });
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(manifest);
			expect(run(['show', ':package.json']).stdout).toBe(manifest);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('refuses when the working manifest differs from the index', async () => {
		const { root, head, manifest } = createCommittedBunFixture();
		try {
			fs.writeFileSync(path.join(root, 'package.json'), manifest.replace('"private": true', '"private": false'));
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(),
				expectedHead: head,
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('differs from the Git index');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('refuses a staged manifest edit unrelated to the Bun pin', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		const counters = {};
		try {
			const staged = manifest.replace('"private": true', '"private": false');
			fs.writeFileSync(path.join(root, 'package.json'), staged);
			expect(run(['add', '--', 'package.json']).status).toBe(0);
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(counters),
				expectedHead: head,
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('differs from HEAD');
			expect(counters.issued).toBeUndefined();
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(staged);
			expect(run(['show', ':package.json']).stdout).toBe(staged);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('restores the working manifest when staging the pin fails', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		try {
			const execGit = (command, args, options) => {
				if (args[0] === 'add') throw new Error('index.lock exists');
				return secureExecFileSync(command, args, options);
			};
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(),
				execGit,
				expectedHead: head,
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('index.lock exists');
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(manifest);
			expect(run(['show', ':package.json']).stdout).toBe(manifest);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('preserves a concurrent manifest edit when staging the pin fails', async () => {
		const { root, run, head, manifest } = createCommittedBunFixture();
		const concurrent = manifest.replace('"private": true', '"private": false');
		try {
			const execGit = (command, args, options) => {
				if (args[0] === 'add') {
					fs.writeFileSync(path.join(root, 'package.json'), concurrent);
					throw new Error('index.lock exists');
				}
				return secureExecFileSync(command, args, options);
			};
			const result = await updateBunWorkflowPins(root, {
				...toFixtureOptions(),
				execGit,
				expectedHead: head,
				targetVersion: '1.4.3',
			});
			expect(result.success).toBe(false);
			expect(result.error).toContain('index.lock exists');
			expect(result.error).toContain('recovery skipped: package.json changed concurrently');
			expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe(concurrent);
			expect(run(['show', ':package.json']).stdout).toBe(manifest);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 30_000);

	test('the release command forwards --to and refuses a missing value', async () => {
		const calls = [];
		const updater = async (_root, options) => {
			calls.push(options);
			return { success: true, version: options.targetVersion, paths: [] };
		};
		const forwarded = await releaseCommand.handler(
			['update-bun-pins', '--to', '1.4.3', '--expect-head', TEST_HEAD], {}, 'C:/repo', { updateBunWorkflowPins: updater },
		);
		expect(forwarded.success).toBe(true);
		expect(calls[0]).toMatchObject({ targetVersion: '1.4.3', expectedHead: TEST_HEAD });

		const equals = await releaseCommand.handler(
			['update-bun-pins', '--expect-head=' + TEST_HEAD, '--to=1.4.4'], {}, 'C:/repo', { updateBunWorkflowPins: updater },
		);
		expect(equals.success).toBe(true);
		expect(calls[1].targetVersion).toBe('1.4.4');

		const omitted = await releaseCommand.handler(
			['update-bun-pins', '--expect-head', TEST_HEAD], {}, 'C:/repo', { updateBunWorkflowPins: updater },
		);
		expect(omitted.success).toBe(true);
		expect(calls[2].targetVersion).toBeUndefined();

		const missing = await releaseCommand.handler(
			['update-bun-pins', '--expect-head', TEST_HEAD, '--to'], {}, 'C:/repo', { updateBunWorkflowPins: updater },
		);
		expect(missing.success).toBe(false);
		expect(missing.error).toContain('--to');
		expect(calls).toHaveLength(3);
	});
});
