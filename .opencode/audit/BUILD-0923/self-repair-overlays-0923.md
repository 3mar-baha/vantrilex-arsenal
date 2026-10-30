# LD-23 Self-repair overlays (0.9.23)

Lane: build-release (AUTO-0.9-FULL 0.9.23 ONLY, never 0.9.24).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5130-5283` (slot heading `0.9.23 — Self-repair overlays`).
Slot identity: LD-23 — Slot 0.9.23 — Self-repair overlays.
Status: mechanism definition, working-copy-only. Nothing here edits the shipped installed product.

## 1. What this mechanism is

An agent that finds the method it is executing defective gets a limited, local power to adapt:
it lays an overlay over its own working copy, records what it did, and continues. The overlay is a
documented adaptation, never a silent fix. The limitation is the slot, not a constraint on it: the
adaptation touches the working copy only and never the shipped installed product, because the gap
between working copy and installed is the gap between adapting and corrupting.

An agent without adaptation power stops at the first defect; an agent without limits corrupts the
product with good intentions. The classified, recorded overlay is what prevents stopping and
corrupting together.

The probe (`verify-self-repair-overlays-0923.mjs`) re-runs every claim below; a claim the probe
cannot recompute is prose, not a claim.

## 2. The strict rule: no overlay without an outbox write, mechanically

No overlay without writing to the outbox first, and the prevention is mechanical, not moral.
A forbidden thing may be broken through; a mechanically impossible thing cannot be broken through
by intention or by forgetting. If the write was not written first, the overlay is impossible, not
merely forbidden.

The gate is structural: `applyOverlay` requires an `outboxSeq` that names an outbox entry already
appended. No seq, or a seq naming no entry, and the apply throws before touching anything. The
probe proves this with a real failed attempt, not with an instruction to behave.

A write that arrives after the apply does not cure the apply: the apply already threw, and the
late write is a new submission, never a retroactive license.

## 3. The four classes, each with examples and limits, before any execution

No overlay is classified while it is being applied. Every overlay declares its class, its limits,
and its example at write time; an overlay without a class is refused, and a class without limits
is refused.

### 3a. Silent, records only

Repairs nothing, notifies nobody; it records the defect and moves on, so the record itself is the
effect. A silent overlay that repairs is a silent thing exceeding its class, and the excess is a
class breach, not diligence.

- Example (proven in probe): a flaky retry counter on a workflow step is observed once; the
  overlay appends a `defect-report` submission and changes no step behavior.
- Limits: zero behavior change; zero notification; one occurrence is an incident, recorded as a
  defect report, never as a repair candidate.

### 3b. Correcting-with-notice, repairs and notifies together

Local repair with a recorded notice, so the repair is never silent and the notice is never absent.
Repair without notice is a silent repair; notice without repair is not a correcting overlay.

- Example (proven in probe): a misordered local fallback chain on the agent's own working copy is
  reordered AND a notice entry is logged with the reason; either half missing and the apply throws.
- Limits: the agent's own working copy only; never the installed product in place; repair and
  notice are one atomic apply, never two separate chances.

### 3c. Propose-only, never executed as an overlay

A change of this class executed as an overlay is refused and converted to a submission only, with
the refusal and the conversion both logged. No exception on grounds of usefulness: usefulness
never justifies crossing the class.

- Example (proven in probe): a suggested step reorder marked propose-only is offered to
  `applyOverlay`; the apply throws `propose-only-refused-as-overlay`, appends the suggestion as an
  outbox submission, and logs both the refusal and the conversion.
- Limits: proposal text only; execution is always out of bounds for this class.

### 3d. Forbidden, refused never classified

Editing the installed product in place, suppressing a repair log, or repairing an install the
agent did not itself perform: each is corruption in the name of repair, and each is refused, not
classified.

- Example (proven in probe): `editInstalledInPlace` throws;
  `suppressRepairLog` throws and the log stays intact; `repairForeignInstall` throws.
- Limits: there are no limits to state because there is no allowed use; the only correct handling
  is refusal plus a logged refusal.

## 4. Installed-hash protection at start, overlays present

The installed tree has its hashes; the check at start measures against them, never against a
supposition. With overlays present the check matters more, not less, because divergence beside
overlays is what must be caught. Any divergence is detected and never bypassed: there is no
skip flag, and a bypass attempt throws.

- Proven in probe: matching hashes at start with overlays present pass; a tampered installed file
  is detected; a bypass attempt is refused.

## 5. Expiry on parent-version change: lessons remain, mutations do not

Overlays end when the parent version changes, without exception: one exception opens the door for
mutations to persist, and one persisting mutation is drift. The end is collective: a parent change
ends every overlay, not one overlay. The overlay record stays after its end; ending an overlay
never erases its log. Lessons stay in the outbox and the harvest; mutations do not stay anywhere.

- Proven in probe: a parent-version advance ends all overlays and working files return to base,
  while the lessons list and the outbox entries survive.

## 6. Kill switch: stop returns to the working copy without overlay

Stopping overlays stops the adaptation, not the agent. A stop returns the agent to the working
copy without overlay and logs the stop with its reason. The switch is tested by stopping, not
described as stoppable: overlays are actually stopped and the agent is actually without overlay.

- Proven in probe: `stopOverlays` with a reason clears every overlay, restores base content, and
  appends a stop entry carrying the reason.

## 7. Detection-trigger calibration: incident versus pattern

One occurrence is recorded as a defect report; a pattern is a repair candidate. The boundary
between them is an open calibration, not a ruling of this slot: a single case handled as a
pattern wastes repair on the transient, and a pattern handled as a single case neglects the
recurrent. The probe fixes a working threshold (1 = incident, 3 same-signature = pattern
candidate) as a measurement instrument only; the threshold itself stays OPEN (see section 10,
Q1). A candidate passes through the harvest and the gates; repetition alone never ships anything.

## 8. Harvest feed: overlays feed the harvest with field-proven candidates

Every overlay is a repair candidate reaching the harvest; the harvest decides shipment or death
through the gates. A candidate that survives the gates is a shipment candidate, not a shipment;
shipment is a harvest decision afterwards. A candidate that fails the gates dies as a candidate;
its death as a candidate never cancels its lesson, and the lesson remains.

## 9. Inspectable result state and close rule

The result is an inspectable state: an overlay without a prior write is mechanically impossible;
a propose-only change as an overlay is refused and converted; installed hashes match the index at
start with overlays present.

Closure needs all three together (V3:5262, V3:5188): impossibility without a write, propose-only
refusal, and matching hashes at start. Any one missing keeps the slot open.

## 10. Open questions V3:5240-5245 — all six CARRIED OPEN with safe defaults

None of the six is decided here. Each is recorded OPEN with the exact V3 question and the safe
default that holds until a later ruling. The probe checks that all six are recorded OPEN and that
the defaults hold.

- Q1 (V3:5240) OPEN: detection-trigger calibration — one case is an incident, a pattern is a repair
  candidate, and where the boundary sits, and how it is calibrated.
  Safe default: 1 = incident defect-report; repetition alone never promotes without the harvest.
- Q2 (V3:5241) OPEN: how overlay benefit is measured before the harvest decides shipment or neglect,
  and by which measure.
  Safe default: benefit without measurement is a claim — no shipment claim without a recorded
  comparison against no-overlay and against other overlays.
- Q3 (V3:5242) OPEN: how an overlay that proved locally useful but failed the gates is treated —
  whether it dies or stays local, and who decides.
  Safe default: dies as a candidate; lesson remains; nobody keeps it alive locally as a shadow.
- Q4 (V3:5243) OPEN: the bounds of the correcting-with-notice class — which repair is allowed
  locally, and which repair crosses from correction into editing.
  Safe default: own working copy only, repair-plus-notice atomically, installed Product never.
- Q5 (V3:5244) OPEN: how the kill switch is managed with several overlays present — whether one
  stop or a collective stop, and in which order.
  Safe default: collective stop on parent change (all overlays end); single stops log their own
  reason each.
- Q6 (V3:5245) OPEN: how lessons are kept after overlays end — whether as independent submissions
  or as part of the ended overlay's log.
  Safe default: both — the ended overlay's log stays, and each lesson is also an outbox entry
  reachable by the harvest.

## 11. What lands

- Overlays on the working copy only, in four classes: silent, correcting-with-notice,
  propose-only, forbidden — each with examples and limits before any execution.
- Mandatory outbox write before any overlay, mechanical: without a write there is no apply, not
  merely forbidden but impossible, proven by a real failed attempt.
- Kill switch plus expiry on parent-version change, with lessons in the outbox and the harvest.
- Installed-hash protection at start with overlays present; any divergence detected, never
  bypassed.
- Refusal of a propose-only change as an overlay, converted to a submission only, refusal plus
  conversion logged.
- Detection-trigger calibration: one case an incident, a pattern a candidate, the boundary an
  open calibration.
- Overlay benefit measured before the harvest decision; harvest feeds on field-proven candidates.

## 12. Fallback carried

FBLD-23 — Slot 0.9.23 — Conflict: V3 slot scope versus R3 autofix proposal — Fallback: fix text in findings only, apply is a second dispatch — Matches LD-23 — Status FLAGGED, never resolved.

This slot builds no automatic fix and applies nothing by itself. Every repair described here is a
finding text carried in the outbox submission; the apply of any finding is a second dispatch,
never this slot. The R3 autofix pressure is carried as the flagged conflict and is never resolved
here: precedence goes to the fallback (fix text in findings only, apply is a second dispatch).

LD-23 — Slot 0.9.23 — Self-repair overlays — Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5130`), carried as data — Conflict FLAGGED: V3 slot scope versus R3 autofix proposal — Fallback LD-23: fix text in findings only; apply is a second dispatch — Not resolved.

## 13. Install honesty

install_cmd: null. Verification: unverified — this mechanism cites no registry component and
proves no install path, so there is nothing to install and no command to give. No fetched
toolchain, no added package, zero dependencies (node standard library only).
