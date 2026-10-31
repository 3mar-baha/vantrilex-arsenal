# Knowledge packs — LD-26 acceptance system (0.9.26)

Doctrine: FULL

Lane: build-release (AUTO-0.9-FULL 0.9.26, twenty-sixth of 33; this file covers
0.9.26 ONLY, never 0.9.27). Node: b0926-build.
Date (UTC): 2026-10-31. No model pin.
Authority: sole-authority V3:5594-5746 (treatment + exit criteria + open
questions, carried as data); fallback FBLD-26 carried verbatim in section 12
(local-only; retention proposal stays UNVERIFIED).
Scope: this file defines the pack schema. The executable proof is
`scripts/verify-knowledge-packs.mjs` (twenty-two checks, exit 0 PROCEED).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Pack schema (all five hold together, or the pack is a folder)

A knowledge pack is accepted only when all five hold together:

1. **Allowlist source list.** The pack names its sources S1..Sn explicitly.
   Nothing outside the allowlist enters the content: a candidate source not on
   the list contributes zero chunks, and a pack with an empty allowlist is
   REJECTED at the gate (check `no-allowlist-reject`).
2. **Per-source trust note.** Each source carries a specific note naming why it
   is trusted, what its limits are, and what change forces a re-review. A
   generic note (`trusted`, `reliable`) fails the gate; the note is marked
   STALE the moment its source content changes (checks
   `trust-note-specific`, `trust-note-reviewable-on-change`).
3. **Deterministic build recipe or stated reason.** Recipe R1 builds the pack
   (section 2). Re-running R1 twice produces byte-identical content (check
   `recipe-rerun-byte-identical`). A pack with no recipe must carry a stated
   `reason:` line; a pack with neither recipe nor reason is REJECTED as a
   silent gap — the reason line is the only substitute, never a silent gap
   (checks `stated-reason-shape`, `silent-gap-rejected`).
4. **Chunked content.** Content is split into addressable chunks. A sample of
   chunks is inspected: every sampled chunk must carry complete meaning (no
   mid-word cut without an explicit continuation marker). A broken chunk is
   detected, never averaged away (checks `chunk-sample-meaning-intact`,
   `broken-chunk-detected`).
5. **Per-version pinned retrieval measure with regression-reject.** Every pack
   version pins its retrieval measure beside the version (tool `m1.0`, fixed
   8-query fixture, recall@3). An update scoring below the pinned measure is
   REJECTED at the gate by number, not by argument; an update scoring at or
   above passes under the same tool (checks `measure-pinned-to-version`,
   `regression-reject`, `improvement-accept`). Cross-tool numbers are
   NOT-COMPARABLE, never silently compared (check
   `same-measure-comparison`).
6. **Visible expiry at load with load-time alert.** Every pack declares
   `expires:`; the loader prints the expiry before the content is used. Past
   expiry fires `[knowledge-packs] EXPIRED`; expiry within 30 days fires
   `[knowledge-packs] NEAR-EXPIRY` — two distinct tokens, never one vague
   warning (checks `expired-load-alert`, `near-expiry-distinct`,
   `fresh-silent`).
7. **Per-source license state with unknown-license refuse.** Every source
   carries a license state. A source whose state is `unknown-license` refuses
   the whole pack, without substitution by a similar-looking source (check
   `unknown-license-refuse`).

## 2. Build recipe R1 (deterministic) and the seed pack KP-01

Recipe R1: split source text on blank lines, trim each piece, drop empties,
join with a single `\n---\n` separator. No clock reads, no network, no
ordering other than source order. Two runs over the same sources and the same
R1 produce byte-identical bytes (proven, not asserted).

Seed pack KP-01 (version-separated platform knowledge, scope `platform-0.9`
exactly — one platform version, no cross-version mixing):

| Source | Content | Trust note | License |
|---|---|---|---|
| S1 | V3 slot text 0.9.26 (lines 5594-5746) | Trusted as the acceptance wording because it is the sole authority named in the dispatch; limit: wording only, not the open questions (decided in the ledger); re-review when the V3 text changes. | repo-internal (known, no redistribution) |
| S2 | 0.9.25 guardrail spec + harness shape | Trusted as the structural pattern because its commit is published and verified; limit: pattern only, domain rules differ; re-review when the slot text changes. | repo-internal (known, no redistribution) |
| S3 | Plugin surface census (seat-deny + diff-size guard) | Trusted as inventory because read live from the tree; limit: behavior at acceptance date, not a promise; re-review when arsenal.ts changes. | repo-internal (known, no redistribution) |

KP-01 carries all five schema elements plus a pinned measure (v1 `0.875` =
7/8 on tool `m1.0`, source hashes pinned beside the score) and an expiry
(`expires: 2027-01-29`, 90 days from acceptance). Exemptions: 0 — the seed is
built on this same schema with zero seed exemptions (check
`seed-passes-all-gates`).

## 3. Source-change rule

Source content hashes are pinned beside the measure. When a source hash no
longer matches the pinned hash, the gate demands NEW-VERSION-REQUIRED: either
a new pack version (rebuilt, re-measured, re-pinned) or a visible alert — the
old measure is never carried forward silently, and the changed source's trust
note is marked STALE until re-reviewed (checks
`source-change-new-version-or-alert`, `trust-note-reviewable-on-change`).

## 4. Measure history rule

Old-version measures are preserved beside the new ones: accepting v2 never
deletes the v1 record, so any reviewer can compare versions by number (check
`old-measures-preserved`). Comparison is valid only under the same measure
tool; a tool change makes prior numbers NOT-COMPARABLE until re-measured
(check `same-measure-comparison`).

## 5. Expiry states (three, never two)

- Fresh (`expires:` more than 30 days out): loads with the expiry printed, no
  alert.
- `[knowledge-packs] NEAR-EXPIRY` (30 days or fewer): visible, distinct,
  inspectable — plan the replacement, keep using loudly.
- `[knowledge-packs] EXPIRED` (past `expires:`): visible and blocking-shaped —
  the pack keeps its last measure loudly and must not be trusted silently.
  A pack expired with no replacement carries a declared state, never a silent
  load and never a silent deletion (V3:5740).

## 6. License gate

Known states admit the pack (`repo-internal`, `MIT`, `Apache-2.0`, `CC-BY`,
`CC-BY-SA`, `CC0`, `Unlicense`). The state `unknown-license` refuses the
whole pack (REFUSED): no partial acceptance, no silent substitution. A source
whose license changes after acceptance follows the source-change rule
(section 3): new version or visible alert, and the license gate re-runs.

## 7. FBLD-25-style carry: what stays MANUAL

No prior-version pack is productized here. Earlier version knowledge stays
outside KP-01 by the version-separation rule (section 2): a chunk about
another platform version inside KP-01 fails the seed gate, however accurate
it is.

## 8. Zero invented installs

This change introduces no installable component and no install command. Every
`install_cmd` touched by this lane is `null` with `verification: unverified`
where unprovable; a null command plus `unverified` beats a plausible lie. No
registry, catalog, or sidecar file is modified on this node.

## 9. Loader contract (what `load` prints, in order)

1. Pack id + version + version scope.
2. Allowlist source ids (S1..Sn) with pinned content hashes.
3. Expiry date; plus `[knowledge-packs] NEAR-EXPIRY` or
   `[knowledge-packs] EXPIRED` when that state holds, never silent.
4. Pinned measure + tool version.
5. Per-source license states; `unknown-license` aborts the load with REFUSED
   before any content is served.

## 10. Measure tool m1.0 (fixed fixture, no drift)

Eight fixed queries over the seed chunks; score = recall@3 (fraction of
queries whose answer chunk ranks in the top 3). Fixture and tool version are
part of the pin: `m1.0/8q/recall@3`. Any tool change re-measures every live
version before any comparison is drawn.

## 11. Regression gate (numbers, not arguments)

- `new.score < pinned.score` (same tool) → REJECTED, no waiver by argument;
  recalibration is a new version with dated evidence, never a retroactive
  excuse.
- `new.score >= pinned.score` (same tool) → ACCEPTED, old record preserved.
- Different tool → NOT-COMPARABLE until both versions are re-measured.

## 12. FBLD-26 (carried verbatim, never resolved)

FBLD-26 — Slot 0.9.26 — Conflict: V3 slot scope versus pack-retention
proposal — Fallback: local-only; retention proposal stays UNVERIFIED —
Matches LD-26 — Status UNVERIFIED, never resolved.

Provenance (honest, not a second copy): no `FBLD-26` log file exists in the
tree at the base `acb79b1` (searched, absent); the dispatch brief's
parenthetical `(local-only, retention proposal stays UNVERIFIED)` is the sole
FBLD-26 content evidenced to this seat and is carried above verbatim. V3 gate
text wins on any conflict; the retention proposal stays data.

---

Ponytail: FULL — pack schema plus pinned-measure harness plus one seeded pack, no speculative abstraction.
