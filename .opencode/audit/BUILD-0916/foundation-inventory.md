# LD-16 foundation ownership inventory + classification — 0.9.16

Seat: vantrilex-typescript · Lane: build-release (AUTO-0.9-FULL 0.9.16) · Node: b0916-build (wave 1 of 9) · Date (UTC): 2026-10-29

Concern (one sentence): inventory every base skill with its owner layer, counted consumers,
task layer, counted functional tasks, and observable evidence, then classify each item once,
with numbers advisory until close.

Doctrine: FULL.

Source (read-only): `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4105-4191` (LD-16 slot treatment);
fallback (verbatim, enforced on every number in this file):
`- FBLD-16 — Slot 0.9.16 — Conflict: V3 slot scope versus early-version promise pressure — Fallback: number advisory until close with proof; promise nothing early — Matches LD-16 — Status FLAGGED, never resolved.`
The fallback in plain words: number advisory until close with proof; promise nothing early.

Measurement rule (stated once, applied uniformly, re-checked by
`scripts/verify-foundation-replacement.mjs`): owner layer is the equip-manifest
phase that injects the skill (`scout/docs/plan/build/review/operate`), or `kit`
when no phase injects it; consumers counts tracked-file references to the skill
id outside its own skill folder and outside this migration record
(`git grep -l` over tracked files, own folder plus `.opencode/audit/BUILD-0916`
excluded); funct counts `### ` stages plus numbered steps under `## Procedure`;
evidence is the SKILL.md path plus the first consumer sample paths. The probe
script's own id table is test data, not a consumer, so it is excluded from
every count. Numbers are
advisory-until-close: they describe this tip (`ed43781`), never a future version.

## 1. Ownership inventory (43/43 base skills at tip `ed43781`)

| skill | owner + task layer | consumers | funct | observable evidence | class |
|---|---|---|---|---|---|
| `babel-bridge` | owner=plan task=vocabulary-bridge | consumers=24 | funct=9 | evidence=.opencode/skills/babel-bridge/SKILL.md sample=.opencode/agents/aether.md,.opencode/agents/blazar.md | class=stay |
| `circuit-breaker-guard` | owner=kit task=defect-circuit-breaker | consumers=40 | funct=10 | evidence=.opencode/skills/circuit-breaker-guard/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-github.md | class=stay |
| `documentation-as-tests` | owner=docs task=doc-testing | consumers=38 | funct=9 | evidence=.opencode/skills/documentation-as-tests/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-github.md | class=stay |
| `github-release-packager` | owner=kit task=release-packaging | consumers=22 | funct=9 | evidence=.opencode/skills/github-release-packager/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-releaser.md | class=stay |
| `kill-switch-document` | owner=operate task=halt-procedure | consumers=21 | funct=10 | evidence=.opencode/skills/kill-switch-document/SKILL.md sample=.opencode/agents/aether.md,.opencode/agents/blazar.md | class=stay |
| `kit-evaluation-journal` | owner=operate task=kit-trial-journal | consumers=21 | funct=8 | evidence=.opencode/skills/kit-evaluation-journal/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-harness.md | class=stay |
| `kit-evolution-log` | owner=operate task=kit-change-log | consumers=20 | funct=9 | evidence=.opencode/skills/kit-evolution-log/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-librarian.md | class=stay |
| `lenis` | owner=build task=smooth-scroll | consumers=31 | funct=17 | evidence=.opencode/skills/lenis/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-ui-designer.md | class=stay |
| `og-image` | owner=build task=social-cards | consumers=25 | funct=15 | evidence=.opencode/skills/og-image/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-ui-designer.md | class=stay |
| `open-graph-image` | owner=build task=og-route | consumers=25 | funct=7 | evidence=.opencode/skills/open-graph-image/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-ui-designer.md | class=stay |
| `ponytail` | owner=build task=generation-posture | consumers=92 | funct=7 | evidence=.opencode/skills/ponytail/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-fixer.md | class=stay |
| `pre-mortem` | owner=kit task=failure-premortem | consumers=27 | funct=9 | evidence=.opencode/skills/pre-mortem/SKILL.md sample=.opencode/agents/aether.md,.opencode/agents/blazar.md | class=stay |
| `preflight-system-doctor` | owner=kit task=env-preflight | consumers=42 | funct=8 | evidence=.opencode/skills/preflight-system-doctor/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-github.md | class=stay |
| `red-team` | owner=review task=adversarial-review | consumers=84 | funct=10 | evidence=.opencode/skills/red-team/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-fixer.md | class=stay |
| `relay-protocol` | owner=kit task=relay-messaging | consumers=15 | funct=6 | evidence=.opencode/skills/relay-protocol/SKILL.md sample=.opencode/audit/V-FULL-AUDIT.md,.opencode/audit/V87-COMPAT-FINDINGS.md | class=stay |
| `session-context-primer` | owner=kit task=session-anchor | consumers=49 | funct=6 | evidence=.opencode/skills/session-context-primer/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-github.md | class=stay |
| `skill-maker` | owner=kit task=skill-forging | consumers=12 | funct=9 | evidence=.opencode/skills/skill-maker/SKILL.md sample=.opencode/agents/vantrilex-agent-maker.md,.opencode/audit/POST87-BLUEPRINT-ERRATA.md | class=stay |
| `skill-shadow` | owner=review task=procedure-rehearsal | consumers=24 | funct=10 | evidence=.opencode/skills/skill-shadow/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-harness.md | class=stay |
| `time-capsule-test` | owner=build task=time-proofing | consumers=22 | funct=8 | evidence=.opencode/skills/time-capsule-test/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-harness.md | class=stay |
| `vantrilex-deep-understand` | owner=kit task=orientation-brief | consumers=12 | funct=6 | evidence=.opencode/skills/vantrilex-deep-understand/SKILL.md sample=.opencode/agents/vantrilex-github.md,.opencode/audit/V-FULL-AUDIT.md | class=stay |
| `vantrilex-design-variations` | owner=build task=design-variants | consumers=25 | funct=10 | evidence=.opencode/skills/vantrilex-design-variations/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-ui-designer.md | class=stay |
| `vantrilex-doctrine` | owner=operate task=doctrine-law | consumers=55 | funct=13 | evidence=.opencode/skills/vantrilex-doctrine/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-github.md | class=stay |
| `vantrilex-intake-fetch` | owner=kit task=intake-pull | consumers=9 | funct=4 | evidence=.opencode/skills/vantrilex-intake-fetch/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/RELEASE-BACKFILL.json | class=stay |
| `vantrilex-intake-send` | owner=kit task=intake-stage | consumers=7 | funct=4 | evidence=.opencode/skills/vantrilex-intake-send/SKILL.md sample=.opencode/audit/POST87-INTAKE.md,.opencode/audit/POST87-SLICE1.md | class=stay |
| `vantrilex-intake-triage` | owner=kit task=intake-route | consumers=7 | funct=5 | evidence=.opencode/skills/vantrilex-intake-triage/SKILL.md sample=.opencode/audit/POST87-PHASE0.md,.opencode/audit/POST87-SLICE1.md | class=stay |
| `vantrilex-prime` | owner=scout task=machine-prime | consumers=48 | funct=8 | evidence=.opencode/skills/vantrilex-prime/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-scout.md | class=stay |
| `vantrilex-vanguard` | owner=scout task=project-equip | consumers=71 | funct=16 | evidence=.opencode/skills/vantrilex-vanguard/SKILL.md sample=.opencode/agents/blazar.md,.opencode/agents/vantrilex-scout.md | class=stay |
| `vantrilex-workflow-forge` | owner=scout task=workflow-forge | consumers=50 | funct=7 | evidence=.opencode/skills/vantrilex-workflow-forge/SKILL.md sample=.opencode/agents/aether.md,.opencode/agents/vantrilex-github.md | class=stay |
| `vs-at-plan-craft` | owner=kit task=plan-craft | consumers=6 | funct=6 | evidence=.opencode/skills/vs-at-plan-craft/SKILL.md sample=.opencode/audit/BUILD-093/b093-build.md,.opencode/craft/build-spec.md destination=.opencode/craft (0.9.3 receivers, landed) | class=move-to-craft-bundle |
| `vs-bl-build-craft` | owner=kit task=build-craft | consumers=6 | funct=6 | evidence=.opencode/skills/vs-bl-build-craft/SKILL.md sample=.opencode/audit/BUILD-093/b093-build.md,.opencode/craft/build-spec.md destination=.opencode/craft (0.9.3 receivers, landed) | class=move-to-craft-bundle |
| `vs-book-doctrine` | owner=kit task=book-doctrine | consumers=4 | funct=6 | evidence=.opencode/skills/vs-book-doctrine/SKILL.md sample=.opencode/audit/BUILD-093/b093-build.md,.opencode/craft/build-spec.md destination=.opencode/craft (0.9.3 receivers, landed) | class=move-to-craft-bundle |
| `vs-circuit-breaker-guard` | owner=kit task=breaker-adapter | consumers=9 | funct=10 | evidence=.opencode/skills/vs-circuit-breaker-guard/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/RELEASE-BACKFILL.json destination=leader layer pending shadow | class=stay-shared |
| `vs-github-release-packager` | owner=kit task=release-adapter | consumers=7 | funct=9 | evidence=.opencode/skills/vs-github-release-packager/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/V-FULL-AUDIT.md destination=leader layer pending shadow | class=stay-shared |
| `vs-golden-equipment` | owner=kit task=golden-equipment | consumers=3 | funct=6 | evidence=.opencode/skills/vs-golden-equipment/SKILL.md sample=.opencode/audit/BUILD-093/b093-build.md,.opencode/craft/build-spec.md destination=.opencode/craft (0.9.3 receivers, landed) | class=move-to-craft-bundle |
| `vs-ponytail` | owner=kit task=ponytail-adapter | consumers=12 | funct=8 | evidence=.opencode/skills/vs-ponytail/SKILL.md sample=.opencode/audit/POST87-PHASE0.md,.opencode/audit/POST87-SLICE1.md destination=leader layer pending shadow | class=stay-shared |
| `vs-preflight-system-doctor` | owner=kit task=preflight-adapter | consumers=7 | funct=8 | evidence=.opencode/skills/vs-preflight-system-doctor/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/V-FULL-AUDIT.md destination=leader layer pending shadow | class=stay-shared |
| `vs-pu-probe-craft` | owner=kit task=probe-craft | consumers=6 | funct=6 | evidence=.opencode/skills/vs-pu-probe-craft/SKILL.md sample=.opencode/audit/BUILD-093/b093-build.md,.opencode/craft/build-spec.md destination=.opencode/craft (0.9.3 receivers, landed) | class=move-to-craft-bundle |
| `vs-session-context-primer` | owner=kit task=anchor-adapter | consumers=8 | funct=6 | evidence=.opencode/skills/vs-session-context-primer/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/RELEASE-BACKFILL.json destination=leader layer pending shadow | class=stay-shared |
| `vs-smithery` | owner=kit task=smithery-admission | consumers=12 | funct=16 | evidence=.opencode/skills/vs-smithery/SKILL.md sample=.opencode/audit/POST87-PHASE0.md,.opencode/audit/POST87-SLICE1.md destination=leader layer pending shadow | class=stay-shared |
| `vs-vantrilex-vanguard` | owner=kit task=vanguard-adapter | consumers=9 | funct=16 | evidence=.opencode/skills/vs-vantrilex-vanguard/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/V-FULL-AUDIT.md destination=leader layer pending shadow | class=stay-shared |
| `vs-vantrilex-workflow-forge` | owner=kit task=forge-adapter | consumers=7 | funct=7 | evidence=.opencode/skills/vs-vantrilex-workflow-forge/SKILL.md sample=.opencode/audit/POST87-SLICE1.md,.opencode/audit/V-FULL-AUDIT.md destination=leader layer pending shadow | class=stay-shared |
| `vs-zn-refresh-guard` | owner=kit task=register-refresh | consumers=3 | funct=6 | evidence=.opencode/skills/vs-zn-refresh-guard/SKILL.md sample=.opencode/audit/BUILD-092/b092-build.md,.opencode/zenith/team-model-register.md destination=.opencode/zenith (0.9.2 receivers, landed) | class=move-to-craft-bundle |
| `vs-zn-team-control` | owner=kit task=team-control | consumers=4 | funct=6 | evidence=.opencode/skills/vs-zn-team-control/SKILL.md sample=.opencode/audit/BUILD-092/b092-build.md,.opencode/skills/vs-zn-refresh-guard/SKILL.md destination=.opencode/zenith (0.9.2 receivers, landed) | class=move-to-craft-bundle |

Totals: 43 rows — class=stay 28, class=move-to-craft-bundle 7, class=stay-shared 8, class=retire 0.

## 2. Classification per item (one class each, advisory-until-close)

- stay (28): the base skills above with in-layer consumers dominant; the base
  keeps serving while the receiving layer proves itself in shadow.
- move-to-craft-bundle (7): the five 0.9.3 craft books plus doctrines
  (destination `.opencode/craft`, landed 0.9.3) and the two 0.9.2 zenith
  controls (destination `.opencode/zenith`, landed 0.9.2). The move is
  recorded from landed evidence, never re-promised.
- stay-shared (8): the `vs-*` adapters bridging base skills to leader layers;
  shared during shadow, cut over only per slice after parity.
- retire (0): no item meets the shutdown gate. DECIDED: retire-share=0 —
  evidence: the live recomputation above shows the smallest consumer count is
  min-consumers=3 (`vs-golden-equipment`, `vs-zn-refresh-guard`), so the
  zero-consumer condition holds for no item. The retire share is therefore
  zero on this evidence; a later inventory that finds a true zero-consumer
  item re-opens it. Nothing is promised early: all numbers stay
  advisory-until-close.

FBLD-16 is honored: every number above is advisory until close with proof;
promise nothing early.
