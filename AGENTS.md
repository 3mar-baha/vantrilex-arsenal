# AGENTS.md

Instructions for any coding agent operating inside this repository.

---

## What this repository is

Vantrilex Arsenal is an **OpenCode plugin plus a component Registry**. It provisions a
curated kit of agent components onto a target project and governs how that kit is used.

Two things follow from that, and they govern everything below:

1. **This repo contains no AI/ML model logic.** It is Markdown, JSON, and Node ESM. Do not
   introduce Python, a bundler, or a framework.
2. **Nothing here may invent an install command.** A component's `install_cmd` is either
   verified against a real registry or explicitly `null` with
   `verification: unverified`. A plausible-looking wrong command is worse than an
   admission of ignorance, because an agent will run it.

Scope facts: no root `package.json` (plugin manifest `.opencode/package.json`
only); runtime is Node 25, ESM, zero dependencies; `tsconfig.json` files
exactly [`.opencode/plugin/arsenal.ts`]; scripts carry `#!/usr/bin/env bash` +
mode 100755 + `Usage:` lines; releases are strict on `v*` tags.

---

## Hard rules

1. **Node-only toolchain.** Runtime is Node 25, ESM, zero dependencies. Do not add a
   `package.json` dependency without stating why the standard library is insufficient.
2. **Markdown is a build artifact of the catalog.** `registry/VANTRILEX_CATALOG.md`
   is the source of truth. Edit the generator or the JSONL sidecars, never the
   generated table by hand.
3. **The catalog JSON is a derived mirror.** `registry/catalog.json` is regenerated
   via `node scripts/generate-catalog-json.mjs` and never hand-edited.
4. **Single-writer law.** Each `registry/data/*.jsonl` sidecar has exactly one owning
   branch at a time. Never two branches writing one file — that is how merges conflict
   and data gets lost.
5. **English only.** All documentation, skill files, and registry content are English.
   The sole on-disk exception is the README pair (`README.md` + `README.ar.md`);
   there is no `AGENTS.ar.md`.
6. **No placeholders.** No `TODO`, no `FIXME`, no stub sections, no "coming soon". If
   something is unverified, say `unverified` and move on.
7. **Secrets never enter the repository.** No committed file carries a real value.
   The pre-commit hook is a secret scanner plus a `.env` guard plus an
   AI-attribution gate, activated with `bash scripts/setup-git-hooks.sh`. This
   repository ships zero AI attribution: the commit-msg hook rejects AI trailers.
   A leaked credential is revoked first, then removed.

---

## Skill-file format standard

Every `SKILL.md` in this repo follows one shape. Deviating breaks the Registry.

```
---
name: <lowercase-hyphenated, matches the containing folder name>
description: <third person, one sentence, what it does AND when to trigger it>
---

# <Title>

## Purpose
## When to Use
## Do NOT use          (where the boundary is real)
## Inputs
## Procedure
## Outputs
## Failure Modes
```

- `name` must be lowercase-hyphenated and **identical to the folder name**. OpenCode
  rejects a mismatch.
- `description` is what the model sees when deciding whether to load the skill.
  Front-load concrete trigger keywords. Write "Use when…", never "I help with…".

---

## Verification before claiming done

A task is not finished because the code runs. It is finished when the thing is proven:

- **Registry data** — `node scripts/verify-registry.mjs` exits 0.
- **Catalog mirror** — `node scripts/generate-catalog-json.mjs --check` exits 0,
  covering `registry/catalog.json`, the `VANTRILEX_CATALOG.md` table, and every
  per-kind `registry/<dir>/_index.md`; run it BEFORE
  `node scripts/verify-registry.mjs`.
- **Skill format** — `node scripts/verify-skills.mjs` exits 0 (skill-format gate).
- **Catalog and selection** — `node scripts/verify-catalog.mjs` proves every catalog row is honest and each selected component resolves.
  Conditional: when the script is absent the CI reports NOTICE as a passthrough,
  not a pass.
- **Shell and Node syntax** — `bash -n` plus `shellcheck` over `scripts/*.sh` and
  `.githooks/*`, plus `node --check` over every `*.mjs`.
- **Plugin TypeScript** — `tsc --noEmit` clean. Conditional: SKIPPED without a
  `tsconfig.json`; a skipped check is never a pass.
- **Docs** — every relative link resolves; no link points at a file that does not exist.

If a check cannot be evaluated, that is a **failed** check, not a skipped one. Say so.

---

## Change discipline

- One concern per branch. Branch name: `wt/<concern-slug>`.
- Never force-push, never rewrite published history, never commit to `main` directly.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
  A `!` after the type or a `BREAKING CHANGE:` footer forces a MAJOR bump at release.
- Update `CHANGELOG.md` in the same change as any user-visible edit. The Docs Guard
  fails a release without it.

---

## Project memory

`AGENT.md` is this repository's live task memory and `WORKFLOW.md` carries its
standing methodology plus the current-task workflow; both live in this project
root.

At the start of every task, read AGENT.md and WORKFLOW.md in this project root before planning or dispatching anything.

---

## Standing-directive pointers (NODE T3, 2026-10-14)

You read each permanent rule where it lives. This section states each AGENTS-homed rule once in repo scope and names the home of each other rule; no rule text repeats in any other root file.

- **Management only.** On this repo, the orchestrator plans, dispatches, reviews, and integrates; subagents execute the work. The orchestrator never executes node work itself. Source: doctrine Law 1 and B.8.2 directive 2.
- **No commit, no push.** This lane makes no commit and pushes nothing. Work lands on branch `wt/v2-consolidation` and merges into `main` only after verification. Source: B.8.2 directive 3; the change discipline above still governs the merge.
- **Free models only.** Every agent on this lane uses the free model tier; a paid model is never used on any agent for any task. Source: B.8.2 directive 5.
- **General is the last resort.** You never dispatch the generic agent when a named specialist fits; when none fits, you state the reason in one line, then proceed. Source: B.8.2 directive 6 and the Vanguard binding protocol.
- **Honesty, no invention.** This rule already lives at hard rule 2 above and stays there; this line carries no second copy.
- **Orchestration (§33B).** Home: `WORKFLOW.md` Part B §2, which states the lead-plans-and-integrates loop for the current task. Source: doctrine Rule 4 with Laws 1 and 5.
- **Announce, then verify.** Home: `WORKFLOW.md` Part B §§1 and 4, which state the announce-with-evidence close and its repair path. Source: B.8.2 directive 4.
- **V2-first runtime and native discovery.** Home: `WORKFLOW.md` Part B §3, which states the auto-load ground truth. Source: Vanguard A.7d, doctrine B.8.1.
