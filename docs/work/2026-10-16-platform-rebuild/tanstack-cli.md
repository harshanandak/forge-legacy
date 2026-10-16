# TanStack CLI — research note

Research date: 2026-10-16. All facts are from fetched pages (WebFetch, summarized by a small model; treat exact wording as paraphrase). Items marked **inferred** are not stated in the sources.

## 1. What it is

TanStack CLI (`@tanstack/cli`, bin `tanstack`) is an **alpha** project scaffolder for TanStack apps. Tagline: "Compose a TanStack app, then keep every choice inspectable." It builds projects from a library catalog, docs, templates, and add-on metadata. — https://tanstack.com/cli/latest (docs selector shows v0, "Latest", alpha)

Commands (from the CLI reference):
- `tanstack create [name]` — scaffold (default TanStack Start/SSR; `--router-only`, `--blank`, `--framework react|solid`, `--add-ons`, `--template <url|path|id>`, `--package-manager`, `--deployment`, `--toolchain`, `-y`, `--json`, `--add-on-config <json>`, `--list-add-ons`, `--addon-details <id>`). The prose also mentions an `--intent` flag not in the options table.
- `tanstack add [add-ons...]` — add to existing project (`--forced`).
- `tanstack add-on init|compile|dev` — author add-ons.
- `tanstack template init|compile` — author templates.
- `tanstack libraries [--group] [--json]`, `tanstack doc <library> <path>`, `tanstack search-docs <query> [--library] [--framework] [--limit] [--json]`, `tanstack ecosystem [--category] [--json]`, `tanstack pin-versions`, `tanstack telemetry status|enable|disable`.
— https://tanstack.com/cli/latest/docs/cli-reference (fetched 2026-10-16)

Introspection: "Agent-friendly discovery via JSON CLI output" — `--json` on create/libraries/search-docs/ecosystem. — https://tanstack.com/cli/latest/docs/overview

Telemetry: on by default; sends command usage, durations, framework, package manager, add-on IDs; not project names, paths, search queries, or raw errors. Off in CI, or with `DO_NOT_TRACK=1` / `TANSTACK_CLI_TELEMETRY_DISABLED=1`. — https://github.com/TanStack/cli README (fetched 2026-10-16)

### How add-ons are authored and registered
Source: https://tanstack.com/cli/latest/docs/creating-add-ons (fetched 2026-10-16)
- Definition: `.add-on/info.json`. Required: `name`, `version`, `description`, `type`, `phase`, `category`, `modes`. Optional: `dependsOn`, `conflicts`, `envVars`, `gitignorePatterns`.
- Files: `.add-on/assets/**`; `.ejs` files are templated; `_dot_gitignore` → `.gitignore`; `file.ts.append` appends to an existing file.
- Packages: `.add-on/package.json` merged into generated app.
- `envVars`: `name`, `description`, `required`.
- `options`: user-configurable (e.g. `type: "select"`, `label`, `options`, `default`); templates read `addOnOption['<id>']`.
- `integrations` (hooks): `type` ∈ `root-provider`, `provider`, `vite-plugin`, `devtools`, `header-user`, `layout`; plus `jsName`, `path`.
- `phase` ∈ `setup`, `add-on`, `example`. `routes` array for demo routes.
- Workflow: `create` a base app → edit → `tanstack add-on init` (extracts into `.add-on`) → edit `info.json` → `add-on compile` (`add-on dev` watches) → test by serving `.add-on` and running `tanstack create test --add-ons http://localhost:9080/info.json`.
- Registration: no central registry is described. Add-ons are referenced by ID (built-in) or by **URL to `info.json`** (hosted on GitHub, npm, or any URL). Prefer versioned URLs.

### How templates are authored and registered
Source: https://tanstack.com/cli/latest/docs/templates (fetched 2026-10-16)
- Create a normal project, run `tanstack template init` (creates `template-info.json` and `template.json`), edit `template-info.json`, run `tanstack template compile` → distributable `template.json`. Templates can declare add-on dependencies.
- Referenced via `--template` as URL, local path, or built-in ID (example ID: `ecommerce`).
- Registry entries may expose templates under `templates` or `starters` keys; how to add an entry is not documented.
- Field-level docs for template-info.json and the built-in list are not on the page.

## 2. Version, license, maintenance

- **Version:** npm `dist-tags.latest` = **0.71.1**, published **2026-09-30 18:56 UTC**. Registry `modified` 2026-09-30. Prior version 0.71.0 published 2026-09-01. — https://registry.npmjs.org/@tanstack/cli
- **GitHub release:** `release-2026-09-30-1855` ("Release 2026-09-30 18:55", marked Latest), published 2026-09-30. Notes: "create: resolve current npm versions" (PR #517). — https://github.com/TanStack/cli/releases/latest
- **Repo activity:** GitHub API `pushed_at` 2026-10-01; `updated_at` 2026-10-14; 59 open issues; 1,301 stars. — https://api.github.com/repos/TanStack/cli (fetched 2026-10-16; the API may be cached, so these may lag)
- **License:** MIT (GitHub and npm).
- **Maintenance:** actively maintained (release 2 weeks ago, repo updated 2 days ago). Alpha status per docs. Org is TanStack LLC (© 2026).

## 3. MCP and agent integration

**Conflicting signals — resolve before relying on either:**
- The official docs say **the MCP server was removed** and "will not be restored." Source: https://tanstack.com/cli/latest/docs/mcp-migration (fetched 2026-10-16). Former MCP tools (`listTanStackAddOns`, `getAddOnDetails`, `createTanStackApplication`, `tanstack_list_libraries`, `tanstack_doc`, `tanstack_search_docs`, `tanstack_ecosystem`) were replaced by CLI commands with `--json`. Existing configs pointing to `@tanstack/cli mcp` will break.
- The GitHub repo description (fetched 2026-10-16) still reads "...Project Scaffolding, MCP Server, Agent Skills Installation, etc", and an earlier README summary mentioned MCP and Agent Skills. The README page itself was not verified for those current claims. **Inferred:** the description is stale relative to the docs.
- The npm `mcp` keyword and `@modelcontextprotocol/sdk` dependency appear in older versions (0.0.x, some 0.48–0.59) but the summary could not confirm them for 0.60+ (text truncated).

**Current agent design:** no MCP server. Agents use the CLI directly with `--json` for deterministic parsing. The docs also say an app-level `mcp` add-on exists for projects hosting their own MCP endpoint.

## 4. Relevance to Forge

Ideas that could help:
- **Declarative add-on manifest with a dedicated folder** (`.add-on/info.json` + `assets/` + `package.json` merge) — a clean model for authoring a block: one manifest declaring files, deps, env vars, options, phase, and conflicts. Maps to Forge's "declare operations once" blocks.
- **Explicit `phase` and `dependsOn` / `conflicts`** — ordered composition with validated relationships; useful for block dependency checks.
- **Typed `options` consumed by templates** — a template-side contract for per-block configuration (fits config-template import).
- **Template as a compiled, distributable artifact** (`template.json`, referenced by URL/path/ID) — a model for importable config templates with a local-path / URL / built-in-ID resolution order.
- **Dev loop: `init` → `compile` → `dev` → test via local URL** — a good pattern for authoring new blocks in Forge (scaffold + watch + local test).
- **`--json` on every introspection command, and "inspectable" plan preview before writing files** — matches an agent-first CLI and a dry-run/preview step.
- **Migrating MCP to CLI with JSON output** — the TanStack team dropped MCP in favor of CLI+JSON. Relevant evidence for not making MCP the primary agent surface. **Inferred:** Forge can generate CLI and MCP from one catalog, so this is a reason to keep the catalog as the source and not hand-write MCP tools.

Ideas that likely do not fit:
- **Telemetry on by default** — Forge should decide its own policy; the opt-out-by-env pattern is reusable, but default-on is a product choice.
- **Add-ons identified by remote URL with no registry** — Forge already has a catalog; a URL-only registration would bypass its authority model. **Inferred** concern.
- **Scaffolding a whole app** — Forge's blocks are operations, not app shapes; the app-generator part is mostly out of scope.
- **Framework-specific hooks** (`root-provider`, `vite-plugin`, `layout`) — tied to React/Solid app structure; Forge's hook types would be its own.

Caveats: source pages were fetched and summarized by a small model; the add-on and template pages could only be partly verified (field lists come from the creating-add-ons page only). The MCP conflict was not resolved from source code.
