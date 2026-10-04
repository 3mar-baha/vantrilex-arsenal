---
name: documentation-as-tests
description: Use when a documented command, snippet, path, or configuration key is about to be relied on, so the example is extracted and executed instead of trusted in prose.
---

# Documentation As Tests

## Purpose

Make the documentation executable, so an example that stops working breaks a check instead of
misleading a reader three months later. The owner idea (التوثيق كاختبارات) is that prose
examples
are claims, and a claim that is never executed is an unverified claim with a very long half-life.

Interpretation, stated plainly: documentation does not rot because the writing degrades, it rots
because the code moves and the prose does not. The cure is not better proofreading, it is a check
that runs the commands and examples in the docs and fails when they stop working. Extracting the
examples and executing them is the whole mechanism.

## When to Use

- A document contains commands, code blocks, file paths, or configuration keys a reader will run.
- A reader has reported that a documented step no longer works.
- A public interface ships with a usage example in its documentation.
- A setup or migration guide is written and will be followed by someone who has no memory of the
  project.
- A document has been edited and the edit touched anything executable.

## Do NOT use

- Prose with no executable claim: rationale, history, an architectural explanation. There is
  nothing to run.
- As a substitute for unit or integration tests of the code itself. Documentation examples are
  coarse and shallow; they check the seams a reader touches, not the internals.
- To prove a command is safe, fast, or reversible. Executing a documented command proves it runs.
- On examples whose side effects are destructive in the real environment. Run those against a
  scratch copy, and say in the document that this is what the check does.
- Before the thing being documented exists. Documenting intent produces tests for a fiction.

## Inputs

- The document under test, at a specific path, and the repository path it lives in.
- The fenced code blocks and inline command lines it contains, and which are meant to be executed.
- The environment the examples assume: runtime, working directory, installed dependencies, and any
  required fixtures.
- The check runner that owns the extraction, and the command that runs it.

### What counts as an executable example

A block is executable when a reader is expected to run it verbatim and something observable
happens. Mark the rest explicitly rather than leaving the reader to guess: a language tag such as
`text` or `console` marks a block as illustrative, and an unmarked block is treated as executable.
An unmarked block that cannot run is the defect this skill finds first.

## Procedure

1. **Inventory the claims.** List every fenced block and inline command in the document. Give each
   a verdict: executable or illustrative. Any unmarked block that is not executable is itself a
   finding.
2. **Extract** each executable example into a runnable script or file under the check's directory,
   preserving the example exactly as written. An extraction that silently repairs an example has
   destroyed the test; if the example is wrong, the check must fail.
3. **Resolve the environment.** Declare what the examples assume: runtime, working directory,
   dependencies, fixtures. Anything assumed and not declared is a portability defect in the
   document, and the extraction fails on it.
4. **Run each example in isolation,** against a scratch or temporary location, never against the
   live tree. Capture exit status and output.
5. **Assert the observable.** Not merely exit status: the state the example claims to produce must
   be present after the run. An example that runs and does nothing has stopped documenting
   anything.
6. **Wire it into the existing check runner** so the examples fail the same gate as the tests, on
   every change that touches the document or the code it exercises.
7. **Make it fail on demand.** Break one documented step on purpose and confirm the check goes red
   and names the document, the line, and the command. A documentation check that has never been
   seen red is unproven.
8. **Repair the document, not the extraction,** when a check fails. Fixing the extracted script
   while leaving the prose broken restores the exact rot the skill exists to prevent.
9. **Keep the extraction mechanical.** One example in the prose, one case in the check. Hand-editing
   the extraction into something the prose no longer says is how the two drift apart again.

## Outputs

- An inventory of every executable claim in the document, marked executable or illustrative.
- One extracted, runnable case per executable example, living with the check runner.
- A portability statement: runtime, working directory, dependencies, fixtures the examples assume.
- An assertion per example covering the observable the example claims to produce.
- The red-proof: a deliberately broken documented step, and the check output that caught it.

## Failure Modes

- **The extraction is repaired, the prose is not.** This is the defining failure. The next edit to
  the prose is unchecked again, and the check now certifies something the reader never sees.
- **Exit status only.** A command that runs and quietly changes nothing passes the check and has
  stopped documenting behaviour. Assert the observable.
- **Illustrative blocks executed.** Unmarked prose fragments run as commands and fail for reasons
  that have nothing to do with rot. Mark them.
- **The check is not wired in.** An unwired extraction is a script nobody runs, which is the same
  as no documentation test at all.
- **Destructive examples run live.** Run them against a scratch copy. State that in the document,
  or the check itself becomes the thing that breaks.
- **Coverage claimed from volume.** Four hundred blocks with four hundred exit-status assertions is
  not more coverage than four blocks with observable assertions.
