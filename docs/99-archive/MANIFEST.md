# Root Working-File Archive Manifest

- **Task:** L13-12-016 + L13-12-017 (V-REMEDIATE node `r-placement`, wave 1 of 3)
- **Owner order:** §V-FULL-AUDIT-RESULTS (2026-10-18); FULL-AUDIT is CLOSED, report reference-only
- **Date:** 2026-10-18
- **Node owner:** vantrilex-fixer
- **Archive directory:** `docs/99-archive/`
- **Method:** plain filesystem moves within one volume (rename) — bytes and filenames preserved;
  no `git add` / `git rm` / `git commit` / `git push`, no history rewrite.

## Scope of the sweep

Candidate patterns applied to **root-level files only**:

```
P*.md   P*.jsonl   P*.log   P*.json
GITHUB-*.md   RESEARCH-*.md   COMMS-SUPABASE-*.md   VTA-FACTORY-*.md
SOURCES.md   DESIGN.md   IDEA.md   SUPABASE-U-understand.md   VANTRILEX_SKILLS_SPEC.md
```

`SUPABASE-U-understand.md` matched the brief's pattern list but does not exist at root
(`Test-Path` = `False`), so it appears in no row.

## Keep rules applied

1. **Never move (B3 names):** `AGENT.md`, `WORKFLOW.md`, `README.md`, `README.ar.md`, `LICENSE`,
   `P4-DEFERRAL-LEDGER.md`, `P5-LOOP-DOSSIER.md`.
2. **Referenced candidates stay (do-not-break-links):** any candidate referenced by a Markdown
   inline link from a surviving file. A full link scan over every first-party `*.md`
   (excluding `node_modules/` and `.git/`) found **zero** surviving files linking to any root
   candidate, so this rule removed **nothing** from the move set. The two scan hits on
   `VANTRILEX_SKILLS_SPEC.md` (`docs/00-INDEX.md:53`, `docs/ar/00-INDEX.md:46`) resolve to
   `docs/spec/VANTRILEX_SKILLS_SPEC.md`, a different file (distinct SHA-256), not the root copy.

## Counts (root working files)

| Measure | Before | After |
| --- | ---: | ---: |
| Root files matching the B2 candidate patterns (all families) | 72 | 2 |
| Root `P*` family only (`P*.md`/`.jsonl`/`.log`/`.json`) — the L13-12-017 span | 56 | 2 |
| Files relocated into `docs/99-archive/` | 0 | 70 |

The two remaining root `P*` files are `P4-DEFERRAL-LEDGER.md` and `P5-LOOP-DOSSIER.md`,
both on the B3 never-move list. The pre-move `P*` count of **56** matches the live recount in
`L13-12-017` (`P*` md 29 + jsonl 24 + log 1 + json 2 = 56).

## Disposition — moved (70)

| File | Disposition | Reason | Date |
| --- | --- | --- | --- |
| `COMMS-SUPABASE-WAIT-SETUP.md` | moved | superseded Supabase/Wait handoff note | 2026-10-18 |
| `DESIGN.md` | moved | superseded design working paper | 2026-10-18 |
| `GITHUB-HANDOFF.md` | moved | superseded GitHub working paper | 2026-10-18 |
| `GITHUB-PLAN.md` | moved | superseded GitHub working paper | 2026-10-18 |
| `GITHUB-PRIME.md` | moved | superseded GitHub working paper | 2026-10-18 |
| `GITHUB-RECON.md` | moved | superseded GitHub working paper | 2026-10-18 |
| `GITHUB-REVIEW.md` | moved | superseded GitHub working paper | 2026-10-18 |
| `IDEA.md` | moved | superseded idea working paper | 2026-10-18 |
| `P1-AUDIT-REHOMING.md` | moved | superseded phase-1 working paper | 2026-10-18 |
| `P1-COHORT-INSTALLED.md` | moved | superseded phase-1 cohort manifest | 2026-10-18 |
| `P1-DRILLS.md` | moved | superseded phase-1 working paper | 2026-10-18 |
| `P1-EVAL-1.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-2.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-3.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-4.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-5.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-6.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-7.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-EVAL-INSTALLED.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-R0.md` | moved | superseded phase-1 research paper | 2026-10-18 |
| `P1-RENAME-CHECKLIST.md` | moved | superseded phase-1 checklist | 2026-10-18 |
| `P1-RUBRIC-7DIM.md` | moved | superseded phase-1 rubric | 2026-10-18 |
| `P1-SHARD-1.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-2.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-3.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-4.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-5.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-6.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARD-7.jsonl` | moved | phase-1 evaluation shard | 2026-10-18 |
| `P1-SHARDS-MANIFEST.md` | moved | superseded phase-1 shard manifest | 2026-10-18 |
| `P2-BLAZAR-AETHER-MIGRATION.md` | moved | superseded phase-2 working paper | 2026-10-18 |
| `P2-COHORT-INSTALLED.md` | moved | superseded phase-2 cohort manifest | 2026-10-18 |
| `P2-EVAL-1.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-EVAL-2.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-EVAL-3.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-EVAL-4.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-EVAL-INSTALLED.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-INTAKE.md` | moved | superseded phase-2 working paper | 2026-10-18 |
| `P2-NEGCTRL.md` | moved | superseded phase-2 working paper | 2026-10-18 |
| `P2-POLISH-CHECKLIST.md` | moved | superseded phase-2 checklist | 2026-10-18 |
| `P2-QUARANTINE-TRIAL.log` | moved | superseded phase-2 trial log | 2026-10-18 |
| `P2-R0.md` | moved | superseded phase-2 research paper | 2026-10-18 |
| `P2-SCAN-FIRST.md` | moved | superseded phase-2 working paper | 2026-10-18 |
| `P2-SHARD-1.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-SHARD-2.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-SHARD-3.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-SHARD-4.jsonl` | moved | phase-2 evaluation shard | 2026-10-18 |
| `P2-SHARDS-MANIFEST.md` | moved | superseded phase-2 shard manifest | 2026-10-18 |
| `P3-GEAR-01.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-02.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-03.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-04.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-05.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-06.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-07.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-GEAR-08.md` | moved | phase-3 gear note | 2026-10-18 |
| `P3-MCP-A.json` | moved | phase-3 MCP working data | 2026-10-18 |
| `P3-MCP-B.json` | moved | phase-3 MCP working data | 2026-10-18 |
| `P3-OPENCODE-INSTALL-PACK.md` | moved | superseded phase-3 working paper | 2026-10-18 |
| `P3-R0.md` | moved | superseded phase-3 research paper | 2026-10-18 |
| `P3-SMITHERY-STARTER-LOG.md` | moved | superseded phase-3 log | 2026-10-18 |
| `P3-SOAK-LOG.md` | moved | superseded phase-3 log | 2026-10-18 |
| `RESEARCH-03.md` | moved | superseded research paper | 2026-10-18 |
| `RESEARCH-03-r0a-hooks.md` | moved | superseded research paper | 2026-10-18 |
| `RESEARCH-03-r0b-ponytail.md` | moved | superseded research paper | 2026-10-18 |
| `RESEARCH-03-r0c-design.md` | moved | superseded research paper | 2026-10-18 |
| `RESEARCH-03-r0d-agents.md` | moved | superseded research paper | 2026-10-18 |
| `SOURCES.md` | moved | superseded source ledger | 2026-10-18 |
| `VANTRILEX_SKILLS_SPEC.md` | moved | superseded root spec draft (`docs/spec/VANTRILEX_SKILLS_SPEC.md` is the canonical, distinct copy) | 2026-10-18 |
| `VTA-FACTORY-PLAN-SURGICAL.md` | moved | superseded phase working paper | 2026-10-18 |

## Disposition — kept

| File | Disposition | Reason | Date |
| --- | --- | --- | --- |
| `AGENT.md` | kept | B3 never-move: live project task memory | 2026-10-18 |
| `WORKFLOW.md` | kept | B3 never-move: live standing methodology | 2026-10-18 |
| `README.md` | kept | B3 never-move: project readme | 2026-10-18 |
| `README.ar.md` | kept | B3 never-move: Arabic readme pair | 2026-10-18 |
| `LICENSE` | kept | B3 never-move: license | 2026-10-18 |
| `P4-DEFERRAL-LEDGER.md` | kept | B3 never-move: live owner-queue ledger | 2026-10-18 |
| `P5-LOOP-DOSSIER.md` | kept | B3 never-move: live owner-queue ledger | 2026-10-18 |
| `RESEARCH.md` | kept | not a B2 candidate (`RESEARCH-*.md` requires the hyphen); left in place, no move | 2026-10-18 |

Files that are neither B2 candidates nor B3 keeps (`AGENTS.md`, `AI_GUIDE.md`, `CHANGELOG.md`,
`CONTRIBUTING.md`, `SECURITY.md`, `COMMS-SUPABASE-WAIT.mjs`, `skills-lock.json`, `tsconfig.json`,
and the dotfiles) were never candidates and are untouched.

No candidate retained a genuinely unclear disposition, so there is **no** "kept — disposition open"
row.

## Verification

- Root candidate count: before `72`, after `2` (the two live ledgers).
- `docs/99-archive/` file count: `70`, byte-equal to the 70 rows above.
- Relative-link sweep over first-party Markdown, before vs after: **0 new broken links**
  across the live documentation set; the archived superseded plan paper
  `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md` keeps 10 relative reference occurrences
  that no longer resolve from the archive location — expected for frozen history, left
  unrepaired.

## Version-control notes

- Two moved files are not committed by design and remain on disk in this directory:
  `P2-QUARANTINE-TRIAL.log` is excluded by the repository's pre-existing `*.log` ignore rule
  (`.gitignore`), and `P1-EVAL-7.jsonl` (461.96 MB) exceeds the hosting file-size limit
  (100 MB). The committed archive therefore holds 68 of the 70 moved files plus this
  manifest; both excluded files stay recoverable from the branch worktree.
