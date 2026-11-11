# Polish batches — 2026-11-11 (W-26, tiers 0–1)

Batch log for the Wednesday build-plan item W-26 (mechanical polish of the installed skills).
This document records what was scanned, what was fixed, what remains, and which gates ran.
It is written to the rule "honest counts or it didn't happen": every number below was measured on
`wt/v2-consolidation` at the state after this batch landed (no commit was made — this batch is a
working-tree landing for the Guide's verdict).

## Scope ruling (2026-11-11, owner answer)

The W-26 brief carried two stale figures. The owner ruling that governs this batch:

- The brief's "43 installed skills" is stale. Disk at HEAD `fadc07b` holds **46** installed skill
  folders under `.opencode/skills/`, every one with a valid `SKILL.md` (the delta is the three
  muster forcing skills `vs-asterism-muster`, `vs-syzygy-muster`, `vs-zenith-muster`, added/refreshed
  by W-11/W-12/W-24, after the plan's count was taken). This batch polishes and ledgers all 46.
- The brief's "core 13" Tier-0 figure is stale. **Tier 0 = 4 skills** (owner-named):
  `vantrilex-prime`, `vantrilex-vanguard`, `vantrilex-doctrine`, `vantrilex-workflow-forge`.
  All other installed skills are tier 1 (42 skills).
- Tier 2 (the registry's skill files under `registry/skills/`) is **not** part of this batch. The
  plan's figures ("1,460 registry files", "24 catalog ids with no file") were not reproducible from
  disk (measured: **1459** component `.md` files excluding `_index.md`, **1488** rows in
  `registry/data/skills.jsonl`, **86** rows with no exact-id file — the plan evidently used a
  different filename mapping than exact-id). Tier 2 is Thursday's first task per the owner answer;
  the "24 catalog ids with no file" ledger lines are likewise a tier-2 item, not actioned here.
- The three muster skills were "polished by construction" (their files were the W-11/W-24 landings).
  This batch did **not** re-polish them; it records their current state in the ledger.

## Standard applied (w26-v1)

Mechanical checks only, no prose taste rewrites, no priority fields added to any frontmatter:

- line count exceeding 500 lines per file,
- frontmatter keys not exactly `[name, description, source]`,
- missing required body sections — `## Purpose`, `## When to Use`, `## Do NOT use`, `## Inputs`,
  `## Procedure`, `## Outputs`, `## Failure Modes` (the `REQUIRED_HEADINGS` list reused verbatim
  from `scripts/verify-skills.mjs`),
- absolute paths (drive letters such as `C:\...` / `D:/...`, and `/home/...` paths),
- placeholder tokens — `TODO`, `FIXME`, `coming soon`,
- duplicate frontmatter descriptions across the scanned set,
- a `tools` wildcard (`tools: ["*"]`, `"tools":["*"]`, `tools: [*]`).

Tooling created by this batch:

- `scripts/polish-scan.mjs` — the mechanical scanner (read-only, zero dependencies, exit 0 clean /
  exit 1 defects / exit 2 usage). Red-proven on synthetic fixtures before use: every defect class
  was seen firing at least once.
- `scripts/check-polish-ledger.mjs` — the re-polish guard. **Decision recorded:** implemented as a
  standalone script, not a `--ledger` flag on `polish-scan.mjs`. The scanner's exit-0 contract is
  "no mechanical defects found"; the guard's contract is "no in-scope skill is an already-polished,
  unchanged skill" (exits 1 listing matches; malformed ledger lines also fail the guard). Two
  concerns, two exit semantics, same shape as the repo's verify-registry / verify-skills /
  verify-catalog separation. After this landing the guard exits 1 on all 46 skills — that is the
  anti-re-polish signal working, not a failure.
- `registry/polish-ledger.jsonl` — 46 lines, one per installed skill: `{id, polished_at:
  "2026-11-11", polished_by: "vantrilex-implementer/batch", standard_version: "w26-v1",
  verify_skills_exit: 0, sha256, tier}`. `verify_skills_exit: 0` is the value measured at ledger
  time (verify-skills PASS, 11/11 checks).

## Per-skill status (46 skills, this batch)

### Tier 0 (4)

| Skill | Lines | Status |
|---|---|---|
| vantrilex-doctrine | 770 | Fixed — phase-map split this batch (see below); residual: line-count 770 > 500 |
| vantrilex-prime | 267 | Clean (0 defects) |
| vantrilex-vanguard | 823 | Residual — line-count 823 > 500 |
| vantrilex-workflow-forge | 264 | Clean (0 defects) |

### Tier 1 (42)

| Skill | Lines | Status |
|---|---|---|
| babel-bridge | 107 | Clean (0 defects) |
| circuit-breaker-guard | 143 | Clean (0 defects) |
| documentation-as-tests | 103 | Clean (0 defects) |
| github-release-packager | 121 | Clean (0 defects) |
| goal-discipline | 105 | Clean (0 defects) |
| kill-switch-document | 119 | Clean (0 defects) |
| kit-evaluation-journal | 109 | Clean (0 defects) |
| kit-evolution-log | 105 | Clean (0 defects) |
| lenis | 342 | Clean (0 defects) |
| og-image | 417 | Clean (0 defects) |
| ponytail | 137 | Clean (0 defects) |
| pre-mortem | 94 | Clean (0 defects) |
| preflight-system-doctor | 154 | Clean (0 defects) |
| red-team | 101 | Clean (0 defects) |
| relay-protocol | 67 | Clean (0 defects) |
| session-context-primer | 115 | Clean (0 defects) |
| skill-maker | 209 | Clean (0 defects) |
| skill-shadow | 110 | Clean (0 defects) |
| time-capsule-test | 97 | Clean (0 defects) |
| vantrilex-deep-understand | 92 | Clean (0 defects) |
| vantrilex-design-variations | 232 | Clean (0 defects) |
| vantrilex-intake-fetch | 113 | Clean (0 defects) |
| vantrilex-intake-send | 119 | Clean (0 defects) |
| vantrilex-intake-triage | 120 | Clean (0 defects) |
| vs-asterism-muster | 278 | Clean (0 defects); polished by construction (W-11/W-24), not re-polished |
| vs-at-plan-craft | 113 | Clean (0 defects) |
| vs-bl-build-craft | 111 | Clean (0 defects) |
| vs-book-doctrine | 102 | Clean (0 defects) |
| vs-circuit-breaker-guard | 143 | Clean (0 defects) |
| vs-github-release-packager | 121 | Clean (0 defects) |
| vs-golden-equipment | 95 | Clean (0 defects) |
| vs-ponytail | 131 | Clean (0 defects) |
| vs-preflight-system-doctor | 154 | Clean (0 defects) |
| vs-pu-probe-craft | 111 | Clean (0 defects) |
| vs-session-context-primer | 115 | Clean (0 defects) |
| vs-smithery | 80 | Clean (0 defects) |
| vs-syzygy-muster | 250 | Clean (0 defects); polished by construction (W-11/W-24), not re-polished |
| vs-vantrilex-vanguard | 814 | Residual — line-count 814 > 500 |
| vs-vantrilex-workflow-forge | 264 | Clean (0 defects) |
| vs-zenith-muster | 223 | Clean (0 defects); polished by construction (W-11/W-24), not re-polished |
| vs-zenith-refresh-guard | 100 | Clean (0 defects) |
| vs-zenith-team-control | 144 | Clean (0 defects) |

Note: per-skill line counts in the tables are the counts reported by `scripts/polish-scan.mjs`
(LF files, trailing newline accounted for). The table is informational; the ledger's `sha256`
is the per-skill integrity record.

## What was fixed in this batch

1. **SC-18 — doctrine phase-map split.** The phase map (doctrine `SKILL.md`, lines 296–314:
   the `### B.3 — Phase map (mandatory)` heading, the intro paragraph, the per-phase skills
   table, and the step-0 / prune-then-inject paragraph) moved verbatim to
   `.opencode/skills/vantrilex-doctrine/phase-map.md` (new single-home satellite). The block in
   `SKILL.md` was replaced with one pointer line:
   `Phase map (mandatory): see [phase-map.md](phase-map.md) — the per-phase kit table, the step-0 preflight rule and the prune-then-inject law live there.`
   No other doctrine section was moved or rewritten; the companion notes (D48 ruling, catalog
   tier status, language-server note) stayed in `SKILL.md` untouched.
2. **`scripts/verify-skills.mjs` check 10 (phase-map cross-check) repointed** (flagged judgment
   call, see "Decisions for the Guide"). The check now parses
   `.opencode/skills/vantrilex-doctrine/phase-map.md` instead of `SKILL.md`, with identical
   heading/table/name-resolution rules and unchanged failure semantics. After the split it prints
   `phase-map-cross-check PASS — 13 phase-map names all resolve (3 local skill folders, 10 catalog ids)`.
   Guard strength is preserved (the same 13 names must resolve, from the new home); no rule was
   weakened, skipped, or deleted.

No other mechanical defects were found in the 46 installed skills: frontmatter keys, required
sections, absolute paths, placeholder tokens, duplicate descriptions and `tools` wildcards were all
clean on the first scan (consistent with verify-skills already enforcing most of these classes).

## What remains (named)

- **Line count > 500 in three skills** — `vantrilex-doctrine` (770), `vantrilex-vanguard` (823),
  `vs-vantrilex-vanguard` (814). Not mechanically fixable inside this concern: duplication scans
  at 5-, 8- and 12-line windows find **zero** duplicate blocks in any of the three; getting under
  500 requires deleting or restructuring prose, which the brief forbids ("Do NOT rewrite prose
  taste") and which would be a scope-widening satellite split for the two vanguard files (the
  phase-map satellite was authorized only for doctrine). **The scanner therefore still exits 1**
  with exactly these three defects. The brief's acceptance item "scanner exits 0" is **not met**;
  see "Decisions for the Guide".
- **Tier 2 (registry skill files)** — not started; Thursday's first task per the owner answer.
- **"24 catalog ids with no file" (plan figure)** — not actionable honestly tonight; disk measures
  1459 component files vs 1488 catalog rows, 86 exact-id misses; the plan's 24 is unverified and
  is recorded here as an open tier-2 question, not silently adopted.

## Honest counts

- Skills scanned: **46**. Mechanical defects fixed: **1** (doctrine phase-map split; 0 other
  mechanical defects existed). Residual defects: **3** (all line-count).
- Ledger lines created: **46** (tier 0: 4, tier 1: 42). Ledger created **after** the split, so
  every `sha256` matches the file as it stands now (verified by `check-polish-ledger.mjs`: 46/46
  match, exit 1 — the intended post-landing anti-re-polish state).
- Files created: `scripts/polish-scan.mjs`, `scripts/check-polish-ledger.mjs`,
  `registry/polish-ledger.jsonl`, `.opencode/skills/vantrilex-doctrine/phase-map.md`, this log.
- Files modified: `.opencode/skills/vantrilex-doctrine/SKILL.md`, `scripts/verify-skills.mjs`.
- Not touched: all other skills (byte-identical), registry data sidecars, catalog, CHANGELOG
  (explicitly excluded), no commit made (explicitly excluded), no new skill folders created.

## Gates, re-run after this batch (verbatim)

- `node scripts/verify-skills.mjs` — exit **0**, `VERDICT: PASS — all 11 checks ran and passed`.
- `node scripts/generate-catalog-json.mjs --check` — exit **0**.
- `node scripts/verify-catalog.mjs` — exit **1** (by design: `min-skills` zenith 14/15 deficit 1,
  `min-mcps` 0/5 countable — red on Wednesday, recorded before and after this batch; no catalog
  row was added or changed by this batch).
- `node scripts/run-battery.mjs` — exit **1**, `BATTERY: FAIL — 1/3 sections failed`
  (verify-catalog exit 1 as above; verify-minimums exit 2; known-fail scripts excluded per D33;
  12/14 scoped checks passed, unchanged from baseline before this batch).
- `node scripts/polish-scan.mjs` — exit **1**, 3 defects (all line-count, named above).
- `node scripts/check-polish-ledger.mjs` — exit **1**, 46/46 in-scope skills match their ledger
  line (expected post-landing anti-re-polish state).
- `node --check scripts/polish-scan.mjs` / `node --check scripts/check-polish-ledger.mjs` — clean.

## Decisions for the Guide (verdict belongs to the Guide)

1. **Scanner exit-0 acceptance unmet.** The brief lists "scanner exits 0" as acceptance and also
   says "if a skill cannot be fixed mechanically without prose judgment". The three overlong files
   cannot reach 500 without prose deletion or an unauthorized satellite split. Options for a
   ruling: (a) make line-count an advisory note rather than a defect (reported, exit not
   affected) — a two-line change; (b) authorize satellite splits for the two vanguard files;
   (c) accept the 3 named line-count defects as this batch's residual. This batch implements no
   option by fiat: the scanner treats line-count as a defect as briefed, and this log names the
   residual.
2. **`scripts/verify-skills.mjs` check 10 repointed** to `phase-map.md` (the phase-map single
   home after the split). This is the one edit outside the brief's named deliverables. It preserves
   the guard's strength (identical rules, same 13 names must resolve) and was necessary for the
   "verify-skills PASS" gate to hold after the SC-18 split. If the Guide rules the edit out of
   concern, reverting it returns `phase-map-cross-check` to FAIL — the split and the guard cannot
   both stand without the repoint.
3. **Tier 0 = the 4 owner-named skills**, not the brief's stale "13"; tier 1 = remaining 42;
   "43 installed skills" recorded as stale; tier 2 deferred to Thursday.
4. **Tier-2 / "24 missing-file" ledger lines not created tonight** — tier-2 scope only; the 24
   figure is also not reproducible from disk (see "Scope ruling").
5. **`verify_skills_exit: 0`** in every ledger line is the measured value; nothing was stamped
   without running the check.
6. **Re-polish status:** the ledger + guard now make any re-polish attempt mechanically visible;
   nothing in this batch re-polished an already-touched skill.

## Reproduction

```text
node scripts/polish-scan.mjs            # exit 1 (3 named line-count defects)
node scripts/check-polish-ledger.mjs    # exit 1 (46/46 match — anti-re-polish signal)
node scripts/verify-skills.mjs          # exit 0
node scripts/generate-catalog-json.mjs --check   # exit 0
node scripts/verify-catalog.mjs         # exit 1 (by design)
node scripts/run-battery.mjs            # exit 1, 1/3 sections failed (by design)
```
