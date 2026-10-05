# AI Guide

Operating manual for AI coding agents working in `vantrilex-arsenal`. It is prescriptive: what to
run, in what order, and what never to do. It assumes no prior context and no ability to guess.

Canonical repository: `https://github.com/3mar-baha/vantrilex-arsenal`. That URL is the single
source of truth. Never announce a fork, a mirror, a vendored copy, or a locally modified clone as
the canonical source; report it as a deviation and let the owner decide.

Toolchain: Node 25, ESM, zero dependencies. There is no second language runtime and no terminal
multiplexer. Never install Python, a bundler, a framework, or a pane manager.

Census at the time of writing. These are observations, not constants — re-read them from disk
before you quote them.

| Fact | Value |
|---|---|
| Locked kit components | 50, with 0 pending |
| Kit by tier | 35 `core`, 15 `conditional` |
| Kit by kind | 24 skill, 8 mcp, 6 plugin, 6 hook, 6 agent |
| Kit verification | 12 `verified`, 38 `unverified` |
| MCP cap (`kit/kit.lock` `mcp_cap`) | 8 |
| Catalog records | 2,735 |
| Catalog by kind | 1,502 skill, 905 mcp, 284 agent, 19 hook, 13 formatting, 12 plugin |
| Catalog default-selected | 22 |
| Catalog verified install commands | 12 |
| Folders under `.opencode/skills/` | 19 |
| Of those, locked kit components | 14 |
| Of those, top-level skills | 3 |

## 1. The three skills and the order they run in

Exactly three top-level skills exist. Run them in this order and no other.

| Order | Skill | Frequency | Owns |
|---|---|---|---|
| 1 | `vantrilex-prime` | once per machine, first, always on a new machine | Orientation only |
| 2 | `vantrilex-vanguard` | once per target project | The EQUIP phase |
| 3 | `vantrilex-doctrine` | all work, forever after | Laws, phases, workflows, verdicts |

### `vantrilex-prime` — orientation

File: `.opencode/skills/vantrilex-prime/SKILL.md`.

Prime answers one question: what is this system, where does it live, and who owns the next decision.
It states the Arsenal, prints the canonical URL, clones and pins the repository, maps the tree on
disk, confirms the three top-level skills are present, names the order of use, and reads out the
standing laws.

Prime does not equip and it does not govern. It writes no project file, no registry entry, and no
documentation. The orientation report is the whole deliverable. If you catch yourself selecting a
kit or adjudicating a gate while running Prime, you have left scope — cut the section and hand off.

First actions, exactly:

```sh
git clone https://github.com/3mar-baha/vantrilex-arsenal.git
git rev-parse HEAD
```

Then verify these three paths exist, and that each file's frontmatter `name` equals its folder name:

```text
.opencode/skills/vantrilex-prime/SKILL.md
.opencode/skills/vantrilex-vanguard/SKILL.md
.opencode/skills/vantrilex-doctrine/SKILL.md
```

The one read-only proof command for the whole skill tree is:

```sh
node scripts/verify-skills.mjs
```

Paste its output and its exit code as printed. Never summarise it into a pass claim the script did
not make. Running the skill-format gate proves format only.

If a clone already exists, run `git rev-parse HEAD` inside it and report the same field. Do not
re-clone over an existing tree. If the machine is offline and no clone exists, report the clone step
SKIPPED with its reason and mark every later step BLOCKED on it — nothing after an absent repository
can be proven. Never proceed from memory about the tree.

A missing top-level skill is a hard stop: report it by name, refuse the handoff, and do not create
the file. A fabricated sibling passes inspection while governing nothing.

### `vantrilex-vanguard` — the EQUIP phase

File: `.opencode/skills/vantrilex-vanguard/SKILL.md`.

Vanguard runs once per target project and never skips ahead. It runs preflight, then detects one of
four project states, then the concept phase, then source surveying, then kit selection, then
install plus verification plus report, then the documentation phase.

Detect the project state yourself from code, docs, and a three-file spot check, then confirm it in
one sentence. Never ask the owner which state applies.

Install with real commands only, checked against a live registry. Never invent a package name and
never guess a repository path.

Vanguard then prepares the 28-file target-project documentation system across 8 folders. It writes
27 of the 28. The name `18-WORKFLOW.md` is reserved and owned by `vantrilex-doctrine`; Vanguard
records the name as reserved and creates nothing there, not even an empty file.

The kit verifier is the per-component proof. Where a component cannot be proven by script, Vanguard
runs the per-kind protocol and reports one row per component with tool, kind, status, evidence, and
how to fix.

### `vantrilex-doctrine` — the WORK phase

File: `.opencode/skills/vantrilex-doctrine/SKILL.md`.

Doctrine governs all work: the constitutional laws, decision rights across Leader, Guide, and
Implementer, the mandatory phase-to-skill map, the escalation ladder, the five workflows with their
gates and done-definitions, the session rituals, and the parallelism mechanics.

Load Doctrine at every phase transition, before injecting the next phase kit and pruning the last.
Load it whenever you need a ruling on which rules apply, which workflow applies, or who decides a
dispute, a gate verdict, or a HALT.

### The boundary rule

The other 16 folders under `.opencode/skills/` are component folders that Vanguard equips into a
target project. They are not entry points and they are not top-level skills.

- Never treat a kit component as a top-level skill. Only `vantrilex-prime`, `vantrilex-vanguard`,
  and `vantrilex-doctrine` are top-level.
- Never skip `vantrilex-prime` on a fresh machine. An unequipped machine is a Prime job.
- An equipped project with a pending decision is a Vanguard or a Doctrine job, never a Prime job.
- Skills and kit components share one tree, so a count of folders under `.opencode/skills/` is not
  a count of kit components. Read both counts separately.

## 2. The §33B orchestration law

The coding agent NEVER performs project work directly. This is a hard law, not a suggestion.

The agent plans once into a dependency graph, fans independent nodes out concurrently through
subagents, chains dependent nodes sequentially, orchestrates, and verifies. Subagents execute. You
orchestrate. Any edit you make yourself, outside a dispatched subagent's worktree, is discarded and
redispatched.

Do this:

1. Plan once. Build the dependency graph before the first dispatch.
2. Fan out every independent node as a concurrent subagent, one concern per worktree, on branch
   `wt/<concern-slug>`.
3. Chain dependent nodes sequentially. A node that depends on another's landed result waits.
4. Verify each result yourself: the branch exists, the diff carries that one concern and nothing
   else, and the named command actually passed.
5. Confirm a dispatch only when its result lands on disk or on the remote — never on a subagent's
   word.

### Single-writer

Exactly one branch owns each of these at a time. Never two.

| Resource | Rule |
|---|---|
| git branches and worktrees | One concern per branch, `wt/<concern-slug>` |
| `kit/kit.lock` | One owning branch at a time |
| `registry/data/*.jsonl` | One owning branch per sidecar |
| `registry/catalog.json` | Regenerated, never hand-written, never co-written |
| `CHANGELOG.md` | One owning branch at a time |
| `docs/` | One owning branch at a time |

In practice: two concerns that touch the same file are not independent. Chain them. Stop the second
branch the moment you see two writers on one file, and let the Leader re-sequence so the shared file
has exactly one owner. This is how merges conflict and data gets lost.

## 3. Announce-then-verify

Every claim is preceded by the observation behind it. A claim without the observation is not
reported at all.

| You need | You read it from |
|---|---|
| A commit id | `git rev-parse HEAD`, reported character for character |
| A gate verdict | The script that ran, output and exit code as printed |
| A count | The tree |
| A file path | The tree, with its observed presence or absence |

Never invent a hash, a gate result, a count, or a file path. Never reconstruct a commit id from
memory, never shorten it into a guess, never replace it with a branch name. Never quote a count
from this guide or from a skill file when the tree can be read instead — a remembered number that no
longer matches the tree is a silent lie.

If a check cannot be evaluated, it is a FAILED check. Not a skipped check. Never a passing one. Say
which gate could not be evaluated and why.

## 4. The six gates

All six must exit 0 before a change is claimed done. A skip is a failure.

| Gate | Command | Proves |
|---|---|---|
| Registry data | `node scripts/verify-registry.mjs` | 6 checks: strict UTF-8, schema conformance, row-count integrity against the generated tables, the install-command invariant, orphan references, duplicate ids |
| Catalog mirror | `node scripts/generate-catalog-json.mjs --check` | the generated machine mirror matches the Markdown source of truth |
| Kit | `node scripts/verify-kit.mjs` | 11 checks: the lockfile validates against its schema, each component kind is honest, catalog agreement between lock and mirror, the MCP cap, pending integrity |
| Skills | `node scripts/verify-skills.mjs` | 10 checks: the skill-file format contract |
| Plugin typecheck | `npx tsc --noEmit -p tsconfig.json` | `.opencode/plugin/arsenal.ts` typechecks under `strict` |
| Shell lint | `shellcheck scripts/*.sh .githooks/*` | the orchestration scripts and git hooks are lint-clean |

Two rules govern the verdicts. A gate reports PASS, FAIL, or SKIPPED, and a skipped check is never
reported as a pass. And a gate that cannot run — missing tool, missing file, missing configuration —
is a failed check, not a skipped one; say so in the change description rather than leaving the gate
green-looking.

## 5. Where everything lives on disk

| Path | What it is | Generated |
|---|---|---|
| `.opencode/skills/` | Every skill folder, one `SKILL.md` each: 3 top-level skills plus the component folders | No |
| `.opencode/agent/` | Role files: Leader, Guide, Implementer, red-team | No |
| `.opencode/plugin/arsenal.ts` | The plugin source that installs the Arsenal into a target project; it also carries the docs-discipline guard | No |
| `.opencode/command/` | Operator entry points, including prime, equip, doctor, and release | No |
| `registry/VANTRILEX_CATALOG.md` | The catalog. **The source of truth.** | Yes — edit the generator or the sidecar |
| `registry/catalog.json` | The machine mirror of the catalog, read by tooling | Yes — regenerate, never hand-edit |
| `registry/data/*.jsonl` | The data sidecars the catalog is generated from | No |
| `registry/schema/` | `catalog-v2.schema.json`, the record schema | No |
| `kit/kit.lock` | The pinned component set, its tiers and phases, `mcp_cap`, and the pending list | No |
| `scripts/` | The verification scripts (`verify-registry.mjs`, `generate-catalog-json.mjs`, `verify-kit.mjs`, `verify-skills.mjs`) and the seven orchestration shell scripts | No |
| `docs/` | This repository's documentation series, numbered `00` through `15`, plus `spec/` | No |
| `AGENTS.md` | The repository constitution for any coding agent | No |
| `CHANGELOG.md` | The release notes, extracted verbatim at release | No |

Never hand-edit the generated catalog table in `registry/VANTRILEX_CATALOG.md` or the mirror at
`registry/catalog.json`. Edit the generator or the JSONL sidecar, then regenerate.

The `docs/` series in this repository runs `00` through `15`. It is not the target-project series,
which runs `00` through `27` and is written by Vanguard into the equipped project.

## 6. Common mistakes to avoid

- **Performing project work yourself instead of dispatching subagents.** Plan, dispatch, verify,
  merge. Never write. See §2.
- **Running two writers against a single-writer resource.** Two branches writing one file is how
  data gets lost. Stop the second branch and re-sequence.
- **Inventing an install command for a component whose command is unverified.** A
  plausible-looking wrong command is worse than an admission of ignorance, because an agent will run
  it. Record the command as `null` with `verification: unverified`, or reject the component.
- **Reporting a gate as passing when it was skipped, or when it could not be evaluated.** Paste the
  real output and the exit code. An unevaluable gate is a failure.
- **Hand-editing `registry/VANTRILEX_CATALOG.md` or `registry/catalog.json`.** Change the generator
  or the sidecar and regenerate.
- **Treating a kit component as a top-level skill, or skipping `vantrilex-prime` on a fresh
  machine.** Exactly three skills are top-level, and Prime runs first, always.
- **Restating another skill's procedure.** Each mechanism and each workflow has a single home. Point
  at it instead of copying it; a second unauthenticated copy of a procedure is a scope failure even
  when it is accurate. Two concrete cases: the circuit-breaker halt block and the Diagnostic
  Incident Report template live in `circuit-breaker-guard`; the context anchor block lives in
  `session-context-primer`. Neither is restated here, in `vantrilex-prime`, or in
  `vantrilex-doctrine`.
- **Committing a placeholder.** No `TODO`, no `FIXME`, no stub section, no "coming soon", no
  deferred or half-written file. If something is unverified, say `unverified` and move on. A leaked
  credential is revoked first, then removed.
- **Adding a dependency to this repository.** It is Node-only, ESM, zero dependencies. If the
  standard library is insufficient, state why explicitly in the change rather than adding a package.
- **Force-pushing, rewriting published history, or committing directly to `main`.** Branch is
  `wt/<concern-slug>`. Merges return to `main` reviewed and signed off.
- **Concluding a task because the code runs.** A task is finished when the thing is proven. Run the
  six gates and record their verdicts.
