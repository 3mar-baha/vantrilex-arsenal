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

---

## Hard rules

1. **Node-only toolchain.** Runtime is Node 25, ESM, zero dependencies. Do not add a
   `package.json` dependency without stating why the standard library is insufficient.
2. **Markdown is a build artifact of the catalog.** `VANTRILEX_CATALOG.md` and the
   per-kind `_index.md` files are generated. Edit the generator or the JSONL sidecars,
   never the generated table by hand.
3. **The catalog Markdown stays the source of truth.** `registry/catalog.json` is a
   derived mirror. It is regenerated, never hand-edited.
4. **Single-writer law.** Each `registry/data/*.jsonl` sidecar has exactly one owning
   branch at a time. Never two branches writing one file — that is how merges conflict
   and data gets lost.
5. **English only.** All documentation, skill files, and registry content are English.
6. **No placeholders.** No `TODO`, no `FIXME`, no stub sections, no "coming soon". If
   something is unverified, say `unverified` and move on.
7. **Secrets never enter the repository.** `.env.example` carries placeholder keys only.
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
- **Catalog mirror** — `node scripts/generate-catalog-json.mjs` regenerates cleanly and
  the entry count is unchanged.
- **Kit components** — `node scripts/verify-kit.mjs` proves each component loads.
- **Shell scripts** — `shellcheck` clean (enforced in CI).
- **Plugin TypeScript** — `tsc --noEmit` clean.
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