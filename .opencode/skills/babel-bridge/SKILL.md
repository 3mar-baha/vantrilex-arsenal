---
name: babel-bridge
description: Use when intent crosses a vocabulary boundary such as business language to implementation terms, so the translation is written down, checked, and reversible.
---

# Babel Bridge

## Purpose

Build a bridge between two vocabularies that do not share words, and cross it explicitly.
Interpretation of the owner idea (جسر بابل): the classic Babel bridge exists because the
languages disagree on names, not because the ideas fail to correspond. So this skill separates the
two failures that get confused. A term with **no counterpart** on the other side is a genuine
gap, recorded as such. A term with a counterpart under a **different name** is only a translation
problem, and it gets a bridge entry. Most incidents attributed to a vocabulary boundary are the
second kind wearing the first kind's clothes.

## When to Use

- A stakeholder states a requirement in business language and it must become an implementation
  change.
- An implementation term is handed to a stakeholder who does not own that vocabulary.
- The same concept carries different names on the two sides, and each side is confident its name
  is correct.
- A requirement keeps returning misimplemented, and the misimplementation spans a boundary.
- A one-way translation has to be reversed: an incident cause reported upward, or a policy decision
  pushed downward.

## Do NOT use

- As a glossary. A glossary maps words; a bridge maps intent, and the work is proving that the
  intent survives the crossing.
- When the concepts genuinely differ. If the business means something the implementation cannot
  express, that is a modelling problem, and the honest bridge entry says so.
- For one-off translation inside a conversation. Build a bridge when the same crossing will be
  crossed again, and note it when it will not.
- To settle a disagreement about meaning. The bridge records both readings and makes the
  disagreement visible; it does not adjudicate it.
- As a renaming scheme. When two vocabularies can both be used in one surface, the honest fix is
  to support both at the boundary, not to pick a winner.

## Inputs

- The two vocabularies: the source side and the target side, named.
- The intent to cross, stated once, in the source vocabulary, without implementation detail.
- The target-side constructs that could realise it, with their actual constraints.
- The direction of travel, and whether it must be reversible.

### The bridge entry

Every crossing is recorded as one entry, and an entry is refused unless all five parts are present:

| Field | What it holds |
| --- | --- |
| Source term | The word as the source side actually uses it, with the entity it points at. |
| Target construct | The exact construct that realises it, named precisely enough to act on. |
| Lost meaning | What the target cannot carry: nuance, scope, or a hidden assumption. |
| Confirmation | The observable that shows the crossing preserved the intent. |
| Reversal | How to translate a fact back, or `one-way` with the reason. |

## Procedure

1. **Name both sides and the direction.** "Business to implementation" and "implementation to
   business" are different bridges with different failure modes. Build the one that is needed.
2. **Decompose the intent into indivisible claims.** A requirement that bundles two ideas will
   cross as one entity and lose one of them silently. Split first.
3. **Find the counterpart, or admit the gap.** For each claim, either name the target construct
   that carries it, or record a gap. Never choose a construct that merely sounds close; closeness
   of vocabulary is not closeness of meaning.
4. **Write the lost meaning explicitly.** This is the field that earns the bridge its keep. If
   nothing is lost, the terms are the same term and no bridge was needed.
5. **Define the confirmation observable.** The state that shows intent survived: a field value, a
   returned record, a rejected case. Without it, correctness is a matter of opinion.
6. **Build the reversal** before shipping, or record `one-way` with the reason. A bridge that
   cannot carry a fact back cannot carry a failure back, and that is exactly when it is needed.
7. **Run the round trip** on one real case in each direction. Source intent in, confirmation
   observable checked, reversal produced, original intent recovered. Any divergence is a defect in
   the bridge.
8. **Fix at the boundary, not inside.** Where both vocabularies must coexist, adapt at the edge
   and keep the interior in one vocabulary. Adapting everywhere guarantees drift.
9. **Version the bridge** when a term on either side changes meaning, and re-run the round trip. A
   silently reworded term is the most expensive kind of drift, because both sides believe they
   agree.

## Outputs

- One bridge entry per claim: source term, target construct, lost meaning, confirmation, reversal.
- An explicit list of genuine gaps, where the target side cannot express the intent at all.
- A round-trip result from one real case per direction, with divergences called out.
- A record of which side owns each adaptation point at the boundary.

## Failure Modes

- **False equivalence.** Two similar words are mapped to each other and the difference is never
  written down. This is the dominant failure. The lost-meaning field is what catches it; leave it
  blank and false equivalence ships.
- **The gap is disguised as a translation.** No counterpart exists, so a near-enough construct is
   used and the shortfall surfaces later as a bug nobody can trace to the crossing. Record the gap.
- **Direction assumed reversible.** An incident crosses back to the source side and finds no
   representation, so the cause is reported as something the reporter can name and nobody can act on.
- **Bundled intent.** Two claims crossing as one entity lose one without any visible defect.
  Decomposition in step 2 is what makes the loss visible.
- **Reconciliation by conversation.** Two people settle a term in a meeting and neither writes the
   entry. The third crossing reopens the argument.
- **The bridge outgrows the codebase.** Once the same translation is applied in more than two
   places, it belongs in one adapter with tests, not in a table people consult.
