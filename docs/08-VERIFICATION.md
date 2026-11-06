# Verification

A task is finished when the thing is proven, not when the code runs. This file
describes the six enforced gates, what each one checks, and the two meta-rules:
a gate that cannot be evaluated is a failed gate, and a dispatch is confirmed
only when the result lands. Documentation lint is documented below as an
additional lint step; it is not one of the six. The per-change checklist is in
[13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md); the CI wiring is
in [14-CI-RELEASE.md](14-CI-RELEASE.md).

## `verify-registry.mjs`: the seven checks

Run with:

```bash
node scripts/verify-registry.mjs
```

| Check | What it proves |
|---|---|
| `utf8-validity` | The catalog Markdown decodes as strict UTF-8 with no malformed sequence |
| `schema-conformance` | All 2889 records satisfy `registry/schema/catalog-v4.schema.json` |
| `row-count-integrity` | Every section heading count and default-selected count matches the parse |
| `install-command-invariant` | Every live row is `verified`, its class evidence is present, and every command names the registry that proved it |
| `orphan-references` | All 45 id references across 56 overlap entries resolve |
| `duplicate-ids` | No id collides within its kind |
| `mcp-name-normalization` | All 910 MCP server names stay unique after V2 normalization (858 normalize away out-of-range characters; every MCP record carries a name) |

Verdicts are PASS, FAIL, or SKIPPED. A skipped check is reported as a skip,
never as a pass. The run exits non-zero on any FAIL. When the catalog cannot
be parsed at all, the schema check fails and the remaining five checks report
SKIPPED with the parse error as the reason.

## Catalog mirror check

```bash
node scripts/generate-catalog-json.mjs --check
```

Proves every generated surface — `registry/catalog.json`, the
`registry/VANTRILEX_CATALOG.md` table, and each per-kind
`registry/<dir>/_index.md` — is byte-current with the sources. Any drift
fails naming the drifted file and printing the exact repair command
(`node scripts/generate-catalog-json.mjs --markdown --indexes`). The
hand-authored `registry/formatting/_index.md` is reported as skipped, never
regenerated. Regeneration details are in
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md).

## Catalog and selection check

`AGENTS.md` and CI name `scripts/verify-catalog.mjs` as the gate that proves
every catalog row is honest and every selected component resolves. That script
exists and passes 20/20 against `registry/catalog.json` (2,889 live rows, all
`verified` under a declared class, no carried state), the 40 rows in
`registry/candidates/`, and `.opencode/equip.manifest.json` (145 selected
tokens, none suspended), including a shape check per
selectable kind — the `command-shape/cli` check passing on 64 `cli` rows is
reported as such rather than as a silent vacuous pass. See
[09-KIT-LOCK.md](09-KIT-LOCK.md).

## Skill-format check

```bash
node scripts/verify-skills.mjs
```

Eleven checks enforce the skill-file format contract: discovery and the
lowercase-hyphenated folder shape, frontmatter keys, the frontmatter name
matching its folder, the one-sentence third-person description with a
front-loaded trigger, description uniqueness (MFT-142), the seven required
body headings in order, no placeholders, no excluded toolchains, file hygiene,
the single-home rule for shared mechanism blocks, and the phase-map
cross-check. It currently evaluates 44 skill folders and passes 11/11.

## Test layer

```bash
node --test
```

The `test/` directory holds executable behaviour tests for the plugin
guards (seat-deny overlay, diff-size guard, publish queue) and the
registry generators (MFT-134), plus the approval-interlock refusal proof
(MFT-147). CI runs `node --test` in the `verify` job.

## Canonical verification battery

```bash
node scripts/run-battery.mjs
```

One command that runs every shipped `.mjs` through `node --check` (S34)
and the pinned markdownlint invocation over `docs/*.md` (S35), plus the
scoped `scripts/verify-*.mjs` suite with the two LD16/LD17 known-fail
verifiers excluded per D33 (MFT-151). CI runs it in the `verify` job.

## Doctor preflight and FOR-VANZEN freshness

```bash
node scripts/preflight-system-doctor.mjs
node scripts/check-forvanzen.mjs
```

The doctor is the one-command fresh-clone health check (MFT-152, S40):
one PASS/FAIL row per check. The freshness check verifies each
`for-vanzen/0.9.NN.md` and `build-0.9.NN.md` note against the tree
(MFT-152, S37). CI runs both in the `verify` job.

## Shell scripts

```bash
shellcheck scripts/*.sh .githooks/*
```

CI additionally runs `bash -n` over every script and git hook, then
`node --check` over every `.mjs` file. The seven orchestration scripts carry a
`#!/usr/bin/env bash` shebang and the executable bit, and CI asserts both. The
directory holds nine shell scripts: `scripts/migrate-to-opencode-v2.sh` is
committed mode 100644, so the executable-bit assertion does not cover it, and
`scripts/auto-publish.sh` sits outside the seven-script loop because the release
workflow invokes it directly.

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

Documentation lint is an additional lint step, not one of the six enforced
gates: CI does not run it, and its absence from a run is not a gate failure.

Repository prose follows `.markdownlint.jsonc`: long paragraphs and wide
tables are not hard-wrapped, table pipe spacing is free, ASCII diagrams sit
in fenced blocks, and each document opens with a single top-level heading.

## The per-branch allowlist rule

The docs-discipline guard in `.opencode/plugin/arsenal.ts` keeps
documentation inside the canonical set: the numbered `docs/` series, the five
allow-listed directories `docs/99-archive`, `docs/spec`, `registry`,
`.opencode`, and `brand` (allowed because the visual identity specification
lives there), and the eight named root files. A Markdown write outside that
allow-list is BLOCKED (or WARNed in warn mode), with a message naming the
allowed set and how to widen it. The numbered target-project series runs `00`
through `27`; this Arsenal set's own `00` through `21` numbering is the
repo-docs analogue, not the same series.

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
rather than leaving the gate green-looking. CI models this by failing the job
it cannot prove: absent `tsconfig.json` fails the types job, 13 of 15 `scripts/verify-*.mjs` run zero-arg with 2 known-fail (LD16/LD17 inventory drift) scoped pending re-baseline and the job fails if any scoped gate exits non-zero, scoped-out verdicts are excluded, never read as passes, and the tarball gate names every path it could not package; a
human reader treats every such failure as an open item, and the release lane
in [14-CI-RELEASE.md](14-CI-RELEASE.md)
refuses to ship over open guards.

## MFT-136 — markdownlint and link sweep (2026-11-05)

- Generated mirror `registry/VANTRILEX_CATALOG.md`: `npx --no-install
  markdownlint-cli registry/VANTRILEX_CATALOG.md` -> exit 0, zero
  findings.
- Link sweep over the repository Markdown: 33 broken relative links found,
  all in `.opencode/audit/*` and `docs/99-archive/*` (audit artifacts) or
  pre-existing truncated URLs (`htt…`) in the generated mirror; no broken
  link in the docs set touched by this mission. The mirror's truncated
  URLs are a pre-existing generator/display truncation (recorded as F3 in
  `V87-DEFECTS.md`) and are not hand-edited here; the generator and its
  source inputs are left unchanged.
