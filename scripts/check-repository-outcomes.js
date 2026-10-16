#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { checkSkillsSync } = require('../lib/skills-sync');
const {
  AUDIT_ARTIFACT, auditBdCallSites, canonicalizeAuditArtifact,
  isBdCensusPath, renderBdCallSiteAuditMarkdown,
} = require('../lib/release-readiness');

function checkRepositoryOutcomes(root, changedPaths) {
  const failures = [];
  if (changedPaths.some(file => /^(skills\/|\.agents\/skills\/|lib\/(skills-sync|codex-skills)\.js$)/.test(file))) {
    const mirror = path.join(root, '.agents', 'skills');
    if (!fs.existsSync(mirror)) failures.push('Missing committed .agents/skills mirror');
    const result = checkSkillsSync({ repoRoot: root, agentSkillDirs: ['.agents/skills'] });
    failures.push(...result.drift.map(entry => `Skill drift: ${JSON.stringify(entry)}`));
  }
  if (changedPaths.some(file => file === AUDIT_ARTIFACT || isBdCensusPath(root, file))) {
    const audit = auditBdCallSites(root);
    const expected = canonicalizeAuditArtifact(renderBdCallSiteAuditMarkdown(audit));
    const artifact = path.join(root, AUDIT_ARTIFACT);
    if (!fs.existsSync(artifact) || canonicalizeAuditArtifact(fs.readFileSync(artifact, 'utf8')) !== expected) {
      failures.push('D20 audit is stale: run forge release regen-audit');
    }
  }
  return failures;
}

if (require.main === module) {
  const [base, head] = process.argv.slice(2);
  if (![base, head].every(ref => /^[0-9a-f]{40,64}$/.test(ref || ''))) {
    throw new Error('Expected full base and head Git object IDs');
  }
  const changedPaths = execFileSync('git', ['diff', '--name-only', '-z', '--no-renames', `${base}...${head}`], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const failures = checkRepositoryOutcomes(process.cwd(), changedPaths);
  for (const failure of failures) console.error(failure);
  process.exitCode = failures.length ? 1 : 0;
}

module.exports = { checkRepositoryOutcomes };
