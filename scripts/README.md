# Scripts

One line per script. Purpose, invocation, and CI status.

## Verifiers (node scripts/verify-*.mjs)

| Script | Purpose | CI |
|---|---|---|
| `verify-registry.mjs` | Registry integrity (schema, counts, install commands, orphans) | Yes |
| `verify-skills.mjs` | Skill format gate (frontmatter, headings, placeholders) | Yes |
| `verify-catalog.mjs` | Catalog honesty (commands, selections, phases, pin coverage) | Yes |
| `verify-conformance-0917.mjs` | Conformance checks | No |
| `verify-eval-harness.mjs` | Eval harness verification | No |
| `verify-eval-packs.mjs` | Eval pack verification | No |
| `verify-foundation-replacement.mjs` | Foundation replacement verification | No |
| `verify-gap-register.mjs` | Gap register verification | No |
| `verify-guardrail-packs.mjs` | Guardrail pack verification | No |
| `verify-knowledge-packs.mjs` | Knowledge pack verification | No |
| `verify-leader-craft.mjs` | Leader craft verification | No |
| `verify-professional-rag.mjs` | Professional RAG verification | No |
| `verify-smart-compact.mjs` | Smart compact verification | No |
| `verify-spawning-0918.mjs` | Spawning verification | No |
| `verify-zenith-control.mjs` | Zenith control verification | No |

## Generators

| Script | Purpose | CI |
|---|---|---|
| `generate-catalog-json.mjs` | Regenerate catalog.json + per-kind _index.md | Yes (--check) |

## Orchestration / probes

| Script | Purpose |
|---|---|
| `run-battery.mjs` | Canonical verification battery |
| `preflight-system-doctor.mjs` | Environment health check |
| `check-forvanzen.mjs` | For-vanzen gate check |
| `d4-depth-proof.mjs` | Depth-4 proof (T1-T7) |
| `d33-depth-proof.mjs` | Depth-3 proof |
| `probe-seat-deny.mjs` | Seat-deny overlay probe |
| `probe-kill-switch.mjs` | Kill-switch probe |
| `probe-dispatch-sentinel.mjs` | Dispatch sentinel probe |
| `probe-model-record.mjs` | Model-choice recorder probe |
| `probe-identity-misaddressed.mjs` | Identity misaddressed probe |
| `probe-identity-roundtrip.mjs` | Identity roundtrip probe |
| `zenith-refresh-guard.mjs` | Refresh guard (diff → tasks) |
| `switch-facet.mjs` | Facet switching mechanism |
| `approval-interlock.mjs` | Destructive-action approval |
| `self-publish.mjs` | Self-publish helper |
| `dual-run-check.mjs` | Dual-run check |
| `validate-capsule.mjs` | Capsule validation |
| `spawning-constitution-0918.mjs` | Spawning constitution |
| `backfill-publish.mjs` | Backfill publish |
| `auto-publish.sh` | Auto-publish workflow (shell) |
| `dispatch-worktrees.sh` | Worktree dispatch (shell) |
| `merge-worktrees.sh` | Worktree merge (shell) |
| `migrate-to-opencode-v2.sh` | V1→V2 migration (shell) |
| `orchestrate-stage.sh` | Stage orchestration (shell) |
| `record-decision.sh` | Decision recording (shell) |
| `release.sh` | Release helper (shell) |
| `setup-git-hooks.sh` | Git hook setup (shell) |
| `teardown-stage.sh` | Stage teardown (shell) |
