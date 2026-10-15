# P2 Intake — 10-Field Checklist, PLAN-INCOMPLETE Capsule, Amendment Protocol

- Lane: VTA-EXPANSION-05 P2. Node: `p2-intake` (wave 27 of 35).
- Branch: `wt/vta-expansion-03`. Date (UTC): 2026-10-15.
- Classification: Scenario 1 NEW TASK — no intake task was in flight in this seat; this note starts it.
- Status: binding for P2 downstream intake decisions alongside `P2-R0.md`; this file authors no component and changes no shipped file.
- Sources (read live 2026-10-15, referenced, never rewritten): `P2-R0.md` sections 2–5 (verdicts H7–H16); `.opencode/agents/blazar.md` sections 3 (intake gate), 6 (dispatch brief shape), and 10 (refusal-capsule format); `schemas/capsules/capsule.schema.json` (`refusal` definition); `P1-R0.md` verdict 1 (detective-only plan-guard, PARKED).

## 1 The 10-Field Intake Checklist (Exactly Ten Fields)

Every role section of an AETHER MISSION-PLAN carries all ten fields below before BLAZAR derives any wave (`blazar.md` section 3, step 2). The checklist is ten fields exactly: no field is added, none is split, none is optional, and no companion item below is an eleventh field. A role section missing any one of the ten is not intaken — it follows the section 2 capsule path.

| # | Field | Intake requires (H-verdict) |
|---|---|---|
| 1 | `Lane` | The program lane the node runs in (H7 GAP — no fixture field carries it; required per `blazar.md:301`) |
| 2 | `Node` | Short hyphenated node id plus its wave position (H8 PARTIAL — fixture wave ids name nodes but carry no wave position; required per `blazar.md:302` and the DAG spec `blazar.md:253-263`) |
| 3 | `Concern` | The one concern, stated in one sentence (H9 PARTIAL — fixture concern strings exist but one-sentence shape is unenforced by the schema; required per `blazar.md:303`) |
| 4 | `Owner` | A named roster worker resolving against the live roster (H10 CONFORM on presence plus roster resolution — fixture owners `pulsar`/`aether` are leaders absent from the dispatch allow-list and would FAIL intake; see the roster rule below) |
| 5 | `Acceptance` | The Guide-approved criteria the node must satisfy, quoted (H11 GAP — no fixture field; required per `blazar.md:306`) |
| 6 | `May read` | Files, briefs, and prior node artifacts the node may read (H12 GAP — no fixture field; required per `blazar.md:306` and the DAG spec `blazar.md:256`) |
| 7 | `Must leave` | The file on disk that must exist when the node completes (H13 GAP — no fixture field; required per `blazar.md:307`) |
| 8 | `Must run` | The exact command or check that proves the landing (H14 GAP — no fixture field; required per `blazar.md:307`) |
| 9 | `Must not touch` | Files owned by other nodes, which this node must not write (H15 GAP — no fixture field; required per `blazar.md:309` and the single-writer discipline) |
| 10 | `State files` | Whether this node updates `AGENT.md` / `WORKFLOW.md`, or neither (H16 GAP — no fixture field; required per `blazar.md:310`) |

### Field 1 — Lane (H7)

- Requirement: the program lane the node runs in (for example `VTA-EXPANSION-05 P2`), naming the program whose gates judge the node.
- Fail rule: absent lane, or a lane borrowed from an older document, stops intake. A lane is stated by the plan, never filled from memory.

### Field 2 — Node (H8)

- Requirement: short hyphenated node id plus its wave position (for example `` `p2-intake` (wave 27 of 35) ``). Wave ids alone are not a position: `P2-R0.md` verdict H8 is PARTIAL for exactly this reason.
- Fail rule: an id with no wave position, or a position that contradicts the derivation order, stops intake.

### Field 3 — Concern (H9)

- Requirement: the one concern, stated in one sentence. The schema enforces string presence only, so the one-sentence shape is an intake enforcement, not a schema property.
- Fail rule: zero concerns, two concerns, or a paragraph where one sentence belongs stops intake.

### Field 4 — Owner (H10)

- Requirement: a named roster worker that resolves against the live roster at intake time. The binding roster is the retooled `.opencode/agents/blazar.md` section 5 table, re-verified on every new task because the binary roster is the binding source and a printed table is not. The 13 dispatchable workers are `vantrilex-fixer`, `vantrilex-github`, `vantrilex-harness`, `vantrilex-librarian`, `vantrilex-python`, `vantrilex-releaser`, `vantrilex-reviewer`, `vantrilex-scribe`, `vantrilex-security-auditor`, `vantrilex-typescript`, `vantrilex-ui-designer`, `vantrilex-ux-designer`, and `vantrilex-verifier`. `vantrilex-scout` is shared and RESTRICTED (D3 — never dispatched by BLAZAR). Never dispatched: `aether` and `pulsar` (planning and exploration leaders), `blazar` itself, `vantrilex-leader`, `vantrilex-guide`, `vantrilex-implementer` (lanes outside this seat), the `build` and `plan` primaries (disabled), and the generic fallback (never dispatched silently).
- Fail rule: an owner that does not resolve against the live roster stops intake — the intake fails, and the section 2 capsule names the unresolvable value. `P2-R0.md` verdict H10 records the precedent: the fixture owners `pulsar` and `aether` are present as strings yet absent from the dispatch allow-list, so a plan naming them fails intake exactly as a plan naming nobody does.

### Field 5 — Acceptance (H11)

- Requirement: the Guide-approved criteria the node must satisfy, quoted verbatim, so verification judges the node against approved words rather than a paraphrase.
- Fail rule: absent criteria, or criteria restated from memory instead of quoted, stops intake.

### Field 6 — May read (H12)

- Requirement: the files, briefs, and prior node artifacts this node may read, named as paths. A node reads only what this field names.
- Fail rule: an unnamed input the derivation depends on stops intake; intake never widens the read set silently.

### Field 7 — Must leave (H13)

- Requirement: the file on disk that must exist when the node completes, named as an exact path. The verification node of section 8 in `blazar.md` reads this artifact from disk — a report alone never closes a node.
- Fail rule: no artifact path stops intake. A node whose landing cannot be named on disk is not a node.

### Field 8 — Must run (H14)

- Requirement: the exact command or check that proves the landing, stated so the verification node can re-run it word for word after the last change.
- Fail rule: a vague check ("tests pass", "looks good") stops intake. Only the named check, re-run after the fix, closes a node.

### Field 9 — Must not touch (H15)

- Requirement: the files owned by other nodes, which this node must not write, named explicitly. This is the single-writer discipline in per-node form.
- Fail rule: an unnamed shared write target stops intake. Two concerns touching one file are not independent nodes — they chain in dependency order in separate waves.

### Field 10 — State files (H16)

- Requirement: whether this node updates `AGENT.md` / `WORKFLOW.md`, or neither — one of the three answers, stated explicitly.
- Fail rule: silence on state files stops intake. A node that updates a state file without declaring it corrupts the resume record.

### Companion Gate Items (Not Checklist Fields)

The intake gate of `blazar.md` section 3 additionally requires, per role section: the refusal list (H3 — GAP in the fixture, required whole) and the justification ledger inline (H4 — CONFORM as a ref, required inline, not just the ref). The remaining anatomy verdicts (H1 objective, H2 role sections, H5 order, H6 replan triggers) bind what each role section carries. These live in their owning documents and are referenced here, not duplicated: nothing in this section is an eleventh checklist field.

## 2 PLAN-INCOMPLETE Escalation Capsule

PLAN-INCOMPLETE escalates, never improvised (`blazar.md:307-312`). Any missing checklist item, any role without a refusal list, any component without its ledger reason, or any owner that does not resolve against the live roster stops the intake: BLAZAR emits a refusal capsule with disposition `escalate` and waits. It never fills the gap from memory, never borrows a value from an older document, and never dispatches on a draft.

### Capsule Shape

Every capsule validates against the `refusal` definition in `schemas/capsules/capsule.schema.json`, checked with `node scripts/validate-capsule.mjs <capsule.json>` (`blazar.md` section 10). Required fields: `capsule` (constant `"refusal"`), `capsule_version` (matches `^1\.`), `issued_at` (UTC timestamp), `issuer` (`blazar`), `disposition` (`escalate` — PLAN-INCOMPLETE intakes always escalate, never silently drop), `reason` (one sentence stating why the intake stops), `refused_request` (quoting or faithfully paraphrasing the refused brief). Optional: `evidence` (file and line references the refusal rests on) and `suggested_route` (`aether` for a planning question).

### Content Rule

The capsule quotes the brief and names the gap — the field number(s) from section 1 with their H-refs — and improvises nothing:

```json
{
  "capsule": "refusal",
  "capsule_version": "1.0.0",
  "issued_at": "2026-10-15T00:00:00Z",
  "issuer": "blazar",
  "disposition": "escalate",
  "reason": "PLAN-INCOMPLETE: role section <id> lacks intake field 4 (Owner, H10) — owner <value> does not resolve against the live roster; no wave derived.",
  "refused_request": "<quoted dispatch brief or plan section>",
  "evidence": "<file:line refs, e.g. blazar.md:298-305, P2-R0.md:35>",
  "suggested_route": "aether"
}
```

### Standing Rules

- Disposition is always `escalate`. A PLAN-INCOMPLETE capsule with any other disposition is malformed and is re-issued, not reinterpreted.
- The brief and the gap are quoted, never improvised: the capsule carries the plan's own words plus the missing field number(s), not a repaired value.
- Enforcement is detective only per `P1-R0.md` verdict 1 (PARKED): no hook denies admission, so the capsule is the record, and the plan-guard reports drift after the fact.
- No pin key of any kind is added to any file by this protocol; the standing zero-pin law holds across every capsule and every amended plan.

## 3 Versioned-Diff Amendment Protocol

A plan changes only by versioned amendment. The intaken plan is v1; each revision arrives labeled (v2, v3, …) against the version it supersedes. An unlabeled revision is not diffed — it returns to AETHER for labeling, because a diff needs both endpoints.

1. Diff v2 against v1 section by section. Record every role section as changed or unchanged with its file and line references. A claim without its section reference is not a diff entry.
2. Compute the affected set: changed sections, plus downstream dependents (every node whose `depends_on` chain reaches a changed section), plus waves sharing a write target with a changed section. When in doubt whether a wave is affected, it is affected — a narrow diff that misses a dependent poisons the derivation.
3. Re-validate affected waves only. Each affected wave re-clears the full section 1 intake (all ten fields, owner re-resolved against the live roster), re-derives, and re-verifies with the named check re-run after the change. Prior proofs for affected waves are superseded, never reused.
4. Unaffected waves stand with their proofs. Artifacts on disk plus the quoted passing outputs stay as recorded; unaffected waves are never re-derived, never re-run, and never re-scoped by an amendment that does not touch them.
5. Record the amendment in `AGENT.md`: the version bump (v1 to v2), the diff summary, the affected waves with their re-validation verdicts, and the standing waves with their proofs cited. The ledger entry is dated; history is appended, never rewritten.
6. The intake gate re-closes on the amended plan before derivation resumes. Amendment is not a fast lane around intake.

An amendment never weakens an acceptance criterion or a verification check to fit an artifact. A weakened check is a dispute for the Guide, with the failing command, its output, and the hypothesis attached — the same ladder as any other disputed check.

## 4 Evidence (Must-Run Outputs, Verbatim)

Branch (must print `wt/vta-expansion-03`):

```text
wt/vta-expansion-03
EXIT:True
```

Markdownlint on this file (`npx --yes markdownlint-cli P2-INTAKE.md`):

```text
(no findings; MARKDOWNLINT_EXIT:True, i.e. exit 0)
```

Zero-pin proof (`Select-String` count of `model:` over this file is 0; `TODO|FIXME` grep returns no matches):

```text
0
(no TODO|FIXME matches)
```
