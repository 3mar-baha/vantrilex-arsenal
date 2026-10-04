# Vantrilex Arsenal

**A shareable OpenCode plugin: two skills, one component registry, one default kit.**

Vantrilex Arsenal provisions an OpenCode project with a curated, version-pinned kit of
skills, MCP servers, plugins, hooks, agents, and design conventions — then governs how
that kit is used. It is not a bundle of everything; it is an arsenal you equip per
project.

| Element | Name | Role |
|---|---|---|
| The kit | **Vantrilex Arsenal** | Everything that gets provisioned onto a project |
| Skill 1 | **Vantrilex Vanguard** | Scout: detect the project, select and equip the kit, verify it works |
| Skill 2 | **Vantrilex Doctrine** | Law: roles, gates, workflows, rituals |
| The catalog | **Vantrilex Registry** | 2,699 components, machine-readable, install commands verified |

---

## The two skills

**Vantrilex Vanguard** answers one question: *what does this project need?* It inspects
the target repository, classifies it, injects the Tier-0 core plus the Tier-1 components
the stack actually requires, and proves each component installed and loads. It refuses to
hand over a kit it has not verified.

**Vantrilex Doctrine** answers a different question: *how is the kit used?* It defines the
role model, the constitutional laws an agent may not break, the second-pass release
guards, the 3-strike circuit breaker, and the session rituals that bracket real work.

The division is deliberate: selection is separable from conduct, so a project can run
Vanguard without inheriting Doctrine's constraints.

---

## The Registry

`registry/` holds the component catalog in two forms:

- **`VANTRILEX_CATALOG.md`** — the human-readable source of truth.
- **`registry/catalog.json`** — the machine mirror Vanguard reads.

Every record carries a real install command, a `when_to_use` trigger, a lifecycle
`phase`, a `tier`, and a `verify_cmd`. Components whose install command has **not** been
verified are marked `verification: unverified` rather than given an invented command.

Each kind also has a generated `_index.md` listing Tier-0 first.

---

## Tier-0 default kit

36 components provisioned on every project without questions:

| Kind | Count | Contents |
|---|---|---|
| Skills | 12 | Vanguard, Doctrine, plus 10 upstream skills (find-skills, ask-matt, skill-creator, grill-me, wayfinder, tdd, code-review, ponytail, ponytail-review, ponytail-audit) |
| MCP servers | 8 | filesystem, fetch, memory, sequential-thinking, github, context7, firecrawl, openrouter |
| Plugins | 6 | code-review, commit-commands, typescript-lsp, context7, feature-dev, security-guidance |
| Hooks | 6 | session-start, pre-compact, session-end, long-running-process guard, TypeScript check, Prettier format |
| Agents | 4 | architect, Code Reviewer, AI-Generated Code Security Auditor, Technical Writer |

The MCP set is capped at 8 as a context-budget backstop; on ties a Skill or CLI wins over
an MCP server. Tier-1 components (Python, UI, team-flow, and design-system components)
are added by Vanguard only when the project requires them.

> **Implementation note.** OpenCode has no standalone hooks directory — hooks are
> plugin callbacks. The 6 logical Tier-0 hooks are implemented inside a single plugin
> file, `.opencode/plugin/arsenal.ts`, rather than as 6 separate files.

---

## Toolchain

Node 25 and `git` are the only hard requirements. The Registry tooling (catalog
generator, registry verifier, kit verifier) is written in dependency-free Node ESM —
no Python, no `jq`, no `tmux`. This is deliberate: a shareable plugin should not ask a
user to install a language runtime to read a catalog.

---

## Repository layout

```
vantrilex-arsenal/
├── .opencode/
│   ├── plugin/arsenal.ts        Tier-0 hooks as plugin callbacks
│   ├── skills/                  Vanguard, Doctrine, transplanted mechanisms
│   ├── agent/                   Leader / Guide / Implementer
│   └── command/                 Operator entry points
├── registry/
│   ├── VANTRILEX_CATALOG.md     Source of truth (generated table)
│   ├── catalog.json             Generated machine mirror
│   ├── schema/                  Catalog v2 JSON Schema
│   ├── data/                    Per-kind JSONL sidecars (single-writer each)
│   ├── formatting/              Curated design-system documents
│   └── {skills,mcp,plugins,hooks,agents}/
│                                  Per-kind records and generated _index.md
├── scripts/                     Generator, verifiers, worktree orchestration
├── kit/kit.lock                 Pinned Tier-0 kit
└── docs/                        16-file Arsenal set + spec/ provenance
```

---

## Build status

This repository is under active construction. Implemented and verified:

| Area | State |
|---|---|
| Repository foundation, license, lint config | Implemented |
| Registry catalog v2 schema + generator + verifier | In progress |
| Registry per-kind data (skills, MCP, plugins, hooks, agents) | In progress |
| Design-system (`formatting/`) vendor set | In progress |
| Vantrilex Vanguard skill | Pending |
| Vantrilex Doctrine skill | Pending |
| Arsenal plugin, role agents, operator commands | Pending |
| Worktree orchestration scripts, CI, release workflow | Pending |

Progress is reported at build gates. `CHANGELOG.md` records what has actually landed.

---

## License

MIT © 2026 3mar-baha. See [LICENSE](LICENSE).

Vendored third-party design-system documents retain their original MIT licenses and are
credited in `registry/formatting/ATTRIBUTION.md`.