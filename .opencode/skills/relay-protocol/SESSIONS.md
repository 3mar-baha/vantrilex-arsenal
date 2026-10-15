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

### Handover (v0.8)

Vanbu-owns-writes above is the NOW rule and stays in force until the v0.8
trigger lands. Trigger: the supreme endpoint is authorized and its
operator acknowledges the relay queue in writing. After the trigger, duties
split: Vantrilex opens session records and writes the open to active
advance; vanbu archives and closes (writes `closed` and the terminal
archive, and holds the read-only terminal). Until both halves of the
trigger hold, no handover write ships and the NOW rule governs every
session record.

## Reaper

The stale-session reaper SHIPS as the sibling script
`.opencode/hooks/relay/relay-reaper.mjs` on a 900-second cadence, and it is
terminal-only: session records move `open`/`active` to `closed` only, queue
rows move `pending` to `invalid` only, with 0 deletes, 0 reopens,
0 archives, and 0 non-terminal writes (the guard self-test in `--dry-run`
proves every forbidden edge refused before any request is built). In-flight
`acked` rows still finish under a closed session and are never marked;
rows already terminal are never rewritten; a pending row naming an archived
session is treated as a new conversation under a fresh session (no mark, no
alert). Session-record writes stay refused until the owner-held session
registry both sides can read identically exists with its lifecycle property
pinned (`RELAY_SESSION_REGISTRY_DATABASE_ID` plus
`RELAY_SESSION_STATE_PROPERTY`); until both hold, the live tick performs no
session-record write and says so loudly, while the row-level terminal
backstops still run. The reaper never writes the claim lease edge
(`acked` to `pending`): that re-queue lives in the poller alone.

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
