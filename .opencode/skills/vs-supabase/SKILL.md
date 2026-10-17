---
name: vs-supabase
description: "Use when Supabase Postgres schema, migrations, logs, advisories, Edge Functions, storage config, or project branching must be inspected or changed through the Supabase MCP with inspect-before-change and advisories-first discipline."
---

# Vs Supabase

## Purpose

Give Supabase MCP runs one inspect-before-change, advisories-first
discipline, so schema work, migrations, log queries, and Edge Function
moves resolve through scoped tools and quoted evidence instead of
memory.

## When to Use

- Any task involving Supabase products, client libraries, auth issues,
  CLI or MCP server, schema changes, audits, extensions, debugging and
  logs.
- Writing or changing anything that lives in a Postgres database, and
  for slow-query diagnosis (load `supabase-postgres-best-practices`
  first).
- Listing tables, extensions, or migrations before a schema decision.
- Running `get_advisors` or `query_logs` before a migration or a
  performance claim.
- Deploying or secreting an Edge Function through the Dashboard URL
  flow.
- Enabling the Storage or Branching groups explicitly with a stated
  reason and gate.

## Do NOT use

- For general Postgres work with no Supabase product, MCP server, or
  Supabase-hosted project in scope — use plain Postgres practice, not
  this skill.
- As a hosting, search, memory, or comms skill — Supabase is the
  Postgres fallback in the MCP pair table, nothing broader.
- To bypass confirmations — cost and destructive-SQL pauses are
  guardrails, not proof of approval; manual tool-call approval stays on.
- To handle tokens or secret values — OAuth is owner browser action;
  Edge Function secret values enter only in the Dashboard URL flow,
  never as tool arguments.
- To run OS commands — `execute_sql` runs SQL only; shell needs go to
  the owning lane.

## Inputs

- The concern (one sentence), the project scope (`project_ref`), and
  the feature groups needed (`features=<groups>`, narrowest set).
- The `read_only` posture for the run (`read_only=true` baseline;
  mutating calls named explicitly with their exact SQL or parameters).
- The procedural rules in force: MCP tool list plus the two
  agent-skills (`supabase`, `supabase-postgres-best-practices`).
- The local-vs-remote target (`http://localhost:54321/mcp` preferred;
  remote `https://mcp.supabase.com/mcp` only with a stated reason).

## Procedure

1. Scope first: set `project_ref`, `read_only=true`, and
   `features=<groups>`; record the exact scope line in the report.
2. Load rules: read the `supabase` skill for product moves and
   `supabase-postgres-best-practices` before any Postgres write or
   slow-query diagnosis.
3. Inspect: run `list_tables`; add `list_extensions` and
   `list_migrations` where schema or extensions are in scope. Quote
   what returned.
4. Advise: run `get_advisors` and, where logs matter, `query_logs`
   (read-only log query). Quote advisories before proposing any change.
5. Propose, then wait: state the exact SQL or migration parameters for
   `execute_sql` / `apply_migration`; destructive SQL and
   `create_project` / `create_branch` pause for their confirmation
   flow — quote which flow applied. No silent mutation.
6. Edge Functions: use `list_edge_functions` / `get_edge_function` for
   reads and `deploy_edge_function` for deploys; secret values never
   enter tool args — Dashboard URL flow only.
7. Groups with gates: Storage (off by default) and Branching
   (experimental, paid-plan-gated) are enabled explicitly with a why
   and the gate named.
8. Prove it: re-list or re-query after the change; record local vs
   remote, confirmation flow, and every source or `unverified` mark.

## Outputs

- The scope line (`project_ref`, `read_only`, `features`) as run.
- Tables, extensions, migrations, advisories, and logs observed,
  quoted with source sections.
- The exact SQL or parameters proposed or applied, plus the
  confirmation flow that applied.
- Local-vs-remote statement and the reason when remote was touched.
- Follow-ups and `unverified` marks for anything not probed live.

## Failure Modes

- **Write before inspect.** A migration proposed without
  `list_tables` plus `get_advisors` quoted is rejected and re-run
  read-first.
- **Advisories skipped.** A performance claim without `get_advisors`
  and `query_logs` is `unverified`, never a finding.
- **Scope creep.** All groups enabled by default convenience is
  refused; narrowest `features` wins, Storage and Branching need an
  explicit why.
- **Secret in args.** Any secret or token value in chat or tool args
  aborts the run; the value is revoked first per repo law, then removed.
- **OS via SQL.** Any shell smuggled through `execute_sql` aborts the
  run and is escalated.
- **Confirmation mistaken for approval.** A pause that fired is quoted
  as the flow, never as human sign-off; sign-off belongs to the owner.
- **Invented evidence.** A table, migration, advisory, install command,
  or registry ID not returned live is a gap marked `unverified`, never
  a quoted fact.
