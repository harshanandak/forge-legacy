## Bottom line

1. Decisions needed: how broad the first public API should be; default to the existing substrate plus narrow, demanded provider seams. [inferred]
2. Master's 286 JavaScript modules contain 626 internal literal require sites, 607 distinct file edges, and six file-level cycle groups. [ran]
3. The physical graph has 22 code areas and 52 inter-area edges; splitting root files by responsibility exposes 33 areas and 115 edges. [ran]
4. Only Contracts, Flow, and Memory core have structural entry/dependency enforcement; package-size buckets are a different decomposition. [read]
5. Contracts is dependency-free within lib; Flow and Memory core depend only on its public entry. These are the strongest existing blocks. [ran]
6. Kernel is the sole authority, but its present implementation reaches workflow enforcement, memory normalization, and compatibility adapters. [read]
7. Gates, harness delivery, skills distribution, setup, and PR delivery are meaningful capabilities; each still needs an explicit boundary before a stable export. [inferred]
8. Memory providers, command discovery, review adapters, harness manifests, and the runtime graph offer useful extension seams of different maturity. [read]
9. Configuration cannot add arbitrary blocks today: an unknown phase is rejected, while an arbitrary blocks section is ignored. [ran]
10. Add one useful block through a public entry, narrow contract, explicit integration, structural/risk checks, and artifact proof; defer a generic plugin host. [inferred]

# B2 — Master's code seams and candidate blocks

## Snapshot, evidence, and prior work

**Source snapshot:** remote master (7d448ec812ef8639790477af07c3c75962173f8a), verified with both git rev-parse origin/master and git ls-remote origin refs/heads/master on 2026-09-30. The worktree HEAD is the preceding commit (ba56b9201782c4d1246c77bde6380867603184bf), not the same snapshot. All architecture/module measurements below read remote-ref blobs with git cat-file; the checkout was not rebased or edited. [ran]

All source citations of the form path:line refer to **origin/master at that snapshot**, unless explicitly labeled local planning input. Evidence tags: [read] inspected source, [ran] measured script/probe/test result, [inferred] architectural judgment or effort estimate. No current upstream Cordis/DeepSeek behavior is asserted from historical research.

Read the entire required archive set before making recommendations: the harness architecture README, research, supplied audit, and public research text; skeleton refinement, template/merge design, pivot history, FINAL-THESIS and locked decisions; the six named product-restructure documents; workflow guide and roadmap; and the local final plan and architecture leg. The following distinctions govern this audit:

| Prior input | What carries forward | What cannot be treated as implemented |
| --- | --- | --- |
| Harness archive README; research; supplied audit | Typed capability seams; explicit ownership, cancellation, disposal and receipts; first demanded executable extension before a marketplace. The audit explicitly distinguishes composition from sandboxing (2026-09-12-user-supplied-architecture-audit.md:29-45,174-189). [read] | Plugin activation/draining and a complete harness ABI remain proposals until code/conformance proves them. |
| Runtime refinement and template/merge design | Primitives → runtime → adapters → editable templates; stages are presets, and template updates preserve user configuration (runtime-building-blocks-refinement.md:24-95; template-library-and-merge-flow.md:98). [read] | The aspirational arbitrary graph example is richer than today's config resolver. Earlier separate-package proposals do not override the one-package direction. |
| Product restructure plan/decisions/register, facade routing, acceptance contracts | Facade routes; product APIs own behavior; Kernel owns authority; reads and authoritative writes require different proof (facade-routing.md:6,47-55). [read] | A routing ledger describes intended ownership; it does not prove that every current handler already delegates through Flow. Retired insights/serve/team/Beads surfaces in older tables do not revive them. |
| Workflow guide, roadmap, locked decisions | Workflow guide itself calls extension manifests future work and requires code/test/artifact proof before claiming availability (WORKFLOW_TEMPLATES.md:30-40,65-73). D44/D45 remain controlling. [read] | Historical roadmap checkmarks, three/six-harness language, and legacy Beads architecture do not establish today's API. |
| Local plan.md v2 and research/L2-architecture.md | Narrow first public surface: Contracts, Flow, Memory, Kernel and config/template subpaths; independent consumer journeys and one package. [read: local planning inputs] | Those subpaths have not already been declared in master's package.json. |

The archived documents are under docs/work/2026-08-24-agent-harness-architecture/, docs/work/2026-04-28-skeleton-pivot/ and docs/work/2026-08-09-forge-product-restructure/. This leg extends L2 with fresh dependency/SCC measurements, finer root-file cohorts, and explicit extension mechanics rather than repeating external research.

## A. Measured module graph

### Method and limits

The reproducible script in the appendix reads every tracked lib/**/*.js, .cjs and .mjs blob from the ref, parses with the repository's installed @babel/parser, collects literal CommonJS/ESM/dynamic imports, resolves relative files/indexes against the tracked tree, and computes strongly connected components with Tarjan's algorithm. It does not load modules to discover the graph. [ran]

An arrow A → B means **A requires B**. Fan-in/out counts distinct other areas, not file count or call-site count. Incoming/outgoing sites count literal requires crossing the specified area boundary; repeat requires count repeatedly. Intraregion edges are excluded from area tables but retained in the file graph. All parse operations succeeded. [ran]

| Measurement | Result |
| --- | ---: |
| Tracked lib JavaScript modules | 286 |
| JavaScript source bytes, before npm filtering | 3,886,175 |
| Literal module specifier sites in those files | 1,008 |
| Literal require sites / ESM / literal dynamic import | 1,008 / 0 / 0 |
| Internal lib-to-lib JavaScript require sites | 626 |
| Distinct internal source-file → target-file pairs | 607 |
| Physical code areas / inter-area pairs / cross-area sites | 22 / 52 / 300 |
| Refined responsibility areas / inter-area pairs / cross-area sites | 33 / 115 / 367 |
| Distinct file pairs crossing refined areas | 352 |
| File-level cyclic SCCs / modules in them | 6 / 19 |
| Physical cyclic SCCs / refined cyclic SCCs | 1 / 1 |
| Computed require calls, not resolved as graph edges | 3 |
| Literal relative references outside lib | 12 |
| Unresolved literal relative reference | 1 |
| Non-relative builtin/dependency specifier sites | 369 |

All values in this table are [ran], produced by the appendix scan. The 12 outside-lib references include three package.json reads; they are not 12 additional runtime libraries.

**Static topology is not execution order.** Requires inside lazy loaders/functions are counted. The six SCCs establish bidirectional source dependencies, not a demonstrated CommonJS initialization failure. Grouping several files can create an area SCC even where the file graph does not contain a cycle between those particular files. [inferred]

### Physical graph — directory boundaries actually present

Here root means all 103 files directly under lib/. Only areas containing JavaScript appear; data-only lib/agents and lib/workflow-templates are discussed separately. [ran]

| Area | JS files | Fan-in | Fan-out | Incoming sites | Outgoing sites | Requires other areas |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| activation | 1 | 1 | 1 | 1 | 1 | root |
| adapters | 4 | 3 | 1 | 9 | 2 | root |
| capabilities | 3 | 0 | 0 | 0 | 0 | — |
| commands | 68 | 4 | 14 | 7 | 208 | activation, adapters, contracts, core, doc-gate, grounding, kernel, memory, memory-core, pr-monitor, preflight, root, status, workflow |
| contracts | 7 | 4 | 0 | 9 | 0 | — |
| core | 1 | 3 | 0 | 14 | 0 | — |
| dep-guard | 8 | 0 | 0 | 0 | 0 | — |
| doc-gate | 5 | 1 | 0 | 5 | 0 | — |
| flow | 9 | 1 | 1 | 1 | 4 | contracts |
| grounding | 2 | 1 | 3 | 3 | 3 | core, kernel, root |
| issue-sync | 8 | 1 | 0 | 2 | 0 | — |
| kernel | 22 | 6 | 4 | 53 | 6 | adapters, memory-core, root, workflow |
| memory | 5 | 2 | 2 | 10 | 4 | memory-core, root |
| memory-core | 6 | 5 | 1 | 8 | 3 | contracts |
| pr-monitor | 19 | 2 | 6 | 16 | 15 | commands, contracts, flow, kernel, memory-core, root |
| preflight | 2 | 1 | 2 | 2 | 2 | commands, root |
| root | 103 | 10 | 11 | 145 | 41 | adapters, commands, core, issue-sync, kernel, memory, memory-core, pr-monitor, status, text, workflow |
| smart-status | 2 | 0 | 0 | 0 | 0 | — |
| status | 3 | 2 | 2 | 3 | 4 | root, workflow |
| text | 1 | 1 | 0 | 1 | 0 | — |
| validation | 1 | 0 | 1 | 0 | 1 | kernel |
| workflow | 6 | 4 | 3 | 11 | 6 | commands, kernel, root |

### Refined graph — expose gates, hooks, setup and distribution inside root

The directory groups above remain intact, except core is named core/runtime-graph. Root files are assigned by the exact name lists in the appendix: gates, hooks, setup, skills-distribution, workflow-templates, review-pr-delivery, memory-integration, cli-facade, issue-client, github-integration and build-ci; all remaining root modules become root-utilities. These are **analyst cohorts**, not already-enforced contracts. The appendix makes the grouping reproducible. [ran]

workflow-templates in this graph means four executable helpers: adoption-profiles.js, workflow-profiles.js, config-writer.js and workflow-retirement.js. It does not imply a dynamic workflow-template package or count the data-only CI YAML as an executable module.

| Area | JS files | Fan-in | Fan-out | Incoming sites | Outgoing sites | Requires other areas (sites) |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| activation | 1 | 1 | 1 | 1 | 1 | workflow-templates (1) |
| adapters | 4 | 6 | 2 | 9 | 2 | issue-client (1), review-pr-delivery (1) |
| build-ci | 7 | 3 | 2 | 13 | 12 | gates (9), root-utilities (3) |
| capabilities | 3 | 0 | 0 | 0 | 0 | — |
| cli-facade | 9 | 2 | 10 | 23 | 19 | adapters (1), commands (1), core/runtime-graph (1), issue-client (5), kernel (4), memory (1), memory-integration (1), review-pr-delivery (1), root-utilities (3), status (1) |
| commands | 68 | 6 | 25 | 7 | 208 | activation (1), adapters (3), build-ci (4), cli-facade (21), contracts (1), core/runtime-graph (8), doc-gate (5), gates (7), github-integration (4), grounding (3), hooks (7), issue-client (12), kernel (30), memory (7), memory-core (2), memory-integration (8), pr-monitor (15), preflight (2), review-pr-delivery (4), root-utilities (23), setup (14), skills-distribution (10), status (2), workflow (7), workflow-templates (8) |
| contracts | 7 | 4 | 0 | 9 | 0 | — |
| core/runtime-graph | 1 | 6 | 0 | 14 | 0 | — |
| dep-guard | 8 | 0 | 0 | 0 | 0 | — |
| doc-gate | 5 | 1 | 0 | 5 | 0 | — |
| flow | 9 | 1 | 1 | 1 | 4 | contracts (4) |
| gates | 8 | 5 | 6 | 21 | 16 | build-ci (8), core/runtime-graph (1), issue-client (1), kernel (2), pr-monitor (1), root-utilities (3) |
| github-integration | 5 | 2 | 2 | 5 | 3 | commands (1), root-utilities (2) |
| grounding | 2 | 1 | 3 | 3 | 3 | core/runtime-graph (1), issue-client (1), kernel (1) |
| hooks | 6 | 2 | 4 | 9 | 5 | gates (1), root-utilities (1), setup (1), skills-distribution (2) |
| issue-client | 4 | 10 | 5 | 27 | 9 | adapters (1), core/runtime-graph (1), issue-sync (2), kernel (4), root-utilities (1) |
| issue-sync | 8 | 1 | 0 | 2 | 0 | — |
| kernel | 22 | 10 | 5 | 53 | 6 | adapters (1), memory-core (2), memory-integration (1), root-utilities (1), workflow (1) |
| memory | 5 | 4 | 2 | 10 | 4 | memory-core (2), memory-integration (2) |
| memory-core | 6 | 5 | 1 | 8 | 3 | contracts (3) |
| memory-integration | 6 | 4 | 7 | 12 | 13 | cli-facade (2), issue-client (1), kernel (5), memory (1), memory-core (1), root-utilities (2), text (1) |
| pr-monitor | 19 | 2 | 8 | 16 | 15 | commands (2), contracts (1), flow (1), github-integration (1), kernel (3), memory-core (1), review-pr-delivery (4), root-utilities (2) |
| preflight | 2 | 1 | 2 | 2 | 2 | commands (1), root-utilities (1) |
| review-pr-delivery | 6 | 4 | 2 | 10 | 4 | adapters (2), root-utilities (2) |
| root-utilities | 21 | 17 | 5 | 53 | 6 | commands (1), issue-client (1), kernel (2), memory (1), skills-distribution (1) |
| setup | 16 | 3 | 7 | 16 | 12 | core/runtime-graph (2), gates (2), hooks (2), issue-client (2), root-utilities (2), skills-distribution (1), workflow (1) |
| skills-distribution | 11 | 4 | 2 | 14 | 3 | root-utilities (2), workflow (1) |
| smart-status | 2 | 0 | 0 | 0 | 0 | — |
| status | 3 | 2 | 3 | 3 | 4 | issue-client (2), root-utilities (1), workflow (1) |
| text | 1 | 1 | 0 | 1 | 0 | — |
| validation | 1 | 0 | 1 | 0 | 1 | kernel (1) |
| workflow | 6 | 5 | 5 | 11 | 6 | commands (1), issue-client (1), kernel (1), root-utilities (2), setup (1) |
| workflow-templates | 4 | 2 | 4 | 9 | 6 | adapters (1), build-ci (1), gates (2), root-utilities (2) |

The refined graph has one 22-area SCC: activation, adapters, build-ci, cli-facade, commands, gates, github-integration, grounding, hooks, issue-client, kernel, memory, memory-integration, pr-monitor, preflight, review-pr-delivery, root-utilities, setup, skills-distribution, status, workflow and workflow-templates. Contracts, Flow, Memory core and core/runtime-graph are outside it. The physical SCC comprises activation, adapters, commands, grounding, kernel, memory, pr-monitor, preflight, root, status and workflow. [ran]

**Interpretation:** the substrate is already comparatively clean; the application/installation layer is a connected composition. Merely exposing each directory would export those connections as compatibility obligations. The table also shows why commands is not yet a thin facade: it imports 25 refined areas through 208 cross-area require sites. [inferred; measured counts above]

### Actual file cycles and the smallest seam each suggests

| Cyclic SCC | Concrete edges on master | Boundary implication |
| --- | --- | --- |
| Build/CI generation ↔ protected-state authority: five modules | bun-workflow-pins → npm-publish-workflow, test-workflow, size-workflow and protected-state-authority (bun-workflow-pins.js:458,532-534,564); reverse requires in npm-publish-workflow.js:338, test-workflow.js:22, size-workflow.js:22, protected-state-authority.js:24,430,499,506. [read] | Extract shared artifact planning/digests from generators and supply them to authority checks; keep authorization in Kernel-backed protected state. Do not copy or remove gate checks. [inferred] |
| init ↔ setup: two modules | commands/init.js:564 → commands/setup; commands/setup.js:91 → commands/init. [read] | Shared onboarding/install service should sit below both handlers. [inferred] |
| prime → orientation → status → prime: three modules | commands/prime.js:7; orientation.js:1040; commands/status.js:766. [read] | Share a read-model builder, keep rendering/help wrappers outside it. [inferred] |
| flow-monitor ↔ monitor: two modules | pr-monitor/flow-monitor.js:17 → monitor; pr-monitor/monitor.js:142 → flow-monitor. [read] | Separate pure monitoring transitions from the integration factory that selects the runtime. Lazy loading currently mediates this cycle. [inferred] |
| ship ↔ reconcile-executor: two modules | commands/ship.js:15 → reconcile-executor; reconcile-executor.js:1247 → commands/ship for autoShepherdRailEnabled. [read] | Move that rail query to shared config/runtime code; a daemon service should not require a CLI handler for policy. [inferred] |
| Manifest/registry/discovery: five modules | _registry.js:26 → _manifest; manifest loaders reach serve.js:384 and skill.js:419; serve.js:189,215 → _registry; skill.js:21 → skill-eval; skill-eval.js:444 → _registry. [read] | Generated lazy loaders create deliberate reachability cycles. Remove owner-retired serve through its existing retirement work; skill evaluation needs an injected registry/discovery service if exposed separately. [inferred] |

The first row is one SCC containing lib/bun-workflow-pins.js, lib/npm-publish-workflow.js, lib/protected-state-authority.js, lib/size-workflow.js and lib/test-workflow.js; the last includes lib/commands/_manifest.js, _registry.js, serve.js, skill.js and lib/skill-eval.js. Six SCCs are six cycle groups, not a count of every elementary cycle. [ran]

### Edges a require graph cannot show

| Mechanism | Verified source | Consequence |
| --- | --- | --- |
| Computed module loading | adapter-cli.js:157 loads a project review adapter; commands/_registry.js:194 loads discovered command files; migrate-dry-run.js:314 loads fixture code. These are all three computed require calls found by the AST walk over all 286 files. [ran/read] | Their possible dependencies are unbounded by this static graph. Discovery is extension, not isolation. |
| Runtime module → repository scripts | commands/push.js:7,14,20 → scripts/check-forge-token.js, scripts/test.js, scripts/process-tree.js; kernel/claim-reconciler.js:10 → scripts/process-tree.js; validation-receipt.js:9 → scripts/test.js; commands/skill.js:22-25 → four scripts/lib evaluation helpers. [read] | New public APIs must not accidentally require unpublished development/CI helpers. |
| Generated binary asset source | package-root.js:138 → ./embedded-assets.generated.mjs; absent from the tracked tree and intentionally excluded at package.json:90. [ran/read] | One unresolved generated path is reported explicitly, not counted as a normal installed-module edge. |
| Harness manifests, assets and scripts | PluginManager reads lib/agents/*.plugin.json (plugin-manager.js:230-254); setup resolves packaged asset roots (commands/setup.js:18-30); hook renderer emits .forge/hooks/forge-native-hook.js commands (hook-renderer.js:30-33). [read] | JSON/YAML/file paths and subprocess commands form an additional delivery graph. A zero-JS-dependency renderer can still depend on installed assets and host semantics. |
| Packaging exclusions | package.json:93-106 excludes two pr-monitor files, validation/, workflow-templates/, capabilities/, setup.js, task-ownership.js and other helpers. [read] | A tracked/deep-importable development entry is not automatically shipped or suitable as a public export. Verify the selected entry's closure in the real artifact. |
| Config and ambient state | runtime graph reads .forge/config.yaml (runtime-graph.js:558-598); router uses deps > environment > config (memory/router.js:89-114); setup has module globals (commands/setup.js:100-102). [read] | File imports alone do not capture configuration precedence, process state, or project/global scope. |

## B. Today's blocks: artifact budgets versus enforceable boundaries

scripts/package-budgets.json:8-21 defines **13 named artifact buckets**. lib/package-budget.js uses longest-prefix assignment; reserved other catches unmatched files. These are accounting rules, not dependency/API rules. [read]

The following byte/file columns are the **committed baseline** in scripts/package-size-baseline.json:2-63, not a fresh npm pack measurement. This read-only leg did not create a tarball or rewrite a baseline. [read]

| Budget bucket | Current path ownership | Baseline bytes / files | Architectural meaning today |
| --- | --- | ---: | --- |
| cli | bin/; lib/commands/ | 1,127,119 / 73 | Composition and substantial service logic; no thin-facade boundary |
| kernel | lib/kernel/ | 571,785 / 22 | Authority implementation; no block index/import whitelist |
| pr-monitor | lib/pr-monitor/ | 311,295 / 17 | Monitoring/delivery integration; no whole-block boundary |
| contracts | lib/contracts/ plus historical packages/contracts and @forge/contracts prefixes | 98,007 / 40 | Enforced block |
| flow | lib/flow/ plus historical packages/flow and @forge/flow prefixes | 103,940 / 9 | Enforced block |
| memory-core | lib/memory-core/ plus historical packages/memory and @forge/memory prefixes | 89,012 / 6 | Enforced block, called memory in structural tests |
| nested-deps | Former Flow/Memory nested node_modules prefixes | 0 / 0 | Compatibility accounting, not a new service |
| lib | Remaining lib/ paths | 1,660,497 / 144 | Catch-all for gates, setup, distribution, config, integrations, etc. |
| skills | skills/ | 300,172 / 80 | Procedure/data distribution |
| templates | rules/; .claude/; .forge/ | 61,020 / 11 | Harness/rule/hook assets; not a workflow-template execution ABI |
| scripts | scripts/ | 371,634 / 42 | Helpers/tools, some imported from runtime modules |
| docs | docs/; AGENTS.md; CODING_STANDARDS.md | 86,059 / 7 | Documentation assets |
| meta | package.json; README.md; LICENSE | 25,101 / 3 | Package metadata |
| other, reserved | Unmatched paths | 0 / 0 | Unassigned accounting catch-all |

Committed baseline total: 4,805,641 unpacked bytes, 454 files, 1,320,089 tarball bytes. Policy has 2% growth with minimum allowances of 20,480 bytes/one file and a 10,485,760-byte unpacked hard ceiling (package-budgets.json:3-6). [read]

**Actual structural contract:** test/structural/product-package-boundaries.test.js:13-23 protects Contracts, Memory core and Flow, scanning lib, bin and scripts. Contracts may depend on no other lib block; Memory/Flow may depend only on the Contracts entry. The protected blocks reject computed module specifiers (:131-154), and their external consumers must import the entry instead of internals (:158-183). The external-consumer pass does not ban every computed loader; this is source structure enforcement, not a sandbox. [read]

test/structural/pr2-root-integration.test.js:14-36 asserts the three directories have indexes, no child package manifests/former @forge dependencies/bundling, and one-package shipping; :39-69 verifies their validation owners/lanes. Command-manifest and skill-distribution drift have their own structural checks (command-manifest-drift.test.js:4-15,43-58; skills-sync-drift.test.js:18-25,27-52); those do not establish new architectural block contracts. [read]

**Executed checks:** bun test --timeout 15000 test/structural/product-package-boundaries.test.js test/structural/pr2-root-integration.test.js: 16 pass, zero fail, 68 assertions, 1.483 seconds, Bun 1.4.2. This ran on worktree HEAD (ba56b920). The test sources, protected directories, risk manifest, package.json and bun.lock match origin/master; 15 other code/test paths differ between the heads, so this is not an exact-master full consumer-test run. [ran]

A separate AST check of master's lib blobs confirmed zero violations among all 626 internal lib require sites, no computed requires in the three protected blocks, and no former @forge/{contracts,flow,memory} imports there or elsewhere in lib. Its scope is lib, not an executed full bin/scripts scan. [ran]

**Public npm surface:** package.json has three CLI binary names, no main and no exports fields. Existing indexes are source-level public entries; none is an explicit package subpath stability promise yet. This is an inspected whole-file property, not a failed name search (package.json:1-191). [read/ran]

## C. Candidate block contracts, effort and risk

“Public surface today” below means existing CLI or exported source APIs, not promised npm subpaths. Every surface/coupling column is [read] at the named source; effort, remedy and risk are [inferred]. Effort includes preserving behavior, a documented/versioned contract, import enforcement and focused consumer/artifact proof: **S** 1–2 engineering days, **M** 3–7 days, **L** 1–3 weeks, **XL** more than three weeks/cross-cutting lifecycle work. These are relative estimates, not delivery commitments. Narrow publication and full extraction are distinguished where materially different.

| Candidate | Public surface today | Couplings preventing a clean boundary | Contract work / effort | Risk |
| --- | --- | --- | --- | --- |
| Contracts | lib/contracts/index.js:17-31: envelope/schema definitions, validation/parsing, canonicalization/hash, semantic identity, schema generation/version/baseline | No other lib dependencies in the scan. Schemas, fixtures/baseline and producer compatibility are also part of delivery | **S**: declare/document subpath and compatibility policy; retain existing structural/baseline gates | Low structural risk; high consequence if envelope/hash semantics change |
| Flow | lib/flow/index.js:93-114: executor, bounded loop, process lifecycle, skill runtime, efficiency supervisor, monitor reducers/durability | Only Contracts imports. Dependencies are injected providers, yet integration services remain outside this block. Provider results include cleanup/evidence/mutation claims (flow/src/executor.js:90-145) | **S** for existing API publication; **M/L** to make more command behavior use it | Medium: lifecycle and evidence semantics; receipt inspection does not sandbox provider code |
| Memory core | lib/memory-core/index.js:319-331: authority wrapper, backend registry, feedback, usage/PR lifecycle, monitor store | Clean import boundary, but authority wrapper demands a Kernel-shaped method set (src/authority-provider.js:3-18); monitor store expects storage operations and SQLite-shaped rows (index.js:265-315) | **S** publication; **M** to document/separate knowledge, authority and monitor-store capabilities without weakening them | Medium: confusing knowledge enrichment with authoritative mutation; driver semantics |
| Kernel | broker.js:2102 createLocalBroker; cli-broker-factory.js:136 construction/migration; issue-command-contract.js:544 schemas; owned-kernel.js:43 lifetime | No index; consumers deep-import factories/broker/driver. close-on-merge.js:36 imports workflow/enforce-stage; sqlite-driver.js:31-33 imports recall normalization/package assets/Memory; projection-jsonl-writer.js:6 imports Beads compatibility | **L**: stable client/open/close capability with broker/driver/internal exports kept private; move integration-only helpers above authority; preserve D44 | High: leases, revisions, schema/migrations, backup and filesystem safety; no replaceable authority backend |
| Config/runtime graph | core/runtime-graph.js:1026-1050 constructors, defaults/resolution/lint/envelope; config-writer.js:195 sparse writes and skill resolution | Graph is dependency-leaf but fixed data; config writer also resolves package skills; graph and six-stage workflow definitions differ in scope | **M** for config/default-template contract; **L/XL** for an extensible execution/composition engine | Medium/high: unknown-ID handling, locked rails and config provenance must remain authoritative |
| Gates/policy | gate-events.js:267 approval/events; protected-state-authority.js:1543 one-time authorizations; commands/gate.js and commands/merge.js for control/enforcement | Gate approvals use owned Kernel/issues (gate-events.js:26-27); protected generator cycle spans build-ci; merge ties Contracts, adapters, Kernel and Memory (commands/merge.js:44-50,329-330,592); validation-receipt.js:9 imports test runner | **L** for policy/evaluator API separated from adapters/generators; retain authoritative event/lease checks | High: plugins must not mint PASS, forge approvals, weaken protected writes or replace merge enforcement |
| Hooks | hook-renderer.js rendering/merge API; lefthook-wiring.js installation/verification; native .forge/hooks assets | Renderer requires protected-state path safety (hook-renderer.js:43); hook code lives as assets outside lib; installation depends on setup/distribution and host-specific event semantics | **M** for rendering/install-plan contract, **L** for host-certified enforcement | High: output that looks correct can still fail to enforce at the actual host event |
| Harness adapters | Four lib/agents/*.plugin.json manifests; PluginManager metadata registry; harness-capability-matrix.js; setup/renderers/detection | lib/adapters is issue/review/PR code, not a harness execution registry. Harness IDs/directory maps/rendering branch by host; manifests do not supply executable lifecycle (harness-capability-matrix.js:5; plugin-manager.js:230-254) | **L** for host capability/install adapter with conformance; **XL** for negotiated runtime/cancellation/monitor ABI | High: misleading support claims, project/global writes, subprocess lifetime/permissions; a new JSON file is insufficient |
| Skills distribution | skills-sync.js:355 list/populate/diff/check; rules-sync.js:250 render; codex-skills integration; canonical SKILL.md assets | skills/ is current source and five targets are enumerated (skills-sync.js:41-52); recursive copy/cleanup is filesystem policy; rule/instruction/hook projections are distinct; package/compiled asset lookup matters | **M**: source ownership/provenance + install-plan/apply/check contract; implement owner-selected canonical .agents/skills and links through existing work | Medium/high: collision, user-file ownership, links/junctions, mirror drift and protected generated files |
| Workflow templates | Fixed graph defaults; workflow/stages.js:205 and workflow-profiles.js:202 profiles; adoption-profiles.js:134; data-only lib/workflow-templates/test.yml | test.yml is a CI workflow asset and excluded from npm. forge new currently only scaffolds a review adapter (commands/new.js:5-10). Stage transitions/config/skills are separate projections | **M** for known preset data and additive config; **L/XL** for arbitrary stages/actions and interpreter integration | High if sold as arbitrary workflows before execution/gates/state all agree |
| Review/provider contract | review-adapter.js:3-9,102-123 five-method interface; Greptile adapter; adapter-cli scaffold/replay | Custom module loading is used by fixture replay (adapter-cli.js:147-181), while greptile-match.js:20 constructs built-in provider. Dynamic load is unrestricted in-process execution | **M**: stable review provider seam and production injection/selection; conformance plus explicit effect authority for reply/resolve | Medium/high: side-effect permissions, untrusted thread text, privacy, stale-head evidence |
| PR delivery/monitoring | pr-bundle.js:185 gathering; pr-shepherd.js decisions; pr-monitor monitor/reconcile services; ship/push/shepherd/merge CLI | PR monitor imports Kernel/Flow/Memory/Contracts and CLI ship; monitor integration cycle; push imports scripts; protected merging remains in command code | **L** for PR-read/monitor service; **XL** for complete delivery block with authenticated writes, ownership and cleanup | High: head binding, required checks, duplicate daemon ownership, retries and irreversible remote writes |
| Memory backends | createMemoryBackendRegistry (memory-core/src/backend-registry.js:85-179); router register/select/unregister exports (memory/router.js:143-156,454-465) | Registry requires synchronous add/recall/search/capture/digest. Router registration is process-global, local floor is Kernel-backed, Graphiti emitter is separately injected; no package loader from config | **S/M** for synchronous enrichment providers in a composing host; **L** for async/network service with bounded lifecycle | Medium/high: cannot replace local floor; false success during provider failure, scope leakage, long-lived network handles |
| Setup/onboarding | forge setup/init/upgrade/reset; helper state API in lib/setup.js:146; ActionCollector and install/render helpers | Real orchestration remains in commands/setup.js, with many module-global variables (:100-102), init cycle, asset/package/harness/config/hook/Kernel operations. lib/setup.js itself is excluded from npm | **L** for explicit inspect/plan/apply result contract; **XL** for full transactional/reversible cross-host installation | High: overwriting user-owned config, unsafe link cleanup, partial installs, global/project scope |
| CLI facade | bin/forge.js; commands/_registry.js:327; 62 discoverable handlers; aliases and issue routes | Registry does stage enforcement, activation and GitHub-context preparation (:266-315). Commands import 25 areas; services import commands. Main entry has fixed canonical commands directory (bin/forge.js:3745) | **M** to expose routing/help contract; **XL** to move all business logic behind capability services | High compatibility risk if rewritten wholesale; new commands need correct mutation/auth metadata |
| Issue/projection adapters | issue-adapter.js abstraction; adapters/kernel-issue-adapter.js:9-101 mapping to broker; issue-sync codecs; projection writer | Issue-client ↔ adapter/kernel integration; compatibility projection code imports retained Beads bridge; projections cannot be issue authority | **M** for projection/import codecs; **L** for stable client/adapter contract alongside Kernel | High if external tracker is allowed to become a second owner; retire legacy surfaces per existing direction |
| Validation/evaluator services | doc-gate parsers/checker; preflight; validation/risk-manifest.js; validation-receipt helpers | doc-gate has no other lib dependencies; preflight imports commands plus helpers; risk-manifest source excluded from npm; receipts import scripts/test.js | **M** for pure evaluator APIs; **L** for complete execution/receipt path | Medium/high: keep authoritative PASS admission distinct from pure diagnostic results |
| Grounding/read models | grounding services; status helpers; memory recall/context; source-reading gates | Read models cross Kernel/config/issue-client; orientation/status cycle; read-first writes context-event evidence, unlike pure renderers | **M** for pure read/format contracts, **L** for authoritative gate service | Medium: staleness and apparently read-only operations that record authority evidence |
| Build/CI generation | test-workflow, size-workflow, npm-publish-workflow, Bun-pins and package-budget file APIs | Five-module protected generator SCC; templates/assets/package metadata and scripts live outside module directories | **L** if opened as a generator capability with explicit authorization | High: protected CI/publish changes; keep as internal capability unless a real consumer demands it |

The catch-all lib bucket, docs, scripts, metadata, nested-deps and other are not recommended as user-configurable runtime blocks. They are accounting/implementation cohorts. A directory with no measured cross-lib imports, such as dep-guard, is not automatically worth making public; the owner has already selected its deprecation. Likewise smart-status/text helpers can remain private behind the consumer contract. [inferred]

## D. Natural extension seams and the right granularity

| Existing seam | How it works now | What it supports; what it does not |
| --- | --- | --- |
| Memory backend registry | Validates five methods; register/unregister/select; always executes local first; immutable local floor; enrichment failures emit degraded receipt (backend-registry.js:85-171) | Closest existing provider plugin. Directly supports extra synchronous enrichers in an embedding host. Promise-valued methods are explicitly unsupported (:40-50); registering a package/bootstrap lifecycle is separate work. [read] |
| Flow executor | createWorkPacketExecutor accepts injected execute provider and onReceipt observer; validates result/evidence/mutation claims (flow/src/executor.js:90-145,208-276) | Provider substitution through one typed packet/receipt seam. Preserve declared authority and cleanup semantics. An arbitrary provider has the process's capabilities; result checking cannot undo its external effects. [read/inferred] |
| Kernel issue adapter and Memory authority wrapper | Maps operations to broker.runIssueOperation (kernel-issue-adapter.js:54-59,87-95); wrapper forwards validated authority methods to Kernel (authority-provider.js:37-59) | Consumers can bind to a stable authority client without owning storage. Provider indirection must preserve the same Kernel authority; it is not permission to swap in an unrelated issue store. [read/inferred] |
| Command auto-discovery + generated manifest | _registry.js:155-195 uses lazy generated entries for the canonical directory, then discovers non-underscore .js files; _manifest has 62 static loaders. Generator reads metadata and emits bundleable requires (gen-command-manifest.js:66-79,104-157) | In-tree additions are already cheap; embedders can pass another commandsDir. Production bin/forge.js currently passes its own canonical directory, so this is not a config-driven npm extension search path. Compiled binaries need regenerated static loaders or a separate external-loading design. [ran/read] |
| Review adapters | Normalized five-method interface, project scaffold and fixture replay; custom require is adapter-cli.js:157 | An actual concrete extension path, but fixture-level evidence is not production selection/live provider proof. It needs permission/effect boundaries for reply/resolve. [read] |
| Harness JSON manifests | PluginManager validates and scans lib/agents/*.plugin.json, normalizes metadata, rejects duplicates (plugin-manager.js:128-150,189-214,230-254) | Data-driven discovery of supported hosts. It is not a general service/plugin registry: loading parses JSON rather than activating code, and render/detection behavior is elsewhere. [read] |
| Skill/source distribution | listCanonicalSkills and population are data-driven by skill directories; copy and drift checking share source ownership (skills-sync.js:198-247,355-366) | More skills can be added without one JS class per skill. This seam should remain distribution of procedures/assets, with executable behavior owned by typed providers/Flow. [read/inferred] |
| Runtime graph and subskill registry | Constructors, defaults/introspection; SUBSKILL_REGISTRY owns plan/smith validation/resolution (runtime-graph.js:187-211); config overlays fixed primitives | Good seam for explicit primitive data and known presets. Registry editing is source-level extension; no public registerBlock/provides/requires/lifecycle service exists in this code path. [read] |

**Executed seam probes:** running remote runtime-graph source in a VM with injected in-memory fs showed: four phases, nine actions, five artifacts, four evaluator regions, ten gates, four evidence nodes, eight rails and two adapters. Unknown phase phase.evidence-export returned UNKNOWN_STAGE. A blocks.evidence-export section produced no error and left nine actions; it did not install a block. Disabling locked rail.secret_scan through workflow.gates returned LOCKED_PRIMITIVE_DISABLED and left it enabled. This is a unit-level source execution with synthetic config, not a live installed-host proof. [ran]

The real Memory core registry accepted a custom synchronous enricher, preserved local results, refused replacing local, degraded a Promise-valued backend with MEMORY_BACKEND_ASYNC_UNSUPPORTED, and fell back to local after unregistering the selected provider. Protected Memory core sources match the measured remote snapshot. No real memory store was opened or written. [ran]

**Recommended granularity:** publish a small set of cohesive capability contracts; register providers inside those capabilities; ship templates as data over those contracts. A block should be larger than one CLI verb but smaller than “everything involved in setup.” A provider for memory enrichment or review need not become an independent core block or npm package. [inferred]

The first public API can remain Contracts, Flow, Memory/Kernel and config/template defaults. Next useful *internal* boundaries are: shared gate/config evaluation; PR-read/monitor service; harness install/render capability; and skill-distribution plan/apply/check. Promote one to a stable subpath when a second materially different consumer needs it and its artifact/conformance proof exists. Runtime graph constructors alone do not justify a generic hot-load service bus. [inferred]

The Cordis-inspired lesson is dependency/lifetime ownership, not one “plugin” per file. For a stateful executable extension, owner-scoped registrations, cancellation/draining, bounded disposal, effect authority and receipts must accompany registration. For a pure formatter or preset, a function/data contract is sufficient. None of these imply hostile-code isolation; in-process require runs with host permissions. [inferred, consistent with archived audit:29-45]

## E. Adding a brand-new block today: receipt export

**Concrete example, proposed only:** add a pure lib/receipt-export block that accepts an existing forge.memory.run-receipt.v1 envelope and renders a deterministic redacted JSON/Markdown artifact. It creates no issue/workflow store and cannot declare a run complete. This is an independent capability, unlike adding another backend to an existing registry. [inferred]

Proposed API sketch:

~~~js
// Proposed public entry, not implemented by this audit.
const { renderRunReceipt } = require('forge/receipt-export');
const { content, mediaType } = renderRunReceipt(receipt, { format: 'markdown' });
~~~

Today that forge/receipt-export subpath is undeclared. A current development consumer would have to deep-import the source entry; the proposed subpath belongs to the publication work below.

1. **Define the capability and owner first.** Inputs: existing validated RunReceipt, format enum, bounded output options. Output: content/media type or typed failure. Effects: none. Error on unknown schema/format; do not synthesize PASS, reinterpret Kernel approval or read ambient credentials. Record approved implementation scope in the owning issue/plan when implementation is authorized. This leg performs no issue mutation.
2. **Add the minimum implementation.** lib/receipt-export/index.js, private renderer only if needed, and focused test/receipt-export tests. Reuse Contracts validation/canonicalization and existing privacy normalization after checking whether that helper should live in Contracts/a shared value module; do not deep-import another block's private files. No new store, plugin manager or dependency is necessary.
3. **Make its structural boundary real.** Add receipt-export and its permitted dependency on Contracts to the existing product-package-boundaries test. Keep the public-entry-only rule, computed-import rejection inside the block, and all existing allowlists. Add the one-package index/no-child-manifest checks. A budget entry alone would enforce none of this.
4. **Give it an explicit package entry.** Add the selective receipt-export subpath alongside the approved existing subpaths, documenting compatibility and preserving the currently supported deep-import/bin behavior while an exports map is introduced. Confirm lib/receipt-export and its full closure ship in both npm and the compiled CLI. Adding exports can hide historical paths; handle that compatibility deliberately.
5. **Optionally add a CLI consumer.** lib/commands/receipt-export.js exports the registry interface { name, description, handler } plus existing usage/flags and an explicit mutating:false classification for stdout rendering. The handler only reads a supplied envelope and calls the block. Return truthful failure for missing/invalid input; do not call issue mutation or protected-state APIs for pure rendering.
6. **Regenerate command distribution.** Run node scripts/gen-command-manifest.js in the future implementation branch, then the manifest/lazy-discovery/drift checks. The file is auto-discovered in an uncompiled canonical directory before regeneration, but the static manifest is required for bundled delivery. This audit does not run the writing generator.
7. **Implement additive config explicitly.** For example, define receiptExport: { format: json } with a validated loader/default and matching config schema, lint/doctor/introspection path; read it only in the CLI consumer. config-writer can set a sparse key while preserving unrelated fields, but writing a key does not give it runtime meaning. Document project/global precedence and reject invalid format. No generic blocks section becomes active by doing this.
8. **Keep workflow composition opt-in and precise.** A user can call the pure exporter after an existing action. If Forge must schedule it, add the known action/artifact/evaluator references to the runtime graph and connect an actual execution path; keep authority in the current Kernel/gate path. Today's resolver does not add actions from YAML, and it rejects unknown phases. A brand-new stage also requires updating stages/state/enforcement/skill projections; this simple exporter should not introduce one.
9. **Wire accounting and risk ownership.** Add receipt-export: { paths: ["lib/receipt-export/"] } to package-budgets.json; the CLI wrapper remains counted under cli. Add the new source/tests/entry to the existing risk manifest owner/lane/dependent-route model. Rebaseline only the approved new artifact after measuring it; do not rewrite budgets to conceal unrelated growth or failed checks.
10. **Prove the consumer/artifact journey.** Test valid/invalid/private input, deterministic rendering, and unchanged receipt authority/hash semantics. Run protected boundary/root/manifest/risk checks, actual pack/compiled closure checks and a clean consumer importing the public subpath. Prove malformed config fails, unrelated config survives, and missing capability is explicit. Only then call the block delivered. None of those future mutations/artifact builds was performed here.

**Effort:** the pure internal block/CLI is S–M; the accompanying package-export/config/risk/artifact integration makes a complete supported block **M**. If adding it requires inventing a generic registration/dependency/activation host, that is an **L/XL separate project**. The current architecture can grow one well-owned capability cheaply; it cannot yet enable an arbitrary external npm block by changing config alone. [inferred]

**Third-party contrast:** a composing application can already import a provider package and register it in Memory core or inject it into Flow. Custom review scaffolds can be replayed today. Neither implies automatic discovery/version negotiation/trust/granted effects. A future package loader should consume the same public contracts, require explicit grants and retain Kernel authority; a manifest describing those grants cannot enforce them against arbitrary in-process code. [read/inferred]

## Reproducible dependency measurement

The following is the script used for the scan, with ref pinned to the measured master commit and output reduced to counts, full adjacency tables and SCCs. Run with Node 24+ or Bun and repository dependencies installed; the absolute worktree path is intentional. It reads Git objects and writes no host files. The expected-count assertions make a changed scope/parser/resolver fail visibly.

~~~js

const cp = require('child_process');
const path = require('path').posix;
const wt = '.';
const ref = '7d448ec812ef8639790477af07c3c75962173f8a';
const git = (...args) => cp.execFileSync('git', ['-C', wt, ...args], { maxBuffer: 64 * 1024 * 1024 });
const allPaths = git('ls-tree', '-r', '--name-only', ref).toString().trim().split('\n');
const files = allPaths.filter(p => /^lib\/.*\.(?:js|cjs|mjs)$/.test(p));
const tracked = new Set(allPaths);

const response = cp.execFileSync('git', ['-C', wt, 'cat-file', '--batch'], {
  input: files.map(p => ref + ':' + p).join('\n') + '\n',
  maxBuffer: 64 * 1024 * 1024,
});
const sources = new Map();
let offset = 0;
for (const file of files) {
  const nl = response.indexOf(10, offset);
  const header = response.subarray(offset, nl).toString();
  const size = Number(header.split(' ')[2]);
  if (!Number.isFinite(size)) throw new Error(header);
  sources.set(file, response.subarray(nl + 1, nl + 1 + size).toString());
  offset = nl + 2 + size;
}
const parser = require(require.resolve('@babel/parser', { paths: [wt] }));
const imports = [], computed = [];
for (const [file, source] of sources) {
  const ast = parser.parse(source, { sourceType: 'unambiguous' });
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    let arg, kind;
    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'require') {
      arg = node.arguments[0]; kind = 'require';
    } else if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) {
      arg = node.source; kind = 'esm';
    } else if (node.type === 'ImportExpression') { arg = node.source; kind = 'dynamic-import'; }
    if (kind) {
      if (arg?.type === 'StringLiteral') imports.push({file, line: node.loc.start.line, spec: arg.value, kind});
      else computed.push({file, line: node.loc.start.line, kind, expr:source.slice(node.start,node.end)});
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc' || key === 'tokens' || key === 'comments') continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  };
  walk(ast);
}
function resolve(file,spec) {
  if (!spec.startsWith('.')) return null;
  const base = path.normalize(path.join(path.dirname(file), spec));
  return [base, base+'.js', base+'.cjs', base+'.mjs', base+'.json', base+'/index.js', base+'/index.cjs', base+'/index.mjs', base+'/index.json'].find(p=>tracked.has(p)) ?? null;
}
const resolved = imports.map(i=>({...i,target:resolve(i.file,i.spec)}));
const internal = resolved.filter(i=>i.target?.startsWith('lib/') && sources.has(i.target) && i.kind==='require');
const rootGroups = {
  gates: ['gate-events','merge-rules','protected-path-manifest','protected-state-authority','protected-state-surfaces','validation-receipt','patch-intent','task-ownership'],
  hooks: ['existing-tdd-gate','hook-global-installer','hook-renderer','husky-migration','lefthook-check','lefthook-wiring'],
  setup: ['setup','setup-action-log','setup-summary-renderer','setup-utils','detection-utils','detect-agent','runtime-health','node-requirement','package-manager-remediation','project-discovery','reset','upgrade-safety','migrate-dry-run','beads-detect','deprecated-sync-cleanup','modules-link'],
  'skills-distribution': ['skills-sync','codex-skills','rules-sync','agents-config','using-forge','harness-capability-matrix','mcp-config-renderer','safety-config-renderer','plugin-catalog','plugin-manager','plugin-recommender'],
  'workflow-templates': ['workflow-profiles','adoption-profiles','config-writer','workflow-retirement'],
  'review-pr-delivery': ['review-adapter','pr-bundle','pr-pull','pr-shepherd','pr-state-validator','greptile-match'],
  'memory-integration': ['memory-digest','memory-recall-events','memory-recall','project-memory','context-merge','forge-context'],
  'cli-facade': ['adapter-cli','control-plane','docs-command','docs-copy','global-flags','orientation','release-readiness','issue-render','inbox'],
  'issue-client': ['forge-issues','issue-adapter','issue-backend','sync-backend'],
  'github-integration': ['gh-proxy','github-context','github-credential','github-router','native-gh'],
  'build-ci': ['bun-lockfile-proof','bun-release','bun-workflow-pins','npm-publish-workflow','package-budget','size-workflow','test-workflow'],
};
const rootMap = new Map(Object.entries(rootGroups).flatMap(([group,names])=>names.map(name=>[name,group])));
function area(file) {
  if (file === 'lib/core/runtime-graph.js') return 'core/runtime-graph';
  const parts=file.split('/');
  if (parts.length>2) return parts[1];
  return rootMap.get(parts[1].replace(/\.(?:js|cjs|mjs)$/,'')) ?? 'root-utilities';
}
function physical(file) { return file.split('/').length>2 ? file.split('/')[1] : 'root'; }
function graph(edges, key) {
  const names=[...new Set(files.map(key))].sort();
  const map=new Map(names.map(a=>[a,{files:0,fanin:new Set(),fanout:new Set(),inSites:0,outSites:0}]));
  files.forEach(f=>map.get(key(f)).files++);
  const counts=new Map(), pairs=new Map();
  for(const e of edges) {
    const a=key(e.file), b=key(e.target);
    if(a===b) continue;
    map.get(a).fanout.add(b); map.get(b).fanin.add(a); map.get(a).outSites++; map.get(b).inSites++;
    counts.set(a+' -> '+b,(counts.get(a+' -> '+b)||0)+1);
    if(!pairs.has(a+' -> '+b)) pairs.set(a+' -> '+b,new Set());
    pairs.get(a+' -> '+b).add(e.file+' -> '+e.target);
  }
  return {names,map,counts,pairs};
}
function scc(nodes, adjacency) {
  let next=0; const idx=new Map(), low=new Map(), stack=[], active=new Set(), result=[];
  function visit(n) {
    idx.set(n,next); low.set(n,next++); stack.push(n); active.add(n);
    for(const t of adjacency(n)) {
      if(!idx.has(t)) {visit(t); low.set(n,Math.min(low.get(n),low.get(t)));}
      else if(active.has(t)) low.set(n,Math.min(low.get(n),idx.get(t)));
    }
    if(low.get(n)===idx.get(n)) {
      const c=[]; let t;
      do {t=stack.pop(); active.delete(t); c.push(t);} while(t!==n);
      result.push(c.sort());
    }
  }
  nodes.forEach(n=>{if(!idx.has(n))visit(n);});
  return result;
}
const byFile=new Map(files.map(f=>[f,new Set()]));
internal.forEach(e=>byFile.get(e.file).add(e.target));
const fileCycles=scc(files,f=>byFile.get(f)).filter(c=>c.length>1 || byFile.get(c[0]).has(c[0]));
const g=graph(internal,area), p=graph(internal,physical);
const areaCycles=scc(g.names,a=>g.map.get(a).fanout).filter(c=>c.length>1);
const physicalCycles=scc(p.names,a=>p.map.get(a).fanout).filter(c=>c.length>1);


const assert = require('node:assert/strict');
assert.equal(files.length, 286);
assert.equal(imports.length, 1008);
assert.equal(internal.length, 626);
assert.equal(new Set(internal.map(e => e.file + ' -> ' + e.target)).size, 607);
assert.equal(p.names.length, 22);
assert.equal(p.counts.size, 52);
assert.equal(g.names.length, 33);
assert.equal(g.counts.size, 115);
assert.equal(fileCycles.length, 6);
assert.equal(computed.length, 3);
console.log(JSON.stringify({
  ref, files: files.length,
  sourceBytes: [...sources.values()].reduce((n, s) => n + Buffer.byteLength(s), 0),
  literalSites: imports.length, internalRequireSites: internal.length,
  uniqueFileEdges: new Set(internal.map(e => e.file + ' -> ' + e.target)).size,
  physicalAreas: p.names.length, physicalEdges: p.counts.size,
  functionalAreas: g.names.length, functionalEdges: g.counts.size,
  computed,
  unresolved: resolved.filter(i => i.spec.startsWith('.') && !i.target),
  outsideLib: resolved.filter(i => i.target && !i.target.startsWith('lib/')),
  fileCycles, physicalCycles, areaCycles,
}, null, 2));
for (const [label, graph] of [['physical', p], ['functional', g]]) {
  console.log(label + '|files|fanin|fanout|inSites|outSites|requires(sites)');
  for (const name of graph.names) {
    const row = graph.map.get(name);
    console.log([name, row.files, row.fanin.size, row.fanout.size,
      row.inSites, row.outSites,
      [...row.fanout].sort().map(to => to + '(' + graph.counts.get(name + ' -> ' + to) + ')').join(', ')
    ].join('|'));
  }
}
~~~

## Open questions for the owner

**A — Narrow public foundation (default):** retain Contracts, Flow, Memory/Kernel and config/template defaults as the first API promise; formalize other seams internally and expose one when a real consumer/conformance requirement appears.

**B — Publish additional ready provider interfaces:** A plus a versioned synchronous Memory enrichment interface and review-provider interface once production selection and clean-artifact conformance pass. Do not publish full setup/gate/CLI internals.

**C — General block host first:** dependency admission, config-driven third-party discovery, scoped lifecycle/disposal and effect-grant integration before release. This adds L/XL work and does not provide hostile-code sandboxing.

Default: **A**. A valid reply is A, B or C; silence keeps A. No answer is needed to complete this read-only research leg.

## Confidence

**High** in the measured require graph, cycles, current indexes/manifests and structural-test scope: exact remote blobs, AST resolution, explicit unresolved/computed cases and reproducible assertions. **Medium** in extraction effort and granularity recommendations: they are source-based estimates without implementation or live-host/provider/pack trials. The local test run is explicitly distinguished from remote-master measurements; no shipped/public API, full release readiness or runtime isolation is claimed.

