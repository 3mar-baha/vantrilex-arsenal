# P5 Loop Dossier — closed-loop cycle on `ponytail`

Lane `VTA-FACTORY-EXECUTE`, phase P5, node `p5-demo`, owner `vantrilex-implementer`.
Item id `ponytail` in every stage below. Branch `wt/vta-factory-p0`, main worktree `O:\vantrilex-arsenal`.
Scope: two new files only — `.opencode/skills/vs-ponytail/SKILL.md` plus this dossier. No commit, no push, no other files touched.

## Stage 1 — DETECT @ 2026-10-17T18:31:08Z

Source read live: `P1-EVAL-INSTALLED.jsonl` line 11, `"id":"ponytail"`, `"verdict":"non-green"`, with `"round2":"All three proposals sufficient on paper; file unchanged on disk (propose-only node) so D2, D3, D7 still fail live; non-green stands, escalated for approval."`

Recorded dimension evidence, quoted verbatim from that line:

- D2 fail: `Step 2 'verify the content hash' and Inputs line 45 promise a canonical raw URL plus hash, but no URL and no hash value appear anywhere in the file — the step cannot execute as written.`
- D3 fail: `No application instance: no task-to-change walkthrough, no sample review verdict, no audit finding quoted.`
- D6 pass: `Upstream repo HEAD 200, canonical raw path HEAD 200, LICENSE HEAD 200, frontmatter 'license: MIT' confirmed in fetched head — cited surfaces resolve.`
- D7 fail: `Description 'any coding task' fires on 'gate this diff', which needs the review variant, contradicting the generation/gating split in Do-NOT-use.` with `"false_friends":{"outcome":"MISFIRE — core posture loads for a gating job; description does not route variants.","probe":"gate this diff"}`.
- Recorded proposals: `D2: add the three pinned raw URLs plus sha256 hashes with the exact check command (or mark the pin 'unverified' with the reason), then re-grade D2 against the executable step.` and `D3: append one minimal core instance (task sentence, smallest change, FLOOR/CEILING verdict lines), then re-grade D3 against those lines.` and `D7: narrow the description to name trio routing, e.g. core posture for coding tasks, review for gating diffs, audit for repo health, then re-run the false-friends probe.`

Mapping note: the dispatch words the gaps as D2 fetch-by-paraphrase, D3 no worked example, D6 unfetched URL, D7 no trigger evidence. The record grades D6 pass on grader-held fetch evidence while D2 fails on the missing in-file pin. The new file therefore embeds the exact pin invocation plus the fetched reference table, so all four dims re-grade against in-file lines.

## Stage 2 — CREATE @ 2026-10-17T18:31:46Z

Wrote `.opencode/skills/vs-ponytail/SKILL.md` (new dir `vs-ponytail`; sole writer of this path; original `ponytail` skill read-only, untouched). Gap-to-content mapping, all in one file:

- D2 exact invocation: Procedure step 2 states the precondition (`egress to raw.githubusercontent.com`), the expected result (`STATUS=200` plus `SHA256=` equals the pinned table value), and the stop-and-mark-`unverified` rule with escalation payload. Pin table carries the three canonical raw URLs plus LICENSE with bytes and sha256. Exact verify command embedded and run live (see Stage 5).
- D3 worked example: `### Worked example` carries a real task (`Extract the loop in scripts/verify-skills.mjs into a helper, no behavior change.`), a good result with quoted FLOOR/CEILING verdict lines and attribution, and a weak result with the named CEILING fail (speculative `--json` flag) and the named FLOOR fail (skipped battery re-run).
- D6 live-fetched references quoted: every table row was fetched live 2026-10-17 with `STATUS=200` recorded, and the observed-quotes block carries one verbatim string per surface, byte-verified against the pinned hashes.
- D7 near-miss negatives plus improver note: `### Near-miss negatives` lists four near-misses with route-or-silence outcomes; `### Description-improver note` records the v0 misfire, the v1 narrowing, and the re-run probes. The frontmatter description names the trio routing.

## Stage 3 — POLISH @ 2026-10-17T18:32:04Z

Single-home treatment per the repair1 precedent (`AGENT.md` lines 208-209: `verify-skills.mjs` failed `mechanism-single-home` on byte-identity copies duplicating 3 single-home markers; disposition was a targeted scrub of the duplicated markers into pointers, verified by `p1-repair1` with originals untouched).

Applied in the new file (`## Purpose`, single-home pointer block):

- Upstream prose: pointer only to the three pinned raw URLs, adopted and never restated.
- Guardrail wiring: pointer to `.opencode/skills/ponytail/GUARDRAILS.md`; the FLOOR/CEILING lines are the verbatim grep anchors that wiring mandates, not a second home.
- Eval record: cited by file and line, never copied in full.
- The three mechanism tokens (`[CIRCUIT BREAKER] HALT`, incident template, context anchor) appear nowhere in the new file.

Polish scan output over the new file:

```text
ban-hits=0
has-CR=false ends-single-NL=true has-TAB=false
polish-scan exit=0
```

## Stage 4 — SUBMIT @ 2026-10-17T18:32:37Z

Staged exactly the two new files, no commit, no push:

```text
PS> git add .opencode/skills/vs-ponytail/SKILL.md P5-LOOP-DOSSIER.md; echo "git-add exit=$LASTEXITCODE"
git-add exit=0
PS> git status --short -- .opencode/skills/vs-ponytail/SKILL.md P5-LOOP-DOSSIER.md; echo "git-status exit=$LASTEXITCODE"
A  .opencode/skills/vs-ponytail/SKILL.md
A  P5-LOOP-DOSSIER.md
git-status exit=0
```

## Stage 5 — EVALUATE @ 2026-10-17T18:33:00Z

Re-grade of D2/D3/D6/D7 against the new file, each green with quoted lines (paths are `.opencode/skills/vs-ponytail/SKILL.md`):

| Dim | Verdict | Deciding quotes |
|---|---|---|
| D2 | pass | Line 72 names the exact invocation with precondition and expected result; lines 78-81 pin all four URLs with bytes and sha256; line 86 gives the runnable verify command. |
| D3 | pass | Lines 104-110 carry the task, the good-result verdict lines, and the weak result with the named fails. |
| D6 | pass | Lines 78-81 resolve every cited surface by address with bytes and hash; lines 91-96 quote one verbatim string per surface; every row was observed live `STATUS=200` (see fetch evidence below). |
| D7 | pass | Line 3 narrows the description to the trio routing; lines 48-55 carry the near-miss negatives; lines 57-59 record the improver loop with the re-run probes. |

Fetch evidence (run live from the repo root, quoted with output and exit):

```text
https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail/SKILL.md STATUS=200 BYTES=3496 SHA256=9badd22a32e19cb884e46dfa8d3aae82bb81dfa5484105b8b4f0262df823a509
https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-review/SKILL.md STATUS=200 BYTES=5143 SHA256=33fe4ebe22a460924e5d4a261e223df22e409cc94ab76182bee9fb91a3ef022e
https://raw.githubusercontent.com/dietrichgebert/ponytail/main/skills/ponytail-audit/SKILL.md STATUS=200 BYTES=5417 SHA256=2b3223a02c386d1263e1b08343cb8eb3a53e444cdafb1d79e26c8ec2a8fcad28
https://raw.githubusercontent.com/dietrichgebert/ponytail/main/LICENSE STATUS=200 BYTES=1071 SHA256=fb1bc6909ac3ef82d5c22106e32ef682b0cff66788fa915fb9b53b15c9d2f3ab
fetch-batch exit=0
REPO STATUS=200 BYTES=411105
repo-fetch exit=0
STATUS=200 BYTES=3496 SHA256=9badd22a32e19cb884e46dfa8d3aae82bb81dfa5484105b8b4f0262df823a509
single-url-verify exit=0
```

Full gates on the new file (quoted with output and exit):

```text
PS> npx --yes markdownlint-cli .opencode/skills/vs-ponytail/SKILL.md; echo "markdownlint exit=$LASTEXITCODE"
markdownlint exit=0
```

```text
PS> node scripts/verify-skills.mjs; echo "verify-skills exit=$LASTEXITCODE"
skill-discovery          PASS     37 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md
frontmatter-keys         PASS     37 skills, every frontmatter holds exactly name and description
frontmatter-name         PASS     37 skills, every name matches its folder and the hyphenated shape
frontmatter-description  PASS     37 skills, every description is one third-person sentence with a front-loaded trigger
body-headings            PASS     37 skills, all seven headings present in order exactly once
no-placeholders          PASS     37 skills, zero TODO/FIXME/coming-soon/placeholder matches
no-excluded-toolchains   PASS     37 skills, zero references to excluded toolchains and the prior project
file-hygiene             PASS     37 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs
mechanism-single-home    PASS     halt block, incident template and context anchor each live in exactly one home skill
phase-map-cross-check    PASS     13 phase-map names all resolve (3 local skill folders, 10 catalog ids)
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
verify-skills exit=0
```

Stem proof (name equals folder is the `frontmatter-name` row above): `frontmatter name=vs-ponytail folder=vs-ponytail match=True`.

Sweep note over both new files: secret-hits=0 and pin-hits=0 on both; ban-token hits=4, all four confined to the verbatim `no-placeholders` gate-output quote above (evidence, not live tokens); `.opencode/skills/vs-ponytail/SKILL.md` alone is ban-hits=0.

Baseline before the write was 36 folders at 10/10 (Stage 1 window); after the write it is 37 folders at 10/10, so the new file entered the battery clean with zero regressions elsewhere.

## Stage 6 — ADMIT @ 2026-10-17T18:33:00Z

Disposition: PARKED. The closed loop is complete on disk and staged, but admission needs the owner review record, which is required and never skipped. Pending signer: Omar. Reason: owner review of the staged `vs-ponytail` bundle and this dossier has not happened yet, and no admission lands without it. No merge, no tag, no release from this node.
