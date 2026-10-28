# Refresh Log

Periodic refresh log for the Zenith team records. Every session anchor
appends one entry; every guard run appends its task ids; the weekly T14
review writes one absorb-or-rule decision per item.

## R-001 — Seed (2026-10-28)

Register seeded from observed worktree state at base `c55bc7d`. Six fields
present. Seats A, B, and C landed with model plus variables each. Guard
skill and guard script landed; guard proven by the gate harness on a real
before and after, never a synthetic-only pair.

## R-002 — Weekly failure-absorption review (2026-10-28)

T14 written output. Items the records absorbed silently, with one decision
per item: becomes a rule, or stays absorbed.

| # | Absorbed item | Evidence | Decision |
| --- | --- | --- | --- |
| 1 | V3 slot text wins over any recalled V2 or memory slot number | Fallback FBLD-01 pattern, flagged never resolved | Stays absorbed; precedence already stated, no new rule |
| 2 | R2 9-id company-skill set carried verbatim, nothing installed | `.opencode/zenith/r2-overlap-carry.md`, fallback FBLD-02 | Becomes rule R-LEDGER-01: build nodes carry overlap verbatim and install nothing |
| 3 | Local `vs-*` skills ship without catalog rows | Precedent: zero `vs-` ids among 2889 catalog components at base | Becomes rule R-LEDGER-02: registration parked with owner, never written by build nodes |

Review rule from this week forward: no silent absorption without a dated
row in this table and a decision in the last column.
