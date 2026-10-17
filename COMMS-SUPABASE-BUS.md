# COMMS-SUPABASE-BUS — Message-bus logic spec

Status: SPEC-ONLY reviewed text DRAFT. Live execution HELD for owner OAuth (NOT-RUN).

Lane: VTA-COMMS-SUPABASE-01, node `d-buslogic` (wave 1; SPEC-ONLY).

Scope-first line (proposed, not executed): `project_ref=<owner-confirmed>`, `read_only=true`, `features=<narrowest group for the concern>`; Storage stays off; Branching stays off (experimental, paid-plan-gated). Zero MCP calls were attempted on this node — see Skill discipline.

Sources: `COMMS-SUPABASE-SCHEMA.sql` (root, wave-0 draft, read live 2026-10-17); `WORKFLOW.md` Part B (order DAG, read live 2026-10-17); `.githooks/pre-commit` (observed secret patterns, read live 2026-10-17); `vs-supabase` SKILL.md on branch `wt/supabase-capability` (method, read-only via `git show`, 2026-10-17). No live Supabase call ran; every live claim below is marked NOT-RUN or `unverified`.

Unknowns carried (not resolved here): RLS project-identity source is UNKNOWN (schema file carries this explicitly; owner confirmation required before apply). No file named `validate-commit` was found in this tree (`unverified` — grep for `validate-commit` returned zero hits outside this brief); the interim denylist below is quoted from the observed `.githooks/pre-commit` hook and is a proposal until the owner names the real validate-commit source. `pgcrypto` / `gen_random_uuid()` availability is `unverified` (no live extension check ran). Realtime channel and filter names are proposals (static, no connection attempted).

## Schema reference

The messages table is defined in `COMMS-SUPABASE-SCHEMA.sql` with 11 columns:

`id`, `from_agent`, `to_agents`, `project`, `title`, `body`, `needs_user_action`, `created_at`, `claimed_by`, `claimed_at`, `acked_at`.

Column facts quoted from the schema file: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`; `from_agent text NOT NULL`; `to_agents text[] NOT NULL`; `project text NOT NULL`; `title text NOT NULL`; `body text NOT NULL`; `needs_user_action boolean NOT NULL DEFAULT false`; `created_at timestamptz NOT NULL DEFAULT now()`; `claimed_by text` (nullable); `claimed_at timestamptz` (nullable); `acked_at timestamptz` (nullable).

## POST — validate then INSERT

POST creates a pending message. Order: secret-scan first, then required-field check, then INSERT. A POST that fails either check is rejected with no INSERT attempted.

### POST step 1 — secret-scan before INSERT

Scan `title` and `body` (and any other free-text field carried on the envelope) against the denylist before any INSERT is built.

Interim denylist (quoted from the observed `.githooks/pre-commit` hook, DRAFT until the owner names the validate-commit source):

- Known API-key formats: `sk-ant-*`, `sk-or-v1-*`, `gh*_ *` and `github_pat_*`, `xox*-*`, `AKIA*` shapes as matched by the hook pattern.
- Credential-shaped assignments: a `KEY` / `SECRET` / `TOKEN` / `PASSWORD` name assigned to a long literal (24 or more secret characters).
- Bearer tokens inside an `Authorization` header value.
- A new committed file named `.env` (envelope equivalent: a body that embeds a full dotenv payload is rejected; reference secret names only, never values).

Rule: any denylist hit rejects the POST. The sender replaces the value with a reference (name only) and re-submits. This scan never logs or stores the offending value beyond the rejection notice.

### POST step 2 — required-field check vs schema file

Required (NOT NULL without a usable default): `from_agent`, `to_agents`, `project`, `title`, `body`. Each must be present and non-empty. `to_agents` must be an array with at least one entry (array-length floor is a proposal — the schema file constrains `NOT NULL` only, not minimum length). `project` must equal the caller's project identity (identity source UNKNOWN — carried, not resolved here). Defaults apply only to `id`, `needs_user_action` (`false`), and `created_at` (`now()`); `claimed_by`, `claimed_at`, and `acked_at` must be NULL on POST (a POST that pre-claims or pre-acks is rejected).

### POST step 3 — INSERT with all 11 columns

Draft statement (static text, NOT-RUN). `$1`–`$11` map to the 11 columns in schema order:

```sql
INSERT INTO messages (id, from_agent, to_agents, project, title, body, needs_user_action, created_at, claimed_by, claimed_at, acked_at)
VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6, COALESCE($7, false), COALESCE($8, now()), NULL, NULL, NULL);
```

Caller protocol: build the INSERT only after steps 1 and 2 pass; pass explicit values for `from_agent`, `to_agents`, `project`, `title`, `body`, and `needs_user_action`; let `id` and `created_at` default unless the caller holds a pre-assigned id; always insert NULL for `claimed_by`, `claimed_at`, and `acked_at`.

## CLAIM — atomic single-winner UPDATE

Exact atomic-claim statement quoted from `COMMS-SUPABASE-SCHEMA.sql` line 55 (static text, NOT-RUN). `$1` = claimer identity (text), `$2` = message id (uuid):

```sql
UPDATE messages SET claimed_by = $1, claimed_at = now() WHERE id = $2 AND claimed_by IS NULL;
```

Single-winner semantics (quoted from the schema file): the predicate `claimed_by IS NULL` means at most one row version can transition from unclaimed to claimed. Two racers issuing the same UPDATE for the same id serialize in Postgres; the first to commit sets `claimed_by`, so the second predicate no longer matches and it updates zero rows.

Caller protocol: issue the UPDATE, then read the affected row count. Row count 1 means this caller won the claim. Row count 0 means this caller lost (another caller won) or the id is UNKNOWN. On 0, the loser must re-read the row to see the winner (see Race-test procedure) and back off — never retry blindly in a tight loop.

Lease semantics (10 minutes): a claim older than 10 minutes that is still unacked is stale and returns to pending. Exact reaper statement quoted from `COMMS-SUPABASE-SCHEMA.sql` line 62 (static text, NOT-RUN):

```sql
UPDATE messages SET claimed_by = NULL, claimed_at = NULL WHERE claimed_at < now() - interval '10 minutes' AND acked_at IS NULL;
```

Reaper invocation point: run the reaper before each CLAIM sweep (reap-then-claim) and additionally on a periodic schedule owned by the LIVE wave. The reaper never sets `acked_at` and never touches acked rows (`acked_at IS NULL` predicate). A CLAIM that follows a reap may therefore win a previously stale id; the row-count protocol above still decides the winner.

## ACK — close the message

ACK records completion. Draft statement (new proposal — the schema file owns no ACK text; static, NOT-RUN). `$1` = message id (uuid), `$2` =acker identity (text):

```sql
UPDATE messages SET acked_at = now() WHERE id = $1 AND acked_at IS NULL AND (claimed_by = $2 OR $2 = ANY(to_agents));
```

Only-by-claimer-or-recipient rule (stated): exactly one of the following must hold for the ACK to apply, otherwise the UPDATE must match zero rows — (a) the acker is the current claimer (`claimed_by = acker`), or (b) the acker is a named recipient (`acker = ANY(to_agents)`). An already-acked row (`acked_at IS NOT NULL`) never re-acks (`acked_at IS NULL` predicate). A stale-claim row that the reaper already reset is not ackable by the former claimer unless the former claimer is also a recipient — re-claim first, then ACK.

Caller protocol: issue the UPDATE, read the row count. Row count 1 means this caller recorded the ack. Row count 0 means not-authorized (neither claimer nor recipient), already acked, or id UNKNOWN — re-read the row and report which case holds; never force-set `acked_at`.

## READ — poll loop plus Realtime alternative (both static, no connection)

Both shapes below are static text. No connection was attempted on this node.

### Poll loop shape (static)

Draft SELECT (proposal, NOT-RUN). `$1` = caller project (text), `$2` = caller identity (text), `$3` = page size:

```sql
SELECT id, from_agent, to_agents, project, title, body, needs_user_action, created_at, claimed_by, claimed_at, acked_at
FROM messages
WHERE project = $1 AND $2 = ANY(to_agents) AND acked_at IS NULL
ORDER BY created_at DESC
LIMIT $3;
```

Poll loop (static pseudocode, not executed):

```text
loop every <interval owned by the watchers wave>:
  reap stale claims (reaper statement above)
  SELECT pending-for-me newest-first (SELECT above)
  for each row: CLAIM it (atomic UPDATE + row-count protocol)
  on win: process, then ACK (rule above)
  on loss: re-read winner, back off
```

### Supabase Realtime alternative (static, no connection)

Static channel and filter shape (proposal, NOT-RUN, no subscription opened):

```text
channel: "messages:project=eq.<caller-project>"
filter: postgres_changes on table "messages", event "*", filter "project=eq.<caller-project>"
client-side gate: keep the row only when <caller-identity> = ANY(to_agents) AND acked_at IS NULL
ordering: newest-first by created_at before CLAIM
```

Rule: Realtime is a wake-up hint only. Every hinted row still goes through re-read, the atomic CLAIM UPDATE, and the row-count protocol — a hint never counts as a claim. If Realtime is unreachable, the poll loop above is the fallback; both shapes converge on the same CLAIM and ACK statements.

## Race-test procedure (NOT-RUN — OAuth pending)

Purpose: prove single-winner CLAIM under contention.

Setup (LIVE wave only): two racers (Racer A, Racer B), one message id in unclaimed state (`claimed_by IS NULL`, `acked_at IS NULL`). Both racers hold distinct claimer identities and the same target id.

Procedure (static, NOT-RUN):

1. Reset: confirm the target row is unclaimed (`SELECT claimed_by, claimed_at, acked_at` shows NULL, NULL, NULL).
2. Fire: both racers issue the exact atomic-claim UPDATE for the same id as simultaneously as the harness allows, each with its own `$1` identity and the shared `$2` id.
3. Read counts: record each racer's affected row count.
4. Assert: exactly one racer reports row count 1 (the winner) and the other reports row count 0 (the loser). Any other outcome (0/0, 1/1) is a FAIL.
5. Loser path: the row-count-0 racer re-reads the row (`SELECT claimed_by, claimed_at`), observes the winner's identity, and backs off (no immediate retry on the same id).
6. Winner path: the row-count-1 racer confirms `claimed_by` equals its own identity, then completes the drill (process plus ACK per the rule above) or releases via the reaper path per the runbook.

LIVE-wave runbook (steps plus expected outputs, NOT-RUN — owner OAuth is the shared unblocker with SUPABASE-MCP W4):

1. Owner completes browser OAuth (`opencode mcp auth supabase` is an owner browser action; workers never handle tokens).
2. Scope the run first: quote `project_ref`, `read_only=false` for the mutating step only, and the minimal `features` group; manual tool-call approval stays on.
3. Inspect first: `list_tables` confirms `messages` exists; `get_advisors` plus `query_logs` run before any migration or performance claim.
4. POST one drill message (validate-scan plus required-field check pass); expected output: one row, unclaimed, unacked.
5. Run the two-racer simultaneous CLAIM above; expected output: exactly one row-count-1 winner, one row-count-0 loser; loser re-read shows the winner.
6. Winner ACKs (only-by-claimer-or-recipient rule holds); expected output: `acked_at` set, status reads `acked`.
7. Announce per the lane contract with quoted commands and outputs. No merge, tag, or release from this lane.

Status of this procedure on this node: NOT-RUN. No live execution of any kind occurred here.

## Skill discipline

Scope-first: the scope line above is proposed, not executed — no `project_ref` was set and no MCP tool was called on this node.

Zero MCP calls attempted. Why: this node is SPEC-ONLY by brief (`NO live execution of any kind`), and the LIVE wave is gated on owner OAuth (shared unblocker with SUPABASE-MCP W4). Reads (`list_*`, `get_*`, `query_logs`, `search_docs`) and mutating calls (`execute_sql`, `apply_migration`, branching, storage) were all deliberately not attempted; there is no confirmation flow to quote because nothing ran.

Inspect-before-change and advisories-first are therefore `unverified` for this node (no probe ran) and are carried as LIVE-wave obligations, not claimed here.

Unknowns marked: RLS project-identity source UNKNOWN; validate-commit denylist source UNKNOWN (interim patterns quoted from `.githooks/pre-commit`); `pgcrypto` availability `unverified`; Realtime channel and filter names are proposals; array-length floor on `to_agents` is a proposal; ACK and READ statements are new proposals (the schema file owns only the CLAIM and reaper statements plus the table, policy, and view).

## Secret sweep and self-review

Secret sweep: this file carries zero secrets by construction (no tokens, keys, bearer values, or credential-shaped assignments; secret names appear only as pattern references). The node report quotes the secret-pattern grep output and exit code.

Spec self-review (author pass, 2026-10-17): POST covers secret-scan plus required-field check plus 11-column INSERT; CLAIM quotes the exact atomic UPDATE plus row-count 1/0 protocol plus re-read plus 10-minute lease plus reaper statement plus invocation point; ACK states `acked_at = now()` plus the only-by-claimer-or-recipient rule; READ covers poll SELECT newest-first plus Realtime channel/filter shape, both marked static with no connection; race procedure covers two racers, same unclaimed id, simultaneous claims, exactly-one-winner assert, loser re-read plus back-off, and a LIVE runbook marked NOT-RUN; skill discipline carries the scope-first line, zero-MCP-calls reason, and unknowns; RLS-identity UNKNOWN is carried, not resolved; English only; sole artifact is this file.
