---
description: Search the kit catalog by task keywords and suggest the stack-fitting components, citing every install command from the lock.
---

# Catalog Search and Stack Suggest

You are searching the Vantrilex kit catalog. Your job is to **find** the
components that fit the operator's task and the project's stack, then
report. You install nothing and edit nothing.

Operator intent for this run:

$ARGUMENTS

If that is empty, print the usage summary and stop. If it names a task
(`search <keywords>`), run task search. If it names a stack
(`suggest <stack>` or `suggest` with no stack), run stack suggest. The two
passes may be combined as `search <keywords> suggest <stack>`.

## Step 1 - Read the catalog

Read the registry in this order of preference, stopping at the first one
present:

1. `registry/catalog.json` — the generated machine mirror. Prefer it.
2. `VANTRILEX_CATALOG.md` — the human table.
3. The per-kind index under `registry/` when one exists.

If none is present, stop and report that there is no catalog to search.
Searching without a catalog is invention.

## Step 2 - Task-oriented search

Match the operator keywords against component ids, kinds, tiers, and trigger
phrases, not against your memory of what the kit might hold:

- Tokenize the keywords on whitespace and hyphens.
- A component scores one point per keyword token appearing in its id,
  trigger, or kind label. Tier-0 core components score one bonus point for
  operational tasks (`equip`, `release`, `audit`, `doctor`).
- Print the top 10 hits as a table:
  `rank | id | kind | tier | trigger | install_cmd | verification`.
- Every `install_cmd` cell quotes the catalog row verbatim. A component
  whose command is `null` is listed as `NO COMMAND`, never given a
  substitute string.

## Step 3 - Stack suggest

Detect the project stack from its files, then suggest only the components
whose trigger actually fired:

- `package.json` — dependencies, scripts, test runner, formatter.
- The root lockfile — exactly one of `package-lock.json`,
  `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `bun.lockb`.
- `tsconfig.json` and formatting configs — which conditional checks run.
- The directory tree at depth 2, minus `node_modules`, `.git`, and build
  output.

Print one verdict line per stack dimension with its evidence file, then a
suggestion table: `id | kind | tier | trigger | evidence file`. A
conditional component with no triggering evidence is not suggested. A
dimension with no evidence is `unknown`, never a guess.

## Operating rules

1. **Never invent, guess, or repair an install command.** A
   plausible-looking wrong command is worse than an admission of
   ignorance, because an agent will run it.
2. **Quote, do not paraphrase.** Triggers and commands are quoted from
   the catalog row.
3. **Read-only.** This command writes no file.

## Final reply

Print, in this order:

1. **Catalog** — which catalog source was read and its entry count.
2. **Search hits** — the ranked table, or `NOT REQUESTED`.
3. **Stack verdicts** — one line per dimension with evidence.
4. **Suggested** — the suggestion table, or `NOT REQUESTED`.
5. **No command** — ids the catalog cannot install, with their kinds.
