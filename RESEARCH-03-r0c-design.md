# RESEARCH-03 r0c — awesome-design-md DESIGN.md inventory (v0.6.5 bundle input)

- Lane: `VTA-EXPANSION-03`
- Node: `r0c-design-inventory` (wave 2 of 14)
- Owner: `explore` (thoroughness: very thorough)
- Date (UTC): 2026-10-15
- Upstream: <https://github.com/voltagent/awesome-design-md> (`main`)
- Local curation record: `registry/formatting/_index.md` + `registry/formatting/ATTRIBUTION.md`
- Deliverable: `RESEARCH-03-r0c-design.md` (repo root) — binding input for `r0-synth` → `RESEARCH-03.md` → `d65-bundle`

## 1. Required command evidence (verbatim, with exit codes)

### 1a. Branch — must print `wt/vta-expansion-03`

Command:

```powershell
git rev-parse --abbrev-ref HEAD; echo EXIT:$LASTEXITCODE
```

Output (verbatim):

```text
wt/vta-expansion-03
EXIT:0
```

Exit code: `0`. Working directory: `O:\vantrilex-arsenal`.

### 1b. LIVE upstream DESIGN.md total — recounted, never transcribed

Counting command (live GitHub API tree, filtered to exactly one `DESIGN.md` per brand directory):

```powershell
$u = 'repos/voltagent/awesome-design-md/git/trees/main?recursive=1'; gh api $u --jq '[.tree[].path | select(test(\"^design-md/[^/]+/DESIGN\\.md$\"))] | length'; echo EXIT:$LASTEXITCODE
```

Output (verbatim):

```text
84
EXIT:0
```

Exit code: `0`. Working directory: `O:\vantrilex-arsenal`.

> The total **84** is the output of the counting command above. It is not copied from any brief, badge, or prior document. The badge on the upstream README (`DESIGN.md count-84`) agrees with it but is not the source of the count.

Supporting enumeration command (same tree, sorted listing — proves the 84 rows in §4 are the counted set):

```powershell
$u = 'repos/voltagent/awesome-design-md/git/trees/main?recursive=1'; gh api $u --jq '[.tree[].path | select(test(\"^design-md/[^/]+/DESIGN\\.md$\"))] | sort | .[]'; echo EXIT:$LASTEXITCODE
```

Output tail (verbatim, full 84-line output observed 2026-10-15, exit `0`):

```text
design-md/1win/DESIGN.md
design-md/airbnb/DESIGN.md
design-md/airtable/DESIGN.md
design-md/aljazeera/DESIGN.md
design-md/apple/DESIGN.md
design-md/binance/DESIGN.md
design-md/bmw-m/DESIGN.md
design-md/bmw/DESIGN.md
design-md/bugatti/DESIGN.md
design-md/cal/DESIGN.md
design-md/claude/DESIGN.md
design-md/clay/DESIGN.md
design-md/clickhouse/DESIGN.md
design-md/cohere/DESIGN.md
design-md/coinbase/DESIGN.md
design-md/composio/DESIGN.md
design-md/cursor/DESIGN.md
design-md/dell-1996/DESIGN.md
design-md/dji/DESIGN.md
design-md/elevenlabs/DESIGN.md
design-md/expo/DESIGN.md
design-md/ferrari/DESIGN.md
design-md/figma/DESIGN.md
design-md/framer/DESIGN.md
design-md/hashicorp/DESIGN.md
design-md/hp/DESIGN.md
design-md/ibm/DESIGN.md
design-md/intercom/DESIGN.md
design-md/jobright/DESIGN.md
design-md/kraken/DESIGN.md
design-md/lamborghini/DESIGN.md
design-md/linear.app/DESIGN.md
design-md/lovable/DESIGN.md
design-md/mastercard/DESIGN.md
design-md/mercury/DESIGN.md
design-md/meta/DESIGN.md
design-md/minimax/DESIGN.md
design-md/mintlify/DESIGN.md
design-md/miro/DESIGN.md
design-md/mistral.ai/DESIGN.md
design-md/mongodb/DESIGN.md
design-md/mydealz/DESIGN.md
design-md/nerdwallet/DESIGN.md
design-md/nike/DESIGN.md
design-md/nintendo-2001/DESIGN.md
design-md/notion/DESIGN.md
design-md/nvidia/DESIGN.md
design-md/ollama/DESIGN.md
design-md/opencode.ai/DESIGN.md
design-md/oracle/DESIGN.md
design-md/oura/DESIGN.md
design-md/pinterest/DESIGN.md
design-md/playstation/DESIGN.md
design-md/posthog/DESIGN.md
design-md/raycast/DESIGN.md
design-md/renault/DESIGN.md
design-md/replicate/DESIGN.md
design-md/resend/DESIGN.md
design-md/revolut/DESIGN.md
design-md/runwayml/DESIGN.md
design-md/sanity/DESIGN.md
design-md/sap/DESIGN.md
design-md/sentry/DESIGN.md
design-md/shopify/DESIGN.md
design-md/slack/DESIGN.md
design-md/spacex/DESIGN.md
design-md/spotify/DESIGN.md
design-md/starbucks/DESIGN.md
design-md/stripe/DESIGN.md
design-md/supabase/DESIGN.md
design-md/superhuman/DESIGN.md
design-md/tesla/DESIGN.md
design-md/theverge/DESIGN.md
design-md/together.ai/DESIGN.md
design-md/uber/DESIGN.md
design-md/vercel/DESIGN.md
design-md/vodafone/DESIGN.md
design-md/voltagent/DESIGN.md
design-md/warp/DESIGN.md
design-md/webflow/DESIGN.md
design-md/wired/DESIGN.md
design-md/wise/DESIGN.md
design-md/x.ai/DESIGN.md
design-md/zapier/DESIGN.md
EXIT:0
```

Local vendored-set size (for contrast — this is NOT the bundle total):

```powershell
(Get-ChildItem -Recurse -Filter DESIGN.md registry/formatting/brands).Count
```

Output observed: `12` (the 12 curated brands under `O:\vantrilex-arsenal\registry\formatting\brands`). No exit-code variable is set by a pure cmdlet; the two mandatory exit codes above are reported verbatim.

## 2. License reconfirmation — MIT, observed live (not assumed)

**Verdict: MIT, Copyright (c) 2026 VoltAgent — reconfirmed live on 2026-10-15 from three independent observed sources.**

### Observed source 1 — live upstream LICENSE via authenticated GitHub API

Command:

```powershell
$u = 'repos/voltagent/awesome-design-md/contents/LICENSE'; gh api $u -H 'Accept: application/vnd.github.raw'; echo EXIT:$LASTEXITCODE
```

Output (verbatim, exit `0`):

```text
MIT License

Copyright (c) 2026 VoltAgent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EXIT:0
```

### Observed source 2 — raw file over HTTPS (unauthenticated cross-check)

URL fetched: `https://raw.githubusercontent.com/voltagent/awesome-design-md/main/LICENSE`

Content (verbatim, identical to source 1):

```text
MIT License

Copyright (c) 2026 VoltAgent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Observed source 3 — upstream repo page + README (2026-10-15 fetch)

- Page `https://github.com/voltagent/awesome-design-md` shows sidebar entry **MIT license**, README section `## License` stating `MIT License - see LICENSE`, and badge `DESIGN.md count-84`.
- README disclaimer observed: curated collection of design-system documents extracted from public websites, provided "as is" without warranty; extracted tokens are publicly visible CSS values; no ownership claimed over any site's visual identity.

### Observed source 4 — local vendored copy (travels with content)

- Path: `O:\vantrilex-arsenal\registry\formatting\brands\LICENSE.voltagent-MIT`
- Content: byte-identical MIT text with `Copyright (c) 2026 VoltAgent` (21 lines, verified by read 2026-10-15).
- Referenced by `O:\vantrilex-arsenal\registry\formatting\ATTRIBUTION.md` (§ Upstream MIT license text, verbatim) and `O:\vantrilex-arsenal\registry\formatting\_index.md` (§ Licensing).

**Bundle implication for v0.6.5 (`d65-bundle`):** every one of the 84 `DESIGN.md` files is redistributable under the upstream MIT terms provided the bundle reproduces the copyright line `Copyright (c) 2026 VoltAgent` and the permission notice, keeps files unmodified, and does not assert Vantrilex authorship or endorsement. The existing `ATTRIBUTION.md` + `LICENSE.voltagent-MIT` pattern already satisfies this for the 12 vendored files and must be extended to cover all 84.

## 3. What lives where today (live repo tree, 2026-10-15)

- Upstream total: **84** `design-md/<brand>/DESIGN.md` files (counted live, §1b).
- Locally vendored: **12** `DESIGN.md` files under `O:\vantrilex-arsenal\registry\formatting\brands\` (D11 curation decision bounds repo size; see `O:\vantrilex-arsenal\registry\formatting\_index.md` line 14).
- Prior catalogue staleness note: `_index.md` § Upstream catalogue lists **74** brands and `ATTRIBUTION.md` speaks of 74/12/62. That snapshot predates upstream growth to **84**. The delta is **+10** brands. `d65-bundle` must rebase the sidecar/index from the 84-row table in §4, not from the 74-row snapshot.
- Local 12 (all `DESIGN.md`, sizes observed via `Get-ChildItem`):
  - `O:\vantrilex-arsenal\registry\formatting\brands\airbnb\DESIGN.md` (30517 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\claude\DESIGN.md` (33586 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\figma\DESIGN.md` (32316 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\linear.app\DESIGN.md` (24354 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\notion\DESIGN.md` (35176 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\opencode.ai\DESIGN.md` (32647 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\raycast\DESIGN.md` (41275 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\shopify\DESIGN.md` (27067 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\slack\DESIGN.md` (24529 bytes, `README.md` absent upstream — HTTP 404, no substitute written)
  - `O:\vantrilex-arsenal\registry\formatting\brands\stripe\DESIGN.md` (24606 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\supabase\DESIGN.md` (21315 bytes) + `README.md`
  - `O:\vantrilex-arsenal\registry\formatting\brands\vercel\DESIGN.md` (41405 bytes) + `README.md`
- Each `DESIGN.md` follows the Stitch DESIGN.md format + 9 extended sections (visual theme, palette + hex + role, typography hierarchy, component stylings with states, layout/spacing/grid, depth/elevation, do's and don'ts, responsive behavior, agent prompt guide). Upstream also ships `preview.html` / `preview-dark.html` per brand — out of scope for the DESIGN.md bundle count.

## 4. Complete 84-file inventory with attribution data for the v0.6.5 bundle

Common attribution for every row (do not repeat per-row in sidecar beyond reference):

- Copyright: `Copyright (c) 2026 VoltAgent`
- License: `MIT` — full text at `https://github.com/voltagent/awesome-design-md/blob/main/LICENSE` (= `https://raw.githubusercontent.com/voltagent/awesome-design-md/main/LICENSE`) and local copy `O:\vantrilex-arsenal\registry\formatting\brands\LICENSE.voltagent-MIT`
- Source repository: `https://github.com/voltagent/awesome-design-md`
- Fetch method (single file, no clone): `gh api "repos/voltagent/awesome-design-md/contents/design-md/<brand>/DESIGN.md" -H "Accept: application/vnd.github.raw"`
- Modification status for bundle: unmodified bytes (write-through exactly as received; upstream tree SHA is the proof)
- Vantrilex status: third-party reference material, not Vantrilex-authored, no endorsement implied

`Vendored today` = present under `O:\vantrilex-arsenal\registry\formatting\brands\<brand>\DESIGN.md`. All 84 rows are in scope for `d65-bundle` regardless of this column; the 72 `no` rows are the fetch list.

| # | Brand (`<brand>`) | Upstream path | Vendored today | Proposed v0.6.5 bundle entry |
|---|-------------------|---------------|----------------|------------------------------|
| 1 | `1win` | `design-md/1win/DESIGN.md` | no | `design.md` kind, id `1win`, src `https://github.com/voltagent/awesome-design-md/blob/main/design-md/1win/DESIGN.md`, MIT ©2026 VoltAgent |
| 2 | `airbnb` | `design-md/airbnb/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\airbnb\DESIGN.md`) | same pattern; already vendored — re-verify bytes, carry attribution |
| 3 | `airtable` | `design-md/airtable/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 4 | `aljazeera` | `design-md/aljazeera/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 5 | `apple` | `design-md/apple/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 6 | `binance` | `design-md/binance/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 7 | `bmw` | `design-md/bmw/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 8 | `bmw-m` | `design-md/bmw-m/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 9 | `bugatti` | `design-md/bugatti/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 10 | `cal` | `design-md/cal/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent (upstream slug `cal` = Cal.com) |
| 11 | `claude` | `design-md/claude/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\claude\DESIGN.md`) | already vendored — carry attribution |
| 12 | `clay` | `design-md/clay/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 13 | `clickhouse` | `design-md/clickhouse/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 14 | `cohere` | `design-md/cohere/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 15 | `coinbase` | `design-md/coinbase/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 16 | `composio` | `design-md/composio/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 17 | `cursor` | `design-md/cursor/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 18 | `dell-1996` | `design-md/dell-1996/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent (retro-web series) |
| 19 | `dji` | `design-md/dji/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 20 | `elevenlabs` | `design-md/elevenlabs/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 21 | `expo` | `design-md/expo/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 22 | `ferrari` | `design-md/ferrari/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 23 | `figma` | `design-md/figma/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\figma\DESIGN.md`) | already vendored — carry attribution |
| 24 | `framer` | `design-md/framer/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 25 | `hashicorp` | `design-md/hashicorp/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 26 | `hp` | `design-md/hp/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 27 | `ibm` | `design-md/ibm/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 28 | `intercom` | `design-md/intercom/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 29 | `jobright` | `design-md/jobright/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 30 | `kraken` | `design-md/kraken/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 31 | `lamborghini` | `design-md/lamborghini/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 32 | `linear.app` | `design-md/linear.app/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\linear.app\DESIGN.md`) | already vendored — dots in folder name preserved exactly |
| 33 | `lovable` | `design-md/lovable/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 34 | `mastercard` | `design-md/mastercard/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 35 | `mercury` | `design-md/mercury/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 36 | `meta` | `design-md/meta/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 37 | `minimax` | `design-md/minimax/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 38 | `mintlify` | `design-md/mintlify/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 39 | `miro` | `design-md/miro/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 40 | `mistral.ai` | `design-md/mistral.ai/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — dots preserved |
| 41 | `mongodb` | `design-md/mongodb/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 42 | `mydealz` | `design-md/mydealz/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 43 | `nerdwallet` | `design-md/nerdwallet/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 44 | `nike` | `design-md/nike/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 45 | `nintendo-2001` | `design-md/nintendo-2001/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent (retro-web series) |
| 46 | `notion` | `design-md/notion/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\notion\DESIGN.md`) | already vendored — carry attribution |
| 47 | `nvidia` | `design-md/nvidia/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 48 | `ollama` | `design-md/ollama/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 49 | `opencode.ai` | `design-md/opencode.ai/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\opencode.ai\DESIGN.md`) | already vendored — dots preserved |
| 50 | `oracle` | `design-md/oracle/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 51 | `oura` | `design-md/oura/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 52 | `pinterest` | `design-md/pinterest/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 53 | `playstation` | `design-md/playstation/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 54 | `posthog` | `design-md/posthog/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 55 | `raycast` | `design-md/raycast/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\raycast\DESIGN.md`) | already vendored — carry attribution |
| 56 | `renault` | `design-md/renault/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 57 | `replicate` | `design-md/replicate/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 58 | `resend` | `design-md/resend/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 59 | `revolut` | `design-md/revolut/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 60 | `runwayml` | `design-md/runwayml/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent (README lists as Runway) |
| 61 | `sanity` | `design-md/sanity/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 62 | `sap` | `design-md/sap/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 63 | `sentry` | `design-md/sentry/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 64 | `shopify` | `design-md/shopify/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\shopify\DESIGN.md`) | already vendored — carry attribution |
| 65 | `slack` | `design-md/slack/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\slack\DESIGN.md`) | already vendored — `README.md` absent upstream (404); bundle DESIGN.md only |
| 66 | `spacex` | `design-md/spacex/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 67 | `spotify` | `design-md/spotify/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 68 | `starbucks` | `design-md/starbucks/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — **new since 74-snapshot** |
| 69 | `stripe` | `design-md/stripe/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\stripe\DESIGN.md`) | already vendored — carry attribution |
| 70 | `supabase` | `design-md/supabase/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\supabase\DESIGN.md`) | already vendored — carry attribution |
| 71 | `superhuman` | `design-md/superhuman/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 72 | `tesla` | `design-md/tesla/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 73 | `theverge` | `design-md/theverge/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 74 | `together.ai` | `design-md/together.ai/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — dots preserved |
| 75 | `uber` | `design-md/uber/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 76 | `vercel` | `design-md/vercel/DESIGN.md` | **yes** (`O:\vantrilex-arsenal\registry\formatting\brands\vercel\DESIGN.md`) | already vendored — carry attribution |
| 77 | `vodafone` | `design-md/vodafone/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 78 | `voltagent` | `design-md/voltagent/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 79 | `warp` | `design-md/warp/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 80 | `webflow` | `design-md/webflow/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 81 | `wired` | `design-md/wired/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 82 | `wise` | `design-md/wise/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |
| 83 | `x.ai` | `design-md/x.ai/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent — dots preserved |
| 84 | `zapier` | `design-md/zapier/DESIGN.md` | no | `design.md` kind, MIT ©2026 VoltAgent |

Notes on "new since 74-snapshot": the 10 slugs absent from `O:\vantrilex-arsenal\registry\formatting\_index.md` upstream-catalogue (74) but present in the live 84-tree are `1win`, `aljazeera`, `dji`, `jobright`, `mercury`, `mydealz`, `nerdwallet`, `oracle`, `oura`, `sap`, `starbucks` — that is 11 candidates; the exact 10-count delta depends on renames (`cal` vs `cal.com`, `runwayml` vs `runway`, `theverge`, `wired` casing). `d65-bundle` must treat the live 84-tree as authoritative and diff mechanically at build time rather than trusting this footnote arithmetic. The table above is authoritative because it reproduces the live enumeration output.

## 5. Bundle guidance for `d65-bundle` (v0.6.5)

1. Fetch the 72 missing `DESIGN.md` files with the per-file `gh api` command in §4 (or a shallow clone `git clone --depth 1 https://github.com/voltagent/awesome-design-md.git`), bytes unmodified.
2. Extend the schema with the 8th `design.md` kind; emit an 84-row sidecar reusing the §4 table (brand, upstream path, source URL, `MIT ©2026 VoltAgent`, vendored SHA).
3. Ship `LICENSE.voltagent-MIT` alongside the new `registry/design/` tree (same pattern as `O:\vantrilex-arsenal\registry\formatting\brands\LICENSE.voltagent-MIT`) and extend `ATTRIBUTION.md` coverage from 12 to 84.
4. Preserve dotted slugs exactly (`linear.app`, `mistral.ai`, `opencode.ai`, `together.ai`, `x.ai`).
5. Do not fabricate `slack/README.md` or any other missing companion; bundle `DESIGN.md` only where upstream has only that file.
6. Verify with `node scripts/verify-registry.mjs`, the `--check` variant, and `node scripts/verify-kit.mjs` (all exit 0), plus a live recount of 84 at build time.

## 6. Sources observed (all read-only, 2026-10-15)

- Upstream repo page: `https://github.com/voltagent/awesome-design-md` (121k stars, 13.5k forks, 66 commits on `main`, badge count-84, MIT sidebar, README Collection + License sections).
- Upstream tree API: `repos/voltagent/awesome-design-md/git/trees/main?recursive=1` (260 tree entries; 84 match `^design-md/[^/]+/DESIGN\.md$`).
- Upstream license API: `repos/voltagent/awesome-design-md/contents/LICENSE` (`Accept: application/vnd.github.raw`) + `https://raw.githubusercontent.com/voltagent/awesome-design-md/main/LICENSE`.
- Local tree: `O:\vantrilex-arsenal\registry\formatting\brands\` (12 `DESIGN.md`, 11 `README.md`, `LICENSE.voltagent-MIT`); `O:\vantrilex-arsenal\registry\formatting\_index.md`; `O:\vantrilex-arsenal\registry\formatting\ATTRIBUTION.md`.

## 7. Non-touch declaration

- Touched (created): `O:\vantrilex-arsenal\RESEARCH-03-r0c-design.md` (this file) — the node's sole deliverable.
- Not touched: `AGENT.md`, `WORKFLOW.md`, `RESEARCH-03.md`, any other `RESEARCH-03-r0*.md` draft, `kit/kit.lock`, `registry/catalog.json`, theme registry, or any shared resource. No commit was made.
