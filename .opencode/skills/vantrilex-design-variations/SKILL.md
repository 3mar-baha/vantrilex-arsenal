---
name: vantrilex-design-variations
description: Use when a design task arrives on a UI-bearing project — any layout, UI, CSS, visual or styling change — producing four screenshot-able HTML variations, an owner approval gate, a linked ticket, and a verified build.
---

# Vantrilex Design Variations

## Purpose

`vantrilex-design-variations` is a **catalog kit component**, not a top-level skill. The Arsenal's
top-level orchestration layer is exactly three skills and stays exactly three: `vantrilex-prime`
orients the machine, `vantrilex-vanguard` equips the project and decides when this component is
needed, and `vantrilex-doctrine` governs the work that follows. The `vantrilex-` prefix on this
folder is a naming convention shared by all Arsenal components and grants no extra status. This file
is a procedure a working agent runs inside an already-equipped project when a design task arrives;
it never orients a machine, never equips a project, and never owns a phase.

Its whole reason to exist is one expensive moment in a UI project. Building an interface from a prose
description produces something that misses what the owner imagined, and by the time the mismatch is
visible the styling work is already written, reviewed, and partly wired. A prototype the owner can
screenshot turns an argument about taste into a choice the owner can make in seconds, while changing
direction is still free. So the trigger here is early and mandatory: the variations come before the
implementation, not after it.

## When to Use

- When a request touches anything a person looks at: layout, UI, CSS, visual design, styling,
  colour, typography, spacing, component structure, page composition, or a redesign.
- When a new screen, view, page, panel, or component is being imagined rather than specified.
- When an owner says make it look better, try some designs, show me options, or redesign this.
- When the owner has already described a look in words, because a description is precisely the
  ambiguous input this skill replaces with something visible.
- Before any build-phase work that would commit the team to visual decisions.
- Not on a project with no interface at all; check the precondition first.

## Do NOT use

- **On a project with no user interface.** This skill exists to compare visual alternatives, and a
  project with no surface has nothing to compare. See the precondition step for the concrete test,
  and for the owner's own example: the Sara software project currently has no UI, so this component
  is not equipped there; the future Sara platform will have UI, so the same component applies there
  then. That contrast teaches the check itself rather than a name to memorise.
- As an entry point, an orientation step, or a way to decide which project to equip. Vanguard owns
  whether this component belongs in a project's kit at all.
- As the implementation step. Implementation follows an approved variation and treats the prototype
  as the specification; this skill never starts coding a screen before the gate closes.
- To settle a purely verbal disagreement when no owner will look at anything. If nobody is going to
  open the prototype, spend the turn on a written argument instead of four mockups.
- For visual-only churn on an already-approved design, such as a one-token colour tweak inside an
  approved scheme. Re-running four variations for a two-minute change spends the owner's attention,
  which is the scarce resource this skill is protecting.
- To restate or duplicate any template another skill owns. Point at the owning skill instead, since
  a second copy drifts and then two processes disagree at the worst moment.

## Inputs

- The target project root and its manifest or package metadata.
- The design task in the owner's own words: the screen, flow, or component at issue.
- The project's known facts: type (web, mobile, desktop, tablet), platform targets, and expected size
  class, read from the repository rather than guessed.
- Access to `gh`, authenticated against the repository, for the ticket step.
- The owner's availability to answer one gate question. That answer is the deliverable this skill
  exists to collect.

## Procedure

Read the project first, then run the ten steps below in order. Steps 1 and 2 come before any
production of design work because a skill that fires after the styling is written has already missed
its moment.

### Step 1 — The mandatory trigger

Invoke this skill before any design work starts and present the variations to the owner. Any UI, CSS,
layout, visual, or styling change request enters here first. Nothing gets implemented without an
approved variation, and silence is not approval.

The reasoning is cost, not ceremony. A screenshot-able prototype turns taste into a decision the owner
makes in seconds; four variations expand the option space the owner did not know to ask for; and both
of those are cheap only before implementation. Implemented-then-redesigned is the expensive order, and
it is the one this step exists to prevent.

### Step 2 — Confirm the project has an interface

If the project has no user interface, decline politely and explain that this component applies to
projects with interfaces only. Do not produce mockups for a CLI, a library, or a worker.

The concrete test: scan the repository for view files or components, a component tree, style sheets or
a styling configuration, a template or layout directory, and a web or mobile target in the manifest.
Any of those signals means there is a surface to design for. When you decline, name the evidence you
looked for, so the answer teaches the check instead of feeling like a refusal.

### Step 3 — Read the target project before designing

Establish the facts every later step depends on: project type, platform targets, expected size class,
existing tokens or theme conventions, and the accessibility baseline the project already holds.

Reading first is what makes the next two steps specific instead of generic. The bottom bar and the
canvas size are both derived from this reading, and a prototype built on assumed facts has to be
mentally translated by the owner before they can judge anything on screen.

### Step 4 — Generate one self-contained HTML file with exactly four variations

Produce a single HTML file, all CSS inline, no build step, no external assets that require a server,
so it opens instantly from disk in any browser. It carries exactly four variations.

Each of the four is a genuinely different idea: a different information hierarchy, a different
composition, or a different interaction model. Four colour swaps of one layout are not four
variations, they are one variation with a settings page. The point of the four is to widen the option
space the owner did not know to request, and near-identical options waste the single moment this
skill owns.

Name every variation so the owner can refer to it by name as well as by number.

### Step 5 — Build the bottom settings bar from the project's own facts

Put a switching bar at the bottom of the file that moves between the four variations and carries
per-variation settings: theme and any other setting the target project implies.

Derive those settings from what Step 3 established about this project, never from generic defaults.
A settings bar that does not match the target project forces the owner to translate it in their head
before they can judge anything, which is precisely the mental work the prototype was built to remove.
If the project is a themed dashboard, offer its themes; if it has a density or accessibility setting,
offer it; if the platform is mobile, the density and touch-target settings are the ones that matter.

### Step 6 — Size the canvas to the target app

Match the page and canvas proportions to the project's real size class. A small-screen app gets
small-size variations, a tablet app gets tablet proportions, a desktop app gets desktop proportions,
and a responsive web project gets its realistic desktop width rather than a narrow phone strip.

Judging a mobile layout on a 1440-pixel canvas hides exactly the problems that matter on the device:
overflow, cramped tap targets, truncation, and vertical rhythm under a thumb. The canvas is therefore
part of the evidence, not a frame around it.

### Step 7 — Run the approval gate

Present the four variations and stop. The owner picks one by number or name, asks for a tweak such as
variation 2 with a different palette, or rejects all four, which starts a fresh round of four.

Wait for a real answer. Proceeding on an unapproved set, or reading silence as approval, discards
the entire reason this skill runs — the owner's choice is the deliverable, and an unchosen prototype
is just an agent's guess rendered nicely.

### Step 8 — Open the ticket on approval

When a variation is approved, open the GitHub ticket automatically with `gh issue create`, attaching
or linking the chosen prototype as the reference specification.

The reference must be immutable after approval. If the reference prototype can still be edited,
implementation drifts from it and there is no way to tell afterwards which side moved. When the owner
requests a tweak, produce the revised prototype, get it approved, and file a new reference, rather
than quietly editing the old one.

```sh
gh issue create --title "Design: <screen or component>" --body-file <round-body>.md
```

Put the prototype path, the variation number and name, the canvas size used, and the settings the
owner chose into the ticket body.

### Step 9 — Implement from the ticket as the specification

Implement the approved variation, not a fresh redesign discovered mid-build. The ticket and its
immutable prototype are the specification for the work that follows.

If implementation reveals the approved design cannot work, that is a finding to report and take back
through a new round, not a licence to improvise a different design while the code is already open.

### Step 10 — Verify against the reference, then archive the round

After implementation, compare the built result against the approved prototype reference, either as a
checklist or as side-by-side screenshots. Unverified design work is a guess with extra steps: the
build matching your memory of the prototype proves nothing.

Then save every round under `docs/design-variations/` in a dated folder, so a later session can see
what was offered, what was chosen, and why:

```text
docs/design-variations/YYYY-MM-DD-round-N/
├── prototype.html
├── screenshots/
├── decision.md
└── issue-url.txt
```

`decision.md` records the project facts read in Step 3, the four variation names, the chosen one, the
owner's wording, and the ticket URL. If `docs/` does not exist yet, create `docs/design-variations/`
directly and note in the report that the documentation foundation has not been laid yet, so the next
agent knows the set is partial rather than complete.

## Outputs

- One self-contained HTML prototype file holding exactly four genuinely different variations, with a
  bottom bar that switches between them and exposes per-variation settings derived from the target
  project, rendered at the target project's canvas size.
- A recorded owner decision: the chosen variation by number and name, any tweak requested, and the
  exact words the owner used, or an explicit rejection that starts a new round.
- A GitHub ticket created with `gh issue create`, carrying the immutable approved prototype as the
  reference specification for the implementation.
- The implemented UI, built to that ticket rather than to a fresh in-build idea.
- A verification artefact comparing the built result against the approved prototype, by checklist or
  by side-by-side screenshot.
- An archived round under `docs/design-variations/YYYY-MM-DD-round-N/` with the prototype, the
  screenshots, the decision record, and the ticket URL.

## Failure Modes

- `gh` is missing or not authenticated. Report that explicitly with the command that failed and what
  authentication would fix it, then continue with the archived round and the decision record.
  Silently skipping the ticket leaves the approved prototype with no spec and no traceability, and the
  reader cannot tell whether the step was forgotten or declined.
- `docs/` does not exist yet. Create `docs/design-variations/` and say in the report that the
  documentation foundation is missing, so an incomplete doc set reads as incomplete rather than done.
- The project has no interface. Decline with the evidence you scanned for, as the precondition
  requires. Producing four variations for a headless library wastes the owner's attention on a
  decision they cannot make.
- The owner rejects all four. Start a fresh round of four genuinely different ideas. Narrowing and
  repainting the rejected set wastes the round, because rejection is information about direction,
  not about palette.
- The owner asks for a tweak. Produce a revised prototype, get approval for the revision, and file a
  new immutable reference. Editing an approved reference after the fact is how implementation ends
  up with two specifications and no way to say which one governs.
- The owner does not answer. Hold at the gate and report the four variations as awaiting a decision.
  Treating silence as approval converts the one decision this skill exists to collect into a guess.
- Implementation drifts from the reference. Stop, compare against the prototype, and either correct
  the implementation or take the deviation back through the gate. Shipping the drift quietly is how a
  verified design becomes an unverified one.
- Four variations collapse into near-identical layouts. That set has wasted the round, because the
  value was the diversity of ideas, so regenerate along a different axis such as hierarchy,
  composition, or interaction model.
