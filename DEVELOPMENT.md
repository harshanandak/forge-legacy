# Developing Forge

> This file is NOT distributed to users.

## Quick Start

1. Clone: `git clone https://github.com/harshanandak/forge`
2. Install: `npm install`
3. Use Forge to develop Forge: `/status` → `/plan` → `/dev`

## Meta-Development Mode

This project IS the Forge workflow. We use Forge to develop Forge (dogfooding).

**When improving the workflow itself:**
- Branch: `meta/*` or `workflow/*`
- Issue: "meta: Improve /plan command"

**When adding Forge features:**
- Branch: `feat/*`, `fix/*`, `docs/*`
- Issue: "feat: Add version check"

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `lib/agents/` | Agent plugins ([README](lib/agents/README.md)) |
| `.forge/hooks/` | Legacy consumer hook scripts |
| `.claude/commands/` | Workflow commands |
| `.claude/skills/` | Workflow skills |
| `bin/` | CLI entry points |

## Validation

CI on the PR is the gate. This repository installs no local git hooks. Run
`bun run lint` and relevant tests locally, then publish with plain `git push`.
`forge push` is an optional explicit local validator; `--quick` omits its tests.
Consumer setup still installs hooks in this release. Existing contributors should
run `lefthook uninstall` once after merging, or remove the old `.git/hooks` shims.

## Project Structure

```
forge/
├── bin/                    # CLI scripts (forge.js, forge-preflight.js)
├── lib/
│   └── agents/             # Plugin definitions (*.plugin.json)
├── .claude/
│   ├── commands/           # Workflow commands (/status, /plan, etc.)
│   ├── rules/              # Workflow rules
│   └── scripts/            # Helper scripts
├── skills/                 # Skills (parallel-deep-research, sonarcloud-analysis)
├── .forge/
│   └── hooks/              # Legacy consumer hook scripts
├── docs/                   # Documentation
├── AGENTS.md               # Universal workflow guide
├── CLAUDE.md               # Claude Code specific guide
└── package.json            # npm package config
```

## More Info

- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) - Detailed contributor guide
- [lib/agents/README.md](lib/agents/README.md) - Plugin development
- [AGENTS.md](AGENTS.md) - Complete workflow guide
