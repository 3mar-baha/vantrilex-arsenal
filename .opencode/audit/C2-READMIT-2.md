# C2-READMIT-2 — MISSING-ADDRESS round-2 re-proof and re-admission

Node `c2-readmit-2`, POST87-APPLY Cluster 2, 2026-10-23.
Base: branch tip `22b7817` (live 2,879 · candidates 57 · selection 144/1/143,
suspended `mcp/openrouter` only). Owner mission: `AGENT.md`, 2026-10-23
(§0–§6, recorded verbatim). Evidence input: VANZEN hunt2-E1/E2/E3.

Binding: ponytail FULL. Every coordinate below was resolved live on 2026-10-23;
every admitted row carries that date, never a carried one. Nothing was guessed,
nothing was dropped: ten rows passed, four stayed candidates with round-2
evidence, and every admitted candidate's history is preserved in
`.opencode/audit/MISSING-ADDRESS.md` (append-only).

## 1. Method

| probe | used for | exact form |
|---|---|---|
| repository resolves | upstream rows whose artifact is a repository | `gh repo view <owner>/<repo> --json nameWithOwner,description,isArchived,licenseInfo` |
| path / file resolves | repository rows whose artifact is a subdirectory or file | `gh api repos/<owner>/<repo>/contents/<path>` (contents read; frontmatter compared) |
| npm package resolves | npm MCP rows | `npm view <pkg> version bin maintainers repository.url description --json` (non-empty `bin` = `server-bin`) |
| PyPI package resolves | PyPI-only MCP rows | `GET https://pypi.org/pypi/<pkg>/json`, plus the wheel entry list and file contents |
| hosted endpoint resolves | remote-only MCP rows | `POST` JSON-RPC `initialize`, `accept: application/json, text/event-stream` |
| registry record | Smithery-hosted rows | `GET https://registry.smithery.ai/servers/<owner>/<name>` |
| directory record | the skill row | `GET https://www.skills.sh/mattpocock/skills/resolving-merge-conflicts` (full SKILL.md text and the canonical install command) |

Four negative results ran and stayed negative: `JhiNResH/maiat-protocol`
not-found in GraphQL and REST; `https://api.utilia.ink/mcp` TLS
`SEC_E_UNTRUSTED_ROOT` and HTTP 503 on an insecure re-probe; the PyPI
`blackmount-nlp-mcp` wheel is a deprecation stub; `https://api.kynth.studio/mcp`
redirects to a different domain and returns 401.

## 2. Per-row verdict table (14)

| row | re-proved coordinate | class | provenance | fresh checked_at | verdict + reason + flag judgment |
|---|---|---|---|---|---|
| `mcp/openrouter` | `https://mcp.openrouter.ai/mcp` | upstream | hosted-endpoint | 2026-10-23 | **PASS** — the official endpoint answers HTTP 401 `invalid_token` without a bearer token, i.e. present and answering (same bar as the Vercel endpoint). The row returns to `build`/`core` with its authored default flag. |
| `mcp/jhinresh-maiat-protocol` | `JhiNResH/maiat-protocol#packages/mcp-server` · npm `@jhinresh/mcp-server` | upstream | — | 2026-10-23 | **FAIL** — the direct repository does not resolve (GraphQL and REST both 404), so the path cannot be probed; npm 0.9.0 does resolve (bin `maiat-mcp`, maintainer `jhinresh`) and the conflict is recorded. Mission §2(d) makes direct repo resolution the first test. |
| `mcp/cmcgrabby-hue-syndicate-links` | `npm:syndicate-links-mcp` 0.3.0 | upstream | package-registry | 2026-10-23 | **PASS** — package resolves with bin `syndicate-mcp`; its repository field names the dead authored `cmcgrabby-hue/syndicate-links`, which confirms identity. Admitted `upstream` with no command: the schema refuses a command on a loadable row with no resolving source. |
| `mcp/kzino-vorim-mcp-server` | `acumenix/vorim-mcp-server` · npm `@vorim/mcp-server` 1.1.17 | loadable | package-registry | 2026-10-23 | **PASS** — the repository resolves and its `package.json` is `@vorim/mcp-server` with bin `vorim-mcp-server`; the npm package resolves with the same bin. Identity is the Vorim MCP server; the npm-declared `Vorim-AI-Labs/vorim-protocol` does not resolve and the maintainer (`vorim-ai`) differs from the authored owner — both disclosed, neither hidden. |
| `mcp/mohamedkuch-utilia-solana-agent` | `https://api.utilia.ink/mcp` | upstream | — | 2026-10-23 | **FAIL** — TLS validation fails and an insecure re-probe answers HTTP 503 "no available server"; npm `utilia` is a different library and is barred. No live-provable endpoint. |
| `mcp/pathrule-mcp` | `pathrule/pathrule` (`packages/mcp`) · npm `@pathrule/mcp` 1.0.7 | loadable | package-registry | 2026-10-23 | **PASS** — the repository resolves, `packages/mcp` resolves with `src`/`package.json`, and the npm package resolves with bin `pathrule-mcp`. |
| `mcp/rippermercs-tensorfeed` | `RipperMercs/tensorfeed-mcp` · npm `@tensorfeed/mcp-server` 2.0.5 | loadable | package-registry | 2026-10-23 | **PASS** — the repository resolves (same owner as the authored row) and the npm package resolves with bin `tensorfeed-mcp`. |
| `mcp/blackmount-ai-blackmount-nlp-mcp` | `pypi:blackmount-nlp-mcp` | upstream | — | 2026-10-23 | **FAIL (§3.1)** — the package resolves, but the wheel holds only a `server.py` that prints a deprecation notice and exits 1; the summary is "Deprecated. See app.blackmount.ai". A source proof would prove a tombstone, not the MCP server. |
| `mcp/newageflyfish-max-volthq` | `npm:volthq-mcp-server` 0.1.25 | upstream | package-registry | 2026-10-23 | **PASS (§3.2)** — the package resolves with bin `volthq-mcp-server` and no repository field; package name and "Volt HQ compute price oracle" description match. Admitted `upstream` because the self-shipped rule forbids a command on a loadable row whose source is null. |
| `mcp/kyisaiah47-kynth-mcp` | `https://api.kynth.studio/mcp`, server "kynth-core" | upstream | — | 2026-10-23 | **FAIL-hold (§3.3)** — 308 to `https://api.thecompound.tech/mcp`, which returns 401 "Missing API key"; no repository, package or server coordinate resolves, so identity cannot be proven and there is nothing pinnable. |
| `mcp/subhatta123-twilize` | `smithery:suddh123/twilize` | upstream | hosted-endpoint | 2026-10-23 | **PASS (§3.4)** — the Smithery record resolves (200, `remote: true`, deployment URL, 47 tools) and its icon lives in the row owner's `subhatta123/twilize` repository. Admitted in remote form with no command; the record's `uvx twilize` line is not a coordinate. |
| `mcp/turbyho-mem-context` | `pypi:mem-context` 0.1.14 | upstream | package-registry | 2026-10-23 | **PASS (§3.5)** — the package resolves with a 25,793-character description naming `io.github.turbyho/mem-context` and the `turbyho/mem-context` git URL; identity rests on more than a name match. |
| `mcp/ebbfijsf-agent-reader` | `timoyashar982-star/agent-reader` · npm `agent-reader` 1.3.7 | upstream | third-party-copy | 2026-10-23 | **PASS (§3.6)** — the authored repository is gone; the surviving copy resolves, its `SKILL.md` records `metadata.author: ebbfijsf`, and its `package.json` is `agent-reader` 1.3.7. The npm bin is the document CLI, not the MCP entry, so no command is claimed. |
| `skill/resolving-merge-conflicts` | `mattpocock/skills` via the skills directory page | installable | package-registry | 2026-10-23 | **PASS (§3.7)** — the repository resolves; the tree carries `docs/engineering/resolving-merge-conflicts.md`, not a `SKILL.md`; the skills registry serves the full skill text and publishes the canonical install command. Admitted on the registry record. |

## 3. Named flag rulings (3.1–3.7)

| flag | ruling |
|---|---|
| 3.1 stub vs source_proof | **FAIL.** Existence of a deprecation stub is not identity of an MCP server. |
| 3.2 package-only precedent | **PASS, bounded to `upstream`.** The package proves itself; a command would need a resolving source, which does not exist, so none is claimed. |
| 3.3 no pinnable coordinate | **FAIL-hold.** A redirect to another domain plus an auth wall is not a coordinate. |
| 3.4 hosted-only | **PASS, remote form.** The Smithery record is the artifact's own listing (icon in the row owner's repository); no stale `uvx` command is carried. |
| 3.5 description-match weight | **PASS, strengthened.** The package description carries the `io.github.turbyho/mem-context` name and the owner's git URL. |
| 3.6 re-prove from scratch / surviving copy | **PASS, `third-party-copy`.** The copy names the original author in its own frontmatter; the npm bin is not the MCP entry, so the row stays command-free. |
| 3.7 directory-served full text | **PASS, `installable`.** The class evidence is the registry record plus its published command; the repository tree is not claimed to hold a `SKILL.md`. |

## 4. Duplication check

Every recovered coordinate was compared with all 2,879 live rows before
admission: no id collision, and no coordinate collision beyond the expected
repository sharing — `mattpocock/skills` already sources 36 live skills and now
37; the recovered skill id did not exist. No duplicate twin was found, so no
merge treatment was required.

## 5. State change

| surface | before | after |
|---|---:|---:|
| live catalog rows | 2,879 | 2,889 (mcp 901 → 910, skill 1,477 → 1,478) |
| candidate rows | 57 | 47 (mcp 18 → 9, skill 27 → 26, hook 12) |
| selection tokens | 144 | 144 |
| suspended selection tokens | 1 (`openrouter`) | 0 |
| resolving selected tokens | 143 | 144 |
| default-selected components | 19 | 20 (`openrouter` restored) |
| class ledger | upstream 1,535 · installable 1,181 · loadable 73 · data 90 | upstream 1,541 · installable 1,182 · loadable 76 · data 90 |

The openrouter suspension is collapsed on PASS: `mcp/openrouter` stays in
`build` and now places, and `.opencode/equip.manifest.json` carries
`suspended: []`. Had it failed, the arithmetic would have stayed 144/1/143.

## 6. Battery

| gate | exit | evidence |
|---|---:|---|
| `node scripts/generate-catalog-json.mjs --markdown --indexes` | 0 | 2,889 rows; 16 sections; generated surfaces written |
| `node scripts/generate-catalog-json.mjs --check` | 0 | catalog.json, the catalog table and every per-kind index are current |
| `node scripts/verify-catalog.mjs` | 0 | 20 passed / 0 skipped / 0 failed; 144/144 selected resolve, 0 suspended, 0 stale |
| `node scripts/verify-registry.mjs` | 0 | 7 passed / 0 failed (2,889 records, 16 sections, no duplicate id) |
| `node scripts/verify-skills.mjs` | 0 | 10 passed / 0 failed (37 folders) |
| `npx --no-install tsc --noEmit` | 0 | clean (repo `tsconfig.json`) |
| `npx --yes markdownlint-cli` on the two touched audit documents | 0 | `.opencode/audit/C2-READMIT-2.md`, `.opencode/audit/MISSING-ADDRESS.md` |

## 7. Limits and deviations

- **Four rows stay candidates** with their identity intact and their evidence
  rewritten to the round-2 result; no coordinate was guessed.
- **The six confirmed-gone rows are untouched** (`chessceo`,
  `full-output-enforcement`, `visibilityradar`, `scotia api-hub`, `staccbot`,
  `vulnfeed`); the owner's remove/keep ruling is still pending.
- **Class choice follows the schema, not convenience.** `syndicate-links` and
  `volthq` are `upstream` rather than `loadable` because their only source is a
  package with no repository, and the v4 self-shipped rule forbids a command on
  a loadable row whose source is null. The package names live in their
  descriptions so the provisioning fact is not lost.
- **Owner drift is disclosed, not hidden**: `Kzino/vorim-mcp-server` admits via
  `acumenix/vorim-mcp-server` and npm `@vorim/mcp-server` (maintainer
  `vorim-ai`); `volthq-mcp-server` is published by `jarnot2019`;
  `agent-reader` is published by `clarexue` while the surviving copy names
  `ebbfijsf` as author.
- **Doc-count drift reported, not fixed**: `docs/00-INDEX.md:92`,
  `docs/01-OVERVIEW.md:69` and `docs/06-REGISTRY-SCHEMA.md:119` still state 19
  default-selected components; the catalog measures 20 after `openrouter`
  returns with its authored flag. Those files are outside this mission's bounds.
- **The diff-size-guard advisory fired** (`33,054` uncommitted lines across 40
  files since `22b7817`): that is the inherited dirty tree, inventory-only and
  never deleted; this node committed only its own scoped surfaces.
- **No command was invented and no secret was printed.** The three npm commands
  are over packages whose `bin` map was read; the skills command is the
  registry's own; every other admitted row is `install_cmd: null`.

Ponytail: FULL — 14 coordinates re-proved live, 10 admitted under their class
evidence with fresh `checked_at`, 4 left as candidates with recorded evidence,
and the full battery re-run green (20/20 catalog, 7/7 registry, 10/10 skills,
`--check` 0, tsc 0, lint 0).
