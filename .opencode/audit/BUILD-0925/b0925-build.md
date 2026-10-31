# b0925-build — LD-25 guardrail packs with acceptance and adversarial proof (wave 1 of 10)

Lane: build-release (AUTO-0.9-FULL 0.9.25, twenty-fifth of 33; this dispatch covers 0.9.25 ONLY, never 0.9.26)
Node: b0925-build (wave 1 of 10, parallel with r0925-readme-draft; disjoint write targets — this seat owns ONLY the three files below)
Owner: vantrilex-typescript (worker-only; never lead, never dispatch, never declare done)
Doctrine: FULL
Date (UTC): 2026-10-31. Effort: HIGH. No model pin. State files: neither (leader-owned).
Task-dispatcher: Scenario 1 NEW TASK (no 0.9.25 build in flight in this seat). Seat denies the Vanguard playbook (worker-only: never lead, never dispatch, never run any equip playbook) — denial recorded, rule applied minimally (execute directed concern only, no second agent, no playbook run).
May-read: live branch tip `3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f` (base only); V3 LD-25 section lines 5439-5592 (treatment + exit criteria + open questions, carried as data); latest-draft LD-25 + fallback FBLD-25 (conflict/fallback carried, never resolved); repo hand-built guardrails (kill switch, diff-size guard, hook checks — inventory only); `.opencode/audit/BUILD-0925/b0925-branch.md` (base refs only). Census only beyond the three owned files.
Acceptance: all eleven hold per sole-authority latest-draft LD-25 under V3:5439-5592 with fallback FBLD-25 V3-gate-text-wins — (1) acceptance contract with declared threats + innocent set + false-alarm budget, over-budget REJECTED; (2) every pack a named failure mode, fail-closed above the low tier; (3) override story recorded before need; (4) freshness visible at load with expirable alert; (5) one hand-built guardrail (diff-size guard DSG-01) productized through FULL acceptance as the system proof; (6) external-access pattern with channel table + succession + health check + teaching book, two model components accepted; (7) same-name lookalike refused by name with recorded proof; (8) simulated failure proves the declared mode; (9) unproductized hand-built guardrails stay MANUAL; (10) zero invented installs; (11) FBLD-25 carried verbatim.

## S1. Base proof + holder routing (primary HEAD and local main never moved, dirt untouched, no push)

- `git rev-parse --verify refs/heads/wt/0.9.25-guardrail-packs` (primary seat, pre-work) — EXIT:0 — FULL `3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f` (directed base, never assumed).
- `git rev-parse HEAD` (primary seat) — EXIT:0 — FULL `2a78995b88f9d0f5b89564397add338794b60c5f` (unmoved throughout; verified pre and post).
- `git rev-parse refs/heads/main` (primary seat) — EXIT:0 — FULL `8828771f46991b1b2b23a44ec913c92f110178f8` (unmoved throughout; verified pre and post).
- Holder: detached holder clone at `C:/Users/omarb/AppData/Local/Temp/opencode/b0925-build-holder` created with `git worktree add <holder> wt/0.9.25-guardrail-packs` — EXIT:0 — holder HEAD `3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f` == base EXACT; primary checkout never checked out here, no commit/push/merge/tag beyond the one directed commit, dirt untouched.
- `git log -1 --format=%H/%P/%s 3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f` — EXIT:0 — `3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f/481508918a647792dc46f90cf86234bca42526a1/docs(0.9.24): fill README 0.9.24 merge/tag refs`.

## S2. Payload inventory (exactly 3 NEW files, nothing else)

| File (in commit) | Bytes | SHA-256 |
|---|---|---|
| `.opencode/guardrails/guardrail-packs.md` | 10135 | `4E452D766D2714A2C5289EB665F0C1F77E23956CBDABEEE5225CC001F68E0A03` |
| `scripts/verify-guardrail-packs.mjs` | 6415 | `CC553856978839748CCABD95336DC9B252BA5B9010D4BD5B8028BC1AD0E4F4DB` |
| `.opencode/audit/BUILD-0925/b0925-build.md` (this ledger) | 8584 | `SELF_SHA=D94510DE1EE1176FA30C9E92576C506FDF117395BB606FAAC8252976D7A3F5BD` |

Self: seal convention — the SELF_SHA above is computed over this file with the self-hash field masked to 64 zeros; masking the final hash back to zeros and hashing reproduces it (verified pre-commit, MATCH quoted in handoff). Post-commit blob identity is proven by `git status --short` showing none of these paths modified after the commit plus `git hash-object` per file equal to the `HEAD:<path>` blob sha (quoted in handoff).
`any` count: zero. No TypeScript file was added or touched, so there is nothing to justify and nothing to escalate.

## S3. Gate outputs (each run separately, exits quoted individually, no `&&` chains)

### G1. `node --check scripts/verify-guardrail-packs.mjs` — EXIT:0 (no output; syntax clean)

### G2. `node scripts/verify-guardrail-packs.mjs` (run) — EXIT:0 PROCEED, 6/6

```text
[guardrail-packs] PASS declared-threats-caught: 3/3 threats BLOCKED (T1,T2,T3)
[guardrail-packs] PASS innocent-set-within-budget: 0 false alarms on 4 innocent cases (budget 1/10)
[guardrail-packs] PASS failure-mode-simulated-closed: simulated fact-source failure -> BLOCK (declared fail-closed-deny)
[guardrail-packs] PASS freshness-alert-fires: fresh review 2026-10-31 silent; fixture review 2026-01-01 alerts
[guardrail-packs] PASS lookalike-refused-by-name: public-registry/diff-size-guard with 0 identity evidence -> REFUSED
[guardrail-packs] PASS succession-tested-by-simulated-primary-failure: primary ok -> served-live; primary failed -> backup served-from-cache
[guardrail-packs] checks: 6 pass, 0 fail, 6 total
[guardrail-packs] VERDICT: PROCEED
```

### G3. Negative control (harness fails closed, not vacuous) — EXIT:1 REJECT with doc moved aside, then restored

```text
[guardrail-packs] FAIL doc-present: cannot read .opencode/guardrails/guardrail-packs.md
[guardrail-packs] checks: 0 pass, 1 fail, 1 total
[guardrail-packs] VERDICT: REJECT
```

Restore + clean re-run — EXIT:0 PROCEED, 6/6, output digest-identical across run and re-run: SHA-256 `7E8D2BD76007D433FD7CC3232622DA9E10C4E644FB82A19A6F08B026B73AC190` both runs.

### G4. `tsc --noEmit` — UNVERIFIED (1 of max 2 live legs; verbatim blocker below, never installed, never invented)

```text
tsc : The term 'tsc' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the
spelling of the name, or if a path was included, verify that the path is correct and try again.
```

```text
TSC_EXIT:False
```

Standing: UNVERIFIED. Exact blocker: no TypeScript compiler on PATH in this seat; installing is forbidden on this lane. Mitigation quoted, not claimed: this change adds zero TypeScript files (two `.md` plus one `.mjs` verifier) and touches none — the covered file `tsconfig.json -> files: [".opencode/plugin/arsenal.ts"]` is byte-identical to base, so no type failure is introduced by this node. A capable seat with `tsc` re-runs `tsc --noEmit` (expected clean) before merge.

### G5. `git status --porcelain=v1` (holder, pre-commit) — exactly the 3 new files

```text
?? .opencode/audit/BUILD-0925/b0925-build.md
?? .opencode/guardrails/guardrail-packs.md
?? scripts/verify-guardrail-packs.mjs
```

### G6. `git log -1 --format=%H/%P/%s` (holder, post-commit) — tip/parent/exact message quoted in handoff

- Parent FULL `3a911f3ed752cb6a4f95ef8128aa40c0f2914e0f`; message exact `feat(0.9.25): LD-25 guardrail packs with acceptance and adversarial proof`; count 1 commit on top of base; tip FULL sha quoted in handoff report (it cannot be embedded here without invalidating the S2 seal); no amend-after-proof, no push.

### G7. Read-back head/tail of all 3 files — MATCH (quoted in handoff)

## S4. FBLD-25 honored (carried verbatim, never resolved)

FBLD-25 — Slot 0.9.25 — Conflict: V3 slot scope versus R3 risk-limit approval proposal — Fallback: V3 gate text wins; capsule stays data — Matches LD-25 — Status FLAGGED, never resolved.

## S5. Must-not-touch compliance

- README.md, README.ar.md untouched (sibling `r0925-readme-draft` owns its file; never read, never written here). No other BUILD-0925 file touched (`b0925-branch.md` read for base refs only). AGENT.md, WORKFLOW.md untouched. `main`, any tag, any other branch untouched. No existing script modified (read-only census). Single-writer held: this seat wrote ONLY the three S2 files. No merge/tag/publish/activation. Repairs: 0 (negative control is diligence, not a failed fix; 0/2 rounds consumed).

Evidence files (in the ONE commit): `.opencode/guardrails/guardrail-packs.md`, `scripts/verify-guardrail-packs.mjs`, `.opencode/audit/BUILD-0925/b0925-build.md` (this file).

Ponytail: FULL — 6/6 harness checks PROCEED on run plus digest-identical re-run, node --check clean, tsc UNVERIFIED with quoted blocker (zero TS files touched).
