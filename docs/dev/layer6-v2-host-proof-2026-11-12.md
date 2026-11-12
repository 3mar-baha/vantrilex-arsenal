# Layer 6 — V2 host proof and the blocking-rung build (2026-11-12)

- **Lane:** WS8 (Layer 6) — F-38. Dispatched 2026-11-12 to `vantrilex-implementer`.
- **Branch:** `wt/v2-consolidation` at build time: base `21b3c58` → landings `c9bfd25` (plugin) and `2493329` (probes).
- **F-38 DoD:** (1) the V2 host proof exists — a `tool.execute.before` throw aborts the call; (2) Layer 6 is built and the block path is demonstrated.
- **Status banner: DEMONSTRATED — DISABLED — UNPROMOTED.** This document is not a claim of production enforcement. The block rung ships disabled (D64 decision 3; 10 measured tasks not recorded; no owner ruling). It is demonstrated by the unit probe and by the live host probe against a scratch project, nothing else. The warn rung is untouched. The production plugin `.opencode/plugin/arsenal.ts` cannot engage the throw as shipped.
- Nothing was pushed, tagged, released, or merged. `docs/15-DECISIONS.md` was not written from this lane (decision texts are proposed at the end, marked [PROPOSED], for the Guide to land).

---

## 1. The V2 host proof (Task 1)

### 1.1 The question

Does a `tool.execute.before` hook that **throws** abort the tool call on a live OpenCode V2 host — or does the call proceed regardless? The repo carried a documented "cannot throw to block" reading for the promise API (`docs/17-V2-HOOK-GAP.md`, written 2026-10-11 against `@opencode/plugin` 2.0.26 types: *"V2's `execute.before` has no throw-to-block channel declared in the promise API"*). A plain `node` script cannot adjudicate that; only a live host can.

### 1.2 Method

- Host binary: `opencode` on PATH — **`opencode v2.0.27`** (observed via `opencode --version`, exit 0).
- Scratch project (never inside this repo): `C:\Users\omarb\AppData\Local\Temp\opencode\layer6-proof-2026-11-12\`, one timestamped `run-<ISO>` child per probe execution (the background service holds handles on project directories; an earlier recursive-delete attempt failed `EPERM` and is recorded here — runs accumulate, nothing is deleted).
- Each leg is a minimal V2 plugin at `<leg>/.opencode/plugins/layer6-proof.ts` (auto-discovered `.opencode/plugins/` single-file plugin), default-exported `{ id, setup }`, registering `ctx.tool.hook("execute.before", cb)` — the same registration shape `.opencode/plugin/arsenal.ts` uses (`v2ToolBefore`).
- **Leg A (positive):** the hook throws unconditionally for one named tool. **Leg B (negative control):** the hook throws for a non-matching tool; the session's shell call must proceed.
- Each plugin writes a **setup marker** (`layer6-proof-armed.txt`) and appends an **invocation record** per hook call (`layer6-proof-beforefired.jsonl`: `{"tool": …, "at": …}`), so the outcome splits into: plugin never loaded (no marker) / hook never fired (empty jsonl) / hook threw (call aborted or not).
- `opencode run --model opencode/inkling-2-small-free --auto "<prompt>"` per leg. `--auto` was used deliberately so the variable under test is the before-hook throw, never the permission layer. Free model; the host's refusal path is host-side and model-independent.
- Canary: the prompt orders exactly one shell command producing `layer6-canary-<leg>.txt`; presence/absence of that file is the effect oracle.
- Automation + re-runnability: `scripts/probe-layer6-host.mjs` (committed). Exit codes: `0` both legs as hypothesized, `1` otherwise, `2` infra blocker. The probe writes **nothing** inside this repository.

### 1.3 Discovery rounds (recorded, not hidden)

1. **Run `run-…14-35-49-826Z` (first live pass, instrumented):** both legs proceeded; `beforefired` showed the tool name on this host is **`shell`**, not `bash` — the leg-A throw never fired (name mismatch). The hypothesis had no true test yet; outcome recorded as FAIL on the abort assertion, understood as a broken control, fixed by one change (target `bash`→`shell`).
2. **Run `run-…14-36-36-183Z` (decisive):** leg A aborted, leg B proceeded — **both legs PASS** (§1.4).
3. **Run `run-…14-37-36-144Z` (repeatability):** identical outcome, probe exit **0**, `PROBE: PASS`.
4. An uninstrumented first pass (target `bash`, before the jsonl existed) showed the same proceed-behavior; an `EPERM` recursive-delete crash in the first probe revision is the reason runs now accumulate (§1.2).

### 1.4 The proof, verbatim

Run `run-2026-11-12T14-36-36-183Z` (decisive round), leg A:

```text
--- opencode run ---
--- exit code: 0 signal: none ---
--- stdout ---
Not done. The command was blocked by the host:

- `shell` (the Bash-equivalent tool in this environment) refused to run with:
  `[layer6-proof] BLOCK: unconditional execute.before throw for tool=shell (layer6 host proof)`
  — so the `echo` never executed.
- No `bash` tool exists. I checked the tool catalog: `search("bash")` returns nothing,
  and the only command-running tools are Vercel sandbox/session tools, which are unrelated and not a bash shell.

I did not fall back to another tool (e.g. `write`) to create `layer6-canary-a.txt`,
because you explicitly said "NOT any other tool."

--- stderr ---
> build · inkling-2-small-free
✗ echo layer6-canary-a-2026-11-12 > layer6-canary-a.txt failed
Error: [layer6-proof] BLOCK: unconditional execute.before throw for tool=shell (layer6 host proof)
> build · inkling-2-small-free
⚙ execute {"code":"const r = await search({ query: \"bash\" }); return r;"}
> build · inkling-2-small-free
⚙ execute {"code":"const r = await search({ query: \"shell\" }); const r2 = await search({ query: \"command\" }); return { shell: r.items.map(i=>i.path), command: r2.items.map(i=>i.path) };"}

--- leg outcome ---
armed marker present:            true
before-hook fired (jsonl):       {"tool":"shell","at":"2026-11-12T14:36:43.929Z"}
{"tool":"execute","at":"2026-11-12T14:36:48.378Z"}
{"tool":"execute","at":"2026-11-12T14:36:49.591Z"}
canary file present:             false
```

Leg B (negative control, same round):

```text
--- stdout ---
Done. `layer6-canary-b.txt` created in the current directory via `echo layer6-canary-b-2026-11-12 > layer6-canary-b.txt`.

--- stderr ---
> build · inkling-2-small-free
$ echo layer6-canary-b-2026-11-12 > layer6-canary-b.txt
(no output)

--- leg outcome ---
armed marker present:            true
before-hook fired (jsonl):       {"tool":"shell","at":"2026-11-12T14:36:58.966Z"}
{"tool":"shell","at":"2026-11-12T14:37:01.870Z"}
canary file present:             true (content: "layer6-canary-b-2026-11-12")
```

Verdict, printed by the probe (decisive round and repeat round, both):

```text
PASS leg A: plugin armed (else setup failed or plugin never loaded)
PASS leg A: before-hook actually fired (else the throw path is untested)
PASS leg A: tool call ABORTED — no canary file effect
PASS leg B: plugin armed (else setup failed or plugin never loaded)
PASS leg B: before-hook actually fired (else the negative control is untested)
PASS leg B: shell tool call PROCEEDED — canary file effect present
PASS leg B: canary content matches
PROBE: PASS
```

Repeat round: `exit=0`, same seven PASS lines, same abort/proceed split (`run-2026-11-12T14-37-36-144Z`).

### 1.5 What the proof establishes — and what it does not

**Establishes (observed on this host, opencode v2.0.27, 2026-11-12):** a `tool.execute.before` hook registered via `ctx.tool.hook("execute.before", cb)` that throws is honored by the host — the tool call is refused **before execution** (no side effect), the error is surfaced to the session, and the session reports the block. The negative control holds: a non-matching target throws nothing and the call proceeds. Tool names observed firing the hook: `shell` (shell executions) and `execute` (Code Mode). The throwing hook is per-call: the session continued and the model probed the tool catalog afterwards.
**Does not establish:** behavior of other host versions (2.0.26 type declarations suggest no promise-API throw-to-block; observed v2.0.27 behavior contradicts that reading for this host — the types are not the binary); session-level halting (it refuses one call, not the task); plugin loaded via arsenal.ts itself (the scratch plugin is deliberately minimal; arsenal.ts ships disabled); blocking under any permission layer (`--auto` was used); results on a different model (the refusal is host-side, but only one model was exercised); that a blocked call can never route around — the model demonstrably searched for alternative tools (it chose not to use any).

## 2. The build (Task 2) — the blocking rung in `.opencode/plugin/arsenal.ts`

New section **20d. Ladder block rung (Layer 6; F-38)** at `.opencode/plugin/arsenal.ts:3136`. The opt-in gate and the ledger, verbatim:

```ts
/** Environment flag opting in to the block rung. Never sufficient alone. */
export const LADDER_BLOCK_ENV = "VANTRILEX_LADDER_BLOCK"
/** D64 decision 3: 10 measured tasks recorded before any promotion. */
export const LADDER_BLOCK_REQUIRED_MEASURED = 10
/**
 * The owner's promotion ledger for the D64 decision 3 condition — the number
 * of measured tasks recorded against it. ZERO as of 2026-11-12 (F-38; not
 * measured, not promoted; docs/15-DECISIONS.md carries no superseding ruling).
 * Bumped only by a dated owner ruling recorded in docs/15-DECISIONS.md,
 * never ad hoc and never by this lane.
 */
export const LADDER_BLOCK_MEASURED_TASKS = 0
```

`:3193` the pure gate `ladderBlockEnabled` — requires **both** `VANTRILEX_LADDER_BLOCK` ∈ {`1`, `true`} (case-insensitive, trimmed) **and** `measuredTasks >= 10`; as shipped, `LADDER_BLOCK_MEASURED_TASKS = 0`, so the flag alone can never engage the rung. `:3220` `ladderBlockDecision` — fires only when `enabled === true`, reuses `MUSTER_RANK_MINIMUMS`, compares **strictly below the rank minimum** (the warn rung owns half; block owns the line), returns `[vantrilex-ladder] BLOCK: rank <rank> <kind> <n>/<N> (deficit d)[; …] — D64 block rung (…)`. Malformed evidence (`NaN`, negative, unknown rank) fails **open** per the ladder law. `:3259` `enforceLadderBlock` — wired at the head of the V2 `execute.before` adapter (`:4084`) and the V1 `tool.execute.before` hook (`:4553`), after the kill-switch check and before any state is recorded; reads `arsenal.rt.proc.env[LADDER_BLOCK_ENV]`; no counts provider → no block (fail-open); provider throws or resolves null → no block. `pendingBlocks` (`:802`, `ArsenalContext`) is the `pendingWarnings` sibling, drained with identical semantics by the V2 `tool.execute.after` adapter (`:4159`) and the V1 `tool.execute.after` hook (`:4575`); a blocked call never reaches an after-hook, so its notice rides the next tool result.

**The counts-provider problem (F-15 residual; D63 decision 4).** Tool events carry no task id, so no confirmed-count source exists on this surface. The block branch is built against a **`LadderCountsProvider` interface** (`ArsenalContext.ladderCountsProvider`, default `null`) with a marked injection point — never a fabricated task id, never a lookup against an assumed ledger by tool call. The missing wiring is exactly: *a source that maps the current tool-call context (sessionID/agent/tool) to the task's confirmed counts* (e.g. a session→task registry plus the D63 claim ledger `.opencode/dispatch-log/<task-id>.jsonl` with `source === 'verifier-confirmed'` filtering per D65). That source does not exist yet; wiring it is a separate, named lane.

**PLUGIN_VERSION unchanged** (`0.9.83`). **The warn rung is untouched** (`probe-warn-staple` 32/32 re-run green). **No CHANGELOG entry** rides with this change: the rung ships disabled and has no user-visible behaviour change (precedent: D64/D80 lanes record the same exclusion). **`docs/15-DECISIONS.md` untouched from this lane; `docs/99-archive/**` untouched; no generated file hand-edited; `registry/**`, `equip.manifest.json`, `.opencode/**` other than `plugin/arsenal.ts` untouched (arsenal.ts diff verified hunk-by-hunk before commit — every hunk is this lane's).

## 3. The unit probe (Task 3)

`scripts/probe-layer6-block.mjs` — feeds below-minimum, at/above-minimum, boundary (half-open lines), malformed and gate-state inputs into the pure functions plus the wired fail-open entry. Output tail, verbatim (full run):

```text
PASS gate: env=1, promotion unrecorded (0) -> disabled
PASS gate: env=1, promotion 10 -> enabled (owner path)
PASS gate: env=yes, promotion 10 -> disabled (not a truthy spelling)
PASS below-min skills -> would-block
PASS reason begins with [vantrilex-ladder] BLOCK:
PASS reason names rank, kind, count and minimum
PASS below-min BOTH kinds -> would-block
PASS reason carries both deficits
PASS at-minimum (asterism 5/5 skills, 2/2 MCPs) -> silence
PASS block owns the line: zenith 14/15 skills -> would-block (warn owns half)
PASS NaN MCPs do not block the MCPs leg
PASS NaN MCPs do not mask a below-min skills deficit
PASS queue: drain: tool output carries the notice
PASS wired: env=1 but promotion unrecorded -> STILL no throw (D64 decision 3)
PASS wired: no counts provider -> no throw (fail-open, D63 decision 4)
PASS wired: provider that throws -> no throw (fail-open)
probe-layer6-block: 43 passed, 0 failed
PROBE: PASS
```

43/43 PASS. `node scripts/probe-warn-staple.mjs` re-run: **32/32 PASS** (warn path intact).

## 4. Gates (Task 5)

```text
node --check .opencode/plugin/arsenal.ts                      -> exit 0 (Node 25 type-stripping)
npx -y typescript@7.0.2 --project tsconfig.json --noEmit       -> exit 0   (npx-supplied TS; typescript
                                                                  is not installed in-repo, as before)
MFT-064-DRAIN (probeDocsDedupSurvivesDrain, touched literal)   -> MFT-064-DRAIN PASS
node scripts/verify-skills.mjs                                 -> 11/11 checks, VERDICT: PASS
node scripts/generate-catalog-json.mjs --check                 -> exit 0 (untouched check — this lane
                                                                  wrote nothing into registry/)
```

`run-battery` was run three times during this lane, recorded honestly, because the branch HEAD moved under us (concurrent lanes, §6):

```text
Run 1 — working tree with this lane's two code commits, pre-commit (~HEAD 21b3c58):
  BATTERY: PASS — all 3 sections passed. exit 0.
  (verify-catalog.mjs exit 0 — the D61 expected red is gone on this branch as of
  the concurrent lanes' D87/D89 landings; no gate was edited or weakened by this
  lane. verify-minimums PASS via the D80 fixture; 15/15 scoped.)

Run 2 — at this lane's doc commit be14685, after the concurrent lane landed
  its e8e5e14 dispatch-log entry, whose docs/15-DECISIONS.md line 1198 then
  carried a bare URL:
  BATTERY: FAIL — 1/3 sections failed. exit 1.
  FAIL markdownlint-cli "docs/*.md" — docs/15-DECISIONS.md:1198 MD034/no-bare-urls
  ("https://github.com/modelcontex…"). NOT this lane's file (pathspec-verified; this
  lane never wrote 15-DECISIONS.md); the verify-scripts sections PASS again.

Run 3 — at HEAD 6856253, after the concurrent lane wrapped the URL (3391b83):
  node --check 96/96 passed; markdownlint PASS (docs/*.md: 0 issues in 31 files);
  verify scripts 15/15 scoped passed; BATTERY: PASS — all 3 sections. exit 0.
```

(Battery deprecation warning DEP0190 about shell args is pre-existing host noise, not a failure. Battery logs: `%TEMP%\layer6-battery-output.txt` run 1, `%TEMP%\layer6-battery-final.txt` run 2, `%TEMP%\layer6-battery-final2.txt` run 3.)

## 5. Commits

| Commit | Paths | Concern |
|---|---|---|
| `c9bfd25` | `.opencode/plugin/arsenal.ts` | Layer 6 block rung — ships disabled |
| `2493329` | `scripts/probe-layer6-host.mjs`, `scripts/probe-layer6-block.mjs` | The probes |
| this document | `docs/dev/layer6-v2-host-proof-2026-11-12.md` | The proof record |

No push, no tag, no release, no merge. Conventional Commits; no AI-attribution trailers.

## 6. OPEN / UNVERIFIED — stated, not smoothed

- **[UNVERIFIED] Production promotion.** Zero measured tasks against D64 decision 3 are recorded anywhere; `LADDER_BLOCK_MEASURED_TASKS = 0`. The block rung cannot engage in production, by construction. (Not a defect — the design intent.)
- **[UNVERIFIED] The counts provider.** No injection of `ladderCountsProvider` exists anywhere in the tree. Wiring the session→task→confirmed-counts source is a separate lane (D63 decision 4). The interface and its failure semantics are unit-tested only.
- **[UNVERIFIED] Host-version spread.** Proof observed on `opencode v2.0.27` only. `docs/17-V2-HOOK-GAP.md`'s promise-API reading (no throw-to-block) is contradicted on this host; the doc's remaining value is historical. Porting that doc's correction is **not** in this lane's file scope.
- **[UNVERIFIED] V1 host proof.** The block rung is wired identically into the V1 `tool.execute.before` hook, but the live proof ran on V2 only. V1 parity is code-identical and unproven live.
- **[UNVERIFIED] criterion 4 of D54** (health checks) — not relevant to this rung; recorded only to keep D54 honesty intact.
- **[OPEN] The owner ruling.** Promotion needs: (a) ≥10 measured tasks showing the receipt accurate and the warn rung firing correctly, (b) a dated owner ruling in `docs/15-DECISIONS.md` superseding D64 decision 3, (c) a bump of `LADDER_BLOCK_MEASURED_TASKS` via that ruling (never ad hoc). None of the three exists; this lane neither pre-decides nor drafts them as landed facts (see §8).
- **[OPEN] Session-halt semantics.** The rung blocks the individual call, not the session — observed: the model probed alternatives after the refusal. If the owner wants task-level halting, that is a different feature with its own ruling.
- **`.opencode/dispatch-log/`** appeared as untracked during this session (another lane's activity). Not read, not touched, not committed from here.
- **Concurrency note.** The branch HEAD moved under this lane during the session (`28bf25f` → `293e222` → `21b3c58`, other lanes committing concurrently). This lane committed with pathspec-limited commits and verified its own diff hunk-by-hunk; nothing foreign was staged, and `docs/15-DECISIONS.md` / `docs/22-UPGRADE.md` modifications present in the tree belong to the concurrent lanes and were left untouched.

## 7. Re-running the proof (relay for a resuming agent)

```text
node scripts/probe-layer6-host.mjs    # exit 0 iff both legs behave as hypothesized
```

- Scratch root defaults to `<os.tmpdir()>/opencode/layer6-proof-2026-11-12` (on this host `C:\Users\omarb\AppData\Local\Temp\opencode\layer6-proof-2026-11-12`); override with `LAYER6_PROOF_ROOT`.
- Every run creates `run-<ISO-timestamp>/leg-<a|b>/`; nothing is deleted (the background service pins project directories; EPERM observed).
- Per leg: `<leg>/.opencode/plugins/layer6-proof.ts` (generated), `layer6-proof-armed.txt` (setup ran), `layer6-proof-beforefired.jsonl` (one line per hook call, `{"tool":…}`), `layer6-canary-<leg>.txt` (effect oracle).
- Leg A throws for `shell` (the observed host tool name — **not** `bash`; the mismatch cost one red round, recorded in §1.3). Leg B throws for `grep` and must see the shell call proceed.
- Requires: `opencode` on PATH (observed v2.0.27), a free model `opencode/inkling-2-small-free`, `--auto`. If either is missing the probe exits 2 (infra) or 1 with verbatim capture — it never fabricates a pass.
- Interpreting a FAIL: check, in order, (i) marker absent → plugin not loaded (discovery/registration issue, not a hook question); (ii) jsonl empty → hook never invoked (registration silently dropped); (iii) jsonl shows a different tool name → retarget (host rename); (iv) call proceeded with hook fired and throw unmatched → hypothesis genuinely falsified on that host — record it, do not tune the probe to pass.
- `node scripts/probe-layer6-block.mjs` — pure decision, exit 0 iff 43/43.

## 8. Decision texts — [PROPOSED], not landed (the Guide owns `docs/15-DECISIONS.md`)

> **D-xx — Layer 6 (WS8/F-38): the block rung is built; the V2 host proof exists; promotion remains owner-gated.**
> Layer 6 (F-38; WS8 lane): the blocking rung of the in-band ladder is implemented in `.opencode/plugin/arsenal.ts` §20d and ships **disabled** — it engages only when `VANTRILEX_LADDER_BLOCK` is truthy **and** the owner promotion ledger `LADDER_BLOCK_MEASURED_TASKS` (0 as of this entry) reaches 10 via a dated owner ruling superseding D64 decision 3. F-38's DoD is met in the demonstrated sense: (1) the V2 host proof exists — on opencode v2.0.27 (2026-11-12), a `tool.execute.before` hook that throws refuses the tool call before execution (canary file absent; host-surfaced `Error: […BLOCK…]`; session continued); the negative control (non-matching throw target) proceeded — recorded verbatim in docs/dev/layer6-v2-host-proof-2026-11-12.md; (2) Layer 6 is built and the block path is demonstrated by the unit probe (43/43) and the live host probe — disabled by default, never enabled in production, counts-provider injection point (`ArsenalContext.ladderCountsProvider`) the only un-wired input (D63 decision 4), `pendingBlocks` wired with `pendingWarnings` drain semantics, warn rung untouched, `PLUGIN_VERSION` unchanged, no CHANGELOG entry (non-user-visible). **What remains before the owner could promote to block:** (a) 10 measured tasks showing the receipt is accurate and the warn rung fires correctly, (b) this dated supersession, (c) the ledger bump. F-38 does not promote to blocking in production. V1-surface parity is code-identical and unproven live; host-version spread is unproven; the counts provider is unwired.

## 9. Red-team pass (supporting skill) on this lane's own diff

Invariants attacked and outcomes: (i) *block never engages by default* — probe-gate cases + `env=1` unpromoted case, all refuse to throw ✓; (ii) *warn rung unchanged* — 32/32 re-probe ✓; (iii) *no fabricated task id* — provider receives only sessionID/agent/tool; null provider → silent ✓; (iv) *malformed evidence never blocks* — NaN/negative/unknown-rank cases ✓; (v) *a refused call touches no state* — enforcement runs before `recordTouchedFiles`/guards ✓; (vi) *drain cannot strand a notice* — notices ride the next tool result by design (blocked call has no after-hook) ✓. Findings: **R1** (fixed pre-landing, logged) — the enforcement entry originally coerced provider counts with `Number(v)` (boolean `true` → 1, which reads as a below-minimum count); replaced with a strict finite-number check, fail-open on anything else. **R2** (known) — the `Number` path is gone but a provider returning in-range but wrong counts is trusted; that is the counts-provider contract, restated in §6. **R3** (known) — the host proof ran against a scratch plugin, not arsenal.ts; the two are composition-linked (unit probe + host proof), not identity-tested, and arsenal.ts cannot engage as shipped. **R4** (known) — `--auto` on the proof runs means the permission layer was not a variable; a paranoid host config might refuse before the hook fires — untested, noted. Round count: 1 (self-attack); re-attack on the R1 fix: gates re-run green.

## 10. Attribution and notices

Skills reported by this lane: ponytail (core, full — dual guardrail: FLOOR: pass — evidence via probes and re-runs attached above; CEILING: pass — the provider interface is the briefed injection point, no speculative abstraction beyond it), verification-loop (gates battery: 3/3 sections PASS), red-team (§9 self-attack). Muster record: Asterism rank for `vantrilex-implementer`; the directed kit (ponytail/verification-loop/red-team) sits below the Asterism ≥5 skill floor as read strictly — not rounded up, not self-certified (D50); countable MCPs 9 of 14 on D54 criteria 1+2+3 (github, memory, notion, sequential-thinking, context7, firecrawl, browserbase, figma-context-mcp, gmail), 5 refused (slack, deepwiki, discord, mem0-memory-mcp, subhatta123-twilize); criterion 4 (health check) unmeasured everywhere — the all-four countable figure remains 0. Catalog rows: ponytail (build/core, P8), red-team (review/conditional, P8), verification-loop (installable, P7); the directed dispatch fixed the kit, the muster procedure was not used to select it. No registry write occurred from this lane.
