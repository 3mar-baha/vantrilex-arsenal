# GITHUB-RECON — c2-docs-pub16 (read-only)

Date: 2026-10-23

## Branch commit series (main `f5e6d3f` → tip `31d8d8c`)

```
31d8d8c docs(census): correct skill-folder census in the repository layout
99fc2b7 docs(census): state the live selection count in the task-dispatch page
57536ac docs(ar): sync census numerals and rewrite parked verification passages
fe535d6 docs(census): sync catalog and selection counts in verification and dev notes
0d60a8b docs(census): re-derive live catalog counts in entry docs
```

All five are Beat-1 (docs-truth build) commits; Beat 1 locked at `31d8d8c` and
was verifier-confirmed PASS.

## Diff scope, `f5e6d3f..wt/docs-truth`

16 files, +111 / −114 — documentation only, no scripts, no registry data, no
generated artifacts, no workflow files:

```
M AI_GUIDE.md                     | 10 +++---
M README.ar.md                    | 32 ++++----
M README.md                       | 32 ++++----
M docs/00-INDEX.md                |  4 +-
M docs/01-OVERVIEW.md             |  8 +--
M docs/06-REGISTRY-SCHEMA.md      |  6 +-
M docs/07-CATALOG-GENERATION.md   |  4 +-
M docs/08-VERIFICATION.md         |  8 +--
M docs/16-TASK-DISPATCH.md        |  6 +-
M docs/ar/01-OVERVIEW.md          |  2 +-
M docs/ar/04-VANGUARD.md          |  7 +-
M docs/ar/README.md               | 42 ++++----
M docs/dev/00-INDEX.md            |  9 ++--
M docs/dev/03-SCRIPTS-GENERATE.md |  2 +-
M docs/dev/05-KIT-LOCK.md         | 11 ++--
M docs/dev/06-REGISTRY.md         | 42 ++++----
```

## Release state observed

- Highest tag: `v0.8.15` (no `v0.8.16` exists).
- `v0.8.15` is on merge `a00cbc3`, not on `f5e6d3f` (commit-back child).
- Policy: `phase.patch = 1`, cascade true → computed next = **v0.8.16**.
- Queue: 5 entries, last `published` v0.8.15 with `intended_version: v0.8.15`.
- Audit log tail agrees: entry=5 published at 2026-10-23T14:26:13Z.

## Switch

- Absent from `wt/docs-truth` tree and from `main` tree (`git ls-tree -r`).
- Present on disk only, ignored (`.gitignore:62`).

## Open pull requests

None referenced by this node; the lane merges locally and pushes main. No PR is
part of the directed node.
