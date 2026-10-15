# Wake-Request Channel and Override Logging

Node `p1-wake` (lane VTA-EXPANSION-05 P1, wave 21 of 35). This document
specifies the WAKE-REQUEST channel and OVERRIDE event logging for the P1
flows. It is binding on `p1-aether` and `p1-pulsar` alongside `P1-R0.md`;
no later node overrules anything here without a new research revision.

Enforcement is detective only. Per `P1-R0.md` Verdict 1 (PARKED), no hook
denies admission on the current version, so a malformed WAKE-REQUEST or
OVERRIDE record is reported with named reasons and never silently
accepted. Nothing here grants any hook the power to refuse a brief.

## D5 bright line

> owner overrides direct work but NEVER suppresses gate verdicts.

An owner directive changes what work runs next. It never edits, hides,
or deletes a gate verdict. Every override keeps the original verdict
text on record in the `verdict_preserved` field defined below.

## WAKE-REQUEST channel spec

### Who may wake whom

| Waker | May wake | May not wake |
|---|---|---|
| Owner | Any leader | Execution workers directly with a wake record |
| Any leader (`aether`, `pulsar`, `blazar`) | Any other leader | Execution workers directly with a wake record |
| Execution workers | Nobody; workers do not issue wake records | Any leader |

A wake record routes attention upward or sideways between leaders, or
from the owner to a leader. It never substitutes for a plan, a finding,
or a gate verdict, and it never carries an admission decision.

### Payload shape

Each WAKE-REQUEST record validates against the `wake` definition in
`schemas/capsules/capsule.schema.json`. Required fields, in full:

- `capsule`: constant `"wake"`.
- `capsule_version`: string matching `^1\.` (for example `"1.0.0"`).
- `issued_at`: UTC timestamp matching
  `^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?Z$`.
- `issuer`: non-empty string naming the waker (owner or leader name).
- `channel`: non-empty string naming the wake route (for example
  `"owner-to-aether"` or `"pulsar-to-aether"`).
- `summary`: non-empty string stating in one sentence what needs
  attention and why now.

Optional field:

- `context_ref`: non-empty string pointing at the plan, findings, or
  ledger entry the waker wants the receiver to read.

Example:

```json
{
  "capsule": "wake",
  "capsule_version": "1.0.0",
  "issued_at": "2026-10-15T12:00:00Z",
  "issuer": "pulsar",
  "channel": "pulsar-to-aether",
  "summary": "Survey finished early with one contested claim needing a plan revision.",
  "context_ref": "findings-2026-10-15-01"
}
```

Validate each record before further use:

```text
node scripts/validate-capsule.mjs <wake-record.json>
```

Exit 0 means the record conforms. Exit 1 means it is invalid, with one
named reason per defect on standard error. Exit 2 means the file could
not be read or the invocation was wrong.

### Ack behavior

Every WAKE-REQUEST expects an explicit ack, and the ack is a record,
not a gate:

1. The receiver logs receipt with the wake record's `channel` and
   `issued_at` attached, so a wake without an ack is visible as drift.
2. The receiver either acts (replan, re-survey, escalate) or records a
   refusal capsule citing the `refusal` definition in the same schema
   family; silence is never an ack.
3. An ack never admits a brief and never overrides a verdict. A wake
   that asks for either is answered with the D5 bright line quoted
   above and the original verdict left intact.

## OVERRIDE event logging

An OVERRIDE record is written whenever an owner directive changes the
course of work after a gate verdict exists. The directive is honored
for directing work; the verdict stays on record beside it.

### Fields

Each OVERRIDE record validates against the `override` definition in
`schemas/capsules/capsule.schema.json`. Required fields, in full:

- `capsule`: constant `"override"`.
- `capsule_version`: string matching `^1\.` (for example `"1.0.0"`).
- `issued_at`: UTC timestamp matching
  `^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?Z$`.
- `issuer`: non-empty string naming who logged the override.
- `owner_directive`: non-empty string quoting or faithfully
  paraphrasing the owner order that redirects the work.
- `verdict_ref`: non-empty string identifying the gate verdict that
  stands (for example a verdict line or gate name).
- `verdict_preserved`: non-empty string carrying the original verdict
  text verbatim, so the record proves the verdict was kept.

Optional field:

- `rationale`: non-empty string stating why the owner redirected the
  work despite the standing verdict.

Example:

```json
{
  "capsule": "override",
  "capsule_version": "1.0.0",
  "issued_at": "2026-10-15T12:30:00Z",
  "issuer": "aether",
  "owner_directive": "Ship the narrow fix now; revisit the wider refactor next wave.",
  "verdict_ref": "P1-R0 Verdict 1 (PARKED)",
  "verdict_preserved": "A hook cannot intercept-and-deny a brief on the current version.",
  "rationale": "Owner accepted the residual risk for one wave to unblock the release."
}
```

Validate each record before further use:

```text
node scripts/validate-capsule.mjs <override-record.json>
```

The same exit contract applies: 0 for conforming, 1 with named reasons
for invalid, 2 for unreadable input.

### The never-suppress rule

1. `verdict_preserved` carries the original verdict text unchanged.
   Paraphrase it nowhere; quote it.
2. `verdict_ref` must resolve to a real verdict or gate outcome. A
   reference that points at nothing is itself a defect and is reported
   as one.
3. No override record deletes, amends, or supersedes the verdict it
   cites. A later verdict can only come from its own gate rerun, logged
   as its own record.

## Capsule validator paths cited

- Schema family (single source of truth):
  `schemas/capsules/capsule.schema.json` (`defs.wake`, `defs.override`).
- Validator: `node scripts/validate-capsule.mjs <capsule.json>`.
- Self-test: `node scripts/validate-capsule.mjs --self-test`.
- Binding research surface: `P1-R0.md` (Verdicts 1-3).

## Failure modes

- A wake record naming an execution worker as issuer is invalid by
  policy; log it as drift and answer with a refusal capsule.
- A wake record missing any required field fails validation (exit 1);
  report the named reasons and never act on the unvalidated content.
- An override record with an empty or missing `verdict_preserved`
  field fails validation (exit 1); the bright line is not satisfied by
  a reference alone.
- An override that claims to clear or replace a verdict is refused:
  quote the D5 bright line, keep the verdict, log the refusal.
