// forge-test-resource: exclusive
'use strict';

const { describe, expect, test } = require('bun:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const YAML = require('yaml');
const { hashProtectedContent } = require('../lib/protected-state-surfaces');
const protectedStateAuthority = require('../lib/protected-state-authority');
const {
	BUN_VERSION_PLACEHOLDER,
	TEST_WORKFLOW_PATH,
	TEST_WORKFLOW_TEMPLATE_PATH,
	generateTestWorkflow,
	renderTestWorkflow,
	resolveTestWorkflowUpdate,
} = require('../lib/test-workflow');

const repoRoot = path.resolve(__dirname, '..');
const TEST_HEAD = 'a'.repeat(40);
const SHA256_TEST_HEAD = 'a'.repeat(64);

function git(root, args) {
	return spawnSync('git', args, { cwd: root, encoding: 'utf8' });
}

function write(root, filePath, content) {
	const fullPath = path.join(root, filePath);
	fs.mkdirSync(path.dirname(fullPath), { recursive: true });
	fs.writeFileSync(fullPath, content);
}

function createFixture({ canonicalTarget = true, objectFormat = 'sha1' } = {}) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-test-workflow-'));
	const template = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
	const initArgs = objectFormat === 'sha256' ? ['init', '--object-format=sha256'] : ['init'];
	expect(git(root, initArgs).status).toBe(0);
	expect(git(root, ['config', 'user.email', 'forge-test@example.invalid']).status).toBe(0);
	expect(git(root, ['config', 'user.name', 'Forge Test']).status).toBe(0);
	write(root, 'package.json', '{"packageManager":"bun@1.3.12"}\n');
	write(root, TEST_WORKFLOW_TEMPLATE_PATH, template);
	write(root, TEST_WORKFLOW_PATH, canonicalTarget ? renderTestWorkflow(template, '1.3.12') : 'name: drifted\n');
	expect(git(root, ['add', '.']).status).toBe(0);
	expect(git(root, ['commit', '-m', 'base']).status).toBe(0);
	const head = git(root, ['rev-parse', 'HEAD']).stdout.trim();
	write(root, 'package.json', '{"packageManager":"bun@1.4.2"}\n');
	expect(git(root, ['add', 'package.json']).status).toBe(0);
	return { root, head, template };
}

function writer(projectRoot, filePath, content, options) {
	const fullPath = path.join(projectRoot, filePath);
	const current = fs.readFileSync(fullPath);
	if (!current.equals(Buffer.from(options.expectedContent))) {
		return { allowed: false, reason: 'compare-and-swap mismatch' };
	}
	fs.writeFileSync(fullPath, content);
	return { allowed: true, contentHash: hashProtectedContent(content) };
}

function remover(projectRoot, filePath, options) {
	const fullPath = path.join(projectRoot, filePath);
	if (!fs.readFileSync(fullPath).equals(Buffer.from(options.expectedContent))) {
		return { allowed: false, reason: 'compare-and-swap mismatch' };
	}
	fs.rmSync(fullPath);
	return { allowed: true };
}

function successOptions(overrides = {}) {
	return {
		actor: 'test-workflow-writer',
		issueAuthorization: async (_root, _params, options) => ({
			success: true,
			capabilityId: options.capabilityId,
		}),
		completeAuthorization: async () => ({ success: true }),
		writeProtectedFile: writer,
		removeProtectedFile: remover,
		recordProtectedStateAuditEvent: () => ({ success: true }),
		createCapabilityId: () => 'test-workflow-capability',
		...overrides,
	};
}

describe('canonical test workflow renderer', () => {
	test('renders the checked-in workflow byte-for-byte from the canonical template', () => {
		const template = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_TEMPLATE_PATH));
		const current = fs.readFileSync(path.join(repoRoot, TEST_WORKFLOW_PATH));
		const version = /^bun@(\d+\.\d+\.\d+)$/.exec(require('../package.json').packageManager)[1];

		expect(template.toString('utf8').split(BUN_VERSION_PLACEHOLDER)).toHaveLength(10);
		expect(() => YAML.parse(template.toString('utf8'))).not.toThrow();
		expect(renderTestWorkflow(template, version)).toEqual(current);
	});

	test('rejects invalid versions and templates with the wrong placeholder count', () => {
		expect(() => renderTestWorkflow(`bun-version: ${BUN_VERSION_PLACEHOLDER}\n`, 'latest')).toThrow('exact stable');
		expect(() => renderTestWorkflow('name: no-token\n', '1.4.2')).toThrow('exactly 9');
		expect(() => renderTestWorkflow(BUN_VERSION_PLACEHOLDER.repeat(10), '1.4.2')).toThrow('exactly 9');
	});

	test('preserves the original deep-import marker name as an alias', () => {
		expect(require('../lib/test-workflow').BUN_VERSION_TOKEN).toBe(BUN_VERSION_PLACEHOLDER);
	});
});

describe('Forge-owned test workflow writer', () => {
	test.each([
		{ label: 'missing', expectedHead: undefined, resolvedHead: TEST_HEAD, error: '--expect-head is required' },
		{ label: 'abbreviated', expectedHead: TEST_HEAD.slice(0, 12), resolvedHead: TEST_HEAD, error: 'full 40- or 64-character lowercase commit SHA' },
		{ label: 'invalid length', expectedHead: 'a'.repeat(63), resolvedHead: SHA256_TEST_HEAD, error: 'full 40- or 64-character lowercase commit SHA' },
		{ label: 'invalid current HEAD', expectedHead: SHA256_TEST_HEAD, resolvedHead: 'b'.repeat(63), error: 'Current HEAD did not resolve' },
		{ label: 'mismatched', expectedHead: TEST_HEAD, resolvedHead: 'b'.repeat(40), error: 'does not match current HEAD' },
		{ label: 'mismatched SHA-256', expectedHead: SHA256_TEST_HEAD, resolvedHead: 'b'.repeat(64), error: 'does not match current HEAD' },
	])('fails closed before reading or writing for $label expected HEAD', async ({ expectedHead, resolvedHead, error }) => {
		let authorityCalls = 0;
		const result = await generateTestWorkflow('C:/repo', {
			expectedHead,
			resolveHead: () => resolvedHead,
			issueAuthorization: async () => { authorityCalls += 1; return { success: true }; },
		});

		expect(result).toMatchObject({ success: false });
		expect(result.error).toContain(error);
		expect(authorityCalls).toBe(0);
	});

	test('authorizes an intended staged template edit and writes only its exact staged manifest render', async () => {
		const { root, head } = createFixture();
		let issued;
		let completed;
		try {
			fs.appendFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), '# intended workflow edit\n');
			expect(git(root, ['add', TEST_WORKFLOW_TEMPLATE_PATH]).status).toBe(0);
			const result = await generateTestWorkflow(root, {
				...successOptions({
					issueAuthorization: async (_root, params, options) => {
						issued = { params, capabilityId: options.capabilityId };
						return { success: true, capabilityId: options.capabilityId };
					},
					completeAuthorization: async (_root, params) => { completed = params; return { success: true }; },
				}),
				expectedHead: head,
			});

			const expected = renderTestWorkflow(fs.readFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), '1.4.2');
			expect(result).toMatchObject({ success: true, sourceHead: head, bunVersion: '1.4.2' });
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH))).toEqual(expected);
			expect(issued.params).toMatchObject({ actor: 'test-workflow-writer', sourceHead: head, targetBunVersion: '1.4.2' });
			expect(completed).toMatchObject({ capabilityId: 'test-workflow-capability', sourceHead: head });
			expect(result.contentHash).toBe(hashProtectedContent(expected));
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('generates from a real SHA-256 repository HEAD', async () => {
		const { root, head } = createFixture({ objectFormat: 'sha256' });
		const rows = [];
		const kernelDeps = {
			kernelBroker: { config: {} },
			kernelDriver: {
				listKernelEvents: async () => rows,
				insertKernelEvent: async event => {
					rows.push(event);
					return event;
				},
			},
		};
		try {
			expect(head).toMatch(/^[0-9a-f]{64}$/);
			const result = await generateTestWorkflow(root, {
				actor: 'sha256-workflow-writer',
				expectedHead: head,
				kernelDeps,
				createCapabilityId: () => 'sha256-test-workflow-capability',
				writeProtectedFile: writer,
				removeProtectedFile: remover,
				recordProtectedStateAuditEvent: () => ({ success: true }),
			});

			expect(result).toMatchObject({ success: true, sourceHead: head, bunVersion: '1.4.2' });
			expect(result.authorization).toMatchObject({
				success: true,
				capabilityId: 'sha256-test-workflow-capability',
				event: { sourceHead: head },
			});
			expect(result.completion).toMatchObject({
				success: true,
				capabilityId: 'sha256-test-workflow-capability',
				event: { sourceHead: head },
			});
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH)))
				.toEqual(renderTestWorkflow(fs.readFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH)), '1.4.2'));
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 15_000);

	test('selects the same actor precedence used by the protected-state hook', async () => {
		const { root, head } = createFixture();
		const cases = [
			{
				label: 'explicit actor',
				actor: 'explicit-writer',
				env: { FORGE_PROTECTED_STATE_ACTOR: 'protected-writer', FORGE_ACTOR: 'forge-writer' },
				expected: 'explicit-writer',
			},
			{
				label: 'protected actor',
				env: { FORGE_PROTECTED_STATE_ACTOR: 'protected-writer', FORGE_ACTOR: 'forge-writer' },
				expected: 'protected-writer',
			},
			{ label: 'Forge actor', env: { FORGE_ACTOR: 'forge-writer', USER: 'user-writer' }, expected: 'forge-writer' },
			{ label: 'user', env: { USER: 'user-writer', USERNAME: 'username-writer' }, expected: 'user-writer' },
			{ label: 'username', env: { USERNAME: 'username-writer' }, expected: 'username-writer' },
			{ label: 'sanitized environment', env: {}, expected: 'unknown' },
		];
		try {
			for (const scenario of cases) {
				let issuedActor;
				const result = await generateTestWorkflow(root, {
					...successOptions({
						actor: scenario.actor,
						issueAuthorization: async (_projectRoot, params, options) => {
							issuedActor = params.actor;
							return { success: true, capabilityId: options.capabilityId };
						},
					}),
					env: scenario.env,
					expectedHead: head,
				});
				expect(result.success, scenario.label).toBe(true);
				expect(issuedActor, scenario.label).toBe(scenario.expected);
			}
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 20_000);

	test('carries an intended template edit through the real exact authority lifecycle', async () => {
		const { root, head } = createFixture();
		const rows = [];
		const kernelDeps = {
			kernelBroker: { config: {} },
			kernelDriver: {
				listKernelEvents: async () => rows,
				insertKernelEvent: async event => {
					rows.push(event);
					return event;
				},
			},
		};
		try {
			fs.appendFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), '# authorized CI edit\n');
			expect(git(root, ['add', TEST_WORKFLOW_TEMPLATE_PATH]).status).toBe(0);
			const generated = await generateTestWorkflow(root, {
				env: {},
				expectedHead: head,
				kernelDeps,
				createCapabilityId: () => 'real-test-workflow-capability',
				writeProtectedFile: writer,
				removeProtectedFile: remover,
				recordProtectedStateAuditEvent: () => ({ success: true }),
			});
			expect(generated).toMatchObject({ success: true });
			expect(git(root, ['add', TEST_WORKFLOW_PATH]).status).toBe(0);
			const content = fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH));
			const committed = await protectedStateAuthority.authorizeAndConsumeProtectedStateWrites(root, [{
				actor: 'unknown',
				path: TEST_WORKFLOW_PATH,
				surface: 'workflows',
				content,
				sourceHead: head,
			}], {
				deps: kernelDeps,
				validateCompleteBunPinBatch: () => ({ success: true }),
			});
			expect(committed).toMatchObject({
				success: true,
				decisions: [{ allowed: true, capabilityId: 'real-test-workflow-capability' }],
			});
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 15_000);

	test('rejects source drift, staged template drift, and unrelated staged target bytes before authority', async () => {
		const scenarios = [
			{ name: 'source', setup: fixture => fixture },
			{
				name: 'working template',
				setup: fixture => fs.appendFileSync(path.join(fixture.root, TEST_WORKFLOW_TEMPLATE_PATH), '# unstaged\n'),
			},
			{
				name: 'staged target',
				setup: fixture => {
					write(fixture.root, TEST_WORKFLOW_PATH, 'name: unrelated staged target\n');
					expect(git(fixture.root, ['add', TEST_WORKFLOW_PATH]).status).toBe(0);
				},
			},
		];

		for (const scenario of scenarios) {
			const fixture = createFixture({ canonicalTarget: scenario.name !== 'source' });
			let authorityCalls = 0;
			try {
				scenario.setup(fixture);
				const result = await generateTestWorkflow(fixture.root, {
					...successOptions({
						issueAuthorization: async () => { authorityCalls += 1; return { success: true }; },
					}),
					expectedHead: fixture.head,
				});
				expect(result.success, scenario.name).toBe(false);
				expect(authorityCalls, scenario.name).toBe(0);
			} finally {
				fs.rmSync(fixture.root, { recursive: true, force: true });
			}
		}
	}, 15_000);

	test('rejects a stale batch snapshot without issuing authority', async () => {
		const { root, head } = createFixture();
		let authorityCalls = 0;
		try {
			const prepared = resolveTestWorkflowUpdate(root, head);
			write(root, TEST_WORKFLOW_PATH, 'name: concurrent edit\n');
			const result = await generateTestWorkflow(root, {
				...successOptions({ issueAuthorization: async () => { authorityCalls += 1; return { success: true }; } }),
				expectedHead: head,
				expectedSnapshot: prepared.snapshot,
			});
			expect(result).toMatchObject({ success: false });
			expect(result.error).toContain('changed after Bun pin batch preflight');
			expect(authorityCalls).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test.each(['package', 'template'])('rejects a stale preflight %s binding before authority', async changedPath => {
		const { root, head } = createFixture();
		let authorityCalls = 0;
		try {
			const prepared = resolveTestWorkflowUpdate(root, head);
			if (changedPath === 'package') {
				write(root, 'package.json', '{"packageManager":"bun@1.4.3"}\n');
				expect(git(root, ['add', 'package.json']).status).toBe(0);
			} else {
				fs.appendFileSync(path.join(root, TEST_WORKFLOW_TEMPLATE_PATH), '# changed after preflight\n');
				expect(git(root, ['add', TEST_WORKFLOW_TEMPLATE_PATH]).status).toBe(0);
			}
			const result = await generateTestWorkflow(root, {
				...successOptions({ issueAuthorization: async () => { authorityCalls += 1; return { success: true }; } }),
				expectedHead: head,
				expectedSnapshot: prepared.snapshot,
				expectedUpdate: { version: prepared.version, content: prepared.content },
			});
			expect(result).toMatchObject({ success: false });
			expect(result.error).toContain('changed after Bun pin batch preflight');
			expect(authorityCalls).toBe(0);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	}, 15_000);

	test('accepts an exact immutable preflight update binding', async () => {
		const { root, head } = createFixture();
		try {
			const prepared = resolveTestWorkflowUpdate(root, head);
			const result = await generateTestWorkflow(root, {
				...successOptions(),
				expectedHead: head,
				expectedSnapshot: prepared.snapshot,
				expectedUpdate: { version: prepared.version, content: prepared.content },
			});
			expect(result).toMatchObject({ success: true, bunVersion: prepared.version });
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH))).toEqual(prepared.content);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test.each(['audit', 'completion'])('restores the prior workflow when %s fails after the atomic write', async failure => {
		const { root, head } = createFixture();
		const baseline = fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH));
		try {
			const result = await generateTestWorkflow(root, {
				...successOptions({
					recordProtectedStateAuditEvent: () => failure === 'audit'
						? { success: false, error: 'injected audit failure' }
						: { success: true },
					completeAuthorization: async () => failure === 'completion'
						? { success: false, error: 'injected completion failure' }
						: { success: true },
				}),
				expectedHead: head,
			});
			expect(result).toMatchObject({ success: false, recovery: { allowed: true } });
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH))).toEqual(baseline);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('leaves the prior workflow intact when the atomic commit is interrupted', async () => {
		const { root, head } = createFixture();
		const baseline = fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH));
		try {
			const result = await generateTestWorkflow(root, {
				...successOptions({ writeProtectedFile: undefined }),
				expectedHead: head,
				beforeAtomicCommit: () => { throw new Error('injected atomic commit interruption'); },
			});
			expect(result).toMatchObject({ success: false });
			expect(result.error).toContain('injected atomic commit interruption');
			expect(fs.readFileSync(path.join(root, TEST_WORKFLOW_PATH))).toEqual(baseline);
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});

	test('reports a recovery failure without hiding the original authorization failure', async () => {
		const { root, head } = createFixture();
		try {
			const result = await generateTestWorkflow(root, {
				...successOptions({
					recordProtectedStateAuditEvent: () => ({ success: false, error: 'injected audit failure' }),
					writeProtectedFile: (...args) => {
						if (args[3].operation === 'recover_test_workflow') throw new Error('injected recovery failure');
						return writer(...args);
					},
				}),
				expectedHead: head,
			});
			expect(result).toMatchObject({
				success: false,
				recovery: { allowed: false, reason: 'injected recovery failure' },
			});
			expect(result.error).toContain('injected audit failure');
		} finally {
			fs.rmSync(root, { recursive: true, force: true });
		}
	});
});
