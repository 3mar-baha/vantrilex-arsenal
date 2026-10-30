# LD-22 Weekly harvest, live (0.9.22)

Lane: build-release (AUTO-0.9-FULL 0.9.22 ONLY, never 0.9.23).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4977-5129` (slot heading `0.9.22 — The weekly harvest, live`).
Slot identity: LD-22 — Slot 0.9.22 — The weekly harvest, live.
Status: mechanism definition, full live cycle. Nothing here publishes beyond the branch, sends outward, or activates anything.

## 1. What this mechanism is

Field proposals accumulate into a burden when there is no method, or they get
accepted by impression and corrupt the product. This slot stops both by running
the weekly harvest as a live method, not a habit: the same steps every week —
intake, dedupe, diversity-weighted grouping and ranking, capped study packs,
owner ruling, gates (including the counter-result gate), landing, attribution,
and a counter-report that reaches the submitters. No proposal enters without a
written trace, and none leaves without one.

The harvest itself is a workflow component with its own name, subject to the
same category gates it operates under. A harvest exempt from its own gates is
a harvest above the law, and above the law there is no component. The probe
(`verify-weekly-harvest-0922.mjs`) re-runs every claim below; a claim the probe
cannot recompute is prose, not a claim.

FBLD-22 carried verbatim (never resolved, never a blocker here):

`FBLD-22 — Slot 0.9.22 — Conflict: V3 slot scope versus R4 POST87 global-scope empty-cell collision — Fallback: carry the item forward exactly as listed — Matches LD-22 — Status FLAGGED, never resolved.`

## 2. The full cycle, in order

1. **Intake.** Box submissions are received and recorded. Arrival is not
   acceptance: a received proposal is not an accepted one, and confusing the
   two cancels every gate at once.
2. **Dedupe.** Duplicates are removed before grouping. Grouping without dedupe
   groups noise, and noise consumes study.
3. **Group and rank (diversity-weighted).** Proposals are grouped, then ordered
   for study only. Support counts are weighted by diversity: many distinct
   installs weigh more than many reports from one install, because repetition
   from a single source is one echo, not broad support. The diversity weight is
   declared before ranking, never after. Ranking decides study order only;
   acceptance comes only from gates plus counter-result evidence — popularity
   ranks, gates accept.
4. **Study packs (capped).** At most `MAX_PACKS = 3` packs per week. Each pack
   carries its proposals, their evidence, and their sources. The cap is a
   rhythm guard and a ceiling, never a goal: fewer packs than the cap is
   success, not shortfall, and reaching for the cap misunderstands the guard.
   A pack is a study pack, not an acceptance pack: inclusion in a pack accepts
   nothing.
5. **Owner ruling on packs.** The owner rules on each pack, opening study. The
   ruling precedes the gates and never replaces them: a ruling opens study,
   the gates decide acceptance afterward.
6. **Gates on the ruled, including the counter-result gate.** No acceptance
   without a gate, no gate without a ruling. The counter-result gate runs on
   every ruled proposal: acceptance needs counter-result evidence, never
   impression, never popularity.
7. **Landing of the accepted.** Accepted proposals land.
8. **Attribution to source.** Every landing names its source. Landing without
   attribution is landing without a trace.
9. **Counter-report that reaches.** A dispositions report goes to the
   submitters themselves: what arrived, what was studied, what was accepted
   with its evidence, what was rejected with its reasons, what was deferred
   with its review date. A report written but never delivered teaches nobody;
   delivery is logged per submitter.

## 3. Strict rules and the enemy each one guards

- **Capped packs** guard the owner's time: depth in few packs beats surface
   across many. Enemy: the flood that turns review into skimming.
- **Diversity-weighted ranking** guards acceptance against popularity. Enemy:
   the single-install echo mistaken for broad support.
- **Rank-never-accepts** guards the gate monopoly on acceptance. Enemy: the
   top-ranked proposal smuggled into acceptance without evidence.
- **Evidence rule, applied automatically**: every proposal carries its kind,
   its check, and its observed behavioral difference. No proposal without all
   three enters study. A claimed difference without observation is a claim,
   not evidence. Enemy: the unevidenced proposal consuming study.
- **Every payload is untrusted input carrying instructions**: schema-validated,
   scanned, trialed in isolation, and human-read — all four layers, each with
   its own log. One passing layer proves nothing; the four together are the
   proof. Enemy: the innocent-looking payload accepted on appearance.
- **Auto-acceptance refused by name**: the machine proposes and proves; the
   gates and the owner decide. A decision by the machine is auto-acceptance,
   however correct it looks. Enemy: the efficient machine that cancels gates
   and owner together.
- **Harvest self-gating**: the harvest workflow component passes the category
   gates like any workflow, with its record. Enemy: the governor above its
   own law.

## 4. Dispositions ledger

Every proposal ends in exactly one recorded disposition:

- `accepted` — with its evidence (kind, check, observed difference,
  counter-result).
- `rejected` — with its reasons, so the record teaches submitters what merit
  means. Rejection without a reason punishes without teaching.
- `deferred` — bound to a review date. A deferral without a date is a
  deferral into oblivion; the date is binding, not a suggestion, and lapsing
  it silently cancels the meaning of deferral.

The ledger is read by submitters: a ledger nobody reads teaches nothing,
however complete its archive. Deferred stock is reviewed on its dates, so the
ledger never becomes an unopened archive.

## 5. Self-repair overlay verdicts

The harvest feeds the weekly self-cycle and decides the fate of self-repair
overlays: an overlay that survives the gates ships, one that does not dies —
each by recorded decision, never by silence. An overlay without a decision is
an overlay pending, and pending is not a decision however long it lasts.

## 6. Exit criteria (each re-proven by the probe)

- E1: a complete cycle executed — intake through counter-report — with a
  published dispositions report.
- E2: a rejected entry recorded with its reasons, and an accepted entry bound
  to its evidence.
- E3: a deferred entry bound to its review date; no disposition without a
  record.
- E4: capped study packs, each with proposals, evidence, and sources, with a
  recorded owner ruling per pack.
- E5: a counter-report delivered to the submitters, delivery logged.
- E6: the harvest component itself passed through the category gates, proven
  by its record.
- E7: at least one payload treated as untrusted input across all four layers,
  with a log per layer.

## 7. Open questions (all OPEN, none decided here)

- Q1: the exact pack cap number and how the cap is set without becoming a goal.
  Safe default: `MAX_PACKS = 3`, fewer is success.
- Q2: the exact diversity measure — how diversity is computed from distinct
  installs. Safe default: distinct-install count times ten plus report count,
  declared before ranking.
- Q3: how a payload failing exactly one untrusted layer is handled — whole
  rejection or single-layer retry. Safe default: hold the whole payload
  visible until a human decides.
- Q4: how a deferred item's review date moves when packs shift — kept, or
  rescheduled, and by whom. Safe default: the date is binding; only the owner
  moves it, in writing.

## 8. Install honesty

- harvest-cycle: `install_cmd: null`, `verification: unverified` (no registry
  proof exists for a harvest install path; nothing is invented to fill the gap).
- No install command appears anywhere in this slot. A null plus `unverified`
  beats a plausible-looking wrong command, because an agent will run it.

## 9. Close rule

Closure needs the full cycle plus a published report plus a payload across all
four layers together. A cycle missing the counter-report, or a payload missing
one layer log, keeps the slot open — however successful the remaining steps
look. The R4 POST87 collision stays FLAGGED per FBLD-22; this slot carries the
item exactly as listed and resolves nothing.
