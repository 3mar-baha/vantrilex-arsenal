# RELEASE-BACKFILL-MAP — v0.7.7 → latest completed unit (owner-approved, 0.8.7 rebase)

- **Workstream:** `rel-map` (owner release ruling §3, HARD GATE) — **§3 GATE SATISFIED: the map is
  OWNER-APPROVED on the terms recorded below (2026-10-21).** Parallel to `rel-selfpub`; the cluster
  sequence is untouched.
- **Node:** `rel-map` · **Owner:** `vantrilex-librarian` (worker-only seat)
- **Classification:** DIRECTED — Scenario 2 does NOT apply. This revision applies owner
  MAP-RULINGS only: it edits this one artifact and commits once.
- **Date:** 2026-10-21 · **Effort:** HIGH (evidence judgment, §6)
- **Base tag, verified live:** `v0.7.7` → `3d5d92aa99c2f3140372bc98aad816f1239f244a`
  (annotated; `2026-10-15T17:29:35+03:00`). Highest tag of 12 under any naming;
  `gh release list` shows `v0.7.7` = `Latest`.
- **Release line:** `main` = `origin/main` = `f3ca04b`; the map lives on `wt/vta-factory-p0`
  alongside 8 unpushed Cluster 1 commits. Nothing in this map is pushed, tagged or published.
- **No publish is authorized by this file.** Publication conditions are §8.
- **Scope of write:** this file only.

---

## 1. FINAL REBASED TABLE (authoritative)

Ascending, closure order. `0.8.7` is the owner's **named** release (override under §8.2); every
other number is the §1 increment applied in order from the previous row.

| Version | Unit | Anchor | Class (owner-ruled) | Package the publish would carry | As-closed evidence — one line |
|---|---|---|---|---|---|
| **0.7.7** | base release | tag `v0.7.7` → `3d5d92a` | base | already published | released + tagged before this lane (`AGENT.md:413`) |
| **0.7.8** | VTA-FACTORY P0 | commit `66d0e45` (2026-10-17T19:07:46) | phase | source tarball at `66d0e45` | `p0-verify` PASS-WITH-DEFERMENT; 4 verifiers green; park pushed (`AGENT.md:193`, `:197`) |
| **0.7.9** | VTA-FACTORY P1 | **no commit** | phase | evidence package (§7.1) | `p1-verify` PASS-WITH-NOTES; 1,531 / 6 / 1,525; 5 gates exit 0 (`AGENT.md:206`) |
| **0.8.0** | VTA-FACTORY P2 | **no commit** | phase | evidence package (§7.2) | full battery green after `p2-lockalign`; 330 rows (`AGENT.md:212`) |
| **0.8.1** | VTA-FACTORY P3 | **no commit** | phase | evidence package — **partial** (§7.3) | `p3-verify2` PASS-WITH-NOTES; soak 5/5; 6 gates + 2 honest SKIPs (`AGENT.md:219`) |
| — | VTA-FACTORY P4 | `AGENT.md:220` | **excluded — not closed** | none | close gate held; 5 deferrals open (`P4-DEFERRAL-LEDGER.md:32-52`) |
| **0.8.2** | VTA-FACTORY P5 (closes the program) | **no commit** | phase (program is **not** a mission) | evidence package (§7.4) | `p5-demo` verified; lint + `verify-skills` 10/10 (`AGENT.md:221`) |
| **0.8.3** | FULL-AUDIT (round 1) | **no commit** | phase-class | **closure record only** (§7.5) | report 1,194 lines / 23 findings; report text since overwritten (`AGENT.md:225`) |
| **0.8.4** | V-REMEDIATE | commit `c7c762c` (2026-10-18T17:29:58) | phase-class | source tarball at `c7c762c` | 23/23 fixed; two verifiers pass; battery 4/4, guards 6/6 (`AGENT.md:240`, `:248`) |
| **0.8.5** | FULL-AUDIT-2 | **no commit** | phase-class | **closure record only** (§7.6) | 1,575 lines / 47 findings; report text since overwritten (`AGENT.md:283`) |
| **0.8.6** | FULL-AUDIT-3 | **no commit** | phase-class | evidence package (§7.7) | 32,128 lines; 155/155 embeds; sha256 `4a0fc30c…` (`AGENT.md:293-296`) |
| **0.8.7** | **V87 MISSION-PLAN** | **no commit** | **mission — NAMED release** | evidence package (§7.8) | `w3-reverify2` ALL CLEARED; four identities exact (`AGENT.md:270`, `:274`) |
| **0.8.8** | POST87-APPLY Phase 0 | commit `2b3e66a` (2026-10-21T14:45:16) | phase | source tarball at `2b3e66a` | kit 22/22 · skills 10/10; 16 axes / 55 findings / 33 questions (`AGENT.md:308`) |
| **0.8.9** | POST87 Phase-1 slice = rulings wave #1 | commit `8312cae` (2026-10-21T15:43:09) | phase-class | source tarball at `8312cae` | 9 gate rows re-run at `7eaae18`; 447-line report (`AGENT.md:327`, `:376`) |
| **0.8.10** | POST87 rulings wave #2 | commit `f3ca04b` (merge to `main`) | phase-class | source tarball at `f3ca04b` | 0 live singular refs / 3,164 files; merged-tree gates green; dry-run fail-closed (`AGENT.md:336-340`) |
| — | Cluster 1 (lock abolition) | `AGENT.md:356-365` | **not closed — S6 pending** | none yet | S0–S4 green; S5 no landing record; S6 not run |
| *(0.8.11)* | *next closure* | — | — | — | **not assigned.** The counter is next free at `0.8.11`; it is assigned only when Cluster 1's S6 gate closes |

**Latest completed unit = `0.8.10` (rulings wave #2, `f3ca04b`).**

Two facts this table exists to state plainly:

1. **`0.7.16` → `0.8.7` is a named value, not arithmetic.** The increment chain would have produced
   `0.8.0`; the owner named the V87 mission `0.8.7` under §8.2. The draft's arithmetic numbers were
   never assigned (the map was a draft until this approval), so fixing them now is *not* retroactive
   renumbering. `0.8.8`, `0.8.9`, `0.8.10` continue +0.0.1 from the named release.
2. **The counter does not skip for open work.** Cluster 1 gets no number while it is open; the next
   closure takes `0.8.11` in closure order.

**DATED NOTE — 2026-10-21 · OWNER RENUMBERING (pre-publication, §8.2 policy override).**
This is an **owner renumbering of the unpublished backfill map — a §8.2 policy override applied
before any publication, NOT a §1 derivation.** The seven post-`0.7.9` pre-mission units move, in
unchanged closure order:

| was | now | unit |
|---|---|---|
| 0.7.10 | **0.8.0** | VTA-FACTORY P2 |
| 0.7.11 | **0.8.1** | VTA-FACTORY P3 |
| 0.7.12 | **0.8.2** | VTA-FACTORY P5 (closes the program) |
| 0.7.13 | **0.8.3** | FULL-AUDIT (round 1) |
| 0.7.14 | **0.8.4** | V-REMEDIATE |
| 0.7.15 | **0.8.5** | FULL-AUDIT-2 |
| 0.7.16 | **0.8.6** | FULL-AUDIT-3 |

Everything else stands: `0.7.8`, `0.7.9`, the named `0.8.7`, `0.8.8`, `0.8.9`, `0.8.10`; P4 stays
excluded; Cluster 1 still takes **0.8.11** at its S6 closure. Modes, anchors, packages and evidence
are unchanged — only the numbers move.

Scope of this amendment: the FINAL table above and this note. The rows in §5 and the bundle headings
in §7 keep the numbers they were written with; the table is authoritative, and the mapping above
resolves every occurrence. This note also supersedes the two pre-amendment sentences it invalidates:
the §1 header's "every other number is the §1 increment applied in order from the previous row", and
fact (1)'s "the increment chain would have produced `0.8.0`" — both described the arithmetic before
this override. No publication is authorized here (see §8.1).

---

## 2. OWNER RULINGS RECORDED (2026-10-21)

The eight draft flags are **closed**. No call below is re-opened by this map.

| ID | Draft call | Ruling | Consequence recorded |
|---|---|---|---|
| OD-1 | audit rounds: one unit or three? | **three phase-class units** (`0.7.13`, `0.7.15`, `0.7.16`) | each round keeps its own closure record and its own package |
| OD-2 | `V-REMEDIATE` class | **its own phase-class unit** (`0.7.14`) | not folded into the R1 audit |
| OD-3 | V87 mission number | **NAMED `0.8.7`** (override under §8.2); rebase Phase 0 → `0.8.8`, slice/wave #1 → `0.8.9`, wave #2 → `0.8.10` | the named value is an explicit queue-entry value; §8.2's policy file governs increments, not names |
| OD-4 | slice/wave as units | **phase-class units** | slice and wave #1 remain **one** unit (the slice report is its closure, `POST87-SLICE1.md:30`) |
| OD-5 | factory P4 | **excluded — not closed** | its close gate was held; the program's completion does not close P4 |
| OD-6 | factory program as a mission | **NOT a mission unit** — P5 closes it as a phase | no minor bump inside the factory chain |
| OD-7 | relay lanes of 2026-10-15 | **stay out** unless an evidenced addendum lands before publishing | no numbers reserved for them; an addendum would be filed, not folded in |
| OD-8 | "v87 plan nodes" granularity | **not units** — they live in `0.8.7`'s release notes | one mission unit, one package |

**STANDING RULE (recorded verbatim, standing from 2026-10-21):**

> numbers assigned at closure, in closure order; no retroactive renumbering, ever.

Reading applied here: a version is assigned when a unit's closure gate passes, at the next counter
value in closure order. A later discovery never renumbers an assigned or published version; it is
an erratum in release notes or a forward fix, never a renumber.

---

## 3. Commands run — the evidence base

Tag, ref and commit facts (read 2026-10-21):

```
$ git tag --list --format='%(refname:short)|%(creatordate:iso-strict)'
12 tags, newest v0.7.7|2026-10-15T17:29:35+03:00; no v0.8.x, no v0.9.x, no probe tag today.
$ git rev-list -n 1 v0.7.7   → 3d5d92aa99c2f3140372bc98aad816f1239f244a
$ git rev-parse main         → f3ca04ba4d3426ce20f95d6c5e2a3d70a82f60f3   (= origin/main)
$ gh release list -L 5       → v0.7.7 Latest 2026-10-15T14:30:10Z; v0.7.6; v7.5; v0.7.0; v0.6.5
```

Commit anchors (`git show -s --format='%h|%ad|%s'`): `3d5d92a` base · `66d0e45` P0 park ·
`c7c762c` V-REMEDIATE park · `2b3e66a` Phase 0 · `8312cae` slice report · `e66bf14`/`a95f112`/
`f90cdb3`/`4b6b05a`/`f3ca04b` wave #2 · `6e5f55c` F-1 (Cluster 1) · `7b41b92`…`cb12407` Cluster 1
S0–S4.

Ancestry (`git merge-base --is-ancestor`): `3d5d92a`, `772c693`, `66d0e45`, `c7c762c`, `2b3e66a`,
`8312cae`, `f3ca04b` **in** `main`; `6e5f55c`…`cb12407` **not**; `5ace12d` (relay-03) **not**.

Artifact identities re-verified live for the §7 bundles (`bytes` + sha256, no recollection):

| Artifact | lines | bytes | sha256 (first 8) |
|---|---|---|---|
| `V87-FOUNDATION-DOSSIER.md` | 283 | 54,912 | `03282AE9` |
| `V87-COLOR-AUDIT.md` | 376 | 30,721 | `9F7DBC7A` |
| `V87-PLAN-ZERO-TO-87.md` | 720 | 75,855 | `60705971` |
| `V87-DEFECTS.md` | 311 | 38,649 | `660A610D` |
| `.opencode/audit/V-FULL-AUDIT.md` | 32,128 | 2,118,431 | `4A0FC30C…2546E` |
| `P5-LOOP-DOSSIER.md` | 119 | 9,753 | — |
| `P4-DEFERRAL-LEDGER.md` | 63 | 2,866 | — |

Presence checks: `kit/kit.lock` **absent**, `scripts/verify-kit.mjs` **absent** (deleted at S3,
`6c3852b`); `docs/99-archive/P1-EVAL-7.jsonl` present (484,402,351 B); P2/P5 surfaces present
(`vantrilex-uploader.md` 5,875 B, `vantrilex-puller.md` 6,191 B, three `vantrilex-intake-*`
`SKILL.md`, `vs-ponytail/SKILL.md` 11,608 B); `docs/99-archive` holds 71 files.

Closure records: `AGENT.md` (line-cited per row), `WORKFLOW.md` Part B,
`.opencode/audit/POST87-PHASE0.md`, `POST87-SLICE1.md`, `POST87-INTAKE.md`,
`POST87-BLUEPRINT-ERRATA.md`, `V87-ENUM.md`, `P4-DEFERRAL-LEDGER.md`, `docs/spec/v87/*`.

---

## 4. What counts as closure evidence

A unit enters the table only with (1) a closure record naming it closed, (2) an anchor — a commit,
or an explicit "no commit" in the record, and (3) gate evidence quoted at closure. A unit with (1)
and (3) but no (2) is listed **with the gap stated**; no commit is invented. A unit with no closure
record is listed as insufficient (§9), never mapped.

Historical honesty: the `PARKED, UNRELEASED` headings for 0.7.5–0.7.7 (`V87-ENUM.md:296-299`, D1–D3)
stay exactly as written. This map records them as stale; it does not rewrite them.

---

## 5. Full unit table — as-closed evidence and gaps

| Version | Unit | Closure evidence | As-closed verification (quoted/paraphrased from the record) | Gaps stated at closure |
|---|---|---|---|---|
| 0.7.7 | base | tag + `AGENT.md:413`; release run `38751942204` | tag pushed, release published with `vantrilex-arsenal-v0.7.7.tar.gz` (2,108,221 B) | `CHANGELOG.md:12-18` says PARKED/UNRELEASED — stale label, not rewritten |
| 0.7.8 | P0 | `66d0e45`; `AGENT.md:193`, `:197` | `p0-verify` PASS-WITH-DEFERMENT: charter hashes 3/3; makers lint-clean; probes exit 0; registry 7/7 · kit 22/22 · skills 10/10 · mirror ok | battery entry DEFERRED (no battery definition on disk); independent (vanbu) verify not performed |
| 0.7.9 | P1 | `AGENT.md:206`; **no commit** | tallies recomputed live 1,531 / 6 / 1,525; shapes complete; `vs-*` set == green set; 5 gates exit 0 | no commit; battery slot unevaluable; three notes routed to the Guide |
| 0.7.10 | P2 | `AGENT.md:212`; **no commit** | full battery green after `p2-lockalign`; 330 rows; lock↔catalog rescan 0 drift | no commit; battery slot open; naming advisory + pointer removals left to owner |
| 0.7.11 | P3 | `AGENT.md:219`; **no commit** | 6 gates PASS + 2 honest SKIPS; soak 5/5, 0 uncovered; 19 conditional + github core-verified | no commit; plan-vs-live deviation (20 vs 19) flagged |
| 0.7.12 | P5 | `AGENT.md:221`; **no commit** | `p5-demo` verified; 4 live fetches 200; lint + `verify-skills` 10/10 at 37 folders | no commit; admit parked pending owner; owner-side queue open |
| 0.7.13 | R1 | `AGENT.md:225`; **no commit** | report 1,194 lines, 14 headings, 23 findings, §14 exits 0 | no commit; **report text overwritten twice since** |
| 0.7.14 | V-REMEDIATE | `c7c762c`; `AGENT.md:240`, `:248` | 23/23 fixed; two verifiers zero failures / zero unexpected; battery 4/4 · guards 6/6 · typechecks 4/4 | fresh clone not battery-green (factory registry uncommitted by ruling); one markdownlint SKIP |
| 0.7.15 | R2 | `AGENT.md:283`; **no commit** | 1,575 lines / 47 findings (15/20/12); Law-13 47=47=47=47; lint exit 0 | no commit; **overwritten by R3**; 13→3 recount flagged |
| 0.7.16 | R3 | `AGENT.md:293-296`; **no commit** | 32,128 lines; 155/155 embeds; Law-13 67; D-1 repair 6/6; sha256 `4a0fc30c…` | uncommitted at closure; lint exit 1 over embedded corpora (declared not a gate) |
| 0.8.7 | V87 | `AGENT.md:270`, `:274`; **no commit** | `w3-reverify2` ALL CLEARED: identity 4/4, lint 6/6, writer quiescence | four deliverables uncommitted; five decisions unanswered at closure |
| 0.8.8 | Phase 0 | `2b3e66a`; `AGENT.md:308` | kit 22/22 · skills 10/10 (`POST87-PHASE0.md:104-105`); lint 0; 16 axes / 55 findings / 33 questions | questions open at that instant; measurement, not a code change |
| 0.8.9 | slice / wave #1 | `8312cae`; `AGENT.md:327`, `:376` | 9 gate rows at `7eaae18` (`POST87-SLICE1.md:142-148`): kit · skills · registry · catalog `--check` · probe 61/61 · tsc · plugin list · markdownlint · hook | `r2-tags` returned open (no tag deletion run); twin held Q-15; Arabic rule-5 tension; RAG headers stale |
| 0.8.10 | wave #2 | `f3ca04b`; `AGENT.md:336-340` | 0 singular refs / 3,164 files; catalog `--check` 0 · registry 7/7 (2,915) · kit 22/22 · skills 10/10; dry-run `39606624421` guard PASS, publish fail-closed | markdownlint exit 1 with 16 pre-existing violations (zero regression, accepted); **end-to-end UNPROVEN**; mixed-generation main |

Class and numbering follow §2; no unit above is renumbered by a later finding.

---

## 6. Not closed — excluded, with their evidence

| Unit | State | Evidence | Rule applied |
|---|---|---|---|
| **VTA-FACTORY P4** | close gate held | `AGENT.md:220`; `P4-DEFERRAL-LEDGER.md:32-52` (5 OPEN / 2 CLOSED) | not closed → no number (OD-5) |
| **Cluster 1 (S0→S6)** | S6 pending; S5 no landing record | `AGENT.md:356-365`; commits `7b41b92`, `28e7afb`, `11e833a`, `500ead0`, `d745869`, `6c3852b`, `cb12407` | unit = cluster; slices get no numbers; `0.8.11` is the next free value **when** S6 closes |
| **POST87-APPLY Phase 1** | open (Aether-first clusters parked) | `AGENT.md:307`, `:317` | its slice is mapped at `0.8.9`; the phase itself is not closed |
| **`rel-selfpub` / `rel-map`** | in flight | `AGENT.md:375` | this file is the map, not a closure |

Cluster 1's landed evidence, for the day S6 closes: S0 `7b41b92` battery green in both trees;
S1a `28e7afb`+`11e833a` 12/12 themes, lock 166/0, catalog 2,940; S1b `500ead0` `verify-catalog` 9/9,
dual-run PASS, break-verified; S2 `d745869` parity exact (146 tokens, `e9f76f75…`); S3 `6c3852b`
22 kit checks → replacements, zero unmapped, lock-free battery 17/17; S4 `cb12407` 168/168 ids.

---

## 7. EVIDENCE-RELEASE BUNDLES (owner ruling §3)

**Policy, verbatim in substance:** for every no-commit unit, enumerate the closure-evidence bundle
(exact report paths, quoted as-closed verification output, closure-record references) and the
package manifest it would ship. The notes must state plainly that **no committed source tree
exists** and that **the package preserves the closure record**. Never invent a tree. Never re-run a
historical battery as as-closed evidence. Commit-anchored units publish at their own commits
normally.

Common package shape for every evidence release: `RELEASE-NOTES-<version>.md` (scope, closure
quote, gaps, the no-tree statement) · `CLOSURE-EVIDENCE/` (the artifacts below) · `MANIFEST.txt`
(per-file bytes + sha256). Paths are repo-relative.

### 7.1 `0.7.9` — P1 (assemblable)

- Closure refs: `AGENT.md:206`; gate quote: "all 5 gates exit 0", tallies 1,531 / 6 / 1,525.
- Artifacts: `docs/99-archive/P1-RUBRIC-7DIM.md` (7,826 B) · `P1-SHARDS-MANIFEST.md` (2,362 B) ·
  `P1-SHARD-1..7.jsonl` (63,519 / 63,881 / 65,521 / 69,174 / 61,514 / 64,260 / 58,602 B) ·
  `P1-EVAL-1..6.jsonl` (567,798 / 801,001 / 772,995 / 1,126,037 / 781,011 / 784,501 B) ·
  `P1-EVAL-INSTALLED.jsonl` (60,153 B) · the six admitted `vs-*` `SKILL.md` bodies.
- **Excluded by the record, named here:** `P1-EVAL-7.jsonl` (484,402,351 B) — out of VCS by ruling
  (`AGENT.md:248`) and over the 100 MB asset ceiling proven at `vr-park`. Referenced, not shipped.
- Not in the bundle: the lock state P1 gated (157 · 32/125 · 9) — abolished at S3.

### 7.2 `0.7.10` — P2 (assemblable)

- Closure refs: `AGENT.md:212`; gate quote: "FULL battery ALL exit 0", 330 rows.
- Artifacts: `P2-R0.md` (21,359) · `P2-INTAKE.md` (12,557) · `P2-SCAN-FIRST.md` (5,267) ·
  `P2-NEGCTRL.md` (18,707) · `P2-POLISH-CHECKLIST.md` (2,851) · `P2-SHARDS-MANIFEST.md` (1,890) ·
  `P2-SHARD-1..4.jsonl` (21,067 / 20,731 / 20,522 / 23,040) · `P2-EVAL-1..4.jsonl` (153,989 /
  258,332 / 249,255 / 95,457) · `P2-EVAL-INSTALLED.jsonl` (51,469) ·
  `P2-QUARANTINE-TRIAL.log` (733) · surfaces: `.opencode/agents/vantrilex-uploader.md` (5,875) ·
  `vantrilex-puller.md` (6,191) · `vantrilex-intake-{triage,fetch,send}/SKILL.md` (5,092 / 4,865 /
  5,057).
- Gap in the bundle: the sidecar/file rename state P2 produced is not separately recoverable — the
  bundle carries the P2 ledgers and the ledger record, not a P2 tree.

### 7.3 `0.7.11` — P3 (**partial — the gated artifacts no longer exist**)

- Closure refs: `AGENT.md:219`; gate quote: "6 gates PASS + 2 honest SKIPS", soak 5/5.
- Artifacts: `P3-R0.md` (24,421) · `P3-MCP-A.json` (3,737) · `P3-MCP-B.json` (5,145) ·
  `P3-GEAR-01..08.md` (964 / 944 / 912 / 927 / 894 / 911 / 935 / 939) · `P3-SOAK-LOG.md` (20,158) ·
  `P3-SMITHERY-STARTER-LOG.md` (10,684).
- **What cannot be shipped:** the 19 conditional lock records and the github update that P3
  actually verified. `kit/kit.lock` was deleted at S3 (`6c3852b`) and no commit captured the P3
  lock state (verified absent today). The notes must say the bundle preserves the proposal, soak
  and gear artifacts plus the ledger quote, and does **not** reproduce the gated lock.

### 7.4 `0.7.12` — P5 (assemblable)

- Closure refs: `AGENT.md:221`; gate quote: "lint + verify-skills 10/10 at 37 folders", 4 fetches 200.
- Artifacts: `P5-LOOP-DOSSIER.md` (9,753 B / 119 lines) ·
  `.opencode/skills/vs-ponytail/SKILL.md` (11,608 B).
- Gap: the admit remained parked pending the owner's review; no committed tree.

### 7.5 `0.7.13` — FULL-AUDIT R1 (**cannot be honestly assembled in full**)

- **What remains:** the ledger record only — `AGENT.md:225`: report 1,194 lines, 14 headings in
  order, 23 identifiers `L13-12-001…023`, §14 verbatim exits 0.
- **What is gone:** the report text itself. `.opencode/audit/V-FULL-AUDIT.md` was overwritten in
  place twice (R2, then R3); the file today is R3's (`4a0fc30c…`). No copy of R1's text exists.
- Package, if published: notes + that ledger quote, labelled **"closure record only — the report
  artifact was overwritten in place; no R1 text survives."** The owner may prefer to hold; the
  number stays allocated either way (standing rule).

### 7.6 `0.7.15` — FULL-AUDIT-2 (**cannot be honestly assembled in full**)

- **What remains:** `AGENT.md:283` — 1,575 lines, 47 findings (15 HIGH / 20 MEDIUM / 12 LOW),
  Law-13 bijection 47=47=47=47, lint exit 0.
- **What is gone:** the R2 text (overwritten by R3 at the same path; the R3 file is byte-identical
  to its own identity, not to R2's). The 13→3 source-disagreement recount was flagged unreproduced.
- Package, if published: notes + ledger quote, labelled exactly as §7.5.

### 7.7 `0.7.16` — FULL-AUDIT-3 (assemblable)

- Closure refs: `AGENT.md:293`, `:296`; identity: **32,128 lines / 2,118,431 B / sha256
  `4a0fc30c1cfeeca742004064e6806e3dc436160b2bab57c70a27a2c2cc42546e`** — re-hashed today, identical.
- Artifacts: `.opencode/audit/V-FULL-AUDIT.md` (the file itself) + the D-1 repair record.
- Gap: uncommitted at closure; the package carries the file, not a commit.

### 7.8 `0.8.7` — V87 mission (assemblable)

- Closure refs: `AGENT.md:270` (announced), `:274` (final complete); `w3-reverify2` ALL CLEARED.
- Artifacts, identities re-verified today (lines / bytes / sha256 prefix):

| File | lines | bytes | sha256 |
|---|---|---|---|
| `V87-FOUNDATION-DOSSIER.md` | 283 | 54,912 | `03282AE9…` |
| `V87-COLOR-AUDIT.md` | 376 | 30,721 | `9F7DBC7A…` |
| `V87-PLAN-ZERO-TO-87.md` | 720 | 75,855 | `60705971…` |
| `V87-DEFECTS.md` | 311 | 38,649 | `660A610D…` |

- Notes carry the five owner decisions still open at closure (`V87-PLAN-ZERO-TO-87.md` §9.2) and
  the fact that the **four deliverables are uncommitted** — the package preserves their bytes and
  hashes, not a source tree.
- Not in this bundle: `V87-RUFLO-ANALYSIS.md` — F-1, committed at `6e5f55c`, belongs to Cluster 1.

### 7.9 Commit-anchored units (normal publication)

`0.7.8` at `66d0e45` · `0.7.14` at `c7c762c` · `0.8.8` at `2b3e66a` · `0.8.9` at `8312cae` ·
`0.8.10` at `f3ca04b`. Each publishes as a source tarball of the tree at that commit, with notes
carrying the as-closed evidence and any gap from §5 — including `0.7.14`'s recorded caveat that a
fresh clone at `c7c762c` is not battery-green (factory registry state uncommitted by ruling).

**Units whose bundle cannot be honestly assembled in full, named individually: `0.7.13` (R1) and
`0.7.15` (R2) — report text gone, closure record only. Partial by design: `0.7.11` (P3) — its gated
lock artifacts were abolished at S3 and are unrecoverable.**

---

## 8. Publication conditions

1. **No publish before `rel-selfpub` lands and its §6 proofs pass review.** No backfill publish in
   this lane, now or later without that precondition. *Observed 2026-10-21 (not a satisfaction
   claim): the sibling lane's mechanism commits `8f12b3d` and `52733ea` are on this branch; this
   map's sources carry no record of the §6 proofs review, so the precondition is recorded as
   **open**.*
2. **Ascending version order**, each at its own commit or evidence bundle; tree as it was.
3. **The first live publish runs monitored**, and its audit line is reported before the rule is
   called proven (this is also what closes the §2.3 end-to-end debt).
4. **Never edit a historical tree** to pass today's battery; **never let today's battery block a
   historical release** — the as-closed evidence is the quoted historical output.
5. **The map is owner-approved on these terms (2026-10-21); the §3 gate is satisfied.** Numbers are
   fixed as of this approval; any later finding is an erratum, not a renumber.

---

## 9. Units with insufficient evidence — stated explicitly

| Unit | What exists | What is missing |
|---|---|---|
| `AETHER-INTAKE` (2026-10-20) | ledger record only (`AGENT.md:297`) | no commit, no artifact, no closure record; superseded by `POST87-APPLY` (`AGENT.md:378`). **Not a unit.** |
| Cluster 1 — S5 (docs) | dispatched with S4 (`AGENT.md:365`) | no landing record, no commit, no gate report. Status **unknown** — a check that cannot be evaluated is a failed check, not a pass. |
| `r2-tags` (node inside `0.8.9`) | read-only proofs `.opencode/audit/r2-tags/`; ledger `AGENT.md:322` | the ordered tag deletion was not performed by that node; the wave closed with it open. The tags are absent live today — a later owner-side fact, not this node's closure. |
| `F-1` (Ruflo dossier) | commit `6e5f55c`, byte-verified filing | a **node** of Cluster 1, not a closure unit — carries no number under OD-8's logic. |
| Factory P1–P5, audits R1–R3, V87 | closure records + quoted gates | **no commit anchor**; §7 governs how each publishes or is labelled. |

---

## 10. What the backfill can and cannot do — standing notes

1. **As-closed batteries are not re-runnable.** Pre-S3 units closed against
   `scripts/verify-kit.mjs` (22 checks); S3 deleted it and the lock (`6c3852b`, both verified
   absent today). The as-closed evidence is the quoted output, never a fresh run.
2. **`main` does not carry Cluster 1.** `main` = `f3ca04b`; the eight cluster commits `6e5f55c`…
   `cb12407` are unpushed. No row above assumes they are on the release line.
3. **`CHANGELOG.md` records none of these units.** `[Unreleased]` holds two entries
   (`CHANGELOG.md:10-26`); 0.7.5–0.7.7 headings still read PARKED/UNRELEASED — stale, recorded, not
   rewritten.
4. **`v7.5` naming:** the real 0.7.5 release (`V87-ENUM.md:103`, D4). It sorts after `v0.7.7`
   lexically; the base is `v0.7.7`, the newest tag by date and by the shipped series
   (`V87-ENUM.md:234`).
5. **`0.8.7` is a named value.** A publisher that computes from increments alone would produce
   `0.8.0`; the queue entry for the V87 mission must carry the explicit value. No increment is
   hard-coded to force it.

---

## 11. Handoff

- **Owner:** the map stands approved as tabled; the only open publication prerequisite is the
  `rel-selfpub` landing plus its §6 proofs review (§8.1).
- **Publish lane:** ascending; commit-anchored units as source tarballs, no-commit units as the §7
  evidence bundles with the no-tree statement; R1/R2 labelled closure-record-only; P3 labelled
  partial.
- **Kit-maintainer lane:** any CHANGELOG correction for the stale 0.7.x labels is a forward-only
  edit with a dated note — never a rewrite.

---

## 12. Bounds observed

- Wrote exactly one file (this map) and committed it once. No other path modified, staged or
  committed by this node.
- Zero tags, zero pushes, zero merges, zero releases, zero publishes, zero force-ops.
- Zero invented tags, commits, numbers or trees: every hash printed in this session; every
  no-commit unit says "no commit"; every bundle lists only artifacts verified present today.
- Zero secrets; zero model pins; zero color or routing-identity fields.
- Lint: reported with its actual runner and exit code in the return report.

**Routing used:** cheap path for the tag/commit/hash/probe sweep; escalated reasoning only where
the ruling meets evidence — the named-release rebase, the P3 partial bundle, and the R1/R2
"closure record only" call.

Ponytail: curation spirit binding (FULL binds code-writing nodes only; this node wrote no code) —
evidence: 17 table rows covering the base, all 13 completed units, the excluded P4, the open cluster
and the unassigned next value; 8 rulings recorded as decided; 8 evidence bundles enumerated with
bytes; 3 bundles named as not-fully-assemblable (2 closure-record-only, 1 partial); one artifact
rewritten, zero renumbering, zero publishes.
