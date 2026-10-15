# Harness Matrix

OpenCode V2 is the one supported harness — active and verified today. Every
other harness is FUTURE: named so a dispatcher stops guessing, with no adapter
built, no adapter promised, and no install path documented for any of them.

## Status

| Harness | Status | What that means |
|---|---|---|
| OpenCode V2 | SUPPORTED (active, verified) | The plugin under `.opencode/plugin/`, the four top-level skills, the operator commands, and the `opencode` install profile in `manifests/install-profiles.json` all target this harness and nothing else |
| Claude Code | FUTURE | No adapter, no skill transplant, no hook mapping |
| Codex | FUTURE | No adapter, no skill transplant, no hook mapping |
| Cursor | FUTURE | No adapter, no skill transplant, no hook mapping |
| Windsurf | FUTURE | No adapter, no skill transplant, no hook mapping |
| Aider | FUTURE | No adapter, no skill transplant, no hook mapping |
| Any other harness | FUTURE | No adapter; a new row here plus a dispatched concern before a single file lands |

SUPPORTED means the six gates in [08-VERIFICATION.md](08-VERIFICATION.md)
prove the surface on that harness today; OpenCode V2 is the only harness with
a passing gate set, so it is the only one this kit is active and verified on.
FUTURE means no gate covers it, so any claim that the kit works there is
unverified by definition.

## Why OpenCode V2 only

The shipped surface is OpenCode-native: `task-dispatcher` binds the V2
`setup()` `prompt` hook, the remaining six callbacks stay on the inert V1
surface deliberately (see [16-TASK-DISPATCH.md](16-TASK-DISPATCH.md) and
[17-V2-HOOK-GAP.md](17-V2-HOOK-GAP.md)), and Vanguard equips `.opencode/`
onto the target project. Porting any of that to a second runtime is its own
concern with its own verification, not a paragraph in this file.

## What promotes a harness

A harness moves from FUTURE to SUPPORTED only when all three land together:
a dispatched adapter concern, a verifier that proves the adapter loads on
that harness, and a row update here in the same change. A row edited without
the other two is a claim without evidence and fails the honesty rule. No row
in this table carries a `model:` pin or a paid model id: the kit names no
model, and a harness status never implies one.

## Provenance

The profile-based install shape (`minimal` through `full`) and the
one-matrix support-status presentation follow the pattern proven real in
`affaan-m/ECC` at release `2.2.3` (MIT), confirmed live at dispatch time.
No ECC code, text, or adapter is borrowed here; only the shape of naming
profiles and stating harness status plainly.
