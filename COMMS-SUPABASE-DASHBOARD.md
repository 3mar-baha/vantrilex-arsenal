# COMMS-SUPABASE-DASHBOARD — Status-pills view plus Table-Editor interim

Status: SPEC-ONLY reviewed text DRAFT. Live execution HELD for owner OAuth (NOT-RUN).

Lane: VTA-COMMS-SUPABASE-01, node `d-dashboard` (wave 2; SPEC-ONLY).

Scope-first line (proposed, not executed): `project_ref=<owner-confirmed>`, `read_only=true`, `features=<narrowest group for the concern>`; Storage stays off (the brief names no storage concern and gives no why); Branching stays off (experimental, paid-plan-gated; no gate named in the brief). Zero MCP calls were attempted on this node — see Skill discipline.

Sources: `COMMS-SUPABASE-SCHEMA.sql` (root, wave-0 draft, read live 2026-10-17, lines 1–88); `COMMS-SUPABASE-BUS.md` (root, wave-1 spec, read live 2026-10-17); `WORKFLOW.md` Part B (order DAG, per this brief); `vs-supabase` skill method (read-only, inspect-before-change plus advisories-first). No live Supabase call ran; every live claim below is marked NOT-RUN or `unverified`.

Unknowns carried (not resolved here): RLS project-identity source is UNKNOWN (schema file carries this explicitly; owner confirmation required before apply). View name `messages_status` is a draft proposal (the brief names no view name; the schema file marks it as proposed). Dashboard query parameter names below are proposals. No probe ran on this node, so inspect-before-change and advisories-first are `unverified` and carried as LIVE-wave obligations.

## Status-pills view statement

Exact view statement quoted from `COMMS-SUPABASE-SCHEMA.sql` lines 71–88 (static text, NOT-RUN). The view itself takes no parameters; the project filter and newest-first ordering live in the dashboard query in the next section.

```sql
CREATE OR REPLACE VIEW messages_status AS
SELECT
  id,
  from_agent,
  to_agents,
  project,
  title,
  needs_user_action,
  created_at,
  claimed_by,
  claimed_at,
  acked_at,
  CASE
    WHEN acked_at IS NOT NULL THEN 'acked'
    WHEN claimed_by IS NOT NULL THEN 'claimed'
    ELSE 'pending'
  END AS status
FROM messages;
```

CASE rule (quoted from the schema file): `acked` wins over `claimed`, so an acked row never renders as claimed. Column list is the 10 message columns above plus the derived `status` pill (`body` is intentionally excluded from the view; open the row for the full body).

## Per-pill definitions

| Pill | Predicate (from the CASE rule) | Meaning |
| --- | --- | --- |
| `pending` | `claimed_by IS NULL` (and `acked_at IS NULL` by construction) | Unclaimed and awaiting a claimer. A stale claim the reaper reset also reads `pending`. |
| `claimed` | `claimed_by IS NOT NULL AND acked_at IS NULL` | One claimer holds the row; work is in flight but not yet acknowledged. |
| `acked` | `acked_at IS NOT NULL` | Completed and closed. Terminal for dashboard purposes; the reaper never touches acked rows. |

Counts query shape (proposal, NOT-RUN): group the view by `status` with `WHERE project = $1` to render the three pill counters. The exact statement is owned by the dashboard query below.

## Table-Editor interim procedure (no code)

Until the dashboard query runs live, the Supabase Dashboard Table Editor is the interim status board. Open the Table Editor, pick the table or view, and read the proving columns — no SQL is issued in this procedure.

1. Open the `messages` table. This is the write-side source of truth: it carries `body` plus the three lifecycle columns.
2. Prove `pending`: filter to rows where `claimed_by` is empty (NULL) and `acked_at` is empty (NULL). Sort `created_at` newest first.
3. Prove `claimed`: filter to rows where `claimed_by` is set (non-NULL) and `acked_at` is empty (NULL). Confirm the holder in `claimed_by` and the age in `claimed_at`; a `claimed_at` older than 10 minutes is stale per the lease rule and returns to `pending` after the reaper runs.
4. Prove `acked`: filter to rows where `acked_at` is set (non-NULL). `claimed_by` may still hold the former claimer; the pill reads `acked` regardless because the CASE checks `acked_at` first.
5. Open the `messages_status` view (draft-proposed name) to read the computed `status` column directly when the view exists. Cross-check any surprising pill by opening the same `id` in `messages` and re-reading `claimed_by` and `acked_at`.
6. Scope each check to one project: filter the `project` column to the caller project. Project identity source is UNKNOWN — carried, not resolved here.

## Recent-messages dashboard query

Draft SELECT over the proposed `messages_status` view (static text, NOT-RUN). `$1` = caller project (text, proposal); `$2` = page size / limit (integer, proposal).

```sql
SELECT id, from_agent, to_agents, project, title, needs_user_action, created_at, claimed_by, claimed_at, acked_at, status
FROM messages_status
WHERE project = $1
ORDER BY created_at DESC
LIMIT $2;
```

Reader protocol: pass the caller project as `$1` on every call (never omit the filter; the view itself is unfiltered). Pass the dashboard page size as `$2`. Render newest first per `ORDER BY created_at DESC`. Derive the three pill counters by grouping this result by `status`. A row whose pill looks stale (claimed but old `claimed_at`, still unacked) is re-checked against the 10-minute lease rule; the reaper statement is owned by the schema file and the bus spec, not repeated here.

## Skill discipline

Scope-first: the scope line above is proposed, not executed — no `project_ref` was set and no MCP tool was called on this node.

Zero MCP calls attempted. Why: this node is SPEC-ONLY by brief (`NO live execution of any kind`), and the LIVE wave is gated on owner OAuth (shared unblocker with SUPABASE-MCP W4). Reads (`list_tables`, `list_extensions`, `list_migrations`, `get_advisors`, `query_logs`, `search_docs`) and mutating calls (`execute_sql`, `apply_migration`, branching, storage config) were all deliberately not attempted; there is no confirmation flow to quote because nothing ran. No local `http://localhost:54321/mcp` run either — the brief provides no local stack, so local-vs-remote is: neither touched, both NOT-RUN.

Inspect-before-change and advisories-first are therefore `unverified` for this node (no probe ran) and are carried as LIVE-wave obligations, not claimed here.

Unknowns marked: RLS project-identity source UNKNOWN; view name `messages_status` is a proposal; dashboard `$1` / `$2` parameter names are proposals; pill-counter grouping is a proposal; Table-Editor procedure issues no code and claims no live observation.

## Secret sweep and self-review

Secret sweep: this file carries zero secrets by construction (no tokens, keys, bearer values, or credential-shaped assignments; secret names appear only as pattern references). Quoted verification runs below.

Spec self-review (author pass, 2026-10-17): view statement quotes the schema file CASE rule verbatim with acked-wins ordering and notes the view is parameterless; per-pill table maps each pill to its predicate plus lease note; Table-Editor procedure names which table and view to open, which columns prove each pill, project scoping, and newest-first sort, with no code block; dashboard query carries project plus limit parameters with newest-first ordering; skill discipline carries the scope-first line, the zero-MCP-calls reason (SPEC-ONLY plus OAuth pending), and the unknowns; RLS-identity UNKNOWN is carried, not resolved; English only; sole artifact is this file.
