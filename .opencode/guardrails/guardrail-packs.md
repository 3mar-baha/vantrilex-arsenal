# Guardrail packs — LD-25 acceptance system (0.9.25)

Doctrine: FULL

Lane: build-release (AUTO-0.9-FULL 0.9.25). Node: b0925-build. Date (UTC): 2026-10-31.
Authority: sole-authority latest-draft LD-25 under V3:5439-5592 (treatment + exit
criteria + open questions, carried as data); fallback FBLD-25 carried verbatim in
section 11 (V3 gate text wins; capsule stays data; FLAGGED never resolved).
Scope: this file defines the acceptance contract. The executable proof is
`scripts/verify-guardrail-packs.mjs` (six checks, exit 0 PROCEED with counts).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Acceptance contract

A guardrail becomes an accepted pack only when all four hold together:

1. **Declared threats, enumerated testably.** Each pack lists its threats as named,
   individually testable cases (see pack DSG-01 threats T1-T3 in section 5). A
   threat that cannot be written as a failing-then-passing probe is not a
   declared threat; it is a worry, and worries do not count toward acceptance.
2. **Innocent set representing real legitimate use.** Each pack ships an innocent
   set drawn from real legitimate use (see pack DSG-01 innocents I1-I4 in
   section 5), never cases cherry-picked because the guard passes them easily.
3. **False-alarm budget declared.** Each pack declares its budget up front
   (DSG-01: at most 1 false alarm per 10 innocent cases; observed 0 of 4).
4. **Over-budget pack REJECTED even if it catches everything.** A pack that
   exceeds its false-alarm budget is rejected without exception and without
   justification-by-catch-rate. No waiver by argument exists; recalibration is a
   new acceptance round with dated evidence, never a retroactive excuse.

## 2. Failure modes (named, fail-closed above the low tier)

Every pack carries exactly one named failure mode. Above the low tier every
failure mode is fail-closed (failure denies, never permits). No pack ships
without a named failure mode.

| Pack | Tier | Named failure mode | On failure |
|---|---|---|---|
| DSG-01 diff-size guard | above low (guard) | `fail-closed-deny` | BLOCK the change slice; emit `[arsenal] diff-size-guard: BLOCKED` |
| KS-01 kill switch (manual) | above low (guard) | `fail-closed-deny` (declared, unproven) | deny the callback when the signal is unreadable |
| DC-01 description checker (manual) | above low (gate) | `fail-closed-deny` (declared, unproven) | reject the commit/message when the scan cannot run |

Simulated failure proves the declared mode is what really happens: the harness
kills the guard's fact source and asserts the outcome is BLOCK, not ALLOW
(check `failure-mode-simulated-closed`).

## 3. Override story (recorded before need)

Emergency override without a pre-recorded story becomes a permanent hole, so the
story is recorded here before any need exists:

- **Who may override:** the repository owner only. No agent, no reviewer, no
  automation may override on its own authority.
- **How logged:** every override appends a dated line to the audit ledger naming
  who overrode, which pack, which change slice, and why; the line is committed,
  never kept in chat memory.
- **Dated reviewer + review time:** each override names its reviewer and its
  review deadline at override time. Standing rule: reviewer `owner`, review
  within 7 days of the override; an override unreviewed past its deadline is
  auto-suspended (treated as expired, fail-closed) until reviewed.
- **Proof:** the harness ships one recorded override drill (pack DSG-01,
  reviewer `owner`, deadline `2026-11-07`, reviewed `2026-11-02`) as the format
  reference; the drill is data, not a live override.

## 4. Freshness (adversarial-review recency visible at load)

- Every accepted pack declares `adversarial-review-date` and `review-valid-days`.
  DSG-01: reviewed `2026-10-31`, valid 90 days, expires `2027-01-29`.
- Freshness is visible at load: the loader prints the review date and days
  remaining for every pack it loads.
- Expiry fires a visible expirable alert (`[guardrail-packs] STALE ...`), never
  silent trust. A stale pack keeps its last verdict loudly (alert attached) and
  the trust plane must not depend on a stale pack without that alert firing.
- The harness proves both directions: a fresh pack loads with no alert, and a
  fixture pack dated `2026-01-01` (valid 90 days) fires the alert at load
  (check `freshness-alert-fires`).

## 5. Productization list (priority-ordered, per-item acceptance state)

Inventoried from the repo (priority order: blast radius first):

1. **DSG-01 diff-size guard** — source `.opencode/plugin/arsenal.ts` (limits
   120 lines / 4 files; emits `[arsenal] diff-size-guard: BLOCKED`). State:
   **ACCEPTED** — passed FULL acceptance as the system proof (this lane).
   - Declared threats: T1 (121 lines over 5 files BLOCKED), T2 (200 lines in
     1 file BLOCKED), T3 (6 files of 1 line each BLOCKED — file-count sprawl).
   - Innocent set: I1 (3-line fix, 1 file, ALLOW), I2 (exactly 120 lines /
     4 files boundary, silent ALLOW), I3 (80 lines, 2 files, ALLOW), I4 (new
     10-line file plus 5-line edit, ALLOW).
   - Budget: at most 1 false alarm per 10 innocent cases; observed 0 of 4.
   - Failure mode: `fail-closed-deny` (proven by simulated failure).
   - Override story: section 3. Freshness: reviewed `2026-10-31`, 90 days.
2. **KS-01 kill switch** — source `.opencode/plugin/arsenal.ts` (per-project
   kill switch read at each callback head; malformed or absent signal denies).
   State: **MANUAL** — inventoried, declared failure mode assigned, not yet
   through adversarial acceptance; never treated as an accepted pack.
3. **DC-01 description checker** — source `.githooks/pre-commit` (secret
   scanner plus `.env` guard plus AI-attribution gate) and
   `.githooks/commit-msg` (message attribution gate). State: **MANUAL** —
   inventoried, declared failure mode assigned, not yet through adversarial
   acceptance; never treated as an accepted pack.

Rule: hand-built guardrails not yet productized stay tagged MANUAL and are
never loaded, cited, or counted as accepted packs.

## 6. External-access pattern (catalog standard)

One pattern governs every model external-access component, whether or not any
concrete tool is admitted:

- **Channel table:** every external channel is named in a table with its
  direction, trust expectation, and owner boundary (primary accounts are never
  touched; secondary accounts only; read-only; quarantined where ordered).
- **Primary/backup succession:** every component names its primary channel and
  its backup, and states the exact effect of primary failure (backup serves
  with an announced effect — never silent failover, never unmonitored opening).
- **Health check:** every channel carries a health check that must pass before
  the component is relied on; a failed health check fails the component closed.
- **Teaching book:** every component ships a short teaching note so the pattern
  is learnable and applicable, not word-of-mouth between those who know it.

Accepted model components on this pattern (two, proving the pattern is a
pattern and not one special case):

| Component | Primary channel | Backup (succession effect) | Health check | Teaching book |
|---|---|---|---|---|
| EA-01 read-only docs fetch | direct fetch of the allowlisted docs host | cached bundle (serves the pinned snapshot, announces `served-from-cache`) | host reachability plus snapshot digest match before use | section 6 of this file plus the cached-bundle README pointer |
| EA-02 read-only registry lookup | direct registry query over the allowlisted endpoint | mirrored catalog JSON (serves the last verified mirror, announces `served-from-mirror`) | endpoint reachability plus mirror freshness date before use | section 6 of this file plus the mirror-generation pointer |

Succession proof: the harness fails EA-01's primary in simulation and asserts
the backup serves with the announced effect (check
`succession-tested-by-simulated-primary-failure`).

## 7. Lookalike refusal (name is never identity)

A same-name public-repo lookalike is refused by name alone. Recorded refusal
proof: candidate `public-registry/diff-size-guard` claims the DSG-01 name with
zero identity evidence (no gate record, no acceptance ledger, no review date);
verdict **REFUSED** (`refused-lookalike-by-name`), recorded `2026-10-31`. The
harness replays this refusal (check `lookalike-refused-by-name`). Identity is
proven by gates and evidence, never by name similarity or fame.

## 8. Simulated failure proof

The harness simulates the guard's fact-source failure (git facts unreadable)
and asserts the observed outcome equals the declared `fail-closed-deny`
(BLOCK, never ALLOW). The passing harness run is the proof; a run that cannot
simulate the failure is a failed check, not a skipped one.

## 9. Manual-tag rule

KS-01 and DC-01 remain MANUAL. MANUAL items are inventoried and assigned a
declared failure mode, but they carry no acceptance verdict, no freshness date,
and no catalog entry. Any loader that meets a MANUAL item must treat it as
unaccepted (alert, never trust).

## 10. Zero invented installs

This change introduces no installable component and no install command. Every
`install_cmd` touched by this lane is `null` with `verification: unverified`
where unprovable; a null command plus `unverified` beats a plausible lie. No
registry, catalog, or sidecar file is modified on this node.

## 11. FBLD-25 (carried verbatim, never resolved)

FBLD-25 — Slot 0.9.25 — Conflict: V3 slot scope versus R3 risk-limit approval
proposal — Fallback: V3 gate text wins; capsule stays data — Matches LD-25 —
Status FLAGGED, never resolved.

---

Ponytail: FULL — acceptance contract plus adversarial harness plus one productized pack, no speculative abstraction.
