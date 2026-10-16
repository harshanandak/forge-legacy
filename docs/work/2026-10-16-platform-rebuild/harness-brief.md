# Harness capability survey — shared brief

Read `brief.md` in this folder first (rebuild rules: blocks + generated CLI/MCP, our workflow is one template on top, no built-in defaults / adaptive core, the user's picks win, design for smarter agents, no baggage).

## Question (owner, 2026-10-16)

"Think about how harnesses work, and think about what there is no need to build and what is needed to build." Forge must not rebuild what agent harnesses already do natively; it should build only what they don't, and connect to each one natively.

## Per harness, find out (current versions, primary sources)

For each assigned harness record, with the version and a source URL + date for every row:

| Capability | Native? | How (file/format/API) | Limits |

Capabilities to cover: instruction files (AGENTS.md / own file, nesting), skills (format, discovery path, Agent Skills spec support), slash/custom commands, hooks (events, blocking ability, config location), subagents / parallel agents, background tasks, MCP client (stdio/http, tool limits, tool-name rules), plugins/extensions (packaging, marketplace), memory / persistent context, plan mode / approvals, permissions and sandboxing, git worktree support, session resume/handoff, headless/CLI mode (for automation), settings/config files and precedence, model routing.

Then per harness: **what Forge should NOT build** (the harness does it well) and **what Forge must supply** (gaps that matter for Forge: shared issue/run authority across harnesses, contracts/schemas, evidence, trust, cross-harness handoff, config projection).

## Rules

Primary sources only (official docs, changelogs, release notes, official repos). Mark each claim read (URL + date) / ran (command — local CLIs may be installed; read-only checks like `--version`, `--help` only) / inferred. If a capability's status is unclear, say so — do not guess. Never print secrets. Do not open a browser; fetch docs as text. Read-only: write only your output file. No commits.

Also skim `threads-foundation-harness.md` in this folder for what went wrong with harness integration before, and §3.5 of the plan (`../2026-09-30-forge-final-plan/platform/platform-plan-final.md`, lines 978–1124).

## Final reply

At most 150 words: per harness, the top 3 "don't build" and top 3 "must supply", and the output path.
