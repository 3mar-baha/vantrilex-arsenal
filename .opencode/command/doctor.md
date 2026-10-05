---
description: Run the preflight system doctor across environment, runtimes, configuration, and workspace, then print a PASS/FAIL/SKIPPED table with remediation commands.
---

# System Doctor

You are running the Vantrilex Arsenal preflight doctor. Your job is to **measure**
the machine and the project, then report. You do not fix anything, you do not
install anything, and you do not start the work the operator came here to do.

Operator intent for this run:

$ARGUMENTS

If that is empty, run the full doctor over every section below. If it names a
section (`environment`, `runtimes`, `configuration`, `workspace`), run that
section and mark the others `SKIPPED (not requested)`.

## Operating rules

1. **Node-only.** Every probe is a `node -e` one-liner or a plain command. Do
   not reach for another language runtime, do not pipe through a JSON filter
   binary, and do not assume any terminal multiplexer exists.
2. **Discover, never assume.** A toolchain that is absent is `SKIPPED` with the
   reason, never `PASS`. A check you could not evaluate is a **failed** check —
   report it as `FAIL` with the reason, or as `SKIPPED` only when the toolchain
   it depends on is genuinely absent.
3. **Read the project before judging it.** A missing `tsconfig.json` in a project
   that has no TypeScript is `SKIPPED`, not a defect.
4. **Every FAIL carries a remediation command** the operator can paste. A FAIL
   without a remediation is an incomplete report.
5. Do not modify any file. This command is read-only apart from the report you
   print at the end.

## Section A - Environment

| # | Check | Severity | How to measure |
|---|---|---|---|
| A1 | Node runtime present | CRITICAL | `node --version` |
| A2 | Node major version is 22 or newer | CRITICAL | parse the major out of A1 |
| A3 | `npm` present and runnable | CRITICAL | `npm --version` |
| A4 | `npx` present | HIGH | `npx --version` |
| A5 | `git` present and executable | CRITICAL | `git --version` |
| A6 | `gh` CLI present | MEDIUM | `gh --version` |
| A7 | `gh` authenticated | MEDIUM | `gh auth status` (report only, never print a token) |
| A8 | Working directory writable | CRITICAL | `node -e "require('fs').accessSync(process.cwd(), require('fs').constants.W_OK)"` |
| A9 | Free disk space for logs and build output | LOW | `node -e "const s=require('fs').statfsSync ? null : null; console.log('skip')"` then report `SKIPPED` with the reason if the platform call is unavailable |

## Section B - Runtimes

Each row is conditional on the project actually using that toolchain.

| # | Check | Pass condition | Otherwise |
|---|---|---|---|
| B1 | TypeScript | a `tsconfig.json` exists in the repo or an ancestor of the edited sources, **and** a local `tsc` is resolvable under `node_modules/.bin` | `SKIPPED` with which half is missing |
| B2 | Prettier | a `.prettierrc*` / `prettier.config.*` exists, or `prettier` is a dependency, **and** a local binary is resolvable | `SKIPPED` with which half is missing |
| B3 | Package manager | exactly one of `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `bun.lockb` at the repo root | `SKIPPED (no lockfile)`; more than one is `FAIL (ambiguous lockfiles)` |
| B4 | Test runner | `package.json` exposes a `test` script | `SKIPPED (no test script)` |
| B5 | Shell linting | `shellcheck --version` succeeds | `SKIPPED (shellcheck not installed)` — note that CI enforces it when the repo ships shell scripts |
| B6 | Local binaries resolvable | `node_modules/.bin` exists | `SKIPPED (dependencies not installed)` — remediation is the install command for the package manager found in B3 |

## Section C - Configuration

| # | Check | Severity | Pass condition |
|---|---|---|---|
| C1 | Tier-0 plugin present | HIGH | `.opencode/plugin/arsenal.ts` exists |
| C2 | Plugin type-checks | HIGH | `npx -p typescript@5 tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler .opencode/plugin/arsenal.ts` exits 0. If `npx` cannot resolve the package that way, report `SKIPPED` and print the exact npx error |
| C3 | Operator commands present | HIGH | `.opencode/command/` contains `doctor.md`, `equip.md`, `prime.md`, `release.md` |
| C4 | Command frontmatter is valid | HIGH | every command file has a `description` in its frontmatter, a non-empty body, and **no `template:` key** |
| C5 | Guard configuration parses | MEDIUM | `.opencode/arsenal.json` is absent (`SKIPPED (defaults in use)`) or parses as JSON |
| C6 | OpenCode config parses | MEDIUM | `opencode.json` / `opencode.jsonc` is absent (`SKIPPED`) or parses |
| C7 | Canonical documentation series | MEDIUM | count the `docs/NN-*.md` files. Report the count and the highest index. A file outside `docs/00-`..`docs/27-`, `docs/99-archive/`, `docs/spec/`, `registry/`, `.opencode/`, `brand/`, or the repo-root `README.md` / `README.ar.md` / `AI_GUIDE.md` / `AGENTS.md` / `CHANGELOG.md` / `CONTRIBUTING.md` / `SECURITY.md` set is a `FAIL` for the docs-discipline guard |
| C8 | Secret hygiene | HIGH | no `.env` file is tracked by git. `git ls-files -- .env` must print nothing. Never print the contents of any `.env` file |

## Section D - Workspace

| # | Check | Severity | Pass condition |
|---|---|---|---|
| D1 | Worktree is clean | CRITICAL | `git status --short` prints nothing |
| D2 | Not on the default branch | HIGH | the current branch is not the repository default branch |
| D3 | Changelog skeleton present | MEDIUM | `CHANGELOG.md` exists and has an `## [Unreleased]` heading |
| D4 | Single-writer law | HIGH | no `registry/data/*.jsonl` sidecar is modified in more than one worktree. Enumerate with `git worktree list --porcelain`, then `git -C <path> status --short -- registry/data` per worktree |
| D5 | Registry verifier passes | HIGH | when `scripts/verify-registry.mjs` exists, `node scripts/verify-registry.mjs` exits 0 |
| D6 | Catalog mirror is in sync | HIGH | when `scripts/generate-catalog-json.mjs` exists, run it and confirm `registry/catalog.json` did not change. If it changed, `FAIL` — the mirror is generated and must be committed, never hand-edited |
| D7 | Guard state directory is writable | LOW | the resolved state directory is writable. It is `$VANTRILEX_STATE_DIR`, else `node_modules/.cache/vantrilex-arsenal`, else the OS temp directory |
| D8 | Long-running log targets | LOW | list the most recent session's recorded log path if one exists, so the operator can read it |

## Output format

Print the findings as one table per section, in check order:

```
| # | Check | Severity | Status | Detail | Remediation |
|---|---|---|---|---|---|
| A1 | Node runtime present | CRITICAL | PASS | v25.0.0 | — |
| A6 | gh CLI present | MEDIUM | SKIPPED | not on PATH | install the GitHub CLI, then re-run |
```

Rules for the `Status` column:

- `PASS` — the check ran and the condition held.
- `FAIL` — the check ran and the condition did not hold.
- `SKIPPED` — the check could not run. The `Detail` column must say why in a
  few words. A blank `SKIPPED` is a failed report.

Then print, in this order:

1. **Verdict** — one line: `CLEAR`, `BLOCKED`, or `CLEAR WITH WARNINGS`.
   `BLOCKED` when any `CRITICAL` check failed.
2. **Blocking failures** — for each CRITICAL failure, the check id, what broke,
   the remediation command, and the command to re-run this doctor afterwards.
3. **Non-blocking findings** — every other `FAIL` and every `SKIPPED`, grouped,
   with one remediation line each.
4. **Next step** — one sentence. If the verdict is `BLOCKED`, the next step is
   the first remediation, nothing else.

**If the verdict is `BLOCKED`, stop there.** Do not offer to start the task the
operator was about to do, do not propose workarounds for the blocker, and do not
proceed to the next section's remediation. Print the remediation and end.

If the verdict is `CLEAR` or `CLEAR WITH WARNINGS`, end with the exact commands
the operator can run next, one per line, with no commentary.
