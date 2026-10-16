# Harness capability survey: Claude Code, Cursor, T3 Code

Lane: harness-brief.md (owner question, 2026-10-16): what do harnesses already do natively, so Forge does not rebuild it, and what must Forge supply. Read-only research. All pages fetched 2026-10-16.

## Versions and evidence legend

| Item | Value | Evidence |
| --- | --- | --- |
| Claude Code installed | 2.1.301 | ran `claude --version` |
| Claude Code latest | 2.1.301, released 2026-10-15 | read CC-CL |
| Cursor IDE installed | 3.7.42 | ran `cursor --version` |
| Cursor release notes top entry | "3.24" (desktop notes) | read CU-RN. **Unreconciled** with 3.7.42; do not state a Cursor IDE version as current. |
| Cursor CLI installed | 2026.09.26-dd393fe | ran `agent.cmd --version` |
| Cursor CLI latest | v2026.10.08 | read CU-CLI-CL (installed build is two releases behind) |
| T3 Code | public repo, MIT; latest stable v0.1.0 (2026-10-15), nightly 0.1.1-nightly.20261016.3203 | ran `gh api repos/pingdotgg/t3code/releases` |
| T3 npm CLI installed | t3 v0.0.30 | ran `t3 --version`. The version of the desktop app hosting this session is **not determined**. |

Marks: **read** (source key, fetched 2026-10-16), **ran** (read-only command), **inferred** (my reasoning from reads). "Not documented" means the page I read is silent. It is not proof of absence unless stated.

### Sources

| Key | URL |
| --- | --- |
| CC-MEM | https://code.claude.com/docs/en/memory.md |
| CC-SKILLS | https://code.claude.com/docs/en/skills.md |
| CC-HOOKS | https://code.claude.com/docs/en/hooks.md (first 100k of 270k chars read) |
| CC-SUB | https://code.claude.com/docs/en/sub-agents.md |
| CC-MCP | https://code.claude.com/docs/en/mcp.md (first 100k of 123k chars read) |
| CC-HEAD | https://code.claude.com/docs/en/headless.md |
| CC-PLUG | https://code.claude.com/docs/en/plugins/overview.md |
| CC-MAN | https://code.claude.com/docs/en/plugins/manifest-reference.md |
| CC-MKT | https://code.claude.com/docs/en/plugins/marketplace-reference.md |
| CC-SET | https://code.claude.com/docs/en/settings.md |
| CC-PERM | https://code.claude.com/docs/en/permission-modes.md |
| CC-SBX | https://code.claude.com/docs/en/sandboxing.md |
| CC-WT | https://code.claude.com/docs/en/worktrees.md |
| CC-SESS | https://code.claude.com/docs/en/sessions.md |
| CC-TEAMS | https://code.claude.com/docs/en/agent-teams.md |
| CC-AV | https://code.claude.com/docs/en/agent-view.md |
| CC-CMD | https://code.claude.com/docs/en/commands.md |
| CC-CL | https://code.claude.com/docs/en/changelog.md (newest four entries read) |
| CU-RULES | https://cursor.com/docs/rules (.md variant 404s via the fetch tool, 200 via curl) |
| CU-SKILLS | https://cursor.com/docs/skills.md |
| CU-HOOKS | https://cursor.com/docs/hooks.md |
| CU-3P-HOOKS | https://cursor.com/docs/reference/third-party-hooks.md |
| CU-SUB | https://cursor.com/docs/subagents.md |
| CU-MCP | https://cursor.com/docs/mcp.md |
| CU-PLUG | https://cursor.com/docs/plugins.md |
| CU-CLI | https://cursor.com/docs/cli/headless.md, /cli/reference/parameters.md, /cli/reference/permissions.md, /cli/reference/configuration.md, /cli/acp.md |
| CU-CLI-CL | https://cursor.com/docs/cli/changelog.md |
| CU-RN | https://cursor.com/docs/release-notes.md |
| CU-WT | https://cursor.com/docs/configuration/worktrees.md |
| CU-PLAN | https://cursor.com/docs/agent/plan-mode.md |
| CU-RUN | https://cursor.com/docs/agent/security/run-modes.md |
| CU-CLOUD | https://cursor.com/docs/cloud-agent.md, /cloud-agent/automations.md |
| CU-SDK | https://cursor.com/docs/sdk/typescript.md |
| CU-ROUTER | https://cursor.com/docs/cursor-router.md |
| T3-README | https://github.com/pingdotgg/t3code (README.md, docs/ tree at main, 2026-10-16) |
| T3-ORCH | docs/orchestration-v2/orchestrator-mcp-server.md and provider-capability-system.md in that repo |
| T3-USER | docs/user/*.md in that repo: outside-agents, permission-modes, project-settings, providers-claude, providers-pi, providers-opencode, cursor, portable-handoffs, source-control |
| T3-INT | docs/internals/providers.md and overview.md in that repo |
| T3-LIVE | `orchestrator_capabilities` called in this session (ran) and this session's own T3 tool catalog |

---

## 1. Claude Code (2.1.301)

| Capability | Native? | How (file / format / API) | Limits | Evidence |
| --- | --- | --- | --- | --- |
| Instruction files | Yes | `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.local.md`, user `~/.claude/CLAUDE.md`, managed-policy CLAUDE.md. `@path` imports (relative to the importing file, max 4 hops). `.claude/rules/*.md` with `paths` frontmatter loads on demand. `claudeMdExcludes` setting. **AGENTS.md read natively from v2.1.277**, but only when no CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md exists in cwd or any parent (default `claude-md-or-agents-md`). Mode `claude-md-and-agents-md` is set under `pluginConfigs["cc-plugin-agents-md@builtin"]` (older ID `agents-md@builtin`) and is **ignored in project and local settings**. A subdirectory's AGENTS.md loads when Claude Reads a file there. | Target under 200 lines per CLAUDE.md. A `CLAUDE.local.md` silently turns AGENTS.md off. `InstructionsLoaded` hooks do not fire for AGENTS.md read via the setting. Before v2.1.281 some sessions (Bedrock, telemetry off) read CLAUDE.md only. External `@` imports prompt for approval. | read CC-MEM |
| Skills | Yes | `SKILL.md` per folder. Frontmatter: name, description, when_to_use, argument-hint, arguments, disable-model-invocation, user-invocable, allowed-tools, disallowed-tools, model, effort, context (fork), agent, background, hooks, paths, shell, metadata, license, compatibility. Paths: enterprise, `~/.claude/skills/`, project `.claude/skills/`, nested `<subdir>/.claude/skills/`, `--add-dir`, plugin `skills/` (as `/plugin:skill`). Follows the Agent Skills open standard (agentskills.io) with Claude-specific extensions. Live reload of SKILL.md edits. | **`.agents/skills` is not mentioned on the skills page** (not documented). Unknown frontmatter fields are ignored silently. Description plus when_to_use truncated at 1,536 chars in the listing. Keep SKILL.md under 500 lines. Names with hidden or direction-changing characters are not offered (2.1.299). | read CC-SKILLS, CC-CL |
| Slash / custom commands | Yes, merged into skills | `.claude/commands/x.md` and a skill `x` both create `/x`. Plugin `commands` field (flat md or object map). Up to six chained skills in one message. | Plugin docs say prefer skills for new plugins. | read CC-SKILLS, CC-MAN, CC-CMD |
| Hooks | Yes, richest of the three | **33 events**: SessionStart, Setup, UserPromptSubmit, UserPromptExpansion, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, PostToolBatch, Notification, MessageDisplay, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, StopFailure, TeammateIdle, InstructionsLoaded, ConfigChange, CwdChanged, DirectoryAdded, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, PreModelSwitch, PostModelSwitch, Elicitation, ElicitationResult, SessionEnd. 5 handler types: command, http, mcp_tool, prompt, agent (experimental). Config: `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, managed settings, plugin `hooks/hooks.json`, skill and subagent frontmatter. | Exit 2 blocks on 16 events (PreToolUse, UserPromptSubmit, UserPromptExpansion, Stop, SubagentStop, TeammateIdle, TaskCreated, TaskCompleted, ConfigChange, PostToolBatch, PreCompact, PreModelSwitch, Elicitation, ElicitationResult, WorktreeCreate, WorktreeRemove). **Exit 1 is non-blocking.** PreToolUse JSON `permissionDecision` is allow, deny, ask or defer. **`onFailure: "block"` (fail-closed) needs v2.1.295+; default is continue.** Timeouts: 600 s command/http/mcp_tool, 30 s prompt, 60 s agent. SessionEnd shares a 1.5 s budget. Windows exec form needs a real `.exe` (`.cmd` shims cannot be spawned). `updatedInput` is validated like Claude's own input (2.1.300). Plugin hooks refuse values nested deeper than 28,000 levels (2.1.299). | read CC-HOOKS, CC-CL |
| Subagents / parallel agents | Yes | Markdown + YAML in `.claude/agents/`, `~/.claude/agents/`, plugin `agents/`, `--agents` JSON. Fields: name, description, tools, disallowedTools, model, permissionMode, maxTurns, autoCompactWindow, skills, mcpServers, hooks, memory (user/project/local), background, omitClaudeMd, effort, isolation (worktree), color, initialPrompt. Built-ins: Explore, Plan, general-purpose, claude, statusline-setup, claude-code-guide. | Nesting allowed, default depth 3 below main (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). Concurrency default 20. **Plugin subagents ignore hooks, mcpServers and permissionMode.** Subagents inherit main-conversation tools including MCP; background subagents get a smaller built-in set. | read CC-SUB |
| Multi-session coordination | Experimental | Agent teams: lead, teammates, shared task list, mailbox JSON at `~/.claude/teams/{team}/inboxes/`. `TeammateIdle`/`TaskCreated`/`TaskCompleted` hooks gate work. Cross-session messaging is a separate page (not read). | Needs `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. No session resume of in-process teammates, one team per session, no nested teams. The team config is runtime state; do not pre-author it. | read CC-TEAMS |
| Background tasks | Yes | Agent view (`claude agents`, `--bg`, `attach`, `logs`, `stop`, `rm`), a supervisor process, edit isolation into `.claude/worktrees/`. Background Bash and Monitor. `claude -p` waits for background work (10 min idle cap). | Agent view is a **research preview**. Local only; stops on machine shutdown. Exit force-kills background commands 1.5 s after stop (2.1.300). | read CC-AV, CC-HEAD, CC-CL |
| MCP client | Yes | Transports http (recommended), stdio, sse (deprecated), ws. Scopes: local (`~/.claude.json`), project (`.mcp.json`), user; precedence local > project > user > plugin > claude.ai connectors. `${VAR}` and `${VAR:-default}` expansion in command/args/env/url/headers. OAuth. `list_changed` handled. Channels (`claude/channel` capability). `claude mcp serve` exposes Claude's own tools. | Warn at 10k output tokens, cap 25k (`MAX_MCP_OUTPUT_TOKENS`). Over 16 MiB aborts. Tool-description and instruction cap 4,096 chars (was 2,048; first-party servers uncut, 2.1.299). Plugin servers are named `mcp__plugin_<plugin>_<server>__<tool>`. **Allow rules match only the named server (`mcp__a` no longer matches `a__b`), and agent `tools:` lists need `mcp__<whole name>__*` (2.1.299).** Cloud and Remote Control connectors negotiate MCP protocol 2026-07-28 by default (2.1.299); I did not read what local stdio does. Project `.mcp.json` servers prompt for approval interactively, but **under `-p` they connect without a prompt unless `--bare`**. Tool-search mechanics were not read. | read CC-MCP, CC-HEAD, CC-CL |
| Plugins | Yes | Directory with optional `.claude-plugin/plugin.json`. Components: skills, commands, agents, hooks, MCP, LSP, output styles, workflows, themes, monitors, `bin/`, `settings.json`, plus "mods" (JS hook modules). Namespacing `plugin:component`. Marketplaces via `.claude-plugin/marketplace.json`. Plugin source types: relative, github, url, git-subdir, **npm** (fetched with npm, install scripts never run), archive (sha256), command. `ref`/`sha` pinning. `userConfig` prompts (sensitive values go to the secure store). Dependencies. Scopes user/project/local. Team rollout via `extraKnownMarketplaces`, `enabledPlugins`. `claude plugin validate`, `claude plugin test`/`eval`. | **npm as a marketplace source is not implemented** ("NPM marketplace sources not yet implemented"); npm works as a per-plugin source. Plugin `settings` honours only `agent` and `subagentStatusLine`. Plugin names starting `claude-`, `anthropic-`, `cc-plugin-` are errors. A plugin-root `CLAUDE.md` is not loaded as context. | read CC-PLUG, CC-MAN, CC-MKT |
| Memory | Yes | Auto memory: Claude writes notes per repo, shared across worktrees. First 200 lines or 25 KB of MEMORY.md loaded each session. Subagent `memory` field has its own dirs. | Treated as context, not enforced config. | read CC-MEM, CC-SUB |
| Plan mode / approvals | Yes | Modes: default, acceptEdits, plan, auto (classifier), dontAsk, bypassPermissions. Auto is the built-in start mode for interactive terminal and VS Code from v2.1.283. PermissionRequest hooks can allow or deny. | Classifier is a second model, not a boundary. In plan mode edits are blocked until approval, except with bypass available in interactive terminals. | read CC-PERM |
| Permissions / sandbox | Yes | Allow/deny rules (e.g. `Bash(git diff *)`). Sandbox covers Bash, PowerShell and Monitor commands only. | **Native Windows runs commands unsandboxed** (macOS, Linux and WSL2 only). File tools, MCP servers and hooks run outside the sandbox. | read CC-SBX |
| Git worktrees | Yes | `--worktree <name>` creates `.claude/worktrees/<name>` on branch `worktree-<name>`. `EnterWorktree` tool. `.worktreeinclude` for gitignored files. `worktree.baseRef` fresh or head. WorktreeCreate/WorktreeRemove hooks **replace the git logic** (non-git VCS). Isolation checks block edits, cwd and git redirects into the main checkout. | Hook `cwd` follows the worktree but `${CLAUDE_PROJECT_DIR}` stays at the session root. Shell writes (`cp`, redirects) into the main checkout are not tracked by the checks. Desktop-app worktree sessions read config from the main checkout. | read CC-WT |
| Session resume / handoff | Yes | Transcripts at `~/.claude/projects/<project>/<id>.jsonl`. `--continue`, `--resume <id\|name\|path>`, `--fork-session`, `/branch`, `/resume`, `claude attach`. Restores history, model, agent, permission mode (not bypass), worktree. `-p --resume` for scripted follow-ups. | **Transcript entry format is internal and changes between versions** (docs say do not parse). Not restored: `--mcp-config`, `--settings`, `--plugin-dir`, `--add-dir` (pass again). Retention 30 days (`cleanupPeriodDays`). | read CC-SESS |
| Headless / CLI | Yes | `claude -p`; `--output-format text\|json\|stream-json`; `--json-schema` (structured_output); `--allowedTools`; `--permission-mode`; `--permission-prompts none` (2.1.259+); `--max-turns`; `--max-budget-usd`; `--bare` (skip hooks, skills, plugins, MCP, memory, CLAUDE.md; will become default for -p); `--mcp-config`; `--settings`; `--plugin-dir`; `--agents`. `system/init` reports `plugins`, `plugin_errors`, `mcp_servers`, `mcp_server_errors`, `capabilities[]` for feature detection. Result carries `total_cost_usd` (client estimate). | Exit 0 success; non-zero on failure; SIGTERM gives 143. Piped stdin capped at 10 MB. Without `--bare`, `-p` runs project hooks and `.mcp.json` servers in an untrusted folder. | read CC-HEAD |
| Settings and precedence | Yes | Managed (file, MDM, or server-managed) > `--settings` > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`. `--setting-sources` restricts. | Managed-settings file paths per OS not read. | read CC-SET |
| Model routing | Partial | Per-subagent `model`; resolution order: invocation parameter, definition frontmatter, `CLAUDE_CODE_SUBAGENT_MODEL`, main model; `_FORCE` overrides frontmatter. Workflow agents: `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL`. | Full model-config page not read. | read CC-SUB, CC-CL |

### Claude Code: what Forge should NOT build

1. Skill discovery, loading and invocation control. `SKILL.md` plus `.claude/skills` or plugin `skills/` is native, with live reload and the open-standard format.
2. A hook event bus, event taxonomy or hook runner. 33 native events with typed blocking exist; Forge supplies handlers and policy only.
3. Subagent spawning, worktree isolation, plan or permission modes, and headless execution (`-p`, `--json-schema`, `--bare`, `--max-budget-usd`). Never build a session runner.
4. Plugin packaging, install, update, pinning and team rollout. Use the plugin directory, `marketplace.json` and the `npm` per-plugin source.
5. MCP client, OAuth and tool-output handling, and AGENTS.md ingestion (native since 2.1.277).

### Claude Code: what Forge must supply

1. **One state authority across harnesses** (issues, runs, verdicts). Claude's memory, task list and transcripts are per-harness and internal-format.
2. **Outcome evidence and gates** that survive hook fail-open. Exit 1 does not block and the default is fail-open, so a gate must either set `onFailure: "block"` (needs 2.1.295+) or be verified by the owning authority afterwards, not trusted from hook activity.
3. **Config projection from one catalog** to `.claude/settings.json` hooks, the plugin tree, `.mcp.json`, and the native AGENTS.md versus CLAUDE.md choice. It must feature-detect the installed version and respect `CLAUDE.local.md` and `.claude/CLAUDE.md` suppression. `system/init` `capabilities`, `plugin_errors` and `mcp_server_errors` are the proof surface.
4. **Cross-harness handoff**: write the handoff into Forge's record, not into Claude transcripts.
5. **Windows gap**: no native Claude shell sandbox, so trust boundaries must live in Forge-owned APIs.

---

## 2. Cursor (IDE 3.7.42 local, CLI 2026.09.26 local; CLI latest v2026.10.08)

| Capability | Native? | How (file / format / API) | Limits | Evidence |
| --- | --- | --- | --- | --- |
| Instruction files | Yes | `.cursor/rules/*.mdc` with frontmatter `description`, `globs`, `alwaysApply` (4 types: Always, Intelligent, Specific Files, Manual). **AGENTS.md at root and in subdirectories**, nested files combine with parents, more specific wins. User Rules (settings UI), Team Rules (dashboard, Team/Enterprise). Precedence Team, then Project, then User. | `.md` files in `.cursor/rules` are **ignored** (must be `.mdc`). Keep rules under 500 lines. CLAUDE.md is not mentioned on the rules page. | read CU-RULES |
| Skills | Yes | `SKILL.md` folders. Paths: `.agents/skills/`, `.cursor/skills/`, `~/.agents/skills/`, `~/.cursor/skills/`, **plus compat reads of `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, `~/.codex/skills/`**. Recursive; nested project dirs scope a skill to that directory. Frontmatter: name (must match folder), description, paths, disable-model-invocation, icon, color, metadata (legacy `globs`). Agent Skills open standard. Built-in skills (e.g. `/create-rule`, `/create-hook`, `/migrate-to-skills`, `/loop`, `/review`). | `~/.agents/skills` and unsynced user skills are **not** copied to cloud agents or self-hosted workers. `/skills` warns on spec-limit violations (CLI 2026.10.08). | read CU-SKILLS, CU-CLI-CL |
| Slash / custom commands | Partly | Skills invoked with `/`. "Commands" exist as a Cursor-Plugin component. `/migrate-to-skills` converts slash commands and dynamic rules to skills. | A standalone `.cursor/commands` page was not read, so its status is **unclear**. Inferred: skills are the current direction. | read CU-SKILLS, CU-PLUG |
| Hooks | Yes | `hooks.json` (`version: 1`) at `~/.cursor/`, `<project>/.cursor/`, team (dashboard), enterprise (`/Library/Application Support/Cursor/`, `/etc/cursor/`, `C:\ProgramData\Cursor\`). **21 events**: sessionStart, sessionEnd, preToolUse, postToolUse, postToolUseFailure, subagentStart, subagentStop, beforeShellExecution, afterShellExecution, beforeMCPExecution, afterMCPExecution, beforeReadFile, afterFileEdit, beforeSubmitPrompt, afterAgentResponse, afterAgentThought, preCompact, stop, beforeTabFileRead, afterTabFileEdit, workspaceOpen. Types: command, prompt. Options: command, timeout, matcher (regex), loop_limit (default 5), failClosed. Env: `CURSOR_PROJECT_DIR`, alias `CLAUDE_PROJECT_DIR`. **Also loads Claude Code hooks** from `.claude/settings*.json` and `~/.claude/settings.json` (setting "Include Third-Party Plugins, Skills, and Other Configs", default on), mapping names. | Permission hooks: beforeShellExecution, beforeMCPExecution, beforeReadFile, beforeTabFileRead, subagentStart, preToolUse. Exit 2 = deny; invalid JSON or schema mismatch blocks; **other non-zero exits fail open** unless `failClosed: true`. **preToolUse accepts `permission: "ask"` in the schema but it is not enforced.** **sessionStart is fire-and-forget** and cannot block. Merge: any deny beats ask beats allow across sources. **Cloud agents run command-based project/team/enterprise hooks only** (no prompt hooks, no user hooks, no sessionStart/End, no MCP hooks, no Tab hooks, no workspaceOpen). | read CU-HOOKS, CU-3P-HOOKS |
| Subagents / parallel agents | Yes | Markdown + YAML in `.cursor/agents/`, `.claude/agents/`, `.codex/agents/` (project) and `~/.cursor|.claude|.codex/agents/` (user). Frontmatter: name, description, model (inherit or id, with param brackets like `[effort=high]`), readonly, is_background. Built-ins: explore, browser (hook matchers also name shell, generalPurpose). Parallel, background (output under `~/.cursor/subagents/`), resume by agent ID, hand-off to a cloud subagent. | **Nesting: one level only** (a subagent launched by a subagent cannot launch more; since Cursor 2.5). No `isolation`, `tools` or `hooks` frontmatter field is documented. Token cost scales per subagent. | read CU-SUB |
| Background / cloud agents | Yes | Cloud agents in isolated VMs, triggered from desktop, web, iOS, Slack, GitHub/Bitbucket `@cursor`, Linear, API. `.cursor/environment.json`. Cloud Agents REST API (create agent, runs, stream, cancel, artifacts, environments, secrets, workers/pools, webhooks). Self-hosted workers (`agent worker --pool`). Automations (schedule/Slack/GitHub triggers) with persistent per-automation memories. Projects with a coordinator (Agents Window). | Hosted, needs repo provider connection. Cloud has a different hook surface and skill sync rules (above). | read CU-CLOUD, CU-CLI, CU-RN |
| MCP client | Yes | `.cursor/mcp.json` (project) and `~/.cursor/mcp.json` (user). Transports stdio, SSE, Streamable HTTP. Interpolation `${env:NAME}`, `${userHome}`, `${workspaceFolder}`, `${workspaceFolderBasename}` in command/args/env/url/headers. `envFile` for stdio only. Static OAuth client credentials. Supports prompts, resources, roots, elicitation and MCP Apps. Plugins use `${CURSOR_PLUGIN_ROOT}` (the standard `${PLUGIN_ROOT}` is not expanded). CLI `--approve-mcps`. | **Tool-count cap and tool-name rules are not stated on the page I read.** Do not assume Claude's `mcp__server__tool` form: hook matchers use `MCP:<tool_name>`. Cloud agents: MCP hooks unavailable. | read CU-MCP, CU-PLUG, CU-HOOKS |
| Plugins / extensions | Yes | Two formats: **Agent Plugins** (open standard, root `plugin.json`, skills + MCP) and **Cursor Plugins** (`.cursor-plugin/plugin.json`, adds rules, agents, commands, hooks, variables). Distribution as Git repos through the Cursor Marketplace (every plugin manually reviewed) and team marketplaces (Teams: 1, Enterprise: unlimited). CLI `--plugin-dir`. The `workspaceOpen` hook can return extra plugin paths. | Marketplace listing is gated by Cursor review. | read CU-PLUG, CU-CLI, CU-HOOKS |
| Memory / persistent context | Partial | Rules, AGENTS.md and skills. Automation **memories** (agent read/write notes across runs of one automation). | No general first-party project-memory doc found in the pages I read. Status of an IDE "Memories" feature is **unclear**. | read CU-CLOUD |
| Plan mode / approvals | Yes | Plan Mode (Shift+Tab), editable plan, "Save to workspace". CLI `--plan` / `--mode plan\|ask`. Run modes: Auto-review, Allowlist, Run Everything. | Plans default to the home directory. Auto-review is documented as **not a security boundary**. | read CU-PLAN, CU-RUN, CU-CLI |
| Permissions / sandbox | Yes | CLI: `permissions.allow/deny` tokens `Shell(cmd)`, `Read(glob)`, `Write(glob)`, `WebFetch(domain)` in `~/.cursor/cli-config.json` and `<project>/.cursor/cli.json`. IDE: `.cursor/permissions.json` and `.cursor/sandbox.json` (user and project). Sandbox on macOS and Linux (network blocked by default); `agent sandbox run`. | **Only permissions can be set at project level in CLI config.** A native-Windows sandbox statement was **not read**; do not assume parity. | read CU-CLI, CU-RUN |
| Git worktrees | Yes | Agents Window UI worktrees; CLI `-w/--worktree [name]` under `~/.cursor/worktrees/<repo>/<name>`, `--worktree-base`, `--skip-worktree-setup`. Setup via `.cursor/worktrees.json` keys `setup-worktree`, `-unix`, `-windows` (command array or script path; `$ROOT_WORKTREE_PATH`). | Docs say the UI-native feature is Agents-Window-only; IDE uses worktree skills. Symlinked dependencies are discouraged. | read CU-WT, CU-CLI |
| Session resume / handoff | Yes | CLI `--resume [chatId]`, `--continue`. Agent IDs for subagents. Cloud agents persist and can be reattached. SDK `@cursor/sdk` (local or cloud runtime). ACP: `agent acp` (stdio JSON-RPC 2.0, newline-delimited). | SDK has no native fork, rollback or approval callbacks (per T3's adapter notes). | read CU-CLI, CU-SDK, T3-USER |
| Headless / CLI | Yes | `agent -p` with `--output-format text\|json\|stream-json`, `--stream-partial-output`, `--force/--yolo` (without it, `-p` only proposes changes), `--trust`, `--approve-mcps`, `--sandbox enabled\|disabled`, `--workspace`, `--model`, `CURSOR_API_KEY`. | Exit-code semantics are not specified on the pages I read (unclear). Installed CLI is behind latest. | read CU-CLI; ran `agent.cmd --version` |
| Settings / config and precedence | Yes | Files: `hooks.json` (enterprise > team > project > user), `mcp.json` (project, user), rules (team > project > user), `cli-config.json` (+ `CURSOR_CONFIG_DIR`), `permissions.json`, `sandbox.json`, `worktrees.json`, `environment.json`. | No single settings precedence page; each surface differs. | read (above) |
| Model routing | Yes (managed) | Cursor Router behind "Auto" (Cost, Balance, Intelligence). SDK model id `auto-smart` with `optimize_for`. Per-subagent model field. | Router is Teams/Enterprise only and not user-steerable beyond the mode. | read CU-ROUTER, CU-SUB |

### Cursor: what Forge should NOT build

1. Rules/AGENTS.md loading, including nested AGENTS.md merge. Cursor reads AGENTS.md natively at root and in subdirectories.
2. Skill discovery. Cursor reads `.agents/skills` plus the `.claude`, `.codex` and `.cursor` skill directories, with nested-directory scoping.
3. Subagents, background and cloud agents, worktree setup, Plan Mode, run modes and sandbox. All native, including a Cloud Agents REST API and `@cursor/sdk`.
4. Plugin packaging and distribution. Agent Plugins is the open standard and Cursor Plugins is the extended format.
5. Model routing (Cursor Router) and the MCP client (stdio, SSE, HTTP, OAuth, prompts, resources, MCP Apps).

### Cursor: what Forge must supply

1. **Hook duplication control (inferred).** Cursor loads `.claude/settings*.json` hooks (default setting on) and "all matching hooks from every source run". Projecting the same gate into both `.claude/settings.json` and `.cursor/hooks.json` can double-fire. Forge needs one projection owner per host plus an idempotent gate.
2. **A real deny path.** Only exit 2, valid-JSON `deny`, or `failClosed: true` block. `preToolUse` `ask` is not enforced and `sessionStart` cannot block. Gates need the shape `failClosed: true` plus a Forge-owned authority check (inference from CU-HOOKS).
3. **Config projection that keeps Cursor's rules**: `.mdc`-only rules, `${CURSOR_PLUGIN_ROOT}` instead of `${PLUGIN_ROOT}`, `.cursor/mcp.json` variable syntax, MCP matcher `MCP:<tool>`.
4. **Cross-harness state and handoff.** Cloud agents lack user-level config and `~/.agents/skills`, so Forge's shared authority and project-committed assets must carry the work.
5. **Evidence and trust.** Auto-review is not a security boundary and CLI `-p` needs `--force` to write, so Forge must verify outcomes rather than trust mode names.

---

## 3. T3 Code (public repo pingdotgg/t3code, MIT; stable v0.1.0)

T3 is a **control surface and host over provider CLIs/SDKs, not an agent harness** (read T3-README: "agent harness control surface"). It owns threads, worktrees, an MCP server and a UI. It does not own skills, hooks, rules or models.

| Capability | Native? | How (file / format / API) | Limits | Evidence |
| --- | --- | --- | --- | --- |
| Instruction files | No (delegates) | Each provider keeps its own: Claude uses Claude Code's config dir (`CLAUDE_CONFIG_DIR` per instance), Pi keeps its own context files, extensions, skills and session history, etc. | T3 does not read or write AGENTS.md itself. | read T3-USER |
| Skills | No (surfaces provider's) | Provider skills appear in the composer `$` menu (Pi and Claude documented). Skill expansion is the provider's own. | Per-provider; no T3 skill format. | read T3-USER |
| Slash / custom commands | Host commands only | Composer commands such as `/compact` for Claude; T3 reserves some slash names (plan §3.5 says collisions exist). | The plan's reserved-name claim was not independently re-read here. | read T3-USER; inferred |
| Hooks | **No T3 hook system found** | Provider-native hooks run inside provider sessions (docs warn that opening a provider session can start MCP servers or run hooks). T3 has scheduled-task **webhooks** (a different thing). | Searched the docs tree and the repo path list for hook, plugin and extension: only webhook scheduling, a GNOME shell extension and a repo pre-commit hook. | read T3-INT; ran grep over repo tree |
| Subagents / parallel agents | **Yes, T3-owned** | MCP tools `delegate_task` (target provider/instance/model, role, mode async or wait, timeoutMs, clientRequestId, runtimeMode, interactionMode), `task_status`, `task_cancel`. Child gets only the task prompt (+ optional role), not parent history. `create_threads` (1–20 ordinary threads), `t3_thread_launch` (one thread with `workspaceStrategy` root, worktree or existing_worktree). Works on Codex, Claude Agent SDK, Cursor SDK, Grok, ACP registry agents, OpenCode, Pi, Antigravity. | Requires an active parent run. A wait timeout does not cancel the child. **No task-level follow-up API**; each review round is a new `delegate_task`. A provider lacking a requested runtime mode runs as approval-required. `isolation: "worktree"` for children is in this session's T3 instructions but **not in the docs' DelegateTaskInput type** (docs lag, inferred). | read T3-ORCH, T3-LIVE |
| Background tasks | Yes | Threads run server-side and persist; async `delegate_task`; `t3 service install` background service; scheduled tasks (interval, fixed time, webhook); queue tools; `t3_thread_wait`. | Host process must stay up. | read T3-README, T3-USER; T3-LIVE |
| MCP client | N/A (T3 is mostly an MCP **server**) | App-owned HTTP MCP endpoint `http://127.0.0.1:<port>/mcp`, server key `t3-code`, injected into provider sessions with a credential scoped to environment, thread, provider instance and session (expires, idle-timeout, revoked on release). Codex gets it via `-c mcp_servers.t3-code.*`, Claude via SDK `mcpServers` + `allowedTools mcp__t3-code__*`, Cursor via SDK options, Grok via ACP `session/new`, Pi via a T3-written extension bridge. Tools: preview toolkit + orchestration toolkit (plus this session's catalog: thread read/send/search/fork/merge_back, projects, worktree list/status/handoff, previews, devices, schedules, PR link/watch, attachments, secrets, pending requests, queue). | Outside agents connect by HTTP MCP **with OAuth only** ("Agents without OAuth support cannot connect"); default grant is **read only**; sign-in lasts 30 days. External OpenCode does not receive the internal MCP (plan §3.5, not re-verified). | read T3-ORCH, T3-USER, T3-LIVE |
| Plugins / extensions | **None found for T3 itself** | Repo-level config is `t3.json` (project actions, workspace for new threads, `worktreeSubmodules`). Settings resolve project override, then environment setting, then `t3.json`, then the built-in default (text truncated after `t3.json`). | **No installable plugin, panel or toolkit loader found** (grep above). Forge integrates via the provider harnesses' native plugins and via MCP. | read T3-USER; ran grep |
| Memory / persistent context | No own agent memory | Threads, queue and durable results persist; portable handoff carries conversation context across providers; `t3_thread_read` retrieves omitted history. | Handoff is a **budgeted selection, not a summary**: default 16,000 tokens (`T3CODE_CONTEXT_HANDOFF_TOKEN_CAP`, clamped 1,024–64,000), imported history ceiling 64,000 bytes; it does not copy reasoning, tool-call state or attachments. | read T3-USER |
| Plan mode / approvals | Yes (host-level) | Permission modes: Supervised, Auto-accept edits, Auto, Full access. Per-provider translation (Auto uses provider review on Codex, Claude, Cursor, Grok; OpenCode and Antigravity fall back to asking; Muse offers only Supervised and Full access). Plan/interaction mode on threads (`plan` or `default`). | **Initial default is Full access.** Pi's policy covers tool calls only, not an OS sandbox. An outside agent's started threads cannot exceed the mode you granted it. | read T3-USER, T3-ORCH |
| Permissions / sandboxing | Partial | Mode translation above. Pending requests are readable and answerable through MCP tools. | T3 does not sandbox; provider-native sandbox applies. | read T3-USER; T3-LIVE |
| Git worktrees | Yes | T3-managed worktrees under the T3 home `worktrees` folder (configurable, per machine). `t3_thread_launch` with `workspaceStrategy`; `delegate_task isolation:"worktree"` per this session's instructions; `t3_worktree_list/status/handoff`; branch-name settings; automatic cleanup rules (Inherit/Off/Custom, keeps worktrees with local changes by default; only T3-managed worktrees eligible); submodules initialised recursively. | T3 and Forge can both create or clean worktrees; the plan's single-owner rule still stands (inferred). Creating a worktree inside a prompt does not bind the thread. | read T3-USER, T3-ORCH |
| Session resume / handoff | Yes | Native resume per provider (Pi native session files for resume, rollback, forks in the same instance), `t3_thread_fork`, `t3_thread_merge_back`, `t3_worktree_handoff`, provider switching via portable context. | Cursor SDK has no native fork or rollback; same-provider forks use portable handoff. Capabilities are per adapter (a versioned `ProviderCapabilities` shape: sessions, threads, turns, streaming, tools, approvals, planning, subagents, context, checkpointing, identity). | read T3-ORCH, T3-USER |
| Headless / CLI | Yes (host server) | `t3 serve` (no browser, prints pairing details), `t3 auth`, `t3 project`, `t3 service`, `t3 connect`, `--mode web\|desktop`, `--base-dir`, `--tailscale-serve`. Remote access via Tailscale or T3 Connect. | Installed CLI v0.0.30 is older than stable v0.1.0. | ran `t3 --help`; read T3-README |
| Settings / config and precedence | Yes | Server-side settings per environment with project overrides; `t3.json` in the repo; provider instances (multiple accounts via per-instance env and config dirs); per-project provider on/off. | Providers and diagnostics are per machine. | read T3-USER |
| Model routing | Pass-through | Each provider instance advertises its models; callers choose `target.providerInstanceId`/`model`. This session lists providers: codex, claudeAgent, cursor, grok, opencode, antigravity, muse, pi (Pi: 154 models). | T3 does not route by cost or quality. | ran `orchestrator_capabilities` |

### Provider status that contradicts plan §3.5 (dated 2026-10-01 dossiers)

| Plan §3.5 line (P:999) | Current evidence | Evidence |
| --- | --- | --- |
| "Stock registry has no Pi" | T3 has a Pi provider doc (Pi 0.80.5+, uses the user's own `pi` install in RPC mode) and a `pi` provider is live in this session. | read T3-USER providers-pi; ran `orchestrator_capabilities` |
| "its OpenCode >=2.0.0 path is marked incompatible" | Docs now say OpenCode 2.0.18+ is supported and OpenCode 1.x shows "Limited support" (needs 1.14.19+). | read T3-USER providers-opencode |
| "No established drop-in T3 plugin/panel loader" | Still consistent: none found. | ran grep of repo tree |

Either T3 changed after the dossiers, or the dossiers were wrong. Re-pin the T3 section of the matrix before relying on §3.5 lines 999 and 1073.

### T3 Code: what Forge should NOT build

1. A session driver, scheduler, thread store, queue or worktree manager. T3 owns threads, queue, scheduled tasks, previews and worktrees, and the plan already says Forge is not a session driver.
2. A T3 plugin or panel. No loader exists, and Forge reaches T3 through the provider's native plugin and through T3's MCP server.
3. A cross-provider conversation handoff transport. T3's portable handoff, `t3_thread_read` and `t3_thread_fork` already do budgeted context transfer.
4. Provider adapters for hosting. T3's adapter capability system already normalizes provider differences.

### T3 Code: what Forge must supply

1. **Authority T3 does not have**: Forge's own claim/lease and verdict records. T3 activity, logs and best-effort streams are observation, not completion authority (plan P:1067).
2. **Explicit binding** between a T3 thread or worktree and a Forge issue or run, by identifier and not by cwd or title (plan P:1051). T3 child tasks start with no parent history, so the brief carries issue, scope and limits.
3. **Honest policy reporting**: T3's default is Full access and its mode translation differs per provider, so Forge reports the effective mode and enforces gates in its own APIs and the provider's native hooks.
4. **Capability negotiation** against T3's per-adapter capabilities (steering, fork, approvals vary) and the pinned host and provider versions. T3 client, server and providers move independently.

---

## 4. Cross-harness findings

| Topic | Claude Code | Cursor | T3 Code | Implication for Forge |
| --- | --- | --- | --- | --- |
| One skills source | `.claude/skills` or plugin `skills/`; `.agents/skills` not documented | Reads `.agents/skills` **and** `.claude/skills`, `.codex/skills`, `.cursor/skills` | Surfaces whatever the provider loads | One canonical `.agents/skills` serves Cursor directly; Claude still needs `.claude/skills` or a physical plugin copy (agrees with plan §3.5) |
| Instruction file | AGENTS.md native (2.1.277+), conditional on no CLAUDE.md | AGENTS.md native, nested merge | Delegates | Keep AGENTS.md canonical; detect `CLAUDE.md` and `CLAUDE.local.md` suppression before relying on it |
| Hook blocking | exit 2 or `permissionDecision`; fail-open by default; `onFailure:"block"` 2.1.295+ | exit 2 or `deny`; fail-open by default; `failClosed:true` | none | Same shape but different names; project one gate per host from one catalog |
| Hook cross-loading | None found | **Loads Claude hooks** | n/a | Avoid duplicate projection |
| Subagent files | `.claude/agents` | `.cursor/agents`, **also `.claude/agents`, `.codex/agents`** | T3-owned child threads, no files | One Markdown agent file can serve both, but Claude plugin agents drop hooks, mcpServers and permissionMode |
| MCP tool naming | `mcp__<server>__<tool>`; plugin form `mcp__plugin_<p>_<s>__<t>` | hook matcher `MCP:<tool>` | `mcp__t3-code__*` | Do not hardcode one naming form; read it per host |
| Plugin formats | Claude plugin + marketplace.json | Agent Plugins standard + `.cursor-plugin` | none | Agent Plugins root `plugin.json` is the one portable carrier (skills + MCP); hooks and agents stay host-native |
| Headless | `claude -p`, `--bare` for CI | `agent -p --force` | `t3 serve` host only | Forge runs inside these; it does not wrap them |

## 5. Unresolved items

1. Whether Claude Code discovers `.agents/skills` in practice: the skills page is silent. A `ran` check (create a fixture skill, list skills) is needed before the matrix claims anything.
2. Cursor Windows sandbox, MCP tool-count cap and tool-name rules, `subagentStart` `ask` behavior, `agent -p` exit codes, and the status of any standalone custom-commands directory: not found in the pages read.
3. Cursor IDE version: installed 3.7.42 versus release notes "3.24".
4. T3 desktop-app version running this session; whether `delegate_task` `isolation:"worktree"` is documented anywhere in the repo.
5. T3 hooks: none found by grep of the docs tree and repo path list, but the T3 source was not read file by file.
6. Claude Code MCP 2026-07-28 negotiation for local stdio servers (changelog states cloud and Remote Control connectors only).
7. Claude Code hooks page (170k chars unread), MCP page (23k unread), and the model-config, permissions, cross-session-messaging and channels pages were not read.

## 6. Reading against the rebuild rules

- Nothing here argues for Forge owning a loop, runner, hook bus, plugin loader or session store. Each harness already has that.
- The recurring gap is authority and evidence across harnesses, which is the part the brief says to keep.
- Per-host projection must be generated from one catalog, per host version, with feature detection. The version-gated facts (Claude 2.1.277, 2.1.295, 2.1.299; Cursor CLI 2026.10.08) show why a static per-harness config cannot be hardcoded.
