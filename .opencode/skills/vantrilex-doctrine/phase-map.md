# Phase map (mandatory)

The phase map is mandatory. The `phase` field in `registry/catalog.json` is the injection and
pruning mechanism (kit spec 6.4): install once centrally; inject per phase, prune after. A phase
that keeps the previous phase's kit pays for context it no longer uses while the new phase starves.

| Phase | Skills |
|---|---|
| docs | `grill-me` [PROPOSED] (before docs), `session-context-primer` |
| plan | `wayfinder` [PROPOSED] (decision tickets), `ask-matt` (router) |
| design | vantrilex-ui-designer, vantrilex-ux-designer (agents, not skills — design skill half: [PROPOSED]) |
| build | `tdd` [PROPOSED], `ponytail`, `preflight-system-doctor` (step 0) |
| review | `code-review` (two-axis), `ponytail-review` |
| operate | `ponytail-audit` (periodic), `ponytail-debt` (ledger) |
| on-demand | `find-skills`, `skill-creator` |

`[PROPOSED]` marks a name with no folder under `.opencode/skills/` in this workspace. `grill-me`,
`wayfinder` and `tdd` are marked `[PROPOSED]`: they were not installed in this workspace and this
map makes no claim about whether they exist upstream — they were not probed here; their catalog
rows claim `verification: verified` with a non-null `install_cmd`, which this map does not dispute.
The design phase names the two design agents, which are agents, not skills; the design skill half
is unspecified and is marked `[PROPOSED]` for that reason. The agent names are deliberately not
backticked: `.opencode/skills/` is the skill home, `.opencode/agents/` is the agent home, and this
map does not present an agent as a skill. Installed in this workspace on 2026-11-11 via the
catalog `install_cmd` (`npx skills add … -a opencode -y`): `ask-matt`, `code-review`, `find-skills`,
`skill-creator`, `ponytail-review`, `ponytail-audit`, `ponytail-debt` — that command writes
`.agents/skills/<id>/` and `skills-lock.json`, not `.opencode/skills/`.

`preflight-system-doctor` is step 0 of the build phase: it verifies the machine and session ground
truth before any build dispatch. `on-demand` is outside any phase: `find-skills` and
`skill-creator` are never injected by phase and stay available to every phase. At each phase
transition: prune, then inject — never stack two phases of kit.
