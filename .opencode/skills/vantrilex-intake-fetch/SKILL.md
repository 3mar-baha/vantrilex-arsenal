---
name: vantrilex-intake-fetch
description: Use when an intake batch needs fetching from its approved origin — pulls the named batch and examines its provenance and integrity with an examination record before any scan or triage step.
---

# Vantrilex Intake Fetch

## Purpose

Fetch is the intake fetch skill: it pulls exactly the batch the brief
names from its approved origin, verifies the pull against the brief,
examines provenance and integrity from observed evidence, and records
the result so the SCAN-FIRST gate and triage have facts to work from.
Fetch moves content from origin to intake holding only, never toward
the registry or any installed tree.

## When to Use

- When an intake batch needs pulling from its approved origin.
- When a pulled batch needs a provenance and integrity examination
  recorded before scanning.
- When a later step needs the origin record and file list bound to the
  batch identifier.
- When a pull failure needs its verbatim error recorded with the batch
  stopped rather than substituted.

## Do NOT use

- To choose or substitute an origin. The brief names the origin; an
  unreachable origin is reported verbatim and the batch stops.
- To scan, classify, or quarantine. The scan belongs to
  `P2-SCAN-FIRST.md` and classification belongs to triage; fetch hands
  over examined items and stops.
- To improve, stage, or admit content. Improvement and staging belong to
  later steps; admission belongs to the admit node after the Omar review record (human sign-off).
- To invent an install command. Provenance is recorded as observed, or
  the item carries no command at all.
- To add a receive path into the registry, the kit lock, or any
  installed tree. Intake direction is SEND-only with 0 receive paths,
  and fetch enforces that boundary.
- To pull more than the brief names. Extra items are out of scope even
  when they sit beside the batch at the origin.

## Inputs

- The batch identifier and the approved origin as named in the brief.
- The expected file list or selection rule for the batch, when the
  brief states one.
- The intake holding location where pulled items land pending scan.
- The owner-stated intake notes for the batch, when any exist.

## Procedure

Run the steps in order for the single batch named in the brief.

### F.1 — Pull exactly the named batch

Pull exactly the batch the brief names from its approved origin into
intake holding. Record the origin, the batch identifier, and the full
pulled file list. When the origin is unreachable, record the verbatim
error and stop the batch; never select a substitute origin.

### F.2 — Verify the pull

Verify the pulled set against the brief: every expected item present,
no unexpected item silently accepted. List any missing item as missing
and any extra item as out of scope. Out-of-scope items do not advance
with the batch.

### F.3 — Examine provenance and integrity

Examine each pulled item from observed evidence: provenance as stated
at the origin, readable condition, and any integrity marker the origin
provides. Record what was seen per item. Anything that cannot be
examined is listed as unexamined and never advances as verified.

### F.4 — Bind the examination record

Bind the origin record, the verified file list, and the per-item
examination notes to the batch identifier in one fetch record, and hand
the batch toward the SCAN-FIRST gate. Fetch performs no scan, no
classification, and no staging; the record is the whole deliverable.

## Outputs

- A fetch record per batch: batch identifier, approved origin, pulled
  file list, verification outcome, and per-item examination notes.
- A missing and out-of-scope listing where the pull diverged from the
  brief, quoted rather than summarised.
- A verbatim error record for any unreachable origin, with the batch
  marked stopped.
- Nothing else. Fetch pulls and examines; it scans nothing, stages
  nothing, and admits nothing.

## Failure Modes

- **The origin is unreachable.** Record the verbatim error, mark the
  batch stopped, and escalate; a substitute origin is never selected
  here.
- **The pull diverges from the brief.** Missing items are listed as
  missing and extra items as out of scope; neither is silently folded
  into the batch.
- **An item cannot be examined.** List it as unexamined; it never
  advances as verified and never reaches triage as clean.
- **A scan, stage, or admit step is requested inside fetch.** Refuse it
  and hand off at the fetch record; each downstream step owns its own
  gate.
- **A receive path is requested.** Refuse it, record the refusal with
  the request quoted, and escalate; intake stays SEND-only.
- **Caps drift is observed.** A second uploader, a second puller, or a
  fifth intake skill is reported as a defect with the count quoted; work
  on the affected batch stops until the count is restored.
