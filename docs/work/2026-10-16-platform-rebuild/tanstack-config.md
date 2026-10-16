# TanStack Config — research note

Research date: 2026-10-16. All facts are from the sources cited inline. Anything not stated in a source is marked **(inferred)**.

## 1. What it is and what each package does

**Overall.** TanStack Config is "an opinionated toolkit for building, versioning, and publishing high-quality JS/TS packages" (README: https://github.com/TanStack/config/blob/main/README.md, fetched 2026-10-16). The docs describe it as "a collection of tools we currently use between our projects to simplify configuration" (https://tanstack.com/config/latest/docs/overview, fetched 2026-10-16). The landing page calls it "the package-maintenance contract behind TanStack" (https://tanstack.com/config/latest, fetched 2026-10-16).

**Packages** (from `packages/` listing, https://api.github.com/repos/TanStack/config/contents/packages, fetched 2026-10-16):

| npm package | Latest | Description (npm) | Key deps / peers (npm registry) |
|---|---|---|---|
| `@tanstack/eslint-config` | 0.4.0 (2026-02-16) | Shared ESLint config used by TanStack projects | peer `eslint ^9 \|\| ^10`; deps `typescript-eslint`, `@eslint/js`, `eslint-plugin-import-x`, `eslint-plugin-n`, `@stylistic/eslint-plugin`, `vue-eslint-parser`, `globals` |
| `@tanstack/vite-config` | 0.6.0 (2026-07-21) | Shared Vite build config used by TanStack projects | peer `vite ^8`; deps `vite-plugin-dts`, `vite-plugin-externalize-deps`, `vite-tsconfig-paths` |
| `@tanstack/typedoc-config` | 0.3.5 (2026-10-16) | Shared Typedoc config used by TanStack projects | deps `typedoc` 0.28.20, `typedoc-plugin-markdown`, `typedoc-plugin-frontmatter` |
| `@tanstack/publish-config` | 0.2.7 (2026-03-27) | Publish script used by TanStack projects | deps `semver`, `jsonfile`, `simple-git`, `@commitlint/parse` |

Source for each row: `https://registry.npmjs.org/@tanstack/<name>` (fetched 2026-10-16) and `packages/<name>/package.json` on `main`.

**Tools that exist in the root workflow** (root `package.json`, https://raw.githubusercontent.com/TanStack/config/main/package.json, fetched 2026-10-16):
- Build: `tsdown` (each package's `build` script is `tsdown`).
- Monorepo: Nx (`nx run-many`, `nx affected`).
- Lint: `eslint`, `typescript-eslint`; `prettier` for `format`.
- Package checks: `publint --strict` (in `publish-config`'s `test:build`); `@arethetypeswrong/core` in root devDeps; `sherif` for monorepo checks.
- Versioning/changelog: `@changesets/cli`, `@changesets/changelog-github`.
- Test: no test runner is named in the root scripts. Test-named scripts are `test:eslint`, `test:types`, `test:build`, `test:docs` (link check via `scripts/verify-links.ts`), `test:sherif`. **No Vitest/Jest found in root devDeps.**
- tsconfig: no tsconfig package is published. `typescript` is a root devDep only.

**Publish/release.** Changesets records release intent; a release workflow produces versions and changelogs; publishing uses npm trusted publishing via GitHub OIDC with provenance, so no long-lived npm token is stored (https://tanstack.com/config/latest, fetched 2026-10-16). Preview packages per PR use pkg-pr-new (same source).

**Not in the sources:** a tsconfig preset package, a Prettier config package, a test-runner config package.

## 2. Versions, license, maintenance

- **License:** MIT — GitHub repo license `MIT` (https://api.github.com/repos/TanStack/config/license, fetched 2026-10-16); all four npm packages report `MIT` (npm registry, 2026-10-16).
- **Repo activity** (https://api.github.com/repos/TanStack/config, fetched 2026-10-16): not archived; default branch `main`; last pushed 2026-10-16T09:27:39Z; 398 stars; 13 open issues.
- **Latest release:** `@tanstack/typedoc-config@0.3.5`, published 2026-10-16T01:12:08Z; previous `typedoc-config@0.3.4` on 2026-08-09 (GitHub releases, https://api.github.com/repos/TanStack/config/releases, fetched 2026-10-16).
- **Other last publishes** (npm): `vite-config` 0.6.0 on 2026-07-21; `publish-config` 0.2.7 on 2026-03-27; `eslint-config` 0.4.0 on 2026-02-16.
- **Node engines** for all four packages: `>=18`. The docs state Node v20.17.0+ is required for working on the repo (https://tanstack.com/config/latest/docs/overview). Repo `packageManager` is `pnpm@12.4.2`; the docs say "pnpm is the only supported package manager for TanStack Config" and require pnpm v10+ (the two pnpm version statements differ; both are quoted as stated).

## 3. Wrapped tools and Bun support

- **Explicitly wrapped/named in sources:** ESLint (flat config), Nx, Changesets, pkg-pr-new, publint, tsdown, Vite (`vite-config` peer `^8`), Typedoc, npm trusted publishing (GitHub OIDC). Sources: https://tanstack.com/config/latest (2026-10-16), root and package `package.json` files (2026-10-16).
- **Not named in sources:** Prettier config, Vitest, tsup, tsconfig presets.
- **Bun:** **not mentioned** in the landing page, overview, README, root `package.json`, or the four package manifests. The GitHub code-search for "bun" in the repo returned no results (2026-10-16), but that search API may be unauthenticated and incomplete. Bun support is **not established by the sources**; the official stance is pnpm-only (overview page).

## 4. Fit with Forge (Bun-first, minimal deps, compiled JS + .d.ts, Node 24+)

**Could help (candidates, each to be verified):**
- **publint** (`publint --strict`, the pattern used by `publish-config`): validates `exports`/`main`/`types` in the packed package before publish. Directly relevant to a compiled JS + `.d.ts` package. It is a single devDependency, not a runtime dependency.
- **Changesets + GitHub Actions publish via npm trusted publishing (OIDC + provenance)**: a model for the release pipeline. It requires no npm token. Changesets is a dev tool, not a runtime dependency. **(inferred)** Forge can use the pattern without importing the packages.
- **`@arethetypeswrong/core`** (in root devDeps; the sources don't say what it checks, but the name indicates a `.d.ts` resolution check): **(inferred)** useful to verify `.d.ts` resolution under Node 24.

**Would conflict:**
- **pnpm-only + Nx + Node 20.17+ tooling**: The docs state pnpm is the only supported package manager. Adopting the monorepo or Nx would add a second package manager and a task runner against Bun-first. Conflict.
- **Dependency footprint**: `@tanstack/eslint-config` pulls about seven packages (incl. `typescript-eslint`, `vue-eslint-parser`); `@tanstack/publish-config` pulls `simple-git`, `commitlint/parse`, `semver`, `jsonfile`. Each would break the one-adapter-per-dependency rule unless wrapped. Conflict with minimal-dependency rule.
- **Build**: `tsdown` is the build tool used across packages. Forge's build would need to be checked for Bun compatibility; Bun support for tsdown is **not stated** in the sources, so this is an open question, not a conflict proven by evidence. **(inferred)**: it is a Node-oriented bundler with its own dependencies.
- **Vite-based `vite-config`**: targets Vite 8 library builds; adds Vite as a peer. Forge's Bun-first build would more likely call Bun's bundler directly. Conflict with minimal-dependency rule unless adopted as-is for a Vite project (none indicated for Forge).
- **Engines `>=18`** on packages: not a runtime conflict for Forge (Forge targets Node 24+), but signals that TanStack does not test on Node 24 in these packages **(inferred from the manifests only)**.

**Recommendation (short):** Borrow the publish checks (publint, arethetypeswrong) and the Changesets/OIDC release pattern as ideas. Do not adopt the packages themselves: they are pnpm/Nx-oriented, pull in many dependencies, and are not documented for Bun.

## Gaps
- Individual docs pages (ESLint, Publish, Vite, Typedoc, CI/CD) were not fetched; the overview and landing page were. Their content may add detail.
- Bun support was not tested; no install or build was run (read-only task).
