# Verification

A task is finished when the thing is proven, not when the code runs. This file
lists every gate, what each one checks, and the two meta-rules: a gate that
cannot be evaluated is a failed gate, and a dispatch is confirmed only when
the result lands. The per-change checklist is in
[13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md); the CI wiring is
in [14-CI-RELEASE.md](14-CI-RELEASE.md).

## `verify-registry.mjs`: the six checks

Run with:

```bash
node scripts/verify-registry.mjs
```

| Check | What it proves |
|---|---|
| `utf8-validity` | The catalog Markdown decodes as strict UTF-8 with no malformed sequence |
| `schema-conformance` | All 2736 records satisfy `registry/schema/catalog-v2.schema.json` |
| `row-count-integrity` | Every section heading count and default-selected count matches the parse |
| `install-command-invariant` | No record claims `verified` with a null `install_cmd` |
| `orphan-references` | All 48 id references in `registry/data/overlaps.yaml` resolve to catalog ids |
| `duplicate-ids` | No id collides within its kind |

Verdicts are PASS, FAIL, or SKIPPED. A skipped check is reported as a skip,
never as a pass. The run exits non-zero on any FAIL. When the catalog cannot
be parsed at all, the schema check fails and the remaining four checks report
SKIPPED with the parse error as the reason.

## Catalog mirror check

```bash
node scripts/generate-catalog-json.mjs --check
```

Proves `registry/catalog.json` (and, with `--markdown` / `--indexes`, the
table and indexes) are byte-current with the sources. Any drift fails with
the exact repair command. Regeneration details are in
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md).

## Kit component check

`CONTRIBUTING.md` and CI name `scripts/verify-kit.mjs` as the gate that
proves each Tier-0 component resolves and loads. That script exists and
passes 11/11 against `kit/kit.lock` (51 components, 0 pending) — see
[09-KIT-LOCK.md](09-KIT-LOCK.md).

## Skill-format check

```bash
node scripts/verify-skills.mjs
```

Ten checks enforce the skill-file format contract: discovery and the
lowercase-hyphenated folder shape, frontmatter keys, the frontmatter name
matching its folder, the one-sentence third-person description with a
front-loaded trigger, the seven required body headings in order, no placeholders,
no excluded toolchains, file hygiene, the single-home rule for shared mechanism
blocks, and the phase-map cross-check. It currently evaluates 20 skill folders
and passes 10/10.

## Shell scripts

```bash
shellcheck scripts/*.sh .githooks/*
```

CI additionally runs `bash -n` over every script and git hook, then
`node --check` over every `.mjs` file. All seven orchestration scripts carry
a `#!/usr/bin/env bash` shebang and the executable bit; CI asserts both.

## Plugin TypeScript

```bash
npx tsc --noEmit
```

The plugin is type-checked with the project's own pinned checker. CI runs this
step unconditionally and reports SKIPPED when the tree carries no
`tsconfig.json`: a project without TypeScript gets no verdict, never a free
PASS.

## Documentation lint

```bash
npx markdownlint-cli "**/*.md"
```

Repository prose follows `.markdownlint.jsonc`: long paragraphs and wide
tables are not hard-wrapped, table pipe spacing is free, ASCII diagrams sit
in fenced blocks, and each document opens with a single top-level heading.

## The per-branch allowlist rule

The docs-discipline guard in `.opencode/plugin/arsenal.ts` keeps
documentation inside the canonical set: the numbered `docs/` series, the
archive and spec directories, the registry, `.opencode`, and the seven named
root files. A Markdown write outside that allow-list is BLOCKED (or WARNed in
warn mode), with a message naming the allowed set and how to widen it. The
numbered target-project series runs `00` through `27`; this Arsenal set's own
`00` through `15` numbering is the repo-docs analogue, not the same series.

## The landing law

Dispatch is confirmed only when the result lands, not on a subagent's word.
Constitutional law 5 (see [05-DOCTRINE.md](05-DOCTRINE.md)) makes this a
verification rule: a workstream is done when its integration is reviewed,
signed off, and merged — reported work without a landed result is unfinished
work. The worktree mechanics that enforce it are in
[11-WORKTREES.md](11-WORKTREES.md).

## A gate that cannot be evaluated is a failed gate

If a check cannot run — missing tool, missing file, missing configuration —
that is a failed check, not a skipped one. Say so in the change description
rather than leaving the gate green-looking. CI models this by reporting
SKIPPED with the reason spelled out (no `tsconfig.json`, no checkpoint
document); a human reader treats every such line as an open item, and the release lane in [14-CI-RELEASE.md](14-CI-RELEASE.md)
refuses to ship over open guards.
