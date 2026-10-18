# RESEARCH-03 — VTA-EXPANSION-03 binding verdicts

You build on this lane. Read this file first. It binds you.

After this file, you know the four R0 verdicts that gate
everything downstream: hooks, ponytail, design, agents.

- Lane: VTA-EXPANSION-03.
- Branch: `wt/vta-expansion-03`.
- Date (UTC): 2026-10-15.
- Status: binding. No later node overrules anything here
  without a new research revision.
- Inputs (read-only; this synthesis changes none of them):
  - `RESEARCH-03-r0a-hooks.md` — hooks probe.
  - `RESEARCH-03-r0b-ponytail.md` — ponytail intake.
  - `RESEARCH-03-r0c-design.md` — design inventory.
  - `RESEARCH-03-r0d-agents.md` — agent sources.

## R0a — Hooks verdict WORKAROUND

Traces to `RESEARCH-03-r0a-hooks.md`. You do not get a
native per-agent auto theme switch. Plan around that.

Live baseline (observed 2026-10-15, nothing cited from
memory):

- Host runtime: `opencode v2.0.27` via `opencode --version`.
- V2 server-plugin surface: live page
  `<https://opencode.ai/v2/docs/build/plugins/>`.
- CLI plugin surface: live page
  `<https://opencode.ai/v2/docs/build/plugins/cli/>`.
- Theme surface: live pages
  `<https://opencode.ai/v2/docs/cli/theme/>` and
  `<https://opencode.ai/v2/docs/cli/config/>`.

Three candidates sought, none found:

- Agent-switch hook. The live `SessionHooks` map holds
  exactly `prompt`, `context`, `compaction`, `generate`,
  `title`, `model.request`, `http.request`,
  `http.response`, `experimental.ws.handshake`,
  `experimental.ws.send`, `experimental.ws.receive`,
  `retry`. No agent-switch entry exists anywhere.
- Session-start hook. No `created`, `start`, or `init`
  entry exists in that map. `prompt` runs once per
  admission but cannot redirect the session or set a
  theme; `context` fires per model call, not per session.
- Theme hook or theme-set API. The live theme page
  states the public CLI plugin API does not register
  themes. `context.theme` and `context.themeMode` are
  read-only. Selection is static config plus interactive
  `/themes`.

Supporting surfaces checked and rejected: `ctx.session`
`.switchAgent` is an imperative action, not a hook;
`ctx.agent.transform` edits definitions at registration
time; `ctx.command.transform` runs only on explicit
invocation; tool, shell, and permission hooks cannot set
the CLI theme.

Verdict: R0a verdict is WORKAROUND.

Consequence (binding): the atomic command is the
mechanism. You deliver per-agent theme behaviour as one
explicitly invoked command that switches the agent and
applies the theme-side steps together. You never wait on
a background hook event, because no such event exists.

## R0b — Ponytail bundle verdict

Traces to `RESEARCH-03-r0b-ponytail.md`. You adopt three
upstream variants as pinned pointers. You rewrite none
of their body text.

Minimum bundle (exactly these three):

- `ponytail` (core) — generation posture for any coding
  task. Upstream `skills/ponytail/SKILL.md`. Levels
  `lite`, `full`, and `ultra` are runtime arguments to
  core, not separate bundle entries.
- `ponytail-review` (review) — change-gate on a
  diff, branch, or pull request. Upstream
  `skills/ponytail-review/SKILL.md`. Report-only;
  it changes no code.
- `ponytail-audit` (audit) — repo-wide health view,
  map-first, max 20 ranked findings. Upstream
  `skills/ponytail-audit/SKILL.md`. Report-only;
  it changes nothing.

Explicitly deferred: `ponytail-debt`, `ponytail-gain`,
and `ponytail-help`. Debt needs the `shortcut:` comment
convention adopted first; gain duplicates the audit
`Lean:` line; help duplicates kit provisioning routing.

Upstream seat: `dietrichgebert/ponytail` on `main`,
canonical `skills/...` path. Downstream pins one
canonical raw URL per variant and verifies the content
hash, because the local registry still cites the older
`.openclaw/skills/...` path alias for the same content.

License: MIT — CONFIRMED. Observed source one is the
`license: MIT` frontmatter in `skills/ponytail/SKILL.md`.
Observed source two is the standard MIT license text in
`LICENSE` at `dietrichgebert/ponytail`, copyright 2026
DietrichGebert. Downstream retains attribution to
`dietrichgebert/ponytail` and carries the MIT notice.

Dual guardrails (binding, verbatim reuse downstream):

Downstream specs, kit entries, and tests copy both
quoted lines verbatim. You never paraphrase them.
FLOOR stops reckless laziness. CEILING stops astronaut
seniority.

FLOOR:

```text
FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
```

CEILING:

```text
CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."
```

## R0c — Design census verdict

Traces to `RESEARCH-03-r0c-design.md`. You bundle 84
files under MIT. You count from the live tree, never
from a badge or a prior snapshot.

Census (recounted live 2026-10-15, never transcribed):

- Upstream: `voltagent/awesome-design-md` on `main`.
- Counting method: GitHub API tree, filtered to exactly
  one `DESIGN.md` per brand directory.
- Count command output: `84`, exit `0`.
- Full 84-path enumeration observed the same day, exit
  `0`. The table named below reproduces that live set.

License: MIT, copyright 2026 VoltAgent — reconfirmed
live on 2026-10-15 from four independent observed
sources: the upstream `LICENSE` via authenticated
GitHub API, the same file over unauthenticated HTTPS
(byte-identical), the repo page sidebar plus README
license section, and the local vendored copy at
`registry/formatting/brands/LICENSE.voltagent-MIT`.
Every one of the 84 files is redistributable under
those MIT terms if the bundle reproduces the copyright
line and the permission notice, ships files unmodified,
and claims no Vantrilex authorship or endorsement.

Local position today:

- Vendored: 12 `DESIGN.md` files under
  `registry/formatting/brands/`.
- Stale snapshot: the local `_index.md` catalogue lists
  74 brands and `ATTRIBUTION.md` speaks of 74, 12, 62.
  That snapshot predates upstream growth to 84.
- The live 84-tree is authoritative. The bundler diffs
  mechanically at build time and never trusts the
  snapshot arithmetic.

Attribution table pointer (binding): the complete
84-row inventory with brand slug, upstream path, source
URL, MIT notice, vendored status, and bundle entry
lives in `RESEARCH-03-r0c-design.md` section 4. The
v0.6.5 bundler reuses that table for the sidecar,
extends the `ATTRIBUTION.md` plus `LICENSE.voltagent`
pattern from 12 files to all 84, preserves dotted slugs
exactly (`linear.app`, `mistral.ai`, `opencode.ai`,
`together.ai`, `x.ai`), and bundles `DESIGN.md` only
where upstream ships only that file.

## R0d — Agent sources verdict

Traces to `RESEARCH-03-r0d-agents.md`. You cover 13
v0.7.0 specialties, one live internet source each.
Every URL below fetched clean with readable content on
2026-10-15. Each row pairs the source with what the kit
does better plus the concrete tooling gap to close.

### TypeScript

- Source: `<https://github.com/mattpocock/skills>`
- Kit edge: ask-matt, grill-me, wayfinder, tdd, and
  code-review skills plus typescript-lsp edits.
- Gap to close: mandatory tsc-noEmit gate skill plus
  knip and depcheck unused-export sweeps.

### Python

- Source: `<https://github.com/langchain-ai/langchain>`
- Kit edge: sequential-thinking plans, context7 pinned
  docs, memory persistence, tdd red-green-refactor.
- Gap to close: ruff plus pytest pins and a venv-aware
  exec guard hook.

### Fixer

- Source: `<https://github.com/SWE-agent/SWE-agent>`
- Kit edge: diagnosing-bugs loop with red reproduction
  first, tdd regression test, ponytail-audit and
  red-team passes before close.
- Gap to close: kill-switch-document pre-step plus a
  reproduction-script gate blocking source edits.

### Reviewer

- Source: `<https://github.com/The-PR-Agent/pr-agent>`
- Kit edge: code-review skill Standards-versus-Spec
  split as parallel subagents, ponytail-review and
  red-team passes, github MCP posting.
- Gap to close: diff-size budget rule plus a registry
  Fowler-smell checklist file.

### UI-Designer

- Source: `<https://github.com/shadcn-ui/ui>`
- Kit edge: lenis motion, og-image, open-graph-image,
  vantrilex-design-variations behind an owner gate,
  a11y-audit in the loop.
- Gap to close: required pa11y and lighthouse gates
  plus a pinned shadcn skill in kit.lock.

### UX-Designer

- Source: `<https://github.com/bradfrost/atomic-design>`
- Kit edge: atoms-to-pages decomposition, babel-bridge
  shared language, grill-me alignment, skill-shadow
  rehearsal.
- Gap to close: journey-map and IA templates plus a
  usability-heuristic checklist.

### GitHub-general

- Source: `<https://github.com/cli/cli>`
- Kit edge: gh fluency with the github MCP plus
  wayfinder ticket graphs for multi-PR work.
- Gap to close: workflow-lint hook for actions files
  plus a registry PR-body template.

### Verifier

- Source: `<https://github.com/microsoft/playwright>`
- Kit edge: tdd expectations, time-capsule-test,
  documentation-as-tests, sequential-thinking chain.
- Gap to close: playwright MCP pin in kit.lock plus
  the verifier-gate-smoke benchmark as exit gate.

### Librarian

- Source: `<https://github.com/upstash/context7>`
- Kit edge: context7 resolution, firecrawl fallback,
  memory plus kit-evolution-log persistence.
- Gap to close: source-freshness stamp convention plus
  a per-project library-ID allowlist.

### Releaser

- Source: `<https://github.com/googleapis/release-please>`
- Kit edge: commitlint, commitizen, and lint-staged
  pins plus release-it, changesets, and np options
  behind a Docs-Guard CHANGELOG check.
- Gap to close: pre-release lane skill deriving semver
  from commits and verifying from a fresh clone.

### Scribe ar-en

- Source: `<https://github.com/anthropics/skills>`
- Kit edge: technical-writer agent for Arabic and
  English from one source, gated by alex, write-good,
  cspell, and markdownlint-cli.
- Gap to close: ar-en glossary plus bidi lint step and
  a pinned md-to-pdf pipeline.

### Harness

- Source: `<https://github.com/anthropics/claude-code>`
- Kit edge: task-dispatcher hook, forge-dag-exemplar
  workflow, session hooks, persist-on-end,
  long-running-process-guard.
- Gap to close: run-ledger JSONL per dispatch plus a
  watchdog binding the guard hook.

### Scout

- Source: `<https://github.com/firecrawl/firecrawl>`
- Kit edge: firecrawl, context7, and fetch MCPs with
  sequential-thinking triage and memory dedup, cited
  markdown with every URL live at write time.
- Gap to close: dead-link recheck hook plus a tldr and
  fx CLI fast lane for JSON triage.

## What these verdicts gate

- Theme lane: you build the atomic command from R0a.
  You never design around a native switch event.
- Ponytail lane: you pin core plus review plus audit,
  paste FLOOR and CEILING verbatim, and keep the MIT
  notice with upstream attribution.
- Design lane: you fetch the missing files to reach 84,
  emit the sidecar from the pointed table, and extend
  attribution to full coverage.
- Agent lane: you spec all 13 specialties against the
  named kit skills and MCPs and close each listed gap.

## Evidence

Branch (must print `wt/vta-expansion-03`):

```text
wt/vta-expansion-03
EXIT:0
```

Lint (must exit 0 — no findings, empty output):

```text
EXIT:0
```
