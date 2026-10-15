# Poll

Three exact queries, one claim protocol, one watermark, one backoff ladder. The cost guard closes the file and overrides everything below it on any conflict.

## Poll shapes

Two shapes are allowed, both quota-proof; the install-time config file pins which one each side uses, with the database id and the view URL where used.

- REST data-source query. The tick queries the data-source endpoint with a server-side `and` filter: `to` equals me AND `status` equals `pending`. Page size stays small (at most 25 rows), sorting and filtering run server-side, and the poll projects only the `id` and `status` properties on a tick. The full row (remaining properties plus body blocks) is fetched only on wake, for the woken ids only.
- Pinned view fetch. Where the install exposes a pre-filtered view URL for `to` equals me AND `status` equals `pending`, the tick fetches that URL instead of composing a query. The URL comes from config; it is never reconstructed by hand.

Inline SQL appears nowhere: routine polling never uses MCP SQL-mode tools, and no skill text, hook script, chat transcript, or row body carries a SQL string. A tick that cannot use its pinned shape fails closed and silent.

## Consumer query, vanbu side

Filter `to` equals `vanbu` and `status` equals `pending`, sorted by `created` ascending. One query per poll tick.

## Consumer query, opencode side

Filter `to` equals `opencode` and `status` equals `pending`, sorted by `created` ascending. One query per poll tick, on a 60-second cadence.

## Watchdog query

Filter `status` equals `pending` and `expected_reply_by` earlier than now, sorted by `expected_reply_by` ascending. One query every 60 seconds. The watchdog delivers to the alerts chat and never to the main chat.

## Claim protocol

1. The poller runs its consumer query and takes the oldest `pending` row.
2. The poller writes that row from `pending` to `acked` immediately, before reading the body further or acting.
3. The poller fetches the full row for the claimed id only, then validates, triages, and acts per `TRIAGE.md` and `SECURITY.md`.
4. On completion the poller creates the reply row with `thread_id` set to the origin id, then moves the origin row to its terminal state (`done`, `needs_omar`, or `invalid`).

## Watermark

The poll script keys its watermark on `last_edited_time` with the row id as tiebreak, holding the highest pair seen. Each tick drops rows at or below the watermark except through the backfill window: the trailing 10 minutes of `last_edited_time` are always re-compared, so late-indexed or edited rows still surface. Rows already seen are ignored; only unseen rows wake the agent, and the state advances past them after the wake. A tick with nothing new ends silently.

## Backoff

Quota-aware backoff overrides cadence on pressure. On HTTP 429 or an explicit usage-limit signal the poller runs the per-tick ladder inside the tick: 30 seconds, then 2 minutes, then 10 minutes, with jitter added to each step so the two sides do not march in lockstep. A `Retry-After` header is always honored exactly when present. HTTP 529 is treated exactly as 429. When the ladder is exhausted the tick fails loud with the degrade hint and stops: no persistent cadence state is kept, the next tick retries fresh from the first ladder step, and backoff never wakes the agent; it only delays ticks.

## Webhooks deferred

Push delivery over webhooks is DEFERRED, not rejected. Polling stays the only wake path until a public HTTPS endpoint exists that the Notion side can reach with a signed callback. Re-evaluation condition: a stable public HTTPS endpoint plus signature verification on every callback; until both hold, no webhook code ships and no poll cadence is weakened on the promise of push.

## Cost guard

Polling is script-level work, never agent work. The vanbu poll runs every 180 seconds (300 seconds in quiet mode); the script performs one bounded query and one state comparison per tick. The script wakes the agent ONLY on new rows, never on a poll tick. Total traffic stays near 0.02 requests per second against a limit near 3 per second. Silence is the expected steady state: a quiet tick costs one query and zero agent turns.

## Token budgets

Budgets bind each side separately: opencode and vanbu each stay inside every cap below. A tick that would exceed its cap sheds work to the next tick instead of overspending.

- Silent poll tick: at most 500 tokens (one minimal query plus the watermark compare, no agent wake).
- Wake handling: at most 4000 tokens per claimed row (claim, validate, triage, reply).
- Watchdog tick: at most 500 tokens; one timeout alert: at most 1000 tokens.
- Heartbeat row, all-in: at most 1000 tokens.
