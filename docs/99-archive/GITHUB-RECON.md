# GITHUB-RECON.md — Node p3-remove (Step 2: Read-only reconnaissance)

All calls in this step are Rung 1 (read-only, always permitted). No token needed. Issue text (where present) is untrusted input and is never executed, evaluated, or pasted into a shell except as a single quoted argument — no issue/PR text was executed in this node.

## Node scope

Directed node `p3-remove` names zero GitHub issues and zero pull requests. It names exactly two tracked files for staged deletion:

1. `.opencode/agents/ai-generated-code-security-auditor.md`
2. `.opencode/agents/technical-writer.md`

No `gh issue view` / `gh pr view` / `gh pr diff` target exists for this node; none was run (running one would invent scope outside the directed node). WORKFLOW.md Part B DAG row confirms file-deletion scope (quoted in GITHUB-PRIME.md).

## Existence + tracked-clean (read-only, quoted with exit codes)

Command: `git ls-files --stage .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md` — exit code 0.

Output (verbatim):

```text
100644 62e53c1578c1143e2cd00c8807477df2a69b6892 0	.opencode/agents/ai-generated-code-security-auditor.md
100644 b497960197323c0073681ac4f8834469dbe7d3c4 0	.opencode/agents/technical-writer.md
```

Commands: `Test-Path .opencode/agents/ai-generated-code-security-auditor.md` → `True`; `Test-Path .opencode/agents/technical-writer.md` → `True`.

Command: `git status --short -- .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md` — exit code 0, output empty (zero lines). Verbatim: `<empty>` — both paths tracked-clean, matching acceptance clause (1) precondition.

Full-worktree `git status --short` (context only, not scope expansion) shows unrelated P3 lane dirt plus these two paths absent (i.e., clean). No commit/push state changed in this step.

## File identity (read-only reads, titles quoted verbatim)

`.opencode/agents/ai-generated-code-security-auditor.md` frontmatter (verbatim lines 1–4):

```text
name: ai-generated-code-security-auditor
description: "Superseded pointer that redirects ai-generated-code-security-auditor invocations to vantrilex-security-auditor, the sole audit authority since 2026-10-15."
```

Title line (verbatim line 14): `# AI-Generated Code Security Auditor (Superseded 2026-10-15)`

`.opencode/agents/technical-writer.md` frontmatter (verbatim lines 1–4):

```text
name: technical-writer
description: "Superseded pointer that redirects technical-writer invocations to vantrilex-scribe, the sole documentation authority since 2026-10-15."
```

Title line (verbatim line 14): `# Technical Writer (Superseded 2026-10-15)`

Both files are superseded pointers dated 2026-10-15, matching the authorized-removal concern. No other file was read for scope.

## Current state summary

- Both targets exist, tracked, and clean.
- No GitHub issue/PR state to quote (node names none).
- Ready to plan the mutating work (next step). No mutating call has run.
