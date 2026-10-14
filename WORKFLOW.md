# WORKFLOW.md

This file carries the standing methodology in Part A and the current-task
workflow in Part B. Part B turns over with the work; Part A changes only
with a dated revision note.

## Part A — Standing methodology

Seeded read live from the canonical copy at
`.opencode/skills/vantrilex-workflow-forge/assets/workflow-md-template.md`
on 2026-10-13; never written from memory.

### A1 — Methodology

Every task runs a written workflow fixed before the first dispatch. The
workflow names its phases in order, the gate that closes each phase, and
the done state. Execution never invents process mid-task: a step with no
written workflow waits for one.

### A2 — Roles

One orchestrator authors the workflow and dispatches; subagents execute
exactly one concern each. Only the orchestrator writes `AGENT.md` and
`WORKFLOW.md`. Who decides each gate is named in the workflow before the
phase starts.

### A3 — Precautions

No phase starts until its preconditions are observed and recorded: live
files read, kit in force confirmed, prior gate signed off. A claim
without its observation is not reported; a gate without evidence does
not pass.

### A4 — Repair states

A blocked gate stops the run before the next dispatch; a failed gate
returns the work to its owner with the evidence attached. Every repair
that moves standing method lands a dated note, and the run resumes only
on the condition the note states.

### A5 — Research

Before execution may start, the run reads what the task touches and
proves what it assumes: the live project files, the lock entries it will
inject, and the sources its workflow names. Nothing is reconstructed
from memory.

### A6 — Expanded thinking

Per-task extras live in Part B beside the task they serve, and only
while the task runs. Standing text stays lean: an extra that outlives
its task is either promoted to Part A with its dated note or cut.

### A7 — Kit loadout

Components inject per phase from the lock in force and prune at each
transition; the MCP cap holds as backstop. The lock entry decides what
injects — never an id alone, never a printed table.

### Revision notes

- 2026-10-13 — First seeding of this repo's own `WORKFLOW.md`: Part A
  copied read live from the forge canonical template; Part B written for
  the NODE DOG dogfood task. No methodology change, this is the baseline.

## Part B — Current-task workflow

Task: NODE DOG dogfood — create the repo's own root `AGENT.md` plus this
`WORKFLOW.md`, append the §3.10 pointer section to `AGENTS.md`, on branch
`wt/v04-program`. Dispatch classification: scenario 1, NEW TASK — no task
was in flight in this session, so this is a Vanguard task-dispatch from
scratch, executed directly in the single DOG lane (no subagents fit a
three-file memory-seeding lane, and the work order forbids leaving it).

### 1 — Methodology

Seed truthfully from observation, write the three owned files, then
verify literally: markdownlint on all three files to exit 0, `git diff
--numstat` plus the full `git diff AGENTS.md` proving append-only, and a
report of evidence per section with `git status`. Done state: all three
files written, lint exit 0, diff proves zero removed lines, report
delivered, no commit.

### 2 — Roles

This DOG node executes the full lane: seeding, writing, verifying, and
reporting. The dispatching session owns the work order. The Guide owns
sign-off and any sequencing against the concurrent sibling CK lane. The
sibling CK session owns lock/catalog files and is never coordinated with
directly.

### 3 — Precautions

Live files were read before writing: `AGENTS.md`, the forge skill and
its canonical Part A template, the Vanguard agent/workflow templates,
the doctrine §3.10 pointer source, `docs/16-TASK-DISPATCH.md`,
`CHANGELOG.md` head, `git log`, `git status`, and `git diff --stat`.
Writes stay inside the three owned files; existing `AGENTS.md`
contributor content is never touched; no commit is made.

### 4 — Repair states

A failing markdownlint gate returns to this node with the lint output
attached; only the offending owned file is edited. Any write conflict on
a shared file stops the lane and escalates to the Guide for sequencing —
never a direct merge decision. A disputed guard is escalated to the
Guide, never weakened to pass.

### 5 — Research

Sources read and what each yielded: `AGENTS.md` (hard rules, append
target, no existing pointer section); the forge canonical template
(Part A text, copied verbatim); the Vanguard templates (AGENT.md
six-section shape); doctrine `SKILL.md` B.8.2 (verbatim pointer line and
canonical-region convention); `docs/16-TASK-DISPATCH.md` (five-scenario
classification, V2 surface, six inert hooks); `CHANGELOG.md` 0.3.0 plus
`git log`/`git status`/`git diff --stat` (landed vs in-flight streams).

### 6 — Expanded thinking

None — because a single-node, three-file memory-seeding lane needs no
auxiliary lanes beyond the verification the Methodology section names.

### 7 — Kit loadout

None — because this lane injects no kit components into any phase; it
writes repo-root memory files only. The lock was read for program
context, not for loadout, so no lock entry governs this workflow.
