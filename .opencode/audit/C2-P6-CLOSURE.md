# Cluster 2 — P6 Closure (Publish Gate)

Node: `c2-publish-gate`. Lane: `POST87-APPLY`, Cluster 2 (catalog v4, semantics A).
Branch `wt/vta-factory-p0`, HEAD `63905f9`. Reported 2026-10-22.

Doctrine: FULL (ponytail core). FLOOR: "Be lazy about the solution, never reckless about
the change: include tests for risky logic, keep error handling and validation at trust
boundaries, and never skip safety for brevity." CEILING: "Be senior, never astronaut: no
gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config,
or wrapper nobody asked for."

Status: **P6 BATTERY RUN — GATE HELD FOR GUIDE + OWNER SIGN-OFF.** Nothing was published,
no tag was created, no freeze flag was flipped, no sidecar, candidate, manifest, state
file, queue, switch or audit log was written. This commit adds this report only.

## 1. Verdict

| Question | Answer | Evidence |
|---|---|---|
| Is the catalog v4 data set internally consistent? | Yes | §2, §3, §4 |
| Does the full battery pass at `63905f9`? | Yes on every gate, except where §9 says otherwise | §2 |
| Is the candidate surface complete and non-overlapping with the live set? | Yes | §3 |
| Does the 146-token selection resolve honestly? | Yes: 129 resolve, 17 suspended, 0 missing | §4 |
| Does the v4 file carry the frozen 16-kind enum, with v3 untouched? | Yes | §5 |
| Is the freeze lifted? | **No.** Only the sign-off lifts it. | §5 |
| Is v4 published? | **No.** P6 proves readiness; publication is a separate owner act. | §5 |

Nothing in this report claims a publish, a freeze lift, or a green markdownlint result for
the whole tree. The scoped exceptions are stated in §9 with their measured counts.

## 2. Full battery — exits and totals

Run on HEAD `63905f99b9cb9b117b40de7405186b42cf28ed70`, branch `wt/vta-factory-p0`,
Node `v25.0.0`, TypeScript `5.9.3`.

| # | Gate | Command | Exit | Total | Note |
|---|---|---|---:|---|---|
| 1 | Catalog and selection | `node scripts/verify-catalog.mjs` | 0 | `20 passed, 0 skipped, 0 failed` | 17 suspended active, 0 stale auto-restored |
| 2 | Registry | `node scripts/verify-registry.mjs` | 0 | `7 checks — 7 passed, 0 failed, 0 skipped` | 2,837 records, 16 sections |
| 3 | Catalog mirror | `node scripts/generate-catalog-json.mjs --check` | 0 | all surfaces `ok` | `catalog.json`, the catalog table, 16 `_index.md` |
| 4 | Skill format | `node scripts/verify-skills.mjs` | 0 | `10 checks — 10 passed` | 37 folders |
| 5 | TypeScript | `node node_modules/typescript/bin/tsc --noEmit` | 0 | no diagnostics | pinned `tsconfig.json`, `files: [".opencode/plugin/arsenal.ts"]` |
| 6a | Shell parse | `bash -n` over 9 `scripts/*.sh` + 2 `.githooks/*` | 0 | 11/11 | GNU bash 5.3.15 (Git Bash) |
| 6b | Shell lint | `shellcheck -S warning` over the same 11 | 0 | 11/11 | no findings at warning level |
| 6c | Node parse | `node --check` over 14 `*.mjs` | 0 | 14/14 | includes one untracked lane file, `COMMS-SUPABASE-WAIT.mjs` |
| 7a | Markdownlint — publish surface | `npx markdownlint-cli2@0.24.0` over 152 files | 0 | `0 issues in 0 files` | see the file set below |
| 7b | Markdownlint — whole live tree | same linter, `**/*.md` minus archive, node_modules, `.agents` | 1 | `13,133 issues in 2,826 files` | pre-existing, outside the publish surface; §9 F-P6-2 |
| 8 | Links | relative-link sweep over 3,068 Markdown files | — | 323 links, 301 resolve | 10 archive, 12 audit-only; §9 F-P6-3 |

Gate 7a is the Cluster 2 exit criterion: the generated catalog output plus every live doc
the cluster owns. Its 152 files:

- `registry/VANTRILEX_CATALOG.md` and the 16 `registry/*/_index.md` pages (v4 generator output);
- `docs/*.md` (00–21), `docs/dev/*.md`, `docs/ar/*.md`;
- `.opencode/agents/*.md`, `.opencode/commands/*.md`, `.opencode/skills/**/SKILL.md`;
- `.opencode/audit/C2-*.md` and `MISSING-ADDRESS.md`;
- `README.md`, `README.ar.md`, `AGENTS.md`, `AI_GUIDE.md`, `CHANGELOG.md`,
  `CONTRIBUTING.md`, `SECURITY.md`.

Two live files are excluded from 7a by ownership, not by convenience: `AGENT.md` and
`WORKFLOW.md` are orchestrator-only (WORKFLOW.md Part A, A2), and both carry findings
(§9 F-P6-2). They are reported, not edited.

## 3. Candidate ledger — final state

Three files, 104 rows, all `checked_at` = `2026-10-22`:

| Kind | Reason code | Rows | What it means |
|---|---|---:|---|
| `mcp` | `source-proof-failed` | 50 | the coordinate does not resolve |
| `skill` | `command-registry-failed` | 16 | the repository resolves, the named artifact does not |
| `skill` | `shape-invalid` | 25 | the row violates its kind's shape contract |
| `hook` | `load-proof-failed` | 12 | no wired callback could be proven |
| `mcp` | `load-proof-failed` | 1 | `mcp/vercel-mcp` — the one row outside both 66 and 37 |
| **Total** | | **104** | `hook` 12, `mcp` 51, `skill` 41 |

Field integrity, re-derived row by row:

| Check | Result |
|---|---|
| Rows with `id`, `kind`, `name`, `class`, `reason.code`, `reason.detail`, `checked_at` | 104/104 |
| `kind` matches the containing file | 104/104 |
| `checked_at` values | one value, `2026-10-22` |
| Duplicate `(kind, id)` inside the candidate surface | 0 |
| Rows with a non-empty `attempted` array | 86 |
| Rows with an empty `attempted` array | 18 — 17 suspended MCPs plus `mcp/lenis-mcp-server`; no addressable coordinate was ever authored, so no probe exists to record |
| Candidate `(kind, id)` also live in a sidecar | 0 — no dual-state row |
| Candidate `(kind, id)` present in `catalog.json` | 0 |

Live-set reconciliation:

| Surface | Rows |
|---|---:|
| `registry/data/*.jsonl` (16 sidecars) | 2,837 |
| `registry/catalog.json` `components` | 2,837 |
| Live rows absent from the mirror | 0 |
| Mirror rows absent from the sidecars | 0 |
| Duplicate `(kind, id)` in the live set | 0 |
| Pre-migration live set minus candidates | 2,941 − 104 = 2,837 |

The arithmetic named at the P3 gate:

```text
66  MISSING-ADDRESS rows   (50 mcp/source-proof-failed + 16 skill/command-registry-failed)
37  shape and hook rows    (25 skill/shape-invalid + 12 hook/load-proof-failed)
 1  mcp/vercel-mcp         (load-proof-failed)
--
104 candidate rows
```

## 4. Selection — 146 tokens, 17 suspended, 129 resolving

`.opencode/equip.manifest.json` carries 146 tokens across the six orchestrated phases
(scout, docs, plan, build, review, operate), and a `suspended` array of 17 entries. Every
entry names `reason: "missing-address"`, `since: "2026-10-22"` and
`document: ".opencode/audit/MISSING-ADDRESS.md"`.

| Measure | Value | Gate |
|---|---:|---|
| Selected tokens | 146 | — |
| Suspended | 17 | `selection/suspension` PASS |
| Resolving | 129 | `loadability/registers` PASS |
| Placed into phases | 129 of 129 | `phase-sets` PASS |
| Missing (not suspended) | 0 | `loadability/registers` PASS |

The seventeen, all `mcp`: `brave`, `browserbase`, `cloudflare`, `context7-mcp`, `deepwiki`,
`discord`, `exa`, `figma-context-mcp`, `gmail`, `googledrive`, `mem0-memory-mcp`, `neon`,
`openrouter`, `reference-sequential`, `steadyfetch`, `supabase`, `vercel`.

Suspension semantics, observed live:

- Each suspended token still sits in its phase array. Suspension adds a disposition; it
  deletes nothing.
- `0 stale suspension(s) auto-restored (none)` — no entry points at a token that has
  returned to the catalog, so nothing had to lapse today.
- Auto-restore is a property of the check, not a manual act: an entry whose token is live
  again stops applying, the token becomes an ordinary selected token, and it must resolve
  and place again. P4 proved the round trip byte-identically — an 18th entry for live
  `mcp/context7` was added, the gate reported `1 stale suspension(s) auto-restored`, the
  line was removed, and the manifest returned to its original SHA-256
  (`.opencode/audit/C2-P4-MANIFEST-SUSPENSION.md`, P4 verifier 9/9). P6 did not repeat that
  proof, because it requires editing a state file, which this node is forbidden to do; P6
  observed the resting state instead.

`.opencode/audit/MISSING-ADDRESS.md` is intact and append-only: 66 table rows
(50 `mcp` + 16 `skill`), one dated P3 section, the 17 selection rows flagged first, six
fields per row (kind, id, name, missing coordinate, probes actually run, reason code).
No row was re-pointed, dropped, or rewritten at P6.

## 5. Freeze-lift readiness — ready, and deliberately not lifted

The freeze is prose in the schema and in three docs; there is no flag file to flip. P6
checked that the lift, when the sign-off grants it, will be a fact and not an edit.

| Readiness item | Observed | Where |
|---|---|---|
| v4 publishes the 16-kind enum | `kind.enum` lists exactly the 16 v3 kinds; `$comment` records "New-kind onboarding is FROZEN until this v4 file publishes" | `registry/schema/catalog-v4.schema.json` |
| v3 untouched | blob `fee9ea6d361e909b7be237e72201b21d7a6e37cd` at `7af716d^` equals the blob at HEAD; no working-tree change under `registry/schema/` | `git rev-parse`, `git status` |
| v2 untouched | absent from the `7af716d^..HEAD` diff | `git diff --stat` |
| Generator on v4 | `SCHEMA_PATH` = `catalog-v4.schema.json`; `KINDS` = 16 entries; `buildCatalog` writes `"$schema": "./schema/catalog-v4.schema.json"` and `catalog_version: 4` | `scripts/generate-catalog-json.mjs` |
| Verifier on v4 | `verify-catalog.mjs` loads the v4 file (3 references); `verify-registry.mjs` validates every record against `catalog-v4.schema.json` | `scripts/verify-*.mjs` |
| Docs state the lift | "New-kind onboarding stays FROZEN until the P6 sign-off … P6 sign-off publishes it as the schema of record"; "new-kind onboarding stays frozen until the P6 sign-off"; "New-kind onboarding is frozen until the P6 sign-off" | `docs/dev/06-REGISTRY.md:12`, `docs/18-THEMES.md:151`, `docs/dev/02-SCRIPTS-VERIFY.md:77` |
| Freeze lifted now | No | this node |

What the sign-off changes: the sentence "the file exists on this branch as the migration
target" becomes false, because the file becomes the schema of record. No code, data or doc
edit is required to make that true — which is exactly why P6 must not perform it.

## 6. P1 → P6 phase ledger

All twelve commits are on `wt/vta-factory-p0`, dated 2026-10-22, and are ancestors of
HEAD. Range `7af716d^..HEAD`: 68 files, +43,181 / −11,059.

| Phase | Node | Commits | Gate that closed it | Deviation carried |
|---|---|---|---|---|
| P1 | `c2-schema` | `7af716d` | Verifier 9/9 PASS: corpus exact, diff scope exact, encoding honest, immutability, battery green | 7 open design choices routed to Aether rather than guessed |
| P1a | `c2-schema-amend` | `2085e12` | Verifier 8/9 PASS, 1 SKIPPED (markdownlint binary absent), 0 FAIL | R3/R6/R7 applied to the unpublished file only; 6 `data` rows nulled under R3 |
| P2 | `c2-classify` | `fff0493` | Verifier 9/9 PASS: 2,941 manifest exact, split exact, 56 candidates, 0 unbacked proofs | Dry-run only: no sidecar or generator write |
| P3 | `c2-migrate` | `727a1e4` | **Gate RED 15/17** — see §7 | Stopped before P4 by rule |
| P3a | `c2-missing-address` | `84af813` | 66 rows written, append-only, lint 0 | Equip manifest untouched per the owner ruling |
| P3b | provenance repair | `eb8596b` | Re-verifier PASS: item 8 closed, 66 rows true, 2 hunks, 0 table changes | Item 6 (verifier scope) left open |
| P4 | `c2-verify-v4` | `bdd5b2c` | Verifier 9/9 PASS: suspension 17 exact and reversible, gate 20/20, live restore 68/0/1, TTL, 104 candidates, ajv v4+v3 | `mcp/vercel-mcp` identified as the 104th row |
| P5a | `c2-register` | `790ef85` | F-COLOR-09 done: 12 `accentHex` uppercase, 0 lowercase | Theme registration refused; option (c) ruling, §8 |
| P5b | `c2-docs` | `9ba2a94` | Verifier FAIL — D1–D5 | Repaired below |
| P5b-1 | `c2-docs-fix` | `e6797ab` | Verifier FAIL — D-A…D-D | Repaired below |
| P5b-2 | `c2-ar-sync` | `63c26e4` | Owner-widened rule-5 exception: 21 physical lines, numerals only | The named "13" was a claim count; the true inventory was 21 |
| P5b-3 | `c2-docs-fix2` | `63905f9` | P5 verified PASS at this commit (dispatch record) | The PASS verdict has no committed report file — see §10 item 12 |
| P6 | `c2-publish-gate` | this commit | This report | 4 new findings, §9 |

Phase counts at the close of P6: live **2,837**, candidates **104**, selection **146** with
**17** suspended, kinds **16**, catalog version **4**.

## 7. Red-gate history and its honest resolution

**Red 1 — P3 gate, 15/17.** `loadability/registers` and `phase-sets` failed naming exactly
the 17 coordinate-less MCPs in the selection. They could not be removed without editing the
equip manifest, which the owner had forbidden in P3. The P3 verifier reproduced the red
state and proved the manifest blob identical at base and head, so the failure was recorded
as an owner constraint, not a code defect. Resolution: the owner ruled at the P3 gate that
the 17 be marked **SUSPENDED** — kept, reversible, auto-restoring — and P4 implemented
that. The gate then went green at 20/20 because the 17 were honestly reported as held out,
not because a check was weakened. The verifier re-tested the 17 old checks unchanged and
found 3 genuinely new ones.

**Red 2 — P3 verifier, 7/9.** Two FAILs: item 6, verifier semantics that landed inside P3
itself plus a `skills-upstream` check whose name overstates what it proves; and item 8, 16
`MISSING-ADDRESS` `attempted` cells that were reconstructed instead of copied. Item 8 was
repaired at `eb8596b` by restating each cell from the probes actually run (Option B) and
re-verified PASS. Item 6 was accepted by the owner as verifier state ("no re-run") and
remains in the debt register, not silently closed.

**Red 3 — P5b verification, 4 items.** D1 false counts (8 vs 7 MCP command rows; 2 vs 3
schema files; `accentHex` belongs to the map, not the palettes), D2 a new false
shell claim in `docs/08` (9 executors against 8 executable + 1 non-executable), D3 new
Arabic in `docs/ar` plus a stale 2,931 block, D4 pre-existing stale claims across the README
pair, `AI_GUIDE`, `docs/01`, `docs/14`, `docs/dev/08`, `docs/ar/09`, D5 a partial
de-numbering. Repair `e6797ab` fixed D1–D5, reverted `docs/ar` byte-identically to
`790ef85`, corrected `README.ar` under the pair exception, and flagged the Arabic mirrors.

**Red 4 — P5 re-verification, 4 items.** D-A palette casing was stated wrongly (the twelve
palettes carry mixed-case hex; only the map carries `accentHex`), D-B a kit-log claim with
no absent-case log behind it, D-C `README.ar` census wrong (26/18/8 at the commit, not
37/25), D-D 13 `accentHex` fields mis-attributed. Resolution: the owner widened rule 5 for
Arabic mirrors to numbers, counts and factual sync only, `63c26e4` applied it to 21 physical
lines with no Arabic word changed, and `63905f9` finished the English and `README.ar`
corrections. P5 then verified PASS.

Each red gate produced a narrower, truer artifact. None was resolved by deleting a check,
loosening a threshold, or rewording a claim.

## 8. The P5a option (c) ruling

`registry/themes/vantrilex-atomic-switch.json` is the atomic-switch **map** — `agents`,
`categories`, `registry`, `reserved` — not a V2 palette theme, and carries no `base`/`dark`
tree. The `command-shape/theme` gate refused the prepared theme row, correctly. The leader
ruling was **option (c)**: the map is an **out-of-catalog runtime artifact**, documented and
never registered; the catalog counts 12 theme components while the directory holds 13 files,
and both numbers are true; no schema discriminator was added, no file was moved, and no
palette was invented. The rejected alternatives were (a) a schema exception for a
non-palette JSON and (b) a fabricated palette — (a) would widen the contract for one file,
(b) would have been a documented lie about the file's contents.

## 9. Findings raised at P6 (new, none fixed here)

These were not in the dispatch brief. They are reported because a publish gate that hides
its own findings is not a gate. None of them was repaired: each needs a schema, data or
ownership decision that belongs to the sign-off.

**F-P6-1 — the record schema requires `kind`; the sidecar rows do not carry it.** The v4
root `required` list is `id, kind, verification, class, evidence`. Every one of the 2,837
sidecar lines omits `kind`, because the file name supplies it. Validating a bare sidecar
line with an external `ajv` (2020, `strict: false`) therefore fails **2,837 of 2,837** —
the first kind-conditional `allOf` (`hook`, class must be `loadable`) applies vacuously to
a record with no `kind`, and every non-hook row fails it. Injecting the file-derived `kind`
makes all **2,837 of 2,837** pass, and the 104 candidate rows, which do carry `kind`, pass
as written. The kit validator injects `kind` from the parsed section, which is why
`schema-conformance` reports PASS. So the data is sound; what is undocumented is the
convention that a sidecar line is a record *fragment* valid only inside its file. Three
exits, all post-sign-off: document the convention, add `kind` to the sidecar rows, or drop
`kind` from the schema's `required` list. Picking one is a schema or data change and is
outside this node.

**F-P6-2 — the whole-tree markdownlint is not zero.** 13,133 issues in 2,826 files, all
pre-existing relative to this node: 2,808 of the files are the legacy per-item registry
pages (`registry/<kind>/<id>.md`, written once at `ea806c8` and never regenerated by the v4
generator); the other measured 17 are 9 `docs/spec` intake documents, 4 audit working
documents, 1 `.opencode/skills` Arabic asset, and 3 root files — `AGENT.md` (MD034, MD037),
`WORKFLOW.md` (MD034) and the untracked `V87-RUFLO-ANALYSIS.md` (MD038, MD056). The publish
surface is 0/152. The brief's "markdownlint 0 on all live docs" holds for the surface
Cluster 2 owns and does not hold tree-wide; both numbers are stated rather than one being
chosen.

**F-P6-3 — twelve live-link failures outside the publish surface.** The sweep found the 10
named pre-existing archive failures (all in
`docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`, at lines 34, 35 ×2, 36, 88, 134, 180, 227,
269, 305 — root-relative targets read from inside the archive folder) **and** 12 more in
`.opencode/audit`: 10 in `V-FULL-AUDIT.md` (`./ATTRIBUTION.md` ×4,
`event`, `AGENTS.md`, `WORKFLOW.md`, `kit/kit.lock`, `../06-REGISTRY-SCHEMA.md`,
`06-REGISTRY-SCHEMA.md`) and 2 in `V87-FEATURE-AUDIT-2.md` that are literal quotations of
the defective truncated `htt…` link target, not links. `V-FULL-AUDIT.md` carries 31,984 uncommitted
insertions from another lane; `V87-FEATURE-AUDIT-2.md` is untracked. Neither file is in the
publish surface, and neither was touched.

**F-P6-4 — legacy per-item pages are stale by construction.** `registry/skills/` holds
1,485 per-item pages against 1,464 live skill rows and `registry/mcp/` holds 904 against
872, while `registry/agents/` holds 282 against 301 — the page set is neither current nor
uniformly derived. They were authored once at `ea806c8`, are not regenerated by the v4
generator (which owns `catalog.json`, the catalog table and the 16 `_index.md` pages only),
and carry the lint findings counted in F-P6-2. Whether they should be regenerated, frozen
as history, or retired is a publish-surface decision, not a P6 edit.

## 10. Remaining debt register

| # | Item | State | Owner |
|---:|---|---|---|
| 1 | Arabic mirrors and rule 5 | The owner widened the exception to numbers, counts and factual sync. `docs/ar` holds 8 files; 21 physical lines were synced numeral-only at `63c26e4`; no Arabic word changed; the mirrors remain partial by design. | Owner / scribe |
| 2 | 37-folder pages | `.opencode/skills` holds 37 folders, all passing `verify-skills` 10/10. The catalog joins 21 skill rows to a local folder by id (P1:92) and `loadability/skills` resolves 18 as selected. The per-item page set behind this surface is the 1,485-file legacy artifact in F-P6-4. If the leader meant a different 37-page set, this row is mis-resolved and is returned for correction. | Guide |
| 3 | Archive links | 10 failures, all in `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`; pre-existing, archive-only, named in F-P6-3. | Docs author |
| 4 | `ajv` strict-mode warnings | 4 warnings, one per `allOf/16..19`, at `#/allOf/N/then/properties/evidence`: `required` without `"type": "object"`. `strict: false` validates 2,837/2,837 with `kind` injected; `strict: true` refuses to compile the schema at all. Fixing means editing the schema, which the freeze and this node's scope forbid. | Kit maintainer, post-sign-off |
| 5 | `brew` not evaluable | `brew --version` is "not recognized" on this host, re-confirmed at P6, so no homebrew command was executed here. | Verifier, on a macOS host |
| 6 | `openpencil` | `cli/openpencil`, `install_cmd` `brew install zseven-w/openpencil/op`, pin `0.8.2`, `class` installable, evidence `load_proof` (`server-bin`) plus `command_registry` (`homebrew`), verification `verified`. The load proof names the surface but the install was never executed on this host (item 5). Registry-backed, not execution-backed. | Verifier |
| 7 | `santifer` redirect | `santifer/career-ops` resolves only through a GitHub redirect to `career-ops-hq/career-ops`. Counted as resolved, and named in the `command-shape/skills-upstream` detail so the redirect is visible rather than absorbed. | Registry curator |
| 8 | `context7` pin | Row `version_pin` `4.1.1`; `npm view @upstash/context7-mcp version` returns `4.4.4` at P6. The install command is unpinned (`npx -y @upstash/context7-mcp`), so nothing breaks; the pin is stale metadata. The P3 gate ruled this audit hygiene, not a blocker. | Registry curator |
| 9 | F-P6-1 schema/`kind` convention | Open; needs a sign-off ruling (§9). | Guide + owner |
| 10 | F-P6-2 / F-P6-4 legacy pages and tree-wide lint | Open; needs a publish-surface ruling. | Guide |
| 11 | F-P6-3 audit-document links | Open; lives in another lane's uncommitted work. | Audit lane |
| 12 | P5 PASS record | The P5 PASS at `63905f9` is carried by the dispatch record and `WORKFLOW.md` Part B; `.opencode/audit` holds the P1, P2, P4 and MISSING-ADDRESS reports but no P3 or P5 report file. The verdict is not in doubt here — its written home is. | Guide |
| 13 | Verifier item 6 | The `command-shape/skills-upstream` name claims upstream proof while the check proves source/coordinate resolution for installable skill commands. Accepted as verifier state at the P3 gate, not re-run; the naming observation stands. | Guide |
| 14 | `vantrilex-atomic-switch.json` | Out of catalog by the option (c) ruling; documented in `docs/dev/06` and `docs/18`. Stays named-open. | Kit maintainer |

## 11. Sign-off requested

Addressed to the **Guide** (gate authority) and the **owner** (publish authority). P6 asks
for five decisions and performs none of them.

1. **Accept the P6 battery** as stated in §2, including the scoped exceptions in §9:
   tree-wide markdownlint is 13,133 issues, not 0, and links carry 10 archive plus 12
   audit-only failures.
2. **Rule on F-P6-1** — publish v4 with the file-context `kind` convention documented, or
   hold publication until `kind` is made explicit in the data or the schema. This is the
   only finding that touches what "v4 is the schema of record" means for a downstream
   consumer.
3. **Grant or refuse the freeze lift.** The lift is the act of publishing the v4 file as the
   schema of record; the docs already say the freeze ends at P6 sign-off. P6 did not lift it.
4. **Rule on F-P6-2, F-P6-4 and debt items 9–11** — whether the legacy per-item pages and
   the audit-document links are in scope for the publish definition, or carried.
5. **Name the publish action itself**, separately. No tag, no release, no push is requested
   or performed here. Under the release system in force, publication is a named owner go.

If decisions 1–4 are granted, the exact wording this report supports is:

```text
SIGN-OFF (Guide + owner): Cluster 2 publish gate PASSED at 63905f9.
The catalog-v4 file is the schema of record; new-kind onboarding lifts with publication.
Publish action deferred to the owner's named go. No tag or release created by this node.
```

## 12. Reproduce

```text
node scripts/verify-catalog.mjs                                  -> 20/20, exit 0
node scripts/verify-registry.mjs                                 -> 7/7,   exit 0
node scripts/generate-catalog-json.mjs --check                   -> 0,     exit 0
node scripts/verify-skills.mjs                                   -> 10/10, exit 0
node node_modules/typescript/bin/tsc --noEmit                    -> 0,     exit 0
bash -n scripts/*.sh .githooks/* + shellcheck -S warning          -> 0
node --check over 14 *.mjs                                        -> 0
npx markdownlint-cli2@0.24.0 <152 publish-surface files>          -> 0,     exit 0
npx markdownlint-cli2@0.24.0 "**/*.md" (minus archive/nm/.agents) -> 13,133 issues, exit 1
relative-link sweep over 3,068 files                              -> 10 archive + 12 audit
```

Ponytail: FULL — FLOOR held (the battery was run before any claim; the closure report is
the only write, and it states the scoped failures instead of narrowing the checks);
CEILING held (one file added, no tooling, no schema change, no repair of findings that
belong to the sign-off).
