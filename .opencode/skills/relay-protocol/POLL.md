# Poll

Three exact queries, one claim protocol, one watermark. The cost guard closes the file and overrides everything below it on any conflict.

## Consumer query, vanbu side

Filter `to` equals `vanbu` and `status` equals `pending`, sorted by `created` ascending. One query per poll tick.

## Consumer query, opencode side

Filter `to` equals `opencode` and `status` equals `pending`, sorted by `created` ascending. One query per poll tick, on a 60-second cadence.

## Watchdog query

Filter `status` equals `pending` and `expected_reply_by` earlier than now, sorted by `expected_reply_by` ascending. One query every 60 seconds. The watchdog delivers to the alerts chat and never to the main chat.

## Claim protocol

1. The poller runs its consumer query and takes the oldest `pending` row.
2. The poller writes that row from `pending` to `acked` immediately, before reading the body further or acting.
3. The poller validates, triages, and acts per `TRIAGE.md` and `SECURITY.md`.
4. On completion the poller creates the reply row with `thread_id` set to the origin id, then moves the origin row to its terminal state (`done`, `needs_omar`, or `invalid`).

## Watermark

The poll script keeps local state holding the last seen timestamp and the last row id. Each tick compares fresh query results against that state. Rows already seen are ignored; only unseen rows wake the agent, and the state advances past them after the wake. A tick with nothing new ends silently.

## Cost guard

Polling is script-level work, never agent work. The vanbu poll runs every 180 seconds (300 seconds in quiet mode); the script performs one bounded query and one state comparison per tick. The script wakes the agent ONLY on new rows, never on a poll tick. Total traffic stays near 0.02 requests per second against a limit near 3 per second. Silence is the expected steady state: a quiet tick costs one query and zero agent turns.
