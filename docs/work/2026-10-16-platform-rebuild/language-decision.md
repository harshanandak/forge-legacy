# Language decision for the platform rebuild

Research memo, 2026-10-16. Nothing was changed except this file. No commits and no installs. One throwaway probe ran in an OS temp directory (`/tmp/tmp.1zIGnSmQOc`, left in place).

**Labels:** `read` = file inspected (path:line), `ran` = command executed here, `web` = primary source fetched 2026-10-16 (URL given), `inferred` = judgment.

## Decision

| Option | What it means |
| --- | --- |
| **A — TypeScript everywhere, erasable-only, no build in dev; compiled JS + `.d.ts` published (default)** | New core and every ported engine written as `.ts` using only syntax that type stripping can remove. Node 24/26 and Bun run the sources directly in dev and test. The publish step emits `.js` + `.d.ts`. Public JSON Schemas stay the one source of truth, and types are derived from them. Outside blocks stay JS/TS-authored, loaded in-process through the plan's `trusted-action-sync/v1` `.cjs` ABI. |
| B — TS everywhere plus one Rust component | A, plus a Rust component (napi-rs addon or sidecar binary) for one named workload. **Not selected now.** It stays a reserved slot behind a contract, opened only by a trigger in §6. |
| C — Stay JavaScript + JSDoc (prior plan baseline, P10) | Keep JS sources and generate declarations from JSDoc with `allowJs/checkJs/declaration`. |
| D — Rust core | Rewrite Kernel/Contracts/Memory/Flow and the runtime path in Rust, hosting JS blocks over subprocess/MCP/WASM. |

**Silence selects A.**

### Reason (strongest two first)

1. **The premise behind C has gone.** The new project writes the skeleton fresh and reshapes every ported engine behind new contracts (ADAPT is the main disposition: `read: architecture-evaluation.md:30–35`). P10 priced full TS conversion at 50–90 worker-days because it assumed converting ~101K lines of live code in place (`read: P10-typescript-types.md:305–307`). Here, only selected engines come over (default DROP: `read: brief.md`). Those are ~20.3K source lines (kernel 13,762, contracts 881, memory 872, memory-core 1,984, flow 2,760) plus ~23.7K test lines (`ran: wc over inventory-master/lib,test`). Each file is touched during the reshape anyway, so typing it then costs little extra. Separately, **TypeScript 7 weakened the JSDoc route C depends on**. It removed `@enum`, Closure-style tags and constructor-function support. It forbids mixing `module.exports =` with `module.exports.x =`. It also says JS declaration emit "matching Strada's exact output is not a goal" and is "less well-defined when errors are present" (`web: https://github.com/microsoft/typescript-go/blob/main/CHANGES.md`, fetched 2026-10-16). Generating public `.d.ts` from JSDoc was P10's core mechanism. It now runs on the compiler's least-supported path, and P10's own probe already got `emitSkipped:true` on today's code (`read: P10-typescript-types.md:228–232`).
2. **Outside authors and the runtime are JS.** Blocks are written mostly in JS/TS and load in-process as a synchronous CommonJS `operations` export (`read: platform-plan-final.md:337–348,365`). A TS core gives those authors the *same* types the core uses, through `import type` and no runtime dependency (`read: plan:628`). A Rust core cannot load those blocks in-process. It would need an embedded JS engine, a Node host or a subprocess/MCP hop, which breaks the sync ABI and the admission model. A Rust core also contradicts the owner's brief: "Nothing is rewritten that already works" (`read: brief.md`, Decision item 2). Rust is a full rewrite of logic *and* 80 `bun:test` files (`ran: grep -l bun:test → 80`).

Supporting: types come from the schemas at every point the plan already requires (`read: plan:584`). Agents write and refactor TS at least as fluently as JS, and the type checker gives them refactor feedback that JSDoc gives only partly (`inferred`). The inner loop needs no build step: `node file.ts` runs directly (`ran`), and the TS 7 checker is ~10× faster than 6.0 (`web`, below).

### Alternatives rejected

- **C (JS + JSDoc):** see reason 1. It also keeps the "two truths" risk: JSDoc annotations drift from implementation more easily than inline types. Its only advantage was avoiding a conversion that is now happening regardless (`inferred`).
- **D (Rust core):** it would rewrite ~44K lines of working code and tests, against the brief. It puts a language barrier between the core and the JS/TS block authors, and turns in-process sync blocks into IPC. It needs per-platform binaries for every user (`web: https://napi.rs/docs/deep-dive/release` — one npm package per target, `optionalDependencies`, plus one build job and runtime test per target). It adds nothing measurable against Forge's real bug classes, which are environmental and integration bugs (`read: 2026-07-12 decision.md`). Startup and RSS gains were not measured. P13 found latency on this host too noisy to rank, and a Rust daemon would not remove per-session Node bridges (`read: P13:10,281`).
- **B now:** no component meets a trigger (§6). Adding Rust brings back a native-compile dependency the SQLite design deliberately avoids (`read: 2026-07-12 decision.md`; `nativeCompileDependency:false` per P10:350).
- **Non-erasable TS (enums, namespaces, parameter properties, decorators):** rejected. It forces a build or loader at runtime. Node 26 removed `--experimental-transform-types` (`web`, below).
- **Publishing raw `.ts` to npm:** rejected. Node refuses to strip types under `node_modules` (`web`, below).

## 1. Contract-first: one source of truth

| Tool | Direction | Fit | Evidence |
| --- | --- | --- | --- |
| **JSON Schema files + `json-schema-to-typescript` style generator** | schema → `.d.ts` | Best match to the plan's rule that "authoritative schemas generate public JSON data types… docs/catalog and examples" (`read: plan:584`). The schema files stay language-neutral data that outside authors and other languages can read. | npm page returned 403. Version and keyword coverage **not verified**: pin it and test every schema construct used, or write a small in-house generator for the bounded schema profile (`inferred`). |
| TypeBox 1.x (`typebox`) | TS builder → JSON Schema object + `Static<>` type | The schema *is* a JSON Schema object at runtime, with 2020-12 support and a JIT validator. It is ESM-only and targets TS 7. | `web: https://github.com/sinclairzx81/typebox` (fetched 2026-10-16). |
| Zod v4 `z.toJSONSchema` | Zod → JSON Schema | Wrong direction for contract-first: the code becomes the truth. It throws on unrepresentable types (date, bigint, transform…), and `z.fromJSONSchema` is "not considered part of Zod's stable API". | `web: https://zod.dev/json-schema`. |
| schemars / serde (Rust) | Rust type → JSON Schema (2020-12 in examples) | Also code-first. Going schema → Rust needs a separate tool; the docs do not cover this. Only relevant under B or D. | `web: https://graham.cool/schemars/`. |

**Default (inferred):** the committed `.json` schemas are the truth, kept in the bounded profile the plan fixes (`read: plan:636,663–669`). A pinned generator writes `src/generated/*.ts` type files, which are committed and drift-checked by byte comparison. Runtime validation uses the existing validator path (`lib/contracts/src/validate.js`, ported). TypeBox is the fallback *only if* the in-house validator is dropped. Even then, the schemas TypeBox emits must be serialized back to the same committed `.json` files and compared, so there is still one truth.

## 2. Outside authors

| Core language | Authoring | Loading | Trust / admission | Conformance |
| --- | --- | --- | --- | --- |
| **TS (A)** | Write JS or TS. Import public types with `import type` (no runtime dependency). Compile to a single `.cjs` bundle with your own toolchain (`read: plan:365,628`). | In-process `require` of the captured `.cjs`, unchanged from the plan. | Unchanged: no positive admission means no import. In-process code has ambient privileges (`read: plan:338`). | The same TS types drive static negatives (Promise output rejected) plus runtime negatives (`read: plan:628`). |
| JS (C) | Same as A, but types come from JSDoc emit (fragile in TS 7, see reason 1). | Same. | Same. | Same, with weaker declarations. |
| Rust (D) | Authors still write JS/TS. The core must ship TS declarations anyway, maintained separately from the Rust types (`inferred`). | Needs an embedded JS engine, a Node child process or MCP. In-process sync is impossible (`inferred`). | Admission moves into process spawning; a subprocess boundary is not a sandbox either (`inferred`). | Two implementations of the ABI to keep in step (`inferred`). |

WASM blocks are a future *profile* in any core language (the plan already lists offline WASM policy evaluators as an adapter option: `read: plan:500`). They do not argue for a Rust core.

## 3. Agents as the main developers

- TS/JS is the dominant language of the current tooling and of open-source training data. Agents' refactors in TS get compiler-checked call sites, which JS lacks (`inferred`. Fluency in Rust vs TS was not measured here, and the July memo's "agents are weak in Rust" claim was untested: `read: P10:351`).
- Inner loop: `node x.ts` runs with no build (`ran: Node v24.18.0` printed `erasable ok 1`). `bun x.ts` likewise. Full type check: TS 7 `tsc` is native Go, "often about 10 times faster than TypeScript 6.0" (`web: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/`, published 2026-07-08). `bun check` reports the same errors as TS 7 `tsc` and runs on all cores (`web: https://bun.sh/docs/runtime/check`).
- Rust: compile and link times plus borrow-checker iteration slow every edit-test cycle. Lanes would need a cargo toolchain per worktree (`inferred`).

## 4. Runtime and distribution facts (decision-gating)

| Fact | Status | Source |
| --- | --- | --- |
| Node type stripping: added 22.6.0 → default-on 23.6.0 / 22.18.0 → no warning 24.3.0 → **Stable (2) in 24.12.0 / 25.2.0** | Verified | `web: https://nodejs.org/docs/latest-v24.x/api/typescript.html`, `…/latest-v26.x/api/typescript.html` |
| Not supported: `enum`, namespaces with runtime code, parameter properties, import aliases (need transforms). Decorators cause a parse error. `.tsx` unsupported. `tsconfig.json` ignored (no `paths`). Type-only imports need `type`. Explicit `.ts` extensions are required. No type checking. | Verified (docs). Enum, namespace and parameter-property failures **ran** on Node 24.18.0. Bun ran the same enum file. | same + `ran` |
| `--experimental-transform-types` **removed in Node 26.0.0** | Verified | `web: latest-v26.x typescript.html` |
| Node refuses to strip TS under `node_modules` → publish JS | Verified | same |
| Node's recommended tsconfig: `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`, `module: nodenext` | Verified | same |
| Bun runs TS without type checking. `bun check` / `--check` give TS 7–equivalent checking and never emit. Use `tsc` for `.d.ts`. | Verified | `web: https://bun.sh/docs/runtime/check`, `…/runtime/typescript` |
| TypeScript 7.0 stable 2026-07-08, ships as `typescript` (`tsc`). `strict` default true. **No programmatic API until 7.1** (`@typescript/typescript6` re-exports the 6.0 API). JS/JSDoc support reworked. | Verified | `web: devblogs announcing-typescript-7-0`; `CHANGES.md` |
| `node:sqlite`: flag dropped 22.13 / 23.4. **Release candidate (1.2) since 24.15.0.** It ran on 24.18.0 with no warning, SQLite 3.53.1. | Verified + ran | `web: https://nodejs.org/docs/latest-v24.x/api/sqlite.html`; `ran` |
| `bun:sqlite` is built in. Bun `--compile` cross-targets linux x64/arm64 (glibc+musl), windows x64/arm64, darwin x64/arm64. Binary "still too large". `--asset` embeds directories. | Verified | `web: https://bun.sh/docs/bundler/executables` |
| Node SEA: Stability 1.1 in v24.22 docs, CommonJS single-script only | Verified | `web: https://nodejs.org/docs/latest-v24.x/api/single-executable-applications.html` |
| napi-rs: root package + one npm package per platform via `optionalDependencies`. Each target needs its own build job and runtime test. | Verified | `web: https://napi.rs/docs/deep-dive/release` |
| Rust cold start (~5 ms vs 150–300 ms JS) | Historical memo figure, **not re-measured**. P13 found host latency too noisy to use. | `read: 2026-07-12 decision.md; P13:10` |

## 5. Porting cost

| Path | Cost | Basis |
| --- | --- | --- |
| **A: port into TS** | Low marginal cost. Engines are being reshaped behind new contracts anyway. Per file: rename to `.ts`, replace `require` with ESM imports or keep CJS `.cts`, type the public ports from the generated schema types, then work through strict errors *in the files that come over*. P10's strict counts for these four families were 131 non-strict / 2,922 strict diagnostics at their own locations (`read: P10:207`). Much of that is the implicit-`any` class (3,636 of 5,418 overall), which annotating ports and params clears in bulk. | `read/inferred` |
| A, tests | The 80 test files use `bun:test` (`ran`). Port each with its engine. The runner choice is in §7. Hard-won regression tests come over as behaviour + test, per the brief. | `ran/read` |
| C: stay JS | Lowest immediate cost, but P10's 9–18 days of JSDoc public-layer work is still owed. It would now go through TS 7's weakened JS path. | `read: P10:9; web CHANGES.md` |
| D: Rust | Full rewrite of ~20K source + ~24K test lines, every SQLite/lease/CAS race fix re-earned, plus a new JS host for outside blocks. Weeks to months. It directly contradicts the brief's rule against rewriting what works. | `ran wc; read brief; inferred` |

## 6. The July memo's Rust triggers today

| Trigger | Now | Applies? |
| --- | --- | --- |
| (a) Kernel becomes a long-lived multi-client daemon with real concurrency | P13 reopened a *resident per-user service* question, conditional on measurements (`read: P13:10`; plan:586). No server exists: P10 searched `lib/kernel` for `createServer`/`.listen(` and found no hits (`read: P10:348`). | **No** (watch) |
| (b) Forge's own hook latency > ~500 ms that compiled Bun can't fix | Unmeasured. The compiled-Bun attempt failed on a missing generated asset (`read: P13:14,204–219`). | **No** (unknown) |
| (c) A profiled CPU-bound JS path dominates a command | No profile shows one. SQLite is native inside the runtime. | **No** |
| (d) Development stops being agent-authored JS | It becomes agent-authored **TS**, which helps the TS case, not Rust's. | **No** |
| New premise: "rewrite cost no longer applies" | Only partly true: the brief copies working engines with their tests rather than rewriting them. Rewriting in TS costs little; rewriting in Rust costs the full amount. | Favours **TS**, not Rust |

## 7. What would change the answer

- **To B (one Rust component):** a resident per-user service is approved, *and* measured process-set RSS or concurrency shows a Node implementation misses its budget. Or a profiled CPU-bound path exceeds ~20% of a real command's wall time. The component must sit behind a schema-defined IPC/napi contract, with TS remaining the client and the block host.
- **To C:** TS 7's JS path is found sufficient *and* the lanes measure that porting into TS costs significantly more than porting into JS (unlikely given ADAPT; `inferred`).
- **Away from erasable-only:** a needed library requires decorators or transforms. Answer: keep that library at the edge, not in core.
- **Schema tool:** if the in-house validator is dropped, TypeBox becomes the runtime schema library, with serialized-schema drift checks.

## 8. Concrete implications for the rebuild (default A)

1. **tsconfig (core):** `strict: true` (also the TS 7 default), `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`, `module`/`moduleResolution: nodenext`, `target: es2024` or the TS 7 default, `isolatedDeclarations: true` for public entry modules so declaration emit is syntactic and parallel (`web: TS 7 post`), and `types: ["node"]` (TS 7 defaults `types` to `[]`). Lint bans `any` in public modules and requires `unknown` + validation at data boundaries. No `@ts-ignore` without a linked issue. A strict program must pass fully; no exemption lists (P10's honesty rule: `read: P10:287`).
2. **Build or no build:** none for dev, test or lanes: sources run directly on Node ≥24.12 and Bun. **One publish build:** `tsc` emits `.js` + `.d.ts` + declaration maps into `dist/`. `package.json` `exports` puts the `types` condition first. Then pack one tarball and test it in clean Node 24/26, Bun and TS `.cts`/`.mts` consumers (the plan's real-artifact sequence: `read: plan:630; P10:316–328`). Since TS 7.0 has no programmatic API, the generator and tooling call the `tsc` CLI, or pin `@typescript/typescript6` for API use until 7.1.
3. **Engine floor:** certify **Node ≥24.15** (the `node:sqlite` release-candidate status and the plan's Sigstore floor both land there: `read: plan:503`) and Node 26. This is an owner choice; the alternative is 24.12, where type stripping became stable.
4. **Schemas ↔ types:** committed JSON Schemas → pinned generator → committed `src/generated/` types → CI byte-diff (`gen --check`). Public function and port signatures are written in TS and import the generated types. Runtime validation stays mandatory, because types prove nothing about bounds, hashes or admission (`read: P10:285`). One lane owns generation (the contract integration owner: `read: architecture-evaluation.md` §6).
5. **Test runner:** `node:test` + `node:assert` as the **certifying** runner. It is built in, runs `.ts` directly and needs no dependency. Run it on Node 24 and 26, and run the same suite on Bun for the Bun profile. Tests port from `bun:test` block by block during ADAPT. Alternative (owner may pick): vitest on Node, which keeps an `expect` API close to the current tests but adds a devDependency. `bun test` alone is not enough: its tests cannot certify Node behaviour (`inferred`).
6. **Module format:** ESM (`"type": "module"`) for core source. The outside-author ABI stays `trusted-action-sync/v1` `.cjs` as decided (`read: plan:346`). Changing it is out of scope here.
7. **Outside JS authors:** publish `forge/author` types (generated operation, slot and result types). Provide a scaffold that writes either `action.cjs` (plain JS, with `// @ts-check` + `@type {import('forge/author').Operation<…>}`) or `action.cts` compiled by the author's own tool. Ship positive and negative consumer fixtures, including one that rejects a Promise result. Forge adds no bundler (`read: plan:365,628`).
8. **Rust slot reserved, not built:** any resident service is specified as a schema-defined local protocol first, so its implementation language can be decided later on measurements (§7) without touching blocks.
