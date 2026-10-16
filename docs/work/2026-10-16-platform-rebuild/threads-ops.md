# Thread history lane: ops (PR monitoring/shepherd, merge trains, CI and test reliability, status/memory loops, upgrade safety)

Read-only extraction from T3 Code threads in project forge. Citation format: `[T<n> #pos]` = thread number below and message position. Rung: every claim here is `read` (thread message) unless marked `inferred`.

## Coverage (what was read)

| # | Thread | Id | Items | Dates | Coverage |
|---|---|---|---|---|---|
| T1 | Validate PR Monitor Owner Phases | 70499c65-b9bd-4ea8-8891-05909e42ccf5 | 279 | 2026-08-21 to 09-09 | all 3 pages; assistant items read to ~450 chars, key items in full |
| T2 | Merge Shepherd PR Train | f3a1bc09-9112-4833-89fa-31e9cb9cf06c | 245 | 2026-08-26 to 08-27 | all 3 pages; assistant items to ~400 chars, key items in full (to 2,500) |
| T3 | Bun Upgrade Test Reliability | 291e2a5f-cc2a-4a5c-93bb-b8d943aa62eb | 121 | 2026-08-21 to 08-22 | both pages |
| T4 | Current status check | 465ef7d1-e1f3-47a2-b510-737b9ca71ae7 | 104 | 2026-05-30 to 06-01 | both pages |
| T5 | Planning and memory loop | 6c092cf7-3b0b-44dd-a75a-515b5c7a0e84 | 63 | 2026-05-16 | full |
| T6 | Upgrade safety foundation | 595298f8-af02-49bf-8bbb-85671cd1d684 | 55 | 2026-05-16 | full (task brief text past 1,500 chars not read) |
| T7 | Review PR 2004 (really PR #200) | 25c52548-ed53-4b49-8b37-322b02f35b7f | 48 | 2026-06-03 | full |
| T8 | Fix Claims CI Across Bun Versions | e0e38662-bd64-4c2d-8262-45ad131c7dd2 | 40 | 2026-08-21 | full |
| T9 | Forge Work Status Overview | 0cece761-60fa-4893-bc1d-d7a01c7fcc19 | 10 | 2026-09-08 | full |
| T10a-d | PR 538 restarts: 39454eb3, dd663316, ae14b1d6, aa46e23d | — | 1 each | 2026-08-21 09:44-09:52 | full (each is one user message, no agent reply) |
| T11 | import:codex:01a0dd66 (lead: registry Bun-install fix, PR #577) | — | 42 | 2026-09-26 | full; injected global-instructions message and task brief past 2,000 chars not read |
| T12 | import:codex:01a0dd77 (implementer worker) | — | 22 | 2026-09-26 | full, same caveat |
| T13 | import:codex:01a0dd6b-5413 (packaging inspector) | — | 9 | 2026-09-26 | full, same caveat |
| T14 | import:codex:01a0dda4 (spec reviewer) | — | 13 | 2026-09-26 | full, same caveat |
| T15 | import:codex:01a0dda9 (quality reviewer) | — | 13 | 2026-09-26 | full, same caveat |
| T16 | import:codex:01a0dddc (CI diagnoser) | — | 7 | 2026-09-26 | full, same caveat |
| T17 | import:codex:01a0dd6b-c009 (release-smoke inspector) | — | 5 | 2026-09-26 | full, same caveat |

No secrets were found in the parts read.

---

## Per-thread findings

### T1 — Validate PR Monitor Owner Phases (Claude Fable lead; #540 → #541 → #542, 2026-08-21 to 09-09)

**What happened.** The owner handed over #540 (dormant watch-owner authority foundation) with 59/60 threads resolved and one open thread about rejecting "impossible phases" [T1 #0]. The agent wrote a table-driven validator over every `watchOwner*` operation and found a real bug in the partial code (recovery ops pin the dead generation, but the driver mints a fresh one) [T1 #14, #45]. After that it went through ~28 fix commits driven by a review bot (`chatgpt-codex-connector` plus CodeRabbit) that posted 1–3 new P2s on every push [T1 #92–#207, #194]. #538 merged first (another session). #540 and #541 were merged by others on Aug 26 while this thread was idle. On Sep 8 the agent found ~249 lines of local hardening "never landed" [T1 #246], then found master already had it [T1 #248]. #542 merged Sep 8 [T1 #264]. Ended with verify plus a filed Windows flake [T1 #278].

**Worked.**
- RED-first on the real driver's postconditions caught a real defect before it shipped [T1 #14, #51].
- Lease conflict as coordination: claiming #546 returned `claim_conflict` against another session's actor, and the agent kept off it [T1 #276].
- Verify recorded real post-merge CI and filed the remaining flake with evidence [T1 #278].

**Didn't work.**
- Unbounded review loop: each fix triggered a full CI matrix (Windows lanes 12–17 min) and another bot round. The agent made up a termination rule only after the owner complained [T1 #193–#194, #221].
- Claim replay defect: re-claiming with the same actor after release or expiry replays the dead `claim.create` event, so the actor is burned for good. The agent had to use `-root-2`, then `-root-3` [T1 #7–#11, #216].
- Shepherd's Tier-A rerun passed the check *name* to `gh run rerun` and got a 404 [T1 #135]. The shepherd verdict drifted from its own evidence (BLOCKED-THREADS with 0 threads) [T1 #208].
- The pre-push hook ran the full local suite for 4.6 h on Windows and the ref still did not land. `forge push --quick -- --force-with-lease` put the flag after `--` [T1 #234–#239].
- Repeated test-file corruption from regex and index edits (describe nesting, doubled braces) [T1 #106–#107, #118, #120, #124, #131, #147, #167, #171, #183].
- No view of parallel sessions: hours of hardening duplicated work that another session had already landed [T1 #246–#248].
- The agent deleted tracked `.forge/` files with `Remove-Item`, then restored them [T1 #249].
- Subagent dispatch returned `Task cancelled` twice [T1 #274].

**Owner corrections.**
- "Why are you not using Shepherd instead of GitHub PR checks?" [T1 #160]
- "this has been running forever, what's the merge order we are following and how are we going to merge" [T1 #193]
- "what are you stuck on" ×2, "what's taking so much time" [T1 #214–#218]
- "GitHub Actions usage has been over" → "This is an open source repo so I don't think we should be facing any issues" — the agent had wrongly claimed a quota limit [T1 #219–#227]
- "how is it that the whole suite is working locally but failing in GitHub?" — the agent admitted it had run focused suites only [T1 #222–#223]
- "why are you not replying?" [T1 #273]

### T2 — Merge Shepherd PR Train (Claude Fable lead; 2026-08-26 to 08-27)

**What happened.** Bottom-up merge of #540 then #541, followed by stability PRs #546/#547/#548 and a detour into the 0.0.1/0.1.0 release shape. #540 merged as a squash (the merge-commit script did not run on the owner's side) [T2 #59, #128]. #541 merged [T2 #155]. #547 and #548 merged after 1–2 review rounds each [T2 #229, #235]. #546 went 7 rounds and was reframed at the end [T2 #239–#244].

**Worked.**
- Real root cause instead of "flake": the Windows targeted lane's fallback ran raw `bun test test/` as one process with no lanes, so the #545 worker-budget fix never reached it. The spawn died at 5 ms, not at a timeout [T2 #4].
- A measured CI audit: a clean run is ~7 min. The 27 min the owner saw was one Windows flake + 12 min idle + a rerun. 59 % of files are in the "subprocess" lane only because they `spawnSync` the CLI [T2 #51].
- Real numbers in code: the 600 s budget was caught below the measured 602 s run, then raised with the measurement recorded in code [T2 #164, #170].
- Exact-head verification plus a settle window after green, so a late bot round can't slip in between "green" and "mergeable" [T2 #200–#201, #226].
- The final reframe: "A local pre-commit hook cannot be a security boundary against its own operator." Put the boundary in CI on the PR diff and keep the hook as a convenience [T2 #244].

**Didn't work.**
- The protected-state hook blocks every `.github/workflows/**` edit, so twice the agent handed the owner a `-c core.hooksPath=/dev/null commit` command. The human became the bypass mechanism [T2 #4, #59].
- #546 ("sometimes allow a protected write") had 7 rounds, each a real hole (any merge side trusted, writable `refs/remotes`, mode-only change, `GIT_LITERAL_PATHSPECS`, deletion, fork upstream), and ended with a Sonar C maintainability rating [T2 #173–#239].
- The agent said "mergeable" before the late review round landed → "546 is unable to merge" [T2 #208, #216–#221].
- The monitor re-reported the same state every 90 s [T2 #212].
- Dogfooding shepherd alongside pre-push starved a spawn, and shepherd `--pull` served a stale BLOCKED-THREADS again [T2 #110–#114].
- The agent claimed npm "0.0.1 is burned forever" without checking [T2 #136, #150–#152].

**Owner corrections.**
- "how can we reduce the CI time… a lot of tests can be merged or parallelised… we did a PR on this already but didn't fix it properly" [T2 #48]
- The owner pasted back the agent's own loop caveat: "check on this" [T2 #100–#103]
- "use shepherd, you can dogfood it" [T2 #109]
- "update the pr description" / "the old and new description is confusing" [T2 #120, #123]
- Packaging corrected three times: "only 2, memory and flow" → "only one package but can be downloaded as parts" [T2 #141, #144]
- "previously I worked out a way to use 0.0.1 after deleting old versions, check" [T2 #147]
- "fix the 0.1.0 blockers and stability issues first" [T2 #157]
- "think on this" (after choosing A) [T2 #242]

### T3 — Bun Upgrade Test Reliability (opencode ox-alpha; resumed #538, 2026-08-21 to 08-22)

**What happened.** The agent recovered the dead session T8. Finding it meant archaeology: mapping the T3 id to an opencode session, reading its transcript, and finding an unpushed commit [T3 #2–#11]. It then finished #538 through two review rounds and a hosted-runner flake. The owner merged it [T3 #117–#120].

**Worked.**
- The agent replaced a brittle probe that scraped child console output (Bun prints test names differently per environment) with an assertion on the JUnit receipt artifact [T3 #49].
- It disproved a bot P1 using Microsoft's primary docs [T3 #63].
- It diagnosed a flake by duration trend: 3.7 s to 30 s on the same test in 2.5 h [T3 #84].

**Didn't work.**
- Toolchain drift: the npm shim served Bun 1.4.0, nested `bun` resolved from PATH, and a pinned 1.3.12 had to be recovered from a temp folder [T3 #16–#18].
- `review-resolve.sh` repo detection broke on CRLF, and PowerShell 5.1 `ConvertTo-Json` wrapped reply bodies, so replies failed silently [T3 #13, #53–#57].
- The shepherd daemon never classified or reran the flake, and the agent misread positional output [T3 #85–#88].
- Shepherd verdict drift was found and filed as `1694b724` [T3 #111–#116].

**Owner corrections.**
- "still not merge ready" [T3 #94]
- "why are you using gh pr and not shepherd, literally we are the ones who built it, how are you not using it working on the project itself" [T3 #95]
- "you didn't answer why" [T3 #98]
- "what is it that we didn't implement properly, how to fix that issue" [T3 #100]
- "we have a session working on this, tell me the issue, I will share it with that one" / "and you concentrate on your thing" — the owner is the message bus between sessions [T3 #102–#104]
- "I have asked what was the issue for it not working properly" [T3 #112]

### T4 — Current status check (codex gpt-5.5; Beads era, 2026-05-30 to 06-01)

**What happened.** Status questions, then fixing Dependabot PRs #189, #193 and #194, all merged.
- `forge sync` failed with Beads/Dolt `Error 1105: no remote` [T4 #2]. Running status dirtied `.beads/.local_version` [T4 #4, #17]. `bd list --json` returned malformed data [T4 #20]. Team workload and dashboard commands timed out [T4 #4].
- The gh-aw sync-check took three iterations to find its real source of truth (source lock, then compiler pin, then full recompile) [T4 #39–#56]. A generated-artifact pipeline with several sources of truth.
- The agent committed "with hooks skipped" [T4 #77]. A Dolt SQL server process locked a temp worktree's cleanup [T4 #87–#88].
- Every turn used the same rigid "Actions taken / Files / Knowledge source labels / Key findings" template (ceremony).

**Owner.** "fix the issue properly" [T4 #35]; "193 and 194 still pending" [T4 #64].

### T5 — Planning and memory loop (codex; 0.0.17 PR #164, 2026-05-16)

**What happened.** One autonomous brief ran /plan → /dev → /validate → /ship → /review in about 2.3 h and left #164 merge-ready [T5 #0, #51].

**Worked.**
- A live-shape probe found that `bd memories --json` returns an object map, not the array in the fixture. The adapter had been written to the fixture's shape [T5 #17].

**Didn't work.**
- Beads state was mutated by probes, by the commit hook (the commit picked up an `issues.jsonl` deletion) and by the push hook. The agent then pushed "with hooks disabled because the hook is mutating out-of-scope Beads files" [T5 #12, #19, #21, #42].
- The full local suite was unrunnable: broad-suite instability, missing package deps, past the 3-min tool limit [T5 #14, #41].
- Generated per-agent command copies drifted and broke CI [T5 #25].

**Owner.** "there are unresolved comments in the PR" → API showed 13/13 resolved, so what the owner sees and what the API reports differ [T5 #55–#62].

### T6 — Upgrade safety foundation (codex; 0.0.16 PR #165, 2026-05-16)

**What happened.** forge.lock + audit log + `--allow-untrusted` landed first, then upgrade dry-run + self-heal, in dependency order, test first, one commit per slice [T6 #6–#13].

**Worked.**
- Self-heal was kept narrow and honest: it only scaffolds missing `.forge/` metadata and refuses integrity failures [T6 #10, #45].
- The cross-OS matrix caught a macOS `/var` vs `/private/var` realpath bug that local Windows runs could not [T6 #42].

**Didn't work.**
- New lib paths had no mapping, so validation fell to the full suite and failed on unrelated lanes [T6 #16–#19, #37].
- Tests rewrote the worktree's git author to `Test User`, a test-isolation leak into real config [T6 #29].
- The hand-rolled flag parser misread `--name` and kebab-case `dry-run` across two review rounds [T6 #33, #48].

No owner corrections beyond "continue".

### T7 — Review PR 2004 → PR #200 (codex; 2026-06-03, ~9 h for 3 threads)

**What happened.** The owner dictated "pr 2004" and then said "I meant pr 200" [T7 #5]. The review threads were about **issue state committed as a JSONL file**: a stale `dependency_count` [T7 #9–#11].
- The protected-state hook blocked the direct edit, so the agent used `bd dep remove`. That left an edge behind [T7 #17], ran against the wrong checkout [T7 #18], and called an unsupported `bd audit record --meta-json` [T7 #22].
- The export reset unrelated `comment_count` values to 0, which the agent restored by hand [T7 #32–#36]. Generated state with a lossy round-trip.
- The pre-push hook hung in `scripts/test.js` and team-sync, and the agent pushed with `--no-verify` twice [T7 #29, #37]. AGENTS.md forbids this.

**Owner.** "we shipped pr 200, review that and fix" [T7 #19]; "review the pr" [T7 #24].

### T8 — Fix Claims CI Across Bun Versions (opencode; 2026-08-21, died)

**What happened.** A long, precise owner-written handoff (exact head, issue, threads, constraints) [T8 #1]. The agent proved the lease and pulled the shepherd verdict first, which surfaced a second thread the handoff did not know about [T8 #2–#5]. It validated the reviewer's finding against the workflow before changing anything [T8 #8–#9]. Then it spent 20+ min on why Bun prints test names locally vs in CI, with two Bun installs on PATH and the machine switching to 1.4 mid-session [T8 #22–#34]. The session died with commit `24426da7` unpushed.

**Owner.** "also new bun version is now 1.4" [T8 #26]; "Use multiple agents… do extensive research… get this working properly" [T8 #35]; "we have created subfolders to test 1.4, keep that in mind" [T8 #37]; "what's the update" [T8 #38]; "this chat is stuck and not working" [T8 #39].

### T9 — Forge Work Status Overview (opencode muse; 2026-09-08)

The Kernel's own numbers [T9 #1]:

| Measure | Value |
|---|---|
| Tracked issues | **1,431** |
| Open | 685 |
| In progress | 16, **zero owners** |
| Ready / blocked | 522 / 96 |
| Stale | 679 |
| "Lint" (missing required content) | 882 |
| `active_claims` reported | 199, but only **1 of 53** lease records unexpired |
| Registered worktrees | 138 |

9 of the 16 in-progress items are shepherd, merge-flow or release machinery [T9 #1].

`forge shepherd <pr> --pull` timed out at >120 s, so the agent called three PRs "green — ready" from raw check state [T9 #3]. The owner said "check properly if they are exactly merge ready", and only 1 of 3 was (#550 had 4 unresolved threads, #542 was BEHIND) [T9 #4–#5]. Verify worked. The agent refused to force-delete a worktree that contained nested live worktrees [T9 #9]. The report shape (Decisions needed + A/B/C + rung labels) worked well.

### T10a–d — four PR 538 restarts (2026-08-21 09:44–09:52)

Each thread is a single owner message re-pasting the same ~3 KB handoff ("continue this session, which was stuck…"), with no agent reply. The owner restarted the same work four times in 8 minutes across providers (opencode ox-alpha, x-preview) before T8 at 10:28. Session continuity existed only as owner-authored prompts.

### T11–T17 — Codex Sol fan-out for the Bun registry-install bug (PR #577, 2026-09-26)

**What happened.** `forge-workflow@0.1.0-beta.8` could not be installed with Bun from the registry. `npm publish` folds `bundledDependencies` into `dependencies` as `"@forge/flow": "*"` and similar, and Bun then tries to resolve the unpublished scope and gets a 404. PR #575's Bun smoke had passed only because it installed the **local** tarball [T11 #1]. The lead fanned out to an inspector, an implementer, a spec reviewer, a quality reviewer, a CI diagnoser and a release-smoke inspector (T12–T17).

**Worked.**
- A precise owner brief that already stated the verified cause [T11 #1]. The inspector mapped the 12 import sites and the smallest mechanism [T13 #5]. Private `#forge/*` imports plus prepack vendoring [T12 #9]. A smoke shaped like the registry: the same tarball installed by npm and by Bun [T11 #13].
- The quality reviewer FAILed what the spec reviewer had PASSed: "smoke bought green with larger deadlines (120 s/60 s/360 s)", unmapped test routing, and a partial vendor tree left behind on prepack failure [T14 #6 vs T15 #5]. Two independent axes earned their keep.
- The CI diagnoser proved the failing fixture packed with `--ignore-scripts`, which suppressed prepack. The fix was one line [T16 #5–#6].
- The TDD hook rejected structural-only test naming, and the agent added real tests instead of bypassing [T11 #11].

**Didn't work.**
- A session-only `FORGE_ACTOR` env var leaked into tests that assert the default context [T11 #25].
- The `gh` identity was not a collaborator [T11 #27].
- Reviewer and implementer packed concurrently in the shared worktree, a vendor-dir race [T14 #12, T13 #8].
- Every worker received the full global instructions as an injected user message, a large fixed prompt cost per worker [T12–T17 #1] (`inferred` from the repeated message).
- The Windows host stopped launching any process (`0xC0000142`), leaving #577 not merge-ready with the fix uncommitted [T11 #39–#41].

---

## Combined analysis

### 1. What worked (keep)

- **Exact-head, evidence-first merge readiness.** Merge readiness meant: exact head SHA + required checks terminal + paginated threads at 0 + mergeable + a settle window, all read in one pass [T2 #200–#226, T9 #5]. When agents skipped any one part they were wrong [T2 #216, T9 #3–#5].
- **Lease/claim as cross-session coordination.** `claim_conflict` stopped two agents working one issue [T1 #276]. Proving the lease before mutating was cheap and caught state the handoff missed [T8 #2–#5].
- **Measured root causes over "flake".** The 5 ms spawn death [T2 #4], duration trends [T3 #84], measured CI breakdown [T2 #51], measured budget in code [T2 #170].
- **Contracts over scraped output.** JUnit receipt instead of console text [T3 #49]; real `bd` JSON shape instead of the fixture [T5 #17]; registry-normalized manifest instead of the local tarball [T11 #1].
- **Testing the shipped artifact.** Registry-shaped same-tarball npm+Bun smoke [T11 #13], real pack lifecycle in fixtures [T16 #6], the cross-OS matrix catching macOS realpath [T6 #42].
- **Independent spec and quality review axes** on a fan-out, and multi-model review when the owner asked [T14/T15; T1 #62–#80].
- **Narrow, honest self-heal** that refuses integrity failures [T6 #10].
- **Decision-report shape.** Decisions needed + labeled options + a default + rung labels [T9 #1–#9, T2 #53].

### 2. What didn't work (root causes)

| Failure | Evidence | Root cause |
|---|---|---|
| Unbounded bot-review loops (28 commits on #540; 7 rounds on #546) | T1 #92–#207, #194; T2 #173–#239 | No termination contract for review; every push = full matrix + new bot round; "sometimes allow" predicate shape |
| Shepherd verdict contradicting its evidence | T1 #208; T2 #111; T3 #111–#116 | Persisted verdict label served instead of recomputing from one gather |
| Shepherd too slow or broken, so agents fell back to `gh` | T9 #3 (>120 s); T1 #135 (rerun by name) | Monitor had more machinery than reliability; the fallback was easier than the product |
| Local gates longer than the agent's patience (4.6 h pre-push, 10-min validate, hangs) | T1 #234–#239; T7 #25–#29; T5 #41; T11 #20–#22 | Full suite on push on Windows; unmapped paths fall to full suite; subprocess-heavy tests |
| Hooks that mutate state or block legitimate work cause bypasses | T5 #21; T7 #29, #37; T4 #77; T2 #4, #59 | Hooks write Beads state; protected-state blocks merges; the only escape is `--no-verify` or the owner |
| Windows-specific flake and toolchain drift | T1 #129, #224; T3 #16–#18; T8 #24–#28; T11 #39 | Spawn-heavy tests on 4-vCPU runners; no enforced toolchain pin; PATH shims |
| Issue state as committed JSONL with lossy export | T7 #9–#36; T4 #17; T5 #19 | Generated state in git, reviewed by bots, edited by hand |
| No session continuity or visibility | T10a–d; T3 #2–#11; T1 #246–#248; T3 #102 | Handoffs live in owner prompts; no durable run record; parallel sessions invisible to each other |
| Wrong facts asserted (Actions quota, npm "burned forever", "3 green = ready") | T1 #219–#227; T2 #136/#152; T9 #3–#5 | Claims made below the evidence rung |

### 3. Built but not used (or bypassed)

- **Shepherd daemon/Tier-A.** It did not classify or rerun the flake [T3 #85–#88], rerun by name 404'd [T1 #135], `--pull` timed out [T9 #3], and agents hand-polled `gh` until the owner objected [T1 #160, T3 #95].
- **`review-resolve.sh`.** Broken by CRLF and PowerShell quoting; agents went to raw GraphQL [T3 #13, T1 #16–#17, T1 #164].
- **Protected-state hook.** Bypassed via the owner's `core.hooksPath=/dev/null` [T2 #4, #59] and via the `FORGE_PROTECTED_STATE_ALLOWED_SURFACES` escape [T7 #23]. The merge-awareness PR was closed as the wrong shape [T2 #239–#244].
- **Pre-push full suite.** Bypassed with `--no-verify` [T7 #29, #37], hooks disabled [T5 #21], `--quick` as routine [T11 #26, T1 #258].
- **"Nothing discussed goes missing" tracking.** 1,431 issues, 679 stale, 882 failing "lint", 16 in-progress items with no owner, 199 "active" claims of which 1 is live [T9 #1]. The tracker is write-mostly; nobody reads that backlog.
- **Rigid per-turn report templates** (Actions taken / Knowledge source labels) [T4, T7 #47].
- **Stage-exit kernel comments.** Recorded dutifully [T1 #88, #264] but never used for resumption. Every resume was rebuilt from git, the transcript or an owner prompt [T3 #2–#11, T10a–d] (`inferred`: no read of them during resume appears in any thread).

### 4. Useful but couldn't be used

- **Shepherd's verdict surface.** The right idea (agents read verdicts, not raw checks), but slow, sometimes stale and hard to trust, so it lost to `gh` [T9 #3, T3 #111].
- **Tier-B `--auto-rebase`.** The right publish path for a rebased branch, found only after the agent was stuck on the 4.6 h pre-push [T1 #239, #258].
- **Guarded merge (`forge merge --auto`) and auto-merge config.** Existed, but in practice the merge stayed with the owner through hooks and scripts that broke on WSL paths [T2 #53, #128]. In Product-Suite it required a kernel PR-to-issue binding that raw `gh pr create` never set (seen in a foreign thread read by mistake; not this lane's evidence).
- **Audited writer for protected files.** Covered only `npm-publish.yml`, so `test.yml` edits always needed the owner [T2 #160, #206].
- **Affected-test routing.** Valuable, but new paths silently fell to the full suite until someone mapped them [T6 #16–#19, T15 #5].

### 5. Agent-era lens

**Compensating scaffolding (drop or make optional):**
- Mandatory stage ladder in one brief [T5, T6], where the real value was tests + review.
- Per-turn report templates [T4, T7].
- Hooks that block a capable agent from legitimate edits and so teach bypass [T2 #4, T7 #29].
- Rerun-until-green Tier-A [T3 #85–#88].
- "File everything immediately" tracking that buries signal [T9 #1].
- Lease ceremony repeated per poll, plus burned actor ids [T1 #216].

**Stays valuable:**
- Exact-head merge-readiness contract.
- One authority for claims, giving conflict detection across sessions [T1 #276].
- Evidence rungs and verify-after-merge [T9 #9, T1 #278].
- Artifact-level tests of what ships [T11].
- CI as the enforcement boundary rather than local hooks [T2 #244].
- Cost and time budgets measured and recorded in code [T2 #170].
- Independent review axes [T14/T15].
- Discoverable, fast status [T9].

### 6. Owner corrections (strongest signal, consolidated)

1. **Use what we built, or fix it.** "why are you using gh pr and not shepherd, literally we are the ones who built it" [T3 #95]; "Why are you not using Shepherd" [T1 #160]; "use shepherd, you can dogfood it" [T2 #109].
2. **Time and visibility.** "running forever" [T1 #193]; "what are you stuck on" ×2 [T1 #214–#215]; "what's taking so much time" [T1 #218]; "this chat is stuck" [T8 #39]; "why are you not replying" [T1 #273]; "what's the update" ×6+ [T1 #267, #272; T2 #79, #98, #113; T3 #30; T8 #38].
3. **Answer the question asked.** "you didn't answer why" [T3 #98]; "I have asked what was the issue" [T3 #112].
4. **Check properly.** "check properly if they are exactly merge ready" [T9 #4]; "still not merge ready" [T3 #94]; "546 is unable to merge" [T2 #216]; "there are unresolved comments in the PR" [T5 #55]; "how is it working locally but failing in GitHub" [T1 #222].
5. **Don't invent constraints.** Public repo, so Actions are free [T1 #225, and Product-Suite]; "I worked out a way to use 0.0.1, check" [T2 #147].
6. **CI is too slow and the earlier fix didn't fix it** [T2 #48].
7. **Fix it properly, don't get stuck.** "fix the issue properly" [T4 #35]; "do extensive research… get this working properly" [T8 #35]; "think on this" [T2 #242].
8. **One product, parts installable** (packaging corrected three times) [T2 #139–#144].
9. **The owner as relay between sessions.** "we have a session working on this, tell me the issue, I will share it" [T3 #102]; four re-pasted handoffs in 8 min [T10a–d].

---

## Top 10 lessons for the rebuild

1. **Merge readiness is one computed verdict from one live gather, never a stored label.** Shepherd's persisted BLOCKED-THREADS contradicted its own evidence three times, and agents stopped trusting it [T1 #208, T2 #111, T3 #116]. → **Design rule:** a readiness block returns `{verdict, evidence, head_sha, gathered_at}`. Invariant test: `verdict == compute(evidence)` on every read. A stale read fails closed, and the block is fast enough (<10 s) that agents prefer it to `gh` [T9 #3]. **Keep** the exact-head + checks + paginated threads + settle-window contract.

2. **Review loops need a termination contract, not agent improvisation.** 28 commits on #540 and 7 rounds on #546, each push buying a full matrix and a new bot round [T1 #194, T2 #239]. → **Design rule:** the review block carries a round budget and severity floor, then defers the rest to filed issues. When a reviewer keeps finding holes in a predicate, treat it as a shape problem and escalate it, not something to patch [T2 #239–#244]. **Drop** "resolve every bot comment" as a gate. Gates judge outcomes.

3. **Enforcement lives at a boundary the operator can't edit (CI on the PR diff), never in local hooks.** "A local pre-commit hook cannot be a security boundary against its own operator" [T2 #244]. Hooks that block taught bypass [T2 #4, T5 #21, T7 #29]. → **Design rule:** protected-surface checks are a required CI check on the three-dot PR diff with an audit receipt. Local hooks are optional speed bumps that never mutate state and never block a merge commit. **Drop** the protected-state hook as authority.

4. **Local gates must fit an agent's step budget. Full-suite-on-push is baggage.** 4.6 h pre-push [T1 #235], hangs [T7 #28], 10-min validate [T11 #21]. → **Keep** affected-test routing, but fail closed with "unmapped path" instead of silently falling to the full suite [T6 #16, T15 #5]. **Design rule:** push runs lint + affected tests within a recorded budget; CI is the full-suite proof.

5. **Test the artifact that ships, through the real lifecycle.** The Bun smoke passed on a local tarball while the registry manifest was broken [T11 #1]. A fixture with `--ignore-scripts` hid the vendor tree [T16 #5]. The probe scraped console text [T3 #49]. Adapters were written to the fixture's shape [T5 #17]. → **Design rule:** every package block has a registry-shaped pack→install smoke (npm and Bun, same tarball) and asserts on structured receipts, not output text. **Keep** the cross-OS matrix [T6 #42].

6. **Flakes are diagnosed and quarantined, not rerun until green. Subprocess-heavy tests are the flake source.** Tier-A rerun never fired or 404'd [T3 #85–#88, T1 #135]. 59 % of files spawn the CLI [T2 #51]. The real "flake" was a 5 ms spawn death [T2 #4]. → **Design rule:** an in-process command harness, so commands are tested as functions and spawning is the exception. Quarantine registry plus an issue. A test's budget is a measured number recorded in code [T2 #170]. **Drop** the auto-rerun tier.

7. **Session and run continuity is a platform record, not an owner-pasted prompt.** The owner re-pasted handoffs four times [T10a–d], archaeology was needed to resume [T3 #2–#11], ~249 lines duplicated work that had already landed [T1 #246–#248], and the owner relayed between sessions [T3 #102]. → **Design rule:** the Kernel's run/attempt record holds head SHA, pending threads, uncommitted state and next step, and `resume <issue>` rebuilds context from it. Active leases and other sessions' work are visible in status. **Keep** the lease/claim conflict as the coordination primitive [T1 #276].

8. **Claims must be idempotent per attempt, cheap, and self-cleaning.** Same-actor re-claim replays a dead event and burns the actor [T1 #7–#11, #216]. 199 "active" claims vs 1 live [T9 #1]. Leases expire mid-poll [T1 #216]. → **Design rule:** the idempotency key includes the attempt/lease generation. Expired leases are reaped and never counted as active. Re-claim after release creates a fresh lease. A port must carry the regression test for the replay bug.

9. **Track what someone will read. Issue state is never a committed generated file.** 1,431 issues, 679 stale, 882 lint failures [T9 #1]. JSONL export round-trips reset counts and drew bot review threads [T7 #9–#36]. Status runs dirtied tracker state [T4 #4, T5 #12]. → **Drop** "file everything immediately" as a default-on rail and drop committed tracker snapshots. **Design rule:** reads never write. Tracker state lives in the Kernel store, outside git review. Status answers "what's live, what's blocked, what needs me" in one fast call [T9 #1–#5].

10. **Claims sit on evidence, and the agent answers the owner's question before running more commands.** Wrong "Actions quota" [T1 #219–#227], "0.0.1 burned forever" [T2 #136], "3 green = ready" [T9 #3–#5], "you didn't answer why" [T3 #98, #112], silence for hours [T1 #273]. → **Keep** the evidence-rung labels and the Decisions-needed + A/B/C + default report shape [T9 #1]. **Design rule:** progress and blockers are a queryable run state (heartbeat + current blocker) the owner can read without asking. The CLI exposes the facts (repo visibility/billing, registry state) so agents don't guess.
