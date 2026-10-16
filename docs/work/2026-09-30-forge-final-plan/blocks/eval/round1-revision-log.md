# Round 1 — blocks revision log

## Bottom line

1. **Decisions needed: none to perform this revision.** The draft retains the staged-medium planning defaults; section 10 records later owner choices. [inferred]
2. **Input → output:** `blocks-plan-v1.md` → `blocks-plan-v2.md`; `plan.md` remains a supplied input and proposed-patch target. [read]
3. **Coverage:** all three critiques are reconciled: one safety blocker and 18 non-blocking improvements, **19 numbered items total**. [ran: item enumeration]
4. **Disposition:** all 19 are **ACCEPTED**, with scope/estimate qualifications stated item by item below; none is silently dropped. [read: revision ledger]
5. **Blocker corrected in the plan:** execution requires independent, purpose-scoped CLI/library/binary admission before importing captured source. Locality, YAML and lock metadata cannot consent. [read/inferred]
6. **Loaded-source identity is concrete:** one self-contained CommonJS action plus optional fixture is captured into a host-owned snapshot; no hash-then-project-path import. Snapshot lifecycle/loading is missing work, not executed proof. [inferred]
7. **Extensibility is bounded:** compatible renderers implement one host-defined experimental capability; unrelated capabilities and services need their own host contracts and estimates. [read/inferred]
8. **Compatibility refinements:** fresh implementation-specific options, pinned composition IDs, update/resume dispositions, legacy-reader union and per-entry support/promotion checklists. [inferred]
9. **Cost remains provisional:** baseline/delta tasks must be assigned once; 3–6 engineering days plus 4–8 lead hours is not verified capacity and does not hide unpriced baseline omissions. [inferred; ran: arithmetic]
10. **Limits:** ten synthesis sections preserved; only the requested draft and this log are written. No product/runtime, installed-artifact or release campaign is claimed. [read/ran]

## Inputs, evidence and revision scope

Read `(local scratch)`, `common.md`, `blocks-common.md`, `blocks-synthesize.md`, the current draft and the complete three round-one critiques. B1–B3 were used as research inputs and fully read in the bounded research crosscheck; relevant current claims were checked against tracked remote blobs. The supplied final v2 `plan.md` remains local planning material. The round's critiques are under `blocks/eval/`, as specified by the user; the generic directory in `revise.md` is overridden by that exact task line.

`origin/master` was refreshed and checked at **`7d448ec812ef8639790477af07c3c75962173f8a`**. Source labels `[read]` and primary `[external]` are rung 2; `[ran]` applies only to named executed reads/calculations or artifact readback; `[inferred]` marks design, predicted failure and unmeasured cost. Critic/research execution results are attributed rather than promoted to new revision measurements. No new exploit, extension, timeout, package install, binary loader, native migration, live harness or release validation was run.

The user authorized exactly two outputs. No other edits, commits, pushes, GitHub writes or Kernel mutations are part of this revision. An approved planning artifact satisfies the bounded revision authority; a full fresh `/plan` workflow or implementation stage is not inferred.

## Safety, authority and compatibility — round1-safety-authority.md

### Blocking item 1 — executable admission has no concrete cross-consumer consent

**ACCEPTED.** The inspected `forge-lock.js:66–83,116–174` checks containment/hash and classifies an in-project file as trusted; it does not obtain an operator execution decision. `AGENT_SKILL_PARITY.md:173–174` describes host-specific project-trust limitations, not a shared standalone library/CLI grant. The predicted import-time side-effect case is valid as a missing plan contract, not a reproduced shipped vulnerability. [read/inferred]

**Changed:** v2 section 3, “Host execution admission”, and sections 5–7 replace the vague existing-project/session-trust path with data-only discovery, a closed captured source set, explicit invocation-local `activate` or `conformance` consent and shared CLI/library/binary semantics. The decision covers source fingerprint and composition/options identity. `activate` permits rendering within that fixed invocation; it cannot silently authorize a conformance fixture. `conformance` permits action/fixture only for the check, with action/validator injected into the self-contained fixture. Missing/mismatched/wrong-purpose consent refuses before either import; YAML, environment defaults, author metadata and locality cannot grant it. Library decisions come from the trusted caller, never project data. Native harness trust is reusable only through a verified scoped integration.

**Verification refinement:** independent review rejected immediate hashing followed by project-path `require` as sufficient loaded-source identity because the bytes can change between check and read. V2 instead loads a unique host-owned snapshot of the captured manifest/inline schema and self-contained action/optional fixture, with no additional local or package runtime loads in the supported profile. Only owned snapshot files are cleaned at invocation end/failure; provenance/history survive. Same-user tampering and ambient privileges remain outside containment claims. This is a loader requirement, not a persistent grant store or sandbox. [inferred]

**Proof obligations:** unadmitted describe/lint and activation/fixture sentinels; wrong-purpose refusal; actual CLI/library/binary admitted execution; changed selection/source refusal; mutate original bytes after capture and prove snapshot-only loading; supported-profile dependency/real-path refusal and cleanup; preserved authority/protected/merge checks. These cases are proposed, not run. Snapshot loading is explicitly priced/reforecast in section 9 rather than assumed free.

### Non-blocking item 1 — finite update/resume disposition table

**ACCEPTED.** V2 section 5 now specifies fixed pinned starter data, compatible patch availability, unknown/unavailable template/schema/legacy-reader refusal, intentional minor/target migration, source/options change and paused-run behavior. Existing admitted composition/source/host/authority context must be restored with fresh invocation-local executable admission, or resume refuses with restart/reapproval guidance. Old evidence/history and user additions survive. A renamed external node/binding/`receiptFrom` target is an explicit compatibility change.

**Basis:** local final `plan.md:114–128` requires native beta.5/beta.8 preservation; `commands/upgrade.js:38–45` and `upgrade-safety.js:224–242` establish readiness limits, not implemented full backup/restore. V2 retains those native origins/refusal obligations and explicitly avoids an automatic general template merger. [read/inferred]

### Non-blocking item 2 — recognized legacy-config union and writer protocol

**ACCEPTED.** V2 section 5 requires a whole-product recognized-key/reader inventory before strict unknown-key validation, explicitly including `merge.auto`, Memory selectors and unmigrated valid settings. Migrated ordinary selectors preserve explicit input > environment > project precedence; executable consent has no environment/project fallback.

**Basis/change:** `commands/merge.js:6–26,44` consumes `merge.auto`; `memory/router.js:89–114` establishes selector precedence. The research crosscheck also identifies issue/sync backend readers and generated template/classification/rail metadata; v2 requires explicit keep/migrate/retire dispositions without reviving retired Beads behavior. `config-writer.js:43–59` directly writes bytes, while `:72–126` provides sparse sibling-preserving edits. V2 therefore labels full validation-before-commit, atomic/platform-safe replacement, readback and intervening-edit refusal as missing implementation, allocated to existing config/preservation work. Sparse map editing is not crash/concurrency proof. [read/inferred]

### Non-blocking item 3 — explicit adversarial mapping

**ACCEPTED.** V2 section 3 maps renderer PASS versus input FAIL/INCOMPLETE, evaluator approval minting, layer removal of required edges/floors/stops, stale/consumed actor/head/content authorization and favorable custom merge predicates to their current owners. Snapshot admission has its own refusal case. Existing composition/security/merge lanes carry these assertions.

**Basis:** inspected protected-state admission (`protected-state-authority.js:178–243`), locked graph handling (`runtime-graph.js:645–718`) and mandatory merge checks before/configured rules plus fresh-state/ownership/gate/head rechecks (`commands/merge.js:749–795,1307–1433,1460–1469`). The table is an implementation obligation, not a new executed bypass-resistance claim. [read/inferred]

### Non-blocking item 4 — pure in-process action availability ceiling

**ACCEPTED.** V2 sections 3, 5 and 7 state that synchronous import/render can block the event loop without an enforced deadline or cancellation. Bounds on input/output do not imply wall-clock termination. Release language must describe a trusted presentation seam; required enforced termination/untrusted execution waits for a separately scoped execution boundary.

**Basis:** SkillRuntime bounds data (`:23–49`) but invokes handlers through ordinary `await` (`:75–91,177–207`). A synchronous loop can prevent an async deadline from progressing. This is source-derived reasoning; no timeout experiment was run. [read/inferred]

### Non-blocking item 5 — source-to-shipped distinction

**ACCEPTED.** V2 sections 2, 4, 6, 7 and 9 retain twelve as a target map, current three-cohort enforcement, the missing exports/local-loader paths, and actual installed npm/binary consumer/asset/dependency proof. Host selection/descriptor/source imports do not establish compiled-artifact external-code loading.

**Basis:** complete remote `package.json`, `runtime-graph.js:972–1004`, source boundary tests and loader seams. No installed/public entry is called delivered. [read/inferred]

## Extensibility and future-proofing — round1-extensibility.md

### Non-blocking item 1 — exact first-slice guarantee

**ACCEPTED.** V2 bottom line and sections 3, 6, 8 and 9 now say that a **host-defined experimental receipt capability accepts independently implemented compatible renderers**. Config cannot define the host interface or admit an unrelated capability/service. The first-party host contract/adapter must exist before local implementations use it.

**Basis:** the v1 closed manifest subset and renderer ABI plus current Flow/Memory seams. This resolves ambiguity without adding a general registry. [read/inferred]

### Non-blocking item 2 — implementation-specific options on source change

**ACCEPTED.** V2 section 5 requires complete replacement options on source/implementation or schema identity change. Old explicit options are discarded; new schema/defaults validate the new object. `config: {}` adopts new defaults, never old provider options. Origins expose source/options replacement and dropped keys. Explicit migration is a later supported operation, not silent deep merging.

**Basis:** ordinary sparse edits (`config-writer.js:72–126`) do not provide cross-provider option migration. The critique's `theme` → `style` scenario is handled explicitly even when identical keys change meaning. [read/inferred]

### Non-blocking item 3 — second independently authored renderer

**ACCEPTED.** V2 sections 5–6 and 9 retain compatible startup replacement and add a second independent implementation to the existing installed-consumer case: unchanged consumer/node/receipt identity/outcome/obligations, fresh options/admission and incompatible implementation refusal. The separate existing synchronous Memory-provider check remains.

**Scope/cost qualification:** this is one renderer capability with two implementations, not a second generic block contract or certification program. Config replacement and authoring/integration of the second implementation are explicit delta items, not free consequences of handler injection. Actual effort must be measured at the pilot. [read/inferred]

### Non-blocking item 4 — per-contract stable-publication checklist

**ACCEPTED.** V2 section 7 adds export/symbol, caller/implementer, inputs/outputs/errors/limits, sync/async mode, lifetime/failure/cancellation, effects/authority, compatibility window, migration/deprecation, artifact closure and owner requirements. Future setup/dispose vocabulary cannot be stabilized before its own proof.

**Basis:** current contract/lifecycle distinctions and primary OSGi caller-versus-provider versioning guidance, checked as source. This is a promotion bar, not extra generic lifecycle scope for 0.1.0. [read/external/inferred]

### Non-blocking item 5 — local-to-published-package transition case

**ACCEPTED.** V2 section 7 requires a later real consumer moving one local implementation to a pinned separately installed package while keeping capability/options/consumer behavior. Check package export/module format/dependencies/content identity, affirmative admission and missing/incompatible-module diagnostics in clean npm and supported binary consumers.

**Qualification:** charged to conditional third-party admission, not the 0.1.0 pure-action delta; no claim arbitrary npm resolution or package formats are cheap/supported now. [inferred]

### Non-blocking item 6 — composition IDs are versioned contracts

**ACCEPTED.** V2 sections 3, 5 and 7 explicitly protect template identity and externally targeted node/binding/capability/`receiptFrom` semantics. Renamed targets require explicit migration/refusal with the old target identified, preserving local additions and mandatory obligations. Version strings alone do not prove the update path.

**Basis:** v1 identity/layer foundations and the retained native/config preservation requirements. No general automatic migration engine is added. [read/inferred]

## Cost and scope — round1-cost-scope.md

### Non-blocking item 1 — twelve-owner map as a capped coordination aid

**ACCEPTED.** V2 section 4 states the count is a responsibility judgment, not an import-graph optimum or interchangeable-module count. Keep the mapping/selected-check slice within the provisional 1–2-day allocation; descriptors/factories/stable interfaces/conformance are required only for a promised consumer or risky boundary. Untouched internal names get no runtime/API program.

**Basis:** structural boundary rules cover three cohorts (`product-package-boundaries.test.js:13–23,132–183`). Cap overrun triggers honest task reforecast, never weaker checks or release certification. [read/inferred]

### Non-blocking item 2 — supported schema separate from future vocabulary

**ACCEPTED.** V2 section 3 separates a future design-vocabulary table from the closed proposed 0.1.0 fields/values/refusals, including supported capability, data schema, source closure and no lifecycle/effect authority. Unknown claims/validators refuse before import. Reuse existing validators and ship a small sample before broad scaffolding.

**Qualification:** the schema is proposed; it is not called already implemented. No general schema engine, service solver or provider host is included. [read/inferred]

### Non-blocking item 3 — actual extensibility ceiling beside adding cost

**ACCEPTED.** V2 section 6 narrows the 1–2-day estimate to a compatible receipt implementation or already-supported synchronous Memory provider in an embedding host. A genuinely new capability requires host-owned interface/adapter work and its own estimate; stateful/async/effectful admission is separate. Broader extensibility needs a later materially different extension.

**Qualification:** the second renderer supplies same-contract substitution evidence now. A second materially different capability is demand-led later and does not become another 0.1.0 prerequisite. All ranges remain unmeasured. [read/inferred]

### Non-blocking item 4 — startup replacement is an explicit increment

**ACCEPTED.** V2 retains replacement because this revision now requires a real second compatible renderer substitution case; section 5 specifies fresh options/consent and preserved target/input/obligations. Section 9 separately allocates missing config replacement/lowering and consumer integration work. SkillRuntime handler injection does not implement the config transaction.

**Alternative retained:** section 10 offers addition-only as an explicit later scope/cost revision; it is not silently adopted. No existing recommended replacement promise is dropped by this revision. [read: SkillRuntime `:60–73,335–361`; inferred]

### Non-blocking item 5 — public-entry status and installed consumers

**ACCEPTED.** V2 section 7 adds a six-entry inventory with proposed exports, named installed consumers/operations, error/mode/lifetime expectations and support status. Existing source Contracts/Flow/Memory maturity is distinguished from new Kernel/config/template contracts. Each operation must be locked before compatibility promises are frozen.

**Basis:** no current `main`/`exports`; `ENHANCED_ONBOARDING.md:448–457` documents `forge-workflow/lib/context-merge`. V2 preserves deep-import inventory/compatibility-window work before restrictive exports, rather than treating it as a cheap standalone map edit. [read/inferred]

### Non-blocking item 6 — one baseline-plus-delta pilot ledger

**ACCEPTED.** V2 section 9 assigns acceptance outcomes once to existing contract/config/package/consumer/recovery owners, separating reused baseline, missing implementation and marginal work. It records authoring, lead review, artifact/operator execution and waiting separately at October 7. Binary/local-import/snapshot/admission proof is an early pilot, not an assumption derived from fixture replay.

**Arithmetic/qualification:** the four priced rows sum to 3–6 days. Actual baseline funding/capacity and the now-required snapshot loader/cleanup remain unverified. Validated writer/update/native/resume gaps are itemized, and increments beyond funded baseline are explicitly unpriced pending pilot. If these exceed the allocation, replace the estimate/forecast; do not preserve a misleading 3–6-day total or double-charge baseline outcomes. [ran: range sum; read: final-plan resolver/assembly and loader/registry source; inferred]

### Non-blocking item 7 — resource-load lead review hours

**ACCEPTED.** V2 section 9 reserves lead review separately from worker-days. Against the illustrative 90-minute review/landing allocation, 4–8 hours consumes 2.7–5.3 allocations (`4/1.5`, `8/1.5`); using the whole three-hour owner day is 1.3–2.7 days and displaces coordination/decisions. Name displaced baseline work and serialized package/config/contract integration before retaining dates.

**Basis:** local final `plan.md:191,208,214`; arithmetic checked, capacity not measured. October 7/14 and the five-working-day November 4–18 sensitivity remain conditional; no upper bound or reduced certification follows. [read/ran/inferred]

## Other critique content retained and verification boundary

The extensibility and cost critiques' **SOUND / zero-blocker** verdicts are lens-specific judgments, not implementation approval or capacity evidence. The safety **NEEDS-REVISION / one-blocker** verdict motivated the admission correction. Their supporting assessments—fixed package/authority/gates, independent capability identity, owned-versus-external effects, Cordis/Harness adaptation, experimental compatibility and installed-artifact limits—are retained across v2, with the numbered items above covering every requested change. Scores are not recomputed, averaged or presented as new measurements.

The revision uses primary pinned Cordis/Harness sources for capability/effect/layer lessons and primary OSGi versioning guidance. B3's broader ecosystem findings remain attributed research; no new marketplace, reactive registry, installer, hostile-code process boundary or universal rollback scope is smuggled in. Twelve full extractions and the fine-registry scenarios remain separately scoped, unmeasured alternatives.

Final document checks cover exactly ten numbered `##` synthesis sections, the ten-item opening, parseable JSON/YAML examples, all 19 ACCEPTED dispositions and readback of both requested files. They establish document integrity and critique coverage only. The block/admission/config system is still proposed; required installed/runtime/recovery proof remains in v2.

## Open questions for the owner

No additional answer is needed for this requested revision. **A — retain the v2 staged-medium planning defaults (default). B — choose one of v2 section 10's explicitly scoped alternatives and reforecast the affected outcomes. Default: A.** These labels select planning direction, not implementation or publication authority.

## Confidence

**High** in critique coverage, the locality-versus-consent gap and inspected current source distinctions. **Medium** in the small closed admission/config/promotion design, which still needs artifact and lifecycle proof. **Low** in cost/calendar and any broader substitution, containment, termination or restoration guarantee: none was measured or run here. The blocker is corrected in the draft contract; no product implementation is certified by this revision.
