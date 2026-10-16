# Dependencies and git hooks: what to drop, what to replace, how to keep the rest swappable

Lane: dependency and hook audit (read-only research), 2026-10-16. Input to the platform rebuild in [brief.md](brief.md).

**Owner concern:** "we faced a lot of issues with Lefthook, and we need to be clear on what dependencies can be dropped and replaced easily, as that was also an issue for us."

**Decisions needed (3), each has a default:**
- **H. Git hooks.** Default **H-A + H-C**: no local git hooks by default, CI is the gate, and agent guardrails go through harness hooks. No hook runner anywhere. See §2.
- **Y. Config format and the one runtime dependency.** Default **Y-A**: keep `.forge/config.yaml`, parsed by `yaml` behind one adapter in strict mode. See §4.
- **B. Runtime-dependency budget.** Default **B-A**: the published package ships **at most 1 runtime dependency now, with a hard ceiling of 3**. Each one needs a written justification. See §3.

Evidence tags: `read` (file:line or URL), `ran` (command), `inferred`. Old repo = read-only worktree `.worktrees/inventory-master` at `8ceb8c4a` (ran: `git log -1`).

---

## 0. Summary

| Verdict | Published package (a) | Our build only (b) | External tools (c) | Total |
|---|---|---|---|---|
| DROP | 6 | 5 | 7 | **18** |
| REPLACE WITH BUILT-IN | 3 | 4 | 1 | **8** |
| KEEP BEHIND AN ADAPTER | 2 | 0 | 7 | **9** |
| KEEP | 0 | 3 | 1 | **4** |
| **Rows** | 11 | 12 | 16 | **39** |

- Today the published package declares **3 runtime dependencies** (`@babel/parser`, `cross-spawn`, `yaml`). It also has an optional `lefthook` peer dependency (read: `package.json` `dependencies`, `peerDependencies`). The lockfile resolves **396 packages** (ran: `grep -oE '^    "[^"]+": \["' bun.lock | wc -l`). Most of those come from dev tooling, which needs **8 `overrides`** just to patch security advisories (read: `package.json` `overrides`; commits `fa84bc41` #472 and `11db39d4` #520 "resolve … advisories").
- After the rebuild the published core needs **one** runtime dependency (`yaml`). It can get to **zero** if decision Y-B is taken (§4).
- **Lefthook:** DROP it everywhere: from the published package, from user projects and from our own repo. CI becomes the gate. Agent guardrails move to harness hooks. A user's existing hook manager is detected and left alone (§2).

---

## 1. Dependency ledger

Columns: what it does for us · where it is used · problems it caused · verdict · replacement or adapter (with citation).

### (a) What ships to users (published `forge` package)

| # | Dependency | What it does for us | Used in | Problems (evidence) | Verdict | Replacement / note |
|---|---|---|---|---|---|---|
| a1 | `yaml` ^2.8.3 | Parses and writes `.forge/config.yaml`, `protected-paths.yaml` and lefthook config; hook scripts read config with it | **15 files** (11 lib, 2 scripts, 2 `.forge/hooks`) (ran: grep for `require('yaml')` / `from 'yaml'`) | No direct defect found in `git log -i --grep=yaml` (ran). Its sibling `js-yaml` needed an advisory fix (#520) and was then removed (`fcc8171c` #599) (read). | **KEEP BEHIND AN ADAPTER** | Node 24 has no YAML built-in (inferred: absent from the Node 24 API index, https://nodejs.org/docs/latest-v24.x/api/). `Bun.YAML.parse` exists (read: https://bun.com/docs/runtime/yaml) but users run Node, so it cannot be used in the published core. The adapter must enforce the plan's strict subset: no duplicate keys, aliases/anchors, merge keys or custom tags, plus byte/depth budgets (read: platform-plan-final.md:659). See §4 decision Y. |
| a2 | `@babel/parser` ^8 | JS AST for dep-guard import detection, `docs-command`, and the D20 `release-readiness` audit | **3 lib files** + `lib/dep-guard/analyzer.js` names it (read: `lib/dep-guard/import-detector.js:3`, `lib/docs-command.js:3`, `lib/release-readiness.js:6`) | Its consumers are themselves baggage. D20 kill-list `release-readiness` took 72 commits, 16 of them fixes (read: mistakes-ledger.md:58). | **DROP** | All three consumers are DROP in the mistakes ledger (§9 "Modules and files", mistakes-ledger.md:131). If import scanning comes back later, it goes in a dev-only check that uses `typescript` (already a dev dependency), not in a runtime dependency (inferred). |
| a3 | `cross-spawn` ^7 | Windows-safe spawning | **2 files** (read: `lib/commands/github.js:5`, `scripts/package-size-check.js:22`) | It duplicates the in-house resolver. The real Windows fix lives in `lib/shell-utils.js`, which handles `.cmd`/extensionless shims, CVE-2024-27980 and kernel issue 9997d516 (lefthook/npm ENOENT), with regression tests at `test/shell-utils.test.js:134,241` (read). Two spawn paths means two behaviours. | **REPLACE WITH BUILT-IN** | `node:child_process` `spawn`/`spawnSync` (Stable), wrapped by the one process adapter. Port **the behaviour and its regression tests** from `shell-utils.js`, not the old code shape (brief "No baggage"). https://nodejs.org/docs/latest-v24.x/api/child_process.html |
| a4 | `chalk` ^6 (workspace `packages/skills`) | Terminal colour | `packages/skills` only (read: `packages/skills/package.json`) | Needed a major-version bump PR (#461, `3d6c4dec`) (read) | **REPLACE WITH BUILT-IN** | `util.styleText`: stable since v23.5.0/v22.13.0, respects `NO_COLOR`/`FORCE_COLOR` (ran: Node 24 `util.json` history). https://nodejs.org/docs/latest-v24.x/api/util.html |
| a5 | `commander` ^15 (workspace) | Argument parsing | `packages/skills` | None found | **REPLACE WITH BUILT-IN** | `util.parseArgs`: no longer experimental since v20.0.0 (ran: `util.json`). The CLI is generated from the operation catalog anyway (brief "No hand-written command set"). |
| a6 | `inquirer` ^14 (workspace) | Interactive prompts | `packages/skills` | Agents can't answer TTY prompts | **DROP** | Use non-interactive flags or JSON input. Agents are the primary users (brief "Design for agents…"). |
| a7 | `js-yaml` ^5 (workspace) | Second YAML parser | `packages/skills` | Advisory #520; already removed from root by #599 (read: `fcc8171c`) | **DROP** | Use the a1 adapter |
| a8 | `markdown-it` ^14 (workspace) | Markdown parsing for the skills CLI | `packages/skills` | None found | **DROP** | Skill frontmatter is a small fenced block; parse it in the skills block without a Markdown engine (inferred) |
| a9 | `lefthook` (optional `peerDependencies`) | Signals that hooks need Lefthook | `package.json` peer + meta | §2 in full | **DROP** | No hook runner in a user's project, ever (brief "Our toolchain is not the user's") |
| a10 | `bundledDependencies` `@forge/{flow,memory,contracts}` (history) | Shipped internal packages | Removed by folding into `lib` (#601, `ba56b920`) (read) | `bun add forge-workflow@0.1.0-beta.7` failed: Bun resolves root deps from the registry and those 404'd (read: `e44e1f1d` #575) | **DROP** (as a pattern) | One package, no bundled or workspace runtime packages. The packed-install smoke runs on **npm and Bun** (inferred, from #575). |
| a11 | `node:sqlite` / `bun:sqlite` (built-in, not an npm dep) | Kernel store | `lib/kernel/sqlite-driver.js:35` (runtime order `bun:sqlite`, `node:sqlite`) (read) | `kernel/sqlite-driver.js` has 13 fix commits (read: mistakes-ledger.md:12) | **KEEP BEHIND AN ADAPTER** | `node:sqlite` is **Stability 1.2 Release candidate since v24.15.0** (and v25.7.0 on the latest line), unflagged since v22.13/v23.4 (read: https://nodejs.org/docs/latest-v24.x/api/sqlite.html; ran: `latest/api/sqlite.json`). On local Node v24.18.0, `new DatabaseSync(':memory:')` ran with **no ExperimentalWarning** and reported SQLite 3.53.1 (ran). It is RC, not Stable, so keep it behind the store adapter, as today. Suggest an `engines` floor of `>=24.15` so users always get the RC build (inferred). |

**Built-ins the new core should use instead of adding dependencies** (all ran against Node 24 API JSON at `https://nodejs.org/docs/latest-v24.x/api/<module>.json`; `typeof` checked on local Node v24.18.0):

| Need | Built-in | Status |
|---|---|---|
| Glob | `fs.globSync` / `fsPromises.glob` | "v24.0.0: Marking the API stable" (ran: fs.json) |
| CLI args | `util.parseArgs` | Not experimental since v20.0.0 |
| Colour | `util.styleText` | Stable since v23.5.0/v22.13.0 |
| `.env` parsing | `util.parseEnv` | Not experimental since v24.10.0 |
| Recursive copy | `fs.cp` | Not experimental since v22.3.0 |
| Strip ANSI | `util.stripVTControlCharacters` | Available since v16.11.0 |
| Store | `node:sqlite` | RC 1.2 (above) |
| Run TS source directly | `module.stripTypeScriptTypes` | **RC 1.2, not used for shipping**: we publish compiled JS (inferred) |

### (b) What only we use to build Forge (dev dependencies and repo scripts)

| # | Tool | What it did | Used in | Problems (evidence) | Verdict | Replacement |
|---|---|---|---|---|---|---|
| b1 | `@commitlint/cli` + `config-conventional` | `commit-msg` hook | `lefthook.yml` commit-msg → `scripts/commitlint.js` (read) | Ran from a local hook, so it inherits every §2 problem. With squash-only merges, only the PR title reaches `master` (read: AGENTS.md "Squash-only merging"). | **DROP** | A CI check on the PR title (a few lines of TS, inferred) |
| b2 | `eslint`, `@eslint/js`, `globals`, `eslint-plugin-sonarjs`, `@microsoft/eslint-formatter-sarif` | Lint `--max-warnings 0` | `package.json` `lint`; `scripts/lint.js` | ESLint-only lint gate imposed on consumers (brief "Language and toolchain": among the most damaging failures). typescript-eslint needs the TS 6 API next to TS 7 (read: toolchain-check-lint.md:75). An `eslint` override was needed. | **REPLACE WITH BUILT-IN** | `bun lint` once it is in stable Bun (it is in canary 1.4.4, ran per toolchain-check-lint.md:51; https://bun.com/docs/lint). Until then, `oxlint --type-aware --deny-warnings` (b8). |
| b3 | `@stryker-mutator/core` | Mutation testing (`npx stryker run`) | `test:mutation` script | Needed a major-version bump with a regenerated lockfile (#603, `0ffe53de`) (read). Heavy transitive tree. | **DROP** | Re-add later only as an optional CI job if it earns its place |
| b4 | `c8` | Coverage thresholds | `test:coverage`, `package.json` `c8` | Major-version bump PR (#422) | **REPLACE WITH BUILT-IN** | `bun test --coverage` with thresholds in `bunfig.toml` (https://bun.com/docs/test/coverage, inferred URL path; coverage is a documented `bun test` feature) |
| b5 | `lefthook` (dev) + `.husky/` launchers | Our own repo's hooks | `lefthook.yml` (80 lines), `.husky/*` (4 files, 289 lines), and `prepare` runs `lefthook install` for every contributor (read: `package.json` `scripts.prepare`) | §2 | **DROP** | §2 H-A for our repo too, with an optional H-B convenience hook |
| b6 | `overrides` (8 entries: eslint, fast-uri, flatted, minimatch, brace-expansion, linkify-it, lodash, qs) | Patch transitive advisories | `package.json` | The advisory churn itself (#472, #520) | **DROP** | Goes away with b1–b4. Rule: any new override needs an issue and an expiry date (§3). |
| b7 | `typescript` 7.0.2 (new) | Type check and `.d.ts` emit | n/a (new) | n/a | **KEEP** | The only thing Bun can't do: emit `.d.ts` (brief; toolchain-check-lint.md:79) |
| b8 | `oxlint` 1.88.0 + `oxlint-tsgolint` (new) | Type-aware lint | n/a (new) | n/a | **KEEP** (interim) | Swap to `bun lint` when stable. Bump the pair together (toolchain-check-lint.md:103). |
| b9 | `bun test` | Test runner | `package.json` `test` | Hardcoded `bun test` was pushed onto users (brief) | **KEEP** (ours only) | A user project runs its own declared test command (§3 rule R4) |
| b10 | `bun x yaml valid` (via `bash -c find …`) | YAML lint of our workflow files | `validate:yaml` script (read) | It needs bash, `find` and a network `bun x` | **REPLACE WITH BUILT-IN** | A Bun script using `Bun.YAML.parse` + `Bun.Glob` (read: https://bun.com/docs/runtime/yaml, https://bun.com/docs/runtime/glob) |
| b11 | Bash scripts and `*.test.sh` (37 `.sh` files; 17 of them were **shipped** in `files`) | Team sync, smart-status, validate, PR coordination | `scripts/**/*.sh`, `.claude/scripts/*.sh` (ran: `ls`) | Windows is the top bug theme (96 issues, 60 open) and the cause of a mandatory Git Bash requirement (read: mistakes-ledger.md:22; AGENTS.md "Shell Model") | **REPLACE WITH BUILT-IN** | TS on Node built-ins for shipped code. Bun Shell `$` only for our dev scripts (https://bun.com/docs/runtime/shell). |
| b12 | `bun build --compile` binary + embedded assets | Single-file binary | `build:binary`, `gen:assets` | Already on the DROP list (mistakes-ledger.md:131) | **DROP** | Re-admit only by plan §9 decision |

### (c) External tools Forge shells out to

Counts are files in `bin lib scripts .forge .claude/scripts` that both contain the quoted tool name and call `spawn`/`exec` (ran: grep loop; approximate, since some calls pass the name through a variable).

| # | Tool | What it does for us | Files | Problems (evidence) | Verdict | Port / adapter |
|---|---|---|---|---|---|---|
| c1 | `git` | Worktrees, refs, diff, push | **62** | Stale-base worktrees (E3), squash-merge cleanup (#319) (mistakes-ledger.md:104,111) | **KEEP BEHIND AN ADAPTER** | `vcs` port → `adapters/git`. The **only required** external tool. |
| c2 | `gh` | PRs, checks, review threads | **17** | WSL path breakage in merge scripts (threads-ops.md:249) | **KEEP BEHIND AN ADAPTER** | `code-host` port → `adapters/github-cli` (optional; GitHub REST is a later alternative) |
| c3 | `bash` / `sh` | Running shipped `.sh` scripts and hook bodies | 6 / 2 | Forced Git Bash on Windows (AGENTS.md "Shell Model") | **DROP** | No shell required; spawn argv arrays only |
| c4 | `bd` (Beads) | Legacy issue store | 4 (`migrate`, `status`, `migrate-dry-run`, `release-readiness`, `runtime-health`) | 85 beads/bd/dolt commits; hooks mutated Beads state and caused hook bypasses (threads-ops.md:130) | **DROP** | Retired (D45). The owner's migration reads Beads' on-disk export as a file. No `bd` binary is spawned (inferred). |
| c5 | `dolt` | Beads backend | 2 | Dolt server locked worktree cleanup (threads-ops.md:117) | **DROP** | — |
| c6 | `lefthook` / husky | Hook runner | 5 + `lib/husky-migration.js` | §2 | **DROP** | — |
| c7 | `npx` / `bunx` | Run tools ad hoc | 4 / 2 | Network fetches at run time; `npx` vs `bunx` confusion (`0e6ef6fc` #45 "npx not bunx") (read) | **DROP** | Run the project's declared scripts only |
| c8 | `npm` / `pnpm` / `yarn` / `bun` (as the **user's** package manager) | Install deps, run scripts | 15 / 11 / 11 / 24 | Hardcoded `bun install` dead-ended npm users (`b3a0269c` #351) (read) | **KEEP BEHIND AN ADAPTER** | `package-manager` port. Detect from lockfile (`lib/package-manager-remediation.js` logic, behaviour only). Never assume one. |
| c9 | `node` | Re-invoke Forge's own scripts | 18 | PATH lookup of `node` on Windows | **KEEP** | Always `process.execPath`, never a PATH lookup (inferred) |
| c10 | `eslint` / `oxlint` (as the **user's** linter) | Lint the user's code | 5 / 1 | ESLint-only lint gate imposed on users (brief) | **DROP** (from core) | Run the user's declared `lint` command if present; otherwise report "no lint declared" |
| c11 | `python` (detection) | Project-type detection | 2 (`lib/doc-gate/detect.js`, `lib/project-discovery.js`) | None found | **KEEP BEHIND AN ADAPTER** | `project-detect` port; detectors are data, one per ecosystem |
| c12 | `jq` | JSON in shell scripts | 2 | Unneeded runtime requirement | **DROP** | `JSON.parse` |
| c13 | `powershell` / `taskkill` / `ps` | Kill process trees (timeouts) | `scripts/process-tree.js`, `scripts/test-profile.js` | Stalls and orphaned processes (40 flake/timeout/stall commits; mistakes-ledger.md:12) | **KEEP BEHIND AN ADAPTER** | `process` adapter (Node has no tree-kill built-in, inferred). Keep its regression tests. |
| c14 | `where` / `which` | Resolve executables | 4 / 4 | Shim ENOENT (9997d516) | **REPLACE WITH BUILT-IN** | A PATH/PATHEXT walk on `node:fs` inside the process adapter. `Bun.which` is Bun-only, so it can't be used in the published core. |
| c15 | `coderabbit` CLI | Pre-PR review | 4 | WSL CodeRabbit confusion (threads-foundation-harness.md:88) | **KEEP BEHIND AN ADAPTER** | `review-provider` port, optional |
| c16 | `claude` / `codex` / `cursor-agent` / `opencode` | Harness launch/probe | 14 / 9 / 1 / 1 | Probe-only stream-json; routing refusals (threads-foundation-harness.md:88) | **KEEP BEHIND AN ADAPTER** | `harness` port, one adapter per harness |

---

## 2. Git hooks

### 2.1 What went wrong with Lefthook (and the hook layer around it)

| # | Failure | Evidence |
|---|---|---|
| 1 | **Windows spawn failures.** Lefthook/npm `.cmd` and extensionless shims hit `spawnSync` ENOENT, so setup could not install hooks. | read: `bin/forge.js:124-127` ("Windows npm/npx/lefthook cmd shims … kernel issue 9997d516"); `lib/shell-utils.js:10-15`; regression tests `test/shell-utils.test.js:134`; mistakes-ledger.md:83 (B9) |
| 2 | **Shim and hooks-path detection churn.** Recognising Bun's lefthook shim, worktree gitdirs and explicit `core.hooksPath` took a 7-fix PR plus a follow-up. | read: `639a9c1f` #135 ("respect explicit git hooks path", "verify lefthook hook content", "harden lefthook hook verification"); `87d7b62c` #138 ("recognize bun lefthook shims", "preserve hooks during preflight init") |
| 3 | **Lefthook made a gate for the whole workflow.** A missing Lefthook blocked plan/dev/ship/review, and the remediation hardcoded `bun`, dead-ending npm/pnpm/yarn users. | read: `b3a0269c` #351; `lib/runtime-health.js:504` (`LEFTHOOK_MISSING`) |
| 4 | **Wrong config shipped to users, enforcement silently inert.** `forge setup` copied *our* dev `lefthook.yml` (pointing at repo-internal scripts) into user projects. There was no native fallback, so TDD enforcement was silently inert and `forge ship` then hard-blocked on a missing hook. Two copies of the installer had drifted apart. | read: `7b7af0fd` #382 (beta blocker B3) |
| 5 | **Clobbered user hooks.** Any hook containing the substring "lefthook" was overwritten without a backup. "Verify active" passed even when the gate script was missing. | read: `7292fb98` #388 (F4/F5) |
| 6 | **Stacked a second gate** on repos that already had a TDD/coupling pre-commit gate. | read: `58d5f665` #458 |
| 7 | **Hooks claimed active while gates were disabled** (and the reverse). It took an 8-commit series to make hooks "config-honest". | ran: `git log --all \| grep eda6d866` → `04d03250`, `9accb1f9`, `e3bc2bf1`, `cf08b899`, `8923ccb7`, `a091e240`, `c51f1971` #399, `7582fdeb` #414 |
| 8 | **Pre-push grew into a local CI.** It ran the full suite for 4.6 h on Windows. The `--quick` nonce expired before git fired the hook (#452). | read: threads-ops.md:46, 228; `535b84e4` #452 |
| 9 | **Hooks taught bypass.** `--no-verify` twice, hooks disabled, and the owner handed `core.hooksPath=/dev/null` to get a workflow edit through. "A local pre-commit hook cannot be a security boundary against its own operator." | read: threads-ops.md:72, 117, 130, 156, 239–240, 69 |
| 10 | **Hooks mutated state.** Commit and push hooks rewrote Beads files and `.agents/skills`; team-sync ran on every push. | read: threads-ops.md:130; `lefthook.yml` pre-commit `sync-agent-skills`, `sync-d20-audit`, pre-push `team-sync`, `auto-backing-issue` |
| 11 | **Two hook systems and a migration layer.** Husky launchers that call Lefthook, plus `lefthook.yml`, plus a Husky→Lefthook migrator. | read: `.husky/pre-push:1-30` (`call_lefthook`); `lib/husky-migration.js` (551 lines) |
| 12 | **Size of the problem.** 2,374 lines of hook-support code in `lib/` (`lefthook-check` 90, `lefthook-wiring` 433, `husky-migration` 551, `existing-tdd-gate` 253, `hook-global-installer` 347, `hook-renderer` 700). Lefthook is named in 24 source files and 32 test files and in 38 commit messages; 123 commits mention "hook". `lefthook.yml` alone is covered by 19 suite files. | ran: `wc -l`, `grep -rl lefthook`, `git log -i --grep`; read: inventory-infra.md:182 |

**Root cause (inferred):** two mistakes stacked. (1) A local hook was used as an *enforcement boundary* for process (TDD ordering, protected paths, full suite), which the operator can always bypass and which capable agents learned to bypass. (2) Enforcement was coupled to one third-party runner that has to be installed, located and verified on every OS, package manager and worktree layout. That turned Forge's toolchain into the user's toolchain.

### 2.2 Decision H: how Forge handles git hooks

| Option | What it is | For | Against |
|---|---|---|---|
| **H-A. No local git hooks by default; CI is the gate** | Forge installs nothing into `.git/hooks`. Enforcement that matters (protected surfaces, tests, lint, exact-commit evidence) is a required CI check on the PR diff. Locally, `forge check` runs the project's declared commands on demand, within a time budget. | Removes failures 1–12 at once. Matches threads-ops.md:293 and threads-delivery-plan.md:164 ("CI is the proof; local ceremony is optional"). Nothing to bypass. | No automatic local feedback before push. Mitigated by H-B (opt-in) and by agents running `forge check` themselves. |
| **H-B. Opt-in, Forge-generated tiny native hook** | `forge hooks install` writes one ≤10-line POSIX `sh` hook per event into the directory from `git rev-parse --git-path hooks`. The hook only `exec`s `"$NODE" <forge-entry> hook <event> "$@"`, carries a Forge sentinel, and backs up any non-Forge hook first. It is **never installed** if any hook manager or existing hook is detected: Husky (`core.hooksPath` set, `.husky/`), Lefthook (`lefthook.yml`), the `pre-commit` framework (`.pre-commit-config.yaml`), or a non-Forge `.git/hooks/*`. In that case it prints the one line to add to the user's own manager. It never sets `core.hooksPath` in a user's repo, because setting it disables the user's existing hooks dir (git docs: https://git-scm.com/docs/githooks, https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath). | No runner dependency. Keeps the hard-won behaviours (worktree gitdir resolution, back up before overwrite, verify the gate exists) as regression tests from #135/#382/#388/#458. | Still a local hook. It must be advisory and fast (lint + affected tests within a recorded budget, threads-ops.md:295) and must never mutate state (failure 10). |
| **H-C. Harness hooks for agent guardrails** | Generated from block declarations into each harness's native hook config: Claude Code hooks (https://code.claude.com/docs/en/hooks), Codex `hooks.json` / `[hooks]` in `.codex/config.toml`, loaded only for trusted projects (read: https://developers.openai.com/codex/config-advanced), and Cursor `hooks.json` with `beforeShellExecution` etc. (read: https://cursor.com/docs/agent/hooks). They guard **irreversible or high-risk agent actions**: `--no-verify` / `core.hooksPath=/dev/null`, force-push to the default branch, edits to protected surfaces, merge. They do not police process. | Acts where agents actually act (before the tool call), with an explanation the agent can read. The old repo already renders native Claude/Cursor hooks (read: `1160ed6d` #317, `lib/hook-renderer.js`). This fits "trust and permission boundaries" in the brief. | Differs per harness, so it needs one adapter per harness. It is still advisory: CI stays the boundary. |
| **H-D. Keep a hook runner as one optional adapter** | A `hook-runner` adapter can *add an entry* to Lefthook/Husky/pre-commit config **only when the user already uses that runner**. It never installs or requires the runner. | Integrates cleanly with teams that already have a runner. | More adapters to maintain. Not needed for 0.1.0. |

**Default: H-A + H-C.** H-B is shipped but opt-in. H-D is deferred (file a follow-up issue; not in 0.1.0).

- **Reason:** CI on the PR diff is the only boundary the operator can't edit (threads-ops.md:69, 293). Harness hooks are where agent mistakes are prevented early. Neither needs a runner. This satisfies "Forge must never require a hook runner in a user's project, and must detect and defer to whatever the user already has". The brief's rule "gates judge outcomes, not process" drops the TDD-ordering pre-commit rail (P1, mistakes-ledger.md:90).
- **What would change it:** if consumer projects without CI turn out to be common (for example the owner's personal projects with no required checks), make H-B default-on **for those projects only**, still detect-and-defer, and still advisory.
- **For the Forge repo itself:** H-A. CI required checks are the gate, the `prepare` hook install is removed (b5), and contributors may run `forge hooks install` (H-B) for a fast local lint pass. **No hook bypass for agents** stays a rule, but nothing local remains that would tempt one.

**Hard-won behaviours to keep (as tests, not code):** resolve the worktree gitdir and an explicit hooks path (#135); never overwrite a non-Forge hook without a backup, and match "ours" by sentinel, not by substring (#388); "active" means the gate the hook calls actually exists and config enables it (#388 F5, #399, #414); detect an existing gate and defer *visibly* (#458); a declared lane must be passed explicitly, not via an expiring nonce (#452); spawn Windows shims correctly (9997d516).

---

## 3. Replaceability rule

### 3.1 The rule as it would appear in the new repo's `CODING_STANDARDS.md`

> ### Dependencies and external tools (diff-checkable)
>
> **R1. One adapter per dependency.** Every third-party npm package and every external executable is reached only through one module, `src/adapters/<name>/`. That module implements a typed port declared in `src/ports/<capability>.ts` (for example `ConfigParser`, `Vcs`, `CodeHost`, `PackageManager`, `Process`, `Store`, `Harness`, `ReviewProvider`). Core, blocks and other adapters import the **port type**, never the package or another adapter's internals.
>
> **R2. No imports of a dependency outside its adapter.** `import`/`require` of a package listed in `dependencies` or `devDependencies` is allowed only under `src/adapters/<that-package's-adapter>/` (build scripts under `tools/` may import dev dependencies). `node:child_process` is allowed only in `src/adapters/process/`. All other adapters spawn through the `Process` port, with argv arrays only and no shell strings.
>
> **R3. Missing is a result, not a crash.** Each adapter has `probe(): Available | Unavailable{reason, remedy}`. Core treats `Unavailable` as a typed outcome and reports it plainly. Only `git` and the Node runtime may be required. Remedies come from the detected package manager and never hardcode one.
>
> **R4. Our toolchain is not the user's.** No code path outside `src/adapters/` names a specific package manager, test runner, linter, hook runner or language. User commands come from the project's declared scripts/config. Forge never runs `npx`/`bunx` at run time.
>
> **R5. Published-package budget.** `package.json#dependencies` holds **≤ 1 entry** (ceiling 3). It has no `peerDependencies`, `optionalDependencies` or `bundledDependencies`, and no install-time scripts that run in a consumer (`preinstall`, `install`, `postinstall`, `prepare`). Adding a runtime dependency needs a decision record covering: why no Node 24 built-in suffices, the transitive count, licence, the adapter name, and an exit plan. Every `overrides` entry cites an issue and an expiry date.
>
> **R6. Prefer the platform.** Before adding a dependency, check Node 24 built-ins (`node:sqlite`, `fs.glob`, `util.parseArgs`, `util.styleText`, `util.parseEnv`, `node:test`) for shipped code and Bun built-ins (`Bun.YAML`, `Bun.Glob`, Bun Shell, `bun test`, `bun lint`) for our tooling. Bun APIs never appear in the published package.
>
> **R7. Swap test.** Each port has a contract test suite that every adapter (including an in-memory fake) must pass. Replacing a dependency means writing a new adapter that passes the same suite, with no change outside `src/adapters/`.

### 3.2 How it is enforced (inferred design; all checks run in CI)

| Check | Mechanism |
|---|---|
| R2 import boundary | `test/structure/dependency-boundary.test.ts`. It reads `package.json`, extracts every import specifier from `src/**` with `ts.preProcessFile` (TypeScript is already a dev dependency), and fails on any package or `node:child_process` import outside its owning adapter. It reads the owner mapping from `src/adapters/<name>/adapter.json` (`{ "package": "yaml", "port": "ConfigParser" }`). Add a lint `no-restricted-imports` rule too for in-editor feedback, if oxlint/`bun lint` support it per directory (not verified). |
| R4 toolchain names | The same test greps `src/` outside `adapters/` for a denylist of literals (`"bun"`, `"npm"`, `"pnpm"`, `"yarn"`, `"lefthook"`, `"husky"`, `"eslint"`, `"vitest"`, `"jest"`, `"npx"`, `"bunx"`). |
| R5 budget | `test/structure/package-budget.test.ts` asserts the dependency count, the absence of forbidden fields and scripts, and an `overrides` issue/expiry format. |
| R5 installed artifact | A packed-tarball smoke: `npm pack` → install into an empty dir with **npm on Node 24 and Node 26, with no Bun on PATH**, then with Bun → `forge --version` and a no-network command. This fixes "tests ran against the source tree, not the packed artifact" (mistakes-ledger.md:83) and the Bun install break (#575). |
| R7 swap | Each `src/ports/<x>.contract.ts` is run against every registered adapter plus a fake. |

### 3.3 Proposed adapters at 0.1.0

`config-yaml` (yaml), `store-sqlite` (node:sqlite / bun:sqlite), `process` (node:child_process + tree-kill), `vcs-git`, `code-host-github-cli` (gh), `package-manager` (npm/pnpm/yarn/bun detection), `project-detect`, `harness-{claude,codex,cursor}`, `review-provider-coderabbit` (optional), `git-hooks-native` (H-B, opt-in).

### 3.4 Decision B: runtime-dependency budget

| Option | Budget |
|---|---|
| **B-A (default)** | ≤ 1 now (`yaml`), ceiling 3, each with a decision record |
| B-B | 0, hard (requires Y-B or Y-C) |
| B-C | ≤ 5, soft |

- **Reason:** today we ship 3 runtime deps, and the actual pain came from the dev tree (396 packages, 8 overrides) and from tool coupling, not from shipped deps. A ceiling of 3 leaves room for one justified addition (for example an optional Sigstore verifier, plan line 503, which would sit behind an adapter and be loaded lazily), while still forcing a record for each.
- **What would change it:** choose B-B if the owner takes Y-B/Y-C, or if a supply-chain policy requires zero.

---

## 4. Zero-dependency core assessment

**Verdict (inferred): near-zero is achievable now (1 dependency); zero is achievable if we own a strict YAML subset parser or move config to JSON.** Everything else the core needs has a Node 24 built-in or is already in-house.

| Need | Status on Node 24 | Blocks zero? |
|---|---|---|
| Store | `node:sqlite` RC 1.2 since v24.15.0, no warning on 24.18 (ran) | No. Its RC status is a stability risk, not a dependency. Keep the adapter and an `engines` floor of `>=24.15`. |
| Process spawn on Windows | `node:child_process` plus in-house shim resolution (`lib/shell-utils.js` behaviour) | No (cross-spawn dropped) |
| CLI parsing / colour / glob / env | `util.parseArgs`, `util.styleText`, `fs.glob`, `util.parseEnv`, all stable (ran) | No |
| JSON Schema validation of block manifests and config | No built-in. The old repo shipped no validator dependency (read: `package.json` deps), so validation was in-house. | No, if we keep an in-house validator for the subset of JSON Schema our public schemas use, or generate validators at build time (inferred) |
| MCP surface | stdio JSON-RPC; old repo had no MCP SDK dependency (read: `package.json`) | No. Hand-rolled framing is small; the SDK, if wanted, goes behind an adapter (inferred). |
| **YAML config** | **No built-in in Node.** `Bun.YAML` is Bun-only. | **Yes: the one blocker** |
| Supply-chain verification (optional) | Sigstore needs Node 24.15+ (read: platform-plan-final.md:503) | Only if adopted; it would be optional and lazily loaded |

### Decision Y: config format

| Option | What | Runtime deps |
|---|---|---|
| **Y-A (default)** | Keep `.forge/config.yaml` (plan line 614 "One config"). Parse with `yaml` behind `config-yaml`, configured strictly: `uniqueKeys`, no aliases/merge/custom tags, plus pre-parse byte/depth limits per plan line 659. | 1 |
| Y-B | Own a strict YAML-subset parser (maps, sequences, scalars, comments; the plan already rejects anchors, aliases, merge keys and tags). Fuzz it against `yaml` as a dev-only oracle. | 0 |
| Y-C | JSON config (`.forge/config.json` with a `$schema`) and YAML as an optional adapter | 0 |

- **Reason for Y-A:** the plan of record fixed YAML config, and it is human- and agent-readable. `yaml` has had no defect in our history. Owning a parser (Y-B) is real work and a new source of bugs, while the brief says to bring over what works.
- **What would change it:** if `yaml` has an advisory or a breaking major, or if the owner wants B-B (zero deps), switch to Y-B. The adapter boundary (R1, R7) makes that a swap behind the same contract test, with no change in core. Y-C conflicts with plan line 614 and would need a stated reason.

---

## 5. What I inspected and found nothing notable

- `git log -i --grep=yaml` and `--grep=cross-spawn`: no defect commits for `yaml` or `cross-spawn` themselves (ran).
- No `pwsh`, `icacls` or `wsl` spawns in `bin lib scripts .forge .claude/scripts` (ran: grep loop).
- `packages/skills` (the workspace with chalk/commander/inquirer/js-yaml/markdown-it) is **not** in the published `files` list (read: `package.json#files`), but it is referenced by `lib/commands/setup.js`, `lib/skills-sync.js`, `lib/release-readiness.js` and `bin/forge.js` (ran: grep `packages/skills|@forge/skills`). Its deps are listed under (a) because the published code reaches into the workspace (inferred); DROP either way.
- No threads-consumers.md exists in the rebuild folder (ran: `ls`). Consumer evidence is quoted from brief.md and threads-ops.md.

## 6. Follow-ups to file (Kernel tracking)

1. Hook-runner adapter (H-D), deferred past 0.1.0.
2. Swap `oxlint` → `bun lint` when it lands in stable Bun (b8).
3. Decide whether mutation testing returns as an optional CI job (b3).
4. Sigstore verifier adapter, if decision 41 adopts it (plan line 503).
