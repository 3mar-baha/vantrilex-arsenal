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
| Registry | `registry/` | The 2736-component catalog: human-readable source plus machine mirror |
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

The default kit as locked in `kit/kit.lock` is 51 components, provisioned on
every project:

| Kind | Locked count | Contents |
|---|---|---|
| Skills | 25 | Vanguard, Prime, Doctrine, plus 10 upstream skills, plus 12 conditional Arsenal skills |
| MCP servers | 8 | filesystem, fetch, memory, sequential-thinking, github, context7, firecrawl, openrouter |
| Plugins | 6 | code-review, commit-commands, typescript-lsp, context7, feature-dev, security-guidance |
| Hooks | 6 | 4 core session hooks, plus the 2 conditional TypeScript-check and Prettier-format hooks |
| Agents | 6 | architect, Code Reviewer, AI-Generated Code Security Auditor, Technical Writer, plus red-team and a11y-audit |

The honest current count is 35 tier `core` records plus 16 tier `conditional`
records, which is 51 locked components with an empty `pending` list. The two
conditional hooks stay locked because `.opencode/plugin/arsenal.ts` already
implements them, so a separate install would be a second path to the same
guard. `registry/catalog.json` today carries 2736 records in total.
The catalog recount stands at 22 default-selected components and 12 verified
install commands, enriched from 6 sidecars merged by the generator (skills,
mcp, plugins, hooks, agents, formatting). Tier-1 components — Python, UI,
team-flow, and design-system components — are added by Vanguard only when the
project requires them. The 8-MCP cap and the phase-scoping rule that keep the
kit affordable are documented in [09-KIT-LOCK.md](09-KIT-LOCK.md).

OpenCode has no standalone hooks directory, so hooks are plugin callbacks: the
6 logical Tier-0 hooks are implemented inside the single plugin file
`.opencode/plugin/arsenal.ts` rather than as 6 separate files.

## The Node-only toolchain

Runtime requirements are `git` and Node 25, with zero dependencies in the
registry tooling. The catalog generator, the registry verifier, and the plugin
itself are dependency-free Node ESM. No Python, no bundler, no framework, no
`jq`, no `tmux` assumptions enter this repository — a shareable plugin must
not ask a user to install a language runtime just to read a catalog. The 12
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
