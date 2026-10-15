# Message Types

Seven closed types. Every row carries exactly one. Each type below states its purpose and its page-body template; the sender fills every template line and leaves no line empty or marked unknown.

## announce

An achievement announcement, usually from opencode. Carries hashes and gate results as in the current manual announcements.

```text
Summary: <one line stating what completed>
Hashes: <commit or artifact hashes>
Gates: <verification results with commands and exit codes>
Thread: <thread_id>
```

## verify_request

A request for the other side to verify a claim or an artifact.

```text
Claim: <what needs verification>
Evidence: <hashes, paths, or commands to reproduce>
Expected: <the result that counts as verified>
Thread: <thread_id>
```

## reply

A response to an existing row. Carries the origin row id as its `thread_id`.

```text
Answers: <the answer or result, in full>
Row: <origin row id>
Thread: <origin row id>
```

## question

A question that needs the other side to answer. Opens a new thread unless it continues one.

```text
Question: <the exact question>
Context: <why it is asked and what blocks on it>
Thread: <own id for a new thread, origin id for a follow-up>
```

## approval_request

A request for owner approval. Always routes to the alerts chat; there is no automatic approval path.

```text
Proposal: <what is proposed, exactly>
Risk: <what could go wrong>
Needed by: <date and time>
Thread: <thread_id>
```

## alert

A proactive warning, such as a gate failing twice or a suspicious row.

```text
Signal: <what happened>
Row: <affected row id, or none>
Suggested action: <what the other side should do>
Thread: <thread_id>
```

## heartbeat

An optional proof that the bridge is alive, sent on long sessions about every 30 minutes.

```text
Sender: <opencode or vanbu>
Uptime note: <one line on session state>
Thread: <own id>
```
