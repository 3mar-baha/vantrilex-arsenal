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
| Registry | `registry/` | The 2,889-row catalog: human-readable source plus machine mirror, with 40 candidates beside it |
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

The selection record at `.opencode/equip.manifest.json` carries 145 tokens,
placed over the catalog and provisioned per phase:

| Kind | Selected count | Contents |
|---|---|---|
| Skills | 25 | Vanguard, Prime, Doctrine, plus upstream and conditional Arsenal skills |
| MCP servers | 26 | 8 core servers (context7, fetch, filesystem, firecrawl, github, memory, openrouter, sequential-thinking) plus 18 conditional; none suspended |
| Plugins | 0 | No plugin selected; the 11 catalog plugin records stay as unverified reference entries |
| Hooks | 7 | 5 core hooks (3 session, task-dispatch on the session prompt, and long-running-process-guard on `tool.execute.before`), plus the 2 conditional TypeScript-check and Prettier-format hooks |
| Agents | 21 | 5 core agents (architect, code-reviewer, aether, pulsar, blazar) plus 16 conditional specialist agents |
| LSP servers | 1 | typescript-lsp, the TypeScript language server (build phase, tier core, verification `unverified`) |
| CLIs | 58 | 58 selected command-line tools, every one `verified`; the catalog carries 64, installed only where the build needs them |
| Other kinds | 7 | prompts 1, templates 1, workflows 1, design records 1, benchmarks 1, datasets 1, policies 1 |

The honest current count is 145 selected components: 30 tier `core` and 115
tier `conditional`. No token is suspended, so all 145 resolve against live rows
today. Every live catalog row
is `verified` under its declared evidence class — there is no carried
`unverified` state in v4. `registry/catalog.json` carries 2,889 live records
(39 tier `core`, 233 tier `conditional`, the remainder untiered and never
injected) beside 40 candidates in `registry/candidates/`. The catalog recount
stands at 20 default-selected components, enriched from 16 sidecars merged by
the generator (agents, benchmarks, cli, datasets, design, formatting, hooks,
lsp, mcp, plugins, policies, prompts, skills, templates, themes, workflows).
Tier-1 components — Python, UI, team-flow, and design-system components — are
added by Vanguard only when the project requires them. The 8-MCP cap and the
phase-scoping rule that keep the kit affordable are documented in
[09-KIT-LOCK.md](09-KIT-LOCK.md).

Re-derive every figure above from the selection record and the catalog:

```
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('.opencode/equip.manifest.json','utf8'));const c=require('./registry/catalog.json');const i=new Map(c.components.map(e=>[e.kind+'/'+e.id,e]));const f=Object.values(m.phases).flat();console.log('selected',f.length);const t={};const k={};for(const x of f){const e=i.get(x);t[e.tier]=t[e.tier]||0,t[e.tier]++;k[e.kind]=k[e.kind]||0,k[e.kind]++;}console.log('tiers',t,'byKind',k)"
node -e "const c=require('./registry/catalog.json');console.log('records',c.counts.total,'default_selected',c.components.filter(x=>x.default_selected).length,'verified',c.components.filter(x=>x.verification==='verified').length)"
node -e "console.log('sidecars',require('fs').readdirSync('registry/data').filter(f=>f.endsWith('.jsonl')).length)"
```

OpenCode has no standalone hooks directory, so hooks are plugin callbacks: the
7 logical Tier-0 hooks are implemented inside the single plugin file
`.opencode/plugin/arsenal.ts` rather than as 7 separate files. The seventh,
`task-dispatcher`, runs on the OpenCode V2 surface — registered from `setup()`
against the session `prompt` hook — while the other six hooks and the
docs-discipline guard remain on the V1 `server()` surface and are **inert under
V2**. That gap is deliberate and unfinished, not a completed port, and it does
not move the census: 145 selected components, 7 of them hooks. The seventh hook is
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
