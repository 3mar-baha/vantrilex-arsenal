---
name: ponytail
description: Use when a code-executing agent starts any coding task, so generation stays lean under the mandatory floor and ceiling guardrails.
---

# Ponytail

## Purpose

Adopt the upstream ponytail trio as pinned pointers and enforce the mandatory dual guardrail on every code-executing agent.

The trio is `ponytail` (core generation posture for any coding task), `ponytail-review` (report-only change-gate on a diff, branch, or pull request), and `ponytail-audit` (report-only repo-wide health view, map-first, at most 20 ranked findings). Levels `lite`, `full`, and `ultra` are runtime arguments to core, not separate entries. The deferred satellites `ponytail-debt`, `ponytail-gain`, and `ponytail-help` stay out of the minimum bundle.

Upstream seat: `dietrichgebert/ponytail` on `main`, canonical `skills/...` path. The local registry still cites the older `.openclaw/skills/...` path alias for the same content; this skill pins the canonical path and verifies the content hash. Upstream prose is adopted, never rewritten; the kit owns the pins and the guardrail wiring, upstream owns the body text.

License: MIT. Redistribution retains attribution to `dietrichgebert/ponytail` and carries the MIT notice, copyright 2026 DietrichGebert, observed in the `license: MIT` frontmatter of `skills/ponytail/SKILL.md` and in the standard MIT license text in `LICENSE` at the repo root.

Dual guardrail, mandatory and verbatim. Downstream specs, kit entries, and tests copy both quoted lines verbatim and never paraphrase them. FLOOR stops reckless laziness. CEILING stops astronaut seniority.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## When to Use

- A code-executing agent starts any coding task (write, fix, refactor, dependency choice): load core for the generation posture.
- A diff, branch, or pull request is ready for a gate verdict: load review, which changes no code and reports only.
- A repo-wide health view is needed: load audit, which changes nothing and reports at most 20 ranked findings.
- A level choice is needed: pass `lite`, `full` (default), or `ultra` as a runtime argument to core.
- Safety or leanness is in doubt: enforce FLOOR as the build breaker and CEILING as the leanness breaker per `GUARDRAILS.md`.

## Do NOT use

- For non-coding requests; core is a generation posture for coding tasks only.
- As a substitute for the owning review or audit report contract; generation and gating stay separate because their triggers and output contracts differ.
- The deferred satellites `ponytail-debt`, `ponytail-gain`, or `ponytail-help` through this bundle; debt needs the `shortcut:` comment convention adopted first, gain duplicates the audit `Lean:` line, and help duplicates kit provisioning routing.
- Forked or rewritten upstream body text; adopt the pinned pointer and pin the hash instead, so the bundle cannot drift from upstream discipline.
- Paraphrased guardrails; only the verbatim FLOOR and CEILING lines satisfy the wiring.
- The `.openclaw/skills/...` alias as the pin; treat it as an alias, pin the canonical `skills/...` path, and verify the hash.

## Inputs

- The coding task or the artefact under gate: task text, diff, branch, or pull request reference.
- The selected variant: core, review, or audit, plus the core level (`lite`, `full`, or `ultra`) when core applies.
- The pinned upstream pointer and its verified content hash (canonical `skills/...` raw URL; alias noted, never pinned).
- The verbatim FLOOR and CEILING lines from Purpose, enforced through `GUARDRAILS.md`.
- The verification currently passing, so the gate knows what has already been ruled out.

## Procedure

1. **Select the variant.** Coding task means core; single change means review; whole repo means audit. Record the choice and the core level when core applies.
2. **Load the pinned upstream text.** Fetch the canonical raw URL for the selected variant and verify the content hash before use. Read the connected code, not only the diff, when review or audit runs.
3. **Enforce FLOOR first.** Demand tests for risky logic, error handling that prevents data loss, and validation at trust boundaries. Missing safety fails the guard; brevity never excuses a skip.
4. **Enforce CEILING second.** Refuse gold-plating, speculative abstraction, framework-for-one-use, and any option, setting, or wrapper nobody asked for. Added shape without a second caller fails the guard.
5. **Apply the variant contract.** Core emits the smallest complete change with reuse order codebase helper, then standard library or platform, then installed dependency, then one-liner, then minimum code, and deletion beats addition. Review orders correct, safe, holds under load, tested, fast, lean, and emits numbered Must fix, Should fix, and Nice to have findings with What, Problem, Fix, and If-we-skip-it plus Verdict, Lean, and Not-checked lines. Audit maps first, traces main flows end to end, and ranks at most 20 findings with Lean savings stated as lines plus dependencies.
6. **Keep the report-only boundary.** Review and audit change no code and change nothing; findings carry a concrete failure case each, and a finding without a case is returned.
7. **Record attribution.** Every output names `dietrichgebert/ponytail`, the used variant and level, the pinned URL and hash result, and the MIT notice.

## Outputs

- The selected variant and level plus the verified pinned pointer.
- For core: the smallest complete change following the reuse order and the Never-cut list.
- For review: a report-only gate verdict with numbered Must fix, Should fix, and Nice to have findings, each with a concrete failure case.
- For audit: a report-only repo-wide view with at most 20 ranked findings and Lean savings.
- The dual-guardrail verdict: FLOOR pass or fail with the missing safety named, CEILING pass or fail with the removed shape named.
- The attribution line: upstream seat, variant, pinned URL, hash result, and MIT notice.

## Failure Modes

- **Reckless brevity.** Tests skipped for risky logic or safety cut for brevity; FLOOR fails the change and the missing check is named.
- **Astronaut seniority.** Abstraction, wrapper, option, setting, or framework added without a caller that needs it; CEILING fails the change and the deleted shape is named.
- **Paraphrased guardrails.** Reworded FLOOR or CEILING text that no grep test can confirm; only the verbatim lines count.
- **Forked bodies.** Locally rewritten upstream prose that drifts within one quarter; adopt the pointer and re-pin instead.
- **Alias pinned.** The `.openclaw/skills/...` alias pinned without hash verification; pin canonical and verify.
- **Generation-gate blur.** Review or audit used to write code, or core used to certify its own output; generation and gating stay in separate invocations.
- **Unranked sprawl.** Audit findings beyond 20 or left unranked; rank by damage and cut the tail.
