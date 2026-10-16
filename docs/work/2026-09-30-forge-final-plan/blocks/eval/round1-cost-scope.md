# Round 1 — Cost and scope

## Bottom line

1. **Decisions needed:** retain staged ownership and the bounded local-action scope; do not turn twelve names into twelve release deliverables. **Default: A** in the owner choices below. [inferred]
2. **Verdict: SOUND.** The recommended default earns useful boundaries without requiring a micro-block registry, twelve extractions or third-party admission before 0.1.0. [inferred; read: draft:165–203,318–345]
3. Twelve is defensible as an internal responsibility map for agent assignments; it is not an evidenced optimum for public APIs or an interchangeable-module count. [inferred]
4. The six initial entry categories largely retain the final plan's existing narrow scope; their implementation, consumer proof and compatibility burden are already substantial baseline work. [read: final plan:103–104,293; inferred]
5. The draft explicitly defers the expensive machinery: generic service/version resolution, extension lifecycles, hot replacement, effectful admission and a marketplace. Keep those exclusions. [read: draft:78–80,121,343–345]
6. The receipt renderer is adequate proof of a trusted local action, but does not prove that a new stateful capability or arbitrary block can be added through config alone. [read: draft:266–281; inferred]
7. The stated **3–6 engineering days plus 4–8 lead hours** adds up correctly, but is an unmeasured marginal estimate resting on a large, separately funded resolver/assembly baseline. [ran: arithmetic; read: draft:399–409]
8. At the final plan's illustrative **90 minutes/day for review and landing**, the extra lead work consumes **2.7–5.3 days of that allocation**, unless capacity is explicitly reassigned. More agents do not remove it. [ran: arithmetic; read: final plan:191; inferred]
9. **October 28–November 11 remains conditional; November 4–18 is a valid five-working-day slip sensitivity, not a forecast or an upper bound.** Preserve the October 7/14 reforecasts and final-candidate observation. [read: draft:415–426; inferred]
10. No cost/scope blocker is established for the recommended default; the improvements below tighten promises and estimation without changing package, authority or gate constraints. [inferred]

Evidence notation: **[read] = rung 2**, inspected source or local planning text; **[ran] = rung 4** for the specific command/calculation only; **[external] = rung 2**, checked primary record; **[inferred]** marks a judgment, not implementation proof. `draft` means the local `blocks-plan-v1.md`; `final plan` means the local v2 `plan.md`. Tracked implementation citations refer to refreshed `origin/master` **(7d448ec812ef8639790477af07c3c75962173f8a)**, not the worktree HEAD **(ba56b9201782c4d1246c77bde6380867603184bf)**. [ran: fetch, rev-parse and log]

## 1. Verdict

**SOUND — staged medium ownership is proportionate for 0.1.0 and a solo owner with agents, because the draft limits actual public commitments and executable admission rather than making the whole taxonomy a prerequisite.** [inferred]

The favorable judgment applies to the recommended default, including its explicit estimation assumptions and reforecast conditions. It does not endorse the alternative all-public/fine-registry programs, establish sustainable capacity, or prove the architecture is implemented. The draft already calls its larger week ranges scenarios and its additional 3–6 days provisional; uncertainty alone is not a blocking error under the critic brief. [read: draft:194–203,405–426,461]

## 2. Blocking issues

**None established through this lens.** I found no requirement in the recommended default to extract all twelve owners, publish every internal helper, build a general registry, replace Kernel authority, weaken gates or hold the date despite failed capacity/access checks. Those exclusions are stated positively in the relevant scope and staging sections. [read, rung 2: draft:78–80,170–182,203,320–345,409–426]

## 3. Non-blocking improvements

1. **Make the twelve-owner map explicitly a coordination aid, with a small cost ceiling.** The current count is a reasonable grouping, not a result derived from the import graph. Source enforcement currently identifies three blocks and allowed entry dependencies; it does not establish twelve interchangeable owners. Preserve useful responsibility assignments, but create descriptors/boundary checks only where a promised consumer or risky cross-owner dependency needs them. Do not require a factory, versioned interface or conformance lane for each untouched internal name. This keeps the inventory slice from becoming an extraction program. [read, rung 2: draft:165–184,402; `test/structural/product-package-boundaries.test.js:13–23,132–173`; inferred]

2. **Separate the implemented local-action schema from the future contract vocabulary.** The full manifest table includes provider requirements, interface negotiation, lifecycles, effects and proof metadata, while the admitted subset hard-binds one receipt dependency and rejects other service/provider forms. Keep a short normative list of supported fields, values and refusal behavior; label future rows design vocabulary that requires a later contract decision. Reuse validators and reject unsupported claims; do not write a home-grown general schema engine or service solver for dormant fields. Ship the small sample before broad scaffolding. [read, rung 2: draft:64–80,295–304; inferred]

3. **State the actual extensibility ceiling next to the “adding a new block” cost.** The initial ABI is specifically `renderReceipt(receipt, options)`; the wrapper gets receipt dependency evidence and no arbitrary inputs/context. It proves another implementation of that action contract, local selection and composition. It does not establish cheap admission of an unrelated capability, an async Memory provider or a stateful service. Narrow the 1–2-day estimate to a compatible receipt action or an already-supported synchronous provider in an embedding host. A genuinely new capability needs a host contract/integration decision and its own estimate. Add a second materially different extension when demanded, before advertising general block extensibility; it need not block 0.1.0. [read, rung 2: draft:266–281,289–310; `lib/flow/src/skill-runtime.js:177–205,335–361`; inferred]

4. **Treat startup-only replacement as an explicit increment, not free reuse.** Addition already proves the final plan's local named-node extension. Replacement additionally preserves identity, dependencies, receipt input and protected obligations while swapping a compatible handler. That is sensible bounded design, but the present SkillRuntime supplies handler injection and dependency resolution, not the proposed config replacement transaction. Keep replacement if a real second renderer or user need warrants it; otherwise propose deferring that feature at scope lock while retaining addition and all applicable protection tests. Do not silently remove an adopted promise. [read, rung 2: final plan:104; draft:266–279,382,404; `lib/flow/src/skill-runtime.js:60–73,335–361`; inferred]

5. **Name support status and consumers for each public entry before freezing compatibility.** Six entry categories are already close to the final plan's default, so this is not six newly added products. Nevertheless, Contracts/Flow/Memory source indexes have a different maturity from the proposed Kernel service and config/template APIs. For each promised entry, record one installed consumer, supported operations, error/lifetime contract and experimental/stable status. The package currently has no `main`/`exports`, and a documented `forge-workflow/lib/context-merge` deep import exists. The draft correctly requires a compatibility inventory before restrictive exports; preserve that work rather than assuming an exports map is a cheap isolated edit. [read, rung 2: complete `package.json`; `docs/guides/ENHANCED_ONBOARDING.md:448–457`; draft:301,329,381; final plan:103,293; inferred]

6. **Replace the marginal estimate with one baseline-plus-delta task ledger at the pilot.** The 0.5–1 + 1–2 + 1–2 + 0.5–1 rows correctly total 3–6 days. But final-plan work package “Two compositions and one resolver” already funds M–L/high-risk execution and config behavior; it does not give measured capacity or an itemized loader/binary allocation. Conversely, the delta explicitly adds module loading and evidence lowering. Assign each acceptance item once, show what is reused versus missing, and distinguish authoring, owner review, artifact verification and elapsed wait. The adapter's local `require` proves a source pattern, not compiled-artifact support: its path is fixture replay, while the command registry's canonical binary path uses static loaders. Run the binary/local-import slice early to decide whether the stated delta holds. [ran, rung 4: arithmetic; read, rung 2: draft:399–409; final plan:104,202; `lib/adapter-cli.js:155–181`; `lib/commands/_registry.js:164–194`; inferred]

7. **Resource-load the lead hours separately from worker-days.** The final plan's illustrative three-hour owner day allocates only ninety minutes to review/landing, with the rest assigned to coordination and decisions. Four to eight additional review/integration hours therefore occupy 2.7–5.3 such allocations; using all three hours would be 1.3–2.7 days and displace other necessary work. Integrating config, package resources and contract changes can serialize even disjoint agent implementations. Reserve those hours and name what they displace before retaining the original stretch dates. This is a reason to cap simultaneous work, not to relax certification. [ran, rung 4: `4/1.5`, `8/1.5`, `4/3`, `8/3`; read, rung 2: final plan:191,208,214; draft:411–426; inferred]

## Cost, value and release effect

| Scope | Judgment for this owner | Cost treatment |
| --- | --- | --- |
| Twelve internal responsibility names | Useful for narrow agent ownership and distinguishing policy, installation and remote effects; number alone adds no user capability. | Bounded mapping and selected checks; no per-name runtime/API program. [inferred] |
| Six initial entry categories, two starters, one resolver | Worth doing: preserves the requested independently usable blocks and actual user extension rather than shipping only fixed CLI behavior. | Existing substantial v2 assembly/config/artifact work, plus the explicitly identified block delta. [read: final plan:103–104,292–293; inferred] |
| One trusted local receipt action | Enough to prove an executable local extension without stateful lifecycle or remote effects. Demand for the renderer itself is not established. | Keep the closed ABI, useful sample and real installed execution/refusal proof. Do not credit it as general plugin readiness. [read: draft:78–113,291–301; inferred] |
| All twelve public/extracted | Poor first-release trade: creates compatibility and consumer obligations across immature integration owners. | Separate scope and resource-loaded forecast; the draft's 3–6-week scenario is not measured throughput. [read: draft:200; inferred] |
| Micro-block registry/reactive host | No demonstrated 0.1.0 requirement justifies it over existing factories, handlers and provider seams. | Defer; the draft's 6–12-week scenario should not become a roadmap promise. [read: draft:184–201,345; inferred] |

**Dates:** use October 7 to reconcile baseline/delta effort, review capacity and actual binary/local-import feasibility; use October 14 to demand the installed vertical slice before keeping the stretch window. A five-working-day delay shifts October 28/November 11 to November 4/18. It is neither inevitable nor a worst case: serialized review, unavailable permitted operators or a corrected final candidate can cost more. The final plan already requires a fresh qualifying observation window after a candidate correction. No architecture simplification permits cutting its 80-pair inventory or required risk strata to save time. [read, rung 2: final plan:142–159,206–221; draft:419–426; inferred calendar sensitivity]

Do not add an independently priced “block certification program.” The draft's cases belong in existing installed-consumer, composition, refusal and artifact lanes. Equally, calling those cases reused does not make their integration and execution free. [read: draft:137–147,397–407; inferred]

## 4. Scores

| Criterion | Score (1–5) | Reason |
| --- | ---: | --- |
| Achievability | **3** | Bounded, credible evolution; owner capacity and external-code/binary assumptions remain unproved. |
| Value | **4** | Reusable core APIs and real composition deliver the target; registry/extraction spending is deferred. |
| Clarity | **4** | Internal targets and public support are distinguished; the general manifest and renderer-specific admission could be separated more sharply. |
| Risk handling | **4** | Preserves authority, artifact proof, restart semantics and reforecasting; costs need actual capacity evidence. |
| Alignment with owner constraints | **4** | One package, one authority and narrow agent lanes fit; additional human review is acknowledged but not yet allocated. |

Scores are **[inferred] judgments**, not measurements or certification.

## Independent checks and limits

- **Remote source:** refreshed `origin/master`; inspected package fields, fixed graph resolution, Flow handler/dependency execution, structural entry rules, adapter module loading and relevant passages in every prior-work group listed in `blocks-common.md`. The refinement and harness archive support independent capability seams and staged provider work; they do not require a registry before standalone Memory/Flow. [ran: fetch/ref reads; read, rung 2: `runtime-building-blocks-refinement.md:24–47`; harness `research.md:533–570`]
- **GitHub, read-only through Forge:** re-fetched the [one-package fold](https://github.com/harshanandak/forge/pull/601), **MERGED**, with merge commit matching the worktree HEAD; the [worktree-root repair](https://github.com/harshanandak/forge/pull/582), **MERGED**, with merge commit matching remote master; and the [parked release plan](https://github.com/harshanandak/forge/pull/564), **OPEN**, with no merge timestamp. These prove the cited record states, not release completeness. [ran: `github run -- gh pr view ... --json ...`; external, rung 2]
- **Planning inputs:** fully read the draft and critic/common briefs; checked the local final plan's scope, assembly/config, certification and capacity sections; consulted L2 and the relevant B2/L3/L4 findings. Research-leg measurements are attributed, not counted as new executed benchmarks. [read, rung 2]
- **No release validation:** no tarball install, compiled local-module execution, live harness, provider lifecycle, full CI campaign or capacity pilot was run. Numeric effort remains inferred. This critique writes only this evaluation; no implementation, issue mutation, commit or publication is authorized.

## Open questions for the owner

**A — retain staged scope (default):** twelve internal owners, six named public entry categories, one experimental receipt-action seam; tighten the support/effort ledger and calibrate at October 7/14.

**B — simplify the first extension:** retain the same required public/composition outcomes, propose deferring optional-handler replacement and broad scaffolding; price the resulting scope explicitly.

**C — require broad blocks before release:** admit all-public extraction or generic provider hosting as new scope, allocate owner/operator capacity and replace the stretch forecast.

**Default: A.** Silence selects that planning recommendation; this critique grants no implementation authority.

## Confidence

**Medium overall.** High in the checked source/PR distinctions and the draft's explicit scope exclusions; medium in the ownership/value judgment; low in engineering-day and calendar estimates until an installed vertical slice and actual owner/operator capacity are measured. The local-action contract is intentionally narrow, and broader extensibility remains a later proof obligation.

BLOCKING: 0
