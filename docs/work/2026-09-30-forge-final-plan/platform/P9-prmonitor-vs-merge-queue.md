# P9: Forge PR monitoring and shepherd versus GitHub merge queue

Decisions needed: monitoring scope and future queue eligibility; recommended defaults are stated below. This is research, not implementation authorization.

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p9-prmonitor-vs-mergequeue-20261001",
  "contextDigest": "aa0d387bb0acb60a5e06248081d10f30a8392d8e1a8e8b697951f26869d63150"
}
```

Research date: **2026-10-01**. Assigned plan: `docs/work/2026-09-30-forge-final-plan/`. Governing brief: `(local scratch)`, read first. Owner constraints: one npm package; Kernel issue authority; CI-first guarded `forge merge --auto` with exact head and owned issue; retain the previously chosen strict serial merge train unless explicitly changed. [read: shared brief and P9 request]

## Bottom line

1. **Do not replace shepherd with merge queue wholesale:** the queue validates integration commits and schedules merges; Forge also owns issue authority, evidence binding, diagnostics, and local watcher lifecycle. [read; inferred; external: GitHub queue documentation below]
2. **Queue eligibility is narrower than “public repos are free”:** public organization repositories qualify on Free; personal-account repositories do not qualify under GitHub's documented availability. Forge's live owner type/settings could not be read. [external; ran]
3. **The measured monitor/shepherd baseline is 10,070 physical lines:** 8,484 in `lib/pr-monitor/`, 1,052 in its command, and 534 in the bounded shepherd engine; guarded merge/rules add 2,065. [ran]
4. **GitHub can supply repository enforcement now:** required checks, reviews, conversation resolution, rulesets, and auto-merge are available for public personal as well as organization repositories. [external]
5. **GitHub's check acceptance is not Forge's strict required-check floor:** GitHub accepts successful/skipped/neutral conclusions; Forge's protected required checks demand `SUCCESS`. [read; external]
6. **Keep exact-head issue binding, live ownership rechecks, merge approval, provider confirmation, and terminal evidence:** a passing GitHub check or queue entry is not a Kernel lease. [read; inferred]
7. **Fix policy duplication before adopting another scheduler:** the bounded shepherd retries ordinary failed required checks within a budget; the Actions auto-action policy rejects ordinary failures. [read]
8. **The best concrete adjacent prune is the 759-line Beads-backed coordinator:** migrate its live plan/ship consumers before deleting it; it is not an orphan. [read; ran; inferred]
9. **The largest conditional reduction is the 4,101-line local watcher/daemon group:** removing that product behavior could save roughly 3.8–4.3k net lines; moving it into an adapter saves zero packaged lines. [ran; inferred]
10. **Preserve the strict serial decision for 0.1.0:** narrow monitoring first; consider a queue adapter only after eligible ownership, complete CI/review coverage, and authority-at-execution semantics are proven. [inferred]

## Evidence, scope, and limitations

- **[read]** means inspected source and control flow on the named ref; it is source evidence, not a passed behavioral test.
- **[ran]** means an inventory/count/census command ran successfully. It does not mean the inventoried product tests ran.
- **[external]** means primary GitHub documentation fetched **2026-10-01**, linked beside the relevant claim.
- **[inferred]** means a recommendation, architectural deduction, or estimate; it is not a measured implementation result.

The source ref is **`origin/master` (`7d448ec812ef8639790477af07c3c75962173f8a`)**, dated 2026-09-30. Local HEAD was `ba56b9201782c4d1246c77bde6380867603184bf`, so source inventory used `git show origin/master:<path>` and `git grep ... origin/master`. Ref freshness against live GitHub is **unknown**: no fetch was performed under the one-file write restriction. [ran]

The permitted live read, `node bin/forge.js github run -- gh repo view --json nameWithOwner,isPrivate,defaultBranchRef,owner,viewerPermission`, failed with **“Unable to access this clone-local GitHub account binding.”** This was an account-binding failure, not the brief's transient network-error case. No authentication change or alternate GitHub read route was attempted. The sanitized origin namespace is `harshanandak/forge`; the name alone does not prove whether the owner is a User or Organization. Actual rulesets, protected-check names, queue enablement, auto-merge enablement, and bot check production are unverified. [ran]

No product tests were executed: they were inventoried as coverage, and executing fixture/process tests could write outside the sole report artifact. No source changes, commits, pushes, GitHub writes, Kernel mutations, browser, or context-mode calls were made. [ran: actions taken in this research phase]

### Counting method and the P5 baseline

For each tracked path, the successful native PowerShell count was `@(git show "origin/master:$path").Count`; these are physical lines, including comments and blanks. Caller/test census used case-insensitive and exact import/symbol searches with `git grep -n -a`, plus `git ls-tree -r --name-only`. The monitor subtree has **19 modules** and **34 test files** in `test/pr-monitor/`; additional command, CLI, Kernel, and shell tests are listed separately below. [ran]

P5 (`platform/P5-complement-and-openai.md:218,227`) estimated 8,310 monitor lines plus 1,586 shepherd lines, or **9,896**. The measured monitor count is **174 higher**, exactly the size of `events.js`; Git's ordinary grep classified that file as binary. A binary-file omission is a plausible explanation for the older approximation, but the original counting execution was not reproduced. The new baseline is **10,070**, not a promise that 10,070 lines can be removed. [read; ran; inferred]

## 1. Code inventory and callers

All source paths and source line references in this section are on the pinned `origin/master`. Every LOC value is **[ran]**; responsibilities, imports, and named tests are **[read]**. Tests listed here are direct and relevant coverage, not pass claims. Test names abbreviated in the monitor table live under `test/pr-monitor/`; full paths are used for coverage outside that directory.

### Monitor modules: 8,484 lines

| Module | LOC [ran] | Responsibility | Production callers | Tests [read] |
| --- | ---: | --- | --- | --- |
| `lib/pr-monitor/auto-actions.js` | 317 | Pure update-branch/infra-rerun decisions, exact-head action keys and bounded retry/history validation | `scripts/pr-auto-actions.js`; the exported bounded selector has no production caller in the symbol census | `auto-actions.test.js`, `workflow.test.js` |
| `lib/pr-monitor/differ.js` | 301 | Deterministic snapshot-to-event deltas, including canonical verdict changes | `monitor.js`, `flow-monitor.js` | `differ.test.js` |
| `lib/pr-monitor/digest.js` | 206 | Read journal deltas, cap actionable summaries, maintain a separate consumer cursor | `lib/commands/hooks.js` | `digest.test.js` |
| `lib/pr-monitor/events.js` | 174 | Event schema/identity, canonical fingerprints, transition decisions | `differ.js`, `journal.js`, `monitor.js`, `flow-monitor.js`, `watch.js`, shepherd command | `events.test.js`; differ/journal/monitor/watch tests; `test/commands/shepherd.test.js` |
| `lib/pr-monitor/flow-monitor.js` | 1,523 | Flow/Memory authority bridge, durable monitor events and delivery receipts, bounded payload segmentation, restart/reopen recovery, terminal handoff | `monitor.js`; shepherd command and reconcile executor use privacy-safe identity helpers | `flow-monitor.test.js`; `test/commands/shepherd.test.js` |
| `lib/pr-monitor/gather.js` | 331 | Normalize the shared PR snapshot; bound/validate check, review, comment and thread evidence, including incomplete surfaces | Shepherd command | `gather.test.js`, `test/pr-monitor-snapshot.test.js` |
| `lib/pr-monitor/journal.js` | 278 | NDJSON replay journal, snapshots/cursors, crash-window deduplication and journal locking | Digest, monitor, watch, watch-owner and shepherd command | `journal.test.js`, monitor/owner-signal/watch tests; command tests |
| `lib/pr-monitor/monitor.js` | 253 | One bounded gather/diff/persist pass; dispatch durable Flow bridge; `events --since` inline fallback | `watch.js`, `flow-monitor.js` for record finalization, shepherd command | `monitor.test.js`, `monitor-owner-signal.test.js` |
| `lib/pr-monitor/process-identity.js` | 117 | Distinguish the recorded watcher/controller process from PID reuse using process start evidence | Watch owner, reconcile executor | `process-identity.test.js`, `reconcile-executor-owner-authority.test.js` |
| `lib/pr-monitor/reconcile-executor.js` | 1,318 | Repository enumeration, owner reconciliation effects, legacy watcher migration, daemon launch/retirement, contained automatic startup | Shepherd command; hooks/session-start, push and ship commands | `reconcile-executor.test.js`, executor/daemon owner-authority, migration-gate, containment and launch-contention tests; GitHub route tests |
| `lib/pr-monitor/reconcile-tick.js` | 138 | Lease/sentinel debounce before enumeration and reconciliation | Reconcile executor | `reconcile-tick.test.js` |
| `lib/pr-monitor/reconcile.js` | 322 | Pure desired/observed PR and watcher-owner reconciliation; select lifecycle transitions | Reconcile executor and tick | `reconcile.test.js`, `reconcile-owner-authority.test.js`, executor owner-authority tests |
| `lib/pr-monitor/render-summary.js` | 293 | Render the supplied canonical verdict, checks and unresolved threads into Actions Markdown; no independent merge authority | `.github/workflows/pr-monitor.yml` | `render-summary.test.js`, `workflow.test.js` |
| `lib/pr-monitor/review-preflight.js` | 269 | Probe/run local CodeRabbit and deterministic preflight at applicable PR head/base; bound findings; report unavailable/incomplete honestly | Shepherd command | `review-preflight.test.js` |
| `lib/pr-monitor/shepherd-lease.js` | 261 | Filesystem singleton election, heartbeat, release and stale reclaim for one repository daemon | Reconcile executor and tick | `shepherd-lease.test.js`, `shepherd-lease-election-only.test.js`, tick tests |
| `lib/pr-monitor/verdict.js` | 438 | Pure current-head/base identity, ancestry, required-check, review and thread reducer; reject malformed/conflicting/stale evidence | `lib/merge-rules.js`; `differ.js` uses its normalization/validation helpers | `verdict.test.js`, `test/merge-rules.test.js` |
| `lib/pr-monitor/watch-lifecycle.js` | 213 | CLI argv/environment construction and detached watcher launch after reserving owner authority; migration completion gate | Watch/monitor-related command orchestration, reconcile executor; `lib/commands/serve.js` shares GitHub environment helper | `watch-lifecycle.test.js`, launch-contention/gate and owner-cutover tests; GitHub route tests |
| `lib/pr-monitor/watch-owner.js` | 1,414 | Validate Kernel owner rows and migration gate; generation-conditional reserve/bind/heartbeat/stop/terminal/recovery; verify PID/provider/receipt evidence | Watch, lifecycle launcher, monitor polling, reconcile executor, shepherd command | `watch-owner.test.js`, owner-cutover, launch-contention/gate, migration-gate; `test/kernel/watch-owner-transaction.test.js` |
| `lib/pr-monitor/watch.js` | 318 | Foreground watch loop, emit journal events, cooperate with stop/terminal owner transitions and release its generation | Shepherd command | `watch.test.js`, `shepherd-watch.test.js`, owner-cutover tests |

Caller evidence includes `lib/commands/shepherd.js:37-48`, `lib/commands/hooks.js:35,41`, `lib/commands/push.js:21`, `lib/commands/ship.js:15`, `scripts/pr-auto-actions.js:24`, and workflow summary rendering at `.github/workflows/pr-monitor.yml:225`. Cross-cutting coverage also includes `arm-on-push.test.js`, `auto-trigger-wiring.test.js`, `auto-trigger-containment.test.js`, and `ship-auto-shepherd-rail.test.js`. [read; ran: import and test-file census]

Two boundaries matter for pruning. `monitor.js:140-166` selects the durable Flow path when a store is present and otherwise the journal path; `monitor.js:186` begins the pull/event fallback. `flow-monitor.js:604-644,1267-1506` persists delivery/terminal receipts and recovers incomplete batches. Removing a process loop does not make those durable contracts disappear. [read]

### Shepherd, guarded merge, provider helpers and scripts: 7,860 lines including documentation

Test abbreviations in this table share the leading directory shown in the cell.

| Path | LOC [ran] | Responsibility | Production callers | Tests [read] |
| --- | ---: | --- | --- | --- |
| `lib/commands/shepherd.js` | 1,052 | Dispatch bounded pass, pull, complete bundle, events, watch/adopt and daemon modes | Standalone CLI (`bin/forge-cmd.js:19,403`); compatibility PR routing | `test/commands/shepherd.test.js`, `test/commands-shepherd-pull.test.js`, `test/commands-shepherd-bundle.test.js`, `test/forge-cmd-shepherd.test.js`; acceptance/watch/owner tests |
| `lib/pr-shepherd.js` | 534 | Bounded CI/review decision and Tier-A/Tier-B actions; never merges | Shepherd command (`:32,791`); classification helpers consumed by pull/bundle/gather | `test/pr-shepherd.test.js`, `test/shepherd-acceptance.test.js`, `test/shepherd-merge-safety.test.js`, `test/untrusted-fencing-surfaces.test.js`, snapshot/bundle tests |
| `lib/commands/merge.js` | 1,548 | Guarded merge evidence/authority checks, live recheck, squash mutation, confirmation and terminal run receipt | Standalone `forge merge`; `lib/commands/pr.js:351` delegates compatibility merge | `test/commands/merge.test.js`, `merge-authority.test.js`, `merge-authority-review-regressions.test.js`, route/pr-link/pr tests; `test/cli/pr-noun-dispatch.test.js` |
| `lib/merge-rules.js` | 517 | Pure configurable fail-closed rule evaluator, including protected checks that scoped rules cannot exempt | Merge command (`:45,1330,1374`) | `test/merge-rules.test.js`, `test/pr-monitor/workflow.test.js` |
| `lib/pr-pull.js` | 1,467 | Shared PR gathering, verdict precedence, actionable blockers/log excerpts, review actor and head freshness | Shepherd command (`:34,203,793`), monitor gather, verdict-label script | `test/pr-pull.test.js`, snapshot/merge-safety/untrusted-fencing tests; command pull tests |
| `lib/review-adapter.js` | 133 | Review actor/text/result normalization and provider validation | Greptile adapter, adapter CLI, monitor gather/summary | `test/review-adapter.test.js`, `test/greptile-review-adapter.test.js` |
| `lib/pr-bundle.js` | 189 | Complete read-only PR state bundle | Shepherd command (`:33,792`) | `test/pr-bundle.test.js`, command bundle tests |
| `lib/adapters/pr-state-adapter.js` | 796 | GitHub PR/check/review/thread/required-policy transport and action adapter | Merge/shepherd commands, bounded shepherd, workflow retirement, behavioral evaluation | `test/pr-state-adapter.test.js`; merge/shepherd and GitHub route tests |
| `scripts/pr-auto-actions.js` | 93 | Convert verdict JSON to update/rerun workflow flags; no provider write in the script | PR monitor workflow (`:318`) | `test/pr-monitor/auto-actions.test.js`, `workflow.test.js` |
| `scripts/pr-verdict-label.js` | 50 | Map the existing verdict to a visibility label | PR monitor workflow (`:259`) | `scripts/pr-verdict-label.test.js`, workflow tests |
| `scripts/pr-coordinator.sh` | 759 | Dependency/order/simulation/rebase/label/stale-worktree coordination using legacy Beads calls | Packaged (`package.json:126`), copied by setup (`lib/commands/setup.js:273`), invoked by canonical plan (`:119,123,126`) and ship (`:67,70,85,88`) skills | `test/scripts/pr-coordinator.test.js`; nine `tests/pr-coordinator*.test.sh` paths: base, dep, integration, integration-plan-ship, labels, merge-order, merge-sim, rebase, stale |
| `.github/workflows/pr-monitor.yml` | 408 | Actions event backstop, canonical summary/label, update-branch and infrastructure rerun actions | GitHub Actions events | `test/pr-monitor/workflow.test.js`, `test/ci-workflow.test.js` |
| `docs/reference/shepherd.md` | 314 | Operator/reference contract for bounded, daemon, event, authority and action modes | Documentation and skill references | `test/docs-shepherd.test.js` |

Combined with the monitor subtree, this inventory is **16,344 lines**, including **314 documentation lines**; it is neither a transitive dependency total nor a removal estimate. The 10,070-line baseline contains only monitor modules plus the two shepherd files. The separate guarded merge/rule subtotal is **2,065**. [ran: summed disjoint file counts]

### Shared wiring and Kernel storage: count the slice, not the whole file

| Shared path | Whole-file LOC [ran] | Relevant responsibility/callers | Coverage [read] |
| --- | ---: | --- | --- |
| `lib/commands/push.js` | 682 | Post-success singleton trigger (`:153-161,661`) | `test/commands/push.test.js`; arm-on-push, containment/wiring tests |
| `lib/commands/ship.js` | 583 | Auto-shepherd rail resolution (`:19-40`), successful-ship trigger (`:458,531`) | `test/commands/ship.test.js`; ship-auto-shepherd-rail and containment tests |
| `lib/commands/hooks.js` | 770 | Session startup attachment and event digest handler (`:383-398,748`); imports digest/executor | `test/commands/hooks.test.js`; auto-trigger wiring/containment and digest tests |
| `lib/hook-renderer.js` | 700 | Additive shepherd-events prompt projection (`:235-246,359-368`) | `test/hook-renderer.test.js`; inbox/read-attention and harness capability tests |
| `bin/forge-cmd.js` | 456 | CLI command registration and dispatch (`:19,403`) | `test/forge-cmd-shepherd.test.js`, CLI noun-dispatch tests |
| `lib/kernel/migrations.js` | 476 | Watch ownership migration 012 (`:404-411`) | `test/kernel/migrations.test.js`, `test/kernel/watch-owner-transaction.test.js` |
| `lib/kernel/schema.js` | 439 | Watch-owner and watch migration-gate tables (`:318-339`) | `test/kernel/schema.test.js`, watch-owner transaction tests |
| `lib/kernel/sqlite-driver.js` | 5,956 | Watch-owner/migration-gate transactional authority block begins at `:2640`; otherwise shared Kernel storage | `test/kernel/sqlite-driver.test.js`, watch-owner transaction, owner-authority and migration tests |
| `lib/kernel/broker.js` | 2,108 | Shared issue/run/ownership broker used by delivery | `test/kernel/broker.test.js`, `broker-guards.test.js`; migration/concurrency/authority tests |

These whole files are **not** removable watcher lines. The five trigger/dispatch files total 3,191, but only their monitoring slices are relevant. Removing a schema row's code would also require a safe existing-database transition; do not rewrite migration history or delete shared Kernel authority. The broad watch-owner census found storage embedded in generic Kernel files, not a separate removable Kernel module. [read; ran; inferred]

`scripts/package-budgets.json`, `scripts/test.js`, `scripts/test-weights.json`, and `lib/commands/test.js` also reference this subsystem in budgets/test routing. Those metadata references must follow any approved cut; their whole-file sizes are not counted as savings. [read: caller census]

## 2. What GitHub supplies, exactly

All citations in this section are **[external, fetched 2026-10-01]**. Availability describes documented products, not the unread live Forge repository settings.

### Availability and account type

| Feature | Public personal repository on Free | Public organization repository on Free | Private-repository condition |
| --- | --- | --- | --- |
| Required checks / protected branches | Yes | Yes | Pro, Team or Enterprise; not Free private protection |
| Branch/tag repository rulesets | Yes | Yes | Pro, Team or Enterprise Cloud |
| PR auto-merge | Yes | Yes | Pro, Team or Enterprise |
| Merge queue | **No documented personal-account availability** | **Yes** | Organization-owned, Enterprise Cloud |
| Actions workflows and rerun primitives | Available | Available | Plan-dependent hosted allowance; normal Actions permissions apply |

Sources: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [auto-merge availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository), [queue availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue).

Standard hosted Actions runners are free for public repositories; larger-runner/storage economics are separate. Free public CI does not confer queue eligibility on a personal repository. [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)

### Merge queue

The queue builds temporary integration branches containing latest base plus entries ahead, runs required checks, and merges passing entries in order. Failed/conflicting/timed-out entries can be removed and subsequent groups rebuilt. It avoids requiring the author to update the original PR branch. It does not promise a classifier and retry budget for the same failed CI run. Branch-protection queue patterns cannot use `*`. [Managing merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)

A repository-level queue rule configures merge method, build concurrency, minimum/maximum group size, wait time and status timeout. **Keep “require all queue entries to pass” enabled** under this owner's CI-first floor; disabling it allows only the combined group's head result to establish success. This rule is not offered at organization-ruleset level. Concurrency 1 and group size 1 narrow queue parallelism; they do not implement a Forge post-merge-verification barrier or issue dependency order. [Available queue rules](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) [inferred: policy implications]

Queue entry is not completed merge. “Merge when ready” can latch until requirements pass; CLI queue entry likewise enables auto-merge when checks are pending. Queue removal/reordering is a separate provider operation. Do not treat successful enqueue as successful delivery. [Merging with a queue](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request-with-a-merge-queue)

### Required checks, reviews, and rulesets

GitHub's accepted required-check conclusions include success, skipped and neutral; strict checks additionally require the branch up to date. Conversation-resolution protection enforces resolvable review conversations, without deciding whether a finding is P0/P1/P2 or whether filing a P2 issue sufficiently addresses it. [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) [inferred: severity semantics]

Checks must be current. GitHub may evaluate the test merge commit rather than the PR head when it has a status. A conditionally skipped job can report success; a whole workflow omitted by paths/branches/commit-message filters leaves required checks pending. Checks and commit statuses sharing a required name both need to pass. Eligible event provenance matters: a manually dispatched workflow is not automatically equivalent PR-rule evidence; queues require `merge_group`. [Troubleshooting required checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)

Rulesets aggregate applicable rules, including branch protection, with the restrictive combination enforced. They provide active/disabled enforcement and bypass configuration. An adapter must read the effective policy rather than mistake a single legacy protection response for all rules. [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) [inferred: adapter requirement]

Repository rules can require PR approvals, dismiss stale approvals, require a distinct reviewer for the latest push, and pin a required status context to its producing GitHub App. App/context enforcement is useful for a bot's published completion check, but GitHub does not infer that a particular bot completed its semantic review from arbitrary comments. [Available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) [inferred: producer semantics]

### Auto-merge and exact-head APIs

Native auto-merge waits for required reviews/checks after repository enablement. An unauthorized contributor push or base change can disable it; this is not a revalidation of a local Forge issue lease. **`forge merge --auto` currently means an explicitly enabled, immediately guarded Forge executor, not a GitHub waiting latch.** [Automatically merging a PR](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request) [read: `lib/commands/merge.js:1224-1512`; inferred]

GitHub does provide exact-head primitives. The CLI's `--match-head-commit` pins the request SHA. It also changes behavior on queue-required branches and exposes an administrator bypass; Forge must keep its guard as the entry point. [GitHub CLI merge manual](https://cli.github.com/manual/gh_pr_merge)

The synchronous REST merge endpoint accepts `sha` and returns conflict on mismatch, but does **not** support queue merging. The current asynchronous endpoint supports a SHA plus explicit direct/queue/default action, with bypass defaulting false. Accepted async requests and final `enqueued` results are not merged results; final queue completion must be read from the PR. Omitting SHA uses the request-time head and cancels if it changes before execution. These APIs help preserve exact-head identity, but cannot query a local Kernel lease. [REST PR merge and asynchronous merge](https://docs.github.com/en/rest/pulls/pulls#merge-a-pull-request) [inferred: local authority limitation]

### Reruns and merge-group CI

GitHub supports rerunning all jobs, failed jobs, or an individual job within 30 days; write access is required. Reruns use the original actor's privileges and original SHA/ref, with a maximum of 50 reruns per workflow run. These are execution primitives, not Forge's flaky-failure policy, idempotent per-head marker, or escalation budget. [Rerunning workflows and jobs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs) [inferred: policy distinction]

`merge_group` has its own group SHA and ref, distinct from PR head evidence. Required workflows need that event and appropriate group-aware checkout/classification. [Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#merge_group)

Forge already declares `merge_group` in `.github/workflows/test.yml:23`; its non-PR classifier runs the full matrix (`:47,69-73`). That is partial preparation, **not queue certification**. The targeted search of lint, docs validation, package-size, YAML lint, Greptile and CodeRabbit-trigger workflows did not find an equivalent merge-group declaration; docs validation also reads PR-specific fields (`:94-97`). Their actual required status, provider behavior, and all-event coverage remain unknown without live policy reads and a controlled queue trial. [read; ran: targeted workflow census; inferred]

## 3. Capability coverage map

“Fully covered” applies to the capability stated in the first column, with correct eligible-repository configuration. “Partly” means a native primitive exists but a Forge contract remains. These classifications combine the source evidence above and primary GitHub documentation; deductions are **[inferred]**. They do not assert current live configuration.

| Forge capability | GitHub coverage | What remains / consequence |
| --- | --- | --- |
| Store/report PR lifecycle, check runs and ordinary reviews | **Fully covered** as provider state | Read via the existing provider adapter; avoid another state authority |
| Enforce named required contexts and expected producer App | **Fully covered** as repository enforcement | Requires correct effective rules and non-bypass configuration; Forge still checks evidence locally |
| Strict `SUCCESS` for each protected required check | **Partly** | Native skipped/neutral acceptance differs; preserve Forge strict floor or a success-only aggregate producer |
| Verify latest base plus earlier admitted changes and schedule eligible merges | **Fully covered** by queue's integration mechanism | Queue eligibility/configuration required; issue dependency order and post-merge barriers are separate |
| Exact PR head at provider mutation | **Fully covered** as API primitive | Forge must supply the expected SHA; **exact-head plus owned issue** is only partly covered because issue authority is not native |
| Current issue ownership/session, authoritative PR-to-issue binding, live merge approval | **Not covered** | Keep Kernel broker checks and their immediate pre-mutation recheck |
| Kernel-bound verdict/events, durable delivery/terminal receipts, restart replay | **Not covered** | Queue statuses/webhooks can be inputs; they cannot stand in for accepted Forge evidence |
| Failed-run execution (`rerun --failed`) plus flaky classification/budget/idempotence | **Partly** | GitHub executes reruns; Forge must decide whether, how often and against which observed head |
| Automatically update an otherwise-clean-behind PR / opt-in rebase | **Partly** | Queue verifies a fresh integration branch; it does not perform the same head-branch rebase/update contract |
| Orphan watcher recovery, PID reuse proof, cooperative stop, generation-safe ownership | **Not covered** | Keep while local watchers exist; becomes unnecessary only if that product behavior is removed |
| Unresolved review-thread gate | **Partly** | Native conversation gate is available; Forge enumerates non-outdated unresolved threads and rejects incomplete reads; neither performs semantic resolution |
| CodeRabbit/Codex review completion | **Partly** as provider checks/reviews | Named completion must be produced and required. Current Forge has generic bot/thread/freshness handling and CodeRabbit local preflight, **no dedicated Codex completion floor in the inspected merge path** |
| Actionable bot/direct-comment blockers and local CodeRabbit preflight | **Partly** for remote feedback; **not covered** for local preflight | Retain diagnostic adapter/semantic review handoff; top-level comments are not resolved review threads |
| Settle/idle time, last-comment/approved-by policy, dependency-aware strict serial train | **Not covered** as Forge policy | Queue FIFO/group controls and approvals are useful primitives, not equivalent rules |
| Post-merge CI observation and issue close authorization | **Partly** | Actions supplies execution results; Forge decides whether verified merge evidence authorizes issue lifecycle changes |
| Compact `--pull`, full `--bundle`, cursor-based agent digest and journal replay | **Partly** for underlying remote data | Keep useful bounded projections; GitHub UI notifications do not reproduce these local contracts |

### What the guarded merge actually proves

The existing 1,548-line merge command is not merely a polling implementation. Its sequence is: opted-in nonempty policy → exact-session issue ownership → live PR evidence → authoritative PR/issue binding → rule evaluation → fresh provider reread and rule/binding/ownership reevaluation → `gate.merge` approval and decision packet → SHA-pinned provider mutation → live confirmation → terminal receipt. [read]

| Guard / evidence | Source [read] |
| --- | --- |
| Opt-in and nonempty rules | `lib/commands/merge.js:1224-1246` |
| Exact-session ownership and recheck | `:244-303,1249-1264,1399-1409` |
| PR-to-issue binding and recheck | `:383-463,1314-1328,1383-1396` |
| Exact expected head, lifecycle, draft, readable conflicts | `:749-756` |
| Fully paginated threads and unresolved-thread rejection | `:923-956,757` |
| Well-formed/current active review evidence; reject pending/changes-requested | `:758-781` |
| Safe terminal optional rollup; strict protected required checks | `:617-746,783-795` |
| Fresh reread and reevaluation immediately before mutation | `:1340-1409` |
| Live merge approval and decision packet | `:1412-1457` |
| Provider SHA pin and confirmed readback | `:1113-1124` |
| Terminal receipt after confirmed mutation | `:1482-1512` |

A terminal receipt is **post-mutation proof**, not a pre-merge gate: receipt failure can leave “merged but terminal evidence unavailable.” Conversely, an earlier readiness observation or queue admission cannot grant ongoing ownership. Do not describe configurable `verdict_clean` or any proposed dedicated bot floor as unconditional current behavior. [read; inferred]

### Three mismatches to resolve before cuts

1. **Required-policy completeness.** `lib/adapters/pr-state-adapter.js:216-247` accepts the legacy protection set as authoritative and leaves `lastRequiredSource` null when unavailable. Rollup `isRequired` is diagnostic only (`:226-233`), because a never-produced required context is absent. `merge.js:706-709` requires authoritative protection evidence. The inspected path does not enumerate the effective union of rulesets. A thin adapter must add or explicitly delimit that coverage before calling ruleset-based readiness equivalent. [read; inferred]
2. **Rerun divergence.** `lib/pr-shepherd.js:171-202` reruns any failed required check within its budget after a head recheck; the default budget is three (`:394`). `lib/pr-monitor/auto-actions.js:33,126-147` allows only `CANCELLED`, `TIMED_OUT`, `STALE`, `STARTUP_FAILURE`, rejecting `FAILURE`, `ERROR`, `ACTION_REQUIRED`. The workflow adds per-head markers (`pr-monitor.yml:374-408`). Calling all of these “safe flaky reruns” conceals different policies. Reuse one governed policy with cited CI-failure evidence rather than replace it with unclassified queue resubmissions. [read; inferred]
3. **Bot and skipped-check claims.** CodeRabbit is handled through generic bot/thread/current-head evidence (`pr-pull.js:57-61,827-840,991-1019`), plus local preflight; it has no privileged merge predicate. The case-insensitive Codex census across merge/rules/pull/shepherd/workflow/reference docs found harness attachment references, not a Codex-specific merge rule. The reference document's statement that required `SKIPPED` is not a GitHub pass (`docs/reference/shepherd.md`, requiredChecks payload description) also conflates Forge's stricter floor with native GitHub acceptance. Correct the plan/reference claims; implement a new named bot floor only if separately approved upstream. [read; ran; external: required-check documentation above; inferred]

## 4. Cut, keep, or adapter: evidence, alternatives, and risk

### Recommended default: retain serial guarded delivery; narrow monitoring separately

The strongest case for a queue is reliable integration validation against a moving base without author update churn. That is valuable in an eligible busy repository. Here it is not evidence for deleting issue authority, review diagnostics or 10k lines of monitoring wholesale; current account eligibility/settings are unknown and the owner has already chosen serial delivery. A queue also introduces deferred execution after the local authority check. [external; read; inferred]

| Recommendation | Gross measured candidate | Estimated net lines removed [inferred] | Risk / prerequisite | Alternative rejected; what would change it |
| --- | ---: | ---: | --- | --- |
| **Keep guarded merge and merge rules** | 2,065 | **0** from adoption | High risk if ownership/binding/approval/freshness/confirmation disappears | Replacing it with a native latch is rejected; only a proven authority-aware execution contract could change that |
| **Keep bounded snapshot, diagnostics, shared strict verdict and useful event/receipt projections** | Gather 331, verdict 438, pull 1,467, bundle 189, event/journal/Flow modules as listed | **0 promised** | Missing/check-conflict/torn-read and durable recovery contracts are real; do not cut normalizers/log gathering as “polling” | A tiny `gh pr checks` reader is rejected; a replacement passing the same external behavior/fault cases could permit consolidation |
| **Consolidate duplicate check/review/rerun policy** in existing helpers | Overlapping slices in pull, shepherd, merge rules/command and auto-actions | **100–250 provisional** | Medium: policies currently differ; choose semantics first and preserve strict required checks | Leaving divergent retry engines is rejected; exact diff/caller audit may revise this estimate to zero |
| **Migrate/prune the Beads-backed coordinator** with its plan/ship/package/setup callers | `scripts/pr-coordinator.sh`: **759** | **509–659**, assuming 100–250 lines of retained operations/wiring | Medium/high: preserve dependency order, simulation, labels and stale-worktree operations that remain required; tests/canonical skills are live callers | Blind deletion is rejected. Keeping Beads runtime is inconsistent with D45; if an operation is genuinely still needed, reuse Kernel/native verbs or retain the minimum implementation |
| **Move GitHub transport, labels/summary, and permitted auto-actions to the existing provider boundary**, within the one package | Adapter 796; auto-actions 317; scripts 143; summary 293; workflow 408 | **0 solely from moving** | Medium: maintain CLI compatibility and authoritative policy coverage | A second package/new plugin framework is rejected. Real deletion requires removing duplicated behavior, not renaming directories |
| **Conditionally retire local fleet watching/daemon startup** for 0.1.0; use existing bounded reads and provider events for observation | **4,101**: executor 1,318 + owner 1,414 + reconcile 322 + tick 138 + lease 261 + lifecycle 213 + watch 318 + process identity 117 | **3.8–4.3k**: gross 4,101 + roughly 100–300 removed wiring − roughly 100–400 transition/replacement code | High/explicit product choice: continuous local journal warming, automatic adoption/recovery and prompt-time freshness change. Existing watcher generations need a safe retirement path; preserve accepted history and schema upgrades | Calling these capabilities “covered by GitHub” is rejected. If continuous local monitoring remains required, keep them behind an optional composition and claim **zero** removal |
| **Future optional merge-queue delivery adapter** for eligible repos | No disjoint additional deletion demonstrated | **0 certified incremental saving**; possibly part of update/rebase slices already counted elsewhere | High: all required checks/bots on group SHA, owner authority at execution, queue admission/merge distinction, live verification barriers | Default queue adoption now is rejected. A controlled eligible-repo proof with material measured benefit and explicit owner reversal would change it |

The conditional daemon estimate is approximately **41% of the 10,070-line monitor/shepherd baseline before transition costs**, not the whole baseline. Coordinator plus modest policy consolidation could remove roughly **0.6–0.9k** net lines without adopting queue, subject to retaining caller behavior. If the owner also chooses to retire continuous local watching, the combined disjoint target is roughly **4.4–5.2k** net lines. These are source-sized planning estimates, not a validated diff, byte-size measurement, runtime speedup, or guarantee. [ran; inferred]

Do not count the 1,523-line Flow bridge wholesale as removable daemon code: its durable evidence, batch recovery and terminal receipt behavior is also reached from bounded passes. Do not count the 5,956-line SQLite driver, old migrations, whole push/ship/hook files, or safety tests as savings. Existing tests may move or change only when their behavior is retired or equivalently verified, not to obtain a lower line count. [read; inferred]

### Does this reopen the owner's no-queue decision?

**No for the recommended 0.1.0 plan.** Bounded monitoring, coordinator migration and policy consolidation are independent of the strict serial train. They do not authorize enqueue, native auto-merge, ownership transfer, direct provider merge, or fewer gates. [inferred; read: assigned constraints]

**Yes if queue adoption is selected later, even with concurrency/group size 1.** The execution model changes from immediate live-owned guarded delivery to admission followed by server-side merge. A queue can test a synthetic group while bot review and Kernel binding refer to an original head. GitHub has exact-head request primitives, but the Kernel lease can expire/reassign while waiting; a past success check is not a current local lease. CI for an integration group must not falsely claim that every issue's live ownership was rechecked at the actual merge. A local SQLite Kernel cannot simply be assumed readable by hosted Actions. [read; external; inferred]

What would justify revisiting it: confirmed eligible Organization ownership (or a separately chosen transfer); repeated measured base-update/serial waiting cost; all effective required checks and review producers certified for the queue's event/head identities; preserved strict-success floor and explicit dependency/post-merge barriers; demonstrated fail-closed authority changes while queued; and owner approval of the new execution semantics. A repository transfer is a distinct decision, not a mechanical step authorized by this research. [inferred]

### Acceptance evidence required before any implementation cut

1. Pin a fresh tracked default ref and, through the permitted account route, enumerate **all** effective rules/check names/App identities, review settings, bypass actors, repository owner type, auto-merge and queue settings. An unreadable policy remains incomplete. [inferred]
2. Preserve regressions for changed head/base, missing/duplicate/wrong-App checks, skipped required check, torn/truncated reads, stale or unfinished bot review, unresolved threads, mismatched PR/issue, expired/reassigned ownership, missing merge approval and provider failure. Use current CLI/temp-repo/fault-injection coverage; do not retain only source-shape tests. [read: existing guard tests; inferred]
3. For watcher retirement, prove one safe transition for starting/running/stop-requested/terminal-pending generations, PID reuse, migration conflict and restart. Retain existing accepted receipts/journals and database upgrade safety. No unconditional PID kill or receipt-as-ongoing-lease shortcut. [read: owner/reconcile tests and source; inferred]
4. For any queue pilot, prove group event execution, actual artifact coverage, required bot completion at appropriate identity, queue removal/rebuild, authority change while waiting, confirmed merge commit, and post-merge CI before the next serial admission/issue closure. Do not disable “all entries pass,” weaken strict success, or add a bypass to make the pilot green. [external; inferred]
5. Recount the exact proposed diff and package artifacts; distinguish moved code, deleted code, changed behavior and changed test coverage. The estimates here are not a substitute for that evidence. [inferred]

## Bottom line — decision recap

1. Keep strict serial CI-first delivery and the `forge merge --auto` entry point for 0.1.0. [inferred]
2. GitHub queue is an organization-repository feature; verify actual ownership before planning adoption. [external; inferred]
3. The measured monitor/shepherd surface is 10,070 lines, not an automatically removable 9.9k. [ran]
4. Required checks/reviews/rulesets can carry native repository enforcement without queue. [external]
5. Keep Forge's strict protected-check floor and head/issue/ownership/approval binding. [read; inferred]
6. Preserve accepted monitor/terminal evidence; a queue entry or old receipt is not continuing authority. [read; inferred]
7. Unify retry policy and state bot-completion behavior honestly before pruning. [read; inferred]
8. Migrate the live 759-line Beads-backed coordinator consumers before deletion. [read; ran; inferred]
9. A 3.8–4.3k daemon reduction requires an explicit choice to retire continuous local watching. [inferred]
10. Moving provider code is a boundary improvement with zero intrinsic line saving; defer queue adoption pending proof. [inferred]

## Recommended plan changes

1. **Correct P5's baseline and savings language:** use 10,070 monitor/shepherd lines, 2,065 guarded merge/rule lines separately, and label the 4.4–5.2k total reduction target conditional. Do not put “replace 9.9k with GitHub merge queue” on the release critical path. [ran; inferred]
2. **Keep the existing merge authority seam:** exact expected head, exact-session Kernel ownership, authoritative PR/issue binding, fresh reread/rerule/rebinding/reownership, live approval, provider confirmation and terminal receipts. Record post-mutation receipt failure distinctly. [read; inferred]
3. **Define the 0.1.0 monitor contract:** bounded pull/bundle/event observations plus durable accepted evidence by default; explicitly decide whether continuous local watching is required. If retained, optional composition stays inside the one package and has no deletion credit. [inferred]
4. **Add a focused policy-consolidation work item:** reconcile retry behavior using the infrastructure-only floor and cited CI evidence; unify required-check/review normalization without relaxing current merge guards. Correct the reference's native skipped-check claim. [read; inferred]
5. **Add a D45-compatible coordinator migration/prune item:** inventory each skill operation, reuse available Kernel/native commands, update canonical plan/ship/setup/package consumers, and preserve the operations still used by the serial train. Do not equate dropping duplicate `forge pr` forms with deleting this separate script. [read; inferred]
6. **Put GitHub-specific operations at the existing adapter boundary:** transport, effective policy enumeration, bot result normalization, summary/label projection and provider mutation. Keep pure authority/policy evaluation and accepted evidence in Forge; avoid a new adapter framework or extra package for this one provider. [read; inferred]
7. **Make queue adoption an optional later experiment:** owner eligibility and settings, group-aware check/bot certification, authority-at-execution proof, configured strictness and measured throughput benefit are entry criteria. Enqueue and confirmed merge must be separate result states. [external; inferred]
8. **Correct completion-gate descriptions:** generic current-head bot/thread handling is present; dedicated Codex completion is not implemented in the inspected merge path. A separately approved named check must have an explicit producer, head/App binding and failure behavior before it becomes a claimed gate. [read; ran; inferred]

These are recommendations in the P9 artifact only. No Kernel work item was created because this leg explicitly forbids Kernel mutation. [read: task boundary; ran]

## Open questions for the owner

### Delivery mode

- **A — Keep strict serial guarded delivery for 0.1.0; queue remains a later optional experiment. Recommended default.** Preserves the earlier decision and current authority semantics; no eligibility assumption.
- **B — Authorize a future queue pilot in a verified eligible organization repository.** Explicitly reopens deferred-execution semantics; requires all acceptance evidence above before production adoption.
- **C — Adopt queue as the default now.** Not recommended: owner eligibility/settings and authority/check/bot equivalence are unverified.

**Default: A.** Evidence favors native repository gates now, not a new merge scheduler. Switch to B when eligibility, live authority proof and material measured serial cost justify it. [inferred]

### Monitoring behavior and the large cut

- **A — Prefer bounded monitoring/provider observations for 0.1.0 and plan safe retirement of automatic local fleet watchers. Recommended default.** Makes the conditional 3.8–4.3k reduction actionable while retaining useful diagnostics and accepted evidence.
- **B — Retain continuous local watchers as an optional composition in the same package.** Preserves async local journaling/adoption/recovery; moving code yields zero source/package deletion credit.
- **C — Retain continuous local watching as the default.** Keeps present behavior and its lifecycle burden; only coordinator/policy reductions are targeted.

**Default: A for the proposed plan, not authorization to remove running watchers or code now.** Switch to B/C if continuous local freshness is a release requirement that provider events and bounded reads do not meet. [inferred]

### Autonomous rerun policy

- **A — One shared bounded infrastructure-only policy, with cited CI evidence and head binding. Recommended default.** Reject ordinary deterministic failures; retain escalation and governed quarantine rules.
- **B — Keep budget-only retries of any failed required check.** Mirrors the current bounded engine's broad behavior but risks concealing deterministic failures and conflicts with the stricter workflow policy.
- **C — Require an explicit human/agent diagnosis before every rerun.** Strongest intervention control; more manual latency, useful if infrastructure conclusions prove too coarse.

**Default: A.** Choose C if evidence shows the conclusion allowlist misclassifies real failures. B is not justified merely because a rerun turns a check green. No option weakens the required-check gate. [read; inferred]

For this options report, labels select the stated choice within each question; a combined reply should name the question where labels differ. Silence retains the defaults **for planning**, while the existing strict serial merge decision continues to bind execution.

## Confidence

**Overall: medium.** **High** for pinned-ref physical counts, direct callers, named coverage, documented GitHub availability/primitives, and source-visible guard/retry differences. **Medium** for adapter boundaries and retained-capability mapping because no live protection/bot configuration was readable. **Low–medium** for deletion estimates: they are conditional source-size arithmetic, not an implemented and tested replacement.

Known limits: live default-ref freshness, owner account type, plan, effective rule/check/App/bypass inventory, review producers, and queue settings were not verified; product tests and a live queue trial were not run. There is no demonstrated reliability, performance or package-size improvement yet. The report preserves the earlier strict serial choice and identifies precisely which evidence would justify changing it.
