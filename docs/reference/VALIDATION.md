# Validation Reference

Forge validation is evidence, not a slogan. Record the command, result, and failure text when validation fails.

## Project Validation

In this repository, CI on the PR is the merge gate. No local git hooks are installed.
Plain `git push` publishes without local validation. `forge push` remains an optional
explicit branch/lint/test check (`--quick` omits tests). Consumer setup behavior is
unchanged. Existing developers should run `lefthook uninstall` once after merging
the hook removal so old shared `.git/hooks` shims do not call a missing config.

For optional local validation:

```bash
bun run check
```

`bun run check` runs `scripts/validate.js` in this order:

1. `bun run typecheck`
2. `bun run lint`
3. `bun audit`
4. `node scripts/test.js --validate`

Security audit behavior distinguishes blocking high/critical vulnerabilities from lower-severity warnings.

## Canonical Validation Resource Budget

In a Forge source checkout, run the receipt-producing command from a clean, committed worktree:

```bash
forge validate --shards 2
```

`--shards N` accepts a positive integer resource budget for the full-suite scheduler. Unit workers cost one unit; on Windows, subprocess and exclusive workers cost two. An explicit budget below a required worker's cost fails before test workers start. Omitting the flag selects an automatic budget, which may increase to the minimum needed to run every lane. Output records the requested and effective budget, or the requested and minimum budget on rejection.

These weights govern Forge's lane workers; they do not impose an operating-system limit on every process a test may create. The budget changes scheduling, not required test coverage or deadlines. Consumer repositories cannot use this flag because their test commands do not implement Forge's scheduler contract.

A successful full validation can be reused by the next unchanged `forge push` under the existing receipt checks. Changing the source or validation inputs requires fresh evidence.

## Supporting Commands

```bash
bun run typecheck
bun run lint
bun test --timeout 15000
bun run validate:yaml
npm pack --dry-run
```

Use `npm pack --dry-run` for package contents and release-readiness checks. It does not publish.

## Agent Stage Validation

`/validate` is an agent workflow stage. It may include rebase/freshness checks, local validation, manual security review, and Beads context updates according to the installed stage instructions.

Do not confuse:

- `/validate` - agent stage workflow
- `forge-preflight` - prerequisite checker
- `bun run check` - repository validation script

## Work Artifact Paths

Current planning and validation evidence should point to:

```text
docs/work/YYYY-MM-DD-<slug>/
```

Legacy `docs/research/` or `docs/plans/` examples are historical unless a specific tool documents a compatibility fallback.

## Failure Recovery

Fix failures in order:

1. Typecheck
2. Lint
3. Security audit
4. Tests
5. Packaging

For each failure:

1. Reproduce with the exact command.
2. Read the first real error.
3. Fix the root cause.
4. Rerun the full validation command.

Do not proceed to ship with "should pass" or stale output.

## Documentation Changes

For docs-only changes, still run:

```bash
bun run check
npm pack --dry-run
```

Run a Markdown link check when available. If adding docs tooling would broaden the PR, file follow-up work instead.
