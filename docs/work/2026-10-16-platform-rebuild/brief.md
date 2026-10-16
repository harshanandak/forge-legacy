# Platform rebuild — inventory brief (shared by all lanes)

## Decision (owner, 2026-10-16)

Forge (npm package `forge-workflow`, CLI `forge`) is rebuilt as a **new project**, contract-first:

1. Skeleton first: public schemas, the outside-author block contract, the agent-first config API, and one resolve/bind/admit/invoke runtime path.
2. Existing working engines (Kernel, Contracts, Memory, Flow) are **copied over one block at a time with their tests**, reshaped behind the new contracts. Nothing is rewritten that already works.
3. Breaking changes are allowed (fresh experimental 0.1.0). The old repo is frozen to fixes and is used to track and build the new one.
4. Ships as the same `forge-workflow` npm package (the npm name `forge` belongs to an unrelated 2022 package — verified with npm view, 2026-10-16). Safe migration of the owner's five personal projects remains a release blocker.

This replaces plan bottom-line point 5 ("facade/API refactoring, not a rewrite"). All 47 plan decisions are at their defaults.

## Build shape (owner, 2026-10-16)

The rebuild runs as **multiple parallel lanes, each in its own git worktree**, built properly: every lane has a clear owner block, a contract it builds against, its own tests, and a merge point. The inventory must say which modules can be ported in parallel lanes and which must wait on another lane (shared files, shared contracts).

## Build on what is already decided

Boundaries, architecture and capabilities were worked out at length in the plan of record (§3: six functional layers, the block contract, the 37 capability families, the config API, composition/runtime, harness connectivity, Kernel authority) and in the locked decisions ledger (`docs/work/2026-04-28-skeleton-pivot/locked-decisions.md`, D1–D45). The rebuild evaluates and reuses that work; it does not reinvent it. Changes need a stated reason tied to the new-project approach.

## The opinionated flow stays on top, never inside (owner, 2026-10-16)

Forge's own workflow (plan → dev → validate → ship → review → verify, TDD gates, stage names, shepherd, the delivery reference solution) is **one solution composed from the blocks**. It must not take over the barebones block structure: no core block, schema, contract or API may assume stages, stage names, TDD, PRs or a particular workflow. Anyone must be able to build a different solution on the same blocks without patching or disabling ours. Flag every place the code or plan lets the opinionated flow leak into core.

## No baggage (owner, 2026-10-16)

Drop the wrong things, unlearn the mistakes, move forward cleanly. **The default disposition is DROP**: a module comes over only if 0.1.0 needs it and it works. Bring over a hard-won fix as the behaviour plus its regression test, not as the old code shape. Legacy names, compatibility shims, retired-feature remnants, workarounds for problems the new design removes, and ceremony that capable agents don't need all stay behind. Every past mistake gets a named rule or design choice in the new project that stops it recurring.

## Design for agents that keep getting smarter (owner, 2026-10-16)

Judge everything by where agents are heading, not where they were. Scaffolding that exists only to compensate for weaker agents — step-by-step ceremony, mandatory stage ladders, prompts that do the agent's thinking, guard rails against mistakes capable agents no longer make — is baggage and gets dropped or made optional. What stays valuable as agents improve: clear contracts and schemas, single authority for state, evidence and verification of outcomes, trust and permission boundaries, cost and safety limits, and structure that lets an agent discover and compose capabilities itself. Gates judge outcomes, not process.

## No hand-written command set; one naming system (owner, 2026-10-16)

We can ditch the hand-written commands. Blocks declare their operations once (name, input/output schema, effects, trust); the CLI and MCP surfaces are generated from that catalog, so a new feature or outside plugin appears in both without touching core. Names follow one convention every block and plugin uses. Block names themselves are open: "Kernel" and the other internal names must earn their place against plain names a person or agent would guess.

## Language and toolchain (owner, 2026-10-16)

TypeScript everywhere (see `language-decision.md`). Bun-first toolchain: `bun check` (type check), `bun lint` / `bun fmt` from day one — build for where the tools are going, not for today's gaps (they are merged and will reach stable; use the Bun build that has them until then, no interim oxlint/ESLint layer), `bun test`, Bun as package manager. Track new Bun releases rather than pinning to today's gaps. Only what Bun cannot do stays outside it (today: `tsc` to emit the published `.d.ts`). The published package still runs on Node 24/26 for users.

**Our toolchain is not the user's.** Bun is how *we* build Forge. Forge must never assume a user's project uses Bun, TypeScript, ESLint, Lefthook or any one test runner or package manager (npm, pnpm, yarn, bun; vitest, jest, node:test, pytest, cargo; any lint or none; any language). It runs the project's own declared commands (package.json scripts or config), detects what exists, and says plainly when something is missing instead of blocking. Toolchain-specific behaviour lives in replaceable blocks/adapters, never in core. Forge installs and runs without Bun (npm/npx on Node 24+). Evidence: hardcoded `bun test`, required Lefthook and an ESLint-only lint gate were among the most damaging failures in the consumer threads (threads-consumers / threads-*.md).

## The user's picks win (owner, 2026-10-16)

Forge is open to whatever the user picks or starts: their tools, workflow, hooks, tracker, CI, harness, blocks, naming and conventions.

**No built-in defaults.** A fresh install activates nothing opinionated: no workflow, gates, hooks or rails. The user can import a config template (ours — the delivery reference solution — is one among others, alongside their own or community ones) or write their own config. Templates are plain config, inspectable and editable after import.

**Everything is an option.** Three ways in, freely mixed and switchable at any time: (1) do nothing and let the core adapt (below); (2) configure on the go — change or add one thing at a time through the config API as the work happens; (3) use the default config or another template in one step. None is forced, none is applied without the user (or their agent) choosing it.

**When nothing is configured, the core adapts to how the user already works.** It reads the project — package manager, scripts, test runner, linter, hooks, CI, tracker, branch and PR habits, decision records and conventions — and how the user makes decisions there, and derives an *effective config* that mirrors that practice rather than imposing ours. Agents then use that config and the available API tools in whatever harness they run in. The derived config is always visible and explainable (what was detected, from where), never enforces new gates on its own, can be accepted, edited or saved as the project's config, and any explicit user choice overrides it. It keeps adapting as the project's practice changes. Forge never overrides, silently replaces or fights a user's explicit choice; it detects it, works with it, and if it cannot, says so and offers an adapter or a block. Every place in the design that hardcodes one way of doing something is a defect unless it is core authority (contracts, single state owner, trust).

## Dependencies on well-run ecosystems (owner, 2026-10-16)

A good dependency is acceptable only when it adds real value we would otherwise have to build and maintain, and its project keeps adding features and is developed well; otherwise it is not needed — the owner names TanStack as one (Intent for skills in npm packages; CLI and Config to be judged). The rule is not "zero dependencies" but "every dependency behind one adapter, so it can be swapped": prefer depending on a strong, active ecosystem over rebuilding what it does. Fit still matters — a tool that conflicts with the Bun-first build or forces a user's toolchain stays out of that role.

## Harness versions (owner, 2026-10-16)

Target the latest line of each harness and build for where it is going. OpenCode: the latest 2.x line only (2.0.31 surveyed) — it has the most tooling and features; no OpenCode 1.x plugin. Same rule for others: no per-version shims for old lines unless a migrating project needs one.

## Sources

- Plan of record: `docs/work/2026-09-30-forge-final-plan/platform/platform-plan-final.md`.
  Read §1 (lines 1–132), §2 (190–255), §3.1 (328–434), §3.3 (563–742), §3.4 (743–977), §5 (1748–1782). Other sections as your lane needs.
- Code: read ONLY from the read-only worktree `origin/master` (detached at origin/master `8ceb8c4a`). Use `git -C <worktree> log --oneline -- <path>` to find fix history.

## Rules

- Read-only. Write only your own output file in `docs/work/2026-10-16-platform-rebuild/`. No commits, no installs, no network.
- Mark every claim: `read` (file:line), `ran` (command), or `inferred`. Absence claims need the search you ran.
- If you inspected something and found nothing notable, say so and name what you inspected.

## Output shape

One table per area, one row per module (file or tight directory):

| Module | Lines | Covering tests (count, names) | What it does | Disposition | Why (plan §) | Depends on | Hard-won fixes to keep |

Disposition is one of:
- **PORT** — copy as is behind the new contract;
- **ADAPT** — copy the logic, reshape its API to the new contract;
- **REWRITE** — the logic itself must change;
- **DROP** — retired by the plan or not needed.

"Hard-won fixes" = bug fixes with a regression test (cite the commit and the test). These are what a careless port loses.

Then: copy order (dependency order), top risks, and an agent-day estimate for your lane with the method shown.
