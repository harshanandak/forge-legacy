## Bottom line

1. **Decisions needed:** close the graph scheduling/coordination contract before implementation fan-out; **default A** is the bounded wrapper correction described below. [inferred]
2. **Verdict: NEEDS-REVISION** — v3 closes the five round-two design gaps, but its advertised 32-node composition ceiling is not reconciled with SkillRuntime's cumulative coordination-output limit. [read: D:288,389–395; ran: Probe B]
3. A real current-runtime probe passes 15 chained nodes and refuses 16 or 32 before calling any handler, even with an opaque payload ID and empty handler evidence. [ran: Probe B]
4. Separating large domain values is necessary but insufficient: graph metadata, dependency closure, skipped entries and cumulative observations have their own budget. [read: S2:101–139,262–288; inferred]
5. The author-facing contract is now small and concrete: one bundled synchronous handler, declarative schemas, explicit bindings and one service-call/result convention. [read: D:99–184]
6. The literal advisor's empty, populated and maximum-length 100-change/100-note examples passed a narrow schema/handler consistency probe; the Memory `/notes` schemas agree after local-ref resolution. [ran: Probe A]
7. Schema identity, structured pointers, layer tombstones/reset, SecretRef-only values and diagnostic repairs are explainable; schema-copy friction and the executable CLI handoff still merit explicit quickstart fixtures. [read: D:269–371; inferred]
8. All twelve owner defaults now state evidence, rejected alternatives and reconsideration conditions; the prior missing-reasoning blocker is closed at the document level. [read: D:975–1007]
9. First- or second-try outside authoring remains **unproven**: these public exports/compiler/wrapper are proposals, and neither an installed cold-author trial nor native harness campaign ran in this review. [read: D:18,101,856–878; ran: V1]
10. Keep the existing gates, public-docs-only attempt accounting and withheld-task proof; correct the integration boundary rather than expanding the contract or inventing a new runtime. [read: N:25–35; D:876–878; inferred]

## Scope and evidence

**Lens:** could an agent, given only the described public docs and APIs, build a new block and working config in one or two attempts? This evaluates the proposed contract and its implementation path, not an implemented platform's usability. The owner north star takes precedence over conflicting historical product framing. Only this evaluation file is written. [read: N; C; critic.md]

Evidence labels: **[read]** = inspected artifact/source, rung 2; **[ran]** = the stated command or narrow code probe, rung 4 for that behavior only; **[inferred]** = design judgment or implication. Live GitHub object readback establishes that object's state, not platform conformance. No safety or installed-authoring claim is promoted from source inspection to execution proof.

| Key | Independently checked basis |
| --- | --- |
| **D** | [platform-plan-v3.md](../platform-plan-v3.md), all sections inspected; SHA-256 `d98e91683036a3c2f7a5d52c8c707650326c34a06542affe6b3614259b574b51`. Line references below address this draft. |
| **N** | [north-star.md](../../north-star.md): public block/config/catalog surface, agent-generated validated composition and public-docs-only outside-author release proof. |
| **C** | `(local scratch)`, read in full, then `(local scratch)`, read in full. Their one-file/read-only restrictions govern this review. |
| **V1** | `git fetch -q origin master`, `git rev-parse origin/master` and a separate `git ls-remote origin refs/heads/master` agreed on `7d448ec812ef8639790477af07c3c75962173f8a`. Local HEAD remains `ba56b9201782c4d1246c77bde6380867603184bf`; local source was not substituted. Node probe runtime: `v24.18.0`. |
| **S1** | Full remote `package.json` parsed from `git show origin/master:package.json`: version `0.1.0-beta.8`, Node `>=24.0.0`, and no declared `main`, `exports` or `types` keys. This supports the draft's distinction between source indexes and future supported installed subpaths. |
| **S2** | [Remote SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L3): limits/clone 3–49; preparation 94–142; awaited handlers 177–205; cumulative output 253–288; limit ceiling 296–306; dependency resolution 335–361. The complete module was loaded directly from the remote blob for Probe B. |
| **S3** | [Remote Memory registry](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/backend-registry.js#L113): 113–154 returns `{value,receipt}` and retains local-floor/degraded observations. [Remote router](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory/router.js#L264): 264–283 maps `entry.key/value` to `id/note`; 418–451 performs migration before recall and exposes capped selection metadata. |
| **S4** | [Remote runtime graph](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972): 972–996 clones its fixed graph and applies known config sections. [Remote schema generator](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/contracts/src/schema.js#L10): 10–14 selects predefined contracts; it is not proof of arbitrary outside-author schema support. |
| **V2** | Fresh Forge-routed `gh pr view 601` returned [the module fold](https://github.com/harshanandak/forge/pull/601) MERGED, merge commit `ba56b9201782c4d1246c77bde6380867603184bf`; `gh pr view 564` returned [the release-plan PR](https://github.com/harshanandak/forge/pull/564) OPEN, head `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`. These agree with the relevant draft status claims. No GitHub write occurred. |
| **Prior critique** | [round2-agent-buildability.md](round2-agent-buildability.md): five blocking issues at lines 45–112, checked against v3 rather than automatically carried forward. |

No installed proposed author package, config compiler, admission path, Memory public projection, connected progress adapter or native harness was exercised. Source and literal-example checks cannot answer the actual cold-agent success rate. [ran: probes below; inferred]

## Blocking issues

### 1. The 32-node public graph contract still lacks a feasible coordination/scheduling boundary

**Claim/section.** Section 3.3 permits **32 executable DAG nodes** and 256 edges. Section 3.4's new wrapper passes an opaque payload ID and compact metadata through SkillRuntime, preserving every existing coordination ceiling; the workstreams and proof reuse that runtime for generic composition. [read: D:288,375,389–395,795]

**What's wrong.** Moving domain input/output into the host map fixes the old payload-size mismatch, but does not fix SkillRuntime's graph-size mismatch. Its preflight constructs an entry for every node in the required dependency closure, puts those entries in both `invoked` and `evidence`, includes skipped metadata, then validates that entire envelope against the unchanged 128-structural-node ceiling. Refusal occurs before any handler can replace domain values with IDs or compact its own evidence. The final result also duplicates cumulative entries. [read: S2:101–139,262–288]

**Concrete bad case.** A valid 16-node chain with no capability requirements, no domain arrays, one short payload ID and handlers returning only `{status:"PASS",evidence:[]}` returns `INCOMPLETE / BOUNDED_OUTPUT_EXCEEDED`, with **zero handler calls**. A 32-node chain behaves identically. One, 14 and 15 nodes pass. Thus an agent can satisfy the published count, schemas and ordering rules and still encounter a hidden refusal unrelated to its block. [ran: Probe B]

This is not evidence that the future compiler must fail. It is evidence that the described domain-map bridge leaves a second integration decision unresolved. V3 says compact coordination must fit, but does not specify whether SkillRuntime receives the whole graph, a bounded batch, or one executable cell, who retains/enforces cross-cell dependencies, or how full-run observations/resume avoid rebuilding the same oversized envelope. The example's two-node graph does not expose this gap. [read: D:391–395,717–729; inferred]

**Specific fix.** Extend the existing generic wrapper contract to distinguish the **public logical graph** from the **bounded SkillRuntime invocation unit**. Prefer a host binder that checks the compiled graph's dependencies and invokes one admitted node, or a proven bounded batch, with only that unit's metadata and compact verified dependency/result references. Specify ownership of run/node identities, refusal propagation, dependency evidence, connected Kernel progress and resume; full graph history must not be copied into each coordination response. A per-node request against unchanged whole-chain metadata is insufficient because dependency resolution still pulls the chain. [read: S2:106,335–361; inferred]

Add packed-path acceptance for a 32-node chain, fan-out/fan-in and the admitted edge ceiling, including realistic compact observation fields, failure halfway through, stale/foreign dependency references, connected resume and cleanup. The public validator/explain must expose any remaining coordination restriction before activation. Keep the current ceilings and truthful FAIL/INCOMPLETE behavior. [inferred]

**Reasoning and alternatives.** Existing single-node SkillRuntime calls already pass; an isolated control achieved 32/32 separate one-node PASS results. That makes an explicit wrapper scheduling boundary the smallest evidenced direction, although it does **not** prove the future host binder or aggregation. Raising the runtime ceilings contradicts the plan's preserved-limits decision and avoids the underlying cumulative-envelope design. A new scheduler/runtime duplicates existing machinery. Narrowing the supported graph contract is a legitimate alternative only with explicit coordinated schema/docs/catalog/proof changes; “15 nodes” is not automatically a safe universal bound once evidence and skipped metadata vary. [ran: Probe B; read: S2; inferred]

**What changes the answer.** A normative lowering/observation contract plus the actual packed 32-node campaign resolves this blocker. Alternatively, a deliberately smaller, fully reconciled public contract with early actionable rejection resolves it. A two-node advisor pass or a successful standalone handler does not. [inferred]

**Why blocking.** The plan advertises a supported composition envelope without a specified feasible reuse path for its coordination evidence. Implementers otherwise have to invent that boundary, and outside agents discover an undocumented runtime ceiling after config acceptance. This is the same kind of public-schema/runtime mismatch that v3 correctly made explicit for domain payloads. [read: D:389–397; ran: Probe B; inferred]

## Non-blocking improvements

1. **Make exact-schema reuse mechanical in the quickstart.** The identity-only rule is deliberate and sound as a conservative acceptance rule, but an array consumer with `maxItems:200` still rejects a producer with `maxItems:100`, even when every actual value would fit. Differing defaults or array order in schema assertions can also create unequal canonical digests. Show scaffold output that embeds the selected catalog's resolved schema, and one valid-looking unequal-schema repair, using the existing schema/scaffold surface. **Reasoning:** D:297–301 already supplies the stable refusal and permitted repairs, and Probe A confirms the exact advisor match; copying this known shape is smaller than adding an implication engine. Reject silent coercion or speculative widening. **Change trigger:** the manual/cold tasks need useful widening that exact reuse or a named projection cannot reasonably express; then price a bounded rule and proof explicitly. [read: D:273,297–301,313; ran: Probe A; inferred]

2. **Freeze one executable local-source journey, including descriptor handoff.** The CLI sketch discovers a descriptor, then validates a solution, while discovery explicitly does not mutate a global catalog. The library sketch explicitly takes `document, catalog`; the CLI sketch does not show that handoff or a complete local-source config, and its solution example selects the packaged variant. At contract lock, turn the existing proposed sequence into one installed-consumer fixture that starts from an empty directory, passes the discovered catalog to validation, applies a lock, obtains correctly scoped admission and invokes the local block. Show the separate package transition with its new identity/admission. **Reasoning:** D:305–330,354 and 715–735 establish all the intended stages, so the remaining task is joining their public inputs, not adding another registry. Reject hidden global registration or implicit installation. **Change trigger:** the generated public CLI help already makes this exact fixture executable; then no additional API is needed. [read: D:305–330,354,715–735; inferred]

3. **Make the schema profile's documentation escape route explicit.** Author schemas refuse *all* keywords outside the allowlist, which excludes common annotation keywords such as `title`, `description` and `examples`. An agent using an ordinary schema generator can therefore receive a schema-discovery refusal before reaching its actual block. Document the intended descriptor/doc-reference location for those annotations, and add a repair fixture for a generated schema containing them; do not casually widen the validator. **Reasoning:** D:91,259,273 promises generated docs while imposing a deliberately small profile. Moving explanatory text to the already-described documentation surface preserves the runtime subset; silently ignoring unknown keywords makes the advertised contract dishonest, and adding a broad generator dependency is unnecessary. **Change trigger:** measured cold-author failures show these harmless annotations materially harm success; consider a precisely named bounded annotation allowance with matching types/docs/corpus. [read: D:91,259,273; inferred]

4. **Define who the withheld task is withheld from.** Keep the existing two-candidate counting rule and manual-config arms. State that at least one cold task is held out from quickstart/scaffold tuning and that its code/config are not solved in the public example; validate an unseen composition through the same contract. **Reasoning:** D:868–878 already freezes tasks before documentation tuning and names a withheld task, but does not identify its visibility boundary. A held-out novel composition tests transfer beyond copying this advisor; a broad statistical benchmark is unnecessary for the bounded release claim, while the disclosed sample alone overfits the docs. **Change trigger:** the frozen campaign ledger already records that separation and the task's assertions; then retain it without expanding the campaign. [read: D:868–878; inferred]

## Agent journey and concrete failure points

| Step / failure | Can an agent determine the outcome from v3? | Assessment |
| --- | --- | --- |
| Discover versus execute | Yes: metadata-only discovery, preview without imports, explicit admission/readiness states. | Clear separation; installed public implementation still required. [read: D:95,120–122,254–258,305–330] |
| Write a new block | Yes: exact CJS export, synchronous domain return, wrapper-owned evidence, throw/Promise refusal. | Small supported ABI. It deliberately does not contain ambient effects or hangs. [read: D:103–118,379] |
| Bind and call an existing service | Yes: requirement slot/interface/operations/effects, exact instance binding, `services.lookup.invoke`, OK/INCOMPLETE results and refusal precedence. | Round-two service ambiguity is closed. Missing, async or unauthorized providers are typed refusals. [read: D:126–184] |
| Match Memory output | Yes: public two-field projection, empty success, 100/101 lookahead, explicit incompleteness and preserved internal provenance. | Round-two producer mismatch is closed in the proposed contract; current router cannot be exposed unchanged because it migrates before reading. [read: D:207–246; S3] |
| Generate config and repair it | Yes at design level: typed subset, pointers, explicit `after`, full-schema identity, closed fields, concrete origin/repair record. | Unsupported ordinary schema annotations and non-identical schema copies are predictable friction, addressed by improvements 1/3. [read: D:269–303,334–352] |
| Override config | Yes: four layers, map/scalar/array behavior, remove tombstones, reset reveals lower value, provider replacement clears stale options. | No expression language or inheritance solver to learn. [read: D:261–276,356–371] |
| Handle secrets | Yes: only a symbolic SecretRef at a marked schema location; no plaintext union or preview lookup. | Missing-secret readiness must be redacted, not repaired by copying credentials into config. [read: D:276,303] |
| Submit large but valid domain input | The proposed 2 MiB/map path is explicit. | Literal maximum example fits these domain ceilings; current naive SkillRuntime input reuse does not. Actual bridge proof remains required. [read: D:389–395; ran: Probe A] |
| Submit a larger valid DAG | **No complete scheduling/evidence lowering contract.** | The blocker: 16/32-node dependency closures fail current coordination preflight despite tiny domain references. [ran: Probe B] |
| Run without human integration rescue | The passing standard is explicit, with trust supplied as an environment prerequisite and candidate-specific checks counting toward two attempts. | Sound measurement design; success remains unknown until the installed public-docs-only trial and native transcripts exist. [read: D:858–878] |

## Verification probes

### Probe A — literal example consistency, not platform conformance

Executed the draft's exact `dist/advisor.cjs` body in a transient Node VM. Parsed its complete input/output JSON schemas and checked the assertions those fixtures use: object/array/string shape, required/closed fields, maximum counts and Unicode-code-point string lengths. Checked local-ref-resolved Memory `/properties/notes` against the advisor's corresponding schema using sorted-object canonical JSON. No proposed compiler or arbitrary-schema validator was substituted by this probe. [ran]

| Input case | Input UTF-8 bytes | Input structural nodes | Findings | Output UTF-8 bytes | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Empty changes/notes | 25 | 3 | 0 | 15 | PASS |
| One frozen change/note | 129 | 9 | 1 | 84 | PASS; expected message matched |
| 100 changes and 100 notes, all fields at their schema maximum using four-byte Unicode characters | 1,364,923 | 603 | 100 | 563,114 | PASS |

The Memory `/notes` and advisor `/notes` resolved schemas matched. The largest fixture fits the advertised 2 MiB/16,384-node **domain** ceilings; this says nothing about the future processing-budget implementation, packed domain map, full composition or harness path. [ran; read: D:286,393; inferred]

### Probe B — exact remote SkillRuntime, independent graph-size control

Loaded the complete `origin/master:lib/flow/src/skill-runtime.js` blob into a transient VM. Built a chain of `node-0` … `node-(n-1)` using `dependsOn`; requested the final node with `inputs:{payloadId:"p"}`. Every registered handler incremented a counter and returned `{status:"PASS",evidence:[]}`. No runtime limit override, private-state patch or filesystem write was used. [ran]

| Required chain nodes | Handler calls | Result | Error |
| ---: | ---: | --- | --- |
| 1 | 1 | PASS | none |
| 14 | 14 | PASS | none |
| 15 | 15 | PASS | none |
| 16 | 0 | INCOMPLETE | BOUNDED_OUTPUT_EXCEEDED |
| 32 | 0 | INCOMPLETE | BOUNDED_OUTPUT_EXCEEDED |

A separate control created 32 independent runtimes, each with exactly one metadata node and one request; all 32 passed. This isolates a possible bounded invocation unit, **not** an implemented logical-graph scheduler, connected resume mechanism or public evidence aggregator. The failing preflight is visible in S2:125–139 before `_invokeNode`; therefore it is independent of domain payload length and user handler logic. [ran; read: S2]

## Scores (1–5)

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | **3** | Reusable handler/resource owners and a bounded source profile are credible, but one graph/runtime bridge remains unspecified and the installed/cold/native campaigns have not run. The draft itself keeps dates provisional. [read: D:118,793–805,892–910; ran: Probe B; inferred] |
| Value | **5** | Public outside authoring, actual callable reuse and config composition directly test the owner platform promise rather than merely exposing internal files. [read: N:7–13,27–35; D:858–860; inferred] |
| Clarity | **4** | Concrete ABI, schemas, layer algebra, errors and attempt accounting are much stronger; the invocation-unit boundary and first CLI catalog handoff still require precision. [read: D:103,269–354,876–878; ran: Probe B; inferred] |
| Risk handling | **4** | Admission, raw-privilege limits, safe preview, refused mappings and public/domain validation are explicit; cumulative coordination evidence is the missed resource dimension. [read: D:105–122,281–303,389–395; ran: Probe B; inferred] |
| Alignment with owner constraints | **5** | Outside blocks/config/harness connectivity are first-class; one package, Kernel authority, intact gates, no core UI and staged cloud/marketplace seams are preserved. [read: N; D:6–13,409–424,755–779; inferred] |

## Reasoning check

**All twelve section-10 defaults have a stated reasoning trace.** The table at D:994–1005 pairs each default with inspected constraints/uncertainty, rejected B/C alternatives and a condition that would change it. Consequently there is **no missing-default-reasoning blocker** in v3. Those rows are planning arguments, not experimental proof that the chosen profiles, dates or staffing are sufficient. [read: D:988–1007]

| Prior round-two blocker | V3 disposition |
| --- | --- |
| Service-client contract absent | Closed in design: normative requirement/binding/invoke/results/refusal rules and bound-call trial. [read: D:126–184] |
| Memory producer schema incomplete | Closed in design: full public schemas, native projection, overflow/incompleteness/refusal behavior; literal schema match independently checked. [read: D:207–246; ran: Probe A] |
| Domain bounds exceed reused runtime | Domain decision now explicit: host map, compact coordination IDs, cleanup/resume and packed 100-item proof. Graph coordination remains the distinct new blocker. [read: D:389–397; ran: Probe B] |
| Unbounded schema implication | Closed in design: bounded acyclic subset, exact canonical rooted identity, NOT_PROVED refusal and explicit repair. [read: D:273,281–303] |
| Defaults lack evidence/alternatives/reconsideration | Closed at the document level for all twelve defaults. [read: D:994–1007] |

Each recommendation in this review states its evidence, alternatives and reconsideration condition. Improvements 1–4 refine already-planned public guides/corpora; they do not propose new frameworks, broader effect profiles or extra benchmark machinery. The graph correction is a compatibility decision before fan-out, not authorization to implement. [inferred]

## Open questions for the owner

**A — Specify the bounded wrapper invocation unit; keep the 32-node public graph.** Preserve SkillRuntime ceilings; make logical dependency checking, compact observations and connected progress/resume explicit; require the complete packed graph-size corpus. **Default: A.**

**B — Deliberately narrow supported graph scope.** Freeze a demonstrably safe composition/coordination contract, early diagnostics and matching schema/docs/catalog/proof changes; do not infer a universal 15-node limit from this empty-evidence control.

**C — Fund a broader runtime redesign.** Reprice compatibility, resource accounting, connected progress and the owner forecast before replacing the existing runtime.

**Reasoning for the default:** Probe B shows the existing runtime works at a bounded invocation unit and fails when the entire dependency closure accumulates. A makes the already-planned generic binder's responsibility explicit and retains the north-star composition promise. B reduces expressiveness and alters advertised support; it is preferable only if a real outside pilot cannot support the larger graph economically. C has no measured need while the one-node primitive works and would add a larger implementation surface. Change the default if an actual packed pilot shows unacceptable dependency/evidence/resume complexity or measured overhead; then choose explicit B or funded C, rather than changing limits or accepting hidden failures. [read: N; D:288,375–397; ran: Probe B; inferred]

**Valid replies:** A, B or C; silence selects **A as the review recommendation**, not implementation permission.

## Confidence

**High** in the exact-source graph failure, literal example/schema consistency, round-two closure audit and complete twelve-default reasoning check: each was inspected or narrowly executed. **Medium** that the bounded wrapper is the smallest complete fix: separate one-node controls pass, but dependency/evidence aggregation and connected resume still need a specified contract and packed proof. **Low** in actual first/second-try agent success or sustained staffing/calendar: no proposed installed platform or cold/native campaign ran. No claim of runtime safety, cancellation, full compiler conformance or live platform usability follows from these probes.

BLOCKING: 1
