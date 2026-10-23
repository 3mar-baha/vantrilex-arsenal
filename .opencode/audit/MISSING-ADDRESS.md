# MISSING-ADDRESS

> **Standing and append-only.** This document collects every catalog row whose correct source
> coordinate cannot be found. A later migration or audit run appends a new dated section at the
> end; an existing section is never edited, reordered, or rewritten. Nothing here is a catalog
> row, a candidate file, or a licence to re-point a row — it is the owner's routing surface for
> addresses the registry cannot prove.

## Owner ruling (verbatim)

> "§1 Disposition: every row of ANY kind (skill, agent, MCP, CLI, or other) whose correct source
> coordinate cannot be found is neither re-pointed by guess nor silently dropped. It stands as a
> candidate AND is entered into a dedicated MISSING-ADDRESS document produced by this lane.
> §2 Document contents per row: kind · id · name · the coordinate that is missing · what was
> attempted (the probes actually run) · the candidate reason code. First entries: the 17
> coordinate-less MCPs inside the 146 selection; their selection-record disposition stays
> untouched and flagged until the address hunt returns — no equip-manifest edit in P3.
> §3 Flow: the document goes to the owner, who passes it to the verifier seat (VANZEN) to
> research the correct addresses. Recovered addresses return as evidence → re-proof →
> re-admission as new live rows per V4-3. Rows still unresolvable after the hunt return to the
> owner for an explicit remove/keep ruling.
> §4 Timing and standing: produce the document with P3's landing report, covering every
> unresolvable the migration surfaces; the mechanism is standing for all later migration and
> audit runs."

## P3 — 2026-10-22 (Cluster 2, node `c2-migrate`, commit `727a1e4`)

### 1. Inclusion rule

A row enters this section when its **correct source coordinate cannot be found** — that is, no
address the catalog can name actually resolves to the artifact:

1. **`mcp / source-proof-failed` — 50 rows.** Either the authored `owner/repo` name no longer
   resolves (32 rows: GraphQL returns no repository and REST `repos/<coordinate>` confirms
   not-found), or no coordinate of any kind was ever authored (18 rows: no `source`, no
   `origin`, and a name that is not an `owner/repo` coordinate).
2. **`skill / command-registry-failed` — 16 rows.** The repository resolves, but the skill named
   by the install command is absent from that repository's tree, so the command points at no
   artifact.

### 2. Exclusions (named, with reasons)

| excluded family | rows | why it is not here |
|---|---:|---|
| `skill / shape-invalid` | 25 | The coordinate exists; the defect is the command shape (URL form without `-a opencode -y`). Repairing the command shape is P4's question, not an address hunt. |
| `hook / load-proof-failed` | 12 | No address claim at all; the defect is an unwired callback in `.opencode/plugin/arsenal.ts`. |
| `mcp / vercel-mcp load-proof-failed` | 1 | The address exists (`https://mcp.vercel.com`); it is remote-only and exposes no local server executable, so the `server-bin` load proof cannot exist. |

### 3. What was actually probed

Recorded from the P3 migration run, not reconstructed:

- **Repository coordinates.** One `gh` GraphQL sweep of `repository(owner, name)` over 877
  distinct coordinates (18 batched calls), then a REST `repos/<coordinate>` confirmation for
  every coordinate that returned null (32 of 32 stayed not-found). A coordinate is recorded as
  dead only when both methods agree.
- **Skill names.** `npx skills add <repo> -l` across the 67 repositories named by live install
  commands, then a tree scan
  (`gh api repos/<repo>/git/trees/HEAD?recursive=1`) for every skill id the listing did not
  carry. The 16 rows below have no `<id>/SKILL.md` anywhere in the tree; 13 other misses were
  found in the tree and are live, not listed here.

**Provenance of the `attempted` cells.** The MCP cells name the target recorded in
`registry/candidates/mcp.jsonl` and the two probes §3 records for it. The 16 skill cells are
rendered from the probe method in §3, because their candidate arrays record the repository and
the finding ("absent from the repository tree"), not the command strings. No probe is inferred
from a name, and no cell claims a probe the migration did not run.

### 4. MCP rows inside the 146-token selection (17) — flagged, manifest untouched

These rows are selected in `.opencode/equip.manifest.json`. Their selection-record disposition is
**unchanged** and stays flagged until the address hunt returns; `mcp/openrouter` was also
default-selected, so the catalog's default-selected count moved from 20 to 19 when it left the
live catalog. No equip-manifest edit was made in P3.

| kind | id | name | coordinate that is missing | what was attempted | candidate reason code | in-selection |
|---|---|---|---|---|---|---|
| mcp | `brave` | brave | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `browserbase` | browserbase | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `cloudflare` | cloudflare | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `context7-mcp` | context7-mcp | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `deepwiki` | deepwiki | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `discord` | discord | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `exa` | exa | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `figma-context-mcp` | figma-context-mcp | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `gmail` | gmail | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `googledrive` | googledrive | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `mem0-memory-mcp` | mem0-memory-mcp | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `neon` | neon | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `openrouter` | openrouter | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `reference-sequential` | reference-sequential | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `steadyfetch` | steadyfetch | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `supabase` | supabase | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |
| mcp | `vercel` | vercel | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | yes |

### 5. MCP rows outside the selection (33)

| kind | id | name | coordinate that is missing | what was attempted | candidate reason code | in-selection |
|---|---|---|---|---|---|---|
| mcp | `aarsiv-groups-shipi-mcp-server` | aarsiv-groups/shipi-mcp-server | `aarsiv-groups/shipi-mcp-server` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/aarsiv-groups/shipi-mcp-server` | `source-proof-failed` | no |
| mcp | `agent-prod-muze-mcp` | Agent-Prod/muze-mcp | `Agent-Prod/muze-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Agent-Prod/muze-mcp` | `source-proof-failed` | no |
| mcp | `alexcloudstar-makers-page-mcp` | alexcloudstar/makers.page-mcp | `alexcloudstar/makers.page-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/alexcloudstar/makers.page-mcp` | `source-proof-failed` | no |
| mcp | `amkrs3-keycae-mcp` | AMKRS3/keycae-mcp | `AMKRS3/keycae-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/AMKRS3/keycae-mcp` | `source-proof-failed` | no |
| mcp | `blackmount-ai-blackmount-nlp-mcp` | BlackMount-ai/blackmount-nlp-mcp | `BlackMount-ai/blackmount-nlp-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/BlackMount-ai/blackmount-nlp-mcp` | `source-proof-failed` | no |
| mcp | `chessceo-chessceo-mcp` | chessceo/chessceo-mcp | `chessceo/chessceo-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/chessceo/chessceo-mcp` | `source-proof-failed` | no |
| mcp | `cmcgrabby-hue-syndicate-links` | cmcgrabby-hue/syndicate-links | `cmcgrabby-hue/syndicate-links` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/cmcgrabby-hue/syndicate-links` | `source-proof-failed` | no |
| mcp | `codeislaw101-katzilla` | codeislaw101/katzilla | `codeislaw101/katzilla` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/codeislaw101/katzilla` | `source-proof-failed` | no |
| mcp | `correctover-mcp-server` | Correctover/mcp-server | `Correctover/mcp-server` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Correctover/mcp-server` | `source-proof-failed` | no |
| mcp | `darko893-haunt-mcp-server` | Darko893/haunt-mcp-server | `Darko893/haunt-mcp-server` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Darko893/haunt-mcp-server` | `source-proof-failed` | no |
| mcp | `dolphinquant-echolon` | dolphinquant/echolon | `dolphinquant/echolon` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/dolphinquant/echolon` | `source-proof-failed` | no |
| mcp | `donnywin85-arb-dex-mcp` | donnywin85/arb-dex-mcp | `donnywin85/arb-dex-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/donnywin85/arb-dex-mcp` | `source-proof-failed` | no |
| mcp | `donnywin85-dex-data-mcp` | donnywin85/dex-data-mcp | `donnywin85/dex-data-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/donnywin85/dex-data-mcp` | `source-proof-failed` | no |
| mcp | `ebbfijsf-agent-reader` | ebbfijsf/agent-reader | `ebbfijsf/agent-reader` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/ebbfijsf/agent-reader` | `source-proof-failed` | no |
| mcp | `flovoice53-tech-sms-florin-mcp` | flovoice53-tech/sms-florin-mcp | `flovoice53-tech/sms-florin-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/flovoice53-tech/sms-florin-mcp` | `source-proof-failed` | no |
| mcp | `infai-tech-vulnfeed-mcp` | infai-tech/vulnfeed-mcp | `infai-tech/vulnfeed-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/infai-tech/vulnfeed-mcp` | `source-proof-failed` | no |
| mcp | `jhinresh-maiat-protocol` | JhiNResH/maiat-protocol | `JhiNResH/maiat-protocol` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/JhiNResH/maiat-protocol` | `source-proof-failed` | no |
| mcp | `kyisaiah47-kynth-mcp` | kyisaiah47/kynth-mcp | `kyisaiah47/kynth-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/kyisaiah47/kynth-mcp` | `source-proof-failed` | no |
| mcp | `kzino-vorim-mcp-server` | Kzino/vorim-mcp-server | `Kzino/vorim-mcp-server` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Kzino/vorim-mcp-server` | `source-proof-failed` | no |
| mcp | `lenis-mcp-server` | lenis-mcp-server | none authored — no source, origin, or owner/repo name | none — nothing addressable was authored | `source-proof-failed` | no |
| mcp | `livetennisapi-livetennisapi-mcp` | livetennisapi/livetennisapi-mcp | `livetennisapi/livetennisapi-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/livetennisapi/livetennisapi-mcp` | `source-proof-failed` | no |
| mcp | `mohamedkuch-utilia-solana-agent` | mohamedkuch/utilia-solana-agent | `mohamedkuch/utilia-solana-agent` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/mohamedkuch/utilia-solana-agent` | `source-proof-failed` | no |
| mcp | `newageflyfish-max-volthq` | newageflyfish-max/volthq | `newageflyfish-max/volthq` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/newageflyfish-max/volthq` | `source-proof-failed` | no |
| mcp | `pathrule-mcp` | pathrule/mcp | `pathrule/mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/pathrule/mcp` | `source-proof-failed` | no |
| mcp | `rippermercs-tensorfeed` | RipperMercs/tensorfeed | `RipperMercs/tensorfeed` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/RipperMercs/tensorfeed` | `source-proof-failed` | no |
| mcp | `sarefe12-sudo-visibilityradar-mcp` | sarefe12-sudo/visibilityradar-mcp | `sarefe12-sudo/visibilityradar-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/sarefe12-sudo/visibilityradar-mcp` | `source-proof-failed` | no |
| mcp | `scotia1973-bot-api-hub` | scotia1973-bot/api-hub | `scotia1973-bot/api-hub` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/scotia1973-bot/api-hub` | `source-proof-failed` | no |
| mcp | `scottcjn-rustchain-mcp` | Scottcjn/rustchain-mcp | `Scottcjn/rustchain-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Scottcjn/rustchain-mcp` | `source-proof-failed` | no |
| mcp | `staccdotsol-staccbot-tg` | staccDOTsol/staccbot-tg | `staccDOTsol/staccbot-tg` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/staccDOTsol/staccbot-tg` | `source-proof-failed` | no |
| mcp | `subhatta123-twilize` | subhatta123/twilize | `subhatta123/twilize` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/subhatta123/twilize` | `source-proof-failed` | no |
| mcp | `supertone-inc-supertone-mcp` | supertone-inc/supertone-mcp | `supertone-inc/supertone-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/supertone-inc/supertone-mcp` | `source-proof-failed` | no |
| mcp | `turbyho-mem-context` | turbyho/mem-context | `turbyho/mem-context` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/turbyho/mem-context` | `source-proof-failed` | no |
| mcp | `yarmoluk-ckg-mcp` | Yarmoluk/ckg-mcp | `Yarmoluk/ckg-mcp` (authored, no longer resolves) | gh GraphQL `repository(owner, name)`; gh REST `repos/Yarmoluk/ckg-mcp` | `source-proof-failed` | no |

### 6. Skill rows (16)

The coordinate column names `<repo>#<skill>`: the repository is proven to exist; the skill inside
it is not. No skill row is in the selection record (measured against the manifest).

| kind | id | name | coordinate that is missing | what was attempted | candidate reason code |
|---|---|---|---|---|---|
| skill | `agent-md-setup` | agent-md-setup | `ismail9k/skills#agent-md-setup` (repo resolves, skill absent from the tree) | `npx skills add ismail9k/skills -l`; `gh api repos/ismail9k/skills/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `brandkit` | brandkit | `leonxlnx/taste-skill#brandkit` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `configure-issue-tracker` | configure-issue-tracker | `ismail9k/skills#configure-issue-tracker` (repo resolves, skill absent from the tree) | `npx skills add ismail9k/skills -l`; `gh api repos/ismail9k/skills/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `design-taste-frontend-v1` | design-taste-frontend-v1 | `leonxlnx/taste-skill#design-taste-frontend-v1` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `fetch-github-issues` | fetch-github-issues | `ismail9k/skills#fetch-github-issues` (repo resolves, skill absent from the tree) | `npx skills add ismail9k/skills -l`; `gh api repos/ismail9k/skills/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `full-output-enforcement` | full-output-enforcement | `leonxlnx/taste-skill#full-output-enforcement` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `gpt-taste` | gpt-taste | `leonxlnx/taste-skill#gpt-taste` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `high-end-visual-design` | high-end-visual-design | `leonxlnx/taste-skill#high-end-visual-design` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `image-to-code` | image-to-code | `leonxlnx/taste-skill#image-to-code` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `imagegen-frontend-mobile` | imagegen-frontend-mobile | `leonxlnx/taste-skill#imagegen-frontend-mobile` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `imagegen-frontend-web` | imagegen-frontend-web | `leonxlnx/taste-skill#imagegen-frontend-web` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `industrial-brutalist-ui` | industrial-brutalist-ui | `leonxlnx/taste-skill#industrial-brutalist-ui` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `minimalist-ui` | minimalist-ui | `leonxlnx/taste-skill#minimalist-ui` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `redesign-existing-projects` | redesign-existing-projects | `leonxlnx/taste-skill#redesign-existing-projects` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `resolving-merge-conflicts` | resolving-merge-conflicts | `mattpocock/skills#resolving-merge-conflicts` (repo resolves, skill absent from the tree) | `npx skills add mattpocock/skills -l`; `gh api repos/mattpocock/skills/git/trees/HEAD?recursive=1` | `command-registry-failed` |
| skill | `stitch-design-taste` | stitch-design-taste | `leonxlnx/taste-skill#stitch-design-taste` (repo resolves, skill absent from the tree) | `npx skills add leonxlnx/taste-skill -l`; `gh api repos/leonxlnx/taste-skill/git/trees/HEAD?recursive=1` | `command-registry-failed` |

### 7. Counts

| family | rows | of which selected |
|---|---:|---:|
| mcp / `source-proof-failed` | 50 | 17 |
| skill / `command-registry-failed` | 16 | 0 |
| **total** | **66** | **17** |

### 8. Limits and status

- **No row is `unrecorded`.** Every attempted-probe list traces to a recorded artefact: the MCP
  cells to the candidate array's target, the skill cells to the probe method in §3 (their
  candidate arrays record the repository and the finding, not the command strings). The 18
  coordinate-less MCP rows carry an **empty** candidate list because there was nothing
  addressable to probe, not because a probe record was lost.
- **No re-point and no edit.** No `source`, `origin`, `install_cmd`, candidate file, or
  equip-manifest entry was changed to produce this section. The rows remain candidates exactly
  as P3 left them.
- **Flow.** This section goes to the owner, who passes it to the verifier seat (VANZEN). A
  recovered address returns as evidence, is re-proven, and re-enters as a new live row under
  V4-3. A row still unresolvable after the hunt returns to the owner for an explicit remove/keep
  ruling.
- **Append-only.** Later runs append their own dated sections; they do not amend this one.

## c2-readmit — 2026-10-22 (Cluster 2 post-closure re-proof; node `c2-readmit`, base `b63622c`, published v4)

This section is the hunt return for the 2026-10-22 verifier pass: 47 recovered
coordinates plus one duplicate verdict, re-proved live and dispositioned. It
records the rows that left the candidate surface, the rows that did not, and the
duplicate proposals that need the owner's word. It amends no earlier section and
re-points no failing row.

### 1. Probes run

Per row, the mechanism the row's class names: `gh repo view` (repository),
`gh api repos/<owner>/<repo>/contents/<path>` (file or subdirectory),
`npm view <pkg> version` and `npm view <pkg> bin --json` (npm package and its
executable), `GET https://pypi.org/pypi/<pkg>/json` (PyPI package), a JSON-RPC
`initialize` POST (hosted MCP endpoint), `GET https://registry.smithery.ai/...`
(Smithery record) and `GET https://codeberg.org/api/v1/repos/...` (Codeberg).
Two negative controls failed correctly and were not turned into passes:
`novadyne-hq/vulnfeed-mcp` (no repository) and `pypi:vulnfeed-mcp` (404).

### 2. Admitted — left the candidate surface (41)

| kind | id | recovered coordinate | class | provenance | checked_at |
|---|---|---|---|---|---|
| mcp | `brave` | `brave/brave-search-mcp-server` | upstream | official-owner | 2026-10-22 |
| mcp | `browserbase` | `browserbase/mcp-server-browserbase` | upstream | official-owner | 2026-10-22 |
| mcp | `cloudflare` | `cloudflare/mcp-server-cloudflare` | upstream | official-owner | 2026-10-22 |
| mcp | `deepwiki` | `https://mcp.deepwiki.com/mcp` | upstream | hosted-endpoint | 2026-10-22 |
| mcp | `discord` | `SaseQ/discord-mcp` | upstream | third-party-implementation | 2026-10-22 |
| mcp | `exa` | `exa-labs/exa-mcp-server` | upstream | official-owner | 2026-10-22 |
| mcp | `figma-context-mcp` | `GLips/Figma-Context-MCP` | upstream | third-party-implementation | 2026-10-22 |
| mcp | `gmail` | `GongRzhe/Gmail-MCP-Server` | upstream | third-party-implementation | 2026-10-22 |
| mcp | `googledrive` | `modelcontextprotocol/servers-archived#src/gdrive` | upstream | official-owner | 2026-10-22 |
| mcp | `mem0-memory-mcp` | `mem0ai/mem0-mcp` | upstream | official-owner | 2026-10-22 |
| mcp | `neon` | `neondatabase/mcp-server-neon` | upstream | official-owner | 2026-10-22 |
| mcp | `steadyfetch` | `smithery:intake-triage/steadyfetch` | upstream | hosted-endpoint | 2026-10-22 |
| mcp | `lenis-mcp-server` | `devAndreotti/lenis-mcp-server` | upstream | third-party-implementation | 2026-10-22 |
| mcp | `agent-prod-muze-mcp` | `Agent-Prod/muze-mcp-connector` | upstream | official-owner | 2026-10-22 |
| mcp | `amkrs3-keycae-mcp` | `AMKRS3/keycae-packages#keycae-mcp` | upstream | official-owner | 2026-10-22 |
| mcp | `codeislaw101-katzilla` | `codeislaw101/katzilla-sdk` | upstream | official-owner | 2026-10-22 |
| mcp | `darko893-haunt-mcp-server` | `Darko893/haunt-mcp-server` (npm `@hauntapi/mcp-server` 1.1.2) | loadable | package-registry | 2026-10-22 |
| mcp | `dolphinquant-echolon` | `pypi:echolon` 0.1.9 | upstream | package-registry | 2026-10-22 |
| mcp | `donnywin85-arb-dex-mcp` | `donnywin85/arb-dex-mcp` (npm `arb-dex-mcp` 1.0.1) | loadable | package-registry | 2026-10-22 |
| mcp | `donnywin85-dex-data-mcp` | `donnywin85/dex-data-mcp` (npm `dex-data-mcp` 1.7.0) | loadable | package-registry | 2026-10-22 |
| mcp | `flovoice53-tech-sms-florin-mcp` | `flovoice53-tech/sms-florin-mcp` (npm `sms-florin-mcp` 0.1.2) | loadable | package-registry | 2026-10-22 |
| mcp | `aarsiv-groups-shipi-mcp-server` | `mcp-research/aarsiv-groups__shipi-mcp-server` | upstream | third-party-copy | 2026-10-22 |
| mcp | `alexcloudstar-makers-page-mcp` | `Uni0Satyam/makers.page-mcp` | upstream | third-party-copy | 2026-10-22 |
| mcp | `correctover-mcp-server` | `codeberg.org/correctover-labs/correctover-mcp-server` | upstream | official-owner | 2026-10-22 |
| mcp | `livetennisapi-livetennisapi-mcp` | `https://mcp.livetennisapi.com/mcp` (npm `livetennisapi-mcp` 1.6.2) | upstream | hosted-endpoint | 2026-10-22 |
| mcp | `scottcjn-rustchain-mcp` | `pypi:rustchain-mcp` 0.4.0 | upstream | package-registry | 2026-10-22 |
| mcp | `supertone-inc-supertone-mcp` | `pypi:supertone-mcp` 0.3.1 | upstream | package-registry | 2026-10-22 |
| mcp | `yarmoluk-ckg-mcp` | `pypi:ckg-mcp` 0.9.4 | upstream | package-registry | 2026-10-22 |
| skill | `agent-md-setup` | `ismail9k/skills#skills/setup-agent-md` | upstream | official-owner | 2026-10-22 |
| skill | `configure-issue-tracker` | `ismail9k/skills#skills/setup-issue-tracker` | upstream | official-owner | 2026-10-22 |
| skill | `fetch-github-issues` | `ismail9k/skills#skills/fetch-issues` | upstream | official-owner | 2026-10-22 |
| skill | `brandkit` | `Leonxlnx/imagegen-skills#skills/brandkit` | upstream | official-owner | 2026-10-22 |
| skill | `image-to-code` | `Leonxlnx/imagegen-skills#skills/image-to-code` | upstream | official-owner | 2026-10-22 |
| skill | `imagegen-frontend-mobile` | `Leonxlnx/imagegen-skills#skills/imagegen-frontend-mobile` | upstream | official-owner | 2026-10-22 |
| skill | `imagegen-frontend-web` | `Leonxlnx/imagegen-skills#skills/imagegen-frontend-web` | upstream | official-owner | 2026-10-22 |
| skill | `design-taste-frontend-v1` | `Leonxlnx/taste-skill-classics#skills/taste-skill-v1` | upstream | official-owner | 2026-10-22 |
| skill | `gpt-taste` | `Leonxlnx/taste-skill-classics#skills/gpt-tasteskill` | upstream | official-owner | 2026-10-22 |
| skill | `high-end-visual-design` | `Leonxlnx/taste-skill-classics#skills/soft-skill` | upstream | official-owner | 2026-10-22 |
| skill | `industrial-brutalist-ui` | `Leonxlnx/taste-skill-classics#skills/brutalist-skill` | upstream | official-owner | 2026-10-22 |
| skill | `minimalist-ui` | `Leonxlnx/taste-skill-classics#skills/minimalist-skill` | upstream | official-owner | 2026-10-22 |
| skill | `stitch-design-taste` | `Leonxlnx/taste-skill-classics#skills/stitch-skill` | upstream | official-owner | 2026-10-22 |

Three of the skill rows resolve to artifacts whose frontmatter `name` differs
from the row id (`setup-agent-md`, `setup-issue-tracker`, `fetch-issues`). They
are admitted as `upstream` for exactly that reason: an `installable` claim would
have to name the artifact's skill and would then fail the row-id equality the
verifier enforces, so no command was authored.

### 3. Hunt failures — still candidates, evidence recorded (6)

| kind | id | coordinate tried | what the probe returned | disposition |
|---|---|---|---|---|
| mcp | `context7-mcp` | `upstash/context7` | repository resolves; it is the source of live `mcp/context7` (`npx -y @upstash/context7-mcp`) | duplicate of a live row; merge proposed, not applied |
| mcp | `reference-sequential` | `modelcontextprotocol/servers#src/sequentialthinking` | repository resolves; path `src/sequentialthinking` exists; it is the source of live `mcp/sequential-thinking` | duplicate of a live row; merge proposed, not applied |
| mcp | `supabase` | `supabase/mcp` | repository resolves; it is the artifact live `mcp/supabase-mcp` describes (hosted `https://mcp.supabase.com/mcp`, local `npx -y @supabase/mcp-server-supabase`) | duplicate of a live row; merge proposed, not applied |
| mcp | `ebbfijsf-agent-reader` | `npm:agent-reader` | package 1.3.7 exists, but it is a different project (document-prettifying engine, maintainer `clarexue`, no repository field); the authored `ebbfijsf/agent-reader` does not resolve | identity does not match; needs a real coordinate |
| mcp | `infai-tech-vulnfeed-mcp` | `pypi:vulnfeed-mcp` | PyPI 404 for `vulnfeed-mcp` and `vulnfeed_mcp`; `novadyne-hq/vulnfeed-mcp` does not resolve; a GitHub search for `vulnfeed` finds no MCP repository | no working coordinate exists |
| skill | `redesign-existing-projects` | `Leonxlnx/taste-skill#skills/taste-skill` | `SKILL.md` resolves, frontmatter `name: design-taste-frontend`; that artifact is already live as `skill/design-taste-frontend` | absorbed by its successor; no standalone home |

### 4. Duplicate proposals — owner's word required

`mcp/vercel` (`https://mcp.vercel.com`; the endpoint answers a JSON-RPC
`initialize` with `401 invalid_token`, i.e. present) is the same artifact as the
live `mcp/vercel-mcp` row. Proposed: retire the candidate, re-point the selection
token `mcp/vercel` to `mcp/vercel-mcp`, and drop the suspension. The same
proposal covers `mcp/context7-mcp`, `mcp/reference-sequential` and `mcp/supabase`.
Nothing was merged or retired: the ruling reserves that act.

### 5. Still unresolvable — untouched (18, pending remove/keep)

MCP (16): `blackmount-ai-blackmount-nlp-mcp` · `chessceo-chessceo-mcp` ·
`cmcgrabby-hue-syndicate-links` · `jhinresh-maiat-protocol` ·
`kyisaiah47-kynth-mcp` · `kzino-vorim-mcp-server` ·
`mohamedkuch-utilia-solana-agent` · `newageflyfish-max-volthq` ·
`pathrule-mcp` · `rippermercs-tensorfeed` · `sarefe12-sudo-visibilityradar-mcp` ·
`scotia1973-bot-api-hub` · `staccdotsol-staccbot-tg` · `subhatta123-twilize` ·
`turbyho-mem-context` · `openrouter`.

Skills (2): `full-output-enforcement` · `resolving-merge-conflicts`.

No probe was run against these in this pass and no row was changed. They wait
for the owner's explicit remove/keep ruling, exactly as the standing flow states.

### 6. Counts after this run

| surface | before | after |
|---|---:|---:|
| candidate rows | 104 | 63 |
| live catalog rows | 2,837 | 2,878 |
| suspended selection tokens | 17 | 5 |
| resolving selected tokens | 129 | 141 |

### 7. Limits

- **No re-point and no edit of a failing row.** The six failures keep their
  candidate bytes; this section is where their new evidence lives.
- **No command was invented.** The four npm rows carry `npx -y <package>` over
  packages whose bin map was read; every other admitted row is `upstream` with
  `install_cmd: null`.
- **`checked_at` is 2026-10-22** on every admitted proof: a dated observation of
  this run, never a carried date.
- **Append-only.** This section amends no earlier section and later runs append
  their own.

## c2-merge-dupes — 2026-10-22 (Cluster 2 post-readmit duplicate ruling; node `c2-merge-dupes`, base `95cb0bf`)

Owner ruling POST87-APPLY §1 and §2 (2026-10-22) orders the four duplicate
candidates merged into their live siblings and `redesign-existing-projects`
retired ABSORBED. This section records the applied state. It amends no earlier
section and touches no row outside the ruling.

### 1. Merges applied (3)

| duplicate retired | live sibling | sibling selection | candidate row | suspension |
|---|---|---|---|---|
| `mcp/context7-mcp` | `mcp/context7` | already carried in `scout`; left as is | deleted | removed |
| `mcp/reference-sequential` | `mcp/sequential-thinking` | already carried in `plan`; left as is | deleted | removed |
| `mcp/supabase` | `mcp/supabase-mcp` | added to `operate`; the live row's `phase`/`tier` moved `null`/`null` → `operate`/`conditional` so the intent can place, its evidence and class untouched | deleted | removed |

The three suspensions were single-line and multi-line entries in
`.opencode/equip.manifest.json`; all three are gone from `suspended`, and the
selection arrays carry the sibling tokens above.

### 2. Absorbed retirement (1)

`skill/redesign-existing-projects` — retired ABSORBED on 2026-10-22 into live
`skill/design-taste-frontend` (the recovered `SKILL.md` carries frontmatter
`name: design-taste-frontend`, so one artifact would have had two live rows).
Ruling POST87-APPLY §2, 2026-10-22. The candidate row is deleted; the successor
row is untouched.

### 3. Blocked — `mcp/vercel` not merged (escalation)

The ruling assumes a live `mcp/vercel-mcp` row. No such row exists:
`registry/data/mcp.jsonl` carries no vercel row, `registry/catalog.json` carries
no `mcp/vercel-mcp` component, and `registry/VANTRILEX_CATALOG.md` lists none.
The only artifacts are the candidate row `vercel-mcp` (`reason.code:
load-proof-failed` — remote-only at `https://mcp.vercel.com`, so no local server
executable exists for a `server-bin` proof) and the hand-authored card
`registry/mcp/vercel_mcp.md`. Admitting a live row is excluded by POST87-APPLY §7
("DO NOT admit new rows") and would require inventing the load proof the server
cannot have. The `mcp/vercel` candidate and its suspension are therefore left
untouched, and the selection keeps the token suspended. Owner options: (a) rule
`mcp/vercel` retired with its intent dropped, or (b) authorise a live `upstream`
row for `vercel-mcp` (null command, `source_proof` over
`vercel/vercel-mcp-overview`) before the token is re-pointed.

### 4. Untouched by this run

`mcp/ebbfijsf-agent-reader`, `mcp/infai-tech-vulnfeed-mcp`, the candidate
`vercel-mcp`, and the 18 still-unresolvable rows named in §5 of the `c2-readmit`
section keep their bytes. No new row was admitted and no coordinate was invented.

### 5. Counts after this run

| surface | before | after |
|---|---:|---:|
| candidate rows | 63 | 58 (mcp 19, skill 27, hook 12) |
| selection tokens | 146 | 144 |
| suspended selection tokens | 5 | 2 (`openrouter`, `vercel`) |
| resolving selected tokens | 141 | 142 |

## c2-vercel-row — 2026-10-22 (Cluster 2 option (b); node `c2-vercel-row`, base `1be2ac1`)

Owner ruling POST87-APPLY option (b) (2026-10-22): authorise a live `upstream`
row for the Vercel MCP (null command, class `upstream`, `source_proof` over
`vercel/vercel-mcp-overview` plus the official endpoint `https://mcp.vercel.com`,
fresh `checked_at`), re-point the suspended `mcp/vercel` selection token onto it
so the intent places, and retire the `vercel-mcp` candidate row into it. This
section records the applied state. It amends no earlier section; §3 of
`c2-merge-dupes` (the escalation this ruling answers) stands as history.

### 1. Live row admitted (1)

| id | class | source | source_proof | install_cmd |
|---|---|---|---|---|
| `mcp/vercel-mcp` | `upstream` | `vercel/vercel-mcp-overview` | `target: vercel/vercel-mcp-overview`, `method: repo-resolves`, `checked_at: 2026-10-22` | `null` |

Live resolution, this run: `gh repo view vercel/vercel-mcp-overview --json
nameWithOwner` → exit 0, `{"nameWithOwner":"vercel/vercel-mcp-overview"}`; the
official endpoint `https://mcp.vercel.com` answered `HTTP 401`
`{"error":"invalid_token","error_description":"No authorization provided"}` — it
is present and answering, with no credential supplied. No command was authored:
the class is `upstream`, so `install_cmd` is null by contract. The row carries
`phase: operate` / `tier: conditional` so the re-pointed selection token can
place (the same move `c2-merge-dupes` made for `supabase-mcp`).

### 2. Retirement line — `vercel-mcp` candidate

`mcp/vercel-mcp` — retired on 2026-10-22 into live row `mcp/vercel-mcp` (ruling
POST87-APPLY option (b), 2026-10-22). Its history is preserved here and not
overwritten: the candidate was assessed under class `loadable` and failed
**`load-proof-failed`** — the MCP is **remote-only** at `https://mcp.vercel.com`,
so no local server executable exists for a `server-bin` proof (the `attempted`
array recorded `npx -y add-mcp@2.4.1 https://mcp.vercel.com` and the endpoint).
Remote-only is the reason the load proof could not exist; the live row therefore
carries the weaker `upstream` class bar it can actually meet, never a fabricated
load proof. The candidate row is deleted; no other candidate was touched.

### 3. Selection re-point (1)

| before | after |
|---|---|
| `mcp/vercel` carried in `operate` and listed as suspended (`missing-address`) | `mcp/vercel-mcp` carried in `operate` and not suspended |

### 4. Counts after this run

| surface | before | after |
|---|---:|---:|
| live rows | 2,878 | 2,879 (mcp 900 → 901) |
| candidate rows | 58 | 57 (mcp 19 → 18, skill 27, hook 12) |
| selection tokens | 144 | 144 |
| suspended selection tokens | 2 (`openrouter`, `vercel`) | 1 (`openrouter`) |
| resolving selected tokens | 142 | 143 |

## c2-readmit-2 — 2026-10-23 (Cluster 2, address-hunt round 2; node `c2-readmit-2`, base `22b7817`)

Owner mission `c2-readmit-2` (2026-10-23, recorded in `AGENT.md`) returns 14
coordinates from the VANZEN hunt (hunt2-E1/E2/E3). This section records the
re-proof, the ten admissions, the four rows that stay candidates, and the
retirement history of every admitted candidate. It amends no earlier section
and re-points no failing row.

### 1. Probes run (2026-10-23)

Per row, the mechanism the row's class names: `gh repo view <owner>/<repo>
--json nameWithOwner,description,isArchived,licenseInfo`; `gh api
repos/<owner>/<repo>/contents/<path>` (subdirectory or file); `npm view <pkg>
version bin maintainers repository.url description --json`; `GET
https://pypi.org/pypi/<pkg>/json` plus the wheel contents; a JSON-RPC
`initialize` POST to a hosted endpoint (`accept: application/json,
text/event-stream`); `GET https://registry.smithery.ai/servers/<owner>/<name>`;
and the skills directory page `https://www.skills.sh/<owner>/<repo>/<skill>`.

Negative results were not turned into passes: `JhiNResH/maiat-protocol` returns
not-found in GraphQL and REST (404); `https://api.utilia.ink/mcp` fails TLS
validation (`SEC_E_UNTRUSTED_ROOT`) and answers HTTP 503 "no available server"
on an insecure re-probe; `https://api.kynth.studio/mcp` answers 308 and
redirects to `https://api.thecompound.tech/mcp`, which returns 401 "Missing API
key"; and the PyPI `blackmount-nlp-mcp` wheel is a deprecation stub.

### 2. Admitted — left the candidate surface (10)

| kind | id | re-proved coordinate | class | provenance | checked_at |
|---|---|---|---|---|---|
| mcp | `openrouter` | `https://mcp.openrouter.ai/mcp` (HTTP 401 `invalid_token` without a bearer token) | upstream | hosted-endpoint | 2026-10-23 |
| mcp | `cmcgrabby-hue-syndicate-links` | `npm:syndicate-links-mcp` 0.3.0 (bin `syndicate-mcp`; its repository field is the dead `cmcgrabby-hue/syndicate-links`, which matches the authored name) | upstream | package-registry | 2026-10-23 |
| mcp | `kzino-vorim-mcp-server` | `acumenix/vorim-mcp-server` (resolves; `package.json` name `@vorim/mcp-server`, bin `vorim-mcp-server`) plus npm `@vorim/mcp-server` 1.1.17 | loadable | package-registry | 2026-10-23 |
| mcp | `pathrule-mcp` | `pathrule/pathrule` (resolves; `packages/mcp` holds `src`, `tsup.config.ts`, `package.json`) plus npm `@pathrule/mcp` 1.0.7 (bin `pathrule-mcp`) | loadable | package-registry | 2026-10-23 |
| mcp | `rippermercs-tensorfeed` | `RipperMercs/tensorfeed-mcp` (resolves) plus npm `@tensorfeed/mcp-server` 2.0.5 (bin `tensorfeed-mcp`) | loadable | package-registry | 2026-10-23 |
| mcp | `newageflyfish-max-volthq` | `npm:volthq-mcp-server` 0.1.25 (bin `volthq-mcp-server`; no repository field) | upstream | package-registry | 2026-10-23 |
| mcp | `subhatta123-twilize` | `smithery:suddh123/twilize` (record 200, `remote: true`, deployment `https://twilize--suddh123.run.tools`; its icon lives in `subhatta123/twilize`) | upstream | hosted-endpoint | 2026-10-23 |
| mcp | `turbyho-mem-context` | `pypi:mem-context` 0.1.14 (25,793-character description, `mcp-name: io.github.turbyho/mem-context`, git URL `turbyho/mem-context`) | upstream | package-registry | 2026-10-23 |
| mcp | `ebbfijsf-agent-reader` | `timoyashar982-star/agent-reader` (resolves; `SKILL.md` carries `metadata.author: ebbfijsf`; `package.json` is `agent-reader` 1.3.7) | upstream | third-party-copy | 2026-10-23 |
| skill | `resolving-merge-conflicts` | `mattpocock/skills` via `https://www.skills.sh/mattpocock/skills/resolving-merge-conflicts` (page 200, full SKILL.md text served, canonical install command shown) | installable | package-registry | 2026-10-23 |

No command was invented. `npx -y @vorim/mcp-server`, `npx -y @pathrule/mcp` and
`npx -y @tensorfeed/mcp-server` are over packages whose `bin` map was read;
`npx skills add mattpocock/skills --skill resolving-merge-conflicts -a opencode
-y` is the command the skills registry publishes. The six package-only or
remote-only rows carry `install_cmd: null` and say where they live in their
description.

### 3. Retirement lines — admitted candidates (10)

Each line carries the candidate's history as recorded in
`registry/candidates/mcp.jsonl` / `skill.jsonl` before this run. The candidate
row is deleted; its reason is preserved here, never rewritten.

- `mcp/openrouter` — candidate assessed `upstream`, failed `source-proof-failed`
  ("no command, and neither source, origin nor name is an owner/repo
  coordinate"; `attempted: []`). Retired into live `mcp/openrouter` on
  2026-10-23. The official hosted endpoint answers; the working coordinate was
  recovered by the hunt.
- `mcp/cmcgrabby-hue-syndicate-links` — candidate `upstream`,
  `source-proof-failed` ("gh reports no repository
  cmcgrabby-hue/syndicate-links"; attempted the authored repo only). Retired
  into live `mcp/cmcgrabby-hue-syndicate-links` on 2026-10-23 as `upstream`
  over the npm package, because the authored repository is dead and the schema
  refuses a command on a loadable row with no source.
- `mcp/kzino-vorim-mcp-server` — candidate `upstream`, `source-proof-failed`
  ("gh reports no repository Kzino/vorim-mcp-server"). Retired into live
  `mcp/kzino-vorim-mcp-server` on 2026-10-23 as `loadable` over npm
  `@vorim/mcp-server` with the resolving `acumenix/vorim-mcp-server` source.
- `mcp/pathrule-mcp` — candidate `upstream`, `source-proof-failed` ("gh
  reports no repository pathrule/mcp"). Retired into live `mcp/pathrule-mcp`
  on 2026-10-23 as `loadable` over npm `@pathrule/mcp` and the resolving
  `pathrule/pathrule` repository.
- `mcp/rippermercs-tensorfeed` — candidate `upstream`, `source-proof-failed`
  ("gh reports no repository RipperMercs/tensorfeed"). Retired into live
  `mcp/rippermercs-tensorfeed` on 2026-10-23 as `loadable` over npm
  `@tensorfeed/mcp-server` and the resolving `RipperMercs/tensorfeed-mcp`.
- `mcp/newageflyfish-max-volthq` — candidate `upstream`,
  `source-proof-failed` ("gh reports no repository
  newageflyfish-max/volthq"). Retired into live `mcp/newageflyfish-max-volthq`
  on 2026-10-23 as `upstream` over npm `volthq-mcp-server`, because the package
  carries no repository coordinate and a loadable row with no source may not
  carry a command.
- `mcp/subhatta123-twilize` — candidate `upstream`, `source-proof-failed` ("gh
  reports no repository subhatta123/twilize"). Retired into live
  `mcp/subhatta123-twilize` on 2026-10-23 as the Smithery-hosted remote form.
- `mcp/turbyho-mem-context` — candidate `upstream`, `source-proof-failed` ("gh
  reports no repository turbyho/mem-context"). Retired into live
  `mcp/turbyho-mem-context` on 2026-10-23 over PyPI `mem-context`, whose own
  metadata names `io.github.turbyho/mem-context`.
- `mcp/ebbfijsf-agent-reader` — candidate `upstream`, `source-proof-failed`
  ("gh reports no repository ebbfijsf/agent-reader"). Retired into live
  `mcp/ebbfijsf-agent-reader` on 2026-10-23 via the surviving copy
  `timoyashar982-star/agent-reader`, whose `SKILL.md` names `ebbfijsf` as the
  author.
- `skill/resolving-merge-conflicts` — candidate `installable`, failed
  `command-registry-failed` ("mattpocock/skills carries no skill named
  resolving-merge-conflicts in its repository tree"; attempted the repo and its
  tree). Retired into live `skill/resolving-merge-conflicts` on 2026-10-23 on
  the skills-registry record, which serves the full text and the install
  command.

### 4. Failures — still candidates, round-2 evidence recorded (4)

| kind | id | coordinate tried | what the round-2 probe returned | disposition |
|---|---|---|---|---|
| mcp | `jhinresh-maiat-protocol` | `JhiNResH/maiat-protocol#packages/mcp-server`, npm `@jhinresh/mcp-server` | GraphQL and REST both return not-found for the repository, so the path cannot be probed; npm 0.9.0 does resolve (bin `maiat-mcp`, maintainer `jhinresh`) | FAIL under §2(d) (direct repo resolution first); the npm conflict is recorded, the row stays a candidate |
| mcp | `mohamedkuch-utilia-solana-agent` | `https://api.utilia.ink/mcp` | TLS validation failed (`schannel: SEC_E_UNTRUSTED_ROOT`); an insecure re-probe answered HTTP 503 "no available server"; npm `utilia` is a different library and is barred | FAIL — no live-provable endpoint; the row stays a candidate |
| mcp | `blackmount-ai-blackmount-nlp-mcp` | `pypi:blackmount-nlp-mcp` | package 0.1.7 resolves, but the wheel holds only a `server.py` that prints a deprecation notice and exits 1; summary "Deprecated. See app.blackmount.ai" | FAIL — a source proof would prove a tombstone, not the MCP server (§3.1) |
| mcp | `kyisaiah47-kynth-mcp` | `https://api.kynth.studio/mcp`, server "kynth-core" | 308 to `https://api.thecompound.tech/mcp`, which returns 401 "Missing API key"; no repository, package or server coordinate resolves | FAIL-hold (§3.3) — no pinnable coordinate, identity unproven |

The four candidate rows were updated in place with this evidence and
`checked_at: 2026-10-23`; nothing was deleted and no coordinate was guessed.

### 5. Flag rulings (3.1–3.7)

| flag | ruling |
|---|---|
| **3.1 — stub vs source_proof** (`blackmount-nlp-mcp`) | **FAIL.** The package exists, so a `source_proof` would pass a mechanical existence check, but the artifact is a 179-character deprecation notice and a `server.py` that exits 1. Existence of a tombstone is not identity of an MCP server; the row stays a candidate. |
| **3.2 — package-only precedent** (`volthq-mcp-server`) | **PASS as `upstream`, not `loadable`.** The package resolves and its `bin` is read, but it carries no repository coordinate; the v4 self-shipped rule (`loadable` + `source: null` ⇒ `install_cmd: null`) means a command on this row would be refused. The row names `npm:volthq-mcp-server`; the package name and "Volt HQ compute price oracle" description match the recovered coordinate (npm maintainer `jarnot2019` differs from the authored owner and is disclosed). |
| **3.3 — no pinnable coordinate** (`api.kynth.studio`, "kynth-core") | **FAIL-hold.** The service URL redirects to a different domain and answers only an auth wall; no repository, package or server coordinate resolves, so identity cannot be proven and nothing can be pinned. |
| **3.4 — hosted-only** (`Smithery suddh123/twilize`) | **PASS in `upstream` remote form.** The Smithery record resolves (`remote: true`, deployment URL, 47 tools); the row carries no command, so the stale `uvx twilize` line in the record is not treated as a coordinate. |
| **3.5 — description-match weight** (`PyPI mem-context`) | **PASS with the match strengthened.** The 25,793-character package description carries `mcp-name: io.github.turbyho/mem-context` and the `turbyho/mem-context` git URL, so identity rests on more than a name match. |
| **3.6 — re-prove from scratch / surviving copy** (`agent-reader`) | **PASS as `upstream` with `third-party-copy` provenance.** `ebbfijsf/agent-reader` no longer resolves; the surviving copy resolves, its `SKILL.md` records `metadata.author: ebbfijsf`, and its `package.json` is `agent-reader` 1.3.7. The npm `bin` is the document CLI, not the MCP entry (`node src/mcp/server.js` is a script, not a bin), so no command is claimed. |
| **3.7 — directory-served full text** (`skills.sh` resolving-merge-conflicts) | **PASS as `installable`.** The repository tree holds `docs/engineering/resolving-merge-conflicts.md`, not a `SKILL.md`; the skills registry serves the full skill text and publishes the canonical install command. The class evidence is the registry record plus the command, not a repository-tree claim. |

### 6. Counts after this run

| surface | before | after |
|---|---:|---:|
| live catalog rows | 2,879 | 2,889 (mcp 901 → 910, skill 1,477 → 1,478) |
| candidate rows | 57 | 47 (mcp 18 → 9, skill 27 → 26, hook 12) |
| selection tokens | 144 | 144 |
| suspended selection tokens | 1 (`openrouter`) | 0 |
| resolving selected tokens | 143 | 144 |
| default-selected components | 19 | 20 (`openrouter` restored) |
| class ledger | upstream 1,535 · installable 1,181 · loadable 73 · data 90 | upstream 1,541 · installable 1,182 · loadable 76 · data 90 |

The `mcp/openrouter` suspension is collapsed: the token stays in `build` and
now places, and `.opencode/equip.manifest.json` carries `suspended: []`.

### 7. Limits

- **No re-point of a failing row.** The four failures keep their identity; only
  their evidence cell and `checked_at` were rewritten.
- **The six confirmed-gone rows are untouched** (`chessceo-chessceo-mcp`,
  `full-output-enforcement`, `sarefe12-sudo-visibilityradar-mcp`,
  `scotia1973-bot-api-hub`, `staccdotsol-staccbot-tg`,
  `infai-tech-vulnfeed-mcp`); the owner's remove/keep ruling is still pending.
- **No command was invented.** Three npm commands are over packages whose `bin`
  map was read; the skills command is the registry's published command; all
  other admitted rows are command-free.
- **Provenance labels** are the four owner labels plus the already-disclosed
  `third-party-implementation` extension; `third-party-copy` is used for the
  surviving copy.
- **A doc-count drift is reported, not fixed here** (the mission bounds the
  editable surfaces): `docs/00-INDEX.md:92`, `docs/01-OVERVIEW.md:69` and
  `docs/06-REGISTRY-SCHEMA.md:119` still say 19 default-selected components;
  the catalog now measures 20 because `openrouter` returns with its authored
  default flag.
- **Append-only.** This section amends no earlier section and later runs append
  their own.
