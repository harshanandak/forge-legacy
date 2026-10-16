Decisions needed: none for this research phase. Owner choices at the end have defaults.

# OpenCode deep dive for Forge

## Bottom line

1. Use the official Anomaly repository and pin OpenCode 1.18.34; stable and v2 plugin APIs are distinct.
2. P7's npm subpath candidate is unsupported by the inspected loader; use the package's ./server entrypoint.
3. An awaited tool.execute.before hook blocks execution by throwing; returning a deny object does nothing.
4. Mutate existing arguments in place; replacing output.args is ignored by the inspected call sites.
5. Bus events observe activity asynchronously; session.created is not an awaited orientation barrier.
6. Native .agents/skills and AGENTS.md already carry procedures; executable authority belongs in Forge APIs.
7. OpenCode exposes a real TUI plugin API with routes, slots, keymaps and scoped cleanup.
8. Permissions are tool policy, not a sandbox for plugin code; loader failures can leave enforcement absent.
9. Certify actual packed artifacts with deterministic headless tests, including MCP, child sessions and Windows paths.
10. Keep the release tier experimental until installed-version proof passes; all integration work here is proposed.

These findings are supported below by pinned source, with proposed work and unrun proof clearly separated.

## Research identity and evidence boundary

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-deep-opencode-20261001",
  "contextDigest": "59791b8c919c61052ded17eada62e36d304e288d5ae486f5ed2c662fa16ac053",
  "context": { "summary": "Forge harness deep dive: OpenCode." },
  "flowSpec": null,
  "cwd": ".",
  "policy": { "write": true, "tools": [], "maxCostUsd": null },
  "route": { "model": "gpt-6.1-sol", "thinking": "xhigh", "search": true }
}
```

Research date: **2026-10-01**. The former sst/opencode URL redirects to anomalyco/opencode. The latest published release observed was **v1.18.34**, published **2026-09-30T22:39:45Z**, at commit **aec0b9a6d8898f68f923aaf08b7306d931fd9d76**. All source references below use that commit; all [external] sources were accessed on 2026-10-01. The GitHub recursive tree was complete, and **76 source blobs were checked against that tree and matched** its blob SHAs. [external: [repository](https://github.com/anomalyco/opencode), [release](https://github.com/anomalyco/opencode/releases/tag/v1.18.34), [pinned tree](https://api.github.com/repos/anomalyco/opencode/git/trees/v1.18.34?recursive=1)] [ran: connector response processing and blob-to-tree comparison]

**Evidence level:** source and official documentation are rung 2; explicit execution-path reasoning is rung 3. Fetching and comparing source is not running OpenCode. No installed OpenCode process, Forge plugin, model call, TUI or L2/L3 conformance test was run. The CI recipe is a proposal, not a passing receipt. No Git, GitHub or Kernel state was changed; no browser or context-mode tool was used. One early shell source-fetch attempt was blocked by a context-mode guard; primary-source retrieval continued through the web and read-only GitHub connector. [ran: research tool results]

The brief and common rules were read from (local scratch). Forge's direction remains one npm package, Kernel authority, configurable building blocks and native harness complements. The reference workflow is an optional solution, not a compulsory OpenCode mode. This dossier corrects P7 without editing it or implementing an adapter. [read: docs/work/2026-09-30-forge-final-plan/north-star.md:11-28; platform/P7-harness-plugins.md:129-153]

## 1. Architecture

### 1.1 Loop, execution and termination

The stable session runner is an Effect-based outer loop. It reads compacted history, identifies the latest user and assistant messages, handles queued subtask or compaction parts, checks context overflow, resolves the agent/model and tool catalog, streams one model step, persists results, and repeats. It exits on a finished answer without outstanding model tool calls, processor stop/error, cancellation or completed structured output. A provider reporting stop while still returning tool calls does not by itself finish the session. [external: source][loop]

The processor maintains pending/running/completed/error tool parts, text and reasoning streams, snapshots, usage, retry and compaction state. Three identical recent tool calls trigger the doom_loop permission check. A normal plugin Error becomes a failed tool part; permission or question rejection receives different stop handling. Thus **blocking one tool call does not necessarily stop the model from trying another tool**. [external: source][processor]

The default LLM path supplies executable tools to AI SDK streamText; an opt-in native LLM adapter and GitLab workflow executor are additional paths. There is no single Forge-controlled dispatcher. OpenCode's outer conversation loop is sequential; tool execution is delegated to the model runtime, so Forge must tolerate overlapping tool invocations and correlate session, message and call identities. No fixed global tool-parallelism ceiling was established in this review. [external: source][llm] [inferred: concurrency requirement from delegated executable tools]

The steps setting is **not a proven hard budget**: at the threshold, the inspected loop appends MAX_STEPS_PROMPT while still passing tools and without forcing toolChoice to none. A model may disregard the prompt. Forge budgets and irreversible action gates must be enforced by the relevant block, independently of this advisory stopping behavior. [external: source][loop] [inferred, rung 3: threshold-to-processor trace]

### 1.2 Context, compaction and memory

System assembly combines an agent prompt or model-specific provider prompt, environment, discovered instructions, skill guidance, MCP instructions and user system text. The system transform runs before model dispatch; chat parameters and headers are separately mutable. Provider-specific conversion can change message shape and caching behavior. Keep orientation short and preserve native provider prompts rather than replacing them. [external: source][request]

Compaction uses a dedicated agent and persists summary/compaction parts, with recent-turn retention and tool-output pruning. The inspected implementation protects skill outputs from pruning and supports context additions, a replacement compaction prompt and an auto-continue switch. These are different mechanisms: output.prompt replaces the default summary prompt, and output.context then does not contribute. Forge can append issue identity and receipt references without becoming the conversation-memory authority. [external: source][compaction]

Instruction discovery checks global OpenCode AGENTS.md, with a Claude global fallback, then project AGENTS.md, CLAUDE.md and deprecated CONTEXT.md families, plus configured instruction paths/globs/URLs. The first matching filename family wins; do not assume OpenCode stacks all instruction formats. Additional path-relevant instructions can be attached when files are read, with per-message duplicate suppression. Remote instruction fetch failures degrade to empty content after a five-second request timeout. These are prompt inputs, not enforceable policy. [external: source][instructions]

OpenCode session memory is conversation storage and summary history. Forge Memory recall is a separate proposed capability delivered through tools or bounded context injection; the inspected native instruction mechanisms do not establish Forge-style durable cross-issue authority. [external: source][instructions] [inferred]

### 1.3 Persistence and resume

Sessions store project/directory/workspace, parent relationships, agent/model, permissions, metadata and timestamps; messages and parts are persisted separately. Fork copies history while remapping message identities. task_id resumes a child session. Use OpenCode IDs to link a Forge run, but retain requestId, contextDigest, issue/lease and receipt identities explicitly in Forge state; a native session is not a Forge lease. [external: source][session] [external: child execution][task] [inferred: identity mapping]

Storage uses SQLite with WAL, foreign keys and migrations. The default database is in the XDG data directory as opencode.db for release channels, with channel-specific names otherwise; OPENCODE_DB can select another database. Config/cache/state/data and temporary directories are distinct. Resume and proof tests must isolate all of them, not just the project cwd. [external: source][database] [external: paths][global]

### 1.4 Configuration and providers

Configuration merges, from lower to higher precedence: authenticated well-known remote defaults; global config; an explicit OPENCODE_CONFIG file; project config; discovered .opencode/config directories and their agents/commands/plugins; inline OPENCODE_CONFIG_CONTENT; active organization config; managed config/MDM. OPENCODE_PERMISSION applies a late permission override. Project loading can be disabled. Global files include config.json, opencode.json and opencode.jsonc; instructions deduplicate/append, while plugin origins are separately merged by identity. Do not describe every array as last-file replacement. [external: source][config]

Relative plugin paths resolve against the declaring config file. Plugin deduplication walks declarations backwards, keeps the last declaration for an npm package identity or exact file URL, and preserves its origin/scope. Local discovery accepts both plugin/ and plugins/ with immediate .ts/.js entries and symlinks. A file export and an npm declaration can still represent the same code without being the same deduplication key. [external: source][configplugin]

Provider/model selection remains native: provider IDs, model IDs, model variants, provider options, auth and request adapters are OpenCode concerns. The plugin API includes auth and model-catalog contributions; v2 has additional catalog and AI SDK interception domains. Forge should compose operator routing choices, not replace this provider layer. [external: stable API][hooks] [external: v2 API][v2ctx] [inferred]

Experimental provider policies use effect/action/resource statements, wildcard resources, last-match behavior and **global priority over project rules**. The documented action is provider.use. This is distinct from per-tool permissions; a project cannot be relied on to re-enable a globally denied provider. [external: official policy specification][policies]

## 2. Extension surfaces and exact contracts

### 2.1 Stable server plugins, package loading and P7's subpath question

There is no required plugin.json manifest for a stable server plugin. Configuration is:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "package-name@1.2.3",
    ["another-package@2.0.0", { "profile": "example" }]
  ]
}
```

Each entry is a string or a two-item [specifier, options-object] tuple. Local project/global plugin files are discovered under .opencode/{plugin,plugins}/ and the global OpenCode config directory's equivalent directories. Relative paths, absolute paths, file URLs and index-bearing directories have explicit handling. [external: config discovery][configplugin] [external: entry resolution][entry]

The current loader recognizes a default object with id and server(input, options), or legacy function exports. The structured form requires an id for path plugins and derives it from the package name for npm plugins when absent. Legacy modules are inspected across **all exported values**: exporting an unrelated constant/helper can break their shape validation. Keep the adapter module narrowly exported. Plugin input supplies project, directory, worktree, SDK client, serverUrl, experimental_workspace.register and Bun $ when available. Do not assume $ exists in a Node-hosted process. [external: initialization][plugins] [external: API types][hooks]

**P7 resolution: arbitrary npm export subpaths are not implemented by this loader.** A non-path specifier goes to Npm.add as an installation spec, returns a package directory, then resolves exports["./server"] or main. It never splits package-name/opencode into a package plus requested subpath. An unscoped slash string can have npm/Git shorthand meaning; a scoped name's slash is its package namespace, not an extension selector. This is source-level resolution, not an installed rejection transcript. [external: entry resolution][entry] [external: installer][npm] [inferred, rung 3]

**Proposed one-package answer:** add a dedicated "./server" export inside forge-workflow and configure "forge-workflow@<exact-version>". Keep Forge's root API intact. Optional TUI code uses a separate "./tui" export. A small project-local shim importing forge-workflow/opencode remains a fallback for older loaders or conflicting entrypoint ownership; the npm plugin configuration itself must not use that arbitrary subpath. Package entries are containment-checked, and npm packages can declare engines.opencode. File plugins skip that compatibility check. [external: source][entry] [inferred: proposed packaging]

Dependency resolution/import can occur in parallel, but successful initialization and trigger hooks run in deterministic registration order. Built-in auth plugins precede configured external plugins. External resolution/import errors are reported and skipped; initializer and config-hook failures are caught/logged. Dependencies are awaited before external server loading. Failed dynamic imports are cached for the process; retry is limited to a particular pre-import local dependency readiness failure. [external: loader][loader] [external: initialization][plugins]

**Correction to P7's Bun-install claim:** the pinned Npm service uses @npmcli/arborist, version/spec-specific cache directories and a filesystem lock; it sets ignoreScripts: true. This reduces install-script execution but does not sandbox imported plugin code. The old single ~/.cache/opencode/node_modules description is not a reliable layout contract. [external: source][npm]

**Trust and failure model:** following the actual import-to-initializer path shows no interactive code-approval barrier before a configured server plugin executes. Code runs in-process and can perform its own filesystem/network/process operations. Tools' permissions do not constrain those arbitrary side effects. A failed plugin can leave the harness operational without its gate. Forge must expose registration health and require positive gate proof before claiming a governed run. Pure mode suppresses external plugins. [external: loader path][loader] [external: runtime][plugins] [inferred, rung 3]


**Provider/auth registration contracts:** auth is an AuthHook object, not a bus hook. It has provider:string, optional loader(auth:()=>Promise<Auth>, provider:Provider):Promise<Record<string,any>>, and methods:[...]. Each method is either {type:"oauth",label,prompts?,authorize(inputs?):Promise<AuthOAuthResult>} or {type:"api",label,prompts?,authorize?(inputs?):Promise<success-or-failed>}. API success is {type:"success",key,provider?,metadata?:Record<string,string>}; failure is {type:"failed"}. Prompts are text {type,key,message,placeholder?,validate?} or select {type,key,message,options:[{label,value,hint?}]}; both accept when:{key,op:"eq"|"neq",value}, with deprecated condition(inputs) support. These fields are credential schemas, not example credential values. [external: exact declarations][hooks]

OAuth authorize returns {url,instructions,method:"auto",callback()} or {url,instructions,method:"code",callback(code)}. The callback resolves to failure or {type:"success",provider?,...} carrying either {refresh,access,expires,accountId?,enterpriseUrl?} or {key,metadata?}. The separate provider hook is {id:string,models?(provider:ProviderV2,ctx:{auth?:Auth}):Promise<Record<string,ModelV2>>}. These are native provider-extension surfaces; a Forge workflow adapter should not duplicate provider login or hold those credentials. [external: exact declarations][hooks] [inferred; proposed]

### 2.2 Awaited hooks: complete stable API

All two-argument trigger handlers return Promise<void>. **Their result values are ignored; mutations to the supplied output are the contract.** Trigger dispatch is sequential and has no general hook timeout in the inspected dispatcher; throwing/rejecting propagates. A plugin must enforce its own bounded API waits. [external: dispatcher][plugins]

In the following table, S=sessionID, C=callID, M=messageID, P=partID; optional fields are marked ?. Types named Model, UserMessage, Part, Message and ProviderContext mean the pinned API types, not arbitrary JSON. [external: complete hook type definitions][hooks]

| Hook / member | Input | Mutable output / effect |
| --- | --- | --- |
| chat.message | {sessionID, agent?, model?:{providerID,modelID}, messageID?, variant?} | {message:UserMessage, parts:Part[]} before user-message persistence |
| chat.params | {sessionID, agent, model:Model, provider:ProviderContext, message:UserMessage} | {temperature:number, topP:number, topK:number, maxOutputTokens:number-or-undefined, options:Record} |
| chat.headers | same input as chat.params | {headers:Record<string,string>} |
| permission.ask | Permission (legacy SDK type) | {status:"ask"-or-"deny"-or-"allow"}; **typed but not called by the inspected stable permission service** |
| command.execute.before | {command, sessionID, arguments} | {parts:Part[]}; command shell substitutions have already run |
| tool.execute.before | {tool, sessionID, callID} | {args:any}; await/throw barrier before normal tool execution |
| shell.env | {cwd, sessionID?, callID?} | {env:Record<string,string>} |
| tool.execute.after | {tool, sessionID, callID, args} | {title, output, metadata}; see MCP mismatch below |
| experimental.chat.messages.transform | {} | {messages:Array<{info:Message,parts:Part[]}>} |
| experimental.chat.system.transform | {sessionID?, model:Model} | {system:string[]} |
| experimental.provider.small_model | {provider:ProviderV2} | {model?:ModelV2} |
| experimental.session.compacting | {sessionID} | {context:string[], prompt?:string} |
| experimental.compaction.autocontinue | {sessionID, agent, model, provider, message, overflow} | {enabled:boolean} |
| experimental.text.complete | {sessionID, messageID, partID} | {text:string} |
| tool.definition | {toolID} | {description, parameters:any}; registry also has internal JSON-schema handling |
| event | {event:Event} | Promise<void>; notification callback, not a blocking trigger |
| config | resolved Config | mutate configuration; errors are logged/ignored |
| dispose | no arguments | async cleanup on instance teardown; errors are logged/ignored |
| tool | name-to-ToolDefinition map | register custom tools |
| auth | AuthHook | provider-specific auth registration |
| provider | ProviderHook | provider-specific model contribution |

Hook timing matters. Ordinary built-in/custom tools run before-hook → execute → after-hook. Direct MCP tools run before-hook → native permission request → remote execute → after-hook → content normalization. In the MCP path, after receives a raw MCP result (content and related fields), **not necessarily** the title/output/metadata shape advertised in Hooks. Normalize by shape and never assume one typed result covers every tool. [external: actual tool wrappers][tools]

**Exactly how denial works:** throw an Error or reject the before hook's Promise. The awaited trigger prevents the subsequent execute call from being reached. Returning false, {deny:true}, or a Claude-shaped permissionDecision has no dispatch meaning. An after hook can fail/report/redact a completed result but cannot undo the tool's side effects. A bus listener is not a substitute for this barrier. [external: actual wrapper][tools] [external: trigger implementation][plugins] [inferred, rung 3]

**Exactly how rewriting works:** mutate properties of output.args. The inspected callers create {args}, await trigger, discard its returned wrapper and then call execute(args). Reassigning output.args to a new object therefore does not replace the executed argument reference. The same caution applies to replacement of parts/messages wrappers: check the caller rather than assuming every output-field assignment is consumed. [external: actual wrapper][tools] [external: prompt call sites][loop] [inferred, rung 3]

**Coverage boundaries:** ordinary registry tools, direct MCP tools, MCP resource tools and explicit subtask handling have before calls. The user shell route invokes shell.env, not this pre-tool barrier. Command-template shell snippets execute before command.execute.before and use their own process path. Experimental code-mode/provider-executed tools require separate proof; do not advertise universal interception. [external: tool wrappers][tools] [external: shell/command execution][loop]

The permission service evaluates rules and publishes permission.asked/replied; its full inspected implementation contains no plugin trigger for permission.ask. The type is therefore insufficient evidence for a working permission interception API. Forge should use before-tool denial and native permission configuration, with policy checks also inside Forge's own tool implementation. [external: runtime](https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/permission/index.ts) [inferred, rung 3]

### 2.3 Event subscriptions and payloads

The plugin listener forwards the bus envelope as {event:{id,type,properties}}. It filters by the initialized directory and invokes event handlers without awaiting their returned Promises. Observers may overlap, and the dispatcher does not provide a universal rejection catcher for their async work. Handle errors within the callback. session.created is useful for logging/linking, but cannot guarantee that orientation completes before the first model request. [external: event dispatch][plugins]

**SDK drift is material:** the root plugin types import the older SDK Event union, while runtime forwarding casts the current envelope. The pinned sdk/v2 generated types describe permission.asked using id/permission/patterns/always/tool and replies using requestID/reply; sdk/v1 still describes permission.updated and permissionID/response. message.part.updated also differs (v2 time and sessionID versus old delta?). Use a tested runtime normalizer and retain the raw payload; do not trust the old compile-time union as the complete runtime catalogue. [external: older SDK][sdkv1] [external: current generated API][sdkv2]

The exact **89 distinct event discriminators** declared in the pinned SDK v2 are enumerated in Appendix A with their properties schemas. Duplicate TUI declarations were collapsed by discriminator. This is a schema catalogue, not a promise that all events reach a legacy plugin instance: location filtering, execution family and transport matter. Hooks such as tool.execute.before and shell.env are not interchangeable with these bus events. [external: SDK type catalogue][sdkv2] [ran: discriminator extraction]

### 2.4 Custom tools

A tool definition contains description, a Zod raw-shape args map and async execute(args, context). It returns a string or {output,title?,metadata?,attachments?}; attachments are file parts with mime/url/filename?. Context supplies sessionID, messageID, agent, directory, worktree, abort, metadata(...) and awaited ask({permission,patterns,always,metadata}). Prefer directory/worktree over process.cwd(), especially in a multi-instance server. [external: exact contract][tooltype]

Local discovery accepts {tool,tools}/*.js|ts in config directories and symlinks. The filename names a default export; additional exports become filename_export. Plugin tool maps join the registry, and a later custom tool can take a built-in's model-visible name. The registry validates/normalizes argument definitions, bridges permission asks to Promises, truncates output and records an outputPath. No plugin-specific execution deadline was established. A tool's own side effects must request permission or enforce its own policy; there is no filesystem sandbox around execute. [external: source][registry] [inferred: trust boundary]

For Forge, use a forge_ namespace and shared public API handlers. Optional MCP exposure should call the same handlers rather than fork Kernel semantics. Overriding read/write/bash is unnecessary and increases coverage risk. [inferred; proposed]

### 2.5 Agents, subagents and modes

Agents are configured under agent in JSON or markdown in project/global {agent,agents}/**/*.md. Frontmatter becomes agent configuration, the body becomes prompt, and file-derived names identify the agent. Legacy {mode,modes}/*.md files are still loaded as primary agents. Mode values are primary, subagent and all; omission defaults to all. [external: source][agentload] [external: official agent guide][agentdocs]

Exact recognized options include model, variant, temperature, top_p, prompt, tools (deprecated), disable, description, mode, hidden, options, color, steps, maxSteps (deprecated) and permission. Unknown provider options are folded into options. Color is a six-digit hex string or one of primary/secondary/accent/success/warning/error/info. Project configuration can change permission defaults, so a native label such as plan is not proof of a fixed safety posture. [external: schema][agentschema]

Build/Plan are primary agents; General/Explore/Scout are subagents; hidden compaction/title/summary agents serve internal work. The inspected Plan implementation denies edits except plan-document locations, while its global user permission overlay can override defaults. The docs describe broader ask behavior; source takes precedence for this pin. Hidden affects autocomplete visibility, not authority. [external: definitions][agents] [external: docs][agentdocs]

The task tool validates/chooses an agent, checks task permission unless a user-invoked bypass applies, creates or resumes a child session, sets parentID, derives child permissions and returns a resumable task_id. Default subagent_depth is 1: do not presume unlimited nested orchestration. Failures can preserve task_id, and cancellation is linked to child execution. Children are isolated native conversations, not independent Forge issue owners unless explicitly assigned. [external: source][task] [inferred: authority boundary]

**Proposed reviewers:** scoped spec/quality/research agents with read-only native permission profiles, issue/plan identity in the prompt and an explicit evidence contract. Model choice remains operator config. Permission.task restricts model delegation; user @ invocation is a different path, so it is not an absolute human-invocation allowlist. [external: task guide][agentdocs] [inferred]

### 2.6 Commands, rules and skills

Commands live in command JSON configuration or project/global {command,commands}/**/*.md, with template, description, agent, model and subtask. Malformed command schema throws a config error; markdown parse failures are skipped. $ARGUMENTS, positional $1/$2/etc., file @ references and shell-output substitutions are supported. The last positional placeholder consumes remaining arguments; arguments append to the template when no placeholder is present. Subagent commands normally fork a task; subtask:true can force it even for a primary agent. [external: source][commands] [external: guide][commanddocs] [external: expansion][loop]

Command names are native UX. **Proposed** forge-recap/forge-status commands should be namespaced and should not replace built-ins. Avoid shell substitutions for governance: their execution precedes the command hook. Inject data through the shared API or an awaited prompt/system hook instead. [external: expansion][loop] [inferred]

Skills are SKILL.md files discovered from .agents/skills, .claude/skills and .opencode/{skill,skills}, with global counterparts, directory ascent bounded by the worktree, symlink scanning, explicit skills.paths and fetched skills.urls. The catalog advertises names/descriptions; the native skill tool loads bodies on demand. permission.skill controls access and denied entries disappear from model-visible availability. [external: discovery][skills] [external: official guide](https://opencode.ai/docs/skills/) [external: command integration][commandindex]

**Docs/source difference:** docs require name, description, directory/name agreement, lowercase hyphen names and length limits. The inspected legacy loader only requires a string name and optional string description, warns then overwrites duplicate names, and does not enforce those documented name/length constraints. Forge should conform to the stricter portable format itself. Unknown frontmatter such as Forge invocation metadata cannot be treated as native execution enforcement. [external: parser][skills] [external: documented format](https://opencode.ai/docs/skills/) [inferred]

AGENTS.md and instruction files remain native prompt guidance. Forge should keep one canonical .agents/skills tree, validate unique names and use explicit invocation/permissions for critical workflows. Native discovery is available at source level; it has not been demonstrated with this project's packed artifact in an installed harness. [external: discovery][skills] [read: north-star.md:24-28] [inferred]

### 2.7 MCP, permissions and additional configuration surfaces

MCP's local schema is {type:"local", command:string[], cwd?, environment?, enabled?, timeout?}; remote is {type:"remote", url, headers?, enabled?, oauth?:false-or-object, timeout?}. OAuth options include clientId/clientSecret/scope/callbackPort/redirectUri; automatic discovery and DCR are available. Local launches inherit the host environment with configured overrides. Relative cwd uses the workspace. Remote connection attempts use Streamable HTTP, then SSE; clients have connection/disconnection cleanup. [external: schema][mcpschema] [external: transports][mcp]

**Timeout mismatch:** schema descriptions say five seconds, but the pinned implementation's DEFAULT_TIMEOUT is 30,000 ms for connection establishment. Request timing has its own resolution. Set explicit connection/request budgets in conformance fixtures rather than copying a descriptive default into Forge guarantees. Namespaced MCP tools, resources, resource templates and prompts are exposed; resource results may be truncated or transformed into attachments. [external: implementation][mcp] [external: resource/tool wrappers][tools]

Native allow/ask/deny permissions evaluate tool/action and resource/command patterns; last matching rule wins. Explicit deny rejects, allow proceeds, ask publishes a pending request and suspends until reply. Replies are once/always/reject; the inspected always approvals are held in instance state. Native defaults and agent/session overrides determine the final behavior. Treat permissions as host policy, never a sandbox around arbitrary plugin code or an immutable Forge lease. [external: implementation](https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/permission/index.ts) [external: request/reply schema][permissionschema]

MCP exposure controls should use current permission names/patterns, agent restrictions and enabled:false; older boolean tools configuration is deprecated. Broad tool catalogs increase model context and collision risk. **Proposed** a minimal Forge MCP profile should expose issues/recap, gate status and memory first, with writes explicitly permissioned. [external: current agent schema][agentschema] [external: MCP availability][mcp] [inferred]

Other native surfaces worth preserving are configurable formatters and LSP, themes/keymaps, provider policies and references. References map aliases to local paths or repository/branch definitions, plus description/hidden; described references enter agent context and autocomplete, and their directories are allowed across the external-directory boundary while normal tool permissions remain. Do not silently add broad references during Forge installation. [external: official reference specification][references] [external: agent directory rules][agents]

The stable plugin input also exposes experimental workspace adapters with configure/create/remove/target. target returns local directory or remote URL/headers. This is a native workspace/control-plane extension; **proposed** Forge should defer using it until a concrete deployment need exists rather than equating it to Forge worktree/issue authority. [external: exact API][hooks] [inferred]

### 2.8 Server, SDK, HTTP, headless and ACP

OpenCode has a client/server boundary: serve runs the backend, and TUI/desktop/web/SDK can attach. The SDK supplies createOpencodeClient and server/TUI launch helpers. A plugin's client can use the same server in-process when no external server URL is configured. The client routes directory/workspace identities in headers or query parameters; cwd alone is inadequate for remote/multi-project requests. [external: server][server] [external: client implementation][sdkclient] [external: plugin client][plugins]

The SDK server helper launches opencode from PATH, accepts hostname/port/signal/config/timeout, and defaults to a **five-second startup wait**. That wait is a launcher timeout, not a plugin timeout. **Proposed** proof must launch the resolved pinned executable itself and construct a client, avoiding accidental dispatch to a differently versioned machine shim. The helper's close method stops the launched process. [external: launcher source][sdkserver] [inferred]

Useful HTTP routes include:
- GET /global/health, /config, /agent, /command, /experimental/tool/ids and model-specific tool schemas.
- POST /session; GET /session/{id}/message; POST /session/{id}/message or /prompt_async.
- Child-session, fork, abort, summarize, diff and metadata/session operations.
- GET /event and /global/event SSE streams.
- POST /permission/{requestID}/reply with {reply:"once"|"always"|"reject",message?}.
- MCP status/config/auth, files/LSP/formatter, PTY and TUI control operations.

Use the generated SDK and fetched OpenAPI schema for the pin. Some server-doc examples still use the older per-session permission URL/body; sdk/v2 defines the current requestID/reply route. The backend also mounts a separately generated structured public API alongside compatibility groups. Do not infer one universal RPC contract from the docs overview. [external: generated types][sdkv2] [external: HTTP assembly][httpapi] [external: server documentation][serverdocs]

Headless invocation is opencode run --format json, optionally --model provider/model, --agent, --command, --session, --continue, --fork or --attach. Output is JSONL: type, timestamp, sessionID and event-specific data; emitted types include tool_use, step_start, step_finish, text, reasoning (when enabled) and error. This is a selected projection of runtime events, not a dump of the complete bus. Tool errors can coexist with a successful final process exit, so assertions must inspect part.state and effects, not just exit 0. [external: CLI implementation][run]

Noninteractive run rejects permission requests unless configured auto-approval is enabled; the implementation also tracks child sessions. Proof fixtures should set native permissions explicitly and keep auto-approval off. ACP is another official client protocol and is affected by resume/model/mode semantics; it needs separate certification if Forge advertises ACP coverage. [external: CLI][run] [external: ACP changes](https://github.com/anomalyco/opencode/releases/tag/v1.18.31) [inferred]

### 2.9 TUI extensions, status, themes and output

The TUI is an OpenTUI/Solid client with its own plugin runtime, not merely a server event consumer. TUI settings/plugins use tui.json/jsonc and a separate loader/config path. Legacy theme/keybind/tui fields are removed from server config normalization and migrate through the TUI configuration machinery. TUI plugins use the package "./tui" export and default {id?, tui(api,options,meta)}; a local structured plugin needs an id. Server and TUI functions are not combined in one default object. [external: TUI configuration][tuiconfig] [external: entry resolver][entry] [external: exact TUI API][tuiapi]

The public API supplies app/version, SDK client, event.on(type,handler), renderer, state, KV, theme, dialogs/toasts/prompt components, routes, keymap, mode stack, attention/soundboard, slots, plugin activation/install APIs and lifecycle.signal/onDispose. Theme packages may declare relative oc-themes paths. There is no need to replace the TUI to expose issue/gate status. The legacy command register/trigger/show helpers are deprecated in favor of keymap.registerLayer/dispatchCommand. [external: TUI contract][tuiapi] [external: theme metadata][entry]

Exact host slots and their props:
- app, app_bottom, home_logo, home_prompt_right, home_bottom, home_footer: {}.
- home_prompt: {ref?}.
- session_prompt: {session_id,visible?,disabled?,on_submit?,ref?}.
- session_prompt_right, sidebar_content, sidebar_footer: {session_id}.
- sidebar_title: {session_id,title,share_url?}.

Slots support Solid renderers and native slot modes; custom routes receive {params?} and registration returns an unregister function. Last registration wins for colliding routes. Components and keymap resources are owned by the plugin scope. [external: slot schemas][tuiapi] [external: route implementation][tuiroutes] [external: slot host][tuislots]

Initialization is ordered; failures are logged and scoped cleanup runs. Activation state has persistent config/KV handling. Teardown aborts a plugin signal and executes registered disposers in reverse order with a **five-second cleanup budget** in the inspected host. This does not imply a five-second init/hook timeout. No general plugin-code sandbox was established. [external: TUI host][tuihost]

**Proposed output/status:** an optional sidebar_footer or home_footer item can show the Forge issue, current gate verdict and link/receipt location; a keymap command opens a native dialog. Notifications can use toast/attention. This is a thin visualization consumer of Forge's APIs, consistent with the agent-first core; it is not a new Forge dashboard. No separate stable output-style manifest was established in the inspected plugin contracts. [external: available UI API][tuiapi] [read: north-star.md:16] [inferred]

### 2.10 Distinct v2 plugin API

The pinned package publicly exports @opencode-ai/plugin/v2/effect and /v2/promise. These are a different registration model: an id plus effect(ctx) or setup(ctx), rather than returning stable Hooks. Domain transforms/reloads are agent, catalog, command, integration, reference and skill; runtime hooks include aisdk.sdk and aisdk.language. Registration disposal and plugin-scoped cleanup are first-class. The Promise API mirrors the Effect boundary. [external: exports][pkg] [external: Promise API][v2promise] [external: Effect API][v2effect]

The v2 context also exposes plugin.add/remove and options. AI SDK hook payloads are:
- sdk: {model,package,options,sdk?}, with the sdk result mutable.
- language: {model,sdk,options,language?}, with the language result mutable.
State-domain transforms receive their domain draft/editor; reload rebuilds from fresh state and reapplies active transforms in registration order. The reviewed public v2 context does **not** expose the stable tool.execute.before contract or a server client. Do not port a stable gate by renaming its event. [external: context][v2ctx] [external: runtime payloads][v2aisdk] [external: lifecycle semantics][v2effect]


The Promise registration signature is domain.transform(callback:(draft)=>Promise<void>|void):Promise<{dispose():Promise<void>}>; each state domain also has reload():Promise<void>. The exact mutable draft capabilities are:

| Transform | Draft input and mutation API |
| --- | --- |
| agent.transform | AgentDraft: list():readonly AgentV2Info[], get(id):AgentV2Info-or-undefined, default(id-or-undefined), update(id,fn(agent)), remove(id). |
| catalog.transform | CatalogDraft.provider: list/get/update/remove(providerID); each CatalogProviderRecord has provider:ProviderV2Info and models:ReadonlyMap<string,ModelV2Info>. CatalogDraft.model: get/update/remove(providerID,modelID), default.get():{providerID,modelID}-or-undefined, default.set(providerID,modelID). |
| command.transform | CommandDraft: list():readonly CommandV2Info[], get(name), update(name,fn(command)), remove(name). |
| integration.transform | IntegrationDraft: list/get/update/remove(id) for IntegrationRef; method.list(integrationID), method.update(registration), method.remove(integrationID,method). Registrations are {integrationID,method:IntegrationKeyMethod-or-IntegrationEnvMethod} or an OAuth registration described below. |
| reference.transform | ReferenceDraft: add(name,ReferenceLocalSource-or-ReferenceGitSource), remove(name), list(): `readonly [name,source][]` tuples. |
| skill.transform | SkillDraft: source(SkillV2Source), list():readonly SkillV2Source[]. |

All named domain records are pinned SDK v2 types. The registration callback mutates its draft and returns void, rather than returning a new catalog. [external: registration][v2registration] [external: agent draft][v2agent] [external: catalog draft][v2catalog] [external: command draft][v2command] [external: integration draft][v2integration] [external: reference draft][v2reference] [external: skill draft][v2skill]

IntegrationOAuthMethodRegistration is {integrationID,method:IntegrationOAuthMethod,authorize(inputs:IntegrationInputs),refresh?(credential),label?(credential)}. Its shared Effect declaration returns scoped Effects: authorize yields {url,instructions,mode:"auto",callback:Effect<CredentialOAuth>} or {url,instructions,mode:"code",callback(code):Effect<CredentialOAuth>}; refresh yields CredentialOAuth and label yields string-or-undefined. Promise integration.connection exposes active(integrationID):Promise<ConnectionInfo-or-undefined> and resolve(connection):Promise<CredentialValue-or-undefined>. Check the chosen Effect/Promise entry's types rather than treating the two as interchangeable function implementations. [external: OAuth registration types][v2integration] [external: Promise connection interface][v2promiseintegration]

The core v2 external loader reads **plugins** entries (string or {package,options}), resolves packages/paths, imports a default {id,effect-or-setup}, and adds it to the scoped plugin service. Setup occurs asynchronously and external-load failures are ignored at that boundary; plugin wait/removal operate by id. This is separate from stable **plugin** entries and server/main selection. **Proposed** implement a separately tested v2 shim/entry only when the target execution family is selected; passing stable server-plugin proof does not certify v2. [external: external loader][v2loader] [external: scoped service][v2plugins] [inferred]

## 3. Ranked Forge advantages

All integration rows are **proposed**; benefits are engineering predictions, not measured outcomes.

| Rank | Native capability | Forge capability carried | User benefit / constraint |
| --- | --- | --- | --- |
| 1 | Awaited pre-tool hook | Gates plus Kernel lease/scope checks | Prevent a forbidden model tool side effect at one common seam; cover siblings and MCP rather than one named tool |
| 2 | System/message and compaction transforms | Issue recap and Memory recall | Context survives resume/compaction with short, current pointers; avoid racing session-created observers |
| 3 | Native skills plus tools/MCP | Procedures and reusable block APIs | Reuse .agents/skills and typed capabilities without rebuilding the agent loop |
| 4 | SDK/SSE, JSONL and session metadata | Run identity, receipts, conformance | Deterministic assertions, linked child-session evidence and recoverable handoffs |
| 5 | Native agents/task sessions | Optional reference-workflow reviewers | Separate focused evidence contexts, with native models/permissions and explicit Forge issue ownership |
| 6 | TUI slots/keymaps/routes | Optional gate/issue visualization | See actionable authority state in the existing interface |
| 7 | v2 domain transforms/reload | Dynamic capability catalogs/config compositions | Add/remove agents, commands, skills and integrations through owned scopes, once independently proved |
| 8 | Experimental workspace adapters | Future remote execution composition | Native remote/local targets without a harness replacement; defer until a concrete use case |

Carrier support is sourced in §§2.1–2.10. Kernel remains the authority; OpenCode owns conversation execution, model choice and UI. [read: north-star.md:11-28] [inferred]

## 4. Limits, gotchas and changes over six months

### 4.1 Source-established limits, not live reproductions

| Limit | Evidence / implication |
| --- | --- |
| Gate module fails to load yet OpenCode continues | Loader/initializer catch-and-skip paths; add positive readiness assertions and distinguish absent enforcement from deny [external][loader] |
| Generic Error blocks one call, not every future action | Processor distinguishes ordinary tool failure from permission rejection; re-check every mutating call [external][processor] |
| Replacing output.args does not replace execution args | Wrapper ignores returned object; mutate properties, then verify through actual effects [external][tools] |
| User shell and command substitutions bypass the generic pre-tool seam | Separate prompt paths; do not advertise machine-wide prevention [external][loop] |
| Post-hook output shape differs for MCP | Raw result precedes normalizing content; adapters must check the shape [external][tools] |
| permissions are not plugin sandboxing | Plugin import/execute runs arbitrary code; explicit trust and provenance are needed [external][plugins] |
| session.created observer races orientation | Non-awaited event Promise; use an awaited model-context hook [external][plugins] |
| steps is advisory in the inspected stable loop | MAX_STEPS_PROMPT with tools still supplied; enforce real budgets separately [external][loop] |
| SDK generations and docs diverge | Older Event types, newer permission payloads/HTTP schema, optional skill description and MCP timeout mismatch [external][sdkv1] [external][sdkv2] |
| Plan permissions are configurable | Do not equate a native agent label with immutable Forge policy [external][agents] |
| Package/import identity matters | Last-identity deduplication, local-vs-npm duplicates, cached import failure; test install/update in fresh processes [external][configplugin] [external][loader] |

No claim that a documented feature is broken in a running installation is made here. The identified docs/type/runtime differences are source-proved for the pin; reproducing them is part of the proof plan.

### 4.2 Windows

Official docs support native Windows but recommend WSL for terminal/tool compatibility. Treat WSL and native Windows as separate conformance lanes. Use pathToFileURL for import targets, config-relative paths, worktree/directory from context and absolute executable paths when needed. Keep spaces, drive letters, backslashes, symlinks/junctions, process cancellation and MCP child cleanup in tests. The upstream registry already converts absolute custom-tool paths to file URLs. [external: official Windows guide][windows] [external: path resolver][entry] [external: registry][registry] [inferred: test matrix]

Do not mutate the operator's global PATH, shim, agents, provider auth or MCP config to get a proof to pass. A machine-local executable can be a different execution family from the source release studied here. Spawn the pin in isolated test state; source proof is not operator proof. [inferred: test isolation]

### 4.3 Verified release history, April–September 2026

The release collection was read through 2026-04-01; these changes are official release notes, not independent regressions reproduced here:

| Version/date | Material change for Forge |
| --- | --- |
| 1.3.16, April 6 | npm alias/git URL plugin installation and Windows cache paths fixed [external](https://github.com/anomalyco/opencode/releases/tag/v1.3.16) |
| 1.4.0, April 8 | Explicit SDK breaking changes: diff metadata moves to unified patch; user-message variant moves under model [external](https://github.com/anomalyco/opencode/releases/tag/v1.4.0) |
| 1.14.20, April 21 | Node-hosted local dynamic imports on Windows fixed; remote workspace permission replies corrected [external](https://github.com/anomalyco/opencode/releases/tag/v1.14.20) |
| 1.14.31, May 1 | Child tasks preserve parent external-directory/deny rules [external](https://github.com/anomalyco/opencode/releases/tag/v1.14.31) |
| 1.14.45, May 10 | Deprecated TUI command API compatibility shim; provider model-state mutation constrained [external](https://github.com/anomalyco/opencode/releases/tag/v1.14.45) |
| 1.15.5 / 1.15.6, May 18 / 20 | Custom tool ask bridge fixed; isolated plugin file failures and structured v2 HTTP errors [external](https://github.com/anomalyco/opencode/releases/tag/v1.15.5) [external](https://github.com/anomalyco/opencode/releases/tag/v1.15.6) |
| 1.15.11, May 27 | Plugin dispose hook added [external](https://github.com/anomalyco/opencode/releases/tag/v1.15.11) |
| 1.17.10, June 24 | Namespaced hooks and v2 Effect/Promise plugin APIs added [external](https://github.com/anomalyco/opencode/releases/tag/v1.17.10) |
| 1.17.12, June 30 | V2 event names preserved in SSE; new auto-approval behavior introduced [external](https://github.com/anomalyco/opencode/releases/tag/v1.17.12) |
| 1.18.2, July 15 | Nested subagents disabled by default, configurable subagent_depth [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.2) |
| 1.18.17 / 1.18.20, August 12 / 21 | Compaction/retry changes; resumable subagent failures and headless child permission handling [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.17) [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.20) |
| 1.18.24, August 28 | Stable runtime reads supported v2 config fields; mixed generations still need proof [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.24) |
| 1.18.31 / 1.18.33 / 1.18.34, September 14 / 28 / 30 | ACP resume state, MCP browser failures/debug redaction, request identity headers and Windows plugin-name display [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.31) [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.33) [external](https://github.com/anomalyco/opencode/releases/tag/v1.18.34) |

## 5. L2 installed-version proof recipe

**Proposed, unrun.** A source unit test, a successful package import, an exit code or a model saying the gate worked is insufficient. The recipe must exercise the actual pinned binary and the actual packed Forge artifact. It requires one new small fixture runner; that runner is not created by this research-only task.

### 5.1 Inputs, isolated environment and exact command surface

Inputs: the Forge npm tarball under test; its artifact SHA256; OpenCode 1.18.34; a resolved executable path; SDK 1.18.34; a temporary project; a loopback deterministic OpenAI-compatible mock provider; a Forge Kernel fixture with an active owned issue and known allow/deny verdicts; a fixed request/context identity. No real provider credential or operator configuration is required. [inferred; proposed]

CI commands, executed later in an authorized implementation phase:

```sh
npm pack --json
npm install --prefix "$PROOF_ROOT/runtime" --no-audit --no-fund   opencode-ai@1.18.34 @opencode-ai/sdk@1.18.34 "$FORGE_TGZ"
node --test test/harness/opencode-installed.test.mjs
```

The proposed test file creates fixture configuration and launches the exact executable with child-process cwd set to the temporary project. On Windows, resolve the installed launcher or binary rather than assuming extensionless .bin entries work. Set XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_CACHE_HOME and XDG_STATE_HOME to isolated absolute directories, OPENCODE_TEST_HOME to an empty test home and OPENCODE_DB to the isolated database. OPENCODE_CONFIG_DIR alone does not isolate every legacy global source. Do not repurpose HOME or print the inherited environment. [external: path behavior][global] [external: database override][database] [inferred]

The child argument arrays are exactly:

```js
[ "--version" ]
[ "serve", "--hostname", "127.0.0.1", "--port", String(port) ]
[ "run", "--attach", baseUrl, "--format", "json",
  "--model", "forge-proof/probe", "--agent", "forge-proof", "FORGE_PROOF_ALLOW" ]
[ "run", "--attach", baseUrl, "--format", "json",
  "--model", "forge-proof/probe", "--agent", "forge-proof", "FORGE_PROOF_DENY" ]
[ "run", "--attach", baseUrl, "--format", "json",
  "--model", "forge-proof/probe", "--agent", "forge-proof",
  "--session", recordedSessionID, "FORGE_PROOF_RESUME" ]
```

These are native CLI arguments. FORGE_PROOF_* are mock-provider fixture selectors, not built-in OpenCode commands. Set native permissions to allow the exact probe action so a denial can only come from the real Forge gate, and deny unrelated actions. Use a synthetic marker path inside the fixture project, never a real protected user file. [external: CLI schema][run] [inferred; proposed fixture]

First loading lane: configure plugin to the installed **package directory file URL**, exercising the package's ./server selection against the tarball installed locally. Second loading lane: serve that exact tarball through an isolated local test npm registry and configure forge-workflow@<artifact-version>, exercising Npm.add and engine compatibility. A shim-only smoke does not certify the npm loader. Restart between install/update/error cases because module caching affects failures. [external: loader][loader] [external: entry selection][entry] [inferred]

The loopback mock should issue a real tool call for the allow/deny case, then a final answer after it receives the tool result. It should also support a fixed compaction response and a child-task sequence. Record requested tools and arguments. Keep mock traffic deterministic and local; do not make assertions depend on a paid model following a test prompt. [inferred; proposed]

### 5.2 Required assertions

The fixture runner must fail loudly on each of these:

1. **Identity/pin:** --version equals 1.18.34; health reports the same version; artifact SHA is retained; requestId is forge-deep-opencode-20261001 and contextDigest is 59791b8c919c61052ded17eada62e36d304e288d5ae486f5ed2c662fa16ac053 throughout the receipt.
2. **Registration:** GET /experimental/tool/ids contains the declared Forge tool IDs; /agent and /command contain every promised projection; no plugin install/import/init error is hidden. A positive adapter-ready handshake identifies the loaded artifact, execution family and supported coverage.
3. **Allow:** a real model-dispatched permitted tool executes once, produces the expected marker and a completed tool part, and yields a Forge receipt linked to the native session/call.
4. **Deny:** native permissions allow the probe, but the Forge gate rejects it. The denied tool part is error with the expected Forge reason; the marker is absent; the target implementation invocation count is zero. Exit 0 alone does not pass.
5. **Rewrite:** a supported in-place rewrite reaches the implementation; replacing output.args is explicitly tested as an unsupported operation so the adapter cannot silently rely on it.
6. **MCP:** the same deny check is applied to a local MCP tool; both custom/built-in and raw-MCP after-result shapes are normalized correctly. Add resource-tool proof if that coverage is advertised.
7. **Children/resume:** task-created child sessions carry issue/request linkage and effective restrictions; a resumed session re-fetches current authority before its first governed action. Enumerate every child, not one sampled session.
8. **Compaction:** a summary/continuation retains request/issue/receipt references, and current authority is revalidated afterward rather than trusted from old summary text.
9. **Failure:** gate timeout/backend unavailability fails the governed action according to configured policy; a skipped plugin is INCOMPLETE/UNAVAILABLE, never PASS. Run without the plugin as a negative control.
10. **Boundary honesty:** user shell, command substitution, provider-executed tools, code mode and v2 are either independently exercised or explicitly excluded from the receipt's coverage.
11. **Windows/update:** repeat package and shim paths with spaces/drive letters, cancellation, stdio MCP cleanup and a fresh process after updating the artifact.
12. **Terminal evidence:** exact executable/version, package digest, timestamps, directory/worktree, native IDs, all cases, stdout JSONL, sanitized error diagnostics and process cleanup; overall PASS only when every required case has terminal evidence.

The test can use node:assert/strict and node:test; no new test framework is required. Illustrative core assertions, where events/effects come from the real fixture:

```js
assert.equal(version, "1.18.34")
assert.equal(denyPart.state.status, "error")
assert.match(denyPart.state.error, /FORGE_DENY/)
assert.equal(await exists(deniedMarker), false)
assert.equal(implementationCalls.deny, 0)
assert.equal(allowPart.state.status, "completed")
assert.equal(receipt.requestId, "forge-deep-opencode-20261001")
assert.equal(receipt.contextDigest,
  "59791b8c919c61052ded17eada62e36d304e288d5ae486f5ed2c662fa16ac053")
assert.equal(receipt.requiredCases.every(c => c.status === "PASS"), true)
```

No result for this recipe is claimed. TUI mounting/unmounting requires an additional PTY/Solid host test and a Windows operator check; headless server proof does not demonstrate rendered slots. [inferred; proposed]

## 6. Best possible Forge integration

Everything in this section is **proposed**. Keep the implementation small and reuse public Forge block APIs; do not add another agent loop or universal provider abstraction.

| Surface | Proposed implementation | What remains native | Estimated incremental effort / risk |
| --- | --- | --- | --- |
| Packaging | One forge-workflow package with narrow ./server export, pinned engines/opencode compatibility and optional ./tui; generated local shim fallback | npm/path loading and version selection | 0.5–1 worker-day; entrypoint/version churn |
| Gate | Awaited before hook calls the configured Forge gate/Kernel API; in-place arguments only; same checks inside Forge-owned mutation handlers | Native tool dispatch and approvals | 1–2 days; route gaps and absent-plugin detection |
| Context/Memory | Awaited system transform injects bounded current recap; compaction appends durable identity/receipt pointers; event observer logs linkage | Native prompt composition and summary loop | 0.5–1 day; stale authority and excessive context |
| Tools/MCP | Shared Forge handlers exposed through custom tools or thin MCP, chosen by composition; no duplicate Kernel state | Tool schemas, transport/auth and approval UI | 0.5–1 day after shared API exists; MCP server itself is a separate shared-platform dependency |
| Skills/commands/agents | Native .agents/skills; minimal namespaced commands and optional read-only reviewers generated from one catalog | Discovery, task sessions, operator model choice | 0.5–1 day; skill collisions and agent permission overrides |
| Proof/update | Packed artifact, local mock provider/registry, failure controls, child/resume/compaction and Windows lane | Real pinned executable and SDK | 1.5–2.5 days; binary/environment differences |
| TUI, optional | Thin footer/sidebar status and native dialog/keymap action; scoped subscriptions/disposers | OpenTUI renderer, routes, themes and state | 1–2 additional days; frontend ABI and operator verification |
| v2, separate lane | Explicit execution-family negotiation and a dedicated tested shim using v2 transforms | v2 domain registry and scope ownership | 2–3 additional days; no equivalent proven pre-tool gate contract |

Estimates overlap: **stable server integration roughly 4–6 worker-days** once shared Forge APIs/proof fixtures exist; **7–11** including optional TUI and a bounded v2 capability lane. This excludes building the shared MCP/config platform, marketplace review, paid-model research and fixing unrelated upstream bugs. The estimates are inferred engineering budgets, not measurements. [inferred]

Installation should show the exact files/config values it adds, preserve existing project/global entries and keep state in the Forge Kernel. Prefer a project-local configuration change; global install is an explicit operator choice. Installation should declare which execution family it certifies, expected permission interactions, trusted package version and unsupported paths. Update should pin a new artifact, restart relevant hosts, rerun conformance and retain a rollback to the prior package/config values. Do not silently upgrade gates beneath an active governed run. [inferred; proposed]

**Support claim:** retain Experimental until the actual installed-version proof passes. Passing stable server proof permits only that capability/tier claim. TUI, remote attachment, ACP, native Windows and v2 carry separate evidence. Pi remains the priority exposure surface under the north star; that does not justify a misleading OpenCode compatibility claim. [read: north-star.md:24] [inferred; proposed]

## 7. Keeping current

Watch the [official changelog](https://opencode.ai/changelog), [GitHub releases](https://github.com/anomalyco/opencode/releases), [release Atom feed](https://github.com/anomalyco/opencode/releases.atom), the [plugin docs](https://opencode.ai/docs/plugins/) and pinned public plugin/SDK sources. The Atom URL is a proposed watcher target; its feed response was not fetched in this phase. September had **nine published releases** between September 1 and September 30: cadence was uneven, with some same-day releases and some week-long gaps. Do not assume every release is daily or semantically harmless. [external: [release collection](https://api.github.com/repos/anomalyco/opencode/releases?per_page=100), accessed 2026-10-01] [ran: September release count]

Trigger a compatibility review when loader selection, plugin exports/engines, hook names/payloads/call sites, permission merging, child inheritance, compaction, SDK events/routes, JSONL, TUI slots/keymaps or Windows process/import behavior changes. Run a pinned known-good lane plus a latest candidate lane; record the version/commit/artifact and diff public schemas. Promote the pin only on a complete receipt. A new field is not automatically a feature Forge must use. [inferred; proposed]

Track stable and v2 separately. A release adding a v2 API or preserving v2 SSE events does not establish that stable Hooks are called by the v2 runner. Keep capability reports granular and honor UNAVAILABLE/INCOMPLETE outcomes. [external: distinct API][v2ctx] [external: stable hooks][hooks] [inferred]

## Appendix A. Event catalogue

Every row below is a discriminator and the exact properties type from the pinned SDK v2, compacted only for whitespace. The surrounding runtime envelope is {id:string,type,properties}. Named payload types refer to definitions in that same generated file. The plugin listener may filter or receive runtime events beyond the legacy SDK union; see §2.3. [external: generated type definitions][sdkv2]

| Event discriminator | Exact properties type (whitespace collapsed) |
| --- | --- |
| tui.prompt.append | `{ text: string }` |
| tui.command.execute | `{ command: \| "session.list" \| "session.new" \| "session.share" \| "session.interrupt" \| "session.compact" \| "session.page.up" \| "session.page.down" \| "session.line.up" \| "session.line.down" \| "session.half.page.up" \| "session.half.page.down" \| "session.first" \| "session.last" \| "prompt.clear" \| "prompt.submit" \| "agent.cycle" \| string }` |
| tui.toast.show | `{ title?: string message: string variant: "info" \| "success" \| "warning" \| "error" duration?: number }` |
| tui.session.select | `{ sessionID: string }` |
| server.instance.disposed | `{ directory: string }` |
| models-dev.refreshed | `{ [key: string]: unknown }` |
| integration.updated | `{ [key: string]: unknown }` |
| integration.connection.updated | `{ integrationID: string }` |
| catalog.updated | `{ [key: string]: unknown }` |
| session.created | `{ sessionID: string info: Session }` |
| session.updated | `{ sessionID: string info: Session }` |
| session.deleted | `{ sessionID: string info: Session }` |
| message.updated | `{ sessionID: string info: Message }` |
| message.removed | `{ sessionID: string messageID: string }` |
| message.part.updated | `{ sessionID: string part: Part time: number }` |
| message.part.removed | `{ sessionID: string messageID: string partID: string }` |
| session.next.agent.switched | `{ timestamp: number sessionID: string messageID: string agent: string }` |
| session.next.model.switched | `{ timestamp: number sessionID: string messageID: string model: ModelRef }` |
| session.next.moved | `{ timestamp: number sessionID: string location: LocationRef subdirectory?: string }` |
| session.next.prompted | `{ timestamp: number sessionID: string messageID: string prompt: Prompt delivery: "steer" \| "queue" }` |
| session.next.prompt.admitted | `{ timestamp: number sessionID: string messageID: string prompt: Prompt delivery: "steer" \| "queue" }` |
| session.next.context.updated | `{ timestamp: number sessionID: string messageID: string text: string }` |
| session.next.synthetic | `{ timestamp: number sessionID: string messageID: string text: string }` |
| session.next.shell.started | `{ timestamp: number sessionID: string messageID: string callID: string command: string }` |
| session.next.shell.ended | `{ timestamp: number sessionID: string callID: string output: string }` |
| session.next.step.started | `{ timestamp: number sessionID: string assistantMessageID: string agent: string model: ModelRef snapshot?: string }` |
| session.next.step.ended | `{ timestamp: number sessionID: string assistantMessageID: string finish: string cost: number tokens: { input: number output: number reasoning: number cache: { read: number write: number } } snapshot?: string files?: Array<string> }` |
| session.next.step.failed | `{ timestamp: number sessionID: string assistantMessageID: string error: SessionErrorUnknown }` |
| session.next.text.started | `{ timestamp: number sessionID: string assistantMessageID: string textID: string }` |
| session.next.text.delta | `{ timestamp: number sessionID: string assistantMessageID: string textID: string delta: string }` |
| session.next.text.ended | `{ timestamp: number sessionID: string assistantMessageID: string textID: string text: string }` |
| session.next.reasoning.started | `{ timestamp: number sessionID: string assistantMessageID: string reasoningID: string providerMetadata?: LlmProviderMetadata }` |
| session.next.reasoning.delta | `{ timestamp: number sessionID: string assistantMessageID: string reasoningID: string delta: string }` |
| session.next.reasoning.ended | `{ timestamp: number sessionID: string assistantMessageID: string reasoningID: string text: string providerMetadata?: LlmProviderMetadata }` |
| session.next.tool.input.started | `{ timestamp: number sessionID: string assistantMessageID: string callID: string name: string }` |
| session.next.tool.input.delta | `{ timestamp: number sessionID: string assistantMessageID: string callID: string delta: string }` |
| session.next.tool.input.ended | `{ timestamp: number sessionID: string assistantMessageID: string callID: string text: string }` |
| session.next.tool.called | `{ timestamp: number sessionID: string assistantMessageID: string callID: string tool: string input: { [key: string]: unknown } provider: { executed: boolean metadata?: LlmProviderMetadata } }` |
| session.next.tool.progress | `{ timestamp: number sessionID: string assistantMessageID: string callID: string structured: { [key: string]: unknown } content: Array<LlmToolContent> }` |
| session.next.tool.success | `{ timestamp: number sessionID: string assistantMessageID: string callID: string structured: { [key: string]: unknown } content: Array<LlmToolContent> outputPaths?: Array<string> result?: unknown provider: { executed: boolean metadata?: LlmProviderMetadata } }` |
| session.next.tool.failed | `{ timestamp: number sessionID: string assistantMessageID: string callID: string error: SessionErrorUnknown result?: unknown provider: { executed: boolean metadata?: LlmProviderMetadata } }` |
| session.next.retried | `{ timestamp: number sessionID: string attempt: number error: SessionNextRetryError }` |
| session.next.compaction.started | `{ timestamp: number sessionID: string messageID: string reason: "auto" \| "manual" }` |
| session.next.compaction.delta | `{ timestamp: number sessionID: string messageID: string text: string }` |
| session.next.compaction.ended | `{ timestamp: number sessionID: string messageID: string reason: "auto" \| "manual" text: string recent: string }` |
| session.next.revert.staged | `{ timestamp: number sessionID: string revert: RevertState }` |
| session.next.revert.cleared | `{ timestamp: number sessionID: string }` |
| session.next.revert.committed | `{ timestamp: number sessionID: string messageID: string }` |
| message.part.delta | `{ sessionID: string messageID: string partID: string field: string delta: string }` |
| session.diff | `{ sessionID: string diff: Array<SnapshotFileDiff> }` |
| session.error | `{ sessionID?: string error?: \| ProviderAuthError \| UnknownError \| MessageOutputLengthError \| MessageAbortedError \| StructuredOutputError \| ContextOverflowError \| ContentFilterError \| ApiError }` |
| installation.updated | `{ version: string }` |
| installation.update-available | `{ version: string }` |
| file.edited | `{ file: string }` |
| reference.updated | `{ [key: string]: unknown }` |
| permission.v2.asked | `{ id: string sessionID: string action: string resources: Array<string> save?: Array<string> metadata?: { [key: string]: unknown } source?: PermissionV2Source }` |
| permission.v2.replied | `{ sessionID: string requestID: string reply: PermissionV2Reply }` |
| plugin.added | `{ id: string }` |
| project.directories.updated | `{ projectID: string }` |
| file.watcher.updated | `{ file: string event: "add" \| "change" \| "unlink" }` |
| pty.created | `{ info: Pty }` |
| pty.updated | `{ info: Pty }` |
| pty.exited | `{ id: string exitCode: number }` |
| pty.deleted | `{ id: string }` |
| question.v2.asked | `{ id: string sessionID: string questions: Array<QuestionV2Info> tool?: QuestionV2Tool }` |
| question.v2.replied | `{ sessionID: string requestID: string answers: Array<QuestionV2Answer> }` |
| question.v2.rejected | `{ sessionID: string requestID: string }` |
| todo.updated | `{ sessionID: string todos: Array<Todo> }` |
| lsp.updated | `{ [key: string]: unknown }` |
| permission.asked | `{ id: string sessionID: string permission: string patterns: Array<string> metadata: { [key: string]: unknown } always: Array<string> tool?: { messageID: string callID: string } }` |
| permission.replied | `{ sessionID: string requestID: string reply: "once" \| "always" \| "reject" }` |
| mcp.tools.changed | `{ server: string }` |
| mcp.browser.open.failed | `{ mcpName: string url: string }` |
| command.executed | `{ name: string sessionID: string arguments: string messageID: string }` |
| project.updated | `{ id: string worktree: string vcs?: ProjectVcs name?: string icon?: ProjectIcon commands?: ProjectCommands time: ProjectTime sandboxes: Array<string> }` |
| session.status | `{ sessionID: string status: SessionStatus }` |
| session.idle | `{ sessionID: string }` |
| question.asked | `{ id: string sessionID: string questions: Array<QuestionInfo> tool?: QuestionTool }` |
| question.replied | `{ sessionID: string requestID: string answers: Array<QuestionAnswer> }` |
| question.rejected | `{ sessionID: string requestID: string }` |
| session.compacted | `{ sessionID: string }` |
| vcs.branch.updated | `{ branch?: string }` |
| workspace.ready | `{ name: string }` |
| workspace.failed | `{ message: string }` |
| workspace.status | `{ workspaceID: string status: "connected" \| "connecting" \| "disconnected" \| "error" }` |
| worktree.ready | `{ name: string branch?: string }` |
| worktree.failed | `{ message: string }` |
| server.connected | `{ [key: string]: unknown }` |
| global.disposed | `{ [key: string]: unknown }` |

## Bottom line

1. Use the official Anomaly repository and pin OpenCode 1.18.34; stable and v2 plugin APIs are distinct.
2. P7's npm subpath candidate is unsupported by the inspected loader; use the package's ./server entrypoint.
3. An awaited tool.execute.before hook blocks execution by throwing; returning a deny object does nothing.
4. Mutate existing arguments in place; replacing output.args is ignored by the inspected call sites.
5. Bus events observe activity asynchronously; session.created is not an awaited orientation barrier.
6. Native .agents/skills and AGENTS.md already carry procedures; executable authority belongs in Forge APIs.
7. OpenCode exposes a real TUI plugin API with routes, slots, keymaps and scoped cleanup.
8. Permissions are tool policy, not a sandbox for plugin code; loader failures can leave enforcement absent.
9. Certify actual packed artifacts with deterministic headless tests, including MCP, child sessions and Windows paths.
10. Keep the release tier experimental until installed-version proof passes; all integration work here is proposed.

## Corrections to P7

These refer exactly to the OpenCode subsection of P7; P7 itself is unchanged. [read: docs/work/2026-09-30-forge-final-plan/platform/P7-harness-plugins.md:129-153]

1. **Official source identity:** use anomalyco/opencode, the redirect target of sst/opencode, and record v1.18.34 with its commit. References to old source layouts need a pin. [external: [repository](https://github.com/anomalyco/opencode), [release](https://github.com/anomalyco/opencode/releases/tag/v1.18.34)]
2. **“Auto-installed by Bun into ~/.cache/opencode/node_modules/”:** replace with the inspected @npmcli/arborist installer, spec-specific cache, filesystem lock and ignoreScripts:true. Do not promise the old directory layout. [external: source][npm]
3. **Plugin input/export shape:** P7's legacy async-function example remains one supported form, but the current structured default {id?,server} form and the serverUrl, options and experimental_workspace fields must also be described. Server and TUI have distinct entry contracts. [external: stable types][hooks] [external: loader][plugins] [external: TUI types][tuiapi]
4. **“forge-workflow/opencode” as a plugin config candidate:** source resolves installation specs and then ./server/main; it does not resolve an arbitrary npm export subpath. Replace the candidate with a root package pin plus ./server, keeping a local import shim as the fallback. Installed proof is still required. [external: resolver][entry] [external: installer][npm] [inferred, rung 3]
5. **“Blocks on deny”:** specify await + throw/reject. Returned deny objects have no effect. Document in-place args mutation, after-hook side-effect limits and the uncovered user-shell/command-substitution routes. [external: dispatch][plugins] [external: wrappers][tools] [external: shell/command paths][loop] [inferred, rung 3]
6. **“session.created, which runs orientation”:** it can observe/link a session but its Promise is not an awaited prompt barrier. Use an awaited system/messages transform for bounded orientation and refresh authority at governed actions. [external: dispatcher][plugins] [external: prompt composition][request] [inferred; proposed]
7. **Hooks and events grouped together:** separate awaited trigger hooks from asynchronous bus notifications. permission.asked is a notification; the declared legacy permission.ask hook is not invoked by the inspected permission service. Legacy and current SDK event payloads differ. [external: types][hooks] [external: dispatch][plugins] [external: current schema][sdkv2] [external: permission service](https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/permission/index.ts)
8. **“No trust model is documented”:** replace the vague statement with the concrete import boundary: configured plugins execute in-process without a code sandbox; install scripts are disabled, but tools' permissions do not constrain arbitrary plugin code; load failures can leave the run ungated. The ecosystem-list/marketplace sentence is not a security guarantee, and this investigation does not establish a reviewed marketplace certification. [external: loader][loader] [external: installer][npm] [inferred, rung 3]
9. **Missing TUI and v2 surfaces:** add ./tui, native slots/routes/keymaps/lifecycle and the separately exported v2 Effect/Promise domain API. Stable server proof cannot certify either UI rendering or a v2 gate. [external: TUI][tuiapi] [external: exports][pkg] [external: v2 context][v2ctx]
10. **“Prefer MCP so there is one implementation”:** one implementation is a shared Forge API handler, which may be exposed through a native tool, MCP, or both by composition. Transport choice does not justify separate Kernel semantics. [read: north-star.md:11-28] [inferred; proposed]
11. **“4–5 days including matrix/renderers/tests”:** retain it as an early estimate, not measured effort. This dossier proposes 4–6 worker-days for the stable lane after shared prerequisites, or 7–11 with optional TUI/v2, with installed artifact, negative control, Windows, resume and child-session proof included. [inferred; proposed]
12. **“Zero-adapter path”:** keep native skill/rule discovery as a source-established opportunity, with the installed-project result explicitly unrun. P7's Forge-today detector-only claim was not re-audited as a repository-wide absence claim here. [external: native discovery][skills] [external: rules][instructions] [read: P7-harness-plugins.md:142] [inferred]

## Open questions for the owner

These are proposed future implementation choices, not requests to authorize implementation in this research phase. No answer is needed to complete the dossier.

**Release scope:** A. Add the stable server lane as Experimental after the priority Pi work; B. fund the full installed proof before making any support claim; C. defer OpenCode entirely. **Default: A.** Reason: the stable adapter has useful native leverage, while source evidence alone cannot earn a validated support tier. Promotion still requires the proof in §5. [read: north-star.md:24] [inferred; proposed]

**Package entry:** A. Root forge-workflow version pin selecting ./server, with an optional ./tui export; B. local import shim only; C. v2-first integration. **Default: A.** Reason: it follows the inspected npm loader and the one-package constraint. Keep B as compatibility fallback; C needs a separate authority mechanism/proof because it has no reviewed equivalent stable pre-tool contract. [external: resolver][entry] [external: v2 context][v2ctx] [inferred; proposed]

**Tool exposure:** A. Shared Forge API handlers with native custom tools and optional MCP chosen by composition; B. MCP-only; C. CLI-only. **Default: A.** Reason: it gives native schemas/session linkage while preserving the same Kernel implementation and allowing interoperability. The shared MCP server is a prerequisite outside this adapter's estimate. [external: native tool contract][tooltype] [read: north-star.md:11-28] [inferred; proposed]

**TUI timing:** A. Add status UI after stable proof; B. include it in the first adapter release; C. omit it indefinitely. **Default: A.** Reason: hooks/tools deliver the governance value first; a thin native footer/dialog can follow without expanding Forge into a dashboard. [external: TUI API][tuiapi] [inferred; proposed]

## Confidence

- **High, rung 2/3:** current observed release identity, pinned public API/source contracts, package entry selection, awaited throw-based denial, reference-mutation semantics and asynchronous event behavior. The complete tree and 76 checked blob SHAs support source integrity. The P7 resolutions are execution-path conclusions, not an installed transcript.
- **Medium, inferred:** the proposed integration, effort, update triggers and CI design. They depend on shared Forge APIs/fixtures and the selected stable/v2 execution family.
- **Unverified installed behavior:** no L2 process or rendered TUI was exercised, no actual packed Forge plugin was installed, and no support-tier promotion is claimed. SDK schema declarations are not proof that every event reaches every legacy plugin instance.
- **Repository scope:** only the assigned dossier is written. P7, configuration, source code, skills, GitHub and Kernel state remain as read. Future implementation and conformance runs need their own authorized workflow.

[loader]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/plugin/loader.ts
[entry]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/plugin/shared.ts
[plugins]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/plugin/index.ts
[hooks]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/index.ts
[tooltype]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/tool.ts
[registry]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/tool/registry.ts
[tools]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/tools.ts
[loop]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/prompt.ts
[processor]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/processor.ts
[request]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/llm/request.ts
[llm]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/llm.ts
[compaction]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/compaction.ts
[instructions]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/instruction.ts
[session]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/session/session.ts
[database]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/database/database.ts
[global]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/global.ts
[config]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/config/config.ts
[configplugin]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/config/plugin.ts
[npm]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/npm.ts
[agents]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/agent/agent.ts
[agentschema]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/v1/config/agent.ts
[agentload]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/config/agent.ts
[agentdocs]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/agents.mdx
[task]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/tool/task.ts
[commands]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/config/command.ts
[commanddocs]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/commands.mdx
[commandindex]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/command/index.ts
[skills]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/skill/index.ts
[mcp]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/mcp/index.ts
[mcpschema]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/v1/config/mcp.ts
[permission]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/permission/index.ts
[permissionschema]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/v1/permission.ts
[server]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/server/server.ts
[serverdocs]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/server.mdx
[httpapi]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/server/routes/instance/httpapi/api.ts
[sdkv1]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/sdk/js/src/gen/types.gen.ts
[sdkv2]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/sdk/js/src/v2/gen/types.gen.ts
[sdkclient]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/sdk/js/src/v2/client.ts
[sdkserver]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/sdk/js/src/server.ts
[sdkdocs]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/sdk.mdx
[run]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/cli/cmd/run.ts
[tuiapi]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/tui.ts
[tuihost]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/plugin/tui/runtime.ts
[tuiconfig]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/src/config/tui.ts
[tuiroutes]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/tui/src/plugin/api.ts
[tuislots]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/tui/src/plugin/slots.tsx
[v2promise]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/promise/README.md
[v2effect]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/README.md
[v2ctx]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/promise/context.ts
[v2aisdk]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/promise/aisdk.ts
[v2loader]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/config/plugin/external.ts
[v2host]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/plugin/host.ts
[v2plugins]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/core/src/plugin.ts
[pkg]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/package.json
[policies]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/policies.mdx
[references]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/references.mdx
[customdocs]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/custom-tools.mdx
[windows]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/web/src/content/docs/windows-wsl.mdx
[parsechecks]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/opencode/test/plugin/shared.test.ts
[v2agent]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/agent.ts
[v2catalog]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/catalog.ts
[v2command]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/command.ts
[v2integration]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/integration.ts
[v2reference]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/reference.ts
[v2skill]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/effect/skill.ts
[v2registration]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/promise/registration.ts
[v2promiseintegration]: https://github.com/anomalyco/opencode/blob/aec0b9a6d8898f68f923aaf08b7306d931fd9d76/packages/plugin/src/v2/promise/integration.ts
