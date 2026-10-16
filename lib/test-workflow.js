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
const {
	issueTestWorkflowAuthorization,
	completeTestWorkflowAuthorization,
} = require('./protected-state-authority');
const {
	readIndexedPackageManifest,
	readPinnedBunVersion,
	readSourcePackageManifest,
	resolveCurrentHead,
} = require('./bun-workflow-pins');

const TEST_WORKFLOW_PATH = '.github/workflows/test.yml';
const TEST_WORKFLOW_TEMPLATE_PATH = 'lib/workflow-templates/test.yml';
const BUN_VERSION_PLACEHOLDER = '__BUN_VERSION__';
const BUN_VERSION_PLACEHOLDER_COUNT = 9;

/**
 * Renders the canonical test workflow as exact bytes for one stable Bun version.
 * The template must contain exactly nine version placeholders so every substitution is deterministic.
 *
 * @param {Buffer|string} template canonical workflow template bytes
 * @param {string} bunVersion exact stable Bun version
 * @returns {Buffer} rendered workflow bytes
 * @throws {Error} when the version is not exact or the template placeholder count is not nine
 */
function renderTestWorkflow(template, bunVersion) {
	if (!/^\d+\.\d+\.\d+$/.test(bunVersion)) {
		throw new Error('Test workflow requires an exact stable Bun version.');
	}
	const source = Buffer.from(template).toString('utf8');
	const count = source.split(BUN_VERSION_PLACEHOLDER).length - 1;
	if (count !== BUN_VERSION_PLACEHOLDER_COUNT) {
		throw new Error(`Test workflow template must contain exactly ${BUN_VERSION_PLACEHOLDER_COUNT} ${BUN_VERSION_PLACEHOLDER} placeholders; found ${count}.`);
	}
	return Buffer.from(source.replaceAll(BUN_VERSION_PLACEHOLDER, bunVersion));
}

function readGitFile(projectRoot, revision, filePath, execGit = secureExecFileSync) {
	const indexed = revision === ':';
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const entry = execGit('git', indexed
		? ['ls-files', '--stage', '--', filePath]
		: ['ls-tree', revision, '--', filePath], options).trim();
	const suffix = filePath.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
	const expected = indexed
		? new RegExp(String.raw`^100(?:644|755) [0-9a-f]+ 0\t${suffix}$`)
		: new RegExp(String.raw`^100(?:644|755) blob [0-9a-f]+\t${suffix}$`);
	if (!expected.test(entry)) {
		const location = indexed ? 'in the Git index' : `at ${revision}`;
		throw new Error(`${filePath} is not one regular file ${location}.`);
	}
	return Buffer.from(execGit('git', ['show', `${revision}${indexed ? '' : ':'}${filePath}`], {
		...options,
		encoding: 'buffer',
	}));
}

function projectionObjectId(raw, filePath, indexed, sourceHead) {
	const suffix = filePath.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
	const matching = raw.trim().split(/\r?\n/).filter(line => line.endsWith(`\t${filePath}`));
	if (matching.length === 0) return null;
	const pattern = indexed
		? new RegExp(String.raw`^100(?:644|755) ([0-9a-f]+) 0\t${suffix}$`)
		: new RegExp(String.raw`^100(?:644|755) blob ([0-9a-f]+)\t${suffix}$`);
	if (matching.length !== 1 || !pattern.test(matching[0])) {
		const location = indexed ? 'in the Git index' : `at ${sourceHead}`;
		throw new Error(`${filePath} is not one regular file ${location}.`);
	}
	return pattern.exec(matching[0])[1];
}

/**
 * Captures the committed package/template and stage-0 package/template/target by Git blob ID.
 * A missing template remains null for legacy/bootstrap handling; nonregular or conflicted entries fail closed.
 *
 * @param {string} projectRoot repository root
 * @param {string} sourceHead immutable source commit
 * @param {Function} execGit Git execution seam
 * @returns {{sourcePackage: Buffer, indexedPackage: Buffer, sourceTemplate: Buffer|null, indexedTemplate: Buffer|null, indexedWorkflow: Buffer|null}}
 * @throws {Error} when required package blobs or present workflow entries are not one regular file
 */
function readTestWorkflowProjection(projectRoot, sourceHead, execGit = secureExecFileSync) {
	const options = {
		cwd: projectRoot,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
	};
	const sourceEntries = execGit('git', [
		'ls-tree', sourceHead, '--', 'package.json', TEST_WORKFLOW_TEMPLATE_PATH,
	], options);
	const indexedEntries = execGit('git', [
		'ls-files', '--stage', '--', 'package.json', TEST_WORKFLOW_TEMPLATE_PATH, TEST_WORKFLOW_PATH,
	], options);
	const sourcePackageId = projectionObjectId(sourceEntries, 'package.json', false, sourceHead);
	const indexedPackageId = projectionObjectId(indexedEntries, 'package.json', true, sourceHead);
	if (sourcePackageId === null) throw new Error(`package.json is not a regular file at ${sourceHead}.`);
	if (indexedPackageId === null) throw new Error('package.json is not one regular file in the Git index.');
	const readObject = objectId => Buffer.from(execGit('git', ['cat-file', 'blob', objectId], {
		...options,
		encoding: 'buffer',
	}));
	const readOptionalObject = objectId => objectId === null ? null : readObject(objectId);
	const sourceTemplateId = projectionObjectId(sourceEntries, TEST_WORKFLOW_TEMPLATE_PATH, false, sourceHead);
	const indexedTemplateId = projectionObjectId(indexedEntries, TEST_WORKFLOW_TEMPLATE_PATH, true, sourceHead);
	return {
		sourcePackage: readObject(sourcePackageId),
		indexedPackage: readObject(indexedPackageId),
		sourceTemplate: readOptionalObject(sourceTemplateId),
		indexedTemplate: readOptionalObject(indexedTemplateId),
		indexedWorkflow: sourceTemplateId === null && indexedTemplateId === null
			? null
			: readOptionalObject(projectionObjectId(indexedEntries, TEST_WORKFLOW_PATH, true, sourceHead)),
	};
}

function readRegularFile(projectRoot, filePath) {
	const fullPath = path.join(projectRoot, filePath);
	const stat = fs.lstatSync(fullPath);
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${filePath} must be a regular file.`);
	return fs.readFileSync(fullPath);
}

function snapshotWorkflow(projectRoot) {
	const fullPath = path.join(projectRoot, TEST_WORKFLOW_PATH);
	try {
		const stat = fs.lstatSync(fullPath);
		if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${TEST_WORKFLOW_PATH} must be a regular file.`);
		return { existed: true, content: fs.readFileSync(fullPath) };
	} catch (error) {
		if (error.code === 'ENOENT') return { existed: false, content: null };
		throw error;
	}
}

function sameSnapshot(left, right) {
	return left?.existed === right?.existed
		&& (!left?.existed || (Buffer.isBuffer(left.content) && left.content.equals(right.content)));
}

/**
 * Resolves one exact workflow update after checking HEAD, source baseline, index, and working-tree consistency.
 * The result includes exact new bytes and the compare-and-swap snapshot used for recovery.
 *
 * @param {string} projectRoot repository root
 * @param {string} sourceHead immutable source commit
 * @param {object} options dependency seams and staged-state readers
 * @returns {object} validated update, compare-and-swap snapshot, and exact output bytes
 * @throws {Error} when the source baseline is noncanonical or staged/working bytes have drifted
 */
function resolveTestWorkflowUpdate(projectRoot, sourceHead, options = {}) {
	const currentHead = (options.resolveHead || resolveCurrentHead)(projectRoot, options.execGit);
	if (currentHead !== sourceHead) {
		throw new Error(`Protected test workflow source HEAD changed from ${sourceHead} to ${currentHead}.`);
	}

	const sourcePackage = Buffer.from((options.readSourcePackageManifest || readSourcePackageManifest)(
		projectRoot,
		sourceHead,
		options.execGit,
	));
	const indexedPackage = Buffer.from((options.readIndexedPackageManifest || readIndexedPackageManifest)(
		projectRoot,
		options.execGit,
	));
	const workingPackage = readRegularFile(projectRoot, 'package.json');
	if (!workingPackage.equals(indexedPackage)) {
		throw new Error('package.json differs from the Git index; stage the intended manifest before generating test.yml.');
	}

	const sourceTemplate = Buffer.from((options.readSourceTemplate || readGitFile)(
		projectRoot,
		sourceHead,
		TEST_WORKFLOW_TEMPLATE_PATH,
		options.execGit,
	));
	const indexedTemplate = Buffer.from((options.readIndexedTemplate || readGitFile)(
		projectRoot,
		':',
		TEST_WORKFLOW_TEMPLATE_PATH,
		options.execGit,
	));
	const workingTemplate = readRegularFile(projectRoot, TEST_WORKFLOW_TEMPLATE_PATH);
	if (!workingTemplate.equals(indexedTemplate)) {
		throw new Error(`${TEST_WORKFLOW_TEMPLATE_PATH} differs from the Git index; stage the intended template before generating test.yml.`);
	}

	const sourceWorkflow = Buffer.from((options.readSourceWorkflow || readGitFile)(
		projectRoot,
		sourceHead,
		TEST_WORKFLOW_PATH,
		options.execGit,
	));
	const sourceVersion = readPinnedBunVersion(sourcePackage);
	const baseline = renderTestWorkflow(sourceTemplate, sourceVersion);
	if (!sourceWorkflow.equals(baseline)) {
		throw new Error(`${TEST_WORKFLOW_PATH} at ${sourceHead} differs from its canonical template output.`);
	}

	const version = readPinnedBunVersion(indexedPackage);
	const content = renderTestWorkflow(indexedTemplate, version);
	const snapshot = snapshotWorkflow(projectRoot);
	if (!snapshot.existed || (!snapshot.content.equals(baseline) && !snapshot.content.equals(content))) {
		throw new Error(`${TEST_WORKFLOW_PATH} has unrelated local edits; restore or commit them before generation.`);
	}
	const indexedWorkflow = Buffer.from((options.readIndexedWorkflow || readGitFile)(
		projectRoot,
		':',
		TEST_WORKFLOW_PATH,
		options.execGit,
	));
	if (!indexedWorkflow.equals(baseline) && !indexedWorkflow.equals(content)) {
		throw new Error(`${TEST_WORKFLOW_PATH} has unrelated staged edits; restore or commit them before generation.`);
	}

	return { path: TEST_WORKFLOW_PATH, sourceHead, version, baseline, content, indexedWorkflow, snapshot };
}

function recoverWorkflow(snapshot, projectRoot, generatedContent, protectedWriter, protectedRemover, writeOptions) {
	const recoveryOptions = {
		...writeOptions,
		operation: 'recover_test_workflow',
		expectedContent: generatedContent,
	};
	return snapshot.existed
		? protectedWriter(projectRoot, TEST_WORKFLOW_PATH, snapshot.content, recoveryOptions)
		: protectedRemover(projectRoot, TEST_WORKFLOW_PATH, recoveryOptions);
}

function attemptRecovery(snapshot, projectRoot, generatedContent, protectedWriter, protectedRemover, writeOptions) {
	try {
		return recoverWorkflow(snapshot, projectRoot, generatedContent, protectedWriter, protectedRemover, writeOptions);
	} catch (error) {
		return { allowed: false, reason: error.message };
	}
}

function matchesExpectedUpdate(expectedUpdate, update) {
	if (!expectedUpdate) return true;
	try {
		return expectedUpdate.version === update.version
			&& Buffer.from(expectedUpdate.content).equals(update.content);
	} catch {
		return false;
	}
}

/**
 * Generates test.yml by validating HEAD/preflight bindings, authorizing exact bytes, writing atomically,
 * auditing, and recording completion. Audit or completion failures conditionally restore the prior snapshot.
 *
 * @param {string} projectRoot repository root
 * @param {object} options expected HEAD, actor, staged-state seams, and protected writer dependencies
 * @returns {Promise<object>} success evidence or a handled failure with recovery evidence when applicable
 * @throws {Error} when snapshot inspection itself cannot read the target filesystem state
 */
async function generateTestWorkflow(projectRoot, options = {}) {
	const { verifyExpectedHead } = require('./npm-publish-workflow');
	const head = verifyExpectedHead(projectRoot, options.expectedHead, options.resolveHead);
	if (!head.success) return head;
	const sourceHead = head.sourceHead;
	if (options.expectedSnapshot && !sameSnapshot(options.expectedSnapshot, snapshotWorkflow(projectRoot))) {
		return { success: false, error: `${TEST_WORKFLOW_PATH} changed after Bun pin batch preflight.` };
	}
	let update;
	try {
		update = resolveTestWorkflowUpdate(projectRoot, sourceHead, options);
	} catch (error) {
		return { success: false, error: error.message };
	}
	if (!matchesExpectedUpdate(options.expectedUpdate, update)) {
		return { success: false, error: `${TEST_WORKFLOW_PATH} changed after Bun pin batch preflight.` };
	}

	const env = options.env || process.env;
	const actor = options.actor || env.FORGE_PROTECTED_STATE_ACTOR || env.FORGE_ACTOR || env.USER || env.USERNAME || 'unknown';
	const capabilityId = (options.createCapabilityId || randomUUID)();
	const issueAuthorization = options.issueAuthorization || issueTestWorkflowAuthorization;
	const completeAuthorization = options.completeAuthorization || completeTestWorkflowAuthorization;
	const protectedWriter = options.writeProtectedFile || writeProtectedFile;
	const protectedRemover = options.removeProtectedFile || removeProtectedFile;
	const auditWriter = options.recordProtectedStateAuditEvent || recordProtectedStateAuditEvent;
	let authorization;
	try {
		authorization = await issueAuthorization(projectRoot, {
			actor,
			sourceHead,
			targetBunVersion: update.version,
		}, { deps: options.kernelDeps, capabilityId });
	} catch (error) {
		authorization = { success: false, error: error.message };
	}
	if (!authorization.success || authorization.capabilityId !== capabilityId) {
		return { success: false, error: `Could not authorize ${TEST_WORKFLOW_PATH}: ${authorization.error || 'authority returned a different capability id.'}` };
	}

	const writeOptions = {
		actor,
		operation: 'generate_test_workflow',
		viaForgeApi: true,
		surface: 'workflows',
		expectedContent: update.snapshot.content,
		...(options.beforeAtomicCommit ? { beforeAtomicCommit: options.beforeAtomicCommit } : {}),
	};
	let write;
	try {
		write = protectedWriter(projectRoot, TEST_WORKFLOW_PATH, update.content, writeOptions);
	} catch (error) {
		return { success: false, error: error.message };
	}
	if (!write.allowed) return { success: false, error: write.reason, write };

	const audit = (() => {
		try {
			return auditWriter(createProtectedStateAuditRecord({
				actor,
				surface: 'workflows',
				path: TEST_WORKFLOW_PATH,
				content: update.content,
				operation: 'generate_test_workflow',
				viaForgeApi: true,
				sourceHead,
			}), { cwd: projectRoot });
		} catch (error) {
			return { success: false, error: error.message };
		}
	})();
	if (!audit.success) {
		const recovery = attemptRecovery(update.snapshot, projectRoot, update.content, protectedWriter, protectedRemover, writeOptions);
		return { success: false, error: `Could not record ${TEST_WORKFLOW_PATH}: ${audit.error}`, audit, recovery };
	}

	let completion;
	try {
		completion = await completeAuthorization(projectRoot, {
			actor,
			sourceHead,
			capabilityId,
			targetBunVersion: update.version,
		}, { deps: options.kernelDeps });
	} catch (error) {
		completion = { success: false, error: error.message };
	}
	if (!completion.success) {
		const recovery = attemptRecovery(update.snapshot, projectRoot, update.content, protectedWriter, protectedRemover, writeOptions);
		return { success: false, error: `Could not complete ${TEST_WORKFLOW_PATH}: ${completion.error}`, audit, completion, recovery };
	}

	return {
		success: true,
		path: TEST_WORKFLOW_PATH,
		sourceHead,
		bunVersion: update.version,
		contentHash: write.contentHash,
		write,
		audit,
		authorization,
		completion,
	};
}

module.exports = {
	BUN_VERSION_PLACEHOLDER,
	// Preserve the existing deep-import name while canonical callers use template terminology.
	BUN_VERSION_TOKEN: BUN_VERSION_PLACEHOLDER,
	TEST_WORKFLOW_PATH,
	TEST_WORKFLOW_TEMPLATE_PATH,
	renderTestWorkflow,
	readGitFile,
	readTestWorkflowProjection,
	resolveTestWorkflowUpdate,
	generateTestWorkflow,
};
