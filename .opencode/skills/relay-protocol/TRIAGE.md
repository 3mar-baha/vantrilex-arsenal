# Triage

Routing a claimed row to the right chat. Routine traffic stays in the main chat; anything time-sensitive, dangerous, or approval-shaped goes to the alerts chat.

## Routing matrix

| Condition | Destination | Mechanism |
|---|---|---|
| Routine update (received X, answered Y) | Main chat | Poll worker report through default delivery |
| Deadline breached (watchdog) | Alerts chat | Watchdog delivery wired to the alerts chat |
| Dangerous content or approval needed, by worker judgment | Alerts chat | One-shot alert task targeting the alerts chat |
| `approval_request` | Alerts chat, always | One-shot alert task; never auto-approved |

## Routine path

Announcements, replies, questions, and heartbeats that validate cleanly are reported in the main chat as ordinary worker output: what arrived, what was answered, and the row ids on both sides. No alert task is created for routine traffic.

## Dedup

Message identity is the row `id`. The worker keeps the set of ids already handled in this session; a row whose id is already in the set is acknowledged and ignored, never acted on twice. Retried deliveries of the same id collapse to one handling, and the reply row is created once per origin id.

## Dead-letter rule

Each worker tracks a retry count and the last error per row id in local poller state, never in new columns: the live nine-column shape is frozen. A handling failure increments the count and records the error text. After N consecutive failures the row is moved to `invalid` and announced in the alerts chat with the id, the count, and the last error; N comes from the install-time config file. Success resets the count. The dead-letter move is terminal: neither side retries the row again.

## Session-scoped sequencing

Ordering and `thread_id` matching hold inside one open session only. A reply matches its origin by exact `thread_id` equality within the same session named on both bodies; a `thread_id` arriving under a different session id is treated as a new conversation, never as a cross-session answer. A reply seen before its origin waits one poll tick, then follows the timeout path. Session open and close are defined in `SESSIONS.md`.

## Bridge health

Formal heartbeats are the sole bridge-health source. The silent-bridge rule reads heartbeat rows only: no heartbeat and no handled rows for over 60 minutes inside an active session raises the silent-bridge alert. Raw traffic volume is never a health signal, and the absence of routine rows alone never raises anything.

## Timeout path

A row the watchdog finds still `pending` past `expected_reply_by` is announced in the alerts chat with its row id, its pre-margin estimate, and its deadline. The poll loop itself never alerts; only the watchdog speaks for lateness.

## Approval path

Every `approval_request` goes to the alerts chat with the proposal, the risk, and the needed-by time stated in full. Approval is granted by the owner only. No worker, script, or schedule approves on the owner behalf under any condition.

## Alert task shape

The one-shot alert task carries an id of the form `relay-alert-<epoch>-<hex>` (epoch seconds plus random lowercase hex), runs once about a minute after creation, and delivers to the alerts-chat id read from the install-time config file. Its body is the alert text composed in full with an instruction to deliver it verbatim. It cleans itself up after delivery.

## Token budgets

Budgets bind each side separately: opencode and vanbu each stay inside every cap below. A tick that would exceed its cap sheds work to the next tick instead of overspending.

- Silent poll tick: at most 500 tokens (one minimal query plus the watermark compare, no agent wake).
- Wake handling: at most 4000 tokens per claimed row (claim, validate, triage, reply).
- Watchdog tick: at most 500 tokens; one timeout alert: at most 1000 tokens.
- Heartbeat row, all-in: at most 1000 tokens.
