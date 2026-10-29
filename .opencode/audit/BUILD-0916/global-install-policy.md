# LD-16 global install policy, installer merge semantics, reinstall, leader note — 0.9.16

Seat: vantrilex-typescript · Lane: build-release (AUTO-0.9-FULL 0.9.16) · Node: b0916-build (wave 1 of 9) · Date (UTC): 2026-10-29

Doctrine: FULL.

This record carries (7) enforcement from global policies never permissions,
(8) installer merge semantics, (9) clean reinstall plus selection
verification, and (10) the Vantrilex-leader task classification at mapping.

## 7. Enforcement from global policies, never permissions

Precedence facts the easy global install depends on:

- The global config is weakest against the project config: a project value
  beats a global-config value on the same key.
- Policies work in reverse: a global policy beats a project policy on the
  same rule — the outer scope wins, so outer beats inner.
- A repository cannot re-enable what a global policy forbids: outer beats
  inner is a guarantee, not a suggestion.
- Permissions behave differently: global permissions append-only before the
  project and agent rules, and last-match-wins decides among them — so a
  later project rule can soften an earlier global permission entry.
- Consequence, enforced by construction: any design that ships its
  guarantees as global permissions is rejected by construction, because
  last-match-wins cannot carry a guarantee. Guarantees ship as global
  policies only; permissions carry requests, never enforcement.

No guarantee in this slot is written as a permission. The probe fails any new
file that carries one.

## 8. Installer merge semantics (checked, with unit assertions)

Four rules, each unit-asserted in `scripts/verify-foundation-replacement.mjs`:

1. Arrays aggregate: installer plugin arrays concatenate in source order;
   nothing is deduplicated silently (`arrays aggregate`).
2. Same-name hooks replace whole: when two sources register the same hook
   name, the later registration replaces the earlier one entirely — no field
   survives the swap (`same-name hooks replace whole`).
3. Derived identity follows later-source-wins: an identity derived from
   merged sources takes the later source's value and names it
   (`later-source-wins`).
4. Installer config-write claims checked: every installer claim to write a
   config names the exact path and the writing role; a claim without both is
   refused (`config-write claims checked`).

## 9. Clean full reinstall on a clean base + selection verification on real hardware

Procedure (the easy in easy-global-install is proven, not asserted):

1. Start from a clean base: fresh clone of the branch tip, no carried state
   (`git clone --branch wt/0.9.16-foundation-replacement <remote>`, verify
   `git rev-parse HEAD` equals the landed commit, `git status --porcelain`
   empty). This is a clean-base reinstall: nothing from the old machine
   travels except the remote bytes.
2. Prove the tree healthy on the clean base: `node scripts/verify-skills.mjs`
   (skill format), `node scripts/verify-catalog.mjs` (catalog honesty and the
   selection), `node scripts/verify-registry.mjs` (registry data), and
   `node scripts/generate-catalog-json.mjs --check` (generated mirror
   current). All exit 0 before anything installs.
3. Selection verification: read the selection record
   (`.opencode/equip.manifest.json`) on the clean base and confirm every
   selected token resolves to a live catalog row; a selected token whose row
   is missing is suspended, never installed on trust.
4. Real-hardware check on the owner's common OS: this procedure runs on real
   hardware under Windows (the owner's common OS — measured this run as
   `platform=win32`, Node v25, `opencode v2.0.27`), never in a container
   abstraction. The probe records these facts live each run.
5. Background server start included: `opencode serve` starts the background
   server on the clean base and answers before the install is called easy;
   the drill is part of the selection check, not a separate manual step.
   Exit mapping: this procedure covers V3:4185 second half — clean reinstall with real-hardware selection check.

## 10. Vantrilex-leader task classification (mapping, not publish gate)

The Vantrilex-leader task classification for this slot is recorded in the
release-policy notes at mapping — `registry/policies/release-policy.json`
under `notes.leader_task_classification` with `stage:
mapping-not-publish-gate` — not at the publish gate, where numbers are
computed, never classified. The publisher still reads only `increments` plus
`cascade`; the note rides along without changing any number.
