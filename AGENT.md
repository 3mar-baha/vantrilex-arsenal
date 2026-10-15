# AGENT.md

This file is the live memory of the Vantrilex Arsenal project. It is seeded
from the repository state observed on 2026-10-13 and updated additively;
every task reads it first and updates it last.

## Identity

Vantrilex Arsenal is an OpenCode plugin plus a component Registry, living at
`O:\vantrilex-arsenal`. It provisions a curated kit of agent components onto
a target project and governs how that kit is used. It serves the solo
developer who equips projects through the three top-level skills
(`vantrilex-prime`, `vantrilex-vanguard`, `vantrilex-doctrine`) plus the
workflow forge. Success is the kit staying honest: the verifiers exit 0,
every locked component resolves to a definition and a registry entry, and
the docs describe the tree as it is.

## Current state

Branch `wt/v04-program`, observed 2026-10-13. `HEAD` is `53275ec` (merge:
red-team findings remediation). The newest tag is `v0.3.0`, released
2026-10-12 per `CHANGELOG.md`. No `v0.4.0` tag and no `v0.4.0` entry in the
changelog were observed, so "v0.4.0 program" below means the work order's
name for the in-flight program on this branch, not a released version.

Streams observed landed (merged commits in `git log`, HEAD history):

- Red-team findings remediation (`53275ec`, `1a03c09`).
- Full defect remediation sweep: plugin crash fix, lock cleanup, agents,
  skills, release, V2 research (`4d05cd2`, `ea0eef8`).
- Install-command honesty: 623 commands nulled, then 336 repointed to
  proven commands (`4322ffa`, `8168db4`, `4058cb5`, `27054a5`).
- Phantom catalog retirement (36 commands) with `cli` wired into the
  generator (`cf75e7c`, `7fd70e3`); `cli` kind scaffolding and audit fixes
  (`a121c85`, `9a12047`).
- Direct install commands for the three skills (`a8bf204`, `425cfc6`).
- Documentation reconciliation and Arabic visuals (`90d1fd3`, `5dbdfb9`,
  `101247a`, `13016d1`).
- Task-dispatcher migration to the OpenCode V2 `setup()` surface
  (`e437684`, `ee096c8`, `4c44599`, `fce8bd4`, `b64d044`, `06db084`,
  `bd73e04`).

Streams observed in flight (uncommitted worktree state, same date):

- Staged renames: `.opencode/agent/*.md` to `.opencode/agents/*.md`
  (nine agent files).
- Modified: the plugin (`arsenal.ts`, `arsenal.findings-probe.mjs`), four
  skills (doctrine, prime, vanguard, design-variations), `AI_GUIDE.md`,
  both READMEs, eight `docs/` pages plus seven SVG assets, `kit/kit.lock`,
  the catalog mirror and markdown, two registry sidecars (`lsp.jsonl`,
  `skills.jsonl`), both per-kind indexes (`lsp`, `skills`), and both
  verify scripts — 43 changed files in total per `git diff --stat`
  (recounted 2026-10-14; 41 was the seeding-time undercount).
- Untracked (9 per `git status --porcelain`, 2026-10-14):
  `.opencode/agents/blazar.md`,
  `.opencode/skills/vantrilex-vanguard/assets/agent-md-template.md`,
  `.opencode/skills/vantrilex-vanguard/assets/companion-config.template.jsonc`,
  `.opencode/skills/vantrilex-vanguard/assets/workflow-md-template.md`,
  `.opencode/skills/vantrilex-workflow-forge/` (new skill), `AGENT.md`
  (this file), `WORKFLOW.md` (sibling lane file), `registry/cli/`, and
  `registry/data/cli.jsonl`.
- A sibling CK session runs concurrently on lock/catalog files; those
  files are disjoint from this lane's three owned files.

## Task log

- 2026-10-13 — NODE DOG dogfood work order (this task): create the repo's
  own root `AGENT.md` and `WORKFLOW.md`, append the §3.10 pointer section
  to `AGENTS.md`. Owns only those three files; no commit; free models
  only. Outcome: complete 2026-10-14 — seed recount fix applied
  (43 changed files, 9 untracked listed in full above); markdownlint on
  `AGENT.md` exit 0 (verified after the edit).
- 2026-10-12 and earlier — streams listed under Current state as landed:
  verified from `git log --oneline` history only (merge commits present at
  `HEAD`). Not re-verified by re-running their guards in this lane;
  per-stream verifier output is unverified — this lane ran no historical
  guard.
- 2026-10-14 — NODE T3 docs merge (this task): fold the standing-law substance into `AGENTS.md`, `AGENT.md`, `WORKFLOW.md` through single-home pointers with zero duplication, on branch `wt/v2-consolidation`. Owns only those three files; no commit; free models only. Outcome: drafts returned with evidence 2026-10-14; the implementer writes the files and re-runs the literal verifications.
- 2026-10-14 — VTA-EXPANSION-02-RESUME Phase 0 (BLAZAR orchestrator): resumed paused expansion order on branch `wt/vta-expansion-02` at `012e449` (`v0.4.1`). Session model confirmed: `opencode-go/gemini-4-argon-contributor` (Gemini 4 Argon Contributor). Roster reconciled 2026-10-14 against `.opencode/agents/` (`architect`, `code-reviewer`, `ai-generated-code-security-auditor`, `technical-writer`, `red-team`, `kit-maintainer`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-leader`, plus `explore` built-in). Subagent execution routed to `opencode-go/deepseek-v4.1-flash`. Phase plan: Wave 1 (`t1-theme-infra`, `t3-rag-apply`, `t4-deep-understand-apply`, `t5-ecc-takeaways`) → Wave 2 (`t1-verify`, `t3-verify`, `t4-verify`, `t5-verify`, `t2-remaining-kinds`) → Wave 3 (`t2-verify`) → Wave 4 (`v-expansion-review`, `int-v050-release`). Open questions: none.
- 2026-10-14 — Wave 1 dispatch (`t1-theme-infra`, `t3-rag-apply`, `t4-deep-understand-apply`, `t5-ecc-takeaways` on `opencode-go/deepseek-v4.1-flash`): BLOCKED on upstream workspace region gate (`Upstream request failed: This Go model requires Global regions. Select Global in your workspace's Privacy settings to use it.`). Sessions: `ses_ec5387a67ffeuNHVFUXCrCrPio`, `ses_ec538562bffeIeTMeQ7qNNFTfu`, `ses_ec5382b5dffeUHck3xBGVFnRkI`, `ses_ec53809c2ffeg5IvOH9vpzkwv6`. Escalated to owner per §0A (no silent model substitution).
- 2026-10-14 — Wave 1 checkpoint (all 4 nodes ran on `opencode-go/deepseek-v4.1-flash` after owner enabled Global regions; each landed & verified per its completion report with 0 unresolved repairs: `t1-theme-infra` schema v3 + theme kind + blazar theme + catalog/lock sync, all gates exit 0; `t3-rag-apply` 12 RAG files materialized incl. verbatim creator identity; `t4-deep-understand-apply` skill + 9 dev docs, `verify-skills.mjs` 22 folders; `t5-ecc-takeaways` profiles + `docs/ar/` + harness matrix + hygiene, all gates exit 0). [Reconstructed 2026-10-15 after an edit error replaced the original entry; substance matches the four completion reports.]
- 2026-10-15 — AMENDMENT VTA-EXPANSION-04 (Scenario 4): owner order supersedes ONLY the unstarted v0.7 phase (W11–W14) with the self-contained 14-agent program; v0.6.0/v0.6.5 locked, never rebuilt. Deltas: 13→14 agents (+Vantrilex-Security-Auditor); new R0 source-reachability gate (SOURCES.md, GONE→park); supersessions (generic technical-writer + ai-generated-code-security-auditor removed/re-scoped); Releaser prep-only wiring + negative probe; T4 controls (worker-only line, kit-awareness, missing-tooling protocol, ponytail matrix + trailer, D2=A V-switches leaders-only with side-agent switches converted/removed + negative probe); D1–D5 assumed at researched defaults ([DEFAULT D2=A, D3] flagged, owner flips with one word). v0.7 executes ONLY after v0.6.5 announce + independent verify + owner release — NOT started now (W10 in flight).
- Owner B2 + phase/tier ruling 2026-10-15: lowercase everywhere (file, frontmatter, lock id, registry key — never `Vantrilex-*`); naming-law amendment: side agents display lowercase `vantrilex-*`, leaders capitalized display (Blazar, Aether, Pulsar) with lowercase machine ids; all 14 conditional with group tag + parent group (dev/design→build, exploration/review→audit); 3 leaders core; leader files (P1/P2) document catalog access; commands stay omitted — dedicated commands library PARKED to v0.8.
- 2026-10-15 — W17 COMPLETE: `a70-verify` PASS (14/14 probes, census exact); `a70-security` clean; `a70-redteam` MERGE-APPROVED with 3 advisory findings carried forward (F1 allow-list gap → P2 retool input, already planned; F2 triad mode mismatch residual with KEEP ruling; F3 SOURCES.md header CLOSED by the seat repair + on-branch 44/44 re-verification) and a live-probe gap (subagent depth-1 bars nested execution — static transcripts only, owner may run live legs optionally). Next: W18 `int-v070-release` (CHANGELOG, six gates, merge, tag v0.7.0).
- 2026-10-15 — W16 CLOSED: `a70-register-retry1` VERIFIED on disk (14 agent rows lines 52–65, conditional, null-cmd/unverified). Escalation resolved with 1 owner ruling + 2 sequenced waves. Next: W17 triple verify (verify + security + redteam incl. negative probes and the D2=A boundary question).
- 2026-10-15 — `w16-sidecar` VERIFIED on disk (14 rows, lines 285–298, exact 12-col shape, lowercase + conditional + provenance + group tags). B1 resolved. Re-dispatching `a70-register` with all three blockers cleared (B1 sidecars present; B2 lowercase ruled + executed; B3 commands stay omitted per owner).
- 2026-10-15 — `w16-rename` VERIFIED at agents scope (14/14 lowercase, residual grep zero, kit green, guardrails byte-identical). Interpretation recorded: the B2 ruling enumerates file/frontmatter/lock-id/registry-key — prose history (CHANGELOG, my own ledger rows, packager doc mention) is outside that enumeration and stays as written; no follow-up wave. Group mapping authorized for sidecars: typescript/python/fixer/github→dev, ui/ux→design, scout/librarian→exploration, reviewer/verifier/harness/security-auditor→review, scribe→docs, releaser→operate; parents build/build/audit/audit/build/build (docs/operate groups are the order's extensible allowance — owner flips at announce if desired). Next: sidecar-rows wave, then register re-dispatch.
- 2026-10-15 — W16 `a70-register`: BLOCKED, ESCALATED with evidence (0 writes, tree green, repair count 0 — this is a spec-gap escalation, not a failure retry). B1 sidecar sequencing: agents.jsonl holds 0 vantrilex-* rows; generator reads sidecars only, so lock rows would fail catalog-agreement — remedy is a sidecar-rows wave first (orchestrator-sequenceable once B2 + phase/tier decided). B2 case-vs-pattern: 14 files/names are `Vantrilex-*` but lock ids must match `^[a-z0-9]+(-[a-z0-9]+)*$` and the guard resolves `id + '.md'` exactly — lowercase ids fail file resolution, capitalized ids fail schema; needs a ruling (rename vs verifier exception vs ship-unregistered). B3 commands: both kind enums still lack `command` — omission stands unless a dispatched schema change is ordered. Needed: B2 ruling + phase/tier spec + commands confirm. Asked the owner; W17/W18 wait.
- 2026-10-15 — W15 `t4-controls` (kit-maintainer): LANDED & VERIFIED on disk by grep (0 repairs). 14/14 worker-only verbatim, 6 consult-mode conversions with reminder. Open judgment item for W17 (NOT a repair — spec-ambiguous): V-Vantrilex-Leader/Guide/Implementer switches kept executable; strict D2=A (proper-name leaders only) may require their conversion too — `a70-redteam` to probe and rule. Next: W16 `a70-register` (sole writer).
- 2026-10-15 — W14 COMPLETE (0 repairs): supersession verified (dated pointers in both files, lock rows gone, 119+9, all verifiers green). Routing decision: W17 `a70-security` re-routed from the superseded generic auditor (re-scoped, performs no work — dispatching it would violate its own pointer) to `red-team` (adversarial security lens fits, allow-listed; two red-team nodes in one wave hold disjoint concerns). Next: W15 `t4-controls` (sole writer).
- 2026-10-15 — W14 partial: `t3-sec-auditor` LANDED & VERIFIED on disk by grep (0 repairs): boundary map verbatim in-prompt, edit/shell-deny, zero pins (verify-kit already sees 24 agent files). Still running: supersede.
- 2026-10-15 — W14 partial: `t3-releaser-wire` LANDED & VERIFIED on disk by grep (0 repairs): 3-place refusal (prompt already absolute, packager doc + CHANGELOG entry added), negative probe PASS (refuse + escalate). Still running: sec-auditor, supersede.
- 2026-10-15 — W13 CLOSED (1 repair, content-clean): all 13 T1/T2 files verified on disk; scribe repair re-proved zero pins by my own grep; SOURCES.md 44/44 intact (M-flag a label artifact). Next: W14 T3 (auditor + supersession + releaser wiring, parallel).
- 2026-10-15 — W13 files: `t2-librarian` + `t2-verifier` LANDED & VERIFIED on disk (0 repairs each; verifier tri-state/ledger/taxonomy/refusals all present, zero pins). `t2-scribe` repair round 1 NOW IN FLIGHT (correction: the earlier entry said 'dispatched' before the dispatch was sent — the dispatch above is the actual repair; ledger corrected here). SOURCES.md flag: librarian status showed it as `M` — content re-verified 44/44 by the seat-repair grep post-checkout; treating the flag as a status-label artifact, will re-confirm count at W13 close.
- 2026-10-15 — W13: `t2-github`, `t2-releaser`, `t2-scout` LANDED & VERIFIED on disk (0 repairs each).
- 2026-10-15 — W13 partial: `t2-harness` LANDED & VERIFIED on disk by grep (0 repairs): mode subagent, reproduction-first contract, blast-radius + exploitability severity, edit-deny, verbatim FLOOR, zero pins. Still running: github, verifier, librarian, releaser, scribe, scout.
- 2026-10-15 — W12 COMPLETE (all Spark, 0 repairs): typescript, python, fixer, reviewer, ui, ux — all verified on disk (mode subagent, worker-only lines present with wording variances logged for t4-controls normalization, verbatim guardrails where bound, zero pins). Next: W13 T2 seven authors (disjoint files, parallel).
- 2026-10-15 — W12 partial: `t1-fixer` LANDED & VERIFIED on disk by grep (0 repairs): mode subagent, both modes, debug journal, LEADER-escalation, verbatim FLOOR, zero pins (bonus: verify-kit agent-mode-explicit already sees 16 agent files, 22 checks PASS). Still running: reviewer, ux.
- 2026-10-15 — W12 partial: `t1-python` LANDED & VERIFIED on disk by grep (0 repairs): mode subagent, ruff gate, uv/venv hygiene, async-first, verbatim FLOOR, zero pins. Still running: fixer, reviewer, ux.
- 2026-10-15 — W12 partial: `t1-ui` LANDED & VERIFIED on disk by grep (0 repairs): mode subagent, ONE-DESIGN.md rule, a11y floor, verbatim FLOOR, zero pins. Variance logged (not a repair): worker-only + missing-tooling wording paraphrased — verbatim normalization belongs to `t4-controls` per plan. Still running: python, fixer, reviewer, ux.
- 2026-10-15 — W12 partial: `t1-typescript` LANDED & VERIFIED on disk by grep (0 repairs): mode subagent, worker-only line, verbatim FLOOR/CEILING, tsc gate, no-any rule, zero pins. Still running: python, fixer, reviewer, ui, ux.
- 2026-10-15 — W11 CLOSED: `r0-reach` verified (44/44) + repair 1 (seat correction) verified — worktree on `wt/vta-expansion-03`, SOURCES.md 44 intact, nothing committed. Next: W12 T1 six authors (disjoint files, parallel).
- 2026-10-15 — W11 `r0-reach` (explore): CONTENT VERIFIED on disk by grep (39 REACHABLE + 5 GONE = 44, each with fetch proof). Seat defect: node ran on `main`, not the work branch (post-merge worktree stayed on main) — repair round 1 dispatched (seat correction, content untouched). GONE analysis: NO agent fully orphaned (nothing parked) — `t1-ux` proceeds on 1/2 sources, `t2-scribe` thin on 1/4 (flagged for the v0.7.0 announce), `t2-scout` on 4/5. T1/T2 fan out only after the seat repair verifies.
- 2026-10-15 — VTA-EXPANSION-05 GO (Scenario 4 extended): owner pasted the full v0.7→7.7 program = go for phased execution (P0→P1→P2→P3, announce + owner go between phases). Supersedes the HOLD. P0 = recorded W11–W18 by reference (no re-derivation); P1 (7.5 AETHER+PULSAR, W19–W24), P2 (7.6 BLAZAR retool, W25–W30), P3 (7.7 Relay, W31–W35) added to the DAG. D1–D5 ALL DECIDED and recorded (D1=C one-session V-switching; D2=A; D3 Scout shared; D4 plan-guard HARD; D5 owner-overrides-never-suppress-verdicts). Naming law: leaders proper names, side agents Vantrilex-*. v0.6.x tags/merges immutable.
- 2026-10-15 — Owner ruling on v0.7 go: HOLD. v0.7 stays planned (W11–W18) but undispatched until the owner says otherwise.
- 2026-10-15 — W10 `int-v065-release`: v0.6.5 CUT & ANNOUNCED (0 repairs). Work `dae93af` (96 files) → merge `cac1179` pushed (`7bee280..cac1179`), tag `v0.6.5` pushed, release run `38685063811` success in 10s; six gates + probe 45/45 green post-final-edit; census 121+9 / 2896/16; CHANGELOG section verified on disk; work branch alive for v0.7. v0.7 HELD for owner go per VTA-EXPANSION-04 (announce → independent verify → owner release first).
- 2026-10-15 — W9 `d65-verify` (code-reviewer): PASS, no findings (84/84/84/2896 reconciled live, stripe end-to-end, MIT present, zero pins, v0.6.0 unregressed). Next: W10 `int-v065-release` (CHANGELOG, six gates, merge, tag v0.6.5).
- 2026-10-15 — W8 `d65-bundle` (kit-maintainer): LANDED & VERIFIED on disk (0 repairs). 84 brand dirs + index/ATTRIBUTION/LICENSE under `registry/design/`; stripe exemplar lock row confirmed; lock 121+9, catalog 2896/16 sections per node counts. Noted: v3 extended in place (precedent + dispatch won over new-file mechanism — recorded, Guide-visible). Next: W9 `d65-verify` (read-only).
- 2026-10-15 — W7 `int-v060-release`: v0.6.0 CUT & ANNOUNCED (0 repairs). Merge `7bee280`, tag `v0.6.0` pushed, release run `38683316922` success in 13s; six gates + probe 45/45 green post-final-edit; census 120+9 / 2812; CHANGELOG section verified on disk. v0.6.5 (W8–W10) begins on the intact work branch.
- 2026-10-15 — W6 COMPLETE: `v60-verify` PASS (no defects; lock 120+9 / catalog 2812 recounted live, zero `model:` pins, allow-all intact) + `v60-security` CLEAN (zero findings). Nit adjudicated WITHOUT a repair round: `V-DOCTOR.md:52` "six V-commands" correctly counts the six headline commands (the other ten are V-`<Agent>` switch commands — distinct set, no staleness). Next: W7 `int-v060-release` (CHANGELOG, six gates, merge, tag v0.6.0).
- 2026-10-15 — W5 `v60-register` (kit-maintainer): LANDED & VERIFIED on disk by grep (0 repairs). Lock 120 + 9 pending (atomic-switch row + pending array confirmed), catalog 2812; hard constraint honored (zero file-copies for nonexistent files); honest escalation recorded: 16 command files are schema-unsupported (no command kind — Guide matter, no unilateral schema edit). Next: W6 verify (`v60-verify` + `v60-security`, read-only, parallel).
- 2026-10-15 — W4 COMPLETE (all Spark, 0 repairs): `v60-commands` 6 files verified; `v60-ponytail` SKILL+GUARDRAILS verified; `v60-atomic-switch` design + `v60-atomic-impl` 12 files verified on disk (16 commands total, registry 10 rows/10 unique hexes, install skill present). Honesty carried: 9 registry theme rows are `pending` (JSONs don't exist yet — W5 must NOT register file-copies of nonexistent files); impl never saw full ADRs (reconstructed from acceptance + R0 — Guide flag recorded). Next: W5 `v60-register` (sole writer of lock/catalog/schema/generators).
- 2026-10-15 — W4 partial: `v60-ponytail` (kit-maintainer) LANDED & VERIFIED on disk by grep (0 repairs): `SKILL.md` (name==folder, MIT attribution, verbatim FLOOR/CEILING) + `GUARDRAILS.md` (canonical pinned URLs, CI anchors); `verify-skills.mjs` 23 folders PASS, markdownlint clean, zero `model:` pins. Still running: `v60-commands`, `v60-atomic-impl`.
- 2026-10-15 — W4 partial: `v60-atomic-switch` (architect) returned a COMPLETE IMPLEMENTER-READY DESIGN (no files — architect holds no edit permission by its own standing rule, so the DAG's file artifacts move to a child implementation node, same wave, disjoint paths). Routing decision: implementation goes to `kit-maintainer`, NOT `vantrilex-implementer` — the design report names the implementer lane, but that lane sits outside this seat's subagent allow-list (`.opencode/agents/blazar.md`), while kit-maintainer fits and already owns the W5 registration. Open collide-risk flagged in brief: `.opencode/command/` (singular, observed live) vs `.opencode/commands/` — impl node resolves live and never overwrites `v60-commands` files. Still running: `v60-commands`, `v60-ponytail`.
- 2026-10-15 — W3 `r0-synth` (technical-writer): LANDED & VERIFIED on disk by grep (0 repairs). All four verdict sections present with verbatim FLOOR/CEILING; R0 gate READ: native auto-switch stays WORKAROUND → atomic V-command IS the v0.6.0 mechanism; ponytail core+review+audit/MIT; 84 files/MIT; 13 URLs. Build gates OPEN. Next: W4 v0.6.0 authors (disjoint sets, no lock/catalog writes — those belong to W5 `v60-register`).
- 2026-10-15 — W2 R0a–d (all Spark): ALL LANDED & VERIFIED on disk by grep (0 repairs). `r0a` WORKAROUND ×1 line 107; `r0b` MIT + FLOOR + CEILING quotes; `r0c` 84 live-counted + MIT reconfirmed; `r0d` 13 live URLs (one 404 honestly replaced). Key verdict: native auto-switch stays WORKAROUND → atomic V-command IS the v0.6.0 mechanism. Next: W3 `r0-synth` (sole writer of RESEARCH-03.md).
- 2026-10-15 — W1 `b-branch` (kit-maintainer): LANDED & VERIFIED (0 repairs). Branch `wt/vta-expansion-03` cut from `main` at live-resolved `9fb9d4e` (parent merge `3ecaa2a`, tag `v0.5.0` reachable, exit 0); verified personally via `.git/HEAD` → `ref: refs/heads/wt/vta-expansion-03` plus the node's verbatim command outputs. Next wave (W2) owns R0a–d research drafts.
- 2026-10-15 — VTA-EXPANSION-03 Phase 0 (BLAZAR orchestrator, Scenario 1 NEW TASK — prior order closed with v0.5.0 live; no task was in flight). Task as understood: one order, version-gated v0.6.0 → v0.6.5 → v0.7.0, each merging/tagging/announcing separately; R0 research (`RESEARCH-03.md`) gates all building; v0.6.0 = six V-commands + atomic agent+theme switch + per-agent theme registry + core install skill + ponytail bundle; v0.6.5 = 8th `design.md` kind + 84 bundled files + exemplar; v0.7.0 = 13 `Vantrilex-*` SIDE agents (workers, never primaries) + V-commands + §0B guardrails. Roster reconciled 2026-10-15 from `.opencode/agents/` live: 10 files (`ai-generated-code-security-auditor`, `architect`, `blazar`, `code-reviewer`, `kit-maintainer`, `red-team`, `technical-writer`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-leader`) plus built-in `explore`; `GET /api/agent` not directly queryable from this seat (companion denies MCP tools — recorded honestly, not claimed). Routing confirmed in force from `.opencode/agents/blazar.md`: session runs as `blazar` (mode primary, manager-only); subagent allow-list `architect`, `code-reviewer`, `ai-generated-code-security-auditor`, `technical-writer`, `red-team`, `kit-maintainer`, `explore` (deny-by-default); edit limited to `*AGENT.md`/`*WORKFLOW.md`; shell/webfetch/websearch/external-directory/MCP denied. Every dispatch on `opencode-go/muse-spark-1.3-contributor` per §0A (DeepSeek fallback only on Spark limit: stop, report, wait). Phase plan: 14 waves — W1 branch, W2 R0a–d, W3 synth, W4–W7 v0.6.0 (authors → register → verify → release), W8–W10 v0.6.5 (bundle → verify → release), W11–W14 v0.7.0 (authors → register → verify → release). Open questions: R0 verdicts (unknown until W3 — build waves wait on them); owner sign-off on the announced plan.
- 2026-10-15 — Wave 2 dispatch on `opencode-go/deepseek-v4.1-flash`: BLOCKED on Go usage limit (both sessions); escalated per §0A with no silent substitution. Owner ruling same day: route all remaining workers (Waves 2–4) to `opencode-go/muse-spark-1.3-contributor`. Wave 2 re-dispatched and landed (`t2-remaining-kinds` 6 kinds + `w1-verify` PASS); Wave 3 `t2-verify` PASS; Wave 4 `v-expansion-review` MERGE-APPROVED with 2 medium notes (both applied: red-team note, allow-all backup warning).
- 2026-10-15 — INT `int-v050-release`: CHANGELOG `v0.5.0` section + link refs; six gates green; probe 45/45; merged `--no-ff` to `main`, pushed, work branch deleted. Tag `v0.5.0` pushed; release workflow pending confirmation.
  - `t1-theme-infra` (`kit-maintainer`, `ses_ec534f09effevZQYzLmRAWQAgd`): LANDED & VERIFIED (0 repairs, 0 escalations). Artifacts: `registry/schema/catalog-v3.schema.json`, `registry/themes/vantrilex-blazar.json`, `registry/themes/_index.md`, `registry/data/themes.jsonl`, `docs/18-THEMES.md`, `kit/kit.lock` (113 components), `kit/kit.lock.schema.json`, `scripts/verify-kit.mjs` (`per-kind/theme` PASS, 15/15), `scripts/verify-registry.mjs` (7/7 PASS, 2805 records).
  - `t3-rag-apply` (`vantrilex-implementer`, `ses_ec534d1d6ffevAFhE571BP0Tqi`): LANDED & VERIFIED (1 in-node additive fix to `knowledge-hotfix.json` `merge_policy.hosting`, 0 escalations). Artifacts: `registry/rag/01-doctrine.json`..`10-user-faq.json`, `knowledge-hotfix.json`, `v06-api-plan.md` (57 entries, verbatim creator identity verified, markdownlint exit 0).
  - `t4-deep-understand-apply` (`vantrilex-implementer`, `ses_ec534ae56ffeG7rLOy8J6voVh2`): LANDED & VERIFIED (0 repairs, 0 escalations). Artifacts: `.opencode/skills/vantrilex-deep-understand/SKILL.md` (`verify-skills.mjs` 10/10 PASS, 22 skill folders) and `docs/dev/00-INDEX.md`..`08-WORKFLOWS-GATES.md` (markdownlint exit 0).
  - `t5-ecc-takeaways` (`kit-maintainer`, `ses_ec53494bfffeunm012Wwol68qA`): LANDED & VERIFIED (0 repairs, 0 escalations). Artifacts: `manifests/install-profiles.json` (4 profiles, 113 full, 0 invented IDs), `docs/19-HARNESS-MATRIX.md`, `docs/ar/*.md` (8 files, 108/108 links resolve, markdownlint exit 0), `scripts/*.sh` (`shellcheck` exit 0).
  - Next wave (Wave 2) owns: `t2-remaining-kinds` (`kit-maintainer`, 6 remaining kinds `prompt`, `dataset`, `template`, `policy`, `benchmark`, `workflow`) and `w1-verify` (`code-reviewer`, independent Wave 1 verification).

## Decisions

- Single-writer law: each `registry/data/*.jsonl` sidecar has exactly one
  owning branch at a time. Sourced from `AGENTS.md`; decider unverified —
  no decision record names one.
- No invented install commands: a component's `install_cmd` is verified or
  explicitly `null` with `verification: unverified`. Sourced from
  `AGENTS.md`; decider unverified — no decision record names one.
- New `cli` entries default to `tier conditional`, recorded as prose
  rather than a schema mechanism. Sourced from `CHANGELOG.md` 0.3.0;
  decider unverified — the changelog entry names no decider.
- The six non-migrated hooks stay on the V1 surface and are inert under
  V2; porting them is a separate concern, deliberately not bundled.
  Sourced from `docs/16-TASK-DISPATCH.md`; decider unverified — the doc
  names no decider.
- This lane owns only `AGENT.md` (new), `WORKFLOW.md` (new), and one
  appended pointer section in `AGENTS.md`, with no commit. Sourced from
  the 2026-10-13 NODE DOG work order; decider: the dispatching session.
- NODE T3 single-home ruling 2026-10-14: each merged item lives in exactly one root file — standing directives in `AGENTS.md`, orchestration/verification/runtime method in `WORKFLOW.md` Part B, lane records here; the other files point, never restate. Sourced from the NODE T3 work order; decider: the dispatching session.
- NODE T3 lane discipline 2026-10-14: this lane writes only the three owned files, makes no commit, and uses free models only. Observance is recorded here; the standing rules live in `AGENTS.md` and carry no copy here. Sourced from the NODE T3 work order; decider: the dispatching session.
- Orchestrator-only write 2026-10-14: only the orchestrator writes this file, after every task, rotating closed entries into `docs/agent-log-YYYY-MM.md`. Sourced from doctrine Ritual 2; decider unverified — the doctrine states the role and no decision record names one.

## Open items & next actions

- Finish this lane: write all three files, run markdownlint on them to
  exit 0, prove append-only with `git diff --numstat` and full
  `git diff AGENTS.md`, report evidence per section — owner: this DOG
  node, no commit.
- Guide sign-off on the dogfood change — owner: the Guide.
- Sibling CK lock/catalog lane completes independently on disjoint files;
  any sequencing need escalates to the Guide, never branch-to-branch —
  owner: the Guide.
- Port the six inert V1 hooks to the V2 surface as its own concern —
  owner: unverified — no dispatch observed.
- Populate the `cli` kind through the digest and review mechanism —
  owner: unverified — named only as future work in `CHANGELOG.md` 0.3.0.
- Implementer writes the three NODE T3 appends, runs `npx --yes markdownlint-cli AGENTS.md AGENT.md WORKFLOW.md` to exit 0, proves append-only with `git diff --numstat` and full `git diff`, runs the single-home census, and reports evidence per section — owner: the owning implementer, no commit.

## Known risks & defects

- Concurrent sibling writes (CK lane on lock/catalog) while this lane
  writes root memory files. Evidence: work order text 2026-10-13.
  Mitigation observed: disjoint file sets plus the single-writer law; risk
  is sequencing, not overlap.
- Six locked hooks plus `docsDisciplineGuard` are inert under OpenCode V2
  (only `task-dispatcher` runs). Evidence: `docs/16-TASK-DISPATCH.md`
  2026-10-13 read. Deliberate and documented, not a silent failure.
- Unverified `install_cmd` entries exist by design; a plausible-looking
  wrong command would be worse. Evidence: `AGENTS.md` hard rule 2.
- Markdownlint runner availability was unverified — no markdownlint binary
  in `node_modules/.bin` at seeding time; the verification step must
  report its actual runner and exit code, and a check that cannot run is a
  failed check.
- Pointer drift between the root files and the canonical skill text (doctrine B.8.2, Vanguard A.7d). Evidence: pointers cite sections, never copy text (NODE T3 drafts 2026-10-14). Mitigation observed: single-home census at every docs gate; a census failure returns for re-homing before any other gate runs.
