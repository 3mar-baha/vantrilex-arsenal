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
- 2026-10-15 — Wave 2 dispatch on `opencode-go/deepseek-v4.1-flash`: BLOCKED on Go usage limit (`Go usage limit exceeded` on both sessions: `ses_ec51eda87ffejLvaaotQ5DsQtL`, `ses_ec51ebaf8ffeMpAcBN3yvXP3aF`); escalated per §0A with no silent substitution. Owner ruling same day: route all remaining workers (Waves 2–4) to `opencode-go/muse-spark-1.3-contributor`.
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
