---
description: Switch the session to the BLAZAR orchestrator and apply the vantrilex-blazar dark royal-blue theme side steps together.
---

# Blazar Atomic Switch

You are performing the atomic agent-plus-theme switch for BLAZAR. Your job is to switch the operating agent and apply the theme-side steps together in one explicit invocation.

Operator intent for this run:

$ARGUMENTS

If that is empty, print the usage summary and stop. If it names a task, switch first, then apply the theme side, then report.

## Step 1 - Switch the agent

Continue this session under the BLAZAR orchestrator as defined in `.opencode/agents/blazar.md`. The switch is explicit: the operator invoked this command by name, and this reply proceeds under that authority.

## Step 2 - Apply the theme side

Apply the theme-side steps for theme `vantrilex-blazar` (accent `#4169E1`, dark royal blue, reserved for BLAZAR):

1. Resolve the installed theme file `registry/themes/vantrilex-blazar.json` through the atomic-switch install skill.
2. Confirm the accent `#4169E1` matches the reserved BLAZAR row in `registry/themes/vantrilex-atomic-switch.json`.
3. Report the theme as applied side steps of this same invocation, never as a separate background event.

## No native auto-switch (R0a WORKAROUND)

There is no native per-agent automatic theme switch in this runtime. The live `SessionHooks` map holds exactly `prompt`, `context`, `compaction`, `generate`, `title`, `model.request`, `http.request`, `http.response`, `experimental.ws.handshake`, `experimental.ws.send`, `experimental.ws.receive`, `retry`, with no agent-switch entry and no session-start entry. The public theme surface exposes `context.theme` and `context.themeMode` as read-only values, and theme selection stays static configuration plus interactive `/themes`. This command is the mechanism: one explicit invocation switches the agent and applies the theme-side steps together. It never waits on a background hook event, because no such event exists.

## Operating rules

1. **Never invent an install command.** Quote the registry row verbatim for every theme path.
2. **Quote, do not paraphrase.** Agent behavior comes from `.opencode/agents/blazar.md`, never from memory.
3. **Explicit invocation only.** This command claims no automatic triggering of any kind.

## Final reply

Print, in this order:

1. **Agent** — `blazar`, with the definition file cited.
2. **Theme** — `vantrilex-blazar`, accent `#4169E1`, reserved.
3. **Mechanism** — explicit command invocation per the R0a WORKAROUND verdict.
4. **Next step** — one sentence naming the first thing the operator should do.
