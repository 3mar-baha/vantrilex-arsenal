# GITHUB-PRIME.md — Node `r2-tags` (Step 1: Prove the repo is primed)

- Mission lane: `POST87-APPLY` — Phase 1 build wave (owner ruling sheet 2026-10-21)
- Node: `r2-tags`
- Owner agent: `vantrilex-github` (side agent; never lead, never dispatch, never declare done)
- Date: 2026-10-21
- Classification: **DIRECTED** (Scenario 2 does NOT apply, per the brief)

## Node quoted verbatim from the brief

> Concern: execute owner ruling §3(a) — DELETE the two local probe tags.
> Classification: DIRECTED — Scenario 2 does NOT apply.
>
> 1. BEFORE: `git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"` (expect both listed).
> 2. DELETE: `git tag -d v0.0.99-dryrun.1` and `git tag -d v0.0.98-dryrun.1` (quote exits).
> 3. AFTER: `git tag -l` (prove both absent); read-only remote check `git ls-remote --tags origin`
>    (prove neither ever existed remotely — they were never pushed; no remote writes).
> 4. Confirm nothing else changed: `git status --short` (state files/lane files only, as before).
> No commits, no other writes. Report: before/after listings + exits.

## Authentication

```text
$ gh auth status
github.com
  ✓ Logged in to github.com account 3mar-baha (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
EXIT=0
```

Token value is redacted by `gh` itself; no secret is recorded here.

## Repository slug and branch

```text
$ git rev-parse --show-toplevel
O:/vantrilex-arsenal
$ git rev-parse --abbrev-ref HEAD
wt/vta-factory-p0
$ git remote -v
origin  https://github.com/3mar-baha/vantrilex-arsenal.git (fetch)
origin  https://github.com/3mar-baha/vantrilex-arsenal.git (push)
$ git --version
git version 2.55.0.windows.5
```

- Slug: `3mar-baha/vantrilex-arsenal` (resolved from `git remote -v`, corroborated by `gh auth status`).
- Working branch: `wt/vta-factory-p0`.

## Tool surface

- Kit `github` MCP entry: **not reachable in this runtime** (searched the tool catalog; zero `github`
  namespace tools returned). Per doctrine, the documented fallback is used: the `gh` CLI, plus `git`
  itself for ref operations.
- `gh` CLI: present, authenticated (exit 0 above).
- `git`: present, 2.55.0.windows.5.
- No missing-tooling gap. Nothing was installed and no install command was invented.

## Primed verdict

YES. Auth proven, slug resolved, one directed node named (`r2-tags`).

## Governing authorization (quoted from the lane's own records)

`WORKFLOW.md` line 79:

> **§3 AMENDMENT #1 — DECISIONS RULED.** (a) DELETE the two local probe tags (v0.0.99-dryrun.1,
> v0.0.98-dryrun.1; never pushed). (b) The audit log STAYS TRACKED …

`AGENT.md` line 318 (dispatch record):

> **Phase 1 build wave dispatched:** … `r2-tags` (§3a: delete the two local probe tags) …

## Standing guard that governs step 2 — declared before any call

`.opencode/agents/vantrilex-github.md`, section **What you must never do**:

> Never force-push, delete a branch, tag, or release, or rewrite published history, for any reason,
> under any token.

Same file, **Refusal ladder** rung 3 (the only rung a leader token can open for destructive acts):

> Rung 3, destructive inside the directed node, permitted only with a leader confirmation token naming
> the exact target: tag pushes, release publishes, and merges into release branches.

Tag *deletion* appears in neither the rung-3 permitted list nor the always-refused rung 4; it is named
in the never-do list with the quantifier "for any reason, under any token". Consequence recorded in
`GITHUB-PLAN.md`, step 2, before any call was made: the deletion is **outside every rung open to this
agent**. The read-only steps (1, 3, 4) were executed in full regardless.
