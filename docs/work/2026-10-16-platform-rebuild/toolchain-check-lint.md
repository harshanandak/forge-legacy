# Toolchain fact check: `bun check` / `bun lint` and the check+lint pairing

Date of research: 2026-10-16. Read-only fact check. Nothing in the repo was modified except this file.

Evidence tags: **read** = read from a primary source (URL + date). **ran** = executed on this machine. **inferred** = my deduction, not directly observed.

## Short answer

| Question | Answer |
| --- | --- |
| Does stable Bun ship a built-in type check? | **Yes, from Bun 1.4.3 (2026-10-10): `bun check`.** Not in 1.4.2, which is why your local install lacks it. |
| Does stable Bun ship a built-in linter or formatter? | **No.** `bun lint` and `bun fmt` were merged to `main` on 2026-10-12, two days after 1.4.3. They exist in canary (1.4.4-canary.1) only. |
| Recommended `check` | `tsc --noEmit` with `typescript@7.0.2` (native compiler). |
| Recommended `lint` | `oxlint --type-aware --deny-warnings` with `oxlint@1.88.0` and `oxlint-tsgolint@7.0.2004`. |
| `--max-warnings 0` maps to | `--deny-warnings` (or `--max-warnings 0`; oxlint accepts both). |

## 1. Is anything built into Bun?

### `bun check`: released in 1.4.3

- **read**: The Bun v1.4.3 release post (2026-10-10, https://bun.com/blog/bun-v1.4.3) opens with the section "`bun check`: a TypeScript type checker built into Bun". Its claims, all Bun's own:
  - It is "a port of typescript-go".
  - It "passes 100% of TypeScript 7.0.2's conformance test suite".
  - It is "3x to 6.4x faster than `tsc` 7.0.2", measured on a 16-core Apple silicon Mac.
  - It uses "2.2x to 4.9x less memory".
  - It also adds `bun run --check`, `bun test --check`, `bun build --check` and `Bun.build({ check: true })`.
  - Limits: it does not emit JS or `.d.ts`, and it has no language server.
  - It is not marked experimental in the visible text.
- **read**: https://bun.com/docs/runtime/check. `bun check` reads `tsconfig.json` and "reports the same errors as `tsc` from TypeScript 7". It never writes files, exits `1` on any error, and accepts compiler options as flags (for example `--strict`). `bun check --watch` is not supported.
- **read**: GitHub releases API for oven-sh/bun. The latest stable release is `bun-v1.4.3`, published 2026-10-10T05:24:54Z, `prerelease: false`. `bun-v1.4.2` was published 2026-09-05.
- **ran**: I downloaded `bun-windows-x64.zip` for `bun-v1.4.3` from the official GitHub release into a temp directory. `bun --version` printed `1.4.3`, and `bun --help` lists `check  Type check a TypeScript project`. The same help still lists `lint` only as "Run a package.json script", with no `fmt`.
- **ran**: `bun check` on a tiny strict project reported `TS2322` for `const x: number = "a"` in both 1.4.3 and canary, and exited non-zero when run alone.
- **ran**: Your local Bun 1.4.2 has no `check` in `bun --help`, so the "not built in" observation is correct for 1.4.2 and out of date for 1.4.3.

### `bun lint` and `bun fmt`: announced and merged, canary only

- **read**: PR https://github.com/oven-sh/bun/pull/44805, "Add `bun lint` and `bun format`", by Jarred-Sumner. It was merged into `main` on 2026-10-12T05:17:06Z (**ran**: `gh api repos/oven-sh/bun/pulls/44805`). Claims in the PR description, all the author's:
  - 1,021 built-in rules, including type-aware ones.
  - 2.0x to 2.5x faster than oxlint 1.87 on wall time, and about 1.9x for `format --check` against oxfmt 0.72.
  - 26x faster than ESLint on VS Code, "measured on earlier builds; being measured again".
  - 9,728 passing cases in Prettier 3.9.9's `tests/format` suite, with 5 failing and 88 not run.
  - A binary-size increase of about 14 to 16 MB per platform.
- **read**: Bun's X post, "In the next version of Bun `bun lint` is a 26x faster ESLint-compatible linter…" https://x.com/bunjavascript/status/2110692261508079721. WebFetch returned HTTP 402 for the post itself, so I only have its text as quoted in a search result (see the next bullet). Date not confirmed.
- **read** (search result, secondary): https://x.com/AGTPinsights/status/2110754106059178007 repeats the "next version" announcement.
- **read**: Docs pages already live and describing the features as if available:
  - https://bun.com/docs/lint (`--max-warnings`, `--type-aware`, `--staged`, `--changed`, formats including `sarif` and `junit`)
  - https://bun.com/docs/format (`bun fmt --check`)
  - https://bun.com/guides/lint/migrate-from-oxlint (says it reports the same problems as oxlint 1.87)
  - The docs header says "Install Bun v1.4.3" and the pages state no introduction version. The docs describe `main`, not the stable release.
- **ran**: `gh api repos/oven-sh/bun/compare/bun-v1.4.3...c39c718b…` (the PR merge commit) returned `ahead` by 5 commits, behind 0. So the merge commit is not contained in the 1.4.3 tag.
- **ran**: I downloaded the official canary build (`releases/download/canary/bun-windows-x64.zip`). `bun --version` printed `1.4.4`, revision `1.4.4-canary.1+5f5799ed1`. `bun --help` lists `check`, `lint  Lint JavaScript and TypeScript, like ESLint` and `fmt  Format JavaScript and TypeScript, like Prettier`.
- **ran** (canary, tiny project):
  - `bun lint src` warned on an unused variable and exited 0.
  - `bun lint --max-warnings 0 src` exited 1.
  - `bun lint --type-aware src` reported an unawaited promise as an error and exited 1.
  - `bun fmt --check src` listed the badly formatted file.
- **Not found**: no release post or release notes announcing `bun lint` or `bun fmt` in a stable release. https://bun.com/blog lists v1.4.3 (2026-10-10) as the newest post. Neither the 1.4.3 post nor the 1.4.0 post mentions them (**read**).
- **inferred**: they will ship as stable in the next release after 1.4.3 (the "next version" in the X post). No date has been announced that I could find.

### Gotchas if you use them later

- **read**: https://bun.com/docs/lint says that if `package.json` has a `lint` script, `bun lint` runs that script. A script `"lint": "bun lint"` therefore must not call itself. The same precedence applies to `check`.
- **read**: With `bun lint --type-aware`, types come from `bun check`, not from oxlint's tsgolint (https://bun.com/guides/lint/migrate-from-oxlint). `jsdoc/*` and `vue/*` rules are unsupported, and `--lsp` is unsupported.

## 2. Fastest correct pairing today

Versions below were **ran** with `npm view` on 2026-10-16.

| Tool | Version | Type-aware? | Speed claim and source | Notes |
| --- | --- | --- | --- | --- |
| `typescript` (native `tsc`) | 7.0.2 (`latest`); `next` is 7.1.0-dev | n/a (it is the type checker) | "speedups between 8x and 12x on full builds"; VS Code full build 125.7s to 10.6s (11.9x). **read**: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ (2026-07-08) | The package's only bin is `tsc` (**ran**: `npm view typescript@7.0.2 bin`). There is no separate `tsgo` bin in the stable package. `@typescript/native-preview` is stale, last published 2026-07-07. It has no stable programmatic API until 7.1. `tsc` still emits `.d.ts`. |
| `bun check` | Bun ≥ 1.4.3 | n/a | 3x to 6.4x faster than `tsc` 7.0.2 (Bun's own benchmark, see above) | Type check only; no `.d.ts` emit. It duplicates `tsc`, which you need anyway to emit `.d.ts`. |
| `oxlint` | 1.88.0 (2026-10-13) | **Yes, stable.** Via `oxlint-tsgolint@7.0.2004` | tsgolint is "12 to 18 times faster than ESLint with typescript-eslint" (VS Code 83.2s to 6.96s). Vendor claim on an M4 Pro. **read**: https://oxc.rs/blog/2026-07-22-type-aware-linting-stable (2026-07-22) | 59 of typescript-eslint's 61 type-aware rules. tsgolint is built on TypeScript 7 and tracks 7.0.2, and oxlint 1.88.0 declares peer `oxlint-tsgolint >=7.0.2003` (**ran**). Flags: `--type-aware`, `--type-check`, `--deny-warnings`, `--max-warnings=<N>` (**read**: https://oxc.rs/docs/guide/usage/linter/cli.html). |
| Biome | 2.5.15 (2026-09-30) | **Partial.** Its own type inference via the Scanner, not the TypeScript checker. Some rules exist, such as `noFloatingPromises`. | The docs make no speed claim and report that the Scanner adds cost: about 0.8s without it versus about 2s with it on ~2k files. **read**: https://biomejs.dev/linter/ | 568 rules. Warnings fail only with `--error-on-warnings`. |
| ESLint + typescript-eslint | eslint 10.13.0, typescript-eslint 8.71.2 | Yes, full | Baseline for the 12 to 18x claim above | **read**: the TS 7 announcement says typescript-eslint still needs the TS 6 API, so you must alias `"typescript": "npm:@typescript/typescript6@^6.0.2"` next to `typescript@7`. That is the slowest option and adds a second compiler. |

**Verdict (inferred from the above):**

- **Type check:** use `tsc` 7.0.2. It is the reference implementation, it emits the `.d.ts` files you publish, and it is already native-speed. `bun check` is faster but cannot emit and is a port, so it would be a second checker.
- **Lint:** use oxlint with tsgolint. It is the only option here that is both stable and fully type-aware without keeping TypeScript 6 around.
- **Built-in `bun lint`:** revisit once it is in a stable Bun release and the project has pinned that Bun version.

**ran**: In a throwaway project, `bun add -d typescript@7.0.2 oxlint@1.88.0 oxlint-tsgolint@7.0.2004` installed cleanly. `bunx tsc --version` printed `Version 7.0.2`. `bunx tsc --noEmit` on a clean file exited 0, and `bunx oxlint --type-aware src` reported `typescript(no-floating-promises)` as a warning.

## 3. Recommendation

`package.json`:

```json
{
  "scripts": {
    "check": "tsc --noEmit",
    "lint": "oxlint --type-aware --deny-warnings"
  },
  "devDependencies": {
    "typescript": "7.0.2",
    "oxlint": "1.88.0",
    "oxlint-tsgolint": "7.0.2004"
  }
}
```

- Pin exact versions. tsgolint's version encodes the TypeScript version it targets (7.0.2 plus a patch counter), so bump `typescript` and `oxlint-tsgolint` together (**read**: oxc blog post above).
- Put the strictness in `tsconfig.json` (`"strict": true` is already the TS 7 default, per the TS 7 announcement). Add `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` as wanted (**inferred**; not tested here).
- **`--max-warnings 0` mapping:** ESLint's `--max-warnings 0` becomes oxlint's `--deny-warnings`. **ran**: on a warnings-only file, `oxlint --type-aware` exited 0, while `--deny-warnings` and `--max-warnings 0` each exited 1. Use `--deny-warnings`; it reads clearer and does not take a number. For comparison:
  - Biome: `--error-on-warnings`.
  - `bun lint` (canary): `--max-warnings 0` (**ran**: exit 1).
- Because `oxlint --type-aware` reports `no-floating-promises` as a warning by default, `--deny-warnings` is what turns it into a failing check. That is the same effect as the old repo's `--max-warnings 0` on ESLint.
- If you prefer to try the built-ins later, `bun check` needs Bun ≥ 1.4.3, so pin `packageManager` or `engines` to that. `bun lint` needs a stable Bun that does not exist yet.

## Sources (all fetched 2026-10-16)

- https://bun.com/blog/bun-v1.4.3 (2026-10-10), https://bun.com/blog (post list)
- https://bun.com/docs/runtime/check, https://bun.com/docs/lint, https://bun.com/docs/format, https://bun.com/guides/lint/migrate-from-oxlint
- https://github.com/oven-sh/bun/pull/44805 (merged 2026-10-12)
- https://api.github.com/repos/oven-sh/bun/releases (v1.4.3, v1.4.2) and the compare API
- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ (2026-07-08)
- https://oxc.rs/blog/2026-07-22-type-aware-linting-stable, https://oxc.rs/docs/guide/usage/linter/cli.html
- https://biomejs.dev/linter/
- npm registry via `npm view` (versions above)
