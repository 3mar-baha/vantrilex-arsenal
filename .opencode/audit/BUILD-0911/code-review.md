# LD-11 Admission Record — code-review

## Status

- Slot: 0.9.11 formal admission wave.
- Guide: code-review (2 of 6).
- Decision: ACCEPTED — copied and polished inside the collection as a slot-authored admission record.
- Refusal ground: none (no refusal; grounds unregistered in sources, nothing invented).
- last_verified: 2026-10-29 (authorship review; deterministic gates pending implementer landing).

## Purpose

Record how review is done on this lane: what the reviewer checks, what evidence a finding needs, and how severity is kept calibrated so findings stay actionable.

## Scope

Covers diff review for one concern per branch: correctness, scope discipline, gate evidence, and honesty of claims. Out of scope: release approval and owner sign-off, which belong to the leader and the guide.

## Procedure

1. Read the full diff of the branch against its base before judging anything.
2. Check each hunk for scope escape: only the directed concern may appear.
3. Demand file and line evidence for every finding; a finding without evidence is not a finding.
4. Calibrate severity: blocker, major, minor — never upgraded by tone.
5. Verify gate outputs were re-run on the reviewed tree, not transcribed from elsewhere.
6. Return a verdict with an evidence ledger; the leader decides the outcome.

## Gates

- One concern per branch proven by the name-only diff.
- Every finding carries file and line evidence.
- Gate outputs quoted with exit codes on the reviewed tree.
- No invented procedure from an unregistered source.

## Security check

- Per-guide result: PASS as authored.
- Basis: review procedure text only; no exploit, no bypass, no credential handling. Re-verification on landed bytes required.

## License check

- Per-guide result: PASS as authored.
- Basis: slot-authored prose; no third-party bytes reproduced; excluded-track and private-track paths NOT TRIGGERED.

## Decision ledger row

- Guide code-review: ACCEPTED, polished inside the collection, zero referential entries, security PASS, license PASS, tracks not triggered.
