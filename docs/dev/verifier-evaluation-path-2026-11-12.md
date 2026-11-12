# 11 — Verifier evaluation path (2026-11-12)

`scripts/verify-minimums.mjs` is the read-only receipt verifier for the
per-task minimums (W-25, decision D65; law D48/D63). This note records the
documented evaluation path for it: how a real task trace is produced, how the
verifier is invoked against it, and how the verifier is exercised by the
canonical battery without a real trace.

## The honest current state

No real dispatch-log trace exists in this repository today.
`.opencode/dispatch-log/` is deliberately not committed — the ledger directory
does not exist in a fresh clone (D63/D65). The evaluation-path wiring therefore
lands in two halves:

1. **Documented invocation** — this file. A real invocation is
   `node scripts/verify-minimums.mjs --task <real-task-id>`, run against a
   trace that exists because an actually-executed task produced it.
2. **Battery fixture** — `node scripts/run-battery.mjs` section (c) runs the
   verifier against a self-removing fixture trace it writes for the duration
   of the run (see the battery header comment and `scripts/run-battery.mjs`
   `checkVerifyMinimums`). The fixture proves the script's accept path is
   wired into CI; it is never committed, and `.opencode/dispatch-log/` is
   absent after the battery exits.

The real-task proof — one trace from an actually-executed task, named by the
run that executed it — is deliberately not fabricated here. It belongs to the
coordinator's endgame for this lane, not to this document and not to the
battery.

## Invocation, once a real trace exists

A trace is one JSONL file per task at `.opencode/dispatch-log/<task-id>.jsonl`,
written by `scripts/dispatch-log.mjs append`. Once a real task has appended at
least one `verifier-confirmed` event per required token, run:

```console
node scripts/verify-minimums.mjs --task <real-task-id>
```

The output names the rank, the verifier-confirmed skill and MCP counts against
the D48 bright-line minimums for that rank (Zenith ≥15/≥5, Syzygy ≥10/≥4,
Asterism ≥5/≥2), the source breakdown, and the event count, then prints
`APPROVED` or `REJECTED` with the shortfall named. Exit status: `0` APPROVED,
`1` REJECTED (missing trace, ambiguous rank, minimum shortfall, malformed
line), `2` usage error. Only `source: "verifier-confirmed"` tokens count;
`brief-named` and `receipt-claimed` tokens are claims, never use (D63).

This invocation was executed against a nonexistent task while writing this
note, to record the missing-trace path verbatim (2026-11-12):

```console
$ node scripts/verify-minimums.mjs --task verifier-evaluation-path-probe-2026-11-12
task_id:      verifier-evaluation-path-probe-2026-11-12
rank:         MISSING (no trace at .opencode/dispatch-log/verifier-evaluation-path-probe-2026-11-12.jsonl)
skills:       MISSING
mcps:         MISSING
REJECTED — missing: rank, skills, mcps (no trace at .opencode/dispatch-log/verifier-evaluation-path-probe-2026-11-12.jsonl)
exit 1
```

## The battery fixture, and why it is not a real trace

`node scripts/run-battery.mjs` cannot pass `--task` to the verifier wholesale:
the script exits `2` without one, which the battery counts as a FAIL. The
battery therefore writes `.opencode/dispatch-log/finalfix-fixture-2026-11-12.jsonl`
for the duration of the run — rank `asterism`, 5 verifier-confirmed skills
(`ponytail`, `tdd-workflow`, `verification-loop`, `vs-asterism-muster`,
`documentation-as-tests`), 2 verifier-confirmed MCPs (`memory`, `deepwiki`),
a current RFC3339 timestamp — runs
`node scripts/verify-minimums.mjs --task finalfix-fixture-2026-11-12`,
asserts exit `0`, then deletes the fixture and the scratch
`.opencode/dispatch-log/` directory it created. The fixture exercises the
accept path only. It is a self-test of the verifier's wiring, not evidence
that any real task met its minimums, and it is never committed.

## Producing a real trace (for the endgame)

Append events as the task's work is actually verified — never before:

```console
node scripts/dispatch-log.mjs append --task <real-task-id> --agent <agent-id> --rank <zenith|syzygy|asterism> --skill <skill-id> --source verifier-confirmed
node scripts/dispatch-log.mjs receipt --task <real-task-id>
node scripts/verify-minimums.mjs --task <real-task-id>
```

`--source verifier-confirmed` is set only after the verifier seat has checked
the claim against a landed artifact. Claims recorded with `brief-named` or
`receipt-claimed` remain claims; the verifier counts none of them toward a
minimum. The trace, once produced, is local to the clone that produced it
(`.opencode/dispatch-log/` is not committed), and the verifier prints its
verdict from exactly that file.

## Real-task verification (2026-11-12, FINAL FIX endgame)

A real task trace now exists in the tree: `.opencode/dispatch-log/finalfix-ws6-installs-2026-11-12.jsonl`
(the WS6 network-install lane — a real dispatch of `vantrilex-implementer`, verified
by the coordinating leader: folders landed, `skills-lock.json` delta landed, gates
re-run by the coordinator on the landed bytes).

Verifier-confirmed (marked by the coordinating leader after reading the lane report
and re-verifying artifacts): `vs-asterism-muster`, `ponytail`, `verification-loop`,
`documentation-as-tests`. MCPs used by the lane: none (network installs; no MCP
calls). Command and verbatim output:

```console
node scripts/verify-minimums.mjs --task finalfix-ws6-installs-2026-11-12
task_id:      finalfix-ws6-installs-2026-11-12
rank:         asterism
skills:       4 verifier-confirmed (min 5, D48)
mcps:         0 verifier-confirmed (min 2, D48)
sources:      brief-named=0, receipt-claimed=0, verifier-confirmed=4
event_count:  4
REJECTED — shortfall: skills 4/5 verifier-confirmed (deficit 1); mcps 0/2 verifier-confirmed (deficit 2)
```

Exit code: **1**. The minimum is NOT declared met by any self-report; this is the
first time the (c) checker examined a real task, and the verdict is REJECTED with
named deficits. No token was invented, upgraded, or back-filled to reach APPROVED.
The `.opencode/dispatch-log/` directory is no longer empty for a real task.
