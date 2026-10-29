# LD-07 supply-chain security for components — spec (0.9.7)

Lane: build-release (AUTO-0.9-FULL 0.9.7) · Node: b097-build (wave 1 of 9) · Owner: vantrilex-typescript
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md` lines 3471–3522 (LD-07 treatment, Arabic original).
Scope is implemented from that treatment only; nothing is re-derived here.

## 1. Problem

An accepted component can change after acceptance, and the description once
trusted may not be the description that executes. Tool descriptions are
instructions, not innocent prose — a maliciously edited description can steer
the agent into an act the owner never approved, and a silent upstream update
can swap the behavior of a trusted tool overnight. Without a pin and a
continuous diff-check, every earlier acceptance gate is a one-time promise
with no continuing guarantee.

## 2. What lands

A complete component supply-chain security system: scanning (static + LLM),
pinning plus software bill of materials (SBOM), signature and provenance
proof, trust tiers, and re-scan on manifest diff at update. Its heart is the
T3 guard: tool descriptions are instructions — every accepted tool
description and data shape is pinned by secure hash, CI diff-checks snapshots
on every upstream change (including tool-list-change notices), scanners run
at acceptance and at update, and full call media is shown.

## 3. Pinning and diff-check (the heart)

1. **Pin at acceptance** — every accepted tool description plus its data
   shape is pinned by secure hash (`pinTool`, SHA-256 over the canonical
   `name + description + dataShape`). Proven by the self-test PIN-anchored
   line.
2. **CI diff-check on every upstream change** — `diffCheck` compares the
   pinned snapshot against the upstream snapshot; any description, shape, or
   tool-list change raises a notice and stops the tool pending re-approval.
   Proven by the DIFF-stops-on-tamper line (a genuinely tampered upstream
   description stops; an unchanged re-read does not).
3. **Scanners at accept and at update** — `runScanner` runs at both stages;
   a component that passes at accept but fails at update is stopped, never
   carried silently.
4. **Full call media before the reviewer** — call arguments are rendered in
   full for the human reviewer, not merely logged: logging without display
   prevents nothing; display is what makes review possible.
5. **Description audit expanded agents → all kinds** — the design-queue
   description-audit input, previously agents-only, applies here to every
   component kind.

## 4. Input-license gate (formally constituted here)

The sort runs from tier zero since 0.9.1; the posture-enforcement mechanism —
what the factory does with each license class — is the mechanism of this
slot, per the owner's governed decisions. `licenseGate`: `allow` passes,
`review` holds for a human, `deny` blocks. Proven by the LICENSE-gate line.

## 5. Retro-scan budget and shared T9 bar

- **Retro-scan budget line (~15–25 percent of effort, estimated)** — sighted,
  not blind: slot 0.9.1 captured vendor, pin, and baselines from day one, so
  the retro-scan knows what each component looked like at acceptance and
  measures change instead of guessing it. Highest-risk rows first:
  executables and credential-bearing rows, because risk is not evenly spread.
- **T9 bar (shared with the eval slot)** — no component is accepted without
  working examples for every non-obvious tool, output-schema documentation,
  and actionable error text. Candidate hold on executable or
  credential-bearing components lifts per-component only: never bulk-lifted
  by time passing nor by the scan alone ending, only by each component's
  gates proving out.

## 6. Reported wild figures (carried as reported, not re-derived)

Prior study, 42,447 wild skills: 26.1 percent carried at least one
vulnerability; 5.2 percent showed possible malicious intent; executable-text
skills were 2.12x more likely to be vulnerable. With these figures the depth
is a calculated necessity, not a luxury.

## 7. Fallback FBLD-07 honored

FBLD-07 (slot 0.9.7, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:19`): V3 slot
scope versus the R3 cloud-learning proposal — fallback is local-only; secrets
never enter the repo. Honored here: this build ships local-only measurement
and gating. No cloud-learning adoption, no SaaS, no secret value in any
committed file (the probe fixtures carry `redacted` credential placeholders
only). Any cloud-learning pressure observed during this build is recorded as
a finding in the build ledger (`b097-build.md`), never applied as a change
here.

## 8. Exit criteria (V3:3511, in implementation terms)

1. A genuinely changed upstream description stops the tool pending
   re-approval (`diffCheck` + `verifyPin`, self-test DIFF-stops-on-tamper).
2. Candidate hold on executable or credential-bearing components lifts only
   as far as this slot's gates prove, per component.
3. Retro-scan coverage is stated (budget line plus highest-risk-first order).

## 9. Open questions (carried, not decided)

- Scanner-suite choice (the scanner-tool class named in the prior study).
- Signature-key custody under the control-level axiom.

## 10. Scope note

Component path only. This slot ships no standalone scanner project.
