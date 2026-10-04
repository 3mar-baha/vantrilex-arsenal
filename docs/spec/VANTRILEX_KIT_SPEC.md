# Vantrilex Kit — Specification v1.0

**Status:** draft for owner review (planning day 2026-10-04)
**Base catalog:** `workspace/user/files/VANTRILEX_CATALOG.md` (2699 components; UTF-8 repaired 2026-10-04)
**Companion:** the two-skill OpenCode plugin design (Vanguard = scout/equip, Doctrine = workflows)

---

## 1. Naming scheme — "Vantrilex + something heavy"

| Element | Name | Arabic | Why |
|---|---|---|---|
| The kit (skills+MCP+LSP+agents+hooks+formatting) | **Vantrilex Arsenal** | ترسانة فانتريليكس | An arsenal = weapons you *choose* per battle. Matches the "select the best set" doctrine. |
| Skill 1 (survey + equip) | **Vantrilex Vanguard** | طليعة فانتريليكس | The vanguard goes in first, scouts the terrain, secures the ground. Exactly what Skill 1 does. |
| Skill 2 (workflows + laws) | **Vantrilex Doctrine** | عقيدة فانتريليكس | A doctrine = body of laws + battle drills. Heavier than "playbook"; carries the constitutional weight (agent never works directly, only directs). |
| The catalog | **Vantrilex Registry** | سجل فانتريليكس | Keep the existing name — it is already the folder/brand. |
| The OpenCode plugin bundle | **Vantrilex Arsenal for OpenCode** | — | Ships Vanguard + Doctrine + Registry defaults. |
| The 28-file docs system | *(unnamed for now — candidate: Vantrilex Codex)* | — | Named only if needed later. |

**Rejected alternatives:** Aegis (shield — defensive, we are offensive), Citadel (static, we move), Overmind (villain-coded).

---

## 2. Default set — the full kit, tiered

**Tier 0 = VANTRILEX CORE** — provisioned on every project, no questions.
**Tier 1 = CONDITIONAL** — Vanguard adds per stack/project type.

### 2.1 Skills — Tier 0 (12)

| # | Skill | State | Role in the system |
|---|---|---|---|
| 1 | ⭐ Vantrilex Vanguard | NEW (to build) | Skill 1: surveys sources + project state, selects and installs the kit |
| 2 | ⭐ Vantrilex Doctrine | NEW (to build) | Skill 2: the workflow manual + laws |
| 3 | find-skills | ✅ keep | Ecosystem discovery ("how do I do X") |
| 4 | ask-matt | ✅ keep | Router: which skill/flow fits this situation |
| 5 | skill-creator | ✅ keep | Forge new skills when the catalog has no fit |
| 6 | grill-me | ↑ promote | Interrogate the idea/plan BEFORE docs phase |
| 7 | wayfinder | ↑ promote | Decision-tickets BEFORE planning phase |
| 8 | tdd | ↑ promote | Build discipline during implementation |
| 9 | code-review | ✅ keep | Two-axis review (standards × spec) after every feature |
| 10 | ponytail | ✅ keep | Lazy-senior-dev mode for any coding task |
| 11 | ponytail-review | ↑ promote | Diff review for over-engineering |
| 12 | ponytail-audit | ↑ promote | Periodic whole-repo audit |

Related (Tier 1, pulled when needed): `ponytail-debt` (debt ledger), `ponytail-gain` (impact scoreboard), `grill-with-docs` (grilling that emits ADRs), `loop-me`.

### 2.2 MCP servers — Tier 0 (8, the cap)

| # | Server | State | Why it is core |
|---|---|---|---|
| 1 | filesystem | ✅ keep | Scoped file access — the hands |
| 2 | fetch | ✅ keep | Web fetch + extraction — the eyes |
| 3 | memory | ✅ keep | Persistent knowledge graph — the memory |
| 4 | sequential-thinking | ✅ keep | Structured reasoning — the brain |
| 5 | github | ↑ promote (catalog #308) | Repos, issues, PRs — the forge |
| 6 | context7 | ➕ ADD (missing as MCP; exists only as plugin) | Live docs lookup — **the skill-finder for MCPs/CLIs** (per design: every chosen MCP/CLI must have its docs reachable via Context7) |
| 7 | firecrawl | ➕ ADD (completely missing) | Deep web scrape/extract — the deep eyes |
| 8 | openrouter | ✅ keep | $0.00 model matrix transport (Sara) |

**Cap law:** max 8 MCP servers in Tier 0 (context budget). Prefer Skill/CLI over MCP on ties.

### 2.3 Plugins — Tier 0 (6)

| # | Plugin | State |
|---|---|---|
| 1 | code-review | ✅ keep |
| 2 | commit-commands | ✅ keep |
| 3 | typescript-lsp | ✅ keep |
| 4 | context7 | ↑ promote |
| 5 | feature-dev | ↑ promote |
| 6 | security-guidance | ↑ promote |

Tier 1 (stack): `pyright-lsp` (Python), `frontend-design` (UI-heavy), `pr-review-toolkit` (team flow), `mgrep`.

### 2.4 Hooks — Tier 0 (6)

| # | Hook | State | Trigger |
|---|---|---|---|
| 1 | session-start | ✅ keep | SessionStart — load context (pairs with the session-start ritual) |
| 2 | pre-compact | ✅ keep | PreCompact — save state before compaction |
| 3 | block-dev-servers-outside-tmux | ✅ keep | Guard: logs stay accessible |
| 4 | persist-session-state-on-end | ↑ promote | SessionEnd — persist learnings (closes the loop with #1) |
| 5 | typescript-check-after-editing-ts-tsx-files | conditional | TS/TSX projects |
| 6 | auto-format-js-ts-files-with-prettier-after-edits | conditional | JS/TS projects |

Also wired per design: `block-creation-of-random-md-files` (docs stay in the 28 files — Tier 0 candidate, owner to confirm).

### 2.5 Agents — Tier 0 (4)

| # | Agent | State | Role |
|---|---|---|---|
| 1 | architect | ✅ keep | System design, scalability, technical decisions |
| 2 | Code Reviewer (cat. #47) | ↑ promote | Post-feature review lane |
| 3 | AI-Generated Code Security Auditor (cat. #14) | ↑ promote | Security audit lane |
| 4 | Technical Writer (cat. #237) | ↑ promote | Docs-phase lane (the 28 files) |

Tier 1: DevOps Automator (#68), researcher/scout agents for state-2 codebase recon (parallel fan-out).

### 2.6 LSP / formatting — Tier 0/1

- Tier 0: typescript-lsp (plugin), prettier (hook).
- Tier 1: pyright-lsp (Python), awesome-design-md design-tokens doc (UI projects) — see §4.

**Default totals: 12 skills + 8 MCP + 6 plugins + 6 hooks + 4 agents = 36 core components** (up from 17).

---

## 3. Catalog v2 — making it AI-consumable

The current catalog is a human-readable markdown table. An agent needs **machine-readable, actionable** records. Upgrade, don't rewrite:

### 3.1 Schema v2 (per item)

```yaml
id: ponytail-review            # stable slug
name: ponytail-review
kind: skill                    # skill | mcp | plugin | hook | agent | formatting
description: "Review a diff for over-engineering…"
source: dietrichgebert/ponytail
install_cmd: "npx skills add dietrichgebert/ponytail --skill ponytail-review"  # REAL command
version_pin: "v1.4.2"          # for kit.lock; null = floating
category: code-quality
tags: [review, refactoring, yagni]
when_to_use: "After every feature diff, before merge"   # one-line trigger
phase: review                  # scout | docs | plan | build | review | operate
tier: core                     # core | conditional | extended
verify_cmd: "skill dry-run: review sample diff"          # how Vanguard checks it works
cost_note: light               # light | heavy (context weight)
```

### 3.2 Concrete changes

1. **`install` column → real commands.** Today it holds a bare repo slug (useless to an agent). Skills → `npx skills add <repo> --skill <name>`; MCP → JSON snippet for `mcp.json`; agents → repo path + spawn pattern; hooks → event + command.
2. **Add `when_to_use` + `phase` + `tier`.** This is what lets Vanguard *select* instead of *list*. The phase map (grill-me→docs, wayfinder→plan, tdd→build, code-review→review) becomes data, not prose.
3. **Machine mirror: `catalog.json`.** Generated from the md (single source of truth stays md). Vanguard reads JSON; humans read md. Regenerate on every catalog edit (script).
4. **Overlap map.** 1485 skills contain families and near-dupes. Record `supersedes` / `pairs_with` (e.g. ponytail ↔ ponytail-review ↔ ponytail-audit; grill-me ↔ grill-with-docs). Selection rule: never install both sides of `supersedes`.
5. **Dedupe pass** over skills + MCP (same server listed under two names).
6. **Per-folder `_index.md`** (already planned in README) — generated from catalog, one per kind, listing Tier 0 first.
7. **UTF-8 hygiene** — repaired 2026-10-04 (6 corrupted byte sequences: truncated `…` / `→`). Add a CI-style check: `python3 -c "open('VANTRILEX_CATALOG.md',encoding='utf-8').read()"`.

### 3.3 What Vanguard must verify before pinning (install_cmd candidates)

- Context7 MCP: `npx -y @upstash/context7-mcp` — verify package name + Smithery listing.
- Firecrawl MCP: `npx -y firecrawl-mcp` — verify package name.
- Smithery pattern: `npx @smithery/cli install <server> --client opencode` — per https://smithery.ai/docs/concepts/cli.

---

## 4. Additions checklist (onto the adopted catalog)

| # | Addition | Target section | Notes |
|---|---|---|---|
| 1 | context7 MCP server entry | MCP | Real install cmd + verify |
| 2 | firecrawl MCP server entry | MCP | Real install cmd + verify |
| 3 | skills.sh leaderboard entries (ponytail family has them; add install counts) | Skills | `installs` field; prefer 1K+ |
| 4 | agency-agents roster (subset: the roles, not all) | Agents | https://github.com/msitarzewski/agency-agents |
| 5 | awesome-design-md files | NEW kind: `formatting` | https://github.com/voltagent/awesome-design-md — design tokens + component conventions |
| 6 | ecc hooks | Hooks | https://github.com/affaan-m/ecc — the comprehensive set |
| 7 | Smithery registry entries (curated, not all) | MCP | Via CLI doc above; each with real install cmd |
| 8 | Vantrilex Vanguard + Vantrilex Doctrine | Skills (Tier 0) | The two skills themselves, once built |
| 9 | `when_to_use` / `phase` / `tier` backfill | ALL | Start with Tier 0 (36 items), expand outward |

---

## 5. Open owner decisions

1. Approve names: **Vantrilex Arsenal** (kit), **Vantrilex Vanguard** (skill 1), **Vantrilex Doctrine** (skill 2)?
2. Approve Tier 0 default set (§2) — esp. the 3 MCP additions and the 8-server cap.
3. `block-creation-of-random-md-files` → Tier 0? (protects the 28-file docs discipline)
4. Proceed to build Vanguard + Doctrine skill files from this spec?
