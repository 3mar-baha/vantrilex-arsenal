# Seat-deny overlay rationale (RUN-090)

Date: 2026-11-05 (reconstructed for mission ARSENAL-AUDIT-EXEC-001, node `w1-plugin-stamp`).

## Why this file exists

The seat-deny overlay comment in `.opencode/plugin/arsenal.ts` (section "20b. Seat deny
overlay") previously cited `.opencode/audit/RUN-090-FIX/deny-cause.md`. That path does not
exist in this repository's history or working tree; the citation was broken. This note
replaces it with a real, version-controlled path and records the reconstruction source.

## Reconstruction source (git history)

Commands run (from the repository root):

- `git log -S 'deny-cause' --oneline`
  - `2a78995 docs(0.9.0): w7-close — record final 0.9.0 verdict (CLOSED with NC1 waived+carried)`
  - `a1542a0 fix(0.9.0): enforce seat denies and evidence receipts`
- `git log --all --oneline -- '*deny*'`
  - (no file named `*deny*` ever existed; the overlay's deny logic lives inside
    `.opencode/plugin/arsenal.ts`, introduced by `a1542a0`)
- `git blame -L 2585,2592 .opencode/plugin/arsenal.ts` attributes the overlay comment
  block to commit `a1542a0` (2026-10-26).
- `git rev-list --all --objects | grep deny-cause` returns no object: the cited file
  was never committed.

Conclusion: the original `.opencode/audit/RUN-090-FIX/deny-cause.md` was never created; the
rationale exists only in the overlay comment itself and in commit `a1542a0`.

## Rationale reconstructed (cause (a))

Every shipped seat (`.opencode/agents/*.md`) declares its rules under `permissions:`
(plural) as a list of `{ action, resource, effect }` entries. The host's permission engine
evaluates only the singular `permission:` map. Because each seat file also carries
`name:` / `temperature:` (and other agent-frontmatter fields), the plural `permissions:`
block is demoted to an agent "additional" option and forwarded to the provider instead of
being applied by the permission engine.

Rewriting all 26 seat files to the singular shape was outside that lane's fixed scope, so
the overlay reads the shipped plural shape itself and applies it at the one mutable surface
available to a plugin: `permission.hook("evaluate")`.

The overlay is deny-only: it never grants and never relaxes. It runs only for `allow` and
`ask` (an explicit configured deny is final and does not invoke the hook); it flips
`effect` to `deny` only when the seat's last matching rule is a deny, when the seat block
is malformed (fail-closed), or when a known seat file exists but cannot be read
(fail-closed); a seat with no block, an unknown agent, or no matching rule leaves the
host's effect untouched.

## NC1 carry-over

NC1 (deny-mechanism live proof) remains OPEN and was waived, not passed, per
`.opencode/audit/RUN-090/w7-close.md` (owner ruling 2026-10-26 18:19). This note does not
close NC1; it only repairs the broken citation.
