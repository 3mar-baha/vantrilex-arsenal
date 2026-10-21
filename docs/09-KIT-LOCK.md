# Kit Catalog and Selection

The catalog is the single record of every component the Arsenal can provision:
one row per `(kind, id)` in `registry/catalog.json`, generated from the Markdown
source and the `registry/data/*.jsonl` sidecars. The selection record at
`.opencode/equip.manifest.json` names which catalog tokens a project carries, by
phase. The lockfile that once sat between them is abolished — S3 deleted it and
its verifier, and the catalog proofs are the sole gate. This
file states what the catalog holds, what the selection adds, and the rules that
govern both.

## What a catalog row carries

One row per catalogued component:

| Fact | Source field | Meaning |
|---|---|---|
| Identity | `kind` plus `id` | Exactly which component, in which kind |
| Version | `version_pin` | Exact tag or version where one exists; null is honest and common |
| Command | `install_cmd` | The real command that installs it, reproducible later |
| Verification | `verification` plus `verify_cmd` | `verified` or `unverified`, with the proof recorded when one exists |
| Phase scope | `phase` | The phase the component is injected into, or null when never injected |
| Tier | `tier` | `core`, `conditional`, or null for a row no selection may inject |

A `verified` row asserts that its command was checked against a real registry;
it stays an assertion to re-test, never auditable proof. A null `install_cmd`
forces `unverified`.

## No `pending` state

The catalog carries no `pending` list. Every row is `verified` or `unverified`
and nothing waits between approval and installation; a component either has a
row or it does not. The nine per-agent themes that were once pending are
authored and verified: nine of the twelve `theme` rows carry
`verification: verified`, and the three unverified rows are honestly recorded as
such. `scripts/verify-catalog.mjs` reports the count as
`command-honesty/no-pending`.

## The 8-MCP cap

At most 8 MCP servers sit in the Tier-0 set. The cap is a context-budget
backstop, not a target: fewer is better, and the specified eight are
filesystem, fetch, memory, sequential-thinking, github, context7, firecrawl,
and openrouter. The static cap is complemented by the dynamic budget below —
phase scoping is what keeps context spend near the work, the cap is what
stops the worst case.

## Phase-scoped injection and pruning

Install once centrally; inject per phase, prune after. Context spend tracks
the work being done:

Every selected token carries the `phase` its catalog row declares, and that field
is the whole of the assignment. Read from `.opencode/equip.manifest.json`, the
146 tokens group as scout 23, docs 7, plan 7, build 56, review 17, and operate
36 (the live list, not this sample):

| Phase | Resident components |
|---|---|
| scout | `fetch` (mcp), `context7` (mcp), `firecrawl` (mcp), `brave` (mcp), `exa` (mcp), `steadyfetch` (mcp), `context7-mcp` (mcp), `googledrive` (mcp), `notion` (mcp), `deepwiki` (mcp), `mem0-memory-mcp` (mcp), `reference-sequential` (mcp), `gmail` (mcp), `session-start` (hook), `task-dispatcher` (hook), `vantrilex-vanguard` (skill), `vantrilex-prime` (skill), `vantrilex-workflow-forge` (skill), `vantrilex-scout` (agent), `pulsar` (agent), `tldr` (cli), `fx` (cli), `vantrilex-install-prompt` (prompt) |
| docs | `grill-me` (skill), `documentation-as-tests` (skill), `vantrilex-librarian` (agent), `vantrilex-scribe` (agent), `md-to-pdf` (cli), `mermaid-cli` (cli), `target-project-docs-scaffold` (template) |
| plan | `ask-matt` (skill), `wayfinder` (skill), `babel-bridge` (skill), `sequential-thinking` (mcp), `vantrilex-architect` (agent), `aether` (agent), `forge-dag-exemplar` (workflow) |
| build | `tdd` (skill), `ponytail` (skill), `lenis` (skill), `og-image` (skill), `open-graph-image` (skill), `time-capsule-test` (skill), `vantrilex-design-variations` (skill), `openrouter` (mcp), `typescript-lsp` (lsp), `long-running-process-guard` (hook), `typescript-check-after-editing-ts-tsx-files` (hook), `auto-format-js-ts-files-with-prettier-after-edits` (hook), `vantrilex-typescript` (agent), `vantrilex-python` (agent), `vantrilex-fixer` (agent), `vantrilex-ui-designer` (agent), `vantrilex-ux-designer` (agent), `blazar` (agent), `openpencil` (cli), `typescript` (cli), `tsx` (cli), `esbuild` (cli), `vite` (cli), `prettier` (cli), `eslint` (cli), `stylelint` (cli), `cspell` (cli), `markdownlint-cli` (cli), `remark-cli` (cli), `alex` (cli), `write-good` (cli), `typedoc` (cli), `openapi-typescript` (cli), `npm-check-updates` (cli), `depcheck` (cli), `knip` (cli), `madge` (cli), `dependency-cruiser` (cli), `license-checker` (cli), `audit-ci` (cli), `publint` (cli), `attw` (cli), `jscpd` (cli), `commitizen` (cli), `commitlint` (cli), `lint-staged` (cli), `sort-package-json` (cli), `release-it` (cli), `changesets` (cli), `concurrently` (cli), `cross-env` (cli), `dotenv-cli` (cli), `rimraf` (cli), `turbo` (cli), `np` (cli), `stripe` (design.md) |
| review | `code-review` (skill), `ponytail-review` (skill), `red-team` (skill), `skill-shadow` (skill), `github` (mcp), `vantrilex-code-reviewer` (agent), `vantrilex-red-team` (agent), `vantrilex-a11y-audit` (agent), `vantrilex-reviewer` (agent), `vantrilex-verifier` (agent), `vantrilex-harness` (agent), `vantrilex-security-auditor` (agent), `snyk` (cli), `lighthouse` (cli), `pa11y` (cli), `stream-g-guard-probes` (dataset), `verifier-gate-smoke` (benchmark) |
| operate | `ponytail-audit` (skill), `vantrilex-doctrine` (skill), `kit-evaluation-journal` (skill), `kit-evolution-log` (skill), `kill-switch-document` (skill), `vantrilex-atomic-switch` (skill), `filesystem` (mcp), `memory` (mcp), `neon` (mcp), `supabase` (mcp), `vercel` (mcp), `cloudflare` (mcp), `browserbase` (mcp), `slack` (mcp), `discord` (mcp), `stripe` (mcp), `figma-context-mcp` (mcp), `pre-compact` (hook), `persist-session-state-on-end` (hook), `vantrilex-github` (agent), `vantrilex-releaser` (agent), `vercel` (cli), `netlify-cli` (cli), `wrangler` (cli), `supabase` (cli), `prisma` (cli), `drizzle-kit` (cli), `json-server` (cli), `localtunnel` (cli), `newman` (cli), `autocannon` (cli), `artillery` (cli), `envinfo` (cli), `local-web-server` (cli), `prism` (cli), `allow-all-pack` (policy) |
| on-demand | `find-skills` (skill), `skill-creator` (skill), `svgo` (cli), `sharp-cli` (cli), `pwa-asset-generator` (cli), `fkill-cli` (cli), `trash-cli` (cli), `kill-port` (cli), `vantrilex-blazar` (theme), `vantrilex-aether` (theme), `vantrilex-pulsar` (theme) |

`on-demand` sits outside every phase and is never injected by phase: discovery
and forging load on demand instead. An id recorded at two kinds is injected as
both entries. The phase map is normative in [05-DOCTRINE.md](05-DOCTRINE.md);
the catalog records each component's scope, so the orchestrating scripts inject
and prune by reading that field rather than re-deriving the assignment
themselves. This table is a copy of the selection record and must be re-derived
from it, not trusted in place of it.

## The `cli` kind

A `cli` entry is a command-line tool the kit provisions onto the owner's
machine: an executable resolved on `PATH`, invoked by the agent as a
subprocess. It is the one kind whose payoff is a binary rather than prose in
context, which is what makes it cheap — a CLI costs a process spawn and the
tokens of its output, while an MCP server holds context for the whole session.
The kind is scaffolded in both schemas and checked by the catalog verifier; the
catalog holds **64** `cli` rows — 2 scout, 2 docs, 37 build, 3 review,
14 operate, and 6 on-demand — each carrying a real installer command recorded
as `verified`.

| Pinned fact | Source field | What a cli row states |
|---|---|---|
| Identity | `id` plus `kind` `cli` | Which tool, and that it is installed as an executable |
| Install command | `install_cmd` | The real command that puts the binary on `PATH` |
| Version | `version_pin` | Exact version or tag, when the installer can pin one |
| Verification | `verification` | `verified` only when the command was run against a real registry |
| Phase scope | `phase` | The phases in which the agent may invoke it |
| Tier | `tier` | `conditional` for a new entry — per-project opt-in, owner approval required |

### The install-command rule

`install_cmd` must be a real command that installs the binary. Accepted shapes
are a package-manager invocation — `npm i -g <pkg>`, `brew install
<formula>`, `winget install --id <id>`, and the equivalent for the other
managers the verifier recognises — or the vendor's own official installer.
Two things are never acceptable: a bare package name, which is a noun and not
an instruction, and a `curl … | sh` pipe, which runs unreviewed remote code on
the owner's machine. A command that cannot be verified against a real registry
does not get a plausible substitute; the entry is recorded unverified or left
out, per [08-VERIFICATION.md](08-VERIFICATION.md).

The consistency rule is the schema's: a `cli` row claiming `verified` must
carry a non-null `install_cmd`, and a null command is only honest as
`unverified`. `scripts/verify-catalog.mjs` asserts both halves.

### Verification protocol

The protocol is `<binary> --version` exits 0. It is the CLI analogue of the
`list_tools` ping: reachability plus a real invocation of the binary, since a
tool present on `PATH` but not runnable is not provisioned. This is the seventh
row of the per-kind table in [04-VANGUARD.md](04-VANGUARD.md).

### Default tier

A new `cli` entry is tier `conditional` — per-project opt-in requiring owner
approval. The schema has no per-kind default-tier field, so the default lives
here as policy rather than as a schema mechanism; the schema validates `tier`
against the shared `core` / `conditional` / `extended` enum, which is what the
verifier checks. A CLI promoted to `core` is a deliberate owner decision, not a
default.

## The cost guard

On ties, a Skill or CLI wins over an MCP server. An MCP server holds context
for the whole session; a skill loads as prose and unloads when the phase
ends. Selection therefore prefers the cheaper surface whenever two candidates
cover the same need, and the catalog records the lighter choice so later passes
do not re-litigate it.
