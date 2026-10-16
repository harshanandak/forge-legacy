# Claude Code deep dive

## Bottom line

1. Claude Code now reads AGENTS.md natively: v2.1.277 introduced it on September 18, 2026; v2.1.281 widened provider coverage. [external S02, S03]
2. Forge can remove its import-only CLAUDE.md on a verified modern support matrix, but should retain it for compatibility until that proof exists. [inferred; §2.5]
3. Native instruction support does not imply native `.agents/skills` discovery; Claude's documented skill locations remain Claude-specific. [external S02, S06]
4. The strongest integration is a native plugin carrying skills, deterministic command hooks, MCP tools, and optional agent definitions. [inferred; §6]
5. The current hook reference defines 33 events; their decision contracts differ, and many failures allow the underlying action to continue. [external S08]
6. The shipped Forge plugin is an activation front door, not proof that the proposed Kernel/MCP/gate integration already exists. [read plugin/.claude-plugin/plugin.json:2-3; plugin/hooks/hooks.json:3-10]
7. Claude owns the model loop, context, permissions and UI; Forge should own durable issue/workflow authority and reusable building blocks. [external S01, S20; read north-star.md: see evidence register]
8. Headless stream-json and SDK hooks provide strong conformance evidence, but marketplace installation, hooks, permissions and provider behavior need separate assertions. [inferred; §5]
9. Native Windows has no Claude shell sandbox; plugin executables and permission hooks require explicit trust and platform proof. [external S13, S14]
10. This phase produced source-backed research and an unrun L2 recipe, not an installed-version certification or an implementation. [ran: artifact readback; §8]

Decisions needed: none to complete this research phase. Future support and migration choices are at the end.

## Assignment and evidence boundary

| Field | Preserved value |
| --- | --- |
| protocolVersion | `1.0` |
| requestId | `forge-deep-claude-code-20261001` |
| contextDigest | `e87f5d809c7eb5bb3da7bcdbebf0905ee422f7d5202a109b193f86c1728784b2` |
| context.summary | `Forge harness deep dive: Claude Code.` |
| flowSpec | `null` |
| cwd | `.` |
| route | model `gpt-6.1-sol`; thinking `xhigh`; search `true` |
| policy | write `true`; tools `[]`; maxCostUsd `null` |
| research date | `2026-10-01` |

The brief and common rules authorize one research file only. No Claude process, browser, context-mode tool, repository implementation, Kernel mutation, commit or push was used. Shell commands were permitted by the task override. One initial read-only Git status preceded reading the no-Git limit; no later Git operation was performed. Local files below were read from the assigned worktree, which the common brief permits as its origin/master snapshot. This report does not independently certify the snapshot's remote freshness. [read (local scratch); (local scratch)]

Evidence notation: `[external Snn]` means the official source linked in the register, fetched on **2026-10-01**; `[read path:line]` is inspected local source; `[inferred]` is a conclusion; `[proposed]` is a design or test that does not exist merely because this document describes it; `[ran]` names an actual check. External documentation is source evidence, not a successful runtime probe. The Claude Code core is closed source: no claim here establishes its internal dispatch implementation by reading engine source. Python SDK wrapper source and public types are inspectable; TypeScript package declarations could not be downloaded in this environment. [external S01, S21, S22, S23]

### Official source register

All sources in this table were fetched on **2026-10-01**. Links are direct primary sources. Reference S24 is deliberately marked incomplete.

| Ref | Primary source | Used for |
| --- | --- | --- |
| S01 | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) | Harness/loop boundary |
| S02 | [Memory and project instructions](https://code.claude.com/docs/en/memory) | CLAUDE.md, AGENTS.md, imports, rules, auto memory |
| S03 | [Official changelog](https://code.claude.com/docs/en/changelog) | Current release and dated changes |
| S04 | [Plugin reference](https://code.claude.com/docs/en/plugins-reference) | Manifests and component schemas |
| S05 | [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) | Marketplace entries, sources and trust |
| S06 | [Skills](https://code.claude.com/docs/en/skills) | Discovery, frontmatter, invocation |
| S07 | [Custom subagents](https://code.claude.com/docs/en/sub-agents) | Definitions, recursion and isolation |
| S08 | [Hook reference](https://code.claude.com/docs/en/hooks) | Event and decision contracts |
| S09 | [Add plugin components](https://code.claude.com/docs/en/plugins/components) | Component lifecycle, monitors, channels, paths |
| S10 | [MCP](https://code.claude.com/docs/en/mcp) | Server scopes, transports and authentication |
| S11 | [SDK tool search](https://code.claude.com/docs/en/agent-sdk/tool-search) | Deferred tool exposure and supported models |
| S12 | [Settings](https://code.claude.com/docs/en/settings) | Resolution, managed policy and controls |
| S13 | [Permissions](https://code.claude.com/docs/en/permissions) | Modes and permission rules |
| S14 | [Sandboxing](https://code.claude.com/docs/en/sandboxing) | OS enforcement boundary |
| S15 | [CLI reference](https://code.claude.com/docs/en/cli-reference) | Print mode and explicit options |
| S16 | [Run programmatically](https://code.claude.com/docs/en/headless) | JSON, streaming, resume and lifecycle |
| S17 | [Output styles](https://code.claude.com/docs/en/output-styles) | Style discovery and system-prompt effects |
| S18 | [Status line](https://code.claude.com/docs/en/statusline) | Command callback and input fields |
| S19 | [Plugin evaluations](https://code.claude.com/docs/en/plugin-evals) | Native eval suite and publication caveat |
| S20 | [SDK agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop) | Messages, concurrency, stopping and context |
| S21 | [TypeScript SDK repository](https://github.com/anthropics/claude-agent-sdk-typescript), [README](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-typescript/main/README.md), [changelog](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-typescript/main/CHANGELOG.md) | Public package contract and version train |
| S22 | [Python SDK repository](https://github.com/anthropics/claude-agent-sdk-python), [types.py](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/src/claude_agent_sdk/types.py), [pyproject.toml](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/pyproject.toml) | Actual public definitions and Python version |
| S23 | [Python subprocess transport](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/src/claude_agent_sdk/_internal/transport/subprocess_cli.py) | SDK-to-CLI boundary |
| S24 | [TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript) | **Incomplete fetch:** HTML exceeded fetch limit; `.md` unsupported; published `sdk.d.ts` fetch failed |
| S25 | [Claude Code features in the SDK](https://code.claude.com/docs/en/agent-sdk/claude-code-features) | settings sources, skills and environment |
| S26 | [Official plugins repository](https://github.com/anthropics/claude-plugins-official), [code-review manifest](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/code-review/.claude-plugin/plugin.json) | Actual official plugin artifact |
| S27 | [Official Claude Code repository](https://github.com/anthropics/claude-code) | Changelog, example plugins and release distribution; not engine source |

The fetched changelog's latest listed CLI release was **2.1.286, September 30, 2026**. The TypeScript SDK changelog listed **0.3.286**; Python `pyproject.toml` listed **0.2.163**, requiring Python ≥3.10. These are source snapshots, not the versions installed on this machine, nor proof of registry availability on every platform. Forge's Node 24/26 requirement comes from the common brief and should govern Forge even where the SDK advertises a lower minimum. [external S03, S21, S22; read (local scratch)]

## 1. Architecture

### 1.1 Loop, tool dispatch and stopping

Claude Code combines a model with a harness that supplies tools, permissions, context and session state. The documented cycle is gather context → act → assess results → continue or answer. Plugins supplement that cycle; they do not replace the scheduler or install a different model engine. A main agent can delegate to separate subagent contexts. Native task lists are conversation coordination, not an alternative durable Forge authority. [external S01; inferred]

The SDK exposes the same operational loop. Assistant messages contain text, thinking and tool-use blocks; user messages carry tool results; system messages report initialization, hooks and compaction; a result reports success or a terminal error. Partial stream events are optional. Independent read operations and MCP tools marked with `readOnlyHint` can run concurrently; mutating built-ins and custom tools without that annotation run sequentially. A hint describes scheduling intent, not authorization or a guarantee the server is harmless. [external S20]

`maxTurns` measures tool-use round trips in the loop documentation; `maxBudgetUsd` covers the run including subagents. Limit exits include `error_max_turns` and `error_max_budget_usd`. Streamed user turns reset the turn budget, while the monetary budget is cumulative. Drain the stream after a result because subsequent system events can exist. The Python options docstring uses a broader conversational definition of a turn; use an installed-version boundary test rather than assuming the two wordings agree. [external S20; S22 types.py:1860-1870; inferred]

### 1.2 Context, compaction and memory

Project instructions enter context at launch and when relevant files are read; skill descriptions are available before full skill bodies are expanded; MCP definitions can be deferred until tool search. Compaction removes older tool material and summarizes history. `compact_boundary`, PreCompact and PostCompact are distinct surfaces. Session transcripts retain context injections; resuming may replay old injections, so every new/resumed/forked session needs a fresh Kernel recap with an evidence timestamp. Hook context over 10,000 characters becomes a file reference with a preview instead of guaranteed inline context. [external S02, S06, S08, S11, S20; inferred]

Auto memory is model-maintained local knowledge, separate from authored project instructions. Its startup index is bounded, with topic files read when needed. Neither an auto-memory file nor a compaction summary proves current issue ownership, lease validity or stage authorization. Forge should retain those in the Kernel and inject a small live orientation envelope. Do not duplicate AGENTS.md by also printing it from SessionStart. [external S02; inferred]

### 1.3 Session storage and resume

Local sessions use JSONL transcripts under the Claude configuration/project storage tree, conventionally `~/.claude/projects/<encoded-project>/<session-id>.jsonl`. `--continue` selects the recent session; `--resume` selects an ID; `--fork-session` creates a new session identity from prior context. Main and subagent messages have correlating IDs. SDK file checkpoints can rewind tracked file edits; they do not reverse shell side effects or external writes. Treat transcript retention, workspace cleanup and Forge evidence retention as separate policies. [external S16, S20, S22]

### 1.4 Configuration and providers

Settings layers resolve managed policy before user-controlled flags, then local project settings, shared project settings and user settings. Scalar precedence does not describe every collection: arrays and per-key merging have documented exceptions. Project `.claude/settings.json` is shareable; `.claude/settings.local.json` is personal; `~/.claude/settings.json` is user-wide. Global `.claude.json` also holds trust/MCP/auth state; do not print or commit it. Some settings update live; startup-only behavior needs a new session. [external S12, S25]

Claude Code supports first-party accounts/API access and documented provider routes including Amazon Bedrock, Google's platforms, Microsoft Foundry and gateways. A provider route changes feature availability as well as model naming/authentication. Native plugins do not create an arbitrary provider adapter interface. Pin a model/provider combination for proof, and record feature availability rather than treating an API-compatible endpoint as a fully equivalent Claude Code account. [external S03, S11, S12; inferred]

## 2. Extension contracts

### 2.1 Plugins and marketplaces

An optional `.claude-plugin/plugin.json` declares the plugin; `name` is required when the manifest exists. Components live beside `.claude-plugin`, not inside it. Without a manifest, directory/marketplace naming and default scans supply discovery. Installed components are cached, so links outside the plugin tree are unsuitable for distributed resources. The inspected official `code-review` manifest actually contains `name`, `description`, and an author object rather than an imagined full manifest. [external S04, S09, S26]

The public manifest fields and forms below are a structural inventory, not a complete replacement JSON Schema. Relative paths must remain within the packaged plugin and satisfy the field's existence/type constraints. Unknown or malformed component fields must be surfaced by validation and initialization diagnostics. [external S04]

| Manifest field | Accepted form and load behavior |
| --- | --- |
| `$schema`, `name`, `displayName`, `version`, `description` | Metadata; name required; version is not a substitute for immutable source pinning |
| `author`, `homepage`, `repository`, `license`, `keywords`, `metadata` | Author object with required name and optional email/url; metadata map; documented URL/type constraints |
| `defaultEnabled`, `dependencies` | Default enablement and plugin dependencies; dependency install is still a trust action |
| `skills` | String/path array; adds to default `skills/` scan |
| `commands` | File/directory paths, array, or named definitions with exactly one source/content plus description, argumentHint, model, allowedTools; overrides default command scan |
| `agents` | Markdown file paths/path array, not arbitrary directory references; overrides default scan |
| `hooks` | JSON path, inline hook object, or mixed array; combines with `hooks/hooks.json` |
| `mcpServers` | Config path, inline server map, mixed array, or documented MCP bundles; combines with `.mcp.json`; later same-name entries replace |
| `lspServers` | JSON path/inline map/mixed array; combines with `.lsp.json`; later same-name entries replace |
| `outputStyles` | Markdown files/directories; replaces default scan |
| `workflows` | Workflow JavaScript files/directories; replaces default scan; separate experimental runtime, not a Forge stage transition |
| `experimental.themes` | Theme paths; replaces `themes/` scan |
| `experimental.monitors` | JSON path or inline entries; replaces `monitors/monitors.json` |
| `experimental.evals` | Evaluation resource location; native suite remains opt-in |
| `settings` | Inline defaults: **only `agent` and `subagentStatusLine` take effect**; root `settings.json` has precedence; arbitrary permission/settings injection is unsupported |
| `userConfig` | Strict per-option schema, below |
| `channels` | Strict channel entries binding to one declared MCP server |

Plugin-local CLAUDE.md is not an instruction component. Deliver procedures through skills and bounded operational context through hooks. Bundle resources physically inside the one npm artifact; generate or link canonical skills during packaging rather than expecting a cached plugin to follow a link back to the developer checkout. [external S04, S09; proposed]

Paths: `${CLAUDE_PLUGIN_ROOT}` changes per cached version; `${CLAUDE_PLUGIN_DATA}` survives updates and is normally removed on the last uninstall unless retained; `${CLAUDE_PROJECT_DIR}` is the project root. Substitution and process export are component-specific. They are not automatically in the environment of arbitrary Bash tool calls. Windows plugin substitutions use forward slashes. Use plugin data for caches/dependencies, the Kernel for authority, and stdout strictly for protocol output. [external S04, S09]

`userConfig.KEY` has required `type` (`string|number|boolean|directory|file`), `title`, `description`; optional `required`, `default`, `options`, `multiple`, `sensitive`, `min`, `max`. `options` needs v2.1.271 and applies to a plain non-sensitive, non-multiple string. Sensitive values enter secure storage and become placeholders in skill/agent text. Exec-form hook args, MCP/LSP config and non-sensitive content support `${user_config.KEY}`. Shell-form hooks use `CLAUDE_PLUGIN_OPTION_<KEY>` instead; shell-form commands, monitors and MCP headers helpers reject direct user-config substitution. CLI install never prompts: configure non-secret values explicitly, and pipe secret-bearing JSON without printing it. [external S04, S09]

Marketplace `.claude-plugin/marketplace.json` requires `name`, `owner.name`, and `plugins`. Optional description/version/metadata, `metadata.pluginRoot`, `forceRemoveDeletedPlugins`, dependency policy and renames affect discovery/update. An entry requires `name` and `source`; it can carry metadata/version/category/tags/dependencies/default enablement and component definitions. With a manifest and `strict:true`, entry components append except hooks replace matching event groups; `strict:false` plus competing component definitions conflicts. A missing manifest makes the entry the manifest. Do not assume strict=false means arbitrary overriding. [external S05]

| Plugin source | Relevant exact fields |
| --- | --- |
| Relative directory | `./path`; bare names under `metadata.pluginRoot`; `.` for root |
| `github` | `repo`, optional `ref`, `sha` |
| `url` | Git `url`, optional `ref`, `sha` |
| `git-subdir` | `url`, `path`, optional `ref`, `sha` |
| `npm` | `package`, optional `version`, `registry`; unpacked without install scripts |
| `archive` | HTTPS `url`, optional/required-by-policy `sha256`; v2.1.224+ |
| `command` | `command`, `timeout` 1–600 seconds/default 60, `mode:copy|link`; v2.1.229+; local executable trust; link mode unavailable on Windows |

Marketplace-source types differ from plugin-source types: URL downloads only marketplace JSON; GitHub/git clone catalog resources; directory/file/settings sources also exist. An npm marketplace-source form parses but is not implemented for loading. Policy-only source patterns are not installable catalogs. A URL-only marketplace cannot resolve relative plugin directories. Git references require a full source pin for reproducibility; npm lifecycle suppression does not prove every runtime dependency is present. [external S05]

Install scopes include user, project, local and managed. A typical self-marketplace flow is `claude plugin marketplace add harshanandak/forge`, then `claude plugin install forge@forge --scope user`; use the actual repository identity and pinned catalog when releasing. Update the marketplace and plugin separately, then reload/new-session as needed. A content change without a version change can leave a cached artifact unchanged. Validate, hash, install and inspect the resulting cache; a marketplace listing alone is not load proof. [external S04, S05; proposed]

### 2.2 Skills and slash commands

Claude's discovered skill form is `<skill>/SKILL.md` with YAML frontmatter and Markdown body. Managed, user `~/.claude/skills`, project `.claude/skills`, ancestor/nested project locations, approved additional directories, plugins and account-synced skills are documented sources. Nested skills load as relevant directories are used. Managed/personal/project precedence and namespaced plugin names must be tested for collisions; filesystem order is not a stable public override API. The documented discovery table contains no `.agents/skills` source. [external S06]

| Frontmatter | Type/meaning |
| --- | --- |
| `name`, `description`, `when_to_use` | Optional name defaults to directory; description/relevance drive model selection; frontmatter fallback text is bounded |
| `argument-hint`, `arguments` | User hint and named/positional argument definitions |
| `disable-model-invocation` | Boolean; prevents model invocation/preloading/scheduling |
| `user-invocable` | Boolean; false hides the skill and refuses direct slash invocation |
| `allowed-tools`, `disallowed-tools` | Tool rules for the active turn; permission preapproval and pool restriction have different meanings |
| `model`, `effort` | Turn model override and `low|medium|high|xhigh|max`, subject to model/org constraints |
| `context`, `agent`, `background` | `context:fork` delegates; optional agent type; background defaults true, false waits, v2.1.218+ |
| `hooks` | Hook registrations lasting through the session after invocation; skill-only `once` available |
| `paths` | YAML list/comma-separated glob scope for automatic activation |
| `shell` | `bash|powershell` for dynamic shell expansion; PowerShell availability depends on platform/provider configuration |
| `metadata`, `license`, `compatibility` | Portable metadata; metadata map is passive; compatibility text ≤500 characters |

Bodies support `$ARGUMENTS`, positional and named substitutions, dynamic shell execution with the documented `!` syntax, file references and plugin path variables. Dynamic expansion happens before the model sees the expanded procedure, so it can run code despite the skill being described as instructions. Restrict it to bounded read-only orientation; never use it as hidden deployment authorization. Account skill uploads accept a narrower portable frontmatter set than Claude's extended local skill fields. [external S06, S04; proposed]

Legacy `.claude/commands/*.md` remains a prompt/skill surface with related frontmatter, except skill-specific name/path handling. Plugins namespace commands as `/forge:<name>`. A typed slash expansion fires UserPromptExpansion and need not pass through PreToolUse for the Skill tool. Therefore enforcement on the Skill tool alone misses an invocation route. Built-in slash commands, custom skill commands and MCP prompts are distinct namespaces; inspection commands such as `/context`, `/hooks`, `/mcp`, `/skills` diagnose the loaded session rather than prove gates automatically. [external S06, S08]

**`.agents/skills` answer:** no documented native discovery. Canonical Forge content can remain there, with a generated `.claude/skills` projection for repository use and physical resources inside an installed plugin. The memory documentation's exclusion of `.agents/` applies to instruction discovery; it is corroboration, not an exhaustive negative runtime test of the skill loader. This phase ran no such negative probe. [external S02, S06; inferred]

### 2.3 Subagents and custom main agents

Agent Markdown uses YAML plus a prompt body. `name` and `description` are required. Discovery precedence is managed → CLI `--agents` → project `.claude/agents` → user `~/.claude/agents` → plugin agents; closest nested project definitions win within project scope, while same-scope filesystem collisions are not deterministic. The body replaces the subagent's default system prompt, not the main harness implementation. [external S07]

Exact documented fields beyond name/description are `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `omitClaudeMd`, `effort`, `isolation`, `color`, `initialPrompt`, and `experimental.cacheTtl`. Tools accept list/CSV; memory is `user|project|local`; isolation is `worktree`; cache TTL is `5m|1h`; omitClaudeMd skips user/project/local instructions, not managed policy. Color has the documented fixed palette. `initialPrompt` applies to a custom main agent. Unknown fields are ignored, so a valid load is not proof every intended field took effect. [external S07]

**Plugin agents ignore `permissionMode`, `hooks`, `mcpServers`, and `initialPrompt`.** Put mandatory gates in plugin-level hooks and server configuration in plugin MCP resources. Agent prompt text cannot silently restore ignored capabilities. A malformed plugin frontmatter can fall back to prompt-only behavior. CLI `--agents` accepts a JSON map with `prompt` rather than a Markdown body; v2.1.281 adds JSON-file paths in print mode and permits an empty prompt. Color and experimental settings do not carry through that CLI form. [external S07, S03]

Memory directories are scope-specific (`~/.claude/agent-memory/<name>`, `.claude/agent-memory/<name>`, `.claude/agent-memory-local/<name>`). Built-in Explore/Plan can omit project instructions. Explore no longer has a universal fixed Haiku assumption. Current documented default nesting depth is 3, overridable with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`; concurrency defaults to 20, overridable with `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`. Historical defaults changed, and some internal agent families have separate limits. [external S07, S03]

Native worktree isolation commonly starts from the default remote branch rather than the parent's exact HEAD. Agent teams can launch a named agent as a teammate in the main cwd; supply isolation at the actual launch boundary and prove cwd/HEAD. Use WorktreeCreate/Remove to call Forge's issue-linked worktree API when opted in; never assume agent YAML alone preserves issue authority. Resume and child attribution use agent/tool-use IDs; return evidence with exact workspace and head. [external S07, S08; proposed]

### 2.4 CLAUDE.md, rules and imports

Authored memory includes managed instructions, user `~/.claude/CLAUDE.md`, project/ancestor `CLAUDE.md` or `.claude/CLAUDE.md`, personal `CLAUDE.local.md`, and `.claude/rules/*.md`. Nested files and path-scoped rules load as files are accessed. Rules use YAML `paths` glob scope; unscoped rules load broadly. Imports use `@path`, including approved external files, and expand recursively within documented limits. These are additive context, not an executable precedence-based policy engine. [external S02]

`claudeMdExcludes`, setting-source selection and subagent instruction omission change what arrives. Additional directories require `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` for the documented Claude instruction/rule loading. Instruction trust and file permissions remain separate from model compliance. An InstructionsLoaded observation tells an auditor about supported load paths; it cannot prove every future model action follows that text. [external S02, S08; inferred]

### 2.5 Can Forge drop CLAUDE.md?

**Native capability: YES. Unconditional compatibility decision today: NO.** A pinned, proven modern session can use AGENTS.md without a CLAUDE.md import. Forge should keep its one-line bridge until it chooses and certifies that support floor. This is a compatibility recommendation, not a claim native support is absent. [external S02, S03; inferred]

Exact official evidence, fetched **2026-10-01**:

- Memory documentation: **“Reading `AGENTS.md` directly requires Claude Code v2.1.277 or later.”** [Memory](https://code.claude.com/docs/en/memory#agentsmd)
- Changelog release **v2.1.277, September 18, 2026**: **“Added AGENTS.md support: in a project with no CLAUDE.md, Claude Code reads AGENTS.md instead; change it under “Project instructions” in `/config`”** [Official changelog](https://code.claude.com/docs/en/changelog#21277)

Default `claude-md-or-agents-md` behavior checks cwd and ancestors for `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md`. Any of these suppresses native AGENTS fallback. User-home and managed instructions and `.claude/rules` do not suppress it. Without that suppression, AGENTS.md and `.claude/AGENTS.md` load at launch; nested AGENTS.md loads on Read unless its directory has a suppressing Claude file. AGENTS imports and exclusions apply. AGENTS.local.md, AGENTS.override.md and `.agents/` instruction files do not participate. [external S02]

The builtin plugin's setting belongs in user, flag or managed settings, **not project/local settings**:

```json
{
  "pluginConfigs": {
    "agents-md@builtin": {
      "options": { "instructionFiles": "claude-md-and-agents-md" }
    }
  }
}
```

Accepted values are `claude-md-or-agents-md` (default), `claude-md-and-agents-md`, `claude-md`, and `managed-only`. The both-files mode deduplicates an AGENTS file already imported/symlinked. Managed-only omits those authored files at launch but is not an immutable ban on all later nested rules. Disabled builtin support, pre-277 clients and some first post-upgrade sessions cannot load native AGENTS; before v2.1.281 provider/telemetry combinations also differed. [external S02, S03]

The inspected root bridge is exactly `@AGENTS.md`. Keeping it costs one import line, preserves compatible behavior and does not create two loaded copies under the supported both-files mode. This report makes no deletion. [read CLAUDE.md:1; external S02]

| If Forge drops the bridge while compatibility is unproven | Consequence / default |
| --- | --- |
| Old client, disabled builtin or `claude-md` option | Forge project instructions stop loading automatically; keep bridge until these sessions are unsupported |
| An ancestor/local Claude file suppresses fallback | AGENTS content can disappear despite a modern CLI; inspect actual hierarchy or require verified both-files mode |
| A provider route before v2.1.281 | Support may be absent; use ≥2.1.281 as the broad native floor, preferably the exact certified release |
| Native AGENTS replaces import path | InstructionsLoaded does not fire for it; update audit expectations |
| `--add-dir` instruction loading | Native AGENTS there is not loaded by the Claude additional-directory switch; preserve bridges or explicitly supply scoped instructions |
| Unapproved external AGENTS import | Native loading does not prompt to approve it; a prior approval/import route may be needed |
| `.agents/skills` is the only skill directory | Procedures remain undiscovered; removing CLAUDE.md does not solve skill distribution |

The failure table is a compatibility inference from S02. The smallest migration is conditional removal after L2 tests; a Windows CLAUDE.md symlink adds privilege/Git checkout pitfalls, so the existing plain import is preferable when compatibility remains necessary. [external S02; proposed]

### 2.6 Hooks: configuration, timing, failure and trust

The following is an API contract inventory from the current official hook reference, not a claim that Forge has implemented all these adapters. All 33 event rows share the common input below. Question marks denote optional fields, union bars denote alternatives, and all field names retain their wire spelling. [external S08]

```text
HookInput = {
  session_id: string, transcript_path: string, cwd: string,
  hook_event_name: Event,
  permission_mode?: string, prompt_id?: string, scratchpad_dir?: string,
  agent_id?: string, agent_type?: string,
  effort?: { level: low|medium|high|xhigh|max },
  ...eventFields
}
ToolFields = { tool_name: string, tool_input: object, tool_use_id: string }
McpOrigin = { mcp_server?: { name: string, source: string } }
```

Presence depends on context/version; agent_id distinguishes a subagent. MCP origin metadata, added in v2.1.274, must be checked by source as well as server name. Transcript writes can lag the event; use supplied last_assistant_message for completion checks. Windows tool paths are native absolute strings and need safe normalization before comparison. Permission-mode values and model effort availability are not a schema for Forge stage authority. [external S08, S03; proposed]

Settings contain `hooks: { Event: [{ matcher?: string, hooks: [Handler] }] }`; plugin `hooks/hooks.json` uses that same outer shape. User/project/local/managed settings, plugins, invoked skills and supported local agent definitions supply registrations. Matches and handlers run concurrently, not in registration order. Identical settings handlers are deduplicated; registrations from other origins can remain distinct. Do not build a dependency chain between separately registered hooks. [external S08]

Matchers select the event's discriminator, such as tool name, start source, compaction trigger, agent type, notification type, settings source or server. Simple names/lists use exact matching; other patterns take JavaScript regex semantics and may match substrings. Anchor intended whole-name regexes. FileChanged and StopFailure use a narrower exact-name set; a FileChanged matcher is a watched filename, not a recursive glob. Plugin MCP tool names and hook server references are separately namespaced. Missing matcher does not make an unsupported event handler type execute. [external S08]

| Handler | Fields, transport and default timeout |
| --- | --- |
| `command` | Required `command`; optional exec-form `args`, `shell:bash|powershell`, `async`, `asyncRewake`; stdin event JSON, stdout result JSON; 600s default |
| `http` | `url`, optional `headers`, `allowedEnvVars`; JSON POST/JSON response; 600s; network/non-2xx/invalid-response failure is non-blocking |
| `mcp_tool` | `server`, `tool`, optional `input` with event-field substitution; 600s; uses connected authorized server, never initiates OAuth |
| `prompt` | Required `prompt`, optional `model`; `$ARGUMENTS` event substitution; model returns `{ok:boolean,reason?:string}`; 30s |
| `agent` | Required `prompt`, optional `model`; tool-using verifier, experimental; 60s; do not make probabilistic review the sole enforcement mechanism |

Common handler fields include `type`, `timeout` (seconds), `statusMessage`, skill-only `once`, and tool-event `if` permission-rule filters. An `if` filter is best-effort parsing, not a security boundary. Defaults for command/HTTP/MCP handlers become 30s on UserPromptSubmit and model-switch events, and 10s on MessageDisplay. SessionEnd shares a 1.5s budget, raised by explicit longer timeouts up to 60s. An ordinary shell-hook timeout is generally an error rather than a deny; SDK PreToolUse callback timeout blocks the call, and PreModelSwitch timeout rejects the switch. Do not extrapolate that fail-closed behavior to HTTP or command hooks. [external S08]

`async:true` command hooks cannot gate the action, do not enforce timeout once running, and deliver usable results only while the session lives. `asyncRewake` retains timeout and can wake the agent on exit 2. Print mode can terminate outstanding background work at teardown. MCP hooks on first SessionStart/Setup cannot rely on a connected client; later lifecycle occurrences may work. Decision-bearing MCP hooks wait only within connection/hook budgets; observation hooks do not wait for connection. Use a small command hook for startup orientation and mandatory gate evaluation. [external S08; proposed]

Universal output fields include `continue`, `stopReason`, `suppressOutput`, `systemMessage`, and `terminalSequence` (string), but event-specific exceptions below override generic expectations. `hookSpecificOutput` includes exact `hookEventName`. Exit 0 is successful processing; exit 2 has event-specific blocking meaning; other failures usually continue, while valid decision JSON can still matter. Invalid JSON must never be mistaken for a successful deny. Output transformation is not rollback. [external S08]

#### All 33 event payloads and decision outputs

Handler notation: **C** command, **H** HTTP, **M** MCP, **P** prompt, **A** agent. `CHMPA` means all five; `CHM` means no prompt/agent. `ctx` means `hookSpecificOutput.additionalContext:string`; `block` means top-level `decision:"block", reason:string`. Every payload is the common envelope plus the fields listed. Nested object schemas are expanded immediately after the table. [external S08]

| # | Event / handlers | Additional payload | Allowed decision or change |
| --- | --- | --- | --- |
| 1 | **SessionStart** / CM | `source:startup|resume|clear|compact|fork`; `model?`, `agent_type?`, `session_title?`; resume/cache statistics? | ctx; `initialUserMessage`, `watchPaths`, `sessionTitle`, `reloadSkills`; stdout context; environment file; cannot block |
| 2 | **Setup** / CM | `trigger:init|maintenance` | Context/environment initialization; no action deny; `--init`, `--init-only`, `--maintenance` routes |
| 3 | **InstructionsLoaded** / CHM | `file_path`, `memory_type:User|Project|Local|Managed`, `load_reason`; `globs?`, `trigger_file_path?`, `parent_file_path?` | Observational/background; normal output ignored; native AGENTS loading does not emit it |
| 4 | **UserPromptSubmit** / CHMPA | `prompt:string`, `session_title?` | block/ctx; `sessionTitle`, `suppressOriginalPrompt`; cannot replace prompt |
| 5 | **UserPromptExpansion** / CHMPA | `expansion_type:slash_command|mcp_prompt`, `command_name`, `command_args`, `command_source`, `prompt` | block/ctx around expanded text; user slash route is distinct from Skill tool calls |
| 6 | **MessageDisplay** / CHM | `turn_id`, `message_id`, `index`, `final:boolean`, `delta:string` | `displayContent:string`; UI only, original model context/transcript retained |
| 7 | **PreToolUse** / CHMPA | ToolFields + McpOrigin | `permissionDecision:allow|deny|ask|defer`, `permissionDecisionReason`, `updatedInput:object`, ctx; defer print mode only |
| 8 | **PermissionRequest** / CHMP | `tool_name`, `tool_input`, `permission_suggestions?` | `decision:{behavior:allow|deny,updatedInput?,updatedPermissions?,message?,interrupt?}`; exit 2 is not a deny contract |
| 9 | **PostToolUse** / CHMPA | ToolFields + McpOrigin + `tool_response`; `duration_ms?` | block feedback/ctx; `updatedToolOutput` replaces result; `classifierContext` annotates auto classifier; side effect already happened |
| 10 | **PostToolUseFailure** / CHMPA | ToolFields + McpOrigin + `error:string`, `is_interrupt?`, `duration_ms?` | block feedback/ctx; cannot undo failure/partial mutation; cancelling an in-flight tool need not emit it |
| 11 | **PostToolBatch** / CHMPA | `tool_calls:[{tool_name,tool_input,tool_use_id,tool_response}]` | block stops further loop; ctx after parallel batch; tool_response is serialized content, not guaranteed original structured value |
| 12 | **PermissionDenied** / CHMPA | ToolFields + `reason` | Auto-mode denial; `retry:true` may permit retry after a classifier verdict; ignored for no-verdict failures; not user approval |
| 13 | **Notification** / CHM | `message`, `title?`, `notification_type` | Observation/terminal notification; no decision |
| 14 | **SubagentStart** / CHM | `agent_id`, `agent_type` | ctx at child start; cannot veto spawning |
| 15 | **SubagentStop** / CHMPA | `stop_hook_active`, `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message` | block continues child work; ctx provides non-error continuation; includes internal agents |
| 16 | **TaskCreated** / CHMPA | `task_id`, `task_subject`, `task_description?`, `teammate_name?`, deprecated `team_name?` | block/exit 2 deletes newly created task and returns feedback; ignores continue:false |
| 17 | **TaskCompleted** / CHMPA | Same task fields | block/exit 2 prevents completion; continue:false can stop teammate, but ignored when TaskUpdate triggered event |
| 18 | **Stop** / CHMPA | `stop_hook_active`, `last_assistant_message`; `background_tasks?`, `session_crons?` | block/ctx continues turn; bounded repeat protection; user interrupt does not follow ordinary Stop route |
| 19 | **StopFailure** / CHM | `error`, `error_details?`, `last_assistant_message?` | Output/exit ignored except terminalSequence; observation, not automatic recovery |
| 20 | **TeammateIdle** / CHMPA | `teammate_name`, deprecated `team_name?` | exit 2 returns feedback and prevents idle; continue:false/stopReason ends teammate |
| 21 | **ConfigChange** / CHM | `source:user_settings|project_settings|local_settings|policy_settings|skills`, `file_path?` | block prevents applying ordinary changed config, not writing it; managed policy changes cannot be blocked; reason not displayed |
| 22 | **CwdChanged** / CHM | `old_cwd`, `new_cwd` | `watchPaths` refresh; environment persistence; no cwd veto |
| 23 | **DirectoryAdded** / CHM | `directory`, `source:slash_command|register_repo_root` | Observation after access/sandbox state changes; no rollback; background command execution |
| 24 | **FileChanged** / CHM | `file_path`, `event:change|add|unlink` | `watchPaths` refresh/environment persistence; observation, not write prevention |
| 25 | **WorktreeCreate** / CHM | `name:string` | Command stdout final nonempty absolute existing-directory path; HTTP `worktreePath`; missing path/failure rejects creation |
| 26 | **WorktreeRemove** / CHM | `worktree_path` | Nonzero fails removal if directory remains; JSON discarded; cleanup is hook-owned when custom creation is used |
| 27 | **PreCompact** / CHM | `trigger:manual|auto`, `custom_instructions:string|null` | block/exit 2 can cancel compaction; continue/systemMessage ignored; recovery failure can terminate request |
| 28 | **PostCompact** / CHM | `trigger:manual|auto`, `compact_summary` | Observation; continue/systemMessage ignored |
| 29 | **PreModelSwitch** / CHM | ModelSwitchFields | block or permissionDecision allow/deny/ask; ask only with interactive approval host; timeout denies |
| 30 | **PostModelSwitch** / CHM | ModelSwitchFields; broader source including auto/resume | ctx to next request; background timing can delay delivery; only final target's pending context delivered |
| 31 | **SessionEnd** / CHM | `reason:clear|resume|logout|prompt_input_exit|other` | Cleanup/observation; cannot prevent ending; short shared budget |
| 32 | **Elicitation** / CHM | `mcp_server_name`, `message`, `mode?:form|url`, `url?`, `elicitation_id?`, `requested_schema?` | `action:accept|decline|cancel`, `content:object`; exit 2 declines |
| 33 | **ElicitationResult** / CHM | `mcp_server_name`, `action`, `mode?`, `elicitation_id?`, `content?` | Override action/content; exit 2 declines; continue/systemMessage/stderr not surfaced as normal feedback |

Supplementary wire contracts from S08:

```text
SessionStart resume statistics (optional):
  seconds_since_last_response, context_tokens,
  prompt_cache_likely_expired, estimated_cache_write_usd
InstructionsLoaded.load_reason:
  session_start|nested_traversal|path_glob_match|include|compact
Stop.background_tasks[]:
  id, type, status, description,
  command?, agent_type?, server?, tool_name?
Stop.session_crons[]: id, schedule, recurring, prompt
ModelSwitchFields:
  from_model, to_model, requested_model:string|null, source,
  context_tokens, prompt_cache_warm, cache_ttl:5m|1h,
  estimated_cache_write_usd
PermissionUpdate:
  type:addRules|replaceRules|removeRules|setMode|addDirectories|removeDirectories,
  rules?:[{toolName,ruleContent?}], behavior?:allow|deny|ask,
  mode?:PermissionMode, directories?:string[],
  destination?:userSettings|projectSettings|localSettings|session
```

Notification types documented in this snapshot include `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_url_dialog`, `elicitation_complete`, `elicitation_response`, `agent_needs_input`, `agent_completed`, `quota_auto_resume_fired`, `quota_auto_resume_stale`, and `quota_auto_resume_disabled`. StopFailure errors include `rate_limit`, `overloaded`, `authentication_failed`, `oauth_org_not_allowed`, `account_on_hold`, `billing_error`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `cloud_credential_error`, and `unknown`. Unknown future values must remain diagnosable rather than silently mapped to success. [external S08; proposed]

PreToolUse combines competing decisions with deny stronger than defer, ask and allow. updatedInput replaces the complete argument object; preserve fields deliberately. PostToolUse output rewriting now covers tool results more broadly than the old MCP-only field, which Python types still retain as deprecated compatibility. classifierContext is short, synchronous metadata for auto review, not a Forge approval. UserPromptSubmit suppression is not a reliable secret scrubber for every history sink. MessageDisplay redaction does not redact the transcript. [external S08; S22 types.py:407-417; inferred]

Hook trust depends on workspace review and managed policy. `allowManagedHooksOnly`, HTTP URL/environment restrictions and plugin allow/block policies can disable the proposed carrier. A trusted hook executes code outside the tool's ordinary permission/sandbox boundary. A mandatory Forge gate must return a valid deny before its own short deadline; classify disabled/uninitialized Forge separately from unreadable or failed active policy. A hook that crashes or times out cannot be called safe merely because it produced no allow. [external S08, S12, S14; proposed]

### 2.7 MCP, tool search, authentication and custom tools

MCP is Claude's custom-tool carrier. Plugin servers are namespaced and tools appear as `mcp__<server>__<tool>` with plugin-specific naming. Local/project/user/managed scopes differ: project `.mcp.json` needs approval, local/user state is held in Claude configuration, and plugin config participates in discovery. `--strict-mcp-config` uses only explicitly supplied configs, so it can suppress plugin MCP servers as well as unrelated discovery. It is suitable for an isolated server test, not proof that a marketplace plugin's server loaded naturally. [external S10; S22 types.py:1831-1836]

```json
{
  "mcpServers": {
    "forge": {
      "type": "stdio",
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/bin/forge-mcp.js"],
      "env": {}
    }
  }
}
```

This is a proposed shape, not an existing file. stdio uses command/args/env; HTTP uses type/http URL, optional headers/headersHelper and supported timeout/tool-exposure controls; `streamable-http` is an accepted alias. SSE is deprecated, with documented HTTP-to-SSE fallback. WebSocket can be configured with `type:ws` and headers but is not a `--transport ws` CLI route and does not support the same OAuth flow. SDK `type:sdk` in-process servers exist only in the host, not as an executable `.mcp.json` transport. Bad type/config combinations are diagnostic errors, not a connected server. [external S10, S22]

Remote authentication supports documented OAuth discovery/PKCE/registration routes and login/logout. Header helpers can obtain short-lived authorization without persisting literal headers. Server allow/deny policy and workspace trust remain necessary; connection/authentication never grants issue ownership. roots/list tracks the session's allowed roots and additions; normalize native paths and reject access beyond the active issue workspace in Forge as well. Keep credentials out of plugin config, transcripts and command lines. [external S10, S12; proposed]

Tool search is currently on by default when supported, unlike older guidance that deferred tools only after a 10% threshold. `ENABLE_TOOL_SEARCH` supports true, false, auto and auto:N; auto is threshold-based, true cannot force unsupported provider/model combinations. `alwaysLoad` retains selected server definitions upfront. Loaded definitions persist until compaction; catalog/search limits mean good tool descriptions and a small predictable bootstrap surface matter. Neither deferred loading nor readOnlyHint is an approval mechanism. [external S11]

Expose a narrow stable recap/readiness tool, then discover issue/gate/memory operations as needed. Forge's server must validate JSON Schema inputs, bind mutating operations to owned issue/lease/scope, and return typed evidence envelopes. SDK `tool`/`createSdkMcpServer` permits host-defined tools with TypeScript schemas or Python decorators; the server is still the correct cross-harness boundary. A native plugin has no general arbitrary replacement built-in tool registry. [external S21, S22; proposed]

### 2.8 Settings, permission modes and sandbox

| Mode | Operational meaning / Forge implication |
| --- | --- |
| `default` | Ordinary approval handling; in headless use an explicit host or explicit preapproved rules |
| `acceptEdits` | Auto-approves scoped file edits and some filesystem commands; not approval for every shell command or protected path |
| `plan` | Planning/read-oriented behavior; not a filesystem isolation boundary or substitute for Forge stage authorization |
| `dontAsk` | Approval-requiring calls are denied instead of prompted unless approved by rules; useful for a bounded proof tool set |
| `auto` | Model classifier reviews calls; availability/defaults vary; classification is not deterministic issue authority |
| `bypassPermissions` | Broad autoapproval; explicit denies/hooks still matter; unsuitable as a conformance shortcut |

These mode values are present in current CLI documentation and Python public types. `--tools` sets the available tool pool; allowedTools/allowed-tools sets preapproval rather than an exhaustive pool. Deny and ask rules remain stronger than a hook allow. `canUseTool` runs only when an approval question reaches the host, and whole-tool allow rules or autoapproval can shadow it. To observe/gate every tool call, use PreToolUse, plus server-side authorization for Forge mutations. [external S13; S22 types.py:1959-1973]

Rules use documented tool-name/specifier syntax, for example Read path scopes, Bash command patterns and MCP server/tool names. A command string pattern is not a shell parser for arbitrary equivalent destructive commands. Forge's mandatory git/CI gates remain authoritative beyond the agent's built-ins, and shell commands require a conservative classifier at their real dispatch seam. Do not install broad wildcard approvals to make the plugin appear functional. [external S13; proposed]

Claude's OS sandbox supports macOS/Linux/WSL2; native Windows is unsupported. Filesystem/network sandboxing, tool permission rules and plugin-code trust solve different problems. Hooks, helpers and MCP servers can run outside the sandboxed shell path. On Windows, use reversible workspace boundaries and prove each dispatch tool, particularly PowerShell: Bash-specific worktree guards do not establish equivalent PowerShell behavior. [external S14, S08, S07; inferred]

### 2.9 Headless, JSON streams and the Agent SDK

`claude -p` runs non-interactively. `--output-format text|json|stream-json` selects rendering; streaming requires `--verbose`, and `--include-partial-messages` adds deltas. JSON Schema output validates structure within the supported feature; unsupported annotations such as format do not substitute for host validation. Use argument arrays, explicit cwd, a pinned executable, explicit tools/mode, budget/turn limits, and an external process deadline. [external S15, S16]

The stream includes `system/init`, assistant/user messages, optional stream events, hook lifecycle events and `result`. init reports tools, plugins and MCP status, with plugin_errors and mcp_server_errors when relevant. It need not be the first line; a result need not be the final line. Parse every JSONL record and drain cleanly. Correlate session_id, UUID, parent_tool_use_id and agent IDs; do not discard child errors as main-agent prose. SIGTERM/interrupt and budget exits are distinct from success. [external S16, S20]

`--bare` suppresses ordinary ambient instructions, skills, hooks, plugins, memory and MCP discovery. Explicit `--plugin-dir` or config can reintroduce resources. Therefore a bare explicit-directory run proves that loading route only; it does not prove installation, marketplace scope, automatic discovery or repository AGENTS policy. Use two tests, with a non-bare installed-plugin run as the shipping receipt. PermissionRequest is not a dependable unattended approval host; use SDK permission handling or dontAsk with narrow rules. [external S15, S16, S08; inferred]

The TypeScript API's stable center is `query({prompt,options})`, returning an asynchronous stream with control methods. Python offers `query(prompt,options)` and persistent `ClaudeSDKClient` query/receive/interrupt methods. Both launch/control Claude's executable; the Python transport is inspectable wrapper code, not the closed agent engine. SDK options include cwd, tool pool/preapproval, system prompt preset/custom/append, model/fallback, permissions, MCP config, agents, hooks, settings sources, resume/fork, budgets, structured output and checkpoints. Pin wrapper and actual CLI separately. [external S21, S22, S23, S25]

| Important API pair | TypeScript / Python |
| --- | --- |
| Tool pool / preapproval | `tools`, `allowedTools`, `disallowedTools` / `tools`, `allowed_tools`, `disallowed_tools` |
| Approval callback | `canUseTool` / `can_use_tool`; allow may return updated input/permissions; deny includes message/interrupt |
| Settings | `settingSources`, `settings` / `setting_sources`, `settings` |
| Servers | `mcpServers`, `strictMcpConfig` / `mcp_servers`, `strict_mcp_config` |
| Executable pin | `pathToClaudeCodeExecutable` / `cli_path` |
| Limits / deltas | `maxTurns`, `maxBudgetUsd`, `includePartialMessages` / snake_case equivalents |
| Agent definitions | Named definitions with prompt, description and supported agent options; Markdown fields are not automatically all SDK fields |
| Resume | resume/continue/fork/session identity options; file checkpoints are separately enabled |

Omitted settingSources now loads the usual CLI user/project/local features; `[]` disables those filesystem sources but does not remove managed policy, all global auth/trust, auto memory or every remote connector/security restriction. SDK project settings/hooks are cwd-specific; instruction files and skill/agent discovery have their own ancestor behavior. TypeScript `env` replaces the child environment, so include the intended inherited environment explicitly; Python merges env over the parent. Credential isolation needs a separate clean identity/environment, not just settingSources:[] . [external S25; S22 types.py:1929-1936]

**SDK parity boundary:** inspected Python `HookEvent` contains only PreToolUse, PostToolUse, PostToolUseFailure, UserPromptSubmit, Stop, SubagentStop, PreCompact, Notification, SubagentStart and PermissionRequest. That ten-event typed callback surface is not the CLI's 33-event configuration surface. Python types also expose async callback output and narrower agent fields. TypeScript declaration download failed; this report does not claim its current union is identical or exhaustive. The proof recipe requires strict compilation and a runtime hook test on the package actually installed. Do not cast away missing event names. [external S22 types.py:258 onward; S24 incomplete; proposed]

TypeScript control methods described in release notes include permission/model changes, supported resource queries, server status/reconnect/toggle/config updates and plugin reload. Treat the underlying control-request JSON as a versioned SDK protocol, not a stable cross-harness JSON-RPC server equivalent. V2 preview session APIs changed/retired; use the supported query/client surface until a pinned proof covers alternatives. SDK permission callbacks and shell hook subprocesses have different timeout/failure paths. [external S21, S22; inferred]

### 2.10 UI, styles, status lines, workflows and other surfaces

Claude does not expose a generic plugin API for arbitrary TUI panels or replacing its renderer. Native extension points are styles, themes, status callbacks, notifications/display hooks, commands, MCP-related surfaces, channels and experimental workflows/monitors. Editor/web/remote-control features are separate hosts; their existence does not prove a third-party plugin can paint an arbitrary panel in the CLI. [external S04, S09, S17, S18; inferred]

Output styles are Markdown under user/project/plugin output-styles locations. Frontmatter supports name, description, keep-coding-instructions and force-for-plugin; the latter may override selection, so Forge should not force it. keep-coding-instructions defaults false and can change default coding guidance. Built-in style choices include Default, Proactive, Concise, Explanatory and Learning in the fetched docs. A style changes prompt behavior, not gates. [external S17]

`statusLine:{type:"command",command,...documented formatting options}` invokes a script with JSON stdin and displays stdout. Input includes model identity, workspace/cwd/repo/worktree, cost/duration/line counts, context token usage, rate limits, effort/thinking/fast mode, session/prompt/transcript identifiers, version, output style, agent and PR/MR state. Optional nested fields must be checked; estimated cost is not billed cost. Keep callbacks fast and use a bounded Kernel read/cache. Plugin settings only provide subagentStatusLine, so the main status line requires explicit user/project installation consent. [external S18, S04; proposed]

LSP declarations require command and extensionToLanguage; optional args, env, initializationOptions, settings, workspaceFolder, startup/shutdown timeouts, restartOnCrash/maxRestarts and diagnostics control. Although transport accepts stdio/socket labels, the documented loader currently runs these servers through stdio. Log to stderr. Forge is not a language server and gains no reason to ship one simply because the slot exists. [external S04, S09; inferred]

Themes use `themes/<slug>.json` and experimental.themes, with name/base/overrides; their detailed color-key schema belongs to the native theme format. Edits to plugin themes create user copies. Monitors use strict entries `{name,command,description,when?}` with always or on-skill-invoke triggers; they run shell commands for the interactive session and inject notifications. They do not run in -p, have provider/tool availability limits, cannot read plugin userConfig through substitution, and disabling a plugin does not stop an already-running monitor. [external S04, S09]

Channels bind `{server,displayName?,userConfig?}` to an MCP server and inject messages into a session. External ingress needs sender authorization; a received event is not authority to deploy or mutate an issue. Workflows are separate JavaScript orchestrations under workflows/, with their own lifecycle/UI and experimental contract; they are not necessary for the first Forge plugin. These interfaces were inventoried but not runtime-probed or independently source-audited; this dossier does not certify their full internal JS/color/protocol schemas. [external S04, S09; proposed]

Native plugin evals use evals/<case>/prompt.md, graders.md and supported case/context/mock resources. `claude plugin eval` needs v2.1.269+; repeated baseline/plugin runs can incur model cost, and default report publication needs `--no-publish` for private CI. Use deterministic tool/hook assertions for conformance, model-grading only for behavioral evaluation. Optional bin/ resources can expose bundled commands through the plugin environment; stdout/stderr discipline and executable permission/platform checks still apply. [external S19, S04; proposed]

## 3. What Forge can leverage, ranked

Every row is a proposal derived from the documented carrier; none upgrades today's activation plugin to an implemented integration. Keep the shared capability implementation inside Forge's one package, with a thin Claude-specific renderer. [proposed; read (local scratch)]

| Rank | Native advantage | Forge capability | User-visible benefit / constraint |
| --- | --- | --- | --- |
| 1 | PreToolUse deny and argument replacement | Gates, protected paths, stage/lease checks | Stops an invalid tool action before its side effect; deny must be deterministic and independently enforced for server mutations |
| 2 | Namespaced native plugin and marketplace cache | Installation, skills, capability catalog | One coherent install/update route; no global pile of copied procedures; cache provenance remains inspectable |
| 3 | SessionStart on startup/resume/fork/clear/compact | Kernel recap, Memory recall | Fresh bounded orientation after lifecycle changes; skip mutation/setup without authorization |
| 4 | MCP tool search and in-process/server tools | Kernel issues, gate state, structured evidence | API-first actions with typed inputs/results; small startup context and discoverable wider catalog |
| 5 | Headless JSONL with initialization/error diagnostics | Conformance proof | CI demonstrates installed resources and actual tool/gate behavior on a pinned engine |
| 6 | Native AGENTS fallback and both-files mode | Shared repository policy | Removes unnecessary bridge files where proven; version/provider/hierarchy exceptions stay explicit |
| 7 | Skill invocation controls and forked skills | Reference workflow, bounded review tasks | Procedures compose with the user's native workflow; delegation can avoid polluting the main context |
| 8 | Custom agents and WorktreeCreate/Remove | Reviewer roles, issue-linked isolation | Reuses Claude delegation while Forge preserves workspace/issue authority; actual launch scope must be proven |
| 9 | PostToolUse result replacement and classifier annotations | Evidence sanitization, concise result envelopes | Reduces noisy tool context; display filtering alone cannot protect transcripts |
| 10 | Native plugin evals and optional status callbacks | Behavioral regression checks, current authority display | Provides quality evidence and quick state visibility; optional cost/publication and UI consent |

The ranked order favors authority and proof over presentation. Compared with prompt-only integration, pre-tool decisions and structured MCP calls are the important gains. Compared with rebuilding an SDK host, using the existing CLI/plugin preserves native account, model, context, permission and editor workflows. [inferred from S04–S20]

## 4. Limits, gotchas and recent churn

| Limit or failure scenario | Evidence / engineering consequence |
| --- | --- |
| Core dispatch/config internals closed | Docs/types are contracts, not source verification; require installed-version behavior tests. [external S01, S21] |
| 33 CLI events versus ten Python callback types | Do not assume wrapper parity or bypass typing; use native hook files for the broad plugin surface. [external S08, S22] |
| Plugin agents silently ignore security/server fields | Put mandatory configuration in supported plugin-level carriers and test effects. [external S07] |
| Hooks can fail open | HTTP failure, disconnected MCP, invalid output and ordinary command timeout are not reliable denies. Adapter errors need explicit valid deny; retain git/server gates. [external S08] |
| Post-tool hooks are too late for prevention | Feedback/output replacement cannot undo a filesystem/external mutation. [external S08] |
| Native AGENTS fallback can be suppressed | Local/ancestor Claude files, settings, builtin disablement and older provider support invalidate a simple version-only check. [external S02] |
| Invocation routes differ | UserPromptExpansion covers a typed slash route that PreToolUse(Skill) can miss. [external S06, S08] |
| Provider feature parity varies | Tool search, PowerShell defaults, monitors, auto mode and earlier AGENTS support differ. Pin the full tuple. [external S03, S06, S11] |
| Cached install is not a checkout | External links, unchanged version strings and developer-only dependencies can fail after installation. Hash the actual cache; test packed resources. [external S04, S05, S09] |
| Native Windows lacks shell sandbox | Test command and exec-form hooks on Windows; do not call Bash isolation proof equivalent to PowerShell proof. [external S08, S14] |
| Windows quoting and console behavior | Plugin paths contain spaces; shell-form variable quoting is required. Prefer exec-form Node commands and preserve legitimate terminals. No desktop flashing test ran here. [external S03, S04; inferred] |
| Worktree base/cleanup differ from Forge | Native default-branch worktrees and team launch semantics can escape planned HEAD/cwd; custom creation/removal must pair. [external S07, S08] |
| Async completion is best effort | Session teardown can lose late output; cleanup cannot be assumed from SessionEnd alone. [external S08, S16] |
| Style/monitor/channel surfaces are not permission gates | Prompt modifications and unsolicited messages must not grant stage/write authority. [external S09, S17; inferred] |
| Diagnostics can contain sensitive input | Limit retained fields; do not run debug logging against real credentials merely to collect proof. [proposed] |

Current changelog changes relevant to the April–September 2026 compatibility window include native AGENTS support (v2.1.277, September 18), its provider/telemetry expansion (v2.1.281), plugin configuration/eval additions (v2.1.269+), option schema changes (v2.1.271), MCP-origin hook metadata (v2.1.274), agent depth/background behavior changes, and JSON-file agent definitions in print mode (v2.1.281). Older assumptions about Explore's fixed model, the agent wizard, a one-level subagent tree, tool-search thresholds or plugin fields should not survive without a version annotation. Not every change has the same provider rollout or minimum floor. [external S03, S06, S07, S08, S11, S19]

The v2.1.281 notes also report fixes for provider/proxy request failures, long-session resume, oversized prompt recovery, unquoted plugin-root diagnostics and large system prompts passed through private files. Those are **announced fixes**, not bugs reproduced in this phase or proof every variant is fixed. Use file-based system-prompt flags for large host-generated prompts and include gateway/resume cases when those routes are supported. No current defect is asserted solely from an old issue report. [external S03]

Research-tool limitations: shell HTTP attempts failed through this environment's TLS/proxy path; official web retrieval supplied the evidence. The TypeScript reference exceeded the fetcher's content limit, its Markdown representation was unsupported, and CDN declaration downloads failed. Therefore exact TypeScript declaration parity remains unverified. This is a fetch limitation, not evidence that the SDK lacks types or that Claude itself is broken. [ran: failed fetches; S24]

## 5. L2 installed-version proof recipe

**Unrun, proposed.** This phase explicitly forbids invoking Claude. Commands below are a reviewable CI recipe, not test results. The current plugin can pass activation/load checks only; future MCP, gate, lifecycle and mutation-authority checks remain required before certifying the proposed full integration. L1 validation checks structure; L2 exercises the installed harness; L3 verifies any real deployment/service effect separately. [proposed]

### 5.1 Pin and install the real plugin

Use a disposable Windows/Linux CI identity and workspace. Supply a preinstalled **2.1.286** executable as CLAUDE_BIN, an absolute packed/unpacked Forge artifact root as FORGE_ARTIFACT_ROOT, and CI authentication through the supported secret environment without printing it. Node 24 or 26 is the Forge runtime. Record OS, provider, model, CLI version, SDK version if used, artifact hash, settings source, installation scope, exit code and full sanitized JSONL. Disable publisher behavior, not permission/security gates. [proposed; external S15, S19]

```powershell
$ErrorActionPreference = 'Stop'
$claudeBin = $env:CLAUDE_BIN
$artifactRoot = (Resolve-Path -LiteralPath $env:FORGE_ARTIFACT_ROOT).Path
$proofRoot = Join-Path $env:RUNNER_TEMP ('forge-claude-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $proofRoot | Out-Null
$env:CLAUDE_CONFIG_DIR = Join-Path $proofRoot 'claude-config'
$version = (& $claudeBin --version | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $version -notmatch '^2\.1\.286\b') {
  throw 'Pinned Claude Code version unavailable'
}
& $claudeBin plugin validate (Join-Path $artifactRoot 'plugin') --strict
if ($LASTEXITCODE -ne 0) { throw 'Plugin validation failed' }
& $claudeBin plugin marketplace add $artifactRoot
if ($LASTEXITCODE -ne 0) { throw 'Marketplace add failed' }
& $claudeBin plugin install forge@forge --scope user
if ($LASTEXITCODE -ne 0) { throw 'Plugin install failed' }
```

The runner must enter its disposable test cwd using its native workdir option; do not run this in a user worktree. It must already be a trusted test environment with controlled managed policy. CLAUDE_CONFIG_DIR isolates normal CLI state but is not a claim to neutralize all managed/provider configuration. The source root must contain the actual marketplace pointing at the artifact's plugin. A Git checkout route is useful during development; a release receipt must use the same resources shipped in the npm tarball, not an extra development directory. [proposed]

### 5.2 Current activation/load smoke test

Run in an empty disposable project with no Forge initialization. Use a real model available on the selected provider; retain the resolved model from init. The tool pool prevents the activation procedure from performing setup. [proposed]

```powershell
$streamPath = Join-Path $proofRoot 'activation.jsonl'
$stderrPath = Join-Path $proofRoot 'activation.stderr'
& $claudeBin -p '/forge:activation' `
  --permission-mode dontAsk --tools 'Skill' `
  --allowedTools 'Skill(forge:activation)' `
  --max-turns 2 --max-budget-usd 1 `
  --verbose --output-format stream-json `
  1> $streamPath 2> $stderrPath
$runExit = $LASTEXITCODE
$events = @(Get-Content -LiteralPath $streamPath | Where-Object { $_.Trim() } |
  ForEach-Object { $_ | ConvertFrom-Json })
$init = @($events | Where-Object { $_.type -eq 'system' -and $_.subtype -eq 'init' })
if ($init.Count -ne 1) { throw 'Expected one system/init' }
$loaded = @($init[0].plugins | Where-Object { $_.name -in @('forge','forge@forge') })
if ($loaded.Count -ne 1) { throw 'Forge not uniquely loaded' }
if (@($init[0].plugin_errors).Count -and $init[0].plugin_errors) {
  throw 'Plugin initialization error'
}
if (@($init[0].mcp_server_errors).Count -and $init[0].mcp_server_errors) {
  throw 'MCP initialization error'
}
$result = @($events | Where-Object { $_.type -eq 'result' })
if ($runExit -ne 0 -or $result.Count -ne 1 -or
    $result[0].is_error -or $result[0].subtype -ne 'success') {
  throw 'Activation run did not complete successfully'
}
$cachedManifest = Join-Path $loaded[0].path '.claude-plugin/plugin.json'
if ((Get-FileHash -LiteralPath $cachedManifest).Hash -ne
    (Get-FileHash -LiteralPath (Join-Path $artifactRoot 'plugin/.claude-plugin/plugin.json')).Hash) {
  throw 'Installed manifest differs from artifact'
}
```

Do not consider this parser alone full behavioral proof. Assert the installed path is under the isolated cache and differs from the source checkout. Hash **every packaged resource** in a generated artifact manifest, not just plugin.json. Capture a UserPromptExpansion observation or supported command inventory to prove `forge:activation` resolved to this plugin; an ordinary model answer mentioning Forge is insufficient. Assert the SessionStart hook injected the inspected `Forge is ...` nudge, and `.forge/` plus unrelated files remained absent. If a provider cannot reach the model, record a blocked run, not a passing install receipt. [proposed; read plugin/hooks/session-start:4-16]

For deterministic expansion observation, add a test-only user/flag hook pointing by exec-form args to a recorder in the disposable proof directory. It records event name, command_name, command_source and a hash of expanded prompt text, then returns `{}`. It must not print prompt/credentials. Use UserPromptExpansion for typed slash commands, and PreToolUse only when testing model Skill invocation. An explicitly loaded hook recorder tests instrumentation, while the Forge resource must still be discovered through the installed plugin. [proposed]

### 5.3 Full integration assertions after implementation

The following are acceptance cases for the proposed plugin. The fixture tools/reasons are deliberately named contracts to implement, not claims that those tools exist today. Each case needs a bounded process deadline and an explicit pass/fail receipt; a max-turn exit, malformed stream, partial side effect or unsupported handler is a failure. [proposed]

| Case | Exact invocation shape / required assertion |
| --- | --- |
| Orientation lifecycle | New `-p` session, `--resume <captured-id>`, then `--resume <id> --fork-session`; verify each corresponding source and a fresh Kernel recap timestamp/issue ID; no forced initialization |
| MCP discovery | Non-bare installed-plugin run; init must contain the expected plugin server, no server error, and connected/authenticated status before read assertions |
| Read-only Kernel tool | `-p 'Call the Forge recap tool for the seeded test issue once; report its structured evidence.' --tools '<exact-discovered-tool-name>' --allowedTools '<exact-discovered-tool-name>' --permission-mode dontAsk --max-turns 3 --max-budget-usd 1 --verbose --output-format stream-json`; assert actual tool_use/result IDs and seeded issue/version, not prose |
| Mandatory deny | Prompt an actual Write/Edit to an absolute protected fixture path using its exact available tool; verify PreToolUse response contains deny and stable `FORGE_PROOF_DENY`, and content/hash remains unchanged |
| Equivalent dispatch routes | Repeat through Bash, PowerShell and MCP mutation tools if available; each unsupported route is an explicit support limitation, not a skipped pass |
| Active adapter error | Break the active gate fixture's read/parse/adapter dependency; expect explicit deny and unchanged target; distinguish from deliberately disabled/uninitialized Forge |
| Input replacement | Harmless fixture tool returns its received argument; verify replacement preserves required fields and the tool receives the updated full object |
| Output replacement | Harmless fixture result contains a sentinel; verify model-facing transformed result and intended transcript policy separately |
| No lease / wrong scope | Mutating Forge server tool must reject without valid fixture ownership, even when Claude permission rules preapprove the tool |
| Subagent enforcement | Launch a named reviewer; capture child ID and cwd/HEAD, require gate observation for child tools; ignored plugin-agent frontmatter must not be the only gate |
| Compaction | Force a supported bounded compact scenario; verify PreCompact/PostCompact events and fresh authoritative recap, not replayed old state |
| Update | Install version A, update catalog/plugin to B, new session: cache hashes and init identify B; plugin-data cache retention and Kernel data remain correct |
| Trust/policy suppression | Disable hooks/plugin or apply managed restrictions; report missing carrier, never an apparently supported gate |

A fixture MCP server may expose proposed `recap`, `gate_state`, `memory_recall`, and a harmless test mutation; obtain the actual names from the installed tool inventory instead of hardcoding an assumed namespace. Use ToolSearch only where it is supported; separately exercise alwaysLoad/upfront exposure. Authentication/error status is not itself a tool call. [proposed]

### 5.4 AGENTS.md and skill-location proof matrix

Generate an ephemeral random non-secret marker in each instruction fixture. Tell the model only to return the value named by project instructions, with `--tools '' --permission-mode dontAsk --output-format json --max-turns 1 --max-budget-usd 1`. It cannot choose to Read the file to pass; the expected marker must already be injected. Each test runs in its own explicit cwd/config and records resolved provider/version. [proposed]

| Fixture | Expected on the chosen native support floor |
| --- | --- |
| AGENTS.md only; builtin enabled/default option | Marker from AGENTS without CLAUDE import |
| CLAUDE.md containing only `@AGENTS.md` | Same marker, one logical instruction load |
| Ancestor CLAUDE.md / `.claude/CLAUDE.md` / local CLAUDE.local.md | Each individually suppresses default fallback; test all three, not one representative |
| Both-files option supplied through flag/user settings | AGENTS marker still available; import path deduplicated |
| Same option supplied only through project/local settings | Does not silently opt into both-files behavior |
| Builtin disabled / `claude-md` option | Native AGENTS absent; bridge still supplies content |
| Nested directory Read | Scoped native AGENTS loaded when eligible; suppressing nested Claude file changes expectation |
| Additional directory switch | Claude instruction bridge loads; native AGENTS alone does not gain equivalent support |
| Direct versus imported AGENTS | InstructionsLoaded observer distinguishes the documented routes |
| `.agents/skills/<unique>/SKILL.md` only | No documented native skill registration; compare actual inventory and direct slash outcome |
| `.claude/skills` projection and installed plugin skill | Each appears through its own documented route; names/content hashes match canonical source |

Run every advertised provider/telemetry combination, with a pre-floor client retained as a negative compatibility case if older clients remain supported. A version number alone cannot approve bridge deletion. An unexpected positive `.agents/skills` result is evidence to update this dossier, not an excuse to discard the negative test. [proposed]

### 5.5 SDK type/runtime checks and native evals

Install the exact TypeScript SDK version and typecheck its published declaration bundle with strict checking and `skipLibCheck:false`; include a compile-time check that SDKMessage is not `any`, the intended hook event literals exist, and required Query methods export at runtime. Do not fix failures with casts or a library-check exemption. Run the matching Python wrapper with its explicit cli_path and a supported callback before claiming parity. Assert the actual child CLI version, not just the package version. [proposed; external S21, S22]

For native behavioral evaluations after adding real cases:

```text
claude plugin eval <installed-or-artifact-plugin-path> --no-publish
```

Pin the eval case schema, repetition count, model and spending limit from that installed CLI's help/reference before scheduling it. Store deterministic conformance and model-grade evidence separately. The native eval command does not replace the non-bare marketplace installation test. [proposed; external S19]

## 6. Best-possible Forge integration

This design is proposed. The owner-selected one npm package, durable Kernel authority, public building blocks and configurable capability journeys remain constraints. Claude's native workflow is the carrier; Forge must not turn every interaction into a mandatory global stage ladder. [read docs/work/2026-09-30-forge-final-plan/north-star.md; (local scratch)]

| Surface | Proposed implementation | Remains native |
| --- | --- | --- |
| Package/catalog | One Forge npm artifact with a generated Claude plugin tree and marketplace entry; immutable version/provenance | Claude installation, cache, enablement, trust |
| Skills | Package physical canonical resources; namespaced stage/capability skills; user-invoked risky transitions remain explicit | Invocation menu, relevance, argument expansion, forked contexts |
| Orientation | Fast exec-form Node SessionStart handler for startup/resume/fork/clear/compact; bounded read-only recap | Session lifecycle and context insertion |
| Gates | Single supported PreToolUse adapter mapping tools to shared gate contracts; valid deny on active-policy errors; narrow no-op when explicitly inactive | Permission UI and native tool dispatch |
| MCP | Thin stdio launcher using public Forge building blocks; typed inputs, lease/scope enforcement, structured results | Server connection, auth, search and tool use |
| Agents | Optional spec/quality reviewers with bounded tool sets and evidence outputs; no ignored security fields | Child scheduling, model selection, transcript/context |
| Worktrees | Opt-in paired hooks call Forge's worktree API with issue/lease and planned head | Native agent launch and display |
| Instructions | Keep AGENTS canonical and the one-line bridge until matrix passes; remove only under chosen compatibility policy | Native instruction/rule loader |
| State | Kernel stores issue/workflow/run authority; plugin data stores disposable dependencies/cache only | Claude session history and auto memory |
| UI | Optional user-approved status callback; plain native denials/results; defer themes, channels, monitors and workflows | TUI/editor/remote host and user's style |
| Proof | L1 resource validation/hash + L2 installed stream/tool/gate assertions + separate behavioral evals | Headless engine/SDK execution |

Install from a self-hosted marketplace first. Official Anthropic directory submission is an additional distribution/review route, not a prerequisite to prove the plugin. A single npm source entry can preserve the one-package train if the packed plugin-root layout and dependency rules pass L2; otherwise a Git subdirectory pinned to the same release is a packaging route, not a second product package. Require the same generated resource hashes on both routes. [external S05, S26; proposed]

Upgrade flow: bump one Forge version, build/validate the generated resources, publish the artifact/catalog under the authorized release workflow, update marketplace/plugin, then prove a new session loads the new cache. Preserve Kernel authority across versions; place migrations in Forge, not startup prompt text. Keep a previous immutable plugin/version as the reverse path. User-config additions must be optional/defaulted or accompanied by a clear configure step because shell installation never prompts. [proposed; external S04, S05, S09]

Effort is **8–13 worker-days**, conditional on the shared public gate/Kernel APIs and a usable MCP server already existing. This is integration effort, not a backend rewrite estimate. [inferred estimate]

| Work | Worker-days | Main uncertainty |
| --- | --- | --- |
| Manifest/catalog/artifact resource generation | 1–2 | Cached package layout and source pinning |
| Canonical skill/agent packaging and collisions | 1–2 | Supported metadata and Windows links |
| Lifecycle and deterministic gate adapter | 2–3 | Cross-tool parsing, error deny and worktree scope |
| MCP binding/permission configuration | 1–2 | Shared server readiness and deferred exposure |
| Installed-version matrix, update tests, documentation | 3–4 | Windows/provider parity and real authentication |

Do not promise the lower bound if the server or shared gate contract still needs implementation. Risk is **medium** for the native integration and **high until proven** for security parity across shell/provider routes. The minimal first certification is skills + orientation + gates + Kernel/MCP reads/mutations with server-side authority; optional UI and experimental runtime features are outside that first certification. P7's 3–4 days is plausible for a load-only prototype, not this complete support claim. [inferred]

## 7. Keeping current

Watch the [official CLI changelog](https://code.claude.com/docs/en/changelog), [Claude Code releases](https://github.com/anthropics/claude-code/releases) and its [release feed](https://github.com/anthropics/claude-code/releases.atom), plus the [TypeScript changelog](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md) and [Python releases](https://github.com/anthropics/claude-agent-sdk-python/releases). Re-read memory, hooks, plugin/schema, permission and SDK-feature docs at each candidate support-floor change. The inspected September sequence includes 2.1.277 and 2.1.286 only twelve days apart, so annual/static capability tables are inadequate; that observation does not establish a fixed release schedule. [external S03, S21, S22, S27; inferred]

Proposed update triggers: a new hook/payload/decision field; changed handler support/failure semantics; SDK type or control-method drift; permission default/auto-classifier changes; AGENTS/skill discovery changes; plugin cache/source/manifest changes; Windows shell/quoting/worktree changes; provider-specific feature rollout; MCP transport/auth/search changes; structured-stream changes. Re-run only affected focused proof cases plus the canonical installed artifact smoke test. Promote support only after a stored receipt; retain previous release support until its replacement passes. [proposed]

## 8. Phase receipt and boundaries

The only authored artifact is this dossier. Local evidence included the root bridge, current plugin manifest/marketplace/hook/activation resources, the north star and Claude section of P7. Official memory/changelog/extension/SDK docs and Python definitions were inspected; official TypeScript repo/README/changelog and an actual official plugin manifest were inspected. Source-backed claims are not rounded up to runtime behavior. [read paths in this report; external source register]

No installed Claude/version, live provider, runtime hook, marketplace cache, AGENTS injection, MCP call, permission decision, GUI behavior or deployment was verified. The TypeScript declaration retrieval and full experimental workflow/theme/channel protocol audit are explicit research limits. No new implementation or issue was authorized by these proposals. Future work remains in the owner's plan, rather than being silently started from this research leg. [ran: no Claude execution; inferred]

## Bottom line

1. Native AGENTS.md support is real in the current official contract, starting with v2.1.277. [external S02, S03]
2. The broad compatibility floor should be at least v2.1.281, with an exact certified release/provider tuple. [inferred]
3. Keep the import-only CLAUDE.md until that matrix passes; remove it conditionally afterward. [proposed]
4. `.agents/skills` still needs Claude-specific projection or physical plugin packaging. [external S06; proposed]
5. Build the five core carriers: skills, orientation, gates, MCP and optional reviewers. [proposed]
6. Put security/server configuration in supported plugin-level surfaces, not ignored agent frontmatter. [external S07; proposed]
7. Use deterministic gate decisions plus Kernel/server/git authority; prompt compliance is insufficient. [inferred]
8. Test actual marketplace/cache discovery separately from bare explicit-directory loading. [proposed]
9. Budget 8–13 integration worker-days under the stated shared-backend assumptions. [inferred]
10. This research is written; implementation and installed-version certification remain unperformed. [ran]

## Corrections to P7

These corrections are recommendations for the integrator; P7 was not edited.

1. **P7:8 and policy table at :75:** add Claude's conditional native AGENTS support, exact v2.1.277 introduction/date and v2.1.281 wider provider floor. Keep the `.agents/skills` distinction. [external S02, S03]
2. **P7:82:** replace 32 hook events with 33 and link the event/handler/payload inventory; MessageDisplay, DirectoryAdded, FileChanged and model-switch surfaces must not be lost in an abbreviated list. [external S08]
3. **P7:83:** add ignored plugin-agent `initialPrompt` to hooks/mcpServers/permissionMode; distinguish CLI/file definitions from plugin agents. [external S07]
4. **P7:84:** qualify ws as JSON configuration with narrower auth/CLI support; distinguish SDK in-process servers and deprecated SSE. [external S10, S22]
5. **P7:85:** require non-bare installed discovery, actual effect assertions and complete stream parsing; bare/plugin-dir is a separate test. init presence alone is not certification. [external S15, S16, S20; inferred]
6. **P7:80:** distinguish npm plugin sources from the unimplemented npm marketplace loader; version strings alone are not immutable source pins. [external S05]
7. **P7:79:** qualify userConfig secure storage/substitution by platform/component; plugin settings supports only agent/subagentStatusLine; detailed merge versus replace behavior matters. [external S04, S09]
8. **P7:90:** developer links can work locally, but a distributed cached plugin must contain its resources; do not rely on links outside the npm/plugin artifact. [external S04, S09]
9. **P7:91:** split explicit inactive/uninitialized no-op from active-policy unreadable/adapter-error deny. Do not generalize documented hook transport failures into a safe fail-open gate. [external S08; proposed]
10. **P7:97:** revise low-risk/3–4 days to a prototype estimate; complete integration is medium risk and 8–13 worker-days with stated backend assumptions and matrix proof. [inferred]
11. **P7:25, :87:** retain the present activation-only scope; also note its `startup|clear|compact` matcher omits resume/fork, which a fresh recap design needs. [read plugin/hooks/hooks.json:3-10; plugin/hooks/session-start:4-16]
12. **P7:13, :73:** do not use AGENTS policy as a substitute for live orientation or deterministic enforcement; native instruction loads do not all produce InstructionsLoaded. [external S02, S08; inferred]

## Open questions for the owner

Each question has independent A/B/C choices; letters are reply controls, not capability names. Silence uses the stated default in future planning, and does not authorize implementation/deletion in this research-only phase.

| Decision | Choices | Default and reasoning |
| --- | --- | --- |
| CLAUDE.md compatibility | **A:** retain import bridge until support-matrix proof. **B:** require certified modern clients and remove bridges after proof. **C:** remove all bridges immediately. | **A.** Native support is verified in source, but installed/provider/hierarchy behavior was not run; one line preserves older sessions. |
| Integration host | **A:** native plugin + shared CLI/MCP building blocks. **B:** new SDK-hosted application first. **C:** maintain both as first-release products. | **A.** Preserves the native loop/account/UI and one-package scope; SDK stays a proof/embedding route when demanded. |
| First certification scope | **A:** the five core carriers with Windows/provider proof. **B:** activation-only exposure marked experimental. **C:** add workflows/channels/monitors/styles to first certification. | **A.** Tests the capability promise; B is the fallback if proof blocks; optional experimental surfaces do not earn authority. |

## Confidence

**High** for the native AGENTS answer, import-only bridge compatibility, documented skill discovery, current 33-event inventory, ignored plugin-agent fields and the observed Forge activation scope: these have direct official/local evidence. **Medium** for the complete integration design and effort estimate: they depend on public building-block readiness and installed-version behavior. **Unverified** for current TypeScript declaration parity, every experimental UI/workflow schema, live provider parity and L2 certification. Keep those boundaries in the final plan; do not convert a documented contract into a passed test. [external/read evidence above; inferred]
