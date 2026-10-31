# Gap register — LD-28 acceptance system (0.9.28)

Doctrine: FULL

Lane: build-release (AUTO-0.9-FULL 0.9.28, twenty-eighth of 33; this file covers
0.9.28 ONLY, never 0.9.27 or 0.9.29). Node: b0928-build.
Date (UTC): 2026-10-31. No model pin.
Authority: sole-authority V3:5902-6055 (treatment + exit criteria + open
questions, carried as data); fallback FBLD-28 carried verbatim in section 9
(carry zero-match verbatim, never widened — never resolved).
Scope: this file defines the live register. The executable proof is
`scripts/verify-gap-register.mjs` (twenty-two checks, exit 0 PROCEED).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Unified live register (one register, four origins, origin preserved)

The register unifies what was scattered — platform log, defect log, field
signals, failure log — into one register with unified entries and unified
evidence links (V3:5916). Unification starts with an inventory of what logs
exist, what their entries are, and what their evidence links are (V3:5949).
Every entry preserves its origin, because an entry without an origin can be
neither reviewed nor closed with evidence (V3:5995).

An entry is admitted only when all six hold together (V3:6021):

1. **Id.** Stable entry id (`G-`, `D-`, `F-`, `C-`, `P-`, `X-`, `B-`, `EV-`).
2. **Kind.** `weakness` (a place that can break, V3:5922), `stale-component`
   (overtaken by time or a changed surroundings, V3:5923), or
   `unpatched-defect` (a known defect not yet fixed, V3:5924).
3. **Origin.** One of `platform`, `defect`, `field`, `failure` — carried on the
   entry forever (V3:5950, V3:5995).
4. **Scope.** The planning scope the entry touches; the compiler feeds an entry
   into a task plan only when scopes intersect (V3:5959-5960).
5. **Evidence links.** One or more reachable links, each resolvable from the
   entry itself to a specific line — never a general pointer at a source that
   proves nothing (V3:5985-5986).
6. **Status.** `OPEN`, `CLOSED`, `CONFLICTING`, or `RECLASSIFIED` (with pointer).

Entering an entry with evidence links is a technical condition of the register,
not a style recommendation (V3:5954). A convincing entry without evidence is
refused no matter how convincing, because persuasion is not evidence (V3:5955,
V3:5946). The register refuses the write: `REFUSED-ENTRY-WITHOUT-EVIDENCE`
(checks `refuse-empty-evidence`, `refuse-null-evidence`).

Seed entries (W1 first population; V3 is the sole authority for seed facts):

### G-01 — planning from memory, re-discovery of the known

- kind: weakness. origin: platform. scope: 0.9-series routine planning.
  status: OPEN. readiness: READY.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5934`
  (V3:5934 decides the fact: a planner without a register plans from memory and
  impression and re-discovers what was discovered).
- routine plan: open the register, filter scope `0.9-series routine planning`,
  plan the item from the READY entries alone.

### G-02 — scattered logs force a four-place search before each decision

- kind: weakness. origin: platform. scope: 0.9-series routine planning.
  status: OPEN. readiness: READY.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5915`
  (V3:5915 decides the fact: the scattered register forces the planner to search
  four places before each decision, and repeated search wastes decision time).
- routine plan: query this unified register alone (check
  `register-searchable-alone`); no return to the old scattered logs.

### D-01 — failure memory scattered across per-release audit dirs, no unified log

- kind: unpatched-defect. origin: defect. scope: regression memory.
  status: OPEN. readiness: NEEDS-SEARCH.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5949`
  (V3:5949 decides the rule: unification starts with the inventory of existing
  logs); corroborating artifact
  `.opencode/audit/BUILD-0927/b0927-build.md:1` (the per-release audit ledger
  exists in exactly the scattered form the entry records).
- note: NEEDS-SEARCH because the full inventory of scattered failure logs is
  not yet counted; the entry must not be treated as READY (V3:5992).

### F-01 — field signals have no register home at 0.9.27 tip

- kind: weakness. origin: field. scope: field-signal intake.
  status: OPEN. readiness: READY.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5911`
  (V3:5911 decides the rule: box and harvest field signals all enter the same
  register — the register is their decided home).
- routine plan: file every box/harvest signal as a field-origin entry here, or
  refuse it (V3:5946).

### C-01 — LD-27 eval-packs category gap, closed with evidence (never deleted)

- kind: stale-component. origin: failure. scope: 0.9.27 eval packs.
  status: CLOSED.
- close-evidence: `.opencode/audit/BUILD-0927/b0927-build.md:1`
  (the landed LD-27 build ledger) and
  `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5983` (the close rule);
  the entry stays in the register with its close evidence and is never
  deleted, because deletion erases the regression memory the register exists
  to keep (V3:5983-5984).
- rule carried: an ended entry no longer plans anything, but it is closed with
  its close evidence, never deleted, because deletion erases the regression
  memory the register exists to keep (V3:5983-5984).

### P-01 — partially patched defect, reclassified (kept, pointed, not left as-was)

- kind: unpatched-defect. origin: defect. scope: register hygiene.
  status: RECLASSIFIED. reclassified-to: G-04.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5998`
  (V3:5998 decides the rule: the partially patched defect is reclassified, it
  does not stay an entry as it was before the partial patch).
- rule carried: the old row stays with its pointer to G-04; it is neither
  closed nor left as-was (check `partial-patch-reclassified`).

### G-04 — residual weakness after the P-01 partial patch

- kind: weakness. origin: defect. scope: register hygiene.
  status: OPEN. readiness: READY.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5998`
  (same deciding line: the residual is the reclassified remainder).
- routine plan: plan the residual from this entry alone.

### X-01 — conflicting field-signal fixture (first of the pair)

Modeled fixture demonstrating the recording rule (not a field fact; labeled as
a fixture so nothing invented enters the register as fact): field signal —
"weekly watch cadence is sufficient". origin: field. status: CONFLICTING.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5997`
  (V3:5997 decides the rule: conflicting field signals are recorded
  conflicting, never silently resolved by picking one and hiding the other).

### X-02 — conflicting field-signal fixture (second of the pair)

Modeled fixture demonstrating the recording rule (not a field fact; labeled as
a fixture so nothing invented enters the register as fact): field signal — "a
watched source changed mid-week; the weekly cadence missed it". origin: field.
status: CONFLICTING.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5997`
  (same deciding line V3:5997).
- rule carried for the pair: neither fixture is marked resolved; both stay
  CONFLICTING until a third evidence decides between them (check
  `conflicting-pair-recorded`).

### B-01 — regression link: current break to a similar recorded prior break

- B-01: break fixture — "LD-28 planning re-listed scattered sources before the
  unified register existed". origin: failure. linked-prior: G-01.
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5940`
  (V3:5940 decides the mechanism: written regression memory breaks the loop by
  linking the new break to a recorded old one) and
  `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:6001` (V3:6001 decides the check:
  regression memory is checkable from a break to a similar prior break, not a
  general failure log).
- rule carried: from B-01 the reviewer reaches G-01 without searching the old
  scattered logs (check `regression-memory-linked`).

### EV-01 — overrun recorded as event (modeled demonstration)

- EV-01: overrun-as-event — source S-02 exceeded its declared budget in cycle
  1; recorded here as an event with id, source, and cycle, never passed
  silently (V3:5953, V3:5982, V3:5988).
- evidence: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5988`
  (V3:5988 decides the rule: every budget/schedule overrun is recorded as an
  event so overrun never becomes a silent habit).
- status: event-recorded. No silent overrun exists in this register (check
  `overrun-recorded-as-event`).

## 2. First watch-list (declared, limited, budgeted, scheduled)

The first watch-list is fixed and limited, because an endless list is not a
list (V3:5951). The top sources are exactly the V3-named ones: the host
changelog, component sources, and the platform-knowledge skill (V3:5910), plus
box/harvest field signals (V3:5911). Every source carries a declared budget and
a declared schedule before watching starts, never fixed after spending
(V3:5952, V3:5987). Deferred: every other candidate source stays off the list
until W2 (open question V3:6027 decided).

| Source | Watches | budget: | schedule: | state: |
|---|---|---|---|---|
| S-01 | host changelog | budget: 30 min per cycle | schedule: Monday 09:00 UTC | state: watching |
| S-02 | component sources | budget: 45 min per cycle | schedule: Monday 09:30 UTC | state: watching |
| S-03 | platform-knowledge skill | budget: 20 min per cycle | schedule: Monday 10:15 UTC | state: watching |
| S-04 | box/harvest field signals | budget: 30 min per cycle | schedule: Friday 15:00 UTC | state: watching |

Four sources, all `watching`, all with budget+schedule declared before the
first watch (checks `watchlist-limited`, `source-budget-schedule`). Any source
without a budget and a schedule does not exist on this list, no matter how
important it seems (V3:6022).

## 3. Periodic gap report R-01 (ordered by planning-readiness)

Report R-01 is ordered by fitness for routine planning, not by volume (V3:5981):
READY items first, NEEDS-SEARCH items flagged as such (V3:5991-5992). The order
is checkable, never differing with the orderer (V3:5990). R-01 ships on its
announced date, because a late report cannot anchor routine planning (V3:5989).

R-01 items:

1. READY — G-01 (evidence in entry; scope `0.9-series routine planning`;
   routine plan: filter register by scope, plan from READY entries alone).
2. READY — G-02 (evidence in entry; scope `0.9-series routine planning`;
   routine plan: query this register alone, no old-log return).
3. READY — F-01 (evidence in entry; scope `field-signal intake`;
   routine plan: file signals here or refuse them).
4. NEEDS-SEARCH — D-01 (flagged NEEDS-SEARCH: scattered-failure inventory not
   yet counted; must not be treated as READY).

Planning record PR-01: two routine items were planned from R-01 alone with
zero-extra-search (check `planning-record-proves-routine`): (a) the S-01 weekly
watch plan from G-02; (b) the field-signal filing plan from F-01. A report
nobody plans from is a summary, not a report (V3:6003); the planner who plans
from the report alone reaches a routine plan, otherwise the report missed its
purpose (V3:6002).

Cycle-2 note (open question V3:6043 decided): the cycle's second report is not
a duplicate report — it is `R-01-C2`, an abridged-cross-reference to R-01 plus
the cycle delta only.

## 4. Compiler feed (proven by a real task, never by claim)

The compiler reads the register when planning; the planner does not remember to
read it (V3:5958). An entry in a task's scope enters that task's plan
automatically (V3:5959); an entry outside the scope stays out, so plans do not
bloat (V3:5960). The feed is checked with a real task (V3:5993).

Real task T-01: "plan the 0.9.28 S-01 weekly watch from R-01 alone". Scope:
`0.9-series routine planning` + `S-01 watch`. Feed result: G-01 and G-02 enter
the T-01 plan (scope intersect); X-01 stays out (field-cadence scope, no
intersect — the plan must stay free of gaps that are not its own, V3:5994).
Check `compiler-feed-real-task` proves both directions.

## 5. Regression memory (close-by-evidence, never delete)

The failure log is unified in this register (V3:6024): C-01 is the closed
failure-log entry, B-01 is the break-to-prior-break link. Memory is written,
not spoken (V3:5913): from any break the reviewer reaches the similar recorded
break (check `regression-memory-linked`). Updated stale components close with
update evidence (V3:5999); fixed weaknesses close with fix evidence (V3:6000);
both stay in the register with their close evidence.

## 6. Exit-criteria coverage (all 16 V3 criteria COVERED)

First set V3:6020-6025:

- V3:6020 (periodic gap report exists; planner plans routine items from it
  without extra search) — COVERED: R-01 §3 with planning record PR-01
  (`zero-extra-search`); harness `planning-record-proves-routine`.
- V3:6021 (every entry carries evidence links; no entry without evidence
  exists) — COVERED: §1 six-part formula, technical refuse
  `REFUSED-ENTRY-WITHOUT-EVIDENCE`; harness `entry-evidence-present` +
  `zero-entry-without-evidence`.
- V3:6022 (no watched source without budget+schedule, however important) —
  COVERED: §2 table, all four rows budgeted+scheduled before watching; harness
  `source-budget-schedule` + `watchlist-limited`.
- V3:6023 (relevant entry enters its task plan, proven by check not claim) —
  COVERED: T-01 §4 both directions; harness `compiler-feed-real-task`.
- V3:6024 (failure log unified; regression memory checkable entry-to-prior) —
  COVERED: C-01 + B-01 §1/§5; harness `closed-entry-with-evidence` +
  `regression-memory-linked`.
- V3:6025 (budget/schedule overrun recorded as event, never silent) —
  COVERED: EV-01 §1; harness `overrun-recorded-as-event`.

Second set V3:6045-6054:

- V3:6045 (at least one periodic report plans routine items, with a planning
  record proving it) — COVERED: R-01 + PR-01 §3; harness
  `planning-record-proves-routine`.
- V3:6046 (one real task whose plan includes a relevant entry, proven by
  check) — COVERED: T-01 §4; harness `compiler-feed-real-task`.
- V3:6047 (every evidence reachable from its entry; no general evidence) —
  COVERED: anchored `path:line` links only (§8 bar); harness
  `evidence-reachable` (live file+line resolve) + `evidence-anchored`.
- V3:6048 (every watched source has declared budget+schedule before watching;
  none unbounded) — COVERED: §2; harness `source-budget-schedule`.
- V3:6049 (at least one closed entry preserved with close evidence; neither
  deleted nor left open) — COVERED: C-01 §1; harness
  `closed-entry-with-evidence`.
- V3:6050 (two conflicting signals recorded conflicting; no silent
  resolution) — COVERED: X-01/X-02 §1, both CONFLICTING, none resolved;
  harness `conflicting-pair-recorded`.
- V3:6051 (unified register searchable alone; no return to old scattered
  logs) — COVERED: G-02 routine plan + §3; harness
  `register-searchable-alone`.
- V3:6052 (every budget/schedule overrun recorded as event; no silent
  overrun) — COVERED: EV-01 §1; harness `overrun-recorded-as-event`.
- V3:6053 (regression memory checked: break linked to similar prior break,
  with link evidence) — COVERED: B-01 → G-01 §1; harness
  `regression-memory-linked`.
- V3:6054 (first watch-list declared and limited; every source has a known
  watch state) — COVERED: §2 four sources, all `watching`; harness
  `watchlist-limited`.

## 7. Open-question dispositions (all 19 V3:6026-6044 DECIDED inside W1)

- V3:6026 (per-source budget + recalibration when source activity changes) —
  DECIDED: budgets fixed in §2 before watching; recalibration is itself an
  EV-recorded event with old and new budget stated, never a silent edit.
  Evidence: §2 table; harness `overrun-recorded-as-event`.
- V3:6027 (first watch-list membership vs deferral) — DECIDED: exactly S-01..
  S-04 (the V3:5910-5911 named sources); everything else deferred to W2.
  Evidence: §2; harness `watchlist-limited`.
- V3:6028 (how an entry closes; close evidence preserving regression memory)
  — DECIDED: close appends close-evidence to the row and flips status to
  CLOSED; the row stays (C-01 pattern). Evidence: C-01 §1; harness
  `closed-entry-with-evidence`.
- V3:6029 (report ordering by planning-readiness; who decides ready) — DECIDED:
  readiness is an entry field set at admission against the §8 bar, and R-01
  sorts READY before NEEDS-SEARCH; the order is checkable (§3). Evidence: §3;
  harness `report-ordered-by-readiness`.
- V3:6030 (convincing entry without evidence: holding pen vs final refuse) —
  DECIDED: final refuse — no holding pen exists, because a pen of unevidenced
  entries is a rumor shelf with a kinder name (V3:5907). Evidence: §1 refuse
  rule; harness `refuse-empty-evidence`.
- V3:6031 (measuring report fitness for routine planning; proof of no extra
  search) — DECIDED: planning record PR-01 counts routine items planned and
  extra searches run (must be zero). Evidence: §3 PR-01; harness
  `planning-record-proves-routine`.
- V3:6032 (managing conflicting field signals) — DECIDED: record both
  CONFLICTING with their evidence; no silent resolution (X-01/X-02 pattern).
  Evidence: §1; harness `conflicting-pair-recorded`.
- V3:6033 (top-source boundaries; promotion/demotion rule) — DECIDED: a source
  is top while its change can change planning; demotion/promotion is a
  register entry with evidence, effective next cycle only.
  Evidence: §2 states; V3:5910 names the v1 boundary.
- V3:6034 (preserving entry origin at unification) — DECIDED: origin is a
  mandatory entry field carried forever (V3:5995). Evidence: §1 formula;
  harness `origin-preserved`.
- V3:6035 (partially patched defect: stays, closes, or reclassified) —
  DECIDED: reclassified with pointer (P-01 → G-04); never stays as-was, never
  closes while residual remains. Evidence: P-01/G-04 §1; harness
  `partial-patch-reclassified`.
- V3:6036 (recording conflicting signals; who decides planning entry) — DECIDED:
  both signals stay recorded CONFLICTING; neither enters planning until a
  third evidence decides — the decider is evidence, never a person picking a
  favorite. Evidence: X-01/X-02 §1; V3:5997.
- V3:6037 (evidence sufficiency bar; proving vs merely indicating) — DECIDED:
  sufficient = the link resolves from the entry to the exact line that decides
  the claimed fact (proving); a link to a whole file or a tangential mention
  only indicates and does NOT satisfy admission (§8). Evidence: §8;
  harness `evidence-reachable` + `evidence-anchored`.
- V3:6038 (source repeatedly over budget: suspend vs recalibrate) — DECIDED:
  two consecutive EV-recorded overruns suspend the source to `suspended`
  pending owner recalibration; recalibration is a new declared budget, never a
  quiet raise. Evidence: §2 states + EV-01 §1.
- V3:6039 (who reviews the register; cadence against stale buildup) — DECIDED:
  the release lane reviews the register every cycle before cutting R+1; any
  entry whose effect ended is closed per V3:6028 in the same review.
  Evidence: §5; C-01 is the worked example.
- V3:6040 (proving the periodic report is actually planned from) — DECIDED:
  only the planning record proves it (PR-01 with zero-extra-search); planner
  testimony alone proves nothing. Evidence: §3; harness
  `planning-record-proves-routine`.
- V3:6041 (box/harvest signal boundaries; signal vs register evidence) —
  DECIDED: a box/harvest item is a signal (field origin, admitted on the V3
  rule link); it becomes register evidence only when it decides an entry's
  fact at a specific line. Evidence: F-01 §1; §8 bar.
- V3:6042 (gap fit for routine planning but needing a non-routine decision) —
  DECIDED: it ships as NEEDS-SEARCH with the non-routine decision named
  (D-01 pattern); routine fitness never smuggles a non-routine call.
  Evidence: D-01 §1; §3 item 4.
- V3:6043 (is the cycle's second report the same report or an abridged copy)
  — DECIDED: neither a duplicate nor a rewrite — `R-01-C2`, an
  abridged-cross-reference to R-01 plus the cycle delta only. Evidence: §3
  note; harness asserts the `R-01-C2` + `abridged-cross-reference` tokens.
- V3:6044 (preserving origin technically; unbreakable link on move) — DECIDED:
  origin travels inside the entry row (not a side index), and evidence links
  are `path:line` anchors resolved live by the harness — a moved entry keeps
  its origin, and a moved target file fails the gate loudly instead of
  pointing nowhere. Evidence: §1 rows; harness `origin-preserved` +
  `evidence-reachable`.

## 8. Evidence bar (what counts as proving)

A proving link resolves from the entry to the exact line that decides the
claimed fact; V3 lines are the sole authority for seed facts, so a V3 line
that decides the fact proves it. An indicating link (whole-file pointer,
tangential mention) does not satisfy admission. Every link in §1 is an
anchored `path:line` link; the harness resolves each one live against the
tree (file must exist, line must be in range) and refuses any entry without
one. Corroborating artifact links (e.g. the b0927-build.md:1 ledger proving
the scattered per-release form) strengthen but never substitute the deciding
line.

## 9. FBLD-28 (carried verbatim, never resolved)

FBLD-28 — Slot 0.9.28 — Conflict: V3 slot scope versus R2 deepdive zero-match scope — Fallback: carry zero-match result verbatim — Matches LD-28 — Status FLAGGED, never resolved.

Provenance (honest, not a second copy): the dispatch brief names the conflict
(`vs R2 deepdive zero-match scope`) and the fallback shape (`carry zero-match
verbatim`, FBLD-28 line); the full entry above is carried from
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:40` verbatim —
that file is not in this commit's tree (parallel-lane path, read per may-read),
so it is quoted here as text, not linked as resolvable evidence. V3 gate text
wins on any conflict; the zero-match result is carried exactly as found, never
widened into a scope this node does not own.

## 10. Install honesty (null + unverified, nothing invented)

This node adds no installable component. Every `install_cmd` touched by this
node is `null` with `verification: unverified` where unprovable. Zero
registry/catalog/sidecar writes on this node.
