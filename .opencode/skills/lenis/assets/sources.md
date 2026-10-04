# Sources and provenance

Provenance record for the components in this kit. Licences are recorded **for
information only** — a licence was never used as a selection filter. Every entry below
was verified by a read-only query on 2026-10-04; nothing here is copied from memory.

Format of each entry: upstream repository, the exact path read, the licence as declared
upstream, and what was actually taken into which component.

## Adaptation sources

| # | Repository | Licence as declared upstream | Path read | Taken |
| --- | --- | --- | --- | --- |
| 1 | `jumagu/skills` | MIT, Copyright (c) 2026 jumagu — `LICENSE` | `skills/lenis/SKILL.md` | The rule that exactly one thing owns the `lenis.raf(time)` call; the "Lenis wraps native scroll, so sticky/anchors/a11y keep working" framing; the ordered eight-step diagnostic ladder; the `respectReducedMotion` treatment; the `data-lenis-prevent` attribute family; the limitations list (Safari 60fps cap, iframes, `syncTouch` on old iOS). Into `lenis`. |
| 2 | `Tromset/motion-design-toolkit` | **None declared.** The repository tree contains no licence file and `licenseInfo` is `null`. Recorded as unverified rather than assumed permissive. | `motion-design-toolkit/skills/lenis/SKILL.md` | The key-options table with defaults; the properties-and-methods table; the `scrollTo` option list; the `ReactLenis` / `useLenis` prop table; the GSAP ticker recipe; the ecosystem map (`lenis/react`, `lenis/vue`, `lenis/snap`, `lenis/framer`); the pitfalls list. Into `lenis`. |
| 3 | `RL22/my-agent-skills` | MIT, Copyright (c) 2026 Rodney Lewis — `LICENSE` | `skills/og-image/SKILL.md`, `skills/og-image/references/satori-constraints.md` | The eight-archetype layout taxonomy; the brand-token indirection rule (never hardcode a brand into a template); the Satori constraint set (flex-only, no CSS Grid, no `inset` shorthand, no CSS variables, the `radial-gradient` dot-grid collapse, the mandatory SVG `viewBox`, six-digit hex colours); the seeded-PRNG determinism rule; the font-loading policy (unquoted family name in the `fonts` option, quoted inside `fontFamily`); the "a clean type-check is not proof it renders" verification stance. Into `og-image`. |
| 4 | `soilmass/gelato` | MIT, Copyright (c) 2026 Neopolitan — `LICENSE` | `skills/open-graph-image/SKILL.md`, `skills/open-graph-image/references/opengraph-image-api.md` | The five mechanical violation classes (missing `size`, missing `contentType`, default export not returning `ImageResponse`, Tailwind `className` inside the JSX, non-edge-safe module-scope imports); the explicit encode/do-not-encode boundary against the Next.js docs; the supported/unsupported CSS split for Satori; the edge-runtime import rationale; the `generateImageMetadata` leniency rule; the post-deploy validator list. Into `open-graph-image`. |

Sources 3 and 4 overlap only at the Satori constraint layer, and they approach the
problem from opposite directions: source 3 is generative (choose a layout, then build and
render it) while source 4 is mechanical (check a file against five rules). Each resulting
skill states that boundary in its own Purpose rather than duplicating the other.

## Verification ledger for the referenced libraries and products

| Artefact | Query | Result on 2026-10-04 |
| --- | --- | --- |
| `github.com/darkroomengineering/lenis` | `gh repo view --json nameWithOwner,visibility,licenseInfo,stargazerCount,pushedAt` | Exists, PUBLIC, MIT, 16156 stars, last push 2026-10-02 |
| npm `lenis` | `npm view lenis name version license description` | Exists. Version **1.3.26**, MIT, "How smooth scroll should be". Install path `npm i lenis` confirmed |
| npm `lenis-mcp-server` | `npm view lenis-mcp-server` | **Does not exist.** `E404 Not Found`. Also 404: `lenis-mcp`, `@lenis/mcp-server`, `mcp-server-lenis`, `lenis-mcp-servers`. A registry-wide `npm search lenis` surfaced no MCP server package. Record `install_cmd: null` with `verification: unverified` |
| `github.com/vercel/og` | `gh repo view vercel/og`, `gh api repos/vercel/og` | **No such repository** — `HTTP 404`, and GraphQL reports it cannot resolve. The work order's "MPL-2.0" does not come from this repo |
| npm `@vercel/og` | `npm view @vercel/og name version license description` | Exists. Version **1.0.3**, **MPL-2.0**, "Generate Open Graph Images dynamically from HTML/CSS without a browser". The MPL-2.0 claim is true of the *package*, not of a `vercel/og` repo |
| `github.com/vercel/og-image` | `gh repo view vercel/og-image --json ...` | Exists, PUBLIC, MIT, 4042 stars, last push 2023-01-20. This is the real "Open Graph Image as a Service" repository |
| npm `next` | `npm view next version license` | Version **16.3.8**, MIT. The `next/og` entry point ships inside it. Source 4's methodology cites the Next.js 15 docs verified 2026-04-19; the file-convention rules it encodes still hold, but the version reference is behind the current release |
| `github.com/rksekar5/a11y-audit` | `gh repo view rksekar5/a11y-audit --json ...` | Exists, PUBLIC, MIT, 1 star, last push 2026-06-01. Confirms the work order |
| npm `gsap` | `npm view gsap version license` | Version 3.15.0, licence string is "Standard 'no charge' license". `greensock/GSAP` reports `licenseInfo: null`. ScrollTrigger is free to use and is **not** open source and **not** MIT — recorded so no downstream component describes it as MIT or vendors its source |

## How to read this file

The table above is a record of what was read, not a claim that upstream remains
unchanged. Re-run the same read-only queries before relying on any version number; the
`lenis` pin of 1.3.26 in `SKILL.md` is the version current when this file was written, and
the skill tells the reader to check `npm view lenis version` rather than trust the pin.
