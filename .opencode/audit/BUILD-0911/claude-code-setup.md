# LD-11 Admission Record — claude-code-setup

## Status

- Slot: 0.9.11 formal admission wave.
- Guide: claude-code-setup (1 of 6).
- Decision: ACCEPTED — copied and polished inside the collection as a slot-authored admission record.
- Refusal ground: none (no refusal; grounds unregistered in sources, nothing invented).
- last_verified: 2026-10-29 (authorship review; deterministic gates pending implementer landing).

## Purpose

Record the supported setup path for working with the coding assistant inside this repository: what is prepared, in what order, and how readiness is proven before any build step runs.

## Scope

Covers local machine readiness, repository checkout state, seat identity, and the smoke check that proves the seat can read, plan, and report without mutating. Out of scope: model selection, managed installs, and any hosted service configuration.

## Procedure

1. Confirm the repository root and the active branch name before doing anything else.
2. Confirm the seat file and the lane ledger for this node are readable from disk.
3. Confirm the working tree is clean enough for the task or record the exact dirt set.
4. Run the read-only proofs first: branch tip, current branch name, and status.
5. Run the version smoke: runtime version and the catalog verifier in check mode.
6. Record every command with its exit code before claiming anything is ready.

## Gates

- Branch tip equals the base proven live, never assumed.
- Current branch is the directed branch for write work; the primary branch never moves.
- Runtime version prints without error.
- Catalog verifier exits zero where it covers the touched paths.
- Any gate that cannot run is recorded as failed, never skipped.

## Security check

- Per-guide result: PASS as authored.
- Basis: this record carries no credentials, no tokens, no secrets, and no network calls. Nothing in it grants access or widens scope. Re-verification on landed bytes by the implementer is still required.

## License check

- Per-guide result: PASS as authored.
- Basis: slot-authored prose for this slot; no third-party bytes reproduced, so no redistribution bar is triggered. Excluded-track and private-track paths: NOT TRIGGERED.

## Decision ledger row

- Guide claude-code-setup: ACCEPTED, polished inside the collection, zero referential entries, security PASS, license PASS, tracks not triggered.
