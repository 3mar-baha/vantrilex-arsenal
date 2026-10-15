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

## Timeout path

A row the watchdog finds still `pending` past `expected_reply_by` is announced in the alerts chat with its row id, its pre-margin estimate, and its deadline. The poll loop itself never alerts; only the watchdog speaks for lateness.

## Approval path

Every `approval_request` goes to the alerts chat with the proposal, the risk, and the needed-by time stated in full. Approval is granted by the owner only. No worker, script, or schedule approves on the owner behalf under any condition.

## Alert task shape

The one-shot alert task carries an id of the form `relay-alert-<unix_ts>`, runs once about a minute after creation, and delivers to the alerts-chat id read from the install-time config file. Its body is the alert text composed in full with an instruction to deliver it verbatim. It cleans itself up after delivery.
