> Superseded in part on 2026-10-16 by the new-project rebuild plan — see [../2026-10-16-platform-rebuild/rebuild-plan.md](../2026-10-16-platform-rebuild/rebuild-plan.md).

# Forge north star (owner, 2026-09-30)

This supersedes the product definition in plan.md and blocks/blocks-plan.md. Both described Forge as "one local tool that remembers intent, owns issues, isolates work in worktrees, keeps proof, and resumes safely". The owner rejected that as wrong for what Forge is becoming.

## Definition

Forge is an **unopinionated platform of building blocks**:

1. **Anyone can build a block and plug it in.** A developer or an agent writes a new block and composes it with existing ones, without rebuilding what already exists. Existing blocks and their capabilities are reusable parts.
2. **Config is the layer that connects blocks.** It's built through proper APIs that are simple enough for any agent to generate and validate, yet expressive enough for rich compositions. Config is the product surface, not an afterthought.
3. **Non-opinionated.** Forge provides the parts. Developers build their own opinionated solutions from them. Forge's own workflow (the TDD stages, Kernel-backed issues, guarded delivery) is one reference solution built on the platform, not the product itself.
4. **Native harness connectivity.** Forge's native system connects any solution built on it to any agent harness (Claude Code, Codex, Cursor, OpenCode, Pi, Hermes, and others).

5. **A marketplace for blocks and templates.** Community and third-party blocks and templates are published and discovered through a Forge marketplace. **Demand drives the roadmap.** Forge builds what is asked for, and promotes popular community extensions over time into native, supported Forge blocks, so the platform grows richer and more stable as it matures.
6. **Cloud as a second layer.** An optional Forge cloud provides data saving and sync: storage, backup and sharing of Forge data. Local-first stays the base, and cloud is additive.
7. **Agent-first, no UI in the core.** Forge is built for agents, and agents don't need a UI. The primary interfaces are the CLI, the APIs, config and harness integrations. A UI is an **optional, separate visualization domain**: it shows setups and what agents are doing, and offers saved logs and history for people who want them. It's not part of the core platform, and it consumes the same public APIs and events as any external app. The core must expose enough structured events and state for such a UI to be built, and shouldn't build that UI itself in 0.1.0. Forge's **native visualization app** (first-party, but separate from the core) shows native information. That information is **searchable** and **editable**: setup and config are edited through the same config APIs agents use, never by a side door. The app also **visualizes the setup**: which blocks, how they're composed, and what agents are doing. It's also **extensible like any normal app**: people build their own UI layers, panels and views and add them as UI plugins (as Grafana panels or VS Code views work), fed by the same events/state API. That mirrors the block model on the core side.
8. **Build on Forge's own system instead of self-hosting.** Not everyone can host and build everything themselves. External solutions may run on Forge's hosted system: its cloud storage and sync, auth and scoped grants, events, and hosting for a solution's UI (e.g. as a plugin in the native visualization app) or its lightweight backend. Self-hosting remains fully supported, and hosted is the convenient default for those who want it.
9. **Bring your own solution and UI.** Forge can't support every feature inside a plugin UI. Users bring their own solutions with their own UIs, connected seamlessly to Forge's capabilities through its APIs. The cloud enables **secure, clean data transfer between these solutions and Forge**, with explicit consent, scoped access and a clear data contract.

10. **Open source, exposure-first; revenue is not the goal.** The core is open source, and the marketplace is open too. Securely testing and verifying community blocks and configs (conformance and security checks) is a built-in platform feature, not a paid tier. Forge aims to become **the one-stop extension layer that integrates with any agent or harness**: agent frameworks and SDKs (e.g. LangGraph, Mastra, Vercel AI SDK), headless, background and CI agents, MCP clients, and chat-style coding harnesses alike. Success is measured by adoption and reach: integrations, outside authors, blocks reused, solutions built, and integration work saved. Revenue chances are acknowledged to be low. Hosted infrastructure (optional cloud, hosting, index, verification runs) still has real costs, and the plan must say how they're sustained (e.g. sponsorship or grants, minimal self-host-first hosting, or an optional paid hosting tier that never gates core features).

11. **Productivity first, not agent hype.** Forge is built for actual productivity: improving the quality and efficiency of real work. It's used both inside **deterministic workflows** (a block as a reliable step) and inside **agents** (a block as a tool, memory or guardrail). The plan must say clearly how each kind of user integrates it, and when a workflow beats an agent. Don't design around common misconceptions about agents (autonomy for its own sake, replacing judgement, "more agents is better"). Design around measured outcomes: fewer defects, less rework, faster cycle time, less integration effort, and work that can be reviewed and recovered.

12. **Complement every main harness through its native extension system.** For OpenCode, Claude Code, Cursor, Codex and Pi (owner, 2026-10-01: Pi is a supported target harness and the priority exposure space, because its users experiment with and customise their setups, which matches Forge's block model) (and ChatGPT and other agent surfaces), Forge never replaces the harness. It ships a proper plugin or extension for each that uses that harness's own capabilities (plugins, skills, hooks, subagents, rules, commands, MCP, marketplaces), the way T3 Code complements harnesses. The same complement and productivity rules apply to all of them.

## Owner direction, restated 2026-10-02 (the plan must reflect these; where plan text falls short, the plan is wrong)

13. **One maintainer.** The owner is the only person. Every forecast assumes one human plus agents; there are no operators to commission. Launch-and-release decisions 2, 3, 5 and 6 are decided A.
14. **Re-divide the core blocks by function, and make Contracts the composition API.** Reuse the existing Contracts, Flow, Memory and Kernel code (no rewrite of working logic), but redraw their boundaries by what each does. Contracts is rewritten into the API and config writer that connects blocks, with one generic resolve, bind, admit and invoke path.
15. **A complete, explicit block catalogue.** Blocks are capabilities that become useful when composed into structure and flow, and people customise them as they want. The catalogue covers at least:
    - skills, MCP, agents and workflows;
    - config;
    - linting, PR security stages and PR review;
    - planning;
    - issues, memory, decisions and a connected graph layer.

    The goal is efficiency and structure.
16. **Knowledge that makes agents stronger, durable across devices and shared across projects.** Issues, memory, decisions and a connected graph layer, with SQLite FTS for search. Scopes: repo memory (today), plus **device memory** for user-level and cross-project work, and cross-device sync through the cloud. Assets such as skills are shareable across repos. Where something is too big to build now, integrate an existing tool; build native later on demand.
17. **Efficient runtime.** The language choice (JavaScript, TypeScript, Rust or Python) must be justified by efficient running across many projects and low memory use, not by habit.
18. **Harness tiers.**
    - **Mandatory:** Pi, OpenCode and Codex.
    - **Well supported, but not release-blocking:** Claude Code and Cursor.

    Using every capability each harness offers is how Forge leads and controls harnesses the way users want.

19. **The core promise is easy control.** A user can take control of any harness and add any new capability in a very simple way, without much effort:
    - think of a missing feature and just add it;
    - edit or change how a harness behaves, your own way, through one place;
    - see the change show up natively in every harness you use.

    Simplicity of adding and editing is the headline value. Drop parts of the plan that add effort without serving it.

## Constraints that still hold
- One npm package for Forge itself. Third-party blocks may live in other packages that depend on Forge's public contracts.
- The Kernel is the sole authority for issue/workflow state (D44).
- Gates are never weakened.
- Dynamic composition is not sandboxing, so trust must be explicit.
- Inspiration: Cordis (services, reactive requirements, validated config, owned cleanup) and DeepSeek Harness (ordered profile and patch layers; configuration as executable architecture).

## Consequences for the plan
- Third-party and user-built blocks are **first-class in 0.1.0's design**, not deferred to after 1.0. The block contract, discovery, trust and versioning must be designed for outside authors from the start. The release can still stage what is *supported* versus *experimental*.
- The config API must be agent-first: typed schemas, generated docs, a validator, scaffolding, a dry-run/explain, and actionable errors. The measure is that an agent can compose a working solution from blocks with no human help.
- The public surface is the block contract, the config API, and the capability catalog of existing blocks. It's not a narrow list of internal modules.
- The marketplace, the cloud layer and bring-your-own-UI integration are part of the target architecture. The 0.1.0 design must leave clean seams for them: a block/template identity and publishing format, a data contract and sync boundary, and external-app APIs with scoped auth. The plan decides what ships in 0.1.0 and what's staged for later.
- The release criteria must include proving the platform promise: an outside-authored block built, plugged in and composed, using only the public docs and APIs.
