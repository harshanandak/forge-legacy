# Bottom line

1. **Decisions needed:** cloud staging and optional-provider depth below; default **A+A+A**. The local/device/graph direction is already the owner's constraint, not another product-definition vote. [read: north-star.md:26–50]
2. Forge already has durable project notes, typed decisions and **SQLite FTS5**; extend them rather than install a new default memory engine. [read: lib/kernel/migrations.js:258–293; lib/memory/typed-api.js:3–11,50–101; ran: existing-driver probe]
3. **Model A is accepted but not implemented by the inspected default resolver:** per-user home, committed project UUID and opt-in JSONL are the intended destination; runtime still uses the Git common directory. [read: docs/PROJECT_DESIGN.md:560–583; lib/kernel/broker.js:132–149]
4. Ship a small **device knowledge store**, explicit repo/device selection and provenance-bearing connected references in 0.1.0; reserve cross-device transport rather than promise a deployed cloud. [inferred recommendation]
5. Keep one Kernel issue/workflow authority per project: device aggregation and cloud replicas are knowledge/read projections; shared issue writes require one authoritative Kernel endpoint. [read: storage reference:41–51,86–100; inferred design]
6. Use SQLite relational entity/edge tables and FTS5 for the native connected graph; automatic semantic extraction and whole-code graph generation remain optional providers. [inferred recommendation]
7. Keep **Graphiti optional and decisions-only**, and Graphify a separate code-graph provider; a plain MCP descriptor does not enforce that ingestion boundary. [read: platform-plan-final.md:1661; lib/memory/graphiti-mcp.js:6–21; inferred]
8. Integrate existing graph/memory services when demanded; none of Graphiti, Mem0, Basic Memory, Letta or a replication SDK is justified as a mandatory replacement for today's zero-key local floor. [external: candidate sources in §4, checked 2026-10-02; inferred verdict]
9. Start cloud with selected encrypted backup and non-authoritative note synchronization; add active cross-device issue work only after authority handoff, fencing and offline-refusal proof. [inferred recommendation; read: P3:152–179]
10. Budget one maintainer plus agents: gross local slice **23–41 worker-days / 13–23 focused owner-hours**, with overlap to reconcile; these are unmeasured estimates, not a new release date. [inferred; §7]

# P12 — Knowledge across repos, devices and cloud

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p12-knowledge-layer-20261002",
  "contextDigest": "87ec3a41ec18fbe94dcf0734db674c8993c36c0571846f6a8ed3e29e13b6cbfc",
  "context": {
    "summary": "Forge final plan, leg P12: the knowledge layer (issues, memory, decisions, connected graph) across repo, device and cross-device scopes, with SQLite FTS and integrate-vs-build."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": { "write": true, "tools": [], "maxCostUsd": null },
  "route": { "model": "gpt-6.1-sol", "thinking": "xhigh", "search": true },
  "researchDate": "2026-10-02"
}
```

Route metadata above preserves the requested route; it is not model self-attribution. This phase authorizes research and this file only. No implementation, installation, cloud transfer, issue mutation, commit or publication is authorized.

## Evidence boundary

- **[read]** means inspected source or planning text, with `file:line`. Tracked code/design references are on the observed `origin/master` snapshot **7d448ec812ef8639790477af07c3c75962173f8a**, dated 2026-09-30. No remote ref was updated in this phase. A targeted `git diff origin/master -- ...` returned no differences for the inspected Kernel/memory code, so in-memory probes used the same source. [ran]
- **[ran]** means the command executed here. The Node/SQLite probes establish only the narrow behaviors listed below, not migration, hosted sync, cross-device safety, Node 26 or harness conformance.
- **[external]** means a primary source retrieved **2026-10-02**; URLs and access dates accompany the comparisons. No external SDK/service was installed or benchmarked. Documentation support is not installed-version proof.
- **[inferred]** identifies recommendations, failure traces, proposed schemas, forecasts and acceptance criteria. Unless marked otherwise, §§2–3 and §§5–7 are proposed design, not shipped behavior.
- Draft inputs under `docs/work/2026-09-30-forge-final-plan/` are untracked planning artifacts, not implementation evidence: north-star.md, platform-plan-final.md, P3-marketplace-cloud.md, P5-complement-and-openai.md and P8-adopt-verification.md. The shared `(local scratch)` was read first. [ran]

## 1. Current state: storage, schemas, recall and gaps

### 1.1 Where data actually lives

| Location | Inspected current behavior | Consequence |
| --- | --- | --- |
| `<git-common-dir>/forge/kernel.sqlite` | Default broker and CLI factory resolve here; project memory reuses that driver/database. All worktrees of the same Git repository converge on its common directory. [read: lib/kernel/broker.js:132–149; lib/kernel/cli-broker-factory.js:32–52; lib/project-memory.js:13–37] | Today's project memory is repo-associated, although the live binary is outside the checked-out worktree. It is not a user-level memory store. |
| Repo `.forge/` | Memory routing reads `.forge/config.yaml`; old `.forge/memory/notes.jsonl` is a one-time import source. Explicit issue exports use `.forge/kernel/`; configuration and projection artifacts differ from the live database. [read: lib/memory/router.js:55–86,317–372; lib/commands/export.js:94; storage reference:26–38] | Do not turn committed files into routine issue durability or a second writer. Legacy recall can perform an import/rename. |
| Per-user `~/.forge/` | Accepted Model A specifies `projects/<uuid>/kernel.sqlite`, `registry.json`, committed `.forge/project.json`, personal config centrally and opt-in issue JSONL. The same paragraph calls implementation a later track. [read: docs/PROJECT_DESIGN.md:560–583] | A locked destination exists; the default resolver above has not reached it. The ledger's frontend/`serve` motivation is historical and does not override the new no-core-UI direction. |
| Device inspection | This worktree's `.forge/` contained contributor-skills, hooks and protected-paths.yaml. The user home contained a skills directory, GitHub routing artifacts and receipt-key material; only names/sizes were inspected, never credential contents. No projects directory/registry.json appeared in that directory listing. [ran: bounded filesystem metadata census] | This device observation is consistent with the resolver gap; it is not proof about every installation or all possible overrides. |
| Cloud/team | The storage reference proposes a server Kernel authority, query projections and archives, historically using Cloudflare components. It requires server acceptance for shared claims/start/close/stage writes. [read: docs/reference/FORGE_KERNEL_STORAGE_MODEL.md:86–123] | Planning text is not a deployed backend. This research did not exercise any cloud instance. |

The existing project identity helper canonicalizes the **Git common-directory path**, including Windows case normalization; it is not the committed project UUID in Model A. Moving/cloning a repo changes that path identity. [read: lib/project-memory.js:40–55; inferred consequence] Searches covered `project.json`, `project UUID/projectId`, `device_id/deviceId`, `registry.json`, `graph_edges/knowledge_edges` and `fts5` in tracked `lib/`, plus the actual resolver/schema reads. Compatibility inspection recognizes a project marker, but that recognition is not runtime UUID storage resolution. A zero-hit for a graph/device name alone is not an absence proof. [ran; read: lib/beta5-compatibility-evidence.js:132,549]

### 1.2 Schema and measured size

The Kernel schema separates authority, read model, projection, archive, configuration/cache and external-provider classes. Issues carry identity/title/body/type/status/priority, hierarchy, planning buckets, authored acceptance/design/notes/assignee, timestamps and entity revision. Related tables hold dependencies, comments, claims, sessions, worktrees, stage runs, evidence, events, outbox/projection/dead-letter/conflict state, and PR/watch ownership. [read: lib/kernel/schema.js:1–16,64–340]

**`kernel_memories`** is currently classified as a read model and written directly, outside the issue guarded-event/CAS path. Columns are `key` (primary key), `value_json`, `source_agent`, `scope`, `confidence`, `tags_json`, `supersedes_json`, `beads_refs_json`, `created_at`, `updated_at`. Scope is an optional string in the entry contract; that field alone does not implement a device store or cloud authorization. `created_at` is retained in SQL but omitted by `memoryRowToEntry`; its exposed timestamp is updated/as-of time. [read: lib/kernel/schema.js:263–282; lib/project-memory.js:82–129; lib/kernel/sqlite-driver.js:2307–2356]

Typed memory wraps the same storage in categories `decisions`, `episodes`, `skills`, `state`, `issues`, `audit`, `preferences`, with `{category,data,provenance:{actor,reason,source}}`, typed keys and tags. These are knowledge records; a record under `issues:` does not acquire Kernel issue authority. There is no separate decision SQL table in this inspected schema. [read: lib/memory/typed-api.js:3–11,19–34,50–101; lib/kernel/schema.js:64–340; inferred authority distinction]

`lib/memory-core` is more than a notes engine: its exports include broker-backed authority delegation, backend registry, feedback intake, PR lifecycle authority, usage evidence and a durable monitor store. Its authority provider forwards operations to the Kernel broker. Do not delete this code as though a memory vendor replaces it. [read: lib/memory-core/index.js:319–331; lib/memory-core/src/authority-provider.js:3–59]

**Local data census [ran]:** `.git/forge/kernel.sqlite` was **13,586,432 bytes** (about 12.96 MiB). WAL and SHM were absent at the initial metadata sample. Normal Node read-only opening failed with `ERR_SQLITE_ERROR`; a Python standard-library SQLite connection using `mode=ro&immutable=1` then read the existing file without writes. This is an observed file snapshot, not a coherent snapshot guarantee while another writer is active. It reported 4,096-byte pages, 3,317 pages and 33 SQL tables including the FTS virtual/shadow tables and migration ledger.

| Observed table | Rows [ran] |
| --- | ---: |
| kernel_issues | 1,663 |
| kernel_memories | 10 |
| kernel_dependencies | 674 |
| kernel_comments | 1,918 |
| kernel_events | 8,484 |
| kernel_claims | 464 |
| kernel_pr | 113 |
| memory_usage_events | 1 |

The ten memory rows totalled **3,694 SQLite `length(value_json)` units**; that measures stored text length, not UTF-8 bytes or total FTS/index footprint. Claim rows include history; 464 is not an active-claim count. The small note population cannot establish large-corpus performance. [ran; inferred limits]

Source census, recursive `.js` files only, counted raw file bytes and `split('\n').length` (including a trailing empty segment). It found Kernel **22 files / 571,785 bytes / 13,784 segments**, memory **5 / 32,556 / 877**, memory-core **6 / 89,012 / 1,990**. These are source-maintenance scope, not npm installed size or removable-code estimates. [ran]

### 1.3 FTS5 and recall already work

- Migration **008_kernel_memories_fts** builds an external-content FTS5 table indexing `key`, `value_json`, `tags_json`, linked by rowid to `kernel_memories`. Insert/update/delete triggers synchronize it, and rebuild backfills earlier notes. [read: lib/kernel/migrations.js:258–293]
- `forge remember` parses note/structured What–Why–Where–Learned fields, `--kind`, repeated tags and session-summary capture. It routes to the native append path; CLI flags do not select repo/device/cloud scopes today. [read: lib/commands/remember.js:7–25,37–95,98–161; lib/memory/router.js:384–411]
- Query recall uses quoted Unicode alphanumeric tokens joined with **AND**, ranked by BM25. No-query recall returns the newest bounded page, default 20, with a total; human remembered notes are the default listing, while query/`--all` reaches machine/typed records too. The router's query `total` is returned-hit count, not a full matching-corpus count. [read: lib/kernel/sqlite-driver.js:2485–2515; lib/memory/router.js:43–54,418–451]
- Scored automatic prompt recall has a separate token-**OR** builder to avoid requiring every prompt word in one note; it has no recency fallback on no match. Human CLI rendering budgets/fences recalled text and labels suggested versus confirmed records; raw JSON consumers must keep their own trust handling. [read: lib/kernel/sqlite-driver.js:2495–2503,5306–5312; lib/commands/recall.js:140–195,205–227]
- Driver methods call `ensureMemorySchema` on reads too. Router recall calls `migrateJsonlNotesOnce`, and CLI recall records usage evidence. Therefore the existing convenience entry is not a guaranteed side-effect-free public read. The platform draft already identifies this issue. [read: lib/kernel/sqlite-driver.js:5284–5326; lib/memory/router.js:433–451; lib/commands/recall.js:116–137,175–182; platform-plan-final.md:433]
- The backend registry protects the local floor, executes it first, supports detached enrichment and rejects thenable results as asynchronous unsupported. Graphiti's router adapter has an injected-emitter seam and empty enrichment read methods; the descriptor projects a separate MCP server for agents, rather than providing a complete Forge graph client. [read: lib/memory-core/src/backend-registry.js:3–5,45–50,85–154; lib/memory/router.js:201–242,384–411; lib/memory/graphiti-mcp.js:6–21]

**Runtime evidence [ran]:** Node **v24.18.0**, SQLite **3.53.1**, `ENABLE_FTS5=1`. An in-memory external-content FTS table with an insert trigger matched `"device" AND "knowledge"` and returned BM25 **−0.000002**. A separate **existing Forge `createBuiltinSQLiteDriver({databasePath:':memory:'})`** probe wrote one note and returned its key through `searchMemoriesRanked('knowledge decision',3)`; `countMemories()` returned 1 and runtime was `node:sqlite`. Neither probe wrote a file. Built-in `loadExtension`, `createSession`, `applyChangeset` methods existed, but no extension/changeset integration was run.

The first probe process reported **65,785,856 RSS bytes**. That is one Node process with a tiny in-memory database, not a Forge CLI/MCP benchmark or an incremental SQLite cost. Node 24 FTS5 availability is verified on this installed build; CI must still prove the promised Node patch floor, Node 26 and OS matrix. [ran; inferred limit]

### 1.4 The actual gaps

**[inferred from the inspected owners/entrypoints]:** stable project/device identities and location resolution; a user-level device namespace; explicit dataset grants and cross-repo isolation; typed decision lifecycle/history; connected references with freshness; a safe read-only API; durable provider delivery/deletion acknowledgement; scoped cloud backup/sync; and asset locks across repos. Existing note tags, arbitrary `scope`, a Graphiti descriptor or an event table do not independently satisfy those journeys. No new search engine, model loop or wholesale rewrite is required to close the local slice.

## 2. Scope model and authority

### 2.1 Logical scopes and physical ownership [inferred design]

Scope is an authorization namespace, not merely a directory. Per-user `~/.forge/` is the physical home; **repo knowledge remains logically repo-scoped there**. Cross-device is a replication/access dimension over selected namespaces, not a higher-precedence source of truth.

| Scope | Canonical contents | Proposed local location / owner | Sharing rule |
| --- | --- | --- | --- |
| **Repo/project** | Kernel issues/workflow/dependencies/claims; project decisions and notes; explicit links to code/PRs/skills; shared non-secret composition/locks | Model A `~/.forge/projects/<projectUUID>/kernel.sqlite`; project files hold marker, config and admitted assets | All local worktrees of a project use one broker. Another clone is attached deliberately. Cloud selection is per dataset. |
| **Device/user** | User preferences, cross-project lessons, reusable decisions/patterns, an index of attached projects; references to project knowledge | `~/.forge/device/knowledge.sqlite`, `device.json`; personal config outside repos | Device notes are private by default. Generic lessons may be explicitly promoted from repo notes, producing a new record with derivation provenance. No automatic scan/copy of every repo. |
| **Cross-device/cloud** | Selected note/decision versions, tombstones and consented references; encrypted backups; accepted Kernel read projections when enabled | Optional cloud account/dataset; local databases retain offline working copies | Knowledge sync can reconcile note versions. Shared issue commands target one Kernel authority; cloud backup does not enable another writable broker. |
| **Shared assets** | Skill content, config/template fragments, block manifests/artifact references and approved lock records | Immutable cache under `~/.forge/assets/`; canonical author source remains in its repo/package | Repo locks select exact artifacts. Marketplace discovery, cached availability and runtime trust are separate. No credentials in shared config. |

Personal tasks that are real issues must live in a **Kernel-backed personal project**, with its own project UUID and authority descriptor, rather than a second device issue table. A device-wide issue list federates Kernel queries and shows freshness; changes route back to that issue's Kernel. Knowledge records of category `issues` are references/summaries only. [inferred]

### 2.2 Identity [inferred design]

- Preserve Model A's committed `.forge/project.json` UUID and central registry. Marker schema reserves `schemaVersion`, `projectId` and optional lineage; private paths, credentials, device IDs and personal preferences stay out of it. Project UUID is identity, **not proof of membership or permission**.
- Registry maps project UUID to local checkouts, storage location and authority descriptor. Same-repo worktrees reuse one binding. Fresh clones offer explicit attach/bootstrap; forks use a new UUID plus lineage. Two disconnected clones with the same marker must not silently create two equivalent authorities. A copied marker without a local binding requires attach/import/fork disposition.
- Generate a random device ID once per local installation. Account/actor ID, device ID, harness session ID and app ID remain distinct; rotating a device ID does not rename existing records or impersonate a user.
- Qualify record references by namespace/dataset + project or user ID + record ID. Keep existing memory keys during migration; allocate stable logical identities where legacy category keys require mapping. Code references carry project UUID, repository-relative path, commit/blob identity and optional symbol locator; line numbers alone are not durable identity. PR references include forge/host repository identity plus number and source head. Skill/block references include source, exact artifact/interface version and digest.
- Reserve `{authorityId,mode,ownerDeviceId|endpoint,epoch,acceptedCursor}` per project. Local mode binds one device owner; shared mode binds one server Kernel. No client inference from remote URL or common-directory path establishes identity or authority.

**Model A migration:** use the existing consistent-backup/export owners; quiesce the old writer, verify source and backup, move/copy through a staged destination, verify schema/content and only then switch the resolver. Leave a redirect/refusal at the retired location so old clients cannot create a parallel writer. Preserve IDs, history, receipts and legacy payload fields. Rollback disables/fences the destination writer and restores the verified source binding; never reopen both. No migration occurs during `recall`, `doctor`, explain or preview. New installs can adopt the new layout directly; existing installs require the separately authorized migration/readback path. [inferred; read: Model A ledger; P3:150–181]

### 2.3 Precedence, conflicts and retrieval [inferred design]

1. **Knowledge is evidence, not executable policy.** A remembered preference or inferred decision cannot grant an effect, change a gate or close an issue. Current Kernel/config owners decide authoritative operations.
2. Default manual query is the active project; users may enable its access to approved generic device knowledge. Explicit cross-repo retrieval selects an allow-list of project IDs. A process with project-only grants cannot widen retrieval through `--all`, graph traversal, a skill or a provider.
3. For a preference key, approved explicit invocation choice takes precedence over project choice, then personal/device default, then pinned template/platform default. This is an additive **proposal** to the plan's existing layer order; protected invariants remain non-overridable and permissions intersect rather than widen. Device personal defaults do not silently rewrite committed config.
4. Repo decisions govern their project; device lessons are suggestions unless adopted there. Cloud copies retain their original scope. Conflicting statements are returned with source/revision/conflict labels, not collapsed by confidence score or newest wall clock. A decision can be proposed, adopted, superseded or rejected; adoption changes knowledge status and does not mint protected approval.
5. Create notes under unique IDs; causal edits name base version(s). Concurrent same-record edits keep both versions and create a conflict record. Resolution is explicit and cites both parents. Deletes emit retained tombstones and dominate older known versions; late edits of a deleted record require explicit restore/new record. Mutable config/locks use expected revision plus a reviewable diff, not generic last-writer-wins.
6. Local authoritative writes commit before reporting local persistence. Cloud acknowledgement is a different status (`local`, `pending`, `shared`, `conflict`, `rejected`); a local write is never reported as shared solely because an upload was queued.

### 2.4 D44 invariant across scopes [inferred design; read: storage reference:41–51,74,98–100]

```text
Local project:      commands -> local Kernel -> accepted issue state
                                  |
                       knowledge projections / backup outbox

Shared project:    commands -> server Kernel -> accepted issue state
                      ^           |
                      |     scoped accepted-event/read feed
                 pending drafts   v
                            device read projection

Notes/decisions:   local knowledge writes -> versioned sync -> knowledge copies
Assets:           publication/cache -> repo lock -> explicit admission
```

The Knowledge block owns notes, decisions and relationship queries. The Kernel block owns issue/workflow acceptance. Sharing storage or exporting through memory-core does not transfer authority between them. An authoritative `depends_on` issue edge is changed only through a Kernel command; a Knowledge link saying `related_to` or `informed_by` is an annotation.

For true cross-device issue work, authority migration freezes/fences the former local writer, imports a checked snapshot into the server Kernel, advances the epoch and switches clients. Offline clients may read and draft; they cannot acquire/renew authoritative leases, close/verify or authorize protected transitions. Two offline devices seeing revision 7 cannot both safely claim the same issue: later convergence cannot undo actions already authorized. This is a failure trace, **not an executed concurrency test**. [inferred; read: P3:154–165]

## 3. Connected graph: minimal native storage and APIs

### 3.1 Entities and edges [inferred design]

Use a small domain graph, not a separate graph database as the native requirement. Nodes identify **issue, decision, memory note, code artifact/symbol reference, PR, skill/block release, run/evidence**. Canonical bodies stay with their owners; graph rows carry references, searchable summaries and source revisions.

| Relationship | Example | Ownership / trust |
| --- | --- | --- |
| `blocks`, `parent_of`, `implemented_by`, `validated_by` | Issue → issue / PR / evidence | Project from accepted Kernel state/receipts, with authority ID, epoch and cursor; edits go through owners. |
| `decided_for`, `supersedes`, `informed_by` | Decision → issue / prior decision / note | Authored record/link, actor/source/reason and record version required. |
| `touches`, `documents`, `references` | PR/decision/note → code at commit/blob | Explicit source-backed locator; stale when referenced code changes. Do not ingest full source by default. |
| `uses`, `suggests`, `derived_from` | Issue → skill release; lesson → repo note | Exact asset identity; suggestion never authorizes installation/execution. |
| `provider_suggests` | Graphiti inference → permitted decision reference | Derived, provider-versioned, untrusted until reviewed; distinguish from authoritative/authored edges. |

Every edge records source, provenance, confidence only when meaningful, valid/as-of version and optional supersession. An inference cannot overwrite an authored edge. Cycles are valid for references; bounded traversal tracks visited IDs. Dangling or inaccessible targets remain typed unresolved references and reveal no hidden title/body/count. Cross-scope links require permission to both endpoints; traversal intersects grants at every step.

### 3.2 SQLite schema sketch [inferred; not implemented]

Reuse `kernel_memories` and migration ownership; do not add a second canonical notes store inside the same project. The device database implements the same knowledge tables without initializing issue/claim tables. Separate native knowledge migrations from Kernel issue initialization.

| Table/extension | Minimum fields and role |
| --- | --- |
| Existing `kernel_memories` | Keep current values/provenance and local FTS5 floor; evolve through an additive versioned contract. Existing `scope` strings are preserved, not reinterpreted as grants. |
| `memory_record_meta` | `record_id`, existing `memory_key`, namespace/dataset, project/user ID, kind, current version, visibility, content hash, retention, deletion status. Unique owner-scoped identity. |
| `memory_versions` | Immutable `version_id`, record ID, parent version IDs, payload/provenance, originating device/actor, content hash. Retains edits/conflict branches. Current note materialization and version append commit atomically. |
| `knowledge_entities` | Integer rowid; globally qualified entity ID; kind; owner reference; source revision/hash; title/search text; visibility; projection cursor/freshness. Issue/PR/code rows are rebuildable projections, not shadow authoritative fields. |
| `knowledge_edges` | Edge ID, source/target IDs, predicate, authored/derived class, source version/reference, actor/provider provenance, validity and tombstone/version. Index `(source,predicate)` and `(target,predicate)`. |
| `knowledge_projection_cursors` | Owner/authority/epoch, last accepted cursor, index schema version and stale/error status. Rebuildable projections must be reproducible from authorized source data. |
| `knowledge_documents_fts` | External-content FTS5 over entity title/search text with integer rowid; trigger-backed, rebuildable. Keep the existing notes FTS; a unified view deduplicates IDs. Do not ship SQL shadow tables in exports. |
| `knowledge_outbox` / delivery state | Non-authoritative knowledge/provider transfer: version/operation ID, dataset/destination/purpose/grant revision, payload reference/hash, retry/ack status and bounded error. Separate from protected Kernel commands. Implement the local contract/outbox only where a real path uses it. |

For authored links, preserve the canonical link event/version alongside its indexed edge. For owner-derived links, store source references/cursors and rebuild from the owning APIs. Across databases, use a replayable cursor rather than claim a transaction that SQLite cannot make across a remote Kernel and local knowledge index. Graph lag is explicit; current issue ownership/readiness is re-read from the Kernel before action.

FTS5 external-content indexes require synchronization and initial rebuild; SQLite documents that consistency is the application's responsibility. Reuse Forge's trigger/backfill approach and test update/delete/rebuild invariants. [external, 2026-10-02: [SQLite FTS5 external-content tables](https://www.sqlite.org/fts5.html#external_content_tables); read: migrations.js:258–293]

### 3.3 Search and optional vectors

**Native now [inferred]:** exact ID/reference lookup, FTS5 keyword ranking, kind/tag/scope filters, explicit relationship expansion and source/freshness explanations. Searching issues/decisions/PR summaries adds authorized projections to the same query surface. No embedding or model provider is required.

Query each permitted dataset before returning text/counts; separate dataset indexes avoid making an unauthorized corpus searchable. Apply scope/kind/status filters before top-N selection. BM25 scores from separate databases are not assumed comparable: combine bounded ranked lists through a declared deterministic rank/scope policy, retaining per-source ranking. Prompt recall can reuse the existing scored-OR mode; manual AND/phrase behavior stays explicit. Embedding matches cannot silently change trust or issue status. [inferred]

**Optional later:** `sqlite-vec` is a C vector extension whose documentation supports `node:sqlite` with extension loading, while its README still describes a pre-1.0 interface. The installed Node exposes `loadExtension`; the current driver creates `DatabaseSync` without opting into extensions. No sqlite-vec binary was loaded here. [external, 2026-10-02: [sqlite-vec JavaScript/Node guide](https://alexgarcia.xyz/sqlite-vec/js.html), [project README](https://github.com/asg017/sqlite-vec); read: sqlite-driver.js:138–145; ran: method probe]

A later opt-in provider must pin OS/architecture binary, ABI and digest, enable only the admitted extension, declare embedding model/dimensions/retention and remain rebuildable from permitted notes. Extension loading is execution trust. Start with an external provider rather than adding a compulsory embedding stack. Vector storage alone does not generate embeddings or improve recall. Adopt only after a source-backed corpus shows useful retrieval beyond FTS5 and preserves privacy/deletion. [inferred]

For context, 10,000 vectors × 768 float32 dimensions alone occupy **30,720,000 bytes**, before metadata/index/model/runtime costs. This is arithmetic, not a sqlite-vec measurement. Node's session/changeset methods likewise do not supply consent, domain conflict policy, transport or exclusive Kernel leases. [inferred; ran: method existence only]

### 3.4 Agent query surface [inferred proposal]

```javascript
memory.recall({ query, projectId, scopes: ["repo", "device"], kinds, limit, maxTokens });
knowledge.get({ entityId, include: ["provenance", "freshness"] });
knowledge.neighbors({ entityId, predicates, depth: 1, limit: 32 });
knowledge.context({ issueRef, include: ["decisions", "notes", "prs", "skills"], maxTokens: 1200 });
knowledge.explain({ queryReceiptId });
```

Writes remain distinct operations: remember a note, propose/adopt a decision, link permitted entities, supersede/forget a record, resolve versions. They require effect-specific grants, revision/idempotency and readback. `issue.update/claim/close` stays the Kernel client operation. A query result includes source IDs, owner namespace, record/source revision, provenance, trust, index cursor/freshness, caps and errors. Keep the platform's already-defined two-field `forge.memory.recall` notes projection for compatible advisor consumers; add a separately versioned richer context capability rather than widening it silently. [read: platform-plan-final.md:398–433; inferred]

Use stable errors for unauthorized scope, unresolved identity, unavailable owner/provider, stale required source, conflict and bounded input/output. A healthy zero-match result differs from unavailable/incomplete. Optional-provider failure may return the healthy local floor **with the failed provider status**, never a claim that provider retrieval completed. Protected consumers require fresh owning evidence, not a search receipt.

Proposed local defaults: page limit 20, one-hop context, opt-in depth two capped at 64 nodes/128 edges, 1,200-token context, 64-KiB accepted note envelope and bounded text snippets. These limits need fixture/corpus proof and actionable over-limit errors; no silent loss of stored provenance. Retain measured FTS goals separately from caps: the existing docs describe a 1,000-record p95 target of 250 ms, not a measured P12 result. [read: docs/reference/TOOLCHAIN.md:147; inferred proposal]

For low memory, reuse one host process, open databases lazily, bound the long-lived MCP connection cache (e.g. device + two project connections) and close idle handles. Do not keep a model, vector server or one daemon per repo alive. Large index rebuilds run outside the interactive path. `DatabaseSync` work blocks its thread: a JavaScript timer is not a hard query interruption; bound normal queries and isolate expensive rebuild work before promising cancellation. [inferred; external, 2026-10-02: [Node SQLite API](https://nodejs.org/api/sqlite.html)]

### 3.5 Harness plugins and skills [inferred]

Expose the same owning handlers through the same-package MCP server and native Pi/OpenCode tools, with Codex through its proved plugin/MCP carrier. Skills teach when to query context, inspect a source, propose a decision and verify issue state. They do not duplicate storage or grant access. A device session may have broader personal grants than a CI repo session; repository-supplied instructions cannot escalate those grants. Prompt/session hooks inject bounded, fenced evidence only and never trigger initialization, migration or provider uploads under a read effect. Mandatory harness proof follows the newer north-star tiers: Pi, OpenCode and Codex; Claude/Cursor support is useful but not a replacement for those required lanes. [read: north-star.md:38–50; platform-plan-final.md:1641–1649,1675]

Graphiti ingestion must go through a **Forge decisions-only projection** with destination consent and deletion tracking. Do not expose raw `add_episode` as a Forge-approved generic ingestion tool and then claim the decisions-only rule is enforced. A user may separately attach raw Graphiti MCP, but that is an independent trusted surface outside Forge's restricted provider contract. Graphify results retain scoped code provenance; they do not flow into Graphiti. [read: lib/memory/graphiti-mcp.js:6–21; platform decision 30; inferred]

## 4. Integrate versus build: current candidates

All external facts in this section are primary-source checks dated **2026-10-02**. The fit/verdict columns are **[inferred]**. No claimed ranking is based on measured resident memory, startup latency or end-to-end Node 24/26 compatibility. One Forge npm package may invoke user-selected separately installed providers; that does not require bundling their engines into it.

| Candidate | Verified shape [external, 2026-10-02] | Fit for Node 24 / local-first / low memory / offline | Verdict and reason [inferred] |
| --- | --- | --- | --- |
| **Native SQLite + FTS5** | Current source and two local probes already work (§1). | One built-in database/runtime; no new default engine dependency or network/model requirement. Device scope and explicit graph still need work. | **NATIVE NOW:** notes, typed decisions, scope/identity, authored/reference graph and FTS. Reuse existing logic. |
| **Graphiti** | Current MCP docs require Python/uv, FalkorDB or Neo4j, LLM and embedding configuration; MCP adds/searches episodes and graph facts. Local Ollama/embedding configuration is documented. [MCP docs](https://help.getzep.com/graphiti/getting-started/mcp-server), [maintainer README](https://github.com/getzep/graphiti/blob/main/mcp_server/README.md) | External service/runtime and extraction stack, rather than an embedded Node dependency. Offline generation is possible with an operated local stack, not the zero-key native install. RAM and model reliability here are unmeasured. | **INTEGRATE NOW as the existing optional lane:** decisions-only, one pinned provider pilot and enforced projection/consent. **LATER native semantics**, only if recurring demand justifies it. Do not replace Kernel or FTS. |
| **Mem0** | Node `mem0ai/oss` uses async add/search. Current quickstart defaults to OpenAI LLM/embeddings, an in-memory vector store and SQLite history, and permits configured providers. [official source quickstart](https://raw.githubusercontent.com/mem0ai/mem0/main/docs/open-source/node-quickstart.mdx) | Stronger JS fit than Python engines, but provider/default persistence and extraction are separate from Forge's durable floor. An in-memory vector store must not be mistaken for restart-safe recall. Offline requires configured local providers. | **LATER / integrate on demand:** useful semantic enrichment for an existing consumer. Preserve raw sources and failed/deleted-provider state; do not force async through today's synchronous registry. |
| **Basic Memory** | Markdown-first notes, semantic links, secondary SQLite index locally, MCP search/read/write/context; local CLI uses uv/Homebrew. Docs describe offline local use and hosted cloud/local sync; technical page states AGPL-3.0. [architecture](https://docs.basicmemory.com/reference/technical-information), [local install](https://docs.basicmemory.com/local/local-install), [cloud](https://docs.basicmemory.com/cloud/cloud-guide) | Best immediate personal-vault complement among these candidates; external CLI/runtime, not the native npm core. It owns its note files/index; careless bidirectional copying creates competing note owners. No resource benchmark here. | **INTEGRATE NOW as an optional recipe/consumer, not a replacement:** reference or explicitly export selected notes to a user's existing vault. **LATER** a bidirectional bridge after ID/deletion/conflict proof. Do not bundle an AGPL engine by assuming MCP determines license compatibility. |
| **Letta** | Current App Server owns agent execution/turn queueing and local/cloud agent state. The separate v1 Docker server guide uses PostgreSQL persistence and embedding choices for archival memory. These are distinct deployment profiles. [App Server](https://docs.letta.com/self-hosting/app-server), [v1 Docker guide](https://docs.letta.com/v1-sdk/docker) | Local agent memory is possible; a Node client alone is not that engine. Taking its lifecycle into Forge would compete with the host. Footprint/profile compatibility unmeasured. | **LATER consumer adapter:** serve Forge work context to users already operating Letta. Do not adopt an agent platform merely to save device notes. |
| **cr-sqlite** | Runtime-loadable SQLite/libSQL extension merges independent database writes via CRDT/causal mechanisms and exposes change rows. [maintainer README](https://raw.githubusercontent.com/vlcn-io/cr-sqlite/main/README.md) | Fits offline convergence experiments but adds extension/binary/schema lifecycle and still needs networking/auth. Node's extension method existence is not cr-sqlite compatibility proof; current maintenance/support health was not established. | **LATER notes-only experiment**, if manual version conflicts become costly. **Reject for Kernel claims/stages:** convergence cannot revoke previously exercised authority. |
| **Electric** | Current service provides Postgres read-path sync; writes use a separately implemented application/backend path. [official writes guide](https://electric.ax/docs/sync/guides/writes) | A selective read-feed complement for an existing Postgres solution; not a drop-in SQLite broker. Introduces a service/upstream lifecycle solely for this use. | **LATER external-app projection adapter**, only when that solution already has the suitable stack. No native broker replacement. |
| **PowerSync** | Node SDK offers local SQLite, background sync and `uploadData` to a backend. The documented `node:sqlite` path is testing-only because of stability issues. SDK/service licenses differ; current service license is FSL-1.1-ALv2. [Node reference](https://docs.powersync.com/client-sdks/reference/node), [service license](https://raw.githubusercontent.com/powersync-ja/powersync-service/main/LICENSE) | Sound pending-write/backend boundary, but brings service, driver and schema lifecycle. The built-in driver is not documented as production-ready. Native-driver alternatives add installation/footprint cost. | **LATER filtered read/draft projections** for a named external UI. Preserve the backend Kernel command gate. No blanket Node 24 or low-memory production claim. |
| **Turso/libSQL embedded replicas** | Current TS docs distinguish libSQL replicas (local reads, writes to cloud primary) from the newer Turso sync engine, which has local writes and explicit push/pull. Native sync/local packages differ from fetch-only remote clients. [official TS reference](https://docs.turso.tech/sdk/ts/reference) | Replicas are plausible shared read caches, but using another engine changes driver/backup/FTS semantics. Local sync conflict rules are not issue command semantics. SDK size is not service/installation/RAM size. | **LATER first database-provider spike** if server Kernel/read replicas are prioritized, as P3 suggests. Evaluate current Turso separately from legacy libSQL; retain native local floor and public contract. |
| **Litestream** | Separate replication process monitors SQLite and backs it up to object storage; restore writes a destination database. One-shot replication is also documented. [getting started](https://litestream.io/getting-started/), [replicate reference](https://litestream.io/reference/replicate/) | Useful backup integration, not multi-writer knowledge sync. Adds a binary/process and platform support to verify; no native Windows or user-controlled E2EE proof here. | **INTEGRATE LATER (0.2 optional backup):** do not build WAL shipping. Start native consistent snapshot export; require provider restore/privacy proof before advertising continuous backup. |
| **Plain Git-backed JSONL** | Git merges commit histories and leaves unresolved content conflicts for resolution. [official git-merge](https://git-scm.com/docs/git-merge); native explicit JSONL export already exists [read: export.js:94; Model A ledger]. | Portable/offline/history-friendly, uses existing Git; networking/auth remain external. Generic text merge can duplicate/drop logical events and cannot protect leases or delete private copies. | **NATIVE NOW export format + optional existing Git transport recipe.** Good sharing/bootstrap for selected notes/assets; **not live Kernel sync** and not automatic pushing. |

### Piece-level decision [inferred]

**Build native now:** identity/location seam, device namespace, versioned notes/decision schema, explicit linked graph, FTS query/filter/explain, grants, tombstones, export/import verification and asset references. These are small domain semantics Forge must own; no candidate supplies D44 acceptance or Forge's exact provenance/trust rules for free.

**Integrate now:** reuse the Graphiti descriptor/provider lane with a decisions-only pilot; provide an optional Basic Memory vault recipe and Git export recipe for people who already have those tools. A recipe is not a supported bridge. Keep one selected provider integration at a time. The default 0.1.0 acceptance does not depend on having Python, Redis, Neo4j, an LLM key or a hosted account.

**Integrate later:** continuous backup through Litestream or a chosen managed backup service; one requested server/read-sync adapter; Mem0/Letta semantic or agent-memory consumers. **Build native later on demand:** embeddings/rank fusion or richer code graph only after provider/corpus evidence and maintenance demand. Do not build a commodity sync service, graph database, auth service, vector model or concurrent editor before that evidence.

There is a concrete async seam to resolve: today `backend-registry` refuses thenables, while remote memory clients are async. Keep synchronous local recall and introduce an explicitly versioned async provider/export operation with timeout, cancellation/process lifetime, destination consent and durable delivery state; never present a rejected Promise as successful ingestion. Legacy best-effort fire-and-forget cannot be the cloud durability contract. [read: backend-registry.js:45–50,113–154; router.js:201–242; inferred]

## 5. Cross-repo skills, configs and blocks

**[inferred design; read: P3:55–115; platform-plan-final.md:1625–1628,1641–1647]** Keep one canonical authored skill tree and one immutable installed artifact cache. A device asset catalogue makes it easy to reuse an asset across projects; each project lock determines what it actually uses.

- Asset key: source/publisher + qualified name + exact release + artifact digest; interface/config schema and trust/admission receipt are separate axes. Local-development assets get an explicit source/path/content identity, not a misleading published version.
- Repo lock lists selected asset identity, capability version, permissions requested and content digest. Config composes reference + parameters + permitted overrides. Cache bytes can be shared across repos; resolved secrets, activation grants and effect permissions cannot.
- Skills retain the Agent Skills `SKILL.md` layout rather than inventing another content format. Optional metadata/dependencies may identify requirements, but execution admission remains Forge's contract. [external, 2026-10-02: [Agent Skills specification](https://agentskills.io/specification)]
- Native harness packages project contained, read-only installed assets. Links are owned and path-checked; required link failure refuses with a repair. Approved managed copies are a separately proved option with digest/drift/restore behavior. Do not copy one mutable global skill into every repo and call them synchronized.
- Updates produce a proposed lock diff and new admission/effect checks. Automatic catalogue/download refresh does not activate changed code or instructions. Rollback selects the previous exact release/digest; running sessions retain their admitted version until the supported restart boundary.
- User/device config holds convenience defaults; shared templates/blocks hold portable non-secret composition. Project-required checks and protected gates survive personal overrides. Invocation overrides operate only inside the permitted schema/grant boundary.
- Marketplace records discover assets and carry exact-release verification/provenance. They point to existing npm/Git/native host distribution. Trust is local and explicit, signatures are evidence of origin/integrity, and an index listing is not runtime approval. Private/team assets use the same identity/lock contract without public publication.

This reuses the marketplace's four identities and native packaging work rather than adding a second registry/installer. A cross-project lesson can suggest a skill release through a graph edge; the user/agent still validates and admits it in the destination project. Sharing a skill's bytes must not share the source repo's private memory or credentials. [inferred]

## 6. Cloud: 0.1.0 seams and staged 0.2 implementation

### 6.1 What 0.1.0 must ship [inferred recommendation]

1. **Local repo + device journey:** initialize explicitly, store a project note/decision, store an approved user lesson, recall in allowed scopes, restart, link to issue/PR/code/skill, supersede/forget, export/restore with provenance. Device knowledge is functional, not an empty cloud placeholder.
2. **Identity/location:** UUID marker/registry/resolver and authority descriptor, safe Model A activation/migration path. If relocation is staged independently, name the old physical path honestly and keep the public identity/seam stable; never claim full Model A until all writer/readback paths pass.
3. **Stable contracts:** portable record/version/link/tombstone envelope, command-versus-knowledge distinction, export manifest and source hashes, grant/destination/purpose schema, async delivery boundary and readiness/error states. No dead vendor adapter just to reserve a name.
4. **Side-effect-free reads:** initialization/migration lives under authorized setup/upgrade; recall/query/explain cannot create a database, import old notes, emit provider payloads or write usage without a separately granted telemetry effect. Optional automatic recall remains bounded and fail-open for the harness; a required capability consumer still receives INCOMPLETE.
5. **Asset sharing:** selected exact-version asset references/cache/locks and canonical native projection. Reuse P3/P7/P10 implementation and proof, not an extra packaging system.
6. **Privacy defaults:** no automatic cloud/provider upload, transcript capture or whole-repo indexing. Store destination grants separately from returned knowledge. Export previews show permitted classes and omissions.

### 6.2 Transfer contract [inferred design]

Use a versioned logical envelope rather than remote SQL access:

```json
{
  "schemaVersion": "forge.knowledge.transfer/1",
  "operationId": "<stable-id>",
  "datasetId": "<qualified-dataset>",
  "recordId": "<qualified-record>",
  "versionId": "<immutable-version>",
  "parentVersionIds": [],
  "originDeviceId": "<device-id>",
  "kind": "decision",
  "operation": "put",
  "contentHash": "<digest>",
  "payloadRef": "<authorized-object-ref>",
  "consentRevision": "<current-grant-revision>"
}
```

Server derives authenticated actor/account; client metadata cannot assert another actor. Export manifest additionally binds project/authority ID+epoch, schema versions, accepted cursor where applicable, object sizes/hashes and record counts. Ordinary notes name causal parent versions; Kernel **commands** separately carry expected entity revision, current authority epoch, config/effect approval and idempotency. Reusing an operation ID with changed content is rejected. An immutable blob/record transfer never applies raw SQL to authority tables.

**Selected data:** notes/decisions and approved links; permitted non-secret configs/asset locks; Kernel snapshots for backup and accepted-event projections for shared mode. **Excluded by default:** live lease/session/process state, absolute paths, secrets/key stores, raw prompts/transcripts/tool logs, arbitrary source, private provider caches and embeddings. Code references sync as locators/digests; source payload is a separate dataset consent. Rebuild FTS/graph projections locally from permitted source records.

### 6.3 0.2 increments [inferred recommendation]

| Increment | Delivered behavior | Provider/native split | Honest limit |
| --- | --- | --- | --- |
| **Cloud backup** | Opt-in project/device snapshot export, encrypted upload, list/verify and restore to isolated staging | Native manifest/consistent snapshot/restore checks; existing object storage/auth or backup provider supplies commodity transport/durability | Backup acknowledgement is not synchronization or multi-device issue authority. No raw copying of an active WAL database. |
| **Cross-device knowledge** | Selected immutable note/decision/link versions, resumable upload/download and explicit conflicting versions/deletions | Native minimal record rules/outbox; choose one transport. Existing vault/cloud is an optional bridge when already operated. Avoid a generic collaborative editor. | Offline knowledge edits can persist; shared acknowledgement and conflict remain visible. No active issue claims through this path. |
| **Shared Kernel pilot** | One authoritative command endpoint, scoped accepted feed, checked authority handoff and client fencing | Reuse Kernel command semantics; evaluate one actual server/database provider behind the public API, not several in parallel | Required before advertising active cross-device issue/workflow writes. Offline clients read/draft only. No automatic local promotion during outage. |

This **changes the current decision 11 default** from backup/read-only cloud toward actual note synchronization; shared authority remains a separately gated pilot. It does not quietly turn every project into shared mode. Existing cloud-hosted UI/backend scope should be re-sequenced against knowledge value and one-owner capacity rather than added on top without a new estimate. [read: platform-plan-final.md:1629; inferred]

### 6.4 Encryption, consent, conflicts and recovery [inferred design]

- Use TLS and authenticated scoped APIs. Encrypt selected backup/knowledge payloads on-device with a standard authenticated-encryption implementation and user-controlled keys; envelopes reserve cipher/key ID/nonce/tag, schema and authenticated identity metadata. Use fresh nonces and verified hashes; no bespoke cryptographic protocol.
- Keep keys in the user's secure local key storage, never synced in repo/config envelopes. A new device needs deliberate key enrollment/recovery. Lost user keys can make opaque backups unrecoverable; optional recovery is an explicit distinct choice. Local SQLite with FTS is not automatically encrypted by the Node built-in: OS disk protection/access controls are the local floor, and an encrypted DB provider changes search/driver/backup proof.
- Opaque backups/private-note sync permit local decrypted FTS. A shared Kernel must inspect enough issue/actor/lease/revision fields to validate commands; service-readable authority metadata plus at-rest encryption is not full E2EE. Do not promise server search of opaque payloads, hidden metadata or encrypted collaborative authority without another design.
- Consent selects user/project + dataset/kinds/fields + destination + purpose + expiry/retention. Graphiti/LLM extraction is a separate destination/purpose, not inherited from cloud backup. Recheck current consent before retrying queued uploads; revocation blocks future delivery and schedules permitted cache/provider deletion.
- Deduplicate only inside an authorized dataset/tenant boundary; a content digest is not an access token. Do not leak forbidden existence through graph titles, match counts, remote object lookup or provider errors.
- Preserve concurrent note branches; no silent last-push resolution of adopted decisions. Configuration conflicts require reviewed revision changes. Protected issue state uses expected revision/authority acceptance and returns refusal, not conflict auto-merge.
- Keep deletion/revocation watermarks through compaction. Stale devices beyond retained history must re-bootstrap and quarantine their old drafts rather than reinsert deleted data. Provider delete/forget is pending until acknowledged; retained backups follow a disclosed expiry policy, not an immediate-erasure claim.
- A grant revocation cannot retract data already copied by an app/offline former member. Record the cutoff, rotate relevant credentials/keys where needed and state the retention limits. Restoring an issue backup fences/revalidates authority and invalidates live leases; raw history does not revive an active claim.

## 7. Delivery cost, risks and plan decisions

### 7.1 One maintainer plus agents [inferred, unmeasured]

The owner is the only human; agent work can run in independent lanes, while contract decisions, integration, personal-data migration, trust enrollment and final review serialize on that owner. A worker-day is an estimated bounded implementation/proof unit, not a guaranteed elapsed day or evidence that an agent completed it.

| Local 0.1.0 work | Gross worker-days | Focused owner-hours | Main dependency |
| --- | ---: | ---: | --- |
| UUID/registry/location seam and guarded Model A migration | 6–10 | 3–5 | Storage contract, all-five migration owner |
| Device notes, version/provenance and typed decisions | 5–8 | 2–4 | Identity/scope contract |
| Linked entity/edge projections, FTS/context/freshness API | 5–9 | 3–5 | Owning Kernel/read contracts |
| Cross-repo asset locks/cache integration | 2–4 | 1–2 | Existing catalogue/native asset work |
| Public types, MCP/native query handler wiring | 2–4 | 1–2 | Existing P7/P10/host lanes |
| Privacy/deletion/restore/concurrency acceptance and docs | 3–6 | 3–5 | All above |
| **Gross local slice** | **23–41** | **13–23** | One integration owner |

Much of identity/export/Memory, assets, MCP/types and personal migration is already in the integrated plan. **Do not add 23–41 to its total unchanged.** A provisional incremental allowance is **14–24 worker-days / 9–15 owner-hours** for device namespace, graph/context, history/privacy and added proof; this is a planning estimate pending task-level reconciliation. Native local scope may occupy roughly **4–7 calendar weeks** with useful parallel agent work and available owner review, overlapping other release lanes; this is not a promised release-date increment. Replace the plan's “commission operators” wording with the owner's actual time slots. [read: north-star.md:28; platform-plan-final.md:1622; inferred]

Later: encrypted backup + minimal note-sync pilot **8–14 worker-days / 5–8 owner-hours**; shared Kernel pilot **12–22 / 8–14**, excluding broad team admin/hosting/UI; optional Graphiti enforcement/provider proof **3–6 / 2–4**; Basic Memory reference/export recipe **1–2 / 1**. Full bidirectional vault integration and a native semantic/code engine are not included. Budget ongoing cloud/provider triage separately (initial allowance **4–8 owner-hours/month**, to revise from measured incidents/bills). No vendor RAM, service price or cost saving was measured here. [inferred]

**Acceptance before support [inferred, not executed]:**

1. Two worktrees and a moved checkout retain project identity and one writer; cloned marker cannot silently create another issue authority. Model A migration preserves every named object across all five required personal projects and has readback/rollback.
2. A project-only/CI grant cannot retrieve another repo/device note, graph endpoint, count or provider payload. Recall preview performs no write or migration. Oversize input and cyclic traversal terminate with declared caps/status.
3. Notes/decisions survive process restart; update/delete/rebuild preserves FTS consistency; source/provenance/version/legacy fields survive export/restore. Forget excludes data from search/edges and does not resurrect on a stale-device replay.
4. Connected issue→decision→PR→code→skill context has exact source identity and freshness; stale graph/index cannot authorize a claim/close/protected action. A provider suggestion cannot replace accepted Kernel facts.
5. Graphiti receives only consented decision projections; missing, timed-out, changed-destination and failed-delete cases remain explicit. No source/transcript/code-graph ingestion via the Forge provider path.
6. Two offline note edits preserve both branches. Duplicate/lost upload acknowledgements are idempotent. Revoked consent blocks queued delivery. Wrong key/tampered backup restore refuses before writer activation.
7. Two devices contend for a shared issue: only server-accepted claims operate; expired/revoked/old-epoch leases refuse; network outage never starts an equivalent local writer. Snapshot/handoff/rollback fences are proven before shared support.
8. Packed one-package Node 24/26 consumers and required native harness profiles exercise the same public handlers. External-provider support earns its own installed/restart/cleanup receipts, not a descriptor badge.

### 7.2 Material risks and smallest response [inferred]

| Risk | Smallest response |
| --- | --- |
| Model A relocation loses data or leaves two writers | Separate guarded migration, consistent backup, complete readback and retired-path refusal; no lazy read-time conversion. |
| Device memory leaks one project's confidential context into another | Explicit scope grants/promotion, isolated datasets, per-hop filtering and no hidden counts; defaults stay private. |
| Notes or inferred graph facts masquerade as policy/issue acceptance | Typed provenance/trust, owning Kernel re-read, command/grant separation; keep recalled text fenced. |
| Derived issue/code graph goes stale | Source revision/blob/cursor binding, explicit freshness and incremental/rebuildable projections; skip a native code parser now. |
| Async provider hangs, loses delivery or remains alive after CLI exit | Separate async contract with bounded process lifetime, durable outbox/ack, no success on queued/failed ingestion. |
| Cloud conflict resurrects deleted decisions or claims | Version branches/tombstones for knowledge; server CAS/fencing and non-restorable leases for authority. |
| Many projects consume excessive RAM or rebuild synchronously | Lazy bounded DB cache, FTS/reference graph, no always-on model services; isolate rebuilds and measure the real MCP process. |
| One owner is buried in provider/platform upkeep | One optional provider pilot, staged cloud, reuse host formats/services and expose support limits; expand only after demand. |

### 7.3 Which platform §10 decisions change

| Existing decision/topic | Required P12 disposition [read/inferred] |
| --- | --- |
| **Memory/code-graph (30), DECIDED** | **Clarify/extend native scope** under newer north-star item 16: repo + device work knowledge and explicit connected references. Keep local default, Graphiti decisions-only and separate Graphify. Explicit references are not the rejected native full-code graph or a semantic default. Do not reopen the rejected choices. [read: platform-plan-final.md:1661; north-star.md:35–38] |
| **First cloud (11)** | Add actual scoped note/decision synchronization after backup; shared Kernel is separately gated and required for active issue work. Re-sequence hosted UI/backend costs against this priority. No parallel writable Kernel. [read: platform-plan-final.md:1629] |
| **Config layers (8)** | Add a narrow user/device-default layer with explicit order/privacy and no protected override. Team hierarchy can wait. Document the difference between a preference and an activated composition/policy. [read: platform-plan-final.md:1626] |
| **Skill links (7), one catalogue (20), distribution (23)** | Reuse exact identities/immutable cache/repo locks and owned links; device reuse does not create mutable mirrors or another public marketplace. [read: platform-plan-final.md:1625,1641,1647] |
| **Build/adopt (25), Node floor (41)** | Keep native FTS/provenance/domain links; external semantics/sync/backup are optional. Add the current PowerSync built-in-driver limit and distinguish Turso Sync from libSQL replicas. Node 24 probe does not certify every provider/patch/Node26. [read: platform-plan-final.md:1651; external sources §4] |
| **MCP (21), native transport (37), public types (43)** | Add rich context/scope/provenance operations behind the same handler owner; preserve named two-field notes projection and separate async provider contracts. Do not duplicate storage per harness. [read: platform-plan-final.md:1643,1675; notes projection:398–433] |
| **Resources (4), migration/release proof (3)** | Reconcile gross/incremental P12 estimates into one-owner capacity; identity/data migration still needs all-five real readback. No invented operator team, no gate weakening. [read: platform-plan-final.md:1621–1622; north-star.md:28] |
| **Visualization (12), OpenAI remote surfaces (19)** | These consume the scoped state/knowledge API later; neither a UI nor remote MCP can become a private database/authority side door. [read: platform-plan-final.md:1630,1639] |

Also update the accepted Model A ledger and storage reference when implementation is commissioned: identify shipped versus planned layout, remove superseded Beads live-feature clauses, distinguish device knowledge from issue authority and retire historical `serve` rationale. This phase makes none of those edits or tracker mutations. [read: docs/PROJECT_DESIGN.md:576–583; storage reference:21–28,41–51,86–123; common.md; inferred]

## Research execution and limits

Executed: shared rules and skills; bounded remote-ref source reads/searches; draft reconciliation; source-drift checks and file census; primary web documentation; metadata-only home/repo storage census; immutable read-only database counts; direct Node FTS5 and existing-driver in-memory probes. No browser, context-mode tools, installed candidate, cloud integration, full suite, commits, pushes, GitHub write or Kernel mutation was used. [ran]

Tool buckets were **orientation/source inspection**, **external comparison**, **narrow runtime verification**, **report writing/readback**, and **rework/waiting**. The largest avoidable waste was oversized numbered source output, followed by re-reading smaller extracts; Node child-process Git was blocked with EPERM, so remote reads used native PowerShell Git. Large streaming reads were cancelled; no hung call was allowed to exceed the two-minute fallback threshold. The Node normal read-only DB attempt failed; immutable Python inspection recovered the bounded metadata facts without changing the database. [ran]

Unverified: large-corpus latency/RAM, provider total dependency/binary size, exact provider release pins/OS support, installed cloud/harness behavior, Node26 runtime, true concurrent migration/sync/fencing, encryption/key recovery, provider deletion and full restore. No deletion savings or productivity uplift is claimed. [ran/inferred]

## Bottom line (10 lines for the owner)

1. Keep the existing SQLite FTS5 floor; it passed the narrow Node 24 and Forge-driver probes. [ran]
2. Implement stable UUID/location resolution; Model A is accepted text ahead of current defaults. [read]
3. Add private user/device work knowledge and explicit scope grants in 0.1.0. [inferred]
4. Connect issues, decisions, notes, PRs, code references and skill releases with bounded SQLite links. [inferred]
5. Keep Kernel issue/workflow acceptance separate from recalled knowledge and graph projections. [read/inferred]
6. Retain optional decisions-only Graphiti and separate code-graph providers; prove their boundaries. [read/inferred]
7. Reuse existing asset distribution and exact locks for cross-repo sharing. [inferred]
8. Stage cloud backup, then note sync, then one authoritative cross-device Kernel pilot. [inferred]
9. Reconcile 23–41 gross worker-days into existing work; one human remains the integration bottleneck. [inferred]
10. Do not advertise multi-device issue safety, semantic gains or full Model A before their actual acceptance runs. [inferred]

## Recommended plan changes

1. Replace “project/decision memory only” with **“scoped work knowledge: project and device notes/decisions, connected source references and optional enrichment; the Kernel owns issue/workflow state.”** Preserve host-owned conversation memory and the absence of a core agent loop. [read: P5:106,112–120; north-star.md:35–38; inferred]
2. Add a small Knowledge capability family to the functional block catalogue; reuse notes/FTS, typed APIs, Kernel delegation and provider registry. Publish rich context separately from the locked advisor notes projection. [inferred]
3. Make Model A's UUID/resolver/migration state explicit and add device identity/data ownership. Never infer one cloud project from a filesystem path, or silently attach copied markers as another issue writer. [inferred]
4. Add repo/device grants, causal versions, tombstones, provider delivery/deletion receipts and side-effect-free reads to local acceptance. Separate recall usage telemetry from read permission. [inferred]
5. Extend decision 11 with note/decision sync; stage shared issue authority distinctly and re-sequence optional hosted UI/backend work. Integrate backup/transport rather than build WAL shipping or a general sync engine. [inferred]
6. Refine decision 30 without reopening it: native reference graph now, Graphiti decisions-only, code graph separately optional, embeddings/native code analysis later on measured demand. Add an enforced provider projection before claiming restricted ingestion. [inferred]
7. Add device asset cache/reference/lock mechanics to existing catalogue/canonical skill work; retain exact identity, normal trust, previous-version rollback and no automatic activation. [inferred]
8. Reconcile §6 costs and §10 resource assumptions for one maintainer, with P12 incremental work and shared MCP/types/migration tasks counted once. File adopted implementation follow-ups only in a later authorized planning phase. [inferred]

## Open questions for the owner

Letters are choices within each named topic, not capability identifiers. Silence selects the planning default; it authorizes no implementation, install, spending or transfer.

1. **Cloud knowledge versus active issue work**
   - **A — Default:** 0.2 first proves encrypted backup and selected note/decision sync; a separately gated shared-Kernel increment earns active cross-device issue support afterward.
   - **B:** include the shared-Kernel pilot in the first 0.2 supported scope, budgeting authority/membership/fencing proof and deferring hosted UI/backend breadth.
   - **C:** use an existing opted-in personal vault/cloud bridge first; Forge issue authority remains local until the shared pilot.
   - **Reasoning:** A supplies cross-device knowledge at lower operational cost and keeps the claim boundary honest. B is required if doing the same issue from two devices is the first promised journey. C is fastest for an existing vault user but must not be called Forge Kernel sync. **Default: A.**

2. **Optional memory-provider investment**
   - **A — Default:** one pinned Graphiti decisions-only proof lane; Basic Memory reference/export recipe; Mem0/Letta/bidirectional vault integration waits for a named consumer.
   - **B:** fund a Basic Memory read/export adapter now for an existing personal vault, preserving its file ownership and Forge source IDs; no dual-writer sync yet.
   - **C:** keep provider documentation/seams only for 0.1.0 and fund the native device/reference-graph journey first; optional providers remain explicitly unproved.
   - **Reasoning:** A preserves the settled Graphiti choice and offers a lightweight integration route without promising every engine. B is useful if the owner's actual notes already live in that vault. C protects release capacity but postpones demonstrated provider value. **Default: A.**

3. **Connected graph depth at launch**
   - **A — Default:** authored/source-backed references, FTS5 search and bounded one/two-hop context in 0.1.0; richer extraction/code parsing remains optional and later.
   - **B:** include a demand-driven semantic-provider corpus experiment in the local release work, with separately costed privacy/deletion/installed proof and no default embeddings.
   - **C:** require a separate functional graph provider in the first release instead of native reference traversal, funding its offline/OS/provenance integration proof.
   - **Reasoning:** A makes the requested graph useful with the smallest maintained domain model. B can establish whether semantics improve recall. C shifts implementation to an engine but still leaves identity, trust and authority work in Forge and adds a runtime dependency for graph users. **Default: A.**

**Valid reply:** A/B/C for a named topic, a combination in topic order, or silence. **Default: A+A+A.** Model A's accepted storage direction, D44 authority, local default, Graphiti decisions-only, separate code graph, one package and Node 24/26 targets are preserved.

## Confidence

- **High — inspected current facts:** remote snapshot/resolver/schema, accepted Model A text, current CLI/router/registry behavior, sampled database counts and size, direct FTS5 and existing-driver behavior on installed Node 24.18.0. These establish read/runtime rungs for specific facts, not live cross-device support.
- **Medium — design and integrate/build verdicts:** based on source ownership and primary provider APIs/docs, with explicit limits. The native reference graph and scopes are plausible extensions; provider integration, startup/RAM and cost reduction have not been measured.
- **Low/unverified — delivery dates and cloud safety:** estimates are one-owner planning allowances. Full migration/restore, adversarial scope tests, causal sync/delete, key enrollment, shared claims/fencing and required installed harness/Node26 proof still need authorized implementation and execution.
- **Phase outcome:** one research report with source-backed findings and a proposed plan; no released feature, provider installation, authority change or tracker update is claimed.
