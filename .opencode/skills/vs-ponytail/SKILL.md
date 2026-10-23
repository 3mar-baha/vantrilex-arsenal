---
name: vs-ponytail
description: Use when a code-executing agent starts a coding task, gates a diff, or surveys repo health, so the ponytail trio routes each job to its variant with the dual guardrail verdict attached.
---

# Vs Ponytail

## Purpose

Polished single-cycle bundle for backlog item `ponytail` (eval record `P1-EVAL-INSTALLED.jsonl` line 11, overall verdict `non-green`). It closes the recorded gaps — D2 no executable pin, D3 no worked example, D7 misrouting description — and makes the D6 live evidence self-sufficient inside the file by embedding the fetched reference table with hashes, bytes, and verbatim quotes.

Single-home pointers (repair1 precedent: markers become pointers, never duplicates):

- Upstream prose lives upstream. The three bodies are adopted, never restated here; see the pinned raw URLs in Procedure step 2.
- Guardrail wiring lives in `.opencode/skills/ponytail/GUARDRAILS.md`; see that file. The FLOOR and CEILING lines below are the verbatim grep anchors that wiring mandates (GUARDRAILS.md lines 41-42), not a second home.
- The eval record lives in `P1-EVAL-INSTALLED.jsonl`; cited by line, never copied in full.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## When to Use

- A code-executing agent starts a coding task (write, fix, refactor, dependency choice): load core (`ponytail`), default level `full`.
- A diff, branch, or pull request is ready for a gate verdict: load review (`ponytail-review`), report-only.
- A repo-wide health view is needed: load audit (`ponytail-audit`), map-first, at most 20 ranked findings.
- A level choice is needed: pass `lite`, `full` (default), or `ultra` as a runtime argument to core, never as separate entries.
- Safety or leanness is in doubt: enforce FLOOR as the build breaker and CEILING as the leanness breaker through `.opencode/skills/ponytail/GUARDRAILS.md`.

### Should-fire probes

| Probe | Expected route |
|---|---|
| `start this coding task lean` | core, level `full`, dual guardrail on |
| `gate this branch before merge` | review, report-only, Must/Should/Nice findings |
| `survey repo health this quarter` | audit, map-first, at most 20 findings |

## Do NOT use

- For non-coding requests: `summarize this meeting` stays silent, and no variant loads.
- Core for a gating job: `gate this diff` must route review, never core. The v0 description (`any coding task`) misfired exactly here (eval record line 11, false_friends probe); the narrowed frontmatter description above is the fix.
- Review or audit to write code, or core to certify its own output: generation and gating stay in separate invocations.
- The deferred satellites `ponytail-debt`, `ponytail-gain`, or `ponytail-help` through this bundle; they stay out of the minimum set.
- Forked or rewritten upstream body text: adopt the pinned pointer and verify the hash instead.
- Paraphrased guardrails: only the verbatim FLOOR and CEILING lines satisfy the wiring.
- The `.openclaw/skills/...` alias as the pin: note it as an alias, pin the canonical `skills/...` path, verify the hash.

### Near-miss negatives

| Near-miss | Why it stays silent or routes elsewhere |
|---|---|
| `gate this diff` with core loaded | Misroute: a generation posture cannot certify; route review (recorded misfire, fixed by the narrowed description) |
| `summarize this meeting` | Non-coding request: no variant loads |
| `install ponytail on a new machine` | Provisioning job: needs the installer path, not an execution posture |
| `explain what ponytail is` | Reading-about job: quote the pinned pointer, do not load the posture |

### Description-improver note

The v0 description `Use when a code-executing agent starts any coding task, so generation stays lean under the mandatory floor and ceiling guardrails.` fired core on the near-miss `gate this diff`, which needs review (eval record line 11, false_friends outcome `MISFIRE`). The v1 description names the trio routing — `starts a coding task, gates a diff, or surveys repo health` — and re-runs the three should-fire probes plus the four near-misses above with the outcomes stated. The description line responsible is the frontmatter `description`, quoted verbatim in the file head.

## Inputs

- The coding task or the artefact under gate: task text, diff, branch, or pull request reference.
- The selected variant: core, review, or audit, plus the core level (`lite`, `full`, or `ultra`) when core applies.
- The pinned upstream pointer and its verified content hash: the canonical `skills/...` raw URL from the pin table plus the `SHA256=` value the verify command must print.
- The verbatim FLOOR and CEILING lines from Purpose, enforced through `.opencode/skills/ponytail/GUARDRAILS.md`.
- The verification currently passing, so the gate knows what has already been ruled out.

## Procedure

1. **Select the variant.** Coding task means core; single change means review; whole repo means audit. Record the choice and the core level when core applies. A gating prompt never loads core.
2. **Load the pinned upstream text.** Fetch the canonical raw URL for the selected variant and verify the content hash before use with the exact command below. Precondition: egress to `raw.githubusercontent.com`. Expected result: `STATUS=200` and the printed `SHA256=` equals the pinned value in the table. On any mismatch, or when the fetch cannot run, stop: mark the pin `unverified` with the URL and the output beside it, and escalate with the tool, the command, and its output. Read the connected code, not only the diff, when review or audit runs.

Pin table (fetched live 2026-10-17, every row `STATUS=200`):

| Variant | Canonical raw URL | Bytes | SHA256 |
|---|---|---|---|
| core | `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail/SKILL.md` | 3496 | `9badd22a32e19cb884e46dfa8d3aae82bb81dfa5484105b8b4f0262df823a509` |
| review | `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-review/SKILL.md` | 5143 | `33fe4ebe22a460924e5d4a261e223df22e409cc94ab76182bee9fb91a3ef022e` |
| audit | `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-audit/SKILL.md` | 5417 | `2b3223a02c386d1263e1b08343cb8eb3a53e444cdafb1d79e26c8ec2a8fcad28` |
| license | `https://raw.githubusercontent.com/dietrichgebert/ponytail/main/LICENSE` | 1071 | `fb1bc6909ac3ef82d5c22106e32ef682b0cff66788fa915fb9b53b15c9d2f3ab` |

Exact verify command (replace `<URL>` with the row URL):

```text
node -e "const u='<URL>';fetch(u).then(async r=>{const b=Buffer.from(await r.arrayBuffer());const h=require('node:crypto').createHash('sha256').update(b).digest('hex');console.log('STATUS='+r.status+' BYTES='+b.length+' SHA256='+h);});"
```

Observed live quotes (byte-verified against the hashes above):

- Core frontmatter carries `license: MIT` and the body opens `You are a lazy senior developer. The best code is the code never written.`
- Core Never-cut keeps `validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs, anything the user asked for.`
- Core shortcut convention is written `shortcut: <the limit>, <when to upgrade>`.
- Review closes `Lists findings, changes no code.`
- Audit closes `One-shot report, changes no code.`
- License head reads `MIT License`, then `Copyright (c) 2026 DietrichGebert`.

3. **Enforce FLOOR first.** Demand tests for risky logic, error handling that prevents data loss, and validation at trust boundaries. Missing safety fails the guard; brevity never excuses a skip.
4. **Enforce CEILING second.** Refuse gold-plating, speculative abstraction, framework-for-one-use, and any option, setting, or wrapper nobody asked for. Added shape without a second caller fails the guard.
5. **Apply the variant contract.** Core emits the smallest complete change with reuse order codebase helper, then standard library or platform, then installed dependency, then one-liner, then minimum code, and deletion beats addition. Review orders correct, safe, holds under load, tested, fast, lean, and emits numbered Must fix, Should fix, and Nice to have findings with What, Problem, Fix, and If-we-skip-it plus Verdict, Lean, and Not-checked lines. Audit maps first, traces main flows end to end, and ranks at most 20 findings with Lean savings stated as lines plus dependencies.
6. **Keep the report-only boundary.** Review and audit change no code and change nothing; findings carry a concrete failure case each, and a finding without a case is returned.
7. **Record attribution.** Every output names `dietrichgebert/ponytail`, the used variant and level, the pinned URL and hash result, and the MIT notice.

### Worked example

Task: `Extract the loop in scripts/verify-skills.mjs into a helper, no behavior change.`

Good result (core, level `full`): the helper plus unchanged call sites; battery re-run from the repo root, `node scripts/verify-skills.mjs`, prints `VERDICT: PASS`; verdict lines read `FLOOR: pass — risky loop logic re-covered by the battery re-run exit 0.` and `CEILING: pass — helper only, no new option, config, or wrapper.`; attribution names `dietrichgebert/ponytail`, core/full, the pinned core URL, the `SHA256=` match, and the MIT notice.

Weak result, and where it goes wrong: the same helper plus a speculative `--json` flag nobody asked for fails CEILING, and the removed shape is the `--json` flag. Skipping the battery re-run to save time fails FLOOR, and the missing safety is the re-run exit 0. A good application carries both verdict lines; mimicry carries neither.

## Outputs

- The selected variant and level plus the verified pinned pointer.
- For core: the smallest complete change following the reuse order and the Never-cut list.
- For review: a report-only gate verdict with numbered Must fix, Should fix, and Nice to have findings, each with a concrete failure case.
- For audit: a report-only repo-wide view with at most 20 ranked findings and Lean savings.
- The dual-guardrail verdict: FLOOR pass or fail with the missing safety named, CEILING pass or fail with the removed shape named.
- The attribution line: upstream seat, variant, pinned URL, hash result, and MIT notice.

## Failure Modes

- **Unverified pin.** Fetch fails or the hash differs: stop, mark the pin `unverified` with the URL and output, escalate with tool, command, and output.
- **Reckless brevity.** Tests skipped for risky logic or safety cut for brevity; FLOOR fails the change and the missing check is named.
- **Astronaut seniority.** Abstraction, wrapper, option, setting, or framework added without a caller that needs it; CEILING fails the change and the deleted shape is named.
- **Paraphrased guardrails.** Reworded FLOOR or CEILING text that no grep test can confirm; only the verbatim lines count.
- **Forked bodies.** Locally rewritten upstream prose that drifts within one quarter; adopt the pointer and re-pin instead.
- **Alias pinned.** The `.openclaw/skills/...` alias pinned without hash verification; pin canonical and verify.
- **Generation-gate blur.** Review or audit used to write code, or core used to certify its own output; generation and gating stay in separate invocations.
- **Unranked sprawl.** Audit findings beyond 20 or left unranked; rank by damage and cut the tail.
