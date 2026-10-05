---
name: vantrilex-prime
description: Orients a fresh machine to the Arsenal — use when an agent lands on an unequipped machine, the orientation skill that states what the Arsenal is, where it lives on disk, and which top-level skill runs first.
---

# Vantrilex Prime

## Purpose

Vantrilex Arsenal is a shareable OpenCode plugin plus a component system. One repository carries the
plugin that installs the Arsenal into a target project, the Registry that describes every component
available to install, and the components themselves as portable folders. Nothing in it is model logic:
the whole system is Markdown, JSON, and Node ESM, and a project becomes equipped by installing
components from the Registry, never by copying prose into a repository. Prime is the orientation skill
of that system. An OpenCode instance dropped onto a fresh machine must be able to understand the
Arsenal end to end from this file alone: what the Arsenal is, where the canonical repository lives, how
to fetch and pin it, how the tree is laid out on disk, and which of the three top-level skills owns the
next decision. Prime reads the system and answers. It does not equip a project and it does not govern
work.

Exactly three top-level skills exist, and they run in one fixed order:

```text
| Order | Skill                | Owns                                              |
| 1    | `vantrilex-prime`    | Orientation: the system, the tree, who runs next |
| 2    | `vantrilex-vanguard` | The EQUIP phase for one target project           |
| 3    | `vantrilex-doctrine` | The WORK phase for every lane, gate, and verdict |
```

Prime runs once per machine. Vanguard runs once per target project. Doctrine governs every unit of
work from that point on. There is a fourth thing Prime tells the reader and nothing else: which of
those three owns the next decision.

## When to Use

- At the start of a session on a machine that has never carried the Arsenal, before any project work.
- When the owner says prime, orient, set up the arsenal, or asks what this system is and how to use it.
- When a session cannot say where the kit, the skills, the roles, or the Registry live on disk.
- When control is about to be handed to Vanguard or to Doctrine and the next owner of the decision is
  unclear.
- When re-orienting after a long gap or a context loss, to rebuild the system view before dispatching.

## Do NOT use

- To equip a project. Detecting the project state, surveying resources, selecting the kit, installing
  it, and verifying it are the EQUIP phase, and that entire phase belongs to `vantrilex-vanguard`.
  Prime names the skill in one line and stops.
- To detect the project state or to run any of the four states. That detection tree has a single home
  in Vanguard, and Prime restates none of it.
- To author, amend, or adjudicate a workflow, a gate, or a done-definition. Those belong to
  `vantrilex-doctrine`; Prime points at them and never paraphrases their steps.
- To restate a mechanism another skill owns. The circuit-breaker halt block and the Diagnostic
  Incident Report template live in `circuit-breaker-guard`, and the context anchor block lives in
  `session-context-primer`. Prime names where each one lives and carries no copy of any of them.
- To write project code, tests, documentation, or registry data. Prime reads the tree and reports on
  it; it creates no project artifact and edits no component.
- To substitute for the repository proof scripts. Orientation is not verification: a green Prime run
  says the system was found and named, and says nothing about whether its contents are correct.
- To continue after reporting a missing top-level skill. A missing skill is reported explicitly and the
  handoff is refused; assuming it is present because the tree looks familiar is the one failure this
  skill exists to prevent.

## Inputs

- The machine's current state: whether an Arsenal clone already exists, and at what path.
- The canonical repository URL, which is fixed and is never guessed, substituted, or mirrored.
- Network access for the clone step. When the machine is offline, that one step is reported SKIPPED
  with its reason and every later step runs against the local clone only.
- The path of the target project, held only so Prime can name which project Vanguard would be pointed
  at next. Prime never opens, scans, or judges that project.
- The owner's own words, when the trigger was a request rather than a fresh session.

## Procedure

Prime runs eight steps in order, under the standing laws of P.8. Each step produces a fact that the
next step consumes; a step with nothing to consume is reported, not guessed at.

### P.1 — Name the system

State the Arsenal in one paragraph: a shareable OpenCode plugin plus a component system, held in one
repository, carrying the plugin, the Registry, and the components as portable folders, with no model
logic anywhere in it. The repository is Node 25, ESM, and zero dependencies, so a second language
runtime is never installed and never assumed, and there is no terminal multiplexer in the toolchain,
so no pane-splitting step appears in this procedure.

### P.2 — Name the canonical repository

One URL, printed exactly, and nothing else:

```text
https://github.com/3mar-baha/vantrilex-arsenal
```

This is the single source of truth for the Arsenal. A fork, a mirror, a vendored copy, or a
locally-modified clone is never announced as the canonical source. When the clone on disk differs from
the canonical URL, the local path is reported as a deviation and the owner decides.

### P.3 — Clone and pin

Run exactly these two commands, in this order, from the directory that will hold the clone:

```sh
git clone https://github.com/3mar-baha/vantrilex-arsenal.git
git rev-parse HEAD
```

Report the commit id that `git rev-parse HEAD` actually printed, character for character. A commit id
is never reconstructed from memory, never shortened into a guess, and never replaced by a branch name.
When the clone already exists, run `git rev-parse HEAD` inside it and report the same field; do not
re-clone over an existing tree. When the machine is offline and no clone exists, report the clone step
SKIPPED with the reason and mark every later step BLOCKED on it, because nothing after an absent
repository can be proven.

### P.4 — Map the tree

Report these component homes, each with its observed presence:

```text
| Path                | Holds                                                        |
| `.opencode/skills/` | Every skill folder, one SKILL.md each                       |
| `.opencode/agent/`  | The role files: Leader, Guide, Implementer, and red-team     |
| `.opencode/plugin/` | The plugin source that installs the Arsenal into a project   |
| `registry/`         | The Registry: catalog, data sidecars, and schema             |
```

Skills and kit components share the `.opencode/skills/` tree, which is why a count of folders there is
not a count of kit components. After the current restructure, `.opencode/skills/` holds nineteen
folders: three are the top-level orchestration skills and the rest are kit components. Name the
supporting paths beside them, because a fresh instance looks for them next:

```text
| Path                   | Holds                                                  |
| `.opencode/command/`   | Operator entry points, including prime and equip      |
| `kit/kit.lock`         | The pinned component set with its pending list         |
| `scripts/`             | The verification scripts and the release scripts      |
| `AGENTS.md`            | The repository constitution for any coding agent      |
```

The pinned kit is locked at fifty components with an empty pending list, and the lockfile caps MCP
transports at eight. Both numbers are read from `kit/kit.lock` and reported as read; when the file is
absent or unreadable, that is reported as a deviation and never replaced with the remembered number.

### P.5 — Verify the three top-level skills

Check existence of all three paths, then check that each frontmatter `name` equals its folder name:

```text
| Skill                | Path                                                  | Verdict            |
| `vantrilex-prime`    | `.opencode/skills/vantrilex-prime/SKILL.md`           | Present            |
| `vantrilex-vanguard` | `.opencode/skills/vantrilex-vanguard/SKILL.md`        | Present            |
| `vantrilex-doctrine` | `.opencode/skills/vantrilex-doctrine/SKILL.md`        | Present            |
```

A missing path, an unreadable file, or a `name` that does not match its folder is reported
explicitly, by name, as a failure. It is never assumed present because the tree looks familiar, and it
is never silently repaired by creating the file: Prime does not author a sibling skill. The single
read-only proof command for the whole skill tree is:

```sh
node scripts/verify-skills.mjs
```

Its output is pasted as printed, with its exit code, and it is never summarised into a pass claim the
script did not make. The Arsenal ships six verification gates in total — registry integrity, the
generated catalog mirror, the kit, the shell scripts, the plugin typecheck, and the documentation
links — and Prime names them so a fresh instance knows what proof exists. Prime does not run the five
that are not the skill-format gate, and running the skill-format gate proves format only.

### P.6 — Introduce the two sibling skills

One line each, no more:

- `vantrilex-vanguard` detects the project state, surveys the resources, selects and installs the kit,
  verifies it, and reports — the EQUIP phase.
- `vantrilex-doctrine` holds the constitutional laws, the phase-to-skill mapping, and the workflows for
  features, reviews, security audits, bug fixes, and releases — the WORK phase.

Both lines name the scope. Neither line is expanded into steps, gates, or criteria, because a summary
of a sibling's procedure is a second, unauthenticated source of process truth beside the one that owns
it.

### P.7 — State the order of use

Report the order plainly: Prime once per machine, then Vanguard once per target project, then Doctrine
for all work. Where the session currently sits is named as one of the three, and the next owner of the
decision is named with it. An unequipped machine is a Prime job; an equipped project with a pending
decision is a Vanguard or a Doctrine job, never a Prime job.

### P.8 — Read out the standing laws

Three laws bind Prime from its first line, and all three carry forward into every later phase:

- **The coding agent never performs project work directly.** It plans, dispatches subagents, verifies
  their results, and merges; the subagents write. This holds during orientation too: Prime reads and
  reports, it does not edit a project. The full text of this law and its consequence belongs to
  `vantrilex-doctrine`.
- **Announce, then verify.** Every path, count, and identifier in this report is read from disk and
  shown before it is acted on. A claim without the observation behind it is not reported at all.
- **Never invent hashes, gates, or results.** A commit id comes from `git rev-parse HEAD`, a count
  comes from the tree, a gate verdict comes from the script that ran. A missing observation is reported
  as missing.

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
  name, refuse the handoff, and stop. Creating the file is not the fix, because Prime does not author a
  sibling skill and a fabricated copy would pass inspection while governing nothing.
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
