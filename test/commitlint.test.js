const fs = require('node:fs');
const path = require('node:path');
const { describe, test, expect } = require('bun:test');


describe('Commitlint configuration', () => {
  const configPath = path.join(__dirname, '..', '.commitlintrc.json');
  const packagePath = path.join(__dirname, '..', 'package.json');

  describe('Configuration file', () => {
    test('should exist', () => {
      expect(fs.existsSync(configPath)).toBeTruthy();
    });

    test('should be valid JSON', () => {
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(() => {
        JSON.parse(content);
      }).not.toThrow();
    });

    test('should extend conventional config', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // Should extend @commitlint/config-conventional
      expect(config.extends).toBeTruthy();
      expect(Array.isArray(config.extends) ? config.extends.includes('@commitlint/config-conventional') : config.extends === '@commitlint/config-conventional').toBeTruthy();
    });

    test('should have rules configured', () => {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // Should have rules object
      expect(config.rules || config.extends).toBeTruthy();
    });
  });

  describe('Package dependencies', () => {
    test('should have commitlint dependencies', () => {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

      // Should have @commitlint/cli and @commitlint/config-conventional
      const hasCliDep = pkg.dependencies?.['@commitlint/cli'] || pkg.devDependencies?.['@commitlint/cli'];
      const hasConfigDep = pkg.dependencies?.['@commitlint/config-conventional'] || pkg.devDependencies?.['@commitlint/config-conventional'];

      expect(hasCliDep).toBeTruthy();
      expect(hasConfigDep).toBeTruthy();
    });
  });

  describe('Conventional commit types', () => {
    test('should support standard types', () => {
      // This test validates that the config supports standard conventional commit types
      // Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // If using conventional config, these types are automatically supported
      const extendsConventional = Array.isArray(config.extends)
        ? config.extends.includes('@commitlint/config-conventional')
        : config.extends === '@commitlint/config-conventional';

      expect(extendsConventional).toBeTruthy();
    });
  });
});
