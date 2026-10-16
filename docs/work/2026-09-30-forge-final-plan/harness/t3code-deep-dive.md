# T3 Code deep dive: the host boundary becomes the Forge boundary

Decisions needed: choose the first supported T3 host profile and upstream scope; defaults are at the end. This is a research deliverable, not implementation authorization.

## Request and evidence identity

| Field | Preserved value |
| --- | --- |
| protocolVersion | 1.0 |
| requestId | forge-deep-t3code-20261001 |
| contextDigest | 8cf1425d023bd0b886bd23b83ec8910c79dd81cfedf03ef0912c21b7dc5bbbb0 |
| context.summary | Forge harness deep dive: T3 Code as a multi-agent host. |
| flowSpec | null |
| cwd | . |
| policy | {"write":true,"tools":[],"maxCostUsd":null} |
| route | {"model":"gpt-6.1-sol","thinking":"xhigh","search":true} |
| Research date | 2026-10-01 |
| Official repository | https://github.com/pingdotgg/t3code |
| Inspected remote main commit | 5cc99e1c23980d7995a13c47f969b47cb68ed1be, committed 2026-10-01T09:10:50Z |
| Latest stable release returned by the official release API | v0.0.44, published 2026-09-29T20:48:58Z |
| Recent preview and nightly returned by that API | v0.0.45-preview.20261001.2518; v0.0.45-nightly.20261001.2525 |

[external, fetched 2026-10-01] The official website links this repository and advertises six providers. The repository README agrees. Documentation lives in the repository, rather than a separate documentation site. The release API and pinned main are different evidence objects: this dossier does not certify that all main features exist in stable v0.0.44. [Official site][SITE], [README][README], [commit][HEAD], [releases][RELEASES].

Evidence notation: **[read; rung 2]** means a specific inspected source/config/schema at the pinned remote commit; **[external]** means a retrieved primary vendor page/API; **[inferred]** is a conclusion from those lines; **[proposed]** is unimplemented design. Rung 4 requires executing the real integration; rung 5 requires reproducing it in the running host. No T3 app, provider turn, hook denial, MCP invocation, plugin installation, or UI was run during this phase. A source-supported loading path is not installed-version proof.

Method and boundaries: read the common brief, north-star.md, P7-harness-plugins.md, canonical Forge research/dispatch skills, and official remote source. The authorized shallow clone into (local scratch) was denied by the filesystem sandbox; shell GitHub requests also failed. Official GitHub connector reads supplied pinned source instead. No context-mode tools or browser were used. Only this dossier was written; no commits, pushes, GitHub writes, Kernel mutations, or unrelated edits were made. Recommendations and risks below remain research artifacts under the brief's read-only boundary.

## Bottom line

1. T3 Code is a control surface over native harness runtimes; its adapter and UI boundaries must be tested independently of the harness. [read] [H1], [H2]
2. The pinned build registers Codex, Claude Code, Cursor, Grok Build, OpenCode, and Antigravity; Pi is not a registered built-in provider. [read] [REG]
3. Codex runs through app-server JSON-RPC, Claude through the Agent SDK, Cursor/Grok/Antigravity through ACP, and OpenCode through its HTTP SDK/server. [read] [C1], [L1], [U1], [G1], [A1], [O1]
4. Codex native homes and Claude SDK setting sources preserve useful plugin/config paths, but managed accounts, isolated homes, and launch overrides change effective behavior. [read] [C2], [C3], [L1], [A2]
5. Skills and slash commands have provider-specific discovery and dispatch; seeing a skill in T3 does not prove every native plugin component loaded. [read] [C1], [L2], [U2], [G2], [O2], [A3]
6. Hook execution and hook visibility are separate: Codex hook notifications lack canonical mapping; Claude maps them, but common activity ingestion omits hook lifecycle rows. [read] [C1], [L1], [H3]
7. Codex and Claude have substantial native-subagent projection; OpenCode exposes child presence and requests with filtered output; ACP providers need stronger visibility proof. [read] [C4], [L1], [O2], [H4]
8. T3 defines its own approval modes, initially Full access, and translates them per provider; those modes are not a uniform sandbox or proof of Forge gates. [read] [MODES], [C4], [L1], [U1], [G1], [O1], [A1]
9. T3's scoped MCP bridge supplies PR linking, browser preview, and device tools; its driver SPI is source extensibility, not a proven drop-in plugin marketplace. [read] [M1], [M2], [M3], [M4], [M5], [M6], [M7], [REG], [SPI]
10. Build native Forge plugins plus a tested T3 host profile first; propose narrow upstream event/identity improvements, and keep Kernel authority and receipts outside T3 presentation. [proposed; §§7-10]

## 1. Architecture and data flow

### 1.1 What owns the loop

[read; rung 2] The environment server owns provider processes, terminals, Git, workspace files, and credentials. Web, Electron desktop, and mobile clients control that server through authenticated RPC. The desktop renderer follows the same server boundary even when it bundles the server. A phone or remote browser does not substitute its own filesystem, home directory, or credentials. [H1]

[read; rung 2] T3 records provider-neutral intent and state. Its engine serializes commands; the decider produces events; the event log, projections, and accepted-command receipt commit together. Reactors execute provider/filesystem effects after intent is durable and feed results back through commands. A command acknowledgement proves acceptance, not completion of the provider turn, Git operation, or checkpoint. [H1]

~~~text
T3 client
  -> authenticated environment RPC
  -> orchestration command -> durable event/projection/command receipt
  -> reactor -> selected provider instance -> native harness loop
  <- native protocol events -> adapter normalization
  <- runtime ingestion -> persisted messages/activities -> client rendering

Hosted agent -> scoped t3-code MCP endpoint
  -> credential-bound thread + capability check
  -> PR orchestration / preview broker / device service

Proposed Forge plugin -> Forge public API/CLI/MCP -> Kernel authority + receipts
~~~

[inferred] Native turn scheduling, tools, parallel tool execution, context compaction, and native stop conditions belong to the selected harness. T3 can stop/intercept/translate a session and controls its own turn queue, but it is not running a universal replacement agent loop. Therefore a provider's CLI feature, protocol feature, adapter mapping, persistence, and UI rendering are five distinct compatibility questions. [H1], [H2], [C4], [L1], [O2]

### 1.2 Driver, instance, thread, project, and environment identity

[read; rung 2] A driver kind chooses integration code; a provider instance identifies configuration and account lifecycle. Thread/session bindings reference instance IDs. Slugs are 1-64 characters, begin with a letter, and then allow letters, digits, underscores, and dashes. Driver kinds are an open schema so unknown kinds survive storage/wire round trips. Runtime availability remains controlled by the static built-in registry; an unknown configured driver becomes an unavailable snapshot. [IDENT], [REG]

[read; rung 2] ProviderDriver.create receives instanceId, displayName, accentColor, environment, enabled, and decoded config. It owns per-instance resources and cleanup; separate instances must not share mutable process/catalog state. The driver provides snapshot/catalog, adapter, text generation, continuation identity, and optional authentication. This is a useful internal SPI for a source contribution. Adding a driver also requires registry and runtime dependency changes. It is not an npm install mechanism. [SPI], [REG]

[read; rung 2] The internal MCP credential binds environmentId, threadId, providerSessionId, providerInstanceId, capabilities, and issuedAt. PR handlers derive the project from the bound thread projection. Tool input cannot select a different thread or project. A T3 thread ID, provider-native session/thread ID, and Forge issue/run ID are separate identifiers; a proposed integration must store their explicit mapping rather than treating cwd or a title as identity. [M2], [M3], [M7]

### 1.3 Provider transports and execution contracts

| Hosted harness | Actual source-backed execution path | What this means for Forge |
| --- | --- | --- |
| Codex | Installed codex executable, app-server subcommand, stdio JSON-RPC; initialize, thread/start or thread/resume, turn/start; generated app-server client/schema. [C1], [C4] | Install into the effective native Codex home/project. T3's request overrides and event mappings also need proof. |
| Claude Code | Agent SDK query(prompt, options), selecting installed Claude executable; SDK owns native process/tool loop. Dependency pin inspected by the provider lane: @anthropic-ai/claude-agent-sdk 0.3.276. [L1], [DEP] | Prove plugin/settings loading in SDK mode; a successful terminal Claude run alone is insufficient. |
| Cursor | cursor-agent, optional endpoint, permission flag, acp; ACP stdio. [U1] | CLI/ACP semantics apply, not the full Cursor editor extension model. |
| Grok Build | grok plus native permission arguments, agent stdio; ACP with xAI-specific extensions. [G1] | Preserve native inspect/catalog data; do not assume Codex-style hooks or agent visibility. |
| OpenCode | @opencode-ai/sdk/v2 HTTP client; local opencode serve or configured external server. [O1], [O2] | SDK /v2 is not support for OpenCode product 2.x. Native server ownership/config caching matters. |
| Antigravity | Installed/resolved native executable; ACP stdio; isolated instance profile/process temp. [A1], [A2] | Test the T3 profile, client filesystem operations, and native settings isolation. |
| Pi | No Pi entry in the complete built-in driver array. [REG] | Blocked as a stock hosted-provider target at this SHA. Pi's standalone Forge priority remains independent. |

### 1.4 Context, instructions, memory, storage, and recovery

[read; rung 2] T3 appends runtime identity/model/effort and PR-linking instructions. Those instructions ask the agent to register every PR it creates or works on and verify the complete linked list. They do not confer Forge issue ownership or authorize a stage transition. Codex restores additional client developer instructions after native compaction because that client context can be lost. Claude uses the claude_code system-prompt preset and supports SDK/native compaction with an optional configured threshold. [RI], [C4], [L1], [CDOC], [LDOC]

[read; rung 2] Server paths include userdata/state.sqlite, userdata/settings.json, provider logs, attachments, browser artifacts, environment-id, and server-runtime.json, derived from the selected base directory; dev mode can select a separate dev directory. CLI flags and T3CODE_HOME select that base. Native harness histories remain separate from T3's projections. The existence of a T3 message does not establish that native resume state still exists. [PATHS], [CLI], [H1], [C4], [L1], [O2]

[read; rung 2] Conversation, provider session, workspace checkpoint, and terminal recovery have different semantics. Checkpoints use hidden Git refs, not user-branch commits. Turn completion and later checkpoint/diff settlement are separate. File restore is restricted to eligible worktrees and refused when shared with another session/thread. Antigravity can checkpoint files but cannot rewind its conversation. [H1], [H2], [COMPOSER]

[read; rung 2] Restart agent session lets the conversation continue while a new provider process reloads skills/plugins/MCP. Continue threads after restarts is off by default; enabling it does not start the T3 server automatically or recover interrupted terminal commands. Provider callbacks waiting for approvals may not survive a recovered session; the reactor explicitly reports stale callback state. Codex async questions have a separate durable answer path. [COMPOSER], [UPDATES], [H5], [CDOC]

[inferred] Forge memory recall, active issue/lease, stage checkpoints, and completion receipts should be reloaded from Forge on resume or compaction. They should not depend on the T3 visible chat retaining a previous orientation paragraph. This follows the approved north star's Kernel authority boundary.

### 1.5 Configuration resolution

| Layer | Verified resolution/behavior | Forge consequence |
| --- | --- | --- |
| T3 process config | CLI host/port/base-dir/no-browser flags plus environment configuration; data base is distinct from project cwd. [CLI], [PATHS] | Diagnose the owning environment, not the client machine. |
| T3 environment/provider settings | settings.json decoded through typed schema; instance-specific config and environment entries; sensitive values redacted for clients. [SET], [IDENT], [SETTINGS] | Configure the effective provider instance and protect secrets; do not print settings containing credentials. |
| T3 project overrides | Project override -> environment value -> repository t3.json -> built-in default for file-backed settings. Only declared file-backed keys participate; others use their own settings resolution. [PDOC], [PFILE] | A checked-in t3.json does not override a user's explicit host/project choice. |
| Native Codex | Ordinary/custom CODEX_HOME; native config loading with explicit T3 app-server/turn overrides. Shadow homes preserve shared entries; managed authentication has additional overrides. [C1], [C2], [C3], [C4], [CDOC] | Prove which home and mode was actually selected before claiming the Forge plugin is loaded. |
| Native Claude | SDK settingSources includes user, project, local; optional CLAUDE_CONFIG_DIR; T3 passes launch args as SDK extraArgs and folds permission flags into SDK options. [L1], [LDOC] | Native configuration participates, but explicit SDK model/permission/cwd options remain decisive. |
| Native Cursor/Grok | ACP executable with resolved cwd and merged environment; T3 adds native mode/config changes. [U1], [G1] | Native project/user loaders are provider-owned; project+user fidelity is not proven merely by cwd forwarding. |
| Native OpenCode | Local child inherits config/environment including OPENCODE_CONFIG_CONTENT; external server owns its configuration and reload lifecycle. [O1], [ODOC] | The T3 client's local home cannot configure a remote external server. |
| Native Antigravity | T3 instance profile becomes GEMINI_HOME; user skill directories are linked into it, while ordinary user-global MCP/hooks/rules are not carried through by those skill links. [A2], [H2] | A plugin installed into the real user home can appear partly present through skills while hooks/MCP/rules remain absent from the effective profile. |

## 2. Pass-through matrix

**Status vocabulary:** **Passes through** = a positive native loading/transport path exists in the inspected source; it is still conditional on a compatible installed provider. **Partial** = translation, scoped discovery, isolation, event loss, or native behavior not proven. **Blocked** = unavailable on the examined host path. **T3-native replacement** = T3 supplies its own implementation/selection/presentation. No cell is a rung-4/5 certification.

To keep the matrix readable it is split by provider group. Every requested surface appears in both tables. OpenCode cells describe the supported 1.x integration; product 2.x compatibility is addressed separately. References identify the actual source file and line anchor in §11.

### 2.1 Codex, Claude Code, and Cursor

| Forge surface | Codex | Claude Code | Cursor |
| --- | --- | --- | --- |
| Plugins/packages | **Partial:** ordinary and shadow homes preserve plugins/config; managed mode changes launch/provider behavior. T3 supplies no plugin install UI proof. [C2], [C3] | **Partial:** user/project/local SDK settings enabled; no explicit SDK plugins option from T3. Native installed plugin discovery needs SDK-mode proof. [L1] | **Partial:** ACP process can load native configuration; no inspected T3 plugin inventory/loader proves complete CLI-plugin fidelity. [U1], [U2] |
| Skills | **Passes through:** native Codex skill input/catalog and native homes; UI remains provider catalog driven. [C1], [C2] | **Partial:** scans config-home skills and project .claude/skills; user wins; disabled/non-user-invocable filtering; last recognized $skill becomes /skill. [L2], [L3] | **Partial:** scans user/project .cursor/.agents/.codex/.claude skill roots; rewrites $skill to /skill. This is T3 discovery, not proof every native root/plugin skill is present. [U2] |
| Own hooks; can they block? | **Partial:** native app-server retains harness ownership of enabled/trusted hooks; hook notifications are not mapped by CodexAdapter. Native denial needs installed-version proof. [C1], [C4], [CHOOK] | **Partial:** SDK settings sources and native execution remain; SDK hook system messages map to canonical events. Native pre-tool denial is separate from T3 canUseTool; live denial unrun. Common ingestion lacks hook activity rows. [L1], [H3] | **Partial / unproven:** native ACP cwd/env path exists; no dedicated T3 hook mapper or proof of hook blocking on this path. [U1], [U3] |
| Slash commands/prompt templates | **Partial / T3-native replacement:** native provider command support and skills coexist with T3 /model and /plan; do not equate all terminal commands with GUI commands. /feedback is explicitly documented. [C1], [CDOC], [COMPOSER] | **Partial:** native commands/skills invoked through SDK prompt handling; /compact supported; T3 reserves its own composer commands and rewrites skill mentions. [L1], [L3], [COMPOSER] | **Partial:** ACP AvailableCommandsUpdated refreshes the catalog; native commands coexist with T3 reserved composer commands. [U3], [COMPOSER] |
| Subagents/custom agents + visibility | **Partial:** strong collab child interception, synthetic agent/task events, status/model/effort projection; not an unchanged native transcript. Custom agent files remain native config-dependent. [C2], [C4], [H4] | **Partial:** native SDK agents/tasks with owner/model/effort and workflow-member projections; T3 fleet view displays folded state. Custom agent configuration native-dependent. [L1], [H4] | **Partial / unproven:** ordinary ACP events present; no explicit child-session identity bridge established in inspected adapter. Native subagent execution must be tested separately from fleet visibility. [U3] |
| AGENTS.md / CLAUDE.md / rules | **Passes through, native conditional:** workspace cwd and effective CODEX_HOME reach app-server; Codex owns AGENTS loading. T3 does not parse the project instructions itself. [C2], [C4] | **Passes through, native conditional:** cwd + claude_code preset + user/project/local settingSources enable the native instruction path. AGENTS.md is not automatically a Claude instruction file. [L1] | **Partial / unproven:** native Cursor ACP owns rules loading; cwd/env forwarding proves the path, not editor-equivalent rules precedence. [U1], [U3] |
| MCP: project and user config | **Passes through, native conditional:** preserves normal config; appends t3-code config rather than replacing all MCP; reloads MCP before turns when host MCP args exist. Managed provider still needs proof. [C1], [C2], [C3], [C4] | **Partial:** SDK sources enable native config and adds t3-code HTTP server. Separate project/user MCP presence, OAuth/trust, and plugin MCP must be proved on SDK path. [L1] | **Partial:** supplies host MCP via ACP session input; native project/user MCP are not enumerated/rebuilt by T3. [U3] |
| Permissions / approvals | **T3-native replacement + native enforcement:** runtime mode chooses approval policy/reviewer, translates native command/file/MCP/app requests into T3 panels, sends native replies. [C1], [C4], [MODES], [APPROVAL] | **T3-native replacement + native enforcement:** derived SDK permissionMode plus canUseTool allow/deny callbacks; launch args can override derived mode. [L1], [MODES], [APPROVAL] | **T3-native replacement:** auto -> --auto-review; full -> --force; ACP requests/reply option IDs rendered by T3. [U1], [U3], [APPROVAL] |
| Sandbox settings | **Partial:** explicit per-turn sandbox/approval mapping overrides defaults; full access differs materially from restricted modes. No independent Forge sandbox control in T3 schema. [C4], [SETTINGS] | **Partial:** native sandbox config may participate through settingsSources; SDK permission mode/callback is not an OS sandbox. T3 has no uniform sandbox schema. [L1], [SETTINGS] | **Partial / unproven:** --force/ACP mode governs permissions, not a demonstrated OS sandbox. No separate T3 sandbox control found on the inspected schema. [U1], [SETTINGS] |
| Session resume | **Passes through with translation:** native thread/resume and durable cursor, narrow missing-thread fallback, continuation identity by home/account compatibility. [C4], [CDOC] | **Passes through with translation:** SDK resume/session identity; same config directory required for account continuation. Native history is distinct from T3 chat. [L1], [LDOC] | **Passes through, native conditional:** saved ACP ID passed as resumeSessionId with cwd; no proven cross-cwd history fork equivalent. [U3] |
| Worktrees | **T3-native replacement:** host selects/creates cwd/checkpoints; Codex executes there. Forge issue/worktree binding is not automatically created. [H5], [PDOC] | **T3-native replacement:** same host worktree layer, then SDK cwd. [H5], [L1] | **T3-native replacement:** same host workspace layer, then ACP cwd. [H5], [U3] |
| cwd / environment | **Partial:** workspace cwd and merged instance env; CODEX_HOME/shadow home, T3 MCP/device env; managed mode removes ambient API/base-url overrides. [C3], [C4], [M5] | **Partial:** cwd and instance env, CLAUDE_CONFIG_DIR; T3 options/extraArgs and MCP/device additions. [L1], [LDOC] | **Partial:** resolved cwd, merged env, optional endpoint and native mode flags, host MCP/device additions. [U1], [U3] |
| Events surfaced in UI | **Partial:** text/tools/reasoning/approvals/usage/collab/async questions; native notification families without mapper cases are lost. Hooks lack canonical mapping. [C1], [C4], [H3], [H4] | **Partial:** text/tools/thinking/tasks/approvals/usage and hook canonical emission; hook canonical emission does not guarantee timeline rows. [L1], [H3], [H4] | **Partial:** ACP text/thought/tool/plan/approval/user-input/command updates; complete custom/native event fidelity unproven. [U3], [H3] |
| Model / effort | **Partial:** T3-selected model/effort/service options carried into native requests; leaving reasoning/tier unset can use provider config; native reported model may differ. [C4], [COMPOSER] | **Partial:** explicit SDK model/effort and T3 manifest capabilities; router/custom models may offer fewer controls than built-ins. [L1], [LDOC] | **Partial:** ACP list_available_models plus session config options for reasoning/context; only advertised/applicable options exposed. [U4] |
| Native TUI/status line/output style/editor UI | **T3-native replacement:** T3 rendering/fleet/context meter replaces terminal UI; native config effects on generated text may remain, but no TUI extension pass-through claim. [H1], [H4] | **T3-native replacement:** SDK stream and T3 GUI replace Claude terminal status line; configured prompt/output effects require native proof. [L1], [H4] | **T3-native replacement:** ACP GUI does not embed the Cursor editor/plugin UI. [U1], [H1] |

### 2.2 OpenCode, Grok Build, Antigravity, and Pi

| Forge surface | OpenCode 1.x | Grok Build | Antigravity | Pi in stock T3 |
| --- | --- | --- | --- | --- |
| Plugins/packages | **Partial:** native server configuration preserved locally; external server owns its installation. No T3 plugin inventory. [O1], [O3] | **Partial:** native inspect reports plugin-sourced skills; this does not certify other plugin surfaces. [G2] | **Partial:** isolated profile; no demonstrated host plugin loader/full user plugin inheritance. [A2], [H2] | **Blocked:** no registered driver. [REG] |
| Skills | **Passes through with catalog translation:** native server returns skills/agents; host catalog refresh needed. [O2], [O3], [ODOC] | **Passes through with catalog translation:** grok inspect --json honors native skill sources/disable config. [G2] | **Partial:** dedicated roots/precedence; real user skill dirs linked into profile; user ~/.agents/skills excluded. [A3], [H2] | **Blocked.** [REG] |
| Own hooks; can they block? | **Partial / unproven:** native plugins/events may run inside server; no T3 hook family or installed denial proof. [O1], [O2] | **Partial / unproven:** native executable config path exists; no hook-specific bridge or blocking proof. [G1], [G3] | **Partial / isolated:** user-global hooks not inherited merely by skill linking; profile/project hooks, where supported natively, need separate proof. [A2], [H2] | **Blocked.** [REG] |
| Slash commands/prompt templates | **Passes through with interception:** native command.list then session.command; ordinary turns use promptAsync. Reserved T3 commands still apply. [O2], [COMPOSER] | **Partial / unproven:** native skills discoverable; no complete native command catalog bridge established. [G2], [G3] | **Partial:** native ACP available commands become workspace commands; T3 reserved commands remain. [A4], [COMPOSER] | **Blocked.** [REG] |
| Subagents/custom agents + visibility | **Partial:** native agents exposed; child sessions tracked; child approvals/questions routed; ordinary child output filtered from parent. Complete child transcript/fleet proof pending. [O2], [O3] | **Partial / unproven:** ACP extensions/background tasks exist; complete named-agent/child-transcript visibility not established. [G3] | **Partial / unproven:** no complete child identity/fleet bridge established. [A4] | **Blocked.** [REG] |
| Rules / instruction files | **Partial, native conditional:** server directory/config determines native instruction loading; external server's home wins. [O1], [O2] | **Partial, native conditional:** cwd/env forwarded; native loader owns discovery. [G1], [G3] | **Partial:** isolated GEMINI_HOME excludes real user-global rules; workspace rules require native ACP proof. [A2], [H2] | **Blocked.** [REG] |
| MCP: project and user config | **Partial:** native configuration remains; internal t3-code added only to locally owned server, not external. Native project's/user's MCP need a server-side check. [O1], [O2] | **Partial:** host bridge passed over ACP; native MCP config fidelity unproven. [G3] | **Partial:** internal bridge passed to chat; setup/text helpers get no MCP; real user-global MCP not inherited through skill links. [A2], [A4], [H2] | **Blocked.** [REG] |
| Permissions / approvals | **T3-native replacement:** host permission rule set; auto falls back supervised; workspace grants can span sessions; full access uses once replies rather than broad persistent grants. [O1], [ODOC], [H2] | **T3-native replacement + native flags:** default/acceptEdits/auto or always-approve; session grants match operation/tool input. [G1], [G3], [MODES] | **T3-native replacement + native mode:** default/auto_edit/yolo; native approvals can still occur in full access. [A1], [A4], [MODES] | **Blocked.** [REG] |
| Sandbox settings | **Partial / unproven:** permissions are not OS isolation; local/external process ownership matters. [O1] | **Partial / unproven:** permission flags not a separate sandbox contract. [G1] | **Partial:** client FS permission bridge and isolated profile are not a complete native sandbox; ACP terminal capability false. [A1], [A4], [H2] | **Blocked.** [REG] |
| Session resume | **Passes through with translation:** adopt ID; fork native history into new cwd/worktree; missing session starts fresh. [O2] | **Passes through, native conditional:** durable ACP ID and resolved cwd. [G3] | **Passes through, native conditional:** ACP resume; invalid cursor fails rather than silently resetting. [A1], [A4] | **Blocked.** [REG] |
| Worktrees | **T3-native replacement:** host cwd; native session fork if directory changes. [H5], [O2] | **T3-native replacement:** host workspace then ACP cwd. [H5], [G3] | **T3-native replacement:** host workspace then ACP cwd/checkpoints; no conversation rewind. [H2], [A4] | **Blocked.** [REG] |
| cwd / environment | **Partial:** owned server cwd/config/env or external server's environment; per-thread owned chat servers avoid directory-scoped MCP collisions. [O1], [H2] | **Partial:** cwd/instance env plus GROK_OAUTH2_REFERRER=t3code and mode arguments. [G1] | **Partial:** instance GEMINI_HOME, stripped ambient Google credentials, forced file auth, per-process temp/browser/harness paths. [A2], [H2] | **Blocked.** [REG] |
| Events surfaced in UI | **Partial:** event.subscribe normalization; child presence/requests but filtered child stream; no complete native/plugin event fidelity. [O2], [H3] | **Partial:** ACP plus xAI plan/other extensions; unmapped native extension data not guaranteed visible. [G3], [H3] | **Partial:** ACP text/tools/permission/input/commands; native option IDs must survive normalization. [A4], [H2] | **Blocked.** [REG] |
| Model / effort | **Partial:** provider/model, primary agent, native variant passed per turn; catalogs can cache config. [O2], [O3], [ODOC] | **Partial:** ACP model and reasoningEffort sent using session/set_model metadata. [G1] | **Partial:** model through native config/switching; no reasoning-effort control established. [A1] | **Blocked.** [REG] |
| Native TUI/status line/output style/editor UI | **T3-native replacement:** HTTP events rendered in T3, not OpenCode TUI plugins. [O2], [H1] | **T3-native replacement:** ACP rendered in T3. [G3], [H1] | **T3-native replacement:** ACP rendered in T3, not native IDE extension UI. [A4], [H1] | **Blocked.** [REG] |

### 2.3 What the matrix does and does not establish

[read; rung 2] Native Codex home forwarding and Claude settingSources are positive configuration paths. Cursor/Grok ACP cwd/env and OpenCode inherited config are positive transport paths, but do not establish complete user/project MCP, plugin, rule, or hook semantics. Antigravity has affirmative isolation evidence: linked skill directories do not bring real-home MCP/hooks/rules into its profile. A narrow configuration pass-through claim is stronger than an unsupported universal claim. [C2], [L1], [U1], [G1], [O1], [A2], [H2]

[read; rung 2] T3's bundled compatibility policy marks OpenCode >=2.0.0 broken and supports >=1.14.19 <2.0.0, recommending 1.14.19 at this source pin. The merged compatibility change records a discovery timeout with OpenCode 2.0.3. This is a compatibility/support barrier; do not describe every manually attempted 2.x session as impossible merely because the advisory exists. [OCOMP], [OPR]

[inferred] Forge capability certification must key on (host build, provider driver, provider version, provider instance mode/home, operating system, transport, project settings). A single “Codex supported” or “OpenCode supports plugins” flag cannot represent this matrix.

## 3. Native hooks, commands, agents, and policy boundaries in detail

### 3.1 Hooks: the execution boundary and event boundary

[read; rung 2] CodexSessionRuntime forwards ordinary native notifications, but CodexAdapter.mapToRuntimeEvents lacks hook lifecycle cases and logs zero-event mappings as ignored. The generated app-server protocol includes hooks/list and hook/started/completed. This establishes notification loss at the adapter; it does not establish whether any particular Forge hook was enabled/trusted or successfully blocked a tool. [C1], [C4], [CHOOK]

[read; rung 2] Claude SDK system messages hook_started, hook_progress, and hook_response map to canonical hook.started/progress/completed. Canonical payloads are:

| Canonical event | Exact fields in the T3 contract |
| --- | --- |
| hook.started | hookId, hookName, hookEvent |
| hook.progress | hookId; optional output, stdout, stderr |
| hook.completed | hookId, outcome success/error/cancelled; optional output, stdout, stderr, exitCode |

[read; rung 2] These are observation payloads, not a host hook registration API and not native PreToolUse stdin/return contracts. T3 does not provide a return value here to block/modify/inject a harness tool. Native hook decisions belong inside the native process. T3's independent permission callback/ACP reply path can also allow or deny actions. [L1], [EVENT]

[read; rung 2] The common activity-conversion switch in ProviderRuntimeIngestion handles requests, tool denial, warnings, tasks, context changes, and tool lifecycle, then defaults to an empty list. It does not add hook lifecycle activity rows. Thus even Claude canonical hook emission cannot be advertised as rendered hook evidence. Native logs and Forge's own receipt sink are required until an upstream UI mapping is implemented and tested. [H3]

[inferred] No uniform host-level hook timeout, hook input-rewrite contract, hook retry policy, or hook package trust API exists in this observed stream. The native harness version defines those semantics. Exact native lifecycle/timeout/return-value support must be pinned in each native harness dossier and exercised through this host. In particular, Full access must never be used as evidence that deny-capable Forge hooks are loaded; approval policy and hook execution are distinct.

### 3.2 Skill and command collisions

[read; rung 2] T3 composer commands /model and /plan can appear on any line; provider commands must start the message. Dollar skill mentions are interpreted by provider-specific discovery. Claude directly dispatches only the last named skill per message; manual-only skills can reject an earlier model Skill call. Claude user skills outrank project same-name skills in T3's scan. Cursor scans several cross-harness roots. Antigravity intentionally excludes user ~/.agents/skills while accepting project .agents/skills. [COMPOSER], [LDOC], [L2], [L3], [U2], [A3]

[proposed] Forge should test names and invocation semantics on the effective provider. A generic Forge command called /plan collides with the host-native interaction command; prefer a discovered Forge skill/plugin namespace where available and document the literal entry point. Test user-only skills, multiple mentions, duplicate names across roots, disabled skills, project cwd changes, and session restart. Do not solve discovery by making every command model-invocable.

### 3.3 Subagents and background work

[read; rung 2] Codex child notifications are intercepted and transformed into collabAgent events; some known chatter is suppressed and unknown child notifications fall through. Claude SDK tasks carry owner, model/effort, status, and usage, with workflow member progress kept out of parent text. The Agents panel folds canonical state and shows status, role, model/effort, elapsed time, usage, and latest activity. It is a presentation of native workers, not Forge task authority. [C4], [L1], [H4]

[read; rung 2] OpenCode tracks child sessions and forwards their approval/question requests while filtering ordinary child output from the main event stream. For Cursor/Grok/Antigravity, the inspected ACP adapters establish general events but do not prove complete child identity/transcript visibility. [O2], [U3], [G3], [A4]

[proposed] A Forge subagent integration should keep task ownership, delegation identity, job receipts, and cancellation semantics in its native/Forge contracts. Add T3 fleet annotations only through a negotiated event extension or upstream mapping. Background workers launched by Forge as arbitrary shell commands must not be promised native fleet visibility unless a fixture and live session prove it.

### 3.4 Approval modes and sandbox limits

[read; rung 2] T3 has Supervised, Auto-accept edits, Auto, and Full access modes. Its initial default is Full access, with environment/project overrides for new threads. Native modes differ:

| Provider | Mapping/important exception |
| --- | --- |
| Codex | Native approval policy/reviewer and sandbox mapping set in requests. Auto uses native automatic review; full-access mode widens execution policy. [C4] |
| Claude | SDK permissionMode plus canUseTool; native settings and launch permission flags participate. Full-access callback returns allow; restricted modes may park approval promises. [L1] |
| Cursor | --auto-review for Auto; --force for Full access; ACP plan/implement is another setting. [U1], [U3] |
| Grok | Native default, acceptEdits, auto, or always-approve launch arguments. Remembered session approvals match command/tool input. [G1], [G3] |
| OpenCode | Host rule set permits ordinary reads/skills/LSP, asks for environment files/commands and other restricted operations; edit auto-allow only in appropriate mode. Auto falls back to supervised. Workspace grants can affect other sessions. [O1], [ODOC] |
| Antigravity | default, auto_edit, yolo; Auto falls back to asking; native approval requests may still arrive in Full access. Client filesystem bridge handles read/write requests; terminal capability is false. [A1], [A4], [MODES] |

[read; rung 2] The approval UI distinguishes command, file-read, file-change, app permission, and MCP elicitation. Labels are not always valid protocol reply IDs; provider normalization must preserve the native options. Codex async questions are notifications answered by a new user message, while blocking questions need an RPC response. [APPROVAL], [H2], [CDOC]

[inferred] A permissive T3 mode is not a replacement for Forge guardrails, native sandboxing, or scoped grants. Conversely, an agent operation routed through Antigravity client filesystem or T3 source-control buttons may not traverse the same native pre-tool path as a shell tool. Each protected operation needs a tested execution seam. Forge should expose the effective host/provider mode and gate support in its capability report without silently changing the user's settings.

## 4. T3-native extension points Forge can use

### 4.1 The internal t3-code MCP server

[read; rung 2] T3 statically assembles three toolkits with **21 tool definitions**: 3 pull-request tools, 14 preview tools, and 4 device tools. Tool availability and execution are capability gated. This endpoint exposes T3 functionality to hosted agents; it does not automatically expose Forge tools or accept third-party toolkit packages. [M1], [M4], [M6], [M7]

| Toolkit | Exact tool | Compact schema / result |
| --- | --- | --- |
| PR | link_pull_request | Input: full url OR repository + number, optional host. Output: host, repository, number, url, alreadyLinked. |
| PR | unlink_pull_request | Same identifier alternatives. Output: host, repository, number, wasLinked. |
| PR | list_thread_pull_requests | No input. Output: pullRequests with host/repository/number/url/source/state/title/headBranch/baseBranch/isDraft/optional stack; chains with kind and numbers in bottom-to-top order. |
| Preview | preview_status | Optional tabId; current preview/host state. |
| Preview | preview_open | Optional tabId, url, open, deprecated show, reuseExistingTab. |
| Preview | preview_navigate | Optional tabId; exactly one URL or target URL/environment-port; optional readiness, timeoutMs. |
| Preview | preview_resize | Optional tabId; fill/freeform/preset mode with applicable dimensions/preset/orientation; optional timeoutMs. |
| Preview | preview_set_appearance | Optional tabId; colorScheme system/light/dark. |
| Preview | preview_snapshot | Optional tabId, includeImage, save; textual state and optional actual image, optional saved environment-local PNG path. |
| Preview | preview_click | Optional tabId; exactly one locator, selector, or x+y; optional timeoutMs. |
| Preview | preview_type | Optional tabId; text; optional locator/selector, clear, timeoutMs. |
| Preview | preview_press | Optional tabId; key; optional modifiers. |
| Preview | preview_scroll | Optional tabId; deltaX/deltaY; optional locator/selector. |
| Preview | preview_evaluate | Optional tabId; expression, awaitPromise, returnByValue; result value. |
| Preview | preview_wait_for | Optional tabId; at least one locator/selector/text/urlIncludes; timeoutMs. |
| Preview | preview_recording_start | Optional tabId. |
| Preview | preview_recording_stop | Optional tabId; returns id, tabId, path, mimeType, sizeBytes, createdAt. |
| Device | device_list | Optional hostId; hostStatuses, hosts, devices, open devices. |
| Device | device_open | Optional deviceId/platform/hostId; device, agentDevice command/targetArgs, quickStart. |
| Device | device_screenshot | Optional deviceId/hostId; device plus PNG image/metadata. |
| Device | device_close | Optional deviceId/hostId/shutdown; empty result. |

[read; rung 2] Exact request/result schemas and toolkit registration are in M4/M6/M7 and the preview/device contracts. Navigation timeouts are capped at 60 seconds; evaluate input is capped at 64,000 characters; snapshot text is bounded around 20 KB and images are emitted as MCP image content rather than base64 JSON prose. Device tap/type/install/log actions are deliberately delegated to the returned agent-device CLI, not separate MCP tools. [M4], [M6], [PREVIEW], [DEVICE], [M1]

[read; rung 2] /mcp requires a provider-scoped Bearer token. Missing/unknown/expired credentials yield 401 with no-store and Bearer authentication headers. Tokens are random 32-byte values; the registry stores their hashes and binds the identity/capability scope. Pull-request capability is included, while preview/device are added when granted. Liveness is refreshed by MCP traffic/provider turns; expiration is after 24 hours of inactivity, with eager revocation paths. No tool argument can switch the credential-bound thread. [M1], [M2], [M3]

[read; rung 2] Codex injection uses T3_MCP_BEARER_TOKEN and mcp_servers.t3-code URL/bearer_token_env_var overrides; other adapters receive native MCP configuration. Those are credential names/config paths, not values to print or persist in receipts. Device shims can prepend PATH. [C1], [M5]

### 4.2 Preview and device limitations

[read; rung 2] Preview automation is routed to a compatible desktop runtime for the environment and leased to one physical host per provider session. Host choice considers matching thread tabs and focus. A later unsupported operation does not silently switch the leased host. Default broker timeout is 15 seconds; an unanswered request invalidates the connection and is not replayed because the browser action may already have happened. [M8]

[proposed] Forge can use saved screenshots/recordings as evidence attachments with environment, thread, operation, timestamp, path/hash, and explicit success assertions. A returned path or screenshot alone is not proof of the requested customer behavior. A timeout after a potentially executed click must produce UNKNOWN/INCOMPLETE, followed by state observation, rather than an automatic destructive replay. Desktop-dependent preview proof must report unavailable when no compatible host is connected.

[read; rung 2] Device support and agent device access are separate server-authoritative settings, initially off. Browser access is initially on and may have project overrides; session restart applies access changes. Older schema comments about withholding the complete MCP server must not be generalized into current tool-granular behavior without following session preparation and credential scopes. [SETTINGS], [PDOC], [M2], [M5]

### 4.3 t3.json and project actions

[read; rung 2] Repository-root t3.json is JSONC decoded against a typed schema published at https://t3.codes/schema/t3.json. Fields are $schema, iconPath, defaultThreadEnvMode, worktreeSubmodules, and scripts (at most 50). Script fields are name, command, optional icon, runOnWorktreeCreate, async, previewUrl, and autoOpenPreview. Invalid/unreadable files warn and act as absent. [PFILE], [PLOAD]

[read; rung 2] For a worktree-create action, async defaults true, so the agent may start while setup is still running; false holds agent start until script exit. The setup selector chooses the first runOnWorktreeCreate script. Actions use workspace cwd and receive T3CODE_PROJECT_ROOT plus T3CODE_WORKTREE_PATH where applicable. These variables are proven for project-script execution, not universal provider thread identity variables. Actions can be imported into project settings. [PFILE], [PSCRIPT], [PRUN], [PDOC]

[proposed] A Forge integration may offer an additive project action for dependency/plugin readiness, with async false when readiness is a prerequisite. It must merge existing actions, validate the resulting schema, and respect user project/environment overrides. t3.json is not a Forge configuration loader and has no generic provider plugin manifest, arbitrary gate callback, or UI panel declaration in the inspected schema.

### 4.4 Settings, APIs, and UI extensibility

[read; rung 2] ServerSettings holds provider instance envelopes, project overrides, defaults, browser/device access, restart recovery, source-control behavior, worktree cleanup, and telemetry/storage settings. Provider envelopes carry driver, displayName, accentColor, environment [{name,value,sensitive,valueRedacted?}], enabled, and opaque driver-specific config. Drivers validate config; unknown kinds survive parsing but remain unavailable. Client preferences such as appearance/browser profiles are separate from server authority. [IDENT], [SETTINGS], [PDOC], [H1]

[read; rung 2] The contracts package supplies typed RPC, orchestration commands/events, and provider SPI, but client/server versions can differ and capabilities must be negotiated. This is an implementation integration seam; a stable external Forge extension API is not established by TypeScript types alone. The README invites forks and says large features are generally not being accepted. Prefer a narrow upstream contribution or Ideas discussion over assuming a large plugin platform change will merge. [RPC], [SPI], [H1], [README]

[inferred, bounded absence claim] The inspected static driver array, static MCP toolkit registration, settings envelope, t3.json schema, and client-rendering entry points do not expose an installable third-party T3 plugin/extension loader, generic gate hook registration, or arbitrary panel registration. This does not prove no future/fork implementation exists. At this pin, “Forge installs a T3 plugin that adds panels/tools” would be an unsupported claim. Native harness plugins and a T3 source contribution are the supported design directions.

## 5. Source refinements that materially change integration

### 5.1 Exact Codex mode overrides

[read; rung 2] T3 passes the following into native Codex requests; these are stronger evidence than general permission-mode descriptions. [C4] (lines 515-586)

| T3 internal mode | approvalPolicy | Native sandbox | approvalsReviewer |
| --- | --- | --- | --- |
| approval-required | untrusted | read-only | user |
| auto-accept-edits | on-request | workspace-write | user |
| auto | on-request | workspace-write | auto_review |
| full-access | never | danger-full-access | user |

[read; rung 2] Model and reasoning effort are normalized per turn. Native collaboration mode can also receive model, reasoning_effort, developer_instructions, and additionalContext. A user's config.toml sandbox default is therefore not the entire effective T3 policy. [C4] (lines 589-680)

### 5.2 Claude effort, plan handling, and stop behavior

[read; rung 2] Claude SDK effort is set when a session starts. Later turn effort is normalized and prompt-injected; model changes use query.setModel. Metadata is retained for agent inheritance. A changed T3 effort label does not by itself prove that the SDK's session-level effort setting changed. The installed-version test must check effective behavior/request shape. [L1] (lines 1564-1578,5240-5259)

[read; rung 2] T3 captures an ExitPlanMode plan and deliberately returns denial rather than allowing the ordinary native transition. It consumes native prompt_suggestion/conversation_reset messages and maintains its own thread/resume identity. Stopping can close the query because background work resumed by the SDK may outlive interrupt. These are concrete reimplementations beyond generic pass-through. [L1] (lines 4736-4897,4251-4256,5363-5391)

### 5.3 Native Codex hooks are capable, but compatibility still needs proof

[read; rung 2] T3's generated protocol is pinned to Codex source 687a119f0fcaace47e1f1abcc77cec6c813fd6da. The research lane separately inspected current official Codex source dd90f160ed9bf91320c417335ddff848b6a23dd0. These are different pins and neither identifies the user's installed binary. [CGEN], [NHOOK]

[read; rung 2] In that official Codex source, native PreToolUse runs before tool execution, emits hook lifecycle, can rewrite tool input, and can return a blocked result. A permissionDecision deny or exit code 2 with stderr can block. Invalid/unsupported decisions are treated as failed hook output and can fail open; malformed/unreadable hooks.json warns and is skipped. Discovery reads configuration-folder hooks.json and normalizes command/MCP timeouts. [NHOOK], [NPRE], [NDISC]

[proposed] Forge should generate valid native hook output, validate its configuration, and require the deterministic allowed-control/denied-sentinel test. Error handling must not assume that a crashed or malformed hook safely denies. SessionStart injection, pre-tool denial, input modification, and asynchronous observation are different capabilities, each with a separate receipt. Native trust/enablement must be checked; T3 cannot supply that proof through its current hook UI.

[read; rung 2] Official Codex instruction discovery supports AGENTS.md/AGENTS.override.md through the repository-to-cwd hierarchy, byte limits, and project trust restrictions. Native Claude runtime is closed source; source-visible T3 SDK options and official plugin documentation are the available evidence, not an inspected Claude agent loop. [NAGENTS], [C4], [L1], [NCLAUDE]

## 6. Advantages Forge can use, ranked

All designs in this section are **[proposed]**. The source-backed host surfaces are cited so implementation can begin without treating estimates as measurements.

| Rank | Host advantage | Forge building block/capability | User-visible benefit | Constraint |
| --- | --- | --- | --- | --- |
| 1 | Multiple native runtimes and account instances in one client [REG], [IDENT] | Native plugin generator + host/provider capability profile | Existing users open T3 normally and keep their preferred harness; one-time Forge install reaches each supported path. | Certify each transport/home/version, not a generic host checkbox. |
| 2 | Credential-bound PR linking and complete linked-PR enumeration [M3], [M7], [RI] | Delivery/artifact block and Kernel run receipt | Every PR in a delivery train is visible on the correct thread; links survive reconnect. | Link metadata is not merge authority, ownership, or CI proof. |
| 3 | Native subagent folding for Codex/Claude [C4], [L1], [H4] | Optional reviewer/worker block and identity mapping | People can inspect active worker status/model/effort without replacing the native agent loop. | Custom shell-launched jobs need explicit event support. |
| 4 | Preview snapshots, saved images, recordings, environment-port targeting [M4], [M8] | Validation/evidence block | Customer-facing behavior can be reproduced and attached to a receipt from the same thread. | Desktop/capability availability and non-replayed uncertain actions must be handled. |
| 5 | Durable host intent/events plus native resume cursors [H1], [H5] | Recoverable workflow runner, Kernel recap, Memory recall | After reconnect/restart, Forge re-orients from authority and resumes the right work. | Accepted command is not completed action; pending callbacks can expire. |
| 6 | t3.json worktree actions and explicit setup blocking [PFILE], [PSCRIPT] | Readiness/conformance/bootstrap block | Dependencies and native Forge configuration can be ready before the agent starts. | Imported overrides, first setup action, and async defaults matter. |
| 7 | Instance-specific env/config and continuation identities [IDENT], [CDOC], [LDOC] | Capability negotiation/config explain | Work/personal/router accounts remain explicit while preserving compatible conversation state. | Managed Codex launch overrides and Antigravity profile isolation require dedicated tests. |
| 8 | Device lifecycle plus agent-device CLI [M6], [DEVICE] | Optional mobile validation block | Simulator/emulator proof can accompany a task without putting a device UI in Forge core. | Separate support/access settings and available device hosts are prerequisites. |

## 7. Proof recipe: installed version first, live host second

**Status: proposed; not run.** This phase proves source shape only. The existing T3 tests are useful adapter regressions, but a mocked protocol peer cannot prove a real Forge plugin was loaded by an installed provider. T3's CodexCollabRuntime test explicitly uses a scripted mock peer. Keep fixture regression, L2 installed-version proof, and rendered-host proof separate. [CTEST], [PKG]

### 7.1 Pinning and exact headless command entry points

Run these in isolated CI workspaces with credential values supplied from protected environment variables, never echoed. The documentation/source establish the command entry points; fixture file names below are proposed implementation artifacts and do not exist as part of this research output.

~~~powershell
# Run with workdir set to the CI workspace. Capture versions and non-secret help.
npx --yes t3@0.0.44 --help
codex --version
claude --version
cursor-agent --version
grok --version
opencode --version

# Confirm the pinned installed binary's flags, then start isolated T3 headlessly.
npx --yes t3@0.0.44 serve --help
npx --yes t3@0.0.44 serve --host 127.0.0.1 --port 43191 --base-dir (local scratch)
~~~

[read; rung 2] serve selects headless presentation without opening a browser and disables forced cwd bootstrap. host, port, base-dir, and no-browser are declared flags. The official docs also support an exact-version npx launch. Headless pairing output is authentication material: CI should consume it inside the runner, redact it from published logs, and never print a bearer/pairing credential into a receipt. [CLI], [SERVE], [UPDATES]

For source regression, run with workdir set to a clean checkout pinned by a full commit, not an unversioned latest clone:

~~~text
vp i
vp run --filter t3 test src/provider/Layers/CodexCollabRuntime.integration.test.ts
vp run --filter t3 test src/provider/Layers/ClaudeAdapter.test.ts
vp run --filter t3 test src/provider/Layers/CodexAdapter.test.ts
vp run --filter t3 test src/provider/Layers/OpenCodeAdapter.test.ts
~~~

[read; rung 2] The server package's test script is vp test run; the root has recursive test/typecheck/lint scripts. Validate the exact pinned checkout's help/config before relying on argument forwarding, and choose its actual test files. These commands target adapter tests, not an installed Forge plugin. [PKG]

For the required real-runtime proof, **proposed** fixtures would live in a dedicated integration test area with one owner, real installed providers, and explicit opt-in credentials:

~~~text
vp run --filter t3 test integration/forgeT3Codex.installed.integration.test.ts
vp run --filter t3 test integration/forgeT3Claude.installed.integration.test.ts
vp run --filter t3 test integration/forgeT3OpenCode.installed.integration.test.ts
vp run --filter t3 test integration/forgeT3Acp.installed.integration.test.ts
~~~

Those commands are the intended CI recipe after fixture implementation, not a claim that this dossier added runnable tests. For provider-only transport probes, the source-backed launches are codex app-server; cursor-agent acp; grok --permission-mode default agent stdio; and opencode serve --hostname=127.0.0.1 with an isolated chosen port. Claude must be tested through Agent SDK query with the same T3 options, rather than substituting claude print mode. Antigravity must use the T3-resolved executable/profile and chat ACP options, rather than assuming a standalone CLI binary. [C4], [L1], [U1], [G1], [O1], [A1]

### 7.2 Required fixtures and assertions

| Fixture | Setup | Required assertion; missing evidence fails or reports INCOMPLETE |
| --- | --- | --- |
| Identity/config | Isolated provider home, explicit T3 instance, nested project/worktree, distinct harmless global/project instruction markers. | Actual argv/cwd and env key names match the selected instance; effective home and native session IDs recorded; both instruction markers affect the prompted response where that native harness supports them. No secrets in logs. |
| Plugin loading | Install one local fixture plugin through the native supported manifest/install mechanism, including each required component. | Enumerate every expected skill, command, MCP tool, hook and custom agent; invoke each. Finding one skill is not a complete plugin receipt. |
| Hook denial | Harmless allowed control command and a forbidden command that would write a sentinel inside the otherwise writable fixture. | Control executes; native deny hook runs; denied sentinel is absent; native denial/error result recorded. Repeat via host SDK/app-server/ACP path. A sandbox rejection alone cannot pass the hook test. |
| Hook modification | Where native hooks support input rewriting, rewrite an innocuous echo argument. | Tool receives rewritten input; hook receives expected native payload. Unsupported transports report capability unavailable. |
| Hook failure/trust | Disabled/untrusted hook, malformed output, timeout/crash fixtures; native version-specific behavior. | Each outcome is labeled precisely; no failure-to-load is called “gate active.” Fail-open native behavior cannot satisfy enforcement proof. |
| Skills/commands | Same-name user/project skills, disabled and user-only skills, multiple mentions, native command args, host /plan collision. | Correct precedence and invocation behavior; disabled/manual-only semantics retained; reserved T3 commands explicitly distinguished. |
| Native + T3 MCP | Harmless user MCP and project MCP plus internal t3-code bridge; one tool per server; applicable native transports/auth. | All named servers are callable through the real provider, not merely listed. Wrong/expired T3 token -> 401; cross-thread substitution impossible by tool arguments; unavailable capability refused. |
| Subagent visibility | Native named worker with known role/model/effort and harmless task; background operation plus child approval/question. | Native child actually runs; child identity/terminal status retained; approval reaches correct parent/UI; expected event projection enumerated. Omitted child transcript is recorded as a limitation. |
| Mode/sandbox | All four host modes, allowed workspace and disallowed external-path probes where supported. | Exact Codex request fields match §5.1; Claude bypass/default/accept/auto match options; ACP/OpenCode replies and scope match source. Gate proof is independent of approval mode. |
| Resume/compaction | Complete turn, restart adapter/host, resume; native compaction; pending async question and stale blocking callback. | Same native session when supported; explicit new-session/fallback when not; Forge reloaded issue/lease/recap; no duplicate side effect or silent lost question. |
| Worktree readiness | T3 local and worktree modes; dependencies/setup script with async false and true; moved cwd; concurrent thread sharing directory. | Correct cwd/env, setup ordering, native resume/fork behavior, no duplicate Forge worktree authority, no cross-worker restore. |
| Managed/isolated accounts | Codex direct, shadow and managed; Claude custom config dir; Antigravity profile. | Private auth isolated; intended shared plugin/config visible; managed launch overrides recorded; real-home Antigravity skill visibility does not falsely imply hooks/MCP/rules loaded. |
| PR linking | Two fixture PR references, duplicate link, unlink/relink, list; preserve stack order. | Every expected PR appears on the credential-bound thread; unrelated background PRs omitted; tool failure cannot produce “linked” receipt. |
| Preview/device | Compatible desktop/device host, capability toggles, screenshot/assertion, browser timeout after a possible side effect. | Saved artifact hash/path and actual behavior assertion; unavailable host/access -> INCOMPLETE; uncertain timed-out action is observed before retry. |
| Event fidelity | Record native, canonical, orchestration and rendered outcomes for all probes. | Enumerate losses: Codex hooks, downstream hook rows, coalesced task progress, filtered child streams; do not infer UI completeness from canonical events. |

[proposed] A fixture must use the actual native plugin format for that pinned harness. This dossier does not invent a universal T3 plugin manifest. Native Claude/SDK behavior, Cursor ACP hooks/config, Grok native config, Antigravity profile behavior, and OpenCode plugin execution remain explicit installed-version unknowns until these tests run.

### 7.3 Receipt shape and pass criteria

[proposed] Record host package/version/full SHA, provider executable/version, SDK/protocol pin, OS/runtime, driverKind, providerInstanceId, instance mode/home identity, cwd/worktree, T3 environment/thread/session identifiers, native session identifier, Forge run/issue/plugin identity, selected and reported model/effort, effective approval/sandbox, expected-component inventory, each probe outcome, non-secret event/artifact paths and hashes, start/end times, and cleanup state.

PASS requires every expected component and probe. FAIL means a tested assertion failed. INCOMPLETE means authentication, supported provider version, desktop capability, credential scope, or an expected sub-object was unavailable/unobserved. A native hook's absence from T3 UI is expected under the present source but must not be mistaken for successful end-to-end observability. Source regression tests and a screenshot-free headless transcript can establish L2/runtime evidence; rendered approval/fleet/preview behavior still needs a permitted live client check.

## 8. Best possible Forge integration with T3 Code

All entries are **proposed**, sized as engineering estimates rather than measured effort. Native harness plugin readiness is a prerequisite; estimates exclude building every missing native Forge plugin and waiting for upstream review.

### 8.1 Architecture choice

Use two additive layers:

1. **Native Forge plugin/extension per harness.** Skills, native orientation, deny hook where supported, native agents, and Forge tools use that harness's own mechanisms. The harness retains its loop, tools, model layer, compaction, and trust.
2. **T3 host profile.** Detect the actual host/provider/instance/cwd boundary; negotiate capabilities; bind T3 and native identities to Forge run records; use existing T3 MCP for linked PRs and optional proof artifacts; add upstream host event support where necessary.

The Kernel remains issue/workflow authority. Forge APIs/config/Memory/receipts remain reusable blocks. T3's database, PR links, fleet, preview, and device panels are optional views/execution aids. Forge's native visualization app can consume Forge's own APIs/events; this proposal does not put a mandatory UI in Forge core or fork T3 into a Forge-only harness.

### 8.2 Surface-by-surface design

| Surface | Proposed integration | Install/update path | Estimate | Principal risk |
| --- | --- | --- | --- | --- |
| Native plugin discovery | Generated native packages/manifests from Forge capability catalog; additive native installation and explicit project trust. | Native harness install mechanism on the T3 environment machine; verify effective home/profile and restart agent session. | 2-3 worker-days for T3 profile around existing plugins | Native plugin feature exists but SDK/ACP path loads only part. |
| Forge tools | Proposed thin Forge MCP/API facade over existing public block contracts; native MCP config per provider. | Add without replacing existing MCP config; native auth/trust/restart; versioned schema/probe. | 2-4 for host composition and probes, assuming facade exists | Project/user settings differ; external OpenCode is server-owned; Antigravity profile omits real-home MCP. |
| Orientation and Memory | Native session/compaction hook when available; fallback explicit recap skill/tool. | Preserve existing AGENTS/CLAUDE/rules; inject bounded context, re-query authority on resume. | 1-2 | Stale prose outlives lease/stage state; native compaction drops client context. |
| Gates | Native validated pre-tool hook plus protected Forge API operations; capability report distinguishes enforcement from observation. | Native enabled/trusted hook config; denied-sentinel proof; no host Full access rewrite. | 2-4 | Hook fails open, SDK/client-FS bypasses seam, UI hides denial evidence. |
| Thread/run identity | Proposed negotiated host identity export or explicit signed/scoped binding; correlate native IDs and Forge runs. | Narrow T3 upstream API/MCP/event addition; fallback explicit tool binding, not title/cwd inference. | 2-3 | Internal T3 token is not a reusable Forge auth credential; parallel threads share cwd. |
| PR artifacts | Invoke link_pull_request for every PR and list_thread_pull_requests at phase exit; record URLs and link receipts. | Existing t3-code MCP, no T3 fork required on available local-provider path. | 1-2 | External OpenCode lacks bridge; UI link does not prove checks/merge/ownership. |
| Subagent evidence | Reuse native Codex/Claude identities; store full Forge job/receipt state; optional canonical UI annotations upstream. | Native agent files; source contribution only for missing event metadata. | 2-4 | Reconstructed progress loses history; custom shell jobs invisible. |
| Preview/device proof | Optional validation block calls exposed tools/CLI, records artifacts with assertions and uncertainty. | Existing capabilities/settings; user-enabled device support; environment-local storage. | 2-3 | Desktop/device unavailable; expired credentials; uncertain clicks must not replay blindly. |
| Worktree composition | One owner per operation: adopt/check T3 cwd under an approved Forge plan, or let Forge create/bind and open that directory in T3. | Additive readiness action; async false for prerequisites; native config validate/dry-run. | 2-3 | Two systems create cleanup/branch/ownership independently. |
| Host conformance | Native + SDK/ACP + UI proof matrix and versioned receipts, with INCOMPLETE outcome. | CI fixtures per host/provider version; exact pinned binaries; periodic compatibility refresh. | 4-7 | Credentials/live UI unavailable; mocks falsely treated as installed proof. |
| Upstream hook visibility | Codex mapper -> canonical hook events; common hook activity projection and appropriate client rendering. | Narrow tested T3 PR; maintain compatibility with older event replay/clients. | 2-4 plus review | Persisted schema/client changes; host support may reject broader features. |

[inferred estimate] A useful first Codex/Claude T3 host profile, composition checks, PR linking and initial installed-proof fixtures is roughly **8-14 worker-days** once native Forge plugins/tools exist. Adding managed/alternate homes, the four other provider paths, Windows/remote environments, and UI/preview/device coverage is another **8-15 worker-days**. These ranges overlap table work and must not be summed row-by-row; upstream review time and unavailable native capability work are excluded.

### 8.3 Ranked implementation sequence

1. Define the host-aware capability/receipt contract with native-versus-host-versus-rendered evidence.
2. Prove Codex direct CLI-home and Claude default SDK paths on pinned stable T3; add project/user MCP and denied-hook fixtures.
3. Add T3 PR linking and explicit thread/run binding while preserving the normal open-project launch UX.
4. Implement narrow hook canonical/projection fixes upstream and verify live denial visibility.
5. Add Codex managed/shadow modes and Windows worktree/readiness cases.
6. Certify Cursor ACP and OpenCode supported 1.x local-server paths; explicitly report external-server differences.
7. Add Grok/Antigravity only after their native required surfaces pass installed proof.
8. Propose Pi driver support separately if owner demand justifies upstream maintenance; do not dilute Pi's standalone Forge integration priority while waiting.

Each step is a proposal for the integrator/owner's approved plan, not permission to implement the next phase during this research leg.

## 9. Keeping current and release/platform risk

[external/read; 2026-10-01] Follow the official GitHub releases and Atom feed, main commits, provider compatibility/model manifest, generated protocol revisions, SDK catalog pins, and docs/user provider guides. The fetched 12-release window spans Sep 29-Oct 1: two stable releases plus multiple preview/nightly publications. It shows rapid recent release activity, not a measured long-term cadence. [RELEASES], [FEED], [OCOMP], [DEP], [CGEN]

| Change signal | Required Forge response |
| --- | --- |
| Codex generated protocol SHA or hook/plugin/agent event additions | Re-run mapper/event-loss tests; inspect new approval/hook input/output shape; update host capability profile. |
| Claude SDK pin or settingSources/agent propagation changes | Re-run native plugin/hook/MCP/custom-agent fixtures and turn-effort tests in SDK mode. |
| OpenCode compatibility range or server API change | Keep V1/V2 product identity explicit; refresh supported range; test local/external ownership and config cache. |
| ACP model/config/permission extensions | Re-check option IDs, plan mode, native resume, FS capability, and subagent identity mapping. |
| Host profile/home isolation changes | Re-run user/project instructions/MCP/hooks and shared/private account-state tests. |
| t3.json/settings precedence or worktree cleanup changes | Validate additive project action behavior, cwd/setup ordering, authority binding and cleanup protections. |
| MCP toolkit/scope/credential or preview broker changes | Verify tool inventory, expiry/revoke, capability rejection, same-host lease, and non-replayed timeout semantics. |
| Persisted schema or client capability changes | Test replay/downgrade and mixed client/server versions; do not assume newest mobile/web can decode older/newer payloads. |

[read/external; rung 2] Recent stable release notes include native slash-command support, provider thinking traces, app permission approvals, compatible instance/config changes, and Windows PTY startup/helper fixes. The OpenCode V2 advisory is a concrete September compatibility correction. These show moving seams; they do not prove unresolved bugs in the user's machine. [RELEASES], [OPR]

[read; rung 2] Windows requires provider binaries on the server's PATH or explicit Binary path. WSL hosts install providers inside the chosen distro; the desktop brings its own server runtime there. Remote environments use the remote machine's native configuration. Test Windows path separators, spaces, symlink/junction/shadow-home behavior, Git worktree state, shell arguments, and provider child process startup on real Windows. This phase did not reproduce a Windows failure. [INSTALL], [C2], [LDOC]

[read; rung 2] Provider logging is best-effort and bounded: per-file rotation, buffer limits, retention, 64 KiB record-character cap, field/depth limits, and transient event classes. Runtime ingestion replaces task-progress rows by stable task IDs, omits parent tool-progress activities, and projects non-terminal tool payloads before persistence. T3's saved logs/UI are therefore not an immutable complete proof ledger. Forge should write its own durable receipts at the authority boundary and keep artifact retention explicit. [LOG], [H3]

## 10. Corrections to P7

The supplied P7-harness-plugins.md addresses native harnesses. The case-insensitive T3/t3code search found no explicit T3 section, so these are additions/corrections to its integration implications, not invented quotations of a T3 claim.

1. Add **host/transport/instance mode** to native capability certification; P7's harness-level matrix does not establish T3 pass-through.
2. Separate native plugin installation from host menu discovery and rendered proof. A T3 skill picker is not a complete plugin receipt.
3. Preserve native hooks as the enforcement seam. Add Codex hook mapper and common hook projection gaps to host limitations; Claude canonical emission is not UI proof.
4. Replace any universal AGENTS.md/.agents/skills statement at the host level with provider-specific paths: Claude SDK settings, Cursor scan roots, Antigravity isolated profile/roots, native OpenCode server configuration.
5. Distinguish user/project native MCP from T3's internal bridge, and local owned OpenCode from external servers. Do not confuse @opencode-ai/sdk/v2 with OpenCode product 2.x.
6. Account for T3 /plan and /model, provider-command placement, and Claude's last-skill dispatch when naming Forge entry points.
7. Add managed Codex launch-argument replacement and shadow-home sharing to install/update/conformance; auth isolation does not mean an empty plugin home.
8. Keep native Pi support as the approved priority, while recording that stock T3 has no Pi driver at this pin.
9. Do not call a typed T3 provider SPI a drop-in plugin API; a source contribution is presently the evidence-backed host extension path.
10. Keep Forge's proposed common MCP/API facade as a Forge capability surface; T3's internal server already exists but supplies host tools, not Kernel/Memory/gate tools.

## 11. Primary source index

All T3 source references below are official remote files pinned to 5cc99e1c23980d7995a13c47f969b47cb68ed1be, fetched 2026-10-01. Line anchors point to the evidence; multiple regions of large adapters were inspected as identified in the text. Native source pins are stated separately. Source-reading evidence is rung 2.

| Key | Source and relevant regions |
| --- | --- |
| [H1] | docs/internals/overview.md:3-19 environment boundary; 40-66 orchestration; 72-91 checkpoints/receipts. |
| [H2] | docs/internals/providers.md: process/profile isolation, setup/helper constraints, native protocol traps and attachment limits. |
| [H3] | ProviderRuntimeIngestion.ts:187-189 truncation; 502-1040 activity conversion; 679-879 task folds; 814-845 progress; 933-1040 payload projection/default. |
| [H4] | AgentsPanel.tsx:1-3 fleet purpose; 38-49 status; 120-187 activity/model/effort/usage presentation. |
| [H5] | ProviderCommandReactor.ts:186-187 stale callbacks; 475-524 missing-worktree recovery; 588-743 instance/cwd/resume selection. |
| [C1] | CodexAdapter.ts:2305-2340 MCP injection; 2505-2513 ignored mappings; full mapToRuntimeEvents inspected. |
| [C2] | CodexHomeLayout.ts:19-34 private/shared paths; 320-415 overlay construction. |
| [C3] | CodexManagedRuntime.ts:18-31 stripped ambient overrides; 90-107 managed launch configuration. |
| [C4] | CodexSessionRuntime.ts:515-680 mode/model settings; 702-786 resume; 1299-1358 launch; 1693-1732,1840-1902 children/compaction; 2024-2037 notifications; 2481-2612 session/turn requests. |
| [L1] | ClaudeAdapter.ts:1564-1578 turn effort; 2101-2140 SDK query; 3570-3943 tasks/hooks; 4251-4256 consumed events; 4489-4517 resume; 4736-5039 permissions/options; 5240-5347 turns/skills; 5363-5391 stop. |
| [L2] | ClaudeSkills.ts:123-154 settings overrides; 298-383 discovery. |
| [L3] | ClaudeSkillDispatch.ts:1-79 mention translation. |
| [U1] | CursorAcpSupport.ts:22-64 launch/modes/env. |
| [U2] | CursorSkills.ts:219-244 roots; 278-289 dispatch. |
| [U3] | CursorAdapter.ts:225-305 model/config/mode; 511-580 resume/MCP; 687-754 permissions; 775-820 cursor/commands. |
| [U4] | CursorProvider.ts:347-416 and 574-600 native model/config catalog. |
| [G1] | GrokAcpSupport.ts:33-62 launch/modes; 113-187 model/effort. |
| [G2] | GrokSkills.ts:1-14 and 94-117 native inspect/catalog. |
| [G3] | GrokAdapter.ts:974-1030 resume/MCP; 1148-1230 approval; 1248-1319 model/effort. |
| [O1] | opencodeRuntime.ts:51-59,663-710 config/server; 188-205 skill/agent APIs; 503-539 permission rules. |
| [O2] | OpenCodeAdapter.ts:1667-1674 child filtering; 2224-2265 child requests; 2831-2967 server/MCP/resume/fork; 3096-3290 command/prompt/model/variant. |
| [O3] | OpenCodeProvider.ts:155-250 variant/agent options; OpenCodeDriver.ts:171-184 native catalogs. |
| [A1] | AntigravityAcpSupport.ts:28-100 client capabilities/resume/modes; 103-167 model config. |
| [A2] | antigravityAuthSupport.ts:218-252,433-460 isolated launch; AntigravityDriver.ts:154-240 profile/process; docs/internals/providers.md global skill links/config exclusions. |
| [A3] | AntigravitySkills.ts:32-49 and 154-180 roots/precedence. |
| [A4] | AntigravityAdapter.ts:754-842 session/MCP/FS; AntigravityProvider.ts:318-344 native command catalog. |
| [REG] / [SPI] / [IDENT] | builtInDrivers.ts complete array; ProviderDriver.ts:114-173 factory/config/resource contract; providerInstance.ts slug/env/envelope identity. |
| [M1], [M2], [M3], [M4], [M5], [M6], [M7], [M8] | MCP HTTP auth/registration; scoped invocation and credential registry; exact toolkits; provider session/device env; preview lease/timeout. |
| [PFILE] / [PLOAD] / [PSCRIPT] / [PRUN] | t3.json schema, loader, script resolution/cwd/env, and setup runner. |
| [NHOOK] / [NPRE] / [NDISC] / [NAGENTS] | Official Codex source at dd90f160ed9bf91320c417335ddff848b6a23dd0, distinct from T3-generated protocol and installed binary. |

[SITE]: https://t3.codes/
[README]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/README.md
[HEAD]: https://github.com/pingdotgg/t3code/commit/5cc99e1c23980d7995a13c47f969b47cb68ed1be
[RELEASES]: https://api.github.com/repos/pingdotgg/t3code/releases?per_page=12
[FEED]: https://github.com/pingdotgg/t3code/releases.atom
[H1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/internals/overview.md#L3
[H2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/internals/providers.md#L10
[H3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/orchestration/Layers/ProviderRuntimeIngestion.ts#L502
[H4]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/web/src/components/AgentsPanel.tsx#L1
[H5]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/orchestration/Layers/ProviderCommandReactor.ts#L475
[C1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/CodexAdapter.ts#L2305
[C2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/CodexHomeLayout.ts#L19
[C3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/CodexManagedRuntime.ts#L18
[C4]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/CodexSessionRuntime.ts#L515
[CGEN]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/effect-codex-app-server/scripts/generate.ts#L20
[CHOOK]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/effect-codex-app-server/src/_generated/meta.gen.ts#L133
[CTEST]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/CodexCollabRuntime.integration.test.ts#L1
[CDOC]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/providers-codex.md
[L1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/ClaudeAdapter.ts#L4906
[L2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/ClaudeSkills.ts#L298
[L3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/ClaudeSkillDispatch.ts#L1
[LDOC]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/providers-claude.md
[DEP]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/pnpm-workspace.yaml#L88
[U1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/acp/CursorAcpSupport.ts#L22
[U2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/CursorSkills.ts#L219
[U3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/CursorAdapter.ts#L511
[U4]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/CursorProvider.ts#L347
[G1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/acp/GrokAcpSupport.ts#L33
[G2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/GrokSkills.ts#L94
[G3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/GrokAdapter.ts#L974
[O1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/opencodeRuntime.ts#L503
[O2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/OpenCodeAdapter.ts#L2831
[O3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/OpenCodeProvider.ts#L155
[ODOC]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/providers-opencode.md
[OCOMP]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/model-manifest.json#L54
[OPR]: https://github.com/pingdotgg/t3code/pull/14198
[A1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/acp/AntigravityAcpSupport.ts#L28
[A2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/antigravityAuthSupport.ts#L218
[A3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Drivers/AntigravitySkills.ts#L32
[A4]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/AntigravityAdapter.ts#L754
[REG]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/builtInDrivers.ts#L23
[SPI]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/ProviderDriver.ts#L114
[IDENT]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/providerInstance.ts#L58
[RI]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/RuntimeInstructions.ts#L1
[M1]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/McpHttpServer.ts#L45
[M2]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/McpSessionRegistry.ts#L61
[M3]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/McpInvocationContext.ts#L11
[M4]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/toolkits/preview/tools.ts#L53
[M5]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/McpProviderSession.ts#L20
[M6]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/toolkits/device/tools.ts#L21
[M7]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/toolkits/pullRequests/tools.ts#L30
[M8]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/mcp/PreviewAutomationBroker.ts#L473
[PREVIEW]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/previewAutomation.ts#L14
[DEVICE]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/device.ts#L473
[PFILE]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/t3ProjectFile.ts#L28
[PLOAD]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/project/T3ProjectFileLoader.ts#L67
[PSCRIPT]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/shared/src/projectScripts.ts#L41
[PRUN]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/project/ProjectSetupScriptRunner.ts#L57
[PATHS]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/config.ts#L130
[CLI]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/cli/config.ts#L27
[SERVE]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/cli/server.ts#L26
[SET]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/serverSettings.ts#L175
[SETTINGS]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/settings.ts#L1022
[PDOC]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/project-settings.md#L48
[MODES]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/permission-modes.md
[COMPOSER]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/composer.md#L146
[APPROVAL]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/web/src/components/chat/ComposerPendingApprovalPanel.tsx#L16
[UPDATES]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/updating.md#L8
[INSTALL]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/docs/user/install.md#L73
[RPC]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/rpc.ts
[EVENT]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/packages/contracts/src/providerRuntime.ts#L682
[LOG]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/src/provider/Layers/EventNdjsonLogger.ts#L25
[PKG]: https://github.com/pingdotgg/t3code/blob/5cc99e1c23980d7995a13c47f969b47cb68ed1be/apps/server/package.json#L23
[NHOOK]: https://github.com/openai/codex/blob/dd90f160ed9bf91320c417335ddff848b6a23dd0/codex-rs/core/src/hook_runtime.rs#L183
[NPRE]: https://github.com/openai/codex/blob/dd90f160ed9bf91320c417335ddff848b6a23dd0/codex-rs/hooks/src/events/pre_tool_use.rs#L197
[NDISC]: https://github.com/openai/codex/blob/dd90f160ed9bf91320c417335ddff848b6a23dd0/codex-rs/hooks/src/engine/discovery.rs#L339
[NAGENTS]: https://github.com/openai/codex/blob/dd90f160ed9bf91320c417335ddff848b6a23dd0/codex-rs/core/src/agents_md.rs#L118
[NCLAUDE]: https://github.com/anthropics/claude-code/blob/6160717d8994f236ab381cf534fc1cde5347c12f/plugins/README.md

## Bottom line

1. Certify the complete path: Forge plugin -> native runtime -> T3 adapter -> persistence -> UI.
2. Start with Codex direct and Claude SDK, then prove managed accounts and each additional provider independently.
3. Stock T3 hosts six registered providers; Pi requires separate host integration work.
4. Native configuration paths survive in useful places, but isolated profiles and explicit host overrides are material.
5. Skills, commands, hooks, agents, MCP, rules, sandbox and effort need separate capability receipts.
6. Native hook denial can protect tools while T3 hides its lifecycle; fix visibility without replacing enforcement.
7. OpenCode 2.x is marked incompatible; supported 1.x and external-server paths must be named explicitly.
8. Use the scoped T3 MCP bridge for every relevant PR and optional preview/device proof when available.
9. Keep Kernel authority, scoped grants, durable evidence, and worktree ownership in Forge's public contracts.
10. Ship a tested host profile first; propose small upstream mappings/identity seams before a general T3 extension platform.

## Limitations that become Forge limitations

| Limitation and evidence | Concrete Forge failure | Workaround and owner |
| --- | --- | --- |
| Codex hook notifications have no canonical mapper; common ingestion omits hook rows. [C1], [H3] | A deny gate runs but the person sees no authoritative hook evidence; observers infer a missing/failed gate incorrectly. | **Forge:** own gate receipts and deterministic denial proof. **T3 upstream:** map Codex hooks and persist/render canonical hook rows with tests. |
| Plugins only partly established on SDK/ACP/native-config paths. [L1], [U1], [G1], [A2] | Skill appears, but plugin hook/MCP/agent fails to load. | **Forge:** enumerate and invoke every expected component per pinned host profile; label partial paths experimental. **Docs:** exact native install/home/trust/restart procedure. |
| T3 reserved slash commands and provider-specific skill dispatch. [COMPOSER], [L3] | Forge /plan invokes host behavior; earlier manual-only Claude skill is not dispatched correctly. | **Forge:** namespaced discoverable skills/commands and collision fixtures. **Docs:** entry-point/placement and one manual skill per message. |
| Default Full access and differing mode/sandbox translations. [MODES], [C4], [L1] | Native user sandbox/approval expectations differ from the host-selected request policy. | **Forge:** report effective policy, certify gate seam independently, enforce protected API operations. **Docs:** explain overrides without silently changing settings. |
| Managed Codex discards user launchArgs. [C3] | Launch-flag-only plugin/provider configuration disappears in managed mode. | **Forge:** use native shared config/plugin installation where supported; dedicated managed-mode receipt. **Docs:** direct/managed distinction. |
| Antigravity real-home skill links omit user-global hooks/MCP/rules. [A2], [H2] | Forge skill visible but enforcement/tools/instructions absent from effective profile. | **Forge:** profile-aware capability check and native project/config solution after proof. **T3 upstream:** explicit opt-in config inheritance if appropriate. |
| OpenCode >=2.0.0 is marked broken. [OCOMP], [OPR] | The owner's V2-native Forge setup cannot be certified through this host adapter. | **Docs/Forge:** require tested supported 1.x profile or report unavailable; preserve standalone V2 integration. **T3 upstream:** V2 discovery/protocol support with installed tests. |
| External OpenCode does not receive internal t3-code MCP. [O2] | PR link/preview/device calls are absent despite native Forge MCP being available remotely. | **Docs:** distinguish external from owned local server. **T3 upstream:** opt-in safe scoped bridge strategy; avoid shared-directory token collisions. |
| Native catalog/helper config caching. [ODOC], [COMPOSER] | New plugin/skill/MCP/model does not appear immediately. | **Docs:** explicit refresh/restart; wait for owned OpenCode helper idle reload or restart external server. **Forge:** verify runtime component inventory after update. |
| OpenCode child stream filtering and incomplete ACP agent identity. [O2], [U3], [G3], [A4] | Forge jobs run but their full task/evidence history is not visible in T3 fleet. | **Forge:** retain native job identity/receipts. **T3 upstream:** negotiated task/subagent event projections, with bounded UI summaries. |
| Coalesced/truncated/best-effort activity/logs. [H3], [LOG] | A long failure/progress record disappears or latest state replaces audit history. | **Forge:** durable receipt/artifact sink; link concise summaries to complete evidence. Do not use T3 logs as completion authority. |
| Resume cursor/callback/native history differ from host chat. [H5], [C4], [L1], [UPDATES] | Agent appears resumed but lease, pending approval, or native conversation is stale/new. | **Forge:** authority recheck and explicit continuity receipt. **Docs:** restart/stale-callback behavior. |
| T3 and Forge independently create/clean worktrees. [H5], [PDOC] | Issue/worktree binding missing, duplicate branches, or one system removes another's workspace. | **Forge:** explicit single-owner adoption/create protocol and cleanup metadata; preserve shared/dirty worktrees. |
| Preview requires compatible desktop host and does not replay uncertain actions. [M8] | CI/headless session cannot demonstrate customer UI; timeout gets misreported as failure/success. | **Forge:** capability-gated proof, UNKNOWN/INCOMPLETE, observe before retry; attach saved artifact plus behavior assertion. |
| Device support/access separate and disabled initially. [SETTINGS], [M6] | Device tool exists in source but cannot run in the selected environment. | **Docs:** setup/access preconditions. **Forge:** explicit available-host/tool check; device proof optional unless required by task. |
| No proven installable T3 plugin/panel/toolkit loader. [REG], [SPI], [M1], [PFILE] | A promised drop-in Forge host plugin cannot actually install. | **Forge:** native harness plugins plus host profile. **T3 upstream:** narrowly scoped source integration; consider general extension API only after owner/upstream demand. |
| Pi absent from stock registry. [REG] | A Pi Forge extension cannot run as a stock T3 provider. | **Forge:** continue native Pi integration. **T3 upstream:** independent Pi driver proposal with protocol/lifecycle proof; no fake support badge. |
| Client/server/provider versions move independently. [H1], [UPDATES], [CGEN], [DEP] | New events/options break replay or old UI rendering. | **Forge:** capability negotiation, pinned compatibility matrix, mixed-version/replay tests and update triggers. |

## Open questions for the owner

These choices scope a later approved plan; no answer is required to complete this research phase.

**First supported host profile**

- **A — Codex direct + Claude default SDK first (default).** Strongest inspected configuration and subagent paths; certify all required native plugin surfaces before calling supported.
- **B — All six providers in the first release.** Wider exposure, more unknown SDK/ACP/profile behavior and a larger proof matrix.
- **C — Document-only T3 compatibility first.** Lowest implementation cost, but leaves hook visibility and component loading unproven.

Reasoning: A produces an evidence-backed host profile without blocking standalone Pi or other native integrations.

**T3 integration depth**

- **A — Native plugins + T3 host profile and PR/proof tools (default).** Uses existing mechanisms while keeping Kernel/config/receipts reusable.
- **B — Add narrow upstream hook visibility and thread/run identity support now.** Better observability; adds upstream review and mixed-client compatibility work.
- **C — Pursue a general T3 extension/panel API first.** Larger dependency on upstream product direction; current source does not establish a loader.

Reasoning: A is independently deliverable; B can follow as a bounded source contribution after installed proof identifies the necessary gap. C should require concrete outside-author demand.

**Pi and OpenCode V2 under T3**

- **A — Keep native Pi/OpenCode V2 priority; mark these T3 paths unavailable until proved (default).** Preserves the owner's exposure direction and makes the host limitation explicit.
- **B — Fund Pi driver and OpenCode V2 host work in parallel.** Useful if T3-hosted demand is already substantial; requires separate upstream scope and maintainers.
- **C — Standardize T3 users on current supported providers/1.x temporarily.** Faster host coverage, but may not fit the owner's existing V2/Pi setup.

Reasoning: A avoids turning T3's present registry/compatibility constraints into a false statement about Forge's native harness capability.

**Enforcement and evidence policy**

- **A — Native deny hooks + protected Forge APIs + independent durable receipts (default).** Certify each host mode; missing enforcement or proof reports INCOMPLETE.
- **B — Require upstream rendered hook evidence before supporting T3.** Stronger operator visibility, but blocks otherwise functional native enforcement until host changes ship.
- **C — Offer observation-only T3 integration for providers without proved gates.** Useful for optional blocks, but cannot satisfy a composition that requires enforcement.

Reasoning: A keeps enforcement at an executable boundary and supports the north star's independently composable blocks. C is a capability tier, not permission to weaken required gates.

## Confidence

**High at source rung 2:** official identity, pinned provider registry, protocol launch paths, native option/home forwarding, T3 MCP tool inventory/scope, t3.json schema, OpenCode compatibility policy, and the identified hook normalization/projection gaps.

**Medium:** end-to-end native plugin/config inheritance, native hook behavior through SDK/ACP, custom-agent/child visibility, sandbox behavior under user-specific settings, and installed versions. T3 source identifies the path and overrides, but some provider internals are closed or version-dependent.

**Low / unproved at rungs 4-5:** any claim that a Forge plugin actually loaded, blocked a tool, resumed correctly, or rendered in the user's running T3 app. This phase ran no native/provider/plugin/UI conformance. Estimates and integration design are proposals.

Completion evidence for this phase is the saved dossier readback and enumerated coverage, not a live integration certification. Native hook execution and UI visibility must remain separate in the final plan.
