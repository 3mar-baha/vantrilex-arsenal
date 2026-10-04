# formatting

The `formatting` kind holds design-system reference documents that let a coding agent
generate UI which matches a known brand system instead of inventing one: colour tokens,
typography scales, spacing, radii, shadows, and component conventions, expressed as prose an
agent can follow. Vantrilex Vanguard provisions this kind as a **Tier-1 conditional kit** for
UI-heavy projects, and the kit is mutually exclusive — **a project selects exactly ONE design
system, never several**. That makes the relationship a `supersedes` edge: exactly one winner
per project, and no universal winner that fits every codebase, because a UI built to two
competing systems at once is neither.

- **Registry record id** — `formatting-design-md-set`
- **Source** — <https://github.com/voltagent/awesome-design-md> (MIT, Copyright (c) 2026 VoltAgent)
- **Vendored** — 12 of 74 upstream brands, per the D11 curation decision that bounds repository size
- **Licence and provenance** — [ATTRIBUTION.md](./ATTRIBUTION.md)

## Vendored brands (12)

| Brand | Upstream path | Vendored | Use when |
|-------|---------------|----------|----------|
| `airbnb` | `design-md/airbnb/` | yes | Warm, editorial hospitality or marketplace UI |
| `claude` | `design-md/claude/` | yes | Conversational AI product UI, restrained typography |
| `figma` | `design-md/figma/` | yes | Design-tool and canvas-centric product UI |
| `linear.app` | `design-md/linear.app/` | yes | Dense, keyboard-driven product UI |
| `notion` | `design-md/notion/` | yes | Document and knowledge-base editor UI |
| `opencode.ai` | `design-md/opencode.ai/` | yes | Terminal-adjacent developer tool or AI coding UI |
| `raycast` | `design-md/raycast/` | yes | Launcher, palette, and command-surface UI |
| `shopify` | `design-md/shopify/` | yes | Commerce, storefront, and merchant admin UI |
| `slack` | `design-md/slack/` | yes | Team chat, channels, and threaded messaging UI |
| `stripe` | `design-md/stripe/` | yes | Developer docs and enterprise billing surfaces |
| `supabase` | `design-md/supabase/` | yes | Database, SQL editor, and developer console UI |
| `vercel` | `design-md/vercel/` | yes | Minimal, technical, AI-native product UI |

Eleven of the twelve carry both `DESIGN.md` and `README.md`. `slack` carries `DESIGN.md`
only: upstream has no `design-md/slack/README.md` at any path casing and the request returns
HTTP 404. Nothing was written in its place, because a fabricated file attributed to VoltAgent
would be a licence violation as well as an invention. See
[ATTRIBUTION.md](./ATTRIBUTION.md#known-gap-slackreadmemd-does-not-exist-upstream).

## Upstream catalogue (74)

All 74 brand design documents published upstream. `vendored: no` means the brand is documented
here for discoverability but its content is not present in this repository; fetch it from
upstream as described in [ATTRIBUTION.md](./ATTRIBUTION.md#fetching-the-other-62-brands).

| Brand | Upstream path | Vendored |
|-------|---------------|----------|
| `airbnb` | `design-md/airbnb/DESIGN.md` | yes |
| `airtable` | `design-md/airtable/DESIGN.md` | no |
| `apple` | `design-md/apple/DESIGN.md` | no |
| `binance` | `design-md/binance/DESIGN.md` | no |
| `bmw` | `design-md/bmw/DESIGN.md` | no |
| `bmw-m` | `design-md/bmw-m/DESIGN.md` | no |
| `bugatti` | `design-md/bugatti/DESIGN.md` | no |
| `cal` | `design-md/cal/DESIGN.md` | no |
| `claude` | `design-md/claude/DESIGN.md` | yes |
| `clay` | `design-md/clay/DESIGN.md` | no |
| `clickhouse` | `design-md/clickhouse/DESIGN.md` | no |
| `cohere` | `design-md/cohere/DESIGN.md` | no |
| `coinbase` | `design-md/coinbase/DESIGN.md` | no |
| `composio` | `design-md/composio/DESIGN.md` | no |
| `cursor` | `design-md/cursor/DESIGN.md` | no |
| `dell-1996` | `design-md/dell-1996/DESIGN.md` | no |
| `elevenlabs` | `design-md/elevenlabs/DESIGN.md` | no |
| `expo` | `design-md/expo/DESIGN.md` | no |
| `ferrari` | `design-md/ferrari/DESIGN.md` | no |
| `figma` | `design-md/figma/DESIGN.md` | yes |
| `framer` | `design-md/framer/DESIGN.md` | no |
| `hashicorp` | `design-md/hashicorp/DESIGN.md` | no |
| `hp` | `design-md/hp/DESIGN.md` | no |
| `ibm` | `design-md/ibm/DESIGN.md` | no |
| `intercom` | `design-md/intercom/DESIGN.md` | no |
| `kraken` | `design-md/kraken/DESIGN.md` | no |
| `lamborghini` | `design-md/lamborghini/DESIGN.md` | no |
| `linear.app` | `design-md/linear.app/DESIGN.md` | yes |
| `lovable` | `design-md/lovable/DESIGN.md` | no |
| `mastercard` | `design-md/mastercard/DESIGN.md` | no |
| `meta` | `design-md/meta/DESIGN.md` | no |
| `minimax` | `design-md/minimax/DESIGN.md` | no |
| `mintlify` | `design-md/mintlify/DESIGN.md` | no |
| `miro` | `design-md/miro/DESIGN.md` | no |
| `mistral.ai` | `design-md/mistral.ai/DESIGN.md` | no |
| `mongodb` | `design-md/mongodb/DESIGN.md` | no |
| `nike` | `design-md/nike/DESIGN.md` | no |
| `nintendo-2001` | `design-md/nintendo-2001/DESIGN.md` | no |
| `notion` | `design-md/notion/DESIGN.md` | yes |
| `nvidia` | `design-md/nvidia/DESIGN.md` | no |
| `ollama` | `design-md/ollama/DESIGN.md` | no |
| `opencode.ai` | `design-md/opencode.ai/DESIGN.md` | yes |
| `pinterest` | `design-md/pinterest/DESIGN.md` | no |
| `playstation` | `design-md/playstation/DESIGN.md` | no |
| `posthog` | `design-md/posthog/DESIGN.md` | no |
| `raycast` | `design-md/raycast/DESIGN.md` | yes |
| `renault` | `design-md/renault/DESIGN.md` | no |
| `replicate` | `design-md/replicate/DESIGN.md` | no |
| `resend` | `design-md/resend/DESIGN.md` | no |
| `revolut` | `design-md/revolut/DESIGN.md` | no |
| `runwayml` | `design-md/runwayml/DESIGN.md` | no |
| `sanity` | `design-md/sanity/DESIGN.md` | no |
| `sentry` | `design-md/sentry/DESIGN.md` | no |
| `shopify` | `design-md/shopify/DESIGN.md` | yes |
| `slack` | `design-md/slack/DESIGN.md` | yes |
| `spacex` | `design-md/spacex/DESIGN.md` | no |
| `spotify` | `design-md/spotify/DESIGN.md` | no |
| `starbucks` | `design-md/starbucks/DESIGN.md` | no |
| `stripe` | `design-md/stripe/DESIGN.md` | yes |
| `supabase` | `design-md/supabase/DESIGN.md` | yes |
| `superhuman` | `design-md/superhuman/DESIGN.md` | no |
| `tesla` | `design-md/tesla/DESIGN.md` | no |
| `theverge` | `design-md/theverge/DESIGN.md` | no |
| `together.ai` | `design-md/together.ai/DESIGN.md` | no |
| `uber` | `design-md/uber/DESIGN.md` | no |
| `vercel` | `design-md/vercel/DESIGN.md` | yes |
| `vodafone` | `design-md/vodafone/DESIGN.md` | no |
| `voltagent` | `design-md/voltagent/DESIGN.md` | no |
| `warp` | `design-md/warp/DESIGN.md` | no |
| `webflow` | `design-md/webflow/DESIGN.md` | no |
| `wired` | `design-md/wired/DESIGN.md` | no |
| `wise` | `design-md/wise/DESIGN.md` | no |
| `x.ai` | `design-md/x.ai/DESIGN.md` | no |
| `zapier` | `design-md/zapier/DESIGN.md` | no |

## Licensing

Every document under `brands/` is third-party work from `voltagent/awesome-design-md`, licensed
MIT, Copyright (c) 2026 VoltAgent. The verbatim licence text is reproduced in
[ATTRIBUTION.md](./ATTRIBUTION.md) and stored next to the content at
`brands/LICENSE.voltagent-MIT`. These files are unmodified copies retained under the upstream
MIT terms and are treated by the Registry as reference material for coding agents, not as
Vantrilex-authored content. Vendoring a document here grants no rights beyond those MIT terms
grant, and implies no endorsement of the design system it describes.
