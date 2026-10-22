# C2-P2 — Classification and Per-Row Evidence Plan (Dry-Run)

Lane `POST87-APPLY`, Cluster 2, node `c2-classify` (P2 of 6). Owner `vantrilex-typescript`.
Classification DIRECTED: this record executes the adopted P2, it does not re-plan it.

This node assigns one class to each of the 2,941 live catalog rows under the amended v4
contract (`registry/schema/catalog-v4.schema.json`, commit `2085e12`), writes the exact
evidence each row must collect, and forecasts the candidate split. **Nothing was migrated.**
No sidecar, generator, verifier, schema, catalog, mirror, index, or selection file was
written. `registry/candidates/` was not created. The two deliverables are this record and
`C2-P2-MANIFEST.jsonl`.

Evidence labels: **مثبت** marks a measured count or a command that ran here. **تقديري**
marks a P3 forecast that depends on future resolution work.

## 1. Inputs and method

Read live on 2026-10-22:

- `registry/schema/catalog-v4.schema.json` — the class-evidence model, the 16 per-kind
  `allOf` bounds, the three proof shapes, and the six candidate reason codes.
- `registry/catalog.json` and all 16 `registry/data/*.jsonl` sidecars — 2,941 rows, exact
  sidecar/mirror agreement.
- `scripts/verify-catalog.mjs` — the command families, the `SKILL_CMD` shape, the hook
  callback algorithm, the agent frontmatter proof, the theme/file-copy proofs.
- The local surfaces joined **by id**, never by name: `.opencode/skills/<id>/SKILL.md`
  (37 folders), `.opencode/agents/<id>.md` (27 files), `.opencode/plugin/arsenal.ts`,
  `registry/themes/<id>.json` (13 files, 12 catalogued), `registry/design/<brand>/DESIGN.md`
  (84), and the prompt/dataset/template/policy/benchmark/workflow files.

Assignment order, as dispatched:

1. **Kind bound first.** The schema's per-kind `allOf` rule is applied before the order, so
   a row can never be given a class its kind does not admit. This is load-bearing for `mcp`:
   the kind admits only `loadable` and `upstream`, so the eight command-carrying MCP rows are
   `loadable` with a `command_registry` leg, **not** `installable`.
2. Shipped or loaded local surface that joins by id -> `loadable`.
3. Registry-carried command -> `installable` (only where the kind admits it).
4. External coordinate that must resolve -> `upstream`.
5. Data artefact with provenance -> `data`.
6. Otherwise -> candidate, with the failed family as the reason code.

Local evidence was actually collected, not assumed: file existence, agent frontmatter
(`mode` present, no `model` pin), the verifier's own hook-to-callback derivation (exported
name whose camel-case tokens all come from the hook id, unique longest match, wired at least
twice), theme JSON presence, and the design folder whose slug equals the row id. Remote
resolution was **not** batched; those rows are marked `resolution-required-later`.

## 2. Class split (مثبت)

| kind | rows | loadable | installable | upstream | data | candidates | locally provable now | resolution required later |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| skill | 1505 | 21 | 1157 | 327 | 0 | 25 | 19 | 1461 |
| mcp | 923 | 8 | 0 | 915 | 0 | 19 | 0 | 904 |
| agent | 301 | 20 | 0 | 281 | 0 | 0 | 20 | 281 |
| design.md | 84 | 0 | 0 | 0 | 84 | 0 | 84 | 0 |
| cli | 64 | 0 | 64 | 0 | 0 | 0 | 0 | 64 |
| hook | 20 | 20 | 0 | 0 | 0 | 12 | 8 | 0 |
| formatting | 13 | 0 | 0 | 13 | 0 | 0 | 0 | 13 |
| theme | 12 | 12 | 0 | 0 | 0 | 0 | 12 | 0 |
| plugin | 11 | 0 | 0 | 11 | 0 | 0 | 0 | 11 |
| policy | 2 | 0 | 0 | 0 | 2 | 0 | 2 | 0 |
| lsp | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| prompt | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| dataset | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| template | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| benchmark | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| workflow | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| **total** | **2941** | **82** | **1222** | **1547** | **90** | **56** | **151** | **2734** |

The class counts sum to 2,941 (مثبت). Candidate rows keep the class they were assessed
under, so the split above is the assessment, not the post-P3 live catalog: **after P3 removes
the 56 candidates, 2,885 rows remain live**, of which 151 are locally provable today and
2,734 need P3 resolution.

Class totals by kind group:

- `loadable` 82 = 21 skills + 8 MCP servers + 20 agents + 20 hooks + 12 themes + 1 lsp.
- `installable` 1222 = 1,157 skills + 64 cli + 1 prompt.
- `upstream` 1547 = 327 skills + 915 MCP + 281 agents + 13 formatting + 11 plugins.
- `data` 90 = 84 design.md + 2 policy + 1 each dataset, template, benchmark, workflow.

## 3. Candidate split (تقديري — P3 outcome)

56 rows (1.90% of the catalog) cannot produce even their class evidence:

| kind | reason code | rows | finding |
|---|---|---:|---|
| skill | `shape-invalid` | 25 | command uses the URL form `npx skills add https://github.com/<repo> --skill <id>` without `-a opencode -y`, which does not match the verifier's `SKILL_CMD` shape |
| mcp | `source-proof-failed` | 18 | no command, no `source`, no `origin`, and the name is not an `owner/repo` coordinate |
| mcp | `load-proof-failed` | 1 | `vercel-mcp` is remote-only; `npx -y add-mcp@2.4.1 https://mcp.vercel.com` installs a client config and exposes no local server executable for a `server-bin` proof |
| hook | `load-proof-failed` | 12 | no exported callback in `.opencode/plugin/arsenal.ts` draws only on the hook id, so the hook is not wired |

The three reason codes **not** used are `command-registry-failed` (0), `install-command-absent`
(0) and `evidence-lapsed` (0). Zero lapsed proofs is structural, not a finding: no live row
carries a dated v4 proof yet, so the R7 clock starts at P3's first `checked_at`; a row cannot
age past a date that does not exist. No command in the corpus falls outside the registry
families the verifier recognises.

### 3.1 The 25 skill shape candidates (grouped by origin)

| origin | rows |
|---|---:|
| `veniceai/skills` | 15 |
| `resend/resend-skills` | 5 |
| `cypress-io/ai-toolkit` | 3 |
| `angular/skills` | 2 |

These are real commands with real origins; the defect is command shape. P3 may repair the
command into the proven form, or carry the row to `registry/candidates/skill.jsonl`. That
decision is P3's, not this node's.

### 3.2 The 12 unwired hooks

`block-creation-of-random-md-files-keeps-docs-consolidated`,
`block-dev-servers-outside-tmux-ensures-you-can-access-logs`,
`check-for-console-log-in-modified-files-after-each-response`,
`evaluate-session-for-extractable-patterns`,
`load-previous-context-and-detect-package-manager-on-new-session`,
`log-pr-url-and-provide-review-command-after-pr-creation`,
`reminder-before-git-push-to-review-changes`,
`reminder-to-use-tmux-for-long-running-commands`,
`save-state-before-context-compaction`, `suggest-compact`,
`suggest-manual-compaction-at-logical-intervals`,
`warn-about-console-log-statements-after-edits`.

The eight wired hooks are `auto-format-js-ts-files-with-prettier-after-edits`,
`long-running-process-guard`, `persist-session-state-on-end`, `pre-compact`, `session-end`,
`session-start`, `task-dispatcher`, `typescript-check-after-editing-ts-tsx-files`.

### 3.3 The 18 coordinate-less MCP rows

`brave`, `browserbase`, `cloudflare`, `context7-mcp`, `deepwiki`, `discord`, `exa`,
`figma-context-mcp`, `gmail`, `googledrive`, `lenis-mcp-server`, `mem0-memory-mcp`, `neon`,
`openrouter`, `reference-sequential`, `steadyfetch`, `supabase`, `vercel`.

No source is invented for them. Seventeen of the eighteen sit inside the 146-token selection
record, which is a P3 reconciliation item (section 9), not a P2 edit.

## 4. Resolution-required-later (مثبت planning count, تقديري outcome)

2,734 rows have an admissible class but need a P3 remote or provisioned check:

| kind | rows | what P3 must resolve |
|---|---:|---|
| skill | 1461 | `npx skills add` command registry plus the 327 upstream `owner/repo` sources |
| mcp | 904 | 897 upstream coordinates plus 7 npm server packages and their bin entries |
| agent | 281 | the `origin` repository coordinate |
| cli | 64 | the package-manager registry and the executable bin |
| formatting | 13 | the `source` repository coordinate |
| plugin | 11 | the `origin` repository coordinate |

The remaining 151 rows are `locally-provable-now` (مثبت): 90 data rows (file-resolves),
20 local agents (frontmatter-valid), 19 local skills (surface-exists), 12 themes
(surface-exists plus a real file copy), 8 wired hooks (callback-wired), and the lsp need-label
pointing at the project's own `tsconfig.json` typecheck.

## 5. The six data rows carrying a command (R3)

All six are class `data`, verdict `locally-provable-now` (their shipped file resolves), and
each carries `install_cmd_action: null-under-R3` in the manifest. **None is a candidate.**

| row | current command | P3 action |
|---|---|---|
| `dataset/stream-g-guard-probes` | `cp registry/datasets/stream-g-guard-probes.json eval/golden/stream-g-guard-probes.json` | null under R3 |
| `template/target-project-docs-scaffold` | `cp registry/templates/target-project-docs-scaffold.json docs/target-project-docs-scaffold.json` | null under R3 |
| `policy/allow-all-pack` | `cp registry/policies/allow-all-pack.json ~/.config/opencode/opencode.json` | null under R3 |
| `benchmark/verifier-gate-smoke` | `cp registry/benchmarks/verifier-gate-smoke.json eval/verifier-gate-smoke.json` | null under R3 |
| `workflow/forge-dag-exemplar` | `cp registry/workflows/forge-dag-exemplar.yaml .opencode/workflows/forge-dag-exemplar.yaml` | null under R3 |
| `design.md/stripe` | `cp registry/design/stripe/DESIGN.md docs/design/stripe-DESIGN.md` | null under R3 |

The other 84 data rows are already command-free. The single `prompt` row is `installable`, not
data, and keeps its `cp` command with a `file-copy` command-registry proof.

## 6. Sampled resolution evidence (مثبت; bounded to 19 checks)

The method was validated on a stratified sample, not the full batch. Every command below ran
in `O:\vantrilex-arsenal` on 2026-10-22; the exit code is the one printed.

| # | command | exit | result |
|---:|---|---:|---|
| 1 | `gh repo view VoltAgent/awesome-agent-skills --json nameWithOwner` | 0 | `{"nameWithOwner":"VoltAgent/awesome-agent-skills"}` |
| 2 | `gh repo view anthropics/skills --json nameWithOwner` | 0 | `{"nameWithOwner":"anthropics/skills"}` |
| 3 | `gh repo view coreyhaines31/marketingskills --json nameWithOwner` | 0 | `{"nameWithOwner":"coreyhaines31/marketingskills"}` |
| 4 | `gh repo view mukul975/Anthropic-Cybersecurity-Skills --json nameWithOwner` | 0 | resolved |
| 5 | `gh repo view 06ketan/slideshot --json nameWithOwner` | 0 | `{"nameWithOwner":"06ketan/slideshot"}` |
| 6 | `gh repo view 0xDegenMo/lighter-mcp --json nameWithOwner` | 0 | resolved (case-insensitive) |
| 7 | `gh repo view modelcontextprotocol/servers --json nameWithOwner` | 0 | resolved |
| 8 | `gh repo view msitarzewski/agency-agents --json nameWithOwner` | 0 | resolved |
| 9 | `gh repo view anthropics/claude-plugins-official --json nameWithOwner` | 0 | resolved |
| 10 | `gh repo view mixedbread-ai/mgrep --json nameWithOwner` | 0 | resolved |
| 11 | `gh repo view voltagent/awesome-design-md --json nameWithOwner` | 0 | resolved (canonical case `VoltAgent`) |
| 12 | `gh repo view resend/resend-skills --json nameWithOwner` | 0 | resolved |
| 13 | `gh repo view vantrilex-negative-control-2026/does-not-exist --json nameWithOwner` | 1 | `GraphQL: Could not resolve to a Repository ...` |
| 14 | `npm view @arethetypeswrong/cli@0.18.5 version --ignore-scripts` | 0 | `0.18.5` |
| 15 | `npm view artillery@2.0.34 version --ignore-scripts` | 0 | `2.0.34` |
| 16 | `npm view alex@11.0.1 version --ignore-scripts` | 0 | `11.0.1` |
| 17 | `npm view @upstash/context7-mcp version --ignore-scripts` | 0 | `4.4.4` |
| 18 | `npm view @modelcontextprotocol/server-memory version --ignore-scripts` | 0 | `2.0.0` |
| 19 | `brew --version` | not evaluable | `brew` is not installed on this host |

The negative control (13) is deliberately synthetic and is not a catalog row; it proves a bad
coordinate is distinguishable from a good one. Check 19 is a **failed** check, not a skipped
pass: the single homebrew CLI row (`openpencil`,
`brew install zseven-w/openpencil/op`) stays `resolution-required-later` and is not claimed
proven. Twelve repository coordinates and five npm packages resolved; the method holds for the
remaining batch.

## 7. Proofs (مثبت)

All commands executed in `O:\vantrilex-arsenal`; exits are printed.

| proof | command | result |
|---|---|---|
| JSONL parse | throwaway verifier, `JSON.parse` per line | 2,941 lines, every line one JSON object, exit 0 |
| unique rows | same verifier, kind/id key set | 2,941 unique keys, zero duplicates, exit 0 |
| coverage | manifest keys vs `registry/catalog.json` | missing 0, extra 0, exit 0 |
| class sum | same verifier | `82 + 1222 + 1547 + 90 = 2941`, exit 0 |
| kind-bound compliance | same verifier, 16-kind allowed sets | 0 rows outside their kind's set, exit 0 |
| verdict shape | same verifier | 151 now / 2,734 later / 56 candidates; every candidate has code+detail, no non-candidate has a reason, exit 0 |
| R3 six | same verifier | exactly 6, all `data`, all `null-under-R3`, none a candidate, exit 0 |
| catalog proofs | `node scripts/verify-catalog.mjs` | 17 passed, 0 skipped, 0 failed, exit 0 |
| registry proofs | `node scripts/verify-registry.mjs` | 7 passed, 0 failed, 0 skipped, exit 0 |
| mirror currency | `node scripts/generate-catalog-json.mjs --check` | every generated surface `ok`, exit 0 |
| skill format | `node scripts/verify-skills.mjs` | 10 passed, 0 failed, 0 skipped, exit 0 |
| plugin typecheck | `npx tsc --noEmit -p tsconfig.json` | no output, exit 0 |
| no writes outside scope | `git diff --exit-code -- registry scripts .opencode/plugin` | exit 0 |
| report lint | `npx --yes markdownlint-cli2@0.24.0 ".opencode/audit/C2-P2-CLASSIFICATION.md"` | 0 issues, exit 0 |

The throwaway verifier lives outside the repository, shares no code with the generator, and
re-derives every count from the delivered JSONL and `registry/catalog.json`.

## 8. Interpretation choices and limits

The design packet fixes the classes and the evidence shapes; it does not spell out three
joins, so this node states them explicitly rather than hiding them:

1. **Upstream coordinate order: `source` -> `origin` -> `name` when the name is already an
   `owner/repo` coordinate.** `source` is the schema's aggregator field; `origin` is the
   schema's true-upstream field and is used when `source` is null (282 agents, 11 plugins, 46
   MCP rows). For MCP rows whose authored `name` is `owner/repo` (870 rows), the name is the
   only authored coordinate. No coordinate is derived from a display name that is not already
   in coordinate form, and no local surface is inferred from any name: every surface join is
   an id join against a real file. The 18 rows with no coordinate of any kind go to candidates.
2. **MCP is never `installable`.** The schema bound says `loadable | upstream`, so the eight
   MCP rows carrying an npm command are `loadable` with a `command_registry` leg. The P1
   forecast counted them as installable; the measured split corrects that (section 10).
3. **A skill install command may name the row's `origin`, not its `source`.** The corpus does
   this for aggregator rows (for example `npx skills add phuryn/pm-skills ...` on a row whose
   `source` is `VoltAgent/awesome-agent-skills`). The shape check accepts either coordinate.
   The 25 URL-form commands are held to the verifier's `SKILL_CMD` shape and become
   `shape-invalid` candidates.

Limits, stated plainly:

- **No full network batch.** 2,734 rows are plans, not proofs. Only 19 sample checks ran.
- **No `checked_at` is stamped.** The manifest is a plan; P3 collects the proofs and dates
  them. No row claims a dated v4 proof here.
- **No command installation was attempted.** npm/registry metadata was read; no package was
  installed and no MCP server was started.
- **`brew` could not be evaluated on this host.** That row remains unresolved, not passed.
- **The lsp row's proof is a need-label proof** (`when_to_use` present plus the project's
  `tsconfig.json`), matching the schema's "need-label pointing at the project's own typecheck"
  reading. It is not a server-bin proof, because OpenCode V2 runs no language servers.
- **The manifest is not schema-validated as a live record.** It deliberately omits
  `checked_at`; `registry/data/*.jsonl` remains v3 and is the P3 migration target.

## 9. P3 impact (reported, not acted)

The 146-token selection record intersects the forecast as follows (مثبت):

| verdict | selected tokens |
|---|---:|
| `locally-provable-now` | 52 |
| `resolution-required-later` | 77 |
| `candidate` | 17 |
| **total** | **146** |

All 17 selected candidates are the coordinate-less MCP rows above. P3 must either prove them
(by authoring a real command/source, which is a repair, not a classification) or re-point the
selection at verified MCP rows such as `mcp/supabase-mcp` and remove them from the live
catalog. This node does not edit the selection, the sidecars, or the candidate surface.

The 7 selected rows that carry an unverified command (the prompt plus the six data rows) are
resolved by different P3 actions: the prompt keeps its command with a `file-copy` proof; the
six data rows lose the command under R3.

## 10. Measured vs the P1 forecast

The P1 decision record's starting rule produced `loadable 85 · installable 1230 · upstream
1536 · data 90`. The measured assignment differs only where the kind bound and the coordinate
rule are applied:

| class | P1 forecast (تقديري) | P2 measured (مثبت) | delta | why |
|---|---:|---:|---:|---|
| loadable | 85 | 82 | -3 | 11 plugins moved to upstream; 8 MCP command rows moved in from installable |
| installable | 1230 | 1222 | -8 | `mcp` does not admit `installable` |
| upstream | 1536 | 1547 | +11 | the 11 plugin rows |
| data | 90 | 90 | 0 | unchanged |
| candidate | not forecast | 56 | +56 | 25 shape, 18 source-proof, 13 load-proof |

The candidate count is new information, not a contradiction: the P1 forecast was a class
starting rule and did not attempt an evidence verdict per row.

---

Ponytail: FULL — minimal dry-run artefacts (one JSONL + one report), no speculative
abstraction, no sidecar/schema/verifier edits; FLOOR held by mechanical coverage, uniqueness,
kind-bound and R3-six checks (exit 0) plus the full battery; CEILING held by stopping at the
classification plan instead of migrating rows or creating `registry/candidates/`.
