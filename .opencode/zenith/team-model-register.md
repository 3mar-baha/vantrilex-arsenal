# Team-Model Register

Zenith team-model register. Live board refreshed at every session anchor.
A register older than the current session anchor is stale, and a stale
register means the lead is blind: stop, refresh, then proceed.

- Anchor: seed-2026-10-28
- Refreshed: 2026-10-28
- Verification behind the dates: seeded from observed worktree state at the
  base commit `c55bc7d`, then re-proven by the simulation run of
  `scripts/verify-zenith-control.mjs`, which refreshes a copy at a real
  anchor procedure and shows all six fields updated.

## Refresh rule

Refresh triggers at the session-start anchor, the first anchor block of
every session. Procedure: reload all six fields below from live state, set
`Anchor` to the current anchor id, set `Refreshed` to today in
`YYYY-MM-DD` form, and append one line to
`.opencode/zenith/refresh-log.md`. The refresh is demonstrated, never
asserted: the gate harness runs the procedure on a copy and shows all six
fields updated.

## 1. Live directives

Directives in force as of this anchor.

- LD-02 Zenith control skills build on branch `wt/0.9.2-zenith-control`.
- V3 slot 0.9.2 treatment at
  `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3224`, carried as data.
- Fallback FBLD-02: carry both verbatim, install nothing, never resolved
  here. Registration parked with the owner; zero registry, catalog, or
  lock writes by build nodes.

## 2. Live load

Load Zenith carries as of this anchor.

- Live load: wave 1 of 9, node b092-build, concern LD-02 single atomic commit.
- Open lanes: none observed beyond this build node; arbitration queue
  empty, so no contention is scheduled against this load.

## 3. Equipment baselines

Pinned observations, re-taken at every refresh.

- Runtime Node v25.0.0, standard library only, zero dependencies added.
- Gate binaries observed on this seat: `node --check`, `markdownlint-cli`
  0.50.0 via the local runner, `git`, and
  `scripts/verify-skills.mjs` with its `--root` flag for worktrees.
- Skill equipment: `vs-zn-team-control` plus `vs-zn-refresh-guard`, both
  read back from disk after landing, both format-gated.

## 4. Failure log

Every failure remembered, so no plan repeats one.

- No open failures at seed time. Simulated-anchor and guard runs are
  recorded in `.opencode/zenith/refresh-log.md` with their exact outcomes.
- Standing entry: a silent absorption stays open here until the weekly T14
  review writes its absorb-or-rule decision.

## 5. Arbitration queue

Pending contentions and their owners.

- Empty at seed time. New contention enters here with its owner and its
  trigger before any lead decision touches it.

## 6. Tier-granted inventory

Stock granted per tier, spent only by authority.

- Tier 0 baseline: local skills, local records, gate scripts. No installs
  performed, no install command shipped, no network fetch run by this
  node. Anything beyond Tier 0 needs a separate explicit owner sign-off
  naming the rows accepted with their evidence.
