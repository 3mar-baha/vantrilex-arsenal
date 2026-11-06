---
name: goal-discipline
description: Use when a long task needs a single checkable completion condition held across turns, so the session runs to evidence instead of to the next manual continue.
source: 3mar-baha/vantrilex-arsenal
---

# Goal Discipline

## Purpose

Hold a live session to one checkable completion condition, so long work runs to its condition
instead of to the next manual continue. A goal is not a wish: it is a measurable end state plus a
declared check plus stated constraints, and every completion claim must carry beside-it evidence.
This skill teaches disciplined use and holds the control contract. The working surface on later
builds is the built-in command where present and its manual equivalent where absent. No mechanical
goal tool and no add-on are introduced by this skill.

## When to Use

- A task spans many turns and the owner is becoming a manual relay pressing continue.
- A long-running change needs one measurable end state and one declared check before it starts.
- A completion claim must be gated on evidence lines beside it, not on natural-language phrases.
- A session needs bounded continuation turns, duration, token, and cost ceilings with a summary at
  eighty percent and a stop at no progress.
- Work must stay outside campaign sessions, with campaign healing left to its own leaders.

## Do NOT use

- Inside a campaign session. Goals run outside campaigns only; campaign healing keeps its own
  leaders and scope.
- To install or build a mechanical goal tool or an add-on on 2.2.1 or later builds. The working
  surface stays the built-in command and its manual equivalent.
- To accept a vague condition at assignment. A condition without a measurable end state, a
  declared check, and stated constraints is refused.
- To let the working seat judge its own goal. An independent Arsenal side reader with read-only
  tools judges before any Arsenal goal counts complete.
- To accept default limits as-is. Limits are mated to the cost governor and named to owner
  sensitivity.
- As a substitute for the verification law. Distribution never verifies directly; beside-it
  evidence is still required.

## Inputs

- The goal statement: one measurable end state, one declared check, and stated constraints.
- The owner sensitivity and cost governor inputs that mate the limits and brakes.
- The current session context: turn count, elapsed duration, token spend, cost spend, and last
  progress marker.
- The built-in command surface where present, or the manual equivalent where absent.
- The independent Arsenal side reader with read-only tools that judges completion.

## Procedure

1. **Write the condition once.** State one measurable end state, one declared check, and the
   constraints. Refuse a vague condition at assignment.
2. **Gate every completion claim on beside-it evidence.** No completion without evidence lines
   beside it; no blocked without one named obstacle. Natural-language completion phrases are
   ignored by design and refused as proof.
3. **Judge by an independent side reader.** An Arsenal side reader with read-only tools judges
   before any Arsenal goal counts complete, over the platform judgment. Failure of the checker
   defaults to refuse. The working seat never judges its own goal.
4. **Mate limits and brakes to cost.** Set bounded continuation turns, bounded duration, a token
   ceiling, and an enabled cost ceiling. Provider-blind ceilings are never armed. Emit a summary
   at eighty percent. Stop on no progress or repeated failure. Emit a closing summary at every
   limit. Resume opens a fresh budget window. Default values accepted as-is are refused.
5. **Persist fail-closed and resume only as stopped.** On interruption, persist the stopped state
   and resume only from that state. Never resume above an owner message or a GO gate.
6. **Sequence queued goals.** Hold one active goal; queue the rest in order.
7. **Keep every goal outside campaign sessions.** Refuse a goal inside a campaign session.
8. **Use no tool and no add-on.** Teach disciplined use through this skill and hold the control
   contract in the memo. The working surface on later builds is the built-in command itself.

## Outputs

- One written condition: measurable end state, declared check, constraints.
- Evidence lines beside every completion or blocked claim.
- A verdict from the independent side reader: complete, blocked, or refused.
- Limit and brake settings mated to the cost governor, with an eighty-percent summary and a
  closing summary at every limit.
- A fail-closed persisted state and a resume-from-stopped record.
- A queue of goals sequenced outside campaign sessions.

## Failure Modes

- Vague condition accepted at assignment: refuse and rewrite.
- Completion claimed without beside-it evidence: refuse; natural-language phrases are not proof.
- Working seat self-judging: refuse; route to the independent side reader.
- Provider-blind ceiling armed: refuse; only enabled cost ceilings count.
- Default limits accepted as-is: refuse; name owner sensitivity.
- Resume above an owner message or GO gate: refuse; resume only as stopped.
- Goal started inside a campaign session: refuse; keep campaign healing separate.
- Mechanical goal tool or add-on installed on later builds: refuse; use the built-in command.

## Trial Record

Trial date: 2026-11-05. Concern: MFT-114 (ARSENAL-AUDIT-EXEC-001, W2 node w2-goal-disc). Trial
goal: "goal-discipline skill exists and verify-skills passes." Condition (measurable end state):
`.opencode/skills/goal-discipline/SKILL.md` exists and `node scripts/verify-skills.mjs` exits 0
with `VERDICT: PASS`. Declared check: run the command and quote its final line. Evidence:

```
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
```

Independent judgment: the skill-format gate (verify-skills.mjs) is the side reader; its exit code
0 is the evidence. The working seat did not self-approve beyond the gate output.
