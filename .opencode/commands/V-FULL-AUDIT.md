---
description: Run the full repository audit by fanning out read-only subagents and emitting exactly one cited 1000-plus-line report under Law-13 numbering.
---

# Full Repository Audit

You are running the Vantrilex full audit. Your job is to **measure** the
repository as it stands, then emit exactly one report file. You change no
code, you fix nothing, and you install nothing.

Operator intent for this run:

$ARGUMENTS

If that is empty, audit the repository root across every section of the
REPORT-SPEC below. If it names a scope (`kit`, `registry`, `docs`,
`plugin`, `commands`), audit that scope fully and mark out-of-scope
sections `OUT OF SCOPE (not requested)` rather than skipping them silently.

## Step 1 - Fan out read-only subagents

Audit through parallel read-only subagents, one per area, never by walking
the whole tree yourself:

- `kit` — lock entries, schema agreement, pending list reasons.
- `registry` — sidecar rows, catalog mirror agreement, per-kind indexes.
- `agents` — definition files, frontmatter, load conventions.
- `skills` — definition files, frontmatter, trigger descriptions.
- `commands` — command files under `.opencode/commands/` (18) and `.opencode/command/` (4).
- `plugin` — plugin module surface and hook wiring.
- `docs` — relative links, census claims, canonical placement.

Each subagent returns its findings as `file:line` cited rows, never as
prose summaries. A claim without a `file:line` citation is not a finding,
it is a rumor, and it does not enter the report.

## Step 2 - Emit exactly ONE report file

Write the report to exactly one deterministic path:

`.opencode/audit/V-FULL-AUDIT.md`

Re-running this command with the same tree overwrites that file in place.
No timestamped copies, no suffixed variants, no second file. One audit,
one file, one path.

The report holds 1000 lines or more. Length comes from evidence tables,
cited rows, and per-check output, never from filler. A short report is an
incomplete audit; pad nothing, measure more.

## REPORT-SPEC - The 14 sections

Every report carries all 14 sections in this order, with these headings,
numbered as shown:

1. `## 1. Scope and method`
2. `## 2. Inventory census`
3. `## 3. Kit lock integrity`
4. `## 4. Registry integrity`
5. `## 5. Catalog agreement`
6. `## 6. Agent definitions`
7. `## 7. Skill definitions`
8. `## 8. Command surface`
9. `## 9. Plugin and hooks`
10. `## 10. Documentation links`
11. `## 11. Secret hygiene`
12. `## 12. Ranked findings`
13. `## 13. Remediation plan`
14. `## 14. Re-run evidence`

Section contents:

- **1. Scope and method** — the operator intent, the scope audited, the
  subagents fanned out, and the commands run with their exit codes.
- **2. Inventory census** — live counts by kind and by tier, counted from
  the files, never transcribed from an older document.
- **3. Kit lock integrity** — every lock entry checked against its
  definition and its registry row; every pending id carries its reason.
- **4. Registry integrity** — every sidecar row parses; ids are unique;
  no row points at a file that does not exist.
- **5. Catalog agreement** — the generated mirror matches its generator
  output; the entry count equals the counted census.
- **6. Agent definitions** — every agent file loads; name matches stem;
  frontmatter holds with no extra keys.
- **7. Skill definitions** — every skill file loads; name matches folder;
  the trigger sentence is present and front-loaded.
- **8. Command surface** — every command file under `.opencode/commands/` (18)
  and `.opencode/command/` (4) expands; frontmatter holds; no two commands
  claim one name.
- **9. Plugin and hooks** — the plugin module loads; each hook states its
  surface and its firing condition honestly.
- **10. Documentation links** — every relative link in changed or audited
  Markdown resolves; the census in the docs matches the counted numbers.
- **11. Secret hygiene** — no real credential appears in any audited file;
  report file and line only if one does, never the value.
- **12. Ranked findings** — every defect found, ranked, Law-13 numbered.
- **13. Remediation plan** — one fix per finding, ordered by rank, each
  naming its owner file and its re-run proof.
- **14. Re-run evidence** — the exact verification commands and their
  verbatim outputs with exit codes.

## Law-13 numbering

Every finding in section 12 carries exactly one Law-13 identifier of the
form `L13-<SS>-<NNN>`, where `<SS>` is the zero-padded REPORT-SPEC section
the finding belongs to and `<NNN>` is the zero-padded rank order starting
at `001`. Examples: `L13-03-001`, `L13-12-007`. Findings are ranked worst
first; the identifier order matches the rank order. Remediation steps in
section 13 cite the identifier they close. An identifier with no finding,
or a finding with no identifier, fails the report.

## Citation rule

Every factual claim in every section cites at least one `file:line`
reference of the form `` `path/to/file:line` ``. Census numbers cite the
counting command and its output. Verifier results quote the exit code. A
section whose claims lack citations is marked `UNPROVEN` in its first
line until the citations land.

## Operating rules

1. **Read-only.** This command writes exactly one file: the report. It
   modifies nothing else and deletes nothing.
2. **No invention.** A component with no install command is reported as
   `unverified`, never given a plausible-looking command.
3. **English only.** No placeholder tokens anywhere in the report.
4. **One concern per finding.** A finding that bundles two defects is
   split before it is ranked.

## Final reply

Print, in this order:

1. **Report** — the single path written and its line count.
2. **Census** — the counted numbers by kind and tier.
3. **Findings** — the Law-13 identifiers with one line each.
4. **Verdict** — one line: `CLEAN`, `DEFECTS RANKED`, or `UNPROVEN`.
