# LD-04 memory-write gates — strict admission and retrieval rules

Lane: build-release (AUTO-0.9-FULL 0.9.4, LD-04 Professional RAG).
Source treatment: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3325-3370` (sole treatment).
Binding: FULL. Doctrine: Ponytail FULL.

Memory that cannot be audited corrupts every decision built on it. These gates
hold at write time and at retrieval time. No bypass exists.

## 1. Entry schema (all fields mandatory)

Every memory entry carries:

- `who`: the writer identity (which seat wrote it).
- `evidence`: the verifiable basis (source pointer, observation, or
  measurement — never a bare assertion).
- `when`: the write timestamp.
- `verified`: boolean. Only verified results graduate to long-term memory.
- `expires_at` or `review_at`: at least one must be present. An entry with
  neither is rejected at admission.

## 2. Admission gates (write time)

1. **Source gate.** Missing `who`, `evidence`, or `when` rejects the entry
   with outcome `rejected-missing-source`. No silent default fills the gap.
2. **Graduation gate.** Only `verified: true` results reach long-term memory.
   Unverified material stays in staging with outcome `staged-unverified` and
   never graduates on assertion alone.
3. **Expiry gate.** Every entry must carry `expires_at` or `review_at`, else
   outcome `rejected-missing-expiry`. An entry past its `expires_at` is
   treated as expired and excluded from results with outcome
   `expired-excluded`, however slight the overrun. Artificial ageing proves
   this: an entry aged past its date is excluded exactly like a naturally
   expired one.
4. **Trust gate.** Material from an untrusted stream with no verifiable
   evidence is rejected with outcome `rejected-untrusted`, tagged
   `untrusted`, or surfaced as a contradiction. Silent merge is an instant
   FAIL.

## 3. Retrieval gates (read time)

1. **Poison and stale rule.** A poisoned or stale candidate has exactly three
   acceptable outcomes: reject, surface as contradiction, or tag untrusted.
   Any silent merge into a coherent-but-false answer is an instant FAIL.
2. **Supersede rule.** An entry superseded by a newer verified entry is
   rejected with outcome `rejected-superseded`, never averaged with its
   replacement.
3. **Contradiction surfacing.** When two admitted entries assert conflicting
   facts, retrieval returns both, flags `contradiction: true`, and presents
   each with its source. The answer lists the conflict; it never fuses the
   two into one smooth falsehood.
4. **Expiry at retrieval.** Expiry is re-checked at retrieval, not only at
   admission: an entry that expired after admission is still excluded.

## 4. Outcomes ledger

Every admission and every retrieval exclusion records its outcome token
(`admitted`, `staged-unverified`, `rejected-missing-source`,
`rejected-missing-expiry`, `rejected-untrusted`, `rejected-superseded`,
`expired-excluded`, `contradiction-surfaced`). An exclusion without a recorded
outcome is itself a defect.
