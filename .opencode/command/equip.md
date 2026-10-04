---
description: Invoke the Vantrilex Vanguard scout skill to detect project state and equip the Tier-0 kit plus the Tier-1 components this project actually needs.
---

# Equip the Kit

You are running the Vantrilex Vanguard scout pass: detect what this project is,
select the kit that fits it, install it, and prove it loads.

Operator intent for this run:

$ARGUMENTS

If that is empty, scout the project from scratch. If it names a component id, a
stack (`node`, `ui`, `data`, `docs`), or a scope (`tier-0`, `tier-1`, `full`),
treat it as a constraint on the selection and say how it narrowed the result.

## Step 1 - Load the scout skill

Invoke the **Vantrilex Vanguard** skill. If it is not installed, say so plainly
and stop; do not reconstruct it from memory.

Report which skill you loaded, or the single command that installs it.

## Step 2 - Detect project state

Read the files, do not infer from the directory name:

- `package.json` — dependencies, devDependencies, scripts. This decides the
  runtime, the package manager, the test runner, and the formatter.
- Lockfile at the repo root — `package-lock.json`, `pnpm-lock.yaml`,
  `yarn.lock`, `bun.lock`, `bun.lockb`. Exactly one is healthy; zero means
  dependencies are not installed; two or more is ambiguous and is a `FAIL`.
- `tsconfig.json`, `.prettierrc*`, `prettier.config.*`, `biome.json`,
  `eslint.config.*` — which of the conditional guards will actually run.
- The directory tree at depth 2, minus `node_modules`, `.git`, and build output.
- `docs/00-PROJECT-SUMMARY.md` and `docs/25-AI-CONSTITUTION.md` when present.
- `git rev-parse --abbrev-ref HEAD`, `git worktree list --porcelain`,
  `git status --short`.

Produce a one-line verdict per stack dimension: runtime, package manager,
module system, test runner, formatter, type checker, UI or not, data layer or
not. Every line must cite the file that proved it. A dimension with no
evidence is `unknown`, never a guess.

## Step 3 - Read the catalog

Read the registry that this project ships, in this order of preference:

1. `registry/catalog.json` — the generated machine mirror. Prefer it.
2. `registry/VANTRILEX_CATALOG.md` — the human table.
3. The per-kind index under `registry/` when one exists.

If none is present, stop and report that there is no catalog to select from.
Selection without a catalog is invention.

## Step 4 - Select

Select in three passes and show the arithmetic:

1. **Tier-0 core** — every component the kit provisions unconditionally. These
   are not optional and are not filtered by the stack.
2. **Tier-1 conditional** — only the components whose trigger the detection in
   step 2 actually fired. Each one must cite the trigger. A conditional
   component with no trigger is not selected.
3. **Conflicts** — read the overlap groups and drop anything a selected
   component `supersedes`. If two selected components `pairs_with`, keep both
   and say so.

Then read `registry/AGENTS.md`, `CONTRIBUTING.md`, or the repo constitution if
one exists, and report any selection the project's own rules forbid.

Print the selection as a table: `id | kind | tier | trigger | install_cmd`.

## Step 5 - Resolve install commands

For every selected component, read `install_cmd`, `verification`, and
`version_pin` from the catalog row.

- `install_cmd` present and `verification` is `verified` — run it.
- `install_cmd` present and `verification` is `unverified` — do **not** run it.
  List it under `NEEDS VERIFICATION` with the command and the reason it has not
  been checked.
- `install_cmd` is `null` — list it under `NO COMMAND` with its id and kind.

**Never invent, guess, or repair an install command.** A plausible-looking wrong
command is worse than an admission of ignorance, because an agent will run it.
If a component genuinely has to be installed and the catalog has no command for
it, stop and ask the operator for the command.

Pin every install to `version_pin` when the field is set.

## Step 6 - Equip and prove

- Write each component into its conventional location: skills under the skill
  directory, agents under `.opencode/agent/`, commands under
  `.opencode/command/`, formatting references under the project's design-token
  location, hooks and guards into the existing plugin module rather than into a
  new file. OpenCode has no hooks directory; a hook is a plugin callback.
- Update `.opencode/opencode.json` so the plugin and the MCP servers the kit
  selected are actually registered. Declare `"$schema"` first.
- Prove each component loaded. A component that was installed but never fired
  is not installed, it is staged:
  - skill — load it and confirm the description is surfaced.
  - agent — invoke it with a one-line task and confirm it responds.
  - command — invoke it with no argument and confirm it expands.
  - plugin — start the runtime and confirm the module loads without throwing.
  - MCP server — list servers and confirm the target is connected.
  - formatting reference — confirm the file exists at the documented path.

Record the result of each proof in a table: `id | kind | installed | proof |
verdict`. A component whose proof failed is `FAILED`, with the error, not
`installed`.

## Step 7 - Report

Print, in this order and nothing else:

1. **Project state** — the step 2 verdict lines with their evidence files.
2. **Selected** — the step 4 table.
3. **Installed** — what you ran and what it proved.
4. **Needs verification** — unverified commands, with the exact string.
5. **No command** — components the catalog cannot install, with their ids.
6. **Failed proofs** — with errors.
7. **Next step** — one sentence naming the first thing the operator should do.

Then write the selection and the proof results to the project's kit lock file
using the path the project already uses for it, or `kit.lock` at the repo root
when none exists. Include every selected id with its pinned version, its
`install_cmd`, and its `verification` state, so the next run is a diff rather
than a fresh guess.

After writing any file under `.opencode/`, tell the operator that OpenCode must
be quit and restarted before the change takes effect. Running sessions keep the
config that was loaded at startup.
