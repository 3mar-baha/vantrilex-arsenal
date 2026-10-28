# LD-04 Professional RAG — system specification

Lane: build-release (AUTO-0.9-FULL 0.9.4, LD-04 Professional RAG).
Source treatment: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3325-3370` (sole treatment).
Binding: FULL. Doctrine: Ponytail FULL.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Two systems, never mixed

There are two retrieval systems and they are never mixed:

- **Docs system.** Hybrid retrieval over indexed documents with rerank,
  evidence citations, and a graph extension. Answers cite evidence, never an
  anonymous summary.
- **Agent-memory system.** A summary tree with zoom: a high summary that
  expands to detail on demand. No scattered shards: each detail lives in
  exactly one node and is reached only by zooming from its summary.

One system never answers for the other. Docs answer from the index; memory
answers from the tree. The memory-write gates in `memory-gates.md` guard every
write into the tree.

## 2. Docs retrieval: hybrid plus rerank plus citations plus graph

Indexing: each document carries an id, text, section anchor, source pointer,
trust flag, and a relation list naming linked documents.

Retrieval order:

1. **Hybrid score.** Keyword overlap plus tag overlap over the query. No
   embedding service, no external call: the scorer is deterministic and runs
   on local bytes.
2. **Rerank.** Verified sources outrank unverified ones; newer verified
   results outrank superseded ones; expired entries never reach rerank
   because the expiry gate excludes them first.
3. **Graph extension.** After the top hit is chosen, its relation list is
   expanded one hop. Neighbors are cited as graph context, labeled as such,
   never merged into the primary answer.
4. **Citations.** Every answer carries a `Sources:` block naming the exact
   document id plus section anchor. An answer without a citation is a defect.

## 3. T2 marking wrappers on input text

Retrieved content is the largest untrusted stream entering the system. Every
retrieved span is wrapped before it touches reasoning or output:

`[untrusted-retrieved] ... [/untrusted-retrieved]`

Unwrapped retrieved text in an answer is a defect. The wrapper is structural,
not decorative: downstream gates key on it.

## 4. T7 precision-first with critical facts on edges

Retrieval runs precision-first: rank so the known answer is first, not buried.
Answer layout puts critical facts on the edges, never only in the middle:

1. First line: the critical fact (the known-answer sentence).
2. Middle: T2-marked retrieved detail.
3. Edges close: the `Sources:` citation block, then the T13 reminder.

A critical fact appearing only mid-answer fails the T7 check.

## 5. T13 automatic goal and statement reminder

After the retrieved content, every answer appends the goal and statement
reminder verbatim:

`Goal: <goal>. Statement: <statement>.`

The reminder is appended after the retrieved content in every answer. A
missing reminder fails the T13 check.

## 6. Group-ordering proposal to the owner (resource decision, parked)

Candidate groups for this phase: self knowledge (catalog, ledgers, docs),
developer knowledge, platform knowledge. Proposed order: self knowledge first,
because it is local, verifiable, and already indexed; developer knowledge
second; platform knowledge third. This ordering is a resource decision, not a
technical detail, so it is proposed here and decided by the owner. Until the
owner rules, only self knowledge is indexed. Status: PROPOSED, awaiting owner
decision.

## 7. FBLD-04 honored (report-only, never resolved)

FBLD-04 — Slot 0.9.4 — Conflict: V3 slot scope versus R3 CodeRabbit method
proposal (greenfield) — Fallback: report-only citation; no SaaS adoption by
this lane — Status FLAGGED, never resolved. Source:
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:16`.

The R3 CodeRabbit method is cited here report-only. Zero SaaS adoption: no
key, no secret, no account, no network call enters the repo through this lane.
Install vector for any CodeRabbit-adjacent tooling: install: null,
verification: unverified. Nothing plausible-but-wrong is recorded; an
unverified vector is recorded as null plus unverified, never invented.
