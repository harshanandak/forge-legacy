# P15 — Simplicity, easy control, and cuts

Decisions needed: adopt the smaller launch scope and the authoring/control journey below. Recommended default: **A — capability-first 0.1.0**, with the mandatory three harnesses, local knowledge, existing safety gates and all five migrations intact. This is a research recommendation, not implementation or approval of another stage.

## Bottom line — 10 lines

1. Make the headline “add once, control once, use natively”; delivery is one selectable solution, not the product boundary.
2. A skill should take one Markdown file; a new tool should normally require editing one small function, with inspectable metadata generated around it.
3. Use one project config and one Contracts-owned plan for scaffold, validation, explanation, admission and native projection.
4. Target five minutes for a skill, ten for a simple local tool, three for a behavior edit, and fifteen for the cold all-three capability journey.
5. Preserve Kernel authority, exact-identity trust, protected gates, one package, Pi/OpenCode/Codex and all-five migration proof.
6. Keep a well-supported Claude/Cursor base; defer additional certification breadth, Hermes packaging, T3 enforcement and framework-specific examples.
7. Drop duplicate editable carriers, a second resolver, compulsory workflows and any new Forge agent loop.
8. Keep local repo/device FTS, decisions and bounded links; defer provider demos, cloud services, hosted apps and richer extraction.
9. Target 100–176 agent-days provisionally; reserve 175–279 maintainer hours and 10–19 weeks until allocation is rebuilt; 160–255 hours is only a sensitivity scenario.
10. Release evidence must show an outside author’s new capability active in all three mandatory harnesses, including denial and an honest reload/trust state.

## Request identity and evidence boundary

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p15-simplicity-and-cuts-20261002",
  "contextDigest": "899ac66e37601b5d6792efa0544ecc17c1e2f73a52b4a7333e404c7eab2cfa0b",
  "context": {
    "summary": "Forge final plan, leg P15: design the 'add any capability / control any harness in minutes' experience and rank every plan item by value to it, proposing cuts."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": { "write": true, "tools": [], "maxCostUsd": null },
  "route": { "model": "gpt-6.1-sol", "thinking": "xhigh", "search": true }
}
```

Research date: 2026-10-02. The route is preserved request metadata, not a claim about the answering model. Only this report is written. No implementation, install, native invocation, browser, context-mode, Kernel mutation, GitHub write, commit or push belongs to this phase.

Evidence labels follow `(local scratch)`: **[read]** means a specified source was inspected; **[ran]** means the stated command ran; **[external]** means primary documentation was checked; **[inferred]** means a recommendation, estimate or deduction. None of the proposed commands, timings, gates or native effects below has been run. Source support is evidence rung 2; proposed behavior is not runtime or live proof.

Tracked-code evidence is from `git show origin/master:<path>` at the locally tracked remote ref **8ceb8c4aeeb93dc59cb9b967205f1d08e187a03c** [ran: remote-ref inspection]. This is not a claim that GitHub was freshly fetched. The plan/dossiers are supplied local research artifacts; several dossier audits use an older source pin. Keep those pins separate from the current tracked-code reading and from newly checked documentation.

### Source register

Short labels below carry file and line references; line ranges are inspection locations, not evidence of execution.

| Label | Source and relevant locations |
| --- | --- |
| N | [north-star.md](../north-star.md):9–24 platform direction; 28–44 capacity, architecture and harness tiers; 46–51 item 19; 54–65 hard boundaries and outside authors. Entire file read. |
| P | [platform-plan-final.md](platform-plan-final.md):244–472 architecture/catalogue; 551–670 config/admission; 930–1061 harnesses; 1601–1704 bridges/scope; 1712–1804 work/forecast; 1808–1886 migrations; 1890–2016 proof; 2095–2110 innovation; 2139–2217 all 48 decisions; 2414 forecast allocation. Entire plan read across the research lanes. |
| B | [P11-block-architecture.md](P11-block-architecture.md): Contracts composition/config API, six boundaries, catalogue and outside-author contract; reconciled into P:244–713 and P:2006–2016. |
| U | [P6-usage-and-productivity.md](P6-usage-and-productivity.md): adoption, seven task metrics and author/config targets; authoritative integrated benchmark is P:1959–1975. |
| H | [P7-harness-plugins.md](P7-harness-plugins.md): native catalogue projection and per-host packaging; detailed dossiers below are the semantic evidence. |
| Pi | [pi-deep-dive.md](../harness/pi-deep-dive.md):100–155 config/resources; 183–194 awaited control/reload; 228–258 MCP/trust; 313 refresh limits; 607 installed-proof gap. Audit candidate 0.99.2, source evidence. |
| OC | [opencode-deep-dive.md](../harness/opencode-deep-dive.md):71–107 config/startup loader; 114–156 awaited control; 170–202 native assets/permissions; 247–272 V2 differences; 307/371/426 restart/proof. Audit candidate 1.18.34, source evidence. |
| CX | [codex-deep-dive.md](../harness/codex-deep-dive.md):83–113 config/root loader; 178–234 hook trust, skills, agents, MCP and permissions; 373–394 packaging. Candidate 0.159.3 version/help evidence, no native profile proof. |
| CC | [claude-code-deep-dive.md](../harness/claude-code-deep-dive.md):92–182 carriers/agent omissions; 229–375 hook semantics; 402–414 reload/setup limits. Documentation/source evidence. |
| CU | [cursor-deep-dive.md](../harness/cursor-deep-dive.md):64–114/158–214 carriers; 118–156/178–184 gate semantics; 86–92/150–154 refresh. CLI/help evidence, desktop not proved. |
| HE | [hermes-deep-dive.md](../harness/hermes-deep-dive.md):83–146 carriers; 219–293 gate/lifecycle limits. Source evidence, native package deferred here. |
| T3 | [t3code-deep-dive.md](../harness/t3code-deep-dive.md):75–184 provider paths; 200–210 authority gaps; 607–626 restart/effective home. Source evidence, enforcement certification deferred here. |

The owner explicitly invites cuts that reduce effort without losing easy control [read: N:46–51]. The following cannot be cut: one npm package; sole Kernel issue/workflow authority; gates never weakened; explicit trust; mandatory Pi/OpenCode/Codex; nonblocking but well-supported Claude/Cursor; outside-author support designed into 0.1.0; and all-five safe migration before importer retirement [read: common.md; N:40–44,54–65; P:1880–1886].

## 1. The user experience to build

### What exists today

| Current surface | What the inspected path actually does [read] | Gap to the headline |
| --- | --- | --- |
| `forge add <source> --name <id>` | `lib/commands/add.js:72–118` records a source in `forge.lock`; `lib/forge-lock.js:62–184` supplies containment, local integrity and sorted upsert. Remote locators can remain unsupported/untrusted. | This path does not scaffold, bind config, validate an author descriptor or project a native capability. Locking a source is not admission. |
| `forge new adapter <name> --kind=review --template=greptile` | `lib/commands/new.js:3–12`; `lib/adapter-cli.js:56–67,108–144`: one review-adapter JavaScript starter, safe name/no-clobber. | Useful scaffold mechanics; not an arbitrary skill/tool/hook/flow authoring surface. |
| `forge init --profile minimal --harness claude,cursor,codex --dry-run` | `lib/commands/init.js:20–30,270–396,515–579`: config/patch/protected-path rendering; preview only returns config. | Pi/OpenCode are outside this inspected flag enum; preview is not a complete config-plus-carrier plan. |
| `forge options stages|gates|adapters|roles|diff|why|lint --json` | `lib/commands/options.js:88–241` inspects the resolved runtime graph. | Reuse resolve/lint/explain concepts; these collections are not yet the general capability catalogue. |
| Role/gate/control writes | `lib/config-writer.js:3–126` preserves sibling keys and handles dotted IDs via array paths; command callers are `role.js`, `gate.js`, `control.js`. | Sparse writer exists, but no complete preview, revision/CAS transaction, schema round-trip or projection reversal. |
| Skills/setup/projection | `lib/skills-sync.js:40–53,68–101,198–260,335–365`; `lib/codex-skills.js:7–32,101–141`; `lib/commands/setup.js:1830–1972,2196–2247,4043–4129`. | Reuse managed-copy preservation, drift and host emitters. The inspected helpers do not provide complete Pi/OpenCode capability projection or a reusable final-byte dry-run plan. |
| Public contracts | `lib/contracts/index.js:3–31`; `lib/contracts/src/schema.js:10–18,68–72`; `lib/contracts/src/validate.js:93–120,339–372`. | Reuse canonical/hash/validation diagnostics. Add a distinct author descriptor; the existing memory capability-manifest schema is a probe/evidence envelope, not an installation descriptor. |
| npm author API/types | `package.json:6–20,87–154`: CLI bins and broad packed code, no explicit `exports`/`types`; typecheck reports no TypeScript. | Physical deep imports do not constitute a stable, typed public author API. |

Current Forge repository skills use tracked `skills/` as canonical and `.agents/skills` as a generated discovery mirror [read: skills-sync and codex-skills above]. The approved future single editable `.agents/skills` arrangement needs a deliberate migration. Do not describe that change as landed or hand-edit existing generated mirrors.

### Proposed ordinary journey: add a tool

**[inferred] All commands in this subsection are proposed UX.** Extend the existing `add` parser with explicit capability flags; retain the existing source-lock form. A `--kind` request means scaffold, while `--capability` means bind an already installed/local data-only descriptor. Do not silently fetch code, guess a module format or execute code to discover its schema.

```text
forge add greeting --kind tool --for pi,opencode,codex
# Edit .forge/blocks/greeting/action.cjs
forge config apply
# Perform the exact reload/trust step printed for each selected harness.
# Invoke greeting through each harness's native tool list.
```

Useful explicit inspection paths use that same plan, not another implementation:

```text
forge add greeting --kind tool --for pi,opencode,codex --dry-run
forge config validate
forge config explain --capability greeting
forge config apply --dry-run
forge config apply --expect-revision <revision-shown-by-preview>
forge status --capabilities --json
forge config revert --receipt <apply-receipt>
```

An already installed outside block follows the same binding/admission route:

```text
forge add ./vendor/greeting/forge.block.json --capability --for pi,opencode,codex --dry-run
forge add ./vendor/greeting/forge.block.json --capability --for pi,opencode,codex
forge config apply
```

`add` creates the authoring candidate and desired config binding. It does not activate unadmitted executable code. `apply` validates the whole candidate, explains required grants/effects, requests only the approvals still missing, commits the approved config/carrier plan, and returns activation steps and a receipt. Reading public descriptors, previewing changes and discovering schemas never imports the action, installs dependencies or resolves credentials [inferred, preserving P:330–355,551–670].

The admitted handler uses the bounded captured code closure, not an unchecked mutable author file. Config apply and each owned carrier write use revision checks and recoverable prior bytes. There is no atomic transaction spanning five native config homes: a partial projection records incomplete targets, reverses only unchanged owned writes where possible, and refuses conflicting user edits. Native activation is a separate readback; failure cannot become aggregate PASS [inferred].

The minimal default action is one bundled synchronous CommonJS file:

```javascript
module.exports = {
  run({ input }) {
    return { greeting: `Hello, ${input.name}` };
  }
};
```

The public descriptor declares the default `name` input, `greeting` output, `run` operation, execution profile and effects. It stays data-only. If the author changes the input/output shape, they also edit the small descriptor/schema; the generator cannot infer a trusted schema by importing arbitrary JavaScript. A Promise, undeclared effect, inaccessible binding or unsupported schema is a visible refusal, not an automatic fallback to a broader runtime [inferred; read: P:330–338,602–633].

| User touches | Forge generates or maintains | Honest minimum |
| --- | --- | --- |
| Normally `.forge/blocks/greeting/action.cjs`; descriptor/schema too when changing shape | `forge.block.json`, supported JSON schemas, generated docs/type declarations and a small invocation fixture | One authored function plus inspectable generated metadata, not literally one total file. |
| One binding in `.forge/config.yaml`, inserted by `add` | Exact source/closure lock, origins, grants/admission references, selection and target mappings | One config place. Hand editing is optional; there is no second live solution file. |
| No edits to carrier trees | Pi extension/resources; OpenCode server/plugin shim; Codex native skills/agents plus MCP and reviewed hooks; contained Claude/Cursor resources | All come from the same catalogue and admitted public handlers. |
| Required native trust/reload acknowledgement | Per-host activation status and effective readback, with the exact artifact/config revision | A generated file alone is “written,” not “active.” |

A short config binding can be one line under `blocks` [inferred illustration of P's proposed dialect, not current config syntax]:

```yaml
blocks:
  greeting: { source: { manifest: "./.forge/blocks/greeting/forge.block.json" } }
```

Keep `.forge/config.yaml` as the project entry point, with an explicit schema version/migration for the existing fields. A portable solution file may be an import/export artifact, but must not become another active config authority. Preserve the plan's four layers: defaults → pinned template → project → invocation. Device preferences are explicitly queried knowledge that can be materialized into an approved edit, not a silent fifth layer [inferred; read: P:586–590; decision 8].

### Skill, command and flow variations

**[inferred]** `forge add release-note --kind skill` creates the canonical `.agents/skills/release-note/SKILL.md` and inserts its selection. Name/description/body are enough for the smallest skill. `forge add explain-change --kind command` creates one Markdown prompt with declared parameters. `forge add review-before-ship --kind flow` creates a short declarative step list selecting existing capabilities. The flow compiler can explain/lower supported structures; Forge executes only its admitted single operations and bounded sequential reference templates. Arbitrary durable/branching ordering remains the chosen host's responsibility [read: P:713–858; decision 18].

The Agent Skills specification supports a small Markdown source with required metadata; it does not standardize execution authority. Forge should use it directly rather than invent another prompt format [external: [Agent Skills specification](https://agentskills.io/specification)].

### Plain-language entry

**[inferred]** A user can ask their existing agent: “Add a greeting tool to Pi, OpenCode and Codex,” or “Ask before project writes in every harness that can enforce it.” A small Forge skill instructs that agent to call the same public scaffold/edit/preview/apply API or JSON CLI. It shows the candidate files and native support results. There is no Forge model router, autonomous agent loop, private helper API or second approval mechanism. An agent can author the candidate; it cannot mint human approval, accept its own trust grant or claim a host is active without readback.

### One-place behavior changes

**[inferred]** Put portable intent and versioned host-specific overrides in `.forge/config.yaml`. The schema includes selected models/providers, tool exposure, instruction/context sources, hook selection and ordinary policy defaults. Protect Kernel invariants and required gates outside precedence. Keep native approval/isolation/project trust, hook trust and MCP authentication distinct.

```text
forge config edit --set /harnesses/defaults/toolExposure/projectWrite --value ask --dry-run
forge config edit --set /harnesses/defaults/toolExposure/projectWrite --value ask
forge config apply
forge config explain --harness pi
forge config explain --harness opencode
forge config explain --harness codex
```

The field names above are proposed schema fields. `ask` is a request for an enforceable interaction, not a promise of identical native permission models. Lowering must return **supported**, **requires review/reload**, **unsupported**, or **blocked by stronger policy**. A host with no equivalent ask path refuses that required mapping; it never turns ask into allow. Explicit per-host overrides use the same file and explanation path.

| Control intent | Pi native surface [read: Pi] | OpenCode [read: OC] | Codex [read: CX] | Claude Code / Cursor [read: CC/CU] |
| --- | --- | --- | --- | --- |
| Model/provider defaults | Settings/models provider configuration; respect CLI/session overrides | `opencode.json` model/provider/agent settings | TOML profiles/model/provider; managed precedence can win | Claude settings/agent fields subject to plugin omissions; Cursor supported config/agent defaults, separately proved per product |
| Default/available tools | Settings plus extension tool registration and effective active-tool API; exposure and approval are separate | Custom tools/commands, MCP and permission rules; native rule precedence matters | MCP enabled/disabled tools and approval policy; native filesystem/network permissions remain separate | Native MCP/tool settings and permission rules; Cursor generic ask is not an enforcement primitive |
| Approval/gate behavior | Awaited `tool_call` control where proved; no invented universal sandbox/approval mode | Awaited `tool.execute.before`; deny by throwing, not a returned flag; bus notification is not a preflight barrier | Native approvals/permissions plus reviewed hooks; stronger managed policy wins; many hook failures do not fail closed | Use actual deny/permission contracts; hook crashes can continue; Cursor requires the real deny/fail-closed configuration |
| Injected context | Scoped AGENTS/skills and lifecycle/context extension seam | Scoped instructions, skills/agents and awaited injection seam | Scoped AGENTS/skills/native agents; project trust and discovery matter | Claude version/hierarchy-aware instructions; Cursor `.mdc` rules/skills/agents |
| Hook selection | Native extension lifecycle/event handlers | Server plugin lifecycle and stable awaited tool hook | Reviewed hook configuration plus executable-digest check | Claude hooks/settings/plugin hooks; Cursor watched hook configs and plugin resources |
| Required Forge gates | Same Policy/Kernel/CLI guard owner across every carrier; native hook is supplementary | Same | Same | Same; unsupported native enforcement cannot weaken the protected floor |

Examples: select a different model for Pi only; remove a custom tool from every target; add a local recall note to startup context; require review before a declared project-write capability; enable an additive custom gate. Every edit reports its origin, affected native files, grants, target gaps and activation step. “Turn off a protected gate everywhere” must refuse. “Apply the same model everywhere” must refuse or require a mapped provider/model when a target lacks that model [inferred].

### Refresh: fast where real, honest everywhere

| Harness | Proposed activation guidance grounded in dossier evidence | Claim boundary |
| --- | --- | --- |
| Pi | Generate extension/resource package; use `/reload` at a safe boundary where supported, then verify effective tools/context. | Not arbitrary in-flight state transfer. Current pinned settings docs say `/reload` adds new default tools but does not necessarily disable removed tools; use the supported active-tool API or a new process and read back. |
| OpenCode | Generate the exact server-loader entry/shim; start a fresh process for changed executable plugins. Use V2 reload only for the independently proved resource surface. | Stable startup loader and V2 registries are different contracts; import failure logged-and-skipped cannot produce PASS. |
| Codex | Generate native assets; review/trust hooks through the native UI; use a fresh chat/session or restart when the exact loader requires it. | Root packaging is version-sensitive; do not promise universal hot reload or mistake installation for trust. |
| Claude Code | Use settings/resource refresh where supported; reload plugin resources or start a fresh session for the remaining carrier changes. | ConfigChange, plugin cache/version, skills and lifecycle hooks differ. Version-aware AGENTS setup preserves custom hierarchy. |
| Cursor | Watched hook config saves can reload; plugin resources may require editor/plugin reload. Print separate CLI and desktop instructions. | CLI evidence is not desktop/cloud proof. |
| Hermes / T3 | Keep compatibility instructions only; use explicit process/provider restart and effective-home checks for the known path. | No new Hermes native package or T3 enforcement badge in this release. |

Primary refresh checks: [Pi 0.99.2 settings](https://raw.githubusercontent.com/earendil-works/pi/v0.99.2/packages/coding-agent/docs/settings.md), [Pi extension API](https://raw.githubusercontent.com/earendil-works/pi/v0.99.2/packages/coding-agent/docs/extensions.md), [OpenCode plugin documentation](https://opencode.ai/docs/plugins/), and [Cursor hooks documentation](https://prod.cursor.com/docs/hooks) [external]. These support conditional reload/startup behavior, not successful activation in the owner's installed environment. A negotiated MCP `listChanged` event permits catalogue refresh only when the client handles it; it does not reload arbitrary executable code or grant trust [external: [MCP tools specification, 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)].

**Codex evidence drift to reconcile before implementation:** the pinned dossier describes root Agent Plugins packaging that omits hooks and therefore needs separate local/portable roots. Newly checked official documentation explicitly permits hooks in the OpenAI root extension, with replacement/overlay rules and separate user review. This is a doc-versus-pinned-loader discrepancy, not proof that the audited loader now supports the whole path. Keep decision 36's safe two-root fallback until the selected version passes root-hook loading, deny, trust and executable-digest tests; then collapse the duplication if proved [read: CX:93–113,178–206; external: [OpenAI plugin build documentation](https://developers.openai.com/plugins/build/plugins), root hook/overlay and trust sections].

### Targets and measurement

All times are **[inferred] acceptance targets**, not measured outcomes. Count reading, edits, validation, refusal/repair, trust review and required reload. Do not hide these as “setup time.” Publish cold setup and warm authoring separately.

| Journey | Target | Start / stop |
| --- | --- | --- |
| Warm new skill | ≤5 minutes | First request to native discovery and one invocation in a selected installed harness |
| Warm simple local tool | ≤10 minutes | First request to correct result through a native selected-harness tool, including admission |
| Warm behavior edit | ≤3 minutes | Change request to verified effective setting or honest refusal; success additionally proves the required allowed/denied case |
| Cold headline capability | ≤15 minutes total | Installed selected artifact + accessible public docs + stated brief, to correct native invocation in Pi, OpenCode and Codex and the required refusal/reload readback |
| Initial installation/control setup | Measure separately, target ≤10 minutes on an already supported machine | Start install to all selected carriers discovered, with unfinished auth/trust explicitly visible |

The cold headline does not include obtaining provider accounts, installing three unrelated harnesses or building a complex business integration. Those prerequisites are named before the clock; ordinary Forge trust/approval steps remain inside it. Record elapsed time, active author time, number of authored files/commands, candidate count, help requests, target activation states, exact versions and failures/abandonments. Report raw trials and medians/ranges before a percentile claim; a small corpus cannot establish a population p95 [inferred; read: U; P:1959–1975].

Reuse the existing 30 agent-config tasks, two agents with fifteen tasks each, ≥10 manual/no-scaffold tasks, 30/30 first-submission parse/validate/execute requirement, ten separate forbidden prompts, two cold briefs with a sealed non-delivery brief, and ≤2 candidates per cold task. Keep the bound Memory call and Codex/Pi cold-author runs. Replay the **same accepted capability** in OpenCode's mandatory native gate for the all-three headline; this is an activation check, not a third cold authoring trial. Do not replace existing evidence with the new stopwatch [read: P:1949–1975; inferred OpenCode replay].

## 2. Capability forms and native carriers

This is the smallest credible author form, not a promise that every host understands every object identically [inferred, grounded in P:423–472 and H/dossiers]. Shared Markdown and a catalogue reduce authoring; native policy, agents and workflow semantics still require host adapters.

| Type | Smallest user-authored form | Native delivery | Ceiling/refusal |
| --- | --- | --- | --- |
| Skill | One `SKILL.md` with metadata/body; extra resources only when needed | Pi/OpenCode/Codex Agent Skills discovery; contained Claude/Cursor skill carriers | Instructions do not authorize effects. Maintain one editable source. |
| Command/prompt | One Markdown file with optional declared parameters | Pi prompt/command; OpenCode command; Claude/Cursor command; Codex skill/native supported command mapping | Codex legacy custom prompts are deprecated; do not invent an equivalent unsupported slash-command API. |
| Tool/action | One small bundled `.cjs` operation plus data-only descriptor/schema, generated initially | Pi `registerTool`; OpenCode native custom tool; Codex/Claude/Cursor tool exposure through the shared MCP where no equivalent native JS tool API is proved | Trusted synchronous profile, JSON input/output, declared effects/grants; no sandbox or enforced same-process deadline claim. |
| Read-only resource/context provider | Small descriptor plus a read function or declared existing handler | Native context hooks where proved and MCP resources/tools for clients | Scope/privacy filter before lookup/ranking/expansion; no implicit cross-project access. |
| Hook | One declarative event/rule selecting an existing operation | Pi extension event; OpenCode plugin hook; Codex reviewed hook; Claude/Cursor native hooks | Event names, awaiting, deny/failure behavior are mapped, not assumed. Outside custom code needs normal admission. |
| Gate/policy rule | One rule using a supported predicate and structured decision | Policy owner plus native preflight hook where enforceable; CLI/server guard remains authoritative | Additive evaluators cannot mint approval or disable protected invariants. |
| Agent/reviewer | One Markdown/YAML role descriptor selecting skills/tools/model | Pi extension/native supported agent seam; OpenCode agent; Codex TOML agent; Claude/Cursor native agent | Native field omissions, inheritance and review provider semantics remain visible. No new Forge agent loop. |
| Flow/workflow step | A short step list referencing catalogue operations | Host workflow/command resources; Forge's existing bounded sequential reference templates | Compile/explain supported structures; no general durable DAG runtime or universal recovery promise. |
| Template/role preset | A small config fragment selecting existing blocks | Same config compiler and native projections | Pinned template layer; no independent preset resolver. |
| Adapter/provider | Small descriptor plus one implementation of a declared public operation/client | Native handler or optional MCP; execution-provider packets for a certified provider | No provider PASS as Kernel authority; startup-only outside replacement. |
| Knowledge/decision | One typed note/decision/link record or import/export adapter | Same local Memory API from CLI/native tool/context | Repo/device identity, explicit scope, provenance, forget/restore and bounded traversal. |

Native tools on Pi/OpenCode and the optional MCP share admitted handlers. A tool accessed by MCP can still appear in the harness's native tool list. It does not imply that every harness loads the same JavaScript file in process, or that one stdio implementation means one process [read: P:973; decisions 21/37].

## 3. Cut rule and complete plan inventory

**[inferred] Ranking rule:** KEEP is necessary for the promise or a fixed constraint; SIMPLIFY preserves the value with a lighter form; DEFER needs a named consumer, failed target or sustainable capacity; DROP is duplication or a claim that should not exist. “High” value directly improves authoring, control, native correctness or safe reversibility. “Medium” is enabling assurance. “Low now” is extra reach or speculative operations. Effort refers to the marginal implementation/support burden for one maintainer, not the number of catalogue entries.

Savings are assigned once in the cut ledger below. Rows that point to a ledger entry do not add another saving. Already-later work saves **zero 0.1.0 days**. A descriptor can stay in the complete catalogue while its optional implementation waits; deleting the catalogue would make discovery and outside extension harder.

### All six architecture boundaries plus migration pace

| Boundary / deliverable [read: P:246–314; B] | Value / effort | Rank and smallest retained form [inferred] |
| --- | --- | --- |
| Contracts composition/config API and dependency-light wire leaf | High / high | **KEEP** one resolver/binder/admitter/invoker and strict public schemas/types. Reuse engines; no parallel runtime. |
| Kernel authority | Fixed / high | **KEEP** sole issue/run/workflow authority, leases/approval/receipt guards and recoverable store. Never move authority into a block/provider. |
| Memory/local knowledge | High / medium-high | **KEEP** functional repo/device SQLite FTS, typed decisions/provenance and bounded links; optional semantic providers wait. |
| Flow | High / medium | **SIMPLIFY** admitted sync operation + bounded reference sequence; host owns general orchestration. General DAG was already excluded: zero new saving. |
| Policy | Fixed / medium | **KEEP** protected invariants, additive rule/evidence clients and actual authority-at-effect checks. |
| Adapters/projection | High / high | **SIMPLIFY** mandatory native three, Claude/Cursor base and one MCP; defer reach beyond that package. See cuts C1–C7. |
| Physical reorganization | Low now / high if wholesale | **SIMPLIFY** facades and caller redirection first, moves only with equivalence proof; no invented savings for moves already excluded. |

### All 37 catalogue families

Rows correspond to P:436–472. Keep names and descriptor identities discoverable even where implementation is deferred.

| # | Family | Value / effort | Disposition [inferred] |
| ---: | --- | --- | --- |
| 1 | Skills | High / low | **KEEP** one Markdown author source and generated/native carriers. |
| 2 | MCP tools/resources | High / medium | **KEEP** one thin server plus shared handlers and protocol proof. |
| 3 | Agents/reviewers | High / medium | **KEEP** small native descriptors, truthful host omissions. |
| 4 | Workflows | High / medium | **SIMPLIFY** short declarations/host lowering and bounded reference execution. |
| 5 | Config/composition | High / high | **KEEP** generic bindings, four layers, validation/explain/revision-checked edits. |
| 6 | Templates/roles | High / low-medium | **SIMPLIFY** delivery + advisor/non-delivery starter; derive other views. |
| 7 | Lint/format | Medium / existing | **KEEP** existing quality guards as selectable declared capabilities. |
| 8 | Tests/types/mutation | Fixed / existing-medium | **KEEP** required lanes; capped optional experiments remain capped. |
| 9 | PR security stages | Fixed / existing | **KEEP** current protected authority/security checks. |
| 10 | Block/config conformance/provenance | High / high | **KEEP** open checker and exact-identity receipts. |
| 11 | PR review | Medium / existing | **KEEP** normalized provider/read behavior required by reference solution. |
| 12 | Planning/research | High / low | **KEEP** reusable skills; no compulsory delivery ladder. |
| 13 | Issues/comments/dependencies/leases | Fixed / existing | **KEEP** Kernel-native public operations. |
| 14 | Readiness/planning buckets | Medium / existing | **KEEP** current bounded authority-backed views. |
| 15 | Repo memory/FTS | High / medium | **KEEP** local scoped recall, evidence and recovery. |
| 16 | Device/cross-project memory | High / medium | **KEEP** private explicit-scope device knowledge; no implicit grants. |
| 17 | Decisions | High / medium | **KEEP** typed history, provenance and causal links. |
| 18 | Connected graph | High / medium | **SIMPLIFY** authored/source-backed one/two-hop context; richer extraction later, C12. |
| 19 | Policy/rules/gates/approvals | Fixed / medium | **KEEP** additive customization under protected invariants. |
| 20 | Harness projection | High / high | **KEEP** one catalogue; simplify breadth via C1–C7. |
| 21 | Worktrees/isolation | Fixed / existing | **KEEP** safety/link/refusal/cleanup owners. |
| 22 | Ship/push/PR linkage | Medium / existing | **KEEP** standalone guarded commands and unique link operation. |
| 23 | Merge/post-merge | Fixed / existing | **KEEP** exact-head/lease/approval/receipt guards. |
| 24 | PR observability/shepherd | Medium / medium | **SIMPLIFY** bounded observations/durable accepted evidence; retire watchers only after owner/caller proof. |
| 25 | Events/logs/state queries | High / medium | **KEEP** local inspectable state/history, scoped query/watch/replay contracts. |
| 26 | Export/restore/upgrade | Fixed / medium | **KEEP** migration/restore/local recovery and actionable diagnostics. |
| 27 | Marketplace/discovery/recommendation | High / low-medium | **SIMPLIFY** exact-release static index + manual explicit pin; hosted service later, C9. |
| 28 | Cloud/data sync | Low now / high | **DEFER service**, keep portable local contracts; C9, zero baseline credit. |
| 29 | External app/UI APIs | High API / medium | **KEEP** local public APIs; **DEFER** app/network bridge, C10. |
| 30 | Execution/process supervision | High / medium | **SIMPLIFY** existing owned lifetimes and process inventory; outside sync startup-only. |
| 31 | Orientation/session hooks | High / medium | **KEEP** small scoped native hooks, honest refresh/trust. |
| 32 | Efficiency/usage evidence | High / low-medium | **SIMPLIFY** local journey timings/raw receipts; defer collection/study, C11. |
| 33 | Optional execution providers | Medium / medium | **KEEP seam**, **DEFER** new certification absent a consumer, C12; Companion stays outside core. |
| 34 | Release/version automation | Medium / existing | **KEEP** protected current release; defer new recipe, C13. |
| 35 | Doctor/preflight/adoption checks | High / medium | **KEEP** targeted explain/readiness/repair, not another dashboard. |
| 36 | GitHub context/account edge | Fixed / existing | **KEEP** current identity/transport separation and guarded operations. |
| 37 | Business/event/handoff bridges | Low now / high | **DEFER implementations**, retain catalogue seam; C14, zero baseline credit. |

### Every scope-row deliverable

This crosswalk covers all 22 areas in P:1683–1704; the table above does not silently erase a scope row.

| Scope area | Disposition / retained boundary [inferred] |
| --- | --- |
| Outside authors | **KEEP** public descriptor/schema/docs/scaffold, trusted sync local and already installed pinned bundled CJS, declared binding/conformance. **DEFER** async/stateful/isolated profiles, C12. |
| Config/catalog/templates | **KEEP** compiler/explain/CAS; **SIMPLIFY** template presentation. No new hierarchy/reactive engine. |
| Contracts | **KEEP** six facades and strict selected public exports/types; **DEFER** Rust/full internal typing, C15. |
| Kernel | **KEEP** local sole authority and recovery; **DEFER** shared authority, C9. |
| Memory/Knowledge | **KEEP** repo/device FTS/decisions/links/scope/recovery; **DEFER** provider demo and code/semantic engine, C3/C12. |
| Flow | **SIMPLIFY** single sync operation + bounded Forge reference sequences; wider ordering belongs to host. |
| Policy/gates | **KEEP** protected floor and additive custom rules. |
| Worktrees | **KEEP** reference-required isolation/safe lifecycle; **DEFER** remote fleets, C12. |
| Review | **KEEP** reference normalized provider behavior; **DEFER** managed provider marketplace, C12. |
| Delivery | **KEEP** strict serial guarded delivery/rerun policy; **DEFER** eligible queue pilot, C12. |
| Skills | **KEEP** one editable canonical source, owned native links/contained distribution assets and drift. |
| Native harnesses | **KEEP** mandatory Pi/OpenCode/Codex and Claude/Cursor base; **DEFER** new breadth, C1/C2/C7. |
| Framework/headless/MCP | **SIMPLIFY** public API/JSON CLI + one generic MCP; **DEFER** Vercel/LangGraph-specific certification and extra SDK fixtures, C4/C5/C12. |
| Built-in secure verification | **KEEP** free open local/CI checker and exact-artifact evidence; **DEFER** hosted runners/new optional verifier scope, C9/C12. |
| Marketplace | **SIMPLIFY** generated static index and outside publication/review formats; **DEFER** public directory campaigns/hosted discovery, C9/C16. |
| Cloud | **KEEP local contracts**, **DEFER** network service, C9. |
| Hosted solutions | **KEEP** target/grant/quota boundary and existing two-target design fixtures; **DEFER** service/pilot, C9. |
| Events/state/log APIs | **KEEP** scoped local APIs and config edits; **DEFER** authenticated remote subscriptions/webhooks, C10. |
| Visualization app/UI plugins | **DEFER implementation**, contracts retained; no core UI, C10. |
| Execution providers | **KEEP** admission/evidence seam and optional Companion boundary; **DEFER** additional certification, C12. |
| Own solution/UI | **KEEP** standalone trusted public-API consumer boundary; **DEFER** supported auth/remote bridge, C10. |
| Binary distribution/runtime | **KEEP** existing advertised binaries + packed Node24/26 and pinned Bun proof; **DEFER** only unadvertised compiled-Bun experiment, C6. |

### Every workstream

The following covers every row in P:1718–1743. Workstreams are not separate sums from the catalogue/scope tables.

| Workstream | Value / effort | Rank / concrete change [inferred] |
| --- | --- | --- |
| Delivery truth | Fixed / medium | **KEEP** exact-head evidence/receipt semantics; neither speed nor a native carrier replaces authority. |
| Operating contract/safety | Fixed / medium | **KEEP** lease, approval, cancellation and protected owner checks. |
| Bounded delivery tools | Medium / medium | **KEEP correctness**, **SIMPLIFY** optional performance experiments under the existing cap. |
| Five ordinary + one coupled landing pilot / mutation diagnosis | Medium / medium | **KEEP** existing pilot and configured mutation lane; no retry-to-green. |
| Public contract/catalogue lock | High / high | **KEEP** all public author/config/catalogue boundaries and exact IDs. |
| Public typing/packed consumers | High / 9–18 days in plan | **KEEP** strict selected public API; broader internal work waits, C15. |
| Functional ownership/generic core | High / high | **KEEP** facades/shared composition over reused engines; no big folder move first. |
| Local knowledge/identity | High / high | **KEEP** repo/device floor, private scoped retrieval and recovery. |
| Runtime/bootstrap/process proof | High / 9–16 days in plan | **SIMPLIFY** JS/bootstrap/actual process-set evidence; C6 only if compiled artifact is unadvertised. |
| Optional provider demonstration | Low now / 4–8 days | **DEFER** Graphiti/vault demo; C3. |
| Config compiler/edit path | Highest / high | **KEEP**, prioritize integrated authoring/apply/status/reversal over extra distribution; add marginal UX allowance. |
| Admission/reference execution | Fixed-high / high | **KEEP** trusted sync exact identity + bounded reference execution; no general DAG add-on. |
| Outside vertical slice | Highest / high | **KEEP** generic new capability, not a private delivery-only example. |
| Reference solution migration | High / medium | **KEEP** delivery selectable through the same public path; no private bypass. |
| Host exposure | High / high | **SIMPLIFY** mandatory three + Claude/Cursor base + generic MCP; C2/C4/C5/C7. |
| T3 certification | Low now / 8–14 days | **DEFER** enforced profile; C1. |
| Open checker | Fixed-high / 3–5 days | **KEEP** public local/CI verification; no paid PASS/rank. |
| Five-project migration | Fixed / 3–6 days plus gaps | **KEEP all five**, WAL-aware backup/restore/fidelity and post-cutover reconciliation. |
| Build/adopt roadmap | High / medium | **SIMPLIFY** adoption/caller ledger and reused formats; C3/C12/C13 optional implementations wait. |
| Pruning/artifact closure | High / medium | **KEEP** required removals/packed artifact closure, no extra package. |
| Public state/local-data seams | High / medium | **KEEP** local API contracts; **DEFER** network/app operations, C9/C10. |
| Harness refresh | Medium / ongoing | **SIMPLIFY** version/release/security triggers, C17; known-good pins and incident response remain. |
| Lighter publication proof | Fixed / high | **KEEP** existing decided proof/artifact boundary; not another cut. |
| 0.2 backup/sync | Later / 8–14 days + 5–8 hours | **DEFER**, already later; C9 gives zero 0.1.0 credit. |
| Shared Kernel | Later / 12–22 days + 8–14 hours | **DEFER**, separately fenced milestone; C9 gives zero credit. |
| Hosted pilot | Later / unpriced operations | **DEFER** until capacity and consumer; C9 gives zero credit. |

### Other enumerated deliverables and innovation seams

All eight §3.13 bridges remain **DEFER implementation / KEEP catalogue seam**: tabular snapshot/analytics; knowledge/context with provenance; human review/handoff plan; automation/event adapter; communications/notifications; business-system read/write edges; operational scheduling/status; payments/entitlements. Each has zero baseline saving because P already excludes all eight from mandatory 0.1.0 work and author trials. Their risks are delayed domain validation and integration reach; add one only for a named consumer with a separately priced effect/refusal profile [read: P:1601–1622; inferred C14].

| §9.1 innovation seam [read: P:2095–2110] | Disposition [inferred] |
| --- | --- |
| Exact-identity evidence | **KEEP** trust/activation evidence follows exact artifact/config. |
| Portable composition with explicit degradation | **KEEP** mandatory-three proof and unsupported mappings; no universal parity claim. |
| Demand-led promotion metadata | **SIMPLIFY** manual static metadata and explicit review; no automated ranking. |
| Reproducible local/CI proof | **KEEP** open checker and packed environment receipts. |
| Consented failed-capability diagnostics | **KEEP private local seam**, **DEFER** collection/public demand feed, C11. |
| Composable maintained templates | **SIMPLIFY** few useful starters, not a template library campaign. |
| Agents discover/compose through public APIs | **KEEP** existing-agent path, **DEFER** autonomous publication, C12. |
| Cross-harness portability as possible moat | **KEEP evidence**, **DROP** unproved moat/productivity/breadth claims; zero implementation saving, reduced promise risk. |

### Explicit cut and saving ledger

Worker-days below are marginal estimates from P where cited, otherwise marked inferred. Maintainer-hour allocations beyond separable plan figures are planning assumptions, not measurements. Repeated references to a cut do not increase its saving.

| Cut | Disposition / scope removed | Agent-days saved | Maintainer time saved | Risk / add-back trigger |
| --- | --- | ---: | ---: | --- |
| C1 T3 enforcement | **DEFER** Codex-direct/Claude-SDK host certification; retain compatibility docs/observation | 8–14 [read: P:1802] | 4–7 hours [inferred allocation] | Users in T3 lack an enforcement badge; add only after demand and effective-home/approval/receipt proof. |
| C2 Hermes package | **DEFER** new native Python shim/plugin certification; preserve existing skills/CLI compatibility | 10–16 [read: P:1802] | 6–10 hours [inferred allocation] | Less Hermes-native integration; add for a consumer with OS/lifecycle/fail-closed proof. |
| C3 Provider demos | **DEFER** decisions-only Graphiti and Basic Memory/vault/Git recipe proof work; keep documented seams/export | 4–8 [read: P:1802] | 3–5 hours [read: P:1802] | Provider seam remains less battle-tested; add when native knowledge cannot satisfy a real task. |
| C4 Vercel certification | **DEFER** SDK-specific Node facade profile | 2–4 [read: P:1751] | 1–2 hours [inferred allocation] | Reduced framework reach; generic API/JSON CLI/MCP remain, add for a pinned consumer. |
| C5 LangGraph graph node | **DEFER** graph-specific fixture; retain generic MCP implementation and full advertised MCP proof | 1–2 [inferred marginal part of P's combined 4–7] | 0.5–1 hour [inferred] | No certified graph-node lifecycle; add after generic-client demand. Do not subtract the whole shared MCP budget. |
| C6 Compiled-Bun experiment | **DEFER only if unadvertised**; keep required Bun runtime workload and existing binary targets | 2–4 [read: P:1766,1802] | 2–3 hours [read: P:1802] | Compile/startup/size trade-offs unmeasured. If the path is advertised/required, saving is zero and its proof stays. |
| C7 Additional Claude/Cursor breadth | **SIMPLIFY** retained well-supported base; defer extra SDK/ACP/cloud/desktop certification scope beyond that base | 8–13 gross [read: P:1802] | 6–9.5 hours [read: P:1802] | Explicit profile gaps; preserve current supported behavior, required advisor/recovery paths and version-aware setup. Promote only after separate proof. |
| C8 Duplicate architecture | **DROP** second config/resolver, editable host mirrors, extra package, compulsory workflow/agent loop | 0 incremental baseline credit | Lower future maintenance; unpriced | Compatibility migration must preserve user files. These are rejected directions, not newly funded code to subtract. |
| C9 Cloud/hosting services | **DEFER** encrypted backup/sync, shared Kernel, hosted index/runner/solution operations | 0 in 0.1.0; later backup 8–14, shared Kernel 12–22 [read: P:1741–1743] | 0 in baseline; later 5–8 + 8–14 hours; hosted unpriced | No cross-device/shared authority or hosted SLA claim. Consumer + capacity + separate authority/recovery proof required. |
| C10 App/auth bridge/UI | **DEFER** app implementation, network bridge, OAuth/cards/subscriptions | 0 identifiable launch saving; already staged | No new operator burden; unpriced | Less visual/network convenience; retain public local APIs and target/data/grant contracts; add for an actual client. |
| C11 Adoption/telemetry/productivity campaigns | **DEFER** hundred-activation recruitment, hosted telemetry/public failed-demand feed and matched uplift study; keep local author timing | 0 separable baseline saving; mostly postlaunch/unpriced | Avoid postlaunch recruitment/follow-up burden; unpriced | Less adoption evidence. Start bounded opt-in exploration after capability proof; never claim uplift or retention without data. |
| C12 Optional breadth | **DEFER** async/stateful/sandbox profiles, remote fleets, managed review marketplace, queue, extra providers, richer extraction, SDK/HarnessAgent extras and autonomous publication | 0 separately credited; already excluded or embedded in host rows | Unpriced; no additional credit beyond C1–C7 | Each has a named-demand trigger; none replaces local authority, mandatory capability or bounded reference proof. |
| C13 Release recipe | **DEFER** new Release Please/Changesets probe; use current protected automation | 0 explicit priced saving | Avoid recipe maintenance; unpriced | Current flow may remain manual; add only after measured release friction. |
| C14 Eight bridge implementations | **DEFER all**, catalogue only | 0; already later | 0 baseline | Business-domain validation delayed; one separately authorized consumer reference at a time. |
| C15 Rust/full internal typing | **DEFER** comparator and broad internal graph conversion; keep JS/strict public types | 0 baseline; conditional Rust 12–21, full internal types 20–40 [read: P:1804; decision 43] | Rust conditional 10–16 hours; broad types unpriced | A measured bottleneck/high-risk boundary can justify a separate increment; public safety/type proof remains. |
| C16 Directory campaigns | **DEFER** Pi gallery and other public directory submissions | 0 isolated baseline saving | Unpriced review/support avoidance | Discovery narrower. npm/static self-hosted author publication stays; directory eligibility and user authorization precede submission. |
| C17 Broad refresh cadence | **SIMPLIFY** release/version-change plus immediate security/trust triggers, instead of weekly all-host feed campaign | No one-time saving credited | Possible upkeep reduction not credited; retain 1–2 hours/week reserve | Longer stale windows. Record pins and revalidate before changing versions or advertising support. |
| C18 Extra quickstarts/templates | **SIMPLIFY** one add/change walkthrough; delivery/advisor views reuse the same fixture; extra polished launches wait | 0 separable saving; shares config/reference work | Unpriced | Less breadth of examples; keep mandatory check/review/refusal/recovery fixtures in owning gates. |
| C19 Unproved claims | **DROP** universal hot reload, universal sandbox/approval parity, safe-code badge, productivity percentage, cloud-ready/one-process/moat claims | 0 code credit | Reduced support/confusion; unpriced | Smaller marketing promise, more honest effective-state evidence. |

Gross removable launch work C1–C7 is **35–61 days** and **22.5–37.5 allocated hours**. These gross rows share handlers, catalogue assets and proof infrastructure. Reserve **5–10 days / 3–5 hours** for overlap rather than deleting required shared floors. That gives a provisional net cut of **30–51 days / 19.5–32.5 hours** before the incremental UX allowance [inferred arithmetic]. If compiled-Bun work cannot be removed, restore 2–4 days/2–3 hours. If Claude/Cursor scope lacks a removable nonblocking portion, its cut must shrink; “well-supported” remains the goal.

### All 48 §10 decisions

These are proposed dispositions, not recorded owner decisions. Seven existing owner-decided choices stay decided: 2, 3, 5, 6, 30, 31 and 34. Choice letters below refer to the plan's local alternatives, not names for product objects. Savings/risk for DEFER/DROP rows are in the named cut entry; no duplicate saving is implied [read: P:2139–2217; inferred].

| Decision | Rank / recommendation | Value, effort and reason |
| ---: | --- | --- |
| 1 Outside execution | **KEEP A** | High: trusted bundled sync action is the smallest real outside capability; wider profiles C12. |
| 2 Launch identity, decided | **KEEP decided A** | Fixed: `forge-workflow@0.1.0`, one package and unique prereleases. |
| 3 Launch proof, decided | **KEEP decided A** | Fixed: lighter launch proof, unchanged required CI/native/author/migration guards. No fresh savings for already rejected broad campaign. |
| 4 Resources/forecast | **SIMPLIFY: choose C**, recost selected cuts | High: new explicit allocation and provisional range below, not the old breadth forecast presented as certainty. |
| 5 Optional delivery/mutation, decided | **KEEP decided A** | Fixed: two worker-days/four owner-hours cap; configured mutation lane is not disabled. |
| 6 Artifact integrity, decided | **KEEP decided A** | Fixed: literal selected artifact/BOM/receipts and occupied-version discipline. |
| 7 Skill-link failure | **KEEP A** | High/low: one canonical source, owned links, actionable required-link refusal; no silent unmanaged mirrors. |
| 8 Config layers | **KEEP A** | High/medium: four explicit layers, origins/reset/replacement/protected floor. |
| 9 Lifecycle | **KEEP A** | High/low: startup-only outside actions; explicit reload/restart at safe boundary, C12 for richer lifetimes. |
| 10 First marketplace | **SIMPLIFY A** | High/low: exact-release static index/pinning/public checker; hosted operations C9. |
| 11 First cloud | **DEFER services; keep A sequence** | Low now/high: backup/knowledge first, shared Kernel separately fenced, C9. |
| 12 External app staging | **SIMPLIFY to C**, remove date promise | High local API/low now app: independent clients first; app/auth bridge on demand, C10. “By 1.0” is a goal, not unfunded commitment. |
| 13 First adopter wedge | **SIMPLIFY A** | High/low: outside JS/TS authors with repeated cross-consumer friction; positioning, not another launch workstream. |
| 14 Hosted sustainability | **SIMPLIFY A**, defer hosted operations | Medium/low: self-host/static/local CI; funding does not create operations capacity, C9. |
| 15 Follow-on bridges | **DEFER implementation; keep A priority** | Low now/high: tabular + provenance then handoff if demanded; all eight remain catalogue-only, C14. |
| 16 Adoption pilot | **DEFER / rewrite A** | Low now/high owner burden: exploratory postlaunch opt-in cohort first; hundred-activation six-week campaign only after recruitment/demand, C11. |
| 17 Runtime/framework adapters | **SIMPLIFY / rewrite A** | High generic/low now extra: public API/JSON CLI + generic MCP; Vercel and LangGraph node certification wait, C4/C5. |
| 18 Flow bound | **KEEP A** | High/medium: supported compile/explain, sync operation and bounded reference sequence; host ordering stays native. |
| 19 OpenAI staging | **SIMPLIFY / rewrite A** | High native/medium: mandatory Codex + common skills/plugin formats/MCP; SDK/HarnessAgent fixtures and ChatGPT extras deferred, C10/C12. Never choose generic-MCP-only in place of mandatory Codex. |
| 20 Catalogue/native artifacts | **KEEP A** | Highest/high: one catalogue and generator in one package; separate roots only where selected loader needs them. |
| 21 Thin MCP | **KEEP A** | High/medium: one server implementation, exact protocol/client proof; actual process count remains visible. |
| 22 OpenCode tier/carrier | **KEEP A** | Fixed/high: mandatory exact installed server entry/runtime-family proof; no Experimental escape at release. |
| 23 Community distribution | **DEFER directories; keep A local/self-hosted** | Medium/low: npm/static publication and outside discovery remain; galleries are later, C16. |
| 24 Hermes package | **DEFER to C** | Low now/high: legacy projection/CLI compatibility, no new native-package badge, C2. |
| 25 Provider investment | **DEFER demos to C** | High local/low now provider: native API/export/docs/seams first; no Graphiti/vault proof obligation now, C3. |
| 26 Serial versus queue | **KEEP A** | Fixed/medium: serial guarded delivery; eligible queue experiment later, C12. |
| 27 Quickstart | **SIMPLIFY / rewrite A** | Highest/low: lead with Add a capability / Change behavior; derive workflow/agent views from one fixture, C18. |
| 28 Template sequence | **SIMPLIFY to B** | High/low: advisor presentation only plus delivery reference; mandatory check/review/mock-recovery proofs remain in owning work, C18. |
| 29 Productivity pilot | **DEFER to B**, retain integration timings | Medium/owner-heavy: no uplift study/percentage claim at launch; author/control stopwatch is product proof, not statistical productivity measurement, C11. |
| 30 Memory providers, decided | **KEEP decided A** | Fixed: native local memory, optional decisions-only Graphiti, separate Graphify adapter; C3 defers demonstration, not this boundary. |
| 31 Pi priority/tier, decided | **KEEP decided A** | Fixed: flagship, Experimental until actual proof earns tier; cannot drop Pi. |
| 32 Pi release proof | **KEEP A** | Fixed/high: selected artifact/headless/Windows-TUI proof before mandatory promotion. |
| 33 Language/runtime | **SIMPLIFY to C with retained JS proof** | High/medium: on-demand device memory and JS/strict public APIs; retain quiet Node/Bun/process-set measurements. Defer unadvertised compiled experiment/resident comparison, C6/C15. |
| 34 Companion boundary, decided | **KEEP decided A**, defer extra provider certification | Fixed boundary: optional separately admitted block outside core; no new session runner, C12. |
| 35 Claude instructions | **KEEP A** | High/low: version/hierarchy-aware AGENTS setup, preserve custom files, no blanket pointer deletion. |
| 36 Codex packaging/trust | **KEEP A fallback**, simplify only after target proof | Fixed/high: local/portable root split as needed, normal hook review and script digest; fresh docs drift must be tested before collapsing. |
| 37 Pi/OpenCode transport | **KEEP A** | Highest/medium: direct native tools and optional common MCP; no alternate-transport mutation retry. |
| 38 Cursor scope | **SIMPLIFY to B** | Medium/medium: provisional CLI-native claim with explicit desktop gap and retained required advisor proof; well-supported base goal, no false complete badge, C7. |
| 39 PR monitoring | **KEEP A** | Medium/medium: bounded observations/durable receipts; watcher retirement needs owner/caller proof. No credited blind deletion. |
| 40 CI reruns | **KEEP A** | Fixed/medium: shared bounded infrastructure-only policy, cited conclusion/exact head; deterministic failure is diagnosed. |
| 41 Node/supply chain | **KEEP A** | Fixed/low: Node24 floor, CI24/26, existing provenance/audit; optional new verifier only if compatible. |
| 42 Release recipe | **DEFER to C** | Low now/medium: protected current release until measured need, C13. |
| 43 Public typing | **KEEP A** | High/high: strict public API/schema-owned declarations/packed closure; full internal graph later, C15. |
| 44 T3 integration | **DEFER to C** | Low now/high: documentation/observation-only compatibility, no enforced host certification, C1. |
| 45 Harness refresh | **SIMPLIFY to B plus immediate security trigger** | Medium/ongoing: version/release refresh, explicit stale windows and incident response, C17. |
| 46 First knowledge | **KEEP A** | High/high: functional repo/device notes/FTS/decisions/links/recovery; cloud later. |
| 47 Physical migration | **KEEP A** | High/medium: facades/redirection first, moves only with equivalence; reuse stores/engines. |
| 48 Graph depth | **KEEP A** | High/medium: authored/source-backed bounded traversal; enrichment/extraction optional, C12. |

## 4. The smaller 0.1.0

### Release scope

**[inferred] Retain these concrete deliverables:**

1. One `forge-workflow@0.1.0` npm artifact; complete generated public catalogue and strict selected Contracts exports/types/schemas/docs.
2. Kernel as sole authority; existing lease/approval/receipt/exact-head/security/cancellation floors; current configured validation and mutation lanes.
3. One `.forge/config.yaml` entry and four-layer compiler; generic binding/admission; pure validate/explain; complete dry-run; revision-checked apply and owned reversal.
4. Integrated `add` for skill/command/tool/rule/template/reference flow, and the same public API/JSON CLI for an existing agent to use.
5. Trusted synchronous outside bundled actions, local/already installed pinned package proof, bounded capture/grants and safe errors; no automatic dependency installation.
6. Functional local repo/device memory, FTS, typed decision history/provenance, bounded source-backed links, explicit grants/export/forget/restore; independently callable Memory/Flow modes.
7. Pi/OpenCode/Codex native installed profiles; well-supported Claude/Cursor base with honest product/version limits; one optional MCP implementation sharing native handlers.
8. One delivery reference solution and one advisor/non-delivery author starter through public APIs; required check/review/refusal/recovery fixtures stay in their owning gates.
9. Static exact-release discovery/publication formats, an open local/CI checker and a small plain-language Forge skill. No hosted registry/app or Forge agent loop.
10. All-five migration, existing advertised binary/packed runtime proof, unchanged author/config corpus and literal artifact/BOM/channel readback.

Required pruning remains: serve/dashboard/insights; obsolete dep-guard/team shell; duplicate `forge pr <verb>` aliases while retaining standalone commands and unique `pr link`; separate `packages/skills` after overlap/caller proof; generated editable duplication. Preserve the canonical asset/link migration and user-owned files. These are owner-required closures, not optional capability cuts [read: common.md; P:206–240,1737].

### The proof that cannot be cut

| Gate [read: P:1898–1908] | Required result in the smaller release |
| --- | --- |
| G0 | Static/format/types/schema/docs and complete generated/packed artifact inventory |
| G1 | Risk/applicability manifest, corpus membership and exact digests |
| G2 | Installed package/block consumers; independent Memory/Flow modes |
| G3 | Contracts/providers/public types/schema/mapping/catalogue/grants/capture/lowering parity |
| G4 | Kernel/Policy authority, admission/security/prototype/SecretRef safety, actual effect-owner checks |
| G5 | All five safe migrations, user `.forge`, fidelity/restore and post-cutover write disposition |
| G6 | Six npm environments, seven advertised native binary targets, Pi/OpenCode/Codex installed profiles and truthful optional-profile limits |
| G7 | Author/control journeys, unchanged config/author trials, generic non-chat/MCP transport and open checker |
| G8 | Literal selected artifact, BOM/receipt identities, channel readback and reverse path |

The six npm environments are Ubuntu/macOS/Windows × Node24/26. The seven advertised binary targets remain Windows x64; macOS x64/arm64; Linux glibc x64/arm64; Linux musl x64/arm64. Cross-building does not prove native execution. Required packed Node24/26 and pinned-Bun successful workloads, quiet-start/process inventory and memory measurements survive even if the new compiled-Bun experiment is deferred [read: P:1912–1916,1998–2016].

The five migration subjects remain Forge, Product-Suite, scoreeasy, Zwapit and agent-companion. Enumerate all five, not a sample. Use consistent WAL-aware backups of stores/sidecars and user config/link targets, preserve secure references without reading keys to output, verify IDs/fields/relationships/history/FTS/config fidelity, cut over one project at a time under UUID/authority fencing, exercise restore and reconcile post-cutover writes. Keep the reconciliation importer until **all five** pass; D46 retirement is not a shortcut around missing backups or historical import gaps [read: P:1808–1886].

Architecture acceptance still covers all six facades, all 37 descriptors, one catalogue path, repo/device identity/privacy, filtering before ranking and at every graph hop, scoped context, one/two-hop bounds, independently usable modes and actual process-set evidence. Optional provider/cloud negatives remain explicit, not fabricated PASS [read: P:2006–2016]. The general DAG campaign, fifty-journey campaign, seven-day observation and RC promotion were already excluded by decided scope. Removing them again saves nothing [read: P:1939–1947; decisions 3/18].

### Headline demonstration

**[inferred]** “An outside author, using public docs and no private helper, adds a new trusted synchronous capability in ≤15 minutes; the same accepted block is listed and invoked natively in Pi, OpenCode and Codex; a forbidden call refuses; effective activation and any required trust/reload are shown.”

Also demonstrate one cross-harness behavior edit in ≤3 minutes on the installed fixture, with at least one real deny/approval case and one unsupported/stronger-policy explanation. A successful add with a failed denied case is incomplete. A new package with only descriptors or screenshots is incomplete. Timings do not waive any G0–G8 requirement.

### Re-forecast and uncertainty

The plan states **126–220 agent-days, 175–279 nonrecurring maintainer hours, 1–2 upkeep hours/week, 11–19 weeks** at 20–25 focused hours/week and provisional three-agent throughput [read: P:1753–1789]. It also warns gross target cuts are not automatically additive [read: P:1802].

**Source allocation defect:** P:2414 describes six-harness work 41–66 + public types 9–18 + T3 8–14 as gross 70–118 before a 3–5 reduction to 65–115. The visible addends actually total **58–98**, leaving **12–20 unexplained days**. The overall prior subtotal 79–140 does add as 11–19 exposure + 3–6 migration + 65–115, but the largest bucket cannot be reconstructed. This report does not manufacture an exact source-derived reduced estimate [read + inferred arithmetic]. Add an explicit allocation row or correct the bucket before adopting a committed forecast.

| Forecast step | Agent-days | Maintainer hours | Status |
| --- | ---: | ---: | --- |
| Stated baseline | 126–220 | 175–279 | Plan estimate, not measured capacity |
| C1–C7 gross removals | −35 to −61 | −22.5 to −37.5 | Days mostly source-priced; owner rows partly allocated assumptions |
| Shared-floor overlap retained | +5 to +10 | +3 to +5 | Inferred reserve; catalogue/MCP/mandatory proof cannot disappear |
| Marginal integrated UX beyond funded compiler | +4 to +7 | +4 to +7 | Inferred; reuse existing writers/scaffold/emitters/diagnostics |
| Provisional smaller agent target; conservative owner allocation | **100–176** | **175–279 reserved** | Cuts selected, but owner capacity is not reduced before recost |
| Lower-owner sensitivity scenario | **100–176** | **about 160–255** | Assumed marginal owner allocations, not an adopted forecast |
| Conservative authorization ceiling pending allocation/pilot | **126–220** | **175–279** | Retain until hidden allocation and actual task overlap are reconciled |

Arithmetic: low days `126 − (35 − 5) + 4 = 100`; high `220 − (61 − 10) + 7 = 176`. Owner low `175 − (22.5 − 3) + 4 = 159.5`; high `279 − (37.5 − 5) + 7 = 253.5`, rounded outward to about 160–255. This is an explicitly allocated planning model, not a claim that the source prices those owner savings independently. If shared-floor overlap is 20 days at both endpoints, days become **115–186**. If no cut is confirmed at task level, use the existing ceiling. Unpriced follow-ons and rejected alternatives receive zero baseline credit [inferred].

Keep the implementation sequence short: freeze descriptor/API and inventory callers → build one public add/edit plan over existing helpers → prove one outside tool in all three mandatory harnesses → complete local knowledge/reference/migration/packed closure → prove literal launch artifact. The day-five/ten-day and outside/native/knowledge/runtime checkpoints can retire wrong assumptions without starting another platform [inferred; read: P:1745–1789].

| Capacity assumption | Calendar result [inferred] | Calculation / limit |
| --- | --- | --- |
| Three effective lanes, five agent-days/week each; 20–25 maintainer hours/week less 1–2 upkeep; conservative 175–279 owner hours | **10–19 weeks** provisional | Agent path 6.7–11.7 weeks; owner path 7.3–15.5; take max + 2–3 weeks review/rework/wait reserve. This reserve is not the removed seven-day ritual. |
| Same throughput, lower-owner sensitivity of 160–255 hours | **9–18 weeks** sensitivity only | Owner path 6.7–14.2 weeks; not a committed calendar until actual allocations and throughput support it. |
| Same model, high 20-day shared-floor reserve and unreallocated owner ceiling | **10–19 weeks** | 115–186 days; 175–279 hours; owner high 279/18 + 3 ≈18.5. |
| Only two effective agent lanes | **12–21 weeks** | 100–176 / 10 =10–17.6, then wait reserve; extra agents do not remove maintainer review bottleneck. |
| Only 15 maintainer hours/week less upkeep | **14–23 weeks** | Owner path about 160/14–255/13, then reserve; calendar cannot be promised from agent count alone. |

The headline scope becomes smaller more decisively than the date becomes earlier. Mandatory native loading/trust, parser/admission/public type proof and migration fidelity still dominate. Confirm actual throughput and cut ownership in the existing landing pilot before replacing the conservative ceiling [inferred].

## 5. Missing features worth adding

These serve control directly. They do not justify a new package, resident service or workflow engine. The incremental items sum to roughly **4–7 agent-days / 4–7 maintainer hours** in the scenario above; they extend the funded config/projector work rather than pricing it twice [inferred].

| Feature | Value | Smallest implementation / reuse | Marginal effort [inferred] | Why it earns a place |
| --- | --- | --- | ---: | --- |
| One integrated add plan | Highest | Extend existing `add`, adapter safe-path/no-clobber and pure init renderers; one Contracts plan reused by API/CLI/agent | 1–2 days | The existing source-lock command does not complete authoring; removes manual plumbing without hiding checks. |
| Effective capability/behavior status | Highest | Add per-host written/admitted/trusted/loaded/active/denied/unsupported states and readback to existing status/doctor surfaces | 1–2 days | “Config saved” stops being mistaken for control. Pi tool removal and Codex hook trust make this material. |
| Complete preview and owned reversal | High | Extend current sparse writer/action collector with final bytes, digests, revision check and receipt-backed reversal; project only owned artifacts | 0.5–1 day marginal ergonomics; underlying CAS is already funded | Makes one-place edits safe to understand and undo; preserves custom files. Does not roll back arbitrary external effects. |
| Repairable errors and origin explanation | High | Existing diagnostic conventions + public JSON Pointer/origin/constraint/repair; no private author hints | 0.5–1 day | Helps a human or agent fix the second permitted candidate without weakening schemas. |
| One small plain-language authoring skill | High | Calls the same public plan/API/JSON CLI; no new runtime/model router | 0.5–1 day | Makes “think of a missing feature and add it” an ordinary agent request. |
| Shared support/refresh matrix generated into docs | High | One catalogue/target descriptor source, emitted with scaffold/explain results | 0.5 day; shared with status budget | Prevents users editing five configs or guessing restart/trust steps. |

First-class hooks/rules, local context-source selection, explicit device-preference-to-config materialization, per-host model/tool overrides and a tiny working tool fixture belong in the already funded Contracts/config/native implementation. They are missing from the inspected current general authoring path but are not six separate products [read current-path table; inferred].

Do not add an interactive dashboard, remote configuration service, package solver, automatic marketplace installs, model router, semantic/code extraction engine or background watcher simply to make this journey look easier. Add a separate capability only when a real consumer cannot use the retained public/native path. Its effects/trust/lifetime proof must be priced with it [inferred].

## Bottom line — 10 lines

1. Forge's smallest useful promise is one-place authoring and control with native results.
2. Expose the public Contracts composition path through `add`, config edits, preview/apply and effective status.
3. Default authors edit a skill file or small tool function; generated metadata remains inspectable.
4. Native differences must appear as explicit support, trust and reload results, never silent weakening.
5. Keep Pi, OpenCode and Codex mandatory, with a well-supported nonblocking Claude/Cursor base.
6. Keep Kernel authority, protected gates, local knowledge, one package and every migration/proof object.
7. Defer Hermes/T3 certification, provider demos, framework extras, cloud/app operations and new release recipes.
8. Drop duplicate authoring/config paths and unproved universal or productivity claims.
9. Target 100–176 days provisionally, reserve 175–279 owner hours / 10–19 weeks; lower 160–255 hours / 9–18 weeks remains a sensitivity scenario.
10. The proof is an outside new capability, public-doc-only authoring, native all-three activation and truthful denial inside fifteen minutes.

## Recommended plan changes — exact list

1. Rewrite P's opening/§2 value proposition around N19: **Add a capability / Change behavior / See native activation**. Keep delivery as a selectable reference solution; move broad distribution/productivity aspirations behind this proof.
2. Add the section 1 journey to §3 Contracts/config: one `.forge/config.yaml` entry; explicit add scaffold/import flags; the same public plan for CLI/API/agent; pure full preview; complete validation; purpose/exact-identity admission; CAS apply; owned reversal; effective target states. Preserve all existing budget/schema/trust constraints.
3. Preserve §3's six functional boundaries and all 37 descriptors. Stage optional implementations without deleting catalogue families or moving engines/stores just to make folders look architectural.
4. Change §5 scope and §6 workstream assignments exactly as the inventory/cut ledger above: C1–C7 remove optional launch breadth; C8/C19 reject duplication/false claims; C9–C18 remain staged and receive no invented baseline savings.
5. Replace the main quickstart with one add/change example. Derive workflow and agent views from it; advisor-only polished starter plus the existing delivery reference. Keep every required check/review/refusal/recovery fixture in its gate.
6. Keep local repo/device FTS/decision/connected-context scope and all five migration obligations. Defer decisions-only Graphiti/vault demos without reopening decided provider separation or D44/D45/D46 authority/retirement boundaries.
7. Restrict advertised new profiles to proved Pi/OpenCode/Codex, the retained Claude/Cursor base and generic MCP. Mark Hermes native packaging, T3 enforcement, Vercel facade, LangGraph-specific node, SDK/HarnessAgent extras and broader Cursor paths as deferred. Do not withdraw current supported behavior implicitly.
8. Keep required Node24/26, pinned Bun workloads and every existing advertised binary target. Remove only the unadvertised compiled-Bun experiment; retain it and its proof if that condition fails.
9. Repair the unexplained 12–20-day host/type allocation in §6/integration log. Add cut owner/shared-floor allocation before adopting the provisional 100–176-day target; reserve 175–279 owner hours and 10–19 weeks for the smaller scope. Treat 160–255 hours / 9–18 weeks only as a sensitivity scenario. Retain the existing 126–220-day /175–279-hour ceiling until the pilot supports its replacement.
10. Extend §7 G7 with the five/ten/three/fifteen-minute targets and effective activation/deny readback. Reuse the existing author/config corpus and cold trials; replay their accepted capability in OpenCode. Do not relax G0–G8, candidate limits, held-out task, real Memory binding or literal-artifact proof.
11. Record the current-doc-versus-audited-Codex-root discrepancy in the harness ledger. Test the selected version before simplifying decision 36's local/portable split. Keep source/dossier/installed evidence separate for every harness.
12. Preserve §10's already decided **2=A, 3=A, 5=A, 6=A, 30=A, 31=A, 34=A**. Do not re-ask them.
13. Recommend closing unchanged open choices at **1=A, 7=A, 8=A, 9=A, 10=A-minimal, 11=A-staged, 13=A, 14=A, 15=A-later, 18=A, 20=A, 21=A, 22=A, 23=A-local-first, 26=A, 32=A, 35=A, 36=A-fallback, 37=A, 39=A, 40=A, 41=A, 43=A, 46=A, 47=A, 48=A**. These are proposed planning closures, not owner approvals recorded by this report.
14. Change explicit choices to **4=C, 12=C-on-demand, 24=C, 25=C, 28=B, 29=B-with-local-author-timings, 33=C-with-JS/runtime-proof, 38=B, 42=C, 44=C, 45=B-plus-security-trigger**. Each retains the hard boundaries stated in the decision table.
15. Rewrite, rather than silently relabel, **16** to a demand-led postlaunch cohort before any hundred-activation campaign; **17** to generic MCP/API first with Vercel/LangGraph certification deferred; **19** to mandatory Codex/common formats/MCP without extra SDK fixtures; **27** to capability/control-first with derived workflow/agent views. No existing alternative fully expresses these cuts.
16. Keep §§8–9 risks/seams, but remove unearned hot-reload/parity/one-process/sandbox/moat/percentage claims. Keep local diagnostic consent and open checker access; no hosted operation, app launch date or new provider is implied by preserving a seam.

## Open questions for the owner

These are choices about this report's recommendations, not permission needed to finish this research phase. The default completes the smaller plan; optional breadth never waives required proof.

| Question | A | B | C | Default / reasoning |
| --- | --- | --- | --- | --- |
| Launch breadth | **Adopt this capability-first scope**, mandatory three + Claude/Cursor base; all named optional cuts | Restore one named optional target with its budget and support obligations | Retain the full current breadth and later calendar | **A**. Concentrates one maintainer on the headline. B must name the target; do not restore a bundle implicitly. |
| First author UX | **Existing agent + CLI/public API**, one config, inspectable generated files | Add an interactive terminal wizard after the first measured author failures | Build a separate UI first, with an independent scope/owner | **A**. Least machinery, already fits the owner's way of asking agents to add features. |
| Timing promise | **Use ≤15-minute cold all-three target**, count repair/trust/reload and publish raw trials | Start with ≤20 minutes, still count everything, tighten from evidence | Avoid a time headline; report timings until enough trials | **A** as a target, not a current claim. If the retained corpus misses it, fix the path or disclose the measured result; never bypass gates to win the clock. |

Valid replies are A/B/C per question or a combination in table order; silence selects **A+A+A** for planning recommendations. This does not authorize implementation, native trust changes or publication in this research-only phase.

## Confidence

**High** that easy control should organize scope: it is explicit owner direction, and the current add/config/setup traces expose the missing end-to-end path [read: N19; current-code table]. **High** in retaining the hard boundaries and enumerated proof; **medium** in the proposed UX and native mapping until installed target evidence. **Low-to-medium** in the reduced calendar/owner allocation: the hidden host/type 12–20 days, shared proof overlap, migration gaps and actual maintainer throughput prevent a precise forecast. All timings and cuts are inferred planning targets. No native journey, productivity improvement, migration or release is claimed proved by this report.
