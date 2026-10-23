# 02 — Verifier Scripts

Three Node ESM scripts prove the repository. All three are zero-dependency,
hand-rolled, and share one convention: one named check per rule, PASS / FAIL /
SKIPPED with a detail line, per-finding lines on stderr, a totals line and an
explicit verdict on stdout, and exit 0 only when no check fails. A skipped check
is never reported as a pass.

The check counts below were observed 2026-10-22. These scripts are owned by
other lanes on this branch and their check sets grow with the components they
cover, so re-run a script and read its own totals line rather than quoting the
count from here.

## `scripts/verify-registry.mjs` — 7 checks

Reads `registry/VANTRILEX_CATALOG.md` and `registry/data/overlaps.yaml`, and
imports its loader and validator from the generator.

| # | Check | Proves |
|---|---|---|
| 1 | `utf8-validity` | The catalog decodes as strict UTF-8 |
| 2 | `schema-conformance` | Every record satisfies the catalog schema |
| 3 | `row-count-integrity` | Heading counts match the parsed rows |
| 4 | `install-command-invariant` | No record claims verified with null cmd |
| 5 | `orphan-references` | Every overlap id reference resolves |
| 6 | `duplicate-ids` | No id collides within its kind |
| 7 | `mcp-name-normalization` | MCP server names stay unique after V2 rules |

Check 4 is the honesty invariant: `verification: verified` now means the record's
declared class evidence exists, so a live record cannot carry a null command
where its class requires one. Observed live: zero violations, zero warnings —
every live row is `verified`, and an unproven row is a candidate in
`registry/candidates/<kind>.jsonl`, never a live row with a weaker label.

Check 5 resolves the `overlaps.yaml` reference fields (`supersedes`, `winner`,
`members` and the rest). Check 7 normalizes out-of-range characters in MCP
names and proves no two records collide.

When the catalog cannot be parsed at all, the schema check fails and the
remaining checks report SKIPPED carrying the parse error as the reason.

**Label check.** Check 2's PASS text now names
`registry/schema/catalog-v4.schema.json`, which is the file the loader it
imports actually reads. The v3 label drift recorded here before the v4
migration is closed.

## `scripts/verify-catalog.mjs` — 20 checks

Proves `registry/catalog.json` for honesty and shape, the candidate files for
schema conformance, and `.opencode/equip.manifest.json` for a selection that
resolves. Nothing here reads a lockfile: the catalog rows are the inputs.

| # | Check | Proves |
|---|---|---|
| 1 | `command-honesty/installable-requires-command` | Every `installable` row carries an install command |
| 2 | `command-honesty/registry-matches-command` | Every non-null command equals the command its `command_registry` proof names |
| 3 | `command-honesty/verified-only` | Every live row is `verified`; no carried state survives |
| 4 | `selection/suspension` | Every suspension entry is well-formed, names a selected token, points at a real document, and is either active or honestly stale |
| 5 | `loadability/hooks` | Every hook row maps to an exported, wired callback in `arsenal.ts` |
| 6 | `loadability/agents` | Every local agent file declares a valid `mode`; selected agents resolve to a file |
| 7 | `loadability/skills` | Every selected skill resolves to a local folder or an install command |
| 8 | `loadability/registers` | Every selected token resolves in `catalog.json` and `registry/data/<kind>.jsonl` |
| 9 | `mcp-cap` | Selected tier-core MCPs sit within `MCP_CAP` 8 |
| 10 | `phase-sets` | Every selected token places into one of the six orchestrated phases |
| 11 | `command-shape/cli` | Each `cli` row names a real installer with valid phase, tier, verification |
| 12 | `command-shape/lsp` | The `lsp` row is valid and its provisioning label is honest |
| 13 | `command-shape/theme` | Each theme row ships V2-native JSON, with no image keys and no model keys |
| 14 | `file-copy/shape` | Shipped file kinds land by plain copy and pass their kind invariant |
| 15 | `command-shape/skills-upstream` | Upstream skill commands hold the install shape and the coordinate resolves |
| 16 | `candidates/schema` | Every row in `registry/candidates/<kind>.jsonl` validates against `$defs.candidate` |
| 17 | `evidence/ttl` | Every proof sits inside its class window: 90 days for `command_registry`, 180 for `load_proof`, 365 for `source_proof` |
| 18 | `command-shape/mcp-npm` | Version-pinned npm MCPs match the registry and expose a bin |
| 19 | `agent-hygiene` | Selected agents carry no model pin; leaders alone carry color |
| 20 | `selection/top-level-skills` | The selection carries Prime, Vanguard, and Doctrine |

The per-kind rows grow with the catalog's selectable kinds: a new kind adds a
further shape row rather than a further check name pattern. New-kind onboarding
is frozen until the P6 sign-off, so the set is stable while v4 settles.

Two failure paths exist ahead of these: an unreadable `catalog.json` fails
`command-honesty/*` with the parse error, and a selection record without a
`phases` object fails `phase-sets` naming the missing key. Neither cascades into
a silent pass.

Checks 15 and 18 are the only network-dependent rows. Check 15 reports SKIPPED
when `gh` is not authenticated; check 18 reports SKIPPED when npm resolution is
offline, naming how many packages were proven and how many were skipped. Both
are environment conditions, not catalog defects.

Check 19 exists because OpenCode V2 defaults an omitted `mode` to `primary`, so
a subagent file without a mode line would silently be promoted to session
leadership. It requires an explicit `primary`, `subagent`, or `all`, and proves
each self-sourced selected agent resolves to a file.

Check 11 accepts only a real package-manager invocation or the vendor's own
installer. A bare package name, a curl-piped installer, or a shell metacharacter
is refused rather than trusted, because an agent downstream executes the string.

Verdict line on success: `VERDICT: PASS - catalog proven (20 passed, 0 skipped,
0 failed).`

## `scripts/verify-skills.mjs` — 10 checks

Enforces the skill-file format contract over every
`.opencode/skills/<name>/SKILL.md`. The rules themselves are in
`07-SKILLS-AGENTS.md`; the check names are these:

| # | Check | Proves |
|---|---|---|
| 1 | `skill-discovery` | Folders are hyphenated, each holds `SKILL.md` |
| 2 | `frontmatter-keys` | Exactly `name` and `description`, no others |
| 3 | `frontmatter-name` | The name equals its folder name |
| 4 | `frontmatter-description` | One third-person sentence, trigger first |
| 5 | `body-headings` | The seven headings, in order, exactly once |
| 6 | `no-placeholders` | No TODO, FIXME, coming soon, or placeholder |
| 7 | `no-excluded-toolchains` | No reference to an excluded toolchain |
| 8 | `file-hygiene` | LF, strict UTF-8, no BOM, one trailing newline |
| 9 | `mechanism-single-home` | Shared mechanism blocks have one home |
| 10 | `phase-map-cross-check` | Doctrine's phase map names all resolve |

Check 4 fails a description shorter than 40 characters, one that is not a
single sentence, one containing a first-person `I`, one whose trigger is
absent, or one whose `Use when` sits past character 80.

Check 9 enforces the single-home rule for three tokens: the circuit-breaker
halt block and its incident-report banner live only in
`circuit-breaker-guard`, and `CONTEXT ANCHOR` lives only in
`session-context-primer`. A second copy anywhere is a violation.

Check 10 parses the phase-map table out of
`.opencode/skills/vantrilex-doctrine/SKILL.md` and proves every backticked name
resolves either as a local skill folder or as a catalog id.

The script resolves the repository root from its own location, never the
working directory, so it can be run from anywhere. An optional `--root <dir>`
flag overrides the root for fixtures and sibling worktrees.
