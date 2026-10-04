---
name: session-context-primer
description: Use when a session starts or context is lost to compaction — rebuilds the working context in about ten seconds from the AI constitution, project summary, git state and circuit-breaker ledger, and emits a single CONTEXT ANCHOR block.
---

# Session Context Primer

## Purpose

Operationalize "prime context before action" at session start. Within a strict ~10-second
budget it loads the minimum state every role needs (mission, lifecycle phase, worktree
pool, next item, guard status) and emits a single CONTEXT ANCHOR block that anchors the
rest of the session. The primer is strictly read-only: it observes, it never edits, never
commits, and never resolves a dirty tree on its own.

## When to Use

- As the first action of any session in a project scaffolded by this kit.
- Immediately after a context reset, conversation compaction, or a cleared session.
- Before resuming work in an existing git worktree.
- Before the docs phase and the build phase, to confirm which phase is actually live.

## Do NOT use

- To repair what it observes. A dirty tree, a broken guard, or an open Diagnostic
  Incident Report is surfaced in the anchor and escalated, not silently fixed here.
- As a substitute for `preflight-system-doctor`. The primer assumes the machine was
  already verified; it does not re-check runtimes or authentication.
- To load project knowledge. If the mission or the next item is genuinely needed in
  depth, read `docs/00-PROJECT-SUMMARY.md` properly instead of stretching this.

## Inputs

- The project root, expected to contain `AGENTS.md` and the numbered docs set under
  `docs/`.
- Read access to git metadata (status, branch, recent commits).
- The circuit-breaker ledger state, if the `circuit-breaker-guard` skill has one open.

## Procedure

Read in strict order. The timebox rule in step 6 overrides everything else.

1. **Read the invariants.** Load `docs/25-AI-CONSTITUTION.md` (immutable laws) and the
   hard rules from `AGENTS.md`. Load these two, not the whole repository guide set.

2. **Read the mission and the checkpoint.** Take the one-liner mission from
   `docs/00-PROJECT-SUMMARY.md`, the current phase and pending item from
   `docs/17-CHECKPOINT.md`, and the guard state from `docs/18-WORKFLOW.md`. Do not open
   `docs/99-archive/`; superseded documents never carry live state.

3. **Read git state.** Current branch, short status, and the last five commits:

   ```bash
   git status --short --branch
   git log --oneline -5
   ```

4. **Read circuit-breaker state, if any.** If the `circuit-breaker-guard` skill has
   recorded strikes or emitted a Diagnostic Incident Report, load its current state: strike
   count, defect id, and the hypothesis the Guide approved. Otherwise record zero strikes.

5. **Emit the CONTEXT ANCHOR.** Output exactly one fenced block and nothing else:

   ```text
   CONTEXT ANCHOR
   ----------------------------------------------------------
   Mission  : <one-liner from docs/00-PROJECT-SUMMARY.md>
   Phase    : <current lifecycle phase: docs | plan | build | review | operate>
   Branch   : <branch> (<clean|N files changed>)
   Worktrees: <active worktrees, or "none">
   Next     : <top roadmap item id and title from docs/23-ROADMAP.md>
   Guards   : Clean Code <pending|passed> | Test <pending|passed> | Docs <pending|passed>
   Circuit  : <n> strike(s) <or "DIR open">
   ----------------------------------------------------------
   ```

   A filled anchor looks like this:

   ```text
   CONTEXT ANCHOR
   ----------------------------------------------------------
   Mission  : Ship a curated agent component kit onto target projects
   Phase    : build
   Branch   : wt/mech-skills (clean)
   Worktrees: wt-mech-skills (active)
   Next     : R-014 Regenerate catalog mirror and confirm the entry count
   Guards   : Clean Code pending | Test pending | Docs pending
   Circuit  : 0 strikes
   ----------------------------------------------------------
   ```

6. **Respect the hard rule.** If priming exceeds roughly 10 seconds worth of reads (very
   large files, slow storage, many worktrees), stop reading immediately and emit the
   anchor from whatever is loaded, marking unloaded slots as `unknown`. An approximate
   anchor now beats a perfect anchor late.

## Outputs

- Exactly one CONTEXT ANCHOR block in the session transcript (about nine lines).
- Nothing written to disk, no commits, no branches created or removed; the primer is
  strictly read-only.

## Failure Modes

- Missing docs: anchor from git state alone (branch, recent commits, dirty files) and
  flag the gap explicitly, for example `Docs unavailable - anchored from git state`.
- Oversized constitution or project summary: read only the invariants and mission
  sections, located by heading, instead of streaming whole files into context.
- Timebox exceeded: stop mid-sequence, emit the partial anchor, and mark unread slots
  `unknown` rather than finishing the read sequence.
- No git repository: anchor from `AGENTS.md` and `docs/25-AI-CONSTITUTION.md` only, and
  flag the missing VCS state.
- Dirty tree or detached HEAD: surface the condition verbatim in the anchor instead of
  resolving it silently; resolution belongs to the Leader.
