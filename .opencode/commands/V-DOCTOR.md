---
description: Triage environment, runtimes, configuration, and workspace into PASS WARN FAIL rows, with safe automatic repair behind opt-in repair flag.
---

# Environment Triage Doctor

You are running the Vantrilex environment triage. Your job is to **measure**
the machine and the project, then report. Without the repair flag you
change nothing; with it you apply only the allow-listed safe repairs.

Operator intent for this run:

$ARGUMENTS

If that is empty, run the full triage over every section below. If it names
a section (`environment`, `runtimes`, `configuration`, `workspace`), run
that section and mark the others `SKIPPED (not requested)`. If it carries
`--fix`, apply the safe-repair allow-list after reporting.

## Which doctor, and where commands live

- Read-only preflight — `.opencode/command/doctor.md` (**System Doctor**) measures the machine and never fixes or installs.
- Opt-in repair — this file, `.opencode/commands/V-DOCTOR.md` (**Environment Triage Doctor**), adds the `--fix` safe-repair allow-list to the same sections.
- Canonical location — `.opencode/commands/` is authoritative for the 18 V-commands; the four root-scope commands (`doctor.md`, `equip.md`, `prime.md`, `release.md`) live under `.opencode/command/`.

## Section A - Environment

| # | Check | Severity | How to measure |
|---|---|---|---|
| A1 | Node runtime present | CRITICAL | `node --version` |
| A2 | Node major version is 22 or newer | CRITICAL | parse the major out of A1 |
| A3 | `npm` present and runnable | HIGH | `npm --version` |
| A4 | `npx` present | MEDIUM | `npx --version` |
| A5 | `git` present and executable | CRITICAL | `git --version` |
| A6 | `gh` CLI present and authenticated | LOW | `gh auth status` (report only, never print a token) |
| A7 | Working directory writable | CRITICAL | write-probe via node `fs.accessSync` with `W_OK` |
| A8 | Guard state directory writable | LOW | probe `$VANTRILEX_STATE_DIR`, else the cache dir, else the OS temp dir |

## Section B - Runtimes

Each row is conditional on the project actually using that toolchain.

| # | Check | Pass condition | Otherwise |
|---|---|---|---|
| B1 | TypeScript | a `tsconfig.json` exists and a local `tsc` is resolvable | `SKIPPED` with which half is missing |
| B2 | Formatter configured | a formatter config or dependency exists with a resolvable binary | `SKIPPED` with which half is missing |
| B3 | Package manager | exactly one root lockfile | `SKIPPED (no lockfile)`; more than one is `FAIL (ambiguous lockfiles)` |
| B4 | Test runner | `package.json` exposes a `test` script | `SKIPPED (no test script)` |
| B5 | Shell linting | `shellcheck --version` succeeds | `SKIPPED (shellcheck not installed)` |
| B6 | Local binaries resolvable | `node_modules/.bin` exists | `SKIPPED (dependencies not installed)` |

## Section C - Configuration

| # | Check | Severity | Pass condition |
|---|---|---|---|
| C1 | Tier-0 plugin present | HIGH | `.opencode/plugin/arsenal.ts` exists |
| C2 | Operator commands present | HIGH | `.opencode/commands/` holds at least 18 V-commands (18 counted 2026-10-18) |
| C3 | Command frontmatter valid | HIGH | every command file has a `description` and a non-empty body |
| C4 | Guard configuration parses | MEDIUM | `.opencode/arsenal.json` absent (`SKIPPED (defaults in use)`) or parses as JSON |
| C5 | Catalog mirror in sync | HIGH | the generator reproduces `registry/catalog.json` with no diff |
| C6 | Secret hygiene | HIGH | no `.env` file is tracked by git; never print file contents |

## Section D - Workspace

| # | Check | Severity | Pass condition |
|---|---|---|---|
| D1 | Worktree is clean | MEDIUM | `git status --short` prints nothing |
| D2 | Registry verifier passes | HIGH | `node scripts/verify-registry.mjs` exits 0 |
| D3 | Catalog verifier passes | HIGH | `node scripts/verify-catalog.mjs` exits 0 |
| D4 | Skills verifier passes | MEDIUM | `node scripts/verify-skills.mjs` exits 0 |
| D5 | Changelog skeleton present | LOW | `CHANGELOG.md` exists with an `## [Unreleased]` heading |

## Status scale

- `PASS` — the check ran and the condition held.
- `WARN` — the check ran, the condition is degraded, but work can proceed.
  degraded examples: an old-but-runnable Node minor, `gh` present but not
  authenticated, a dirty worktree during triage, a missing optional binary.
- `FAIL` — the check ran and the condition blocks work. Any CRITICAL
  failure blocks work by definition.
- `SKIPPED` — the check could not run. The detail column says why in a few
  words. A blank `SKIPPED` is a failed report. A check that cannot be
  evaluated is a failed check, never a silent pass.

## The repair flag

`--fix` applies only this allow-list, in order, stopping at the first
failure:

1. Create the missing guard state directory.
2. Re-run the catalog generator so the mirror matches (never hand-edit).
3. Report every other finding as manual remediation with the exact pasted
   command. No install command is invented; no unverified command is run.

Without `--fix`, print the remediation commands and end. With `--fix`,
print the remediation commands, apply the allow-list, then re-run exactly
the checks that failed and report their new statuses.

## Output format

Print the findings as one table per section, in check order, with columns
`# | Check | Severity | Status | Detail | Remediation`. Then print, in
this order:

1. **Verdict** — one line: `CLEAR`, `CLEAR WITH WARNINGS`, or `BLOCKED`.
   `BLOCKED` when any CRITICAL check failed.
2. **Blocking failures** — each CRITICAL failure with its remediation and
   the re-run command.
3. **Warnings and skips** — grouped, one remediation line each.
4. **Next step** — one sentence naming the first thing the operator
   should do.
