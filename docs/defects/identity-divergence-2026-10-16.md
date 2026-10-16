# Identity Divergence Defect — 2026-10-16

Defect record for the V-switch identity divergence observed on 2026-10-16.
Branch: `wt/vta-identity-doc`. Owner: kit-maintainer. Status: recorded, root cause unknown.

## 1 — Observation

On 2026-10-16 the owner invoked V-AETHER. The UI status bar displayed `Aether`.
The responding agent identified as BLAZAR and declined an Aether-addressed
order citing Blazar's charter. Displayed identity versus actual identity
DIVERGED: the seat was entered as Aether, and everything answering was Blazar.

## 2 — Timeline

1. 2026-10-16 — Owner invoked V-AETHER to open an Aether planning seat.
2. 2026-10-16 — FACTORY-08 decline: this seat, running as BLAZAR, declined
   the Aether-addressed order with two unblocks (open an AETHER session, or
   explicitly authorize BLAZAR to plan as an exception).
3. 2026-10-16 — Owner ran an identity probe on the live seat.
4. 2026-10-16 — Seat returned the verbatim self-report quoted in section 3.
5. 2026-10-16 — Amendment A1 parked as planning input for the AETHER session.
6. 2026-10-16 — Exception order VTA-IDENTITY-DOC issued: record this defect
   and plan the repair.

## 3 — Probe Transcript

The following exchange is quoted verbatim, with no edits.

```text
Owner: state your agent identity

Response: I am BLAZAR — manager-only orchestrator, mode: primary, sole dispatch authority of this session. The divergence Amendment A1 names is live in this exchange: the seat was entered via V-AETHER, yet everything answering here — the charter cited, the allow-list enforced, the two declines issued — is BLAZAR's. Self-report and UI label disagree, and the self-report is the honest one until A1's single-sourcing lands.
```

## 4 — Impact Analysis

Every V-switch is untrustworthy while this divergence stands: entering a seat
through a V-switch does not guarantee the named agent answers. All agent
routing is suspect until fixed, because the UI label and the responding agent
can disagree silently. Any order addressed to the displayed identity may be
received, interpreted, or declined by a different agent. No V-switch result can
be attributed to its displayed identity until Amendment A1 lands and its
regression gate passes.

## 5 — Amendment A1 Summary

Amendment A1 is held as planning input for the AETHER session. It gates a
foundational fix on v0.8 with six requirements:

1. Single-sourced identity: one source decides the active agent identity.
2. Atomic switch or loud failure: a V-switch lands fully or fails loudly.
3. Per-response identity: every response carries its agent identity.
4. Round-trip self-test plus misaddressed-order probe: prove the seat answers
   as the displayed agent and declines orders addressed elsewhere.
5. Explicit fallback if unachievable: state what holds when the fix cannot land.
6. Regression gate in every future battery: keep a probe that fails on return.

## 6 — Interim Protocol

Until Amendment A1 lands, the following protocol holds:

- Before any big paste, the owner asks the seat: `state your agent identity`.
- One fresh session per agent: no V-switching between agents in one session.

## Root Cause

Root cause: UNKNOWN. No mechanism is proven: the trigger path, the layer that
renders the UI label, and the layer that seats the responding agent are all
unproven. Zero causes are asserted beyond the observed divergence. The fix
direction in Amendment A1 is a planned control, not a diagnosed cause.
