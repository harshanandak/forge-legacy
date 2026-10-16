'use strict';

// Package allow-list contract (issue 46d25e0a, docs/work/2026-09-28-package-slim/audit.md).
// The npm tarball ships only what the CLI loads, executes, copies into a project or reads
// as data. Every packed path must be justified by the runtime (require graph from the bin
// entry points and command modules, setup's copied assets, or the by-name data list below);
// dev/CI tooling, tests and repo docs must stay out.

const { describe, it, expect } = require('bun:test');
const { execSync, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function readPack() {
  // Hardcoded command, no user input.
  const output = execSync('npm pack --dry-run --json --ignore-scripts', {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const start = output.search(/^\[/m);
  return JSON.parse(output.slice(start))[0];
}

function trackedUnder(...prefixes) {
  return execFileSync('git', ['ls-files', '--', ...prefixes], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').map(line => line.trim()).filter(Boolean);
}

// Static require/import closure from the given entry points, resolved to repo-relative paths.
function requireClosure(entries) {
  const seen = new Set();
  const queue = [...entries];
  const resolveLocal = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
    for (const candidate of [base, `${base}.js`, `${base}.mjs`, `${base}.json`, `${base}/index.js`]) {
      const abs = path.join(ROOT, candidate);
      if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return candidate;
    }
    return null;
  };
  while (queue.length > 0) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    if (!/\.(c|m)?js$/.test(file)) continue;
    // The generated command manifest escapes `/` as / inside require specifiers.
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replaceAll('\\u002f', '/');
    const pattern = /(?:require\s*\(\s*|import\s*\(\s*|from\s+)(['"`])([^'"`]+)\1/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const resolved = resolveLocal(file, match[2]);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }
  return seen;
}

// Runtime files the require graph cannot see: executed by path, copied, or read as data.
// Each entry is justified in the audit (file:line evidence).
const BY_NAME_RUNTIME = [
  'package.json',
  'README.md',
  'LICENSE',
  'AGENTS.md',
  'CODING_STANDARDS.md',
  'bin/forge-cmd.js',
  'lib/kernel/windows-private-acl.js',
  'lib/greptile-match.js',
  'lib/memory/usage-evidence.js',
  'lib/dep-guard/analyzer.js',
  'lib/dep-guard/keyword-ripple.js',
  'lib/smart-status/scoring.js',
  'lib/smart-status/conflicts.js',
  'docs/guides/SETUP.md',
  'docs/reference/EXAMPLES.md',
  'docs/reference/ROADMAP.md',
  'docs/reference/TOOLCHAIN.md',
  'docs/reference/VALIDATION.md',
  'scripts/bootstrap-windows-tools.sh',
  'scripts/github-context-bridge.sh',
  'scripts/dep-guard-keyword-ripple.js',
  'scripts/dep-guard-render-review.js',
  'scripts/smart-status-score.js',
  'scripts/smart-status-sessions.js',
  'scripts/preflight-sonar.eslint.config.mjs',
  'scripts/legacy-claim-repair.js',
  // Default manifest read via __dirname by lib/protected-path-manifest.js:37 (a documented API).
  '.forge/protected-paths.yaml',
];

// Consumer-facing docs: the shipped docs plus the repo docs set that consumers read
// (docs/work planning notes excluded). Every lib/ or scripts/ path they point at is a
// documented building-block API and must ship, except the repo-process references below.
const CONSUMER_DOC_PATHSPECS = [
  'README.md', 'QUICKSTART.md', 'AGENTS.md', 'CODING_STANDARDS.md',
  ':(glob)docs/*.md', 'docs/guides', 'docs/reference', 'docs/forge', 'docs/architecture',
  'skills', 'rules', '.claude/rules',
];

const DOC_REFERENCE_EXCEPTIONS = {
  'scripts/install.sh': 'fetched from raw.githubusercontent.com before the package exists (README.md:213)',
  'scripts/install.ps1': 'fetched from raw.githubusercontent.com before the package exists (README.md:218)',
  'scripts/validate.js': 'Forge-contributor `bun run check` in the Forge repo (QUICKSTART.md:123-124)',
  'scripts/sync-agent-skills.js': 'Forge repo change standard (CODING_STANDARDS.md:44)',
  'scripts/gen-command-manifest.js': 'Forge repo change standard (CODING_STANDARDS.md:49)',
  'scripts/check-agents.js': 'Forge repo test tooling (docs/reference/SKILLS.md:9)',
  'scripts/eval_win.py': 'skill-author eval format note (skills/*/evals/README.md:3)',
  'lib/workflow-templates/test.yml': 'Forge repo release source read from projectRoot (docs/reference/RELEASE.md:28, lib/test-workflow.js:25)',
  'scripts/package-size-check.js': 'Forge repo CI package-size check run by the generated size-check.yml (docs/reference/RELEASE.md:30)',
};

function documentedCodePaths() {
  const refs = new Map();
  const pattern = /(?:\.\.\/)*((?:lib|scripts)\/[\w./-]+\.(?:js|mjs|cjs|sh|json|ya?ml|py|ps1))/g;
  for (const doc of trackedUnder(...CONSUMER_DOC_PATHSPECS)) {
    const lines = fs.readFileSync(path.join(ROOT, doc), 'utf8').split('\n');
    lines.forEach((line, index) => {
      for (const match of line.matchAll(pattern)) {
        const target = match[1];
        // Mentions of files that no longer exist are a docs problem, not a packaging one.
        if (refs.has(target) || !fs.existsSync(path.join(ROOT, target))) continue;
        refs.set(target, `${doc}:${index + 1}`);
      }
    });
  }
  return refs;
}

// Repo-only paths (dev/CI tooling, tests, repo docs) and dead code that must not ship.
const MUST_NOT_SHIP = [
  'CHANGELOG.md',
  'QUICKSTART.md',
  'install.sh',
  '.mcp.json.example',
  '.github/PLUGIN_TEMPLATE.json',
  '.claude/rules/review-process.md',
  '.cursor/rules/permissions-guidance.mdc',
  'lib/agents/README.md',
  'lib/workflow-templates/test.yml',
  'lib/validation/risk-manifest.js',
  'lib/pr-monitor/auto-actions.js',
  'lib/pr-monitor/render-summary.js',
  'lib/setup.js',
  'lib/frontmatter.js',
  'lib/beta5-compatibility-evidence.js',
  'lib/capabilities/index.js',
  'scripts/test-full-suite.js',
  'scripts/test-ci-shard.js',
  'scripts/test-profile.js',
  'scripts/test-dashboard.js',
  'scripts/test-weights.json',
  'scripts/build-test-weights.js',
  'scripts/lib/ci-shard-partition.js',
  'scripts/benchmark.js',
  'scripts/migrate-to-bun-test.js',
  'scripts/commitlint.js',
  'scripts/branch-protection.js',
  'scripts/lint.js',
  'scripts/validate.js',
  'scripts/sync-agent-skills.js',
  'scripts/sync-d20-audit.js',
  'scripts/gen-command-manifest.js',
  'scripts/gen-embedded-assets.mjs',
  'scripts/parity-check.mjs',
  'scripts/npm-release-receipt.js',
  'scripts/install.sh',
  'scripts/install.ps1',
  'scripts/lib/release-asset.mjs',
  'scripts/behavioral-judge.sh',
  'scripts/preflight.sh',
  'scripts/eval_win.py',
  'scripts/run-command-eval.js',
  'scripts/improve-command.js',
];

const RUNTIME_DOCS = new Set(BY_NAME_RUNTIME.filter(file => file.startsWith('docs/')));

// lib/contracts/src/baseline.js (verifyContractBaseline) reads the baseline and every
// artifact it pins (schemas, fixtures, compatibility matrix) through __dirname.
function contractBaselineData() {
  const baselinePath = 'lib/contracts/contract-baseline.v1.json';
  const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, baselinePath), 'utf8'));
  return [baselinePath, ...baseline.artifacts.map(entry => `lib/contracts/${entry.path}`)];
}

// Forge's building blocks are lib/ modules of this one package, never nested packages.
const BLOCK_ENTRIES = ['lib/contracts/index.js', 'lib/flow/index.js', 'lib/memory-core/index.js'];

describe('package runtime allow-list (npm pack --dry-run --json)', () => {
  const pack = readPack();
  const packed = new Set(pack.files.map(entry => entry.path));
  const commandModules = fs.readdirSync(path.join(ROOT, 'lib', 'commands'))
    .filter(name => name.endsWith('.js'))
    .map(name => `lib/commands/${name}`);
  const binEntries = Object.values(require('../package.json').bin);
  const documented = documentedCodePaths();
  const documentedApis = [...documented.keys()].filter(file => !DOC_REFERENCE_EXCEPTIONS[file]);
  const closure = requireClosure([...new Set(binEntries), ...commandModules, ...BY_NAME_RUNTIME, ...documentedApis]
    .filter(file => /\.(c|m)?js$/.test(file)));
  const { getWorkflowRuntimeAssets } = require('../lib/commands/setup');
  const copiedAssets = getWorkflowRuntimeAssets();
  const dataTrees = [
    ...trackedUnder('skills', 'rules', '.forge/hooks', '.claude/scripts', 'lib/agents')
      .filter(file => file !== 'lib/agents/README.md'),
    ...contractBaselineData(),
  ];

  const expectedRuntime = new Set([...closure, ...copiedAssets, ...dataTrees, ...BY_NAME_RUNTIME, ...documentedApis]);

  it('ships every lib/ or scripts/ path the consumer docs point at', () => {
    const missing = documentedApis
      .filter(file => !packed.has(file))
      .map(file => `${file} <- ${documented.get(file)}`);
    expect(missing).toEqual([]);
  });

  it('keeps every doc-reference exception a path the docs still name', () => {
    const stale = Object.keys(DOC_REFERENCE_EXCEPTIONS).filter(file => !documented.has(file));
    expect(stale).toEqual([]);
  });

  it('ships every file the runtime loads, executes, copies or reads', () => {
    const missing = [...expectedRuntime].filter(file => !packed.has(file)).sort();
    expect(missing).toEqual([]);
  });

  it('ships nothing the runtime does not need', () => {
    const unexplained = [...packed]
      .filter(file => !expectedRuntime.has(file))
      .sort();
    expect(unexplained).toEqual([]);
  });

  it('ships each building block exactly once, as a lib/ module with no nested packages', () => {
    for (const entry of BLOCK_ENTRIES) expect(packed.has(entry)).toBe(true);
    const contractCopies = [...packed].filter(file => file.endsWith('contracts/src/validate.js'));
    expect(contractCopies).toEqual(['lib/contracts/src/validate.js']);
    const nested = [...packed].filter(file => file.includes('node_modules/') || file.startsWith('packages/'));
    expect(nested).toEqual([]);
    expect(pack.bundled || []).toEqual([]);
  });

  it('keeps repo-only tooling, docs and dead code out of the tarball', () => {
    const leaked = MUST_NOT_SHIP.filter(file => packed.has(file));
    expect(leaked).toEqual([]);
  });

  it('ships no tests or non-runtime docs', () => {
    const leaked = [...packed].filter(file =>
      /\.test\.(js|mjs|sh)$/.test(file)
      || (file.startsWith('docs/') && !RUNTIME_DOCS.has(file))
    );
    expect(leaked).toEqual([]);
  });

  it('keeps every MUST_NOT_SHIP path in the repo (moved out, not deleted)', () => {
    const gone = MUST_NOT_SHIP.filter(file => !fs.existsSync(path.join(ROOT, file)));
    expect(gone).toEqual([]);
  });
});
