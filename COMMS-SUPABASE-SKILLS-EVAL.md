# COMMS-SUPABASE-SKILLS-EVAL — Baseline vs With-Skill Grades

Lane `VTA-COMMS-SUPABASE-01`, node `k-land`. Date (UTC): 2026-10-17. English only. Static evals only: no live Supabase probe ran on this node (owner OAuth-gated live claims stay `unverified`). Procedure inputs: installed `.agents/skills/supabase/SKILL.md` + `.agents/skills/supabase-postgres-best-practices/SKILL.md` (untouched, read-only) and `.opencode/skills/vs-supabase/SKILL.md` §§ Procedure / Do NOT use.

## Scenario A — Schema discipline (add nullable `display_name` to `profiles`)

Task: propose the migration for a nullable `display_name` column on `profiles` with advisories-first discipline and best-practices load.

With-skill note: loads `supabase-postgres-best-practices` BEFORE authoring (installed SKILL.md: load before creating or altering tables and columns, including choosing column types; `references/schema-constraints.md` for safe migration patterns); checks the Supabase changelog for breaking changes first (installed supabase SKILL.md Core Principle 1); follows `vs-supabase` procedure steps 2–4 (scope line with `project_ref` + `read_only=true` + narrowest `features`, `list_tables` inspect, `get_advisors` before any SQL); proposes exact migration parameters with the destructive-SQL confirmation flow named; no secret in args.

Baseline note (no skill): jumps to `execute_sql` with an assumed table shape; no changelog check; no best-practices load; no scope line; no advisory check; confirmation flow unnamed.

Grade: with-skill PASS, baseline FAIL. Trigger fired correctly on schema-change wording.

## Scenario B — Product routing and Edge Function secret

Task: attach a third-party API key to an Edge Function, on a lane that also holds plain-Postgres work.

With-skill note: routes by trigger surface — installed `supabase` description fires on Edge Functions and Supabase products; installed `supabase-postgres-best-practices` fires on anything living in Postgres anywhere; `vs-supabase` Do NOT use keeps plain-Postgres work off the Supabase MCP. For the key: lists functions, names the Dashboard URL flow, refuses the value as a tool argument (U-bundle §1: `create_edge_function_secret` never takes the secret value; value enters only in the Dashboard via URL elicitation); cites the installed supabase SKILL.md security checklist (scoped tokens for Management API/CLI/MCP; never expose `service_role` in public clients).

Baseline note (no skill): asks the user to paste the secret in chat and reaches for a classic token from memory.

Grade: with-skill PASS, baseline FAIL (secret-handling violation).

## Live-execution boundary

Both scenarios are static notes. Live apply, `list_tables`, `get_advisors`, and `query_logs` evidence remain `unverified` until owner OAuth completes. Nothing below claims a live result.

## Gates quoted (this node)

```text
npx markdownlint-cli COMMS-SUPABASE-SKILLS-INSTALL.md COMMS-SUPABASE-SKILLS-EVAL.md COMMS-SUPABASE-SKILLS-POLISH.md  →  exit 0 (quoted post-write; re-run after polish lands)
Secret/pin/TODO sweep on the three notes  →  quoted in polish note §5
git status --porcelain  →  quoted in install note §1 pre-install and re-quoted post-write in polish note §5
```
