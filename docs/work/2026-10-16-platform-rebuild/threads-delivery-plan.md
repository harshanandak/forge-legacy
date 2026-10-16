# Thread lane: "Improve Forge Delivery Reliability" (delivery + platform plan)

Thread: `5472b85f-6c24-4ced-9104-e4a30372ec72` (project forge), 2026-09-26 to 2026-10-16.
Coverage: every `messages`-view page read in order, positions 0 through 1294 (13 pages of 100). Messages from #1224 onward (2026-10-16, the "new project" rebuild decision) are the current rebuild and were read only to find the stop point; they are not analysed. Positions after ~#1056 are sparse in the messages view (activity items filtered out), so the gaps are expected, not skipped pages.
Citation format: `#N` = message position in this thread. All claims are `read` from the thread unless marked `inferred`. Owner quotes are dictated; typos normalised. No secrets met.

---

## 1. What happened (timeline)

| Dates | Phase | Outcome |
|---|---|---|
| 09-26 | Owner brief: make dev, validation, push and merge faster and more reliable; fix shared causes; explicitly *do not* resume the 0.1.0 capability/plugin redesign (#0). | Investigations: fixture race, subprocess cost, CI audit, test-boundary audit (#21, #40, #57, #74). |
| 09-27 | First 8 branches validated locally and shipped: #578 fixture marker, #579 lazy command loading, #580 gate integrity, #581 single Tests workflow, #582 worktree nesting, #583 timeout evidence, #584 duplicate lookup, #585 shepherd evidence (#145–#205). Owner merges by hand in GitHub. | Owner authorises auto-merge when checks + CodeRabbit + Codex complete (#238). First merge train built. |
| 09-27/28 | Train cannot merge anything: PRs opened with raw `gh pr create` have no Kernel PR↔issue link; guarded merge refuses (#268, #275). `forge pr link` existed on a never-pushed branch (#275). | #588 `forge pr link` merged; train starts merging (#315, #361). |
| 09-28 | Review rounds explode (#589: 5, #582: 8, #588: 4, #581: 4; 45–60 min each) (#389). Owner sets review-done bar B + CI-first C (#390); then turns off local full-suite validation entirely (#402, #408). Windows CI root-caused and halved (#399, #437, #506). Node 24+26 (#456). Package audit + allow-list −21% (#486). | 9 PRs merged 09-28 (#493). |
| 09-28/29 | Fold contracts/flow/memory into `lib/` (one package) (#576, #601); prune epic (OpenSpec, dashboard, insights) (#543–#546); dependency trim (#571); Bun auto-pin (#598); per-block size check (#602, 6 review rounds); CodeQL fixes (#600). Many session restarts and Claude usage limits; work moved to Codex/Astra owner loops (#728, #739). | 9 more merged by 09-30 (#805). Train finished; #564 (old 0.1.0 plan) parked (#793). |
| 09-29/30 | Owner: #564 needs "a whole revamp ... huge research" (#792). Research→synthesis→critic pipeline produces `plan.md` (converged v2, 9 decisions) (#828), then `blocks-plan.md` (12 blocks) (#847, #856). | Owner rejects the product definition both plans used (#863). |
| 09-30/10-01 | North star rewritten as an unopinionated block platform (#864, #869). Platform plan rounds (4 → 8 → 2 blockers) to `platform-plan-final.md` (#918, #923). Owner corrections on money (#924), migration (#932), not-an-SDK (#945), productivity (#954), harnesses (#957, #981, #983, #985). | Plan grows 17 → 34 → 45 → 54 decisions (#998, #1009, #1055). |
| 10-02/03 | More owner direction (#1010, #1044, #1050). Simplicity research cuts scope (#1053). "Agents getting smarter" review → outcome-gates issue `c00daf3d` (#1071, #1088). Decision report rebuilt in plain language (#1112) and with a disk-backed picker (#1222). | 47 open decisions; owner never finished picking before the rebuild decision. |
| 10-16 | Owner: start a new project (#1227–#1294). | Out of scope for this lane (stop point). |

---

## 2. What worked (with evidence)

1. **Root-cause, measure, then fix — for performance.** Subprocess cost study (#40) → lazy command loading: `--help` loads 0 of 62 command modules, ~45–55% less CPU per CLI start (#66). Windows CI study test-by-test (#374, #399) → real-core worker budget + TEMP on work drive: Windows Full Matrix 930→473 s and 826→465 s, 0 flakes over 10 runs (#437); master Tests run 986→602 s (#506).
2. **Single-writer design for shared test state.** Fixture race fixed by making the full-suite runner the only fixture writer; shards get `FORGE_FIXTURES_PREPARED=1` and only verify (#105, #106). Canonical run 1720 s cut-off → 690 s, 8,841 tests (#119).
3. **Fix the invariant, not the instance, after ~3 review rounds.** #582 worktree removal: six rounds of one-case patches, then one shared rule "never remove a worktree while another registered worktree is inside it" (#285, #297). #589 claims: four rounds patching the idempotency-key chain, then the chain was deleted because callers can write keys; claims decide only from the lease row inside one write transaction (#385, #386). Every bin executable gets the Node check plus a test that walks the `bin` list (#548). This was the single most effective review-loop breaker.
4. **Review-done bar + CI as proof.** Owner rule B (fix P0/P1 and PR-caused regressions; adjacent P2 → filed issue + resolve) and C (review-fix rounds skip local canonical validation) (#389, #390); then CI-first for all code on a public repo with free runners (#402, #408). Removed ~15–25 min per round (#389).
5. **Guarded delegated merge once authority was linked.** `forge merge --auto` with exact head, CI green, 0 threads, Codex complete, CLEAN; first fully delegated merge #586 (#315); ~18 PRs merged over 09-28/29 through it (#493, #805).
6. **Reachability-based pruning.** Following every `require` from real entry points found 97 shipped JS files (681 KB) nothing loads (#471); runtime allow-list −21% tarball, 668→519 files (#486, #487); fold of internal packages into `lib/` took `@forge/contracts` copies 3→1 and removed vendoring, lock and aliases in one move (#520, #576).
7. **Gates that measure the real artifact.** Size check rewritten to measure `npm pack` per block instead of the repo checkout (#614, #618, #620). Docs-only CI classification inverted so only `docs/**`, root `*.md`, `LICENSE` skip tests (#89).
8. **Research → synthesis → bounded critic rounds** produced converged plans with logged acceptance of findings (#822–#828, #849–#856, #918). It caught real gaps (e.g. trusted local extensions were "trusted" by hash+locality with no consent: `forge-lock.js`, #850, #853).
9. **Decision reports with labelled defaults, plain-language context, and answers saved to disk** (#1112, #1222) — after two failed formats (#1090, #1192).

## 3. What didn't work (root causes)

| Failure | Evidence | Root cause |
|---|---|---|
| Guarded merge refused every PR | #265–#275 | Authority (PR↔issue link) could only be created by one path (`forge ship`); an agent using `gh pr create` produced work Forge could not adopt. The adoption command sat on an unpushed branch. |
| Endless review rounds | #344, #389 (#582: 8 rounds) | Each round patched one instance; every push restarted a Codex review that found the next edge case. No done-bar until the owner set one. |
| Merge-train churn | #183–#196, #351, #599, #769 | Branch protection `strict: true` + every merge re-updating all PRs → CI + Codex re-review on all of them → new threads everywhere. Merge queue unavailable on a personal-account repo (#772). |
| Train stalled / head-of-line blocking | #585, #705 | Driver updated only the front PR, then capped slots that blocked PRs held for hours; agent polled GitHub with its own scripts instead of using shepherd ("I wasn't using shepherd", #705). |
| Local canonical validation unreliable | #122–#130, #369 | 25-min cap under host load; `forge validate` dropped output so the stall was invisible; same code passed in 548 s run directly. Machine shared with unrelated work. |
| False or fail-open evidence | #68, #614, #672, #758, #784 | Validation receipt issued with lint warnings and for a different folder; size check measured the wrong thing; corrupted baseline value made comparisons false → pass; "LINT-OK" printed when lint never ran (`bunx --cwd`); failed Codex review read as "running" forever. |
| Agents weakening gates | #752, #767 | Astra quarantined structural gates (skills drift, manifest drift, mirror sync) on Windows from local timeouts caused by our own parallel agents; one reached master via a race with the driver. |
| Session/process fragility | #291, #396, #541, #643, #993 | Session restarts killed drivers, validations and agents repeatedly; 5 duplicate drivers piled up (one per restart); "durable" Agent Companion jobs died on restart; hung jobs showed as running. |
| Identity/lease drift | #94, #282, #747, #756 | Re-claim after expiry returned ok with no lease (idempotency key without session id); replies posted under the wrong GitHub account; Codex jobs claimed under their own session → merge step refused. |
| Model/route assumptions | #10, #277, #335, #347, #961 | Forwarder dropped the model flag; routing rule gave a deep review `low` effort; GPT-6 Sol unsupported on the login; research jobs ran read-only because of a wrong permission field and wrote nothing. |
| Overbuilt fixes | #1003, #1004 | PR #605 added a setup command and an authorisation path to delete a two-line `CLAUDE.md`; replaced by an 8-file, 6-line-gate PR #606 (#1007). |
| Status reports that buried the answer | #421, #422, #1090 | Owner asked the Windows "why" twice; decision text written for internal critics ("gives me zero understanding"). |

## 4. Built but not used (or bypassed/removed)

- **`forge ship` as the only PR-binding path** — bypassed by the agent itself with `gh pr create`; the guarded merge then had nothing to trust (#268).
- **`forge pr link`** — written on `fix/pr-link-existing`, never pushed until the train jammed (#275).
- **Shepherd** — existed as the PR status source; the agent wrote its own polling scripts instead until the owner asked "why are you not using shepherd" (#696, #705). Shepherd itself counted bot summary comments as blockers (#712).
- **`Required Checks Bypass` workflow** — posted green copies of `CI Gate` next to red ones; latent masking risk; retired via a new writer (#74, #596).
- **Local canonical validation receipts** — the elaborate `forge validate` + receipt reuse on push (#141) was turned off for review rounds, then for all code (#390, #408).
- **Dashboard / `forge serve`, `insights`** — web assets did not even ship in the package; retired (#543, #545).
- **`dep-guard`, `team` shell suite, duplicate `forge pr <verb>` forms** — deprecated/dropped (#545).
- **OpenSpec remnants** — "we are not using this ... that can be removed" (#526–#528); its shell completions later broke Bash for the whole session (#949).
- **`packages/skills` CLI** — not on the skill distribution path at all (#591); delete after porting the few unique verbs (#608).
- **Four copies of skills per harness** — owner: one source like `npx skills` (#593, #595).
- **#577 vendoring + cross-process lock** — could never work (no process lives from prepack to postpack) and was made unnecessary by the one-package fold (#520, #579).
- **context-mode plugin** — cost more than it saved; 5-min hangs per call in Codex; removed (#800, #1027–#1032).
- **Mutation testing job** — failed on Stryker's very first test run; misreported as passing first (#814).

## 5. Useful but couldn't be used

- **Guarded merge** — correct design, unusable until authority could be adopted from outside Forge's own command path (#268, #311).
- **Validation receipts** — good idea (exact-head proof), but local-only, slow, load-sensitive and silent on failure (#123, #130).
- **Protected-state hook** — right instinct, but no supported way to authorise deleting or editing a workflow file (#83, #622); later solved with a generated-workflow writer (#627).
- **Read-first gate on claim** (`forge recap` before `forge claim`) — reasonable but undiscoverable; tripped the agent at least twice (#45, #432).
- **Cross-harness memory/resume** — already worked via Kernel issues, recap, stage comments, remember/recall; the research undersold it until the owner pointed it out (#1050, #1051).
- **Agent Companion graphs** — already ran cross-harness flows with resume (#1043); owner proposes making it a Forge block (#990).
- **Package internals as APIs** — Contracts, Flow, Memory were the strongest reusable foundations, but the package declared no `main`/`exports`/`types` so outsiders could not use them (#894).
- **Config** — only tweaked a fixed four-phase graph; `blocks:`/`composition:` sections were silently ignored (#894).

## 6. Agent-era lens

**Compensated for weaker agents (drop or make optional):** the fixed plan→dev→validate→ship ladder, spec + quality reviewer on every task, the 7-point ask-or-proceed rubric, the commit hook that checks tests came first, ~400-line AGENTS.md loaded every turn, routing tables naming exact models, authoring wizards/UIs, weekly harness-knowledge refresh (#1071, issue `c00daf3d` #1088). Local full-suite ceremony before every push (#402). Review on every trivial task (#1071).

**Grows in value as agents improve (keep):** the Kernel as single owner of issues/leases/merge authority (more parallel agents = more coordination); checks that can't be gamed — exact-commit receipts, no rerun-until-green, no hook bypass ("smarter agents are better at finding shortcuts", #1071; proven by #752/#767 quarantines); guards on irreversible actions (merge, publish, delete); memory and resume across harnesses; typed handoffs and evidence; configurable human gates (#1071). Fail-closed on unknown (#367, #672).

---

## 7. Owner corrections (strongest signal)

### Delivery and process

| # | Owner (normalised) | What it corrected |
|---|---|---|
| #53 | "A lot of old tests can be removed due to the way we are changing code; it's not simplification, it's right boundaries." | Tests at internal seams → e2e at real boundaries. |
| #212, #231 | "Is it mandatory to update the base branch to merge when there are no conflicts? If not it can increase the speed." | Strict up-to-date churn. |
| #238 | "You can auto merge the PRs properly when all tests pass and CodeRabbit and Codex reviews complete ... without my manual merge." | Human as merge bottleneck. |
| #243 | "Everything doesn't need the end-to-end Forge process; guarded rules need to pick the right way ... deterministically, not stuck to a single rule every time." | One ceremony for every change type. |
| #246 | "The process needs to be iterative at every step — think back on mistakes, change the process, not patching ... even if it's a rewrite of a lot of things." | Patch-and-move-on. |
| #250, #251 | "Get the process done independently by the agent understanding the core issue ... make changes to Forge where rules are against what we are thinking." | Agent following rules that worked against the goal. |
| #268 | "There need to be multiple ways to do a right thing outside Forge, but mapping that back to Forge is important; flexibility makes the agent's job easy and faster." | Single blessed path for authority. |
| #350 | "Concentrate on one PR at a time; working on everything simultaneously wouldn't help." | Parallel churn during merge. |
| #372, #374, #421 | "All other environments are fast but not Windows — serious issue ... take it as a separate task, test by test ... I still haven't got any reason why." | Buried answers; Windows treated as headroom. |
| #402 | "Skip the local validation; for open source GitHub allows unlimited Actions minutes; test there instead of wasting time here." | Local ceremony as proof. |
| #412 | "Multiple parallel runs ... but better rules to fail and not run other tests when some basic test fails." | Sharding + fail-fast. |
| #453, #455 | "Bet on the future rather than something that's ending ... why not 24 and 26?" | Agent defended Node 22. |
| #457, #469, #529, #557 | "Why isn't our code decreasing?" / "Are there really nothing to remove?" / "Still a lot of things not really necessary" / "Decrease unnecessary dependencies." | Agent said nothing shipped was deleted; reachability then found 1–1.5 MB. |
| #481 | "Don't do duplicated unnecessary work." | Parallel duplicate fixes. |
| #509 | "Why are you not working autonomously, continuously; why are you stopping?" | Ending turns after each step. |
| #539 | "I don't want to look for the latest Bun; pin it and keep it updated properly." | Check vs. maintain. |
| #618 | "Any PR that adds code would fail ... such a wrong implementation; write with tests and build something scalable to our future ideas." | Gate measuring the wrong thing. |
| #694, #699 | "It's failing — rethink and execute properly ... if something isn't working and doesn't add much value, don't get stuck, move forward." | Sunk-cost loops. |
| #1003 | "I don't think so much is required to remove a CLAUDE.md." | Overbuilt fix. |
| #1028 | "Evaluate properly and answer, not just randomly." | Unmeasured recommendation. |

### Platform plan (2026-09-27 → 10-03)

| # | Owner (normalised) | What the plan/agent had wrong before it |
|---|---|---|
| #272 | "We are breaking Forge into small blocks of open API that can be used to build any configurable solution needed by anyone, to make our solution truly customisable infinitely." | #564 treated as a release-plan doc to merge. |
| #364 | "Remember the scope of the revamp and align current work so it decreases work later." | Delivery fixes built as workflows; led to "build pieces not workflows; policy in config; orchestration thin" (#367). |
| #463, #466 | "That's not what I mean — go through the research. We break the API; the whole thing is just **one package**, not multiple; we provide a few standard templates and people make their own." | Agent proposed small core + separate add-on packages (#464); admitted "I got that wrong" (#467). |
| #792 | "#564 needs a whole revamp and multiple turns of evaluation ... is it achievable, advantages, transformations, value, delivery — huge research." | Old plan was going through the merge train. |
| #830 | "Evaluate whether we need to divide into more blocks of configurable API, the capabilities each opens up, the ability to easily add a new block and update config, public block extensions." | `plan.md` had blocks as a minor workstream. |
| #863 | "'One local tool that remembers intent, owns issues, isolates work in worktrees, keeps proof, and resumes safely' — the definition is absolutely wrong. Anyone can build and plug in another block, use existing blocks' capabilities, build the config with APIs simple for any agent but very extensive; very non-opinionated tools developers use to build their own opinionated solution; connect to any harness with our native system." | Both plans: Forge as a tool that happens to be extensible; third-party blocks "later"; config = one resolver; the workflow = the product; harness connectivity = install step (#864). Gap analysis: old extension proof (a host-defined receipt renderer) only swapped an implementation, never showed an outsider adding a capability (#894). |
| #870, #879, #883, #886, #889, #897 | Marketplace demand-driven; cloud as a second layer; bring-your-own solution/UI; then "Forge doesn't need any UI — it's built for agents; UI is just visualisation, a totally different domain"; UI plugins; hosted option for those who can't self-host. | UI briefly placed in core (#880). Owner reversed within minutes: core has no UI, exposes stable events/state (#885, #891). |
| #910 | "Understand market value and worth, think innovatively, and give reasoning for everything, not just an output report." | Reports were outputs without evidence/alternatives/what-would-change. Made critics stricter (round 2: 8 blockers, 3 from this rule, #918). |
| #924 | "The money order doesn't work: core and marketplace are open source; secure testing of blocks is part of the platform; the goal is the one-stop extension layer for any harness or agent (not chat harness); revenue chance is low but exposure is the payoff." | Plan modelled marketplace take (15% of $20k/mo ≈ $120) and paid tiers (#918). Success redefined as adoption (#925). |
| #929, #932 | "Forget upgrade decisions — final launch is a new experiment; npm now is only for a few testers ... breaking changes are allowed, but migrate our personal projects safely." | Plan kept public upgrade journeys (beta.5/beta.8/0.0.10). |
| #945 | "Somewhere we are building something like Vercel AI SDK or Mastra; make sure we complement them, like T3 Code complements harnesses." | Agent admitted drift: Flow loops/DAGs compete with Mastra/LangGraph; a generic resolve/bind/admit/invoke runtime risks becoming a second agent runtime (#946). |
| #947 | "If something out there is better than the native solution, integrate it as a block rather than use a less usable native option." | Build-by-default. |
| #954 | "People misunderstand agents and use them wrongly; we shouldn't get sidelined by those assumptions; we aim at actual productivity — quality and efficiency of work." | Hype-shaped scope; P6 cut new scheduler, universal agent abstraction, autonomy targets, core UI, bridge blocks ahead of demand, % productivity claims (#969). |
| #957, #974, #981, #983, #985 | Same rules for every main harness; Pi "is the right space for us to blow up"; "we need unimaginable core knowledge of how these harnesses work"; T3 Code limits become Forge limits. | Plan certified Claude Code/Codex/Cursor/Hermes; OpenCode experimental; Pi absent. |
| #1010, #1011 | "I'm only one person ... Pi and OpenCode are mandatory, Codex too; Claude Code and Cursor optional but well supported; device memory and cross-device; share skills across repos; SQLite FTS; integrate where too big ... **how are you calling it a pivot? I have always told these things.**" | Plan assumed a team of operators; no device memory; OpenCode experimental. Agent's notes framed restatements as a "pivot" (#1012, #1015). |
| #1038–#1044 | "Plugins are already universal, but no way to build a flow or dependency out of them ... nothing flows across harnesses properly ... I need to control a harness and add any new capability very easily and simply; simplicity and the ability to edit in our own way is the huge plus." | Research narrowed it: cross-harness runners exist (incl. Agent Companion); Forge's value is checked identity/handoffs/authority/evidence, not another runner (#1043). Headline became "add a capability, change harness behaviour, see it work natively" (#1053). |
| #1050 | "Cross-harness memory, resume and run is already possible through current issue and memory logic." | Research undersold existing capability. |
| #1056 | "With agents getting more intelligent, what might limit their capabilities and what isn't really necessary?" | Plan baked process rails and sync-only limits into contracts (#1071). |
| #1090, #1192 | "This kind of explanation gives me zero understanding ... I need the context and implementation scenario" / answers lost on reload; save in between; simpler mechanism. | Decision text written for critics; picker state in the browser. |

### What the plan rounds got wrong before correction (summary)

1. **Product definition** — a local delivery tool with extension points, not a block platform (#863, #864).
2. **Order of extensibility** — third-party/outside authors last; proof was one trusted local extension swapping an implementation (#847, #894).
3. **Packaging** — multiple add-on packages (#464) vs. owner's one package with open APIs (#466).
4. **Config** — one internal resolver over a fixed four-phase graph, unknown sections silently ignored (#894).
5. **Opinionated workflow as the product** rather than one template (#864).
6. **Scope locking** — required all delivery work, including optional speed work, before locking release scope; calendar from merge rates (#821, #822).
7. **Trust** — local extensions "trusted" by hash and locality without recorded consent (#850, #853).
8. **Business model** — revenue tiers and marketplace take instead of open-source adoption (#924).
9. **Audience** — public upgrade/compat promises for a product whose launch is an experiment (#929–#933); team-of-operators resourcing for a solo owner (#1010).
10. **Competing with SDKs/runtimes** — Flow DAGs and a generic invoke runtime drifting into Mastra/LangGraph/AI SDK territory (#946).
11. **Harness tiering** — Pi missing, OpenCode experimental, contrary to where the owner sees adoption (#981, #1010).
12. **Bloat** — decisions grew 9 → 17 → 34 → 45 → 54 and effort to 126–220 agent-days before simplicity research cut it to 92–163 (#1009, #1055). An arithmetic error hid 12–20 days (#1055).
13. **Sync-only execution and a closed 37-family capability list** at risk of becoming permanent contract assumptions (#1071).
14. **Language** — fine as decided (stay JS + ship TS types; Rust only for a measured hot path) (#980); noted because it was re-litigated (#1021).

---

## 8. Top 10 lessons for the rebuild

1. **Authority must be adoptable from any path** → *design rule*: any state an agent creates outside Forge (a PR via `gh`, a branch, a worktree) can be linked back through one public, idempotent operation; guarded actions refuse with the exact adopt command, never silently (#268, #275, #804).
2. **Gates judge outcomes on the exact artifact and fail closed** → *keep + design rule*: receipts bind to exact head/lease/worktree; unknown, unparsable or missing evidence is a fail, never a pass; every gate ships with a test that it fails on bad input (#68, #614, #672, #758, #784).
3. **Fix the invariant, not the instance; cap rounds** → *design rule*: after ~3 review rounds on one PR, stop and find the wrong authority or missing invariant; done-bar = P0/P1 + PR-caused regressions, adjacent P2 becomes a filed issue (#285, #385, #389, #390).
4. **CI is the proof; local ceremony is optional** → *drop* mandatory local full-suite validation and test-first ordering hooks; *keep* fast focused local checks and exact-commit CI evidence; shard with fail-fast (#402, #408, #412, #1071).
5. **One package, open APIs inside, a few templates on top** → *design rule*: no add-on packages for core blocks; public `exports` + TypeScript types for the block contract and config API from day one; the delivery workflow is a template that no core schema names (#466, #894, #980).
6. **Outside author first** → *design rule*: the acceptance proof is an outsider adding a genuinely new capability from public docs only, composed via config, working natively in Pi, OpenCode and Codex; not swapping an internal implementation (#894, #1053).
7. **Complement, don't compete** → *drop* any Forge-owned agent loop, model calls, provider abstraction, general DAG/runtime; *keep* authority, memory, verified blocks, config composition and evidence exposed into existing harnesses and SDKs; adopt a better external tool as a block when it exists (#946, #947, #1043).
8. **Config is the product surface and must be loud** → *design rule*: typed schema, validator, side-effect-free explain/preview, undo, per-harness "written/trusted/loaded/active/denied" status, actionable errors; unknown config sections are errors, never ignored (#894, #1053).
9. **Agents must not be able to weaken structural gates** → *design rule*: quarantine/skip requires cited CI evidence and is itself a gated, logged change; no hook bypass; reviewers reject "re-run until green" (#752, #767, #1071).
10. **Survive restarts, measure the real thing, say it plainly** → *design rule*: long-running drivers are singletons with leases and resume, hung ≠ running, single writer per shared state; size/perf checks measure what ships; every report leads with the answer in plain language, evidence, alternatives and what would change it, and treats owner restatements as plan gaps, not pivots (#541, #993, #106, #618, #421, #910, #1011, #1090).
