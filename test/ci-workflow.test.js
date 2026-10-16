const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');
const { describe, test, expect } = require('bun:test');
const YAML = require('yaml');

const bashExecutable = process.platform === 'win32'
  ? path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Git', 'bin', 'bash.exe')
  : 'bash';

// GitHub Actions runs every `shell: bash` step as
// `bash --noprofile --norc -eo pipefail {0}`: errexit is ON even when the script
// only says `set -uo pipefail`. Execute step scripts exactly that way.
function runGithubBashStep(script, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-step-'));
  try {
    const file = path.join(dir, 'step.sh');
    fs.writeFileSync(file, script);
    return spawnSync(bashExecutable, ['--noprofile', '--norc', '-eo', 'pipefail', file.replace(/\\/g, '/')], { encoding: 'utf8', ...options });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('CI Workflow Configuration', () => {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'test.yml');
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8').replace(/\r\n/g, '\n');
  const synchronizeSkipCondition = "github.event_name != 'pull_request' || github.event.action != 'synchronize'";
  const prNonSynchronizeCondition = "github.event_name == 'pull_request' && github.event.action != 'synchronize'";

  const { jobs, on: triggers } = YAML.parse(workflowContent);

  function expectSection(sectionName) {
    expect(workflowContent.includes(`${sectionName}:`)).toBe(true);
  }

  describe('Concurrency', () => {
    test('workflow cancels older in-progress runs for the same PR or ref', () => {
      expect(workflowContent.includes('concurrency:')).toBe(true);
      expect(workflowContent.includes('group: tests-${{ github.event.pull_request.number || github.ref }}')).toBe(true);
      expect(workflowContent.includes('cancel-in-progress: true')).toBe(true);
    });
  });

  describe('Follow-up PR Pushes', () => {
    test('followup-tests job exists for all pull request events', () => {
      expectSection('followup-tests');
      expect(jobs['followup-tests'].if)
        .toBe("${{ github.event_name == 'pull_request' && needs.changes.outputs.tests_relevant == 'true' }}");
    });

    test('followup-tests covers the Windows Node 24 lane before merge', () => {
      expect(workflowContent.includes('name: Targeted PR Tests (${{ matrix.label }})')).toBe(true);
      expect(workflowContent.includes('os: windows-latest')).toBe(true);
      const windowsLane = jobs['followup-tests'].strategy.matrix.include.find((entry) => entry.os === 'windows-latest');
      expect(windowsLane).toEqual({ os: 'windows-latest', 'node-version': 24, label: 'windows-node24' });
      expect(workflowContent.includes('label: windows-node24')).toBe(true);
      expect(workflowContent.includes('windows-node22')).toBe(false);
    });

    test('no workflow lane pins Node 22', () => {
      expect(workflowContent).not.toMatch(/node-version:[^\n]*\b22\b/);
      expect(workflowContent).not.toMatch(/node22/);
    });

    test('followup-tests resolves affected targets through the shared execution planner', () => {
      expect(workflowContent.includes('name: Resolve affected test targets')).toBe(true);
      expect(workflowContent.includes('buildTestExecutionPlan')).toBe(true);
      expect(workflowContent.includes("const effectiveMode = plan.mode === 'targeted' && plan.testTargets.length === 0")).toBe(true);
      expect(workflowContent.includes('run_workflow_tests=${plan.runWorkflowTests}')).toBe(true);
      expect(workflowContent.includes('mode=${effectiveMode}')).toBe(true);
    });

    // A `mode=full` fallback means the whole unit suite has to run on this lane.
    // Running it as one raw `bun test test/` puts every subprocess-heavy file into
    // a single long-lived bun process with no resource-lane separation and no
    // worker budget. The Windows lane died there (run 32925444514) on a spawn that
    // failed 5ms in, while the full matrix — which routes the same files through
    // scripts/test-full-suite.js — passed at that same SHA. The fallback has to use
    // the same lane-aware runner, so assert it instead of trusting habit.
    test('full-suite fallback routes through the lane-aware runner, not a raw whole-directory bun test', () => {
      const lines = workflowContent.split('\n');
      const stepIndex = lines.findIndex((line) => line.includes('name: Run single-platform unit suite fallback'));
      expect(stepIndex).toBeGreaterThan(-1);
      const stepBody = lines.slice(stepIndex, stepIndex + 4).join('\n');

      expect(stepBody.includes('node scripts/test-full-suite.js')).toBe(true);
      expect(/bun test[^\n]*[ '"]test\//.test(stepBody)).toBe(false);
    });

    test('followup-tests still runs targeted, fallback, and edge-case steps', () => {
      expect(workflowContent.includes('name: Run targeted unit tests')).toBe(true);
      expect(workflowContent.includes('name: Run single-platform unit suite fallback')).toBe(true);
      expect(workflowContent.includes('name: Run affected edge-case tests')).toBe(true);
    });

    // The dedicated E2E job runs test/e2e/ on ubuntu only. A PR touching only
    // test/e2e/** is not OS-sensitive, so the Full Matrix skips and the Windows
    // follow-up lane is the only Windows e2e coverage. The ubuntu follow-up lane
    // must not repeat the dedicated job.
    test('affected e2e runs on the Windows follow-up lane only', () => {
      const followup = jobs['followup-tests'];
      const e2eSteps = followup.steps.filter((step) => step.name === 'Run affected e2e tests');
      expect(e2eSteps).toHaveLength(1);
      expect(e2eSteps[0].if).toBe("matrix.os == 'windows-latest' && steps.affected.outputs.run_e2e == 'true' && needs.changes.outputs.os_sensitive != 'true'");
      expect(e2eSteps[0].run).toBe('bun test --timeout 15000 test/e2e/ --reporter=junit --reporter-outfile test-results/followup-e2e.xml');
      const windowsEntries = followup.strategy.matrix.include.filter((entry) => entry.os === 'windows-latest');
      expect(windowsEntries.map((entry) => entry.label)).toEqual(['windows-node24']);
      expect(followup.strategy.matrix.include.some((entry) => entry.os === 'ubuntu-latest')).toBe(true);
      const resolve = followup.steps.find((step) => step.name === 'Resolve affected test targets').run;
      expect(resolve).toContain('`run_e2e=${plan.runE2E}`,');
      expect(jobs.e2e.name).toBe('E2E Tests');
      expect(jobs.e2e['runs-on']).toBe('ubuntu-latest');
      expect(jobs['ci-gate'].needs).toContain('e2e');
    });

    test('Windows follow-up e2e runs for e2e-only changes but not alongside the full matrix', () => {
      const followup = jobs['followup-tests'];
      const condition = followup.steps.find((step) => step.name === 'Run affected e2e tests').if;
      for (const [osSensitive, runE2E, expected] of [
        ['false', 'true', true],
        ['true', 'true', false],
        ['false', 'false', false],
      ]) {
        expect(vm.runInNewContext(condition, {
          matrix: { os: 'windows-latest' },
          steps: { affected: { outputs: { run_e2e: runE2E } } },
          needs: { changes: { outputs: { os_sensitive: osSensitive } } },
        })).toBe(expected);
      }
      expect(condition).toContain("needs.changes.outputs.os_sensitive != 'true'");
    });

    // When the classifier demands the full matrix, the same full suite already runs
    // on the identical ubuntu/Node 24 and windows/Node 24 environments, so the
    // single-platform fallback would only repeat it.
    test('single-platform fallback runs only when the full matrix does not', () => {
      const followup = jobs['followup-tests'];
      expect(followup.needs).toEqual(['changes']);
      const fallback = followup.steps.find((step) => step.name === 'Run single-platform unit suite fallback');
      expect(fallback.if).toBe("steps.affected.outputs.mode == 'full' && needs.changes.outputs.os_sensitive != 'true'");
      const edgeCases = followup.steps.find((step) => step.name === 'Run affected edge-case tests');
      expect(edgeCases.if).toBe("steps.affected.outputs.run_test_env == 'true'");
    });

    test('affected edge-case failures reach the required CI Gate', () => {
      const lines = workflowContent.split('\n');
      const stepIndex = lines.findIndex((line) => line.includes('name: Run affected edge-case tests'));
      const nextStepIndex = lines.findIndex((line, index) => index > stepIndex && line.includes('name: Build followup profile'));
      expect(stepIndex).toBeGreaterThan(-1);
      expect(nextStepIndex).toBeGreaterThan(stepIndex);
      const stepBody = lines.slice(stepIndex, nextStepIndex).map((line) => line.trim());

      expect(stepBody).toContain("if: steps.affected.outputs.run_test_env == 'true'");
      const runLine = stepBody.find((line) => line.startsWith('run: '));
      expect(runLine).toBe('run: bun test --timeout 15000 test-env/');
      const [executable, ...args] = runLine.slice('run: '.length).split(' ');
      expect(executable).toBe('bun');

      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-edge-failure-'));
      try {
        const testEnv = path.join(root, 'test-env');
        fs.mkdirSync(testEnv);
        fs.writeFileSync(path.join(testEnv, 'failing.test.js'), [
          "const { expect, test } = require('bun:test');",
          "test('deliberate CI failure', () => expect('failure').toBe('success'));",
          '',
        ].join('\n'));
        const child = spawnSync(process.execPath, args, {
          cwd: root,
          encoding: 'utf8',
          timeout: 10_000,
        });

        expect(child.error).toBeUndefined();
        expect(child.signal).toBeNull();
        expect(child.status).toBe(1);
        expect(`${child.stdout}${child.stderr}`).toContain('deliberate CI failure');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }

      const aggregateIndex = lines.findIndex((line) => line.includes('name: Aggregate lane results'));
      const runIndex = lines.findIndex((line, index) => index > aggregateIndex && line.trim() === 'run: |');
      expect(aggregateIndex).toBeGreaterThan(-1);
      expect(runIndex).toBeGreaterThan(aggregateIndex);
      let scriptEnd = runIndex + 1;
      while (scriptEnd < lines.length && (lines[scriptEnd].startsWith('          ') || lines[scriptEnd] === '')) {
        scriptEnd += 1;
      }
      const aggregateScript = lines.slice(runIndex + 1, scriptEnd)
        .map((line) => line.slice(10))
        .join('\n');
      const gate = runGithubBashStep(aggregateScript, {
        env: { ...process.env, RESULTS: 'followup-tests=failure\n' },
      });

      expect(gate.error).toBeUndefined();
      expect(gate.status).toBe(1);
      expect(`${gate.stdout}${gate.stderr}`).toContain("Lane 'followup-tests' finished as 'failure'");
    }, 15_000);
  });

  describe('Fast PR Lane', () => {
    test('fast PR lane uses four ubuntu shards', () => {
      expectSection('unit-shard');
      expect(workflowContent.includes('runs-on: ubuntu-latest')).toBe(true);
      expect(workflowContent.includes('shard-index: [0, 1, 2, 3]')).toBe(true);
    });

    test('fast PR lane keeps platform smoke tests on Node 24 only', () => {
      expectSection('windows-smoke');
      expect(workflowContent.includes('runs-on: windows-latest')).toBe(true);
      expectSection('macos-smoke');
      expect(workflowContent.includes('runs-on: macos-latest')).toBe(true);
      expect(workflowContent.includes('node-version: 24')).toBe(true);
    });

    test('coverage and e2e stay single-platform', () => {
      expectSection('coverage');
      expectSection('e2e');
      expect(workflowContent.includes('name: Code Coverage')).toBe(true);
      expect(workflowContent.includes('name: E2E Tests')).toBe(true);
    });
  });

  describe('Confidence Lane', () => {
    test('full matrix job is gated on the changed-path classifier, not skipped outright', () => {
      expectSection('full-matrix');
      expect(workflowContent.includes("full-matrix:\n    name: Full Matrix")).toBe(true);
      // The matrix is the slowest lane in the pipeline (Windows median ~11.5 min vs
      // ~2.2 min on ubuntu) and ran on 100% of PRs. It is now conditioned on the
      // `changes` classifier, which returns true for every non-pull_request event —
      // so push to master, merge_group, schedule and workflow_dispatch still run the
      // full 3-OS x 2-Node matrix unconditionally.
      expect(jobs['full-matrix'].needs).toEqual(['changes']);
      expect(jobs['full-matrix'].if)
        .toBe("${{ needs.changes.outputs.tests_relevant == 'true' && needs.changes.outputs.os_sensitive == 'true' }}");
      expect(workflowContent.includes('os: [ubuntu-latest, macos-latest, windows-latest]')).toBe(true);
      expect(jobs['full-matrix'].strategy.matrix['node-version']).toEqual([24, 26]);
      expect(workflowContent.includes('node-version: [24, 26]')).toBe(true);
      expect(workflowContent.includes('node-version: [22, 24]')).toBe(false);
    });

    test('full matrix uses the resource-aware suite runner', () => {
      const start = workflowContent.indexOf('  full-matrix:');
      const end = workflowContent.indexOf('  unit-shard:');
      const fullMatrix = workflowContent.slice(start, end);

      expect(fullMatrix).toContain('node scripts/test-full-suite.js --timeout 15000 --label-prefix full-matrix-${{ matrix.os }}-node${{ matrix.node-version }}');
      expect(fullMatrix).not.toContain('bun test --timeout 15000 test/');
    });

    test('changes classifier always demands the full matrix off pull requests', () => {
      expectSection('changes');
      expect(workflowContent.includes('os_sensitive: ${{ steps.filter.outputs.os_sensitive }}')).toBe(true);
      expect(workflowContent.includes('if [ "$EVENT_NAME" != "pull_request" ]; then')).toBe(true);
      // A diff that cannot be resolved must fail safe to the expensive lane.
      expect(workflowContent.includes('failing safe to the full matrix')).toBe(true);
    });

    test('cross-OS smoke still covers every pull request', () => {
      // The lanes that keep Windows/macOS signal on PRs where the matrix is skipped.
      for (const lane of ['windows-smoke', 'macos-smoke']) {
        expect(jobs[lane].if).toBe("${{ github.event_name == 'pull_request' && needs.changes.outputs.tests_relevant == 'true' }}");
      }
      expect(workflowContent.includes('label: windows-node24')).toBe(true);
    });

    test('Bun test commands use the repo timeout in CI', () => {
      const directBunTestCommands = workflowContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('run: bun test ') || line.startsWith('bun test '));

      expect(directBunTestCommands.length).toBeGreaterThan(0);
      for (const command of directBunTestCommands) {
        expect(command).toContain('--timeout 15000');
      }
    });

    test('confidence lane carries no beads integration job', () => {
      expect(workflowContent.includes('beads-integration')).toBe(false);
      expect(workflowContent.includes('RUN_BEADS_INTEGRATION')).toBe(false);
      expect(workflowContent.includes('scripts/beads-context.test.js')).toBe(false);
    });
  });

  describe('Artifacts and Profiling', () => {
    test('test jobs upload artifacts and build profiles', () => {
      expect(workflowContent.includes('scripts/test-profile.js')).toBe(true);
      expect(workflowContent.includes('uses: actions/upload-artifact@v7')).toBe(true);
    });

    // The PR dashboard reads every uploaded test-artifacts-* bundle, so it must wait
    // for every lane that uploads one, and it must still run when a lane failed —
    // that is exactly when the dashboard is most useful.
    test('dashboard jobs depend on the appropriate upstream jobs', () => {
      expect(jobs['dashboard-pr'].needs).toEqual([
        'changes',
        'full-matrix',
        'unit-shard',
        'windows-smoke',
        'macos-smoke',
        'followup-tests',
        'coverage',
        'e2e',
      ]);
      expect(jobs['dashboard-pr'].if)
        .toBe("${{ always() && github.event_name == 'pull_request' && needs.changes.outputs.tests_relevant == 'true' }}");
      expect(jobs['dashboard-confidence'].needs).toEqual(['changes', 'full-matrix', 'coverage', 'e2e']);
    });

    test('dashboard jobs aggregate artifacts into test-dashboard.json', () => {
      expect(workflowContent.includes('uses: actions/download-artifact@v8')).toBe(true);
      expect(workflowContent.includes('scripts/test-dashboard.js')).toBe(true);
      expect(workflowContent.includes('path: test-dashboard.json')).toBe(true);
    });
  });

  describe('Mutation Testing Job', () => {
    test('mutation job remains manual or scheduled', () => {
      expectSection('mutation');
      expect(workflowContent.includes("if: github.event_name == 'workflow_dispatch' || github.event_name == 'schedule'")).toBe(true);
    });
  });

  describe('Trigger Layout', () => {
    test('broad PR jobs run on synchronize events', () => {
      const skipConditionOccurrences = workflowContent.split(synchronizeSkipCondition).length - 1;
      const prNonSynchronizeOccurrences = workflowContent.split(prNonSynchronizeCondition).length - 1;
      expect(skipConditionOccurrences).toBe(0);
      expect(prNonSynchronizeOccurrences).toBe(0);
    });

    test('workflow retains schedule and workflow_dispatch triggers', () => {
      expect(workflowContent.includes('workflow_dispatch:')).toBe(true);
      expect(workflowContent.includes('schedule:')).toBe(true);
    });

    test('workflow runs in the merge queue so skipped PR lanes are re-run before merge', () => {
      expect(workflowContent.includes('merge_group:')).toBe(true);
    });
  });

  describe('Aggregate Gate', () => {
    const gatedLanes = [
      'changes',
      'full-matrix',
      'unit-shard',
      'cross-os-gate',
      'followup-tests',
      'coverage',
      'e2e',
      'doc-assertions',
      'repository-outcomes',
    ];

    function extractRunScript(jobName, stepName) {
      const lines = workflowContent.split('\n');
      const jobIndex = lines.indexOf(`  ${jobName}:`);
      const stepIndex = lines.findIndex((line, index) => index > jobIndex && line.includes(`name: ${stepName}`));
      const runIndex = lines.findIndex((line, index) => index > stepIndex && line.trim() === 'run: |');
      expect(jobIndex).toBeGreaterThan(-1);
      expect(stepIndex).toBeGreaterThan(jobIndex);
      expect(runIndex).toBeGreaterThan(stepIndex);
      const indent = lines[runIndex].indexOf('run:') + 2;
      let end = runIndex + 1;
      while (end < lines.length && (lines[end].startsWith(' '.repeat(indent)) || lines[end] === '')) end += 1;
      return lines.slice(runIndex + 1, end).map((line) => line.slice(indent)).join('\n');
    }

    function runGate(results) {
      const script = extractRunScript('ci-gate', 'Aggregate lane results');
      const RESULTS = `${Object.entries(results).map(([lane, value]) => `${lane}=${value}`).join('\n')}\n`;
      return runGithubBashStep(script, { env: { ...process.env, RESULTS } });
    }

    const irrelevantPr = {
      changes: 'success:false',
      'full-matrix': 'skipped:true',
      'unit-shard': 'skipped:true',
      'cross-os-gate': 'success:false',
      'followup-tests': 'skipped:true',
      coverage: 'skipped:true',
      e2e: 'skipped:true',
      'doc-assertions': 'success:false',
    };

    test('ci-gate aggregates every real lane and keeps its required context name', () => {
      expect(jobs['ci-gate'].name).toBe('CI Gate');
      expect(jobs['ci-gate'].if).toBe('${{ always() }}');
      expect(jobs['ci-gate'].needs).toEqual(gatedLanes);
      for (const lane of gatedLanes) {
        expect(workflowContent.includes(`${lane}=\${{ needs.${lane}.result }}:`)).toBe(true);
      }
    });

    // Cross-OS Gate already needs and evaluates both smoke lanes with the same
    // skip rule, so CI Gate enforces them transitively through cross-os-gate.
    test('smoke lanes reach CI Gate transitively through Cross-OS Gate', () => {
      expect(jobs['ci-gate'].needs).not.toContain('windows-smoke');
      expect(jobs['ci-gate'].needs).not.toContain('macos-smoke');
      expect(jobs['cross-os-gate'].needs).toEqual(['changes', 'windows-smoke', 'macos-smoke']);
      expect(jobs['cross-os-gate'].if).toBe("${{ always() && github.event_name == 'pull_request' }}");
    });

    test('a lane skipped because the change is test-irrelevant passes the gate', () => {
      const gate = runGate(irrelevantPr);
      expect(`${gate.stdout}${gate.stderr}`).not.toContain('::error::');
      expect(gate.status).toBe(0);
    });

    test('a lane skipped without a legitimate reason fails the gate', () => {
      const gate = runGate({ ...irrelevantPr, changes: 'success:false', coverage: 'skipped:false' });
      expect(gate.status).toBe(1);
      expect(`${gate.stdout}${gate.stderr}`).toContain("Lane 'coverage' was skipped without a legitimate reason");
    });

    test('lanes skipped because the classifier failed still fail the gate', () => {
      // A failed classifier leaves its outputs empty; every downstream lane is then
      // skipped by GitHub, and none of those skips is justified.
      const gate = runGate({
        changes: 'failure:false',
        'full-matrix': 'skipped:false',
        'unit-shard': 'skipped:false',
        'cross-os-gate': 'failure:false',
        'followup-tests': 'skipped:false',
        coverage: 'skipped:false',
        e2e: 'skipped:false',
        'doc-assertions': 'skipped:false',
      });
      expect(gate.status).toBe(1);
      expect(`${gate.stdout}${gate.stderr}`).toContain("Lane 'changes' finished as 'failure'");
      expect(`${gate.stdout}${gate.stderr}`).toContain("Lane 'coverage' was skipped without a legitimate reason");
    });

    test('ci-gate computes each skip justification from the classifier, failing closed', () => {
      const gate = jobs['ci-gate'].steps.find((step) => step.name === 'Aggregate lane results');
      const results = gate.env.RESULTS;
      expect(results).toContain("changes=${{ needs.changes.result }}:false");
      expect(results).toContain("full-matrix=${{ needs.full-matrix.result }}:${{ needs.changes.outputs.tests_relevant == 'false' || needs.changes.outputs.os_sensitive == 'false' }}");
      expect(results).toContain("coverage=${{ needs.coverage.result }}:${{ needs.changes.outputs.tests_relevant == 'false' }}");
      expect(results).toContain("doc-assertions=${{ needs.doc-assertions.result }}:${{ github.event_name != 'pull_request' || needs.changes.outputs.tests_relevant == 'true' }}");
    });

    test('Cross-OS Gate tolerates skipped smoke lanes only for test-irrelevant changes', () => {
      const script = extractRunScript('cross-os-gate', 'Require Windows + macOS smoke to pass');
      expect(jobs['cross-os-gate'].steps[0].env).toEqual({
        WINDOWS_SMOKE: '${{ needs.windows-smoke.result }}',
        MACOS_SMOKE: '${{ needs.macos-smoke.result }}',
        TESTS_RELEVANT: '${{ needs.changes.outputs.tests_relevant }}',
      });
      const run = (env) => runGithubBashStep(script, { env: { ...process.env, ...env } });
      expect(run({ WINDOWS_SMOKE: 'skipped', MACOS_SMOKE: 'skipped', TESTS_RELEVANT: 'false' }).status).toBe(0);
      expect(run({ WINDOWS_SMOKE: 'success', MACOS_SMOKE: 'success', TESTS_RELEVANT: 'true' }).status).toBe(0);
      expect(run({ WINDOWS_SMOKE: 'skipped', MACOS_SMOKE: 'skipped', TESTS_RELEVANT: '' }).status).toBe(1);
      expect(run({ WINDOWS_SMOKE: 'skipped', MACOS_SMOKE: 'success', TESTS_RELEVANT: 'true' }).status).toBe(1);
      expect(run({ WINDOWS_SMOKE: 'failure', MACOS_SMOKE: 'success', TESTS_RELEVANT: 'true' }).status).toBe(1);
    });
  });

  describe('Single authoritative workflow', () => {
    const expensiveLanes = [
      'full-matrix',
      'unit-shard',
      'windows-smoke',
      'macos-smoke',
      'followup-tests',
      'coverage',
      'e2e',
      'dashboard-pr',
      'dashboard-confidence',
    ];

    test('Tests runs on every pull request: no top-level PR paths filter', () => {
      expect(triggers).toHaveProperty('pull_request');
      expect(triggers.pull_request.paths).toBeUndefined();
      expect(triggers.pull_request.types).toEqual(['opened', 'synchronize', 'reopened', 'ready_for_review']);
    });

    test('the classifier publishes tests_relevant and fails safe to true', () => {
      expect(jobs.changes.outputs.tests_relevant).toBe('${{ steps.filter.outputs.tests_relevant }}');
      const classify = jobs.changes.steps.find((step) => step.name === 'Classify diff').run;
      expect(classify.split('echo "tests_relevant=true" >> "$GITHUB_OUTPUT"').length - 1).toBeGreaterThanOrEqual(3);
      expect(classify).toContain('echo "tests_relevant=false" >> "$GITHUB_OUTPUT"');
    });

    // tests_relevant is decided by EXCLUSION: a PR is test-irrelevant only when
    // every changed path is documentation (docs/**, a root-level *.md, LICENSE).
    // Any other path, including ones no allowlist anticipated, runs the tests.
    const classifyScript = () => jobs.changes.steps.find((step) => step.name === 'Classify diff').run;
    const isDocsOnlyPath = (file) => file.startsWith('docs/')
      || (!file.includes('/') && file.endsWith('.md'))
      || file === 'LICENSE';

    function docsOnlyPattern() {
      const match = /docs_only_pattern='([^']+)'/.exec(classifyScript());
      expect(match).not.toBeNull();
      return new RegExp(match[1]);
    }

    function runClassifier(changedFiles, { gitFails = false, grepFails = false } = {}) {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-classify-'));
      try {
        const binDir = path.join(root, 'bin');
        fs.mkdirSync(binDir);
        const listing = path.join(root, 'changed.txt');
        fs.writeFileSync(listing, changedFiles.map((file) => `${file}\n`).join(''));
        const toPosix = (value) => value.replace(/\\/g, '/');
        const stub = gitFails
          ? '#!/usr/bin/env bash\nexit 128\n'
          : `#!/usr/bin/env bash\nwhile IFS= read -r line; do printf '%s\\n' "$line"; done < '${toPosix(listing)}'\n`;
        fs.writeFileSync(path.join(binDir, 'git'), stub);
        fs.chmodSync(path.join(binDir, 'git'), 0o755);
        if (grepFails) {
          // grep exit 2 = an error (bad pattern, I/O), not "no match".
          fs.writeFileSync(path.join(binDir, 'grep'), '#!/usr/bin/env bash\nexit 2\n');
          fs.chmodSync(path.join(binDir, 'grep'), 0o755);
        }
        const output = path.join(root, 'out.txt');
        fs.writeFileSync(output, '');
        const prelude = `export PATH="$(cygpath -u '${toPosix(binDir)}' 2>/dev/null || printf '%s' '${toPosix(binDir)}'):$PATH"`;
        const child = runGithubBashStep(`${prelude}\n${classifyScript()}`, {
          env: {
            ...process.env,
            EVENT_NAME: 'pull_request',
            BASE_SHA: 'base',
            HEAD_SHA: 'head',
            GITHUB_OUTPUT: output,
          },
        });
        expect(child.status).toBe(0);
        return Object.fromEntries(fs.readFileSync(output, 'utf8').trim().split('\n').map((line) => line.split('=')));
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }

    test('tests_relevant is false only for docs-only diffs and fails safe to true', () => {
      expect(runClassifier(['docs/INDEX.md', 'README.md', 'LICENSE']).tests_relevant).toBe('false');
      expect(runClassifier(['docs/INDEX.md', 'plugin/.claude-plugin/plugin.json']).tests_relevant).toBe('true');
      expect(runClassifier(['skills/plan/SKILL.md']).tests_relevant).toBe('true');
      expect(runClassifier([], { gitFails: true }).tests_relevant).toBe('true');
      // A successful diff that lists no paths is not proof of a docs-only PR.
      expect(runClassifier([]).tests_relevant).toBe('true');
    }, 30_000);

    // Each grep in the classifier returns 1 on an ordinary PR ("no match"), which
    // errexit would turn into a failed step unless the status is captured safely.
    test('the classifier handles every grep outcome under GitHub errexit bash', () => {
      expect(runClassifier(['docs/INDEX.md', 'README.md'])).toEqual({ tests_relevant: 'false', os_sensitive: 'false' });
      expect(runClassifier(['skills/plan/SKILL.md', 'lib/commands/status.js'])).toEqual({ tests_relevant: 'true', os_sensitive: 'false' });
      expect(runClassifier(['docs/INDEX.md', 'bin/forge.js'])).toEqual({ tests_relevant: 'true', os_sensitive: 'true' });
    }, 30_000);

    // Under `set -o pipefail`, `printf ... | grep -q` fails when grep exits on the
    // first match and printf dies of SIGPIPE, turning a code PR into "docs-only".
    // A code path first, then more than a 64 KiB pipe buffer of docs paths.
    test('large diffs led by a code path stay test-relevant and OS-sensitive under pipefail', () => {
      const docs = Array.from({ length: 5000 }, (_, index) => `docs/entry-${String(index).padStart(5, '0')}.md`);
      expect(docs.join('\n').length).toBeGreaterThan(64 * 1024);
      expect(runClassifier(['package.json', ...docs])).toEqual({ tests_relevant: 'true', os_sensitive: 'true' });
    }, 60_000);

    // Structural guard for the whole class: no producer may pipe into a consumer
    // that can exit early (grep -q/-m, head), because pipefail turns that into a
    // failed condition. Classify from a here-string instead.
    test('the classifier pipes nothing into an early-exiting consumer', () => {
      expect(classifyScript()).not.toMatch(/\|\s*(grep|head)\b/);
    });

    // A grep error (exit 2) is not "no match": both decisions fail closed.
    test('a classifier grep error fails safe to the full matrix', () => {
      expect(runClassifier(['docs/INDEX.md'], { grepFails: true })).toEqual({ tests_relevant: 'true', os_sensitive: 'true' });
    }, 30_000);

    // `git diff` reports only the destination of a detected rename, so a
    // scripts/ -> docs/ move would otherwise look docs-only. Run the real step
    // script against a real repository so rename detection is exercised.
    test('a source-to-docs rename is test-relevant', () => {
      const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-rename-'));
      try {
        const git = (...args) => {
          const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
          expect(result.status).toBe(0);
          return result.stdout.trim();
        };
        git('init', '-q');
        git('config', 'user.email', 'ci@example.invalid');
        git('config', 'user.name', 'CI');
        fs.mkdirSync(path.join(repo, 'scripts'));
        fs.writeFileSync(path.join(repo, 'scripts', 'tool.js'), 'module.exports = () => "a stable body long enough to be detected as a rename";\n');
        git('add', '.');
        git('commit', '-q', '-m', 'base');
        const base = git('rev-parse', 'HEAD');
        fs.mkdirSync(path.join(repo, 'docs'));
        git('mv', 'scripts/tool.js', 'docs/tool.js');
        git('commit', '-q', '-m', 'move');
        const head = git('rev-parse', 'HEAD');
        expect(git('diff', '--name-only', `${base}...${head}`)).toBe('docs/tool.js');

        const output = path.join(repo, '.out');
        fs.writeFileSync(output, '');
        const child = runGithubBashStep(classifyScript(), {
          cwd: repo,
          env: { ...process.env, EVENT_NAME: 'pull_request', BASE_SHA: base, HEAD_SHA: head, GITHUB_OUTPUT: output },
        });
        expect(child.status).toBe(0);
        const outputs = Object.fromEntries(fs.readFileSync(output, 'utf8').trim().split('\n').map((line) => line.split('=')));
        expect(outputs.tests_relevant).toBe('true');
      } finally {
        fs.rmSync(repo, { recursive: true, force: true });
      }
    }, 30_000);

    test('every workflow diff lists both sides of a rename', () => {
      const classify = classifyScript();
      expect(classify).toContain('git diff --no-renames --name-only "$BASE_SHA...$HEAD_SHA"');
      const resolve = jobs['followup-tests'].steps.find((step) => step.name === 'Resolve affected test targets').run;
      expect(resolve).toContain("execFileSync('git', ['diff', '--no-renames', '--name-only', `${baseSha}...${headSha}`]");
      const diffCalls = workflowContent.match(/git diff[^\n]*|\['diff'[^\n]*/g) || [];
      expect(diffCalls.length).toBeGreaterThan(0);
      for (const call of diffCalls) expect({ call, noRenames: call.includes('--no-renames') }).toEqual({ call, noRenames: true });
    });

    test('every tracked file outside the docs set is test-relevant', () => {
      const pattern = docsOnlyPattern();
      const tracked = spawnSync('git', ['ls-files'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' })
        .stdout.split('\n').filter(Boolean);
      expect(tracked.length).toBeGreaterThan(100);
      const mismatches = tracked.filter((file) => pattern.test(file) !== isDocsOnlyPath(file));
      expect(mismatches).toEqual([]);
      // One representative per top-level directory and root file type is relevant.
      const representatives = new Map();
      for (const file of tracked.filter((entry) => !isDocsOnlyPath(entry))) {
        const key = file.includes('/') ? file.split('/')[0] : path.extname(file) || file;
        if (!representatives.has(key)) representatives.set(key, file);
      }
      for (const file of representatives.values()) {
        expect({ file, relevant: !pattern.test(file) }).toEqual({ file, relevant: true });
      }
    });

    test('every path in the Required Checks Bypass code list is test-relevant', () => {
      const pattern = docsOnlyPattern();
      const bypassPath = path.join(__dirname, '..', '.github', 'workflows', 'required-checks-bypass.yml');
      const bypass = YAML.parse(fs.readFileSync(bypassPath, 'utf8'));
      const globs = bypass.on.pull_request['paths-ignore'];
      expect(globs.length).toBeGreaterThan(0);
      for (const glob of globs) {
        const sample = glob.replace(/\*\*/g, 'x/y').replace(/\*/g, 'x');
        expect({ glob, sample, relevant: !pattern.test(sample) }).toEqual({ glob, sample, relevant: true });
      }
    });

    test('paths outside every old allowlist are test-relevant', () => {
      const pattern = docsOnlyPattern();
      for (const file of ['plugin/.claude-plugin/plugin.json', '.forge/protected-paths.yaml', 'web/dashboard/app.js']) {
        expect({ file, relevant: !pattern.test(file) }).toEqual({ file, relevant: true });
      }
    });

    test('expensive lanes are gated on tests_relevant', () => {
      for (const lane of expensiveLanes) {
        const job = jobs[lane];
        expect({ lane, needsChanges: [].concat(job.needs || []).includes('changes') }).toEqual({ lane, needsChanges: true });
        expect({ lane, gated: String(job.if).includes("needs.changes.outputs.tests_relevant == 'true'") })
          .toEqual({ lane, gated: true });
      }
    });

    test('test-irrelevant PRs still run the doc-asserting suites under the Tests workflow', () => {
      const docs = jobs['doc-assertions'];
      expect(docs.needs).toEqual(['changes']);
      expect(docs.if).toBe("${{ github.event_name == 'pull_request' && needs.changes.outputs.tests_relevant == 'false' }}");
      const commands = docs.steps.map((step) => step.run || '').join('\n');
      expect(commands).toContain('node scripts/doc-asserting-tests.js --base ${{ github.event.pull_request.base.sha }}');
    });

    test('every job that installs dependencies restores the Bun download cache', () => {
      const installJobs = Object.entries(jobs)
        .filter(([, job]) => (job.steps || []).some((step) => step.run === 'bun install'));
      expect(installJobs.length).toBeGreaterThanOrEqual(9);
      for (const [name, job] of installJobs) {
        const names = job.steps.map((step) => step.name);
        const setupIndex = job.steps.findIndex((step) => String(step.uses).startsWith('oven-sh/setup-bun@'));
        const dirIndex = names.indexOf('Resolve Bun cache directory');
        const cacheIndex = names.indexOf('Cache Bun downloads');
        const installIndex = job.steps.findIndex((step) => step.run === 'bun install');
        expect({ name, ordered: setupIndex >= 0 && setupIndex < dirIndex && dirIndex < cacheIndex && cacheIndex < installIndex })
          .toEqual({ name, ordered: true });
        expect(job.steps[setupIndex].id).toBe('setup-bun');
        expect(job.steps[dirIndex].run).toBe('echo "dir=$(bun pm cache)" >> "$GITHUB_OUTPUT"');
        const cache = job.steps[cacheIndex];
        expect(cache.uses).toBe('actions/cache@v6');
        expect(cache.with.path).toBe('${{ steps.bun-cache-dir.outputs.dir }}');
        expect(cache.with.key).toBe("bun-${{ runner.os }}-${{ steps.setup-bun.outputs.bun-version }}-${{ hashFiles('bun.lock') }}");
        expect(JSON.stringify(cache.with)).not.toContain('node_modules');
      }
    });
  });

  describe('Bun pin auto-update', () => {
    const job = jobs['bun-pin-update'];
    const stepNamed = (name) => job.steps.find((step) => step.name === name);
    const bumpStep = () => stepNamed('Open Bun pin PR');

    test('runs only on the weekly schedule or an opted-in dispatch, never on PRs', () => {
      expect(job).toBeDefined();
      expect(job.if).toBe("${{ github.event_name == 'schedule' || (github.event_name == 'workflow_dispatch' && inputs.bump_bun) }}");
      expect(job.if).not.toContain('pull_request');
      expect(job.if).not.toContain('merge_group');
      expect(triggers.workflow_dispatch.inputs.bump_bun).toMatchObject({ type: 'boolean', default: false });
      expect(triggers.schedule).toEqual([{ cron: '0 3 * * 0' }]);
    });

    test('declares only the permissions it needs; the workflow default stays read-only', () => {
      // Writes on the token path go through BUN_BUMP_TOKEN, so GITHUB_TOKEN stays read-only here.
      expect(job.permissions).toEqual({ contents: 'read' });
      // Only the no-token tracking-issue job may write issues.
      expect(jobs['bun-pin-issue'].permissions).toEqual({ issues: 'write' });
      expect(YAML.parse(workflowContent).permissions).toEqual({ contents: 'read' });
    });

    test('uses BUN_BUMP_TOKEN only for checkout, token detection, and the push/PR step', () => {
      const secretRef = '${{ secrets.BUN_BUMP_TOKEN';
      const users = job.steps.filter((step) => JSON.stringify(step).includes(secretRef)).map((step) => step.name);
      expect(users).toEqual(['Checkout code', 'Detect Bun bump token', 'Open Bun pin PR']);
      expect(stepNamed('Checkout code').with.token).toBe('${{ secrets.BUN_BUMP_TOKEN || github.token }}');
      expect(stepNamed('Detect Bun bump token').env).toEqual({ BUN_BUMP_TOKEN: '${{ secrets.BUN_BUMP_TOKEN }}' });
      expect(bumpStep().env.GH_TOKEN).toBe('${{ secrets.BUN_BUMP_TOKEN }}');
      for (const step of job.steps.filter((s) => !users.includes(s.name))) {
        expect({ name: step.name, env: JSON.stringify(step.env || {}) }).toEqual({ name: step.name, env: expect.not.stringContaining('BUN_BUMP_TOKEN') });
      }
      const issueJob = jobs['bun-pin-issue'];
      expect(JSON.stringify(issueJob)).not.toContain('BUN_BUMP_TOKEN }}');
      expect(JSON.stringify(job.env || {})).not.toContain('secrets.');
    });

    test('no step echoes or interpolates the token', () => {
      const runs = [...job.steps, ...jobs['bun-pin-issue'].steps].map((step) => step.run || '');
      for (const run of runs) {
        expect(run).not.toContain('${{ secrets');
        expect(run).not.toMatch(/(echo|printf)[^\n]*\$\{?(BUN_BUMP_TOKEN|GH_TOKEN)/);
      }
      const detect = stepNamed('Detect Bun bump token');
      expect(detect.id).toBe('bump-token');
      expect(detect.run).toContain('[ -n "${BUN_BUMP_TOKEN:-}" ]');
    });

    test('the token path pushes only when the secret exists; otherwise only the tracking issue runs', () => {
      expect(bumpStep().if).toBe("steps.bun-release.outputs.newer == 'true' && steps.bump-token.outputs.available == 'true'");
      expect(job.outputs).toEqual({
        newer: '${{ steps.bun-release.outputs.newer }}',
        latest: '${{ steps.bun-release.outputs.latest }}',
        release_url: '${{ steps.bun-release.outputs.release_url }}',
        token_available: '${{ steps.bump-token.outputs.available }}',
      });
      const issueJob = jobs['bun-pin-issue'];
      expect(issueJob.needs).toBe('bun-pin-update');
      // Runs after every successful check so a stale tracking issue is closed once no bump is needed.
      expect(issueJob.if).toBe("${{ needs.bun-pin-update.result == 'success' }}");
      const commands = issueJob.steps.map((step) => step.run || '').join('\n');
      // The issue body quotes manual commands; the job itself never executes a push or PR.
      expect(commands).not.toMatch(/^\s*(node bin\/forge\.js|git push)|gh pr create --base "\$BASE_BRANCH"/m);
    });

    function runIssueStep({ existing, newer = 'true', tokenAvailable = 'false', issueJob = jobs['bun-pin-issue'] }) {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-bun-issue-'));
      try {
        const binDir = path.join(root, 'bin');
        fs.mkdirSync(binDir);
        const log = path.join(root, 'calls.log');
        const bodyFile = path.join(root, 'body.md');
        const summary = path.join(root, 'summary.md');
        fs.writeFileSync(log, '');
        fs.writeFileSync(summary, '');
        const toPosix = (value) => value.replace(/\\/g, '/');
        // Flatten the multi-line --body so each call stays on one log line.
        const record = `printf '%s %s\\n' "$(basename "$0")" "$(printf '%s' "$*" | tr '\\n' ' ')" >> '${toPosix(log)}'`;
        const listOutput = existing ? `echo ${existing}` : 'true';
        fs.writeFileSync(path.join(binDir, 'gh'), `#!/usr/bin/env bash\n${record}\nprevious=\nfor arg in "$@"; do\n  if [ "$previous" = "--body" ]; then printf '%s' "$arg" > '${toPosix(bodyFile)}'; break; fi\n  previous="$arg"\ndone\nif [ "$1 $2" = "issue list" ]; then ${listOutput}; fi\nif [ "$1 $2" = "issue create" ]; then echo https://github.com/o/r/issues/7; fi\n`);
        fs.chmodSync(path.join(binDir, 'gh'), 0o755);
        const prelude = `export PATH="$(cygpath -u '${toPosix(binDir)}' 2>/dev/null || printf '%s' '${toPosix(binDir)}'):$PATH"`;
        const issueStep = issueJob.steps.find((step) => step.name === 'Open or update Bun pin tracking issue');
        const child = runGithubBashStep(`${prelude}\n${issueStep.run}`, {
          env: {
            ...process.env,
            VERSION: '1.4.3',
            RELEASE_URL: 'https://github.com/oven-sh/bun/releases/tag/bun-v1.4.3',
            BASE_BRANCH: 'master',
            NEWER: newer,
            TOKEN_AVAILABLE: tokenAvailable,
            GITHUB_STEP_SUMMARY: toPosix(summary),
          },
        });
        expect({ status: child.status, stderr: child.stderr }).toEqual({ status: 0, stderr: '' });
        return {
          calls: fs.readFileSync(log, 'utf8').trim().split('\n'),
          body: fs.existsSync(bodyFile) ? fs.readFileSync(bodyFile, 'utf8') : '',
          summary: fs.readFileSync(summary, 'utf8'),
        };
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }

    test('without the token, opens one tracking issue with the exact bump commands and release URL', () => {
      const issueStep = jobs['bun-pin-issue'].steps.find((step) => step.name === 'Open or update Bun pin tracking issue');
      expect(issueStep.env).toMatchObject({
        GH_TOKEN: '${{ github.token }}',
        GH_REPO: '${{ github.repository }}',
        VERSION: '${{ needs.bun-pin-update.outputs.latest }}',
        RELEASE_URL: '${{ needs.bun-pin-update.outputs.release_url }}',
        NEWER: '${{ needs.bun-pin-update.outputs.newer }}',
        TOKEN_AVAILABLE: '${{ needs.bun-pin-update.outputs.token_available }}',
      });
      const { calls, summary } = runIssueStep({ existing: null });
      const create = calls.find((call) => call.startsWith('gh issue create'));
      expect(create).toContain('--title Bun 1.4.3 available: run forge release update-bun-pins');
      expect(create).toContain('forge release update-bun-pins --to 1.4.3 --expect-head "$(git rev-parse HEAD)"');
      expect(create).toContain('https://github.com/oven-sh/bun/releases/tag/bun-v1.4.3');
      expect(create).toContain('BUN_BUMP_TOKEN');
      expect(calls.some((call) => call.startsWith('gh issue edit'))).toBe(false);
      expect(calls.filter((call) => /^gh /.test(call) && !/^gh issue (list|create) /.test(call))).toEqual([]);
      expect(summary.trim().split('\n')).toHaveLength(1);
      expect(summary).toContain('no-token path');
    }, 30_000);

    test('dedupes by title prefix: an open tracking issue is updated, not duplicated', () => {
      const issueStep = jobs['bun-pin-issue'].steps.find((step) => step.name === 'Open or update Bun pin tracking issue');
      expect(issueStep.run).toContain('gh issue list --state open');
      expect(issueStep.run).toContain('startswith("Bun ")');
      expect(issueStep.run).toContain('endswith(" available: run forge release update-bun-pins")');
      const { calls, summary } = runIssueStep({ existing: 42 });
      expect(calls.some((call) => call.startsWith('gh issue create'))).toBe(false);
      const edit = calls.find((call) => call.startsWith('gh issue edit 42'));
      expect(edit).toContain('--title Bun 1.4.3 available: run forge release update-bun-pins');
      expect(summary).toContain('#42');
    }, 30_000);

    test('the manual commands verify no PR is open before deleting or resetting the bump branch', () => {
      const template = fs.readFileSync(path.join(__dirname, '..', 'lib', 'workflow-templates', 'test.yml'));
      const { renderTestWorkflow } = require('../lib/test-workflow');
      const issueJob = YAML.parse(renderTestWorkflow(template, '1.4.2').toString()).jobs['bun-pin-issue'];
      const { body } = runIssueStep({ existing: null, issueJob });
      const fenced = /```bash\n([\s\S]*?)\n```/.exec(body);
      expect(fenced).not.toBeNull();

      function runManualCommands({ openPrs, listStatus }) {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-manual-bun-bump-'));
        try {
          const binDir = path.join(root, 'bin');
          fs.mkdirSync(binDir);
          const log = path.join(root, 'calls.log');
          const script = path.join(root, 'manual.sh');
          fs.writeFileSync(log, '');
          const toPosix = (value) => value.replace(/\\/g, '/');
          const record = `printf '%s %s\\n' "$(basename "$0")" "$*" >> '${toPosix(log)}'`;
          fs.writeFileSync(path.join(binDir, 'gh'), `#!/usr/bin/env bash\n${record}\nif [ "$1 $2" = "pr list" ]; then echo ${openPrs}; exit ${listStatus}; fi\n`);
          fs.writeFileSync(path.join(binDir, 'git'), `#!/usr/bin/env bash\n${record}\nif [ "$1" = "rev-parse" ]; then echo ${'c'.repeat(40)}; fi\n`);
          fs.writeFileSync(path.join(binDir, 'forge'), `#!/usr/bin/env bash\n${record}\n`);
          for (const name of ['gh', 'git', 'forge']) fs.chmodSync(path.join(binDir, name), 0o755);
          const prelude = `export PATH="$(cygpath -u '${toPosix(binDir)}' 2>/dev/null || printf '%s' '${toPosix(binDir)}'):$PATH"`;
          fs.writeFileSync(script, `${prelude}\n${fenced[1]}`);
          const child = spawnSync(bashExecutable, ['--noprofile', '--norc', toPosix(script)], { encoding: 'utf8' });
          return { child, calls: fs.readFileSync(log, 'utf8').trim().split('\n') };
        } finally {
          fs.rmSync(root, { recursive: true, force: true });
        }
      }

      for (const scenario of [
        { openPrs: 1, listStatus: 0 },
        { openPrs: 0, listStatus: 1 },
      ]) {
        const { child, calls } = runManualCommands(scenario);
        expect(child.status).not.toBe(0);
        expect(calls.find((call) => call.startsWith('gh pr list')))
          .toBe('gh pr list --head bun/bump-1.4.3 --state open --json number --jq length');
        expect(calls.some((call) => call.startsWith('git push origin --delete'))).toBe(false);
        expect(calls.some((call) => call.startsWith('git switch -C'))).toBe(false);
      }

      const { child, calls } = runManualCommands({ openPrs: 0, listStatus: 0 });
      expect(child.status).toBe(0);
      const sequence = [
        'gh pr list --head bun/bump-1.4.3 --state open',
        'git push origin --delete bun/bump-1.4.3',
        'git switch -C bun/bump-1.4.3',
      ];
      const positions = sequence.map((prefix) => calls.findIndex((call) => call.startsWith(prefix)));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    }, 30_000);

    for (const [label, options] of [
      ['the pin is current', { newer: 'false' }],
      ['the token path owns the bump', { newer: 'true', tokenAvailable: 'true' }],
    ]) {
      test(`closes an open tracking issue when ${label}`, () => {
        const { calls, summary } = runIssueStep({ existing: 42, ...options });
        const close = calls.find((call) => call.startsWith('gh issue close 42'));
        expect(close).toContain('--comment');
        expect(calls.some((call) => /^gh issue (create|edit)/.test(call))).toBe(false);
        expect(summary).toContain('closed tracking issue #42');
      }, 30_000);

      test(`writes nothing when ${label} and no tracking issue is open`, () => {
        const { calls } = runIssueStep({ existing: null, ...options });
        expect(calls.filter((call) => !call.startsWith('gh issue list '))).toEqual([]);
      }, 30_000);
    }

    test('does not install local Git hooks in the Bun bump job', () => {
      expect(job.steps.some(step => step.name === 'Install Git hooks')).toBe(false);
      expect(job.steps.map(step => step.run || '').join('\n')).not.toContain('lefthook install');
    });

    test('compares the latest stable Bun with the pin and bumps only when newer', () => {
      const resolve = stepNamed('Resolve latest stable Bun');
      expect(resolve.id).toBe('bun-release');
      expect(resolve.run).toBe('node lib/bun-release.js >> "$GITHUB_OUTPUT"');
      const bump = bumpStep();
      expect(bump.if).toContain("steps.bun-release.outputs.newer == 'true'");
      expect(bump.env).toMatchObject({
        GH_TOKEN: '${{ secrets.BUN_BUMP_TOKEN }}',
        VERSION: '${{ steps.bun-release.outputs.latest }}',
        RELEASE_URL: '${{ steps.bun-release.outputs.release_url }}',
      });
      expect(bump.run).not.toContain('${{');
    });

    function runBumpStep({ openPrs, staleBranch = false }) {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-ci-bun-bump-'));
      try {
        const binDir = path.join(root, 'bin');
        fs.mkdirSync(binDir);
        const log = path.join(root, 'calls.log');
        fs.writeFileSync(log, '');
        const toPosix = (value) => value.replace(/\\/g, '/');
        const record = `printf '%s %s\\n' "$(basename "$0")" "$*" >> '${toPosix(log)}'`;
        fs.writeFileSync(path.join(binDir, 'gh'), `#!/usr/bin/env bash\n${record}\nif [ "$1 $2" = "pr list" ]; then echo ${openPrs}; fi\n`);
        fs.writeFileSync(path.join(binDir, 'git'), `#!/usr/bin/env bash\n${record}\nif [ "$1" = "rev-parse" ]; then echo ${'c'.repeat(40)}; fi\nif [ "$1" = "ls-remote" ]; then exit ${staleBranch ? 0 : 2}; fi\n`);
        fs.writeFileSync(path.join(binDir, 'node'), `#!/usr/bin/env bash\n${record}\n`);
        for (const name of ['gh', 'git', 'node']) fs.chmodSync(path.join(binDir, name), 0o755);
        const prelude = `export PATH="$(cygpath -u '${toPosix(binDir)}' 2>/dev/null || printf '%s' '${toPosix(binDir)}'):$PATH"`;
        const child = runGithubBashStep(`${prelude}\n${bumpStep().run}`, {
          env: {
            ...process.env,
            VERSION: '1.4.3',
            RELEASE_URL: 'https://github.com/oven-sh/bun/releases/tag/bun-v1.4.3',
            BASE_BRANCH: 'master',
            GITHUB_STEP_SUMMARY: toPosix(path.join(root, 'summary.md')),
          },
        });
        expect({ status: child.status, stderr: child.stderr }).toEqual({ status: 0, stderr: '' });
        const summary = fs.readFileSync(path.join(root, 'summary.md'), 'utf8');
        expect(summary.trim().split('\n')).toHaveLength(1);
        expect(summary).toContain('token path');
        return fs.readFileSync(log, 'utf8').trim().split('\n');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    }

    test('is idempotent: an open bun/bump-<version> PR skips every write', () => {
      expect(runBumpStep({ openPrs: 1 })).toEqual([
        'gh pr list --head bun/bump-1.4.3 --state open --json number --jq length',
      ]);
    }, 30_000);

    test('pins through the protected writer, pushes, and opens the PR with the token (its CI triggers on its own)', () => {
      const calls = runBumpStep({ openPrs: 0 });
      const indexOf = (prefix) => calls.findIndex((call) => call.startsWith(prefix));
      const sequence = [
        'gh pr list --head bun/bump-1.4.3 --state open',
        'git switch -c bun/bump-1.4.3',
        `node bin/forge.js release update-bun-pins --to 1.4.3 --expect-head ${'c'.repeat(40)}`,
        'git add -- package.json .github/workflows',
        'git commit -m chore(deps): pin Bun 1.4.3',
        'node bin/forge.js push --quick -- -u origin bun/bump-1.4.3',
        'gh pr create --base master --head bun/bump-1.4.3 --title chore(deps): pin Bun 1.4.3 --body',
      ];
      const positions = sequence.map(indexOf);
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      expect(calls[indexOf('gh pr create')]).toContain('https://github.com/oven-sh/bun/releases/tag/bun-v1.4.3');
      expect(calls.some((call) => call.startsWith('gh workflow run'))).toBe(false);
    }, 30_000);

    test('deletes a stale bun/bump-<version> branch with no open PR before recreating it', () => {
      const calls = runBumpStep({ openPrs: 0, staleBranch: true });
      const indexOf = (prefix) => calls.findIndex((call) => call.startsWith(prefix));
      const sequence = [
        'gh pr list --head bun/bump-1.4.3 --state open',
        'git ls-remote --exit-code --heads origin bun/bump-1.4.3',
        'gh api --method DELETE repos/{owner}/{repo}/git/refs/heads/bun/bump-1.4.3',
        'git switch -c bun/bump-1.4.3',
        'node bin/forge.js push --quick -- -u origin bun/bump-1.4.3',
      ];
      const positions = sequence.map(indexOf);
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    }, 30_000);

    test('leaves the remote alone when no stale bun/bump-<version> branch exists', () => {
      const calls = runBumpStep({ openPrs: 0 });
      expect(calls.some((call) => call.startsWith('gh api --method DELETE'))).toBe(false);
    }, 30_000);
  });

  describe('Job timeouts', () => {

    test('every job declares a timeout so a hung runner cannot poison the queue', () => {
      const lines = workflowContent.split('\n');
      const jobsStart = lines.indexOf('jobs:');
      expect(jobsStart).toBeGreaterThan(-1);
      const jobHeaders = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line, index }) => index > jobsStart && /^ {2}[a-z0-9-]+:$/.test(line));

      expect(jobHeaders.length).toBeGreaterThan(0);
      for (const { line, index } of jobHeaders) {
        let end = lines.length;
        for (let i = index + 1; i < lines.length; i += 1) {
          if (/^ {2}[a-z0-9-]+:$/.test(lines[i])) {
            end = i;
            break;
          }
        }
        const body = lines.slice(index, end).join('\n');
        expect({ job: line.trim(), hasTimeout: / {4}timeout-minutes: \d+/.test(body) })
          .toEqual({ job: line.trim(), hasTimeout: true });
      }
    });
  });

  // Heavy fixture tests write to TEMP; the Windows image defaults it to C:,
  // while runner.temp lives on the runner's work drive (measured 21-25% faster
  // locally for the heaviest fixture files). Scope it to Windows test jobs only.
  describe('Windows Temp Directory', () => {
    const { renderTestWorkflow } = require('../lib/test-workflow');
    const templatePath = path.join(__dirname, '..', 'lib', 'workflow-templates', 'test.yml');
    const windowsTestJobs = ['full-matrix', 'windows-smoke', 'followup-tests'];
    const tempEnvLine = (name) => `echo "${name}=\${{ runner.temp }}" >> "$GITHUB_ENV"`;

    function tempSteps(job) {
      return (job.steps || []).filter((step) => typeof step.run === 'string'
        && (step.run.includes(tempEnvLine('TEMP')) || step.run.includes(tempEnvLine('TMP'))));
    }

    test('Windows test jobs point TEMP and TMP at runner.temp before tests run', () => {
      const { jobs } = YAML.parse(workflowContent);
      for (const name of windowsTestJobs) {
        const steps = jobs[name].steps;
        const matches = tempSteps(jobs[name]);
        expect({ job: name, count: matches.length }).toEqual({ job: name, count: 1 });
        const [step] = matches;
        expect(step.if).toBe("runner.os == 'Windows'");
        expect(step.shell).toBe('bash');
        expect(step.run).toContain(tempEnvLine('TEMP'));
        expect(step.run).toContain(tempEnvLine('TMP'));
        const firstTestStep = steps.findIndex((candidate) => typeof candidate.run === 'string'
          && /setup-fixtures|test-full-suite|test:ci:shard/.test(candidate.run));
        expect(steps.indexOf(step)).toBeLessThan(firstTestStep);
      }
    });

    test('no non-Windows job overrides TEMP or TMP', () => {
      const { jobs } = YAML.parse(workflowContent);
      for (const [name, job] of Object.entries(jobs)) {
        if (windowsTestJobs.includes(name)) continue;
        expect({ job: name, count: tempSteps(job).length }).toEqual({ job: name, count: 0 });
        expect({ job: name, env: Object.keys(job.env || {}).filter((key) => /^(TEMP|TMP)$/.test(key)) })
          .toEqual({ job: name, env: [] });
      }
    });

    test('the rendered workflow matches its canonical template byte-for-byte', () => {
      const template = fs.readFileSync(templatePath);
      const rendered = fs.readFileSync(workflowPath);
      const pinned = /bun-version: (\d+\.\d+\.\d+)/.exec(rendered.toString('utf8'))[1];
      expect(renderTestWorkflow(template, pinned).equals(rendered)).toBe(true);
    });
  });
});
