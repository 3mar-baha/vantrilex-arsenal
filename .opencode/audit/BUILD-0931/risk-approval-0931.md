# LD-31 — Risk-tiered auto-approval reserve (slot 0.9.31, advisory)

Doctrine: FULL
Seat: b0931-build (wave 1 of 9, lane build-release AUTO-0.9-FULL 0.9.31, BLAZAR seat). Owner: vantrilex-typescript.
Task-dispatcher: Scenario 1 NEW TASK (W0 branch verified). No Vanguard equip run from this worker seat — recorded, proceeding with directed node only.
D5 carried: owner overrides direct work but NEVER suppresses gate verdicts.
Base: branch wt/0.9.31-risk-approval cut at 3fa1cf885d02f1ae03ea56cb63647f75fdeba4ba (see b0931-branch.md).

## 1. Status (carried, never re-derived)

- Advisory number only: 0.9.31 is advisory and is assigned at close with proof. Nothing is promised early. Source: V3:6429 and the V3 numbering law.
- Design NOT started. Source: V3:6429.
- Tier formulation DEFERRED until a supervised clean record exists. Formulating tiers now would be guessing, so this spec defines no tiers and carries no tier-definition tables. Source: V3:6375-6379 and V3:6412.

## 2. Treatment carried (V3:6367-6402, data — never re-derived)

- First paragraph, carried (V3:6369-6373): routine closes may pass the self-publish path with no owner touch each time. Routine is defined narrowly: patch level, all gates green, no proposal-only content, no policy change. Standing delegation is a policy-pack bundle from the previous item, never prose and never habit. The kill-switch is always present and halts all delegation at the first signal, with no per-rule repeal. Delegation becomes an inspectable and suspendable machine, not blind trust in a good run.
- Second paragraph, carried (V3:6375-6379): delegation is granted to a proven supervised clean record, never to an unproven one. The weekly cycle runs supervised for several clean weeks before delegation is even considered. Tier definitions are deferred because early formulation would be guessing. The never-automate list stays outside every tier, however routine the close looks. The reserve stays a reserve: advisory number, design after proof, never before.
- What, carried (V3:6381-6384): risk-tiered automatic approval of routine closes through self-publish. Standing delegation as a policy-pack bundle with a kill-switch and defined risk tiers. Absolute exception: the never-automate list stays outside every tier, with no exception.
- Why, carried (V3:6385-6388): an owner touch on every routine patch spends the scarcest resource, owner attention, and delays what needs no delay. Delegation without a pack and without a kill-switch cannot be revoked precisely on failure. Early delegation, before a clean record, turns one bad close into a run of bad releases.
- How, carried (V3:6389-6394): first, run the weekly cycle supervised for several weeks and record its clean record before any formulation. Second, formulate the risk tiers after the record: what is routine, what is conditional, what is never automatic. Third, write the standing delegation as a policy-pack bundle with its checks, enforcement points, and kill-switch. Fourth, run the low tier first, on patch closes with all gates green. Fifth, review every auto-close in the weekly bundle and halt delegation at the first deviation.
- Where-from, carried (V3:6395-6398): policy packs as precondition, the weekly cycle as record of proof, the self-publish path, the workflow study in the graded-delegation section, and the never-automate list as the upper bound no tier touches.
- Where-to, carried (V3:6399-6402): owner time freed for non-routine closes and judgments no machine can take. Routine publishing fast without losing stoppability and review. Every tier stays reviewable: a tier that proves risky is suspended or reformulated, never left running.

## 3. Purpose and what lands (V3:6404-6410, carried)

- Purpose, carried: pass routine closes through self-publish under standing delegation as a policy-pack bundle. Free owner attention for the non-routine without losing stoppability.
- What lands, carried: risk tiers defined after a record of proof, standing delegation as a policy-pack bundle, a kill-switch that halts all delegation, review of every auto-close in the weekly bundle, and the absolute exception of the never-automate list outside every tier.

## 4. Amendments, inputs, dependencies (V3:6411-6420, carried)

- Amendments and owner corrections, carried (V3:6411-6414): tier formulation deferred until a record of proof exists, never formulated before the cycle runs supervised clean weeks. Standing delegation as a pack, never as prose, as a precondition from the policy-packs item. The never-automate list is touched by no tier, however routine the close looks.
- Inputs and design queue, carried (V3:6415-6417): policy packs, the supervised weekly-cycle record, the self-publish path, the workflow study in the delegation section, and proposed tier definitions after the record.
- Dependencies, carried (V3:6418-6420): hard dependencies. No delegation without a pack. No tier without a record of proof. No auto-close without a kill-switch.

## 5. Reserve rules (normative core of this spec)

- R1 DEFERRED tiers: tier formulation is DEFERRED until a supervised clean record exists. Formulating tiers now would be guessing. No tier-definition tables are carried by this spec, by design.
- R2 never-automate bound: the never-automate list stays outside every tier, with no exception and under no reading of routine.
- R3 delegation form: delegation exists only as a policy-pack bundle with checks, enforcement points, and a kill-switch. Prose delegation grants nothing.
- R4 kill-switch: the kill-switch halts all delegation at the first signal and is proven to halt every later auto-close.
- R5 low-tier-first sequencing: the low tier runs first, limited to patch closes with all gates green. No higher tier runs before the low tier proves clean.
- R6 weekly review with halt: every auto-close is reviewed in the weekly bundle, with stop-on-first-deviation. The first deviation halts delegation.

## 6. Exit criteria (V3:6421-6424, carried as to-define — NOT decided here)

- Recorded supervised clean weeks, with the count set by the owner at design time.
- At least one auto-close passing all gates green and reviewed in the weekly bundle.
- The kill-switch works at once, halting every later auto-close, with proof.

## 7. Open questions (V3:6425-6427, carried OPEN — never invented)

- tier-definitions: OPEN. No supervised clean record exists on this seat to decide them. Anything beyond OPEN would be guessing.
- clean-weeks-count: OPEN. The number of supervised clean weeks required before delegation is set by the owner at design time, never here.
- low-tier-membership: OPEN. Which routine closes enter the low tier first, and which wait for a higher tier, is undecided until the record exists.
- This spec sets no tier tables, no week counts, and no membership lists.

## 8. Fallback FBLD-31 (verbatim, FLAGGED — never resolved)

- FBLD-31 — Slot 0.9.31 — Conflict: early tier-formulation pressure versus clean-record-first rule — Fallback: tiers formulated only after supervised clean record; standing list never automated — Matches LD-31 — Status FLAGGED, never resolved.
- Source: .opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:43. LD-31 line: .opencode/audit/FULL-REPORT-REPLAN/latest-draft-2026-10-27.md:67.

## 9. Conflict carried (LD-31 FLAGGED, never resolved here)

- Early tier-formulation pressure versus the clean-record-first rule in the same section. The clean-record-first rule holds by precedence. Nothing is reconciled by this spec. Gate verdicts belong to the Guide on a later dispatch, never to this seat.

## 10. Non-goals

- This spec grants no delegation, automates nothing, defines no tier, and sets no count. It records the reserve honestly so a later seat with a clean record can formulate tiers without guessing.

Ponytail: FULL — reserve carried with zero tier tables and tier formulation DEFERRED pending a clean record.
