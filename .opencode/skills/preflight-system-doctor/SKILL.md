---
name: preflight-system-doctor
description: Use when entering the build phase or before any mutating or long-running work — validates environment, runtimes, configuration and workspace health with a Node-only PASS/FAIL/SKIPPED table, prints remediation commands, and blocks execution on critical failures.
---

# Preflight System Doctor

## Purpose

Make every run reproducible by verifying the machine before acting on it. Nothing in the
build phase starts until the doctor issues a PASS verdict on all critical checks. It
inspects four areas in order — environment, runtimes, configuration, and workspace — and
produces one actionable report. Run it before `session-context-primer` so the primer
operates on verified ground truth.

The runtime policy is Node-only: zero dependencies, ESM, Node 25 in development with 20 as
the floor. There is no second language runtime and no terminal multiplexer in the
toolchain, so this doctor probes for Node and its two versioned companions and nothing
else.

## When to Use

- As step 0 of the build phase, before any implementation work begins.
- Before regenerating derived registry artifacts, since a stale or absent runtime turns a
  clean regeneration into a partial one.
- Before fanning out into parallel git worktrees, where git hygiene and disk capacity
  matter most.
- Before a release, where `gh` authentication is mandatory.
- Whenever an agent is about to run long-lived or mutating operations in a new shell or
  checkout.

## Do NOT use

- As a substitute for `node scripts/verify-registry.mjs` or
  `node scripts/verify-kit.mjs`. Those prove repository data and kit components; the
  doctor proves the machine. A green doctor says nothing about registry integrity.
- As a component verifier. It confirms the tools exist and are new enough; it does not
  prove a component loads or works.
- To authorize a dirty worktree on its own. A dirty tree may be waived only by an
  explicit operator override recorded in the run log, never by the doctor deciding it is
  acceptable.

## Inputs

- Target repository root (defaults to the current working directory).
- `kit/kit.lock`, the pinned kit manifest, when present.
- `registry/catalog.json`, whose per-component `phase` field scopes kit injection.
- Minimum version policy: node >= 20, git >= 2.30, gh >= 2.40.0.
- Optional explicit override for a dirty workspace, supplied by the operator and recorded
  in the run log.

## Procedure

1. **Declare scope.** Record the repo root, the resolved kit lock path, and the run
   timestamp. Later rows cite these values.
2. **Check the environment.** Detect OS and default shell; probe network egress with
   `git ls-remote --exit-code https://github.com/octocat/Hello-World HEAD`. For any
   long-running process started in this session, require that it write to a log file and
   echo that log path to the operator before the doctor continues.
3. **Check the runtimes.** For node, git, and gh: confirm presence and compare the
   reported version against the minimums above. For gh, additionally run `gh auth status`
   as its own check.

   ```sh
   node --version    # >= 20
   git --version     # >= 2.30
   gh --version      # >= 2.40.0
   gh auth status    # authenticated account required
   ```

4. **Check the configuration.** Confirm `kit/kit.lock` exists and that every component it
   pins appears in `registry/catalog.json` with a `phase` field, so injection can be
   scoped per phase rather than kept hot in every session. Confirm `.env.example` exists
   and holds no real credential values, only stand-ins. Scan tracked files for
   real-looking credentials (AWS access-key ids, `ghp_`/`sk-`/`xox` token shapes, long
   high-entropy literals) so no secret is about to be leaked.
5. **Check the workspace.** Require `git status --porcelain` to be empty, or accept an
   explicit operator override recorded in the run log. Verify free disk space on the repo
   volume and on any worktree pool volume; require at least 5 GB free on each.

   ```sh
   git ls-remote --exit-code https://github.com/octocat/Hello-World HEAD   # egress probe
   git status --porcelain                                            # empty, or override logged
   ```

6. **Assign severities before reading results.** Each row is CRITICAL or WARN:
   - CRITICAL: node present and version ok; git present and version ok; gh authenticated
     when the run touches GitHub; `kit/kit.lock` in sync with `registry/catalog.json`;
     `.env.example` present and free of real values; secret scan clean; clean workspace or
     logged override; disk space.
   - WARN: OS/shell identity; long-running-process log path convention; worktree pool
     disk when the run creates no worktrees.
7. **Print the report.** Emit one table with the columns check, status, detail, and
   remediation command, followed by the overall verdict. Statuses are PASS, FAIL, or
   SKIPPED.
8. **Enforce the verdict.** The verdict is PASS only when no CRITICAL row is FAIL.
   FAIL on any critical check blocks execution immediately — print the report and
   stop. SKIPPED rows (for example, network checks while offline) do not fail the run;
   however, a CRITICAL check that lands on SKIPPED requires explicit operator
   confirmation before execution proceeds. A skip is not a pass.

## Outputs

One report block per run, in this shape:

| Check | Status | Detail | Remediation |
| --- | --- | --- | --- |
| OS / shell | PASS | Windows 11, PowerShell 7 | n/a |
| Network egress to github.com | SKIPPED | Offline; degraded to cached checks | Restore connectivity |
| node >= 20 | PASS | 20.11.0 | n/a |
| git >= 2.30 | PASS | 2.45.0 | n/a |
| gh >= 2.40.0 | PASS | 2.57.0 | n/a |
| gh auth status | FAIL | Not authenticated | `gh auth login` |
| kit/kit.lock in sync with registry/catalog.json | FAIL | 2 pinned components carry no `phase` | Set `phase` in the catalog, then regenerate |
| .env.example present, no real values | PASS | 6 of 6 keys are stand-ins | n/a |
| Secret scan of tracked files | PASS | No credential-shaped strings found | n/a |
| Clean git status (or logged override) | FAIL | 3 modified files | Commit, stash, or log an explicit override |
| Long-running process log path echoed | SKIPPED | No long-running process started | n/a |
| Disk space (repo + worktree pool) | PASS | 84 GB and 120 GB free | n/a |

Verdict lines:

```text
PREFLIGHT VERDICT: FAIL — 3 critical check(s) failed. Execution blocked.
PREFLIGHT VERDICT: PASS — all critical checks green. Execution may proceed.
```

Remediation commands are copy-pasteable and reference repository scripts where they
exist: `node scripts/verify-registry.mjs` proves the registry data,
`node scripts/generate-catalog-json.mjs` rebuilds the machine mirror, and
`node scripts/verify-kit.mjs` proves each kit component loads.

## Failure Modes

- **gh not authenticated.** Print the exact login command — `gh auth login` — in the
  remediation column and in the verdict summary, and note that the device-flow login is
  interactive, so the operator must run it personally.
- **Kit lock drift.** A component pinned in `kit/kit.lock` is missing from
  `registry/catalog.json`, or carries no `phase`. List the offending ids explicitly and
  regenerate the mirror with `node scripts/generate-catalog-json.mjs`; do not hand-edit
  the generated JSON.
- **Offline machine.** Degrade gracefully: reuse cached catalog metadata and last-known
  versions, mark every network-dependent check SKIPPED rather than FAIL, and state plainly
  which follow-on steps (cloning, syncing, releasing) cannot run until connectivity
  returns.
- **Node below the floor.** An older runtime will fail the ESM and `node:` built-in
  assumptions this repository is written against. Report the observed version and stop;
  do not attempt the run and explain the failure afterwards.
