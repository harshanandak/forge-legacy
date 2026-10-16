## Bottom line

1. **Decisions needed:** revise the five contract/reasoning gaps below before implementation fan-out; **default A** is a targeted v3, retaining the existing proof bar. [inferred]
2. **Verdict: NEEDS-REVISION** — v2 fixes the original author ABI and attempt-count gaps, but an agent still has to guess service bindings and producer contracts, and the documented payload bounds need an explicit runtime bridge. [read: D:92–111,138,653–655; inferred]
3. The CommonJS export, handler arguments, domain return, exception/Promise refusal and host-owned evidence translation are now concrete and appropriately small. [read: D:94–98,448–463]
4. JSON Pointer references, explicit ordering, four layers, tombstones/defaults/null and a bounded schema dialect make config substantially more explainable. [read: D:153–171]
5. The remaining injected-service seam has neither a concrete requirement/binding example nor a normative callable client shape; the advisor declares no requirements and cannot test that seam. [read: D:85,96,111,373,488–507; inferred]
6. Required bounded `notes: Note[]` does not prove assignability to the advisor's closed, length-bounded note schema; the public Memory projection must define those constraints. [read: D:138,404–415,510; inferred]
7. A schema-shaped 100-change input runs through the literal advisor but is rejected before invocation by current SkillRuntime; simply increasing its limit is also refused. This is a current-source probe, not a failure of an implemented platform compiler. [ran: Probe A]
8. The cold-author gate now counts rejected partial submissions, permits only two candidates, includes a withheld task and separates host trust from author assistance; keep these improvements. [read: D:653–655]
9. The owner-required reasoning trace remains incomplete for decision defaults such as four layers, the optional experiment budget and backup-first cloud/hosting. A list of alternatives is insufficient. [read: D:750,753,756; inferred]
10. The smallest revision is precise public contracts, a payload/receipt boundary decision, and justified defaults; no new framework, general expression engine or weakened gate is needed. Public-docs-only success remains unmeasured. [read: D:22; inferred]

## Scope and evidence

**Lens:** can an agent given only the described public docs and APIs build a new block and a working config on its first or second submitted candidate? This evaluates the plan's proposed supported surface and acceptance design. An API being unimplemented today is not itself a blocker. The north star overrides conflicting product framing in common.md. [read: N:7–18,27–32; D:18]

**Snapshot:** fetched `origin/master` on 2026-09-30 and read source from that tracked remote ref, which resolved to `7d448ec812ef8639790477af07c3c75962173f8a`. Worktree HEAD remained `ba56b9201782c4d1246c77bde6380867603184bf`. Draft SHA-256: `1c263f06c77eba05cb2cca9bb1df531741dc72e51fdaaf744c302aa3f3a9a2a7`, 763 lines. [ran: fetch, rev-parse, draft hash/line-count]

| Key | Directly inspected evidence |
| --- | --- |
| **D** | [platform-plan-v2.md](../platform-plan-v2.md) (line 1), read in full. Line references below address this local planning artifact. |
| **N** | [north-star.md](../../north-star.md) (line 7), read in full. |
| **Brief** | common.md (local scratch, not in repo) and critic.md (local scratch, not in repo), read in full; only this evaluation may be written. |
| **S1** | [Remote package.json](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/package.json#L1): parsed the complete tracked file. `main`, `exports` and `types` are absent; `engines.node` is `>=24.0.0`. This confirms proposed installed entries/types still need work, as D already admits. |
| **S2** | [Remote SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L3): structural/byte limits 3–49; invocation preparation 116–142; handler bridge 177–205; result validation 230–259; non-increasable ceilings 296–306. |
| **S3** | [Remote Memory registry](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/backend-registry.js#L45): synchronous methods 45–50; local/enrichment handling 73–82; operation result `{value,receipt}` 113–154. Also inspected Memory index exports 319–331. |
| **S4** | [Remote resolver](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972): starts from the fixed graph and applies known config sections, 972–996. D explicitly plans its replacement/extension; this is not a new blocker. |
| **S5** | [Remote Contracts validator](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/contracts/src/validate.js#L326): named-envelope payload dispatch and structural validation, 326–354. D:171 correctly distinguishes it from arbitrary author-schema validation. |
| **G1** | Forge-routed read-only `gh pr view 601 --repo harshanandak/forge --json number,title,state,mergedAt,mergeCommit,headRefOid` returned MERGED, merge commit `ba56b9201782c4d1246c77bde6380867603184bf`, merged 2026-09-29. [PR: module fold](https://github.com/harshanandak/forge/pull/601). This corroborates the one-package foundation; it does not certify public installed subpaths. |

`[read]` is source/document inspection, rung 2. `[ran]` identifies an executed command/probe, rung 4 only for the stated behavior. `[inferred]` identifies critique, proposed fixes and scores. No installed candidate, new compiler, native harness or cold-author trial was executed. Relevant prior-round findings and P2 were consulted for orientation; findings here were checked against D and the remote source rather than inherited as facts.

## What round two actually resolves

| Prior failure point | v2 disposition | Remaining limitation |
| --- | --- | --- |
| Undefined author export/call/return ABI | **Resolved in the plan:** explicit `operations` export, `{input,config,services}`, synchronous domain data and host translation. | Injected clients are still underspecified; see blocker 1. [read: D:94–98] |
| Undefined reference grammar and config semantics | **Substantially resolved:** solution input schema, JSON Pointer, explicit `after`, omission/null/default/reset rules and keyword allowlist. | Producer schema coverage and runtime payload limits still matter; see blockers 2–3. [read: D:163–171,465–507] |
| Unlimited block-authoring attempts disguised by config benchmark | **Resolved in the plan:** rejected partial components count; two candidate identities total; withheld cold task; separate repair corpus. | Success has not been measured; retaining these gates is the right next test. [read: D:643–655; inferred] |
| Internal envelope validation presented as general JSON Schema support | **Resolved as a claim:** v2 explicitly separates the validators. | General validation/types/docs are implementation obligations, not completed functionality. [read: D:165,171; S5] |

## Blocking issues

### 1. The supported injected-service contract is still impossible to implement from the described public surface alone

**Claim/section.** Manifest requirements name compatible slots; config binds them to exact instances. The handler receives capability clients under those slot names, and the smallest supported profile includes host-injected services. Default outside support includes selected built-in service clients. [read: D:85,96,111,746]

**Failure point.** Neither the normative ABI nor the complete example specifies the wire shape of one nonempty `requires` entry, the corresponding instance binding, or the client's call/result/error convention. An agent cannot choose reliably between `services.lookup.recall(input)`, `services.lookup.invoke(operation,input)` and a callable slot. It also cannot know whether an otherwise compatible client is synchronous: returning/awaiting a Promise conflicts with the supported action profile. These choices affect author code, schema generation and compiler lowering, rather than just host internals. [read: D:85–111,163–196; inferred]

The advisor avoids the question with `requires: []`; Memory data arrives through a graph edge. The outside-author and substitution tests mention slots/providers but do not explicitly require a cold author to declare and invoke an injected slot. Reading the complete draft and case-insensitive searches for `requires`, `slots`, `services`, `bindings` and `invoke` found the prose promises, empty requirement example and opaque explain bindings. This is a bounded finding about the draft, not a claim that no possible client exists in the repository. [read: D:373,488–507,635–655]

**Specific fix.** Before freezing this as supported, publish one complete requirement → instance binding → client invocation example. Define the callable shape, schema-valid domain result, unavailable/error behavior, execution mode and effect authorization. A small generic `services[slot].invoke(operationId,input)` is one possible contract; reuse owning clients behind it. Require the cold-author corpus to exercise a real slot, incompatible/absent/async binding refusal and restart substitution. Public catalog rows must expose the same execution-mode and operation schemas. [inferred]

**Reasoning.** The evidence is the explicit service promise coupled to an empty-slot demonstrator. Reusing owning clients behind one public call avoids exporting internal driver APIs. Alternatives considered: graph-only data composition is simpler and already works as the advisor's design, but selecting it requires explicitly revising direct-service support; shipping arbitrary existing client objects leaves authors dependent on private knowledge. **What changes the answer:** a supplied normative public client/binding schema with a passing cold slot-author trial, or an explicit supported-profile decision to stage direct service injection while retaining graph composition and applicable proof. [read: D:96,111,136,373; inferred]

**Why blocking.** As written, supported reusable-service authoring can diverge across scaffold, compiler, runtime and harness owners while the first/second-try proof passes a block that never uses it. [inferred]

### 2. The complete example asserts static assignability without specifying the producer's full contract

**Claim/section.** `memory.recall@1.0` returns required bounded `notes: Note[]`; D:510 says that makes `/notes` statically assignable to the advisor. [read: D:138,510]

**Failure point.** The advisor requires each note to contain `sourceId` and `text`, with respective length ceilings 200/2000, no additional properties and at most 100 items. Requiredness of `notes` alone proves none of those constraints. A bounded producer with 101 items, optional `text`, a longer `sourceId`, or an extra provenance field is consistent with D:138's shorthand but fails the consumer schema. This is a concrete type-boundary gap, even though runtime validation would appropriately refuse the result. [read: D:404–415; inferred]

**Source check.** Current Memory registry methods return `{value,receipt}`, not the proposed public `{notes}` row; `value` and enrichment are not this proposed closed Note projection. Probe B confirmed the empty successful result shape. v2 already proposes owning clients/adapters, so this existing mismatch alone is not a blocker. The blocker is the unsupported *static-assignability claim* and incomplete public producer schema needed to generate the example. [read: S3:73–82,113–154; ran: Probe B; inferred]

**Specific fix.** Put the complete proposed recall input/output schema in the same contract-lock example, including the Note definition, bounds and additional-property rule. Specify how the public client projects stored notes/receipt provenance without changing durable records, and how over-limit/unrepresentable results fail or are explicitly selected/paged. Include populated, empty, too-many, overlong and extra-field producer/consumer cases; empty recall alone cannot establish compatibility. Do not silently discard data to obtain a passing schema. [inferred]

**Reasoning.** A named, schema-generated public projection reuses Memory and lets an agent check an edge without knowing storage internals. Alternatives considered: binding raw current registry results exposes a different contract; weakening the advisor's closed schema merely to pass hides the missing producer agreement; a general mapping/expression language is unnecessary for one public projection. **What changes the answer:** the full catalog schema and adapter corpus prove the exact edge, or a documented explicit projection node replaces the direct `/notes` mapping. [read: D:138,166,404–415,504,510; S3; inferred]

**Why blocking.** The promised complete example is the main public-docs-only teaching path. It currently asserts compatibility that its specified producer contract does not establish. [inferred]

### 3. Public action payload bounds are not reconciled with the reused Flow runtime's smaller coordination envelope

**Claim/section.** The solution/advisor permit 100 changes and 100 notes, and the generic wrapper is to bind into/reuse SkillRuntime. Successful complete semantic validation and harmless execution are part of the 30/30 bar. [read: D:96,393,406,479,572,649]

**Executed bad case.** Probe A used 100 `{api:"a",change:"b"}` changes and `notes: []`, satisfying the explicit relevant domain-schema constraints. The literal advisor returned 100 findings. The exact remote SkillRuntime, with valid metadata and an internal handler returning `{status:"PASS",evidence:[]}`, returned `INCOMPLETE / BOUNDED_INPUT_EXCEEDED` before calling that handler. A one-change control passed. Configuring `maxNodes:400` returned `INVALID_LIMITS`. [ran: Probe A]

Current limits are 8,192 bytes, depth 8 and 128 structural nodes; `_prepareInvocation` clones the whole request input before invocation, and limits cannot be increased past those ceilings. One hundred small change objects already exceed the structural count, without approaching the example's string maxima. [read: S2:3–49,116–142,296–306; ran: Probe A]

**Specific fix.** Make the payload/coordination decision explicit at contract lock. Prefer using the already-planned generic wrapper to keep schema-bounded domain input/output separate from SkillRuntime's bounded coordination/evidence envelope, preserving existing ceilings. Publish the domain transport limits and validation/refusal diagnostics, and prove the complete 100-change example through the actual wrapper, not just the standalone handler. If payloads instead must traverse `request.inputs`, narrow and document the supported domain bounds and expose the same checks through the public validator before invocation. No limit bypass is an acceptable fix. [inferred]

**Reasoning.** v2 already separates domain returns from host-owned evidence; preserving that separation for transport prevents public domain schemas from accidentally inheriting a hidden receipt budget. Alternatives considered: simply raising limits is refused by current code and is not a contract decision; stuffing domain results into evidence increases the wrong envelope; reducing advertised bounds is viable only if all public schemas/docs/tasks are reconciled explicitly. **What changes the answer:** the proposed wrapper demonstrates its separate, bounded domain path on this case and publishes that contract, or the supported schemas/profile are deliberately narrowed with actionable validation. [read: D:96,171,225; S2; inferred]

**Why blocking.** An author can produce schema-valid code/input and still miss the execution bar for an undocumented integration reason. This is not proof that a future wrapper must fail; it proves that unspecified naive reuse is insufficient and needs a named implementation/proof obligation. [inferred]

### 4. Full schema-to-schema assignability is promised without a bounded compatibility rule

**Claim/section.** The author dialect permits local `$ref`, object/array schemas, enum/const, numeric limits, string patterns/formats and other constraints; compile-time mapping checks prove source types assignable to their target. [read: D:165–166]

**Failure point.** It is unclear whether “assignable” means only JSON type/requiredness or inclusion of the allowed value sets. Both producer and consumer can be arrays of objects yet disagree on maximum count, closed fields or string lengths, as blocker 2 demonstrates. Conversely, an unconstrained string producer bound to a consumer with a restrictive `pattern` cannot be guaranteed safe just because both are strings. Local `$ref` can also be recursive; the described allowlist supplies no reference-cycle/depth or compatibility-analysis boundary. An author cannot predict whether a mapping is rejected conservatively, accepted for runtime checking, or falsely presented as statically proved. [read: D:165–171; inferred]

**Specific fix.** Publish a deliberately small compatibility table/algorithm. Prefer exact canonical referenced schema identity for the initial supported direct binding, plus a finite documented set of safe structural widening rules if the demonstrators need them. Define how `$ref` is resolved and bounded. For constraints outside that analysis, return a typed “compatibility not proved” diagnostic with a concrete remedy, such as an explicit named projection/validation operation; distinguish this from execution's actual-value validation. Add compatible/incompatible bounds, extra fields, enum, pattern and recursive-ref cases to the contract-lock corpus. [inferred]

**Reasoning.** Exact schema identity and a small explicit rule set are cheap to explain and test; public consumers can reuse catalog schema references rather than invent equivalent schemas. Alternatives considered: a general schema implication engine adds complexity unrelated to the first two demonstrators; type-only checking silently overstates proof; automatically allowing every uncertain edge moves all repairs into execution. **What changes the answer:** the contract publishes a bounded, tested compatibility algorithm with clear UNKNOWN/refusal behavior, or it narrows the supported schemas/mapping guarantee accordingly. This is separate from blocker 2: a complete Memory schema fixes one example, whereas this rule governs every author-defined producer/consumer edge. [read: N:29–30; D:165–171; inferred]

**Why blocking.** The compiler, generated explanations and authors otherwise use different meanings of “typed mapping,” making config acceptance unpredictable precisely at the platform's public composition boundary. [inferred]

### 5. Some owner decision defaults still lack the required evidence–alternatives–reconsideration trace

**Claim/section.** All twelve owner choices default to A. The critic explicitly makes an unexplained decision default blocking. [read: D:746–759; Brief/critic:12]

**Concrete gaps.** The following defaults have detailed surrounding architecture, but no closed reasoning trace supporting the actual choice:

| Default | Evidence available | Missing justification |
| --- | --- | --- |
| Four config layers | Layer syntax is specified; team/user precedence is reserved. [read: D:153–167,753] | Why four layers outperform template/project-only for the two release demonstrators; what observed need justifies the extra authoring surface or later team/user layers. |
| Two worker-days/four owner-hours for optional experiments | Source/CI risks and illustrative staffing are described; configured gates remain intact. [read: D:569,671–679,750] | Why this particular budget is valuable compared with deferral; the result/effort threshold that warrants expansion. |
| Backup-first cloud plus an experimental hosted UI/backend profile in 0.2 | The north star requires cloud and hosted solutions in the target architecture; staging and isolation are described. [read: N:15–18,31; D:295–299,341–345,756] | Evidence ranking this sequence against shared team authority or later hosting; a demand/access/capacity trigger that changes the default. |

Some other defaults have stronger supporting explanations: for example, D:659–665 connects exact-byte publication to receipt invalidation and states what an alternative equivalence policy must establish. The finding is not that every decision is unsupported. [read; inferred]

**Specific fix.** Give each owner default a compact adjacent trace: cited evidence/constraint; why the selected option wins; why each offered alternative loses *now*; and the observation/owner requirement that would change it. Label judgment-based budgets/staging as judgments and do not manufacture measurements. This can be a decision table rather than another architecture chapter. [inferred]

**Reasoning.** The owner has explicitly required this, and already supplied alternatives make the missing comparison inexpensive to write. Alternatives considered: scattered architecture citations explain mechanisms but do not resolve preference; dropping all defaults makes the report less actionable; reopening the settled platform definition contradicts the north star. **What changes the answer:** every default gets the trace, or the owner explicitly changes the reasoning requirement. [read: Brief/critic:12; N:27–32; inferred]

**Why blocking.** The owner cannot assess the proposed operating cost and complexity without the reasoning that the brief requires for approval. This is one systematic decision-quality issue, not twelve separately counted blockers. [inferred]

## Non-blocking improvements

1. **Make the first author journey executable in order.** The example first describes the new advisor ID, then scaffolds it, while independent package installation and source registration prerequisites are prose elsewhere. Show existing-capability discovery → scaffold/new local manifest → data-only discovery of that manifest → validate/explain → separately authorized lock/admission/conformance, including one fixture and one actual structured repair response. Preserve the existing trust-purpose separation. **Reasoning:** D:173–196 and 510 already contain the required operations; joining their prerequisites is smaller than adding an auto-installer or an opaque one-button command. Those alternatives increase effects or hide the contract. **Change trigger:** a fresh installed quickstart already demonstrates this exact ordering without unpublished steps. [read: D:173–196,510–512; inferred]

2. **Explain secret-reference typing at both boundaries.** Say whether a marked config location's public wire type is a `SecretRef` object, and what the handler/bound client receives. Prefer preserving references through config/explain and resolving credentials only at the authorized owning edge, with generated types and negative cases matching that policy. **Reasoning:** D:96 promises schema-valid config while D:168 introduces `{"$secret":"NAME"}`; the two type views need agreement. An unconstrained string/object union sacrifices useful validation; printing/resolving credentials during compilation violates the stated boundary. **Change trigger:** a frozen schema/type/runtime corpus already specifies marked/unmarked refs, missing-secret readiness and redacted failure behavior. This is a contract-lock clarification, not a proved secret leak. [read: D:86,96,148–149,168,171; inferred]

3. **Keep the teaching path smaller than the architecture inventory.** Present manifest/one handler/one direct composition/public conformance first; make reference-workflow, hosted/quota, UI-plugin and transfer catalogs separate linked guides. Keep their required contracts and release proofs. **Reasoning:** D:84–109 separates several necessary version axes, while D:276–345 adds legitimate future seams; a cold author should not have to learn all of them to write one supported sync action. One universal author guide overburdens the first task; deleting the seams violates the north star. **Change trigger:** cold-author intervention/elapsed-effort evidence shows the generated index already makes the minimal path unambiguous. [read: N:29–32; D:84–109,151,173,276–345,655; inferred]

## Scores (1–5)

These assess the written proposal through this lens, not measured runtime quality. [inferred]

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | **3** | Real reusable foundations and a narrow sync profile help; service/schema/payload integration still has unresolved public semantics. Dates and cold-agent outcomes remain unmeasured. [read: D:669–681; S2–S5] |
| Value | **5** | Outside-author reuse and configuration as the public product directly serve the owner definition. [read: N:9–12,28–32] |
| Clarity | **3** | The literal handler, pointer/layer examples and candidate-count rules are a major improvement; service clients and mapping compatibility remain guesswork. [read: D:94–98,165–171,653–655] |
| Risk handling | **4** | Explicit trust, no-import preview, host-owned evidence, purpose separation and immutable release proof are strong; payload/compatibility mismatches need earlier refusal. [read: D:88,98,113–115,149,637,659–665] |
| Alignment with owner constraints | **4** | One package, open outside authors, no core UI, Kernel authority and intact gates are preserved; decision reasoning and demonstrated agent-buildability are not yet complete. [read: N:20–32; D:12,245–254,649–655,746–759] |

## Executed probes and practical limits

**Probe A — runtime budget boundary.** Loaded exact remote SkillRuntime source into a transient Node CommonJS module. Independently evaluated the draft's literal advisor handler. Asserted: one-change internal invocation PASS; literal advisor returns 100 findings; 100-change internal invocation returns `BOUNDED_INPUT_EXCEEDED`; its handler is not called; `maxNodes:400` returns `INVALID_LIMITS`. No repository imports were substituted for remote source and no probe file was written. [ran]

**Probe B — Memory result boundary.** Loaded the exact remote registry source with a synthetic synchronous local backend returning `[]`. Asserted successful recall returns keys `value,receipt`, array-valued `value`, receipt status `ok`, and no `notes` property. This proves the current registry convention, not the future public recall projection or persistent Memory behavior. [ran]

Runnable reproduction of the key current-runtime assertion, using the inspected immutable source:

```powershell
@'
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const Module = require("node:module");
const root = ".";
const ref = "7d448ec812ef8639790477af07c3c75962173f8a";
const source = execFileSync("git", ["-C", root, "show",
  ref + ":lib/flow/src/skill-runtime.js"], { encoding: "utf8" });
const loaded = new Module("budget-probe");
loaded._compile(source, "budget-probe.cjs");
const { SkillRuntime } = loaded.exports;
let calls = 0;
const metadata = { id: "probe", nodes: [
  { id: "assess", inputKeys: ["changes", "notes"] }
] };
const handlers = { assess() { calls++; return { status: "PASS", evidence: [] }; } };
(async () => {
  const runtime = new SkillRuntime({ metadata, handlers });
  const result = await runtime.invoke({ nodes: ["assess"], inputs: {
    changes: Array.from({ length: 100 }, () => ({ api: "a", change: "b" })),
    notes: []
  } });
  assert.equal(result.error.code, "BOUNDED_INPUT_EXCEEDED");
  assert.equal(calls, 0);
  console.log("Current runtime rejects the documented 100-change shape before invocation.");
})().catch(error => { console.error(error.message); process.exitCode = 1; });
'@ | node
```

This deliberately bypasses no runtime guard. It calls current internal source to test the proposed reuse assumption, not to demonstrate a supported installed public import. The proposed generic wrapper, author-schema validator, native adapters and first/second-candidate trial remain unexecuted. [ran; read: D:18,22]

## Reasoning check

The five blocker fixes and three improvements each identify evidence, alternatives rejected and a reconsideration condition above. The draft itself passes the original ABI/attempt-count reasoning concerns but fails the owner-default reasoning check in blocker 5. Expected scores and architecture judgments are explicitly inferences; none is promoted to installed/live proof. [read: Brief/critic:12; inferred]

## Open questions for the owner

**A — targeted revision before fan-out.** Keep the supported platform promise and proof bars; lock the client/binding and bounded mapping contracts, specify the full recall projection and domain/coordination boundary, and attach reasoning to every decision default. **Default: A.** Evidence is the concrete public-contract gaps and current-runtime probe. It is less work than a larger schema engine or broader execution profile, and it repairs the teaching path without hiding failed cases. [read: D:570–573; ran: Probe A; inferred]

**B — explicitly stage direct injected-service authoring.** Keep public DAG composition and the complete data-input action contract, but revise all support/catalog/default claims about outside callable service slots consistently. This reduces contract size if graph composition satisfies the two demonstrators. It still requires blockers 2–5 to be resolved and retains every applicable gate. **Rejected as the default** because v2 currently promises service clients; selecting B is an explicit scope decision, not an unnoticed simplification. [read: D:96,111,373,746; inferred]

**C — accept v2 as exploration only.** Allow contract experiments, with unresolved supported semantics identified as unsettled; do not approve fan-out based on a frozen author contract or claim public-docs-only buildability. **Rejected as the default** because the cheapest ambiguities are already identifiable and separable from implementation discovery. [read: D:570,582; inferred]

**What changes the default:** a complete public contract/corpus plus cold-author evidence closes the gaps, or the owner deliberately chooses graph-only outside authoring because callable reuse is unnecessary for the release demonstrators. **Valid reply:** A, B or C; silence means the planning recommendation A, not implementation authorization. [inferred]

## Confidence

**High** in the v2 ABI/attempt-count improvements, cited service/producer omissions and current-runtime/registry probe results. **Medium** that the proposed minimal contract/boundary fixes are sufficient: compiler and installed consumer trials must test them. **Low** in actual first/second-try success, cross-harness results and schedule, because none was exercised here. One evaluation file is the only authorized write; no issue/GitHub mutations, commits, pushes, dependency installs or implementation edits are part of this critique. [read; ran; inferred]

BLOCKING: 5
