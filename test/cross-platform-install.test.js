const { describe, test, expect } = require('bun:test');
const fs = require('node:fs');
const path = require('node:path');

const forgePath = path.join(__dirname, '..', 'bin', 'forge.js');
const mcpPath = path.join(__dirname, '..', '.mcp.json.example');

const forgeSource = fs.readFileSync(forgePath, 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// forge-k6p: autoInstallLefthook must use PKG_MANAGER, not hardcoded bun
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-k6p: autoInstallLefthook cross-platform', () => {
  test('should NOT hardcode bun in autoInstallLefthook', () => {
    // The old broken code: execFileSync('bun', ['add', '-d', 'lefthook'])
    expect(!forgeSource.includes("execFileSync('bun', ['add', '-d', 'lefthook']")).toBeTruthy();
  });

  test('should use PKG_MANAGER in autoInstallLefthook', () => {
    // Find the autoInstallLefthook function body
    const fnStart = forgeSource.indexOf('function autoInstallLefthook()');
    const fnEnd = forgeSource.indexOf('\n}', fnStart) + 2;
    const fnBody = forgeSource.slice(fnStart, fnEnd);

    expect(fnBody.includes('PKG_MANAGER')).toBeTruthy();
  });

  test('should have correct install flags per package manager in autoInstallLefthook', () => {
    const fnStart = forgeSource.indexOf('function autoInstallLefthook()');
    const fnEnd = forgeSource.indexOf('\n}', fnStart) + 2;
    const fnBody = forgeSource.slice(fnStart, fnEnd);

    // Must handle bun/pnpm 'add' vs npm/yarn 'install'
    expect(fnBody.includes("'add'") || fnBody.includes('"add"')).toBeTruthy();
    expect(fnBody.includes("'install'") || fnBody.includes('"install"')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-63c: Windows Beads install must use PowerShell, not npm
// ─────────────────────────────────────────────────────────────────────────────
describe('Beads install surfaces stay removed', () => {
  test('the CLI no longer installs or initializes Beads', () => {
    for (const symbol of [
      'autoSetupBeadsInQuickMode',
      'installBeadsWithMethod',
      'installBeadsOnWindows',
      'BEADS_INSTALL_PS1_URL',
      '@beads/bd',
    ]) {
      expect(forgeSource).not.toContain(symbol);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-jxb: Error messages must use PKG_MANAGER not hardcoded bun
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-jxb: Error messages use PKG_MANAGER', () => {

  test('lefthook install message should not hardcode bun add -d', () => {
    expect(!forgeSource.includes("'  Run manually: bun add -d lefthook'")).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-92t: Skills should show message when not installed
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-92t: Skills should show message when not installed', () => {
  test('autoSetupToolsInQuickMode should log when Skills is not installed', () => {
    const fnStart = forgeSource.indexOf('function autoSetupToolsInQuickMode()');
    const fnEnd = forgeSource.indexOf('\n}', fnStart) + 2;
    const fnBody = forgeSource.slice(fnStart, fnEnd);

    expect(fnBody.includes('skills') || fnBody.includes('Skills')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-4zz: Post-install verification for Beads
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-4zz: Post-install verification', () => {
  test('should no longer probe bd after install — the kernel store needs no CLI', () => {
    expect(forgeSource).not.toContain("'bd', ['version']");
    expect(forgeSource).not.toContain('bd version');
    expect(forgeSource).not.toContain('verifyBeadsInstall');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-0xb: lefthook.yml must use npx, not bunx
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// forge-cvr: pre-push hooks must not use bash-only syntax
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-cvr: pre-push hooks cross-platform', () => {
  test('scripts/lint.js should exist for cross-platform lint', () => {
    const lintScriptPath = path.join(__dirname, '..', 'scripts', 'lint.js');
    expect(fs.existsSync(lintScriptPath)).toBeTruthy();
  });

  test('scripts/test.js should exist for cross-platform test runner', () => {
    const testScriptPath = path.join(__dirname, '..', 'scripts', 'test.js');
    expect(fs.existsSync(testScriptPath)).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// forge-6q4: MCP server versions must be pinned
// ─────────────────────────────────────────────────────────────────────────────
describe('forge-6q4: MCP server versions pinned', () => {
  test('.mcp.json.example should not use @latest for context7', () => {
    const mcpSource = fs.readFileSync(mcpPath, 'utf8');
    expect(!mcpSource.includes('@upstash/context7-mcp@latest')).toBeTruthy();
  });

  test('.mcp.json.example context7 should have pinned version', () => {
    const mcpSource = fs.readFileSync(mcpPath, 'utf8');
    expect(mcpSource.includes('context7-mcp@') && !mcpSource.includes('@latest')).toBeTruthy();
  });
});
