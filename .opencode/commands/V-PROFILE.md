---
description: Manage install profiles with list apply diff new validation so every profile id resolves against the catalog.
---

# Install Profile Manager

You manage the Vantrilex install profiles declared in
`manifests/install-profiles.json`. Your job is to **list, compare, create,
apply, and validate** profiles. You never invent an install command.

Operator intent for this run:

$ARGUMENTS

The first token is the subcommand. The five subcommands are `list`,
`apply`, `diff`, `new`, plus `validate`. With no subcommand, print the
usage summary and stop.

## Subcommand - list

Print every profile as a table: `name | components | description`. The
`components` cell holds the count plus the first five ids followed by
`... (N more)` when longer. The data comes from
`manifests/install-profiles.json`, never from memory.

## Subcommand - apply

Usage: `apply <name> [--dry-run]`.

1. Read the named profile from `manifests/install-profiles.json`. A
   missing name is an error listing the available names; never fall back
   to a nearest match.
2. Resolve every profile id against `registry/catalog.json`. An id with no
   catalog row stops the apply with `UNKNOWN ID`, naming the id.
3. With `--dry-run`, or by default before any write, print the apply
   table: `id | kind | tier | install_cmd | verification | action`.
   `install_cmd` quotes the catalog row. `verification: unverified` rows
   and `null` commands are listed as `HELD (not run)`, never executed.
4. Without `--dry-run`, run only the `verified` commands at their pinned
   versions, prove each component loaded, then write the selection into
   the project's kit lock path with every id, version, command, and
   verification state.

## Subcommand - diff

Usage: `diff <name>`.

Compare the named profile against what the current project already has
installed, and print three groups: `MISSING (in profile, not installed)`,
`EXTRA (installed, not in profile)`, `AGREE (both, same pin)`. A pin
mismatch lands in `MISSING` with the expected versus actual pins quoted.
Every row cites the file that proved the installed side.

## Subcommand - new

Usage: `new <name> [--from <existing>] [--with <id,id,...>]`.

1. Start from the `--from` profile, or from an empty set when absent.
2. Add each `--with` id only after resolving it against
   `registry/catalog.json`. An unresolvable id stops the creation.
3. Validate the draft per the rules below, then write it into
   `manifests/install-profiles.json` preserving file order and
   formatting. Print the new profile row.
4. A profile that would be empty is rejected. Say so and write nothing.

## Subcommand - validate

Usage: `validate [<name>]`.

Validate one profile, or all profiles when no name is given, against the
catalog:

- Every id resolves to exactly one catalog row.
- Every kind is inside the schema enum.
- Every `verified` row carries a non-null `install_cmd`; a `null` command
  is recorded `unverified`.
- No profile is empty; no two profiles share one name.
- Print one line per profile: `VALID` or `INVALID` with the failing rule
  and the offending id. Any `INVALID` fails the run.

## Operating rules

1. **Catalog decides.** An id alone never installs; the catalog row does.
2. **Never invent a command.** A held command is reported, not replaced.
3. **One profile per run.** A subcommand touches exactly one profile,
   except bare `list` and bare `validate` which read all.
4. **English only.** No placeholder tokens in output or in new profiles.

## Final reply

Print, in this order:

1. **Subcommand** — the subcommand run and its arguments.
2. **Result** — the table or verdict the subcommand promises.
3. **Validation** — the `VALID` or `INVALID` line for every profile
   touched, or `NOT RUN`.
