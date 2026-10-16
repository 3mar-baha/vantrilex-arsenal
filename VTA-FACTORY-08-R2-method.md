# VTA-FACTORY-08-R2-method — Methodology evidence bundle

Lane: `VTA-FACTORY-08-PLAN` · Node: `r2-method` (wave 1 of 4) · Owner: `vantrilex-librarian`.
Date (UTC): 2026-10-16 · Kit version: not named in the dispatch; no version-qualified catalog claim is made below.
Inputs: live tree (read-only) plus `WORKFLOW.md` Part B (this brief); `VTA-FACTORY-08-R1-inventory.md` was not read (parallel node).
Every method claim below carries either a fetched-live source with a quoted observation or an explicit `unverified` mark with its reason. Nothing is reconstructed from memory.

## 1 — Anthropic skill-creator methodology (Apache-2.0)

Source 1: `https://github.com/anthropics/skills` — VERDICT: REACHABLE. Observed live 2026-10-16: the repository page carries the About line "Public repository for Agent Skills", a `skills/` directory, a `spec/` directory, and a `template/` directory, and its README states "Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks."

Source 2: `https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md` — VERDICT: REACHABLE. Observed live 2026-10-16: frontmatter `name: skill-creator` with the description "Create new skills, modify and improve existing skills, and measure skill performance." The `skills/` directory listing confirms a `skill-creator` entry exists alongside `mcp-builder`, `pdf`, `webapp-testing`, and others.

Counter-note: `https://github.com/anthropics/skill-creator` returned HTTP 404 on 2026-10-16. The methodology does not live at that address; it lives at the `skills/skill-creator/SKILL.md` path inside Source 1.

License confirmation: the Source 1 README states "Many skills in this repo are open source (Apache 2.0)." and separately states that the document skills under `skills/docx`, `skills/pdf`, `skills/pptx`, and `skills/xlsx` are "source-available, not open source". No `LICENSE` file was observed in the repository root file listing, so the license grant is per-skill as the README states, not blanket. The engineering companion piece is Source 3: `https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` (published Oct 16, 2025) — VERDICT: REACHABLE — whose "Developing and evaluating skills" section states "Start with evaluation", "Structure for scale", "Think from Claude's perspective", and "Iterate with Claude".

Stages stated in Source 2, in order, quoted:

1. "Decide what you want the skill to do and roughly how it should do it".
2. "Write a draft of the skill".
3. "Create a few test prompts and run claude-with-access-to-the-skill on them".
4. "Help the user evaluate the results both qualitatively and quantitatively", including "Use the `eval-viewer/generate_review.py` script to show the user the results".
5. "Rewrite the skill based on feedback from the user's evaluation of the results".
6. "Repeat until you're satisfied".
7. "Expand the test set and try again at larger scale".
8. "run the skill description improver ... to optimize the triggering of the skill".
9. "Package the final skill and return it to the user."

The creation detail sections are "Capture Intent", "Interview and Research", "Write the SKILL.md" (with "Anatomy of a Skill", "Progressive Disclosure", "Principle of Lack of Surprise", "Writing Patterns", "Writing Style"), "Test Cases", "Running and evaluating test cases", "Improving the skill", "Advanced: Blind comparison", "Description Optimization", and "Package and Present".

## 2 — Eval-driven loop evidence

All items below are sourced to Source 2 unless marked otherwise.

### 2.1 With-skill versus baseline same-turn evals — VERIFIED

Source 2, "Step 1: Spawn all runs (with-skill AND baseline) in the same turn": "For each test case, spawn two subagents in the same turn — one with the skill, one without. This is important: don't spawn the with-skill runs first and then come back for baselines later. Launch everything at once so it all finishes around the same time." Baselines are defined as: new skill, "no skill at all"; improving an existing skill, "the old version" via a snapshot (`cp -r <skill-path> <workspace>/skill-snapshot/`). Results are organized under `<skill-name>-workspace/` by iteration (`iteration-1/`, `iteration-2/`, etc.) with per-test-case directories plus `eval_metadata.json` and `timing.json` (`total_tokens`, `duration_ms`).

### 2.2 Two to three test cases — VERIFIED

Source 2, "Test Cases": "After writing the skill draft, come up with 2-3 realistic test prompts — the kind of thing a real user would actually say." Test cases are saved to `evals/evals.json` with `id`, `prompt`, `expected_output`, and `files` fields; "Don't write assertions yet — just the prompts. You'll draft assertions in the next step while the runs are in progress."

### 2.3 Grade-and-iterate — VERIFIED

Source 2, "Step 4: Grade, aggregate, and launch the viewer": "Grade each run — spawn a grader subagent (or grade inline) that reads `agents/grader.md` and evaluates each assertion against the outputs. Save results to `grading.json`"; "Aggregate into benchmark" via `python -m scripts.aggregate_benchmark`; "Do an analyst pass"; "Launch the viewer"; "Step 5: Read the feedback". The iteration loop under "Improving the skill" states: "Apply your improvements to the skill", "Rerun all test cases into a new `iteration-<N+1>/` directory, including baseline runs", "Launch the reviewer with `--previous-workspace`", "Read the new feedback, improve again, repeat", stopping when "The user says they're happy", "The feedback is all empty", or "You're not making meaningful progress".

### 2.4 False-friends trigger tests — VERIFIED (as near-miss negatives)

Source 2, "Description Optimization", Step 1 ("Generate trigger eval queries"): "Create 20 eval queries — a mix of should-trigger and should-not-trigger." On the should-not-trigger half it states: "the most valuable ones are the near-misses — queries that share keywords or concepts with the skill but actually need something different. Think adjacent domains, ambiguous phrasing where a naive keyword match would trigger but shouldn't, and cases where the query touches on something the skill does but in a context where another tool is more appropriate." The label "false-friends" itself is the order's wording (order section 2, not read by this node); the mechanism it denotes is evidenced above.

### 2.5 Seven-dimension audit shape — `unverified`

Reason: no seven-dimension audit shape was found in any fetched skill-creator material. The closest adjacent artifact, `https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/agents/analyzer.md` (VERDICT: REACHABLE, fetched 2026-10-16), defines six suggestion categories (`instructions`, `tools`, `examples`, `error_handling`, `structure`, `references`) and three priority levels (`high`, `medium`, `low`), plus per-assertion pattern analysis (always-pass, always-fail, skill-only-pass, skill-only-fail, highly variable) — none of which is a seven-dimension audit. Until the order's section 2 defines the seven dimensions or a source is named, the `d-plan` node must either state the dimensions as order-given or carry this item forward as `unverified`.

## 3 — Liu et al. 2026 skill-vulnerability finding (26.1%) — `unverified`

Reason: two live arXiv API queries run from this seat on 2026-10-16 both returned `totalResults` zero: `search_query=all:agent_skill_vulnerability` and `search_query=all:malicious_skills_agent` (both via `http://export.arxiv.org/api/query`, HTTP 200, `max_results=5`). A repository-wide grep for `26.1`, `Liu`, `false-friends`, and `7-dimension` found no in-tree source (the only `Liu` hit is the unrelated registry entry `JerryLiu369/agent-web-search` in `registry/VANTRILEX_CATALOG.md`). Web search was unavailable from this seat (HTTP 402), so no alternative index could be consulted. The 26.1% figure is therefore not sourced here; the `d-plan` node must cite the paper URL itself or carry the statistic as `unverified`.

## 4 — Smithery registry search-vet-add loop

### 4.1 Real CLI facts — VERIFIED live 2026-10-16

- Package: `smithery`, version `1.2.0`, verified via `https://registry.npmjs.org/smithery/latest` (HTTP 200; fields observed: `"name": "smithery"`, `"version": "1.2.0"`, `"bin": {"smithery": "dist/index.js"}`, repository `git+https://github.com/smithery-ai/cli.git`, description "An NPX command to install and list Model Context Protocols from Smithery", engines `node >=20.0.0`).
- Source repository: `https://github.com/smithery-ai/cli` (named as the package repository by the registry record and linked from the registry homepage footer reference observed at `https://smithery.ai/`).
- Installation (docs-verified): `https://smithery.ai/docs/concepts/cli` — VERDICT: REACHABLE — states under "Installation" the command `npm install -g smithery@latest` with "Requires Node.js 20+." The registry homepage additionally shows `npx smithery auth login`, `npx smithery mcp add notion`, `npx smithery tool list`, `npx smithery tool call`, and `npx -y smithery setup` as observed command shapes.
- Search-vet-add loop (docs-verified, same page): search with `smithery mcp search "github"` and `smithery skill search "code review"`; vet with `smithery tool list`, `smithery tool find`, `smithery tool get <connection> <tool>`; add with `smithery mcp add <url> --client <name>` and `smithery skill add <skill> --agent <name>`; auth gate with `smithery auth login`, `smithery auth whoami`. The docs "Important Notes" state authentication via `auth login` is required for some operations and the client must restart after adding or removing servers.

No install command is invented here. The only install form this bundle endorses is the docs-observed `npm install -g smithery@latest` (and the homepage-observed `npx smithery` invocation shape); every other spelling is out of scope.

### 4.2 In-tree drift — reported, not repaired

| Catalog id / location | Lock / registry state | In-tree text state | Drift |
|---|---|---|---|
| Smithery CLI package name — `docs/spec/VANTRILEX_KIT_SPEC.md:154` | Registry-verified package is `smithery` (section 4.1) | States the pattern `` `npx @smithery/cli install <server> --client opencode` `` per `https://smithery.ai/docs/concepts/cli` | The `@smithery/cli` package specifier matches no registry-verified name; the docs page observed live documents the `smithery` binary, not an `@smithery/cli` specifier |
| Smithery CLI package name — `.opencode/skills/vantrilex-vanguard/SKILL.md:235` | Registry-verified package is `smithery` (section 4.1) | States "the Smithery registry CLI via `npx @smithery/cli`" | Same mismatch as above; `npx @smithery/cli` is `unverified` until the owning lane proves it resolves |

Repair belongs to the kit-maintainer lane with this table attached. No lock entry, catalog entry, or generated Markdown was touched by this node. Related in-tree anchors left as found: `kit/kit.lock:8` (`skill-creator` entry), `registry/data/skills.jsonl:1295` (`skill-creator` entry), `RESEARCH-03-r0d-agents.md:32` (Anthropic Agent Skills row), `WORKFLOW.md` Part B section 1 (this node's DAG row).

## 5 — Source register (every claim resolves here)

| # | Claim | Source URL | Status |
|---|---|---|---|
| M1 | Skill-creator stages and eval loop | `https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md` | VERIFIED (fetched 2026-10-16) |
| M2 | Agent Skills repo shape and Apache-2.0 note | `https://github.com/anthropics/skills` | VERIFIED (fetched 2026-10-16) |
| M3 | Start-with-evaluation and iterate guidance | `https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` | VERIFIED (fetched 2026-10-16) |
| M4 | Analyzer categories and benchmark-pattern analysis | `https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/agents/analyzer.md` | VERIFIED (fetched 2026-10-16) |
| M5 | Seven-dimension audit shape | none (not found in M1–M4; absent in-tree) | `unverified` (section 2.5) |
| M6 | Liu et al. 2026, 26.1% skill-vulnerability finding | none (arXiv queries returned zero; no URL in dispatch) | `unverified` (section 3) |
| M7 | Smithery CLI package, binary, and install | `https://registry.npmjs.org/smithery/latest` | VERIFIED (fetched 2026-10-16) |
| M8 | Smithery search-vet-add commands | `https://smithery.ai/docs/concepts/cli` | VERIFIED (fetched 2026-10-16) |
| M9 | Smithery `npx` invocation shapes | `https://smithery.ai/` | VERIFIED (fetched 2026-10-16) |
| M10 | `npx @smithery/cli` spellings in-tree | `docs/spec/VANTRILEX_KIT_SPEC.md:154`, `.opencode/skills/vantrilex-vanguard/SKILL.md:235` | `unverified` (section 4.2) |

Routing: routine intake triage plus direct live-fetch verification on the dispatcher-provided path; fuller reasoning was used only where the rubric split (unverified items M5, M6, M10), which are marked rather than reconstructed.

Verification ledger for the required gate: `npx --yes markdownlint-cli VTA-FACTORY-08-R2-method.md` — quoted output `EXIT:0` with zero rule violations (command run after the final edit; no other files touched).

Ponytail: spirit (fewest-touch curation, deletion-over-addition, propose-only) — evidence: drift reported as a table with no repair applied, unverified items marked rather than filled, single new file authored, no writes outside the dispatched concern.
