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

Task: `VTA-EXPANSION-03` — one order, version-gated v0.6.0 → v0.6.5 → v0.7.0 from `main` at the v0.5.0 post-release commit. R0 research (`RESEARCH-03.md`) gates all building. v0.6.0: six V-commands + atomic agent+theme switch + per-agent theme registry + core install skill + ponytail bundle. v0.6.5: 8th `design.md` kind + 84 bundled files + exemplar. v0.7.0: 13 `Vantrilex-*` SIDE agents + V-commands + §0B guardrails. Each version merges, tags, and announces SEPARATELY before the next begins.

### 1 — Methodology

Thirty-five waves in dependency order, single-writer per resource, one version released at a time (W11–W18 amended by VTA-EXPANSION-04; P1–P3 extended by VTA-EXPANSION-05):
- W1: `b-branch` cuts `wt/vta-expansion-03` from `main` at the v0.5.0 post-release commit.
- W2 (parallel, disjoint artifacts): R0 research — `r0a-hooks-probe`, `r0b-ponytail-intake`, `r0c-design-inventory`, `r0d-agent-sources`.
- W3: `r0-synth` merges the four inputs into `RESEARCH-03.md` (sole writer). No build wave starts until R0 verdicts are read.
- W4–W7 (v0.6.0): authors (`v60-commands`, `v60-atomic-switch`, `v60-ponytail`, disjoint sets) → `v60-register` (sole writer of lock/catalog/schema/generators) → verify (`v60-verify`, `v60-security`, read-only, parallel) → `int-v060-release` (CHANGELOG, six gates, merge `--no-ff`, tag `v0.6.0`, push, release workflow).
- W8–W10 (v0.6.5): `d65-bundle` (sole writer: kind + 84 files + exemplar + registration) → `d65-verify` (read-only) → `int-v065-release`.
- W11–W18 (v0.7.0, AMENDED 2026-10-15 by VTA-EXPANSION-04 — starts ONLY after v0.6.5 announce + independent verify + owner release): `r0-reach` (source reachability → `SOURCES.md`, GONE→park, nothing builds until it reports) → T1 authors (`t1-typescript`, `t1-python`, `t1-fixer`, `t1-reviewer`, `t1-ui`, `t1-ux`, disjoint files, parallel) → T2 authors (`t2-github`, `t2-verifier`, `t2-librarian`, `t2-releaser`, `t2-scribe`, `t2-harness`, `t2-scout`, disjoint files, parallel) → T3 (`t3-sec-auditor` + `t3-supersede` + `t3-releaser-wire`, parallel) → `t4-controls` (sole writer: worker-only line, kit-awareness, missing-tooling protocol, ponytail matrix, D2=A switch conversion) → `a70-register` (sole writer) → verify (`a70-verify`, `a70-security`, `a70-redteam` incl. both negative probes, read-only, parallel) → `int-v070-release` (fresh-clone semantics, explicit announce + PARKED list).
- P1 7.5 AETHER+PULSAR (W19–W24, EXTENDED 2026-10-15 by VTA-EXPANSION-05 — starts on owner go after v0.7.0 release): `p1-r0` (D4 hook interception + permission semantics + temperature/pinning; IMPOSSIBLE→PARKED, gates everything) → authors (`p1-aether` + `p1-pulsar` + `p1-validator` + `p1-planguard`, disjoint, parallel) → integrators (`p1-shared` edits leader docs, `p1-wake`, `p1-drills`, `p1-rename`, parallel) → `p1-register` (sole writer) → verify (`p1-verify` + `p1-redteam`, read-only) → `int-v075-release` (tag v0.7.5, announce, wait owner go).
- P2 7.6 BLAZAR RETOOL (W25–W30 — starts on owner go after v0.7.5 release): `p2-r0` (handshake sample plan + hook maturity + roster inventory) → `p2-retool` (sole writer of blazar.md + companion config: prompt surgery + 13-allowlist + forge removal + refusal capsule + plan-guard extension) → `p2-intake` + `p2-ponytail` + `p2-negctrl` + `p2-docs` (parallel) → `p2-register` (sole writer) → verify (`p2-verify` + all negative-control proofs green) → `int-v076-release` (tag v0.7.6, announce, wait owner go).
- P3 7.7 RELAY (W31–W35 — starts on owner go after v0.7.6 release): `p3-r0` (Notion API vs queue schema + hook reachability; IMPOSSIBLE→PARKED, gates everything) → `p3-queue` (owner-Notion T1; blocked-for-owner path if connection unavailable — schema + steps, never faked) + `p3-skill` + `p3-hooks` (registered DISABLED, dry_run) + `p3-installpack` (owner-run, never run by us) → `p3-trial` (CONDITIONAL — only on owner start word) → `p3-verify` (schema/dry_runs/malformed-row/quarantine proofs + six gates) → `int-v077-release` (tag v0.7.7, announce, close program plainly).
- Plan-once DAG (every node carries all nine fields; a node missing one is not dispatched):

| id | concern (one sentence) | owner | inputs | acceptance | verification | artifact | wave | depends_on |
|---|---|---|---|---|---|---|---|---|
| `b-branch` | Cut the work branch from `main` at the v0.5.0 post-release commit with a clean tree. | `kit-maintainer` | `AGENT.md`, `WORKFLOW.md` | Branch `wt/vta-expansion-03` exists, `HEAD` equals the v0.5.0 post-release commit, tree clean except intended untracked research files. | `git rev-parse --abbrev-ref HEAD` + `git log --oneline -1` + `git status --porcelain` | Branch ref `wt/vta-expansion-03` (+ `HEAD` printout in report) | 1 | none |
| `r0a-hooks-probe` | Probe whether current OpenCode exposes any agent-switch/session-start/theme hook and verdict native auto-switch POSSIBLE/WORKAROUND/IMPOSSIBLE. | `explore` (thoroughness: `very thorough`) | Live repo tree, OpenCode docs/changelog in scope | Verdict line POSSIBLE/WORKAROUND/IMPOSSIBLE with hook-surface evidence per candidate; no build recommendation beyond the verdict. | File exists + verdict line grep present | `RESEARCH-03-r0a-hooks.md` | 2 | `b-branch` |
| `r0b-ponytail-intake` | Evaluate ponytail variants to bundle (core + review + audit minimum) and author the exact §0B FLOOR/CEILING guardrail wording. | `architect` | `RESEARCH-03-r0a-hooks.md` (no), ponytail upstream `skills/ponytail/SKILL.md` | Variants selected with adopt-don't-reinvent rationale; guardrail wording quoted verbatim for reuse; license MIT confirmed. | File exists + MIT + guardrail quote present | `RESEARCH-03-r0b-ponytail.md` | 2 | `b-branch` |
| `r0c-design-inventory` | Inventory the 84 awesome-design-md DESIGN.md files with license reconfirmation (MIT) and attribution data. | `explore` (thoroughness: `very thorough`) | Upstream awesome-design-md listing | Count 84 recounted live (never transcribed), MIT reconfirmed, file list with attributions. | File exists + `84` census with counting command in report | `RESEARCH-03-r0c-design.md` | 2 | `b-branch` |
| `r0d-agent-sources` | Record ONE real internet agent per each of the 13 specialties with source URL + what ours does better. | `explore` (thoroughness: `very thorough`) | Web sources (subagent-side fetch) | 13 rows: specialty, source URL, improvement note; URLs live at write time. | File exists + 13 URLs greppable | `RESEARCH-03-r0d-agents.md` | 2 | `b-branch` |
| `r0-synth` | Synthesize the four R0 inputs into binding `RESEARCH-03.md` whose verdicts gate everything downstream. | `technical-writer` | Four `RESEARCH-03-r0*.md` files | All four verdict sections present; R0a verdict explicit; guardrail wording carried verbatim; 84-file census and 13 agent rows carried with sources. | `npx --yes markdownlint-cli RESEARCH-03.md` exit 0 | `RESEARCH-03.md` | 3 | `r0a-hooks-probe`, `r0b-ponytail-intake`, `r0c-design-inventory`, `r0d-agent-sources` |
| `v60-commands` | Author the six V-commands per improved specs with deterministic paths and content/model split. | `kit-maintainer` | `RESEARCH-03.md`, `AGENT.md` specs | Six files exist (`V-FULL-AUDIT` 14-section REPORT-SPEC/Law-13 numbering, `V-CATALOG`, `V-RAG`, `V-DOCTOR`, `V-PROFILE`, `V-HTML_DESIGN` + `--index`); zero `model:` pins; content/model split holds. | `node scripts/verify-skills.mjs` + markdownlint on the six files, exits 0 | Six files under `.opencode/commands/` (anchor: `V-FULL-AUDIT.md`) | 4 | `r0-synth` |
| `v60-atomic-switch` | Implement the R0a verdict: native auto-switch if POSSIBLE, else the atomic V-`<Agent>` command as the mechanism (documented honestly as such). | `architect` | `RESEARCH-03.md` (R0a verdict binding) | V-`<Agent>` commands switch agent AND theme together; per-agent registry colors hold (BLAZAR dark royal blue reserved; code=blue shades, design=gold, external=purple, kit=flame red, research=green, distinct shade per agent); mechanism matches R0a verdict with no native-switch claim if WORKAROUND/IMPOSSIBLE. | `node scripts/verify-kit.mjs` exit 0 + registry file parses | V-`<Agent>` switch commands (anchor: `V-Blazar.md`) + per-agent theme registry file | 4 | `r0-synth` |
| `v60-ponytail` | Bundle ponytail (MIT, adopt don't reinvent) with the §0B dual-guardrail wiring for code-executing agents. | `kit-maintainer` | `RESEARCH-03.md` (R0b wording binding) | Upstream skill present with attribution; FLOOR/CEILING wording wired per R0b; no reinvented duplicate. | `node scripts/verify-skills.mjs` exit 0 | `.opencode/skills/ponytail/SKILL.md` + guardrail wiring | 4 | `r0-synth` |
| `v60-register` | Register all v0.6.0 components in lock/catalog/schema/generators/verifiers as SOLE writer. | `kit-maintainer` | W4 author outputs | Lock/catalog agreement; new commands+themes+skill registered; no other node writes these files in this wave. | `node scripts/verify-registry.mjs` + `node scripts/generate-catalog-json.mjs --check` + `node scripts/verify-kit.mjs`, exits 0 | `kit/kit.lock` (+ regenerated `registry/catalog.json`) | 5 | `v60-commands`, `v60-atomic-switch`, `v60-ponytail` |
| `v60-verify` | Independently verify all v0.6.0 landings on disk with zero-`model:` proof and live census recount. | `code-reviewer` | Full W4–W5 outputs (read-only) | Every shipped file verified; `^\s*model:` grep zero hits in shipped files; census recounted with commands; allow-all preserved. | Same six-gate set as release, exits 0, outputs quoted | `RESEARCH-03.md` (untouched; read-only anchor) | 6 | `v60-register` |
| `v60-security` | Security-audit all v0.6.0 generated code and commands. | `ai-generated-code-security-auditor` | Full W4–W5 outputs (read-only) | No hardcoded secrets, no destructive default without backup/confirm, findings with file:line + severity. | Audit checklist green; verdict line in report | `RESEARCH-03.md` (untouched; read-only anchor) | 6 | `v60-register` |
| `int-v060-release` | Cut v0.6.0: CHANGELOG section, six gates, census recount, merge `--no-ff`, tag `v0.6.0`, push, confirm release workflow. | `kit-maintainer` | Verified W4–W5 outputs + verify reports | Gates green; census recounted live; merge commit + tag `v0.6.0` pushed; release run success. | Six gates re-run post-merge, exits 0 + `gh run list` success | `CHANGELOG.md` (`v0.6.0` section) + tag `v0.6.0` | 7 | `v60-verify`, `v60-security` |
| `d65-bundle` | Extend schema v3 with the 8th `design.md` kind and bundle all 84 DESIGN.md files (MIT, attribution) with one end-to-end exemplar, as SOLE writer. | `kit-maintainer` | `RESEARCH-03.md` (R0c inventory binding) | 84 files recounted live; exemplar wired end-to-end; lock/catalog agreement; zero `model:` pins. | `node scripts/verify-registry.mjs` + `--check` + `node scripts/verify-kit.mjs`, exits 0 | `registry/design/` exemplar (anchor) + sidecar (84 rows) | 8 | `int-v060-release` |
| `d65-verify` | Independently verify the design.md kind landing with recount and zero-`model:` proof. | `code-reviewer` | W8 outputs (read-only) | 84/84 files present; sidecar rows match; exemplar end-to-end proven. | Verifiers exit 0, outputs quoted | `RESEARCH-03.md` (untouched; read-only anchor) | 9 | `d65-bundle` |
| `int-v065-release` | Cut v0.6.5 with the same release discipline as v0.6.0. | `kit-maintainer` | Verified W8 output + verify report | Gates green; census recounted; tag `v0.6.5` pushed; release run success. | Six gates post-merge exits 0 + `gh run list` success | `CHANGELOG.md` (`v0.6.5` section) + tag `v0.6.5` | 10 | `d65-verify` |
| `r0-reach` | Fetch every §2–§4 source URL and verdict REACHABLE/MOVED/GONE per source in `SOURCES.md`. | `explore` | Source URL lists in the order (§2 T1/T2 specs, §4 T3-1) | `SOURCES.md` carries one verdict per source with the fetched proof (file/section observed); GONE sources name the parked agent; no replacement source invented; nothing built. | File exists + every source has exactly one verdict line (grep quoted) | `SOURCES.md` | 11 | `int-v065-release` |
| `t1-typescript` | Author `Vantrilex-TypeScript.md` ( kit platform truth, tsc hard gate, no-any escalation, ponytail bound, consistency-first). | `kit-maintainer` | `SOURCES.md` (wshobson verdict) + `RESEARCH-03.md` | Five improvements present; kit-awareness names verifiers/RAG-08/catalog; worker-only line present; zero `model:` pins. | `node scripts/verify-skills.mjs` + markdownlint, exits 0 | `.opencode/agents/Vantrilex-TypeScript.md` | 12 | `r0-reach` |
| `t1-python` | Author `Vantrilex-Python.md` (ruff gate, uv/venv hygiene, ponytail, kit-CLI-first, async-first). | `kit-maintainer` | `SOURCES.md` verdict + `RESEARCH-03.md` | Five improvements present; kit-awareness block by name; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Python.md` | 12 | `r0-reach` |
| `t1-fixer` | Author `Vantrilex-Fixer.md` (RAG-05-first diagnosis, debug journal, escalate-to-LEADER after 3, gate re-run, minimal diff; INVESTIGATE-ONLY vs FIND-AND-FIX from brief). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Five improvements + both modes present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Fixer.md` | 12 | `r0-reach` |
| `t1-reviewer` | Author `Vantrilex-Reviewer.md` (KIT-LAW review, JSONL findings, read-only, gate-calibrated severity, file:line tracing; `ponytail-review`). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Five improvements present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Reviewer.md` | 12 | `r0-reach` |
| `t1-ui` | Author `Vantrilex-UI-Designer.md` (mandatory ONE DESIGN.md brand, theme compliance, code-ready HTML/CSS, kit-first, WCAG 2.1 AA floor). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Five improvements present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-UI-Designer.md` | 12 | `r0-reach` |
| `t1-ux` | Author `Vantrilex-UX-Designer.md` (research+brief split with handoff artifact, evidence labels, Arabic/RTL native, cost-noted feasibility, never executes visuals). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Five improvements present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-UX-Designer.md` | 12 | `r0-reach` |
| `t2-github` | Author `Vantrilex-GitHub.md` (side-agent doctrine, 2-cycle cap, circuit-breaker, destructive-ops ladder, push/tag/merge refusals). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Doctrine + refusals present; ponytail conditional on code-writing nodes; worker-only line; zero `model:` pins. | `node scripts/verify-skills.mjs` + markdownlint, exits 0 | `.opencode/agents/Vantrilex-GitHub.md` | 13 | `r0-reach` |
| `t2-verifier` | Author `Vantrilex-Verifier.md` (tri-state verdicts, verdict ledger, failure taxonomy, delta mode, repair-boundary dossier; full gate-run list; never repairs). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Gate list + refusals + subagent/edit-deny frontmatter present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Verifier.md` | 13 | `r0-reach` |
| `t2-librarian` | Author `Vantrilex-Librarian.md` (version-range rubric, integrity gate, evidence bundles, drift tables, cheap-model routing; propose-only). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Refusals (never invent IDs/writes) present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Librarian.md` | 13 | `r0-reach` |
| `t2-releaser` | Author `Vantrilex-Releaser.md` (PREP ONLY feeding `github-release-packager`; version-from-commits; five-gate pre-handoff; never-push refusal core). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Never-publish refusal present; terminal-prep wave position stated; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Releaser.md` | 13 | `r0-reach` |
| `t2-scribe` | Author `Vantrilex-Scribe.md` (EN→AR parity same cycle, RFC 2119, self-run pre-gates, index discipline, last_verified honesty). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Refusals (never invent/never code/never EN-without-AR) present; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Scribe.md` | 13 | `r0-reach` |
| `t2-harness` | Author `Vantrilex-Harness.md` (reproduction-first, kit-kind attack catalog, blast-radius discipline, exploitability severity, never fixes). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Attack catalog + edit-deny present; ponytail FULL bound; worker-only line; zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/Vantrilex-Harness.md` | 13 | `r0-reach` |
| `t2-scout` | Author `Vantrilex-Scout.md` (PROJECT-BRIEF schema, budget-gated recon, risks differentiator, read-only, no recommendations). | `kit-maintainer` | `SOURCES.md` verdicts + `RESEARCH-03.md` | Schema + refusals present; ponytail exempt (read-only); worker-only line; zero `model:` pins. [DEFAULT D3 recorded: shared instrument, BLAZAR allow-list excludes Scout.] | Same checks, exits 0 | `.opencode/agents/Vantrilex-Scout.md` | 13 | `r0-reach` |
| `t3-sec-auditor` | Author `Vantrilex-Security-Auditor.md` (ember shade, KIT; boundary map vs Reviewer/Harness; JSONL CWE+OWASP findings; edit-deny/shell-deny). | `kit-maintainer` | `SOURCES.md` verdicts + kit `ai-generated-code-security-auditor.md` | Boundary map + full refusal set present; Auditor never audits kit machinery; worker-only line; zero `model:` pins. | `node scripts/verify-skills.mjs` + markdownlint, exits 0 | `.opencode/agents/Vantrilex-Security-Auditor.md` | 14 | `t1-reviewer`, `t2-harness` |
| `t3-supersede` | Remove or re-scope the locked generic `technical-writer` and `.opencode/agents/ai-generated-code-security-auditor.md` so exactly one authority each remains. | `kit-maintainer` | T1/T2 author outputs (Scribe + Security-Auditor exist) | Grep proves exactly one doc authority (Scribe) and one audit authority (Security-Auditor); lock/catalog agreement holds. | Four verifiers, exits 0 | `kit/kit.lock` (supersession rows) | 14 | `t2-scribe`, `t3-sec-auditor` |
| `t3-releaser-wire` | State the prep-only boundary as a REFUSAL in the Releaser prompt, the `github-release-packager` skill doc, and the order notes. | `kit-maintainer` | `t2-releaser` output + packager skill doc | Refusal in all three places with identical semantics; packager remains the sole release executor. | markdownlint on touched docs, exit 0 | Releaser prompt + packager doc (refusal lines) | 14 | `t2-releaser` |
| `t4-controls` | Apply cross-cutting controls as SOLE writer: worker-only line, kit-awareness, missing-tooling protocol, ponytail matrix in all 14 prompts; D2=A switch conversion (side-agent V-switches removed or consult-mode). | `kit-maintainer` | All 14 author outputs | All 14 carry the four blocks verbatim; no session can make a side agent primary-by-position (conversion complete); no invented identifiers. | `node scripts/verify-skills.mjs` + full `model:` grep (zero hits), exits 0 | All 14 agent files (control lines) | 15 | `t3-sec-auditor`, `t3-supersede`, `t3-releaser-wire` |
| `a70-register` | Register all 14 agents (+ surviving command set after D2=A conversion and supersession removals) as SOLE writer. | `kit-maintainer` | T1/T2/T3/T4 outputs | 14 agents registered; lock/catalog agreement; census grows by exactly the shipped set minus superseded rows. | Four verifiers, exits 0 | `kit/kit.lock` (+ regenerated `registry/catalog.json`) | 16 | `t4-controls` |
| `a70-verify` | Independently verify all 14 landings: conformance probes per agent (kit-awareness, worker-only, refusals, ponytail binding) + exact census recount. | `code-reviewer` | W11–W16 outputs (read-only) | 14/14 probes green; census live-recounted (agents + commands + 84 design files); zero `model:` pins. | Verifiers exit 0, outputs quoted | `RESEARCH-03.md` (untouched; read-only anchor) | 17 | `a70-register` |
| `a70-security` | Security-audit all 14 agents' commands and code paths. | `ai-generated-code-security-auditor` | W11–W16 outputs (read-only) | Findings with file:line + severity or clean verdict. | Audit checklist green | `RESEARCH-03.md` (untouched; read-only anchor) | 17 | `a70-register` |
| `a70-redteam` | Adversarial review of the full v0.7.0 diff + BOTH negative probes (Releaser-publish refusal; side-agent-primary refusal), ranked findings, never fixes. | `red-team` | Full branch diff (read-only) | Both negative probes green with transcripts; ranked findings or clean. | Review verdict line in report | `RESEARCH-03.md` (untouched; read-only anchor) | 17 | `a70-register` |
| `int-v070-release` | Cut v0.7.0 with fresh-clone semantics and the explicit announce (hashes, tag, release URL, gates, 14-agent + controls + supersession summary, PARKED list). | `kit-maintainer` | Verified W11–W16 outputs + all W17 reports | Six gates green incl. fresh-clone check; tag `v0.7.0` pushed; release run success; no manufactured follow-up after verification. | Six gates post-merge exits 0 + `gh run list` success | `CHANGELOG.md` (`v0.7.0` section) + tag `v0.7.0` | 18 | `a70-verify`, `a70-security`, `a70-redteam` |
| `p1-r0` | Prove D4 hook interception (POSSIBLE/WORKAROUND/IMPOSSIBLE, cited) + permission semantics + temperature/pinning on the live version. | `explore` | Live OpenCode surface (subagent-side fetch) | One verdict per item with citations; IMPOSSIBLE items named PARKED, never designed around. | Verdict file exists + citations greppable | `P1-R0.md` | 19 | `int-v070-release` |
| `p1-aether` | Author AETHER (planning leader, proper name): L1 allowlist frontmatter, PREPARE→PLAN→STOP, MISSION-PLAN anatomy, ledger, replan-cap-3, temperature 0.1 + V-AETHER + leader-tier theme. | `kit-maintainer` | `P1-R0.md` verdicts | Lifecycle never executes; capsule-content-is-data; theme distinct from BLAZAR + five families; zero `model:` pins. | `verify-skills.mjs` + markdownlint, exits 0 | `.opencode/agents/AETHER.md` (+ V-AETHER + theme) | 20 | `p1-r0` |
| `p1-pulsar` | Author PULSAR (exploration leader): hypothesis-first, findings-capsule schema, budget-box, →AETHER-only chain, refusal protocol, temperature 0.1 + V-PULSAR + theme. | `kit-maintainer` | `P1-R0.md` verdicts | Chain discipline explicit (never raw →BLAZAR); zero `model:` pins. | Same checks, exits 0 | `.opencode/agents/PULSAR.md` (+ V-PULSAR + theme) | 20 | `p1-r0` |
| `p1-validator` | Author the universal capsule validator schema family + validation script, wired into all capsule flows. | `kit-maintainer` | `P1-R0.md` | Script exits 0 on valid capsules, nonzero with reasons on invalid; zero `model:` pins. | Script self-test quoted, exit codes | Validator script + schema files | 20 | `p1-r0` |
| `p1-planguard` | Extend `.opencode/plugins/vantrilex-guards.ts` with the plan-guard (briefs vs actual plan doc); detective fallback honestly documented if R0 failed. | `kit-maintainer` | `P1-R0.md` (D4 verdict binding) | No HARD claim if verdict is WORKAROUND/IMPOSSIBLE; `tsc` clean. | `npx tsc --noEmit -p tsconfig.json` exit 0 | Plugin plan-guard extension | 20 | `p1-r0` |
| `p1-shared` | Write Scout P0-recon vs §EXPLORE boundaries + Librarian section-citation into all three leaders' docs, hook-enforced. | `kit-maintainer` | `p1-aether`, `p1-pulsar` outputs (W20 done) | Boundaries identical in all three docs; D3 recorded; zero `model:` pins. | markdownlint, exit 0 | Leader-doc shared sections | 21 | `p1-aether`, `p1-pulsar` |
| `p1-wake` | Author WAKE-REQUEST channel spec + OVERRIDE logging with the D5 never-suppress-verdicts bright line. | `kit-maintainer` | `P1-R0.md` | Bright line verbatim; zero `model:` pins. | markdownlint, exit 0 | Wake/override protocol docs | 21 | `p1-aether`, `p1-pulsar` |
| `p1-drills` | Run refusal drills + triumvirate integration test (P0→plan→EXPLORE→findings→plan-v2; BLAZAR boundary via stub) with a clean drill log. | `red-team` | `p1-aether`, `p1-pulsar`, `p1-validator` outputs | Every drill shows a verified denial; integration test passes with boundary observed. | Drill log with transcripts | Drill log file | 21 | `p1-aether`, `p1-pulsar`, `p1-validator` |
| `p1-rename` | Deliver the rename checklist + V-FULL-AUDIT re-homing note (AETHER plans → BLAZAR executes, post-7.5). | `kit-maintainer` | W20 outputs | Checklist complete; re-homing note states the handoff without editing shipped command content. | markdownlint, exit 0 | Rename checklist + note | 21 | `p1-aether`, `p1-pulsar` |
| `p1-register` | Register all P1 components as SOLE writer (lock/catalog/schema/generators/verifiers). | `kit-maintainer` | W20–W21 outputs | Lock/catalog agreement; exact delta reported live. | Four verifiers, exits 0 | `kit/kit.lock` (+ catalog) | 22 | `p1-shared`, `p1-wake`, `p1-drills`, `p1-rename` |
| `p1-verify` | Verify P1: permission audit exact, capsule schema green, drill log clean, census recount, zero pins. | `code-reviewer` | W20–W22 outputs (read-only) | Allowlists exact; negative controls green. | Verifiers exit 0, quoted | `RESEARCH-03.md` (anchor, untouched) | 23 | `p1-register` |
| `p1-redteam` | Adversarial review of the P1 diff; ranked findings, never fixes. | `red-team` | Full P1 diff (read-only) | Findings or clean with verdict line. | Verdict line in report | `RESEARCH-03.md` (anchor, untouched) | 23 | `p1-register` |
| `int-v075-release` | Cut v0.7.5, announce, wait owner go for P2. | `kit-maintainer` | Verified P1 outputs + W23 reports | Six gates green; tag `v0.7.5` pushed; run success. | Gates + `gh run list` success | `CHANGELOG.md` + tag `v0.7.5` | 24 | `p1-verify`, `p1-redteam` |
| `p2-r0` | Validate BLAZAR plan-intake against a real sample AETHER plan + hook maturity re-check + roster inventory (allowlist == agents that exist). | `explore` | Sample AETHER plan (P1 output) + live tree | Contract conformance verdict per checklist item; roster gaps named, never papered. | Checklist with verdicts | `P2-R0.md` | 25 | `int-v075-release` |
| `p2-retool` | SOLE writer of blazar.md + companion config: Build-Leader identity, Plan-Intake gate, wave-derivation §4, 14-agent roster (Scout restricted), 13-allowlist, ponytail added, forge removed, refusal capsule, plan-guard extension. | `kit-maintainer` | `P2-R0.md` | Law reads "derive waves, dispatch everything, execute nothing, plan nothing"; no leaders/general/Scout in allowlist. | `verify-kit.mjs` + markdownlint, exits 0 | `.opencode/agents/blazar.md` + companion config | 26 | `p2-r0` |
| `p2-intake` | Author the 10-field checklist + PLAN-INCOMPLETE capsule + versioned-diff amendment protocol (re-validate affected waves only). | `kit-maintainer` | `p2-retool` output (W26 done) | Checklist is 10 fields exactly; amendment scope rule explicit. | markdownlint, exit 0 | Intake/amendment docs | 27 | `p2-retool` |
| `p2-ponytail` | Write ponytail compliance: doctrine brief line, trailer requirement, Verifier two-sided checklist, Reviewer checklist, mechanical non-trivial definition. | `kit-maintainer` | v0.7 agent files (P0 outputs) | Checklists enforceable word-for-word; zero `model:` pins. | markdownlint, exit 0 | Compliance docs + prompt lines | 27 | `p2-retool` |
| `p2-negctrl` | Run all four negative-control probes (gapped-plan, cross-section, vacuous-trailer, missing-field) to verified escalate/refuse/re-dispatch. | `red-team` | `p2-retool`, `p2-intake`, `p2-ponytail` outputs | ALL four pass with transcripts; a fail returns to owner, never reworded. | Probe transcripts green | Negative-control log | 27 | `p2-retool`, `p2-intake`, `p2-ponytail` |
| `p2-docs` | Update AGENT.md/WORKFLOW.md + migration note (what moved to AETHER) + V-Blazar wiring. | `kit-maintainer` | `p2-retool` output | Migration note complete; state files true. | markdownlint, exit 0 | Docs updates + note | 27 | `p2-retool` |
| `p2-register` | Register all P2 changes as SOLE writer. | `kit-maintainer` | W26–W27 outputs | Agreement holds; delta reported live. | Four verifiers, exits 0 | `kit/kit.lock` (+ catalog) | 28 | `p2-intake`, `p2-ponytail`, `p2-negctrl`, `p2-docs` |
| `p2-verify` | Verify P2: six gates + ALL negative-control proofs green + census recount. | `code-reviewer` | W26–W28 outputs (read-only) | Proofs quoted, not summarized. | Verifiers exit 0, quoted | `RESEARCH-03.md` (anchor, untouched) | 29 | `p2-register` |
| `int-v076-release` | Cut v0.7.6, announce, wait owner go for P3. | `kit-maintainer` | Verified P2 outputs + verify report | Six gates green; tag `v0.7.6` pushed; run success. | Gates + `gh run list` success | `CHANGELOG.md` + tag `v0.7.6` | 30 | `p2-verify` |
| `p3-r0` | Validate the Notion API against the queue schema (create/query/update) + hook reachability (cron fallback documented if unreachable). | `architect` | Owner Notion integration (subagent-side) | Per-field conformance verdict; IMPOSSIBLE→PARKED with reason. | Verdict file with proof | `P3-R0.md` | 31 | `int-v076-release` |
| `p3-queue` | Deliver relay-queue database + board view; if owner connection unavailable, exact schema + setup steps, marked blocked-for-owner, never faked. | `architect` | `P3-R0.md` | Either live database or honest blocked report — never a fake. | Database link or blocked report | Notion database or schema doc | 32 | `p3-r0` |
| `p3-skill` | Author relay-protocol skill (SKILL.md + RELAY-SCHEMA + MESSAGE-TYPES + POLL + SEND + TRIAGE + TIMEOUTS + SECURITY); alerts UUID from install-time config, never hardcoded. | `kit-maintainer` | `P3-R0.md` + queue schema | Capsule discipline + bridge bans + quarantine rule present; no chat id hardcoded. | `verify-skills.mjs` + markdownlint, exits 0 | `.opencode/skills/relay-protocol/` | 32 | `p3-r0` |
| `p3-hooks` | Author poll (180s/300s quiet) + watchdog (60s) hooks, registered DISABLED, dry_run both before delivery. | `kit-maintainer` | `P3-R0.md` | Disabled-by-default proven; approval rows always alert, never auto-approve. | Dry_run transcripts green | Hook files (disabled) | 32 | `p3-r0` |
| `p3-installpack` | Write the owner-run install pack (ClawHub Notion skill + relay skill + 60s poll loop), written FOR the owner, never run by us. | `technical-writer` | `p3-skill`, `p3-hooks` outputs | Runnable by the owner mechanically; no execution on our side. | markdownlint, exit 0 | Install-pack doc | 32 | `p3-r0` |
| `p3-trial` | CONDITIONAL live trial — dispatched ONLY on the owner start word; enable hooks, one real session, tune. | `kit-maintainer` | Owner start word + W32 outputs | Trial transcript with tune list, or NOT-RUN if no start word (never forced). | Trial log or held status | Trial log | 33 | `p3-queue`, `p3-skill`, `p3-hooks`, `p3-installpack` |
| `p3-verify` | Verify P3: schema conformance, dry_runs, malformed-row→invalid+alert proof, quarantine proof, six gates, census, zero pins. | `code-reviewer` | W32–W33 outputs (read-only) | All proofs quoted. | Verifiers exit 0, quoted | `RESEARCH-03.md` (anchor, untouched) | 34 | `p3-trial` |
| `int-v077-release` | Cut v0.7.7, announce, close the program plainly. | `kit-maintainer` | Verified P3 outputs + verify report | Six gates green; tag `v0.7.7` pushed; run success; no manufactured follow-up. | Gates + `gh run list` success | `CHANGELOG.md` + tag `v0.7.7` | 35 | `p3-verify` |

### 2 — Roles

- Orchestrator (`blazar`, this session, `opencode-go/muse-spark-1.3-contributor`): owns plan, DAG, dispatches, verification of landings, integration order, `AGENT.md`, `WORKFLOW.md`. Executes nothing.
- Authors: `kit-maintainer` (branch, commands, ponytail bundle, design bundle, all 13 agents, all registrations, all three releases); `architect` (ponytail intake evaluation, atomic-switch implementation); `technical-writer` (R0 synthesis).
- Research: `explore` (`r0a`, `r0c`, `r0d` with stated thoroughness); `architect` (`r0b` evaluation).
- Verification/review: `code-reviewer` (all three verify nodes); `ai-generated-code-security-auditor` (v0.6.0 + v0.7.0 audits); `red-team` (v0.7.0 adversarial review only, never fixes).
- Never dispatched: `general` (fallback only with one-line reason + owner routing decision — none foreseen: every node above binds a named specialist), `vantrilex-guide`/`vantrilex-implementer`/`vantrilex-leader` (present as kit files but outside this seat's subagent allow-list; their lanes are not this run's), `build`/`plan` primaries (disabled), self (`blazar`).
- Model routing (§0A, session only, never into kit files): every dispatch passes `opencode-go/muse-spark-1.3-contributor` explicitly. DeepSeek V4.1 Flash is fallback ONLY on Spark limit — then stop, report, wait. Argon NEVER.

### 3 — Precautions

- `RESEARCH-03.md` verdicts govern: no build wave (W4+) starts until W3 lands and its verdicts are read; R0a decides native vs command switch; R0b wording is the §0B text; R0c census bounds the 84-file bundle; R0d sources bound agent provenance.
- Zero `model:` pins in any shipped file (§0A routing is session execution only); zero-`model:` proof re-verified per version (W6, W9, W13).
- Global allow-all preserved; the `policy` exemplar stays allow-only; owner identity shipped verbatim wherever identity ships: `Omar Bahaa, the creator, is Vantrilex himself, and he is the leader of a team called Midad (مداد).`
- Single-writer: `b-branch` before any write; `r0-synth` sole writer of `RESEARCH-03.md`; `v60-register`/`d65-bundle`/`a70-register` sole writers of lock/catalog/schema/generators in their waves; int-nodes sole writers of CHANGELOG sections/tags.
- Free models only; honesty (`~` labels; no invented hashes/counts/gates); max 2 repair rounds per node then escalate with the exact blocker.
- Baseline honesty: v0.5.0 verified per close-out record (merge `3ecaa2a`, tag `v0.5.0`, 119 locked / 0 pending, catalog 2811 v3) — taken from the prior run's evidence, recounted live again at each int-node.

### 4 — Repair states

- Spark usage limit on any dispatch: STOP all dispatching immediately, record affected vs completed nodes in `AGENT.md`, escalate to owner with brief + attempt history + exact blocker, WAIT for the owner's replacement pick. Never silent-substitute; Argon NEVER.
- Non-quota node failure: return to its owner with failure output + materially changed hypothesis (max 2 rounds, then escalate with brief, both attempts, both outputs, exact ambiguity point). No third attempt, no re-scoped acceptance, no weakened check.
- R0a POSSIBLE (native switch exists): `v60-atomic-switch` implements native; scope change recorded in `AGENT.md` (plan already branches on the verdict — no re-plan needed).
- Version-gate failure: the failing version does not merge/tag; later versions wait; resume only on the stated fix condition.

### 5 — Research

- W2 reads/proves before W4 builds: OpenCode hook surface (R0a), ponytail upstream skill + MIT + variants (R0b), awesome-design-md license + 84-file listing (R0c), 13 real-agent sources with URLs (R0d).
- Nothing reconstructed from memory: counts recounted live, hashes from the commands that printed them, verdicts from the scripts that ran.

### 6 — Expanded thinking

- Per-version release discipline (merge `--no-ff`, tag, push, `gh run list` success, per-version announce with hashes/gates/census/inventory/honesty notes, independent verification before owner release) lives here because this order ships three versions, not one.
- Ponytail FLOOR/CEILING duality (§0B) is this run's standing quality bar for every code-executing agent; the exact wording is research output (R0b), not orchestrator prose.
- Composition-under-leader (TypeScript + UI + UX + Scribe on one mission) is proven by `a70-redteam`'s DAG smoke check, not by building a second orchestration layer here.
- `none` beyond this — because nothing else in the order needs auxiliary lanes.

### 7 — Kit loadout

- Read from the lock in force at dispatch time (post-v0.5.0: 119 locked / 0 pending): `kit-maintainer` (lock/schema/registry owns all build + register + release nodes), `architect` (design decisions: R0b intake, atomic switch), `technical-writer` (R0 synthesis + release notes hygiene), `explore` (R0 probes), `code-reviewer`/`ai-generated-code-security-auditor`/`red-team` (verify/review lanes). Pruned per version transition; MCP cap as backstop. The lock decides — never an id alone, never a printed table.
