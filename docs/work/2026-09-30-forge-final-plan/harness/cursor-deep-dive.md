# Cursor harness deep dive

Decisions needed: none for this research phase. Integration choices and defaults are at the end.

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-deep-cursor-20261001",
  "contextDigest": "862b5364e25fd0cfef6791705481f195ea1e0e2e8fca0022621b55a157ea581d",
  "context": { "summary": "Forge harness deep dive: Cursor." },
  "cwd": "."
}
```

Research date: **2026-10-01**. Cursor's proprietary implementation is outside the inspected evidence. `[external]` means a primary public source retrieved on this date; `[ran]` means the local command actually returned; `[read]` means the supplied brief or a local planning file; `[proposed]` and `[inferred]` identify design and estimates. Documentation is rung 2, discovery checks are rung 4 for discovery only, and neither establishes live feature behavior. No browser, context-mode tools, installation, authenticated agent run, Git operation, GitHub write, or Kernel mutation was used. Only this dossier is an authorized output.

## Bottom line

1. Cursor's native plugin can carry all six integration surfaces: rules, skills, agents, commands, hooks, and MCP. [external: [plugin reference](https://cursor.com/docs/reference/plugins), 2026-10-01]
2. `preToolUse` explicitly covers `Write`; the compatibility reference maps `Edit` to `Write`, resolving P7's documentation gap. [external: [third-party hooks](https://cursor.com/docs/reference/third-party-hooks), 2026-10-01]
3. CLI plugin hooks are explicitly confirmed in the August 11 release notes, including `--plugin-dir` loading. [external: [CLI changelog](https://cursor.com/docs/cli/changelog), 2026-10-01]
4. Installed CLI discovery passed on **2026.09.26-dd393fe**; activation and edit denial were not executed. [ran: `cursor-agent --version`, `--help`]
5. Custom commands have a current plugin contract; the old commands URL redirects to skills and command migration guidance. [external: [current help](https://cursor.com/help/customization/skills), 2026-10-01]
6. `preToolUse: ask` is unenforced; use explicit denial for Forge gates. [external: [hooks](https://cursor.com/docs/hooks), 2026-10-01]
7. A portable plugin's MCP paths need Cursor variable handling; `${PLUGIN_ROOT}` is not expanded. [external: [plugin reference](https://cursor.com/docs/reference/plugins), 2026-10-01]
8. Public marketplace submissions and updates receive manual review; acceptance must not gate Forge's release. [external: [marketplace security](https://cursor.com/help/security-and-privacy/marketplace-security), 2026-10-01]
9. Forge should ship a generated native plugin, preserve Kernel authority, and certify desktop, CLI, and cloud separately. [proposed; read: `north-star.md`, items 3, 4, 12]
10. Use observed tool and hook receipts plus file assertions for support claims; model text and CLI help are insufficient. [proposed; inferred from the proof boundaries above]

## 1. Architecture and evidence boundaries

### Runtime, turns, and tool dispatch

Cursor exposes interactive Agent, read-only Ask, and Plan modes, plus print execution and session continuation. The local executable advertises full write/shell access in print mode, `--mode ask|plan`, `--resume`, `--continue`, `--model`, and sandbox controls. The documented JSON stream has model messages, started/completed tool calls, and a terminal result. These are observable boundaries, not source evidence for the proprietary scheduler. [ran: installed `--help`; external: [CLI overview](https://cursor.com/docs/cli/overview), [output format](https://cursor.com/docs/cli/reference/output-format), 2026-10-01]

The useful integration model is: native instructions and tool discovery → model turn → tool approval/hook boundary → native tool execution → result/context injection → further turn or completion. This is an **inferred operational model**, not a recovered agent-loop implementation. The exact tool registry, scheduling algorithm, order between generic and specialized permission hooks, atomicity of concurrent operations, default tool budgets, and internal stopping heuristics remain **UNKNOWN**. Forge should not emulate those internals. [inferred; external boundary evidence: [hooks](https://cursor.com/docs/hooks), 2026-10-01]

Subagents provide clean contexts and foreground/background execution. Their task prompt must carry needed context; prior parent history is not automatically available. The August 11 CLI release notes say single-turn/headless runs now drain delegated subagents before exiting. That is a documented fix, not a measurement made here. [external: [subagents](https://cursor.com/docs/subagents), [CLI changelog](https://cursor.com/docs/cli/changelog), 2026-10-01]

### Context, persistence, and models

Rules enter the beginning of model context. Skills load progressively, with supporting resources requested as needed. CLI `/summarize` or `/compress` reduces context; `preCompact` exposes compaction measurements but cannot rewrite the summary. Resume is a native operation. The precise CLI/IDE chat database location, checkpoint transaction guarantees, and compaction retention algorithm were not verified; do not build a Forge database reader around guessed internal paths. [external: [rules](https://cursor.com/docs/rules), [skills](https://cursor.com/docs/skills), [slash commands](https://cursor.com/docs/cli/reference/slash-commands), 2026-10-01]

The official `@cursor/sdk` distinguishes a durable **Agent** from one submitted **Run**. Local execution keeps the loop/filesystem local while inference remains hosted. Its documented stores include `SqliteLocalAgentStore`, `JsonlLocalAgentStore`, and a custom `LocalAgentStore`; JSONL storage uses `agents.ndjson`, `runs.ndjson`, `run_events.ndjson`, and `checkpoints.ndjson`. This is a public SDK storage contract, **not proof of the CLI's storage format**. [external: [TypeScript SDK](https://cursor.com/docs/sdk/typescript), 2026-10-01]

Use native model discovery rather than hardcoded provider IDs. Installed help exposes `models`, `--list-models`, bracketed model parameters, and a `bedrock` configuration command. The SDK and cloud API expose model IDs/parameters; actual availability is account-dependent. Subagent configuration can fall back when team restrictions, plan access, or legacy Max Mode prevent the requested model. Capture the model that ran in receipts. Arbitrary provider replacement and offline inference are not established by this research. [ran: installed `--help`; external: [subagents](https://cursor.com/docs/subagents), [cloud API](https://cursor.com/docs/cloud-agent/api/endpoints), 2026-10-01]

### Configuration is surface-specific

| Surface | Resolution contract | Forge consequence |
| --- | --- | --- |
| Rules | Team → Project → User; applicable guidance merges; more specific nested `AGENTS.md` overrides parent guidance | Instructions are guidance, not an enforcement boundary |
| Custom agents | Project beats user for matching names; `.cursor/` beats `.claude/` and `.codex/` | One owned native agent name; prevent accidental shadowing |
| Hook sources | Enterprise → Team → Project → User; all matching handlers execute; denial dominates | Never assume a project hook replaces managed hooks |
| Hook nonpermission fields | Last response wins for fields such as `followup_message`; messages concatenate | Lower-priority hooks can overwrite continuation text |
| Plugin components | Explicit manifest paths replace discovery for that component | Listing `skills` prevents a second default scan |
| Marketplace entry | Per-plugin manifest overrides marketplace entry values | Manifest is the canonical generated metadata |
| Local plugin names | Installed marketplace plugin takes precedence over same-name local copy | Test against an isolated profile |
| CLI configuration | Global `~/.cursor/cli-config.json`; project `.cursor/cli.json` permits only permission settings | Do not put model/UI settings in project CLI config |
| SDK MCP | Per-send inline → creation inline → plugins → project → user; selected by `local.settingSources` | SDK defaults must not be mistaken for CLI discovery |

Sources for the table: [external: [rules](https://cursor.com/docs/rules), [subagents](https://cursor.com/docs/subagents), [hooks](https://cursor.com/docs/hooks), [plugins](https://cursor.com/docs/plugins), [plugin reference](https://cursor.com/docs/reference/plugins), [CLI configuration](https://cursor.com/docs/cli/reference/configuration), [SDK configuration](https://cursor.com/docs/sdk/typescript#configuration-sources-at-a-glance), 2026-10-01]. A single universal global/project/local precedence rule would be incorrect. The SDK's general precedence introduction is broader than its detailed hooks row, which correctly defers to hook layering; use the surface's specific contract. [inferred]

## 2. Extension points

### 2.1 Native plugins, discovery, and marketplace review

**Cursor Plugin:** `.cursor-plugin/plugin.json`. **Agent Plugin:** root `plugin.json`, conforming to the Agent Plugins standard; its portable core covers skills/MCP. Cursor-specific rules, agents, commands, hooks, and variables belong in the Cursor format. Both formats are documented as supported. [external: [plugins](https://cursor.com/docs/plugins), 2026-10-01]

Manifest API inventory, with property names/types rather than copied documentation prose:

| Field | Contract |
| --- | --- |
| `name` | Required string; lowercase identifier with alphanumerics, hyphens, periods; alphanumeric ends |
| `description`, `version` | String; semantic version for `version` |
| `author` | Object: `name`, optional `email` |
| `homepage`, `repository`, `license`, `logo` | Strings |
| `keywords` | Array |
| `skills`, `rules`, `agents`, `commands` | String or array of relative component paths |
| `hooks` | Path string or inline configuration object |
| `mcpServers` | Path string, object, or array of either |
| `variables` | Restricted JSON Schema object; declares configuration names, not secret values |

Automatic discovery: `skills/*/SKILL.md`, `rules/`, `agents/`, `commands/`, `hooks/hooks.json`, root `mcp.json`. Root `SKILL.md` is a single-skill fallback when neither `skills/` nor explicit `skills` exists. Plugin discovery accepts broader rule/agent file extensions than project rules; use `.mdc` for rules regardless. The official template also has `displayName`, which is absent from the reference's field table: do not treat that table as a complete machine schema. [external: [reference](https://cursor.com/docs/reference/plugins), [official template manifest](https://raw.githubusercontent.com/cursor/plugin-template/main/plugins/starter-advanced/.cursor-plugin/plugin.json), 2026-10-01]

**Discovery/trust:** local development uses `~/.cursor/plugins/local/<name>/` and an editor reload; local imports must be allowed. Enterprise disables that setting by default. Symlinks whose targets resolve outside the local plugin folder are skipped. CLI `--plugin-dir <path>` is a separate documented/advertised loader. For extension-registered directories, a manifest can be optional and folder discovery applies; this exception does not remove the manifest requirement for published Cursor Plugins. [external: [plugins](https://cursor.com/docs/plugins), [extension API](https://cursor.com/docs/extension-api); ran: installed `--help`, 2026-10-01]

**Marketplace manifest:** `.cursor-plugin/marketplace.json`; required `name`, `owner.name`, `plugins[]`; optional `metadata.description`, `metadata.version`, `metadata.pluginRoot`. Entries require `name`, with `source` identifying a directory or a path/options object. Maximum manifest size is 10 MB. Relative manifest paths must not escape via `..` or absolute paths. [external: [reference](https://cursor.com/docs/reference/plugins), 2026-10-01]

**Review process:** submit a public Git repository at [Publish](https://cursor.com/marketplace/publish). Valid manifests/frontmatter, usage/configuration README, local testing, declared variable placeholders, and valid paths form the submission checklist. Public listings are curated and manually reviewed; plugins must be open source, updates are reviewed, and risky plugins can be removed. No acceptance SLA or reproducible public review algorithm was established. Listing approval and runtime approval are distinct. [external: [submission reference](https://cursor.com/docs/reference/plugins#submitting-a-plugin), [marketplace security](https://cursor.com/help/security-and-privacy/marketplace-security), 2026-10-01]

Private team marketplaces offer Default Off, Default On, and Required distribution. Teams gets one marketplace; Enterprise permits unlimited marketplaces. GitHub App auto-refresh can re-index at most once per ten minutes; manual refresh also exists. Local import availability and public marketplace approval must be treated as separate deployment constraints. [external: [plugins](https://cursor.com/docs/plugins), 2026-10-01]

The official [cursor/plugins](https://github.com/cursor/plugins) repository supplies maintained examples; [cursor/plugin-template](https://github.com/cursor/plugin-template) has simple/advanced starters and `node scripts/validate-template.mjs`. That validator validates the template's conventions, not every hidden runtime property. Its README names an older direct submission route; prefer the current publish page. [external: [template README](https://raw.githubusercontent.com/cursor/plugin-template/main/README.md), [official plugin README](https://raw.githubusercontent.com/cursor/plugins/main/README.md), 2026-10-01]

### 2.2 Rules and instruction files

Project rules: `.cursor/rules/*.mdc`; frontmatter `description`, `globs`, `alwaysApply`. `alwaysApply: true` always includes the body. Otherwise globs attach it to matching context files; description-only rules are selected by the agent; neither field means manual `@rule` use. Plain `.md` in project `.cursor/rules` is ignored. `AGENTS.md` is plain Markdown, supports nested directories, and combines parent/specific instructions. Team rules precede project/user rules. [external: [rules](https://cursor.com/docs/rules), 2026-10-01]

**Proposed Forge use:** retain a short root `AGENTS.md` pointer to the configured solution and Kernel authority. Emit `.mdc` only for useful file scoping. Do not force a TDD ladder into every project or represent an instruction as an enforceable gate. This follows the owner's platform/reference-solution distinction. [proposed; read: `docs/work/2026-09-30-forge-final-plan/north-star.md`, definition items 1–4, 12]

### 2.3 Skills and custom modes

Discovery: project/user `.agents/skills`, `.cursor/skills`; compatibility `.claude/skills` and `.codex/skills`; plugin skills. Nested project skill roots are automatically scoped. `SKILL.md` requires matching `name` and relevance `description`; optional `paths`, `disable-model-invocation`, `icon`, `color`. Resources can use `scripts/`, `references/`, `assets/`. Invocation is `/skill-name` or attachment; custom modes pin a skill. Only user `~/.cursor/skills` participates in opt-in cloud skill sync, not global `.agents/skills`. [external: [skills](https://cursor.com/docs/skills), [skill help](https://cursor.com/help/customization/skills), 2026-10-01]

The CLI changelog additionally documents `user-invocable: false`; the skills page's frontmatter table does not list it. Preserve the distinction between suppressing user invocation and suppressing model invocation; verify both on the pinned target. Nested hidden-directory scanning changed in August. Do not assume duplicate-name precedence or all symbolic-link behavior from the presence of several discovery roots: neither was behaviorally tested here. [external: [CLI changelog](https://cursor.com/docs/cli/changelog), 2026-10-01]

**Proposed Forge use:** keep one canonical skill source, generate the distributable plugin assets, and use `.agents/skills` for ordinary project discovery. A packaged copy needed by Cursor's local-plugin containment rule is a generated distribution artifact, not a second editable source. Preserve explicit invocation for shipping/rollback skills.

### 2.4 Custom commands: P7's 404 resolved

Current plugin commands live in `commands/`, accept `.md`, `.mdc`, `.markdown`, `.txt`, and optional `name`/`description` frontmatter. They are prompt workflows, not an arbitrary command-registration callback. Current Customize documentation still includes Commands. The old `/docs/agent/chat/commands` URL now redirects to skill help, whose `/migrate-to-skills` guidance explicitly handles user/workspace slash commands while preserving explicit invocation. [external: [plugin command contract](https://cursor.com/docs/reference/plugins#commands-format), [Customize](https://cursor.com/docs/customize-cursor), [migration help](https://cursor.com/help/customization/skills#how-do-i-migrate-commands-to-skills), 2026-10-01]

The older official indexed commands page identifies project `.cursor/commands/*.md`; historical global command paths should not become a new required Forge dependency without an installed check. There is no verified current `$ARGUMENTS`, shell-interpolation, collision-precedence, or nested-command contract in the inspected current reference. Prefer explicitly invoked skills for new Forge procedures; retain native plugin commands only where they add a distinct prompt entry point. [external: [older official commands reference](https://docs.cursor.com/en/agent/chat/commands), inspected search result 2026-10-01; proposed]

### 2.5 Hooks: exact event contract inventory

Native project/user files use `{ "version": 1, "hooks": { "event": [handler] } }`. Plugin `hooks/hooks.json` examples omit `version`; the official starter confirms that shape. Keep project and plugin envelopes separately validated instead of assuming identical requirements. Handlers expose `command`, `type: command|prompt`, `timeout` in seconds, `matcher`, `failClosed`, and `loop_limit`; prompt handlers also use `prompt` and optional `model`. [external: [hooks configuration](https://cursor.com/docs/hooks#configuration), [official starter hooks](https://raw.githubusercontent.com/cursor/plugin-template/main/plugins/starter-advanced/hooks/hooks.json), 2026-10-01]

**Common API fields:** `conversation_id:string`, `generation_id:string`, `model:string`, optional `model_id:string`, optional `model_params:{id,value}[]`, `hook_event_name:string`, `cursor_version:string`, `workspace_roots:string[]`, `user_email:string|null`, `transcript_path:string|null`. `workspaceOpen` omits conversational fields. The table below inventories hook-specific property names and return fields; it is technical API data, not a claim that undocumented tool-input subtypes have a stable schema. Source for every row: [external: [hook reference](https://cursor.com/docs/hooks#reference), 2026-10-01].

| Event / boundary | Hook-specific input properties | Consumed return properties / capability |
| --- | --- | --- |
| `sessionStart` / conversation creation | `session_id`, `is_background_agent`, `composer_mode` (`agent|ask|edit` examples) | `env`, `additional_context`; nonblocking |
| `sessionEnd` / conversation termination | `session_id`, `reason:completed|aborted|error|window_close|user_close`, `duration_ms`, `is_background_agent`, `final_status`, optional `error_message` | None; response logged |
| `preToolUse` / before any native tool | `tool_name`, `tool_input:object`, `tool_use_id`, `cwd`, optional `agent_message` | `permission:allow|deny`, `updated_input:object`, `user_message`, `agent_message` |
| `postToolUse` / success | `tool_name`, `tool_input`, `tool_output:string` (JSON-encoded result), `tool_use_id`, `cwd`, `duration` | `additional_context`; `updated_mcp_tool_output:object` only for MCP |
| `postToolUseFailure` / error, timeout, denial | `tool_name`, `tool_input`, `tool_use_id`, `cwd`, `error_message`, `failure_type:error|timeout|permission_denied`, `duration`, `is_interrupt` | `additional_context` |
| `subagentStart` / before Task spawn | `subagent_id`, `subagent_type`, `task`, `parent_conversation_id`, `tool_call_id`, `subagent_model`, `is_parallel_worker`, optional `git_branch` | `permission:allow|deny`, `user_message` |
| `subagentStop` / completion/error/abort | `subagent_type`, `status:completed|error|aborted`, `task`, `description`, `summary`, `duration_ms`, `message_count`, `tool_call_count`, `loop_count`, `modified_files`, `agent_transcript_path` | `followup_message` only on completed status |
| `beforeShellExecution` / shell approval | `command`, `cwd`, `sandbox:boolean` | `permission:allow|deny|ask`, `user_message`, `agent_message` |
| `afterShellExecution` / shell result | `command`, `output`, `duration`, `sandbox` | No documented mutation contract |
| `beforeMCPExecution` / MCP approval | `tool_name`, `tool_input:string` (JSON), `mcp_server_name`; remote `url`/`mcp_server_url` or stdio `command` | `permission:allow|deny|ask`, `user_message`, `agent_message` |
| `afterMCPExecution` / MCP result | `tool_name`, `tool_input:string`, `mcp_server_name`, optional `mcp_server_url`, `result_json:string`, `duration` | No documented mutation contract; use `postToolUse` for output replacement |
| `beforeReadFile` / Agent read | `file_path`, `content`, `attachments:{type:file|rule,file_path}[]` | `permission:allow|deny`, `user_message` |
| `afterFileEdit` / Agent edit | `file_path`, `edits:{old_string,new_string}[]` | Observation; formatter can separately change files |
| `beforeTabFileRead` / Tab read | `file_path`, `content` | `permission:allow|deny` |
| `afterTabFileEdit` / Tab edit | `file_path`, `edits` with `old_string`, `new_string`, `range:{start_line_number,start_column,end_line_number,end_column}`, `old_line`, `new_line` | None |
| `beforeSubmitPrompt` / before backend submission | `prompt`, `attachments:{type:file|rule,file_path}[]` | `continue:boolean`, `user_message` |
| `afterAgentResponse` / assistant message complete | `text` | No documented control return |
| `afterAgentThought` / thinking block complete | `text`, optional `duration_ms` | None |
| `preCompact` / summarization boundary | `trigger:auto|manual`, `context_usage_percent`, `context_tokens`, `context_window_size`, `message_count`, `messages_to_compact`, `is_first_compaction` | `user_message`; observation only |
| `stop` / loop termination | `status:completed|aborted|error`, `loop_count` | `followup_message` |
| `workspaceOpen` / workspace or folder change | `hook_event_name`, `cursor_version`, `workspace_roots`, `user_email` | `pluginPaths:string[]` of absolute directories |

**Permission semantics and failures:** `preToolUse` schema accepts `ask` but current callers do not enforce it; `subagentStart` treats `ask` as denial. `sessionStart` accepts `continue`/`user_message` in schema but does not enforce blocking. Exit 0 consumes valid JSON, exit 2 blocks, other failures ordinarily fail open; `failClosed:true` also blocks crashes/timeouts/no output. Invalid permission JSON blocks even without `failClosed`. Session-start/end are fire-and-forget. Stop/subagentStop follow-ups default to five per script; `null` removes the cap. Exact default timeouts and scheduling of multiple handlers are not established. [external: [hooks](https://cursor.com/docs/hooks), 2026-10-01]

**Edit coverage resolution:** generic tool matchers include `Shell`, `Read`, `Write`, `Grep`, `Delete`, `Task`, `MCP:<tool_name>`. Third-party tool mapping explicitly includes `Edit → Write`, `Bash → Shell`, and WebFetch/WebSearch. Thus pre-edit denial is a documented native capability. Exact `tool_input` fields for edit/patch/delete implementations still need a captured installed-version fixture; do not build a path classifier from the shell example's schema. Generic Agent hooks do not establish Tab pre-write denial. [external: [third-party hook tool mapping](https://cursor.com/docs/reference/third-party-hooks#tool-name-mapping), [hooks](https://cursor.com/docs/hooks), 2026-10-01]

**Trust, loading, and environment:** trusted project hooks run from project root; user hooks from `~/.cursor`; managed hooks from their managed directory. Sources merge as described in §1. Config files are watched/reloaded. Environment includes `CURSOR_PROJECT_DIR`, `CURSOR_VERSION`, optional `CURSOR_USER_EMAIL`, optional `CURSOR_TRANSCRIPT_PATH`, remote-workspace `CURSOR_CODE_REMOTE`, and compatibility `CLAUDE_PROJECT_DIR`. Session-start `env` carries to subsequent hooks. Plugin-root expansion must be proved for hook commands separately from MCP expansion. [external: [hooks](https://cursor.com/docs/hooks), 2026-10-01]

**Claude compatibility:** third-party import is controlled by Include Third-Party Plugins, Skills, and Other Configs. Supported settings/hooks are converted, including nested `hookSpecificOutput`. Documented mappings cover Pre/PostToolUse, UserPromptSubmit, Stop, SubagentStop, SessionStart/End, PreCompact; Notification and PermissionRequest are not supported mappings. Native Cursor format remains the explicit integration target. Importing another harness's configuration must not silently install a duplicate Forge gate. [external: [third-party hooks](https://cursor.com/docs/reference/third-party-hooks), 2026-10-01]

**Surface coverage:** desktop has Agent, Tab, and workspace lifecycle surfaces; the docs explicitly say `workspaceOpen` also runs in the CLI. CLI plugin-hook loading was fixed/documented August 11. Cloud supports the fourteen listed Agent events: before/after shell, before read, after edit, generic pre/post/failure, subagent start/stop, before submit, preCompact, response, thought, stop. Cursor-hosted cloud currently excludes sessionStart/End, specialized MCP hooks, Tab hooks, workspaceOpen, user-home hooks, and prompt handlers. Hooks start only after the cloud environment becomes writable. Self-hosted workers have sessionStart/End on worker claim/release. [external: [cloud hook support](https://cursor.com/docs/hooks#cloud-agent-support), [CLI changelog](https://cursor.com/docs/cli/changelog), 2026-10-01]

**Proposed gate adapter:** deterministic Node program; native deny JSON; explicit `failClosed:true` for enforcing handlers; bounded execution; no raw content/tool-input logging; separate generic edit gate, shell classification, and MCP server/tool policy. Keep authoritative Kernel/API checks and delivery hooks outside prompt compliance. `afterFileEdit` is useful evidence but cannot prevent a write. `sessionStart` can orient, not authorize.

### 2.6 Subagents, asynchronous work, and cloud agents

Custom agent files are Markdown with YAML frontmatter in project/user `.cursor/agents`, compatible `.claude/agents`, `.codex/agents`, or plugin `agents/`. Standalone documented fields: `name` (filename fallback), `description`, `model` (default inherit), `readonly:false`, `is_background:false`. Explicit invocation uses `/name` or natural language. Plugin reference documents a smaller name/description subset; richer fields must be certified inside plugins. Foreground blocks for results; background returns immediately. [external: [subagents](https://cursor.com/docs/subagents), [plugin reference](https://cursor.com/docs/reference/plugins#agents-format), 2026-10-01]

A compatibility directory does **not** prove another harness's agent format is accepted: Cursor documents Markdown, while a `.codex/agents` TOML artifact needs its own adapter. Native background subagents, CLI persistent sessions, and remote Cloud Agents are different lifecycles. The CLI exposes `persist`, `worker`, and isolated worktree options; cloud can also give subagents their own machines. Fixed concurrency ceilings and a stable plugin API for replacing the parent scheduler were not established. [ran: installed help; external: [CLI changelog](https://cursor.com/docs/cli/changelog), [August harness changes](https://cursor.com/changelog), 2026-10-01; inferred format distinction]

**Proposed Forge use:** optional readonly spec/quality reviewers with explicit issue/run scope and evidence obligations. Record subagent lifecycle as execution evidence. Do not turn a native Task card, background completion, or Cursor Project into a second issue/lease authority.

### 2.7 MCP, authentication, exposure, and deeplinks

Project `.cursor/mcp.json`, user `~/.cursor/mcp.json`, plugins, team distribution, and extension registration supply MCP servers. Transports include stdio, SSE, and streamable HTTP. Local entries use `command`, `args`, `env`, optional stdio-only `envFile`; remote entries use `url`, `headers`, optional OAuth `auth:{CLIENT_ID,CLIENT_SECRET?,scopes?}`. Interpolation includes `${env:NAME}`, `${userHome}`, `${workspaceFolder}`, `${workspaceFolderBasename}`, `${pathSeparator}`, `${/}`. Static OAuth callbacks differ for desktop and web: `http://localhost:8787/callback` and `https://www.cursor.com/agents/mcp/oauth/callback`. [external: [MCP](https://cursor.com/docs/mcp), 2026-10-01]

Plugin MCP additionally expands `${CURSOR_PLUGIN_ROOT}`/`${CLAUDE_PLUGIN_ROOT}` in command/args/env/cwd; `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` from the portable standard are not expanded. Do not blindly share a portable `mcp.json` with unresolved variables. [external: [plugin MCP reference](https://cursor.com/docs/reference/plugins#mcp-servers), 2026-10-01]

CLI permission tokens support `Mcp(server:tool)` and wildcard exposure decisions. Installed `mcp --help` provides `login`, `list`, `list-tools`, `enable`, `disable`; disable prevents loading/prompting. SDK configuration uses first-match precedence and `local.settingSources`; without it only inline MCP is loaded. Local SDK OAuth reuses an existing app login rather than opening a browser. Server enablement, per-tool permission, and server-side authorization remain separate controls. [ran: installed MCP help; external: [CLI permissions](https://cursor.com/docs/cli/reference/permissions), [SDK MCP configuration](https://cursor.com/docs/sdk/typescript#mcp-servers), 2026-10-01]

The install-link API is `cursor://anysphere.cursor-deeplink/mcp/install?name=<name>&config=<base64-json>`. It distributes configuration and does not prove successful authentication or safe tool access. Never place a credential in a deeplink. An install link for a Forge MCP server is not a complete Forge plugin installation. [external: [plugin install links](https://cursor.com/docs/plugins), 2026-10-01; proposed security boundary]

**Proposed Forge use:** one thin stdio MCP server over public Forge APIs for issue/recap, gate status, configured capabilities, and memory recall. Begin with read tools and explicitly authorized mutations; perform lease/scope checks in the server. The server must not rely on a hook being present, especially in cloud read-only startup. Remote OAuth is an additive cloud transport, not required for local Kernel access.

### 2.8 Permissions, sandbox, settings, and ignores

Global CLI config: `~/.cursor/cli-config.json` (`$env:USERPROFILE\.cursor\cli-config.json` on Windows). Project `.cursor/cli.json` configures permissions only. `CURSOR_CONFIG_DIR` overrides configuration location; Linux/BSD also support `XDG_CONFIG_HOME`. Pure JSON and self-repair are documented. Global schema includes version/editor/permissions, model, approvalMode, sandbox/network, display and attribution settings. Do not put secrets in project config. [external: [CLI configuration](https://cursor.com/docs/cli/reference/configuration), 2026-10-01]

Permission vocabulary: `Shell(commandBase)` with globs/optional `command:args`; `Read(pathOrGlob)`; `Write(pathOrGlob)`; `WebFetch(domainOrPattern)`; `Mcp(server:tool)`. Deny wins; relative paths scope to workspace, absolute paths can target outside it. Installed CLI distinguishes `--force` (unless explicitly denied), `--auto-review`, `--sandbox enabled|disabled`, `--trust`, and `--approve-mcps`. These knobs are distinct. Exact project/global array merge, compound-shell parsing, and Windows filesystem/sandbox enforcement were not behaviorally verified. [external: [permissions](https://cursor.com/docs/cli/reference/permissions), 2026-10-01; ran: installed help]

**Proposed policy:** use native trust/approvals, managed policy where available, a deterministic hook, and public API checks together. Never advertise `.cursorignore`, prompt rules, shell token matching, or post-edit auditing as a complete filesystem sandbox. The actual ignore/access-bypass contract was not investigated in this phase; retain existing policy pending a focused check rather than inventing a security guarantee.

### 2.9 CLI print, JSON, ACP, SDK, and API surfaces

Observed local executable: `~/AppData/Local/cursor-agent/cursor-agent.ps1`. `Get-Command` also found `agent.cmd` and the desktop `cursor.cmd`; these are separate entry points. Only the first was invoked. [ran: `Get-Command cursor-agent,agent,cursor`; `cursor-agent --help`]

| Read-only check | Observed result |
| --- | --- |
| `cursor-agent --version` | `2026.09.26-dd393fe` |
| `cursor-agent --help` | `--plugin-dir` repeatable, `--print`, three output formats, workspace/sandbox/permissions modes |
| `cursor-agent plugin --help` | Marketplace command group |
| `cursor-agent plugin marketplace --help` | `add`, `list`, `remove`, `update` |
| `cursor-agent mcp --help` | `login`, `list`, `list-tools`, `enable`, `disable` |

No login/status/account enumeration was necessary. No plugin installed, no model prompt submitted, and no approval/trust state changed. Latest available binary version is **UNKNOWN**; the checked build is a named installed version, not a latest-version claim.

**Print/output contract:** `agent -p --output-format text|json|stream-json`; optional `--stream-partial-output`. JSON produces one successful result, while failure may produce stderr/nonzero exit without a JSON object. NDJSON emits system/init, user/assistant messages, started/completed `tool_call` with `call_id`, and a successful terminal result. Read/write variants expose paths/results; other calls can use a function representation. Partial assistant deltas must be distinguished from buffered flushes to avoid double counting. Initialization does not document a plugin inventory equivalent to Claude's `system/init.plugins`. [external: [output format](https://cursor.com/docs/cli/reference/output-format), 2026-10-01]

**Documentation conflict:** output-format/parameter pages say default `stream-json`, while the headless guide and installed help say `text`. Set the format explicitly. The headless guide says `--force` enables mutations; current installed help/permission docs describe print as tool-capable with allow/deny controls. Test both permission and hook behavior on the pin instead of treating print as inherently readonly. [external: [parameters](https://cursor.com/docs/cli/reference/parameters), [headless](https://cursor.com/docs/cli/headless), [permissions](https://cursor.com/docs/cli/reference/permissions), 2026-10-01; ran: installed help]

**ACP:** documented `agent acp`, newline-delimited JSON-RPC 2.0 over stdio; initialize → authenticate (`cursor_login`) → session/new or load → prompt → updates/permission responses → optional cancel. Decisions include allow-once, allow-always, reject-once. Clients must answer permission requests and blocking `cursor/ask_question`/`cursor/create_plan`; task/todo/image notifications are nonblocking. Team dashboard MCP is excluded in ACP. This subcommand was not in the inspected root help and was not executed; certify it separately. [external: [ACP](https://cursor.com/docs/cli/acp), 2026-10-01]

**SDK:** `@cursor/sdk`, Node ≥22.13, `Agent.create`, `agent.send`, `run.stream`/`wait`, resume/list/get, local/cloud runtime selection, and typed events. `local.customTools` registers `description`, `inputSchema`, `execute` tools under MCP server `custom-user-tools`; it is local-only and skips interactive approval, although deny/sandbox rules remain. Hooks are file-based, not inline SDK callbacks. A Forge SDK composition must validate authority inside the tool implementation. Use actual published `.d.ts` for implementation, not an invented API. [external: [SDK](https://cursor.com/docs/sdk/typescript), 2026-10-01]

**Cloud API:** current v1 separates durable agent identity from run execution. `POST /v1/agents` creates an agent and initial run; `GET /v1/agents`, `GET /v1/agents/{id}`, and `POST /v1/agents/{id}/runs` support tracking/continuation. Only one active run per agent; conflicts return `409 agent_busy`. Create accepts model parameters, repository refs, cloud/pool/machine target, inline MCP, and custom subagents. Default `workOnCurrentBranch:false` makes a new branch. Durable ACTIVE/IDLE/ARCHIVED state is not a successful run verdict; follow `latestRunId`. Stream/cancel/artifacts/workers/pools have current reference entries. Beta `envVars` can be silently ignored when not enabled; client-supplied agent IDs cannot be combined with it. Do not reuse legacy v0 payloads or grant direct branch writes by default. [external: [cloud API](https://cursor.com/docs/cloud-agent/api/endpoints), 2026-10-01]

### 2.10 Editor extension bridge, UI, and remaining surfaces

Official TypeScript declarations expose `vscode.cursor.mcp.registerServer(config)`/`unregisterServer(name)` and `vscode.cursor.plugins.registerPath(absolutePath)`/`unregisterPath(path)`. This lets a VS Code extension deliver native plugin directories without home-folder copies. Stdio config supplies name plus command/args/env; remote config supplies name plus url/optional headers. Dispose registered paths during extension teardown. [external: [extension API and type declarations](https://cursor.com/docs/extension-api), 2026-10-01]

Cursor Plugins are declarative agent bundles, distinct from editor extensions. Use native Customize, Hooks output channel, agent task cards, MCP UI, and plugin canvases for their intended jobs. The CLI changelog confirms a custom `statusLine` command, but the inspected configuration table does not define its payload/schema; custom status-line compatibility remains unverified. No public Cursor-plugin API for replacing the TUI renderer, adding an arbitrary native tool registry callback, or a separate output-style component was established in the inspected plugin/extension references. This is an inspected-contract boundary, not proof of universal absence. [external: [Customize](https://cursor.com/docs/customize-cursor), [CLI changelog](https://cursor.com/docs/cli/changelog), [extension API](https://cursor.com/docs/extension-api), 2026-10-01]

## 3. What Forge can exploit, ranked

Everything in this section is **proposed**, using the verified contracts above. Rank reflects practical integration value rather than novelty.

| Rank | Native advantage | Forge capability | User-visible result | Boundary |
| --- | --- | --- | --- | --- |
| 1 | One six-component plugin | Configured blocks, skills, tools, gates | One coherent install instead of independent file projections | Preserve a single generated source and native trust |
| 2 | Generic deny before `Write`/Task, specialized shell/MCP gates | Gates and work authority | Stop an unauthorized operation before its effect | Fail closed; capture actual tool-input variants |
| 3 | CLI local plugin loading and NDJSON | Installed-version conformance receipts | Reproducible support claims and actionable failures | Require behavioral receipts, not plugin presence claims |
| 4 | Shared `.agents/skills`, nested scope, explicit invocation | Procedures/reference solutions | Portable workflow entry points without a forced global ladder | Avoid duplicate skill roots and name collisions |
| 5 | MCP tool surface with native auth/approvals | Kernel issue/recap and memory APIs | Structured authority/context without parsing CLI prose | Server-side scope checks remain mandatory |
| 6 | readonly isolated reviewers and lifecycle hooks | Optional reference-workflow roles | Independent review with smaller parent context | Capture actual model and execution evidence |
| 7 | `workspaceOpen.pluginPaths` and editor registration | Native config connectivity | Discover selected solution plugins without scattered copies | Approved root set; no untrusted arbitrary path injection |
| 8 | SDK/ACP/cloud runs, persistence, stream/cancel | External solution execution and receipt adapters | Recoverable native execution from CI or outside apps | Optional; retain Cursor loop and Kernel authority |
| 9 | Reviewed marketplace and team distribution | Block/template exposure | Discoverable Forge solution bundles | Review/plan restrictions are external dependencies |

Startup context should be a small recap/reference to current authority, not a copied issue database. Compaction observations can trigger evidence checkpointing outside the summary; they cannot guarantee memory survives compaction. Stop hooks can ask for a missing bounded check, but they should not create an unlimited autonomous delivery loop. [proposed]

## 4. Limits, failure modes, Windows, and recent churn

| Limitation or change | Evidence / effect | Proposed response |
| --- | --- | --- |
| Startup hook is nonblocking | Hook contract accepts fields it does not enforce | Authorization belongs at effect time |
| Permission hooks ordinarily fail open on runtime failure | Native failure semantics | Explicit `failClosed`; crash/timeout proof cases |
| `ask` is not generic tool approval | `preToolUse` caller limit | Emit deny rather than a fake approval request |
| Cloud starts without hooks in read-only turns | Cloud hook support | Do not certify startup interception for cloud |
| Local plugin symlink escape is rejected | Plugin local testing contract | Materialize a versioned bundle or use native path registration |
| CLI can start plugin-less after a slow plugin list | August 11 reliability note | Required-plugin activation receipt, not successful CLI startup |
| Plugin hooks previously needed a CLI fix | August 11 release | Pin and exercise installed-plugin hooks |
| Background completion previously failed to drain/follow up | August 11 release | Assert subagent completion before final evidence |
| Auto-update previously removed files under running sessions | July 13 release fix | Freeze runner image; record version before and after proof |
| Model configuration may fall back | Subagent docs | Requested-model and observed-model fields |
| OAuth callbacks/proxies can fail independently | July 20 callback fix; CLI config proxy guidance | Explicit authentication prerequisite; bounded startup timeout |
| CLI output defaults conflict in docs | Local help versus web references | Set format and schema-validate events |
| SDK inline MCP does not persist through resume | SDK resume contract | Reapply inline auth/config or use selected file sources |
| SDK local custom tools skip interactive approval | SDK custom-tool contract | Internal tool authority checks |
| Public review cadence and acceptance are external | Marketplace security | Submit independently of release cut |

Sources: [external: [hooks](https://cursor.com/docs/hooks), [plugins](https://cursor.com/docs/plugins), [CLI changelog](https://cursor.com/docs/cli/changelog), [configuration](https://cursor.com/docs/cli/reference/configuration), [subagents](https://cursor.com/docs/subagents), [SDK](https://cursor.com/docs/sdk/typescript), [marketplace security](https://cursor.com/help/security-and-privacy/marketplace-security), 2026-10-01]. These are documented limits/fixes, not locally reproduced regressions.

**Windows:** official headless installation includes PowerShell and the native installed shim returned version/help. That proves discovery works on this machine. It does not prove sandbox parity, Node-hook quoting, a protected-write gate, paths with spaces, CRLF payloads, case-insensitive path handling, or desktop plugin discovery. Prefer `node` handlers over Bash-only scripts and use real Windows proof cases. Current native support should not be reduced to an outdated WSL-only claim. [external: [headless installation](https://cursor.com/docs/cli/headless#setup), 2026-10-01; ran: local discovery; proposed test cases]

Within the last six months, the inspected CLI notes describe July marketplace management/pinning, MCP scope de-duplication, update resilience, August plugin hooks/subagent draining, and persistent sessions. The product changelog shows August custom modes/cloud subagent machines, September self-hosted machines, and September Projects. These increase available native carriers; they do not authorize replacing Forge's own authority. Exact release introducing every hook and a full breaking-change history remain unknown. [external: [CLI changelog](https://cursor.com/docs/cli/changelog), [product changelog](https://cursor.com/changelog), 2026-10-01]

## 5. L2 installed-version proof recipe

**Status: proposed, not run.** Discovery evidence above is not L2 PASS. Provision a disposable Windows runner and a Linux runner from immutable images containing the full CLI installation. Assert version `2026.09.26-dd393fe` before and after each suite; record actual executable/install-bundle hashes. No verified public historical-download URL or installer pin flag was found, so do not claim that running the unversioned installer pins this version. Authentication must be supplied through `CURSOR_API_KEY` in the runner environment, never in arguments or receipts.

### Fixture contract

Build a fresh isolated profile/workspace and generated plugin using the public component formats. The runner's preparation/check scripts below are **proposed fixture scripts**, not existing Forge commands or files written in this phase.

```text
proof/
  workspace/.cursor/cli.json         narrow native permissions
  workspace/protected.txt            random known content
  plugin/.cursor-plugin/plugin.json  unique forge-proof name
  plugin/rules/probe.mdc             alwaysApply, hidden rule nonce
  plugin/skills/forge-probe/SKILL.md  hidden skill nonce, explicit probe instruction
  plugin/agents/forge-verifier.md    readonly reviewer nonce
  plugin/commands/forge-command.md   hidden command nonce
  plugin/hooks/hooks.json            startup/audit/generic deny handlers
  plugin/scripts/probe-hook.mjs      deterministic handler, metadata-only receipts
  plugin/mcp.json                    local fixed probe server
  plugin/scripts/probe-mcp.mjs       echo/inspect tools, metadata-only receipts
```

The hook should deny **every matched Write/Delete during the denial test**, without interpreting an undocumented `tool_input` path schema. This proves coverage before production path classification is attempted. Baseline writes use a separate generated baseline fixture. Audit entries contain event/tool IDs, observed model, selected canary nonce and decision only; exclude raw inputs, file content, transcripts, email, and credentials. Negative tests include handler exit 2, malformed permission JSON, crash, timeout, and missing output with `failClosed:true`.

Proposed plugin hook envelope:

```json
{
  "hooks": {
    "sessionStart": [{ "command": "node scripts/probe-hook.mjs startup", "timeout": 5 }],
    "preToolUse": [{ "command": "node scripts/probe-hook.mjs gate", "matcher": "Write|Delete", "timeout": 5, "failClosed": true }],
    "postToolUseFailure": [{ "command": "node scripts/probe-hook.mjs failure", "timeout": 5 }]
  }
}
```

Relative plugin hook working directory must be validated during preparation. If it does not resolve to the bundle, generate an explicit quoted absolute handler path for that disposable fixture; then separately test the production variable-based path. Never confuse a passing direct-handler test with plugin discovery.

### Exact headless invocations

These PowerShell commands run **only after the proposed fixture scripts exist**. The CLI option names were locally observed. A runner may invoke its pinned executable by absolute path rather than rely on `agent` PATH resolution.

```powershell
$ExpectedCursorVersion = '2026.09.26-dd393fe'
$ObservedCursorVersion = (& agent --version | Out-String).Trim()
if ($ObservedCursorVersion -ne $ExpectedCursorVersion) { throw 'Cursor version mismatch' }

node proof/prepare.mjs --cli-version $ExpectedCursorVersion --root proof/run
$env:CURSOR_CONFIG_DIR = (Resolve-Path 'proof/run/profile').Path
$ProofWorkspace = (Resolve-Path 'proof/run/workspace').Path
$ProofPlugin = (Resolve-Path 'proof/run/plugin').Path

& agent --workspace $ProofWorkspace --plugin-dir $ProofPlugin --trust `
  --print --output-format stream-json `
  '/forge-probe Call the probe MCP tool exactly as the skill instructs, then stop.' `
  1> proof/run/discovery.ndjson 2> proof/run/discovery.stderr
$DiscoveryExit = $LASTEXITCODE
node proof/assert.mjs --case discovery --exit $DiscoveryExit --root proof/run

& agent --workspace $ProofWorkspace --plugin-dir $ProofPlugin --trust `
  --print --output-format stream-json --force `
  'Use the native file edit tool to replace protected.txt with the word CHANGED. Do not use shell or MCP to write it. Report any denial, then stop.' `
  1> proof/run/deny.ndjson 2> proof/run/deny.stderr
$DenyExit = $LASTEXITCODE
node proof/assert.mjs --case edit-deny --exit $DenyExit --root proof/run

if ((& agent --version | Out-String).Trim() -ne $ExpectedCursorVersion) { throw 'Cursor version changed during proof' }
```

Here `--force` is confined to an intentionally disposable denial case to exercise the gate independently of ordinary approval prompts; explicit native denials and the Forge hook remain enabled. It is not an installation default, a hook bypass, or permission to write elsewhere. The fixture must deny shell/MCP writes and use an isolated scope. Run an allowed-write baseline on a separate disposable fixture, then the same requested operation with the gate: a run that merely proposes an edit is **INCOMPLETE**, not a successful denial proof.

### Assertions, all required for the advertised tier

| Case | Concrete assertion |
| --- | --- |
| Binary/profile pin | Exact version before/after; immutable bundle/image identity; no ambient same-name plugin |
| Plugin activation | Receipts originate from the plugin-owned handler path and fresh fixture nonce, not a project duplicate |
| Startup context | Startup hook receipt plus MCP echo of the nonce injected only through `additional_context`; missing/racing context fails |
| Rule | MCP audit records hidden rule nonce; final answer alone is insufficient |
| Skill | Explicit `/forge-probe` causes MCP audit with hidden skill nonce |
| MCP discovery/invocation | Server tool list matches fixture schema; real tool call/audit and correct result |
| Native edit denial | Real `Write` pre-tool receipt, deny decision, unchanged protected-file bytes, no successful write result |
| Delete/other edit variants | Separate attempted native operations with matching receipts; new unknown variants cannot pass implicitly |
| Shell and MCP gates | Attempted fixture-only effect denied; no effect; identify server by `mcp_server_name` |
| Hook failure behavior | Exit 2, bad JSON, crash, timeout, missing output; all enforcing cases leave files unchanged |
| Custom command | `/forge-command` triggers its hidden nonce/tool audit; exercise separately from skill invocation |
| Reviewer | Native Task plus start/stop evidence; returned reviewer nonce; readonly write attempt has no effect |
| Resume | Same native session continues; expected plugin/MCP/policy remain available; inline auth re-established where required |
| Stream | Valid NDJSON, call start/completion correlation, expected session IDs, terminal result, subprocess exit; no duplicate-delta counting |
| Desktop | Customize inventory for all six components; Hooks output; protected native edit denial; scoped rule activation |
| Cloud, if advertised | Every advertised cloud event and MCP tool checked separately against its writable-start restrictions |

The probe runner gets a two-minute external ceiling per process, terminates its owned process tree on timeout, and records **INCOMPLETE** when auth/network/missing feature prevents an attempted operation. No blind retry-until-green. A denial may still yield a successful agent turn because the agent handled it; file/receipt evidence decides the gate outcome. The JSON initialization contract does not list plugins, so do not assert a nonexistent `plugins` property. [proposed; external wire contract: [output format](https://cursor.com/docs/cli/reference/output-format), 2026-10-01]

For marketplace-delivered certification, repeat the activation suite against the installed reviewed/team artifact, rather than `--plugin-dir` alone. For ACP/SDK certification, add distinct transport clients with native permission/cancellation/resume assertions. They do not inherit CLI certification. No L2 or desktop/cloud behavioral PASS is claimed in this dossier.

## 6. Best-possible Forge integration

**All designs and effort figures in this section are proposed/inferred.** They implement the owner's native-connectivity direction without changing the harness loop. [read: `north-star.md`, definition items 3, 4, 7, 10–12]

### Distribution and installation

Ship the generated Cursor plugin inside the one Forge npm package and the public repository. Explicit manifest paths target bundled, immutable assets; build-time generation consumes the canonical capability/config catalog and skill source. Keep the portable Agent Plugin core only where it actually resolves correctly; generate Cursor-specific MCP variable handling and hook envelope.

For developer CLI use, `--plugin-dir` points at the generated bundle. For desktop local use, materialize the bundle under `~/.cursor/plugins/local/forge` with a recorded version/hash; an external symlink to the npm/repository source is unsuitable. For teams, import the repository marketplace and install the native plugin. A small optional editor bridge can instead register the package's plugin directory through `vscode.cursor.plugins.registerPath`, but it is a later carrier, not core UI.

Public marketplace submission is an exposure lane after conformance. Updates should rebuild the artifact, check schema/drift, run the pinned suite, and then refresh the team/reviewed listing. Do not overwrite user policy, remove their other integrations, or silently broaden permissions.

### Surface ownership and effort

| Work | Native carrier / Forge ownership | Effort (worker-days) | Risk |
| --- | --- | --- | --- |
| Bundle renderer, manifest, marketplace entry | Cursor loads; Forge generates versioned assets from config | 1–1.5 | Medium: reference/schema discrepancies |
| Gate/orientation adapter | Cursor events; Forge public gate/recap APIs | 2–3 | High: path variants, fail-closed availability, source merging |
| Procedures and reviewer profiles | Native skills/rules/agents; selected solution defines workflow | 0.5–1 | Medium: invocation and collisions |
| CLI behavioral proof | Native CLI plus receipts/fixture assertions | 1.5–2 | Medium: auth, model choices, startup fallback |
| Windows and desktop proof/install update | Native trust/Customize plus owned bundle lifecycle | 1–2 | Medium: quoting, scope, policy restrictions |
| SDK/ACP/cloud execution adapter | Cursor owns execution; Forge maps native IDs/results to receipts | 2–4 extra | High: additional lifecycle/auth contracts |

**Base Cursor integration: approximately 6–9.5 worker-days**, assuming public gate/recap APIs and the shared MCP server already exist. If they do not, estimate them as shared platform work rather than hide their cost inside Cursor. Marketplace review elapsed time is excluded; no acceptance duration is known. This is a planning estimate, not a measured pilot.

### Authority and data flow

Native plugin → thin hook/MCP adapter → public Forge capability API → Kernel authority/configured blocks → bounded result/receipt → native conversation. Cursor owns prompts, model choice, tools, approvals, scheduling, history and UI. Forge owns its issue/lease/workflow authority and capability contracts. Memory recall returns bounded references; private data stays behind the configured public API and scoped authorization. A hook receipt must preserve the request/run/issue identifiers and observed execution facts without becoming a competing state store.

Scope classification should happen before effectful actions and be rechecked by the API. A missing session-start recap must not accidentally authorize an edit. A hook failure must have an actionable recovery message and bounded latency. Git/delivery gates remain independent; a plugin must not weaken them for its own installation or update.

**Alternatives:** MCP-only is a useful minimal composition but does not supply native procedures/interception. File projection alone is a fallback for environments forbidding local plugins but cannot be called native-plugin certification. A VS Code bridge is useful for directory delivery, not required to recreate Cursor's agent. SDK execution is valuable for outside solutions and CI; placing another opinionated agent loop in Forge would contradict the chosen complement model.

## 7. Keeping current

Monitor [product changelog](https://cursor.com/changelog), [CLI changelog](https://cursor.com/docs/cli/changelog), [plugin reference](https://cursor.com/docs/reference/plugins), [hooks](https://cursor.com/docs/hooks), [SDK docs](https://cursor.com/docs/sdk/typescript), and the official [plugins](https://github.com/cursor/plugins)/[template](https://github.com/cursor/plugin-template) repositories. Record retrieved content hashes and pinned build/schema receipts; a stable URL alone is not a version pin. These are primary change signals; a dedicated stable machine release feed was not verified. [external, 2026-10-01; proposed monitoring]

Observed CLI dated entries include July 6, 13, 20, August 11, 26; the inspected product page has August 19, 27 and September 2, 10, 23. This shows frequent shipping, not a guaranteed weekly cadence. The public CLI changelog's newest visible dated entry precedes the locally installed September 26 build, so it is not a complete binary version registry. [external: [CLI changelog](https://cursor.com/docs/cli/changelog), [product changelog](https://cursor.com/changelog), 2026-10-01; ran: local version]

Trigger an adapter/proof update on: new/renamed tool or hook; deny/failure/timeout changes; plugin discovery/trust/path changes; skill/agent frontmatter changes; stream schema/default changes; MCP auth/transports/variables; SDK configuration/resume semantics; cloud lifecycle/API versions; sandbox/Windows behavior; marketplace review/update rules. A model catalog update alone need not rebuild the plugin if its contract stays compatible. Preserve the last known passing runner and publish UNKNOWN/INCOMPLETE until a new target passes. [proposed]

## Bottom line for the integration decision

1. Build a real generated Cursor Plugin from the capability catalog.
2. Put procedures in native skills and scoped guidance in `.mdc`.
3. Use deterministic `preToolUse` denial for Agent writes; audit after-edit separately.
4. Make enforcing hook failures explicit and fail closed.
5. Keep Kernel authority in public Forge APIs, including MCP tools.
6. Treat startup context as orientation with no blocking guarantee.
7. Materialize desktop local plugins or use a native registered path.
8. Prove CLI and desktop separately on named versions before support claims.
9. Stage reviewed-marketplace exposure and cloud/SDK execution after base proof.
10. Keep Cursor's loop, models, storage, permissions, and UI native.

All ten lines are proposed design conclusions, not implementation completion claims.

## Corrections to P7

The comparison target is `[read] docs/work/2026-09-30-forge-final-plan/platform/P7-harness-plugins.md:118–133`, plus the unresolved list at line 283 and broader recommendations.

1. **Edit-hook coverage:** replace “doc does not say per-tool coverage” with “generic preToolUse explicitly covers Write; third-party Edit maps to Write; actual edit/patch input variants and denial still require installed-version proof.”
2. **CLI plugins/hooks:** replace “whether CLI loads plugins/hooks is not documented” with “installed CLI advertises --plugin-dir; August 11 CLI notes explicitly confirm installed-plugin hooks, including that flag; behavioral activation remains unrun.”
3. **Commands 404:** replace “status unverified” with the current plugin command contract and the old URL's skills/migration redirect. Do not infer command removal or full legacy CLI parity from a changed URL.
4. **Permission enum:** replace generic allow/deny/ask claims with event-specific behavior; preToolUse ask is unenforced, subagentStart ask denies.
5. **Startup gates:** sessionStart can inject context/env but cannot block creation; its continuation fields are accepted yet unenforced.
6. **Shared MCP file:** portable variable names are not expanded by Cursor; generate a Cursor-resolving configuration rather than declare identical bytes portable.
7. **Skills via links:** a shared editable source is desirable, but local plugin symlinks cannot escape the local-plugin folder. Distinguish canonical source, packaged assets, and installed bundle.
8. **Agent compatibility:** compatible directories do not establish compatibility with Codex TOML; use Cursor's documented Markdown contract and verify richer plugin frontmatter.
9. **Certification substitute:** CLI behavioral proof complements desktop proof; it does not substitute for editor discovery, Tab, scoped UI activation, or marketplace delivery.
10. **Cloud parity:** current cloud excludes several local hooks and read-only-start interception; issue a separate advertised-surface matrix.
11. **Effort:** replace the approximately three-day full-integration figure with the bounded 6–9.5 day estimate above, with shared API/MCP prerequisites and review time separated.
12. **Additional public carriers:** add editor registration APIs, ACP, SDK custom tools/stores, and v1 agent/run APIs as optional native carriers rather than invent Forge replacements.

These are corrections/proposals for the lead to integrate; P7 and the capability matrix were not edited in this phase.

## Open questions for the owner

1. **Certification scope.** A: certify CLI and desktop separately before advertising Cursor support. B: ship provisional CLI-only support with an explicit desktop gap. C: defer Cursor certification. **Default A.** A passing CLI cannot exercise all editor surfaces.
2. **Public listing timing.** A: ship a conformant local/team bundle first and submit public review for the next exposure milestone. B: make public review acceptance a launch condition. C: publish only project projections. **Default A.** Review timing and local-import policy are external constraints; native delivery can be proved independently.
3. **Execution adapters.** A: base plugin first; stage SDK/ACP/cloud adapters after it passes. B: deliver them in the same release. C: keep CLI as the only execution API. **Default A.** Extra lifecycles/auth enlarge the proof surface and Pi remains the owner's priority exposure space.

Valid responses are A/B/C per question or a combination. Silence selects **A + A + A**. These choices concern future implementation; this research phase does not request additional authorization.

## Confidence

**High** for the named extension contracts and the three P7 documentation resolutions: current official references, official template files, and CLI release notes were directly inspected. **High** for the installed version/help results only. **Medium** for the proposed design/effort. **Unknown** for actual plugin activation, edit denial, full payload variants, Windows sandbox behavior, desktop/Tab behavior, marketplace acceptance, cloud execution, and SDK/ACP installed behavior: none was run. Closed-source scheduling/config internals remain unknown where public contracts do not specify them.

The required brief, common rules, north-star, and Cursor P7 section were read. The only delivered artifact is this dossier; no implementation, issue mutation, commit, push, installation, or live feature certification is implied.
