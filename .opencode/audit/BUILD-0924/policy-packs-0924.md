# Policy packs v1 — pack spec (0.9.24)

Lane: build-release (AUTO-0.9-FULL 0.9.24) | Node: b0924-build | Pack: `factory-hard-rules v1 (0.9.24)`.

This file is the pack-spec: the package schema, the first pack (full
factory-hard-rules translation), the enforcement-point catalog, the
contradiction rule with its resolutions log, the changelog-bridge proof,
and the suspend/revoke procedure. The checker
`verify-policy-packs-0924.mjs` enforces everything stated here; prose
never substitutes for a run.

## 1. Package schema

Every pack entry carries exactly these fields:

| Field | Meaning |
|---|---|
| `id` | Stable rule identity (`FHR-NN` binding, `ADV-NN` advisory). Referenced by checks, suspends, revokes, and resolutions. |
| `source` | The factory sentence this entry translates. Nothing else may enter v1 (no early expansion). |
| `scope` | Where the rule applies and where it does not. Scope separates rules: two rules in different scopes never contradict. |
| `point` | The enforcement point that fires the rule, or `null` for advisory entries. A binding entry with `null` is a floating rule and is refused. A point name with no implementation in the checker is a fake point and is refused. |
| `severity` | `deny` (violation rejects), `allow` (match permits; bridge candidates only), `advisory` (guidance, never enforced). |
| `verdict` | What the rule casts when its point matches: `deny` or `allow`; `null` for advisory. |
| `params` | Machine scope details (pinned hashes, claim keys, exclusion lists). |
| `advisory` + `advisoryReason` | Present only on advisory entries, stating why no point exists. |

Rules: a binding entry needs all of id, scope, point, severity, verdict.
An advisory entry needs id, scope, severity `advisory`, and the reason.
Anything else is refused, never defaulted.

## 2. Enforcement-point catalog

The checker implements six points. Each point is real because a deny
conformance fires through it in `--self-test` (see §7); a point nobody
fires is removed, never kept as decoration.

| Point | Predicate | Production mirror (honest mapping) |
|---|---|---|
| `checker:dep-scan` | No manifest declares dependencies; no script imports a bare (non-`node:`, non-relative) module. | Scope fact (no root `package.json`) plus the zero-dependency toolchain law. |
| `checker:artifact-hash` | The artifact bytes hash to the pinned SHA-256, else missing/tampered. | `scripts/generate-catalog-json.mjs` determinism: a regenerated artifact must be byte-identical. The checker pins the hash; it does not re-run the generator. |
| `checker:single-writer` | No two writers claim the same `registry/data/*.jsonl` sidecar. Claims arrive as `__writerClaims__`; absent or unparseable claims fail closed. | Single-writer law over branch ownership. |
| `checker:ascii-scan` | No non-ASCII byte outside `README.md` / `README.ar.md`. | English-only rule with its README-pair exception. |
| `checker:placeholder-scan` | No `TODO`, `FIXME`, `XXX`, `HACK`, or `coming soon` outside the rule-definition files that must list the tokens. | No-placeholders rule. The token list lives in the definition, and the definition files are excluded by declared `params.definitionFiles`, exactly how the pre-commit hook exempts kind-prefixed tokens. |
| `checker:secret-scan` | No AWS-key form, live-key form, private-key block, or long non-registry token value outside the rule-definition files. Registry-kind-prefixed tokens (`mcp/`, `skill/`, …) never fire. | Pre-commit secret scanner plus the Unreleased hook fix that exempts Registry tokens (see §5). |

Anti-fake-point rule: the checker resolves every binding point against
its `POINTS` table. An unknown name rejects the pack
(`unknown-enforcement-point`, proven by check
`rejects-unimplemented-point`). A point with no firing deny conformance
is deleted, never shipped.

## 3. First pack: full factory-hard-rules translation (v1)

Version: `factory-hard-rules v1 (0.9.24)`. Seven binding rules (one per
AGENTS.md hard rule) plus one advisory tag. Zero floating rules. Zero
unresolved contradictions. Zero added rules beyond the factory hard set.

| ID | Source | Scope | Point | Severity |
|---|---|---|---|---|
| FHR-01 | Hard rule 1 (Node-only toolchain) | Every package manifest plus every script import in the tree | `checker:dep-scan` | deny |
| FHR-02 | Hard rule 2 (catalog markdown is a build artifact) | `registry/VANTRILEX_CATALOG.md` | `checker:artifact-hash` | deny |
| FHR-03 | Hard rule 3 (catalog JSON is a derived mirror) | `registry/catalog.json` | `checker:artifact-hash` | deny |
| FHR-04 | Hard rule 4 (single-writer law) | `registry/data/*.jsonl` writer claims across the pack set | `checker:single-writer` | deny |
| FHR-05 | Hard rule 5 (English only, README pair excepted) | Whole tree except `README.md` and `README.ar.md` | `checker:ascii-scan` | deny |
| FHR-06 | Hard rule 6 (no placeholders) | Whole tree except the rule-definition files that list the tokens | `checker:placeholder-scan` | deny |
| FHR-07 | Hard rule 7, first sentence (no committed file carries a real value) | Whole tree except the rule-definition files | `checker:secret-scan` | deny |
| ADV-01 | Hard rule 7, second sentence (a leaked credential is revoked first, then removed) | Human incident response outside the tree | none (`null`) | advisory |

ADV-01 is not a new rule: it is the non-enforceable sentence of hard
rule 7, tagged advisory with its reason stated in the pack
(`advisoryReason`): revocation ordering is a human action outside any
file the checker can read. Tagging is honest; inventing a point for it
would be the fake-point hazard V3 warns against, and is refused.

## 4. Contradiction rule and resolutions log

Contradiction (V3 definition, carried): one rule orders deny and another
orders allow on the same scope and the same enforcement point. Same
verdicts agree; different scopes separate. A contradiction needs a
recorded resolution (winner, reason, decider) before the pack ships; an
unresolved contradiction rejects the pack.

Resolutions log: EMPTY. The checker proves `findContradictions` returns
zero pairs on v1 (all seven binding verdicts are `deny`, so zero is
expected, not vacuous), and proves the detector is not vacuous on
synthetic pairs (same scope+point deny-vs-allow detected; cross-scope
not; same-verdict agreement not; resolved-with-record accepted;
unresolved rejects). Zero unresolved, zero silent.

Resolution ownership stays open (V3 open question: owner, checker, or
joint decision — carried, decided per pair with `decidedBy` recorded).

## 5. Changelog bridge (one entry translated and checked)

Trace: CHANGELOG.md ## [Unreleased] ### Fixed entry 3 (pre-commit scanner Registry token exemption).

Candidate BRIDGE-01 (checked, NOT merged): allow-verdict rule on
`checker:secret-scan` over registry selection records, asserting a
kind-prefixed token (`skill/verify-01`) does not fire the scanner while
a real-form secret still does. The checker proves both directions, so
the point is exercised, not rubber-stamped. v1 keeps exactly its 8
entries: the bridge proves the translation path (entry to checked rule
with a trace link), not a second pack. A multi-entry diversity proof is
future work (V3 open question carried in §8).

## 6. Suspend and revoke (practically tested, scoped to the one rule)

- Suspend: versioned (`+suspend-<id>`), reasoned, restorable. The
  suspended rule is skipped (`suspended-skip`); every other rule still
  fires. Proven: suspending FHR-06 quiets only FHR-06 while FHR-01
  still denies.
- Revoke: the rule leaves the active set into `tombstones` with id and
  reason, version bumped (`-revoke-<id>`), restorable only by re-issue.
  Proven: revoking FHR-05 ends its denials while FHR-01 still denies.

## 7. Conformance (every binding rule, deny plus allow, real point)

Each of FHR-01…FHR-07 carries one deny fixture (must DENY) and one
allow fixture (must ALLOW), both run through `enforcePack` — the same
entry the gate uses, never the evaluators directly. The per-check
evidence quotes the firing point and the match reason
(`conform-<id>-deny` / `conform-<id>-allow` in `verify-policy-packs-0924.mjs --self-test`).
Run: `node verify-policy-packs-0924.mjs --self-test` (rerunnable by a non-author).
Definition-file exclusion is itself conformance-proven
(`definition-exclusion-honored`).

## 8. Open questions carried (none decided here)

Q-binding (V3:5416-5436, carried open): pack-vs-release-discipline
precedence; versioning and change announcements; severity bounds and
severity review; contradiction-resolution ownership; point-change
versioning; point-identity proof; pack sizing and splitting; suspended
and revoked pack retention; policy-pack vs guardrail-pack boundary;
announcement lead time; test/pack co-versioning; untranslatable hard
rules (answered for v1: tag advisory, §3); multi-entry bridge diversity
(E9 stronger reading: one varied entry now, broader proof later);
success signal after ship; partial-pack acceptance (v1 answers by
example: full translation only); cross-pack conflict arbitration;
user-facing pack description; boundary severity tests; point-change
blast radius; resolution persistence across versions; post-ship review
cadence. Safe defaults hold: deny wins on safety; no measurement means
no claim; a failed gate blocks the ship; one rule, one scope, one
effect; collective stop on unresolved contradiction; every decision
logged with its reason.

## 9. Fallback and lineage (verbatim)

- FBLD-24 — Slot 0.9.24 — Conflict: V3 slot scope versus standing risk-tiered auto-approval deferral — Fallback: run supervised first; delegation only after a clean record — Matches LD-24 — Status FLAGGED, never resolved.
- LD-24 — Slot 0.9.24 — Policy packs v1 — Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5284`), carried as data — Conflict FLAGGED: V3 slot scope versus standing risk-tiered auto-approval deferral — Fallback LD-24: run supervised first; delegation only after a clean record — Not resolved.

Supervised-first holds: this build ran supervised with its evidence
ledger (b0924-build.md); no delegation is claimed anywhere in this
pack. The V3 conflict stays FLAGGED, never resolved.

## 10. Install honesty

install_cmd: null, verification: unverified. No install command exists
for a two-file audit proof; the checker imports stdlib only
(`node:crypto`, `node:fs`, `node:path`, `node:url`). A plausible-looking
command would be worse than this admission.
