# LD-16 shadow-run, parity gate, sliced cutover, zero-consumer proof — 0.9.16

Seat: vantrilex-typescript · Lane: build-release (AUTO-0.9-FULL 0.9.16) · Node: b0916-build (wave 1 of 9) · Date (UTC): 2026-10-29

Doctrine: FULL.

This record carries procedures (3) shadow-run, (4) parity gate, (5) sliced
cutover, and (6) zero-consumer proof from the LD-16 treatment
(`AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4105-4191`, read-only).

## 3. Shadow-run procedure (receiving layer beside the base)

1. Name the receiving layer per migrating item from the inventory destination
   column (`.opencode/craft` for the five craft books plus doctrines,
   `.opencode/zenith` for the two zenith controls, the leader layer for the
   eight `vs-*` adapters).
2. Run the receiving layer beside the base: every task the base performs is
   also performed by the receiver on the same inputs, and both outputs are
   kept. The base keeps serving; the receiver shadows without replacing it.
3. Log both outputs per task with the task id, the base output, and the
   receiver output. A task with no receiver output is a gap, never a pass.
4. The shadow ends only at the parity gate below. No cutover starts from a
   shadow log alone.

## 4. Parity gate (measured task-by-task on the eval umbrella)

1. The measuring instrument is the eval umbrella (the 0.9.5 eval harness:
   per-kind trial packs for skills, agents, and units with pinned-version
   scores, blind-spot-aware evaluators, the comparative-probe appendix, and
   the HAL template with mandatory log inspection). Parity is measured on
   that umbrella, task-by-task, never on prose.
2. Each migrating item's functional tasks (the funct counts in the
   inventory) each get a pass/fail against the base on the same trial pack.
   The gate table renders one row per task: base score, receiver score,
   verdict. A skill with nine tasks at parity and one below stays failing in
   that one: no single-task shortfall is waived.
3. Parity bar: parity-or-better per task — the receiver meets or beats the
   base on every task. Better on nine and worse on one is FAIL.
4. Exit mapping: this gate covers V3:4184 (`parity-or-better per task`) and
   feeds the ledger's measured-gates table.

## 5. Sliced cutover (every slice rollbackable)

DECIDED: slice boundaries — evidence: the inventory destination column groups
items by receiving layer with no cross-layer consumers inside a group (craft
consumers stay inside `.opencode/craft`; zenith consumers stay inside
`.opencode/zenith`; adapters reference only their base skill plus audit
records), so each group cuts over without dragging the others. Three slices:

- Slice Z (zenith pair: `vs-zn-team-control`, `vs-zn-refresh-guard`):
  point receivers at live traffic after parity; rollback: revert the one
  slice commit, traffic falls back to the base pair, which was never stopped.
- Slice C (craft five: `vs-at-plan-craft`, `vs-bl-build-craft`,
  `vs-pu-probe-craft`, `vs-book-doctrine`, `vs-golden-equipment`):
  same rule; rollback: revert the one slice commit, base books resume.
- Slice S (shared adapters, eight `vs-*`): one adapter per sub-step in
  consumer-count order (lowest first), each sub-step gated on its own parity
  row; rollback: revert that sub-step only, the other adapters keep shadowing.

Rules: one slice at a time; the next slice starts only after the previous
slice's parity rows stay green for one full eval-umbrella run; every slice
lands as its own revertable commit so rollback is `git revert`, never
reconstruction.

## 6. Zero-consumer proof (kit-lock standard reused)

1. Before any shutdown, prove zero consumers by the kit-lock standard reused
   from the lock discipline: the hash-pinned `skills-lock.json` proves which
   pairs the kit guarantees, and the selection record suspends (never drops)
   unproven rows — verified-only rows ship, the rest are candidates. The same
   standard applies here: a base item shuts down only when the live count is
   zero and the selection record shows it suspended.
2. The count is the inventory rule recomputed at shutdown time
   (`git grep -l` outside the item's own folder, migration record excluded):
   zero hits means zero consumers. A disputed zero is re-counted, never
   waived; the shutdown is refused without this proof however abandoned the
   item looks.
3. Exit mapping: this procedure covers V3:4185 first half (zero-consumer
   proof before any shutdown).
