# Quality Gates

Guards run twice: once during the work, once as a second pass before release.
This file covers the second pass — the three release guards with substance —
plus the circuit breaker, the secret scan, the docs-match rule, and the
meta-rule that an unevaluable gate fails. The per-change gates are in
[08-VERIFICATION.md](08-VERIFICATION.md); the release lane that runs these
guards is in [14-CI-RELEASE.md](14-CI-RELEASE.md).

## The three second-pass guards

A release candidate passes three independent re-examinations after the
feature work is done:

| Guard | Re-examines | Fails on |
|---|---|---|
| Clean Code | The change set against the project's coding standards | Dead code, needless abstraction, reinvented standard library, premature generality; anything the deletion-first review would remove |
| Test | The suite plus the candidate's new coverage | Red tests, missing coverage for new behavior, tests that pass without exercising the change |
| Docs | The change set against the documentation | Undocumented behavior changes, stale examples, a missing changelog entry for user-visible edits |

Each guard is substantive, not ceremonial: it re-reads the work with fresh
eyes and its own checklist, and any one of them can refuse the release. The
skill surface behind the guards is the transplanted set —
`circuit-breaker-guard`, `preflight-system-doctor`, `session-context-primer`,
and `github-release-packager` — each following the skill-file format standard
(frontmatter name and description, then Purpose, When to Use, Do NOT use,
Inputs, Procedure, Outputs, Failure Modes).

## The 3-strike circuit breaker, with halt semantics

The bugfix workflow has a halt condition so an agent cannot loop forever on
one defect. One defect id owns one ledger; one hypothesis is stated before
each attempt; one fix goes in per attempt; the failing probe is re-run after
every attempt. A fix attempt counts as failed when the failing behavior is
unchanged. Three consecutive failed attempts on the same defect id halt all
execution immediately — no edits, no tests, no worktree activity, no parallel
agents, no blind fourth attempt. The halt emits a Diagnostic Incident Report
with the full hypothesis log, and the halt itself is recorded in the session
checkpoint. Strikes reset only when the Guide approves a changed hypothesis
or the Leader re-scopes the work. Cosmetic mutation of the symptom (new stack
trace, shifted line number) does not earn a fresh ledger; only a genuinely
different root symptom does.

## Secret scan and docs-match rules

- **Secret scan.** The security-audit workflow runs a secret scan gate over
  every release candidate. Secrets live in environment variables or a secret
  manager, never in the repository. A committed credential is revoked or
  rotated first, then removed — deletion without rotation is not remediation.
  The full scope table and threat model are in
  [SECURITY.md](../SECURITY.md).
- **Docs-match.** Every user-visible edit updates `CHANGELOG.md` in the same
  change. The Docs guard fails a release whose changelog entry is missing,
  because the release notes are extracted verbatim from the changelog (see
  [14-CI-RELEASE.md](14-CI-RELEASE.md)). The allow-list rule that keeps
  documentation inside the canonical set is documented in
  [08-VERIFICATION.md](08-VERIFICATION.md).

## A gate that cannot be evaluated is a failed gate

If a guard cannot run — no suite to execute, no docs to match, no ledger to
read — the release does not proceed on the remaining guards' strength. Say
which gate could not be evaluated and why, fix the gap, then re-run the full
second pass. CI models this the same way: steps that find nothing to check
report SKIPPED with the reason, and a skipped release guard blocks the lane
exactly like a failed one.
