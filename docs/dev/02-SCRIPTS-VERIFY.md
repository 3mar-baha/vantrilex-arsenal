# 02 — Verifier Scripts

Three Node ESM scripts prove the repository. All three are zero-dependency,
hand-rolled, and share one convention: one named check per rule, PASS / FAIL /
SKIPPED with a detail line, per-finding lines on stderr, a totals line and an
explicit verdict on stdout, and exit 0 only when no check fails. A skipped check
is never reported as a pass.

The check counts below were observed 2026-10-14. These scripts are owned by
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

Check 4 is the honesty invariant: a record with `verification: verified` and a
null `install_cmd` is a violation. A record with a non-null command that is
still `unverified` is allowed during backfill and is reported as a warning, not
a failure — the live run names 1150 such records.

Check 5 resolves the `overlaps.yaml` reference fields (`supersedes`, `winner`,
`members` and the rest). Check 7 normalizes out-of-range characters in MCP
names and proves no two records collide.

When the catalog cannot be parsed at all, the schema check fails and the
remaining checks report SKIPPED carrying the parse error as the reason.

**Known label drift.** Check 2's PASS text names
`registry/schema/catalog-v2.schema.json`, but the loader it imports reads
`registry/schema/catalog-v3.schema.json`. The check proves conformance to the
schema the generator actually loads; only the printed label is stale.

## `scripts/verify-kit.mjs` — 15 checks

Proves `kit/kit.lock` against its schema, the catalog mirror, and the live
plugin surface.

| # | Check | Proves |
|---|---|---|
| 1 | `lockfile-validates` | Lock conforms to `kit.lock.schema.json` |
| 2 | `per-kind/skills-in-repo` | In-repo skills have a matching `SKILL.md` |
| 3 | `per-kind/skills-upstream` | Install-command shape, and gh resolves |
| 4 | `per-kind/mcp-npm` | Pinned npm MCPs exist and expose a bin |
| 5 | `per-kind/mcp-builtin` | Built-in MCPs are null cmd plus unverified |
| 6 | `per-kind/plugins` | Plugins are native records, no invented spec |
| 7 | `per-kind/hooks` | Every hook maps to a function in `arsenal.ts` |
| 8 | `per-kind/agents` | Agents carry null cmd plus unverified |
| 9 | `per-kind/cli` | Each cli entry names a real installer |
| 10 | `per-kind/lsp` | The lsp entry is valid and honest |
| 11 | `per-kind/theme` | The theme ships V2-native JSON, no image keys |
| 12 | `agent-mode-explicit` | Every agent file declares `mode` |
| 13 | `catalog-agreement` | Lock and mirror agree per `(id, kind)` |
| 14 | `mcp-cap` | Tier-core MCP count is within `mcp_cap` |
| 15 | `pending-integrity` | Pending ids are absent from components |

The per-kind rows grow with the lock's kinds: `per-kind/theme` appeared with the
`theme` kind, and a further kind adds a further row rather than a further check
name pattern.

Two failure-only rows exist ahead of these: `schema-load` and `lockfile-load`,
raised when a file cannot be read, which then cascade the per-kind rows to FAIL
with "cannot be evaluated".

Checks 3 and 4 are the only network-dependent rows. Check 3 reports SKIPPED
when `gh` is not authenticated; check 4 reports SKIPPED when npm resolution is
offline, naming how many packages were proven and how many were skipped. Both
are environment conditions, not kit defects.

Check 12 exists because OpenCode V2 defaults an omitted `mode` to `primary`, so
a subagent file without a mode line would silently be promoted to session
leadership. It requires an explicit `primary`, `subagent`, or `all`, and proves
each self-sourced lock agent resolves to a file.

Check 9 accepts only a real package-manager invocation or the vendor's own
installer. A bare package name, a curl-piped installer, or a shell metacharacter
is refused rather than trusted, because an agent downstream executes the string.

Verdict line on success: `VERDICT: PASS - kit proven (15 passed, 0 skipped, 0
failed).`

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
