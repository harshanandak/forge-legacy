# Bottom line

1. **Decisions needed:** adopt the readiness gates below and budget **4–6 ordinary PRs/day**, with **1–2 substantial coupled changes/day**; these are planning estimates, not measured capacity guarantees. [inferred]
2. The team demonstrably ships: **28 repository PRs merged during September 25–29**, including **26 of the 27 requested PRs**; the active three-day cohort delivered 5, 12 and 9 merges/day. [ran]
3. It ships unevenly: requested-cohort median open-to-merge is **306.8 minutes**, P75 **611.7**, P90 **1,273.1**; worktree safety remains open after **53.3 hours**. [ran]
4. The cohort contains **109 review threads**, **101 observable reviewed-head rounds**, **at least 111 post-open head updates**, and **62 post-open master-merge commits**. More implementers can increase this integration load. [ran; inferred]
5. Final-head Tests job spans have median **549 seconds**; paired Windows full-matrix critical jobs take a median **5.25×** their Ubuntu counterparts. [ran]
6. Of **159 PR Tests runs**, the latest recorded attempts are 119 successful, 21 failed and 19 cancelled; this is a run-result distribution, not an independent flake probability. [ran]
7. The remote quarantine registry has **five quarantined cases and four watching cases**, and its second-local-occurrence rule conflicts with the owner's CI-evidence-only direction. [read]
8. Ownership and tooling impede delivery: two reported stale-lease hand-offs, one reported **192-second** quick-push sync step, **52 node_modules junctions across 113 registered worktrees**, and recurring informational-comment blockers. [read; ran]
9. Mutation confidence is missing: five historical Mutation jobs inspected failed; the current dispatch fails its **initial test run**, before scoring **106,522 instrumented mutants**. The issue's description of all tests passing is contradicted by the log. [ran]
10. Before broad execution, establish one landing owner, safe dependency/worktree handling, explicit lease transfer, one review/quarantine policy, measured Windows cost, and a working release-confidence lane; keep the owner's CI-first and exact-head merge constraints. [inferred]

## Scope, snapshot and counting rules

This leg follows `(local scratch)`. Only this report is written. No code, configuration, issues, branches or GitHub objects were changed; no commits or pushes were made. [ran]

Repository facts are pinned to fetched `origin/master` **`ba56b9201782c4d1246c77bde6380867603184bf`**. Bulk GitHub reads describe September 25–29, 2026, with the collected Tests runs ending at **September 29 19:03:42 UTC**. The worktree PR was re-fetched at **23:15 UTC** and remained open at the same head. September 30 is the local report date in India; daily counts below use UTC. [ran]

Evidence labels: **[read]** means inspected source or a Kernel record, **[ran]** means an actual command/API result, **[external]** means primary external documentation, and **[inferred]** means interpretation or a forecast. Reading a failure log verifies the recorded failure; it does not reproduce the bug locally or prove its fix.

The PR table uses these definitions:

- **Minutes:** `mergedAt − createdAt`; elapsed time includes overnight and owner waiting. No merge duration is assigned to the still-open PR.
- **R/S:** R is the minimum observable number of distinct reviewed heads, using non-owner submitted reviews plus surviving completed Codex summary/no-findings comments. S is the number of non-owner formal review submissions. Owner replies are excluded. A zero-submission PR can have a completed no-findings Codex review. Mutable bot summaries overwrite history, so R is a lower bound on all review cycles.
- **Threads:** GraphQL `reviewThreads.totalCount`, including resolved/outdated threads. All 109 fetched threads were resolved at collection. All 27 thread/timeline connections reported `hasNextPage=false`; thread comment connections also reported no further page.
- **P/C/B:** P is a **minimum observed post-open head-update count**, C is retained commits committed after opening, B is those commits whose headline identifies a merge of master. P matches Tests run head SHAs to the PR's commits, excludes the opening head and restricts runs to the PR lifetime. It does not count every physical `git push` invocation.
- Exact push-call counts are **unavailable from these GitHub surfaces**: the timeline commits returned null `pushedDate`, no force-push events were returned, and multiple commits can arrive in one push. P therefore must not be relabeled an exact push count. B measures visible base-update churn, not every possible rebase.
- Cause descriptions identify recorded review topics, commits and failed jobs. They do **not** assign every elapsed minute to a cause. Unexplained gaps are explicitly retained.

Sources were the Forge-routed `gh pr view --json` calls for every PR, a batched GraphQL timeline/review-thread query for all 27 PRs, two complete pages of Tests workflow runs for the window, selected job APIs/logs, branch protection, repository ownership/rulesets, Kernel issue records and remote source. [ran]

## PR cycles: all requested PRs

Timestamps in this table are UTC, `MM-DD HH:MM`; minute durations use the full API timestamps. Numeric columns are [ran]. Delay interpretation is [inferred] from the linked PR's reviews, timeline and commit headlines; specific failures are cited below.

| PR and change | Open → merge | Minutes | R/S | Threads | P/C/B | Recorded delay evidence and limit |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| [Fixture completion #578](https://github.com/harshanandak/forge/pull/578) | 09-27 15:42 → 09-27 16:56 | 73.7 | 2/6 | 4 | 1/1/0 | Marker invalidation/publication and shell-construction review; one correction commit. Latest successful CI/Codex proxy preceded merge by 45.7 min, whose cause is unknown. |
| [Lazy command loading #579](https://github.com/harshanandak/forge/pull/579) | 09-27 17:17 → 09-27 18:49 | 91.3 | 2/2 | 1 | 3/3/1 | Generated-manifest sanitization/CodeQL correction, Sonar exclusion and one master update; 34.5 min remained after the last successful-evidence proxy. |
| [Certified-root validation #580](https://github.com/harshanandak/forge/pull/580) | 09-27 17:30 → 09-27 17:47 | 17.2 | 1/0 | 0 | 0/0/0 | No visible correction push or thread. Short review/check/landing cycle; no evidenced tooling delay. |
| [Single Tests workflow #581](https://github.com/harshanandak/forge/pull/581) | 09-27 17:43 → 09-28 18:32 | 1488.8 | 6/6 | 4 | 12/14/10 | Windows E2E coverage, duplicate CI Gate, duplicate Windows E2E and a P1 SIGPIPE classifier defect; later errexit correction. Ten master-merge commits kept restarting the landing work. |
| [Worktree safety #582](https://github.com/harshanandak/forge/pull/582) | 09-27 17:56 → **open** | **3199.2 age** | 17/22 | 26 | 17/26/13 | Successive self/ancestor/nested-worktree deletion, dependency-source/identity, link rollback, unusual-path parsing and shell-safety cases. Re-fetched head is CLEAN, but still open; the final reason for not merging is unknown. |
| [Timeout output #583](https://github.com/harshanandak/forge/pull/583) | 09-27 18:09 → 09-27 19:31 | 82.2 | 1/1 | 1 | 1/1/1 | Review identified duplicate stderr replay. The only retained post-open commit is a master merge; 27.2 min after the successful-evidence proxy is unexplained. |
| [Dep-guard issue reuse #584](https://github.com/harshanandak/forge/pull/584) | 09-27 18:21 → 09-27 19:41 | 79.3 | 2/1 | 0 | 2/2/2 | Two master updates; no inline review thread. The source of most earlier elapsed time is not recoverable from the inspected record. |
| [Shepherd comment classification #585](https://github.com/harshanandak/forge/pull/585) | 09-27 18:34 → 09-28 04:06 | 572.2 | 5/7 | 5 | 7/7/4 | Repeated fixes to freshness, capped blocker IDs/payloads and text truncation; four master merges and an overnight gap. |
| [Windows recall quarantine #586](https://github.com/harshanandak/forge/pull/586) | 09-27 19:59 → 09-28 03:59 | 480.6 | 2/1 | 1 | 1/1/0 | Review narrowed an unconditional skip to Windows. Last successful-evidence proxy was 468.4 min before merge: the large gap is landing/availability waiting, with no exact reason recorded. |
| [Fake-git wrappers #587](https://github.com/harshanandak/forge/pull/587) | 09-27 20:04 → 09-28 06:07 | 602.8 | 1/0 | 0 | 2/2/2 | Two master merges, no inline threads; 103 min after successful-evidence proxy. Overnight/owner waiting is plausible, not proven. |
| [Existing PR linkage #588](https://github.com/harshanandak/forge/pull/588) | 09-28 03:53 → 09-28 07:25 | 211.9 | 5/4 | 4 | 4/7/3 | GitHub account routing, short issue IDs, stale worktree registry rows and lease/session proof corrections; three master merges. |
| [Expired-lease renewal #589](https://github.com/harshanandak/forge/pull/589) | 09-28 06:45 → 09-28 16:56 | 611.7 | 8/10 | 11 | 7/8/1 | Idempotency collisions, renewal generations, malformed/expired leases and serialization across shared database writers generated eight reviewed heads. One Tests run was rerun; 270.6 min remained after the last successful-evidence proxy. |
| [Windows CI budgeting #590](https://github.com/harshanandak/forge/pull/590) | 09-28 11:31 → 09-28 18:20 | 409.6 | 1/0 | 0 | 2/2/2 | Two master merges plus unrelated macOS heartbeat failure in [run 36457747077](https://github.com/harshanandak/forge/actions/runs/36457747077), followed by its separate quarantine PR. |
| [Cross-runner partition #591](https://github.com/harshanandak/forge/pull/591) | 09-28 12:14 → 09-28 17:21 | 306.8 | 3/4 | 3 | 2/3/1 | Shard argument/partition review and valid-empty-shard semantics; one master merge. Final evidence-to-merge gap was under one minute. |
| [macOS heartbeat quarantine #592](https://github.com/harshanandak/forge/pull/592) | 09-28 18:02 → 09-28 18:07 | 4.6 | 1/0 | 0 | 0/0/0 | No correction push or thread; narrow quarantine landed quickly. This is not representative implementation throughput. |
| [Package allow-list #593](https://github.com/harshanandak/forge/pull/593) | 09-28 18:24 → 09-28 19:24 | 59.9 | 1/0 | 0 | 2/2/1 | Initial Tests run failed coverage, smokes, units and full matrix; the follow-up commit kept documented building-block APIs and corrected the allow-list mapping; one master update also occurred. Individual assertion causation was not diagnosed in this leg. |
| [Node 24 floor #594](https://github.com/harshanandak/forge/pull/594) | 09-28 19:09 → 09-28 20:25 | 76.1 | 4/6 | 4 | 3/5/1 | Bun compatibility, malformed version handling and enforcement at both CLI entrypoints required successive reviewed heads. |
| [Source-text test removal #595](https://github.com/harshanandak/forge/pull/595) | 09-28 19:25 → 09-28 20:31 | 66.5 | 1/0 | 0 | 1/1/1 | No inline findings; one master update. Final successful-evidence proxy was only 1.2 min before merge. |
| [Workflow retirement #596](https://github.com/harshanandak/forge/pull/596) | 09-28 19:55 → 09-29 16:54 | 1259.2 | 10/15 | 17 | 10/13/5 | Repeated ruleset, capability revocation, transactional audit and rollback/mode/recovery cases; five master merges. Some later P2s were explicitly filed separately. |
| [Historical docs cleanup #597](https://github.com/harshanandak/forge/pull/597) | 09-28 20:08 → 09-29 06:27 | 619.8 | 5/4 | 3 | 4/4/2 | Research hand-off instructions repeatedly conflicted with auto-created plan issues; two master updates, overnight elapsed time and 26.3 min after successful-evidence proxy. |
| [Bun auto-update #598](https://github.com/harshanandak/forge/pull/598) | 09-28 20:30 → 09-29 16:33 | 1203.3 | 8/12 | 13 | 7/10/1 | Partial-run recovery, staging rollback/concurrency, workflow-write token permission, stale bump branches/tracking issues and integration with generated size workflow; unrelated macOS contender flake also failed CI. |
| [Dependency trimming #599](https://github.com/harshanandak/forge/pull/599) | 09-28 20:35 → 09-29 17:49 | 1273.1 | 3/3 | 2 | 8/10/5 | Fail-closed YAML reads, missed parser migration and new Bun-workflow fixtures; five master merges. Kernel records additionally report local structural timeouts and a stale ownership lease. |
| [CodeQL security fixes #600](https://github.com/harshanandak/forge/pull/600) | 09-28 20:37 → 09-29 05:47 | 549.9 | 1/0 | 0 | 1/1/1 | One master update and no inline findings; overnight wait. Latest successful-evidence proxy was 4.4 min before merge. |
| [One-package fold #601](https://github.com/harshanandak/forge/pull/601) | 09-28 20:55 → 09-29 18:54 | 1319.1 | 1/0 | 0 | 6/9/3 | macOS/Windows CI failures, Sonar corrections, module serialization, dependency-cleanup integration, a reported stale lease, then two hosted Codex failures. Exact-head review finally completed at 18:53:36 and merge followed at 18:54:30. |
| [Per-block package budget #602](https://github.com/harshanandak/forge/pull/602) | 09-29 07:13 → 09-29 12:22 | 308.3 | 7/9 | 9 | 6/7/0 | Trigger completeness, inflated/nonnumeric baselines, exact-base measurement, Node/npm pinning and fixture corrections; Windows identity timeout required investigation and the same Tests run was rerun. |
| [Stryker 10 bump #603](https://github.com/harshanandak/forge/pull/603) | 09-29 12:47 → 09-29 16:09 | 201.9 | 1/0 | 0 | 1/1/1 | Initial PR Tests failed Windows Node 24; a separate mutation dispatch failed its dry run; later master update and normal PR checks passed. The mutation upgrade was not validated by a successful mutation result. |
| [Restore Windows drift test #604](https://github.com/harshanandak/forge/pull/604) | 09-29 16:47 → 09-29 17:33 | 45.7 | 2/1 | 1 | 1/1/1 | Reversed a local-timeout-only quarantine. Codex requested retaining the quarantine because the written registry policy disagreed with the owner's rule; one master update and 31.9 min after successful-evidence proxy. |

The successful-evidence proxy above is the latest successful current-head check completion, excluding PR Monitor and bypass jobs, or completed Codex timestamp. It is **not** a reconstructed merge-ready timestamp: historical thread resolutions, lease proof, status-context transitions and owner readiness are not all timestamped by these reads. The waiting intervals therefore are not automatically avoidable. [ran; inferred]

Across the 26 merges, the mean is **462.1 minutes**, median **306.8**, P75 **611.7**, P90 **1,273.1**, minimum **4.6**, maximum **1,488.8**. Percentiles use nearest-rank over the merged subset and exclude the open tail. Median observable review rounds are **2**, median post-open head updates **2**. The 26 merges account for 83 threads, at least 94 head updates and 49 master-merge commits; the open worktree PR alone adds 26 threads, 17 observed head updates and 13 master merges. [ran]

The bottleneck is not uniformly reviewer latency or coding speed. The longest rows combine substantive safety/correctness corrections with repeated integration; other rows have long periods after successful evidence. Removing useful security/data-loss findings would trade throughput for regressions. The target is fewer defective correction cycles and fewer repeated base updates. [inferred]

## CI reality

### Required checks and landing policy

Live master protection requires **CodeQL**, **ESLint**, **Analyze (javascript-typescript)**, **Run eslint scanning**, **Analyze (actions)** and **CI Gate**. `strict=true`, administrator enforcement and conversation resolution are enabled; linear history is required. The live repository is public and owned by a **User**, native auto-merge is disabled, and the repository rulesets API returned an empty list. This does not mean branch protection is absent. [ran: `gh api repos/harshanandak/forge/branches/master/protection`, repository and rulesets APIs]

GitHub's merge queue is available for public **organization-owned** repositories, not this personal-account ownership arrangement. Strict up-to-date therefore needs a serial landing coordinator or a separately approved organization transfer; merely enabling a queue is not an available next step here. The owner has already chosen CI-first guarded `forge merge --auto`; preserve exact-head, lease and current-base proof. Native `allow_auto_merge=false` is a separate setting, not evidence that the guarded Forge operation cannot execute. [external: [GitHub merge-queue availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue); ran; inferred]

**Current duplicate producer remains:** the pinned [required-checks-bypass.yml](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/required-checks-bypass.yml#L104) still publishes an unconditional echo-success job named `CI Gate`; that job has no dependency on its own doc-asserting `Test Suite`. The authoritative Tests workflow now runs on every PR. This is source evidence of duplicate producers and independent green reporting, not a newly reproduced incorrect merge. Retire the obsolete producer through the supported workflow writer before relying on one authoritative gate; preserve the real doc-assertion lane. [read; inferred]

### Workflow wall times

The following table measures **earliest active check start to latest completion per Actions run**, from the current/final-head rollups of all 27 PRs. It includes dependency/queue gaps between jobs, but excludes time before the first check starts, and is not a full historical workflow census. Multiple PR Monitor runs on one head remain separate samples. External status-only providers cannot be timed this way. Values are seconds, nearest-rank percentiles. [ran: all PR `statusCheckRollup` fields]

| Observed workflow | Runs sampled | P50 wall | P90 wall | Range |
| --- | ---: | ---: | ---: | ---: |
| Tests | 27 | 549 | 971 | 138–3178 |
| CodeQL Advanced | 27 | 91 | 100 | 62–108 |
| ESLint | 27 | 28 | 32 | 23–35 |
| PR Monitor | 68 | 25 | 33 | 16–59 |
| Build Binary | 21 | 20 | 27 | 16–44 |
| Docs Validation | 27 | 14 | 18 | 9–22 |
| Required Checks Bypass, historical PR heads | 17 | 13 | 37 | 9–39 |
| YAML Validation | 11 | 13 | 15 | 8–17 |
| Package Size Monitor | 20 | 10 | 15 | 7–16 |
| Dependency review | 6 | 9 | 12 | 7–12 |

The outlier **3,178-second** Tests span is lease-renewal [run 36416340017](https://github.com/harshanandak/forge/actions/runs/36416340017), whose API records attempt 2; it is not a 53-minute individual test job. In the 11 PRs opened from the Node-floor change onward, Tests span P50 remains 549 seconds but P90 is **600 seconds**. Different changes and rerun history prevent attributing that improvement to one optimization. [ran; inferred]

A supplementary read of the latest 1,000 repository runs, covering only part of September 29, found **36 successful CodeRabbit After Tests** runs: median API elapsed time 8 seconds, P90 14 seconds. This measures the trigger workflow, not the CodeRabbit review service. Greptile Quality Gate appeared in those runs, but there was no successful sample for a success-duration statistic. Publish, release/manual and other workflows without suitable observed jobs are **unmeasured**, not zero-cost or absent. The 1,000-run sample is deliberately not used as a five-day census. [ran]

### Tests jobs by operating system

These are whole active-job elapsed times, including setup, installation, fixtures, test execution and artifact work, from final/current PR head rollups. Historical Node 22 jobs are retained in the measurements; the current source matrix is Node **24 and 26**. [ran; read: [test.yml at the pinned ref](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L134)]

| Tests job | Samples | P50 seconds | P90 seconds | Range |
| --- | ---: | ---: | ---: | ---: |
| Ubuntu full matrix, pooled Node versions | 28 | 98 | 110 | 65–111 |
| macOS full matrix, pooled Node versions | 28 | 175 | 239 | 95–242 |
| Windows full matrix, pooled Node versions | 28 | 536 | 894 | 398–958 |
| Ubuntu unit shards, four shards pooled | 108 | 44 | 53 | 29–62 |
| Windows smoke | 27 | 66 | 78 | 40–112 |
| macOS smoke | 27 | 21 | 33 | 11–97 |
| Targeted Ubuntu Node 24 | 27 | 20 | 102 | 12–104 |
| Targeted Windows Node 22, historical | 15 | 80 | 951 | 63–987 |
| Targeted Windows Node 24 | 12 | 86 | 476 | 74–530 |
| Ubuntu coverage | 27 | 147 | 161 | 124–210 |
| Ubuntu E2E | 27 | 27 | 35 | 21–38 |
| Cross-OS Gate | 27 | 3 | 4 | 2–5 |
| CI Gate | 27 | 3 | 5 | 2–5 |

For the 14 PR heads with full matrix on both OSes, compare the slowest Windows node job with the slowest Ubuntu node job **on the same head**: median ratio **5.25×**. For example, fixture completion is 958 versus 107 seconds, while one-package fold is 578 versus 111 seconds. Windows is a material critical-path penalty, but it is not the entire 5–21-hour PR cycle. [ran: [fixture Tests run](https://github.com/harshanandak/forge/actions/runs/36331267005), [package-fold PR checks](https://github.com/harshanandak/forge/pull/601/checks)]

The remote workflow already sets Windows TEMP/TMP to the work drive, has Bun-download caching, and avoids the targeted full-suite fallback when the full matrix runs. Do not propose those as new work. Coverage still runs a broad Ubuntu suite, alongside matrix and shard work; removing it requires preserving its actual coverage/artifact proof, not declaring every overlapping test invocation redundant. [read: [Windows setup](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L167), [fallback condition](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L508), [coverage job](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L538)]

### Failure, flake and quarantine counts

The complete Tests API read for the requested window returned **192 runs**: 159 PR, 27 push, 5 manual dispatch and 1 scheduled. Latest-attempt results are **141 success, 28 failure, 23 cancelled**. Within the 159 PR runs, **119 success (74.8%)**, **21 failure (13.2%)**, **19 cancelled (11.9%)**. These include real regressions, flakes, cancellation and integration changes; they are not 21 confirmed flakes. [ran]

Three returned Tests runs have `run_attempt=2`: [Windows identity/package budget](https://github.com/harshanandak/forge/actions/runs/36555164372), [lease renewal](https://github.com/harshanandak/forge/actions/runs/36416340017), and [package installation](https://github.com/harshanandak/forge/actions/runs/36233198645). Latest-attempt snapshots hide earlier outcomes, so the observed success distribution overstates all-attempt success. Reasons for every replay were not established. A policy saying there are no retries must not be confused with proof that no manual rerun occurred. [ran; inferred]

The pinned [quarantine registry](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/test/QUARANTINE.md#L24) contains **nine cases**:

| Status | Count | Cases and evidence |
| --- | ---: | --- |
| Quarantined, Windows only | 2 | Memory recall holdout, 20,051 ms against 15,000 ms, [master run 36345257796](https://github.com/harshanandak/forge/actions/runs/36345257796); init-hooks sanity, 15,535 ms against 15,000 ms, [fold run 36606854498](https://github.com/harshanandak/forge/actions/runs/36606854498). |
| Quarantined, macOS only | 3 | Journal heartbeat acquired a supposedly held lock, [run 36457747077](https://github.com/harshanandak/forge/actions/runs/36457747077); eval subprocess timed out at 15,002 ms, [run 36482604003](https://github.com/harshanandak/forge/actions/runs/36482604003); SQLite contenders timed out at 20,008 ms, [run 36549230672](https://github.com/harshanandak/forge/actions/runs/36549230672). |
| Watching, not skipped | 4 | Patch-intent ENOTCONN; skill mirror regeneration; staged Bun workflow projections; Flow's 256-event ceiling. Local evidence is recorded, without proving a CI flake. |

These are **registry cases**, not a repository-wide count of every `skip`, `todo` or unresolved flaky issue. No exhaustive skip census was conducted. Kernel records additionally include the CI fixture-directory race (`f730b3b6`) and Windows identity problem; those are not additional rows in this pinned registry. [read]

**Policy conflict requiring correction:** registry lines 8–9 allow a second local occurrence to promote quarantine, whereas the shared brief requires a CI flake with its run cited. Skills drift is still `watching` after two local failures, deliberately following the owner's direction. [PR #604's P1 review](https://github.com/harshanandak/forge/pull/604#discussion_r4136060310) explicitly invokes the contradictory written rule to request re-quarantine. This is an agent-steering defect, not merely an ambiguous timeout. [read; ran; inferred]

### Windows identity cost

Issue **Windows identity cost (`0b3c0c50-952f-42e3-852c-edd3dd1e8d17`)**, filed September 29, reports seconds per identity call and a 16,071 ms test timeout against 15,000 ms. The source confirms a fresh synchronous `powershell.exe` spawn for **each** process identity read, obtaining process start-time ticks; there is no timeout option on that spawn. The Windows dispatcher routes every default identity read there. [read: [process-tree.js:251–273](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/scripts/process-tree.js#L251)]

The original [Windows targeted job](https://github.com/harshanandak/forge/actions/runs/36555164372/job/109362568867) is genuinely **failure, attempt 1**, lasting **515 seconds**, with the full-suite fallback step failing. The run is now **success, attempt 2**, explaining why its latest jobs API initially showed no failure. The exact per-call latency is reported by the issue, not independently benchmarked here. [ran; read]

Fix the shared identity-read cost while retaining PID-reuse protection and fail-closed unknown identity. A batched/native read or a measured persistent helper is plausible; caching identity across process exit is not safe. Reducing this source cost should help push proof and lifecycle/claim/cleanup tests, but how much of the total Windows penalty it explains is **unmeasured**. [inferred]

### Mutation testing: verified failure, different from the issue summary

Issue **Broken mutation lane (`a58bc1bb-9c0a-46d9-a5c8-f620853a9c2c`)** reports failure since March. The schedule API returns **32 retained runs**, February 22–September 27: **31 failure and 1 cancellation**, no successful workflow run. Direct Mutation-job reads independently verify failures on [March 8](https://github.com/harshanandak/forge/actions/runs/22814111564/job/66176275302), [March 22](https://github.com/harshanandak/forge/actions/runs/23396003357/job/68059309841), [May 31](https://github.com/harshanandak/forge/actions/runs/26705944145/job/78707116332), [July 12](https://github.com/harshanandak/forge/actions/runs/29182125482/job/86621649931) and [September 27](https://github.com/harshanandak/forge/actions/runs/36307967076/job/108588214057). Not every intervening Mutation job was inspected, and older job APIs do not expose enough steps to prove a common historical failure mechanism. [read; ran]

For the Stryker 10 [dispatch 36570515358](https://github.com/harshanandak/forge/actions/runs/36570515358/job/109413065936), the live log establishes:

- Stryker found **258 mutable files** among **2,115 files**, instrumented **106,522 mutants**, and created **four runner processes**.
- It started an initial command-runner test run with coverage analysis off at **12:48:07**.
- At **12:50:10**, `DryRunExecutor` reported tests failing in the initial run, followed by `ConfigError`; examples include skill routing, hidden watcher-spawn assertions, onboarding AGENTS generation, status output and skill-eval JSON parsing.
- The command exited **1**. Upload reported no `stryker-report/` files. The job lasted **148 seconds**; the mutation step lasted **135 seconds**.

Thus the issue's statement that the tests were all passing is incorrect for this dispatch. The observed failure is **initial-suite incompatibility/failures inside the mutation sandbox**, not a mysterious exit after a successful mutation run. Exactly which sandbox assumptions need repair has not been reproduced here. [ran; inferred]

Current [stryker.config.json](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/stryker.config.json#L1) uses `bun test`, mutates `lib/**/*.js`, disables coverage analysis and enables incremental results. The workflow has a **60-minute** timeout and runs only on schedule/manual dispatch; mutation is not included in the CI Gate dependencies. [read: [mutation job](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L656), [aggregate needs](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/.github/workflows/test.yml#L960)]

Even after dry-run repair, cost needs a real benchmark: 106,522 mutants on four runners must average roughly **0.135 seconds/mutant** to fit 60 minutes before overhead. At one second/mutant it would take about **7.4 hours**. These are arithmetic scenarios, not measured mutation runtime; early bailout, invalid mutants and incremental reuse can change the workload. Restore a scored artifact and seeded-mutant proof before treating this lane as release confidence. [inferred]

## Tooling friction and its delivery effect

Kernel records below were read using the prescribed session and CLI. Their reported measurements/reproductions are [read], not new reproductions by this leg.

| Friction | Evidence | Quantification and implication |
| --- | --- | --- |
| Informational comments become blockers | **Shepherd summary blockers (`bb0d2006-9c30-4771-a47c-c9ffac328b54`)**, filed 09-29 12:06 UTC, names the CodeRabbit walkthrough and Codex status table on workflow retirement. [PR #596 summary](https://github.com/harshanandak/forge/pull/596#issuecomment-5877392421) is informational. PR #585 had already tried to address false blockers. | Repeat inspection and misleading BLOCKED-THREADS/ESCALATE verdicts; no reliable minute total. Fix marker classification plus verdict/evidence parity, while unknown/human comments remain actionable. [inferred] |
| Delegated lease hand-off | **Stale delegated leases (`66496e29-29cb-4c9a-b9a5-78aeea5300cf`)**, filed 09-29 16:57, records **two stalls**: dependency trimming held by `codex-pr599`, package fold held by default actor `forge`. | Actual stall duration is not recorded; expiry times lack sufficient timezone context for subtraction. Require holder-authorized release/transfer and read-back, not actor impersonation or waiting by default. [inferred] |
| Quick push still waits for team sync | **Push sync cost (`f7f7e730-5759-4134-96b1-ef568c1f6ded`)**, filed 09-29 12:17, reports **~192 seconds** in one quick-push pre-push team-sync step. [Lefthook lines 71–74](https://github.com/harshanandak/forge/blob/ba56b9201782c4d1246c77bde6380867603184bf/lefthook.yml#L71) still invoke the team shell sync with `|| true`. | Non-failing exit status is not non-blocking latency. If repeated on all 111 observed post-open updates, that is **355.2 minutes / 5.9 hours** of aggregate waiting; this is an extrapolation from one measurement, not a measured cohort total. Retire the already-deprecated shell path or bound/defer optional sync through a supported policy change. [inferred] |
| Shared dependency junctions | Remote setup explicitly creates Windows junctions; **Junction deletion (`720eda2b-76e3-4277-96f3-76f6c0f3078e`)** records a temporary worktree removal deleting another worktree's shared install. [PR #582](https://github.com/harshanandak/forge/pull/582) contains detach/restore/identity safeguards under review. | Local read-only inventory: **113 registered worktrees, 52 junctions, 40 ordinary node_modules directories, 21 missing**, zero other link types. Missing modules do not imply broken worktrees. One reported destructive incident and version-mismatched installs justify a safety gate; no removal was performed here. [ran; read; inferred] |
| Strict base with no native queue | Live protection/ownership and official GitHub availability, above. | **62** visible master-merge commits in the requested cohort, **49** among merged PRs. Landing one PR can invalidate siblings even when their code is good. Serializing only the landing front reduces replay work without reducing implementation concurrency. [ran; inferred] |
| Hosted Codex review | Package-fold comments record **Unknown error**, then **provided ref does not exist**, despite an owner-confirmed existing head; issue **Hosted review ref failure (`28dba549-8b7f-43c9-a70a-f1b384404f04`)**. | Manual request at **18:03:03**, explicit blocked status **18:17:30**, final request **18:50:10**, successful review **18:53:36**, merge **18:54:30**: **50.6 min** request-to-success, including a **36.1-min** interval after explicit blocked status. Same head recovered; code churn was unnecessary. [ran; inferred] |
| Other review-service capacity | [PR #604 CodeRabbit comment](https://github.com/harshanandak/forge/pull/604#issuecomment-5894650207) reports next free review in **31 minutes**; Qodo comments report inactive subscription. Package-fold owner status says CodeRabbit file-limit. | Multiple installed bots do not guarantee multiple available reviewers. Minute totals and coverage across all PRs are not established; distinguish provider availability from code failure. [ran; inferred] |
| Agents quarantine local timeouts | Skills drift records **34,267 ms and 21,067 ms** against **20,000 ms** locally, with no CI failure cited; [restore-test PR #604](https://github.com/harshanandak/forge/pull/604) reverses the skip. Structural issue `04afb9f9` reports three local failures; fold issue `5c05e01a` reports 47 node, 9 bun and 10 git processes at a snapshot. | Reversal cost: a separate **45.7-minute PR**, one new thread, a new base update and repeated review. Process counts suggest contention but do not prove causation. A local timeout is diagnostic evidence; it must not silently redefine the CI gate. [read; ran; inferred] |

The worktree inventory is machine-local evidence, separate from the remote source pin. Existing junctions are not permission to clean them. Dependency sharing must compare the target's actual install inputs and detach safely before every supported removal path; a refused removal must restore the dependency link. The current worktree PR's 26 threads show why this belongs in one tested shared seam, rather than another fix in one caller. [inferred]

## Realistic throughput and the five highest-value changes

The live merged-PR query returned **28 merges** in the five UTC dates September 25–29: September 25 **0 returned**, September 26 **2**, September 27 **5**, September 28 **12**, September 29 **9** at collection. This is **5.6 merged PRs per calendar date**, with the final date incomplete. It includes package-installation PRs #575/#576 beyond the requested cohort. Requested-cohort throughput is 26/5 = **5.2/day**, or **8.7/day** on its three active dates. Neither statistic measures user-accepted release outcomes, owner working hours or escaped defects. [ran: `gh pr list --state merged --search 'merged:>=2026-09-25' --json number,createdAt,mergedAt,...`]

**Planning forecast:** use **4–6 small/medium PRs per day** at current reliability, with **1–2 major coupled/kernel/package PRs per day** as a separate complexity scenario. The observed 9–12/day is a burst consisting partly of narrow repairs/quarantines and work prepared earlier. A large plan cannot safely multiply that burst by the number of agents. These ranges are conservative judgments from the observed rates, long tail and owner bottleneck, not statistical capacity estimates. [inferred]

Ranked changes, retaining CI-first guarded merging and the P0/P1/regression review bar:

| Rank | Change | Expected effect and how to verify it |
| ---: | --- | --- |
| 1 | **One owner runs a serial landing front.** Keep a small ready queue; update/test only the next landing candidate against the moving base. Workers can implement independent scopes behind it. | Direct target is 49 visible master-merge commits among merged PRs. If half the base-update work can be eliminated, roughly **25 CI replays/cohort** could disappear; at the observed 549-second median span that is about **3.8 hours of aggregate pipeline elapsed work**, not guaranteed calendar time saved. Verify fewer base-only pushes per merge and lower P75 latency. [inferred] |
| 2 | **Batch review and apply the owner's finding bar consistently.** Review the shared failure model before another patch; fix P0/P1 and every introduced regression, file genuinely non-blocking P2 work, and use one integrated correction head. | Workflow retirement/Bun automation/worktree safety have **10/8/17 observable rounds**. Bringing bounded ordinary work to **one or two correction heads** removes both reviews and CI replays. Do not defer a destructive regression merely because a bot labels it P2. The existing validation skill already says stop before Fix #4; extend that discipline across review loops. [read; inferred] |
| 3 | **Remove the Windows identity spawn tax and measure subprocess/fixture cold cost.** Fix the shared primitive with PID-reuse safety; use measured host/runner resource budgets. | Windows paired full-matrix penalty is **5.25×**, with roughly **seven additional minutes** per median pooled full-matrix job versus Ubuntu. Recovering even 20–30% of a 536-second Windows job would save **107–161 seconds/head**; that is a scenario, not attribution to identity calls. Require a native identity timing budget and complete CI proof at unchanged correctness assertions. [inferred] |
| 4 | **Make worktree bootstrap and quick push deterministic.** Land the junction safety/restore seam, prove install-input compatibility or install locally, and retire the deprecated team-sync shell step through its owning configuration. | Prevent dependency loss/mismatch, avoid repeat local diagnosis, and target the reported **192 seconds/push**. A target of ≤15 seconds for optional sync would recover roughly **177 seconds** on a push that currently reproduces the issue; verify with multiple fresh-worktree and push traces, without bypassing hooks. [inferred] |
| 5 | **Make blockers truthful and hand-offs explicit.** Classify informational bot markers, expose the actual blocker, use one session/lease protocol, and give hosted-review outages a bounded same-head recovery path. | Remove the **two observed ownership stalls**, repeated false-blocker inspections and code churn caused by provider failures. The package-fold example exposes a **50.6-minute review-service interval** worth reducing. No general minute saving is measured. Verify an owner can resume a completed worker's issue without waiting for expiry, and clean PR evidence produces a truthful verdict. [inferred] |

Effects overlap and must not be summed into a promised multiplier. A reasonable improvement target is **6–8 ordinary merges/day with a materially shorter tail**, after a measured pilot; no evidence here supports promising 15–20 sustained merges/day from additional agents. More workers are useful only when independent issue/plan scopes, install resources, review capacity and the landing owner have room. [inferred]

## Before the big plan executes

These are entry conditions, not implementation authorization in this leg. They are the minimum delivery contract the owner should make executable before launching many coupled changes. [inferred]

1. **Set the operating contract.** One integration/landing owner; an initial landing queue limit of three; disjoint worker scope; one owner/session identity passed to every dispatch; explicit release or audited transfer/read-back at hand-off. Preserve exact-head/current-base CI, issue ownership and `forge merge --auto`. Record the contract in the approved plan/owning issues so no worker improvises a different actor or merge bar.
2. **Resolve the steering contradictions.** Make the quarantine rule uniformly require a demonstrated CI flake and its run citation; local-only timeouts remain watched/diagnosed. Make bot review instructions and reviewer/owner behavior agree on fixing P0/P1 and regressions while filing non-blocking P2s. Clarify when diagnostic reruns are permitted; never turn retry-to-green into proof. PR #604 and the identity run show the existing prose/runtime practices differ.
3. **Prove worktree/dependency safety before scaling.** The open worktree PR must pass exact-head review/CI and deletion sentinel tests for every supported cleanup/remove/eval route, including refusal/restore behavior. A fresh worktree must either prove manifest/lock compatibility with its shared install or install its own dependencies. Retain old worktrees until the removal proof is trustworthy; do not clean 52 junctions as a preparation shortcut.
4. **Make the fast path genuinely bounded.** Diagnose/remove the reported team-sync delay through supported owning configuration; measure Windows process identity and fixture/subprocess startup. Retain local gates until the approved CI-first delivery mechanism replaces their proof contract; neither this report nor a timeout grants permission to skip them. Start with one expensive local test lane per host, then raise concurrency only from measured capacity.
5. **Retire the duplicate gate producer and test real release artifacts.** The pinned bypass workflow still emits unconditional `CI Gate` success independently of its doc tests; remove that obsolete producer through the supported writer while preserving the authoritative Tests/doc lane. Verify one authoritative result per intended head/run, correct mixed/rename classification, and preserved Windows coverage. Require fresh npm-package installation/CLI journeys on supported runtimes, not only source-tree unit passes.
6. **Restore off-PR confidence.** Repair Stryker's initial sandbox suite, obtain an actual scored/report artifact and demonstrate a seeded mutant is caught; benchmark a realistic workload against the timeout. Make schedule failure actionable. PR-green does not establish mutation confidence, and the Stryker 10 merge did not validate that functionality.
7. **Run a bounded delivery pilot before fan-out.** Use five representative ordinary changes plus one coupled package/kernel change through the actual owner loop. Capture opening head, correction heads, base-only updates, original and rerun attempts, CI completion, review-service failure, lease transfer and merge receipt. Follow with ten working days of measured operation before increasing WIP; target ≥90% first settled-head required-check success, ≤2 correction heads for ordinary work, ordinary P75 under four hours, and no local-only gate quarantine. These targets are proposed acceptance criteria, not achieved results.

Readiness does not require fixing every historical issue. The must-fix set is the demonstrated authority/data-loss risk, conflicting agent instructions, unbounded routine fast-path work and missing confidence claimed by the plan. Other unrelated improvements remain in their existing Kernel issues. This leg makes no issue mutations under the brief's hard limit. [inferred]

## Evidence and reproducibility

All GitHub commands ran through `node bin/forge.js github run -- gh ...`, with `FORGE_SESSION_ID=delivery-train-20260928a`, from the assigned worktree. Kernel records came from `node bin/forge.js list --json`, filtering the returned structured issue rows, not from the stale main checkout. [ran]

| Read | Fields / scope |
| --- | --- |
| `gh pr view N --repo harshanandak/forge --json number,title,createdAt,mergedAt,closedAt,state,url,commits,reviews,comments,statusCheckRollup,headRefOid,baseRefOid` | Every N from 578 through 604, not a sample. |
| `gh api graphql` | All 27 PRs: `timelineItems(first:100)` for commits, reviews, force pushes, base changes, ready/review requests and merge; `reviewThreads(first:100)` with resolution/outdated state and comments. Pagination flags checked. |
| `gh api 'repos/harshanandak/forge/actions/workflows/test.yml/runs?per_page=100&created=%3E%3D2026-09-25&page=N'` | Two pages, 100 + 92 rows; oldest retained result 09-26 08:28:46. Latest attempts, not an all-attempt archive. |
| `gh api .../actions/workflows/test.yml/runs?per_page=100&event=schedule` | 32 retained scheduled runs; five selected historical Mutation-job reads. |
| `gh api .../actions/runs/ID/jobs?per_page=100` and `gh api .../actions/jobs/109362568867` | Mutation dispatch, package allow-list failure, package-fold macOS failure, Stryker PR Windows failure and original identity job. |
| `gh run view 36570515358 --job 109413065936 --log-failed` | Filtered initial-run/Stryker errors and report-upload warning; no local execution of the tests. |
| `gh api .../branches/master/protection`, repository API, rulesets API | Live check contexts, strictness, owner type and native settings. |
| `gh pr list --state merged --search 'merged:>=2026-09-25' --limit 100 --json ...` | 28 repository merges, daily UTC counts; includes #575/#576. |
| `git show origin/master:PATH` | Quarantine registry; Tests workflow; process identity; worktree/cleanup/merge surfaces; Lefthook; Stryker config; validation skill. |
| `git worktree list --porcelain -z` plus native filesystem link metadata | All 113 registered worktrees, counted by node_modules link/directory presence; read-only. |

Historical orientation used prior delivery-audit memory to distinguish proposals from landed work and avoid treating stale verdicts as readiness. None of the historical throughput numbers are used in this report; all numerical conclusions above come from the current reads. [read]

## Open questions for the owner

- **Landing arrangement:** **A — keep the personal repository and use one serial guarded landing owner (default)**; **B — separately approve an organization transfer and native-queue setup**. Both preserve current required-check proof. This leg does not perform either change.
- **Capacity assumption:** **C — budget 4–6 ordinary PRs/day and 1–2 coupled changes/day until the pilot proves more (default)**; **D — budget the observed 6–9/day burst with explicit integration/time contingency**. Neither is a guaranteed release rate.
- **Mutation entry gate:** **E — require sandbox repair, scored artifact and cost benchmark before relying on mutation confidence in the big plan (default)**; **F — start independent plan work while treating mutation confidence as missing, with no claim that the lane validated the release**.

Valid replies are labels or combinations. **Default: A+C+E.** The already-decided one-package layout, Node 24 minimum, Node 24/26 CI and guarded CI-first merge policy are not reopened.

## Confidence

**High** on the 27-PR cohort's timestamps, fetched thread counts, visible correction/base-update history, live protection/ownership, recorded CI job times and the current mutation dispatch's initial-suite failure. **Medium** on attribution of delays: several long waiting periods have no recorded cause, review summaries lose historical rounds, push counts are lower bounds, and API run summaries retain the latest attempts. **Low-to-medium** on sustainable capacity and improvement magnitudes: the sample is short, mix-dependent, contains overnight waits and has no owner active-time or escaped-defect measure. The throughput ranges are planning estimates that require the proposed pilot. [ran; inferred]
