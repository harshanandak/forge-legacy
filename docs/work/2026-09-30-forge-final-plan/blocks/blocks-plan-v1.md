# Forge blocks — synthesis v1

## 1. Bottom line

1. **Decisions needed:** choose internal granularity, the first local extension, and the timing of broader public admission; the defaults below preserve the bounded 0.1.0. [inferred]
2. **Recommend 12 internal responsibility blocks, introduced through existing owners, with selective enforced boundaries and a narrow first public surface.** Do not make extraction of all 12 a release prerequisite. [inferred]
3. **Replace final-plan decision 2's narrow-versus-everything choice with staged medium granularity:** Contracts, Flow, Memory, Kernel service, config and template entries first; promote another entry only with consumers and artifact proof. [inferred]
4. **A block owns a cohesive capability contract; a provider implements it; a template composes instances.** A skill, CLI verb, helper or package-budget bucket does not automatically become a block. [inferred]
5. **Specify a small data-only manifest and deterministic startup composition; prove one trusted local action using existing Flow handlers.** A generic reactive registry, hot replacement and marketplace remain later work. [inferred]
6. **Reuse the clean foundations:** Contracts, Flow and Memory core have source entry/dependency rules; the current config resolver modifies a fixed graph and does not load arbitrary blocks. [read: source ledger, Public boundaries; Config owner]
7. **One npm package and sole Kernel authority remain fixed.** Config cannot substitute an issue/workflow/run owner, mint approvals or remove protected admission. [read: source ledger, Authority; owner brief]
8. **Borrow capability injection, explicit layers and owned disposal from Cordis/Harness; specify Forge's own merge rules.** Composition, content hashes and cleanup do not establish hostile-code isolation or external rollback. [external: primary-source notes below; inferred]
9. **Price the bounded clarification at an additional 3–6 engineering days and 4–8 lead hours, with a one-week slip scenario; these are estimates, not measured capacity.** Retain the v2 access/pilot reforecast. [inferred]
10. **Stage internal → explicitly trusted local → pinned third-party contracts; broaden stable promises toward 1.0 from demonstrated demand.** This report changes no implementation, plan, issue or publication state. [inferred; ran: scope readback]

**Scope and evidence.** Read the synthesis brief, `blocks-common.md`, `common.md`, all of B1–B3, and the local v2 `plan.md`. Prior-work and implementation verification used tracked remote blobs, with bounded independent verification lanes. Refreshed `origin/master` is **`7d448ec812ef8639790477af07c3c75962173f8a`**; worktree HEAD is its predecessor **`ba56b9201782c4d1246c77bde6380867603184bf`**. The final-plan folder is an untracked planning input, not merged product policy. All line references to tracked source below mean the refreshed remote ref; local planning references are labeled separately. [ran]

`[read]` is source inspection, rung 2; `[external]` is checked primary documentation/source, also rung 2; `[ran]` proves only the named execution or readback; `[inferred]` marks recommendations and estimates. Every contract, example, new command and release allocation in sections 3–10 is **proposed**, unless expressly described as current. No installed-package, live-harness, hostile-code, migration or release campaign was executed. Only this report is written; no commits, pushes, GitHub writes or Kernel mutations are authorized.

## 2. What's already settled

The following carries B1 forward, with decision records separated from implementation. Re-reading a historical design does not create a new approval.

| Settled direction | What it means for this synthesis | Checked basis / limit |
| --- | --- | --- |
| **Runtime blocks are the product; templates are scaffolds.** | Provide usable capability APIs independently of the default stage composition. Avoid redoing the template-versus-runtime debate. | [read] `docs/work/2026-04-28-skeleton-pivot/runtime-building-blocks-refinement.md:4–23,24–47`; `template-library-and-merge-flow.md:3–37`. The richer runtime remains a design, not a complete implemented engine. |
| **One package, independently usable capabilities.** | Blocks and supported subpaths live inside `forge-workflow`; no independently released first-party `@forge/*` packages. Third-party authors may publish their own packages. | [read] Owner-settled target in the brief/local `plan.md:44–53,249–252`; remote `test/structural/pr2-root-integration.test.js:14–36` protects the landed three-block fold. August decision records still describe separate packages; the owner direction supersedes them for this target. Root still declares the skills workspace. |
| **Kernel is the sole authority.** | Memory delegates authoritative operations; connected Flow submits evidence; trackers and files are projections. Recall is context, not permission or completion. | [read] `locked-decisions.md:567–599` (D44/D45); `lib/memory-core/src/authority-provider.js:37–59`; `facade-routing.md:47–55`. |
| **No live Beads backend; no importer in the target release.** | Preserve native history/codecs/recovery while following the owner's D46 release direction. Do not describe importer removal as already landed. | [read] D45 retains the historical inbound exception; local `plan.md:249,101` supersedes it for the target. D46 is unmerged release direction, not current implementation. |
| **Default workflows are compositions, not a universal stage ABI.** | Keep existing stage compatibility; independent actions/skills/providers need not create a new stage. Preserve required gates and human checkpoints. | [read] Refinement `:126–183`; `locked-decisions.md:555–563` (D43); `docs/guides/WORKFLOW_TEMPLATES.md:7–40,65–73`. |
| **Config is separate, additive and explainable.** | One resolver owns semantics; CLI and libraries consume its result. Templates and provider implementations do not each merge settings independently. | [read] Local `plan.md:47–53,91,104`; historical `layered-skeleton-config.md:100–110` and capability-pack `:79–85` propose different precedence orders. Exact rules still need a decision. |
| **Forge-native contracts borrow Cordis semantics; Cordis itself is optional.** | Retain injection, owned effects and deterministic reconciliation as design inputs. Do not install a framework to rename existing seams. | [read] Harness archive `research.md:533–570`; original accepted D2/D3 at `:558–570`. September supplied audit `:7–8,174–189` is analysis, not another approval event. |
| **Provider seams precede general plugin machinery.** | A memory enricher or review provider extends an existing owner. It does not necessarily become another top-level block. | [read] Harness archive `research.md:533–548`; current Memory registry and review SPI cited below. General lifecycle/admission mechanics remain proposed. |
| **Dynamic composition is not sandboxing; inverse cleanup is bounded.** | Distinguish registrations/resources from committed external effects. Trust and actual enforcement are separate from metadata. | [read] Harness archive `research.md:181–190,401–412`; supplied audit `:29–45`. Refreshed primary-source notes in section 7 preserve this limitation. |
| **Fixed owner constraints and retained v2 baseline.** | One package, Kernel authority, Node24/26, gates and decided pruning are fixed. Retain v2's four-harness/two-composition/one-local-extension scope as the recommended bounded baseline; broader or narrower alternatives need an explicit plan change. | [read] Owner brief fixes the former; local `plan.md:44–53,101–108,169–183` proposes the latter. This evaluation can refine the v2 defaults without reopening authority/package constraints. |

**What already exists.** Contracts, Flow and Memory core expose indexes and have structural public-entry rules. Memory has a synchronous backend registry; Flow has injected execution and SkillRuntime; review adapters have scaffolding/replay; config has sparse set/remove helpers. Those facilities have different guarantees and must retain their own contracts. The bundled `PluginManager` parses harness metadata; it is not a general activate/drain/replace host. [read: source ledger, Public boundaries; Provider seams; Distribution]

**What is not established as shipped.** The complete manifest on remote master has no `main` or `exports`; today's graph resolver clones static defaults and applies known settings. Owner reads therefore establish neither supported npm block subpaths nor arbitrary config-driven composition. B1's accepted architecture is not a claim those release journeys passed. [read: `package.json:1–191`; `lib/core/runtime-graph.js:972–1004`]

## 3. The block model

### Definition and ownership

**A Forge block is a cohesive capability owner with a supported input/output contract, an explicit dependency boundary and an appropriate lifetime.** It may be a pure library, an authority service, a stateful provider owner, a data composition, or an integration service. These kinds need different machinery: a pure renderer needs a function; a store needs open/close; a template needs validation; a running child needs supervision. [inferred]

Keep four identities distinct: **block definition** (`forge.memory`), **instance** (`project-memory`), **capability/interface** (`forge.memory.recall`, version 1), and **implementation version**. A provider of memory enrichment belongs inside Memory's seam. A template is separately versioned data. A skill supplies a procedure; an action binds a callable implementation; a gate controls admissibility. None gains authority from its name.

Core ownership rules:

- Contracts contain neutral schemas, identity and validation; they do not open stores or execute workflows.
- Kernel owns issue/claim/workflow/run/gate acceptance and durable authoritative state. Its storage driver, SQL handles and internal migrations are private.
- Memory's local authority floor delegates to Kernel; optional enrichment cannot replace or suppress that floor.
- Flow remains usable statelessly through injected packet/receipt providers. Connected assembly binds the same Kernel at the integration edge.
- Config and templates produce one validated desired composition. Resolved metadata/locks describe inputs, not authoritative work progress.
- Policy plugins may produce diagnostics or additional requirements. Only the existing authorized gate/Kernel path can accept protected state or a merge.

[read] These rules extend the existing public boundary tests, `authority-provider.js:37–59`, backend registry `:85–171`, executor `:205–276`, and facade routing `:47–55`; the complete block contract below is [inferred].

### Manifest contract draft

The author manifest is **data only**. Built-ins can use immutable in-package descriptors; local blocks can use JSON beside their code. A directory/module does not need a loader merely to be a reusable block. The table drafts the complete contract vocabulary, including later provider lifecycles; the explicit 0.1.0 admission subset below implements only a pure action. It is not a generic host for every row/kind.

| Field / rule | Proposed contract |
| --- | --- |
| `manifestVersion` | Explicit draft schema version. Unknown major/dialect fails before importing code; do not label this unimplemented schema a frozen `v1` standard. |
| `id` | Namespaced stable definition ID; reserve `forge.*` for first-party owners. Duplicate definitions/instances are errors, not first-file or load-order wins. |
| `version`, `forgeRange` | Implementation semver and explicit host range. Built-ins share the Forge artifact version; local/third-party implementations may version independently. Require a range for admitted extensions, unlike systems where missing peers impose no constraint. |
| `kind`, `entry` | Pure action, provider, data template, or trusted integration; relative entry under the resolved source root. The first local loader admits only the chosen action kind. No import during describe/lint/schema preview. |
| `provides` | Capability IDs, interface versions and supported mode. Capability compatibility is distinct from npm/Forge package compatibility. Do not declare a reserved authority capability from user code. |
| `requires` | Named capability aliases with interface ranges, plus explicit instance bindings in config. Exactly one selected compatible provider per singular binding; no implicit ambiguous winner. Optional dependencies must be explicit and must not include a required authority floor. |
| `configSchema` | Data schema with a bounded supported vocabulary: types, properties, required fields, enum, defaults and unknown-key policy. Validate without loading module code. An unsupported keyword/validator mode is an error; this is not a promise of every JSON Schema feature. |
| `lifecycle` | `none` for pure data/local actions. Built-in stateful owners retain their existing factory/open/close lifetimes. Later admitted provider contracts may use `setup(context, config)` returning ready bindings/disposer or typed failure; no extension-defined setup/dispose in 0.1.0. |
| `effects`, `permissions` | Author declarations for review/admission, never self-issued grants. Separate registrations, owned processes/files, and external mutations. Every external effect uses the owning authorization/receipt protocol. |
| `authority` | Only `none` is admitted for the 0.1.0 local action. Built-in integration/later admitted providers may use `delegated-kernel`; only the built-in Kernel owns authority. Delegated clients are narrowed to admitted operations/scope, never direct database access. |
| `proof` | Conformance entry/fixture metadata, supported host/mode and schema versions. Author assertions are not accepted evidence; the host campaign produces candidate/digest-bound results. |

**The 0.1.0 local-action subset:** accept only `kind: action`, `lifecycle: none`, `authority: none`, empty `effects`/`permissions`, one pure action capability with an explicitly experimental interface, and the allowlisted Contracts receipt dependency. Reject unsupported provider requirements, multiplicity/service scopes, reserved authority contributions, custom validators and advertised setup/dispose hooks. Bind that dependency directly to the existing Contracts entry; do not build a general service/version solver. Host/schema compatibility is a closed supported-version check for this subset. General semver negotiation/provider lifecycles are later contract work.

At host startup, explicitly selected trusted local code is imported and a function is bound to a node handler. This is **host admission**, not an extension lifecycle. Existing project/session trust supplies operator selection; record the current source identity in the resolved snapshot/receipt for provenance. No new persistent digest-grant store, package installer or automatic grant reuse is included. Metadata describes the expected pure contract; it cannot prevent arbitrary imported JavaScript from abusing same-process privileges.

**Proposed manifest for the first local extension**, a receipt renderer that adds a capability rather than another issue store:

```json
{
  "manifestVersion": "forge.block/0.1-draft",
  "id": "local.receipt-export",
  "version": "0.1.0",
  "forgeRange": ">=0.1.0 <0.2.0",
  "kind": "action",
  "entry": "./index.js",
  "provides": {
    "forge.receipt.render": { "interfaceVersion": "0.1.0-experimental", "mode": "pure" }
  },
  "requires": {
    "contracts": { "capability": "forge.contracts.receipt", "range": "^1.0.0" }
  },
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "format": { "type": "string", "enum": ["json", "markdown"], "default": "json" }
    }
  },
  "lifecycle": "none",
  "authority": "none",
  "effects": [],
  "permissions": [],
  "proof": { "entry": "./conformance.js", "modes": ["pure"] }
}
```

The new capability names/interface versions in this example are draft design choices, not existing Forge services or a frozen v1 action interface. The Contracts dependency refers to the existing v1 receipt wire contract; it does not freeze a new global service registry. The illustrative host range targets final stable 0.1.x; preliminary RC trials must explicitly declare their compatible candidate version, without a gate exemption. The real artifact package name is `forge-workflow`; imports use its approved subpaths. A pure renderer validates an existing receipt, returns an allowlisted/redacted representation and preserves its original outcome/identity. It does not accept evidence, mark a run complete or write files during import/invocation.

### Lifecycle, effects and authority

**Startup of the built-in composition root:** parse descriptors/config → validate the known owners/closed local-action bindings → order the existing assemblies and node DAG → initialize selected owners → publish the composition as ready. This is explicit composition over existing factories, not a generic call to every block's `setup`. Missing/ambiguous/incompatible selected requirements fail readiness. Disabled optional instances remain inspectable. Pure Flow use does not initialize Kernel merely because its descriptor is available. [inferred]

**Bootstrap order:** Contracts and data-only config/template validation first; then open the built-in Kernel for connected modes using its existing fixed protected-admission floor; bind Memory and authorized policy/integration clients; assemble Flow/providers; expose facade/harness consumers. Stateless Flow branches directly from Contracts/config. A policy/evaluator implementation cannot be required in order to create the authority that must authorize that implementation. Existing source coupling between Kernel, Memory normalization and workflow helpers must be handled in the owning assembly, not disguised as a new circular `requires` graph.

**Failure/cleanup for existing stateful owners:** the assembly retains each owner's existing lifetime contract, closes partially constructed owned services and reports failures. A synchronous Flow provider remains synchronous; real process supervision belongs in its separate controller, not a Promise passed into `createWorkPacketExecutor`. The pure local action introduces no setup hooks/resources/disposers: failed admission/invocation discards its host handler binding and returns a typed failure. A later generic provider contract would require ownership from partial setup, reverse-dependency disposal, cancellation and bounded cleanup; that machinery is deferred, not part of the local-action delta. [read: executor `:217–248`; inferred scope/lifecycle contract]

**Authorize before effects:** current Flow calls `run` before normalizing and classifying its mutation claims (`executor.js:243–254`). Receipt/result validation cannot prevent or undo effects already performed. The connected integration must authorize the operation before invoking a provider; extensions receive neither raw Kernel handles/event insertion nor authorization-minting APIs. Existing gate events and protected authorization primitives remain private to their owning path. [read: `lib/gate-events.js:14–23,200–220`; `lib/protected-state-authority.js:178–377`; inferred admission rule]

**Reconfiguration in 0.1.0:** validate a desired snapshot before a supported tool replaces persisted config; run active work against its admitted snapshot. Apply changes on the next start, not by swapping bindings under a running operation. A user may edit YAML directly: malformed edits refuse activation while a current running snapshot remains unchanged; Forge does not promise to undo the user's edit. Preserve previous owned config bytes/source identity for supported restart/restore. No generic transactional service replacement is included.

| Effect class | Required reverse/recovery path | Limit |
| --- | --- | --- |
| Registration, listener, timer, owned handle | Remove registration/close handle through the owning disposer; test partial setup and double cleanup. | Only mediated/owned runtime effects are covered. |
| Generated local file/link/config | Existing owner plans the write, records prior bytes/ownership, applies atomically where supported and verifies restore/refusal. | Restore only owned changes; do not clobber intervening user edits or roll back another process's work. |
| Owned child process | Existing controller handles cancel/acknowledgement, bounded kill/reap and terminal receipt. | A reducer or returned disposer alone does not prove actual termination. |
| Kernel mutation | Current lease/revision/epoch/approval checks; durable acceptance receipt and supported compensating operation if appropriate. | Disposing an extension must not erase accepted work history. |
| GitHub/message/deployment/remote data mutation | Explicit operation authorization, idempotency where supported, outcome receipt, and system-specific compensation/recovery. | No universal inverse or exactly-once promise; an external effect may already have committed. |

**Trust boundary:** the API prohibits shadow authority and bypasses; arbitrary trusted JavaScript still has host privileges and may ignore it. An in-process manifest is not enforcement against malicious code. Untrusted executable admission requires a separately proven execution boundary and per-operation mediation. Do not claim that this draft, a Node worker, a service namespace or a digest provides that boundary. [external: Harness safety; Cordis service/effect sources; inferred]

### Test and proof obligations

Extend existing checks, not a new parallel certification framework. Each supported capability has one meaningful consumer/conformance lane; required authority/security/recovery cases remain independent and cannot be removed to simplify coverage.

1. Validate manifest/config versions, required fields, unknown keys, duplicate IDs, bindings/ranges, cycles and missing capabilities before activation.
2. Prove stateless Flow has no Kernel/store initialization; Memory survives restart without activating Flow; connected operations use the same Kernel and reject stale/unauthorized evidence.
3. Prove the local action works through CLI and injected library composition, without private imports or Forge source edits; invalid/disabled/replaced bindings are explained.
4. Exercise admission/import/invocation failure, repeated startup and preserved user content for the local action. Existing stateful owners retain their required partial-setup/cleanup/cancel proof; generic extension setup/disposal tests wait for that future contract. Pure renderers need no invented daemon lifecycle test.
5. Preserve the existing locked-rail, protected-write, exact-head/lease/approval and merge refusal paths. Extension-produced diagnostics cannot become authoritative PASS by themselves.
6. Verify dependency closure and physical schema/template/skill bytes in the actual tarball and compiled artifact. Public examples must run in a clean consumer directory.
7. Bind required results to the candidate, config/composition, interface/provider versions and corpus. Keep the final plan's G0–G8, applicable strata, pair floor and exercised observation; these proposals supply cases, not replacement release gates.

[read] Reusable checks: `test/structural/product-package-boundaries.test.js:13–23,132–183`, `pr2-root-integration.test.js:14–69`, command-manifest/skills drift owners, and local `plan.md:130–159`. The proposed obligation list is [inferred], not passing test evidence.

## 4. Granularity options

**Count responsibilities, not folders or budget buckets.** Reran B2's read-only AST appendix against the pinned remote source: **286 JavaScript modules, 626 internal literal require sites, 607 distinct edges, six file-cycle groups, 22 physical areas and 33 refined analyst areas**. Those area counts are measurements, not a recommendation for 22 or 33 public blocks. Computed imports/assets/host effects remain outside the literal graph. [ran: B2 appendix replay; source inspection]

### Coarse: five blocks

1. **Contracts** — wire schemas/identity/validation.
2. **Memory/Kernel** — knowledge APIs with a separately owned sole Kernel inside the coarse grouping.
3. **Flow** — execution, skills and lifecycle primitives.
4. **Composition** — config plus templates.
5. **Integrations** — policy, harness/hooks, skills delivery, review/PR delivery and setup/recovery.

This enables independent Memory/Flow, a few provider substitutions and bounded templates quickly. It fits one package and separate config. Its weak point is Integrations: a large catch-all hides installation, policy and remote-write lifetimes; consumers can end up coupled to a broad service. Keep Kernel ownership explicit even if grouped under Memory. [inferred]

### Medium: 12 responsibility blocks — recommended target

| Block | Owns / capabilities opened | Boundary and initial treatment |
| --- | --- | --- |
| **Contracts** | Validate/interchange packets, receipts, evidence and semantic identities. | Existing clean entry. Supported public subpath at 0.1.0. |
| **Kernel** | Authoritative issues, leases, workflow/run/gate acceptance and local store lifecycle. | Narrow public service/client; driver/SQL/internal migrations private. Fixed provider. |
| **Memory** | Local durable knowledge/provenance, recall/context and optional enrichment. | Existing clean core plus default assembly; Kernel authority delegation; preserve local floor. |
| **Flow** | Stateless/connected execution, bounded loops, skill DAG, supervised process and monitor primitives. | Existing clean entry; connected integration supplies authority rather than adding a dependency to Flow core. |
| **Config/composition** | Effective settings, explicit bindings, dependency validation and origins. | One resolver; supported pure/injected API. No executable expressions. |
| **Templates** | Versioned starter compositions and validated optional node additions/replacements. | Data entry; two starters and one pure local action, with an explicit startup-only optional-node replacement form. Adoption levels remain separate. |
| **Policy/evaluators** | Pure predicates/diagnostics and owner-controlled gate requirements. | Internal owner boundary first; authoritative admission stays in Kernel/protected owners. |
| **Harness delivery/hooks** | Version/capability detection, projection/render/install plans and host enforcement backstops. | Internal installation/delivery boundary; four-host live proof. Metadata is not execution support. |
| **Skills distribution** | Canonical discovery, provenance/collisions, owned links and drift checks. | Reuse existing sync/asset owner; procedures remain data, not one executable block per skill. |
| **Review providers** | Normalize review packets and provider reads; separately authorized replies/resolutions. | Existing SPI internally; broader public promotion after production selection and conformance. |
| **Delivery/monitor** | PR/check reads, durable monitoring/delivery and owned train integration. | Internal consumer of Kernel/Flow/Memory; preserve guarded remote writes and singleton ownership. |
| **Facade/setup/recovery integration** | Route commands, plan/apply installation, diagnostics and native upgrade/restore orchestration. | Integration-only boundary over owners. Not one new public mega-service or another authority. Build/CI generators remain private behind their protected owner. |

These are **12 target ownership boundaries**, not a claim that master contains 12 isolated or interchangeable modules. Three existing entries already have import enforcement; the first release makes the promised public seams and the selected local extension real. Untouched integration code can remain physically where it is. If an entry still exposes cross-owner command logic, label it internal/partial rather than advertise a finished block. [read: source ledger; inferred scope]

This granularity enables different compositions and useful provider substitution while making installation, policy and external effects visible to maintainers. It supports the owner's one-package/template/config model without a package train. Internal composition can be an explicit factory table plus injected APIs; the selected local action uses a bounded manifest reader and existing handler registration. A generic service container is not necessary. [inferred]

### Fine: micro-blocks plus a capability registry

Example inventory: envelope validation; canonical hashes/identity; schema compatibility; issue client; lease handling; workflow transitions; run/evidence acceptance; approvals; store lifecycle; native backup/export; recall; context selection; enrichment registry; packet executor; bounded loop; skill DAG; process supervision; monitor durability; config parsing; layer merge; template catalog; template migration; policy predicates; hook rendering; harness installation; skills distribution; review normalization; review effects; PR reads; PR monitor; merge delivery; setup planning. Add a general capability registry/resolver with service scopes and dependency-driven activation. [inferred]

This opens Cordis-like substitution at many levels: independent execution/storage/context providers, subtree bindings and potentially reactive provider withdrawal/recovery. It also exposes interface/range/cardinality/order/lifetime questions at every seam. Kernel-owned operations remain non-substitutable authority even in this model. A registry cannot resolve arbitrary authoritative compatibility from strings. [inferred]

### Comparative cost and fit

All numbers below are **planning estimates**, not B2 measurements. They describe incremental architecture work relative to the v2 bounded program; publicizing/extracting every owner is explicitly separate.

| Option | Effort now | Maintenance cost | Main risk | Fit with one package + templates + separate config |
| --- | --- | --- | --- | --- |
| **Coarse five** | Baseline v2 assembly/resolver work; 0–2 additional engineering days for a clearer ownership map. | Lowest immediate API count; expensive catch-all integration changes later. | Provider changes touch hidden policy/setup callers; coarse Memory naming can blur sole authority. | Good topology fit, weaker customization/ownership clarity. |
| **Medium staged 12** | Baseline v2 work plus provisional **3–6 engineering days, 4–8 lead hours**, under section 9's pure-action/no-generic-host assumptions. External-code loading/binary proof are named missing work, not existing features. Full extraction/publication of all 12 is excluded. | Moderate internal review cost; stable support limited to six entry categories and selected provider contracts. | Names/descriptors could conceal unchanged coupling; prevent this with promised consumer and boundary proof. | Best fit: cohesive owners, small template compositions and one explainable resolver. |
| **Medium fully extracted/public now** | At least L/XL extra work; **3–6 additional weeks** is only a rough scenario. Kernel/policy/setup/PR/harness extraction cannot be priced as an index-file change. | High compatibility/conformance burden across all owners. | Release serialized by cross-owner cycles and host/effect guarantees. | Topology fits, first-release cost does not. |
| **Fine registry** | XL; **6–12 additional weeks** is a scenario for a new resolver/lifecycle framework before full certification, not a commitment. | Highest: capability interfaces, implementations, scopes, activation and migration all become support surfaces. | Bootstrap cycles, ambiguous binding, silent inactivity, unsafe replacements and implied sandboxing. | Possible in one package, but excessive for two templates/one local extension. |

**Recommendation:** choose staged medium ownership now, deliver the six public entry categories and the one demanded action seam, then extract/promote additional blocks when a second materially different consumer demonstrates the need. Fine granularity is justified only if actual provider/lifecycle requirements outgrow this arrangement. Do not count all 12 as completed architecture merely because their descriptors exist. [inferred]

## 5. Config composition

### What to borrow and what to retain

DeepSeek Harness separates a **profile** selecting an application from **bundles** distributing ordered config rows and their code. In the inspected snapshot, bundles are layered before profile/home/CLI patches, and matching patch IDs replace an entry's entire config. This is useful architectural composition, but it is not Forge's specified additive map merge. [external: [Harness layer contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#known-limitations-and-deferred-work)]

Forge currently clones `RESOLVED_RUNTIME_GRAPH` and applies known rails/workflow/adapters/roles/planning settings. It rejects unknown phases; sparse config writes preserve sibling fields. These mechanisms should become the owning resolver's foundations, with validated template/local-action input added there. A layered selector is not a second runtime graph or a replacement for existing gate admission. [read: `runtime-graph.js:645–752,922–1004`; `config-writer.js:72–126`]

The existing `RUNTIME_GRAPH_SCHEMA` describes the emitted graph artifact, **not** the project-config input. The new resolver needs a real input schema and unknown-key checks; adding `blocks` to the output vocabulary alone would leave it ignored by today's manual input application. Keep the proposed block manifest separate from the existing evidence `CapabilityManifest`, which records observed provider/probe results rather than activation metadata. [read: `runtime-graph.js:10–39,972–996`; `lib/contracts/src/definitions.js:37–41`; inferred]

### Bounded precedence and merge algebra

**0.1.0 proposed precedence, low → high:** shipped defaults → selected versioned starter composition → sparse project `.forge/config.yaml` → explicitly supplied invocation overrides. The library accepts these inputs/effective output directly; CLI filesystem/environment discovery happens at the edge. The immutable authority/protected-admission floor is validated over the result, **not another layer that a later value can win over**. [inferred]

Adoption `minimal/standard/full` seeds adoption settings; it does not become another workflow template with hidden precedence. No auto-loaded home/team hierarchy is added now. For supported existing environment selectors, translate them once into the invocation layer, retain documented explicit-argument > environment > project precedence, and report origins. An already resolved library config must not be re-read/re-merged from process environment. Legacy settings outside migrated paths retain their documented reader until deliberately migrated. [read: `memory/router.js:89–114`; `adoption-profiles.js:56–98`; inferred migration contract]

| Value / operation | Proposed deterministic rule |
| --- | --- |
| Scalars | Higher supplied value wins only if its type/schema and policy permit it. Missing means inherit; `null` is invalid unless explicitly allowed. |
| Ordinary maps | Merge by key recursively; preserve unspecified lower keys. No whole-row config replacement by default. |
| Block/instance/node maps | Merge by stable ID. A new instance has its own ID and source. Duplicate ID within one layer is an error; an overlay targeting an existing ID is a declared override. Source/provider changes are explicit operations with revalidation. |
| Lists | Replace explicitly for documented preference/order lists. Additional elements use an explicit append operation, deduplicated by stable ID and checked for conflicting definitions. No implicit concatenate-or-replace guess. |
| Required gates/evidence/stop dependencies | Preserve the mandatory set and permit additional requirements; list replacement cannot remove mandatory items or weaken edges/approval applicability. |
| Disable | `enabled: false` only for optional instances/nodes; keep them in the explanation. Refuse if required consumers or a protected obligation depend on them. |
| Provider/node replacement | Explicit target + replacement source/binding. Check interface/mode/schema compatibility and preserve required predecessor/successor/gate contracts. No alias silently changes what a running node means. |
| Reset | Remove the project override through the existing sparse remove helper; effective config inherits the current lower layer. Reset never means an empty map shadows all defaults. |
| Order | Use explicit action dependencies; deterministic ID ordering breaks independent-node ties. Layers do not smuggle execution order through file discovery. |
| Invalid/unknown | Typed errors with config path, instance/node ID and source layer. No malformed project file treated as absence; no ignored `blocks` section. Disabled known declarations are checked structurally but need not import their code. |
| Origins | Per winning field/binding record value source, lower overridden source and operation; expose selected template/version, resolved interfaces and errors without secrets. |

**Later overlay hierarchy, if demanded:** defaults → starter → organization/team policy → project → user preferences → invocation. User/invocation layers may change only preference-scoped fields; organizational policy and protected floor are constraints, not overwritable scalar values. Require an approved migration from the historical conflicting orders before enabling this hierarchy. Cloud profile sync, executable YAML and automatic network bundles are not required. [inferred; historical conflict: B1, Config chronology]

### What the user edits

The following is **proposed YAML**, not supported by the current resolver. A manifest implements a capability; project config selects it; the template references a named action. No generated instructions or copied Forge internals are edited.

```yaml
composition:
  template: forge.small-change
  templateVersion: 0.1.0

blocks:
  receipt-summary:
    source: local:./.forge/blocks/receipt-export/block.json
    enabled: true
    bindings:
      contracts: forge.contracts
    config:
      format: markdown

workflow:
  nodes:
    receipt-summary:
      action: receipt-summary/forge.receipt.render
      after: [evidence-accepted]
      receiptFrom: evidence-accepted
      optional: true
```

Proposed starter IDs are `forge.tdd-delivery` and `forge.small-change`, both version `0.1.0`; their stage compatibility and required admission follow the corresponding existing delivery/small-change behavior. `evidence-accepted` is an illustrative ID the new starters must declare, not a master graph ID. In a connected template the action receives the immutable Kernel-admitted receipt/artifact as explicit input; it does not declare acceptance itself. A direct stateless renderer call accepts only a validated receipt and cannot label it Kernel-accepted. Adding a new action must preserve existing phase/stage semantics rather than inventing an arbitrary stage interpreter. [inferred]

**Module ABI and lowering:** the selected CommonJS entry exports one synchronous `renderReceipt(receipt, { format, validateContract })` function, returning `{ content, mediaType }` or throwing a validation/render error. It exports no setup/dispose hooks. The host binds immutable config and the existing Contracts validator in a closure; user code does not receive a context container or Kernel client. Lower `after` to SkillRuntime `dependsOn`; resolve `action` to the selected function and store its wrapper in `handlers[configuredNodeId]`. Set `inputKeys/contextKeys` to empty for this action; it uses only the declared receipt dependency.

The built-in `evidence-accepted` readback handler returns `{ status: "PASS", evidence: [{ kind: "run-receipt", receipt }] }`, using a bounded receipt obtained through the current Kernel client. `receiptFrom` must name one declared predecessor; the wrapper selects its `{ nodeId, status, evidence }` entry from `dependencyEvidence`, then exactly one receipt record inside `entry.evidence`, validates it and invokes the pure function. Missing/duplicate/invalid input returns `{ status: "INCOMPLETE", evidence: [{ kind: "local-action-error", code: "INVALID_RECEIPT_INPUT" }] }`; no arbitrary-context fallback. Successful rendering returns `{ status: "PASS", evidence: [{ content, mediaType }] }`. Encode other known sanitized refusal codes inside evidence too: the existing runtime does not propagate a handler's top-level `error` field. Unexpected uncaught errors retain its generic `HANDLER_FAILED` result. This PASS means presentation succeeded, never that the input run gained acceptance. Direct stateless invocation passes a validated receipt without the connected readback label. [read: `lib/flow/src/skill-runtime.js:145–206,229–267,320–361`; inferred adapter contract]

**Startup-only replacement example**, using the same renderer ABI:

```yaml
workflow:
  replace:
    receipt-summary:
      action: alternate-summary/forge.receipt.render
```

The effective composition must already define `receipt-summary` as optional, for example through the addition above; the starter supplies its admitted receipt input slot. Select `alternate-summary` under `blocks` with the same manifest/options form before referencing it. Before lowering, verify the target exists/is optional, the replacement instance has the same admitted pure-action interface, and its config is valid. Preserve target node ID, predecessors/successors, `receiptFrom`, input contract and all gate/stop/evidence obligations; replace only the handler binding. Reject attempts to replace authority, gate, acceptance or required delivery nodes. Refusal leaves the running snapshot unchanged and a supported config writer does not commit invalid proposed bytes. User-edited invalid YAML still refuses next activation. Neither this form nor the addition example changes the accepted receipt.

In 0.1.0, config selects known built-in providers and the admitted pure-action instances. An embedding host can register/inject a Memory enricher programmatically through the existing seam; arbitrary provider packages cannot be loaded from YAML. Later, a supported provider swap changes one explicit binding and validates its source/options. It cannot bind away Memory's Kernel-backed local floor. Review config selection likewise waits for an admitted production path; fixture replay accepting a module is insufficient.

Operator trust is separate from the author manifest. Describing/linting reads data and resolves the bounded declaration; importing local code requires explicit selection under the existing project/session trust path. Record the currently selected source identity/digest as provenance, without introducing a persistent trust-grant service. Later published/effectful admission requires stronger digest-bound authorization and recovery policy. Declarations such as `permissions: []` are not proof that imported JavaScript has no effects.

**One effective output:** normalized config + selected instances + capability bindings + executable node DAG + enforced obligations + field origins + config/source/interface digests. CLI and library consume this same representation. Preserve the existing fixed graph as the default template's input/compatibility projection and use existing SkillRuntime handlers for the added action. Record accepted connected-run context through Kernel; stateless resolution returns data only. [inferred]

## 6. Adding a new block

The path is different for **a provider of an existing capability** and **a new capability**. A compatible memory enricher should need a provider implementation/schema/conformance record and one binding, not another core owner or edits to every caller. A new receipt renderer needs a new interface/action declaration plus its implementation; config cannot invent that interface. [read: Memory registry/Flow injection; inferred]

**Recommended worked path: a local receipt-export action.** It gives a user a new callable capability, selected by config and scheduled by either starter, using the narrow supported entries. It creates no remote effect and is enough to prove extension without first solving arbitrary service hot loading.

1. **Classify the request.** Check existing render/normalization/export helpers and every candidate caller. Reuse an existing supported owner if the need is only another provider or view; do not add a block for one helper name. Record success/constraints in the implementation plan/issue only when that later work is authorized.
2. **Define the new contract.** Validated existing receipt → deterministic allowlisted/redacted content and media type, or typed refusal. Preserve original receipt schema/identity/outcome; no ambient credentials, authority store or synthesized PASS. Declare capability/interface/host ranges and supported config.
3. **Implement the smallest local module.** Manifest, one function entry and one conformance check under the user-owned project block directory. The host wrapper passes explicit validator/options and a validated receipt; there is no setup hook, context container or long-lived resource. No new dependency/framework/factory class is required.
4. **Describe before executing.** Resolve confined manifest/schema/entry paths and source digest; validate ID/kind/ranges/options and operator-selected trust without importing code. A lint/schema preview must not execute an entry or install script.
5. **Add selection and one node.** Add the instance/binding and optional named action in `.forge/config.yaml`; reuse one starter's receipt input/dependency. Do not modify the installed Forge package or create a new workflow stage. A pure action result is an artifact/diagnostic, not accepted work authority.
6. **Validate the composition.** Confirm required dependencies, contract ranges, mode, unknown IDs and no cycles/conflicting providers. Reject a reserved authority provider, protected-edge replacement or removed required stop/gate. Return actionable readiness diagnostics.
7. **Bind through the existing handler seam.** The bounded action loader supplies `handlers[nodeId]`, lowered dependencies and the receipt-evidence wrapper to SkillRuntime. Preserve callable result/error semantics and one snapshot; no provider lifecycle is added. Config alone is not completion until the real execution path uses it.
8. **Leave one focused runnable check.** Cover a valid receipt, malformed/private input, deterministic rendering and unchanged authoritative outcome. Extend the existing composition/security lane for duplicate/missing dependency, protected refusal and cleanup where relevant; do not mirror every implementation line with a new suite.
9. **Prove the installed consumer.** Run both starters and CLI/library equivalence from the actual tarball; use no checkout/private imports. Binary selection must load permitted external user files while all required built-in schemas/contract assets ship. Preserve risk-owner/manifest/budget/drift obligations for any first-party additions. Inventory historical documented/downstream deep imports before introducing a restrictive exports map; preserve the approved compatibility window or explicitly version the break.
10. **Publish only when it earns support.** A local action can remain user-owned. A broadly useful first-party capability gets an explicit selected `forge-workflow/<subpath>`, structural dependency rules and artifact/conformance proof; a third-party package follows section 7. Neither promotion is automatic.

**Tooling:** reuse the existing `forge new` scaffold dispatcher, `forge options lint --json`, `forge options diff --json`, `forge options why <id> --json`, config writer, Contracts validation patterns and existing conformance/risk lanes. Today `forge new` supports a review-adapter scaffold; `options` describes the fixed graph. Extend those owners narrowly: proposed `forge new block <name> --kind=action`, data-only manifest/composition lint, and origin/binding explanations. These new scaffold/block operations do **not** exist today and this report runs none of their writing forms. If only one sample needs scaffolding, ship the three-file sample before a broader generator catalog. [ran: local `new --help` and `options --help`; read: remote `lib/commands/new.js:3–10`, `lib/adapter-cli.js:56–104`, `lib/commands/options.js`; inferred tooling]

| Addition | Estimated marginal cost after the supported seam exists | What makes it larger |
| --- | --- | --- |
| Pure local action / compatible synchronous provider | **1–2 engineering days** including schema/binding and one runnable consumer check. | A new interface, private-import dependency or mandatory side effect. |
| New first-party public capability | **3–7 engineering days** for a small clean capability, including exports/boundaries/risk/docs/artifact consumer. | Kernel/policy/harness/setup extraction, async service lifecycle or cross-platform recovery: L/XL instead. |
| Remote/async or effectful provider | **1–3 weeks or more**, separately scoped. | Enforced permissions, supervision/cancel, privacy, compensation, retries, host and upgrade certification. |

All costs are [inferred] planning ranges. They are not measured scaffolding speed, nor an allowance to omit authority/artifact checks. The baseline loader/resolver work is already charged in the release program; do not charge it again for every local block.

## 7. Public extensions

### Staging and compatibility

| Recommended release stage (all proposed) | Exposure / discovery | Trust and compatibility bar | Explicit limit |
| --- | --- | --- | --- |
| **0.1.0 internal** | One Forge artifact; built-in descriptors/factories, known providers and two starter templates. Six narrow supported entry categories. | Source boundaries, selected installed consumers, current gate/authority admission. Internal helpers can change without being public API. | No promise that all 12 owners are independently extracted or stable exports. |
| **0.1.0 local** | One explicit project-local pure-action manifest/path; injected provider interfaces remain usable by embedding code. No automatic scanning/download. | Existing project/session trust, source provenance, data-only lint, closed dependency/interface checks and installed import/invocation/refusal evidence. Same-process privilege is disclosed. | Experimental manifest/action schema; startup changes only; no extension setup/dispose, persistent grant store, hostile-code containment, effect plugin or generic installer. |
| **0.2 experimental third-party** | Operator installs a package through their ordinary package manager and explicitly selects its manifest/entry. Maintainer documentation may list examples; no automatic updates/catalog service. | Separate package/lock integrity, Forge/capability ranges, provider conformance, digest-bound selection, migration notes and support owner. Reject unknown/incompatible ranges; no gate exemptions. | Pre-1.0 experimental APIs may change with explicit version/migration notes. Effectful/untrusted providers require their separately proven host boundary. This is conditional roadmap scope, not a committed 0.2 date. |
| **1.0 selected stable contracts** | Supported extension exports with independent consumers/implementations. Optional curated discovery only if it has an owner and demand. | Published caller **and implementer** compatibility window, deprecation process, config/manifest migrations, conformance across the promised hosts/versions and failure/recovery contract. | Stability applies to specified contracts, not all `lib` files or every third-party behavior. |

Separate **author manifest**, **host resolution record**, **operator authorization/trust selection**, and **observed runtime/receipt state**. Reuse existing lock/candidate/Kernel records where they cover the requirement; do not add four competing issue stores. Author-provided integrity/proof labels are not accepted host evidence. [inferred; read: `docs/work/2026-08-24-agent-harness-architecture/2026-09-12-user-supplied-architecture-audit.md:174–185`]

At third-party admission, lock the exact package source/version/content, selected entry/schema and capability bindings. Record capabilities separately from package identity. A host range establishes declared compatibility; behavior is established by caller/provider conformance. Extending an interface with a required method can break an implementation even if existing callers still work. [external: [OSGi versioning roles](https://docs.osgi.org/whitepaper/semantic-versioning/040-semantic-versions.html); inferred Forge policy]

Keep the 0.1.z documented public entry/wire behavior compatible. Deliberate experimental manifest changes require an explicit minor/schema transition and migration/refusal guidance; do not secretly reinterpret existing config. At 1.0, freeze only the contracts whose compatibility/recovery window is proved. Discovery/reputation/signatures/digests answer different questions and do not grant execution permission.

### Primary-source corrections carried from B3

| Checked source | Lesson retained / claim not adopted |
| --- | --- |
| **Cordis** at the inspected upstream commit (`f8ea3cd50f1a5724e8e715995bcde131c9c12b2c`): [registry](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/registry.ts), [effects/fiber](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/fiber.ts), [HMR](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/hmr/src/index.ts#L413-L430) | Named service requirements and owned cleanup are useful. The inspected HMR leaves failed replacements failed; it does not guarantee last-good rollback. A requirement name is not a semver/interface proof. [external; inferred adaptation] |
| **DeepSeek Harness**, historical (`b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`) versus inspected newer source (`639ed015397290b3745d163aafe02ffee4aa3f84`): [historical architecture](https://github.com/deepseek-ai/deepseek-harness/blob/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e/docs/architecture.md), [profile/reload contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#L78-L98), [HMR restoration](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/hmr/src/index.ts#L441-L535) | Separate profile/bundle selection from code. Code HMR attempts previous-code restoration; config reload is not an atomic whole-tree transaction. These differ from Cordis upstream and from universal external rollback. [external] |
| **Harness safety and admission**: [safety notice](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/SAFETY.md), [peer checks](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/src/plugin-compatibility.ts), [schema-preview warning](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#L64-L76) | Compatible peers are admission evidence, not malicious-code containment; Harness schema collection imports trusted modules. [external] Forge should keep data-only manifest/config admission separate from activation and must not inherit exemptions for protected gates. [inferred] |
| **Backstage**: [modules](https://backstage.io/docs/backend-system/architecture/modules/), [extension points](https://backstage.io/docs/backend-system/architecture/extension-points/), [threat model](https://backstage.io/docs/overview/threat-model/) | A capability owner can expose a narrow startup extension point; a provider/module need not become another owner. Builders/plugins are trusted, not sandboxed. [external] |
| **VS Code**: [proposed APIs](https://code.visualstudio.com/api/advanced-topics/using-proposed-api), [contribution points](https://code.visualstudio.com/api/references/contribution-points), [activation events](https://code.visualstudio.com/api/references/activation-events) | Incubate before freezing broad promises; keep description separate from executable activation. [external; inferred] |

B3's Vite/Nx comparisons reinforce behavioral compatibility and supply-chain maintenance costs, but this recommendation does not depend on their latest hook names or adoption statistics. No upstream runtime/performance/security benchmark was run. The cited commits are source snapshots, not proof of the newest installed npm versions.

### What not to promise in 0.1.0

No general third-party installer, registry/marketplace, dependency SAT solver, required Cordis runtime, live HMR/reactive service tree, complete rollback/exactly-once external effects, hostile-plugin sandbox, ambient-code-free installation, stable export of every helper, cloud/team policy service, automatic API promotion, or any block-supplied alternate authority. No promise that dropping an arbitrary npm name into YAML works. The pure local-action loader and existing application-level provider injection are separate supported seams to prove. [inferred]

## 8. Capabilities unlocked

These are **proposed delivery allocations**, not completed source capabilities or committed future release dates. Existing primitives remain the reuse basis; later public promotion requires consumer/compatibility proof. [inferred]

| Block → capability | Who benefits | 0.1.0 | 0.2 / later | 1.0 |
| --- | --- | --- | --- | --- |
| Contracts → interchange/validation/identity | External planners, hosts and extension authors | Supported packet/receipt schemas and imports; invalid/stale evidence refusal. | New demanded schema/interface versions with migration rules. | Proved wire/caller/provider compatibility window. |
| Kernel → durable work authority | Owners, CLI clients, connected executors | Narrow open/close/client API, claims/leases and authoritative receipt acceptance. | Additional clients/projections under the same authority. | Mature API/storage migration contract; no alternate block authority. |
| Memory → recall/provenance/enrichment | Independent consumers and agents resuming work | Default local durable assembly without Flow; injectable synchronous enrichment, local floor preserved. | Demand-led async/network provider contract and supervision/privacy proof. | Stable selected provider/retention/upgrade guarantees. |
| Flow → execution and supervision | Embedders, orchestrators, stateless users | Stateless/connected journeys, bounded inline provider; real process-backed controller where promised. | Additional demanded executor/observer implementations. | Cross-provider behavioral conformance and lifecycle policy. |
| Config → selection/binding/origins | Users and library hosts | One effective config, strict known composition validation and explicit local action selection. | Scoped team/user overlays or richer bindings if justified. | Config schema/migration and precedence stability. |
| Templates → editable compositions | Teams adopting only useful procedures | Two starters, one optional action addition/replacement without a fork. | Further templates/inheritance only from actual demand. | Stable selected template extension/update contract. |
| Policy/evaluators → additional checks | Maintainers and regulated workflows | Internal predicates plus immutable authoritative floor; custom diagnostic cannot approve itself. | Selected public diagnostic/evidence-provider seam after admission proof. | Documented evaluator/admission distinction and conformance. |
| Harness/hooks → delivery/enforcement | Claude/Codex/Cursor/Hermes users | Four supported installed-version routes and owned projections/links; refusal where required. | Additional hosts through the same certified contract. | Stable host support/version/lifetime windows. |
| Skills distribution → portable procedures | Users maintaining their own skills | Canonical physical bytes, discovery/owned links, collisions and preservation checks. | Additional source/provenance controls without another editable authority. | Supported distribution/update compatibility. |
| Review providers → normalized feedback | Owners using different review services | Existing SPI retained; selected built-in production behavior and local fixture tooling. | Demand-led config-selected providers, separately authorized reply/resolve. | Stable provider conformance/effect contract. |
| Delivery/monitor → durable review/train handoff | Landing owner and supervising clients | Truthful exact-head checks, durable monitor/resume and guarded merge; internal integration. | Public read/monitor service when another real client needs it. | Supported durable delivery and recovery semantics. |
| Facade/setup/recovery → first use and repair | Installers, consumers upgrading native state | Supported routes/Doctor/install/upgrade/refusal/restore over owning services. | More routes moved below handlers; narrow install-plan API only if demanded. | Complete promised routing, repeated upgrade and recovery evidence. |

The first receipt-export action adds **a user-owned receipt presentation capability** in 0.1.0, not a thirteenth mandatory core block. Promotion to a first-party reporting owner is optional later. Shared build/CI generation remains private; a package-size budget is accounting, not another user capability.

## 9. Impact on the final plan

**This section is a proposed patch specification for the local v2 `plan.md`; the file itself is not edited.** The recommendation refines its staged path rather than replacing acceptance, authority, recovery or candidate policy. Line references below refer to the local v2 input read during this synthesis. [read/inferred]

### Exact textual/scope changes

| Location in local v2 | Add / replace / remove |
| --- | --- |
| **Bottom line, item 4** (`:8`) | Replace with: “Keep the bounded local product: sole Kernel authority, durable Memory, independent Flow, 12 target internal responsibility owners with a narrow six-category public surface, two real compositions, one trusted local action, additive config and four supported harnesses.” Add that not all 12 are extracted/public at release. |
| **Target: Open blocks** (`:45`) | Replace 0.1.0 cell with: “Supported `forge-workflow` Contracts/Flow/Memory/Kernel-service/config/templates entries; internal 12-owner map and selective enforced boundaries; useful assemblies and one manifest-described local action. No blanket export or extraction of every owner.” Keep the 1.0 consumer-justified stability requirement. |
| **Target: Templates/Additive config** (`:47–48`) | Name the two starters and local pure action proof; make template/instance/capability identities explicit. Add startup-only activation, deterministic maps/lists/bindings, data-only preview, strict readiness and origins. Preserve all required gates/approvals/stops. |
| **Options** (`:69–79`) | Retain thin/full/staged paths. State staged medium ownership plus selective public contracts as the recommended staged architecture. Full 12-block extraction and fine registry become separately priced full-vision scope, not hidden work in staged. |
| **Acceptance and interface lock** (`:91`) | Add draft manifest vocabulary and the bounded pure-action ABI/admission subset, authority floor, closed compatibility checks and source provenance. No extension setup/dispose, grant store, general registry, hot-swap or universal permission claim. One config owner remains. |
| **Public local assemblies** (`:103`) | Add per-entry dependency/asset closure, client/store lifetime and capability bindings. Move integration-only callbacks above pure cores as required by the promised consumer; no physical move of every integration file. |
| **Two compositions and one resolver** (`:104`) | Replace title with “Two compositions, one resolver and one local block”. Reuse graph/SkillRuntime; admit the pure receipt action, validate its options/closed Contracts dependency, lower node/evidence mapping and execute it. Add data-only lint, import/invocation refusal and optional-handler replacement. Explicitly include local module loading in npm/binary acceptance. Keep old config preservation and CLI/library equivalence. |
| **Controls/harnesses and pruning** (`:102–105`) | Add the 12-owner map only as ownership/contract boundaries. Keep existing workstreams/owners for policy, distribution, review, monitoring and setup. Remove any implication that each needs a new stable export or a new universal runtime. |
| **Certification inventory** (`:145–159`) | Expand the existing independent-consumer/composition cases with the local manifest/action, unknown/duplicate/missing/cyclic/incompatible binding, protected refusal and data-only preview. Retain all 80 applicable pairs and required risk strata; do not reduce to 50 or count sub-assertions as extra pairs. Cases may grow if independent applicability warrants it. |
| **Cuts/deferrals** (`:175–176`) | Keep full facade thinning, all-cohort exports and catalogs deferred. Explicitly add full 12-block extraction, generic registry/reactive/HMR machinery, untrusted/effectful extension admission and broad overlay hierarchy. Remove only ambiguity that “local extension” means arbitrary npm plugin support. |
| **Achievability** (`:187–208`) | Add the delta inventory/date sensitivity below; no architecture label supplies owner capacity. Preserve operator readiness, October 7/14 reforecast and seven qualifying days on the final candidate. |
| **Value table** (`:234–235`) | Add “provider swap/new action without editing unrelated consumers” measured by the installed local action and one existing injectable-provider check. Avoid claims of performance/adoption gains or complete isolation. |
| **Parked-plan reconciliation** (`:250,252,270`) | Retain one artifact/no second authority. Clarify that narrow public support and medium internal ownership are compatible; required G2/G3 consumers/config proofs now include the admitted local action. |
| **Decision 2** (`:293`) | Replace the current narrow/every-cohort/CLI-only options with the exact replacement below. Do not change other fixed owner decisions. |

**Proposed replacement for final-plan decision 2:**

> **2. Block granularity and first public surface. A — staged medium ownership (default):** 12 target internal responsibility blocks; Contracts/Flow/Memory/Kernel-service/config/templates supported first, with one trusted local action and selected provider seams. Promote another entry only after real consumers and artifact/conformance proof; full extraction is later work. **B — coarse five:** the same bounded reuse/template/extension proof grouped under five owners, accepting integration coupling and fewer explicit seams. **C — broad public medium:** extract and guarantee all 12 now, adding compatibility/lifecycle/artifact work and reforecasting release. **D — fine registry:** micro-blocks plus generic capability/lifecycle resolution before release, separately scoped and priced. **Default: A.** One package, Kernel authority and intact gates apply to every choice.

### Workstreams, incremental effort and dependencies

Keep the v2 workstream structure. The block model belongs inside **Acceptance/interface lock**, **Public local assemblies**, and **Two compositions/one resolver**. Certification adds cases inside its existing lane. Policy/harness/skills/review/delivery/setup stay owned integration work, not six new release programs. [inferred]

| Additional slice beyond v2's already-priced outcome | Incremental estimate | Owner / dependency |
| --- | ---: | --- |
| Data manifest, capability IDs/ranges and supported-kind/authority rules | 0.5–1 engineering day | Contract/config owner at interface lock; reuses existing schema/validation patterns. |
| 12-owner inventory plus selected import/binding closure checks | 1–2 engineering days | Package integrator; extends existing structural/risk ownership. No wholesale directory extraction. |
| Bounded local-action manifest/input checks, module loading and handler/evidence lowering beyond the existing local-node promise | 1–2 engineering days | Config/composition owner; explicitly missing implementation. Close the npm/binary import path; no generic resolver/registry or provider lifecycle. |
| Import/invocation/data-preview/replacement/consumer conformance refinements | 0.5–1 engineering day | Existing assembly/certification owners; reuse artifact journeys and existing stateful-owner cleanup tests. |
| **Total delta** | **3–6 engineering days + 4–8 focused lead review/integration hours** | These are estimates to replace with owned task data, not observed throughput or extra staffing. |

Already in v2 and **not charged again**: public exports/default assemblies, narrow Kernel lifecycle, two starter compositions, one local extension, sparse config preservation, canonical distribution, required authority/process safety, origin upgrades, matrix infrastructure and the final observation campaign. Review-provider publication, full policy/setup extraction and generic third-party admission are outside this delta.

**Estimation basis/assumptions:** these are bottom-up judgments using B2's S/M source-slice bands (S = 1–2 days; M = 3–7), not empirical productivity data. The delta assumes v2 already funds the real two-template resolver and local-node execution outcome; the extra reader handles only the closed pure-action profile and delegates node DAG checks to SkillRuntime. It assumes the existing local review-module loading pattern can be adapted to the supported binary runtime, no new host/permission service is needed, and existing artifact cases can carry the assertions. Those assumptions are unverified. If binary external-code loading, schema preservation or handler replacement needs another interpreter/loader, stop treating it as this delta: re-estimate that missing slice at October 7 and revise dates. No numerical estimate is an approval to skip it or a capacity commitment.

Dependency path: interface/manifest subset + certification access → existing authoritative/preservation/package foundations → one public/config/local-action vertical slice → supported breadth/recovery → immutable final candidate → full required proof/seven qualifying days → promotion. Stateless Flow can proceed without Kernel opening; connected cases wait for claim/authority acceptance. Config/manifest/package shared ownership may serialize integration. More workers do not supply missing owner/operator time.

### Dates and what changes

All dates below are **conditional planning scenarios from the same October 1, 2026 start**, not a new endorsed forecast. V2's October 28–November 11 window already depends on capacity, operator/native access and campaign readiness. [read: local `plan.md:187–208`; inferred]

| Checkpoint | Proposed change to v2 |
| --- | --- |
| **October 1–5 acceptance/access** | Lock granularity, manifest subset, starter IDs/merge rules and local action choice alongside existing acceptance work. Do not extend this into a registry research program. |
| **October 7 pilot/access reforecast** | Add actual block-delta task effort, lead hours and config/package dependencies. Retain this checkpoint and the initial artifact→receipt readiness proof. |
| **October 14 ten-working-day reforecast** | Require one installed public/config/local-action slice and truthful authority/cleanup/refusal results before retaining the original stretch window. Confirm supported breadth remains provisioned. |
| **October 28–November 11 baseline stretch** | Retain only if the 3–6 engineering-day delta fits verified parallel capacity/contingency. Do not silently claim medium granularity costs zero. |
| **November 4–18 one-week slip sensitivity** | Use this explicit alternative if the delta consumes approximately five elapsed working days on the critical path. A parallel fit may add none; more serial work/access failure adds more. This is the date change to price, not a guaranteed new deadline. |
| **0.2 / 1.0** | No committed dates. Experimental published extensions follow real consumer and admission evidence; full 12-block extraction/fine registry are separately forecast. Retain v2's provisional additional 8–12-week 1.0 allowance only as an unpriced scenario. |

The seven-day final-candidate proof, all applicable risk strata, upgrades and four-harness commitments are unchanged. A candidate correction still incurs its own work and a fresh required observation window. If the owned delta exceeds these bounds, retain the promised narrow subset and explicitly reforecast broader ownership/extraction; do not weaken proof or quietly substitute a fixed workflow for the local extension.

### Source ledger and verification limits

| Named evidence | Exact checked source / use |
| --- | --- |
| **Authority** | `docs/work/2026-04-28-skeleton-pivot/locked-decisions.md:567–599`; Kernel-only issue backend and Memory delegation. D46 is owner target/local plan input, not merged removal. |
| **Product hierarchy** | Skeleton `runtime-building-blocks-refinement.md:4–47,126–200`; `template-library-and-merge-flow.md:3–37,82–117`; older pivot/thesis read with later supersession. |
| **Accepted harness direction** | Harness archive `README.md:3–16,42–76`; `research.md:533–570`; supplied audit `:7–8,29–45,174–189`; public research archive. Native ABI acceptance is retained separately from later proposals. |
| **Facade/product contracts** | Product-restructure `decision-register.md:13–17`; `facade-routing.md:3–6,47–55`; `plan.md:375–403`; acceptance/market research. Independent capabilities do not authorize alternate issue authority. |
| **Public boundaries** | `package.json:1–191`; `lib/contracts/index.js:17–31`; `lib/flow/index.js:93–114`; `lib/memory-core/index.js:319–331`; `test/structural/product-package-boundaries.test.js:13–23,132–183`; `pr2-root-integration.test.js:14–69`. Supported package exports still require implementation/artifact proof. |
| **Config owner** | `lib/core/runtime-graph.js:562–599,645–752,922–1050`; `lib/config-writer.js:72–126`; `lib/memory/router.js:89–114`; `lib/adoption-profiles.js:56–98`; workflow guide `:7–40,65–73`. Known fixed graph and sparse writes are narrower than proposed composition. |
| **Provider seams** | Memory `src/backend-registry.js:85–171`, `src/authority-provider.js:37–59`; Flow `src/executor.js:205–276`, `src/skill-runtime.js:60–205,335–361`; `lib/review-adapter.js:80–124`; `lib/adapter-cli.js:56–225`. Synchronous injection and fixture loading are not a generic host. |
| **Distribution/trust** | `lib/plugin-manager.js:221–299`; `lib/commands/_registry.js:156–204`; `lib/commands/new.js:3–10`; `lib/forge-lock.js:62–144,152–244`; package file exclusions `package.json:87–106`. Local integrity and metadata are not remote materialization/isolation. |
| **Topology replay** | Executed B2's appendix using Git object reads and installed Babel parser, with output reduced to counts. Assertions passed for 286 modules/626 sites/607 edges/22 physical/33 refined areas/six cycle groups/three computed loads at the pinned ref. Initial replay wrapper omitted `require.resolve`; corrected the wrapper before obtaining the successful result. No source or host file writes. |
| **Local planning inputs** | Fully read local v2 `plan.md` and B1–B3; consulted `research/L2-architecture.md:183–280`. These are recommendations/attributed research, not remote implementation state. Plan line ranges above are local. |
| **External contracts** | Primary URLs in sections 5 and 7 checked as source/documentation. Cordis upstream and Harness's vendored/newer implementation are distinguished; no runtime isolation/rollback/performance experiment performed. |

The topology replay verifies only static literal imports. Source inspection verifies only the named implementation owners. Neither establishes shipped composition, host enforcement or the future extension contract. B1/B2's earlier unit/test results are not silently counted as a new exact-master artifact campaign.

## 10. Decisions needed — Open questions for the owner

These choices select a later plan revision/implementation contract; silence uses the planning defaults. This read-only synthesis authorizes no implementation, installation, live operation or publication. One package, sole Kernel authority, Node24/26, decided cuts and required gates are fixed. The four-harness/two-starter/local-extension breadth is the retained v2 baseline, not an independently recovered locked decision.

1. **Granularity and public breadth.** **A — staged medium:** 12 target owners, six narrow public entry categories and one admitted local seam; broader extraction/publication follows consumers. **B — coarse five:** fewer named owners with the same bounded release outcomes. **C — all 12 public/extracted now:** add compatibility/lifecycle work and reforecast. **D — fine registry first:** micro-block lifecycle/resolver program before release. **Default: A.**
2. **First local extension.** **A — pure receipt-export action:** prove a genuinely new capability/node without remote effects. **B — synchronous Memory enrichment provider:** cheapest existing provider seam; still prove template customization separately. **C — effectful review/execution provider:** more useful if immediately demanded, but add permission/supervision/recovery work. **Default: A.**
3. **Configuration breadth.** **A — defaults → starter → project → explicit invocation**, with additive maps, explicit list operations and one protected floor. **B — add team/user layers now:** decide scope rules/migration and price the hierarchy. **C — fixed graph toggles only:** explicitly narrow the target and postpone genuine extension. **Default: A.**
4. **Lifecycle promise.** **A — startup admission/restart changes for pure local actions**, retaining existing built-in service cleanup; no extension setup/dispose. **B — live reactive provider replacement:** require in-flight ownership, last-good/failure protocol and host proof before claiming it. **Default: A.** Neither promises universal external rollback or hostile-code isolation.
5. **Third-party timing.** **A — trusted pure local action in 0.1.0**, then pinned experimental packages and selected stable contracts when proved. **B — experimental published admission in 0.1.0:** add package/trust/support work and reforecast. **C — marketplace/automatic updates now:** separately owned distribution and incident-response program. **Default: A.**
6. **Effort/date treatment.** **A — choose the bounded subset and require owned October 7/14 reforecast**, retaining 3–6 engineering days/4–8 lead hours only as the stated-assumption estimate and November 4–18 as a slip sensitivity. **B — retain the original window only after owned capacity proves the delta fits. C — expand architecture before release:** resource-load that scope and replace the stretch scenario. **Default: A.** No estimate is accepted capacity or a delivery commitment.

Valid replies are one label per numbered question, or a combination in order. **Overall default: A+A+A+A+A+A — staged medium ownership, pure local action, bounded additive config, startup admission without extension lifecycle, later published admission and owned schedule reforecast.**

## Confidence

**High** in the settled-direction distinctions, named source seams, pinned static topology replay and the fact that v2 does not already promise a universal plugin runtime. **Medium** in the 12-owner recommendation and bounded contract/config design: they reuse real seams but still need implementation/consumer proof. **Low** in numeric marginal effort/calendar, external-provider demand, guaranteed containment/rollback or broader third-party substitutability; these were not measured or exercised. The report is a verified synthesis artifact and a proposed plan patch, not an implemented block system or an accepted release.
