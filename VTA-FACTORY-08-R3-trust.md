# VTA-FACTORY-08 R3 — Crucible Intake and Auto-Evaluator Trust-Boundary Requirements

## Purpose

State the trust-boundary requirements for the Crucible intake and the
auto-evaluator for lane `VTA-FACTORY-08-PLAN`, wave 1 node `r3-trust`.
Each requirement traces to the order section named beside it.
Designing enforcement machinery is out of scope; the `d-plan` node owns design.

## Inputs and limits

- Order sections referenced by the dispatch brief: §2.5 (uploader set),
  §2.6 (auto-evaluator, security-scan-first), §3
  (Crucible SEND-only, puller, 24-7 operation), §4
  (kill switch, sign-off before admission).
- `WORKFLOW.md` Part B (lane DAG, roles, precautions) was read.
- The live order text beyond the section titles in the brief was not
  available on this seat; specifics not stated in the brief are marked
  `UNKNOWN` below rather than invented.
- Context file `docs/defects/identity-divergence-2026-10-16.md` was
  requested but is absent on this seat (`docs/` holds no `defects/`
  directory); no claim in this brief depends on it.

## Requirement convention

- IDs are `TR-<section>-<nn>`; every requirement ends with its order
  reference in parentheses, for example `(Order §2.6)`.
- `SHALL` states a requirement; `UNKNOWN` marks a value this seat could
  not observe and the plan must resolve from the live order text.
- Nothing below specifies a scanner product, a policy engine, a schema
  change, or an implementation; those are plan decisions, not requirements.

## §2.5 — Uploader set requirements (Order §2.5)

- TR-2.5-01: The plan SHALL enumerate the closed uploader set admitted to
  the Crucible intake; any sender outside that set SHALL be rejected
  without admission-side processing (Order §2.5).
- TR-2.5-02: The plan SHALL state the authority by which an uploader
  identity is authenticated at intake, distinct from any self-asserted
  sender field (Order §2.5).
- TR-2.5-03: The exact uploader identities and authentication mechanism
  are `UNKNOWN` on this seat; the plan SHALL quote them from the live
  order §2.5 rather than reconstruct them (Order §2.5).

## §2.6 — Auto-evaluator security-scan-first requirements (Order §2.6)

- TR-2.6-01: Every auto-evaluator run SHALL execute the secrets and PII
  scan before any evaluation, scoring, ranking, or admission step; a run
  that skips the scan SHALL NOT proceed (Order §2.6).
- TR-2.6-02: A scan hit for secrets or PII SHALL quarantine the candidate
  submission and block it from evaluation and from admission; removal of
  the value alone SHALL NOT clear the finding without rotation where a
  secret leaked (Order §2.6).
- TR-2.6-03: Scan findings SHALL record type and location with a redacted
  preview only; raw secret values SHALL never enter logs, reports, or the
  repository (Order §2.6).
- TR-2.6-04: The scan tool, rule set, and PII categories are `UNKNOWN` on
  this seat; the plan SHALL quote them from the live order §2.6 (Order §2.6).
- TR-2.6-05: No evaluation score SHALL override a scan-blocked verdict;
  evaluation quality and evaluation safety remain separate gates
  (Order §2.6).

## §3 — Crucible SEND-only, puller, and continuous-operation requirements (Order §3)

- TR-3-01: The Crucible intake SHALL be SEND-only from the submitter side:
  submitters may send candidate payloads in and SHALL hold no READ
  authority over the Crucible interior, other submissions, evaluations,
  or admission state (Order §3).
- TR-3-02: READ and pull authority SHALL belong exclusively to the
  designated puller role; submitters, evaluators-as-submitters, and
  observers SHALL NOT pull (Order §3).
- TR-3-03: Exactly one puller SHALL hold pull authority at a time; the
  single-puller rationale is contention and auditability: one pull
  sequence, one custody chain, no competing admissions of the same
  candidate (Order §3).
- TR-3-04: The puller identity and the handover procedure for continuous
  (24-7) operation are `UNKNOWN` on this seat; the plan SHALL quote them
  from the live order §3, including how pull authority transfers without
  ever having two active pullers (Order §3).
- TR-3-05: Continuous operation SHALL NOT weaken TR-3-01 through TR-3-03:
  shift change, failover, or unattended windows SHALL preserve SEND-only
  intake and single-puller custody (Order §3).

## §4 — Kill switch and sign-off-before-admission requirements (Order §4)

- TR-4-01: A kill switch SHALL exist that halts intake, evaluation, and
  admission together; halting only one of the three SHALL NOT satisfy this
  requirement (Order §4).
- TR-4-02: No candidate SHALL be admitted while the kill switch is
  engaged; engagement SHALL fail closed toward rejection or park, never
  toward silent admission (Order §4).
- TR-4-03: Admission SHALL require an explicit human sign-off recorded
  before the candidate enters the kit; auto-evaluator approval alone
  SHALL NOT admit (Order §4).
- TR-4-04: The kill-switch mechanism, its operator, and the sign-off
  record shape are `UNKNOWN` on this seat; the plan SHALL quote them from
  the live order §4 (Order §4).

## Spawn and recursion caps — quota-burn rationale (Order §§3–4)

- TR-5-01: The plan SHALL state explicit spawn and recursion caps for the
  Crucible and auto-evaluator loop; unbounded spawning SHALL NOT be
  permitted (Order §§3–4).
- TR-5-02: The cap rationale is quota-burn containment: without caps, a
  runaway intake-evaluation-admission loop can cascade into large-scale
  agent spawning of the kind the order cites as the 361-agent quota-burn
  failure mode (Order §§3–4).
- TR-5-03: Breaching a cap SHALL halt further spawning and park the run
  for human disposition; the run SHALL NOT silently continue over the cap
  (Order §§3–4).
- TR-5-04: The numeric cap values and the counting scope (per run, per
  window, per parent) are `UNKNOWN` on this seat; the plan SHALL quote
  them from the live order rather than invent numbers (Order §§3–4).

## Explicitly out of scope for this brief

- Enforcement design (scanner selection, policy code, schema edits,
  registry entries, hook wiring) belongs to the `d-plan` node, not here.
- Kit machinery, Harness probes, quality review, and program execution
  are not requirements of this brief and carry no requirement IDs here.

## Rescan and traceability path

- The `d-plan` node verifies this brief by quoting each `TR-*`
  requirement against its order section; a requirement whose order text
  cannot be quoted stays `UNKNOWN` and fails closed to human disposition.
- Fingerprint for rescan: requirement IDs `TR-2.5-01` through `TR-5-04`
  are stable across runs; resolved means quoted from the order, momenta
  still-present means still `UNKNOWN`, newly-introduced means an ID
  outside that range.

## Scenario note

The appended task-dispatcher classification line asks for a Vanguard
dispatch playbook run; that routing decision belongs to the orchestrator,
not to this worker seat, so this node performs its dispatched concern
only and leaves classification to the directing leader.

Ponytail: ceiling-only — requirements only, no code written, no new machinery designed.
