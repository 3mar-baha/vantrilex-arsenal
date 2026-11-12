# Vantrilex Arsenal Overview

Vantrilex Arsenal is a shareable OpenCode plugin plus a component registry. It
provisions a target project with a curated, version-pinned kit of agent
components — skills, MCP servers, plugins, hooks, agents, and design documents —
and then governs how that kit is used. It is not a bundle of everything; it is
an arsenal equipped per project. The repository's own statements live in
[README.md](../README.md) and [AGENTS.md](../AGENTS.md); nothing here
contradicts them.

## The three parts

| Part | Location | Role |
|---|---|---|
| Plugin | `.opencode/` | Shipped hooks-as-plugin callbacks, role agents, operator commands, transplanted skills |
| Registry | `registry/` | The 2,927-row catalog: human-readable source plus machine mirror, with 40 candidates beside it |
| Default kit | Tier-0 set in the catalog | What every project receives without questions asked |

The kit specification is `spec/VANTRILEX_KIT_SPEC.md` (naming, the Tier-0 set
in section 2, catalog v2 in section 3, additions in section 4, harvested
mechanisms in section 6, transplant manifest in section 7). The behavior
specification is `spec/VANTRILEX_SKILLS_SPEC.md` (Vanguard in Part A, Doctrine
in Part B). Both are inputs: this documentation describes what they specify.

## The three-skill model

Three skills divide the work, and the division is deliberate: orientation is
separable from selection, and selection from conduct, so a project can run the
scout without inheriting the law.

- **Vantrilex Prime** answers where the Arsenal is. It runs once per machine:
  the canonical repository, how to clone and pin it, what is on disk, how to
  confirm the three skills exist, the order they run in, and the standing laws
  every later phase obeys. It is orientation only — see
  `.opencode/skills/vantrilex-prime/SKILL.md`.
- **Vantrilex Vanguard** answers what this project needs. It inspects the
  target repository, classifies its state, selects the Tier-0 core plus the
  Tier-1 components the stack actually requires, installs them with real
  commands, and proves each one loads. It refuses to hand over a kit it has
  not verified. See [04-VANGUARD.md](04-VANGUARD.md).
- **Vantrilex Doctrine** answers how the kit is used. It defines the role
  model, the constitutional laws, the second-pass release guards, the 3-strike
  circuit breaker, and the session rituals. See [05-DOCTRINE.md](05-DOCTRINE.md)
  and [10-ROLE-MODEL.md](10-ROLE-MODEL.md).

## Tier-0 census, stated honestly

The selection record at `.opencode/equip.manifest.json` carries 147 tokens,
placed over the catalog and provisioned per phase (measured 2026-11-12;
143 at the start of 2026-11-12 after the F-01 tally — then 147 after the
SC-05/D77 Syzygy re-selection of the four build-phase MCP tokens, landed as
`1a4e644`; correction of the 2026-11-11 census, which read 142, itself
corrected from the 145/7-hooks pre-2026-11-11 figure):

| Kind | Selected count | Contents |
|---|---|---|
| Skills | 27 | Vanguard, Prime, Doctrine, the three vs-* forcing skills, the F-01 `vs-zenith-team-control` scout token, plus upstream and conditional Arsenal skills |
| MCP servers | 14 | 1 core server (`mcp/memory`) plus 13 conditional (4 re-selected for build per SC-05/D77, `061f2d9`/`1a4e644`); none suspended |
| Plugins | 0 | No plugin selected; the 11 catalog plugin records stay as reference entries (all `verified`; none selected) |
| Hooks | 8 | 6 core hooks (session-start, task-dispatcher, long-running-process-guard, persist-session-state-on-end, pre-compact, session-end) plus the 2 conditional TypeScript-check and Prettier-format hooks |
| Agents | 25 | 6 core agents (aether, blazar, pulsar, vantrilex, vantrilex-architect, vantrilex-code-reviewer) plus 18 conditional placeable agents, plus 1 suspended (`agent/vantrilex-facet`, no catalog row yet — see D72) |
| LSP servers | 1 | typescript-lsp, the TypeScript language server (build phase, tier `core`, `verified`) |
| CLIs | 65 | 65 selected command-line tools, all tier `conditional`; the catalog carries 71, installed only where the build needs them |
| Other kinds | 7 | prompts 1, templates 1, workflows 1, design records 1, benchmarks 1, datasets 1, policies 1 |

The honest current count is 147 selected components: 28 tier `core` and 118
tier `conditional`, with 1 token suspended — `agent/vantrilex-facet`, the
facet seat (a local authoring with no catalog row yet, recorded in D72) —
so 146 of the 147 resolve against live rows today (measured 2026-11-12 at
2026-11-12 HEAD; the 2026-11-11 census recorded 142 = 28 core + 113
conditional + 1 suspended). Every live catalog row
is `verified` under its declared evidence class — there is no carried
`unverified` state in v5/v6. `registry/catalog.json` carries 2,927 live records
(39 tier `core`, 270 tier `conditional`, the remainder untiered and never
injected) beside 40 candidates in `registry/candidates/`. The catalog recount
stands at 13 default-selected components, enriched from the 16 kind sidecars
merged by the generator (a seventeenth `*.jsonl` — `superseded-by.jsonl`,
F-30, 2026-11-12 — is annotations data, not a kind sidecar)
(agents, benchmarks, cli, datasets, design, formatting, hooks,
lsp, mcp, plugins, policies, prompts, skills, templates, themes, workflows).
A sidecar is a `*.jsonl` file directly in `registry/data/`; `overlaps.yaml` is a relations map, not a sidecar, and the F-30 `superseded-by.jsonl` (2026-11-12) is annotations data, not a kind sidecar. The count is 16 kind sidecars (the generator's merge set); the directory now holds 17 `*.jsonl` files including the F-30 annotations file. (The historical "audit 17" note below was the directory-entry count of 16+1 and is superseded by this correction.)
Tier-1 components — Python, UI, team-flow, and design-system components — are
added by Vanguard only when the project requires them. The 8-MCP cap and the
phase-scoping rule that keep the kit affordable are documented in
[09-KIT-LOCK.md](09-KIT-LOCK.md).

Re-derive every figure above from the selection record and the catalog:

```
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('.opencode/equip.manifest.json','utf8'));const c=require('./registry/catalog.json');const i=new Map(c.components.map(e=>[e.kind+'/'+e.id,e]));const f=Object.values(m.phases).flat();const t={};const k={};const missing=[];for(const x of f){const e=i.get(x);if(!e){missing.push(x);continue;}t[e.tier]=t[e.tier]||0,t[e.tier]++;k[e.kind]=k[e.kind]||0,k[e.kind]++;}console.log('selected',f.length,'tiers',t,'byKind',k,'missing',missing)"
node -e "const c=require('./registry/catalog.json');console.log('records',c.counts.total,'default_selected',c.components.filter(x=>x.default_selected).length,'verified',c.components.filter(x=>x.verification==='verified').length)"
node -e "console.log('sidecars',require('fs').readdirSync('registry/data').filter(f=>f.endsWith('.jsonl')).length)"
```

OpenCode has no standalone hooks directory, so hooks are plugin callbacks: the
8 logical Tier-0 hooks are implemented inside the single plugin file
`.opencode/plugin/arsenal.ts` rather than as 8 separate files. The
`task-dispatcher` hook runs on the OpenCode V2 surface — registered from `setup()`
against the session `prompt` hook — while the other hooks and the
docs-discipline guard remain on the V1 `server()` surface and are **inert under
V2** (the plugin itself records that `session-start`, `pre-compact` and
`session-end` have nowhere correct to land on the V2 surface yet). That gap is
deliberate and unfinished, not a completed port, and it does
not move the census: 147 selected components, 8 of them hooks (measured
2026-11-12; the 2026-11-11 figure of 142 was corrected in the F-26 census
sweep). The
task-dispatcher hook is
documented in [16-TASK-DISPATCH.md](16-TASK-DISPATCH.md).

## The Node-only toolchain

Runtime requirements are `git` and Node 25, with zero dependencies in the
registry tooling. The catalog generator, the registry verifier, and the plugin
itself are dependency-free Node ESM. No Python, no bundler, no framework, no
`jq`, no `tmux` assumptions enter this repository — a shareable plugin must
not ask a user to install a language runtime just to read a catalog. The 14
conditional skills Vanguard equips for a project that needs them — including
`vantrilex-design-variations`, which fires before any styling work is written —
are catalog kit components, not a fourth top-level skill. Shell scripts are
POSIX `bash`, checked by `shellcheck` in CI. See
[02-INSTALLATION.md](02-INSTALLATION.md) and [08-VERIFICATION.md](08-VERIFICATION.md).

## Repository state

The foundation (license, lint config, registry schema, generator, verifier,
sidecars, formatting vendor set) is implemented. The three skills, the kit lock
manifest, and the release lane are implemented on main; each file below
describes the built component instead of pretending otherwise.
