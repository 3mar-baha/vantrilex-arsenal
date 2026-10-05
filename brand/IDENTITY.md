# Vantrilex Arsenal — visual identity

The Arsenal provisions a curated, version-pinned kit onto a target project and then governs how
that kit is used. Two halves, one boundary between them: selection on one side, conduct on the
other. The identity is built from that shape.

---

## 1. The concept

**An armory that has been arranged, not a pile.**

The failure mode this identity is designed against is *accumulation*. An arsenal that reads as a
heap of parts is indistinguishable from a bundle of everything, and a bundle of everything is
exactly what this repository refuses to be. So the mark is not a shield stamped with a letter. It
is a **shield, three bars, one ground, and a beam**, and each of those four things is a promise the
repository actually makes.

- The **shield** is the boundary. The plugin provisions; it does not decide. Selection lives in the
  Registry and `kit/kit.lock`, conduct lives in Doctrine, and the plugin only enforces what those two
  declare. The shield is that line, drawn once.
- The **three bars** are the three tiers: Prime orients, Vanguard scouts, Doctrine governs. They are
  the same width and evenly spaced. Equal, because none of the three may expand into another.
- The **ground line** is `kit/kit.lock`. The bars stand on it, not in it. That is the version pin:
  a project that equipped last quarter gets the same components it got last quarter.
- The **beam** is the rule in motion. Royal blue carries everything load-bearing; light blue is
  always the thing that *moves* — the sweep across the bars, the scan down the grid, the signal
  travelling the ground line.

Three layers, one ground. Royal blue is structure. Light blue is signal. White is the surface the
kit sits on. Black is the type and the rule.

**The mark is static. Everything else breathes.**

This is the hard boundary of the identity, not a stylistic preference. A logo that animates cannot
be printed, cannot be used as a favicon, cannot be etched, cannot be reproduced identically by two
people in two terminals, and cannot be trusted to render the same tomorrow. Every asset under
`brand/logo/` is therefore static XML with no motion of any kind, verified by grep. The living part
of the identity is the icon family, and that is where all the motion lives.

---

## 2. The palette

Exactly four values. There is no fifth colour in this identity.

| Name | Hex | Role |
|---|---|---|
| Royal blue | `#4169E1` | The primary. Structure, the shield, the bars, the ground, the outline of every icon. Authority and load-bearing form. |
| Light blue | `#ADD8E6` | The secondary. Always the signal that moves — the beam, the sweep ring, the scan, the threshold line. Depth and the softer register. |
| White | `#FFFFFF` | The ground and the reverse. What the mark becomes on a dark surface. |
| Black | `#000000` | Type, the bench line under the gavel, and the one-colour reduction of the mark. |

Rules:

- **No fifth colour.** Not a grey, not a tint, not a gradient stop. Transparency is expressed with
  `fill-opacity` / `stroke-opacity` on an approved colour, never by inventing a new hex.
- **Royal blue is never the outline on a dark ground.** `#4169E1` against `#000000` does not hold
  contrast, so the dark variants invert to white and keep only the light blue beam. This is a
  deliberate inversion inside the same four values, not a new palette.
- **Light blue is never the only carrier of meaning.** It is always paired with royal blue, because
  `#ADD8E6` on white is a low-contrast accent and must not be asked to carry information alone.
- **`brand/icons/` is built for a light ground only.** On a dark surface use the dark logo variants;
  do not invert the icons ad hoc.

---

## 3. Assets

Twenty-three SVGs. Five in the logo, nine static icons, nine animated icons.

### 3.1 Logo — static, no exceptions

| File | Purpose |
|---|---|
| `brand/logo/arsenal-mark-light.svg` | The primary mark for a white or light surface. 64x64. |
| `brand/logo/arsenal-mark-dark.svg` | The same mark reversed for a black or dark surface. Shield, bars and ground become white; the beam stays light blue. 64x64. |
| `brand/logo/arsenal-mark-mono.svg` | One-colour reduction in black. The beam is deliberately **dropped**: in a single ink it would be indistinguishable from the bars it crosses. Use for stamps, favicons, and print. 64x64. |
| `brand/logo/arsenal-lockup-light.svg` | Horizontal lockup: mark plus the Vantrilex stencil wordmark, underlined in light blue. 272x64. |
| `brand/logo/arsenal-lockup-dark.svg` | The same lockup reversed for a dark surface. 272x64. |

The wordmark is an original monoline stencil construction on a 28-unit cap height with a 5-unit
letterspace, drawn from straight segments and one semicircular bowl in the `R`. It is not a
converted typeface.

### 3.2 Icons — static

All nine are on a 24x24 grid, `stroke-width: 1.75`, round caps and joins, and are built for a light
ground.

| File | Purpose |
|---|---|
| `brand/icons/tier-prime.svg` | Orientation. A bearing arrow over the ground line, with a light blue stretch of that line. Prime answers *where the Arsenal is*. |
| `brand/icons/tier-vanguard.svg` | Scouting. A compass needle inside a light blue sweep ring. Vanguard answers *what does this project need?* |
| `brand/icons/tier-doctrine.svg` | Governance. A gavel resting on the black bench line. Doctrine answers *how is the kit used?* |
| `brand/icons/three-tier.svg` | The three tiers as stacked plates: orientation, then selection, then conduct. |
| `brand/icons/registry-grid.svg` | The pinned component set. A 3x3 grid with the selected cell in light blue. |
| `brand/icons/verification-gate.svg` | The six verification gates as a barrier: six posts, two rails, one light blue threshold. One post per gate. |
| `brand/icons/component.svg` | One kit component, its seam in light blue. The unit the Registry enumerates. |
| `brand/icons/workflow-dag.svg` | The directed acyclic workflow: two sources, two routes, one sink. |
| `brand/icons/armed-kit.svg` | The provisioned kit in full: three crates. |

### 3.3 Icons — animated

Each of the nine has an animated sibling with the same geometry, in `brand/animated/`.

| File | Motion | Period |
|---|---|---|
| `brand/animated/tier-prime.svg` | The arrow rocks +/-18 degrees; the light blue segment travels the ground line. | 4s |
| `brand/animated/tier-vanguard.svg` | The needle sweeps +/-30 degrees; the light blue ring breathes outward and back. | 4s |
| `brand/animated/tier-doctrine.svg` | The gavel strikes +/-13 degrees about its contact point; the bench line holds at full weight on the downbeat. | 4s |
| `brand/animated/three-tier.svg` | The three plates lift and settle one third of a cycle apart; the light blue rule beneath breathes. | 6s |
| `brand/animated/registry-grid.svg` | A light blue scan bar travels down the grid and back. | 4s |
| `brand/animated/verification-gate.svg` | The six posts brighten one second apart, so one pass runs the whole barrier. | 6s |
| `brand/animated/component.svg` | The shell draws itself by stroke offset, the lid seam a third of a cycle behind it. | 6s |
| `brand/animated/workflow-dag.svg` | The primary path traces, the converging path follows, each node coming up as its path lands. | 6s |
| `brand/animated/armed-kit.svg` | The three crates settle onto the stack two seconds apart. | 6s |

**There is no animated logo. There will never be one.**

---

## 4. Static versus animated, per file

| File | State |
|---|---|
| `brand/logo/arsenal-mark-light.svg` | **static** |
| `brand/logo/arsenal-mark-dark.svg` | **static** |
| `brand/logo/arsenal-mark-mono.svg` | **static** |
| `brand/logo/arsenal-lockup-light.svg` | **static** |
| `brand/logo/arsenal-lockup-dark.svg` | **static** |
| `brand/icons/*.svg` (9 files) | **static** |
| `brand/animated/*.svg` (9 files) | **animated** |

Static means: no `<animate>`, no `<animateTransform>`, no `<animateMotion>`, no SMIL, no
`@keyframes`, no `<script>`, no external reference of any kind. Verified by grep, not by assertion.

---

## 5. The duration grid

The animated family shares one grid, so a set used together reads as a single system rather than as
several unrelated loops.

**Base tick: 2.0 seconds.** Every period is an integer number of ticks, so any combination of assets
returns to its exact starting state together every **12 seconds** — the least common multiple of the
two periods in use.

| Group | Period | Ticks | Members |
|---|---|---|---|
| Beat A | 4.0s | 2 | `tier-prime`, `tier-vanguard`, `tier-doctrine`, `registry-grid` |
| Beat B | 6.0s | 3 | `three-tier`, `verification-gate`, `component`, `workflow-dag`, `armed-kit` |

The three tier icons share Beat A with identical phase, so Prime, Vanguard and Doctrine visibly
breathe together rather than drifting apart. Within Beat B, stagger is expressed in whole ticks:
`-2s` and `-4s` on the 6s period, so a wave runs through a group in a known order instead of an
arbitrary one. The six gate posts are staggered at `-1s` intervals, which is a sixth of their own
period, so one complete pass visits all six.

**Easing.** Every animation uses a single curve:

```
cubic-bezier(0.45, 0, 0.55, 1)
```

This is the SMIL equivalent `calcMode="spline" keySplines="0.45 0 0.55 1"`. Nothing loops linearly
and nothing overshoots; a linear loop reads as mechanical and a bounce reads as a glitch. Durations
stay between 4 and 6 seconds — this is a professional developer tool and nothing here should pulse
urgently.

**What moves.** Only `transform`, `opacity` and `stroke-dashoffset`. No layout-affecting property is
ever animated. `r`, width, height and positions are fixed in the markup; the scan bar, for instance,
travels by transform rather than by changing its geometry.

**Loops are seamless.** Every `@keyframes` block declares a `0%` state and a `100%` state, and the two
are identical. That is machine-checked, not a promise: see §7.

### Reduced motion

Every animated file carries a `prefers-reduced-motion: reduce` block that sets `animation: none` and
pins the resting state explicitly, so a user with reduced motion enabled sees the *complete* image
rather than a frame caught mid-sweep. Concretely: the light blue signal in `tier-prime` and the
bench line in `tier-doctrine` are forced back to full opacity; the gate posts are forced to full
opacity rather than their dimmed 0.28 idle.

CSS animation was chosen over SMIL for this reason: a `prefers-reduced-motion` media query reliably
disables CSS animation, whereas SMIL cannot be paused that way in every engine. Independently of
that, the un-animated markup of each animated file is already a complete, correct icon, so even an
engine that ignores the media query shows a finished image.

---

## 6. Usage rules

**Where assets belong.**

| Placement | Asset |
|---|---|
| `README.md` header | `brand/logo/arsenal-lockup-light.svg` |
| `README.ar.md` header | `brand/logo/arsenal-lockup-light.svg` |
| `AI_GUIDE.md` header | `brand/logo/arsenal-mark-light.svg` |
| `docs/` page headers | `brand/logo/arsenal-mark-light.svg`; `arsenal-lockup-light.svg` on the docs index |
| Skill headers (`.opencode/skills/*/SKILL.md`) | The matching tier icon from `brand/icons/` — `tier-prime`, `tier-vanguard`, `tier-doctrine` |
| Release notes / `CHANGELOG.md` | `brand/logo/arsenal-mark-mono.svg`, once per release, never repeated per entry |
| Any dark banner, terminal splash, or dark-mode doc | `brand/logo/arsenal-mark-dark.svg` or `brand/logo/arsenal-lockup-dark.svg` |
| Favicon, app icon, print, embroidery, single-colour reproduction | `brand/logo/arsenal-mark-mono.svg` |
| Where motion is appropriate (docs landing, README motion demo, animated badge) | `brand/animated/*.svg` — **never a logo file** |

**Where assets must NOT be used.**

- **The logo is never animated.** Not as a GIF, not with SMIL, not with CSS. If an asset needs to
  move, it is an icon from `brand/animated/`, and the static logo is what it derives from.
- **The palette has no fifth colour.** No greys, no tints, no off-brand blues, no gradient outside
  these four values. If something needs transparency, use `fill-opacity` or `stroke-opacity` on an
  approved colour.
- **The mono mark is not a recolour of the primary mark.** It is a separate reduction with the beam
  removed. Do not recolour `arsenal-mark-light.svg` to black and expect the mono result; the beam
  will be visible as an indistinguishable band.
- **Icons are not for dark grounds.** `brand/icons/` is authored for white. On a dark surface, use a
  dark logo variant.
- **Light blue never carries meaning alone.** It is an accent paired with royal blue.
- **The mark is not redrawn, re-proportioned, or reconstructed per document.** If a surface needs a
  size not listed here, scale the existing file. Never re-letter the wordmark.
- **No icon is used as a decorative flourish.** Each of the nine means a specific thing; using
  `armed-kit.svg` because it looks good next to a heading is misuse.

---

## 7. Provenance and licensing

**Icon source: [IconServe](https://icons-for-agents.site/)**, from
[`asr-aditya/iconserve`](https://github.com/asr-aditya/iconserve). Base geometry was retrieved from
the plain-HTTP embed endpoints, which need no authentication and no telemetry:

```
https://icons-for-agents.site/icons/{set}/{name}.svg
```

Every icon name used here was verified by fetching it and inspecting the returned SVG before it was
used. No icon name in this directory was guessed.

**Upstream sets.** The eighteen non-logo assets are nine icon designs plus their nine animated
counterparts, and all nine icon geometries derive their base geometry from **Lucide** (ISC) — two of
them, `verification-gate` and `workflow-dag`, recomposed on the 24 grid. The shield-and-gate mark and
its wordmark are original.

| Asset | Upstream set | Licence position |
|---|---|---|
| `brand/icons/tier-prime.svg`, `brand/animated/tier-prime.svg` | Lucide — `navigation` | ISC |
| `brand/icons/tier-vanguard.svg`, `brand/animated/tier-vanguard.svg` | Lucide — `compass` | ISC |
| `brand/icons/tier-doctrine.svg`, `brand/animated/tier-doctrine.svg` | Lucide — `gavel` | ISC |
| `brand/icons/three-tier.svg`, `brand/animated/three-tier.svg` | Lucide — `layers` | ISC |
| `brand/icons/registry-grid.svg`, `brand/animated/registry-grid.svg` | Lucide — `grid-3x3` | ISC |
| `brand/icons/verification-gate.svg`, `brand/animated/verification-gate.svg` | Lucide — `fence` (post silhouette only; the barrier was recomposed to six posts) | ISC |
| `brand/icons/component.svg`, `brand/animated/component.svg` | Lucide — `box` | ISC |
| `brand/icons/workflow-dag.svg`, `brand/animated/workflow-dag.svg` | Lucide — `git-branch` (extended by one converging path and a terminating node) | ISC |
| `brand/icons/armed-kit.svg`, `brand/animated/armed-kit.svg` | Lucide — `boxes` | ISC |
| `brand/logo/arsenal-mark-*.svg`, `brand/logo/arsenal-lockup-*.svg` | Original — no upstream geometry | This repository |

Every icon name in that table was fetched and the returned SVG inspected before use. None was
guessed, and none is `unverified`. Upstream icons are fetched without attribution metadata from
IconServe, so the licence column above records the licence of the named upstream set rather than a
per-icon licence string read from the response — IconServe returns no per-icon licence field.

`simple-icons` was deliberately **not** used. Brand marks in that set are third-party trademarks, and
the Arsenal is a tool; shipping another company's trademark as its own identity would be wrong. The
four preferred sets (`lucide`, `tabler`, `phosphor`, `heroicons`) all carry permissive licences, and
Lucide alone covered every motif required.

**Colouring.** No upstream fill or stroke colour is retained. Every asset was recoloured to the four
approved values, which removes any dependency on upstream colour choices.

---

## 8. How the assets were produced

**None of these files was downloaded and dropped in.** Every one was hand-composed.

- The **shield, bars, ground and beam** of the mark are original geometry, drawn on a 64-unit grid
  with the three bars spaced evenly about the vertical centre and the beam spanning the shield's
  interior width.
- The **wordmark** is an original monoline stencil letterform set: nine glyphs on a 28-unit cap
  height, built from straight segments and a single semicircular bowl. It is drawn, not typeset, and
  it references no font file.
- The **icons** begin from Lucide path data, then were re-authored for this identity: stroke weight
  set to 1.75, colours replaced with the four approved values, fills substituted for strokes where a
  heavier mass was needed, and the light blue accent added as a second element. The verification
  barrier was recomposed from three posts to six so it matches the six gates the repository
  actually runs; the workflow graph was extended from one branch to a two-source directed acyclic
  graph.
- **The geometry inside the shield comes from no upstream set at all.** The Lucide shield and the
  Lucide hexagon were inspected during design and rejected: the shield was discarded as too generic,
  and the hexagon as the wrong metaphor for an armory that is arranged rather than packed.

What is derived: the Lucide path data listed in §7. What is original: the mark, the wordmark, the
beam, the ground line, the light blue accent in every asset, the six-post barrier, the two-source
workflow graph, and the composition of all of it.

---

## 9. Verification

Every claim in §4, §5 and §7 that can be machine-checked was checked against these 23 files, with
real recorded output. The checks cover: the four approved hex values and nothing else; zero motion in
`brand/logo/` and `brand/icons/`; motion present in every file under `brand/animated/`;
`prefers-reduced-motion` present in every animated file; XML tag balance in every file; LF endings, no
BOM, no tabs, no trailing whitespace; no external URL, no `<image>`, no font reference, no
`<script>`; every `@keyframes` block returning exactly to its `0%` state at `100%`; and no animated
property outside `transform`, `opacity` and `stroke-dashoffset`.

Two of those checks were run in a real renderer rather than by inspection: headless Chrome reports
every animation in the family as running at its stated 4s or 6s duration, and the whole family
rendered at phase 0 and at phase 12000ms produces byte-identical output, which is the 12-second grid
of §5 confirmed in pixels rather than in prose. A negative control at phase 2200ms renders
differently, so that equality is a real result and not a harness that cannot see motion.

The check script is a throwaway and is not committed to the repository, which is Node-only,
zero-dependency, and holds no asset tooling it does not need.
