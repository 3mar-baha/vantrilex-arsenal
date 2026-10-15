# RESEARCH-03-r0b-ponytail — Ponytail variants intake

Lane: VTA-EXPANSION-03
Node: r0b-ponytail-intake (wave 2 of 14)
Owner: architect
Date: 2026-10-15
Upstream seat read: `skills/ponytail/SKILL.md` at `dietrichgebert/ponytail` (also verified `skills/ponytail-review/SKILL.md`, `skills/ponytail-audit/SKILL.md`, `LICENSE`)
Local adoption surface read: live repo tree (`registry/skills/ponytail*.md`, `kit/kit.lock`, `registry/catalog.json` mirror rule)

## 1. Current state analysed

Upstream `dietrichgebert/ponytail` is a multi-skill family, not a single prompt. Observed layout on `main`:

- `skills/ponytail/SKILL.md` — core lazy-senior-dev mode. Frontmatter `license: MIT`, description "Lazy senior dev mode: the smallest change that fully solves the task". Levels: `lite`, `full` (default), `ultra`. Ends reply with skipped-checks + risk line. Key rules: smallest complete change, reuse codebase helper → stdlib/platform → installed dep → one-liner → minimum code; no abstraction/wrapper/option/config/"for later"; deletion beats addition; `shortcut: <limit>, <when to upgrade>` comment for known limits; `Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, calibration, anything the user asked for`.
- `skills/ponytail-review/SKILL.md` — diff/branch/PR review. Order: correct, safe, holds under load, tested, fast, lean. Output groups Must fix / Should fix / Nice to have, numbered findings with What/Problem/Fix/If-we-skip-it, Verdict + Lean + Not-checked. Changes no code.
- `skills/ponytail-audit/SKILL.md` — whole-repo audit. Same ordering as review, plus Map-first (README, deploy/build config, deps, entry points, tests, expected load, end-to-end flows). Max 20 findings, ranked. One-shot report, changes nothing.
- `skills/ponytail-debt`, `skills/ponytail-gain`, `skills/ponytail-help` — satellite helpers (debt ledger harvester, gain reporter, help entry point). Present upstream and already mirrored as stubs in local registry.
- `LICENSE` at repo root — MIT License, Copyright (c) 2026 DietrichGebert.

Local adoption surface:

- `registry/skills/ponytail.md` (DEFAULT-SELECTED), `ponytail-review.md`, `ponytail-audit.md`, `ponytail-debt.md`, `ponytail-gain.md`, `ponytail-help.md` already exist as thin registry pointers with `Source: dietrichgebert/ponytail` and `Raw URL` under `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/.openclaw/skills/...`. Pattern in use: adopt-upstream-pointer, do not fork body text into registry markdown.
- `kit/kit.lock` + `kit.lock.schema.json` govern what ships; `registry/catalog.json` is a derived mirror (never hand-edited). Any bundling decision must land as lock/catalog entries downstream, not as edits in this intake draft.
- Debt already carried: Raw URL drift — local pointers cite `.openclaw/skills/...` path while canonical seat read confirms `skills/...` path also serves the same content. Downstream bundler must pin one canonical Raw URL per variant and verify content hash, not trust path alias.

No rewrite. No new framework. Adoption only.

## 2. Requirements (functional + non-functional)

- Functional: name the minimum bundle that gives code-executing agents (a) a generation posture, (b) a change-gate, (c) a repo-wide health view.
- Non-functional: MIT-compatible redistribution; verbatim-reusable guardrails so downstream specs/tests do not paraphrase safety language; English only; no placeholders; stateless skill text (no runtime, no cache, no bottleneck — horizontally scalable by copy).
- Security: least-privilege report-only review/audit (they change no code); input validation and error handling are never cut for brevity (FLOOR); no speculative abstraction that widens attack surface (CEILING).
- Constraint from dispatch: draft must name bundled variants (core + review + audit minimum), confirm MIT with observed source, and quote exact FLOOR and CEILING wording for verbatim reuse.

## 3. Design — bundled variants (minimum)

Bundle exactly three variants. Nothing more in the minimum shippable set.

### 3.1 ponytail (core) — BUNDLE

- Upstream: `skills/ponytail/SKILL.md` at `dietrichgebert/ponytail`.
- Local pointer: `registry/skills/ponytail.md`.
- Role: generation posture for any coding task (write, fix, refactor, choose dependency). YAGNI, stdlib-first, smallest complete diff, levels lite/full/ultra.
- Adopt-don't-reinvent rationale: the core value is the calibrated 6-step preference order (codebase helper → stdlib → installed dep → one-liner → minimum code) plus the Never-cut list. Rewriting it locally would drift within one quarter and lose the upstream test-suite/benchmark alignment. Pointer-adopt, pin hash, translate only the FLOOR/CEILING guardrails into kit normative language (Section 5).

### 3.2 ponytail-review (review) — BUNDLE

- Upstream: `skills/ponytail-review/SKILL.md` at `dietrichgebert/ponytail`.
- Local pointer: `registry/skills/ponytail-review.md`.
- Role: change-gate on a diff/branch/PR. Reads connected code, not only the diff; orders correct > safe > load > tested > fast > lean; emits numbered Must/Should/Nice findings with concrete failure case per finding.
- Adopt-don't-reinvent rationale: review checklists rot when forked (every team adds a pet rule). Upstream's "No case, no finding / No style taste / Propose smallest fix that deletes code" discipline is the asset. Adopt verbatim; do not merge into core because generation and gating need separate invocation triggers and separate output contracts (do vs report).

### 3.3 ponytail-audit (audit) — BUNDLE

- Upstream: `skills/ponytail-audit/SKILL.md` at `dietrichgebert/ponytail`.
- Local pointer: `registry/skills/ponytail-audit.md`.
- Role: repo-wide health view. Map-first, trace main flows end-to-end, rank max 20 findings, report Lean savings as lines + dependencies.
- Adopt-don't-reinvent rationale: audit needs the whole-tree grep discipline ("grep whole tree including string/dynamic refs before calling code unused") and the `shortcut:`-comment-as-decision rule. A local rewrite would either duplicate review logic (God Object) or drop scale analysis (correct-for-one vs correct-for-many). Adopt verbatim; keep separate from review because scope (one change vs whole repo) and cost (seconds vs minutes) differ.

### 3.4 Explicitly deferred (not in minimum bundle)

- `ponytail-debt` — useful ledger harvester, but depends on `shortcut:` comment convention being adopted first. Defer to follow-on wave; bundling now adds process without producers.
- `ponytail-gain` — reporter/savings-view. Defer; audit's `Lean:` line already covers the minimum signal.
- `ponytail-help` — router/entry help. Defer; kit provisioning already selects defaults, a second router is indirection (Magic).
- `lite/full/ultra` levels inside core — not separate bundle entries; they are runtime arguments to core, documented in core pointer.

## 4. License confirmation

- License: MIT — CONFIRMED.
- Observed source 1 (frontmatter): `skills/ponytail/SKILL.md` at `dietrichgebert/ponytail` declares `license: MIT` in its YAML frontmatter (seat-fetched 2026-10-15).
- Observed source 2 (license text): `LICENSE` at `dietrichgebert/ponytail` on `main` is the standard MIT License, Copyright (c) 2026 DietrichGebert, fetched via `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/LICENSE`.
- Observed source 3 (bundle paths): `skills/ponytail/SKILL.md`, `skills/ponytail-review/SKILL.md`, `skills/ponytail-audit/SKILL.md` at `dietrichgebert/ponytail` (canonical `skills/...` path; local registry currently cites the `.openclaw/skills/...` alias — downstream must pin and hash one).
- Consequence: MIT permits use, copy, modify, merge, publish, distribute, sublicense, sell subject to preserving copyright + permission notice. Downstream bundle must retain attribution to `dietrichgebert/ponytail` and carry the MIT notice. No copyleft conflict with Arsenal Node-only ESM posture.

Grep anchor: `MIT confirmation: ponytail upstream is MIT per skills/ponytail/SKILL.md frontmatter and LICENSE`.

## 5. Dual guardrails for code-executing agents (verbatim reuse downstream)

Downstream specs, kit entries, and tests MUST copy the two quoted lines verbatim. Do not paraphrase. FLOOR prevents reckless laziness; CEILING prevents astronaut seniority.

### FLOOR — lazy, never reckless

> FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

Covers: tests for risky logic (branch, loop, parser, money, security, data write, new script/app, bug fix needs a failing-first test); error handling that prevents data loss is never cut; validation at trust boundaries is never cut; no skipped safety for brevity. Source-clause: upstream "Lazy code without its check is unfinished" + "Never cut" list.

### CEILING — senior, never astronaut

> CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

Covers: no gold-plating (unrequested features/options/flexibility); no speculative abstraction (one-implementation abstraction, wrapper, type conversion, boilerplate, "for later" code); no framework-for-one-use (never add a dependency/layer/framework/config for a few lines the stdlib/platform/codebase already covers). Source-clause: upstream "No abstraction, wrapper, type conversion, option, config, boilerplate or 'for later' code nobody asked for" + "Never add layers, frameworks or config the problem does not need".

Usage: paste both lines into the kit skill wrapper header. FLOOR is the build breaker (missing test/safety fails the guard). CEILING is the leanness breaker (added abstraction without a second caller fails the guard).

Grep anchors (exact, for CI):
- `FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."`
- `CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."`

## 6. Trade-offs and rejected alternatives

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Bundle scope | core + review + audit | core only | Core without gates ships fast breakage; review/audit are the quality close. Red flag avoided: Premature Optimization is not the issue — missing gates is. |
| Bundle scope | core + review + audit | all six (add debt/gain/help) | Extra routers/ledgers before `shortcut:` convention exists is Big Ball of Mud + Magic. Defer. |
| Sourcing | pointer-adopt upstream SKILL.md, pin hash | fork-and-rewrite bodies | Fork drifts, loses upstream benchmarks, violates adopt-don't-reinvent; pointer keeps single-writer (upstream owns text, kit owns lock entry). |
| Sourcing | canonical `skills/...` path pinned | keep `.openclaw/skills/...` alias silently | Alias drift breaks hash verification; pin one, document alias. |
| Guardrails | dual FLOOR + CEILING verbatim lines | single "be lazy" line | Single line collapses into reckless brevity (cuts tests) or astronaut seniority (adds framework). Two lines hold tension. Rejected: Golden Hammer (one rule for both failure modes). |
| Guardrails | normative copy-paste quotes | paraphrase per consumer | Paraphrase loses auditability; downstream grep test enforces verbatim match. |

Scalability posture: skill text is stateless; ships via kit provisioning (copy), grows horizontally with agent count; no cache; bottleneck is human review of Must-fix findings, bounded by audit max-20 rule.

## 7. Verification against dispatch constraints

- [x] Names bundled variants core + review + audit minimum with per-variant adopt-don't-reinvent rationale — Section 3.
- [x] Confirms MIT license with observed source (`dietrichgebert/ponytail` upstream path `skills/ponytail/SKILL.md` + `LICENSE`) — Section 4.
- [x] Quotes exact FLOOR wording (lazy, never reckless: tests for risky logic, error handling, no skipped safety for brevity) — Section 5.
- [x] Quotes exact CEILING wording (senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use) — Section 5.
- [x] Leaves only `RESEARCH-03-r0b-ponytail.md` at repo root; touches no `AGENT.md`/`WORKFLOW.md`/`RESEARCH-03.md`/sibling drafts/shared resources; no commit.

```
# ADR-001: Adopt upstream ponytail core + review + audit as pinned pointers with verbatim FLOOR/CEILING guardrails

## Context
Code-executing agents need a generation posture and two report-only gates without forking a philosophy prompt that will drift. Upstream dietrichgebert/ponytail already carries the calibrated preference order, Never-cut list, and Must/Should/Nice report contracts under MIT.

## Decision
Bundle `ponytail` + `ponytail-review` + `ponytail-audit` as hash-pinned pointers to `skills/.../SKILL.md` at `dietrichgebert/ponytail`; defer debt/gain/help; enforce verbatim FLOOR and CEILING lines from Section 5 in every downstream wrapper.

## Consequences
### Positive
Single-writer (upstream owns prose), auditable safety language (grep-testable), generation/gate separation of concerns, MIT-clean redistribution.

### Negative
Upstream moves require re-pin + re-verify; `.openclaw` vs `skills` path alias must be resolved downstream; FLOOR/CEILING strictness may annoy agents that prefer verbose scaffolds.

### Alternatives Considered
- Core-only bundle: rejected — no change-gate, ships breakage.
- All-six bundle: rejected — premature process, router indirection.
- Fork-and-rewrite: rejected — Not Invented Here in reverse (we would own drift); violates adopt-don't-reinvent.
- Single guardrail line: rejected — Golden Hammer; cannot hold lazy-vs-reckless and senior-vs-astronaut tension in one clause.

## Status
Accepted

## Date
2026-10-15
```
