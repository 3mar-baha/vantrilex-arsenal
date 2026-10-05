# Vantrilex Arsenal

**Three skills, one registry, one pinned kit.**

Vantrilex Arsenal is a shareable OpenCode plugin plus a component system. It
provisions a target project with a curated, version-pinned kit of skills, MCP
servers, plugins, hooks, agents, and design conventions — then governs how that
kit is used. It is not a bundle of everything; it is an arsenal you equip per
project.

| Element | Name | Role |
|---|---|---|
| The kit | **Vantrilex Arsenal** | Everything that gets provisioned onto a project |
| Skill 1 | **Vantrilex Prime** | Orientation: where the Arsenal is and how to pin it |
| Skill 2 | **Vantrilex Vanguard** | Scout: detect the project, select and equip the kit, verify it works |
| Skill 3 | **Vantrilex Doctrine** | Law: roles, gates, workflows, rituals |
| The catalog | **Vantrilex Registry** | 2,736 components, machine-readable, install commands honestly labelled |

The repository is Node 25, ESM, and zero dependencies. It contains **no AI or
ML model logic** — only Markdown, JSON, and Node ESM. Nothing here may invent an
install command.

---

## What the Arsenal is

Two parts, with one boundary between them:

- **A shareable OpenCode plugin** — `.opencode/` ships the plugin, the three
  top-level skills, four role agents, and four operator commands.
- **A component system** — `registry/` is the catalog the plugin draws from,
  and `kit/kit.lock` is the pinned, verified subset of that catalog every
  project receives.

The plugin provisions; it does not decide. Selection lives in the Registry and
`kit/kit.lock`, conduct lives in Doctrine, and the plugin only enforces what
those two declare. That is why the kit is *version-pinned*: a project that
equipped last quarter gets the same components it got last quarter.

---

## The three skills

**Vantrilex Prime** answers *where the Arsenal is*. It runs once per machine,
not once per project: it states what the Arsenal is, gives the canonical
repository URL, shows how to clone and pin it with `git rev-parse HEAD`, lists
what is on disk, shows how to confirm the three skills exist, fixes the order
Prime → Vanguard → Doctrine runs in, and states the standing laws every later
phase obeys. Orientation only — it does not survey the project, and it does not
define how work is conducted. See
[`.opencode/skills/vantrilex-prime/SKILL.md`](.opencode/skills/vantrilex-prime/SKILL.md).

**Vantrilex Vanguard** answers *what does this project need?* It is the EQUIP
phase, run once per target project. It detects one of four project states by
scanning the repository rather than asking, surveys the resources present,
selects and installs the kit with real commands, verifies each component
installs and loads, reports what it equipped, and prepares the 28-file
target-project documentation system. It refuses to hand over a kit it has not
verified. See
[`.opencode/skills/vantrilex-vanguard/SKILL.md`](.opencode/skills/vantrilex-vanguard/SKILL.md).

**Vantrilex Doctrine** answers *how is the kit used?* It is the WORK phase. It
defines the role model, the constitutional laws an agent may not break, the
phase-to-skill map, and the workflows for features, reviews, security audits,
bug fixes, and releases — including the second-pass release guards and the
3-strike circuit breaker that halts a defect that has survived three failed
fix attempts. See
[`.opencode/skills/vantrilex-doctrine/SKILL.md`](.opencode/skills/vantrilex-doctrine/SKILL.md).

The separation is deliberate: **orientation, then selection, then conduct.**
Prime does not duplicate Vanguard's four project states, and Vanguard does not
duplicate Doctrine's workflows. A project can therefore run the scout without
inheriting the law, and can be re-equipped on new terms without renegotiating
its conduct rules. Only those three are top-level skills; the remaining
**17 skill folders** under `.opencode/skills/` are kit content that Vanguard
equips — 12 conditional skills plus the transplanted mechanisms.

---

## Quickstart

```text
git clone https://github.com/3mar-baha/vantrilex-arsenal.git
cd vantrilex-arsenal
git rev-parse HEAD          # pin this commit; the kit is version-pinned
```

Then, in the order the three skills are meant to run:

1. **Prime** — run `vantrilex-prime` once on this machine. It records where the
   Arsenal lives and what is on disk.
2. **Vanguard** — run `vantrilex-vanguard` in each target project you want to
   equip. It detects the project state, installs the kit, verifies it, and
   writes the target-project documentation.
3. **Doctrine** — run `vantrilex-doctrine` for the work itself: features,
   reviews, audits, fixes, releases.

Operator entry points for the same phases live in `.opencode/command/`:
`prime`, `equip`, `doctor`, and `release`.

---

## The Registry

`registry/` holds the component catalog in two forms:

- **`registry/VANTRILEX_CATALOG.md`** — the human-readable source of truth. The
  table and the per-kind `_index.md` files are generated; edit the generator or
  the JSONL sidecars, never the generated table by hand.
- **`registry/catalog.json`** — the generated machine mirror Vanguard reads. It
  is regenerated, never hand-edited.

The catalog carries **2,736 records** across six kinds:

| Kind | Records |
|---|---|
| skill | 1,503 |
| mcp | 905 |
| agent | 284 |
| hook | 19 |
| formatting | 13 |
| plugin | 12 |
| **Total** | **2,736** |

The catalog is enriched from six `registry/data/*.jsonl` sidecars — one per
kind — each with exactly one owning branch at a time. Every record carries a
`when_to_use` trigger, a lifecycle `phase`, a `tier`, a `verify_cmd`, an
`install_cmd`, a `verification` state, and a `default_selected` flag. **22
components are default-selected.**

**The honesty rule.** 12 components carry a verified install command. Every
remaining install command is mechanically derived from the component's source
repository and is marked `verification: unverified` rather than presented as
checked. Agents, plugins, and hooks are recorded with a `null` `install_cmd`
and `verification: unverified` — no invented command, ever. A plausible-looking
wrong command is worse than an admission of ignorance, because an agent will
run it.

---

## Kit census

`kit/kit.lock` pins **51 components with an empty `pending` list**: 35 tier
`core` and 16 tier `conditional`.

| Kind | Locked | tier `core` | tier `conditional` |
|---|---|---|---|
| skill | 25 | 13 | 12 |
| mcp | 8 | 8 | 0 |
| plugin | 6 | 6 | 0 |
| hook | 6 | 4 | 2 |
| agent | 6 | 4 | 2 |
| **Total** | **51** | **35** | **16** |

By verification: **12 `verified`** and **39 `unverified`**. The 12 verified
entries are the 10 upstream skills installed by `npx skills add`, plus the
`context7` and `firecrawl` MCP servers, which are version-pinned.

| Locked | Contents |
|---|---|
| 25 skills | Prime, Vanguard, Doctrine, 10 upstream skills, 12 conditional in-repo skills |
| 8 MCP servers | filesystem, fetch, memory, sequential-thinking, github, context7, firecrawl, openrouter |
| 6 plugins | code-review, commit-commands, typescript-lsp, context7, feature-dev, security-guidance |
| 6 hooks | 4 core session hooks, plus 2 conditional: TypeScript check and Prettier format |
| 6 agents | architect, Code Reviewer, AI-Generated Code Security Auditor, Technical Writer, plus red-team and a11y-audit |

**The 8-MCP cap.** `mcp_cap` is **8** — the ceiling on tier-core MCP servers,
and the locked set sits exactly at it. The cap is a context-budget backstop: MCP
servers are the most expensive components to keep resident, so the kit refuses
to grow past that ceiling and, on ties, prefers a Skill or a CLI over an MCP
server.

Twenty skill folders exist on disk under `.opencode/skills/`, of which
**15 are locked kit components** and only **three are top-level skills**
(Prime, Vanguard, Doctrine). The remaining five — `circuit-breaker-guard`,
`github-release-packager`, `pre-mortem`, `preflight-system-doctor`, and
`session-context-primer` — are transplanted mechanisms present on disk but not
locked into the default kit.

> **Implementation note.** OpenCode has no standalone hooks directory — hooks
> are plugin callbacks. The 6 logical Tier-0 hooks are implemented inside a
> single plugin file, `.opencode/plugin/arsenal.ts`, rather than as 6 separate
> files. The two conditional hooks stay locked for that reason: the plugin
> already implements them, and a separate install would be a second path to the
> same guard.

---

## Verification gates

A task is not finished because the code runs; it is finished when the thing is
proven. Every gate below is runnable from the repository root and every one must
exit 0. **A skipped check counts as a failure, never a pass.**

| Gate | Command | What it proves |
|---|---|---|
| Registry data | `node scripts/verify-registry.mjs` | 6 checks: strict UTF-8, schema conformance, row-count integrity against the generated tables, the install-command invariant, orphan references, duplicate ids |
| Catalog mirror | `node scripts/generate-catalog-json.mjs --check` | the generated machine mirror `registry/catalog.json` matches the Markdown source of truth |
| Kit | `node scripts/verify-kit.mjs` | 11 checks: the lockfile validates against its schema, each component kind is honest, catalog agreement between lock and mirror, the MCP cap, pending integrity |
| Skills | `node scripts/verify-skills.mjs` | 10 checks: the skill-file format contract — frontmatter, the seven required headings, no placeholders, no excluded toolchains, file hygiene, single-home mechanisms |
| Plugin typecheck | `npx tsc --noEmit -p tsconfig.json` | `.opencode/plugin/arsenal.ts` typechecks under `strict` |
| Shell lint | `shellcheck scripts/*.sh .githooks/*` | the orchestration scripts and git hooks are lint-clean |

If a check cannot be evaluated, that is a **failed** check, not a skipped one.

---

## Repository layout

```text
vantrilex-arsenal/
├── .opencode/                    Shipped surface
│   ├── plugin/arsenal.ts         The 6 Tier-0 hooks as plugin callbacks
│   ├── skills/                   20 folders: the 3 top-level skills + kit components
│   ├── agent/                    Leader / Guide / Implementer / red-team
│   └── command/                  Operator entry points: doctor, equip, prime, release
├── registry/                     Data plane — the component catalog
│   ├── VANTRILEX_CATALOG.md      Source of truth (generated table)
│   ├── catalog.json              Generated machine mirror
│   ├── schema/catalog-v2.schema.json   The record contract
│   ├── data/                     Six per-kind JSONL sidecars + overlaps.yaml
│   ├── formatting/               Curated design-system documents + ATTRIBUTION.md
│   └── {skills,mcp,plugins,hooks,agents}/
│                                  Per-kind records and generated _index.md
├── scripts/                      Node ESM, zero dependencies
│   ├── generate-catalog-json.mjs Generator for the mirror and the tables
│   ├── verify-registry.mjs       Registry consistency checks
│   ├── verify-kit.mjs            Kit lockfile checks
│   ├── verify-skills.mjs         Skill-file format checks
│   └── *.sh                      Worktree orchestration, git hooks, release
├── kit/kit.lock                  The pinned 51-component kit
└── docs/                         00-INDEX.md … 15-DECISIONS.md, plus
                                  docs/spec/ — the two canonical input specs
```

`docs/` holds a 16-file numbered set from `00-INDEX.md` through
`15-DECISIONS.md`, plus `docs/spec/` which holds the two canonical input
specifications, `VANTRILEX_KIT_SPEC.md` and `VANTRILEX_SKILLS_SPEC.md`. The
28-file documentation system Vanguard prepares is generated into the *target*
project at runtime and is deliberately not part of this repository's layout.

---

## Toolchain

`git` and **Node 25** are the only hard requirements. The Registry tooling — the
catalog generator, the registry verifier, the kit verifier, the skills verifier
— is dependency-free Node ESM. No Python, no second language runtime, no
bundler, no framework, no `jq`, and no terminal multiplexer. This is deliberate:
a shareable plugin should not ask a user to install a language runtime just to
read a catalog. Shell scripts are POSIX `bash`, checked by `shellcheck`.

---

## License

MIT © 2026 3mar-baha. See [LICENSE](LICENSE).

Vendored third-party design-system documents under `registry/formatting/`
retain their original MIT licences and are credited in
[`registry/formatting/ATTRIBUTION.md`](registry/formatting/ATTRIBUTION.md).
