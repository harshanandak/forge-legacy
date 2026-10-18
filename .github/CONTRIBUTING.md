# Contributing to Forge

Thank you for your interest in contributing to Forge!

## Development Setup

1. Clone: `git clone https://github.com/harshanandak/forge`
2. Install: `bun install`
3. Read: [DEVELOPMENT.md](../DEVELOPMENT.md) for quick start

## Branch Naming

| Prefix | Purpose | Example |
|--------|---------|---------|
| `meta/` | Workflow improvements | `meta/improve-plan-output` |
| `workflow/` | Principle changes | `workflow/add-security-stage` |
| `feat/` | CLI features | `feat/add-version-check` |
| `fix/` | Bug fixes | `fix/windows-path-handling` |
| `plugin/` | New agent plugins | `plugin/add-zed-support` |
| `docs/` | Documentation | `docs/update-examples` |

## Issue Tracking

Issue tracking uses the Forge kernel (`forge issue …`):

```bash
forge issue create --title "Your issue title" --type task
forge issue list
forge issue close <id>
```

Beads is also supported as an optional legacy backend.

## Plugin Development

See [lib/agents/README.md](../lib/agents/README.md) for the complete guide.

Quick steps:
1. Create `lib/agents/your-agent.plugin.json`
2. Follow the schema in README
3. Test: `bunx forge setup --agents your-agent`
4. Submit PR

## Validation

CI on the PR is the gate. This repository installs no local git hooks. Write tests
for changed behavior and run `bun run lint` and relevant tests before publishing
with plain `git push`. `forge push` is an optional explicit local lint/test runner;
`forge push --quick` omits its test step. CI still runs the required PR checks.

After updating an existing checkout, run `lefthook uninstall` (or remove the old
`.git/hooks` shims) once. Consumer projects still use the existing setup behavior.

## Pull Request Process

1. Fork the repo and create your branch (see naming above)
2. Make changes following branch naming conventions
3. Ensure relevant tests and lint pass
4. Run `/validate` to validate (type check, lint, tests, security)
5. Submit PR with clear description
6. Address review feedback

## Code Style

- Use Prettier for formatting
- Follow existing patterns in the codebase
- Add JSDoc comments for public functions
- Keep commits atomic (one change per commit)

## Commit Messages

Follow conventional commits:
```
type: short description

Longer description if needed.

Refs: #issue-number
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive
