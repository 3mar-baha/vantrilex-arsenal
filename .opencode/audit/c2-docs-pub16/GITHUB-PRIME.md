# GITHUB-PRIME — c2-docs-pub16 (POST87-APPLY BEAT 2)

Date: 2026-10-23
Node quoted from brief: `c2-docs-pub16`
Concern quoted: "merge wt/docs-truth → main, publish v0.8.16 monitored, delete the branch."
Classification: DIRECTED. Owner §2 as recorded in the dispatch.

## Authentication

`gh auth status`:

```
github.com
  ✓ Logged in to github.com account 3mar-baha (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
```

PASS — authenticated, repo scope present (push/release/delete covered).

## Tooling

- `gh` 2.87.3 — PRESENT
- `node` v25.0.0 — PRESENT (matches repo runtime)
- `git` — PRESENT

## Repository slug

`origin` → `https://github.com/3mar-baha/vantrilex-arsenal.git`
Slug: `3mar-baha/vantrilex-arsenal`.

## Directed node confirmed

Single node: merge `wt/docs-truth` into `main` (`--no-ff`), queue ONE phase
entry with `intended_version: v0.8.16`, fire `DRY_RUN=0
node scripts/self-publish.mjs`, verify per element, delete remote
`wt/docs-truth`, report. No second node named.

## Primed state

| Item | Value |
|---|---|
| local branch | `wt/docs-truth` @ `31d8d8c` |
| remote `wt/docs-truth` | `31d8d8c7df27c03ad021fd114e64715cce526702` |
| local `main` | `f5e6d3f` |
| remote `main` | `f5e6d3f2373c1531cc78f1060524470804ccfefc` |
| merge-base/ancestry | `f5e6d3f` is ancestor of `wt/docs-truth` (exit 0) |
| ahead/behind | `0 5` (main unique 0 · branch unique 5) → `--no-ff` valid, ff also valid |
| queue | 5 lines, all `published`; **0 pending** |
| switch on branch tree | `git ls-files -- .opencode/auto-release.enabled` → EMPTY (absent) |
| switch on disk | PRESENT, 507 bytes, ignored at `.gitignore:62` |
| dirty tree | `M AGENT.md` only (uncommitted task memory; preserved by stash) |

Verdict: repo PRIMED. Node may proceed.
