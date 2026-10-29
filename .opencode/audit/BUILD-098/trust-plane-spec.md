# LD-08 graded-autonomy trust plane — spec (0.9.8)

Lane: build-release (AUTO-0.9-FULL 0.9.8) · Node: b098-build (wave 1 of 9) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md` lines 3524–3576 (LD-08 treatment, Arabic original).
Scope is implemented from that treatment only; nothing is re-derived here.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Scope correction (binding, honored verbatim)

The platform in its examined version has NO OS-level isolation: no planned
key; policies do not isolate plugin code; command execution runs with host
authority; plugins run inside the same process. Therefore:

- "Isolation files" in this slot mean **permission + policy files only**.
- Trust level means **permission + policy + hook discipline**, with
  permission-evaluation as the documented veto point.
- Real OS-level isolation (isolated workspaces / containers) is **external
  or deferred** — never claimed here as inside the platform.

V3 original (carried, not re-derived): «ملفات العزل» هنا تعني ملفات إذن
وسياسة؛ ومستوى الثقة = انضباط إذن وسياسة وخطاف مع تقييم الإذن نقطة فيتو.
العزل الحقيقي على مستوى النظام خارجي (مساحات عمل معزولة أو حاويات) أو مؤجل.

## 2. Trust levels (five vocabularies)

Privilege descends operator → observer. The confined tier is **observer**.

| Level | Does itself | Proposes | Needs approval | Only watches |
|---|---|---|---|---|
| operator | routine acts in grant | improvements | high-stakes acts | — |
| collaborator | drafted acts in grant | plans | writes, network, control | — |
| advisor | nothing (prose only) | analyses, options | any act | execution |
| approver | review verdicts | policy edits | execution of any act | execution |
| observer | nothing | nothing (suggestion box only) | everything | everything |

Level rank (high → low): operator 4, collaborator 3, advisor 2,
approver 1, observer 0. Rank is a total order for subset checks only; it
confers no capability by itself — capability comes from the grant, and the
grant is checked at every evaluation.

## 3. Per-agent capability statements (sourced from pinned 0.9.7 descriptions)

Each statement below is sourced from the LD-07 pinned description set: tool
`read`, description `Read a registry entry by id.`, data shape `{id:string}`
(fixture component `registry-reader`, pin `452b948d…bc7281b0`, see
`../BUILD-097/pin-probe.mjs` and `supply-chain-spec.md`). No capability here
exceeds what that pinned description proves: a single registry read by id.

- operator — `registry-reader/read`: may execute the pinned read itself
  within its grant; any write/network/control act needs approval.
- collaborator — `registry-reader/read`: may draft reads for approval; may
  not execute writes.
- advisor — `registry-reader/read`: may cite pinned read results in prose;
  may not execute any tool.
- approver — `registry-reader/read`: may verdict read requests; may not
  execute reads itself.
- observer — `registry-reader/read`: may watch logged read displays only;
  may execute nothing and approve nothing (suggestion box only).

## 4. Permission + policy files (deny-default, fail-closed)

`trust-policy.json` (sibling file, same commit) is the policy file: explicit
per-level action grants plus `denyDefault: true`. Anything not explicitly
granted is denied, and any evaluation error denies too (fail-closed). The
policy file grants nothing by name of vendor — each of the decomposed claims
(write / read / network / control-level) is decided by its own rule, never
inherited.

## 5. Policy hooks as code (veto point)

`policy-hooks.mjs` (sibling file, same commit) is the hooks module. The
**permission-evaluation** function (`evaluatePermission`) is the documented
veto point: it runs on every act, denies unknown levels/actions/resources,
and denies on any internal error. Design-queue hook-abort semantics (probe
P-1, V3:3561) are unresolved upstream; until they are resolved, evaluation
here defaults to deny and the evaluation result is the veto — never an
advisory.

## 6. Approval queue (no-approval-UI axiom)

Approval is an **out-of-scope owner act, never an in-isolation interface**.
The queue is therefore a suggestion box, not a console:

- Any agent may append a request record `{level, act, resource, reason}`.
- No in-isolation surface can approve, promote, or enable anything: a
  reachable approval interface inside confinement is rejected in review.
- Promotion/enablement happens only by an owner act outside the scope —
  the generalization of the proven enable-file pattern — represented in code
  as an explicit `ownerAct` value that no in-scope call can mint.
- Control level lives outside the cage: an approval reachable from inside
  confinement is a suggestion box by construction.

## 7. Spawn-authority tiers (automated, subset rule by mechanism)

Spawn authority follows level rank: a parent at rank R may spawn a child at
rank ≤ R, never above. The **subset rule** is enforced by mechanism, not
prose: `enforceSpawnGrant(parentGrant, childGrant)` returns allow only when
every child action/resource pair is contained in the parent grant; a child
grant wider than the parent grant fails by code. The platform itself does
not enforce narrowing, so this module is the enforcement. The self-test
proves it with a child grant narrower than the parent grant, then a child
attempt to exceed it, which fails by mechanism (`SUBSET` lines).

## 8. Lethal-triad full-path data check

The triad is a **path** property, never a single-tool property: checking
tools one by one misses it. A path is triad-loaded when its full step list
carries all three of (a) untrusted input, (b) external egress, (c)
consequential act. `lethalTriadPathCheck(fullPath)` blocks sending any
triad-loaded complete path (`TRIAD` lines); a path missing any one leg may
be sent subject to the permission check. Single-tool checks are not a
substitute and are rejected in review.

## 9. Escape / self-promotion (release-blocking tests)

Designed from outside the confined tier as genuine attempts, never staged
to fail:

- Escape: observer attempts a write act → denied by evaluation
  (`ESCAPE` line).
- Self-promotion: observer attempts to raise its own level without an owner
  act → denied (`PROMOTE` lines); promotion with a genuine owner act is the
  only path and lives outside the scope.
- These are release-blocking tests: if any of them passes the gate, the
  release is blocked.

## 10. Fallback FBLD-08 honored

FBLD-08 (slot 0.9.8, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:20`): V3 slot
scope versus the R3 auto-fix and approve proposal — fallback is: fix text
stays in findings; apply is a second dispatch. Honored here: this build
adopts no auto-fix and no auto-approve. Any auto-fix/approve pressure
observed during this build is recorded as finding text in the build ledger
(`b098-build.md`), never applied as a change here. No R3 method adopted.

## 11. Open questions (carried, not decided)

- Approval-queue surface design under the no-approval-UI axiom (owner-side
  shape only).
- Which policy-as-code dialect the hooks consult (tied to later policy
  bundles).

## 12. Install honesty

No install command is invented by this slot. Where a component row would
need one and none is verifiable, the value is `null` with verification
`unverified`. A plausible-looking wrong command is worse than the
admission.
