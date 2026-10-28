# LD-03 Leader-Craft Build Spec

Lane build-release AUTO-0.9-FULL 0.9.3, node b093-build-land.
Base `49b30440a95bf68a729bd88e7660ae21e90070ed`.
Source V3 slot 0.9.3 at AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3273.

## 1. What lands

Three leader craft books per the six-part spec, the book doctrine, the
golden-equipment doctrine with USED-first payload templates, the Vanguard
doctrinal-outfitter repair, per-leader spawning materials, variable seats
per origin, T12 plus T8 controls, the differentiation gate with its
rejection log, the one-time reclassification audit, the
domain-books-replace-agents rule with the settled language-book example,
and the R2 overlap carried verbatim with nothing installed.

## 2. Six-part spec (binding on all three books)

Every craft book carries in order: identity including explicit
non-duties, instruction pack, equipment policy, context contract,
verification commitments, failure contract. A book missing a part or its
non-duties is refused at admission.

## 3. Prefix law (naming)

The name is Vantrilex for all three leaders. Titles are Blazar, Aether,
Pulsar. Prefixes are `vs-bl-*` for Blazar, `vs-at-*` for Aether, and
`vs-pu-*` for Pulsar. A prefix never marks another leader.

- `vs-bl-build-craft` — Blazar build posture.
- `vs-at-plan-craft` — Aether plan posture.
- `vs-pu-probe-craft` — Pulsar probe posture.
- `vs-book-doctrine` — governs all craft books.
- `vs-golden-equipment` — fits equipment from USED pairs first.

## 4. Variable seats per origin

One pre-made seat per origin, selectable from the side picker. Selecting
a seat carries its model plus its variables into the session. A name
displayed and dropped at runtime is not a selection.

| Origin | Seat file | Model | Variables |
| --- | --- | --- | --- |
| Blazar | .opencode/craft/seats/blazar-seat.md | muse-spark-1.3-contributor via opencode-go, free tier | wave-budget, dispatch-width, verify-depth, anchor-cadence, tool-surface, accept-note |
| Aether | .opencode/craft/seats/aether-seat.md | muse-spark-1.3-contributor via opencode-go, free tier | plan-depth, source-breadth, assumption-cap, t12-scope, evidence-ledger, stop-note |
| Pulsar | .opencode/craft/seats/pulsar-seat.md | muse-spark-1.3-contributor via opencode-go, free tier | probe-budget, hypothesis-cap, cheapest-first, capsule-shape, read-only-scope, stop-note |

## 5. Controls T12 and T8 (encoded)

- T12 (Aether): pre-emption-before-occurrence and the failure story are
  mandatory sections of every mission plan. A plan without both sections
  is refused. Encoded in `vs-at-plan-craft` Procedure step 2 and step 5.
- T8 (review plus acceptance): plan review and build acceptance run in a
  new window with the book and the plan re-read, never from memory of the
  drafting window. A verdict from memory is refused until the fresh
  re-read lands. Encoded in `vs-bl-build-craft` Procedure step 2 and
  step 5, and in `vs-book-doctrine` Procedure step 5.

## 6. Differentiation gate

A definition identical to another except its name is rejected. The gate
compares every candidate book against every other book pairwise and logs
one line per pair. Detail at .opencode/craft/differentiation-gate.md with
the run at .opencode/craft/rejection-log.md.

## 7. Domain books replace agents

No domain side-agent is admitted. A domain proposal lands as a book any
leader opens at need, never as a new roster member. The owner-decided
language-book example stands settled as a book under this rule, per
V3:3286, carried as a plain source label and never reconstructed here.

## 8. R2 overlap (carried verbatim, install nothing)

The R2 9-id company-skill set with conflicts F1-F6 is carried verbatim
at .opencode/craft/r2-overlap-carry.md. Both scopes are carried and
nothing is installed. Registration stays parked with the owner: zero
writes to registry, catalog, lock, or manifest by this node.

## 9. Install honesty

Zero install commands ship in any new file. A missing vector records a
null command with verification unverified, never a guessed command.
