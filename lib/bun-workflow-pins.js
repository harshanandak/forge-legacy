'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { secureExecFileSync } = require('./shell-utils');
const {
	createProtectedStateAuditRecord,
	recordProtectedStateAuditEvent,
	removeProtectedFile,
	writeProtectedFile,
} = require('./protected-state-surfaces');

const EXACT_BUN_VERSION = /^\d+\.\d+\.\d+$/;
const BUN_WORKFLOW_SPECS = Object.freeze([
	{ path: '.github/workflows/build-binary.yml', key: 'BUN_VERSION', count: 1 },
	{ path: '.github/workflows/docs-validation.yml', key: 'bun-version', count: 2 },
	{ path: '.github/workflows/eslint.yml', key: 'bun-version', count: 1 },
	{ path: '.github/workflows/pr-monitor.yml', key: 'bun-version', count: 1 },
	{ path: '.github/workflows/pr-title.yml', key: 'bun-version', count: 1 },
	{ path: '.github/workflows/required-checks-bypass.yml', key: 'bun-version', count: 1 },
	{ path: '.github/workflows/yaml-lint.yml', key: 'bun-version', count: 1 },
].map(Object.freeze));

function workflowSpec(workflowPath) {
	return BUN_WORKFLOW_SPECS.find(spec => spec.path === workflowPath) || null;
}

function readPinnedBunVersion(packageContent) {
	let manifest;
	try {
		manifest = JSON.parse(Buffer.from(packageContent).toString('utf8'));
	} catch (error) {
		throw new Error(`Could not parse package.json: ${error.message}`);
	}
	const match = /^bun@(\d+\.\d+\.\d+)$/.exec(manifest.packageManager || '');
	if (!match) throw new Error('package.json packageManager must pin one exact stable Bun version.');
	return match[1];
}

function renderBunWorkflowPin(workflowPath, sourceContent, version) {
	const spec = workflowSpec(workflowPath);
	if (!spec) throw new Error(`${workflowPath} is not an allowlisted Bun workflow.`);
	if (!EXACT_BUN_VERSION.test(version)) throw new Error('Bun workflow pins require an exact stable version.');

	let replacements = 0;
	const source = Buffer.from(sourceContent).toString('utf8');
	const key = spec.key === 'BUN_VERSION' ? 'BUN_VERSION' : 'bun-version';
	const pattern = new RegExp(`^([ \\t]*${key}:[ \\t]*)(?:latest|\\d+\\.\\d+\\.\\d+)([ \\t]*\\r?)$`, 'gm');
	const rendered = source.replace(pattern, (_match, prefix, suffix) => {
		replacements += 1;
		return `${prefix}${version}${suffix}`;
	});
	if (replacements !== spec.count) {
		throw new Error(`${workflowPath} must contain exactly ${spec.count} literal ${key} pin${spec.count === 1 ? '' : 's'}; found ${replacements}.`);
	}
	return Buffer.isBuffer(sourceContent) ? Buffer.from(rendered, 'utf8') : rendered;
}

function readSourceWorkflow(projectRoot, sourceHead, workflowPath, execGit = secureExecFileSync) {
	if (!workflowSpec(workflowPath)) throw new Error(`${workflowPath} is not an allowlisted Bun workflow.`);
	const gitOptions = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const treeEntry = execGit('git', ['ls-tree', sourceHead, '--', workflowPath], gitOptions).trim();
	if (!/^100(?:644|755) blob [0-9a-f]+\t/.test(treeEntry)) {
		throw new Error(`${workflowPath} is not a regular workflow file at ${sourceHead}.`);
	}
	return Buffer.from(execGit('git', ['show', `${sourceHead}:${workflowPath}`], {
		...gitOptions,
		encoding: 'buffer',
	}));
}

function resolveCurrentHead(projectRoot, execGit = secureExecFileSync) {
	return execGit('git', ['rev-parse', '--verify', 'HEAD^{commit}'], {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	}).trim();
}

function readIndexedWorkflow(projectRoot, workflowPath, execGit = secureExecFileSync) {
	if (!workflowSpec(workflowPath)) throw new Error(`${workflowPath} is not an allowlisted Bun workflow.`);
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const entry = execGit('git', ['ls-files', '--stage', '--', workflowPath], options).trim();
	if (!/^100(?:644|755) [0-9a-f]+ 0\t/.test(entry)) {
		throw new Error(`${workflowPath} is not one regular file in the Git index.`);
	}
	return Buffer.from(execGit('git', ['show', `:${workflowPath}`], { ...options, encoding: 'buffer' }));
}

function readIndexedPackageManifest(projectRoot, execGit = secureExecFileSync) {
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const entry = execGit('git', ['ls-files', '--stage', '--', 'package.json'], options).trim();
	if (!/^100(?:644|755) [0-9a-f]+ 0\tpackage\.json$/.test(entry)) {
		throw new Error('package.json is not one regular file in the Git index.');
	}
	return Buffer.from(execGit('git', ['show', ':package.json'], { ...options, encoding: 'buffer' }));
}

function readSourcePackageManifest(projectRoot, sourceHead, execGit = secureExecFileSync) {
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const entry = execGit('git', ['ls-tree', sourceHead, '--', 'package.json'], options).trim();
	if (!/^100(?:644|755) blob [0-9a-f]+\tpackage\.json$/.test(entry)) {
		throw new Error(`package.json is not a regular file at ${sourceHead}.`);
	}
	return Buffer.from(execGit('git', ['show', `${sourceHead}:package.json`], { ...options, encoding: 'buffer' }));
}

function parseRegularEntries(raw, expectedPaths, pattern, errorForPath) {
	const entries = new Map();
	for (const line of raw.trim().split(/\r?\n/).filter(Boolean)) {
		const match = pattern.exec(line);
		if (match) entries.set(match[2], match[1]);
	}
	for (const filePath of expectedPaths) {
		if (!entries.has(filePath)) throw new Error(errorForPath(filePath));
	}
	return entries;
}

function readBlobBatch(projectRoot, objectIds, execGit) {
	const output = Buffer.from(execGit('git', ['cat-file', '--batch'], {
		cwd: projectRoot,
		encoding: 'buffer',
		input: Buffer.from(`${objectIds.join('\n')}\n`),
		stdio: ['pipe', 'pipe', 'pipe'],
		windowsHide: true,
	}));
	const blobs = [];
	let offset = 0;
	for (const expectedId of objectIds) {
		const headerEnd = output.indexOf(0x0a, offset);
		if (headerEnd < 0) throw new Error(`Git did not return blob metadata for ${expectedId}.`);
		const match = /^([0-9a-f]+) blob (\d+)$/.exec(output.subarray(offset, headerEnd).toString('utf8'));
		if (!match || match[1] !== expectedId) throw new Error(`Git did not return the expected blob ${expectedId}.`);
		const contentStart = headerEnd + 1;
		const contentEnd = contentStart + Number(match[2]);
		if (contentEnd >= output.length || output[contentEnd] !== 0x0a) {
			throw new Error(`Git returned an incomplete blob ${expectedId}.`);
		}
		blobs.push(Buffer.from(output.subarray(contentStart, contentEnd)));
		offset = contentEnd + 1;
	}
	if (offset !== output.length) throw new Error('Git returned unexpected extra blob data.');
	return blobs;
}

function readCompleteBunPinBatch(projectRoot, sourceHead, extraIndexedPaths = [], execGit = secureExecFileSync) {
	const sourcePaths = ['package.json', ...BUN_WORKFLOW_SPECS.map(spec => spec.path)];
	const indexedPaths = [...sourcePaths, ...extraIndexedPaths];
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const sourceEntries = parseRegularEntries(
		execGit('git', ['ls-tree', sourceHead, '--', ...sourcePaths], options),
		sourcePaths,
		/^100(?:644|755) blob ([0-9a-f]+)\t(.+)$/,
		filePath => filePath === 'package.json'
			? `package.json is not a regular file at ${sourceHead}.`
			: `${filePath} is not a regular workflow file at ${sourceHead}.`,
	);
	const indexedEntries = parseRegularEntries(
		execGit('git', ['ls-files', '--stage', '--', ...indexedPaths], options),
		indexedPaths,
		/^100(?:644|755) ([0-9a-f]+) 0\t(.+)$/,
		filePath => `${filePath} is not one regular file in the Git index.`,
	);
	const sourceBlobs = readBlobBatch(projectRoot, sourcePaths.map(filePath => sourceEntries.get(filePath)), execGit);
	const indexedBlobs = readBlobBatch(projectRoot, indexedPaths.map(filePath => indexedEntries.get(filePath)), execGit);
	return {
		source: new Map(sourcePaths.map((filePath, index) => [filePath, sourceBlobs[index]])),
		indexed: new Map(indexedPaths.map((filePath, index) => [filePath, indexedBlobs[index]])),
	};
}

function resolveBunVersionTarget(projectRoot, options = {}) {
	const indexReader = options.readIndexedPackageManifest || readIndexedPackageManifest;
	const indexed = Buffer.from(indexReader(projectRoot, options.execGit));
	const packagePath = path.join(projectRoot, 'package.json');
	const stat = fs.lstatSync(packagePath);
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('package.json must be a regular file.');
	const current = fs.readFileSync(packagePath);
	const version = readPinnedBunVersion(indexed);
	if (readPinnedBunVersion(current) !== version) {
		throw new Error('package.json Bun pin differs from the Git index; stage the intended manifest before updating workflow pins.');
	}
	return { version };
}

function deriveBunWorkflowUpdate(projectRoot, sourceHead, workflowPath, options = {}) {
	const version = options.version || resolveBunVersionTarget(projectRoot, options).version;
	const sourceReader = options.readSourceWorkflow || readSourceWorkflow;
	const baseline = Buffer.from(sourceReader(projectRoot, sourceHead, workflowPath, options.execGit));
	return {
		path: workflowPath,
		version,
		baseline,
		content: Buffer.from(renderBunWorkflowPin(workflowPath, baseline, version)),
	};
}

function readRegularWorkflow(projectRoot, workflowPath) {
	const fullPath = path.join(projectRoot, workflowPath);
	const stat = fs.lstatSync(fullPath);
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${workflowPath} must be a regular file.`);
	return fs.readFileSync(fullPath);
}

function snapshotFile(projectRoot, filePath) {
	const fullPath = path.join(projectRoot, filePath);
	try {
		const stat = fs.lstatSync(fullPath);
		if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${filePath} must be a regular file.`);
		return { existed: true, content: fs.readFileSync(fullPath) };
	} catch (error) {
		if (error.code === 'ENOENT') return { existed: false, content: null };
		throw error;
	}
}

function sameSnapshot(left, right) {
	return left.existed === right.existed
		&& (!left.existed || left.content.equals(right.content));
}

function recoverAttempt(update, projectRoot, protectedWriter, protectedRemover) {
	try {
		const current = snapshotFile(projectRoot, update.path);
		if (sameSnapshot(current, update.original)) return { allowed: true, action: 'unchanged' };
		if (!current.existed || !current.content.equals(update.content)) {
			return { allowed: false, reason: 'File changed after the Bun pin write; concurrent content was preserved.' };
		}
		const recoveryOptions = {
			...update.writeOptions,
			operation: update.recoveryOperation,
			expectedContent: update.content,
		};
		return update.original.existed
			? protectedWriter(projectRoot, update.path, update.original.content, recoveryOptions)
			: protectedRemover(projectRoot, update.path, recoveryOptions);
	} catch (error) {
		return { allowed: false, reason: error.message };
	}
}

function recoverAttempts(attempts, projectRoot, protectedWriter, protectedRemover) {
	const files = [...attempts].reverse().map(update => ({
		path: update.path,
		...recoverAttempt(update, projectRoot, protectedWriter, protectedRemover),
	}));
	return { allowed: files.every(file => file.allowed), files };
}

async function failedUpdate(error, results, attempts, authorizations, projectRoot, context, extra = {}) {
	let authority;
	try {
		authority = await context.cancelAuthorizations(projectRoot, authorizations, { deps: context.kernelDeps });
	} catch (cancelError) {
		authority = { success: false, error: cancelError.message, results: [] };
	}
	const files = recoverAttempts(attempts, projectRoot, context.protectedWriter, context.protectedRemover);
	return {
		success: false,
		error,
		results,
		recovery: {
			allowed: authority.success && files.allowed,
			authority,
			files: files.files,
		},
		...extra,
	};
}

async function applyWorkflowUpdate(projectRoot, update, context) {
	const authorityRecord = {
		actor: context.actor,
		path: update.path,
		sourceHead: context.sourceHead,
		capabilityId: context.createCapabilityId(),
	};
	context.authorizations.push(authorityRecord);
	let authorization;
	try {
		authorization = await context.issueAuthorization(projectRoot, {
			actor: context.actor,
			path: update.path,
			sourceHead: context.sourceHead,
			targetBunVersion: context.version,
		}, { deps: context.kernelDeps, capabilityId: authorityRecord.capabilityId });
	} catch (error) {
		authorization = { success: false, error: error.message };
	}
	if (!authorization.success) {
		return { success: false, error: `Could not authorize ${update.path}: ${authorization.error}` };
	}
	if (authorization.capabilityId !== authorityRecord.capabilityId) {
		return { success: false, error: `Could not authorize ${update.path}: authority returned a different capability id.` };
	}

	const writeOptions = {
		actor: context.actor,
		operation: 'update_bun_workflow_pin',
		viaForgeApi: true,
		surface: 'workflows',
		expectedContent: update.current,
	};
	context.attempts.push({
		...update,
		original: { existed: true, content: update.current },
		writeOptions,
		recoveryOperation: 'recover_bun_workflow_pin',
	});

	let write;
	try {
		write = context.protectedWriter(projectRoot, update.path, update.content, writeOptions);
	} catch (error) {
		return { success: false, error: error.message };
	}
	if (!write.allowed) return { success: false, error: write.reason };

	let audit;
	try {
		audit = context.auditWriter(createProtectedStateAuditRecord({
			actor: context.actor,
			surface: 'workflows',
			path: update.path,
			content: update.content,
			operation: 'update_bun_workflow_pin',
			viaForgeApi: true,
			sourceHead: context.sourceHead,
		}), { cwd: projectRoot });
	} catch (error) {
		audit = { success: false, error: error.message };
	}
	if (!audit.success) return { success: false, error: `Could not record ${update.path}: ${audit.error}` };

	let completion;
	try {
		completion = await context.completeAuthorization(projectRoot, {
			actor: context.actor,
			path: update.path,
			sourceHead: context.sourceHead,
			capabilityId: authorization.capabilityId,
			targetBunVersion: context.version,
		}, { deps: context.kernelDeps });
	} catch (error) {
		completion = { success: false, error: error.message };
	}
	if (!completion.success) return { success: false, error: `Could not complete ${update.path}: ${completion.error}` };

	return { success: true, result: { path: update.path, write, authorization, completion } };
}

const MANIFEST_PIN = /("packageManager"[ \t]*:[ \t]*")bun@\d+\.\d+\.\d+(")/g;

function stageFile(projectRoot, filePath, execGit) {
	execGit('git', ['add', '--', filePath], {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	});
}

/**
 * Rewrites and stages the package.json Bun pin for `--to <version>`. The manifest must be a regular
 * file whose working bytes equal the index and whose index bytes equal HEAD, so no unrelated
 * manifest edit rides along.
 */
function stageBunManifestPin(projectRoot, sourceHead, version, options = {}) {
	const execGit = options.execGit || secureExecFileSync;
	try {
		const packagePath = path.join(projectRoot, 'package.json');
		const stat = fs.lstatSync(packagePath);
		if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('package.json must be a regular file.');
		const original = fs.readFileSync(packagePath);
		const indexed = Buffer.from((options.readIndexedPackageManifest || readIndexedPackageManifest)(projectRoot, options.execGit));
		if (!original.equals(indexed)) {
			throw new Error('package.json differs from the Git index; restore or commit it before updating Bun pins.');
		}
		const committed = (options.readSourcePackageManifest || readSourcePackageManifest)(projectRoot, sourceHead, options.execGit);
		if (!indexed.equals(Buffer.from(committed))) {
			throw new Error('package.json in the Git index differs from HEAD; commit or unstage it before updating Bun pins.');
		}
		readPinnedBunVersion(original);
		const source = original.toString('utf8');
		const matches = source.match(MANIFEST_PIN) || [];
		if (matches.length !== 1) throw new Error(`package.json must contain exactly one packageManager Bun pin; found ${matches.length}.`);
		const content = Buffer.from(source.replace(MANIFEST_PIN, `$1bun@${version}$2`), 'utf8');
		if (readPinnedBunVersion(content) !== version) throw new Error('package.json Bun pin rewrite did not produce the requested version.');
		fs.writeFileSync(packagePath, content);
		try {
			stageFile(projectRoot, 'package.json', execGit);
		} catch (error) {
			// The index was never updated, so recovery only puts the working bytes back.
			const recovery = restoreBunManifestPin(projectRoot, { original, content }, { ...options, stage: false });
			if (!recovery.restored) error.message = `${error.message} (recovery skipped: ${recovery.reason})`;
			throw error;
		}
		return { success: true, original, content };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

function restoreBunManifestPin(projectRoot, manifest, options = {}) {
	try {
		const packagePath = path.join(projectRoot, 'package.json');
		const current = fs.readFileSync(packagePath);
		if (!current.equals(manifest.content)) {
			return { restored: false, reason: 'package.json changed concurrently after the Bun pin write; concurrent content was preserved.' };
		}
		fs.writeFileSync(packagePath, manifest.original);
		if (options.stage !== false) stageFile(projectRoot, 'package.json', options.execGit || secureExecFileSync);
		return { restored: true };
	} catch (error) {
		return { restored: false, reason: error.message };
	}
}

/**
 * Pins every Bun surface. With `targetVersion` (`--to`), first validates the exact stable version,
 * verifies the expected HEAD, and stages the package.json pin; the batch then runs unchanged from
 * that staged manifest, and a failed batch restores the manifest. Without it, the staged manifest
 * is the target, as before.
 */
async function updateBunWorkflowPins(projectRoot, options = {}) {
	if (options.targetVersion === undefined) return updateBunWorkflowPinsFromManifest(projectRoot, options);
	const version = options.targetVersion;
	if (typeof version !== 'string' || !EXACT_BUN_VERSION.test(version)) {
		return { success: false, error: `--to requires an exact stable Bun version (X.Y.Z, no prerelease or canary); got ${JSON.stringify(version)}.` };
	}
	const { verifyExpectedHead } = require('./npm-publish-workflow');
	const head = verifyExpectedHead(projectRoot, options.expectedHead, options.resolveHead);
	if (!head.success) return head;
	const manifest = stageBunManifestPin(projectRoot, head.sourceHead, version, options);
	if (!manifest.success) return manifest;
	const result = await updateBunWorkflowPinsFromManifest(projectRoot, options);
	if (!result.success) return { ...result, manifestRecovery: restoreBunManifestPin(projectRoot, manifest, options) };
	return result;
}

// Derives one Bun workflow update and refuses when the worktree or index holds unrelated edits.
function deriveCheckedBunWorkflowUpdate(projectRoot, sourceHead, workflowPath, version, options) {
	const update = deriveBunWorkflowUpdate(projectRoot, sourceHead, workflowPath, { ...options, version });
	const current = readRegularWorkflow(projectRoot, workflowPath);
	const indexReader = options.readIndexedWorkflow || readIndexedWorkflow;
	const indexed = Buffer.from(indexReader(projectRoot, workflowPath, options.execGit));
	if (!current.equals(update.baseline) && !current.equals(update.content)) {
		throw new Error(`${workflowPath} has unrelated local edits; restore or commit them before updating Bun pins.`);
	}
	if (!indexed.equals(update.baseline) && !indexed.equals(update.content)) {
		throw new Error(`${workflowPath} has unrelated staged edits; restore or commit them before updating Bun pins.`);
	}
	return { ...update, current, indexed };
}

// Plans the npm publish workflow rewrite for the new Bun version, bound to its canonical source bytes.
function resolveNpmWorkflowUpdate(projectRoot, sourceHead, version, actor, options) {
	const npmWorkflow = require('./npm-publish-workflow');
	const npmPath = npmWorkflow.NPM_PUBLISH_WORKFLOW_PATH;
	const sourceVersion = readPinnedBunVersion((options.readSourcePackageManifest || readSourcePackageManifest)(
		projectRoot,
		sourceHead,
		options.execGit,
	));
	const npmBaseline = Buffer.from((options.readSourceNpmPublishWorkflow || npmWorkflow.readSourceNpmPublishWorkflow)(
		projectRoot,
		sourceHead,
		options.execGit,
	));
	if (!npmBaseline.equals(Buffer.from(npmWorkflow.renderNpmPublishWorkflow(sourceVersion)))) {
		throw new Error(`${npmPath} at ${sourceHead} differs from its canonical generator output.`);
	}
	const npmContent = Buffer.from(npmWorkflow.renderNpmPublishWorkflow(version));
	const npmOriginal = snapshotFile(projectRoot, npmPath);
	const npmIndexed = Buffer.from((options.readIndexedNpmPublishWorkflow || npmWorkflow.readIndexedNpmPublishWorkflow)(
		projectRoot,
		options.execGit,
	));
	if (!npmOriginal.existed || (!npmOriginal.content.equals(npmBaseline) && !npmOriginal.content.equals(npmContent))) {
		throw new Error(`${npmPath} has unrelated local edits; restore or commit them before updating Bun pins.`);
	}
	if (!npmIndexed.equals(npmBaseline) && !npmIndexed.equals(npmContent)) {
		throw new Error(`${npmPath} has unrelated staged edits; restore or commit them before updating Bun pins.`);
	}
	return {
		path: npmPath,
		original: npmOriginal,
		content: npmContent,
		writeOptions: {
			actor,
			operation: 'generate_npm_workflow',
			viaForgeApi: true,
			surface: 'workflows',
		},
		recoveryOperation: 'recover_npm_workflow',
	};
}

/**
 * Runs the Bun-pin, npm, test, and size workflow writers as one recoverable batch bound to the
 * preflight target and generated bytes. On failure, earlier writes are restored only while their
 * bytes still match this batch's output; concurrent changes are preserved and reported as unrecovered.
 */
async function updateBunWorkflowPinsFromManifest(projectRoot, options = {}) {
	const npmWorkflow = require('./npm-publish-workflow');
	const testWorkflow = require('./test-workflow');
	const sizeWorkflow = require('./size-workflow');
	const { verifyExpectedHead } = npmWorkflow;
	const head = verifyExpectedHead(projectRoot, options.expectedHead, options.resolveHead);
	if (!head.success) return head;
	const sourceHead = head.sourceHead;
	const env = options.env || process.env;
	const actor = options.actor || env.FORGE_PROTECTED_STATE_ACTOR || env.FORGE_ACTOR || env.USER || env.USERNAME || 'unknown';

	let updates;
	let npmUpdate;
	let testUpdate;
	let sizeUpdate;
	try {
		const target = resolveBunVersionTarget(projectRoot, options);
		updates = BUN_WORKFLOW_SPECS.map(spec => deriveCheckedBunWorkflowUpdate(projectRoot, sourceHead, spec.path, target.version, options));
		npmUpdate = resolveNpmWorkflowUpdate(projectRoot, sourceHead, updates[0].version, actor, options);
		testUpdate = (options.resolveTestWorkflowUpdate || testWorkflow.resolveTestWorkflowUpdate)(
			projectRoot,
			sourceHead,
			options,
		);
		sizeUpdate = (options.resolveSizeWorkflowUpdate || sizeWorkflow.resolveSizeWorkflowUpdate)(
			projectRoot,
			sourceHead,
			options,
		);
	} catch (error) {
		return { success: false, error: error.message };
	}

	const authority = require('./protected-state-authority');
	const issueAuthorization = options.issueAuthorization || authority.issueBunWorkflowAuthorization;
	const completeAuthorization = options.completeAuthorization || authority.completeBunWorkflowAuthorization;
	const cancelAuthorizations = options.cancelAuthorizations || authority.cancelBunWorkflowBatchAuthorizations;
	const protectedWriter = options.writeProtectedFile || writeProtectedFile;
	const protectedRemover = options.removeProtectedFile || removeProtectedFile;
	const auditWriter = options.recordProtectedStateAuditEvent || recordProtectedStateAuditEvent;
	const results = [];
	const attempts = [];
	const authorizations = [];
	const context = {
		actor,
		sourceHead,
		version: updates[0].version,
		kernelDeps: options.kernelDeps,
		createCapabilityId: options.createCapabilityId || randomUUID,
		issueAuthorization,
		completeAuthorization,
		cancelAuthorizations,
		protectedWriter,
		protectedRemover,
		auditWriter,
		attempts,
		authorizations,
	};
	for (const update of updates) {
		const applied = await applyWorkflowUpdate(projectRoot, update, context);
		if (!applied.success) {
			return failedUpdate(applied.error, results, attempts, authorizations, projectRoot, context);
		}
		results.push(applied.result);
	}

	const npmGenerator = options.generateNpmPublishWorkflow || npmWorkflow.generateNpmPublishWorkflow;
	attempts.push(npmUpdate);
	const npmAuthorization = {
		actor,
		path: npmUpdate.path,
		sourceHead,
		capabilityId: context.createCapabilityId(),
	};
	authorizations.push(npmAuthorization);
	let npm;
	try {
		npm = await npmGenerator(projectRoot, {
			actor,
			env: options.env,
			kernelDeps: options.kernelDeps,
			expectedHead: sourceHead,
			resolveHead: options.resolveHead,
			bunVersion: updates[0].version,
			targetBunVersion: updates[0].version,
			capabilityId: npmAuthorization.capabilityId,
			expectedSnapshot: npmUpdate.original,
		});
	} catch (error) {
		return failedUpdate(error.message, results, attempts, authorizations, projectRoot, context);
	}
	if (!npm.success) {
		return failedUpdate(npm.error, results, attempts, authorizations, projectRoot, context, { npm });
	}

	const testAuthorization = {
		actor,
		path: testWorkflow.TEST_WORKFLOW_PATH,
		sourceHead,
		capabilityId: context.createCapabilityId(),
	};
	authorizations.push(testAuthorization);
	attempts.push({
		...testUpdate,
		original: testUpdate.snapshot,
		writeOptions: {
			actor,
			operation: 'generate_test_workflow',
			viaForgeApi: true,
			surface: 'workflows',
		},
		recoveryOperation: 'recover_test_workflow',
	});
	const testGenerator = options.generateTestWorkflow || testWorkflow.generateTestWorkflow;
	let testWorkflowResult;
	try {
		testWorkflowResult = await testGenerator(projectRoot, {
			actor,
			env: options.env,
			kernelDeps: options.kernelDeps,
			expectedHead: sourceHead,
			resolveHead: options.resolveHead,
			capabilityId: testAuthorization.capabilityId,
			createCapabilityId: () => testAuthorization.capabilityId,
			expectedSnapshot: testUpdate.snapshot,
			expectedUpdate: { version: testUpdate.version, content: testUpdate.content },
		});
	} catch (error) {
		return failedUpdate(error.message, results, attempts, authorizations, projectRoot, context, { npm });
	}
	if (!testWorkflowResult.success) {
		return failedUpdate(testWorkflowResult.error, results, attempts, authorizations, projectRoot, context, {
			npm,
			testWorkflow: testWorkflowResult,
		});
	}

	// size-check.yml is rendered whole by its own generator (one owner, one renderer).
	const sizeAuthorization = {
		actor,
		path: sizeWorkflow.SIZE_WORKFLOW_PATH,
		sourceHead,
		capabilityId: context.createCapabilityId(),
	};
	authorizations.push(sizeAuthorization);
	attempts.push({
		...sizeUpdate,
		original: sizeUpdate.snapshot,
		writeOptions: {
			actor,
			operation: 'generate_size_workflow',
			viaForgeApi: true,
			surface: 'workflows',
		},
		recoveryOperation: 'recover_size_workflow',
	});
	const sizeGenerator = options.generateSizeWorkflow || sizeWorkflow.generateSizeWorkflow;
	let sizeWorkflowResult;
	try {
		sizeWorkflowResult = await sizeGenerator(projectRoot, {
			actor,
			env: options.env,
			kernelDeps: options.kernelDeps,
			expectedHead: sourceHead,
			resolveHead: options.resolveHead,
			createCapabilityId: () => sizeAuthorization.capabilityId,
			expectedSnapshot: sizeUpdate.snapshot,
			expectedUpdate: { version: sizeUpdate.version, content: sizeUpdate.content },
		});
	} catch (error) {
		return failedUpdate(error.message, results, attempts, authorizations, projectRoot, context, {
			npm,
			testWorkflow: testWorkflowResult,
		});
	}
	if (!sizeWorkflowResult.success) {
		return failedUpdate(sizeWorkflowResult.error, results, attempts, authorizations, projectRoot, context, {
			npm,
			testWorkflow: testWorkflowResult,
			sizeWorkflow: sizeWorkflowResult,
		});
	}

	return {
		success: true,
		version: updates[0].version,
		paths: [...results.map(result => result.path), npm.path, testWorkflowResult.path, sizeWorkflowResult.path],
		results,
		npm,
		testWorkflow: testWorkflowResult,
		sizeWorkflow: sizeWorkflowResult,
	};
}

module.exports = {
	BUN_WORKFLOW_SPECS,
	readPinnedBunVersion,
	renderBunWorkflowPin,
	readSourceWorkflow,
	readIndexedWorkflow,
	readIndexedPackageManifest,
	readSourcePackageManifest,
	readCompleteBunPinBatch,
	resolveBunVersionTarget,
	resolveCurrentHead,
	deriveBunWorkflowUpdate,
	updateBunWorkflowPins,
};
