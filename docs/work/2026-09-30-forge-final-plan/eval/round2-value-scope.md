# Round 2 critic — value and scope

## Bottom line

1. **Decisions needed: none to complete this critique.** Retain the staged scope; use the implementation limits below when selecting v2's owner choices. [inferred]
2. **Verdict: SOUND.** V2 fixes the two round-one scope blockers and makes a useful local release conditional on actual acceptance, rather than optional optimization. [read/inferred: draft:85–107,113–128,161–167]
3. **The 0.1.0 scope is minimal relative to the owner's promise and worth releasing:** one install, durable authority/memory, recoverable work, truthful delivery, independent block use and bounded customization. [read/inferred: draft:40–53]
4. Narrow public assemblies are necessary product work, not speculative architecture; the current source still requires caller-supplied infrastructure and the corresponding assembly issues remain open. [read/ran: Assemblies below]
5. Two compositions, one local extension and one effective config result justify their cost; generalized templates, broad exports and complete facade cleanup do not belong in this release. [read/inferred: draft:103–105,175–176]
6. The expensive remainder is certification and recovery: six npm environments, seven binary targets, twelve proposed harness/host pairs, selected upgrades and seven exercised days. Price it explicitly; preserve promised proof. [read/inferred: draft:130–159; Certification below]
7. Beta.5/beta.8 support and preserved stable-origin refusal now define an honest, bounded upgrade promise; supporting every historical install would add unjustified scope. [read/ran/inferred: draft:117–124; Registry below]
8. Keep the decided pruning, but optimize for fewer supported surfaces and maintenance obligations, not an unmeasured download-size or CI-cost saving. [read/inferred: draft:102,109,173–183; Package below]
9. The highest-value refinements are a shipped runnable first-use recipe, one cross-harness recovery case and risk-owned wiring tests; add these within existing work, without another platform or study. [inferred]
10. No new blocking value/scope defect was found. This verdict evaluates the plan; installed behavior, resource availability, external demand and the proposed calendar remain unproven. [read/inferred: draft:18,191–208,304]

## Verdict

**SOUND — the staged local product now has a credible admission rule and explicit support boundaries; further reductions should remove optional work or duplicate proof, not the promised user outcomes.** [inferred]

This is not the smallest possible CLI release. It is the smallest defensible release of the owner's selected product: independent capabilities inside one package, a few extensible templates, additive configuration, Kernel authority and four supported harnesses. The thin-freeze alternative intentionally postpones real extension; selecting it would change the outcome rather than merely improve implementation efficiency. V2 makes that trade-off explicit. [read/inferred: `common.md`, draft:44–53,71–79]

The release earns its value when an installed user can capture an obligation, own and isolate work, retain decisions and evidence, interrupt execution, and recover the authoritative next action. The first-use/resume and independent-consumer cases now test that benefit directly. The version label, source-tree exports and healthy CI are insufficient on their own. [read/inferred: draft:40,146–159; Remote checks and Assemblies below]

## Evidence basis and independent checks

The review input is local `docs/work/2026-09-30-forge-final-plan/plan-v2.md` (304 lines); all `draft:<line>` references identify that input. I read the critic/common briefs, the complete draft, the round-one value critique/revision crosswalk and relevant L4 research. Research conclusions prompted checks; they are not substituted for current primary evidence. [read; rung 2]

Repository reads use `git show origin/master:<path>`, pinned to `7d448ec812ef8639790477af07c3c75962173f8a`. A fresh Forge-routed GitHub `commits/master` API read returned the same SHA. Local HEAD remains predecessor `ba56b9201782c4d1246c77bde6380867603184bf`; it was not used as implementation authority. [ran; remote metadata]

| Check | Independently observed evidence and limit |
| --- | --- |
| **Package** | `git show origin/master:package.json`: version beta.8, Node `>=24.0.0`, runtime dependencies Babel parser/cross-spawn/YAML, only `packages/skills` in workspaces, and no manifest `main`/`exports`. `scripts/package-size-baseline.json:2–6` records 1,320,089 compressed bytes, 4,805,641 unpacked bytes and 454 files. These are declarations and committed accounting, not a new pack/install measurement. [read; rung 2; ran manifest projection] |
| **Assemblies** | Memory delegates through an injected broker (`lib/memory-core/src/authority-provider.js:37–59`). Flow requires `run` and invokes it synchronously, rejecting Promise results (`lib/flow/src/executor.js:217–248`); the receipt helper declares beta.6 (`lib/flow/index.js:52–59`). Read-only `show --json` verifies the standalone Memory assembly (`12d92893`) and Flow runner assembly (`1ff3d2f9`) remain open. Their old separate-package criteria require reconciliation, not separate publication. Source and records establish unfinished wiring; no runtime failure was reproduced here. [read/ran; rung 2 and record metadata] |
| **Existing composition/config** | `lib/core/runtime-graph.js:164–185,289–300` defines reusable skill composition/planning settings; `lib/flow/src/skill-runtime.js:60–72` accepts handlers/capabilities and bounded metadata. Malformed-config handling differs: runtime graph reports errors (`lib/core/runtime-graph.js:562–598`), while issue-backend parsing treats failure as absent (`lib/issue-backend.js:53–60`). These support reuse and reconciliation; they do not prove an installed general extension/resolver contract. [read; rung 2] |
| **Registry** | Fresh read of [forge-workflow registry metadata](https://registry.npmjs.org/forge-workflow): complete dist-tags are `latest=0.0.10` and `beta=0.1.0-beta.8`. Beta.5/beta.8 declare Node `>=22.16.0` and `packages/*`; beta.8 depends on the three separate `@forge/*` packages. Stable metadata has no engines declaration. This verifies origins/declarations, not storage equivalence or working upgrades. `QUICKSTART.md:15–25` independently distinguishes beta from the older default install. [ran/read; live metadata and rung 2] |
| **Remote checks** | Forge-routed exact-master check-runs API returns all 31 completed objects: 18 successful, 13 skipped, including successful CI Gate and all six Ubuntu/macOS/Windows × Node24/26 full-matrix checks. [Parked release proposal (#564)](https://github.com/harshanandak/forge/pull/564) remains OPEN at `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`. These are live GitHub records, not installed-product certification or an approved implementation date. [ran; metadata] |
| **Certification** | `docs/work/2026-08-09-forge-product-restructure/validation-matrix.md:4,8–18,60–90` requires risk-owned proof, G0–G8, exact artifacts, supported modes/harnesses, recovery, at least 50 distinct clean pairs and seven cumulative automated days. Its Node22 row is superseded by the owner direction and current manifest. Binary workflow enumerates seven targets but enables smoke only for Linux x64 (`.github/workflows/build-binary.yml:38–54`); publication currently creates a normal release and uploads with clobber (`:253–261`). Harness parity explicitly proves metadata rather than live invocation (`docs/reference/AGENT_SKILL_PARITY.md:156–164`). V2 correctly treats the missing proof/publication wiring as work. [read; rung 2] |
| **Native preservation and optional work** | Native projection imports JSONL codecs from the Beads compatibility adapter (`lib/kernel/projection-jsonl-writer.js:6`); definitions are `lib/adapters/beads-kernel-compat.js:59–78`. Preservation before importer deletion is therefore justified. Mutation is schedule/manual-only (`.github/workflows/test.yml:656–660`) and absent from the enumerated CI Gate dependencies (`:962–970`); that does not establish absence from every possible policy. [read; rung 2] |

I separately checked the proposed inventory arithmetic: `24 + 6 + 6 + 12 + 6 + 12 + 7 + 6 + 1 = 80`. This validates the sum, not distinctness, coverage, execution cost or successful journeys. [ran; arithmetic]

No installed consumer, migration, restore, live harness, observation campaign or performance benchmark was run. Behavioral safety remains unproven here. Only this evaluation file is written; no commits, pushes, GitHub writes or Kernel mutations are authorized by this critique.

## Blocking issues

**None.** I found no new value/scope problem that makes v2 wrong, unachievable or harmful as written. Its access/effort uncertainties are explicit readiness conditions and reforecast triggers, not hidden claims of completed support. [inferred from draft:132,191–208]

The two prior blocking findings are substantively resolved:

1. **Optional investment no longer precedes scope authority.** Acceptance/interfaces are first; required safety/evidence fixes are separated from performance/mutation work, with a combined two-worker-day/four-owner-hour ceiling. Missed throughput/speed targets do not independently block release; existing jobs/gates remain intact. This addresses the waste-producing dependency rather than merely renaming it. [read/inferred: draft:85,91–95,163–167,208; Native preservation and optional work above]
2. **Current published users now have explicit dispositions.** Native beta.5 and beta.8 each require preservation/restart/interruption/rollback proof; stable 0.0.10 and unsupported/Beads-only layouts get non-mutating refusal and a preserved prior installation/manual guide. Reusing beta.5 evidence requires checked equivalence. The draft neither silently expands to every origin nor promises automatic stable-origin activation. [read/inferred: draft:115–124,294; Registry above]

These are resolutions of the written plan, not evidence that the corresponding implementation or acceptance has passed.

## Marginal value and scope decisions

All recommendations in this table are **[inferred]**, grounded in the draft and independently checked evidence above. S/M/L labels are the draft's estimates, not measured engineering effort.

| Item | Is it worth its cost? | Keep/cut boundary for 0.1.0 |
| --- | --- | --- |
| Acceptance/interface lock and truthful required evidence | **Yes.** M-sized semantic/authority work prevents parallel workers implementing incompatible contracts or accepting false proof. | Reconcile release-critical criteria only. Do not audit all 881 unresolved records or invent another coordination service. |
| Sole authority, native preservation and claim corpus | **Yes.** M–L recovery work protects the actual durable-work value. Shared codec extraction is a prerequisite to safe decided deletion. | Revalidate landed implementations; keep operational database repair separate unless an explicit release criterion requires it. |
| Public local Memory/Flow/Kernel assemblies | **Yes.** L-sized wiring makes the blocks usable independently; exporting primitives alone leaves consumers to build the product's missing infrastructure. | One supported local assembly per promised journey, existing owners, explicit lifecycle/errors. No blanket exports, second authority, provider catalog or replacement runtime. |
| Two compositions, one local extension and additive config | **Yes, with the stated ceiling.** M–L work delivers customization without a fork and makes independent paths agree on effective behavior. | Two descriptions and one real extension seam over existing constructors; one resolver. Defer inheritance, remote loading, personal-overlay hierarchy and a generic dependency solver. |
| Controls, essential Doctor and promised harness routes | **Yes.** Permission, recovery, bounded execution and user-content preservation are release obligations, not optional polish. | Finish the supported route only. New renderers, rich diagnostics or facade refactors need a named accepted journey; do not infer scope from an old epic's broad title. |
| Decided pruning and canonical skills | **Yes.** The gain is fewer editable/support surfaces and less integration drift, even where npm byte savings are small. | One coordinated manifest/lock/generated-assets owner; preserve native codecs, unique PR linkage, targeted inbox and surviving security/recovery proof. No historical-doc purge or unrelated dependency hunt. |
| Beta-origin support and stable-origin refusal | **Yes.** The current beta channel is a real origin; truthful refusal bounds the much wider stable/legacy compatibility burden. | Keep both selected native betas, checked equivalence and working rollback. Defer automatic stable activation and every unlisted historical origin. |
| Artifact matrix, candidate observer and immutable promotion | **Yes under the retained support promise, but this is a major cost.** Present build/metadata proof does not demonstrate advertised installed behavior. | Provision early and reuse existing release owners. No new certification framework; no default-channel publication before acceptance, missing-lane success or observation credit from another identity. |
| Windows optimization, new mutation scoring and throughput tuning | **Conditional.** Their payoff is unmeasured; correctness repairs have a different admission basis. | Require a reproduced bottleneck or explicitly admitted risk before optional spending; enforce the cap, and defer new experiments when the first usable product/access is still blocked. Retain configured jobs and gates. |
| Full vision and continuous improvement | **No for this release.** It adds compatibility, operations and support work without a required local outcome. | Keep the cloud/team, graph/vector, marketplace/provider expansion, continuous optimization, broad API/facade and general-template deferrals. Do not turn them into automatic 1.0 prerequisites. |

**What should be cut now:** speculative exports/refactors, repeated low-level tests inside every journey, optional optimization without a demonstrated payoff, and any task admitted solely because an old issue or architectural diagram mentions it. **What must remain:** supported user journeys, owner-decided retirements, authority/data/security invariants and required artifact proof. V2's admission rule already supports this distinction; apply it during task decomposition. [read/inferred: draft:85,109,169–183,202]

## Non-blocking improvements

1. **Ship the golden path, not just its test inventory.** Turn first-use/resume and independent-consumer cases into runnable examples in the small supported documentation set. A user should know what to install, which minimal/profile/harness choices are needed, the first durable result and how to resume it. Current Quickstart still describes Beads backend selection (`QUICKSTART.md:11,33,103`), so active-doc reconciliation has direct adoption value. Use the same recipe as acceptance input; add no separate tutorial framework or onboarding study. [read/inferred: draft:106,147–148,183; Quickstart]
2. **Make transferability observable once across harnesses.** Let one existing recovery case end session/harness A and resume in another supported harness, checking the same issue owner, decisions, evidence and next action. Same-harness restart and twelve individually successful harness cases do not alone demonstrate that advertised benefit. Fold it into planned corpus/operator work rather than adding a cross-product of handoff combinations. [read/inferred: `README.md:20–24`; draft:40,147,151]
3. **Allocate proof by risk, not by pair-count ambition.** At scope lock, map the 80 proposed pairs to risk/owner tests and platform-specific wiring. Keep lower-level edge cases in their canonical owner suite; composite journeys prove installation/integration and do not rerun the entire adversarial suite six times without a platform reason. Preserve every promised stratum, the 50-pair floor and seven days. The matrix itself says one risk, one canonical owner test. [read/inferred: validation-matrix.md:4; draft:144–159]
4. **Make the controls/Doctor work package a closed list before delegation.** Replace “essential” and “genuinely missing” with the accepted public routes and observable failures the task must fix. Existing metadata docs contain broader renderer/diagnostic aspirations; do not import all of them into 0.1.0. V2's admission rule is sufficient if applied to each leaf. [read/inferred: draft:85,105,175,179,202; `docs/reference/AGENT_SKILL_PARITY.md:166–175`]
5. **Spend optional time only after showing its opportunity cost.** Keep the explicit cap, but identify the specific blocked journey or repeated owner intervention an experiment would improve. If none exists, leave the allowance unused. Collect pilot telemetry from normal delivery/receipts rather than building a measurement system. Missing access or unfinished assemblies deserve priority over a faster already-passing lane. [read/inferred: draft:163–167,191,197–200]
6. **Make bounded promises consistent in active docs and metadata.** Carry the origin dispositions, required runtime, selected harness behavior and allowed local API/extension surface into release docs. Remove or qualify current README's “another machine” promise if only local single-machine recovery is certified; cross-machine/team operations are explicitly deferred. This is documentation scope discipline, not a request to implement distributed authority. [read/inferred: `README.md:20–24`; draft:181–183,177,227]

## Scores (1–5)

Scores are **[inferred]** judgments of the plan in this lens, not behavioral evidence.

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | **3** | Reuse and early access checks improve feasibility; several L-sized integration/recovery slices and unconfirmed operators still prevent a dependable date. The draft acknowledges that limitation. |
| Value | **4** | Complete durable-work and independent-consumer outcomes justify release. External adoption/time saved are unknown, and optional investments have not earned a demonstrated payoff. |
| Clarity | **4** | Admission, support/refusal, cuts and critical-path boundaries are clear. Controls/Doctor leaves and the risk-to-pair mapping still need concrete decomposition. |
| Risk handling | **4** | Native preservation, separate live cutover, exact artifacts, tri-state proof, early access and correction contingencies are explicit. None has been behaviorally certified in this review. |
| Alignment with owner constraints | **5** | One package, Kernel authority, Node24/26, decided pruning, canonical skills/links, CI-first guarded delivery and intact gates are preserved without a new platform or marketplace prerequisite. |

## Open questions for the owner

These are optional choices within v2's existing decisions, not permission requests or additional blockers.

1. **Product boundary:** **A — retain staged local APIs, two compositions and one extension; B — select thin freeze and explicitly postpone extension. Default: A.** Cutting assemblies/customization would shrink the promised outcome, not just remove overhead. [inferred]
2. **Optional spending:** **A — retain v2's cap, with a demonstrated bottleneck/admitted risk before spending; B — defer all new optional speed/mutation experiments for this release while retaining existing jobs/gates. Default: A; spend zero when no qualifying case exists.** [inferred]
3. **Acceptance refinements:** **A — incorporate the runnable recipe, one cross-harness handoff and risk-owned wiring checks into existing corpus/docs work; B — retain current composite cases and document the narrower demonstrated handoff boundary. Default: A.** Neither choice reduces mandatory proof. [inferred]

Valid replies are one label per question or a combination in order. Silence selects **A+A+A** as this critique's recommendation, without authorizing implementation, operational repair or publication.

## Confidence

**High** in the inspected draft boundaries, checked remote declarations, live registry/GitHub/Kernel records and resolution of the two prior written-scope blockers. **Medium** that staged scope is the useful minimum for the owner's chosen product: consumer examples, concrete control leaves and certification ownership remain work. **Low** in calendar, final engineering cost, external demand, realized savings and installed behavioral success; this read-only evaluation did not run those campaigns. The value verdict is an explicit inference, not a claim of release readiness.

BLOCKING: 0
