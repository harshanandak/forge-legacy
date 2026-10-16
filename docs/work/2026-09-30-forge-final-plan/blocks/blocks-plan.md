# Forge blocks — synthesis v2

## 1. Bottom line

1. **Decisions needed:** retain staged medium ownership, the bounded receipt-action seam and an owned reforecast; defaults in section 10 preserve the 0.1.0 scope. [inferred]
2. **Recommend 12 internal responsibility owners as a coordination map, with selective enforced boundaries and six narrow public entry categories.** Twelve extractions, descriptors and stable APIs are not release deliverables. [inferred]
3. **Refine final-plan decision 2 to staged medium ownership:** Contracts, Flow, Memory, Kernel service, config and templates first; promote other contracts only with real consumers and artifact proof. [inferred]
4. **The first extension proves a host-defined experimental receipt-rendering contract with independently implemented compatible renderers.** Config cannot manufacture an unrelated capability or stateful service. [inferred]
5. **Correct the admission gap before import:** CLI and binary require affirmative invocation-local operator admission; an embedding library requires a trusted caller decision tied to the resolved action/source. YAML, locality and lock metadata cannot consent. [read: source ledger; inferred correction]
6. **Keep one effective config and protected authority outside precedence.** Replace implementation-specific options explicitly, version externally targeted composition IDs, and preserve admitted context on resume or refuse. [inferred]
7. **Keep sole Kernel authority, one npm package and intact gates.** Pure-action metadata and presentation PASS cannot grant acceptance, approvals or merge permission. [read: D44/D45 and owning checks; inferred obligations]
8. **Borrow capability injection, owned cleanup and declarative layers from Cordis/Harness.** Same-process trusted code has ambient privileges and no enforced synchronous deadline; composition is not containment or external rollback. [external/read; inferred]
9. **Retain 3–6 engineering days plus 4–8 lead hours only as a provisional marginal estimate.** Reconcile every baseline/delta item at October 7; lead review consumes 2.7–5.3 of the illustrative 90-minute review allocations. [inferred; ran: arithmetic]
10. **Retain October 7/14 reforecasts, installed npm/binary proof and final-candidate observation.** November 4–18 is a five-working-day slip sensitivity, not a forecast or upper bound. [read: local final plan; inferred]

**Revision scope.** This is the next synthesis draft, not a change to `plan.md` or implementation authorization. The companion `eval/round1-revision-log.md` disposes of all 19 numbered critique items: one blocker and 18 non-blocking improvements. The revision reads `revise.md`, `common.md`, `blocks-common.md`, the ten-section synthesis brief, v1 and all three round-one critiques; research-leg verification uses B1–B3 and bounded read-only source checks. Only this file and the revision log are authorized writes. No commits, pushes, GitHub writes or Kernel mutations.

**Evidence.** Tracked-source references use `origin/master` at **`7d448ec812ef8639790477af07c3c75962173f8a`**; the local final-plan folder is supplied planning material. `[read]` is rung 2 source inspection; `[external]` is checked primary documentation/source, also rung 2; `[ran]` applies only to the named executed readback/calculation; `[inferred]` marks design, estimates or predicted cases. Research-leg executions remain attributed to their leg; they are not new revision measurements. All APIs, schemas, commands and release allocations below are proposed unless expressly marked current. No extension, installed artifact, migration, live-harness, hostile-code or release campaign was executed for this revision.

## 2. What's already settled

| Settled direction | Consequence for this plan | Checked basis / limit |
| --- | --- | --- |
| **Blocks are the product; templates are scaffolds.** | Independently usable capabilities remain the goal; do not redo the template-versus-runtime debate. | [read] Skeleton `runtime-building-blocks-refinement.md:4–47`; `template-library-and-merge-flow.md:3–37`. The complete engine is a design, not established shipped behavior. |
| **One first-party npm package.** | Supported modules/subpaths live inside `forge-workflow`; third-party implementations may be other packages depending on selected Forge contracts. | [read] Owner briefs; local final `plan.md:44–53,249–252`; `test/structural/pr2-root-integration.test.js:14–36`. Older separate-package proposals are superseded for this target. |
| **Kernel alone owns issue/workflow/run authority.** | Memory delegates authoritative operations; connected Flow submits evidence. Files, config, trackers and recall do not become acceptance authorities. | [read] `locked-decisions.md:567–599`; `lib/memory-core/src/authority-provider.js:37–59`; restructure `facade-routing.md:47–55`. |
| **D45 retires live Beads; D46 removes the importer in the release target.** | Preserve native history/provenance and recovery; do not resurrect a live backend or claim importer removal already landed. | [read] D45 ledger; owner brief/local `plan.md:101,249`. D46 is an unmerged target. |
| **Default stages are a composition.** | Independent actions/providers need not create another stage; retain existing stage compatibility, required evidence and human checkpoints. | [read] Refinement `:126–183`; D43 `locked-decisions.md:555–563`; `WORKFLOW_TEMPLATES.md:7–40,65–73`. |
| **Config is separate, additive and explainable.** | One resolver owns merge semantics; consumers receive its output. Exact new merge/update rules are specified in section 5. | [read] Local `plan.md:47–53,91,104`; B1 records conflicting historical layer orders, which are not current implementation promises. |
| **Forge-native contracts may borrow Cordis semantics; Cordis stays optional.** | Adapt provider injection and owned cleanup at genuine seams; do not rename every helper a plugin or require a new runtime framework. | [read] Harness archive `research.md:533–570`; supplied audit `:7–8,174–189`. Later analysis does not establish another approval event. |
| **Provider seams precede generic plugin machinery.** | A Memory enricher or review provider extends an existing owner rather than automatically becoming another core block. | [read] Memory backend registry; Flow injection/SkillRuntime; review SPI. Their lifetime and authority contracts differ. |
| **Composition is not sandboxing or universal reversal.** | Trusted JavaScript retains host privileges; disposers cover owned effects, while committed external changes need system-specific recovery. | [read] Harness archive `research.md:181–190,401–412`; supplied audit `:29–45`; section 7 primary sources. |
| **Retain the bounded v2 baseline.** | Node24/26, gates and decided pruning remain fixed. Four supported harnesses, two compositions, one local extension and the existing certification campaign remain the recommended baseline. | [read] Owner briefs; local `plan.md:101–108,169–183`. Baseline recommendations are distinguished from immutable owner constraints. |

**Current foundations:** three source cohorts—Contracts, Flow and Memory core—have index-entry/import rules. Memory has a synchronous backend registry and a non-replaceable local floor; Flow accepts injected synchronous execution/handlers; review scaffolding/replay and sparse config edits exist. The bundled `PluginManager` parses harness descriptors, not a general activation/replacement host. [read: source ledger]

**Current limits:** the inspected root manifest has no `main` or `exports`; the resolver clones a fixed graph and applies known settings. These paths do not implement supported npm block subpaths or manifest-selected local-action composition. The twelve-owner recommendation is a coordination judgment, not a measured optimum or twelve interchangeable modules. [read: `package.json`; `lib/core/runtime-graph.js:972–1004`; boundary test `:13–23,132–183`; inferred]

## 3. The block model

### Definition, identities and authority

**A Forge block is a cohesive capability owner with a supported input/output contract, explicit dependency boundary and suitable lifetime.** A provider implements one of its extension points; a template composes instances. A pure library, authoritative service, data template and supervised integration need different lifecycle machinery. A skill, CLI verb, helper or budget bucket is not automatically a block. [inferred]

Keep definition ID (`forge.memory`), instance ID (`project-memory`), capability/interface ID/version, implementation version, manifest dialect, Forge artifact version and template ID/version distinct. First-party implementations share the one artifact's release version; that does not establish capability compatibility. A stable contract must protect callers and implementers separately.

Ownership rules:

- Contracts validate neutral schemas/identity; they do not open stores or execute work.
- Kernel owns authoritative issue/claim/workflow/run/gate admission and durable state. Raw SQL, event insertion, internal migrations and approval-minting APIs stay private.
- Memory's local authority floor delegates to Kernel; enrichment cannot remove, replace or suppress it.
- Stateless Flow works through injected packet/receipt providers without opening Kernel. Connected assembly binds the same Kernel at the integration edge.
- Config/templates produce desired composition, bindings and origins; those records are not work-progress authority.
- Evaluators may produce diagnostics/additional requirements. Only the authorized owning gate/Kernel path accepts protected state or merges.

[read] Existing delegation, registry and executor seams support these directions; the complete ownership/admission contract is [inferred].

### Future contract vocabulary versus the 0.1.0 admission schema

The following is **design vocabulary**, not a promise to implement a general manifest host in 0.1.0. Only the closed action subset immediately below is normative for the proposed first loader.

| Future vocabulary | Contract to settle before admitting that form |
| --- | --- |
| Manifest dialect, ID, implementation and host version | Data-only discovery; reserved first-party namespace; duplicates/unknown dialects refuse; explicit compatibility declaration. |
| Provides/requires | Capability/interface compatibility distinct from package version; explicit instance bindings and cardinality; no implicit provider winner or optional authority floor. |
| Config schema | Supported vocabulary, defaults, unknown-key/error behavior and source/options migration; validators must not execute during preview. |
| Lifecycle | Pure/data forms need no hooks. Later provider `setup(context, config)` must define readiness, partial ownership, failure, cancellation and disposal. |
| Effects/permissions | Declarations for review; host authorization grants separately. Registrations, owned local resources and remote commits have different recovery contracts. |
| Authority/gates | Only the built-in Kernel owns authority; narrowed delegated clients may be admitted later. No extension-defined approval or gate exemption. |
| Test/proof | Author fixtures are inputs. Host-observed conformance binds candidate/source/contract identity, operating mode and promised consumer. |

**Proposed supported 0.1.0 fields and refusal rules:**

| Field | Accepted action-subset meaning |
| --- | --- |
| `manifestVersion` | Exactly the supported experimental dialect `forge.block/0.1-draft`; unknown/missing dialect refuses before import. This is not a frozen v1 standard. |
| `id`, `version`, `forgeRange` | Namespaced non-reserved action definition ID, implementation semver and explicit compatible host declaration. The host accepts its documented closed supported-version policy, without a general service/version solver. Duplicate definition/instance IDs refuse. |
| `kind`, `entry`, `sourceFiles` | Only `action`; one self-contained CommonJS entry and at most one self-contained conformance entry under one real source root. No extra local/runtime package loading or install scripts in this supported profile. Resolve containment and capture source identity without execution. |
| `provides` | Exactly the host-defined `forge.receipt.render` experimental pure interface. Unknown/reserved capabilities and unrelated interfaces refuse. |
| `requires` | Only the fixed Contracts receipt dependency, bound to the known Contracts entry; no arbitrary provider/service requirements. |
| `configSchema` | Inline data using a closed supported subset: object, primitive properties, required fields, enums/defaults and `additionalProperties: false`. Reuse existing validation machinery; unknown keywords/keys/custom validators refuse. No general schema engine or executable schema. |
| `lifecycle`, `authority`, `effects`, `permissions` | Exactly `none`, `none`, `[]`, `[]`. Advertised setup/dispose, service scopes, effectful operation or delegated authority refuses. These values describe a contract, not an enforced sandbox. |
| `proof` | Optional bounded relative conformance entry and pure-mode metadata in the declared source set. Reading metadata cannot execute the fixture; executing it needs host admission just like the action. |

Unknown author fields refuse; host resolution/admission/result records are not writable author fields. The closed source set is the manifest, its inline schema, one entry and optional fixture; the two executable files must each be self-contained. `.cjs` fixes the supported module format without importing a project package manifest. The host injects Contracts validation. Calling outside this profile is unsupported; a trusted module can still ignore declarations through ambient JavaScript access.

Concrete proposed manifest:

```json
{
  "manifestVersion": "forge.block/0.1-draft",
  "id": "local.receipt-export",
  "version": "0.1.0",
  "forgeRange": ">=0.1.0 <0.2.0",
  "kind": "action",
  "entry": "./index.cjs",
  "sourceFiles": ["./index.cjs", "./conformance.cjs"],
  "provides": {
    "forge.receipt.render": {
      "interfaceVersion": "0.1.0-experimental",
      "mode": "pure"
    }
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
  "proof": { "entry": "./conformance.cjs", "modes": ["pure"] }
}
```

These service IDs are draft design names; the fixed receipt dependency uses the existing v1 wire contract, not a shipped service registry. Stable host range examples do not cover RCs automatically: candidate trials must explicitly declare compatibility without a gate exemption. All first-party imports use selected `forge-workflow` entries.

### Host execution admission — required before import

The safety critique is accepted. Current `forge-lock` locality/integrity classification (`trusted: true` for a file inside the project) is not operator consent; harness-native project trust is not a universal Node/library signal. **Do not use either implicitly to authorize the new loader.** [read: `lib/forge-lock.js:66–83,116–170`; `AGENT_SKILL_PARITY.md:174`; inferred correction]

1. **Data-only resolve and capture:** read the manifest/schema and selected template/config; identify instance/definition, real source root, entry, closed local code set, contract/mode and sanitized options. Capture the exact allowed bytes into a unique host-owned execution snapshot without importing them. Fingerprint the canonical tuple of definition/instance IDs, original real source root, relative filenames and captured bytes, plus separate effective-composition/options identity. Do not import entry, fixture, schema module or installation code. Invalid selections refuse.
2. **Independent affirmative decision:** CLI and compiled binary receive an explicit invocation-only operator selection covering that resolved action/source fingerprint, selected composition/options identity and purpose (`activate` or `conformance`). `activate` permits action import and renders under that fixed composition during this host invocation; it does not authorize fixture execution. `conformance` permits the captured action and fixture only for the deliberate conformance check. A self-contained fixture receives the action/validator from the host rather than importing another project file. Illustrative startup admission flags are a proposed interface, not an existing command. Libraries receive a trusted embedding caller's admission record/callback over the same descriptor; project data cannot supply that callback or mint a positive record. Headless callers must supply the decision explicitly.
3. **Scope and import:** no implicit `enabled: true`, YAML override, author proof/hash, environment default or locality-derived lock bit grants consent. Missing/unknown/mismatched admission yields a typed `LOCAL_ACTION_NOT_ADMITTED`/source-change refusal before any extension code runs. Load only the captured host-owned snapshot matching the decision; never reread executable project paths after admission. A changed root, code set, manifest, contract or implementation in a newly resolved selection requires a fresh affirmative decision. Admission expires with the invocation and does not transfer to another selection or resumed invocation. Activation consent does not silently authorize fixture execution; conformance has its own purpose-scoped decision.
4. **Coverage and limits:** consent covers the named supported code set and explicitly acknowledges same-process ambient privileges. Manifest metadata cannot prove that malicious JavaScript respects its source list. Immediate hashing followed by `require(projectPath)` leaves a check/load race and is insufficient for the promised loaded-source identity. The snapshot closes that supported-path race; it does not protect against malicious same-user snapshot modification or ambient runtime access. Snapshot creation/loading/cleanup is missing loader work to itemize at the pilot, not a new grant store or sandbox.
5. **Shared consumer contract:** CLI, injected library and binary use the same resolution/admission semantics. Reuse a native harness decision only when a supported integration exposes a verified affirmative decision with matching source and purpose scope; no such cross-consumer implementation is established here. No persistent grant database, installer or generic plugin framework is included.

Record source/admission provenance through existing candidate/composition/receipt records, without storing authority in the author manifest. An action admission does not grant Kernel mutation, protected-file, gate or remote-operation permission.

**Acceptance:** describe/lint without admission leaves an import-time sentinel untouched; activation and fixture execution without/mismatched or wrong-purpose consent leave it untouched; admitted execution works through actual CLI/library/binary artifacts. Changed source/selection does not inherit permission from YAML. Change original project bytes after snapshot capture and prove execution uses only the admitted snapshot; a new capture of changed bytes requires new consent. Cover real-path escape, supported-profile dependency refusal and snapshot failure/cleanup; distinguish conformance from containment. Recheck all owning authority/protected/merge refusals. These are proposed cases, not executed proof.

### Lifecycle, effects and adversarial obligations

Startup: validate descriptors/config/closed action bindings → initialize only required existing owners → bind admitted handlers → mark the composition ready. Contracts and data validation precede Kernel in connected assembly; Kernel opens under its fixed protected-admission floor, then Memory/authorized integration clients and Flow. Stateless Flow branches from Contracts/config and does not open Kernel. Avoid a bootstrap cycle in which an extension must authorize the Kernel that authorizes it. Existing built-in owners retain their actual factory/open/close contracts; no universal `setup` loop is introduced. [inferred]

Failed admission introduces no extension disposer: discard the host binding, remove only the invocation's owned snapshot and return refusal. Successful invocation also cleans that owned snapshot after consumers finish; retain fingerprint/provenance and durable evidence. The host owns this temporary-file lifecycle; it is not an extension setup/dispose hook. Existing partial assembly closes resources through their current owners. A later generic provider lifecycle must prove partial setup ownership, reverse-dependency disposal, cancellation and bounded cleanup; it is deferred. The current executor rejects Promise execution, so an asynchronous provider is not a cheap drop-in. [read: executor `:217–248`; inferred]

**Authorize before effects.** Flow invokes `run` before classifying reported mutations (`executor.js:243–254`); validating a returned receipt cannot prevent an earlier remote commit. Connected integrations authorize the operation before invocation through the existing owner. Disposal never erases accepted Kernel history.

| Effect class | Reverse/recovery obligation | Limit |
| --- | --- | --- |
| Owned registration/handle/timer | Remove/close through the owning lifetime; test partial and repeated cleanup where applicable. | Only mediated owned resources. |
| Owned generated file/link/config | Preserve prior bytes/ownership; validate before replacement; refuse intervening edits; verify supported restore. | Do not clobber user or another process's edits. |
| Owned child process | Controller cancellation/acknowledgement, bounded kill/reap and terminal evidence. | A returned disposer/reducer does not prove termination. |
| Kernel mutation | Current lease/revision/epoch/approval checks, durable acceptance and supported compensation if appropriate. | No deletion of accepted history on disposal. |
| Remote/message/deployment/data mutation | Explicit operation authorization and system-specific idempotency/outcome/compensation. | No universal inverse or exactly-once promise. |

**Availability ceiling:** a synchronous in-process import or renderer can block the host/event loop indefinitely. Input/output bounds do not create a wall-clock deadline or cancellation boundary. Document this as a trusted presentation seam, not a cancellable executor. Required enforced termination or untrusted execution belongs to the separately scoped process boundary. [read: SkillRuntime handler invocation; inferred; no timeout experiment]

| Adversarial case to retain | Owning refusal/invariant and evidence lane |
| --- | --- |
| Renderer reports PASS for a FAIL/INCOMPLETE input run | Contracts/host wrapper preserve original receipt identity/outcome; presentation PASS is separate. Kernel acceptance cannot be called by the renderer. Existing composition/security cases. |
| Evaluator attempts to mint approval | Kernel/gate-event owner accepts only authorized approval events; custom output remains evidence/diagnostic. Existing authority cases. |
| Lower or upper layer removes required edge/floor/stop | Resolver validates mandatory obligations over the final graph; protected owner retains admission. Existing composition/refusal cases. |
| Stale actor/head/path/content or consumed authorization | Protected-state owner rejects mismatched/consumed capability. Existing security cases. |
| Favorable custom merge predicate despite failed protected checks | Mandatory exact-head/protected checks and final live ownership/gate rechecks remain in the merge command. Existing merge/security cases. |
| Source is unadmitted or changes before import | Host loader refuses before entry/fixture code; sentinel proves the supported path. Existing installed-consumer/composition cases. |

[read] Current owning checks are in `runtime-graph.js:645–718`, `protected-state-authority.js:178–243`, `gate-events.js:200–220` and `commands/merge.js:749–795,1368–1419,1462–1464`. The new loader/algebra must preserve them; this table is an implementation obligation, not executed bypass resistance. Use existing certification lanes, not another framework.

## 4. Granularity options

### Coarse: five groups

**Contracts; Memory/Kernel; Flow; Composition; Integrations.** Composition owns config/templates; Integrations groups policy, harness/hooks, skills distribution, review/delivery and setup/recovery. Kernel remains a separately owned sole authority even inside the coarse grouping. This opens standalone Memory/Flow, bounded templates and selected provider replacement in one package. Immediate mapping cost is small, but Integrations hides different installation, policy and external-effect lifetimes and creates coupling during later changes. [inferred]

### Medium: twelve responsibility owners — recommended

| Owner | Capability | Initial treatment |
| --- | --- | --- |
| Contracts | Packets/receipts/evidence schemas and identity validation | Existing source entry; selected supported public entry. |
| Kernel | Issues, claims, workflow/run/gate admission and store lifetime | Fixed authoritative provider; narrow service/client, private SQL/driver/migrations. |
| Memory | Durable knowledge/provenance, recall/context and enrichment | Existing core plus useful default assembly; preserve Kernel-backed floor. |
| Flow | Stateless/connected execution, skill DAG, lifecycle/monitor primitives | Existing core; authority supplied at integration edge. |
| Config/composition | Selection, bindings, validation and origins | One resolver and pure/injected public data API. |
| Templates | Versioned editable starters and optional action addition/replacement | Two starters; compatible experimental local receipt actions. |
| Policy/evaluators | Diagnostics/predicates and additional requirements | Internal boundary; no substitute acceptance authority. |
| Harness delivery/hooks | Detection, projection/install plans and host enforcement | Internal owner; four supported installed-version proofs. |
| Skills distribution | Canonical bytes, discovery, collision/provenance and owned links | Reuse distribution owner; no executable block per skill. |
| Review providers | Normalized review reads and separately authorized effects | Existing SPI internally; public promotion needs consumers/conformance. |
| Delivery/monitor | Exact-head PR/check reads, durable monitor/train handoff | Internal Kernel/Flow/Memory consumer; guarded remote writes remain owned. |
| Facade/setup/recovery | Routing, install/doctor/upgrade/restore orchestration | Integration boundary over owning services; no public mega-service. |

**Mapping ceiling:** use these names to assign responsibility and identify risky dependencies. The inventory/selected-check slice remains provisionally capped at **1–2 engineering days** in the section 9 delta. Do not create a factory, descriptor, versioned ABI or conformance lane for each untouched name. Add enforcement only for a promised consumer or risky cross-owner boundary. If the cap is exceeded, reforecast the required boundary work and defer unneeded taxonomy work; never weaken an applicable gate. Three existing enforced source cohorts do not demonstrate twelve isolated blocks. [read: boundary tests; inferred]

This enables focused ownership, useful assemblies and provider substitution without a package train. An explicit factory table and existing injected seams suffice internally; the receipt loader is one closed host extension point. Untouched integrations may remain in current directories. Promote another owner after a materially different consumer demonstrates why an existing seam is insufficient.

### Fine: micro-blocks plus a registry

Example list: envelope validation; hashes/identity; schema compatibility; issue client; leases; transitions; run/evidence admission; approvals; store open/close; backup/export; recall; context selection; enrichment; packet executor; bounded loop; skill DAG; process supervision; durable monitor; config parse/layer merge; template catalog/migration; predicates; hook rendering; harness installation; skills delivery; review normalization/effects; PR reads/monitor; merge delivery; setup planning. A capability registry adds scopes, cardinality, service/version resolution and dependency-driven activation. [inferred]

This opens fine substitution and potentially reactive withdrawal/recovery, but every interface/order/lifetime becomes a compatibility obligation. Kernel operations remain non-substitutable authority. Names/ranges alone cannot establish authorized equivalence, safe hot replacement or containment.

| Option | Effort now beyond the retained program | Maintenance / risk | Fit with one package + templates + additive config |
| --- | --- | --- | --- |
| Coarse five | Provisional 0–2 engineering days for mapping; actual assemblies/resolver still baseline work. | Lowest immediate API count; catch-all coupling and hidden lifetimes. | Good topology fit, weaker responsibility/extension clarity. |
| Staged medium twelve | Provisional **3–6 engineering days + 4–8 lead hours**, subject to the ledger/pilot; not twelve extractions. | Moderate internal review; support only promised entries/seams. Descriptor-only architecture is the main risk. | Recommended: clear owners, small real compositions, one resolver. |
| All twelve extracted/public now | L/XL work; v1's **3–6 extra weeks** is an unmeasured scenario, to replace with owned tasks. | High caller/provider, lifetime and artifact burden; serialized cross-owner integration. | Topology fits; poor bounded-release trade. |
| Fine registry first | XL framework work; v1's **6–12 extra weeks** is an unmeasured scenario before full certification. | Highest interface/lifecycle/migration cost; cycles, ambiguity, unsafe replacement and implied isolation. | Possible in one artifact; no demonstrated first-release need. |

All effort is [inferred]. Twelve is a useful coordination grouping, not an evidenced optimal module count. Staged medium wins by delivering independent APIs and real customization while deferring broad extraction/hosting machinery.

## 5. Config composition

### Layering, input schema and protected constraints

DeepSeek Harness separates profile selection from bundles/code and ordered patch layers; its inspected matching-ID patches replace whole entry configuration. Forge borrows declarative selection and inspectable origins, while specifying additive behavior deliberately. [external: [Harness layer contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#understand-the-implementation)]

Current Forge clones `RESOLVED_RUNTIME_GRAPH` and applies known settings; sparse writes preserve siblings. The graph output schema is not a strict project-input schema, and the evidence `CapabilityManifest` is not an activation manifest. Extend the one resolver with actual template/action input validation and handler lowering; do not add an ignored `blocks` key to the output vocabulary. [read: `runtime-graph.js:10–39,645–752,922–1004`; `definitions.js:37–41`; `config-writer.js:72–126`]

**Proposed precedence, low → high:** shipped defaults → selected pinned starter → sparse project config → explicit invocation overrides. The immutable authority/protected floor is a constraint over the resolved result, not an overridable layer. Adoption profiles seed adoption settings; no automatic user/team/home hierarchy is added. Libraries accept supplied inputs/effective output; CLI discovers files/environment at the edge. Translate supported environment selectors once and retain explicit argument > environment > project precedence on migrated selectors; never re-read ambient environment into a caller's already resolved library config. [read: `memory/router.js:89–114`; inferred]

**Legacy-config union:** before enabling strict unknown-key rejection, inventory legitimate settings from all current readers against `origin/master`: `merge.auto`, Memory backend/Graphiti selectors, issue/sync backend settings and generated template/classification/rail metadata as well as resolver-owned keys. Freeze each key's keep/migrate/retire disposition and ownership/reader protocol at interface lock. The union does not preserve a retired live Beads backend or forbid the owner's decided pruning; retired settings receive explicit migration/refusal. Preserve unmigrated valid keys/readers until deliberately migrated; reject genuinely unknown new keys with paths. A key absent from the graph resolver is not automatically invalid for the entire product. [read: `commands/merge.js:6–26,44`; `memory/router.js:59–114,175–198`; `issue-backend.js:35–102`; `sync-backend.js:40–103`; adoption/init config metadata; inferred inventory obligation]

| Value / operation | Deterministic proposed rule |
| --- | --- |
| Scalar / ordinary map | Higher supplied scalar wins if allowed; recursively merge ordinary maps by key. Missing inherits; `null` needs explicit support. |
| ID maps | Merge stable block/instance/node IDs; duplicate in one layer refuses. Overlay of an existing target is an explicit override, not another definition. |
| Lists / order | Documented preference lists replace explicitly; append is an explicit deduplicated-ID operation. Execution order comes from dependency edges, with deterministic independent-node ties. |
| Required obligations | Preserve gates/evidence/stop edges and approval applicability; permit additions. Neither lower nor upper list replacement may remove the mandatory set. |
| Optional disable | Keep declaration visible; refuse if protected obligations/required consumers depend on it. Do not import disabled code. |
| Handler/provider replacement | Explicit target/source/binding; validate interface, mode, schema, input and obligations. Only the admitted optional receipt-handler form ships first. |
| Implementation-specific options | Source/implementation or config-schema identity change requires a **complete replacement options object**, validated after new defaults; discard old explicit options. No cross-identity deep merge or implicit reuse even for same-named keys. A separately supported explicit migration may be added later. |
| Reset | Sparse removal restores the current lower layer; it does not create a shadow empty map. Source replacement must still specify fresh options. |
| Unknown/invalid | Typed path/ID/layer errors; malformed files are not absence and selected unknown blocks are not ignored. Data-only checks precede import. |
| Origins | Record winning/lower sources and operation, including `replace-source` and `replace-options`, dropped old option keys, template/interface/source identities and sanitized readiness errors. |

For a future `{format, theme}` renderer replaced by `{format, style}`, the old `theme` never leaks into the new implementation. An explicit `config: {}` means accept the new schema's defaults, not inherit old options. Same-source compatible patch option changes can use the documented additive rules; incompatible schema/meaning changes require migration/refusal. These option guarantees are proposed resolver work, not behavior of today's sparse writer. [read: writer `:72–126`; inferred]

**Supported writer protocol:** read bytes/identity → compute sparse proposed change → validate the whole recognized composition and protected obligations without import → refuse if current bytes changed since read → replace through a proved atomic/platform-safe write → read back. Preserve prior owned bytes for supported restoration; refuse rather than overwrite an intervening edit. Direct user YAML edits remain possible, but invalid edits refuse next activation while a running snapshot stays unchanged. Current `config-writer.js:54–58` directly writes the file; sibling preservation is not validated transaction, crash recovery or concurrency proof. This missing implementation stays in the existing config/preservation lane. [read/inferred]

### What a user edits and what the host admits

Proposed YAML, unsupported by today's resolver:

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

The two proposed starters are `forge.tdd-delivery` and `forge.small-change`, initially version `0.1.0`. They retain corresponding stage/gate behavior. `evidence-accepted` is an illustrative starter-declared node, not a current graph ID. YAML selects desired data; **the affirmative execution decision is a separate host invocation/caller input under section 3**. Describing this YAML grants no execution.

**Action ABI:** CommonJS `renderReceipt(receipt, { ...validatedOptions, validateContract })` returns `{ content, mediaType }` synchronously or throws a render/validation error. `validateContract` is host-owned/reserved, never overrideable by config. Pass a validated immutable copy of the receipt; retain the original host record/identity independently of extension output. Bound content/input sizes and allowlisted/redacted output are part of the contract. No context container, Kernel client, setup/dispose or arbitrary action inputs are supplied; JavaScript still has ambient privileges and the synchronous-stall ceiling.

**Lowering:** `after` becomes SkillRuntime `dependsOn`; select an admitted function and store its wrapper in `handlers[nodeId]`. Set arbitrary `inputKeys/contextKeys` empty. `receiptFrom` names a declared predecessor; select exactly one validated receipt from that predecessor's bounded `dependencyEvidence`. The connected built-in readback returns `{ status: "PASS", evidence: [{ kind: "run-receipt", receipt }] }` from Kernel-admitted evidence. Invalid/missing/duplicate input yields INCOMPLETE with sanitized `INVALID_RECEIPT_INPUT` evidence; valid rendering yields presentation PASS/content without changing the receipt's original status or acceptance. Known refusal codes belong in evidence because current runtime normalization does not preserve a handler's arbitrary top-level `error`; uncaught failures retain its generic failure behavior. A stateless call receives a validated receipt without asserting Kernel acceptance. [read: `skill-runtime.js:145–206,229–267,320–361`; inferred wrapper]

**Startup-only compatible replacement**, retained as an explicit increment:

```yaml
blocks:
  alternate-summary:
    source: local:./.forge/blocks/alternate-summary/block.json
    enabled: true
    bindings:
      contracts: forge.contracts
    config:
      format: json
workflow:
  replace:
    receipt-summary:
      action: alternate-summary/forge.receipt.render
```

The existing target must be optional and expose the receipt input contract. Replace only the handler; preserve node ID, predecessors/successors, `receiptFrom`, gate/stop/evidence obligations and original outcome. The new implementation gets its own options and host admission; old selection cannot consent to it. Authority/gate/acceptance/required delivery-node replacement refuses. Failed validation does not commit supported-writer bytes or alter a running snapshot. Replacement is **not free handler injection**: implement config semantics and prove a second independently authored compatible renderer with unchanged consumers, plus incompatible-renderer refusal, in the existing installed-consumer case. It remains the same one extension contract, not a second generic capability.

Known built-in providers stay selected internally. Embedding code may inject a supported synchronous Memory enricher through its existing registry; arbitrary provider packages are not loaded from YAML. Async/stateful/effectful requirements need separately approved host contracts and estimates. A local fixture `require` in review replay is not compiled-artifact loading proof. [read: Memory registry; adapter CLI `:155–181`; command registry `:164–194`]

### Update, compatibility and resumed-run dispositions

Template IDs/versions identify fixed data; externally targeted node/binding/capability IDs, `receiptFrom` semantics and override targets are compatibility contracts. Compatible 0.1.z updates retain promised pinned starter data/meaning and supported public/wire behavior. Do not silently rename an override target. Use existing config/Kernel/candidate records, not another progress store. [inferred]

| Situation | Required disposition at interface lock |
| --- | --- |
| Compatible patch; existing pinned starter | Keep that fixed starter available and preserve overrides/mandatory obligations. Same ID/version cannot silently acquire different meaning. |
| Missing pinned starter, unknown manifest/config schema or old-reader mismatch | Refuse with exact missing target/version/path and supported migration/restart guidance; preserve old files. No fallback to newest defaults. |
| Intentional minor/template update or renamed target | Compare old base, new base and local overrides; preserve additions/required obligations. Apply only an explicit supported migration/user-approved patch; unresolved conflicts refuse before owned-byte replacement. No automatic general template merger is promised. |
| Provider/source/options-schema change | Fresh validated replacement options, fresh source-scoped execution decision and explained origins; explicit migration only where supported. |
| Paused connected run with still-available admitted context | Resume the same recorded template/config/source/contract identities and candidate/authority context, with current owning checks and a fresh invocation-local admission for executable code. Do not adopt next-start defaults. |
| Paused run whose source/context/host compatibility cannot be restored | Refuse resume with explicit restart/reapproval disposition; retain prior evidence/history. A new run/context is a recorded decision, not silent continuation. |
| Native beta.5/beta.8 origin upgrade | Retain final-plan native preservation/backup/restore acceptance. Unsupported origins refuse preserving data; current readiness metadata is not full restoration. |

Later organization/team/user overlays require scope/migration decisions and pricing. They are not needed for the bounded four-layer model. Effective output is normalized config, selected instances/bindings, executable DAG, mandatory obligations, origins and composition/source/interface identities. CLI and library use the same representation; connected acceptance remains recorded through Kernel.

## 6. Adding a new block

**Extensibility ceiling:** the first slice proves that an established, host-defined experimental receipt capability can accept independently implemented compatible renderers. A new capability needs its owner's input/output/error/authority contract and host adapter. A stateful or asynchronous service also needs lifetime/effect guarantees. No promise that any new manifest becomes executable with one config edit. [read: existing registry/handler seams; inferred]

Step-by-step path after the receipt seam exists:

1. **Classify the need:** reuse an established capability/provider/view where sufficient. A helper or CLI name does not justify another core owner.
2. **Choose the established contract:** implement the receipt ABI/schema/limits and preserve original identity/outcome. If no supported contract fits, obtain an owner-defined host-contract decision and separate estimate first.
3. **Write the small local implementation:** data manifest, self-contained CommonJS entry and focused self-contained fixture. Declare the closed local source set; use host-injected validation and no additional runtime imports. Do not copy private internals.
4. **Describe without executing:** resolve source root/bytes/identity and validate supported fields/schema/options. No entry, fixture, executable schema or install script runs during lint.
5. **Select and compose:** add instance/options and optional node in project config, or explicitly replace a compatible optional handler with fresh options. Reuse the starter's declared receipt input; do not invent a new stage.
6. **Validate obligations:** missing/duplicate/unknown/cyclic/incompatible bindings refuse; protect authority, mandatory edges/evidence/stops and Memory's local floor.
7. **Obtain host admission and bind:** affirmative CLI/binary invocation or trusted library caller decision covers the captured source/purpose. Import only the host-owned snapshot, lower dependencies/wrapper into existing SkillRuntime and clean the owned snapshot at invocation end; no extension setup/dispose lifecycle.
8. **Leave focused evidence:** valid/malformed/private input, output limits/determinism, unchanged input identity/outcome, admission sentinel and incompatible/protected refusals. Conformance execution itself needs consent.
9. **Prove installed substitution:** independently authored renderer one/two work in both starters through clean npm CLI/library and binary routes; consumers/obligations remain unchanged. Source-import tests do not substitute for external file/asset/dependency closure proof. Keep the separate Memory-provider check.
10. **Promote deliberately:** local user code may remain local. A selected first-party public capability needs consumers/export/support status, boundaries, artifact proof and owner; a third-party package follows section 7.

**Tooling:** reuse the scaffold dispatcher, options lint/diff/why owners, Contracts validators, sparse edits and existing conformance/risk lanes. The present `forge new` path scaffolds review adapters and options describes a fixed graph. Proposed action scaffolding and block-aware data-only lint/origins are missing work. Ship the runnable small sample before broad generators; no new catalog/framework is needed. [read: `commands/new.js:3–10`; `adapter-cli.js:56–104`; runtime graph; inferred]

| Addition | Inferred marginal cost after its supported host seam exists | Ceiling / exclusions |
| --- | --- | --- |
| Compatible receipt renderer | **1–2 engineering days**, including valid schema/options and one runnable consumer/conformance check. | Same ABI/mode/lifetime. Host loader/resolver/admission/binary work is separately accounted, not supplied by this estimate. |
| Supported synchronous Memory enricher in an embedding host | **1–2 engineering days** for a compatible provider and its own consumer check. | Existing registry/local-floor contract; no config package loader or async lifecycle. |
| Genuinely new small public capability | Initial **3–7 engineering-day** scenario, to re-estimate after owner/interface/adapter decision. | Not manifest-only admission; include exports, source boundaries, error/limits/docs/artifact consumer. Kernel/harness/setup extraction may be L/XL. |
| Remote, async, stateful or effectful provider | **1–3 weeks or more**, separately scoped. | Authorization, supervision/cancel, privacy, recovery/idempotency and host/version evidence may dominate. |

Costs are unmeasured judgments. A second materially different extension is a later demand/proof condition before advertising general block extensibility; it does not block 0.1.0. The second compatible renderer is the narrower retained substitution check now.

## 7. Public extensions

### Stage discovery, trust and compatibility

| Stage | Exposure / discovery | Admission and support bar | Limit |
| --- | --- | --- | --- |
| **0.1.0 internal** | One artifact, known owner assemblies/providers and two starters; six public entry categories. | Selected installed consumers/boundaries and owning authority/gates. Internal helpers remain private. | No twelve-block extraction/stability claim. |
| **0.1.0 local** | Explicit local manifest selection; compatible receipt implementations; existing embedding-provider injection. No scanning/download. | Data-only discovery, affirmative invocation/caller admission tied to selected source, closed schema/interface, actual npm/binary refusal/execution/substitution cases. | Experimental action/manifest; startup/restart only, ambient privileges, no enforced synchronous deadline; no lifecycle/grant store/installer/sandbox. |
| **0.2 conditional third-party** | Operator separately installs a pinned package and explicitly selects its supported entry. No automatic update/catalog service. | Package/content/dependency identity; host/capability declarations; independent implementation conformance, support owner, migration/refusal and local-to-package consumer case below. | Demand-led experimental scope; no committed date. Effectful/untrusted forms wait for separate boundary proof. |
| **1.0 selected stable contracts** | Selected exports with independent consumers/implementations; curated discovery only with demand/owner. | Per-contract checklist and proved caller/provider compatibility/deprecation/migration windows across promised consumers. | Stability covers named contracts, not all `lib` files or third-party behavior. |

Keep author manifest, resolved composition/source, host admission and observed receipt/result separate; reuse appropriate lock/candidate/config/Kernel records rather than competing authorities. Hashes, signatures, publisher reputation and compatibility declarations answer different questions and do not grant permission to execute.

### First public-entry support inventory — before freezing compatibility

The six categories retain existing baseline work; they are not six new products. The table is a proposed lock inventory, **not existing exports**. Exact names/signatures must be locked with the named installed consumer. Do not claim current source maturity equals published support.

| Proposed selected entry | Minimum installed consumer / supported operation | Error, mode and lifetime contract | Initial support target |
| --- | --- | --- | --- |
| `forge-workflow/contracts` | External packet/receipt validator using shipped schemas/identity APIs | Pure synchronous validation; bounded typed invalid/version diagnostics; no store/effects. | Selected v1 wire/schema behavior compatibility-preserved; source names still need artifact lock. |
| `forge-workflow/flow` | Stateless packet executor/skill host with injected providers | Retain documented synchronous versus controller APIs, result/refusal behavior and owned controller lifetimes; no hidden Kernel initialization. | Selected existing primitives supported; do not stabilize unimplemented provider hosting. |
| `forge-workflow/memory` | Open/append/recall/close default local assembly plus injected enricher check | Kernel-backed local floor, degradation versus authority errors, explicit owned/injected handle cleanup. | Selected core/default assembly supported only after lifetime/artifact proof. |
| `forge-workflow/kernel` | Independent narrow local service/client doing allowed issue/claim/read/acceptance operations | Current lease/revision/authorization refusals; explicit service/store open/close and client scope; private driver/SQL. | New service facade experimental until acceptance lock; no blanket kernel export. |
| `forge-workflow/config` | Pure embedding resolver using supplied inputs and origins, plus CLI equivalence | No import during describe; typed input/binding/policy errors; startup snapshot and validated writer distinct from pure resolution. | New composition/admission data contract experimental; existing legacy readers preserved. |
| `forge-workflow/templates` | External reader/editor resolving both pinned starter definitions | Data-only; exact IDs/versions/targets; typed missing/schema/migration conflict refusal; no runtime lifetime. | Starter/config extension behavior documented for 0.1.z; richer catalog/inheritance experimental/deferred. |

For **each** selected operation, lock export/symbol, signature, error codes, input/output bounds, consumer, host/module support, lifetime/ownership, status and compatibility window. Kernel/config/template maturity differs from current Contracts/Flow/Memory source indexes. A documented `forge-workflow/lib/context-merge` import already exists; inventory documented/downstream deep imports before a restrictive exports map, retain approved compatibility aliases/window or explicitly version the break. Absence of current `exports` is not permission to break consumers silently. [read: `package.json`; `ENHANCED_ONBOARDING.md:448–457`; inferred]

### Later promotion checklist and published-package consumer

Before promoting **each contract**, record and verify:

1. Exact supported export/symbol and independent caller/implementation using no private imports.
2. Input/output, errors/refusals, bounds and synchronous/asynchronous mode.
3. Lifetime, partial failure/disposal/cancellation, availability ceiling and side-effect authority.
4. Caller **and provider** host/interface compatibility window and executable conformance matrix.
5. Config/options/template/manifest migration, ID stability, deprecation and recovery rules.
6. Real package/module/asset/dependency resolution in promised artifacts, plus admission/source identity and support owner.

Exclude future `setup(context, config)` and other vocabulary rows until their own cleanup/failure cases are exercised. A required interface method can preserve caller compatibility while breaking implementers. [external: [OSGi provider/consumer versioning](https://docs.osgi.org/whitepaper/semantic-versioning/040-semantic-versions.html); inferred checklist]

**Future local-to-package case:** move one local receipt implementation into a separately installed pinned third-party package while preserving its capability/options/consumer contract. Prove exact package export, clean dependency resolution, supported CommonJS/module format, source/content identity, affirmative host decision and actionable missing/incompatible-module refusal in npm and supported binary consumers. No automatic dependency installation or arbitrary package format promise. Charge this to conditional third-party admission, not the 0.1.0 delta.

**Primary-source lessons retained:** Cordis names injectable requirements and tracks owned effects; reuse those ideas without adopting a framework or treating cleanup as external reversal. [external: [Cordis registry](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/registry.ts), [owned effects](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/fiber.ts)]. Harness profiles/bundles and compatibility checks inform explicit startup selection, but its code/schema/patch behavior does not establish Forge's data-only preview or an atomic replacement protocol. [external: [Harness boot contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md)]. B3's additional ecosystem comparisons remain attributed research; this revision does not require their latest hook names or adoption statistics. No upstream runtime benchmark was executed.

**Do not promise in 0.1.0:** a generic third-party installer/registry, dependency solver, marketplace/automatic updates, live HMR/reactive services, complete external rollback/exactly-once effects, hostile-code isolation, cancellable synchronous renderer, stable exports for every owner/helper, team/cloud overlay service, arbitrary YAML package loading or automatic contract promotion.

## 8. Capabilities unlocked

All release allocations below are recommendations [inferred], not delivered features. Keep 0.1.0 promises tied to the actual installed consumer and current owner.

| Block → capability | Who benefits | 0.1.0 | Conditional 0.2 / selected 1.0 |
| --- | --- | --- | --- |
| Contracts → portable validation/identity | External agents and library hosts | Shipped selected schemas and useful independent validator | Later schemas as demanded; 1.0 supported wire/migration window. |
| Kernel → one local authority/client | Concurrent agents/team adapters | Narrow allowed service/client; private driver and acceptance checks | Broader broker/team clients with no shadow authority; stable recovery contract. |
| Memory → durable recall/context/enrichment | Users wanting memory without full workflows | Useful local assembly, provenance and synchronous injected-provider check | More demanded enrichers; stable local/provider/upgrade semantics. |
| Flow → stateless/connected execution | Embedders with their own agents | Injected executor/SkillRuntime and owning lifecycle APIs | Demand-led async/controller/provider contracts with real supervision/conformance. |
| Config → selection/bindings/origins | Users and library hosts | One resolver, protected constraints, explicit local admission and source/options replacement | Scoped overlays/richer contracts only with migration/support proof. |
| Templates → editable procedures | Teams adopting selected workflows | Two pinned starters, optional receipt action and compatible replacement | More demanded compositions; stable targeted IDs/update protocol. |
| Policy/evaluators → added diagnostics/requirements | Maintainers | Internal owner with immutable authoritative floor | Selected public diagnostic/evidence seam; stable distinction from admission. |
| Harness/hooks → owned delivery/enforcement | Four supported harness users | Installed-version evidence, projections/links, truthful refusal | Additional certified hosts; documented support/lifetime window. |
| Skills distribution → portable procedure bytes | Users maintaining skills | Canonical bytes/discovery, collisions, preservation and owned links | Demand-led sources/provenance without duplicate edit authority. |
| Review providers → normalized feedback | Review owners | Existing SPI/internal production selection and fixtures | Demand-led config admission; separately authorized effects and conformance. |
| Delivery/monitor → durable handoff | Landing owner/supervising client | Exact-head truth, monitor/resume and guarded merge internally | Public read/monitor contract when another real client needs it. |
| Facade/setup/recovery → first use/repair | Installers/upgraders | Supported routing/doctor/native refusal and restore proof | Narrow demanded install-plan/routing APIs and compatible recovery window. |

The receipt seam adds user-owned presentation and **compatible implementation substitution**; it does not establish an arbitrary new-capability loader or a thirteenth required first-party owner. The second renderer tests substitution within that same seam. A second materially different capability later tests broader extensibility. Package-size accounting and build/CI generation remain private, not extra user capabilities.

## 9. Impact on the final plan

This is a **proposed patch specification** for local v2 `plan.md`, which is not edited. Preserve its candidate, authority, acceptance, native recovery and observation policy. Locations refer to the supplied local plan, not remote implementation.

### Exact changes to scope and decisions

| Location | Proposed addition/replacement/removal |
| --- | --- |
| Bottom line item 4 (`:8`); Target Open blocks (`:45`) | State twelve target responsibility owners as a capped coordination map, selected public Contracts/Flow/Memory/Kernel-service/config/templates and useful independent assemblies. Remove any implication that all twelve are extracted/interchangeable/public at release. |
| Target Templates/Additive config (`:47–48`); Options (`:69–79`) | Retain staged path and two starters; add host-defined experimental receipt seam, data-only resolution, independent execution admission and startup-only compatible replacement. All-public/fine registry are separately priced full-vision alternatives. |
| Acceptance/interface lock (`:91`) | Lock closed action schema/ABI, source/admission scope and cross-consumer route, public operation/status/consumer inventory, recognized legacy-config union, options-replacement and finite update/resume dispositions. Future manifest vocabulary is not executable scope. |
| Public local assemblies (`:103`) | Per-entry export/asset/dependency closure, errors and owned/injected lifetimes; deep-import compatibility inventory before exports restriction. No wholesale integration-directory extraction. |
| Two compositions/one resolver (`:104`) | Rename “Two compositions, one resolver and one experimental local action contract”. Include closed loader/admission, writer transaction, source/options replacement, handler/receipt lowering and both starters. Add second independent compatible renderer and incompatible/admission refusals to the same consumer case. Preserve distinct Memory-provider proof. |
| Controls/harnesses/pruning (`:102–105`) | Preserve existing owners and four-harness installed-version obligations. Map policy/distribution/review/monitor/setup responsibilities without creating extra public/runtime programs. |
| Certification (`:145–159`) | Add data-only/unadmitted sentinel, changed source, CLI/library/binary admission/execution, replacement options, unchanged consumer/outcome, template/resume and adversarial owner checks to existing applicable lanes. Retain all **80 applicable pairs**, risk strata and final observation; no reduction/sub-assertion inflation. |
| Cuts/deferrals (`:175–176`) | Explicitly defer full twelve extraction, generic registry/lifecycle/service solver, effectful/untrusted extensions, broad overlays and automatic template merge. Retain optional-handler replacement as a priced increment; do not silently drop an existing recommended promise. |
| Achievability (`:187–208`) | Use one baseline-plus-delta ledger, actual binary local-import pilot, mapping ceiling and reserved lead review; preserve October 7/14 reforecast. Add conditional slip sensitivity, without promising an upper bound. |
| Value (`:234–235`) | Measure independent API use and compatible renderer/provider substitution with unchanged consumer/obligations. No unmeasured performance/adoption/isolation benefit. |
| Parked-plan reconciliation (`:250,252,270`) | Preserve one artifact and sole authority; narrow support and medium internal ownership are compatible. G2/G3 consumer/config proof includes actual admitted local action, not merely a descriptor. |
| Decision 2 (`:293`) | Replace with the options below; preserve all other fixed owner decisions. |

Proposed replacement:

> **2. Block granularity and first public surface. A — staged medium ownership (default):** twelve internal responsibility owners as a capped coordination map; Contracts/Flow/Memory/Kernel-service/config/templates supported first with per-operation status/consumer/lifetime lock. One host-defined experimental receipt-action contract accepts explicitly admitted compatible local implementations, with a second independent renderer substitution check. Promote another seam only after real consumers and artifact/conformance proof. **B — coarse five:** same bounded outcomes under five groups, accepting broader integration coupling. **C — all twelve extracted/public now:** add caller/provider/lifetime/artifact obligations and replace the forecast. **D — fine registry first:** separately scope micro-block/service/lifecycle resolution. **Default: A.** One package, sole Kernel and intact gates apply to every option.

### Baseline plus delta — assign each acceptance item once

The final plan already prices substantial M–L/high-risk config/assembly work. The following ledger is a **scope allocation to reconcile at the pilot**, not measured baseline capacity. One acceptance item gets one owning task; cross-cutting assertions share existing consumer/security cases.

| Outcome / owner | Reused or baseline work | Marginal revision work / estimate |
| --- | --- | --- |
| Interface lock — contract/config owner | Existing acceptance, wire/API and config lock | Closed action schema, explicit host-admission/source scope and per-entry status inventory: **0.5–1 engineering day** provisionally. Future provider schema/lifecycle excluded. |
| Boundary inventory — package integrator | Existing three source cohorts, public exports/default assemblies, assets/risk/budget/deep-import closure | Twelve responsibility mapping plus selected risky/promised-consumer checks: **1–2 days ceiling**; no per-name descriptors/factories/conformance. |
| Resolver/loader — config/composition owner | Two real starters, genuine local named-node execution, additive preservation/CLI-library equivalence already promised | Closed manifest loader, captured host-owned source snapshot/cleanup, purpose-scoped admission across CLI/library/binary, provenance, source/options and optional-handler replacement/lowering refinements: **1–2 days provisional**. Snapshot loading, binary loading and config replacement are missing implementations, not free reuse; the pilot must price each. |
| Consumer/refusal — assembly/certification owners | Installed public consumers, Memory provider, authority/security/recovery lanes and matrix infrastructure | Second independently authored compatible receipt renderer, incompatible/unadmitted/changed-source/import sentinels and update/resume assertions in existing cases: **0.5–1 day provisional**. No separate certification program. |
| Writer/update/resume — existing config/recovery owners | Baseline additive-config preservation, native beta.5/beta.8 upgrade/restore and recorded-context obligations | Itemize validated atomic writer, intervening-edit refusal and finite template/source/resume behavior as missing baseline tasks. Increment beyond that baseline is **unpriced until pilot**; do not hide it or claim the 3–6-day sum covers new snapshot/merger machinery. |
| **Provisional priced delta** | Baseline implementation/campaign costs remain separate | **3–6 engineering days + 4–8 focused lead review/integration hours**, only if task reconciliation confirms the four priced rows and no additional baseline omissions. |

The four priced ranges add to 3–6; this arithmetic establishes no achievable throughput. No double-charge for existing exports, useful assemblies, two starters, local-node outcome, canonical distribution, process/authority safety, upgrades or observation campaign. Conversely, “reuse the case” does not make integration/execution free. [ran: arithmetic; read: local final plan `:103–104,191–208`; inferred allocations]

At **October 7**, replace the provisional ledger with named tasks/owner and acceptance IDs; separately record worker authoring time, lead review/integration, artifact execution/operator access and elapsed waiting. Run the actual clean binary/local-import/snapshot/admission slice early: adapter fixture `require` is source-pattern evidence while the canonical command registry uses static loaders. Explicitly measure the now-required captured-source loader and cleanup rather than assume its effort. If that work, a binary interpreter, broader module resolution or another host service exceeds the provisional allocation, price it and reforecast; do not absorb it into an unchanged 1–2-day row. The same applies if the validated writer or required native/resume preservation was missing from baseline funding. [read: adapter/registry/writer; inferred]

**Lead capacity:** the illustrative three-hour owner day allocates only **90 minutes** to review/landing. An additional **4–8 hours** occupies **2.7–5.3 review allocations** (`4/1.5`, `8/1.5`, rounded); using all three hours would consume **1.3–2.7 owner days** and displace decisions/coordination. Reserve those review hours and name the displaced baseline work before retaining stretch dates. Shared config/package/contract integration can serialize otherwise disjoint workers; more agents do not remove owner/operator constraints. [read: local plan `:191,208,214`; ran: arithmetic; inferred]

Dependency path: access and interface/admission lock → authoritative/preservation/package foundations → installed public/config/local-action slice → supported breadth/recovery → immutable candidate → complete applicable proof/seven qualifying days → promotion. Stateless Flow can progress without opening Kernel; connected cases depend on current authority. No architecture label or numerical estimate grants capacity or a gate skip.

### Dates

Conditional scenarios use the same **October 1, 2026** start as local v2. They are not accepted deadlines. [read: local plan `:187–221`; inferred]

| Checkpoint | Revision effect |
| --- | --- |
| October 1–5 lock/access | Lock staged ownership, first entry support/status, closed action and independent host admission, recognized legacy config and update/resume dispositions. No registry research program. |
| October 7 pilot/access reforecast | Measure actual baseline/delta, mapping cap, writer/loading feasibility, independent-renderer effort and reserved lead/operator time; demonstrate artifact-to-receipt readiness. |
| October 14 ten-working-day reforecast | Require installed npm/binary admission/config/action/substitution slice and truthful authority/refusal/preservation results before retaining the stretch window. Confirm breadth/access provisioned. |
| October 28–November 11 baseline stretch | Retain only if actual capacity/contingency absorbs all confirmed baseline plus delta work and required proof. |
| November 4–18 slip sensitivity | Five elapsed working days on the critical path shifts the endpoints by one week. Parallel fit may add none; serialized review/access, unpriced loader/writer work or candidate correction may add more. **Not an upper bound.** |
| 0.2 / 1.0 | No committed dates for published admission, broader extraction or registry. Retain v2's additional 8–12-week 1.0 allowance only as an unpriced scenario pending resources/demand. |

Retain all applicable certification strata, native upgrades, four-harness commitments and seven qualifying days on the final candidate. Candidate correction restarts required observation. If cost grows, explicitly reforecast or propose a documented scope decision; never weaken proof or silently substitute fixed toggles for genuine extension.

### Source ledger and verification limits

Tracked paths below refer to the pinned remote; local plans/research are explicitly attributed. This ledger supports current-versus-proposed distinctions, not product completion.

| Evidence | Checked source / use |
| --- | --- |
| Authority/hierarchy | Skeleton `locked-decisions.md:555–599`, refinement `:4–47,126–200`; restructure facade routing `:47–55`; Memory authority provider `:37–59`. |
| Accepted harness direction | Harness archive `research.md:533–570`; supplied audit `:7–8,29–45,174–189`; B1 chronology. |
| Public source cohorts/artifact gap | Complete `package.json`; indexes for Contracts/Flow/Memory; `product-package-boundaries.test.js:13–23,132–183`; documented deep import `ENHANCED_ONBOARDING.md:448–457`. |
| Fixed resolver / legacy settings | `runtime-graph.js:645–752,922–1004`; `memory/router.js:89–114`; `commands/merge.js:6–26,44`; adoption profiles. |
| Writer / upgrade limits | `config-writer.js:44–60,72–126`; `commands/upgrade.js:38–45`; `upgrade-safety.js:224–242`; local final-plan native-origin requirements `:114–128`. |
| Provider/handler / loading seams | Memory backend registry `:85–171`; Flow executor `:205–276`; SkillRuntime `:145–267,317–361`; adapter CLI `:155–181`; command registry `:164–194`. |
| Locality versus execution consent | `forge-lock.js:66–83,116–170`; `AGENT_SKILL_PARITY.md:174`. The inspected paths establish integrity/locality or host-specific limitations, not a universal execution-consent API. |
| Protected/merge floor | `protected-state-authority.js:178–243`; gate-event owner; merge command `:749–795,1368–1419,1462–1464`. |
| Planning inputs | V1, all round-one critiques, B1–B3 and local v2 `plan.md`. Research topology/unit results remain attributed; none is counted as a new release/runtime campaign. |
| External adaptation | Pinned Cordis/Harness and primary OSGi links in sections 5/7; source inspection only. |

No source check proves future loader/admission enforcement, atomic writer behavior, timeout safety, migration/restore, installed subpaths or release readiness. Those remain the named implementation/acceptance obligations.

## 10. Decisions needed

### Open questions for the owner

Choices govern a later plan/implementation contract; this revision grants no implementation, installation, publication or live-operation authority. The admission correction is necessary for the retained trusted-local proposal and requires no new scope decision. Fixed one-package/Kernel/Node/gate/pruning constraints apply throughout.

1. **Granularity/public breadth. A — staged medium (default):** twelve capped responsibility owners, six selected public categories and the bounded local seam. **B — coarse five:** same bounded outcomes under larger groups. **C — all twelve public/extracted:** allocate broader support/integration and replace forecast. **D — fine registry first:** separately scope/runtime-price it. **Default: A.**
2. **First extension. A — experimental receipt action (default):** explicit host admission and two independent compatible renderers prove one seam. **B — synchronous Memory enricher:** cheapest existing embedding seam; explicitly revise the template/local-node acceptance promise. **C — effectful/stateful provider:** add authorization/supervision/recovery and reforecast. **Default: A.**
3. **Config breadth. A — four bounded layers (default):** defaults → pinned starter → project → explicit invocation; protected constraints and fresh replacement options. **B — team/user hierarchy now:** decide scopes/migration and price it. **C — fixed toggles only:** explicitly narrow genuine-extension goals. **Default: A.**
4. **Lifecycle/replacement. A — startup/restart and compatible optional receipt-handler replacement (default):** retain the independent implementation check and price it; no extension setup/dispose or deadline promise. **B — addition only:** explicitly revise replacement scope/cost at lock, preserving all applicable admission/protection proofs. **C — reactive provider replacement:** separately scope in-flight ownership, failure/recovery and host proof. **Default: A.**
5. **Third-party timing. A — trusted local now, pinned published experimental later (default):** require local-to-package and per-contract promotion checklist. **B — published admission in 0.1.0:** add package/trust/module/support work and reforecast. **C — marketplace/automatic updates now:** separately resource continuing distribution/incident-response. **Default: A.**
6. **Effort/date treatment. A — owned October 7/14 reforecast (default):** reconcile baseline/delta omissions, reserve lead review, retain 3–6 days/4–8 hours only provisionally and November 4–18 only as sensitivity. **B — original window:** retain after actual capacity/proof demonstrates fit. **C — broaden architecture first:** resource-load expanded scope and replace the stretch scenario. **Default: A.**

Valid replies are labels in numbered order or a combination. Silence selects **A+A+A+A+A+A**: staged medium, explicitly admitted receipt seam, bounded config, priced startup replacement, later publication and owned reforecast.

### Confidence

**High** in the checked source distinctions, fixed package/authority/gate alignment and the admission contract gap: locality does not establish independent operator consent. **Medium** in the staged ownership, closed action/config/update design: supported paths still require implementation/artifact evidence. **Low** in numerical effort/calendar, broad substitutability, immutable loading, containment, enforced termination or universal recovery; these were not measured or exercised. V2 resolves the blocker in the plan contract and records proof obligations; it does not claim the proposed block system is implemented.
