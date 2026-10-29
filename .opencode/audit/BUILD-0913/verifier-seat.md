# LD-13 independent verifier seat — structurally independent of the author

Seat: vantrilex-typescript (worker seat) · Lane: AUTO-0.9-FULL 0.9.13 (build-release) · Node: b0913-build (wave 1 of 9) · Date (UTC): 2026-10-29

Concern: specify the verifier seat carried from V3:3880-3955, structurally independent of the author, never re-derived.

Doctrine: FULL (core ponytail posture with FLOOR and CEILING as quoted in the ledger).

Sources carried as data (read-only): LD-13 at `latest-draft-2026-10-27.md:49`; FBLD-13 at `fallback-log-2026-10-27.md:25` (verbatim below); V3 treatment at `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3880-3955`; locked reference `verdict-0.9.12.md`.

FBLD-13 carried verbatim: `FBLD-13 — Slot 0.9.13 — Conflict: V3 slot scope versus R3 auto-approve proposal — Fallback: fix text in findings only; apply is a second dispatch — Matches LD-13 — Status FLAGGED, never resolved.`

## 1. Fixed context (excludes author traces)

The verifier seat context carries exactly two fields:

```text
seatContext:
  evidence: [<tool-output excerpts>]
  toolOutputs: [<exact command outputs with exits quoted>]
```

The following keys are forbidden in the seat context: `thoughtChain`, `selfJustifications`, `impressions`, `authorNotes`. Presence of any one of them makes the seat NOT-INDEPENDENT and the verification does not run.

## 2. External signals first

Order of evidence is fixed:

1. Tests, compilers, and tools (exact commands, exits quoted).
2. Documented alternative verification with its explicit acceptance criterion, only where no external reference exists.
3. Quality judgment last, and only on top of 1-2. A judgment without 1-2 is not a verification.

## 3. Findings-only law (FBLD-13 honored)

- The verifier writes findings text only: what failed, the exact evidence, and the gate id.
- Applying a fix is a second dispatch. No auto-fix and no auto-approve mechanism exists anywhere in this slot: not in the template, not in this seat spec, not in the probe, not in the ledger.
- A finding that edits, approves, or merges is out of scope and refused.

## 4. Rejection routing

- Vague-gate contract: REJECTED back to planning as a planning defect, never to execution.
- Plan without a pre-mortem appendix: REJECTED as a planning defect, not a side note.
- Both rejections are recorded in the mission log with reasons.

## 5. Known-defect proof

- The verifier is tested on known-defect work without seeing author traces.
- Detection counts only when proven by external evidence: the exact tool, the exact command, the expected value, and the observed value, quoted in the finding.
- The probe self-test case (d) is the standing proof: `LD13-INDEPENDENT-VERIFIER: DETECTED by external evidence`.

## 6. TDD/UI second-track ruling (carried as plan text)

- TDD-evidence strictness and UI-pattern scope are ruled inside the plan by the planning leader. This seat does not rule them; it enforces whatever the plan records.
- That ruling stays explicitly distinct from the prior receipt/measurement ruling (already ruled, closed). The verifier never re-opens the closed ruling.

## 7. Mission log

- Every gate and every result is recorded in the mission log for post-close review: contract id, gate id, command, exit quoted, verdict, and evidence excerpt.
- The verifier grants nothing; the ruling belongs to the leader.

## 8. Component commands (honesty rule)

- install_cmd: null.
- verification: unverified.
- No install command is claimed anywhere in this slot.
