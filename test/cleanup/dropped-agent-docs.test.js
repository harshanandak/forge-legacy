const { describe, test, expect } = require('bun:test');
const { readFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

/**
 * Test: Dropped-agent references are removed from docs.
 *
 * Scans doc files for references to dropped agents/tools:
 *   antigravity, windsurf, windsurfrules, .agent/, GEMINI.md, /research <slug>
 *
 * Allowed exceptions:
 *   - CHANGELOG.md (historical)
 *   - docs/work/ before 2026-05-01 (historical design docs)
 *   - research records listed in RESEARCH_RECORDS: they survey other harnesses and
 *     tools by name as evidence, which is not a claim that Forge supports them
 */

const ROOT = join(__dirname, '..', '..');

// Patterns to detect dropped-agent references
const PATTERNS = [
  { regex: /antigravity/i, label: 'antigravity' },
  { regex: /windsurf/i, label: 'windsurf' },
  { regex: /windsurfrules/i, label: 'windsurfrules' },
  { regex: /\.agent\//i, label: '.agent/' },
  { regex: /GEMINI\.md/i, label: 'GEMINI.md' },
  // Match /research as a command — followed by space or backtick (but not the word "research" in prose)
  { regex: /\/research[\s`]/i, label: '/research command' },
  // Aider references (dropped agent)
  { regex: /\baider\b/i, label: 'aider' },
  // Continue agent references — match ".continue/" dir or "Continue" as agent name in lists
  // (not the English word "continue" in prose)
  { regex: /\.continue\//i, label: '.continue/' },
];

function discoverMarkdownFiles(dir, prefix = '') {
  const rootDir = join(ROOT, dir, prefix);
  if (!existsSync(rootDir)) {
    return [];
  }

  return readdirSync(rootDir).flatMap((entry) => {
    const relPath = join(dir, prefix, entry);
    const filePath = join(ROOT, relPath);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      return discoverMarkdownFiles(dir, join(prefix, entry));
    }
    return entry.endsWith('.md') ? [relPath.replace(/\\/g, '/')] : [];
  });
}

const ACTIVE_WORK_DOC_START = '2026-05-01';

const RESEARCH_RECORDS = [
  'docs/work/2026-09-30-forge-final-plan/',
  'docs/work/2026-10-16-platform-rebuild/',
];

function isCurrentOrFutureWorkDoc(relPath) {
  const match = /^docs\/work\/(\d{4}-\d{2}-\d{2})-/.exec(relPath);
  return Boolean(match) && match[1] >= ACTIVE_WORK_DOC_START;
}

function isResearchRecord(relPath) {
  return RESEARCH_RECORDS.some((prefix) => relPath.startsWith(prefix));
}

const DOC_FILES = [
  ...discoverMarkdownFiles('docs/work')
    .filter((relPath) => isCurrentOrFutureWorkDoc(relPath) && !isResearchRecord(relPath)),
  'docs/reference/EXAMPLES.md',
  'docs/reference/TOOLCHAIN.md',
  'docs/guides/AGENT_INSTALL_PROMPT.md',
  'docs/reference/agent-permissions.md',
  'docs/reference/dependency-chain.md',
  'docs/reference/test-environment.md',
  'TROUBLESHOOTING.md',
  'lib/agents/README.md',
];

describe('dropped-agent references in docs', () => {
  for (const relPath of DOC_FILES) {
    const filePath = join(ROOT, relPath);

    test(`${relPath} has no dropped-agent references`, () => {
      expect(existsSync(filePath)).toBe(true);

      const content = readFileSync(filePath, 'utf-8');

      for (const { regex, label } of PATTERNS) {
        const matches = content.match(new RegExp(regex.source, 'gi'));
        if (matches) {
          // Build a helpful error message showing which lines matched
          const lines = content.split('\n');
          const matchingLines = [];
          for (let i = 0; i < lines.length; i++) {
            if (regex.test(lines[i])) {
              matchingLines.push(`  L${i + 1}: ${lines[i].trim()}`);
            }
          }
          throw new Error(
            `Found '${label}' in ${relPath} (${matches.length} match(es)):\n${matchingLines.join('\n')}`
          );
        }
      }
    });
  }
});
