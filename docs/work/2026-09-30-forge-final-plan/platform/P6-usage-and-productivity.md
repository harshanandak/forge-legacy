# P6: Who uses Forge, how they integrate it, and real productivity

`protocolVersion: 1.0` · `requestId: forge-p6-usage-20261001-w` · `contextDigest: ceac005bac51d01a3fc7d5a9488f2bd0a2c426a1de1858ffbadee89883dfd070` · research only, 2026-10-01

Evidence labels: [read] = a file or tracked ref the research leg read; [ran] = a command result; [external] = a primary source with URL and date; [inferred] = reasoning. No integration, timing or productivity trial was run for this report. Every API, command, schema and YAML key marked "proposed" is a design proposal, not a shipped surface.

## Bottom line

1. Positioning: **Forge supplies reusable, verifiable building blocks for workflows and agents. Keep your orchestrator/harness; connect via validated config/public contracts and inspect outcomes.** [inferred from north-star items 1-4, 11, 12 [read]]
2. Decision rule: ordinary code or one model call first; a deterministic topology when steps and effects are known; one bounded agent when the next action is unknown; limited multi-agent only for truly independent branches with one integration owner, justified by an equal-budget outcome comparison. [external] Anthropic 2024-12-19, arXiv 2512.08296 (2025-12-09/2026-04-08) [inferred]
3. No universal AI productivity effect and no universal workflow-vs-agent ranking is established by the evidence; Forge must not claim one. [external] METR 2025-07-10, METR 2026-02-24, Cui et al 2025-06, DORA 2025-09-23
4. The SAME Memory recall block should be shown in both modes: as a workflow step and as an AI SDK agent tool, with identical host admission, scope and output semantics. [inferred] [read §3.12, §3.5]
5. Five personas, prioritising outside block authors and integrators; do not run five product launches. Shared first-success target 14 minutes, including repairs and abandonment. [inferred]
6. The current draft already avoids swarms (sequential, finite DAG); the cuts are a new scheduler, a universal agent abstraction, autonomy-duration or agent-count targets, a core UI, duplicate insights, and an un-demanded bridge inventory. [read §3.4, common.md] [inferred]
7. Seven honest metrics: defects, rework, cycle time, review effort, integration, recovery and total cost, each defined so failures and abandonments count. [external] DORA metrics 2026-01-05 [inferred]
8. Measurement stays local, opt-in, off by default, with no accounts or payload export, suppression below 5 participants and 90-day retention, reusing the existing usage-evidence module, not a new backend. [read §1 adoption metrics, memory-core index]
9. Reference templates ranked: (1) existing context + advisor stateless solution (workflow and SDK, same fixture), (2) check-and-review, (3) mock-gated effect with recovery. [inferred]
10. Three owner choices, each defaulting to A (A+A+A); silence means the default as a recommendation, not implementation approval. [inferred]

## 1. Context this report builds on

- North star: Forge is unopinionated reusable building blocks, one npm package, config as the public API, native complements to harnesses, open-source exposure first, an open marketplace with conformance and security, and an optional separate cloud/UI. Item 11 explicitly names both deterministic workflows and agents, and quality/efficiency outcomes: defects, rework, cycle time, integration, review and recovery. [read north-star.md]
- Settled constraints are not reopened: one package, Kernel as sole authority, local-first, gates intact, dashboard/`serve`/`insights` retired (so no reinstating them for metrics). [read common.md]
- The current platform draft already has author-first adoption, opt-in off-by-default local metrics, suppression below 5 participants and 90-day event pilot retention (§1 adopter and measurement). [read platform-plan-final.md §1]
- §3.1: `forge-workflow/author` is proposed, not a current export. The `trusted-action-sync/v1` `.cjs` entry exports `module.exports.operations`, with `handler({input, config, services})` and validated output; there is no Promise support, no enforced same-process deadline or sandbox, and ambient privileges apply. Data-only discovery neither executes nor installs. The bound client `services.lookup.invoke("recall", {query})` returns `{status:"OK", value}` or a typed refusal, and a host failure cannot be ignored. [read §3.1]
- §3.3 proposes `catalog.describe/discover`, `scaffold`, and `config.resolve/validate/explain/dryRun/edit`: one compiler, a pure preview with no execution, an explicit lock-apply, then purpose-bound admission, conformance and invoke. These are proposed names, not current commands. [read §3.3]
- §3.4: a finite sequential DAG over the existing runtime, capped at 32 nodes and 256 edges, with no new scheduler. [read §3.4]
- §3.6: the Kernel is the sole authority; a producer PASS is an observation, not protected approval or accepted state; all gates stay, with FAIL distinct from INCOMPLETE. Connected resume checks identities, artifacts, current authority and pending-effect idempotency, and never replays accepted effects; stateless starts take resupplied input. [read §3.6]
- §3.5 certifies one Vercel AI SDK Node facade and an experimental local stdio MCP/LangGraph profile; other frameworks are documented, not certified, with no duplicate runtime or package. [read §3.5]
- §3.12 uses existing Memory recall + an outside migration-note advisor + a stateless Flow fixture as the first example, not a mandatory delivery ladder; §4 keeps the full TDD delivery as a selectable reference; §3.13 bridges and §9.1 innovations are ranked hypotheses, not all to be implemented. [read §3.12, §4, §3.13, §9.1]
- Tracked ref observed (not re-fetched): origin/master `7d448ec812ef8639790477af07c3c75962173f8a`. `package.json` lines 2-3 give name `forge-workflow`, version `0.1.0-beta.8`; the Flow index (lines 93-110) exports `createBoundedLoop`; the memory-core index (lines 319-325) spreads the existing usage-evidence module. Generic proposed host APIs are not asserted as shipped. [read]
- The platform plan is a concurrent draft, so this report cites section anchors, not line numbers. [read]

## 2. Primary evidence used

| # | Source (date) | What it shows | Limit |
|---|---|---|---|
| 1 | Anthropic, Building effective agents (2024-12-19) https://www.anthropic.com/engineering/building-effective-agents | Workflows are fixed code paths; agents are model-directed. Start simplest; workflows suit well-defined tasks, agents suit unknown next steps and need tool feedback, checkpoints and stopping conditions. | Practitioner guidance, not an RCT. |
| 2 | Cui et al, Microsoft Research field experiments (2025-06) https://www.microsoft.com/en-us/research/publication/the-effects-of-generative-ai-on-high-skilled-work-evidence-from-three-field-experiments-with-software-developers/ | Randomised coding-assistant access for 4,867 developers; pooled 26.08% more completed tasks (SE 10.3%); individual experiments noisy; less-experienced developers gained more. | Code completion, not autonomous agents or Forge defect evidence. |
| 3 | METR RCT (2025-07-10) https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | 16 experienced maintainers, 246 real tasks in familiar mature repos: AI use made them 19% slower, while they believed they were 20% faster. | Specific early-2025 setting, not a universal present finding. |
| 4 | METR update (2026-02-24) https://metr.org/blog/2026-02-24-uplift-update/ | Later speedup estimates are unreliable because of participation, task selection, lower pay and concurrent-time accounting. | No clean reversal and no current effect size can be claimed. |
| 5 | METR usage survey (2026-05-11) https://metr.org/blog/2026-05-11-ai-usage-survey/ | 349 technical workers; median self-reported value 1.4-2x; authors are sceptical of the magnitude and of counterfactual self-reports. | Demand evidence, not causal uplift. |
| 6 | Google DORA 2025 report announcement (2025-09-23) https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report | AI adoption associated with improved throughput alongside instability; AI amplifies an organisation's existing strengths and weaknesses. | Survey associations, not tool causality. |
| 7 | Towards a Science of Scaling Agent Systems (submitted 2025-12-09, revised 2026-04-08) https://arxiv.org/abs/2512.08296 | Agent-architecture effects are task-dependent: from +80.8% on decomposable financial reasoning to -70% on sequential planning. | Benchmark, not productivity; not a direct workflow-vs-agent RCT. |
| 8 | Anthropic multi-agent research system (2025-06-13) https://www.anthropic.com/engineering/multi-agent-research-system | 90.2% improvement on an internal research eval versus single-agent; about 15x the tokens of chat (a different comparator); independent branches can help, but coordinated coding dependencies are costly. | Internal eval. |
| 9 | Anthropic, Demystifying evals for AI agents (2026-01-09) https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | The outcome is the environment's state, separate from the agent transcript; combine deterministic, model and human graders; calibrate model judges. | Guidance. |
| 10 | Anthropic, Effective context engineering (2025-09-29) https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Context is finite; relevance, curation and retrieval beat dumping everything in. | Not proof of Forge performance. |
| 11 | Anthropic, Effective harnesses for long-running agents (2025-11-26) https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Fresh-context confusion and premature completion; remedies are incremental progress, structured durable state and verification. | Production quantification not established. |
| 12 | AI SDK, Tools and tool calling (accessed 2026-10-01) https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling | `tool({inputSchema, execute})`, `jsonSchema`, `generateText`; the current stop-condition spelling is `stopWhen: isStepCount(4)`. | Pin the eventual SDK version; no installed runnable example is claimed. |
| 13 | DORA metrics guide (updated 2026-01-05) https://dora.dev/guides/dora-metrics/ | Change lead time (commit to production), deployment frequency, failed-deployment recovery time, change fail rate, deployment rework rate; scoped to an application or service, not individual ranking. | Delivery metrics, not AI-specific. |

What the evidence jointly supports [inferred]: AI help can raise throughput in some settings (2, 6), can slow experienced people on familiar work (3), is hard to measure honestly (4, 5), amplifies existing process quality (6), and depends on task structure (7, 8). Agent quality depends on outcome-based evaluation (9), curated context (10) and durable state with verification (11). None of these is evidence about Forge itself.

## 3. Workflows versus agents: the rule

**Rule** [inferred from 1, 7, 8, 9]:

1. **Ordinary code or one model call first.** If a plain function or a single call does the job, Forge adds nothing.
2. **Deterministic topology when the steps and effects are known.** Fixed sequence, an LLM call as one step, gates between steps.
3. **One bounded agent when the next action is unknown.** Step cap, tool allow-list, checkpoints, stopping condition.
4. **Limited multi-agent only for truly independent branches**, with one integration owner, and only after an equal-budget outcome comparison shows it wins.

Clarifications:
- A deterministic topology is not deterministic model output. Hybrids are allowed: a fixed workflow can contain a bounded agent step, and an agent can call workflow-shaped tools.
- Gates and acceptance sit outside the model choice. Whether a workflow or an agent produced the change, the Kernel decides accepted state, and a producer PASS is only an observation. [read §3.6]
- No universal productivity or workflow-vs-agent ranking is established. [external 3, 4, 7]

Reasoning: Anthropic's guidance (1) and the task-dependent scaling results (7) both point to "fit topology to task structure"; the multi-agent gain (8) came on independent research branches at about 15x tokens, and the same source flags coordinated coding dependencies as costly. Rejected alternative: "agent by default" (a universal agent abstraction). It rewards over-autonomy and has no outcome evidence for sequential coding work. What would change this: matched outcome comparisons on Forge-class tasks showing an agent default wins at equal budget and equal quality.

## 4. One block, two modes: Memory recall

The same Memory recall block is used as a workflow step and as an agent tool. The YAML below is a **proposed acceptance fixture**, not a currently runnable config (schema `forge.solution/1` is proposed).

```yaml
# PROPOSED acceptance fixture - not a current runnable config
schema: forge.solution/1
solution:
  id: local/context-preview
  version: 1
input:
  type: object
  required: [query]
  properties:
    query: { type: string, minLength: 1, maxLength: 512 }   # bounded query
blocks:
  memory:
    native: forge.memory
    config:
      storage: local
  flow:
    native: forge.flow
    config:
      mode: stateless
graph:
  nodes:
    context:
      operation: memory.recall
      input:
        query: { from: "$input", pointer: "/query" }
  execution:
    instance: flow
output: { from: "context", pointer: "/notes" }
```

Shared recall function (proposed sketch; the shape follows the bound-client contract in §3.1 [read]):

```js
// PROPOSED sketch - host API names are not shipped surfaces
function recall(services, input) {
  const result = services.memory.invoke("recall", input);
  if (result.status !== "OK") {
    throw new Error(`recall refused: ${result.status}`); // typed refusal is never swallowed
  }
  return result.value; // { notes: [...] }
}

// Workflow mode: the flow calls it directly as the "context" node.
const notes = recall(services, { query }).notes;

// Agent mode: the same function as an AI SDK tool (AI SDK API per source 12).
import { generateText, tool, jsonSchema, isStepCount } from "ai";
const recallTool = tool({
  description: "Recall local project notes",
  inputSchema: jsonSchema(catalogSchema("memory.recall").input), // schema from the catalog (proposed)
  execute: async (input) => recall(services, input),
});
const answer = await generateText({
  model, prompt, tools: { recall: recallTool },
  stopWhen: isStepCount(4),
});
```

Semantics that must be identical in both modes [read §3.1, §3.6] [inferred]:
- Host admission, scope and output validation are the same; the SDK owns only the loop and the model budget.
- The step cap cannot pre-empt a hung synchronous call: `trusted-action-sync/v1` has no enforced same-process deadline, and the docs must say so.
- An empty `notes` array means only a successful no-result. "Memory unavailable" is INCOMPLETE and must never be returned as `[]`.

Reasoning: showing one block in both modes proves the "building blocks for workflows and agents" claim with one artifact instead of two products. Rejected alternative: separate workflow and agent block families, which would double the catalog and the conformance surface. What would change this: an agent-mode requirement (for example async streaming) that the sync ABI cannot meet, which would argue for a versioned async ABI, not a second block.

## 5. Five personas and integration journeys

**Shared assumptions** [inferred]: the candidate fixture is installed with `npm install --save-exact ./forge-workflow-0.1.0.tgz`; the registry `0.1.0` is used only once it exists and is verified, and is not installed now. The first-success target is **under 15 minutes, aimed at 14** (3 install + 5 config + 4 run + 2 inspect), counting repairs and abandonment. Prerequisites (Node 24, a project) are timed separately, but the total is shown. These are targets, not measured timings. In every persona, if a direct script, existing SDK middleware or a plain function is already adequate, prefer it. Authors and integrators come first; this is not five product launches.

| Persona | Job to be done | Install / surface / config | First success (target <15 min) | Savings hypothesis | Otherwise they would | What changes the recommendation |
|---|---|---|---|---|---|---|
| 1. Independent block author | Publish a reusable block others can trust | Fixture tarball; proposed `scaffold io.github.example/migration-note-advisor` on `trusted-action-sync/v1`; manifest + schemas + one `.cjs` using bound Memory | Local conformance passes; publication comes later | Less contract, schema and conformance plumbing written from scratch | Ship an ad-hoc npm package or MCP server with its own validation | Authors find the sync ABI too limiting, or conformance takes far over budget |
| 2. AI SDK app developer | Add memory to an existing AI SDK app | Fixture tarball; certified AI SDK Node facade; the same recall tool as §4 | Agent answers with recalled notes; no arbitrary paths reachable | Validated scope and refusals without a custom wrapper | Write a plain tool function with its own storage | Plain SDK tool + library is as safe and faster to adopt |
| 3. Delivery-workflow team | Automate checks into a review-ready packet | Fixture tarball; Flow + check blocks; config wiring checks to a validated review packet | Validated review packet produced with a fake provider first; no auto-push or merge | Repeatable checks and review packets with gates intact | CI scripts plus manual PR prep | Their CI already yields the packet; Forge only adds a layer |
| 4. Platform / guardrail / audit engineer | Enforce grants and keep an audit trail | Fixture tarball; host actor, grant and config policy | Mock effect is denied with zero calls; connected Kernel readback and recovery shown | One authority and receipts instead of bespoke audit logging | Policy-as-code plus custom logs | Existing policy engine already gives equal denial and readback |
| 5. Solo template builder | Compose an existing advisor into a personal solution | Fixture tarball; config of the existing advisor, explicit after source pin; local durable Memory | Stateless run returns advice; no Kernel issues created | Reuse instead of rebuilding retrieval and advice | A personal script | A one-file script is simpler and enough |

Reasoning: the personas map onto the plan's existing surfaces (§3.1 author ABI, §3.5 SDK facade, §4 delivery reference, §3.6 authority, §3.12 composition) [read], so they need no new runtime. Rejected alternative: a broad "everyone" launch with five quickstarts of equal weight, which dilutes the outside-author proof the plan depends on. What would change this: pilot data showing a different persona reaching first success and returning (for example SDK developers far outpacing authors).

## 6. Misconceptions to design against

| Misconception | Primary evidence | Forge response | Check | Rejected alternative | Trigger to revisit |
|---|---|---|---|---|---|
| Over-autonomy, no checkpoints, unbounded loops | [external 1] 2024-12-19; [external 11] 2025-11-26 | Finite DAG (32 nodes / 256 edges), step-capped agent tools, `explain`/`dryRun` pure preview (proposed), gates between steps | Preview executes nothing; step cap and node caps enforced; sync-call ceiling disclosed | Autonomy-duration targets ("runs for hours") | Evidence that bounded runs fail tasks unbounded ones complete at equal quality |
| "More agents equals better" | [external 7] 2025-12-09/2026-04-08; [external 8] 2025-06-13 | Sequential DAG already (no swarms in the current draft); multi-agent only for independent branches with one integration owner | Equal-budget outcome comparison before any multi-agent template | Agent-count targets or a new parallel scheduler | Matched comparisons showing parallel branches win on Forge tasks |
| Skipping evals and verification | [external 9] 2026-01-09 | Outcome = environment state; Kernel acceptance separate from producer PASS; FAIL vs INCOMPLETE | Conformance plus deterministic graders first; model judges calibrated | Trusting the agent transcript as proof | None; this is a required boundary |
| Mistaking demos for productivity | [external 3] 2025-07-10; [external 4] 2026-02-24; [external 5] 2026-05-11 | No percentage-uplift claims; the seven metrics in §7; failures and abandonment counted | Pre-registered, matched opt-in pilot | Headline speedup claims from demos or self-reports | A properly powered matched study |
| Context bloat | [external 10] 2025-09-29 | Bounded query, curated recall, `notes` pointer output instead of whole stores | Input bounds validated; output size checked | Dump-everything context blocks | Evidence that broad context wins on Forge tasks |
| No recovery or audit | [external 11] 2025-11-26; [external 6] 2025-09-23 | Kernel authority, receipts, connected resume with identity/artifact/authority/idempotency checks, no replay of accepted effects | Recovery fixture: fail, then verified safe state, no effect replay | Best-effort logs | None; required |

**Hype features to cut or not add** [inferred] [read common.md, §3.4, §3.13, §9.1]: a new scheduler; a universal agent abstraction; autonomy-duration or agent-count targets; a core UI; duplicate insights (already retired); and a bridge inventory built ahead of demand (stage §3.13 by demand). **Retain**: required security and conformance, outside-author proof, harness proof and recovery. These are what make the productivity claims checkable, not hype.

## 7. Productivity metrics, defined honestly

| Metric | Definition | Honest-measurement notes |
|---|---|---|
| Defects | Follow-up defects within 30 days per accepted task, with severity | Count from accepted tasks only; missing or censored follow-up reported, not treated as zero |
| Rework | Repair minutes, plus the count of correctness repairs | Kept distinct from scope changes |
| Cycle time | Elapsed time from accepted to verified, plus active and waiting time, as p50/p90 | Distinct from DORA change lead time (commit to production) [external 13] 2026-01-05 |
| Review effort | Active review minutes and number of rounds | Not comment counts; no individual rankings [external 13] |
| Integration | From opening the docs to first success, including install repairs; a deliberate refusal counts as success | Dropouts counted; a second consumer measured separately |
| Recovery | From failure to a verified safe state | Must show no replay of accepted effects |
| Total cost | All attempts, per attempted and per accepted task, including failures, branches and human time; actual vs estimated | Dated price; unknown cost is reported as unknown, not zero |

**Measurement protocol** [read §1] [inferred]:
- Local, opt-in, off by default; no accounts; never export prompts, source, payloads, path names or secrets. Random participant IDs; suppression below 5 participants; 90-day retention; reuse the existing usage-evidence module, not a new backend. Local identity hashes are neither uploaded nor used for fingerprinting.
- Compare the SAME model and orchestrator with and without Forge, separately for workflow and agent mode. An optional manual arm does not isolate Forge's contribution.
- Match task classes on difficulty, repo and experience; randomise order; use fresh comparable tasks; pre-register criteria and exclusions. Count everyone enrolled: failed, timed-out, denied, abandoned, and missing or censored follow-up.
- Concurrent human time is measured as non-overlapping intervals, not summed across branches' wall time [external 4] 2026-02-24.
- Report distributions with participant-clustered uncertainty. A pilot is not a power analysis.
- Quality is a non-inferiority check against a risk threshold the owner declares in advance. No invented uplift and no universal percentage threshold.

**Design principles** from the evidence [inferred]: measure outcomes, not activity [external 9, 13]; expect gains to vary by experience and task [external 2, 3]; treat self-reports as demand signals [external 5]; reinforce existing process quality rather than bypassing it [external 6]; keep durable state and verification first-class [external 11].

Rejected alternative: a hosted telemetry backend or a revived insights dashboard. It conflicts with local-first and the retirement decision [read common.md]. What would change this: an owner decision to collect opt-in cloud data under §3.8, with consent and a data contract.

## 8. Reference templates, ranked

1. **Existing context + advisor, stateless** (workflow and SDK on the same fixture, §4). It reuses shipped Memory and Flow pieces and an outside advisor [read §3.12], proves both modes, and needs no Kernel issues. Highest proof per unit of work.
2. **Check-and-review**: checks to a validated review packet with a fake provider first, no auto-push or merge. It targets review effort and rework (persona 3).
3. **Mock-gated effect with recovery**: a denied effect makes zero calls; failure, then verified safe state with no replay (persona 4). It targets the recovery and audit misconceptions.
- Later, and only if fixed routing fails: an adaptive diagnostic agent.

Reasoning: the order follows reuse and risk; each template exercises one metric family. Rejected alternative: leading with the full TDD delivery (§4), which is heavy and opinionated against north-star item 3 [read]. What would change this: demand data showing delivery teams are the first real adopters (owner choice 2, option C).

## Bottom line

1. **Forge supplies reusable, verifiable building blocks for workflows and agents. Keep your orchestrator/harness; connect via validated config/public contracts and inspect outcomes.**
2. Choose topology by task: code or one call, then deterministic topology, then one bounded agent, then limited multi-agent only for independent branches, with one integration owner and equal-budget comparison.
3. Gates and Kernel acceptance stay outside the model choice; a producer PASS is an observation only.
4. No universal AI productivity effect or workflow-agent ranking is established; Forge makes no percentage claims.
5. One Memory recall block runs as a workflow step and an AI SDK tool with the same admission, scope and output semantics; `[]` is a real no-result, unavailable is INCOMPLETE.
6. Five personas, with authors and integrators first; the first-success target is 14 minutes including repairs and abandonment; the timing is untested.
7. Cut the hype: a new scheduler, a universal agent abstraction, autonomy or agent-count targets, a core UI, duplicate insights, and bridges ahead of demand.
8. Seven metrics (defects, rework, cycle, review, integration, recovery, total cost) count failures and dropouts; unknown cost is not zero.
9. Measurement is local, opt-in, suppressed below 5, kept 90 days, and reuses usage-evidence; matched same-model comparisons only.
10. Templates: advisor first, then check-and-review, then mock-gated recovery; three owner choices default A+A+A.

## Recommended plan changes

Target: platform-plan-final.md (concurrent draft; anchors, not lines). All are recommendations.

| Section | Change | Reason |
|---|---|---|
| §1 | Add the positioning sentence; cite north-star item 11; add the seven task metrics alongside the adoption metrics | Productivity is the owner's stated aim; adoption alone does not measure it |
| §3.3 | Docs structure: "For workflows", "For agents" and "Build a block", all over one catalog and admission guide | One surface, two entry points |
| §3.5 | Show the same block in the SDK facade (§4 sketch) and stage certification | Proves the dual-mode claim with one artifact |
| §§3.4 / 3.6 | Disclose the sync-call ceiling (the step cap cannot pre-empt a hung sync call) and the refusal-vs-accepted-state semantics (`[]` vs INCOMPLETE) | Prevents silent-success failures |
| §§3.12 / 4 | Adopt the ranked templates (advisor, check-and-review, mock-gated recovery); keep TDD delivery as a selectable reference | Reuse first; not a mandatory ladder |
| §§5-7 | Add installed-artifact parity, unassisted timing, repair and recovery checks, reusing the existing benchmarks (§7.3, §7.4); no extra large gate | Measure the real artifact without adding a heavy gate |
| §1 pilot / §9 | Matched opt-in pilot; no percentage claim | The evidence does not support uplift claims |
| §§3.13 / 9.1 | Mark bridges and innovations as hypotheses; no hype features | Demand drives the roadmap |
| §10 | Add the three choices below; allocate no IDs, since the plan is edited concurrently | Avoid ID collisions |

## Open questions for the owner

Valid replies: a label, a combo such as "A+A+A", or silence, which means the default. A default is a recommendation, not implementation approval.

1. **Quickstart emphasis.** A: equal visibility for "For workflows" and "For agents" on the same fixture. B: workflow leads. C: agent leads. **Default A**: the same block proves both, and the evidence favours neither universally [external 1, 7].
2. **Template sequence.** A: advisor, then check-and-review, then recovery, sequenced. B: advisor only, if capacity is tight. C: delivery first. **Default A**: it reuses shipped pieces and covers three metric families in order of risk.
3. **Productivity claims.** A: no percentage claim, plus an optional matched opt-in pilot. B: adoption metrics only; defer productivity. C: a statistical uplift release gate, which needs capacity and power. **Default A**: honest and cheap; C is infeasible without a powered study [external 4].

## Confidence

- **High** on the boundaries (authority, gates, local-first measurement, no uplift claim): they come from the owner's constraints [read] and primary sources [external].
- **Medium** on the persona set and the template sequence: reasoned, but untested with real users.
- **Low / UNKNOWN** on the savings hypotheses, the 15-minute (14-minute) target and any universal ranking: no trial was run. This is a research-only handoff, and no other files were written.
