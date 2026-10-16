# Hermes Agent: deep dive for the Forge final plan

Decisions needed: native integration packaging, certification baseline, and gateway/cron timing. Recommended defaults are in “Open questions for the owner”. This is research and a proposed design, not implementation authorization.

## Bottom line

1. The official project is NousResearch/hermes-agent; the latest release is 0.21.5 (v2026.9.24), while this source audit pins later main at 233434b414476e5f1ed0f6836922128e74d7d2f4. [external, 2026-10-01: [Release], [Source pin]]
2. Hermes already loads native Python plugin.yaml packages AND a portable plugin.json subset; a proper Forge plugin is feasible without publishing a second Forge package. [external: [Manifest], [Portable], [Loader]; inferred packaging]
3. The current native contract has 41 lifecycle hooks, four middleware kinds, bounded system-prompt sections, leased registrations, and provider extension points; P7’s “27 events” inventory is stale. [external: [Plugin API], [Middleware]]
4. Project .agents/skills works only after project trust AND content scanning; trusted project skills can override global names, and registered plugin skills are absent from the ordinary prompt index. [external: [Skills trust], [Plugin API]]
5. Python lifecycle hooks, config shell hooks, and gateway HOOK.yaml handlers have different payloads, consent, deadlines, and return semantics; they are not interchangeable. [external: [Hook dispatch], [Shell hooks], [Gateway hooks]]
6. Forge currently has a Hermes descriptor, skills projection, CLI orientation, capability probes, and opt-in global shell-hook installation; these are not a native Hermes package. [read: lib inventory in §2.10]
7. Forge’s tool_input/block wire matches current Hermes; an isolated adapter check passed, but emitted shell hooks omit fail_closed and no installed Hermes gate proof was run. [ran: §5; read: lib/hook-renderer.js:440-450; external: [Shell hooks]]
8. MCP, gateway channels, cron, delegation, HTTP/SSE runs, ACP, and JSONL CLI output are real native surfaces; keep their execution native and keep Forge Kernel authority outside them. [external: [MCP transport], [Cron tick], [Delegation], [Programmatic]; inferred integration]
9. Use ordinary chat -q/--query-file with --format stream-json for proof; top-level oneshot enables YOLO and hook auto-acceptance, and safe-mode disables the plugin being tested. [external: [CLI parser], [Single query], [One shot]]
10. Ship a small opt-in Python shim inside the one npm artifact, with installed-version proof before a “supported” claim; stage messaging, scheduling, and UI as optional compositions. [inferred/proposed: §§3,5,6]

## Request, scope, and evidence

Identifiers are preserved exactly:

~~~json
{
  "protocolVersion": "1.0",
  "requestId": "forge-deep-hermes-20261001",
  "contextDigest": "1e2834af1a17188864e5b6be801473e97e0a8829e37cc59bec6ebb5ad2c0f156",
  "context": {"summary": "Forge harness deep dive: Hermes Agent."},
  "flowSpec": null,
  "cwd": ".",
  "policy": {"write": true, "tools": [], "maxCostUsd": null},
  "route": {"model": "gpt-6.1-sol", "thinking": "xhigh", "search": true}
}
~~~

The route is recorded request metadata, not a self-reported model identity. Output is this one dossier. Read inputs: (local scratch), common.md, docs/work/2026-09-30-forge-final-plan/north-star.md, and platform/P7-harness-plugins.md, especially lines 151-163. The owner’s platform definition governs: one npm package; reusable APIs/config; complement native harnesses; reference workflow optional; Kernel owns durable issue/workflow authority. [read: those inputs]

All external links in this dossier were retrieved on **2026-10-01**. Unless explicitly labeled docs or release notes, citations refer to actual official source at the pinned full commit above. Direct source/document inspection is evidence rung 2; [inferred] is interpretation; [proposed] is future work; [ran] names an executed check. Source inspection does not prove installed behavior. The stable release and later main are separate baselines; features read on main are not silently attributed to the release tag.

The official GitHub repository and documentation site were verified. The release API reported v2026.9.24, published 2026-09-24T10:09:38Z. The main commit API reported the source pin with committer time 2026-10-01T10:25:47Z. Official source was read through the GitHub connector and web retrieval. The allowed shallow clone into (local scratch) failed with filesystem permission denial; shell HTTP failed with WinError 10061. Neither produced a source checkout. No context-mode tools, browser, commits, pushes, GitHub writes, or Kernel mutations were used. Three read-only specialist lanes returned source evidence; the lead integrated it. [ran: retrieval and failed clone/HTTP results; external: [Release], [Source pin]]

### Evidence boundary

The dossier covers each named subsystem and each extension family found in the inspected registries, manifests, and docs. The hook table distinguishes source allow-list/dispatch from the official payload catalog; payload kwargs are additive and some session exits are surface-specific. It is not a promise that every caller supplies every optional field. HTTP run internals and OAuth-manager internals were not exhaustively traced; their advertised endpoint/auth contracts remain documentation-level evidence where stated. No installed Hermes, real provider, live channel, cron delivery, or UI test ran.

## 1. Architecture

### 1.1 Agent loop, effects, concurrency, and stopping

The public embedding entry is run_agent.AIAgent. Current implementation is modular: agent initialization, conversation loop, request/context phases, tool-round execution, persistence, and compression live under agent/. Per turn, conversation_loop builds context and resets turn-local state. The generic loop is bounded by API-call count and any supplied shared iteration budget, with an explicit grace-call branch. Its phases are begin → prepare → request assembly → preflight → retrying provider call → normalization → tool round or final response. Phase verdicts can return, break, or continue. Finalization marks a compression-timeout exhausted turn partial. A configured Codex app-server route can handle the turn through that native path before generic fallback; Forge should not assume every provider follows identical internal request mechanics. [external: [Agent loop]:1576-1692; [Agent initialization]:2376-2505]

Tool rounds preserve original call order. They validate calls, deduplicate, cap delegation calls, and retain invalid calls so matching error results can be produced. The assistant tool-call row is flushed before side effects; canonical append failure stops dispatch. Execution/result persistence precede guardrail handling and post-tool compression. This is stronger than “the model said it ran a tool”, but a persisted intent still is not successful external delivery. [external: [Tool round]:46-209; inferred evidence distinction]

The executor caps per-batch concurrent workers at eight and by batch size; image generation can have a lower cap. Mixed batches become ordered parallel/sequential segments with barriers, and concurrent results append in original request order. Ordinary concurrent timeout defaults to 420 seconds; delegation is exempt from the generic sequential timeout because children have their own progress/timeout handling. Do not parallelize arbitrary Forge mutations merely because Hermes supports parallel tools: Kernel writes, leases, and exact-head operations retain their own transaction semantics. [external: [Tool execution]:129-136,239-246,847-855,1552-1555,1898-1903; inferred Forge constraint]

### 1.2 Prompt construction, instructions, memory, and compaction

The system prompt is built in tiers: stable identity/guidance/pinned skills/coding brief; caller system text/project context/workspace material; then volatile skill index, builtin MEMORY, USER, external memory, plugin after-memory sections, profile, timestamp, and runtime environment. It is rendered for the session and rebuilt at compression boundaries, rather than re-reading every project file on every model call. A Forge orientation section must be small and session-scoped; rapidly changing issue state needs explicit recap/tool reads. [external: [System prompt]:713-809; inferred]

Project policy chooses **one dialect**: .hermes.md/HERMES.md walking to Git root; otherwise the AGENTS chain; otherwise cwd CLAUDE.md; otherwise cwd .cursorrules plus .cursor/rules/*.mdc. SOUL.md is independent unless skipped. Inside the AGENTS dialect, inheritance is root → cwd, choosing first nonempty AGENTS.override.md, AGENTS.md, then agents.md at each directory. P7’s flattened “first file wins” list misses this inheritance. Default context-file allowance is dynamic: floor 20,000 chars, approximately 6% of model context using estimated chars/token, ceiling 500,000; explicit context_file_max_chars wins. Head/tail truncation defaults are 70%/20%. [external: [Prompt builder]:1137-1158,1675-1831]

Builtin MEMORY.md and USER.md defaults are 2,200 and 1,375 chars, configurable independently. Load freezes the prompt snapshot while tools operate on live persisted lists. Threat-scanned entries can remain on disk for user removal while being excluded from the prompt. Oversized manual edits warn rather than silently truncate; additions are blocked until capacity is repaired. Three failed consolidation attempts in a turn terminate further retries. The model guidance favors skills for procedures/task facts and small declarative memory for facts useful across sessions. [external: [Memory tool]:47-61,271-294; [Memory store]:90-164; [Prompt builder]:192-230]

Builtin memory occupies slot zero; at most one external provider is admitted. Provider failures are isolated, reserved builtin tool names win, and schemas are loaded before registry mutation. External prompt material is included only when its tools are exposed; prefetch is bounded and oversized results spill rather than inflate the prompt. A Forge recall integration should therefore use a tool or bounded prompt section by default, not displace a user’s Honcho/Mem0/etc. backend. register_memory_provider alone records an inert provider; activation belongs to the memory loader via memory.provider. [external: [Memory manager]:337-504; [System prompt]:516-541; [Plugin API]:754-763; inferred]

Compaction is a persistence boundary. Required v2 memory checkpoints can block compression; best-effort providers cannot. Compression uses a lease and a commit fence, validates the candidate, restores the original transcript on cancellation/failure, preserves the final assistant/user structure, rebuilds the system prompt, commits, then rotates bookkeeping before releasing the old session lock. Native Codex compaction cannot claim the same Hermes checkpoint boundary. Preflight defaults to three passes; a held lock defers, no progress blocks, and less than 5% final reduction while still over threshold stops further attempts. A timeout can send the unchanged request if it still fits the actual model window; inability to bring it below the window fails closed. [external: [Compression]:2967-3004,4063-4286; [Context compaction]:230-428; [Turn context]:344-425]

There is no generic lifecycle “PreCompact” name in the inspected 41-hook allow-list. Auxiliary-call observers can identify compression work but are not blocking checkpoint contracts. For checkpoint-grade integration, inspect the memory/context-engine interfaces; do not pretend an observer creates durable approval authority. [external: [Plugin API]:109-205; [Compression]:2967-3004; inferred]

### 1.3 Durable sessions and resume

The default durable store is HERMES_HOME/state.db. Resume/export guard defaults to 20,000 rows; sessions.max_resume_messages can override it and zero disables it. Normal writes append in a guarded SQLite transaction; recovery can preserve pending rows in HERMES_HOME/sessions/<id>.jsonl. Long-lived in-process callers share one writer for the resolved database; one-shot paths own their handles. [external: [State]:86-107,166-191,422-448; [State messages]:449-470]

Resume first follows verified compression lineage to the live tip, then ordinary continuation children to depth 32, excluding branch, delegate, reset, and tool children. Model history uses active tip rows repaired for alternation; display history materializes and deduplicates the verified compression lineage. Explicit forks/resets stand alone. Missing/unavailable one-shot state errors instead of silently creating a new session. Stored model/provider/base URL/API mode are restored unless explicitly overridden, with credentials re-resolved rather than persisted; fallback may still choose a different available route. Forge receipts need both Hermes session identity and Forge issue/run identity, and must not equate “resumed” with “all historical instructions re-injected”. [external: [State messages]:1559-1598,1732-1813; [One shot]:439-595; inferred]

### 1.4 Config, profiles, and provider routing

load_config composes compiled defaults → deep-merged user config.yaml → canonicalization → environment expansion → managed overlay. Managed policy is last and can pin final leaves. The cache is signature-based; normal callers get a deep copy, readonly callers can get the cached object. Broken config uses last-known-good, else defaults plus managed policy, and cannot become a saveable canonical state. HERMES_HOME selects the active home/profile scope. This is not a universal global → project → local settings stack: project instruction files, trusted project skills, and opt-in project plugins are separate surfaces. [external: [Config]:2123-2134,2314-2430; [Skills trust]:418-435; [Discovery]:134-218]

Runtime route resolution occurs above AIAgent. Agent construction pins base/provider/requested route/capabilities, chooses API mode, builds the client, loads tools/session, then consumes resolved memory/context/compression configuration. API mode considers explicit/plugin selections and provider-specific paths including chat-completions, responses, Anthropic, Bedrock, and Nous handling. Native provider overrides require separate consent capabilities; a Forge workflow plugin has no need to intercept model traffic. [external: [Agent initialization]:368-425,2376-2505; [Capability consent]; inferred]

## 2. Extension points and contracts

### 2.1 Native packages, discovery, order, lifetime, and trust

Native directory packages contain plugin.yaml or plugin.yml and Python register(ctx), normally in __init__.py. Manifest-only locale/Desktop cases also exist; portable packages use plugin.json instead. Discovery scans bundled plugins, profile-home plugins, and project .hermes/plugins only when HERMES_ENABLE_PROJECT_PLUGINS is enabled. Flat or one category level is supported. Discovery order is bundled → user → project, with later same keys winning; a mismatched-directory impostor cannot replace a bundled key. Python entry points use hermes_agent.plugins, with consent metadata in hermes_agent.plugin_capabilities. P7 mentions Nix distribution; the inspected runtime still resolves directory/entry-point packages, so Nix is packaging context rather than a new callback contract. [external: [Discovery]:29-100,134-244; [Loader]; inferred Nix distinction]

External standalone plugins are opt-in via plugins.enabled; plugins.disabled wins. Bundled backends and deferred bundled platforms have special routing; exclusive and model-provider kinds are selected separately. Safe mode skips general plugin discovery. A requires_hermes mismatch skips before import. Dependency ordering uses requires_plugins with alphabetical ties; cycles warn and fall back to alphabetical order. Declared dependency/config-schema/API metadata is not a security or compatibility proof: many malformed/unknown fields only warn. [external: [Discovery]:112-130,257-316; [Manifest]:117-260,432-560; [Plugin API]:1350-1530]

Current parsed YAML field family:

~~~yaml
manifest_version: 2             # omitted means v1
name: forge
version: 0.1.0
description: Native Forge building-block bridge
kind: standalone
requires_hermes: ">=0.21.5"
# Optional metadata/contract fields:
# api_version, author, license, homepage, tags
# requires_env, optional_env, platforms, external_dependencies, pip_dependencies
# provides_tools, provides_hooks, hooks
# provides_browser_providers, provides_web_providers
# requires_plugins: [{id: dependency, version_range: range}]
# python_dependencies: [requirement]
# config_schema: {key: {type: str, default: value, description: text, required: true}}
# capabilities, emits, listens, hermes, depends, python_runtime, provides_locales
~~~

This is a **proposed** minimal Forge manifest with the current recognized field inventory, not an installed package. Kinds are standalone/backend/exclusive/platform/model-provider. Supported manifest schema version is two; future versions/unknown fields warn and continue. Config types include str/string, int/integer, float/number, bool/boolean, list/array, dict/object, secret. Config-schema mismatch is warning-only. python_dependencies are surfaced/validated, not auto-installed by manifest parsing. requires_hermes is a real pre-import blocker. [external: [Manifest]:27-48,117-206,341-394,432-560]

Import plus register defaults to a 10-second deadline; zero disables it and it clamps at 600 seconds. Timeout abandons a daemon worker, marks its context so later registrations are ignored, unwinds its ledger, and caps abandoned loaders at eight. Exceptions and SystemExit are isolated. A timed-out Python thread is not forcibly killed: side effects outside managed registration can survive. Registers return owned handles where supported; unload restores displaced registry entries and removes callbacks/subscriptions. [external: [Loader]:40-134,413-500; [Plugin API]:231-244,410-419; inferred side-effect limitation]

Capability declarations are **consent metadata, not grants**. Sensitive capabilities include tools.override, llm.provider_override, llm.model_override, llm.agent_id_override, llm.profile_override, llm.task_override, and gateway.platform_actions. Unknown/unreadable capability state denies. Tool replacement additionally requires explicit override plus operator allow_tool_override or the corresponding grant. Enabled Python code nevertheless runs in-process with host authority; the scanner and catalog review are not a sandbox. Catalog removal can stop an external plugin from loading. [external: [Capability consent]:28-48,112-147; [Plugin API]:457-475; [Discovery]:257-316]

### 2.2 Portable Agent Plugins: an additional no-Python route

Portable root plugin.json requires the exact schema URL https://agent-plugins.org/schemas/1.0.0/plugin.schema.json. Accepted top-level fields are $schema, name, version, description, author, homepage, repository, license, keywords, extensions. Name is validated; the file must be an in-root regular file; unknown top-level fields are diagnosed and dropped. There is no portable hooks/commands field in this subset. Native loader imports no Python and registers only validated skills plus MCP servers. [external: [Portable]:45-55,152-183; [Loader]:567-619]

Portable skills are one level at skills/<directory>/SKILL.md, confined to the plugin root. Frontmatter requires name equal to directory, the Agent Skills name pattern, and description 1..1024 chars; optional license string, compatibility 1..500 chars, metadata string→string map, allowed-tools string. Invalid skills are skipped diagnostically. Portable names get a collision-resistant agent-plugin slug/hash namespace. [external: [Portable]:186-257; [Manifest]:57-69]

Portable mcp.json requires https://agent-plugins.org/schemas/1.0.0/mcp.schema.json with only $schema and mcpServers. It supports stdio and streamable-http; **portable SSE is rejected**, although native MCP supports SSE fallback. Relative paths must remain under plugin/data roots; command may be a bare executable or ./ path, cwd defaults to plugin root, and PLUGIN_ROOT/PLUGIN_DATA placeholders are controlled/injected. Remote configs force strict redirect headers. Native mcp_servers config wins collisions; portable server names are normalized from the server name, not prefixed with the long plugin id, and duplicate portable names are refused/first-loaded wins. [external: [Portable]:260-413; [Manifest]:71-79; [MCP config]:426-438]

This is a real native package route for skills+MCP, but it cannot carry gate hooks or slash commands on its own. A complete Forge package still needs Python native registration or separately consented shell hooks. [inferred from those source contracts]

### 2.3 PluginContext: the complete inspected registration families

These are native APIs; methods with registration handles participate in cleanup. They are host APIs over trusted Python, not a least-privilege security boundary. [external: [Plugin API]:231-1191]

| Family | Exact surface and contract | Failure/trust/lifecycle notes |
| --- | --- | --- |
| Config and state | has_plugin; get_config/set_config; state; on_unload; spawn_task | Profile-scoped manager; own cleanup for work outside managed handles. |
| Tools | register_tool(name, toolset, schema, handler, check_fn=None, requires_env=None, is_async=False, description="", emoji="", override=False); dispatch_tool; has_capability; call_mcp | JSON tool schemas validated; availability checks filter exposure; builtin/cross-toolset shadowing rejected unless explicitly permitted. |
| Hooks/middleware | register_hook(hook_name, callback); register_middleware(kind, callback) | Unknown names warn but are stored; unknown registration is not evidence of a real fire-site. Tables below name actual supported contracts. |
| Prompt/context | register_system_prompt_section(id, content, position="after_memory", max_chars=...); inject_message; register_context_reference(provider); register_context_engine(engine) | Sections bounded/frozen and persisted verbatim; callable gets read-only session-info mapping. Reference prefixes diff/staged/file/folder/git/url reserved. Only one context engine; replacing it changes native compression and is unnecessary for normal Forge integration. |
| Skills | register_skill(name, path, description="", frontmatter=None) | Read-only namespaced skill, skills_list/skill_view; not copied and deliberately absent from prompt available_skills. Explicit exposure/orientation is needed. |
| Slash/CLI commands | register_command(name, handler, description="", args_hint="", argument_mode=None); register_cli_command(name, help, setup_fn, handler_fn=None, description="") | Slash handler raw_args→str/None, sync or async. Normalized name; builtin conflicts skip. argument_mode options/text/mixed, else text when args_hint supplied. CLI extends parser, not a prompt-template file loader. |
| Memory/auth | register_memory_provider; register_dashboard_auth_provider | Memory registration inert until memory.provider selection; dashboard auth providers are scoped and wrong-type/duplicate cases warn/skip. |
| Model/runtime facades | llm; subagent_lifecycle; approval transport; register_auxiliary_task | Model/provider/profile/task/agent override powers separately consented. Approval observers cannot grant permissions. |
| Messaging/platform | register_platform; platform_actions; register_slack_action_handler; generic/Telegram action-handler registration | Implement native adapter/actions, with gateway.platform_actions grants for privileged plugin actions. |
| Content/privacy/i18n | register_redaction_patterns; register_locale; register_locale_dir | Locale packs may be manifest-only; pack→user overlay→bundled→English/key fallback. Redaction is a registration capability, not a guarantee every hook payload was sanitized. |
| Event bus | emit(event, payload=None); subscribe(qualified_event, callback) | Emit forces own plugin-key namespace; colon/foreign/core names rejected. Dict payload; ordered single-worker fire-and-forget delivery; subscriptions owner-tagged for unload. |
| Media/web/browser/environment/secrets | register_image_gen_provider; register_video_gen_provider; register_web_search_provider; register_browser_provider; register_terminal_environment_provider; register_secret_source; register_tts_provider; register_transcription_provider | Type-checked profile-scope provider registries; unload restores displaced entries. Builtin terminal backend names cannot be shadowed. Secret sources selected by config, loader owns precedence; do not use them to duplicate Forge credential storage. |

Specific provider selectors include image_gen.provider, video generation’s native registry, web.search_backend/web.extract_backend/web.backend, browser.cloud_provider, terminal.backend, tts.provider, and stt.provider. Builtin terminal names are local/docker/singularity/modal/daytona/vercel_sandbox/ssh; command-configured TTS/STT providers take precedence over plugin providers. [external: [Plugin API]:1088-1167]

The inspected prompt-template route is SKILL.md plus slash handlers/prompt/context APIs. No universal Markdown custom-agent or prompt-template file contract was identified in the inspected plugin/delegation registries. That scoped search conclusion does not establish absence elsewhere. [external: [Plugin API]:664-704,998-1086; [Delegation]; inferred scope of search]

### 2.4 Four behavior-changing middleware contracts

The schemas are hermes.observer.v1 and hermes.middleware.v1. Middleware is distinct from lifecycle observation. [external: [Middleware]:16-26,39-47]

| Kind | Callback payload / return |
| --- | --- |
| tool_request | tool_name, args, original_args plus caller context/schema versions; returned {args: mapping} replaces effective arguments before hooks, guardrails, approval, execution. |
| llm_request | request, original_request plus caller context/schema versions; returned {request: mapping} replaces provider kwargs. |
| tool_execution | tool_name, args, original_args, next_call plus caller context; wrap/replace execution result or invoke next_call with optional replacement args. |
| llm_execution | request, original_request, next_call plus caller context; wrap/replace provider execution or call downstream with optional request. |

Request replacements are copied and traced with source/reason/name; the source retains the last valid returned payload. Execution wrappers run in registered order, with **single-use next_call** to prevent repeated side effects. Downstream errors propagate. A middleware’s own exception before calling next falls through to the next wrapper; failure after successful next returns the successful result; failed downstream is not silently retried. There is no deadline around callback invocation in the inspected execution chain. Therefore throwing from middleware is not a reliable deny protocol. Forge gate denials should use pre_tool_call, and receipts should record original/effective inputs where mutation is used. [external: [Middleware]:63-149,161-215; inferred]

### 2.5 All 41 native lifecycle hooks

Source allow-list: hermes_cli/plugins.py:109-205. Payload catalog: official hooks.md:451-491, with caller-specific additions and some surface-dependent session exits. Callback signatures may accept kwargs or declare only fields they consume; dispatcher filters additive kwargs for narrow signatures. Return values are honored **only by the relevant caller**, not by having a “pre” name. [external: [Plugin API], [Hook dispatch]:26-65,151-355; docs: [Hooks reference]]

Payload abbreviations below expand as follows:

- **Tool IDs:** task_id, session_id, tool_call_id, turn_id, api_request_id. **Tool outcome:** duration_ms, status, error_type, error_message.
- **API identity:** task_id, turn_id, api_request_id, session_id, platform, model, provider, base_url, api_mode, api_call_count.
- **Request fields:** user_message, conversation_history, retry_count, request_messages, message_count, tool_count, approx_input_tokens, request_char_count, max_tokens, started_at, request.
- **Kanban identity:** task_id, profile_name, board, assignee, run_id.
- telemetry_schema_version="hermes.observer.v1" is added to callbacks except gateway_platform_event; other fields remain additive. Some payloads contain full requests/results or unredacted error bodies. [external: [Plugin API]:125-131; [Hook dispatch]; docs: [Hooks reference]]

| Hook | Exact named payload family | What return can do |
| --- | --- | --- |
| pre_tool_call | tool_name, args, Tool IDs, middleware_trace | {action:block,message}; {action:approve,...} requests human approval; {action:modify,args} shallow-merges changes. Any block wins, else first approval directive; this does not grant approval itself. |
| post_tool_call | tool_name,args,result, Tool IDs, Tool outcome,middleware_trace | Observer, ignored. |
| transform_tool_result | tool_name,args,result, Tool IDs, Tool outcome | First string replacement. |
| transform_terminal_output | command,output,returncode,task_id,env_type; actual terminal caller also tool_call_id | First string replacement. |
| pre_transcription | file_path,provider,model,language,prompt,source | Dict can change prompt/language/model; last-writer order. file_path immutable. |
| pre_llm_call | session_id,task_id,turn_id,user_message,conversation_history,is_first_turn,model,platform,parent_session_id,sender_id | String or {context} additions joined/injected. |
| post_llm_call | session_id,task_id,turn_id,user_message,assistant_response,conversation_history,model,platform | Observer. |
| pre_api_request | API identity + Request fields + middleware_trace | Observer, not a request rewrite hook. |
| post_api_request | API identity,api_duration,started_at,ended_at,finish_reason,message_count,response_model,response,usage,assistant_message,assistant_content_chars,assistant_tool_call_count | Observer. |
| api_request_error | API identity,api_duration,started_at,ended_at,status_code,retry_count,max_retries,retryable,reason,error,request | Observer. |
| pre_auxiliary_call | aux_task + API identity/retry/streaming + request_messages,system_prompt,message_count,tool_count,approx_input_tokens,request_char_count,max_tokens,started_at,request | Observer; separate physical auxiliary attempts such as compression/titling/vision. |
| post_auxiliary_call | Auxiliary identity + api_duration,ended_at,finish_reason,response_model,usage,response,assistant_content_chars,assistant_tool_call_count,error,error_type | Observer. |
| transform_api_error_classification | provider,model,status_code,error_type,error_code,error_message,error_body,error,approx_tokens,context_length,num_messages | Python only. All run; first valid {reason,...} classification wins; optional retry/compress/credential/fallback flags. |
| transform_llm_output | response_text,session_id,model,platform | First valid nonempty replacement string. |
| pre_verify | session_id,platform,model,coding,attempt,final_response,changed_paths | {action:continue,message} or compatible stop-block directive keeps working; bounded by max_verify_nudges, not indefinite veto. |
| on_stream_start | turn_id,iteration,session_id,model,provider,surface | Observer. |
| on_stream_delta | Stream identity + delta,kind | Observer; normalized immutable stream data. |
| on_stream_end | Stream identity + final_text,finished,error | Observer. |
| on_interim_message | Stream identity + text,already_streamed | Observer. |
| on_session_start | session_id,model,platform | Observer. |
| on_session_end | Canonical session_id,task_id,turn_id,completed,failed,interrupted,turn_exit_reason,model,platform; legacy exit shapes vary | Observer. |
| on_session_finalize | session_id/platform with surface-dependent reason/IDs | Observer; no fixed universal extra-field schema. |
| on_session_reset | session_id/platform with surface-dependent reason/old/new IDs | Observer. |
| agent_loop_stopped | session_key,platform,reason,invalidation_reason | Observer. |
| on_skill_lifecycle | action,skill_name,provenance,task_id,session_id,use_count,reused,reuse_after_patch | Observer of successful skill facts. |
| subagent_start | parent_session_id,parent_turn_id,parent_subagent_id,child_session_id,child_subagent_id,child_role,child_goal | Observer. |
| subagent_stop | parent_session_id,parent_turn_id,child_session_id,child_role,child_summary,child_status,tool_call_history,duration_ms | Observer. |
| pre_approval_request | command,description,pattern_key,pattern_keys,session_key,surface,turn_id,tool_call_id | Observer; cannot veto/pre-answer. |
| post_approval_response | Approval payload + choice and optional decided_by | Observer. |
| on_room_member_activity | room_id,thread_id,member_id,turn_id,task_id,execution_generation,kind,seq,payload | Observer, off token path; client-safe activity, not durable room log. |
| pre_command | surface,command,alias_used,args_raw,session_key,platform | Observer only v1. Does not fire for running-agent escape-hatch intercepts such as stop/approve. |
| kanban_task_claimed | Kanban identity | Observer. |
| kanban_task_completed | Kanban identity + summary | Observer. |
| kanban_task_blocked | Kanban identity + reason | Observer. |
| on_kanban_worker_spawned | Kanban identity + worker_pid,workspace_path | Observer; after PID persistence, inside dispatch lock—stay fast. |
| on_kanban_worker_exited | Kanban identity + worker_pid,exit_kind,exit_code,outcome,retry_status | Observer. |
| on_kanban_worker_stale_claim | Kanban identity + worker_pid,heartbeat_stale,retry_status | Observer of reclaimed stale claim, not every live-PID extension. |
| on_kanban_task_updated | Kanban identity + changed_fields | Observer; field names, not values. |
| on_kanban_dispatch_tick | board,profile_name,dry_run,outcome,result:DispatchResult | Observer after dispatch lock release; result carries task/assignee/workspace details. |
| pre_gateway_dispatch | event,gateway,session_store | First valid skip/rewrite-text/allow; before auth/pairing/normal dispatch. |
| gateway_platform_event | platform,event_type,payload | Observer of normalized event-local envelopes; no adapter handles/action grants. |

The table’s 41 names exactly match the inspected source allow-list. It does not turn undocumented optional kwargs into mandatory fields. Current platform event fire-sites include Telegram reaction/message_edited and Discord message_edited/message_deleted/thread_created/thread_renamed. [external: [Plugin API]:109-205; docs: [Hooks reference]]

Native dispatch supports sync and async handlers, preserves non-None results in registration order, and isolates failures. Default bounded hook timeout is 30 seconds, zero disables it, maximum 600. Bounded families include pre_tool_call, post_tool_call, terminal/tool/LLM transforms, pre/post LLM, pre/post/error API, pre/post auxiliary, pre_verify, session start/end. **pre_tool_call fails closed on timeout/exception; bounded others fail open.** Finalize/reset, subagent_start, pre_gateway_dispatch, approval/kanban observers are unbounded by this dispatcher; subagent_stop stays on caller thread. Timed-out sync daemon handlers are abandoned with 60-second suppression and a three-handler cap; async handlers use wait_for cancellation. Streaming observation is queued away from the token path. [external: [Hook dispatch]:151-355,483-519; [Plugin API]:113-154]

### 2.6 Shell hooks: executable wire, consent, and failure policy

Profile config.yaml has a hooks mapping, with each event a list:

~~~yaml
hooks:
  pre_tool_call:
    - matcher: "^(write_file|patch|terminal)$"
      command: "node /absolute/path/to/forge-hook.js"
      timeout: 10
      fail_closed: true
~~~

This example is **proposed**, not installed. command is parsed and executed with shell=False; matcher regex is honored only for pre/post_tool_call. Config events use VALID_HOOKS except transform_api_error_classification, which is refused as Python-only. Native defaults are timeout 60 seconds, min one/max 300, fail_closed false; failClosed is a compatibility spelling and canonical fail_closed wins. Only pre_tool_call is blocking-capable/fail-closed. An outer bounded plugin-hook deadline can be shorter than the subprocess deadline. [external: [Shell hooks]:37-49,127-135,211-279,313-365]

Exact stdin envelope:

~~~json
{
  "hook_event_name": "pre_tool_call",
  "tool_name": "write_file",
  "tool_input": {"path": "AGENTS.md"},
  "session_id": "fixture",
  "cwd": "<process cwd>",
  "profile": "<active profile>",
  "extra": {"turn_id": "<if supplied>", "tool_call_id": "<if supplied>"}
}
~~~

Python callback args becomes tool_input. session_id can fall back to parent_session_id; all other caller fields go under extra. stdout accepts Hermes block/message, modify/args, approve/request-human shapes, and compatible Claude decision:block or decision:modify/tool_input. pre_verify maps continue or stop-block to “continue”; other events accept only a nonempty context string, which most observer callers ignore. Exit two blocks pre_tool_call independently of JSON; other nonzero exits still parse stdout. Spawn errors/timeouts normally fail open; configured fail_closed blocks those failures and garbage non-JSON stdout. Empty output still means no directive. [external: [Shell hooks]:79-94,384-487]

First registration requires exact event+command allow-list consent. CLI/env/config acceptance or a TTY can grant it; an unseen hook in non-TTY mode skips. The allow-list stores timestamp/mtime, but the exact command string is its authority, so modifying a script behind an unchanged command is not a new cryptographic approval. Safe mode skips shell registration. Subprocesses use hidden Windows flags, their own process group, and process-tree timeout cleanup; multiplexed profiles scrub inherited secrets. A trusted Python plugin or allow-listed script remains trusted code. [external: [Shell hooks]:141-176,313-365,490-576; inferred mtime limitation]

### 2.7 Gateway HOOK.yaml handlers: separate contract

Each profile-home hooks/<directory>/ contains HOOK.yaml and handler.py. Fields read are optional name/description and a required truthy events list. Handler is handle(event_type: str, context: dict), synchronous or async, imported in-process. Exact event handlers run before matching base:* handlers; bare base does not match a colon event. emit ignores returns; emit_collect gathers non-None results in order. Exceptions are logged/isolated; **there is no deadline**. Registry is lazy and profile-scoped. Placement is trust: no enable list, approval prompt, or sandbox, and safe mode does not skip this gateway-only system. [external: [Gateway hooks]:43-181; docs: [Hooks reference], gateway trust section]

| Actual event family | Context from current callers | Return effect |
| --- | --- | --- |
| gateway:startup | platforms | None; emit. |
| session:start | platform,user_id,session_id,session_key | None. |
| session:end; session:reset | platform,user_id,session_key | None. |
| agent:start | platform,user_id,chat_id,thread_id,chat_type,session_id,message capped at 500 chars | None. |
| agent:step | platform,user_id,session_id,iteration,tool_names,tools | None. |
| agent:end | Start context + response capped at 500 chars,model,provider | None. |
| command:<canonical> | platform,user_id,command,raw_command,args,raw_args | Caller interprets collected dicts: deny, handled, rewrite command/args. This is not Python pre_command. |
| Adapter reaction event, default reaction:added | Adapter-supplied event name/context | Dynamic adapter contract; no universal closed schema. |

Fire-sites: gateway/run_startup.py:1452-1456; run_turn.py:531-542,1657-1662,2166-2175; run_turn_runner.py:831-845; slash_commands_session.py:142-153; run_inbound.py:815-842; run_adapters.py:209-213. [external: [Gateway startup], [Gateway turn], [Gateway runner], [Gateway session commands], [Gateway inbound], [Gateway adapters]]

Use these for optional messaging observers/commands with explicit operator installation. They do not provide a universal pre-tool gate, and gateway-only hooks do not certify CLI behavior. [inferred]

### 2.8 Skills, tools/toolsets, subagents, approvals, and sandboxing

**Skills:** profile-home skills, configured creation/external roots, then trusted project .hermes/skills and .agents/skills. The nearest Git root must be in skills.trusted_project_dirs; trusted project skills override same-name profile/bundled skills. Cwd/trust/index are session-fixed. Project SKILL.md files are scanned when content changes: dangerous verdict quarantines, scanner crash fails closed, caution may load. Trust does not disable content scanning. Portable SKILL.md format is specified in §2.2; plugin-registered skills have their distinct namespaced/read-only exposure in §2.3. Slash skill invocation and skill_view are procedure/prompt loading, not a new tool-permission boundary. [external: [Skills trust]:418-583; [Portable]:186-257; [Plugin API]:1055-1086]

**Tools/toolsets:** registry validates schemas, tracks profile scope and plugin ownership, prevents shadowing without consent, and returns a bounded unknown-tool error. enabled_toolsets=None means all; explicit sets select, setup/role-reserved tools are stripped, disabled sets subtract last. Availability check_fn and dynamic schemas are applied before exposure. Recursive toolsets can include registry additions; platform inference uses static bundles. Tool-search progressive disclosure can defer plugin/MCP schemas, not core tools. MCP is therefore useful for composition, but Forge should expose a small bounded toolset rather than dump the entire CLI into one session. [external: [Tool registry]:666-732,843-900; [Model tools]:315-341,506-545; [Toolsets]:7-18,375-382; inferred]

**Delegation:** delegate_task supports spawn/list/steer/stop, fresh child conversation/tool cache/terminal/session linkage and a focused goal/context. Child construction explicitly skip_context_files=True and skip_memory=True; copying parent issue instructions cannot be assumed. Children derive provider/model/toolsets, depth and role; nesting permission comes from actual depth, not a caller’s role label. Defaults: concurrency ten, max depth one, one-shot child budget two; config can raise concurrency/depth, so these are not product cost ceilings. Optional local-Git worktree isolation and background delivery are opt-in; children have their own iteration/progress accounting. CLI approvals fail-safe deny by default unless explicit auto-approval configuration; gateway uses the session approval queue. Same-endpoint capability trust can inherit; changing provider/base URL defaults to deny. [external: [Delegation]:182-267,440-574; [Delegation config]:17-45,85-159,182-194]

Capable live sessions can receive child results between parent turns; one-shot/cron sessions without a completion consumer join synchronously. Heartbeats and inactivity/stale limits are separate from total wall-clock limits, and no default wall timeout is a reliable total-cost bound. No Markdown agent-file loader was identified in these inspected delegation paths. Forge reviewer/spec roles can be expressed through bounded delegation tasks/skills/config; do not generate fictitious .hermes/agents files. [external: [Delegation]:71-78,564-574; [Delegation config]:17-27,139-159; inferred]

**Approval/security:** plugin action:approve escalates through the same human gate and fails closed without a bridge. Terminal hardline rules precede YOLO/off, after verified isolated/no-host-access exceptions. Ordinary single-query mode has an explicit unattended marker/default deny. A custom local noninteractive Python caller without a recognized approval context can inherit documented trusted-by-config auto-approval behavior; configure an approval context or use the gateway bridge when embedding. [external: [Approval]:1083-1129,1172-1205,1240-1288; [Single-query approval tests]]

**Sandbox:** local executes on the host. Builtin isolation backends include Docker, Singularity, Modal, Daytona, Vercel Sandbox; SSH is remote execution, not inherently a policy sandbox. Backend construction has resource/network/mount settings and clear unavailable-requirement failures. ContextVar profile scoping prevents another profile’s backend pin leaking in; failed terminal policy resolution installs a refusing tool before spawn. These are real Hermes capabilities even though Forge’s matrix says no execution-sandbox/allowlist surface. They are not delivered Forge integration, and Python/Desktop plugin execution is not confined by terminal sandbox selection. [external: [Terminal scope]:1-8,62-203; [Terminal config]:120-121,202-216; [Terminal backends]:52-77,130-247,316-362; [Plugin API]; inferred]

### 2.9 MCP, headless/API, messaging, cron, and UI

#### MCP

Native mcp_servers config supports local stdio and remote HTTP, including Streamable HTTP and latched SSE fallback. Transport handles TLS/proxy/auth and redirect-header boundaries; OAuth 2.1/PKCE is implemented in transport integration. Official docs additionally describe DCR/device-code setup; those flows were not individually executed or exhaustively traced. Remote auth:oauth and hermes mcp login <name> are documented; initial setup commits config/token state only after accepted authorization and first connection. An expired refresh parks the server rather than opening an unattended browser. [external: [MCP transport]:346-607; docs: [MCP guide]:74-88,120-141,238-271,700-725]

Stdio child environment is a safe baseline plus profile-specific/configured values, not indiscriminate inheritance of every profile’s secrets. Each server yields mcp-<server> toolsets. include is an allow-list and wins over exclude; an empty include exposes none. Resources/prompts are exposed only when enabled and advertised. Registration collisions fail closed; native config wins portable-plugin names. Gateway watches can reload config, but that is not proof an arbitrary install immediately changed every active CLI session. [external: [MCP config]:155-177,426-438; [MCP registration]:151-177,211-226,322-362; docs: [MCP guide]]

Hermes also has hermes mcp serve for its own messaging surface: stdio-only, text sends, reads without a running gateway, sends requiring one. That server is not a Forge Kernel MCP implementation. [docs, external: [MCP guide], messaging-server section]

#### Headless, SDK, RPC, and output

The parsed safe automation route is hermes chat -q/--query or --query-file PATH; "-" means stdin, with UTF-8-sig handling. --format stream-json emits JSONL, requires a query, implies quiet, and cannot combine with TUI. Non-TTY/quiet single-query runs one turn then exits with SINGLE_QUERY_SESSION and default-deny approval behavior. --max-turns/--run-budget bound the run. Provider/model flags exist; **there is no native --base-url flag** in this parser—custom endpoints come from config. [external: [CLI parser]:161-174,232-308; [Single query]:193-339,483-547; [Stream JSON]:18-30]

Top-level -z/--oneshot is a different path: it sets HERMES_YOLO_MODE=1 and HERMES_ACCEPT_HOOKS=1 to avoid noninteractive approval hangs and returns final content. Do not use it to prove controlled approval/trust. --safe-mode disables config/rules/plugins/MCP, so it is a process-contract smoke only, not a plugin smoke. Direct Python AIAgent embedding is supported, but must establish explicit approval context; there is no documented --mode rpc. [external: [One shot]:240-344; [CLI parser]:307-308; docs: [Programmatic]:202-226; [Approval]]

Three programmatic doors are documented over the same agent core: ACP JSON-RPC over stdio (hermes acp, --check/--setup), TUI gateway JSON-RPC over stdio or WebSocket, and HTTP/SSE API server. WebSocket clients must advertise client.capabilities.server_requests after gateway.ready to receive approval/clarify/sudo/secret/MCP/Desktop requests; otherwise those requests fail immediately. These are protocols with explicit client obligations, not interchangeable generic JSON stdin. [docs, external: [Programmatic]:9-104]

Documented HTTP endpoints include /v1/chat/completions, /v1/responses, /v1/runs with status/events/approval/steer/stop, /v1/capabilities, /v1/models, /api/model/options, health, and browser-control registration/ws. API server source modules exist under gateway/platforms/api_server*. The endpoint list is docs-level here; cancellation/idempotency/auth behavior needs installed tests before a Forge API adapter claim. [docs, external: [Programmatic]:126-146; source tree inspection]

#### Gateway and messaging

Official integration inventory includes Telegram, Discord, Slack, WhatsApp, Signal, SMS, Email, Home Assistant, Mattermost, Matrix, DingTalk, Feishu/Lark, WeCom, Weixin, BlueBubbles/iMessage, QQ, Yuanbao, Teams, LINE, ntfy/browser, plus Relay external-connector negotiation. One gateway handles per-chat sessions, scheduling, and voice; credential presence does not mean a running adapter or verified delivery. Profiles and enabled:false matter. Platform capabilities vary, so selecting a channel does not imply identical thread/reaction/media/approval support. [docs, external: [Messaging]:3-68]

Forge can install a slash command/context hook through native plugin registration and let Hermes own delivery/session behavior. Explicit mapping of profile/platform/chat/thread → project/issue/run is necessary: a gateway cwd is not proof of the desired worktree, and private issue context must not be broadcast into a group by inference. This is proposed design, not a request to send any messages. [inferred/proposed]

#### Cron and scheduled/event-driven runs

Cron supports one-shot/recurring jobs, skills, pause/resume/edit/run/remove, origin/local/platform/fan-out delivery, script-only no-LLM jobs, and event-triggered webhook jobs. Jobs normally start fresh sessions; continuation is opt-in. Cron sessions cannot recursively create cron jobs. Gateway ticks are documented at 60 seconds. Global pause blocks scheduled/webhook admission but manual operator run remains possible. [docs, external: [Cron guide]:9-43,252-275,542-575,689-715; [Messaging]:130-132]

Source scheduler admission is file-locked; ESTOP/drain stops new dispatch while leaving inflight work; due/stale sweeps precede bounded parallel dispatch. Preflight validates provider credentials, delivery targets, named MCP toolsets; bad config becomes blocked_config before LLM spend. Script jobs are confined beneath HERMES_HOME/scripts with traversal/symlink checks, approved interpreter/extension selection, sanitized environment, timeout/cancel process-tree kill, output redaction, and heartbeat-based claim protection. Windows .sh uses Git Bash. A successful job transcript and a delivery acknowledgment remain separate evidence; docs expose UNVERIFIED when delivery is unproven. [external: [Cron tick]:19-99; [Cron preflight]:236-290; [Cron scripts]:323-594; docs: [Cron guide]:77-108,670-687]

Use cron as a native timer/worker trigger carrying a Forge request envelope, not as a second issue scheduler authority. Any mutating periodic composition must obtain Kernel authority, run the bounded task, write a receipt, and verify it before reporting success. [inferred/proposed]

#### Desktop, dashboard, TUI, skins, status/output

**Desktop SDK:** native app loads a plain ESM default export {id,name?,defaultEnabled?,register(ctx)} via @hermes/plugin-sdk. Disk path is HERMES_HOME/desktop-plugins/<id>/plugin.js; unified packages place desktop/plugin.js beside their native plugin and Electron copies it to the app root with .hermes-package.json provenance. UI enable state is separate from the agent half; unified halves start opt-in. Contributions are namespaced/provenance-tagged and return disposers. SDK offers REST/socket to own backend namespace, gateway events, own storage, scoped timers/listeners, OS notification/open/reveal/clipboard, composer drafts, sessions, profile-aware requests, typed settings/skills/toolsets/profiles bridges, and read-only plugin decisions. [external: [Desktop types]:76-140,273-299; [Desktop SDK source]; docs: [Desktop guide]:64-220,1348-1390]

Contribution areas include panes, routes/pages, sidebar nav, status bar, title bar, workspace page header, palette, keybinds, themes, composer slots/middleware/attachments, session-row decoration, model-pill labels, appearance settings, transcript directives, mount-scoped chrome, and sidebar preferences. SandboxedFrame isolates embedded external content; it does **not** sandbox the plugin itself. Source loader evaluates ESM with full app/native bridge authority, rejects unsupported imports, times module evaluation at 10 seconds, rolls back throwing registration, reports an error row, handles disposer failures, and watches file/root changes for reload. SDK storage namespaces are conventions, not security walls. [external: [Desktop loader]:20-32,60-66,380-558; docs: [Desktop guide]:221-1207,1575-1595]

**Dashboard SDK:** separate system using window.__HERMES_PLUGIN_SDK__, dashboard/manifest.json and a prebuilt bundle, optional CSS and plugin_api.py FastAPI router under /api/plugins/<name>. Manifest includes name,label,description,icon,version,tab.path/position/override/hidden,slots,entry,css,api; slots are documentation, actual registration is JS. Home wins over bundled then opt-in project in dashboard discovery. Named shell slots: backdrop, header-left/right/banner, sidebar (cockpit only), pre-main/post-main, footer-left/right, overlay. Page top/bottom slots cover sessions,analytics,logs,cron,skills,config,env,docs,chat. First route override wins. Backend routes sit behind ordinary dashboard auth and disabled-plugin checks, but run Python in the dashboard process. Discovery is cached and supports rescan. [docs, external: [Dashboard guide]:362-485,575-704,726-817,880-887]

**CLI/TUI presentation:** display.skin selects builtins or home skins/*.yaml, with user same-name overrides and default fallback. Keys cover colors/status backgrounds, spinner, branding, labels/prompt symbol, tool_prefix, tool emoji, banners; customCSS is GUI-only and capped at 32 KiB. /skin is session-only unless config persists it. These are presentation knobs, not an arbitrary terminal status-command/agent-rule API. Python callbacks must stay headless in TUI/gateway hosts; UI panels should use the specific Desktop/dashboard SDK. No Claude-like output-style manifest family was identified in the inspected package APIs; use native output callbacks/skins and keep proof JSONL machine-readable. [docs, external: [Skins guide]:9-28,45-114,216-232,283-289; inferred scope of inspected APIs]

### 2.10 Forge’s existing Hermes support: actual case-insensitive lib inventory

Ran recursive case-insensitive rg for hermes under lib/. Matching files were: using-forge.js, skills-sync.js, hook-renderer.js, hook-global-installer.js, harness-capability-matrix.js, agents-config.js, agents/README.md, agents/hermes.plugin.json, commands/hooks.js, commands/_manifest.js, capabilities/probes.js, rules-sync.js, skill-eval.js. The complete matching-file inventory was read; absence outside lib is not inferred from this scan. Repo evidence uses this approved worktree, permitted by common.md; no remote ref was mutated/fetched in this phase. [ran: rg -l -i hermes lib/; read: paths above]

| Delivered code | What it actually does | Limit/correction |
| --- | --- | --- |
| lib/agents/hermes.plugin.json:1-22 | Forge-internal descriptor id hermes, skills=true, .hermes/skills, hermes-forge skillDefinition, support.status supported/hybrid, install not required | Not plugin.yaml and not a Hermes native package. |
| lib/skills-sync.js:6-15,47-52,193-211 | Copies canonical skills/ into .agents plus harness mirrors including .hermes/skills | Projection is not native project trust approval; canonical-link direction is future work. |
| lib/using-forge.js:208; rules-sync.js:17,181; skill-eval.js:44 | Dispatches hermes-forge and relies on instruction/CLI surface, not a separate Hermes rules engine | Never mistake procedure metadata for enforced native permissions. |
| lib/hook-renderer.js:431-450 | YAML pre_tool_call groups: write_file|patch for protected-path, terminal for TDD gate | No fail_closed field, no installed coverage proof; patterns are not an exhaustive mutation inventory. |
| lib/hook-global-installer.js:64-65,191-204,282-336; commands/hooks.js | Explicit global install merges only Forge-owned entries, preserves user config, refuses unsafe YAML shapes; parse refusal backs up/skips outside dry-run | Does not automatically satisfy Hermes exact-command allow-list consent; global affects all projects. |
| .forge/hooks/forge-native-hook.js:235-249,314-357,377-380 | Extracts tool_input.path/file_path or command; emits action:block/message, permits normal allowed path | Current wire is correct. Unknown/missing cases and project adapter availability need failure tests. |
| lib/harness-capability-matrix.js:116-198,268-271 | Four harness IDs; Hermes instruction/skill/CLI projection; packaged global hooks; MCP, subagent-file, permission, sandbox rows marked unsupported; typed-memory not-delivered | Mixes upstream capability with delivered Forge adapter. MCP and sandbox/allowlist wording is stale; subagent-file absence is not absence of delegation. |
| lib/capabilities/probes.js:74-80 | Regex version/help probes for monitor, cron, resume, pause/remove, sessions cleanup, origin delivery | Help-word probes do not prove those commands or runtime guarantees on current Hermes; use actual parser/install results. |
| lib/agents/README.md:97; agents-config.js:91 | Says Hermes support is planned | Conflicts with supported descriptor; neither label is installed proof. |

A focused readonly Node check of the installed project adapter supplied the exact current Hermes shell envelope, targeted AGENTS.md, and asserted deny. Result was {"path":"AGENTS.md","command":"git status","decision":"deny","wire":"block"}, exit zero. This proves Forge’s isolated extraction/decision/serialization for that fixture, **not** that Hermes discovered, trusted, executed, or covered every tool. [ran: §5]

## 3. What Forge can leverage, ranked

All integration choices below are **proposed/inferred**, grounded in the cited native surfaces.

| Rank | Native advantage | Forge block/capability carried | User-visible benefit / constraint |
| --- | --- | --- | --- |
| 1 | Python pre_tool_call plus four middleware contracts and typed registration ownership | Gate evaluation, original/effective input receipt, controlled tool surfaces | One native install gives denials before effect and auditable cleanup; use deny protocol, not exception-as-deny middleware. |
| 2 | Bounded persisted system-prompt sections + context-reference providers | Kernel recap/orientation, scoped memory recall, @forge: references | Predictable small orientation without copying full issue state into every prompt; stale state explicitly refreshed. |
| 3 | Ordinary single-query JSONL + native validation/capability probe | Installed-version conformance proof | Repeatable pinned CLI transcripts without oneshot auto-approval; validation alone is not all runtime proof. |
| 4 | Native and portable package discovery, skill namespace, MCP merge | Reusable building-block capability catalog and procedures | Shared skills/MCP subset plus Hermes shim in one npm artifact; account for plugin skills absent from prompt index. |
| 5 | Durable tool rounds, compaction boundaries, lineage-aware resume | Recoverable receipts/continuation | Tie Forge run IDs to Hermes session IDs and distinguish intent/result/delivery; keep Kernel as source of authority. |
| 6 | Async native delegation with steering/stop and child lifecycle events | Optional reviewer/spec/task compositions | Native child work instead of launching another loop; explicitly transmit allowed context, budget, tools, and issue scope. |
| 7 | Gateway platform registration, commands, approval bridge, event handlers | Opt-in project status/recap and human approval from chat | Reach beyond terminal users; explicit chat/project mapping and scoped access before private context. |
| 8 | Locked cron admission and confined script-only jobs | Deterministic periodic Forge checks and event-triggered flows | Zero-LLM timer work where appropriate; Hermes timer never replaces Kernel lease/workflow authority. |
| 9 | HTTP/SSE async runs, ACP, gateway JSON-RPC | External app/framework adapters and cancellation/control | Reuse native session/approval mechanisms; exact API-run behavior needs separate installed proof. |
| 10 | Desktop contribution registry and dashboard slots | Optional separate Forge visualization | Native status/pane/receipt views over public Forge APIs; no UI requirement in core and no policy writes by side door. |

Do not make a Forge memory backend the default: it would compete for the single external memory slot. Do not replace ContextEngine or model routing just to inject recap. Do not create a second Kanban/cron issue store that competes with Kernel. The native surfaces should carry optional block composition, not impose Forge’s TDD reference workflow on every Hermes user. [inferred from north-star and §§1-2]

## 4. Limits, gotchas, churn, and platform risks

| Risk | Evidence / consequence |
| --- | --- |
| Docs versus source drift | Source has 41 hooks; overview still says 27. “Register accepted” is weaker than a current fire-site. Pin actual source and generate contracts from registries. [external: [Plugin API], [Hooks reference]] |
| One-shot approval semantics | -z/--oneshot sets YOLO and hook acceptance. Ordinary -q does not; safe-mode removes plugins. Custom Python embedding without approval context has a documented local unattended limitation. [external: [One shot], [Single query], [Approval]] |
| Current global Forge gates can fail open | Renderer omits fail_closed; shell subprocess errors/timeouts default fail open. Native Python pre-tool failure behavior differs. Broad write coverage still needs terminal/execute_code/MCP/middleware/provider tests. [read: lib/hook-renderer.js:440-450; external: [Shell hooks], [Hook dispatch]] |
| Plugin trust is code trust | Enabled Python runs in-process; timed-out workers can keep running outside the managed ledger. Desktop has full app authority; import allow-list/error isolation are not a sandbox. Gateway drop-in handlers are trusted by placement and have no deadline. [external: [Loader], [Desktop loader], [Gateway hooks]] |
| Skill trust is two gates, not one | Project root trust plus content scanning; changed content rescans. Same-name project overrides and hidden plugin prompt index affect activation. [external: [Skills trust], [Plugin API]:1055-1086] |
| Cross-profile/config collision | Use active HERMES_HOME, preserve managed leaves, use fixed namespaces, native MCP config wins, no global-home assumption in a multiplexer. [external: [Config], [MCP config], [Manifest]] |
| Observation is not authority | Session-start, approval, pre_command, stream, Kanban observers cannot block; pre_gateway_dispatch precedes authentication; do not treat raw inbound payloads as authenticated Kernel grants. [external: [Plugin API], [Gateway inbound]; inferred] |
| Tool filtering is exposure, not full isolation | local terminal is host execution, Python plugins unrestricted, isolated backend selection has distinct policy. Do not claim read-only security from a missing tool name alone. [external: [Terminal scope], [Terminal backends]; inferred] |
| Native Windows and WSL are separate baselines | Native docs support chat/gateway/cron/browser/MCP; dashboard POSIX PTY needs WSL. Git Bash supports native shell work. Native gateway uses pythonw/hidden detached flags; login autostart is explicit via Scheduled Task. WSL1, Windows-mounted filesystem watchers/case/latency, UNC cwd for Windows MCP, localhost/firewall/DNS/VPN and clock drift affect operation. [docs: [Windows native]:220-284; [Windows WSL]:10-40,65,111-140,188-258,319-349] |
| Delivery proof varies by channel | Threads/media/approvals differ; credentials saved is not running gateway or delivered message. Cron distinguishes UNVERIFIED delivery. [docs: [Messaging], [Cron guide]:670-715] |
| Schema warnings are not strict compatibility | Future manifest/config fields often load with warnings; dependencies/topological cycles have fallback. Enforce Forge’s own manifest/config validation before native load. [external: [Manifest]] |
| API/live UI behavior remains unrun | Docs list API routes and UI extension promises; this phase did not exercise authorization, SSE cancellation, channel delivery, reload, or crash recovery. Mark experimental until named tests pass. [evidence boundary] |

**Observed six-month change signals:** official release history includes the 0.15.x packaging/loopback correction window in May; August 0.20.x brought MCP 2.x/stateless protocol migration, plugin install scanning and subprocess runtime isolation; late August/September 0.21.x brought large session-store rewrites, followed by state.db fixes in 0.21.2, and continued Desktop SDK/connector evolution by 0.21.5. These are release-note reports, not independently reproduced bugs. September tags on Aug 31, Sep 7, 11, 14, 21, 24 show patch gaps of roughly 3–7 days in that sample, not a guaranteed cadence. [external: [Release history], [September state patch], [MCP migration release]]

Current main’s inspected commit specifically fixes an indefinitely blocking macOS deleted-WAL-holder scan with a five-second daemon-thread deadline. That explains a current startup-hang class in source history; it does not explain the shell/connector delays in this research session and does not prove a Windows defect. [external: [Source pin]]

Documentation inconsistency found within Desktop guide: it mentions bundled Radio near the delivery modes but later says no Desktop plugins ship in core. The runtime loader has a bundled-discovery path; this dossier does not resolve the shipped-inventory inconsistency from prose. Do not use that doc sentence as an absence proof. [external: [Desktop guide]:78-83,1558-1573; [Desktop bundled loader]]

No claim of “documented but broken on this machine” is made without execution. The concrete failures observed here were restricted clone placement and refused shell HTTP, not a Hermes runtime test.

## 5. Proof recipe: L2 installed-version conformance

**Status: proposed, not run.** Source audit is pinned; no Hermes installation, provider, or live system was changed. The only behavioral check executed was the isolated existing Forge adapter fixture in §2.10.

### 5.1 Fixture and pin

Use disposable Linux CI and a separate native Windows job. Pin the full source commit audited above first; separately certify the stable v2026.9.24 tag after checking its actual commit/contracts. Record full SHA, native version output, Python/dependency environment, Node 24/26, OS/shell, Forge artifact hash, generated adapter hash, active profile, exit code, JSONL transcript, and every named assertion. Main canary is separate from the certification baseline. [proposed]

CI fixtures must provide an isolated HERMES_HOME, no operator credentials/config, a disposable Forge Kernel store/project, the actual packed npm artifact, and a local scripted provider. Put custom model.base_url in fixture config; the parser has no --base-url. Official tests-js/scripts/mock-provider-config.ts shows the custom provider mapping but disables approvals at line 70; copy the routing shape only, **not that approval setting**. Set approvals.single_query_mode: deny; never add YOLO, oneshot, safe-mode, or global hook auto-acceptance to make a test pass. [external: [Mock provider config]:49-70; [CLI parser], [Single-query approval tests]; proposed]

Generated plugin/native MCP fixtures and the scripted provider driver described below are **new test artifacts to implement**, not files that already exist in Forge. Installer must unpack from the one npm artifact, enable through Hermes’s ordinary plugin consent/config, and restrict the selected toolset. The plugin must not claim override/platform-action grants it does not need.

### 5.2 Exact native commands for the CI contract

Assuming the pinned Hermes environment and proposed fixtures have been installed by the CI setup step:

~~~sh
hermes --version
hermes plugins validate "$HERMES_HOME/plugins/forge" --json
hermes plugins enable forge
hermes plugins list --enabled --json

hermes chat --query-file "$FIXTURES/orient.txt" --format stream-json \
  --provider custom --model forge-fixture --toolsets forge --max-turns 4

hermes chat --query-file "$FIXTURES/deny-write.txt" --format stream-json \
  --provider custom --model forge-fixture --toolsets terminal,file --max-turns 4

hermes chat --query-file "$FIXTURES/mcp-recap.txt" --format stream-json \
  --provider custom --model forge-fixture --toolsets mcp-forge --max-turns 4
~~~

The native flags/commands are source-backed. The exact builtin file toolset label in the write scenario must be selected from the pinned installed toolset catalog during fixture setup; if “file” is not that version’s actual label, fixture validation must fail and report the catalog rather than silently running without the write tool. The test driver should construct that argument from the validated installed catalog. “forge” and “mcp-forge” are **proposed registered fixture toolsets**, not current Forge deliveries. [external: [CLI parser], [Plugin parser], [Single query], [MCP registration]; proposed]

Query-file preserves task quotes, backticks, and command-substitution text without shell interpolation. Validation JSON is {ok,checks:[{name,ok,detail}],warnings}, with exit 0/1; native validation includes a bounded subprocess register(ctx) probe, while portable validation does not import Python. Optional dependency provisioning flag is --install-deps, not --provision. A validate/list pass alone does not certify the actual agent path. [external: [Plugin validation]:34-73,468-522,584-626; [Plugin parser]:53-60; [Single query]; proposed interpretation]

For deterministic registration diagnostics in a fixture script, the current APIs are get_plugin_manager(), discover_plugins(), manager.discover_and_load(), invoke_hook()/ainvoke_hook(), not invented load_all_plugins/fire_hook. Use installed source imports, then run the native CLI path above for runtime proof. A direct Python driver must install approval context; otherwise it can take the documented noninteractive trusted path. [external: [Plugin API], [Approval]; proposed]

### 5.3 Required assertions, including negative cases

1. **Actual package load:** installed version and full SHA match; native manifest validates; enabled inventory has the correct source/path and no load errors; registration probe names all expected tools/hooks/commands/skills. Forge descriptor existence alone fails this assertion.
2. **Orientation:** rendered persisted prompt contains the bounded Forge marker and correct project/issue scope; registered plugin skill is visible through skills_list and skill_view. Explicitly assert it is not mistaken for ordinary available_skills auto-discovery.
3. **Round trip:** local provider deterministically requests a Forge recap tool; actual installed registry dispatch reaches the disposable Kernel store, returning the exact fixture issue and requestId/contextDigest. Parse JSONL and actual receipt, not natural-language “success”.
4. **Deny before effect:** scripted provider requests protected AGENTS.md/.forge write; returned tool result is blocked and file hash unchanged. Include patch, terminal-mediated write, execute_code and MCP mutation paths when exposed, original/effective middleware args, malformed path, symlink/rename-sensitive cases. A denied tool result without unchanged artifact is insufficient.
5. **Failure policy:** plugin pre-tool raise/timeout denies; missing Node, malformed bridge response, expired/unowned issue, wrong cwd/profile, and unavailable Kernel cannot yield success. For shell fallback separately test timeout/spawn/garbage and explicit fail_closed; empty allow output remains native no-directive behavior.
6. **Trust:** disabled plugin cannot register; untrusted project .agents/skills absent; trusted clean skill loads; changed dangerous skill quarantines; scanner error fails closed; capability widening and builtin override do not activate without grants.
7. **MCP:** actual stdio process starts, list_tools shows only selected Forge tools; include/exclude precedence and collision behavior checked; one tool invokes Kernel and round-trips identifiers. Do not substitute static config-file existence.
8. **Lifecycle ownership:** unload/reload removes callbacks/tools/skills without duplicates; timed-out late registration stays abandoned; two profiles/worktrees cannot exchange scope; user config/managed leaves/other plugin registrations survive install/update/remove.
9. **Resume/delegation:** fixture compaction/resume preserves receipt links and proper live tip; child receives explicitly scoped Forge task/context without relying on parent policy injection; background delivery is consumed and cancellation yields a terminal non-success receipt.
10. **Optional channel/cron/UI lanes:** test only when enabled. Cron claim/ESTOP/delivery status, approval bridge, API stop/SSE closure, Desktop disposer/reload/auth and channel acknowledgment each get separate receipts; an unrun lane remains INCOMPLETE/experimental.

These are meaningful installed-path assertions to build, not tests claimed to have passed. The scripted model makes tool use deterministic while the real installed loop, registry, hook, subprocess, and Kernel paths execute. Real-provider/channel/operator proof remains a separate live rung. [proposed/inferred from inspected contracts]

Certification outcomes: PASS only when every required sub-object passes; FAIL when behavior violates a requirement; INCOMPLETE when installation/provider/toolset/approval/channel access is unavailable or a required lane is unrun. Archive denied/partial/error transcripts and cleanup status. Existing Forge help-word/metadata probes cannot substitute for this receipt. [proposed; read: lib/capabilities/probes.js:74-80]

## 6. Best-possible Forge integration design

Everything in this section is **proposed**. No command or file layout here is an existing delivered Forge feature unless §2.10 says so.

### 6.1 Package and install/update paths

Include a native Hermes directory as data inside the existing single npm distribution, for example integrations/hermes/{plugin.yaml,__init__.py,skills/,bridge/}. A tiny standard-library Python shim invokes the installed Node 24 Forge API/CLI bridge with structured stdin/stdout; it does not reimplement Kernel, planner, workflow, or model routing. This respects “one npm package”; Python code inside an npm artifact is not a second published Python package. A shared portable plugin.json/skills/mcp subset may also be generated for reuse, but Hermes native hooks need the shim. [inferred from native packaging and north-star]

A future installer previews source/version/profile/capabilities, stages a versioned owned directory under the selected HERMES_HOME/plugins/forge, registers through native enable/consent, and atomically activates it. It must preserve operator config, explicit disabled state, managed policy, existing memory backend, and project trust choices. Never silently add trusted_project_dirs, enable project Python plugins, accept shell commands, or grant overrides/platform actions. Remove/rollback restores the previous owned directory/config leaves; update compares hashes/capabilities and reconsents to widening. Avoid relying on Windows symlink privileges for the entire install path; canonical skills can be packaged/read-only and referenced through native registry with provenance.

Run a bounded bridge per call first; optimize to an owned local broker only if measured startup cost justifies it, with lifecycle/cancellation cleanup and scoped authorization. Even then, Hermes owns model/tool scheduling and Forge owns building-block state. No model proxy is required.

### 6.2 Surface-by-surface composition

| Surface | Proposed Forge carrier | Native behavior retained / risk |
| --- | --- | --- |
| Orientation | register_system_prompt_section after memory + explicit slash/tool recap | Hermes prompt construction/caching retained; project/chat mapping is explicit; section failure cannot claim verified orientation. |
| Skills/procedures | Namespaced native/plugin skills + trusted canonical project .agents/skills when operator chooses | Hermes scanner and trust retained. Expose namespace via orientation/catalog because plugin skills are outside prompt index. |
| Kernel/tools | Small native register_tool wrappers or common stdio MCP over public Forge contracts | Kernel sole authority; no broad untyped shell-command tool. Select one exposure per capability to avoid duplicates. |
| Gates | Native pre_tool_call calls structured gate adapter on effective args; deny response on unavailable authority for governed mutations | Hermes human approval still applies. Cover all exposed mutation carriers; hook is not a full host sandbox. Shell fallback uses fail_closed and separate consent/proof. |
| Receipts | post_tool_call/API/session/skill/delegation observations + Forge durable run events | Hermes transcript retained; raw unredacted provider payloads never copied into Forge receipts by default. |
| Reference workflow | Optional stage/reviewer/spec skills and bounded delegate_task compositions | Default flat native delegation; explicit issue/lease/tools/context/budget. No fake agent-file projection and no mandatory TDD ladder. |
| Memory | Recall tool/context-reference + bounded declarative prompt section | Builtin memory and external provider retained. Optional dedicated memory provider only on explicit user selection. |
| Compression/resume | Record session/lineage links and re-recap after boundary; use supported checkpoint provider only if chosen | Native compactor retained; no claim that observer hook guarantees checkpoint success. |
| Gateway | Opt-in native slash command + bounded observers/approval bridge | Hermes channels/sessions/auth/delivery retained; explicit project grant; do not install unrestricted HOOK.yaml code as default. |
| Cron | Native script timer invokes a deterministic Forge composition with request envelope | Kernel acquires authority before effect; timer state is not workflow truth; separate execution and delivery receipt. |
| ACP/API/headless | Native CLI JSONL first; later explicit API/ACP adapters | Preserve approval/request handling and cancellation; no generic --mode rpc fiction. |
| UI | Separate optional Desktop/status/receipt contribution, dashboard slots | Core has no UI. Read/write through public Forge APIs with scoped grants; widgets do not directly alter Kernel DB/config internals. |

Proposed bridge request carries requestId, contextDigest, protocolVersion, scope/issue/run/session/profile/cwd, requested capability and arguments, timeout, and cancellation identity. Validate identifiers without regeneration; attach native session/turn/tool-call IDs as additional fields. Responses carry status/result/evidence and cleanup state. The model may carry the identifiers, but the adapter—not model prose—must check the round trip.

### 6.3 Effort, sequencing, and risk

Estimates are engineering judgment in worker-days, not measurements. Assumes existing public Forge block APIs and a common MCP bridge are ready; building those platform foundations is additional work.

| Work | Worker-days | Risk |
| --- | --- | --- |
| Correct inventory, pin parser/schema/contract fixtures, regenerate matrix evidence | 1–2 | Low/medium; truthful upstream versus delivered-adapter distinction. |
| Pack/install/update/rollback native shim with profiles/consent and one npm artifact | 2–3 | Medium; Windows locks, provenance, global/profile state. |
| Orientation, explicit skill catalog, commands, bounded tool bridge | 2–3 | Medium; scope resolution, cache/stale orientation, process cost. |
| Complete mutation gate coverage and installed Linux/Windows proof | 3–5 | High; fail-closed behavior across native/MCP/terminal/execute_code, approvals. |
| Receipt/lifecycle/delegation/resume integration | 2–3 | Medium/high; cancellation, concurrency, child scope, compaction lineage. |
| Optional gateway/cron composition | 2–4 | Medium/high; auth/private context/delivery and duplicate execution. |
| Optional Desktop visualization | 2–3 | Medium; SDK churn and trusted renderer authority. |
| Portable shared subset polish/catalog submission | 1–2 | Medium; names, source pinning, review/capability widening. |

Core native integration is roughly **10–16 worker-days** combining inventory, packaging, core surface, gates/proof, and receipts; optional messaging/UI/catalog add scope. Some lanes overlap, but worker-days are not elapsed-time promises. P7’s 1–2 days is plausible only for a narrow config/projection increment, not a certified proper plugin with negative tests. Ship core experimentally first, then promote after required installed receipts; keep optional lanes separately certified.

## 7. Keeping current

Official signals: [release list][Release history], [release Atom feed][Release feed], [main commits][Commit feed], official docs, and changes to the cited manifest/dispatch/middleware/skill/approval/MCP/session/CLI modules. Third-party-product plugins should distribute independently rather than merge into Hermes core; curated catalog submission is a discovery channel, not a substitute for Forge’s source/artifact provenance. [external: release sources; docs: [Plugin developer guide]]

Trigger a plugin contract/proof update when:

- VALID_HOOKS/VALID_MIDDLEWARE or payload/return/deadline/failure semantics change.
- Native/portable manifest version, capability grants, dependency/load/cleanup behavior, namespace/override rules change.
- Skill trust/discovery/scanner/registered-skill exposure changes.
- Approval context, oneshot/query flags, output event/exit shape, provider configuration or safe-mode behavior changes.
- MCP transport/protocol/auth/tool filtering/environment/merge behavior changes.
- Session schema/compression lineage/checkpoint rules change.
- Gateway API/client request negotiation, channel delivery/cron claims, Windows subprocess containment, or Desktop SDK/disposer behavior changes.

Proposed maintenance: pin a certified stable baseline; run canary source-contract checks on main separately; consume release-feed events; compare parsed registries/signatures/schemas; rerun L2 when relevant surfaces change. Release cadence is rapid in the observed sample, so use compatibility ranges only with explicit tested ceilings and never auto-promote a new main build from metadata alone.

## Bottom line: delivery recommendation

1. Build a proper native Hermes plugin now; the extension system is already sufficient. [inferred]
2. Carry the Python shim as data in the existing npm artifact. [proposed]
3. Reuse portable skills/MCP where useful, while keeping native hook registration. [proposed]
4. Expose Forge’s APIs and configurable blocks, not a mandatory reference workflow. [proposed]
5. Make orientation bounded and issue state refresh explicit. [proposed]
6. Preserve native skill trust/scanning, approvals, model loop, memory, and sessions. [proposed]
7. Deny governed mutations on missing authority and prove every exposed carrier. [proposed]
8. Use ordinary query JSONL for L2; oneshot and safe-mode are unsuitable plugin proof defaults. [external: [Single query], [One shot]]
9. Stage gateway, cron, and visualization as separately certified opt-in compositions. [proposed]
10. Call current source capability verified, current Forge projection inspected, and installed Hermes certification unrun. [evidence boundary]

## Corrections to P7

1. **Lines 153 / event inventory:** replace “27 events” with the pinned 41-name inventory plus four distinct middleware kinds; source-version the number rather than hardcode it indefinitely.
2. **Line 153 / package format:** add portable Agent Plugins plugin.json support, manifest v2 fields, real version gate, bounded load, owned cleanup, and provider/context-reference/prompt-section surfaces. Python is not mandatory for a skills+MCP package.
3. **Line 154 / trust wording:** capability declarations are not grants or sandboxing; exact sensitive APIs need grants, enabled Python remains trusted in-process code, and gateway drop-ins have separate placement trust.
4. **Line 155 / skills:** project trust is necessary but content scanning/quarantine is another gate. Registered plugin skills are not ordinary available_skills prompt entries; expose their namespace explicitly.
5. **Line 157 / context:** describe selected dialect plus root→cwd AGENTS inheritance with per-directory override; SOUL independent and dynamic cap. Do not flatten it into one cwd first-file list.
6. **Line 158 / hooks:** split Python lifecycle/middleware, config shell scripts, and gateway HOOK.yaml; distinguish observation, actual directives, consent, default failure policy, and timeouts.
7. **Line 159 / delegation:** keep “no identified agent-file contract”, but add real spawn/list/steer/stop, explicit depth/budgets/worktrees/background behavior and omission of parent context/memory.
8. **Line 161 / Forge today:** retain descriptor/projection/CLI/global-hooks inventory, add actual tool_input/block compatibility and proof limits. Mark false MCP/permission/sandbox claims as upstream-versus-adapter confusion.
9. **Line 163 / one-package rationale:** retract “Python artifact strains one npm package” as a hard blocker. Embed the small native Python shim in the one artifact; portable route is also available. A separate PyPI package is unnecessary.
10. **Line 163 / effort and low risk:** scope 1–2 days to narrow config work; full native integration/proof estimate is 10–16 worker-days with high gate/approval coverage risk.
11. **Surface table / headless:** add ordinary query stream-json, TUI gateway JSON-RPC, HTTP/SSE runs, embedding, and the oneshot auto-approval trap; do not invent --base-url/--mode rpc.
12. **Surface table / MCP:** native supports SSE fallback, while portable manifest subset rejects SSE. Record this difference.
13. **Certification row at line 231:** “supported” descriptor is not L2 proof. Keep Hermes experimental/unverified for the new integration until installed Linux/native-Windows required lanes pass.
14. **Missing native opportunity:** add bounded system-prompt sections, context references, script-only cron, gateway approval/delivery, and separate Desktop/dashboard SDKs as optional compositions; avoid building them into core UI/authority.

These are research corrections recorded here only; P7 and code were not edited. [read: P7 cited lines; external: sections above]

## Open questions for the owner

**Packaging:** A — embed the native Python shim in the one npm artifact; B — portable skills+MCP plus separately consented shell hooks; C — keep only legacy projections/CLI. **Default A.** It satisfies the native-plugin direction, exposes the strongest useful contracts, and avoids another published package. B is a useful fallback with more split consent/coverage work; C leaves the native advantage unused. [proposed]

**Certification:** A — experimental until installed stable Linux/native-Windows core receipts pass; B — certify Linux first and explicitly keep Windows experimental; C — research-only, defer release support. **Default A.** The user’s Windows environment and approval/subprocess differences justify both core lanes; a package metadata label cannot supply either proof. [proposed]

**Gateway/cron/UI timing:** A — opt-in compositions after core plugin/gate proof; B — include gateway/cron with the first core cut and keep UI later; C — defer all three to a later release. **Default A.** It preserves exposure opportunities without coupling the initial certified path to credentials, delivery, timer recovery, and UI churn. [proposed]

**Memory:** A — recall tool plus bounded prompt/context reference, preserving the current provider; B — optional dedicated Forge memory provider with checkpoint proof; C — CLI-only recall. **Default A.** It avoids taking the single external-provider slot and serves agents through native explicit retrieval. [proposed]

Valid replies are the labels for each named question, a combination, or silence adopting the stated defaults. The defaults are planning recommendations, not authorization to implement.

## Confidence

**High on inspected source contracts and current Forge inventory; medium on end-to-end integration feasibility; unverified on installed/live behavior.** Actual loop, registry, plugin loader/manifest/dispatch, shell/gateway hooks, skill trust, memory, compaction, state/resume, delegation, MCP transport/exposure, cron admission/scripts, approvals/terminal backends, headless parser/single-query path, and Desktop types/loader were read. Docs supplement messaging/API/UI/catalog contracts. The existing Forge adapter fixture passed. No Hermes L2/live tests, real OAuth/channel/cron delivery, full HTTP cancellation/idempotency trace, or UI reload proof ran. Estimates and designs remain proposed.

### Primary-source index

All sources retrieved 2026-10-01. Source links below pin 233434b414476e5f1ed0f6836922128e74d7d2f4 unless labeled release/docs-feed. Inline section references provide the relevant source lines; payload catalog is documentation and is explicitly distinguished from caller/dispatcher source.

[Source pin]: https://github.com/NousResearch/hermes-agent/commit/233434b414476e5f1ed0f6836922128e74d7d2f4
[Release]: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24
[Release history]: https://github.com/NousResearch/hermes-agent/releases
[Release feed]: https://github.com/NousResearch/hermes-agent/releases.atom
[Commit feed]: https://github.com/NousResearch/hermes-agent/commits/main/
[Agent loop]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/conversation_loop.py
[Agent initialization]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/agent_init.py
[Tool round]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/turn_tool_round.py
[Tool execution]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/tool_executor.py
[System prompt]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/system_prompt.py
[Prompt builder]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/prompt_builder.py
[Memory tool]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/memory_tool.py
[Memory store]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/memory_tool_store.py
[Memory manager]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/memory_manager.py
[Compression]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/conversation_compression.py
[Context compaction]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/turn_context_compaction.py
[Turn context]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/turn_context.py
[State]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_state.py
[State messages]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_state_messages.py
[Config]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/config.py
[Manifest]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugins_manifest.py
[Discovery]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugins_discovery.py
[Loader]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugins_loader.py
[Portable]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/agent_plugins.py
[Plugin API]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugins.py
[Capability consent]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugin_capabilities.py
[Middleware]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/middleware.py
[Hook dispatch]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugins_dispatch.py
[Hooks reference]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/features/hooks.md
[Shell hooks]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/shell_hooks.py
[Gateway hooks]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/hooks.py
[Gateway startup]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/run_startup.py
[Gateway turn]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/run_turn.py
[Gateway runner]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/run_turn_runner.py
[Gateway session commands]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/slash_commands_session.py
[Gateway inbound]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/run_inbound.py
[Gateway adapters]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/gateway/run_adapters.py
[Skills trust]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/agent/skill_utils.py
[Tool registry]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/registry.py
[Model tools]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/model_tools.py
[Toolsets]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/toolsets.py
[Delegation]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/delegate_tool.py
[Delegation config]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/delegate_tool_config.py
[Approval]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/approval.py
[Terminal scope]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/terminal_scope.py
[Terminal config]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/terminal_tool_config.py
[Terminal backends]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/terminal_tool_backends.py
[MCP transport]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/mcp_tool_transport.py
[MCP config]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/mcp_tool_config.py
[MCP registration]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tools/mcp_tool_registration.py
[MCP guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/features/mcp.md
[CLI parser]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/_parser.py
[Single query]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/cli_single_query.py
[Stream JSON]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/stream_json.py
[One shot]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/oneshot.py
[Programmatic]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/developer-guide/programmatic-integration.md
[Single-query approval tests]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tests/tools/test_single_query_approval_mode.py
[Mock provider config]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/tests-js/scripts/mock-provider-config.ts
[Plugin parser]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/subcommands/plugins.py
[Plugin validation]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/hermes_cli/plugin_validate.py
[Messaging]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/messaging/index.md
[Cron guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/features/cron.md
[Cron tick]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/cron/scheduler_tick.py
[Cron preflight]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/cron/scheduler_preflight.py
[Cron scripts]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/cron/scheduler_script.py
[Desktop guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/developer-guide/desktop-plugin-sdk.md
[Desktop types]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/apps/desktop/src/contrib/plugin.ts
[Desktop SDK source]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/apps/desktop/src/sdk/index.ts
[Desktop loader]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/apps/desktop/src/contrib/runtime-loader.ts
[Desktop bundled loader]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/apps/desktop/src/contrib/plugins.ts
[Dashboard guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/features/extending-the-dashboard.md
[Skins guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/features/skins.md
[Windows native]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/windows-native.md
[Windows WSL]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/user-guide/windows-wsl-quickstart.md
[September state patch]: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.11
[MCP migration release]: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.16.2
[Plugin developer guide]: https://github.com/NousResearch/hermes-agent/blob/233434b414476e5f1ed0f6836922128e74d7d2f4/website/docs/developer-guide/plugins/index.md

