# P2 SCAN-FIRST Procedure

The auto-evaluator runs SECURITY SCAN FIRST on every Crucible intake
batch. No batch is classified, improved, or staged before its scan
verdict is recorded. A scan hit routes to quarantine; only a recorded
clean verdict releases the batch to classify, improve, and stage steps
in that order.

## Gate order

The order below is fixed for every batch, and every step quotes the
batch identifier it acted on:

1. Pull and examine (uploader agent, fetch skill).
2. SECURITY SCAN FIRST (this procedure) with the verdict recorded.
3. Classify and route (triage skill) for clean batches only.
4. Improve (ordered step, clean batches only, never inside triage).
5. Stage SEND-only into pending (send skill, side agents).
6. Recorded human sign-off (Omar review record) before any admit step.
7. Admit node owns admission; no intake role admits.

Steps 3 through 5 never run before step 2 records its verdict for the
same batch identifier. A step that ran early is discarded and rerun in
order.

## What the scan covers

The scan examines every item in the batch for secrets and personally
identifying information before anything else. Secret patterns include
credential assignments, API key and token assignments, private key
material, connection strings carrying credentials, and any other value
shaped as an authentication secret. Personally identifying information
includes names paired with contact or identity details, government
identifiers, financial account details, biometric data, and any other
data that identifies a person alone or in combination. Patterns are
matched by shape and context, never by guessing at intent, and the scan
reports what matched with the item and line quoted.

## Quarantine path

A batch with at least one scan hit takes the quarantine path, without
variation:

1. Isolate every flagged item under a quarantine reference bound to the
   batch identifier. Flagged items leave intake holding and enter
   quarantine holding; they are never co-staged with clean items.
2. Write the per-batch quarantine log in the shape below. One log per
   batch with hits; batches without hits write no quarantine log.
3. Stage nothing else from a hit batch. Clean items from a hit batch
   wait under a held-pending record until the quarantine disposition
   resolves; they never advance on the batch's original momentum.
4. Return the batch identifier with the quarantine reference to the
   dispatcher. Quarantine is a routing outcome: no repair, no redaction,
   and no rewording happens on the intake side. Disposition of
   quarantined items belongs to the reviewer with the finding quoted.

## Quarantine-log shape per batch

Every per-batch quarantine log carries exactly these fields, in this
order, with values quoted from the scan run:

```text
QUARANTINE LOG
Batch       : <batch identifier the scan ran on>
Time        : <UTC timestamp YYYY-MM-DDTHH:MM:SSZ of the scan run>
Scanner     : <scan procedure name and version as run>
Verdict     : HIT
Findings    : <count of flagged items>
Items       : <one row per flagged item: item path, line, pattern name>
Quarantine  : <quarantine reference holding the isolated items>
Clean held  : <count of clean items held pending, or 0>
Reviewer    : <pending until the Omar review record names its signer>
Sign-off    : <pending until recorded; never assumed>
```

A quarantine log with a missing field is incomplete and is rewritten,
not waived. The sign-off field turns from pending to recorded only by
the reviewer named in the Omar review record, never by an intake role.

## Caps enforced in this procedure

- Uploader count equals 1
  (`.opencode/agents/vantrilex-uploader.md`).
- Puller count equals 1 (`.opencode/agents/vantrilex-puller.md`).
- Intake skill count is between 1 and 4 inclusive.
- Intake direction is SEND-only with 0 receive paths: no path in any
  intake definition receives content into the registry, the kit lock,
  any installed tree, or any origin.
- No admission without recorded human sign-off: the Omar review record
  precedes every admit step, and staging into pending is never treated
  as admission.

A second uploader, a second puller, a fifth intake skill, any receive
path, or any admission without the Omar review record is a defect:
quoting the count or the path, stopping the affected batch, and
escalating with evidence.

## Failure modes

- **A batch classifies, improves, or stages before its scan verdict is
  recorded.** Discard the early work, run the scan, record the verdict,
  and rerun the batch in gate order.
- **A flagged item advances as clean.** Return the batch to quarantine
  with the finding reference quoted and hold all clean items pending
  until disposition resolves.
- **A scan verdict is disputed.** Escalate with the batch identifier,
  the verbatim verdict, and the disputing evidence; the verdict is never
  rescored on the intake side.
- **Quarantine holding is unavailable.** Stop the batch, record the
  reason verbatim, and escalate; flagged items are never left in intake
  holding as clean by default.
- **A receive path or an admission without sign-off is requested.**
  Refuse it, record the refusal with the request quoted, and escalate;
  intake stays SEND-only and sign-off stays mandatory.
