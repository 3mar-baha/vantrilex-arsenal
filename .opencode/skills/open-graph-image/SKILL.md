---
name: open-graph-image
description: Use when adding, editing, or reviewing a Next App Router opengraph-image or twitter-image file — auditing the required size and contentType exports, the ImageResponse return, inline-style usage, and edge-safe imports before the route fails at runtime.
---

# Open Graph Image Contract Audit

## Purpose

Audit a Next.js App Router `opengraph-image.tsx` or `twitter-image.tsx` file against the
file-convention contract and the `ImageResponse` runtime, and report the mechanical
defects that make the route 500 in production or render an unstyled card. Five violation
classes, each detectable by reading the file, each with a known runtime consequence.

This skill is **mechanical**: it answers "is this file correct?" and changes no design. Its
sibling `og-image` is the **generative** counterpart — it chooses a layout archetype and
builds and renders a card. The two overlap only on the Satori constraint layer, which this
skill states from the audit angle (a `className` is a defect here, where `og-image` states
it as a build rule). Where this skill deliberately stops is recorded under `## Do NOT use`.

Adapted from `soilmass/gelato` (MIT, Copyright (c) 2026 Neopolitan), paths
`skills/open-graph-image/SKILL.md` and `skills/open-graph-image/references/opengraph-image-api.md`.
See `## Attribution`.

## When to Use

- Adding or editing any `app/**/opengraph-image.tsx` or `app/**/twitter-image.tsx`.
- Reviewing a change that touches OG image generation.
- Diagnosing "my OG image 500s", "the OG route throws", or "previews show a blank image".
- A CMS-driven or per-segment OG route whose `generateImageMetadata` shape needs checking.
- Before a deploy, as a fixed five-point read of the file.

## Do NOT use

- **Page-level metadata** — `og:title`, `og:description`, `twitter:card`,
  `twitter:title`, `twitter:description`, canonical URLs. Those are text metadata set
  through `generateMetadata` or a `metadata` export.
- **JSON-LD structured data.** A separate concern with its own required fields.
- **Static OG PNGs committed under `public/`.** Next serves the file; no rule here applies.
- **Choosing or improving the card's appearance.** This skill reports contract violations.
  Layout archetype selection, typography scale, contrast, and motif work belong to
  `og-image`.
- **Font loading and rendering quality.** Whether a weight loads and renders correctly is
  a build and runtime concern; this skill checks the shape of the `fonts` option, not the
  glyphs.
- **Caching and revalidation tuning.** Next owns the defaults; changing them is a
  performance judgement, not a contract fix.
- **Accessibility of the card's own markup.** OG images are non-interactive; the
  `og:image:alt` text is page-metadata territory.

## Inputs

- The file under audit: `app/opengraph-image.tsx`, `app/<segment>/opengraph-image.tsx`, or
  the `twitter-image.tsx` equivalent. The filename is the classifier trigger.
- The declared `next` version, because file conventions have tightened across releases.
- Whether `generateImageMetadata` is present, which changes how the `size` and
  `contentType` rules apply.
- For runtime confirmation only: a deployed host, so the generated route can be fetched.

## Procedure

Work these five in order. Each maps to a runtime symptom.

### 1 — `size` must be exported

```tsx
export const size = { width: 1200, height: 630 };
```

Next reads this for both the `og:image:width` / `og:image:height` metadata and the
`ImageResponse` default viewport. Missing it yields a runtime failure or incorrect meta
tags.

### 2 — `contentType` must be exported

```tsx
export const contentType = 'image/png';
```

Without it Next infers the type from the file extension, and a `.tsx` file infers the
wrong one. Set it explicitly.

### 3 — The default export must return an `ImageResponse`

```tsx
// correct
import { ImageResponse } from 'next/og';

export default function OG() {
  return new ImageResponse(<div>Title</div>, { ...size });
}

// defect — returns a bare React element
export default function OG() {
  return <div>Title</div>;
}
```

### 4 — No `className` inside the JSX

`next/og`'s `ImageResponse` uses Satori, which converts JSX to SVG and then Resvg converts
SVG to PNG. It does not run React and resolves no class names, so a Tailwind class is
invisible rather than an error.

```tsx
// correct
<div style={{ display: 'flex', fontSize: 64, fontWeight: 'bold' }}>Title</div>

// defect — silently unstyled output
<div className="flex text-6xl font-bold">Title</div>
```

Satori's supported subset, for reference while converting: flexbox (`display`, `flexDirection`,
`justifyContent`, `alignItems`, `gap`), absolute and relative positioning with `top`,
`left`, `right`, `bottom`, typography (`fontFamily`, `fontSize`, `fontWeight`,
`lineHeight`, `letterSpacing`, `textAlign`), `color` and `backgroundColor`, `padding*`,
`margin*`, `border*`, `borderRadius`, `width`, `height`, `maxWidth`, `maxHeight`,
`overflow: hidden`, `transform: rotate(...)`, `backgroundImage: linear-gradient(...)`,
`whiteSpace`, `wordBreak`.

Unsupported and silently dropped: `className`, CSS Grid, CSS custom properties, `calc()`
with mixed units, `@media` queries, keyframe animations, most pseudo-classes and
pseudo-elements.

### 5 — Module-scope imports must be edge-safe

`ImageResponse` runs in the Edge Runtime by default. Most Node built-ins are unavailable
there, `next/image` requires a Node image pipeline, and a top-level `next/font/google`
import performs a network download that the edge restricts.

```tsx
// correct
import { ImageResponse } from 'next/og';

// defect — breaks the Satori runtime
import Image from 'next/image';
import { Inter } from 'next/font/google';
```

Load font data yourself and pass it through the `fonts` option, and embed images as a
plain `<img>` with an absolute URL that Satori fetches at render time:

```tsx
const font = await fetch(new URL('./fonts/inter.woff2', import.meta.url))
  .then((response) => response.arrayBuffer());

return new ImageResponse(<div style={{ display: 'flex' }}>Title</div>, {
  ...size,
  fonts: [{ name: 'Inter', data: font, weight: 400 }],
});
```

### Edge cases this audit must get right

- `twitter-image.tsx` follows the same rules; it is the same file-convention family.
- With `generateImageMetadata`, the file-level `size` and `contentType` exports still
  apply, while per-variant values live in the generator's return array. Treat the
  file-level pair as lenient when the generator is present and supplies them, and report
  the variance rather than the absence.
- CMS-driven content is legitimate. The violation is about the file's static exports and
  the JSX-versus-`ImageResponse` shape, never about where the text came from.
- A remote `<img>` must carry absolute dimensions. Without them the card renders with a
  zero-sized or collapsed image region.

### Confirm at runtime, not only on paper

Paper review catches the five classes above and nothing else. After deploy, fetch the
generated route and confirm a real image comes back, then check the card where it will
actually be seen:

```
curl -sI https://<host>/<segment>/opengraph-image
```

Then paste the URL into the platform validators — the Twitter Card validator, the
LinkedIn Post Inspector, and the Facebook Sharing Debugger. Crawlers cache previews
aggressively, so a fix that looks right locally can still serve a stale card until the
cache is re-scrapped.

## Outputs

- A per-class verdict for all five violation classes: `size`, `contentType`,
  `ImageResponse` return, `className` usage, edge-safe imports.
- For each defect, the offending line, the runtime or visual consequence, and the
  concrete replacement code.
- An explicit statement of what was **not** checked — rendering, fonts, caching,
  accessibility, design — so the audit's boundary is never mistaken for a clean bill of
  health on the card's appearance.
- A runtime confirmation result from fetching the deployed route, plus the platform
  validators still to be run.

## Failure Modes

- **Route 500s at request time.** Missing `size` or `contentType`, or a default export
  that returns a React element instead of an `ImageResponse`.
- **Card renders completely unstyled.** `className` reached the JSX; convert each
  utility to an inline style property.
- **Full-bleed layer silently occupies no space.** The `inset` shorthand is not
  implemented by Satori and fails without error; use `top`, `right`, `bottom`, `left`.
- **Embedded SVG throws `missing "viewBox"` at render time.** An SVG data URI without an
  explicit `viewBox`, which works fine as a plain `<img>` in a browser.
- **Build passes locally, deploy fails.** An import that is fine in the Node build but not
  in the edge runtime. Re-check module scope against step 5.
- **Correct meta tags, wrong card.** A remote image without absolute dimensions, or a font
  that never loaded. Both render; neither throws.
- **Stale preview after a fix.** Crawler caches. Re-scrape in the platform debugger
  before concluding the fix did not work.
- **`github.com/vercel/og` cited as the implementation.** That repository does not exist
  and returns 404. The renderer is Satori, reached through `next/og` inside Next.js
  (MIT) or npm `@vercel/og` (MPL-2.0).
- **The audit was read as a design review.** It is not. Route layout, contrast, and
  archetype choice go to `og-image`.

## Attribution

Adapted from `soilmass/gelato` (MIT, Copyright (c) 2026 Neopolitan), paths
`skills/open-graph-image/SKILL.md` and
`skills/open-graph-image/references/opengraph-image-api.md`. Taken: the five mechanical
violation classes and their consequences, the explicit boundary between what the upstream
skill encodes and what it deliberately leaves to runtime, the supported and unsupported
CSS split for Satori, the edge-runtime import rationale, the `generateImageMetadata`
leniency rule, and the post-deploy validator list. The upstream frontmatter pins its
methodology to the Next.js 15 documentation verified 2026-04-19; those file-convention
rules still hold, and the current `next` release was 16.3.8 when this file was written.

The method's authority is the Next.js documentation, not the upstream repository:
the `opengraph-image` file-convention page and the `ImageResponse` function page, both in
the `next/og` documentation set. Licences are recorded for information only and were never
a selection filter.

The full provenance ledger, including the companion skills in this kit, is in
`.opencode/skills/lenis/assets/sources.md`.
