# LD-11 Admission Record — commit-commands

## Status

- Slot: 0.9.11 formal admission wave.
- Guide: commit-commands (3 of 6).
- Decision: ACCEPTED — copied and polished inside the collection as a slot-authored admission record.
- Refusal ground: none (no refusal; grounds unregistered in sources, nothing invented).
- last_verified: 2026-10-29 (authorship review; deterministic gates pending implementer landing).

## Purpose

Record the exact command shape for scoped, atomic commits on this lane: what is staged, what the message says, and what is proven before and after.

## Scope

Covers staging exactly the directed paths, writing the exact directed message, and proving parent, count, and set. Out of scope: pushing, merging, tagging, and publishing.

## Procedure

1. Prove the base tip and the pre-commit status before staging anything.
2. Stage exactly the directed paths; confirm the staged set lists nothing else.
3. Commit with the exact directed message, character for character.
4. Prove post-commit: parent is exactly the base, count ahead is exactly one, name-only set is exactly the directed set.
5. Prove the primary branch and local main are byte-identical before and after.
6. Never push, merge, tag, or publish from this lane.

## Gates

- Pre-commit tip equals base.
- Staged set equals directed set, nothing more.
- Message equals directed message byte for byte.
- Post-commit count ahead equals one with exactly one parent.
- Zero pushes, merges, tags, or publishes.

## Security check

- Per-guide result: PASS as authored.
- Basis: command-shape prose only; the procedure forbids push and publish paths. Re-verification on landed bytes required.

## License check

- Per-guide result: PASS as authored.
- Basis: slot-authored prose; no third-party bytes reproduced; excluded-track and private-track paths NOT TRIGGERED.

## Decision ledger row

- Guide commit-commands: ACCEPTED, polished inside the collection, zero referential entries, security PASS, license PASS, tracks not triggered.
