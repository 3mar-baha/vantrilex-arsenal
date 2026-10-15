# Relay Schema

## Quota-proof polling rule

Routine polling NEVER uses MCP SQL-mode query tools. Every poll tick is a REST data-source query carrying a server-side filter (`to` equals me AND `status` equals `pending`), or a fetch of the pinned pre-filtered view URL where one is exposed. The poll target (the data-source id, and the view URL when used) is pinned in the install-time config file; no inline SQL appears anywhere: not in skill text, not in hook scripts, not in chat transcripts, not in row bodies. A tick that cannot build its pinned REST shape fails closed and stays silent instead of improvising a query path.

## Envelope version

Every row body opens with a `schema_version: 1` line above the type template. Readers accept envelopes carrying a newer version and ignore fields they do not know; writers preserve fields they do not know when updating a row. Version 1 is the only version any writer emits.

## Columns

The nine columns of the live `relay-queue` database, carried forward from the p3-r0 prefetch record and reconciled with DESIGN.md section 1. Where the two disagree, the live shape governs; each variance is noted below. The payload rule closes the file.

| Column | Notion type | Values and rules |
|---|---|---|
| `id` | title | `RL-<epoch>-<hex>` (epoch seconds plus random lowercase hex); unique per row by writer discipline, never assumed from the API |
| `from` | select | `opencode`, `vanbu`, `omar` |
| `to` | select | `opencode`, `vanbu`, `omar` |
| `type` | select | The seven message types in `MESSAGE-TYPES.md`, closed set |
| `status` | status (native Notion status type) | `pending`, `acked`, `done`, `needs_omar`, `invalid` |
| `eta_minutes` | number | Sender estimate of the task in minutes, before the margin, kept for transparency |
| `expected_reply_by` | date | Send-time value of now plus estimate times 1.10; the API stores the timestamp, never the formula |
| `thread_id` | rich_text | New rows carry their own id; replies carry the origin row id |
| `created` | created_time | System-set timestamp and tamper-proof sort key for polls |

## Counter reads

The nine columns above are frozen: no tenth column exists and none is added. Counters the loops need are read with graceful defaults when absent: a missing `retry_count` reads as `0` and a missing `last_error` reads as `null`, exactly as the hook envelope readers do. Absence is the normal case, never an error.

## Session fields

Session membership travels with the correlation fields, never in new columns: the body carries a `Session:` line naming the owning session, and `thread_id` keys request to reply correlation inside that session. The session lifecycle, keying detail, and the reaper live in `SESSIONS.md`. No tenth column exists and none is added.

## Lifecycle

A row moves `pending` to `acked` to a terminal state. The claim write (`pending` to `acked`) happens before any action on the row and is what grants ownership. Terminal states are `done` for completed work, `needs_omar` for the escalation sink, and `invalid` for rejected rows. The lifecycle is writer discipline: the API does not enforce the order, so any jump such as `pending` straight to `done` is a protocol violation and is reported.

## Payload rule

The payload lives in the page body blocks, never in the columns. Columns are the routing envelope only. Body text is capped at 2000 characters, enforced by the writer before create (truncate or reject); the API enforces no such cap. A body over the cap is rejected and the send is retried with a shorter body, never split across columns.

## Token budgets

Budgets bind each side separately: opencode and vanbu each stay inside every cap below. A tick that would exceed its cap sheds work to the next tick instead of overspending.

- Silent poll tick: at most 500 tokens (one minimal query plus the watermark compare, no agent wake).
- Wake handling: at most 4000 tokens per claimed row (claim, validate, triage, reply).
- Watchdog tick: at most 500 tokens; one timeout alert: at most 1000 tokens.
- Heartbeat row, all-in: at most 1000 tokens.

## Variances against DESIGN.md

- `status` is the native Notion status type in the live database; the DESIGN.md draft proposed a select. Readers filter by option name, never by status group, so a regrouping in Notion cannot break a poll.
- `from` admits `omar` in the live shape alongside `opencode` and `vanbu`; the DESIGN.md draft listed only the two agents. The live three-option set governs.

## Identifiers

The database id, the token, and the alerts-chat id come from the install-time config file only. They are never written into row content, skill text, chat transcripts, or the repo.
