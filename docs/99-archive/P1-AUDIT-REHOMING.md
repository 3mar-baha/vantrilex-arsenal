# P1 Audit Re-Homing Note — V-FULL-AUDIT After 7.5

- Lane: VTA-EXPANSION-05 P1. Node: `p1-rename` (wave 21 of 35).
- Branch: `wt/vta-expansion-03`. Date (UTC): 2026-10-15.
- Reference (read-only): `.opencode/commands/V-FULL-AUDIT.md`.
- Status: planning note only. No shipped command content is edited by this note.

## Handoff Direction

Post-7.5, the audit command is planned by AETHER and executed by the Build Leader.

- AETHER plans: AETHER owns the PREPARE-to-PLAN path and emits the audit plan (scope, subagent fan-out, REPORT-SPEC section assignments) as a findings capsule, then stops.
- The Build Leader executes: the Build Leader receives the capsule, fans out the read-only subagents (kit, registry, agents, skills, commands, plugin, docs), collects the `file:line` cited rows, and emits exactly one report at `.opencode/audit/V-FULL-AUDIT.md`.
- Direction is one way: AETHER to Build Leader. The Build Leader never plans the audit, and AETHER never executes it or writes the report file.

## What Does Not Change

- The shipped command file `.opencode/commands/V-FULL-AUDIT.md` is not edited: its 14-section REPORT-SPEC order, its Law-13 numbering rule, its citation rule, its read-only operating rules, and its deterministic single-path output (`.opencode/audit/V-FULL-AUDIT.md`) all stand exactly as shipped.
- The report contract is unchanged: exactly one file, 1000 lines or more from evidence tables and cited rows, with the four-part final reply (report path plus line count, census, findings, verdict).
- Re-running the command with the same tree still overwrites the same single path in place; no timestamped copies and no suffixed variants.

## Why This Homing

- Planning and execution stay separated: the planning leader designs the measurement, and the build-side leader runs it, so the measurer never grades its own plan.
- The audit stays read-only under both owners: AETHER stops at the plan capsule and the Build Leader writes only the one report path, so no code, lock, sidecar, or catalog file is modified by either side of the handoff.
- No frontmatter pin key is added to any file by this note; the standing zero-pin law holds across all touched files.

## Close-Out Proof Required

- `npx --yes markdownlint-cli` on this note file exits 0.
- The shipped command file shows no diff attributable to this note.
