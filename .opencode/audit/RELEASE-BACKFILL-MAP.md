# RELEASE-BACKFILL-MAP — v0.7.7 → latest completed unit (draft for owner approval)

- **Workstream:** `rel-map` — owner release ruling §3 (HARD GATE), parallel to `rel-selfpub`; the
  cluster sequence is untouched.
- **Node:** `rel-map` · **Owner:** `vantrilex-librarian` (worker-only seat)
- **Classification:** DIRECTED — Scenario 2 does NOT apply; the brief fixes this artifact and its
  table.
- **Date:** 2026-10-21 · **Effort:** HIGH (evidence judgment, §6)
- **Status:** **DRAFT FOR OWNER APPROVAL.** No backfill publish is authorized by this file
  (`AGENT.md:369`). No tag, push, merge or release is made in this lane.
- **Base tag, verified live:** `v0.7.7` → `3d5d92aa99c2f3140372bc98aad816f1239f244a`
  (annotated; tag date `2026-10-15T17:29:35+03:00`). It is the highest existing tag under any
  naming (`git tag` = 12 tags; `gh release list` shows `v0.7.7` as `Latest`).
- **Release line today:** `main` = `origin/main` = `f3ca04b`; lane HEAD was `cb12407` on
  `wt/vta-factory-p0` when this map was drafted, **8 commits ahead of `main`** (9 once this map's
  own single-file commit lands); `main` carries no tag above `v0.7.7`.
- **Kit version context:** no file stores the kit's own version (`V87-ENUM.md:305`, D10). Every
  version below is computed from tags plus the §1 law — never read from a lock file (the lock was
  abolished at S3, commit `6c3852b`).
- **Scope of write:** this file only. `AGENT.md`, `WORKFLOW.md`, the registry, the RAG files, the
  CHANGELOG and every historical tree are untouched.

---

## 0. Commands run — the evidence base

Every hash and date in this map comes from one of these reads on 2026-10-21. Nothing is recalled.

```
$ git tag --list --format='%(refname:short)|%(creatordate:iso-strict)'
v0.1.0|2026-10-04T19:18:07+03:00   v0.4.1|2026-10-14T08:19:57+03:00   v0.7.0|2026-10-15T10:11:53+03:00
v0.2.0|2026-10-04T23:17:32+03:00   v0.5.0|2026-10-15T06:24:32+03:00   v7.5  |2026-10-15T17:21:30+03:00
v0.3.0|2026-10-12T13:44:18+03:00   v0.6.0|2026-10-15T07:47:27+03:00   v0.7.6|2026-10-15T17:24:56+03:00
v0.4.0|2026-10-14T07:29:26+03:00   v0.6.5|2026-10-15T08:07:08+03:00   v0.7.7|2026-10-15T17:29:35+03:00
→ 12 tags. No `v0.8.x`, no `v0.9.x`, no probe tag (`v0.0.98/99-dryrun.1`) is present today.

$ git rev-list -n 1 v0.7.7        → 3d5d92aa99c2f3140372bc98aad816f1239f244a
$ git rev-parse main              → f3ca04ba4d3426ce20f95d6c5e2a3d70a82f60f3
$ git rev-parse origin/main       → f3ca04ba4d3426ce20f95d6c5e2a3d70a82f60f3
$ git rev-parse HEAD              → cb12407cdc7124c535ba4f4303848cd52e37e512
$ git rev-list --count main..HEAD → 8   (draft-time; 9 after this map's own commit)
$ git describe --tags --always    → v0.7.7-27-gcb12407   (draft-time reading)
$ gh release list -L 5
v0.7.7  Latest  v0.7.7  2026-10-15T14:30:10Z
v0.7.6          v0.7.6  2026-10-15T14:25:12Z
v7.5            v7.5    2026-10-15T14:21:39Z
…
```

Commit dates and subjects of every anchor used below (`git show -s --format='%h|%ad|%s'`):

| commit | date (+03:00) | subject |
|---|---|---|
| `3d5d92a` | 2026-10-15T17:27:40 | merge: v0.7.7 program (base) |
| `0eed6a1` | 2026-10-15 (park) | relay skill v2 — quota-proof polling, sessions, hardening |
| `772c693` | 2026-10-15T19:06:26 | relay skill v2 fixes — doc/code alignment |
| `66d0e45` | 2026-10-17T19:07:46 | factory-p0 — charter + makers + probes |
| `c7c762c` | 2026-10-18T17:29:58 | fix: V-REMEDIATE — census sync, archive, AR mirrors, index gate |
| `93f5b4e` | 2026-10-21T14:08:22 | docs(post87): blueprint + intake structure map |
| `e471cba` | 2026-10-21T14:25:58 | feat(release): auto-publish v0.0.x patches |
| `2b3e66a` | 2026-10-21T14:45:16 | docs(post87): Phase 0 reconciliation report |
| `c57d9a8` | 2026-10-21T15:07:16 | refactor(plugin): guards merged into arsenal |
| `5c2dcea` | 2026-10-21T15:25:47 | docs(post87): ruling sheet applied — errata, re-key |
| `7eaae18` | 2026-10-21T15:28:46 | docs(plugin): plan-guard references repointed |
| `8312cae` | 2026-10-21T15:43:09 | docs(post87): Phase-1-slice report |
| `e66bf14` | 2026-10-21T15:51:40 | fix(paths): U4 residual sweep |
| `a95f112` | 2026-10-21T15:58:14 | feat(release): retire release.yml asset upload |
| `f90cdb3` | 2026-10-21T16:08:54 | fix(registry): regenerate indexes on main |
| `4b6b05a` | 2026-10-21T16:09:58 | docs(release): reflect release.yml retirement |
| `6e5f55c` | 2026-10-21T17:06:46 | docs(v87): file the Ruflo analysis dossier (F-1) |
| `7b41b92` | 2026-10-21T17:32:11 | fix(registry): S0 registry alignment |
| `28e7afb` | 2026-10-21T17:42:23 | feat: nine per-agent themes (S1a) |
| `11e833a` | 2026-10-21T17:42:38 | chore: lock nine themes, empty pending (S1a) |
| `500ead0` | 2026-10-21T17:55:20 | feat(verify): catalog proofs + parity baseline (S1b) |
| `d745869` | 2026-10-21T18:04:33 | feat(injection): switch CI + injection (S2) |
| `6c3852b` | 2026-10-21T18:18:29 | feat(kit): delete kit.lock + verifier (S3) |
| `cb12407` | 2026-10-21T18:30:27 | fix(manifests): regenerate install profiles (S4) |

Ancestry checks (`git merge-base --is-ancestor <c> main`): `3d5d92a`, `772c693`, `66d0e45`,
`c7c762c`, `2b3e66a`, `8312cae`, `f3ca04b` are **in** `main`; `6e5f55c`, `7b41b92`…`cb12407` are
**not**; `5ace12d` (relay-03 park) is **not**.

Closure records read live: `AGENT.md` (ledger lines cited per row), `WORKFLOW.md` Part B,
`CHANGELOG.md:1-40`, `.opencode/audit/POST87-PHASE0.md`, `.opencode/audit/POST87-SLICE1.md`,
`.opencode/audit/POST87-INTAKE.md`, `.opencode/audit/V87-ENUM.md`,
`.opencode/audit/POST87-BLUEPRINT-ERRATA.md`, `P4-DEFERRAL-LEDGER.md`, and the seven
`docs/spec/v87/*` inputs.

---

## 1. What counts as closure evidence in this map

A unit enters the map only when all three exist:

1. **a closure record** naming the unit as closed, complete or announced (ledger line, audit
   report, or gate report), and
2. **an anchor** — a commit that carries the unit's tree, or an explicit `no commit` statement in
   the record, and
3. **gate evidence quoted at closure** — the verifier names, results and exits the record states.

A unit with (1) and (3) but no (2) is listed **with the gap stated**; no commit is invented to
fill it. A unit whose class word is not `phase` or `mission` is **flagged**, never decided here.
A unit with no closure record is listed in §6 as insufficient, never mapped.

Historical honesty rule: this map records what the records say today. It does not rewrite
`CHANGELOG.md`, any tag, any commit, or the `PARKED, UNRELEASED` headings that `V87-ENUM.md:296-299`
(D1–D3) proves stale — those headings stay exactly as they were written.

---

## 2. Numbering law as applied

Quoted verbatim from `AGENT.md:367` (= `WORKFLOW.md:93`):

> **§1 NUMBERING LAW (standing):** a completed PHASE publishes as +0.0.1; a completed MISSION
> publishes as +0.1.0 (minor +1, patch reset). Unit names are the project's own records
> (MISSION-PLAN = mission; Phase 0/1 = phases; slices/clusters per the records — borderline calls
> are flagged in the map, §3, not decided silently).

Application rules used here:

- **Base** = the highest existing tag (`v0.7.7` = 0.7.7), verified live. Not a guessed baseline.
- **Order** = closure order in the project's own records (ledger dates), which agrees with commit
  order for every unit that has a commit.
- **Phase** = +0.0.1. **Mission** = +0.1.0 with patch reset (a higher increment resets the lower,
  `AGENT.md:374` §8.1).
- **A unit that is not closed gets no number.** Its work may be committed; the unit is still open.
- **Class ambiguity → flag.** A flagged unit's number is marked provisional because including or
  excluding it shifts the cascade; each flag states its effect (§4).

---

## 3. The map (ascending)

Primary cascade = the units §3 enumerates (factory P0–P5, audit, remediation, the v87 mission,
POST87 Phase 0 + slice 1 + waves), each completed unit treated as one increment, with the mission
increment where the record names a mission. Flagged class calls are marked in the class column and
carry a provisional number.

| # | Unit | Evidence (tag / commit / ledger / file:line) | Unit class | Computed version by §1 | As-closed verification evidence — and the gap |
|---|---|---|---|---|---|
| 0 | **`v0.7.7` — base** | tag `v0.7.7` → `3d5d92a` (annotated, 2026-10-15T17:29:35+03:00); `AGENT.md:413`; `gh release list` = Latest | base (shipped release) | **0.7.7** | Released, tagged and published before this lane (run `38751942204` success per `AGENT.md:413`). **Gap:** `CHANGELOG.md:12-18` still reads `PARKED, UNRELEASED` — a stale label proven at `V87-ENUM.md:296` (D1). Not rewritten here. |
| 1 | **VTA-FACTORY-EXECUTE — phase P0** | commit `66d0e45` (2026-10-17T19:07:46); `AGENT.md:193` (P0 announced), `AGENT.md:197` (park verified) | phase | **0.7.8** | `p0-verify` PASS-WITH-DEFERMENT: charter hashes identical 3/3; makers lint-clean; probes exit 0; registry 7/7 · kit 22/22 · skills 10/10 · mirror ok · lint clean; park `66d0e45` pushed, `ls-remote` == local. **Gaps:** battery entry verified-absent → DEFERRED; independent (vanbu) verify not performed — needs owner mediation. |
| 2 | VTA-FACTORY-EXECUTE — phase P1 | `AGENT.md:206` (`p1-verify` PASS-WITH-NOTES, P1 ANNOUNCED); **no commit** — record says outputs untracked | phase | **0.7.9** | Tallies recomputed live 1,531 evaluated / 6 green / 1,525 non-green; shapes complete; `vs-*` set == green set; 5 gates exit 0. **Gaps:** no commit anchor (§1 rule 2); battery slot unevaluable; three notes (BOM hygiene, notation, dual-surface) routed to the Guide. |
| 3 | VTA-FACTORY-EXECUTE — phase P2 | `AGENT.md:212` (P2 ANNOUNCED); **no commit** | phase | **0.7.10** | FULL battery green after `p2-lockalign`: registry 7/7 · kit 22/22 · skills 10/10 · catalog `--check` ok; 330 rows evaluated; lock↔catalog drift rescan 0. **Gaps:** no commit anchor; battery slot open; naming advisory and pointer removals left to owner. |
| 4 | VTA-FACTORY-EXECUTE — phase P3 | `AGENT.md:219` (`p3-verify2` PASS-WITH-NOTES, P3 ANNOUNCED); **no commit** | phase | **0.7.11** | 6 gates PASS + 2 honest SKIPS; soak 5/5 entries with 0 uncovered; lock 19 conditional + github core-verified. **Gaps:** no commit anchor; plan-vs-live deviation (20 conditional vs 19 + github) flagged for owner amendment. |
| — | VTA-FACTORY-EXECUTE — phase P4 | `AGENT.md:220`; `P4-DEFERRAL-LEDGER.md:4` | phase — **NOT CLOSED** | **excluded** (§5) | 3 consecutive green battery runs + deferral ledger with 5 OPEN / 2 CLOSED. **Its own close gate was held** ("P4 CLOSE BLOCKED on owner items", `AGENT.md:220`). See §4 OD-5. |
| 5 | VTA-FACTORY-EXECUTE — phase P5 (program closes) | `AGENT.md:221` (`p5-demo` VERIFIED; "VTA-FACTORY-EXECUTE COMPLETE — FULL STOP"); **no commit** | phase | **0.7.12** | `p5-demo` verified: `vs-ponytail` regraded green on D2/D3/D6/D7 with quotes; 4 live fetches 200; lint + `verify-skills` 10/10 at 37 folders. **Gaps:** no commit anchor; admit parked pending the owner's review; the program's owner-side queue (vanbu P0 verify, battery gate entry, maker naming, gear identities, eval slots, Omar records, kit registration) was still open at closure. |
| 6 | FULL-AUDIT (round 1) | `AGENT.md:222-225` (lane opened → report landed → COMPLETE); **no commit** | audit lane — **flag OD-1** | **0.7.13** *(prov. — OD-1)* | Report `.opencode/audit/V-FULL-AUDIT.md` 1,194 lines; 14 headings in order; 23 identifiers `L13-12-001…023`; §14 verbatim exits 0. **Gaps:** no commit; the report text was overwritten twice afterwards (R2, R3), so this closure survives only as the ledger record — the artifact itself no longer exists on disk. |
| 7 | V-REMEDIATE | commit `c7c762c` (2026-10-18T17:29:58), parent `66d0e45`, pushed; `AGENT.md:240` (COMPLETE), `AGENT.md:248` (signed, amended, parked) | remediation lane — **flag OD-2** | **0.7.14** *(prov. — OD-2)* | All 23 findings fixed and independently verified by two verifiers: zero failures, zero unexpected files; addendum battery 4/4 · guard probe 6/6 · typechecks 4/4; park 101 files, `ls-remote` == local. **Gaps:** a fresh clone at `c7c762c` is **not** battery-green (factory registry state uncommitted by ruling); one verifier SKIPPED markdownlint (not a pass). |
| 8 | FULL-AUDIT-2 | `AGENT.md:275` (opened), `AGENT.md:283` (COMPLETE — ANNOUNCED); **no commit** | audit lane — **flag OD-1** | **0.7.15** *(prov. — OD-1)* | Report rewritten in place, 1,575 lines / 47 findings (15 HIGH / 20 MEDIUM / 12 LOW); Law-13 bijection 47=47=47=47; lint exit 0. **Gaps:** no commit; overwritten again by R3; the 13→3 source-disagreement recount is flagged unreproduced. |
| 9 | FULL-AUDIT-3 | `AGENT.md:284` (opened), `AGENT.md:293` (report), `AGENT.md:296` (repair re-verify, COMPLETE); **no commit** | audit lane — **flag OD-1** | **0.7.16** *(prov. — OD-1)* | 32,128 lines; 155/155 embeds byte-exact; Law-13 67=67=67=67 (19/31/17); repair re-verify 6/6 PASS; final identity sha256 `4a0fc30c1cfeeca742004064e6806e3dc436160b2bab57c70a27a2c2cc42546e`. **Gaps:** uncommitted at closure (the tracked blob at `.opencode/audit/V-FULL-AUDIT.md` predates it — `git log` shows one commit, `c7c762c`); lint recorded exit 1 over embedded corpora (declared not a hard gate). |
| 10 | **V87-AETHER-EXECUTE — the V87 MISSION-PLAN** (`v8.7`) | `AGENT.md:249-250` (opened), `AGENT.md:270` (announced), `AGENT.md:274` (final complete); deliverables on disk: `V87-FOUNDATION-DOSSIER.md`, `V87-COLOR-AUDIT.md`, `V87-PLAN-ZERO-TO-87.md`, `V87-DEFECTS.md`; **no commit** | **mission** (`MISSION-PLAN` = mission, `AGENT.md:367`; `WORKFLOW.md:79`) | **0.8.0** *(conflict OD-3: named `0.8.7`)* | `w3-reverify2` FINAL: "ALL CLEARED — yes"; identity 4/4 exact; lint 6/6 exit 0 (one SKIP for an absent bare `markdownlint` binary, npx equivalent exit 0); writer quiescence proven after a confirmed clobber-and-recover cycle. **Gaps:** all four deliverables **uncommitted** (owner orders park if wanted); five plan decisions routed to the owner and unanswered at closure (`V87-PLAN-ZERO-TO-87.md` §9.2). |
| 11 | **POST87-APPLY — Phase 0** | commit `2b3e66a` (2026-10-21T14:45:16); `AGENT.md:308`; report `.opencode/audit/POST87-PHASE0.md` (681 lines, committed with the phase) | phase | **0.8.1** | Gates quoted in the phase report (`POST87-PHASE0.md:104-105`): `verify-kit` 22/22 · `verify-skills` 10/10; report lint exit 0; 16 axes / 55 findings / 33 owner questions; disclosed corrections recorded at `POST87-PHASE0.md:623`. **Gaps:** the 33 questions were open at that instant (answered later, same date); the report itself is measurement, not a code change. |
| 12 | **POST87 — Phase-1 slice = rulings wave #1** | commit `8312cae` (2026-10-21T15:43:09); `AGENT.md:327` (wave complete), `AGENT.md:376` (slice report landed, 447 lines); node commits `0c23c7f`, `e215cdc`, `b6659d8`, `c57d9a8`, `5c2dcea`, `7eaae18`, `20866d0`; wave membership proven at `POST87-SLICE1.md:30` ("four U-slice nodes plus three ruling nodes") | slice — **flag OD-4** | **0.8.2** *(prov. — OD-4)* | Every gate re-run live at `7eaae18` (`POST87-SLICE1.md:142-148`): kit 22/22 · skills 10/10 · registry 7/7 · catalog `--check` 17 ok + 1 skip · probe 61/61 · tsc 0 · `opencode plugin list` 1 row · markdownlint 0 · pre-commit hook 0. **Gaps:** `r2-tags` (§3(a) probe-tag deletion) **returned open** — no `git tag -d` was run (the tags are absent today; live `git tag` shows 12 tags); untracked twin held under Q-15; Arabic errata vs rule 5 open; RAG provenance headers stale. |
| 13 | **POST87 — rulings wave #2** | `AGENT.md:336-340`; commits `e66bf14` (U4 sweep), `a95f112` (release.yml retired), `f90cdb3` (indexes regen), `4b6b05a` (doc drift), merge to `main` `f3ca04b` (2026-10-21) | wave — **flag OD-4** | **0.8.3** *(prov. — OD-4)* | Live sweep: 0 singular refs over 3,164 files; merged-tree gates: catalog `--check` 0 · registry 7/7 (2,915 records) · kit 22/22 · skills 10/10; dry-run `39606624421`: guard PASSED, publish job **failed closed** at checkout of the synthetic tag (`AGENT.md:340`). **Gaps:** markdownlint exit 1 with **16 pre-existing** violations in `docs/spec/VANTRILEX_KIT_SPEC.md` (baseline 16 = merged 16, zero regression, accepted — not a pass); no audit line produced → end-to-end lane **UNPROVEN**; `main` is mixed-generation (2,915 records / 138+9 committed vs 157 / 2,931 in the census texts). |

**Latest completed unit = #13, `2026-10-21` rulings wave #2, computed `0.8.3`** under the primary
reading (provisional on OD-1/2/4). Everything after it in the tree belongs to Cluster 1, which is
**not closed** (§5).

---

## 4. Borderline calls — owner decisions, not decided here

Each row: the call, the evidence, the two readings, and the exact effect on numbers. The primary
cascade of §3 uses the reading in the "used here" column.

| ID | Borderline call | Evidence | Used here | Alternative and its effect on numbers |
|---|---|---|---|---|
| **OD-1** | Audit rounds: one unit ("audit") or three (R1, R2, R3)? | `AGENT.md:225`, `:283`, `:296` — three separate audits, each with its own report identity and closure record; §3 lists "audit" once | 3 units (0.7.13, 0.7.15, 0.7.16) | 1 unit → pre-mission patches **−2** from FULL-AUDIT on (V-REMEDIATE 0.7.13, mission 0.8.0). Post-mission numbers **unchanged** (mission resets the patch). |
| **OD-2** | Is `V-REMEDIATE` a unit or a repair round of the R1 audit? | `AGENT.md:226` (new lane), `:240` (COMPLETE), `:248` (signed/parked); §3 lists "remediation" separately from "audit" | 1 unit (0.7.14) | If it is a repair round of R1 → pre-mission **−1** from V-REMEDIATE on; mission and later numbers unchanged. |
| **OD-3** | The V87 mission's number: §1 arithmetic or the owner's named release? | §1 gives 0.7.7 + mission 0.1.0 = **0.8.0**; the owner's Part 2 says the MISSION-PLAN "ships as release 0.8.7" (`WORKFLOW.md:79`, `AGENT.md:347`), and the ruling says "named releases 0.8.7/0.9 mechanics stay as ruled" (`WORKFLOW.md:91`) | **0.8.0** (arithmetic; the conflict is flagged) | If the owner keeps `0.8.7`, the mission is named, not computed, and the whole post-mission patch sequence renumbers from it (Phase 0 → 0.8.8, slice → 0.8.9, wave #2 → 0.8.10) — i.e. §1's patch counter cannot be used for those units without the owner's re-basing. **This is the single decision that changes the shape of the line.** |
| **OD-4** | Are a closed *slice* and a closed *wave* units? | §1 names only phase and mission, then says "slices/clusters per the records"; the slice report is explicitly the wave's six-part completion (`POST87-SLICE1.md:1,:5,:30`) | Yes: slice = wave #1 = one unit (0.8.2); wave #2 = one unit (0.8.3) | If neither is a unit → latest completed = POST87 Phase 0 at **0.8.1**, and the map ends there. If slice and wave #1 are counted separately → one extra +0.0.1 (wave #2 = 0.8.4) — the map treats them as **one** unit because the record makes the slice report the wave's closure. |
| **OD-5** | Factory P4: excluded (close gate held) or counted (program announced complete)? | `AGENT.md:220` — "P4 CLOSE BLOCKED on owner items"; `AGENT.md:221` — "VTA-FACTORY-EXECUTE COMPLETE"; `P4-DEFERRAL-LEDGER.md:32-52` — 5 OPEN / 2 CLOSED | **Excluded** (§5) | If counted → insert one unit at 0.7.13; pre-mission **+1** from FULL-AUDIT on; mission and post-mission numbers unchanged. |
| **OD-6** | Is the factory *program* itself a mission on top of its phases? | Records call P0–P5 "phases" (`P4-DEFERRAL-LEDGER.md:4`); the plan calls the whole thing "the factory program P0 to v8.6" (`V87-ENUM.md:249`); no record calls it a mission | Phases only | If the program is a mission at P5 → 0.8.0 at P5, V87 mission → **0.9.0**, Phase 0 → 0.9.1, slice → 0.9.2, wave #2 → 0.9.3. This would put the line one minor ahead of the owner's `0.8.7` naming. |
| **OD-7** | Relay lanes of 2026-10-15 are completed units with commits but are outside §3's enumeration. | `AGENT.md:397` (v2 merged to `main`, `3d5d92a..772c693`), `:400-401` (fixes `772c693`), `:390-393` (relay-03 park `5ace12d`, **not** in `main`) | Not mapped (outside the enumeration) | If counted: relay v2/fixes → +0.0.1 and relay-03 → +0.0.1, i.e. **+2 pre-mission patches** (P0 0.7.10 … FULL-AUDIT-3 0.7.18); mission still 0.8.0. Relay-03's anchor `5ace12d` is **not in `main`**, so its release commit would sit off the release line. |
| **OD-8** | "v87 plan nodes": one mission unit, or one unit per plan node? | §1 maps `MISSION-PLAN` = mission; the plan executed 4 waves (W0–W3) and closed once (`AGENT.md:270`, `:274`) | One mission unit | If per-node units → no minor bump and a patch per node (the ledger records 13 nodes across W0–W3); the cascade would not reach 0.8.x at all. Not computed further: §1's own mapping and the single closure record both point to one mission. |

**Invariance property (useful for the publish lane):** OD-1, OD-2, OD-5 and OD-7 shift only
**pre-mission patch numbers**; the mission's minor bump resets the patch, so `0.8.0` and every
post-mission number are stable under those four calls. Only OD-3, OD-4, OD-6 and OD-8 change the
post-mission line.

---

## 5. Not closed — excluded from the map

| Unit | State now | Evidence | Why excluded |
|---|---|---|---|
| **VTA-FACTORY-EXECUTE — P4** | close gate **held** (5 items open) | `AGENT.md:220`; `P4-DEFERRAL-LEDGER.md:32-52` | §2 rule: a unit with a held close gate gets no number. Flagged OD-5. |
| **Cluster 1 (lock abolition) — S0→S6** | **NOT CLOSED — S6 pending** | `AGENT.md:356` (order), `:360-365` (S0–S4 landed), `:365` (S4 + S5 dispatched) | The unit is the cluster, not its slices. S5 (docs) has **no landing record** at time of writing; S6 (full battery) has not run. Therefore: **no version is allocated to S0–S4**, even though six commits exist (`7b41b92`, `28e7afb`, `11e833a`, `500ead0`, `d745869`, `6c3852b`, `cb12407`) and all landed gates are green. |
| **POST87-APPLY — Phase 1** (the phase, as distinct from its slice) | open | `AGENT.md:307`, `:317` — "Phase 1 then opens ONLY on the clusters these rulings unblock"; Aether-first clusters parked pending `V-AETHER` | Not closed; the slice is a wave inside the phase, mapped at #12 with flag OD-4. |
| **`rel-selfpub` / `rel-map`** (this workstream) | in flight | `AGENT.md:375` | Not closed; this file is the map, not a closure. |

Cluster 1's as-closed evidence, recorded for the day it closes (not a version claim): S0 `7b41b92`
battery green in **both** the working and the committed tree; S1a `28e7afb`+`11e833a` 12/12 theme
JSONs, lock 166/0, catalog 2,940; S1b `500ead0` `verify-catalog` 9/9, dual-run PASS, break-verified
both directions; S2 `d745869` injection parity exact (146 tokens, digest `e9f76f75…`); S3
`6c3852b` lock abolished with 22 kit checks → replacements, zero unmapped, lock-free battery 17/17;
S4 `cb12407` 168/168 profile ids resolve.

---

## 6. Units with insufficient evidence — stated explicitly

| Unit | What exists | What is missing |
|---|---|---|
| **`AETHER-INTAKE`** (2026-10-20) | ledger record only (`AGENT.md:297`): intake routed to the Aether seat, nothing read, copied, planned or dispatched | no commit, no artifact, no closure record — and the same blueprint re-arrived with the work order as `POST87-APPLY` (`AGENT.md:378`), superseding it. **Not a unit.** |
| **Cluster 1 — S5 (docs)** | dispatched in parallel with S4 (`AGENT.md:365`) | no landing record, no commit, no gate report. Status **unknown** — a check that cannot be evaluated is a failed check, not a silent pass. |
| **Factory P1–P5** | closure records + artifacts on disk + quoted gates | **no commit of their own** (records say outputs were untracked; the next commit to capture any of their state is `c7c762c`, a V-REMEDIATE park, not a factory commit). §4's "each at its own commit, tree as it was" cannot be satisfied for these units without inventing a commit. |
| **V87 deliverable set** | four files on disk with verified identities; closure record | **uncommitted at closure** (`AGENT.md:270`, `:274`); the bytes exist, the release anchor does not. |
| **FULL-AUDIT R1 / R2** | closure records + quoted line counts | the report **text no longer exists** (overwritten in place twice); only the ledger record remains. |
| **`r2-tags`** (inside wave #1) | read-only proofs in `.opencode/audit/r2-tags/`; ledger record `AGENT.md:322` | the ordered act (probe-tag deletion) **was not performed** by that node; the wave closed with it open. The tags are absent live today, but that is a later owner-side fact, not this node's closure. |

---

## 7. What the backfill publish can and cannot do at these anchors

Recorded here because §4 of the ruling binds the publish lane, and these facts decide per-unit
feasibility:

1. **Commit anchors exist for:** P0 (`66d0e45`), V-REMEDIATE (`c7c762c`), POST87 Phase 0
   (`2b3e66a`), Phase-1 slice (`8312cae`), wave #2 (`f3ca04b` on `main`).
2. **No commit anchor exists for:** factory P1–P5, the three audit rounds, and the V87 mission.
   Their as-closed evidence is the ledger record plus on-disk artifacts — publishable only at a
   later commit (which is *not* "the tree as it was") or not at all. The owner must rule.
3. **The as-closed battery is not re-runnable at HEAD.** P0–V87 closed against
   `scripts/verify-kit.mjs` (22 checks); S3 retired that verifier and `kit/kit.lock`
   (`6c3852b`). Re-running "the as-closed battery" today is impossible; the honest record is the
   **quoted historical output** in the ledger, which is what §4's "never let today's battery block
   a historical release" anticipates.
4. **`main` does not carry Cluster 1.** `main` = `f3ca04b`; the eight lane commits from `6e5f55c`
   through `cb12407` are unpushed. Nothing in this map assumes they are on the release line.
5. **`CHANGELOG.md` records none of these units.** `[Unreleased]` carries exactly two entries
   (`CHANGELOG.md:10-26`: auto-publish, one-plugin consolidation). Historical section headings for
   0.7.5–0.7.7 still read `PARKED, UNRELEASED` (`V87-ENUM.md:296-299`) — stale labels, recorded,
   **not rewritten**; today's conventions do not rewrite history.
6. **Exactly one existing tag needs a naming note before any ascending publish:** `v7.5` is the
   real 0.7.5 release (`V87-ENUM.md:103`, `:299` D4). It sorts after `v0.7.7` lexically and before
   it semantically; the map's base is still `v0.7.7`, the newest tag by date and by the shipped
   series (`V87-ENUM.md:234`).

---

## 8. Handoff

- **Owner:** approve the map, or rule on §4 (OD-1…OD-8). OD-3 is the load-bearing one — it decides
  whether the mission is `0.8.0` (§1 arithmetic) or `0.8.7` (the named release in the owner's
  Part 2), and every post-mission number follows it.
- **Register/publish lane:** on approval, publish in ascending order, each at its own commit, with
  the scope + the as-closed evidence above and the gaps quoted as gaps. This lane publishes
  nothing, tags nothing, pushes nothing.
- **Kit-maintainer lane:** if the owner wants the stale CHANGELOG labels corrected, that is a
  forward-only edit with a dated note — never a rewrite of a historical tree.

---

## 9. Bounds observed

- Wrote exactly one file: `.opencode/audit/RELEASE-BACKFILL-MAP.md`. No other path was modified,
  staged or committed by this node.
- Zero tags created, zero pushes, zero merges, zero releases, zero publishes, zero force-ops.
- Zero invented tags or commits: every hash above was printed by `git show -s` / `git rev-list`
  in this session; every unit without a commit says "no commit".
- Zero secrets; zero model pins; zero color or routing-identity fields.
- Lint: reported in the return report with its actual runner and exit code — a check that cannot
  run is reported failed, not skipped.

**Routing used:** cheap path for tag/commit/date extraction and the closing-record sweep;
escalated reasoning only for four judgments — the slice/wave identity read against
`POST87-SLICE1.md:30`, the P4 held-gate exclusion, the `0.8.0`-vs-`0.8.7` conflict, and the
audit-rounds count.

Ponytail: curation spirit binding (FULL binds code-writing nodes only; this node wrote no code) —
evidence: 12/12 tags enumerated, 24/24 anchor commits date-stamped, 14 map rows (base + 13 numbered
units + the excluded P4 row) each tied to a ledger line or a commit, 8 borderline calls flagged
rather than decided, one artifact written, zero drift repaired, zero publishes.
