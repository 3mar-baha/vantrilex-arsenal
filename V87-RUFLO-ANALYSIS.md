# V87-RUFLO-ANALYSIS — synthesis dossier (AETHER, for owner approval before filing)

**Source:** `zen-ruflo-recon` scout brief (read-only, ~24 HTTP GETs, `ruvnet/ruflo` @ pushed 2026-10-21); every Ruflo claim below is repo text **fetched** (مثبت as text — runtime behaviour **UNVERIFIED**, no execution permitted). Arsenal counterparts cite our own tree (file paths as verified in the Phase 0/audit records; where provenance is a doc statement I mark it ~تقديري). No code copied, nothing adopted, nothing installed. **File on approval:** `V87-RUFLO-ANALYSIS.md`.

## 1 — Ideas extracted, ranked by value (with WHY)

1. **Policy compiled from prose into enforceable gates** — `GuidanceCompiler` turns `CLAUDE.md` into a typed constitution + shards; `EnforcementGates` deny at the hook boundary (destructive ops, allowlist, diff size, secrets). WHY: the model can forget a rule; a gate cannot. Our biggest governance gap is exactly that our laws are prose. ([guidance README](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/guidance/README.md))
2. **Cryptographic release witness keyed off the commit** — Ed25519 seed = `sha256(commit + ':ruflo-witness/v1')`; per-OS manifests + JSONL history; CI blocks publish on drift/regression. WHY: no private key to leak, and it catches fixed-then-unfixed regressions that unit tests miss. ([verification/README.md](https://github.com/ruvnet/ruflo/blob/main/verification/README.md))
3. **Loop self-throttle (`ContinueGate`)** — budget slope + rework ratio + coherence → `continue | checkpoint | throttle | pause | stop`, defaulting to checkpoint. WHY: runaway loops are the dominant long-session failure. ([guidance README §Continue Gate](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/guidance/README.md))
4. **Memory-write gate + 2/3 quorum** — authority scope, rate limit, TTL/decay, contradiction quarantine. WHY: memory rot is the second dominant failure and is usually unguarded. ([same §MemoryWriteGate](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/guidance/README.md))
5. **Truth anchors outrank memory** — signed external facts override conflicting memory; uncertainty + bitemporal records. WHY: a deterministic tiebreak beats hallucinated contradictions. ([same §Trust and Truth](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/guidance/README.md))
6. **Monotonic privilege reduction on delegation** — delegation may only reduce tools/spend/depth; policy denial cancels dependent work *before* side effects. WHY: a crisp checkable rule for fan-out. ([AGENTS.md:55-58](https://github.com/ruvnet/ruflo/blob/main/AGENTS.md#L55))
7. **Trust gate for the harness's own extensions** — a mod declares its capabilities; `observe` reports, `refuse-risky` blocks unless allow-listed. WHY: plugins are untrusted principals. ([mods README](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-mods/README.md))
8. **Persistent ANN index with a versioned magic header** — snapshots restored in ms; stale/corrupt rejected loudly; timed consolidation. WHY: cold-start search without silent wrong-neighbour corruption. ([memory README §Persistence](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/memory/README.md))
9. **Graceful retrieval degradation** — embedder failure → health flag → FTS5 fallback; RRF+MMR fusion. WHY: retrieval fails open instead of throwing. ([same §Graceful retrieval](https://github.com/ruvnet/ruflo/blob/main/v3/%40claude-flow/memory/README.md))
10. **Explicit trust tiers per execution substrate** — WASM (no fs/net), managed container, SDK (full trust) with a stated safe default. WHY: forces the trust question into the API. ([ruflo-agent README](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-agent/README.md))
11. **Budget ladder with a hard stop** — 50/75/90/100 % rungs; refuses new subagents at 100 %. WHY: cost as a gate, not a dashboard. ([mods README §Options](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-mods/README.md))
12. **Tool-description audit as a quality gate** — every description must carry "Use when … is wrong because …", ≥80 chars, unique, monotone baseline. WHY: selection quality governed like code. ([verification README §Layer 1](https://github.com/ruvnet/ruflo/blob/main/verification/README.md))
13. **Agent-listing trim measured in tokens** — ~4,000 tokens/request saved on a 69-type catalogue. WHY: rare context-cost optimisation with a number. ([mods README §agentTrim](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-mods/README.md))
14. **MetaHarness — the harness audits harnesses** — readiness/genome/surface scoring, drift vs history, and an `eject` exit ramp. WHY: self-measurement + exit path are unusual. ([metaharness guide](https://github.com/ruvnet/ruflo/blob/main/docs/metaharness-user-guide.md))
15. **Federation PII gate + hop budgets** — 14-type PII policy, trust score, `maxHops: 8`. WHY: concrete testable mechanisms for cross-boundary work. ([README:343-360](https://github.com/ruvnet/ruflo/blob/main/README.md#L343))

## 2 — Counterpart + minimal Arsenal-native adaptation (per idea)

| # | Arsenal counterpart (today) | Minimal adaptation (Arsenal-native) |
|---|---|---|
| 1 | Prose law: `AGENTS.md` hard rules, `AGENT.md`, `WORKFLOW.md`; enforcement partial/detective in `arsenal.ts` (guards, kill switch, diff guard) | **Policy projection:** generate a small typed policy table from the doctrine's hard rules; hook gates consult it (tighten-only). Direct feed to Track B mandate 4 (prompt-coercion immunity). |
| 2 | `AUTO-PUBLISH.log` + CI-evidence gate + asset digest; no witness | **Witness file per release:** `asset sha256 | tag | commit | gate outputs`, key derived from the commit (same derive-from-commit idea); committed under `.opencode/audit/releases/`. Extends the existing gate, no new trust root. |
| 3 | Repair-circuit rules (≤2 rounds → escalate), diff-size guard, 3-strike law; no step-budget gate | **ContinueGate-lite:** node step budget + rework ratio in the state ledger; on breach → checkpoint-and-report (not silent stop). Candidate for Track B. |
| 4 | State files = memory, append-only ledger, evidence discipline, single-writer | **Formalise:** every state-file claim carries an evidence ref; conflicting entries are quarantined (listed, not merged) until ruled. Cheap, doctrine-level. |
| 5 | **م-1 (adopted):** "measured repo reality and its canonical registers prevail" — already our TruthResolver in words | **Encode the precedence table** (git/gates/registers > state memory > plan text) in the doctrine + cite it in intake checks. |
| 6 | `subagent_depth=1`, per-agent permission blocks, D3 scout boundaries | **Invariant line in the doctrine** + an assertion in the agent-config check: delegation may only reduce. |
| 7 | Factory admission path (skill-maker → shadow → polish → catalog) + allow-all pack | **Capability manifest per kit component** (what it may do) with an observe-mode first; feeds §4.2 factory verification. Schema change — Track B candidate. |
| 8 | None (no vector memory); HNSW plan blocked on Q-13 | Adopt the **versioned-index + loud-reject** pattern when the offloader lands. Parked with the context machinery. |
| 9 | None | Same parked context machinery; the fallback-health pattern is recorded for that design. |
| 10 | In-process plugin hooks; kit components run as CLI; external MCP servers | **Trust-tier table** in the doctrine: in-process hooks > repo scripts > external servers; each surface states its trust level. Cheap. |
| 11 | Model-effort law (free tiers) + effort arrangement; no runtime cost stop | N/A without token accounting; note as a Track B candidate alongside the context machinery. |
| 12 | `verify-skills` (10 checks: headings, descriptions...), command contract **prompt-only** (audit L13-08-042) | **Extend the description check to commands/tools** (trigger phrase, length, uniqueness) — closes an open audit gap with an idea we already half-own. |
| 13 | 27 agents + 37 skills listing cost (blueprint's inverted index, ق-4) | **Measure listing tokens** as a baseline; keep the catalog index plan as the fix. |
| 14 | Verification battery + §4.2 factory tooling (Q-22: structural gate) | Fold **readiness scoring + drift-vs-history** into the §4.2 factory-verification skill/agent; `eject` = documented exit/deinstall path. |
| 15 | None (no networked agents); depth=1 already bounds hops | Reject the federation now; keep `maxHops` as the mental model for depth. |

## 3 — Ideas to REJECT (with reasons)

- **Tool-count arms race** (314–333 MCP tools, 47 plugins): context cost, selection error and doc drift scale faster than capability — our lean kit is the counter-position.
- **Multiple canonical names/paths in flight** (`ruflo` vs `claude-flow`; plugin-lite vs CLI-full): we fought exactly this (singular/plural splits); one enforced entry only.
- **`|| true` build/lint scripts** and a `dev` script pointing at an absent directory: fail-open by construction — our law is fail-closed (a check that cannot run is a failed check).
- **Alpha vector-DB dependencies on the core path** (`agentdb@^3.0.0-alpha`, floating ranges, two lockfiles): violates our zero-dependency posture.
- **Swarm vocabulary without an executor** ("100+ agents", queen/Raft/Byzantine): the repo itself says coordination records write no code — theatre for a plugin-scale system.
- **Treating plugins as trusted code**: we admit through the factory and gate policy; untrusted by default.
- **Auto-promoting learned rules** without independent review: violates our approval gates (D5) and the Guide's role.
- **`--dangerously-skip-permissions`** as a setup step: rejected outright against our security posture.
- **Self-modifying governance surfaces** (rule optimiser, evolution pipeline): owner-approval gates stand; no self-amendment.
- **Federation / hosted relay**: no networked-agent scope; out of the Arsenal's current architecture.

---

**Status:** dossier delivered per §6 — **awaiting your approval before filing** (`V87-RUFLO-ANALYSIS.md`). Adaptations #1, #2, #6, #15 and #12 are the ones I recommend carrying into Track B's design queue; the rest are parked or rejected as shown. **Aether stops here** — no file written, no builder moved.
