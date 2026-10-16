# Thread history lanes — shared brief

Read `brief.md` in this folder first (the rebuild decision and the owner's rules: parallel lanes, build on what's decided, our workflow on top of the blocks, no baggage, design for smarter agents).

## Job

Read past T3 Code conversation threads about Forge and extract what the rebuild must learn. Use the T3 tools: `t3_thread_read` (view `messages`; page with `afterPosition=nextPosition`; for long items use `itemId` + `textOffset`), `t3_thread_search`, `t3_thread_list`. Read every page of each assigned thread, not just the start. Read-only: never send messages to, settle, or change any thread.

If the T3 thread tools are not available to you, stop at once and reply exactly `NO T3 TOOLS`.

## What to extract (per thread, then combined)

1. **What happened** — the goal, the main turns, how it ended (merged, abandoned, superseded). Dates.
2. **What worked** — approaches, designs, tools, processes that delivered. Evidence: the message or PR.
3. **What didn't work** — failures, reverts, loops, repeated review rounds, wasted time. Root cause.
4. **Built but not used** — features, commands, gates or docs that were built and then ignored, bypassed or removed.
5. **Useful but couldn't be used** — good capabilities that were hard to find, badly structured, behind the wrong boundary, or blocked by ceremony.
6. **Agent-era lens** — what existed only to compensate for weaker agents (obsolete as agents improve) versus what stays valuable (contracts, authority, evidence, trust, limits, discoverability).
7. **Owner corrections** — every place the owner corrected direction or showed frustration, quoted briefly (they are dictated; normalise typos). These are the strongest signal.

Mark each claim with the thread and message position. Never copy secrets; if you meet one, write `[secret omitted]`.

## Output

Write to your assigned file in this folder. End with: the top 10 lessons for the rebuild, each as "lesson → what the new project does about it (keep / drop / design rule)".

Final reply: at most 200 words — threads and pages read (state plainly if any thread was not fully read), the top 5 lessons, and the output path.
