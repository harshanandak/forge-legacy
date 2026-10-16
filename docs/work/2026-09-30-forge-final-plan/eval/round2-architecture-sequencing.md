# Bottom line

1. **Decisions needed: none from this lens.** The draft's existing scope and resource choices remain for the owner; this review authorizes no implementation.
2. **Verdict: SOUND.** The staged path reaches the bounded one-package/open-blocks/templates/separate-config target without rebuilding the landed foundations or adding another authority. [inferred from plan-v2.md:42–53,91–107,173–178]
3. **D44 and D45's surviving authority rules are preserved.** Memory delegates authority to Kernel; connected Flow submits receipts; stateless execution does not become a competing issue/workflow owner. [read, rung 2: plan-v2.md:46,53; E2,E3]
4. **D46 is an accepted owner correction on an unmerged branch, not current-master policy.** The draft states that distinction and explicitly supersedes D45's importer exception while retaining historical data. [read/ran: plan-v2.md:249; E1,E2]
5. **The package fold should not be implemented again.** Its PR is merged, and the draft schedules public entrypoints/default assemblies rather than another extraction/publication train. [ran: E1; read, rung 2: plan-v2.md:24–25,103,250]
6. **The dangerous deletion dependency is correctly ordered.** Native JSONL codecs and recovery proof precede deleting the Beads compatibility module that native projection currently imports. [read, rung 2: plan-v2.md:101–102,109; E4]
7. **Config is one implementation with multiple consumers.** Interface lock precedes parallel assembly/template work; one owner produces the resolver and supported paths consume its result. [read, rung 2: plan-v2.md:91,103–104,191]
8. **The execution boundary is technically credible.** Synchronous deterministic Flow remains intact; real cancellation uses an independently supervised process route and requires termination/reaping evidence. [read, rung 2: plan-v2.md:111; E5; feasibility inferred]
9. **Certification starts early but final acceptance stays late.** Access and a thin installed-artifact receipt path precede broad integration; final content precedes the immutable candidate and its full campaign. [read, rung 2: plan-v2.md:95,159,195–208,261–266]
10. **No blocking duplicate implementation was identified.** Clarify assembly placement, slice prerequisites and shared proof ownership during decomposition; source-level alignment does not prove installed behavior or the proposed dates. [inferred; verification limits below]

## Blocking issues

None identified in the reviewed architecture and sequencing. This is a source-based plan judgment, not a runtime safety or release-readiness certification.

## Architecture and sequencing checks

| Check | Evidence and judgment |
| --- | --- |
| One package with useful open blocks | The manifest declares `forge-workflow`, only `packages/skills` as a workspace, and Node 24 minimum. The package-fold PR is merged. Existing boundary tests cover Contracts, Memory core and Flow; the two default-assembly issues remain open. Thus adding supported subpaths and useful assemblies is missing work, whereas repeating extraction is not. The draft makes exactly that distinction. [read, rung 2: E6,E7; ran: E1,E8; inferred judgment] |
| Sole Kernel authority | D44 assigns issues, dependencies, stages, claims, runs and evidence to Kernel and makes external systems projections. D45 removes live Beads authority. `createMemoryAuthorityProvider` forwards operations to an injected Kernel broker, rather than establishing its own authority. The draft preserves that ownership and does not make cloud/team storage a prerequisite. [read, rung 2: E2,E3; plan-v2.md:46,53,177; inferred judgment] |
| D45 versus D46 | Current master explicitly keeps inbound migration; parked D46 explicitly removes the importer/advisory/helpers while retaining `beads_refs_json` and `beads_import` data. The draft identifies the supersession in section 9 and includes native preservation, stable/unsupported-origin refusal and separate removal work. This is an explicit approved correction, not an accidental contradiction or permission to remove provenance. [read, rung 2: E2; plan-v2.md:101–102,115–128,249; ran PR status: E1] |
| Real templates plus separate additive config | The current resolver clones one fixed default graph and applies known config sections. A fixed-graph toggle is therefore insufficient evidence of user extension. The draft requires two compositions, one actual local extension, explicit map/list semantics, provenance and consistent CLI/library results; general inheritance and network catalogs remain deferred. That is a bounded route to the target. [read, rung 2: E9; plan-v2.md:47–48,53,91,104,176; inferred judgment] |
| Preservation before pruning | Native projection both imports the compatibility codecs and uses them to hydrate issues/comments/dependencies. Deleting the module first would break native preservation. The draft places codec extraction and copied-corpus proof before importer deletion and requires caller/assets/hooks/package census plus reversal evidence for each retirement. [read, rung 2: E4; plan-v2.md:101–102,109; inferred failure scenario] |
| Public seams before broad consumer wiring | Contract lock unlocks native/Flow/config work; public primitive/service seams and initial resolver/discovery proof precede broad controls/harness consumers. The draft explicitly allows parallel development against the locked interface and applicable slices. I did not find a mandatory assemblies → controls → assemblies cycle in these declared prerequisites. [read, rung 2: plan-v2.md:91,95,103–106,195–208; inferred dependency assessment] |
| Honest process execution | The executor calls the provider synchronously and treats a Promise as an invalid provider result. Lifecycle transitions emit termination/reaping effects and require acknowledgements; those transitions alone do not kill a child. Section 5's separate controller and real hanging/late/no-ack/PID-reuse tests address this distinction without replacing the executor or claiming reducer proof as process proof. [read, rung 2: E5; plan-v2.md:111,219; inferred judgment] |
| Reversibility and gates | Task-local removal receipts, selected-origin dry-run/backup/restore/interruption/post-write recovery, separate exact-digest approval for live repair, and immutable-candidate/channel reversal are ordered before their corresponding destructive/promotion actions. G0–G8, required strata, 50-pair floor and seven exercised days survive the one-artifact adaptation. Optional speed/mutation goals do not become prerequisites for independent product work. [read, rung 2: plan-v2.md:109,124–128,157–167,249–266; E10; inferred judgment] |

The order to retain is: **acceptance/interfaces and access → required delivery truth plus native preservation → coordinated artifact ownership and the first public/config slice → supported controls/harness breadth → origin recovery and final content → published immutable candidate → complete candidate-bound proof/observation → promotion/readback**. The draft already specifies this order; optional throughput work belongs alongside it. [read, rung 2: plan-v2.md:195–208; inferred endorsement]

## Non-blocking improvements

1. **Name where default assemblies live.** Sections 3 and 5 promise default local Memory plus a public Kernel seam. Existing structural rules allow Memory core and Flow to import only Contracts; placing broker/default-storage composition inside Memory core would violate those rules. Specify that composition entrypoints sit outside the protected cores and inject existing owners; retain core dependency injection and structural checks. This prevents a plausible implementation mistake, not a required mistake in the draft. [read, rung 2: E3,E7; plan-v2.md:45,103; inferred recommendation]
2. **Turn broad prerequisites into slice edges.** At task generation, expand “settled installed resources” and “applicable API/config/canonical/claims slices” into named producer outputs. Stateless Flow should wait for its own packet/provider/resource seam; connected Flow additionally needs accepted claims/authority. Do not make either wait for every pruning or harness task. Section 7 already calls for this slice order; a dependency map would make it harder to accidentally serialize the program. [read, rung 2: plan-v2.md:103–105,198,202; inferred recommendation]
3. **Carry one implementation/one proof-owner ledger into the tasks.** Resolver wiring appears in APIs, templates and controls; native projection recovery appears in preservation, controls and upgrades; team-shell retirement spans delivery and pruning; receipt/BOM machinery spans early certification and final release work. Those are legitimate consumers/phases of shared work. Assign each mechanism one implementation owner and each risk one canonical test owner; dependent tasks consume its receipt and add only wiring/platform evidence. The draft already assigns config/package owners and a shared shell-retirement receipt, so this is completion of decomposition, not a second program. [read, rung 2: plan-v2.md:91,94–106,191,202; E10:4,24–26; inferred recommendation]
4. **Make narrow public boundaries executable as they are introduced.** Current structural ownership covers three blocks, not the proposed Kernel/config/template surface. Add focused allowed-dependency/import checks for each newly supported seam alongside its clean-directory consumer journey. Extend owning checks rather than exporting all internals or creating a general service framework. This sharpens the existing API acceptance promise without requiring full facade thinning before release. [read, rung 2: E7; plan-v2.md:45,103–104,175; inferred recommendation]

## Scores (1–5)

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 4 | Bounded evolution over existing owners; actual operator capacity and installed assembly feasibility remain to be demonstrated. [inferred] |
| Value | 5 | Delivers independent useful capabilities and real customization while retaining durable shared authority. [inferred] |
| Clarity | 4 | Dependencies and exit evidence are explicit; composition placement and exact slice ownership need task-level precision. [inferred] |
| Risk handling | 4 | Preservation, refusal, cancellation, immutable candidates and incomplete evidence are addressed; execution resources and recovery behavior remain unproved. [inferred] |
| Alignment with owner constraints | 5 | One package, D44–D46 direction, additive config, decided pruning and intact gates are preserved. [inferred] |

## Evidence and verification limits

**Snapshots.** Read the entire draft (`plan-v2.md:1–304`, SHA-256 `383a8e7f0ea0c48ff3eb5c2fac19b0ca718678bfa37d3efbf612f93f9bb14b2a`), critic/common briefs, relevant architecture research, and the sources below. Freshly fetched `origin/master` is `7d448ec812ef8639790477af07c3c75962173f8a`; parked release-plan ref is `2f7fe92ce40195e85ca0e896c52c5d37786b2bd9`. Repository assertions below use those remote snapshots, not the predecessor worktree head. [read/ran]

- **E1 — live GitHub metadata:** prescribed session and `node bin/forge.js github run -- gh pr view ... --json ...`: [package fold (#601)](https://github.com/harshanandak/forge/pull/601) is MERGED, merge commit `ba56b9201782c4d1246c77bde6380867603184bf`; [parked release plan (#564)](https://github.com/harshanandak/forge/pull/564) is OPEN at the parked SHA above. [ran; live metadata readback, not product execution]
- **E2 — decisions:** `origin/master:docs/work/2026-04-28-skeleton-pivot/locked-decisions.md:567–599` and the same path on the parked ref `:605–617`. [read, rung 2]
- **E3 — delegated authority:** `origin/master:lib/memory-core/src/authority-provider.js:3–18,37–59`; `lib/issue-backend.js:6–20`. [read, rung 2]
- **E4 — native codec dependency:** `origin/master:lib/kernel/projection-jsonl-writer.js:6,8–20,151–181`; `lib/adapters/beads-kernel-compat.js:59–78`. Also ran `git grep -n -i -E 'beads-kernel-compat|parseJsonl|stringifyJsonl|loadBeadsExport' origin/master -- lib bin scripts` to inspect codec/import callers. [read/ran; source inspection]
- **E5 — execution seam:** `origin/master:lib/flow/src/executor.js:217–264`; `lib/flow/src/process-lifecycle.js:377–391,430–451`; `lib/flow/index.js:52–59,93–114`. [read, rung 2]
- **E6 — package declarations:** complete `origin/master:package.json`, including workspace `:11–13`, engines `:76–78`, packaged paths/exclusions and the lack of a declared root/subpath API contract. [read, rung 2]
- **E7 — current boundary owner:** `origin/master:test/structural/product-package-boundaries.test.js:8–23,131–184`. [read, rung 2; tests inspected, not executed]
- **E8 — current missing-work records:** `node bin/forge.js show 12d92893 --json`, `show 1ff3d2f9 --json`, `show 56a99d9b --json`: Memory assembly, Flow runner assembly and D46 removal are OPEN. Their old separate-package acceptance wording needs the draft's scope-lock reconciliation; open records do not establish implementation absence by themselves. [ran; live record readback]
- **E9 — resolver and conflicting config behavior:** `origin/master:lib/core/runtime-graph.js:562–599,650–699,972–996`; `lib/issue-backend.js:53–68`. Canonical skill-source transition checked against `lib/skills-sync.js:40–52`. [read, rung 2]
- **E10 — normative proof ownership/gates:** `origin/master:docs/work/2026-08-09-forge-product-restructure/validation-matrix.md:4,8–26,60–90`. Node22 and separate-package portions are explicitly superseded by this draft; authority/data/evidence obligations survive. [read, rung 2; adaptation judgment inferred]

No tests, packed installs, upgrade/recovery operations, live harness sessions or release campaign were executed. The full repository/Kernel dependency graph and delivery dates were not independently certified. Existing research measurements are not new measurements from this review. Only this evaluation file is written; no implementation, Kernel/GitHub mutations, commits or pushes are authorized by the critic brief.

## Open questions for the owner

No additional architecture decision is required. **A — retain the staged path and incorporate the four clarifications during approved decomposition. B — request a revised draft before decomposition. Default: A.** Neither choice grants implementation or publication authority here.

## Confidence

**High** in source/decision alignment and reuse of the landed package fold; **medium** in the dependency plan until slice owners and installed assemblies are exercised; **low** in the calendar until capacity/access checkpoints return evidence. The SOUND verdict applies to this lens and snapshot, not release eligibility. [inferred]

BLOCKING: 0
