# Round 2 — Cost and scope

## Bottom line

1. **Decisions needed: none additional for this critique.** Retain the staged-medium planning default; its estimates still require the October 7/14 calibration. [inferred]
2. **Verdict: SOUND.** Twelve capped responsibility owners, selected public operations and one closed extension seam are proportionate; twelve extractions or a registry would not be. [read: draft:173–207; inferred]
3. The twelve names help assign agent work, but do not prove an optimal module count, independent implementations or twelve shipped APIs. V2 now says this explicitly and caps mapping at 1–2 engineering days. [read: draft:190–207]
4. The six public entry categories substantially retain the final plan's existing scope. Kernel/config/template contracts still need real consumer and lifetime work; source indexes are not published support. [read: final plan:45–48,103–104; draft:349–362]
5. A micro-block registry, generic service solver, extension lifecycle and published-package loader are explicitly deferred. Keep those exclusions; no first-release consumer in this draft requires that machinery. [read: draft:194–207,338–345,381; inferred]
6. The receipt seam is deliberately thin enough to build, but not thin by accident: compatible renderers fit; unrelated, asynchronous or stateful capabilities need another host contract and estimate. [read: draft:310–334; inferred]
7. The new admission/snapshot requirements are real loader work. The current fixed resolver, sparse writer and handler injection do not supply that implementation or its binary proof. [read: remote sources below; draft:128–136,236,437–439]
8. **3–6 engineering days plus 4–8 lead hours is a partial, provisional marginal estimate**, with unpriced baseline reconciliation. It is neither the total block program nor a spending/date ceiling. [read: draft:429–444; ran: arithmetic; inferred]
9. Extra lead review occupies **2.7–5.3 allocations of the illustrative 90-minute review day**. October 28–November 11 remains stretch; November 4–18 remains a five-working-day sensitivity, with potentially larger slips. [read: final plan:191,206–221; ran: arithmetic/calendar; inferred]
10. **No cost/scope blocker established.** Remaining improvements concern comparable option pricing, reconciliation of the loader/renderer estimates and keeping prototype tooling out of the support promise. [inferred]

Evidence notation: **[read] = rung 2**, inspected source or supplied planning text; **[ran] = rung 4** for the named command/calculation only; **[inferred]** is a judgment or scenario, not implementation evidence. `draft` means the supplied local `blocks-plan-v2.md`; `final plan` means the supplied local v2 `plan.md`. Tracked-source citations below refer to freshly fetched `origin/master` **(7d448ec812ef8639790477af07c3c75962173f8a)**. Local research remains attributed planning input. No release/runtime result is inferred from source inspection. [ran: fetch and rev-parse]

## 1. Verdict

**SOUND — the recommended granularity earns clearer ownership and useful independent consumers without making a plugin framework or broad API stabilization a prerequisite for 0.1.0.** [inferred]

This judgment applies to the staged default and its explicit reforecast conditions. It does not endorse all twelve public/extracted owners, certify the proposed loader, or validate sustainable throughput. The draft calls its larger week ranges unmeasured scenarios, identifies writer/loading omissions and refuses to treat the stretch dates as commitments. Under the critic brief, an acknowledged estimate awaiting a mandatory pilot is not itself a blocking error. [read: draft:200–207,429–463; inferred]

V2 materially improves the cost contract over round one: a mapping ceiling, a closed normative action schema, per-entry support inventory, an explicit extensibility ceiling, priced replacement and baseline/delta reconciliation are now present. The additional source-scoped admission/snapshot work also creates a fresh implementation risk; the favorable verdict depends on retaining its stated feasibility and pricing checkpoint. [read: round1-cost-scope.md: non-blocking improvements 1–7; draft:72–85,128–136,190,288,310–334,349–362,429–444; inferred]

## 2. Blocking issues

**None established through this lens.** The recommended scope does not require twelve runtime descriptors, stable APIs for every owner, generic capability resolution, published third-party loading or guaranteed dates despite missing capacity. It instead specifies capped mapping, selected public operations, a single closed local seam and an owned reforecast. The unresolved loader/writer effort is disclosed rather than presented as implemented or fully funded. [read, rung 2: draft:190–207,310–334,349–381,429–463]

## 3. Non-blocking improvements

1. **Compare equal scopes in the granularity price table.** The coarse-five row prices mapping at 0–2 days, while staged-medium prices the broader 3–6-day delta including interface, loader and consumer work. Yet the proposed coarse option retains the same bounded outcomes. Split common assemblies/resolver/admission/consumer cost from the incremental ownership-map cost for each option; use “not separately estimated” where appropriate. Otherwise the table can suggest that choosing five names removes executable-extension obligations. [read, rung 2: draft:171,200–207,427,433–440; inferred]

2. **Expose the unpriced remainder beside the headline estimate.** Section 9 correctly excludes unresolved writer/update/resume work and requires the pilot to price snapshot and binary loading. Carry “plus unpriced baseline omissions, to reconcile at pilot” into the option-table estimate as well. At October 7, replace the provisional loader row with named outcomes for captured-source loading/cleanup, admission across consumers, option replacement/lowering and writer preservation. Each outcome gets one task owner and one baseline/delta allocation. This is estimate reconciliation, not grounds to remove required safety or preservation behavior. [read, rung 2: draft:203,236,435–444; remote `lib/config-writer.js:56–60,72–126`, `lib/core/runtime-graph.js:972–1004`, `lib/commands/_registry.js:164–194`; inferred]

3. **Reconcile the second-renderer estimate without inventing savings.** Section 6 allows 1–2 days for a compatible renderer and its consumer check; the delta allows 0.5–1 day for the independently authored second renderer plus several refusal/update assertions. Existing fixtures or narrower incremental authoring might explain the difference, but the draft does not allocate them. At the pilot, state which renderer/sample/check is baseline, which is additional, and whether admission/binary/update checks sit in the loader or certification task. Do not automatically add both ranges or assume the smaller one is achievable. [read, rung 2: draft:322,329,437–440; inferred]

4. **Keep the sample ahead of new command support.** The draft names action scaffolding, block-aware lint/origins and existing `forge new`/options owners. Preserve a hand-written runnable sample as the initial authoring path; implement resolver validation and required diagnostics first. Admit a new scaffold/CLI surface only if it serves the locked installed consumer or repeated authoring demand. Current handler injection and review-adapter replay are reuse opportunities, not completed block tooling. [read, rung 2: draft:325; remote `lib/flow/src/skill-runtime.js:60–73,177–205,335–361`, `lib/adapter-cli.js:155–181`; inferred]

## Cost, granularity and value

| Scope | Assessment for 0.1.0 and a solo owner with agents | Cost boundary |
| --- | --- | --- |
| Twelve internal responsibility owners | Useful for assigning narrow work and distinguishing authority, installation and external effects. They need not occupy twelve implementation lanes or directories. | Keep the 1–2-day mapping ceiling and selective checks; defer taxonomy work that adds no promised consumer or safety boundary. [read: draft:173–192; inferred] |
| Selected public Contracts/Flow/Memory/Kernel/config/templates operations | Worth retaining because independent capability use is an explicit product outcome. New Kernel/config/template support is less mature than the three existing source cohorts. | Baseline assembly/resolver work, plus actual export/assets/errors/lifetime and installed-consumer proof. Freeze only promised operations; avoid broad internal export. [read: final plan:45–48,103–104; draft:349–362; remote boundary test:13–23,132–183; inferred] |
| One receipt action with compatible replacement | Enough to prove executable local customization and substitution within an established contract. Renderer demand itself remains unmeasured. | Required admission, source capture, input/outcome preservation and actual consumer proof are part of this seam. No grant database, sandbox, lifecycle host or package installer. [read: draft:128–154,267–290,310–334; inferred] |
| Genuinely new capability | The contract is intentionally insufficient for arbitrary manifest-only execution. That ceiling avoids accepting an unsupported lifetime or authority model. | Select a new host contract/adapter when demanded; the draft's 3–7-day scenario is unmeasured and excludes large integration owners. [read: draft:310–334; inferred] |
| All twelve extracted/public or a fine registry | Poor first-release trade: enlarges caller/provider compatibility, migration and integration ownership before demonstrated demand. | Separately scoped program and forecast. The 3–6/6–12-week alternative ranges establish no measured relative price. [read: draft:194–207,381; inferred] |

The source supports evolution through existing seams: the structural test defines Contracts, Memory and Flow cohorts with entry-only dependencies; Memory's registry prevents replacing/removing its local floor and invokes synchronous enrichment; SkillRuntime accepts injected handlers and resolves declared dependencies. This is a stronger starting point than inventing a service registry, but it is not proof of twelve independent modules or YAML-selected external loading. [read, rung 2: `test/structural/product-package-boundaries.test.js:13–23,132–183`; `lib/memory-core/src/backend-registry.js:85–171`; `lib/flow/src/skill-runtime.js:60–73,177–205,335–361`; inferred]

The current package is `forge-workflow` beta.8, declares Node >=24 and has no `main` or `exports` fields. Its fixed graph resolver applies known rail/workflow/adapter/role/planning settings. Its config writer directly serializes to the destination file. Those inspected implementations justify keeping exports, real composition and validated preservation in the missing-work ledger; they do not show the proposed atomic writer, admission or snapshots working. [read, rung 2: complete remote `package.json`; `lib/core/runtime-graph.js:972–1004`; `lib/config-writer.js:56–60,72–126`]

The safety-driven snapshot does not make the architecture a general plugin host. It is nevertheless more work than “call a supplied renderer”: capture allowed bytes, bind affirmative admission to source/purpose/composition, import the captured CommonJS entry in each promised artifact and clean the owned files. Keep those guarantees if the loaded-source identity promise is retained. The economical move is to prove and price that bounded path early, not substitute a hash followed by a mutable project-path import or add a framework to solve it. [read: draft:128–136,142,437–444; inferred]

## Effort and effect on the final plan

| Item | What can be concluded now |
| --- | --- |
| Four priced marginal rows | `0.5–1 + 1–2 + 1–2 + 0.5–1 = 3–6` engineering days. Arithmetic is correct; authoring/verification throughput is unknown. [ran: arithmetic; read: draft:435–440] |
| Unpriced reconciliation | Writer/update/resume omissions and actual captured-source/binary feasibility can increase total effort. The priced subtotal is not an upper bound. [read: draft:439–444; inferred] |
| Lead review/integration | `4/1.5` to `8/1.5` = **2.7–5.3 review allocations**. Using all three illustrative owner hours instead gives **1.3–2.7 owner days**, displacing coordination and decisions. [ran: arithmetic; read: final plan:191; inferred] |
| Critical-path effect | Some authoring can overlap; shared contract/config/package ownership, owner review and native/operator access can serialize it. Do not add worker-days and review-days mechanically, or divide the delta by agent count to obtain elapsed days. [read: final plan:191,202–208,214–215; draft:446–448; inferred] |
| Certification | Add action/substitution/refusal assertions to the existing applicable lanes. Reusing a case avoids a second certification program; it does not make execution/operator time free or permit dropping applicable pairs. [read: draft:418,438,442,463; final plan:142–159; inferred] |

**October 1–5:** lock the selected operations, closed action/admission contract and legacy-config/update dispositions. Treat the twelve-owner map as coordination, not another architecture research project. **October 7:** replace the partial delta with actual owned baseline-plus-delta tasks, measured prototype effort and reserved owner/operator time. The clean binary/captured-source/admission path is especially valuable here: the current canonical binary command registry uses static manifest loading, while adapter replay's local `require` is source-pattern evidence. Neither inspection proves external snapshot loading in the compiled artifact. [read, rung 2: draft:444,456–457; `lib/commands/_registry.js:164–194`; `lib/adapter-cli.js:155–181`; inferred]

**October 14:** require the installed vertical slice before retaining the stretch window; inspect actual coupled integration, review and access demand. **October 28–November 11:** retain only if measured capacity absorbs the confirmed baseline, delta and required proof. Adding five weekdays to the endpoints gives **November 4–18**, as the draft says. This sensitivity is valid calendar arithmetic, not evidence that five days will suffice. Loader/writer omissions, unavailable operators or a candidate correction may move the date further; a corrected candidate requires the final plan's fresh qualifying observation window. [ran: weekday calculation; read: draft:458–463; final plan:206–221; inferred]

There is no supported precise revised release date yet. The draft's honest result is a reforecast obligation, with 0.2 third-party admission and selected 1.0 stabilization demand-led and undated. Its additional 8–12-week 1.0 allowance remains an unpriced scenario. More agents can author disjoint slices; they cannot supply the solo owner's review/approval time or the permitted native/harness operators. [read: draft:446–461; final plan:191,214–215; inferred]

## 4. Scores

| Criterion | Score (1–5) | Reason |
| --- | ---: | --- |
| Achievability | **3** | Bounded evolution, but loader/writer effort, binary feasibility and owner/operator capacity remain unmeasured. |
| Value | **4** | Independent consumers and genuine local composition serve the requested target; generic framework spending is deferred. |
| Clarity | **4** | Scope/status/extensibility ceilings are explicit; the option price table and renderer allocations still need normalization. |
| Risk handling | **4** | Admission, preservation and reforecasting are specified; their implementation and full campaign remain future proof. |
| Alignment with owner constraints | **5** | One package, sole authority, intact gates, capped ownership work and narrow agent lanes fit the stated constraints. |

Scores are **[inferred] judgments**, not measurements or release certification.

## Independent checks and limits

- **Repository:** fetched and pinned `origin/master`; independently inspected the complete root package manifest, structural cohorts, fixed resolver, sparse writer, Flow handler/executor seams, Memory registry and delegated authority. The executor's synchronous-provider refusal is specific to that executor; it is not proof that every Flow handler is synchronous. [ran: fetch/ref reads; read: paths above and `lib/flow/src/executor.js:217–254`, `lib/memory-core/src/authority-provider.js:37–59`]
- **Prior work:** gathered the harness, skeleton-pivot, product-restructure, template and roadmap groups listed in `blocks-common.md`; checked relevant scope passages and local L2 transformations. The refinement establishes independently usable primitives, and the harness research warns against making every module a plugin or optimizing agent count. Neither establishes a first-release registry requirement. [read, rung 2: `runtime-building-blocks-refinement.md:4–47`; harness `research.md:533–570`; local `research/L2-architecture.md:225–236`]
- **GitHub:** read-only Forge-routed `gh pr view` returned the [one-package fold](https://github.com/harshanandak/forge/pull/601) as **MERGED**, with merge commit **(ba56b9201782c4d1246c77bde6380867603184bf)** and merge time September 29, 2026; the [parked release plan](https://github.com/harshanandak/forge/pull/564) remains **OPEN**, with no merge timestamp. These current record checks support the landed-package/proposed-plan distinction; they do not prove release completeness. [ran, rung 4: `node bin/forge.js github run -- gh pr view ... --json ...`, with the specified session identity]
- **Not run:** installed npm/binary action execution, snapshot races/cleanup, validated writer behavior, live harnesses, release CI/80-pair campaign or the capacity pilot. Numerical effort remains inferred. Only this evaluation file is written; no implementation, commits, pushes, GitHub writes or Kernel mutations are authorized.

## Open questions for the owner

**A — retain staged scope (default):** capped twelve-owner map, selected public operations, one experimental receipt contract and its required admission; reconcile partial effort and reserve lead/operator capacity at October 7/14.

**B — propose a narrower extension increment:** explicitly defer optional-handler replacement or new scaffolding at scope lock, while retaining the adopted independent-consumer/local-extension outcomes and all applicable safety proof; reprice the actual saving.

**C — broaden before release:** separately resource all-public extraction, general provider hosting or published-package admission and replace the stretch scenario.

**Default: A.** Silence retains the planning recommendation; it grants no implementation or publication authority. [inferred]

## Confidence

**Medium overall:** high in the inspected scope exclusions and current source/PR distinctions; medium in the ownership/value judgment; low in engineering-day and release-date estimates until the installed loader/writer slice and actual owner/operator capacity are measured. No cost/scope blocker is established for the staged default. [read/ran as above; inferred]

BLOCKING: 0
