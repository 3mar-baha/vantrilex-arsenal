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
- 2026-10-14 — NODE T3 pointer merge: no methodology change. Part B turns over to the NODE T3 workflow; standing method stands as seeded.

## Part B — Current-task workflow

Task: NODE T3 docs merge — fold the standing-law substance into the three root files through pointers with zero duplication, on branch `wt/v2-consolidation`. Dispatch classification: scenario 1, NEW TASK — this lane opens with no task in flight, so it plans from scratch and runs directly in the single lane (no subagents fit a three-file pointer-merge lane, and the work order forbids leaving it).

### 1 — Methodology

You plan once, then write the three owned files, then verify literally: markdownlint on all three files to exit 0, `git diff --numstat` plus the full `git diff` proving append-only, a single-home census proving zero duplication, and a per-section evidence report with `git status`. Done state: all three files extended, lint exit 0, diff proves zero removed lines, census passes, report delivered, no commit.

**Announce, then verify.** You announce completion explicitly with real evidence: the exact command run plus its real output, never a summary. An independent verifier checks the written files. The owner releases. Source: B.8.2 directive 4.

### 2 — Roles

This node drafts, verifies, and reports the full lane. The owning implementer writes the files. The Guide owns sign-off and sequencing. **§33B loop.** The lead plans the graph once, dispatches the ready set, verifies each landing itself (the branch exists, the diff carries that one concern and nothing else, the named command actually ran), and integrates; subagents execute and nothing else. Work outside a dispatched worktree is discarded and redispatched. Source: doctrine Rule 4 with Laws 1 and 5. Management-only, lane commits, models, and binding live in `AGENTS.md`; this section carries no copy of them.

### 3 — Precautions

Writes stay inside the three owned files; existing contributor content is never touched; no commit is made. **V2-first runtime.** The OpenCode V2 runtime auto-loads `AGENTS.md` and that file alone: not the generated mirror, not `AGENT.md`, and not the accepted-but-inert `instructions` array. You rely on native `AGENTS.md` discovery. Source: Vanguard A.7d, doctrine B.8.1.

### 4 — Repair states

A failing markdownlint gate returns to this node with the lint output attached; only the offending owned file is edited. A single-home census failure (one anchor phrase in two files) returns for re-homing before any other gate runs. Any write conflict stops the lane and escalates to the Guide for sequencing — never a direct merge decision. A disputed guard escalates to the Guide, never weakens to pass.

### 5 — Research

Sources read and what each yielded: `AGENTS.md` (hard rules, pointer line at line 105, append target); `AGENT.md` (six-section shape, lane history); `WORKFLOW.md` Part A (standing method, unchanged since seeding); doctrine `SKILL.md` B.8.2 (canonical region, directives 1–6), Rule 4 with Laws 1 and 5, B.8.1 (runtime auto-load), Rituals 1–2 (pointer line, orchestrator-only write); Vanguard A.7d (merge mechanics, verbatim pointer line), A.9 (honesty, roster-first binding), dispatch scenarios (scenario 1); `git log`, `git status`, `git diff --numstat` (tip `f9c7a6a`, clean tree, disjoint untracked paths).

### 6 — Expanded thinking

None — because a single-node, three-file pointer-merge lane needs no auxiliary lanes beyond the verification the Methodology section names.

### 7 — Kit loadout

None — because this lane injects no kit components into any phase; it writes repo-root memory files only.
