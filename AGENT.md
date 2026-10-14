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
