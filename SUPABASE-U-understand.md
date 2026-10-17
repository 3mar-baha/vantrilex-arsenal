# SUPABASE-U-understand — Supabase capability evidence bundle

Owner: `vantrilex-librarian` · Node: `u-understand` · Lane: `SUPABASE-MCP`.
Observed: 2026-10-17 (UTC) · Kit lock in force: `vantrilex-core`
(`kit/kit.lock`, no kit version field observed).
Methodology context: `VTA-FACTORY-08-PLAN.md` §§ 5.2, 6, 7.1 (read-only).

Every claim below carries its source URL plus section citation.
Unreachable sources are marked `unverified` with reason.
Unknowns are marked `UNKNOWN`. Nothing is reconstructed from memory.

## 1 — Supabase MCP remote surface (per features-flag area)

Primary source: `https://supabase.com/docs/guides/getting-started/mcp`
(section `Available tools`, read live 2026-10-17).

Hosted server URL: `https://mcp.supabase.com/mcp`.
Local dev URL: `http://localhost:54321/mcp`.
Source section: same page, section `Remote MCP installation`.
Scope parameters: `project_ref`, `read_only`, `features`, `skip_elicitations`.
Source section: same page, section `Configuration options`.

All groups except Storage are enabled by default.
Source section: same page, section `Available tools` lead paragraph.
Selection shape: `?features=database,docs` (comma-separated groups).
Source section: same page, section `Remote MCP installation` lead.

### 1.1 Area-by-area tools

| Area | Tools observed | Source section |
| --- | --- | --- |
| Docs | `search_docs` | `Available tools` → `Docs` |
| Account management | `list_projects`, `get_project`, `create_project`, `pause_project`, `restore_project`, `list_organizations`, `get_organization`, `get_cost`, `confirm_cost` | `Available tools` → `Account management` |
| Database | `list_tables`, `list_extensions`, `list_migrations`, `apply_migration`, `execute_sql` | `Available tools` → `Database` |
| Debugging | `query_logs`, `get_advisors` | `Available tools` → `Debugging` |
| Development | `get_project_url`, `get_publishable_keys`, `generate_typescript_types` | `Available tools` → `Development` |
| Edge Functions | `list_edge_functions`, `get_edge_function`, `deploy_edge_function`, `create_edge_function_secret` | `Available tools` → `Edge Functions` |
| Branching (experimental) | `create_branch`, `list_branches`, `delete_branch`, `merge_branch`, `reset_branch`, `rebase_branch` | `Available tools` → `Branching (experimental)` |
| Storage (disabled by default) | `list_storage_buckets`, `get_storage_config`, `update_storage_config` | `Available tools` → `Storage (disabled by default)` |

Area notes with section citations (same MCP page unless stated):

- Account tools are disabled when project-scoped mode is used
  (`project_ref` parameter). Section: `Account management` note.
- Branching requires a paid plan. Section: `Branching (experimental)` note.
- `query_logs` runs a read-only SQL query against project logs.
  Section: `Debugging` bullet.
- `create_edge_function_secret` never takes the secret value as a tool
  argument; the value is entered only in the Supabase Dashboard via a URL
  elicitation flow. Section: `Edge Function secrets`.
- Destructive SQL (`execute_sql`, `apply_migration`) pauses for form
  confirmation when SQL elicitation is available; otherwise the existing
  execution path applies. Section: `Destructive SQL confirmations`.
- Cost confirmation pauses `create_project` and `create_branch` on explicit
  approval; the legacy `get_cost` / `confirm_cost` workflow applies when
  form confirmation is unavailable or skipped. Section: `Cost confirmation`.
- Security posture: project scoping, read-only mode, restricted feature
  groups, narrowest query, manual tool-call approval.
  Section: `Security risks` → `Recommendations`.

## 2 — Supabase agent-skills repo content

Repo: `https://github.com/supabase/agent-skills` (read live 2026-10-17).
Docs: `https://supabase.com/docs/guides/getting-started/ai-skills`
(read live 2026-10-17).

What it covers (quoted from the repo README, `Available Skills`):

- Skill `supabase`: any task involving Supabase products, client libraries,
  auth issues, CLI or MCP server, schema changes, audits, extensions,
  debugging and logs.
- Skill `supabase-postgres-best-practices`: Postgres best practices for any
  Postgres anywhere; load before writing or changing anything that lives in
  a Postgres database, and for slow-query diagnosis.

Install shape (quoted from repo README `Installation` and docs page):

```sh
npx skills add supabase/agent-skills
```

```sh
npx skills add supabase/agent-skills --skill supabase
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
```

Update shape (docs page, `Updating skills`): `npx skills update`.
Skills install at project scope by default; `--global` installs across
projects; `--all` adds skills for all detected agents.
Source section: docs page, `Installing skills`.

License: MIT, copyright 2026 Supabase.
Source: `https://raw.githubusercontent.com/supabase/agent-skills/main/LICENSE`
(read live 2026-10-17, first line `MIT License`).

Version or commit observed: latest `main` commit `c9be0e931b7930f7d02126d04774d904c381e7d7`
(`chore: release main (#609)`, committer date 2026-10-02T12:34:48Z).
Source: `https://api.github.com/repos/supabase/agent-skills/commits?per_page=1`
(read live 2026-10-17). No semver tag was resolved in this pass; the
Changelog and release-please manifest exist in-tree but their current
version string was not quoted here, so release version is `UNKNOWN`.

Format: each skill follows the Agent Skills Open Standard (`SKILL.md`
manifest plus optional `references/`).
Source section: repo README, `Skill Structure`.
Count of skills in repo: 2 (`supabase`, `supabase-postgres-best-practices`).
Source section: repo README, `Available Skills`.

## 3 — Auth model (OpenCode)

Config shape for OpenCode (quoted from the MCP page, `OpenCode` block):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "supabase": {
      "type": "remote",
      "url": "https://mcp.supabase.com/mcp",
      "enabled": true
    }
  }
}
```

Auth command (quoted from the same `OpenCode` block):

```sh
opencode mcp auth supabase
```

Flow: the command opens the owner browser to complete the OAuth flow.
Default mechanism is dynamic client registration; no personal access token
is needed. Source sections: `OpenCode` block; `Manual authentication` lead.
Token custody: owner-side OAuth grant; workers never handle tokens; no token
or secret enters the repo. Source: lane law (`WORKFLOW.md` Part B §3:
`OAuth is owner action (browser); workers never handle tokens`) plus the
MCP page `Authentication` note (`You don't need a personal access token`).
CI exception (non-interactive only): scoped personal access token passed as
an `Authorization: Bearer` header via environment variables
(`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`); check client header
support first. Source section: `Manual authentication` → `CI environment`.
Manual OAuth-app exception: create an org OAuth app and copy client ID plus
secret into the MCP client; all scopes currently required.
Source section: `Manual authentication` → `Manual OAuth app`.

## 4 — Reachability ledger

| Source | Reached | Evidence quoted |
| --- | --- | --- |
| `https://supabase.com/docs/guides/getting-started/mcp` | yes 2026-10-17 | Tool lists per area; OpenCode config and auth; elicitation and security sections |
| `https://github.com/supabase/agent-skills` | yes 2026-10-17 | README install shape; two skill names; MIT license link |
| `https://supabase.com/docs/guides/getting-started/ai-skills` | yes 2026-10-17 | Install, update, per-skill install commands |
| `https://raw.githubusercontent.com/supabase/agent-skills/main/LICENSE` | yes 2026-10-17 | `MIT License`, `Copyright (c) 2026 Supabase` |
| `https://api.github.com/repos/supabase/agent-skills/commits?per_page=1` | yes 2026-10-17 | SHA `c9be0e9...`, date 2026-10-02 |
| Live Supabase project probe (list tables via MCP) | no | `unverified`: owner OAuth not yet run on this seat; no probe attempted |
| agent-skills semver release number | no | `UNKNOWN`: not quoted from `CHANGELOG.md` in this pass |

## 5 — Forge-input summary (for the agent and skill author)

1. Scope with URL parameters first: `project_ref` plus `read_only=true`
   plus `features=<groups>` is the safety baseline for every forged skill.
2. The forged skill needs two tool families, not one: MCP tools above for
   live work plus the two agent-skills (`supabase`,
   `supabase-postgres-best-practices`) for procedural rules.
3. Never route secrets through chat or tool args: Edge Function secret
   values go only in the Dashboard URL flow; tokens stay owner-side.
4. Cost and destructive-SQL confirmations are guardrails, not proof of
   human approval; keep manual tool-call approval on and quote which flow
   applied. Forge distills the Supabase MCP Docs.
5. Branching is experimental and paid-plan-gated; Storage is off by
   default — the forge must enable each group explicitly and say why.
