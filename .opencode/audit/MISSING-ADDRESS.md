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
