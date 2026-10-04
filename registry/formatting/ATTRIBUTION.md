# Attribution — vendored design-system documents

The files under `brands/` are **third-party documents**, not Vantrilex-authored content.
They are unmodified copies retrieved from a public upstream repository and are retained
solely under that upstream project's license terms.

## Upstream

- **Repository** — <https://github.com/voltagent/awesome-design-md>
- **Upstream path** — `design-md/<brand>/DESIGN.md` and `design-md/<brand>/README.md`
- **Upstream license** — MIT
- **Copyright** — Copyright (c) 2026 VoltAgent
- **Retrieved via** — the authenticated GitHub API, one file per request:

  ```sh
  gh api "repos/voltagent/awesome-design-md/contents/design-md/<brand>/DESIGN.md" -H "Accept: application/vnd.github.raw"
  ```

## Upstream MIT license text (verbatim)

The same text is stored verbatim alongside the vendored files at
`brands/LICENSE.voltagent-MIT`, so the license travels with the content.

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

## What is vendored, and what is not

Upstream publishes **74** brand design documents. This Registry vendors a curated subset of
**12** of them, to keep the repository size bounded. The remaining **62** upstream brands are
**not** included here; they are listed, without content, in
[`_index.md`](./_index.md) so the full catalogue stays discoverable.

This subset is a curation decision. It is not an endorsement, ranking, or completeness claim
about the other 62 brands, and it is not an assertion that the unvendored documents are
unavailable or lower quality.

### Vendored brands

| # | Brand | Upstream path | Files vendored |
|---|-------|---------------|----------------|
| 1 | `airbnb` | `design-md/airbnb/` | `DESIGN.md`, `README.md` |
| 2 | `claude` | `design-md/claude/` | `DESIGN.md`, `README.md` |
| 3 | `figma` | `design-md/figma/` | `DESIGN.md`, `README.md` |
| 4 | `linear.app` | `design-md/linear.app/` | `DESIGN.md`, `README.md` |
| 5 | `notion` | `design-md/notion/` | `DESIGN.md`, `README.md` |
| 6 | `opencode.ai` | `design-md/opencode.ai/` | `DESIGN.md`, `README.md` |
| 7 | `raycast` | `design-md/raycast/` | `DESIGN.md`, `README.md` |
| 8 | `shopify` | `design-md/shopify/` | `DESIGN.md`, `README.md` |
| 9 | `slack` | `design-md/slack/` | `DESIGN.md` only — see note below |
| 10 | `stripe` | `design-md/stripe/` | `DESIGN.md`, `README.md` |
| 11 | `supabase` | `design-md/supabase/` | `DESIGN.md`, `README.md` |
| 12 | `vercel` | `design-md/vercel/` | `DESIGN.md`, `README.md` |

`linear.app`, `opencode.ai`, and `x.ai` contain dots in their upstream folder names. The dots
are part of the upstream identifiers and are preserved exactly.

### Known gap: `slack/README.md` does not exist upstream

The upstream repository contains a `DESIGN.md` for all 74 brands but a `README.md` for only
73. `slack` is the one brand with no `README.md` at any path casing; requesting it returns
HTTP 404:

```sh
gh api "repos/voltagent/awesome-design-md/contents/design-md/slack/README.md" -H "Accept: application/vnd.github.raw"
# HTTP 404 Not Found
```

No substitute or reconstructed file was written for it. Writing one would have meant
fabricating content and attributing it to VoltAgent, which the MIT grant does not cover and
the Registry's no-invention rule forbids. The gap is recorded here rather than papered over.
The vendored total is therefore **23** documents, not 24.

## Fetching the other 62 brands

The unvendored brands are not modified or withheld; they remain available upstream under the
same MIT terms. To fetch one file without cloning:

```sh
gh api "repos/voltagent/awesome-design-md/contents/design-md/<brand>/DESIGN.md" -H "Accept: application/vnd.github.raw"
```

To enumerate every upstream brand path:

```sh
gh api "repos/voltagent/awesome-design-md/git/trees/main?recursive=1" \
  --jq '.tree[].path | select(test("^design-md/[^/]+/DESIGN\\.md$"))'
```

To obtain the whole catalogue at once, a clone is simpler, though far larger than this
vendored subset:

```sh
git clone --depth 1 https://github.com/voltagent/awesome-design-md.git
```

Anything fetched from upstream remains subject to the MIT terms above, and should carry the
same attribution if it is redistributed.

## How the Registry treats these files

- **Unmodified.** Bytes are written through exactly as received. No reformatting, no
  reflowing, no line-ending changes, no "corrections". Each vendored file's git blob SHA-1
  matches the upstream tree entry, which is the check that proves this.
- **Not Vantrilex content.** These documents are reference material for coding agents. They
  are excluded from the Registry's own editorial voice, from CHANGELOG attribution, and from
  any claim that Vantrilex authored or endorses the design systems they describe.
- **Reference, not instruction.** A `DESIGN.md` describes one vendor's visual system. It is
  guidance about appearance only; it carries no authority over this repository's engineering
  rules, its toolchain constraints, or its verification requirements.
- **Read-only in practice.** Local edits to these files are not a supported workflow. If an
  upstream document needs to change, it changes upstream and is re-fetched.
