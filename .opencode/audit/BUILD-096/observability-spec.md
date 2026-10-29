# LD-06 observability, tracing and cost-governance — spec (0.9.6)

Lane: build-release (AUTO-0.9-FULL 0.9.6) · Node: b096-build (wave 2 of 10) · Owner: vantrilex-typescript
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md` lines 3422–3470 (LD-06 treatment, Arabic original).
Scope is implemented from that treatment only; nothing is re-derived here.

## 1. Problem

Task cost arrives as one opaque total discovered after the invoice. Without
observation and tracing, the owner knows a task cost a lot but not which
component ate the cost, which spawn caused it, or whether the cost was
necessary or waste. Financial decisions without tracing are guessing;
tracing without decisions is decoration.

## 2. What lands

A measurement, tracing and cost-governance layer:

- Trace spans per component, cost leaderboards, budget ceilings, tiered-routing
  inputs, with cost accounting per success (a cheap failed task costs more than
  an expensive successful one).
- Native platform child accounting is consumed, not rebuilt: children carry
  their own cost and tokens, and session statistics count subagents
  separately — a prior install check proved 845 subagent sessions, which shows
  how much used to hide inside totals.
- The spawn ledger is accounted as a first-class input on top: every spawn
  records granted budget, consumed budget, and result, so tracing links the
  organisational decision to its cost.

## 3. The two fields only this slot ships

1. **Per-component cache hit-rate** — the most important cost metric in
   production agents per the study: a high hit-rate means cheap reuse, a low
   hit-rate means repeated expensive recomputation.
2. **Context-rot probe** — a periodic scan of needle position against the live
   context file, catching accuracy loss before performance collapses. Cadence
   is set by measurement: too frequent wastes context and cost, too rare misses
   the rot, so both cadences are measured (open question below).

With these two fields alone, cost management moves from impression to
measurement: a component with frequent cache hits is cheaper than its peer
even if it looks slower on the surface, and rot caught early is cheaper than
collapse caught late.

## 4. Governance built on the data

- Cost leaderboards (internal-first; external publish is a later owner
  decision, because ranking components publicly before measurement matures
  creates distorted incentives).
- Budget ceilings that stop overruns in practice, not on paper.
- Tiered-routing inputs and cost-per-success accounting.
- Feeds the 0.9.3 equipment-doctrine audit loop with real data instead of
  prose, and calibrates the estimated fraction-break assessment.

## 5. Exit criteria (V3:3458, quoted in implementation terms)

1. **Full-task cost stated from ledger evidence, children included** —
   computed by `cost-ledger.mjs` `computeTaskCost` from ledger entries only
   (children costs plus spawn consumed); any number without a ledger entry is
   labelled estimated, never stated as fact.
2. **Cache hit-rate visible per component** — `hitRateTable` plus
   `renderHitRateTable`, proven by the self-test table.
3. **Budget ceiling stops overruns in practice** — `checkCeiling` proven by a
   deliberate-overrun self-test (total 310 against ceiling 300 stops; control
   400 does not stop). A ceiling that does not stop is an alert, not a ceiling.
4. **Spawn-ledger entries carry granted/consumed/result** — enforced by
   `isValidSpawnEntry`; invalid entries fail the computation, never pass
   silently.
5. **Leaderboards internal-first** — `renderLeaderboard` is headed
   `INTERNAL ONLY — do not publish`.

Verification probe P-4 (does child cost roll up to the parent?) governs every
full-task cost claim made under this spec.

## 6. Fallback FBLD-06 honored

FBLD-06 (slot 0.9.6): V3 slot scope versus R2 sales-ready wording pressure —
fallback is findings text only, never applied as a docs change by the
fallback log. This spec therefore ships measurement and governance only. Any
sales-ready wording pressure observed during this build is recorded as a
finding in the build ledger (`b096-build.md`), never applied as a
documentation change here.

## 7. Open questions (carried verbatim, not decided)

- Leaderboard publish surface: internal only? (This build: internal only.)
- Rot-probe cadence versus its own cost. (This build: cadence is measured,
  both directions, per §5 probe notes.)

## 8. Inputs and dependencies

- Old brief §3 (slot 0.9.6), native child accounting plus the spawn ledger in
  the build study, the two unique measurement fields, and the cost-per-success
  principle.
- Spawn ledger exists by law from slots 0.9.2 and 0.9.3 and is enabled
  automatically in a later dedicated spawn-constitution slot.
- Doctrine envelope from the prior study (equivalent ceiling to a price list
  of about 120 dollars monthly for two workspaces, estimated; owner hours —
  about 3 to 6 focused hours per release, estimated — are the binding
  constraint).
- The Zenith team model (from slot 0.9.2) reads from here.
