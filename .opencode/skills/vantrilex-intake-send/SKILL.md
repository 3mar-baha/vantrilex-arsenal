---
name: vantrilex-intake-send
description: Use when a clean examined batch needs staging toward the admit node — stages scan-clean batches SEND-only into pending admission with sign-off gating, zero receive paths, and human sign-off before admission.
---

# Vantrilex Intake Send

## Purpose

Send is the intake send skill: it stages scan-clean examined batches
SEND-only into pending admission states, binds the SCAN-FIRST verdict
and examination records to the batch, and gates every forward move on
recorded human sign-off. Send writes staging records only; it never
receives content anywhere, and it never admits.

## When to Use

- When a scan-clean examined batch needs staging into intake staging or
  admit-ready staging.
- When a staging record needs the SCAN-FIRST verdict, examination
  notes, and sign-off state bound to the batch identifier.
- When a batch needs its human sign-off state confirmed before any
  forward move.
- When a quarantine return needs clean items held apart from flagged
  items without shared staging.

## Do NOT use

- To pull content or choose origins. Pulling belongs to the uploader
  agent and the fetch skill; send starts from examined batches already
  on disk.
- To scan or re-scan. The scan belongs to `P2-SCAN-FIRST.md`; send
  quotes recorded verdicts and never produces one.
- To classify or improve content. Classification belongs to triage;
  improvement waits for its own ordered step; send stages verdicts and
  records, never content rewrites.
- To admit content. Admission belongs to the admit node after the Omar
  review record; staging past pending is admission and is refused here.
- To receive content into the registry, the kit lock, any installed
  tree, or any origin. Intake direction is SEND-only with 0 receive paths,
  and send is the skill that holds that line at staging time.
- To advance a batch without its recorded clean SCAN-FIRST verdict, or
  past a missing required human sign-off.

## Inputs

- The batch identifier with its examination record from fetch or the
  side agents.
- The recorded SCAN-FIRST verdict for the batch identifier, quoted
  verbatim.
- The sign-off state for the batch: pending with review requested, or
  recorded, as the brief requires.
- The target staging state the brief names: intake staging pending or
  admit-ready pending, never the registry.

## Procedure

Run the steps in order for the single batch named in the brief.

### S.1 — Confirm the clean verdict

Confirm the recorded clean SCAN-FIRST verdict for this batch identifier
before staging anything. A batch without a clean verdict is not staged;
a batch with a hit follows the quarantine path and stages nothing else.

### S.2 — Confirm the sign-off state

Confirm the human sign-off state matches what the brief requires for
this staging move. When the brief requires a recorded Omar review and
none exists, hold the batch pending and stage nothing forward. Staging
never substitutes for sign-off.

### S.3 — Stage SEND-only into pending

Stage the batch SEND-only into the pending state the brief names, with
the examination record, the SCAN-FIRST verdict reference, and the
sign-off state bound to the batch identifier. Clean items from a batch
with hits are never co-staged with flagged items; flagged items stay
under their quarantine reference.

### S.4 — Close with the refusal line

Close the staging record with the refusal line quoted: no receive path
was used, and no admission occurred. The pending state waits for the
owner of the next step: the Omar review record for intake staging, or
the admit node for admit-ready staging.

## Outputs

- A staging record per batch: batch identifier, target pending state,
  bound verdict reference, bound examination reference, sign-off state,
  and the refusal line.
- A held-pending record for any batch stopped on verdict or sign-off,
  with the missing gate quoted.
- A quarantine separation record where a batch carried hits, naming the
  quarantine reference and the clean items held apart.
- Nothing else. Send stages pending records; it receives nothing and
  admits nothing.

## Failure Modes

- **No clean verdict is recorded for the batch.** Stage nothing and
  hold the batch pending; a verdict produced inside send is not a
  verdict.
- **Required human sign-off is missing.** Stage nothing forward and
  hold the batch pending review; sign-off is recorded by its owner, not
  asserted here.
- **A batch carries hits.** Stage nothing except the quarantine
  separation record; clean and flagged items never share a staging
  record.
- **A receive path is requested.** Refuse it, record the refusal with
  the request quoted, and escalate; intake stays SEND-only.
- **Admission is requested of send.** Refuse it; staging past pending
  is admission and belongs to the admit node after the Omar review
  record.
- **Caps drift is observed.** A second uploader, a second puller, or a
  fifth intake skill is reported as a defect with the count quoted; work
  on the affected batch stops until the count is restored.
