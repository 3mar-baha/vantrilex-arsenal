# P2 BLAZAR-to-AETHER Migration Note

P2 7.6 BLAZAR retool (W26 `p2-retool`, verified 2026-10-15) moved planning
out of the build seat. This note records what moved from BLAZAR to AETHER,
what stayed with BLAZAR, and the restart step that makes the new authority
take effect. Written W27 by `p2-docs`.

## What moved from BLAZAR to AETHER

- **Planning.** BLAZAR no longer plans: no MISSION-PLAN authorship, no role
  sections, no replan, no standing methodology (blazar.md sections 2 and 4).
  Planning belongs to AETHER, which turns one owner brief into a verified
  MISSION-PLAN through PREPARE, PLAN, and STOP, then hands it over and stops
  (aether.md section 1).
- **MISSION-PLAN authorship.** The plan anatomy (objective, role sections,
  refusal lists, justification ledger, order, replan triggers), the
  per-role refusal lists, and the component justification ledger are authored
  by AETHER (aether.md sections 2 and 3). BLAZAR receives the finished plan
  and validates it against the 10-field intake checklist; a plan missing any
  section is a draft, and a draft is never derived from.
- **Replan ownership.** Replan triggers, the cap of three replans per task,
  and the escalate-instead-of-a-fourth-replan rule belong to AETHER
  (aether.md section 4). BLAZAR never replans: a trigger observed mid-build
  escalates back through a revised AETHER plan, which must clear the intake
  gate again before any wave is derived from it.
- **P0 reconnaissance tasking.** Territory mapping before the plan is
  AETHER's call through `vantrilex-scout` for P0 reconnaissance only; all
  post-P0 exploration belongs to PULSAR (aether.md section 6, blazar.md
  section 5). BLAZAR dispatches Scout never.

## What stayed with BLAZAR

- **Waves.** BLAZAR owns wave derivation, and only derivation: waves derived
  from the intaken MISSION-PLAN, and only from role sections carrying the
  label `section_leader: blazar` (blazar.md section 4). Deriving from an
  unlabeled or another leader's section is planning, and it escalates.
- **Dispatches.** BLAZAR owns every dispatch: each derived node carries its
  nine fields and fans out only with a complete brief to a named roster
  worker from the 13-worker allow-list, with single-writer enforced before
  the first dispatch (blazar.md sections 5 and 6).
- **Verification.** BLAZAR verifies every landing personally: the artifact on
  disk, the diff containing that concern and nothing else, and the real
  output of the exact check the brief named, re-run after the last change
  (blazar.md section 8). Green on a related command is not evidence.
- **Integration.** BLAZAR integrates only verified nodes, in dependency
  order, and records the integration per wave (blazar.md section 8). Repair
  rounds, refusal capsules, and the close-out gate are unchanged (blazar.md
  sections 9, 10, and 12).
- **State files.** BLAZAR owns the two state files and nothing else:
  `AGENT.md` (loadout, intake verdicts, per-wave checkpoints) and
  `WORKFLOW.md` in the project root (blazar.md sections 3 and 11). Every
  other write is a dispatched node's artifact, landed by that node.

## Session-restart reminder

Agent, frontmatter, companion-config, and theme changes take effect on
restart. After this retool, open a fresh session and enter it through the
matching switch command (`V-Blazar` for the build seat, `V-AETHER` for the
planning seat) so the retooled authority, the `blazar` session routing with
the `build` and `plan` lanes disabled, and the reserved theme all apply. A
session continued from before the retool still runs under the old
plan-owning BLAZAR authority: do not derive waves in it, re-enter through
the switch command instead.

## File map

| File | Role after P2 |
|---|---|
| `.opencode/agents/aether.md` | Planning authority: PREPARE, PLAN, STOP; authors the MISSION-PLAN and owns replans |
| `.opencode/agents/blazar.md` | Build authority: intake gate, derivation-only waves, dispatches, verification, integration, state files |
| `.opencode/commands/V-Blazar.md` | Explicit entry into the retooled BLAZAR Build Leader plus the theme-side steps |
| `.opencode/commands/V-AETHER.md` | Explicit entry into the AETHER planning leader plus the theme-side steps |
