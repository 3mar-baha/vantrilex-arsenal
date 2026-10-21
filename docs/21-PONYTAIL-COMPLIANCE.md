# 21 Ponytail Compliance for the Build Lane

This document owns the build lane ponytail compliance machinery.
It states the brief line every dispatch carries, the trailer every
report ends with, the mechanical non-trivial rule, and the two
substantive checklists the Verifier and the Reviewer walk.
Wording here is enforceable word for word. A paraphrase is not
compliance. The upstream body text stays adopted, never rewritten;
this document owns only the pins and the wiring below.

Upstream seat: `dietrichgebert/ponytail` on `main`, canonical
`skills/...` path. Variant pins live in
`.opencode/skills/ponytail/GUARDRAILS.md` and are not repeated here.
Redistribution retains attribution to `dietrichgebert/ponytail` and
carries the MIT notice, copyright 2026 DietrichGebert.

## Guardrails verbatim

Downstream specs, kit entries, and tests copy both quoted lines
verbatim. Paraphrase never satisfies the wiring. FLOOR stops
reckless laziness. CEILING stops astronaut seniority.

FLOOR:

```text
FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
```

CEILING:

```text
CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."
```

## 1 Doctrine brief line

Every dispatch brief to a code-agent node carries exactly one
`Doctrine:` line. The line names the ponytail binding in force for
that node. A code-agent brief without the line is incomplete and the
node does not start; the leader returns it for a corrected brief.

Shape:

```text
Doctrine: ponytail <binding> binds this node — FLOOR and CEILING from RESEARCH-03.md R0b hold verbatim.
```

The `<binding>` slot holds exactly one of `FULL`, `LITE`, `ULTRA`,
`ponytail-review`, or `EXEMPT (read-only — no generation posture)`.
`FULL` is the default core posture. `LITE` and `ULTRA` are runtime
arguments to core, never separate entries. `ponytail-review` binds
report-only review work. `EXEMPT` applies only to nodes that write
no code and run no generation step, and the brief states the reason
on the same line.

Examples:

```text
Doctrine: ponytail FULL binds this node — FLOOR and CEILING from RESEARCH-03.md R0b hold verbatim.
```

```text
Doctrine: ponytail ponytail-review binds this node — FLOOR and CEILING from RESEARCH-03.md R0b hold verbatim.
```

```text
Doctrine: ponytail EXEMPT (read-only — no generation posture) binds this node — scouting reads only, writes nothing.
```

## 2 Trailer requirement

Every code-node report ends with exactly one ponytail trailer as
its last non-empty line. The trailer names the binding that held,
the evidence it held on, what was skipped, and the risk the skip
carries. A report whose last non-empty line is not the trailer is
incomplete.

Shape:

```text
Ponytail: <binding> — <one-line evidence>; Skipped: <what was skipped or none>; Risk: <risk or none-known>
```

Rules:

1. `<binding>` repeats the brief binding word for word.
2. `<one-line evidence>` names the concrete proof on one line:
   tests run, gates re-run with exit codes, or the exemption reason.
3. `Skipped:` names what ponytail posture was deliberately not
   applied (a variant step, a test, a validation pass), or `none`.
   `none` is a claim and must be true.
4. `Risk:` names the concrete failure the skip could cause, or
   `none-known` when nothing was skipped. A skip with no named risk
   is an unfinished trailer.
5. A vacuous trailer is a violation. Vacuous means any of: binding
   missing, evidence missing, `Skipped:` missing, `Risk:` missing,
   or a bare placeholder where evidence belongs. A vacuous trailer
   returns the node to its owner for re-dispatch; the leader never
   fills the trailer from memory.

Examples:

```text
Ponytail: FULL — tsc --noEmit exit 0 plus new-branch tests green; Skipped: none; Risk: none-known
```

```text
Ponytail: ponytail-review — 14 findings with file:line plus verdict line; Skipped: load-test pass, no harness on this seat; Risk: perf regression under load stays unverified
```

```text
Ponytail: EXEMPT (read-only — no generation posture) — reads only, wrote nothing; Skipped: none; Risk: none-known
```

## 3 Mechanical non-trivial definition

Non-trivial is mechanical. No judgment call decides it. Count from
`git diff --numstat` against the merge base, then apply the rule.

A change is non-trivial when ANY row below holds:

1. Added plus deleted lines across the diff total 10 or more.
2. Two or more files changed.
3. One or more files added or deleted.
4. Any changed path is a trust boundary: `scripts/`,
   `.opencode/plugin/`, `registry/catalog.json`,
   `.opencode/equip.manifest.json`, `registry/data/`,
   `registry/schema/`, `schemas/`, `manifests/`,
   `registry/policies/`, or any file carrying an install command
   or a permission rule.

Everything else is trivial. Trivial work still carries the brief
line and the trailer; the threshold only decides which checklist
depth applies. A trivial change walks the short path (brief line
plus trailer plus the named gate). A non-trivial change walks the
full path (brief line plus trailer plus the full Verifier or
Reviewer checklist below). The count is quoted in the report; a
threshold claim without the `git diff --numstat` totals is not a
measurement.

## 4 Verifier two-sided substantive checklist

The Verifier checks the code AND the trailer. Both sides must pass.
Side A green with side B vacuous is FAIL. Side B well-formed with
side A failing is FAIL. Each item below names its evidence; a tick
without the evidence is not a pass.

Side A — the code:

1. The named gate battery ran in full and each ledger row carries
   its exit code. Evidence: the ledger with commands and codes.
2. FLOOR holds: risky logic carries tests, trust boundaries carry
   validation and error handling, and no safety was cut for
   brevity. Evidence: the test and validation lines by file:line,
   or the FAIL dossier naming the missing safety.
3. CEILING holds: no gold-plating, no speculative abstraction, no
   framework-for-one-use, no option, config, or wrapper nobody
   asked for. Evidence: the diff walk naming what was refused or
   removed, or the FAIL dossier naming the added shape.
4. Reuse order holds on non-trivial generation: codebase helper,
   then standard library or platform, then installed dependency,
   then one-liner, then minimum code, and deletion preferred over
   addition. Evidence: the chosen source per added block.
5. The census, count, or totals line is quoted verbatim from the
   tool that printed it, never transcribed from an older document.
   Evidence: the quoted totals line beside the exit code.

Side B — the trailer:

1. The report ends with the trailer as its last non-empty line in
   the exact shape of section 2. Evidence: the trailer quoted.
2. The trailer binding repeats the brief `Doctrine:` binding word
   for word. Evidence: both lines quoted side by side.
3. The evidence slot names a check that actually ran with its exit
   code, or the true exemption reason. Evidence: the command plus
   code, or the read-only proof. A check that cannot be evaluated
   is recorded failed, never skipped silently.
4. `Skipped:` and `Risk:` are both present and specific. A skip
   names the concrete step not taken; its risk names the concrete
   failure that step would have caught. Evidence: the two slots
   quoted. A bare placeholder fails this item.
5. Non-trivial measurement is present and mechanical: the
   `git diff --numstat` totals plus which rule row of section 3
   fired. Evidence: the totals quoted.

Verdict rule: every item above passes, or the Verifier returns
FAIL with a dossier per failed item carrying file:line, the
failing output quoted, and the taxonomy bucket.

## 5 Reviewer ponytail-review checklist

The Reviewer binds `ponytail-review`: report-only, changes no code.
It walks KIT LAW first and ponytail leanness second, and every
finding carries a concrete failure case.

1. Read the diff, not a summary of it. Evidence: the commit,
   branch, or pull request identifier reviewed.
2. Walk KIT LAW in full: V2 platform truth, allow-all preserved,
   zero pins in shipped files, no invented identifiers, themes
   authored-from-shape-never-copied. Evidence: each law item named
   pass or fail with file:line on failure.
3. Enforce FLOOR on the change: missing tests for risky logic,
   missing error handling on a failing path, and missing
   validation at a trust boundary each fail high minimum.
   Evidence: the missing safety named per finding.
4. Enforce CEILING on the change: gold-plating, speculative
   abstraction, framework-for-one-use, and unasked options,
   settings, or wrappers each fail. Evidence: the deleted shape
   named per finding.
5. Every finding is one JSON object with exactly `file`, `line`,
   `severity`, `category`, `description`, `suggestion`, and
   `confidence`, ordered by gate-calibrated severity, each with a
   concrete failure case and a verdict line plus Not-checked lines.
   Evidence: the findings as emitted.
6. The report ends with the section 2 trailer in
   `ponytail-review` binding, with `Skipped:` naming the passes not
   covered and `Risk:` naming what each uncovered pass leaves open.
   Evidence: the trailer quoted. A review without Not-checked
   lines and without the trailer is unfinished, not a pass.

## 6 Bindings by node shape

| Node shape | Binding | Trailer evidence slot carries |
|---|---|---|
| Code-writing node | FULL (or LITE / ULTRA when the brief says so) | Tests plus gates with exit codes |
| Diff, branch, or pull request review | ponytail-review | Findings count plus verdict line |
| Repo-wide health view | ponytail-audit | Ranked findings, at most 20 |
| Read-only node that writes nothing | EXEMPT with reason | The read-only proof |

Levels `lite`, `full`, and `ultra` are runtime arguments to core,
never separate compliance entries. Deferred satellites stay out of
this document.

## 7 Violations and routing

1. A brief without the `Doctrine:` line never dispatches. The
   leader returns the brief for correction before any work starts.
2. A report without the trailer, or with a vacuous trailer, is a
   violation. The leader re-dispatches the node; the trailer is
   never reconstructed from memory.
3. A disputed check goes to the Guide with the failing command, its
   output, and the hypothesis. No guard is weakened to make it
   pass.
4. This document is the sole home of the trailer shape and the
   non-trivial rule. Worker prompts carry the uniform one-line
   pointer; they never restate or reword the shapes here.

## Grep anchors

Exact lines for automated checks:

- `FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."`
- `CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."`
- `Doctrine: ponytail FULL binds this node — FLOOR and CEILING from RESEARCH-03.md R0b hold verbatim.`
- `Ponytail: <binding> — <one-line evidence>; Skipped: <what was skipped or none>; Risk: <risk or none-known>`
