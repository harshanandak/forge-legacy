# Forge as its consumers saw it — digest of 8 reader lanes (2026-10-16)

Compiled by the orchestrator from the final reports of eight read-only reader agents that read the owner's other projects' T3 threads (every page to `hasMore=false`; some long items keyword-filtered — see each lane's coverage note in the session record). Citations are `(thread-short, position)`. Secrets seen in threads were omitted by the readers.

## Cross-project pattern

| Theme | Evidence |
|---|---|
| Forge's toolchain assumptions broke projects | hardcoded `bun test` across Vitest/Playwright (Product-Suite be4e 84–86; 60a4 211); validate runner ignored `scripts.test` and receipt required Forge's own full suite (agent-companion rep 58, 237); ESLint-only lint gate (Zwapit cb68@70); Lefthook required in repos that never adopted Forge (agent-companion main 7, 867) |
| Gates depending on state Forge never writes | `.forge-state.json` required by ship/review/premerge, written by no command (Product-Suite be4e 89–123; agents hand-wrote it e736 247–255) |
| False success | `forge validate` exit 0 with failed shards (60a4 392); claim `"ok": true` with `verified:false` (curapod bf28 #0–6); status update "success" while Beads still open (Zwapit 3445@282); merge readiness label contradicting evidence (ops threads) |
| Beads/Dolt in worktrees | "database not found" in every new worktree; tracking abandoned (Product-Suite be4e 199–214, 775; Zwapit 3445@7–45); export written to root checkout (Scoreeasy f704) |
| Tracker drift | 80 open / 0 closed after many merged PRs because nothing closed issues from merged PRs (Scoreeasy f704 84–95) |
| Local hooks = friction and bypass | 8-min pre-push repeated by CI (Product-Suite e736 220), ~14 `--no-verify` pushes (be4e/e736); 5–7 min per push in curapod; owner moved curapod to CI-only: "I don't want to run tests and CI locally, even for pre-push" (curapod CC 292) → push 7 s instead of 4–10 min |
| Ceremony strong agents routed around | `forge plan` demanding a research file (curapod f4fe 7–14; Product-Suite be4e 24); missing `forge using-forge` verb that AGENTS.md tells agents to run (curapod, agent-companion); silent read-first gate; 10-min settle windows, actor+session lease rituals, gate-approval records for plain-word approvals (Product-Suite 60a4); six plan files per slice (Zwapit) |
| Never used | `forge push` (most projects), `worktree`, `clean`, `test`, `sync`, `shepherd` daemon, `remember/recall`, `insights`, `upgrade`, `gate` — agents used git/gh/bd directly |
| What earned its keep | single issue authority with check-after-write; exact-head merge guard; fail-closed links and evidence; RED-first TDD evidence; reply+resolve every review thread; post-merge verify against live system (caught an unapplied Supabase migration, Product-Suite be4e 383–398); independent spec + quality reviewers; issue/lease ownership proof |
| Gaps owners wanted Forge to own | wait-for-reviewers-quiet before merge (Zwapit cb68@118–141; curapod 790f 570); review-thread resolution (curapod ×3); plan-approval hard stop (Zwapit cb68@247); local test command = pre-push = CI; auto-close issues from merged-PR evidence (Scoreeasy); real deployment check before merge (Zwapit 609f@219) |

Lane-level verdict (curapod): "Weaker agents needed the gates; strong agents mostly hit them as unexplained friction."

## Per project — what migration must handle

- **Product-Suite** (kernel era + Beads era): kernel DB (issues, short ids, leases, PR links, worktree bindings, gate events); `.forge/config.yaml` merge rules (`checks_green`, `threads_resolved`, `settle_min: 10`); `.forge/patch.md`; Lefthook pre-push `scripts/prepush-gate.mjs`, `prepush-classify.mjs`, `PREPUSH_GATE_FAST`, `scripts/branch-protection.js` shim; pre-commit source/test coupling; live `forge hooks` calls and two native-hook scripts; `^0.0.9` pin; `.forge-push-token` ignore; old `.beads/` + `scripts/beads-context.sh`; `docs/plans/` vs `docs/work/` path mismatch; tests asserting plan state (`test/repo-tooling.test.js`); old PR-watcher/monitor tables. Must respect its own runners (Vitest/bun mix) and docs-only skips.
- **Scoreeasy (Volleyball)**: never adopted Forge ("Score Easy uses Beads, not Forge"). Import ~89 Beads issues (`.beads/issues.jsonl`, no-db config, ids `scoreeasy-*`, labels `pr-N`); replace Beads hooks keeping eslint/tsc pre-commit and test/build pre-push; remove Beads text `bd init` injected into AGENTS.md/CLAUDE.md/`.claude/settings.json`; vitest `.claude` exclude; map required checks (Android, iOS, verify, Sonar, Vercel, CodeRabbit). **Xtra**: nothing to migrate.
- **Zwapit**: already removed most Forge/Beads remnants (PR #50, ~7,600 lines). Remaining: stale kernel foreign keys; one `forge-workflow` skill; untracked `.forge/config.yaml`; `.pi/` noise; installed 0.1.0-beta.5 while npm `latest` is 0.0.10; Lefthook typecheck-only hooks; its own AI-review-quiet gate workflow.
- **curapod**: ~101 kernel issues in `.git/forge/kernel.sqlite` (back up before any schema change; tracked `.forge/kernel/issues.jsonl` is stale, 84 vs 101); `.forge/protected-paths.yaml`; `.forge/pr-monitor/`, `.github/.forge-issue`, `.forge/log.jsonl` clutter; pre-commit TDD + pre-push `npm test` (now CI-first by owner choice); its own `rail.*` safety ids collide with Forge gate ids; Forge sections in AGENTS.md (rendered from `~/agent-config`); D-NNN decision records + `next-decision-id.mjs` (collided across worktrees) — decision records are the real authority there; parked `chore/forge-config` branch; repo moved to `litemed-tech/curapod`; lanes must see Forge as inert (no setup checks in sandboxed lanes).
- **agent-companion (Harnest/handoff)**: Forge is maintainer-only with zero consumer footprint; needs opt-in adoption (no Lefthook prerequisite), runner contract (declared `scripts.test`, detected package manager, both streams, strict fail-closed parsing, "declared project script" as a first-class evidence mode), no Forge-suite results blocking its release, lint "no config" policy. Forge tooling held its finished beta ~4 days (Oct 4–8).

## Owner corrections worth carrying (verbatim-normalised)

"Priority is reducing time spent merging and running tests." · "It shouldn't run for docs." · "We need to be adaptable." · "Really bad AI slop solution." · "Why are you just moving ahead without my approval?" · "Why are you using sleep?" / "you have Shepherd for that" · "We've fixed 170+ issues… are they actually fixed?" · "We should have real deployment to check and merge." · "Leave forge issue, just give me a prompt to share to another agent." · "Forge is not required to be bundled for the user, they just use MCP." · "I don't want to run tests and CI locally, even for pre-push."

## Security notes (not copied)

Readers flagged secrets pasted in threads: curapod f4fe positions 68, 98, 124; litemed-workspace LM 82 (n8n API key — the agent there advised rotation; rotation status unknown). Owner informed 2026-10-16.
