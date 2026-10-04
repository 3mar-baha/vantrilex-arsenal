---
name: lenis
description: Use when a page needs weighted inertial smooth scrolling — installing Lenis, wiring its raf loop, syncing GSAP ScrollTrigger, WebGL or parallax to one scroll source, honouring prefers-reduced-motion, or diagnosing scroll that janks, drifts, desyncs or stops.
---

# Lenis Buttery Scroll

## Purpose

Set up, integrate, and repair Lenis smooth scrolling. Lenis wraps the browser's
**native** scroll instead of replacing it, so `position: sticky`, the scrollbar, anchor
links, and keyboard and assistive-technology navigation keep working. That is the reason
to choose it over a scrolljacking library — and it also explains its quirks: Lenis only
interpolates *the number the browser scrolls to*, so everything downstream is still the
browser's own scrolling.

This skill is a synthesis of two upstream skills. From `jumagu/skills` it takes the
loop-ownership rule, the ordered diagnostic ladder, and the reduced-motion and
nested-scroller treatment. From `Tromset/motion-design-toolkit` it takes the option and
API tables, the framework-binding notes, the ecosystem map, and the pitfalls list.
Neither upstream is a selection filter on licence grounds; see `## Attribution`.

Lenis itself is MIT-licensed, published as npm `lenis`. Upstream:
<https://github.com/darkroomengineering/lenis> · demo: <https://lenis.darkroom.engineering>

## When to Use

- The brief asks for smooth, inertial, "buttery", weighted, or premium-feeling scroll.
- Scroll position drives other work — a WebGL or Three.js canvas, a parallax layer, a
  progress bar, a pinned or scrubbed section — and that work trails the scroll.
- A page needs scroll snapping, "snap to section", or slide-style full-page scrolling.
  CSS `scroll-snap` does not work under Lenis; the `lenis/snap` entry point does.
- Anchor links must glide instead of jumping, or modals and nested panes must scroll
  inside a smoothed page.
- Scroll "just doesn't work", stutters, drifts, or desyncs after a scroll library landed.

## Do NOT use

- For CSS `scroll-behavior: smooth` on its own. That is a one-line stylesheet answer
  with no animation loop and no scroll-position event; reach for it first.
- To replace native scrolling for accessibility reasons. Lenis is not a scrolljack — but
  any smoothing still costs the direct 1:1 scroll-to-position mapping some people rely
  on, so do not add it to a form-heavy or data-table surface without asking.
- When the target user has `prefers-reduced-motion: reduce` set and the request is for
  *more* motion. Honour the preference; see the reduced-motion section below.
- To migrate away from a library that replaces native scroll entirely. That is a rewrite,
  not a config change.
- For scroll-position UI that is not smoothing — scroll-to-top buttons, virtualised
  lists, infinite-scroll pagination, scroll-spy tab bars. Those want the raw scroll
  event or IntersectionObserver, not an animation loop.
- **Do not treat GSAP ScrollTrigger as open source.** It is free to use under GSAP's
  standard "no charge" licence, which is not MIT and not an OSI-approved licence.
  Never vendor its source into this repository and never describe it as MIT. Integrating
  with it is legitimate; copying it is not.

## Inputs

- The target project: framework, router, and whether a build step exists.
- Installed and latest npm versions — compare with `npm view lenis version`. This skill
  was written against **1.3.26**, verified 2026-10-04; do not trust a pinned number here.
- Whether the app already owns an animation frame loop: GSAP, Framer Motion, a WebGL or
  React Three Fiber render loop, or nothing.
- Which nested elements must keep their own scrolling: modals, drawers, sidebars,
  dropdown panels, code blocks.
- The project's reduced-motion stance, and whether anchors must glide.

## Procedure

### 1 — Confirm the package before writing an install line

`lenis` exists on the public npm registry and is the correct project dependency:

```
npm view lenis name version license
npm i lenis
```

The React and Vue bindings ship inside the same package (`lenis/react`, `lenis/vue`) —
there is nothing extra to install. For Framer, Lenis ships a no-code component installed
from the Framer marketplace; it is not an npm package, so point the user there rather
than inventing an install command.

**There is no Lenis MCP server package.** `npm view lenis-mcp-server` returns
`E404 Not Found`, and so do `lenis-mcp`, `@lenis/mcp-server` and `mcp-server-lenis` as of
2026-10-04. Never emit `npx -y lenis-mcp-server` or any similar MCP invocation for Lenis;
if a task seems to need one, say the package does not exist.

### 2 — Include the stylesheet, always

```
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
```

This is not cosmetic. `autoToggle` and correct wrapper sizing depend on it, and omitting
it is one of the most frequent causes of "scroll just doesn't work". With no build step,
use the CDN and check the current version rather than reusing a pinned one:

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.26/dist/lenis.css" />
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
```

That drop-in is enough for a static page:

```js
new Lenis({
  autoRaf: true,
  autoToggle: true,
  anchors: true,
  allowNestedScroll: true,
  naiveDimensions: true,
  stopInertiaOnNavigate: true,
})
```

### 3 — Decide who owns the frame loop, before writing anything else

Lenis advances exactly one frame each time `lenis.raf(time)` is called with a timestamp
in **milliseconds**. Exactly one thing in the app must own that call. Nearly every report
of jank, stutter, drift, out-of-sync, or not-scrolling-at-all traces back to this: either
nothing calls `raf`, or two loops are fighting over it.

| The app has | Frame-loop owner | Pattern |
| --- | --- | --- |
| no other animation loop | Lenis itself | `autoRaf: true` |
| GSAP | `gsap.ticker` | `autoRaf` off, drive from the ticker |
| a WebGL or Three.js render loop | that render loop | `autoRaf` off, call `lenis.raf(t)` inside it |
| Framer Motion | Framer's `frame.update` | `autoRaf` off, drive from the frame callback |

Lenis owns it — the default for an ordinary site:

```js
const lenis = new Lenis({ autoRaf: true })

lenis.on('scroll', (e) => {
  // e is the Lenis instance: e.scroll, e.velocity, e.direction, e.progress
})
```

An existing render loop owns it — hand Lenis the timestamp the loop already has, so
scroll and rendering resolve on the same frame instead of one lagging the other:

```js
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  renderer.render(scene, camera)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

In React and Vue the same rule applies but runs through a ref inside an effect with real
teardown. A ticker callback added on every render and never removed is a leak.

### 4 — Keep or set the defaults that matter

| Option | Default | Notes |
| --- | --- | --- |
| `autoRaf` | `false` | `true` only when Lenis owns the loop |
| `lerp` | `0.1` | Interpolation intensity; overrides `duration` and `easing` |
| `duration` | `1.2` | Seconds; ignored when `lerp` is set |
| `smoothWheel` | `true` | Wheel input only |
| `orientation` | `vertical` | `vertical` or `horizontal` |
| `gestureOrientation` | `vertical` | `vertical`, `horizontal`, `both` |
| `anchors` | `false` | Must be opted into; see step 6 |
| `allowNestedScroll` | `false` | Walks the DOM on every scroll event |
| `prevent` | — | `(node) => boolean`, skip smoothing for matched nodes |
| `respectReducedMotion` | `true` | Leave it on; see step 5 |
| `wrapper` / `content` | `window` / `document.documentElement` | Custom scroll containers |
| `autoResize` | `true` | Call `resize()` manually only if disabled |

Useful members: `lenis.scroll`, `lenis.progress`, `lenis.velocity`, `lenis.lastVelocity`,
`lenis.direction`, `lenis.isStopped`, `lenis.prefersReducedMotion`,
`lenis.scrollTo(target, options)`, `lenis.start()`, `lenis.stop()`, `lenis.resize()`,
`lenis.destroy()`. `scrollTo` accepts a number, selector, keyword (`top`, `bottom`), or
element, with `offset`, `lerp`, `duration`, `easing`, `immediate`, `lock`, `force` and
`onComplete`.

Entry points worth knowing: `lenis/react` (`ReactLenis`, `useLenis`), `lenis/vue`,
`lenis/snap` for section snapping, and a Framer component.

### 5 — Respect reduced motion

`respectReducedMotion` defaults to `true` and must stay that way unless the user
explicitly overrides it. When the OS reports `prefers-reduced-motion: reduce`, Lenis
forces `lerp` to `1` so scroll tracks input 1:1, programmatic scrolls jump instantly,
and the instance keeps running so WebGL and DOM sync stay intact. The preference is
picked up live, with no reload. Read `lenis.prefersReducedMotion` to make your own
animations match.

If someone insists on smoothing regardless, tell them `respectReducedMotion: false`
exists and that it overrides an accessibility preference people set for motion sickness
— then follow their call and record the decision.

In React, `ReactLenis root` gives one global instance reachable from `useLenis` anywhere
in the tree. Do not create competing instances.

### 6 — Opt into anchors, and decide about nested scrollers

Anchor jumps are blocked while Lenis is active, which surprises people who assume
smoothing is purely additive:

```js
new Lenis({ anchors: true })
// or: new Lenis({ anchors: { offset: 100, onComplete: () => {} } })
```

Modals, sidebars, dropdowns and code blocks will not scroll on their own unless Lenis is
told to stand back. `allowNestedScroll: true` handles it automatically at the cost of
walking the DOM tree on every scroll event — fine while prototyping, measurable on a deep
tree. Prefer targeted opt-outs once that shows up:

```html
<div data-lenis-prevent>scrollable content</div>
```

```js
new Lenis({ prevent: (node) => node.id === 'modal' })
```

Attribute variants: `data-lenis-prevent`, `data-lenis-prevent-wheel`,
`data-lenis-prevent-touch`, `data-lenis-prevent-vertical`, `data-lenis-prevent-horizontal`.

### 7 — Sync a companion engine, all three steps or none

GSAP ScrollTrigger is the most requested integration and the biggest source of desync
bugs. Three things must all be true; partial setups are what produce "the animation
trails the scroll".

```js
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

// 1. ScrollTrigger recalculates on Lenis's animated position, not the raw one
lenis.on('scroll', ScrollTrigger.update)

// 2. GSAP owns the loop — ticker time is in seconds, Lenis wants milliseconds
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// 3. GSAP's lag smoothing would fight Lenis's own smoothing
gsap.ticker.lagSmoothing(0)
```

Leave `autoRaf` off here. Turning it on *and* adding the ticker callback gives Lenis two
loops, which reads as stutter rather than as an obvious error. In React, wrap the ticker
add and its `remove` in one effect.

With React Three Fiber, drive `lenis.raf(time * 1000)` from `useFrame`. After route
changes or dynamic content loads, call `ScrollTrigger.refresh()`.

### 8 — Diagnose in order

Each step is cheap and the list is sorted by how often each item is the actual cause:

1. **Is `raf` driven exactly once?** Either `autoRaf: true` or a single manual/ticker
   loop — never both, never neither.
2. **Is `lenis.css` included?** A missing stylesheet breaks `autoToggle` and wrapper
   sizing.
3. **Does the page scroll with Lenis removed?** Rule out ordinary CSS and layout faults —
   a wrapper with no height, `overflow: hidden` — before debugging Lenis at all.
4. **For ScrollTrigger desync, are all three steps from step 7 present?** A missing
   `ScrollTrigger.update` or a live `lagSmoothing` is the usual culprit.
5. **Is the package current?** Compare `npm view lenis version` with the installed one.
6. **Nested container will not scroll?** Apply `allowNestedScroll` or
   `data-lenis-prevent`.
7. **Anchors do not move?** Set `anchors: true`.
8. **Scroll feels instant rather than smooth?** Check whether the OS has reduced motion
   enabled — that is Lenis working as designed, not a defect.
9. **A second Lenis instance appeared?** Competing instances produce drift. One app, one
   instance.

## Outputs

- The dependency added to the target project via `npm i lenis`, plus the stylesheet import.
- One instance with exactly one frame-loop owner, named in the code and in the review.
- Reduced-motion behaviour intact: `respectReducedMotion` on unless the user overrode it,
  with the override recorded.
- Anchors and nested scrollers configured deliberately — `anchors: true` plus either
  `allowNestedScroll` or an explicit `data-lenis-prevent` decision.
- Any companion-engine wiring (GSAP ScrollTrigger, Framer, R3F) complete on all three
  steps, with add/remove teardown in framework bindings.
- A teardown path: `lenis.destroy()`, or `ReactLenis` handling it on unmount.
- Limitations that affect the design stated to the requester before they build on an
  assumption that will not hold: no CSS `scroll-snap` support, a 60fps cap on Safari and
  30fps in low-power mode, no operation across iframes because they do not forward wheel
  events, `position: fixed` lag on pre-M1 macOS Safari, unstable `syncTouch` on iOS
  below 16, and nested containers always needing explicit configuration.

## Failure Modes

- **Nothing calls `raf`.** Scroll does not animate at all. Symptom: the page scrolls
  natively, `autoRaf` is `false`, and no ticker or render loop calls `lenis.raf`.
- **Two loops own the frame.** Stutter or drift that appears the moment GSAP, Framer, or
  a render loop is added. Fix: turn `autoRaf` off and drive Lenis from the existing loop.
- **Stylesheet missing.** `autoToggle` misbehaves, wrapper sizing is wrong, and scroll
  appears broken.
- **Reduced motion is on and the user reports "it is not smooth".** Working as designed.
  Explain the preference before offering the override.
- **Anchor links stopped jumping.** Expected: Lenis blocks them while active. Set
  `anchors: true`.
- **A modal, drawer, or code block will not scroll.** Expected: nested scrollers need
  explicit configuration.
- **`scroll-snap` ignored.** Expected: unsupported. Use `lenis/snap`.
- **Scroll over an embedded iframe behaves oddly.** Expected: iframes do not forward wheel
  events to the parent. Do not attempt to work around it with scroll listeners.
- **GSAP ticker time passed unmultiplied.** `lenis.raf(time)` receives seconds where
  milliseconds are expected, and scroll runs at a fraction of the intended speed.
- **Stale install.** A version older than current behaves differently from every example
  here. Check `npm view lenis version` and read the upstream changelog before debugging
  further.
- **An MCP server command was requested for Lenis.** No such package exists on the npm
  registry; verified 404 on 2026-10-04. Report the absence instead of inventing a name.
- **GSAP ScrollTrigger source was copied into the project.** It is free under a custom
  "no charge" licence, not open source. Install it as a dependency; never vendor it, and
  never label it MIT.

## Attribution

This skill adapts and merges two upstream skills. Both licences are recorded for
information only; licence was never used as a selection filter.

| Upstream | Skill path | Licence | Taken |
| --- | --- | --- | --- |
| `jumagu/skills` | `skills/lenis/SKILL.md` | MIT, Copyright (c) 2026 jumagu | Frame-loop ownership rule, the ordered diagnostic ladder, the reduced-motion and nested-scroller treatment, the "wraps native scroll" framing |
| `Tromset/motion-design-toolkit` | `motion-design-toolkit/skills/lenis/SKILL.md` | No licence declared — the repository ships no licence file and GitHub licence detection returns none | The option and API tables, the React and Framer binding notes, the ecosystem map, the pitfalls list, the reduced-motion summary |

The library this skill installs, `lenis`, is MIT, Copyright (c) darkroom.engineering, at
<https://github.com/darkroomengineering/lenis>. GSAP and its ScrollTrigger plugin are
covered by GSAP's standard "no charge" licence: free to use, not open source, not MIT.

Full provenance, including the verification ledger for every artefact consulted, is in
`assets/sources.md` beside this file.
