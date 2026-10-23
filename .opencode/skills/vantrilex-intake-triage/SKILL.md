---
name: vantrilex-intake-triage
description: Use when an intake batch needs classifying and routing before any improve or stage step — routes each Crucible batch through scan-first triage, quarantine decisions, and handoff.
---

# Vantrilex Intake Triage

## Purpose

Triage is the intake handling skill: it takes one pulled batch, invokes
the SCAN-FIRST gate first, classifies each item from observed evidence,
routes hits to quarantine, and hands only clean items toward improve or
stage steps. Nothing is classified, improved, or staged before the scan
verdict is recorded for the batch.

## When to Use

- When a freshly pulled intake batch needs its first disposition.
- When a batch needs classifying into clean, quarantined, or rejected
  from observed evidence.
- When a batch needs routing to the quarantine path with a per-batch
  quarantine log.
- When a later step needs the recorded SCAN-FIRST verdict before it may
  proceed.

## Do NOT use

- To pull content from an origin. Pulling belongs to the uploader agent
  and the fetch skill; triage starts from pulled items already on disk.
- To improve item content. Improvement waits for a clean scan verdict
  and a separate step; triage classifies and routes, never rewrites.
- To stage or admit content. Staging belongs to the send skill and the
  side agents; admission belongs to the admit node after the Omar review
  record.
- To overturn a scan hit by rewording it. A disputed verdict escalates
  with evidence; it is never rescored here.
- To add a receive path into the registry, the kit lock, or any
  installed tree. Intake direction is SEND-only with 0 receive paths,
  and triage enforces that boundary.
- To bypass human sign-off. Triage hands forward pending items only;
  the Omar review record precedes any admit step.

## Inputs

- The batch identifier and the pulled file list with origins as
  observed.
- The uploader examination record for the batch, when one exists.
- The `P2-SCAN-FIRST.md` procedure as the governing scan authority.
- The brief's routing expectations: which downstream step owns clean
  items and where quarantine records land.

## Procedure

Run the steps in order for the single batch named in the brief.

### T.1 — Confirm the batch

Confirm the batch identifier, list every item in the batch, and record
any item that cannot be read as unreadable. Unreadable items are routed
as unexamined and never advance as clean.

### T.2 — Invoke SCAN-FIRST

Run the `P2-SCAN-FIRST.md` procedure over the whole batch before any
classify, improve, or stage step. Record the verdict verbatim against
the batch identifier: clean with its totals, or hit with the flagged
items named. A batch without a recorded verdict does not proceed.

### T.3 — Classify from evidence

Classify each item from observed evidence only: clean items carry the
scan-clean reference; flagged items carry their finding reference;
rejected items carry the reason quoted (unreadable, out of scope, or
provenance missing). No item carries two dispositions.

### T.4 — Route hits to quarantine

Route every flagged item through the quarantine path in
`P2-SCAN-FIRST.md` and write the per-batch quarantine log in the shape
that procedure defines. Quarantined items never share a staging record
with clean items from the same batch.

### T.5 — Hand off clean items only

Hand only clean items with the recorded clean verdict toward the improve
or stage step the brief names, bound to the batch identifier. The
handoff states the caps in force: exactly 1 uploader, exactly 1 puller,
1 to 4 intake skills, SEND-only with 0 receive paths, and no admission
without recorded human sign-off.

## Outputs

- A triage record per batch: batch identifier, item dispositions with
  evidence, and the SCAN-FIRST verdict quoted verbatim.
- A per-batch quarantine log for every batch with at least one hit, in
  the `P2-SCAN-FIRST.md` shape.
- A clean handoff listing only the items cleared to proceed, with the
  verdict reference bound to each item.
- Nothing else. Triage writes records and routes; it stages nothing and
  admits nothing.

## Failure Modes

- **A step classifies before the scan verdict is recorded.** Stop the
  batch, run the scan, and record the verdict; any disposition written
  before it is discarded.
- **A flagged item advances as clean.** Return the batch to quarantine
  with the finding reference quoted, and route it again from T.4.
- **A scan verdict is disputed.** Escalate with the batch identifier,
  the verbatim verdict, and the disputing evidence; never rescore the
  verdict in triage.
- **A receive path is requested.** Refuse it, record the refusal with
  the request quoted, and escalate; intake stays SEND-only.
- **Admission is requested without the Omar review record.** Refuse it
  and hold the batch pending; staging forward is not admission, and
  triage never performs it.
- **Caps drift is observed.** A second uploader, a second puller, or a
  fifth intake skill is reported as a defect with the count quoted; work
  on the affected batch stops until the count is restored.
