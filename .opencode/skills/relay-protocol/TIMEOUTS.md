# Timeouts

Deadlines are per-task estimates with a margin. There are no fixed sizes: no short, medium, or long buckets anywhere in this protocol.

## Deadline rule

The sender estimates each task individually at send time and adds a 1.10 safety margin: `expected_reply_by` equals now plus the estimate times 1.10. The margin absorbs poll skew and minor overruns so the owner is never pinged over noise. `eta_minutes` records the pre-margin estimate for transparency.

## Escalation ladder

1. **Deadline expiry.** The watchdog announces the unanswered row id with its estimate and deadline in the alerts chat.
2. **Repeated stall.** Three watchdog announcements for one row with no progress escalates the wording: suggest the owner nudge the silent side and freeze reliance on the answer.
3. **Malformed row.** A validator failure routes to the alerts chat as possible tampering or a bug, never as routine traffic.
4. **`approval_request`.** Always to the alerts chat, no exceptions, no auto-approval.
5. **Dangerous wording.** Release, publish, tag-push, delete, force-push, or secret-like content inside a row not typed as approval is raised to the alerts chat by worker judgment.
6. **Silent bridge.** No rows and no heartbeats for over 60 minutes inside an active session raises a silent-bridge alert covering a possible fault on either side.

## Poll skew note

The 1.10 margin already absorbs the 3-minute poll skew for estimates around 30 minutes and above. Short-deadline alerts that cannot tolerate the skew should prefer the push path where available rather than a tighter global poll.
