# Forge platform plan v2

## 1. Bottom line

1. **Decisions needed:** the staging and operating choices in section 10; defaults are stated, and this document authorizes no implementation or publication.
2. **Forge is an unopinionated platform of building blocks:** anyone, including an agent, builds a block; config connects it to reusable capabilities; native adapters connect the resulting solution to harnesses. [read: N]
3. Forge's TDD delivery workflow is one opinionated reference solution; the marketplace, optional cloud and bring-your-own solution/UI are part of the target platform. [read: N]
4. **0.1.0 proves the smallest complete platform:** a public author contract, capability catalog, agent-first config API, and a new outside-authored capability authored in at most two submitted block+config candidates and run unchanged through two real harnesses. [inferred]
5. Reuse the existing Contracts, Flow, Memory, Kernel and resource owners; add one generic resolve/bind/admit/invoke path rather than a second runtime or a rewrite. [read: S1–S5; inferred]
6. Support trusted startup-only synchronous outside actions first, including pinned independently installed packages; wider services, effects, automatic installation and hot replacement follow evidence. [inferred]
7. Ship agent APIs and searchable structured state/events, **no core UI**; reserve one solution/config identity across self-hosted and Forge-hosted targets, and stage isolated hosted workloads plus the separate plugin-extensible visualization app after 0.1.0. [read: N; inferred]
8. Keep one Forge npm package, sole Kernel authority, local-first operation, Node 24/26 certification, explicit execution trust and intact gates. [read: N, C, S1, S5]
9. Preserve G0–G8, the full applicable OS/runtime/harness inventory and seven exercised candidate-bound days; add outside-author and first-attempt agent-config proof. [read: R; inferred]
10. Plan provisionally for **8–12 calendar weeks from a staffed execution start**, including final observation; replace the earlier October stretch dates and reforecast after the first platform pilot. This is a planning allowance, not a measured commitment. [inferred]

**Status.** This supersedes platform-plan-v1 plus the product framing and staging recommendations in the supplied plan.md and blocks/blocks-plan.md. It preserves their applicable acceptance and recovery obligations. Only this plan and its round-1 revision log are written. No implementation, dependency installation, issue mutation, GitHub write, commit, push, browser or Claude invocation is part of this synthesis. A default below selects a recommendation for later approval, not permission to execute it.

**Evidence and reading.** [read] means inspected source or a supplied research/plan artifact; [ran] means the named command/readback was executed and proves only that result; [external] identifies a checked primary source; [inferred] marks design, estimates and future proof obligations. Every unimplemented API, ID, schema, command and support status below is **proposed** unless explicitly called current. Source inspection is rung 2; a readback does not establish installed behavior or live harness conformance.

The source snapshot is freshly fetched origin/master, **7d448ec812ef8639790477af07c3c75962173f8a**. This worktree remains at ba56b9201782c4d1246c77bde6380867603184bf; local source is not substituted for the remote. [ran: git fetch -q origin master; git rev-parse HEAD origin/master] Current registry readback returned latest=0.0.10, beta=0.1.0-beta.8, and no RC or stable 0.1.x versions. Published beta.5/beta.8 advertise Node >=22.16.0; the new source minimum is >=24. That distinction belongs in upgrade testing. [ran/external: HTTPS GET https://registry.npmjs.org/forge-workflow, projected dist-tags, versions and engines; S1]

All required inputs were consulted: platform/P1–P3, plan.md, blocks/blocks-plan.md, research/L1–L5 and blocks/B1–B3. Their settled mechanisms are reused; historical measurements are attributed rather than presented as new experiments. No platform implementation, installed artifact, migration, outside-author, agent-generation or observation campaign was run here.

### Evidence register

Code references below resolve at the pinned remote SHA above; supplied planning inputs are current local artifacts.

| Key | Inspected basis and boundary |
| --- | --- |
| **N** | [Owner north star](../north-star.md), definition lines 7–23 and consequences 27–35. Overrides common.md and both older product definitions. |
| **C** | (local scratch): repository/read-only/write limits and retained owner constraints. Its old product scope yields to N. |
| **R** | [Prior plan](../plan.md): upgrade/claim boundary 113–128; full campaign and observer 130–159; capacity 186–213; immutable candidate/correction policy 259–266; nine decisions 288–304. These are inherited proposals, not completed certification. |
| **B** | [Prior block plan](../blocks/blocks-plan.md): admission 124–136; lifecycle/protection 138–165; layers/resume 202–307; baseline/delta accounting 397–480; six decisions 484–501. Its renderer-only/later-third-party limits are superseded here. |
| **P** | [P1](P1-platform-external.md), [P2](P2-gap-reframe.md), [P3](P3-marketplace-cloud.md): outside authoring, config gap, marketplace/data/app seams. Positive source claims were checked through S1–S10; ecosystem mechanisms used here were separately checked through E1–E4. |
| **L** | [L1](../research/L1-current-state.md), [L2](../research/L2-architecture.md), [L3](../research/L3-delivery.md), [L4](../research/L4-value-scope.md), [L5](../research/L5-external.md), [B1](../blocks/B1-prior-work.md), [B2](../blocks/B2-code-seams.md), [B3](../blocks/B3-external.md). Historical inventory, independent capability boundaries, preservation/cuts, delivery measurements and lifecycle research. |
| **S1** | [package.json](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/package.json#L1-L76): one package/bin, residual skills workspace, Node floor; no main/exports/types map. Existing source indexes are not yet promised installed subpaths. |
| **S2** | Contracts index:17–31; Flow index:93–114; Memory-core index:319–331; [SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L159-L205): reusable schemas/runtime, injected handlers and capability checks; dependency/cycle resolution at 309–361. |
| **S3** | [Runtime graph](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972-L996): fixed base plus known config sections; graph-envelope schema 10–39; four phases 236–288; unknown phase refusal 645–652; locked rails 645–718. Options views: lib/commands/options.js:145–229; sparse writer: lib/config-writer.js:43–84,96–126. |
| **S4** | [Memory registry](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/backend-registry.js#L85-L171): replaceable enrichment with protected local floor. Flow executor:217–260 uses synchronous provider execution; SkillRuntime's awaited handlers are a different existing path. |
| **S5** | [Kernel-only backend](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/issue-backend.js#L6-L20); broker:1677–1706,1871–1906; owned-kernel:27–43. [D44/D45](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/work/2026-04-28-skeleton-pivot/locked-decisions.md#L567-L599) establish authority; D45 still retains inbound import on source. D46 is ACTIVE and owner-accepted in open PR #564 at `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`; that decision makes 0.1.0 no-importer, while code removal remains separate work and historical `beads_refs_json`/`beads_import` data remains preserved for return/audit. [ran/read: synthesis-lead Forge-routed `gh pr view 564`; `git show 2f7fe92...:docs/work/2026-04-28-skeleton-pivot/locked-decisions.md` lines 605–617] |
| **S6** | [Harness matrix](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/harness-capability-matrix.js#L5-L24); probes:18–87; PluginManager:221–259 reads built-in JSON descriptors. [Parity boundary](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/reference/AGENT_SKILL_PARITY.md#L156-L164): metadata is not live native invocation. |
| **S7** | [Existing add/lock groundwork](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/commands/add.js#L82-L117); forge-lock:116–184,187–250 fingerprints/rechecks local files or records explicitly untrusted remote sources. It does not implement generic manifest/package-closure admission, composition or activation. Local trusted metadata is not operator execution consent. |
| **S8** | Gate/context events: lib/gate-events.js:3–24,61–88; lib/grounding/context-events.js:3–21,52–68; PR-monitor events:3–18,28–46,68–87,125–160; workflow/state.js:1–43. Useful internal events/state, without an inspected unified public query/subscription contract. [Storage reference](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/reference/FORGE_KERNEL_STORAGE_MODEL.md#L102-L121) separates authority, read models and local-by-default raw logs; it is a planning reference with historical Beads clauses, not proof of cloud deployment. |
| **S9** | L3:146–218 and R:delivery evidence; remote scripts/process-tree.js:251–273, lefthook.yml:64–79, .github/workflows/required-checks-bypass.yml:104–114, test.yml:960–1008. Fresh read-only Kernel/GitHub results confirm worktree protection merged (#582), while its issue still says open; identity, optional-sync, lease/review handoff and mutation records remain open. test/QUARANTINE.md:8–9 still permits local recurrence, conflicting with the owner's CI-flake-only rule. Reconcile source acceptance rather than trust stale issue status. |
| **S11** | [Canonical validation matrix](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/work/2026-08-09-forge-product-restructure/validation-matrix.md#L8-L18): G0–G8; exact-artifact matrix 60–80, distinct clean-pair rule 84–86, S0/S1 and signed downgrade policy 88, aggregate/observation eligibility 90. Node22/24 at 65 is superseded by current test.yml:141–150 and retained owner Node24/26 scope. |
| **S10** | Owning protections: lib/protected-state-authority.js:178–243; lib/gate-events.js:200–220; lib/commands/merge.js:749–795,1368–1419,1462–1464. Configuration and custom results cannot mint protected approvals or replace mandatory merge evidence. |
| **E1** | [Pinned Cordis plugin contract](https://raw.githubusercontent.com/cordiverse/cordis/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/registry.ts): schema, provide/inject and plugin-owned fibers. Borrow service/ownership concepts; no mandatory Cordis dependency. [external] |
| **E2** | [Pinned DeepSeek Harness loader](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md): ordered bundles/patches and preview; compatibility checks are not a sandbox. Forge defines its own merge algebra and stricter declared-required behavior. [external] |
| **E3** | [npm provenance](https://docs.npmjs.com/generating-provenance-statements/): source/build origin is distinct from harmless behavior. Verification and execution trust remain separate. [external] |
| **E4** | [CloudEvents 1.0.2](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md): adopt its event envelope vocabulary, with Forge's separately versioned data/order/replay semantics. [external] |

## 2. What survives, what changes, what drops

All dispositions below are recommendations [inferred], grounded in N and the inspected inputs. They replace the old scope rather than silently adding a platform on top of a fixed-workflow release.

| Prior element | Disposition | What changes and why |
| --- | --- | --- |
| One npm package; independent reusable capabilities | **Survives** | Keep existing fold and API boundaries. Outside blocks can be separate packages; Forge itself is one installation. Do not redo the fold or reopen multi-package publication. |
| Kernel as sole issue/workflow/run authority | **Survives** | Every composed solution uses the same authoritative commands or remains genuinely stateless. Memory, cloud, manifests, harness files and UIs never become alternate authority. |
| Contracts, local Memory, independent Flow, owned lifetimes | **Survives** | Reuse indexes/registry/SkillRuntime/broker. Memory accepts authorized contract-valid receipts from different producers; Flow owns receipts for its own executions. |
| Product = remember/own/isolate/prove/resume | **Changes** | This describes Forge's delivery reference solution. The platform product is public authoring, config composition and cross-harness capability use. |
| Narrow list of internal public modules; twelve-owner taxonomy | **Changes** | Publish author/config contracts and a capability catalog; export only useful operations with installed proof. Internal owners guide responsibility, not admission of every new capability. No twelve-package/extraction program. |
| Extension limited to a host-named receipt renderer | **Drops as universal limit** | Retain the renderer as a cheap fixture. An author must introduce a new namespaced capability in the supported action class without patching core or each harness. |
| Third-party published package deferred after local renderer | **Changes** | Independently installed, pinned outside packages enter 0.1.0's executable proof. Manual installation is sufficient; a hosted installer is not. |
| Four bounded config layers, explicit replacement, protected floors | **Survives, expands** | Resolve declarations/bindings into a real plan; publish schema, validation, scaffold, origins and explain. Fixed toggles alone cannot satisfy the north star. |
| Startup-only trust and no sandbox/external rollback claim | **Survives** | Affirmative source/purpose-bound admission precedes import and conformance. Declared effects do not contain ambient JavaScript privileges. |
| Source identity and safe resume/replacement | **Survives** | Preserve exact admitted source/config/contract context; restart substitution is explicit. Refuse unavailable or incompatible resumed contexts rather than silently adopting new defaults. |
| Four supported existing harnesses; native preservation | **Survives, expands** | Retain applicable Claude/Codex/Cursor/Hermes proof; add an open adapter seam and generic solution projection. New-platform proof uses Codex and Cursor. OpenCode is a staged native adapter, not an already certified fifth host. |
| Retire serve/dashboard and insights | **Survives** | No UI in core. Keep test-report dashboards and event APIs. The separate native visualization app is new API-consuming product work, not revival of serve. |
| Other agreed pruning, canonical skills and Node changes | **Survives** | Keep standalone verbs and unique guarded pr link; remove duplicate delegates, deprecated shell wiring and skills workspace after overlap checks. Move actual canonical skill assets to .agents/skills with owned native links. |
| Marketplace/cloud/UI all simply later | **Changes** | Reserve public publishing, identity, data, auth and event seams now; stage their hosted operations. A small curated catalog closes the author/discovery loop without a storefront. |
| Thin freeze as equivalent 0.1.0 | **Drops** | It can be a stabilization milestone; it cannot prove outside-author composition. Full-vision-first is unnecessary for the minimal platform proof. |
| G0–G8, origin recovery, immutable artifacts, full matrix and observer | **Survives, expands** | Add platform strata and first-attempt config benchmark. Existing repository/static green is not release certification. |
| October 28–November 11 or marginal renderer-only 3–6-day estimate | **Drops as platform forecast** | Those price a different outcome. Re-estimate public schemas, generic admission/config/runtime, reference migration and native author proof once, against actual ownership and access. |

## 3. Platform architecture

### 3.1 The outside-author block contract

**Proposed contract [inferred].** A block is a versioned capability owner. Definition identity, instance identity, artifact version, author-manifest schema, config schema and each provided/required interface version are separate. Authors need not register every capability name with Forge maintainers. Namespaces prevent collisions; declaring a new authority owner or unsupported execution class does not bypass host admission.

| Contract part | Minimum public rule for 0.1.0 |
| --- | --- |
| Manifest | JSON data with schemaVersion, kind=block/template, qualified publisher/name, artifact version, compatible Forge package range, author ABI, entrypoint, config schema, provides/requires, lifecycle/execution profile, declared effects, license/repository/support and schema/doc references. No executable schema module or install hook during discovery. |
| Capabilities | Qualified name + interface version + operation input/output schemas, errors, availability/status and evidence semantics. Requirements specify slots and compatible interfaces; config binds slots to exact instances. Ambiguous/missing providers and cycles refuse. |
| Config | Public JSON Schema, defaults and constraints; reject unknown consequential fields. Bounded namespaced advisory metadata may round-trip. Secret references remain references. Host execution admission cannot come from config. |
| Lifecycle | Supported outside profile is trusted-action-sync/v1: data-only discovery, host-owned startup binding, synchronous bounded-shape invocation, result validation and host cleanup. No outside setup/dispose hook or enforced deadline is promised. Existing stateful built-ins retain open/close ownership; future managed-service profiles reserve setup/ready/drain/dispose and partial-failure rules. |
| Trust | Publisher verification, artifact integrity, compatibility, operator code admission and operation authorization are separate. No positive admission means no import. Conformance executes code and needs its own purpose-scoped admission. In-process code has ambient process privileges. |
| Versioning | Artifact SemVer is not the complete ABI. Publish consumer/implementer compatibility policy for selected 0.1.x interfaces, schema migrations and experimental opt-in. Unsupported major/profile refuses before import. No automatic selection of a newer release. |
| Discovery/install | Local manifest or already installed package, pinned exact artifact/source. A small curated index uses the same descriptor. Preview never downloads, installs or executes. Explicit manual package installation remains outside resolver execution. |

#### Normative 0.1.0 author ABI and version axes

Everything in this subsection is a **proposed contract to freeze before implementation fan-out**, not a current installed export. The installed development import is proposed as `forge-workflow/author`; package metadata must export that path and its types before it can be documented as supported. Runtime resolution loads the captured manifest `entry` relative to the captured package root.

A `trusted-action-sync/v1` entry is CommonJS and exports exactly `module.exports.operations = { <operationName>: handler }`. The wrapper calls `handler(Object.freeze({ input, config, services }))`: `input` is schema-valid domain input, `config` is schema-valid effective instance config, and `services` contains only explicitly bound capability clients under declared slot names. The handler returns one JSON-serializable domain value synchronously. A throw becomes `BLOCK_EXECUTION_FAILED`; a Promise or thenable becomes `BLOCK_ASYNC_UNSUPPORTED`; either produces no domain output. The wrapper validates input before invocation and output after return, then creates host-owned execution observation bound to source snapshot, manifest, config plan, contract and run identities. The wrapper, not the author, translates that observation into SkillRuntime's internal `{status,evidence}` shape. A host-observed PASS says the admitted handler returned schema-valid output; it is never a protected approval, Kernel transition or claim that advisory content is true. [read: S2; inferred]

Promise refusal is not cancellation: admitted CommonJS can perform ambient effects or detach asynchronous work before returning. The supported profile is cooperative trusted code, not containment. Mechanically reject an entry outside the captured root, a non-`.cjs` entry, undeclared manifest files, nonempty runtime dependency declarations, unsupported schema/contract versions, byte/digest change, and manifest requests for unsupported built-ins. The one-file bundle contract permits no runtime dependency or built-in as a supported author API. Computed `require`, `module.require`, native modules, process/global access and detached work cannot be proven absent by these checks; admission review and explicit operator trust own that residual risk. No sandbox or enforced same-process deadline is claimed. [read: round1-feasibility-safety, including its reported probe; inferred]

| Axis | Example | Compatibility decision for 0.1.0 |
| --- | --- | --- |
| Forge package | `forge-workflow@0.1.x` | Installed host version; distinct from every public contract version. |
| Author ABI | `forge.author/v1` | Consumer host accepts exactly v1; additive optional argument fields may be ignored only where its schema says so. |
| Manifest / solution schema | `forge.block/1`, `forge.solution/1` | Unknown major or unsupported keyword refuses during data-only discovery. |
| Block artifact | `@example/migration-note-advisor@0.1.0` | Exact version plus integrity/captured bytes; no range is resolved at run time. |
| Capability interface | `io.github.example/migration-note.assess@1.0` | Provider implementer and consumer ranges must intersect; unknown consequential fields refuse. |
| Event / transfer contract | named `v1` contracts | Reader/writer direction, additive fields and replay behavior are tested separately; no blanket N/N-1 promise. |

The contract-lock artifact publishes an executable compatibility table for each selected block, operation, config, event and transfer contract: consumer version x implementer version, old/new host x old/new provider/config, additive-field behavior, experimental opt-in, resumed old-plan disposition and preserved-history/refused-resume cases. N/N-1 applies only where that row explicitly promises it. Local-only author metadata may omit license/repository/support; publication requires all three plus a support contact and source origin. [inferred]

The smallest supported executable profile is **one bundled CommonJS action file, declarative JSON schemas and host-injected public services**. The author may build the bundle with its own tools; Forge adds no bundler dependency. A package can declare Forge as a peer and use public contracts in development/conformance. The supported module policy is the explicit trusted contract above; it does not claim computed-load or ambient-effect containment. Broader formats become experimental only after explicit closure/compatibility proof. [inferred]

**Admission sequence [inferred, retaining B].** Resolve real paths and descriptors without executing code; capture the supported executable bytes in a host-owned immutable-for-the-invocation snapshot; compute identity over source root, entry/code set, manifest, contracts and exact captured bytes. Bind separate effective config/options identity and purpose. Receive an affirmative trusted embedding-caller/operator decision over that descriptor. Import only the admitted snapshot, invoke through the generic host and dispose owned bindings/snapshot after completion. Reuse add/lock fingerprinting where it fits, but do not reuse its locality-based trusted bit as consent. [read: S7]

Hash-then-require of the original path leaves a check/load race. Snapshot loading closes the supported-path race; it does not defend against malicious same-user modification or sandbox ambient access. No persistent consent database is needed for the initial invocation-scoped model. A harness decision is reusable only if its adapter supplies verified affirmative source/purpose scope. YAML, enabled flags, marketplace badges and author-provided hashes cannot mint that decision. [inferred]

### 3.2 Existing capability catalog

**Current foundations [read: S1–S10, P2:82–96]; proposed public rows [inferred].** These are capabilities inside one Forge package, not twelve already supported packages. Each catalog record carries operations, schemas, versions, required capabilities, effects, lifetime, examples and SUPPORTED/EXPERIMENTAL/INTERNAL status. Existing source functions are publicized only when the two demonstrators require them.

| Capability owner | Reusable operations/value | Existing foundation | Planned 0.1.0 boundary |
| --- | --- | --- | --- |
| Contracts | Validate schema/envelopes, canonical identity and receipts | Public source index and dependency-light validators | Supported installed contracts/schema assets; author manifest is a distinct schema from current provider CapabilityManifest. |
| Kernel | Read/create/comment/depend/claim/transition and accept authorized evidence | Sole backend, guarded broker, owned handles | Narrow client/owned lifecycle and typed commands; no SQL/driver or approval minting export. |
| Memory | Append/recall/search with provenance; export/forget | Local floor plus enrichment registry and authority binding | Default local assembly works without Flow; narrow optional provider substitution retains local durability. |
| Flow | Resolve/invoke admitted DAG operations; packets, truthful execution receipts and supervised built-in paths | SkillRuntime, synchronous executor, monitor/lifecycle owners | Stateless and Kernel-connected assemblies, with sync action profile distinguished from awaited/supervised internal handlers. |
| Config/catalog | Resolve, validate, explain, scaffold and revision-checked edits | Fixed graph constructors, options views, sparse writer | One public compiler/catalog; templates and outside capabilities enter its actual executable output. |
| Policy/gates | Explain/evaluate requirements; submit evidence to owner | Locked rails and owning protected/merge checks | Pure evaluation/client surface; mandatory approval/evidence admission remains private and guarded. |
| Worktrees | Plan/create/link/refuse/remove isolated work | Existing guarded commands and landed link-preservation owners | Narrow service/client operations used by reference workflow, with dirty/path/link refusal and restoration semantics. |
| Review | Fetch/normalize/score feedback; authorized reply/resolve separately | Review SPI and replay/scaffold | Documented provider/read seam; effects explicitly authorized. Marketplace bots are not universal authority. |
| Delivery | Read PR/check/head status, monitor, guarded push/link/merge | Existing exact-head/lease/approval guards and Flow monitoring | Reference-required service bridges preserve current checks; no new raw shell/ungated merge endpoint. |
| Harness connectivity | Probe, project selected solution, invoke/map result and clean owned projections | Four-host matrix, built-in descriptors/renderers | Open adapter registry; truthful installed-version capabilities and no per-new-block switch in core. |
| Skills | Publish/discover reusable procedures and invocation metadata | Current canonical skills source plus generated mirrors | Canonical .agents/skills assets and owned host links; instructions guide API use and do not grant authority. |
| Templates | Instantiate delivery/small-change or user-defined solution data | Adoption presets and fixed workflow profiles | Declarative versioned template produces editable config and executable nodes. Adoption amount and solution rigor are separate axes. |

Avoid blanket exports and one wrapper per internal file. Supported package entries are proposed for contracts, blocks/catalog, config, flow, memory and Kernel client; other public operations can be catalogued through owning clients. Audit existing deep-import consumers before sealing paths. Independently consumable means no private database/source imports, forced Flow activation for Memory, or Kernel initialization for stateless Flow. [inferred; read: S1–S5]

For the complete advisor example, the proposed `memory.recall@1.0` catalog row fixes its successful output schema to `{notes: Note[]}` with required bounded `notes`; a successful no-result read returns `notes: []`. A failed or unavailable read returns INCOMPLETE and produces no fallback data. Literal fallback is permitted only for an absent optional property from a successfully completed producer, never for a failed/unavailable required producer. [inferred contract choice]

### 3.3 Agent-first config API

**One source and one compiler [inferred].** Public schemas generate types, operation docs, machine-readable catalog, examples and migration descriptions. CLI, library, harness and later UI use the same resolve/validate/explain/edit operations. Reuse options/config-writer/runtime constructors; replace their fixed-base limitation rather than adding another resolver alongside them. Current resolver only consumes known sections and current sparse writes do not establish a whole-composition transaction. [read: S3]

| API | Required behavior |
| --- | --- |
| catalog.list / describe | List available contracts, operation schemas, effect/lifetime classes, support and version limits. Discovery returns data without importing unknown implementations. |
| block/solution scaffold | Minimal manifest, one action, public-docs conformance example and schema-valid config; no framework boilerplate or hidden private imports. Reuse the current new-command dispatcher. |
| config.resolve / validate | Pure inputs: catalog/descriptors, template and ordered layers. Return immutable normalized plan, bindings, origins, obligations, digests and structured diagnostics. No filesystem/env/auth discovery inside the compiler. |
| config.explain / dryRun | Report graph, selected exact sources, provider/operation bindings, order, origins, effects, trust/readiness and refusal reasons. **No imports, install, conformance or remote writes.** Runtime/environment probing is a separately explicit operation, not hidden preview. |
| config.previewEdit / applyEdit | Validate whole effective config, expected prior revision/bytes, atomic replace and readback. Preserve siblings/prior owned bytes, refuse intervening user edits and give a supported reverse path. Activation is separate from editing. |
| schema/docs generation | Versioned schema assets and generated docs stay byte-consistent with runtime; examples are validated in installed-consumer CI. Discovery-friendly docs index is generated, not another handwritten API inventory. |

**Layers:** platform defaults → pinned template/solution → project → explicit invocation. Transport, environment, personal secrets and admission are edge inputs with documented scope. Team/user precedence is reserved, not implicitly merged in 0.1.0. Each effective path reports its contributing layer and operation. [inferred]

**Merge algebra:** maps merge by stable key/instance ID; scalar assignment replaces; arrays replace as a whole. Add/replace/remove/reset are the only 0.1.0 patch operations. Reset removes that layer's override/tombstone and reveals the lower value. Replacing a provider or implementation replaces its implementation-specific options as a unit; no stale options migrate accidentally. Stable composition/node IDs are versioned when externally referenced. Unknown operation IDs, duplicate definitions/instances, incompatible ranges, missing/ambiguous slots, cycles and invalid data mappings fail before activation. [inferred; retained B]

**Protected constraints lie outside precedence.** A final-graph validator checks mandatory dependency/evidence edges, authority floor, protected writers and stop points; the owning services enforce them again at effects. Template policy can add obligations/select supported variants. It cannot rewrite accepted progress, remove a mandatory check, create an approval or convert missing proof to PASS. Resolve does not mean admitted, and admitted code does not mean authorized mutation. [inferred; read: S3, S10]

Diagnostics include code, JSON pointer, layer/source, instance/operation, expected contract, observed value and a concrete repair hint; never credential values. Legacy config fields are inventoried/migrated before introducing strict unknown-field rejection. Preserve legitimate merge/Memory settings rather than deleting them because the new composition dialect initially ignores them. [inferred; P2:153–179]

#### Normative config, schema, reference and layer semantics

These are **proposed 0.1.0 semantics to lock once**, shared by schema/type/doc generation, compiler, editor and runtime:

- Author schemas use JSON Schema 2020-12 with this bounded keyword allowlist: `$id`, `$schema`, local `$defs`/`$ref`, `type`, `properties`, `required`, boolean `additionalProperties`, `items`, `enum`, `const`, `default`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`, `minLength`, `maxLength`, `pattern`, `minItems`, `maxItems`, `uniqueItems`, asserted `format` values `date-time`/`uuid`/`uri`, and the boolean Forge annotation `x-forge-secretRef`. External refs, every other Forge annotation, custom executable keywords and every unsupported keyword refuse during discovery. There is no coercion. `default` is materialized only after all layers resolve and only for an absent property; false, zero, empty string and explicit null are present values. Null is valid only when the schema explicitly includes `"null"`.
- Every solution declares its input schema. Data references are objects `{from:"$input"|"node-id", pointer:"/JSON/Pointer", fallback?:<literal>}`; RFC 6901 escaping (`~0`, `~1`) makes dots and slashes ordinary key characters. No dotted path or expression grammar exists. A node reference does not create order: it must name a producer in the consumer's explicit transitive `after` set. Compile-time checks prove the referenced schema location exists and its possible type is assignable to the required target. Optional source to required target refuses unless the target is optional or a schema-valid literal `fallback` is declared. The fallback applies only to an absent optional property after successful producer execution; explicit null is a value, and failed/unavailable/INCOMPLETE producers never become success through a fallback. Invocation still validates actual values.
- Defaults -> pinned template -> project -> invocation resolve low to high. Template/project/invocation changes use ordered patch records `{op,path,value?}` with JSON Pointer paths. `add` requires the effective path to be absent and creates a layer value; `replace` requires it to be present and writes a layer value; `remove` installs a tombstone that hides lower-layer data and suppresses schema-default materialization; `reset` removes that layer's contribution/tombstone and reveals the lower value. Arrays always replace as a whole through `add`/`replace` in 0.1.0; there is no item append/remove syntax. `reset` happens while folding that layer, then defaults materialize once after all layers for absent, non-tombstoned properties. Removing a required property fails final validation. Explicit null is an add/replace value, never reset.
- Changing a provider/source replaces that instance's implementation-specific options as a unit before validating the new provider; stale options never carry across. Structured secret references are `{"$secret":"NAME"}` and are permitted only at schema locations marked `x-forge-secretRef: true`; compile/explain preserves the reference and never resolves or prints its value.
- Structural parse, schema validation, semantic binding, admission/readiness and execution are separate states. A selected required node must lower to exactly one executable binding before semantic validation can pass. Unknown declarations or ignored graph entries are errors, never successful normalization.

The contract-lock corpus includes valid and invalid dot/slash pointers, optional-to-required mappings, explicit null versus omission, reset/default ordering, provider replacement, unknown keywords, secret references, cycles and executable-binding absence. Every invalid case has a stable code, pointer, origin, expected constraint and permitted repair. The same corpus drives generated types/docs and runtime value checks; existing predefined Forge envelope validation is reused for those envelopes but is not presented as arbitrary author-schema validation. [read: S3; inferred]

**Proposed discovery-to-run sequence:** `catalog describe` -> `block scaffold` -> `config validate`/`config explain` -> separately authorized `lock apply` -> purpose-bound `block admit` -> adapter-native `solution invoke`. Library calls expose the same operations and structured returns. These names are proposed, not current commands. Explain never imports or probes code; readiness remains UNKNOWN until an explicit probe/admission step. The quickstart contains only one config, one operation's schemas, one synchronous handler and one runnable public conformance call. A separate manual/no-scaffold arm writes the same schema directly. [inferred]

Concrete proposed calls and minimum structured returns:

~~~text
forge catalog describe io.github.example/migration-note-advisor --json
=> {"descriptor":{...},"discovery":"DATA_ONLY","readiness":"UNKNOWN"}
forge block scaffold io.github.example/migration-note-advisor --profile trusted-action-sync/v1 --json
=> {"files":["forge.block.json","schemas/config.json","schemas/input.json","schemas/output.json","dist/advisor.cjs"],"discovery":"DATA_ONLY","readiness":"UNKNOWN"}
forge config validate solution.yaml --json
=> {"state":"VALID","planDigest":"...","diagnostics":[]}
forge config explain solution.yaml --json
=> {"state":"BOUND","readiness":"UNKNOWN","bindings":[...],"effects":[]}
forge lock apply solution.yaml --expect-revision 7 --json
=> {"revision":8,"lockDigest":"...","reverse":{"revision":7}}
forge block admit @example/migration-note-advisor@0.1.0 --purpose conformance --source-digest ... --json
=> {"admissionId":"...","purpose":"conformance","sourceDigest":"...","expiresAt":"..."}
forge block conformance --manifest forge.block.json --solution solution.yaml --admission ... --input fixture.json --json
=> {"state":"PASS","purpose":"conformance","domainAssertions":"PASS","diagnostics":[]}
forge solution invoke solution.yaml --purpose conformance --admission ... --input fixture.json --json
=> {"state":"PASS","output":{...},"observation":{"sourceDigest":"...","planDigest":"..."}}
~~~

The proposed library surface returns the same records, e.g. `author.block.scaffold({id,profile})`, `author.config.validate(document, catalog)` and `author.conformance.invoke({plan, admission, input})`; these are contract examples, not installed exports. The proposed block-conformance command runs the same generic wrapper and frozen domain assertions. Admission purpose `conformance` does not authorize production invocation; the example solution invocation explicitly retains that purpose.

Concrete proposed layer records use a standalone corpus fixture, separate from the advisor's empty instance config. Its lower value is `{label:"base",tags:["old"],note:"lower",limit:3}`. The fixture schema permits `label` and `extra` strings, `tags` as an array of strings, `note` as string or null, and optional numeric `limit` with default 3; other fields refuse.

~~~yaml
layer: project
ops:
  - { op: add, path: /extra, value: added }
  - { op: replace, path: /tags, value: [new] }
  - { op: remove, path: /limit }
---
layer: invocation
ops:
  - { op: replace, path: /note, value: null }
  - { op: reset, path: /note }
~~~

The result is `{label:"base",tags:["new"],note:"lower",extra:"added"}`: reset reveals the lower note, whole-array replacement retains only the new tag, and the limit tombstone suppresses its default. Clearing that tombstone with a project-layer reset would reveal the lower limit again. A provider/source replacement separately clears all prior implementation-specific options before its new config validates. [inferred]

### 3.4 Composition and runtime

The data path is **descriptor/catalog → pure compile/bind → host admission → owned assembly → generic invoke → host-observed evidence → owning Kernel acceptance if connected**. The compiled plan drives both runtime and native projections. Generic new operations cannot escape gates by having a name outside the legacy six-stage normalizer. Kernel records connected composition/node progress; no parallel progress database is introduced. [inferred; read: S2, S3, S5, P2:149–151]

Contracts/config initialize without authority. A connected assembly opens Kernel under its existing floor, then Memory and authorized service clients, then Flow consumers. Stateless Flow branches from Contracts/config and opens no Kernel. Required capability failure makes the composition unavailable/incomplete; optional absence follows an explicit fallback that does not erase local Memory durability. [inferred; read: S2, S4, S5]

Startup and partial failure close only host-owned handles/bindings/snapshots through existing owners, in reverse dependency order where needed. Supplied handles remain the caller's responsibility. Accepted Kernel history survives disposal. The outside sync-action wrapper explicitly rejects Promise results: SkillRuntime itself awaits handlers and does not enforce that profile. Reuse the synchronous executor rule or enforce it in the generic operation wrapper. An outside sync action can block the event loop: schema/input bounds do not provide cancellation or enforced termination. Built-in supervised processes retain their actual cancellation/kill/reap receipts; wider third-party supervision waits for its own support profile and proof. [inferred; read: B, S2, S4]

Changing config/implementation produces a new plan identity and an explicit restart/substitution. A resumed connected run uses its recorded contract/config/source context or gives a typed refusal and recovery path. It does not silently pick current defaults, carry old provider options or reactivate an expired claim. Live HMR, automatic dependency solving and universal compensation are later, if demand warrants them. [inferred]

**Evidence adapter acceptance:** a valid advisory output reaches its consumer while the wrapper records schema-valid execution bound to exact identities; a forged author-returned PASS, approval or receipt is ignored and cannot satisfy a protected reference-workflow obligation. Schema-valid advisory output is not independently verified domain truth. [inferred]

**Graph ceiling:** 0.1.0 graphs are finite DAGs with explicit `after` edges, typed input references and optional-property literal fallbacks. Provider fallback and bounded retries are encapsulated inside a named built-in operation with its own limits and evidence, not expressed as graph conditions or loops. There is no expression evaluator. The proposed `review.read` public operation wraps the existing review/provider owner: config supplies `providers: [primary, secondary]` and `maxAttempts: 2`, the operation alone owns those bounded attempts, and one DAG node exposes `{findings,providerUsed,attempts}`. Consumers reference that output normally; no graph loop or new condition grammar is introduced. [read: existing review/provider path via R/L3; inferred public name]

### 3.5 Native harness connectivity

Define an adapter contract for **describe/probe, planProjection, applyOwnedProjection, native discovery/invocation, result/evidence mapping and cleanup**. It consumes catalog/compiled plan instead of hardcoding TDD stages or individual community blocks. Different protocols remain separate: skills/procedures, tools/resources, hooks/events and process/agent transports are not interchangeable. Reuse native renderers and capability probes; widen registration, not a permanent closed host switch. [inferred; read: S6, P1]

0.1.0 retains advertised Claude Code, Codex, Cursor and Hermes capabilities with installed-version evidence; the new outside solution must run unchanged in **Codex and Cursor**, apart from adapter selection and host-specific consent. OpenCode and future harnesses enter the same open interface, initially experimental until certified. Any-harness is the architectural direction, not a claim all hosts already pass. Host limitations return explicit UNAVAILABLE/refusal, and genuinely supported alternative delivery is shown, never guessed from metadata parity. [inferred; read: S6]

Canonical skill bodies are physically packaged at .agents/skills. Native setup creates owned links or required thin native wrappers, preserving user content. Fresh clone, npm tarball and compiled binary each need separate discovery/ownership proof. A required-link failure is an actionable refusal under the default; managed-copy exceptions require a separate explicit support decision and drift/recovery evidence. [inferred; read: R, L2, L5]

An outside-authored adapter fixture must register a new adapter ID, project the compiled plan and round-trip a controlled protocol transcript through public APIs with no core patch. That proves registry openness only; a real host remains unsupported until its installed native behavior is separately certified. [inferred]

### 3.6 Kernel authority and gate integrity

The Kernel alone accepts issue/dependency/lease/workflow/run/evidence transitions. Contracts validate interoperability, Memory stores knowledge and projections, Flow supplies execution evidence, and adapters/renderers expose views. A producer's receipt is evidence, not self-issued authority. Stateless solutions have no issue authority to synchronize; connected solutions do not create a shadow owner. [read: S5; inferred]

Before protected effects, existing owners recheck authenticated actor, current lease/epoch, expected revision/head/base, path/content binding and valid approval. Custom policy PASS remains a diagnostic until the owning admission accepts required evidence. Merge retains non-configurable exact-head/current-base/check/review/ownership protections. Reply, message, deployment and remote data changes need their own authorized operation; no block/template admission confers them. [read: S10; inferred]

Keep invariant protections separate from the reference solution's optional TDD/stage conventions. Unopinionated means other solutions can choose their workflow; it does not mean they can manufacture a protected approval. Cloud and UI consume the same checked commands. Failure, timeout, truncation, missing/stale proof or unresolved required data yields FAIL/INCOMPLETE, never successful degradation. [inferred]

| Policy owner | Owns | Must not absorb |
| --- | --- | --- |
| Platform integrity | Source/config identities, admission, capability compatibility, authority and protected-proof floors | TDD stages or delivery-template sequencing |
| Selected capability effect contract | Its mutation preconditions, actor/grant/lease/revision checks and receipts | Unrelated repository workflow policy |
| Configured repository policy | Repository-required checks, protected branches/paths and explicitly configured gates | Hidden Forge workflow defaults |
| Delivery reference template | Plan/dev/validate/ship/review/verify conventions and human checkpoints | Authority to weaken the three owners above |

Acceptance includes a connected non-delivery solution with its own node names and policy plus the stateless advisor. Neither inherits the delivery ladder; both retain every applicable platform, capability and configured repository guard. [inferred]

### 3.7 Marketplace: publication, discovery and demand

**0.1.0 minimum [inferred; P3:55–113].** Ship a curated metadata index and documented publishing path over existing npm/config artifact hosting. Blocks and templates share identity/version/compatibility vocabulary but templates are declarative compositions; executable hooks must be declared blocks with separate trust. Instantiation produces inspectable editable config, not implicit execution or credential acquisition.

Separate four records: author manifest; exact artifact reference; index-owned release review/endorsement; user-owned composition lock and host admission. Use a reserved Forge namespace and qualified outside publisher/name plus explicit registry origin. Pin exact npm package/version/integrity or full-commit config artifact/digest; no moving latest/tag/branch lock. Identity ownership/transfer, collisions, deprecation/revocation and alias migration are represented from the start. A private index cannot shadow a native ID by search order. [inferred]

Verification tiers are independent: **listed** means valid metadata/origin; **publisher verified** means ownership checked; **release reviewed** means a specific digest passed a published conformance/security profile; **Forge supported** means a named maintenance/security/compatibility owner. Authors cannot award themselves reviewed/native status. Provenance/integrity authenticates origin/bytes, not harmless execution. Review unfamiliar executable artifacts in isolated CI without production/publishing secrets. Admission covers install scripts and runtime code separately; preview never enables either. [inferred; external: E3]

Demand signals start with requested capability/problems, recurring upstream issues and attributable user feedback. Optional consented coarse successful-use/failure counts can follow; downloads alone are noisy and no prompts/project names/content are required. **Demand nominates; evidence promotes:** community → reviewed/recommended → Forge supported → native/bundled where shared need justifies it. Promotion requires license/maintainer agreement, reusable contracts, compatibility/migration/security proof and support capacity; preserve identity/aliases/provenance. Popularity does not bypass gates or guarantee core inclusion. [inferred; read: N]

| Stage | Marketplace contract and operating scope [inferred] |
| --- | --- |
| **0.1.0** | Public block/template publishing schemas, identities and source locks; local/already-installed package discovery; small curated index snapshot, submission/review and revocation/deprecation format; one outside publication/composition journey. No storefront, automatic updates or payment system. |
| **0.2** | Generated hosted search/discovery, release-specific review CI, request tracking and explicit catalog updates; private-index operations only with real demand and trust/update proof. |
| **1.0** | Maintained promotion/security-response program, publisher transfers, supported compatibility and migration; signing/rotation/federation where independently updated catalogs require it. No automatic promotion rule. |

0.1.0 publication proof also publishes/discovers an outside declarative template that composes the advisor, instantiates it and edits it through the public config API. A compatibility fixture promotes an exact community release to supported/native ownership while preserving its qualified identity or an explicit migration alias, source lock and separate execution admission. Promotion never silently changes the capability name or grants trust. [inferred]

### 3.8 Optional cloud data layer

**Reserve now [inferred; N, P3:115–181, S8].** Stable project/record/actor/device IDs independent of local paths; authority descriptor (ID, mode, endpoint/local owner and fencing generation); versioned revision/idempotency-aware command/result; accepted-event cursor separate from drafts; portable snapshot/data/blob envelopes; dataset/destination consent, retention/deletion and encryption metadata. Implement/test the local serialization and authority boundary, not empty vendor adapters or a hosted service.

| Data | Optional selected transfer | Stays local by default / authority rule |
| --- | --- | --- |
| Issues, dependencies, comments, workflow state | Consistent backup snapshots; later accepted-event/read-model sync | One Kernel writer. Restore history, never live lease authority. No database-file Git merging or last-writer-wins claims. |
| Memory notes/decisions | Selected records with provenance, revisions and tombstones | Private/personal notes and unsent drafts stay local unless specifically consented. Enrichment destinations need separate consent. |
| Receipts/evidence metadata | Immutable receipt and authorized artifact references/digests | Original identity remains intact; a receipt is not fresh-state or approval proof. |
| Raw evidence/logs | Separately selected redacted/encrypted payloads with retention | Raw prompts/tool logs/transcripts never upload by default. A redacted derivative has a new digest and provenance link. |
| Config/locks | Non-secret selected shared composition and exact identities | Credentials, personal overrides and execution consent do not synchronize into authority. New code still needs admission. |
| Indexes/caches | Usually rebuild from permitted source records | Derived search/embeddings are not authority; exporting them still discloses data. |

Repository/worktree files, absolute paths, credential/key stores, process/lock/session state and temporary caches are not recursively uploaded. A backup uses a supported consistent SQLite snapshot/export with WAL/cursor binding and verified restore; copying a live file is not the promised backup. Existing storage plans contain historical cloud/vendor/Beads language: carry forward authority/privacy invariants, reconcile the owning ADR before committing a production backend, and keep vendor selection behind this public boundary. [inferred; read: S8]

**Consistency:** local mode has a local Kernel and optional backup/read copies. Shared mode has one configured server Kernel, device read projections and pending commands/drafts. Idempotency key plus changed payload refuses; expected revision and current authority generation fence stale commands. Claims, renewals, close/verify and protected transitions require accepted current authority, including when offline. Two disconnected devices cannot both obtain an authoritative exclusive claim. Responses expose pending/accepted/rejected plus revision/freshness. No automatic switch to a local writer during cloud outage. [inferred; read: D44 conflict rule, S5]

Local/shared handoff quiesces the old writer, snapshots at a cursor, verifies destination, increments the fence and changes clients; rollback fences the abandoned writer and restores a verified snapshot. Device/app/user identities and team membership are distinct. Deletion/revocation markers survive compaction/rejoin so stale replicas cannot resurrect records or grants. [inferred]

**Encryption:** TLS and encryption at rest from the first cloud service; backups can be client encrypted with user-controlled keys and declared rotation/recovery. Server-validated authority fields must remain readable to the shared Kernel, with minimal exposure and encryption at rest. Client-encrypted private blobs are separately scoped; do not call at-rest encryption end-to-end encryption. Revocation stops future transfer/queued delivery; it cannot claw back copies already held by an app or disconnected former member. [inferred]

| Stage | Cloud scope and proof [inferred] |
| --- | --- |
| **0.1.0** | Local-first IDs/authority/data/encryption contracts, consistent native export/restore and local transfer round-trip/refusals. No hosted account or remote durability claim. |
| **0.2** | Opt-in selected encrypted backup/restore and scoped cross-device read access. Shared-authority pilot remains experimental until conflict, lease, fencing and handoff tests pass. |
| **1.0** | Supported multi-device/team Kernel authority, audited membership/revocation, reconnect/retention/deletion, failure/handoff/restore objectives and named operations ownership. |

### 3.9 No core UI; a separate native visualization domain

The core ships **public structured state/query/event/log APIs**, not a dashboard or panel framework. Reuse existing event owners; normalize their public envelope and projections rather than infer a coherent event store from current internals. [read: N, S8; inferred]

The proposed contract includes: searchable setups/instance topology, bindings, resolved config/origins/support/readiness; agent/session/run activity and statuses; saved log/history metadata with separately authorized payload reads; config validate/explain/preview/apply using expected revision. Native information is searchable; setup/config is editable **only through the same public config API**. Editing authoritative issue/run/gate fields continues through their owning checked commands, never a config or UI side door. [inferred]

Events use a CloudEvents-compatible envelope (id/source/type/subject/time/specversion) plus separately versioned Forge data, project/authority identity, entity revision, cursor, causation/correlation, contract/config/actor provenance and classification. Accepted Kernel events publish after commit; advisory activity/log events are explicitly non-authoritative. Specify duplicate delivery, at-least-once subscriptions, ordering scope, gaps, snapshot+cursor/replay, retention, backpressure and disconnect recovery. Timestamp alone is not ordering or completion. Search, payload fetch and subscriptions apply the same scope filters; full-text indexes cannot leak denied records. [inferred; external: E4]

Expose snapshot/query and resumable watch through existing local CLI/library transport first. Persistent accepted events and volatile activity are distinct; saved logs have immutable source/derivative identity, redaction, retention and paging. No token/raw-secret values in event or diagnostic payloads. Separate UI plugins receive versioned read/query/watch/config clients within their granted scope; they do not share unrestricted Kernel handles by default. [inferred]

| Stage | Visualization domain [inferred] |
| --- | --- |
| **0.1.0** | Versioned public state/event/log/query/config contracts, local implementation needed by agents and one independent consumer; snapshot/replay/search/edit refusal proof. **No native visualization app in 0.1.0.** API maturity is a release gate, not a reason to ship speculative UI. |
| **0.2** | Separate first-party native app shows searchable native info, setup composition/topology, agent activity and saved history. Setup/config edit via public config API. Initial plugin panels/views consume the same versioned clients; app has its own package/release/lifecycle. |
| **1.0** | Supported app/UI-plugin compatibility and permission model, cloud-backed permitted history and audited edit/revocation; demand-led panels and views, with no privileged core route. |

### 3.10 Bring your own solution and UI

An external application can own its UI/business data while calling the same public capability/config/query/command/event contracts. Trusted in-process callers explicitly share process privileges. A network/local-browser bridge is a separate adapter, not an unauthenticated core server or a replacement authority. 0.1.0 proves a documented standalone API consumer; browser transport is not required to build the core promise. [inferred; read: N]

**Scoped auth seam:** actor, application, device, project and consent grant are separate. A grant names operations, permitted datasets/fields, destination, purpose, expiry and revision; execution effects and data transfer have different scopes. Metadata read never implies raw-evidence read, config edit, issue mutation or merge. Derive authenticated identity at the edge and validate grant/actor/lease at every relevant command. A shipped network adapter must enforce authentication immediately: approved audience/origin, short-lived credentials, loopback-only local binding, Host/Origin checks and appropriate CSRF protection. Production remote OAuth/PKCE and service-principal operations wait for their own reviewed service implementation. [inferred]

**Clean transfer contract:** schema/contract version, stable transfer/command ID, project/object kind/ID/revision, source/destination, authenticated app/actor, grant/purpose/classification, payload or content-addressed blob reference, integrity/provenance and expiry/retention. Wrap receipts without changing their hash-valid original envelope. Preview selected records/fields and destination, minimize/redact, authorize, validate import/export size/schema, encrypt, acknowledge and audit. A transport acknowledgement is separate from Kernel acceptance. Imports are typed commands or data, never instructions to execute tools or raw SQL. [inferred]

Retries retain stable idempotency identity; subscriptions/queued dispatch recheck grant revision and revocation. Audit actor/app/grant, object references and result/revision without token/raw-sensitive payload. Hosted webhooks later need authenticated signed delivery, authorized filters, destination/SSRF controls, deduplication and bounded retries/dead letters. Large blobs use size/digest checks and short-lived scoped access. Revocation/deletion applies to future API/subscription/queued transfer and defined retention; disclose the inability to retract previously copied data. [inferred]

| Stage | Independent solutions/UI [inferred] |
| --- | --- |
| **0.1.0** | Stable local public capability/config/data/query/event clients, typed scope/consent/grant/transfer contracts and a standalone trusted consumer. Cross-project/raw-data/unauthorized-mutation refusals tested at the public service boundary. No speculative auth server; any optional bridge stays experimental and authenticated. |
| **0.2** | Supported authenticated local bridge, consented remote cloud API/data transfer, one complete independent app journey, revocation and signed-event delivery proof. Native visualization app has exactly the same access path. |
| **1.0** | Maintained SDK/API compatibility, team/app governance, service principals, audit/rotation/retention and additional client languages only where demand establishes value. |

### 3.11 Hosted-on-Forge target and self-hosted equivalence

Hosted operation is an explicit owner objective [read: N], while every runtime, isolation and service below is proposed. A logical solution keeps the same qualified solution/block identities, manifest, capability bindings, config plan and data contracts across local, self-hosted and Forge-hosted targets. A target descriptor at the deployment edge supplies endpoint, tenant/project binding, resource class and credential references. Changing target-only placement does not fork logical config; any changed capability or permission produces a new plan identity and explain diff. A design-level 0.1.0 walkthrough must lower both a plugin-panel solution and an independent UI plus lightweight backend to self-hosted and Forge-hosted target plans and show equivalent scoped Forge service calls.

**Tenancy and isolation:** user, organization/tenant, project, solution, workload, app principal and human actor are distinct identities. Hosted workloads run in tenant/project-scoped process or container isolation with separate filesystem/temp space, per-workload credentials and deny-by-default network/service access. The service broker injects short-lived grants for named Forge APIs; it never exposes shared server credentials, raw Kernel handles or another tenant's paths/data. Local in-process trust is not hosted isolation: a locally admitted trusted CommonJS block is not automatically eligible for a shared hosted worker.

**Quotas and lifetime:** each deployment declares CPU/time, memory, concurrency, storage, event rate, egress/destination and log-retention ceilings. The hosting owner owns deploy, health, restart, drain, version rollback, credential rotation, quota refusal, metering and cleanup. Quota exhaustion returns a typed incomplete/refusal and cannot create Kernel PASS. Artifact review, publisher verification, workload admission, service grants and data consent are separate decisions. Tenant/project/service authorization is rechecked at every command and subscription delivery.

| Stage | Hosted independent solutions [inferred] |
| --- | --- |
| **0.1.0** | Freeze target descriptor, workload identity, grant/service-broker, quota, event/data and portability contracts; local self-hosted target implementation plus the two-target design walkthrough and isolation negatives. Reserve deployment overlay fields. **No Forge-hosted runtime, multi-tenant isolation or remote durability claim.** |
| **0.2** | Experimental opt-in Forge hosting for static/plugin UI assets and a constrained lightweight backend profile in isolated tenant-scoped workloads; selected storage/events/auth grants, quotas, cleanup and target-equivalence corpus. No arbitrary local trusted extension runs on shared infrastructure. |
| **1.0** | Supported hosted/self-hosted portability for selected profiles with audited tenant isolation, availability/backup/restore objectives, billing/abuse controls, migrations, rotation/revocation and operations ownership. Broader profiles remain demand- and proof-led. |

### 3.12 Concrete outside block and composition

**Proposed complete example, not accepted syntax or installed API today [inferred].** An outside author builds a migration-note advisor introducing `io.github.example/migration-note.assess@1.0`. It receives normalized changed-API facts and provenance-aware Memory notes; it reports advisory guidance. Host schema validation is intrinsic, so the block does not declare a redundant validation capability. It cannot write Kernel, approve a release or infer PASS from its message.

`forge.block.json`:

~~~json
{
  "schemaVersion": "forge.block/1",
  "kind": "block",
  "id": "io.github.example/migration-note-advisor",
  "version": "0.1.0",
  "forgeVersion": ">=0.1.0 <0.2.0",
  "authorAbi": "forge.author/v1",
  "entry": "dist/advisor.cjs",
  "profile": "trusted-action-sync/v1",
  "files": ["dist/advisor.cjs", "schemas/config.json", "schemas/input.json", "schemas/output.json"],
  "runtimeDependencies": [],
  "configSchema": "schemas/config.json",
  "provides": [{
    "name": "io.github.example/migration-note.assess",
    "interface": "1.0",
    "operation": "assess",
    "inputSchema": "schemas/input.json",
    "outputSchema": "schemas/output.json"
  }],
  "requires": [],
  "effects": [],
  "license": "MIT",
  "repository": "https://github.com/example/migration-note-advisor",
  "support": "https://github.com/example/migration-note-advisor/issues"
}
~~~

`schemas/config.json` is `{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{},"additionalProperties":false}`. Domain files are complete bounded schemas.

`schemas/input.json`:

~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["changes", "notes"],
  "properties": {
    "changes": {
      "type": "array",
      "maxItems": 100,
      "items": {
        "type": "object",
        "required": ["api", "change"],
        "properties": {
          "api": {"type": "string", "maxLength": 200},
          "change": {"type": "string", "maxLength": 1000}
        },
        "additionalProperties": false
      }
    },
    "notes": {
      "type": "array",
      "maxItems": 100,
      "items": {
        "type": "object",
        "required": ["sourceId", "text"],
        "properties": {
          "sourceId": {"type": "string", "maxLength": 200},
          "text": {"type": "string", "maxLength": 2000}
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
~~~

`schemas/output.json`:

~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["findings"],
  "properties": {
    "findings": {
      "type": "array",
      "maxItems": 100,
      "items": {
        "type": "object",
        "required": ["sourceId", "message"],
        "properties": {
          "sourceId": {"type": "string", "maxLength": 200},
          "message": {"type": "string", "maxLength": 2000}
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
~~~

`dist/advisor.cjs` uses only the normative ABI and returns domain data:

~~~javascript
"use strict";

module.exports.operations = {
  assess({ input }) {
    return {
      findings: input.changes.map((change, index) => ({
        sourceId: input.notes[index]?.sourceId ?? "input",
        message: change.api + ": " + change.change,
      })),
    };
  },
};
~~~

The proposed solution uses structured JSON-Pointer references and an explicit solution input schema. Dots and slashes in keys use ordinary RFC 6901 escaping; no expression engine or inferred edge exists.

~~~yaml
schemaVersion: forge.solution/1
solution:
  id: local/release-advisor
  version: 1
inputSchema:
  type: object
  required: [query, normalizedApiChanges]
  properties:
    query: { type: string, maxLength: 500 }
    normalizedApiChanges:
      type: array
      maxItems: 100
      items:
        type: object
        required: [api, change]
        properties:
          api: { type: string, maxLength: 200 }
          change: { type: string, maxLength: 1000 }
        additionalProperties: false
  additionalProperties: false
blocks:
  memory: { source: { native: forge.memory }, config: { storage: local } }
  flow: { source: { native: forge.flow }, config: { mode: stateless } }
  advisor:
    source: { package: "@example/migration-note-advisor", version: "0.1.0" }
    config: {}
graph:
  context:
    operation: memory.recall
    input:
      query: { from: "$input", pointer: "/query" }
  assess:
    operation: advisor.assess
    after: [context]
    input:
      changes: { from: "$input", pointer: "/normalizedApiChanges" }
      notes: { from: "context", pointer: "/notes" }
execution: { instance: flow }
output: { from: "assess", pointer: "/findings" }
harnesses: { selected: [codex, cursor] }
~~~

The author manually installs the exact outside package beside Forge. Proposed `catalog describe`, `config validate` and `config explain` parse and bind without import; a separately authorized lock apply captures exact bytes; purpose-bound admission permits conformance/invocation; then adapters invoke the unchanged plan. The catalog-locked `memory.recall@1.0` output above makes `/notes` a required bounded array, so this mapping is statically assignable and a successful no-result read supplies an empty array; read failure leaves the required node INCOMPLETE rather than fabricating fallback notes.

The first public-doc quickstart is only these files plus one conformance command. The public conformance corpus runs ordinary output, thrown error and Promise return through the wrapper. A separate manual-config arm does not use scaffold output. Memory remains independently durable; stateless Flow opens no Kernel. A connected variant may record host-observed execution through the authorized Kernel client, but author output cannot mint accepted progress. Unknown source, invalid pointer/interface, absent explicit `after`, missing admission, source change, permission increase or protected mutation refuses at the owning boundary. [inferred]

## 4. The reference solution

**Forge's own workflow becomes forge.tdd-delivery [inferred; P2:98–151].** Contracts + Kernel + Memory + Flow + Worktrees + Policy + Review + Delivery form the core composition; Harness connectivity projects it and Skills guide it. A versioned template supplies executable nodes, required artifacts, classification variants, human checkpoints, TDD/review policy and exact-head guarded delivery. Small-change/docs variants are configurations/templates over the same APIs.

| Reference action | Block/data path | Opinionated template policy |
| --- | --- | --- |
| Plan | Memory context → Contracts artifacts → Kernel approved scope; Flow schedules research/critics | Planning rigor, critics, output paths and plan checkpoint. Approval of plan is not later effect permission. |
| Dev | Kernel current ownership → Worktree isolation → Flow admitted implementer/reviewer → Policy evidence | TDD/spec/quality loops, selected reviewers and bounds. Other solutions may choose different engineering methods. |
| Validate | Flow checks → Contracts evidence → Policy decision → Kernel accepts head/config-bound proof | Check/risk applicability; no missing/failed required proof transformed into success. |
| Ship | Delivery guarded push/PR link → Kernel association → durable monitor | Branch/PR policy and effect authorization, with existing required entry/docs gates. |
| Review | Review normalized current-head findings → Flow corrections → Kernel evidence | Provider policy and outage/refusal; replies/resolutions separately authorized. |
| Guarded merge | Delivery live rechecks + Kernel lease/approval + mandatory Policy → expected-head merge | Opt-in automatic merge and extra predicates; no universal seventh workflow stage. |
| Verify/resume | Merged-head health/artifacts → Contracts/Policy → Kernel terminal state; Memory recall | Completion/observation and recovery. Docs-only pre-ship verify remains an explicit variant. |

**Needed to get there:** public service/client seams for the actual reference operations; one executable template representation; generic catalog/operation compiler and Kernel composition progress; shared effective config consumed by CLI/library/harness; canonical assets/native projection; refusal/resume and installed equivalence tests. Preserve the legacy CLI behavior during a slice-by-slice migration and remove duplicate state/readers only when the new owning path passes. Do not export the whole CLI or rebuild already folded packages. The outside advisor is deliberately not a delivery-stage workflow: it proves the platform is more than a configurable reference ladder. [inferred; read: S1–S6]

The reference template demonstrates one declared fallback for an optional review/enrichment provider and one bounded retry encapsulated by an existing operation; the graph itself remains a DAG. A connected non-delivery template with different node names proves Kernel use does not import the TDD stage policy. [inferred]

## 5. 0.1.0 scope

This is the **planned support contract after proof**, not a statement that these APIs currently ship. SUPPORTED requires documented installed conformance; EXPERIMENTAL requires explicit opt-in, named limits/refusals and no stable compatibility implication; LATER is architectural direction with no implicit shipped behavior. [inferred]

| Area/block | SUPPORTED in 0.1.0 | EXPERIMENTAL | LATER |
| --- | --- | --- | --- |
| Outside authors | Public manifest/capability/schema/docs/scaffold; novel trusted sync actions, local source and manually installed pinned bundled CJS package; declared bindings/conformance | Additional module/dependency/effect profiles only after named pilot proof | Untrusted sandbox, automatic installs/updates, general dependency solving, live HMR |
| Config/catalog/templates | Four layers; public pure resolve/validate/explain; origins, locks, atomic revision-checked edits; delivery/small-change plus user composition | Optional wider patch/service forms with explicit migration | Team/user hierarchy, broad inheritance and reactive reconfiguration |
| Contracts | Existing packets/receipts/identity plus supported author/config assets and errors | New producer/provider formats with corpus proof | General cross-language SDK expansion on demand |
| Kernel | Local authority/client lifecycle, guarded commands, connected composition progress and recoverable export | Shared-authority pilot not in release default | Production team/cloud authority |
| Memory | Useful local append/recall/provenance/export/forget without Flow; preserved local floor | Optional enrichment providers with clear availability/privacy limits | Cloud/team enrichment and richer graph providers |
| Flow | Stateless and connected built-in execution; generic admitted sync outside operation; truthful evidence and actual built-in cancellation paths | Outside async/service/subprocess profiles only if separately certified | Universal supervision, arbitrary process isolation/rollback |
| Policy/gates | Required invariant guards and reference policy; explain/evidence clients | Additive custom evaluators whose results cannot mint approval | Broader policy marketplace profiles |
| Worktrees | Reference-required isolation/link/refusal/cleanup using landed safety owners | Additional setup/install strategies with measured proof | Remote fleet/workspace management |
| Review | Reference-required normalized provider/read behavior; guarded authorized existing effects | Additional third-party providers with declared outage/version limits | Broad managed review marketplace |
| Delivery | Existing guarded standalone push/link/monitor/merge through selected public service operations | Additional hosts/remotes only with live/current-head proof | Managed remote execution/hosting |
| Skills | One physical canonical .agents/skills distribution; owned native links/wrappers and preservation | Explicit managed-copy fallback only if separately chosen/proved | Separate marketplace skill artifacts if demanded |
| Native harnesses | Advertised Claude Code/Codex/Cursor/Hermes behaviors certified; new advisor in Codex and Cursor | OpenCode/other adapters and genuinely unsupported optional features | More supported adapters based on demand/conformance |
| Marketplace | Publishing/identity/lock/review formats; curated index and outside publication journey | Explicit private index pilot, no inherited trust | Hosted storefront, federation operations and commerce |
| Cloud | Local data/authority/backup envelope and consistent local round-trip/recovery | No production cloud service implied | Selected encrypted backup in 0.2; shared authority later |
| Hosted solutions | Shared target/workload/grant/quota contracts, self-hosted implementation and two-target design walkthrough | No hosted runtime claim | Isolated hosted UI/backend pilot in 0.2; supported selected profiles by 1.0 |
| Events/state/log APIs | Searchable local snapshots/topology/activity/history; scoped query/watch/replay and config edits | Optional authenticated bridge | Hosted subscriptions/webhooks and mature remote app API |
| Visualization app/UI plugins | None in core; published contracts available to independent clients | Separate prototype only after API/event gates, outside 0.1.0 release | Native searchable/editable setup/activity/history app and panels in 0.2; mature plugin support by 1.0 |
| Own solution/UI | Standalone trusted consumer through public API; scope/consent/data contract and service-boundary refusals | Authenticated local/browser bridge if needed and priced | Supported local/remote transport, OAuth and app governance |
| Binary distribution | Existing advertised core journeys on seven native targets | Outside-package loading until every advertised binary loader path passes installed admission proof | Wider external module loading; never inferred from npm success |

Retain the default **native-Kernel beta.5 and beta.8 upgrade support**, including beta.8's older package graph and Node-floor transition. Stable 0.0.10, Beads-only and unsupported layouts get preserved non-mutating automatic-upgrade refusal plus honest manual/return guidance. D46 fixes that 0.1.0 ships no Beads importer; implementation remains unmerged work. Preserve native codecs, backup, provenance, `beads_refs_json`/`beads_import` history and existing data for audit/return without retaining executable importer support. [read: R:113–128, S5, round1-feasibility-safety; inferred]

## 6. Workstreams and milestones

Effort is a scope class: **S** bounded helper/metadata; **M** one service/distribution slice; **L** coupled runtime/consumer work; **XL** multi-platform/authority/operations campaign. Classes are not engineering days. Each stream has one owning issue/approved-plan scope when implementation is later authorized; shared package/lock/schema/generated assets have one integration owner. Do not count existing fold/worktree protections twice. [inferred; L2, L3]

| Order / milestone | Change, value and how | Effort / risk | Proof gate | Prerequisites |
| --- | --- | --- | --- | --- |
| **Delivery truth** | Retire the unconditional duplicate CI Gate producer through its owner; preserve authoritative Tests/doc producer and mixed/rename/fail-closed classification. Align configured required contexts and actual artifact jobs. Prevent false successful readiness. | M / high evidence risk | Exactly one authoritative verdict per intended head/run; a deliberately failing required case cannot report PASS; all existing required contexts retained. | Current protection/workflow census; named landing owner. Must precede dependent release claims. |
| **Operating contract and safety** | One serial landing front, queue initially ≤3; shared session/lease protocol and authorized handoff/readback. Reconcile CI-flake-only quarantine versus local timeout prose and P0/P1/regression review bar. Retain landed worktree detach/restore/identity fixes; prove install-input compatibility or own install. | M / high data/coordination risk | Sentinel removal/refusal/restore cases across all supported callers, no lost shared install; lease transfer proven, no actor impersonation; cited CI flake required for quarantine. | Existing Kernel/claim/worktree owners. Contract before fan-out; landed code acceptance, not duplicate implementation. |
| **Bounded delivery tools** | Retire deprecated team-sync shell wiring through owning hook config; diagnose shared Windows identity/fixture cost before changing implementation. Bound necessary identity operations with PID-reuse/fail-closed correctness. Provider outage recovery remains same-head and explicit. | M / high for identity, medium latency | Real quick-push/fresh-worktree trace; unchanged gates; no indefinite optional step; identity reuse/unknown cases and complete native correctness evidence. | Delivery contract, narrow process/hook scope. Safety fixes early; speed targets alone do not gate product. |
| **Pilot and optional confidence** | Five ordinary changes plus one coupled platform/package/Kernel slice through real landing loop; record correction/base heads, CI/review waits, lease and owner time. Diagnose Stryker initial-suite failure and produce scored/seeded-mutant proof where admitted risks rely on it; performance/mutation experiments have separate capped budget. | M / medium capacity risk | Pilot evidence, no retry-to-green/quarantine shortcut; mutation confidence claimed only after actual report and caught seeded mutant. | Above tools/contract; pilot need not wait for all product work. Configured jobs stay intact at budget expiry. |
| **Public contract and catalog lock** | Freeze the normative author ABI, bounded schema profile, structured references, layer algebra, compatibility matrix, template/operation/error/version schemas, source profile and support inventory; publish installed exports/types/assets/generated quickstart. Makes a new capability authorable. Reuse existing indexes. | L / high compatibility risk | Packed clean consumer imports only public entries; complete manifest/schemas/handler/config run through wrapper; docs/types/corpus agree; invalid/unknown consequential fields refuse. | North star and support choices; initial runner/operator access. Own manifest/package changes once. |
| **Config compiler and edit path** | Extend one existing resolver to caller catalog/template/graph/layers; bind operations and obligations; expose explain/scaffold plus safe revision-checked edits. Makes config executable and agent-generatable. | L / high semantic/gate risk | Novel operation lowers to real handler; inert YAML cannot pass as executable; origins/merge/reset/provider replacement, cycles and protected-floor negatives pass. | Locked author/interface schemas; config/shared-reader inventory. |
| **Admission and generic runtime** | Reuse lock fingerprints; implement supported source closure/snapshot and purpose-bound admission; bind into SkillRuntime with owned cleanup and Kernel-connected progress. Provides safe explicit source identity, not a sandbox. | L / high trust/authority risk | Import sentinel untouched for preview/unadmitted/wrong-purpose/changed source; snapshot race test; exact artifact/config receipt; partial cleanup and authority negatives. | Compiler/catalog, public Contracts/Kernel clients; existing resource owners. |
| **Outside vertical slice** | Install an actual packed preliminary Forge artifact outside checkout beside an independent bundled advisor; exercise local/package discovery, real config, Memory/Flow, wrapper evidence and one native invocation. Rehearse one beta.8 input and one binary external-loader refusal early. | M / high unknown integration | Cold public-docs author succeeds in at most two submitted block+config candidates without private source/core patch; wrapper negatives, repair case, new capability/package/native result and required refusals pass. | Generic runtime/admission and one ready adapter; explicit code-trust operator. |
| **Reference solution migration** | Express delivery and small-change/docs variants as template/config; expose only required Worktree/Policy/Review/Delivery clients; migrate facade/shared readers slice by slice. Proves first-party dogfooding and intact behavior. | L / high regression risk | Reference workflows use same compiler/runtime; classifications/checkpoints/current-head guards/resume remain correct; no duplicate authority. | Outside-slice contract feedback; config, Kernel and owning service clients. |
| **Native connectivity and canonical assets** | Open adapter registration and generate selected solution surfaces; migrate physical canonical skill assets/owned links and narrow native wrappers. Prove four advertised hosts, advisor in Codex+Cursor. | L / high host/access risk | Outside adapter ID fixture registers with no core patch; real installed T0–T4 transcripts where promised; unchanged advisor domain config; user-content/link/refusal/cleanup; package/binary discovery. | Contract/plan stable enough; named allowed native operators; canonical/package owner. Start access and one-host pilot early. |
| **Pruning and artifact closure** | Retire serve/product dashboard/insights, deprecated dep-guard/team shell paths and duplicate PR delegates; retain pr link/test dashboards/unique proof. Delete skills workspace after overlap; adopt no-importer release correction while preserving native codec/export. | M–L / medium hidden-caller risk | Wide caller/assets/hook/test census, actual npm/binary contents and budgets, native export and unsupported-origin refusal; no weakened gate or lost unique behavior. | Owning inventories and public/skill-path decisions. Can overlap disjoint service work; final metadata under one owner. |
| **Recovery and claim acceptance** | Certify beta.5/beta.8 preflight, backup/restore, interruptions, post-write disposition and safe return; copied native corpus claims/leases/epoch/projection contradictions. Keep live operational repair separate. | L / high data-loss risk | Every selected origin and negative path preserves promised data/old usable install; exact corpus identity/receipts and no restored active leases. | Settled supported public/config/assets; immutable origin fixtures and authorized certification operators. |
| **Public state and local data boundary** | Normalize existing events into searchable scoped snapshots/watch/log contract; local transfer/config edit proof; freeze hosted target/workload/grant/quota contracts without building the service. | M–L / high privacy/replay risk | Independent client queries/edits through public APIs; transfer/refusal/replay pass; plugin-panel and independent backend+UI walk through self-hosted and Forge-hosted plans with tenant/isolation/least-privilege negatives. | Catalog/config and Kernel committed-event owners; no hosted service or UI dependency. |
| **Final candidate and platform certification** | Freeze BOM and artifact bytes; run G0–G8/full applicable campaign, outside author in two harnesses and first-attempt config benchmark; observe final candidate and promote accepted identity only. | XL / high access/rework risk | All required strata/receipts/digests PASS, none INCOMPLETE; complete observer; live channel/asset/default-install readback. | All advertised support proved; publication policy/generators, actual devices/hosts/observer and maintainer window. |
| **0.2 hosted pilot (post-0.1.0 milestone)** | Implement the selected isolated static/plugin UI plus constrained lightweight-backend profile over frozen target/grant/quota contracts. Keep self-hosted and Forge-hosted logical plans equivalent. | XL / high isolation/operations risk | Cross-tenant/path/service denial, quota/cleanup/rotation, scoped event/data access, target-equivalence and rollback/restore objectives pass under named operations ownership. | Accepted 0.1.0 public contracts; owner decision 11; hosted operators/infrastructure. Explicitly outside the 0.1.0 critical path. |

**Milestone order [inferred]:** trustworthy delivery + acceptance/access lock → schemas/public clients/compiler/admission → one outside vertical slice → reference workflow + remaining native/state/recovery/pruning work → final installed campaign → seven qualifying days → approved immutable promotion. Independent pruning/inventory/operator provisioning can overlap; interfaces, lock/generated assets, authority and final candidate each have one owner. A failed outside pilot revises the contract before broad fan-out.

The L3 entry repairs are included explicitly. Worktree protection is already landed at this source snapshot and receives acceptance, while duplicate gate/retired hook/identity/protocol gaps are reconciled against current heads. Informational bot markers must produce truthful blocker verdicts, and review-provider outages cannot be repaired with speculative code churn. Optional speed/mutation experiments never authorize disabling a configured lane or accepting missing admitted proof. [read: S9, L3; inferred]

## 7. Release proof

### 7.1 Preserve G0–G8 and risk applicability

The prior nine static readiness checks are not these nine release strata. Repository CI/static success is useful prerequisite evidence; only candidate/BOM-bound installed receipts supply final acceptance. Update obsolete Node22/separate-package/importer mechanics without reducing outcomes. The canonical matrix is S11; G4 authority/security is never quarantined, and G1 retains conservative selection fallback. [read: L1, R, S11; inferred]

| Gate | Required final proof [inferred, preserving R/L1] |
| --- | --- |
| **G0 static/format** | Strict lint/types/schema/docs/generated consistency and artifact inventory bound to final content. |
| **G1 risk selection** | Owned risk/applicability manifest, complete corpus/shard membership and digests; no silent exclusion of named strata. |
| **G2 blocks/package** | Installed public consumers, independent Memory/Flow, default/reference assembly, outside block/config/lifecycle and actual npm/binary assets. |
| **G3 contracts/providers** | Accepted packet/receipt/producer/capability/config compatibility corpus, forward/backward behavior, idempotency and conflict proof; substitution, invalid data and unsupported-version refusals. |
| **G4 authority/security** | Claims/revisions/epochs/protected approval/write/merge guards; source admission, permission increase, cross-project/scoped API refusal and no custom-PASS bypass. |
| **G5 migration/data** | Every supported origin, unsupported-origin preservation, dry-run, consistent backup/restore/replay/interruption/post-cutover-write return; no restored leases or missing history/provenance. |
| **G6 platform** | npm OS/Node matrix; all advertised binary native targets/embedded runtime; process/SQLite/install/link behavior and applicable host differences. |
| **G7 journeys** | First use/resume, Memory/Flow/reference, native T0–T4 where promised, reducer/feedback/privacy/triage obligations, cold outside author through two harnesses and agent-config benchmark. |
| **G8 release** | Immutable published artifact/BOM/provenance/assets, complete tri-state aggregate, all applicable clean cases and seven exercised qualifying days; approved channel promotion/readback/reversal. |

### 7.2 Full matrix and campaign

**npm:** Ubuntu, macOS, Windows × Node24/26 = six named environments; exact downloaded tarball installed outside checkout. Memory-only, Flow stateless, Flow connected and facade are distinct modes, not extra arbitrary Cartesian axes. **Binaries:** Windows x64; macOS x64/arm64; Linux glibc x64/arm64; Linux musl x64/arm64 = seven actual target executions. Bundled runtime is recorded, so Node24/26 is not an extra binary axis. Cross-build success is not native execution. [read: R:134–155; inferred]

**Harnesses:** Claude Code, Codex, Cursor, Hermes on the declared Ubuntu/macOS/Windows combinations, with installed versions, access, native transcript and promised delivery/wake/resume/notification/cancel/cleanup. Document the exact T0–T4 applicability and tested refusal for genuinely unsupported optional capabilities. Metadata alone never passes a live behavior. Claude requires its permitted Claude-origin operator; this Codex synthesis does not invoke it. Cursor/Codex platform proof can be delivered by their permitted native operators without a browser. Operator availability is currently uncommissioned. [read: R, S6; inferred]

Keep the canonical non-platform strata explicitly: schema/provider compatibility and idempotency/conflicts; claim/lease/epoch/gate authority; monitor/delivery cancellation, timeout and process reaping; owned lifetime cleanup; reducers where unchanged, duplicate or oscillating observations consume no model turn and emit only bounded actionable transitions; consent-gated feedback without identity/device leakage or client model-token use; event-driven triage receipts; distribution integrity/provenance/dist-tags/lock and exact-head merge-train behavior. The new event API must preserve those reducer/privacy obligations rather than replace them with presentation-only tests. [read: S11:60–80; inferred]

| Initial distinct case/environment inventory | Pairs |
| --- | ---: |
| Four independent modes across six npm environments | 24 |
| First use/resume across six npm environments | 6 |
| Installed independent block consumer across six npm environments | 6 |
| beta.5 and beta.8 native upgrades across six npm environments | 12 |
| Stable/unsupported-origin refusal across six npm environments | 6 |
| Four existing live harness cases on three declared native hosts each | 12 |
| Seven native binary targets | 7 |
| Adversarial authority/contracts/protected-data/recovery across six npm environments | 6 |
| Sequential owned exact-head/current-base train simulation | 1 |
| **Preserved prior inventory** | **80** |
| New outside-package/new-capability composition and refusal suite across six npm environments | 6 |
| Same outside solution's live native Codex and Cursor invocation | 2 |
| Fixed agent-config output corpus validation/execution parity across six npm environments | 6 |
| **Initial platform inventory** | **94** |

Ninety-four is an initial indexed inventory, not a completion count. Composite cases may need splitting for attribution; scope lock maps every obligation to an owner/case and adds missing event/data/permission/upgrade cases. Preserve **at least 50 distinct clean pairs plus every applicable case/stratum**; the floor never permits dropping the rest of the promised matrix. Distinctness is case+environment identity, not repeated runs. No extra benchmark-output rows manufacture observation credit. [inferred; read: R]

Before final sizing, freeze a case/operator ledger enumerating each promised operation x npm environment, binary target and harness applicability, its fixture, operator, access status, expected receipt and owning proof gate. Commission the four harness operators, seven native binary targets and observer during entry work. A missing operator changes date or explicitly approved support scope; UNAVAILABLE cannot stand in for a promised case. [inferred]

### 7.3 Outside-author platform proof

Give a cold independent author only the frozen public docs/catalog/schema, installed candidate and the advisor brief. Work outside Forge's tree; one author arm uses an agent with no private-source access. It builds/packages the new namespaced capability, composes existing Memory/Contracts/Flow, obtains valid explain output and runs the **same manifest/block/domain config in real Codex and Cursor**. No core patch, hidden deep import, special harness switch or human integration rescue counts as passing. [inferred]

Capture public-doc input identity, author intervention log, exact source/package/manifest/config/contract identities, installed candidates and host versions, native transcripts, domain assertions and cleanup/restart results. The author writes an advisory finding; the host owns execution evidence and any Kernel acceptance. Test input/output/schema/version/slot/cycle/mapping failures; preview/import sentinel; wrong/missing/conformance-purpose admission; changed source and capture/load race; required capability refusal; permission increase; stale/protected writes and custom approval/PASS attempts. Preserve provider substitution and independent stateless/connected variants. [inferred]

A second compatible provider replaces the narrow optional service/action at explicit restart without changing its consumer interface or leaking options. Local Memory remains durable with optional enrichment absent. Unavailable dependency, missing native transcript, private import, ignored config, mismatched identity or incomplete cleanup makes platform proof **INCOMPLETE**. Any advertised binary external-block path needs the same installed proof; otherwise binary scope explicitly refuses that path and cannot advertise npm-equivalent extension support. [inferred]

Also publish/discover/instantiate/edit the outside declarative advisor template; register the outside adapter fixture; and run the community-to-supported/native identity/alias compatibility fixture. The 0.1.0 hosted proof is the frozen two-target walkthrough and isolation/grant/quota refusal corpus, not a live hosted-service claim. [inferred]

### 7.4 Agent-authored config and repair benchmarks

Freeze **30 satisfiable composition tasks** before the candidate: independent blocks, outside action binding, community-template extension, ordered layers/reset/null/defaults, two providers/explicit substitution, secret-reference-only config, stateless/connected execution and structured JSON-Pointer mappings. Publish expected assertions and exact catalog/schema/doc identities. Use at least two named installed authoring agents/providers/versions, 15 tasks each, with public docs only and no human repair/private source. Freeze seeds/settings where exposed and preserve every first output/failure. [inferred]

At least 10 of the 30 tasks are manual/no-scaffold arms, split five per authoring agent; the rest may use the recorded deterministic scaffold. The 30/30 denominator and first-submission rule are unchanged for both arms. [inferred]

**Release bar remains 30/30:** every first submitted config must parse, pass complete semantic validation and execute its expected harmless fixture output. "First submitted" is the first candidate offered for validation after any exploratory read/scaffold/API calls and before validator feedback; a validator/conformance rejection consumes the submission. Scaffolding is permitted and recorded; it cannot silently repair invalid config. Recheck the exact frozen corpus across all six npm environments. A campaign failure revises contract/docs, freezes a new corpus/candidate and records the failed campaign; it is never rerun into 30/30 by discarding first attempts. This is a bounded release benchmark, not a capacity estimate or universal success claim. [inferred]

Add **10 separate unsatisfiable/forbidden prompts** (missing/incompatible capability, invalid binding, undeclared effect, protected-floor removal, scope escalation). Expected typed refusal before execution is the bar; these do not enter the 30 valid-task denominator. Measure discovery, structural, semantic, executable and native stages separately; success at one cannot satisfy the next.

Add a distinct cold-author gate with at least two task briefs frozen before documentation tuning, including one withheld task. For each task, allow **at most two submitted block+config candidates total**. A candidate submission is any task-directed block, config, or pair presented to the typed builder, validator or conformance API for candidate-specific feedback, including a rejected partial component. Catalog reads and scaffold generation without candidate feedback remain exploration. Multiple checks on one byte-identical frozen candidate share its identity; any feedback-driven byte/config revision is the next candidate. Public feedback may be used between candidates. Maintainer code, undocumented/private APIs or altered fixture assertions fail the trial. Host-supplied explicit trust is an allowed environment prerequisite, never author assistance. The passing candidate must contain the complete block+config, produce useful output through the generic path and run unchanged in Codex and Cursor.

The repair corpus contains repairable unknown-field, interface-version mismatch and optional/bad-output mapping cases. Candidate one must receive the exact code, JSON Pointer, origin, constraint and allowed repair; the agent applies only public APIs/docs and candidate two produces expected output. Genuinely forbidden authority/effect requests remain refused. Report every candidate identity, component/pair submitted, feedback used, elapsed effort, manual intervention, unsafe/private actions and final stage per task. Preserve initial failures and start a new recorded trial after material docs/contract/fixture changes. [inferred; read: round1-agent-buildability]

### 7.5 Candidate, observation and promotion

Retain preliminary immutable rc.N iterations, then default to a **literal stable-version candidate on npm next and a non-latest GitHub prerelease**. Freeze source/manifest/lock/Bun/binary inputs, all schema/capability/config/support/corpus/severity-policy digests and final docs/assets in a signed BOM with verified digests. Fix existing publication generators/asset overwrite behavior through their owner before use; build/pack once, do not clobber assets or republish a version. [read: R:259–266, S11; inferred]

Changing artifact/version/BOM identity invalidates every receipt bound to the old identity. Any alternative signed-equivalence policy must enumerate invalidated evidence and rerun every applicable final campaign; a signature alone cannot transfer mismatched receipts or satisfy exact-BOM acceptance. [inferred]

Run the full campaign on those exact published bytes and **seven cumulative qualifying automated exercised days**. Each day has candidate-bound installed journeys, failure events, durable time/cursor evidence, complete required receipts and observer recovery. An outage pauses credit; resume only if the interval/events are reconstructable, otherwise start a fresh qualifying window. The aggregate binds BOM/policy/corpus digests, distinct cases, per-gate tri-state, required strata, S0/S1 disposition and all window events/retries. Preserve the canonical S0/S1 severity definitions and signed downgrade rule; neither a block nor an agent can quietly relabel a failure. Missing/truncated/stale evidence and unresolved S0/S1 block eligibility. Product/dependency/toolchain/corpus/policy corrections create a new candidate and fresh required campaign/observation; preliminary RC days do not automatically transfer. [read: R, S11; inferred]

If published 0.1.0 fails, leave it unpromoted, disposition it visibly, fix under a new version such as 0.1.1 and repeat required proof. First accepted stable may therefore be 0.1.1. Promotion changes channels/metadata to accepted bytes without rebuilding; re-fetch registry integrity/provenance, **every required asset**, installed default-channel journeys and release blockers. Reserve maintainer/substitute operator windows. Prior channel states and verified backup/restore define reversal; redirecting latest is not rollback of migrated user data. [read: R; inferred]

## 8. Achievability and risks

**Achievable in principle; capacity/date not yet proven [inferred].** Reusable source foundations reduce implementation, but public author/config/closure/native contracts and outside-documentation usability are missing work. The previous renderer marginal estimate and local-product calendar cannot price this platform. There is no defensible completion percentage or sustained-capacity multiplier from raw merge counts.

L3's measured historical cohort had 28 merges over five UTC calendar dates, including work outside its requested cohort; its 4–6 ordinary or 1–2 coupled PR/day planning rates are judgments, not measured owner-hour capacity. Historical Windows job median was 536s versus 98s Ubuntu and 175s macOS; the paired Windows/Ubuntu ratio was 5.25×. These measure selected CI jobs, not an attributed process-identity cause or a release-date multiplier. Review correction/base updates and operator/access wait can dominate. Do not sum overlapping speed-saving scenarios. [read, historical: L3:188–204; R:capacity]

**Resource assumption to test:** one landing/integration owner with roughly three focused hours per workday, up to three disjoint implementation lanes, one certification lead sharing those resources, named native/harness operators and durable observer/publication coverage. Contract/config/package/generated files each have one owner. This is illustrative staffing, not current availability. More agents cannot multiply the serial contract, review, artifact or permitted-host bottleneck. [inferred; retained R/L3]

After the early pilot, replace the allowance with an owner-loaded dependency estimate: each coupled stream records worker scope, owner review/integration hours, operator turnaround, correction reserve and the tasks serialized by the single package/config/Kernel owners. No historical PR/day rate substitutes for those measurements. [inferred]

**Provisional timing:** allocate 1–2 weeks to entry/access/contracts and a complete outside vertical slice; 3–5 additional weeks to reference/native/state/author documentation/recovery/pruning; 2–4 weeks to complete final artifact/access-dependent campaign, corrections and seven qualifying days, with overlap where owners allow. Their overlapping planning envelope is **8–12 calendar weeks**, not the arithmetic sum of effort classes. From an October 1 staffed start that points broadly to late November–December 2026; no start/access/capacity commitment is made here. Corrections can exceed it. [inferred]

Reforecast after **five ordinary + one coupled pilot or execution day 5**, then at **ten working days** and after the cold outside-author/two-harness pilot. If execution starts October 1, retain October 7/14 as planning checkpoints, not release dates. Record active owner effort, authoring/rework, CI/base/review wait, native operator turnaround, first-attempt config success and critical-path dependencies. Until access and a real pilot pass, do not endorse a calendar. [inferred; retained R/L3]

Widening the public client/config migration, service lifecycle, hosted/browser profile or event/data boundary invalidates the current allowance and triggers a fresh dependency/owner forecast before that scope enters 0.1.0. [inferred]

**Critical path:** delivery truth + scope/access → public author/config contracts → generic compiler/admission/runtime → outside/native pilot → reference/config/Kernel progress and selected origins → final content/BOM → full applicable installed campaign → seven qualifying days → maintainer promotion/readback. Canonical assets, lifecycle/trust and actual native operators can serialize it. Marketplace hosting, cloud operations, native UI and broad HMR are outside 0.1.0's critical path. [inferred]

| Risk | Mitigation / proof | What slips if unresolved [inferred] |
| --- | --- | --- |
| Fixed workflow repackaged as a platform | Novel capability + independently packaged author + non-delivery solution through same compiler/harness path | Platform release; no substitution of thin freeze as equivalent success |
| Public compatibility/closure becomes much larger than expected | Bundle-only trusted profile, explicit slot binding/manual install and one early outside pilot; price expanded profiles separately | Async/stateful/dependency formats and possibly the release date |
| Config forks, ignored declarations or floor bypass | One pure compiler; migrate legacy readers/unknown fields; final obligations plus effect-time owner checks | Reference/config migration; broader layer hierarchy waits |
| Trust confused with locality/review or import TOCTOU | Metadata-only discovery, separate purpose admission, captured-source execution and sentinel/race checks | Third-party support until proven; no weakening admission |
| In-process code hangs or escapes declared effects | Explicit trusted profile/ambient-privilege ceiling; existing supervised paths only; no deadline/sandbox claim | Wider execution profile, not input validation/security |
| Missing native/binary/harness access | Name operators/versions/devices at start; one real path early and complete inventory | Date or explicit approved support revision; never invented degradation |
| Owner/review/CI bottleneck | Serial landing queue, batched correction head, bounded same-head provider recovery, measured WIP | Optional expansions and schedule; no retry/quarantine shortcuts |
| Recovery/claim cutover damages state | Immutable native-origin corpora, verified backups/restores/fencing and exact digest approval for any later live operation | Support/date; live store repair remains separate by default |
| Cloud becomes accidental dual authority or broad upload | Mode-specific single writer, pending vs accepted, scope/consent and local-only defaults | Shared sync/cloud maturity; local platform remains usable |
| UI or event plugins become privileged side channel | Same scoped public queries/commands/config edit, replay/freshness and non-authoritative activity distinction | Separate visualization app/panels after contract proof |
| Final candidate correction resets observer | Preliminary RCs expose failures; preserve immutable version/bytes and reserve operator windows | At least a new qualifying week plus corrections/campaign/access |
| Marketplace review/support outgrows capacity | Curated exact-release metadata first; demand nominates, support owner/evidence promotes | Hosted marketplace/automatic updates, not author contract |

Release claim acceptance defaults to copied/versioned native corpora. The current owner's operational database remains unknown; this synthesis performs no scan/dry-run/repair. A later live repair requires shared-writer quiescence, fixed-time preflight, independently verified backup/restore, exact whole-database digest approval, transactional CAS/fencing and complete claim/lease/readback before resuming. Any intervening write invalidates approval. General plan approval does not approve that digest. [read: R:126–128; inferred]

## 9. Value and transformation

These are expected gains [inferred], not measured adoption/reliability outcomes. N sets the direction; the proof in section 7 makes each gain reviewable.

| Builder/agent/owner | Gain | Transformation and proof |
| --- | --- | --- |
| Outside builder | Reuse capability owners rather than rebuild storage, execution, contracts and native integration | Public-docs-only new block composes without private imports/core patch; independent package and identical domain config in two harnesses |
| Solution builder | Own opinionated workflow/UI without forking Forge | Versioned template/config plus public operations; non-delivery advisor and reference delivery share the same runtime |
| Authoring agent | Discover interfaces and produce executable config with actionable errors | Schema-generated catalog/docs, deterministic layers/explain and 30/30 first-submit benchmark with actual fixture output |
| Runtime agent | Carry context/evidence and use native capabilities across hosts | Real native invocation, truthful availability, preserved receipts/resume/ownership and owned cleanup |
| Reference-workflow user | One install with reliable authority and recovery | Local Memory without mandatory Flow, stateless Flow without Kernel, connected safe delivery and selected-origin return proof |
| Owner/maintainer | One authority, fewer duplicate implementations and a demand-driven roadmap | Keep landed foundations, one compiler/landing owner, exact artifact proof and curated promotion with maintenance ownership |
| Community author | A discoverable route from local prototype to reviewed/supported capability | Same publishing identity/schema, exact-release review, feedback/demand and compatible native promotion |
| Multi-device/team user | Optional saving/sharing without losing local-first ownership | Later selected encrypted backup/read sync and single shared Kernel acceptance/fencing |
| Human/native UI user | Searchable setups/activity/history and editable config without a privileged dashboard | Separate extensible app consumes the same stable state/events/config APIs and scoped data contracts |
| External app owner | Bring own UI/business logic with secure selected transfer | Public clients, explicit app grants/consent, revision/idempotency and audited revocation; no raw DB/shell access |

## 10. Decisions needed

### Reconciliation of the prior fifteen decisions

The north star settles the platform definition, outside authors in the 0.1.0 design, config as the product surface, open harness connectivity, marketplace/cloud/BYO architecture and no core UI. One package, Kernel authority and gate integrity remain fixed. These are not questions again. Letters below are reply shortcuts only, never names for capabilities or workstreams. [read: N, C]

| Prior question | Replacement/disposition [inferred] |
| --- | --- |
| Plan 1: local staged / thin freeze / full vision | **Drop the product-definition choice.** Minimal complete platform is the default; thin freeze is an internal milestone. Remaining execution-profile staging goes to new 1. |
| Plan 2 + block 1: narrow public surface / ownership granularity | **Merge into new 1 and contract lock.** Public author/config/catalog mandatory; selected operations/profile support remains a choice. Twelve owners are not a product boundary or twelve extraction deliverables. |
| Plan 3: upgrade origins | Retain as new 2. |
| Plan 4: corpus versus live claim cutover | Retain as new 3. |
| Plan 5 + block 6: certification resources/date/marginal effort | Merge into new 4; retire the old renderer-only estimate and October release stretch as platform forecast. |
| Plan 6 + plan 7: optional delivery/mutation investment | Merge into new 5; required safety/evidence fixes stay required and configured gates stay intact. |
| Plan 8: final publication identity | Retain as new 6. |
| Plan 9: link failure/copy/new artifacts | Retain as new 7; actual canonical content/owned native discovery is settled. |
| Block 2: receipt renderer versus Memory/provider | **Drop the fixed-interface-only choice.** New capability names in a supported class are required. Broader action/service support is new 1. |
| Block 3: config layers versus fixed toggles | Retain bounded layer staging as new 8; **drop fixed toggles as an adequate platform option**. |
| Block 4: lifecycle/replacement | Retain as new 9, preserving existing owners and explicit restart substitution. |
| Block 5: third-party later versus published now | **Drop third-party postponement.** Pin outside package in 0.1.0 proof. Hosted marketplace/install expansion becomes new 10. |

New 11 and 12 decide staging within the now-settled cloud and visualization/external-app architecture. Marketplace promotion always remains demand-led plus compatibility/security/license/support ownership; popularity alone is not an alternative safety policy.

### Open questions for the owner

Defaults below preserve the north star while staging operating cost. All choices are planning recommendations; implementation, installation, live operations and publication require their later authorized scope.

1. **Outside execution/public support. A — trusted bundled sync actions plus selected built-in service clients**, generic new capability names and pinned outside package proof. **B — add outside async/stateful services in 0.1.0**, price lifetime/effect/recovery support. **C — require isolated outside execution before release**, scope/process/security proof and later date. **Default: A.** No option retreats to renderer-only/private APIs.
2. **Upgrade origins. A — beta.5 and beta.8 native Kernel supported; stable/Beads-only preserved automatic refusal/manual return. B — add inspected native stable-origin support**, separately priced without Beads importer. **C — fresh/beta.5 only**, explicitly refuse beta.8 and revise promised scope/campaign. **Default: A.**
3. **Claim release boundary. A — versioned copied-corpus certification; current-store operational repair separate. B — require a later current-store cutover**, quiet window/verified backup/restore and exact-digest approval. **C — stage operational cutover after stable**, retaining full product corpus and owning parent criteria. **Default: A.** No digest is approved here.
4. **Resources and forecast. A — commission native/harness/observer operators now and reforecast after day-5/ten-day/outside pilots**, use 8–12 weeks only as provisional allowance. **B — obtain resource-loaded commitments before choosing any date**, same platform scope. **C — explicitly revise advertised support/date when an access lane is unavailable**, full proof for remaining promises. **Default: A.**
5. **Optional delivery/mutation budget. A — safety/truth first, retain configured mutation lane, cap new performance/mutation experiments at two worker-days/four owner-hours alongside product. B — expand budget and admitted mutation breadth**, name capacity/value and reforecast. **C — defer new optional experiments**, keep configured jobs, required safety fixes and visible limits; claim no absent mutation confidence. **Default: A.** Budget expiry never disables a gate or supplies PASS.
6. **Publication identity. A — preliminary RCs, then literal stable-version candidate on next/non-latest GitHub prerelease with full exact-byte proof**, accept possible first promotion of 0.1.1. **B — conventional RC-to-stable evidence transfer**, only after an explicit acceptance-rule revision enumerates every receipt invalidated by artifact/version/BOM identity changes and reruns every applicable final campaign; a signature alone transfers no mismatched evidence. **C — stay prerelease**, not completed stable release. **Default: A.**
7. **Skill-link failure. A — canonical physical assets/owned native links and actionable refusal for required-link failure. B — approved managed copies**, provenance/drift/update/restore proof. **C — new separate native marketplace artifacts**, independent cache/update/discovery certification and cost. **Default: A.**
8. **Config layer breadth. A — defaults → pinned template → project → invocation**, explicit merge/reset/replacement and protected invariants. **B — add team/user hierarchy now**, specify scope/precedence/migration and cost. **C — template/project layers first**, retain generic block bindings but explicitly narrow other overrides/documentation. **Default: A.** Fixed-toggle-only is removed.
9. **Lifecycle/update support. A — startup-only outside actions, existing owned built-in lifetimes and explicit restart substitution/resume-or-refuse. B — add managed outside setup/dispose**, partial failure/cleanup and admission proof. **C — reactive in-flight replacement**, separately price drain/cancel/state transfer/recovery. **Default: A.** No same-process enforced deadline or universal rollback claim.
10. **First marketplace. A — curated exact-release metadata index over npm/config hosting with documented publication/review. B — hosted independently updated discovery/install service in 0.1.0**, add auth/signing/update/security operations. **C — private/federated registry operations first**, add origin/trust/transfer compatibility and resources. **Default: A.** Outside package discovery/publication remains required under all options.
11. **First cloud and hosting service. A — 0.2 selected encrypted backup/restore/read access plus an experimental isolated hosted UI/lightweight-backend profile; shared-authority pilot later. B — prioritize shared team authority in 0.2**, expand command/fencing/membership operations and defer hosted workloads. **C — stage both hosted launch and shared authority after 0.2**, retaining 0.1.0 data/authority/consent/target/isolation/portability seams and local proof. **Default: A.** No parallel writable Kernel, automatic promotion of local trust into hosted admission, or general offline claim acceptance.
12. **Visualization and external-app staging. A — public searchable state/events/config/data APIs in 0.1.0; separate native extensible app and supported authenticated bridge in 0.2. B — require supported network/browser integration in 0.1.0**, add auth/transport/revocation proof and reforecast, still no core UI. **C — public APIs/independent clients first; native app by 1.0**, retain UI-plugin-compatible contracts now. **Default: A.** All setup/config edits use the public API.

**Valid reply:** a labeled option for each numbered question, or a combination in numbered order. **Overall default: A for all twelve** — minimal complete platform, native beta.5/beta.8 recovery, corpus claim acceptance, commissioned resources/pilot reforecast, bounded optional investment, exact candidate, owned links, four layers, startup substitution, curated marketplace, backup-first cloud plus an isolated 0.2 hosted UI/lightweight-backend pilot, and separate 0.2 visualization/app integration.

### Confidence

**High** in north-star alignment, inspected remote source boundaries, inherited release/recovery obligations and current registry readback. **Medium** in the smallest compatible architecture/staging: schemas/compiler/admission/native authoring are proposed and must survive the outside pilot. **Low** in sustainable staffing/calendar, demand, wider closure/lifecycle/sandbox and cloud/app operational outcomes; none was measured here. This is a written synthesis plan, not implementation authorization, installed conformance, release certification or full plan-to-dev stage completion.
