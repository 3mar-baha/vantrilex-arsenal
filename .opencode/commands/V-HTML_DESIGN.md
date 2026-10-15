---
description: Render a single-file showcase page from a content record plus one brand visual language, with an index linking all showcases.
---

# Showcase Page Builder

You build single-file HTML showcase pages. Your job is to **render** a
content record through exactly one brand visual language into exactly one
self-contained HTML file. Content is never lost to a brand switch, because
content and presentation live in separate files.

Operator intent for this run:

$ARGUMENTS

Usage: `<slug> [--brand <brand>] [--index]`. The slug names the showcase,
for example `atlas-launch`. `--brand` selects the visual language.
`--index` regenerates the showcase index after rendering.

## Content record first

Every showcase owns one content record at the deterministic path:

`showcase/<slug>.content.json`

The record holds exactly four arrays of strings, and nothing else:

- `features` — what the thing does.
- `goals` — what the thing is for.
- `ideas` — what could come next.
- `timeline` — dated milestones in oldest-first order.

If the record does not exist, create it from the operator's description of
the showcase and stop before rendering, so the operator can review the
content first. If it exists, read it and never rewrite it during a render.
A render reads content; only the operator edits content. This is the
content split: the record is durable, the HTML is disposable, and a brand
switch re-renders the same record so no word is ever lost.

## One brand visual language

Each render uses exactly one brand. The brand resolves in this order:

1. `--brand <brand>` when passed.
2. The `brand` field of the content record when set.
3. The default brand `blazar`.

The brand's visual language is read from exactly one file:

`registry/formatting/brands/<brand>/DESIGN.md`

Only color, type, spacing, and texture tokens are taken from that file.
No other brand file is read, no two brands are mixed, and brand prose is
never copied into the page. When the brand file is absent, stop and name
the missing file; never improvise a visual language from memory.

## Deterministic idempotent render

The render writes exactly one file at the deterministic path:

`showcase/<slug>.html`

Rules for the output:

- One self-contained file: inline CSS and inline scripts only, no
  external stylesheet, font, image, or script reference.
- Four sections in record order: features, goals, ideas, timeline.
- Re-running the same slug with the same record and brand produces a
  byte-identical file. Rendering never appends, never renames, never
  leaves a second file behind.
- English only. No placeholder text in the page; an empty array renders
  its section as `Nothing recorded yet.`

## The index flag

`--index` regenerates exactly one file:

`showcase/index.html`

It links every `showcase/*.html` file except itself, one link per
showcase with the slug as the link text, sorted alphabetically. It uses
the default brand's visual language. It is the only file `--index` writes.

## Operating rules

1. **Content and presentation stay split.** A brand switch re-renders; it
   never edits the content record.
2. **One brand per page.** A page that mixes two brands is a failed page.
3. **Deterministic paths only.** The slug decides the paths; the clock
   and the operator's cwd never do.
4. **Read-only except the render.** This command writes at most two
   files: the page and, with `--index`, the index.

## Final reply

Print, in this order:

1. **Record** — the content path and its four array counts.
2. **Brand** — the brand used and the DESIGN.md path read.
3. **Rendered** — the page path, or `NOT RENDERED (record created)`.
4. **Index** — the index path, or `NOT REQUESTED`.
