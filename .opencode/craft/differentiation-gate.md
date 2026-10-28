# Differentiation Gate

Owner correction: differentiation is an acceptance gate. A definition
matching another except its name is rejected, because copied definitions
inflate the catalog with zero value.

## Gate procedure

Compare every candidate craft book against every other craft book
pairwise, section by section: identity and non-duties, instruction
pack, equipment policy, context contract, verification commitments,
failure contract. A pair matching on all six sections except the leader
name fails the gate.

## Verdicts

One line per pair is written to .opencode/craft/rejection-log.md with
the pair, the matching position if any, and the verdict. A rejection
names the matching position exactly so the next draft can differ there.
A gate run with zero rejections still writes its run header, because an
unlogged gate proves nothing.

## Scope

The gate binds the three craft books `vs-bl-build-craft`,
`vs-at-plan-craft`, and `vs-pu-probe-craft`, and every future craft book
admitted under `vs-book-doctrine`.
