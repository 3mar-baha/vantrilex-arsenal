# 08 — Workflows and Gates

Three root files hold the process, and six gates decide whether a change is
done. The files interlock by pointing, never by restating.

## The three root files

| File | Holds | Written by |
|---|---|---|
| `AGENTS.md` | Standing directives and hard rules | Owner / maintainer |
| `AGENT.md` | Live task memory, six sections | Orchestrator only |
| `WORKFLOW.md` | Standing method plus the task workflow | Orchestrator only |

**`AGENTS.md`** is the standing law: what the repository is, seven hard rules,
the skill-file format standard, the verification list, change discipline, and
the pointer line that sends every task to the other two files. It is the only
file the OpenCode V2 runtime auto-loads, which is why the standing directives
live there rather than in the mirror.

**`AGENT.md`** is the live memory, seeded 2026-10-13 and updated additively. Its
six sections, in fixed order, are Identity, Current state, Task log, Decisions,
Open items and next actions, and Known risks and defects. A repair to it is
additive: the task log is never destroyed.

**`WORKFLOW.md`** has two parts. Part A is the standing methodology — A1
Methodology, A2 Roles, A3 Precautions, A4 Repair states, A5 Research, A6
Expanded thinking, A7 Kit loadout — seeded read-live from the forge's canonical
template, where every later change carries a dated revision note. Part B is the
current-task workflow and turns over with the work.

**The interlock.** `AGENTS.md` instructs every task to read `AGENT.md` and
`WORKFLOW.md` before planning or dispatching. `AGENT.md` records the lane and
its decisions. `WORKFLOW.md` Part B states the phase plan for the task in
flight. Each item lives in exactly one of the three; the others point to it. A
pointer that restates the text it points at is the drift this split exists to
prevent.

## The six enforced gates

`docs/08-VERIFICATION.md` names the six. Each is a command, and each must exit
zero before a change is called done:

```bash
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs --check
node scripts/verify-catalog.mjs
node scripts/verify-skills.mjs
shellcheck scripts/*.sh .githooks/*
npx tsc --noEmit
```

The gate that proves the registry and the mirror is the first two; the catalog
and selection proofs are the third; the skill format is the fourth; the shell
scripts are the fifth, and
CI additionally runs `bash -n` over every script and git hook and `node --check`
over every `.mjs` file; the plugin's TypeScript is the sixth, and CI reports
SKIPPED rather than PASS when the tree carries no `tsconfig.json`. The lock and
its verifier were abolished at S3, so there is no kit gate to name.

Documentation lint, `npx markdownlint-cli "**/*.md"`, is **not** one of the six.
It is an additional lint step; CI does not run it, and its absence from a run is
not a gate failure.

## The two meta-rules

- **A gate that cannot be evaluated is a failed gate.** A missing tool, file,
  or configuration is a failure, never a silent skip. Say so rather than
  leaving the gate green-looking.
- **A dispatch is confirmed only when the result lands.** Reported work
  without a landed result is unfinished work.

## The release workflow

A release runs in this order, and every step is a gate:

1. The three second-pass guards — Clean Code, Test, and Docs — re-examine the
   change set after the feature work is done. Any one of them can refuse the
   release.
2. `CHANGELOG.md` must carry an entry for the pending version in the same
   change, because the release notes are extracted verbatim from the changelog.
3. The semver check derives the bump from the conventional commits.
4. The annotated tag is created.
5. `gh release create` publishes from the extracted notes.
6. A fresh clone verifies the published result.

`scripts/release.sh` implements steps 2 through 5 as one command. The guards and
the halt rule are in `docs/12-QUALITY-GATES.md`, which also states the secret
scan and the docs-match rule: a committed credential is revoked or rotated
first, and then removed.

## Change discipline

One concern per branch, named `wt/<concern-slug>`. Never force-push, never
rewrite published history, never commit to `main` directly. Conventional
Commits, where a `!` after the type or a `BREAKING CHANGE:` footer forces a
major bump. Any user-visible edit updates `CHANGELOG.md` in the same change.

## The docs allow-list

The docs-discipline guard in `.opencode/plugin/arsenal.ts` keeps documentation
inside a canonical set: the numbered `docs/` series, the archive and spec
directories, the registry, `.opencode`, `brand`, and eight named root files —
`CLAUDE.md`, `README.md`, `README.ar.md`, `AI_GUIDE.md`, `AGENTS.md`,
`CHANGELOG.md`, `CONTRIBUTING.md` and `SECURITY.md`. A Markdown write outside
that list is BLOCKED, or WARNed in warn mode, with a message naming the allowed
set.

**Observed drift.** This directory, `docs/dev/`, is not in that allow-list, so
every write here raises the guard's WARN line. The writes land because the guard
is in warn mode, but the allow-list does not yet name the dev docs. Widening it
is a change to the guard configuration, not to this directory.
