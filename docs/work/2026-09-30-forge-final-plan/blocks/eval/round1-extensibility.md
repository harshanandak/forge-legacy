Decisions needed: none for this evaluation.

# Round 1 — extensibility and future-proofing

## Bottom line

1. **Verdict: SOUND** — the staged model creates useful extension seams without making a general plugin runtime or premature stable ABI a release prerequisite. [inferred]
2. Definition, instance, capability and implementation identities are separated; this is the right basis for replacing a provider without renaming its consumers. [read: local draft:45–78; inferred]
3. The 12 blocks are responsibility owners, not 12 already interchangeable implementations; the draft states this qualification explicitly. [read: local draft:165–184]
4. Cheap extension is credible for a compatible renderer or existing synchronous provider; a new interface or effectful service still requires host-owned contract work. [read: local draft:266–312; inferred]
5. The receipt action proves one bounded extension point. It does not prove arbitrary new capabilities can be composed solely by adding a manifest. [read: local draft:78–80,266–281; inferred]
6. Cordis service injection and owned disposal are useful foundations, but the draft correctly avoids copying reactive activation or treating disposal as external rollback. [external/read: sources below; inferred]
7. DeepSeek's profiles and bundles inform declarative composition; Forge explicitly chooses additive merging rather than inheriting whole-entry replacement. [external/read: sources below]
8. The manifest is suitable for experimental incubation, not stable publication today; the draft acknowledges this and requires caller and implementer compatibility before stabilization. [read: local draft:66,318–329; inferred]
9. Clarify provider-option replacement, add an independent implementation check, and make future publication exit criteria concrete; these improve the path without blocking the bounded release. [inferred]
10. No blocking contradiction was found in this lens. Source and live GitHub metadata were checked; extension execution, artifact loading, rollback and engineering costs remain unproven. [ran/read: verification ledger; inferred]

## Blocking issues

**None (0).** The deferred general registry, asynchronous provider lifecycle, third-party installer and hostile-code boundary are explicit exclusions, not hidden prerequisites of the proposed pure-action slice. Requiring them now would expand the owner's bounded release rather than correct a plan that is wrong as written. [read: local draft:78–80,121,318–345,399–409; inferred]

This verdict evaluates the architecture and proposed delivery scope. It is not a finding that the block system exists, that arbitrary implementations are substitutable, or that the manifest is ready to freeze. [read: local draft:18,182,444; inferred]

## Assessment through the assigned lens

### Adding blocks and swapping implementations

The important unit is the capability contract, not the number of folders. The draft separates owner, provider, instance and template, then gives Config one effective composition and explicit bindings. A renderer replacement preserves the node's identity, input slot and obligations while changing its handler. This permits consumers to remain unchanged when two implementations satisfy the same supported interface. [read: local draft:45–56,217–233,266–285; inferred]

The reuse foundations are real but narrower than the target. On the checked remote ref, structural boundary rules cover Contracts, Memory and Flow; Memory and Flow may import Contracts but not each other's internals. Memory's registry permits registration and selection of enrichers while refusing replacement/removal of its local floor. Flow injects a synchronous execution function, and SkillRuntime accepts injected node handlers with bounded dependency evidence. These are genuine seams to extend, rather than grounds for inventing a universal container. [read, rung 2: `test/structural/product-package-boundaries.test.js:13–23,132–183`; `lib/memory-core/src/backend-registry.js:85–171`; `lib/flow/src/executor.js:217–276`; `lib/flow/src/skill-runtime.js:159–205,229–259`]

The current resolver clones a fixed graph and applies known configuration sections. It does not establish the proposed manifest-selected action path. The root manifest also has no `main` or `exports` declaration. The draft accurately treats resolver changes, supported npm entries and binary external loading as work still to deliver. [read, rung 2: `lib/core/runtime-graph.js:972–1004`; `package.json`; local draft:39,211–213,301,403–409]

Consequently, there are three different extension costs: adding an implementation of an established contract; introducing a new public capability and its consumer wiring; and adding a service with new lifetime or external-effect guarantees. The draft distinguishes them. Its estimates are judgments, not demonstrated authoring speed, so they should not be used to promise that every future block is a one-binding change. [read: local draft:289–312,409; inferred]

### Cordis and DeepSeek lessons

The adaptation is technically sound. Cordis declares injection requirements separately from plugin implementations, tracks owned effects, and disposes registrations. Forge retains those ownership and dependency ideas while limiting its first admitted extension to a function and startup binding. That does not require Cordis as a runtime dependency. The accepted Forge archive similarly says to use genuine provider boundaries and keep Cordis optional. [external, source inspection/rung 2: [Cordis registry](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/registry.ts#L58-L85), [Cordis effects](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/core/src/fiber.ts#L260-L319); read, rung 2: `docs/work/2026-08-24-agent-harness-architecture/research.md:533–570`; local draft:62–80,115–135]

DeepSeek's loader composes bundle and patch layers; a matching patch replaces an entry's whole configuration. Its preview/schema machinery and reload behavior have distinct limits. Forge's proposed data-only manifest preview, explicit additive map/list operations, field provenance and restart-only updates are deliberate alternatives, not inaccurate claims about what DeepSeek already guarantees. [external, source inspection/rung 2: [DeepSeek boot/layer contract](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/app-boot/README.md#understand-the-implementation); read: local draft:209–235,283–285; inferred]

The draft also correctly distinguishes upstream Cordis HMR, which leaves failed replacement failed, from the inspected Harness implementation, which attempts old-code restoration. Neither warrants a universal rollback claim. Forge's effect table preserves durable Kernel history and requires separate compensation for committed remote effects. Trusted JavaScript retains process privileges; DeepSeek's own safety notice supports keeping composition and containment separate. [external, source inspection/rung 2: [Cordis HMR](https://github.com/cordiverse/cordis/blob/f8ea3cd50f1a5724e8e715995bcde131c9c12b2c/packages/hmr/src/index.ts#L411-L430), [Harness restoration](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/packages/boot/hmr/src/index.ts#L518-L535), [Harness safety](https://github.com/deepseek-ai/deepseek-harness/blob/639ed015397290b3745d163aafe02ffee4aa3f84/SAFETY.md); read: local draft:123–135,335–337]

### Publication and future contract stability

The manifest has sensible separation of schema dialect, implementation version, host range and capability version. Unknown dialects and unsupported requirements fail before code import; operator trust is separate from author metadata and observed evidence. Later third-party packages depend on Forge's selected public contracts, while first-party blocks remain in the one Forge artifact. These choices leave room for later extension without granting another issue/workflow authority. [read: local draft:66–80,318–329; `docs/work/2026-04-28-skeleton-pivot/locked-decisions.md:567–599`; inferred]

The strongest stability provision is the explicit caller-versus-implementer compatibility distinction: a required method can break providers even when callers still work. The draft also requires selected independent implementations, migrations and recovery proof before stable support. That is a reasonable route to publication later. There is not yet enough behavioral or artifact evidence to publish the entire manifest vocabulary as a stable v1 specification. This is acknowledged scope, so it is not a blocker. [read: local draft:62,66,73,318–329,343–345; inferred]

## Non-blocking improvements

1. **Name the exact guarantee proved by the first slice.** At local draft:78,291,301,387, say explicitly: “A host-defined experimental receipt-rendering capability can accept independently implemented compatible renderers.” Creating another capability still requires an owner-defined interface and host adapter. This avoids converting the worked example into a general claim of manifest-only extensibility. The closed subset and named `renderReceipt` ABI already establish this limitation. [read, rung 2: local draft:78–80,266–281; inferred]

2. **Specify what happens to provider-specific options when the source changes.** The recursive map rule and explicit source replacement at local draft:224–229 leave this detail open. For example, replacing a renderer with options `{format, theme}` by one supporting `{format, style}` can inherit an unwanted `theme`; identical keys can also change meaning. State whether a source change requires a complete new options object, an explicit migration, or explicitly compatible inherited options, and emit the chosen operation in origins. Do not silently deep-merge options across implementation identities. This can be fixed at interface lock; the illustrative same-ABI replacement is not thereby unachievable. [read, rung 2: local draft:224–233,279; `lib/config-writer.js:72–84,96–126` shows sparse field operations, not cross-provider migration; inferred failure scenario]

3. **Use a second independently authored renderer as the substitution check.** Extend the existing installed-consumer case, without another certification framework: bind renderer one, replace it with renderer two, and verify unchanged consumers, receipt identity and obligations. Include an incompatible renderer refusal and retain the separate existing Memory-provider check. This tests implementer compatibility more directly than running one sample through two starters. The replacement design already exists; the additional implementation supplies stronger evidence. [read, rung 2: local draft:139–147,270–281,301,387; inferred]

4. **Turn the later stable-publication bar into a per-contract checklist.** When promoting a seam, record its exact supported export, input/output and error behavior, synchronous/asynchronous mode, limits, lifetime, side-effect authority, caller/provider compatibility window, and migration/deprecation rules. Publish only supported portions; exclude future `setup(context, config)` rows until their failure and cleanup semantics are exercised. Local draft:323–329 contains the policy but not an executable compatibility matrix. This is a promotion requirement, not additional 0.1.0 lifecycle scope. [read, rung 2: local draft:62–78,121,323–329; inferred]

5. **Make the local-to-published-package transition an explicit future consumer case.** Preserve the capability and options contract while moving one local implementation into a separately installed package. Prove its package entry, dependency resolution and source/content identity in clean npm and supported binary consumers; declare supported module formats and failure behavior. The present CommonJS example is a bounded starting choice, not evidence that arbitrary package resolution will be cheap. Charge this to conditional third-party admission, not the 0.1.0 pure-action delta. [read, rung 2: local draft:266,301,322,327,409; inferred]

6. **Version externally targeted composition IDs as contracts.** Require migration/refusal guidance when a starter renames a node, binding or capability targeted by project overrides. Pinning a template version helps, but users also depend on the meaning of `receiptFrom`, dependency edges and override targets. Retain mandatory obligations during migration and show which old target failed. The draft already provides the identity and version foundations; this makes their support consequence explicit. [read, rung 2: local draft:47,225–233,243–264,279,323–329; inferred]

## Scores (1–5)

These score the proposed plan, not implementation readiness. [inferred]

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 4 | Reuses actual provider/handler seams and keeps general lifecycle machinery out; external-code loading and binary proof are explicitly unverified. |
| Value | 4 | Adds independent reuse and compatible replacement without broad publication; usefulness beyond receipt presentation still needs consumer demand. |
| Clarity | 4 | Current versus proposed behavior and extension tiers are explicit; provider-option migration and the exact meaning of the first extension proof need sharpening. |
| Risk handling | 4 | Separates trust, authority, compatibility, cleanup and compensation; future host/admission behavior has no runtime proof yet. |
| Alignment with owner constraints | 5 | Preserves one package, sole Kernel authority, additive configuration and protected gates while pricing broader scope separately. |

## Verification ledger and limits

- **Input inspected:** local `blocks/blocks-plan-v1.md` (461 lines); the critic, common and block-common briefs; B1–B3; local final-plan and L2 architecture material. Local planning inputs are proposals, not tracked implementation. [read, rung 2]
- **Remote pin:** refreshed `origin/master` with `git fetch -q origin master`; checked ref **`7d448ec812ef8639790477af07c3c75962173f8a`**. Worktree HEAD is **`ba56b9201782c4d1246c77bde6380867603184bf`**. Product-source claims above use `git show origin/master:<path>`, not the older checkout. [ran: command readback; read, rung 2 for source]
- **Prior work consulted:** the required harness archive, skeleton-pivot documents, product-restructure records, workflow-template guide and roadmap were gathered from remote blobs. Material to this lens was checked against the accepted harness decisions, D44/D45 and current implementation seams cited above; historical separate-package designs were read under the current one-package constraint. [read, rung 2]
- **GitHub checked independently:** through `node bin/forge.js github run -- gh pr view ...` with the required session identity, the [one-package fold](https://github.com/harshanandak/forge/pull/601) is MERGED, with merge commit matching the worktree HEAD; the [parked release plan](https://github.com/harshanandak/forge/pull/564) is OPEN and has no merge timestamp. This verifies PR metadata only, not release or extension behavior. [ran: live GitHub readback, rung 5 for that metadata]
- **External claims checked independently:** pinned Cordis registry/effects/HMR and pinned Harness boot/HMR/safety sources linked above. They establish source behavior at those commits; no upstream runtime experiment was performed. [external/read, rung 2]
- **Not run:** extension implementations, installed-package/binary consumers, hostile-code containment, service replacement/rollback, or an artifact certification campaign. Existing boundary-test source was inspected; its tests were not rerun. No cost or throughput measurements were made. [ran: execution inventory; inferred limits]
- **Scope:** this evaluation writes only the requested report. No product, draft, configuration, Kernel or GitHub state is changed; no commits or pushes are authorized by this brief. [read: critic/common hard limits]

## Open questions for the owner

No new owner decision is required to accept this evaluation. **A — retain the staged medium model and incorporate the non-blocking clarifications (default). B — require generic service/provider composition in the first release, as a separately scoped and re-estimated expansion. Default: A.** These are planning choices, not implementation authorization. [inferred]

## Confidence

**High** that the draft respects the fixed architecture constraints and accurately distinguishes the inspected source seams and Cordis/Harness lessons. **Medium** that its bounded extension path will stay cheap through third-party publication: options migration, independent implementations and artifact loading still need proof. **Low** in numerical effort estimates, universal substitutability or security/recovery guarantees; those were not measured or exercised. [read/external/inferred as cited above]

BLOCKING: 0
