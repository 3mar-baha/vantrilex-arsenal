# b0931-build — LD-31 risk-tiered auto-approval reserve build ledger

Doctrine: FULL
Seat: b0931-build (wave 1 of 9, lane build-release AUTO-0.9-FULL 0.9.31, BLAZAR seat). Owner: vantrilex-typescript.
Task-dispatcher: Scenario 1 NEW TASK (W0 branch verified). No Vanguard equip run from this worker seat — recorded, proceeding with directed node only.
D5 carried: owner overrides direct work but NEVER suppresses gate verdicts.

## F1 branch and commit

- branch: wt/0.9.31-risk-approval
- parent: 3fa1cf885d02f1ae03ea56cb63647f75fdeba4ba
- message: feat(0.9.31): LD-31 risk-tiered auto-approval reserve with clean-record gate
- tip: observed post single-commit via git rev-parse wt/0.9.31-risk-approval and quoted in the dispatch report with its exit code. A committed file cannot embed its own commit hash, so no tip literal is pre-filled here. The report carries the observed tip.

## F2 count and file set

- git rev-list --count parent..branch: 1
- git diff-tree --no-commit-id --name-only -r branch lists exact-3 files:
- .opencode/audit/BUILD-0931/risk-approval-0931.md
- .opencode/audit/BUILD-0931/verify-risk-approval-0931.mjs
- .opencode/audit/BUILD-0931/b0931-build.md

## F3 bytes per file

- risk-approval-0931.md bytes=7956
- verify-risk-approval-0931.mjs bytes=2274
- b0931-build.md ledger-bytes: 3774

## F4 SHA-256 per file

- risk-approval-0931.md sha256=6189f0644277d376cf6955d8163c20147a14e353a84b491b5c53e9f76d653f23
- verify-risk-approval-0931.mjs sha256=24dc653ad671f605faa9c405a8f9b639fb204820c9904bde8f0dad83162e6f04
- b0931-build.md ledger-sha256: 3730216c4646e0c2b27bf2f43b2afd9aedf42ad533f29776fc3011f40062f783
- Recipe: SHA-256 over the ledger file bytes with the ledger-sha256 value blanked, meaning the line reads exactly ledger-sha256: with no value. Verification blanks that line the same way and re-hashes.

## F5 node syntax gate

- node --check .opencode/audit/BUILD-0931/verify-risk-approval-0931.mjs exit 0.

## F6 harness run gate

- node .opencode/audit/BUILD-0931/verify-risk-approval-0931.mjs exit 0 with PROCEED digest=6189f0644277d376cf6955d8163c20147a14e353a84b491b5c53e9f76d653f23.
- The digest equals the spec file SHA-256 in F4.

## F7 tag absent and local only

- git rev-parse --verify refs/tags/v0.9.31 exits 128 with Needed a single revision, absent local.
- git ls-remote origin refs/tags/v0.9.31 returns empty, absent remote.
- No push, no merge, no tag, no publish by this seat.

## F8 HEAD unmoved and zero mutations beyond the commit

- Primary HEAD 2a78995b88f9d0f5b89564397add338794b60c5f before and after. Unmoved.
- Local main 03c077fa117dd1128527c982f7ef92cdc6639a14 before and after. Untouched.
- Holder removed after the ref move. No other version BUILD dir read. AGENT.md, WORKFLOW.md, README.md, README.ar.md, and r0931-readme-draft.md untouched. CHANGELOG.md untouched under the exact-3 scope.
- The single commit is the only mutation.

## F9 seat notes

- Zero installs. Node 25 only, zero dependencies, no install command invented or run.
- tsc --noEmit has no target here: no TypeScript file is touched by this change, so the gate is not applicable. The .mjs harness is gated by node --check in F5.
- Spec carries LD-31 honestly: advisory number, design NOT started, tier formulation DEFERRED with zero tier tables, never-automate list outside every tier, delegation only as policy-pack bundle with kill-switch, low-tier-first sequencing, every auto-close reviewed in the weekly bundle with stop-on-first-deviation, exit criteria plus open questions carried with tier-definitions plus clean-weeks-count plus low-tier-membership carried OPEN, FBLD-31 fallback carried verbatim.

Ponytail: FULL — one commit with exact-3 files, node --check exit 0, harness exit 0 PROCEED with digest, zero installs.
