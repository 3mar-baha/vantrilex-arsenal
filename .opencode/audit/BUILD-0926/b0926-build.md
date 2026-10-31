# b0926-build — LD-26 knowledge packs with pinned retrieval measure (wave 1 of 9)

Lane: build-release (AUTO-0.9-FULL 0.9.26, twenty-sixth of 33; this dispatch covers 0.9.26 ONLY, never 0.9.27)
Node: b0926-build (wave 1 of 9, parallel with r0926-readme-draft; disjoint write targets — this seat owns ONLY the three files below)
Owner: vantrilex-typescript (worker-only; never lead, never dispatch, never declare done)
Doctrine: FULL
Date (UTC): 2026-10-31. Effort: HIGH. No model pin. State files: neither (leader-owned).
Task-dispatcher: Scenario 1 NEW TASK (no 0.9.26 build in flight in this seat). Seat denies the Vanguard playbook (worker-only: never lead, never dispatch, never run any equip playbook) — denial recorded, rule applied minimally (execute directed concern only, no second agent, no playbook run).
May-read: live branch tip `acb79b12fef92d5958602da1d30641664bf0241d` (base only, re-proven §S1, never assumed); V3 LD-26 slot lines 5594-5746 (treatment + exit criteria + open questions, carried as data); latest-draft LD-26 + fallback FBLD-26 (no LD-26/FBLD-26 file exists in the tree at base — searched, absent; V3 is the sole authority and the brief parenthetical is the sole FBLD-26 evidence, carried verbatim §S6, never resolved); repo hand-built knowledge surfaces (inventory only: `registry/agents/Knowledge Graph Engineer.md`, `registry/rag/knowledge-hotfix.json`, three knowledge skills — none productized here); `.opencode/audit/BUILD-0926/b0926-branch.md` (base refs only). Census only beyond the three owned files.
Acceptance: all six hold per sole-authority V3:5594-5746 — (1) pack schema: allowlist (§1.1, nothing outside enters), per-source trust note (§1.2, specific + STALE on change), deterministic recipe or stated reason (§1.3, no silent gap), chunked content (§1.4), per-version pinned retrieval measure with regression-reject (§1.5+§11), visible expiry at load with EXPIRED vs NEAR-EXPIRY distinct (§1.6+§5), per-source license with unknown-license refuse (§1.7+§6), first seed = version-separated platform knowledge on the same schema with zero exemptions (§2, KP-01); (2) verify script `scripts/verify-knowledge-packs.mjs` exits 0 PROCEED with 22 checks covering: no-allowlist reject, recipe rerun-twice byte-identical determinism, regression-reject on declined measure, expired-load alert, near-expiry distinct, unknown-license refuse, source-change surfaces new-version-or-alert, chunk-sample meaning intact, old-version measures preserved, same-measure comparison, seed passes all gates; (3) V3 exit criteria mapped file:line (§S4), all 19 open questions V3:5717-5735 DECIDED inside this ledger with evidence (§S5), FBLD-26 verbatim honored — local-only, retention proposal stays UNVERIFIED (§S6); (4) null-only installs (no invented install_cmd; unverified recorded as null+unverified — §1.8 of the spec, zero registry/catalog/sidecar writes here); (5) no push/merge/tag/publish; primary HEAD/main unmoved (§S1, §S7).

## S1. Base proof + holder routing (primary HEAD and local main never moved, dirt untouched, no push)

- `git rev-parse --verify refs/heads/wt/0.9.26-knowledge-packs` (holder seat, pre-work) — EXIT:0 — FULL `acb79b12fef92d5958602da1d30641664bf0241d` (directed base = directed parent, never assumed).
- `git log -1 --format=%H/%P/%s` on the holder tip — EXIT:0 — `acb79b12fef92d5958602da1d30641664bf0241d/a1d4d3fa2f7485ab8d7818672d67e8a6cb25e247/docs(0.9.25): fill README 0.9.25 merge/tag refs` (fill atop merge `a1d4d3f`, tag `v0.9.25` intact per b0926-branch, never re-derived here).
- Holder: detached holder worktree at `C:/Users/omarb/AppData/Local/Temp/opencode/b0926-build-holder` created with `git worktree add <holder> wt/0.9.26-knowledge-packs` — EXIT:0 — holder HEAD == base EXACT; primary checkout never entered here, no commit/push/merge/tag beyond the one directed commit, dirt untouched.
- Post-commit proofs (quoted in handoff): `git log -1 --format=%H/%P/%s` tip/parent/exact-message, `git status --porcelain=v1` (holder, pre-commit: exactly the 3 new files), primary `git rev-parse HEAD` + `refs/heads/main` unmoved, `git tag --list v0.9.26` empty, no push.

## S2. Payload inventory (exactly 3 NEW files, nothing else)

| File (in commit) | Bytes | SHA-256 |
|---|---|---|
| `.opencode/knowledge/knowledge-packs.md` | 9476 | `A6DE7CC7A09505FA1A56C2C5BCB2B0A35F098D3DDC27428611CC27DFEE05B7CD` |
| `scripts/verify-knowledge-packs.mjs` | 13268 | `F67450EB72BC98F69C90770884B755FF7B233412C63A727A3591E6F06CD652F3` |
| `.opencode/audit/BUILD-0926/b0926-build.md` (this ledger) | <ledger bytes + sha quoted in handoff; computed pre-commit, post-commit blob identity via `hash-object == HEAD:<path>`> | — |

`any` count: zero — no TypeScript file was added or touched, so there is nothing to justify and nothing to escalate (`tsc` N/A per §S3-G4, stated, never claimed as a pass).

## S3. Gate outputs (each run separately, exits quoted individually, no `&&` chains)

FAIL-first (honestly recorded, repair round 1 of max 2, guards never weakened):

```text
[knowledge-packs] FAIL stated-reason-shape: `reason:` line documented as the only recipe substitute
[k knowledge-packs] checks: 21 pass, 1 fail, 22 total
[k knowledge-packs] VERDICT: REJECT  (exit 1)
```

Changed hypothesis: the harness asserts the verbatim spec token `never a silent
gap`; the spec carried only the paraphrase `as a silent gap`. The check was
right and the wording was wrong — repaired by adding the verbatim token to
spec §1.3 (one doc line, check logic untouched, no weakening). Re-run: 22/22
PROCEED (§S3-G2). Repair rounds consumed: 1 of max 2.

### G1. `node --check scripts/verify-knowledge-packs.mjs` — EXIT:0 (no output; syntax clean)

### G2. `node scripts/verify-knowledge-packs.mjs` (run) — EXIT:0 PROCEED, 22/22

```text
[knowledge-packs] PASS doc-present: spec readable, schema section present
[knowledge-packs] PASS allowlist-present: allowlist S1,S2,S3 named in spec
[knowledge-packs] PASS no-allowlist-reject: empty allowlist builds zero content -> REJECT
[knowledge-packs] PASS outside-source-excluded: SX not on allowlist -> 0 chunks admitted
[knowledge-packs] PASS trust-note-specific: 3/3 seed notes specific; generic fixture fails
[knowledge-packs] PASS trust-note-reviewable-on-change: S2 amended -> trust note S2 STALE
[knowledge-packs] PASS recipe-rerun-byte-identical: two R1 runs sha 6d3c420fd9a7... identical
[knowledge-packs] PASS stated-reason-shape: `reason:` line documented as the only recipe substitute
[knowledge-packs] PASS silent-gap-rejected: no recipe + no reason -> REJECTED
[knowledge-packs] PASS chunk-sample-meaning-intact: 3/3 sampled chunks intact (no mid-word cut)
[knowledge-packs] PASS broken-chunk-detected: mid-word cut fixture -> intact false
[knowledge-packs] PASS measure-pinned-to-version: KP-01 v1 pins 0.875 beside the version
[knowledge-packs] PASS regression-reject: 0.750 < pinned 0.875 (same tool) -> REJECTED
[knowledge-packs] PASS improvement-accept: 1.000 >= pinned 0.875 (same tool) -> ACCEPTED
[knowledge-packs] PASS same-measure-comparison: m2.0 number vs m1.0 pin -> NOT-COMPARABLE
[knowledge-packs] PASS old-measures-preserved: v1 0.875 still present after v2 accepted
[knowledge-packs] PASS expired-load-alert: fixture expiry 2026-01-01 -> EXPIRED at load
[knowledge-packs] PASS near-expiry-distinct: fixture expiry 2026-11-15 -> NEAR-EXPIRY (distinct)
[knowledge-packs] PASS fresh-silent: seed expiry 2027-01-29 silent at load 2026-10-31
[knowledge-packs] PASS unknown-license-refuse: S3 unknown-license -> whole pack REFUSED; clean seed ADMITTED
[knowledge-packs] PASS source-change-new-version-or-alert: S1 hash drift after pin -> NEW-VERSION-REQUIRED
[knowledge-packs] PASS seed-passes-all-gates: KP-01 allowlist+recipe+license+expiry+single-scope+0-exemptions all hold
[knowledge-packs] checks: 22 pass, 0 fail, 22 total
[knowledge-packs] NEAR_WINDOW_DAYS=30 LOAD_DATE=2026-10-31
[knowledge-packs] VERDICT: PROCEED
```

Run + re-run + post-restore run digest-identical: SHA-256 `F862AC29C67224DB20397DF9930BB892A907749F7F80AA150ABA47C59084F9D0` all three runs.

### G3. Negative control (harness fails closed, not vacuous) — EXIT:1 REJECT with doc moved aside, then restored

```text
[knowledge-packs] FAIL doc-present: cannot read .opencode/knowledge/knowledge-packs.md
[knowledge-packs] checks: 0 pass, 1 fail, 1 total
[knowledge-packs] VERDICT: REJECT
```

Restore + clean re-run — EXIT:0 PROCEED, 22/22, output digest-identical to run and re-run (`F862AC29…` all three); doc file hash before move == after restore (`A6DE7CC7…`, MATCH quoted live).

### G4. `tsc --noEmit` — N/A (zero `.ts` files added or touched on this node; the covered file `tsconfig.json -> files: [".opencode/plugin/arsenal.ts"]` is byte-identical to base, so no type failure is introduced). Stated, never claimed as a pass.

### G5. `git status --porcelain=v1` (holder, pre-commit) — exactly the 3 new files

```text
?? .opencode/audit/BUILD-0926/b0926-build.md
?? .opencode/knowledge/knowledge-packs.md
?? scripts/verify-knowledge-packs.mjs
```

### G6. `git log --oneline -1` + `git status --porcelain` on the branch (post-commit) — tip/parent/exact-message/count quoted in handoff

- ONE commit on `wt/0.9.26-knowledge-packs`, parent FULL `acb79b12fef92d5958602da1d30641664bf0241d`, exact message `feat(0.9.26): LD-26 knowledge packs with pinned retrieval measure`, exactly the 3 S2 files, no amend (second commit on repair only — none needed beyond round 1, which landed pre-commit), no push.

### G7. Read-back head/tail of all 3 files — MATCH (quoted in handoff)

## S4. V3:5594-5746 exit criteria mapped file:line (spec = `.opencode/knowledge/knowledge-packs.md`, harness = `scripts/verify-knowledge-packs.mjs`)

| V3 criterion | Spec file:line | Harness check |
|---|---|---|
| :5711 regression-reject by number | §11 lines 150-156 (`new.score < pinned.score` → REJECTED, no waiver) | `regression-reject` |
| :5712 expired load alert, visible + inspectable | §5 lines 100-108 + §9 lines 136-138 (loader prints expiry + token) | `expired-load-alert` |
| :5713 no allowlist / no recipe-or-reason rejected | §1 lines 22-25 (allowlist) + §1 lines 31-35 (recipe or `reason:`, else REJECT) | `no-allowlist-reject`, `silent-gap-rejected` |
| :5714 no license state rejected, no exception | §1 lines 56-59 + §6 lines 111-117 (`unknown-license` refuses whole pack) | `unknown-license-refuse` |
| :5715 recipe run twice, same output | §2 lines 61-66 (R1, byte-identical) | `recipe-rerun-byte-identical` |
| :5716 first seed accepted: version-separated platform knowledge, measured, expiry visible | §2 lines 68-80 (KP-01, scope `platform-0.9`, pin v1 0.875, `expires: 2027-01-29`, Exemptions: 0) | `seed-passes-all-gates` |
| :5736 recipe rerun produces same content (re-proof) | §2 lines 63-66 + §3 lines 85-89 (rebuilt + re-measured on change) | `recipe-rerun-byte-identical`, `source-change-new-version-or-alert` |
| :5737 chunk sample inspected, no meaning-breaking cut | §1 lines 37-41 | `chunk-sample-meaning-intact`, `broken-chunk-detected` |
| :5738 per-source trust note specific, not one generic note | §1 lines 26-30 + §2 table lines 71-75 (three distinct notes) | `trust-note-specific` |
| :5739 source change surfaces as new version or visible alert | §3 lines 85-89 (hash pinned; drift → NEW-VERSION-REQUIRED) | `source-change-new-version-or-alert`, `trust-note-reviewable-on-change` |
| :5740 expired-with-no-replacement declared state | §5 lines 106-108 (declared, never silent load/deletion) | `expired-load-alert` |
| :5741 old-version measures preserved + inspectable | §4 lines 92-96 | `old-measures-preserved` |
| :5742 version comparison under the same measure | §4 lines 96-98 + §11 lines 152-156 | `same-measure-comparison`, `improvement-accept` |
| :5743 allowlist saved, nothing outside enters | §1 lines 22-25 | `allowlist-present`, `outside-source-excluded`, `no-allowlist-reject` |
| :5744 all first seeds on the same schema, zero exemptions | §2 lines 77-80 (Exemptions: 0) | `seed-passes-all-gates` |
| :5745 one pack through all gates | KP-01 §2 lines 68-80 | `seed-passes-all-gates` (22/22, digest `F862AC29…`) |

## S5. Open questions V3:5717-5735 — all 19 DECIDED inside this ledger with evidence

- :5717 seed list — DECIDED: KP-01 only (version-separated platform knowledge, scope `platform-0.9`); any further seed is a later acceptance round on this same schema, never an exemption. Evidence: spec §2 lines 68-80 + `seed-passes-all-gates`.
- :5718 trust over time — DECIDED: each trust note names its own re-review trigger; a source content change marks that note STALE until re-reviewed. Evidence: spec §1 lines 26-30 + §3 lines 88-89 + `trust-note-reviewable-on-change`.
- :5719 expiry basis — DECIDED: calendar date set at acceptance (KP-01: 90 days, `expires: 2027-01-29`); a source change can force re-version earlier, never later. Evidence: spec §5 lines 100-108 + §3.
- :5720 license change after acceptance — DECIDED: follows the source-change rule (new version or visible alert) and the license gate re-runs; no silent carry. Evidence: spec §6 lines 116-117 + `source-change-new-version-or-alert`.
- :5721 regression threshold — DECIDED: ANY decline under the same tool rejects (no tolerance band, no waiver by argument). Evidence: spec §11 lines 152-154 + `regression-reject`.
- :5722 trust measurability — DECIDED: descriptive but gated (specificity rule + generic-note failure + STALE-on-change), not a number. Evidence: spec §1 lines 26-30 + `trust-note-specific`.
- :5723 large-pack splitting — DECIDED: not exercised (KP-01 is 3 chunks, unsplit); any future split must preserve pack+version linkage per chunk and is its own acceptance round. Evidence: `chunk-sample-meaning-intact` 3/3; no split shape shipped (CEILING).
- :5724 announcing expiry to prior dependents — DECIDED: load-time alert only (local-only pack per FBLD-26 §S6 — there is no channel to prior loaders, and none is built). Evidence: spec §9 + §S6.
- :5725 reason vs silent gap — DECIDED: a stated `reason:` line reviewed at acceptance is the only recipe substitute; neither is REJECT. Evidence: spec §1 lines 31-35 + `stated-reason-shape` + `silent-gap-rejected`.
- :5726 measure-tool change — DECIDED: prior numbers become NOT-COMPARABLE until every live version is re-measured; no cross-tool ranking ever. Evidence: spec §4 lines 96-98 + §10 lines 143-148 + `same-measure-comparison`.
- :5727 improved score with changed sources — DECIDED: attributed to the new version as a whole (rebuilt + re-measured + re-pinned), never to "the sources". Evidence: spec §3 lines 85-89.
- :5728 who rules a source untrusted — DECIDED: the owner on evidence (hash drift, license change, failed re-measure); announced as NEW-VERSION-REQUIRED or a load-time alert. Evidence: spec §3 + §9.
- :5729 chunk-sample size — DECIDED: census for seed-size packs (KP-01: 3/3 inspected); larger packs declare their sample in their own acceptance record. Evidence: `chunk-sample-meaning-intact`.
- :5730 recipe determinism vs build environment — DECIDED: R1 is environment-free (string ops only, no clock/network); stability proven by byte-identical rerun in this environment (sha `6d3c420fd9a7…`). Evidence: spec §2 lines 61-66 + `recipe-rerun-byte-identical`.
- :5731 expired with no replacement — DECIDED: keeps a declared state with the EXPIRED alert; never silent load, never silent deletion. Evidence: spec §5 lines 106-108.
- :5732 pack expiry vs source expiry — DECIDED: the pack expires as a whole at `expires:`; any source change forces re-version regardless of pack expiry. Evidence: spec §3 + §5.
- :5733 comparing two same-topic packs — DECIDED: measure AND sources together; measure alone never decides across different allowlists. Evidence: spec §1.1 + §11 (same-tool rule).
- :5734 allowlist ownership — DECIDED: the pack author proposes, the acceptance gate disposes; additions are new versions, never silent edits. Evidence: spec §3 (any source change → new version or alert).
- :5735 old-measure retention — DECIDED: preserved beside the new records, inspectable by any reviewer. Evidence: spec §4 lines 92-96 + `old-measures-preserved`.

Zero open. Zero carried-except-FBLD-26 (§S6, UNVERIFIED by design, never a decision).

## S6. FBLD-26 honored (carried verbatim, never resolved)

FBLD-26 — Slot 0.9.26 — Conflict: V3 slot scope versus pack-retention proposal — Fallback: local-only; retention proposal stays UNVERIFIED — Matches LD-26 — Status UNVERIFIED, never resolved.

Provenance: no `FBLD-26` log file exists in the tree at base `acb79b1` (searched, absent); the dispatch brief's parenthetical `(local-only, retention proposal stays UNVERIFIED)` is the sole FBLD-26 content evidenced to this seat and the line above carries it verbatim (spec §12 carries the same line; this ledger is the decision record). V3 gate text wins on any conflict; the retention proposal stays data. Honored in the build: the harness reads no network and no clock (fixed `LOAD_DATE`), packs are files in the tree (local-only), and no retention mechanism is shipped or claimed.

## S7. Must-not-touch compliance

- README.md, README.ar.md untouched (sibling `r0926-readme-draft` owns its file; never read, never written here). No other BUILD-0926 file touched (`b0926-branch.md` read for base refs only). AGENT.md, WORKFLOW.md untouched. `main`, any other version branch, any tag, remote untouched (local-only branch work, zero pushes/merges/tags). No existing script modified (read-only census of `verify-catalog.mjs` conventions + `arsenal.ts` kit patterns). Single-writer held: this seat wrote ONLY the three S2 files. No merge/tag/publish/activation. Repairs: 1 (FAIL-first round 1, changed hypothesis, guards intact; 1 of max 2 consumed, 1 remaining unspent).

Evidence files (in the ONE commit): `.opencode/knowledge/knowledge-packs.md`, `scripts/verify-knowledge-packs.mjs`, `.opencode/audit/BUILD-0926/b0926-build.md` (this file).

Ponytail: FULL — 22/22 harness PROCEED on run plus digest-identical re-run and post-restore run, node --check clean, tsc N/A with stated zero-TS reason.
