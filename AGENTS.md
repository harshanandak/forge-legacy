<!-- FORGE:START -->
# Project Workflow Instructions

## Default TDD-First Workflow Template

This project ships a **default TDD-first workflow template** with 6 workflow stages plus a composable **research** skill (a phase of `/plan` and usable standalone). In v3, these stages are one configurable composition over Forge runtime building blocks, not a product-wide mandatory ladder. Commands may be invoked as full stages or as smaller skill fragments when the active plan permits it. Pre-merge is an embedded gate in `/ship` and `/review` (not a numbered stage); `/status` and `/shepherd` are utilities (not stages).

## Skill Dispatch (auto-trigger)

Before ANY response — including clarifying questions or exploring the codebase — if there is even a 1% chance a Forge skill applies, invoke it, then announce `Using [skill] to [purpose]`. Invoke the `using-forge` dispatch skill (auto-discovered from your agent's own skills — Forge setup installs it into each harness's skills dir; it carries the 1%-rule and routing table), or run `forge skill for "<situation>"` for the deterministic best-fit skill. This is agent-agnostic — never branch on harness identity.

| Stage | Command     | Purpose                                                   | Required For |
|-------|-------------|-----------------------------------------------------------|--------------|
| 1     | `/plan`     | Design intent → research → branch + worktree + task list | Critical, Standard, Refactor |
| 2     | `/dev`      | Subagent-driven TDD per task (spec + quality review)     | All types    |
| 3     | `/validate`    | Validate + 4-phase debug mode on failure                    | All types    |
| 4     | `/ship`     | Create PR with documentation                             | All types    |
| 5     | `/review`   | Address ALL PR feedback                                  | Critical, Standard |
| 6     | `/verify`   | Post-merge health check (CI, deployments)                | All types    |

**Pre-merge gate (not a numbered stage)**: Completing docs on the feature branch and handing off the PR for merge is a **task-type gate and checkpoint**, not a standalone workflow stage. The gate runs for Critical, Standard, and Refactor work and is embedded in the `/ship` and `/review` stages — finish the doc updates, confirm CI is green, then hand off the PR. Simple, Hotfix, and Docs work skip the gate.

**Utility**: `/status` — Context check before starting work (not a numbered stage)

**Utility**: `/shepherd <pr>` — Autonomous PR ownership. `forge shepherd daemon` is a singleton reconcile daemon that owns **all** open PRs for the repo: it converges CI check state into kernel verdicts, re-runs flaky required checks (Tier-A), reaps orphan watchers, and self-retires when no PRs remain — so agents read verdicts (`forge shepherd <pr> --pull --json`, `forge shepherd events`) instead of hand-polling. `forge shepherd <pr>` is the one-shot bounded pass for a single PR. It is a utility, **not** a workflow stage. It **never merges** (the human merges in the GitHub UI) and **never resolves review threads** (that stays with `/review`). `--auto-rebase` is opt-in and default OFF; kill-switches: `FORGE_SHEPHERD_DISABLE`, `forge gate disable rail.auto_shepherd`. **Startup/containment**: Forge automatically wakes the repo-singleton daemon after a supported session start, every successful push, and every successful non-dry-run ship; duplicate starts remain clean no-ops under the O_EXCL lease. Injected CI/test and kill-switch guards return before lock or process work. Forge prefers the session-reaped harness background shell and otherwise detaches from the stable common repository root, never a disposable worktree cwd. See [docs/reference/shepherd.md](docs/reference/shepherd.md).

## Automatic Change Classification

When the user requests work, **you MUST automatically classify** the change type:

### Critical (Full default workflow template)
**Triggers:** Security, authentication, payments, breaking changes, new architecture, data migrations
**Example:** "Add OAuth login", "Migrate database schema", "Implement payment gateway"
**Workflow:** plan → dev → validate → ship → review → verify (pre-merge gate before merge)

### Standard (default workflow without post-merge verify)
**Triggers:** Normal features, enhancements, new components
**Example:** "Add user profile page", "Create notification system"
**Workflow:** plan → dev → validate → ship → review (pre-merge gate before merge)

### Simple (3-stage workflow, skip plan)
**Triggers:** Bug fixes, UI tweaks, small changes, minor refactors
**Example:** "Fix button color", "Update validation message", "Adjust padding"
**Workflow:** dev → validate → ship

### Hotfix (Emergency 3-stage workflow)
**Triggers:** Production emergencies, critical bugs affecting users
**Example:** "Production payment processing down", "Security vulnerability fix"
**Workflow:** dev → validate → ship (immediate merge allowed)

### Docs (Documentation-only workflow)
**Triggers:** Documentation updates, README changes, comment improvements
**Example:** "Update README", "Add API documentation"
**Workflow:** verify → ship

### Refactor (5-stage workflow for safe cleanup)
**Triggers:** Code cleanup, performance optimization, technical debt reduction
**Example:** "Refactor auth service", "Extract utility functions"
**Workflow:** plan → dev → validate → ship (pre-merge gate before merge)

## Enforcement Philosophy

**Conversational, not blocking** - Offer solutions when prerequisites are missing:

❌ **Don't:** "ERROR: Research required for critical features"
✅ **Do:** "Before implementation, I should research OAuth best practices. I can:
   1. Auto-research now with parallel-deep-research (~5 min)
   2. Use your research if you have it
   3. Skip (not recommended for security features)

   What would you prefer?"

**Create accountability for skips:**

"Skipping tests creates technical debt. I'll:
 ✓ Allow this commit
 ✓ Create follow-up issue for tests
 ✓ Document in commit message as [tech-debt]

 Proceed?"

**Dynamic commands — no hardcoded examples:**

Command files (`.claude/commands/*.md` and agent equivalents) must never hardcode example output when a script generates that output dynamically. Reference the script and describe what it does — don't duplicate its output with fake data that becomes stale.

## TDD Development (`/dev` Command)

**Subagent-driven per-task implementation loop:**

1. **Read task list** → Pre-made task list from `/plan` Phase 3 at `docs/work/YYYY-MM-DD-<slug>/tasks.md`
2. **Dispatch implementer subagent per task** → Fresh context, complete task text, relevant design doc sections
3. **TDD inside implementer** → RED-GREEN-REFACTOR enforced by HARD-GATE:
   - RED: Write failing test first (must run test and show failing output)
   - GREEN: Implement minimal code to pass (must show passing output)
   - REFACTOR: Clean up while keeping tests green
4. **Spec compliance review** → Spec reviewer checks every task before quality review
5. **Code quality review** → Quality reviewer checks after spec compliance ✅
6. **Decision gate** → 7-dimension impact scoring when spec gap found; score routes to PROCEED/SPEC-REVIEWER/BLOCKED

**Example execution:**
```
/dev starts:
  ✓ Read task list: docs/work/2026-02-26-stripe-billing/tasks.md (8 tasks)
  ✓ Created decisions log: docs/work/2026-02-26-stripe-billing/decisions.md

Task 1: Types and interfaces
  ✓ Implementer: test written → failing → implementation → passing → committed
  ✓ Spec review: ✅
  ✓ Quality review: ✅
  Decision gates: 0

Task 2: Validation logic
  ✓ Implementer: test written → failing → implementation → passing
  ⚠️  Decision gate fired (score: 2/14 — PROCEED)
     Gap: Error message format not specified in design doc
     Choice: Use { code, message } object (conservative, documented)
  ✓ Spec review: ✅
  ✓ Quality review: ✅
```

**Flaky tests:** a test that changes result without the code changing gets
quarantined and an issue filed — never retried until green. Register it in
`test/QUARANTINE.md`. Reviewers reject a "re-run CI" as a fix.

## State Management (Single Source of Truth)

**Current implementation**: The Forge Kernel is the sole issue-state authority — every issue command reads and writes the kernel store, with no backend to select. Beads exists only as an inbound migration path: `forge migrate --from beads` imports an existing Beads store into the kernel once, and no Forge command depends on Beads at runtime. **Direction (D45)**: the Kernel owns issue/workflow/run authority outright; Beads is retired as a live feature. New authority work must follow [docs/work/2026-04-28-skeleton-pivot/forge-kernel-authority-control-plane.md](docs/work/2026-04-28-skeleton-pivot/forge-kernel-authority-control-plane.md) and [docs/reference/FORGE_KERNEL_STORAGE_MODEL.md](docs/reference/FORGE_KERNEL_STORAGE_MODEL.md).

```json
{
  "id": "9f2c41d7-3a8e-4b6f-9c21-5e7d0a184c3b",
  "type": "critical",
  "currentStage": "dev",
  "completedStages": ["plan"],
  "skippedStages": [],
  "workflowDecisions": {
    "classification": "critical",
    "reason": "Payment processing, PCI compliance required",
    "userOverride": false
  },
  "parallelTracks": [
    {
      "name": "API endpoints",
      "agent": "backend-architect",
      "status": "in_progress",
      "tddPhase": "GREEN"
    }
  ]
}
```

## Git hooks in consumer projects

Consumer setup still installs local git hooks in this release. Never bypass hooks
that remain installed. Forge repository contributors follow the USER block below:
CI is the gate for this repository.

## Build, Shell, and MCP

**Package manager**: Bun (preferred for performance).

```bash
bun install      # Install dependencies
bun run dev      # Start development
bun run build    # Production build
bun test         # Run tests
```

**GitHub CLI**: `gh auth login` for the PR workflow.

### Shell Model

| Platform | Shell used by Forge commands and scripts |
| --- | --- |
| Windows | Git Bash for helper-backed Forge stage flows |
| macOS/Linux | Default login shell |

On Windows, Forge runtime health enforces Git Bash for helper-backed stage flows. Native PowerShell is still used by some bootstrap paths, and WSL may be useful for adjacent development tasks. See [docs/reference/TOOLCHAIN.md](docs/reference/TOOLCHAIN.md#shell-model).

### MCP Servers (Optional)

If your agent supports MCP, these enhance research:

- **Context7** - up-to-date library documentation and API reference
- **grep.app** - search 1M+ GitHub repos for real-world code examples

See [.mcp.json.example](.mcp.json.example) for configuration (Claude Code: copy it to `.mcp.json`) and [docs/reference/TOOLCHAIN.md](docs/reference/TOOLCHAIN.md) for detailed setup.

## Documentation Index (Context Pointers)

**Detailed stage skill instructions** are located in:
- [skills/status/SKILL.md](skills/status/SKILL.md) - How to check current context (utility)
- [skills/plan/SKILL.md](skills/plan/SKILL.md) - How to plan features (3 phases: design intent + research + branch/worktree/tasks)
- [skills/dev/SKILL.md](skills/dev/SKILL.md) - How to implement with subagent-driven TDD and decision gate
- [skills/validate/SKILL.md](skills/validate/SKILL.md) - How to run validation (with HARD-GATE exit)
- [skills/ship/SKILL.md](skills/ship/SKILL.md) - How to create PRs
- [skills/review/SKILL.md](skills/review/SKILL.md) - How to address PR feedback (with HARD-GATE exit)
- [skills/shepherd/SKILL.md](skills/shepherd/SKILL.md) - How to run a bounded PR monitor pass (utility; never merges, never resolves threads)
- [skills/verify/SKILL.md](skills/verify/SKILL.md) - How to verify post-merge health

**Planning documents** (created by `/plan`, consumed by `/dev`):
- `docs/work/YYYY-MM-DD-<slug>/plan.md` - Design intent + technical research
- `docs/work/YYYY-MM-DD-<slug>/tasks.md` - Task list with TDD steps
- `docs/work/YYYY-MM-DD-<slug>/decisions.md` - Decisions log from /dev

**Comprehensive workflow guide:**
- This file (AGENTS.md) is the single source of truth for the complete workflow
- [docs/reference/TOOLCHAIN.md](docs/reference/TOOLCHAIN.md) - Tool setup and configuration
- [docs/reference/VALIDATION.md](docs/reference/VALIDATION.md) - Enforcement and validation details

**Forge v3 / Kernel Plan (active design):**
- [docs/work/2026-04-28-skeleton-pivot/forge-kernel-authority-control-plane.md](docs/work/2026-04-28-skeleton-pivot/forge-kernel-authority-control-plane.md) — canonical Forge Kernel authority reset plan for issue authority, local broker, team authority, adapters, storage, and gates
- [docs/work/2026-04-28-skeleton-pivot/locked-decisions.md](docs/work/2026-04-28-skeleton-pivot/locked-decisions.md) — D1–D45 decisions ledger with rationale + tradeoffs + anti-decisions; D44 supersedes Beads-only authority portions of earlier decisions, and D45 retires Beads as a live feature
- [docs/work/2026-04-28-skeleton-pivot/v3-redesign-strategy.md](docs/work/2026-04-28-skeleton-pivot/v3-redesign-strategy.md) — historical v3 strategy and background; do not use its legacy default-substrate language over D44
- See [docs/INDEX.md](docs/INDEX.md) for the full reading order across the v3 design folder

**Load these files when you need detailed instructions for a specific stage.**

## Descriptive Context Convention

Every stage transition should carry structured context so the next stage (or a new session) can resume without re-reading the full design doc. This convention is **advisory** — warnings are informational, not blocking.

### Required Fields at Each Stage Exit

| Stage Exit | Summary | Decisions | Artifacts | Next |
|------------|---------|-----------|-----------|------|
| /plan      | Design approach chosen | Key trade-offs resolved | Design doc, task list paths | First dev task focus |
| /dev       | Tasks completed, gate count | Spec gaps encountered | Changed files, test files | Validation priorities |
| /validate  | All checks pass/fail summary | Failures diagnosed | Scripts/commands run | Ship readiness |
| /ship      | PR created, checks pending | Template sections filled | PR URL, branch name | Review focus areas |
| /review    | All feedback addressed | Comment resolutions | Fixed files, commit SHAs | Doc update needs |
| pre-merge gate | Docs updated, CI green | N/A | Updated doc files | Merge instructions |

### Recording Stage Context

Record the stage-exit context as a kernel issue comment so the next stage (or a
fresh session) can resume from the issue record itself:

```bash
forge issue comment <issue-id> "stage: dev -> validate
summary: All 5 tasks done, 1 decision gate fired
decisions: Used streaming parser over DOM for memory efficiency
artifacts: lib/parser.js test/parser.test.js
next: Run lint first — streaming approach may trigger no-await rule"
```

Check-after-write verification (`gate.issue_verify`, default-on) confirms the
comment actually landed. Read context back with `forge show <issue-id>` (or
`forge recap <issue-id>` for the bounded orientation envelope).

### Field Definitions

- **Summary**: 1-2 sentence recap of what was accomplished in this stage. Example: `--summary "All 5 tasks done, 1 decision gate fired"`
- **Decisions**: Key choices made during this stage that affect downstream work. Example: `--decisions "Used streaming parser over DOM for memory efficiency"`
- **Artifacts**: File paths or URLs produced by this stage. Example: `--artifacts "lib/parser.js test/parser.test.js docs/work/2026-03-26-parser/plan.md"`
- **Next**: Guidance for the next stage on what to focus on. Example: `--next "Run lint first — streaming approach may trigger no-await rule"`

### Enforcement Level

This convention is **advisory only** — missing fields never block a stage
transition. The goal is to build good habits, not to create friction.

## Forge Issue Tracker

This project uses the **Forge Kernel** for issue tracking. Run `forge prime` to see full workflow context and commands.

### Quick Reference

```bash
forge ready           # Find available work
forge show <id>       # View issue details
forge claim <id>      # Claim work
forge close <id>      # Complete work
```

**More commands worth knowing** (run `forge <command> --help` for full usage):

```bash
forge remember <note>          # Persist a project-memory note to a file-backed store
forge recall [query]           # Retrieve project-memory notes back (the read half of remember)
forge insights                 # Detect recurring evidence patterns, suggest conservative follow-ups
forge upgrade                  # Preview and self-heal safe Forge upgrade readiness
forge gate <verb> <gate-id>    # Toggle a workflow gate, or record/query human-gate approval events
forge role <role> --use <skill> # Bind a role to a skill/ideology in .forge/config.yaml
forge merge --auto <pr> --expect-head <full-sha> --issue <issue-id>  # Opt-in guarded merge; exact head + owned issue required (OFF by default)
```

### Rules

- Use `forge` as the routine command surface for issue tracking and sync workflows — do NOT use TodoWrite, TaskCreate, or markdown TODO lists. Exception: `/plan` Phase 3 generates task lists at `docs/work/YYYY-MM-DD-<slug>/tasks.md` — these are approved artifacts consumed by `/dev`. New issue-authority work routes through the Forge Kernel design. Use `forge issue` subcommands (e.g. `forge issue dep`, `forge issue comment`) for operations beyond the shortcuts above. GitHub issues may be used for external/public tracking; CI may sync GitHub issue lifecycle to the issue store.
- Run `forge prime` for detailed command reference and session close protocol
- Use `forge remember` for persistent knowledge and `forge recall` to retrieve it back — do NOT use MEMORY.md files

### Kernel Tracking (nothing discussed goes missing)

**NON-NEGOTIABLE, default-on.** Anything raised in a session — a bug, an idea, a
design decision, a follow-up, a TODO, a risk noticed in passing — MUST become a
Forge Kernel issue **immediately** via `forge issue create`, before it can be
forgotten. Triage it (set a type, link its epic/parent) so it is discoverable.
When you defer scope, file the follow-up issue and reference it — never leave
work unfiled. The Kernel is the single source of truth; do NOT substitute
TodoWrite, markdown TODO lists, or memory notes for a filed issue.

This policy is canonicalized in `rules/kernel-tracking.md` (rendered to every
port: `.cursor/rules/kernel-tracking.mdc` for Cursor, this projection for
Claude/Codex/Hermes) and governed by the default-on `rail.kernel_tracking`
runtime rail. Turn it off only deliberately: `forge gate disable rail.kernel_tracking`.

## Project Learnings

- **Scope discipline**: Do ONLY what was explicitly asked. Answer a question → stop. Check something → stop. Never auto-continue to next steps or pending work unless told to.
- **Stage names**: The validation stage command is `/validate` — renamed in PR #50; do not use the old name.
- **Unused params**: Prefix with `_` (e.g., `_searchTerm`) — ESLint `no-unused-vars` enforced with `--max-warnings 0`.
- **CI fixtures**: `test-env/` fixture tests run in CI; keep them independent of local git push state.
- **Skill sync**: Canonical skills live in `skills/<name>/SKILL.md`; per-agent copies are generated from them. `.agents/skills` (Codex's repo-local discovery path) is committed so a fresh clone gets discovery without `forge setup` — PR CI checks parity with `skills/`; regenerate explicitly with the owning sync command. The other mirrors (`.claude/skills`, `.codex/skills`, `.cursor/skills`, `.hermes/skills`) are gitignored and regenerated at `forge setup`. Never hand-edit a generated mirror — edit the canonical `skills/` source.
- **Skill invocation metadata**: Canonical skill frontmatter may declare `invocation: model|user`; omission means `model`. Only `ship`, `review`, and `rollback` are currently user-invoked. Keep the field harness-neutral and preserve it byte-identically in every generated mirror.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
    git pull --rebase
    forge sync     # wraps the supported issue-store sync flow when the issue store is configured
    git push
    git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
- After fixing review feedback, always push the changes and resolve the related GitHub review threads via the GraphQL API before considering the work complete

<!-- FORGE:END -->
<!-- USER:START -->

## CI and Push Workflow

This repository installs no local git hooks. CI on the PR is the gate; checks judge
outcomes, not which local command produced a commit. GitHub protects `master`.
Use plain `git push` to publish. `forge push` remains an optional explicit local
validation command: it still runs branch protection, lint and tests; `--quick`
runs lint without tests. Neither command requires repository git hooks.

PR CI checks lint, tests, generated skill parity, the D20 audit artifact, lockfile
consistency and the conventional PR title. Update generated files explicitly with
`node scripts/sync-agent-skills.js` and `forge release regen-audit` when needed.

Existing machines must run `lefthook uninstall` (or remove the old shims in
`.git/hooks`) once after merging. Forge setup for consumer projects still installs
hooks in this release; removing that product behavior is separate rebuild work.
Never bypass hooks that still exist in consumer projects.

<!-- USER:END -->
