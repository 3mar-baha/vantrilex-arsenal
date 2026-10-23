# C2-READMIT — MISSING-ADDRESS re-proof and re-admission

Node `c2-readmit`, POST87-APPLY Cluster 2 post-closure, 2026-10-22.
Base: `b63622c` (the published v0.8.12 tree). Owner ruling: MISSING-ADDRESS
recovered addresses returned as evidence (`AGENT.md`, 2026-10-22).
Binding: ponytail FULL. Every coordinate below was resolved live on 2026-10-22;
the `checked_at` in the admitted records is that date, not a carried one.

## 1. Method

One probe per recovered coordinate, with the mechanism the v4 evidence model
names for that class:

| probe | used for | exact form |
|---|---|---|
| repository resolves | `upstream` rows whose artifact is a repository | `gh repo view <owner>/<repo> --json nameWithOwner,description,isArchived,url` |
| path resolves | repository rows where the artifact is a subdirectory | `gh api repos/<owner>/<repo>/contents/<path>` |
| file resolves | skill rows | `gh api repos/<owner>/<repo>/contents/<path>/SKILL.md` (content read, frontmatter `name` and purpose compared) |
| npm package resolves | `loadable` npm MCP rows | `npm view <pkg> version` plus `npm view <pkg> bin --json` (non-empty bin = `server-bin`) |
| PyPI package resolves | package-only MCP rows | `GET https://pypi.org/pypi/<pkg>/json` (version and summary read) |
| hosted endpoint resolves | remote-only MCP rows | `POST` JSON-RPC `initialize` with `accept: application/json, text/event-stream` |
| registry record | Smithery-hosted rows | `GET https://registry.smithery.ai/servers/<owner>/<name>` |
| forge API | the Codeberg row | `GET https://codeberg.org/api/v1/repos/<owner>/<repo>` |

Two negative controls ran and failed correctly: `gh repo view
novadyne-hq/vulnfeed-mcp` (not found) and `GET pypi.org/pypi/vulnfeed-mcp/json`
(404) — neither was turned into a pass.

## 2. Verdict table (47 rows + the vercel duplicate)

Class is the V4-1 class the row was assessed under. Provenance uses the four
owner labels plus one disclosed extension (`third-party-implementation`) for an
independent third-party implementation, which is neither official nor a copy.

### 2.1 — §2 of the ruling: the 15 suspended selection rows

| row | re-proved coordinate | class | provenance | checked_at | verdict |
|---|---|---|---|---|---|
| `mcp/brave` | `brave/brave-search-mcp-server` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/browserbase` | `browserbase/mcp-server-browserbase` | upstream | official-owner (repository archived) | 2026-10-22 | PASS |
| `mcp/cloudflare` | `cloudflare/mcp-server-cloudflare` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/context7-mcp` | `upstash/context7` | — | official-owner | 2026-10-22 | FAIL — duplicate of live `mcp/context7` (same artifact) |
| `mcp/deepwiki` | `https://mcp.deepwiki.com/mcp` | upstream | hosted-endpoint | 2026-10-22 | PASS |
| `mcp/discord` | `SaseQ/discord-mcp` | upstream | third-party-implementation | 2026-10-22 | PASS |
| `mcp/exa` | `exa-labs/exa-mcp-server` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/figma-context-mcp` | `GLips/Figma-Context-MCP` | upstream | third-party-implementation | 2026-10-22 | PASS |
| `mcp/gmail` | `GongRzhe/Gmail-MCP-Server` | upstream | third-party-implementation (repository archived) | 2026-10-22 | PASS |
| `mcp/googledrive` | `modelcontextprotocol/servers-archived#src/gdrive` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/mem0-memory-mcp` | `mem0ai/mem0-mcp` | upstream | official-owner (repository archived) | 2026-10-22 | PASS |
| `mcp/neon` | `neondatabase/mcp-server-neon` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/reference-sequential` | `modelcontextprotocol/servers#src/sequentialthinking` | — | official-owner | 2026-10-22 | FAIL — duplicate of live `mcp/sequential-thinking` (same artifact) |
| `mcp/steadyfetch` | `smithery:intake-triage/steadyfetch` | upstream | hosted-endpoint | 2026-10-22 | PASS |
| `mcp/supabase` | `supabase/mcp` | — | official-owner | 2026-10-22 | FAIL — duplicate of live `mcp/supabase-mcp` (same artifact) |

### 2.2 — §3 of the ruling: the 18 MCPs

| row | re-proved coordinate | class | provenance | checked_at | verdict |
|---|---|---|---|---|---|
| `mcp/lenis-mcp-server` | `devAndreotti/lenis-mcp-server` | upstream | third-party-implementation | 2026-10-22 | PASS |
| `mcp/agent-prod-muze-mcp` | `Agent-Prod/muze-mcp-connector` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/amkrs3-keycae-mcp` | `AMKRS3/keycae-packages#keycae-mcp` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/codeislaw101-katzilla` | `codeislaw101/katzilla-sdk` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/darko893-haunt-mcp-server` | `Darko893/haunt-mcp-server` / npm `@hauntapi/mcp-server` 1.1.2 | loadable | package-registry | 2026-10-22 | PASS |
| `mcp/dolphinquant-echolon` | `pypi:echolon` 0.1.9 | upstream | package-registry | 2026-10-22 | PASS |
| `mcp/donnywin85-arb-dex-mcp` | `donnywin85/arb-dex-mcp` / npm `arb-dex-mcp` 1.0.1 | loadable | package-registry | 2026-10-22 | PASS |
| `mcp/donnywin85-dex-data-mcp` | `donnywin85/dex-data-mcp` / npm `dex-data-mcp` 1.7.0 | loadable | package-registry | 2026-10-22 | PASS |
| `mcp/ebbfijsf-agent-reader` | `npm:agent-reader` 1.3.7 | — | package-registry | 2026-10-22 | FAIL — identity: npm `agent-reader` is a different project (document-prettifying engine, maintainer `clarexue`, no repository field); the authored coordinate `ebbfijsf/agent-reader` does not resolve |
| `mcp/flovoice53-tech-sms-florin-mcp` | `flovoice53-tech/sms-florin-mcp` / npm `sms-florin-mcp` 0.1.2 | loadable | package-registry | 2026-10-22 | PASS |
| `mcp/aarsiv-groups-shipi-mcp-server` | `mcp-research/aarsiv-groups__shipi-mcp-server` | upstream | third-party-copy (archival mirror; hosted twin `shipi/shipi` on Smithery resolves) | 2026-10-22 | PASS |
| `mcp/alexcloudstar-makers-page-mcp` | `Uni0Satyam/makers.page-mcp` | upstream | third-party-copy | 2026-10-22 | PASS |
| `mcp/correctover-mcp-server` | `codeberg.org/correctover-labs/correctover-mcp-server` | upstream | official-owner | 2026-10-22 | PASS |
| `mcp/infai-tech-vulnfeed-mcp` | `pypi:vulnfeed-mcp` | — | — | 2026-10-22 | FAIL — the package is absent (PyPI 404 for `vulnfeed-mcp` and `vulnfeed_mcp`); the claimed successor `novadyne-hq/vulnfeed-mcp` returns no repository; a GitHub search for `vulnfeed` returns no MCP repository |
| `mcp/livetennisapi-livetennisapi-mcp` | `https://mcp.livetennisapi.com/mcp` (npm `livetennisapi-mcp` 1.6.2 also resolves) | upstream | hosted-endpoint | 2026-10-22 | PASS |
| `mcp/scottcjn-rustchain-mcp` | `pypi:rustchain-mcp` 0.4.0 | upstream | package-registry | 2026-10-22 | PASS |
| `mcp/supertone-inc-supertone-mcp` | `pypi:supertone-mcp` 0.3.1 | upstream | package-registry | 2026-10-22 | PASS |
| `mcp/yarmoluk-ckg-mcp` | `pypi:ckg-mcp` 0.9.4 | upstream | package-registry | 2026-10-22 | PASS |

### 2.3 — §4 of the ruling: the 14 skills

| row | re-proved coordinate | class | provenance | checked_at | verdict |
|---|---|---|---|---|---|
| `skill/agent-md-setup` | `ismail9k/skills#skills/setup-agent-md` | upstream | official-owner | 2026-10-22 | PASS — artifact `name: setup-agent-md`; purpose matches (agent instruction file setup), name order differs |
| `skill/configure-issue-tracker` | `ismail9k/skills#skills/setup-issue-tracker` | upstream | official-owner | 2026-10-22 | PASS — artifact `name: setup-issue-tracker`; purpose matches |
| `skill/fetch-github-issues` | `ismail9k/skills#skills/fetch-issues` | upstream | official-owner | 2026-10-22 | PASS — artifact `name: fetch-issues`; purpose matches |
| `skill/brandkit` | `Leonxlnx/imagegen-skills#skills/brandkit` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/image-to-code` | `Leonxlnx/imagegen-skills#skills/image-to-code` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/imagegen-frontend-mobile` | `Leonxlnx/imagegen-skills#skills/imagegen-frontend-mobile` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/imagegen-frontend-web` | `Leonxlnx/imagegen-skills#skills/imagegen-frontend-web` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/design-taste-frontend-v1` | `Leonxlnx/taste-skill-classics#skills/taste-skill-v1` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/gpt-taste` | `Leonxlnx/taste-skill-classics#skills/gpt-tasteskill` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/high-end-visual-design` | `Leonxlnx/taste-skill-classics#skills/soft-skill` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/industrial-brutalist-ui` | `Leonxlnx/taste-skill-classics#skills/brutalist-skill` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/minimalist-ui` | `Leonxlnx/taste-skill-classics#skills/minimalist-skill` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/stitch-design-taste` | `Leonxlnx/taste-skill-classics#skills/stitch-skill` | upstream | official-owner | 2026-10-22 | PASS |
| `skill/redesign-existing-projects` | `Leonxlnx/taste-skill#skills/taste-skill` | — | official-owner | 2026-10-22 | FAIL — absorbed: the path resolves to `name: design-taste-frontend`, which is already live as `skill/design-taste-frontend`; no standalone `redesign-existing-projects` artifact exists |

### 2.4 — the duplicate verdict (+1)

| row | coordinate | verdict |
|---|---|---|
| `mcp/vercel` | `https://mcp.vercel.com` (endpoint answers; `401 invalid_token` on an unauthenticated call, i.e. present, not missing) | DUPLICATE of live `mcp/vercel-mcp` — proposed, not merged |

## 3. Flagged judgment calls, ruled

| flag | ruling |
|---|---|
| **discord — canonical choice** | PASS. `SaseQ/discord-mcp` resolves, its description states a Discord MCP server, and it is the Smithery-canonical entry among several genuine implementations. It is not the vendor's own repository, so provenance is third-party, and the row is proven as `upstream` (existence), never as a command. |
| **lenis — low provenance** | PASS, bounded. The repository is name-exact and its description matches the row's purpose; a personal-owner repository proves `upstream` (the artifact exists at the coordinate) and nothing more. No install command was authored, so low provenance cannot become a false provisioning claim. |
| **shipi — mirror vs twin** | PASS as the mirror. `mcp-research/aarsiv-groups__shipi-mcp-server` resolves; the hosted twin `shipi/shipi` on Smithery also resolves. The admitted row names the archival mirror (provenance third-party-copy) and carries no command; the twin is recorded, not admitted twice. |
| **makers.page — third-party copy** | PASS as `upstream` with provenance third-party-copy. `Uni0Satyam/makers.page-mcp` resolves; the authored `alexcloudstar/makers.page-mcp` is gone. The row's identity is preserved by its id; only the address is restated. |
| **vulnfeed — package vs successor** | FAIL. Neither the package nor the successor exists: PyPI 404 on `vulnfeed-mcp` and `vulnfeed_mcp`, no `novadyne-hq/vulnfeed-mcp` repository, and no `vulnfeed` MCP repository in a GitHub search. The row stays a candidate; the working coordinate is not invented. |
| **livetennisapi — endpoint + npm** | PASS on the endpoint. `https://mcp.livetennisapi.com/mcp` answers a JSON-RPC `initialize` (200), and npm `livetennisapi-mcp` 1.6.2 exists with a bin. The GitLab source path stays unverified and is not claimed; the npm package's declared GitHub repository (`livetennisapi/livetennisapi-mcp`) does not resolve, so the row is proven as a hosted endpoint and carries no command. |
| **redesign-existing-projects — absorbed** | FAIL as a standalone row. The recovered path's `SKILL.md` is `name: design-taste-frontend`, already live as `skill/design-taste-frontend`. Admitting it would create a second live row for one artifact. The successor is named in this report; the row stays a candidate. |
| **duplicates (context7-mcp, reference-sequential, supabase)** | FAIL as independent rows, by the same rule the ruling applies to vercel: each recovered coordinate is the artifact of a live row (`upstream/context7` -> `mcp/context7`; `servers#src/sequentialthinking` -> `mcp/sequential-thinking`; `supabase/mcp` -> `mcp/supabase-mcp`). Admitting them would double-count one artifact and make the selection inject the same server twice. They stay candidates and suspended; the merge disposition is proposed below, not applied. |
| **three skills whose artifact name differs** | PASS with the variance recorded. The recovered paths resolve and their purpose matches; the artifacts carry `setup-agent-md`, `setup-issue-tracker`, `fetch-issues`. These rows are proven as `upstream` precisely so no `--skill` command asserts a name the artifact does not carry (an `installable` claim would fail `command-shape/skills-upstream`, which requires the command's skill to equal the row id). |
| **archived repositories (browserbase, gmail, mem0, servers-archived)** | PASS. The coordinate resolves; archive state is disclosed in the description where it matters and does not weaken a `source_proof` (existence), because no command was authored for these rows. |
| **class choice where a registry exists but no load surface is provable** | PyPI-only MCPs are admitted as `upstream`, not `loadable`: the registry proves the package exists, and no executable surface was fetched, so a `load_proof` would be an unproven claim. npm MCPs are admitted as `loadable` because `npm view <pkg> bin` returned a non-empty bin map — the same mechanism the verifier's `command-shape/mcp-npm` check runs. |

## 4. State change

| surface | before | after |
|---|---:|---:|
| live catalog rows | 2,837 | 2,878 |
| live MCP rows | 872 | 900 |
| live skill rows | 1,464 | 1,477 |
| candidate rows | 104 | 63 (mcp 23, skill 28, hook 12) |
| selection tokens | 146 | 146 |
| suspended selection tokens | 17 | 5 (`context7-mcp`, `openrouter`, `reference-sequential`, `supabase`, `vercel`) |
| resolving selected tokens | 129 | 141 |
| class ledger | upstream 1,497 / installable 1,181 / loadable 69 / data 90 | upstream 1,534 / installable 1,181 / loadable 73 / data 90 |

Restored selection entries (12, auto-restored): `mcp/brave`, `mcp/browserbase`,
`mcp/cloudflare`, `mcp/deepwiki`, `mcp/discord`, `mcp/exa`, `mcp/figma-context-mcp`,
`mcp/gmail`, `mcp/googledrive`, `mcp/mem0-memory-mcp`, `mcp/neon`, `mcp/steadyfetch`.

## 5. Vercel disposition — proposed, not applied

`mcp/vercel` and `mcp/vercel-mcp` denote one artifact (`https://mcp.vercel.com`;
the live row carries the endpoint, list/read tools and `deploy_to_vercel`).
Proposal, for the owner's word: retire the candidate `mcp/vercel`, re-point its
selection token `mcp/vercel` to `mcp/vercel-mcp`, and remove the suspension.
Not done here: the ruling forbids a unilateral merge or retirement. The same
proposal covers the three duplicates in §3 (their tokens are
`mcp/context7-mcp`, `mcp/reference-sequential`, `mcp/supabase`).

## 6. Battery

| gate | exit | evidence |
|---|---:|---|
| `node scripts/generate-catalog-json.mjs --markdown --indexes` | 0 | 2,878 rows; 16 sections; 15 generated surfaces written |
| `node scripts/generate-catalog-json.mjs --check` | 0 | every generated surface current |
| `node scripts/verify-catalog.mjs` | 0 | 20 passed, 0 skipped, 0 failed; 141/146 selected resolve, 5 suspended, 0 stale |
| `node scripts/verify-registry.mjs` | 0 | 7 passed, 0 failed (2,878 records, 16 sections, no duplicate id) |
| `node scripts/verify-skills.mjs` | 0 | 10 passed, 0 failed (37 folders) |
| `npx --no-install tsc --noEmit` (`.opencode/plugin`) | 0 | clean |
| `npx --yes markdownlint-cli` on touched Markdown | 0 | `.opencode/audit/C2-READMIT.md`, `.opencode/audit/MISSING-ADDRESS.md` |

## 7. Limits and deviations

- **Provenance vocabulary extended once**: `third-party-implementation` for an
  independent (non-copy) third-party implementation. The owner's four labels
  describe official, registry, endpoint and copy; calling `SaseQ/discord-mcp` a
  copy would be false.
- **`source_proof.method` has no package-registry value.** PyPI-proven rows
  carry `method: repo-resolves` with a self-documenting `target` of the form
  `pypi:<package>` (the remote answered for that coordinate); the schema's
  vocabulary is not widened here, and the probe is recorded above.
- **Six rows stay candidates**: three duplicates, one identity collision
  (`agent-reader`), one unresolvable package (`vulnfeed-mcp`), one absorbed
  successor (`redesign-existing-projects`). Their candidate rows are untouched
  byte-for-byte; the hunt evidence is in the dated MISSING-ADDRESS section.
- **The 18 unresolvable rows** the ruling leaves alone are untouched and named
  in the appended MISSING-ADDRESS section.
- **No re-point and no deletion of a failing row.** No `install_cmd` was
  invented: the four npm commands are `npx -y <package>` over packages whose bin
  map was read, and every other admitted row carries `install_cmd: null`.

Ponytail: FULL — re-proved 47 coordinates live, admitted 41 under their class evidence with fresh `checked_at`, and re-ran the full battery green (20/20 catalog, 7/7 registry, 0 `--check`, 10/10 skills, tsc 0).
