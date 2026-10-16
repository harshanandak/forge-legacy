# Round 3 revision log — platform-plan-v4

## Bottom line

1. **Decisions needed:** none to complete this revision; v4 retains the twelve owner choices and their defaults as recommendations, not implementation approval.
2. Read common.md, then the overriding north star, then revise.md; retained the synthesis brief's ten sections.
3. **ACCEPTED: all 12 numbered critique occurrences** — two blockers and ten improvement occurrences. **REJECTED: zero.** The graph request occurs in two critiques and is accounted for in both.
4. The pinned current SkillRuntime reproduces the 16/32-node coordination refusal before handlers; separate one-node controls pass.
5. V4 specifies a planned host binder lowering each logical node to an isolated bounded SkillRuntime unit, with dependency, run-guard, progress, resume and refusal ownership.
6. The existing fingerprint helper reaches a whole-file read despite an oversized mocked stat; v4 applies a 1 MiB aggregate observed-byte cap to the complete selected outside captured set, including code.
7. Local catalog handoff, exact-schema reuse, annotation repairs, portable/admission identity and canonical operation grants are explicit.
8. One existing held-out task now tests a non-delivery composition and is sealed from doc/scaffold tuning; trial counts and first-submission standards stay intact.
9. Contract lock has provisional-data and later installed-conformance exits; old-runtime upgrade refusal is named; calendar and capacity remain unproven.
10. Only the requested v4 plan and this log were written; no platform implementation, installed/native certification, issue mutation, commit or push was performed.

## Inputs, precedence and scope

The owner [north star](../../north-star.md) overrides historical fixed-workflow product framing in common.md, prior plan.md and blocks/blocks-plan.md. The revision brief allows exactly two outputs. This is the requested `plan.synthesis` fragment; full planning setup, issue/task creation, implementation and shipping are outside it. V3 remains unchanged. [read]

All required input coverage was completed across the lead and three read-only verification lanes: common/revise/platform-synthesize, north star, complete v3 and all three round-three critiques; P1–P3; prior plan.md and blocks/blocks-plan.md; L1–L5 and B1–B3. Research supplies orientation and attributed historical measurements; current code claims used pinned remote blobs. The north star's author/config/catalog product, reference workflow separation, marketplace, cloud, hosting and separate visualization/BYO-app seams remain intact. [read]

| Input | SHA-256 on revision input read |
| --- | --- |
| north-star.md | `C576D418EA8C846CABA3718AB360B82B575949787AFE4127C467ADC6CC078C67` |
| platform/platform-plan-v3.md | `D98E91683036A3C2F7A5D52C8C707650326C34A06542AFFE6B3614259B574B51` |
| platform/eval/round3-agent-buildability.md | `E4692CF1FA69E77D9CF43FB1E26B3066A323B13527E9021A5C2DD845237A2C16` |
| platform/eval/round3-feasibility-safety.md | `761A1B86840A86FF6AB99C47E1D9E7E1605FFB70879EB1E30CFA3D59F0E3CD8A` |
| platform/eval/round3-platform-fit.md | `F07112906C04E8C148CB370B82226B490A66F86310BF0C6AD3FA15F6A1936D0A` |
| (local scratch) | `7E2AAD8360C11DB8577FFB7961A745BDFF5F67A9587ADFC85A1FA5642A57EB1D` |
| (local scratch) | `E02A4B9898BC5AC24B38DB0D2D2097FAF50422B183F3FE8E2FED1C01F9BBA11C` |
| (local scratch) | `7340C980611176F7233960966814AD915104ED1870BA4434FC313196F4D20C22` |

## Independent verification and its limits

**Current source [ran].** `git rev-parse origin/master` and separate `git ls-remote origin refs/heads/master` agreed on `7d448ec812ef8639790477af07c3c75962173f8a` on October 1. Source inspection used `git show origin/master:<path>`. No local branch was substituted and no ref was changed by this revision.

**Graph probe [ran, rung 4 for the existing primitive].** A verification lane loaded the exact remote `lib/flow/src/skill-runtime.js` in a transient VM. Requested the last node of a `dependsOn` chain with compact `{payloadId:"p"}` input; registered handlers only counted calls and returned `{status:"PASS",evidence:[]}`. No limit override or private-state patch:

| Chain nodes | Handler calls | Result |
| --- | ---: | --- |
| 1 / 14 / 15 | 1 / 14 / 15 | PASS |
| 16 / 32 | 0 / 0 | INCOMPLETE / BOUNDED_OUTPUT_EXCEEDED |
| 32 independent one-node units | 32 total | 32 PASS controls |

The source caps at 8,192 bytes/depth 8/128 structural nodes, expands closure before handlers and duplicates entries into preflight/final `invoked` and `evidence` (`skill-runtime.js:3–4,101–139,253–288,335–361`). The `active` recursion guard is instance-local (`:68,75–95`), and handlers are awaited (`:177–211`). These facts justify explicit host lowering/guard and retained sync checks; they do not prove the future binder, real compact-observation envelope or connected resume. [read; inferred]

**Capture probe [ran, rung 4 for the existing helper's decision].** A separate lane loaded exact remote `lib/forge-lock.js`, replacing only `node:fs` with an in-memory double. Both stat checks reported a 2,147,483,648-byte regular file; `classifySource` still reached exactly one whole-file-read sentinel. No large file was created, allocated or read. Source at `:66–91,116–143` checks containment/regular-file status, then hashes `fs.readFileSync` without a size check. This proves the existing helper's missing pre-read bound, not an OOM or future snapshot-loader exploit. [read; ran]

**Other verification [read].** Exact remote package metadata has no declared main/exports/types; current config and schema paths are fixed/predefined (`runtime-graph.js:972–996`, `contracts/src/schema.js:10–14`). Public author/grant/binder surfaces remain proposed. A broad remote-source search for grant-operation mappings yielded no relevant implementation; that zero-hit is orientation, not proof of absence or a security exploit. Published beta.5/beta.8's older Node floor remains attributed to the critiques' dated registry checks; this revision did not rerun a registry/native-upgrade campaign.

No proposed compiler, installed consumer, outside-author trial, native harness, migration/backup, hosted isolation or observation campaign ran. Design fixes below are **[inferred] contracts**, not runnable or live conformance.

## Agent-buildability critique

Source: [round3-agent-buildability.md](round3-agent-buildability.md).

### Blocking 1 — logical graph versus coordination envelope

**ACCEPTED.** V3 §3.3 advertised 32 nodes/256 edges, while §3.4 only separated domain values. Exact-source replay verifies an additional closure/output refusal even for tiny payloads.

**Changed:** v4 §3.4, line 403, specifies whole-DAG validation and a planned deterministic sequential host binder, fresh one-node units with no logical `dependsOn`, exact dependency-set checks, compact host references, no cumulative history in coordination, Kernel-owned connected progress and verified resume/cleanup. Compile/explain bounds success and all fixed refusal envelopes, including duplicated entries and input/context keys; runtime repeats. A host run/node guard prevents duplicate/reentrant execution; sync-result and effect-time checks remain with their owners. §6/§7 add 32-node chain/fan-out/fan-in/256-edge, over-bound, missing/extra/foreign/stale reference, mid-failure, no dependent calls, connected resume and cleanup proof (lines 832/893). [read; ran; inferred]

**Alternatives/reconsideration:** raising runtime ceilings hides the mismatch; another runtime duplicates the retained owner. An explicit lower public graph contract remains possible only with matching schemas/docs/catalog/proof. Reopen if the actual packed maximum campaign cannot preserve semantics or cost; the one-node controls alone do not close conformance.

### Improvement 1 — mechanical exact-schema reuse

**ACCEPTED.** V3 §3.3's complete canonical identity deliberately rejects unequal schemas, even a consumer count of 200 against producer count 100. This is design friction, not a claimed current compiler bug. [read]

**Changed:** v4 §3.3, line 313, requires scaffold to copy the selected catalog's fully resolved rooted schema and canonical digest without restating assertions. The guide/corpus demonstrates `MAPPING_COMPATIBILITY_NOT_PROVED` and repair by copying the complete producer schema or selecting a named validating projection. Assertions/defaults/array order/SecretRef rules are preserved. [inferred]

**Alternatives/reconsideration:** no silent widening, coercion or implication engine. Reopen only for a frozen required task that cannot use exact reuse or a named projection, with bounded rules and adversarial proof.

### Improvement 2 — executable local-source journey and catalog handoff

**ACCEPTED.** V3's library accepted `document,catalog`, but CLI validation did not visibly receive the discovered descriptor; the complete solution selected only package source. [read]

**Changed:** v4 §3.3/§3.12, lines 344/768, carry an explicit immutable `catalog.local.json` through validate/explain/lock/conformance/invoke from an empty installed directory; the complete config selects `source.manifest`. Fresh lock revision 0 is distinguished from the illustrative existing 7→8 case. A separate manually installed package fixture emits `catalog.package.json`, changes source/lock identity and obtains fresh package admission. No hidden registration or install. The same catalog/plan/lock identities are checked on invocation. [inferred]

**Alternatives/reconsideration:** reuse the existing compiler/catalog seam; no second registry. Exact proposed CLI spellings must be generated from frozen command schemas and pass the installed fixture before support.

### Improvement 3 — schema documentation escape route

**ACCEPTED.** The outside-author allowlist excludes ordinary `title`, `description`, `examples`, while the manifest/doc surface and generated docs already exist in the design. Current predefined host schemas have a different profile. [read]

**Changed:** v4 §3.1/§3.3 place annotations in manifest-declared documentation records keyed to schema/operation and pointer; scaffold emits them. Unsupported annotation keywords return `UNSUPPORTED_SCHEMA_KEYWORD` with an explicit move-to-doc repair; the installed corpus covers an ordinary generated schema containing them. Existing host wire schemas are not narrowed. [inferred]

**Alternatives/reconsideration:** do not ignore keywords or broaden the validator casually. Consider a bounded annotation-only allowance only after measured cold-author failures, updating types/docs/corpus together.

### Improvement 4 — withheld-task visibility boundary

**ACCEPTED.** V3 named a withheld task but not who could inspect it or when. This cold-author gate is separate from the 30-task benchmark. [read]

**Changed:** v4 §7.4, line 913, assigns an independent campaign custodian, seals task/reference config/assertions before docs/scaffold tuning and withholds them from tuners and the trial agent until launch. At launch the agent gets the brief and frozen public surface; reference solution/assertion implementation remain with the evaluator. The existing ledger records seal/access/launch and identities; at most two submitted block+config candidates per task remains unchanged. [inferred]

**Alternatives/reconsideration:** a public advisor clone does not prove transfer. No extra statistical benchmark or trial count is added; an existing ledger satisfying this separation can supply the proof.

## Feasibility and safety critique

Source: [round3-feasibility-safety.md](round3-feasibility-safety.md).

### Blocking 1 — executable capture before admission is unbounded

**ACCEPTED.** The missing input class is real: v3's cap was labelled manifest/schema only while source capture preceded code admission, and the exact current helper reaches a whole-read sentinel despite oversized stat metadata. [read; ran]

**Changed:** v4 §3.1/§3.3, lines 102/295/303, includes executable, manifest, schemas/docs and every declared captured outside file in one 1 MiB aggregate for all selected outside blocks; manifest/schema files retain 64 KiB individual limits. Retain containment/regular-file checks; precheck stat and enforce observed bytes during bounded copy, at most remaining allowance plus one lookahead byte, without writing overflow. Hash exact captured bytes, remove partial owned snapshots, preserve prior config/lock and refuse `SOURCE_CAPTURE_LIMIT_EXCEEDED` before import/invocation/success receipt. §6/G3/G4/§7 require boundary/+1/aggregate-overflow/growth/race/cleanup/sentinel cases for local and package sources. [inferred]

**Alternatives/reconsideration:** trust occurs too late to bound capture; streaming without total limits still leaves work/disk unbounded, and post-read length checks allocate too early. Separate code allowance only for a required larger packed fixture with measured capture/storage/cleanup cost. This adds no sandbox, same-user tamper, deadline or universal rollback guarantee.

### Improvement 1 — prove the coordination ceiling

**ACCEPTED; shared correction, separately accounted for.** This repeats the agent-buildability blocker through the safety lens. The independent safety lane also reproduced 16/32-node preflight refusal with zero handlers. [read; ran]

**Changed:** the v4 §3.4 lowering and §6/§7 packed graph campaign described above satisfy this occurrence too. Domain-map success cannot substitute for the graph/evidence campaign. Existing runtime ceilings and FAIL/INCOMPLETE behavior remain unchanged. [inferred]

**Alternatives/reconsideration:** if lowering cannot preserve logical dependencies, run guards and owning authority, it remains a release blocker until an explicit supported-contract revision and reforecast; it is not repaired by raising a limit.

### Improvement 2 — provisional contract freeze versus installed conformance

**ACCEPTED.** V3's contract row could require the wrapper before later rows built it. [read; inferred]

**Changed:** v4 §6, line 830, has two exits under one owner: provisional data/schema/error/profile/version freeze and pure corpus first; installed clean-consumer compiler/admission/wrapper conformance afterward. Bounded compiler/runtime implementation depends only on the first; broad coupled/reference fan-out waits for the second. The milestone/critical-path text matches. [inferred]

**Alternatives/reconsideration:** no new stage, duplicated spec or circular prerequisite. A later task graph must preserve these two states and link its evidence.

### Improvement 3 — old-runtime preflight in the origin ledger

**ACCEPTED.** Published beta.5/beta.8's Node >=22.16.0 floor is attributed dated registry evidence; target source/matrix require Node24/26. V3 recognized the transition but did not name its negative. [read]

**Changed:** v4 §5/§6 recovery, line 837, requires documented upgrade/bootstrap refusal under Node <24 before target-data/install writes, actionable Node24/26 guidance and preserved old install/data/return. Supported transitions remain Node24/26; this is an existing-origin negative, not Node22 support. [inferred]

**Alternatives/reconsideration:** neither silently replace the prior install nor expand the target-runtime matrix. Revisit only if the actual bootstrap behavior or an explicit runtime promise changes the boundary.

## Platform-fit critique

Source: [round3-platform-fit.md](round3-platform-fit.md). Its no-blocker verdict is retained as a design assessment, not implemented platform acceptance.

### Improvement 1 — portable artifact versus local admission identity

**ACCEPTED.** V3 reserved both concepts but lacked an explicit root-portability rule; no claim that current public identity actually hashes paths is made. [read; inferred]

**Changed:** v4 §3.1's compatibility table distinguishes exact publication integrity and root-independent captured-set digest from local root/snapshot/config/purpose-bound admission. Logical plan identity excludes root/target-only placement; local catalogs/locks/consent still bind it. §3.11/G3/G4 add identical-artifact two-root relocation with preserved portable/capability identity and separately required admission. Source/package transitions do not transfer consent (lines 102/601). [inferred]

**Alternatives/reconsideration:** no new identity service and no cross-machine consent sync. Different publisher/origin/version references do not become equal merely because code matches; revisit only through an explicit compatibility decision.

### Improvement 2 — grant operation keys versus graph aliases

**ACCEPTED.** V3 used `forge.memory.recall` plus operation `recall`, graph alias `memory.recall`, and shorthand grants without a normative mapping. This is an unimplemented-contract ambiguity, not an observed bypass. [read]

**Changed:** v4 §3.1, line 174, serializes the catalog tuple as `<qualified-capability>@<exact-interface-SemVer>#<operation>`. Graph and bound-slot aliases resolve to that key before effect-time checks. Grant schema/fixture uses the same format for Memory/state query/watch; operation permission remains separate from dataset/field/project/app/destination/purpose scope. Alias rename preserves the key, while ungranted operation/version/effect/project rebind refuses, and new code still needs admission. [inferred]

**Alternatives/reconsideration:** reuse catalog identity/version axes, not editable alias authority or a separate permission framework. Exact-version grants are deliberately conservative; changing that compatibility rule requires versioned schema/docs/refusal proof.

### Improvement 3 — existing withheld task outside software delivery

**ACCEPTED.** The current advisor is delivery-oriented; existing generic capabilities, non-delivery proof and withheld slot permit a stronger challenge without more trials. [read; inferred]

**Changed:** v4 §7.4, line 913, uses one existing held-out brief for an ordinary bounded non-engineering composition, such as inventory-note enrichment, with genuinely new domain schemas/composition/assertions. It stays in the sync/public-service profile, and may carry the already-required real Memory slot call. No extra task, UI, async lifetime or service is required. The separate early connected non-delivery acceptance/refusal remains mandatory. [inferred]

**Alternatives/reconsideration:** merely renaming engineering nodes is weaker. Reopen wider support only when a named launch/cold task cannot fit, with owner/cost/proof as existing decision 1 requires.

## Other critique conclusions and option dispositions

These are explicitly accounted for so review summaries and owner recommendations are not silently omitted:

| Critique conclusion/recommendation | Disposition and reason |
| --- | --- |
| Authoring: five prior blockers closed in v3; all twelve default reasoning rows present | **ACCEPTED unchanged at document rung.** Preserve service ABI, complete Memory projection, bounded domain map, exact schema identity and default evidence/alternatives/reopening conditions. Graph lowering is the distinct new correction. |
| Authoring owner options: bounded lowering / narrower graph / funded redesign | **ACCEPTED default bounded lowering.** Primitive controls support the smallest direction; narrower support/redesign remain explicit alternatives only if actual packed semantics/cost fail. No implementation permission. |
| Safety: prior schema/default-reasoning blockers closed | **ACCEPTED at plan-contract rung.** Preserve their corpus/proof requirements; no runnable-platform safety is claimed. |
| Safety capture option: shared ceiling versus separately measured allowance | **ACCEPTED default shared 1 MiB complete selected outside closure.** No required larger bundle/cost evidence supports the alternative; explicit measured profile change remains possible. |
| Safety forecast option: retain provisional allowance versus omit dates | **ACCEPTED default provisional allowance**, unchanged in v4 §8/decision 4. Operators/access and owner-demand ledger precede endorsement; choose no calendar if the allowance is treated as a promise or critical access remains NO. |
| Platform fit: SOUND, no architectural blocker; all twelve defaults/trade-offs reasoned | **ACCEPTED as design reading.** Apply its three cheap clarifications now; do not reopen product framing or widen execution support. Installed and hosted claims remain future proof. |
| Scores, journey tables, source/probe summaries and fit/feasibility assessments | **ACCEPTED as attributed assessment/evidence**, not extra implementation tasks or success metrics. Their active recommendations are the twelve numbered dispositions above; no additional request was found. |

No settled north-star decision is reopened. V4 retains one Forge package, Kernel authority, outside authors in 0.1.0, actual callable reuse, four initial harness obligations, Codex/Cursor platform proof, marketplace/template/promotion journey, public searchable state/events/config, local transfer/backup and hosted/BYO-app/UI seams, no core UI, G0–G8, full applicable matrix and seven exercised candidate-bound days. The 30/30 first-submission benchmark, ten forbidden prompts and two existing cold briefs retain their original denominators and failure accounting. [read; inferred]

## Verification of the outputs

Both outputs were read back and matched the assembled text. The draft retains exactly the required ten numbered top-level sections, ten bottom-line entries, the twelve numbered owner choices/reasoning rows and the inherited release/support obligations. All eight input hashes above remained unchanged; only the two requested outputs were added. JSON example fences parse and the disclosed CommonJS examples still execute their frozen harmless assertions. These are document/literal-example checks, not implementation of the proposed compiler/binder/admission or installed/native proof. [ran]

The capture and lowering implementation/proof stay inside the existing L admission/runtime stream, before the pilot and broad fan-out. Their cost is not assumed zero: the early packed owner/access ledger must price it. No measured evidence justifies changing or endorsing the 8–12-week allowance here. [inferred]

## Open questions for the owner

No new question is required for this revision. **A — retain v4's twelve reasoned defaults as the planning baseline (default); B — choose alternatives explicitly in section 10 before later implementation is commissioned.** This selects recommendations only; neither response authorizes implementation, live operations or publication. Valid replies: A or B; silence retains A.

## Confidence

**High** in complete critique accounting, north-star/structure preservation, current remote identity and the two narrow existing-primitive reproductions. **Medium** in the proposed bounded capture and graph/identity/grant contracts until packed outside/non-delivery/resume proof runs. **Low** in sustainable calendar/capacity, cold-author success, native certification or later hosted security; none is established by this revision.
