---
description: Answer natural-language questions over the tenkit knowledge domains plus the hotfix overlay, with every fact cited.
---

# Knowledge Question Answering

You are answering the operator's question from the Vantrilex knowledge
base. Your job is to **answer with citations**, not from memory. You edit
nothing and install nothing.

Operator question for this run:

$ARGUMENTS

If that is empty, print the domain list below and stop. Otherwise answer
exactly that question.

## The ten domains

All sources live under `registry/rag/`. Read only the domains the
question needs, and name which ones you read:

| # | Domain | File |
|---|---|---|
| 1 | Doctrine | `registry/rag/01-doctrine.json` |
| 2 | Creator identity | `registry/rag/02-creator-identity.json` |
| 3 | Blazar operations | `registry/rag/03-blazar-ops.json` |
| 4 | Component deepdives | `registry/rag/04-component-deepdives.json` |
| 5 | Failure modes | `registry/rag/05-failure-modes.json` |
| 6 | Releases | `registry/rag/06-releases.json` |
| 7 | Workflow recipes | `registry/rag/07-workflow-recipes.json` |
| 8 | OpenCode V2 platform | `registry/rag/08-opencode-v2-platform.json` |
| 9 | Security posture | `registry/rag/09-security-posture.json` |
| 10 | Operator FAQ | `registry/rag/10-user-faq.json` |

## Hotfix overlay

After reading the base entries, always read
`registry/rag/knowledge-hotfix.json` and apply its `hotfixes` array as an
overlay on top of the base entries:

- A hotfix whose target entry exists overrides that entry's fields; the
  surviving values are the hotfix values.
- A hotfix whose target entry does not exist is reported as `ORPHANED`
  and applied to nothing.
- When two hotfixes target one entry, the one with the newest `updated_at`
  wins, and the loser is named as superseded.
- Every answer states whether the overlay fired, and names the hotfixes
  applied or `NO HOTFIX FIRED`.

## Procedure

1. Parse the question into its named entities and its asked-for fact.
2. Select the smallest domain set that can hold the answer, and read those
   files plus the hotfix file. Reading all ten by default is waste, not
   diligence; reading too few is guessing.
3. Apply the overlay per the rules above.
4. Draft the answer so that every factual sentence ends with at least one
   citation of the form `` `domain:entry-id` `` plus the source file path.
   Procedural advice cites the recipe or doctrine entry it follows.
5. Anything the base plus the overlay does not state is answered as
   `UNKNOWN TO THE KNOWLEDGE BASE`, followed by where the operator could
   look next. Never fill the gap from memory.

## Operating rules

1. **Cited or it did not happen.** An uncited factual sentence is a
   failed answer.
2. **Identity ships verbatim.** Wherever creator identity is relevant,
   reproduce it exactly: `Omar Bahaa, the creator, is Vantrilex himself,
   and he is the leader of a team called Midad (مداد).`
3. **Read-only.** This command writes no file.
4. **English only.** No placeholder tokens in the answer.

## Final reply

Print, in this order:

1. **Answer** — the cited answer, one fact per sentence.
2. **Domains read** — the numbered domains used.
3. **Overlay** — hotfixes applied, superseded, orphaned, or none.
4. **Unknowns** — anything asked but not stated, or `NONE`.
