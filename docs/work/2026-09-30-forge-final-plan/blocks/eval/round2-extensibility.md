Decisions needed: none for this evaluation.

# Round 2 — extensibility and future-proofing

## Bottom line

1. **Verdict: SOUND** — v2 provides a bounded implementation-substitution path and a credible route to later publication without making a general plugin host a release prerequisite. [inferred]
2. The twelve owners are a responsibility map, not twelve public or interchangeable modules; the draft now caps mapping work and ties promotion to actual consumers. [read: draft:173–192]
3. Adding a compatible receipt renderer can avoid Forge source changes once the host seam exists; adding a new capability still requires an owner-defined interface and host adapter. [read: draft:308–334; inferred]
4. Replacement preserves the consumer node, receipt source, edges and obligations while supplying fresh options and fresh execution admission. [read: draft:271–290]
5. All six round-one extensibility suggestions are addressed in the draft itself, including independent implementations, options replacement and versioned override targets. [read: comparison below]
6. Cordis's named dependencies and owned effects inform the design without introducing Cordis as a dependency or promising that disposal reverses durable or remote changes. [read/external: sources below; inferred]
7. Harness profiles inform declarative composition; Forge deliberately specifies additive layers, import-free preview and startup replacement rather than inheriting Harness's patch/reload limits. [read/external: sources below]
8. The closed CommonJS profile is an experimental pilot, not the future universal block contract; a separately priced local-to-package case tests that transition. [read: draft:72–85,338–377]
9. The publication checklist is sufficient direction for later stabilization, but exact signatures, failure behavior and compatibility cases still need interface lock and artifact evidence. [read: draft:349–375; inferred]
10. No extensibility blocker was found. Current source and live GitHub metadata were checked independently; extension execution, binary loading, lifecycle recovery and cheap authoring remain unmeasured. [ran/read: verification ledger; inferred]

## Blocking issues

**None (0).** Under the critic's threshold, the remaining unknowns do not make this bounded plan wrong, unachievable or harmful as written. The draft identifies the missing resolver, loader, admission, writer and installed-consumer work, keeps its estimates provisional, and excludes generic services, reactive replacement and untrusted execution from the first slice. Demanding those excluded systems now would expand the scope rather than repair a contradiction. [read: draft:128–142,154,215,236,290,310,381,429–444; inferred]

This verdict concerns the proposed architecture and its stated limits. It does not certify implementation readiness, arbitrary provider interchangeability, stable manifest publication or enforced containment. [read: draft:18,60,76,482,501; inferred]

## Evidence convention

“Draft” means the supplied local [blocks-plan-v2.md](/docs/work/2026-09-30-forge-final-plan/blocks/blocks-plan-v2.md:1), not tracked product behavior. Product-source references below were inspected with `git show origin/master:<path>` at `7d448ec812ef8639790477af07c3c75962173f8a`. `[read]` and `[external]` mean rung 2 source inspection; `[ran]` identifies an executed command or readback; `[inferred]` identifies a design judgment. Live GitHub readbacks are rung 5 for that metadata only. Research-leg results are supporting material, not tests executed by this critic.

## Assessment through the assigned lens

### Adding capabilities and replacing implementations

The useful boundary is a capability contract with an owner, not another folder or manifest. V2 separates definition, instance, capability, implementation, host and template identities, and uses one resolver to select bindings. That gives a future provider room to change without changing consumers of its interface. It also avoids requiring every helper, skill or CLI verb to have a public ABI or lifecycle. [read: draft:43–70,175–192; inferred]

The inspected reuse foundations support that direction. The structural rules cover Contracts, Memory and Flow and permit Memory/Flow to depend on Contracts through its entry. Memory's registry supports selecting enrichers while refusing replacement or removal of the local floor. Its operations are synchronous. Flow injects a synchronous `run`; SkillRuntime invokes handlers by node ID and passes bounded dependency evidence. These are real seams, with different contracts, rather than evidence of a generic service container. [read, rung 2: `test/structural/product-package-boundaries.test.js:13–23,132–183`; `lib/memory-core/src/backend-registry.js:3–5,40–63,85–171`; `lib/flow/src/executor.js:217–276`; `lib/flow/src/skill-runtime.js:177–206,230–259`]

V2's replacement rule is substantially clearer than v1: it preserves the node and obligations, discards implementation-specific old options, validates the replacement's defaults/options, and obtains a new source-scoped decision before import. Two independently authored compatible renderers and an incompatible-renderer refusal test provider substitution without another framework. Preserving targeted template IDs and refusing unavailable resumed context also prevents an upgrade from quietly changing an existing consumer's meaning. [read: draft:229–234,288,294–303,322; inferred]

There are still three cost classes: implementing an established interface; defining a new capability and host adapter; and admitting async/stateful/effectful providers. The draft explicitly separates them and does not claim a new manifest alone creates executable functionality. Its “cheap” path is therefore plausible only after the relevant seam exists; the numerical authoring estimates are not measured results. [read: draft:310–334; inferred]

Current source does not deliver the proposed composition host. The resolver clones a fixed graph and applies known settings; the inspected root manifest has neither `main` nor `exports`. The writer preserves sibling fields but directly writes YAML. V2 correctly retains public-entry closure, handler lowering, source snapshots and validated writer behavior as implementation obligations. [read, rung 2: `lib/core/runtime-graph.js:972–1004`; complete `package.json`; `lib/config-writer.js:44–60,72–126`; draft:35–37,215,236,435–444]

### Cordis and DeepSeek lessons without their limits

The earlier accepted research chose Forge-native lifecycle/capability semantics with Cordis optional. It also rejected making every module a plugin and treating external writes as reversible registrations. V2 follows that direction by deferring generic lifecycle hosting while retaining explicit ownership, readiness, partial-failure and cleanup obligations for any later provider form. This is staged adoption of the accepted direction, not a claim those semantics are already implemented. [read, rung 2: `docs/work/2026-08-24-agent-harness-architecture/research.md:533–570`; `2026-09-12-user-supplied-architecture-audit.md:29–45` in the same folder; draft:67–70,140–152,375; inferred]

Cordis's inspected plugin contract declares injection/provision metadata, and its effect mechanism collects disposers. Those mechanisms support named service dependencies and owned cleanup; they do not establish remote compensation. Forge's separate recovery obligations for registrations, files, child processes, Kernel mutations and remote commits are the correct adaptation. [external, rung 2: [Cordis registry](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/registry.ts#L58-L85), [Cordis effects](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/fiber.ts#L260-L319); read: draft:146–154; inferred]

Harness profiles select compositions from bundles and patch layers; matching patches replace an entry's whole configuration. Its schema inspection can execute trusted module code, and later configuration reload does not provide whole-update rollback. V2 deliberately defines four additive layers, data-only preview, a protected floor and startup-only replacement. It borrows the composition idea without adopting those limitations as Forge's guarantees. Adoption settings also remain distinct from workflow selection. [external, rung 2: [Harness profile, patch and reload contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#profiles); read: draft:213–236,288,306; local final `plan.md:53`; inferred]

The deliberately restricted action slice does not exercise reactive service withdrawal, async draining or transactional service replacement. That is an acknowledged evidence ceiling, not a defect requiring a registry now. A later materially different capability must prove broader extensibility before Forge advertises it. [read: draft:142,198,290,334,402; inferred]

### Third-party admission and stable publication

The self-contained CommonJS profile keeps the pilot's source identity and loading problem bounded, but excludes ordinary multi-file/dependency-bearing packages. V2 states this restriction and adds a later pinned-package consumer case covering exports, module format, dependencies, content identity, admission and binary loading. It does not assume that a local snapshot loader is already a general npm loader. This preserves a route forward without promising third-party admission in 0.1.0. [read: draft:78–85,343–344,377; inferred]

The experimental dialect, per-entry support inventory and per-contract promotion checklist are sound publication policy. They require signatures, errors, bounds, ownership, compatibility windows, migrations, artifact closure and independent implementations. They also protect documented deep imports before sealing exports. The caller/provider distinction matters: an API addition can remain usable by existing callers while requiring old implementations to change. [read: draft:76,349–375; external, rung 2: [OSGi consumer/provider compatibility](https://docs.osgi.org/whitepaper/semantic-versioning/040-semantic-versions.html); inferred]

The contract is ready to be specified and tested as an experimental seam after interface lock. It is not ready today to publish the entire future vocabulary as stable v1. V2 explicitly excludes unproved `setup`/disposal forms, broad module support and automatic promotion; publication later is conditional on evidence, rather than a version-number promise. [read: draft:60–70,345,362–381; inferred]

## Round-one extensibility dispositions

Each prior suggestion was checked against v2, rather than accepted from the revision log alone. These are plan-level dispositions; implementation evidence remains pending. [read: `eval/round1-extensibility.md`, `eval/round1-revision-log.md:66–102`, and draft ranges below]

| Round-one suggestion | V2 disposition |
| --- | --- |
| Name the first slice's exact guarantee | Addressed: host-defined compatible receipt implementations; new capabilities require host contracts (`:8,310–334,402`). |
| Replace provider-specific options deliberately | Addressed: complete replacement options, new defaults, dropped-key origins and no cross-identity merge (`:229–234,301`). |
| Use an independent second renderer | Addressed: unchanged consumers/outcomes/obligations and incompatible refusal in the installed-consumer case (`:288,322,438`). |
| Make stable-publication criteria concrete | Addressed: per-operation inventory and per-contract checklist, including provider compatibility (`:349–375`). |
| Prove local-to-published-package transition later | Addressed: explicit conditional package/module/dependency/admission consumer case (`:377`). |
| Version externally targeted composition IDs | Addressed: pinned starter meanings, override targets and explicit migration/resume refusal (`:294–303`). |

## Non-blocking improvements

1. **Make the receipt ABI executable at interface lock.** At draft:267–269, lock the exact CommonJS export shape, host validator arguments/result, permitted receipt dialects, content/media-type bounds and failure mapping. Fold Promise/thenable output, malformed output and a thrown renderer into the existing conformance case. Two implementations can otherwise interpret the function name and “throws a render/validation error” differently. The draft already requires this lock; this is a concrete completion of it, not a new framework. [read, rung 2: draft:267–269,362,368–369; `lib/flow/src/skill-runtime.js:197–205,230–259`; inferred]

2. **Check two instances of one definition with distinct options.** The identity model separates definitions and instances, but the highlighted substitution check uses two different implementations. Add a small interleaved instance case to the existing consumer check: the same definition serves two nodes with different valid options, with unchanged bindings, input receipts and results. Document whether duplicate-definition refusal means conflicting definition records rather than legitimate reuse by multiple instances. This catches accidental shared option state without adding lifecycle hosting or promising enforced purity. [read, rung 2: draft:45,77,128,224,267–288,322; inferred]

3. **Turn later versioning policy into a few compatibility outcomes.** Before stable promotion, specify host-patch/old-provider acceptance, compatible optional contract addition, required provider-contract change, and unknown manifest dialect refusal. Keep behavior changes distinct from source-fingerprint changes that require new execution admission. The current closed pilot remains valid; these examples would make the existing caller/provider windows and schema-migration checklist harder to misinterpret when another contract is promoted. [read, rung 2: draft:45,64–70,76–77,122,130,294–303,371–375; external: OSGi source above; inferred]

## Scores (1–5)

Scores assess the proposed plan, not shipped readiness. [inferred]

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 4 | Existing seams and explicit scope help; captured-source/binary loading and writer work still need the pilot and owned estimates. |
| Value | 4 | Independent use and compatible substitution are useful; broader capability demand and cheap publication are not yet demonstrated. |
| Clarity | 5 | Experimental vocabulary, current source, replacement semantics, future publication and unmeasured cost are distinguished explicitly. |
| Risk handling | 4 | Admission, options, targeted IDs and resume are specified; implementation and artifact evidence remain pending. |
| Alignment with owner constraints | 5 | One first-party package, sole Kernel authority, separate additive config and intact owning gates remain fixed. |

## Verification ledger and limits

- **Inputs:** read the critic/common/block-common briefs and the supplied v2 draft; consulted round-one extensibility/revision records, B1–B3, local final-plan and L2 architecture material. Inspected relevant remote excerpts from the requested harness archive, skeleton-pivot and product-restructure records, workflow guide and roadmap. [read, rung 2]
- **Current remote:** independently read GitHub's master branch through `node bin/forge.js github run -- gh api repos/harshanandak/forge/branches/master` under `FORGE_SESSION_ID=delivery-train-20260928a`; its head matches `origin/master` and the draft's source pin (`7d448ec812ef8639790477af07c3c75962173f8a`). [ran, live metadata/rung 5]
- **One-package fold:** independently read [PR #601](https://github.com/harshanandak/forge/pull/601); it is MERGED with merge commit `ba56b9201782c4d1246c77bde6380867603184bf`. This verifies the merge record, not public API or extension delivery. [ran, live metadata/rung 5]
- **Primary external checks:** independently inspected pinned Cordis registry/effect source, pinned Harness boot/profile documentation and OSGi versioning guidance linked above. No upstream runtime was exercised. [external, rung 2]
- **Not run:** provider implementations, installed npm/binary consumers, loader/admission sentinels, instance substitution, lifecycle recovery, a certification campaign or cost benchmarks. Structural test source was read; tests were not rerun. [ran: execution inventory]
- **Write scope:** only this requested evaluation file is authorized. No draft/product/config edits, commits, pushes, GitHub writes or Kernel mutations were performed. [read: common hard limits; ran: action inventory]

## Open questions for the owner

No new decision is required by this lens. **A — retain v2's staged model and settle the three refinements at their existing lock/promotion checkpoints (default). B — require generic services or published third-party admission in 0.1.0, as a separately scoped and re-estimated expansion. Default: A.** These are planning choices, not implementation authorization. [inferred]

## Confidence

**High** in the source distinctions, round-one dispositions and adaptation of the checked Cordis/Harness mechanisms. **Medium** that the bounded design can remain inexpensive through later package admission: the published-package, instance and compatibility cases still require proof. **Low** in the effort figures or general substitutability/recovery claims; neither was measured here. [read/external/inferred as cited above]

BLOCKING: 0
