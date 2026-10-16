# Forge platform plan v4

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

**Status.** This supersedes platform-plan-v3, platform-plan-v2 and platform-plan-v1 plus the product framing and staging recommendations in the supplied plan.md and blocks/blocks-plan.md. It preserves their applicable acceptance and recovery obligations. Only platform-plan-v4.md and eval/round3-revision-log.md are written. No implementation, dependency installation, issue mutation, GitHub write, commit, push, browser or Claude invocation is part of this synthesis. A default below selects a recommendation for later approval, not permission to execute it.

**Evidence and reading.** [read] means inspected source or a supplied research/plan artifact; [ran] means the named command/readback was executed and proves only that result; [external] identifies a checked primary source; [inferred] marks design, estimates and future proof obligations. Every unimplemented API, ID, schema, command and support status below is **proposed** unless explicitly called current. Source inspection is rung 2; a readback does not establish installed behavior or live harness conformance.

The source snapshot is origin/master, **7d448ec812ef8639790477af07c3c75962173f8a**. This worktree remains at ba56b9201782c4d1246c77bde6380867603184bf; local source is not substituted for the remote. [ran: October 1 revision readback of git rev-parse origin/master and git ls-remote origin refs/heads/master, which agreed; input identities recorded in eval/round3-revision-log.md] The round-two feasibility critic's registry readback returned latest=0.0.10, beta=0.1.0-beta.8, and no RC or stable 0.1.x versions. Published beta.5/beta.8 advertise Node >=22.16.0; the new source minimum is >=24. That distinction belongs in upgrade testing. [read: round2-feasibility-safety.md, independent registry check; S1]. This is an attributed September 30 snapshot, not a fresh registry experiment by this revision.

All required inputs were consulted: platform/P1–P3, plan.md, blocks/blocks-plan.md, research/L1–L5 and blocks/B1–B3. Their settled mechanisms are reused; historical measurements are attributed rather than presented as new experiments. No platform implementation, installed artifact, migration, outside-author, agent-generation or observation campaign was run here. Narrow probes of the existing remote runtime/Memory boundary are reported separately below and do not establish proposed-platform conformance.

**Round-three change [read: all three platform/eval/round3 critiques; ran: S16/S17; inferred].** Preserve the north-star platform, support staging, twelve reasoned defaults and every inherited gate. Specify the host binder's one-node SkillRuntime lowering and connected checkpoint/resume; bound all outside captured bytes before code admission. Close the ten numbered improvement occurrences, including the duplicate graph-proof request, through explicit catalog handoff, exact-schema/docs repairs, portable/admission identity, canonical grant operations, an independent withheld non-delivery task, two-state contract lock and old-runtime upgrade refusal. Every item has a disposition in [the revision log](eval/round3-revision-log.md). This is the requested plan.synthesis fragment only: fresh planning/setup, task/issue creation, implementation, full plan-to-dev handoff and shipping are skipped under the two-file/read-only brief.

### Evidence register

Code references below resolve at the pinned remote SHA above; supplied planning inputs are current local artifacts.

| Key | Inspected basis and boundary |
| --- | --- |
| **N** | [Owner north star](../north-star.md), definition lines 7–23 and consequences 27–35. Overrides common.md and both older product definitions. |
| **C** | (local scratch): repository/read-only/write limits and retained owner constraints. Its old product scope yields to N. |
| **R** | [Prior plan](../plan.md): upgrade/claim boundary 113–128; full campaign and observer 130–159; capacity 186–213; immutable candidate/correction policy 259–266; nine decisions 288–304. These are inherited proposals, not completed certification. |
| **B** | [Prior block plan](../blocks/blocks-plan.md): admission 124–136; lifecycle/protection 138–165; layers/resume 202–307; baseline/delta accounting 397–480; six decisions 484–501. Its renderer-only/later-third-party limits are superseded here. |
| **P** | [P1](P1-platform-external.md), [P2](P2-gap-reframe.md), [P3](P3-marketplace-cloud.md): outside authoring, config gap, marketplace/data/app seams. Positive source claims were checked through S1–S10; ecosystem mechanisms used here retain the prior draft's pinned primary-source checks E1–E4. V3 opened E5; those inherited checks are not presented as new experiments here. |
| **L** | [L1](../research/L1-current-state.md), [L2](../research/L2-architecture.md), [L3](../research/L3-delivery.md), [L4](../research/L4-value-scope.md), [L5](../research/L5-external.md), [B1](../blocks/B1-prior-work.md), [B2](../blocks/B2-code-seams.md), [B3](../blocks/B3-external.md). Historical inventory, independent capability boundaries, preservation/cuts, delivery measurements and lifecycle research. |
| **S1** | [package.json](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/package.json#L1-L76): one package/bin, residual skills workspace, Node floor; no main/exports/types map. Existing source indexes are not yet promised installed subpaths. |
| **S2** | Contracts index:17–31; Flow index:93–114; Memory-core index:319–331; [SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L159-L205): reusable schemas/runtime, injected handlers and capability checks; dependency/cycle resolution at 309–361. |
| **S3** | [Runtime graph](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972-L996): fixed base plus known config sections; graph-envelope schema 10–39; four phases 236–288; unknown phase refusal 645–652; locked rails 645–718. Options views: lib/commands/options.js:145–229; sparse writer: lib/config-writer.js:43–84,96–126. |
| **S4** | [Memory registry](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/backend-registry.js#L85-L171): replaceable enrichment with protected local floor. Flow executor:217–260 uses synchronous provider execution; SkillRuntime's awaited handlers are a different existing path. |
| **S5** | [Kernel-only backend](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/issue-backend.js#L6-L20); broker:1677–1706,1871–1906; owned-kernel:27–43. [D44/D45](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/work/2026-04-28-skeleton-pivot/locked-decisions.md#L567-L599) establish authority; D45 still retains inbound import on source. D46 is ACTIVE and owner-accepted in open PR #564 at `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`; that decision makes 0.1.0 no-importer, while code removal remains separate work and historical `beads_refs_json`/`beads_import` data remains preserved for return/audit. [ran/read: synthesis-lead Forge-routed `gh pr view 564`; `git show 2f7fe92...:docs/work/2026-04-28-skeleton-pivot/locked-decisions.md` lines 605–617] |
| **S6** | [Harness matrix](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/harness-capability-matrix.js#L5-L24); probes:18–87; PluginManager:221–259 reads built-in JSON descriptors. [Parity boundary](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/reference/AGENT_SKILL_PARITY.md#L156-L164): metadata is not live native invocation. |
| **S7** | [Existing add/lock groundwork](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/commands/add.js#L82-L117); forge-lock:116–184,187–250 fingerprints/rechecks local files or records explicitly untrusted remote sources. It does not implement generic manifest/package-closure admission, composition or activation. Local trusted metadata is not operator execution consent. |
| **S8** | Gate/context events: lib/gate-events.js:3–24,61–88; lib/grounding/context-events.js:3–21,52–68; PR-monitor events:3–18,28–46,68–87,125–160; workflow/state.js:1–43. Useful internal events/state, without an inspected unified public query/subscription contract. [Storage reference](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/reference/FORGE_KERNEL_STORAGE_MODEL.md#L102-L121) separates authority, read models and local-by-default raw logs; it is a planning reference with historical Beads clauses, not proof of cloud deployment. |
| **S9** | L3:146–218 and R:delivery evidence; remote scripts/process-tree.js:251–273, lefthook.yml:64–79, .github/workflows/required-checks-bypass.yml:104–114, test.yml:960–1008. The prior synthesis's read-only Kernel/GitHub results found worktree protection merged (#582), while its issue still said open; identity, optional-sync, lease/review handoff and mutation records remain open. test/QUARANTINE.md:8–9 still permits local recurrence, conflicting with the owner's CI-flake-only rule. Reconcile source acceptance rather than trust stale issue status. |
| **S11** | [Canonical validation matrix](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/work/2026-08-09-forge-product-restructure/validation-matrix.md#L8-L18): G0–G8; exact-artifact matrix 60–80, distinct clean-pair rule 84–86, S0/S1 and signed downgrade policy 88, aggregate/observation eligibility 90. Node22/24 at 65 is superseded by current test.yml:141–150 and retained owner Node24/26 scope. |
| **S10** | Owning protections: lib/protected-state-authority.js:178–243; lib/gate-events.js:200–220; lib/commands/merge.js:749–795,1368–1419,1462–1464. Configuration and custom results cannot mint protected approvals or replace mandatory merge evidence. |
| **S12** | [Round-two agent-buildability critique](eval/round2-agent-buildability.md): all five blockers and three improvements; source inspection of SkillRuntime:3–49,116–142,296–306 and Memory registry:73–82,113–154. The current domain and result mismatches are verification targets, not failures of an implemented new compiler. |
| **S13** | [Platform-fit critique](eval/round2-platform-fit.md) and [feasibility/safety critique](eval/round2-feasibility-safety.md): the twelve-default audit, two proof improvements, schema-processing blocker and six other improvements. Historical delivery, protection and registry readbacks are attributed to their dated sources. |
| **S15** | V3's research worker read the full research legs/prior plans and read Forge-routed GitHub: worktree safety #582 MERGED at 7d448ec..., date-bounded September 25–29 cohort 29 merges (0/2/5/12/10), mutation run 36570515358 failed at Run mutation testing, and #564 OPEN at 2f7fe92c.... These are object/status readbacks, not runtime acceptance or a new capacity experiment. |
| **S14** | V3 worker's transient exact-remote probes: one-change SkillRuntime control PASS; 100 changes INCOMPLETE/BOUNDED_INPUT_EXCEEDED without handler call; maxNodes 400 INVALID_LIMITS; registry recall returns value/receipt and no notes. [ran, rung 4 for these current behaviors only]. Native projection inspection: lib/memory/router.js:264–283,418–451 and lib/kernel/sqlite-driver.js:2313–2356. No new wrapper/installed/harness proof. |
| **S16** | [Round-three authoring critique](eval/round3-agent-buildability.md), independently verified here against exact origin/master SkillRuntime:3–4,101–139,159–239,253–288,335–361. Transient exact-blob probe: 1/14/15-node chains PASS; 16/32 INCOMPLETE/BOUNDED_OUTPUT_EXCEEDED, zero handler calls; 32 separate one-node calls PASS. Rung 4 for those primitives, not proposed binder/packed/resume proof. |
| **S17** | [Round-three safety critique](eval/round3-feasibility-safety.md), independently checked against origin/master forge-lock:66–91,116–140. Its existing fingerprint helper whole-reads regular files without a source-size precheck; an independently replayed in-memory fs double reporting a 2,147,483,648-byte regular file reached exactly one whole-read sentinel without creating/allocating/reading a large file. [ran, rung 4 for the existing helper's decision only]. This motivates an explicit bounded snapshot contract; no OOM or future capture implementation is claimed. |
| **S18** | [Round-three platform-fit critique](eval/round3-platform-fit.md): no platform-fit blocker; portable/admission identity, grant-operation notation and a non-delivery withheld task are design clarifications. The twelve-default reasoning audit remains accepted at the document rung; installed platform and later-service behavior remain unproved. |
| **E5** | [JSON Schema validation security considerations](https://json-schema.org/draft/2020-12/json-schema-validation#name-security-considerations) and [Ajv untrusted-schema guidance](https://ajv.js.org/security.html#untrusted-schemas), opened during v3's revision: expensive patterns and untrusted-schema compilation/validation need separate treatment. Mechanism evidence only; Forge is not asserted to use Ajv. [external] |
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
| Manifest | JSON data with schemaVersion, kind=block/template, qualified publisher/name, artifact version, compatible Forge package range, author ABI, entrypoint, config schema, provides/requires, lifecycle/execution profile, declared effects, license/repository/support and schema/doc references. Human title/description/examples belong in manifest-declared documentation records keyed by schema/operation identity and JSON Pointer, outside the author validation schema; scaffold and generated docs use those records. Documentation bytes in the captured set obey the same closure budget. No executable schema module or install hook during discovery. |
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
| Block artifact | `@example/migration-note-advisor@0.1.0` | Exact version plus publication integrity and captured-set digest; no range is resolved at run time. |
| Capability interface | `io.github.example/migration-note.assess@1.0` | Provider implementer and consumer ranges must intersect; unknown consequential fields refuse. |
| Event / transfer contract | named `v1` contracts | Reader/writer direction, additive fields and replay behavior are tested separately; no blanket N/N-1 promise. |
| Portable artifact/capability identity | qualified publisher/name, exact origin/version, captured-set digest; catalog interface identity | Hash the sorted, length-delimited relative file names and exact captured bytes, including manifest/contracts. Absolute install roots, temporary snapshot paths, invocation purpose and target placement are excluded. Identical captured artifacts at two roots retain this digest and capability identity. Package origin/version remains an explicit portable artifact reference. |
| Local source/admission binding | resolved root/placement + portable artifact digest + config/contract/purpose | A separate host descriptor binds the local placement, snapshot, exact source and invocation consent. Relocation, package transition, source/config/purpose change or expiry requires appropriate fresh admission; portable identity never transfers execution consent. This descriptor is local and is not synchronized as authority. |

Publication integrity over exact registry artifact bytes and the root-independent captured-set digest are distinct fields; both remain pinned where a package is selected. The logical plan hashes portable artifact/capability/contract/config identities, excluding absolute installation roots and target-only placement. Local catalogs/locks/admission descriptors retain the separate root/placement binding and can change on relocation while logical identity remains equal. Equal source bytes do not equate different publisher/origin/version references or convey consent. [inferred]

The contract-lock artifact publishes an executable compatibility table for each selected block, operation, config, event and transfer contract: consumer version x implementer version, old/new host x old/new provider/config, additive-field behavior, experimental opt-in, resumed old-plan disposition and preserved-history/refused-resume cases. N/N-1 applies only where that row explicitly promises it. Local-only author metadata may omit license/repository/support; publication requires all three plus a support contact and source origin. [inferred]

The smallest supported executable profile is **one bundled CommonJS action file, declarative JSON schemas and host-injected public services**. The author may build the bundle with its own tools; Forge adds no bundler dependency. A package can declare Forge as a peer and use public contracts in development/conformance. The supported module policy is the explicit trusted contract above; it does not claim computed-load or ambient-effect containment. Broader formats become experimental only after explicit closure/compatibility proof. [inferred]

**Admission sequence [inferred, retaining B].** Resolve real paths and descriptors without executing code; capture the complete supported outside set, including executable bytes, with the observed-byte and aggregate bounds in section 3.3, into a host-owned immutable-for-the-invocation snapshot. Compute the root-independent portable artifact digest over relative entry/file names, manifest/contracts and exact captured bytes, then bind the resolved source root/placement in a separate local source/admission descriptor. Bind effective config/options identity and purpose separately. Receive an affirmative trusted embedding-caller/operator decision over that descriptor. Import only the admitted snapshot, invoke through the generic host and dispose owned bindings/snapshot after completion. Reuse add/lock fingerprinting where it fits, but do not reuse its locality-based trusted bit as consent. [read: S7]

Hash-then-require of the original path leaves a check/load race. Snapshot loading closes the supported-path race; it does not defend against malicious same-user modification or sandbox ambient access. No persistent consent database is needed for the initial invocation-scoped model. A harness decision is reusable only if its adapter supplies verified affirmative source/purpose scope. YAML, enabled flags, marketplace badges and author-provided hashes cannot mint that decision. [inferred]

#### Bound service clients: one normative call

**Proposed supported interface [inferred; S12 blocker 1].** Every provided operation publishes a capability interface, input/output schema, execution mode (`sync` or internal `async`), allowed effects and error catalog. The example shorthand `@1.0` means interface SemVer `1.0.0`. A synchronous outside action may bind only a synchronous public client, not arbitrary internal driver objects or an async monitor client.

A nonempty requirement has this complete shape; a slot name is local to the consuming instance:

~~~json
{
  "slot": "lookup",
  "capability": "forge.memory.recall",
  "interface": ">=1.0.0 <2.0.0",
  "operations": ["recall"],
  "execution": "sync",
  "effects": ["memory:read"]
}
~~~

For an advisor variant containing that entry in `requires` and declaring `effects: ["memory:read"]`, the instance config is:

~~~yaml
advisor:
  source: { package: "@example/migration-note-advisor", version: "0.1.0" }
  config: {}
  bindings:
    lookup: { instance: memory, capability: forge.memory.recall, interface: "1.0.0" }
~~~

The one call is `services.lookup.invoke("recall", {query: input.query})`. It synchronously returns exactly one of:

~~~json
{"status":"OK","value":{"notes":[{"sourceId":"note:fixture-1","text":"Check the contract before changing the API."}]}}
~~~

~~~json
{"status":"INCOMPLETE","error":{"code":"CAPABILITY_UNAVAILABLE","pointer":"/blocks/advisor/bindings/lookup","repair":"Bind a ready synchronous forge.memory.recall@1.0.0 provider."}}
~~~

The client returns a detached schema-valid **domain value**, not a driver handle, private receipt or credential. Host-owned observations retain source operation/receipt provenance separately. The adapter calls the existing owning client/registry; it does not introduce a new Memory store. Unknown operation, incompatible/missing/ambiguous/async binding, failed provider and denied effect/scope have distinct stable codes. Compatibility and readiness checks precede author import; readiness UNKNOWN is reported until the explicit host probe.

The wrapper records every required-slot refusal. If the author ignores an INCOMPLETE result and returns a substitute, the wrapper still marks the node INCOMPLETE and publishes no successful domain output. A host-probed ready client can later become unavailable; that remains a runtime refusal. A thrown provider error becomes a redacted typed client error; an unexpected Promise is `CAPABILITY_ASYNC_UNSUPPORTED`, never implicitly awaited. Synchronous rejection cannot cancel ambient effects from trusted code.

Bindings convey **no consent or mutation authority**. The host checks the requirement's declared effect, current actor/grant and owning-service policy on each call. A memory-read grant cannot create a note, issue or approval. Existing async/built-in operations remain callable only by their supported profile; they are not smuggled into the sync client contract.

**Canonical permission key [inferred].** A grant operation is the selected catalog tuple serialized as `<qualified-capability>@<exact-interface-SemVer>#<operation>`; the Memory example is `forge.memory.recall@1.0.0#recall`. Compile resolves graph-local `memory.recall` (instance memory, operation recall) and bound `services.lookup.invoke("recall", ...)` to that tuple. Graph aliases, node/instance IDs and slot names convey no authority. State query/watch fixtures likewise use their catalog capability `forge.state@1.0.0`, never an alias. Exact-version grants are conservative: changing to another interface version requires its own matching grant, even if a compatibility range permits binding. At effect time the owning client checks this key **and** actor/app/project/dataset/field/destination/purpose/revision/expiry constraints. Renaming an alias leaves the authorized key unchanged; rebinding to an ungranted key/version/effect or foreign project/data refuses. Rebinding code still needs its own source admission. The corpus includes successful harmless alias rename plus refused operation/version/project rebinds; no new permission naming subsystem or alias-based wildcard is introduced.

At least one cold-author task must declare this requirement, bind it and actually call the slot. The disclosed variant below illustrates the service ABI; it is not the withheld task's solution. This variant's bounded `{query,changes}` input uses the same query/Change schemas as section 3.12, and its output uses the same Finding schema. Its complete operation body is:

~~~javascript
module.exports.operations = {
  recallAndAssess({ input, services }) {
    const result = services.lookup.invoke("recall", { query: input.query });
    if (result.status !== "OK") throw new Error("Required lookup failed");
    return {
      findings: input.changes.map((change, index) => ({
        sourceId: result.value.notes[index]?.sourceId ?? "input",
        message: change.api + ": " + change.change,
      })),
    };
  },
};
~~~

The refusal already recorded by the host takes precedence over this generic thrown message. Conformance includes actual bound calls, incompatible/absent/async/denied providers, ignored refusal, and compatible provider replacement at explicit restart. This is a variant over the same author ABI and schemas, not a second runtime or a new lifecycle profile.

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

For the complete advisor, `forge.memory.recall@1.0.0` / operation `recall` is a proposed **named public notes projection**. The present registry returns `{value,receipt}`, not this domain contract [read: S4:113–154]. Freeze and generate these full public schemas before catalog lock:

~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["query"],
  "properties": {"query": {"type": "string", "maxLength": 500}},
  "additionalProperties": false
}
~~~

~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$defs": {
    "Note": {
      "type": "object",
      "required": ["sourceId", "text"],
      "properties": {
        "sourceId": {"type": "string", "maxLength": 200},
        "text": {"type": "string", "maxLength": 2000}
      },
      "additionalProperties": false
    }
  },
  "type": "object",
  "required": ["notes"],
  "properties": {
    "notes": {"type": "array", "maxItems": 100, "items": {"$ref": "#/$defs/Note"}}
  },
  "additionalProperties": false
}
~~~

The owning adapter reuses the native Memory read/representation owners: `sourceId = note.id` (stored `entry.key`) and `text = note.note` (the existing `toNote(entry)` string/structured-value rendering), not guessed registry fields. `lib/memory/router.js:264–283,418–451` at the pinned remote supplies that mapping [read: revision worker and final source check]. Freeze its string and structured-value fixtures with the public contract. Router recall's `{notes,total,capped,query,limit,scope}` convention is consumed by the owning adapter, not exposed as the public domain value. **Do not directly reuse its convenience recall entry unchanged:** it calls `migrateJsonlNotesOnce` before reading. The public read client must reuse the owning read/selector/representation path without that implicit write. Any supported conversion belongs to separately authorized upgrade/initialization; unsupported retired input is preserved/refused. Preview and a memory-read grant cannot authorize migration. The public projection permits precisely these two fields. Omitting internal provenance from **this explicitly named projection** does not delete durable records: the host observation retains the original operation receipt and source-record identities, accessible only through separately scoped provenance reads. Preserve raw scope/confidence/supersession/Beads provenance before router projection when those fields are promised; preserve existing sourceAgent/machine/timestamp/tags, and do not synthesize `created_at` because the current read model omits it [read: lib/kernel/sqlite-driver.js:2313–2356]. An unknown source codec or missing identity/text refuses as `MEMORY_PROJECTION_UNREPRESENTABLE`; no string coercion, truncation or invented identifier makes it pass.

A successful no-result read is `{notes: []}`. More than 100 selected results is `MEMORY_RESULT_LIMIT_EXCEEDED`; an overlong field or malformed selected record is `MEMORY_PROJECTION_UNREPRESENTABLE`. The owning read requests a bounded **101-result lookahead** so exactly 100 query matches can be distinguished from overflow: the current router conservatively flags a full query result as capped. Seeing the 101st refuses the whole public result, never silently keeps the first 100. The read path also enforces domain byte/record bounds before unbounded materialization. The initial operation does not silently take a page or omit offending records; the diagnostic asks for an explicit narrower query. A future named selection/paging operation must expose cursor/selection semantics. Failure/unavailability of required local Memory produces no value. Optional enrichment failure may retain valid local results only under the existing catalogued degraded/local-floor semantics, with degradation preserved in the host observation; it does not fabricate notes. A remaining `capped:true` or `total` greater than the complete returned selection is `MEMORY_RESULT_INCOMPLETE`: neither a valid 100-note page nor an empty page proves complete recall. Detect that condition through the owning read path. No implicit paging is supported.

The advisor's Note/notes schema is exactly this resolved schema, including count, lengths, requiredness and closed properties. Producer extra **public** fields refuse output validation; raw durable extra metadata remains preserved behind the deliberate projection. G3 proves empty/populated, 100/101, both field boundaries, missing/extra public fields, raw provenance preservation, malformed source codec and optional-enrichment degradation. Required node failure is INCOMPLETE. Literal fallback remains confined to absent optional properties of a successful producer. [inferred; S12 blocker 2]

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

- Author schemas use a published resource-safe subset of JSON Schema 2020-12: `$id`, `$schema`, local `$defs`/`$ref`, `type`, `properties`, `required`, boolean `additionalProperties`, `items`, `enum`, `const`, `default`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`, `minLength`, `maxLength`, `minItems`, `maxItems`, and boolean `x-forge-secretRef`. **Author `pattern`, `format` and `uniqueItems` are initially unsupported and refuse**, alongside external refs, executable/custom keywords and all other keywords. This narrows v2's proposed profile before support, without disabling an existing gate. No regex heuristic or event-loop timer is substituted for enforcement. Numeric input is finite JSON data; `multipleOf` in the initial subset is limited to positive integer divisors with safe-integer operands, otherwise discovery refuses. `title`, `description` and `examples` likewise return `UNSUPPORTED_SCHEMA_KEYWORD` with schema pointer/origin and the repair “move annotation to the manifest-declared documentation record”; they are never silently ignored. Scaffold emits those documentation records and the guide repairs an ordinary generated schema containing them without changing validation assertions. This outside-author allowlist does not narrow existing predefined host wire schemas. There is no coercion. `default` is materialized after layers resolve only for an absent property; false, zero, empty string and explicit null are present. Null requires explicit schema inclusion.
- Every solution declares its input schema. Data references are objects `{from:"$input"|"node-id", pointer:"/JSON/Pointer", fallback?:<literal>}`; RFC 6901 escaping (`~0`, `~1`) makes dots and slashes ordinary key characters. No dotted path or expression grammar exists. A node reference does not create order: it must name a producer in the consumer's explicit transitive `after` set. Compile-time checks prove the referenced schema location exists, then apply the bounded identity rule below. They do not claim arbitrary JSON Schema implication. Optional source to required target refuses unless the target is optional or a schema-valid literal `fallback` is declared. The fallback applies only to an absent optional property after successful producer execution; explicit null is a value, and failed/unavailable/INCOMPLETE producers never become success through a fallback. Invocation still validates actual values.
- Defaults -> pinned template -> project -> invocation resolve low to high. Template/project/invocation changes use ordered patch records `{op,path,value?}` with JSON Pointer paths. `add` requires the effective path to be absent and creates a layer value; `replace` requires it to be present and writes a layer value; `remove` installs a tombstone that hides lower-layer data and suppresses schema-default materialization; `reset` removes that layer's contribution/tombstone and reveals the lower value. Arrays always replace as a whole through `add`/`replace` in 0.1.0; there is no item append/remove syntax. `reset` happens while folding that layer, then defaults materialize once after all layers for absent, non-tombstoned properties. Removing a required property fails final validation. Explicit null is an add/replace value, never reset.
- Changing a provider/source replaces that instance's implementation-specific options as a unit before validating the new provider; stale options never carry across. At a location marked `x-forge-secretRef: true`, the public wire and handler config type is **only SecretRef**: a closed object `{"$secret":"NAME"}` with a nonempty, bounded symbolic name. It is not a string/object union accepting a plaintext credential. The marked schema must describe that object exactly; misplaced annotation or reference at an unmarked location refuses. Compile, explain, generated types, handler config and saved locks retain the reference. Only the separately authorized owning credential/service edge resolves it when performing the granted effect; the outside handler/client never receives a resolved credential. Missing-secret readiness is typed and redacted; no preview env lookup occurs.
- Structural parse, schema validation, semantic binding, admission/readiness and execution are separate states. A selected required node must lower to exactly one executable binding before semantic validation can pass. Unknown declarations or ignored graph entries are errors, never successful normalization.

#### Declarative processing budget and mapping compatibility

**Proposed default bounds [inferred; S12/S13, E5].** These are design limits to certify, not measured safe throughput. They govern descriptor discovery, parse, schema compilation, layer/default/reference handling, compatibility checks and runtime value validation **before unknown code admission**.

| Input/work | Initial ceiling and refusal |
| --- | --- |
| Manifest/schema files | 64 KiB UTF-8 each; descriptor/schema processing remains limited to 1 MiB aggregate per selected catalog closure; reject before full parse if exceeded |
| Captured outside-source set | One 1 MiB aggregate across **all outside files selected for the composition**, including every manifest, schema/documentation file and executable .cjs byte from local and installed-package blocks; it is not a separate allowance per block. Each executable must fit the remaining aggregate allowance; native Forge code is not copied into this outside closure. No separate unbounded code allowance. Refuse before import or whole-file allocation as `SOURCE_CAPTURE_LIMIT_EXCEEDED` |
| Solution/config or domain value | 2 MiB UTF-8 per document/value; depth 16; 16,384 structural nodes; finite JSON primitives and own data properties only |
| Schema graph | Depth 16, 4,096 nodes, 128 definitions, 256 reference edges and 16 reference hops; local acyclic references only |
| Composition/layers | 32 executable DAG nodes, 256 edges, 512 total patch records; no dynamic loops or YAML alias expansion |
| Enumerations/defaults | At most 64 enum entries per keyword, aggregate literal bytes within schema budget; defaults obey instance limits and no recursive materialization |
| Processing | 1,000,000 accounted visits/comparisons per resolve/validation operation, including parse tokens, dereference, canonicalization, defaults, enum checks and instance checks; exhaustion is INCOMPLETE, never PASS |
| Diagnostics | Bounded number/size, pointers and constraint summaries; observed secret locations are redacted, never echoed |

**Bounded capture [inferred; S17].** Retain real-root containment and regular-file checks, including entry/file allowlists. Check individual stat sizes and aggregate declared size before copying, then enforce actual observed bytes through bounded reads/copies, reading at most the remaining allowance plus one lookahead byte and never copying overflow bytes; a file that grows after stat cannot exceed the snapshot ceiling. A post-`readFileSync` length check is too late. Hash precisely the bytes written to the owned snapshot, verify captured manifest/relative-file membership and digests, and import only after affirmative purpose-bound admission. Capture refusal cleans all partial owned snapshot files/handles and produces no import, handler call, successful lock/admission or execution receipt; the prior lock/config stays intact. Streaming without a total bound is insufficient. G3/G4 include exact-boundary/one-byte-over code, individually valid files exceeding the aggregate, growth after stat, changed bytes and partial-cleanup cases for both source forms. The shared ceiling is a conservative starting rule, not a measured universal bundle capacity; price a separate code allowance only if a required packed author fixture exceeds it and measured memory/disk/work/cleanup cost justifies that explicit profile change.

The parser must enforce byte/depth/node/token budgets before unbounded allocation or recursive descent. For YAML, reject duplicate keys, aliases/anchors, merge keys, custom tags and cyclic values; JSON duplicate keys also refuse. Already-parsed library input is checked for ordinary own data before traversal; no getters, proxies, custom coercion/toJSON or inherited properties execute during preview. Use memoized acyclic reference resolution rather than expanding an exponentially shared graph. Unknown/cyclic refs and traversal-budget exhaustion return distinct typed diagnostics, with no author import.

Map merging and JSON Pointer access use own-property lookup and null-prototype maps or equivalent safe construction. `__proto__`, `constructor` and `prototype` are ordinary literal data keys: they cannot change prototypes or traverse inherited properties. Dots/slashes still work via RFC 6901; blanket rejection would contradict the public grammar. Tests include inherited fields, magic-key insertion, escaped paths and nonexistent own properties.

**Static compatibility is deliberately exact.** Resolve local refs within the limits, remove only non-validation identity labels (`$id`, `$schema`) and canonicalize the complete rooted schema with sorted object keys. Keep all assertions, defaults, SecretRef annotations, requiredness, array/count/length limits and closed-field rules; do not equate merely similar JSON types. Same canonical rooted schema digest is PROVED. There is **no structural widening rule in the supported initial dialect**; unequal schemas yield `MAPPING_COMPATIBILITY_NOT_PROVED`, even if a broader implication might be mathematically true.

Compile requires PROVED for each selected data edge. The diagnostic names producer/consumer pointers and schema digests, with remedies: reuse the generated catalog schema, explicitly change the consumer contract, or insert a named schema-validating projection operation. It never silently inserts a coercion, drops fields or accepts UNKNOWN. References to optional properties retain the separate optional/fallback check. Literal inputs/fallbacks get actual-value validation against the target; aggregate objects are assembled only from proven fields, then validated as a whole. Runtime validates every actual producer/client result regardless of PROVED.

**Mechanical schema reuse:** scaffold copies the selected catalog operation's fully resolved rooted schema at each selected producer pointer into the corresponding generated consumer location and records its canonical digest; it preserves assertions, defaults, array order and SecretRef rules exactly. The quickstart shows a valid-looking consumer `maxItems: 200` against producer `maxItems: 100`: canonical identities differ, so validation returns `MAPPING_COMPATIBILITY_NOT_PROVED` at `/graph/assess/input/notes`. The permitted repair copies the catalog's resolved `maxItems: 100` notes schema (all fields/constraints, not that keyword alone), or selects an explicitly named validating projection with a published matching consumer schema. No implication engine, silent coercion or widening is introduced. Both the repaired schema and annotation-to-doc repair are installed-consumer fixtures.

The corpus covers identical copies/local-ref reuse; altered count/length/closed fields; enum differences; incompatible object/array types; unsupported pattern/format/uniqueItems; recursive/missing/exponential refs; excessive bytes/depth/graph/defaults/patches; adversarial keys; and loop-free termination at budget exhaustion. Expected outcomes distinguish invalid schema, NOT_PROVED mapping and invalid actual value. G3/G4 must prove refusal without imports, side effects, output or a stalled owner service. A required use case needing a wider keyword/rule reopens this profile with a named bounded implementation and adversarial proof; it does not silently extend the allowlist. [inferred]

The contract-lock corpus includes valid and invalid dot/slash pointers, optional-to-required mappings, explicit null versus omission, reset/default ordering, provider replacement, unknown keywords, secret references, cycles and executable-binding absence. Every invalid case has a stable code, pointer, origin, expected constraint and permitted repair. It also covers SecretRef marked/unmarked/plaintext/missing readiness and redacted failures. The same corpus drives generated types/docs and runtime value checks; existing predefined Forge envelope validation is reused for those envelopes but is not presented as arbitrary author-schema validation. [read: S3; inferred]

**Proposed discovery-to-run sequence:** discover an existing native capability -> scaffold a new local manifest -> explicitly register/discover its data-only descriptor -> validate/explain -> separately authorized lock apply -> purpose-bound block admit -> conformance/native solution invoke. Library calls expose the same operations and structured returns. These names are proposed, not current commands. Explain never imports or probes code; readiness remains UNKNOWN until an explicit probe/admission step. The first-author guide contains only manifest, one handler, one direct composition, one fixture and public conformance; it links separately to bound-client, reference-workflow, target/quota, UI-plugin and transfer guides. Their contracts/proofs remain required, but the cold author need not read all future-service architecture first. A separate manual/no-scaffold arm writes the same schema directly. [inferred]

Concrete proposed calls and minimum structured returns:

~~~text
forge catalog describe forge.memory --json
=> {"descriptor":{"id":"forge.memory","operations":["recall"]},"discovery":"DATA_ONLY","readiness":"UNKNOWN"}
forge block scaffold io.github.example/migration-note-advisor --profile trusted-action-sync/v1 --json
=> {"files":["forge.block.json","schemas/config.json","schemas/input.json","schemas/output.json","dist/advisor.cjs"],"discovery":"DATA_ONLY","readiness":"UNKNOWN"}
forge catalog discover --manifest ./forge.block.json --native forge.memory --native forge.flow --catalog-out ./catalog.local.json --json
=> {"catalogFile":"./catalog.local.json","catalogDigest":"...","discovery":"DATA_ONLY","readiness":"UNKNOWN"}
forge config validate solution.local.yaml --catalog ./catalog.local.json --json
=> {"state":"VALID","planDigest":"...","catalogDigest":"...","diagnostics":[]}
forge config explain solution.local.yaml --catalog ./catalog.local.json --json
=> {"state":"BOUND","readiness":"UNKNOWN","bindings":[...],"effects":[],"catalogDigest":"..."}
forge lock apply solution.local.yaml --catalog ./catalog.local.json --lock-out ./solution.lock.json --expect-revision 7 --json
=> {"revision":8,"lockDigest":"...","sourceDigest":"...","reverse":{"revision":7}}
forge block admit --manifest ./forge.block.json --lock ./solution.lock.json --purpose conformance --source-digest ... --json
=> {"admissionId":"...","purpose":"conformance","sourceDigest":"...","expiresAt":"..."}
forge block conformance --manifest ./forge.block.json --solution solution.local.yaml --catalog ./catalog.local.json --lock ./solution.lock.json --admission ... --input fixture.json --json
=> {"state":"PASS","purpose":"conformance","domainAssertions":"PASS","diagnostics":[]}
forge solution invoke solution.local.yaml --catalog ./catalog.local.json --lock ./solution.lock.json --purpose conformance --admission ... --input fixture.json --json
=> {"state":"PASS","output":{...},"observation":{"sourceDigest":"...","planDigest":"..."}}
~~~

**Explicit handoff, no global registration.** The installed-consumer fixture starts from an empty directory with the exact packed Forge candidate installed through its documented entrypoint, then scaffolds/writes the local block and the complete `solution.local.yaml` in section 3.12. `catalog discover` emits an immutable versioned catalog artifact containing the selected native and outside data-only descriptors with their exact sources/contracts/digests. Validate, explain and lock receive that artifact explicitly; invoke/conformance verify the same catalog/plan/lock identities, refusing a changed or absent descriptor. Fresh-fixture lock revision is the documented absent revision 0; the revision-7/8 output above illustrates an existing lock, not a prerequisite for an empty directory. The compiler itself still takes data, never reads a global registry. Lock apply separately authorizes bounded snapshot capture; local admission binds root/source/config/purpose before imports.

The package transition is a separate installed fixture: manually install the exact outside package, discover its already-installed descriptor with `forge catalog discover --package @example/migration-note-advisor@0.1.0 --native forge.memory --native forge.flow --catalog-out ./catalog.package.json --json`, change the solution source explicitly, validate/explain with the new catalog, apply a new lock and obtain package-source admission. The package origin/lock/local source-binding identities change; identical captured file bytes may preserve the portable content digest, but the local-source admission is never reused. Discovery neither installs code nor mutates a global catalog; generated public help must make this entire fixture executable before support is claimed.

One proposed fixture is `{"query":"API migration","normalizedApiChanges":[{"api":"recall","change":"Preserve provenance"}]}`; injected Memory fixture notes are `[{"sourceId":"note:fixture-1","text":"Check the contract"}]`. The expected advisory finding is `{"sourceId":"note:fixture-1","message":"recall: Preserve provenance"}`. It is domain truth only as a frozen fixture assertion, not because execution returned PASS.

A first candidate that omits `after: [context]` receives this proposed repair record:

~~~json
{
  "state": "INVALID",
  "diagnostics": [{
    "code": "MAPPING_PRODUCER_NOT_ORDERED",
    "pointer": "/graph/assess/input/notes",
    "origin": {"layer": "project", "source": "solution.yaml"},
    "instance": "advisor",
    "operation": "assess",
    "expected": "context in explicit transitive after set",
    "observed": {"after": []},
    "repair": {"op": "replace", "path": "/graph/assess/after", "value": ["context"]}
  }]
}
~~~

The author submits the repaired second candidate through the same validator/wrapper. No private source or human rescue is part of the quickstart. These are **proposed output contracts**, not fake output from a current dynamic command.

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

#### Logical graph and bounded invocation unit

**Verified current coordination mismatch [ran: S16].** With only an opaque payload ID and empty handler evidence, 1/14/15-node chains pass current SkillRuntime; 16/32-node chains return INCOMPLETE/`BOUNDED_OUTPUT_EXCEEDED` before any handler call. Its preflight and final envelope duplicate the required dependency closure into coordination evidence. Thirty-two separate one-node controls pass. These observations isolate an existing primitive; they do not prove the proposed host binder, realistic evidence, connected resume or packed platform.

**Normative lowering [inferred].** The public plan remains a finite logical DAG of at most 32 executable nodes and 256 explicit edges. The compiler extension validates the complete graph, explicit `after` closure and mappings, capability/effect/protected obligations, cycles, plan/node identities and resource limits. The planned generic host binder owns a deterministic sequential ready set in topological order, breaking ties by stable node ID; no parallel scheduler or second runtime is introduced.

For each ready node the binder creates **one isolated SkillRuntime unit** with exactly that selected node's handler and capability declarations, no logical `dependsOn` entries, one opaque payload ID and bounded host-created identity/reference metadata. It must not invoke a requested node against unchanged whole-chain metadata: SkillRuntime would expand that closure again. Logical predecessor lists, full domain values and cumulative run history remain outside the unit. A host-created dependency-set reference/digest may identify the already-verified predecessors; all member references are resolved by the binder, never copied as an unbounded array into SkillRuntime. The unit keeps SkillRuntime's current capability/handler/request/evidence/status checks and every byte/depth/node ceiling. References cannot manufacture capability availability.

| Responsibility | Normative owner and failure rule |
| --- | --- |
| Graph readiness and dependency enforcement | The host binder requires exact dependency-set membership, successful terminal predecessor status and verified artifact/value availability before invoking a selected node; missing/extra, failed or INCOMPLETE predecessor references refuse before unit creation. Mapped values must be schema-valid. Optional-property fallback applies only after successful producer execution. A predecessor FAIL/INCOMPLETE or unavailable required value prevents dependent handler calls and emits typed dependency refusal; no substitute PASS. |
| Run/node/reference identity | The host allocates logical run and attempt/node identities, binding plan/catalog/source/config/contract digests. Resolve dependency/payload/artifact references only for that exact context; refuse stale, foreign, altered or failed references. A host-owned run/node invocation guard refuses concurrent or reentrant calls to the same run/node as `RUN_INVOCATION_CONFLICT`; fresh per-node SkillRuntime instances cannot substitute for its run-wide guard. Connected cross-host execution still serializes through owning Kernel lease/revision checks. Release host guards on every exit without reviving authority. References are internal lookup keys, not grants or filesystem paths. |
| Unit and observation bounds | Pure compile/explain constructs each normalized unit and worst-case success **and every fixed refusal/failure shape**, including duplicated `invoked`/`evidence` entries, bounded node/capability IDs and selected input/context keys; it checks the unchanged SkillRuntime envelope budgets and names remaining per-unit restrictions before lock/admission/import. Runtime repeats the checks. Raw author errors and cumulative observations are not copied into the template. `COORDINATION_UNIT_LIMIT_EXCEEDED` names node, pointer, exceeded budget and a concrete metadata/selection repair; never silently shrink the public graph or raise ceilings. |
| Execution/result/refusal | SkillRuntime invokes the unit's host wrapper; the wrapper validates domain input/output, performs the admitted operation and supplies compact verified status/content references. The binder preserves FAIL versus INCOMPLETE, refuses required-client errors even when ignored by the author, and routes validated full values through the bounded domain map. The sync wrapper still rejects Promise/thenable returns before translating results; one-node lowering does not change SkillRuntime's await behavior. Owning services recheck live actor/grant/lease/head/admission and protected guards immediately before effects. No dependent consumes invalid output. |
| Progress/history | Connected run/node progress and accepted observation/artifact references go through existing owning Kernel commands and their current lease/revision/effect checks. A returned node PASS alone is not an accepted Kernel transition. Stateless progress is host-owned ephemeral state only. Full observations use the existing authorized artifact/event/state surfaces with bounded paging; the final run response contains bounded summary/cursor/references, never the whole graph inside a SkillRuntime result. |
| Resume and cleanup | Reload accepted Kernel checkpoints, exact recorded context and verified durable artifacts; rebuild the pending ready set without replaying accepted effects. Pending/ambiguous effects follow their owning idempotency/recovery contract or refuse. Revalidate current authority and source/purpose admission for pending calls; expired consent/lease is not revived. Missing/incompatible artifacts/context gives typed refusal. Release domain entries after last consumer and dispose only owned unit/binding/snapshot resources on all exits; Kernel history survives. Stateless restart needs explicit resupplied input, not a shadow progress database. |

**Packed proof before broad fan-out:** exercise a 32-node chain, 32-node fan-out/fan-in and a valid graph using all 256 admitted edges, plus 33-node/257-edge early refusals. Include realistic compact metadata/observations, mid-run FAIL and INCOMPLETE, zero dependent calls afterward, stale/foreign/altered/missing/extra dependency references, concurrent/reentrant run refusal, all success/refusal envelope shapes, connected checkpoint/resume with no accepted-effect replay, missing artifacts and cleanup. The maximum-domain campaign below is a separate dimension and cannot substitute for this graph/evidence campaign. Neither the empty-evidence one-node control nor a two-node advisor certifies it.

#### Domain data stays outside the coordination envelope

**Verified current mismatch [ran: S14].** Current SkillRuntime limits are 8,192 bytes, depth 8 and 128 structural nodes; a one-change control passes, but the documented 100-change shape fails before handler invocation as `BOUNDED_INPUT_EXCEEDED`. Raising maxNodes to 400 returns `INVALID_LIMITS`. Therefore naive `request.inputs = domainInput` is not the planned reuse path.

The generic wrapper owns a bounded per-run domain map, validates/clones full input/config against their public schemas and section 3.3 limits, and gives the handler those values. It passes **only an opaque host-created payload ID plus digest and compact coordination metadata** through the isolated one-node SkillRuntime unit defined above. The compact request and host evidence still satisfy every existing coordination ceiling; no payload array or entire result is hidden inside evidence. SkillRuntime's host handler retrieves the run/operation-bound entry, invokes the admitted sync handler, validates its full domain output and returns compact host-owned `{status,evidence}` with a content identity. The explicit graph binder routes full values through the wrapper's domain map, not through SkillRuntime inputs.

A payload ID is not a public capability, grant or arbitrary filesystem pointer. Only the host can create/resolve it; bind it to run/node/source/config/contract, refuse foreign/stale/digest-mismatched IDs, and release it after its last dependent consumer or on failure/disposal. Domain input/output are limited to 2 MiB each, depth 16 and 16,384 nodes; aggregate live domain data per run is capped at 16 MiB. A budget violation is `DOMAIN_PAYLOAD_LIMIT_EXCEEDED`/INCOMPLETE before that operation runs, with a pointer and explicit selection/smaller-input remedy. No truncation. Runtime-held output is distinct from durable evidence: persistence uses an authorized content-addressed artifact reference; resume must retrieve/resupply and verify it or refuse unavailable data.

The 100-change/100-note fixture, including maximum-length multi-byte strings, must pass through this **actual packed wrapper and graph/client path** within the published domain bounds, alongside one-change control, 101 items, overlong/over-byte/depth/node values, output violations, run-map cleanup and forged payload-ID refusals. Until those run, this is a proposed bridge, not demonstrated feasibility. Retain the existing runtime limits; a public validator reports domain and coordination constraints separately. Reducing the advertised domain bounds is an explicit alternate contract change requiring all schemas/docs/tasks/proofs to agree, never an undocumented runtime surprise. [inferred]

**Why these contract choices [inferred].** The service promise requires one public synchronous invocation shape; exposing internal clients leaves author guesswork, while graph-only support would silently drop v2's promise. The Memory mismatch calls for a named projection over the existing router, not a new store or an opaque field-dropping transform. The domain and dependency-closure probes require both a bounded domain map and one-node coordination lowering to retain the 100-item/32-node public contract. They specify the already-planned generic host binder rather than replacing SkillRuntime; raising its ceilings is rejected. Narrowing public graph/domain schemas remains an explicit, fully reconciled scope alternative. The capture probe requires an observed-byte ceiling before trust/admission; operator consent or post-read checks cannot protect an earlier whole-file allocation. Reopen the shared cap only for a required larger bundle with measured cost. Exact schema identity is smaller and auditable compared with a general implication engine or unsound type-only acceptance. The pre-admission profile omits expensive keywords until demanded, rather than adding a new supervised validator just for unused features. Reopen any choice when a frozen author trial cannot complete its required task within the declared profile, or demand plus a named owner and conformance proof justify the wider contract.

### 3.5 Native harness connectivity

Define an adapter contract for **describe/probe, planProjection, applyOwnedProjection, native discovery/invocation, result/evidence mapping and cleanup**. It consumes catalog/compiled plan instead of hardcoding TDD stages or individual community blocks. Different protocols remain separate: skills/procedures, tools/resources, hooks/events and process/agent transports are not interchangeable. Reuse native renderers and capability probes; widen registration, not a permanent closed host switch. [inferred; read: S6, P1]

0.1.0 retains advertised Claude Code, Codex, Cursor and Hermes capabilities with installed-version evidence; the new outside solution must run unchanged in **Codex and Cursor**, apart from adapter selection and host-specific consent. OpenCode and future harnesses enter the same open interface, initially experimental until certified. Any-harness is the architectural direction, not a claim all hosts already pass. Host limitations return explicit UNAVAILABLE/refusal, and genuinely supported alternative delivery is shown, never guessed from metadata parity. [inferred; read: S6]

Canonical skill bodies are physically packaged at .agents/skills. Native setup creates owned links or required thin native wrappers, preserving user content. Fresh clone, npm tarball and compiled binary each need separate discovery/ownership proof. A required-link failure is an actionable refusal under the default; managed-copy exceptions require a separate explicit support decision and drift/recovery evidence. [inferred; read: R, L2, L5]

An outside-authored adapter fixture must register a new adapter ID, project the compiled plan and round-trip a controlled protocol transcript through public APIs with no core patch. That proves registry openness only; a real host remains unsupported until its installed native behavior is separately certified. [inferred]

### 3.6 Kernel authority and gate integrity

The Kernel alone accepts issue/dependency/lease/workflow/run/evidence transitions. Contracts validate interoperability, Memory stores knowledge and projections, Flow supplies execution evidence, and adapters/renderers expose views. A producer's receipt is evidence, not self-issued authority. Stateless solutions have no issue authority to synchronize; connected solutions do not create a shadow owner. [read: S5; inferred]

Before protected effects, existing owners recheck authenticated actor, current lease/epoch, expected revision/head/base, path/content binding and valid approval. Custom policy PASS remains a diagnostic until the owning admission accepts required evidence. Through the supported owning API, merge retains non-configurable exact-head/current-base/check/review/ownership protections. Locally admitted code is trusted to stay within those APIs; these checks do not contain arbitrary ambient same-process/credential access. Reply, message, deployment and remote data changes need their own authorized operation; no block/template admission confers them. [read: S10; inferred]

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

#### Concrete future-service compatibility fixtures

The 0.1.0 contract-lock artifact must include **schema-checked data fixtures**, not just prose walkthroughs [inferred; S13 platform-fit improvement 2]. These named host contracts are separate from arbitrary outside-author schemas. All listed fields are required unless marked optional, security-relevant unknown fields refuse, and IDs are bounded nonempty strings. Field/operation allowlists and byte/depth/count limits use the same bounded data rules. Endpoint strings are data during preview; a shipped transport's owning edge additionally validates scheme/origin/destination.

| Contract / required fields | Concrete semantics |
| --- | --- |
| `forge.target/1` | `mode` = self-hosted/forge-hosted, `tenantId,projectId,solutionId,profile,endpoint,credentialRef`; SecretRef only, no credential. Target placement is separate from logical plan identity; unsupported profile requires explicit refusal, never silent fallback. |
| `forge.workload/1` | `workloadId,targetId,artifactDigest,principalId,quota`; quota has positive integer `cpuMillis,memoryBytes,concurrency,storageBytes,eventRate,egressBytes,logRetentionDays`; profile owns admitted limits and cleanup. |
| `forge.grant/1` | `grantId,revision,tenantId,projectId,appId,actorId,purpose,operations,datasets,fields,destination,expiresAt,revoked`; revision integer, revoked boolean; operations use the canonical catalog keys in section 3.1, with exact allowed datasets/fields and no wildcard or graph-alias escalation. |
| `forge.transfer/1` | `transferId,projectId,kind,objectId,revision,source,destination,appId,actorId,grantId,grantRevision,purpose,classification,payload,contentDigest,expiresAt`; named per-kind payload schema, integrity covers selected bytes, acknowledgement separate from authority acceptance. |
| `forge.event.data/1` | CloudEvents envelope plus `projectId,authorityId,authorityGeneration,entityRevision,cursor,classification,contractVersion,configDigest,actorId,grantId,grantRevision`; committed/advisory type is explicit, same scoped filtering for snapshot/search/watch/payload. |
| `forge.refusal/1` | `code,operationId,projectId,pointer,expected,repair`; no raw credential or denied record in observed/error fields. Quota/fence/grant refusal is INCOMPLETE, not a synthetic PASS. |

Example target/grant inputs, with fixture-only identities and non-credential references:

~~~json
{
  "schemaVersion":"forge.target/1",
  "mode":"forge-hosted",
  "tenantId":"fixture-tenant",
  "projectId":"fixture-project",
  "solutionId":"local/release-advisor",
  "profile":"lightweight-backend/v1",
  "endpoint":"https://fixture.invalid/forge",
  "credentialRef":{"$secret":"[secret omitted]"}
}
~~~

~~~json
{
  "schemaVersion":"forge.grant/1",
  "grantId":"fixture-grant",
  "revision":7,
  "tenantId":"fixture-tenant",
  "projectId":"fixture-project",
  "appId":"fixture-panel",
  "actorId":"fixture-user",
  "purpose":"show-selected-notes",
  "operations":["forge.memory.recall@1.0.0#recall","forge.state@1.0.0#query","forge.state@1.0.0#watch"],
  "datasets":["memory.notes"],
  "fields":["sourceId","text"],
  "destination":"fixture-panel",
  "expiresAt":"2027-01-01T00:00:00Z",
  "revoked":false
}
~~~

The fixture generator computes actual content/config/artifact digests rather than accepting placeholder hashes. Lower both a plugin-panel solution and an independent UI+backend to this target and a self-hosted variant with only target/edge credentials changed. Validate all workload/grant/event/transfer/refusal records against frozen schemas; equal logical plan identities and equivalent service calls are expected, while changed capability/permissions produce a new plan identity.

Required rows are: field-filtered note transfer preserving original receipt/source provenance; denied field hidden from search, fetch and watch; queued delivery with grant revision 7 followed by revocation/revision 8 refusing at delivery; stale authority generation refusing a mutation; cross-project/tenant refusal; quota exhaustion without PASS; unknown optional deployment profile remaining UNAVAILABLE until explicitly supported/opted in; target-only change preserving logical identity; and old/new reader compatibility or typed unsupported-version refusal. Add identical captured/published bytes relocated between two install roots: portable artifact/capability and logical plan identity remain equal, while each local placement/purpose refuses execution until appropriately admitted. Add an alias/instance rename preserving the canonical granted operation and rebinds to ungranted operation/version/foreign project refusing at the owner. Record expected schemas/digests/results and run the local public-service corpus under G3/G4/G7.

This proves contract fit and local boundary behavior only. No fixture proves network authentication, actual tenant containment, hosted durability or OAuth readiness; the 0.2 live hosting/transport campaign remains separately required.

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
    source: { manifest: "./forge.block.json" }
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

This complete config is `solution.local.yaml`; its `source.manifest` selects the explicit local descriptor in `catalog.local.json`. From an empty installed-consumer directory, the section 3.3 sequence carries that catalog through validation/explain/lock, bounded capture, local-source purpose admission and invocation. A second fixture manually installs the exact outside package and changes only the advisor source to `{ package: "@example/migration-note-advisor", version: "0.1.0" }`, rediscovers `catalog.package.json`, and repeats validation/lock/fresh package admission before invoking unchanged domain logic. No implicit registry mutation or installation joins these steps. The full catalog-locked `forge.memory.recall@1.0.0` output in section 3.2 resolves to the **same complete schema digest** as the advisor's `/properties/notes`, so this mapping is PROVED by exact identity and a successful no-result read supplies an empty array; read failure leaves the required node INCOMPLETE rather than fabricating fallback notes.

The first public-doc quickstart is only these files, the ordered journey/fixture/repair record in section 3.3 and one public conformance command. The required bound-client variant in section 3.1 exercises callable reuse separately; it is not inferred from this graph-only example. The public conformance corpus runs ordinary output, thrown error and Promise return through the wrapper. A separate manual-config arm does not use scaffold output. Memory remains independently durable; stateless Flow opens no Kernel. A connected variant may record host-observed execution through the authorized Kernel client, but author output cannot mint accepted progress. Unknown source, invalid pointer/interface, absent explicit `after`, missing admission, source change, permission increase or protected mutation refuses at the owning boundary. [inferred]

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

The origin ledger explicitly includes beta.5/beta.8 launched below Node24: target upgrade/bootstrap preflight gives actionable Node24/26 guidance before any target install/data write, preserving the prior install/data and return path. It is a negative case alongside supported Node24/26 transitions, not Node22 target support or a new harness/environment promise. Attribute published origins' older floor to the dated registry evidence above; run this case on the actual documented upgrade entrypoint before calling recovery certified. [inferred]

## 6. Workstreams and milestones

Effort is a scope class: **S** bounded helper/metadata; **M** one service/distribution slice; **L** coupled runtime/consumer work; **XL** multi-platform/authority/operations campaign. Classes are not engineering days. Each stream has one owning issue/approved-plan scope when implementation is later authorized; shared package/lock/schema/generated assets have one integration owner. Do not count existing fold/worktree protections twice. [inferred; L2, L3]

| Order / milestone | Change, value and how | Effort / risk | Proof gate | Prerequisites |
| --- | --- | --- | --- | --- |
| **Delivery truth** | Retire the unconditional duplicate CI Gate producer through its owner; preserve authoritative Tests/doc producer and mixed/rename/fail-closed classification. Align configured required contexts and actual artifact jobs. Prevent false successful readiness. | M / high evidence risk | Exactly one authoritative verdict per intended head/run; a deliberately failing required case cannot report PASS; all existing required contexts retained. | Current protection/workflow census; named landing owner. Must precede dependent release claims. |
| **Operating contract and safety** | One serial landing front, queue initially ≤3; shared session/lease protocol and authorized handoff/readback. Reconcile CI-flake-only quarantine versus local timeout prose and P0/P1/regression review bar. Retain landed worktree detach/restore/identity fixes; prove install-input compatibility or own install. | M / high data/coordination risk | Sentinel removal/refusal/restore cases across all supported callers, no lost shared install; lease transfer proven, no actor impersonation; cited CI flake required for quarantine. | Existing Kernel/claim/worktree owners. Contract before fan-out; landed code acceptance, not duplicate implementation. |
| **Bounded delivery tools** | Retire deprecated team-sync shell wiring through owning hook config; diagnose shared Windows identity/fixture cost before changing implementation. Bound necessary identity operations with PID-reuse/fail-closed correctness. Provider outage recovery remains same-head and explicit. | M / high for identity, medium latency | Real quick-push/fresh-worktree trace; unchanged gates; no indefinite optional step; identity reuse/unknown cases and complete native correctness evidence. | Delivery contract, narrow process/hook scope. Safety fixes early; speed targets alone do not gate product. |
| **Pilot and optional confidence** | Five ordinary changes plus one coupled platform/package/Kernel slice through real landing loop; record correction/base heads, CI/review waits, lease and owner time. Diagnose Stryker initial-suite failure and produce scored/seeded-mutant proof where admitted risks rely on it; performance/mutation experiments have separate capped budget. | M / medium capacity risk | Pilot evidence, no retry-to-green/quarantine shortcut; mutation confidence claimed only after actual report and caught seeded mutant. | Above tools/contract; pilot need not wait for all product work. Configured jobs stay intact at budget expiry. |
| **Public contract and catalog lock** | One owner runs two checkpoints: **data-contract freeze** of author ABI, sync slots, full Memory projection, schema/exact-identity rules, references/layers, version/error/source/profile/catalog/grant/portable identity semantics and generated types/docs; then **installed conformance freeze** after compiler/admission/wrapper exist. Publish public entries/assets and the exact-schema/docs/local-source quickstart. Makes a new capability authorable without a circular prerequisite. | L / high compatibility risk | First checkpoint: complete versioned data shapes and pure fixture corpus agree, including hostile budgets, secret/prototype safety and actionable repairs. Second: packed clean consumer uses only public imports; manifest/schemas/handler/config run through compiler/admission/wrapper with explicit catalog handoff, bounded capture and one-node lowering. Types/docs/corpus agree; unsupported data refuses before import. **No broad coupled fan-out before the second exit.** | North star/support choices and access; one package/schema owner. Compiler/runtime require only the first checkpoint; the second depends on those bounded implementation slices and precedes reference fan-out. |
| **Config compiler and edit path** | Extend one existing resolver to caller catalog/template/graph/layers; bind operations and obligations; expose explain/scaffold plus safe revision-checked edits. Makes config executable and agent-generatable. | L / high semantic/gate risk | Novel operation lowers to real handler; inert YAML cannot pass as executable; origins/merge/reset/provider replacement, cycles and protected-floor negatives pass. | Locked author/interface schemas; config/shared-reader inventory. |
| **Admission and generic runtime** | Reuse lock fingerprints but add bounded observed-byte capture of the complete outside closure, owned snapshot and purpose admission; implement the planned generic host binder to enforce the logical DAG while invoking isolated one-node SkillRuntime units over the bounded domain map. Preserve current runtime ceilings, owned cleanup and Kernel-connected progress/resume. Explicit source identity remains a trusted local contract, not a sandbox. | L / high trust/authority risk | Import sentinel untouched for preview/unadmitted/wrong-purpose/changed source; exact/+1-byte/aggregate/growing-source capture refusal and partial cleanup; snapshot race; exact artifact/config receipt; 100-item domain path **and** 32-node chain/fan-out/fan-in/256-edge graph with realistic compact observations and all success/refusal shapes; 33-node/257-edge/unit-limit/missing/extra/foreign-reference and concurrent/reentrant run refusal; mid-run failure, zero dependent calls, connected checkpoint/resume without replay, and one non-delivery acceptance/refusal before pilot exit. | First data-contract checkpoint, compiler/catalog and public Contracts/Kernel clients; existing resource owners. Contributes evidence to the second installed-conformance checkpoint. |
| **Outside vertical slice** | Install an actual packed preliminary Forge artifact outside checkout beside an independent bundled advisor; exercise the empty-directory local/catalog handoff and separate fresh-admission package transition, real config, both graph mapping and an outside bound-service call, Memory/Flow, wrapper evidence and one native invocation. Rehearse one beta.8 input and one binary external-loader refusal early. For preliminary rc.N hosts, explicitly opt into prerelease compatibility and use a range such as >=0.1.0-rc.1 <0.2.0 plus the exact installed rc lock. Never assume the stable-only example range accepts an RC; a literal 0.1.0 preliminary tarball is an alternative and its exact identity is recorded. | M / high unknown integration | Cold public-docs author succeeds in at most two submitted block+config candidates without private source/core patch; wrapper negatives, repair case, new capability/package/native result and required refusals pass. | First contract checkpoint and bounded compiler/runtime/admission; second installed-conformance exit before broader reference work; one ready adapter and explicit code-trust operator. |
| **Reference solution migration** | Express delivery and small-change/docs variants as template/config; expose only required Worktree/Policy/Review/Delivery clients; migrate facade/shared readers slice by slice. Proves first-party dogfooding and intact behavior. | L / high regression risk | Reference workflows use same compiler/runtime; classifications/checkpoints/current-head guards/resume remain correct; no duplicate authority. | Outside-slice contract feedback; config, Kernel and owning service clients. |
| **Native connectivity and canonical assets** | Open adapter registration and generate selected solution surfaces; migrate physical canonical skill assets/owned links and narrow native wrappers. Prove four advertised hosts, advisor in Codex+Cursor. | L / high host/access risk | Outside adapter ID fixture registers with no core patch; real installed T0–T4 transcripts where promised; unchanged advisor domain config; user-content/link/refusal/cleanup; package/binary discovery. | Contract/plan stable enough; named allowed native operators; canonical/package owner. Start access and one-host pilot early. |
| **Pruning and artifact closure** | Retire serve/product dashboard/insights, deprecated dep-guard/team shell paths and duplicate PR delegates; retain pr link/test dashboards/unique proof. Delete skills workspace after overlap; adopt no-importer release correction while preserving native codec/export. | M–L / medium hidden-caller risk | Wide caller/assets/hook/test census, actual npm/binary contents and budgets, native export and unsupported-origin refusal; no weakened gate or lost unique behavior. | Owning inventories and public/skill-path decisions. Can overlap disjoint service work; final metadata under one owner. |
| **Recovery and claim acceptance** | Certify beta.5/beta.8 preflight, insufficient-target-runtime refusal, backup/restore, interruptions, post-write disposition and safe return; copied native corpus claims/leases/epoch/projection contradictions. Keep live operational repair separate. | L / high data-loss risk | Every origin and negative preserves data/old usable install; on Node <24 the target upgrade/bootstrap preflight refuses before target-data/install writes with Node24/26 guidance and leaves the old origin usable. Supported transitions run on Node24/26. Exact corpus receipts, no restored active leases. | Settled supported public/config/assets; immutable origin fixtures and authorized certification operators. Runtime refusal belongs to the existing origin ledger, not an added supported runtime. |
| **Public state and local data boundary** | Normalize existing events into searchable scoped snapshots/watch/log contract; local transfer/config edit proof; freeze hosted target/workload/grant/quota contracts without building the service. | M–L / high privacy/replay risk | Independent client queries/edits through public APIs; transfer/refusal/replay pass; plugin-panel and independent backend+UI walk through self-hosted and Forge-hosted plans with schema-checked target/grant/event/transfer/quota/refusal fixtures and tenant/least-privilege negatives; local fixture proof is distinct from later actual hosted isolation. | Catalog/config and Kernel committed-event owners; no hosted service or UI dependency. |
| **Final candidate and platform certification** | Freeze BOM and artifact bytes; run G0–G8/full applicable campaign, outside author in two harnesses and first-attempt config benchmark; observe final candidate and promote accepted identity only. | XL / high access/rework risk | All required strata/receipts/digests PASS, none INCOMPLETE; complete observer; live channel/asset/default-install readback. | All advertised support proved; publication policy/generators, actual devices/hosts/observer and maintainer window. |
| **0.2 hosted pilot (post-0.1.0 milestone)** | Implement the selected isolated static/plugin UI plus constrained lightweight-backend profile over frozen target/grant/quota contracts. Keep self-hosted and Forge-hosted logical plans equivalent. | XL / high isolation/operations risk | Cross-tenant/path/service denial, quota/cleanup/rotation, scoped event/data access, target-equivalence and rollback/restore objectives pass under named operations ownership. | Accepted 0.1.0 public contracts; owner decision 11; hosted operators/infrastructure. Explicitly outside the 0.1.0 critical path. |

**Milestone order [inferred]:** trustworthy delivery + acceptance/access lock → provisional data-contract freeze → bounded compiler/admission/single-node binder + one connected non-delivery acceptance/refusal → installed public-contract conformance freeze and outside vertical slice → reference workflow + remaining native/state/recovery/pruning work → final installed campaign → seven qualifying days → approved immutable promotion. One contract owner carries both freeze states; only the provisional data freeze is prerequisite to building the compiler/wrapper. Independent pruning/inventory/operator provisioning can overlap; interfaces, lock/generated assets, authority and final candidate each have one owner. A failed outside or connected pilot revises the contract before broad fan-out; full reference migration remains later.

The L3 entry repairs are included explicitly. Worktree protection is already landed at this source snapshot and receives acceptance, while duplicate gate/retired hook/identity/protocol gaps are reconciled against current heads. Informational bot markers must produce truthful blocker verdicts, and review-provider outages cannot be repaired with speculative code churn. Optional speed/mutation experiments never authorize disabling a configured lane or accepting missing admitted proof. [read: S9, L3; inferred]

## 7. Release proof

### 7.1 Preserve G0–G8 and risk applicability

The prior nine static readiness checks are not these nine release strata. Repository CI/static success is useful prerequisite evidence; only candidate/BOM-bound installed receipts supply final acceptance. Update obsolete Node22/separate-package/importer mechanics without reducing outcomes. New contract/profile narrowing is part of the proposed author surface before it is supported, never an exemption from an existing gate. The canonical matrix is S11; G4 authority/security is never quarantined, and G1 retains conservative selection fallback. [read: L1, R, S11; inferred]

| Gate | Required final proof [inferred, preserving R/L1] |
| --- | --- |
| **G0 static/format** | Strict lint/types/schema/docs/generated consistency and artifact inventory bound to final content. |
| **G1 risk selection** | Owned risk/applicability manifest, complete corpus/shard membership and digests; no silent exclusion of named strata. |
| **G2 blocks/package** | Installed public consumers, independent Memory/Flow, default/reference assembly, outside block/config/lifecycle and actual npm/binary assets. |
| **G3 contracts/providers** | Accepted packet/receipt/producer/capability/config compatibility corpus, forward/backward behavior, idempotency and conflict proof; substitution, full Memory projection/source-provenance cases, bound-service sync/error conventions, exact-identity mapping table, hostile schema/ref/default processing, explicit catalog handoff and schema/docs repairs, portable identity/grant-key compatibility, bounded code/aggregate capture, complete graph-to-unit lowering, invalid data and unsupported-version refusals. |
| **G4 authority/security** | Claims/revisions/epochs/protected approval/write/merge guards; source admission, permission increase, cross-project/scoped API refusal, pre-admission parse/compile/value **and observed executable-capture** budgets, overflow/growth/partial-snapshot cleanup, stale/foreign dependency refs and unit-limit refusal, canonical operation/rebind scopes, prototype/SecretRef/ref safety and no custom-PASS bypass under the stated trusted local/API threat model. |
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

Capture public-doc input identity, author intervention log, exact source/package/manifest/config/contract identities, installed candidates and host versions, native transcripts, domain assertions and cleanup/restart results. The author writes an advisory finding; the host owns execution evidence and any Kernel acceptance. At least one cold task requires an outside handler to declare/bind/invoke the synchronous Memory slot; graph-only success does not substitute. Test incompatible/absent/async/denied slots, ignored required-client refusal and restart replacement, full notes projection and 100-item domain transport through the actual wrapper. Test input/output/schema/version/slot/cycle/mapping failures; preview/import sentinel; wrong/missing/conformance-purpose admission; changed source and capture/load race; required capability refusal; permission increase; stale/protected writes and custom approval/PASS attempts. Also run the packed 32-node chain/fan-out/fan-in/256-edge campaign from section 3.4 with realistic observations, halfway failure, zero dependent calls after refusal, reference spoofing, connected checkpoint/resume and cleanup; larger domain input alone cannot satisfy it. The source campaign exercises exact-byte/+1/aggregate-overflow/post-stat-growth capture, partial cleanup, no import/handler/success receipt, and separate admission after identical-artifact relocation. Preserve provider substitution and independent stateless/connected variants. [inferred]

A second compatible provider replaces the narrow optional service/action at explicit restart without changing its consumer interface or leaking options. Local Memory remains durable with optional enrichment absent. Unavailable dependency, missing native transcript, private import, ignored config, mismatched identity or incomplete cleanup makes platform proof **INCOMPLETE**. Any advertised binary external-block path needs the same installed proof; otherwise binary scope explicitly refuses that path and cannot advertise npm-equivalent extension support. [inferred]

Also publish/discover/instantiate/edit the outside declarative advisor template; register the outside adapter fixture; and run the community-to-supported/native identity/alias compatibility fixture. The 0.1.0 hosted proof is the frozen schema-checked two-target fixture corpus (section 3.11), including field-filtered transfer, revoked queued delivery, stale fence and unknown profile; it is local compatibility/service-boundary proof, not a live hosted-service or actual sandbox-isolation claim. [inferred]

### 7.4 Agent-authored config and repair benchmarks

Freeze **30 satisfiable composition tasks** before the candidate: independent blocks, outside action binding, community-template extension, ordered layers/reset/null/defaults, two providers/explicit substitution, secret-reference-only config, stateless/connected execution and structured JSON-Pointer mappings. Publish expected assertions and exact catalog/schema/doc identities. Use at least two named installed authoring agents/providers/versions, 15 tasks each, with public docs only and no human repair/private source. Freeze seeds/settings where exposed and preserve every first output/failure. [inferred]

At least 10 of the 30 tasks are manual/no-scaffold arms, split five per authoring agent; the rest may use the recorded deterministic scaffold. The 30/30 denominator and first-submission rule are unchanged for both arms. [inferred]

**Release bar remains 30/30:** every first submitted config must parse, pass complete semantic validation and execute its expected harmless fixture output. "First submitted" is the first candidate offered for validation after any exploratory read/scaffold/API calls and before validator feedback; a validator/conformance rejection consumes the submission. Scaffolding is permitted and recorded; it cannot silently repair invalid config. Recheck the exact frozen corpus across all six npm environments. A campaign failure revises contract/docs, freezes a new corpus/candidate and records the failed campaign; it is never rerun into 30/30 by discarding first attempts. This is a bounded release benchmark, not a capacity estimate or universal success claim. [inferred]

Add **10 separate unsatisfiable/forbidden prompts** (missing/incompatible capability, invalid binding, undeclared effect, protected-floor removal, scope escalation). Expected typed refusal before execution is the bar; these do not enter the 30 valid-task denominator. Measure discovery, structural, semantic, executable and native stages separately; success at one cannot satisfy the next.

Add a distinct cold-author gate with at least two task briefs frozen before documentation tuning, including **one withheld task outside software delivery**; use the existing slot, not an increased trial count. An independent campaign custodian seals that task, its reference block/config and assertions before quickstart/scaffold/doc tuning. Documentation/scaffold authors and the trial authoring agent cannot inspect the task/solution/assertions beforehand; the public advisor and service variant must not solve it. At launch the agent receives the brief plus the same frozen public docs/catalog/schemas/scaffold as any outside author; reference code/config and acceptance implementation remain private to the evaluator. The ledger records task/assertion identity, seal time, public-surface identities, who could access them and launch time.

That held-out task is an ordinary bounded non-engineering composition, such as inventory-note enrichment, using the same synchronous profile and public capabilities. At least one of the existing two tasks requires a real bound Memory client; the held-out slot can carry that obligation. It must test new domain schemas/composition/assertions, not merely rename delivery nodes, and needs no UI, async lifetime or wider service profile. The separate early connected non-delivery acceptance/refusal remains mandatory; the cold task need not initialize Kernel. For each task, allow **at most two submitted block+config candidates total**. A candidate submission is any task-directed block, config, or pair presented to the typed builder, validator or conformance API for candidate-specific feedback, including a rejected partial component. Catalog reads and scaffold generation without candidate feedback remain exploration. Multiple checks on one byte-identical frozen candidate share its identity; any feedback-driven byte/config revision is the next candidate. Public feedback may be used between candidates. Maintainer code, undocumented/private APIs or altered fixture assertions fail the trial. Host-supplied explicit trust is an allowed environment prerequisite, never author assistance. The passing candidate must contain the complete block+config, produce useful output through the generic path and run unchanged in Codex and Cursor.

The repair corpus contains repairable unknown-field, interface-version mismatch and optional/bad-output mapping cases. Candidate one must receive the exact code, JSON Pointer, origin, constraint and allowed repair; the agent applies only public APIs/docs and candidate two produces expected output. Genuinely forbidden authority/effect requests remain refused. Report every candidate identity, component/pair submitted, feedback used, elapsed effort, manual intervention, unsafe/private actions and final stage per task. Preserve initial failures and start a new recorded trial after material docs/contract/fixture changes. [inferred; read: round1-agent-buildability]

### 7.5 Candidate, observation and promotion

Retain preliminary immutable rc.N iterations, then default to a **literal stable-version candidate on npm next and a non-latest GitHub prerelease**. Freeze source/manifest/lock/Bun/binary inputs, all schema/capability/config/support/corpus/severity-policy digests and final docs/assets in a signed BOM with verified digests. Fix existing publication generators/asset overwrite behavior through their owner before use; build/pack once, do not clobber assets or republish a version. [read: R:259–266, S11; inferred]

Changing artifact/version/BOM identity invalidates every receipt bound to the old identity. Any alternative signed-equivalence policy must enumerate invalidated evidence and rerun every applicable final campaign; a signature alone cannot transfer mismatched receipts or satisfy exact-BOM acceptance. [inferred]

Run the full campaign on those exact published bytes and **seven cumulative qualifying automated exercised days**. Each day has candidate-bound installed journeys, failure events, durable time/cursor evidence, complete required receipts and observer recovery. An outage pauses credit; resume only if the interval/events are reconstructable, otherwise start a fresh qualifying window. The aggregate binds BOM/policy/corpus digests, distinct cases, per-gate tri-state, required strata, S0/S1 disposition and all window events/retries. Preserve the canonical S0/S1 severity definitions and signed downgrade rule; neither a block nor an agent can quietly relabel a failure. Missing/truncated/stale evidence and unresolved S0/S1 block eligibility. Product/dependency/toolchain/corpus/policy corrections create a new candidate and fresh required campaign/observation; preliminary RC days do not automatically transfer. [read: R, S11; inferred]

If published 0.1.0 fails, leave it unpromoted, disposition it visibly, fix under a new version such as 0.1.1 and repeat required proof. First accepted stable may therefore be 0.1.1. Promotion changes channels/metadata to accepted bytes without rebuilding; re-fetch registry integrity/provenance, **every required asset**, installed default-channel journeys and release blockers. Reserve maintainer/substitute operator windows. Prior channel states and verified backup/restore define reversal; redirecting latest is not rollback of migrated user data. [read: R; inferred]

## 8. Achievability and risks

**Achievable in principle; capacity/date not yet proven [inferred].** Reusable source foundations reduce implementation, but public author/config/closure/native contracts and outside-documentation usability are missing work. The previous renderer marginal estimate and local-product calendar cannot price this platform. There is no defensible completion percentage or sustained-capacity multiplier from raw merge counts.

V3's dated GitHub readback returned 29 September 25–29 merges (0/2/5/12/10); #582 is merged, #564 remains open, and mutation run 36570515358 remains failed at Run mutation testing [ran: S15]. Preserve L3's collection-time measurement of 28 merges over five UTC dates, including work outside its requested cohort; L3's 4–6 ordinary or 1–2 coupled PR/day planning rates are judgments, not measured owner-hour capacity. Historical Windows job median was 536s versus 98s Ubuntu and 175s macOS; the paired Windows/Ubuntu ratio was 5.25×. These measure selected CI jobs, not an attributed process-identity cause or a release-date multiplier. Review correction/base updates and operator/access wait can dominate. Do not sum overlapping speed-saving scenarios. [read, historical: L3:188–204; R:capacity]

**Resource assumption to test:** one landing/integration owner with roughly three focused hours per workday, up to three disjoint implementation lanes, one certification lead sharing those resources, named native/harness operators and durable observer/publication coverage. Contract/config/package/generated files each have one owner. This is illustrative staffing, not current availability. More agents cannot multiply the serial contract, review, artifact or permitted-host bottleneck. [inferred; retained R/L3]

After the early pilot, replace the allowance with an owner-loaded dependency estimate: each coupled stream records worker scope, owner review/integration hours, operator turnaround, correction reserve and the tasks serialized by the single package/config/Kernel owners. No historical PR/day rate substitutes for those measurements. [inferred]

**Owner/access ledger is the forecast checkpoint [inferred; S13].** At scope lock, populate one row per workstream from section 6, plus each promised harness/binary/observer lane. Required columns are worker scope/effort, owner review hours, integration hours, expected rework/correction hours, dependency/wait time, named operator, **access YES/NO**, and evidence/confidence. Unknown availability is recorded as NO until commissioned. Sum owner demand over the serialized weeks, including contract/package/generated-assets work; compare it with committed available hours, not agent count. At three hours/day over five-day weeks, 8–12 weeks supplies an illustrative **120–180 owner-hours**, before absences, not a demand estimate.

No endorsed date or broad coupled fan-out until measured pilot demand fits committed owner time and every promised critical lane has YES access. Independent scoped work may proceed without converting the allowance into a commitment. Missing access changes the forecast or requires an explicit support revision; unexplained zero rework or PR/day multiplication cannot close the ledger. Reopen at day 5, ten working days, and after the outside/two-harness pilot.

**Provisional timing:** allocate 1–2 weeks to entry/access/contracts and a complete outside vertical slice; 3–5 additional weeks to reference/native/state/author documentation/recovery/pruning; 2–4 weeks to complete final artifact/access-dependent campaign, corrections and seven qualifying days, with overlap where owners allow. Their overlapping planning envelope is **8–12 calendar weeks**, not the arithmetic sum of effort classes. From an October 1 staffed start that points broadly to late November–December 2026; no start/access/capacity commitment is made here. Corrections can exceed it. [inferred]

Reforecast after **five ordinary + one coupled pilot or execution day 5**, then at **ten working days** and after the cold outside-author/two-harness pilot. If execution starts October 1, retain October 7/14 as planning checkpoints, not release dates. Record active owner effort, authoring/rework, CI/base/review wait, native operator turnaround, first-attempt config success and critical-path dependencies. Until access and a real pilot pass, do not endorse a calendar. [inferred; retained R/L3]

Widening the public client/config migration, service lifecycle, hosted/browser profile or event/data boundary invalidates the current allowance and triggers a fresh dependency/owner forecast before that scope enters 0.1.0. [inferred]

Round-three capture/lowering corrections are mandatory subwork inside the existing L admission/runtime stream: contract/corpus clarification, bounded snapshot copy/cleanup, one-node binder integration and full graph/resume proof. No additional service, dependency, runtime ceiling or stage is proposed. Their owner/worker demand must be measured in the early packed pilot and priced in the same ledger; the 8–12-week allowance is retained without claiming these tasks cost zero or fit measured capacity. Separate provisional schema freeze from installed conformance when estimating dependencies. [inferred; S16/S17]

**Critical path:** delivery truth + scope/access → provisional public author/config data-contract freeze → generic compiler/bounded capture/one-node binder including connected non-delivery acceptance/refusal → installed public-contract conformance freeze + outside/native pilot → full reference migration and selected origins → final content/BOM → full applicable installed campaign → seven qualifying days → maintainer promotion/readback. Canonical assets, lifecycle/trust and actual native operators can serialize it. Marketplace hosting, cloud operations, native UI and broad HMR are outside 0.1.0's critical path. [inferred]

| Risk | Mitigation / proof | What slips if unresolved [inferred] |
| --- | --- | --- |
| Fixed workflow repackaged as a platform | Novel capability + independently packaged author + non-delivery solution through same compiler/harness path | Platform release; no substitution of thin freeze as equivalent success |
| Public compatibility/closure becomes much larger than expected | Bundle-only trusted profile, explicit slot binding/manual install and one early outside pilot; price expanded profiles separately | Async/stateful/dependency formats and possibly the release date |
| Config forks, ignored declarations or floor bypass | One pure compiler; migrate legacy readers/unknown fields; final obligations plus effect-time owner checks | Reference/config migration; broader layer hierarchy waits |
| Trust confused with locality/review, unbounded capture or import TOCTOU | Metadata-only discovery, complete 1 MiB outside closure, stat plus observed-byte bounded capture/cleanup, separate purpose admission and snapshot/sentinel/race checks | Third-party support until proven; no weakening admission |
| Public graph exceeds reused coordination envelope | Host binder validates the full DAG, isolates one-node SkillRuntime units and pages full history outside coordination; packed 32-node/256-edge/mid-failure/resume proof | Outside/config support until proof; explicit contract reduction only, never raised runtime ceilings |
| Pre-admission schema/config input exhausts processing | Narrow declarative profile, explicit parse/ref/node/step limits, prototype-safe own-data traversal and G3/G4 adversarial refusal | Wider schema keywords/compatibility rules; never silent unsafe preview |

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

1. **Outside execution/public support. A — trusted bundled sync actions, bounded declarative schemas/exact-identity mappings and selected synchronous built-in service clients**, generic new capability names and pinned outside package proof. **B — add outside async/stateful services in 0.1.0**, price lifetime/effect/recovery support. **C — require isolated outside execution before release**, scope/process/security proof and later date. **Default: A.** No option retreats to renderer-only/private APIs.
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

### Reasoning for every default

Each row is a planning judgment [inferred] from the named inspected constraint/source, not measured adoption or a staffing commitment. B/C refer only to the options for that numbered question. No north-star constraint is reopened.

| Decision/default | Evidence and uncertainty | Why A wins; why B/C lose now | What changes the answer |
| --- | --- | --- | --- |
| **1. Outside execution/public support — A** | N requires outside authors now; S2/S4 already offer handler/sync-owner seams. S12/S14 and independently replayed S16/S17 expose client/payload/schema, graph-closure and before-admission capture semantics. No outside trial has passed. | A tests new capabilities, graph composition and real callable reuse with one wrapper, a bounded initial schema/source profile, one-node logical lowering and existing owners. B adds author lifetime/async contracts unused by these two demonstrators; C adds actual adversarial containment before trusted local use needs it. Neither is priced/proved. Graph-only service deferral would drop the existing promise. | A required cold-author task or bundle cannot work in the sync/identity/1 MiB capture profile, a packed 32-node campaign cannot preserve graph/authority semantics, or launch users require async lifetimes or untrusted/multi-tenant code. Name the owner, cost and conformance first; choose B/C and reforecast rather than quietly expanding. |
| **2. Upgrade origins — A** | R:113–128 retains native beta.5/beta.8; S13's inspected registry origins differ in Node floor/package shape. Stable/Beads-only layouts are not certified. | A preserves the existing two-origin promise and exercises the newer packaging/runtime transition. B increases the unmeasured codec/recovery corpus without an inspected native stable-origin need; C drops beta.8's promised journey and can hide this real transition. | An inspected native stable corpus plus demonstrated user need justifies B; unrecoverable beta.8 incompatibility forces an explicit C/support-date decision. No importer or destructive fallback is authorized. |
| **3. Claim boundary — A** | R requires copied native corpus proof; the owner's current store and quiet-window/backup readiness remain unknown (§8). | A certifies the product without treating general plan approval as a database-digest approval. B ties release to an uncommissioned live operation with data-loss risk; C imposes a post-stable timing rule even if the independent operational prerequisites become ready earlier. | The owning release/parent criteria explicitly require current-store cutover, and a writer pause, verified backup/restore, current whole-store digest, human digest approval and CAS/fencing/readback are ready. Then separately commission B; otherwise A remains. |
| **4. Resources/forecast — A** | L3:190–204 has merge/CI measurements, no owner-hour capacity. Four harnesses/seven binary targets/observer require actual operators (§7.2). The 120–180 hours is an illustrative envelope only. | A commissions access and learns owner demand through the bounded outside/connected pilot before endorsement. B is preferable for a committed date but stalls useful independent discovery if applied to all work; C prematurely narrows promises before trying to commission the lane. The 8–12 weeks is deliberately unendorsed. | Pilot demand exceeds committed owner hours, any promised lane is NO access, or someone uses the allowance as a promise. Choose B/no calendar or an explicit C support/date revision; no UNAVAILABLE-as-PASS. |
| **5. Optional budget — A** | S9/S15 show required delivery-truth/safety issues and a failed mutation run. No marginal speed/mutation return is measured. Two worker-days/four owner-hours is a **judgment cap**, not a research finding. | A gives one short profiler/seeded-mutation investigation enough scope to learn while limiting competition with the serial platform owner. B buys more unmeasured experiments; C yields no early diagnostic confidence. The particular cap is a reversible commissioning hypothesis, not an estimate of how much fixes require. | At expiry publish the trace/scored or unresolved result and actual owner cost. Expand B only for an identified decision/risk needing the evidence with funded time; choose C if no actionable evidence or owner demand competes with the critical path. Required repairs/admitted confidence and configured gates remain outside this optional cap. |
| **6. Publication identity — A** | R:259–266/S11 and §7.5 bind acceptance to exact bytes/version/BOM; changes invalidate identity-bound receipts. Publisher/operator effort is unmeasured. | A pays the real final-version campaign once and changes only channel metadata after acceptance; a failed literal version may need 0.1.1. B requires explicit equivalence/receipt-invalidation policy plus every applicable final rerun, so it has no assumed proof-saving advantage; C does not achieve stable release. | An approved alternative acceptance policy enumerates all invalidated receipts and proves final-byte campaign/observation equivalence, with lower measured operator cost. Otherwise retain A even if first accepted stable is 0.1.1. |
| **7. Skill-link failure — A** | R/L2/L5 and §3.5 require one physical canonical source with owned native discovery/preservation; no new operator-wide link-failure measurement supports a fallback. | A has one update/ownership path and makes unsupported hosts fail visibly. B duplicates bodies and adds drift/update/restore behavior; C adds independent artifact/discovery/update operations. Their costs are unnecessary before actual link failures are measured. | A promised target/operator cannot create required links and a managed-copy corpus proves ownership, byte parity, drift, update and restoration. Choose B deliberately; C requires real marketplace distribution demand and its own owner. |
| **8. Layer breadth — A** | B's layer/reset model and S3's defaults/known config are existing starting points; the two compositions need reusable template, persistent project bindings and per-invocation input/adapter selection. No team/user precedence need is measured. | A gives agents one deterministic distinction between reusable defaults, selected solution, stored project choices and ephemeral invocation without rewriting project bytes. C removes this last useful boundary or forces repeated persisted edits; B adds identity/scope precedence not needed by the demonstrators. Four is a design judgment, not a benchmark result. | The manual/cold benchmark shows invocation overrides are unnecessary and make authoring less successful (consider C), or an actual shared/team/user conflict requires B with explicit precedence/migration and funded proof. |
| **9. Lifecycle/update — A** | Existing owners already clean native resources; S2/S4 distinguish sync outside calls from awaited internal paths. The two outside tasks require no author-owned lifetime (§3.1/3.4). | A reuses owners and explicit restart/substitution, preserving recorded identities. B creates partial-setup/ready/drain/dispose contracts without a required outside service; C adds in-flight state transfer/cancellation and resume complexity before startup proof exists. | A demanded block truly owns a persistent resource; B enters after lifecycle/partial-failure/cost proof. C requires measured need and drain/state-transfer/recovery evidence. A same-process deadline remains unclaimed. |
| **10. First marketplace — A** | N needs publishing/discovery and demand-led promotion; P3/§3.7 can reuse npm/config artifact hosting and exact source locks. Submission rate/support demand is unknown. | A closes one outside publication/template/discovery loop with review/admission kept separate. B adds auth/signing/install/update operations without measured scale; C puts private/federated origin administration ahead of the first public author journey. No popularity-based promotion. | Submission/revocation workload exceeds maintainers' measured capacity, or actual private-index demand requires isolation/origin handling. Fund the respective B/C service owner and compatibility/security operations. |
| **11. Cloud/hosting — A** | N requires optional saving/sharing and hosted external solutions; P3/§3.8/3.11 distinguish backup/read copies from a new shared writer. No demand/staffing/isolation pilot is measured. | Backup/read first adds value without distributing active claims; a separately experimental hosted UI/backend slice tests target portability without broad authority migration. B adds shared lease/fencing/membership operations first; C postpones both practical target journeys. **0.2 is a sequencing hypothesis, not a deadline or promise to co-deliver them.** | Before 0.2 lock, require a named operations/security owner, capacity/access, demand from an external solution and actual isolation/rollback proof for hosting. If backup has demand but hosting lacks these, ship backup and defer hosting (a split of A); strong team-authority demand plus funded conflict proof favors B; absent demand/capacity favors C. Keep 0.1.0 seams regardless. |
| **12. App/bridge staging — A** | N excludes core UI and requires an API-consuming separate app; §3.9–3.11 reserve searchable/editable/plugin/transfer contracts. Public local APIs are not yet certified. | A validates the common API first, then gives one native app and authenticated independent client the same path. B makes auth/browser service operations a local-core release dependency; C delays useful visualization/integration feedback. **0.2 is an unmeasured hypothesis**, conditional on API maturity and funded service/security owners. | A launch builder needs supported network/browser access now and the auth/transport/revocation proof/capacity exists (B); no independent-client demand or insufficient API/service owners favors C. Contract fixtures remain required under every choice. |

**Valid reply:** a labeled option for each numbered question, or a combination in numbered order. **Overall default: A for all twelve** — minimal complete platform, native beta.5/beta.8 recovery, corpus claim acceptance, commissioned resources/pilot reforecast, bounded optional investment, exact candidate, owned links, four layers, startup substitution, curated marketplace, backup-first cloud plus an isolated 0.2 hosted UI/lightweight-backend pilot, and separate 0.2 visualization/app integration.

### Confidence

**High** in north-star alignment, inspected remote source boundaries, inherited release/recovery obligations, current runtime/Memory probe results, independently replayed graph/capture primitive checks and attributed dated registry/object readbacks. **Medium** in the smallest compatible architecture/staging: schemas/compiler/admission/native authoring are proposed and must survive the outside pilot. **Low** in sustainable staffing/calendar, demand, wider closure/lifecycle/sandbox and cloud/app operational outcomes; none was measured here. This is a written synthesis plan, not implementation authorization, installed conformance, release certification or full plan-to-dev stage completion.
