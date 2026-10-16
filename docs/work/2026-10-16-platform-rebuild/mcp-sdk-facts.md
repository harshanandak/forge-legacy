# MCP TypeScript SDK — facts

Research date: 2026-10-16 (UTC). Read-only: `npm view` and page fetches only. Nothing installed, nothing committed.

Sources are tagged inline: `[npm: <command>]` for registry data, `[gh: <url>]` for GitHub pages, `[web: <url>]` for search-result snippets, which were not fetched in full.

## 1. Versions and release status

- **v1 line, `@modelcontextprotocol/sdk`:** latest `1.32.1`, released 2026-10-05. `[npm: npm view @modelcontextprotocol/sdk version time --json]`
- **v2 split line, stable and latest:** `@modelcontextprotocol/server@2.3.1` and `@modelcontextprotocol/client@2.3.1` (also `core@2.3.1`, `codemod@2.3.1`, `server-legacy@2.3.1`), all released 2026-10-05. `2.0.0` shipped 2026-07-27. `[npm: npm view @modelcontextprotocol/server time --json]`
- **v2 status:** stable. The README calls v2 "the stable release line" and says v1.x keeps receiving bug and security fixes for at least six months after the v2 release. `[gh: https://github.com/modelcontextprotocol/typescript-sdk]`
- **Upgrade caution:** the 2.3.0 release notes list breaking-style changes (one server per request, redirects limited to the same origin). Review them before upgrading. `[gh: https://github.com/modelcontextprotocol/typescript-sdk/releases]`
- **Prereleases:** none of the recent releases is marked pre-release. The `2.0.0-alpha/beta` tags exist on npm but are superseded. `[npm: time output]`

**Recommendation:** new work should target the v2 split packages (`server` + `client`), not `@modelcontextprotocol/sdk` v1.

## 2. Runtime dependencies

`[npm: npm view <pkg> dependencies --json, run 2026-10-16]`

| Package | Runtime deps | Count | Names |
|---|---|---|---|
| `@modelcontextprotocol/sdk@1.32.1` (v1) | 17 | 17 | ajv, zod, cors, hono, jose, express, raw-body, ajv-formats, cross-spawn, eventsource, content-type, pkce-challenge, @hono/node-server, json-schema-typed, eventsource-parser, express-rate-limit, zod-to-json-schema |
| `@modelcontextprotocol/server@2.3.1` (v2) | 2 | 2 | zod (^4.2.0), @modelcontextprotocol/core (2.3.1) |
| `@modelcontextprotocol/client@2.3.1` (v2) | 7 | 7 | zod (^4.2.0), jose (^6.1.3), cross-spawn (^7.0.5), eventsource (^3.0.2), pkce-challenge (^5.0.0), eventsource-parser (^3.0.8), @modelcontextprotocol/core (2.3.1) |
| `@modelcontextprotocol/core@2.3.1` (v2) | 1 | 1 | zod (^4.2.0) |

**Unpacked size** `[npm: npm view <pkg> dist.unpackedSize dist.fileCount]`:
- v1 `sdk@1.32.1`: 4,490,363 bytes (about 4.5 MB), 701 files
- v2 `server@2.3.1`: 6,486,743 bytes (about 6.5 MB), 85 files
- v2 `core@2.3.1`: 1,316,868 bytes (about 1.3 MB), 21 files

The v2 `server` size is the package's own tarball. It does not include `core`, which is a separate package.

## 3. Spec versions, transports, runtimes

- **MCP spec version:** v2 implements the **2026-07-28** spec. `[gh: https://github.com/modelcontextprotocol/typescript-sdk]`
- **Spec changes in 2026-07-28** (from search snippets; the pages were not fetched in full): protocol-level sessions and the `Mcp-Session-Id` header are removed from Streamable HTTP. The `initialize` handshake is removed. The GET stream endpoint and SSE resumability (`Last-Event-ID`) are removed. Roots, Sampling, and Logging are deprecated but still work. `[web: https://modelcontextprotocol.io/specification/2026-07-28/changelog]` and `[web: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http]`
- **Transports:** the README lists **stdio** and **Streamable HTTP** for servers and clients. SSE is not mentioned as a transport in the v2 README. `[gh: https://github.com/modelcontextprotocol/typescript-sdk]`
- **Node 24:** not verified. The v2 `engines` field is `node >=20` for `server`, `client`, and `core`, and the v1 `engines` field is `node >=18`. No Node 24 test claim was found on the README. Verify by running the test suite on Node 24 before committing to it.
- **Bun:** the README says the SDK "runs on Node.js, Bun, and Deno." Not verified by running. `[gh: https://github.com/modelcontextprotocol/typescript-sdk]`

## 4. License and maintenance

- **License:** v2 packages are **Apache-2.0** (`server`, `client`, `core`). v1 `sdk` is **MIT**. The README says "Apache License 2.0 for new contributions, with existing code under MIT." `[npm: license field]` `[gh: README]`
- **Last release:** 2026-10-05 (v1.32.1, v2.3.1, and several sibling packages). `[npm: time]`
- **Release cadence (npm time):** v2 minor/patch releases on 2026-09-23 (2.1.0), 2026-09-28 (2.2.0), 2026-10-02 (2.3.0), 2026-10-05 (2.3.1). v1 patches on 2026-09-23 (1.30.1), 2026-09-28 (1.31.0), 2026-10-02 (1.32.0), 2026-10-05 (1.32.1).
- **Commit cadence:** `[gh: https://github.com/modelcontextprotocol/typescript-sdk/commits/main]` (fetched 2026-10-16). The first page covers Sep 28 to Oct 13, 2026: six commits on Oct 5, two on Oct 12, and one each on Oct 2 and Oct 13. The latest commit is 2026-10-13 ("Docs/migration skill", #2968). No commits between Oct 6 and Oct 11. The page covers only about two weeks, so a longer cadence claim is not supported by this data.

## 5. Schema library

- **Zod is not required.** The README says tool and prompt schemas use **Standard Schema**, so Zod v4, Valibot, ArkType, or any compatible library works. `[gh: https://github.com/modelcontextprotocol/typescript-sdk]`
- **Zod is still a hard runtime dependency** of all v2 packages: `server`, `client`, and `core` each declare `zod ^4.2.0`. The v1 `sdk` declares `zod ^3.25 || ^4.0`. `[npm: dependencies]`
- **Zod latest on npm:** `4.6.7`. `[npm: npm view zod version dist-tags.latest]`

## Open items

- Verify Node 24 and Bun by running the test suite there. Not verified in this lookup.
- The 2026-07-28 spec details come from search-result snippets, not full page fetches.
- Releases page could not confirm the 2026 year on each entry. Dates here come from npm `time`, which is authoritative.
