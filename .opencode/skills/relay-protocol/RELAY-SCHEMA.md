# Relay Schema

The nine columns of the live `relay-queue` database, carried forward from the p3-r0 prefetch record and reconciled with DESIGN.md section 1. Where the two disagree, the live shape governs; each variance is noted below. The payload rule closes the file.

## Columns

| Column | Notion type | Values and rules |
|---|---|---|
| `id` | title | `RL-<unix_ts>`; unique per row by writer discipline, never assumed from the API |
| `from` | select | `opencode`, `vanbu`, `omar` |
| `to` | select | `opencode`, `vanbu`, `omar` |
| `type` | select | The seven message types in `MESSAGE-TYPES.md`, closed set |
| `status` | status (native Notion status type) | `pending`, `acked`, `done`, `needs_omar`, `invalid` |
| `eta_minutes` | number | Sender estimate of the task in minutes, before the margin, kept for transparency |
| `expected_reply_by` | date | Send-time value of now plus estimate times 1.10; the API stores the timestamp, never the formula |
| `thread_id` | rich_text | New rows carry their own id; replies carry the origin row id |
| `created` | created_time | System-set timestamp and tamper-proof sort key for polls |

## Lifecycle

A row moves `pending` to `acked` to a terminal state. The claim write (`pending` to `acked`) happens before any action on the row and is what grants ownership. Terminal states are `done` for completed work, `needs_omar` for the escalation sink, and `invalid` for rejected rows. The lifecycle is writer discipline: the API does not enforce the order, so any jump such as `pending` straight to `done` is a protocol violation and is reported.

## Payload rule

The payload lives in the page body blocks, never in the columns. Columns are the routing envelope only. Body text is capped at 2000 characters, enforced by the writer before create (truncate or reject); the API enforces no such cap. A body over the cap is rejected and the send is retried with a shorter body, never split across columns.

## Variances against DESIGN.md

- `status` is the native Notion status type in the live database; the DESIGN.md draft proposed a select. Readers filter by option name, never by status group, so a regrouping in Notion cannot break a poll.
- `from` admits `omar` in the live shape alongside `opencode` and `vanbu`; the DESIGN.md draft listed only the two agents. The live three-option set governs.

## Identifiers

The database id, the token, and the alerts-chat id come from the install-time config file only. They are never written into row content, skill text, chat transcripts, or the repo.
