# Pi deep dive for Forge

Decisions needed: none to finish this research phase. The owner choices at the end have stated defaults; all integration work below is proposed.

## Bottom line — opening brief

1. Pi is the priority native integration: a small extension can carry Forge blocks without replacing Pi’s agent loop.
2. The verified release is `@earendil-works/pi-coding-agent@0.99.2`, in `earendil-works/pi`; certify that exact release.
3. Pi packages combine extensions, skills, prompts and themes; ship Pi metadata inside Forge’s one npm artifact.
4. The 41-event extension API reaches input, provider requests, tools, compaction, branch boundaries and TUI presentation.
5. `tool_call` can deny or rewrite validated arguments; MCP and codemode nested calls traverse that pipeline.
6. Keep authoritative permissions, leases and receipts in Forge block APIs; Pi’s hooks are useful enforcement points, not an OS sandbox.
7. Native MCP arrived in 0.99.0; 0.99.2 changed discovery, OAuth and Windows behavior, making release pinning material.
8. Prefer native public block APIs for the Pi experience, with the same blocks optionally exposed through a shared MCP server.
9. Pi’s gallery is a practical distribution channel, but the Graphify family’s measured downloads do not establish broad package popularity.
10. This dossier reaches source evidence, rung 2; installed-version proof and a Windows operator transcript remain required before support claims.

These conclusions are derived from the tagged source and official pages cited below, retrieved **2026-10-01**. “Proposed” marks design or test work that has not been implemented or run.

## Request and evidence record

~~~json
{
  "protocolVersion": "1.0",
  "requestId": "forge-deep-pi-20261001",
  "contextDigest": "67dde101a50e45c6484d9d5256a08f313598173e65ce03bf6e75a04fb277bf48",
  "context": {
    "summary": "Forge harness deep dive: Pi (priority harness)."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": {
    "write": true,
    "tools": [],
    "maxCostUsd": null
  },
  "route": {
    "model": "gpt-6.1-sol",
    "thinking": "xhigh",
    "search": true
  }
}
~~~

The route above is the supplied request, not model self-attribution. Scope: research only; this file is the sole output artifact. No Pi installation, provider request, Forge plugin implementation, MCP execution, package installation, GitHub write, commit or push was performed. Source was read through official GitHub files and registry/pages; no context-mode tools were used.

**Release baseline.** npm reported 0.99.2, Node `>=22.19.0`, repository `earendil-works/pi`, and gitHead `005af57d88ee23b33778f343a9595b32e67ff788`; tag `v0.99.2` points to the same commit. The observed main head was `e792ba131ed0495f3ff58a0eb13f20540e344d5c`, so main and the installed release must not be treated as interchangeable. The old `badlogic/pi-mono` README now points into the current Pi project; the May 2026 changelog records the package namespace migration. This verifies the owner’s reading of Pi as the former Mario Zechner/pi-mono terminal coding agent. [npm release metadata](https://registry.npmjs.org/@earendil-works/pi-coding-agent/latest), [release ref](https://api.github.com/repos/earendil-works/pi/git/ref/tags/v0.99.2), [old repository README](https://raw.githubusercontent.com/badlogic/pi-mono/main/README.md), [tagged changelog](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

**Evidence standard.** Source and type inspection are rung 2 (“pointed at the line”), not rung 4 (“ran it”) or rung 5 (“reproduced live”). Official gallery numbers are observations of displayed, rolling counters, not independently measured unique users. Effort estimates and recommendations are inference. The dossier does not elevate a missing search hit into proof of absence.

**Forge context used.** The supplied [north star](../north-star.md) requires reusable public blocks, configurable composition, one Forge npm artifact, optional UI/cloud, third-party block participation and a reference workflow rather than a mandatory product-wide TDD ladder. The supplied [P7 plan](../platform/P7-harness-plugins.md) is the comparison target. Kernel authority remains separate from the harness transcript. These are the active planning inputs [read], not a claim about implementation already on a remote branch.

## 1. Architecture

### 1.1 Runtime layers and the actual loop

The useful split is **provider/transcript layer → agent engine → coding session/runtime → mode/UI**. The `pi-ai` layer normalizes provider models, streaming events and transcript messages. `pi-agent-core` owns the loop, queued input and tool execution. `pi-coding-agent` adds resources, extensions, persistent sessions, compaction, retry and mode handling. Pi’s TUI is a presentation layer. A Forge extension belongs in the coding runtime and should leave the core loop, editor and model selection native. [agent package architecture](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/README.md), [agent loop](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/agent-loop.ts#L163), [AgentSession](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L475), [SDK assembly](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/sdk.ts)

The source loop does the following:

1. Consume pending steering, prepare a turn, and obtain the current context/model/thinking configuration.
2. Prepare and stream a provider request; stream events and completed messages become agent events.
3. If the assistant emitted tool calls, validate and prepare calls, execute the batch, append results, and evaluate the turn boundary.
4. Consume steering before the next turn. A follow-up message is consumed when the run would otherwise stop.
5. Continue when tools, queued input, or a boundary continuation require it; otherwise emit the run end.
6. On assistant error or abort, finish the boundary and emit `turn_end`/`agent_end` without executing that assistant’s tool calls. A length-truncated assistant with tool calls receives synthetic error results rather than executing incomplete arguments.

The inspected loop has no universal iteration limit around extension-requested continuation. A Forge continuation policy must carry its own budget and stop rule. [loop and stopping paths](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/agent-loop.ts#L163)

**Parallelism matters to enforcement.** Tool execution is parallel by default. A sequential configuration, or any call whose tool has `executionMode: "sequential"`, makes the whole batch sequential. Preparations and before-call checks occur in call order; parallel execution then uses a batch promise. Result messages preserve original call order, while completion/update events may interleave. An abort is cooperative. A tool result’s `terminate: true` stops continuation only when every completed result in the batch requests termination; it does not cancel sibling effects already underway. [batch execution](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/agent-loop.ts#L508)

**Dispatch order:** `prepareArguments` → schema validation → before-call hook → execution → after-call/result hook. The validated argument object is passed to the hook; a hook may mutate it, and the loop does not perform a second schema validation after that mutation. Denial, invalid arguments, unknown tools and thrown execution errors become tool error results. Input rewriting therefore needs its own invariant check. [dispatch and reusable runToolCall](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/agent-loop.ts#L508), [nested execution wiring](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L701)

**Completion has two meanings.** `agent_end` ends a core run; AgentSession may then retry, compact, summarize or continue. `agent_settled` means automatic work has settled. A Forge headless supervisor must use settlement plus expected outputs, not the first `agent_end`. Session boundary drafts are committed through AgentSession and persisted before the next request consumes the resulting context. [session event handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L832), [settlement handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L1044), [boundary hooks](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L1820)

### 1.2 Context assembly, instructions and compaction

The default system prompt is assembled from selected tools, tool snippets/guidelines, rules/documentation, addenda, project context, advertised skills and cwd. A custom system prompt replaces the default content but still participates in structured assembly. `before_agent_start` exposes `NormalizedBuildSystemPromptOptions`, including mutable structured sections; valid section keys are lowercase identifiers matching `^[a-z][a-z0-9_-]*$`, except the reserved preamble. Prefer one bounded `forge_context` section over rewriting the entire prompt. [system prompt assembly](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/system-prompt.ts#L121), [before-agent-start transformation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts#L1411)

Instructions are distinct from trusted project configuration. Pi reads one candidate per directory, in this order: `AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`. It includes the agent-directory file and ancestor files from filesystem root toward cwd. An override suppresses other candidates only in the same directory. These files do **not** require project trust. A nested linked worktree’s own context file can shadow the main checkout’s equivalent so it is not injected twice. The inspected candidate list contains no `MEMORY.md`; that narrow observation is not a claim about every extension’s memory behavior. [configuration](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/configuration.md), [candidate list and worktree handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/resource-loader.ts#L185)

Trusted `.pi/SYSTEM.md` and `.pi/APPEND_SYSTEM.md` override the corresponding agent-directory files rather than concatenating both scopes. Skills are initially advertised by name/description/path, not fully injected. The system-prompt builder’s skill advertisement depends on selecting `read` or `bash`; a PowerShell-only tool selection should not assume the same automatic catalog. A Forge resource hook or bounded structured section can supply discoverability explicitly. [configuration precedence](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/configuration.md), [skill advertisement condition](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/system-prompt.ts#L121), [skill prompt formatting](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/skills.ts#L355)

Two context hooks have different safety contracts. `context` sees messages without system messages; the runner restores system/tool messages around each handler. `context_with_system` receives the full transcript and uses its result verbatim. A careless handler on the latter can remove instructions or break tool-result pairing. Neither hook should be used to erase failed authorization evidence. [context runner](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts#L1289)

Automatic compaction is enabled by default, with `reserveTokens: 16384` and `keepRecentTokens: 20000`, subject to configuration/model overrides. It runs near the context limit and on overflow recovery; it can occur before a user prompt or between turns after tool results. The compaction entry records summary, kept-entry boundary, token estimate, optional details/usage and a system-message snapshot. Split turns preserve a prefix summary, and file operations are tracked. Those summaries are model context, not complete audit receipts. `session_before_compact` can cancel or replace compaction; `session_compact_failed` provides a distinct failure signal. [compaction algorithm and defaults](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/compaction/compaction.ts), [compaction reference](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/compaction.md), [session retry/compaction implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts)

### 1.3 Session persistence, resume, forks and context edits

Coding sessions use JSONL format version 3. The header is `{type:"session",version:3,id,timestamp,cwd,parentSession?}`; entries form a tree through `id` and `parentId`. Default storage is under `<agent-dir>/sessions/--<escaped-cwd>--/`, with timestamp/id filenames; slash, backslash and colon participate in cwd escaping. `--session`, `--resume`, `--fork`, `--session-id`, `--session-dir` and ephemeral `--no-session` are separate controls. The runtime resolves the session’s cwd before creating cwd-bound project services. [format](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/session-format.md), [SessionManager](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/session-manager.ts), [session selection](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/main.ts#L674)

Entry kinds in the inspected coding-session union are `message`, `thinking_level_change`, `model_change`, `usage`, `compaction`, `branch_summary`, `custom`, `custom_message`, `context_edit`, `label`, and `session_info`. SessionManager is the canonical source of projected provider history. Assigning `agent.state.messages` is not a durable override of future history. A `context_edit` replaces or omits content in model context while leaving raw transcript/UI evidence intact. [entry definitions and projection](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/session-manager.ts#L183), [0.87 authority change](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

Use `appendEntry(customType,data)` for Forge receipt references excluded from LLM context. Use `sendMessage` for a custom message the model should see; `display:false` hides it from normal presentation but does not make its content private or exclude it from the model. Details are metadata, not automatically model text. Resume/fork/new-session/reload can replace session/runtime references: old `pi`/context references must not be retained as live authority. Rebind on `session_start`, clean up idempotently, and recheck any lease through Forge. [extension persistence API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1540), [session format](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/session-format.md), [replacement semantics in changelog](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

Do not confuse the coding-session JSONL format with the separate agent-harness/session-repository work discussed in the protocol/client packages and changelog. Their storage/API changes do not establish a new coding-session wire format. [coding-session format](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/session-format.md), [protocol package](https://github.com/earendil-works/pi/blob/v0.99.2/packages/protocol/README.md)

### 1.4 Configuration and resource precedence

The agent directory defaults to `~/.pi/agent`, overridable by `PI_CODING_AGENT_DIR` or SDK `agentDir`. User `settings.json` loads before trusted cwd `.pi/settings.json`; ordinary nested objects merge and project values override, while ordinary arrays replace. Resource lists are resolved from both scopes rather than treating that generic array rule as the whole loader. `defaultTools` supports delta-style additions/removals. CLI/SDK overrides sit above file configuration. `defaultProjectTrust` is global-only. `sessionDir` is the exception read before project trust to locate sessions, with `PI_CODING_AGENT_SESSION_DIR` and `--session-dir` above it. [configuration](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/configuration.md), [settings schema](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/settings.md), [settings manager](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/settings-manager.ts), [pre-trust lookup](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/main.ts#L674)

The CLI’s DefaultResourceLoader, rather than a low-level extension-directory helper in isolation, defines effective precedence:

| Priority | Resource source |
|---|---|
| Highest | Explicit CLI resources, prepended by the loader |
| 0 | Project settings resource entry |
| 1 | Project automatically discovered resource |
| 2 | User settings resource entry |
| 3 | User automatically discovered resource |
| 4 | Package resource |
| 5 | Built-in extension |

Project packages normally replace same-identity global package declarations; a project entry with `autoload:false` instead applies a filtering delta to the personal declaration. Real paths deduplicate symlinks. Skill, prompt and theme name collisions use first-wins ordering with diagnostics. Tool registration also uses a first winner; shortcuts have their own collision/reserved-key rules, so there is no single collision rule for every API. [resource load ordering](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/resource-loader.ts#L505), [resource ranks](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts#L178), [extension runner collision handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts)

Startup can load user/explicit extensions before resolving project trust so a trust extension can decide. Only after that decision does it load trusted project settings/packages/resources. Preloaded extension instances are reused in the final ordered set. Therefore an extension factory should register capabilities, not start background processes or timers before session binding. Project `.pi` configuration is cwd-local; `.agents/skills` has a separate ancestor walk toward the repository root. [two-pass loader](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/resource-loader.ts#L505)

### 1.5 Models, providers and routing

`models.json` supplies compatible endpoints, model metadata and overrides; the extension API can register a complete `Provider` or legacy `ProviderConfig`. A complete provider is the preferred API for a new provider integration. Legacy configuration accepts endpoints, headers, API-key references, implementations, model definitions, refresh and OAuth callbacks. Supplying a legacy `models` list replaces all models for that provider across chat/image/classifier operations; supplying only endpoint/headers preserves the built-in catalog. Native providers and `models.json` overrides compose. Forge should use Pi’s selection/catalog layer rather than duplicate it. [provider documentation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/custom-provider.md), [provider types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1870), [model registry](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/model-registry.ts)

The SDK uses `ModelRuntime`; older examples passing `AuthStorage`/`modelRegistry` directly no longer describe the current factory contract. Provider hooks allow request-payload replacement, header mutation and stream observation; treat headers/payloads as credential-bearing and avoid logging them wholesale. [SDK types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/sdk.ts), [provider lifecycle types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L867)

0.99 adds experimental virtual models. A definition carries provider/id/name and optional thinking levels/context window/max tokens/input plus `route(request,ctx)`. The request includes `model`, `thinkingLevel`, reason `user|continuation|retry|direct`, previous selection, failed selection/message, branch state, normalized messages and signal. It returns physical model, thinking level and optional JSON state. Session state is stored in a `pi.virtual-model-state` custom entry; direct calls do not commit branch state. The selected model may stay virtual while assistant messages/usage record the physical provider. This is a possible carrier for a configured Forge routing block, not a reason to make Forge the harness’s mandatory router. [virtual-model API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1850), [routing implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/virtual-models.ts)

## 2. Extension surfaces, exhaustively

### 2.1 Package and extension module contracts

A Pi package is an npm package, git checkout or local directory carrying resources. Runtime `package.json` recognizes a `pi` object with optional string arrays `extensions`, `skills`, `prompts`, `themes`. Unknown fields are ignored by the resource manifest reader; an invalid recognized field is omitted. A valid empty `pi` object is still a manifest and suppresses conventional resource inference. Without a manifest, conventional resource directories are used. `keywords:["pi-package"]` makes an npm package eligible for gallery discovery; it is not a runtime prerequisite. Preview metadata `pi.image`/`pi.video` is gallery metadata, not one of the four runtime resource arrays. [manifest parser](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/pi-manifest.ts), [package resource collection](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts#L2214), [package documentation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/packages.md#L42)

An extension is a TypeScript/JavaScript module with a default factory `(pi: ExtensionAPI) => void | Promise<void>`. Pi uses jiti for module loading and shared runtime dependency aliases. Automatic extension discovery accepts direct `.ts`/`.js` files, directory `index.ts`/`index.js`, or a directory manifest’s declared extension paths. Auto-directory discovery is shallow; explicit package paths/globs permit other layouts. Factories load sequentially and are awaited, without a universal factory deadline. Registration queues can be discarded on failure, but Pi cannot undo arbitrary import-time filesystem/process/network effects. Failures become diagnostics, not a sandbox rollback. [extension guide](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/extensions.md), [loader](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/loader.ts), [factory type](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1990)

Install/update surfaces include `pi install npm:<package>@<version>`, `pi install git:<repository>@<ref>`, local directories, `-l` project installation, `pi list`, `pi remove`, `pi update`, and temporary `pi -e <source>`. Temporary use still may download/install and execute code; it is not a safety mode. Global npm resources live under the agent directory’s npm area, project installs under `.pi/npm`, and temporary resolutions use temporary roots. Exact pins remain source declarations; update floating sources deliberately. Host Pi libraries belong in `peerDependencies` so extension code shares runtime types/state rather than installing another Pi copy. [packages](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/packages.md), [package manager](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts)

**Lifecycle scripts are a source-confirmed trust surface.** The npm installer builds `npm install ... --prefix <root> --legacy-peer-deps`, without `--ignore-scripts`. Git dependency installation similarly uses `npm install --omit=dev --legacy-peer-deps`. This permits ordinary npm lifecycle behavior unless npm/user configuration suppresses it. It corrects P7’s “undocumented” treatment; do not extrapolate these npm flags to every supported package manager. Package import code and dependencies also run with host privileges. [npm arguments](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts#L1845), [git dependency installation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts#L1821), [security model](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/security.md)

Settings resource declarations have `extensions?:string[]`, `skills?:string[]`, `prompts?:string[]`, `themes?:string[]`, and `packages?:PackageSource[]`. `PackageSource` is either a source string or `{source:string,autoload?:boolean,extensions?:string[],skills?:string[],prompts?:string[],themes?:string[]}`. `autoload:false` starts without automatically selected resources, then applies explicit patterns. Arrays accept globs; `!pattern` excludes glob matches and `-path` excludes an exact path. Filters narrow the package manifest and cannot expose undeclared resources. Dot-prefixed/symlink resource roots should be listed directly where glob traversal would miss them. This is resource selection, not a permission boundary. [settings/source type](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/settings-manager.ts#L114), [package filter and precedence](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/packages.md)

### 2.2 All lifecycle events and return contracts

The table enumerates **all 41 overloads of `ExtensionAPI.on()` in 0.99.2**. Every payload includes `type` equal to the event name; the column lists the remaining fields. `?` means optional. Handlers receive `ExtensionContext` unless noted and may return synchronously or asynchronously. Exact imported types are named instead of inventing a flattened schema. [event definitions](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L666), [all on overloads](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1540), [dispatch implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts)

| Event | Exact payload beyond type | Return/effect and timing |
|---|---|---|
| `project_trust` | `cwd: string` | `{trusted:"yes"|"no"|"undecided",remember?:boolean}`; first decisive result. Special trust context before project resources. |
| `resources_discover` | `cwd, reason:"startup"|"reload"` | `{skillPaths?:string[],promptPaths?:string[],themePaths?:string[]}`; additive paths after binding/discovery. No extension-path field. |
| `session_start` | `reason:"startup"|"reload"|"new"|"resume"|"fork", previousSessionFile?:string` | Void; initialize/rebind current session. |
| `session_info_changed` | `name:string|undefined` | Void; session-name change. |
| `session_before_switch` | `reason:"new"|"resume", targetSessionFile?:string` | `{cancel?:boolean}`; veto switch before replacement. |
| `session_before_fork` | `entryId:string, position:"before"|"at"` | `{cancel?:boolean,skipConversationRestore?:boolean}`; control fork. |
| `session_before_compact` | `preparation:CompactionPreparation, branchEntries:SessionEntry[], customInstructions?:string, reason:"manual"|"threshold"|"overflow", willRetry:boolean, signal:AbortSignal` | `{cancel?:boolean,compaction?:CompactionResult}`; cancel or supply complete summary result. |
| `session_compact` | `compactionEntry:CompactionEntry, fromExtension:boolean, reason, willRetry:boolean` | Void after committed compaction. |
| `session_compact_failed` | `reason, errorMessage?:string, aborted:boolean, willRetry:boolean, fromExtension:boolean` | Void; observe failed/cancelled compaction separately. |
| `session_shutdown` | `reason:"quit"|"reload"|"new"|"resume"|"fork", targetSessionFile?:string` | Void; release owned services before old session ends. |
| `mcp_servers_change` | `servers:RegisteredMcpServer[]` | Void; post-bind registration changes. Initial registrations are available through `getMcpServers()` at startup. |
| `session_before_tree` | `preparation:TreePreparation, signal:AbortSignal` | `{cancel?,summary?:{summary,details?,usage?},customInstructions?,replaceInstructions?,label?}`; tree navigation/summary control. |
| `session_tree` | `newLeafId:string|null,oldLeafId:string|null,summaryEntry?:BranchSummaryEntry,fromExtension?:boolean` | Void after navigation. |
| `context` | `messages:AgentMessage[]` | `{messages?:AgentMessage[]}` or mutation; pre-request, system messages excluded/restored. |
| `context_with_system` | `messages:AgentMessage[]` | Same return; full transcript used verbatim. |
| `cache_warming_decision` | `warmCost:number,missCost:number,continuationProbability:number,action:"warm"|"stop"` | `{action?:"warm"|"stop"}`; last returned action wins. |
| `before_provider_request` | `payload:unknown` | `unknown` replacement; undefined preserves payload. Provider-specific wire object, before send. |
| `before_provider_headers` | `headers:ProviderHeaders` | Return ignored; mutate headers in place; null removes a header. |
| `after_provider_response` | `status:number,headers:Record<string,string>` | Void after response headers, before body consumption. |
| `provider_stream_event` | `provider:ProviderId,api:Api,model:string,data:unknown` | Void; adapter-owned raw stream data is read-only. |
| `before_agent_start` | `prompt:string,images?:ImageContent[],readonly systemPrompt:string,systemPromptOptions:NormalizedBuildSystemPromptOptions` | `{message?:{customType,content,display,details?},systemPrompt?:string}`; structured options also mutable before the run. |
| `agent_start` | No additional fields | Void at core-run start. |
| `agent_end` | `messages:AgentMessage[]` | Void at core-run end; automatic retry may follow. |
| `agent_before_settle` | `BoundaryState` fields below | `BoundaryResult`; commit drafts/request continuation before final settlement. |
| `agent_settled` | No additional fields | Void after automatic work settles. |
| `ui_prompt_start` | `reason:"ui_prompt",kind:"select"|"confirm"|"input"|"editor"|"custom",title?:string` | Void around extension UI prompt. |
| `ui_prompt_end` | Same fields as start | Void when prompt ends. |
| `turn_start` | `turnIndex:number,timestamp:number` | Void at each turn start. |
| `turn_end` | `turnIndex:number,message:AgentMessage,toolResults:ToolResultMessage[],messageEntryId:string,toolResultEntryIds:string[]` plus boundary state below | `BoundaryResult`; actionable persisted entry references, after turn. |
| `message_start` | `message:AgentMessage` | Void before a message streams/is added. |
| `message_update` | `message:AgentMessage,assistantMessageEvent:AssistantMessageEvent` | Void; native extension receives cumulative message and delta event. |
| `message_end` | `message:AgentMessage` | `{message?:AgentMessage}`; replacement must preserve role. |
| `tool_execution_start` | `toolCallId:string,toolName:string,args:any,parentToolCallId?:string` | Void at execution start. |
| `tool_execution_update` | Same start fields plus `partialResult:any` | Void during updates. |
| `tool_execution_end` | `toolCallId,toolName,result:any,isError:boolean,parentToolCallId?:string` | Void at execution end. |
| `model_select` | `model:Model,previousModel:Model|undefined,source:"set"|"cycle"|"restore"` | Void after model selection. |
| `thinking_level_select` | `level:ThinkingLevel,previousLevel:ThinkingLevel` | Void after thinking-level change. |
| `tool_call` | `toolCallId,toolName,input:built-in-specific input|Record<string,unknown>,parentToolCallId?:string` | Mutate input in place or `{block?:boolean,reason?:string,terminate?:boolean}`; before effect. |
| `tool_result` | `toolCallId,toolName,input:Record<string,unknown>,content:(TextContent|ImageContent)[],structuredContent?:JsonValue,isError:boolean,usage?:Usage,details:tool-specific|unknown,parentToolCallId?:string` | `{content?,details?,structuredContent?,isError?,usage?}`; compose transformed results. |
| `user_bash` | `command:string,excludeFromContext:boolean,cwd:string` | Undefined for normal execution, `{operations:BashOperations}` to substitute operations, or `{result:BashResult}` to supply result. |
| `input` | `text:string,images?:ImageContent[],source:"interactive"|"rpc"|"extension",streamingBehavior?:"steer"|"followUp"` | `{action:"continue"}`, `{action:"transform",text,images?}`, or `{action:"handled"}`; before skill/template expansion. |

**Boundary types.** `BoundaryState = {entries:SessionBoundaryDraft[],continue:boolean,context:BoundaryContextPreview,outcome:"completed"|"aborted"|"error"}`. Return `{entries?,continue?}`. Returned entries replace the accumulated draft list; append with `[...event.entries,draft]` when preserving earlier handlers. Draft variants: `custom {customType,data?}`; `custom_message {customType,content,display,details?}`; `context_edit {targetId,replacement:{content}|null}`; `compaction {summary,firstKeptEntryId:string|null,details?,usage?}`. Preview contains `contextEntries:ProjectedSessionEntry[]`, `contextMessages:AgentMessage[]`, `llmMessages:Message[]`, `pendingMessages:AgentMessage[]`, `canContinue:boolean`. [boundary types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L930)

**Tree/compaction types.** `TreePreparation = {targetId,oldLeafId:string|null,commonAncestorId:string|null,entriesToSummarize:SessionEntry[],userWantsSummary:boolean,customInstructions?,replaceInstructions?,label?}`. `CompactionPreparation` contains `firstKeptEntryId`, `messagesToSummarize`, `turnPrefixMessages`, `isSplitTurn`, `tokensBefore`, `previousSummary?`, `fileOps:FileOperations`, and settings `{enabled,reserveTokens,keepRecentTokens}`. `CompactionResult = {summary,firstKeptEntryId,tokensBefore,estimatedTokensAfter?,usage?,details?}`. Preserve these entry-boundary contracts when replacing summaries. [tree types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L790), [compaction types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/compaction/compaction.ts)

**Context/API availability.** Ordinary handlers receive `ui`, `mode:"tui"|"rpc"|"json"|"print"`, `hasUI`, `cwd`, read-only SessionManager, model registry/current model/scoped models/thinking level, `isIdle()`, `isProjectTrusted()`, signal, `abort()`, `hasPendingMessages()`, `shutdown()`, `getContextUsage()`, `compact()` and `getSystemPrompt()`. The trust context instead exposes cwd/mode/hasUI and a reduced UI of select/confirm/input/notify. Tool execution context adds the callable tool registry and `executeTool`. Command context adds idle/session/fork/tree/switch/reload operations. [contexts](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L325)

**Timing/failure semantics.** `on()` returns an unsubscribe function; dispatch snapshots handlers and generally awaits them sequentially. There is no general hook timeout. Most hook failures are reported and dispatch continues; tool-call failures propagate into the tool-error path, and `user_bash` failures block execution. Trust-handler failures are collected and fallback trust resolution remains necessary. Transformation hooks chain in their defined order; input `handled` and a user-bash substitute stop that path. For result transformation, replacing `content` without supplying corresponding `structuredContent` clears the latter to avoid stale structured data. A Forge deny handler must be bounded, fail closed and return a clear reason; never delegate its decision to an unawaited event bus. [tool/result/bash runner](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts#L1174), [input chaining](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts#L1511), [shared event bus](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/event-bus.ts)

### 2.3 Custom tools, registry visibility and nested execution

Required ToolDefinition fields are `name`, `label`, `description`, `parameters:TSchema`, and `execute(toolCallId,params,signal,onUpdate,ctx):Promise<AgentToolResult>`. Optional fields are `promptSnippet`, `promptGuidelines`, `constrainedSampling`, `renderShell:"default"|"self"`, `prepareArguments`, `outputSchema`, `exposure`, `namespace`, `annotations`, `defaultActive`, `prepareLoadout`, `executionMode`, `renderCall` and `renderResult`. Use current `typebox`, not a copied pre-0.69 TypeBox import. Results carry `content`, `details` and optional `isError`, `structuredContent`, `usage`, `terminate`. Tools must bound/truncate their own output and honor cancellation; an output schema is not a side-effect permission. [ToolDefinition](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L565), [agent tool/result types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/types.ts)

Visibility is a two-axis contract: declaration to the model versus reachability by tools.

| Exposure | Model declaration | Nested execution |
|---|---|---|
| `direct` | When active | Active direct tools are callable |
| `model-only` | When active | Not callable through nested execution |
| `codemode` | Normally omitted from direct model loadout | Callable while registered |
| `deferred` | Discoverable/activatable | Callable while registered |
| `hidden` | Omitted | Unreachable even if an activation is attempted |

The session filters the registry using tool selection/exclusion before constructing the callable set. A registered-but-inactive codemode/deferred tool is callable; this does not mean a CLI-excluded tool survives registry filtering. `prepareLoadout` can alter descriptions/hide declarations but does not turn hiding into authorization. Namespace metadata is `{name,description?,instructions?}`; annotations such as `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` are author-supplied hints. [exposure types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L565), [callable registry](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L1495), [registry selection](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L3395)

`ctx.executeTool(name,args,{signal?,onUpdate?})` executes a nested tool through the normal before/after pipeline and emits execution events with `parentToolCallId`. Nested calls do not create independent assistant/tool-result transcript messages. The parent result records a bounded `nestedCalls` summary: at most 256 calls, bounded argument bytes (8 KiB per call, 32 KiB total), no complete nested result bodies, and a completeness flag when truncated. Usage is aggregated without double-counting. These summaries are useful cross-links but cannot prove every nested action; Forge must retain complete receipts in its own store. [nested runner](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts#L701), [nested tool API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts), [agent nested-call types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/types.ts)

### 2.4 Skills, templates, commands and other registrations

A skill is Markdown with YAML frontmatter, conventionally `<skill>/SKILL.md`. Recognized behavior includes `name` (directory fallback), required nonempty `description`, and `disable-model-invocation:true`. Name rules are lowercase letters/digits/hyphens, at most 64 characters, no edge or consecutive hyphens; descriptions have a 1024-character limit. Validation diagnostics do not uniformly prevent loading: missing description/parsing failures differ from naming warnings. License, compatibility, metadata and `allowed-tools` are metadata, not Pi runtime enforcement. Forge’s `invocation:user` is not a Pi-native restriction; use a compatible `disable-model-invocation` projection if the skill must remain explicitly invoked. [skill format](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/skills.md), [parser and validation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/skills.ts#L256)

Skills load from agent/project skill directories, settings/package paths, explicit paths, user `~/.agents/skills` and project ancestor `.agents/skills` directories up to the repository boundary, subject to trust for project resources. Discovery is recursive, applies `.gitignore`, `.ignore`, `.piignore`, canonicalizes symlinks, and diagnoses name collisions. Explicit `/skill:name` expands the skill text and arguments; turning off advertised skill commands does not make manually entered skill expansion an authorization boundary. [skill discovery](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/skills.ts#L409), [resource integration](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/resource-loader.ts)

Prompt templates are `.md` files with optional description/argument-hint frontmatter; filenames define slash-command names. Conventional prompt discovery is shallow rather than the skill recursion rule. Substitutions include `$1`, `$2`, `$@`, `$ARGUMENTS`, `${1:-default}`, `${@:-default}`, `${@:N}`, `${@:N:L}`; argument parsing supports quotes. A registered extension command resolves before the input hook; otherwise input handlers see the raw text before skill/template expansion and `before_agent_start`. Namespace Forge commands under `/forge` so generic `/review` or `/plan` names do not silently select the wrong resource. [templates](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/prompt-templates.md), [template implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/prompt-templates.ts), [prompt routing](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts)

`registerCommand(name,{description?,getArgumentCompletions?,handler(args:string,ctx:ExtensionCommandContext)})` provides native commands; handlers are awaited and have session-management methods unavailable to ordinary tool context. RPC invokes these through `prompt`, not extension-defined arbitrary RPC endpoints. `registerFlag` supports boolean/string extension flags; `registerShortcut` supports keybindings with reserved/collision handling. `registerMessageRenderer`, `registerEntryRenderer` and `registerMarkdownTransformer` customize presentation. [registration API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1540)

The remaining API surface is `sendMessage` (delivery `steer|followUp|nextTurn`, optional triggerTurn), `sendUserMessage` (including template-expansion control), `appendEntry`, `setSessionName/getSessionName`, `setLabel`, `exec`, `getActiveTools/getAllTools/setActiveTools`, `getSettings`, `getCommands`, `setModel`, `getThinkingLevel/setThinkingLevel`, provider registration/removal, MCP registration/removal/query, virtual-model registration/removal and `pi.events`. These registrations are not a generic persisted settings-write API. The shared event bus wraps EventEmitter: emission does not await asynchronous subscribers, and failures are logged. Use it for integration notifications, not gate decisions or durable receipts. [full API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1540), [event bus implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/event-bus.ts)

### 2.5 MCP: schema, discovery, authentication and effect pipeline

Native MCP is implemented as built-in extensions in the coding agent starting with 0.99.0. In 0.99.2 the configuration is `<agent-dir>/mcp.json` plus trusted cwd `.pi/mcp.json`, shaped as `{mcpServers:{<name>:<entry>},autoEnableCodemode?:boolean}`. Project definitions override same-name global definitions. Names use letters/digits/underscore/hyphen; normalized collisions are rejected. Invalid entries are skipped with diagnostics rather than discarding unrelated valid servers. [MCP reference](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L30), [configuration parser](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/extensions/mcp/config.ts#L75), [server schema](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/mcp-servers.ts#L17)

| Configuration surface | Exact supported fields/behavior |
|---|---|
| Common | `enabled?:boolean` (default true), `description?:string`, `exposure?:"codemode"|"deferred"|"direct"|"hidden"` (default codemode), `toolExposure?:Record<string,exposure>`, `timeout?:number` in positive seconds (default 60) |
| Stdio | `type?:"stdio",command:string,args?:string[],env?:Record<string,string>,cwd?:string`; command is spawned directly, not a shell expression; relative cwd resolves from session cwd |
| HTTP | `type?:"http"|"streamable-http",url:string,headers?:Record<string,string>,oauth?:OAuthConfig,auth?:{provider:string}`; URL must be HTTP(S); SSE is not a supported transport value |
| OAuth | `clientId?`, `clientSecret?`, `callbackPort?` (1–65535), `callbackUrl?` (HTTP loopback localhost/127.0.0.1/[::1], no query/fragment), `scope?` (space-separated), `clientName?` (default Pi name) |
| Provider-login auth | Reuse a configured Pi provider’s credentials per request; forbidden from project mcp.json; HTTPS required except loopback |
| Exposure map | Exact tool name wins over wildcard patterns; otherwise first matching pattern supplies exposure |
| Value expansion | Environment/header/client-secret substitutions support `${NAME}`; whole-value `!command` forms execute commands and belong in the executable trust assessment |

OAuth supports pre-registered clients, dynamic registration, login and refresh; MCP tokens persist in `<agent-dir>/mcp-auth.json`. These are credential storage locations, not files to print. Provider login references credentials already managed by Pi; extension/global configuration can use it where project configuration cannot. A Forge server should prefer environment/provider references or user-owned authentication, not embed secrets in package settings. [auth contract](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L105), [schema and validation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/mcp-servers.ts#L55)

Enabled servers connect in the background. The first prompt waits up to ten seconds for servers whose tools may need direct declaration, rather than waiting for every default codemode server. A named codemode namespace waits for its server; all-server catalog/search/resource operations can wait for all connections. Per-server timeout is reset by progress notifications. HTTP connection requests may retry network errors, 408, 429 and 5xx twice, but actual tool calls are not automatically retried because side effects may already have happened. [connection behavior](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L84), [MCP extension](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/extensions/mcp/index.ts)

Registered names are `mcp__<server>__<tool>`, with normalization and collision hashes where necessary. Default codemode exposure keeps the entire tool catalog out of direct declarations and, in 0.99.2, out of an inline codemode description. A short `mcp_servers` system section advertises servers; discovery helpers `searchTools`, `describeTool`, `describeNamespace` and `ALL_TOOLS` fetch details. Direct tools are immediately declared; deferred tools are search-discovered and become active on a later request; hidden tools are unreachable. This gives Forge a native way to advertise a small entry point while retaining a large block catalog. [exposure/discovery](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L150), [0.99.2 discovery changes](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

MCP calls pass through normal `tool_call` and `tool_result` hooks, including calls originating inside codemode with a parent call id. Source inspection therefore supports a real pre-effect deny point for that path. It does not prove a particular Forge deny implementation works. Text results over 20 KB are middle-truncated for model display with a full temporary-file path; codemode receives the fuller `CallToolResult` with content, structuredContent and isError. A returned MCP error flag is structured data and must be checked by a script; it is not automatically a thrown JavaScript exception. [result and hook pipeline](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L191)

Resource helpers are `list_mcp_resources`, `list_mcp_resource_templates`, and `read_mcp_resource`. Pi excludes MCP Apps-style `ui://` and HTML app resources from this resource path; do not assume connector app UI is a native Pi TUI extension. This research found no need to invent a separate Pi-native MCP prompt contract beyond the inspected MCP surfaces. [resource handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L195)

`pi.registerMcpServer(name,config)`, `unregisterMcpServer(name)`, and `getMcpServers()` allow session extension servers. Late registration connects now; unregistering closes/hides the server; a same-extension replacement is allowed while another extension’s duplicate registration is rejected. File configuration with the same key wins. The standalone `pi mcp` CLI does not load extension-registered servers. The runtime’s “MCP handled” check observes a handler registration, not a successful live connection; installed proof must make a real fixture call. [registration](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/mcp.md#L215), [built-in bridge](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/extensions/mcp/index.ts#L128), [handler check](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts#L751)

**Codemode’s isolation boundary.** Model-written JavaScript runs in a QuickJS WASM worker with a 256 MiB memory limit. Its default overall execution deadline is infinite; an MCP request timeout does not impose a total script deadline. Globals include `tools`, `ALL_TOOLS`, `console`, `text`, `image`, `exit`, `store`, `load` and catalog helpers. The codemode tool itself is model-only to prevent recursive nested execution. Native tool calls use `ctx.executeTool`; VM isolation does not isolate the OS effects of those tools, and a script failure/abort does not roll back effects already completed. Forge should impose configured time/cost/effect budgets at its block boundary. [codemode tool](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/extensions/codemode/tool.ts#L412), [worker execution and limits](https://github.com/earendil-works/pi/blob/v0.99.2/packages/codemode/src/executor/execute.ts#L43), [nested dispatch](https://github.com/earendil-works/pi/blob/v0.99.2/packages/codemode/src/executor/execute.ts#L237), [script globals](https://github.com/earendil-works/pi/blob/v0.99.2/packages/codemode/src/types.ts#L92)

### 2.6 Trust, permissions and sandboxing

Project trust controls local executable configuration/resources; `--approve` trusts for the run, `--no-approve` declines, and a project-trust extension can supply a decision. User/explicit extensions are already executable before that decision. Context files remain a separate trust exception. Declining project trust is not an OS sandbox, read-only filesystem promise, or restriction on user-installed extension code. Pi’s security documentation explicitly describes the agent/extension risk. [security](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/security.md), [trust loader](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/resource-loader.ts#L505), [CLI approval flags](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/cli/args.ts#L229)

Tool selection, exposure, MCP annotations and skill frontmatter are not a unified permission policy. A native `tool_call` gate can prevent the guarded tool’s effect, and `user_bash` can intercept user shell commands, but a full-trust extension can call Node APIs or `pi.exec` outside the model tool pipeline. File hooks and Forge service authorization must carry their own guarantees. Do not market “all actions denied by Forge” unless the actual effect paths and service enforcement are proven. [extension API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts), [security model](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/security.md)

### 2.7 Subagents and custom agents

Pi’s inspected coding loop does not require a built-in multi-agent orchestrator. The official subagent example shows this capability as an extension: a `subagent` tool supports single, parallel and chain execution, reads user agent definitions from the agent directory’s `agents` area and optional project `.pi/agents`, and spawns independent Pi child processes. Project-agent confirmation is an example-specific feature, not a platform-wide authority mechanism. [official subagent example](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/examples/extensions/subagent/index.ts)

The example launches `--mode json -p --no-session`, passes selected/inherited model and thinking settings unless overridden, optionally selects tools, and uses the requested cwd. Children have separate process/session state. Parent Forge leases, receipt correlation, budgets and gate state are not automatically a durable shared contract merely because child resource discovery can load similar extensions. Reuse community subagent extensions for optional reviewers; propagate an explicit Forge capability/lease reference and prove authorization at the service. Do not introduce another orchestrator into Forge 0.1 merely to mirror the example. [child invocation and result collection](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/examples/extensions/subagent/index.ts)

### 2.8 SDK, RPC, print and JSON modes

The SDK’s `createAgentSession` composes cwd/agentDir, ModelRuntime, settings, ResourceLoader, SessionManager, selected model/thinking level, tool names/exclusions/custom tools and extension resources. Call loader reload and bind extensions through the intended lifecycle; retain and dispose the returned runtime/session ownership rather than mixing stale objects after replacement. Built-in MCP/codemode/tool search are not silently installed by an arbitrary bare SDK assembly: opt into the built-in extension factories or create the relevant extensions. SDK embedding is appropriate for an existing Forge execution block, not necessary for a normal Pi package. [SDK documentation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/sdk.md), [factory implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/sdk.ts)

The modes have materially different contracts:

| Mode | Invocation | Input/output and UI |
|---|---|---|
| Interactive TUI | `pi` | Native editor, terminal widgets, extension UI; normal persisted sessions |
| Print | `pi -p "prompt"` | Headless final text; `-p` alone does not select JSON |
| JSON | `pi --mode json "prompt"` | Headless JSONL events, session header first, no RPC command input |
| RPC | `pi --mode rpc` | Long-running stdin commands/stdout events and correlated responses; no initial session header |
| SDK | `createAgentSession(...)` | In-process subscription and direct session calls; caller owns lifecycle |

[mode startup](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/main.ts), [print implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/print-mode.ts), [JSON protocol](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/json.md), [RPC protocol](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc.md)

RPC commands in the tagged union are: `prompt`, `steer`, `follow_up`, `abort`, `clear_queue`, `new_session`, `get_state`, `set_model`, `cycle_model`, `get_available_models`, `set_thinking_level`, `cycle_thinking_level`, `get_available_thinking_levels`, `set_steering_mode`, `set_follow_up_mode`, `compact`, `set_auto_compaction`, `set_auto_retry`, `abort_retry`, `bash`, `abort_bash`, `get_session_stats`, `export_html`, `switch_session`, `fork`, `clone`, `get_fork_messages`, `get_entries`, `get_tree`, `get_last_assistant_text`, `set_session_name`, `get_messages`, `get_commands`. UI responses are their separate `extension_ui_response` contract. Responses carry `{type:"response",id?,command,success,data?}` or an error. The accepted `prompt` disposition is `started|queued|handled`, not proof of completion. A handled extension command may never start an agent run; waiting for `agent_settled` in that case is wrong. [exact commands and responses](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-types.ts#L20), [command reference](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc-commands.md)

Native extension event payloads are not identical to wire events. JSON/RPC message updates are delta-only; wire `agent_end` includes `willRetry`, while the native extension event has messages only. Wire `turn_end` does not expose the full actionable boundary state/entry references used by the extension hook. Additional session events include queue updates, entry append/name/thinking changes, compaction start/end, auto retry, summarization retry and bash output; RPC can report extension errors. Parse the published wire types rather than serializing native hook objects and assuming compatibility. [wire types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-types.ts), [JSON event conversion](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/json.md)

Read stdout continuously and split on literal LF only. Unicode U+2028/U+2029 inside JSON strings is valid; line readers that split additional Unicode separators can corrupt the stream. Diagnostics belong on stderr. Register collectors before `prompt` to avoid missing fast events. `abort` does not clear pending queue; use `clear_queue` first when stopping all queued work. Closing stdin performs orderly shutdown; there is no generic RPC `shutdown` command in the inspected union. [RPC framing/lifecycle](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc.md), [RPC mode implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-mode.ts), [client helpers](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-client.ts#L471)

Source-derived warning: the text print branch explicitly exits nonzero for a final assistant error, whereas the JSON branch does not contain the same final-assistant check. JSON exit zero is therefore insufficient success evidence; inspect terminal events/results and expected assertions. This is an inference from control flow, not a reproduced runtime failure. [print/JSON exit handling](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/print-mode.ts#L128)

The exported RpcClient spawns Node with piped stdio, uses a fixed startup delay rather than a protocol readiness handshake, and has no `windowsHide` flag at its inspected spawn. `get_state` is a better readiness probe. Its stop path attempts SIGTERM and then SIGKILL after a deadline. A Forge supervisor should own its process, drain output, bound shutdown and explicitly test Windows console behavior. Do not treat that source observation as a live terminal-flash diagnosis. [client spawn](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-client.ts#L94), [client event waiting](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-client.ts#L471)

The separate `pi-client`/`pi-protocol` packages describe transport-neutral, length-prefixed CBOR/Chord-style service messages, including local-socket transport. They are not the terminal agent’s JSON RPC contract, and their experimental surface is not an authenticated Forge coordination service. Keep the 0.1 integration on coding-agent extensions/public block APIs rather than coupling to this protocol. [client package](https://github.com/earendil-works/pi/blob/v0.99.2/packages/client/README.md), [protocol package](https://github.com/earendil-works/pi/blob/v0.99.2/packages/protocol/README.md)

### 2.9 TUI, output presentation, keybindings and themes

`hasUI` is true for RPC as well as TUI. Use `ctx.mode === "tui"` for terminal components. The UI context exposes the following surfaces; treating them all as portable across modes would be wrong. [complete UI context](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L149), [RPC UI bridge](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc-extension-ui.md)

| Surface | API and contract | Mode limits |
|---|---|---|
| Dialogs | `select`, `confirm`, `input` with optional signal/timeout; `editor(title,prefill?)`; `notify(info|warning|error)` | RPC emits UI requests; headless dummy UI returns cancellation/false |
| Status/progress | `setStatus`, `setWorkingMessage`, `setWorkingVisible`, `setWorkingIndicator({frames?,intervalMs?})`, `setHiddenThinkingLabel` | RPC supports status; several loading/presentation operations are no-ops |
| Widgets | `setWidget(key,string[]|factory,{placement:"aboveEditor"|"belowEditor"})` | RPC supports string arrays, not arbitrary component factories |
| Header/footer/title | `setHeader`, `setFooter(factory(tui,theme,ReadonlyFooterDataProvider))`, `setTitle` | Title bridged to RPC; header/footer components TUI-only |
| Custom components | `custom(factory(tui,theme,keybindings,done),{overlay?,overlayOptions?,onHandle?})` | RPC returns undefined; TUI supports overlays and handles |
| Editor | `pasteToEditor`, `setEditorText`, `getEditorText`, `addAutocompleteProvider`, `setEditorComponent/getEditorComponent` | RPC can set editor text; component/autocomplete behavior is TUI-only |
| Terminal input | `onTerminalInput(data => {consume?,data?}|undefined)` returns unsubscribe | TUI-specific raw input interception |
| Theme/expansion | `theme`, `getAllThemes`, `getTheme`, `setTheme` (success/error), `getToolsExpanded/setToolsExpanded` | Presentation availability depends on mode |

TUI components render arrays of terminal lines via `render(width)`, with optional input/mouse handling, invalidation and disposal. Respect ANSI-visible widths, truncation helpers and focus/cursor marker rules, including IME; request coalesced renders rather than writing raw stdout. A custom editor should extend/preserve Pi’s editor behavior so completion, escape and submit controls remain native. Tool call/result renderers receive theme/render context; message/entry renderers can make Forge receipts readable without building another app shell. [TUI API](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/tui.md), [UI types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L149), [tool render contracts](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L565)

RPC UI requests are `{type:"extension_ui_request",id,method,...}`; clients answer `{type:"extension_ui_response",id,value?|confirmed?|cancelled?}`. Timeouts cancel rather than implicitly authorize. A Forge blocking operation must not interpret a missing dialog client, false, undefined or cancellation as consent. [RPC UI protocol](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc-extension-ui.md)

Themes are JSON, with required `name`/`colors` and optional schema/appearance/vars/export metadata. Required semantic color roles are validated by the tagged schema; values support hex, OKLCH/OKHSL, palette numbers 0–255, variables and empty terminal-default values. The name `system` is reserved. Active user theme files can hot-reload; other resource changes use reload. In 0.99 the system theme follows the terminal palette. Keybindings are agent-directory `keybindings.json`, mapping actions to a key or key array; extension shortcuts complement this with collision handling. Forge needs a small status/receipt renderer, not a mandatory theme or editor replacement. [theme schema](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/interactive/theme/theme-schema.json), [theme documentation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/themes.md), [keybindings implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/keybindings.ts), [theme changelog](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

### 2.10 Package ecosystem and the Graphify family

The official [Pi package gallery](https://pi.dev/packages) indexes npm resources carrying the `pi-package` keyword and provides `pi install npm:<package>` instructions. Packages can combine native extensions, skills, prompts and themes. Gallery eligibility is distribution, not review, signing or endorsement. Git/local distribution remains first-class but does not itself establish an npm-gallery presence. [tagged package instructions](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/packages.md#L42), [gallery](https://pi.dev/packages)

On 2026-10-01 the official Graphify search displayed seven related matches among 5,401 total gallery entries. These are page observations, not a guarantee every index entry is unique/current. The core repository’s observed 110,894 stars/14,101 forks indicate harness reach, not downloads or active users of a Forge-style package. Do not use those counts as package adoption. [official Graphify search](https://pi.dev/packages?name=Graphify), [repository API snapshot](https://api.github.com/repos/earendil-works/pi)

There is no successful latest-registry response for the exact unscoped name `pi-graphify` in this research (404); several **different** packages implement Graphify integration. The following official gallery snapshots are timestamped 2026-10-01 and vary as rolling counters update. They support “active and fragmented community examples,” not an unqualified ranking of “popular packages.”

| Package and exact install | Observed version/downloads | Maintainer source and useful pattern |
|---|---|---|
| `pi install npm:@runecraft/graphify-pi` | 0.3.0; package snapshot 471/month, 471/week; another catalog snapshot differed | [gallery](https://pi.dev/packages/@runecraft/graphify-pi), [maintainer monorepo](https://github.com/runecraftai/pi-extensions) (packages/graphify-pi). Five-tool CLI bridge; bounded 60-second subprocess and 1 MiB output; git staleness checks; small manifest extension directory. |
| `pi install npm:@gaodes/pi-graphify` | 0.2.2; 475/month, 88/week | [gallery](https://pi.dev/packages/@gaodes/pi-graphify), [GitHub mirror](https://github.com/gaodes/pi-graphify). Tools + commands + skills, graph/watch/callflow operations and session-context hints; GitHub is described as a mirror rather than assumed canonical source. |
| `pi install npm:graphify-pi` | 0.3.0; 672/month, 390/week | [gallery](https://pi.dev/packages/graphify-pi), [maintainer repo](https://github.com/juhas96/graphify-pi). Combined extension/skill; alternative install `pi install git:github.com/juhas96/graphify-pi`. |
| `pi install npm:@patimweb/pi-mindplace` | 1.6.0; 344/month, 23/week | [gallery](https://pi.dev/packages/@patimweb/pi-mindplace), [maintainer repo](https://github.com/Smotherer007/pi-mindplace). TypeScript/tree-sitter AST graph, TF-IDF/BFS/PageRank/Louvain/watcher; avoids Python/LLM graph building, but gallery artifact is substantially larger. |
| `pi install npm:@wwjd/pi-graphify` | 0.4.3; 329/month, 44/week | [gallery](https://pi.dev/packages/@wwjd/pi-graphify), [maintainer repo](https://github.com/WianVDM/pi-graphify). CLI backend abstraction with MCP described as future work; extension manifest. |

The search also surfaced `@audsiui/pi-graphify`; a broader package `ultimate-pi` matched Graphify text but must not be counted as a dedicated Graphify adapter. The family illustrates executable package distribution, lazy/bounded tool bridges, session orientation, cache/staleness checks and extension-plus-skill bundles. It also illustrates naming fragmentation and dependency costs. Proposed Forge response: one canonical package identity, a small native entry point, clear block composition examples and an install/proof page; no copycat package names or assumption of ecosystem endorsement. [official search](https://pi.dev/packages?name=Graphify), [package trust advice](https://pi.dev/packages/@gaodes/pi-graphify)

## 3. What Forge can leverage, ranked

The ranking is proposed integration value, inferred from the cited source contracts; it is not a benchmark.

| Rank | Pi advantage | Forge capability carried | User-visible result |
|---|---|---|---|
| 1 | Native tools, namespaces, exposure and `ctx.executeTool` share one dispatch path | Public block APIs; Kernel/Memory/gates only when configured | Forge feels like Pi tools, while a large block catalog stays discoverable without flooding every prompt |
| 2 | `tool_call` denies and rewrites arguments before effects, including nested MCP | Gates/deny, lease/resource policy | Clear denial with a reason before a guarded mutation; service authorization remains authoritative |
| 3 | Structured `before_agent_start` sections plus resource discovery | Recap/recall, third-party skills and reference solutions | Current, bounded task context at the right moment without copying a second agent prompt |
| 4 | Append-only branch entries and boundary entry ids | Receipt correlation and conformance evidence | Resume/fork keeps a path to proof without treating transcript summaries as state authority |
| 5 | Installed JSON/RPC modes and final settlement event | Harness conformance proof | CI can assert real load, execution, denial, nested correlation and complete shutdown |
| 6 | One package manifest bundles code and portable resources | One Forge artifact, reusable skills/prompts | A normal Pi install exposes the same configured Forge blocks and reference solution |
| 7 | Native MCP with codemode/deferred discovery | Shared cross-harness server and API catalog | Users can combine many Forge/third-party operations with less direct declaration overhead |
| 8 | Tool/message/custom-entry renderers and small widgets | Optional visualization of issues/receipts/budgets | Proof and current work are visible in Pi’s existing UI, without another application shell |
| 9 | Input/command lifecycle and command-session context | Explicit reference workflow commands | Users invoke a solution deliberately; installing Forge does not force every task into a TDD ladder |
| 10 | Virtual model routing, provider hooks and native usage | Optional routing/cost blocks | A configured policy can use Pi’s model layer and retain actual physical-model usage |
| 11 | Existing subagent extension patterns | Optional reviewers/execution blocks | Reuse community agent mechanics once lease/budget propagation has a proved contract |
| 12 | Official npm-backed gallery | Community adoption and third-party authors | A concrete install page and block composition examples can reach Pi users early |

The strongest surfaces are already native. A separate Forge agent loop, custom skill loader, package registry, editor, session database or provider catalog would duplicate Pi and violate the north-star complement direction. This is an architectural recommendation based on the active [north star](../north-star.md) [read] and the source contracts in sections 1–2.

## 4. Limits, gotchas and six-month churn

### 4.1 Practical boundaries

| Boundary | Source evidence / practical consequence |
|---|---|
| Full-trust executable packages | Module imports, dependencies and npm lifecycle scripts have host privileges. Project trust is not process isolation. Review/pin artifacts and enforce sensitive effects at Forge services. |
| No universal callback deadline | A factory/hook can stall startup or a turn. A configured Forge timeout must be explicit; cancellation must be honored by the operation. |
| Parallel effects | Denying one tool or setting terminate does not undo/cancel siblings already executing. Policy approval must account for batch concurrency. |
| Argument mutation follows validation | Revalidate any Forge rewrite or use a typed replacement construction. Never assume Pi runs schema validation again. |
| Hidden declarations are not denied effects | Codemode/deferred tools can remain callable when not directly declared. Authorize by capability/operation, not visibility. |
| Compaction and branch summaries lose detail | Persist receipt references outside the prompt and keep full authoritative results in the block store. |
| Session replacement invalidates references | Rebind on session_start and reconstruct from current branch entries; check lease state live. |
| RPC UI is partial | Custom TUI components return undefined/no-op outside TUI; cancellation must not approve writes. |
| JSON success is semantic | Exit code, first agent_end and a prompt acceptance response are each insufficient alone. |
| Nested transcript summaries are bounded | They cannot prove every nested operation after truncation; enumerate receipt-store subobjects. |
| Resource collisions | A local resource can precede a package resource; assert command/tool source identity in proof, not only the name. |
| Experimental surfaces | Virtual routing and protocol/client APIs should be opt-in and separately tested, not prerequisites for Forge 0.1. |

These are source-derived limits, not claims that a live Forge package currently violates them. [security](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/security.md), [runner](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/runner.ts), [agent loop](https://github.com/earendil-works/pi/blob/v0.99.2/packages/agent/src/agent-loop.ts), [session implementation](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/agent-session.ts), [RPC UI](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/rpc-extension-ui.md)

### 4.2 Windows

Pi documents Git Bash discovery by configured shell path, standard Git installation and PATH; it also offers native PowerShell tool configuration. PowerShell resolution prefers pwsh then Windows PowerShell, with noninteractive/no-profile invocation. Execution-policy arguments cannot override a machine policy. User `!`/`!!` remains the user-bash path; selecting a PowerShell tool does not automatically change that command contract. Terminal key encodings may need Windows Terminal configuration. A Forge native API bridge avoids adding shell quoting for ordinary block calls. [Windows guide](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/docs/windows.md), [CLI/tool configuration](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/main.ts), [user-bash event contract](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts)

0.99.2 records a standalone Windows codemode worker fix. This is evidence of a documented fix, not proof on this machine. The RpcClient spawn without windowsHide is a separate source observation; do not infer the worker fix covers every spawn route or removes terminal flashing. The proof matrix should exercise npm-installed Node, Windows paths with spaces, process cleanup, JSON framing and actual TUI interaction. [0.99.2 changelog](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md), [RPC spawn](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-client.ts#L94)

### 4.3 Material changes from 2026-04-01 through 2026-10-01

This is the compatibility-relevant selection from tagged release headings, not an exhaustive changelog copy.

| Release/date | Change affecting a Forge integration |
|---|---|
| 0.65.0, Apr 3 | Session switch/fork lifecycle changed toward session_start reasons/runtime replacement; old session-directory APIs removed; CLI argument behavior tightened |
| 0.68.0, Apr 20 | SDK tool options changed from Tool objects to names; tool-selection/no-tools semantics and cwd-bound factories changed |
| 0.69.0, Apr 22 | TypeBox 1.x/import migration; stale session context/runtime references after replacement throw; rebind rather than retain |
| 0.70.0, Apr 23 | Terminal OSC progress behavior changed; status behavior cannot be assumed from older demos |
| 0.71.0, Apr 30 | Google Gemini CLI/Antigravity provider integrations removed |
| 0.72.0, May 1 | Thinking-level mapping renamed; provider adapters need current fields |
| 0.73.1 / 0.74.0, May 7 | Project/package namespace migration to earendil-works; old imports/install names need migration |
| 0.75.0, May 17 | Node minimum became 22.19.0 |
| 0.80.0, Jun 23 | Provider API entry points moved/reorganized through compatibility surfaces |
| 0.80.7 / 0.80.8, Jul 14–16 | Session affinity configuration and SDK ModelRuntime/auth/catalog behavior changed |
| 0.83.0, Jul 29 | Further TypeBox deprecated API removal |
| 0.84.0, Aug 6 | JSON/RPC updates became delta-only; header deletion uses null; request transforms/catalog/protocol APIs changed |
| 0.84.3, Aug 24 | Google thinking-level compatibility changes |
| 0.86.0, Sep 19 | Normalized TranscriptContext, JSON tool values/details and fail-closed user_bash errors |
| 0.87.0, Sep 21 | Boundary/finishTurn/context-edit changes; SessionManager canonical context authority; system-context protections |
| 0.99.0, Sep 29 | Native MCP, codemode, nested-tool/exposure/output-schema surfaces and experimental virtual routing |
| 0.99.2, Sep 30 | MCP server discovery/prompt stabilization, OAuth client/auth-provider adjustments, normalized-name collision fixes, malformed-image handling and Windows worker fix |

[tagged changelog, inspected 2026-10-01](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md)

The observed changelog contains 83 dated release headings in that six-month window and nine in September. This is a count of headings, not a fixed promised release cadence. The combination of recent fundamental API changes and fast releases makes `>=0.99.2` too broad a certification claim. Declare the exact version tested; run latest as a separate canary. Node 24 is the proposed common Forge/Pi test baseline, with a Node 26 lane if required by the plan; Pi’s Node 22.19 minimum does not lower Forge’s own baseline. [changelog](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/CHANGELOG.md), [Pi package engines](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/package.json), [Forge north star](../north-star.md) [read]

No “documented but actually broken” feature was independently reproduced in this phase. Documented fixed defects are identified above as changelog evidence. The JSON exit behavior, missing client spawn flag and unbounded callbacks are control-flow observations; runtime acceptance tests remain necessary.

## 5. Installed-version proof recipe (L2) — proposed, unrun

**Purpose:** prove the actual published/packed Forge artifact loads into **Pi 0.99.2**, preserves exact request identity, performs a permitted block call, rejects a forbidden effect, propagates nested correlation, and finishes cleanly. Typechecking/importing the extension is L1, not L2. A package-loader test and an explicit `-e` test prove different things; retain both.

**Fixture contract to implement with the proposed plugin.** The test package exports native `/forge capabilities` and configured block tools, appends a `forge.receipt` custom entry with `requestId`, `contextDigest`, capability/receipt references and outcome, and uses an isolated fixture block service for effects. Names here are proposed contract names, not claims that the current Forge artifact already provides them. A test-only Pi provider emits deterministic tool calls via the public provider stream API, then a final assistant response; it makes no external model request. A tiny stdio MCP fixture exposes one read and one mutation. All mutable state is below the proof root. No production service or real credentials are used.

### 5.1 Exact installation and launch commands

Run this PowerShell setup on a CI worker with Node 24 available. The three inputs are an existing candidate Forge checkout, an empty proof root and a test-fixture directory maintained by the conformance suite. These proposed fixture files are not created by this research.

~~~powershell
$ProofRoot = [IO.Path]::GetFullPath($env:FORGE_PI_PROOF_ROOT)
$ForgeSource = [IO.Path]::GetFullPath($env:FORGE_PI_CANDIDATE_DIR)
$Fixtures = [IO.Path]::GetFullPath($env:FORGE_PI_FIXTURES_DIR)
New-Item -ItemType Directory -Force -Path "$ProofRoot/host", "$ProofRoot/artifacts", "$ProofRoot/agent", "$ProofRoot/cwd" | Out-Null

npm install --prefix "$ProofRoot/host" --ignore-scripts --save-exact @earendil-works/pi-coding-agent@0.99.2
if ($LASTEXITCODE -ne 0) { throw "Pinned Pi installation failed" }

$PiCli = "$ProofRoot/host/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js"
$env:PI_CODING_AGENT_DIR = "$ProofRoot/agent"

$PackResult = npm pack "$ForgeSource" --pack-destination "$ProofRoot/artifacts" --ignore-scripts --json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw "Candidate pack failed" }
tar -xf "$ProofRoot/artifacts/$($PackResult[0].filename)" -C "$ProofRoot/artifacts"
if ($LASTEXITCODE -ne 0) { throw "Candidate extraction failed" }

node $PiCli install "$ProofRoot/artifacts/package"
if ($LASTEXITCODE -ne 0) { throw "Pi package installation failed" }

node "$Fixtures/pi-proof.mjs" --pi-cli "$PiCli" --cwd "$ProofRoot/cwd" --candidate "$ProofRoot/artifacts/package" --provider-fixture "$Fixtures/scripted-provider.ts" --mcp-fixture "$Fixtures/mcp-server.mjs" --pi-version "0.99.2" --request-id "forge-deep-pi-20261001" --context-digest "67dde101a50e45c6484d9d5256a08f313598173e65ce03bf6e75a04fb277bf48"
if ($LASTEXITCODE -ne 0) { throw "Pi installed-version conformance failed" }
~~~

The pinned npm package’s actual bin is `dist/bundle/cli.js`; derive/check it from the installed package manifest instead of trusting a historical `dist/cli.js` path. The CI `--ignore-scripts` choice controls **this outer install/pack**, not Pi’s own later package installer. Test that inner lifecycle behavior separately with a harmless fixture marker if it is part of the support contract. [tagged package bin/engines](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/package.json), [Pi installer flags](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/package-manager.ts#L1845)

The runner must spawn with `shell:false`, `cwd: <proof-root>/cwd`, isolated environment/agent directory and pipes. This is the exact child argument vector for the installed manifest-discovery probe:

~~~json
[
  "--mode", "rpc",
  "--approve",
  "--no-session",
  "--no-context-files",
  "--no-skills",
  "--no-prompt-templates",
  "--no-themes",
  "-e", "<fixture-dir>/scripted-provider.ts",
  "--provider", "forge-proof",
  "--model", "scripted"
]
~~~

Do **not** add `--no-extensions` to that probe: it would defeat the package/autodiscovery claim. The provider fixture is explicit; the Forge extension must load through the installed manifest. Once ready, repeat a focused isolation probe with `--no-extensions -e <provider-fixture> -e <packed-forge-extension>`; that tests the native adapter independently but is not a substitute for package loading. `--no-extensions` also disables built-ins, so an MCP/codemode probe must explicitly restore the appropriate built-in factories or use the normal discovered/built-in lane. [CLI flags](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/cli/args.ts), [SDK extension assembly](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/sdk.ts)

For the JSON lane the runner uses the same isolated cwd/environment and this exact vector, consuming every LF-delimited record:

~~~json
[
  "--mode", "json",
  "--approve",
  "--no-session",
  "--no-context-files",
  "--no-skills",
  "--no-prompt-templates",
  "--no-themes",
  "-e", "<fixture-dir>/scripted-provider.ts",
  "--provider", "forge-proof",
  "--model", "scripted",
  "FORGE_PROOF_CASE=allow_then_deny"
]
~~~

The scripted provider must actually stream the predetermined assistant/tool-call/final sequence through Pi’s provider API, rather than call a Forge handler directly or fabricate a transcript. It can use the public `createAssistantMessageEventStream` factory and provider registration types. Validate the stream against the pinned types; emitted assistant messages must include valid model/provider/usage/stop metadata. Direct unit calls to extension handlers cannot establish installed dispatch. [provider registration types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/core/extensions/types.ts#L1870), [stream factory](https://github.com/earendil-works/pi/blob/v0.99.2/packages/ai/src/utils/event-stream.ts#L108)

Finally, run a **separate** published-package acceptance lane with:

~~~powershell
node $PiCli install "npm:forge-workflow@$env:FORGE_PI_CANDIDATE_VERSION"
~~~

`forge-workflow` is P7’s proposed package identity; substitute the canonical published Forge identity if it differs. Check the installed source/version against that exact expected identity. A packed local-directory test does not prove registry publication, npm resolution or install metadata. A moving/latest package reference is not a pin.

### 5.2 RPC sequence and assertions

Attach the event collector before sending any prompt. Send one JSON object per LF, correlate every response by id, and bound each request plus the whole process. A successful `get_state` response is readiness; a fixed sleep is not.

~~~json
{"id":"ready","type":"get_state"}
{"id":"commands","type":"get_commands"}
{"id":"capabilities","type":"prompt","message":"/forge capabilities"}
{"id":"entries","type":"get_entries"}
{"id":"allow","type":"prompt","message":"FORGE_PROOF_CASE=allow"}
{"id":"deny","type":"prompt","message":"FORGE_PROOF_CASE=deny"}
{"id":"nested","type":"prompt","message":"FORGE_PROOF_CASE=codemode_mcp_deny"}
~~~

Send the next dependent request only after the prior case has completed. For `capabilities`, expect a handled command response and its specific receipt/result; do not require an agent-settled event for a command that starts no run. For agent cases, require disposition started (or an explicitly tested queue case), expected tool/result records, final non-error assistant and `agent_settled`. Clear the queue and abort before teardown if a timed-out case still has work, then close stdin and drain stderr/stdout. [RPC response types](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-types.ts), [client settlement behavior](https://github.com/earendil-works/pi/blob/v0.99.2/packages/coding-agent/src/modes/rpc/rpc-client.ts#L471)

| Case | Required assertion, including the bad case |
|---|---|
| Exact installation | Package name/version and Pi version match inputs; installed manifest contains the shipped paths; all paths exist in the packed artifact |
| Manifest load | get_commands contains `forge` with source `extension` and sourceInfo resolving to the packed candidate, not a same-name local/global resource; no extension_error/load diagnostics |
| Identity | Every Forge entry/receipt preserves exactly `forge-deep-pi-20261001` and the supplied 64-character contextDigest; no invented replacement id |
| Positive read | Scripted provider invokes the expected native block tool; fixture result and receipt are correct; actual operation count is one |
| Direct deny | A forbidden fixture mutation receives a tool error with the expected deny reason; the mutation marker/counter is unchanged; a deny receipt is persisted |
| Thrown deny | A simulated policy-check error does not execute the tool; error path is reported rather than allowing a fallback |
| Nested deny | A codemode-to-MCP call hits the same policy check; parentToolCallId correlates it; fixture mutation remains unchanged; parent result contains/checks the error |
| Visibility | Codemode/deferred discovery works; hidden/model-only nested attempts are unreachable; CLI-excluded tool remains absent from callable registry |
| Argument rewrite | Rewritten typed input reaches the fixture with only intended fields; the adapter itself rejects a rewrite violating its schema/invariants |
| Parallel batch | Allowed sibling effects and denied effects match expected counts; termination is not assumed to roll back sibling work |
| Result integrity | Structured result is preserved when expected; replacing content clears/replaces stale structuredContent according to the adapter contract |
| Project trust | --no-approve skips a project-only extension/package; global/explicit fixture behavior is asserted separately; context-file exception is isolated by --no-context-files |
| Resource collisions | Same-name local/CLI skill/command fixture wins according to the documented source order and produces a diagnostic; Forge namespace avoids an ambiguous generic name |
| Session continuity | A persisted second lane (omit --no-session, set --session-dir under proof root) resumes/forks, rebinds, reads the right branch receipt references and rechecks service lease state |
| Compaction/context | Force a fixture compaction, then assert bounded fresh recap/recall on next run and that raw denied-operation evidence is retained |
| Framing | Fragment LF records across stdout chunks; include U+2028/U+2029 inside JSON strings; no accidental Unicode line splitting or raw log noise on stdout |
| Completion/error | Assert agent_settled plus expected final result; distinguish agent_end with retry, assistant error, prompt handled and expected tool denial; exit code alone never passes |
| Shutdown | EOF ends the child within deadline; no owned worker/MCP child is left running; failed cases preserve logs and fixture state for diagnosis |

Each row is a required prospective test, not passed evidence. The positive operation prevents an always-deny plugin from looking correct; the unchanged mutation marker prevents a post-effect denial message from looking safe. A fixture MCP call proves connection/dispatch, while registering an MCP handler alone does not.

### 5.3 Matrix, receipt and L3 boundary

Run pinned Pi 0.99.2 with the candidate **packed artifact**, Node 24 on Linux and Windows, plus the chosen Node 26 lane. Latest Pi is a non-certifying canary until reviewed. Capture: OS/runtime versions, exact Pi/package version and artifact digest, argument vector without credentials, request/digest, duration, stdout/stderr, exit, complete fixture counters, receipts and process cleanup. The aggregate result must enumerate every named case; individual green cases without a complete receipt are incomplete.

L2 does not prove real terminal presentation. A separate Windows operator transcript must show normal install, a native `/forge` command, visible status/receipt, a denied operation, a resume/fork and clean reload/shutdown. A provider-service/authentication integration requires its own nonproduction endpoint proof. This is the L3/operator boundary proposed for a support claim, not a reason to delay the research artifact.

## 6. Best-possible Forge integration — all proposed

### 6.1 Package and authority shape

Ship a native Pi extension and portable resources inside Forge’s **one canonical npm artifact**. Illustrative manifest additions:

~~~json
{
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["dist/harness/pi/extension.js"],
    "skills": [".agents/skills"],
    "prompts": ["harness/pi/prompts"]
  },
  "peerDependencies": {
    "@earendil-works/pi-coding-agent": "*",
    "@earendil-works/pi-ai": "*",
    "@earendil-works/pi-agent-core": "*"
  }
}
~~~

This fragment is proposed, not an assertion that these files exist today. Publish the referenced files and prove them in the packed artifact; preserve the existing package’s other fields/dependencies. Runtime peer ranges permit shared host libraries; the separate support receipt pins 0.99.2. Canonical shared skills remain source-owned by Forge, with a Pi-compatible projection only where metadata semantics require it. Do not hand-maintain a second independent skill set.

**Primary transport:** the extension calls Forge’s public block APIs through a narrow adapter. The same operations may be exposed through a shared MCP server for other harnesses/users. Select native or MCP transport deliberately at initialization; do not retry a denied/uncertain mutation through another transport. Shell invocation is a last-resort supported block adapter, not the default mechanism for every recap/claim/check.

**Authority:** Pi owns its run, prompt, tool catalog, UI and transcript. Configured Forge blocks own their own issue state, memories, gates, effects and receipts. A solution chooses those blocks; installing the package does not require the Kernel or force the reference TDD workflow. A Pi custom entry stores correlation/reference data, never a second authoritative issue record. This follows the active [north star](../north-star.md) [read].

### 6.2 Surface-by-surface design

| Surface | Proposed implementation | Native ownership / material risk |
|---|---|---|
| Startup | Factory registers tools/events/commands only; session_start binds selected block services, reconstructs current branch references and validates compatibility | Pi retains loader/trust; no import-time daemons or blanket project approval |
| API catalog | Small stable entry tools, e.g. `forge_capabilities` and `forge_recap`; bulk operations in a `forge` codemode/deferred namespace | Pi retains exposure/discovery; block schemas are public contracts, hints are not permissions |
| Gates | Check at Forge API effect boundary; tool_call adds early denial and bounded input policy; optional user_bash convenience check | Service authorization covers other clients; no claim of OS isolation |
| Context | before_agent_start adds bounded structured recap/recall only for selected blocks/current task | Pi retains system prompt/provider cache; user can disable optional orientation |
| Resources | Package manifest and resources_discover expose configured third-party skills/prompts/themes | Pi retains ordering/trust; first-wins diagnostics are tested |
| Commands | One native `/forge` namespace for capabilities/status/explicit solution entry points | Pi retains input/editor; commands do not silently advance a human checkpoint |
| Session evidence | appendEntry stores exact request/digest, branch correlation and receipt references; custom messages summarize user-visible proof | Forge retains full receipts; display flags do not promise privacy |
| Resume/fork/reload | Reconstruct from current branch, reacquire current service context and recheck lease/authority; clean up old subscriptions/services | Do not reuse stale pi/ctx or assume a stored claim is still owned |
| MCP | Optional registerMcpServer to the shared service; default codemode, small discovery description, explicit timeout | Native bridge remains primary Pi UX; duplicate catalogs/uncertain transport retry avoided |
| UI | setStatus + lightweight widget/custom-entry/tool renderer; TUI guard by mode, RPC string fallback | Native Pi layout/theme/editor stay intact; custom dialog cancellation is deny |
| Reference workflow | Portable skills/templates invoke configured public blocks; user-only stages map to explicit Pi metadata/commands | One optional solution; no new mandatory product-wide ladder |
| Third-party blocks | Generate tool schemas/catalog from public contracts and validate capability/effect metadata | Authors use the same API; conformance must include an independent block, not only Forge’s own |
| Model routing | Optional virtual-model/provider integration only if a user config selects a routing block | Pi retains catalog/model choice; experimental API tested separately |
| Review/subagents | Later, connect an existing community reviewer/subagent extension using explicit receipt/lease/budget context | No new core orchestrator; child authority proven at service |
| Publication | Gallery keyword, package README/install proof, small composition examples and source links after L2 | Gallery is discovery; no new Forge marketplace service required for 0.1 |
| Shutdown | session_shutdown aborts/awaits owned work and removes subscriptions; bounded cleanup on reload/new/resume/fork | Full-trust code must manage its own lifecycle; preserve recoverable evidence on failure |

The trust/injection balance is deliberate: clear bounded orientation is useful, but Kernel tracking, forced claims or workflow progression cannot be imposed simply by installing a harness plugin. Native Pi and third-party packages continue to work through their existing contracts.

### 6.3 Effort and risk

Estimates are engineering inference, **not measured implementation time**; they assume public Forge block APIs already exist and the canonical package has a publish pipeline.

| Work slice | Worker-days | Principal risk |
|---|---:|---|
| Native adapter, package metadata and schema/namespace mapping | 1.5–2 | Host API/version drift; packed files/peer dependency identity |
| Session/resource/context wiring and small native UI | 1 | Replacement lifecycle and prompt/resource precedence |
| Authorization/deny, nested correlation and effect receipt integration | 2–3 | Partial effects, concurrency, fail-closed behavior |
| Installed conformance suite, Windows/Linux matrix and aggregate receipt | 1.5–2 | Fixture quality, framing/shutdown and package-vs-source proof |
| Documentation, gallery install page and one independent block example | 0.5–1 | Naming/positioning and overstated support |
| Total with small contingency | **7–10** | Certification is conditional on all required proof |

If the shared MCP server is not ready, estimate another 1–2 worker-days for its Pi wiring and fixture proof, separate from building the server itself. An independent reviewer protocol, full custom UI or new package marketplace is outside this estimate and outside the proposed first release. The narrow native integration has the best expected value because it uses Pi’s existing composition and presentation.

### 6.4 Install/update/community path

Proposed first release: publish the normal Forge artifact with Pi metadata, then `pi install npm:<canonical-forge-name>@<certified-version>`. Offer project `-l` when users want project-specific config and explicit trust. Document `/reload`/restart and version/receipt checks after upgrade. `pi update` behavior follows pinned/floating declarations; changing a pin is a deliberate support decision.

An official-gallery listing is cheap distribution once the package works; it need not wait for a custom Forge marketplace or an arbitrary 0.2 label. Lead with a concrete Pi composition example—discover a block, recap work, make a permitted call, show a receipt and deny a forbidden call. Invite community block authors to the same public contract and include one independent author example in conformance. The Graphify ecosystem suggests keeping the extension lightweight and avoiding namespace forks; no need to claim those packages endorse Forge.

## 7. Keeping current

Watch the [Pi changelog on main](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/CHANGELOG.md), [tagged release source](https://github.com/earendil-works/pi/tree/v0.99.2), [GitHub releases feed](https://github.com/earendil-works/pi/releases.atom), [npm release metadata](https://registry.npmjs.org/@earendil-works/pi-coding-agent/latest), and the official [package gallery](https://pi.dev/packages). Version metadata and a source diff are independent signals; verify which commit the npm artifact actually contains.

A proposed canary should diff and test these paths first:

- `packages/agent/src/agent-loop.ts` and `types.ts`: validation order, parallelism, continuation, nested effects.
- Coding `extensions/types.ts`, `runner.ts`, `loader.ts`: API/event signatures, lifecycle, error propagation.
- `resource-loader.ts`, `package-manager.ts`, `skills.ts`, `pi-manifest.ts`: discovery, trust, collision and package installation behavior.
- `agent-session.ts`, `session-manager.ts`, compaction code: branch/session replacement, projection and receipt links.
- MCP/codemode config and executor: auth, names, timeouts, discovery and nested-call enforcement.
- `rpc-types.ts`, `rpc-mode.ts`, `print-mode.ts` and packaged bin: wire framing, settlement, exit and process behavior.
- UI/theme/keybindings and Windows release notes: native rendering, cancellation and spawned process cleanup.
- Provider/ModelRuntime/virtual-model APIs: only when the configured routing/provider block depends on them.

Trigger an adapter update for a changed contract, a failed latest canary, a security/trust change, provider auth deprecation, or a release artifact no longer matching the supported fixture. Do not widen certified versions because documentation still resembles the old version. Preserve old receipts and exact pins so users can reproduce or roll back to the previously tested Forge/Pi pair.

## Bottom line

1. Prioritize Pi’s native extension surface; its loop, tools, context and TUI already cover the Forge experience.
2. Certify `@earendil-works/pi-coding-agent@0.99.2` at commit `005af57d88ee23b33778f343a9595b32e67ff788`.
3. Ship one Forge npm artifact with Pi metadata, portable resources and a namespaced native command.
4. Use public block APIs as the Pi adapter’s primary transport; keep a shared MCP server optional.
5. Expose a small direct entry point and discover the larger block catalog through namespaces/codemode.
6. Deny before effects through tool_call, and enforce authorization again at the block service.
7. Store exact correlation and receipt references in branch entries; authoritative state stays in configured blocks.
8. Reuse Pi’s status/renderers and community subagent mechanics without adding another core UI or orchestrator.
9. Publish an installable gallery presence after proof; describe Graphify adoption with dated measurements.
10. Source research is complete at rung 2; L2 installed proof and Windows operator evidence remain unrun.

## Corrections to P7

The comparison is to the supplied [P7 Pi addendum](../platform/P7-harness-plugins.md) [read]; no change to that file is made here.

1. **Installer lifecycle trust:** replace “undocumented lifecycle behavior” with the source-confirmed npm command lacking --ignore-scripts; distinguish user npm configuration and other package managers.
2. **Enforcement strength:** replace a blanket “advisory UX plus git hooks” description with real pre-effect tool_call denial covering direct/nested/MCP paths, while stating the full-trust extension/OS boundary.
3. **Hook completeness:** add all 41 events and exact mutation/return contracts, especially input, resources_discover, provider hooks, boundaries, compaction failure and final settlement.
4. **Argument rewriting:** record that tool_call mutation occurs after validation and is not revalidated by the loop.
5. **MCP design:** update for 0.99.2 default codemode discovery, validated transports/auth, per-tool exposure, resources, timeouts and session registration; keep direct MCP an optional shared transport rather than the only Pi-native strategy.
6. **Codemode safety:** add infinite default script deadline, bounded VM memory, preserved prior tool effects and nested receipt truncation; VM isolation is not tool-effect isolation.
7. **Version support:** certify an exact Pi version/artifact rather than a broad >=0.99.2 range; add latest as a non-certifying canary.
8. **Proof sufficiency:** replace a load/help-only CLI check with packed/published install lanes plus positive execution, negative no-effect denial, nested correlation, settlement and cleanup; use the actual bundle bin path.
9. **Support tier:** make promotion conditional on an aggregate L2 receipt and the specified operator/TUI evidence; reconcile the addendum’s L2-only and L2+L3 wording.
10. **RPC UI:** hasUI does not mean TUI; guard terminal components with mode === tui and treat unavailable/cancelled prompts as denial.
11. **Skills semantics:** Forge invocation:user is not a Pi-native gate; map explicit-only behavior using Pi’s recognized disable-model-invocation metadata/commands and retain service authorization.
12. **Package identity/discovery:** pi-package is gallery eligibility, not a runtime prerequisite; keep a single canonical package and test source identity under precedence collisions.
13. **Session authority:** use SessionManager projection, branch entries and current lifecycle binding; transcript/custom-entry references are not Kernel authority or proof of current ownership.
14. **Subagents:** distinguish “not mandatory/built into the inspected core loop” from “available through official/community extensions”; do not add duplicate orchestration to the first Forge package.
15. **Community launch:** gallery distribution can accompany a proved first release; a new Forge marketplace or a 0.2 milestone is not a technical prerequisite.
16. **Existing Forge surface:** downgrade zero-hit absence statements to unverified until the tracked remote/package contents are searched broadly; this research does not claim nothing already exists.
17. **Windows:** record documented worker fixes separately from untested RpcClient spawn/terminal behavior; require a Windows artifact/operator lane.
18. **Memory files:** describe the actual context candidate list and skill paths; do not imply automatic MEMORY.md injection from a convention used by other harnesses.

## Open questions for the owner

Labels are reply choices, not feature identifiers. A combined reply is valid; silence means the stated defaults for subsequent planning, not authorization to implement this research phase.

1. **Pi transport:** **A — Native public block API adapter plus optional shared MCP (default). B — MCP-first adapter. C — CLI-only bridge.** Default A keeps Pi-native UX and one reusable API authority while preserving cross-harness MCP. B reduces native coupling but adds server/dependency/discovery work; C adds shell/process cost and weaker structured integration.
2. **Initial native surface:** **A — Namespaced command, small tool/catalog bridge and lightweight status/receipts (default). B — Add a reviewer/subagent integration immediately. C — Build a full custom Pi workspace UI.** Default A reaches the main composition/proof benefits with the smallest surface; B requires child authority/budget proof, and C duplicates existing presentation before demand.
3. **Support promotion:** **A — Exact-pin L2 aggregate plus Windows operator transcript before “supported” (default). B — Experimental listing after L2, promote later. C — Keep unpublished until provider/auth and subagent lanes are also proved.** Default A gives a concrete evidence threshold without delaying on optional features. B is acceptable if the listing says experimental; C couples optional capabilities to the baseline.
4. **Community distribution:** **A — Canonical npm package and official gallery listing once the baseline proof passes (default). B — Git-only pilot first. C — Defer until a Forge marketplace exists.** Default A meets Pi users where packages already circulate and invites third-party blocks without constructing another registry.

## Confidence

**High, rung 2:** current package/repository identity and tagged bin/engines; the agent loop, all 41 event signatures, resource/skills/package loaders, session projection/boundaries, MCP schemas and nested dispatch, RPC/JSON mode contracts and TUI APIs were read in the actual v0.99.2 source.

**Moderate:** official-gallery package observations and downloads are primary displayed measurements but roll over and varied across snapshots. Source-derived cross-path conclusions, such as JSON exit-code insufficiency, are explicitly inference until exercised.

**Proposed/unverified:** the Forge adapter, support promotion, effort estimates and every L2/L3 assertion. No installed runtime, live MCP call, TUI/operator check or real provider authentication was run. This dossier completes the research artifact only; it does not certify a Forge Pi integration.
