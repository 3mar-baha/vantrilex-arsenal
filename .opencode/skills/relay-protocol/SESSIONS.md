# Sessions

One session at a time carries the bridge. Rows name their session, replies correlate inside it, and an idle session is reaped by the watchdog.

## Lifecycle

A session moves `open` to `active` to `closed` to `archived`, in order, never backward and never skipping a step.

- `open`: created and announced, no traffic yet. Either side may open; the opener writes the session record.
- `active`: the first handled row lands. Normal polling, claiming, and heartbeats run here.
- `closed`: work stops. No new rows are claimed under a closed session; in-flight rows still finish and their replies still carry the session id.
- `archived`: terminal and read-only. A row naming an archived session is treated as a new conversation under a fresh session.

## Keys

Sessions are keyed by a session id written on the body `Session:` line; request to reply correlation inside the session stays on `thread_id` exactly as `RELAY-SCHEMA.md` defines. No new columns carry session state: the live nine-column shape is frozen. A row without a `Session:` line belongs to the currently active session; a row naming an unknown session is quarantined to `invalid` plus an alert.

## Registry lifecycle (`relay-sessions` database)

Session records in the `relay-sessions` Notion database move `open`
to `active` to `verifying` to `done`, in order, never backward and
never skipping a step. Three side paths leave the main line:
`needs_omar` for the escalation sink, `failed` for faults, and
`closed` for an explicit close. Records are never deleted. Every work
order becomes one session record keyed by its `thread_id`, which stays
constant across every receipt of that session.

## Ownership

| Action | Owner | Note |
|---|---|---|
| Open (create the record, `status` `open`) | vanbu | One record per work order; `thread_id` names the work order. |
| Advance (`active`, `verifying`, `done`, `needs_omar`, `failed`, `closed`) | vanbu | Only vanbu writes session state. |
| Terminal (read-only) | vanbu | A record in `done`, `failed`, or `closed` takes no further writes. |
| Read and name | opencode | Opencode reads the registry and names the session on every row it sends, but never writes session state. |

Proof exception: the single test session `r03-sessions-proof-001`
(owner `opencode`) was opened and advanced with the shared proof token
by the `r03-sessions` node to demonstrate the lifecycle; it is labeled
test-only and the production ownership above still holds.

## Reaper

The stale-session reaper is DEFERRED, not rejected. No watchdog move runs: no automatic close, no notice row, and no session-record write ships in this version. Re-evaluation condition: an owner-held session registry both sides can read identically plus a tested reaper write path; until both hold, sessions advance only by explicit open and close records and no automatic reaping is promised.

## Registry writes

Vanbu owns session-registry writes: only vanbu creates, advances, or closes session records. Opencode reads the registry and names the session on every row it sends, but never writes session state. A session record the two sides cannot read identically is a fault: polling degrades to a silent tick until the registry agrees again.

## Heartbeats

The heartbeat shape lives in `MESSAGE-TYPES.md` and its cadence is about one row per 30 minutes in an active session. `TRIAGE.md` reads heartbeat rows as the sole bridge-health source; nothing here duplicates that rule.

## Token budgets

Budgets bind each side separately: opencode and vanbu each stay inside every cap below. A tick that would exceed its cap sheds work to the next tick instead of overspending.

- Silent poll tick: at most 500 tokens (one minimal query plus the watermark compare, no agent wake).
- Wake handling: at most 4000 tokens per claimed row (claim, validate, triage, reply).
- Watchdog tick: at most 500 tokens; one timeout alert: at most 1000 tokens.
- Heartbeat row, all-in: at most 1000 tokens.
