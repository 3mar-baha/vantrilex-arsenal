# LD-13 task-contract template — measurable gates, pre-mortem appendix, mission log

Seat: vantrilex-typescript (worker seat) · Lane: AUTO-0.9-FULL 0.9.13 (build-release) · Node: b0913-build (wave 1 of 9) · Date (UTC): 2026-10-29

Concern: land the LD-13 measurable-gate contract template carried from V3:3880-3955, never re-derived.

Doctrine: FULL (core ponytail posture with FLOOR and CEILING as quoted in the ledger).

Sources carried as data (read-only, never re-derived):

- LD-13: `.opencode/audit/FULL-REPORT-REPLAN/latest-draft-2026-10-27.md:49` — "LD-13 — Slot 0.9.13 — Task contracts under specs and independent verification — Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3880`), carried as data — Conflict FLAGGED: V3 slot scope versus R3 auto-approve proposal — Fallback LD-13: fix text in findings only; apply is a second dispatch — Not resolved."
- FBLD-13: `FBLD-13 — Slot 0.9.13 — Conflict: V3 slot scope versus R3 auto-approve proposal — Fallback: fix text in findings only; apply is a second dispatch — Matches LD-13 — Status FLAGGED, never resolved.`
- V3 treatment: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3880-3955` (how steps 1-10 at :3906-3916, exit criteria at :3947-3949, open questions at :3951-3953).
- Locked reference: `.opencode/audit/BUILD-0912/verdict-0.9.12.md` (read-only).

## 1. Contract shape (copy verbatim per task)

```text
Task contract <task-id>:
  Gates:
    - id: <G1>
      text: <measurable gate as written>
      measure: { tool: <node|tsc|script-name>, command: <exact re-runnable command>, expected: <exact expected value> }
      altCriterion: <present ONLY when measure.tool is "alternative"; otherwise absent>
  Pre-mortem appendix: <mandatory; plan without it is REJECTED, see section 4>
  Mission-log refs: <every gate + result recorded; see section 7>
```

## 2. The ten carried rules (LD-13 how 1-10, carried as data)

1. Every gate is measurable as written; no post-hoc interpretation is needed.
2. The verifier seat runs on a fixed context that excludes author traces.
3. External signals come first: tests, compilers, and tools before any quality judgment.
4. Where no external reference exists, the contract records a documented alternative verification with an explicit acceptance criterion in `altCriterion`.
5. Any contract carrying a vague gate is REJECTED back to planning, never to execution.
6. Any plan without a pre-mortem appendix is REJECTED and recorded as a planning defect, not a side note.
7. The verifier is tested on known-defect work without seeing author traces; detection is proven by external evidence.
8. TDD-evidence strictness and UI-pattern scope are ruled inside the plan by the planning leader (second-track ruling, carried as plan text below).
9. That second-track ruling is explicitly distinct from the prior receipt/measurement ruling (already ruled, closed).
10. Every gate and every result is recorded in the mission log for post-close review.

## 3. Second-track ruling carried as plan text (rules 8-9)

- TDD-evidence strictness and UI-pattern scope are decided inside the plan by the planning leader. This template does not decide them; it reserves the plan section where the planning leader writes the ruling.
- This ruling is explicitly distinct from the prior receipt/measurement ruling, which is already ruled and closed. The two rulings are never mixed: receipt/measurement stays closed, TDD/UI strictness is ruled per plan.

## 4. Rejection rules (rules 5-6)

- Vague gate: any gate whose text contains a vague term as written, or whose `measure.tool`, `measure.command`, or `measure.expected` is missing, makes the whole contract REJECTED. Disposition: return to planning. Record as a planning defect in the mission log. Never send to execution.
- Missing pre-mortem: any plan whose pre-mortem appendix is missing or empty is REJECTED. Disposition: return to planning. Record as a planning defect, not a side note.

## 5. Exit criteria covered (V3:3947-3949)

- A contract whose gates are all measurable as written (probe case a ACCEPT).
- A working verifier without author traces (probe case d DETECTED by external evidence).
- A rejected plan proving the appendix mandatory (probe case c REJECTED as planning defect).

## 6. Open questions answered inside the template, never blocking (V3:3951-3953)

- Contract level task-vs-phase: the same template applies at both levels. A task contract gates one task; a phase contract gates the phase by listing each member task contract id plus one phase-level gate. No template variance beyond that nesting.
- Alternative acceptance criterion: where no external reference exists, `measure.tool` is `"alternative"` and `altCriterion` states the explicit acceptance criterion (who checks, with what record, and what exact value counts as pass). A contract with `tool: alternative` and no `altCriterion` is REJECTED as a vague gate.

## 7. Mission log (rule 10)

- Every gate evaluation (ACCEPT or REJECTED with reasons) and every plan evaluation is appended to the mission log with the contract id, the exact command run, the exit quoted, and the verdict.
- The probe self-test output lines are the minimal mission-log entry for this slot.

## 8. Component commands (honesty rule)

- install_cmd: null.
- verification: unverified.
- No install command is claimed anywhere in this slot. A null command plus `unverified` beats a plausible lie.
