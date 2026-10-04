# Kit Evolution Log

Project:
Log owner:
Opened:

## How to read this log

Entries are appended and never rewritten. Each entry is exactly one of four kinds: **Added**,
**Changed**, **Retired**, or **Rule**. Every entry names the problem it solves, the alternatives
that lost and why, the evidence behind the decision, and the condition that would reopen it.

An entry written after the fact carries `Recorded from history:` and names the evidence available.
A contemporaneous reason that has been reconstructed is a guess wearing a decision's authority, and
the marker is what keeps a reader from trusting it too far.

## Index

| Component | Kind | Date | Owner |
| --- | --- | --- | --- |
| | | | |

## Entries

Append newest last. A change to an existing entry is a new entry that cites the one it supersedes.

```
Kind:            Added | Changed | Retired | Rule
Date:            <date the decision was made>
Component:       <registry id>
Recorded from history: <yes or no — if yes, what evidence was available>
Decided by:      <person or session>

Problem
  <the failure, gap, or conflict this removes, stated so it survives lost context>

Change
  <what the component does now that it did not before, and its path>

Alternatives rejected
  - <option> — <the specific property that made it worse>

Evidence
  <command run, result observed, or measurement that justified this>

Reopen condition
  <what would prove this decision wrong, and who would notice first>

Supersedes:       <entry date and component, or none>
```

## Worked entry

```
Kind:            Changed
Date:            2026-02-11
Component:       preflight-system-doctor
Recorded from history: no
Decided by:      registry maintenance session

Problem
  The doctor reported registry problems without naming the verifier that proves them, so two
  people ran two different commands and disagreed about whether the kit was clean.

Change
  The doctor now names, for each finding, the exact script that proves it and the exit code
  that means clean.

Alternatives rejected
  - Leaving the doctor free-text — it was shorter to write and left the reader to guess which
    check was meant, which was the original defect.

Evidence
  Two clean-kit runs and one deliberately broken sidecar, each producing a finding that named
  its verifier and the expected exit code.

Reopen condition
  A finding reappears that names a condition without naming its proving command.

Supersedes:       none
```

## Reconciliation

Before declaring this log current: every entry has a kind, a date, a component id, and a reopen
condition; every `Supersedes` value points at an entry that exists; the index agrees with the
entries below it. An entry missing any of those is not an entry yet, and a log whose index
disagrees with its body cannot be trusted as history.
