---
name: vantrilex-atomic-switch
description: Use when the operator installs per-agent themes, so the atomic switch commands resolve to a real theme file.
---

# Atomic Switch Install

## Purpose

Install per-agent theme JSON files from `registry/themes/` into the runtime themes directory with plain file copies, so every atomic switch command resolves to a real file.

Resolution detects the target directory at runtime in this order: the `XDG_CONFIG_HOME` themes path, then the home-config themes path, then the Windows roaming-config themes path. Each install is one plain `cp` of `registry/themes/<themeId>.json` to `<dir>/<themeId>.json` with no shell operators. When the source file or the target directory is unreachable, the run degrades to a stated SKIPPED row with its reason, never a silent pass.

Dual guardrail, mandatory and verbatim. Downstream specs, kit entries, and tests copy both quoted lines verbatim and never paraphrase them. FLOOR stops reckless laziness. CEILING stops astronaut seniority.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## When to Use

- The operator installs one per-agent theme after a registry edit: load this skill and copy that theme file.
- A switch command reports an unresolvable theme file: load this skill and repair the missing copy.
- A fresh machine needs the full per-agent set: load this skill and install every listed theme file in turn.
- The source file or the target directory is unreachable: record SKIPPED with the stated reason and stop.

## Do NOT use

- For non-theme installs; other kinds carry their own install shape and their own skill.
- As a rewrite pass over shipped theme JSON; this skill copies files and changes no bytes.
- Invented destination paths; only the three runtime-resolved directories count, in the stated order.
- Lock, catalog, schema, or generator edits; registration belongs to the wave-5 register node, never to an install run.
- Paraphrased guardrails; only the verbatim FLOOR and CEILING lines satisfy the wiring.

## Inputs

- The requested theme id, exactly matching a row in `registry/themes/vantrilex-atomic-switch.json`.
- The registry row for that id: accent hex, category, and theme file path.
- The runtime-resolved target directory from the XDG, home-config, or Windows roaming-config probe.
- The reachability state of the source file and the target directory before any copy runs.

## Procedure

1. **Match the row.** Look up the requested theme id in `registry/themes/vantrilex-atomic-switch.json` and quote its theme file path. A name with no row stops here as SKIPPED with the missing row named.
2. **Resolve the target.** Probe the `XDG_CONFIG_HOME` themes path first, then the home-config themes path, then the Windows roaming-config themes path, and record which probe succeeded. A run with no writable directory stops here as SKIPPED with the failed probes named.
3. **Copy plainly.** Run one plain `cp registry/themes/<themeId>.json <dir>/<themeId>.json` per theme file, with no chained operators and no substituted strings. A failed copy stops the run with the failing command quoted.
4. **Enforce FLOOR first.** Demand validation at the trust boundary: the copied file parses as JSON and carries its base plus hue palette. An unreadable copy fails the run and the missing check is named.
5. **Enforce CEILING second.** Refuse added shape: no extra flags, no wrapper scripts, and no option nobody asked for. Added shape without a caller fails the run.
6. **Report honestly.** Emit the installed table plus every SKIPPED row with its stated reason.

## Outputs

- The resolved target directory with the probe that selected it.
- The installed table: theme id, source path, destination path, and parse result per file.
- Every SKIPPED row with its stated reason: missing registry row, unreachable source, or no writable directory.
- The dual-guardrail verdict: FLOOR pass or fail with the missing safety named, CEILING pass or fail with the removed shape named.

## Failure Modes

- **Invented command.** A guessed destination or a chained shell string that no registry row states; quote the row and rerun.
- **Rewritten bytes.** A copied file whose content differs from the registry source; copy again and compare before reporting.
- **Silent skip.** A SKIPPED row with no stated reason; a check that cannot run is a failed check until its reason is written.
- **Paraphrased guardrails.** Reworded FLOOR or CEILING text that no grep test can confirm; only the verbatim lines count.
- **Registration drift.** Lock or catalog edits made from an install run; registration belongs to the wave-5 register node alone.
- **Bulk install blur.** A full-set run that reports one line for many files; report one row per file instead.
