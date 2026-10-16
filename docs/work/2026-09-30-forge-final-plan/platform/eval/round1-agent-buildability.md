# Bottom line
1. **Verdict: NEEDS-REVISION** — the platform direction is sound, but the public author/config contract and acceptance test leave essential agent-buildability decisions unresolved. [inferred]
2. An agent cannot determine the complete supported handler call and return contract from the described example; reusing SkillRuntime introduces a concrete domain-result/evidence translation boundary. [read: D:269,354; S2:177–205,230–253]
3. The solution example uses argument/output references without defining their type environment or reference grammar; “schema-checked” is a requirement rather than a specified behavior. [read: D:284–297; inferred]
4. The existing Contracts validator validates named Forge envelopes; it is not the general author-supplied JSON Schema validator the new surface needs. [read: S3:326–354]
5. Applying the example YAML to the exact remote resolver returns zero errors while leaving actions and phases unchanged; parsing and validation must be distinguished from successful binding. The draft already recognizes this gap. [ran: probe below; read: D:121,353]
6. Four layers and explicit bindings are a reasonable small starting point; the missing wire syntax, default/null rules and schema compatibility policy should be fixed before the contract lock. [read: D:132–138,352; inferred]
7. The cold-author proof prohibits maintainer rescue, but places no bound on block-authoring attempts; 30/30 first-submit configs do not establish first-or-second-try block-and-config success. [read: D:414–426; inferred]
8. Preserve one package, startup-only trusted actions, manual installation, the pure compiler and explicit admission; this review does not justify another runtime, dependency solver or sandbox program. [read: D:58,87–96,121–129; inferred]
9. Fix three contract/acceptance gaps; keep the remaining simplicity recommendations non-blocking and retain every existing mandatory gate. [inferred]
10. **Decisions needed:** whether to add these contract-lock and bounded-author acceptance requirements; default A is to revise before implementation fan-out. No platform usability result was measured here. [inferred]

## Evidence and scope

**Lens:** can an agent given only the described public docs/APIs build a new block and a working config on the first or second try? This is a critique of the proposed contract and proof, not a demand that unimplemented APIs already work. The draft explicitly identifies its APIs as proposed (D:18,317). Planned implementation gaps alone are not counted as blockers. [read]

- **D:** [platform-plan-v1.md](/docs/work/2026-09-30-forge-final-plan/platform/platform-plan-v1.md:1), all 528 lines read; SHA-256 `0fac295cc39790b53f1f68239ee034b176c29a37299c58ea6055fec87a8776c6`. Local planning input, not a remote implementation claim. [read/ran]
- **N:** [north-star.md](/docs/work/2026-09-30-forge-final-plan/north-star.md:27), especially lines 28–32: outside authors in the design, typed/generated/validated config, actionable errors and public-docs-only composition proof. N overrides conflicting framing in common.md. [read]
- **S1:** [remote package.json](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/package.json): package/bin, Node floor, package entry/type declarations and typecheck script. [read]
- **S2:** [remote SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L177): actual handler arguments, awaited invocation and required result shape. [read]
- **S3:** [remote Contracts index](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/contracts/index.js#L17) and [validator](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/contracts/src/validate.js#L326): available functions and named-envelope validation. [read]
- **S4:** [remote resolver](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972), [config writer](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/config-writer.js#L43) and [new dispatcher](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/commands/new.js#L3): known-section resolution, sparse writes and review-adapter scaffolding. [read]
- Selected supporting sections read: [P1](/docs/work/2026-09-30-forge-final-plan/platform/P1-platform-external.md:140), lines 140–166, and [P2](/docs/work/2026-09-30-forge-final-plan/platform/P2-gap-reframe.md:147), composition gaps and outside-author journey. Their historical/external results are not treated as fresh experiments. [read]

**Fresh source/GitHub checks.** `git fetch -q origin master` and `git rev-parse origin/master` returned the draft's pinned source (`7d448ec812ef8639790477af07c3c75962173f8a`). Through the prescribed Forge GitHub launcher, `gh api repos/harshanandak/forge/commits/master` returned the same SHA. `gh pr view 601` returned MERGED, merge commit `ba56b9201782c4d1246c77bde6380867603184bf`, at `2026-09-29T18:54:30Z`. Thus the existing one-package fold is retained rather than priced as unfinished work. These reads establish source/PR state, not installed platform conformance. [ran: `node bin/forge.js github run -- gh ...`; [PR 601](https://github.com/harshanandak/forge/pull/601)]

**Executed probe.** A Node VM evaluated the full `origin/master:lib/core/runtime-graph.js` source, with only filesystem reads replaced by the draft's literal section 3.11 YAML and the installed YAML parser retained. Assertions passed: YAML parses; resolver errors are empty; resolved actions equal default actions; resolved phases equal default phases. The advisor is not bound into executable actions. The JSON manifest also parses. This is rung 4 for the current resolver under injected config reads; it does not run the proposed compiler, new block, installed package or native harness. No persistent probe files were created. [ran]

## Blocking issues

### 1. The outside-author ABI stops before the runtime boundary

**Claim/section.** Section 3.11 says the implementation is “one synchronous exported assess handler” and the host validates its inputs/outputs (D:269). Sections 3.4 and 6 say to reuse SkillRuntime and bind the generic operation into it (D:146,354). The public contract table identifies operations and schemas, but not the exact exported symbol shape, call arguments or result/error translation (D:82–89). [read]

**What is wrong.** An author can reasonably write `exports.assess = input => ({ findings: [...] })`. It is unclear whether `input` is the declared operation input, `{inputs, context, dependencyEvidence}`, or an object also containing config and bound services. It is equally unclear whether the return is the declared domain output or a Flow status/evidence envelope. These are externally observable contract choices, not private implementation details. [inferred]

**Concrete failure.** Existing SkillRuntime passes `{nodeId, inputs, context, dependencyEvidence}`, awaits the handler, then requires a plain result with an accepted `status` and an `evidence` array. A plain `{findings: [...]}` passed directly to this path yields `INVALID_EVIDENCE`; its declared domain schema is not enough. Conversely, making outside authors return raw Flow evidence would contradict the proposed separation between advisory output and host-owned execution evidence. The draft does not explicitly require the adapter that settles this translation to be part of author conformance. [read: S2:177–205,230–253; D:269,416; inferred]

**Specific fix.** Add a short normative author ABI to the contract-lock deliverable (D:352): installed import/export path; operation export convention; exact input/config/service arguments; synchronous domain result; exception-to-diagnostic rule; and Promise refusal. Make the generic host wrapper validate domain data and produce the internal Flow status/evidence envelope. The author must never construct protected receipts. Publish one complete handwritten CommonJS block, its input/output schemas and a public conformance invocation; require that example to run unchanged through the wrapper and both selected adapters. Explicitly test ordinary domain output, thrown failure and Promise return. Reuse SkillRuntime behind this boundary. [inferred]

**Why blocking.** Without settling this at contract lock, scaffold, library/runtime and native-adapter owners can implement different author contracts. First-try success then depends on undocumented integration knowledge, and the supported action contract cannot be approved as described. [inferred]

### 2. “Typed, schema-checked config” lacks the rules necessary to generate and validate it consistently

**Claim/section.** Sections 3.3 and 3.11 promise generated types/docs, complete semantic validation, deterministic merge/reset and schema-checked argument/output mappings (D:121–138,284–297). The example names `query`, `normalizedApiChanges`, `context.notes` and `assess.findings`, but supplies no solution input schema or explicit rule for inferring one. It also does not show the layer operation syntax. [read]

**What is wrong.** The plan leaves three decisions open that must agree across the generated docs, type surface and compiler:

- **Schema support:** selected JSON Schema dialect/keywords, reference resolution, format handling, defaults/coercion and unsupported-keyword refusal.
- **Data references:** argument declarations or deterministic inference; required/optional output fields; reference addressing; compatibility checks versus runtime value checks; and whether references imply dependency edges or require matching `after` edges.
- **Layer operations:** concrete add/replace/remove/reset syntax, omitted versus explicit null, list operations, default materialization order and implementation-option replacement.

These are specifications the proposed contract lock needs to settle, not reasons to add a larger configuration language. [read: D:84–86,132–138,284–297,352–353; inferred]

**Evidence.** Existing Contracts exports validate named Forge contracts. Its payload validator selects `CONTRACTS[value.schema_id]` and checks the corresponding predefined fields; `validateContract` takes a value and evidence options, not an arbitrary author schema plus value. The existing runtime schema describes the graph artifact envelope. Neither function establishes the proposed general author/config validation policy. The draft correctly distinguishes its author manifest from the existing CapabilityManifest (D:104), but must also distinguish the new arbitrary-schema validation work. [read: S3:index:17–31,validate:326–354; S4:runtime-graph:10–39]

**Concrete failures.** An agent maps an optional `/notes` property into a required array and receives a runtime failure after “valid” compile; a field containing a dot is misread by an undocumented dotted-reference parser; a provider reset exposes lower-layer options under an unspecified defaulting order; or an author uses a schema keyword the runtime ignores while generated types/docs imply it is enforced. These are unresolved cases, not reproduced future bugs. The current resolver probe demonstrates the narrower existing failure of valid-looking declarations producing no executable change. [inferred; ran: probe above]

**Specific fix.** Require the contract lock to include one complete solution schema and compact normative rules for these cases, plus a positive/negative corpus shared by schema/type/doc generation and runtime. A declared solution input schema is simple; documented deterministic inference is also acceptable, but choose one. Prefer structured node-plus-JSON-pointer references over inventing another path/expression grammar. Pick a bounded JSON Schema support profile and reject unsupported constructs during metadata discovery. Define static binding checks separately from invocation-time value validation. Include actual patch/reset examples and secret-reference syntax; do not add expression evaluation, automatic provider choice or a second resolver. [inferred]

**Acceptance repair.** For every named invalid mapping/schema/layer case, assert a stable diagnostic with code, pointer, origin, expected constraint and a permitted repair. A config that passes semantic validation must contain an executable binding for every selected required node. Runtime values must still be checked. Unknown declarations cannot be silently normalized away. This strengthens the existing D:353 gate without weakening legacy protections. [inferred]

**Why blocking.** This schema is the product surface under N:29. Different plausible interpretations change actual composition and make generated config unreliable; “generate docs later” cannot settle the semantics those docs need to explain. Resolve these decisions before parallel implementations freeze incompatible behavior. [read: N:29; inferred]

### 3. The release proof can pass without proving first-or-second-try block authoring or useful error repair

**Claim/section.** Section 7.3 requires a cold author, public docs only and no human integration rescue (D:414–418). Section 7.4 requires 30/30 first-submitted valid configs and ten forbidden/unsatisfiable prompts (D:422–426). [read]

**What is wrong.** The bounded first-submit criterion covers config output, while the block-author journey has no attempt ceiling. An author could spend many iterations learning the ABI and eventually pass the outside-author case. The refusal corpus checks rejection, but does not require an agent to turn an actionable diagnostic into a working second attempt. Recording repair counts does not supply a passing limit. [read: D:416,422–426; inferred]

**Concrete false positive.** A cold agent needs many block/conformance iterations, then emits a config scaffold that passes first submission; all forbidden prompts produce typed errors. This satisfies the stated benchmark and eventual outside-author success while failing the assigned first-or-second-try end-to-end question. It also permits terse typed refusals that identify a problem but do not help the agent repair it. [inferred]

**Specific fix.** Keep the existing 30/30 first-submit config gate intact. Add a distinct bounded outside-author gate: before the trial freeze docs, candidate, task brief and fixture assertions; allow at most two submitted block-and-config candidates, with public validator/conformance feedback between them; require the final useful output through the public generic path and then unchanged native Codex/Cursor execution. Define what counts as an attempt, including rejected typed-builder/conformance submissions, and capture exploratory API calls and elapsed effort separately. Scaffold generation is allowed; maintainer implementation or undocumented/private API use fails the trial. Host-supplied explicit trust remains an allowed environmental prerequisite, not author implementation assistance. [inferred]

Add repairable unknown-field, version-mismatch and bad-output-mapping cases: first rejection identifies the exact path/constraint and an allowed repair; the agent makes that repair through public APIs and the second candidate produces the expected output. Keep genuinely forbidden authority/effect requests as refusals, not successful repairs. Use at least one new author task withheld from documentation tuning, with identities frozen before the final trial. Failures revise the public contract/docs and receive a new recorded trial; preserve initial failures rather than rerunning them into a success claim. [inferred]

**Why blocking.** The existing acceptance wording can certify the narrower config metric while missing the end-to-end usability property the owner needs to decide. The remedy adds proof; it removes no gate and claims no universal agent success rate. [inferred]

## Non-blocking improvements

1. **Keep the first author path smaller than the platform internals.** Put config, one operation's domain schemas, one synchronous handler and one check in the first quickstart. Explain Kernel progress, receipts, hosted grants, event replay and compatibility promotion when that solution uses them. The broader seams stay in the architecture. [read: D:80–117,184–239; inferred]
2. **Avoid redundant validation wiring.** The advisor declares a `validation` requirement, but the host already promises schema validation. Either remove that explicit author binding for ordinary host validation, or show the useful validation service call that makes it necessary. Required dependencies should correspond to real author needs. [read: D:262,269,281; inferred]
3. **Make discovery-to-run a documented sequence.** Show exact proposed CLI/library calls and structured returns for discover, scaffold, validate/explain, separately authorized lock apply, admission and native invocation. Explain that readiness can be UNKNOWN until explicit probing; a dry-run must not promise code trust or actual host availability. [read: D:125–129,297; inferred]
4. **Give version axes a small example table.** Distinguish Forge package version, public contract version, block artifact version, manifest/solution schema and capability interface version. Explain why the example's Forge contract range can differ from the 0.1.0 package version. Make license/repository/support metadata optional for a local author where appropriate and mandatory for publication. [read: D:80,84,89,247–265; inferred]
5. **State the graph's deliberate expressive ceiling.** Show one conditional/fallback or bounded iterative reference-workflow case using existing public operations/templates, and distinguish graph edges from loops encapsulated by an operation. Do not add a general expression engine merely to make the example richer. [read: D:134,144,301–313; inferred]
6. **Exercise ordinary editing as well as scaffolding.** A no-scaffold/manual-config arm should use the same public schema and actionable errors. Report separate discovery, structural, semantic, executable and native results; success in one stage cannot supply the next. [read: D:424–426; P1:164–166; inferred]

## Scores (1–5)

These scores assess the proposal under this lens, not measured implementation quality. [inferred]

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 3 | Existing owners and a bounded sync profile make a pilot plausible; arbitrary schema support, ABI translation and actual public author experience still need closure. |
| Value | 5 | Novel outside capabilities, reusable blocks and config as the product surface directly serve the north star. |
| Clarity | 3 | Architecture and staging are clear; the exact author call/data/patch contracts remain unresolved. |
| Risk handling | 4 | Explicit trust, no silent PASS, owned cleanup and installed/native proof are strong; bounded author success and repair efficacy are not yet acceptance requirements. |
| Alignment with owner constraints | 4 | One package, Kernel authority, no core UI, outside authors and additive cloud/marketplace seams are preserved; agent-buildability is specified incompletely. |

## Open questions for the owner

**A — Revise the contract lock and acceptance gates as above.** Require the small normative author/config contract and the separate two-attempt outside-author/repair proof before broader fan-out. **B — Approve direction only and delegate those decisions to the early pilot.** Label agent-buildability unproven and make the same unresolved decisions explicit pilot exit criteria; do not approve the current public surface as complete. **Default: A.** Either option preserves every existing mandatory gate and authorizes no implementation in this research leg. [inferred]

## Confidence

**High** in the cited source/draft boundaries, fresh remote/GitHub state and the narrow resolver probe. **Medium** in predicted outside-author failure points: the proposed ABI/compiler does not exist here to execute, so these are contract and acceptance risks, not observed future defects. **Low** in first-or-second-try success rate, elapsed author effort or native parity until the bounded cold trials run. No installed outside block, native harness journey, cloud or release campaign was exercised. [read/ran/inferred]

BLOCKING: 3
