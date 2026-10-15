# Send

Composing a row: required fields, the deadline formula, and the thread rule. Validate per `SECURITY.md` before creating.

## Required fields

Every created row sets all of the following; a missing field aborts the send.

- `id`: `RL-<unix_ts>` at send time. Uniqueness is writer-enforced: on a same-second collision with another writer, append a retry suffix and re-check before creating.
- `from`: the sender identity.
- `to`: the destination identity.
- `type`: one of the seven closed types, with the matching `MESSAGE-TYPES.md` body template filled in full.
- `status`: `pending` on every new row, no exceptions.
- `eta_minutes`: the sender estimate of this task in minutes, before the margin.
- `expected_reply_by`: now plus estimate times 1.10, computed once at send time.
- `thread_id`: the correlation token, per the thread rule below.

## Deadline formula

`expected_reply_by` equals now plus the per-task estimate multiplied by 1.10. The estimate is made per task at send time; there are no fixed sizes. `eta_minutes` stores the pre-margin estimate so the receiver can see the raw judgment behind the deadline.

## Thread rule

A new conversation sets `thread_id` to its own row id. A reply sets `thread_id` to the origin row id. A follow-up question on an open thread keeps the origin id; a genuinely new question starts a new id. The poller matches replies to origins by exact `thread_id` equality.

## Body discipline

The body follows the type template with every line filled and stays within 2000 characters. Over the cap, the sender shortens the body and retries; the payload is never moved into columns and never split into extra rows to dodge the cap.
