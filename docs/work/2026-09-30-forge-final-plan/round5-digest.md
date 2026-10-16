> Superseded in part on 2026-10-16 by the new-project rebuild plan — see [../2026-10-16-platform-rebuild/rebuild-plan.md](../2026-10-16-platform-rebuild/rebuild-plan.md).

# Round 5 research digest

Decisions needed: the merged choices in platform/platform-plan-final.md §10; silence retains their planning defaults only.

Protocol: `1.0`  
Request: `forge-plan-revise-5b-20261001`  
Context digest: `97d11914e92cfe33812a4f2b4006007904d39ea7f200cad02280240eb0909a30`

All ten reports were read through bounded research lanes. Evidence below is attributed to their source reads and experiments, not a new installed integration or live certification. Recommendations remain proposed. The owner's Claude instruction fact supersedes the conservative pointer default. North-star was externally updated and reread during this phase; its one-maintainer/tier/catalogue direction and four newly settled choices are reconciled.

## P8 — adoption verification

- Keep native authority, protected gates, composition/compiler and conformance; adopt evidence formats and optional providers through existing seams.
- Distinguish SDK licenses from server/service licenses. Workflow SDK has a local backend; Restate's BSL grant is more nuanced than blanket exclusion; Inngest's permissive SDK does not make its server Apache today.
- Supply-chain results need exact-artifact, issuer/source, freshness and dependency coverage. Sigstore's audited current packages require Node 24.15+, and the audited CloudEvents SDK excludes Node 26.
- Open choices/defaults: durability/policy A (native floor, demand-driven WASM); Node dependencies A (optional, current-floor-compatible); release/monitoring A (Release Please probe, guards retained); cloud/telemetry A (later requested projection and pinned optional exporter).
- Contradictions: P5's universal server/Postgres and license rejection, unverified tool claims, stable GenAI/MCP implication, c12-as-discovery-only and Qodo/PR-Agent conflation. No removal or performance saving is demonstrated.

## P9 — shepherd and merge queue

- Keep strict serial guarded delivery for 0.1.0. A queue cannot replace exact-head, issue binding, live lease/approval, fresh rerule and terminal acceptance.
- GitHub queue is available to organization-owned public repositories and private organization repositories on Enterprise Cloud; personal repositories have no documented availability. This repository's entitlement/settings were not verified.
- The measured monitor/shepherd baseline is 10,070 lines; merge/rules add a separate 2,065. A conditional 4.4–5.2k reduction comes chiefly from watcher retirement and coordinator/policy consolidation.
- Open choices/defaults: delivery A (serial); monitoring A (bounded observations, plan watcher retirement); reruns A (one bounded infrastructure-only policy with cited CI evidence and head binding).
- Contradictions: queue-as-drop-in replacement, queue enqueue-as-merge, native skipped-check semantics, a claimed dedicated Codex completion gate, and budget-only retries of deterministic failures. Deletion requires caller and equivalence proof.

## P10 — JavaScript and public types

- Preserve decided JavaScript sources; generate schema-owned data types and JSDoc callable declarations for supported public boundaries.
- The corrected trial found 241 non-strict and 5,418 strict errors across a 105-file closure. Partial output with `emitSkipped:true` and 1,915 `any` occurrences is not release proof.
- Lock exports/types/module formats and declaration closure; run deterministic drift, packed positive/negative TS consumers and runtime imports. Compile TS authors into the same bundled `.cjs` ABI.
- Open choice/default: A, public types first (9–18 worker-days after API/schema freeze). Broad internal checkJs is a separate 20–40-day scope; selected source conversion needs an explicit revision of the settled language choice.
- Contradictions: “P10 pending”, the current no-op typecheck as evidence, raw TS npm runtime via Node stripping, and broad SDK readiness inferred from weak declarations.

## Pi deep dive

- Pi is the priority native exposure lane, with exact-artifact promotion proof rather than a minimum-version badge.
- Use shared public Forge handlers through native tools/commands; shared MCP is optional. Real pre-effect `tool_call` denial covers direct/nested/MCP paths but does not sandbox trusted extensions.
- Prove package precedence, npm lifecycle consent, validation after rewritten args, nested correlation, settlement, finite codemode limits, cleanup and Windows/TUI behavior. RPC `hasUI` is not TUI availability.
- Open choices/defaults: transport A (native plus optional MCP); surface A (small namespaced command/tools/status); promotion A (L2 aggregate plus Windows operator transcript); distribution A (canonical npm and gallery after proof).
- Contradictions: MCP-first-only, advisory-only deny, broad ≥0.99.2 certification, load/help-only proof, Pi-native enforcement of Forge `invocation:user`, and a required 0.2 gallery delay. Refresh releases/source/npm/gallery weekly; re-probe tool, MCP, loader and settlement changes.

## Claude Code deep dive

- Native plugin carriers complement the existing account, loop and UI; instructions do not replace recap or deterministic gates.
- Owner-verified: from 2.1.277, default `claude-md-or-agents-md` reads AGENTS.md only absent CLAUDE.md, .claude/CLAUDE.md and CLAUDE.local.md in cwd or parents; it does not read .agents/skills.
- Proposed setup default: omit generated CLAUDE.md for modern clients; older/unknown clients retain `@AGENTS.md`. Preserve custom content; PR #605 is open, unmerged and supplies an authorized pointer-only removal path.
- Open defaults: owner setup A (version-aware default); native plugin A; five-core-carrier Windows/provider proof A. Optional workflows/channels/UI remain staged.
- Contradictions: no native AGENTS support, 32 rather than 33 hook events, plugin-agent fields treated as effective, external cached-resource links, and bare/init-only certification. Refresh changelog weekly and at instruction/hook/SDK/provider releases.

## Codex deep dive

- Portable root manifests parse hooks/apps but the inspected stable loader omits them; a local executable-hook bundle needs legacy discovery without root shadowing.
- Ship distinct generated local/portable bundles inside one package. Normal `/hooks` trust is a proof precondition, distinct from plugin, project, MCP and managed-policy trust.
- Prove failure/timeout/exit semantics, executable-content integrity, MCP catalog readiness and native TOML reviewers under effective parent overrides. Deprecated CODEX_HOME/skills remains supported; do not claim absence.
- Open choices/defaults: packaging A (separate bundles); bootstrap A (ordinary matching trust); exposure A (local first, directory later). Headless trust mutation is separate unproved work.
- Contradictions: one root bundle activates everything, hook execution failure automatically denies, plugin agents imply native reviewer loading, and metadata/UI presence implies extension capability. Refresh releases/changelog/docs weekly and before loader/hook/trust/App Server upgrades.

## OpenCode deep dive

- Stable root package loading selects `./server`/`main`; arbitrary `forge-workflow/opencode` export resolution is not the inspected loader contract.
- Gate through awaited throw/reject, not a returned deny object. `session.created` is asynchronous observation; use awaited prompt transforms and per-action authority refresh.
- Shared Forge handlers can serve native tools and optional MCP. Plugins execute trusted in-process code; ignored install scripts do not sandbox it, and ungated load failure must refuse promised governance.
- Open choices/defaults: scope A (Experimental stable lane after Pi); package A (root pin/server, shim fallback); tools A (native plus optional MCP); TUI A (after stable proof).
- Contradictions: Bun cache/install description, deny object, orientation barrier, universal permission-hook coverage and stable/TUI/v2 parity. Refresh release/npm/source weekly; separate stable, TUI and v2 changes/proof.

## Cursor deep dive

- Certify CLI and desktop separately. CLI `--plugin-dir` and installed hooks are documented; desktop discovery, Tab and scoped activation still require their own proof.
- `preToolUse` covers Write/Edit, but ask is unenforced; `subagentStart` ask denies. Session startup cannot block creation.
- Cursor needs resolving MCP config and bundle-contained resources; compatible agent directories do not make Codex TOML portable. Cloud/ACP/SDK surfaces have separate limits.
- Open choices/defaults: certification A (CLI plus desktop); listing A (local/team first); adapters A (base plugin then SDK/ACP/cloud).
- Contradictions: undocumented CLI loading/edit coverage, universal allow/deny/ask, identical portable variable expansion, escaping plugin links and CLI-as-desktop proof. Refresh changelog/template/docs weekly; trigger on hooks, plugin, CLI or cloud behavior changes.

## Hermes deep dive

- Portable Agent Plugins and an embedded small native Python shim can coexist in the one npm artifact; a separate PyPI package is unnecessary.
- Record 41 named events plus four middleware kinds; distinguish Python, config-shell and gateway hooks, directives, failures and consent.
- Skills need project trust plus scanning/quarantine and plugin namespace exposure. Preserve inherited instruction dialects, explicit recall/context and protected grants; oneshot auto-approval is not authority.
- Open choices/defaults: package A (embedded shim); certification A (Experimental until Linux/native-Windows receipts); gateway/cron/UI A (opt-in after core); memory A (recall plus bounded context, current provider).
- Contradictions: Python breaches one-package rule, MCP absent, 27 events, metadata Supported as proof, and invented RPC flags. Refresh release feed/docs/source weekly, with immediate gate/approval/manifest/delegation/Windows checks.

## T3 Code deep dive

- T3 is a host: certify Forge → native runtime → host adapter → durable evidence/UI per provider/home/mode/version.
- Stock T3 has no Pi provider; its OpenCode ≥2 path is marked incompatible. Native Pi/V2 priority continues outside those unavailable host paths.
- Hook lifecycle can be absent from activity while denial still runs. Use Forge receipts, component inventories, namespaced commands, effective-policy reports, one worktree owner and authority refresh on resume.
- Open choices/defaults: profiles A (Codex direct plus Claude default SDK); depth A (native plugins/host profile/PR-proof tools); Pi/V2 A (native priority, unavailable host paths); enforcement A (native deny, protected APIs, independent receipts).
- Contradictions: universal pass-through, T3 activity as audit authority, managed launchArgs parity and a drop-in T3 plugin API. Refresh host/provider releases weekly; trigger on protocol/schema/home overrides, hook mappings, worktrees and independent client/server/provider upgrades.

Overall default: A for merged open choices; retain owner-decided memory, Pi priority/tier, JavaScript and optional Companion boundaries. No implementation or publication is authorized by silence.
