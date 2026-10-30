# LD-21 Feedback loop, the outbox (0.9.21)

Lane: build-release (AUTO-0.9-FULL 0.9.21 ONLY, never 0.9.22).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4824-4976` (slot heading `0.9.21 — Feedback loop — the outbox`).
Slot identity: LD-21 — Slot 0.9.21 — Feedback loop, the outbox.
Status: mechanism definition, local-only. Nothing here publishes, sends, or announces.

## 1. What this mechanism is

Field discoveries evaporate when they stay hallway talk. This slot stops
that evaporation by turning discoveries into saved submissions: a
local-first outbox on the user's machine, append-only, exported only by
explicit decision. A discovery that is not recorded dies with the session
that born it; a recorded one can reach whoever can improve the product.

The outbox is local-first as a trust guarantee, not as a storage detail.
Trust is built here: an outbox that never sends anything automatically is
the condition that makes the user send at all; one automatic send, even
once, cancels the whole trust. Shipment is opaque: local-only, nothing
moves automatically ever, however innocent the suggestion looks.

The probe (`verify-feedback-outbox-0921.mjs`) re-runs every claim below;
a claim the probe cannot recompute is prose, not a claim.

## 2. Schema that cannot carry user content

The submission schema is fixed before any submission or export. Its
fields cannot carry user content by construction, not by warning:

- Trace references only, segmented (part references, never full bodies).
- No free-form narrative field that could swallow content: text fields
  carry structural descriptions with enforced maximum lengths, checked
  mechanically, never by instruction.
- A content-carrying attempt against any field is refused structurally.
  The probe submits real user content into a submission field and the
  schema refuses it.

Structural privacy beats written policy: a schema that cannot hold the
content cannot leak it; a policy that says it does not leak can be
forgotten or bypassed. The mechanism is the prevention.

## 3. The six submission kinds

Every submission carries exactly one of six kinds, with its kind fields
and trace references. A submission with no kind is not a submission:

1. `workflow-improvement` — improve an existing workflow step.
2. `workflow-new` — propose a new workflow (enters the category gates as
   a workflow, never accepted on novelty alone).
3. `skill-derivative` — derive-from or propose a skill, naming its origin.
4. `agent-derivative` — derive-from or propose an agent, naming its origin.
5. `defect-report` — defect with its own fields and references (a defect
   filed as a general note is a lost defect).
6. `field-note` — field observation tied to a cited step plus a trace
   reference (an impression without a step is not studied).

Every submission cites the workflow step it refers to: this step
specifically, with this effect specifically — never a general impression
of the whole workflow. A submission without a cited step is general, and
a general submission fixes no step.

## 4. Append-only file, payloads, no silent edit

The outbox file is append-only: submissions are appended, never deleted,
never silently edited. Submission history stays reviewable. Correcting an
earlier submission means a new submission pointing at it, never a silent
edit of the stored bytes. A silent edit voids the history.

Each submission is a payload with its schema, its fields, its kind, and
its trace references. No payload without a kind and without references.
The payload carries its kind so the harvest can read it; the harvest
never classifies what the source left unclassified.

## 5. Quarantine: visible hold, user decides

Anything matching a secret pattern or an absolute path is quarantined
locally and shown to the user. Quarantine is neither silent deletion nor
hidden sending: the user sees the held item and decides; nothing moves
without the user's knowledge and consent. A held item invisible to the
user is deception; a silently deleted held item is a submission destroyed
in the name of protecting it.

The exporter check reuses the index and category tools for sensitive
content, never isolated one-off tools built from scratch. Reused tools
stay consistent with the category; divergent tools are a gap.

A held item stays held and visible until the user decides. Silent
retirement of a held item is silent deletion, however long the wait.

## 6. Manual export by bundles, per-bundle approval, no standing share

Export in this version is manual by bundles only: bundles are prepared,
shown, and approved bundle by bundle. No export without a bundle
approval; no standing general approval that opens a permanent door. An
old approval never extends to a new bundle, however similar the two
bundles look. There is no permanent-share setting in this version.

The mechanical rule is proven by attempt: an export attempt without a
bundle approval is run for real and fails for real. A rule enforced only
by instruction is not mechanical.

Every export carries the submissions licensing term beside the exporter,
so each exported bundle has its stated basis. Export without the term is
export without a stated basis, even when the bundle looks innocent.

## 7. Dedup at the source

Same topic plus same operation plus same anchor merges into one
submission before reaching the harvest. Duplicates without merging
consume study time; merging late never repays time already lost. Merging
at the source keeps the harvest studying topics, not copies.

## 8. Project-id blocklist (management is an open question)

A blocklist setting surface protects user project identifiers from
appearing in submissions. How it is managed without becoming a burden is
carried OPEN (see section 10, Q1). The safe default holds regardless:
on doubt, the identifier is withheld, never included.

## 9. Self-repair channel

The outbox is the mandatory log channel of self-repair: no overlay
without writing to the outbox. The outbox here is the channel, not a
suggestion box. Every overlay write is itself a submission of one of the
six kinds, quarantined and exported under the same rules.

## 10. Inspectable result state and close rule

The result is an inspectable state: a sensitive submission is held and
shown, never silently deleted and never sent; a duplicate is merged; an
export without approval is mechanically impossible.

Closure needs all three together: visible quarantine, duplicate merging,
and mechanical prevention of export without approval. Any one missing
keeps the slot open.

## 11. What lands

- Append-only outbox file, payloads, quarantine, export, under a fixed
  six-kind submission schema with trace references, never user content.
- Exporter check that holds secret patterns and absolute paths locally
  and shows them, reusing index/category tools.
- Manual export by bundles with per-bundle approval, attached licensing
  term, no standing share, opaque local-only shipment.
- Source dedup on topic plus operation plus anchor.
- Text fields bounded by maximum lengths with structural description.
- Project-id blocklist surface with deny-on-doubt default.
- Self-repair overlay channel through the outbox.
- Measurement scope in this version is submissions only; any wider
  measurement needs a separate ruling, never an implicit extension.

## 12. Open questions V3:4934-4939 — all six CARRIED OPEN with safe defaults

None of the six is decided here. Each is recorded OPEN with the exact
V3 question and the safe default that holds until a later ruling. The
probe checks that all six are recorded OPEN and that the defaults hold.

- Q1 (V3:4934) OPEN: project-id blocklist management without burden.
  Safe default: deny-on-doubt — identifiers are withheld until allowed.
- Q2 (V3:4935) OPEN: quarantine display that decides fast without noise
  or habituation. Safe default: held stays visible until decided; never
  auto-cleared, never auto-sent.
- Q3 (V3:4936) OPEN: over-long structured descriptions (split vs refuse
  vs reclassify). Safe default: refuse-and-ask — over-limit text is
  refused with its limit named, never silently truncated, never absorbed.
- Q4 (V3:4937) OPEN: fate of undecided held items (retire, by whom).
  Safe default: held-visible — no silent retirement by any party.
- Q5 (V3:4938) OPEN: completeness proof that the schema carries no user
  content (all-fields audit vs attempt tests, which bar). Safe default:
  both legs required before any wider claim — field audit plus live
  content-carrying attempts, and no content-carrying claim until both pass.
- Q6 (V3:4939) OPEN: long-trace segmented references (split vs shorten,
  staying precise). Safe default: precision-kept — a reference that loses
  its step anchor is refused rather than shortened into vagueness.

## 13. Exit criteria V3:4928-4933 — all six COVERED by the probe

- E1 (V3:4928): secret-pattern or absolute-path submission held locally,
  shown, never silently deleted, never sent — probe
  `quarantine-visible-no-silent-drop`, `no-silent-delete-no-silent-send`.
- E2 (V3:4929): source dedup merges same topic/operation/anchor before
  the harvest — probe `dedup-at-source`.
- E3 (V3:4930): export without bundle approval mechanically impossible,
  proven by a real failed attempt — probe
  `per-bundle-approval-mechanical`.
- E4 (V3:4931): user content attempted into a submission field refused by
  the schema structurally — probe `schema-cannot-carry-content`.
- E5 (V3:4932): one readable submission per kind, six total, with trace
  references and a cited step — probe `six-kinds-present`,
  `step-citation-required`.
- E6 (V3:4933): no standing share, no automatic send on any path —
  probe `no-standing-share`, `opaque-shipment-local-only`.

## 14. Fallback carried

FBLD-21 — Slot 0.9.21 — Conflict: V3 slot scope versus R2 SEO-page generation pressure — Fallback: local-only, never published — Matches LD-21 — Status FLAGGED, never resolved.

This slot builds no page, generates no publishable artifact, and sends
nothing anywhere. The R2 generation pressure is carried as the flagged
conflict and is never resolved here: precedence goes to the fallback
(local-only, never published).

LD-21 carried verbatim: LD-21 — Slot 0.9.21 — Feedback loop, the outbox — Treatment: full V3 treatment under heading at (source AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4824), carried as data — Conflict FLAGGED: V3 slot scope versus R2 SEO-page generation pressure — Fallback LD-21: local-only, never published — Not resolved.

## 15. Install honesty

install_cmd: null. Verification: unverified — this mechanism cites no
registry component and proves no install path, so there is nothing to
install and no command to give. No fetched toolchain, no added package,
zero dependencies (node standard library only).
