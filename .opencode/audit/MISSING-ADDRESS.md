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

The `attempted` field per row below is copied from `registry/candidates/<kind>.jsonl`. No probe
is inferred from a name.

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

- **No row is `unrecorded`.** Every attempted-probe list in this section comes from its
  candidate row. The 18 coordinate-less MCP rows carry an **empty** list because there was
  nothing addressable to probe, not because a probe record was lost.
- **No re-point and no edit.** No `source`, `origin`, `install_cmd`, candidate file, or
  equip-manifest entry was changed to produce this section. The rows remain candidates exactly
  as P3 left them.
- **Flow.** This section goes to the owner, who passes it to the verifier seat (VANZEN). A
  recovered address returns as evidence, is re-proven, and re-enters as a new live row under
  V4-3. A row still unresolvable after the hunt returns to the owner for an explicit remove/keep
  ruling.
- **Append-only.** Later runs append their own dated sections; they do not amend this one.
