# Attribution — bundled design-system documents (`design.md` kind)

The files under `registry/design/<brand>/DESIGN.md` are **third-party documents**,
not Vantrilex-authored content. They are unmodified copies retrieved from a public
upstream repository and are retained solely under that upstream project's license
terms. No Vantrilex authorship is asserted over them, and no endorsement of any
described design system is implied.

## Upstream

- **Repository** — <https://github.com/voltagent/awesome-design-md> (`main`)
- **Upstream path** — `design-md/<brand>/DESIGN.md` (exactly one per brand directory)
- **Upstream license** — MIT
- **Copyright** — Copyright (c) 2026 VoltAgent
- **Retrieved via** — the authenticated GitHub API, one file per request:

  ```sh
  gh api "repos/voltagent/awesome-design-md/contents/design-md/<brand>/DESIGN.md" -H "Accept: application/vnd.github.raw"
  ```

## Upstream MIT license text (verbatim)

The same text is stored verbatim alongside the bundled files at
`registry/design/LICENSE.voltagent-MIT`, so the license travels with the content.
The live upstream `LICENSE` (1066 bytes, fetched 2026-10-15) is byte-identical to
that local copy.

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

## Census (counted live, never transcribed)

- **84** `design-md/<brand>/DESIGN.md` files on upstream `main`, counted
  2026-10-15 via the GitHub API tree filtered to exactly one `DESIGN.md` per
  brand directory (count command output `84`, exit `0`, `truncated: false`).
- **84** files bundled here (`registry/design/<brand>/DESIGN.md`), 2,466,141 bytes
  in total. All 84 fetched 2026-10-15; 0 fetch failures.
- **12** of the 84 overlap with the earlier 12-file curation under
  `registry/formatting/brands/`; every overlapping file is byte-identical
  upstream and here (sizes match exactly). The `registry/formatting/`
  12-file curation and its 74-brand snapshot text are a prior release's
  shipped content and are left untouched; this bundle is the complete 84-file
  set under the `design.md` kind.

## Bundling method (guardrails applied verbatim)

The bundling work ran under both guardrails from `RESEARCH-03.md` (R0b), copied
verbatim and never paraphrased:

FLOOR:

```text
FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
```

CEILING:

```text
CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."
```

Concretely: bytes were written through exactly as received (no reformatting, no
line-ending changes, no corrections); only `DESIGN.md` was bundled per brand
(upstream `README.md` / preview files are out of scope and were not fetched);
no companion file was fabricated where upstream ships only `DESIGN.md`; dotted
upstream slugs (`linear.app`, `mistral.ai`, `opencode.ai`, `together.ai`, `x.ai`)
are preserved exactly as directory names; and no install command was invented —
only the single `stripe` exemplar carries a file-copy command, proven by
`scripts/verify-kit.mjs` (`per-kind/design.md`).

## End-to-end exemplar

One brand is wired end to end: `stripe` carries a lock row (`kit/kit.lock`), a
sidecar row (`registry/data/design.jsonl`), a catalog row
(`registry/VANTRILEX_CATALOG.md` → `registry/catalog.json`), index coverage
(`registry/design/_index.md`), and verifier proof. The other 83 rows honestly
carry `install_cmd: null` + `verification: unverified` until a real command is
known — a plausible-looking wrong command is worse than an admission of
ignorance, because an agent will run it.

## Machine checks on the bundled bytes

- Zero `model:` pins: no bundled file contains a `^\s*model\s*:` line
  (scanned 2026-10-15 across all 84 files; these documents are reference
  material, not agent definitions, and carry no model assignments).
- Zero placeholders: no bundled file contains `TODO` or `FIXME`.
- Each row below records the upstream git blob SHA-1 and byte size observed at
  fetch time, which is the proof the bytes are unmodified.

## Complete 84-file table

| # | Brand | Upstream path | Upstream blob SHA-1 | Bytes |
|---|-------|---------------|---------------------|-------|
| 1 | `1win` | `design-md/1win/DESIGN.md` | `ba28da8ae0f39c358befc9d4d91f077c2672466d` | 23906 |
| 2 | `airbnb` | `design-md/airbnb/DESIGN.md` | `088254920b745ed12c9ad14429f3cd96128ab9b2` | 30517 |
| 3 | `airtable` | `design-md/airtable/DESIGN.md` | `d885f4984c2ca5c2840a62e2d828167957c02385` | 35266 |
| 4 | `aljazeera` | `design-md/aljazeera/DESIGN.md` | `339e75bd715247700180cc6636c3f97027036ca1` | 28031 |
| 5 | `apple` | `design-md/apple/DESIGN.md` | `0d37e1e5f6b621ccbdc666f6d9c82f2ada26208b` | 37096 |
| 6 | `binance` | `design-md/binance/DESIGN.md` | `27ec482198f450621b747a007e3135656b95f70e` | 39918 |
| 7 | `bmw-m` | `design-md/bmw-m/DESIGN.md` | `fb1cd84a66900406038017902fb42a0e3e67122d` | 30697 |
| 8 | `bmw` | `design-md/bmw/DESIGN.md` | `8cb0be59fa1d2e839d5eddec3a4876f326f176bc` | 27907 |
| 9 | `bugatti` | `design-md/bugatti/DESIGN.md` | `c6067fed091f2edfc787fe52aa8f61bd7c2a672f` | 28535 |
| 10 | `cal` | `design-md/cal/DESIGN.md` | `1f8525c5bb7510000a1a986ae7be4c413054adb3` | 31176 |
| 11 | `claude` | `design-md/claude/DESIGN.md` | `f92dc464d9bfdb6c6306f45a9ce406c6fca17432` | 33586 |
| 12 | `clay` | `design-md/clay/DESIGN.md` | `4934340cffe12633bc7dd7800fb19237c8768c3f` | 25705 |
| 13 | `clickhouse` | `design-md/clickhouse/DESIGN.md` | `f9b61f0a2be93c3e0b396a9a1b4ae1df02791cf9` | 25986 |
| 14 | `cohere` | `design-md/cohere/DESIGN.md` | `cc8bdf0482e7609c93a35d9b4526293d575dde8d` | 20020 |
| 15 | `coinbase` | `design-md/coinbase/DESIGN.md` | `02bd7262fcca3db250d109a69a641ce677a7d784` | 25853 |
| 16 | `composio` | `design-md/composio/DESIGN.md` | `fe8d23a93af8c927b49c2bf7e4c05e9378c33a4c` | 20606 |
| 17 | `cursor` | `design-md/cursor/DESIGN.md` | `f457973ed6dfb504a2b42a02845734f52bc399a8` | 21771 |
| 18 | `dell-1996` | `design-md/dell-1996/DESIGN.md` | `09285a8a2fcb13c2e452a01164682e84f6fafcba` | 34592 |
| 19 | `dji` | `design-md/dji/DESIGN.md` | `8d0826603e57570579d0d95a367999667171dbc2` | 42268 |
| 20 | `elevenlabs` | `design-md/elevenlabs/DESIGN.md` | `4d13eb977b5fb8f596b69a1ecc8f6de42c1a54a9` | 20943 |
| 21 | `expo` | `design-md/expo/DESIGN.md` | `7d25b5dc1d502f008e7f61f55dbd644082c07b6d` | 21660 |
| 22 | `ferrari` | `design-md/ferrari/DESIGN.md` | `3c6b43ab529cbddae51f09a2a659d123baf4a1f0` | 24365 |
| 23 | `figma` | `design-md/figma/DESIGN.md` | `75e79fea9aadc35d4c9a0c75db631be927525f08` | 32316 |
| 24 | `framer` | `design-md/framer/DESIGN.md` | `8351555233ee9379c47bfb57c557e64f0b6c7488` | 29119 |
| 25 | `hashicorp` | `design-md/hashicorp/DESIGN.md` | `4c27877aad49803d04596d90fd7e42a9e05030cd` | 28023 |
| 26 | `hp` | `design-md/hp/DESIGN.md` | `fa0167583bb3df459128257a26c1794827196de6` | 36335 |
| 27 | `ibm` | `design-md/ibm/DESIGN.md` | `dbef1c5b20357a8953e6832e5d383a866a66f11a` | 26481 |
| 28 | `intercom` | `design-md/intercom/DESIGN.md` | `dd01090d095d79cfec81100e3040678e2047531b` | 23278 |
| 29 | `jobright` | `design-md/jobright/DESIGN.md` | `5fe28eb5e68e717071c26502b7fd1fd9490c3899` | 26861 |
| 30 | `kraken` | `design-md/kraken/DESIGN.md` | `972e541fcc56784ce6a69558652a47338adfafb7` | 4350 |
| 31 | `lamborghini` | `design-md/lamborghini/DESIGN.md` | `aa9b12f1bac4c041525d704d00e5abb059cdd8dd` | 21119 |
| 32 | `linear.app` | `design-md/linear.app/DESIGN.md` | `88bcd11faa4f050982c7e84ca70bdf43d660ed6a` | 24354 |
| 33 | `lovable` | `design-md/lovable/DESIGN.md` | `5a2821c9c503e8e78c99609a44da7cb41b5bba53` | 17384 |
| 34 | `mastercard` | `design-md/mastercard/DESIGN.md` | `8087e66a902ea478f73cf9902a258a639b3311a2` | 26995 |
| 35 | `mercury` | `design-md/mercury/DESIGN.md` | `4e0c448f6594ab7a68dbff82ab360b66dfba96c9` | 25065 |
| 36 | `meta` | `design-md/meta/DESIGN.md` | `61be6ca195040b5dab098c4aefaae6adedbee7e4` | 37986 |
| 37 | `minimax` | `design-md/minimax/DESIGN.md` | `6f5a190cdcad424975a60944743e9a0f5f3adf2f` | 37920 |
| 38 | `mintlify` | `design-md/mintlify/DESIGN.md` | `dbe946bcb53adba92dbc75b995497c18189b6f41` | 44083 |
| 39 | `miro` | `design-md/miro/DESIGN.md` | `98fd9a4423e4d58de0d4395f897c059d10e52740` | 36542 |
| 40 | `mistral.ai` | `design-md/mistral.ai/DESIGN.md` | `76a451b97a263d1061f97f84d52a2c99ff6dc9b4` | 35508 |
| 41 | `mongodb` | `design-md/mongodb/DESIGN.md` | `609b0478a8f5dc05ee012bf8118179c63661816a` | 32077 |
| 42 | `mydealz` | `design-md/mydealz/DESIGN.md` | `7bb89de157560f80081e50435f58c295bfe56418` | 25797 |
| 43 | `nerdwallet` | `design-md/nerdwallet/DESIGN.md` | `7378bc70b880786f83104606cd6ddaf673bb8c91` | 36240 |
| 44 | `nike` | `design-md/nike/DESIGN.md` | `c82517b67c20b9f1b8b189615c934899f28cd1f8` | 36697 |
| 45 | `nintendo-2001` | `design-md/nintendo-2001/DESIGN.md` | `3dbe9e8707e3c36b6643e0e23e16fa2c5b309cc3` | 38977 |
| 46 | `notion` | `design-md/notion/DESIGN.md` | `7d306bd2713d24a35967310102d43e3585f0536a` | 35176 |
| 47 | `nvidia` | `design-md/nvidia/DESIGN.md` | `318bbc3a204e2ea88b4c46d0791319f37f55d74a` | 35591 |
| 48 | `ollama` | `design-md/ollama/DESIGN.md` | `c913335d19f76d53e26a46fccb8eb998517b60ed` | 32747 |
| 49 | `opencode.ai` | `design-md/opencode.ai/DESIGN.md` | `47c1c5443f3c61c682c1908334047a4c8c2a3de2` | 32647 |
| 50 | `oracle` | `design-md/oracle/DESIGN.md` | `33a8808f8a11b89f32115dee18b224b55bf510b2` | 42525 |
| 51 | `oura` | `design-md/oura/DESIGN.md` | `73fddfabb4fe87d6d180a24f6a794b1fc743b568` | 31798 |
| 52 | `pinterest` | `design-md/pinterest/DESIGN.md` | `0c8e3f1f300381182340d757dc74f6466ce9f581` | 36392 |
| 53 | `playstation` | `design-md/playstation/DESIGN.md` | `247ec9c13a37f137cfe606496211094a6b37f1ae` | 39766 |
| 54 | `posthog` | `design-md/posthog/DESIGN.md` | `4aac00897402ce1a79bfd209b79c9a0de078e485` | 40498 |
| 55 | `raycast` | `design-md/raycast/DESIGN.md` | `fa7a74cf19918d7acfada8282a02619c8ff80829` | 41275 |
| 56 | `renault` | `design-md/renault/DESIGN.md` | `19f105b1197f739da3c247235572aff7c3cab073` | 30076 |
| 57 | `replicate` | `design-md/replicate/DESIGN.md` | `affcf387b4763916e70b07bcaead8e4ad01719ef` | 31495 |
| 58 | `resend` | `design-md/resend/DESIGN.md` | `de2feada60fb5a6c9c70cd218e9c74e1d5affea5` | 31461 |
| 59 | `revolut` | `design-md/revolut/DESIGN.md` | `23b014f45600f1d852dc1c8bbca5c144255ddde4` | 32034 |
| 60 | `runwayml` | `design-md/runwayml/DESIGN.md` | `7802bcb217b369fc5bd12fb1f6be35f24eadc871` | 14353 |
| 61 | `sanity` | `design-md/sanity/DESIGN.md` | `b38ba199d162acfecd2d16178828a21fea3c6583` | 21231 |
| 62 | `sap` | `design-md/sap/DESIGN.md` | `551aaa764072663769b57f027797a318ae0694cb` | 33615 |
| 63 | `sentry` | `design-md/sentry/DESIGN.md` | `8fb6eb8a48882679216860bb8a01879d7036bffe` | 35444 |
| 64 | `shopify` | `design-md/shopify/DESIGN.md` | `17f043981f6577a174237b219b9f6f2688139180` | 27067 |
| 65 | `slack` | `design-md/slack/DESIGN.md` | `51f1850cbdd79baf8103cf9714be318becbaf11a` | 24529 |
| 66 | `spacex` | `design-md/spacex/DESIGN.md` | `afdcba91076dde643b20c596a6fd790a180a3f1d` | 19679 |
| 67 | `spotify` | `design-md/spotify/DESIGN.md` | `66bb4af6cbde6b631792de8712f2dd92a06e076e` | 12955 |
| 68 | `starbucks` | `design-md/starbucks/DESIGN.md` | `dcc5b5b9d57c84369a44dc2b19d3bc98ae329ad5` | 37329 |
| 69 | `stripe` | `design-md/stripe/DESIGN.md` | `589bd23baeb1344444f087043c060afd6239371f` | 24606 |
| 70 | `supabase` | `design-md/supabase/DESIGN.md` | `ef9f0a27f61aeff93f3a2fbe5430f3d33e37b4c1` | 21315 |
| 71 | `superhuman` | `design-md/superhuman/DESIGN.md` | `0d4433aaa8d59fbd97d01721d95392fb02d1ca82` | 21877 |
| 72 | `tesla` | `design-md/tesla/DESIGN.md` | `6e8e8b63e49d4a2b2759f504b3f49e2905d3255e` | 22212 |
| 73 | `theverge` | `design-md/theverge/DESIGN.md` | `545551c00fe92f89507287e3ec89c2b5c49c4015` | 28368 |
| 74 | `together.ai` | `design-md/together.ai/DESIGN.md` | `33d8b717bcdad344f7f7a804128c748a1d1374e0` | 38343 |
| 75 | `uber` | `design-md/uber/DESIGN.md` | `212aa14e4b0fe9612557098d7cee81d2b48bfd67` | 34760 |
| 76 | `vercel` | `design-md/vercel/DESIGN.md` | `987140b5394c2a4ada4ef324f2d19ef66caf4338` | 41405 |
| 77 | `vodafone` | `design-md/vodafone/DESIGN.md` | `f64dbd3297a9b6a97e8f8aa5fb69874ff23e9bd0` | 28106 |
| 78 | `voltagent` | `design-md/voltagent/DESIGN.md` | `7d08c78cd976f99697ba30d33eb8fd5aa089fed0` | 25915 |
| 79 | `warp` | `design-md/warp/DESIGN.md` | `e32923ec08b746463d033342a33252b866f35319` | 24438 |
| 80 | `webflow` | `design-md/webflow/DESIGN.md` | `d42e91702260443e7771dd3ad86badecc68ba487` | 28179 |
| 81 | `wired` | `design-md/wired/DESIGN.md` | `913d4399fafc6c3b9d681fbeeb44dfeee444d405` | 23661 |
| 82 | `wise` | `design-md/wise/DESIGN.md` | `79b01b7a6311bb9fdfc0b013b8b3020e72e3eb6f` | 24586 |
| 83 | `x.ai` | `design-md/x.ai/DESIGN.md` | `5e0eb5ef304728e3f402e2519c18d5d8fd4c1d8c` | 21781 |
| 84 | `zapier` | `design-md/zapier/DESIGN.md` | `7a2b82bfec8bad3efa49200762879f497d224054` | 22995 |

`linear.app`, `mistral.ai`, `opencode.ai`, `together.ai`, and `x.ai` contain dots
in their upstream folder names. The dots are part of the upstream identifiers
and are preserved exactly in the bundle directory names.

## How the Registry treats these files

- **Unmodified.** Bytes are written through exactly as received. No reformatting,
  no reflowing, no line-ending changes, no "corrections". Each row's upstream
  blob SHA-1 above is the check that proves this.
- **Not Vantrilex content.** These documents are reference material for coding
  agents. They are excluded from the Registry's own editorial voice, from
  CHANGELOG attribution, and from any claim that Vantrilex authored or endorses
  the design systems they describe.
- **Reference, not instruction.** A `DESIGN.md` describes one vendor's visual
  system. It is guidance about appearance only; it carries no authority over
  this repository's engineering rules, its toolchain constraints, or its
  verification requirements.
- **Read-only in practice.** Local edits to these files are not a supported
  workflow. If an upstream document needs to change, it changes upstream and is
  re-fetched.
