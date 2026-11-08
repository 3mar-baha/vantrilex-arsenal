---
name: og-image
description: Use when designing or generating Open Graph social preview cards with Satori or the vercel og ImageResponse, or auditing a Next App Router opengraph-image or twitter-image file against the file-convention contract — layout archetypes, brand tokens, fonts, blank or unstyled output, or size/contentType/ImageResponse/inline-style/edge-import defects.
source: 3mar-baha/vantrilex-arsenal
---

# OG Image Design, Generation and Contract Audit

## Purpose

Design and generate Open Graph / social preview images — the picture Slack, iMessage,
LinkedIn, X, and Discord pull for a link preview — from a real layout taxonomy instead of
one-off improvisation. "OG image", "social card", and "social preview" all name the same
artefact. This skill is now unified: it covers both the **generative** work (choosing a
layout archetype and building and rendering a card) and the **mechanical** contract audit
of an existing Next.js `opengraph-image.tsx` or `twitter-image.tsx` against the
file-convention rules that make the route 500 or render an unstyled card.

"Designing or generating" and "auditing" are the two modes. The generative mode decides
what the card should look like and then builds and renders it. The audit mode answers
"is this file correct?" and changes no design. The two overlap only on the Satori
constraint layer, which is restated in both modes because it is where design intent
silently fails at render time.

Adapted from `RL22/my-agent-skills` (MIT, Copyright (c) 2026 Rodney Lewis), path
`skills/og-image/SKILL.md`, with its `references/satori-constraints.md`, and from
`soilmass/gelato` (MIT, Copyright (c) 2026 Neopolitan), paths
`skills/open-graph-image/SKILL.md` and `skills/open-graph-image/references/opengraph-image-api.md`.
Rendering is done by Satori via `@vercel/og` (npm, MPL-2.0) or `next/og` inside Next.js.
See `## Attribution`.

## When to Use

- The project needs an `og:image`, a social preview card, or a Next.js
  `opengraph-image.tsx` / `twitter-image.tsx` file.
- The request is for social cards, launch graphics, blog-post previews, changelog cards,
  benchmark cards, or documentation cards.
- A card already renders but comes out blank, unstyled, clipped, or with invisible
  decorative layers.
- Output differs between two builds of identical input and must be reproducible.
- Choosing a template shape before writing any JSX.
- Adding or editing any `app/**/opengraph-image.tsx` or `app/**/twitter-image.tsx`.
- Reviewing a change that touches OG image generation.
- Diagnosing "my OG image 500s", "the OG route throws", or "previews show a blank image".
- A CMS-driven or per-segment OG route whose `generateImageMetadata` shape needs checking.
- Before a deploy, as a fixed read of the file against the file-convention contract.

## Do NOT use

- For logos, favicons, icons, or non-social brand assets. Those are a different problem
  with different geometry requirements.
- For page-level `og:title`, `og:description`, or `twitter:card` text metadata. Those are
  set through `generateMetadata`, not by the image file.
- For a static PNG already committed under `public/`. Nothing renders at request time, so
  every constraint here is irrelevant.
- When no browser, edge runtime, or Node server is available to render with. Satori is a
  real renderer; a card that was never rendered is a guess.
- Do not assume a clean `tsc --noEmit` means the card is correct. Every trap in this
  skill type-checks cleanly and renders wrong.
- For JSON-LD structured data. A separate concern with its own required fields.
- For caching and revalidation tuning. Next owns the defaults; changing them is a
  performance judgement, not a contract fix.
- For accessibility of the card's own markup. OG images are non-interactive; the
  `og:image:alt` text is page-metadata territory.
- For font loading and rendering quality beyond the shape of the `fonts` option. Whether a
  weight loads and renders correctly is a build and runtime concern.

## Inputs

- Target dimensions. `1200x630` (1.91:1) is the Open Graph convention; use a distinct
  `1200x675` card only when a platform genuinely needs a different aspect.
- The content shape: a product launch, a metric, a code sample, a quote, a screenshot, a
  photograph, or a minimal changelog entry. This decides the archetype.
- Brand tokens: background and foreground colours, title font family and weights, a
  mono family if the archetype needs one, radius, padding, and a seed for any motif that
  varies. All six-digit hex.
- The font binaries for the weights actually used, as `.ttf` or `.otf` data.
- Any raster asset to embed, already resized to its exact display dimensions.
- Whether the route is per-page static or driven by `generateImageMetadata`.
- For the contract audit: the file under audit (`app/opengraph-image.tsx`,
  `app/<segment>/opengraph-image.tsx`, or the `twitter-image.tsx` equivalent). The
  filename is the classifier trigger.
- The declared `next` version, because file conventions have tightened across releases.
- Whether `generateImageMetadata` is present, which changes how the `size` and
  `contentType` rules apply.
- For runtime confirmation only: a deployed host, so the generated route can be fetched.

## Procedure

### 1 — Pick the archetype from the content shape

Do not invent a new layout until you have checked that none of these eight fit.

1. **Dual column split** — title left, product visual right. Feature and product launches.
2. **Centered hero** — symmetrical wordmark or tagline. Brand moments, major announcements.
3. **Stat callout** — one or a few large metrics. Reports, benchmarks, milestones.
4. **App UI / browser frame** — a product screenshot inside window chrome. Feature docs.
5. **Code terminal** — syntax-highlighted code in a window. Dev-tool and API cards.
6. **Full-bleed photo** — photography under a gradient scrim. Only when a strong image
   already exists.
7. **Quote or testimonial** — attributed quotation. Blog posts, press quotes, podcast
   episodes.
8. **Badge or pill-header minimal** — compact eyebrow plus title. Changelogs, docs, feeds.

### 2 — Define brand tokens, never literal brand values in a template

A template takes its colours, fonts, radius, and padding from a token object. A working
token set is an example, not a default. Two rules that are not optional:

- **Colours must be six-digit hex.** Alpha helpers append an alpha byte to a six-digit hex
  string; any other notation produces malformed CSS that Satori discards without warning.
- **No unseeded randomness.** Never `Math.random()` for motif placement, noise, gradient
  angle jitter, or variant choice. Use a fixed-seed generator and thread a `seed` through
  every motif that varies, in every template that uses it — not only the first one built.
  Record the seed when a card is meant to differ between renders.

### 3 — Write the template inside Satori's supported subset

Satori converts JSX to SVG, which Resvg converts to PNG. It does not run React; it
statically renders the tree. Layout is flexbox plus absolute positioning, inline styles
only.

Supported: `display: flex` with `flexDirection`, `justifyContent`, `alignItems`, `gap`;
`position: absolute` or `relative` with `top`/`left`/`right`/`bottom`; `fontFamily`,
`fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `textAlign`; `color`,
`backgroundColor`; `padding*`, `margin*`; `border*`, `borderRadius`; `width`, `height`,
`maxWidth`, `maxHeight`; `overflow: hidden`; `transform: rotate(...)`;
`backgroundImage: linear-gradient(...)`; `whiteSpace` and `wordBreak`.

Silently ignored, producing a blank or default-styled card while the process still exits
zero:

- `className` of any kind. Tailwind is completely invisible here; convert each utility to
  an inline style property.
- CSS Grid. Use flex.
- The `inset` shorthand. It is not implemented; a full-bleed layer collapses to zero
  space instead of erroring. Write `top: 0, right: 0, bottom: 0, left: 0`.
- The `radial-gradient(color 1px, transparent 1px)` dot-grid trick. Browsers default an
  unqualified radial gradient's extent to the closest side; Satori reaches the farthest
  corner, so the "1px dot" collapses to a sub-pixel point and the layer is invisible. Use
  the line-grid variant instead — two crossed `linear-gradient`s with hard 1px stops on
  `to right` and `to bottom`.
- CSS custom properties (`var(--x)`), `calc()` with mixed units, `@media` queries,
  keyframe animations, most pseudo-classes and pseudo-elements.
- `backdrop-filter` and CSS 3D transforms (`rotateX`, `rotateY`) applied directly to
  elements. An SVG-embedded `filter` or `feTurbulence` data URI does render, but **must**
  declare an explicit `viewBox` or rendering throws.

Treat real-world OG design references as a design to reinterpret through Satori-safe
primitives, never as CSS to paste in.

### 4 — Load fonts explicitly, and keep the two spellings straight

- Load only the weights the template actually renders. Do not bundle a whole variable
  family; prefer static `.ttf` or `.otf`, which parse faster.
- When upstream only ships a single variable-weight file for an OFL family, fetch a
  specific static instance from the Google Fonts CSS2 API
  (`https://fonts.googleapis.com/css2?family=Family:wght@700`) instead of assuming a
  static cut exists. Note that some families have a lower static maximum than the name
  implies — check before requesting a weight.
- The `fonts` option on `ImageResponse` takes the **unquoted** family name
  (`name: "Space Grotesk"`). The `fontFamily` style inside the JSX takes the **quoted**
  CSS string (`'"Space Grotesk"'`). The two serve different APIs and nothing keeps them in
  sync; check both whenever a font is added.

### 5 — Size every raster asset before it goes in

Never feed a full-resolution source image to `ImageResponse`. Resize and crop to the exact
display dimensions first; a large remote image is a common cause of a function timeout.
Where the content allows, prefer a vector or gradient background over photography — zero
asset-loading risk. When photography is required, resize before rendering and pair it with
a scrim so overlaid text keeps contrast.

### 6 — Render it and look at it

Type-checking proves nothing here. Render every template through the real Satori pipeline
at its exact declared dimensions, write the PNGs, and open them.

- Turn on `debug: true` while tuning a new layout — it draws element bounding boxes —
  then remove it before shipping.
- A layer can render with zero visible effect while the process exits 0. The `inset`
  collapse, the dot-grid collapse, and a missing `viewBox` are all invisible to a type
  checker.
- Adjacent inline text tokens lose their spacing without `whiteSpace: "pre"` on each token
  span — `import { client } from` renders as `import{ client }from`. Only a render shows
  this.
- Confirm the card does not clip or misalign inside Satori's layout engine, even if it
  looked right in a browser preview.

### 7 — Set the textual metadata separately

File-based `opengraph-image.tsx` / `twitter-image.tsx` generates the image `<meta>` tags
automatically — do not hand-write `og:image` or `twitter:image` at page level, or the two
can conflict. `og:title`, `og:description`, `twitter:card`, `twitter:title` and
`twitter:description` are text metadata set through `generateMetadata`, and
`metadataBase` in the root layout is what makes relative asset URLs resolve to absolute
ones. Set `alt` on the image file for the `og:image:alt` text.

### 8 — Contract audit (mechanical)

Work these five in order when auditing an existing file. Each maps to a runtime symptom.
This mode changes no design and reports mechanical defects only.

#### 1 — `size` must be exported

```tsx
export const size = { width: 1200, height: 630 };
```

Next reads this for both the `og:image:width` / `og:image:height` metadata and the
`ImageResponse` default viewport. Missing it yields a runtime failure or incorrect meta
tags.

#### 2 — `contentType` must be exported

```tsx
export const contentType = 'image/png';
```

Without it Next infers the type from the file extension, and a `.tsx` file infers the
wrong one. Set it explicitly.

#### 3 — The default export must return an `ImageResponse`

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

#### 4 — No `className` inside the JSX

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

#### 5 — Module-scope imports must be edge-safe

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

#### Edge cases this audit must get right

- `twitter-image.tsx` follows the same rules; it is the same file-convention family.
- With `generateImageMetadata`, the file-level `size` and `contentType` exports still
  apply, while per-variant values live in the generator's return array. Treat the
  file-level pair as lenient when the generator is present and supplies them, and report
  the variance rather than the absence.
- CMS-driven content is legitimate. The violation is about the file's static exports and
  the JSX-versus-`ImageResponse` shape, never about where the text came from.
- A remote `<img>` must carry absolute dimensions. Without them the card renders with a
  zero-sized or collapsed image region.

#### Confirm at runtime, not only on paper

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

- A template chosen from the eight archetypes, with its rationale recorded.
- A brand-token definition covering colours, fonts, radius, padding, and a seed.
- Satori-safe JSX: flex-only layout, inline styles, six-digit hex colours, explicit
  longhand offsets, no `className`.
- Explicitly loaded font data for the exact weights rendered, with the unquoted/quoted
  family-name split respected.
- Rendered PNGs at the declared dimensions, visually inspected, produced with
  `debug: true` off.
- Textual `og:*` and `twitter:*` metadata set through `generateMetadata`, with image tags
  left to file-based generation.
- For the contract audit: a per-class verdict for all five violation classes (`size`,
  `contentType`, `ImageResponse` return, `className` usage, edge-safe imports), with the
  offending line, the runtime or visual consequence, and the concrete replacement code for
  each defect.
- For the contract audit: an explicit statement of what was **not** checked — rendering,
  fonts, caching, accessibility, design — so the audit's boundary is never mistaken for
  a clean bill of health on the card's appearance.
- For the contract audit: a runtime confirmation result from fetching the deployed route,
  plus the platform validators still to be run.

## Failure Modes

- **Card renders blank or unstyled.** `className` or Tailwind reached the JSX. Satori
  ignores classes entirely; convert every utility to an inline style.
- **A full-bleed layer occupies no space.** The `inset` shorthand is unimplemented and
  fails quietly. Replace with `top`/`right`/`bottom`/`left`.
- **Decorative dot grid invisible.** The bare `radial-gradient` 1px-dot trick renders at
  sub-pixel size under Satori. Switch to the crossed-`linear-gradient` line grid.
- **Render throws `missing "viewBox"`.** An SVG embedded as a data URI has no explicit
  `viewBox`. Add one.
- **Colours ignored or malformed.** A color is not six-digit hex, so an alpha-appending
  helper produced invalid CSS.
- **Code tokens run together.** Adjacent inline spans need `whiteSpace: "pre"`.
- **Text weight looks wrong or falls back.** The family name is quoted in the `fonts`
  option, or the requested weight does not exist as a static file.
- **Render times out.** A full-resolution image was passed in unresized.
- **Two builds of the same card differ.** Unseeded `Math.random()` reached a motif.
  Thread the seed through every varying template and record it.
- **The route 500s rather than rendering badly.** That is the file-convention contract,
  not the design — missing `size` or `contentType`, a default export not returning
  `ImageResponse`, or a non-edge-safe module-scope import. Handled by the contract audit
  in section 8.
- **`@vercel/og` is mistaken for a GitHub repository.** `github.com/vercel/og` does not
  exist and returns 404. The MPL-2.0 licence belongs to the npm package `@vercel/og`;
  `next/og` ships inside Next.js, which is MIT.
- **Route 500s at request time.** Missing `size` or `contentType`, or a default export
  that returns a React element instead of an `ImageResponse`.
- **Card renders completely unstyled.** `className` reached the JSX; convert each
  utility to an inline style property.
- **Full-bleed layer silently occupies no space.** The `inset` shorthand is not
  implemented by Satori and fails without error; use `top`, `right`, `bottom`, `left`.
- **Embedded SVG throws `missing "viewBox"` at render time.** An SVG data URI without an
  explicit `viewBox`, which works fine as a plain `<img>` in a browser.
- **Build passes locally, deploy fails.** An import that is fine in the Node build but not
  in the edge runtime. Re-check module scope against step 5 of the contract audit.
- **Correct meta tags, wrong card.** A remote image without absolute dimensions, or a font
  that never loaded. Both render; neither throws.
- **Stale preview after a fix.** Crawler caches. Re-scrape in the platform debugger
  before concluding the fix did not work.
- **`github.com/vercel/og` cited as the implementation.** That repository does not exist
  and returns 404. The renderer is Satori, reached through `next/og` inside Next.js
  (MIT) or npm `@vercel/og` (MPL-2.0).
- **The audit was read as a design review.** It is not. Route layout, contrast, and
  archetype choice go to the generative mode in sections 1-7.

## Attribution

Adapted from `RL22/my-agent-skills` (MIT, Copyright (c) 2026 Rodney Lewis), path
`skills/og-image/SKILL.md`, plus `skills/og-image/references/satori-constraints.md` under
the same licence. Taken: the eight-archetype taxonomy, the brand-token indirection rule,
the Satori constraint set, the seeded-PRNG determinism rule, the font-loading policy, and
the render-and-inspect verification stance. The upstream skill ships template code, font
binaries, and a render-check script; none of that is vendored here, so every rule it
carried is restated inline above.

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

The renderer is Satori, reached through npm `@vercel/og` (MPL-2.0) or `next/og` inside
Next.js (MIT). There is no `github.com/vercel/og` repository; the closest real repository
is `vercel/og-image` (MIT), which is the hosted service rather than the library.

The full provenance ledger, including the companion skills in this kit, is in
`.opencode/skills/lenis/assets/sources.md`.
