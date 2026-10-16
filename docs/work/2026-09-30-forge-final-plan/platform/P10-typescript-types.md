# P10 — TypeScript types for Forge's public surface

## Bottom line

1. **Decisions needed:** select the typing scope below; default A is JavaScript implementation, strict public boundaries, generated declarations and compiled TypeScript blocks. [inferred]
2. **Stay JavaScript for 0.1.0.** TypeScript consumers do not require a TypeScript implementation; declaration generation from JSDoc JavaScript is officially supported. [external: TypeScript sources in §4]
3. The current package has **no `exports`, `types`, `main` or `type` fields**, and `typecheck` explicitly skips checking; a supported installed API needs packaging work. [ran: manifest inventory; read: `package.json:20`]
4. Contracts, Flow and memory-core contain **zero JSDoc blocks** across 22 JavaScript files; Kernel has 44 typed JSDoc blocks across six of its 22 files. This is annotation work, not a ready-made type layer. [ran: §2]
5. The snapshot-corrected trial found **241 errors without strict mode and 5,418 with strict mode**, including imports; 3,636 strict diagnostics concern implicit types/inference/indexing. [ran: §3]
6. A raw emission probe produced **106 `.d.ts` files / 255,244 bytes / 1,915 `any` occurrences**, but returned `emitSkipped: true`; those partial, weak declarations are not a passing release artifact. [ran: §3]
7. Node 24/26 strip erasable types by default, but **do not type-check and refuse stripping under `node_modules`**; Node 26 removed the transform-types flag. Publish JavaScript runtime files. [external: §4]
8. Let block authors use TypeScript, then build the plan's **single `.cjs` action bundle**; keep type imports out of runtime dependencies and preserve runtime input/output validation. [read: plan:250; inferred]
9. Budget **9–18 worker-days for the selected public typing layer after API/schema freeze**, versus roughly **50–90 for a full production-source conversion**; these are planning estimates, not measured delivery rates. [inferred: §5]
10. Freeze schemas and public paths, annotate narrow facades, generate/diff types, and validate the **actual packed artifact** in Node 24/26 and TypeScript consumers. Revisit conversion on demonstrated type-maintenance pain, not runtime stripping alone. [inferred]

## Request, scope and evidence boundary

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p10-typescript-types-20261001",
  "contextDigest": "dd8fe73fedc75f5f1efbc11492e61bf70669043a11be51e49b17981bf0dac990",
  "context": {
    "summary": "Forge final-plan research. Feasibility of shipping TypeScript types for Forge's public contracts while staying a JavaScript codebase."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": { "write": true, "tools": [], "maxCostUsd": null },
  "route": { "model": "gpt-6.1-sol", "thinking": "xhigh", "search": true }
}
```

Research date: **2026-10-01**. Shared instructions were read first from `(local scratch)`. This leg is research only; API implementation, publication and ownership changes are outside its authorization. [read]

**Pinned repository evidence:** tracked `origin/master` is `7d448ec812ef8639790477af07c3c75962173f8a`; worktree HEAD is `ba56b9201782c4d1246c77bde6380867603184bf`. `git diff --name-only origin/master --` over all 47 inventory roots and `package.json` returned no differences. The initial wider diff found six changed files; only `lib/detect-worktree.js` entered the compiler graph. The final trial supplied that file's `git show origin/master:lib/detect-worktree.js` text through an in-memory compiler-host override. No source copy or generated type file was written. [ran]

**Remote freshness is unverified.** `git ls-remote origin refs/heads/master` failed because the configured network route could not connect to `127.0.0.1:9`. This report describes the inspected tracked master, not a newly fetched GitHub head. Primary-source web reads succeeded. [ran]

The platform plan is an untracked planning input, read from the assigned worktree: §3.1 at line 232, §3.2 at 339, §3.3 at 425, §3.4 at 558 and §3.5 at 607. Its outside ABI, compiler/catalog and supported package paths are **proposals**, not existing exports. [read]

The July Rust memo is absent at its named path in `origin/master`. The explicitly supplied file at `docs/work/2026-07-12-rust-vs-js-decision/decision.md` was read solely as the historical decision input; its codebase numbers and performance assertions are not current evidence. [ran/read]

Evidence labels: **[read]** inspected source/line; **[ran]** executed observation; **[external]** primary-source URL, accessed 2026-10-01; **[inferred]** recommendation or estimate. A compiler diagnostic is an observation, not proof of a runtime defect. No CI, installed-consumer certification or registry publication is claimed.

## 1. Proposed surface versus today's implementation

| Planned contract | Current foundation and source anchors | Typing consequence |
| --- | --- | --- |
| Block manifest and author ABI | Plan:232–337 defines `forge.author/v1`, separate manifest/interface versions, `operations`, `{input, config, services}` and `trusted-action-sync/v1`. Case-insensitive tracked-code search for `trusted-action-sync`, `forge.author`, `capability.catalog`, `catalog.list`, `previewEdit` and `applyEdit` across `lib`, `bin`, `package.json` returned no hits. [ran/read] | Implement/freeze the proposed boundary first. Generate manifest/domain types from its authoritative schemas; annotate callable handlers separately. A search miss does not prove that no differently named equivalent exists. [inferred] |
| Contracts and transfer envelopes | `lib/contracts/index.js:17`; definitions and payload fields in `src/definitions.js:176`; JSON Schema 2020-12 generator at `src/schema.js:10`; validators at `src/validate.js:339`. Eleven schema assets are tracked under `schemas/v1/`. [read/ran] | Reuse the existing schema/definition owner; do not create independent handwritten payload interfaces. Existing `CapabilityManifest` is a provider/transfer contract, not the proposed outside block manifest. [read: definitions; plan:345] |
| Config API | `lib/core/runtime-graph.js:972` resolves known config from a project root; `lib/config-writer.js:72,96` sets/removes sparse overrides. [read] | These do not yet implement the plan's pure `resolve/validate/explain/dryRun`, revision-checked whole-composition edit transaction, or public diagnostic/plan shapes. Adding declarations cannot supply missing behavior. [read: plan:427–445; inferred] |
| Capability catalog | `lib/plugin-catalog.js:359` exports a static workflow-tool catalog. The current Contracts manifest has a different purpose. [read] | Do not relabel this tool-installation catalog as the proposed operation/interface/effects catalog. Its public operation types must follow the actual new catalog compiler. [inferred] |
| Flow | `lib/flow/index.js:93`; `SkillRuntime` constructor/invoke at `src/skill-runtime.js:61,75`; executor factory at `src/executor.js:217`. Invocation is currently async. [read] | Type existing internal execution separately from the proposed synchronous author ABI. Do not advertise every monitor/loop/internal execution helper as a stable 0.1.x SDK simply because it is exported in source. [inferred; plan:348,358] |
| Memory | `lib/memory-core/index.js:319` aggregates five source modules plus monitor storage; registry execution at `src/backend-registry.js:113` returns its owning result/receipt shape. [read] | The proposed public notes projection and `services.lookup.invoke('recall', …)` result are distinct from driver objects and private receipts. Publish named domain results and a bound-service interface, preserving provenance in the owner. [read: plan:384–423; inferred] |
| Kernel | No `lib/kernel/index.js` appears in the tracked 22-file listing. Candidate owners include `broker.js:1677`, `owned-kernel.js:27,37` and `issue-command-contract.js:544`. [ran/read] | Create/select one narrow client/lifecycle boundary. Do not expose SQL, migration writers, private ACL machinery or generic guarded-event admission merely by generating types for all source exports. [inferred; plan:346,358] |
| Installed imports | Manifest fields `exports`, `types`, `main`, `type` are absent; `files` includes `lib/`. Existing source indices are CommonJS. [ran/read] | Proposed paths such as `forge-workflow/author`, `/contracts`, `/config`, `/blocks`, `/flow`, `/memory`, `/kernel` need explicit supported metadata and packed files. Audit current deep-import consumers before an export map seals paths. [inferred; plan:248,358] |

**Current schema assets [ran: tracked tree listing]:** capability-manifest, claim-request, context-packet, delivery-receipt, feedback-report, lease-receipt, monitor-event, monitor-receipt, run-receipt, structured-error and work-packet, each as `lib/contracts/schemas/v1/<name>.schema.json`. These are concrete starting assets; the planned block, solution, catalog, config-plan and bound-service schemas are additional work. [inferred]

## 2. Inventory and JSDoc coverage [ran]

Method: TypeScript 6.0.3 parsed each selected JavaScript file into an AST; top-level CommonJS assignments and index reexports were inventoried. JSDoc blocks were counted from `/** … */`; a block is called typed when it contains `@param`, `@return(s)`, `@type`, `@typedef`, `@template` or `@callback`. This measures presence, not correctness/completeness of annotations. Class methods and returned object methods are additional callable surface behind the listed exported symbol. [ran]

| Source family | JS files | Physical lines* | JSDoc blocks | Typed blocks | Files with typed blocks |
| --- | ---: | ---: | ---: | ---: | ---: |
| `lib/contracts` | 7 | 888 | 0 | 0 | 0 |
| `lib/flow` | 9 | 2,769 | 0 | 0 | 0 |
| `lib/memory-core` | 6 | 1,990 | 0 | 0 | 0 |
| `lib/kernel` | 22 | 13,784 | 52 | 44 | 6 |
| `lib/core/runtime-graph.js` | 1 | 1,052 | 0 | 0 | 0 |
| `lib/config-writer.js` | 1 | 203 | 9 | 3 | 1 |
| `lib/plugin-catalog.js` | 1 | 360 | 1 | 0 | 0 |

*The reproducible counter is `text.split('\n').length`, including a terminal empty line when present. The four requested families total **44 files / 19,431 lines**; with the three config/catalog candidates, **47 / 21,046**. No `@typedef` tag was found in the 44 requested-family files. [ran]

### Contracts: every file and source export

Paths below are relative to `lib/contracts/`; line numbers identify the export assignment. All seven files have zero JSDoc blocks. [ran]

| File:line | Exported symbols |
| --- | --- |
| `index.js:17` | `ENVELOPE_FIELDS`, `CONTRACTS`, `ContractValidationError`, `canonicalize`, `classifySemanticAttempt`, `computeContentHash`, `generateJsonSchema`, `parseContract`, `semanticIdentity`, `supportedSchemaVersions`, `validateContract`, `validateContractStructure`, `validateEnvelope`, `verifyContractBaseline` |
| `src/baseline.js:23` | `verifyContractBaseline` |
| `src/canonical.js:157` | `CanonicalizationError`, `canonicalize`, `computeContentHash`, `preflightCanonicalValue` |
| `src/definitions.js:176` | `ABSOLUTE_USER_PATH_PATTERN`, `CONTRACTS`, `EXTENSION_ID_MAX_LENGTH`, `EXTENSION_ID_PATTERN`, `PAYLOAD_FIELDS`, `SECRET_PATTERN` |
| `src/identity.js:42` | `classifySemanticAttempt`, `semanticIdentity` |
| `src/schema.js:72` | `generateJsonSchema`, `supportedSchemaVersions` |
| `src/validate.js:372` | `ContractValidationError`, `ENVELOPE_FIELDS`, `parseContract`, `validateContract`, `validateContractStructure`, `validateEnvelope` |

### Flow: every file and source export

Paths are relative to `lib/flow/`; all nine files have zero JSDoc blocks. [ran]

| File:line | Exported symbols |
| --- | --- |
| `index.js:93` | `BoundedLoopError`, `EfficiencySupervisor`, `FlowExecutionError`, `MonitorDurabilityError`, `MonitorRuntimeError`, `ProcessLifecycleError`, `SkillRuntime`, `createBoundedLoop`, `createBoundedLoopState`, `createMonitorReceipt`, `createMonitorDurabilityBridge`, `createMonitorState`, `createProcessLifecycle`, `createProcessState`, `createRunReceiptSkeleton`, `createWorkPacketExecutor`, `reduceBoundedLoop`, `reduceMonitor`, `reduceMonitorBatch`, `reduceProcessLifecycle` |
| `src/bounded-loop.js:448` | `BoundedLoopError`, `MAX_ATTEMPTS`, `EVENT_BYTE_BUDGET`, `MAX_ELAPSED_MS`, `MAX_EVENTS`, `MAX_HISTORY`, `createBoundedLoop`, `createBoundedLoopState`, `reduceBoundedLoop` |
| `src/efficiency-supervisor.js:90` | `EfficiencySupervisor`, `THRESHOLDS` |
| `src/executor.js:279` | `FlowExecutionError`, `createWorkPacketExecutor` |
| `src/monitor-durability.js:419` | `MonitorDurabilityError`, `createMonitorDurabilityBridge` |
| `src/monitor-runtime.js:468` | `MonitorRuntimeError`, `createMonitorReceipt`, `createMonitorState`, `reduceMonitor`, `reduceMonitorBatch` |
| `src/process-lifecycle.js:531` | `MAX_ATTEMPTS`, `EVENT_BYTE_BUDGET`, `MAX_ELAPSED_MS`, `MAX_EVENTS`, `MAX_GRACE_MS`, `MAX_HISTORY`, `ProcessLifecycleError`, `createProcessLifecycle`, `createProcessState`, `reduceProcessLifecycle` |
| `src/skill-runtime.js:365` | `DEFAULT_LIMITS`, `SkillRuntime` |
| `src/stable-stringify.js:19` | `stableStringify` |

### Memory: every file and source export

Paths are relative to `lib/memory-core/`; all six files have zero JSDoc blocks. [ran]

| File:line | Exported symbols |
| --- | --- |
| `index.js:319` | All five source-module exports below, plus `MonitorConflictError`, `MonitorStaleError`, `MonitorStoreError`, `MonitorTerminalError`, `MonitorUnavailableError`, `createMonitorStore` |
| `src/authority-provider.js:62` | `MEMORY_AUTHORITY_METHODS`, `MEMORY_PR_LIFECYCLE_METHODS`, `assertMemoryAuthorityProvider`, `createMemoryAuthorityProvider` |
| `src/backend-registry.js:174` | `BACKEND_METHODS`, `RECEIPT_SCHEMA_ID`, `RECEIPT_SCHEMA_VERSION`, `assertBackend`, `createMemoryBackendRegistry` |
| `src/feedback-intake.js:237` | `FEEDBACK_SCHEMA_ID`, `FeedbackIntakeError`, `createFeedbackIntake`, `createFeedbackReport`, `redactString` |
| `src/pr-lifecycle-authority.js:958` | `PR_LIFECYCLE_PROVIDER_METHODS`, `PrLifecycleAuthorityError`, `createPrLifecycleAuthority` |
| `src/usage-evidence.js:205` | `USE_KINDS`, `USAGE_EVIDENCE_MIGRATION`, `UsageIdempotencyConflictError`, `UsageMemoryScopeConflictError`, `appendUsageEvidence`, `createUsageEvidenceStore`, `installUsageEvidenceSchema`, `normalizeUsageEvidence`, `rebuildUsageProjection` |

The index exposes **32 source-level properties** after folding the spreads. Contracts exposes 14 and Flow 20. These counts are not a proposal to support all 66 in the installed public API. The Memory index's spread assignment emits an `export =` object declaration; an empty result from the checker's direct named-export enumeration was not treated as absence. [ran]

### Kernel: every file and source export

Paths are relative to `lib/kernel/`. The final column is **typed/all JSDoc blocks**; zero means zero blocks, not that runtime validation is absent. [ran]

| File:line | Exported symbols | Typed/all |
| --- | --- | ---: |
| `backing-issue.js:312` | `ensureBackingIssue`, `classifyBranch`, `deriveTitle`, `extractEncodedIssueId`, `findExistingLink`, `matchesIgnoreGlob`, `DEFAULT_PROTECTED_BRANCHES`, `DEFAULT_IGNORE_GLOBS`, `AUTO_STUB_LABEL` | 12/13 |
| `broker.js:2102` | `LOCAL_BROKER_PRAGMAS`, `buildLocalBrokerConfig`, `createLocalBroker`, `execMigrationStatement`, `resolveGitCommonDir` | 0 |
| `claim-reconciler.js:232` | `createManifestReader`, `createWorktreeInspector`, `reconcileClaims`, `reconcileKernelClaims`, `verifiedManifestForClaim` | 0 |
| `cli-broker-factory.js:136` | `buildKernelIssueDeps`, `buildMigratedKernelIssueDeps`, `ensureKernelMigrated`, `resolveKernelDatabasePath` | 4/5 |
| `close-on-merge.js:150` | `closeLinkedIssueOnMerge`, `buildMergeEvidence`, `buildCloseReason` | 5/6 |
| `conflict-signal.js:79` | `CONFLICT_SIGNAL`, `classifyConflictSignal` | 0 |
| `evaluators.js:189` | `buildConflict`, `dependencyCreatesCycle`, `evaluateKernelEvent`, `normalizePayload`, `stableStringify` | 0 |
| `fs-class.js:509` | `classifyFromSignals`, `gatherSignals`, `classifyFilesystem`, `assertFilesystemSafeForKernel`, `resetFilesystemWarningMemo`, `isUnsafeFsOverrideActive`, `defaultProbeDriveType`, `parseNetUseDriveType`, `pathStartsWith`, `REMEDIATION` | 0 |
| `issue-command-contract.js:544` | `ISSUE_COMMAND_CONTRACT`, `ISSUE_COMMAND_ERROR_SCHEMA`, `ISSUE_COMMAND_ERROR_SCHEMA_VERSION`, `ISSUE_COMMAND_EXIT_CODES`, `ISSUE_COMMAND_RESPONSE_SCHEMAS`, `ISSUE_COMMAND_SCHEMA_VERSION`, `ISSUE_PRIORITIES`, `ISSUE_STATUSES`, `ISSUE_TYPES`, `formatIssueCommandError`, `getIssueCommandContract`, `isValidIssuePriority`, `normalizePriority`, `resolveNextCommands` | 0 |
| `issue-id-resolver.js:180` | `MAX_AMBIGUOUS_CANDIDATES`, `MIN_ISSUE_ID_PREFIX_LENGTH`, `OPERATION_ID_POSITIONS`, `resolveIssueId`, `resolveIssueIdArgs` | 0 |
| `lease-enforcer.js:169` | `DEFAULT_LEASE_TTL_MS`, `buildClaimConflict`, `buildClaimRow`, `computeLeaseExpiry`, `isClaimOwnedBy`, `isLeaseExpired`, `isValidExpiresAt`, `planClaimAcquisition` | 0 |
| `legacy-claim-repair.js:433` | `CLAIM_STATES`, `ClaimRepairError`, `buildClaimRepairPlan`, `cleanupRestoreProofDirectory`, `createVerifiedClaimRepairBackup`, `prepareRestoreProofSnapshot`, `publicClaimRepairPreflight`, `verifyClaimRepairBackup` | 0 |
| `live-claim-projection.js:23` | `isLiveClaim`, `projectLiveClaims` | 0 |
| `migrations.js:460` | `buildClaimActiveLeaseMigration`, `buildEventExpectedRevisionMigration`, `buildIssueContentFieldsMigration`, `buildIssueFidelityColumnsMigration`, `buildKernelMigrationPlan`, `buildMemoryFtsMigration`, `buildMemoryProjectionMigration`, `buildMonitorDurabilityMigration`, `buildPrWatchOwnershipMigration`, `buildUsageEvidenceMigration`, `buildPrLinkageMigration`, `buildSchemaMigration`, `buildWorktreeLinkageColumnsMigration`, `memoryFtsDdl`, `validateKernelMigrations` | 0 |
| `owned-kernel.js:43` | `resolveOwnedKernel`, `closeIfOwned` | 0/3 |
| `planning-buckets-schema.js:101` | `BOARD_MUTATION_EVENT_TYPES`, `MILESTONE_STATES`, `PLANNING_BUCKET_TABLES`, `RELEASE_STATES`, `SPRINT_STATES`, `getPlanningBucketsSchema`, `validatePlanningBucketsSchema` | 2/2 |
| `projection-jsonl-writer.js:434` | `SCHEMA_VERSION`, `DEFAULT_PROJECTION_DIR`, `DEFAULT_PROJECTION_TARGET`, `DEFAULT_MAX_ATTEMPTS`, `DEFAULT_BASE_BACKOFF_MS`, `PROJECTION_FILE_ORDER`, `normalizeProjectionModel`, `buildProjectionSnapshot`, `serializeProjection`, `importProjection`, `resolveProjectionDir`, `writeProjection`, `readProjection`, `computeBackoff`, `runJsonlProjectionConsumer` | 0 |
| `readiness-model.js:493` | `READINESS_REASONS`, `READINESS_STATES`, `DEFAULT_TOP_K_READY_PICK`, `buildReadinessIndex`, `deriveReadiness`, `evaluateIssueContract`, `isWorkableStatus` | 3/4 |
| `schema.js:427` | `KERNEL_FIELD_AUTHORITIES`, `KERNEL_STORAGE_CLASSES`, `KERNEL_TABLES`, `classifyKernelStorage`, `cloneTableList`, `deepFreeze`, `field`, `getKernelSchema`, `index`, `table`, `validateKernelSchema` | 0/1 |
| `sqlite-driver.js:5940` | `BUILTIN_SQLITE_RUNTIME_ORDER`, `CONFLICT_SIGNAL`, `classifyConflictSignal`, `createBuiltinSQLiteDriver`, `hardenBackupPermissions`, `hardenBackupPermissionsBatch`, `requireSqliteRuntimeModule`, `resolveWindowsCscriptPath`, `secureWindowsPathsAcl`, `selectBuiltinSQLiteRuntime`, `syncClaimRepairRecoveryDirectory`, `validateBuiltinSQLiteRuntimeDriver`, `WINDOWS_PRIVATE_ACL_SCRIPT_PATH`, `WINDOWS_PRIVATE_ACL_SCRIPT_SHA256`, `_runWindowsProcess` | 0 |
| `taxonomy-validator.js:371` | `CLAIM_STATES`, `STATUS_TRANSITIONS`, `TERMINAL_STATUSES`, `TYPE_BEHAVIORS`, `TaxonomyValidationError`, `ISSUE_STATUSES`, `ISSUE_TYPES`, `assertAcyclicDependencies`, `findDependencyCycles`, `findParentCycle`, `getTypeBehavior`, `isClaimableType`, `isTerminalStatus`, `isValidIssueStatus`, `isValidIssueType`, `isValidStatusTransition`, `normalizeRank`, `priorityLabelForRank`, `rankForPriorityLabel`, `toEpochMillis`, `validateActiveClaimUniqueness`, `validateClaim`, `validateIssueTaxonomy`, `validateParentChild`, `validateStatusTransition` | 18/18 |
| `windows-private-acl.js:231` | Conditional CommonJS branch: `FILE_ALL_ACCESS`, `inspectDescriptor`, `inspectIidDescriptor`, `runWithDependencies`; the file also targets Windows Script Host globals. | 0 |

The broker factory returns methods including `initialize`, `runIssueOperation`, `runGuardedEvent`, `importIssues`, `listRecentEvents`, PR linkage/verdict operations and projection delivery operations (`broker.js:1826–2095`). That source object exceeds the proposed public client scope. `resolveOwnedKernel` currently returns broker/driver/config plus `ownsKernel`; blindly publishing its inferred return leaks private handles and mostly `any`. [read/ran; inferred]

### Config/catalog candidates: complete exports

| File:line | Source exports [ran] |
| --- | --- |
| `lib/core/runtime-graph.js:1026` | `RUNTIME_GRAPH_SCHEMA_VERSION`, `RUNTIME_GRAPH_SCHEMA`, `Phase`, `Action`, `Artifact`, `EvaluatorRegion`, `Gate`, `Evidence`, `Rail`, `Adapter`, `PlanningSubSkill`, `Role`, `ROLE_IDS`, `SUBSKILL_REGISTRY`, `getSubSkillDefinitions`, `getSubSkillIds`, `validateSubSkillList`, `validatePlanSubSkillList`, `loadRuntimeGraphConfig`, `lintRuntimeGraphConfig`, `resolveRuntimeGraph`, `getDefaultRuntimeGraph`, `buildRuntimeGraphEnvelope`, `getResolvedRuntimeGraph` |
| `lib/config-writer.js:195` | `getConfigPath`, `loadRawConfig`, `setConfigOverride`, `removeConfigOverride`, `resolveSkill`, `skillSearchDirs` |
| `lib/plugin-catalog.js:359` | `CATALOG`, `TIERS`, `TOOL_TYPES`, `STAGES`, `BUDGET_MODES`, `PREREQUISITES` |

## 3. checkJs and declaration trials [ran]

### Method and reproduction boundary

Installed tools were used without a dependency install: **Node v24.18.0**, **TypeScript 6.0.3**, **`@types/node` 26.5.0**. The compiler came from `node_modules/.bun/typescript@6.0.3/node_modules/typescript/lib/typescript.js`; Node declarations from the analogous `@types+node@26.5.0/node_modules/@types` directory. They are experiment tools from the existing installation, not declared Forge devDependencies. [ran]

The 47 roots are every `.js` under the four inventoried families, plus the three config/catalog candidates. Imports expanded checking to **105 `lib/` files**. There was no `noResolve`, mock driver typing, blanket `any` shim, source suppression or library-source exclusion. `skipLibCheck` skipped declaration-library checking, not Forge JavaScript. Windows Script Host/Bun/compiler-generated environments were not fabricated. Node 26 declaration availability does not certify Node 24 runtime compatibility. [ran]

The API trial was equivalent to these compiler options, with `strict` run once as false and once as true:

```json
{
  "allowJs": true,
  "checkJs": true,
  "noEmit": true,
  "target": "ES2022",
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  "resolveJsonModule": true,
  "skipLibCheck": true,
  "types": ["node"],
  "lib": ["ES2022"]
}
```

Execution used `ts.createProgram(roots, options, host)` and counted Error-category results from `ts.getPreEmitDiagnostics(program)`. The host replaced only the differing imported `detect-worktree.js` with the tracked-ref text. Other tested roots were verified equal to that ref. The **initial** current-worktree trial had 5,408 strict diagnostics; the corrected snapshot has **5,418**. Use the latter for planning. Non-strict counts were unchanged. [ran]

### Error counts by category

Every diagnostic is counted once; these are errors, not distinct defects. [ran]

| Category and TypeScript codes | Non-strict | Strict |
| --- | ---: | ---: |
| Implicit any, inference and indexing: 7005, 7006, 7008, 7017, 7019, 7022, 7023, 7024, 7031, 7034, 7053 | 0 | 3,636 |
| Shape, arguments, assignment, symbol handling, generic arity, readonly/callability: 2314, 2322, 2339, 2345, 2353, 2538, 2551, 2554, 2722, 2731, 2739, 2741, 2769, 4104 | 222 | 1,559 |
| Null/possibly undefined/unknown: 2531, 2532, 18046, 18047, 18048 | 1 | 203 |
| Missing environment globals/module: 2304, 2307, 2552 | 11 | 11 |
| JSDoc parse/signature/tag mismatch: 1016, 1127, 8024 | 6 | 6 |
| Disjoint comparison / duplicate assignment: 2367, 2783 | 1 | 3 |
| **Total** | **241** | **5,418** |

Dominant individual codes: **2339** (missing property) 174/1,447; **7006** (untyped parameter) 0/3,174; **7053** (indexing) 0/146; **18046** (unknown) 0/144. [ran]

| Location | Non-strict | Strict |
| --- | ---: | ---: |
| Contracts roots | 2 | 125 |
| Flow roots | 8 | 458 |
| Memory roots | 14 | 348 |
| Kernel roots | 107 | 1,991 |
| Runtime graph root | 4 | 147 |
| Config writer root | 0 | 3 |
| Plugin catalog root | 0 | 0 |
| **47 selected roots** | **135** | **3,072** |
| Imported files outside those roots | 106 | 2,346 |
| **Complete checked graph** | **241** | **5,418** |

The four requested families account for 131/2,922 diagnostics at their own source locations. “Include only public files” is not automatically an isolated program: imports bring legacy helpers into checking. The implementation plan must select a real boundary and its dependency typing work, not hide imported errors with ignored diagnostics. [ran/inferred]

### Representative diagnoses and implications

- `contracts/src/canonical.js:61,77` (2538): symbol keys are rejected by `fail()` immediately beforehand, but the compiler lacks its `never` return contract. The same pattern causes symbol interpolation diagnostics at `flow/src/bounded-loop.js:73,74`. This is evidence for annotating shared throwing helpers, not deleting the rejection. [read/ran/inferred]
- `core/runtime-graph.js:111,459,475,480` (2345): destructured fields such as `ideology`/`phase` are inferred as required while callers omit them. Establish the intended optional fields from runtime/schema behavior, then type the constructors; the diagnostic alone does not decide whether the callers or contract are wrong. [ran/inferred]
- `kernel/windows-private-acl.js:36,106,216–226`: eight missing-global diagnostics concern `VBArray`, `Enumerator`, `ActiveXObject`, `WScript`. This is a Windows Script Host program as well as a CommonJS test seam, not a normal Node public SDK entry. Give its actual host a separate declaration context if it remains checked. [read/ran/inferred]
- `package-root.js:84,138`: two `FORGE_COMPILED` name errors and one missing generated-assets module are build-environment/modeling work. A real compiler-define declaration and generated-asset declaration/build order are preferable to broad shims. [ran/inferred]
- The six JSDoc diagnostics are in imported `issue-backend.js:150`, `memory-recall.js:150,154`, `memory/router.js:222`, `package-manager-remediation.js:95`, `context-merge.js:186`. They concern comment parsing, optional parameter order and a stale tag; they are not proof that runtime JavaScript fails to parse. [read/ran]

### Declaration emission probe

To examine current inferred output without changing source, a separate **exploratory** program used `allowJs`, `declaration`, `emitDeclarationOnly`, `checkJs:false`, `noCheck:true`, and `noEmitOnError:false`; a `writeFile` callback captured bytes in memory. This configuration is not proposed for CI or release acceptance. [ran]

Result: **106 `.d.ts` files, 255,244 bytes**, no other file types, **1,915 textual `any` occurrences**. The concatenated declarations gzip to 58,043 bytes; this is **not an npm tarball size**. The emit result reported **`emitSkipped:true`** with no emit diagnostics; syntactic/options diagnostic queries returned none. A partial-output callback count cannot overrule the failed emit result. Its exact skip cause was not isolated in this research leg. [ran]

Observed output includes the weak parameter signature `createRunReceiptSkeleton(workPacket: any, options?: {})` and this complete inferred ownership signature:

```ts
// Inferred today, not recommended public contracts:
export function resolveOwnedKernel(projectRoot: any, deps?: {}): Promise<{
  broker: any; driver: any; config: any; ownsKernel: boolean;
}>;
```

The first result widens schema/status identifiers to strings and infers an empty collection as `never[]` in the probe; the second exposes implementation handles. The Memory index does emit a CommonJS `export =` aggregate, including spread exports, but its methods still depend on weak inferred types. Therefore: **emission capability exists; useful, complete public declarations do not yet exist**. [ran/inferred]

**Positive control:** a virtual JavaScript CommonJS module with JSDoc `string` input/return annotations was checked with `checkJs:true`, `strict:true`, `declaration:true`, `emitDeclarationOnly:true`, `noEmitOnError:true` and the same installed tools. It returned **zero errors, `emitSkipped:false`**, and exactly `export function echo(value: string): string;` plus its JSDoc comment. All output stayed in the callback: **zero host file writes**. This proves the compiler path can successfully check and emit annotated JS; it does not validate Forge's full public contracts. [ran]

## 4. Primary-source verification — accessed 2026-10-01

### Node 24 and 26

| Version boundary | Default, flags and warnings | Package/runtime consequence |
| --- | --- | --- |
| **24.0.0 minimum** | Erasable type stripping is default-on, classified release-candidate; disabling uses `--no-experimental-strip-types`. `--experimental-transform-types` enables syntax requiring transforms. [external: versioned v24.0 docs] | Do not describe every Node 24 minor as stable or warning-free. Built-in execution still performs no checking. |
| **24.3.0 onward** | Type stripping stops emitting an experimental warning. [external: current 24 history] | Earlier 24 minors retain the warning-era behavior; this recommendation needs no runtime TS at any minor. |
| **24.12.0 onward** | Stripping is stable; disable flag is `--no-strip-types`; current 24 docs retain `--experimental-transform-types`. [external: current 24 docs; CLI history] | A 24.x promise needs minor-aware documentation if users run TS locally. |
| **26.x** | Stable, default-on stripping; `--no-strip-types` disables it; **`--experimental-transform-types` was removed in 26.0.0**. [external: current 26 history] | Non-erasable features need a compiler/third-party runner, not that removed flag. |

Sources: [Node v24.0.0 TypeScript documentation](https://nodejs.org/download/release/v24.0.0/docs/api/typescript.html), [current Node 24 TypeScript documentation](https://nodejs.org/docs/latest-v24.x/api/typescript.html), [Node CLI stripping-flag history](https://nodejs.org/dist/latest/docs/api/all.html#--no-strip-types), [current Node 26 TypeScript documentation](https://nodejs.org/dist/latest/docs/api/typescript.html). These are dated/versioned documentation observations, not local Node 26 experiments. [external, accessed 2026-10-01]

Both documented implementations ignore `tsconfig.json`, require runtime module/import rules to be satisfied, and refuse stripping TypeScript beneath a `node_modules` directory. The documented error is `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`. Thus **default-on stripping is not permission to publish Forge or outside blocks as raw TS npm runtime code**. Runtime checking of schemas/admission also remains necessary. [external: [Node 24 errors](https://nodejs.org/download/release/v24.20.0/docs/api/errors.html#err_unsupported_node_modules_type_stripping); Node 24/26 TypeScript sources above, accessed 2026-10-01; inferred]

### Bun

Bun's `ts` loader handles `.ts`, `.mts`, `.cts`, strips TypeScript syntax and does **not** perform typechecking; `tsx` additionally transforms JSX. The runtime and bundler can support author development/builds, but running a TS block under Bun is not a static type-check result. Use a compiler check separately. `@types/bun` is a development typing input if Bun-specific internals are checked; it need not become a Forge runtime dependency or leak into the portable public SDK. [external: [Bun file types](https://bun.com/docs/runtime/file-types#ts), [Bun TypeScript setup](https://bun.com/docs/runtime/typescript), accessed 2026-10-01; inferred]

### TypeScript declaration emission from JavaScript

TypeScript officially supports JSDoc-backed declaration generation from JavaScript, introduced in 3.7. Its documented CLI is the combination **`--declaration --allowJs --emitDeclarationOnly --outDir types`**. Declaration-only emit does not transpile the runtime JavaScript. Add `checkJs` for checking and `noEmitOnError` for release generation; neither “the files were emitted” nor an `any`-filled signature is enough. [external: [Creating declarations from JS](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html), [emitDeclarationOnly reference](https://www.typescriptlang.org/tsconfig/emitDeclarationOnly.html), accessed 2026-10-01; inferred]

For supported subpaths, put the `types` condition first and match declarations to the actual module format. A CommonJS `.js` package with no `type:module` can use CommonJS-interpreted `.d.ts`; genuinely separate ESM/CJS runtime entries need appropriately matched declarations. Do not add dual runtime builds just to copy another SDK. Test both consumer resolution and runtime imports. [external: [TypeScript 4.7 package guidance](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7), [module/exports reference](https://www.typescriptlang.org/docs/handbook/modules/reference), accessed 2026-10-01; inferred]

### Vercel AI SDK and Mastra

| Primary-source snapshot | How it describes shipping types | What Forge should borrow |
| --- | --- | --- |
| Vercel `ai` main manifest, **7.0.123** | `main:./dist/index.js`, `types:./dist/index.d.ts`, `source:./src/index.ts`; root/internal/test export paths pair `types` with JavaScript imports. Files include dist and selected source/docs. Build uses `tsdown`; type-check uses `tsc --build`. [external] | Stable package paths with declaration/runtime pairing and a separate checker. This demonstrates a packaging pattern, not that Forge must adopt its implementation language, monorepo or build stack. [inferred] |
| Mastra `@mastra/core` main manifest, **1.73.0-alpha.0** | Root and many subpaths have import/require conditions mapping declarations and dist `.js`/`.cjs`; manifest ships dist and declaration files. `tsdown.config.ts` builds JS with `dts:false`, then invokes `generateTypes` from `@internal/types-builder`; typechecking is separate. [external] | Independent public subpaths and generation as a release input; not a giant SDK dependency or automatic dual-format requirement. [inferred] |

Sources: [AI SDK package manifest](https://raw.githubusercontent.com/vercel/ai/main/packages/ai/package.json), [Mastra core package manifest](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/package.json), [Mastra build config](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/tsdown.config.ts), [Mastra TS build config](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/tsconfig.build.json), accessed **2026-10-01**. These are moving main-branch source manifests, **not downloaded registry artifact verification**. Mastra's alpha version is not presented as its latest stable release. [external]

## 5. Path, effort and real-artifact release effects

### Recommended path: schema-owned data types plus JSDoc callable boundaries

1. **Freeze the actual 0.1.0 public selection.** Existing source exports are inventory, not support commitments. Keep one package; choose only the contracts, author/config/catalog and Memory/Flow/Kernel client operations needed by the demonstrators. Mark support/interface versions explicitly. [inferred]
2. **Reuse authoritative data schemas.** For existing envelopes, derive from the current definition/schema generation owner. For new public JSON contracts, the plan's schema/catalog owner generates declaration types and docs. A pinned development generator may be used; reject unsupported schema constructs instead of silently widening them. Do not hand-maintain a second payload truth. [read: schema.js:10; plan:427,436; inferred]
3. **JSDoc models functions and ports.** Annotate inputs, options, discriminated results, throw-only helpers as `never`, ownership/lifecycle and required capability clients. Use schema-generated types through JSDoc imports; use `unknown` at unchecked data boundaries and validate before narrowing. Public generics must retain operation-input/output relationships rather than returning `any`. [inferred]
4. **Keep runtime validation and authority owners.** TS structural types do not establish finite numbers, UUID/hash validity, bounded sizes, schema closure, exact artifact identity, admission, lease ownership or protected approval. Nor does `readonly` make data immutable at runtime. Preserve those checks and negative fixtures. [read: canonical/validate and plan; inferred]
5. **Generate declarations into one package.** Use declaration-only emit for selected facades plus the necessary declaration dependency closure. Explicit return/port types prevent declarations from exposing raw driver objects or importing runtime paths excluded by `files`. Keep CommonJS runtime behavior unless a separately justified change is approved. [inferred]

**Strictness must be honest.** Establish a fully passing strict program for selected supported entrypoints and the dependencies necessary to type them; expand internal coverage in deliberate batches. A boundary checked against an unchecked internal JS implementation proves the boundary contract, not that the whole implementation is checked. State that limitation. Do not install a failing global `checkJs` command and exempt its errors, or infer full-module coverage from the 47-file include list. [inferred; ran: 105-file closure]

### TypeScript outside authors

The plan's execution contract remains **one captured `.cjs` CommonJS bundle with `operations`**, JSON manifests/schemas and no supported runtime dependency imports. Authors can write TS/CTS, import Forge types with `import type`, and compile/bundle using their own toolchain. A development peer dependency is compatible with no runtime dependency closure. Test the final `.cjs` export shape; `export = { operations: … }` is a possible TS authoring form to avoid unintended module wrapper exports. Forge does not need to add a core bundler. [read: plan:248–268; inferred]

An operation's type should connect schema input, effective config, declared service slots and synchronous JSON output. The generated slot client carries exact operation names and `OK`/`INCOMPLETE` result unions. Async handlers/Promise results should fail static author checks **and** runtime conformance. A synchronous type is not cancellation or containment: admitted code can still detach work. The type layer must not claim otherwise. [read: plan:250–252, bound-client section; inferred]

### Effort estimates

One worker-day means a competent implementer day including local checking; these ranges are engineering judgment, not observed throughput. They exclude implementation of the new compiler/catalog/author host, API product decisions, personal-project migration and waiting for external reviewers. Work can overlap existing API implementation, so the numbers are not automatically additive to every other research leg. [inferred]

| Work after the selected API/schema freeze | JSDoc + public declarations |
| --- | ---: |
| Freeze export selection, schema/type ownership and consumer module policy | 1–2 days |
| Annotate selected callable facades, service ports/results; repair necessary dependency typing | 4–8 days |
| Schema-to-types and declaration generation, deterministic snapshots, package metadata/file closure | 2–4 days |
| Positive/negative consumer fixtures, real-tarball CI and release renderer integration | 2–4 days |
| **Selected public layer total** | **9–18 worker-days** |

Typing all 44 current module files **and** the wider imported graph, rather than the selected public layer, is a separate roughly **20–40 worker-day** undertaking after interfaces settle. The strict trial has 3,072 diagnostics in roots and 2,346 elsewhere; none of those counts can be divided by a constant “errors per day” to produce a delivery forecast. [ran/inferred]

A full production-source TypeScript conversion is roughly **50–90 worker-days / 10–18 serial worker-weeks**, including module/export handling, shared type models, dynamic-loading/dual-runtime adaptations, test/hook/build/publish migration and parity checks. This is a low-confidence order-of-magnitude budget. As a rough sizing census, the assigned worktree's `lib/` tree contains **285 `.js/.mjs/.cjs` files / 101,560 physical lines**; this broad census was not snapshot-corrected like the 47-file experiment and is approximate for tracked master. The July memo's ~188/~55K census is not an adequate migration budget today. Test/script conversion would add scope; renaming files alone is not a completed typed conversion. [ran/inferred]

### Package size and publish pipeline

The checked-in baseline says **1,320,089 tarball bytes, 4,805,641 unpacked bytes, 454 files** (`scripts/package-size-baseline.json`). Those are historical baseline values, **not a new pack measurement**. The exploratory declaration output adds 255,244 raw bytes before tar overhead/metadata, but exposes far too much internal surface; its 58,043-byte concatenated gzip figure is not an artifact delta. [read/ran]

For the narrow layer, use **50–150 KiB unpacked declaration/schema-typing growth** as a provisional budget hypothesis until packed measurement replaces it; existing schemas need not be duplicated. No reliable compressed increment is established here. TypeScript and environment declarations remain devDependencies; consumers need no Forge runtime compiler. A full conversion still ships JS plus types, so its npm runtime size could be similar if source TS/maps are excluded, or substantially larger if source, maps and duplicate runtime builds are all shipped. No size advantage follows from changing source language alone. [inferred]

Current release source has `npm pack --dry-run` at `.github/workflows/npm-publish.yml:118`, then separate `npm publish` branches at 154/157/160. The size checker describes `npm pack --dry-run --json --ignore-scripts` in `scripts/package-size-check.js:6`; the size job runs that checker at workflow:60. Workflows are generated: change `lib/npm-publish-workflow.js` / `lib/size-workflow.js`, then use the guarded supported regeneration path. Do not hand-edit generated workflow YAML. [read]

**Real artifact acceptance sequence [inferred]:**

1. Frozen install; generate schema types, check the selected strict JS program, emit with `noEmitOnError:true`, and reject any compiler/emit failure.
2. Regenerate committed public declaration/schema snapshots into temporary output and byte-diff the full expected inventory; detect additions/removals as well as changed bytes. Pin compiler/generator versions. Avoid absolute-path/timestamp leakage.
3. Build the final publication tree, then **pack one actual tarball**. Record compressed/unpacked size, file inventory, SHA/integrity and exact source head. Assert every exported runtime/type/schema target and every declaration import closure is present.
4. Install that tarball into clean external fixtures without source-tree aliases. Compile NodeNext `.cts` and `.mts` consumers, plus the framework/bundler consumer if supported; run actual runtime imports on Node 24 and 26 and the pinned Bun profile. A source-tree fixture cannot stand in for this.
5. Include meaningful failing examples: Promise-returning sync action, wrong operation input/result, missing required slot, nonexistent operation/subpath and attempted private-driver import. Positive examples include a TS-built `.cjs` block and the real Memory service binding.
6. Publish **the same verified tarball**, not a repack of a possibly changed checkout. Preserve exact-head release-suite receipts and existing gates. Place size measurement after type generation, including any prepack work; ensure the size and publish paths examine the same file set.

Prefer committed **generated public** declarations as drift snapshots for the first release; do not commit a declaration mirror of every internal file. An artifact-only generation scheme is a valid later alternative if CI compares a complete checked contract inventory and consumers still prove the exact packed output. A raw “typecheck passes” badge does not prove package inclusion, module resolution or runtime import correctness. [inferred]

## 6. Language alternatives and the Rust memo's revisit triggers

| Alternative | Evidence and deciding trade-off | Why rejected now; what would change it |
| --- | --- | --- |
| **JSDoc + generated public declarations** | Official JS emit support; current code remains runnable JS; static public author/client typing adds value without a runtime language move. Current annotation debt is measured. [external/ran] | **Recommended.** Change course if real outside consumers cannot express required operation/slot relationships cleanly, or the same public models repeatedly diverge despite schema generation. [inferred] |
| **Full TypeScript source conversion** | Inline types/generics and broader strictness can improve internal refactoring. It still needs annotation, schema validation, compiled JS publishing and release changes; renaming does not remove the 5,418 diagnostics. [ran/external/inferred] | Defer the blanket conversion before 0.1.0. Revisit after two or more modules demonstrate high recurring JSDoc maintenance cost, cross-module type defects/refactor failures, and a bounded conversion delivers simpler types without disrupting runtime/publish parity. Convert that module first. [inferred] |
| **Handwritten public `.d.ts` only** | Quick, small initial surface; creates a separate API truth unless implementation conformance is checked. [inferred] | Reject as the primary path. Reserve a small declaration adapter only for a shape the compiler cannot faithfully express, with owner-linked generation/conformance proof. A demonstrated compiler limitation could justify it. [inferred] |
| **Raw TS npm runtime, relying on Node/Bun** | Node refuses dependency stripping and Node/Bun do not perform runtime static checking; supported author profile is `.cjs`. [external/read] | Reject. Would require a deliberate supported loader/runtime and closure policy change, not a types feature. [inferred] |
| **Rust or Python rewrite** | Neither supplies the TS public developer contract automatically. Both change runtime/tooling/integration boundaries; the inspected broker and SQLite paths already have existing JS owners. [read/inferred] | Reject a language rewrite to obtain types. A demonstrated workload-specific component benefit, independently affordable migration and retained JS/typed API seam could change that component decision. [inferred] |

### Quick recheck of historical Rust triggers

The July memo recommends a component behind the existing broker contract if a trigger emerges, rather than rewriting everything. Its triggers and this leg's current evidence are:

| Trigger from historical memo | Current inspected evidence | Verdict |
| --- | --- | --- |
| Long-lived multi-client Kernel server with real concurrency | `broker.js:43` now serializes overlapping async transactions on one connection; `createLocalBroker` at 1677 returns an in-process object. Case-insensitive tracked search for `createServer`/`.listen(` under `lib/kernel` returned no hits. [read/ran] | Some concurrency handling exists; **a production multi-client server is not established by this inspection**. Search absence is limited evidence, not universal proof. Revisit at the actual server component and load measurements. [inferred] |
| Forge-owned hook latency exceeds ~500 ms and compiled Bun cannot fix it | Benchmark timing hooks exist (`scripts/benchmark.js:273,275`); no new timings or compiled-Bun comparison were run. [read/ran] | **Unknown.** The memo's cold-start figures cannot decide this today. [inferred] |
| A CPU-bound JS hot path dominates a command; memo suggests >20% wall time before FFI | No CPU profile was run. `sqlite-driver.js:35,55,73` still selects builtin `bun:sqlite`/`node:sqlite` with `nativeCompileDependency:false`. [read] | **Not demonstrated.** Do not infer “no hot path” from SQLite's implementation or old workload counts. [inferred] |
| Development stops being agent-authored JS | Current runtime sources inspected are JS; this leg did not measure author productivity or future contributor preference. [read] | No affirmative trigger established; the memo's claim that agents are weak in Rust is an untested historical judgment, not evidence used here. [inferred] |

The runtime dependency manifest now lists `@babel/parser`, `cross-spawn`, `yaml`, rather than the memo's `fastest-levenshtein` trio. The memo's assertion that coverage/mutation/TDD already catch type/undefined bugs does not prove static contract correctness; this trial does not prove those diagnostics are production failures either. **Keep the language decision; replace stale certainty with measured profiles and current API evidence.** [read/ran/inferred]

## Bottom line — decision recap (10 lines)

1. Choose A: retain JavaScript and make selected public contracts strongly typed. [inferred]
2. Public SDK packaging and schemas are prerequisites, not consequences of renaming source files. [read/inferred]
3. Existing indices provide useful foundations, but do not freeze every internal export as supported. [read/inferred]
4. Zero typed JSDoc in Contracts/Flow/Memory makes an annotation budget necessary. [ran]
5. The corrected strict trial has 5,418 diagnostics; a full-program flip is a separate migration. [ran/inferred]
6. Current inferred emission is weak and reports skipped output; never ship that probe as success. [ran]
7. Publish JavaScript plus generated declarations; Node stripping is not package distribution support. [external/inferred]
8. TypeScript authors build the admitted `.cjs` artifact and retain schema/runtime refusal checks. [read/inferred]
9. Measure and test the exact tarball, including declaration closure, before publishing its identical bytes. [inferred]
10. Revisit module conversion or a Rust component only when maintenance or workload evidence pays for it. [inferred]

## Recommended plan changes

1. **Add a language/typing decision to §3.1–3.3:** JavaScript implementation; TypeScript is development tooling and a supported authoring language; public JSON shapes derive from authoritative schemas; callable contracts use JSDoc; no raw TS npm runtime requirement. [inferred]
2. **Add an export/type contract lock:** exact supported subpaths, interface/support versions, operation/result types and CJS/ESM consumer forms. Explicitly separate current `CapabilityManifest`, the new block manifest and the operation catalog. [inferred]
3. **Add a typing workstream after contract freeze:** replace the `package.json:20` no-op with a real, bounded passing check; keep broad internal migration separately costed. Annotate throw-only helpers and port/ownership results before attempting wholesale declaration emit. [inferred]
4. **Add the release proof:** deterministic public declaration drift check; correct metadata/file inclusion; real tarball install and positive/negative TS consumer fixtures; runtime matrix retained; publish the verified tarball. Update workflow renderers through their existing protected path. [inferred]
5. **Add a TS author example to outside-author proof:** schema-specific input/output, at least one bound synchronous Memory call, a compiled single `.cjs` entry and an async-output refusal case. Use the same catalog and ABI, not a TS-only block family. [inferred]
6. **Rebudget:** 9–18 worker-days for selected typing once API/schema behavior exists. Do not count the general compiler/catalog implementation twice, or represent all-module strictness/full conversion as included. [inferred]

## Open questions for the owner

These are planning choices, not permission to implement in this research phase. A label or combination is sufficient; silence means the stated default. [inferred]

| Choice | Scope | Reasoning |
| --- | --- | --- |
| **A — Public types first (default)** | JS remains the implementation; strict supported boundaries, schema-generated data types, declaration drift/packed-consumer proof; compiled TS blocks. | Directly serves outside authors and framework users without making the 105-file legacy graph or a language conversion a release prerequisite. Internal coverage is stated honestly. |
| **B — Full module checkJs first** | Type all current Contracts/Flow/Memory/Kernel modules and required dependency graph before calling the public SDK ready. Keep JS. | More internal assurance, but roughly 20–40 worker-days and legacy/environment annotation cleanup enter the critical path. Select if broad internal type safety is itself a 0.1.0 requirement. |
| **C — Convert selected modules to TS** | After contract freeze, convert one or more named modules while retaining compiled JS distribution, schemas and identical artifact proof; recost individually. | Useful if complex generic relationships materially resist readable JSDoc. It does not authorize a full rewrite or remove annotation/runtime-validation work. |

**Default: A.** No separate owner decision is needed to let block authors compile TypeScript within the already proposed `.cjs` ABI. The owner does need to choose whether broad internal typing or selected source conversion should extend the release critical path.

## Confidence

**High** in the pinned-source inventory, JSDoc counts, corrected diagnostic totals, observed weak declaration output and documented Node/Bun/TypeScript packaging constraints. **Medium** that the selected-boundary path is the best 0.1.0 trade-off, because final public schemas/facades and the declaration closure are not implemented. **Low-to-medium** in effort/size forecasts; these need a representative completed module and a real package delta. Live GitHub freshness, Node 26 local execution, installed package resolution, a full successful repository emit, real tarball size and current Rust-trigger performance remain **unverified**. This phase delivers research evidence and a plan recommendation, not SDK readiness.
