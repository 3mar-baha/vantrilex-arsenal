-- COMMS-SUPABASE-SCHEMA.sql
-- Lane: VTA-COMMS-SUPABASE-01, node d-schema (wave 0; DESIGN-ONLY).
-- Status: APPLIED LIVE 2026-10-17 (table + RLS-enable + view + GUC policy messages_project_isolation; bite-probe match 2 / mismatch 0 / unset 0).
-- No live execution was performed to produce this file; liveness is not claimed.
-- Order of sections below follows the brief: (1) messages table,
-- (2) RLS + one project policy, (3) atomic claim, (4) lease + reaper,
-- (5) status view with pills.

-- (1) messages table -------------------------------------------------------
-- NOTE: gen_random_uuid() requires pgcrypto (or Postgres 13+ built-in).
-- No live extension check ran on this node (owner OAuth pending); confirm
-- extension availability before apply. Marked unverified.
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent text NOT NULL,
  to_agents text[] NOT NULL,
  project text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  needs_user_action boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_by text,
  claimed_at timestamptz,
  acked_at timestamptz
);

-- (2) Row Level Security + one project policy --------------------------------
-- Identity mapping (decided, owner-ordered p-policy2 wave 5 retry, LIVE
-- 2026-10-17; JWT abandoned as unobservable): project identity arrives via
-- the session/transaction GUC 'app.project', set per session/transaction by
-- the skill before any access. Fail-closed: current_setting('app.project',
-- true) yields NULL when unset, and NULL = project is not-true, so the row
-- is denied for RLS-enforced roles. Service connection
-- (postgres/service_role) bypasses RLS; enforcement binds only
-- RLS-enforced roles (anon/authenticated). Live policy (applied 2026-10-17
-- via apply_migration p-policy2_drop_isolation + p-policy2_create_isolation):
-- messages_project_isolation.
-- Intent: a row is visible / writable only when its project matches the
-- caller's project identity.
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS messages_project_isolation ON public.messages;
CREATE POLICY messages_project_isolation
  ON public.messages
  FOR ALL
  USING (current_setting('app.project', true) = project)
  WITH CHECK (current_setting('app.project', true) = project);

-- (3) Atomic claim (single-winner) -------------------------------------------
-- Single-winner semantics proof: the predicate "claimed_by IS NULL" means at
-- most one row version can transition from unclaimed to claimed. Two racers
-- issuing the same UPDATE for the same id serialize in Postgres; the first
-- to commit sets claimed_by, so the second's predicate no longer matches and
-- it updates ZERO rows. Caller protocol: row count = 1 means this caller won
-- the claim; row count = 0 means another caller won (or the id is UNKNOWN).
-- $1 = claimer identity (text), $2 = message id (uuid).
UPDATE messages SET claimed_by = $1, claimed_at = now() WHERE id = $2 AND claimed_by IS NULL;

-- (4) 10-minute lease + reaper ------------------------------------------------
-- Lease rule: a claim older than 10 minutes that is still unacked is stale
-- and returns to pending. Predicate quoted from the brief verbatim.
-- Effect: reset claimed_by / claimed_at so the message becomes claimable again.
-- Ack path (setting acked_at) is owned elsewhere; this statement never sets it.
UPDATE messages SET claimed_by = NULL, claimed_at = NULL WHERE claimed_at < now() - interval '10 minutes' AND acked_at IS NULL;

-- (5) Status view with pills ---------------------------------------------------
-- Draft-proposed view name (brief names no view name; this name is a proposal,
-- not a fact): messages_status.
-- Pills: pending = unclaimed (claimed_by IS NULL); claimed = claimed but
-- unacked (claimed_by IS NOT NULL AND acked_at IS NULL); acked = acked_at
-- IS NOT NULL. Acked wins over claimed in the CASE so an acked row never
-- renders as claimed.
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
