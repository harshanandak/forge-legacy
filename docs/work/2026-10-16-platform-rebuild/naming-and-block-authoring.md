# Naming and block authoring: no hand-written commands, one naming system

Design memo, 2026-10-16. This file is the only thing written. No commits, installs, or code was run against the new project, and no browser was opened.

**Labels:** `read` = file inspected (path:line). `ran` = command executed here. `web` = primary source fetched 2026-10-16 (URL given). `inferred` = design judgment. Everything below marked *proposed* is a contract to freeze at contract lock. None of it is installed behaviour.

**Short paths:** Brief = `docs/work/2026-10-16-platform-rebuild/brief.md`. Arch = `…/architecture-evaluation.md`. CLI-inv = `…/inventory-cli.md`. Lang = `…/language-decision.md`. Ledger = `…/mistakes-ledger.md`. Plan = `docs/work/2026-09-30-forge-final-plan/platform/platform-plan-final.md`. All are in the `forge-final-plan` worktree. Old code = the `inventory-master` worktree.

## Answer in five lines

1. **Users add blocks** by writing a manifest that declares each operation once, as `noun.verb` with schemas, effects, callers and stability. They then run `forge block add <path|package>`, and a human admits the captured digest. The catalog then generates `forge <noun> <verb>` on the CLI and `<noun>_<verb>` on MCP. Core does not change, and nobody writes a command (§1).
2. **Nothing is a hand-written command.** Only three transport shims are hand-written: argv, MCP stdio and hook stdin. Core's own operations (`block.*`, `config.*`, `catalog.*`) are declared in a manifest like everyone else's (§2).
3. **One convention:** names are kebab-case and keys are camelCase. `publisher/block` identifies a block. `noun.verb` addresses an operation. MCP uses `noun_verb` and the CLI uses `forge noun verb` (§3).
4. **"Kernel" does not earn its place.** It suggests the always-on core, but the arch evaluation says it opens only for authoritative operations, and nobody guesses it when they want to create an issue. The proposed set is `work`, `memory`, `workflow`, `policy`, `pr`, `check`, `git`, `context`, `skills` and host adapters, with core owning `block`, `config` and `catalog`. "Contracts", "Flow", "Shepherd", "rails" and "gate" stop being product words (§4).
5. **Prior art:** take core precedence and collision refusal (gh, kubectl, git), static declarations with lazy activation (VS Code), reverse-DNS publishers with reserved prefixes (MCP), and toolsets with read-only exposure (GitHub MCP). Reject PATH and name-prefix discovery and per-command executables (§5).

**One finding the owner must see (`web`):** the unscoped npm name **`forge` belongs to someone else**. `registry.npmjs.org/forge/latest` returns v2.3.0, "A no customization 'build' system", maintainer `goatslacker`. The **`@forge/*` scope is Atlassian's**: `@forge/cli` 14.2.0, "A command line interface for managing Atlassian-hosted apps". The package the five projects use is **`forge-workflow`**. npm shows 0.0.10 and the repository shows `0.1.0-beta.8`, with bins `forge` and `forge-workflow` (`web`: registry.npmjs.org/forge-workflow/latest; `ran`: `node -e "require('./package.json')"` in Old code). So the brief's "same `forge` npm package" can only mean `forge-workflow` with the `forge` bin. Decision N10.

---

## 1. Users adding blocks, end to end

### 1.1 The path (proposed)

| Step | Who | Command (generated from core's own manifest) | What happens | Trust stop |
| --- | --- | --- | --- | --- |
| 1. Scaffold | user or agent | `forge block new semver --publisher io.github.alice` | Writes `forge.block.json`, `schemas/*.json`, `docs/records.json`, `src/index.cts` and one fixture. No framework code. Reuses the plan's scaffold contract (`read`: Plan:680, 729). | none |
| 2. Declare | user or agent | edit the manifest | Each operation is declared **once**: `noun.verb` → input and output schema, effects, idempotency, callers, stability and optional positional `args`. Help text lives in docs records, not in the schemas (`read`: Plan:334, 636). | none |
| 3. Build | author's own toolchain | `tsc` / esbuild → `dist/index.cjs` | Forge adds no bundler (`read`: Plan:365; Lang:111). | none |
| 4. Check | user or agent | `forge block check ./semver` | Data-only. It checks the name grammar, reserved names and collisions against the current catalog, the schema profile and budgets, and that docs records cover every operation. **It does not import the code** (`read`: Plan:28, 31, 1175). | none |
| 5. Add | user or agent | `forge block add ./semver`, or after a manual `npm i -D @alice/forge-semver`, `forge block add @alice/forge-semver` | Captures the exact source set and digest. Previews and applies a CAS edit to `.forge/config.yaml` `blocks:` and the lock. Never installs from npm (`read`: Plan:340, 136–138). | none |
| 6. Admit | **a human** | `forge block admit semver` (needs an interactive TTY or a trusted embedding) | Shows the digest, effects, callers and nouns. A yes binds a local admission to that digest and purpose (`read`: Plan:367–369, 50). | **yes**: agents stop here with `INCOMPLETE` / `ADMISSION_REQUIRED` and the exact command to run |
| 7. Use | anyone | `forge semver bump 1.4.2 minor`; MCP `semver_bump` | The catalog now contains the operations. CLI, help, `catalog describe` and MCP `tools/list` all read the same catalog. MCP clients get `notifications/tools/list_changed` where they subscribed, and otherwise see the tools after a restart (`web`: MCP 2026-07-28 tools; `read`: Plan:1025). | per-operation grants, checked at effect time |

`forge block add ./semver --admit` chains steps 4–6. It still stops at the human trust question, so an agent never self-admits (`read`: Arch:140, 143). Removing a block is `forge block remove semver`. That is a reversible config edit, and its nouns disappear from both surfaces.

**What did not change:** core source, a command registry, a manifest file in the Forge repo, a per-harness file, an alias table. Today a new command needs one hand file in `lib/commands/` (68 files) and must appear in the generated `_manifest.js` (506 lines). Aliases live in `_aliases.js` (248 lines) and dispatch is hand-built in `_registry.js` (327 lines) (`ran`: `ls lib/commands`, `wc -l` in Old code). The ledger already drops the manifest generator: "no hand-maintained manifests; no committed generated mirrors" (`read`: Ledger:118, 131).

### 1.2 Complete minimal example block (TypeScript)

The block is pure and read-only: it has no effects and no required services. Its ID is `io.github.alice/semver`, it owns the noun `semver`, and it has two operations.

`forge.block.json` (*proposed*; it extends the Plan:1490 manifest and replaces the single `provides[].operation` with an `operations` map; see N3):

```json
{
  "schemaVersion": "forge.block/1",
  "id": "io.github.alice/semver",
  "version": "0.1.0",
  "forgeVersion": ">=0.1.0 <0.2.0",
  "authorAbi": "forge.author/v1",
  "profile": "trusted-action-sync/v1",
  "entry": "dist/index.cjs",
  "files": ["dist/index.cjs", "schemas/config.json", "schemas/bump.input.json",
            "schemas/bump.output.json", "schemas/compare.input.json",
            "schemas/compare.output.json", "docs/records.json"],
  "runtimeDependencies": [],
  "configSchema": "schemas/config.json",
  "nouns": { "semver": { "interface": "1.0.0" } },
  "operations": {
    "semver.bump": {
      "input": "schemas/bump.input.json",
      "output": "schemas/bump.output.json",
      "args": ["current", "part"],
      "effects": [],
      "idempotent": true,
      "callers": ["agent", "human"],
      "stability": "stable"
    },
    "semver.compare": {
      "input": "schemas/compare.input.json",
      "output": "schemas/compare.output.json",
      "args": ["left", "right"],
      "effects": [],
      "idempotent": true,
      "callers": ["agent", "human"],
      "stability": "experimental"
    }
  },
  "requires": [],
  "docs": "docs/records.json",
  "license": "MIT",
  "repository": "https://github.com/alice/forge-semver",
  "support": "https://github.com/alice/forge-semver/issues"
}
```

`schemas/bump.input.json`. It uses the plan's bounded profile: no `pattern`, `title` or `description`, so validation is by the handler (`read`: Plan:636).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["current", "part"],
  "properties": {
    "current": { "type": "string", "minLength": 5, "maxLength": 64 },
    "part": { "enum": ["major", "minor", "patch"] },
    "preRelease": { "type": "string", "maxLength": 32 }
  },
  "additionalProperties": false
}
```

`schemas/bump.output.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["next"],
  "properties": { "next": { "type": "string", "maxLength": 100 } },
  "additionalProperties": false
}
```

`docs/records.json`. This one file feeds `--help`, `catalog describe`, the MCP `title`/`description` and the generated docs (`read`: Plan:334):

```json
{
  "operations": {
    "semver.bump": {
      "title": "Bump a version",
      "summary": "Return the next semantic version after incrementing one part.",
      "description": "Pure calculation: reads nothing, writes nothing. Resets lower parts to 0. Use semver.compare to order versions.",
      "examples": [{ "input": { "current": "1.4.2", "part": "minor" }, "output": { "next": "1.5.0" } }]
    },
    "semver.compare": { "title": "Compare two versions", "summary": "Return -1, 0 or 1." }
  },
  "fields": {
    "schemas/bump.input.json#/properties/current": "Current version, e.g. 1.4.2.",
    "schemas/bump.input.json#/properties/part": "Which part to increment.",
    "schemas/bump.input.json#/properties/preRelease": "Optional pre-release tag, e.g. rc.1."
  }
}
```

`src/index.cts`. It compiles to the ABI's `module.exports.operations` (`read`: Plan:346; Lang:110–111). The types are generated from the block's own schemas by `forge block types`, which writes into the author's repository, not Forge's.

```ts
import type { Operations } from "forge-workflow/author";
import type { BumpInput, BumpOutput, CompareInput, CompareOutput } from "./generated/types.ts";

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

function parse(v: string): [number, number, number] {
  const m = SEMVER.exec(v);
  if (!m) throw new Error(`not a semantic version: ${v}`); // wrapper → BLOCK_EXECUTION_FAILED
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export const operations = {
  "semver.bump"({ input }: { input: BumpInput }): BumpOutput {
    const [major, minor, patch] = parse(input.current);
    const core =
      input.part === "major" ? `${major + 1}.0.0` :
      input.part === "minor" ? `${major}.${minor + 1}.0` :
      `${major}.${minor}.${patch + 1}`;
    return { next: input.preRelease ? `${core}-${input.preRelease}` : core };
  },
  "semver.compare"({ input }: { input: CompareInput }): CompareOutput {
    const a = parse(input.left), b = parse(input.right);
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return { order: a[i] < b[i] ? -1 : 1 };
    return { order: 0 };
  },
} satisfies Operations<{
  "semver.bump": [BumpInput, BumpOutput];
  "semver.compare": [CompareInput, CompareOutput];
}>;
```

The handlers are synchronous, return one JSON value and receive `{input, config, services}`. A Promise result is refused as `BLOCK_ASYNC_UNSUPPORTED` (`read`: Plan:346). A block that needs another block declares a slot in `requires` and calls `services.<slot>.invoke("<verb>", …)` exactly as in the plan's Memory example (`read`: Plan:378–433). Nothing about naming changes for that case.

### 1.3 What the surfaces then look like (*proposed output contracts*, not captured output)

CLI. Positional arguments come from `args`; everything is also a flag:

```text
$ forge semver bump 1.4.2 minor
{"ok":true,"op":"semver.bump","status":"OK","result":{"next":"1.5.0"},"warnings":[]}

$ forge semver bump --current 1.4.2 --part minor --pre-release rc.1
{"ok":true,"op":"semver.bump","status":"OK","result":{"next":"1.5.0-rc.1"},"warnings":[]}

$ forge semver bump 1.4.2 mid
{"ok":false,"op":"semver.bump","status":"FAIL","error":{"code":"INPUT_INVALID",
 "pointer":"/part","flag":"--part","expected":{"enum":["major","minor","patch"]},
 "observed":"mid","repair":"forge semver bump 1.4.2 minor"}}           # exit 2

$ forge semvr bump
{"ok":false,"status":"FAIL","error":{"code":"UNKNOWN_COMMAND","observed":"semvr",
 "suggest":["semver"],"repair":"forge catalog list"}}                  # exit 2

$ forge semver --help        # human-readable, rendered from manifest + docs records
semver — io.github.alice/semver 0.1.0 (admitted, listed)
  bump      Bump a version                      read-only
  compare   Compare two versions                read-only, experimental
```

Discovery for agents:

```text
$ forge catalog describe semver.bump
{"op":"semver.bump","key":"io.github.alice/semver.semver@1.0.0#bump",
 "block":{"id":"io.github.alice/semver","version":"0.1.0","digest":"…","readiness":"ADMITTED"},
 "stability":"stable","callers":["agent","human"],"effects":[],"idempotent":true,
 "cli":"forge semver bump <current> <part> [--pre-release <s>]","mcp":"semver_bump",
 "input":{…resolved schema with field docs…},"output":{…},"examples":[…]}
```

MCP `tools/list` entry, projected from the same catalog record (`web`: [MCP tools, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools); annotation names from [schema.ts 2026-07-28](https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/2026-07-28/schema.ts)):

```json
{
  "name": "semver_bump",
  "title": "Bump a version",
  "description": "Return the next semantic version after incrementing one part. Pure calculation: reads nothing, writes nothing. …",
  "inputSchema": { "type": "object", "required": ["current", "part"],
    "properties": { "current": { "type": "string", "description": "Current version, e.g. 1.4.2.", "minLength": 5, "maxLength": 64 }, "…": {} },
    "additionalProperties": false },
  "outputSchema": { "…": {} },
  "annotations": { "readOnlyHint": true, "idempotentHint": true, "openWorldHint": false }
}
```

A domain failure is a tool result with `isError: true` and the same `error` object in `structuredContent`. An unknown tool is a JSON-RPC protocol error. This is the spec's own split (`web`: MCP tools §Error Handling).

---

## 2. No hand-written commands: generating CLI and MCP from the catalog

### 2.1 One catalog record per operation

The catalog is the plan's immutable snapshot (`read`: Plan:18). This design adds a fixed set of fields per operation:

| Field | Source | Used by |
| --- | --- | --- |
| `op` (`noun.verb`), `key` (`<publisher>/<block>.<noun>@<iface>#<verb>`) | manifest | dispatch; the grant/permission key per Plan:414 |
| `input`, `output` | manifest → schema files | argument mapping, validation, MCP `inputSchema`/`outputSchema` |
| `args` | manifest (optional ordered list of required scalar props) | CLI positionals only |
| `effects`, `idempotent`, `destructive` | manifest | grants, lazy home creation (replaces the `isMutatingVerb` name list, `read`: CLI-inv:41), MCP annotations |
| `callers` (`agent`, `human`) | manifest | exposure; human-only operations never reach MCP (N12) |
| `stability`, `deprecated` | manifest | help markers, warnings, exposure defaults (N9) |
| `title`, `summary`, `description`, field docs, `examples` | docs records | `--help`, `catalog describe`, MCP description, generated docs |
| `readiness` | host (UNKNOWN / ADD_PENDING / ADMISSION_REQUIRED / ADMITTED) | help markers, refusal before import |

The catalog is computed from manifests at run time and cached under the local Forge home keyed by the lock digest. It is never committed (`read`: Ledger:118). Handlers are imported only when an admitted operation is invoked. This is the VS Code "declare statically, activate on use" pattern (§5).

### 2.2 CLI grammar (*proposed*)

```
forge <noun> <verb> [positionals…] [--flag value…] [--input <json|@file|->] [global flags]
forge <noun>                       # noun help (or the noun's declared default verb)
forge --help | --version
```

- **Noun first, then verb.** This matches today's `forge issue <verb>` and gh/kubectl practice. Every token comes from the catalog. The parser knows only the reserved global flags.
- **Positional mapping:** `args` names required properties of type string, integer or number, in order. Every property is also available as a flag. Giving a value both ways is an `INPUT_CONFLICT` error.
- **Flag mapping from the input schema**, bijective:
  - Property names must match `^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$`. `prRef` is allowed and `prREF` is not. A camelCase property maps to a kebab-case flag: `preRelease` ↔ `--pre-release`.
  - A boolean maps to `--flag` / `--no-flag`.
  - Enums are validated, and their values are listed in help and in errors.
  - Arrays of scalars use a repeatable flag (`--tag a --tag b`). Arrays replace as a whole, consistent with the plan's merge algebra (`read`: Plan:38).
  - Nested objects and arrays of objects are accepted only through `--input` (inline JSON, `@file.json`, or `-` for stdin). Flags overlay top-level keys of `--input`, and overlaying a key that `--input` already set is an error.
  - An `x-forge-secretRef` field gets a `--<flag>-secret NAME` flag that produces `{"$secret":"NAME"}`. There is no way to pass a plaintext credential (`read`: Plan:77).
- **Global flags (reserved, hand-written):** `--input`, `--format json|text`, `--project <dir>`, `--quiet`, `--help`, `--version`, `--request-id`, `--dry-run` (only on operations whose effects are not empty). Authors cannot declare properties that map to these flags; `block check` refuses them.
- **Output:** a JSON envelope on stdout by default (N7): `{ok, op, status: OK|FAIL|INCOMPLETE, result | error, warnings[], observation?}`. Diagnostics go to stderr. With `--format text`, a generic renderer prints the result (a table for arrays of flat objects, key: value pairs otherwise). There is no per-command formatter.
- **Exit codes:** 0 OK; 1 FAIL from the domain; 2 usage or input invalid (unknown command, schema violation); 3 INCOMPLETE (admission, grant, readiness or missing provider); 4 internal error. *Inferred*: this must be reconciled with the hard-won 05538ad7 envelope and exit-code contract (`read`: CLI-inv:96). If they differ, the ported regression test wins and this table changes.
- **Errors** always carry `code`, `pointer`, the `flag` or positional name, `expected`, `observed` (redacted) and an executable `repair`. This is the plan's diagnostic shape (`read`: Plan:42, 147–157) and follows Anthropic's "actionable errors, not opaque codes" (`web`: [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)). Unknown nouns and verbs get edit-distance suggestions; the old `lib/text/levenshtein.js` is 45 lines and can be ported (`read`: CLI-inv:30).

### 2.3 Help and discovery for agents

| Need | CLI | MCP |
| --- | --- | --- |
| What can I do here? | `forge catalog list` (JSON: every op with summary, stability, readiness, effects); `forge --help` (text, grouped by block) | `tools/list`; `catalog_list` |
| Exact contract of one operation | `forge catalog describe <noun.verb>` (resolved schemas, examples, CLI usage, MCP name, permission key) | `catalog_describe` |
| Call something not exposed as a tool | `forge <noun> <verb>` | `catalog_call {op, input}`. It goes through the same admit and grant path, so it opens no new authority. |
| Why did it refuse? | `error.repair`, `forge config explain` | same `error` in `structuredContent` |

Shipped skills and docs name operations as `noun.verb`. A conformance check fails the build when a skill names an operation the catalog doesn't have. This prevents the ledger's "generated harness files reference commands and skills that do not exist" (`read`: Ledger:77) (`inferred`).

### 2.4 MCP projection

- **One tool per exposed operation.** Name `<noun>_<verb>`. Hyphens stay inside segments; see §3.3 for why dots can't be used.
- **Exposure (N6):** by default `forge mcp` lists stable operations that have `agent` in `callers` and are admitted, up to a budget of 40 tools. It always lists `catalog_list`, `catalog_describe` and `catalog_call`. `config.yaml` `mcp.expose` selects nouns or operations, like GitHub MCP's `--toolsets` and `--tools`, and `mcp.readOnly: true` drops every operation with effects, like GitHub's `--read-only` (`web`: [github-mcp-server README](https://github.com/github/github-mcp-server)). Both GitHub and Anthropic warn that more tools make tool choice worse and fill context (`web`: same; [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)).
- **Annotations come from declared effects:**
  - `effects: []` gives `readOnlyHint: true`.
  - Write effects give `readOnlyHint: false`, `destructiveHint` set to the declared `destructive` (default `true`, the same as MCP's default), and `idempotentHint` set to the declared `idempotent`.
  - Any `external:*` effect gives `openWorldHint: true`.
  
  The spec says annotations are hints and that clients must treat them as untrusted (`web`: schema.ts ToolAnnotations). Forge's own grants still decide.
- **A stable list:** the spec says `tools/list` "MUST NOT vary per-connection", "MAY vary by the authorization presented", and SHOULD come back in a deterministic order (`web`: MCP tools §Capabilities). The list is sorted by `op` and fixed per catalog digest. A catalog change emits `notifications/tools/list_changed` to subscribers (§List Changed). The plan's explicit-restart rule for provider replacement still applies (`read`: Plan:433).
- **The MCP server is a projection.** The handler contract is the single implementation (`read`: Plan:1023). `forge mcp` holds no domain logic.

### 2.5 What stays hand-written

| Hand-written | Why it cannot be generated | Size target (`inferred`) |
| --- | --- | --- |
| `bin/forge` argv transport: global flags, noun/verb lookup, positional and flag mapping, envelope, exit codes, generic text renderer, suggestions | It is the generator's consumer, not an operation | one module |
| `forge mcp` stdio transport | Protocol framing and negotiation are transport, not domain (`read`: Plan:1025) | one module |
| `forge hook <host> <event>` stdin transport | It reads the host's hook payload and calls the host adapter's declared operation (e.g. `host.hook`). Today's `hooks.js` logic moves into adapter blocks. | thin shim |

**Not hand-written** (declared in core's built-in manifest `forge/core`, generated like every other operation):

- `block.new`, `block.check`, `block.add`, `block.admit`, `block.remove`, `block.list` and `block.types`
- `config.show`, `config.explain`, `config.validate`, `config.preview`, `config.apply` and `config.revert`
- `catalog.list`, `catalog.describe` and `catalog.call`
- `doctor.run` (default verb, so `forge doctor` works)
- `host.setup` and `host.status`

Bootstrap needs no special path: on a fresh machine with no config, the catalog is the built-in first-party manifests shipped in the package, so `forge host setup claude` already exists. **Rejected:** keeping `setup` or `doctor` hand-written "because they run before config". The built-in catalog covers that, and a hand-written setup is where today's 35-library `setup.js` cluster came from (`read`: CLI-inv:75).

---

## 3. One naming convention

### 3.1 The grammar

| Thing | Form | Characters | Example (ours) | Example (outside) |
| --- | --- | --- | --- | --- |
| Publisher | reverse-DNS labels | `[a-z][a-z0-9-]*` labels joined by `.` | `forge` (reserved) | `io.github.alice`, `com.acme` |
| Block ID | `<publisher>/<name>` | name: `[a-z][a-z0-9-]{1,30}` | `forge/work` | `io.github.alice/semver` |
| Noun | one segment | `[a-z][a-z0-9-]{1,20}`, no leading or trailing `-`, no `--` | `issue` | `semver` |
| Verb | one segment | same | `claim` | `bump` |
| Operation (public address) | `<noun>.<verb>` | | `issue.claim` | `semver.bump` |
| Capability / permission key | `<blockId>.<noun>@<iface-semver>#<verb>` | | `forge/work.issue@1.0.0#claim` | `io.github.alice/semver.semver@1.0.0#bump` |
| CLI | `forge <noun> <verb>` | | `forge issue claim 42` | `forge semver bump 1.4.2 minor` |
| MCP tool | `<noun>_<verb>` | `[a-z0-9-_]`, at most 48 characters | `issue_claim` | `semver_bump` |
| Instance (config) | `blocks.<instance>` | kebab; defaults to block name | `blocks.memory` | `blocks.semver` |
| Config keys / schema properties | lowerCamel | `^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$` | `staleAfterDays` | `preRelease` |
| CLI flag | kebab of property | | `--stale-after-days` | `--pre-release` |
| Event type | `<noun>.<past-participle>` qualified by block | | `forge/work:issue.claimed@1` | `io.github.alice/semver:semver.released@1` |
| Effect | `<noun>:read` / `<noun>:write` / `external:<target>` | | `issue:write`, `external:github` | `fs:write` (declared, not enforced) |
| Error code | `UPPER_SNAKE` | | `LEASE_HELD` | `SEMVER_INVALID` |
| npm package | any name the author owns, plus `"forgeBlock": "<blockId>"` in package.json and keyword `forge-block` | npm rules | (inside `forge-workflow`) | `@alice/forge-semver` |

The mapping rule is **segments are kebab-case, and the separator tells you the surface**:

- `.` within a Forge name
- `_` between segments in MCP
- a space on the CLI
- `/` after the publisher
- `:` before an event's local name
- `@` before a version
- `#` before the operation inside a permission key

Segments never contain `.` or `_`, so every mapping is bijective, and an MCP name parses back to exactly one operation (`inferred`).

`forge/memory.memory@1.0.0#search` looks repetitive when a noun shares its block's name. It is kept because the rule stays mechanical, and permission keys are machine data, not typed by people (`inferred`).

### 3.2 Namespaces, reserved names and collisions

- **Three namespaces:**
  1. **Core** (`forge/core`) owns the nouns `block`, `config`, `catalog`, `doctor` and `host`.
  2. **First-party** blocks have publisher `forge`.
  3. **Outside authors** use any reverse-DNS publisher they can prove. The proof follows the MCP registry model: GitHub OAuth for `io.github.*`, DNS for domains (`web`: [MCP Registry about](https://modelcontextprotocol.io/registry/about)). Proof matters only for publication in the curated index (plan tier "publisher verified", `read`: Plan:1156). Local blocks need no proof, and an unproved publisher on a local block is shown as `unverified`.
- **Reserved publishers:** `forge`, any publisher whose first label is `forge` (`forge.*`), and the MCP rule's analogue, a second label of `forge` (`dev.forge`, `io.forge`). This mirrors MCP's reserved `_meta` prefixes, where a second label of `modelcontextprotocol` or `mcp` is reserved (`web`: MCP schema, MetaObject).
- **Reserved nouns** cannot be declared by outside blocks, even when the first-party block is not installed:
  - core nouns
  - every first-party noun in §4
  - `help`, `version`, `mcp`, `hook`, `completion`, `forge`, `x`
  - any single letter, and any noun starting with `forge-`

  This copies gh ("An extension cannot override any of the core gh commands", `web`: [gh extension](https://cli.github.com/manual/gh_extension)) and kubectl, whose built-ins "always take precedence" (`web`: [kubectl plugins](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/)). It refuses at `block check` instead of silently shadowing.
- **Collisions between installed blocks** (N4): two blocks declaring the same noun, or a second instance of the same block, are refused at `block add` with `NOUN_COLLISION`. The repair is a local rename in config:

  ```yaml
  blocks:
    alice-notes:
      source: { package: "@alice/forge-notes", version: "0.3.0" }
      rename: { notes: alice-notes }        # forge alice-notes add …, MCP alice-notes_add
  ```

  A rename changes the CLI and MCP names only. The permission key and the authority do not change, as the plan already requires for aliases (`read`: Plan:414). The order blocks were installed in never decides anything, because a private index cannot shadow a native ID by search order (`read`: Plan:1154).
- **Prefix rule:** a noun cannot equal another noun plus `-…`. This follows VS Code's "A setting ID cannot be a complete prefix of another setting ID" (`web`: [contribution points](https://code.visualstudio.com/api/references/contribution-points)) and keeps suggestions and completion unambiguous (`inferred`).

### 3.3 Real constraints checked

| Constraint | Source | Effect on the convention |
| --- | --- | --- |
| MCP tool names SHOULD be 1–128 characters, case-sensitive, using only `A-Z a-z 0-9 _ - .`, and unique within a server. Aggregators SHOULD disambiguate by server prefix, and `serverInfo.name` SHOULD NOT be relied on. | `web`: [MCP spec 2026-07-28, Tools → Tool Names](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) | MCP allows `issue.claim`, but the next row rules it out. |
| The Claude API tool `name` must match `^[a-zA-Z0-9_-]{1,128}$`, so **no dots** | `web`: [platform.claude.com Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) | A dotted MCP name cannot pass through to Claude unchanged, so Forge emits `issue_claim`. |
| OpenAI function-name limit | `web`: platform.openai.com API reference returned **403, not verified** | It is commonly reported as `^[a-zA-Z0-9_-]{1,64}$`, which is *unverified*. Together with host prefixes such as Claude Code's `mcp__forge__` (`inferred` from this session's own tool names), a budget of **48 characters** keeps a prefixed name within 64. `block check` refuses longer names. |
| MCP `_meta` prefixes use reverse-DNS, with second label `modelcontextprotocol`/`mcp` reserved | `web`: MCP schema MetaObject | Publisher format and reserved-publisher rule (§3.2). |
| The MCP Registry names servers `io.github.user/server` or `com.example/server`, verified through GitHub or DNS, and npm packages prove ownership with `mcpName` in package.json. The registry is in *preview*. | `web`: [Registry about](https://modelcontextprotocol.io/registry/about); `mcpName` from a search summary of modelcontextprotocol.io/registry (secondary, so treat it as indicative) | The block ID form matches, so a Forge block that ships an MCP server can reuse its registry name. `forgeBlock` in package.json copies the `mcpName` link pattern. |
| OpenAPI `operationId` "MUST be unique among all operations", "is case-sensitive", and it is "RECOMMENDED to follow common programming naming conventions" | `web`: [OAS 3.1.1](https://spec.openapis.org/oas/v3.1.1.html) | `noun.verb` is unique per catalog and maps to a valid identifier (`semverBump`) for SDK generation. |
| Anthropic: "Use meaningful namespacing in tool names… prefix names with the service"; "Consolidate related operations into fewer tools" | `web`: Define tools; Writing tools for agents | Noun-first names (`issue_*`) give the prefix grouping. Consolidation is a block-design choice; the generator never splits one operation into many tools. |
| npm: a scope belongs to its user or organization; `@forge/*` is Atlassian's; unscoped `forge` is a third party's | `web`: [npm scope docs](https://docs.npmjs.com/cli/v11/using-npm/scope); registry fetches above | The package names in N10. |

### 3.4 Versioning, deprecation and stability

- **Names carry no version.** The CLI and MCP name is the operation of the bound interface version. The version lives in the permission key and the lock (`read`: Plan:350–358).
- **A breaking change** to an operation's schema or meaning requires a new interface major. Version suffixes in names (`semver.bump-v1`) are not allowed. To keep the old behaviour available during the change, introduce a new verb and mark the old one `deprecated: {since: "0.4.0", use: "semver.next", removeIn: "1.0.0"}`.
- **Deprecated operations** keep working. The CLI adds `warnings[]` to the envelope and writes one line to stderr. MCP prefixes the description with `Deprecated: use semver_next.`, and exposure drops them unless they were selected explicitly.
- **Renames** use `formerly: ["issue.ready"]` on the new operation. The old name resolves for one minor version with a warning, then becomes `UNKNOWN_COMMAND` with `suggest`. This is the only alias mechanism, and it expires (`inferred`; it applies Ledger:141, "aliases… are shims").
- **Stability tiers** (per operation, chosen by the author):
  - `experimental`: shown with a marker, not exposed on MCP by default, and changes in any minor.
  - `stable`: changes only by SemVer.
  - `deprecated`
- **Trust tiers are a separate axis** that authors cannot grant themselves: listed, publisher verified, release reviewed and Forge supported (`read`: Plan:1156). Help shows both axes and never merges them.

---

## 4. Block names: is "Kernel" right?

**Test applied:** would a person or agent guess this word when they want the thing? Does the word describe what the block owns, or what it once felt like? Does it collide with an established meaning? Surfaces already address operations by noun (§3), so a block name appears only in IDs, config, packages and docs. That lowers the cost of a plain name and also the cost of a rename (`inferred`).

| Internal name | What it owns (`read`) | Names people and agents would guess (`inferred`) | Verdict | Proposed |
| --- | --- | --- | --- | --- |
| **Kernel** | Issues, dependencies, claims and leases, revision/CAS, accepted run/node/event/evidence records (Arch:31, 50). It is opened only for authoritative operations: "A greeting tool, pure advisor or standalone Memory consumer needs no issue" (Arch:41). | issues, tracker, work, tasks, state | **Rename.** "Kernel" claims to be the always-loaded core, which the arch evaluation says it is not; the real core is the catalog and runtime. No one guesses it: the old CLI has no `kernel` command, and users type `forge issue …` (`ran`: `ls lib/commands`; CLI-inv:43–55). "Kernel" also invites the stage-ladder leak the ledger records (A5) by suggesting core owns workflow state. | **`forge/work`**, the work tracker. Nouns: `issue`, `run`, `event`. It covers both work items and accepted work runs. Alternative: `forge/tracker`. |
| **Contracts** | Wire schemas, identities, catalog, config compiler/writer, admission, dispatch (Arch:30, 45–48) | core, config, catalog, registry | **Retire as a product word.** It names an artifact type rather than a component, and the owner's "contract-first" principle doesn't need it as a name. It is the core. | **`forge/core`**. Nouns: `block`, `config`, `catalog`, `doctor`, `host`. The package subpath for public schemas is `forge-workflow/schema`, and the author types are `forge-workflow/author`. |
| **Flow** | The single-operation invoke wrapper, process supervision and coordination, plus the reference sequential runner (Arch:33, 200) | run, runner, workflow, pipeline | **Split and retire the name.** The invoke wrapper is part of the core runtime and has no noun, because every `forge <noun> <verb>` *is* an invoke. The runner is a solution-level block. | **`forge/workflow`**. Noun `workflow` with verbs `run`, `resume`, `show` and `list`. It runs any template. Delivery stages are data in Forge's own template, never in the block (Brief "flow stays on top"). |
| **Memory** | Notes, decisions, FTS, links, scopes (Arch:32; Plan:1219–1283) | memory, notes, remember, recall | **Keep.** It is plain and guessed. | **`forge/memory`**. Nouns `memory` (`add`, `search`, `show`, `forget`, `export`, `restore`) and `decision` (`propose`, `adopt`, `list`). The scope (project or device) is an input, not a separate block. |
| **Shepherd** | A bounded PR observation pass, a converged check verdict, re-running flaky required checks (CLI-inv:62; AGENTS.md) | pr status, checks, ci, watch | **Rename.** It is a metaphor no one guesses, and it carried the daemon baggage the plan dropped (CLI-inv:62 "one bounded pass, no daemon"). | **`forge/pr`**. Noun `pr` with verbs `link`, `checks` (one bounded pass), `status`, `merge` (guarded, exact head) and `threads`. The GitHub specifics live in provider block `forge/github` (noun `github`: `status`, `use`). |
| **Policy** (with "gate" and "rails") | Evaluators, obligations, human approvals (Arch:34; Plan:1135–1142) | policy, rules, approve, gate | **Keep "policy". Drop "gate" and "rails".** "gate" was overloaded across three things: rail toggles, human approvals and checks (`read`: AGENTS.md `forge gate disable rail.*`, `gate approve`). Toggles become config keys. | **`forge/policy`**. Noun `policy` (`explain`, `evaluate`) and noun `approval` (`grant` and `revoke`, which are human-only, plus `show` and `list`). |
| validate / test / lint / security (delivery) | Run repository checks, produce typed evidence (Arch families 7–9) | check, test, lint, validate | **One plain noun.** | **`forge/check`**. Noun `check` with verbs `run`, `list` and `show`. |
| worktree / push / clean (delivery) | Git workspace and push effects (CLI-inv:62) | worktree, push, branch | Plain nouns already; group them under one block. | **`forge/git`**. Nouns `worktree` (`create`, `remove`, `list`, `clean`) and `branch` (`push`). |
| recap / orient / prime / status | The orientation envelope (CLI-inv:59) | status, context, recap | **One plain noun.** "status" stays unreserved for outside blocks, because it is too generic to give to any one block. | **`forge/context`**. Noun `context` with verb `show` (the recap). |
| Skills / roles / templates | Catalog assets (Arch families 1, 6) | skill, template | Plain. | **`forge/skills`**. Nouns `skill` (`list`, `show`, `find`) and `template` (`list`, `show`, `use`). |
| Harness adapters | Host projection, hooks, native artifacts (Plan:978–1027) | claude, codex, setup | Product names are what people type. | **`forge/claude`, `forge/codex`, `forge/opencode`, `forge/pi`, `forge/cursor`, `forge/hermes`.** Each one plugs into core's `host` noun (`forge host setup codex`) and declares `host.hook` for the hook transport. |
| "Solution" / "composition" | A selected set of blocks plus config (Plan:751) | setup, config, template | **Use "template" for a shareable composition and "config" for a project's own.** "Solution" stays a docs word only. | Forge's opinionated flow ships as **template `forge/delivery`**. |
| "block" itself | The unit of extension | plugin, extension | **Keep (owner's word).** It is reserved as a core noun, and help for `forge plugin` suggests `forge block`. There is no alias. | `forge block …` |

Migration impact (`read`: CLI-inv:43–55): the five projects mostly use issue verbs, `comment`, `recap`, `remember`/`recall`, `hooks` and `setup`. Under this set those become:

- `forge issue <verb>`, unchanged
- `forge issue comment`
- `forge context show`
- `forge memory add` / `forge memory search`
- `forge hook <host> <event>`
- `forge host setup`

Under N8-A the migration rewrites the project docs and hook wiring, as CLI-inv decision A1 already does for `sync`.

---

## 5. Prior art (primary sources)

| System | What it does (`web`) | Take | Reject, and why |
| --- | --- | --- | --- |
| **gh extensions**, [cli.github.com/manual/gh_extension](https://cli.github.com/manual/gh_extension) | The repository must start with `gh-` and contain an executable of the same name. "An extension cannot override any of the core gh commands", and `gh extension exec <extname>` handles conflicts. "When you install or upgrade an extension, you are trusting its publisher." | Core always wins. Installing is a trust act. An escape hatch for collisions; ours is `rename`. | Name-prefix discovery and one executable per extension: no schemas, so no MCP and no generated help. Upgrade checks every 24 hours: the plan forbids auto-selecting newer releases (`read`: Plan:339). |
| **kubectl plugins**, [kubernetes.io/…/kubectl-plugins](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) | `kubectl-foo-bar` becomes `kubectl foo bar`, with underscores for dashes and longest-match resolution. Discovered by PATH scan. "not possible to create plugins that overwrite existing kubectl commands". `plugin list` warns on overlapping names. | Built-ins take precedence. Collision warnings in the list. Nested command paths from names. | PATH scanning is hidden discovery and implicit trust (`read`: Plan:47 "Hidden global registry" excluded). Filename-encoded grammar and silent ignoring of shadowed plugins: we refuse loudly instead. |
| **git**, [git-scm.com/docs/git](https://git-scm.com/docs/git#_git_commands) | Core programs in `GIT_EXEC_PATH`, then `git-<command>` on `$PATH`, "before trying `foo` as an alias". | A fixed, documented resolution order. | PATH executables and user aliases: aliases are a second naming system. |
| **cargo**, [doc.rust-lang.org/cargo/reference/external-tools.html](https://doc.rust-lang.org/cargo/reference/external-tools.html) | `cargo-${command}` on PATH, preferring `$CARGO_HOME/bin`. `cargo help ${command}` runs `cargo-${command} ${command} --help`. Linking cargo as a library is "unstable", and the CLI and `cargo metadata` are encouraged. | Help is part of each extension's contract. Extensions call back through the stable public surface: our `services` slots and the CLI, never internals. | PATH discovery. Help produced by running the extension: ours is rendered from data without import. |
| **VS Code contribution points**, [code.visualstudio.com/api/references/contribution-points](https://code.visualstudio.com/api/references/contribution-points) | Static JSON in `contributes`. Commands have an `id` (`extension.sayHello`), a `title` and a `category`. Configuration keys are prefixed by extension, and "A setting ID cannot be a complete prefix of another". Invoking a command emits `onCommand:${command}` activation. | **Declare statically, activate on use.** This is the core idea of §2: help, describe and MCP lists come from data, and code imports only on invoke. Config namespaced by owner. The prefix rule. | Free-form command IDs, which are dotted but not enforced. We enforce one grammar. |
| **MCP spec and registry**, [MCP 2026-07-28 tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), [schema.ts](https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/2026-07-28/schema.ts), [Registry](https://modelcontextprotocol.io/registry/about) | Tool name rules, `inputSchema`/`outputSchema`, hint-only annotations, `isError` versus protocol errors, deterministic and stable `tools/list`, `list_changed`. Reverse-DNS `_meta` prefixes with a reserved second label. The registry's `io.github.user/server` names with verified namespaces. | Publisher format, reserved-publisher rule, structured output, the error split, effect-to-annotation mapping, the stable list. | Dotted tool names (Claude API incompatible). Trusting annotations: the spec itself says don't. |
| **GitHub MCP server**, [github.com/github/github-mcp-server](https://github.com/github/github-mcp-server) | Toolsets (`issues`, `pull_requests`, …) chosen with `--toolsets` / `GITHUB_TOOLSETS`, plus `--tools`. "Read-only mode takes priority". snake_case names such as `list_issues` and `issue_read`. "Enabling only the toolsets that you need can help the LLM with tool choice and reduce the context size." | Exposure by noun group, read-only mode, a tool budget. | An environment variable overriding a flag: our exposure lives only in config, the one place for behaviour (`read`: Plan:56). Verb-first names (`list_issues`): noun-first groups better in sorted lists and tool search (`inferred`). |
| **Anthropic tool guidance**, [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools), [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | The name regex, service-prefix namespacing, consolidation, high-signal responses, actionable errors, a `response_format` concise/detailed option. Prefix versus suffix namespacing "to have non-trivial effects". | Prefix by noun, actionable `repair`, examples in docs records. A block may declare a `responseFormat` input enum; it is ordinary schema with no special support. | Nothing rejected outright. Consolidation is left to block authors rather than enforced. |
| **OpenAPI**, [OAS 3.1.1](https://spec.openapis.org/oas/v3.1.1.html) | `operationId` is unique, case-sensitive and follows programming conventions. One document generates clients and docs. | Unique operation IDs. One declaration generates every surface. | HTTP paths and methods as identity: Forge operations are not resources over HTTP. Free-form IDs. |

---

## 6. Decisions

Letters are reply choices. **Silence selects A for every decision.** Each A is consistent with Arch decisions A (contract skeleton, generic envelopes, policy separation, execution separation).

| # | Decision | A (default) | Alternatives | Reason for A | What would change it |
| --- | --- | --- | --- | --- | --- |
| N1 | Block names | The §4 set: `work`, `core`, `workflow`, `memory`, `pr`/`github`, `policy`, `check`, `git`, `context`, `skills`, host adapters. Kernel, Contracts, Flow, Shepherd, gate and rails retire as product words. | **B** keep Kernel, Contracts, Flow and Shepherd as block IDs (surfaces use nouns anyway). **C** rename only Kernel and Shepherd. | The owner's test: these are plain words people guess. Each name says what the block owns. "Kernel" misstates the architecture. | The owner values continuity with existing docs and memory notes more than guessability. B is cheap, because surfaces don't show block names. |
| N2 | Identity grammar | `publisher/name` with reverse-DNS publishers and reserved `forge`. This normalises the plan's `forge.memory` to `forge/memory`. | **B** keep the plan's mixed `forge.memory.recall` / `io.github.x/y`. **C** use the npm package name as identity. | One parse rule. It matches the MCP registry. Identity doesn't depend on npm, so local, git and npm sources share it. | The owner wants the plan's literal strings kept for the contract-lock corpus. |
| N3 | Operation address | `noun.verb`, kebab segments, the noun owned by exactly one installed block, a flat CLI `forge <noun> <verb>`. The manifest gains an `operations` map. | **B** block-prefixed: `forge <block> <noun> <verb>`. **C** free-form operation IDs, as in OpenAPI. | It is what users already type (`forge issue claim`). It is short for agents and maps bijectively to MCP. | Many outside blocks fight over the same nouns in practice. Then B (always prefix outside nouns) becomes better. |
| N4 | Collisions | Refuse at `block check`/`add`, with a local `rename:` in config as the repair. Reserved nouns and publishers. Install order never decides. | **B** first installed wins. **C** auto-prefix outside nouns. | Explicit and deterministic. No silent shadowing (kubectl's failure mode). Authority keys unaffected. | Collisions turn out to be frequent enough that renames are routine, which points to N3-B. |
| N5 | MCP tool names | `noun_verb`, no `forge_` prefix, at most 48 characters | **B** `forge_noun_verb`. **C** dotted `noun.verb`. | C breaks the Claude API regex (`^[a-zA-Z0-9_-]{1,128}$`). Hosts already prefix the server (`mcp__forge__…`), so B doubles it. | A target host doesn't prefix and collides with another server. Then add `mcp.toolPrefix` in config for that host. |
| N6 | MCP exposure | Stable, admitted, agent-callable operations up to a budget of 40, plus `catalog_list`, `catalog_describe` and `catalog_call`. `mcp.expose` and `mcp.readOnly` in config. | **B** every operation. **C** only the three meta tools. | Tool choice and context cost, per GitHub and Anthropic guidance. `catalog_call` keeps the long tail reachable through the same grants. | Hosts' tool search makes large tool lists cheap; then raise the budget. Or measured agent success shows C is enough. |
| N7 | Output default | JSON envelope always; `--format text` for people | **B** detect a TTY (text for humans, JSON when piped). **C** text by default, with `--json`. | Agents are the main callers. Behaviour shouldn't depend on terminal detection, which differs across harnesses and Windows (the top bug theme, `read`: Ledger:22). | The owner wants human-first terminal use. Then pick B with an explicit override. |
| N8 | Aliases and shortcuts | None. Migration rewrites the five projects' docs and hooks, as CLI-inv A1 does. | **B** a closed, core-owned table of at most 10 shortcuts (`remember`, `recall`, `ready`, `show`, `claim`, `close`), each shown in describe as pointing to its canonical operation. | One naming system. Aliases are the shims the ledger drops (`read`: Ledger:141). | Agents in the five projects keep calling the old verbs after migration, measured in their transcripts. |
| N9 | Versioning and stability | Unversioned names. Per-operation `stability`. `deprecated{since,use,removeIn}`. A `formerly` rename window of one minor. Trust tier kept separate. | **B** block SemVer only, no per-operation markers | Agents need to know per operation what is safe to depend on. Expiry stops alias buildup. | Never-used tiers; then collapse them to stable and deprecated. |
| N10 | Package names | Keep publishing **`forge-workflow`** (owned) with bin `forge`. Author types at `forge-workflow/author`. Outside packages use any name, plus `"forgeBlock"` in package.json and keyword `forge-block`. Never `@forge/*`. | **B** get the unscoped `forge` name transferred from its current maintainer. **C** a scope we own (e.g. `@forge-workflow/*`) for first-party blocks published separately. | `forge` and `@forge` are taken (`web`). First-party blocks ship inside the one package (Brief). | The owner obtains `forge`, or first-party blocks need their own release cadence (C). |
| N11 | Hand-written surface | Only the transports (argv, MCP stdio, hook stdin) and global flags. Core's own operations are declared in `forge/core` and generated. | **B** also keep `setup` and `doctor` hand-written. | Dogfoods the contract, so no core-only path drifts. The built-in catalog makes bootstrap work. | A bootstrap case that needs to run before the catalog can load, such as a corrupt install. Then add one hand-written `doctor` fallback. |
| N12 | Human-only operations | A `callers` field. Operations without `agent` (`block.admit`, `approval.grant`) never appear on MCP and refuse without an interactive human or a trusted embedding. | **B** expose everything and rely on refusal at call time. | Agents must not mint trust (`read`: Plan:50; Arch:143). Not showing those tools at all removes the temptation and a class of prompt-injection paths. | Hosts gain a verified human-confirmation channel that MCP can carry. Then expose those operations with that requirement. |

## 7. Leaks, risks, open questions

- **Flow-on-top check:** nothing in the grammar knows about stages, PRs or TDD. `pr`, `check`, `git` and `workflow` are ordinary blocks with reserved nouns. The delivery stages live in template `forge/delivery`. The old registry ran `enforceStage` for stage-named commands (`read`: CLI-inv:35); there are no stage-named commands to enforce here.
- **Risk: a generated surface gives worse help than hand-tuned commands.** The mitigation is required docs records with examples, which `block check` refuses to pass without. Text rendering stays generic.
- **Risk: an agent grinds through 40 tools.** The mitigation is the exposure budget plus `catalog_describe`, measured in the plan's cold-author trials (`read`: Plan:2002).
- **Risk: the manifest change (N3) diverges from the plan's `provides[]` corpus.** It must be reconciled at contract lock alongside the §3.4/§3.12 schema conflict the arch evaluation already flags (`read`: Arch:130).
- **Not verified:** the OpenAI name limit (403); the `mcpName` details (secondary source); Claude Code's total tool-name length limit (`inferred` from the `mcp__server__tool` form seen in this session). Pin them at the native-proof step (`read`: Plan:1025).
- **Inspected, nothing notable:** `lib/commands/ready.js` (a 5-line `createIssueSubcommand('ready')` wrapper, consistent with CLI-inv's "thin wrappers" finding). `lib/commands/_manifest.js` header (generated, with `load` closures for `bun build --compile`). That compile path is the only reason a static manifest exists, and it is dropped unless re-admitted (`read`: Ledger:131).
