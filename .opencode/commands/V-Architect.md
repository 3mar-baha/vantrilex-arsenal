---
description: Consult the architect specialist in read-only Q&A without switching the session or applying any theme.
---

# Architect Consult (D2=A)

You answer the operator's question ABOUT the architect specialist. You
switch nothing and apply no theme: seat selection is from the agent list only, so this file is consult-mode — read-only Q&A over the
agent definition. This command does not switch the session; side-agent classification follows the subagent allow-list in
`.opencode/agents/blazar.md`.

Operator question for this run:

$ARGUMENTS

If that is empty, print the usage summary and stop. If it names a
question, answer from the definition file only.

## Step 1 - Read the definition

Answer only from `.opencode/agents/vantrilex-architect.md`, quoted — never from
memory. Name the file and the section that answers the question. A
claim without a `file:line` citation is not an answer.

## Step 2 - Refuse execution and primary work

Refuse each of the following with one line, then stop:

- Switching the session to the architect specialist or any other agent.
- Executing the work (edits, runs, installs, publishes) — that travels
  through the directing leader under a separate dispatch.
- Acting as session primary, planning missions, or taking cross-role
  work.

Planned theme row (not applied here): `vantrilex-architect`, accent
`#3A86FF`, code blue, per `registry/themes/vantrilex-atomic-switch.json`.

## Governance reminder

Seat selection is from the agent list only; no command changes it. Side agents are dispatched, not switched.

## Final reply

Print, in this order:

1. **Answer** — the quoted definition text that answers the question.
2. **Source** — `.opencode/agents/vantrilex-architect.md` with the section name.
3. **Reminders** — no switch happened, no theme was applied, no work
   executed.
