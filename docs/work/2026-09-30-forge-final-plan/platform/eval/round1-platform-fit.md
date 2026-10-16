# Bottom line

1. **Decisions needed:** none to complete this critique; repair the missing hosted-solution architecture before approving the draft. [inferred]
2. **Verdict: NEEDS-REVISION** — the platform design is substantially aligned, but does not carry the owner's explicit hosted-solution requirement through its target architecture. [read: north-star.md:17; inferred]
3. Outside authors are first-class in the proposed 0.1.0: new namespaced capabilities, independently packaged code, discovery, admission, versioning and public-docs-only release proof are required. [read: draft:78–96,414–418]
4. Forge's delivery workflow is explicitly a reference composition over the same compiler/runtime; the non-delivery advisor provides a useful counterexample to a mandatory stage ladder. [read: draft:299–313]
5. Config is a real product surface: schemas, catalog, scaffold, pure compilation, explain, structured errors and revision-checked editing are specified. These are proposed work, not existing installed behavior. [read: draft:119–148]
6. The supported synchronous outside-action profile is a defensible first release boundary; reserving broader service lifecycles is compatible with the north star's permission to stage support. [read: north-star.md:28; draft:87–92,321–326; inferred]
7. Marketplace identity, exact-release review and demand-led native promotion have useful seams; curated discovery is sufficient without building a storefront in 0.1.0. [read: draft:166–180; inferred]
8. Cloud and external-data contracts preserve one Kernel authority, explicit consent, scoped access and local-first operation; their proposed service timing is separate from contract readiness. [read: draft:182–207,225–239]
9. The remaining quiet-recentring risks are proof gaps: an open adapter registry, reference-only workflow policy, and community template/promotion journeys need explicit acceptance cases. [read: draft:152–164,168–180,414–418; inferred]
10. **One blocking issue; five non-blocking improvements.** Source/GitHub checks support the stated starting point; platform execution, installed conformance and hosted operation were not tested in this critique. [ran/read: checks below]

## Verdict

**NEEDS-REVISION:** retain the proposed minimal platform release, but explicitly design how independent solutions use Forge-hosted UI/backend infrastructure and the equivalent self-hosted boundary. [inferred]

This is a critique of [platform-plan-v1.md](../platform-plan-v1.md), read in full. The [owner north star](../../north-star.md) overrides conflicting framing in `(local scratch)`; the output and severity rules come from `(local scratch)`. Draft citations below refer to the supplied local planning artifact. Repository citations refer to `origin/master`, pinned at `7d448ec812ef8639790477af07c3c75962173f8a`. [read/ran]

Evidence labels distinguish **[read]** source inspection, **[ran]** an executed command/readback, and **[inferred]** design judgment or a future failure scenario. Running a source-reading script does not prove runtime behavior. No implementation, package installation, native harness invocation, migration or security campaign was run. [ran]

## Blocking issues

### 1. Hosted independent solutions are missing from the target architecture

**Claim/sections:** The draft claims to adopt the north star and reconcile its settled architecture, but its cloud, visualization and external-app sections describe storage/sync, an API-consuming app and external clients. The scope table places “Managed remote execution/hosting” under Delivery without defining hosting for an independent solution. See [cloud architecture](../platform-plan-v1.md#38-optional-cloud-data-layer), [visualization](../platform-plan-v1.md#39-no-core-ui-a-separate-native-visualization-domain), [external apps](../platform-plan-v1.md#310-bring-your-own-solution-and-ui) and the [scope table](../platform-plan-v1.md#5-010-scope). [read: draft:182–239,330–337,488–505]

**What's wrong:** The owner explicitly requires external solutions to be able to run on Forge's hosted system, including storage/sync, auth/grants, events and hosting for their UI or lightweight backend, while retaining self-hosting. A separate visualization app with plugin views covers one UI route; it does not define where an independently authored backend runs, how it receives scoped Forge services, or how the same solution targets a self-hosted installation. Backup and remote API access alone do not deliver that target. [read: north-star.md:17–18; draft:222–239; inferred]

**Concrete failure scenario:** An author publishes a solution with a small backend and its own UI. The plan provides a block identity, config, app grants and data envelopes, but no stated binding between that solution and a Forge-managed hosting environment. The implementer must invent deployment ownership, service credentials, tenant isolation and hosting-specific configuration later. That can produce a privileged first-party path or make a hosted variant require different solution/config identities. Those are compatibility risks, not a demonstrated unavoidable breaking change. [inferred]

**Evidence and search boundary:** I read all sections of the 528-line draft and searched it case-insensitively for hosting/hosted, self-hosting, lightweight backend/backend, deployment and tenant concepts. Relevant positive statements include the Delivery hosting placeholder at line 330 and the separately released visualization app at line 222. Sections 3.8–3.10 and their staging tables do not specify the owner's independent-solution hosting boundary. This is a missing plan commitment; it is not a claim that every hosting implementation is absent from the repository. [read/ran: complete-draft inspection and concept search; source rung 2, absence of runtime support unproven]

**Specific fix:** Add one target-architecture subsection and a scope/staging row for **hosted independent solutions**, separate from guarded delivery. Reuse the proposed solution identity, app principal, project, grants, versioned config, data and event contracts. State how local/self-hosted and Forge-hosted targets bind to those same contracts; keep deployment-specific settings at the hosting edge. Identify ownership of backend lifetime, tenant/process isolation, credentials, quotas and cleanup when hosting ships. No arbitrary trusted extension should inherit a shared server's ambient privileges merely because the local profile permits them. [inferred]

Keep hosted implementation outside 0.1.0 by default. Before freezing the public contracts, require a design-level walkthrough of one plugin-panel solution and one independent UI plus lightweight backend on both hosting targets, checking identity, least-privilege services and transfer semantics. Name the later hosting milestone and its supported proof; do not add an empty hosting framework or speculative vendor adapter now. [inferred]

**Why blocking:** This omits an explicit owner objective from a document presented as the target platform plan. The blocker is architectural completeness, not a demand to ship cloud hosting in 0.1.0. [read: north-star.md:17,31; inferred]

## Non-blocking improvements

1. **Prove the open harness seam independently.** Section 3.5 defines an open adapter contract, but the outside-author release proof uses two existing named harnesses. Add an outside-authored adapter registration/projection conformance case using public APIs and a new adapter ID, with no core patch. A controlled protocol fixture can prove registry openness; real-host certification remains required before advertising that host. The current source still has a four-name harness list and loads built-in descriptor files, so this deserves a regression check. [read: draft:152–154,357,414–418; remote `lib/harness-capability-matrix.js:5`, `lib/plugin-manager.js:230–254`; inferred]

2. **Make policy ownership explicit.** Preserve the separation already stated at line 164, but add a small table assigning each protected constraint to platform integrity, a selected capability's effect contract, configured repository policy, or the delivery reference template. Test a connected non-delivery solution with its own node names and workflow, plus the existing stateless advisor. It must be usable without inheriting the reference ladder, while every applicable configured guard still holds. This closes ambiguity in “mandatory dependency/evidence edges” and “stop points”; it does not authorize weakening a gate. [read: draft:136,142,160–164,301–313; inferred]

3. **Include a community template in the publication proof.** The plan specifies shared block/template publishing contracts, but its concrete cold-author journey centres on the advisor block. Publish and discover a small outside-authored declarative template that composes that block with existing capabilities, then instantiate and edit it through the public config API. No additional runtime feature is needed. This checks that community templates can reuse capabilities without privileged native defaults or embedded execution hooks. [read: north-star.md:14; draft:168–178,271–297,414–418; inferred]

4. **Exercise identity-preserving native promotion before freezing the format.** The demand-led promotion policy is sound as a proposal. Add a metadata/config compatibility fixture showing a community release becoming supported/native while preserving its qualified identity or a documented migration alias, exact source lock and separate execution admission. Existing consumers should not need a new capability name merely because maintenance ownership changes. This tests the seam without operating a promotion service in 0.1.0. [read: draft:170–180; inferred]

5. **Keep roadmap dates conditional on contract breadth.** The draft labels the 8–12-week envelope as provisional and the staffing as illustrative. Preserve that qualification when the plan is summarized: supported public clients, config migration, reference migration, outside authoring and event/data boundaries are coupled work. Use the early outside slice and contract/access checkpoints to revise the forecast before widening service profiles or requiring hosted/browser functionality. The estimate is not a measured delivery rate. [read: draft:352–361,438–448,511,521–522; inferred]

## Independent claim checks

| Draft claim checked | Primary evidence inspected | Result and limit |
| --- | --- | --- |
| The source snapshot is current remote master. | `git rev-parse origin/master`; `FORGE_SESSION_ID=delivery-train-20260928a node bin/forge.js github run -- gh api repos/harshanandak/forge/commits/master --jq .sha`. | Both returned `7d448ec812ef8639790477af07c3c75962173f8a`. [ran] |
| The Contracts/Flow/Memory package fold is already landed. | Forge-routed `gh pr view 601 --json number,title,state,mergedAt,mergeCommit,headRefOid`; remote indexes in `lib/contracts`, `lib/flow`, `lib/memory-core`. | GitHub returned MERGED, merge commit `ba56b9201782c4d1246c77bde6380867603184bf`, merged September 29. The indexes are under `lib/` on the pinned ref. This proves source disposition, not installed public compatibility. [ran/read] |
| Public installed entrypoints still need work. | Parsed [remote package.json](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/package.json). | Node floor is `>=24.0.0`; `main`, `exports` and `types` properties are absent; the residual workspace is `packages/skills`. That matches the draft's starting point. It does not prove that all deep imports are unusable. [read; executed parse] |
| Existing Flow is a reusable generic execution foundation, but not the complete new author contract. | [SkillRuntime](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/flow/src/skill-runtime.js#L159-L205), dependency resolver at lines 309–361. | Source checks capabilities/handlers, awaits injected handlers, and rejects unknown nodes/cycles. The proposed binding/config/admission layer and synchronous-profile wrapper remain additional work. [read] |
| Current config and harness connectivity are still opinionated starting points. | [Runtime resolver](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/core/runtime-graph.js#L972-L996), [sparse writer](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/config-writer.js#L43-L84), harness list/descriptor loader cited above. | The resolver clones a fixed graph and applies known sections; the writer directly writes YAML; connectivity begins with named native descriptors. The draft correctly proposes replacing these limitations rather than claiming the platform already exists. [read] |
| Kernel authority and local Memory ownership are existing seams to preserve. | [Kernel-only backend](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/issue-backend.js#L6-L20), [Memory registry](https://github.com/harshanandak/forge/blob/7d448ec812ef8639790477af07c3c75962173f8a/lib/memory-core/src/backend-registry.js#L85-L125). | Source restricts issue backends to Kernel, prevents replacement/removal of the local Memory floor and executes local Memory before optional enrichment. No runtime safety or cloud behavior was tested. [read] |

The checked source supports reuse rather than a platform rewrite. It does not substantiate completed schemas, installed exports, outside-author usability, open adapter conformance, scoped transfer enforcement or a release date. The draft generally distinguishes those proposed outcomes correctly. [read/inferred]

## Scores (1–5)

| Dimension | Score | Reason |
| --- | ---: | --- |
| Achievability | 3 | A credible minimal outside-action slice reuses existing owners, but public config/client migration and native certification are substantial coupled work; staffing/access remain unproven. [read/inferred] |
| Value | 5 | The proposed author/config/catalog surface directly enables capability reuse and independently opinionated solutions. [read: north-star.md:9–14; draft:78–164; inferred] |
| Clarity | 4 | Support versus experimental scope and evidence limits are explicit; hosting is underspecified and invariant/reference policy needs a more concrete boundary. [read/inferred] |
| Risk handling | 4 | Admission, ambient privilege, single authority, privacy, revocation and exact-artifact proof are handled carefully as design obligations; hosted isolation and external adapter proof need additions. [read/inferred] |
| Alignment with owner constraints | 4 | One package, first-class outside blocks, config-first composition, reference workflow, marketplace, local-first cloud and separate UI are retained; the hosted-solution requirement is incomplete. [read/inferred] |

## Open questions for the owner

The platform definition and inclusion of hosted independent solutions are already decided; the remaining choice is timing. [read: north-star.md:17,31]

**A — reserve and walk through the hosted/self-hosted solution boundary now; stage the actual hosting service after 0.1.0.** This repairs the target architecture while keeping the minimal platform release. **B — require one supported hosted UI/backend solution journey in 0.1.0.** This adds auth, isolation, operations and certification scope and needs a new forecast. **Default: A.** A label selects the timing; silence selects A as a planning recommendation, not execution authorization. [inferred]

## Confidence

**High** in the north-star comparison and the narrow repository/GitHub facts independently checked. **Medium** in architectural completeness and compatibility judgments: proposed public contracts have not faced an outside-author or hosted-consumer pilot. **Low** in calendar and operational outcomes; this critique measured neither staffing nor native/hosted execution. [read/ran/inferred]

BLOCKING: 1
