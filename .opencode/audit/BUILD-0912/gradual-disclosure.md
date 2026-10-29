# LD-12 gradual tool disclosure and code-pattern composition — kit-side spec

Lane: build-release (AUTO-0.9-FULL 0.9.12) · Node: b0912-build · Owner: vantrilex-typescript
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3805-3878` (slot 0.9.12, carried as data — implemented, never re-derived)
Proof: `.opencode/audit/BUILD-0912/disclosure-probe.mjs` (self-test, same commit)

## 1. Code-pattern governance (platform side, governed here)

The three-set model is the whole policy language. Every server sits in
exactly one set; no fourth set exists and no per-agent tool group is assumed
(the platform has no per-agent tool-group mechanism — V3:3811 — so a design
that assumes one builds on a missing mechanism).

- RESIDENT: 3 to 5 hot tools pinned with full schemas in context. Pinned
  means named in this spec and in the probe; nothing else loads a schema.
- DEFERRED: namespaced servers whose tools appear only as stable index
  entries (prefix plus one line, never a schema) until a role boundary
  asks for one by name.
- FORBIDDEN: denied by permission. A full-server deny also suppresses its
  instructions — nothing of the server leaks through a side channel
  (V3:3815). The probe proves both halves: invocation unreachable AND
  instructions absent.

Composition policy: only RESIDENT plus explicitly-requested DEFERRED tools
compose, and only with data classes the policy names. Sensitive payloads
are shaped (redacted) at the bridge before crossing into a composite
result. The composition runs isolated: the compose sandbox receives only
declared tool references, so an undeclared server is unreachable from
inside.

## 2. Kit-side disclosure (what this slot builds)

The kit discloses for its own skills and agents everything the code pattern
does not govern (V3:3816), with context economy measured in characters,
never claimed by impression:

1. Hot set: exactly 4 pinned resident tools (`fs.read`, `fs.tree`,
   `search.code`, `git.status`). The rest is deferred. The 30-to-50
   selection-slope limit is the design constraint (V3:3833).
2. Deferred set: 11 honest audited tools across `fs/`, `search/`, `git/`
   prefixes; the deferred index carries the 2 copied ones (`search.index`,
   `git.blame`) — stable `<server>/` prefixes, one line each, zero schemas
   in context. Registered-but-uncopied tools stay unserved (§2 item 8).
3. Discovery happens at role boundaries only (`planner`, `implementer`,
   `reviewer` at a boundary flag). A non-boundary call is refused as an
   event. Prefixes are stable across repeated discovery (cache-safe:
   identical prefix-map digest twice).
4. Per-agent declaration cost is measured per agent in characters and fed
   to cost governance as `{ agent, declaredChars, budgetChars,
   withinBudget }` rows with a ceiling check (LD-06 dependency, V3:3835).
5. Multi-server composite task (locate symbol via `search.code`, read file
   via `fs.read`, check state via `git.status`) runs with deferred schemas
   provably out of context: the assembled context string contains no
   deferred schema marker while the hot set stays resident and the result
   verifies.
6. Forbidden server `exfil` is denied both ways: `exfil.send` invocation
   throws unreachable, and no `exfil` instruction text appears anywhere in
   the assembled context.
7. Tool descriptions are audited before admission: a misleading
   description (claims read-only, mutates) and a poisoned description
   (carries an instruction override) are both rejected with reasons and
   never enter the hot set or the deferred index.
8. Files and code are the discovery interface, not schemas alone
   (V3:3839, V3:3843): the file tree is generated from the registry over
   copied content only, and content never copied is provably unserved
   (absent from tree and index alike).

## 3. Fallback FBLD-12 carried verbatim

FBLD-12 (slot 0.9.12, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:24`):
"Conflict: V3 slot scope versus R4 discovery-trigger breadth with zero
on-disk combined record — Fallback: keep the trigger verbatim; device
stays UNVERIFIED — Matches LD-12 — Status FLAGGED, never resolved."

Honored here: the discovery trigger is kept verbatim as cited
(R4 `find-skills` trigger-widening pressure toward session duties, per
BUILD-099 record) — this spec neither widens it toward session duties
nor narrows it. Device stays UNVERIFIED: no device claim appears in
this spec or the probe, and none is widened by inference. The conflict
stays FLAGGED, never resolved here.

## 4. What this slot does NOT do

- No install command is invented or verified. No `install_cmd` appears in
  this commit; where a provisioning path would be needed the value is
  `null` with `verification: unverified` (zero invented installs).
- No per-agent tool-group mechanism is assumed or emulated.
- No full-schema escape hatch is loaded by default; the escape exists
  only as a fully-paid, explicitly-requested path (V3:3810).
- No device statement, no trigger rewrite, no SaaS adoption.
