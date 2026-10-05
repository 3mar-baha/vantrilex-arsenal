---
name: vantrilex-prime
description: Orients a fresh machine to the Arsenal — use when an agent lands on an unequipped machine or the owner says prime or orient, stating what the system is and which top-level skill runs first.
---

# Vantrilex Prime

## Purpose

Vantrilex Arsenal is a shareable OpenCode plugin plus a component system. One repository carries the
plugin that installs the Arsenal into a target project, the Registry that describes every component
available to install, and the components themselves as portable folders. Nothing in it is model
logic: the whole system is Markdown, JSON, and Node ESM — Node 25, zero dependencies — and a project
becomes equipped by installing components from the Registry, never by copying prose into it.

Prime is the orientation skill of that system. A fresh OpenCode instance lands on a machine with no
map of any of this, and an agent with no map guesses: it assumes paths, invents commands, and acts
on memory. Prime exists so the instance never has to guess. Read this file and the system is known
end to end — what the Arsenal is, where the canonical repository lives, how to fetch and pin it,
how the tree is laid out on disk, and which of the three top-level skills owns the next decision.
Prime reads the system and answers. It does not equip a project and it does not govern work.

Exactly three top-level skills exist, and they run in one fixed order:

```text
| Order | Skill                | Owns                                              |
| 1    | `vantrilex-prime`    | Orientation: the system, the tree, who runs next |
| 2    | `vantrilex-vanguard` | The EQUIP phase for one target project           |
| 3    | `vantrilex-doctrine` | The WORK phase for every lane, gate, and verdict |
```

Prime runs once per machine. Vanguard runs once per target project. Doctrine governs every unit of
work from that point on. The one thing Prime tells the reader beyond the system itself is which of
those three owns the next decision — and nothing else.

## When to Use

- At the start of a session on a machine that has never carried the Arsenal, before any project work.
- When the owner says prime, orient, set up the arsenal, or asks what this system is and how to use it.
- When a session cannot say where the kit, the skills, the roles, or the Registry live on disk.
- When control is about to pass to Vanguard or to Doctrine and the next owner of the decision is
  unclear.
- When re-orienting after a long gap or a context loss, to rebuild the system view before dispatching.

## Do NOT use

- To equip a project. Detecting the project state, surveying resources, selecting the kit, installing
  it, and verifying it are the EQUIP phase, and that entire phase belongs to `vantrilex-vanguard`.
  Prime names the skill in one line and stops.
- To detect the project state or to run any of the four states. That detection tree has a single home
  in Vanguard, and Prime restates none of it — not the state names expanded, not the probes, not the
  outcomes.
- To author, amend, or adjudicate a workflow, a gate, or a done-definition. Those belong to
  `vantrilex-doctrine`; Prime points at them and never paraphrases their steps.
- To restate a mechanism another skill owns. The halt block and the incident-report template live in
  `circuit-breaker-guard`, and the anchor block lives in `session-context-primer`. Prime names where
  each one lives and carries no copy of any of them, because a second copy becomes a second,
  unauthenticated source of process truth beside the one that owns it.
- To write project code, tests, documentation, or registry data. Prime reads the tree and reports on
  it; it creates no project artifact and edits no component.
- To substitute for the repository proof scripts. Orientation is not verification: a green Prime run
  says the system was found and named, and says nothing about whether its contents are correct.
- To continue after reporting a missing top-level skill. A missing skill is reported explicitly and the
  handoff is refused; assuming it is present because the tree looks familiar is the one failure this
  skill exists to prevent.

This list is the scope boundary: if Prime describes a project state or a workflow beyond a one-line
pointer, that is a defect — cut the section and hand off to the skill that owns it.

## Inputs

- The machine's current state: whether an Arsenal clone already exists, and at what path.
- The canonical repository URL, which is fixed and is never guessed, substituted, or mirrored.
- Network access for the clone step. When the machine is offline, that one step is reported SKIPPED
  with its reason and every later step runs against the local clone only.
- The path of the target project, held only so Prime can name which project Vanguard would be pointed
  at next. Prime never opens, scans, or judges that project.
- The owner's own words, when the trigger was a request rather than a fresh session.

## Procedure

Run the eight steps in order. Each step produces a fact that the next step consumes; a step with
nothing to consume is reported, not guessed at.

### P.1 — Name the system

State the Arsenal in one paragraph: a shareable OpenCode plugin plus a component system, held in one
repository, carrying the plugin, the Registry, and the components as portable folders, with no model
logic anywhere in it. Name the toolchain beside it — Node 25, ESM, zero dependencies — because that
tells a fresh instance what never to reach for: no second language runtime is installed or assumed,
and no pane-splitting session tool appears anywhere in this procedure.

### P.2 — Name the canonical repository

Print one URL, exactly, and nothing else:

```text
https://github.com/3mar-baha/vantrilex-arsenal
```

This is the single source of truth for the Arsenal. A fork, a mirror, a vendored copy, or a
locally-modified clone is never announced as the canonical source. When the clone on disk differs
from it, report the local path as a deviation and let the owner decide — Prime never rewrites the
remote or discards local changes on its own authority.

### P.3 — Clone and pin

Run exactly these two commands, in this order, from the directory that will hold the clone:

```sh
git clone https://github.com/3mar-baha/vantrilex-arsenal.git
git rev-parse HEAD
```

Report the commit id that `git rev-parse HEAD` actually printed, character for character. Memory is
unreliable about hashes, so a commit id is never reconstructed from memory, never shortened into a
guess, and never replaced by a branch name. When the clone already exists, run `git rev-parse HEAD`
inside it and report the same field; do not re-clone over an existing tree. When the machine is
offline and no clone exists, report the clone step SKIPPED with the reason and mark every later step
BLOCKED on it, because nothing after an absent repository can be proven.

### P.4 — Map the tree

Report these component homes, each with its observed presence:

```text
| Path                | Holds                                                      |
| `.opencode/skills/` | Every skill folder, one SKILL.md each                     |
| `.opencode/agent/`  | The role files: Leader, Guide, Implementer, and red-team   |
| `.opencode/plugin/` | The plugin source that installs the Arsenal into a project |
| `registry/`         | The Registry: catalog, data sidecars, and schema           |
```

Skills and kit components share the `.opencode/skills/` tree, which is why a folder count there is
not a component count. The tree holds twenty folders: three are the top-level orchestration skills,
twelve more are locked kit components, and five sit on disk unlocked. Read that split from
`.opencode/skills/` and `kit/kit.lock` rather than from this file, because a folder can land on disk
before or after the lock catches up with it. Name the supporting paths beside them, because a fresh
instance looks for them next:

```text
| Path                 | Holds                                             |
| `.opencode/command/` | Operator entry points, including prime and equip |
| `kit/kit.lock`       | The pinned component set with its pending list    |
| `scripts/`           | The verification scripts and the release scripts |
| `AGENTS.md`          | The repository constitution for any coding agent |
```

The pinned kit is locked at fifty-two components with an empty pending list — thirty-six core,
sixteen conditional — and the lockfile caps MCP transports at eight. Read the total, the tier split,
the pending length, and the cap from `kit/kit.lock` and report them as read; when the file is absent or
unreadable, report that as a deviation and never fill it in from memory, because a remembered number
that no longer matches the tree is a silent lie.

### P.5 — Verify the three top-level skills

Check that all three paths exist, then check that each frontmatter `name` equals its folder name:

```text
| Skill                | Path                                               | Verdict |
| `vantrilex-prime`    | `.opencode/skills/vantrilex-prime/SKILL.md`        | Present |
| `vantrilex-vanguard` | `.opencode/skills/vantrilex-vanguard/SKILL.md`     | Present |
| `vantrilex-doctrine` | `.opencode/skills/vantrilex-doctrine/SKILL.md`     | Present |
```

A missing path, an unreadable file, or a `name` that does not match its folder is reported
explicitly, by name, as a failure. It is never assumed present because the tree looks familiar, and
it is never silently repaired by creating the file: Prime does not author a sibling skill, and a
fabricated copy would pass inspection while governing nothing. The single read-only proof command
for the whole skill tree is:

```sh
node scripts/verify-skills.mjs
```

Paste its output as printed, with its exit code, and never summarise it into a pass claim the script
did not make. The Arsenal ships six verification gates in total — registry integrity, the generated
catalog mirror, the kit, the shell scripts, the plugin typecheck, and the documentation links — and
Prime names them so a fresh instance knows what proof exists. Prime runs none of the five beyond the
skill-format gate, and running the skill-format gate proves format only.

### P.6 — Introduce the two sibling skills

One line each, no more:

- `vantrilex-vanguard` detects the project state, surveys the resources, selects and installs the kit,
  verifies it, and reports — the EQUIP phase.
- `vantrilex-doctrine` holds the constitutional laws, the phase-to-skill mapping, and the workflows for
  features, reviews, security audits, bug fixes, and releases — the WORK phase.

Both lines name the scope. Neither line expands into steps, gates, or criteria, because a summary of
a sibling's procedure is a second, unauthenticated source of process truth beside the one that owns
it.

### P.7 — State the order of use

Report the order plainly: Prime once per machine, then Vanguard once per target project, then
Doctrine for all work. Name where the session currently sits as one of the three, and name the next
owner of the decision beside it. An unequipped machine is a Prime job; an equipped project with a
pending decision is a Vanguard or a Doctrine job, never a Prime job.

### P.8 — Read out the standing laws

Three laws bind Prime from its first line, and all three carry forward into every later phase:

- **The coding agent never performs project work directly.** It plans, dispatches subagents, verifies
  their results, and merges; the subagents write. This holds during orientation too: Prime reads and
  reports, it does not edit a project. The full text of this law and its consequence belongs to
  `vantrilex-doctrine`.
- **Announce, then verify.** Every path, count, and identifier in this report is read from disk and
  shown before it is acted on. A claim without the observation behind it is not reported at all.
- **Never invent hashes, gates, or results.** A commit id comes from `git rev-parse HEAD`, a count
  comes from the tree, a gate verdict comes from the script that ran. A missing observation is
  reported as missing.

## Outputs

- One orientation report, in this shape:

```text
ORIENTATION REPORT
System    : Vantrilex Arsenal, shareable plugin plus component system
Repository: https://github.com/3mar-baha/vantrilex-arsenal
Commit    : <the id git rev-parse HEAD printed, verbatim>
Tree      : <the four component homes, each marked present or absent>
Skills    : <the three top-level skills, each marked present or absent>
Order     : Prime, then Vanguard per project, then Doctrine for all work
Next owner: <prime | vanguard | doctrine>
```

- One skill-presence table with the three rows from P.5, every absence named rather than summarised.
- One handoff line naming the next owner of the decision and the trigger that moves it there, so the
  session never has to guess whether a project is equipped.
- Nothing else. Prime writes no project file, no registry entry, and no documentation; the report is
  the whole deliverable.

## Failure Modes

- **A top-level skill is missing or its frontmatter name does not match its folder.** Report it by
  name, refuse the handoff, and stop. Creating the file is not the fix, because Prime does not author
  a sibling skill and a fabricated copy would pass inspection while governing nothing.
- **The canonical repository cannot be reached.** Report the clone step SKIPPED with the reason, and
  report every later step BLOCKED on it. Proceeding from memory about the tree is the exact failure
  this skill exists to prevent.
- **A commit id is needed and none was observed.** Report it as not obtained. A hash reconstructed
  from memory, abbreviated, or substituted with a branch name is a fabricated result.
- **The local clone is a fork, a mirror, or modified.** Report it as a deviation against the canonical
  URL and let the owner decide. Prime never rewrites the remote or discards local changes.
- **A count is quoted from this file rather than from the tree.** Read it again. The kit size, the
  folder count, and the pending-list length are observations, and a remembered number that no longer
  matches the tree is a silent lie.
- **The orientation drifts into equipping or governing.** Cut the section and hand off to
  `vantrilex-vanguard` or `vantrilex-doctrine`. Restating a sibling's procedure is a scope failure
  even when the summary is accurate.
- **A verification script runs and the session paraphrases it.** Paste the output and the exit code as
  printed. A check that cannot be evaluated is a failed check, never a skipped one, and never a pass.
