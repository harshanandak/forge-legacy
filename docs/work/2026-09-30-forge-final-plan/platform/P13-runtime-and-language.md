# P13 — Runtime efficiency and implementation language

Saved from the Codex job's final message (request forge-p13-runtime-language-20261002); measurement scratch files are in ../.scratch/.

## Bottom line — 10 lines

1. **Keep JavaScript for Forge’s CLI, public APIs, and block SDK; reopen the resident-runtime question.** The owner’s device-memory and cross-project direction changes the workload behind the July decision. [inferred]
2. Fresh-process help measurements peaked at **75.16 MiB on Node 24.18.0** and **50.80 MiB on Bun 1.4.2**, using medians of five trials. [ran]
3. The standalone native-hook path peaked at **63.14 MiB on Node** and **36.89 MiB on Bun**; its measured execution after the preload was much shorter than total process-launch latency. [ran]
4. **Latency is contaminated by this busy host:** even the empty Node control had a 2,685 ms median; these results cannot establish a portable startup ranking or justify Rust’s 500 ms hook trigger. [ran/inferred]
5. A Node help profile loaded **146 cache entries and approximately 2.00 MB of source**; registry/configuration, Kernel dependencies, YAML, and the eagerly loaded documentation parser dominate that sample. [ran]
6. Successful `ready`, `show`, issue-scoped `recap`, and `recall` were not benchmarked because their inspected paths can initialize or write Kernel state; safe module-load probes are reported separately. [read/ran]
7. **TypeScript source conversion does not remove the JS runtime footprint.** Keep the P10 declaration strategy and compiled JS distribution; conversion would address maintainability rather than the measured memory problem. [external/inferred]
8. **Bun is a credible optional efficiency path**, but the scratch compiled-binary attempt failed on a missing generated asset module, so compiled startup, RSS, and distribution parity remain unmeasured. [ran]
9. The largest prospective saving is **reducing duplicate resident processes**; a shared backend with a Node stdio bridge per session retains much of the interpreter cost. [inferred]
10. **Decision 33 should be reopened and narrowed:** JS plus public declarations remains the recommended implementation baseline; a per-user daemon’s language should be conditional on transport, memory, concurrency, and maintenance evidence. [inferred]

## Preserved request metadata and evidence boundary

```json
{
  "protocolVersion": "1.0",
  "requestId": "forge-p13-runtime-language-20261002",
  "contextDigest": "34373dbd97bb1042b5c6ee957c26e2e96a3037fdac8bacde103e10edb35add83",
  "context": {
    "summary": "Forge final plan, leg P13: measured runtime and memory efficiency, and the implementation-language choice (JS, TS, Rust, Python)."
  },
  "flowSpec": null,
  "cwd": ".",
  "policy": {
    "write": true,
    "tools": [],
    "maxCostUsd": null
  },
  "route": {
    "model": "gpt-6.1-sol",
    "thinking": "xhigh",
    "search": true
  }
}
```

Research date: **2026-10-02**. The shared instructions at `(local scratch)` were read first. Labels below mean **[read]** inspected source or document, **[ran]** executed observation, **[external]** primary documentation accessed today, and **[inferred]** reasoning, recommendation, or unvalidated estimate.

The inspected tracked ref was `origin/master` (**7d448ec812ef8639790477af07c3c75962173f8a**); the measured checkout’s HEAD was **ba56b9201782c4d1246c77bde6380867603184bf**. The source diff under `bin`, `lib`, and `package.json` named `lib/commands/clean.js`, `lib/commands/worktree.js`, `lib/detect-worktree.js`, and `lib/modules-link.js`. None appeared in the profiled help process’s loaded cache. This connects that help profile to the inspected source more closely, but does not certify every unprofiled invocation against master. [ran]

Remote freshness remains **unverified**: `git ls-remote origin refs/heads/master` failed while trying to connect to `127.0.0.1:9`. Node child-process calls also encountered `spawnSync git EPERM`; direct shell Git reads succeeded. No network or sandbox restriction was bypassed. [ran]

The July memo is absent at its supplied path in the inspected tracked ref. The explicitly supplied historical file at [decision.md](/docs/work/2026-07-12-rust-vs-js-decision/decision.md) was read as a prior decision input. Its historical source counts, startup figures, binary sizes, and assertions about agent proficiency are **not treated as current measurements**. [read/ran]

[P10-typescript-types.md](/docs/work/2026-09-30-forge-final-plan/platform/P10-typescript-types.md), the platform plan’s decision 33, and [north-star.md](/docs/work/2026-09-30-forge-final-plan/north-star.md:38) were read as planning inputs. North-star items 16–17 explicitly call for device memory, cross-project work, cross-device synchronization, and a language decision grounded in runtime efficiency. [read]

Only scratch measurement scripts and results were written by this leg. No commits, pushes, GitHub writes, Kernel mutations, browser sessions, or context-mode calls were executed. No implementation or release validation is claimed.

## 1. Measurements on this machine

### Environment and method

| Item | Observation |
|---|---|
| OS | Windows, reported release `10.0.26200`, x64. [ran] |
| CPU | AMD Ryzen 5 7235HS; eight logical CPUs reported. [ran] |
| Physical memory | 24,260.7 MiB total; 2,062.6 MiB free at the environment observation. Free memory is time-specific. [ran] |
| Node | `v24.18.0`, installed at `C:\Program Files\nodejs\node.exe`. [ran] |
| Bun | `1.4.2`, matching the inspected package-manager pin. [ran/read] |
| Host contention | One process inventory found 108 Node, 43 PowerShell, and four Bun processes. These were not attributed to individual harnesses or Forge projects. [ran] |
| Invocation | Local entry points, bypassing the unrelated global `forge.cmd` installation. [ran] |
| Session context | `FORGE_SESSION_ID=delivery-train-20260928a`. [ran] |
| Automatic background work | `FORGE_SHEPHERD_DISABLE=1` during measurements to contain background activity. [ran] |

Each trial launched a **fresh process**. “Cold start” here means process-cold; it does **not** mean the OS filesystem cache was flushed.

The PowerShell harness used a hidden process with redirected output, a stopwatch, and an 18-second per-process limit. Wall time includes harness launch setup and waiting for process exit. Five-trial medians are the third sorted observation; **p90 uses nearest rank and therefore equals the maximum of five samples**. This is a small-sample description, not a reliable tail-distribution estimate. [ran]

Memory trials used a preload that captured `process.resourceUsage().maxRSS` immediately before writing its result at exit. Node documents that value in **KiB**, converted here to MiB. This is the process high-water RSS up to the probe, excluding subprocess trees and any later reporting allocation. RSS is not private committed memory, and summing it across processes can count shared pages more than once. [external: [Node process documentation](https://nodejs.org/docs/latest-v24.x/api/process.html#processresourceusage), 2026-10-02; inferred]

Uninstrumented help latency was measured separately. That separation matters: the differences between measurement passes are too large and inconsistent to interpret as preload overhead.

The retained aggregate is [p13-evidence.json](/docs/work/2026-09-30-forge-final-plan/.scratch/p13-evidence.json). The harness and probe are [p13-run.ps1](/docs/work/2026-09-30-forge-final-plan/.scratch/p13-run.ps1) and [p13-probe.cjs](/docs/work/2026-09-30-forge-final-plan/.scratch/p13-probe.cjs).

### Actual safe invocation paths — five trials each

All numbers below are **[ran]**. RSS columns come from instrumented memory trials; help’s principal latency row comes from a separate uninstrumented pass.

| Invocation | Runtime | Wall median / p90, ms | Peak RSS median / p90, MiB | Result |
|---|---|---:|---:|---|
| `bin/forge.js --help`, uninstrumented | Node | **3,611.3 / 8,528.2** | **75.16 / 75.24**, separate memory pass | 5/5 exit 0 |
| Same | Bun | **2,743.0 / 3,532.2** | **50.80 / 50.90**, separate memory pass | 5/5 exit 0 |
| `bin/forge.js --help`, memory probe attached | Node | 8,269.7 / 12,517.7 | 75.16 / 75.24 | 5/5 exit 0 |
| Same | Bun | 3,954.5 / 15,812.3 | 50.80 / 50.90 | 5/5 exit 0 |
| Native hook, described below | Node | **1,472.7 / 4,778.7** | **63.14 / 63.18** | 5/5 exit 0 |
| Same | Bun | **663.7 / 2,045.3** | **36.89 / 36.97** | 5/5 exit 0 |
| `bin/forge.js recap`, without issue ID | Node | 1,360.7 / 1,704.9 | 75.60 / 75.65 | 5/5 exit 1: usage |
| Same | Bun | 2,603.7 / 3,795.0 | 51.07 / 51.42 | 5/5 exit 1: usage |
| Empty control, `-e 0`, memory probe attached | Node | **2,684.9 / 3,795.2** | **62.56 / 62.61** | 5/5 exit 0 |
| Same | Bun | **505.6 / 1,430.6** | **35.46 / 35.49** | 5/5 exit 0 |

The hook invocation was:

```text
.forge/hooks/forge-native-hook.js
  --intent protected-write
  --harness codex
```

Its synthetic stdin was:

```json
{"tool_input":{"file_path":"README.md"}}
```

This exercises the native guard’s argument, input, configuration, and path-decision path without executing an edit or commit. It does **not** measure a Git-backed TDD check, a complete harness hook chain, or a session-start hook. [read/ran: [forge-native-hook.js](/.forge/hooks/forge-native-hook.js:401)]

Time measured **after preload initialization** was:

| Path | Node median / p90, ms | Bun median / p90, ms |
|---|---:|---:|
| Native hook | **21.03 / 33.69** | **9.18 / 22.47** |
| Empty control | 1.58 / 1.80 | 1.77 / 2.39 |
| Help, instrumented memory pass | 1,485.78 / 2,025.54 | 2,017.79 / 2,853.59 |

These internal timers exclude interpreter startup and preload initialization. They must not replace user-visible hook latency. Conversely, the very slow empty-process control prevents attributing the entire measured wall time to Forge’s own guard logic. The cause of the launch/filesystem/scheduling delays was not isolated. **The July memo’s 500 ms hook trigger is inconclusive on this evidence.** [ran/inferred]

### Requested successful commands that could not be measured

The no-Kernel-mutation instruction takes precedence over the general suggestion to use these commands for orientation.

| Requested path | Why successful execution was not run |
|---|---|
| `forge ready --json` | The inspected command-options path constructs a migrated broker. Initialization can execute pragmas and migration DDL. [read] |
| `forge show <id>` | It uses that broker path; a successful show also records `context.loaded`. [read] |
| `forge recap <id>` | A successful issue recap attempts to record `context.loaded`. [read] |
| `forge recall <q>` | The inspected handler can record recall-usage evidence; its store initialization also requires care under the mutation restriction. [read] |

The source anchors are [cli-broker-factory.js](/lib/kernel/cli-broker-factory.js:108), [recap.js](/lib/commands/recap.js:56), and the inspected commands:

```text
git show origin/master:lib/commands/_resolve-command-opts.js
git show origin/master:lib/commands/_issue.js
git show origin/master:lib/commands/recall.js
```

No real issue ID was selected for a successful `show` benchmark. No fake-ID failure was presented as successful issue retrieval. **Successful database-query latency, end-to-end RSS, contention, and throughput remain unknown.**

### Safe command-load probes — five trials each

These probes **require the real command module but do not call its handler**. They omit the full CLI bootstrap, database opening, queries, rendering, event recording, and subprocess work. They describe module-load cost only. All numbers are **[ran]**.

| Loaded command module | Runtime | Wall median / p90, ms | Peak RSS median / p90, MiB | Cache entries |
|---|---|---:|---:|---:|
| `ready` | Node | 920.3 / 1,370.3 | 71.30 / 71.52 | 121 |
| `ready` | Bun | 678.9 / 1,376.4 | 45.18 / 45.34 | 121 |
| `show` | Node | 1,077.1 / 2,286.0 | 71.69 / 71.86 | 121 |
| `show` | Bun | 2,947.6 / 4,797.7 | 44.61 / 45.62 | 121 |
| `recap` | Node | 1,821.2 / 3,819.5 | 71.79 / 71.82 | 116 |
| `recap` | Bun | 2,600.6 / 3,310.0 | 44.63 / 44.73 | 116 |
| `recall` | Node | 1,717.6 / 2,684.0 | 71.83 / 72.04 | 117 |
| `recall` | Bun | 1,618.6 / 2,376.6 | 44.60 / 44.66 | 117 |

The inconsistent latency ordering is another reason to avoid a universal “Bun is X times faster” conclusion. Bun’s lower RSS is a more consistent observation across these measured paths. [inferred]

### Module-load breakdown

A separate Node help trial instrumented `Module._load`, recording inclusive time and subtracting nested loads for exclusive time. It observed **401.98 ms inside the entry-point load**, versus **409.15 ms from preload completion to the exit probe**. These are wall-clock measurements from one profiled trial, including filesystem and scheduling effects; they are not CPU-only attribution. [ran]

| Load root or dependency | Inclusive time, ms | Interpretation |
|---|---:|---|
| `lib/commands/_registry` | **165.23** | Includes its dependency graph, including configuration-related loading. |
| First `yaml` load | **136.08** | Nested within the wider graph; do not add it again to registry time. |
| `lib/commands/_resolve-command-opts` | **87.13** | Includes Kernel factory/driver dependencies. |
| Kernel `sqlite-driver` load | **75.57** | Nested within the options graph; this is source/module loading, not a measured SQLite query. |
| `lib/docs-command` | **44.50** | Eagerly brings the documentation parser into help startup. |
| `@babel/parser` | **41.78** | Largest individual exclusive load in this sample. |
| `lib/workflow/enforce-stage` | **15.57** | Stage-enforcement dependency loading. |

The three disjoint direct roots—registry, command options, and documentation command—account for approximately **297 ms, or 74%**, of that entry-load sample. [ran]

The important finding is **eager dependency placement**, rather than one dominant application algorithm. The entry point loads documentation and setup-related modules before handling ordinary help. [read: [bin/forge.js](/bin/forge.js:56); ran]

The generated lazy command manifest already exists. Recommending its creation again would repeat completed work. The next optimization should target the remaining eager bootstrap and dependency edges while preserving extension discovery and command behavior. [read: [registry source](/lib/commands/_registry.js:15); inferred]

Bun populated the cache inventory, but the `Module._load` interception recorded **zero calls**. Therefore **no Bun per-module timing breakdown is claimed**. Its compatible cache inventory is useful; the same instrumentation hook was ineffective for timing. [ran]

### Dependency and installation size

The inspected runtime manifest declares three dependencies: **`@babel/parser`, `cross-spawn`, and `yaml`**. The resolved installed versions were 8.0.4, 7.0.6, and 2.9.0 respectively. The measurement resolver used the main repository’s installed dependency tree; those installed files were measured as runtime inputs, not used as repository-source authority. [read/ran]

| Measurement | Result |
|---|---:|
| Help cache inventory, including measurement preload | 146 entries; **2,002,209 stattable source bytes** |
| Loaded files under `node_modules` | 73 files; **768,572 bytes**, approximately 0.733 MiB |
| Installed `@babel/parser` directory | **1,858,305 bytes**, 9 files |
| Installed `yaml` directory | **685,953 bytes**, 233 files |
| Installed `cross-spawn` directory | **16,094 bytes**, 9 files |
| Sum of those three direct dependency directories | **2,560,352 bytes**, approximately 2.44 MiB |
| Complete installed `node_modules` byte size | **Unknown** |

Directory sizes include package contents, not merely executable JS. The three-directory sum excludes separately installed transitive packages. `cross-spawn` was not present in the profiled help cache. [ran]

The first bounded installation traversal was incomplete. A second directory enumeration returned **172,254 entries after 191,077 ms**, exceeding its budget before file sizes could be accumulated. Its reported zero bytes means **no completed byte census**, not an empty installation. See [p13-node-modules-size.json](/docs/work/2026-09-30-forge-final-plan/.scratch/p13-node-modules-size.json). [ran]

Installed disk size, loaded source bytes, and resident memory are different quantities. The entire development dependency tree is not loaded into every Forge process. [inferred]

### Compiled Bun attempt

The scratch-only command attempted was:

```text
bun build --compile --define FORGE_COMPILED=true ./bin/forge.js
  --outfile docs/work/2026-09-30-forge-final-plan/.scratch/forge-p13.exe
```

It exited 1 after approximately **1,667 ms**:

```text
error: Could not resolve: "./embedded-assets.generated.mjs"
```

The inspected normal binary build first generates embedded assets. Running that generator would write outside this leg’s permitted scratch/output scope, so it was not run. This result establishes a **missing prerequisite in this checkout**, not that Bun compilation cannot support Forge. Compiled binary size, startup, RSS, and functional parity are unmeasured. [ran/read]

Time spent fell into orientation/source reads, measurements, compile investigation, filesystem census, and reporting. The biggest waste was waiting through host-dependent launch/filesystem delays; the final census also crossed the explicit fallback limit.

## 2. Workload model: invocation versus residence

Let:

- **N** be concurrent harness sessions.
- **S** be Forge-related resident stdio processes per session.
- **K** be CLI invocations actually overlapping.
- **P** be projects actively retained by a shared service.
- **R** be one full resident server’s memory.
- **D** be a shared daemon’s base memory.
- **C** be incremental client/bridge memory.
- **m** be retained memory per active project.

These are planning variables; the resident values have not been measured.

| Architecture | Approximate incremental memory |
|---|---|
| Short-lived CLI | `K × Rcli` while commands overlap; zero Forge CLI residence after exit |
| Separate resident servers | `N × S × R` |
| Shared daemon with clients in existing harness runtimes | `D + P × m + N × C` |
| Shared daemon with a stdio bridge per session | Same formula, but `C` includes each bridge’s interpreter/runtime |
| Rust daemon with JS workers | Add the JS worker pool; native core savings do not remove worker memory |

The MCP specification defines stdio as a client-launched server subprocess. Streamable HTTP permits an independent server serving multiple client connections. Actual client transport support must be certified per harness. [external: [MCP transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports), 2026-10-02]

**Many projects alone do not imply many persistent Forge processes.** Device memory can be a scoped user-level store opened on demand. Continuous synchronization, watchers, or a shared multi-client service may justify residence; durable storage alone does not require it. [inferred]

### Illustrative memory scaling

The following table is **[inferred]**, using explicit assumptions:

- Duplicate servers use the measured help-process median as a **bootstrap proxy**: Node 75.16 MiB, Bun 50.80 MiB. A real server may need more.
- Shared JS daemon base budget: **128 MiB**, plus ten active projects at **2 MiB/project**, giving 148 MiB before clients.
- Direct/native harness client budget: **2 MiB/session** in an existing process.
- Node stdio bridge uses the measured empty-runtime **62.56 MiB** as an optimistic proxy.
- Bun stdio bridge uses the measured empty-runtime **35.46 MiB** as an optimistic proxy.

All values are MiB. These are summed RSS planning proxies, **not measured system commit or PSS**.

| Architecture | N=1 | N=5 | N=10 | N=20 |
|---|---:|---:|---:|---:|
| One full Node server/session | 75 | 376 | 752 | **1,503** |
| One full Bun server/session | 51 | 254 | 508 | **1,016** |
| Shared JS daemon + direct clients | 150 | 158 | 168 | **188** |
| Shared JS daemon + Node stdio bridges | 211 | 461 | 774 | **1,399** |
| Shared JS daemon + Bun stdio bridges | 183 | 325 | 503 | **857** |
| CLI-only, no invocation active | 0 | 0 | 0 | **0** |

Under these assumptions:

- At 20 sessions, direct clients reduce the Node bootstrap proxy from about **1,503 to 188 MiB**, an approximately **87% reduction**. [inferred]
- Node stdio bridges reduce it only to about **1,399 MiB**, approximately **7%**. Real bridges could consume more than the empty control. [inferred]
- Three duplicated servers per session would multiply the duplicate-server rows by three: approximately **4,510 MiB for Node** or **3,048 MiB for Bun** at 20 sessions. Consolidating those servers can be valuable before changing language. [inferred]

For this model, a direct-client shared service breaks even against the Node bootstrap proxy around **three sessions**. With Node stdio bridges it takes approximately **12 sessions**. These break-even points depend on unvalidated daemon, cache, and client budgets. [inferred]

This is the main architectural distinction: **“one MCP multiplexer” does not automatically mean “one process across all harnesses.”** A multiplexer per session still has N runtimes. A shared backend needs a transport and lifecycle design that avoids—or deliberately minimizes—those client runtimes. [inferred]

A Rust daemon would save only its portion of this equation. For example, replacing a hypothetical 128 MiB daemon base with a 64 MiB native budget saves **64 MiB**; it does not eliminate twenty Node bridges. The 64 MiB native figure is a **target scenario, not a Rust measurement**. [inferred]

## 3. Options compared

| Option | Startup/RSS evidence | Distribution and extension fit | One-maintainer implications | Assessment |
|---|---|---|---|---|
| **JS on Node 24** | Measured help 75.16 MiB; empty control 62.56 MiB. Quiet-host startup and successful query throughput remain unknown. [ran] | Fits the existing npm package and JS implementation; public declarations serve TS users. [read/inferred] | Preserves the inspected Bun tests, ESLint, c8, Stryker, and hook tooling. [read] | **Recommended CLI/API baseline.** Optimize bootstrap and process topology. [inferred] |
| **JS on Bun** | Lower RSS across measured paths; latency ordering is inconsistent under contention. [ran] | Same JS author surface; runtime and SQLite behavior still need release parity. [read/inferred] | Existing Bun tooling reduces introduction cost, but Node support remains required. [read/inferred] | **Optional measured runtime path**, rather than a reason to remove Node support. [inferred] |
| **Bun compiled binary** | No executable measurement: missing generated asset prerequisite. [ran] | Bundles code and runtime; assets and dynamic loading require explicit treatment. [external] | Adds per-platform artifact and installed-behavior proof. [inferred] | Consider after exact artifact parity, not as an already-proven efficiency solution. [inferred] |
| **JS plus types / selected TS source** | Type declarations do not remove runtime costs; emitted JS remains the consumer runtime. [external/inferred] | Strong fit for JS/TS authors and harness plugins. [external] | Keeps P10’s narrow typing work separate from a broad migration. [read/inferred] | **Retain P10.** Use selected TS conversion only where maintainability pays for it. [inferred] |
| **Full TS conversion** | No Forge conversion benchmark. Type-only conversion offers no demonstrated RSS reduction. [external/inferred] | Still distributes JS for the supported npm runtime path. [external/inferred] | Expands migration and compiler work without resolving duplicated processes. [inferred] | Reject as the runtime-efficiency intervention. [inferred] |
| **Rust core / daemon, JS SDK** | No comparable Forge Rust implementation was measured. Ownership avoids a GC, but actual RSS depends on libraries, caches, workers, and any JS engine. [external/inferred] | JS SDK can preserve author access; native binaries complicate one-package distribution and platform support. [inferred] | Adds a second toolchain, protocol boundary, release matrix, and debugging stack. Existing black-box contracts can be reused, not all JS unit tests unchanged. [inferred] | **Credible bounded daemon candidate**, conditional on measured benefit. Avoid a whole-core rewrite. [inferred] |
| **Python** | No comparable Forge Python implementation or RSS measurement. No startup advantage is claimed. | Python agent SDKs exist, but Pi/OpenCode plugin surfaces are JS/TS. An npm-first product needs an interpreter, executable, or process boundary. [external/inferred] | Introduces a second implementation/toolchain and distribution coordination. [inferred] | Retain as a consumer/adapter language; reject a core rewrite without a specific Python workload benefit. [inferred] |

### JS on Node and Bun

The current evidence supports two relatively small interventions: defer irrelevant bootstrap loads, and avoid multiplying full runtimes per session. Moving help closer to the empty-runtime footprint suggests an **illustrative headroom of approximately 12.6 MiB on Node and 15.3 MiB on Bun**. These differences between measurements are not validated savings from a patch. [ran/inferred]

Node’s runtime floor remains relevant to any resident stdio bridge, even after lazy loading. Conversely, a CLI that exits after a short operation does not permanently consume that floor. [inferred]

Bun’s executable compilation moves work such as resolution and parsing to build time and bundles a copy of its runtime. Dynamic files, workers, and asset placement require explicit packaging. Those mechanisms support trying it, but do not establish a Forge startup or RSS result. [external: [Bun executable documentation](https://bun.sh/docs/bundler/executables), 2026-10-02]

### TypeScript: types versus conversion

Node’s TypeScript stripping removes supported type syntax; it does not type-check, ignores `tsconfig.json`, and does not strip TS beneath `node_modules`. Publishing JS runtime files therefore remains the appropriate Node package boundary. [external: [Node TypeScript documentation](https://nodejs.org/docs/latest-v24.x/api/typescript.html), 2026-10-02]

Generated declarations from annotated JS are supported by TypeScript tooling. P10’s chosen public-schema, JSDoc, declaration-closure, and packed-consumer approach addresses the public typing need without requiring a full source conversion. [external: [TypeScript declaration generation from JS](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html), 2026-10-02; read/inferred]

Selected TS source conversion can still be worthwhile for difficult generic relationships or maintenance. That is a separate decision from VM startup or resident memory.

### Rust and the new daemon trigger

The July memo explicitly names a **long-lived multi-client daemon/server** as a reason to revisit Rust. A per-user service serving projects and concurrent harness sessions is that workload class. The old blanket conclusion that memory/concurrency is irrelevant to a short-lived CLI cannot be extended to such a service. [read/inferred]

Rust’s ownership model provides memory-safety guarantees without a garbage collector. That supports evaluating a compact native service, but does not supply a measured Forge memory figure. [external: [Rust ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html), 2026-10-02]

Two hybrids have materially different costs:

- **Rust data/transport service with JS execution in existing hosts or a bounded worker pool.** Measure the entire process set, including workers and bridges. [inferred]
- **Rust service embedding a JS engine.** This retains engine costs. For example, `deno_core` embeds V8 and exposes Rust-to-JS operations, but does not itself provide TypeScript support. Its footprint cannot be assumed equivalent to a small native-only daemon. [external: [Deno Core documentation](https://docs.rs/crate/deno_core/latest), 2026-10-02; inferred]

There is also an ABI constraint: P10 and the platform plan propose synchronous author actions and bound services. Moving a bound service across asynchronous IPC is **not automatically transparent**. The prototype must specify execution placement and pass the same author contract, or introduce an explicitly versioned different boundary. Hiding synchronous IPC or a second policy implementation would undermine both efficiency and maintainability. [read/inferred]

### One npm package remains a constraint

npm supports executable entry points and OS/CPU metadata. Common native-distribution patterns use platform-specific optional packages, but that would conflict with the stated **one-package rule**. [external: [npm package metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), 2026-10-02; read/inferred]

A native component would therefore need an explicitly chosen distribution approach, such as one package carrying supported binaries, or a separately verified binary download with a supported fallback. Those approaches require size, offline-install, integrity, platform, and upgrade proof; they are not included in the current successful measurements. [inferred]

### Harness SDK fit

| Harness | Verified language surface | Consequence |
|---|---|---|
| Pi | TS extensions; local JS/TS loading. [external: [Pi extensions](https://pi.dev/docs/latest/extensions), 2026-10-02] | JS/TS remains the natural in-process adapter surface. [inferred] |
| OpenCode | JS/TS plugins, including npm plugins installed through Bun. [external: [OpenCode plugins](https://dev.opencode.ai/docs/plugins/), 2026-10-02] | A Rust/Python service needs a JS/TS adapter or protocol boundary. [inferred] |
| Codex | Official TS and Python SDK surfaces. [external: [Codex SDK](https://developers.openai.com/codex/sdk), 2026-10-02] | Python is viable for consumers; it does not require Forge’s core to become Python. [inferred] |
| Claude Agent SDK | TS and Python; other languages can use CLI subprocess integration. [external: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview), 2026-10-02] | A language-neutral service can coexist with JS/TS adapters, but subprocess overhead remains part of the model. [inferred] |

Python’s standard GIL builds constrain concurrent Python-bytecode execution; I/O, native extensions, and free-threaded builds change that analysis. This does **not** establish a blanket Python throughput penalty for Forge. [external: [Python glossary](https://docs.python.org/3/glossary.html), 2026-10-02]

Python packaging with compiled extensions also introduces interpreter/OS/architecture wheel considerations. That is additional distribution coordination, not evidence of universally slower startup. [external: [Python packaging flow](https://packaging.python.org/en/latest/flow/), 2026-10-02]

## 4. Recommendation and thresholds that would change it

**Recommended implementation baseline: JS runtime files, Node 24 compatibility, P10 public declarations, compiled TS blocks, and an optional Bun path validated against the real artifact.** Do not undertake a full Rust, TS, or Python rewrite to solve the observed process-memory problem. [inferred]

For device memory and cross-project work, first decide which operations need residence. Start with on-demand access where it meets the product requirement. When continuous service is necessary, prototype one shared per-user owner with bounded project retention and clients in existing harness runtimes where supported. [inferred]

A shared endpoint introduces material scope and lifecycle requirements: per-project identity and consent, bounded caches/queues, safe concurrent access, shutdown/restart behavior, version compatibility, and authenticated local access. The MCP HTTP specification also requires protections such as Origin validation. These belong in the architecture proof before comparing language implementations. [external: [MCP transport requirements](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports), 2026-10-02; inferred]

The following are **proposed decision thresholds**, not existing gates or measured achievements:

| Trigger | Decision it should prompt |
|---|---|
| One consolidated server per session exceeds **96 MiB idle**, or Forge’s incremental process set exceeds **1 GiB at 20 sessions** | Prioritize process consolidation and transport changes. The present bootstrap proxies already make this worth investigating. |
| A shared JS daemon with ten representative active projects exceeds **128 MiB idle** or **256 MiB sustained working RSS** after cache/lazy-load tuning | Compare a bounded Rust implementation of the same service contract. |
| Required stdio-only clients need bridges above **32 MiB/session**, and many-session use is material | Compare a small native bridge or another supported transport; switching only the daemon language may save little. |
| Quiet-host, paired measurements show Forge hook **p90 above 500 ms**, attributable to its runtime/bootstrap after lazy loading and compiled-Bun evaluation | Revisit the hook/launcher component. This session does not establish that trigger. |
| A real command has a JS compute path exceeding **20% of wall time and 100 ms**, confirmed by profiling | Prototype that component in Rust rather than rewriting orchestration and public APIs. |
| Continuous cross-device sync/watch or multi-client authority becomes a committed requirement | Reopen daemon architecture immediately; select its language after equivalent workload measurements. |
| A Rust prototype cuts total Forge-process memory by **at least 50%**, or doubles relevant throughput, while passing the same conformance/recovery suite | Consider adopting the bounded component, including maintainer and distribution costs. |
| Public type maintenance repeatedly consumes more than the agreed maintenance budget | Consider selected TS source conversion for maintainability; do not characterize it as an RSS optimization. |

For one maintainer plus agents, the next comparison should be deliberately bounded: one daemon responsibility, one public contract, and the same workload on JS and Rust. Whole-core migration effort is not responsibly estimable from this benchmark. Agents’ relative productivity in these languages was not measured. [inferred]

The July recommendation is thus **partly retained and partly reopened**. Its “avoid a rewrite without a qualifying workload” principle still fits. Its resident-daemon trigger now deserves active architectural evaluation.

## Bottom line — decision recap, 10 lines

1. Keep JS for the CLI, public APIs, and outside-author SDK. [inferred]
2. Keep P10’s public declaration plan; full TS conversion does not answer the memory question. [read/external/inferred]
3. Bun used less RSS on the measured paths, but its startup advantage is not established under this host’s contention. [ran/inferred]
4. Native-hook execution was small inside the process; user-visible hook latency still needs quiet-host measurement. [ran/inferred]
5. Eager bootstrap loading is a demonstrated optimization target; the lazy command manifest already exists. [read/ran]
6. Successful issue and recall benchmarks remain unmeasured under the no-mutation restriction. [read]
7. Compiled Bun remains unverified because the allowed scratch build lacked generated assets. [ran]
8. Consolidating residence can save more than changing the daemon language, particularly with direct harness clients. [inferred]
9. Rust is a valid candidate for a bounded shared service or thin bridge, subject to equivalent measurements and one-package distribution. [inferred]
10. Reopen decision 33’s combined language verdict, retain the recommended JS/public-type baseline, and separate the daemon decision. [inferred]

## Recommended plan changes

1. **Split decision 33.** Record the owner’s reopening explicitly. Retain JS runtime distribution and public declarations as the recommended CLI/SDK choice; give the resident service a separate conditional language decision. [inferred]
2. **Add a process-topology inventory.** For each supported harness, count full servers, bridges, workers, and background watchers. Distinguish projects from sessions and active CLI overlap. [inferred]
3. **Add remaining eager-load work without repeating the manifest refactor.** Focus on documentation/parser, command-options/Kernel, setup, and configuration loading; preserve the inspected command and extension behavior. [read/inferred]
4. **Complete the missing benchmark under appropriate authority.** Use a non-authoritative fixture or explicitly permitted isolated store for successful `ready`, `show`, `recap`, and `recall`; retain bookkeeping behavior. Run Node 24/26, pinned Bun, and the actual packed artifact on quiet hosts. [inferred]
5. **Measure residence as a process set.** Record idle/working RSS, private memory where available, ten/twenty-project retention, 1/5/10/20 clients, request throughput, locking, queue limits, restart, and project eviction. Include every bridge and JS worker. [inferred]
6. **Finish compiled-Bun artifact proof.** Generate assets in an authorized build lane, then measure and test the binary on every supported target. Do not promote it from source-level compile plausibility. [inferred]
7. **Stage a bounded Rust comparison only against a specified service contract.** Preserve public JS/TS APIs, author ABI, authority semantics, and black-box conformance. Cost the native distribution and additional maintenance explicitly. [inferred]
8. **Keep cross-device synchronization and scope semantics separate from language.** Language selection cannot substitute for delivery, provenance, consent, conflict, and recovery behavior. [inferred]

These are planning recommendations only. They were not filed as Kernel issues because this leg explicitly prohibits Kernel mutations.

## Open questions for the owner

| Choice | Plan direction | Reasoning |
|---|---|---|
| **A — JS first, shared-runtime proof (default)** | Retain JS plus public declarations; optimize bootstrap and measure the shared service/transport before selecting a native component. | Preserves existing tooling and author access while directly testing the new many-session memory requirement. |
| **B — Bounded Rust comparison now** | Keep the JS SDK, but place an equivalent Rust daemon or bridge prototype in the next planning sequence. | Appropriate if continuous device/cross-device service is already committed or stdio-only session counts make interpreter floors unacceptable. Adds a native toolchain and distribution proof. |
| **C — On-demand device memory first** | Keep 0.1.0 CLI-oriented; deliver scoped device storage and defer always-on synchronization/service operation. | Minimizes resident memory and maintenance while retaining the north-star direction. It postpones continuous behavior, not durable device memory. |

**Default: A.** A label, or silence, selects the stated planning default. This research phase does not authorize implementation, installation, migration, or publication.

## Confidence

**High** in the recorded five-trial RSS observations, safe-path exit results, Node module-load sample, dependency-directory sizes, source-backed bookkeeping/migration limitation, and failed scratch compilation.

**Medium** in retaining JS for the CLI/SDK and prioritizing process consolidation: that recommendation fits the observed runtime floors, existing tooling, and primary SDK surfaces.

**Low** in portable startup rankings, complete installed dependency size, real resident-service memory, successful Kernel command latency, concurrency throughput, Rust/Python comparative performance, and migration effort. The numerical daemon/client budgets are explicit planning assumptions.

The phase returns a complete research report with those limitations. It does **not** establish release readiness or a completed all-language runtime comparison.
