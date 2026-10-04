---
name: og-image
description: Use when designing or generating Open Graph social preview cards with Satori or the vercel og ImageResponse — choosing a layout archetype, threading brand tokens through a template, loading fonts, or fixing output that renders blank, unstyled or differently each run.
---

# OG Image Design and Generation

## Purpose

Design and generate Open Graph / social preview images — the picture Slack, iMessage,
LinkedIn, X, and Discord pull for a link preview — from a real layout taxonomy instead of
one-off improvisation. "OG image", "social card", and "social preview" all name the same
artefact.

This skill is **generative**: it decides what the card should look like and then builds
and renders it. Its sibling `open-graph-image` is the **mechanical** counterpart — it
audits an existing Next.js `opengraph-image.tsx` against five rules without touching
design. The two overlap only on the Satori constraint layer, which is restated in both
because it is where design intent silently fails at render time.

Adapted from `RL22/my-agent-skills` (MIT, Copyright (c) 2026 Rodney Lewis), path
`skills/og-image/SKILL.md`, with its `references/satori-constraints.md`. Rendering is done
by Satori via `@vercel/og` (npm, MPL-2.0) or `next/og` inside Next.js. See `## Attribution`.

## When to Use

- The project needs an `og:image`, a social preview card, or a Next.js
  `opengraph-image.tsx` / `twitter-image.tsx` file.
- The request is for social cards, launch graphics, blog-post previews, changelog cards,
  benchmark cards, or documentation cards.
- A card already renders but comes out blank, unstyled, clipped, or with invisible
  decorative layers.
- Output differs between two builds of identical input and must be reproducible.
- Choosing a template shape before writing any JSX.

## Do NOT use

- For logos, favicons, icons, or non-social brand assets. Those are a different problem
  with different geometry requirements.
- For page-level `og:title`, `og:description`, or `twitter:card` text metadata. Those are
  set through `generateMetadata`, not by the image file.
- For auditing or reviewing an existing OG route against the Next.js file-convention
  contract. Use `open-graph-image`; it answers "is this file correct?" without proposing
  a design.
- For a static PNG already committed under `public/`. Nothing renders at request time, so
  every constraint here is irrelevant.
- When no browser, edge runtime, or Node server is available to render with. Satori is a
  real renderer; a card that was never rendered is a guess.
- Do not assume a clean `tsc --noEmit` means the card is correct. Every trap in this
  skill type-checks cleanly and renders wrong.

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

## Failure Modes

- **Card renders blank or unstyled.** `className` or Tailwind reached the JSX. Satori
  ignores classes entirely; convert every utility to an inline style.
- **A full-bleed layer occupies no space.** The `inset` shorthand is unimplemented and
  fails quietly. Replace with `top`/`right`/`bottom`/`left`.
- **Decorative dot grid invisible.** The bare `radial-gradient` 1px-dot trick renders at
  sub-pixel size under Satori. Switch to the crossed-`linear-gradient` line grid.
- **Render throws `missing "viewBox"`.** An SVG embedded as a data URI has no explicit
  `viewBox`. Add one.
- **Colours ignored or malformed.** A colour is not six-digit hex, so an alpha-appending
  helper produced invalid CSS.
- **Code tokens run together.** Adjacent inline spans need `whiteSpace: "pre"`.
- **Text weight looks wrong or falls back.** The family name is quoted in the `fonts`
  option, or the requested weight does not exist as a static file.
- **Render times out.** A full-resolution image was passed in unresized.
- **Two builds of the same card differ.** Unseeded `Math.random()` reached a motif.
  Thread the seed through every varying template and record it.
- **The route 500s rather than rendering badly.** That is the file-convention contract,
  not the design — missing `size` or `contentType`, a default export not returning
  `ImageResponse`, or a non-edge-safe module-scope import. Hand off to
  `open-graph-image`.
- **`@vercel/og` is mistaken for a GitHub repository.** `github.com/vercel/og` does not
  exist and returns 404. The MPL-2.0 licence belongs to the npm package `@vercel/og`;
  `next/og` ships inside Next.js, which is MIT.

## Attribution

Adapted from `RL22/my-agent-skills` (MIT, Copyright (c) 2026 Rodney Lewis), path
`skills/og-image/SKILL.md`, plus `skills/og-image/references/satori-constraints.md` under
the same licence. Taken: the eight-archetype taxonomy, the brand-token indirection rule,
the Satori constraint set, the seeded-PRNG determinism rule, the font-loading policy, and
the render-and-inspect verification stance. The upstream skill ships template code, font
binaries, and a render-check script; none of that is vendored here, so every rule it
carried is restated inline above.

Licences are recorded for information only and were never a selection filter. The
renderer is Satori, reached through npm `@vercel/og` (MPL-2.0) or `next/og` inside
Next.js (MIT). There is no `github.com/vercel/og` repository; the closest real repository
is `vercel/og-image` (MIT), which is the hosted service rather than the library.

The full provenance ledger, including the companion skills in this kit, is in
`.opencode/skills/lenis/assets/sources.md`.
