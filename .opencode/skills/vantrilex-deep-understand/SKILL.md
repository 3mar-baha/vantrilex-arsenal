---
name: vantrilex-deep-understand
description: Use when an AI agent must understand the Arsenal, orienting from the dev index first and deep-diving per area on demand without writing anything.
---

# Vantrilex Deep Understand

## Purpose

Read the Arsenal well enough to answer a question about it, and change nothing
while doing so. The skill drives progressive disclosure over
`docs/dev/00-INDEX.md`: read the index first, choose one area, open only that
area's document, and trace every figure back to the file that produced it. It is
strictly read-only. It never edits, regenerates, reformats, or commits. It
resolves `kit/kit.lock` and `registry/catalog.json` live at the moment of the
question, because a table printed inside any document is an illustration while
the live file is the authority.

## When to Use

- An agent has landed on this repository and must learn what it is and where
  each part lives before acting.
- A change is about to be made and the agent must know which surface it touches
  before the first edit.
- A claim about the kit, the registry, the gates, or the scripts has to be
  traced to a file rather than recalled from memory.
- Two sources disagree about membership or counts, so the live lock and the
  catalog mirror must decide which is current.
- An agent is returning after a lost context and needs orientation that costs
  one index read instead of a walk over the whole tree.

## Do NOT use

- To change anything. Reading is the entire output; an edit made under this
  skill is out of scope and must be reverted and reported.
- As a substitute for the verifiers. Reading reports what is present; only the
  verifier scripts prove that what is present holds.
- To regenerate the catalog mirror, the catalog table, or the per-kind indexes.
  Those are build outputs of the generator, never hand-written.
- To learn a target project the Arsenal was pointed at. This skill reads the
  Arsenal itself, not a project it equipped.
- When the question is how to run a build, a review, or a release. Those are
  workflow lanes with their own skills, not orientation.

## Inputs

- `docs/dev/00-INDEX.md`, the map and the reading order; read it first, always.
- `kit/kit.lock` and `kit/kit.lock.schema.json`, the pinned kit and its shape.
- `registry/catalog.json`, the generated mirror. It is derived from the catalog
  table and never hand-edited, so any disagreement with the table is drift to
  report rather than a difference to reconcile by editing.
- `scripts/generate-catalog-json.mjs`, whose exported `KINDS` order and
  `RECORD_FIELDS` list define what a catalog record may contain.
- Read access to `.opencode/**`, `scripts/**`, `kit/**`, `registry/**`,
  `docs/**`, and `AGENTS.md`.

## Procedure

1. Read `docs/dev/00-INDEX.md` and nothing else yet. It names the nine area
   documents, what each covers, and the order to read them in.
2. Pick the single area that answers the question, then open that one document.
3. Resolve every figure live instead of quoting it. The index carries the
   recount commands; run the one matching the claim and keep its output.
4. When the lock and the catalog mirror disagree, the lock entry decides what is
   installed, and the disagreement is reported rather than smoothed over.
5. Follow the area document's pointers into the real file it cites, and read the
   cited range before repeating the claim.
6. Stop as soon as the question is answered. Report the areas actually read and
   the areas deliberately skipped.

## Outputs

- One traced answer: the claim, the file, and the line range that proves it.
- The list of area documents read, and the ones skipped on purpose.
- Every disagreement found between a printed table, the live lock, and the
  catalog mirror, each with the command output that shows it.
- Zero bytes written. The deliverable is a report, never an edit.

## Failure Modes

- The agent edits, regenerates, or reformats instead of reading. Stop, revert
  the write, and report it; the skill is read-only by definition.
- A printed table is carried forward as truth after the lock has moved. Re-run
  the recount command and let the live file win.
- The whole tree is walked for one question. That is the cost this skill exists
  to remove: read the index, then one area.
- A file that is absent, or a check that never ran, is reported as satisfied.
  Absence and a skipped read are both findings and are named as such.
- A stale figure inside a document is repeated as fact. Report the figure, the
  file that carries it, and the live command output beside it.
