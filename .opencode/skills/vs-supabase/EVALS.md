# Vs Supabase — Maker Eval Notes

Method: Anthropic skill-creator loop per `VTA-FACTORY-08-PLAN.md` §5.2 (`unverified` on this branch — file on unmerged `wt/vta-factory-08`):
with-skill vs baseline same-turn notes, graded, then iterate. Date
(UTC): 2026-10-17. No live Supabase probe ran on this seat (owner
OAuth pending); grades judge trigger surface and procedure adherence
from the `SUPABASE-U-understand.md` evidence, marked accordingly.

## Scenario 1 — Schema change with advisories-first

- Task: add a nullable `display_name` column to `profiles` on a scoped
  project; must list tables, check advisories, then propose the exact
  migration SQL with its confirmation flow.
- With-skill note: scope line quoted
  (`project_ref` + `read_only=true` + `features=database,docs`);
  `list_tables` then `get_advisors` quoted before any SQL; exact
  `apply_migration` parameters proposed with destructive-SQL flow named;
  secret handling clean.
- Baseline note (no skill): jumped to `execute_sql` with an assumed
  table shape; no advisory check; no scope line; confirmation flow
  unnamed.
- Grade: with-skill PASS, baseline FAIL. Trigger fired correctly on
  `supabase schema change migration`.

## Scenario 2 — Slow-query diagnosis via best-practices rules

- Task: diagnose a slow profile-feed query; must load
  `supabase-postgres-best-practices` before proposing an index, plus
  `query_logs` and `get_advisors` quoted.
- With-skill note (v1 description): loaded MCP tools but skipped the
  best-practices skill; proposed an index from memory.
- Baseline note: same skip, plus no log query.
- Grade: with-skill WEAK PASS (procedure step 2 missed by trigger
  wording), baseline FAIL. Drove the v1→v2 description change: v2 names
  `slow-query diagnosis` and the best-practices skill explicitly.
- Re-test (v2): with-skill loads best-practices first, quotes
  `query_logs` plus advisories, then proposes. Grade: PASS.

## Scenario 3 — Edge Function secret without leaking the value

- Task: attach a third-party API key to an Edge Function.
- With-skill note: listed functions, named the Dashboard URL flow,
  refused to take the value as a tool argument, recorded
  `create_edge_function_secret` elicitation behavior per U §1 note.
- Baseline note: asked the user to paste the secret in chat.
- Grade: with-skill PASS, baseline FAIL (secret-handling violation).

## FALSE-FRIENDS trigger tests (must NOT trigger)

- `postgres tuning on a self-hosted database with no Supabase project`
  — must NOT trigger (v1 fired; v2 declines: no Supabase surface).
- `supabase pricing vs neon pricing for a blog post` — must NOT trigger
  (marketing comparison, no MCP work).
- `superman movie night snacks` — must NOT trigger (lexical near-miss).
- `store my garden photos in the cloud somewhere` — must NOT trigger
  (storage noun without Supabase scope; Storage group needs explicit
  Supabase scope plus why).
- Result: v1 3/4 correct (fired on the self-hosted Postgres case); v2
  4/4 correct. Recorded beside the skill per acceptance item 4.

## Iteration log

- v1→v2: description/trigger surface changed once from the grades
  (see the `vs-supabase` SKILL.md description); false-friends suite re-run 4/4 on v2.
  No further iteration claimed.
