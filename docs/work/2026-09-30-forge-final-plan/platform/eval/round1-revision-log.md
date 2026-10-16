# Platform plan round-one revision log

## Bottom line

1. **Decisions needed: none for this revision.** Apply the critiques' recommended defaults; the plan's execution choices remain planning decisions, not implementation authorization. [inferred]
2. **ACCEPTED: 23 critique items** — four blockers and nineteen non-blocking improvements; no critique item is silently deferred. [read: the three round-one critiques; inferred disposition]
3. The owner's north star governs the product framing, including hosted independent solutions alongside self-hosting. [read: ../../north-star.md]
4. The author contract must separate synchronous domain data from the host's Flow evidence and protected authority. [read: agent-buildability:31–41; inferred]
5. Config must have explicit schema, reference and layer semantics, shared by generated docs/types, compiler and runtime checks. [read: agent-buildability:43–63; inferred]
6. Keep 30/30 first-submit configs and add a separate two-submission cold-author gate plus successful second-candidate repairs. [read: agent-buildability:65–77; inferred]
7. Trusted local execution remains a cooperative support profile; module checks and source identity do not provide hostile-code containment. [read: feasibility-safety:58–60; inferred]
8. Capacity and calendar remain provisional until owner-loaded pilot measurements and commissioned operator access replace the allowance. [read: feasibility-safety:62–64; inferred]
9. Retain G0–G8, every applicable case, the npm/binary/native-host matrix and seven qualifying exercised days; add proof rather than substitute for it. [read: ../platform-plan-v1.md, section 7; inferred]
10. Only the next plan draft and this log are authorized outputs; no implementation, issue mutation, commit, push or publication is authorized by the revision. [read: (local scratch) and revise.md]

**Integration status:** all 23 dispositions reconciled against the written [platform-plan-v2.md](../platform-plan-v2.md). These are proposed contract and acceptance changes, not claims that the platform or its release campaign has run.

## Inputs and verification boundary

The input draft is [platform-plan-v1.md](../platform-plan-v1.md). The critiques are [agent buildability](round1-agent-buildability.md), [feasibility and safety](round1-feasibility-safety.md), and [platform fit](round1-platform-fit.md). The revision also uses the platform P1–P3, research L1–L5 and block B1–B3 legs, the prior plan and block plan, and the overriding [north star](../../north-star.md). The exact contract is `(local scratch)`; the next draft preserves the ten sections required by `platform-synthesize.md`. [read]

Repository verification uses fetched `origin/master` (7d448ec812ef8639790477af07c3c75962173f8a), rather than the older worktree HEAD. The fetch and ref readback ran in this revision. Source checks reconfirmed the package's Node 24 floor, missing declared `main`/`exports`/`types` map and residual skills workspace; SkillRuntime's awaited handler and `{status, evidence}` requirement; and Contracts' validation of predefined schemas rather than arbitrary author JSON Schema. These are source facts, not installed platform proof. [ran: `git fetch -q origin master`, `git rev-parse origin/master`; read: pinned `package.json`, `lib/flow/src/skill-runtime.js:177–259`, `lib/contracts/src/validate.js:326–354`]

Current registry readback reconfirmed `latest=0.0.10`, `beta=0.1.0-beta.8`, no stable/RC 0.1.x and the published beta.5/beta.8 Node `>=22.16.0` floor. Forge-routed GitHub readback reconfirmed that the release planning PR is OPEN (PR 564, head 2f7fe92ce40195e85ca0e896c52c5d37786b2bd9). Direct inspection of that head's locked decisions confirms D46 is ACTIVE, accepted by the owner on September 29, with removal separate and historical provenance preserved. [ran: projected HTTPS GET of https://registry.npmjs.org/forge-workflow and `node bin/forge.js github run -- gh pr view 564 --json number,state,headRefOid,url`; read: planning head `docs/work/2026-04-28-skeleton-pivot/locked-decisions.md:605–617`]

This is a scoped `plan.synthesis` revision. Fresh intent capture, a new research program, final plan lock, task/worktree setup and subsequent implementation/delivery stages are not invoked; existing research is input to this revision. The brief's prohibition on issue mutations governs its recordkeeping.

Each entry below records the critique item, its disposition, the required change and its verification basis. V2 section references identify the resulting plan obligation; execution proof remains required at the stated future gate. No safety absence or future usability claim is upgraded from source evidence to runtime evidence.

## Agent buildability: three blockers and six improvements

### Blocking item 1: the outside-author ABI stops before the runtime boundary

**ACCEPTED.** Add a normative installed export and operation convention, exact input/config/service arguments, domain-only synchronous result, exception translation and Promise refusal. Require the generic host wrapper to validate domain inputs/outputs and produce the internal Flow envelope; authors do not produce protected receipts. Include a complete CommonJS author example and public conformance invocation, with ordinary output, thrown failure and Promise-return vectors, then unchanged execution in both selected native adapters. **V2:** platform architecture and example, contract-lock milestone, outside-author release proof (sections 3, 6 and 7). [read: critique:31–41; pinned SkillRuntime:177–259; inferred change]

### Blocking item 2: typed config lacks consistent schema, mapping and layer rules

**ACCEPTED.** Lock a bounded JSON Schema profile and unsupported-construct refusal; declare solution inputs; use structured JSON-pointer references; distinguish static schema compatibility from invocation-time value validation; and specify optional/required paths and dependency edges. Define add/replace/remove/reset, null/omission, array handling, default materialization, provider-option replacement and secret references. Require a shared positive/negative corpus and stable diagnostics with code, pointer, origin, expected constraint and permitted repair. Every selected required node must have an executable binding; unknown declarations cannot disappear during normalization. **V2:** config API, complete composition and contract-lock proof (sections 3, 6 and 7). [read: critique:43–63; pinned Contracts validator:326–354; inferred change]

### Blocking item 3: release proof lacks bounded authoring and useful repair

**ACCEPTED.** Preserve the separate 30/30 first-submitted config gate. Add a frozen cold-author task with at most two submitted block-and-config candidates, counting rejected builder/validator/conformance submissions, recording exploration and elapsed effort separately, and requiring useful output through the generic path and unchanged Codex/Cursor execution. Freeze a withheld author task and initial failures. Add repairable unknown-field, version-mismatch and bad-output-mapping cases that produce actionable first rejection and working second candidates; authority/effect violations remain refusals. No maintainer implementation rescue or private-source help passes. **V2:** outside-author and agent-config proof (section 7). [read: critique:65–77; prior draft sections 7.3–7.4; inferred change]

### Non-blocking item 1: keep the first author path small

**ACCEPTED.** Make the initial quickstart one config, domain schemas, one synchronous operation and one conformance check. Put receipts, connected Kernel progress, hosted grants, replay and promotion in the paths that need them while preserving their architecture seams. **V2:** author contract and quickstart (section 3). [read: critique:81; inferred]

### Non-blocking item 2: remove redundant validation wiring

**ACCEPTED.** Ordinary host schema validation does not require an author-bound validation service. Remove the advisor's redundant requirement/binding; retain a dependency only when an operation actually calls a useful service. **V2:** advisor manifest and composition (section 3). [read: critique:82 and prior draft example; inferred]

### Non-blocking item 3: document discovery to native run

**ACCEPTED.** Specify proposed public discover, scaffold, validate/explain, separately authorized lock apply, admission and native-invocation calls and structured results. Distinguish metadata validity, executable binding, admission and probed native readiness; dry-run cannot establish trust or availability. **V2:** agent-first API and author sequence (section 3), staged proof (section 7). [read: critique:83; inferred]

### Non-blocking item 4: separate version axes and publication metadata

**ACCEPTED.** Distinguish Forge package, public contract, block artifact, manifest/solution schema and capability-interface versions with a concrete example. Explain the contract/package version distinction and require license/repository/support metadata for publication while allowing a smaller local-author manifest. **V2:** author contract and marketplace (section 3). [read: critique:84; inferred]

### Non-blocking item 5: state the graph's expressive ceiling

**ACCEPTED.** Keep the composition graph bounded and acyclic; show a bounded iterative or conditional/fallback reference case through an operation/template, with loops owned inside operations rather than a new expression or loop language. Applicable authority and configured gates remain mandatory. **V2:** composition/runtime and reference solution (sections 3 and 4). [read: critique:85; inferred]

### Non-blocking item 6: test editing as well as scaffolding

**ACCEPTED.** Add a manual/no-scaffold config arm using the same public schema and diagnostics. Report discovery, structural, semantic, executable and native outcomes separately; success at one stage does not provide the next stage's proof. **V2:** benchmark and author proof (section 7). [read: critique:86; inferred]

## Feasibility and safety: no blockers and eight improvements

The critique identifies **zero blocking issues**. Its eight recommendations refine support, evidence and staging; they do not establish completed runtime safety or an achievable date. [read: critique:52–54]

### Non-blocking item 1: make module-policy and trust boundaries precise

**ACCEPTED.** State the mechanically checked manifest/module-format/declared-closure rules and the bytes covered by source identity. Explicitly exclude containment of computed loads, ambient effects and detached async work. Document built-in access and unsupported execution behavior; do not commission a sandbox or imply that Promise refusal can undo effects already started. **V2:** trusted author profile, scope and risks (sections 3, 5 and 8). [read: critique:58; pinned SkillRuntime; inferred]

### Non-blocking item 2: add an evidence-adapter acceptance case

**ACCEPTED.** Require valid advisory output to reach its consumer while a forged custom PASS/approval cannot complete a protected reference obligation. Bind the host observation to source, config, contract and run identities; schema-valid domain data is neither independently verified domain truth nor authority. **V2:** host ABI/authority boundary and release proof (sections 3 and 7). [read: critique:60; pinned SkillRuntime:197–259; inferred]

### Non-blocking item 3: replace the allowance with owner-loaded estimates

**ACCEPTED.** Keep 8–12 weeks qualified. After the pilot, record owner review/integration hours, worker scope, operator turnaround and correction reserve for each coupled stream; identify work that cannot overlap under the package/config/Kernel owners. Do not convert historical merges or additional agents into measured capacity or a 1–2-week native-slice promise. **V2:** milestones, capacity and forecast decisions (sections 6, 8 and 10). [read: critique:62; research/L3-delivery.md:190–216; inferred]

### Non-blocking item 4: freeze the case/operator ledger before sizing

**ACCEPTED.** Preserve 94 as an initial inventory, not a final count. Before campaign sizing, enumerate operation × host/runtime applicability, operator, fixture and receipt, splitting composite buckets and adding event/state/data/permission cases. Commission four-harness access, seven native binary targets and observation coverage during entry work; missing operators require an explicit support/date decision rather than invented UNAVAILABLE coverage. **V2:** entry milestone, matrix and capacity (sections 6–8). [read: critique:64; prior draft section 7.2; inferred]

### Non-blocking item 5: publish executable compatibility rules

**ACCEPTED.** Add a contract-lock table for consumers/implementers of block, operation, config, event and transfer contracts. Specify additive-field policy, reader/writer asymmetry, consequential unknowns, experimental opt-in and old-plan resume, stating per contract whether N/N-1 applies. Require old/new host × provider/config vectors, preserved history and refused unsupported resumes. Current receipt v1 support is a baseline, not evidence that these new contracts already migrate. **V2:** versioning/config and contract proof (sections 3, 6 and 7). [read: critique:66; inferred]

### Non-blocking item 6: rehearse package and recovery paths early

**ACCEPTED.** Early contract/outside-slice gates install a real preliminary packed artifact outside the checkout with the independent block beside it. Exercise a beta.8 input and binary external-loader refusal before package/export/config changes spread. Keep final exact-byte certification mandatory; preliminary rehearsal is not transferred final acceptance. **V2:** milestones and package/recovery release proof (sections 6 and 7). [read: critique:68; pinned package support-map check; inferred]

### Non-blocking item 7: clarify the accepted D46 decision

**ACCEPTED.** Separate owner-accepted no-importer direction, open planning-PR status and unimplemented removal. Remove wording that solicits another importer vote. Preserve historical `beads_refs_json`/`beads_import` data and native rollback without preserving importer execution as a 0.1.0 feature. **V2:** evidence register, scope and settled-decision reconciliation (sections 1, 5 and 10). [read: critique:70; directly inspected planning head's locked-decisions.md:605–617; ran: current Forge-routed PR 564 readback]

### Non-blocking item 8: freeze stochastic benchmark and candidate-transfer policy

**ACCEPTED.** Freeze agent/provider versions, task/doc/catalog identities and initial failures, record permitted scaffold use, and specify the decision/cost of a failed campaign. Keep literal stable-version candidate promotion as default. Signed equivalence alone cannot transfer receipts across changed artifact/version identities; enumerate invalidated evidence and require applicable final campaign/observation under the exact-BOM rule. **V2:** benchmark, promotion and publication decision (sections 7 and 10). [read: critique:72; prior draft sections 7.4–7.5; inferred]

## Platform fit: one blocker and five improvements

### Blocking item 1: hosted independent solutions are missing

**ACCEPTED.** Add an explicit hosted-solution architecture and separate scope/staging row. Reuse solution identity, app principal, project, grants, config, events and data contracts for self-hosted and Forge-hosted targets, keeping deployment settings at the hosting edge. Define backend lifetime/cleanup, tenant/process isolation, credentials, quotas and trust; hosted code cannot inherit a shared server's privileges from local trust. Reserve 0.1.0 seams and design-walk a plugin-panel solution and an independent UI/backend on both targets; stage the actual hosting service and supported proof later. Do not add an empty hosting framework or vendor adapter. **V2:** hosted architecture, roadmap, scope, milestones and decision (sections 3, 5, 6 and 10). [read: critique:24–38; north-star.md, hosted and BYO objectives; inferred]

### Non-blocking item 1: prove the open harness seam independently

**ACCEPTED.** Add an outside-authored adapter registration/projection conformance case with a new adapter identity and no core patch. A controlled protocol fixture proves registry openness; live native certification is still required before advertising the host. **V2:** native connectivity and platform proof (sections 3 and 7). [read: critique:42; inferred]

### Non-blocking item 2: make policy ownership explicit

**ACCEPTED.** Assign protected constraints to platform integrity, selected capability effect contract, configured repository policy or the delivery reference template. Prove a connected non-delivery solution with its own node names/workflow and a stateless advisor, without inheriting the reference ladder and while retaining every applicable configured guard. **V2:** authority table, reference solution and proof (sections 3, 4 and 7). [read: critique:44; inferred]

### Non-blocking item 3: include a community template in publication proof

**ACCEPTED.** Publish/discover an outside-authored declarative template composing the new block with existing capabilities, then instantiate and edit through the public config API. Reuse the publishing contract; require no privileged native defaults or embedded execution hooks. **V2:** marketplace and cold-author proof (sections 3 and 7). [read: critique:46; inferred]

### Non-blocking item 4: exercise identity-preserving native promotion

**ACCEPTED.** Add a metadata/config compatibility fixture for community-to-native support promotion, preserving qualified identity or an explicit migration alias, exact source lock and independent execution admission. Maintenance ownership changes do not silently rename consumers' capabilities. This proves the seam without running a promotion service in 0.1.0. **V2:** marketplace/versioning and conformance (sections 3 and 7). [read: critique:48; inferred]

### Non-blocking item 5: keep dates conditional on contract breadth

**ACCEPTED.** Preserve the provisional staffing/8–12-week qualification in the bottom line and decisions as well as the capacity section. Reforecast after contract/access checkpoints and the outside/native pilot before widening service profiles or adding hosted/browser proof. **V2:** bottom line, milestones, risks and decisions (sections 1, 6, 8 and 10). [read: critique:50; inferred]

## Critique recommendations and accounting

| Critique | Blocking items | Non-blocking items | ACCEPTED | REJECTED |
| --- | ---: | ---: | ---: | ---: |
| Agent buildability | 3 | 6 | 9 | 0 |
| Feasibility and safety | 0 | 8 | 8 | 0 |
| Platform fit | 1 | 5 | 6 | 0 |
| **Total** | **4** | **19** | **23** | **0** |

## Verification and integration

Readback confirmed all ten numbered plan sections and its ten-line bottom line. The G0–G8 gate rows match v1 exactly; the required matrix, 30/30 bar, clean-pair floor and seven qualifying exercised days remain present. All six fenced code/data examples parse: three JSON, two YAML (including the multi-document patch fixture), and one CommonJS JavaScript example. The handwritten handler also produced the expected domain result for a harmless fixture. This does not execute the proposed generic wrapper, public APIs, author conformance or native harnesses. [ran: native Node assertions with the installed YAML parser and `node:vm`]

Final review made default suppression explicit for removal tombstones, gave optional-property fallbacks exact syntax and excluded failed-producer repair, made the layer example a coherent standalone corpus fixture, added concrete scaffold/conformance calls and explicit conformance purpose, and removed an undefined graph-condition implication. Reviewer runtime probes remain attributed as read evidence; they are not claimed as experiments rerun by this revision. [read: final v2 sections 3.1–3.4; inferred contract changes]

SHA-256 comparison confirmed all 37 pre-existing planning artifacts unchanged, with only the requested v2 draft and this log added. The tracked Git diff is empty. No implementation, dependency installation, issue mutation, GitHub write, commit or push occurred. [ran: original/final artifact hash comparison, `git status --short`, `git diff --stat`]

The critiques' owner-option recommendations are retained as planning defaults: revise the contract and acceptance gates now; retain trusted synchronous actions with an explicit cooperative-code boundary; retain the allowance only until the pilot supplies owner-loaded sizing; reserve hosted/self-hosted seams now and implement hosting after 0.1.0. These map to the dispositions above and do not reopen settled north-star decisions or grant execution authority. [read: each critique's “Open questions for the owner”; inferred]

## Open questions for the owner

**A — retain the critiques' defaults and review the next draft (default). B — revise a named execution/staging choice in the plan**, with explicit changes to scope, capacity and proof before implementation. **Default: A.** Existing numbered plan choices remain the place to choose execution scope; none is executed by this log.

## Confidence

**High** in the 23-item inventory, overriding product direction, cited remote ABI/schema boundaries and completed document readback/syntax checks. **Medium** in the revised proposed contract and staging until the cold-author and compatibility pilots run. **Low** in delivery dates and native/hosted operational outcomes: this revision does not execute the proposed public APIs, native campaign, hosting or release promotion.
