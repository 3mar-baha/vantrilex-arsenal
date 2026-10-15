# Ponytail Dual Guardrails

Mandatory wiring for every code-executing agent on this lane. No agent writes, fixes, refactors, or chooses a dependency without loading the ponytail anchor first and passing both guardrails below.

## The two lines

Both lines are binding and verbatim. Downstream specs, kit entries, and tests copy them exactly and never paraphrase them. FLOOR stops reckless laziness. CEILING stops astronaut seniority.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## Wiring

1. Every code-executing agent loads `.opencode/skills/ponytail/SKILL.md` before any coding task and records the selected variant (core, review, or audit) with the core level when core applies.
2. FLOOR is the build breaker. A change missing tests for risky logic, missing error handling that prevents data loss, missing validation at trust boundaries, or skipping safety for brevity fails the guard, and the missing safety is named.
3. CEILING is the leanness breaker. A change adding gold-plating, speculative abstraction, framework-for-one-use, or any option, setting, or wrapper nobody asked for fails the guard, and the removed shape is named.
4. Review and audit stay report-only. They change no code, rank findings by damage, and carry a concrete failure case per finding; audit reports at most 20 ranked findings.
5. Levels `lite`, `full` (default), and `ultra` are runtime arguments to core, never separate wiring entries.

## Pinned upstream pointers

Upstream seat: `dietrichgebert/ponytail` on `main`, canonical `skills/...` path. Upstream prose is adopted, never rewritten.

- Core: `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail/SKILL.md`
- Review: `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-review/SKILL.md`
- Audit: `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-audit/SKILL.md`

The local registry still cites the older `.openclaw/skills/...` path alias for the same content. The canonical `skills/...` URL is the pin; the alias is noted, never pinned. Every fetch verifies the content hash.

Explicitly deferred: `ponytail-debt`, `ponytail-gain`, and `ponytail-help` are not wired here.

## Attribution

Redistribution retains attribution to `dietrichgebert/ponytail` and carries the MIT notice, copyright 2026 DietrichGebert, observed in the `license: MIT` frontmatter of `skills/ponytail/SKILL.md` and in the standard MIT license text in `LICENSE` at the upstream repo root. Registration of kit lock and catalog entries belongs to wave 5 and is not done in this change.

## Grep anchors

Exact lines for automated checks:

- `FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."`
- `CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."`
