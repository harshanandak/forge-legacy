# Round 1 critic — value and scope

## Bottom line

1. **Decisions needed:** separate release prerequisites from delivery optimization, and define support for the versions users install today. Default: make both revisions before locking implementation. [inferred]
2. **Verdict: NEEDS-REVISION.** The product is worth releasing, but the dependency order spends too much before scope is locked and the upgrade promise leaves current published users unaccounted for. [inferred]
3. The valuable core is one install, one authority, durable local knowledge, recoverable work, trustworthy delivery evidence, and usable individual block APIs. Keep it. [read/inferred: draft:47–60]
4. Narrow public assemblies, two real compositions, and one local extension are justified by the owner's stated product direction; removing them would make this a smaller but different release. [read/inferred: common.md; draft:52–55,84–88]
5. Safety, native recovery, supported harnesses, and exact-artifact acceptance are necessary costs; do not buy a shorter date by weakening their proof. [read: common.md; validation-matrix.md:8–18,60–90]
6. Delivery policy and the truthful required aggregate belong early; generalized Windows performance work, mutation scoring, and throughput targets need separate admission and spending limits. [read/inferred: draft:98–102,110,117]
7. The upgrade scope needs explicit dispositions for published stable 0.0.10 and beta.8, alongside beta.5 fixtures; supporting every historical version is unnecessary. [ran metadata/inferred: registry check; draft:30–31,116]
8. Keep the decided pruning and existing deferrals. Historical-document deletion, a package split, a new runtime, and broad optimization machinery add no required release value here. [read/inferred: common.md; draft:134–148]
9. Add one complete first-use/resume journey and one independent block-consumer journey to the existing corpus; use them to demonstrate benefit rather than adding an adoption research project. [inferred]
10. A revised staged release is minimal relative to the owner's promise and worth shipping; the 4–6 week date remains a planning hypothesis, not established delivery capacity. [read/inferred: draft:155–159]

## Verdict

**NEEDS-REVISION — retain staged evolution, but remove unnecessary serial prerequisites and price or explicitly limit the current-user upgrade promise before implementation is locked.** [inferred]

This is a value/scope verdict, not a claim that the product cannot be built. The draft already rejects a rewrite, generalized template inheritance, multiple packages, full facade thinning, cloud/team services, and continuous optimization. Those are appropriate cuts. Its distinction between source CI and a delivered installed artifact is also sound. [read/inferred: draft:26–32,84–88,134–148]

## Evidence basis

- **Draft inspected:** `docs/work/2026-09-30-forge-final-plan/plan-v1.md`, including target, workstream tables, dependencies, schedule, deferrals, candidate policy, and owner choices. Draft line references below identify this local review input, not tracked implementation. [read; rung 2]
- **Remote source independently checked:** fetched `origin/master`; both `git rev-parse origin/master` and a subsequent `git ls-remote origin refs/heads/master` identified `7d448ec812ef8639790477af07c3c75962173f8a`. Repository references below use that exact ref. [ran; remote metadata check, not a behavior test]
- **Primary source reads:** package manifest; runtime-graph resolution; Flow exports/producer; Memory authority provider; native JSONL projection dependency; Lefthook push wiring; mutation job and CI aggregate; current Quickstart, Setup, and validation matrix. [read; rung 2]
- **GitHub independently checked through Forge:** proposal [release reconciliation (#564)](https://github.com/harshanandak/forge/pull/564) remains OPEN at head `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`; [the cited Tests run](https://github.com/harshanandak/forge/actions/runs/36570515358) reports a `workflow_dispatch` failure on September 29. The parked plan's upgrade/matrix clauses were also read from that head. This verifies metadata and declarations, not a reproduced mutation diagnosis. [ran/read]
- **Registry independently checked:** [forge-workflow registry metadata](https://registry.npmjs.org/forge-workflow) returned `latest=0.0.10`, `beta=0.1.0-beta.8`, and no `next` tag. Beta.8 still declares separate `@forge/contracts`, `@forge/flow`, and `@forge/memory` dependencies and Node `>=22.16.0`; tracked master declares the folded package and Node `>=24`. [ran/read; live metadata, not installation proof]
- **Research consulted:** L4's capability/cost ledger and deferrals; L3's delivery-cost and mutation discussion. Their conclusions informed questions; the central implementation/channel claims above were checked independently. [read]

No installed upgrade, public consumer, live harness, restore, or release journey was run. Cost/value recommendations are marked `[inferred]`; they are not rung-4 or rung-5 behavioral findings. No Kernel or GitHub state was mutated.

## Blocking issues

### 1. Release scope is locked after work that should be admitted by that scope

**Claim/section:** section 5 labels the whole delivery foundation as landing “before broad product work.” Acceptance/contract lock then lists “Delivery foundation” as its prerequisite. That foundation includes M–L Windows process-identity performance work, optional mutation scoring, and a throughput pilot; final promotion also requires scored mutation proof or explicit retirement. [read; rung 2: draft:94–102,110,117,123]

**What is wrong:** this makes delivery improvement a serial admission requirement for the product instead of first deciding which improvements are necessary to ship it. Correct merge authority, unsafe cleanup, false verdicts, and missing required evidence are release blockers. A faster but already passing Windows lane, a better ordinary-PR P75, and a new mutation score are not interchangeable with those defects. The default spends on several coupled changes before the acceptance lock can establish their necessity, with no stated engineering-time cap or explicit rule allowing safe product work to proceed when a performance target is missed. The rolling pilot avoids a separate ten-day wait, which is good, but does not fix the prerequisite coupling. [inferred from the dependency table]

**Evidence:** the tracked mutation job runs only on scheduled/manual events; it is absent from the CI Gate's declared dependencies. See [mutation job](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/.github/workflows/test.yml#L656) and [aggregate dependencies](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/.github/workflows/test.yml#L962). That proves this job is not a current CI Gate dependency, not that mutation has no value or that no other policy could require it. [read; rung 2] The live failure establishes repair work remains, not its return on investment. [ran metadata] The team-sync push step is explicitly non-blocking and calls the retired Beads-oriented shell path; removing its decided wiring is a narrower action than redesigning shared process identity for speed. See [push wiring](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lefthook.yml#L71). [read; rung 2]

**Why blocking in this lens:** an allegedly bounded, minimal release authorizes substantial extra work on its critical path before determining whether that work buys a required outcome. This is a scope/dependency defect and an inferred waste/delay risk, not a reproduced safety failure. The remedy does not remove a required check. [inferred]

**Specific fix:** move acceptance/contract ownership to the start of the approved program. Split the foundation into (a) required authority/evidence/safety repairs and decided team-shell retirement, and (b) measured delivery optimization. Allow independent product slices after (a). Run the pilot and performance measurements alongside them. At scope lock, enumerate any release risk uniquely covered by mutation, check required contexts/consumers, and decide its repair or approved deferral; do not wait until RC to make that scope decision. Give optional performance/mutation experiments a fixed spending cap and stop condition. Preserve all existing gates and unique risk proof; this critic authorizes no workflow retirement or bypass. [inferred]

### 2. The upgrade promise does not disposition today's installation channels

**Claim/section:** the target promises native backup/upgrade/rollback and compatible `0.1.z` updates; the value summary says existing users retain data, provenance, and rollback. The migration workstream's concrete preservation/restart/interruption/rollback gate is beta.5-based, while the same draft identifies published stable 0.0.10 and beta.8 as today's channels. [read; rung 2: draft:30–31,57–58,111,116,185]

**What is wrong:** a beta.5 compatibility corpus is useful, but it cannot by itself establish which present users can upgrade to the new package/skills/config layout. The draft does not price or explicitly exclude the default stable origin and the currently published beta origin in its migration gate. That leaves either additional unbudgeted work or an overbroad recovery promise. It is especially material when removing the importer and changing canonical skill ownership: “preserve old data,” “activate it in Kernel,” and “restore the prior working installation” are different outcomes. No data-loss reproduction is asserted here. [inferred]

**Evidence:** the live registry reads above establish both current channels and beta.8's materially different dependency/runtime declarations. [ran metadata] The current [Quickstart](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/QUICKSTART.md) explicitly distinguishes `@beta` from the older bare/default installation. [read; rung 2] The tracked [validation matrix](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/docs/work/2026-08-09-forge-product-restructure/validation-matrix.md#L60) names current beta.5 binaries/config/JSON/database upgrade; the parked plan also requires beta.5 inventory and recovery. [read; rung 2] A case-insensitive inspection of the draft for `0.0.10`, `beta.8`, `beta.5`, upgrade/migration clauses found current-channel publication discussion and beta.5 migration acceptance, rather than a supported-origin disposition table. That search is orientation; the positive, narrower migration gate at line 116 is the substantive evidence. [read]

**Why blocking in this lens:** the owner cannot choose a minimal cost for “existing users keep their data and can roll back” without knowing which existing installations that promise includes. Publishing truthful install/upgrade support is part of the release's value and safety contract. [inferred]

**Specific fix:** add a small supported-origin table for fresh installation, published beta.5, published beta.8, and published stable 0.0.10. Each gets either a supported upgrade plus preservation/restart/interruption/rollback evidence, or an explicit unsupported disposition with a non-mutating preflight refusal, preserved source data/config, and an honest manual recovery/transition guide. Reuse beta.5 evidence only after demonstrating relevant format/layout equivalence. Respect Node 24 for the target; a legacy input fixture is not another supported target runtime. Do not add a shipped Beads importer or every historical version to solve this. Reflect the selected dispositions in cost and public documentation before freeze. [inferred]

## Non-blocking improvements

1. **Make the useful minimum observable.** Add two named cases to the existing versioned journey corpus: a new user installs the minimal profile, owns work, records a decision, restarts, and retrieves authoritative next work; an independent clean-directory consumer uses a public block without initializing the full workflow. Include user-content preservation and cleanup. These test the stated value, rather than merely importability or the numerical pair count. The draft already covers many component transitions; this asks for their complete user-facing wiring. [read/inferred: draft:47,60,76,113–115]
2. **Use an item-admission rule.** Every remaining task must close a named promised journey, preserve an authority/data/security invariant, complete a decided retirement, or produce required release proof. Otherwise defer it. The draft's effort labels are useful, but a value column alone does not establish marginal value. [inferred]
3. **Separate safety fixes from speed targets.** Keep a demonstrated process-identity/cleanup defect blocking; treat faster routine sync and the ordinary-PR P75 as measured operating targets. Do not require a new persistent helper before trying the native/batched approach already proposed. [read/inferred: draft:100,102]
4. **Bound pruning integration.** Keep the owner-directed retirements; delete their owned positive tests with them while retaining surviving security/isolation coverage. Limit orphan cleanup to touched slices after the caller census. Do not pursue unrelated library dependency replacement or historical-doc deletion for size. The draft already largely follows this rule. [read/inferred: draft:112,138–148]
5. **Check certification access early.** Identify the permitted operator/lane for each promised harness and binary/OS case at scope lock. Preserve the four-harness promise; an unavailable execution lane is an operational dependency to arrange, not permission to label missing behavior as graceful degradation. [read/inferred: draft:56,115,166]
6. **Treat the date as a range until decomposition.** The proposed 30–40 ordinary plus 8–12 coupled slices are expressly a workload hypothesis. Attach a revised forecast to owned tasks and early integration results, not just observed PR merge throughput. Do not create a new estimation platform. [read/inferred: draft:155–159]
7. **Use existing user work to demonstrate benefit.** Record first successful use, resume correctness, owner intervention, and supported refusal in the delivery/candidate cases already planned. External adoption and willingness to pay remain unknown; no market campaign needs to precede this owner-focused release. [read/inferred: draft:47,102,181–189]

## Cost/value disposition of every workstream

These are scope recommendations, not implementation authority or measured savings. [inferred]

| Draft item | Release disposition | Cost/value boundary |
| --- | --- | --- |
| Landing contract and policy | Keep, small | One landing owner, proven lease transfer, correct review bar and quarantine policy. Avoid building a coordination service. |
| Truthful required aggregate | Keep early | False/missing proof undermines release value. Use the existing protected retirement mechanism and preserve required coverage. |
| Windows and push cost | Split | Complete decided team-shell removal and required safety fixes. Measure shared bottlenecks; defer optional performance redesign beyond a spending cap. |
| Truthful blockers and confidence | Split | Correct false verdict/handoff behavior. Admit mutation repair separately against a named risk and budget. |
| Delivery pilot | Keep alongside work | Instrument real train changes. Its throughput target is not product acceptance. |
| Acceptance and contract ownership | Keep first | Reconcile only release-critical outcomes; freeze narrow existing seams rather than undertaking all 881 unresolved records. |
| Native preservation and D46 | Keep | Lossless native export/restore and historical data preservation justify cost. Extract the shared codec before deleting importer-owned code. |
| Pruning and skill/artifact ownership | Keep | Already-decided support-surface reduction; coordinate manifest, lock, packaging, links and binary assets once. |
| Public local assemblies and entrypoints | Keep narrow | Required reusable-block promise. Existing indexes/providers are foundations, not a reason for a second runtime or public export of every helper. |
| Two compositions and additive config | Keep narrow | A real extension example makes the product configurable. Stop at that seam; defer generalized inheritance/network catalogs. |
| Controls, diagnostics and harness proof | Keep supported routes | Consent, truthful capability, resume and user-content preservation are real outcomes. Broad Doctor dashboards and extra harnesses stay deferred. |
| Migration, candidate machinery and docs | Keep, revise origins | Necessary recovery and installed-artifact proof; price current-user support explicitly and reuse existing corpus/writers. |
| Final candidate and promotion | Keep | Exact artifact, required strata, 50 distinct pairs, seven exercised days and live readback remain. Do not count preliminary RCs or repeat identical pairs as substitute acceptance. |

The codec preservation cost is concrete: [native projection serialization](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/kernel/projection-jsonl-writer.js#L6) imports JSONL helpers from the Beads compatibility module and uses them for issues, comments, and dependencies. Blind importer deletion would affect a surviving native responsibility. [read; rung 2] Likewise, [Memory's provider](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/authority-provider.js#L37) requires an injected broker, and [Flow's index](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/index.js#L93) exposes primitives. Finishing usable default assemblies is substantive product work, not merely reorganizing files. [read/inferred]

**What should be cut or deferred:** keep the draft's cloud/team, graph enrichment, marketplace/provider expansion, continuous optimization, complete facade thinning, general template machinery, and speculative CI/build changes deferred. Move uncapped performance and optional-confidence work out of release admission. Cut only the decided duplicate/dead surfaces after their surviving responsibilities are accounted for. [read/inferred]

**Is 0.1.0 minimal but worth releasing?** Yes, after the two blocking revisions. It is the minimum useful form of this owner's declared configurable, reusable local product, rather than the absolute smallest CLI. Narrow APIs and one genuine extension seam earn their cost because they let users adopt capabilities independently. Recovery, truthful evidence, supported harnesses, and installed publication make that promise usable. Full architectural completion and optimization experiments do not earn mandatory first-release status from the evidence checked here. [inferred]

## Scores (1–5)

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 3 | Real foundations and deliberate deferrals; significant coupled distribution/migration/harness work, with unnecessary serial prerequisites and an incomplete upgrade boundary. [read/inferred] |
| Value | 4 | Strong owner-facing durable-work and reusable-block proposition; external demand remains unproven and optional optimization needs a spending limit. [read/inferred] |
| Clarity | 4 | Good target, workstream gates, dependency order and evidence limits; separate release necessities from optional confidence and specify installed origins. [read/inferred] |
| Risk handling | 4 | Strong authority, data-preservation, exact-artifact and fail-closed principles; current-user upgrade support needs an explicit disposition. [read/inferred] |
| Alignment with owner constraints | 4 | Keeps one package, Kernel authority, Node 24/26, pruning, CI-first delivery and gates. Revision should preserve those choices while reducing needless prerequisites. [read/inferred] |

## Open questions for the owner

1. **Delivery investment:** **A — lock acceptance first, run necessary safety/evidence repairs early, and timebox optional optimization alongside product work.** **B — retain the full delivery-foundation dependency and expressly accept the additional scope/date risk.** **Default: A.** Neither choice authorizes weakening an existing gate; mutation's policy disposition must be explicit.
2. **Upgrade support:** **A — disposition current stable and beta channels now, testing supported paths and refusing unsupported ones without mutation.** **B — explicitly advertise a narrower beta.5/fresh-install release, with preservation/refusal guidance for other origins and a priced follow-up.** **Default: A.** This does not reopen the no-importer decision.

Valid replies are a label for each choice, or a combination in order. **Overall default: A+A — acceptance-first bounded spending, and explicit current-channel upgrade dispositions.** Silence means these recommendations remain the default for the plan revision, not authorization to implement.

## Confidence

**Medium.** Source declarations, remote identity, GitHub proposal/run metadata, and current registry channels were independently checked. The scope judgments follow the draft's explicit dependencies and promises. User adoption, coding effort, installed upgrade behavior, live harness behavior, and achieved performance were not measured in this critic pass. The two blockers identify contract/scope gaps, not newly reproduced runtime defects.

BLOCKING: 2
