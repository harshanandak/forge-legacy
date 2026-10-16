# Bottom line

1. Decisions needed: none to establish the snapshot; **0.1.0 is not ready for stable promotion** under the parked plan's acceptance rule. [inferred] Product assemblies, migration and RC evidence remain unfinished; sections 4–6.
2. Master is the one-package implementation (**7d448ec812ef8639790477af07c3c75962173f8a**): forge-workflow@0.1.0-beta.8, Node >=24, Bun 1.4.2, 62 manifest commands. [read] package.json:3,4,76; lib/commands/_manifest.js:31.
3. The requested worktree release check returns **exit 0, success:true, blockers:[]** on predecessor ba56b920. All nine static checks clear there; it does **not** run G0–G8 or certify the later master merge. [ran/read] Section 2.
4. PRs #581–#604 now contain **24 merged PRs**: #582 merged during this audit at 2026-09-29T23:19:04Z, advancing master to 7d448ec8. [ran] Complete live PR-range enumeration.
5. Exact-master GitHub checks include successful Ubuntu/macOS/Windows × Node 24/26 full lanes, CI Gate, size, CodeQL and Sonar. They prove repository CI, not immutable-RC journeys. [ran] Paginated check-run enumeration.
6. The committed package baseline is **1,320,089 tarball bytes; 4,805,641 unpacked bytes; 454 files**, including zero nested-dependency files. [read] scripts/package-size-baseline.json; no new pack measurement.
7. The Kernel has **850 literally open issues**, or **881 unresolved** including 28 in progress and 3 in review. Literal-open P0/P1: **36/212**; unresolved P0/P1: **45/231**. [ran] Full Kernel list.
8. Of **45 issues created September 29 UTC**, **44 remain open and 1 is done**. Six total records closed during this audit; open status alone still overstates implementation remaining. [ran/inferred] Section 3.
9. The parked plan's multi-package publishing/extraction mechanics are obsolete after #601; building-block journeys, authority, migration, truthful harnesses and RC proof remain required. [read/inferred] Plan :32–86 and common.md owner constraints.
10. npm has latest:0.0.10 and beta:0.1.0-beta.8, **no RC versions, no next tag and no stable 0.1.0**. This audit verifies **0 qualifying published-RC pairs/days**; seven qualifying observation days remain required. [external/ran] [Registry](https://registry.npmjs.org/forge-workflow).

## Evidence and snapshot

[ran] Initially fetched master and the parked branch with HEAD=origin/master=ba56b9201782c4d1246c77bde6380867603184bf. During the audit #582 merged; final origin/master is **7d448ec812ef8639790477af07c3c75962173f8a**, while this worktree HEAD remains ba56b920. The final remote diff was inspected (16 files, worktree/cleanup/module-link/eval changes). Manifest, package metadata, size baseline, release-check source and the Contracts/Flow/Memory-core blocks are byte-identical between those SHAs. The CLI release check is explicitly worktree/predecessor evidence; no checkout or second write surface was created. The parked plan is pinned to **2f7fe92ce40195e85ca0e896c52c5d37786b2bd9**, live head of [PR #564](https://github.com/harshanandak/forge/pull/564), OPEN and unmerged. Reads use that SHA instead of mutable FETCH_HEAD, which concurrent research legs can overwrite.

[ran] Kernel snapshot: **2026-09-29T23:33:47.046Z**, September 30 in Asia/Calcutta. PR dates and September 29 issue grouping use UTC. All 24 merges fall on September 27–29 UTC.

[read] Repo evidence comes from git show origin/master:<path> or the pinned plan SHA. Labels: **[read]** source; **[ran]** observed command result; **[inferred]** comparison; **[external]** live service/URL. Only this report is written; no implementation, Kernel/GitHub mutations, commits or pushes.

## 1. What is on origin/master

### Package, capabilities and blocks

[read] package.json:3,11,76,87,156 declares one forge-workflow package, Node >=24, bun@1.4.2, and three runtime dependencies: @babel/parser, cross-spawn, yaml. Only packages/skills remains in workspaces; no exports map is declared. #601 folds the former Contracts/Flow/Memory sources and tests into lib/ and test/, removing their internal workspace/bundled metadata.

[read] **Contracts** (lib/contracts/index.js:17) exposes canonicalization/hashing, schemas/baseline verification, validation and semantic identity/idempotency classification. **Flow** (lib/flow/index.js:93) exposes packet execution, NOT_EXECUTED receipt construction, monitor reducers/durability, process lifecycle, bounded loops, SkillRuntime and EfficiencySupervisor. **Memory-core** (lib/memory-core/index.js export object) exposes authority/backend interfaces, feedback, PR lifecycle, usage evidence and durable monitor storage.

[read] Substantial primitives exist, but the supported default assemblies remain missing acceptance: createMemoryAuthorityProvider needs an injected broker (lib/memory-core/src/authority-provider.js:37), backend registry needs a local backend (src/backend-registry.js:85), and createWorkPacketExecutor rejects missing run (lib/flow/src/executor.js:217–218). The live assembly issues confirm the gap.

[ran] Static require imports were scanned across all **6 Memory-core JS files** and **9 Flow JS files**: zero Memory-core imports of Flow, and zero Flow imports of Memory/Kernel. This proves that narrow import boundary, not every injected provider's authority behavior.

[read] git ls-tree -d --name-only origin/master:lib returns **24 directories**, each included once below:

| Responsibility | lib/ directories |
|---|---|
| Authority and issue projection | kernel, issue-sync |
| Contracts | contracts |
| Execution | flow |
| Memory authority/public seams | memory-core |
| Existing memory/grounding implementation | memory, grounding |
| Commands and core primitives | commands, core |
| Harness/adoption/capability foundations | activation, adapters, agents, capabilities |
| PR delivery monitoring | pr-monitor |
| Preflight and validation | preflight, validation |
| Orientation | status, smart-status |
| Workflow/configuration/template source | workflow, workflow-templates |
| Documentation and dependency gates | doc-gate, dep-guard |
| Small text utility and fixtures | text, fixtures |

[read] Repository presence does not imply distribution inclusion. The files allow-list excludes lib/capabilities/, lib/validation/, lib/workflow-templates/, lib/fixtures/ and other repo-only paths. The size baseline measures intended packed content, not the checkout.

### All 62 manifest commands

[read] Exact entries/descriptions from lib/commands/_manifest.js at the snapshot SHA. Metadata describes the registered surface; it is not independent proof of every behavior.

| Command | Manifest description |
|---|---|
| `adapter` | Manage and test review adapters |
| `add` | Record an extension source in forge.lock |
| `audit` | Verify Forge lockfile and audit state |
| `blocked` | Show blocked issues via Forge |
| `claim` | Claim an issue via Forge |
| `claims` | Show active issue leases (claims) via Forge |
| `clean` | Remove worktrees for merged branches (squash-aware) and fast-forward the default branch |
| `close` | Close an issue via Forge |
| `comment` | Add an issue comment via Forge |
| `control` | Set tri-state control (mandatory/optional/permission) for a gate or rail |
| `create` | Create an issue via Forge |
| `dev` | Run the TDD development stage with phase guidance |
| `doc-gate` | Detect a repository's structure, or enforce the doc-update gate on a PR |
| `doctor` | Report the filesystem class of the kernel database path (cloud/network/local) |
| `explain` | Explain a runtime graph primitive |
| `export` | Export the Kernel backlog to deterministic git-tracked JSONL (D16 portability projection) |
| `gate` | Toggle a workflow gate, or record/query human-gate approval events |
| `github` | Optional clone-local GitHub account selection, automatic routing, and isolated launch |
| `hooks` | Opt-in install of Forge native hooks into GLOBAL harness config (Codex/Hermes) |
| `inbox` | List and ack targeted dashboard instruction comments (compliant comment-back) |
| `init` | Initialize Forge adoption config in a fresh repository |
| `insights` | Detect recurring evidence patterns and suggest conservative workflow follow-ups |
| `issue` | Manage issues through the Forge command surface |
| `issues` | Manage issues through the Forge authority layer |
| `lint` | Show issues missing required content via Forge |
| `list` | List issues via Forge |
| `memory` | Unified memory surface: add, recall, search, insights, and bounded hygiene review |
| `merge` | Opt-in conditional auto-merge: merge a PR only when all user-configured rules pass (OFF by default) |
| `migrate` | Migrate a Beads issue store into the Forge Kernel with --from beads, or preview the v2→v3 migration (preview only — --dry-run required; applying it is not yet available) |
| `new` | Create Forge extension scaffolds |
| `options` | Inspect runtime graph primitives and config |
| `orient` | Emit bounded project orientation from deterministic source files |
| `orphans` | Show issues with dangling dependency edges via Forge |
| `patch` | Record and inspect patch intent anchored in patch.md |
| `plan` | Create implementation plan from researched feature context |
| `pr` | Unified pull-request surface: forge pr link\|ship\|preflight\|shepherd\|merge |
| `preflight` | Fast deterministic-gate parity with CI (lint, drift/registry, sonar, affected tests) |
| `prime` | Deprecated alias for `forge status -v`: session-entry bounded orientation |
| `push` | Push with quality gates (branch protection + lint + tests) |
| `ready` | Show ready issues via Forge |
| `recall` | Retrieve project-memory notes from the kernel-backed memory store |
| `recap` | Summarize a single issue from deterministic orientation source files |
| `recommend` | Show tool recommendations for the current project |
| `release` | Release a claimed issue, or run Forge release readiness gates (forge release check) |
| `remember` | Persist a project-memory note to the kernel-backed memory store |
| `role` | Bind a role to a skill/ideology in .forge/config.yaml |
| `serve` | Serve the interactive dashboard over 127.0.0.1 (trigger forge verbs from the browser) |
| `setup` | Initialize forge in a project |
| `shepherd` | Run one bounded monitor pass over a PR (rerun flaky checks, escalate, hand off — never merges) |
| `ship` | Create a pull request from validated feature work |
| `show` | Show an issue via Forge |
| `skill` | Route, evaluate, score, and coverage-check Forge skills (forge skill for \| eval \| scores \| coverage) |
| `stage` | Record or read an issue's real workflow stage (stage_runs) |
| `stale` | Show stale issues via Forge |
| `status` | One-glance orientation: where you are, what to run next, and your work |
| `sync` | Sync Kernel issue state with the configured sync backend (local-noop until a server/remote is configured) |
| `team` | Team coordination workflows and sync utilities |
| `test` | Run tests with smart defaults (timeout, affected-only) |
| `update` | Update an issue via Forge |
| `upgrade` | Preview and self-heal safe Forge upgrade readiness |
| `validate` | Run validation checks across type, lint, security, and tests |
| `worktree` | Manage isolated worktrees |

[read] Already-decided pruning has not finished: insights (_manifest.js:194), serve (:381), team (:455), migrate (:248), pr (:299), and lib/dep-guard still exist. Unique pr link functionality landed in #588; retiring duplicate pr forms must preserve it. No capabilities command appears in this 62-entry manifest. packages/skills remains a workspace, and canonical .agents/skills link distribution is still an open follow-up.

### PRs #581–#604, title, effect and date

[ran/external] Enumerated all 24 live records with the Forge GitHub wrapper and compared their bodies with remote merge history. **All 24 are now merged. #582 was OPEN in the initial read and merged before the final source/status pass.** Landing code does not close a parent's acceptance or certify an RC.

| PR | Live title | Merged at (UTC) | One-line effect on master |
|---|---|---|---|
| [#581](https://github.com/harshanandak/forge/pull/581) | ci: run Tests on every PR, classify relevance by exclusion, and drop duplicated suite runs | 2026-09-28T18:32:26Z | Runs Tests on every PR, classifies safe skips by exclusion including both rename paths, and removes duplicate suite runs. |
| [#582](https://github.com/harshanandak/forge/pull/582) | fix(worktree): create, remove, clean and eval worktrees under the main repository root | 2026-09-29T23:19:04Z | Resolves create/remove/clean/eval against the main repository root, validates module-link dependencies and preserves invoking worktrees during cleanup. |
| [#583](https://github.com/harshanandak/forge/pull/583) | fix(validate): retain captured runner output on test timeout | 2026-09-27T19:31:13Z | Preserves captured timeout output while retaining failure, zero partial counts and no validation receipt. |
| [#584](https://github.com/harshanandak/forge/pull/584) | perf(dep-guard): reuse the fetched issue in the ripple keyword fallback | 2026-09-27T19:41:03Z | Reuses the already-fetched issue title in dep-guard's keyword fallback. |
| [#585](https://github.com/harshanandak/forge/pull/585) | fix(shepherd): stop false-blocking on known workflow comments and preserve actionable comment evidence | 2026-09-28T04:06:15Z | Recognizes narrowly defined successful workflow comments and keeps actionable direct-comment evidence blocking. |
| [#586](https://github.com/harshanandak/forge/pull/586) | test: quarantine the Windows-flaky memory recall holdout case | 2026-09-28T03:59:57Z | Quarantines one CI-observed Windows recall holdout flake; its merged test.skip applies to the case on all platforms. |
| [#587](https://github.com/harshanandak/forge/pull/587) | test(test-env): run the fake-git fixture through wrapper scripts instead of bash -c | 2026-09-28T06:07:01Z | Replaces fake-git bash -c fixture construction with committed wrapper scripts without changing deadlines. |
| [#588](https://github.com/harshanandak/forge/pull/588) | fix(pr): link existing PRs to kernel issues | 2026-09-28T07:25:48Z | Adds exact-head, owned-issue/worktree-bound forge pr link for existing PRs with readback. |
| [#589](https://github.com/harshanandak/forge/pull/589) | fix(kernel): re-acquire an expired lease on a same-identity claim | 2026-09-28T16:56:58Z | Replays claims only while their original lease is live; expired same-identity claims reacquire or fail. |
| [#590](https://github.com/harshanandak/forge/pull/590) | perf(ci): size the Windows lane budget from real cores and put TEMP on the work drive | 2026-09-28T18:20:48Z | Bases Windows process budgets on real core count (cap 6) and moves TEMP/TMP to runner.temp. |
| [#591](https://github.com/harshanandak/forge/pull/591) | perf(test): deterministic cross-runner shard partition for the full suite | 2026-09-28T17:21:42Z | Adds deterministic weighted cross-runner partitions and exact-once inventory checks. |
| [#592](https://github.com/harshanandak/forge/pull/592) | test: quarantine the macOS-flaky journal lock heartbeat case | 2026-09-28T18:07:18Z | Quarantines the CI-observed journal heartbeat flake on macOS only, tracking the clock-injection fix. |
| [#593](https://github.com/harshanandak/forge/pull/593) | perf(package): ship only runtime files via an audited allow-list (-19%) | 2026-09-28T19:24:26Z | Uses an audited runtime files allow-list; excludes repo-only/dead distribution paths without deleting source. |
| [#594](https://github.com/harshanandak/forge/pull/594) | feat!: require Node.js 24 and test Node 24 + 26 | 2026-09-28T20:25:33Z | Raises the Node floor to 24 and changes CI/runtime support together to Node 24/26. |
| [#595](https://github.com/harshanandak/forge/pull/595) | test: drop two source-text assertions covered at a better boundary | 2026-09-28T20:31:51Z | Removes two source-text assertions covered at a stronger adapter/command boundary. |
| [#596](https://github.com/harshanandak/forge/pull/596) | feat(release): supported writer to retire a workflow file | 2026-09-29T16:54:56Z | Adds exact-head authorized workflow retirement with protection/ruleset/dependency checks and audit/recovery. |
| [#597](https://github.com/harshanandak/forge/pull/597) | docs: retire OpenSpec leftovers and move superpowers research to history | 2026-09-29T06:27:53Z | Archives superpowers research and replaces OpenSpec/Beads research-template remnants with Kernel workflow. |
| [#598](https://github.com/harshanandak/forge/pull/598) | ci: keep the Bun pin on the latest stable release automatically | 2026-09-29T16:33:52Z | Adds a scheduled stable-Bun updater using the authorized pin writer and atomic packageManager/pin updates. |
| [#599](https://github.com/harshanandak/forge/pull/599) | chore(deps): replace fastest-levenshtein, drop js-yaml and unused typescript | 2026-09-29T17:49:01Z | Uses local Levenshtein and existing yaml; removes fastest-levenshtein, js-yaml and unused TypeScript. |
| [#600](https://github.com/harshanandak/forge/pull/600) | fix(security): resolve CodeQL #136 (ReDoS) and #137/#138 (shell injection in eval-runner) | 2026-09-29T05:47:18Z | Fixes trailing-slash ReDoS and replaces eval-runner shell-interpolated Git calls with argv-based execFileSync. |
| [#601](https://github.com/harshanandak/forge/pull/601) | refactor: fold contracts, flow and memory into lib as internal modules (one package) | 2026-09-29T18:54:30Z | Moves Contracts/Flow/Memory into lib, removes internal workspace bundling, leaves only packages/skills workspace. |
| [#602](https://github.com/harshanandak/forge/pull/602) | fix(ci): measure the npm package per block with a growth ratchet, generated size-check.yml | 2026-09-29T12:22:15Z | Measures actual npm pack contents per block; adds growth ratchets, 10MB unpacked ceiling and generated size workflow. |
| [#603](https://github.com/harshanandak/forge/pull/603) | chore(deps-dev): bump @stryker-mutator/core to 10 with regenerated lockfile | 2026-09-29T16:09:17Z | Upgrades Stryker to 10 and regenerates bun.lock; development tooling, not a runtime-package change. |
| [#604](https://github.com/harshanandak/forge/pull/604) | test: keep the Windows skills drift check enabled | 2026-09-29T17:33:24Z | Restores the Windows skills-drift check after a local-only quarantine; keeps the timeout investigation open. |

### Committed package numbers

[read] scripts/package-size-baseline.json: **1,320,089 compressed bytes (~1.259 MiB), 4,805,641 unpacked bytes (~4.583 MiB), 454 files**. All block byte/file totals sum exactly to the unpacked total. This leg did not run a new pack/install.

| Block | Unpacked bytes | Files |
|---|---:|---:|
| cli | 1,127,119 | 73 |
| contracts | 98,007 | 40 |
| docs | 86,059 | 7 |
| flow | 103,940 | 9 |
| kernel | 571,785 | 22 |
| lib | 1,660,497 | 144 |
| memory-core | 89,012 | 6 |
| meta | 25,101 | 3 |
| nested-deps | 0 | 0 |
| other | 0 | 0 |
| pr-monitor | 311,295 | 17 |
| scripts | 371,634 | 42 |
| skills | 300,172 | 80 |
| templates | 61,020 | 11 |

[read/external] #593 supplies the runtime allow-list, #601 removes duplicate bundling, and #602 measures the actual pack with block/total growth ratchets and a 10MB unpacked ceiling. [inferred] Pruning materially shipped; retirement of serve/insights, deprecated team/dep-guard, and the skills workspace is still pending.

## 2. Requested release check: every implemented gate

[ran] Executed node bin/forge.js release check --target 0.1.0 --json from this worktree at **ba56b920** with FORGE_SESSION_ID=delivery-train-20260928a. The remote advanced later; this runtime result must not be attributed to 7d448ec8 (although the checker source is unchanged). Result: **exit 0; success:true; target:0.1.0; blockers:[]**.

[ran] The audit census contains **532 matches in 71 files**, with artifact docs/work/2026-06-06-kernel-backlog-memory-roadmap/bd-call-site-kill-list.md. These are inventory matches, **not 532 failures**; the hot-path and artifact-current checks returned no blocker.

[read] lib/release-readiness.js:1984–1995 evaluates precisely these nine functions and filters null results. JSON contains failures only. Therefore PASS below means **the static blocker evaluated and returned no blocker**, derived from the successful report and exhaustive source array; no test/journey was executed by this command.

| Gate / blocker id | Status | Actual check | Source in lib/release-readiness.js |
|---|---|---|---|
| bd-hot-path-issue-commands | PASS, no blocker | Beads census hits in configured D20 hot paths | :1797 |
| d20-audit-artifact-current | PASS, no blocker | Tracked kill-list matches current census | :1811 |
| kernel-backed-forge-issue | PASS, no blocker | Kernel-backed issue and claim/release surface wiring | :1843 |
| forge-prime | PASS, no blocker | Prime module registry contract | :1863 |
| forge-orient-issue-recap | PASS, no blocker | Orient exists; recap is issue-scoped | :1876 |
| forge-skills-pack | PASS, no blocker | Supported skills-pack presence | :1894 |
| forge-remember-recall | PASS, no blocker | Remember and recall registry contracts | :1907 |
| premerge-embedded-gate | PASS, no blocker | Instructions do not make pre-merge a universal numbered stage | :1952 |
| fresh-clone-no-beads-acceptance | PASS, no blocker | Qualifying acceptance-test source/markers present | :1969 |

[read] The unsupported-target guard (:2003–2013) is **not triggered** for 0.1.0. buildReadinessReport returns success solely from blockers.length===0 (:2021–2025). It does **not** validate published RCs, versions, signed BOM, actual installs, G0–G8 receipts, S0/S1 disposition, 50 journeys, observation events or live release dependencies. The fresh-clone check inspects test source; it does not run it.

### Exact-master live CI

[ran/external] Initially enumerated all 50 check objects / 32 distinct names on ba56b920. After #582 merged, enumerated **all pages for current master 7d448ec8**: **31 check-run objects, 18 completed success and 13 completed skipped; none pending/failed in that read**. All six full matrix lanes, CI Gate, package size and Sonar were explicitly verified successful. These are the current-master results:

| Checks | Current result |
|---|---|
| Ubuntu, macOS, Windows × Node 24 and 26 full matrix | all six success |
| CI Gate, Classify Changed Paths, Coverage, E2E | success |
| Package size, ESLint, YAML, docs linker/docstring coverage | success |
| CodeQL Actions and JavaScript/TypeScript analyses, Sonar | success |
| Cross-OS Gate, targeted PR tests, PR dashboard, smoke, unit shard, doc gate/assertion, mutation, Bun updater/tracking | skipped for this event |
| Review orchestration | success and event-specific skips |

[external] [Current-master check enumeration](https://api.github.com/repos/harshanandak/forge/commits/7d448ec812ef8639790477af07c3c75962173f8a/check-runs?per_page=100). The earlier [Tests](https://github.com/harshanandak/forge/actions/runs/36615413278), [size](https://github.com/harshanandak/forge/actions/runs/36615413349), [CodeQL](https://github.com/harshanandak/forge/actions/runs/36615413363) and [Sonar](https://github.com/harshanandak/forge/runs/109567898739) links are predecessor ba56b920 evidence. [inferred] Platform CI is healthier than older reports. Current Sonar success is evidence for reconciling its old issue, not a diagnosis of that issue. A skipped mutation job says nothing about scheduled mutation health.

## 3. Kernel backlog

### Complete counts

[ran] Parsed the complete node bin/forge.js list --json response: **1,659 records = 771 done + 7 cancelled + 850 open + 28 in_progress + 3 review**. Literally open means status=open. Unresolved means open/in_progress/review: **881**. The initial read was 887; six records closed during this research and the final list is used here. Blocked is additive, not a terminal state. Epics and their children are separate records; these are not counts of unique implementation tasks.

| Type | Literally open | Unresolved |
|---|---:|---:|
| bug | 307 | 322 |
| chore | 6 | 6 |
| decision | 3 | 3 |
| enhancement | 3 | 3 |
| epic | 45 | 49 |
| feature | 63 | 63 |
| note | 1 | 1 |
| refactor | 2 | 3 |
| task | 418 | 429 |
| test | 2 | 2 |

| Priority | Literally open | Unresolved |
|---|---:|---:|
| P0 | 36 | 45 |
| P1 | 212 | 231 |
| P2 | 523 | 526 |
| P3 | 73 | 73 |
| P4 | 6 | 6 |

[ran] Appendix A contains **every 276 unresolved P0/P1**, including all **248 literally open P0/P1** and 28 active/review high-priority records. UUIDs use id8; legacy forge-* ids are kept whole to avoid ambiguous truncation. Scope lines are bounded excerpts from live issue bodies, not new diagnoses.

### Lower-priority themes

[ran/inferred] **605 unresolved lower-priority records** (526 P2, 73 P3, 6 P4; 602 literally open) are grouped once each by case-insensitive title concepts in the following precedence order. This organizational classification does not change severity or declare historical tickets valid. Appendix C gives every membership id.

| Theme | Literally open | Unresolved | Priority split | Representative records |
|---|---:|---:|---|---|
| Legacy or explicitly retired surfaces | 51 | 51 | P2: 35, P3: 12, P4: 4 | [dashboard/kernel] Interactive write path — forge serve + broker mutation envelope + tiered local/server sync + agent read-back (213832d1); Execution flow tree: mechanical run-tracking + dashboard redesign around it (235f6c8f) |
| Tests, CI, validation, reliability and performance | 139 | 139 | P2: 126, P3: 13 | [skills] Author missing lifecycle skills (source-driven-dev, security-hardening, grill-before-plan, observability, diagnosing-bugs, merge-conflicts) (017b3ec1); Investigate Windows structural validation timeouts in manifest and skill drift checks (04afb9f9) |
| Release, distribution and product composition | 29 | 29 | P2: 25, P3: 4 | Bound smart-status runtime for release-train orientation (02c45b88); Make Bun worktree verification linker- and source-aware (0eb59c8e) |
| Flow, PR monitoring, review and GitHub delivery | 96 | 96 | P2: 85, P3: 10, P4: 1 | Migrate watcher owner identity safely across repository renames (06979241); Shepherd freshness anchors on head commit committedDate instead of the head push time (090996ff) |
| Memory, recall, grounding and evaluation | 49 | 49 | P2: 41, P3: 8 | Shadow-logging eval blocked: memory corpus is empty (capture not installed in checkout) — floor-tuning cannot proceed (00b00897); Model forced-kill intent for orphaned process lifecycle (0287967e) |
| Kernel, issue authority, coordination and worktrees | 89 | 89 | P2: 82, P3: 7 | Round trip issue (00355065); Kernel ready two (05d026ba) |
| Skills, harnesses, hooks, adapters and configuration | 59 | 61 | P2: 47, P3: 14 | Skill invocation convention: standardize Skill("name") handoffs (028a149e); Deep OpenCode plugin integration for Forge (06373ce8) |
| Documentation, UX and other product work | 90 | 91 | P2: 85, P3: 5, P4: 1 | Standards and gitignore (04b6e42e); dep blocked (0525120d) |

[inferred] Precedence: retired/legacy → tests/CI/reliability → distribution/composition → Flow/PR → memory/evaluation → Kernel/coordination → skills/harness/configuration → remainder. Security/performance words enter the tests bucket; mixed tickets take their first matching theme. This exposes legacy and fixture noise rather than turning the entire backlog into a release train.

### Every September 29 follow-up

[ran] created_at starting 2026-09-29 on the complete list: **45 records: 44 open and 1 done; 3 P1, 40 P2, 2 P3**. Includes final-plan revamp, Beads retirement, Windows process cost, package/skills pruning, workflow recovery/safety, public Memory acceptance and CI investigations.

| ID8 | Priority | Current state | Title |
|---|---|---|---|
| 0b3c0c50 | P1 | open | Windows process identity spawns PowerShell per call (seconds each): slow push proof and flaky check-forge-token test |
| 56a99d9b | P1 | open | Remove Beads importer and compat code for 0.1.0 (D46) |
| 73714c21 | P1 | open | Forge final plan: research-backed revamp of the 0.1.0 plan (replaces #564 as written) |
| 04afb9f9 | P2 | open | Investigate Windows structural validation timeouts in manifest and skill drift checks |
| 10cb5a4d | P2 | open | Update worktree skill for linked-checkout clean |
| 15bee94d | P2 | open | Report workflow rollback restoration failures in CLI errors |
| 2390754b | P2 | open | Flaky: eval-runner executeCommand FORGE_EVAL test times out on macOS CI |
| 27108166 | P2 | open | retire-workflow: bind retirement capabilities to a fresh branch-protection/ruleset snapshot |
| 28dba549 | P2 | open | Codex hosted review cannot resolve existing PR601 head |
| 2efaf6b0 | P2 | open | Make failed workflow revocation recovery instructions actionable |
| 4248273d | P2 | open | Keep clean issue open when module-link detachment fails |
| 4399035a | P2 | open | Watch local bounded-loop 256-event ceiling timeout |
| 4416c96c | P2 | open | watch-owner SQLite contender test times out on macOS CI |
| 590fb4fc | P2 | open | Document workflow retirement refusal for forks and producer rulesets |
| 59f83202 | P2 | open | Delete packages/skills (@forge/skills CLI) after the overlap check |
| 5a40eea5 | P2 | open | Distribute skills from one canonical .agents/skills with links, not per-agent copies |
| 5af8bf6c | P2 | open | Stage only Bun updater outputs in manual fallback recipe |
| 5c05e01a | P2 | open | Investigate local Windows subprocess and lifecycle test timeouts during PR 601 validation |
| 5dc2ac03 | P2 | open | Investigate Windows Git timeout in Bun same-version projection test |
| 60bebd34 | P2 | open | Watch Windows resource-lane coverage timeout after prior cost fix |
| 66496e29 | P2 | open | Delegated agents leave issue leases under ad-hoc actors, stalling the next owner until expiry |
| 6d767d27 | P2 | open | Verify shared dependency installs before linking new worktrees |
| 7743ec35 | P2 | open | review-resolve thread pagination exceeds Windows argument length |
| 7827515d | P2 | open | retire-workflow: surface or block on failed rollback-audit compensation |
| 8bbc172b | P2 | open | Test malformed receipt rejection at public Memory submission boundary |
| 90354847 | P2 | open | Fail closed throughout the manual Bun bump recipe |
| 9b3265c3 | P2 | open | size-check: pin npm to the publish version for pack measurements and baseline generation |
| 9d4ffd3a | P2 | open | Add focused test routing for Bun release and workflow retirement modules |
| 9f96ed90 | P2 | open | Reuse registered legacy nested worktree on create |
| a58bc1bb | P2 | open | Mutation Testing job has failed on every scheduled run since at least 2026-03-08 |
| a8dc2c86 | P2 | open | Windows CI init-hooks sanity test times out during runtime health probe |
| ac4cac82 | P2 | open | Investigate Windows product-boundary scan timeout without weakening structural gate |
| aeab48f8 | P2 | open | worktree deps digest ignores workspace manifests in lockfile-free workspaces |
| bb0d2006 | P2 | open | shepherd reports bot summary comments as blockers (CodeRabbit walkthrough, Codex status table, github-actions reports) |
| c57ed1ac | P2 | open | Restore staged Bun manifest independently of concurrent working-tree edits |
| c830e647 | P2 | open | retire-workflow: treat workflows with dynamic status/check producers as unprovable |
| ccabd934 | P2 | open | Preserve at-signs in local reusable workflow references |
| d1fbc8fa | P2 | open | /plan creates a duplicate issue: forge worktree create auto-files a stub before forge create |
| d8692342 | P2 | open | package-budget: validate an initial baseline against the measured package when the base has none |
| df1e554e | P2 | open | Structural skills-sync drift test times out under Windows directory concurrency |
| f7f1a33d | P2 | open | Add packed Memory issue claim and lease acceptance journey |
| f7f7e730 | P2 | open | forge push --quick spends ~192s in the pre-push team-sync step |
| fadbba10 | P2 | open | Investigate Windows skills mirror regeneration timeout |
| 213585e5 | P3 | open | Bun Pin Auto-Update: retry Tests dispatch when PR exists but dispatch failed |
| b54cb547 | P3 | done | Bump @stryker-mutator/core 9 -> 10 by hand (Dependabot cannot update bun.lock) |

[inferred] The final pass shows Stryker (b54cb547) **done**, correcting its initial open status after #603. Reconcile the remaining records before assigning work: package-growth (46d25e0a) after #593/#601/#602; redundant-CI (18307c60) describes an older topology after #581; bundled install (66e6890a) describes a mechanism removed by #601. These are closure/split **candidates requiring acceptance evidence**, not automatic completions. The worktree skill follow-up (10cb5a4d) remains open after #582's merge and still needs its documentation acceptance.

## 4. Parked #564 versus current state

[read] Compared pinned plan.md:28–86 and tasks.md with the approved 2026-08-09-forge-product-restructure/validation-matrix.md. **Done** applies to a narrow currently evidenced outcome. **Partial** means foundations exist but acceptance is incomplete/unverified. **Not started** means the required accepted deliverable/evidence is not present in inspected release surfaces; unmerged prototypes may exist. **Obsolete** applies to a superseded mechanism, not its safety goal.

### Every required product/control outcome

| Parked outcome (plan line) | State | Evidence and remaining work |
|---|---|---|
| Preserve Contracts; generic provider seam (:32) | Partial | Shared lib/contracts remains; default Flow/provider acceptance 1ff3d2f9 is open. [read/ran] |
| Freeze packet/authority/provider/cleanup/terminal/error/compatibility semantics (:33) | Partial | Contract schemas/baseline exist; final provider semantics and RC BOM-bound acceptance are not frozen. [read/inferred] |
| Shared conformance fixtures/validators (:34) | Done for source consolidation; partial acceptance | #601 preserves canonical lib/contracts fixtures/baseline. Full forward/backward RC matrix remains. [read/external] |
| Publish Contracts before separate Memory/Flow packages (:35) | Obsolete | One package is decided and landed; use one artifact plus supported block/mode journeys. [read/inferred] |
| Supported default Memory assembly (:39) | Not started as accepted entrypoint | Provider/backend registry require injected infrastructure; 12d92893 open. [read/ran] |
| Memory install/store/provenance recall/restart/repeat recall (:40) | Partial | Storage/recall primitives exist; supported installed default assembly acceptance incomplete. [read/ran] |
| Public issue/claim/lease authority (:41) | Partial | Kernel/provider seams exist; packed acceptance f7f1a33d open. [read/ran] |
| Idempotent receipt; reject stale/malformed/wrong-capability/conflicting/incomplete; non-Flow executor (:42) | Partial | Receipt/PR authority exists; public malformed submission 8bbc172b and complete executor-independent journey remain. [read/ran] |
| Memory without private Flow dependency (:43) | Done for static imports | Six Memory-core JS files scanned; zero Flow requires. [ran] |
| Stable Memory setup/unavailable errors (:44) | Partial | Default assembly and declared stable diagnostic acceptance remain in 12d92893. [read/ran] |
| Public Flow assembly/provider/authority boundary (:48) | Not started as accepted assembly | Executor needs caller run; 1ff3d2f9 open. [read/ran] |
| Valid WorkPacket → canonical RunReceipt (:49) | Partial | Executor/skeleton exist; skeleton is NOT_EXECUTED; supported installed runner still needed. [read/ran] |
| All statuses, timeout, acknowledged cancel, cleanup, zero orphan (:50) | Partial | Flow/process/monitor primitives exist; complete exact-artifact failure/cancel/restart acceptance remains. [read/inferred] |
| Flow without private Memory or authority writes (:51) | Done for static imports; partial behavior | Nine Flow JS files: no Memory/Kernel requires. Injected provider authorization still needs behavioral proof. [ran/inferred] |
| Deterministic local provider conformance; Companion optional (:52) | Partial | Injectable executor exists; default runner/conformance incomplete. External Companion remains optional. [read/ran] |
| Rebase/ship preserved bounded PR5 (:56) | Not started as accepted merged PR5 | 5f4da13f open; package folding does not certify PR5. [ran] |
| Preserve binaries/commands/JSON/exits/config (:57) | Partial | Current bins/62-entry surface remain; deliberate pruning needs compatibility/disposition proof. [read/inferred] |
| Public-surface-only facade routing (:58) | Partial | Entry points exist; complete 5f4da13f routing acceptance is open. [read/ran] |
| Truthful capabilities/preflight/Doctor (:59) | Partial | No capabilities manifest command; Doctor has two checks, not exhaustive negotiated coverage. [read] |
| Minimal manifest-driven Doctor (:60) | Partial | Doctor filesystem/memory checks exist (doctor.js:138); e8e72233 open. [read/ran] |
| Supported four-harness T0–T4 adapter slices (:61) | Partial | Harness/probe foundations; installed-version tier/cancel/resume/cleanup certification incomplete. [read/ran] |
| Claim-projection reconciliation before migration (:65) | Not started as accepted reconciliation | 9e31a2f0 open. #589 repairs expired replay, not complete stats/claims/claimed_by consistency. [ran/external] |
| Reconcile four PR4B child criteria (:66) | Partial | 6ddd30c6/c5112cd4/209d80bc/c94f36f9 all open. [ran] |
| Hook control and MCP consent gates (:67) | Partial | 7268bc9b/9658c21a open and blocking release convergence. [ran] |
| Canonical skills, authorized atomic projection/recovery (:68) | Partial | Drift infrastructure exists; mirror/recovery children and new .agents/skills links issue 5a40eea5 open. #604 restores Windows enforcement. [read/ran] |

### Every migration/release outcome

| Parked outcome (plan line) | State | Evidence and remaining work |
|---|---|---|
| beta.5 inventory/dry-run/backup/interruption/rollback/sole writer (:72) | Partial | Historical beta.5 compatibility infrastructure exists; final PR6 f2a96ff1 open and blocked. [read/ran] |
| Runtime completeness/global bundled installs (:73) | Partial acceptance; obsolete mechanism | #601 removes internal bundling; 95372af8 in_progress and 66e6890a open. New installed single-artifact proof required. [read/ran] |
| Remove all executable Beads/importer/hints/commands; preserve history/data (:74) | Partial | Static live-feature gates clear, but migrate and beads-kernel-compat still ship (migrate.js:13–15,208); 56a99d9b open. [read/ran] |
| Facade against independent Contracts/Memory/Flow packs (:75) | Obsolete mechanism | One artifact with all required block/mode install journeys replaces four package artifacts. [read/inferred] |
| Exact version/contract/source BOM (:76) | Not started as accepted RC freeze | No published RC/next; existing contract baseline is not signed release BOM. [external/ran] |
| Sonar regression resolution/live stale proof (:80) | Partial disposition | Current exact-master Sonar check succeeds; 247ec784 open. Underlying rating/cause not queried here. [ran/external] |
| Process isolation and bounded Windows scheduling (:81) | Partial | #590/#591 improve scheduling; 50d3f2c3/fd64f6c9 still open. Replay/isolation acceptance outstanding. [ran/external] |
| Child failure/timeout/missing shard/incomplete aggregate block release (:82) | Partial release acceptance | #583 fails closed on timeout; current CI passes; no complete RC gate aggregate exists in inspected evidence. [read/ran/inferred] |
| Freeze/tag/immutable next RC/exact artifact matrix (:83) | Not started | Registry has no RC/next; eb2f1753 open and blocked. [external/ran] |
| Three OS, Node24/26, Memory-only/stateless/connected/facade, four harnesses (:84) | Partial | Six repository lanes pass; installed artifact modes/harnesses are broader acceptance. [ran/inferred] |
| 50 pairs, all G0–G8, seven days, no S0/S1, metadata-only promotion (:85) | Not started as qualifying published-RC proof | Zero verified RC pairs/days; publication/BOM/aggregate outstanding. [external/inferred] |
| Minimal supported-skill acceptance; defer self-improvement (:86) | Not started as scope reconciliation | Broad behavioral/holdout program d362bd71 remains open and blocks release root. [ran] |

[read] Remote D45 explicitly retains the inbound importer (locked-decisions.md:587–599). The later parked correction (:74), owner constraints and D46 issue supersede that 0.1.0 boundary. Reconcile the contradictory text; do not relitigate no-importer direction.

[ran] Live required-record status and blockers:

| Required record | State | Priority | Live unresolved dependencies |
|---|---|---|---|
| Ship standalone Memory default assembly through public APIs (12d92893) | open | P0 | none returned |
| Ship standalone Flow runner assembly through public APIs (1ff3d2f9) | open | P0 | none returned |
| Authorize official generated-harness skill mirror writes (209d80bc) | open | P0 | none returned |
| PR5 integration: facade, harness, and capability negotiation (5f4da13f) | open | P0 | none returned |
| PR4B B2: Flow-backed PR monitor durability and replay (6ddd30c6) | open | P0 | none returned |
| Cut 0.1.0 release (version bump + CHANGELOG + ~7-doc version sweep + tag/publish) (8e634347) | open | P0 | d362bd71 |
| Fix published npm package missing runtime workspace modules (95372af8) | in_progress | P0 | none returned |
| PR4B B3: restart-safe watcher lifecycle execution (c5112cd4) | open | P0 | none returned |
| Recover deleted generated skill mirrors after interrupted sync (c94f36f9) | open | P0 | none returned |
| Behavioral eval tier + holdout improvement loop (d362bd71) | open | P0 | none returned |
| PR7 integration: release convergence and 0.1.0 evidence (eb2f1753) | open | P0 | f2a96ff1, 7268bc9b, 9658c21a |
| PR6 integration: migration, shadow comparison, and extraction readiness (f2a96ff1) | open | P0 | 5f4da13f, 9e31a2f0, 12d92893, 1ff3d2f9 |
| Diagnose master Sonar new-security rating regression after PR #530 (247ec784) | open | P1 | none returned |
| Isolate process-tree unit tests from inherited shard manifest (50d3f2c3) | open | P1 | none returned |
| Fix Bun global install for bundled workspace packages (66e6890a) | open | P1 | none returned |
| [control-plane] Hook adapter consults controls (warn/deny/deny-unless-approved) + honest per-harness downgrade (7268bc9b) | open | P1 | none returned |
| [control-plane] MCP registry section + render/drift/consent wiring (render-time locus, honest SEAM) (9658c21a) | open | P1 | none returned |
| Reconcile Kernel claim projections before 0.1.0 migration (9e31a2f0) | open | P1 | none returned |
| Expand forge doctor into manifest-driven health coverage (e8e72233) | open | P1 | none returned |
| Serialize process-heavy Windows test shards without duplicate execution (fd64f6c9) | open | P1 | none returned |
| Remove redundant full-suite executions from PR CI (18307c60) | open | P2 | none returned |
| npm package keeps growing: triple-bundled @forge internals, shipped docs, no growth ratchet (46d25e0a) | open | P2 | none returned |
| Delete packages/skills (@forge/skills CLI) after the overlap check (59f83202) | open | P2 | none returned |
| Investigate Windows skills mirror regeneration timeout (fadbba10) | open | P2 | none returned |

### G0–G8

[read] Gate definitions: validation-matrix.md:10–18. Its release semantics and the static nine checks are different. A current repository check does not automatically become a frozen-RC receipt.

| Gate | State against full release acceptance | Evidence / gap |
|---|---|---|
| G0 static/formatting | Partial; current repository checks done | ESLint/YAML/docs succeed; no immutable BOM-bound RC G0 receipt inspected. [ran/inferred] |
| G1 risk selection | Partial | Source/generated risk manifests exist; complete ownership/selection/digest acceptance must bind new lib layout and RC. [read/inferred] |
| G2 package/block tests | Partial | #601 moved source/tests; CI succeeds. Separate-package mechanics obsolete; supported default assembly/installed-artifact block tests remain. [read/ran] |
| G3 contracts/providers | Partial | Fixtures/baseline exist; final provider and forward/backward accepted RC matrix incomplete. [read/inferred] |
| G4 authority/security | Partial | CodeQL/Sonar succeed and #600 fixes concrete findings; claims/control/mirror outcomes remain open. [ran/read] |
| G5 migration/data | Partial | beta.5 foundations; final cutover/interruption/post-write/rollback acceptance blocked in PR6. [read/ran] |
| G6 platform | Partial release proof; six repository lanes done | All current OS/Node lanes succeed; installed artifact/process/SQLite/harness paths still need BOM-bound receipts. [ran/inferred] |
| G7 journeys | Partial | Current E2E succeeds; default Memory/Flow and complete installed adapters remain incomplete. [ran/read] |
| G8 release | Not started as accepted published-RC proof | No RC/next, final signed BOM or complete aggregate; PR7 blocked. [external/ran] |

[read/inferred] validation-matrix.md:65 still says Node22/24: **obsolete**, replaced by Node24/26 in #594. Separate-package/extraction and inbound-Beads fixture wording also needs adaptation. Preserve coverage and fail-closed semantics while changing those mechanisms.

### Required journeys and observation

[read] Full journey requirements: validation-matrix.md:60–90. Performance targets: parked plan.md:190–204, expressly proposed until measured. This leg inspected source/live CI; it did not benchmark or run a new full suite.

| Journey/acceptance | State | Evidence / limitation |
|---|---|---|
| npm/Bun installed artifact, entrypoints, contents/integrity | Partial | Allow-list/folding/size CI shipped; no new installed-artifact run here. |
| Memory-only provenance/restart, public issue/claim/lease, non-Flow receipt | Partial | Existing primitives; assembly and public acceptance follow-ups open. |
| Flow stateless/connected packet→receipt, statuses and deterministic provider | Partial | Injected runtime; default runner open. |
| Monitor durability/retry/cursor/session-run lifetime/restart/reaping | Partial | Existing monitor/store/Shepherd; B2/B3 and exact-artifact acceptance open. |
| Four installed harnesses, T0–T4/live delivery/wake/resume/cancel/cleanup | Partial | Source/probes; full installed-version certification not accepted. |
| beta.5 upgrade/dry-run/backup/interrupted cutover/post-write/rollback | Partial | Historical corpus; final PR6 blocked. |
| Contract forward/backward and claim/lease/workflow/gate/merge security | Partial | Implemented foundations/current security CI; full RC journeys outstanding. |
| Feedback consent/privacy and triage receipts | Partial | Memory primitives; complete RC proof not established. |
| Provenance/OIDC/dist-tags; exact-head sequential merge-train simulation | Not started as accepted RC exercise | No published RC/signed BOM exercise inspected. |
| 50 distinct clean RC journey/environment pairs | Not started as verified count | **0 qualifying pairs verified**; no registry RC. Unit repeats do not count. |
| Seven cumulative automated days with no unresolved S0/S1 | Not started as verified qualifying window | **0 qualifying days verified**; no BOM-bound ledger inspected. Beta elapsed time does not count. |
| Cold version p95 <=2s across OS | Partial, unmeasured at candidate | Fast-version path exists; no current-candidate p95 here. |
| Quick setup p95 <=30s excluding download | Not started as accepted measurement | No exact-candidate benchmark inspected. |
| Packed artifact <=60s; three Windows repeats | Partial, unmeasured | Fixture work exists; adapt per-package wording to one artifact plus modes. |
| Recall p95 <=2s/1,000 records; restart 3/3 | Partial, unmeasured | Recall exists; accepted candidate benchmark not inspected. |
| Local receipt p95 <=2s; cancellation <=5s, no orphan | Partial, unmeasured | Process/Flow primitives; default runner and measured acceptance incomplete. |
| Full suite <=25min, durable PASS, zero unexpected skips | Partial release proof | Current CI succeeds; accepted quarantines #586/#592 need disposition; #604 restores unjustified Windows skip. |

[inferred] Measurement “not started” means accepted evidence was not established here, not that no developer ever timed a local command. Zero RC pairs/days are **verified qualifying counts**, not an exhaustive claim about private logs.

## 5. Honest distance and next acceptance sequence

[inferred] This is not a version-bump-only release. The train already gives a smaller artifact, fewer dependencies, safer claims/delivery and passing cross-platform repository CI. Preserve that work; do not rebuild a multi-package architecture or implement all 881 records.

1. **Reconcile release graph and stale criteria.** Apply one package, Node24/26, no importer, agreed pruning/canonical-skills decisions. Attach exact evidence before closing/splitting old CI/package/security/dependency issues. Include the now-merged #582 behavior and reconcile its remaining follow-ups.
2. **Complete supported assemblies/diagnostics/control behavior.** Default Memory assembly and Flow runner through existing entrypoints; minimum facade/Doctor, four supported harnesses and hook/MCP consent. Companion stays optional/external.
3. **Complete authority/data boundary.** Claim projections, mirror authorization/recovery, importer retirement preserving data/history, and beta.5 backup/cutover/interruption/post-write/rollback against the single artifact.
4. **Finish release-only content, freeze one candidate.** Versions/docs/changelog/disposition and minimal skill corpus before freeze. Publish immutable next RC; implement/use real gate/journey aggregation rather than treating static release check as it.
5. **Accept the installed artifact once per unchanged RC.** G0–G8, all required strata, 50 distinct clean pairs, cleanup/rollback, no unresolved S0/S1 and seven cumulative qualifying automated days. Changed artifact inputs require a new RC and correct evidence invalidation.
6. **Promote accepted content without behavioral rebuild.** Move latest to the exact accepted RC artifact under the metadata-only rule.

[ran] PR6 (f2a96ff1) is blocked on Memory, Flow, PR5 and claim reconciliation. PR7 (eb2f1753) is blocked on PR6 and the two controls. Release root (8e634347) still lists broad evaluation d362bd71 as its remaining blocker, showing scope/graph reconciliation is itself necessary.

[inferred] No defensible percentage or implementation ETA follows from this backlog: duplicates, fixture noise, obsolete directions and landed-but-unclosed records inflate it. The evidence-backed lower bound is the unfinished acceptance chain **plus the full seven-day qualifying observation requirement once acceptable RCs exist**.

## Appendix A. Every unresolved P0/P1

[ran] Complete live list at the snapshot above. These are all high-priority records, not a selected release-critical subset. Scope lines are bounded source excerpts. Active/review and blocked states remain explicit.

### P0 — 45 unresolved, 36 literally open

| ID8 | Title | State | Type | One-line scope from live issue |
|---|---|---|---|---|
| 00d477ba | [activation] Agent auto-init: lazy bare-minimum, project-appropriate .forge on first use (no forced 'forge setup') | open / blocked | feature | FOUNDATIONAL, depends on the plugin surface. When Forge is invoked in an un-inited repo, the agent should auto-run the equivalent of 'forge init --profile minimal' -- clean .forge/ config, A |
| 068374e5 | [epic] Forge beta-readiness -- CONDITIONAL-GO: wire the primitives into the runtime loop | open | epic | End-to-end beta eval (6 read-only evaluators + Fable synthesis, 2026-07-13). Verdict CONDITIONAL-GO. Scores: UX 6, memory/agent-adoption 4, security 8(code)/HIGH secret-hygiene, single-binar |
| 12d92893 | Ship standalone Memory default assembly through public APIs | open | bug | Baseline 7393dd9d shows @forge/memory installs and resolves, but the public package cannot execute the required store -> recall with provenance -> restart -> recall journey without caller-in |
| 16b75ba8 | Publish Forge v0.1.0-beta.5 | open / blocked | task | Cut the next beta from verified master after PRs #494 and #495. Scope is version/changelog release metadata, repository validation, guarded PR merge if required, GitHub prerelease, npm beta  |
| 183dc7ca | [epic] Skills as a first-class system — reasoning-driven auto-trigger, sub-skill composition, progressive adoption, and skill eval/scoring | open | epic | Owner strategic direction (2026-07-18): Forge's skills/docs/features are under-connected and under-utilized vs peer systems (Superpowers, Beads). Four pillars to close the gap: 1. REASONING- |
| 1b6c1529 | Forge governs IMPLEMENTATION even when a foreign skill system (Superpowers etc.) is invoked — foreign skill = knowledge, Forge = structure | open | feature | Owner vision for how Forge should compose with OTHER skill systems installed alongside it (e.g. Superpowers): when both Forge and another system are present and the agent invokes a FOREIGN s |
| 1ff3d2f9 | Ship standalone Flow runner assembly through public APIs | open | bug | Baseline 7393dd9d shows @forge/flow installs and its focused tests pass, but the public package cannot execute the required portable WorkPacket -> RunReceipt journey without a caller-supplie |
| 209d80bc | Authorize official generated-harness skill mirror writes | open | bug | The official skills mirror writer (forge setup / scripts/sync-agent-skills.js) deterministically regenerates .agents/skills from canonical skills/, but protected-state authority only recogni |
| 2c4dff71 | Add Shepherd shadow replay and non-circular control-plane break-fix lane | in_progress | task | Capture replayable Shepherd operands, compare installed and candidate runtime verdicts, classify persistent contradictions as incidents, and provide a stable-base control-plane hotfix/activa |
| 32ca73fd | [live-link] Dashboard capability-detect + subscribe() SSE + copy-to-Run upgrade (DataSource seam) | open | task | Fable live-link design, build item 2. On boot the dashboard tries fetch(/health): file:// or no server => Tier-1 (baked snapshot + copy-as-command, badge SNAPSHOT); server present => refetch |
| 4a32d61b | Cross-harness Shepherd auto-wake adapters and capability truth | open | task | Verified 2026-08-07: Forge has the repo-singleton Shepherd and push/ship wakes, but only Claude currently receives an executable session-start wake. Cursor, Codex, and Hermes are represented |
| 4e97d68d | Track exact-head terminal state for every registered PR reviewer | in_progress | bug | Guarded merge can prove checks and threads yet still lack evidence that every configured reviewer account has completed, skipped, exhausted its quota, or timed out on the current head. PR #4 |
| 4f436ee2 | Collapse release critical path with adversarial worker swarms and durable transition control | in_progress | task | Measured release-train evidence shows that coding speed is not the dominant delay. Repeated exact-head invalidation, late provider/gate semantics, manual waits, and control-plane defects dom |
| 50571aa3 | Fix PR 524 late lifecycle and privacy findings | review | bug | Post-merge prerequisite audit for PR #524: https://github.com/harshanandak/forge/pull/524#discussion_r3766612152 ; https://github.com/harshanandak/forge/pull/524#discussion_r3766612158 ; htt |
| 57fb8889 | [epic] Autonomous shepherd — PR-owned, session-independent monitoring via a reconcile loop (never invoked, self-healing, agnostic) | open / blocked | epic | Owner north star (2026-07-19): shepherd must do everything independently — never invoked, surviving session end/start, reboots, and PRs opened outside any session. ROOT FLAW today: the watch |
| 5f4da13f | PR5 integration: facade, harness, and capability negotiation | open | task | Purpose: deliver the approved PR5 public facade, harness capability negotiation, proportional validation v0, and the minimal freedom-envelope projection after PR4B. One end-to-end owner comp |
| 64d6c458 | [epic] Forge activation & progressive-setup direction (global-activate, agent-auto-init, superpowers-flow, toggle-per-task) | open | epic | DIRECTION from the CuraPod real-usage session (Windows + Claude Code, docs/planning repo; log: Downloads/curapod-session-forge-debug.md). Forge is installed but does NOT auto-activate inside |
| 6b56673a | [memory] Supersession + staleness/dedup hygiene (fixes the 296-issue auto-file flood) | open | task | Both flag: auto-capture without decay ROTS. Add (a) supersession -- mark a note/issue superseded(old,new); recall filters superseded by default (Engram supersede + Gentleman semantic conflic |
| 6ddd30c6 | PR4B B2: Flow-backed PR monitor durability and replay | open | task | Implement the PR4B B2 Flow-backed monitor lane stacked on PR #524 exact head aa6655476989b5a4780612e198c730e63617d380. Exclusive source scope: new lib/pr-monitor/flow-monitor.js plus lib/pr- |
| 6df11003 | Encode adaptive release-swarm contracts in canonical Forge skills | in_progress | task | Update plan/dev/review/shepherd/ship canonical skills and byte-identical .agents mirrors with adaptive full-capacity role waves, immutable exact-head packets, structured findings, single-wri |
| 6f2dbe75 | Open the harness-adapter registry and certify OpenCode Pi and DeepSeek Harness | open / blocked | feature | Forge currently hardcodes Claude, Codex, Cursor, and Hermes in capability probes and render targets. Generalize existing PR5 capability negotiation (5f4da13f) and the Smith execution adapter |
| 70c97899 | Forge adoption friction — Product-Suite beta.2 (Windows, cloud-synced, pre-gated) | open | epic | Environment: Forge v0.1.0-beta.2 run via local bin/forge.js on Windows 11, inside an existing repo that had a prior June setup plus its own lefthook gates, on a cloud-synced Downloads folder |
| 84c942f3 | Normalize adapter permission retry resume and cancellation semantics | open / blocked | bug | Agent Companion's nominal policy.write maps to different powers in OpenCode, Pi, and DSH. Resume is documented as one read-only retry but implemented for unlimited terminal jobs, and DSH can |
| 85be2945 | Define durable WorkItem Run Attempt authority and completion contracts | open / blocked | feature | Cross-session evidence shows that narrative handoffs, plan Markdown, Kernel issues, worktrees, PRs, and child messages drift independently. Define the minimal durable substrate before adding |
| 8a3ee1f0 | Implement durable release transition controller and critical-path telemetry | open | task | Build the lease/heartbeat/reclaim controller that consumes Shepherd events and owns merge through next-at-bat, with segmented cycle-time telemetry and bounded recovery. |
| 8e634347 | Cut 0.1.0 release (version bump + CHANGELOG + ~7-doc version sweep + tag/publish) | open / blocked | task | P-high, USER-TRIGGERED. Prepared release commit exists on branch chore/release-0.1.0 (.worktrees/release-0-1-0). |
| 95372af8 | Fix published npm package missing runtime workspace modules | in_progress | bug | The live forge-workflow@0.1.0-beta.6 tarball installs but forge --version crashes with MODULE_NOT_FOUND for ../../packages/memory from lib/kernel/migrations.js. Fix the root package boundary |
| 9af1ee0a | [shepherd] Comprehensive defect audit (Fable) -- gaps beyond PR #366 | open | task | Full audit ranked P0-P2. P0 false-clean (A1 swallowed thread-read in --pull pr-pull.js:346-353 -> reviewThreads:[] indistinguishable from clean, adopt pr-bundle available/error envelope; A2  |
| c2d398e5 | [epic] Constant agent-agnostic PR monitor -- forge shepherd watch/events (pushes events every ~60s) | open | epic | User requirement: shepherd must run CONSTANTLY (~60s), pull ALL PR updates, and PUSH only new events back to the working agent, agent-agnostic, clean with every agent. Design (Fable), ground |
| c5112cd4 | PR4B B3: restart-safe watcher lifecycle execution | open | task | Implement the restart-safe lifecycle execution lane over the frozen B1 reducers, public @forge/flow process lifecycle, and public @forge/memory PR lifecycle authority. Exclusive production o |
| c94f36f9 | Recover deleted generated skill mirrors after interrupted sync | open | bug | Post-merge review of PR #526 found that generatedDriftPaths can discover an unstaged deleted mirror, but walkRegularFiles cannot visit the absent path. After interruption before deletion com |
| ce785690 | Compile Agent Config into non-bypassable routing privacy and reachability policy | open / blocked | feature | Agent Config and Agent Companion currently maintain separate routing authorities. The request schema cannot carry enforceable provider-retention/ZDR policy, candidate exhaustion can fall bac |
| d362bd71 | Behavioral eval tier + holdout improvement loop | open | feature | `forge skill eval --full`: live runs via scripts/eval_win.py (Windows-safe), 60/40 holdout, x3 for variance, with-vs-without outcome grading (reuse run-command-eval.js + skill-creator run_lo |
| d6a74dc8 | Restructure Forge into independent Memory and Flow products with stable contracts | in_progress | epic | 1. R1-R19 remain locked or are revised only by explicit user decision. 2. admission-evidence.v1.json proves every included implementation/migration issue has revision-checked executable acce |
| da760874 | Resolve global and repository skill collisions through one artifact registry | open / blocked | bug | Live discovery found 25 overlapping Forge skill names between the global Codex root and the repository root, and all 25 SKILL.md hashes differ. The tracked canonical-to-repository mirror is  |
| de47800f | Reduce Forge idea-to-merge time with tiered CI and event-driven sessions | in_progress | task | Scope: plan a fail-closed T0-T3 PR classifier with one stable aggregate and mutually exclusive lanes; fast CodeRabbit trigger; proportional reviewer/session policy; event-driven Shepherd; ex |
| e44ced01 | [BETA] Implement decision-store conflict→approval→supersession loop | open | epic | Core feature: kernel schema + FTS5 + conflict detection + user-gatekeeper approval. Engine: forge design check --topic <key> |
| eb2f1753 | PR7 integration: release convergence and 0.1.0 evidence | open / blocked | task | Purpose: freeze the exact 0.1.0 RC candidate after PR6, finish issue disposition/security/evaluation/release gates, prove the preserved beta.5 rollback baseline, publish migration/rollback g |
| eed58484 | Version provider lifecycle envelopes and fail closed on format drift | open | task | Create a data-driven registry for review, status, deployment, and automation comment envelopes (CodeRabbit, Qodo, GitHub Actions, Forge monitor, SonarCloud, Codecov, Vercel and future provid |
| f1af41ef | [epic] Shepherd merge-safety redesign — one trustworthy agent-agnostic verdict | open | epic | The PR shepherd was untrustworthy: on #365 it would report MERGE_READY with 13 unresolved CodeRabbit threads. Root causes (reviewer-verified): (1) --pull/--bundle --json emit nothing (handle |
| f2a96ff1 | PR6 integration: migration, shadow comparison, and extraction readiness | open / blocked | task | Purpose: deliver approved beta.5 upgrade, reversible cutover, shadow comparison, sparse package builds, and signed BOM verification from exact PR5 package candidates. Exclusive ownership: mi |
| f30e5d29 | Critical merge-flow reliability and measurement program | in_progress / blocked | epic | Restore a fast, trustworthy release train by fixing Forge control-plane truth, zero-token monitoring delivery, contract-ready intake, and one exact-head merge slot. Integrates existing merge |
| f5f82593 | [activation] Ship Forge as a globally-active Claude Code plugin (skills+verbs available in ANY project, zero per-project install) | open | feature | FOUNDATIONAL. GAP (CuraPod session): superpowers auto-activated in the project because it is a user-GLOBAL Claude Code plugin -- its skills live at ~/.claude/plugins/cache/claude-plugins-off |
| forge-6hzl | forge new onboarding wizard | open | task | First-run interactive wizard. Detects active harness (Claude Code / Cursor / Codex CLI), picks template variant per stack (web-app / library / CLI), runs forge migrate from non-Forge state i |
| forge-besw | EPIC: Forge v3 Skeleton Architecture | open | epic | Forge pivots from a fixed 7-stage workflow to a layered skeleton: L1 locked rails (TDD gate, branch protection, hard-gate runtime), L2 swappable defaults (stages, gates, adapters in .forge/c |

### P1 — 231 unresolved, 212 literally open

| ID8 | Title | State | Type | One-line scope from live issue |
|---|---|---|---|---|
| 0093a02a | [epic] Memory enhancements (inspired by Claude Memory Palace + Engram research) | open / blocked | epic | Research 2026-07-13 of two similar projects. Claude Memory Palace = MemPalace (github.com/mempalace/mempalace, verbatim+spatial+hybrid retrieval 96.6% R@5, but PULL-ONLY, 28-tool MCP = 4-8K  |
| 00eef22d | Fix Shepherd BLOCKED-THREADS verdict when zero threads remain | open | bug | On PR #480 head c36609d4 after all checks passed and its only thread was resolved, orge shepherd 480 --pull --json returned verdict BLOCKED-THREADS and summary NEEDS_REVIEW while also report |
| 048e1c45 | Remove vendor-specific AI attribution from agent-agnostic workflow artifacts | open | bug | No description recorded. |
| 0498f8a8 | Prevent --help from activating workflow stages | open | bug | No description recorded. |
| 04d63900 | Compiled binary setup loses assets after delivery-push changes | open | bug | PR 572 exact head 7bb64afc fails the npm-vs-binary parity gate after both setup commands exit successfully: npm output has 355 files, compiled output 244, with 111 missing binary files and 2 |
| 077901a3 | Post-merge: Windows Node 22 full matrix failed after PR572 | in_progress | bug | Verified PR572 merged at13268a58d1261e00e0c8e79e0441e529c973decc and its complete Git tree matches validated PR head3b465c8dbc15889a5cfbc3fad3b17a0db1b81a77. Exact-merge Tests run35495960425 |
| 08849407 | seed issue | open | task | No description recorded. |
| 08eae8f8 | Auto-capture agent: background conversation -> kernel capture of ideas/bugs/decisions | open | task | A background agent that instantly records discussed ideas/bugs/decisions/TODOs into the kernel as issues (with provenance) so nothing discussed is ever lost; complements the friction-miner ( |
| 0b3c0c50 | Windows process identity spawns PowerShell per call (seconds each): slow push proof and flaky check-forge-token test | open / blocked | bug | scripts/process-tree.js readWindowsIdentity runs 'powershell.exe -NoProfile -Command (Get-Process -Id N).StartTime...' for EVERY identity read. On a loaded Windows CI runner each call costs  |
| 0be2a533 | Preserve github run delimiter through npm PowerShell shims | open | bug | The npm-installed Forge v0.1.0-beta.7 PowerShell shim consumes the literal -- in forge github run -- <program>, so the CLI prints usage. Invoking the adjacent forge.cmd with identical argume |
| 0d4b064f | Gate status lacks deterministic expiring-waiver read model and valid empty JSON | open | bug | Discovered while addressing Product-Suite PR #157 from the architecture-conformance worktree on 2026-08-07 with forge-workflow v0.1.0-beta.4. Current forge gate status events expose event_ty |
| 0f3f69f4 | EPIC: forge efficiency + extensibility + cross-platform strategy (2026-07-05) | open | epic | Tracks docs/work/2026-07-05-efficiency-extensibility-strategy/strategy.md: 7 pillars + cross-platform + ctx build-by-corpus, executed in phases A/B/C. |
| 0f6ce951 | Pin Forge feedback intake and idempotent receipt contract | open | task | The client slice intentionally has no deployed private intake URL. Before production activation, Forge must pin the trusted cloud origin and define server receipt/idempotency behavior; an ar |
| 10931a7a | Investigate intermittent memory.recall.observed selected-outcome persistence failure in full-suite Windows runs | open | bug | No description recorded. |
| 11e5ef49 | Forge push must use the resource-aware full-suite runner | in_progress | bug | On Forge repo changes, forge push currently invokes package.json test as one raw bun test over 604 files. The resource-aware canonical runner passed 8130 tests with 0 failures, while raw pre |
| 1390e1d1 | EPIC: Forge lifecycle self-enforcement — kernel-authoritative hygiene | open | epic | Standing user directive (2026-07-07): make Forge structurally enforce its own lifecycle hygiene so nothing is ever lost or left half-done — via the kernel as the authoritative work source +  |
| 13b80fb1 | [PHASE-2] GitHub identity + OAuth (ADR-0003) | open | epic | Device-flow CLI auth + GitHub App repo scoping. Actor = GitHub user + session id. |
| 159ff6ba | Validate security audit misclassifies high advisories as moderate/low | open | bug | Fresh bun run check on 2026-07-29 reported 14 dependency vulnerabilities (8 high, 5 moderate, 1 low), including fast-uri GHSA-4c8g-83qw-93j6 and GHSA-v2hh-gcrm-f6hx, but scripts/validate.js  |
| 15aa2a8c | Fix recurrent Windows Node 24 fixture spawn and timeout contention | open | bug | No description recorded. |
| 1694b724 | shepherd --pull reports BLOCKED-THREADS while its own evidence shows zero blocking signals | open | bug | Repro (PR #538, head 40672046, 2026-08-22): forge shepherd 538 --pull --json returns verdict=BLOCKED-THREADS state=NEEDS_REVIEW alongside evidence.unresolvedThreadCount=0, evidence.botCommen |
| 18bee669 | Phase B: forge context verb -> retire the 28 beads-context.sh shell-outs + delete fallback forks (single highest-leverage item) | open | task | Common acceptance rules for every row below: 1. Evidence is bound to the issue id/revision, WorkPacket hash, exact head, risk-manifest digest, and owning gate receipts. 2. `INCOMPLETE`, stal |
| 1bc68fd8 | Review convergence: one correction SHA before full CI | open | task | PR #468 required repeated full matrices because review feedback arrived after each push and every correction invalidated prior SHA evidence. Make review convergence authoritative: collect a  |
| 1cc3c7ea | Recognize bun.lock when detecting test package manager | open | bug | Discovered while validating eval evidence issue 02f5ea90-4a1a-462f-9b22-54eb5d37f6b3. lib/commands/test.js recognizes bun.lockb but not the repository's bun.lock, so validation falls back to |
| 1d5ab52f | [gui] Forge MCP server -- forge_inbox (+ mutation) tools = the GUI delivery surface for the unified inbox | open | task | Forge MCP server = the GUI delivery surface for the unified inbox (cited GUI cross-check 2026-07-13). 4 of 5 desktop agents are MCP HOSTS that call local stdio servers -> register Forge as a |
| 1db094c6 | Classify rate-limited review bot comments without empty Shepherd blockers | open | bug | PR #522 at exact head cc28d3c01b3298180c3d2c5d9be2cbf25cb2093c had 37 passing checks, only 3 intentional skips, zero review threads, no check failures, mergeable/CLEAN, behind=0, and no CHAN |
| 1e7e0057 | Promote FORGE_STAGE_GATE=strict to a rail.stage_order gate toggle | open | task | The B1 fix (issue a3bcb34a) makes `forge ship`/`review` stage-gating degrade to warn-and-proceed by default, with the old fail-closed behavior restored only via the env var FORGE_STAGE_GATE= |
| 1f76ff32 | [beta-adoption] Windows: ship .gitattributes (*.sh text eol=lf) + bundle/auto-install lefthook | in_progress | bug | Windows-first papercut with a real risk. Shipped .sh scripts + skills trigger CRLF warnings on every commit; NO .gitattributes ships to pin eol=lf on the shell scripts — CRLF can BREAK .sh e |
| 1fc448fa | Fix Agent Companion Windows progress-flood persistence backpressure | open | bug | The current Agent Companion suite reproducibly lets a progress-event flood delay a 50 ms timeout beyond the 10-second test ceiling on Windows. A managed OpenCode spawn-error preservation tes |
| 204fbfee | Persist full-suite terminal aggregate across caller timeouts | in_progress | task | The fixed full-suite runner completed four fresh exact-shard reports at SHA be82be84df1d1c7320710d2757f92219da471e83: 6,585 tests, 19,294 assertions, 30 skipped, zero failures, expected +16  |
| 2286ede8 | Fix Shepherd bot-comment blocker projection | open | bug | Bot direct comments keep provider IDs and appear in blockers; regression covered; no changes to release PRs. |
| 24512804 | Prevent ambient credentials from entering test failure diagnostics | open | bug | During authorized push-delivery development, a mocked spawn assertion compared opts.env against undefined after production began explicitly passing a scrubbed child environment. Bun printed  |
| 247ec784 | Diagnose master Sonar new-security rating regression after PR #530 | open | bug | Exact master 6202d50 has Sonar Quality Gate ERROR only on new_security_rating=2 (threshold 1), while PR #530 gate is OK and master issues API reports zero new open issues. Determine whether  |
| 26209ee2 | [workflow] Edge-case + blast-radius verification as a first-class phase capability (plan anticipates, validate enforces) — cut rework/extra-PR cycles | open | epic | PROBLEM (observed repeatedly in the 2026-07-11 beta build): an agents fast/local test subset (or forge push --quick) passes, but the FULL CI suite then catches failures — registry drift (SUB |
| 265774da | Fix Shepherd false behind-base blocker | open | bug | forge shepherd --pull reported both PR #487 and #488 as four commits behind base while git rev-list origin/master...HEAD proved 0 behind/1 ahead and GitHub baseRefOid equaled origin/master.  |
| 269b4c56 | forge verify records the stage then falls through to Unknown command | open | bug | During post-merge verification of PR #551, invoking forge verify from the linked feature worktree recorded issue 1f7baefc at verify/active, then exited nonzero with Unknown command verify. T |
| 26c5101a | Stabilize dep-guard ripple analyzer under subprocess load | open | bug | The exact subprocess shard test at test/dep-guard.check-ripple.analyzer.test.js line 83 returns a concrete spawnSync status and passes in two consecutive runner-lifecycle reproductions under |
| 26e7098f | forge push --quick hardcodes missing legacy branch-protection.js | open | bug | Reproduction: with Forge v0.1.0-beta.4, run forge push --quick from the Product-Suite seroval security branch codex/fix-seroval-security. Forge aborts before the network push because it atte |
| 291d09b0 | Prevent push-token expiry from rerunning already validated tests | in_progress | bug | Observed during normal push of a07012e0 after canonical validation passed617files with no timeouts and exact-head receipt verified valid. Push logged Tests reused; branch protection and lint |
| 29a23d70 | Make packed GitHub account-context fixture independent of clone account selection | open | bug | During canonical validation for issue 351118da-5d87-404d-bb18-bdd3c784f93d on 2026-09-26, test/integration/github-account-context.test.js failed because the installed Forge fixture could not |
| 2b71e189 | [activation] Self-initiating, adaptive Forge skill flow modeled on the superpowers brainstorming->plan->execute chain | open | feature | INCREMENTAL. Forge's skills should announce themselves and CHAIN the way superpowers did in the CuraPod session, which the owner called brilliant. WHAT MADE IT WORK (capture + match): (a) it |
| 2c3fbfb5 | seed issue | open | task | No description recorded. |
| 2d51a6de | [shepherd] Reap duplicate watcher registrations across reconcile ticks | open | bug | Live PR #467 evidence: a healthy singleton lease accumulated a new watcher entry roughly every minute for the same PR; the first entry had repo=forge and later entries had repo=null with sho |
| 2de19e09 | Rebuild shepherd watcher authority as one state record | in_progress | refactor | PR #537 proved the current watcher coordination model unsafe: authority is duplicated across daemon watcher arrays, journal locks, PID files, generation claims, cleanup markers, ACTIVE_DIRS, |
| 2e2dd4e8 | Simplify validation and GitHub Actions into one risk-based evidence pipeline | open / blocked | task | Current local validation, pre-push hooks, sharded full suite, required-check bypass, platform matrices, review checks, and release workflows duplicate work and produce incomplete terminal re |
| 2f286a2a | Restore kernel and issue-basics skill adapter commands | open | bug | Installed Forge rejects the mandatory skill adapter entrypoints 'forge kernel' and 'forge issue-basics' as unknown commands, even though canonical skills require invoking them before the wor |
| 319501f3 | Select validate/push/merge flow deterministically by classified change type | open | feature | User direction 2026-09-28: not every change needs the full end-to-end ceremony (local canonical validate --shards 4, then push, then PR). Forge's gates should deterministically pick the ligh |
| 3223e37e | Chain-correctness eval type | open | feature | New eval type asserting the transcript shows the declared `next` skill actually fired; parse via NDJSON in scripts/lib/eval-runner.js. Feeds the W3 scorecard's chain-correctness parameter. |
| 330ba18d | Shepherd automatic startup must establish a healthy running watcher or expose failure | open | bug | Deferred by user while PR567 review is completed. Automatic push wake launches a detached daemon, but successful spawn is not proof of monitoring. On 2026-09-18 daemon journal recorded four  |
| 33d6dce9 | [memory] Attention-following injection -- PreToolUse:Read hook injects notes about the file being read | open | task | claude-mem's standout idea (Forge lacks it). A PreToolUse:Read hook injects prior remembered notes + closed-issue learnings ABOUT the file/path the agent is opening -- memory follows the age |
| 363954dd | [epic] Dashboard as customization cockpit -- surface + edit the extensible workflow + comment-back-to-agent | open | epic | User vision (2026-07-13): evolve the Forge dashboard from a read-only view into the CUSTOMIZATION/CONFIGURATION surface -- the "give users the hammer and shovel" extensibility north star mad |
| 376dfc15 | Propagate forge push --quick into Lefthook fast mode | open | bug | Forge v0.1.0-beta.5 prints Tests skipped (--quick), but the spawned git push strips PREPUSH_GATE_FAST before Product-Suite's documented Lefthook prepush-gate receives it. Two live attempts r |
| 3799f30c | Super-skills/sub-skills structural reorg (user-defined skill trees) | open | feature | Implement real composable super-skills: a thin orchestrator resolves and invokes bounded subskills at runtime based on intent, risk, evidence, and current stage. References and examples rema |
| 3a5a7871 | PR delivery efficiency and review signal | open | epic | Post-merge work to reduce review-comment amplification and shorten the local push and CI feedback loop without weakening required quality gates. |
| 3b863d8b | Smith: harness execution capability adapter for spawn, message, interrupt, resume, and isolation | open / blocked | task | The live harness capability matrix covers rendered workflow surfaces but not worker execution. Define one honest adapter contract Smith can query for spawn, addressed message delivery, inter |
| 3b98b391 | Make PR merge-order diagnostics cycle-tolerant | open | bug | During ship for e377256c, scripts/pr-coordinator.sh merge-sim reported no base conflict, but merge-order exited 1 with 'dependency cycle detected — cannot compute merge order'. A global depe |
| 3c2e933a | Generated harness files reference commands and skills that do not exist in the target repo | open | bug | Forge's generated harness pack emits instructions that reference commands, skills and files that do not exist in the target repo. Because the dead references come from the generator, fixing  |
| 3ce7c502 | Stabilize fail-closed validate orchestration regression under full-suite load | in_progress | bug | Canonical validation on delivery-push head 973ae530 emitted a TimeoutError after 30.632262s for test/commands/validate.test.js:277: does not skip a failed full-suite child whose diagnostics  |
| 3d119b4c | [live-link] AWE demo + docs -- forge dashboard one-command split-screen live loop | open | task | Fable live-link design, awe factor. forge dashboard = one command: loopback-only token-guarded server, auto-opens the browser, dies with the session, no account/cloud/daemon, ZERO agent toke |
| 3d23862e | Allow terminal PR linkage evidence when a required gate is explicitly disabled | open | bug | Kernel broker derivePrEvidence requires a nonempty gate_ids array and resolveGateReceipts requires an active gate.approved event. A disabled gate is satisfied by the runtime without creating |
| 3e56f635 | Worktree sprawl: ~35 stale .worktrees/ entries from long-merged branches accumulate with nothing reaping them | open | bug | `git worktree list` in the primary repo shows ~35 entries under .worktrees/ (plus ~10 under .claude/worktrees/), the large majority on branches whose PRs merged weeks ago (pr-monitor, pr-mon |
| 3f2c103b | Adopt correct out-of-band actions into Forge state instead of refusing later | open | feature | User direction 2026-09-28: there are multiple correct ways to do things outside Forge (e.g. opening a PR with raw gh pr create, pushing with git, editing via another harness); Forge must map |
| 409e13f9 | Investigate intermittent pr noun global-flag dispatch parity failure in full-suite Windows runs | open | bug | Reproduced 2026-08-07 in supported Windows full suite: 1 failure among 6,544 tests. Failing case is pr noun ship dispatch parity for nonexistent-slug-xyz; the other 9 cases in the file passe |
| 436447fa | Windows Node 22 BM25 router test exceeds the 15-second budget | open | bug | Exact-head manual Tests run 34470990094 at 37793fcd failed Full Matrix windows-latest / Node 22 because test/memory/router.test.js case 'recall with a query does token-AND BM25 matching (ord |
| 44ed41f0 | Forge multi-harness and skill-orchestration redesign | open | epic | Source-backed audit of completed Codex, Claude, and OpenCode sessions; current Forge plans/tasks/issues and skill-invocation conflicts; local Agent Companion, Agent Config, Agent Handoff, an |
| 451c8828 | Canonicalize token-efficient merge-train orchestration across agent workflows | open / blocked | task | Project-wide workflow gap verified 2026-07-28: dev/review/ship define per-PR ownership, pushing, and feedback settlement, while Shepherd removes mechanical polling, but no canonical skill de |
| 4906a3dd | Move review thread resolver to a harness-neutral script surface | open | bug | The canonical review workflow invokes .claude/scripts/review-resolve.sh even though listing, replying to, and resolving GitHub review threads is host-agnostic. This makes Codex, Pi, OpenCode |
| 4aed2cc8 | Reuse validation evidence and remove exact duplicate test lanes | in_progress | bug | A full forge validate followed by an immediate raw git push reruns the same comprehensive suite in the pre-push hook, adding roughly 12 minutes without new code or evidence. Forge should bin |
| 4d4e027c | Evaluate cluster relationship strength + sub-skill composition (independent/composed/sub-level; efficiency+depth) | open | task | No description recorded. |
| 4d831b25 | Add reversible plugin lifecycle and transactional profile reconciliation | open / blocked | feature | Adopt the useful Cordis/DeepSeek Harness lifecycle mechanisms without replacing Forge Kernel or making Cordis a mandatory dependency. Define typed capability providers, owned disposers, reac |
| 4e2b31c4 | PR #537 late receipt and watcher cleanup review fixes | open | task | No description recorded. |
| 50d3f2c3 | Isolate process-tree unit tests from inherited shard manifest | open | bug | Local bun run check spawns test shards with FORGE_TEST_PROCESS_MANIFEST/TOKEN/INSTANCE. test/scripts/process-tree.test.js passes 17/17 alone but fails 12 cases under those inherited markers  |
| 51672736 | Make pre-push full-suite tests deterministic across parallel shards | open / blocked | bug | Purpose: stop unrelated shared-state/time-based test flakes from blocking validated PR publication. Evidence on rebased PR #538: mandatory pre-push full suite passed 2034 tests and failed on |
| 518e49a3 | Privacy-safe CLI feedback and diagnostic reporting | in_progress | epic | Fixed allowlisted Forge-owned failures only; exact structured preview; explicit interactive send-once or enable consent; non-interactive never prompts or sends; decline suppresses only that  |
| 52ebe3fd | [shepherd] De-CodeRabbit-center the docs/skill/examples — present shepherd as ANY-review-bot (fix the dependency PERCEPTION) | open | task | From an agnosticism audit (2026-07-14): the CODE is agnostic, but the DOCS/EXAMPLES over-cite CodeRabbit, creating a false 'CodeRabbit-dependent' impression (user hit exactly this questionin |
| 54b54219 | Make pre-push runner targeted-mode test deterministic on Windows Node 24 | open | bug | PR #496 exact head 1d81c6f3 passes Windows Node 22 and every other CI lane, but Windows Node 24 fails deterministically in test/scripts/test-runner.test.js: runPrePushTests runs targeted tes |
| 56a99d9b | Remove Beads importer and compat code for 0.1.0 (D46) | open | task | Per locked decision D46 (docs/work/2026-04-28-skeleton-pivot/locked-decisions.md), Forge 0.1.0 ships no Beads importer. Remove forge migrate --from beads, lib/adapters/beads-kernel-compat.js |
| 5a10170d | Reduce PR review comment amplification | open | task | Post-merge follow-up from PR #537. Repeated head pushes retriggered multiple review bots, producing 92 conversation comments, 129 inline review comments, and 116 submitted reviews; bot outpu |
| 5bdc91d3 | Customer lifecycle: forge setup quality hardening (option completeness + easy UX + agent/CLI parity) | open | task | Setup asks the right questions + configures the FULL option surface (agents, review adapters, external services, issue-backend, gates, roles, hooks, MCP, profile); one-command safe path; par |
| 5ded6d2a | [BETA] Implement forge design CLI (check/sync/list) | open | task | design check --topic: FTS5 + conflict gate. design sync: regen PROJECT_DESIGN.md/subsystems. design list: show all/promoted/superseded. |
| 5e085fe5 | Windows Node 22 memory recall holdout still exceeds 15-second limit | in_progress | bug | Regression after issue e4047527 and PR #553: exact-head PR #557 Tests run 34538281451 failed the already-exclusive memory recall holdout at 16.4s. The first fixture performs 27 SQLite memory |
| 619e1cd4 | Allow shepherd to bind existing raw-GitHub PRs to exact active worktree issues | open | bug | forge merge --auto requires an authoritative open kernel_pr row linked to the supplied issue, but PRs created through raw gh pr create are self-registered by shepherd with null issue/worktre |
| 635695bc | memory-recall-holdout 'foreign rows cannot crowd…' times out on Windows CI (quarantined) | open | bug | master Tests run 36345257796 at 9177b664 (Full Matrix windows-latest / Node 22, exclusive lane): test/e2e/memory-recall-holdout.test.js:77 'foreign rows cannot crowd an unseen local memory o |
| 6648ef9b | Stabilize Flow monitor bounded-tail test in linked worktrees | in_progress | bug | The unchanged origin/master Flow monitor test advances delivery authority across 130 advisory checkpoints in 13-21s and exceeds the enforced 15s ceiling in linked worktrees. This blocks full |
| 66e6890a | Fix Bun global install for bundled workspace packages | open | bug | On Windows with Bun 1.4.2, bun add -g forge-workflow@beta resolves v0.1.0-beta.7 but fails with npm 404 responses for @forge/flow@0.1.0-beta.6, @forge/memory@0.1.0-beta.6, and @forge/contrac |
| 6c66b27e | Harden Windows standalone package smoke cleanup | open | bug | PR #537 run 32189738209 job 95881495179 failed only test/integration/standalone-package-smoke.test.js: Flow pack/install hit the fixed 30000ms timeout, then afterEach rmSync failed EBUSY on  |
| 6c742d64 | [PHASE-2] Self-hosted libSQL server (ADR-0002) | open / blocked | epic | Stand up sqld primary + HA + embedded replicas. Verify libSQL maintains broker.js error text compatibility. |
| 6d99196e | [activation] Progressive setup: grow capabilities on-demand as the project needs them (configure-properly stays available, never forced upfront) | open / blocked | feature | INCREMENTAL (builds on auto-init). Setup should GROW as implementation proceeds -- add capabilities (gates, enforcement hooks, review adapters, MCP, roles, issue-backend choice) only when th |
| 6eb0147a | Measure and reduce repeated Git fixture setup in protected-state validation | open | task | Canonical budget-2 validation on 2026-09-24 completed in 21m52s at 6121400fe71919222191a01c84ab3fef26ac4cae. Profile attributed 99.037s to test/protected-state-surfaces.test.js, the largest  |
| 6eb8207b | Phase A (cross-platform): unify Windows Git Bash resolution (resolveGitBash: hardcoded -> where.exe -> git --exec-path -> scoop; invoke absolute path) | open | task | No description recorded. |
| 6f11d483 | [dist] Single static binary via bun build --compile — download-and-run on any OS, no Node/Bun install (additive to npm) | open | epic | Decision doc: docs/work/2026-07-12-rust-vs-js-decision/decision.md (Fable, 2026-07-12). Verdict: STAY JS, ship a single static binary via bun build --compile (NOT a Rust rewrite). Forge has  |
| 6ffbea43 | forge validate bypasses project scripts and runs bare Bun discovery | open | bug | Reproduction: with Forge v0.1.0-beta.4, run forge validate from the Product-Suite repository or its seroval-security worktree. The adapter launches bare bun test discovery across the monorep |
| 719e5c84 | Stabilize stale-worktrees v2 fixture materialization on Windows | open | bug | A frozen-dependency full-suite run on da9e4353 terminated normally but shard 0 intermittently failed test/v2-fixture-corpus.test.js: stale-worktrees materializes into a valid synthetic repo. |
| 724749d4 | Audit and sequence Forge performance, stability, and test throughput improvements | open | epic | Purpose: make Forge development materially faster and more stable across local commands, pre-commit/pre-push hooks, the full test runner, and hosted Linux/macOS/Windows CI. Establish measure |
| 7268bc9b | [control-plane] Hook adapter consults controls (warn/deny/deny-unless-approved) + honest per-harness downgrade | open | task | Fable design, build item 4. The .forge/hooks adapter (forge-native-hook.js) reads the resolved controls: mandatory=deny (today), optional=warn-only, permission=deny-unless-approved (TTL even |
| 732bd0fa | Reconcile Kernel state into plan and design projections | open / blocked | bug | Current product-restructure tasks, decisions, PROJECT_DESIGN, release version, harness inventory, skill path, and hook references have drifted behind live Kernel/package/runtime state. Exten |
| 73456b97 | Move tests to the right boundaries: e2e coverage for public surfaces, retire obsolete internal tests | open / blocked | task | User direction 2026-09-27: many older tests pin internals from earlier designs (e.g. retired Beads/bd paths per D45, pre-kernel shapes, superseded command internals). The code has moved, so  |
| 73714c21 | Forge final plan: research-backed revamp of the 0.1.0 plan (replaces #564 as written) | open | task | Owner direction 2026-09-30: the 0.1.0 release plan (#564) needs a whole revamp, with several evaluation rounds, on how to move forward: the final plan for all changes, how they get implement |
| 74f9c068 | Smith: issue execution budgets and deterministic failure routing | open / blocked | task | Make issue supervision budget-aware using compact Kernel evidence: agent calls, tokens when available, elapsed time, test executions, CI runs, review turns, and branch updates. Route failure |
| 765a4cd8 | Merge authority must ignore successful skipped and neutral optional checks | open | bug | Merge authority accepts passing required checks plus successful optional `SKIPPED`/`NEUTRAL` observations. Required failure, optional failure, stale head, or unresolved actionable thread blo |
| 7b60525b | Make Forge actor/session identity explicit and reject ignored flags | open | bug | A live lease check reproduced an identity mismatch: issue owns with an explicit --actor value silently resolved actor=forge and denied ownership, while FORGE_ACTOR resolved the claimed actor |
| 7d3772cd | Shepherd watcher migration gate stuck in conflict (legacy_identity_unmappable) since 2026-09-18 | open | bug | GPT-6 Sol research 2026-09-28 (read-only): the kernel watcher-migration gate is 'conflict' with code legacy_identity_unmappable, recorded 2026-09-18. Eight legacy monitor directories have a  |
| 7da81cbd | smith orchestrator v1 — thin super-skill composing stage sub-skills with gate events + planning-phase autonomy calibration (size x importance x complexity) | open / blocked | feature | Smith composes stage sub-skills through typed gate events and size×importance×complexity autonomy. Replay proves deterministic routing, bounded handoffs, budget/failure authority, and termin |
| 7e1245e7 | Canonical Review skill requires missing forge review stage adapter | open | bug | Reproduction: on Product-Suite PR #158 with installed Forge v0.1.0-beta.4, follow the canonical Review skill before addressing PR feedback and invoke forge review. Forge returns Error: Unkno |
| 7f8c8471 | Smith and claim-safety skills require missing CLI adapters and Smith reference asset | open | bug | Product-Suite Wave 1 reproduction: installed smith SKILL.md requires invoking forge smith and reading references/autonomy-and-gates.md; installed skill contains no references directory, forg |
| 7fb07160 | [PHASE-2] External-refs table + adapter generalization | open | task | Kernel table for (entity, provider, external_id, revision). Replaces GitHub-hardcoded link-store.js. Enables Jira/Linear/custom. |
| 8168bee5 | Make bound GitHub accounts transparent to normal Git and gh launches | open | feature | Optional first-class routing for repositories bound with github.account. Success: ordinary T3 Code, VS Code, terminal, Codex, and Claude launches use the bound account for system git and gh  |
| 81bb1dcb | Make Shepherd failure reporting reliable for large logs and duplicate checks | open | bug | PR #551 exposed two monitor defects on exact head d8f0b5ed: failure-log enrichment could identify the failed Windows Node 24 job but gh run view --log-failed exceeded the default execFileSyn |
| 81e0c2d3 | Stabilize check-forge-token proof checks under loaded Windows hosts | open | bug | During canonical validation for issue 351118da-5d87-404d-bb18-bdd3c784f93d on 2026-09-26, both real Node hook-checker proof tests in test/check-forge-token.test.js exceeded their existing 10 |
| 82a65805 | Skip duplicate follow-up matrix on OS-sensitive PRs | open | task | OS-sensitive PRs already run the full suite on Ubuntu, macOS, and Windows with Node 22 and 24. The follow-up matrix then repeats Ubuntu Node 24 and Windows Node 22. Live run 34576151260 meas |
| 85baafe9 | Pre-push hook (npm test) not governed by any rail — minimal profile still blocks pushes | open | bug | The lefthook/native pre-push hook runs `npm test --if-present` (lib/lefthook-wiring.js ~:52-56 and ~:205-210) unconditionally — it is NOT gated by any rail/config toggle. So a repo set up wi |
| 85d858d1 | Cut v0.1.0-beta.6 release | in_progress | task | Prepare the next beta from the exact verified master after PR #554. Scope: version and release-document updates only; no unrelated product changes. Publish/tag only from the merged release P |
| 86558358 | Stabilize Windows full-suite patch-intent and daemon lifecycle tests under load | open | bug | No description recorded. |
| 86c08a2e | Finalize delivery reliability plan and independent model review | review | task | Evaluate the saved delivery-environment research against current origin/master and open work; specify recoverable patches, separate PR ownership, dependency and landing order, failure-preser |
| 8828c73f | Prevent ship tests from creating live PRs and remove stale Anthropic attribution | open | bug | PR #539 was created as a live test artifact with title 'feat: test', body 'Nonexistent Feature', and the old codex/pr4b-integration branch. The generated footer on origin/master also links t |
| 8933def9 | Prevent successful phantom claim replay after expired same-actor release and reclaim | open | bug | Observed during PR #514 lease recovery under the d71a824b session-aware claim path: a same-actor claim had expired, release was invoked, and reclaim with the same actor/idempotency identity  |
| 8940c6e8 | Stabilize filesystem warning-stream child process on Windows | open | bug | PR #486 exposed an unrelated required-check failure in Tests run 31031417899, job 92392788717: test/kernel/fs-class-warning-stream.test.js:39 reported 'gate script exited null' after the 20s |
| 894f0b0d | Shepherd: bounded complete review-thread handoff without GitHub refetch | open | bug | Shepherd detects all unresolved review threads, but --pull embeds full comment bodies. Large bot comments overflow consumer/tool output, forcing a second GitHub fetch and duplicate agent aud |
| 8a35fb08 | Regenerate packages/skills/bun.lock or adopt a single-lock policy | open | bug | No description recorded. |
| 8d14651d | Bridge Forge WorkPackets to Agent Companion jobs and receipts | open / blocked | feature | Reuse Agent Companion's idempotent requests, durable jobs, leases, controls, traces, and receipts behind Forge authority. Forge owns the plan, claim, worktree, terminal policy, and scheduler |
| 8d3786a0 | Add cross-harness zero-token certification and behavioral conformance | open / blocked | test | Current metadata parity does not launch sessions or prove invocation, precedence, handoff, context, cancellation, or uninstall behavior. Build a bounded certification harness after the activ |
| 8d51c08b | Enforce fresh default branch before dev, validate, ship, and push | open | bug | Purpose: prevent Forge work from proceeding on a stale default-branch base. Verified on origin/master: validate runs conflict/type/lint/security/tests without base freshness; ship fetches an |
| 8f86a028 | Classify legacy journal delivery as T0 until agent acknowledgement exists | open | bug | lib/pr-monitor/flow-monitor.js records the target legacy-journal with transport_tier T1 even though the implementation only durably appends to the journal. T1 means next-turn agent injection |
| 9072274f | Workflow: reusable validation evidence ledger keyed by immutable execution inputs | open | task | Persist reusable test/review/validation evidence so unchanged work is not re-executed at every stage. The key must include commit SHA, exact command, environment/toolchain, dependency lock,  |
| 9261d32a | Make Windows full-suite sharding resource-aware | open | bug | The local full-suite fallback runs four Windows Bun shards concurrently; process-heavy suites hit unrelated 15s/30s timeouts and cascade into process-tree failures. Two exact Foundation push |
| 92c73bff | Stabilize Windows full-suite contention paths | open | task | Medium integration wave for the two independent failures surfaced by authoritative head 70c9fee6. Child issues retain their own scope and evidence; implementation happens in isolated worktre |
| 931d73f5 | [shepherd] Mechanism-first review-bot classification — retire REVIEW_BOT_LOGINS name-list for authorTypename/[bot] detection | open | task | From an agnosticism audit (2026-07-14): the shepherd merge/fix-list logic is ALREADY author-agnostic at the core (pr-pull.js buildReviewThreads surfaces any thread whose anchor is human OR r |
| 94f782e0 | Stabilize reconcile-executor foreign-lease child exit on Windows | open | bug | Post-merge master run 30814212623 job 91687865414 at head 59a1c4ca failed test/pr-monitor/reconcile-executor.test.js:240-254 because spawnSync timed out after 1000ms (ETIMEDOUT) before the e |
| 95ed8d5f | forge-workflow beta.7 cannot be installed with Bun: bundled @forge/* also listed in dependencies | open | bug | bun 1.4.2: 'bun add -d --exact forge-workflow@0.1.0-beta.7' fails with GET https://registry.npmjs.org/@forge%2fflow 404 and @forge/flow\|memory\|contracts@0.1.0-beta.6 failed to resolve. npm i |
| 96573367 | Windows Node 22 bare-repo hooks onboarding test exceeds the 15-second budget | open | bug | Exact-head manual Tests run 34470990094 at 37793fcd failed Full Matrix windows-latest / Node 22 because test/commands/init-hooks-onboarding.test.js case 'a bare git repo is HOOKS_NOT_ACTIVE  |
| 9658c21a | [control-plane] MCP registry section + render/drift/consent wiring (render-time locus, honest SEAM) | open | task | Fable design, build item 5. Add an MCP server registry with control state: mandatory=rendered+drift-gated by setup/doctor, optional=rendered-if-enabled, permission=rendered only after a cons |
| 99438090 | seed issue | open | task | No description recorded. |
| 9a3dc574 | Decision: PostgreSQL or libSQL for Forge team authority after representative load proof | open | decision | ADR-0002 currently plans self-hosted libSQL/Turso, while the new audit recommends SQLite for local authority and PostgreSQL for cloud team authority. Stop before implementing both. Benchmark |
| 9d2eae88 | Post-merge: bound legacy claim preflight fixture setup on hosted Windows | open | bug | PR #551 merged at 9ce02d173f296106d14d4e81b39788581d027d30. Exact-master Tests run 34443505403 failed only Full Matrix windows-latest / Node 24, job 102763277196. test/kernel/legacy-claim-re |
| 9da3ba9e | Stabilize exact-master Windows timeout tests after PR 531 | open | bug | Post-merge Tests run 32193999190 on master c1184da0 failed only Windows Node 24: protected-state-check environment-file-seam test timed out at 18.235s and legacy claim-repair restore proof t |
| 9df80006 | Shepherd emits BLOCKED-THREADS with empty blocker evidence | open | bug | Reproduction from Product-Suite PR #157 at head 4d6655b3cf7c8de1b9aec3a8c2d1c4a9cdfa371d, run from the PR worktree: forge shepherd 157 --pull --json. Output state=NEEDS_REVIEW and verdict=BL |
| 9e31a2f0 | Reconcile Kernel claim projections before 0.1.0 migration | open | bug | Live planning audit found contradictory ownership projections: issue stats reports 121 active claims, issue claims returns 53 records, 47 of those target done/cancelled issues, only 6 target |
| 9e719bfd | Quick push still spends four minutes in serial lint and team-sync hooks | open | bug | No description recorded. |
| 9eb98ac0 | Optimize bounded-tail Flow monitor checkpoint passes | in_progress | bug | No description recorded. |
| 9f6ffb42 | P0 kernel linkage: issue->worktree->work-folder->files provenance (kernel_worktrees writes) | open | task | Kernel trace exposes issue→worktree→work folder→plan/tasks/decisions→PR→iterations. Ship/merge emits idempotent links; one trace returns the joined envelope with explicit null gaps; duplicat |
| a04a58d4 | Diagnose Windows process stalls during canonical validation | open | bug | Canonical validation of diagnostic head4335e46808f360db7e0fa1aef4338a73d8ec7548 started2026-09-20T19:15:46Z; full-suite child started19:19:11Z; ended failed around19:44-19:45Z. Captured tail |
| a070714d | CI: bun.lock is invisible to the Tests workflow path gate | open | bug | No description recorded. |
| a0776e61 | EPIC: Skill composition & relationships (independent + higher + sub-level) | open | epic | No description recorded. |
| a5101337 | [live-link] Per-harness delivery adapters -- Hermes gateway (live mid-task) / Codex exec-resume / Cursor headless / Claude hooks | open / blocked | task | Per-harness LIVE-DELIVERY adapters for dashboard->agent comment-back (cited research 2026-07-13). The dashboard writes the comment to the KERNEL (universal); a per-harness adapter delivers i |
| a696e954 | forge shepherd events --all — cross-PR digest for out-of-repo orchestrator sessions (make the LOCAL tier the primary surface) | open | feature | Owner decision (2026-07-19): the local shepherd tier (auto-arm on forge push -> watcher -> events.ndjson journal -> hooks inject into agent turns) is the PRIMARY monitoring surface — it runs |
| ac1dcca5 | Stabilize Windows Node 24 v2 default-branch fixture commit | open | bug | PR #480 Actions run 30809676771, Windows Node 24 job 91673183984 failed test/v2-fixture-corpus.test.js:90 while materializing non-master-default-branch: git commit -m seed trunk default fixt |
| ac44f34a | Reconcile Forge 0.1.0 package scope and parallel PR train | review | task | Refresh the live release graph and preserve one implementation-ready plan for Contracts, Memory, Flow, Agent Companion, facade, migration, stability, performance, simplification, and release |
| ac5eed99 | Allow forge push passthrough flags such as force-with-lease | open | bug | During PR #475 rebase, documented orge push --quick -- --force-with-lease ran lint successfully but rejected the passthrough with atal: strange pathname '--force-with-lease' blocked before g |
| adb933fa | forge validate must fail when a full suite has failures and skipped cases | open | bug | runAllTests returns a numeric skipped-case count in checks.tests.skipped. executeValidate and getCheckStatus treat any truthy skipped count as if the entire test check were intentionally ski |
| addf5297 | [shepherd] Auto-trigger Tier-2 -- verdict_clean merge rule + gate toggle + forge ship nudge | open | task | After auto-trigger Tier-1. (1) Add merge rule verdict_clean to lib/merge-rules.js (register beside checks_green ~309): passes only when a LIVE forge shepherd <pr> --pull --json verdict === C |
| aef9bbfd | Resolve js-yaml CVE-2026-59870 in production dependency graph | open | bug | bun audit --production on d713f18b reports GHSA-5p4m-2wfm-xmqj through cosmiconfig js-yaml 4.3.0. This is unchanged by beta.5 compatibility evidence and outside issue 5dad8dbf scope. Upgrade |
| b2d5229b | Remediate blocking Bun audit vulnerabilities | open | bug | Fresh bun audit on privacy-safe CLI feedback validation found 3 existing advisories with no dependency-file changes on that branch: high js-yaml GHSA-5p4m-2wfm-xmqj, moderate qs GHSA-q8mj-m7 |
| b2df9e0d | test/commands/release.test.js readiness test runs 13.5s against a 15s timeout | in_progress | task | No description recorded. |
| b3fd4d41 | Canonical validate timeout leaves detached full-suite descendants | open | bug | Scope is the canonical Forge validation path in lib/commands/validate.js. Source evidence: getExecOptions() applies FULL_SUITE_TIMEOUT_MS to execFileSync, and runAllTests() invokes node scri |
| b4a63278 | Smith: bounded worker contracts, lifecycle events, and scope-drift enforcement | open / blocked | task | Define one executable worker packet containing objective, acceptance criteria, owned files, bounded relevant context, risk tier, token/time/test budget fields, stop conditions, and required  |
| b6bdf122 | EPIC: Knowledge architecture / OKF (info-arch 2026-07-04) | open | epic | Knowledge-architecture epic. Kernel child query lists every mapped child with accepted evidence or approved linked deferral; required corpus/authority/migration evidence is attached; any une |
| b915f228 | Vendored Forge tooling trips the host repo's own gates, blocking the setup commit | open | bug | the repo's source-test-coupling gate flagged .forge/hooks/*.js + scripts/dep-guard-analyze.js as 'source without tests', blocking the very commit that adds Forge; had to hand-exempt. Fix: se |
| bc268bd1 | [BETA] Bounded exp-backoff + jitter on stale_revision/BUSY retries (no auto-backoff exists today) | open | bug | Concurrency probe 2026-07-09 (design.md C.7) verified: NO automatic backoff exists in lib/ today; `retryable` is advisory only. Under concurrent agents this causes synchronized 5s retry wave |
| bec40cf9 | Phase B: forge recall -- cross-platform kernel-native history/memory recall (ctx-inspired; optional ctx adapter; NOT a ctx dependency; kernel corpus) | open | task | `forge recall` provides deterministic cross-platform Kernel-native recall without requiring context-mode. Same corpus/query yields consistent results and explicit empty state; optional adapt |
| bf1177e3 | Validate adapter must use configured project gates instead of raw bun test | open | bug | On Product-Suite, forge validate invokes a generic root Bun test path that reports hundreds of false failures from mixed Vitest/Bun workspaces even when the repository-supported Windows suit |
| c29f3952 | [online] Presence/lease surfacing -- agent live / holds lease on N / last-seen | open | task | Build item 6. Surface from kernel_sessions/kernel_claims: which member agent is live, which issues it holds leases on, last-seen -- so a remote commenter knows if/when their comment will be  |
| c4f44805 | seed issue | open | task | No description recorded. |
| c62740d2 | Plan cluster: make plan.research / plan.strategy / plan.design invocable standalone AND composed by plan (invoke just research when small) | open / blocked | task | No description recorded. |
| c66f076e | [shepherd] Retire .claude/scripts/review-resolve.sh into agent-agnostic forge verbs | open | task | A10 + the agent-agnostic requirement. The complete reply/resolve/list surface lives under .claude/* (Claude-only) and core lib SHELLS OUT to it (pr-state-adapter.js:183 replyToThread). Bugs: |
| c6b2a083 | Parse --affected in forge test CLI | open | bug | Discovered while validating eval evidence issue 02f5ea90-4a1a-462f-9b22-54eb5d37f6b3. bin/forge.js global flag parsing drops the command-specific --affected flag, so forge test --affected in |
| c8ece1ef | Make smart-status merge-tree smoke tests load-tolerant | in_progress | bug | After master merged PR #550, canonical Forge validation on Windows failed twice in process-heavy lanes. The second receipt had only smart-status.conflicts.merge-tree.test.js failures; its ex |
| cb90d2ad | Flow monitor advisory checkpoint regression exceeds focused-test timeout | open | bug | Observed while recovering PR 531 on 2026-08-18. The focused test 'advances delivery authority across more than one bounded tail of advisory checkpoints' times out at 15 seconds. Reproduced o |
| cb957233 | Fix review-resolve repository detection CRLF on Windows | open | bug | In Git Bash on Windows, .claude/scripts/review-resolve.sh captures gh/jq CRLF output into OWNER and REPO. The trailing carriage returns produce invalid gh api URLs such as harshanandak\\r/fo |
| cd2c3acf | Build immutable review packets and adaptive invariant-convergence worker waves | open | task | Implement versioned exact-head review packets, structured worker findings, role frontier scheduling, capacity refill, deterministic invariant deduplication, and evidence-based convergence. |
| ce1f84b3 | [epic] Beta adoption feedback — real user, docs/planning repo, Windows + Claude Code (2026-07-15) | open | epic | First real external-adoption feedback (Windows, Claude Code, a docs/planning repo). 7 friction points, roughly by impact. WORKED WELL (keep): forge init --profile minimal was clean; status/r |
| d0ea1550 | seed issue | open | task | No description recorded. |
| d1bb3ff8 | Keep superseded PR #531 closed | open | bug | No description recorded. |
| d2c3cce3 | Shepherd: expose daemon lifecycle status through an existing bounded read surface | open | task | The P0 persists launch, converge, lease-loss, and retirement diagnostics in shepherd.status.json, but that file is not yet projected through forge shepherd --pull/events or forge status. Age |
| d4a60823 | Fix Shepherd false behind count on current PR branches | open | bug | Product-Suite PRs #160-#162 have baseRefOid and merge-base equal to current main 0770c025 and independent rev-list reports 0 behind, yet forge shepherd --pull reports behind=3 and blocks the |
| d50449b0 | forge push forwarded force-with-lease is parsed as a pathname | open | bug | No description recorded. |
| da14d0fd | Stabilize SQLite FTS5 recall filtering on Windows | open | bug | PR #486 exposed an unrelated required-check failure in Tests run 31033155343, targeted Windows Node 22 job 92398579823/92402143904. test/kernel/sqlite-driver-memory.test.js:188 ( ilters fore |
| db097840 | npx broken in-repo by ws@^8.20.1 override; setup hits EOVERRIDE | open | bug | npm error EOVERRIDE -> npx lefthook failed, tried global; recovered but raw npm dump is alarming and npx tsc/eslint unusable repo-wide. Fix: catch + phrase the fallback as informational. |
| db793187 | forge validate must use the repo-pinned Bun on Windows | open | bug | Local forge validate launched Bun 1.3.6 while package.json pins bun@1.3.12 and PowerShell resolves Bun 1.4.0, causing protected bun-lockfile-proof failures unrelated to the branch diff. |
| dcfb7690 | forge push passthrough misorders force-with-lease arguments | open | bug | No description recorded. |
| dd77fcbb | Add zero-token post-merge backlog triage and next-work handoff | open | task | After a PR is merged and post-merge verification completes, Forge currently reports completion but does not deterministically reconcile issues surfaced by the product/test suite or hand off  |
| defc25a6 | Forge-generated .claude/settings.json hardwires an absolute path to bin/forge.js (machine-specific, non-portable) | open | bug | The .claude/settings.json that Forge generates hardwires an absolute path to the forge binary in the session hooks (e.g. `~/Downloads/forge/bin/forge.js`), which is machine-spe |
| df302455 | Isolate validation tests from inherited Forge actor context | open | bug | Running the full validation suite with FORGE_ACTOR and FORGE_SESSION_ID set passes without changing issue-service call-shape assertions; focused regressions cover both variables; no producti |
| e0902370 | Windows Node 24 claim-repair recovery-copy assertion rejects nondeterministically | open | bug | Exact-head manual Tests run 34470990094 for PR #553 failed Full Matrix windows-latest / Node 24 in test/kernel/legacy-claim-repair.test.js: retains the verified recovery copy when the backup |
| e1d0d3aa | Prevent repeated closure of active unmerged PRs | open | bug | PR #531 was repeatedly closed without merge immediately after exact-head pushes/reopens. Root session and PR Monitor did not issue the close. Diagnose the authoritative mutation source outsi |
| e32b05a6 | Canonical verify skill invokes missing forge verify command | open | bug | Reproduced in Product-Suite after PR #157 merged: canonical verify skill requires invoking forge verify, but the installed Forge CLI returns Error: Unknown command 'verify'. Manual post-merg |
| e38e6c0e | Do not report BLOCKED-THREADS when no review threads remain | open | bug | On PR 559 exact head e8ac9dfa, live GitHub state was MERGEABLE/CLEAN with all checks terminal, zero unresolved threads, no changes requested, and settleRemainingMs 0. forge shepherd 559 --pu |
| e4d75ec2 | Bound Windows filesystem classification PowerShell probe | open | bug | PR #495 final-head full-suite shard 0 remained alive for 19+ minutes because lib/kernel/fs-class.js spawned PowerShell '(Get-PSDrive -Name C -ErrorAction SilentlyContinue).DisplayRoot' witho |
| e57a19d4 | Merge train: authoritative ordered queue and single next-at-bat execution | open / blocked | task | Implement the machine-readable merge-train state already required by 451c8828: ordered, parked, blocked, and next-at-bat PRs derived from dependencies, file collisions, freshness, and config |
| e6e9136f | [live-link] Ack lifecycle UI -- sent->delivered->actioned chips + session picker + tier/honesty badges | open | task | Fable live-link design, build item 4. Dashboard chips flip sent (POST accepted) -> delivered (seen in next digest) -> actioned (ack seen) off the SSE stream. Session picker for board-level/u |
| e6f5732a | seed issue | open | task | No description recorded. |
| e8e72233 | Expand forge doctor into manifest-driven health coverage | open | task | 0.1.0 restructuring follow-up requested by the user. Expand the existing forge doctor into the one canonical, read-only Forge health/diagnostic surface, deriving coverage from the command/ca |
| ea6c7b14 | [epic] Beads full retirement — runtime-free, keep only an opt-in migrator (D44 endgame) | open / blocked | epic | DECISION 2026-07-15 (user): move ALL the way off Beads. Endgame = NOTHING at runtime touches Beads; the ONLY surviving Beads surface is a single opt-in import/export migrator so existing Bea |
| eb7d019a | Make embedded asset LF drift test deterministic on Windows | open | bug | The isolated full-suite run on 95f21a2d produced a complete FAIL with test/embedded-assets-drift.test.js failing: embedded text assets are LF-only so cross-platform embed bytes match. The ag |
| ec757ac5 | Stabilize dep-guard stdin analysis test on Windows | open | bug | The isolated full-suite run on 95f21a2d produced a complete FAIL with test/scripts/dep-guard-analyze.test.js failing: scripts/dep-guard-analyze.js accepts stdin payloads for direct structure |
| eea2f9ce | claim-safety skill — verify lease ownership (show --json.claimed_by == own actor & not expired) before working; refuse foreign duplicate-collapsed claim | open | feature | Claim-safety refuses work without a current actor-owned unexpired lease. Owned/unexpired passes; foreign/expired/missing/duplicate-collapsed fails before work; proof comes from live Kernel s |
| f1df5832 | Make docs/work private via git-crypt (encrypt in-place; relocate build-read files to public) | open | task | User decision (2026-07-08): docs/work should be private to the public but auto-present on the maintainer's clones. Chosen mechanism: git-crypt (one repo, no submodule). Plan: (1) relocate th |
| f21279f4 | Add an event-driven efficiency supervisor for Flow runs | open | feature | Flow needs a bounded supervisor that detects token/test/time waste, repeated attempts, scope drift, review rotation, and low-value work before agents get stuck. It must not create a continuo |
| f2438d61 | Authorize Forge setup writes for root CLAUDE.md pointer | in_progress | bug | Purpose: make the owning Forge setup workflow able to authorize the exact root CLAUDE.md pointer bytes without weakening protected-state enforcement. Surface: protected-state authority plus  |
| f31d895c | forge worktree create <issue-uuid> in slug position silently no-ops | open | bug | no output, no worktree, no error. The id links via --issue. Fix: validate the slug, error clearly. |
| f62310a0 | Stabilize memory command search on Windows Node 24 | open | bug | Observed during post-merge verification of PR #486 at merged head b90e970: Windows Node 24 job 92413721150 failed only test/commands/memory.test.js:87, 'memory search finds a matching note b |
| f831f7c5 | Produce multi-harness Forge architecture research and issue map | in_progress | task | Own the research worktree and integrate four evidence lanes: live Forge plans/issues and invocation conflicts; completed cross-harness sessions; local companion/config/handoff/DSH projects;  |
| f8712b8e | Shepherd: acquire external or fork PR head before divergence checks | open | bug | The current divergence/conflict adapter can compare an authoritative PR head SHA only when that object exists locally. External or fork PR heads may be absent, so Shepherd needs a bounded au |
| f9929f5b | Make validate receipts and push fallback portable on Windows | open | bug | On exact head 02fbb6ae, canonical forge validate passed the resource-aware full suite but launched bare eslint via execFileSync, got ENOENT, reported Lint: SKIPPED, and minted no validation  |
| fa3de63c | Integrate CodeRabbit CLI as a pre-push review convergence gate | open | task | 1. Detect Windows WSL and CodeRabbit CLI availability/auth without mutating the host; missing prerequisites return a stable actionable status. 2. Document and automate the official WSL insta |
| fd4c03b3 | [epic] Wire the configurable gate/rail registry to REAL runtime enforcement (close the declared-vs-enforced gap) | open | epic | SURFACED by the B6/#385 adversarial review (2026-07-15) — a foundational finding. Forge's workflow.gates.<id>.enabled / rail flags are a resolver-consumed REGISTRY, but grep of every consume |
| fd64f6c9 | Serialize process-heavy Windows test shards without duplicate execution | open | bug | Windows full-suite failures correlate with four concurrent shards each running synchronous process-heavy files. Exact master 02be took 516-532s test time and 585-601s job time. Default clean |
| febc4802 | Stabilize memory command search on Windows Node 24 | open | bug | Post-merge verification for PR #486 failed only Tests run 31037633794, Windows Node 24 job 92413721150. test/commands/memory.test.js:87 (memory search finds a matching note by query) took 17 |
| ff2b7045 | Make validate failed-child regression fast and deterministic | open | bug | test/commands/validate.test.js runs executeValidate without skipping unrelated gates, taking 25.94s alone and timing out at 31.18s under the 30s shard ceiling. Reproduce from PR #563 exact h |
| forge-0g2m | Commit WSL bootstrap fixes and test coverage | open | bug | The script fixes (bootstrap-windows-tools.sh, smart-status.sh, sync-utils.sh, index.sh, workload.sh, identity.sh) and test updates (smart-status.test.js, workload.test.sh) from the /status W |
| forge-1gry | Pattern detector + skill suggestion UX | open / blocked | task | Reads .forge/agent-log.ndjson, finds repeated tool-call sequences (>=5 occurrences over 2 weeks), proposes skills as .forge/proposals/<id>.md. forge skill accept moves to .forge/extensions/l |
| forge-1nh6 | forge rollback + .forge/backups/<ts>/ snapshots | open / blocked | task | Every forge upgrade snapshots .forge/ + agent dirs. forge rollback <ts> restores. Required for safe rollouts; per critic D7. |
| forge-2hrx | Ship 3 reference adapter templates | open | task | Ship review-coderabbit (the 28-min demo), review-stub (canonical SPI blank canvas), gate-cli-json (covers ESLint/Biome/gitleaks/semgrep/license-checker). DEFER notify-webhook + issue-mcp-pas |
| forge-5tdp | Harness-agnostic translator (3 MVP targets: Claude + Cursor + Codex CLI) | open / blocked | task | Translator emits agentskills.io-compliant SKILL.md to MVP harness targets (per D15, narrowed from D11/D12 6-target scope). MVP scope: Claude Code (.claude/), Cursor (.cursor/rules/*.mdc + .c |
| forge-61fx | WS1 Phase 4: Downstream tool error translation layer | open | task | Cross-cutting requirement: every forge command must translate raw downstream tool errors (git, gh, bd, bun, eslint, tsc, vitest, pytest, cargo test, Dolt, Lefthook, Context7 MCP, GitHub API) |
| forge-6muf | v2 Wave 2: Core Workflow — WS2 commands-to-agents migration + WS5 evaluator + WS13 guardrails + WS1 CLI complete | open / blocked | epic | Reframed: Keep open ONLY for the WS5 evaluator and WS13 guardrails sub-issues, which feed N13 insights. Drop WS2 commands->agents (covered by N4). Blocks N13 (forge-besw.12). See manifest Se |
| forge-besw.10 | patch.md spec + forge patch record --from-diff | open / blocked | task | Hybrid patch format: single patch.md with anchor-ID blocks (<!-- forge:anchor stage.review.body -->), optional overflow at patches/<stage>.md. Anchors must be declared in default L2 blocks t |
| forge-besw.15 | forge-marketplace.json + name-collision rule | open / blocked | task | Implement the locked allowlist distribution model. forge-marketplace.json lives in the Forge repo, schema-compatible with Claude Code's marketplace format. Each entry: name, source, sha (man |
| forge-besw.2 | Layer 1 lockdown spec (canonical 5 rails + audit log format) | open / blocked | task | Define the exact 5 locked rails: TDD intent gate, secret scan, branch protection, signed commits, and schema + integrity including Protected Path Manifest. Rails have formal cannot-be-disabl |
| forge-besw.24 | Iteration-driven planning skill (/plan, 5 phases) | open | task | Implement the canonical `/plan` skill using the iteration-driven 5-phase method demonstrated by this very planning session (locked-decisions.md D1–D38 across 6 iterations is the proof-of-con |
| forge-besw.27 | bd audit upstream --meta-json PR (Plan A) + .forge/log.jsonl fallback (Plan B) | open | task | v3.2 deliverable per D39. Plan A: contribute --meta-json flag to bd audit upstream so per-PR audit metadata flows back to Beads. Plan B (fallback per D25): if upstream PR stalls, ship .forge |
| forge-besw.3 | Migrate WORKFLOW_STAGE_MATRIX to .forge/config.yaml | open / blocked | task | Replace the hardcoded matrix at lib/workflow/stages.js:42 with a runtime-loaded config. canTransition() and assertTransitionAllowed() filter the matrix through .forge/config.yaml so disabled |
| forge-besw.4 | forge options * introspection API | open / blocked | task | Implement the 7 introspection commands the agent uses instead of reading YAML directly: forge options stages\|gates\|adapters\|diff\|why <id>\|lint, plus forge run <stage> --dry-run. JSON output  |
| forge-besw.6 | extension.yaml manifest spec + validator | open | task | Freeze the v1 manifest schema (apiVersion: forge.dev/v1, kind: Extension, spec fields per design doc) and ship a validator at lib/extensions/manifest-schema.js. Validator enforces: kebab-cas |
| forge-besw.7 | Source resolvers (gh:, npm:, ./local, https:, gist:) | open / blocked | task | Implement five resolver modules under lib/extensions/resolvers/<scheme>.js. Each returns {tarballStream, sourceMeta}, writes to temp dir, runs validateManifest(), atomically renames into .fo |
| forge-besw.8 | forge.lock + audit log + --allow-untrusted | open / blocked | task | Lockfile (committed) records version, source, resolved, integrity (SRI), optional signature, installedAt, installedBy per extension. .forge/audit.log (NDJSON append-only) records install/upd |
| forge-krfx | v2 Wave 1: Foundation — WS3 beads wrapper + WS1 Phase 0 + WS4 schema + WS11 Context7 + WS7 safety + WS8 long-running | open / blocked | epic | Phase 1 of the v2 implementation plan. 4 weeks. Maximum parallelism — 2 engineers or 2-3 parallel worktrees. Foundational layers that unblock all subsequent work. Shared Dolt launcher (WS3 C |
| forge-lzb3 | Refactor .claude/commands/review.md to dispatch via configured ReviewAdapter | open | task | Removes Greptile hard-coding from review.md. Reads .forge/config.yaml review.adapter to dispatch to configured adapter. Required for D9 multi-adapter story. |
| forge-n4xg | schema_version: 1.0 envelope across all v3.0 artifacts | open / blocked | task | Add schema_version: 1.0 envelope to: .forge/config.yaml; patch.md frontmatter; skill SKILL.md frontmatter; bd audit event payloads (versioned envelope {v: 1, kind, meta: {...}}). Reserve anc |
| forge-ol43 | forge explain <gate> - prose-mode complement to forge options why | open / blocked | task | Prose-mode complement to forge options why. Same data, human audience. Example output: 'L1 TDD rail blocks this commit because it requires a test in test/foo.test.ts. The rail is locked; to  |
| forge-titl | Forge v2 Master Tracking: 13-15w with 2 engineers OR 22-26w solo OR 3 sequenced releases | open / blocked | epic | v2 master tracking - frozen as 'v2 wave' historical record. Active development moves to N1 (v3 skeleton, forge-besw). Keep open until all v2 in-flight items (forge-krfx Wave-1 sub-issues cur |
| forge-u7go | Source WSL bootstrap helper from all bash entrypoints | open | task | bootstrap-windows-tools.sh must be sourced from every bash entrypoint that depends on bd, jq, or gh. Currently only smart-status.sh, sync-utils.sh, and index.sh source it. Audit all scripts  |
| forge-xibe | Pre-launch checklist (product naming TBD) | open | task | Pre-launch ops checklist, time-boxed to 1 day in W1. Product name is TBD — user is evaluating options. Once a name is locked, run: (a) Domain availability check + register top 3 TLDs (.dev / |

## Appendix B. Reproduction and search boundaries

[ran] Commands from this worktree with prescribed FORGE_SESSION_ID on Forge subprocesses:

- git fetch -q origin master; separately git fetch -q origin docs/release-010-parallel-plan, then pin 2f7fe92ce40195e85ca0e896c52c5d37786b2bd9.
- git rev-parse HEAD origin/master.
- git show origin/master:lib/commands/_manifest.js; package.json; scripts/package-size-baseline.json.
- git ls-tree -d --name-only origin/master:lib.
- node bin/forge.js release --help; node bin/forge.js release check --target 0.1.0 --json.
- node bin/forge.js list --json.
- node bin/forge.js github run -- gh pr list --state all --limit 80 --json number,title,mergedAt,state,url,body.
- node bin/forge.js github run -- gh pr view 564 --json number,title,state,mergedAt,url,headRefOid.
- node bin/forge.js github run -- gh api --paginate --slurp repos/harshanandak/forge/commits/ba56b9201782c4d1246c77bde6380867603184bf/check-runs?per_page=100.
- node bin/forge.js github run -- gh release list --limit 20 --json tagName,isDraft,isPrerelease,publishedAt.
- HTTP GET https://registry.npmjs.org/forge-workflow, parsed for all versions/dist-tags; no npm install/pack.

[read] Search scope and negative evidence:

- G0–G8 across tracked docs/ found approved 2026-08-09 validation-matrix.md; these are not the nine static readiness checks.
- Case-insensitive release-evidence.v1|aggregate-evidence|observation-window|signed.*bom|rc.bom across remote lib/, scripts/, .github/workflows/, docs/reference/ yielded zero hits. This is bounded negative evidence, not proof about external/untracked files.
- ls-tree for validation/journeys/, release/, validation/ and the restructure work folder returned risk manifests and planning/admission files, but no proposed journey/release roots.
- Actual release dispatch/help and buildReadinessReport were inspected; no proposed aggregate-evidence command was executed.
- Static cross-block require scan covered every JS file in remote lib/memory-core and lib/flow; dynamic provider behavior remains a separate check.

## Appendix C. Complete lower-priority membership

[ran/inferred] All 605 lower-priority unresolved records enter exactly one title-theme bucket. No priorities/authority were changed.

### Legacy or explicitly retired surfaces — 51

`213832d1`, `235f6c8f`, `3b947513`, `560dc153`, `5bfd2414`, `5e19f428`, `66c8aa2b`, `685f348e`, `7a584ad4`, `7c813e9d`, `81f83ed9`, `83690fd4`, `8e38896c`, `920a086a`, `92ee5d7e`, `9e6424d6`, `9ee29231`, `a0d5bc41`, `a2bcbab2`, `c2869d83`, `ca28a36c`, `ce75d317`, `d497c8e6`, `d4ef0670`, `d5a209be`, `d6a1d185`, `d9cb9823`, `dc81d48d`, `dd8e5526`, `e2e25150`, `e6bb6fcf`, `e9fdb4ae`, `f4a421d7`, `forge-ij1`, `forge-puba`, `07823c4d`, `26f342f5`, `2e527650`, `4109f471`, `41d3051a`, `5b02dbd6`, `b576c46d`, `c7971150`, `cbdf9179`, `cdc08714`, `forge-2ne3`, `forge-g3e7`, `forge-f3lx`, `forge-h5yj`, `forge-na3x`, `forge-s3cb`.

### Tests, CI, validation, reliability and performance — 139

`017b3ec1`, `04afb9f9`, `074bb8ce`, `08b2d316`, `09b22887`, `0aa5d576`, `10488837`, `11c48603`, `18250369`, `18307c60`, `1ac95a4a`, `1ee7363e`, `21a8493b`, `2390754b`, `2d53c59b`, `2d77ddb9`, `2db62bdd`, `31a0ff8f`, `346fe7c6`, `350a385c`, `37f98fc6`, `3988a1da`, `39b9822f`, `3ae52590`, `3e1ce9d0`, `42376a6c`, `4399035a`, `4416c96c`, `45972625`, `46124252`, `476dc13a`, `4a4f5dd8`, `4a579525`, `4d8960f3`, `566c4c50`, `5723ea97`, `580e7f11`, `59537031`, `59be9317`, `5b1f4816`, `5c05e01a`, `5ce97b9b`, `5d3ffec6`, `5dc2ac03`, `5f2b07f2`, `60bebd34`, `64baba16`, `68d27b65`, `6ad0c847`, `6b4b8450`, `6d0c0fbb`, `6e2ab6d5`, `7121eaf6`, `723fc3a3`, `749cf548`, `76ed047b`, `7743ec35`, `77a2e8f3`, `7920f747`, `7dadce1e`, `7f627647`, `8089bb91`, `8563aeec`, `856f03bb`, `88cdf0e9`, `8bbc172b`, `8d54c27a`, `8e9b27f9`, `90c43c28`, `99e94866`, `99fd3b8c`, `9ada7c09`, `9b8dfa31`, `9c481b97`, `9d4ffd3a`, `9e80738f`, `a237cbbe`, `a48556a5`, `a4e0adf0`, `a53f41e8`, `a58bc1bb`, `a67af5ee`, `a77f4bdf`, `a8ba042b`, `a8dc2c86`, `ac4cac82`, `af2eb94b`, `af9dac5d`, `b0aba94d`, `b4aab0e0`, `b533dab6`, `b7a20a71`, `b92fb02c`, `bc69e139`, `bc92ba7a`, `be312861`, `c64c2eaa`, `ca95b9c3`, `cc25a59a`, `cef11116`, `d8692342`, `d872cf93`, `d9ef06f2`, `df1e554e`, `e096846b`, `e20e79cc`, `e226ae9a`, `e26dbb91`, `e4acfd0b`, `e68edd50`, `ed05136d`, `f3a27354`, `f5d0087a`, `f69289d9`, `f730b3b6`, `f7fe9a18`, `f93cadfb`, `f97f19ec`, `fadbba10`, `fce5a163`, `ff5ac453`, `ffbdb6b7`, `forge-4nvf`, `forge-9pxu`, `forge-hwjq`, `forge-pdz6`, `0d78b685`, `0dad7811`, `213585e5`, `28d67d69`, `31530bc6`, `32253c95`, `50487053`, `69864724`, `d3db6cba`, `f3387510`, `ffe964ae`, `forge-mymu`, `forge-s0c3`.

### Release, distribution and product composition — 29

`02c45b88`, `0eb59c8e`, `142faf02`, `28dba549`, `334b6771`, `3c0d2494`, `46d25e0a`, `562c6a96`, `59f83202`, `5af8bf6c`, `5c941034`, `5cdf236a`, `8e914e7d`, `90354847`, `9b3265c3`, `a00fd0cc`, `bfb2f529`, `c57ed1ac`, `c7d085c5`, `cf8361bc`, `d466b0b8`, `e583868e`, `e70683d6`, `ff3b747d`, `forge-vmjc`, `4dde0085`, `68b32239`, `c3bb88d2`, `forge-dq8j.3`.

### Flow, PR monitoring, review and GitHub delivery — 96

`06979241`, `090996ff`, `0c403655`, `137801ef`, `15bee94d`, `180c1985`, `187e394b`, `1a403d38`, `204d369d`, `205a8106`, `265b1c32`, `27108166`, `28825883`, `2efaf6b0`, `2fcdfaa1`, `327a9726`, `377af5aa`, `3a707b50`, `4439b12e`, `44fc2c33`, `4516c0b9`, `482251b7`, `4a65c50f`, `4ffb315e`, `50929aee`, `50c84a42`, `530a2219`, `56461780`, `56e09c9b`, `590fb4fc`, `5d3409d0`, `63a447a9`, `67ab465b`, `67ecc083`, `720eda2b`, `7521def3`, `7827515d`, `78d19d74`, `80119bc4`, `814e7518`, `8a4474ee`, `8e7e5ad6`, `8ff4afd4`, `9616bf7a`, `97dd2b3c`, `9aac4554`, `a15946cd`, `a28d760b`, `afac7d9e`, `b03ddbf2`, `b0fc26ad`, `b34dfc57`, `b3ad8ad4`, `b44c7829`, `b5d18cfc`, `b6b6acbe`, `b786a1c0`, `bb0d2006`, `bf09c241`, `c3952ba5`, `c830e647`, `ca2b170e`, `ccabd934`, `cd943a15`, `cedca945`, `cf9dcdc5`, `d4aa198f`, `d9aedb9f`, `dab834e2`, `db8b706e`, `e00ee6e5`, `e2420489`, `e68e98b1`, `e697238a`, `ec49771d`, `fcb72792`, `ff2b1859`, `forge-6fm1`, `forge-besw.11`, `forge-dq8j.2`, `forge-fjbh`, `forge-lfvs`, `forge-m0fw`, `forge-m1n8.1`, `forge-nlgg`, `248b733b`, `5b680907`, `5c470526`, `ae39f9d5`, `c448036d`, `c6c15f2d`, `dab77033`, `ecbebf5c`, `forge-9m47`, `forge-dfup`, `forge-4vm6`.

### Memory, recall, grounding and evaluation — 49

`00b00897`, `0287967e`, `1039b377`, `12ac7a8a`, `1e078cb2`, `33fc14c6`, `3a850998`, `3b7c7c4c`, `41814dca`, `44643ac0`, `53cd20d7`, `5bde2281`, `6cb73766`, `6d5ed439`, `6e2efd19`, `6ef96e92`, `71955c70`, `741cacc4`, `7eb6a96b`, `8abd5b92`, `90f2f631`, `9c343cdb`, `a1aadcad`, `a52f5d5a`, `ab6c910e`, `af029ede`, `b14aebc5`, `b7334f51`, `b7b7a04e`, `c3507eb7`, `c40ca3c0`, `dae18794`, `dce9da46`, `e037a559`, `e3a245ed`, `e663c585`, `f6a8957e`, `f7f1a33d`, `ff843904`, `forge-7vll`, `forge-besw.22`, `0e92230d`, `2aa7b2ca`, `43dcfd6d`, `474294e3`, `49a764f9`, `99602668`, `bb5b054c`, `bb8c6508`.

### Kernel, issue authority, coordination and worktrees — 89

`00355065`, `05d026ba`, `0b0bf5f9`, `0e2b22b4`, `0fa47e8b`, `10cb5a4d`, `11073059`, `1334dda4`, `156bb89b`, `159d0c1f`, `1752c4a8`, `26e57055`, `2baf213e`, `2d8deebb`, `31ea6155`, `37feca62`, `3f8520a0`, `4248273d`, `431c2c1e`, `44dc1106`, `46d1a807`, `48b2a724`, `4971cd0c`, `4a860df0`, `56b080c9`, `5d04d383`, `60162810`, `629aff06`, `66496e29`, `6739b7bd`, `6d767d27`, `6e118c7f`, `714bd32e`, `76c088b8`, `79075ab1`, `7ab8b642`, `7d6e3ec8`, `835fc274`, `850a293a`, `86aba691`, `87ed72ca`, `926d772a`, `927f96c2`, `94ad6566`, `988ea700`, `9b1945a5`, `9c53e75a`, `9d4d7abf`, `9e5485f2`, `9f96ed90`, `a29ff461`, `a3bf94de`, `a781cda9`, `aeab48f8`, `b4999dd0`, `ba64459c`, `c46035f9`, `c563b9d7`, `c5f14c96`, `c8641a66`, `ceeef92f`, `d1abfaa6`, `d1bb468d`, `d1fbc8fa`, `d60745fc`, `dc57a776`, `ddeaa919`, `e054bb85`, `e0886986`, `e1e33cf8`, `e20d3bff`, `e62e4bde`, `e8b91e41`, `eb153a37`, `eb4db676`, `ee6bc9cf`, `efaefde5`, `f10f63dd`, `f9559b82`, `faaf9a6d`, `fafe13f9`, `gate-cli-issue`, `13f1b4b8`, `23219595`, `3b73dab6`, `484e3384`, `aa1bb5ff`, `bd3ea7c9`, `c5f55b9a`.

### Skills, harnesses, hooks, adapters and configuration — 61

`028a149e`, `06373ce8`, `07c3daf6`, `0c0363fc`, `0d232f89`, `1470ae96`, `1920f57c`, `386b2cce`, `3c2b7c1f`, `41f527bc`, `44475547`, `45a4f9a5`, `46faa8d1`, `47202bab`, `4cf2c43d`, `590b1ced`, `5a40eea5`, `666f4b4c`, `6a5fb27f`, `6e97056d`, `7f4758cb`, `802aa4d8`, `8d4a7ec7`, `9661e78a`, `a31ac0b0`, `a35b3a0f`, `a370fad7`, `a3e0afb3`, `aaa20e8b`, `b7c83fd6`, `bd2bff67`, `da919a16`, `e00dc2ef`, `e2aaf483`, `ee707ebd`, `eea186fa`, `forge-besw.13`, `forge-besw.16`, `forge-besw.25`, `forge-besw.9`, `forge-dq8j`, `forge-dq8j.1`, `forge-m1n8.3`, `forge-m1n8.5`, `forge-m1n8.6`, `forge-ny6j`, `forge-z1ft`, `2ef2bca5`, `4e5d757b`, `57de6e41`, `64ec00fc`, `695d4fef`, `9e141d9b`, `c2f3f5aa`, `d8046bc1`, `d9240b31`, `dee98bab`, `f802a6b4`, `f903895c`, `forge-cfdi`, `forge-x8es`.

### Documentation, UX and other product work — 91

`04b6e42e`, `0525120d`, `07d51c54`, `086b7bbf`, `0994afd4`, `0d09e324`, `0e9ebb31`, `1142a1ba`, `1be54343`, `1ed7e38f`, `228b7b4e`, `256bd4fd`, `27566284`, `2b40657d`, `2d4e517a`, `31de7f3b`, `31f684b5`, `33d1a906`, `36e30175`, `3990d157`, `41ed9173`, `47d5763e`, `49343c4e`, `4ee969e9`, `537415c2`, `5480ee2d`, `57ae2973`, `57e88562`, `596c0f4b`, `5a22090e`, `5b08b640`, `5da213ae`, `650b33c3`, `66426cc0`, `682c0bb1`, `693c4d8e`, `6c7ee76a`, `74e87081`, `79de53c8`, `7aded5b4`, `7bb4196b`, `7e57be22`, `80227d8a`, `81e06693`, `81f7d3a0`, `8d1112ef`, `8f53d363`, `93f0d8f6`, `96ef9395`, `9e11cf47`, `a0640d36`, `a0f45eb9`, `a8585125`, `a8b907cb`, `ad060530`, `ad69686a`, `b2900f45`, `b7a5decc`, `bc496ef3`, `bf8cb8c7`, `c6267a10`, `c696f6bb`, `c6eae87e`, `d04fde94`, `d5a9a9d5`, `d670ffae`, `d954821f`, `e2e5b732`, `e2fbcccf`, `e340b6dd`, `e74f7f49`, `e801b679`, `e8b5e91f`, `ee765e91`, `eed39cc5`, `explicit-illegal`, `f1405a2f`, `f38a376c`, `f7f7e730`, `fae3494d`, `forge-5q7s`, `forge-besw.14`, `forge-besw.26`, `forge-besw.5`, `forge-m1n8.4`, `132da651`, `45f40cd3`, `e70b95cf`, `forge-0ht2`, `forge-besw.17`, `forge-17rw`.

## Open questions for the owner

[inferred] Settled package/runtime/pruning/merge decisions need no new approval. Remaining choice: order backlog reconciliation around the release-critical chain, and close versus split older claims when exact acceptance evidence is attached.

- **A — Release-chain reconciliation first (default):** reconcile required outcomes/recent follow-ups, execute section 5, and disposition the wider backlog incrementally.
- **B — Whole-backlog disposition first:** classify all 881 unresolved records before implementation resumes; cleaner global roadmap, longer RC critical path.

**Default: A.** A sequencing choice only; all agreed gates, supported journeys, safety boundaries and observation requirements remain.

## Confidence

**High** for remote structure, 62 commands, committed size numbers, complete counts/P0/P1/follow-ups, PR metadata and static release result: directly read/run and fully enumerated. **Medium** for outcome completion and effort (including the release runtime result being measured on predecessor ba56b920 while final source/live CI are 7d448ec8): this leg inspected source/acceptance/live CI metadata but did not execute new assemblies, upgrades/rollback, installed-harness RC journeys, underlying Sonar metrics or external/private evidence. No implementation-duration estimate is supported.
