Decisions needed: none to correct the blocking admission gap; retain the bounded, trusted-local architecture as the planning default.

# Round-one critique: safety, authority and compatibility

## Bottom line

1. **Verdict: NEEDS-REVISION** — the local executable loader relies on an unspecified project/session trust decision that is not supplied by the cited locality/integrity machinery. [read/inferred: blocker 1]
2. **The ownership model respects D44:** Kernel remains the issue/workflow/run authority; Memory, Flow, config and evaluators do not receive independent acceptance authority. [read/inferred: draft:49–58; decision check below]
3. **The D45/D46 distinction is correctly preserved:** no live Beads backend, importer removal is a target rather than a merged fact, and native data/provenance must survive. [read/ran: decision check below]
4. **The one-package constraint is intact:** first-party blocks are internal owners and selected subpaths; independently published third-party implementations do not create another first-party package train. [read/inferred: draft:26–29,169–184; PR 601]
5. **The proposed config algebra preserves mandatory obligations outside ordinary precedence**, including required edges, evidence, approvals and protected-node replacement refusal. This is a proposed contract, not executed bypass resistance. [read: draft:217–235,279]
6. **Isolation claims are honest:** same-process JavaScript retains host privileges; declarations, hashes, cleanup and Node workers are not presented as malicious-code containment. [read: draft:80,123,135,283,345]
7. **Local-file location cannot stand in for operator permission to execute it**, especially when CLI/library/binary consumers operate without a native harness trust decision. [read/inferred: blocker 1]
8. **Version identities and bounded precedence are useful**, but the implementation lock should add explicit template-update, legacy-reader and resumed-run cases rather than infer those guarantees from version strings. [read/inferred: improvements 1–2]
9. **Upgrade preservation remains mandatory and unfinished:** the retained release plan supports native beta.5/beta.8 origins and preserves unsupported origins by refusal; current upgrade readiness is not backup/restore implementation. [read: local plan:114–128; commands/upgrade.js:38–44]
10. **Proceed after specifying the admission boundary; do not add a generic plugin host or sandbox to fix this gap.** The remaining clarifications fit the existing acceptance/config/recovery lanes. [inferred]

## Evidence and verification boundary

**Draft reviewed:** `docs/work/2026-09-30-forge-final-plan/blocks/blocks-plan-v1.md`, all sections, lines 1–461. In this report, `draft:<line>` refers to that local planning input, not merged product policy. The retained v2 `plan.md`, B1/B2/B3 block research and relevant architecture research were consulted as planning inputs. Repository claims were independently checked against the fetched remote, not the main checkout. [read/ran]

**Pinned source:** freshly fetched `origin/master` (`7d448ec812ef8639790477af07c3c75962173f8a`). GitHub was independently read through `node bin/forge.js github run -- gh ...` with the specified session identity. [ran: fetch, rev-parse and PR API reads]

| Checked record | Returned fact or inspected behavior | Evidence rung |
| --- | --- | --- |
| [One-package fold, PR 601](https://github.com/harshanandak/forge/pull/601) | MERGED; merge commit `ba56b9201782c4d1246c77bde6380867603184bf`; title identifies Contracts/Flow/Memory folding into `lib`. | [ran] live GitHub read, rung 5 for PR state only |
| [Parked release proposal, PR 564](https://github.com/harshanandak/forge/pull/564) | OPEN, `mergedAt: null`, head `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`; fetched its branch and read its release decisions. | [ran] live GitHub/ref read; [read] decision text, rung 2 |
| `locked-decisions.md:567–599` | D44 fixes Kernel field authority; D45 removes live Beads authority/projection while retaining inbound migration in the current ledger. | [read] remote source, rung 2 |
| Parked `decisions.md`, Product model opening paragraph | D46's release target removes the importer and preserves old data; this is not evidence that master already contains the removal. | [read] fetched parked source, rung 2 |
| `lib/core/runtime-graph.js:645–718,972–996` | Locked disable attempts produce errors; the current resolver applies known sections to a cloned fixed graph. It does not implement the proposed arbitrary local-action composition. | [read] remote source, rung 2 |
| `lib/protected-state-authority.js:178–243` | Admission checks active authorization, actor, owning command, worktree, path, exact content, source head and write intent; ambiguous/consumed/mismatched capabilities refuse. | [read] remote source, rung 2 |
| `lib/commands/merge.js:749–795,1307–1308,1368–1419,1462–1464` | Mandatory exact-head/protected-check checks remain separate from configurable predicates; the command rechecks live state, ownership and merge-gate approval before the mutation. | [read] remote source, rung 2 |
| `lib/flow/src/executor.js:243–254` | Provider execution precedes classification of its reported mutations; receipt validation does not prevent an already performed external effect. | [read] remote source, rung 2 |
| `lib/flow/src/skill-runtime.js:230–259,317–361` | Handler status/evidence and dependency resolution are checked; presentation PASS is not a Kernel acceptance API. The runtime itself is not an isolation boundary. | [read/inferred] source plus architectural interpretation |

No installed-product, migration, live-harness, timeout, hostile-code or merge campaign was run. These source checks establish the current seams and the meaning of the proposed contract; they do not demonstrate that the future loader or resolver enforces it. [ran/inferred]

## Blocking issues

1. **Executable admission has no concrete, cross-consumer source of operator consent.**

   **Claim/section:** draft:80 says existing project/session trust supplies operator selection; draft:283 requires importing under that existing path; draft:296 validates operator-selected trust without importing code. The YAML at draft:246–253 selects and enables a repository-local file, and draft:301 promises CLI/library and binary consumers.

   **What's wrong:** the plan names the desired trust condition but does not identify the host input or API that establishes it. Repository YAML and an author manifest can be changed by the same checkout that supplies the executable. A local-path check, a recorded hash and `enabled: true` cannot independently establish that an operator accepted execution with the host's privileges. The admission requirement therefore has two incompatible implementable readings: trust local selected paths automatically, or refuse until a native harness supplies a trust decision that standalone consumers may not have. The former permits unintended execution; the latter breaks the promised standalone extension journey. This is a missing contract, not a claim that a shipped block loader has already been exploited. [inferred]

   **Evidence, with rung:**

   - `lib/forge-lock.js:66–83,116–143` checks lexical/real-path containment and file existence, hashes local bytes, and returns `trusted: true` with reason `local file inside project root`. This function does not obtain an operator execution decision. Its remote opt-in does not provide a local executable admission path. [read, rung 2]
   - `lib/forge-lock.js:152–170` persists that classification; it is lock metadata, not evidence of a CLI/library caller approving JavaScript execution. [read, rung 2]
   - `docs/reference/AGENT_SKILL_PARITY.md:174` documents host-specific trust limitations: Codex project trust lives in global configuration and Forge project setup cannot grant it; several other permission/sandbox rows are unsupported or not delivered. This does not provide a common Node/library admission signal. [read, rung 2]
   - Independently searched `origin/master` under `lib`, `bin`, `test` and `docs/reference` using case-insensitive `trusted`, `trust.grant`, `project.trust`, `workspace.trust`, `session.trust`, `operator.trust` and `trust.selection`. The relevant inspected hits distinguish local lock classification and native harness trust; that search is not a proof that every conceivable trust mechanism is absent. [ran search; read relevant implementations, rung 2]
   - The draft itself correctly admits that imported JavaScript can ignore the advertised pure contract and use host privileges (draft:80,135,283). That makes admission consequential even though the public capability cannot legitimately approve a merge or open a second authority. [read/inferred]

   **Failure case:** an operator runs a supported read/resolve/render journey on a newly obtained or changed checkout whose config enables `local.receipt-export`. If selection/locality is treated as trust, the entry's top-level code executes before the renderer ABI or output validator can reject it. It can perform ambient effects immediately. If the implementation instead relies solely on unspecified native harness trust, an ordinary installed CLI/library consumer has no defined way to satisfy the same contract. These are predicted cases, not reproduced incidents. [inferred]

   **Specific fix:** replace “existing project/session trust path” with an explicit host-admission contract before import. A standalone CLI must receive an affirmative operator invocation selection, and an embedding library must receive a trusted caller-supplied admission decision for the resolved local action; define the corresponding binary route. A native harness decision may be reused only where a supported, verified integration actually exposes it with appropriate scope. Project YAML, author metadata and a locality-derived lock bit cannot grant admission. Missing/unknown admission must refuse without executing entry or conformance code. Record the current source identity and check that admission covers the code set being loaded; do not silently transfer consent to a different selected source. This can be one startup argument/host decision over the existing resolver; it does not require a persistent grant database or a generic plugin framework. [inferred]

   **Required acceptance case:** describe/lint on unadmitted local code must remain data-only; attempting activation without host admission must leave an import-time side-effect sentinel untouched. Explicitly admitted startup must work through the promised CLI, injected library and binary paths. A changed selection must follow the documented admission scope rather than inherit permission from YAML. Keep all Kernel/protected/merge refusals intact. [inferred]

## Non-blocking improvements

1. **Add a finite update/resume disposition table at interface lock.** The draft separates manifest, host, capability and template versions and preserves `0.1.z` behavior (draft:66–76,113,217–235,318–329); the retained plan already requires real native upgrade/recovery proof (local plan:114–128). Specify that a template ID/version identifies fixed data, how a pinned template remains available through compatible patch upgrades, and what happens on an unavailable template or unknown schema. For intentional minor changes, compare old base/new base/local overrides, preserve user additions and required obligations, and refuse unresolved conflicts before replacing owned bytes. A paused run should resume its admitted composition/source context or fail with an explicit restart/reapproval disposition; it must not silently adopt the next startup's defaults. Reuse existing Kernel/config/candidate records. These are refinements of stated preservation obligations, not grounds to add an automatic general template merger now. [read/inferred; current `commands/upgrade.js:44` and `upgrade-safety.js:240–242` explicitly do not implement snapshots/full restore]

2. **Freeze the recognized legacy-config union and writer protocol.** Draft:219 correctly retains readers outside migrated paths. Include existing `merge.auto` configuration (`commands/merge.js:6–26,44`) in the compatibility inventory, so new strict unknown-key validation does not reject legitimate settings consumed elsewhere. Preserve explicit argument > environment > project precedence on migrated selectors (`memory/router.js:89–114`). Reuse sparse set/remove semantics, but name validation-before-commit, replacement and intervening-edit refusal as missing implementation: `config-writer.js:54–58` currently uses direct `fs.writeFileSync`, not an atomic validated transaction. Do not count its sibling-preserving map edit as crash/concurrency recovery proof. [read/inferred]

3. **Turn the existing authority obligations into a small explicit adversarial mapping.** Preserve draft:123,145,147,227–229,268–279. Map cases to their current owner: renderer PASS cannot accept a FAIL/INCOMPLETE input run; a custom evaluator cannot mint gate approval; lower/upper config layers cannot remove a required edge or protected floor; stale actor/head/content authorization refuses; a favorable custom merge predicate cannot override mandatory protected checks or final ownership/gate rechecks. The inspected merge code already separates that mandatory path from configurable rules. Reuse the existing security/composition lanes; do not build another certification framework. [read/inferred: merge.js source ranges in the evidence table]

4. **State the availability ceiling of the pure in-process action.** Input/output bounds and a synchronous `renderReceipt` ABI do not provide a wall-clock deadline: a buggy synchronous import or renderer can stall the host before an async runtime regains control. This does not contradict the draft's honest trust/sandbox disclaimer and is not a demand for sandboxing trusted local code. Add the limitation beside draft:266 and ensure the release docs do not promote the pure-action seam as a cancellable executor. If a required consumer needs enforced termination or untrusted code, admit it only through the separately scoped execution boundary already deferred by draft:135,322,345. [read/inferred: SkillRuntime handler invocation and bounded result checks; no timeout experiment performed]

5. **Preserve the source-to-shipped distinction in approval language.** Twelve responsibility owners are a target map, not twelve isolated interchangeable implementations (draft:182). The current root manifest has no `main`/`exports`, and the current resolver does not load these blocks; the draft correctly lists public entry/asset closure and npm/binary external-code loading as work to prove. Keep those installed consumer requirements when turning the recommendation into tasks. Do not treat a descriptor, source import test or trusted host selection as evidence that the compiled artifact can load the selected external file. [read/inferred: remote package.json; runtime-graph.js:972–1004; draft:39,146,301,403–409]

## Lens assessment

| Question | Assessment |
| --- | --- |
| Can a supported block become another Kernel authority? | **The proposed contract forbids it.** Reserved authority contributions refuse, Memory's floor stays Kernel-backed, and connected Flow submits evidence rather than accepting it. Keep raw SQL, driver/event insertion and approval-minting helpers out of the selected public client and action context. This is an implementation obligation, not proved loader enforcement. [read/inferred: draft:49–78,119–123,279–285] |
| Can config bypass protected state or merge gates? | **The proposed merge algebra forbids it.** Mandatory requirements are constraints over the resolved result, not a weaker overridable layer. Current owning checks offer concrete refusal machinery to preserve. The new resolver must extend, not replace, those checks. [read/inferred: draft:217–235; runtime-graph/protected/merge sources above] |
| Can trusted JavaScript still bypass the intended API path? | **Yes, through ambient host access in principle.** That is why trust must be supplied independently before import. The draft acknowledges this limit; the manifest's `authority: none` and empty effects are author declarations, not an enforced security boundary. [read/inferred: draft:80,135,283] |
| Are isolation/reversal claims honest? | **Yes within their stated limits.** Pure Flow avoiding Kernel activation is dependency/lifecycle separation; it is not process isolation. Owned disposers do not undo remote commits, and receipt normalization follows execution. These distinctions match the prior audit and the checked [Harness safety notice](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/SAFETY.md). [read/external, rung 2; inferred assessment] |
| Does versioning conflate package and capability compatibility? | **No.** The draft separates identities/ranges and requires caller/provider conformance; the inspected [OSGi versioning guidance](https://docs.osgi.org/whitepaper/semantic-versioning/040-semantic-versions.html) supports treating implementer compatibility separately. Forge need not adopt OSGi's runtime or version syntax. [read/external, rung 2; inferred] |
| Does it contradict D44–D46 or one package? | **No contradiction in the inspected recommendation.** D44 sole authority and D45 no-live-Beads remain; D46 is correctly an unmerged release target. Old physical `@forge/*` wording in parked history is superseded by the current owner constraint and merged one-package fold. [read/ran/inferred: decision and PR checks above] |

## Scores (1–5)

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 4 | Bounded action and existing owner reuse are credible; operator admission and binary loading remain real missing work. The 3–6-day delta is explicitly an estimate, not verified capacity. [read/inferred] |
| Value | 4 | Proves useful composition without imposing a general registry or another authority; broader provider demand remains unmeasured. [inferred] |
| Clarity | 4 | Strong distinction between current source, proposed contracts and later scope; trust input and update/resume dispositions need precision. [read/inferred] |
| Risk handling | 3 | Honest isolation, pre-effect authorization and recovery limits; undefined executable consent is a consequential admission gap. [read/inferred] |
| Alignment with owner constraints | 5 | Preserves one package, Kernel authority, protected/merge checks, additive config and consumer-based support. [read/inferred] |

## Open questions for the owner

No new owner answer is required to complete this critique or make the narrow admission correction. If changing the already recommended extension scope: **A — retain trusted local actions with explicit host admission**; **B — defer executable file loading and revise the local-extension acceptance promise around deliberate embedding-host injection**; **C — require untrusted executable extensions now and separately scope/certify containment, permissions and recovery**. **Default: A.** [inferred]

## Confidence

**High** in the checked decision/package alignment, current authority/config seams and the draft's explicit non-sandbox limitation. **Medium** in the implementation risk assessment: the loader is proposed, so the trust failure case is inferred and no exploit or product campaign was executed. Upgrade/refusal requirements were checked in the retained plan, but their implementation and the future binary loader remain unverified. The trust blocker is a precise plan-contract correction, not evidence of a shipped vulnerability.

BLOCKING: 1
