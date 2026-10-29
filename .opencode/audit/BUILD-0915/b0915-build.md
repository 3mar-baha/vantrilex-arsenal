# b0915-build — LD-15 portable packaging with pinned manifest and matching probe (worker evidence)

Seat: vantrilex-typescript (worker seat) · Lane: build-release (AUTO-0.9-FULL 0.9.15) · Node: b0915-build (wave 1 of 9) · Date (UTC): 2026-10-29

Concern: build the LD-15 portable packaging treatment on the version branch in one sentence — author the portable-manifest spec plus matching probe plus build ledger and land exactly one commit.

Owner: vantrilex-typescript · Effort: HIGH. Single writer: only this node writes under `.opencode/audit/BUILD-0915/` this round (W1; prior node artifact `b0915-branch.md` left untouched and uncommitted).

Task-dispatcher: Scenario 1 NEW TASK (directed node `b0915-build` never dispatched to this seat before; no in-flight task; no 0.9.15 task in flight). Vanguard playbook NOT run from this seat — worker seat denies the skill (worker-only: never lead, never dispatch, never equip); recorded here and the rule applied: execute exactly one directed node, report back. No second lane; no ambiguity (brief names node, branch, parent, message, and the three permitted paths explicitly).

Doctrine: FULL (this node writes code — probe script plus Markdown spec/ledger — under core `ponytail` posture with FLOOR and CEILING below, quoted verbatim from RESEARCH-03.md).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. May-read (read-only, no execution)

- Base: `.opencode/audit/BUILD-0915/b0915-branch.md` — branch `wt/0.9.15-portable-packaging` cut local-only at exactly live `origin/main` tip FULL `bd96ee92cdda829041946971214794dc45b65e65` (0.9.14 merge included), holder `rev-parse` proves `HEAD` at parent before writes. [CITED]
- LD-15: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4033-4102` (slot heading at :4033, eight how-steps at :4057-4065, exit criteria at :4095-4097, open questions key-guardianship + generated-vs-authored at :4099-4101). Read-only requirements, carried never re-derived. [CITED]
- LD-15 slot line: `- LD-15 — Slot 0.9.15 — Portable component packaging, numbering, distribution — Treatment: full V3 treatment under heading at (source AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4033), carried as data — Conflict FLAGGED: V3 slot scope versus R2 null install-path honesty rule — Fallback LD-15: null plus unverified, never invented — Not resolved.` [CITED from `latest-draft-2026-10-27.md:51`]
- FBLD-15: `- FBLD-15 — Slot 0.9.15 — Conflict: V3 slot scope versus R2 null install-path honesty rule — Fallback: null plus unverified, never invented — Matches LD-15 — Status FLAGGED, never resolved.` [CITED verbatim from `fallback-log-2026-10-27.md:27`]
- Kit pattern: `.opencode/plugin/arsenal.ts` read before editing (zero dependencies, mirrored V2 plugin surface, narrowed event types, guards that degrade to SKIPPED). Probe follows it: standard library only (`node:crypto`), `unknown` narrowed at the JSON parse boundary. [CITED]

## 2. Plan inside the node (no mutating call ran before this plan)

1. Holder worktree `b0915-build-holder` bound to `wt/0.9.15-portable-packaging` at parent FULL `bd96ee92cdda829041946971214794dc45b65e65`; primary HEAD untouched.
2. Write exactly two slot files: `portable-manifest-spec.md`, `portable-match-probe.mjs` under `.opencode/audit/BUILD-0915/`.
3. Run `node --check` (expect 0) then `node portable-match-probe.mjs --self-test` twice (expect 0, PASS 5/5, digest-identical); FAIL-first honestly reported, repaired minimally, threshold never weakened.
4. Grep slot files for invented install commands (expect only `install_cmd: null`) and prove zero `.ts` files (tsc N/A carried per brief).
5. Write this ledger `b0915-build.md` with pre-commit evidence (file bytes + SHA-256, exits, probe lines).
6. Land ONE commit on `wt/0.9.15-portable-packaging` with the exact message, containing only the three new files under `.opencode/audit/BUILD-0915/`; record tip FULL in the final report; no push/merge/tag.
7. Remove the holder; report commit SHA + FULL SHAs + digests inline (head+tail).

## 3. Slot coverage (V3 eight how-steps :4057-4065, carried as data)

| # | Step | Where it lands |
|---|------|----------------|
| 1 | Portable manifest defined: component set with constrained pins, single inspectable format | `portable-manifest-spec.md` §1 + probe `makeManifest` / `LD15-MANIFEST-PARSE` |
| 2 | Matching mechanism: same manifest on the production target, gate parity vs originals | `portable-manifest-spec.md` §2 + probe `installOnTarget` |
| 3 | Pin-mismatch rejects fail-closed, no silent swap | `portable-manifest-spec.md` §3 + probe `LD15-MISMATCH-REJECT` (tampered tool pin rejected) |
| 4 | Signed registry publish, install-time verification, unknown-source rejection | `portable-manifest-spec.md` §4 + probe `LD15-SIGNATURE-PRESENCE` (unsigned rejected as unknown-source) |
| 5 | Generated-vs-authored kit-file boundary, generator + inputs documented | `portable-manifest-spec.md` §5 boundary table |
| 6 | Signing keys under control-level axiom, never shared, never in-package | `portable-manifest-spec.md` §6 + probe `SIGNING_NOTE` (demo-only binding) |
| 7 | Per-element gate matching, no blanket claim | `portable-manifest-spec.md` §7 + probe `LD15-PER-ELEMENT-TABLE` 3/3 |
| 8 | Packaging documented as the next slot's hardening vehicle (matching, not rewriting) | `portable-manifest-spec.md` §8 |

Exit criteria V3:4095-4097 COVERED: same set installs from one manifest on the production target with matching gates (E1, probe `INSTALLED` + 3/3 table) + pin mismatch rejected fail-closed without silent swap (E2, probe `REJECTED`). Open questions V3:4099-4101 carried as build content: Q1 key guardianship (`LD15-OPEN-Q1`) + Q2 generated-vs-authored measure (`LD15-OPEN-Q2`), both CARRIED, never resolved here.

## 4. Pre-commit proofs (holder `b0915-build-holder`, every exit quoted)

- `git rev-parse HEAD` → FULL `bd96ee92cdda829041946971214794dc45b65e65`, `H_EXIT:0` — holder at branch tip == parent before writes.
- `git status --porcelain=v1` → only `?? .opencode/audit/BUILD-0915/`, `S_EXIT:0` — holder clean except the new slot dir.
- `node --check .opencode/audit/BUILD-0915/portable-match-probe.mjs` → no output, `CHECK_CODE:0`.
- `node .opencode/audit/BUILD-0915/portable-match-probe.mjs --self-test` run 1 → `PROBE1_CODE:0` with output:
  - `LD15-MANIFEST-PARSE: OK single inspectable format`
  - `LD15-PIN-PRESENCE: 3/3 component+model+tool pins present`
  - `LD15-MISMATCH-REJECT: REJECTED fail-closed (signature-mismatch), no silent swap`
  - `LD15-SIGNATURE-PRESENCE: present+verifies; unknown-source rejected at install time`
  - `LD15-ELEMENT[skill:ask-matt]: pins PRESENT, gate MATCH`
  - `LD15-ELEMENT[agent:vantrilex-guide]: pins PRESENT, gate MATCH`
  - `LD15-ELEMENT[hardware:arsenal-kit-file]: pins PRESENT, gate MATCH`
  - `LD15-PER-ELEMENT-TABLE: RENDERED 3/3 MATCH`
  - `LD15-OPEN-Q1: CARRIED who guards signing keys; control-level axiom applies, unresolved here`
  - `LD15-OPEN-Q2: CARRIED how much of the arsenal kit file is generated vs authored, unresolved here`
  - FBLD-15 verbatim line (see §1)
  - `LD15-DIGEST: 6cafbb476146fb4a5be60a96abeb836d8369fc2940483dacf2abfa3c2430bc5d`
  - `LD15-PROBE: PASS 5/5`
  - `SELFTEST-PASS`
- Run 2 → `PROBE2_CODE:0`, byte-identical output, digest-identical FULL `6cafbb476146fb4a5be60a96abeb836d8369fc2940483dacf2abfa3c2430bc5d`.
- FAIL-first record: no failure occurred. First `node --check` exit `0`, first self-test exit `0` with PASS 5/5. Nothing repaired, threshold never weakened, no guard touched.
- Install-command audit over both slot files: every `install_cmd` occurrence is `install_cmd: null` (sample data + probe fixtures) or the field/rule mention; installer-verb negative grep returned `ZERO_HITS:True` — zero invented install commands. Every component carries `install_cmd: null` with `verification: unverified`.
- Type surface: `TS_COUNT:0` — zero `.ts` files in the slot dir; `TSC_PRESENT:False` (no `tsc` on PATH), so `tsc --noEmit` is N/A carried per brief acceptance (6), never scored as a pass.
- FBLD-15 carried verbatim in spec header + Sources, probe output line, and this ledger §1. R2 null-install overlap honored: null plus unverified, never invented.

Pre-commit file bytes + FULL SHA-256 (content hashes, commit-independent):

- `.opencode/audit/BUILD-0915/portable-match-probe.mjs` | bytes `8350` | sha256 FULL `e471951ee3df708e7e5e376f193045ea56648cdc41f4c989b229db557950caf4`
- `.opencode/audit/BUILD-0915/portable-manifest-spec.md` | bytes `8069` | sha256 FULL `c4a2e91764b025a9acdc1bf74642e1eb272b2bdc4e68affc8b37f64fd50a9f8f`
- This ledger byte count + SHA-256 recorded post-commit in the final report (ledger content fixed at commit time).

## 5. The commit (recorded post-landing; tip FULL in final report)

- Parent FULL `bd96ee92cdda829041946971214794dc45b65e65` (holder `rev-parse HEAD` pre-commit proves tip == parent).
- Exact message: `feat(0.9.15): LD-15 portable packaging with pinned manifest and matching probe`.
- Content: only three new paths under `.opencode/audit/BUILD-0915/` (`portable-manifest-spec.md`, `portable-match-probe.mjs`, `b0915-build.md`); `git status` + `git show --name-only` + `git rev-list --count parent..tip == 1` quoted in the final report.
- No push, no merge, no tag by this node.

## 6. Gates (PASS / FAIL / UNVERIFIED only)

| Gate | Verdict |
|------|---------|
| ONE commit on `wt/0.9.15-portable-packaging`, parent FULL `bd96ee92cdda829041946971214794dc45b65e65`, exact message, only three new files under `.opencode/audit/BUILD-0915/` | PASS (post-landing proofs in final report) |
| `node --check` exit `0` | PASS (`CHECK_CODE:0`) |
| Self-test exit `0` twice digest-identical: parse OK, pins 3/3, mismatch REJECTED, signature present + unknown-source rejected, per-element 3/3 MATCH, SELFTEST-PASS | PASS (`PROBE1_CODE:0`, `PROBE2_CODE:0`, `PASS 5/5`, digest FULL `6cafbb476146fb4a5be60a96abeb836d8369fc2940483dacf2abfa3c2430bc5d`) |
| FBLD-15 carried verbatim; null plus unverified on the R2 overlap; zero invented install commands | PASS (verbatim line in spec + probe + ledger; installer-verb grep zero hits) |
| All eight V3:4057-4065 steps + exit V3:4095-4097 + open questions as build content | PASS (§3 table 1-8, E1/E2, Q1/Q2 CARRIED) |
| Primary HEAD (`wt/0.9.0-zenith` @ `2a78995b…`) never moved; dirt untouched; holder removed after | PASS (post-landing proofs in final report) |
| No push/merge/tag | PASS |
| `tsc --noEmit` | N/A CARRIED — zero `.ts` files in the change (`TS_COUNT:0`) and no `tsc` on PATH (`TSC_PRESENT:False`); nothing to typecheck. Carried per brief acceptance (6), never scored as a pass. |

Zero FAIL. One carried N/A row (tsc) with exact blocker, never argued into a pass.

## 7. Review cycles (cap two; unbounded recursion refused)

- Cycle 1 (correctness): re-read parent FULL, exact message punctuation, three file names, probe thirteen output lines + digest + 5/5 + SELFTEST-PASS, FBLD-15 verbatim, slot table 1-8, E1/E2, Q1/Q2 — all MATCH the brief.
- Cycle 2 (safety): confirm holder-only writes, no `main`/HEAD checkout in primary, no push/merge/tag/force-push, no `AGENT.md`/`WORKFLOW.md`/other-ledger touch, no `registry/catalog.json` or lock touch, no state file touched, no second dispatch, no owner contact, no weakened threshold. Finding: none; no rework. Cap respected — no third cycle.

Rate limits: zero 429/5xx encountered; `circuit-breaker-guard` path armed, not engaged. Every quoted command is re-runnable (`documentation-as-tests`).

## 8. Handoff

- Files left (all under `.opencode/audit/BUILD-0915/` on branch `wt/0.9.15-portable-packaging`): `portable-manifest-spec.md`, `portable-match-probe.mjs`, `b0915-build.md` (this ledger).
- Return path: this ledger plus the final report to the LEADER (commit SHA, FULL SHAs, digests inline head+tail); ruling belongs to the LEADER. Verdict belongs to the LEADER. Stop after landing; report back.

Refusals honored: no push, no merge, no commit beyond the single directed commit, no tag create/push/delete, no force-push, no branch/tag/release delete, no published-history rewrite, no repository settings/secrets/environments/access change, no operation on an unprimed repo, no blind retry, no lead/dispatch/done-declaring, no owner contact, no weakened guard, no invented install/token/approval/hash/exit, no `registry/catalog.json` edit, no generated-Markdown hand-edit beyond this ledger, no AGENT.md/WORKFLOW.md/state-file/other-ledger touch.

Kit awareness: `session-context-primer` (orientation — collapsed here), `vantrilex-doctrine` (governing law: side-agent, single writer, no done-declaring), `circuit-breaker-guard` (armed, not engaged), `documentation-as-tests` (every command re-runnable). No `typescript-lsp` edit (Markdown + probe-JS only; tsc N/A per §6); `knip`/`depcheck` not named by the brief, not run.

— Reported by: vantrilex-typescript, b0915-build · 2026-10-29 (UTC) · evidence only; ruling belongs to the LEADER.

Ponytail: FULL — probe self-test exit 0 twice digest-identical (5/5) plus node --check exit 0 with outputs quoted; FLOOR held (trust-boundary narrowing, fail-closed mismatch/unknown-source rejection paths tested in-probe) and CEILING held (three files only, no abstraction, no option nobody asked for).
