# WORKFLOW.md

This file carries the standing methodology in Part A and the current-task
workflow in Part B. Part B turns over with the work; Part A changes only
with a dated revision note.

## Part A — Standing methodology

Seeded read live from the canonical copy at
`.opencode/skills/vantrilex-workflow-forge/assets/workflow-md-template.md`
on 2026-10-13; never written from memory.

### A1 — Methodology

Every task runs a written workflow fixed before the first dispatch. The
workflow names its phases in order, the gate that closes each phase, and
the done state. Execution never invents process mid-task: a step with no
written workflow waits for one.

### A2 — Roles

One orchestrator authors the workflow and dispatches; subagents execute
exactly one concern each. Only the orchestrator writes `AGENT.md` and
`WORKFLOW.md`. Who decides each gate is named in the workflow before the
phase starts.

### A3 — Precautions

No phase starts until its preconditions are observed and recorded: live
files read, kit in force confirmed, prior gate signed off. A claim
without its observation is not reported; a gate without evidence does
not pass.

### A4 — Repair states

A blocked gate stops the run before the next dispatch; a failed gate
returns the work to its owner with the evidence attached. Every repair
that moves standing method lands a dated note, and the run resumes only
on the condition the note states.

### A5 — Research

Before execution may start, the run reads what the task touches and
proves what it assumes: the live project files, the lock entries it will
inject, and the sources its workflow names. Nothing is reconstructed
from memory.

### A6 — Expanded thinking

Per-task extras live in Part B beside the task they serve, and only
while the task runs. Standing text stays lean: an extra that outlives
its task is either promoted to Part A with its dated note or cut.

### A7 — Kit loadout

Components inject per phase from the lock in force and prune at each
transition; the MCP cap holds as backstop. The lock entry decides what
injects — never an id alone, never a printed table.

### Revision notes

- 2026-10-13 — First seeding of this repo's own `WORKFLOW.md`: Part A
  copied read live from the forge canonical template; Part B written for
  the NODE DOG dogfood task. No methodology change, this is the baseline.
- 2026-10-14 — NODE T3 pointer merge: no methodology change. Part B turns over to the NODE T3 workflow; standing method stands as seeded.

## Part B — Current-task workflow

Task: `VTA-EXPANSION-02-RESUME` — resume the paused expansion order on branch `wt/vta-expansion-02` from `012e449` (`v0.4.1`): finish T1 (`theme` kind + `vantrilex-blazar` theme + schema v3), T3 (10-domain file-based RAG + `knowledge-hotfix.json` + `v06-api-plan.md`), T4 (`vantrilex-deep-understand` skill + `docs/dev/` microscopic dev docs), T5 (ECC takeaways: `manifests/install-profiles.json`, `docs/ar/`, `--ignore-scripts` hygiene, `docs/19-HARNESS-MATRIX.md`), then chain T2 (6 remaining kinds: `prompt`, `dataset`, `template`, `policy`, `benchmark`, `workflow`), verify all gates, and cut `v0.5.0`.

### 1 — Methodology

Four waves in dependency order, single-writer per resource:
- Wave 1 (parallel, disjoint write sets): `t1-theme-infra` (verify/complete T1 theme kind + schema v3 + catalog/lock sync), `t3-rag-apply` (materialize the 12 drafted RAG files into `registry/rag/`), `t4-deep-understand-apply` (materialize `.opencode/skills/vantrilex-deep-understand/SKILL.md` and `docs/dev/00-INDEX.md`..`08-WORKFLOWS-GATES.md`), `t5-ecc-takeaways` (verify/complete `manifests/install-profiles.json`, `docs/ar/`, `docs/19-HARNESS-MATRIX.md`, and `--ignore-scripts` in `scripts/*.sh`).
- Wave 2 (after Wave 1): verification nodes for Wave 1 + `t2-remaining-kinds` (chained after T1's v3 mechanism: add `prompt`, `dataset`, `template`, `policy`, `benchmark`, `workflow` kinds + exemplars + catalog/lock registration).
- Wave 3 (after Wave 2): `t2-verify` + `v-expansion-review` (code-reviewer full diff + census + zero-`model:` check).
- Wave 4 (after Wave 3): `int-v050-release` (CHANGELOG `v0.5.0`, six-gate suite, merge `--no-ff` to `main`, tag `v0.5.0`, push, verify release workflow).

### 2 — Roles

- Orchestrator (`blazar` on `opencode-go/gemini-4-argon-contributor`): owns plan, dispatches, `AGENT.md`, and `WORKFLOW.md`.
- Subagents (all dispatched on `opencode-go/deepseek-v4.1-flash` per §0A): `kit-maintainer` for `t1-theme-infra`, `t5-ecc-takeaways`, `t2-remaining-kinds`, and `int-v050-release`; `vantrilex-implementer` for `t3-rag-apply`, `t4-deep-understand-apply`, and verification nodes; `code-reviewer` for `v-expansion-review`; `vantrilex-guide` for phase-exit sign-off.

### 3 — Precautions

- `RESEARCH.md` verdicts govern: no native background-image key, no native auto-per-agent theme switching, no per-agent icon.
- Zero `model:` pins in any shipped agent, command, skill, or config file (`§0A` model routing is session execution only).
- Global allow-all preserved (`permissions: [{"action":"*","resource":"*","effect":"allow"}]`); the `policy` kind exemplar is the allow-all pack itself, never deny/ask gates.
- Single-writer law enforced between T1 (Wave 1) and T2 (Wave 2) on `registry/schema/`, `registry/VANTRILEX_CATALOG.md`, `registry/catalog.json`, `scripts/generate-catalog-json.mjs`, and `scripts/verify-kit.mjs`.

### 4 — Repair states

- If `opencode-go/deepseek-v4.1-flash` hits a usage/quota limit: stop dispatching new workers immediately, report affected and completed nodes to the owner, and wait for the owner's replacement pick.
- If a node fails verification for a non-quota reason: return to its owner with the failure output and a materially changed hypothesis (max 2 repair rounds, then escalate to the owner with the exact blocker).

### 5 — Research

- `RESEARCH.md` (completed in R0 on `wt/vta-expansion-02`) is the binding source for §2 (T1) and §4 (T3). No re-run of R0.

### 6 — Expanded thinking

Stop for broad verification before Wave 2 (`t2-remaining-kinds`) starts, confirming T1's schema v3 extensible kind mechanism passes `verify-registry.mjs` and `generate-catalog-json.mjs --check`, and again before Wave 4 (`int-v050-release`), confirming census counts, zero `model:` pins, and all new-kind verifiers pass.

### 7 — Kit loadout

- `scout`: `vantrilex-vanguard`, `vantrilex-prime`, `vantrilex-workflow-forge`
- `docs`: `technical-writer`, `documentation-as-tests`
- `build`: `tdd`, `typescript-lsp` (need-label: `npx tsc --noEmit`)
- `review`: `code-reviewer`, `red-team`
- `operate`: `vantrilex-doctrine`, `github-release-packager`
