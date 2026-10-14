---
name: vantrilex-workflow-forge
description: Authors the standing methodology for each task — use when
  a new task starts, before execution begins, so the workflow is fixed
  before the first dispatch.
---

# Vantrilex Workflow-Forge

## Purpose

Vantrilex Workflow-Forge is the WORK-design skill of the Arsenal. It
answers one question — how is this task run? — by authoring the standing
methodology for each task before execution begins, so execution never
invents its own process mid-task. Four top-level skills exist in one
fixed order: `vantrilex-prime` orients the machine, `vantrilex-vanguard`
equips the project, the forge authors the per-task workflow, and
`vantrilex-doctrine` governs the work. The forge runs third in that
order, at every task start, and owns one artifact: the two-part
`WORKFLOW.md` in the target project root, with the standing methodology
in Part A and the current-task workflow in Part B.

Under OpenCode V2 a skill id is its directory path: this skill is
`vantrilex-workflow-forge` because it lives at
`.opencode/skills/vantrilex-workflow-forge/SKILL.md`, and Vanguard proves
the install by reading that path back. The frontmatter `description` is
mandatory because the router reads it when deciding whether to load the
skill; the frontmatter `name` is display-only and must equal the folder
name. The install command and its read-back proof live in the Forge skill
install section of `vantrilex-vanguard`, which is their single home —
this file states neither, and carries no copy of either.

## When to Use

- At the start of every task, before planning or dispatching anything.
- When a new task opens while an old one is still on disk: Part B turns
  over, Part A stays.
- When the methodology drifted mid-task and the standing text no longer
  describes how the work runs.
- When the owner asks how a task will be run, which workflow applies to
  it, or where the current workflow is written down.
- At every equip run and every later run that seeds or repairs the target
  root `WORKFLOW.md` from the canonical copy this skill carries.

## Do NOT use

- To equip a project. State detection, source surveying, kit selection,
  and installation belong to `vantrilex-vanguard`; the forge consumes the
  equipped kit and never selects it.
- To orient a machine or name the system. That is `vantrilex-prime`.
- To rule on laws, gates, roles, or halts. That is `vantrilex-doctrine`;
  the forge authors the workflow the laws govern and never adjudicates
  it.
- To execute the task. The forge writes the workflow, then hands off; a
  forge run that dispatches work has left scope.
- To restate a mechanism another skill owns. The halt block and the
  incident-report template live in `circuit-breaker-guard`; the anchor
  block lives in `session-context-primer`. This file names both homes and
  carries no copy of any of them.
- To seed Part A from memory. The canonical A1-through-A7 text lives
  beside this skill at `assets/workflow-md-template.md`; a Part A written
  from memory invents the very method the run exists to pin down.
- To carry standing method in Part B or per-task choice in Part A. The
  parts never blur; a blur fails the close gate.

## Inputs

- The task description as the owner phrased it, and whether the task is
  new, a modification, or a continuation with a parked lane.
- The live target project files, read before anything is written: the root
  `AGENT.md`, the root `WORKFLOW.md` with its Part A revision notes, and
  the kit region of the root `AGENTS.md` that names which files open every
  task. The doctrine skill owns that region; this file carries no copy of
  its text.
- The canonical Part A text beside this skill at
  `assets/workflow-md-template.md`, read live at seed time.
- The kit in force, read from `kit/kit.lock`: the phase and tier of every
  entry the workflow may load. The lock decides; no printed table in any
  skill file overrules it.
- Owner decisions at the gates the workflow names. No gate is assumed
  approved.

## Procedure

Run F.1 through F.6 in order at every task start. Each step produces a
fact the next step consumes; a step with nothing to consume is reported,
never guessed at.

### F.1 — Read the live files first

Read the root `AGENT.md` and the root `WORKFLOW.md` before planning or
dispatching anything, then the kit region of the root `AGENTS.md`. Record
what each file currently says: the open task, the standing methodology in
force, the dated revision notes on Part A, and the per-task workflow
still on disk from the previous task. When a file is absent, report it
absent; Vanguard seeds missing roots in the docs lane, and the forge
never reconstructs a file it has not read.

### F.2 — Confirm the task and its turnover state

State in one sentence whether the task is new, modified, or a
continuation, and whether Part B turns over. A new task replaces Part B
wholesale. A modification keeps Part B and re-authors the sections the
change touches. A continuation keeps both parts untouched and the forge
run ends after confirming them. Completed work is never re-derived: a
re-plan covers exactly the phases that have not run.

### F.3 — Author the seven sections

Write the per-task workflow in exactly these seven sections, in this
order. Every section carries content; a section with nothing to say
carries `none — because <reason>` with the reason stated, because an
empty section reads as unfinished while an explained absence reads as a
decision.

```text
| # | Section           | Holds                                              |
| 1 | Methodology       | How this task runs: phases, gates, done state      |
| 2 | Roles             | Which role owns each phase and decides each gate   |
| 3 | Precautions       | What must hold before each phase starts            |
| 4 | Repair states     | What a blocked or failed gate does, and the resume |
| 5 | Research          | What must be read or proven before execution       |
| 6 | Expanded thinking | The per-task extras this run needs, and no more    |
| 7 | Kit loadout       | Locked components per phase, read from the lock    |
```

Methodology states phases, gates, and done; it never restates doctrine
law — it names the workflow the laws govern. Roles assigns owners; the
role definitions themselves live in the doctrine skill. Precautions are
preconditions with evidence, not advice. Repair states name the halt,
the resume condition, and the note Part A receives. Research lists
sources with what each must yield. Expanded thinking holds the extras
the task genuinely needs; padding here is scope creep written down. Kit
loadout is read from the lock in force: id plus phase plus tier per
entry, pruned at each phase transition, with the MCP cap as backstop. A
printed mapping never overrules the lock.

### F.4 — Land the two-part artifact

Seed Part A of the target root `WORKFLOW.md` from the canonical copy
beside this skill, read live — never from memory — with items A1 through
A7 kept in order. Write Part B from the seven sections F.3 authored. When
Part A already matches the canonical copy, keep it untouched and say so;
an identical rewrite hides whether the text was verified or merely
rewritten. The artifact spec, with the never-blurred rule, lives under
Outputs; this step executes it.

### F.5 — Announce the plan before the first injection

Print the workflow before anything is injected and let the owner read it.
A plan presented after the kit is already in context cannot be corrected
without spending the injection to get there, so the announce is the last
cheap moment to change the plan. Proceed only on explicit owner sign-off
where the workflow names a gate.

### F.6 — Hand off to execution

Name the next owner of the decision and the trigger that moves it there,
then stop. The forge authors; the orchestrator dispatches under doctrine
governance. A forge run that performs project work, edits beyond the
workflow artifact, or dispatches a subagent has left scope — cut the
section and hand off.

### Revision (§4.4) — dated Part A notes

Part B turns over freely with the work: replace it when the task turns
over and say so in one line. Part A changes only with a dated revision
note appended under its Revision notes heading, stating the date, what
changed, and why — one line per change. A Part A edit without that note
fails the close gate and the run stays open; the note is the proof the
standing method moved deliberately rather than drifted. When the
methodology did not change, no note is written and the close record says
so explicitly. No task closes without its two landings: the Part A note
when the methodology changed, and the per-task `AGENT.md` update the
doctrine rituals require beside it.

## Outputs

- The two-part target root `WORKFLOW.md`, in this shape:

```text
# WORKFLOW.md

<one paragraph: Part A is standing, Part B turns over>

## Part A — Standing methodology

<items A1 through A7, copied from the canonical text the forge
carries, in order>

### Revision notes

<one dated line per change, or the standing no-revisions line>

## Part B — Current-task workflow

<the seven sections F.3 authored for the task in flight>
```

- Part A is standing methodology: task-independent, changed rarely, every
  change dated. Part B is the current-task workflow: task-particular,
  replaced on turnover. The parts never blur: standing method restated in
  Part B is a second copy that will drift — cut it and point at Part A. A
  per-task choice recorded in Part A without a dated note fails the close
  gate — move it to Part B or date the note.
- The announce: the printed workflow from F.5 with the owner sign-off it
  received, so the record shows the plan was read before it ran.
- Nothing else. The forge writes the workflow artifact and the announce;
  it creates no project file, no registry entry, and no documentation.

### Worked example end to end

Task: add request-id logging to the checkout service, owner-approved,
one concern, starting clean.

F.1 reads the live files: `AGENT.md` names the checkout service and its
current release; `WORKFLOW.md` carries Part A matching the canonical
copy with no revision notes; the kit region names the two files that
open every task. F.2 confirms: new task, Part B turns over wholesale.
F.3 authors the seven sections: Methodology names plan, build, and
review with the two-axis review gate and merge as the done state; Roles
assigns the plan to the orchestrator, the build to one Implementer
worktree, the verdict to the Guide; Precautions requires the service
test command recorded green before the build starts; Repair states sends
a failing probe to the bugfix workflow under its own defect id; Research
lists the checkout request path plus the logger docs with what each must
yield; Expanded thinking carries `none — because one concern needs no
auxiliary lanes`; Kit loadout reads the lock live and injects wayfinder
and ask-matt for plan, tdd for build, and code-review for review. F.4
seeds Part A from the canonical copy — already matching, so kept
untouched and reported so — and writes Part B from the seven sections.
F.5 prints the workflow; the owner signs off. F.6 names doctrine
governance as the next owner and stops. The build lands, review passes
on both axes, and the close carries no Part A note — the methodology did
not change — beside the per-task `AGENT.md` update the rituals require.

## Failure Modes

- **Execution starts before the forge run.** The start gate fails and the
  run stops before the first dispatch. A workflow authored after work
  began describes what happened, not what was decided.
- **Part A is seeded from memory.** The docs gate blocks: the canonical
  copy was unreadable or skipped, and seeding from memory invents the
  method the run exists to pin down. Report the block; never guess.
- **A section is empty without its reason.** The workflow is incomplete:
  `none — because <reason>` is a decision, an empty section is a gap.
  Refuse the handoff until every section speaks.
- **The parts blur.** Standing method in Part B is cut to a pointer;
  per-task choice in Part A moves to Part B or earns its dated note. A
  blur found at close fails the gate and the run stays open.
- **A task closes without both landings.** The dated Part A note when the
  methodology changed, plus the per-task `AGENT.md` update beside it. A
  close missing either fails the gate.
- **The run drifts into execution.** Performing project work, editing
  beyond the workflow artifact, or dispatching a subagent is scope
  failure: cut the section and hand off to the orchestrator.
- **A count, hash, or gate verdict is quoted from memory.** Counts come
  from the tree, hashes from the command that printed them, verdicts from
  the script that ran. A remembered number that no longer matches the
  tree is a silent lie.
- **A verification script runs and the session paraphrases it.** Paste the
  output and the exit code as printed. A check that cannot be evaluated
  is a failed check, never a skipped one, and never a pass.
