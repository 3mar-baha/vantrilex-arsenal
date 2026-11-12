# Twin canonical-copy records — 7 plain/`vs-` skill pairs — 2026-11-12 (WS3, F-11)

Measured at HEAD `f849e16` (branch `wt/v2-consolidation`, after F-07/F-09
landings). Pairs were measured with `ls .opencode/skills` and paired each
plain folder `X` with the sibling `vs-X` when both exist — exactly seven
pairs, matching the dispatch brief's expectation. No pair was merged,
renamed or deleted; this document only records what the tree adjudicates.
`vs-` copies differ from their plain partner only in the `name`/`description`
frontmatter (seat naming) — plus the measured body deltas stated per pair —
and **no `vs-` copy carries a catalog row** (`registry/data/skills.jsonl` has
no `vs-<id>` row for any of the seven; the muster's rowless refusal applies
to every one of them). The plain copies are the ones the binding routing
surfaces name:

- `.opencode/equip.manifest.json` — `scout: skill/vantrilex-vanguard`,
  `scout: skill/vantrilex-workflow-forge`, `build: skill/ponytail`
- doctrine phase map (`.opencode/skills/vantrilex-doctrine/phase-map.md`) —
  `docs: session-context-primer`, `build: tdd, ponytail, preflight-system-doctor`
- doctrine workflow text (`.opencode/skills/vantrilex-doctrine/SKILL.md`) —
  Workflow 4 bugfix: "**Required kit:** `tdd` and circuit-breaker-guard"
- release workflow (`AGENTS.md` release order) — `github-release-packager`
- BLAZAR seat allow-list (`.opencode/agents/blazar.md`) — plain
  `circuit-breaker-guard`, `github-release-packager`, `ponytail`,
  `preflight-system-doctor`, `session-context-primer`, `vantrilex-vanguard`
  (no `vs-*` name appears in any seat allow-list examined)
- catalog rows (verified, where present) — plain ids only:
  `ponytail` (build/core), `preflight-system-doctor` (build/conditional),
  `session-context-primer` (docs/conditional), `vantrilex-vanguard`
  (scout/core), `vantrilex-workflow-forge` (scout/conditional)
- no `vs-` copy is selected by the manifest or allow-listed by any seat
  file; the `vs-` family exists as seat-named local variants
  (D47/D52 forcing-skill lineage; the `vs-asterism-muster` rowless list
  names all seven)

| # | pair | canonical | phase / lane (evidence) | vs- copy (measured) |
|---|---|---|---|---|
| 1 | `circuit-breaker-guard` ↔ `vs-circuit-breaker-guard` | **plain** | bugfix lane — Workflow 4 required kit; BLAZAR allow; doctrine 3-strike law homes here (not phase-injected) | seat variant, pointer-scrubbed post `p1-repair1` (HALT block and incident-report template replaced by "Single home: circuit-breaker-guard" pointers); plain copy untouched, still carries the embedded blocks; both rowless |
| 2 | `github-release-packager` ↔ `vs-github-release-packager` | **plain** | release / operate lane — AGENTS.md release workflow names it (guards → CHANGELOG → semver → tag → `gh release` → fresh clone); not phase-injected | byte-identical body after frontmatter; both rowless; plain allow-listed (BLAZAR) |
| 3 | `ponytail` ↔ `vs-ponytail` | **plain** | build — phase map build (installed 2026-11-11), equip-manifest build token, catalog build/core verified; BLAZAR allow | leaner older variant; drops the upstream-seat pin/MIT-notice/`FLOOR`-`CEILING` verbatim block the plain copy carries; rowless; not allow-listed |
| 4 | `preflight-system-doctor` ↔ `vs-preflight-system-doctor` | **plain** | build, step 0 — phase map preflight rule; catalog build/conditional verified; BLAZAR allow | same body, re-wrapped line joins; rowless; seat framing in description only |
| 5 | `session-context-primer` ↔ `vs-session-context-primer` | **plain** | docs — phase map docs; catalog docs/conditional verified; BLAZAR allow; CONTEXT ANCHOR single home lives in the plain copy | pointer-scrubbed post `p1-repair1` (anchor block replaced by "Single home: session-context-primer"); rowless |
| 6 | `vantrilex-vanguard` ↔ `vs-vantrilex-vanguard` | **plain** | scout — equip-manifest scout token, catalog scout/core verified; BLAZAR allow; carries the LD-03 doctrinal-outfitter repair paragraph (this lane) | Blazar-seat twin, only-in-vs = none, only-in-plain = frontmatter + (this lane) the LD-03 paragraph; rowless; seat framing in description only |
| 7 | `vantrilex-workflow-forge` ↔ `vs-vantrilex-workflow-forge` | **plain** | scout / task start — equip-manifest scout token, catalog scout/conditional verified; doctrine invokes the forge by id at every task start | byte-identical body after frontmatter; rowless; seat framing in description only |

**Adjudicability statement.** All seven pairs CAN be adjudicated from the
tree; no pair is left "undeterminable from the tree". For pairs 1–3 the
adjudication does not rest on catalog rows (both members of pair 1 and both
members of pair 2 are rowless, and `vs-ponytail` is rowless); it rests on
the doctrine workflow text, the release workflow, the seat allow-lists and
the `p1-repair1` pointer-scrub history. Where a ruling is still wanted —
retirement vs admission vs rename under the open selection-determinism
defect (V87-DEFECTS C-02/F-A5: "twin pairs carry byte-identical
`description:` lines…") — it is a kit-maintainer item, not a lane-local
deletion.

**Not done, deliberately:** no file content was edited for this record;
neither copy of any pair was deleted, renamed or merged; the `vs-` copies
are not admitted to the catalog by this lane; `docs/15-DECISIONS.md` was
not edited — the decision-entry text below is returned for the log owner.

## Proposed decision-entry text (for `docs/15-DECISIONS.md`; assign a D-id)

> ## [PROPOSED] D74 — Canonical resolution for the seven plain/`vs-` skill pairs
>
> - Date: [assign on merge]
> - Context: the registry carries seven plain/`vs-` skill pairs in
>   `.opencode/skills/`; the `vs-` copies were admitted as seat-named
>   variants without catalog rows and without seat allow-listing, and the
>   open determinism defect (V87-DEFECTS C-02/F-A5) records that both
>   members are near-interchangeable at selection time.
> - Decision: for each of the seven pairs the **plain copy is canonical**
>   for its lane — `circuit-breaker-guard` (bugfix),
>   `github-release-packager` (release/operate), `ponytail` (build),
>   `preflight-system-doctor` (build step 0), `session-context-primer`
>   (docs), `vantrilex-vanguard` (scout), `vantrilex-workflow-forge`
>   (scout/task start). The `vs-` copies are documented twins, left on
>   disk, unselected, unlisted, rowless; neither copy is deleted by this
>   entry. Retirement of any `vs-` copy needs its own dated entry and
>   passing gates.
> - Consequences: routing surfaces keep naming plain ids (manifest
>   scout/build tokens, phase map, seat allow-lists); selection-determinism
>   exposure remains documented, not cured, until a kit-maintainer ruling
>   on retirement/admission; nothing in the registry schema or catalog
>   rows changes; the minting of this entry and its D-number are owned by
>   the log, not by this lane.
