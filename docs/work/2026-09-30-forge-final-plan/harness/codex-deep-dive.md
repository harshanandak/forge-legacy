# OpenAI Codex harness deep dive

Decisions needed: packaging and proof bootstrap. Defaults: a legacy local Codex bundle, a separate portable directory bundle, and ordinary hook trust before headless certification.

## Bottom line

1. Current stable and installed CLI: **0.159.3**; most inspected Rust source is pinned to rust-v0.159.3. [ran: version/help; external: [release](https://github.com/openai/codex/releases/tag/rust-v0.159.3)]
2. The stable host deliberately omits hooks/apps from root Agent Plugins bundles, even though their metadata parses. [external: [loader, L841–907](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/loader.rs#L841-L907)]
3. A recognized root plugin.json shadows .codex-plugin/plugin.json; putting both in one hook-bearing bundle is unsafe for capability claims. [external: [selection](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/utils/plugins/src/plugin_namespace.rs#L11-L74)]
4. Plugin agents have no component in the inspected model; legacy commands have a conversion-to-skills path, not an established native command-handler API. [external: [components](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/plugin/src/manifest.rs#L6-L35), [commands](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/manifest.rs#L190-L205)]
5. Codex/Claude hooks share a wrapper/subset, but handler types, decisions, exits and timeouts differ. Generate separate adapters. [external: [Codex parser](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/output_parser.rs#L343-L474), [Claude](https://code.claude.com/docs/en/hooks)]
6. Explicit synchronous pre-tool denial blocks; several execution/parsing failures remain fail open. Keep authoritative checks outside hooks. [external: [reducer](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/pre_tool_use.rs#L179-L291); inferred: consequence]
7. Native skills, narrow MCP tools and JSONL proof are the strongest first carriers; deprecated skill roots still work. [external: [roots](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/ext/skills/src/host_roots.rs#L51-L119), [MCP](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/mcp_types.rs)]
8. DevDay September 29 added managed Codex-harness access through Agents API and richer plugin UI; current docs establish shared ChatGPT/Codex distribution. [external: [recap](https://openai.com/index/devday-2026-recap/), [architecture](https://developers.openai.com/plugins/concepts/plugins)]
9. Proposed L2 must prove installed discovery, live MCP, orientation and causal denial; assistant prose and cached catalogs do not suffice. [inferred: §5]
10. This phase provides research and a proof recipe; no Forge plugin/L2, live UI or machine-local Windows fix was proved. [ran: only CLI version/help]

Research date: **2026-10-01**. All external sources linked here were fetched that date; primary sources only.

### Request and evidence boundary

~~~json
{
  "protocolVersion": "1.0",
  "requestId": "forge-deep-codex-20261001",
  "contextDigest": "5a8c530afa2f0a470711238b0bd331d1ddc5f5a06a774063b9730cffce244970",
  "context": {"summary": "Forge harness deep dive: OpenAI Codex."},
  "flowSpec": null,
  "cwd": ".",
  "policy": {"write": true, "tools": [], "maxCostUsd": null},
  "route": {"model": "gpt-6.1-sol", "thinking": "xhigh", "search": true}
}
~~~

The route preserves requested metadata, not model self-attribution. Inputs read: (local scratch), common.md, north-star.md and platform/P7-harness-plugins.md's Codex/open-points sections. The one-file/no-git/no-issue-mutation brief governs this phase. [read: named research inputs]

**[external: code]** = inspected lines, rung 2; **[external: docs]** = documented contract, not execution; **[ran]** names the actual command; **[inferred]** marks reasoning; **(proposed)** means undelivered integration. No source finding is rounded up to installed-version proof.

Official release/npm endpoints returned 0.159.3, released 2026-09-30T22:57:34Z. Main's endpoint returned dd90f160ed9bf91320c417335ddff848b6a23dd0, dated 2026-10-01T09:52:54Z. Two fallback reads—AGENTS discovery and scheduling—used main after stable retrieval failed; fetched contents were **not independently tied to that exact SHA**. [ran: bounded Node reads of official GitHub/npm endpoints]

Commands checked: codex --version; exec/app-server/plugin --help; plugin add/marketplace add --help; app-server generate-json-schema --help. Installed version was codex-cli 0.159.3. Startup reported access denied for stale arg0 cleanup/PATH aliases in this restricted environment. This is a command-surface check, not plugin execution or a diagnosis of Codex. [ran: native PowerShell]

## 1. Architecture

### Agent loop, dispatch and stop

Stable entry is core/src/session/turn.rs, rather than historical core/src/codex.rs. It drains completed async hook feedback, considers pre-sampling compaction, resolves required MCP/plugin startup, captures a request-scoped context/environment snapshot and streams Responses. Tool results enter history for another sample. Pending input/mail also keeps the turn alive. When neither model follow-up nor queued input remains, Stop hooks can request continuation; cancellation/fatal errors terminate independently. [external: code, [run_turn, L145–274 and L514–640](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/session/turn.rs#L145-L274)]

~~~mermaid
flowchart LR
  I[Turn input and queued mail] --> C[Context and compaction]
  C --> M[Responses stream]
  M --> T[Tool router]
  T --> P[Pre-tool hooks and native policy]
  P --> X[Execute]
  X --> O[Post-tool feedback and history]
  O --> M
  M --> S[Stop hooks]
  S --> E[Complete]
  S --> M
~~~

The registry resolves runtime/tool policy, supports conversion of hook-rewritten input and turns pre-tool rejection into a model-visible failure. Post-tool feedback is applied after execution. **[inferred]** Post-tool blocking cannot roll back an operation that already happened. [external: code, [registry, L124–158 and L562–594](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/tools/registry.rs#L562-L594)]

**Main-only scheduling:** parallel-capable calls take a shared lock; other calls take an exclusive lock. Readiness waits precede admission. The stable loop uses FuturesOrdered for in-flight result collection. Multiple model calls do not imply unbounded parallelism; the main lock implementation was not executed on the stable binary. [external: code, [main scheduler, L131–216](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/parallel.rs#L131-L216), [stable collection](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/session/turn.rs#L2347-L2456)]

### Context, compaction and memory

Separate prompt surfaces include built-in/model instructions, developer instructions, project/user guidance, environment/permissions, skills/plugin injections, hook context and history. Config exposes developer, permissions, apps, collaboration and environment-context controls. model_instructions_file replaces built-ins; compact_prompt changes summarization. **(Proposed)** Forge should use scoped guidance/skills, not replace the model prompt. [external: code, [prompt fields, L227–251](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/config_toml.rs#L227-L251); inferred: design]

Manual/pre-turn compaction clears reference context for reinjection on the next regular turn; mid-turn compaction places initial context before the last real user message. The local compactor's user-message selection has a 20,000-token cap and can remove oldest history items when compacting exceeds context. Pre/PostCompact bracket the operation. Provider capability determines remote/local compaction. [external: code, [compact, L52–68, L170–208, L297–308](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/compact.rs#L52-L68)]

Local Codex memories differ from ChatGPT web memory. Off by default, features.memories enables them; generated summaries/entries/evidence live under CODEX_HOME/memories. Eligible idle sessions are processed in the background, subject to quotas and external-context exclusions. Use/generation controls are separate. **(Proposed)** Forge retains memory/issue authority and exposes recall through tools; it should not write Codex-generated memory files. [external: docs, [memories](https://learn.chatgpt.com/docs/customization/memories); inferred: authority]

### Storage, resume and providers

Rollouts are JSONL, normally rollout-<timestamp>-<thread-id>.jsonl. The recorder buffers until materialization, flushes queued records and retains pending data after write failure. Resume uses first session metadata as canonical identity, can count/skip malformed records and reject unknown history modes. Archives use separate storage. **[inferred]** Transcript existence does not prove successful turn persistence. [external: code, [recorder, L89–97, L1002–1116, L1468–1484](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/rollout/src/recorder.rs#L1002-L1116)]

Exec has resume/fork; --ephemeral avoids session-file persistence. App Server supports start/resume/fork/read and paginated turns/items. Thread replies expose instruction source paths and effective settings. Stable types explicitly say disabledPluginIds is saved state that does **not yet filter capabilities**; do not use it as security authority. [ran: exec help; external: code, [thread types, L191–215, L294–310, L420–443](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/v2/thread.rs#L294-L310)]

ModelClient is session-scoped; ModelClientSession holds turn transport/routing state. Responses uses HTTP or capability-enabled WebSockets, incremental reuse and auth-owner invalidation. This is separate from App Server client transport. CLI exposes model and Ollama/LM Studio selection. **(Proposed)** Let Codex own inference/context/retries; record effective model/provider/policy with Forge proof. [external: code, [client, L10–20 and L970–980](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/client.rs#L10-L20); ran: help; inferred: design]

### Configuration resolution

Highest-to-lowest defaults: CLI/runtime → trusted project config, nearest cwd winning → selected CODEX_HOME/<name>.config.toml → user → cloud defaults → system → built-ins. Requirements constrain separately. Windows system config/requirements live under %ProgramData%/OpenAI/Codex. Untrusted project config/hooks/execution-rule layers are disabled. [external: docs, [basics](https://learn.chatgpt.com/docs/config-file/config-basic); code, [loader](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/loader/mod.rs#L252-L318)]

Since 0.134.0, profiles are separate files; selected legacy nested profiles/top-level selectors are rejected. Project config ignores host-owned provider/base-URL, notification, profile and telemetry keys. Merge is recursive with alias normalization/special structured settings. **(Proposed)** Add scoped settings; preserve the user's full configuration and managed constraints. [external: docs, [advanced](https://learn.chatgpt.com/docs/config-file/config-advanced); code, [validation](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/loader/mod.rs#L284-L304), [merge](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/merge.rs#L50-L98)]

## 2. Extension points

Public loading contracts, configuration, programmatic hosts and internal code are distinct. A listed component is not proof it runs on every CLI/app/IDE/cloud surface.

### Plugins, manifests and load order

Root Agent Plugins example:

~~~json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "forge",
  "version": "0.1.0",
  "description": "Composable Forge capabilities",
  "extensions": {"com.openai": {}}
}
~~~

Required schema/name; optional version, description, author{name,email,url}, homepage, repository, license, keywords, extensions. Names: maximum 64 characters; lowercase letters/digits/dots/hyphens, alphanumeric ends, no consecutive dots/hyphens. Unknown top-level fields are ignored. Fixed paths: skills/ and mcp.json. OpenAI extension metadata overrides legacy overlay presentation/onboarding/apps/hooks declarations. [external: code, [parser, L16–223](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/agent_plugin_manifest.rs#L16-L223)]

**Stable execution differs:** Agent Plugins skills use direct-child discovery; the host assigns empty hook sources and loads apps only for Legacy. Recognized root schemas shadow compatibility discovery; unsupported future Agent Plugins schema URIs can fail parsing without falling back. A nonregular/symlink root manifest returns no manifest at this boundary. [external: code, [loader](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/loader.rs#L841-L907), [selection](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/utils/plugins/src/plugin_namespace.rs#L11-L74)]

Legacy: .codex-plugin/plugin.json. Fields include name/version/description/keywords/interface/extensions; skills=path/string array; mcpServers=path/object; apps=path; hooks=path/path array/inline object/object array. Validated ./ paths. Defaults: skills/, .mcp.json, .app.json, hooks/hooks.json. Configured plugins load alphabetically by config key; skill roots sort/dedupe, Legacy traversal is recursive. [external: code, [legacy schema](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/manifest.rs#L38-L143), [load/defaults](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/loader.rs#L153-L185)]

Resolved components: skills, onboarding skill, MCP, apps, hooks; no agents component in the inspected model. Legacy commands are separately parsed, and discovery includes install-time .codex-plugin/migrated-command-skills. **P7 resolution:** plugin agents are unestablished; command-to-skill migration exists, while native arbitrary slash dispatch and exact migration rewrite semantics remain unverified. [external: code, [components](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/plugin/src/manifest.rs#L6-L35), [commands](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core-plugins/src/manifest.rs#L190-L205), [migration directory](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/utils/plugins/src/lib.rs#L38-L47)]

### Distribution, installation and updates

Docs list project/personal .agents/plugins/marketplace.json and legacy .claude-plugin marketplace compatibility. Public shared directory, workspace publication and repository marketplaces are different distribution contracts. Web installation does not deploy local hook scripts. Neither listing nor a shared filename proves every runtime component works. [external: docs, [packaging](https://developers.openai.com/plugins/build/plugins), [architecture](https://developers.openai.com/plugins/concepts/plugins), [runtime overview](https://learn.chatgpt.com/docs/plugins)]

Installed syntax checked:

~~~text
codex plugin marketplace add <SOURCE> --json
codex plugin marketplace add <OWNER/REPO> --ref <PINNED-REF> --json
codex plugin add <PLUGIN@MARKETPLACE> --json
codex plugin list
~~~

SOURCE accepts local marketplace, owner/repo[@ref], HTTPS/SSH Git; sparse paths are supported. Marketplace addition registers a source; plugin add installs. Upgrade/remove verbs exist, but their argument details were not checked. **(Proposed)** Pin Forge artifact/source, inspect native trust after updates and re-run conformance; no universal signing/review guarantee was established for local sources. [ran: command help; inferred: update design]

### Hooks: format, discovery and inputs

Hook wrapper:

~~~json
{
  "description": "Forge hook example",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node ./forge-hook.js",
            "commandWindows": "node .\\forge-hook.js",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
~~~

Illustrative fields/path, not a deployable Forge command. Wrapper rejects unknown fields. TOML [hooks] has event groups plus state. Command fields: command, commandWindows/command_windows, timeout seconds, async, statusMessage, additionalContextLimit. MCP fields: type=mcp_tool, server, tool, input object, timeout, statusMessage; input must be TOML-representable, so JSON null fails. Prompt/agent variants parse but are skipped. [external: code, [hook config](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/hook_config.rs#L144-L205)]

Load order: required managed → active config layers low-to-high, JSON then TOML within each → plugin. Both representations load with a warning. Global/project .codex/hooks.json and config.toml are carriers. Plugin commands get PLUGIN_ROOT/PLUGIN_DATA and CLAUDE_PLUGIN_ROOT/CLAUDE_PLUGIN_DATA aliases with variable substitution. **(Proposed)** Emit one active definition to avoid duplicates. [external: code, [discovery](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/discovery.rs#L86-L185)]

Input notation: **B**=session_id, transcript_path, cwd, hook_event_name; **T**=B+turn_id, model, permission_mode; **A?**=optional agent_id/agent_type outside subagents. Transcript/message paths can be JSON null. Input keys are snake_case.

| Event | Exact payload beyond notation | Matcher |
|---|---|---|
| PreToolUse | T+A?+tool_name,tool_input,tool_use_id | Tool/aliases |
| PermissionRequest | T+A?+tool_name,tool_input | Tool/aliases |
| PostToolUse | T+A?+tool_name,tool_input,tool_response,tool_use_id | Tool/aliases |
| PreCompact | B+turn_id,model,A?,trigger | Trigger |
| PostCompact | Same as PreCompact | Trigger |
| SessionStart | B+model,permission_mode,source | startup/resume/clear/compact/fork |
| SessionEnd | B+reason | Reason |
| UserPromptSubmit | T+A?+prompt | Ignored |
| SubagentStart | T+agent_id,agent_type | Agent type |
| SubagentStop | T+agent_id,agent_type,agent_transcript_path,stop_hook_active,last_assistant_message | Agent type |
| Stop | T+stop_hook_active,last_assistant_message | Ignored |
| Interrupt | T | Ignored |

Declared stable wire, not proof of every lifecycle firing. [external: code, [schemas](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/schema.rs#L255-L597), [matchers](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/common.rs#L103-L160), [start values](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/session_start.rs#L20-L73)]

### Hooks: outputs, timing, failure and trust

Outputs use camelCase and reject unknown fields. Universal declared fields are continue, stopReason, suppressOutput, systemMessage; acceptance is event-specific.

| Event | Effect/restriction established |
|---|---|
| PreToolUse | Deny needs nonempty reason; top-level block/reason also works. allow+updatedInput rewrites. allow alone, ask, approve, continue=false, stopReason, suppressOutput=true rejected. Additional context supported. |
| PermissionRequest | hookSpecificOutput.decision has behavior=allow/deny, optional message. Deny dominates. Input/permission rewrites and interrupt=true unsupported. Invalid/no decision leaves normal permission handling. |
| PostToolUse | Declares block/reason/additional context; updatedMCPToolOutput and suppressOutput=true rejected. No rollback established. |
| SessionStart/SubagentStart | Additional context/universal fields parse. |
| UserPromptSubmit | Nonempty reason for block; additional context; reducer can stop prompt processing. |
| Stop/SubagentStop | Nonempty reason for block; use stop_hook_active to avoid loops. |
| PreCompact/PostCompact | Universal-only schema; local compaction checks stop outcomes. |
| Interrupt | systemMessage only; cannot prevent interruption/restart. |
| SessionEnd | No command output schema; cleanup/observation. |

Evidence: [external: code, [parser](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/output_parser.rs#L343-L474), [prompt reducer](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/user_prompt_submit.rs#L126-L219), [permission reducer](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/permission_request.rs#L80-L156), [compact](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/compact.rs#L170-L208); docs, [Interrupt](https://learn.chatgpt.com/docs/hooks)]

Pre-tool JSON parses on exit 0. Valid synchronous denial, or exit 2 with nonempty stderr, blocks. Spawn/timeout errors, invalid/unsupported JSON, exit 2 without reason and other exits can mark Failed while leaving should_block=false. Competing rewrites follow completion order. **(Proposed)** Expected Forge read/validation failures should return valid denial; process death/harness timeout remains a gap. [external: code, [reducer, L137–154 and L179–291](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/events/pre_tool_use.rs#L179-L291); inferred: boundary]

Sync handlers run concurrently, then reports sort. Async commands have no control effects. Ordinary timeout: 600 seconds, minimum 1. SessionEnd forces async sync, rejects MCP, and shares Interrupt's 1-second default/3-second cap. Context can spill above approximately 2,500 tokens; limit=0 disables spilling. [external: code, [dispatcher](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/dispatcher.rs#L108-L177), [defaults](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/mod.rs#L130-L145), [normalization](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/discovery.rs#L475-L624)]

Stdin JSON; request cwd; captured environment plus overrides. Windows defaults COMSPEC/cmd.exe /C; Unix SHELL or /bin/sh -lc. Windows uses CREATE_NO_WINDOW/Job Object. Deadline covers stdin/output; failures/timeouts kill descendants, successful hooks can preserve detached helpers; shutdown aborts async work. **(Proposed)** Explicit commandWindows and bounded Node I/O avoid assuming terminal PowerShell quoting. [external: code, [runner](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/command_runner.rs#L199-L432)]

Trust: hooks.state.<key>.enabled/trusted_hash; keys identify source/event/group/handler and plugin-relative source. Managed/builtin definitions admitted; otherwise enabled+Trusted required. Missing hash=Untrusted, mismatch=Modified. Hash covers normalized matcher/declaration/handler, **not invoked script bytes**. Required managed load errors abort runtime creation. [external: code, [discovery](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/engine/discovery.rs#L682-L775), [declarations](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/declarations.rs#L10-L33), [registry](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/hooks/src/registry.rs#L65-L85)]

App Server has hooks/list and generic config/value/write/config/batchWrite. Dedicated trust mutation/support for generic trust writes was not established. **(Proposed)** Bootstrap through ordinary /hooks, then verify Trusted. Never invent trust hashes or bypass review. [external: code, [methods](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/common.rs#L845-L849), [config types](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/v2/config.rs#L995-L1014)]

**P7 format resolution: subset only.** Claude supports HTTP/prompt/agent, direct args, shell, asyncRewake/conditional fields, more decisions/output replacement and different nonzero-exit JSON/termination timeouts. Codex has narrower effective contracts. **(Proposed)** Share only a narrow command wrapper; generate/test distinct event/output adapters. [external: docs, [Claude official reference](https://code.claude.com/docs/en/hooks); code, [Codex fields](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/hook_config.rs#L144-L205)]

### Skills, commands and custom agents

SKILL.md has YAML name/description plus procedure/resources. Explicit $skill-name or implicit selection. agents/openai.yaml: interface display_name/short_description/icons/brand_color/default_prompt; policy.allow_implicit_invocation; dependencies.tools[] type/value/description/transport/url. [[skills.config]] disables by path. Symlinks followed; duplicate names retained. [external: docs, [build skills](https://learn.chatgpt.com/docs/build-skills)]

Roots: repo/user .agents/skills; plugin/extra; project .codex/skills; deprecated CODEX_HOME/skills; system/admin. Built-ins still install at CODEX_HOME/skills/.system with fingerprint. Resolver scans all config layers high-to-low, including disabled layers, then adds/deduplicates roots. This proves enumeration, **not untrusted skill injection/execution**. [external: code, [roots](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/ext/skills/src/host_roots.rs#L51-L169), [cache](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/skills/src/lib.rs#L58-L94), [all-layer API](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/state.rs#L528-L534)]

Custom prompts are deprecated: top-level CODEX_HOME/prompts/*.md, explicit /prompts:<name>, description/argument-hint, positional/named arguments/literal-dollar escaping, restart/new-chat requirement. Native slash handlers are a Rust enum. **(Proposed)** Distribute Forge procedures as skills, not local prompt files or migration-dependent commands. [external: docs, [prompts](https://learn.chatgpt.com/docs/custom-prompts); code, [slash registry](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/tui/src/slash_command.rs#L10-L84)]

Custom-agent TOML: ~/.codex/agents/*.toml or project .codex/agents/*.toml; required name, description, developer_instructions. Normal config can specify model/effort/sandbox/MCP/skills. Custom names override built-ins, independently of filename. Spawn/default/parent model values resolve, then file overrides; parent **live sandbox/approval overrides reapply**. Controls include enabled, max_concurrent_threads_per_session (max_threads alias), default_subagent_model/effort, interrupt_message. **[inferred]** Reviewer read-only TOML alone does not establish effective read-only execution. [external: docs, [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)]

### Instructions and execution rules

AGENTS docs: CODEX_HOME override or AGENTS, then one nonempty file per directory root-to-cwd, override → AGENTS → fallback order. Deeper guidance appended; default project cap 32 KiB, configurable max/fallback names. Without project root, cwd only. [external: docs, [guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md)]

**Main-only Rust read:** explicitly untrusted project returns host instructions immediately; other environments share a byte budget and sandbox-aware reads. Missing files skipped, other sandboxed errors can propagate. Root-to-cwd discovery excludes project config from root-marker selection. This fulfills source inspection but does not prove stable runtime/reload behavior. [external: code, [main implementation](https://github.com/openai/codex/blob/main/codex-rs/core/src/agents_md.rs#L53-L107)]

.rules uses prefix_rule(pattern,decision,justification,match,not_match), forbidden > prompt > allow. Allow can permit outside-sandbox execution. Active-layer startup loading; project trust required. Simple linear chains can split; complex syntax can stay wrapper-level. **(Proposed)** Use native restrictions where appropriate, alongside Forge path/issue authority. [external: docs, [rules](https://learn.chatgpt.com/docs/agent-configuration/rules); code, [active loading](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/core/src/exec_policy.rs#L636-L666)]

### MCP, tools and permissions

Stdio command/args/env/env_vars/cwd; Streamable HTTP url/bearer_token_env_var/http_headers/env_http_headers/http_headers_helper. Mixed transport/literal bearer_token rejected. OAuth plus hosted/enterprise auth options. Exposure: enabled_tools, disabled_tools, omit_tools_from; per-server/tool approval and output budgets; startup/tool timeouts. Input-schema budget default 5,000 bytes, parallel safety default false. required+startup_readiness=connection is suitable for proof; catalog may use cached metadata. [external: code, [MCP schema](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/mcp_types.rs#L146-L285)]

Plugin owns transport; host overlays govern enablement/auth/tools, excluding transport replacement. **(Proposed)** Narrow local stdio authority; explicit remote scopes/auth; serialize dependent writes. Authentication still needs runtime proof. [external: code, [policy boundary](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/types.rs#L928-L937); inferred: design]

App Server's experimental dynamicTools persist with thread metadata and call clients through item/tool/call. Responses naming/schema constraints and reserved names apply. Native MCP direct calls/elicitation/approvals exist. These are host APIs, **not a plugin JS registry**. [external: docs, [App Server](https://learn.chatgpt.com/docs/app-server); code, [dynamic field](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/v2/thread.rs#L137-L142), [dispatch](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/common.rs#L1705-L1726)]

default_permissions selects native/named [permissions.<name>] with description, extends, workspace_roots, filesystem, network. Undefined parents/cycles fail. File grants/network domain/socket/proxy controls are typed. Legacy read-only/workspace-write/danger-full-access CLI modes remain. Windows elevated/unelevated/MXC are distinct selectors, not proved equivalent isolation. [external: code, [permission schema](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/permissions_toml.rs#L19-L133), [selectors](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/types.rs#L150-L162); ran: help]

**[inferred]** Approval, OS isolation, project trust, hook trust, plugin installation and MCP authentication are separate controls. A trusted declaration does not authenticate a server or grant file access.

### Exec, JSON, SDK and RPC

Exec: stdin prompts; JSONL; output schema/last message; resume/fork/review; ephemeral; strict config; profile/model/provider/scoped roots. Events: thread.started, turn.started/completed/failed, item.started/updated/completed, error; MCP/collaboration tool items. Parse actual terminal/tool evidence, not assistant claims. [ran: help; external: code, [CLI](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/exec/src/cli.rs), [events](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/exec/src/exec_events.rs#L6-L34)]

App Server: default stdio JSONL, bidirectional headerless JSON-RPC-style messages. One initialize, initialized acknowledgement, start/resume thread, then start/steer/interrupt turns. Typed hook/started/completed, auth/approvals/history/plugins/skills/config/MCP. Experimental fields require capability opt-in. Generate version-specific schemas/bindings. Docs call it experimental/unsupported for production; remote WebSockets need auth/TLS. [external: docs, [server](https://learn.chatgpt.com/docs/app-server); code, [notifications](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/common.rs#L1859-L1870), [hook fields](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/v2/hook.rs#L96-L148)]

Codex SDK: TypeScript local threads and stable Python openai-codex using App Server/pinned CLI. Agents SDK is application-owned orchestration; Agents API is managed Codex orchestration; exec-server can provide a self-hosted executor. **(Proposed)** Local proof/worker control and managed execution are separate integration scopes. [external: docs, [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk), [comparison](https://developers.openai.com/api/docs/guides/agents), [managed architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture)]

### TUI, output styles and app/IDE UI

/statusline selects ordered field IDs through tui.status_line; themes/status/config/agents/hooks are native slash controls. No arbitrary plugin renderer/widget API was established by these schemas. Output schema/developer instructions are available controls. friendly/pragmatic personality settings are inert in current release evidence. [external: code, [status fields](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/types.rs#L810-L820), [native registry](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/tui/src/slash_command.rs#L10-L84); [release](https://github.com/openai/codex/releases/tag/rust-v0.156.0)]

Optional plugin UI includes global/thread/file entrypoints, panels/settings/viewers/forms/mentions. Metadata: ui.resourceUri, openai/ui entrypoints; codex://plugins desktop links; opaque file resources with writable capability and ETag/ifMatch. Client-specific MCP/UI is not proof of an IDE webview-extension API. [external: docs, [extensions](https://developers.openai.com/plugins/build/extensions); spec, [MCP UI](https://github.com/openai/mcp-extensions/blob/main/docs/spec.md)]

CLI/SDK/App Server are open; official table says IDE/cloud are not. Desktop frontend internals were not inspected, so docs-only. IDE has separate chatgpt.* settings; replacing bundled CLI can break features. **(Proposed)** Optional Forge UI consumes public tools/state and remains separate from core. [external: docs, [open components](https://learn.chatgpt.com/docs/open-source), [IDE settings](https://learn.chatgpt.com/docs/developer-settings)]

## 3. What Forge can leverage, ranked

All rows **(proposed)**; benefits inferred from the referenced carriers.

| Rank | Carrier | Forge capability / benefit |
|---|---|---|
| 1 | Skills + narrow MCP | Reference workflow, Kernel/recap/gates/memory; reusable procedures/tools without replacing Codex. §2 skills/MCP. |
| 2 | SessionStart + synchronous PreToolUse | Fresh orientation and explicit gate feedback; legacy bundle/trust/failure limits. §2 hooks. |
| 3 | JSONL + typed RPC events | Conformance receipts from installed behavior instead of metadata parity. §2 exec/RPC. |
| 4 | Native config/permissions/rules | Additive setup and native restrictions where predicates fit. §1 config/§2 rules. |
| 5 | Optional agent TOML | Reviewer procedures with Codex-owned child loops; effective-policy proof. §2 agents. |
| 6 | Shared directory | ChatGPT/Codex exposure, with separate client capability claims. §2 distribution. |
| 7 | Optional MCP UI | Read-only issue/lease/receipt visualization through public APIs. §2 UI. |
| 8 | Agents API | Optional managed workers with Forge-owned authority through tools. §2 SDK/RPC. |

**[inferred]** No new loop, memory-file format or UI in Forge core. This follows supplied north-star one-package/unopinionated/native-connectivity constraints. [read: north-star.md Definition/Constraints]

## 4. Limits, gotchas and recent changes

| Finding | Practical limit |
|---|---|
| Parsed manifest ≠ loaded component | Standard root hooks/apps omitted; prove runtime discovery. [external: §2 plugin loader] |
| Root shadows legacy | Separate bundle roots. [external: §2 selection] |
| Hooks fail open on several failures | Expected errors can deny; process failure still needs outside authority. [external: §2 reducer] |
| Trust hash omits script bytes | Separate artifact integrity. [external: §2 discovery] |
| Concurrent handlers/rewrites | Avoid dependencies/conflicts across handlers. [external: §2 dispatcher] |
| Narrow PermissionRequest/PostToolUse | No Claude permission/output rewriting assumptions; no rollback. [external: §2 parser] |
| Disabled-layer skill roots | Enumeration/injection/trust need distinct tests. [external: §2 roots] |
| Parent policy supersedes agent file | Inspect child effective policy. [external: §2 agents] |
| Cached catalog readiness | Require live connection/nonce. [external: §2 MCP] |
| disabledPluginIds not filtering | Not an allowlist authority. [external: §1 thread types] |
| Main/docs/schema can lead stable | Pin runtime/generated types; label fallbacks. [external: [schema note](https://learn.chatgpt.com/docs/hooks)] |

Selected April–September compatibility inventory, not an exhaustive release audit:

- Separate named profile files since 0.134.0; legacy selected forms reject. [external: [advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced)]
- July 21 UI metadata deprecates openai/visibility for ui.visibility. [external: [plugin changelog](https://developers.openai.com/plugins/changelog)]
- August 24 deprecated codex mcp-server; September 5 removed it and codex-mcp-server. External MCP clients remain; host integrations migrate to App Server. [external: [changelog](https://learn.chatgpt.com/docs/changelog), [migration](https://learn.chatgpt.com/docs/mcp-server)]
- September 29/0.159.0 removes bundled plugin-creator and tui.prompt_suggestions. Packaging docs still recommend plugin-creator: version/docs contradiction. [external: [release](https://github.com/openai/codex/releases/tag/rust-v0.159.0), [packaging](https://developers.openai.com/plugins/build/plugins)]
- Model retirements differ by ChatGPT/API auth; avoid permanent preview-model proof dependencies. [external: [product changelog](https://learn.chatgpt.com/docs/changelog); inferred: proof]

Windows: 0.156.0 fixes offline inbound isolation; 0.158.0 addresses Windows 10 paths/credentials/large policies; 0.159.0 has console/fallback fixes; September 29 backport for 0.159.2 addresses console windows. These are upstream evidence, **not proof this machine/every spawn path is fixed**. [external: [0.156.0](https://github.com/openai/codex/releases/tag/rust-v0.156.0), [0.158.0](https://github.com/openai/codex/releases/tag/rust-v0.158.0), [0.159.0](https://github.com/openai/codex/releases/tag/rust-v0.159.0), [backport](https://github.com/openai/codex/pull/49385)]

DevDay September 29 announced managed Codex orchestration with subagents/compaction/tool-search/computer use and richer plugin UI/CLI interactions. Current docs prove a shared directory, but the recap does not date its first launch. Recap and detailed UI docs differ on Free/Go web rollout: availability needs account/client proof. [external: [recap](https://openai.com/index/devday-2026-recap/), [architecture](https://developers.openai.com/plugins/concepts/plugins), [rollout](https://developers.openai.com/plugins/build/extensions)]

Unretrieved: stable AGENTS/scheduler, migration body, post-tool/stop reducers and portions of dynamic-tool types. Surrounding schemas/docs are identified above. Cache misses/refusals never count as absence evidence. Default-enabled hook feature behavior was not independently source-traced; proof enables it explicitly.

## 5. L2 installed-version proof recipe

**(Proposed, not run.)** Requires generated Forge artifact, disposable fixture authority store, proposed Forge MCP and reviewed native hook trust. Names below are future fixture contracts, not existing test scripts.

### Pin, install and trust the actual artifact

Run from a disposable Windows CI tools directory, with CODEX_HOME already set to a job-owned directory:

~~~powershell
npm install --ignore-scripts --save-exact @openai/codex@0.159.3
$codexExe = Join-Path (Get-Location) 'node_modules/.bin/codex.cmd'
& $codexExe --version
& $codexExe plugin marketplace add $marketplaceDir --json
& $codexExe plugin add 'forge@forge-ci' --json
& $codexExe app-server generate-json-schema --out $schemaDir
& $codexExe app-server generate-ts --out $bindingsDir
~~~

Fixture marketplace name=forge-ci, installing the packaged **legacy** bundle. Record Forge/Codex versions, source/artifact hashes, OS/shell and native identity. Supply auth through supported CI mechanisms without logging credentials. Command syntax was checked; installation was not run. [ran: help; external: [schema generation](https://learn.chatgpt.com/docs/app-server)]

Run ordinary codex /hooks to review/trust exact installed definitions, then verify enabled+Trusted through hooks/list. Copied reviewed state must match actual current keys/hashes; Untrusted/Modified means not certified. Fully automatic supported trust mutation remains unknown. Never invent hashes or use bypass flags.

Host policy must require the **resolved plugin MCP identity**, startup_readiness=connection, narrow tools/timeouts. Derive identity from inventory; do not assume server name forge or register a second direct server that could hide plugin failure. [inferred: isolation; external: [transport/policy boundary](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/config/src/types.rs#L928-L937)]

### Discovery and independent observations

~~~powershell
& $codexExe app-server --stdio --strict-config
~~~

Driver continuously reads/correlates IDs, rejects errors and bounds waits. Send initialize, wait for success, then initialized. Generated 0.159.3 schemas validate skills/list, plugin/read, hooks/list and MCP inventory parameters/results. [external: [protocol](https://learn.chatgpt.com/docs/app-server), [registry](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/common.rs#L835-L849)]

Assertions:

1. Expected skills have installed plugin paths/content digests, not global/project fallback copies.
2. Plugin enabled at pinned identity/version; one intended handler per event.
3. SessionStart/PreToolUse enabled+Trusted; denial handler synchronous.
4. Plugin MCP actually connected; fixture-only forge_proof returns a fresh post-start nonce independently confirmed in server log.
5. Root-format control exposes the known missing-hook distinction, never masquerading as full support.
6. Untrusted, duplicate-name and symlink fixtures report actual discovery/injection separately.

### Headless model run

Fixture-only forge-proof skill requests live tool use and allowed/denied writes:

~~~powershell
$proofNonce = [guid]::NewGuid().ToString()
$proofPrompt = 'Use $forge-proof. Call the Forge proof tool with nonce ' + $proofNonce + '. Create allowed-control.txt. Attempt blocked-target.txt once through the intended tool. Report outcomes without retrying the denied action through another tool.'
& $codexExe exec --strict-config --json --color never --enable hooks -c 'approval_policy="never"' -s workspace-write -C $fixtureDir -o $finalOutput $proofPrompt > $eventsOutput
if ($LASTEXITCODE -ne 0) { throw 'Codex proof process failed' }
~~~

Initially allow both probe paths in the sandbox. Positive control must write allowed-control.txt; otherwise denied-target absence could be sandbox failure. Hook classifies actual input. Add a separate MCP-write probe for Forge server-side authority. [inferred: causal design]

Parse JSONL: require thread.started, turn.started, terminal turn.completed, no turn.failed/error, actual completed MCP call with correct nonce/server. Verify server log, allowed contents, protected target unchanged/absent, attempted tool and denial reason. If model declines, invents output or changes path, fail/inconclusive—never pass. [inferred: assertions; external: [event types](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/exec/src/exec_events.rs)]

Separate App Server turn correlates hook/started/completed to thread/turn/tool, plugin source, run mode/status/output. Prove SessionStart injected a fresh fixture Kernel recap and PreToolUse delivered valid denial. Generated schemas drive the future driver; it does not exist yet. [external: [hook notifications](https://github.com/openai/codex/blob/rust-v0.159.3/codex-rs/app-server-protocol/src/protocol/v2/hook.rs#L96-L148); inferred: composition]

### Negative controls and receipts

Test missing/dead MCP versus cached metadata; Untrusted/Modified hooks; invalid JSON/timeout/crash/empty versus nonempty exit-2 reason; script tampering with unchanged declaration; conflicting rewrites/parallel authority reads; child policy under parent override; trust/instruction cases and root shadowing.

Static native check:

~~~text
codex execpolicy check --rules <fixture.rules> --pretty -- <argv...>
~~~

Assert forbidden/prompt/allow/wrapper decisions. No sandbox/approval/hook-trust bypass, ignored rules or weakened gate. [external: [rules check](https://learn.chatgpt.com/docs/agent-configuration/rules); inferred: conformance]

Retain artifact/version hashes, resolved policy/trust/inventory, JSONL/RPC, fixture logs, probe contents, exit/elapsed/cleanup. L2 requires all named capabilities/control outcomes. Client UI additionally needs permitted operator evidence.

## 6. Best-possible Forge integration

**Entire section proposed.** Codex retains loop/model/context/session/approval/UI; Forge supplies composable procedures/tools/authority.

| Surface | Native design/install/update | Worker-days / risk |
|---|---|---|
| Packaging | One npm package, separate local legacy/portable roots, catalog-derived emitters; root manifest never shadows local hooks. | 1–2 / medium |
| Skills | Canonical project .agents/skills; package skills for other repos; avoid duplicates, prove provenance. | 0.5–1 / low |
| MCP | Thin proposed forge mcp over public Kernel/recap/gates/memory; narrow scopes; writes verify authority. | 2–4 shared / medium |
| Hooks | Bounded Node/commandWindows adapter; fresh recap and sync denial; expected errors valid deny; external authority remains. | 1–2 / medium-high |
| Config/trust | Additive settings, normal /hooks, separate content digest; explicit update/recheck. | 0.5–1 / medium |
| Reviewers | Optional native TOML projection, ownership/cleanup, effective-policy proof. | 0.5–1 / medium |
| Proof | Linux/Windows pinned artifact install, causal/failure probes, full terminal receipts. | 2–4 / high until pilot |
| Directory | Portable skills/remote MCP after proof; no universal local-hook promise. | 0.5–1 + review wait / medium |
| UI | Optional read-only issue/lease/receipt MCP view; no CLI/IDE patch. | 2–4 extra / client-dependent |
| Agents API | Separate opt-in managed solution, Forge authority/tools, optional self-hosted executor. | 3–6 extra / high |

Estimates **inferred, not measured**: local slice approximately 6–11 worker-days with existing shared MCP, plus 2–4 if facade must be built. P7's 2–3 days omits format divergence/trust/negative controls/Windows proof. Parallelism reduces elapsed time, not effort.

Order: pilot two real bundles and proof → shared skills/MCP/orientation → optional reviewers → promotion on evidence. Directory/UI/managed execution follow demand and their own proof. Do not create a second Forge package, custom loop or general generator framework before fixtures work. [inferred: smallest adequate implementation]

Update: install pinned new artifact, verify integrity/native trust, repeat L2; retain previous package/config snapshot for rollback. No silent permission broadening. [inferred: reversible release]

## 7. Keeping current

Watch [CLI releases](https://github.com/openai/codex/releases), [product changelog](https://learn.chatgpt.com/docs/changelog), [plugin changelog](https://developers.openai.com/plugins/changelog), Agent Plugins schema and [UI spec](https://github.com/openai/mcp-extensions/blob/main/docs/spec.md). releases.atom retrieval failed; operational feed remains unverified.

Observed sample: 0.156.0 September 22 → 0.158.0 September 28 → 0.159.0 September 29 → 0.159.3 September 30: days-scale changes in this sample, no promised schedule. [external: §4 releases and [latest](https://github.com/openai/codex/releases/tag/rust-v0.159.3)]

Revalidate on manifest/components, hook payload/reducer/trust hash, skill roots, profiles, permission/MCP/auth, SDK/RPC, model retirement, Windows spawning/sandbox and UI changes. **(Proposed)** Diff pinned generated schemas/inventory, inspect candidate source, run L2 before support promotion; keep main exploration separate.

## Bottom line

1. Compose through native skills/MCP; leave execution/state with Codex. [inferred: §§1–3]
2. Legacy local bundle carries hooks on 0.159.3. [external: §2]
3. Portable root manifest belongs in a separate root. [external/inferred: §§2/6]
4. Plugin agents remain unestablished; optional TOML needs proof. [external: §2]
5. Prefer skills over command migration. [external/inferred: §2]
6. Generate distinct Codex/Claude adapters. [external/inferred: §2]
7. Keep authority outside hook failure semantics. [external/inferred: §2]
8. Require live nonce/orientation/causal denial evidence. [inferred: §5]
9. Directory/UI/managed execution each need their own proof. [inferred: §6]
10. Promote after L2, not after this dossier. [ran: help only; inferred: §5]

## Corrections to P7

Target: platform/P7-harness-plugins.md §1.3/§2.2, ideal plugin/generator and Confidence; **proposed corrections, P7 not edited**.

1. Root Agent Plugins hooks/apps parse but stable host omits them; local executable-hook bundle needs legacy discovery.
2. Add root shadowing and unsupported-future-schema failure; do not combine recognized root/legacy manifests in that bundle.
3. Legacy command-to-skill migration exists; exact rewrite/native command dispatch remains unverified.
4. Plugin agent loading lacks a component in inspected model/loader; separate native TOML proof.
5. Shared hook wrapper is a subset, with different handler/effect/exit/timeout semantics.
6. Qualify denial: execution failure is not automatic block; post-tool feedback does not undo effects.
7. Add ordinary trust and declaration-hash versus executable-content integrity; no proved headless trust mutation.
8. CODEX_HOME/skills is deprecated **supported**; built-in .system cache remains.
9. Add separate profile files, project-forbidden host settings, managed requirements and distinct trust surfaces.
10. Add MCP policy/exposure/parallel and connection-versus-catalog readiness.
11. Reviewer read-only file is not unconditional; parent live overrides reapply.
12. Shared directory/Agents API/MCP UI are separate contracts, not universal local execution.
13. Remove reliance on bundled plugin-creator/old codex mcp-server; record docs/version contradictions.
14. Arbitrary TUI/IDE extension APIs unestablished by status fields/MCP UI.
15. Revise effort after manifest/trust/failure/Windows pilot; estimates remain inferred.

Evidence appears in corresponding sections.

## Open questions for the owner

**Packaging:** A — separate local legacy/portable bundles in one Forge package; B — portable skills/MCP only, no local hook claims; C — wait for root-format hook support. **Default A.** Native local capabilities without root-shadowing. [inferred: §§2/6]

**Proof bootstrap:** A — normal /hooks plus verified matching trust; B — prove supported headless trust mutation first; C — certify skills/MCP only for now. **Default A**, with B as separate work for fresh-home unattended CI. No bypass choice. [inferred: §§2/5]

**Exposure:** A — prove local, then directory; B — A plus optional receipt UI; C — A plus managed API workers. **Default A.** Extra client/authority work need not gate initial native proof. [inferred: §6]

Silence preserves research defaults; it does not authorize implementation/publication/deployment beyond the assigned dossier phase.

## Confidence

**High** on inspected stable manifests/config/hooks/MCP and exact DevDay sources. **Medium overall:** AGENTS/scheduler fallback is main-only; migration/reducer gaps and UI rollout conflicts remain. **No plugin L2, live IDE/app/UI or machine-local flashing proof**. CLI version/help ran; dossier readback is a separate artifact check.

Time buckets: orientation—brief/P7/skills/help; research—official docs/Rust; edit—this one dossier; verification—file/identifiers/sections; rework—failed source retrieval and one pre-write quoting error; waiting—tool latency. Biggest avoidable waste: failed shell networking/cache-miss retrieval, not implementation/test reruns.

