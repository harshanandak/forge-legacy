# Forge rebuild — plan of record

Date: 2026-10-16. Revision: round 2 (after [rebuild-plan-review.md](rebuild-plan-review.md) and [rebuild-plan-review-r2.md](rebuild-plan-review-r2.md)). Status: **approved plan of record — decisions settled; new repo creation awaits owner go-ahead.** All 17 decisions in [rebuild-decisions.json](rebuild-decisions.json) were settled on 2026-10-16 (see "Decisions — settled 2026-10-16" below; IDs are stable, so 6 and 16 are retired and not reused). Nothing here is built, installed or proven yet.

**Evidence marks.** `[read: file:line]` = taken from an input file in this folder (or the old plan, shown as `plan:line`). `[read-code: path:line]` = read from the read-only snapshot `origin/master`. `[inferred]` = my design judgement. File names without a folder are in `docs/work/2026-10-16-platform-rebuild/`. The old plan is `../2026-09-30-forge-final-plan/platform/platform-plan-final.md`.

**Precedence used.** The owner's rules in [brief.md](brief.md) win. Then newer evidence (the 2026-10-16 surveys and inventories). Then the old plan and its 47 decisions, which the owner answered "all defaults" on 2026-10-04. Every overturned old decision is listed in §14.2. Anything the brief already decides is stated as settled, not offered as a choice.

---

## Decisions — settled 2026-10-16

The owner answered on 2026-10-16: "3A (note: most agents already use tool search), 8B (note: tests need to be focused on e2e success rather than just writing tests), all others default." Every decision below is settled; none is open. Detail and rationale per decision are in [rebuild-decisions.json](rebuild-decisions.json).

| # | Decision | Settled as |
| --- | --- | --- |
| 1 | Plain names for the building blocks | **A** — plain names (work, memory, context, check, git, pr, github, policy, workflow, skills, project, migrate, one block per harness; core: block, config, template, catalog, state, host, doctor). Kernel, Contracts, Flow, Shepherd, gate and rails stop being product words |
| 2 | Command shape | **A** — short `forge <noun> <verb>` commands; a noun clash is refused when the block is added and fixed with a one-line rename in config |
| 3 | How many Forge tools agents see through MCP | **A** — stable, admitted, agent-callable operations up to a budget (default 40), plus `catalog_list`, `catalog_describe`, `catalog_call` for the rest. *Owner note: most agents already use tool search.* Applied: harness tool search is relied on to keep context small; the budget exists for hosts without tool search and is configurable; the discovery tools stay for everything beyond it |
| 4 | Command-line output | **A** — JSON always; `--format text` for people |
| 5 | Config file format | **A** — YAML via the `yaml` package in strict mode behind one adapter |
| 7 | Local git hook help (always opt-in) | **A** — point to the user's hook manager; a tiny hook (at most 10 lines) only where none exists and only on request |
| 8 | Optional "the new tests catch the bug" check in the delivery template | **B** — optional check, off by default. *Owner note: tests need to be focused on end-to-end success rather than just writing tests.* Applied: the optional check proves the end-to-end journey succeeds and the regression is caught, not that tests were written; and every lane's acceptance (§9) and the 0.1.0 release proof (§11) are stated as end-to-end outcomes on the real artifact, not test counts or test-writing steps |
| 9 | File format for blocks other people write | **A** — single CommonJS file for 0.1.0; ES modules after a proof |
| 10 | What the first working slice proves | **A** — outside block plus project detection first |
| 11 | Minimum Node version for users | **A** — Node 24.15 or newer, plus Node 26 |
| 12 | How releases are cut and published | **A** — version pull request plus automatic publish (trusted publishing, registry readback before promoting) |
| 13 | Single-file binary downloads | **A** — no binaries in 0.1.0 |
| 14 | Automatic re-running of failed CI checks | **A** — no automatic reruns; an explicit rerun operation that records the evidence |
| 15 | Mutation testing in our repo | **A** — targeted remove-the-fix checks only; no mutation tool |
| 17 | Is curapod part of the must-migrate set? | **A** — yes, a sixth must-migrate project |
| 18 | What to do with the old Forge backlog | **B** — move recent open issues; archive the rest (archived issues stay readable by ID, links kept) |
| 19 | How many lanes run at once | **A** — 4–5 lanes at once |

---

## 1. Bottom line

1. **We build a new project, contract first.** It ships as the same npm package `forge-workflow`, with the CLI `forge`. The npm name `forge` belongs to someone else [read: brief.md:10; naming-and-block-authoring.md:17].
2. **The core is small and knows no workflow.** It holds the schemas, the block contract, the catalog, the config and template API, one resolve → bind → admit → invoke path, a single state owner, trust and limits, and the generated CLI and MCP. Nothing in core mentions stages, TDD, PRs or issues [read: brief.md:24; architecture-evaluation.md:43–53].
3. **Everything else is a block**, ours or the user's: issue tracking, memory, checks, git, PRs, policy, the workflow runner, skills, project detection and every harness adapter. A user adds a block with one manifest, and it appears in the CLI and MCP without any change to core (§4).
4. **No hand-written commands.** Each block declares its operations once (`noun.verb` plus schemas, effects, context and who may call it). The CLI is `forge <noun> <verb>` and MCP tools are `<noun>_<verb>`. Both are generated from the catalog [read: brief.md:36; naming-and-block-authoring.md:229–310].
5. **A fresh install switches nothing on.** When nothing is configured, Forge reads the project and shows a derived config that mirrors how the user already works, with every value traced to its source. The user can accept it, change one thing at a time, or import a template as an editable copy. Our own workflow is one template (`forge/delivery`) among others [read: brief.md:48–52].
6. **Working engines come over with their tests, one block at a time.** The engines are the old Kernel (issue authority), Contracts (canonical hashing, validation), Memory and Flow (single-operation runtime, process lifecycle). Each hard-won fix comes over as a behaviour test. **The default disposition is DROP.** The CLI inventory alone marks 37% of its 80,888 lines DROP; the extra cuts in §7 raise that, but no combined, deduplicated figure has been computed [read: brief.md:28; inventory-cli.md:19–25]. A module marked PORT in an inventory is re-checked for toolchain assumptions before it is copied (§3).
7. **Gates judge outcomes, not process.** A gate reports `PASS`, `FAIL`, `INCOMPLETE` or `NOT_EXECUTED`. Its input is the shipped artifact or an observed result. Our repo drops Lefthook, the TDD pre-commit rail, stage ladders, change classification and stage-exit comments; CI is our repo's gate. **Forge never installs or requires a hook runner, and leaves a user's own hooks, CI and workflow in place:** it detects them, works with them, and offers an adapter where it cannot [read: brief.md:42,46–52; mistakes-ledger.md:33,90–96; dependencies-and-hooks.md:28,128–143].
8. **TypeScript, ESM, Bun-first for us; any toolchain for users.** We use `bun check`, `bun lint`, `bun fmt` and `bun test`, with `tsc` only to emit `.d.ts`. Users run Node 24/26 with npm, pnpm, yarn or Bun and any language. Forge runs the project's own declared commands [read: brief.md:40–42; language-decision.md:9–16].
9. **Harnesses do what they already do well, and we say plainly where they don't.** Mandatory: Pi 1.3.x, OpenCode 2.x, Codex 0.163+. Well supported: Claude Code and Cursor. Experimental: Hermes. T3 Code is a host we observe. Capabilities differ per host (Pi has no built-in subagents, plan mode or sandbox); §5.1 lists them per host. Forge supplies shared state authority, outcome evidence, trust, handoff records and config projection, and builds no agent loop.
10. **Dependencies are judged by value, not count.** A library is welcome when it adds real value we would otherwise build and maintain, comes from a well-run, active project, fits the Bun-first build, and sits behind one adapter so it can be swapped. Each one gets a ledger entry (§6.2). The MCP protocol layer is the first entry: the official `@modelcontextprotocol/server` behind one adapter (§6.2) [read: brief.md:56; mcp-sdk-facts.md:15–25].
11. **17 lanes in 19 worktrees**, run in parallel after a contract lock, with one integration lane for assembly and real-host proof. The estimate is **114–170 agent-days and about 9–14 calendar weeks** at 4–5 concurrent lanes, against the old 92–163 days and 10–19 weeks (§12). Safe migration of the selected projects (the owner's five, plus curapod, decision 17 A) is still a release blocker (§10).

---

## 2. The core

### 2.1 What is core

Core is what every solution needs and what no block may own [read: architecture-evaluation.md:41–51; brief.md:52 "unless it is core authority"].

| Core part | What it is | Proposed name / location | Ports from old repo |
| --- | --- | --- | --- |
| **Schemas** | Versioned JSON Schemas, the one source of truth. Types are generated from them. They cover: block manifest `forge.block/1`; operation record (including its declared **context variant** and, for `leased`, its lease mode, below); the **one composition document** `forge.config/1` (block instances, per-instance config, slot bindings, exposure, template provenance); template `forge.template/1`; invocation request; execution observation (including effect outcome); result envelope; error; evidence status; state record/event; detection observation. | `schemas/*.json` → generated `src/generated/*.ts` | `lib/contracts/src/{canonical,identity,schema,validate}.js` PORT; wire fixtures PORT as migration codecs only [read: inventory-engines.md:56–66] |
| **Block contract** | The manifest, an `operations` map (`noun.verb` → input/output schema, effects, context variant, idempotent, callers, stability), a `configSchema` for per-instance config, `provides`/`requires` slots typed as `interface@major`, a docs record, and the `trusted-action-sync/v1` handler ABI (sync handler gets `{input, config, services}` and returns one JSON value; a Promise is refused) | `schemas/block.json`; author types at `forge-workflow/author` | New; the ABI is the old plan's [read: plan:337–348; naming-and-block-authoring.md:43–171] |
| **Catalog** | An immutable snapshot of installed, admitted blocks. It holds operations, assets (skills, templates) and readiness. It is computed at run time, cached by lock digest and never committed. | `src/core/catalog/` | New; VS Code "declare statically, activate on use" [read: naming-and-block-authoring.md:231–246] |
| **Config and template API** | Three ways in, freely mixed (§2.3). Layers: derived → project → invocation. CAS edits with readback and owned reversal. `explain` shows the origin of every value. Template import, compare, update and remove with per-key ownership (§2.3). | `src/core/config/`; nouns `config`, `template` | `config-writer.js`, `smart-merge.js`, `control-plane.js`, `forge-lock.js` ADAPT [read: inventory-cli.md:191,193,206,269] |
| **Runtime path** | `resolve → bind → admit → invoke`. One path for CLI, MCP, hooks and the library API. Resolve and bind never import code. | `src/core/runtime/` | Flow `skill-runtime.js` ADAPT, `executor.js` ADAPT, `stable-stringify.js` PORT [read: inventory-engines.md:92–97] |
| **Single state owner** | The only writer of accepted records. It owns events, revisions/CAS, idempotency, leases (with their generations and fencing) and migrations. First-party domains (issues, PR links, runs, knowledge) register reviewed tables through it. Outside blocks get namespaced records through a bound `state` client. No block opens SQL. | `src/core/state/` + `src/adapters/store-sqlite/` (`node:sqlite` / `bun:sqlite`); noun `state` | Kernel `broker.js`, `sqlite-driver.js` (transaction bodies), `schema.js`, `migrations.js`, `conflict-signal.js`, `evaluators.js`, `fs-class.js`, `owned-kernel.js`, `windows-private-acl.js` [read: inventory-engines.md:29–50] |
| **Owner/lifetime port** | For built-in stateful providers only (store, process supervisor, MCP transport): explicit owned vs borrowed handles, `open`/`close`, rollback of a partial open, cleanup on startup failure. Outside sync authors get no setup/dispose hooks. | `src/ports/lifetime.ts` | New [read: architecture-evaluation.md:49,128–131] |
| **Trust and limits** | Code admission is human-only and digest-bound. Effect grants are human-only. Byte, depth and node budgets apply at the **byte/text parse boundary**; parsed objects handed in by a trusted embedding are trusted input with stated limits (no promise of trap-free traversal of arbitrary JavaScript proxies). Secret references are never plaintext. Untrusted content gets provenance fences. Agents can never self-admit. | `src/core/trust/`; ops `block.admit`, `config.grant`, `config.revoke` | Plan admission sequence [read: plan:367–369]; `untrusted-content.js` PORT [read: inventory-cli.md:275; architecture-evaluation.md:145] |
| **Generated surfaces** | Three hand-written transports: argv, MCP stdio (both MCP eras) and hook stdin. Every command, flag, help line and MCP tool comes from the catalog. | `src/surface/{cli,mcp,hook}/` | `global-flags.js` PORT, `text/levenshtein.js` PORT; `bin/forge.js`, `_registry.js` REWRITE as transports [read: inventory-cli.md:96,109,215] |

**Context variants (closed set, declared per operation).** An operation declares which context it needs, and the runtime requires exactly that and nothing more [read: architecture-evaluation.md:49,63,131; inferred]:

| Variant | Required | Example |
| --- | --- | --- |
| `stateless` | nothing beyond the caller kind | `semver.bump`, `catalog.describe` |
| `device` | actor, device scope | `memory.add` to the device store |
| `project` | actor, project identity; CAS revision on writes | `semver.mark`, `config.set` |
| `leased` | actor, session, project identity, and the operation's declared **lease mode**: `acquire` needs nothing more and supplies **no** generation; `held` needs the **current lease generation**. Exact head where the operation declares it | `issue.claim` (`acquire`); `issue.renew`, `issue.release`, `issue.close`, `pr.merge` (`held`) |

Missing values are refused **only for the declared variant and mode**. Nobody invents a repository, session or lease to write a device note or a namespaced record, and an `acquire` operation never asks for the generation it is about to create.

**Lease semantics.** A lease is one record per leased subject (for example an issue): `{holder: {actor, session}, generation, expiresAt}`. The generation is a per-subject integer that is issued only by the state owner, only increases, and is never reused. Expiry is judged by the state owner's injected clock inside the same transaction as the write. Every case below is one atomic state-owner transaction [read: architecture-evaluation.md:128–131; inventory-engines.md:30–49 (K2, `ee0954e2`); inferred]:

| Case | Operation mode | Input | Result and conflict errors |
| --- | --- | --- | --- |
| **Initial acquisition** (no lease, or the last one was released) | `acquire` | actor, session, project; **no generation**; a request ID | Creates the lease at generation `previous + 1` (1 if never leased) and returns `{generation, expiresAt}`. Two simultaneous first claimants: exactly one transaction wins; the other gets `LEASE_HELD` carrying the holder, generation and expiry, and is told to reconcile by reading, not to retry. Replaying the winner's request ID returns the original result, not `LEASE_HELD` against itself |
| **Renewal** | `held` (`issue.renew`) | the **current generation**, plus the same actor and session as the holder | Extends `expiresAt`; the generation does not change. Missing generation → `CONTEXT_MISSING` (names `leaseGeneration`). Generation that is not current → `LEASE_STALE`. Holder mismatch → `LEASE_NOT_HELD`. Lease already past expiry → `LEASE_EXPIRED`: a lapsed lease is never renewed, only reacquired |
| **Expired-lease reacquisition** | `acquire` (same `issue.claim`) | actor, session, project; **no generation** | Allowed for **any** actor and session, including the previous holder, once `expiresAt` has passed on the owner's clock. No approval is needed. The new generation is `old + 1`, and a `lease.reacquired` event records the previous holder and generation. Until expiry, the same call gets `LEASE_HELD` |
| **Mutation under a lease** (`issue.update`, `issue.close`, `issue.release`, `pr.merge`) | `held` | the current generation (and exact head where declared) | Checked inside the write's own transaction (fencing). A superseded holder gets `LEASE_STALE`, so a revived old session can never write after a reacquisition. Past expiry and not yet reacquired → `LEASE_EXPIRED` |

Conflict errors for leases are exactly `LEASE_HELD`, `LEASE_STALE`, `LEASE_NOT_HELD` and `LEASE_EXPIRED`, alongside the existing `CONTEXT_MISSING` and `REVISION_CONFLICT`. None is retried blindly. Each carries the data needed to reconcile (holder, current generation, expiry). Migration never revives a lease (§10).

**Effect outcomes.** An execution observation reports each declared external effect as `applied`, `not_applied` or `uncertain`. A request ID is not permission to retry: an `uncertain` external effect must be reconciled through the owning block's read operation before any retry [read: architecture-evaluation.md:128–129; inferred].

**Core's own operations are declared like any block's** (`forge/core`), each core area declaring its own fragment, and are generated the same way [read: naming-and-block-authoring.md:302–310]. A `*` marks a human-only operation; those never appear on MCP.

| Noun | Verbs |
| --- | --- |
| `block` | `new`, `check`, `add`, `admit*`, `remove`, `list`, `types` |
| `config` | `show`, `explain`, `detect`, `set`, `preview`, `apply`, `revert`, `save`, `grant*`, `revoke*` |
| `template` | `list`, `show`, `import`, `compare`, `update`, `remove` |
| `catalog` | `list`, `describe`, `call` |
| `state` | `show`, `events`, `export`, `restore` |
| `host` | `setup`, `status`, `hook` (`forge host hook --event <name>`; reads the host payload on stdin and dispatches to the selected host adapter block) |
| `doctor` | `run` (default verb) |

`block add` is the convenience path an agent needs: it runs `check`, captures the files and digest, reuses a still-valid matching admission if one exists, and otherwise stops at `INCOMPLETE / ADMISSION_REQUIRED` with the exact command for the human. No extra ritual, no manufactured trust [read: architecture-evaluation.md:139–143].

### 2.2 Naming (one convention)

The convention is the naming memo's grammar, adopted unchanged [read: naming-and-block-authoring.md:316–346]:

- **Segments** are kebab-case and **keys** are lowerCamel.
- **Block ID:** `publisher/name`, where the publisher is reverse-DNS and `forge` is reserved.
- **Operation:** `noun.verb`.
- **Each surface uses its own separator.** CLI: `forge noun verb`. MCP: `noun_verb`, at most 48 characters. Permission key: `blockId.noun@iface#verb`. Event: `blockId:noun.past@1`.
- **Name collisions are refused** at `block add`. The fix is a local `rename:` in config. Install order never decides [read: naming-and-block-authoring.md:364–373; brief.md:52].
- **No shipped shortcuts.** Forge ships one name per operation (brief.md:36). Users may map their own names in config (`rename:`), resolved through the catalog like any name. The migration rewrites project docs that use old short verbs (§10).

**Block names.** I use the memo's plain names, with one correction. The memo's `forge/work` held both issue tracking and accepted run records. That would put a workflow concept (runs) next to a tracker. So:

- Generic accepted records, events and leases live in core `state`.
- `forge/work` owns only issues.
- Runs belong to `forge/workflow`.

"Kernel", "Contracts", "Flow", "Shepherd", "gate" and "rail" stop being product words. This is settled (decision 1, A) [inferred; read: naming-and-block-authoring.md:407–421; brief.md:36]. Command shape is decision 2.

### 2.3 The three ways in (config)

| Way | What the user or agent does | Core behaviour |
| --- | --- | --- |
| **1. Do nothing (adaptive)** | Run any `forge` command | `config.detect` runs the installed detector operations (from `forge/project` and, where selected, `forge/github`). It produces a **derived layer**: detected package manager, declared commands (test/lint/typecheck/build in any ecosystem), hook managers, CI and required checks, tracker signals, decision-record format, approval habits, and branch/PR habits. Each value carries `origin: {detector, file, pointer}`. The derived layer **never enables a gate, hook or rail**. It only fills values that operations need, such as which command `check.run` executes. It is re-derived when its source files change. `config show --origins` and `config explain <pointer>` show it [read: brief.md:52; inferred]. |
| **2. Configure on the go** | `forge config set check.commands.test "pnpm vitest run"`, or `preview`/`apply` with a patch | One CAS edit to `.forge/config.yaml` with expected revision, whole-plan validation, readback and an owned-reversal receipt. The explicit value overrides the derived one, and the derived value stays visible as "overridden" [read: plan:580,600,616]. |
| **3. Import a template** | `forge template import forge/delivery` (or a path or installed package) | **Settled by the brief, not a choice:** the template's config is copied into project config as plain, editable config (brief.md:48). Each copied key records ownership `{from: forge/delivery@0.1.0, baseline: <digest of the imported value>}`. There is no hidden pinned layer. |
| **Save** | `forge config save` | Writes the current derived values into project config, so they stop depending on detection. |

**Template lifecycle (all previews first, all explicit):**

- `template compare <id>` shows upstream changes against the imported baseline, key by key.
- `template update <id>` applies a previewed set of upstream changes. Keys the user has edited since import are reported as conflicts and left alone unless the user picks the upstream value.
- `template remove <id>` reverses only keys that are still owned by that template **and** still equal their baseline; keys the user edited are kept and listed; host artifacts are removed only through their owned-file receipts. Removing every template returns the project to the adaptive layer.
- Tests (L4): two templates imported into one project, a user edit after import, explicit removal, and switching back to adaptive [read: brief.md:48–52; inferred].

Layers, from low to high: **derived → project → invocation**. The old plan's "platform defaults" and "pinned template" layers are removed (§14.2, old decision 8, decided by brief.md:48). Protected constraints sit outside precedence. Those are authority, admission, owner checks at effect time, and secret refs [read: plan:602].

### 2.4 What is a block on top (not core)

Everything in §3:

- issue tracking (`work`)
- knowledge (`memory`)
- orientation and handoff (`context`)
- running the project's checks (`check`)
- git workspaces, push and opt-in git hooks (`git`)
- PRs, review threads and guarded merge (`pr`, `github`)
- policy rules and human approvals (`policy`)
- the template runner (`workflow`)
- skills discovery (`skills`)
- project detectors (`project`)
- the old-store converter (`migrate`)
- every harness adapter
- every template, including ours

The **12 places where the old code or plan let the workflow leak into core** are all closed this way [read: architecture-evaluation.md:59–72; inventory-cli.md:33–41]. Two guards enforce it. A lexical boundary test fails if `src/core/**` or `schemas/**` contains `stage`, `tdd`, `premerge`, `shepherd`, `pull request`, `pr_number` or `issue` outside a test allowlist. Because a word list cannot prove semantic independence, the semantic proof is behavioural: `forge/starter` and the stateless, device and connected non-delivery fixtures (L1) run with no delivery block installed [inferred; read: rebuild-plan-review.md:35].

**Trackers.** `forge/work` is Forge's own tracker and is optional. If the project uses another tracker (GitHub Issues, Linear, Jira), detection reports it and Forge says plainly that 0.1.0 ships no adapter for it. The `issue.*` operations are declared against an interface `forge.tracker@1` (L1), so a tracker adapter block can provide them later without touching core. Old GitHub issue sync code is still dropped [read: brief.md:46,52; inventory-cli.md:311–318; inferred].

---

## 3. Blocks and templates

Each first-party block ships inside the one package as `src/blocks/<name>/` with its own manifest, schemas, docs record and tests. "Ports" cites inventory rows. "Drops" lists what stays behind. A `*` marks a human-only operation.

**PORT re-check (new rule).** Before any module marked PORT is copied, its owner greps it for toolchain and Forge-suite assumptions (`bun`, `npx`, `eslint`, `lefthook`, `vitest`, `jest`, internal test paths, `forge-full-suite`, push modes). Any hit turns it into ADAPT: the behaviour and its regression tests come over, re-expressed over declared commands and ports; the assumption stays behind. The inventories' PORT labels do not override brief.md:42 [read: rebuild-plan-review.md:15,59; inferred].

| Block | Purpose | Operations | State it owns (via the state owner) | Ports | Drops |
| --- | --- | --- | --- | --- | --- |
| **`forge/work`** | Forge's own issue tracker (optional; implements `forge.tracker@1`) | `issue.create, update, show, list, ready, blocked, stale, claim, renew, release, close, comment, dep, link, lint` (`claim` acquires, the rest of the leased ones are held; §2.1 lease semantics) | issues, dependencies, claims/leases, comments | Kernel issue/claim stores from `broker.js` and `sqlite-driver.js` ADAPT. Also `issue-command-contract`, `taxonomy-validator`, `lease-enforcer`, `live-claim-projection`, `readiness-model`, `issue-id-resolver`, `claim-reconciler`, `forge-issues`, `_issue.js`. Fixes K2 (expired-lease re-acquire `ee0954e2`), K3, K5, K9 (`05538ad7` envelope parity), `34d7ee42`, `e919d3c6` per-agent actor [read: inventory-engines.md:30–49,177–185; inventory-cli.md:107,205] | Stage-transition parsing in comments (`stage-transition.js`), backend selector, GitHub issue sync (`lib/issue-sync/*`), the kernel-tracking rail, the 11-type sprawl (types validated, unknown refused), planning buckets (no named consumer) [read: mistakes-ledger.md:92; inventory-cli.md:311–318] |
| **`forge/memory`** | Durable scoped knowledge (project and device) and decision records | `memory.add, search, show, forget, export, restore`; `decision.propose, adopt, list` | notes, decisions, versions, FTS, bounded links. Knowledge tables have their own migrations; the device store opens knowledge tables only, under the `device` context | `memory/router` ADAPT (config through port), `typed-api` ADAPT, `hygiene` PORT, `usage-evidence` PORT, `backend-registry` ADAPT, `project-memory`, `memory-recall`, `memory-recall-events` PORT. Fixes `0c562271` (concurrent Windows writes), `65e62b43`, `c47a722b`, `2140e114` provenance fence [read: inventory-engines.md:103–118; inventory-cli.md:229–231,251]. `decision.*` uses the project's detected record format and numbering (for example curapod's D-NNN) [read: threads-consumers.md:27] | `graphiti-mcp.js` (provider port only), `insights`, the `usage-evidence` shim, `feedback-intake` (no consumer), the one-time legacy JSONL import inside recall [read: mistakes-ledger.md:66; inventory-engines.md:107] |
| **`forge/context`** | Orientation and cross-harness handoff | `context.show` (bounded envelope: issue/run, live leases, head, pending checks, pending review state, recent memory, next step); `context.handoff` (writes a typed handoff record) | handoff records: head SHA, pending review threads, identity of uncommitted work (a digest of the working-tree diff and its base), evidence, next step | `recap.js` ADAPT (`ba1e48e8`), `orientation.js` trimmed to one envelope, `grounding/context-events` ADAPT (K10), `memory-digest` ADAPT (token cap) [read: inventory-cli.md:153,238; inventory-engines.md:135; threads-ops.md:301] | `prime`, `orient`, `status`, the silent read-first gate, prose briefings [read: inventory-cli.md:143,149,166; threads-consumers.md:15] |
| **`forge/check`** | Runs the **project's own declared commands** and records outcome evidence | `check.run` (declared args include `trigger`), `check.list`, `check.show` | check runs and evidence bound to the exact inputs (head, command, environment digest) | `validation-receipt` **ADAPT**: keep receipt integrity, exact-input binding, bounded execution and truthful outcomes; drop the `forge-full-suite-v1` runner identity, the import of Forge's own test script and the push-mode policy [read-code: lib/validation-receipt.js:8–18]. `preflight/runner` **ADAPT** as generic fast-fail composition over declared checks. `preflight/gates` **DROP as code**: its gate list hardcodes ESLint via `npx`, sonarjs, mirror/registry drift checks and Forge's own test map [read-code: lib/preflight/gates.js:11–24,75–85]; the behaviours its regression tests guard (`f3a24e67`, `c915818d`, `e9b8e05c`) are re-expressed over declared commands, and tests that assert the dropped tools are dropped [read: inventory-cli.md:362–363]. `validate.js` behaviours: keep output on timeout (`243daf3d`), reject incomplete runs (`3f4b04fc`), zero-test truth (`12b00157`/#381, below). Flow `process-lifecycle` PORT (K14). Process-tree reaping (`c5aaddea`), child-env isolation (`9af51d6c`), explicit budgets (`956c2b45`) [read: inventory-cli.md:172,278; inventory-infra.md:47–53] | Hardcoded `bun test`, the ESLint-only lint gate, the Forge-suite receipt identity, push modes, weighted sharding and worker budgets framework, doc-asserting lanes, freshness tokens, the risk manifest [read: threads-consumers.md:9; mistakes-ledger.md:78] |
| **`forge/git`** | Optional workspace isolation, guarded push and opt-in git hooks | `worktree.create, list, remove, clean`; `branch.push`; `hook.install, remove, status` (decision 7) | worktree ↔ issue/run bindings; owned hook-file receipts | `worktree.js` ADAPT (12 fixes, incl. `339be756` base on default branch), `clean.js` ADAPT (`ad027f67` never reap unstarted, `1f167589` squash-aware, `7b2f3fb0`), `detect-worktree` PORT, `git-defaults`, `base-remote`, `modules-link`, `symlink-utils` PORT, `backing-issue` linkage (K4) [read: inventory-cli.md:118,173,183,197,211,234,270]. Hook behaviours from #135, #382, #388, #458, #452 as tests [read: dependencies-and-hooks.md:139] | Lint/tests inside push, the push token, the shepherd wake-up on push, any assumption that worktrees exist [read: inventory-cli.md:39,150] |
| **`forge/pr`** + **`forge/github`** (provider) | PR lifecycle with a live, computed verdict | `pr.create, link, status, checks, threads, reply, resolve, rerun, merge` (guarded: exact head, lease, required checks, approval if policy says so); `github.status, use` | PR links, accepted merge evidence. No watcher rows | `merge-rules` PORT after re-check (`6586fe34`), `merge.js` ADAPT (7 fixes incl. `07465306` exact-head lease), `pr-pull` PORT (`888a8d3b` never false-clean, `919a4c26`), `pr-bundle` PORT, `pr-shepherd` one pass ADAPT, `pr-monitor/{gather,differ,events,verdict,monitor}` PORT, `pr-state-adapter` ADAPT (K12, K13), `pr-lifecycle-authority` ADAPT (K8), `review-adapter`, `greptile-match`, `github-{router,context,credential}`, `gh-proxy`, `native-gh` ADAPT [read: inventory-cli.md:139,232,246–249,288–302; inventory-engines.md:81–83,117] | Daemon, watchers, reconcile, shepherd lease, process identity, digest, journal (replaced by state events), the auto-rerun tier (decision 14), `review-resolve.sh`, the Actions summary renderer [read: inventory-cli.md:289–305; threads-ops.md:299] |
| **`forge/policy`** | Outcome rules and human approvals | `policy.explain, evaluate`; `approval.grant*, revoke*, show, list` | approval events | `gate-events` ADAPT (no stage names), `protected-path-manifest` ADAPT, `protected-state-authority` REWRITE as a pure evaluator over a diff, callable from wherever the project chooses: its CI, its own hook manager, or a harness pre-tool hook; `control-plane` matrix into `config.explain` [read: inventory-cli.md:209,252–254; threads-ops.md:293] | Rails, gate toggles, the TDD pre-commit rail, `existing-tdd-gate` as a gate, Husky→Lefthook migration, the native `tdd-gate` hook intent [read: mistakes-ledger.md:65,90] |
| **`forge/workflow`** | Runs **any** template's ordered steps, with checkpoints and resume | `workflow.run, resume, show, list` | runs, steps, checkpoints (generic node/checkpoint model, no stage names) | `bounded-loop` PORT. Atomic predecessor-complete/successor-start transition (`bce1e553`, `test/kernel/stage-runs.test.js:147–185`) made generic. `plan-authority` ADAPT as generic digest-bound artifact pins [read: architecture-evaluation.md:212; inventory-engines.md:90,125] | `stages.js` as code (it becomes template data), `enforce-stage`, `state-manager` (`.forge-state.json`), `workflow-profiles`, change classification, `dev.js` TDD walker, DAG scheduler [read: inventory-engines.md:124–129; inventory-cli.md:123,280] |
| **`forge/skills`** | Skill discovery over the catalog | `skill.list, show, find` | none | `frontmatter` PORT, `using-forge` ADAPT into `skill.find`. It reads the canonical `.agents/skills` plus installed packages' `skills/<name>/SKILL.md` (Agent Skills layout, compatible with TanStack Intent) [read: inventory-cli.md:208,277; tanstack-intent.md:58–63] | `packages/skills` workspace, skill eval/scores/coverage tooling, committed mirrors, `gen-command-manifest` [read: inventory-engines.md:144–168] |
| **`forge/project`** | Detectors that feed the adaptive config | `project.detect` (read-only) | none | `package-manager-remediation` PORT after re-check (`b3a0269c`), `project-discovery` + `detect-agent` ADAPT (`70820c9b`), `doc-gate/detect` ADAPT, plus detection-only logic from `lefthook-check` and `existing-tdd-gate` (report the user's hook manager and gate, never install one) [read: inventory-cli.md:195,201,226,240,250] | Remediation text that hardcodes `bun`, any installer [read: dependencies-and-hooks.md:115] |
| **`forge/migrate`** | One-way converter from old Forge stores, removed after every project in the selected migration set reads back (§10) | `migrate.plan, run, verify, rollback` | none (writes through the state owner) | `legacy-claim-repair` (K7), `windows-private-acl`, `projection-jsonl-writer` (K11), `workflow/state.js` normalization, `migrate.js` honest-preview behaviour (`79a629cc`) [read: inventory-engines.md:40,45,50,129; inventory-cli.md:140] | The Beads importer (runs in the **old** toolchain before cutover), `beads-detect`, `migrate-dry-run`, `upgrade-safety` [read: plan:1944; inventory-cli.md:184,233,276] |
| **Host adapters** `forge/pi`, `forge/opencode`, `forge/codex`, `forge/claude`, `forge/cursor`, `forge/hermes` | Project catalog assets, and hooks where the host has them (§5.1), into each harness's native format; report effective status and effective capabilities | Each implements `host.setup, status, hook` for its host | owned-file receipts | `hook-renderer`, `mcp-config-renderer`, `safety-config-renderer`, `rules-sync` (Cursor `.mdc`), `harness-capability-matrix`, `capabilities/{model,probes}`, `smart-merge` (`476050d5`), `symlink-utils` (`3800224a`), `reset` scoped uninstall (`97c16327`), Claude plugin launcher bytes [read: inventory-cli.md:217–219,228,256,258,260,269; inventory-engines.md:72–74; inventory-infra.md: plugin rows] | `setup.js` (4,670 lines), `agents-config.js`, `codex-skills.js`, `plugin-manager.js`, `docs-copy`, `context-merge`, per-harness command copies, OpenCode V1 `server()` carrier, Codex legacy bundle [read: inventory-cli.md:159,181,190,244] |

**Zero-test truth without a universal runner.** `check.run` takes its pass/fail from the declared command's exit code. Optional runner adapters (vitest, jest, node:test, pytest, cargo) parse test counts from **both** output streams. A recognised count of zero is `FAIL`. Output no adapter recognises gives the exit-code result with `testCount: unknown`, never a guessed `FAIL`. A report that is malformed or unreadable is `INCOMPLETE`. Nothing declared is `NOT_EXECUTED` with a plain message [read: threads-consumers.md:9,28; inferred].

### 3.1 Templates (plain config, opt-in)

| Template | What it selects | Rules (outcome-only) |
| --- | --- | --- |
| **`forge/delivery`** (our workflow) | `work`, `memory`, `context`, `check`, `git`, `pr`, `github`, `policy`, `workflow`, plus pruned skills (`plan`, `dev`, `validate`, `ship`, `review`, `verify`, `research`, `rollback`) | Steps `plan → dev → validate → ship → review → verify` are **data in the template**. Merge needs: checks PASS on the exact head; review threads resolved (paginated, on the exact head); a reviewer-quiet window (a project value, for example Product-Suite's `settle_min: 10`); and a guarded merge. **Unresolved P0/P1 correctness or security findings always block.** Lower findings may be deferred only under the project's severity policy, with a written rationale. A review-round budget (default 3) stops automated iteration and escalates to the human; it never waives a blocking finding. Post-merge `verify` runs the project's declared verify or deploy check. Human checkpoints: plan approval is optional by default, but a project's detected or configured approval hard stop is kept; the human merges by default. Enforcing rules are evaluated by `policy.evaluate`; the template binds them to CI by default because only CI cannot be bypassed locally, and the project can rebind them to its own hook manager or harness hooks. TDD stays as skill advice; an optional counterfactual check is available but **off by default** (decision 8, B). When a project switches it on, it proves the end-to-end journey succeeds on the real artifact and that the regression is caught (the new check fails without the fix and passes with it); it never merely checks that tests were written [read: threads-delivery-plan.md:162–164; threads-ops.md:289–291; threads-consumers.md:17–18] |
| **`forge/starter`** (non-delivery) | `work`, `memory`, `context`, `check` | No steps, no gates. It proves a different solution runs on the same blocks [read: architecture-evaluation.md:172; plan decision 28B] |
| **User or community templates** | Anything | The same schema and the same import/compare/update/remove lifecycle (§2.3). Removing a template removes only what it still owns, without a "disable" operation [read: architecture-evaluation.md:172] |

Skills that come over are **pruned to outcome checks**. The 7-dimension decision gate, per-task spec-then-quality reviewer ritual and stage-exit comment fields are removed from skill bodies. The independent reviewer idea stays as an option the template can select [read: mistakes-ledger.md:91,143; threads-consumers.md:17].

---

## 4. How users add blocks

End to end. It is the naming memo's path, with the trust stop kept [read: naming-and-block-authoring.md:25–35].

1. **Scaffold.** `forge block new semver --publisher io.github.alice` writes `forge.block.json`, `schemas/*.json`, `docs/records.json`, `src/index.cts` and one fixture.
2. **Declare.** Each operation is declared once in the manifest, including its context variant.
3. **Build** with the author's own tools (`tsc` or esbuild → `dist/index.cjs`). Forge adds no bundler.
4. **Check.** `forge block check ./semver` validates grammar, reserved names, collisions, schema profile, budgets and docs coverage. **It does not import the code.**
5. **Add.** `forge block add ./semver` (or an installed npm package) runs the check, captures the exact files and digest, and applies a CAS config edit.
6. **Admit.** `forge block admit semver` is **human-only**. Before it, an agent's call gets `INCOMPLETE / ADMISSION_REQUIRED` back, with the exact command to show the human.
7. **Use.** `forge semver bump 1.4.2 minor` on the CLI, `semver_bump` on MCP, and `catalog describe semver.bump` for the contract. Core is unchanged.

```ts
// src/index.cts — compiled to dist/index.cjs (ABI trusted-action-sync/v1)
import type { Operations, StateClient } from "forge-workflow/author";
import type { BumpInput, BumpOutput, MarkInput, MarkOutput } from "./generated/types.ts";

const parse = (v: string) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`not a semantic version: ${v}`); // → BLOCK_EXECUTION_FAILED
  return [Number(m[1]), Number(m[2]), Number(m[3])] as const;
};

export const operations = {
  // context: stateless, effects: []
  "semver.bump"({ input }: { input: BumpInput }): BumpOutput {
    const [a, b, c] = parse(input.current);
    const next = input.part === "major" ? `${a + 1}.0.0`
      : input.part === "minor" ? `${a}.${b + 1}.0` : `${a}.${b}.${c + 1}`;
    return { next };
  },
  // context: project, effects: ["semver:write"], requires: [{ slot: "state", interface: "forge.state@1" }]
  "semver.mark"({ input, services }: { input: MarkInput; services: { state: StateClient } }): MarkOutput {
    // The caller supplies the revision it last saw; a stale one is refused.
    const rec = services.state.put("released", { version: input.version },
                                   { expectRevision: input.expectRevision }); // stale → REVISION_CONFLICT
    return { version: input.version, revision: rec.revision };
  },
} satisfies Operations<{ "semver.bump": [BumpInput, BumpOutput]; "semver.mark": [MarkInput, MarkOutput] }>;
```

Manifest excerpt (full form in [naming-and-block-authoring.md:45–86](naming-and-block-authoring.md)):

```json
{ "schemaVersion": "forge.block/1", "id": "io.github.alice/semver", "version": "0.1.0",
  "authorAbi": "forge.author/v1", "profile": "trusted-action-sync/v1", "entry": "dist/index.cjs",
  "configSchema": "schemas/config.json",
  "operations": {
    "semver.bump": { "input": "schemas/bump.input.json", "output": "schemas/bump.output.json",
                     "args": ["current", "part"], "context": "stateless", "effects": [],
                     "idempotent": true, "callers": ["agent", "human"], "stability": "stable" },
    "semver.mark": { "input": "schemas/mark.input.json", "output": "schemas/mark.output.json",
                     "args": ["version", "expectRevision"], "context": "project",
                     "effects": ["semver:write"], "idempotent": false,
                     "callers": ["agent", "human"], "stability": "experimental" } },
  "requires": [{ "slot": "state", "interface": "forge.state@1" }],
  "docs": "docs/records.json" }
```

Notes on the example:

- The `state` slot is the outside-block door to the single state owner. Outside blocks get namespaced records with revisions and events, under the `project` context: an actor and the project identity, no session, repository claim or lease. They never get SQL, and never another block's namespace [inferred; read: architecture-evaluation.md:31,218].
- A block package may also ship `skills/<name>/SKILL.md`. `forge/skills` serves those skills, and `block check` fails a skill that names an operation the catalog doesn't have [read: naming-and-block-authoring.md:279; tanstack-intent.md:40–41].
- The `.cjs` entry format for 0.1.0 is decision 9.

---

## 5. Harness strategy

The rule: Forge builds only what harnesses lack, connects through each harness's own format, and says plainly what a host does not provide [read: brief.md:60; harness-brief.md].

### 5.1 What each host provides (latest lines surveyed)

Forge never builds agent or tool loops, session runners, model routers, hook event buses, plugin loaders, skill loaders or MCP clients. The six provider harnesses (Pi, OpenCode, Codex, Claude Code, Cursor, Hermes) each bring their own agent loop and session runner. Hooks and MCP client support differ per host, and the table below is the only statement of what each one has. T3 Code is a host that delegates to provider harnesses, not a provider: it has no hook bus and no plugin loader, and its MCP support is server-only. Where a row says a capability is missing, Forge reports `unsupported` instead of assuming it. **N** = native, **X** = extension or community code only, **P** = partial, **—** = none found [read: harness-codex-opencode-pi.md:89–101,138–150,186–198,231–235; harness-claude-cursor-t3.md:73–86,113–125,154–166; harness-others-and-standards.md:96–109]:

| Capability | Pi 1.3 | OpenCode 2.x | Codex 0.163 | Claude 2.1 | Cursor CLI | Hermes 0.22 | T3 (host) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Subagents | X (official example, community) | N | N | N | N | N | N (T3-owned delegation) |
| Plan mode / approvals | X | N | N | N | N | P (plan is a skill; approval modes) | N (host modes) |
| OS sandbox | — (container advised) | — (permissions only) | N | P (Bash/PowerShell/Monitor; none on native Windows) | N | N (container backends) | — (provider's applies) |
| Durable memory | — (sessions only) | — | P (experimental, off) | N | P | N | — |
| Hooks | X (in-process extension) | N (in-process plugin) | N (needs `/hooks` trust) | N (fail open unless configured) | N | N, advisory (failures never abort) | — |
| Worktrees | — | N (V2) | N | N | N | not surveyed | N |
| MCP client | N (default hides tools; needs `exposure:"direct"`) | N | N | N | N | N | server only |

**What this means for Forge [inferred]:**

- **Missing subagents, plan mode or sandbox are not Forge's to build.** Forge stays out of agent loops. Where a selected template wants one of these on a host that lacks it (for example the delivery template's optional independent reviewer on Pi), the host adapter reports `unsupported` in `host status` with the honest remedy: a user-chosen Pi extension (the official example or a community package), or skip that step. Forge never claims a sandbox; admitted code is not sandboxed (§13 risk 8).
- **Durable memory** comes from `forge/memory` on every host; host memories stay per-host and are not authoritative.
- **Worktrees** come from `forge/git` where the host has none (Pi), and the host's own elsewhere.
- **Installed proof checks effective capabilities** (`host status`), not the table above.

### 5.2 What we supply (once, for all harnesses)

1. **State authority across harnesses.** Issues, leases, runs, verdicts and handoff records live in the state owner. Harness memories are per-harness and not authoritative [read: harness-codex-opencode-pi.md:113,162,212].
2. **Outcome checks that hooks can call.** A hook is a thin client: it calls a Forge operation and returns allow or deny. It is not the boundary: hooks fail open by default in Claude and Cursor, Hermes hook failures never block, and OpenCode and Pi plugins run in-process [read: harness-claude-cursor-t3.md:99,138; harness-others-and-standards.md:181–182; harness-codex-opencode-pi.md:160]. The protection lives at the owner's effect boundary (exact-head and lease checks inside `pr.merge`, CAS inside the state owner), so it holds when a hook fails or CI changes [read: architecture-evaluation.md:128–129,162].
3. **Config projection generated from one catalog, per host version.** It reports effective status as `desired → written → trusted → loaded → active` (or denied/unsupported). Written is not active: Codex hook trust, Pi project trust and OpenCode package load each gate activation [read: plan:620; harness-codex-opencode-pi.md:241].
4. **Standards targeted once.**
   - **AGENTS.md:** one thin file. Claude reads it natively when no CLAUDE.md shadows it.
   - **Skills:** one canonical `.agents/skills`, plus `.claude/skills` as an owned link or the Claude plugin's `skills/`, because Claude does not read `.agents/skills`.
   - **MCP:** one generated server with portable underscore names, built on the official `@modelcontextprotocol/server` 2.3.1 behind the `mcp-transport` adapter. That SDK implements the 2026-07-28 revision (stdio and Streamable HTTP) [read: mcp-sdk-facts.md:35–41]. The standards survey recommends also serving the pre-2026 revision [read: harness-others-and-standards.md:195,207]; whether the server package alone does so is **not established** by the facts file, so L3 checks it first. Host interoperability is proved at M3, not assumed.
   - **No ACP or A2A implementation** [read: harness-others-and-standards.md:9–12,200–207; harness-claude-cursor-t3.md:198–200].
5. **Handoff record.** `context.handoff` / `context.show` carries issue/run, head, uncommitted-work identity, evidence, pending review threads and next step, so a session in another harness can resume. A fixture proves the record (L8); installed cross-host readback is proved at M3 [read: threads-ops.md:301].

### 5.3 Tiers and per-harness work (latest lines only)

| Tier | Harness (line) | Per-harness work in its adapter block |
| --- | --- | --- |
| **Mandatory** (blocks release) | **Pi 1.3.x** | Pi package with extension (`tool_call` → Forge check → `{block:true}`), skills and prompts. MCP entry with `exposure:"direct"` for the exposed tools. Trust-aware projection (project `.pi` loads only after trust). Completion read from events and the stop reason (`agent_settled` for JSON mode), not the exit code; `agent_end` alone is not treated as success. Worktree lifecycle via `forge/git`. Version-pinned, because 1.x event shapes changed within weeks [read: harness-codex-opencode-pi.md:189,196,206–212] |
| Mandatory | **OpenCode 2.x** (2.0.31 surveyed) | **V2 `Plugin.define({id, setup})` only**, no V1 `server()` carrier. Permission config in the V2 dialect (`permissions`/`shell`/`subagent`). `opencode.json` `mcp.forge`/`plugin` entries. Report managed-config overrides. Avoid duplicate skills (it also reads `.claude/skills`) [read: brief.md:60; harness-codex-opencode-pi.md:127,158–164] |
| Mandatory | **Codex 0.163+** | Portable root `plugin.json` (skills + MCP + hooks) via `.agents/plugins/marketplace.json`. The `/hooks` trust handshake is reported, never assumed; CLI plugin-hook behaviour is partly unclear in the survey and is resolved by the installed proof. `.codex/config.toml` `[mcp_servers.forge]`. Untrusted projects are detected and reported. `--output-schema` mapping to Forge evidence [read: harness-codex-opencode-pi.md:89,93,110–116] |
| **Well supported** (non-blocking, honest limits) | **Claude Code 2.1.30x** | Plugin tree (skills, hooks, MCP). Hooks that should deny use `onFailure:"block"` (2.1.295+). No CLAUDE.md generation for ≥2.1.277 (old decision 35A kept). Proof surface: `system/init` capabilities and errors [read: harness-claude-cursor-t3.md:96–104] |
| Well supported | **Cursor CLI 2026.10.x** | Agent Plugins carrier, `.mdc` rules, `failClosed:true` hooks. **One projection owner per host**, because Cursor also loads Claude hooks and would double-fire. CLI-first profile with an explicit desktop gap (old decision 38B kept) [read: harness-claude-cursor-t3.md:135–143] |
| **Experimental** | **Hermes 0.22.x** | User-level projection only (`external_dirs` → `.agents/skills`, `mcp_servers`). Hooks are advisory because their failures never abort; an explicit deny result may still be returned. No legacy projection carried [read: harness-others-and-standards.md:175,182,200–207] |
| Not targeted in 0.1.0 | Antigravity, Gemini CLI | They read `.agents/skills` and MCP, so they get the standards for free. No adapter until a named consumer [read: harness-others-and-standards.md:7–8; mistakes-ledger.md:46] |
| **Host (observation)** | **T3 Code 0.1.x** | No adapter. T3 runs Pi and OpenCode 2.0.18+ as providers, so the provider adapters apply inside T3. Forge binds threads to issues by identifier, never by cwd. T3 enforcement certification stays deferred (old decision 44C) [read: harness-claude-cursor-t3.md:168–176,185–190] |

---

## 6. Toolchain and dependencies

### 6.1 Our toolchain (Bun-first, day one)

This section is how **we** build Forge. None of it is assumed of a user's project (§6.4).

| Need | Command | Notes |
| --- | --- | --- |
| Install | `bun install` | `bun.lock` committed |
| Type check | `bun check` | Needs Bun ≥ 1.4.3 [read: toolchain-check-lint.md:11,21–33] |
| Lint / format | `bun lint --type-aware --max-warnings 0`, `bun fmt --check` | **Merged 2026-10-12, canary only (1.4.4-canary.x)**. CI uses an exact canary build, refreshed weekly, until a stable Bun ships them, then moves to stable. No interim oxlint or ESLint layer (brief rule). Gotcha: a `package.json` script named `lint` or `check` shadows the built-in, so never define them as `bun lint` [read: brief.md:40; toolchain-check-lint.md:37–63] |
| Test | `bun test --timeout <explicit>` | One test driver; the explicit timeout is enforced by a structure test, because bunfig `timeout` was ignored before [read: mistakes-ledger.md:103]. **Unit tests use an injected clock and fake process ports**. Real git and subprocesses run only in a labelled integration lane [read: mistakes-ledger.md:78] |
| Node behaviour | `bun test` spawning `node` fixture programs | For the runtime-sensitive regressions (SQLite races and CAS, Windows ACLs, process-tree and lifecycle cases), small fixture programs run **under Node 24 and 26** against the built package exports (the packed tarball in CI) and print structured results the Bun test asserts on. Owned by L5, L6 and L9. Ordinary unit tests stay in-process. No second development test runner [read: inventory-engines.md:176–190; language-decision.md:106; inferred] |
| Build (publish only) | `tsc -p tsconfig.build.json` | TS 7.0.x emits `dist/**/*.js` + `.d.ts` + maps. `noEmitOnError`, `isolatedDeclarations` on public entries. TS 7 has no programmatic API until 7.1, so structure tooling uses the CLI, never TS 6 APIs [read: language-decision.md:70,105–106] |
| Package checks | `publint --strict`, `attw --pack` | Ideas taken from TanStack Config, not its packages [read: tanstack-config.md:50–52] |
| Smoke | `npm pack` once → install those bytes with **npm on Node 24 and 26, no Bun on PATH**, then with Bun → `forge --version`, `forge catalog list`, `forge config show` in an npm+vitest fixture, a pnpm+jest fixture and a Python fixture | Fixes "tests ran against the source tree" and the Bun install break (#575) [read: dependencies-and-hooks.md:174; mistakes-ledger.md:83] |

**Language rules:**

- TypeScript 7, erasable syntax only. No enums, namespaces, parameter properties or decorators.
- ESM (`"type":"module"`).
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`, `module: nodenext`.
- No `any` in public modules; data boundaries take `unknown` plus validation.
- Sources run directly on Node ≥ 24.15 and Bun with no build step in dev [read: language-decision.md:103–112].

The Node floor is Node 24.15 or newer plus Node 26 (decision 11, A).

**Release flow** (decision 12, A):

1. A version PR bumps `package.json` and generates the changelog from squash-merge titles. CHANGELOG is never hand-edited [read: mistakes-ledger.md:82].
2. CI builds, packs and smoke-tests **one tarball**.
3. That exact tarball is published to `next` (unique prerelease version) through **npm trusted publishing (GitHub OIDC) with provenance** [read: plan decision 6 DECIDED; tanstack-config.md:29].
4. **Registry readback:** fetch the registry metadata and tarball, and compare integrity with the tested tarball; check tags and provenance.
5. **Registry install proof:** with cold caches, install that exact registry version with normal npm and normal Bun lifecycle (no `--ignore-scripts`), and run `npx --package forge-workflow@<version> forge --version` on Node with no Bun on PATH; then run the generated catalog and the §4 outside-block path from the installed copy [read: threads-ops.md:297].
6. Only then move `latest`. Rollback data (the previous version and its metadata) is kept separately from tag reversal.

### 6.2 Dependency ledger (summary of [dependencies-and-hooks.md](dependencies-and-hooks.md))

**The rule (brief.md:56): value, not count.** A dependency is acceptable when it adds real value we would otherwise build and maintain, its project is active and well run, and it fits the Bun-first build without forcing a user's toolchain. Every dependency sits behind one adapter. There is **no numeric ceiling**. Each one has an entry in `docs/dependencies.md` recording: what it saves us, maintenance activity, transitive package count, Node 24/26 and Bun fit, licence, trust/provenance, and the swap proof (its port's contract suite). A structure test fails on a dependency with no entry or no adapter.

| Where | Kept | Dropped or replaced by a built-in |
| --- | --- | --- |
| Shipped runtime | `yaml`, behind adapter `config-yaml` in strict mode (decision 5). `node:sqlite`/`bun:sqlite` behind `store-sqlite`. The MCP protocol layer behind `mcp-transport`: **`@modelcontextprotocol/server` 2.3.1**, settled as the default by the facts below, not an open choice (see the MCP ledger entry after this table) | `@babel/parser`, `cross-spawn` → `node:child_process` in the `process` adapter, `chalk` → `util.styleText`, `commander` → `util.parseArgs`, `inquirer`, `js-yaml`, `markdown-it`, `lefthook` peer, `bundledDependencies` [read: dependencies-and-hooks.md:38–50] |
| Our build | `typescript` 7.0.x (emit only), `publint`, `@arethetypeswrong/cli`; Bun built-ins for the rest | ESLint stack, commitlint (a CI check on the PR title instead), Stryker (decision 15), `c8` → `bun test --coverage`, `.husky/`, Lefthook, 8 `overrides`, bash `*.sh`, binary build (decision 13) [read: dependencies-and-hooks.md:69–80] |
| External tools | `git` (the only required tool) via `vcs-git`; `gh` via `code-host-github-cli` (optional); harness CLIs via host adapters; the user's package manager via `package-manager` | `bash`/`sh`, `bd`, `dolt`, `jq`, `npx`/`bunx` at run time, `where`/`which` (PATH walk in `process`) [read: dependencies-and-hooks.md:86–103] |
| Judged, not taken now | TanStack Intent: stay layout-compatible; its reader adds little over our skills block today, so it is an optional adapter on demand [read: tanstack-intent.md:40–45,58–63]. TanStack CLI: borrow `--json` everywhere and the declarative add-on manifest; we keep a generated MCP [read: tanstack-cli.md:51,60–66]. TanStack Config packages: pnpm/Nx-oriented, a conflict with the Bun-first build; its `tsdown` Bun fit is unproven rather than shown incompatible [read: tanstack-config.md:54–61] | — |

**MCP ledger entry (settled; the one dependency whose value is already read).** The brief prefers a strong, active ecosystem over rebuilding what it does (brief.md:56), and the facts support that for the v2 server package [read: mcp-sdk-facts.md:7–54]:

- **What we take:** only `@modelcontextprotocol/server` 2.3.1 (stable v2 line; 2.0.0 shipped 2026-07-27, latest release 2026-10-05; Apache-2.0). Not `client` (7 runtime dependencies, and Forge has no use for it) and not the v1 `@modelcontextprotocol/sdk` (17 runtime dependencies).
- **Cost:** 2 runtime dependencies, `zod ^4.2.0` and `@modelcontextprotocol/core` 2.3.1 (itself only `zod`), so `zod` becomes a transitive runtime dependency; about 6.5 MB unpacked for `server` plus about 1.3 MB for `core`. Zod is a hard dependency even though tool schemas accept any Standard Schema library.
- **Value:** it implements spec 2026-07-28 over stdio and Streamable HTTP, and someone else keeps up with a protocol that just changed (per search snippets, not full pages: 2026-07-28 removed protocol sessions, the `initialize` handshake and SSE resumability). Release cadence is high (v2 minors on 2026-09-23, 09-28, 10-02, 10-05).
- **Swap:** one adapter, `src/adapters/mcp-transport/`, behind the `McpTransport` port with one contract suite, so an own-code replacement stays possible without touching callers.
- **Not yet verified (L3's first task, recorded in `docs/dependencies.md`):** the SDK's own test claims stop at `node >=20`, so Node 24/26 and Bun are untested by us; whether the server package serves clients on the pre-2026-07-28 revision (a `server-legacy@2.3.1` sibling exists but was not examined; adding any second package needs its own ledger entry); the 2.3.0 notes list breaking-style changes (one server per request, same-origin redirects), so the version is pinned exactly and upgrades are reviewed. If a check fails, L3 records the shortfall and the owner is told before any own-code protocol work starts.

**Fit rules kept from evidence** (not count rules): no install-time scripts that run in a consumer (`preinstall`, `install`, `postinstall`, `prepare`); no `bundledDependencies` (they broke `bun add`, #575); an optional or peer dependency needs its ledger entry to say why it is optional and how its absence is reported; every `overrides` entry cites an issue and an expiry date [read: dependencies-and-hooks.md:46,157].

**Replaceability rule** (CODING_STANDARDS R1–R4, R6–R7 adopted; R5's numeric budget replaced by the ledger above) [read: dependencies-and-hooks.md:151–165]:

- Every third-party package and external executable is reached through exactly one `src/adapters/<name>/` behind a typed port in `src/ports/`.
- Imports outside the adapter fail a structure test.
- A missing tool is a typed `Unavailable{reason, remedy}`, not a crash.
- Shipped code never names a package manager, test runner, linter or hook runner outside adapters and detectors.
- Each port has a contract suite every adapter, including a fake, must pass.

### 6.3 Hooks and gates

- **Our repo:** no hook runner. Lefthook, Husky and the `prepare` hook install are gone. CI on the PR diff is our gate [read: dependencies-and-hooks.md:111–126 (12 failures), 137–141].
- **The package:** Forge ships no hook runner and never requires one. Nothing is installed into a user's `.git/hooks` unless they ask (decision 7).
- **User projects:** a user's Lefthook, Husky, pre-commit framework or raw hooks are detected and left exactly as they are. Forge never duplicates a gate they already run and never replaces their manager [read: brief.md:42,46–52; dependencies-and-hooks.md:28,133,139; threads-consumers.md:24,28].
- **Where enforcing rules run is the project's choice.** `policy.evaluate` and `check.run` are ordinary operations. A project can call them from its CI, its own hook manager or a harness hook. The delivery template binds them to CI by default, as config the user can change.
- **Agent guardrails in harness hooks**, generated per host only when a selected template or the user asks for them (§5). They cover `--no-verify`, `core.hooksPath=/dev/null`, force-push to the default branch, protected-path edits and merge. They are thin clients of Forge operations; the real protection sits at the effect owner (§5.2) [read: dependencies-and-hooks.md:134].
- **Opt-in local git hook** (decision 7): `forge hook install` writes a hook of at most 10 lines only where no hook manager exists; elsewhere it prints the line to add to the user's own manager. The hook execs `forge check run --trigger <event>`. Installing writes one owned file with a sentinel and a backup of anything it replaces; running the hook writes no tracked file; `hook remove` restores the backup.

### 6.4 Adapting to the user's toolchain

- Detection lives in `forge/project` detectors. They read lockfiles, `package.json` scripts, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Makefile`/`justfile`, hook-manager files, `.github/workflows/*`, decision-record folders and formats, and `git log` habits.
- `check.run` executes **only declared commands**, with the detected package manager.
- An unknown or missing command gives `NOT_EXECUTED: no test command declared (looked in …); set check.commands.test`.
- A user's existing Husky, Lefthook or pre-commit gate is reported and never duplicated.
- A tool or practice Forge cannot work with (an unsupported tracker, an unrecognised runner output) is reported plainly, with the adapter or block that would close the gap [read: brief.md:42,52; threads-consumers.md:9,28; inferred].

---

## 7. DROP list (must not appear in the new repo)

A structure test fails on any of these names outside `src/blocks/migrate/legacy/`, detectors (which may name tools only to recognise them) and test fixtures [read: mistakes-ledger.md:43,126–134].

- **Retired names:** `beads`, `bd`, `dolt`, `.beads/`, `FORGE_ISSUE_BACKEND`, `issue-backend`, `D20`/kill-list, `forge prime`, `/check`, `premerge`, `smart-status`, `forge-team`, `pr-coordinator`, `forge serve`, dashboard/cockpit, `insights`, `beta5`, `KAP-*`, `rail.*`, `forge-full-suite`, `gate` as a product word, `shepherd` as a product word, `Kernel`/`Contracts`/`Flow` as public names.
- **Commands:** `serve`, `inbox`, `insights`, `recommend`, `sync`, `team`, `upgrade`, `init`, `orient`, `prime`, `status`, `patch`, `issues`, `adapter`, `dev`, `release check`, `skill eval/scores/coverage`, the `pr ship/preflight/shepherd/merge` delegates, every alias in `_aliases.js`, `bin/forge-cmd.js`, `bin/forge-preflight.js` [read: inventory-cli.md:69].
- **Modules:**
  - `lib/issue-sync/*`, `lib/dep-guard/*`, `lib/status/*`, `lib/smart-status/*`, `lib/validation/risk-manifest.js`, `lib/preflight/gates.js` (behaviours kept as tests, §3)
  - doc-gate OKF
  - `docs-command`, `docs-copy`, `context-merge`, `workflow-profiles`, `freshness-token`, `workflow/state-manager.js`
  - `runtime-health` as stage-entry checks
  - PR-monitor daemon files (`reconcile*`, `watch*`, `shepherd-lease`, `process-identity`, `digest`)
  - `husky-migration`, `lefthook-*` and `hook-global-installer` as installers, `existing-tdd-gate` as a gate (their detection logic moves to `forge/project`)
  - `release-readiness`, `beta5-compatibility-evidence`, `bun-lockfile-proof`, `bun-release`, `bun-workflow-pins`, `npm-publish-workflow`/`size-workflow`/`test-workflow` generators
  - `skill-eval`, `plugin-catalog`/`recommender`/`manager`, `patch-intent`, `upgrade-safety`, `graphiti-mcp.js`
  - the `packages/skills` workspace, `web/dashboard`, `eval/` command-eval tooling
  [read: inventory-cli.md:179–281,289–369; inventory-engines.md:144–168]
- **Infrastructure the infra inventory kept, now dropped from our repo** under DROP-by-default and outcome-not-process [read: inventory-infra.md:13–23 vs brief.md:28,32]:
  - `lefthook.yml` and `.forge/hooks/check-tdd.js`
  - commitlint and the ESLint config
  - `rules/tdd.md` and `rules/kernel-tracking.md` (workflow rules move into the delivery template)
  - the risk-manifest generator
  - bespoke weighted sharding (`test-ci-shard`, `test-full-suite` worker weighting); re-admit only on measured need. The hard-won *process* behaviours move into `forge/check`.
  - duplicate CI-gate producers; behavioural/agentic workflow sync; `build-binary.yml` and embedded assets
- **Shapes:**
  - committed `.agents`/`.cursor`/`.claude` mirrors
  - hand-maintained command manifests (`_manifest.js`)
  - tracked artifacts whose only job is to keep a gate green (`sync-manifest.json`, `test-weights.json`, size baselines)
  - a migration exclusion map (start from a fresh baseline schema)
  - a fat AGENTS.md with session-completion mandates
  - shell scripts in shipped code; the Git Bash requirement
  [read: mistakes-ledger.md:95,131–132]
- **Process (in our repo and in shipped defaults):** TDD pre-commit enforcement; mandatory change classification; stage-exit comment rituals; local canonical validation before push; "every remark becomes an issue"; the 7-dimension decision gate; retry-to-green; auto-rerun tier [read: mistakes-ledger.md:90–96; threads-ops.md:299]. A user's own project may keep any of these practices; Forge just does not ship or impose them.

---

## 8. Rules for the new repo

These rules govern **our repo and Forge's shipped behaviour**. They are not imposed on user projects. The new AGENTS.md is **at most 60 lines**: project facts, the rules below, and "run `forge catalog list` / `--help --json` to discover the rest". `CODING_STANDARDS.md` holds the diff-checkable versions, and each rule has a structure test where it can [read: mistakes-ledger.md:96,113–124].

| # | Rule | Prevents |
| --- | --- | --- |
| 1 | **One state owner.** Accepted state is written only through `src/core/state`. No backend selector, compatibility projection or second store. | Borrowed authority (Beads/Dolt), dual backends (A1, A2) |
| 2 | **Core knows no workflow.** No stage, TDD, PR or issue term in `src/core` or `schemas/` (lexical test), and the non-delivery fixtures run with no delivery block installed (behavioural test). | Stage ladder baked into product (A5); 12 leak sites |
| 3 | **Gates judge outcomes.** They measure the shipped artifact or observed result and return `PASS/FAIL/INCOMPLETE/NOT_EXECUTED`. "Nothing checked" is never PASS. Each gate ships with a test that it fails on its motivating bad input. | False green, inert-but-claimed gates (B1, B2) |
| 4 | **No tracked bookkeeping artifacts**: no committed generated files or mirrors, no hand-maintained manifests. | D20 kill-list churn, mirror drift (B3, P6) |
| 5 | **Retirement is total.** Removing a feature removes its names, shims and docs in the same PR; the absence test blocks re-entry. | 46 Beads remnants after D45 (A3) |
| 6 | **Demand before breadth.** A block or host profile enters with a named consumer, a contract test and an installed-artifact receipt. | Serve/dashboard/insights/binary built then orphaned (A6) |
| 7 | **Deterministic tests.** Injected clock and process ports. Every concurrency or authority fix has a fault-injection test plus a remove-the-fix check. Flakes are quarantined with an issue, never retried. | Wall-clock flakes, guards that test nothing (B4, B5) |
| 8 | **Bind each accepted write to the context its operation declares** (§2.1 variants). A `leased` write needs actor, session and project, plus the current lease generation when its declared mode is `held` (an `acquire` operation such as `issue.claim` supplies none and receives the new generation) and exact head where declared; a `project` write needs actor and project with CAS; a `device` write needs actor and device scope; `stateless` writes nothing. Refuse only what the declared variant requires. | Identity collapse (B7) without making device or generic writes invent claims |
| 9 | **CI is our repo's proof; locally run what you touched.** Review done bar for our repo: P0/P1 plus your own regressions; adjacent findings become issues. A round budget (3) stops iteration and escalates as a design issue; it never waives a P0/P1. | 15–25 min local runs, 7–8 review rounds (P4, P5) |
| 10 | **Platform at one boundary.** Paths, executables and processes go through the `process`/OS adapters, with a Windows CI lane. Worktrees base on the fetched remote default branch. | 96 Windows bugs, stale-base worktrees (E1, E3) |
| 11 | **One adapter per dependency, chosen by value.** Each dependency has a ledger entry (§6.2) and a contract-tested adapter; no install scripts in the package. | Lefthook/cross-spawn coupling, advisory churn, rebuilding what a good ecosystem does |
| 12 | **Our toolchain is not the user's.** No package manager, runner, linter or hook runner named outside adapters and detectors. PORT modules are re-checked for such assumptions before copying (§3). | Hardcoded `bun test`, ESLint-only gate, Forge-suite receipts, required Lefthook [read: threads-consumers.md:9] |
| 13 | **The user's explicit choice wins.** Detection never enforces, an explicit value always overrides a derived one, and Forge never replaces a user's hooks, CI, tracker or conventions. | Imposed practice [read: brief.md:52] |
| 14 | **Every operation is declared once**, with docs records and examples. No hand-written command, shipped alias or per-harness copy. | 68 command files, 7 `ship.md` copies fixed 6–7 times each (A4) |
| 15 | **Reads never write.** `show`, `list`, `detect`, `explain` and `status` mutate nothing, including lazily creating homes. | Status runs dirtying tracker state [read: threads-ops.md:305] |
| 16 | **Decision records hold durable choices only.** In our repo, one namespace (`ADR-NNN`) with a title; refer to a decision by name. In user projects, `forge/memory` reads and writes the project's own format (for example D-NNN). | Identifier soup, schedules in the ledger (A7, A8) |
| 17 | **Reports lead with the answer** in plain language, then evidence and what would change it. | Owner corrections [read: threads-delivery-plan.md:170] |

**No hook bypass for agents** stays a rule in our repo, but nothing local remains that would tempt one.

---

## 9. Lanes and worktrees

### 9.1 The graph

```
L0 scaffold ──► L1 contract lock (M1) ──► { L2 runtime ∥ L3 surfaces ∥ L4 config ∥ L5 state ∥ L6 platform adapters }
                                            └──► LI: M2 first runnable slice
M2 ──► { L7 work ∥ L8 memory+context ∥ L9 check ∥ L10a Pi ∥ L10b OpenCode ∥ L10c Codex ∥ L11 Claude/Cursor/Hermes ∥ L12 git+pr+github ∥ L13 policy+workflow+templates }
L7–L11 ──► LI: M3 engines + host catalog/trust proof ──► L14 converter build
L12 + L13 (integrating L7/L8/L9/L12) + M3 ──► LI: M4 delivery end to end + host policy-deny proof ──► L14 converter signoff + cutover ──► L15 release (M5)
L14 backups/manifests start right after M1 (read-only, old toolchain). L15 pack-smoke harness starts with L0.
```

17 lanes run in 19 worktrees (the three mandatory hosts each get one). Each lane has **one owner**, a branch `lane/<id>-<slug>`, and a worktree created from the **fetched remote default branch**. Each lane builds against the locked contract with fakes for ports not yet merged. **Mock acceptance and real integration acceptance are separate**: a lane's own acceptance may use fakes; the integration lane LI runs the real assembly at M2, M3 and M4 [read: architecture-evaluation.md:151–166; brief.md:16].

**Bootstrap tracking.** Until M3, lane issues, leases and acceptance live in the **old repo's Kernel**, through the pinned installed old CLI targeting `<old-repo-root>` explicitly. Nothing is copied or symlinked. The new repo self-hosts after M3 passes an authority-equivalence check [read: inventory-infra.md:29–39].

### 9.2 Lanes

**Acceptance is an end-to-end outcome (owner note, decision 8).** Each acceptance cell states a real user or agent journey succeeding on the real artifact (the packed package, the installed host). Test counts, suites passing and test-writing steps are not acceptance; a regression is "closed" when its journey fails without the fix and succeeds with it. Tests still exist and are owned as follows: each lane owns the tests under its own directories (`src/<area>/**/test/**` or `test/<area>/**`); `test/contract/**` is L1's, `test/structure/**` L0's, `test/integration/**` LI's.

| Lane | Goal | Owns (exclusive files) | Waits on | Outputs | Acceptance (outcome) | Est. (agent-days) | Executor |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| **L0** Scaffold & CI | A buildable empty repo with all structure guards | `package.json` (incl. `exports`; other lanes request changes through L0), `bun.lock`, `tsconfig*.json`, `bunfig.toml`, `.github/**` except `.github/workflows/release.yml`, `AGENTS.md`, `CODING_STANDARDS.md`, `docs/dependencies.md`, `test/structure/**`, `tools/pack-smoke/**`; a stub `bin/forge.ts` handed to L3 at M1 | — | Repo, CI matrix (Ubuntu/macOS/Windows × Node 24/26 + pinned Bun), structure tests (boundary words, dependency boundary and ledger entries, retired names, explicit test timeout) | A pull request with a planted violation of each guard is rejected in CI. An empty package packs, installs with npm on Node 24/26 without Bun, and runs `forge --version` | 2–3 | Sonnet |
| **L1** Contract lock | Freeze every public shape before fan-out | `schemas/**`, `src/generated/**`, `src/contract/**`, **`src/ports/**`** (all port interfaces), `test/contract/**` (positive/negative corpus) | L0 | Block/operation/config-composition/template/invocation-request/execution-observation/result/error/evidence/state/detection schemas; context variants; per-block `configSchema`; typed bindings (`interface@major`, provider compatibility, version grammar); effect outcomes with no-blind-retry; owner/lifetime port; untrusted-input boundary; `forge.tracker@1`; naming grammar; author types `forge-workflow/author`; MCP projection rules. Resolves the old plan's two competing solution schemas into the one `forge.config/1` | Both templates (`forge/delivery`, `forge/starter`) and the §4 example validate against the one schema. Through the generated validators, each of these real requests gets the stated outcome: a stateless call succeeds; a device write with no project succeeds; a connected non-delivery run succeeds; a project write without a lease succeeds; a leased `acquire` call with no generation is accepted; a leased `held` call with no generation is refused `CONTEXT_MISSING` and a superseded one `LEASE_STALE`; an external effect reported `uncertain` is not retried. A core file that names a workflow concept is rejected in CI. Regenerating types from the schemas yields identical bytes (`gen --check`). **Merge point M1** [read: architecture-evaluation.md:126–145,196–204] | 6–9 | Claude Yash Opus |
| **L2** Catalog & runtime | One resolve → bind → admit → invoke path with trust and limits | `src/core/{catalog,runtime,trust}/**`, the core-manifest assembler (each core area owns its own operation fragment `src/core/<area>/operations.json`) | M1 | Catalog snapshot, capture/digest, human-only admission, admission reuse in `block add`, sync-handler wrapper (Promise refused), context-variant and lease-mode enforcement, budgets, SecretRef | Discovery imports no code (spy test). Denied admission never invokes. Schema-invalid output is not accepted. A changed byte voids admission. A device or project write never requires a lease. A `leased`/`acquire` call is accepted with no generation and a `leased`/`held` call without one is refused. Handles clean up. A block that overruns its time, size or output limit is stopped in the installed CLI and the result names the limit hit (the SkillRuntime limit behaviours, shown end to end) [read: inventory-engines.md:192,203–204] | 7–10 | Codex Sol |
| **L3** Generated surfaces | CLI, MCP and hook transports driven only by the catalog | `src/surface/**`, `bin/forge.ts` (from M1), `src/adapters/mcp-transport/**` | M1 (fake catalog) | argv mapping, JSON envelope, exit codes, generic text renderer, suggestions; MCP stdio for both protocol eras with a configurable exposure budget (default 40 stable tools, for hosts without tool search; harness tool search is relied on elsewhere to keep context small) plus `catalog_list`, `catalog_describe` and `catalog_call` for everything beyond it, and annotations from effects; hook stdin shim. **First task:** install `@modelcontextprotocol/server` 2.3.1 under Node 24/26 and Bun, write its `docs/dependencies.md` entry from the §6.2 facts, and run MCP conformance on both eras through it | A new fixture block appears in `--help`, `catalog describe` and MCP `tools/list` with **zero surface edits**. Envelope/exit parity with the `05538ad7` regression. Human-only ops are absent from MCP. MCP conformance passes on both eras through the SDK adapter, or the shortfall is recorded in the ledger and returned to the owner | 5–7 | Codex Sol |
| **L4** Config & templates | Three ways in, origins, CAS edits, template lifecycle | `src/core/config/**`, `src/adapters/config-yaml/**` | M1 | `config.*` and `template.*` operations, derived layer from detector observations, import with per-key ownership, compare/update/remove, save, explain | Nothing configured → `config show` lists derived values with sources and **zero gates or hooks**. An explicit `set` overrides the derived value. A conflicting concurrent edit is refused. Revert restores the exact prior bytes. Unknown keys are refused. Two imported templates + a user edit + removal keep the edit and remove only owned unchanged keys; removing all returns to adaptive | 7–10 | Claude Yash Opus |
| **L5** State owner | Port the Kernel's guarded transaction core as a generic owner | `src/core/state/**`, `src/adapters/store-sqlite/**`, `migrations/**` (sole owner), `test/node-fixtures/state/**` | M1 | Records/events/revisions/CAS/idempotency/leases, domain-table registration (first-party, reviewed), namespaced client for outside blocks, fresh 0.1.0 baseline schema, export/restore, fs-class, Windows ACL | From the packed package on Node 24/26 and under Bun, the K1–K3, K6, K7, K10, K11 failure modes do not recur: the journey that exposed each one succeeds with the fix and fails with the fix removed. A freshly created store and a migrated store behave identically. Concurrent claims → one winner (fault-injected, remove-the-fix check) [read: inventory-engines.md:176–186; mistakes-ledger.md:79–80] | 8–12 | Codex Sol |
| **L6** Platform adapters & detectors | OS/process/git/package-manager adapters and `forge/project` | `src/adapters/{process,vcs-git,package-manager}/**` (implementations of L1's ports), `src/blocks/project/**`, `test/node-fixtures/process/**` | M1 | Spawn with argv arrays only, PATH/PATHEXT resolution, tree-kill, windowsHide; git port; lockfile detection; detectors for npm/pnpm/yarn/bun, Python, Rust, Go, Make/just, hook managers, CI, trackers, decision records | On Windows, macOS and Linux, spawning a real command through the real adapter returns its output and exit code, including a Windows `.cmd` shim that used to fail with ENOENT (`9997d516`, `c4393667`), run as a Node program. Detectors on 6 fixture repos return the expected observations with sources | 4–6 | Sonnet |
| **LI** Integration & assembly | Real assembly and real integration acceptance at M2, M3, M4 | `src/assembly/**` (first-party block registration list, host dispatch assembly), `test/integration/**` | L2–L6 for M2; L7–L11 for M3; L12, L13 for M4 | The three integration points below; export-entry requests to L0 | M2, M3 and M4 acceptance as written below, all from the packed tarball | 4–6 (M2 1–2, M3 2–3, M4 1) | Claude Yash Opus |
| **M2** First runnable slice | (integration, LI) | — | L2–L6 | — | In an **npm + vitest fixture with no Bun**: (1) `forge config show` shows the derived `npm test` with its source (detection only; running it joins at M3 through L9); (2) `forge block add ./semver`; an agent call to `semver_bump` returns `ADMISSION_REQUIRED`; (3) the human runs `block admit`; (4) `forge semver bump 1.4.2 minor` on the CLI and `semver_bump` over MCP return the same result; (5) `semver.mark` with the current `expectRevision` writes a record, and with a stale one returns `REVISION_CONFLICT`; a controlled-interleaving fixture shows two writers with the same revision produce one winner. All from the packed tarball | (in LI) | — |
| **L7** `forge/work` | Issue authority as a block | `src/blocks/work/**` (+ domain migrations requested from L5) | M2 | Issue operations (including `claim` as acquire, `renew`), readiness, leases, comments | From the installed CLI an agent creates, claims, comments on, finds as ready, and closes an issue end to end, and the state it reads back matches what it wrote (check-after-write). `ready` reflects live leases only. Unknown type refused. **Lease fixtures (§2.1), each with controlled interleaving or an injected clock:** (1) **initial acquisition**: `issue.claim` with no generation on an unleased issue succeeds and returns generation 1; (2) **two competing first claimants**: exactly one wins and the other gets `LEASE_HELD` with the holder, generation and expiry; replaying the winner's request ID returns the original result; (3) **renewal**: with the current generation it extends expiry and keeps the generation; with none → `CONTEXT_MISSING`, with an old one → `LEASE_STALE`, from another session → `LEASE_NOT_HELD`, after expiry → `LEASE_EXPIRED`; (4) **expired-lease reacquisition**: before expiry another actor's `claim` gets `LEASE_HELD`; after expiry it succeeds with generation + 1 and a `lease.reacquired` event, and the previous holder's `renew`, `update` or `close` at the old generation → `LEASE_STALE`; the previous holder may reacquire like anyone else; (5) **release then claim** gives generation + 1; (6) a remove-the-fix check for the K2 regression (`ee0954e2`) | 5–8 | Codex Sol |
| **L8** `forge/memory` + `forge/context` | Knowledge plus orientation/handoff | `src/blocks/{memory,context}/**` | M2 | Notes, decisions (project's own format), FTS, scopes, recap envelope, handoff record | Memory works with no issue store opened, under the `device` context. A note that imitates a provenance marker is read back fenced as untrusted content, shown on a real write-then-read journey. A handoff record (with pending review state and uncommitted-work identity) round-trips through `context.show` (fixture) | 5–7 | Sonnet |
| **L9** `forge/check` | Run declared commands; truthful evidence | `src/blocks/check/**`, runner-output adapters, `test/node-fixtures/check/**` | M2 | Runs, budgets, process supervision, receipts (adapted, no Forge-suite identity) | Recognised 0 tests → FAIL; unrecognised output → exit-code result with unknown count; malformed report → INCOMPLETE; nothing declared → NOT_EXECUTED; timeout keeps output; child-env isolation; a receipt binds the exact inputs. Passes on npm+vitest, pnpm+jest, Python pytest, a Makefile command and a no-lint project. No tool name outside adapters (structure test) | 5–7 | Codex Sol |
| **L10a** `forge/pi` | Mandatory Pi 1.3.x profile | `src/blocks/hosts/pi/**` | M2 | Package, extension, MCP direct exposure, trust-aware projection, capability report | Installed Pi: a new outside block activates; an unadmitted call is refused (core trust deny, causal). Status readback `written→trusted→loaded→active`. Effective capabilities reported. Cleanup | 3–5 | Claude Yash Opus |
| **L10b** `forge/opencode` | Mandatory OpenCode 2.x profile | `src/blocks/hosts/opencode/**` | M2 | V2 plugin, V2 permission dialect, MCP entry | Same as L10a on installed OpenCode 2.x | 3–5 | Sonnet (Opus review) |
| **L10c** `forge/codex` | Mandatory Codex profile | `src/blocks/hosts/codex/**` | M2 | Portable plugin + marketplace, hook trust reporting, TOML MCP | Same as L10a on installed Codex 0.163+, including the `/hooks` trust path | 3–5 | Codex Sol |
| **L11** Claude, Cursor, Hermes | Well-supported and experimental profiles | `src/blocks/hosts/{claude,cursor,hermes}/**` | M2 | Plugin trees, `.mdc` rules, no double hooks, Hermes user-level projection | Honest profile status; no Cursor double-fire (one edit in Cursor is observed to fire its hook once); Claude `onFailure:"block"` hook verified on 2.1.295+ | 5–8 | Sonnet |
| **L12** `forge/git` + `forge/pr` + `forge/github` | Delivery primitives as ordinary blocks | `src/blocks/{git,pr,github}/**` | M2 (fakes for work) | Worktree, push, opt-in git hook, PR create/link/status/threads/reply/resolve/rerun/merge, account routing | On a fixture repo with a fake GitHub, every PR status is reached by its real inputs and reads back the expected verdict, and `verdict == compute(evidence)` on every read. Merge refuses a moved head. The worktree/clean journeys (`ad027f67`, `1f167589`, `339be756`: never reap unstarted work, squash-aware cleanup, base on the default branch), merge journeys (`07465306`, `6586fe34`, `34ef59fa`) and hook journeys (#135, #388, #458) each succeed with the fix and fail with it removed [read: inventory-cli.md:118,139,173] | 8–12 | Codex Sol |
| **L13** `forge/policy` + `forge/workflow` + templates + skills | The opinionated flow on top, plus a second solution | `src/blocks/{policy,workflow,skills}/**`, `templates/**`, `.agents/skills/**` (canonical) | M2; integrates L7, **L8**, L9 and L12 at **M4** | Runner with resume, approvals, protected-path evaluator, `forge/delivery`, `forge/starter`, pruned skills | See M4 below. A skill naming an unknown op fails `block check`. A workflow interrupted mid-step resumes at the right step or rolls back, leaving no half-applied state, shown on a real run | 5–8 | Claude Yash Opus |
| **M3** Engines + host catalog/trust proof | (integration, LI) | — | L7–L11 | — | L7–L11 merged and assembled. A cold agent adds the §4 block in installed Pi, OpenCode and Codex; it activates and an unadmitted call is refused there (core trust deny). A handoff written in one host is read back in another. `check.run` executes the fixture's detected command. The new repo self-hosts its tracking | (in LI) | — |
| **M4** Delivery end to end + host policy deny | (integration, LI with L13) | — | L12, L13, M3 | — | Delivery runs end to end on a fixture repo, including a blocking P0 finding that stops merge despite an exhausted round budget. Swapping in `forge/starter` leaves no stage, gate or hook behind. In each mandatory host, a `policy` protected-path rule denies an edit through the host hook, and the same rule is enforced at `pr.merge` with the hook disabled | (in LI/L13) | — |
| **L14** Migration of the selected set | Safe one-way move with rollback | `src/blocks/migrate/**`, `migration/**` (private manifests outside the repo) | Backups and manifests after M1; converter build after M3 (against frozen L5/L7/L8 schemas); converter signoff and cutover after M4 (all retained domain schemas, incl. L12's PR/worktree tables, frozen) | Backups, per-project manifests (§10), Beads reconciliation in the old toolchain, converter, rehearsals on copies, per-project cutover, readback reports | §10 acceptance for every project in the selected set. Any lost or UNKNOWN record blocks release | 10–14 (+ owner hours; includes curapod under decision 17A) | Claude Yash Opus |
| **L15** Release proof & publish | Prove and ship 0.1.0 | `tools/release/**`, `.github/workflows/release.yml` | L0 (smoke harness); M4/L14 for the end | Exact-tarball pipeline, OIDC publish, registry readback and registry install proof | §11 gates all PASS, none INCOMPLETE | 4–6 | Sonnet + owner |

### 9.3 Merge points and conflict hot spots

- **M1 contract lock.** After it, `schemas/**` and `src/ports/**` change only through a PR reviewed by the L1 owner, with a version bump. No lane regenerates types on its own.
- **M2, M3, M4** are defined in the table above and run by LI.
- **M5 release.**

Conflicts concentrate in four places [read: architecture-evaluation.md:175; inventory-cli.md:73–79]. Each gets one owner and queued integration:

1. `migrations/**` and the state driver (L5 is the sole owner; L7, L8 and L12 file domain-table requests).
2. `schemas/**` and `src/ports/**` (L1).
3. `package.json`/exports (L0; L1 and LI request entries).
4. `src/assembly/**` (LI).

The core manifest is no longer a hot spot: each core area owns its own operation fragment. The landing queue holds at most 3 concurrent merges. Generated catalog output is never committed, so it never conflicts.

---

## 10. Migration of the selected projects

**The selected migration set** is the owner's five projects, plus curapod (decision 17, A). Release, importer retirement, backups and rollback all reference this one set. The old Beads importer, legacy readers and old toolchain retire only after **every project in the set** reads back; any project added to the set later keeps them until its own verified readback [read: plan:1940–1946; brief.md:10].

The plan §6.1 order stays: **backups first**, then per-project manifests, then the remaining Beads import in the **old** toolchain, then a one-way conversion one project at a time, then readback, then rehearsed rollback.

**Per-project manifest (L14's first deliverable, before the converter is estimated in detail).** For each project, on the backup copy: every source table, sidecar and field mapped to a target, an archive, or a named gap; every config key; every hook entry; every asset and link target (including user `.forge` junction targets); and every pending outbox entry, active session and claim. Each unsupported mapping is named with the smallest fix that closes it [read: plan:1926–1948; inventory-infra/old plan per-user state]. Known gaps from the old inventory:

- **Product-Suite:** 17 backup-only issues missing from the Kernel; all 16 dependencies need backup endpoints; one comment references a backup-only issue; root interactions 53/56 and lifecycle events 154/155 imported; config JSONL is an unsupported format [read: plan:1931].
- **scoreeasy:** 45 backup-only issues missing; 7 comments and 3 label pairs depend on them; 36 dependencies missing (34 `blocks`, 2 `discovered-from`); lifecycle 233/242, interactions 113/115; conflicting source versions to reconcile; config JSONL unsupported [read: plan:1932].
- **Forge:** historical `beads-*` IDs with no current source to prove completeness; preserve as is [read: plan:1930].
- **Zwapit, agent-companion:** no Beads data; migrate and verify their Kernel schema and config [read: plan:1933–1934].

**Rules for the cutover [read: plan:1940–1946; threads-consumers.md:24–28; inferred]:**

- Rehearse the conversion and a restore on copies before any live cutover. Live cutover runs in a fenced quiet window with every writer stopped.
- Pending outbox entries and active sessions are drained or archived, **never replayed**. No active lease is revived.
- Post-cutover writes have an explicit export/reconcile path before any return to the old format.
- Preservation is identity-scoped: a broken reference (for example Zwapit's stale foreign keys) is listed row by row and archived with its source, not repaired by guess.
- **User files stay untouched unless the manifest proves Forge owns them.** Every proposed change to a project's files (docs, settings, hooks, config) is shown as a reviewed diff at cutover and applied only when the owner accepts it.
- A file generated from another source (for example curapod's AGENTS.md rendered from `~/agent-config`) is changed at its source, not in the rendering, so the next sync does not undo it.
- Dropped old data defaults to **archive, not delete**, and this is **settled by the no-baggage rule (brief.md:28), not an open choice**: leftover old command references (such as `forge sync` lines) are proposed for rewrite as reviewed diffs, `patch.md` stays as a plain file, and daemon-era rows (`memory_monitor_*`, `kernel_pr_watch_*`) are archived with their source and not converted into live records. No `forge sync` stub, notice-printing command or other compatibility shim ships; every change to a project's files still needs the owner's accept at cutover.

| Project | What moves | Config after migration | Specific handling |
| --- | --- | --- | --- |
| **Forge (old repo)** | Kernel store: 1,659 issues, 8,418 events, 464 claims, 343 worktree rows, 113 PR links, 10 memories [read: plan:1892–1915] | The old repo stays frozen on its old Forge. The new repo's own config is ours to choose (delivery template) | Its store is the bootstrap tracker until M3. How the backlog moves (857 open, 414 older than two months) is settled by decision 18, B: recent open issues move, the rest are archived and stay readable by ID [read: mistakes-ledger.md:22] |
| **Product-Suite** (most demanding) | 412 issues, 953 comments, 58 memories, 13 PR links, 73 worktree rows, gate events, plus the Beads gaps above, reconciled first [read: plan:1931] | **Adaptive by default**: its own merge rules (`checks_green`, `threads_resolved`, `settle_min: 10`) and its Vitest/Bun mix are detected and mirrored. Importing `forge/delivery` is offered at cutover as a reviewed diff; the owner chooses | `.claude/settings.json` `forge hooks session-start/capture` → proposed regeneration by `forge host setup claude`. `inbox-pickup` and `shepherd-events` are proposed for removal. The protected-path intent becomes a `policy` rule, bound where the project chooses. The `tdd-gate` intent follows decision 8, B: an optional, off-by-default outcome check. Its own Lefthook pre-push scripts stay untouched. The `^0.0.9` pin becomes `forge-workflow@0.1.0`. 442 monitor rows each are archived, not converted (§10 cutover rules). `.forge/patch.md` stays [read: inventory-cli.md:50; threads-consumers.md:24] |
| **scoreeasy** | 270 Kernel issues, plus the Beads gaps above, reconciled first with the old importer [read: plan:1932] | **Adaptive** (no template): mirrors its eslint/tsc pre-commit and test/build pre-push (detected, left alone) and its required checks (Android, iOS, verify, Sonar, Vercel, CodeRabbit) | Proposed removal of the Beads text (`bd init`) from AGENTS.md, CLAUDE.md and settings. Proposed rewrite of the `forge sync`/`team` lines and the 11 legacy `.claude/commands` [read: threads-consumers.md:25; inventory-cli.md:51] |
| **Zwapit** | 16 issues, small history | **Adaptive** | It already removed most remnants. Stale kernel foreign keys are listed and archived per row. `.pi/` files are left alone unless the owner says they are Forge's. Its own AI-review-quiet gate workflow and Lefthook typecheck hooks stay, as theirs. Proposed rewrite of prompt files that name old verbs [read: threads-consumers.md:26] |
| **agent-companion** | Empty store (migrations and FTS metadata only) | **Adaptive**; Forge must be inert until opted in | No Lefthook prerequisite. Its declared `scripts.test` is the runner. "Declared project script" is the evidence mode. No Forge-suite results gate its release [read: threads-consumers.md:28] |
| **curapod** (decision 17, A) | About 101 Kernel issues (tracked JSONL stale, 84 vs 101) | **Adaptive**; Forge inert until opted in | Its D-NNN decision records stay its authority. Its own `rail.*` IDs are left alone (Forge no longer uses `rail.*`). AGENTS.md changes go to `~/agent-config`. Back up `.git/forge/kernel.sqlite` before any schema change [read: threads-consumers.md:27] |

**Acceptance (every project in the set).** Pass all of these:

- WAL-aware consistent backups with checksums, and a restore tested on a copy.
- A complete manifest with no unnamed gap.
- Readback of every object family by identity, field, edge and history (not counts): records, relationships, history, memory with FTS, config, user `.forge` (router clones, link targets, validation key usable).
- No revived active leases; no replayed outbox entries.
- A rehearsed interrupted conversion and restore.
- A defined path for post-cutover writes.
- The project's normal commands still work.

Any loss or UNKNOWN blocks release [read: plan:1806,1946].

---

## 11. Release proof for 0.1.0 (outcome gates only)

Every gate below is an end-to-end outcome: a real user or agent journey succeeding on the real artifact (owner note, decision 8). Test counts and "tests written" never satisfy a gate.

Old decision 3A (lighter proof) stays. G0–G8 are restated as **outcomes**. Process and campaign items drop [read: mistakes-ledger.md:142; plan:1952–1956].

| # | Gate | It passes when (observed result) |
| --- | --- | --- |
| R1 | Package | One packed tarball passes `publint --strict` and `attw`. It installs and runs with npm on Node 24 and 26 on Windows, macOS and Linux **with no Bun on PATH**, and with Bun. Types resolve in `.mts` and `.cts` consumers |
| R2 | Nothing on by default | In npm+vitest, pnpm and Python fixtures, a fresh install writes nothing until `apply`. `config show` lists only detected facts with sources. No gate, hook or rail is active. A fixture with an existing Lefthook and Husky setup is left byte-identical |
| R3 | Outside author | A cold agent working from public docs only adds a new TypeScript block. It appears on the CLI and MCP with **no core change**, and the agent cannot self-admit. Proved installed in **Pi, OpenCode 2.x and Codex**, with status readback to `active` and a causal trust deny. The original Codex/Pi author trials and timing target (old decisions 3A, 54A) are retained |
| R4 | Flow on top | `forge/delivery` and `forge/starter` both run on the same blocks. Removing delivery leaves no stage, gate or hook, and keeps the user's later edits. A boundary violation planted in core is rejected in CI, and the packed package contains no workflow words outside blocks and templates |
| R5 | Authority | Concurrent claims give one winner. A stale revision is refused. An expired lease re-acquires with a new generation and fences out the old holder, and a renewal without the current generation is refused (L7 lease fixtures). Each K1–K15 failure mode and hard-won CLI regression is shown not to recur by a journey run on the packed artifact under Bun and as Node 24/26 programs: it succeeds with the fix and fails with the fix removed. Device and project writes succeed without leases. No authority or security journey is skipped or quarantined |
| R6 | Gate truth | On a real fixture PR, each verdict status is reached by its real inputs. "Nothing checked" is `NOT_EXECUTED`. Merge refuses a moved head. A P0 finding blocks despite an exhausted round budget. Each gate returns `FAIL` when run end to end on a deliberately failing input |
| R7 | Migration | §10 acceptance PASSES for every project in the selected set |
| R8 | Well-supported hosts | Claude and Cursor profiles report their honest status and effective capabilities. Gaps are documented, not hidden |
| R9 | CI | The full matrix of end-to-end journeys on the packed tarball is green on the release commit (a green count of unit tests alone does not satisfy this) |
| R10 | Publish | The exact tested tarball is published via OIDC with provenance to `next`. Registry integrity, tags and provenance read back. The exact registry version installs with normal npm and Bun lifecycle on cold caches and runs via `npx --package forge-workflow@<version>` on Node without Bun, including the catalog and the outside-block path. Only then does `latest` move |

---

## 12. Estimate

**Method.** Sum each lane's range from §9.2, then add a 15% integration and rework reserve. The ranges come from the inventories' per-module dispositions, re-scoped to the DROP list and to this revision's added work [read: inventory-engines.md:236–238; inventory-cli.md:390–400; inventory-infra.md:101–111]. M2–M4 effort sits inside LI and L13; it is not added again. **Inferred**, not measured throughput.

- Lanes: low 2+6+7+5+7+8+4+4+5+5+5+(3+3+3)+5+8+5+10+4 = **99**; high 3+9+10+7+10+12+6+6+8+7+7+(5+5+5)+8+12+8+14+6 = **148** (order: L0, L1, L2, L3, L4, L5, L6, LI, L7, L8, L9, L10a–c, L11, L12, L13, L14, L15).
- With 15% reserve: 113.9 → **114**; 170.2 → **170 agent-days**.
- What this revision added (inferred): L1 +1 (context variants, bindings, effect outcomes, extra fixtures); L3 +1 (MCP SDK install check and conformance); L4 +1 (template lifecycle); L5 +1 (Node fixture programs); L9 +1 (multi-ecosystem fixtures, adapted receipts); LI +4–6 (new); L14 +5–6 (manifests, curapod, rehearsals); L15 +1 (registry install proof).

**Critical path (earliest finish, agent-days, low/high):**

| Step | Starts after | Finishes |
| --- | --- | --- |
| L0 | — | 2 / 3 |
| L1 (M1) | L0 | 8 / 12 |
| L2–L6 (longest: L5) | M1 | 16 / 24 |
| M2 (LI, 1–2) | L2–L6 | 17 / 26 |
| L7, L8, L11 (5–8, 5–7, 5–8) | M2 | 22 / 34 |
| L12 (8–12) | M2 | 25 / 38 |
| M3 (LI, 2–3) | L7–L11 | 24 / 37 |
| M4 (L13 integration + LI, 2–3) | L12, L13, M3 | 27 / 41 |
| L14 converter build (5–7) | M3 | 29 / 44 |
| L14 cutover of the set (3–5) | converter, M4 | 32 / 49 |
| L15 release tail (2–3) | L14 | **34 / 52** |

The path is L0 → L1 → L5 → M2 → L7/L8/L11 → M3 → L14 converter → L14 cutover → L15, about **34–52 agent-days ≈ 6.8–10.4 weeks** of serial work. L12 → M4 runs alongside with about 2–3 days of slack. L14's backups and manifests (about 2 days) and L15's smoke harness run off the path.

- **Throughput:** 4–5 lanes at about 5 agent-days per week each: 114/25 ≈ 4.6 to 170/20 ≈ 8.5 weeks.
- **Calendar:** max(critical path, throughput) + 2–3 weeks for review, access and waits = 6.8+2 ≈ **9** to 10.4+3 ≈ **14 weeks**. The 4–5 lane staffing is provisional (decision 19), not an approved delivery date.
- **Owner time:** about 70–110 hours: decisions and merge reviews at about 2 hours per lane, manual native host runs, admissions, cutover diffs and quiet windows for up to six projects, and the release.

**Against the old 92–163 agent-days / 10–19 weeks** [read: plan:14,1835]. The totals overlap but buy different things.

*Removed:*

- the forwarding-facade and caller-redirection program
- hand-porting 68 command files and the 4,670-line `setup.js` (the CLI is generated; host adapters replace setup)
- the 9–18 day JSDoc public-typing program (TypeScript from day one)
- the daemon and watchers, binaries and Stryker
- the Hermes and T3 work already cut

*Added:*

- the clean skeleton (L1–L4, about 25–35 days), which the old plan priced only partly
- adaptive detection and the template lifecycle
- dual-era MCP
- a dedicated integration lane and per-project migration manifests

*Calendar shrinks* because the old plan serialized through one integrator after a facade refactor. Here, 9 lanes run in parallel after M2.

*Biggest swing factors:* L14 (unknown importer gaps, now on the critical path) and L12 (delivery primitives).

---

## 13. Risks (top 10)

| # | Risk | Mitigation |
| --- | --- | --- |
| 1 | `bun lint`/`bun fmt` are canary-only. A canary regression or a late stable release stalls CI | Use an exact canary build. Bump deliberately, weekly. If a canary breaks, roll back to the previous one. Move to stable when shipped [read: toolchain-check-lint.md:50–58] |
| 2 | `bun check` is a port of the TS 7 checker and could diverge from `tsc` | `tsc` emit with `noEmitOnError` runs in CI on every PR, so both checkers gate. Divergence is filed upstream [read: toolchain-check-lint.md:79] |
| 3 | Hard-won fixes are lost, or toolchain assumptions slip in, when porting | Each lane's acceptance list is its "hard-won fixes" column, written as behaviour tests against the new contract, plus a remove-the-fix check for authority and concurrency fixes. The PORT re-check (§3) catches coupled modules [read: inventory-cli.md:385; inventory-engines.md:230] |
| 4 | Contract churn after M1 turns lanes into conflict fights | One L1 owner for schemas and ports. The lock requires both templates, the example block and the context/effect fixtures to validate. Versioned changes only. No fan-out before M1 [read: architecture-evaluation.md:204] |
| 5 | The adaptive core misreads a project (wrong test command) or feels like an imposition | Derived values never enforce, always show their source and are overridable. `check` runs only declared commands; unknown gives NOT_EXECUTED. Six fixture repos cover detectors. Users' hooks are left byte-identical (R2) |
| 6 | Data loss in the migration | Backups and manifests first. Old toolchain and data kept. Identity-level readback. Rehearsed rollback on copies. Any UNKNOWN blocks release [read: plan:1946] |
| 7 | Harness churn: Pi 1.x events, OpenCode 2.x stability unclear, Codex weekly releases | Pin per host. Version-gated projection. Refresh on each host release. `written ≠ active` status. Mandatory-host proof re-runs at release [read: harness-codex-opencode-pi.md:244–250] |
| 8 | Trust: admitted in-process code has ambient privileges; agents might self-admit | Human-only admit and grant, absent from MCP. Digest-bound admission. Docs say plainly that this is not a sandbox, and that several hosts have none either (§5.1) [read: plan:338,348] |
| 9 | `node:sqlite` is a release candidate, not stable; Bun and Node SQLite differ | `store-sqlite` adapter with one contract suite run on both runtimes, plus Node fixture programs. Engines floor ≥ 24.15 (decision 11) [read: language-decision.md:71] |
| 10 | Bootstrap drift: the new repo is tracked by the old Kernel through an older installed CLI | Pinned CLI path and version. Explicit repo targeting. Self-host only after an authority-equivalence check at M3 [read: inventory-infra.md:97] |

---

## 14. Conflicts resolved and overturned decisions

### 14.1 Conflicts resolved

| # | Conflict | Resolution | Why |
| --- | --- | --- | --- |
| 1 | Infra keeps Lefthook and the TDD pre-commit gate [read: inventory-infra.md:17,19]; dependencies-and-hooks drops them [read: dependencies-and-hooks.md:28,137] | **Drop both from our repo and the package.** In user projects, detect and leave the user's hook manager alone; no hook runner is ever installed or required | Brief: our toolchain is not the user's; the user's picks win; gates judge outcomes (brief.md:32,42,46–52). Infra was written before the no-baggage rule |
| 2 | Mistakes-ledger says drop the `forge-workflow` name; the architecture evaluation says the package is `forge` [read: mistakes-ledger.md:69,138; architecture-evaluation.md:15] | **npm `forge-workflow`, bin `forge`** | Brief (brief.md:5,10); `forge` and `@forge/*` belong to others [read: naming-and-block-authoring.md:17] |
| 3 | Naming proposes ~40 MCP tools; TanStack CLI dropped MCP for `--json` [read: naming-and-block-authoring.md:284; tanstack-cli.md:51] | **Keep a generated MCP** (settled). Exposure is decision 3, A (a budget plus discovery tools, relying on harness tool search) | Brief requires CLI **and** MCP generated from the catalog (brief.md:36). Owner: "they just use MCP" [read: threads-consumers.md:32] |
| 4 | Old plan: T3 has "no Pi", and its OpenCode 2.x path is "incompatible" [read: plan §3.5, line 999 per harness-claude-cursor-t3.md:170–174] | **Survey wins.** T3 has a Pi provider and supports OpenCode 2.0.18+. Still no T3 plugin loader. T3 stays observation-only | Newer primary evidence [read: harness-claude-cursor-t3.md:168–176] |
| 5 | CommonJS vs ESM | **ESM for the whole new project.** The outside-author entry stays a single `.cjs` for 0.1.0, with ESM entries decided by decision 9 | language-decision.md:110; the ABI is decided (plan:346); new-project reason for ESM |
| 6 | YAML vs JSON config | **Decision 5** (default YAML via one `yaml` adapter, strict subset) | Plan:614 fixed YAML; `yaml` had no defects and is a valuable, active dependency behind an adapter [read: dependencies-and-hooks.md:208–217; brief.md:56] |
| 7 | Toolchain-check recommends `tsc` + oxlint now; brief says `bun check`/`bun lint`/`bun fmt` from day one | **Brief wins**: `bun check` for type check, `tsc` only to emit; Bun canary for lint/fmt; no oxlint | brief.md:40 |
| 8 | Language-decision: `node:test` as certifying runner; brief: `bun test` | **`bun test`** is the one test driver. Node behaviour is certified by Node 24/26 fixture programs for runtime-sensitive regressions (spawned from `bun test`) plus packed-tarball end-to-end runs | brief.md:40; the published artifact is what users run; a smoke alone cannot certify engine behaviour |
| 9 | Old plan: JavaScript + JSDoc (decision 33) | **TypeScript everywhere** | brief.md:40; language-decision.md:16 |
| 10 | Infra day-1 scaffold (JS, ESLint, commitlint, allowJs tsconfig, risk manifest, sharding) | Replaced by **L0** (§9.2) | Brief toolchain rules; DROP by default |
| 11 | Old plan: Flow runs only "Forge-owned templates" (decision 18) | **Any admitted template** runs | Brief: anyone can build a different solution (brief.md:24); architecture-evaluation.md:69,200 |
| 12 | Old plan: four layers starting with platform defaults (decision 8) | **Derived → project → invocation**; templates imported as editable copies with per-key ownership (settled) | Brief: no built-in defaults; templates are plain editable config (brief.md:48) |
| 13 | Naming N10 (package), N11 (hand-written surface) and N8 (aliases) offered as choices | **Settled, not asked**: package name, generated surfaces, no shipped shortcuts | Brief fixes all three (brief.md:5,36) |
| 14 | Old plan pins Pi 0.99.2 and an OpenCode V1 `./server/main` carrier | **Pi 1.3.x; OpenCode 2.x only** | brief.md:60; harness-codex-opencode-pi.md:13–21 |
| 15 | Old plan §5 keeps "all existing advertised binary targets"; ledger recommends dropping them | **Drop for 0.1.0** (decision 13 confirms) | Never adopted; demand gate [read: mistakes-ledger.md:139] |
| 16 | Old plan keeps the Graphiti descriptor and module; ledger drops the module | **Provider port only**, no module (old decision 30 kept: decisions-only if added later) | mistakes-ledger.md:140 |
| 17 | Old plan keeps Hermes "existing projection/CLI compatibility" | **Experimental, nothing legacy carried** | No baggage (brief.md:28) |
| 18 | Old plan keeps standalone verbs (`ready`, `show`, …); naming N8 says no aliases | **No shipped shortcuts** (settled); users may add their own names via config `rename:` | One naming system (brief.md:36); the user's picks win (brief.md:52) |
| 19 | Ledger: "pure Node, no shell scripts"; deps: Bun Shell allowed for dev scripts | Shipped code: Node built-ins and ledgered dependencies only. Our dev tooling may use Bun APIs, never in `dist/` | dependencies-and-hooks.md:163 |
| 20 | Old decision 40A (bounded autonomous rerun) vs threads-ops "drop the auto-rerun tier" | **No autonomous rerun**; an explicit `pr.rerun` call with evidence (decision 14 confirms) | The rerun tier never fired or 404'd [read: threads-ops.md:299] |
| 21 | Infra keeps committed `.agents/skills` plus `rules/{tdd,kernel-tracking,workflow}.md` | One canonical `.agents/skills` for **our repo's own** use. Workflow rules move into the delivery template's skills. `tdd` and `kernel-tracking` rules drop | Ledger P1, P3; flow on top |
| 22 | The architecture evaluation's nine decisions (contract skeleton, generic envelopes, policy, domain and execution separation, family ownership, invocation edge, fresh layout, build lanes) | **Adopted, and made concrete in L1's outputs and fixtures** (§9.2), not just "as written" | They restate brief rules [read: architecture-evaluation.md:126–145,194–204] |
| 23 | The CLI inventory places `stage` records and `shepherd` in the delivery CLI | Generic run/step records in `forge/workflow`; one-pass PR checks as `pr.checks` | Core knows no stages; plain names |
| 24 | The dependency memo's R5 caps runtime dependencies at 1 (ceiling 3) and presumes hand-rolled MCP [read: dependencies-and-hooks.md:157,204] | **No numeric ceiling**; a value ledger per dependency; the official MCP server SDK is the first entry (§6.2) | brief.md:56: the rule is value plus one adapter, not a count |
| 25 | Inventory-cli marks `preflight/gates` and `validation-receipt` PORT [read: inventory-cli.md:362–363] | **ADAPT / DROP as code**, behaviours kept as tests (§3) | The code hardcodes ESLint, npx, Forge's suite and push modes [read-code: lib/preflight/gates.js:11–24,75–85; lib/validation-receipt.js:8–18]; brief.md:42 |

### 14.2 Overturned old decisions

The owner answered "all defaults" to the old plan's 47 open decisions on 2026-10-04. Everything not listed here stays as decided, including:

- **1A:** trusted sync outside actions
- **2A:** `forge-workflow` at 0.1.0
- **3A:** lighter proof
- **6A:** exact-artifact publication
- **7A:** canonical skills plus owned links
- **9A, 10A:** lifecycle; curated index
- **11A, 12C:** cloud and UI staging
- **17A:** API, JSON CLI and generic MCP first
- **20A:** one catalog of generated native artifacts
- **25C:** no provider demos
- **26A:** serial guarded delivery
- **28B:** advisor/non-delivery starter
- **30, 31, 34:** owner-decided
- **35A:** no CLAUDE.md for new Claude
- **37A:** native tools plus optional MCP
- **38B:** Cursor CLI first
- **39A:** bounded PR observation
- **44C:** T3 observation only
- **45B:** refresh on release
- **46A, 48A:** local knowledge; bounded links
- **49–54A**

| Old decision | Was | Now | Reason | Needs owner confirm? |
| --- | --- | --- | --- | --- |
| Bottom line point 5 | Facade/API refactor, not a rewrite | New project, contract first | Brief decision (brief.md:12) | No (owner decided) |
| 33 Language | JavaScript + JSDoc baseline | TypeScript everywhere, erasable-only, ESM | brief.md:40 | No |
| 43 Public typing | JSDoc-derived public `.d.ts`; internal typing optional | Whole codebase strict TS; types generated from schemas | Follows from 33; TS 7 weakened the JSDoc path [read: language-decision.md:20] | No |
| 47 Physical migration pace | Facades first, then relocate | Fresh final layout; port with tests | New project (brief.md:5–8; architecture-evaluation.md:203) | No |
| 18 Flow boundary | Sequential **Forge-owned** templates only | Any admitted template; still no DAG scheduler | brief.md:24 | No |
| 22 OpenCode carrier | V1 root pin `./server/main` + shim | OpenCode 2.x `Plugin.define` only | brief.md:60 | No |
| 32 Pi pin | Pi 0.99.2 | Latest Pi 1.3.x line | New evidence [read: harness-codex-opencode-pi.md:20] | No |
| 36 Codex packaging | Separate legacy + portable bundles | Portable root plugin only | No per-version shims (brief.md:60); survey [read: harness-codex-opencode-pi.md:239] | No |
| 21 MCP handlers | Hand-picked shared handlers (issue, recap, gate, config, memory, context) | Every exposed tool generated from the catalog; both MCP protocol eras | brief.md:36; harness-others-and-standards.md:11 | No (exposure settled: decision 3, A) |
| 24 Hermes | Keep existing legacy projection/CLI compatibility | Experimental; user-level projection; nothing legacy | brief.md:28 | No |
| 4 Forecast | 92–163 agent-days, 10–19 weeks | 114–170 agent-days, about 9–14 weeks (§12) | New scope and method | No (informational) |
| 8 Config layers | defaults → pinned template → project → invocation | derived → project → invocation; templates copied on import | brief.md:48–52 decides it | No (owner decided via the brief) |
| **41 Node floor** | Existing Node 24 floor (any patch) | ≥ 24.15 (`node:sqlite` release candidate) | language-decision.md:107 | **Confirmed — decision 11, A** |
| **42 Release automation** | Keep the current protected automation | A new flow for the new repo (PR-driven, OIDC, registry install proof) | No current automation exists in a new repo | **Confirmed — decision 12, A** |
| **40 CI reruns** | One bounded autonomous infrastructure-only rerun policy | No autonomous rerun; explicit `pr.rerun` | threads-ops.md:299 | **Confirmed — decision 14, A** |
| **5 Mutation lane** (owner-decided) | Retain the configured mutation lane | No Stryker; remove-the-fix checks for authority/concurrency fixes | dependencies-and-hooks.md:71; mistakes-ledger.md:79 | **Confirmed — decision 15, A** |
| **Plan §5 binary row / C6** | Keep all existing advertised binary targets | No binary in 0.1.0 | mistakes-ledger.md:139 | **Confirmed — decision 13, A** |

**Count: 17 overturned** (16 numbered or scoped decisions plus bottom-line point 5). Five needed the owner's confirmation (decisions 11, 12, 13, 14, 15 in [rebuild-decisions.json](rebuild-decisions.json)); all five were confirmed at their defaults on 2026-10-16; old decision 8 is decided by the brief.

---

## 15. Review round 1 — disposition

Source: [rebuild-plan-review.md](rebuild-plan-review.md) (5 P0, 13 P1, 2 P2). The review names F01–F05 (owner rules), F06–F08 (contracts and lanes), F09–F12 (migration and release), F13–F16 (decisions and harnesses), F19–F20 (P2s). The two unnumbered P1 rows in its §3 ("first runnable slice", "estimate") are labelled F17 and F18 here; that numbering is my inference from the gap.

| Finding | Severity | Fixed / rejected | Where | Note |
| --- | --- | --- | --- | --- |
| F01 Coupled checks marked PORT | P0 | Fixed | §3 PORT re-check, `forge/check` row; §7; §8 rule 12; §14.1 #25; L9 | `validation-receipt` and `preflight/runner` → ADAPT, `preflight/gates` → DROP as code with behaviours kept as tests; coupling confirmed in the source; multi-ecosystem fixtures |
| F02 Universal write ceremony | P0 | Fixed | §2.1 context variants; §4 example; §8 rule 8; L1, L2 acceptance; R5 | Four closed variants declared per operation; lease/session/head only for `leased`; device and generic writes proved without invented claims |
| F03 User choices replaced by universal conventions | P0 | Fixed | §1.7; §2.4 trackers; §3.1; §6.3; §8 intro and rules 9, 13, 16; §10 Product-Suite; §14.1 #1 | No hook runner installed or required; users' hooks left alone (R2 byte-identical fixture); CI scoped to our repo and a changeable template binding; ADR scoped to our repo, D-NNN kept; Product-Suite adaptive with delivery import as a chosen diff; tracker gap stated plainly |
| F04 Forbidden alternatives in the picker | P0 | Fixed (partial in round 1; completed in round 2) | decisions 2, 3, 7; removed old 5 and 9; round 2: former decision 16 deleted (§10) | Removed no-MCP, default-on hooks, never-offer hooks, first-installed-wins, core shortcut list and the template-layer choice; template lifecycle stated as settled in §2.3. Round 2 removed the `forge sync` compatibility-shim option; with it gone one option remained, so decision 16 became a settled rule in §10 |
| F05 Dependency count replaces value | P0 | Fixed | §1.10; §6.2 (incl. MCP ledger entry); §8 rule 11; §14.1 #24 | No numeric ceiling; per-dependency value ledger with structure test. Round 2: the MCP comparison was done from `mcp-sdk-facts.md`, so former decision 6 is settled in favour of `@modelcontextprotocol/server` 2.3.1 behind one adapter |
| F06 Contract lock omits composition seams | P1 | Fixed | §2.1; L1 outputs/acceptance; §14.1 #22 | One `forge.config/1` composition schema, `configSchema`, typed bindings, invocation/observation, effect outcomes with no-blind-retry, lifetime port, untrusted-input boundary, `block add` as the convenience helper; stateless/device/non-delivery/uncertain-effect fixtures |
| F07 Exclusive file ownership contradictory | P1 | Fixed | §9.2 ownership column and test note; §9.3 | L1 owns `src/ports/**`; L6 implements only; L15 owns `release.yml`; `bin/forge.ts` handed L0→L3 at M1; core manifest split into per-area fragments; export changes via L0 |
| F08 Graph lacks real integration dependencies | P1 | Fixed | §9.1; new lane LI; M3/M4 rows; L13 waits; L14 waits | Integration lane owns assembly and real acceptance; M3 core trust deny vs M4 policy deny; L13 integrates L8; converter signoff waits for M4 |
| F09 Migration acceptance not operational | P1 | Fixed | §10 manifests, cutover rules, acceptance; L14 | Per-project manifests with named gaps from old plan:1931–1934; outbox/session non-replay; identity-scoped preservation; user files untouched unless owned; generated sources amended at source |
| F10 Importer retirement ignores sixth consumer | P1 | Fixed | §10 opening; §3 `forge/migrate`; R7; decision 17 | One selected migration set referenced everywhere; a deferred project keeps the old importer until its own readback |
| F11 Published-package lifecycle untested | P1 | Fixed | §6.1 release flow steps 4–6; R10; L15; decision 12 | Registry readback plus cold-cache registry install with normal lifecycle and `npx --package` on Node without Bun before `latest` moves |
| F12 Node certification only a smoke | P1 | Fixed | §6.1 "Node behaviour" row; L5, L6, L9; R5; §14.1 #8 | Node 24/26 fixture programs for runtime-sensitive regressions, driven by `bun test`; no second runner |
| F13 Harness capabilities overgeneralized | P1 | Fixed (partial in round 1; completed in round 2) | §5.1 rewritten as per-host table and its lead sentence; §1.9; L10 acceptance | Pi has no built-in subagents, plan mode or sandbox; gaps reported as `unsupported` with remedies; installed proof checks effective capabilities. Round 2 removed the sentence that said every surveyed host has hook buses, plugin/skill loaders and MCP clients; the table is now the only statement, and T3 Code is described as a host with no hook bus or plugin loader and server-only MCP |
| F14 Handwritten hook command returns | P1 | Fixed | §2.1 `host hook --event`; §3 `forge/git` `hook.*`; §6.3; decision 7 | Git hook execs catalog op `check run --trigger`; install/remove/status are declared ops; install writes one owned file, running writes no tracked file |
| F15 Template removal has no ownership model | P1 | Fixed | §2.3 template lifecycle; `template` noun; L4; R4 | Baseline digest and per-key ownership; compare/update/remove previews; user edits kept; tests for mixed imports and switch to adaptive |
| F16 Round count can substitute for outcome | P1 | Fixed | §3.1 delivery rules; §8 rule 9; M4; R6 | Round budget escalates, never waives P0/P1; deferral only under project severity policy; detected approval hard stops kept; reviewer-quiet and deploy checks as project values |
| F17 First slice underspecified (inferred ID) | P1 | Fixed | M2 row; §4 example; decision 10 | Agent refusal before admission; caller-supplied stale `expectRevision` plus interleaving fixture; detection labelled as detection, execution joins at M3 |
| F18 Estimate wrong path and reserve (inferred ID) | P1 | Fixed | §12 | Earliest-finish table; path now runs through M3 → L14; M2–M4 effort inside LI, not double-counted; reserve arithmetic shown (99→114, 148→170); staffing marked provisional |
| F19 Unsubstantiated 60% removal | P2 | Fixed | §1.6 | Replaced by the sourced 37% CLI-inventory figure and a statement that no combined figure was computed |
| F20 Picker prose overstates low-cost options | P2 | Fixed | decisions 5, 11, 18 | JSONC removed as "dependency-free" (plain JSON offered); "release candidate" not "stable"; "minor-version upgrade"; backlog closes only selected issues and keeps links to archived ones |
| Spot check 5 (PORT preflight) — wrong | — | Fixed | as F01 | — |
| Spot check 6 (every harness has these) — wrong | — | Fixed (completed in round 2) | as F13 | — |
| Spot check 23 (about 60%) — unsupported | — | Fixed | as F19 | — |
| Spot check 24 (JSONC, stable sqlite, patch-level) — wrong | — | Fixed | as F20 | — |

**Counts:** P0 5 fixed / 0 rejected; P1 13 fixed / 0 rejected; P2 2 fixed / 0 rejected. All 4 incorrect or unsupported claims corrected. The round-2 review verified 18 of these 20 as fixed on its first read and found F04 and F13 only partly fixed; both are now completed (below), so the counts stand at 20 fixed / 0 rejected.

Also taken from the review's "research requirements" list: effect-owner safety (§5.2 point 2), bounded-byte input (§2.1 trust row), reviewer-quiet and deploy evidence (§3.1), handoff fidelity (§3 `forge/context`, §5.2 point 5), zero-test truth (§3), per-project preservation and registry install (§10, §6.1). The review's naming of the before/after check as a counterfactual regression check is adopted (decision 8).

**Decision changes:** round 1: 21 → 19; round 2: 19 → 17 (see the round 2 note below). Removed as settled by the brief: old 5 (shipped shortcuts, brief.md:36) and old 9 (template import model, brief.md:48). Replaced: old 7 (dependency count) by new 6 (MCP SDK vs own code, brief.md:56), which round 2 then settled. Options removed: old 2C (first installed wins), old 3C (no MCP), old 8B (never offer) and old 8C (default-on hooks); new 7B (editing the user's hook manager on request) added. Renumbered: old 6→5, 8→7, 10→8, 11→9, 12→10, 13→11, 14→12, 15→13, 16→14, 17→15, 18→16, 19→17, 20→18, 21→19.

### Review round 2 — disposition

Source: [rebuild-plan-review-r2.md](rebuild-plan-review-r2.md): of the 20 round-1 findings, 18 verified-fixed, 2 partial (F04, F13), 0 not-fixed; one new P1 (N1). Verdict was one more round limited to three corrections. All three are made, plus one input from the owner's research (`mcp-sdk-facts.md`). **Not re-verified by a reviewer yet.** Documentary changes only; nothing is built.

| Item | Severity | Disposition | Where | Note |
| --- | --- | --- | --- | --- |
| F04 residual: decision 16 offered a `forge sync` compatibility shim | P0 (residual) | Fixed | §10 cutover rules; decisions JSON | The shim option breaks the no-baggage rule (brief.md:28). Without it only one option remained (rewrite, plain file, archive), so it was not a decision: moved to §10 as settled, decision 16 deleted. Archive-not-delete of old data is kept; converting watcher rows into live records is not offered |
| F13 residual: universal "every surveyed host has hook buses, plugin/skill loaders, MCP clients" | P1 (residual) | Fixed | §5.1 lead paragraph | Sentence replaced; the per-host table is the only capability statement. T3 Code: no hook bus, no plugin loader, server-only MCP. A search of the plan for `every`/`all` host or harness claims found none left that contradicts a row |
| N1 lease acquisition required the lease it creates | P1 (new) | Fixed | §2.1 variants + lease semantics; §3 `forge/work`; §8 rule 8; L1, L2, L7 acceptance; R5 | `leased` operations declare a lease mode. `acquire` (`issue.claim`) supplies no generation and receives one. `held` operations (renew, release, mutations, `pr.merge`) need the current generation, checked in the write's own transaction. Initial acquisition, renewal, expired-lease reacquisition (any actor, generation + 1, old holder fenced) and the four conflict errors are specified, and L7 carries a fixture for each case; L1 carries the contract-level fixtures. Lane estimates are unchanged (inferred: the fixtures extend the ported K2 suite) |
| MCP SDK (owner research input, not a review finding) | — | Settled | §6.2 MCP ledger entry; §5.2; L3; decision 6 deleted | Official `@modelcontextprotocol/server` 2.3.1 (2 runtime dependencies, spec 2026-07-28, stdio and Streamable HTTP) behind one adapter is the default; only the server package is needed. No real alternative remained: the v1 SDK has 17 dependencies and own code is what brief.md:56 says not to prefer when a well-run project exists. Unverified items (Node 24/26, Bun, pre-2026 era, 2.3.0 breaking-style changes) are L3's first task, not an owner choice |

**Counts.** Round-1 findings: 20 of 20 fixed (18 verified by the round-2 review, 2 completed here). New P1: 1 of 1 fixed. Decisions: 19 → **17** (deleted: 6 and 16). IDs are stable, so the list reads 1–5, 7–15, 17–19. Overturned old decisions (§14.2): still 17; five need owner confirmation (11–15).

### Self-check against every brief.md rule section

I re-ran a check of this revision against each section of brief.md:

| Brief section | Result |
| --- | --- |
| Decision (new project, copy engines with tests, breaking 0.1.0, same package, migration blocks release) | Satisfied: §1.1, §1.6, §10, R7 |
| Build shape (parallel lanes, owner block, contract, tests, merge point, which lanes wait) | Satisfied: §9 with exclusive ownership, test ownership, LI, explicit waits |
| Build on what is already decided | Satisfied: §14 records every change with a reason; architecture-evaluation decisions made concrete in L1 |
| The opinionated flow stays on top | Satisfied: §2.4 lexical and behavioural guards; context variants carry no delivery fields; `forge/starter` and non-delivery fixtures |
| No baggage | Satisfied: §7 DROP list, PORT re-check, behaviours-as-tests |
| Design for smarter agents | Satisfied: ceremony dropped; `block add` convenience path; gates on outcomes; round budget escalates rather than governs |
| No hand-written command set; one naming system | Satisfied: generated surfaces; no shipped shortcuts; hook invocations are catalog ops; block names settled (decision 1, A) |
| Language and toolchain | Satisfied: §6.1 |
| Our toolchain is not the user's | Satisfied: §3 re-check, §6.3–6.4, rule 12, multi-ecosystem fixtures, npm/npx without Bun (R1, R10) |
| The user's picks win (no built-in defaults; everything an option; core adapts) | Satisfied: §2.3, §6.3, §10 adaptive-by-default with chosen diffs, R2 |
| Dependencies on well-run ecosystems | Satisfied: §6.2 value ledger; TanStack judged per package; official MCP server SDK chosen by comparison with v1 and own code (§6.2) |
| Harness versions | Satisfied: latest lines only; no OpenCode 1.x carrier |
| Rules (read-only, evidence marks, absence claims) | Partly — see below |
| Output shape (module tables, copy order, risks, estimate) | Partly — see below |

**Rules I could not fully satisfy, and why:**

1. **Evidence marks.** Claims taken from the research files are marked `read`, but I did not rerun their commands. The MCP SDK's dependency count, licence, release status and spec version are now **read** from `mcp-sdk-facts.md` (an `npm view` lookup I did not rerun); its Node 24/26 and Bun behaviour and its pre-2026-07-28 protocol coverage remain **unknown** and are L3's first task (§6.2). "Node has no JSONC parser" is **inferred**, not searched.
2. **Absence claims.** "No combined DROP percentage exists" rests on reading the two inventories' totals sections, not a full search of all inventories.
3. **Output shape.** This is a synthesis plan, not an inventory; the per-module tables with tests and fixes live in the inventory files and are cited, not repeated.
4. **"Every past mistake gets a named rule."** §8 maps rules to the mistakes-ledger categories (A1–A8, B1–B9, E1, E3, P1–P6); I did not verify one-to-one coverage of every ledger row.
5. **"Nothing is rewritten that already works."** `preflight/gates` is dropped as code. Its behaviours and tests are kept, but the module itself is not copied, because brief.md:42 (no hardcoded toolchain) outranks the inventory's PORT label for this module.
