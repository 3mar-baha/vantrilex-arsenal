# LD-14 background task-layer spec — queue, scheduling, triggers, supervision

Seat: vantrilex-typescript (worker seat) · Lane: AUTO-0.9-FULL 0.9.14 · Node: b0914-build (wave 2 of 10) · Date (UTC): 2026-10-29

Concern: land the LD-14 background task layer carried from V3:3957-4031, never re-derived.

Doctrine: FULL (core ponytail posture with FLOOR and CEILING as quoted in the ledger).

Sources carried as data (read-only, never re-derived):

- LD-14: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3957-4031` (slot scope, how steps 1-10 at :3983-3992, exit criteria at :4024-4025, open questions at :4028-4029).
- FBLD-14: `FBLD-14 — Slot 0.9.14 — Conflict: V3 slot scope versus R4 device-scope pressure with zero on-disk combined record — Fallback: keep device UNVERIFIED, never widened by inference — Matches LD-14 — Status FLAGGED, never resolved.`
- V3 exit criteria: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4024-4025` (scheduled task survives a server restart via external relaunch without state loss; every absorbed failure in the ledger; background memory writes pass the umbrella recall gate in practice).
- Open questions: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4028-4029` (queue-persistence format; supervision alert thresholds).
- Locked reference: `.opencode/audit/BUILD-0913/verdict-0.9.13.md` (0.9.13 lock, read-only context).
- Kit pattern: `.opencode/plugin/arsenal.ts` read before editing (zero dependencies, mirrored V2 plugin surface, narrowed event types, guards that degrade to SKIPPED).

## 1. Layer shape (the honest platform picture, carried as data)

The platform offers native background work, but no durable scheduler and no
durable tasks that survive a restart. In-addon timers die with the process
and live event subscriptions stay live only, with no replay. There is no
native durable scheduler on the live surface, so none is invented here.

The adopted pattern, owned by the owner and cited by name, is service-mode
with an external scheduler that fires over the network interface. It is
adopted by name, never re-invented under a new name.

The task layer built here is queue plus scheduling plus triggers plus
supervision, above the native mechanisms, never instead of them.

## 2. The ten carried rules (LD-14 how 1-10, carried as data)

1. A task queue stands above the native background agents; every item is
   recorded with its state and its owner.
2. The owner structure is adopted: service-mode with an external scheduler
   firing over the network interface, never re-invented.
3. A scheduled task survives a server restart: the external scheduler
   re-fires it and its state is not lost.
4. Triggers ride live events plus a ledger that compensates for the missing
   replay, so no event is lost silently.
5. Smooth self-healing applies: mechanical absorb, retry with the error as
   context, stability detection before declaring done.
6. Every absorbed failure is recorded in the ledger; healing is never
   invisible to the user and never invisible to the ledger.
7. Every memory write from a background agent passes the umbrella recall
   write gate; an unpassed write is rejected.
8. Supervision is exception-only; alert thresholds are shaped toward that
   acceptance form.
9. Resumptions bind to checkpoints; a background task resumes from a known
   point, never from a vague restart.
10. The sensing bundle for the scouting track, if accepted as ruled, is
    served from this slot for the scouting track.

## 3. Queue and persistence

- Queue entry: `{ id, owner, state, schedule, checkpoint, attempts }`.
- Every entry carries its state and its owner (rule 1); every resumption
  names its checkpoint (rule 9).
- Persistence format (open question 1, answered as data): canonical JSON
  envelope `{ format: "ld14-queue-v1", tasks: [...] }`, embodied by
  `persistQueue` / `loadQueue` in `task-probe.mjs`. Malformed envelopes and
  malformed entries are rejected at the trust boundary with an error, never
  coerced.
- Restart proof (rule 3): the live object is dropped, the envelope plus the
  external scheduler survive, and `externalRelaunch` resumes from the
  recorded checkpoint with the state intact. The probe case
  `LD14-SCHEDULED-RESTART` proves this in practice.

## 4. Triggers and supervision

- Triggers ride live events; because live subscriptions die with the
  process, every trigger carries a ledger entry that compensates the restart
  gap (rule 4). The probe case `LD14-TRIGGER-LEDGER` proves no event is lost
  silently.
- Supervision is exception-only (rule 8): silence until a threshold trips.
  Thresholds (open question 2, answered as data): `MAX_RETRIES = 3`,
  `ALERT_AFTER_CONSECUTIVE_FAILURES = 3`, embodied by `supervise` in
  `task-probe.mjs`. One transient failure stays silent; three consecutive
  failures alert. The probe case `LD14-SUPERVISION-EXCEPTION-ONLY` proves
  this in practice.
- Healing (rule 5) is mechanical absorb plus retry with the error as context
  plus a stability confirmation run before declaring done, embodied by
  `runWithSelfHealing`. Every absorbed failure lands in the ledger (rule 6);
  the probe case `LD14-ABSORBED-FAILURES` proves all absorbed failures are
  in the ledger.
- Device scope: `UNVERIFIED`. With zero on-disk combined record, the device
  is kept UNVERIFIED, never widened by inference (FBLD-14). The probe
  carries `DEVICE_STATUS = "UNVERIFIED"` and asserts it.

## 5. Recall-write gate

- Background memory writes graduate only via the umbrella recall gate
  (rule 7). The gate is embodied by `recallWriteGate` in `task-probe.mjs`:
  a background write with `viaUmbrella: true` and non-empty text is
  accepted; an unpassed write is rejected with a reason, never stored.
- The probe case `LD14-RECALL-WRITE-GATE` proves the gate passes in
  practice: gated accepted, ungated rejected.

## 6. Exit criteria covered (V3:4024-4025)

- A scheduled task survives a server restart via external relaunch without
  state loss (probe `LD14-SCHEDULED-RESTART: SURVIVES`).
- Every absorbed failure is in the ledger (probe `LD14-ABSORBED-FAILURES:
  ALL 2 IN LEDGER`).
- Background memory writes pass the umbrella recall gate in practice (probe
  `LD14-RECALL-WRITE-GATE: PASS`).

## 7. Components (honest install surface)

- `task-layer` (this spec): `install_cmd: null`, `verification: unverified`.
  The layer is a task-layer record above native mechanisms plus the adopted
  owner pattern; it installs nothing by itself.
- `external-scheduler` (owner pattern, cited by name): `install_cmd: null`,
  `verification: unverified`. The external scheduler is the owner's
  structure, adopted by name and never re-invented; no command is invented
  for it here.
- `task-probe.mjs` (verification probe): `install_cmd: null`,
  `verification: unverified`. The probe runs on the Node standard library
  only and installs nothing.

Zero invented install commands in this spec: the only install surface is
`install_cmd: null` with `verification: unverified` per component above.
