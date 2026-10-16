# P7: harness extension systems and Forge plugins

Leg P7 of the final-plan program, written 2026-10-01. Evidence rungs: [read] is a file:line in the worktree (a checkout of origin/master); [external] is a primary vendor URL fetched 2026-10-01; [inferred] is my reasoning. No commands were run, because the Bash tool was unavailable. Every proposed Forge feature is marked **(proposed)**.

## Bottom line

1. **All five harnesses now have a real plugin or package system**, so "a proper plugin per harness" is buildable today. Claude Code has plugins and marketplaces. Codex has plugins built on the open Agent Plugins schema. Cursor has `.cursor-plugin` plus a reviewed marketplace. OpenCode has JS/TS plugins loaded from npm or local files. Hermes has Python `plugin.yaml` packages with a catalog. [external, §2]
2. **The ecosystem has converged on two portable formats Forge already uses.** The first is `SKILL.md` under `.agents/skills`, which Codex, Cursor and OpenCode read natively and Hermes reads once trusted; Claude does not. The second is `AGENTS.md`, which Codex, Cursor, OpenCode and Hermes all read. Forge can therefore stop copying skills into four mirrors. [external; read lib/skills-sync.js:48-52,211]
3. **A cross-vendor Agent Plugins standard exists (agent-plugins.org 1.0.0).** Its steering committee includes Cursor, OpenAI, Microsoft, Amazon and Vercel. It defines a portable `plugin.json` with skills and MCP servers, and vendor extensions under reverse-domain keys. Forge should generate one plugin tree that follows it and add per-vendor manifests only where needed. [external]
4. **MCP is the one surface all five harnesses support (stdio + remote, OAuth in four).** Forge ships no MCP server of its own today, only Context7/Graphiti config. **(proposed)** A thin `forge mcp` stdio server over the public API would be the common tool surface for every harness, and also for the already-planned LangGraph/MCP profile. [external; read lib/commands/setup.js:42-48]
5. **Today Forge "supports" four harnesses through project-file projection. It ships one real plugin**: a Claude front door that has only a SessionStart nudge and one skill. It has no Codex, Cursor, OpenCode or Hermes plugin, renders no subagents for any harness, and has **zero OpenCode code**. The only OpenCode reference in lib/ is a detection string. [read plugin/, lib/harness-capability-matrix.js:5,148-153, lib/doc-gate/detect.js:150]
6. **Several capability-matrix claims are now stale or wrong** against current docs (§1.3). Examples: Cursor now has a deny-capable `preToolUse`, Codex hooks can be project-local, Hermes does have MCP, and Codex no longer documents `$CODEX_HOME/skills`. Fix these before any certification, because the matrix is the evidence base.
7. **The ideal plugin uses the same five blocks in every harness**, and each harness keeps its own loop, models and UI. The five blocks are: skills (procedures), MCP tools (Kernel issues/recap/gates/memory), a gate hook (pre-tool deny), an orientation hook (session start), and optional reviewer subagents.
8. **One generator, many manifests (proposed).** A canonical capability catalog feeds `forge plugin build`, which emits each manifest, hook file, MCP entry and agent file. The output is checked by a drift gate and a per-harness conformance transcript, never hand-maintained.
9. **Proposed 0.1.0 tiers.** Supported: Claude Code, Codex and Cursor (each with a native plugin), and Hermes (skills, CLI, MCP and global hooks, but no Python plugin yet). Experimental: OpenCode (a thin plugin plus the zero-adapter path). Later: the Hermes Python plugin, ChatGPT/Apps surfaces, and marketplace listings beyond self-hosted ones.
10. **OpenCode should stay experimental for 0.1.0.** The rule that UNAVAILABLE cannot pass, plus having no code and no operator proof, outweighs the exposure gain. Its zero-adapter path is cheap, though, so certify it in 0.1.x as soon as one installed-version transcript passes.

---

## 1. What Forge does today (from code)

### 1.1 Inventory
- **Harness set:** `HARNESS_IDS = ['claude','cursor','codex','hermes']`, with 16 capability IDs. [read lib/harness-capability-matrix.js:5-24]
- **Descriptors:** `lib/agents/{claude,codex,cursor,hermes}.plugin.json`, which PluginManager loads. These are Forge-internal agent descriptors, not harness plugins. [read lib/agents/README.md:1-60, lib/agents/codex.plugin.json]
- **Only shipped harness plugin:** `plugin/.claude-plugin/plugin.json` (v0.1.0-beta.1), `plugin/hooks/hooks.json`, and `plugin/skills/activation/SKILL.md`. The hook config holds a single `SessionStart` matcher `startup|clear|compact`. The plugin is listed by the self-marketplace `.claude-plugin/marketplace.json`, with source `./plugin`. [read]
- **Project projection by `forge setup`:**
  - Skills are byte-copied into `.claude/skills`, `.codex/skills`, `.cursor/skills` and `.hermes/skills`. `.agents/skills` is committed. [read lib/skills-sync.js:8-52,193-211]
  - Claude PreToolUse hooks go into `.claude/settings.json`. [read lib/hook-renderer.js:328-335]
  - Cursor `.cursor/hooks.json` uses `beforeShellExecution` and `afterFileEdit`. [read lib/hook-renderer.js:388-401]
  - Codex TOML and Hermes YAML hooks install only through opt-in `forge hooks install --global`. [read matrix:139-140]
  - MCP config is written to `.mcp.json` and `.cursor/mcp.json` for Context7 (plus Graphiti, opt-in). [read lib/commands/setup.js:42-48,1975-1995]
  - Claude permissions and `.cursorignore` get safe defaults. [read docs/reference/AGENT_SKILL_PARITY.md:174]
  - Cursor policy rules go into `.cursor/rules/*.mdc`. [read AGENT_SKILL_PARITY.md:100]
- **Not delivered anywhere:**
  - Subagents (`802aa4d8`). [read matrix:148-153]
  - Typed-memory projection (`dce9da46`). [read matrix:161-166]
  - Codex MCP. [read matrix:133]
  - A Forge-owned MCP server. Searched lib/ for `McpServer|@modelcontextprotocol|forge mcp` and found zero hits, only config renderers. [read]
- **Proof boundary:** the parity fixture proves metadata only. It never launches a harness. [read AGENT_SKILL_PARITY.md:156-160]

### 1.2 Gaps against the owner direction
| Gap | Evidence |
| --- | --- |
| No native plugin for Codex, Cursor, OpenCode or Hermes. The Claude plugin is discovery-only | [read plugin/, marketplace.json:11] |
| Skills are distributed as copies, contradicting "one canonical `.agents/skills` with links" (common.md) | [read skills-sync.js:211 `copyFileSync`] |
| Kernel/gates reach agents only through shell CLI plus skill text. No typed tool surface | [read: no MCP server] |
| OpenCode is absent from HARNESS_IDS, renderers and tests | [read detect.js:150 is the only lib hit] |
| Reference workflow is not exposed as subagents in any harness | [read matrix:148-153] |

### 1.3 Stale or contradictory claims to correct (each is a doc or matrix fix, not new scope)
| # | Claim in repo | Current primary source | Fix |
| --- | --- | --- | --- |
| a | Cursor "has NO pre-edit deny event", so afterFileEdit is only observational [read matrix:138, :44] | Cursor hooks now include `preToolUse` and `subagentStart`, which can return `permission: allow/deny/ask`, alongside beforeShellExecution, beforeMCPExecution, beforeReadFile and beforeSubmitPrompt [external https://cursor.com/docs/hooks, 2026-10-01] | Re-probe whether `preToolUse` fires for edit tools. If it does, move Cursor edit-gating to deny. [inferred: the doc does not say per-tool coverage] |
| b | Codex hooks live only in GLOBAL config.toml, so project setup cannot render them [read matrix:36,139] | Project `<repo>/.codex/hooks.json` or `.codex/config.toml` is supported, plugin `hooks/hooks.json` too. Non-managed hooks need review/trust via `/hooks` [external https://learn.chatgpt.com/docs/hooks, 2026-10-01] | Render project-local Codex hooks and document the one-time trust step. |
| c | Codex skills install to `$CODEX_HOME/skills` [read matrix:121, codex.plugin.json:24] | Documented discovery paths are `.agents/skills` (cwd up to repo root), `$HOME/.agents/skills`, `/etc/codex/skills` and built-ins. `$CODEX_HOME/skills` is not listed [external https://learn.chatgpt.com/docs/build-skills, 2026-10-01] | Stop the global copy. `.agents/skills` is sufficient. [inferred; an absence in the docs is rung 1, so confirm with an installed Codex] |
| d | Hermes MCP is "unsupported: no native MCP config surface" [read matrix:134] | Hermes reads `mcp_servers` from `~/.hermes/config.yaml`, with stdio and HTTP, OAuth with DCR/PKCE/device code, and include/exclude filters [external https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp/, 2026-10-01] | Mark it `packaged` (global, consent-guarded) like Hermes hooks. |
| e | Codex marketplaceTrust is "native: `.agents/plugins/marketplace.json`" [read matrix:171] | No `.agents/plugins/` exists in the worktree (Glob of `.agents` lists only `skills/`) [read] | Mark it `not-delivered` until that file ships. |
| f | AGENT_SKILL_PARITY says no harness-native hook file is rendered for any harness [read :103,:170] | The matrix says the Claude and Cursor hooks are native and rendered [read matrix:137-138] | Reconcile the doc to the matrix. |
| g | lib/agents/README says "Hermes support is planned" [read :97] | hermes.plugin.json has `support.status: supported` [read] | Update the README. |
| h | Matrix source URLs point to developers.openai.com/codex/* [read matrix:34-42] | These now 308-redirect to learn.chatgpt.com/docs/* [external, observed 2026-10-01] | Update the URLs so the evidence links resolve. |

---

## 2. Per-harness extension surfaces (verified 2026-10-01), the ideal plugin, effort and risk

The common block mapping is used in every harness. Each harness keeps its own agent loop, models, approvals and UI. Forge never wraps or proxies the model loop.

| Forge block | Native carrier (preferred, then fallback) |
| --- | --- |
| Skills / stage procedures | Native `SKILL.md` from `.agents/skills`. Claude gets a plugin `skills/` dir or a `.claude/skills` link |
| Kernel issues, recap, gate status, memory recall **(proposed tools)** | Forge stdio MCP server, with the `forge` CLI as fallback |
| Gates (TDD intent, protected paths) | Pre-tool deny hook calling `.forge/hooks/forge-native-hook.js`, with git hooks remaining authoritative |
| Orientation | Session-start hook that injects `forge recap` context, or the AGENTS.md pointer |
| Reference-workflow roles | Native subagent files (reviewer, spec-reviewer) **(proposed)** |
| Policy | AGENTS.md (Cursor `.mdc` only where scoping is needed) |

### 2.1 Claude Code
**Surfaces** [external https://code.claude.com/docs/en/plugins-reference, /plugin-marketplaces, /hooks, /sub-agents, /skills, /headless, all 2026-10-01]:
- **Plugin.** The manifest is `.claude-plugin/plugin.json` (optional; only `name` is required). Components are `skills/`, `commands/`, `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`, `output-styles/`, `workflows/`, `monitors/`, `bin/` (on PATH) and `settings.json`, plus `userConfig` with sensitive values in the keychain. Variables are `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}` (persists across updates) and `${CLAUDE_PROJECT_DIR}`. `claude plugin validate [--strict]` validates. Components are namespaced `plugin:name`.
- **Marketplace.** `.claude-plugin/marketplace.json` uses sources relative, github, git-subdir, url, archive, npm or command. Install with `claude plugin marketplace add owner/repo` and then `claude plugin install name@market`. `version` pins users. There is also Anthropic's directory submission, and org-required marketplaces.
- **Skills.** Locations are `~/.claude/skills`, `.claude/skills` (including nested), `--add-dir`, plugins and managed. Commands have been merged into skills. Frontmatter includes `disable-model-invocation`, `user-invocable`, `allowed-tools`, `context: fork`, `agent`, `paths`, `hooks`, `model` and `effort`. The documented discovery table does not list `.agents/skills`.
- **Hooks.** There are 32 events (SessionStart, PreToolUse, PermissionRequest, PostToolUse, Stop, SubagentStart/Stop, TaskCreated, WorktreeCreate, PreCompact and others). Handlers are `command`, `http`, `mcp_tool`, `prompt` and `agent`. PreToolUse can deny. Hooks can be set in settings, plugins, and skill/agent frontmatter.
- **Subagents.** Locations are `.claude/agents`, `~/.claude/agents`, plugin `agents/`, and `--agents` JSON. **Plugin agents ignore `hooks`, `mcpServers` and `permissionMode`.**
- **MCP.** stdio, http, sse and ws.
- **Headless.** `claude -p` with `--bare`, `--plugin-dir`, `--mcp-config` and `--output-format stream-json`. The `system/init` event reports `plugins`, `plugin_errors` and `mcp_server_errors`, which gives a ready-made CI conformance probe.

**Forge today:** a front-door plugin with only the SessionStart nudge and the activation skill, plus project projection (skills copy, PreToolUse hooks, permissions, `.mcp.json`). [read]

**Ideal plugin (proposed):** grow `plugin/` into the full Forge plugin.
- `skills/`: generated links or a build-time copy of `.agents/skills`.
- `hooks/hooks.json`: SessionStart orientation, plus a PreToolUse gate that calls the project-local adapter and fails open where Forge is not set up.
- `.mcp.json`: the `forge mcp` stdio server.
- `agents/`: reviewer and spec-reviewer roles, with no hooks or MCP in frontmatter because plugin agents ignore them. Gates stay in plugin hooks.
- `bin/forge` shim: optional.
- `userConfig`: profile choice.

One-step install: `claude plugin marketplace add harshanandak/forge && claude plugin install forge@forge`. The user experiences `/forge:plan` and the other stages as skills, Forge tools in `/mcp`, and gate denials surfacing as normal permission denials. Effort: S–M (about 3–4 days), [inferred], mostly generator plus conformance. Risk: low. The plugin cache path moves on update, so state must stay in `.forge/` or `${CLAUDE_PLUGIN_DATA}`.

### 2.2 Codex
**Surfaces** [external https://developers.openai.com/codex/plugins/build, https://learn.chatgpt.com/docs/hooks, /docs/agent-configuration/subagents, /docs/build-skills, /docs/extend/mcp?surface=cli, /docs/non-interactive-mode, /docs/codex-sdk, /docs/app-server, all 2026-10-01]:
- **Plugin.** The primary format is a root `plugin.json` on the Agent Plugins schema (`$schema https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`), with OpenAI specifics under `extensions."com.openai"` (presentation, `apps`, `hooks`). `.codex-plugin/plugin.json` remains as a compatibility fallback. Components are `skills/` (auto-discovered), `mcp.json` and `hooks/hooks.json`. Hooks receive `PLUGIN_ROOT` and `PLUGIN_DATA`.
- **Marketplace.** Repo marketplace at `.agents/plugins/marketplace.json`, personal at `~/.agents/plugins/marketplace.json`. **The legacy `.claude-plugin/marketplace.json` is also read.** Entries carry `source` (local/git/npm), `policy.installation` and `policy.authentication`. Plugins are cached in `~/.codex/plugins/cache/<market>/<plugin>/<version>/`. Install via `codex plugin marketplace`.
- **Plugin trust.** "Plugin-bundled hooks are non-managed hooks, so Codex skips them until the user reviews and trusts the current hook definition."
- **Skills.** `.agents/skills` (cwd up to repo root), `$HOME/.agents/skills`, `/etc/codex/skills`. Invocation is `$skill` or implicit. `agents/openai.yaml` carries metadata and policy.
- **Hooks.** Events are SessionStart/End, SubagentStart/Stop, PreToolUse, PostToolUse, PermissionRequest, PreCompact/PostCompact, UserPromptSubmit, Stop and Interrupt. Hooks can be global or **project `.codex/hooks.json` / `.codex/config.toml`**. They are on by default and need trust review. PreToolUse, PermissionRequest and PostToolUse can block.
- **Subagents.** TOML files in `.codex/agents/` or `~/.codex/agents/`, with required `name`, `description` and `developer_instructions`. They can override model, effort, sandbox and MCP.
- **MCP.** `~/.codex/config.toml`, or project `.codex/config.toml` when the project is trusted. Transports are stdio and streamable HTTP, with OAuth (CIMD/DCR), `codex mcp add/login`.
- **Headless.** `codex exec`, the Codex SDK, and the app-server JSON-RPC interface.

**Forge today:** the committed `.agents/skills` (works natively), a `$CODEX_HOME/skills` copy (likely obsolete, §1.3c), a global-only opt-in hook TOML, no MCP, no plugin. [read]

**Ideal plugin (proposed):** the same generated plugin tree, with a root Agent-Plugins `plugin.json` plus `extensions."com.openai".hooks`, `skills/`, `mcp.json` (forge server) and generated `.codex/agents/*.toml` reviewers (project-projected, since plugins do not document agents). Codex already reads `.claude-plugin/marketplace.json`, so Forge's existing self-marketplace can list one plugin for both Claude and Codex. Whether one marketplace file serves both needs an installed-Codex check [inferred]. The install is one step from the repo marketplace. The user experiences a one-time `/hooks` trust prompt for the gate hook, which is the harness's own consent and the correct one. Effort: S (about 2–3 days). Risk: medium. Docs moved domains during 2026, and the plugin schema is new (1.0.0), so pin to schema 1.0.0 and test against an installed version.

### 2.3 Cursor
**Surfaces** [external https://cursor.com/docs/plugins, /docs/hooks, /docs/subagents, /docs/skills, /docs/rules, /docs/mcp, /docs/cli/overview, all 2026-10-01]:
- **Plugin.** `.cursor-plugin/plugin.json` (Cursor Plugins) or root `plugin.json` (Agent Plugins). Components are rules (`.mdc`), skills, MCP and, **Cursor-format only**, agents, commands and hooks. The marketplace at cursor.com/marketplace states that "every plugin is manually reviewed before it's listed". Team/Enterprise private marketplaces offer Default Off, Default On or Required. Updates come by refresh or GitHub App sync.
- **Skills.** `.agents/skills`, `.cursor/skills`, `~/.agents/skills` and `~/.cursor/skills`, plus legacy `.claude/skills` and `.codex/skills`. Frontmatter includes `paths` and `disable-model-invocation`, and `/skill-name` invokes a skill.
- **Hooks.** sessionStart/End, preToolUse/postToolUse(/Failure), subagentStart/Stop, before/afterShellExecution, before/afterMCPExecution, beforeReadFile, afterFileEdit, beforeSubmitPrompt, preCompact, stop, afterAgentResponse/Thought, Tab hooks and workspaceOpen. Deny-capable hooks are preToolUse, beforeShellExecution, beforeMCPExecution, beforeReadFile, beforeTabFileRead, subagentStart and beforeSubmitPrompt. Locations are project `.cursor/hooks.json`, user, enterprise and team.
- **Subagents.** Markdown files read from `.cursor/agents`, **`.claude/agents` and `.codex/agents`** (project and user). Fields are `name`, `description`, `model`, `readonly` and `is_background`.
- **Rules.** `.cursor/rules/*.mdc` with `alwaysApply`, `globs` and `description`. AGENTS.md is supported, including nested files. Team, Project and User rules.
- **MCP.** `.cursor/mcp.json` or `~/.cursor/mcp.json`, over stdio, SSE or streamable HTTP. Static OAuth credentials are supported, and team allowlists can be set.
- **Headless.** `agent -p` in the Cursor CLI. Whether the CLI loads plugins, hooks and skills is not documented on the overview page (rung 1 absence).
- **Commands.** The custom-commands doc URL returned 404. Status unverified.

**Forge today:** `.cursor/skills` copy (redundant, since Cursor reads `.agents/skills`), `.cursor/rules` (4 policy rules), `.cursor/hooks.json` (shell deny plus observational edit audit), `.cursor/mcp.json`, `.cursorignore`. [read]

**Ideal plugin (proposed):** `.cursor-plugin/plugin.json` in the same generated tree. It includes `skills/`, `rules/` (only the scoped ones), `hooks` with sessionStart plus preToolUse/beforeShellExecution gates, MCP, and `agents/`. The `.claude/agents` files generated for Claude also work in Cursor, so there is a single subagent source for both. Listing: self-host first and submit to the reviewed marketplace later. Install in one step from the marketplace, or by repo import for teams. Effort: S–M (about 3 days). Risk: medium. Marketplace review is outside Forge's control, and live editor auto-invocation is hard to automate (CLI proof is the substitute).

### 2.4 OpenCode
**Surfaces** [external https://opencode.ai/docs/plugins/, /skills/, /agents/, /commands/, /mcp-servers/, /rules/, /permissions/, /sdk/, /ecosystem/, all 2026-10-01]:
- **Plugin.** A JS/TS module exporting async functions that receive `{project, client, $, directory, worktree}` and return hooks. Types come from `@opencode-ai/plugin`. Plugins load from `.opencode/plugins/`, `~/.config/opencode/plugins/`, or npm names in `opencode.json` `"plugin"`. npm plugins are auto-installed by Bun into `~/.cache/opencode/node_modules/`.
- **Plugin hooks and tools.** Events cover command, file, installation, LSP, message, permission, server, session, todo, shell, tool and TUI, for example `tool.execute.before/after`, `shell.env`, `permission.asked`, `session.created`, `session.idle` and `experimental.session.compacting`. Plugins can add custom tools (Zod schema), and a plugin tool overrides a built-in tool of the same name.
- **No trust model is documented. No official marketplace exists** (the community list is awesome-opencode and opencode.cafe, with PRs to the docs list).
- **Skills.** `.opencode/skills`, `.claude/skills` and `.agents/skills` (walking up to the worktree), plus the global equivalents. Permission rules use `permission.skill` patterns.
- **Agents.** Markdown in `.opencode/agents/` or `~/.config/opencode/agents/`, or JSON. `mode: primary|subagent|all`, with `model`, `permission` and `steps`, invoked automatically or by `@name`.
- **Commands.** `.opencode/commands/*.md` with `agent`, `model` and `subtask`, plus `$ARGUMENTS` and `!`cmd`` injection.
- **Rules.** AGENTS.md first, then a CLAUDE.md fallback, plus an `instructions` array.
- **MCP.** `opencode.json` `"mcp"`, local or remote, with OAuth DCR and `opencode mcp auth`.
- **Permissions.** allow/ask/deny per tool, last match wins.
- **SDK.** `@opencode-ai/sdk`, `opencode serve`, SSE events, and an ACP page.

**Forge today:** nothing beyond a detection string. [read lib/doc-gate/detect.js:150] Even so, OpenCode would already pick up `.agents/skills`, AGENTS.md and `.claude/skills` from a Forge project unchanged. That is a **zero-adapter path** [inferred from the external discovery paths] and has not been tested.

**Ideal plugin (proposed):** a small TS plugin entry *inside the one Forge npm package*. The candidate is a `forge-workflow/opencode` export referenced from `opencode.json` `"plugin"`; whether a subpath specifier is accepted is unverified. The fallback is a generated 5-line `.opencode/plugins/forge.js` that imports the installed package. It provides:
- `tool.execute.before`, which calls the same gate adapter and blocks on deny. The exact blocking semantics need an installed check.
- `session.created`, which runs orientation.
- Optionally, custom tools that wrap Kernel verbs. Prefer the MCP server instead, so there is one implementation.

The project gets `opencode.json` `mcp.forge` and generated `.opencode/agents/` reviewers. Install in one step: `forge setup --harness opencode`, or add one line to `opencode.json`. Effort: M (about 4–5 days, including adding `opencode` to HARNESS_IDS, the matrix, renderers and tests). Risk: medium-high. There is no trust model, plugins run in-process with full access, and Forge has no existing operator lane for OpenCode.

### 2.5 Hermes
**Surfaces** [external https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins/, /skills/, /mcp/, /context-files/, /hooks/; delegation and ACP pages via the search index, 2026-10-01]:
- **Plugin.** A Python package with `plugin.yaml` and `__init__.py:register(ctx)`. `ctx.register_tool`, `register_hook` (27 events), `register_command` (slash), `register_cli_command` and `register_skill` (namespaced `plugin:skill`), plus provider backends including memory providers. Sources are bundled, `~/.hermes/plugins`, project `.hermes/plugins` (only with `HERMES_ENABLE_PROJECT_PLUGINS=true`), pip entry points and Nix.
- **Plugin trust.** Opt-in enable lists, per-capability consent, and install-time static security scanning. The catalog install is pinned to a full 40-char SHA, and there are pack YAML files.
- **Skills.** `~/.hermes/skills` is primary. Project `.hermes/skills` **or `.agents/skills`** need explicit trust. The format is agentskills.io-compatible, with a hub (skills.sh, well-known endpoints, GitHub) and scanned installs. `/skill-name` stacks.
- **MCP.** `mcp_servers` in `~/.hermes/config.yaml`, over stdio or HTTP, with OAuth.
- **Context files.** The first match wins among `.hermes.md`/`HERMES.md`, `AGENTS.override.md`, `AGENTS.md`, `CLAUDE.md` and `.cursorrules`, with injection scanning.
- **Hooks.** Shell hooks in global config, where `pre_tool_call` can block. [read matrix:45, external S16]
- **Subagents and ACP.** Delegation is through the `delegate_task` tool (no agent file contract). ACP server mode serves VS Code, Zed and JetBrains.

**Forge today:** the `hermes-forge` skill, `.hermes/skills` copy, CLI consumption (`forge orient/recap`), and opt-in global hooks. MCP is wrongly marked unsupported (§1.3d). [read]

**Ideal plugin:** for 0.1.0, *no Python plugin*. Use `.agents/skills` (one trust step), AGENTS.md, consent-guarded global `mcp_servers.forge` plus `pre_tool_call` hooks (the existing installer pattern), and `forge` CLI. Later **(proposed)**, ship a Python Hermes plugin that registers `forge` tools, hooks and skills. That plugin would need a Python artifact or a git-installable directory, which strains the one-npm-package rule. Effort for the 0.1.0 scope: S (about 1–2 days). For the plugin: M plus a packaging decision. Risk for 0.1.0: low.

### 2.6 Surface summary
| Surface | Claude Code | Codex | Cursor | OpenCode | Hermes |
| --- | --- | --- | --- | --- | --- |
| Plugin manifest | `.claude-plugin/plugin.json` | root `plugin.json` (Agent Plugins) / `.codex-plugin` | `.cursor-plugin/plugin.json` / root `plugin.json` | JS/TS module, npm or `.opencode/plugins` | `plugin.yaml` + Python |
| Marketplace | self-hosted + Anthropic directory | repo/personal marketplace.json (reads `.claude-plugin`) | reviewed cursor.com/marketplace + team | none official | curated catalog, SHA-pinned |
| Reads `.agents/skills` | no (not in documented table) | yes | yes | yes | yes, after trust |
| Pre-tool deny hook | PreToolUse | PreToolUse (trusted) | preToolUse / beforeShellExecution | tool.execute.before | pre_tool_call (global) |
| Subagent files | `.claude/agents/*.md` | `.codex/agents/*.toml` | `.cursor/agents`, reads `.claude/agents` | `.opencode/agents/*.md` | none (`delegate_task`) |
| MCP | stdio/http/sse/ws | stdio/HTTP, OAuth | stdio/SSE/HTTP, OAuth | local/remote, OAuth | stdio/HTTP, OAuth |
| Headless | `claude -p`, Agent SDK | `codex exec`, SDK, app-server | `agent -p` | `opencode serve`, SDK | CLI, ACP server |
| Plugin trust | marketplace add + validate | hook review required | manual marketplace review | none documented | consent + static scan |

---

## 3. Cross-harness consistency

**Canonical definition (proposed).** Extend the existing capability catalog and matrix (lib/harness-capability-matrix.js) into the single input. Each capability declares its protocol class (procedure/skill, tool, lifecycle hook, role/agent, policy), its canonical source, and per-harness support status with evidence. `forge plugin build` then emits:
1. **One plugin tree** containing:
   - root `plugin.json` (Agent Plugins 1.0.0, with `extensions."com.openai"`);
   - `.claude-plugin/plugin.json`;
   - `.cursor-plugin/plugin.json`;
   - shared `skills/` (link to `.agents/skills`);
   - `hooks/hooks.json`, where Claude-shaped and Codex-shaped files are emitted separately unless an installed check proves the formats compatible;
   - MCP config files, and agents.
2. **Project projections** only where a harness lacks plugin support for a component: Codex agents TOML, OpenCode `opencode.json`/plugin shim, Hermes global YAML with consent.
3. **A drift gate.** Generated files are byte-compared in CI, like the existing `.agents/skills` drift gate. There are no hand-edited manifests.

**What is genuinely harness-specific** (keep it in the renderer, not the catalog):
- hook event names and deny wire formats;
- the subagent file format (MD vs TOML, plus field names such as `readonly` vs `tools`);
- plugin trust flows (Codex `/hooks` trust, Hermes consent, Cursor review);
- global-vs-project config locations;
- the fact that Claude plugin agents cannot carry hooks or MCP.

Skills and MCP need no per-harness body.

**Parity testing (proposed), in three layers:**
- **L1 static:** render, then schema-validate with `claude plugin validate --strict`, the Agent Plugins JSON schema, and a Cursor manifest schema.
- **L2 installed-version smoke:** headless sessions using `claude -p --plugin-dir` (check `system/init.plugins` and `plugin_errors`), `codex exec`, `agent -p`, `opencode run`/SDK and the `hermes` CLI. Each asserts:
  - the skill is discoverable;
  - the Forge MCP tool lists and runs;
  - the gate hook denies a protected-path write;
  - session-start context is injected.
- **L3 live transcript:** one per certified harness per release, reusing the platform plan's operator ledger.

The status vocabulary (`native`, `packaged`, `not-delivered`, etc.) stays the honesty contract. A harness is "supported" only with L2 passing on a named installed version. [inferred; consistent with platform-plan-final.md:536,540]

**Alternatives rejected:**
- **Hand-written per-harness plugins.** They drift. The repo already shows doc/matrix contradictions (§1.3f).
- **MCP-only (no skills or hooks).** MCP cannot deny tool calls or carry procedures, and the platform plan says the protocols are not interchangeable. [read platform-plan-final.md:534]
- **One "universal" plugin.json only.** Agent Plugins core covers only skills and MCP. Hooks and agents remain vendor extensions. [external agent-plugins.org]
- **Wrapping harnesses in a Forge loop.** This violates "complement, never replace" (north-star item 12).

**What would change this:**
- If Claude adopts Agent Plugins or `.agents/skills`, drop the Claude-specific manifest and link.
- If installed Codex rejects the shared marketplace, add `.agents/plugins/marketplace.json`.

---

## 4. Certification tier for 0.1.0

| Harness | 0.1.0 tier | What "supported" covers | Justification |
| --- | --- | --- | --- |
| Claude Code | **Supported** | Native plugin (skills, hooks, MCP, agents) + project projection | Existing plugin and marketplace. Richest surface. Headless conformance probe exists. |
| Codex | **Supported** | Plugin via Agent Plugins schema + `.agents/skills` + project hooks + agents TOML | Already a required outside-solution harness (platform-plan-final.md:536). Small delta. |
| Cursor | **Supported** | `.cursor-plugin` (self-hosted) + projection. Marketplace listing is best-effort | Already a required outside-solution harness. Reads `.agents/skills` and `.claude/agents`, so the delta is cheap. |
| Hermes | **Supported (current surfaces)**: skills, AGENTS.md, CLI, consented global MCP + hooks | No Python plugin | Already advertised [read hermes.plugin.json]. Adding MCP closes the false "unsupported" row. The plugin is deferred to avoid a second artifact. |
| OpenCode | **Experimental** | Zero-adapter path + thin plugin + MCP, behind `--harness opencode` | No code or operator proof today. The platform rule is that UNAVAILABLE cannot pass. It is cheap to promote once L2 passes. |
| ChatGPT / Apps, other agent surfaces | **Later** | Via the same MCP server (Codex `apps` extension) | North star names them, but they have no proof path in 0.1.0. |

**Exposure-first trade-off** [inferred]: OpenCode is a large open-source audience, and the north star measures reach (item 10). Making it experimental still gives exposure (installable, documented) without risking a false support claim. The marginal cost of "supported" is mainly an L2/L3 operator lane, about 1–2 extra days of proof per release. **What would change it:** if an OpenCode operator and an installed-version L2 pass are available before the 0.1.0 cut, promote it to supported (option B below).

---

## Recommended plan changes

1. **Adopt the harness support table in §4** in platform-plan-final.md §3.5 and the release matrix (line 992). Replace "OpenCode remains a staged native adapter" with "OpenCode experimental: plugin plus zero-adapter path; promote on L2 pass."
2. **New decision (proposed D-P7a): one generated plugin tree.** `forge plugin build` renders the Agent Plugins `plugin.json` plus the Claude and Cursor manifests from the capability catalog. Codex is served from the same tree and from the existing self-marketplace. Generated files go under the drift gate.
3. **New decision (proposed D-P7b): ship a thin Forge stdio MCP server in 0.1.0.** It exposes `issue.list/show/claim/comment`, `recap`, `gate.status` and `memory.recall` over the public API, with the CLI as fallback. It is the *same* server as the planned experimental local stdio MCP/LangGraph profile, so there is no second integration.
4. **Skills distribution:** make `.agents/skills` the only physical copy. Stop copying to `.cursor/skills` and `.codex/skills` (Cursor, Codex and OpenCode read `.agents/skills`). Keep `.claude/skills` and `.hermes/skills` as links or the plugin `skills/` dir only, and retire the `$CODEX_HOME/skills` global copy after an installed-Codex check. This implements the owner's existing pruning decision. [read skills-sync.js:211 shows copies today]
5. **Fix the stale matrix and doc claims in §1.3 (a–h)** before any certification run. They are the evidence base.
6. **Hooks:** render Codex hooks project-locally (`.codex/hooks.json`) with documented trust. Re-probe Cursor `preToolUse` for edit deny. Add OpenCode `tool.execute.before`. Keep git hooks authoritative everywhere.
7. **Subagents (closes 802aa4d8):** generate reviewer and spec-reviewer roles as `.claude/agents/*.md` (also read by Cursor), `.codex/agents/*.toml` and `.opencode/agents/*.md`. Hermes stays unsupported for agent files and uses `delegate_task` guidance in its skill.
8. **Add `opencode` to HARNESS_IDS** with an experimental status and tests. Add an L2 headless conformance lane per harness (`claude -p --plugin-dir`, `codex exec`, `agent -p`, `opencode run`, `hermes`).
9. **Extend the Claude front-door plugin** into the full plugin (§2.1). The activation/discovery-only behavior stays the default until a mutating verb runs.
10. **Defer** the Hermes Python plugin, public marketplace submissions (Cursor review, Anthropic directory) and ChatGPT Apps to 0.2. File each as a Kernel issue.

---

## Open questions for the owner

1. **OpenCode tier for 0.1.0.**
   - A: experimental (plugin + zero-adapter path, promote on L2 pass).
   - B: supported, which needs an OpenCode operator lane and L2/L3 proof before the cut (+1–2 days of proof).
   - C: later (docs only).
   - **Default A.** It gives exposure without a false claim, and it is cheap to promote.
2. **Forge MCP server in 0.1.0.**
   - A: ship the thin stdio server, shared with the LangGraph/MCP profile.
   - B: skills plus CLI only, with MCP in 0.2.
   - **Default A.** It is the only surface common to all five harnesses, and the server is already planned for the framework profile.
3. **Plugin packaging.**
   - A: one generated plugin tree inside the one npm package and repo (self-marketplace for Claude and Codex, `.cursor-plugin` for Cursor).
   - B: a separate plugin repo per harness.
   - **Default A.** It keeps the one-package rule and one source, and the drift gate prevents copies.
4. **Hermes Python plugin.**
   - A: defer to 0.2. In 0.1.0 Hermes gets MCP, global hooks and skills.
   - B: build it now as a git-installable directory.
   - **Default A.** A Python artifact strains the one-npm-package rule for little gain over MCP.
5. **Public marketplace listings.**
   - A: self-hosted marketplaces only in 0.1.0.
   - B: also submit to Cursor's reviewed marketplace and Anthropic's directory at launch.
   - **Default A.** Third-party review timelines can't gate the release, and listing is an exposure step for 0.1.x.

## Confidence

**Medium-high on surfaces and gaps. Medium on effort and tiers.**
- Harness surfaces come from primary docs fetched today. They were summarized by a fetch model, so exact field names should be re-checked when implementing.
- Forge's current state comes from direct reads of origin/master.
- Unverified points: Codex agent/command support inside plugins; whether Codex's `hooks/hooks.json` matches Claude's format; Cursor `preToolUse` coverage of edit tools; OpenCode subpath plugin specifiers and its throw-to-block semantics; Cursor CLI's loading of plugins and hooks; Cursor commands (doc 404); Claude reading `.agents/skills` (absent from the table, which is rung 1).
- No harness was installed or run, so every "works" claim above is [external] or [inferred], never [ran].
- Effort figures are [inferred] estimates without a pilot.

---

## Addendum: Pi (owner decision 2026-10-01)

Written 2026-10-01 on the owner's decision that Forge supports Pi as a harness. The evidence rungs are the same as above. All [external] URLs were fetched 2026-10-01. No Pi install was run, so nothing here is [ran]. Context only: on this machine, Agent Companion already sends work to Pi (target `pi`, provider routes such as `openai-codex`, and a Pi "Taskflow" concept). The subject of this addendum is Pi itself, not Agent Companion.

### P.0 Bottom line
1. **Name and home have changed.** Pi is now `@earendil-works/pi-coding-agent` in the `earendil-works/pi` monorepo (MIT). The old `badlogic/pi-mono` README now points there. The latest npm version is **0.99.2** and Pi needs Node >= 22.19. [external https://registry.npmjs.org/@earendil-works/pi-coding-agent/latest; https://github.com/earendil-works/pi]
2. **Pi reversed its "no MCP" stance two days ago.** In Nov 2025 the author wrote "pi does not and will not support MCP" and recommended CLI tools with READMEs instead. Version **0.99.0 (2026-09-29)** ships built-in MCP (stdio and streamable HTTP, OAuth, `mcp.json`) behind "Codemode". [external https://mariozechner.at/posts/2025-11-30-pi-coding-agent/; https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/CHANGELOG.md]
3. **Pi already reads both portable formats Forge emits.** It reads Agent Skills from `.agents/skills` (cwd up to the repo root) and `~/.agents/skills`, and context from `AGENTS.md`/`CLAUDE.md`. So a Forge project works in Pi today with no adapter, once the user trusts the project, because project `.agents/skills` is trust-gated. [external docs/skills.md, docs/configuration.md, docs/security.md]
4. **Pi has a strong plugin model: TypeScript extensions inside "Pi packages" installed from npm or git.** A `tool_call` handler can block a call with `{ block: true, reason }`, and there are `session_start`, `registerTool`, `registerCommand` and `registerMcpServer`. All five Forge blocks have a native carrier, except native subagents, which Pi deliberately leaves to extensions. [external docs/extensions.md, docs/packages.md]
5. **Forge does nothing for Pi today.** Searches of lib/, docs/ and skills/ for `pi-coding-agent|pi-mono|mariozechner|badlogic`, for quoted `'pi'` and harness-adjacent `\bpi\b`, and for `\.pi/|pi\.dev|earendil` all returned **zero hits** (case-insensitive). [read: Grep, 2026-10-01]
6. **The ideal plugin (proposed) costs little:** add a `"pi"` key to the one `forge-workflow` package.json pointing at one generated extension file, so the install is `pi install npm:forge-workflow`. It needs no second package. [read package.json:2; external docs/packages.md]
7. **Proposed 0.1.0 tier: Experimental.** The reasons are no code, no installed-version proof, and an MCP surface that is two days old. It is the cheapest new harness to promote, and this machine already has a Pi operator.

### P.1 Extension surfaces (verified 2026-10-01)
Sources: [external https://pi.dev; https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/{configuration,extensions,packages,skills,prompt-templates,mcp,security,cli,rpc}.md; examples at /packages/coding-agent/examples/extensions; CHANGELOG via raw.githubusercontent.com]

- **Extensions (the plugin unit).**
  - Format: a TS/JS module, `export default function (pi: ExtensionAPI) {...}`, loaded through `jiti`, so TS needs no build step. Pi loads direct files, or directories that hold `index.ts` or `index.js`.
  - Locations: `~/.pi/agent/extensions/`, project `.pi/extensions/` (trust-gated), `-e <path|npm:...>`, or packages.
  - API: `registerTool`, `registerCommand`, `registerShortcut`, `registerFlag`, `on(event)`, `sendMessage`/`sendUserMessage`, `appendEntry`, `registerProvider`, `registerMcpServer`, `registerVirtualModel`, and `setActiveTools`/`getActiveTools`.
  - UI: `ctx.ui.notify/confirm/custom` (TUI components).
  - Modes: extensions load in interactive, RPC, JSON and print modes. JSON and print have no UI; guard with `ctx.mode === "tui"`.
- **Events.**
  - Lifecycle: `session_start`, `session_shutdown`, `before_agent_start`, `turn_end`, `agent_settled` and `agent_end`.
  - Messages and context: `context`, `context_with_system` and `message_end`.
  - Tools: `tool_call` (can block), `tool_result` and `tool_execution_start/update/end`.
  - Other: `user_bash`, `mcp_servers_change` and `project_trust` (per security.md).
  - Shipped examples include `permission-gate.ts`, `protected-paths.ts`, `confirm-destructive.ts`, `dirty-repo-guard.ts`, `git-checkpoint.ts`, `subagent/`, `plan-mode/`, `todo.ts` and `claude-rules.ts`.
- **Pi packages (distribution).**
  - Manifest: a `package.json` `"pi"` key with `extensions`, `skills`, `prompts` and `themes`, or the conventional directories of the same names.
  - Install: `pi install npm:<pkg>@<ver>`, `pi install git:github.com/<o>/<r>@<ref>`, or a local path. `-l` writes to project `.pi/settings.json` instead of `~/.pi/agent/settings.json`.
  - Management: `pi list`, `pi remove`, `pi update`, `pi config` (per-resource filtering) and `pi -e npm:...` (try without persisting).
  - Pinning and discovery: versioned specs and git refs are pinned. A gallery lists packages with the `pi-package` keyword.
  - Trust: "Review third-party package source before installing it." There is no review or signing. Whether `pi install` runs npm lifecycle scripts is **not documented** (rung 1). Pi itself recommends `npm i -g --ignore-scripts`.
- **Skills.**
  - Format: the Agent Skills spec, with `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` and `disable-model-invocation`.
  - Discovery: `~/.agents/skills`, `.agents/skills` (cwd up to the repo root), `~/.pi/agent/skills`, `.pi/skills`, settings paths and packages.
  - Invocation: `/skill:<name>`.
  - `.claude/skills` is **not** listed (rung 1 absence).
- **Commands.** Prompt templates are `.md` files with `description` and `argument-hint`, plus `$1`, `$@`/`$ARGUMENTS` and `${1:-x}`. They live in `~/.pi/agent/prompts/`, `.pi/prompts/` (trusted) or packages, and the filename is the command (`/review`). Extensions can also call `registerCommand`.
- **Context and rules.** Pi reads `AGENTS.override.md`, `AGENTS.md` and `CLAUDE.md` from the agent dir, the cwd and parent dirs, with no trust needed. `SYSTEM.md` and `APPEND_SYSTEM.md` replace or extend the system prompt.
- **Subagents.** Pi has no native subagent ("Spawn Pi instances via tmux, or build your own with extensions, or install a package"). A reference `subagent/` extension exists. [external pi.dev; examples]
- **MCP (new in 0.99.0, 2026-09-29).**
  - Config: `~/.pi/agent/mcp.json` and project `.pi/mcp.json` (read only after trust), with root key `mcpServers`.
  - Transports: stdio and streamable HTTP. "The legacy SSE transport is not supported."
  - Auth: OAuth with dynamic registration (tokens in `~/.pi/agent/mcp-auth.json`), plus `pi mcp add/list/login/logout` and `/mcp`.
  - Per-tool exposure: `direct`, `codemode` (default: callable only from model-written JS in a QuickJS sandbox), `deferred` (via tool_search) or `hidden`.
  - Limits: results over 20 KB are truncated, and MCP Apps (`ui://`) are omitted.
  - It can be disabled per project as the `builtin:mcp` extension.
- **Settings, permissions, trust.**
  - Settings: `~/.pi/agent/settings.json` and `.pi/settings.json`.
  - Project trust is resolved in this order: `--approve`/`--no-approve`, then an extension's `project_trust` handler, then `~/.pi/agent/trust.json`, then `defaultProjectTrust` (default `ask`).
  - Trust gates `.pi/*` and project `.agents/skills`.
  - There is **no per-tool approval**. Pi "does not ask for approval before every tool call", and the docs say watching transcripts or trust "do not create a security boundary". Use containers, or build a confirmation flow as an extension.
  - Tool allowlists are set with `--tools` and `--exclude-tools`.
- **Headless.** `-p/--print`, `--mode json` (a JSONL event stream), `--mode rpc` (JSONL over stdin/stdout, with an extension-UI sub-protocol, finishing on `agent_settled`), and a TypeScript SDK.
- **UI.** TUI custom components, overlays, header, footer and status line, themes and keybindings, all through extensions.

P7 §2.6 row for Pi:

| Surface | Pi |
| --- | --- |
| Plugin manifest | `package.json` `"pi"` key (extensions/skills/prompts/themes), TS extension modules |
| Marketplace | none reviewed; npm/git + `pi-package` gallery |
| Reads `.agents/skills` | yes, project copy after trust |
| Pre-tool deny hook | extension `tool_call` → `{block:true}` |
| Subagent files | none (extension or tmux) |
| MCP | stdio/streamable HTTP, OAuth (since 0.99.0); no SSE |
| Headless | `-p`, `--mode json`, `--mode rpc`, SDK |
| Plugin trust | project-trust prompt for `.pi/*`; packages unreviewed |

### P.2 What Forge does for Pi today
- **Nothing harness-specific.** `pi` is not in `HARNESS_IDS` [read lib/harness-capability-matrix.js:5], and the searches listed in P.0 item 5 returned zero hits.
- **What does reach Pi by accident.** The committed `.agents/skills` and `AGENTS.md` [read AGENTS.md "Skill sync" learning] are both on Pi's discovery path. Pi would therefore see Forge skills (after trust) and the workflow policy. That makes it a **zero-adapter path, like OpenCode's**, and it is untested. [inferred from P.1]
- **Gaps:**
  - no gate (Pi has no permission layer, and git hooks are the only enforcement);
  - no session-start orientation;
  - no Kernel tool surface beyond bash plus `forge` CLI, which works because Pi's bash is unrestricted;
  - no setup renderer, no capability-matrix row and no conformance lane.

### P.3 Ideal Forge plugin for Pi (proposed)
**Shape: one generated Pi extension, shipped inside the one npm package.** Add `"pi": { "extensions": ["./plugin/pi/forge.js"], "prompts": ["./plugin/pi/prompts"] }` to `forge-workflow`'s package.json. Paths are illustrative and must sit inside the package `files`.

| Forge block | Pi carrier |
| --- | --- |
| Skills / stage procedures | Native `.agents/skills`, with no copy. **Do not** also declare `skills` in the package manifest, or a trusted Forge project would load each skill twice. Possible collision handling is not documented [inferred]. For non-Forge repos, the extension can add the bundled skills only when `.agents/skills/using-forge` is absent. |
| Kernel issues, recap, gate status, memory (tools) | **Primary:** the extension calls `pi.registerMcpServer` for the `forge mcp` stdio server (D-P7b). A user-level package registration avoids the `.pi/mcp.json` trust question, and it sets `direct` exposure for the 4–6 core tools so they don't hide behind codemode. **Fallback** for Pi < 0.99 or when `builtin:mcp` is disabled: `registerTool` wrappers that spawn `forge <verb> --json`, which is Pi's own historical "CLI tool" recommendation. |
| Gates | `pi.on("tool_call")` → the same `.forge/hooks/forge-native-hook.js` adapter → `{block:true, reason}`. Fail open when Forge is not set up. Git hooks stay authoritative, which matters more here than in any other harness because Pi has no permission layer. |
| Orientation | `session_start` (or `before_agent_start`) runs `forge recap --json` and injects it with `sendMessage`. A TUI status-line widget is optional and guarded by `ctx.mode === "tui"`. |
| Stage commands | Generated prompt templates (`/forge-plan`, etc.) that delegate to `/skill:<stage>`, or `registerCommand`. Prefer only the prompt templates the generator can emit from the catalog. |
| Reviewer roles (subagents) | **Not in 0.1.0.** Pi has no subagent contract. The reviewer procedure stays a skill. Later options: a `registerTool("forge_review")` that spawns `pi -p` with the reviewer skill, or interop with Pi's `subagent/` pattern. |
| Policy | AGENTS.md, read natively. |

- **Install.** `pi install npm:forge-workflow` (user) or `pi install -l npm:forge-workflow` (project). `forge setup --harness pi` could print or run that line, and it writes nothing into `.pi/`.
- **What the user experiences.** Forge skills appear under `/skill:`. Recap context appears at session start. Forge tools are callable natively. A protected-path write is blocked with Forge's reason. Pi's own loop, models, providers (including the `openai-codex` route Agent Companion uses), TUI, sessions and trust prompts are untouched.
- **Can the canonical generator emit it?** Yes, at low risk [inferred]. The extension is one static JS file whose tool list, hook wiring and prompt templates come from the capability catalog (P7 §3). The `"pi"` key is a package.json fragment under the drift gate. Pi-specific renderer facts are the event names (`tool_call`, `session_start`), the block return shape, the MCP exposure field, and the lack of agent files. The Agent Plugins `plugin.json` is **not** read by Pi (no mention in the docs, so rung 1), so Pi needs its own small emitter.
- **Effort: S (about 2–3 days)** [inferred]. That covers the extension and prompts emitter (about 1 day), adding `pi` to HARNESS_IDS and the matrix (about 0.5 day), and an L2 lane using `pi --mode json -e ./plugin/pi/forge.js --approve` (about 1 day). L2 asserts four things: the skill is discovered, the forge tool runs, the gate blocks, and recap is injected.
- **Risk: medium.**
  - Pi changes quickly (0.84 → 0.99.2 in about five weeks, with tool renames to `builtin:<name>` in 0.99.0), so pin a minimum Pi version in the L2 lane.
  - MCP is two days old.
  - Packages are unreviewed and run in-process.
  - Pi has no approval layer, so Forge's gate is *the only* pre-tool control. It must not be presented as a security boundary, because Pi's own docs say it is not one.

**Alternatives rejected:**
- **A separate `pi-forge` npm package.** It breaks the one-package rule and duplicates the version train.
- **Project-local `.pi/extensions/forge.ts` written by setup.** It is trust-gated and copied per repo, which reintroduces mirrors; keep it only as an opt-in fallback.
- **MCP-only.** It cannot block tool calls or inject orientation, and the default `codemode` exposure would hide Forge tools.
- **CLI-and-skills only.** This works today, but it gives no gate and no orientation, which wastes the strongest hook API of the six harnesses.

**What would change this:**
- If `pi install npm:` cannot load an extension from a non-`pi-package` package, or chokes on Forge's dependency footprint, fall back to `pi install git:...` with a subpath, or to setup-written `.pi/extensions`.
- If 0.99's MCP churns, make the `registerTool` CLI wrapper primary.

### P.4 Cross-harness consistency
Pi fits the P7 §3 model without new concepts. It is a sixth emitter target producing an extension file, prompt templates and a package.json fragment. Skills and AGENTS.md need no Pi body. Parity is tested through the same L1/L2/L3 layers:
- **L1:** extension type-check against `@earendil-works/pi-coding-agent` types.
- **L2:** `pi --mode json` headless smoke.
- **L3:** one operator transcript per release. Agent Companion's Pi route on this machine makes L3 cheap. [inferred]

### P.5 Certification tier for 0.1.0
**Experimental.** This follows P7's rule that no tier goes above experimental without an installed-version L2 pass, and today Pi has no code and no proof.
- **Exposure-first case for listing it at all.** Pi has a large audience (about 111k GitHub stars [external github.com/earendil-works/pi, 2026-10-01]). It is also the base the "pi-package" gallery is built on. "Experimental, installable via `pi install npm:forge-workflow`" captures that reach without a false claim.
- **Why not Supported.** The MCP path is two days old. Pi's release cadence is weekly-scale. There is no operator proof yet.
- **What would change it.** If the L2 lane passes on a pinned Pi (>= 0.99.2) before the 0.1.0 cut, promote Pi to Supported (option B below). The marginal cost is low, because the operator already exists on this machine.

### P.6 Recommended plan changes (Pi)
1. Add a **Pi row to the §4 support table**: Experimental, covering the zero-adapter path plus the generated extension in `forge-workflow`, promoted on an L2 pass.
2. **Add `pi` to `HARNESS_IDS`** and the capability matrix with evidence URLs:
   - skills `native` (via `.agents/skills`, trust-gated);
   - MCP `native` (since 0.99.0);
   - pre-tool deny `packaged` (extension);
   - subagents `unsupported`;
   - session-start `packaged`.
3. **Extend D-P7a (one generated plugin tree)** to emit the Pi extension, its prompt templates and the `"pi"` package.json key, all under the drift gate.
4. **Make D-P7b (`forge mcp`) Pi-aware.** Pi registers it with `registerMcpServer` and `direct` exposure. Keep the `registerTool`→CLI fallback in the same generated file.
5. **Add an L2 Pi lane:** `pi --mode json --approve -e <ext>` with the four assertions above, pinned to Pi >= 0.99.2.
6. Document clearly that **on Pi, Forge's gate is advisory UX plus git-hook enforcement, not a sandbox**. Point to Pi's containerization guidance.
7. Defer Pi subagent and reviewer delegation and a `pi-package` gallery listing to 0.2, and file each as a Kernel issue.

### P.7 Open questions for the owner (Pi)
1. **Pi tier for 0.1.0.**
   - A: experimental (zero-adapter path plus the generated extension, promoted on an L2 pass).
   - B: supported, which requires an L2 pass and one L3 transcript before the cut (about 1 extra day, operator available).
   - C: later (docs only).
   - **Default A.** It gives exposure without a false claim, and B is cheap if time allows.
2. **How Forge tools reach Pi.**
   - A: `forge mcp` registered by the extension (`direct` exposure), with the CLI-wrapper fallback.
   - B: CLI-wrapper tools only (no MCP dependency on a two-day-old feature).
   - C: skills plus bash `forge` only.
   - **Default A.** It uses the one shared server from D-P7b, and the fallback covers MCP churn.
3. **Distribution.**
   - A: a `"pi"` key in the one `forge-workflow` package (`pi install npm:forge-workflow`).
   - B: setup writes `.pi/extensions/forge.js` per project.
   - C: a separate `pi-forge` package.
   - **Default A.** It keeps the one-package rule, and B is the fallback if npm-package loading fails the L2 check.
4. **Pi subagents.**
   - A: none in 0.1.0 (reviewer stays a skill).
   - B: a `forge_review` tool that spawns `pi -p`.
   - **Default A.** Pi deliberately has no subagent contract, so wait for real demand.

**Confidence (Pi): medium.** The surfaces come from Pi's primary docs and changelog, summarized by a fetch model, so re-check field names when implementing. The weakest points are:
- whether `pi install npm:` loads extensions from a large non-`pi-package` package;
- whether npm lifecycle scripts run;
- duplicate-skill behavior;
- the stability of 0.99's MCP and extension API.

None of these was run.
