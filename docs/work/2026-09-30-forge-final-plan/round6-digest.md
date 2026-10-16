> Superseded in part on 2026-10-16 by the new-project rebuild plan — see [../2026-10-16-platform-rebuild/rebuild-plan.md](../2026-10-16-platform-rebuild/rebuild-plan.md).

# Round 6 research digest

Decisions needed: the merged choices in the revised plan §10; a label, a combo, or silence selects planning defaults only.

Protocol: `1.0`  
Request: `forge-plan-revise-6-20261002`  
Context digest: `59ba3628f2fc89a378ee38a9e4692555821bc0bfd1dcb91c60ce29ce31c7d0ae`  
Context summary: Fold P11 block architecture, P12 knowledge layer and P13 runtime/language into the Forge plan, re-forecast for one maintainer plus agents, rebuild the decision report.

Evidence: supplied reports and north-star items 13–18 were read; their source reads/experiments retain their dates and qualifications. Designs and estimates below are proposed/inferred. This phase performs document checks, not a new runtime benchmark, native integration, browser check or migration. Round 5 supplies the existing native/type/host budget and historical decisions.

## P11 — functional architecture

- Use six ownership layers: Contracts/composition, Kernel/authority, Memory/knowledge, Flow/execution, policy/gates and adapters; these are boundaries inside one package.
- Contracts supplies one catalog/config writer and resolve/bind/admit/invoke path; keep wire/schema primitives dependency-light and reuse existing engines.
- Rehome Memory-core authority/PR/monitor facades to Kernel and knowledge registry/provenance to Memory; redirect callers before physical moves.
- Publish all 37 capability families with disposition, owner, carriers and current/proposed status; workflows, agent tools and PR pipelines compose the same operations.
- Native repo/device FTS, decisions and bounded reference graphs form the knowledge floor. Pi/OpenCode/Codex are mandatory; Claude/Cursor stay well supported and nonblocking.
- The 41–70-day functional slice overlaps existing work; 12–21 boundary/knowledge days plus 2–4 OpenCode days are provisionally new, not a wholesale addition.

Open questions/defaults: first knowledge increment A (local repo/device/FTS/decisions/links now; B narrower explicit promise; C cloud authority now), execution A (compile supported structures, single calls/reference sequences; B general DAG; C host-only ordering), migration pace A (facades/caller proof first; B move-first; C paths indefinitely). Execution merges into 18; knowledge scope and migration pace become 46/47.

Contradictions: the old small owner catalogue and later-only device scope understate the binding direction; directory names hide authority work in Memory-core. P11's references to old open counts and decided 33 are superseded by Round 5 and this explicit narrow reopening. Its preferred four config layers conflict with P12's proposed personal layer: keep four compiler layers, resolve personal preferences separately, and activate them only through an explicit project/invocation edit (8).

## P12 — durable knowledge

- Deliver functional repo and private device notes/decisions in 0.1.0, with portable project/device/record identities and explicit attach/migration semantics.
- Use existing SQLite FTS5 plus source-backed entities, versioned links and bounded context; projected issues remain Kernel-owned, code references stay locators.
- Filter scopes before ranking and at every graph hop; expose provenance/freshness, preserve concurrent versions/tombstones and keep reads free of initialization, migration or upload.
- Share immutable skills/config/templates/block assets through cache references and repo locks, with independent per-repo trust and activation.
- Integrate one optional decisions-only Graphiti proof lane and Basic Memory/Git recipes now; heavier semantics/code analysis follow demand. Cloud backup, note sync and shared issue authority are distinct stages.
- Gross local effort is 23–41 days/13–23 owner-hours; P12 proposes 14–24 incremental days/9–15 hours before reconciliation with P11's overlapping knowledge work.

Open questions/defaults: cloud A (backup then note/decision sync, shared Kernel separately gated; B shared authority first; C existing vault bridge) updates 11. Provider investment A (one pinned Graphiti lane plus vault recipe; B vault adapter now; C seams-only) updates 25 without reopening 30. Graph depth A (authored/source-backed FTS and one/two-hop context; B semantic experiment; C external graph provider) becomes 48, distinct from scope breadth.

Contradictions: repo-only memory and backup/read-only cloud omit requested device knowledge and actual note sync. A descriptor does not enforce Graphiti's input restriction; async enrichment cannot be passed through the synchronous registry. Model A is accepted direction, not proof the UUID/location migration shipped. A rich context result cannot silently widen the advisor's locked two-field notes projection.

## P13 — runtime and language

- Keep JS CLI/public APIs and P10 declarations; full TS conversion does not lower runtime memory, and no full Rust/Python rewrite is justified.
- Measured help RSS medians were Node 75.16 MiB/Bun 50.80 MiB; protected-write hook RSS 63.14/36.89 MiB. These are report trials, not packed server/resident measurements.
- Hook wall medians were 1,472.7/663.7 ms, while post-preload internal medians were 21.03/9.18 ms; contended empty controls prevent attributing wall latency to Forge.
- Remaining eager bootstrap roots consumed about 297 ms/74% in one Node profile; the lazy command manifest already exists and should be reused.
- Count servers, bridges and workers across sessions/projects before choosing a resident language; direct clients can matter more than daemon language. Scaling figures are hypotheses.
- Successful ready/show/recap/recall, quiet-host latency, compiled Bun and equivalent JS/Rust residence remain unproved; price their bounded proof separately.

Open question/default: reopen 33 narrowly, A (JS first and shared-runtime/transport proof); B (bounded Rust daemon/bridge comparison now); C (on-demand device memory first, defer residence). Preserve the owner's prior JS/public-declaration choice as the baseline; no other decided entry reopens.

Contradictions: an unconditional decided language verdict cannot answer a new resident-service workload; lower Bun RSS does not prove universal speed. One MCP server per session is not one shared process across devices/projects. Neither a hypothetical Rust budget nor successful module loading proves real command/daemon performance.
