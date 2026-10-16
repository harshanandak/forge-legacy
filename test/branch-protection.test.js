const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { describe, test, expect } = require('bun:test');
const { spawnSync } = require('node:child_process');

const isWindows = process.platform === 'win32';

/**
 * Create a Node.js-based mock git executable.
 * Works cross-platform: creates a node script + launcher (shell/.cmd).
 */
function createMockGit(mockDir, { diffOutput = '', diffExitCode = 0, upstreamExitCode = 0, branchName = 'master' }) {
  if (!Number.isInteger(diffExitCode) || !Number.isInteger(upstreamExitCode)) {
    throw new TypeError('Exit codes must be integers');
  }
  fs.mkdirSync(mockDir, { recursive: true });

  // Node.js script that emulates git behavior
  const diffFiles = JSON.stringify(diffOutput.split('\n').filter(Boolean));
  const safeBranch = JSON.stringify(branchName);
  const nodeScript = `
const args = process.argv.slice(2).join(' ');
if (args.includes('rev-parse') && args.includes('@{u}')) {
  if (${upstreamExitCode} !== 0) { process.stderr.write('error\\n'); process.exit(${upstreamExitCode}); }
  process.stdout.write('origin/master\\n');
  process.exit(0);
}
if (args.includes('rev-parse') && args.includes('--abbrev-ref')) {
  process.stdout.write(${safeBranch} + '\\n');
  process.exit(0);
}
if (args.includes('diff') && args.includes('--name-only')) {
  if (${diffExitCode} !== 0) { process.stderr.write('error\\n'); process.exit(${diffExitCode}); }
  ${diffFiles}.forEach(f => process.stdout.write(f + '\\n'));
  process.exit(0);
}
process.stdout.write(${safeBranch} + '\\n');
process.exit(0);
`;
  fs.writeFileSync(path.join(mockDir, 'mock-git.js'), nodeScript);

  // Optional wrappers for manual PATH-based debugging; tests use FORGE_GIT_MOCK_JS instead.
  if (isWindows) {
    fs.writeFileSync(
      path.join(mockDir, 'git.cmd'),
      `@node "${path.join(mockDir, 'mock-git.js')}" %*\r\n`
    );
  } else {
    const wrapper = `#!/bin/sh\nexec node "${path.join(mockDir, 'mock-git.js')}" "$@"\n`;
    fs.writeFileSync(path.join(mockDir, 'git'), wrapper, { mode: 0o755 });
  }
}

/**
 * Run branch-protection.js with mock-git.js (no shell, no git.exe shim on Windows).
 */
function runWithMockGit(scriptPath, mockDir, branch) {
  const mockJs = path.join(mockDir, 'mock-git.js');
  return spawnSync('node', [scriptPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    env: {
      ...process.env,
      LEFTHOOK_GIT_BRANCH: branch,
      FORGE_GIT_MOCK_JS: mockJs,
      NODE_ENV: 'test'
    }
  });
}

describe('scripts/branch-protection.js', () => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'branch-protection.js');

  describe('Script existence and cross-platform compatibility', () => {
    test('should exist', () => {
      expect(fs.existsSync(scriptPath)).toBeTruthy();
    });

    test('should be a Node.js script (not shell script)', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      const firstLine = content.split('\n')[0];
      expect(firstLine.includes('#!/usr/bin/env node') || !firstLine.startsWith('#!')).toBeTruthy();
    });

    test('should be executable via node command', () => {
      const result = spawnSync('node', [scriptPath, '--help'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
      expect(result.status === 0 || result.status === 1).toBeTruthy();
    });
  });

  describe('Branch protection logic', () => {
    test('should detect protected branch names', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('main') && content.includes('master')).toBeTruthy();
    });

    test('should use environment variable for current branch', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('process.env') || content.includes('git')).toBeTruthy();
    });

    test('should provide clear error message', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('console.error') || content.includes('stderr')).toBeTruthy();
      expect(content.toLowerCase().includes('protected') || content.toLowerCase().includes('forbidden')).toBeTruthy();
    });
  });

  describe('Exit codes', () => {
    test('should exit with code 1 when blocking push', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('process.exit(1)') || content.includes('exit(1)')).toBeTruthy();
    });

    test('should exit with code 0 when allowing push', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('process.exit(0)') || content.includes('exit(0)') || !content.includes('process.exit')).toBeTruthy();
    });
  });

  describe('Cross-platform execution', () => {
    test('should work on Windows (current platform)', () => {
      if (process.platform !== 'win32') {
        return;
      }
      const result = spawnSync('node', [scriptPath], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
        env: {
          ...process.env,
          LEFTHOOK_GIT_BRANCH: 'feature/test-branch'
        }
      });
      expect(result.status === 0 || result.status === 1).toBeTruthy();
    });

    test('should not use shell-specific syntax', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      const bashPatterns = [
        { pattern: /\[\[.*\]\]/g, name: 'Bash [[ test ]]' },
        { pattern: /if\s+\[/g, name: 'Bash [ test ]' },
        { pattern: /\bthen\b/g, name: 'Bash then keyword' },
        { pattern: /\bfi\b/g, name: 'Bash fi keyword' }
      ];
      for (const { pattern } of bashPatterns) {
        const match = content.match(pattern);
        expect(!match).toBeTruthy();
      }
      expect(content.includes('process.env')).toBeTruthy();
      expect(content.includes('require(')).toBeTruthy();
    });
  });

  describe('Protected branch metadata push handling', () => {
    test('should use execFileSync (not execSync) to prevent command injection', () => {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.includes('execFileSync')).toBeTruthy();
      expect(content.includes("execSync(`git")).toBeFalsy();
    });

    test('should allow push on feature branch (non-protected)', () => {
      const result = spawnSync('node', [scriptPath], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
        env: {
          ...process.env,
          LEFTHOOK_GIT_BRANCH: 'feat/some-feature'
        }
      });
      expect(result.status).toBe(0);
    });

    test('should allow push on feature branch via git exec path (no LEFTHOOK_GIT_BRANCH)', () => {
      const mockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-mock-git-branch-'));
      try {
        createMockGit(mockDir, { diffOutput: '', branchName: 'feat/some-feature' });
        const mockJs = path.join(mockDir, 'mock-git.js');
        const result = spawnSync('node', [scriptPath], {
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe',
          env: {
            ...process.env,
            FORGE_GIT_MOCK_JS: mockJs,
            NODE_ENV: 'test'
            // No LEFTHOOK_GIT_BRANCH — forces the execGit path
          }
        });
        expect(result.status).toBe(0);
      } finally {
        fs.rmSync(mockDir, { recursive: true, force: true });
      }
    });

    test('should block push to master with non-beads files', () => {
      const mockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-mock-git-code-'));
      try {
        createMockGit(mockDir, { diffOutput: 'src/index.js' });
        const result = runWithMockGit(scriptPath, mockDir, 'master');
        expect(result.status).toBe(1);
      } finally {
        fs.rmSync(mockDir, { recursive: true, force: true });
      }
    });

    test('should block push to master with beads-only files', () => {
      const mockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-mock-git-beads-'));
      try {
        createMockGit(mockDir, { diffOutput: '.beads/issues.jsonl' });
        const result = runWithMockGit(scriptPath, mockDir, 'master');
        expect(result.status).toBe(1);
        const stderr = result.stderr.toString();
        expect(stderr.includes('Beads metadata is local runtime state')).toBeTruthy();
      } finally {
        fs.rmSync(mockDir, { recursive: true, force: true });
      }
    });

    test('should block push to master with mixed beads + code files', () => {
      const mockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-mock-git-mixed-'));
      try {
        createMockGit(mockDir, { diffOutput: '.beads/issues.jsonl\nsrc/index.js' });
        const result = runWithMockGit(scriptPath, mockDir, 'master');
        expect(result.status).toBe(1);
      } finally {
        fs.rmSync(mockDir, { recursive: true, force: true });
      }
    });

    test('should warn and block when git diff fails', () => {
      const mockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-mock-git-fail-'));
      try {
        createMockGit(mockDir, { diffExitCode: 1, upstreamExitCode: 1 });
        const result = runWithMockGit(scriptPath, mockDir, 'master');
        expect(result.status).toBe(1);
        const stderr = result.stderr.toString();
        expect(stderr.includes('could not detect beads-only')).toBeTruthy();
      } finally {
        fs.rmSync(mockDir, { recursive: true, force: true });
      }
    });
  });


});
