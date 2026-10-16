# P14 — Plugin composition and flows across harnesses

Decisions needed: choose the bounded proof and execution-provider staging below; recommended defaults **A+A+A**. Decisions 18 and 34 remain in force.

## Bottom line

1. **[inferred from §2]** Hypothesis 1 is **partly confirmed**: portable packaging lacks a capability-flow contract, but plugin-distributed workflows and tool composition already exist.
2. **[external/read: §§2–3]** Hypothesis 2 is **refuted as stated**: Agent Companion, agtx, Agent Orchestrator and VS Code already connect different harnesses.
3. **[external: §2.1]** Claude Code dependencies govern plugin admission; its JavaScript workflows also provide typed outputs, ordering and resume within Claude.
4. **[external: §2.3]** LangGraph, Mastra, Workflow SDK and MCP workflow projects already supply substantial composition and recovery machinery.
5. **[inferred]** Forge's defensible candidate is checked capability bindings, accepted typed handoffs and evidence under one work authority across those substrates.
6. **[read: §3]** Companion already supplies mixed-harness graphs; its plain graph completion is not Forge Kernel acceptance.
7. **[inferred]** Keep decision 18: compile and admit compositions, delegate general scheduling and session driving; do not build another durable workflow engine.
8. **[read/inferred]** Keep decision 34: Companion is an optional execution-provider block, separately admitted and certified.
9. **[inferred: §5]** Prove two actual third-party plugin capabilities through Pi and Codex, including malformed output, stale authority and interrupted recovery.
10. **[inferred]** Start with a 3–5 week bounded pilot; cloud execution, arbitrary graph semantics and a visual builder are outside its critical path.

## 1. Request, scope and evidence

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p14-cross-harness-flows-20261002",
  "contextDigest": "0490fa4c00157fdf599d527105447457b2b3cee6f1d2aa3b2d54bc78f5efaca1",
  "context": {
    "summary": "Forge final plan, leg P14: verify the gap in composing plugins into flows and in flows that span multiple harnesses, and design Forge's answer."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": { "write": true, "tools": [], "maxCostUsd": null },
  "route": { "model": "gpt-6.1-sol", "thinking": "xhigh", "search": true }
}
```

**[read]** Read `(local scratch)` first. This is the requested standalone research leg, not implementation or approval of a later stage. Only this report is written. No context-mode tools, browser, Claude invocation, commits, pushes, GitHub writes or Kernel mutations were used.

**[ran]** Forge tracked-reference inspection used `git show origin/master:<path>` at master snapshot (`8ceb8c4aeeb93dc59cb9b967205f1d08e187a03c`). The final-plan directory was already untracked. Its supplied reports/decisions are planning inputs, explicitly distinguished below from tracked implementation. No fetch was performed; these Git references are the available snapshots, not a claim that remote HEAD was refreshed today.

**[ran/read]** Companion's available remote snapshot is `origin/main` (`520e98cdc8d67badbf2dda2596adc9cbc612f831`); its checked local HEAD (`b3adba29617d62c49a478de47e0e2fc1d1a384b1`) contains additional development. The untracked CuraPod field report was left untouched. Remote main, local development documentation and the owner's October 1 incident record carry separate weight.

Evidence notation follows the common brief: **[read]** names source lines; **[ran]** means a command actually executed; **[external]** means inspected primary documentation/source, accessed **2026-10-02**; **[inferred]** marks conclusions, proposed designs and estimates. External documentation is evidence rung 2, not an installed execution test. No competitor or cross-harness flow was executed in this phase. Historical test claims are attributed, not promoted to new rung 4 or live rung 5 evidence.

**[inferred]** The hypotheses must distinguish four different things: portable packaging; typed callable capabilities; scheduling a dependent flow; accepting the resulting work. A session manager can solve only the third partly; a JSON Schema output can solve only the second partly. Conversely, these partial solutions already invalidate claims of universal nonexistence.

## 2. Prior art and hypothesis tests

Each table covers composition unit, mixed-harness execution, handoff/state, dependencies, recovery and evidence. **“Not established” means the named sources did not establish the feature; it is not proof of absence.** The review searched plugins/dependencies/workflows, orchestration/DAG/task graphs, handoff/session switching, resume/checkpoints/replay, schema/structured outputs and traces/receipts across the named official docs/repos. No ecosystem-wide census or runtime conformance campaign was run.

### 2.1 Packaging and native harness facilities

| Surface | What it composes; mixed-harness steps | Types/state and dependency checking | Recovery/evidence; implication |
|---|---|---|---|
| Agent Plugins 1.0 | Portable skills and MCP servers, plus client namespaces. The core is a package format, not a harness scheduler. | The closed root manifest enumerates identity/metadata/extensions fields; neither dependencies nor a flow graph is a portable field. MCP schemas belong to tools, not portable edge bindings. | Core does not define run/checkpoint/receipt semantics. Richer client extensions are possible. This establishes the narrow packaging gap, not inability to compose components. [external: [specification](https://agent-plugins.org/specification), 2026-10-02] |
| Claude Code plugins, dependencies and workflows | Plugins distribute skills, agents, hooks, servers and `.js` workflows. Workflow `agent()`, `pipeline` and `parallel` execute Claude work; a foreign-harness node selector was not established. | Semver plugin dependencies/bundles are install/enable admission, not dataflow edges. Workflows can require schema-valid output and pass results between calls. | Cached completed results, failure-point resume and workflow views expose prompts, calls, outputs and usage. Strong counterexample to “no workflows out of plugins”; still Claude-native. [external: [plugin reference](https://code.claude.com/docs/en/plugins-reference), [dependencies](https://code.claude.com/docs/en/plugin-dependencies), [workflows](https://code.claude.com/docs/en/workflows), 2026-10-02] |
| Codex/OpenAI plugins and workflows | Skills/MCP/hooks/extensions package capabilities; local SDK/App Server and managed Agents API expose Codex execution. Custom tools can invoke foreign systems. | Thread/session/subagent/event identifiers and structured outputs exist. Reviewed packaging docs do not establish plugin capability-edge contracts or per-step foreign CLI selection. | Native sessions/events/artifacts and managed resume are substantial same-harness primitives. Their success is not an issue-authority receipt. [external: [packaging](https://developers.openai.com/plugins/build/plugins), [managed multi-agent guide](https://developers.openai.com/api/docs/guides/agents-api/multi-agent), 2026-10-02] |
| Cursor plugins, SDK and parallel builds | Plugins combine rules, skills, agents, MCP and hooks; native subagents/build parallelism remain Cursor execution. A custom SDK tool can invoke another CLI. | SDK types runs/events and tool schemas; documented output schema advertisement is not runtime validation. Plan-derived dependencies are not an authored portable plugin DAG. | Checkpoints/events and resumable runs provide execution state; cloud agents expose logs/artifacts/branches. Foreign typed capability-flow semantics were not established. [external: [plugin reference](https://prod.cursor.com/docs/reference/plugins), [SDK](https://cursor.com/docs/sdk/typescript), [parallel builds](https://cursor.com/changelog/05-07-26), 2026-10-02] |
| OpenCode | JS/TS/npm plugins add tools/hooks; agents may select other model providers within OpenCode. Plugins can program external execution. | SDK types sessions/messages/structured outputs. npm/Bun dependencies install code; they are not checked output-to-input edges between plugin capabilities. | Session/child-session/abort/revert APIs and events are useful substrate. A plugin author still supplies orchestration and recovery policy. [external: [plugins](https://opencode.ai/docs/plugins/), [SDK](https://opencode.ai/docs/sdk/), 2026-10-02] |
| Pi packages and Taskflow | Pi packages distribute extensions/skills. Community Taskflow compiles declarative DAGs; documented adapters make templates portable across Pi/Codex/Claude/OpenCode/Hermes. Host portability is not documented per-node mixed-harness routing. | FlowIR, `dependsOn`, gates, structured results/schema scorers; checks include cycles, dangling references and budgets. The runtime injects a host runner. | Saved/resumable runs, traces/replay and stale-frontier handling. This refutes “verified portable flow definitions do not exist.” It is an add-on, not Pi core. [external: [package](https://pi.dev/packages/pi-taskflow), [compiler/runtime](https://heggria.github.io/taskflow/en/docs/compiler-runtime/), [templates](https://heggria.github.io/taskflow/en/docs/guides/templates/), 2026-10-02] |
| Hermes | Plugins add tools/hooks/skills/lifecycle behavior. Kanban worker-lane contract permits external CLI wrappers, but the guide says such lanes still need integration work. | Manifest v2 `requires_plugins` has version ranges; missing plugins warn rather than universally block. Kanban has task dependencies, claims, SQLite state and per-attempt handoffs. | Stale claims/crash detection, guarded attempt state, retries/logs/exits; transactional Python environments preserve prior generations on build failure. External CLI lanes are an extension contract, not proven turnkey routing. [external: [plugins](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins), [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban), [worker lanes](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/kanban-worker-lanes.md), 2026-10-02] |

**[external]** The Agent Plugins site lists several compatible clients and explicitly permits incremental component/transport adoption. Therefore “plugins are widespread” is supported; “one near-universal interchangeable runtime/packaging system” is not established by that list. Pi packages and OpenCode npm plugins also have native semantics beyond the portable floor. [external: [compatible clients](https://agent-plugins.org/compatible-clients), 2026-10-02]

### 2.2 Multi-harness hosts and CLI orchestrators

| Surface | What it composes; mixed-harness steps | Types/state/dependencies | Recovery/evidence; implication |
|---|---|---|---|
| Agent Companion | Prompt handoffs and a graph of nodes routed to Pi/Claude/Codex/OpenCode/Cursor. Explicitly supports mixed-harness dependent runs. | Typed request/receipt envelope and IDs/digests; graph checks cycles/routes/permissions; upstream attributed results. Plugin capability schemas/Kernel acceptance are not in its fixed graph contract. | Durable intents/attempts, selective resume, cancellation uncertainty and child traces. Direct counterexample to hypothesis 2; detailed limits in §3. [read: Companion `origin/main:docs/agent-graphs.md:5–22,30–65`; `src/graph.mjs:323–359`] |
| agtx | Task board with per-phase harness mapping: research → implementation → review can switch agents. | SQLite task/dependency state; MCP action/transition contract; handover carries specifications, artifacts and diffs rather than a universal output schema. | Worktree/tmux sessions and resumable phases; robust recovery after native-session loss was not tested. Explicit dependent phase switching refutes the broad gap. [external: [README](https://github.com/fynnfluegge/agtx), 2026-10-02] |
| Agent Orchestrator, now Untrivial-ai | Agent fleet/worktrees/PR feedback; implemented Claude↔Codex switching within one session/worktree/task/PR. | Semantic JSON handoff plus deterministic workspace facts; idempotent SQLite switch saga and generation fences. This is a typed session-switch contract, not arbitrary plugin dataflow. | Switch history/crash reconciliation and native transcript references. Strong counterexample to “no durable cross-harness handoff.” First switch support is bounded to the documented pair. [external: [CLI](https://docs.aoagents.dev/cli/), [merged switch contract](https://github.com/Untrivial-ai/agent-orchestrator/pull/3548), [recovery](https://docs.aoagents.dev/troubleshooting/), 2026-10-02] |
| GitHub Agent HQ / VS Code mission control | Multi-agent session hub; VS Code local-session handoff can continue work in another harness/environment. Parallel delegation is also available. | Conversation/context handoff, session status/history and worktrees; no typed plugin output graph established. Dependent tasks require deliberate serialization in the reviewed guide. | Logs/stop/history/share/PR checks. Handoff can originate from Local, while agent-host/remote sessions can receive it. Narrow shipped counterexample, not a full graph runtime. [external: [harnesses](https://code.visualstudio.com/docs/agents/run/agent-harnesses), [delegation](https://code.visualstudio.com/docs/agents/guides/delegate-two-tasks), [third-party agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents), 2026-10-02] |
| T3 Code | Multi-harness provider control plane with normalized thread commands/events. | Typed RPC, event log, serialized command decisions, projections/receipts and checkpoints. One dependent mixed-harness graph was not established. | Provider session reconnection and Git checkpoints; conversation rollback fidelity limits code rollback. Useful host and event precedent, not evidence of plugin DAG composition. [external: [repository](https://github.com/pingdotgg/t3code), [internals](https://github.com/pingdotgg/t3code/blob/main/docs/internals/overview.md), 2026-10-02] |
| Conductor by Melty | Workspaces and chats using several harnesses; multiple sessions can share a branch or use isolated worktrees. | Session/workspace APIs and `.context` files; briefs must carry their context. No automated dependent cross-harness flow established. | Private Git checkpoints, revert/sleep/archive/cancel and transcripts. Parallel workspace hosting alone does not close either typed-composition gap. [external: [harnesses](https://www.conductor.build/docs/reference/harnesses), [parallel agents](https://www.conductor.build/docs/concepts/parallel-agents), [checkpoints](https://www.conductor.build/docs/reference/checkpoints), 2026-10-02] |
| Microsoft Conductor, distinct from Melty | YAML agents/scripts/MCP/skills/subworkflows, branches, gates and parallel groups; multiple API/SDK providers, including Claude Agent SDK. | Typed inputs/outputs and routing; substantial validation and composition. Different model providers are not necessarily different CLI harnesses; exact per-step mixed-provider execution was not proven here. | Checkpoints/resume, retries/events; subworkflows may rerun on recovery. Strong typed-workflow precedent, not proof of every requested CLI pair. [external: [README](https://github.com/microsoft/conductor), [syntax](https://github.com/microsoft/conductor/blob/main/docs/workflow-syntax.md), [resume CLI](https://github.com/microsoft/conductor/blob/main/docs/cli-reference.md), 2026-10-02] |
| Claude Squad | Selected CLI processes in tmux/worktrees. | Native sessions and shell profiles; a dependent DAG/typed handoff was not established. | Attach/pause/resume and Git operations; session operation is not graph or acceptance evidence. [external: [repository](https://github.com/smtg-ai/claude-squad), 2026-10-02] |
| Vibe Kanban | Provider-selected task attempts with isolated worktrees and execution logs. | Task/attempt/process state; mixed dependent plugin graph not established. | Conversation/rollback/cleanup. The original product has an official shutdown notice; community continuation needs separate provenance review. [external: [repository](https://github.com/BloopAI/vibe-kanban), [execution](https://github.com/BloopAI/vibe-kanban/blob/main/docs/core-features/monitoring-task-execution.mdx), [shutdown](https://www.vibekanban.com/blog/shutdown), 2026-10-02] |
| Omnara | Current managed agent runtime spanning machines, tools/skills/MCP. | Atomic Postgres agent state; one agent across machines is not different CLI harnesses across graph nodes. | Documented automatic recovery from crash/disconnection; mixed native CLI flow contract not established. Do not treat its earlier wrapper positioning as current architecture. [external: [repository](https://github.com/omnara-ai/omnara), 2026-10-02] |
| Crystal / Sculptor | Parallel isolated coding workspaces; Crystal documented Claude/Codex sessions. | Per-session/workspace state, no portable typed dependency flow established. | Crystal iteration commits/squash/merge; Sculptor's exact recovery contract remains unknown in reviewed sources. Crystal is deprecated/replaced, so use it as precedent rather than a current recommended substrate. [external: [Crystal](https://github.com/stravu/crystal), [Sculptor](https://github.com/imbue-ai/sculptor), 2026-10-02] |
| Happy / Happier | Happy remotely controls/syncs a selected native session. Happier separately adds experimental cross-agent subruns. | Session/subrun roster/transcripts; no full typed task DAG established. Happier's in-place switch is explicitly development-source functionality, not released proof. | Device continuity and native session resume; distinguish device transfer from harness transfer and experimental features from released ones. [external: [Happy](https://happy.engineering/), [Happier subagents](https://docs.happier.dev/extending/subagents), [switch status](https://docs.happier.dev/sessions/continue-with-another-agent), 2026-10-02] |
| Gas Town | Formulas/work dependencies dispatched to configurable CLI runtimes, including Codex/OpenCode/Pi and others. | `needs` dependencies, work identities and Beads-backed ledger; runtime selection can differ across dispatched jobs. | Persistent worktrees/identities and watchdog/recovery mechanisms. This independently refutes nonexistence; no installation, Windows proof or acceptance-integrity test ran here. [external: [repository](https://github.com/gastownhall/gastown), 2026-10-02] |
| Ruflo / Claude Flow | Meta-harness CLI/MCP workflows and explicit Codex/Claude integration. | Workflow/session/shared-memory machinery; presence of a Codex adapter is established, complete portable capability schema/authority semantics are not. | Session history and orchestration claims; reliability/performance not reproduced. Another bounded counterexample, not evidence for marketing metrics. [external: [repository](https://github.com/ruvnet/ruflo), [Codex adapter](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/codex/README.md), 2026-10-02] |
| Agent Controller | YAML agent intent compiled to Pi/OpenCode/Codex/Claude adapters; external scheduler invokes one agent per step. | Versioned NDJSON, `outputSchema`, parameterized inputs and shared workspace. Capability requirements can warn unless strict binding is selected. | Native session persistence, output files and OTel traces; DAG durability belongs to Maestro/Airflow/Temporal. Demonstrates a complementary design very close to the proposed execution boundary. [external: [README, scheduler tasks and bindings](https://github.com/CCDevelopForFun/agent-controller), 2026-10-02] |
| cmux | Terminal/workspace/browser primitives and agent CLI launchers. | Native session identities and workspace structure, not an authored dependency flow. | Layout/cwd/scrollback and supported session resume; not arbitrary process checkpointing. It explicitly positions itself as a primitive rather than workflow engine. [external: [repository](https://github.com/manaflow-ai/cmux), 2026-10-02] |

### 2.3 Protocols and application workflow runtimes

| Surface | Composition and cross-harness reach | Types/dependencies | Recovery/evidence and boundary |
|---|---|---|---|
| ACP, Agent Client Protocol | Editor/client ↔ coding-agent session protocol. OpenHands can host Codex/Claude/Gemini through ACP; that is adapter interoperability, not proof of a mixed graph. | Typed sessions/prompts/tool/permission/plan events. Plan items are not work-dependency edges. | Resume/history are implementation-dependent. V2 is draft and identifies lost-response retry ambiguity. Use stable negotiated capabilities; do not infer exactly-once execution. [external: [ACP](https://github.com/agentclientprotocol/agent-client-protocol), [V2 migration](https://github.com/agentclientprotocol/agent-client-protocol/blob/main/docs/protocol/v2/migration.mdx), [OpenHands](https://github.com/OpenHands/docs/blob/main/openhands/usage/agent-canvas/acp-agents.mdx), 2026-10-02] |
| A2A, Agent2Agent | Agent-to-agent delegation across processes/vendors, via advertised Agent Cards. | Tasks/context IDs/status/artifacts/history; related-task references are not a scheduler or typed plugin edge. | Poll/stream/push and task state; durable execution replay, repository leases and exact-head receipts remain application responsibilities. [external: [specification](https://a2a-protocol.org/latest/specification/), 2026-10-02] |
| MCP tools, tasks and sampling | Tool invocation can reach any implemented provider. Sampling requests host inference, not another harness session. | Tool input/optional output schemas and structured content support typed calls. Current Tasks extension supplies durable handles/status/input/result, not a multi-step DAG. | Task polling/update/cancel is transport-level job management. Current protocol revision deprecates sampling; do not base new workflow orchestration on it or assume all installed clients support Tasks. [external: [tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [Tasks extension](https://github.com/modelcontextprotocol/ext-tasks), [2026-07-28 changes](https://blog.modelcontextprotocol.io/posts/2026-07-28/), 2026-10-02] |
| LangGraph | Application graphs over functions/tools/agents; foreign CLI execution is custom node/adapter work. | Schema-defined shared state, edges, commands and conditional routing. | Checkpoints, interrupts/retry/durability and optional LangSmith traces. Resumed nodes can repeat side effects unless authors isolate/idempotently handle them. [external: [workflow/state guide](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph), 2026-10-02] |
| Mastra Workflows | Typed steps, tools/agents, sequencing, parallelism, branches and loops inside an application. | Step input/output/state schemas and persisted step paths/status/outputs. | Suspend/resume/snapshots; Temporal integration supplies durable execution. Native multi-vendor CLI routing was not established. [external: [example](https://mastra.ai/examples/agents/agentic-workflows), [snapshots](https://mastra.ai/en/reference/workflows/snapshots), [Temporal](https://mastra.ai/blog/introducing-temporal-workflows), 2026-10-02] |
| Vercel AI SDK / Workflow SDK | AI SDK supplies model/tool/agent loops; Workflow SDK supplies durable transformed functions/steps, including agent integration. Wrapping a CLI is adapter work. | Application types and step/child-workflow/event contracts; not Agent Plugins capability admission. | Durable replay, retries, streams and run/step inspection. Use its current Workflow SDK name; “AI SDK workflows” alone does not identify the durability layer. [external: [AI SDK 7](https://vercel.com/blog/ai-sdk-7), [Workflow SDK](https://github.com/vercel/workflow), [execution model](https://vercel.com/blog/a-new-programming-model-for-durable-execution), 2026-10-02] |
| MCP-agent | Application agents/tools/MCP servers and composable workflow patterns. | Typed application workflow/task interfaces; can expose workflows as MCP tools. | Asyncio or Temporal backend, pause/resume/retries/history. Strong existing tool-composition substrate; foreign CLI/Forge authority remain integrations. [external: [repository](https://github.com/lastmile-ai/mcp-agent), 2026-10-02] |
| FlowMCP | Declarative ordered/branch/map flows calling downstream MCP tools, with parameter/data piping. | Validated definitions, structuredContent/JSON results and per-step references; this composes the callable parts a plugin may distribute. | Structured failures/timeouts, downstream lifecycle and write checkpoints; not a general durable mixed-harness DAG. Independently falsifies the broad “no way to compose plugin tools” reading. [external: [repository and composition section](https://github.com/PeterGreenAppliedAI/FlowMCP), 2026-10-02] |
| Codex App Server / SDK | Native Codex thread/turn/item/approval/session control; no foreign harness scheduler. | Typed JSON-RPC lifecycle and generated schemas; SDK threads/events and structured output. | Native history/resume and execution events; no standard Forge issue/lease/acceptance contract. A high-fidelity provider seam, not the whole flow. [external: [App Server](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md), [SDK](https://github.com/openai/codex/blob/main/sdk/typescript/README.md), 2026-10-02] |

### 2.4 Verdicts, with falsifiers

| Owner hypothesis | Verdict | What evidence supports; what would change it |
|---|---|---|
| Plugins are near-universal, but no workflow/dependency graph can be built out of them | **PARTLY** | Common packaging is growing, but native formats/component support differ. Claude's plugin workflows/dependencies and MCP tool-flow projects refute the absolute composition claim. The narrower portable package-to-capability binding, enforced output/input compatibility and authority/evidence contract is not established by the reviewed portable spec. An existing independently consumable system demonstrating all of those obligations across Pi and Codex would collapse the proposed wedge. |
| Nothing runs one proper flow through multiple harnesses | **REFUTED as an existence claim; PARTLY for the reliability/authority concern** | Companion already has mixed graphs; agtx has phase switches; AO has a fenced durable switch; VS Code has narrower handoff. These are positive counterexamples. Their source/docs do not prove the entire conjunction of arbitrary plugin composition, validated edges, safe recovery and exact-head accepted evidence. A comparative live pilot, not a zero-hit search, must decide whether Forge adds value. |

**[inferred]** Replace “no one does this” with: **“Compose admitted capabilities through the execution system you already use, with typed accepted handoffs and work evidence that survive harness changes.”** This is a proposed product promise with an explicit proof obligation, not an established moat. Neutrality and lower glue cost must be demonstrated against the strongest counterexamples, especially Companion without Forge, Taskflow and an application-runtime adapter.

## 3. Agent Companion: reuse, limits and October 1 failures

**[read, remote source]** `docs/agent-graphs.md:5–22` explicitly defines mixed-harness nodes, route validation, attributed dependency context, durable dispatch, selective recovery and cancellation acknowledgement. `src/graph-protocol.mjs:103–161` implements graph bounds, route/request normalization, cycle/unknown-dependency checks and policy narrowing. `src/graph.mjs:325–339` releases a dependent after its prerequisites are `completed` and copies their attributed `receipt.result` into context. `docs/architecture.md:21–29,39–53` describes IDs/digests, receipts, deadlines, detached single-job workers and optional Taskflow. This is materially more than a session launcher.

**[read, local development only]** `docs/javascript-workflows.md:3,29–39,45–61` adds QuickJS scripts, per-agent optional output schemas, bounded helpers, ordered-prefix replay and saved source revisions. This file does not exist in the inspected `origin/main`. The local acceptance record (`docs/dynamic-workflows-acceptance.md:3–22`) attributes automated checks to earlier source checkpoints and says installed-host parity remains unverified. These are development capabilities and historical evidence; neither is a current shipping certification.

**[inferred from those lines]** Fixed-graph envelopes are typed, but their dependency payload is not a compile-checked plugin capability ABI. Local schema-valid outputs narrow that gap without checking arbitrary package identity, accepted authority or semantic correctness. Companion's execution journal must remain its execution journal; Forge must not reinterpret `completed` or a canary as successful authorized work.

**[read, owner incident evidence]** `(local scratch)`, entries 1–10, reports these actual integration failures or risks:

| Record | Consequence for the Forge/provider boundary |
|---|---|
| Effort/policy keys silently ignored; write-consent metadata undiscoverable | Reject consequential unknown keys before launch; expose the exact normalized policy, route, effort and write scope in the receipt. Never treat a requested value as an applied value. |
| Context-mode tool stalls while status remained running | Record meaningful activity/last tool duration; enforce an outer deadline and watchdog. A heartbeat is liveness, not progress. This research did not invoke that tool. |
| Cancellation request without terminal acknowledgement | Preserve uncertain execution; block rerun/effect overlap until native exit/session state is reconciled. |
| Parent restart killed several jobs; resume restarted work | Prove supervisor/reconnect behavior in the installed provider. Current source describing detached workers does not settle an October 1 failure in an unidentified installed tuple. |
| Invalid cwd detected late; write fallback rejected | Preflight cwd/trust/capability; return drafted artifacts in failed results where permitted. Do not route around a denied permission by choosing another harness. |
| Environment noise and alleged quota exhaustion | Separate environment warnings from task failure. Headroom is an explicitly uncertain observation until a supported provider meter supplies it. |

**[inferred]** Do not infer one universal root cause or mark these fixed from README claims. Capture the installed Companion revision, actual executable/host versions and affected native process state, then reproduce each contracted failure boundary. Source/main/local-version drift is itself a likely integration hazard, not a demonstrated explanation. The contract needs meaningful-progress, cancellation and restart proof before a Supported provider tier.

## 4. Forge's answer: composition contracts above execution providers

### 4.1 Keep decisions 18 and 34

**[read]** The relevant numbered decisions are the **final platform plan's** decision 18, “Flow execution boundary,” and decision 34, “Agent Companion execution provider” (`platform-plan-final.md:2157,2189,2246,2262`). They are not the older skeleton ledger's D18 insights generator or D34 optional planner. The final plan's never-list (`:27–34`) rejects a model/agent loop, general durable orchestration and core harness-session driving.

**[inferred]** Neither decision must change for the recommended pilot. Forge compiles/explains supported composition structures, resolves/admit-checks capabilities and authorizes single operations. An existing host or optional execution provider schedules nodes, runs native sessions and handles its checkpoints. Forge-owned sequential templates retain their bounded role. A user-authored composition is permitted as **declarative bindings lowered to an external runner**, not a new core scheduling engine.

**[inferred]** Clarify the boundary in decision 18's implementation notes: provider completion must await trusted Forge acceptance before dependent nodes run. If an execution provider cannot preserve this gate, that tuple is INCOMPLETE/unsupported; silently weakening it is not acceptable. Only demonstrated demand for Forge-owned durable/branching scheduling would justify reopening 18B with a separate cost and authority review.

### 4.2 Reuse the current foundation; name the missing parts

**[read, origin/master]** `lib/contracts/schemas/v1/work-packet.schema.json:1` already carries issue/revision, repository/head, mutations, workflow/capability revisions and expected output/receipt fields. `lib/contracts/src/validate.js:27–75,305–323` checks supplied live expected identities and stale consequential evidence. `lib/flow/src/executor.js:116–144,156–214` shapes receipts and downgrades unsupported PASS/FAIL evidence to INCOMPLETE. `lib/kernel/broker.js:1709–1783` provides guarded events, idempotency/dependency evaluation and transactional acceptance; `lib/kernel/schema.js` defines event/evidence storage.

**[read]** The current WorkPacket executor is explicitly **synchronous** (`lib/flow/src/executor.js:217–263`): it rejects a Promise-valued `run`, and its accepted-packet cache is an in-memory Map. It is not already an asynchronous durable flow engine. Treat schema sketches, capability I/O typing, async provider admission and durable handoff acceptance below as proposed extensions, not shipped APIs.

**[inferred]** Reuse hashing, identity validation, the broker, evidence records, effect owners and public capability bindings from P11. Long-running work uses separately admitted **submit / observe / accept** operations driven by the provider; do not quietly change the existing synchronous callback contract into a scheduler. One npm package, JavaScript and generated types remain the common brief/P10/P13 constraints.

### 4.3 Schema sketch and checking

The following is **[inferred, proposed]**, intentionally a schema/authoring sketch rather than valid production configuration. `lock:` and `schema:` values below name entries whose real immutable source/schema digests are resolved into an admitted lock record. None is a claimed installed third-party capability.

```yaml
apiVersion: forge.flow/v1
name: diagnose-and-review
executionProvider: companion.graph
inputs:
  problem: { schema: schema:Problem-v1 }
providers:
  analysis: { plugin: lock:third-party-analysis, capability: analyze/v1 }
  review:   { plugin: lock:third-party-review,   capability: review/v1 }
steps:
  - name: diagnose
    invoke: analysis
    harness: pi
    input: { problem: { from: input, pointer: /problem } }
    output: { schema: schema:Findings-v1 }
    effect: read
    evidence: [native-terminal, artifact-digest, checks]
  - name: review
    needs: [diagnose]
    invoke: review
    harness: codex
    input: { findings: { from: diagnose, pointer: /output } }
    output: { schema: schema:Review-v1 }
    effect: read
    evidence: [native-terminal, artifact-digest, checks]
outputs:
  review: { from: review, pointer: /output }
```

**[inferred]** The real schema must separate a native package from a callable capability. Each lock entry binds original package identity/version, immutable source revision and captured content digest, capability/version, input/output schema IDs and digests, native component/entrypoint, supported harness profile, required tools/transports and declared effect requirements. A skill is instructions, not automatically a typed callable. Its adapter must define and validate the result contract or expose text honestly; no invented structured API.

**[inferred]** Preserve Agent Plugins/native packaging. Put optional capability annotations in a permitted client namespace or an independently reviewed composition descriptor; do not add forbidden top-level portable manifest fields or make a Forge packaging ecosystem. Unmodified providers can be described by bindings whose provenance separately identifies the provider and the adapter. A plugin dependency says “installed/compatible”; `needs` says “accepted prerequisite”; an input binding says “use this exact value.” None substitutes for the others.

**[inferred]** Compilation checks all referenced providers, source/schema digests, native availability, entrypoints, cycles, outputs, permissions, execution limits and the referenced dependency edges before dispatch. For the pilot, edge compatibility uses **identical schema digest** or an explicit admitted transformation capability. Arbitrary JSON Schema subsumption is not a small feature and is not promised. Runtime validation still checks every actual value; schema equality cannot prove value correctness.

**[inferred]** Support a documented bounded data/schema subset initially: primitives, bounded arrays, closed objects and locally resolved contract references. Reject unsupported schema constructs rather than assuming compatibility. Reuse the existing contract-shape machinery where adequate; do not claim it is a complete third-party JSON Schema validator. Any required general validator is an explicit, reviewed dependency choice, not a hand-written full implementation. Missing pointers, extra fields, wrong types, oversized results or changed source produce a typed refusal/INCOMPLETE result before dependent execution. Use literal bindings and JSON Pointers, not an expression language in 0.1.0.

### 4.4 Authority, shared state and the acceptance gate

**[inferred]** Separate the three stores of meaning:

| Owner | Owns | Does not decide |
|---|---|---|
| Forge Kernel | Approved scope; issue/lease/revision; admitted composition/provider identities; dispatch intent; accepted handoffs and evidence; current authority for effects | Model conversation, native token cache or provider scheduling implementation |
| Execution provider / existing workflow runtime | Scheduler state, concurrency, native sessions, retries/checkpoints and cancellation/reconnect mechanism | Issue closure, protected approval, acceptance of work or expanded permission |
| Harness | Model/tool loop, native authentication/context, permission controls, session/event semantics | Cross-provider accepted authority by virtue of saying “done” |

**[inferred]** A handoff carries run/step/attempt and stable dispatch IDs; parent request ID/context digest; issue/revision/lease epoch; repository/cwd and expected/observed base/head; composition/provider/schema/source digests; output artifact reference/digest; evidence references; effective route/tool policy; native session identity; terminal/validation/cleanup status. Metadata is not a replacement for verified artifacts. Handoff data is untrusted input, not instructions granting downstream permissions.

**[inferred]** Required path: **approved scope → frozen composition → checked WorkPacket/dispatch intent → provider execution → terminal observation → schema/artifact/authority/evidence validation → atomic Kernel acceptance → dependent release**. Re-read current authority both before dispatch and before acceptance. An authorized implementation result can propose a new head; Kernel verifies the base-to-result relationship and scopes the successor packet to the accepted head. A mid-flow commit must not masquerade as proof against the original head.

**[read/inferred]** Current Companion `graph.mjs:325–339` releases successors on child `completed`. Therefore simply submitting today's prompt-only graph and auditing its final result would be unsafe. The optional provider needs a **trusted completion-admission callback/checkpoint outside the model**: it validates/re-fetches the Forge acceptance receipt, and only then commits the node as graph-successful. Acceptance refusal or outage leaves the node blocked/partial. This provider extension belongs outside Forge core under decision 34; its hook ordering must be proved.

**[inferred]** An immediate experiment can instead use an existing host to submit one Companion job at a time, validate/accept it and submit the next. That demonstrates typed cross-harness value with less provider work. Label it host-mediated sequential execution; it does not certify the whole Companion graph or general parallel lowering. Never use a model's final text, canary or forged acceptance ID to simulate the trusted gate.

### 4.5 Native execution surfaces and provider conformance

These routes come from the supplied harness dossiers; they are **[read] attributed source/command evidence**, not new installed proof. Keep original authentication/session engines and capability negotiation. Forge core consumes an execution-provider contract rather than implementing each session driver.

| Harness | Native seam to consume through provider/host | Material conformance boundary |
|---|---|---|
| Pi | SDK `createAgentSession`, JSON mode, or correlated stdin/stdout RPC. | Request acknowledgement/queued/handled is not completion; correct settlement differs by command. Preserve extensions/tools and explicit permissions. [read: `harness/pi-deep-dive.md:74,266–282`] |
| Codex | App Server thread/turn operations for persistent control; SDK or `exec --json` plus authoritative final output for bounded one-shot work. | Pin CLI/protocol tuple, correlate items/errors/approvals and output schema; terminal event plus actual artifacts/checks, not prose. [read: `harness/codex-deep-dive.md:238–244`] |
| Claude Code | Agent SDK `query`/stream/control or print/JSONL. | Explicit tools/mode/plugin loading, resume identity, budgets/deadline; parse terminal errors and component errors. No Claude execution was performed here. [read: `harness/claude-code-deep-dive.md:377–395`] |
| OpenCode | Native server/SDK session APIs and events, using pinned generated bindings. | Directory/workspace identity, permission replies and abort/session routes differ by runtime family. A different model is not a different harness. [read: `harness/opencode-deep-dive.md:208–223`] |
| Cursor | Print/stream-json for bounded work; ACP/SDK if the supported tuple offers required control. | Failure may be stderr/nonzero without successful JSON; advertised output schema alone is insufficient. Effective tool/write policy must be provable. [read: `harness/cursor-deep-dive.md:186–201`; external SDK in §2.1] |
| Hermes | Query/stream-json, programmatic API or negotiated ACP. | Preserve default-deny approval; oneshot auto-approval and safe mode disabling plugins are unsuitable plugin/permission proofs. [read: `harness/hermes-deep-dive.md:297–305`] |

**[inferred]** A narrow execution-provider interface advertises supported profiles and exposes `probe`, `submit`, `observe`, `cancel`, `reconcile/resume` and completion admission. It returns effective policy, native IDs, bounded semantic events and terminal evidence. Unsupported capabilities are typed refusals. Companion may internally use richer `start/steer/approve` APIs; Forge does not need to clone them. MCP Tasks/A2A/ACP can transport parts of this contract, but none replaces Kernel acceptance or promises an identical permission sandbox.

### 4.6 Recovery, resume and per-step evidence

**[inferred]** Persist intent before launch with a stable idempotency key and execution-provider ownership fence. After a disconnect, first reconcile by dispatch/native-session ID. Resume means reuse a known accepted result or attach to known work; it does not mean blindly rerun an ambiguous write. No exactly-once external side-effect promise is made.

| Failure | Required behavior and evidence |
|---|---|
| Failed schema/check/evidence | Refuse handoff acceptance; zero dependent dispatches. Retain failure artifact and diagnostic receipt. |
| Provider crash or lost initial acknowledgement | Reconcile dispatch/session before deciding attached, safely retryable or uncertain. Retain old attempt identities. |
| Hung native tool | Meaningful-progress timestamp plus per-step outer deadline; cancellation requested is separate from acknowledged exit/cleanup. |
| Ambiguous write/cancellation | Block overlap and retry until effects/process state are reconciled and current authority permits the action. |
| Changed plugin/schema/composition/head/lease | Old accepted output remains historical evidence; changed bindings require re-admission and invalidate affected descendants. |
| Completed independent branch | Keep its accepted result when identity and authority remain applicable; do not replay successful expensive work merely to recover another branch. |

**[inferred]** Each step needs a standard evidence envelope, plus native provenance: plugin/component digest and adapter version; requested/effective route; native session/item/tool IDs; argv/tool identity with secrets removed; cwd/base/result head; check command, exit and artifact hashes; timestamps/usage when actually reported; cancellation and cleanup outcome. Evidence has explicit **PASS / FAIL / INCOMPLETE**, and separately says source-read, executed or live-readback rung. A reported tool call is not independently verified command execution; an exit 0 is not semantic task success.

**[inferred]** “Identical evidence across Pi and Codex” means the same mandatory schema, validation rules and evidence obligations, with truthful provider-specific provenance. It does not mean equal generated text, token counts or byte-identical fresh receipts. Opaque providers and missing usage fields must remain visibly partial. A finalizer enumerates every requested output and accepted prerequisite, not just the last step.

### 4.7 Cloud and cross-device role

**[inferred]** Sharing compositions requires immutable Git revisions, lock records and conformance receipts; it does not require cloud compute. Use the existing native/portable packaging and optional registry/catalogue distribution. Publish a composition and its support matrix separately from user data and credentials. The same admitted artifact can be consumed locally, in CI or inside another host.

**[inferred]** Cross-device continuation needs more than copying a conversation: permitted artifact transfer, verified repository/head availability, composition/provider identities, accepted handoffs, and exactly one current authority/lease epoch. A team/cloud broker can own that authority and redacted journal/artifact references; local workers own native credentials and execution. A transferred lease fences the old device. An uncertain write on device one blocks dispatch on device two until reconciled.

**[inferred]** With only a local Kernel, use an explicit validated export/import or broker migration protocol; file sync of SQLite and “latest snapshot wins” is not an authority model. Cloud outage leaves accepted local history readable and protects mutations under the declared authority policy. Start 0.1.0 with local proof and Git-shared compositions; broker-backed device resume is a later optional slice with its own fencing/privacy/recovery tests. A hosted agent platform/chat UI is unnecessary for this answer and would conflict with the complement boundary.

## 5. Proving value, release scope, effort and risks

### 5.1 A concrete 0.1.0 proof

All targets below are **[inferred, proposed acceptance criteria]**, not measured results.

1. **Outside author, real components.** Recruit an author outside Forge/Companion maintenance. They choose two independently maintained third-party plugin capabilities and publish a small composition/lock in their own Git repository. Record original upstream package/component identities; Forge bindings do not count as third-party plugins. Candidate pools include GitHub Awesome Copilot's `testing-automation` and published Cursor plugins. Their existence is documented, but Pi/Codex compatibility and typed capabilities are **not yet established**. Source/permission checks must pass before selection; otherwise select another real provider and record the rejection, rather than fabricate a portable plugin. [external: [testing plugin](https://github.com/github/awesome-copilot/blob/main/plugins/testing-automation/README.md), [Cursor plugin repository](https://github.com/cursor/plugins), 2026-10-02]
2. **Bounded task.** In a disposable public fixture repo, Pi uses plugin one's analysis capability to produce a closed `Findings` artifact for a seeded bug; Codex uses plugin two's review capability to consume that accepted artifact and produce a `Review` artifact. Deterministic checks verify the seeded finding, cited source location and artifact hashes. Read-only first; then one scoped implementation variant verifies an authorized diff and test result. No merge/deploy is needed to prove the composition claim.
3. **Counterfactual baseline.** Run the same task/plugin/harness/model budget with Companion alone plus ordinary handoff instructions, and with one existing typed workflow substrate. Keep failures and manual glue in the comparison. Forge must improve authoring/recovery/evidence without changing the task or buying a stronger model.
4. **Interchangeability.** Swap Pi and Codex node bindings for capabilities actually supported in both; require the same evidence obligations and check outcomes. One-sided compatibility is reported honestly and cannot satisfy the swap proof.
5. **Fault injection.** Reject a wrong schema, stale plugin digest, missing prerequisite, stale lease/head, duplicate request with changed content and a forged PASS. Interrupt after the first accepted step; restart the parent/provider; retain that step and complete only the unfinished one. Lose cancellation acknowledgement on the scoped write variant and show that no duplicate writer starts.
6. **Independent re-fetch.** A fresh verifier reads both native terminal traces, all step attempts, Kernel acceptance records and every output/check artifact. Require zero dependent calls after refusal and no claimed success with missing evidence. Installed plugin loading and permissions must be observed in the real Pi/Codex tuple; fake harness tests alone do not satisfy release proof.

**[inferred]** A host-mediated sequential pilot is the smallest valid first run. The admitted Companion graph provider becomes supported only after its trusted completion hook and restart/cancellation gates pass. A read-only demo alone must not certify write policy or delivery safety.

### 5.2 Pilot metrics and stop criteria

**[inferred]** Collect a paired trial sheet over **10 bounded tasks**, with at least one repeat on a second machine/clean installation. This is a screening sample, not statistically persuasive productivity research. Publish task definitions, failures, budget, versions and raw evidence.

| Metric | Proposed success bar | What it tells us |
|---|---|---|
| Outside authoring | First usable composition in ≤60 minutes after installation; ≤30 lines of provider-specific glue; maintainer assistance logged | Whether composition helps another author rather than only its creator |
| Handoff quality | 100% accepted outputs satisfy declared schema/provenance; seeded malformed/stale cases cause zero dependent calls | Structural/type/authority consistency, not correctness of all prose |
| Recovery | All injected ambiguous writes block; accepted predecessor dispatch count stays one; unfinished work resumes within two minutes after explicit reconciliation | Safety and reuse under measured failure boundaries |
| Integration effort | ≥30% lower median hands-on setup/handoff/recovery time than the equal-budget baseline | A useful adoption signal; report total maintainer/support time too |
| Runtime overhead | For already available artifacts, no-model admission overhead p95 <1 second; orchestration overhead <5% of task wall time | Whether checks are cheap enough; separate cold start/inference/storage costs |
| Evidence coverage | Every output/attempt/required check has a fresh verifiable record; missing fields explicitly INCOMPLETE | Consistency across harnesses |
| Retention | Author voluntarily reruns or adapts the composition within two weeks | Demand beyond an arranged demo |
| Cost | Actual reported tokens/cost by attempt, unreported usage count and manual effort; no required saving target | Prevents token-saving claims from hiding retries/support burden |

**[inferred]** Stop or narrow if an existing host/provider reaches the same outcomes with less glue; if the outside author needs core changes for each plugin; if authority cannot precede successor release; or if installation/support overhead erases the handoff saving. Do not rescue the experiment with a marketplace, cloud scheduler or more model calls.

### 5.3 One maintainer plus agents

**[inferred estimate]** Incremental bounded proof, excluding the rest of the final plan and major upstream repairs:

| Work | Agent-worker-days | Maintainer responsibilities |
|---|---:|---|
| Lock/capability/schema binding and compile refusals | 2–3 | Choose real providers, freeze supported data subset, review trust boundary |
| Host-mediated provider bridge, then trusted completion admission | 3–5 | Enforce decision 34, review effective permissions and failure ordering |
| Kernel accepted handoffs and recovery identity | 2–4 | Review authority/lease/effect correctness; no second workflow authority |
| Installed Pi/Codex/outside-author and fault proof | 3–5 | Run/observe real tuples, resolve external access, integrate evidence |
| Packaging, author example, support matrix and report | 2–3 | Review public contract and proof-based release wording |
| **Total** | **12–20** | **Approximately 35–60 focused maintainer hours** |

**[inferred]** With two bounded agent lanes yielding a combined 6–10 useful worker-days/week and one maintainer contributing 15–20 focused hours/week, allow **3–5 calendar weeks**, including outside-author coordination. This is capacity planning, not observed velocity. Agents own non-overlapping contract/adapter or proof lanes; the maintainer owns design, authority review and release decisions. No full core scheduler, visual editor, provider fleet or cloud deployment is priced here.

**[inferred]** If Companion's October 1 restart/cancel/stall failures require substantial execution repair, budget a separate **2–6 week contingency** or keep the provider Experimental while proving the host-mediated route. An uncertain installed permission model can block the write proof entirely. Do not hide upstream work inside the 12–20 day estimate or make Companion mandatory to ship Forge's independent capabilities.

### 5.4 Risks and responses

| Risk | Response / falsifier |
|---|---|
| Vendors add cross-harness handoffs and portable flow metadata | Already happening in adjacent products. Re-evaluate each release; shrink to accepted authority/evidence adapters if native products satisfy the task with less glue. No lasting novelty claim. |
| Plugins only expose prompts, or outputs are semantically wrong | Honest text capability or explicit checked adapter; schema validity plus deterministic task checks. Refuse unsupported typed guarantees. |
| Provider completes before Kernel acceptance | Trusted completion gate; refused/outage cases prove zero downstream dispatch. Without it, graph lowering is unsupported. |
| Permission semantics differ; plugin code has broad privileges | Probe effective native policy and actual tool behavior; declared read-only hints are insufficient. Fail closed for unsupported scopes; do not claim packaging containment is a sandbox. |
| Crash causes duplicate effects or two owners | Durable dispatch IDs, fencing, native reconciliation and explicit ambiguous state. No blind write fallback or exactly-once promise. |
| Two state stores drift | Provider owns execution observations; Kernel owns accepted work. Correlate immutable IDs/digests; provider state cannot close an issue or mint approval. |
| Cross-device privacy and fencing fail | Local-first pilot, scoped redaction/artifact transfer, one authority broker and fenced handover before cross-device support. |
| One maintainer supports every vendor feature | Two certified tuples first, optional providers, versioned capability matrix, conformance failures visible. Add a harness only for measured demand. |
| A compelling demo proves no adoption | Paired equal-budget baselines, outside authoring and voluntary reuse. Shrink scope when these fail. |

## Bottom line — final verdict in 10 lines

1. **[inferred]** Hypothesis 1 survives only as a portable checked capability-binding gap.
2. **[external]** Claude workflows and MCP composition refute the universal “plugins cannot form flows” claim.
3. **[external/read]** Companion, agtx, AO and VS Code refute the universal multi-harness nonexistence claim.
4. **[inferred]** The combined authority/type/evidence promise remains a hypothesis requiring live comparison.
5. **[inferred]** Forge should own admission and accepted handoffs; existing runtimes should own scheduling.
6. **[read/inferred]** Decision 18 needs implementation clarification, not a reversal.
7. **[read/inferred]** Decision 34 remains optional Companion outside core.
8. **[inferred]** The first proof is two real third-party capabilities, Pi/Codex and independently verified fault recovery.
9. **[inferred]** Estimate 12–20 worker-days and 35–60 maintainer hours, with provider repair separately priced.
10. **[inferred]** If existing tools win that comparison, reduce Forge to the useful authority/evidence seam.

## Recommended plan changes

1. **Replace the gap claims.** State widespread packaging with uneven semantics, existing same-/cross-harness workflows, and a candidate portable admission/handoff/evidence advantage. Cite the exact counterexamples above. Remove any “first/only” positioning. **[inferred]**
2. **Clarify decision 18 without changing its default.** Add user compositions lowered to host/provider execution; permit only bindings whose dependency release preserves Kernel acceptance. General durable orchestration remains delegated. **[inferred; read: decision 18]**
3. **Operationalize decision 34.** Require a separately versioned Companion conformance profile: normalized request/policy, trusted completion gate, meaningful progress, acknowledged cancellation, restart reconciliation and typed terminal artifacts. Absence or failure has explicit host/Experimental semantics. **[inferred; read: decision 34]**
4. **Add capability I/O and lock identity to the public contract work.** Distinguish package dependencies from accepted-step dependencies; exact schema equality or explicit transformation first. Consequential fields belong in versioned checked contracts, not advisory metadata. **[inferred]**
5. **Insert the bounded outside-author pilot before broad execution/cloud claims.** Make Pi/Codex installed evidence, failure cases and the comparative baseline release artifacts. Reuse current validators/broker/effect owners; account for the synchronous executor boundary. **[inferred]**
6. **Stage cloud.** Git sharing first; broker-fenced cross-device resume later. No hosted agent runtime, chat frontend or new scheduler prerequisite. **[inferred]**

These are recommendations recorded in this sole research artifact; no plan ledger, issue or implementation was mutated. **[ran]**

## Open questions for the owner

1. **Product wedge. A — Accepted typed capability handoffs across existing runtimes. B — Reopen decision 18 for a Forge-owned durable DAG engine. C — Limit Forge to standalone authority/evidence tools. Default: A.** Reasoning: A tests the differentiated seam while respecting existing decisions; B duplicates substantial prior art and requires a separate recost; C is the fallback if comparative pilot demand fails. **[inferred]**
2. **Proof route. A — Host-mediated Pi/Codex proof first, then certify the optional Companion graph gate. B — Make Companion graph conformance a prerequisite for the first demo. C — Use a different optional workflow/execution provider first. Default: A.** Reasoning: A isolates Forge's value from known provider incidents without hiding the graph gap; B tests the complete graph sooner but risks conflating two projects; C is useful if another provider preserves the gate with less integration. Decision 34's optionality is not reopened. **[inferred]**
3. **Cloud staging. A — Share immutable compositions in Git now; cross-device authority transfer after local proof. B — Fund broker-backed device resume in 0.1.0. C — Defer both distribution and device resume. Default: A.** Reasoning: A gets composition reuse without new compute/authority operations; B requires transfer/privacy/fencing proof and extra effort; C saves work but weakens outside-author reuse. **[inferred]**

Valid response: a combination such as **A+A+A**; silence means the stated defaults for planning, not authorization for implementation beyond this research phase.

## Confidence

**High** that the two absolute hypotheses overstate the gap: multiple positive primary-source counterexamples, plus Companion graph source, settle existence at documentation/source rung 2. **Medium** that Forge can add useful typed admission and accepted evidence: current contracts/Kernel provide a plausible foundation, but the trusted provider gate, actual plugin portability and async durability are not yet proved. **Low-to-medium** on demand, productivity and schedule: no outside-author pilot or comparative runtime experiment ran here; all targets and effort are estimates. No absence or reliability claim has been rounded up to live proof.
