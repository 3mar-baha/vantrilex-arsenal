# Standing directives in the target project's AGENTS.md — vantrilex-doctrine satellite

Satellite of [vantrilex-doctrine](SKILL.md) (split 2026-11-12, F-09). The content below is the
B.8 subtree that used to live in the skill body, moved verbatim so every file stays under 500 lines.

### B.8 — Standing directives in the target project's `AGENTS.md`

Six directives are permanent. They used to be restated in every work order, which
meant the cost was paid again on each dispatch and any edit had to be replayed
into every brief already sent. They now live in one place instead: a delimited
region inside the target project's `AGENTS.md`, merged once and re-verified
forever after, with the generated `CLAUDE.md` mirror rebuilt from it on every
run. This section states where the region lives, what it says, when Doctrine
writes and verifies it, and how it is extended without touching a word the owner
wrote.

The region is read every session, so it carries no Arsenal internals and no
version numbers of its own: it states the six rules, carries the pointer line
that opens every task, names the owner, and stops. Everything an implementing
agent needs in order to place and repair the region sits in the prose around
it, never inside it.

#### B.8.1 — Where the region lives

One file, one region, one owner. The region lives at the repository root of the
equipped project, in `AGENTS.md`, merged after whatever the owner already wrote
there. The OpenCode V2 runtime auto-loads that file and that file alone: not the
generated mirror, not `AGENT.md`, and not the accepted-but-inert instructions
array. The merge never clobbers: every owner line outside the sentinels stays
exactly as written, and only the text between the sentinels is kit content. The
region is never written into the project's `docs/` series and is never merged
into `docs/25-AI-CONSTITUTION.md`: the constitution holds the project's own
immutable laws, the region holds the permanent Arsenal directives, and mixing
them makes it impossible to change one without rewriting the other. A directive
restated inside a work order is a second copy of a permanent rule, and two
copies of a permanent rule will disagree.

Two HTML comment sentinels delimit the region, so the region is findable by exact
string match and an agent can never mistake the owner's prose for kit content:

```text
<!-- vantrilex:agents-directives:begin spec=agents-directives@v1 -->
<!-- vantrilex:agents-directives:end -->
```

The opening sentinel carries the spec marker. The closing sentinel closes the
region and carries nothing else. `agents-directives` is the name and `v1` is
the revision; the marker exists so a later revision of the region can be told
apart from an edited or damaged one by reading a single line.

The generated mirror is `CLAUDE.md`, named here as the single authority for that
name. Vanguard carries no copy of it: it regenerates that file from the merged
`AGENTS.md` region on every run and never hand-edits it, so the source and the
mirror can never describe different rules.

#### B.8.2 — The canonical region

The region below is the exact text Doctrine merges. Copy it verbatim, including
both sentinels, the pointer line, and the blank line that separates the region
from the owner's content. The kit is the only writer: an agent that finds the
region missing writes it from here, and an agent that finds it drifted restores
it from here.

```text
<!-- vantrilex:agents-directives:begin spec=agents-directives@v1 -->

<!-- Written by the Vantrilex Arsenal. This region is maintained by the kit. To
     change it, edit the canonical copy in the Arsenal's doctrine skill; to add
     your own instructions, put them outside the sentinels above and below. -->

## Standing directives

These rules are permanent. They are set by the Vantrilex Arsenal and they are
not preferences, defaults, or suggestions.

At the start of every task, read AGENT.md and WORKFLOW.md in this project root before planning or dispatching anything.

1. **Plan once, then fan out.** Every task is planned once, up front, into a
   dependency graph. Independent tasks go to named subagents and run in parallel.
   Only a real dependency is chained. Exactly one writer owns each shared file,
   branch, or resource.
2. **Management only.** The orchestrator plans, dispatches, reviews, and
   integrates. Subagents execute the work. The orchestrator never executes node
   work itself.
3. **No commit, no push to main.** The kit never commits to `main` and never
   pushes to `main`. Work lands on a branch and merges into `main` only after it
   is verified.
4. **Announce, then verify.** Completion is announced explicitly, with real
   commit hashes. An independent verifier checks the result from a fresh clone.
   The owner releases.
5. **Free models only.** Every agent uses the free model tier. A paid model is
   never used, on any agent, for any task. A model pin that is paid or
   unavailable is auto-corrected: the agent inherits the default, or an
   available free model.
6. **General is the last resort.** Never dispatch the generic agent when a named
   specialist fits. When no roster member fits the assignment, state the reason
   in one line, then proceed.

### Shared infrastructure

The Vantrilex Arsenal plugin provides the guard infrastructure for this
project: the session task-dispatcher that classifies each turn, the
documentation-discipline guard that keeps Markdown inside its allowed set, and
the versioned component kit installed per phase. Those guards are configured in
the Arsenal config file. They are infrastructure, not permission: nothing they
do, and no setting in them, overrides a directive above.

`docs/25-AI-CONSTITUTION.md` holds this project's own immutable laws and stands
beside this region. It is not replaced by it and does not restate it.

<!-- vantrilex:agents-directives:end -->
```

The region text has one canonical home: here. Each equipped project carries its merged copy
inside `AGENTS.md`, restored from here whenever it drifts, and the `CLAUDE.md` mirror is
generated from that merged copy on every run, never written by hand. The canonical copy is
changed only here, so the three can never describe different rules.

#### B.8.3 — When Doctrine writes and verifies the region

The region is written and checked at two moments, by one procedure:

- **At equip, when the kit is already installed and the project is about to be
  documented.** The kit writes or verifies the region before the documentation
  phase closes, then regenerates the mirror from it, so no project leaves an
  equip run without both.
- **On every later run on an equipped project.** The region is re-verified before
  the run's own gates, a drifted region is repaired at the start of that run
  rather than left for the owner to notice, and the mirror is regenerated from
  the repaired source before the run proceeds.

#### B.8.4 — When a directive is missing: repair, and block

A missing region is repaired, and the repair is a gate:

- **A directive missing from the region, or the region missing from `AGENTS.md`
  entirely.** Doctrine restores the region from the canonical copy in B.8.2.
  This is a **block**, not a warning: the equip run does not close and the later
  run does not proceed to its own gates until the region is on disk and verified.
  A warning would let a project that lost the region keep working, and every
  later work order in that project would pay the repetition cost again.
- **A directive edited, reordered, or weakened.** The same repair and the same
  region. The owner's own words outside the sentinels are preserved; anything
  inside the sentinels is kit content and the kit decides it.
- **The opening sentinel present with the closing sentinel absent, or prose
  written after the region.** Drift. The region is replaced through the end of
  the file, which trims whatever was written after the kit content.
- **The owner's own instructions inside the sentinels.** Also drift, and restored
  the same way. Custom instructions belong outside the sentinels, and the region
  says so in its own header comment.
- **The spec marker in `AGENTS.md` disagrees with the spec this skill carries.**
  Drift. The region is restored, which brings the marker with it.
- **The mirror disagrees with the merged region.** Drift. The mirror is
  regenerated from the source and read back; it is never patched by hand to
  match, because a hand edit is a second copy that will disagree again.

Verification checks four things and reports all four: the opening sentinel is
present, the closing sentinel follows it, the region between them matches
the canonical copy character for character, and the mirror matches the region it
was generated from. The check is a guard, so it is never
evaluated from a summary: both files are read and compared. When either file or
the canonical copy cannot be read, the check reports `unverified` with the reason
and is treated as failed, never skipped.

#### B.8.5 — Extending an existing `AGENTS.md` without destroying it

An equipped project usually has an `AGENTS.md` the owner wrote. The region is
appended to it, never written over it:

- **The file does not exist.** Create it holding the region, with no header
  invented above it, then generate the mirror from it.
- **The file exists without the opening sentinel.** Append one blank line, then
  the region, then generate the mirror. Nothing above the region is read, moved,
  or reflowed.
- **The file exists with the opening sentinel.** Replace exactly the region
  between the sentinels, and nothing above or below it that the owner wrote,
  then regenerate the mirror from the merged source.

The mirror is never written by hand under any branch above: every branch ends by
regenerating it from the merged source, reading both files back, and reporting
drift instead of editing the mirror to match.

Idempotence is a property of that algorithm, not a convention. The opening
sentinel decides which branch runs, so a second run over an already-correct
`AGENTS.md` takes the replace branch, produces a region identical to the
canonical copy, regenerates an identical mirror, and writes the same files it
read. Re-running never duplicates the region, never appends a second copy below
the first, and never touches the owner's text.

#### B.8.6 — The region and the kill-switch config

The six directives are not switchable. `.opencode/arsenal.json` is the
kill-switch config for the Arsenal's own guards, and as it stands it resolves
exactly two switches: `docsGuard`, which configures the documentation
discipline guard and carries `mode`, `allowedDirs`, `allowedFiles`, and
`series`, and `taskDispatcher.enabled`, which turns the session
task-dispatcher instruction off. Neither key reaches the directive region, and no
key in that file weakens a directive, because a permanent rule that a config
file can quietly turn off is not permanent.

The two config switches do bound the region's own mechanics. `AGENTS.md` and the
generated `CLAUDE.md` mirror sit in the docs-guard's `allowedFiles` default, so
merging the region and regenerating the mirror pass the guard on every project
that left `allowedFiles` at its default. A project that narrowed `allowedFiles`
must list both files there for the write to pass, and a `docsGuard.mode` of
`block` refuses the write until it does.
