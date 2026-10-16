# Round 1 — Architecture and sequencing

## Bottom line

1. **Decisions needed: none for this critique.** Keep the draft's staged-evolution default; its existing release-policy choices remain owner checkpoints. [inferred]
2. **Verdict: SOUND** — the recommended path reaches the one-package/open-blocks/templates/separate-config target without adding another authority or replaying the package extraction. [read; inferred]
3. D44's Kernel authority and D45's live-Beads retirement remain intact; the owner-locked, parked D46 correction removes only D45's importer exception. [read, rung 2]
4. The package fold is already merged; the draft correctly schedules installed APIs and useful default assemblies instead of another package split. [read, rung 2; ran, GitHub metadata]
5. Two real compositions and one local extension seam meet the bounded target; adoption profiles and toggles on the existing graph are correctly treated as insufficient. [read, rung 2; inferred]
6. Templates own composition and sparse config selects/binds/overrides it; one effective resolver is the right shared seam. [read; inferred]
7. Native JSONL codec preservation before importer deletion is a real prerequisite, confirmed in current source. [read, rung 2]
8. Contract lock → preservation/package ownership → assemblies/resolver → controls/migration → exact-artifact acceptance is a coherent dependency order. [read; inferred]
9. No duplicate implementation mandate was found in the inspected workstreams; team-shell retirement, claims acceptance, and config ownership need clearer task boundaries. [read; inferred, not an exhaustive execution guarantee]
10. Gates and rollback obligations are retained, but this review does not prove installed journeys, recovery, harness behavior, or the 4–6 week forecast. [read; inferred]

## Verdict

**SOUND.** The recommended staged path provides a complete bounded local product using the existing blocks and Kernel, introduces actual template extension separately from configuration, and makes preservation and final-artifact evidence prerequisites for release. The remaining concerns are decomposition and proof-placement improvements, not contradictions that make the architecture wrong or the plan unachievable as written. [inferred]

This verdict applies to **staged evolution**, not to the explicitly smaller thin-freeze alternative. The draft acknowledges that thin freeze postpones the owner's extension target (`plan-v1.md:84–86`); selecting it would select a smaller first-release outcome. [read]

## Blocking issues

**None found within the assigned architecture/sequencing lens.** This is an assessment of the written plan and the source dependencies checked below, not proof that future implementation cannot introduce a defect. [inferred]

## Architecture and decision checks

All draft references below name `docs/work/2026-09-30-forge-final-plan/plan-v1.md`. Repository citations refer to the freshly fetched `origin/master` (**7d448ec812ef8639790477af07c3c75962173f8a**); **parked** citations refer to `origin/docs/release-010-parallel-plan` (**2f7fe92ce40195e85ca0e896c52c5d37786b2bd9**). Draft statements are evaluated as proposals, not rounded up to implemented behavior.

| Test | Evidence checked independently | Assessment |
| --- | --- | --- |
| One package with open blocks | `origin/master:package.json:2–13,87–159` declares one root package, the remaining skills workspace, and the package file/dependency policy. The tracked tree contains `lib/contracts/index.js`, `lib/flow/index.js`, and `lib/memory-core/index.js`. [read, rung 2] GitHub reports the package fold [PR #601](https://github.com/harshanandak/forge/pull/601) MERGED, with merge commit **ba56b9201782c4d1246c77bde6380867603184bf**. [ran, metadata only] | Draft `:26–27,51–52,76,113,139` builds supported subpaths/default assemblies inside that package and supersedes multi-package publishing. Preserving independent capability journeys does not require separate installations. [inferred] |
| Sole Kernel authority, D44–D45 | `origin/master:docs/work/2026-04-28-skeleton-pivot/locked-decisions.md:567–599` retains Kernel field/conflict authority and removes live Beads surfaces. `origin/master:lib/issue-backend.js:6–20` has Kernel as the only valid backend, with the still-shipped importer advisory. [read, rung 2] | Draft `:53,69–76,110–113,139` makes Kernel the accepting service; Memory accesses it and Flow produces evidence. It does not create a separate Memory authority, another backend, or a second runtime by default. [inferred] |
| D46 supersession and preservation | **Parked** `locked-decisions.md:605–617` explicitly supersedes D45's import clause, preserves imported provenance/data, and requires Kernel-native recovery. GitHub reports [PR #564](https://github.com/harshanandak/forge/pull/564) OPEN at the parked SHA. [read, rung 2; ran, metadata only] | Draft `:111,138,185,195` correctly distinguishes locked owner direction from merged implementation. Removing importer code while preserving old rows/history implements D46 rather than contradicting D45's surviving authority rules. [inferred] |
| Actual templates, separate config | `origin/master:lib/core/runtime-graph.js:645–716,972–996` applies overrides to an existing graph, rejects unknown IDs, and retains locked primitives/rails. `origin/master:lib/config-writer.js:63–112` writes sparse nested overrides and resets. [read, rung 2] | Draft `:54–60,114` recognizes the missing composition seam and separates template descriptions from project selection/provider bindings. Reusing these primitives while adding two executable compositions is a substantive extension, not relabeling adoption profiles. [inferred] |
| One authority implementation beneath public wrappers | `origin/master:lib/memory-core/src/authority-provider.js:37–59` delegates to an injected Kernel broker. `origin/master:lib/flow/index.js:39–114` exposes existing execution primitives and receipt construction, including the beta.6 producer value at `:57–59`. [read, rung 2] | Draft `:110,113` resolves identity/version policy before freeze and builds usable assemblies over those owners. Thin public entrypoints are appropriate; a second broker, validator, receipt format, or executor would violate the stated reuse approach. [inferred] |
| Physical canonical skills and package parity | `origin/master:lib/skills-sync.js:40–52,230–256` currently treats `skills/` as canonical and copies into harness directories. `origin/master:package.json:109` ships `skills/`; `origin/master:scripts/gen-embedded-assets.mjs:41–44` skips symlinks. [read, rung 2] | Draft `:56,112,169` schedules installer, allowlist, hooks/drift, references, metadata, and compiled assets together. That coordination is necessary: merely moving the source or adding links would not deliver the canonical bytes through every artifact. [inferred] |

The separation is also coherent at runtime: draft `:76` requires local Memory without Flow activation, and stateless Flow without Kernel/Memory activation. Connected execution crosses into the same Kernel acceptance service. This preserves block usefulness without a second authority or mandatory whole-workflow initialization. These are acceptance obligations, not behaviors exercised here. [read; inferred]

## Sequencing, reversibility, gates, and duplicate work

| Sequence | Why the order is sound | Limit or clarification |
| --- | --- | --- |
| Delivery truth before relying on delivery evidence | Draft `:98–103,123` places ownership and truthful aggregation ahead of broad work; the pilot proceeds with real product work rather than adding a ten-day wait. [read; inferred] | Contract/interface inventory can start while these repairs land. The draft already permits parallel inventory (`:124,159`); avoid treating inventory as authority to merge dependent changes. [inferred] |
| Native preservation before D46 deletion | `origin/master:lib/kernel/projection-jsonl-writer.js:6,90–98` imports codecs from Beads compatibility; their definitions are at `origin/master:lib/adapters/beads-kernel-compat.js:59–78`. [read, rung 2] | Draft `:111` explicitly extracts/reuses these codecs first and requires lossless native round-trip/backup/restore. That prevents the obvious dependency break; recovery remains unproven until exercised. [inferred] |
| Settle package/canonical ownership before installed assemblies and harness cutover | Draft `:112–115,124–126,130` assigns the shared manifest/lock/generated surface to one integrator and serializes canonical-source/harness overlap. [read] | Public API inventory need not wait, but installed acceptance must use the settled allowlist and canonical assets. Repository-only module tests would not satisfy these gates. [inferred] |
| Public service and resolver before dependent controls and migration | Draft `:113–116` makes controls consume the APIs/config/canonical content and makes final migration depend on assemblies, controls, claims, and distribution migration. [read] | No required dependency cycle is evident: pre-assembly contract checks can use existing internals, while installed/public acceptance belongs to the later assembly and migration milestones. Spell that distinction out during task generation. [inferred] |
| Migration and release machinery before final publication | Draft `:116–117,204–212` freezes content first, requires native interrupted/post-write recovery, then certifies the exact published candidate before changing default channels. [read] | Channel rollback and data rollback are explicitly distinct (`:210`). Preliminary RCs do not replace final-artifact proof or add another compulsory observation week (`:208`). Publication mechanics were not executed in this review. [inferred] |

The duplicate-work check found **retained foundations and planned extensions**, rather than two competing implementations:

- **Package folding and Node-floor changes:** draft `:26,139,197` treats them as already landed/superseded mechanics. I independently checked the current manifest and the package-fold merge; no new extraction or old-runtime matrix is scheduled. [read, rung 2; ran, metadata only]
- **Worktree safeguards:** draft `:104` retains the safety fix rather than reimplementing it. GitHub reports [PR #582](https://github.com/harshanandak/forge/pull/582) MERGED at the reviewed master SHA. [read; ran, metadata only]
- **Workflow retirement tooling:** draft `:99` calls for using the existing writer, not rebuilding it. GitHub reports [PR #596](https://github.com/harshanandak/forge/pull/596) MERGED (**89abb874952a7d23816762e89c86b52724f4a7ee**). I verified the merge metadata, not the writer's behavior. [read; ran, metadata only]
- **PR delegates:** `origin/master:lib/commands/pr.js:347–384` has four delegates plus unique linkage. Draft `:112,138,147` removes the delegates and preserves linkage; it does not recreate four delivery implementations. [read, rung 2; inferred]
- **Assemblies and resolver:** draft `:113–114` identifies existing constructors, writer, and SkillRuntime as reuse points. An assembly is wiring those owners into a supported lifecycle, not another storage/execution implementation. [read; inferred]
- **Broader facade/config work:** draft `:132,140` defers remaining internal consolidation while completing supported paths. That can create later integration cost, but is not itself duplicate authority or a mandate to build a temporary resolver and replace it. [read; inferred]

## Non-blocking improvements

1. **Name claims reconciliation as a milestone prerequisite.** Draft `:111,115–116,130,166` names claims ownership and dependencies, but the milestone table does not make its exit explicit. Add “verified claim/lease projections and stale-epoch rejection” under the Kernel/native milestone and connect it directly to connected receipt acceptance and cutover. This makes an existing obligation schedulable without adding another workstream. [read; inferred]
2. **Freeze the resolver/template interface before wiring its consumers.** Draft `:110` is precise about packet/receipt contracts; `:114` owns the resolver, while `:113` creates public entrypoints. Include the minimal resolved-config/template shape, authority floor, origin/error semantics, and injected-default behavior in the interface lock. Implement the resolver once in the config lane; public entrypoints and controls consume it. The current malformed-config disagreement is real: runtime-graph reports parse errors (`:588–596`), whereas issue-backend treats them as absent (`:53–60`). [read, rung 2; inferred]
3. **Split team-shell fast-path removal from final retirement explicitly.** The Windows/push item (`draft :100`) and pruning item (`:112,138`) both mention this surface. Assign the hook/config change to the delivery owner; assign remaining shipped scripts/docs/allowlist deletion to pruning, dependent on that change. Reuse its replacement-proof receipt. This is an overlap risk, not evidence that implementation is already duplicated. [read; inferred]
4. **Place a small installed consumer/harness slice early.** Draft `:113–115` contains strong final gates, and `:165` already calls for early vertical certification. Add a visible early checkpoint for one real installed API/resolver/skill-discovery route, followed by one slice per promised harness before broad certification. This can expose lifecycle, package inclusion, link, and permission surprises before the remaining paths depend on the seam; full supported-matrix proof still gates release. [read; inferred]
5. **Make deletion receipts and rollback steps task-local.** Draft `:111–112,116,149,210` supplies the preservation/census/reverse-path intent. Each later removal task should name its replacement capability tests, remaining dynamic callers/assets, and previous-byte/data restore procedure before deleting the old owner. Keep native restore and negative isolation tests independent of importer-positive tests. This turns the plan's safeguards into reviewable checkpoints rather than another cleanup campaign. [read; inferred]

## Scores (1–5)

| Dimension | Score | Reason |
| --- | --- | --- |
| Achievability | **4** | Existing blocks and authority reduce rewrite risk; useful assemblies, recovery, and supported-harness proof still need execution. The calendar remains conditional. [inferred] |
| Value | **5** | Completes the owner's bounded reusable/customizable local product and removes obsolete distribution/authority surfaces. [inferred] |
| Clarity | **4** | Targets, supersessions, prerequisites, and gates are explicit; claims/resolver/team-shell task boundaries need sharper placement. [inferred] |
| Risk handling | **4** | Preservation-first deletion, sole-writer recovery, locked rails, artifact identity, and promotion gates are retained. Behavioral proof remains pending. [inferred] |
| Alignment with owner constraints | **5** | One package, sole Kernel authority, D46, canonical skills, separate additive config, CI-first proof, and no implementation authorization are preserved. [read; inferred] |

## Verification scope and limits

[ran, metadata/source retrieval] Refreshed master and the parked release-plan branch; checked all four named PRs through the prescribed Forge-routed GitHub CLI with `FORGE_SESSION_ID=delivery-train-20260928a`; read the full draft and relevant architecture research; independently inspected the decision ledgers, package policy/tree, authority backend/provider, Flow entry, graph resolver/config writer, native codecs, skills distribution/embedded assets, and PR delegates cited above.

[read, rung 2] Source lines establish actual dependencies and declared behavior. [inferred] The verdict, dependency assessment, duplicate-work assessment, and scores are architectural judgments. GitHub command success establishes the returned PR metadata, not a passing behavioral test. No new test suite, pack/install, migration/restore, live harness, release, or promotion was executed. No Kernel/GitHub mutation, commit, push, or other file write was performed by this review.

Context-mode could not process this workspace: its file reader resolved against another project, and its JavaScript runtime failed with a missing Bun executable. Native PowerShell source reads were used instead; this is a tool limitation, not evidence about Forge behavior.

## Open questions for the owner

No new architecture decision is required by this lens. **A — retain staged evolution and incorporate the five clarifications during task generation. B — request another architecture pass after those task boundaries are written. Default: A.** This does not authorize implementation or resolve the draft's separate publication-policy choices. [inferred]

## Confidence

**Medium overall:** high confidence in the inspected decision precedence, package-fold status, native codec prerequisite, and current graph/distribution foundations; medium confidence in execution ordering until explicit tasks and installed behavior exist. This is a source-backed plan review, not release certification or proof of the schedule.

BLOCKING: 0
