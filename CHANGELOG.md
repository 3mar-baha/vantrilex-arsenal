# Changelog

All notable changes to Vantrilex Arsenal are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed

- **Catalog v4: the class-evidence model replaces the `verified`/`unverified`
  pair (`feat(catalog)`).** Every live record now declares a class —
  `upstream`, `data`, `loadable`, or `installable` — and the class fixes the
  evidence that proves it: source provenance, a load surface, or a command plus
  the registry that proved it. `verification` is the constant `verified`; a row
  that cannot produce its class evidence is no longer a live record with a
  weaker label. Proofs are dated and expire (90 days for a command, 180 for a
  load surface, 365 for a source). The migration leaves **2,837 live rows** and
  moves **104 rows** to `registry/candidates/<kind>.jsonl` with one of six reason
  codes, so nothing is silently dropped and nothing is guessed. The catalog
  counts **12 theme components plus 1 atomic-switch map**, the map being an
  out-of-catalog runtime artifact rather than a palette theme. The sixteen kinds,
  the generation chain, and the new-kind freeze until the P6 sign-off are
  documented in `docs/dev/06-REGISTRY.md`, and the selection's 17
  missing-address suspensions — reversible and self-restoring — in
  `docs/dev/05-KIT-LOCK.md`.

### Added

- **The release queue is documented (`docs(release)`).** `docs/dev/09-RELEASE-QUEUE.md`
  states the queue entry schema (`unit_type`, `scope`, `base_commit`, `status`,
  `published_version`, `published_at`, and the optional `intended_version`), the
  increment policy at `registry/policies/release-policy.json` and how a user
  restyles it, the three publication modes (commit, evidence, closure-record),
  the fail-closed declared-intent guard, the owner-created
  `.opencode/auto-release.enabled` switch, the shared audit log, and the refusal
  table. `docs/14-CI-RELEASE.md` carries the user-facing policy summary.

- **Auto-publish for `v0.0.x` patch releases (`feat(release)`).** Publishing
  a GitHub release triggers `.github/workflows/auto-publish.yml`, which builds
  the distributable from the exact tagged commit and gates the upload
  fail-closed on the mission battery plus that commit's CI evidence — a failed
  gate refuses the upload. The upload is idempotent by name and sha256, and the
  latest pointer is updated on success. Every run appends one machine-readable
  line to `.opencode/audit/AUTO-PUBLISH.log`. Minor and major releases remain
  owner-gated (owner ruling §3c). Proven by two dry-runs: the green path
  (`dry-run-would-publish;gate=PASS`) and the fail-closed path
  (`refused-verification;gate=FAIL`). See `docs/14-CI-RELEASE.md`.
- **One-plugin consolidation (`refactor(plugin)`).** The Tier-0 guards now live in the single `.opencode/plugin/arsenal.ts` — eight logical hooks across the two runtime surfaces, with the plan-guard append riding the dispatcher's own `prompt` registration so no prompt hook runs twice; `setup()` runs a six-hook capability probe and reports only what it observes, every registered callback checks the per-project kill switch at its head and no-ops when one of its four signals is set (م-4), and the new Diff Size Guard warns once per HEAD when uncommitted work exceeds 120 lines or 4 files (blueprint `:200`).
- **Lock abolished; catalog proofs are the sole gate (`docs(kit)`, Cluster 1 / S5).** The lockfile and its verifier are retired: `scripts/verify-catalog.mjs` now carries the replacement proofs (17 checks over a catalog measured at 2,941 rows on 2026-10-21, zero pending state), and phase injection reads the `.opencode/equip.manifest.json` selection record, whose 146 tokens reproduce the pre-abolition kit (30 tier `core` plus 116 tier `conditional`) as a parity baseline. The nine pending per-agent themes are authored and verified (9 of 12 `theme` rows `verified`), and new-kind onboarding stays frozen until catalog v4. Live documentation and instructions were swept to name the catalog and the selection record instead of the lock; history — this changelog, `AGENT.md`, `WORKFLOW.md`, the audit tree, and `docs/99-archive/` — stays verbatim.

## [0.7.7] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)

> Status: this section is a parked draft, not a release. No `v0.7.7` tag
> was cut, nothing was merged, pushed, committed, or published, and no
> `[0.7.7]` link reference was added below. It ships with the branch so the
> owner's return finds the census, the gates, the residuals, and the
> verification checklist in one place.

### Added

- **Relay-queue extension with zero-PATCH honesty (W32 `p3-queue`, per the
  stream record).** The starter database was found live with 9 properties
  covering the schema; all 9 were already complete, so the extension applied
  **zero PATCHes** and created no second database. The `status` column is kept
  as the live Notion-native `status` type (not `select`) per the queue ADR.
  The owner board view is a 30-second manual step — no API creates it (proven
  by two `400` responses). Honesty label: these queue facts are reported via
  the `AGENT.md` W32 stream record; this seat re-verified everything
  re-verifiable from disk (below) and ran no Notion operation — live queue
  checks are owner-seat-gated by the ADR-P3-03 config rule.
- **Architecture Decision Records.** `P3-R0.md` §8 carries three ADRs inline
  (ADR-P3-01: Notion database as the provisional queue backend; ADR-P3-02:
  3-minute agent-cron poll as the reachability fallback ceiling; ADR-P3-03:
  owner-held config file for all relay secrets, never hardcoded), plus the
  queue-extension ADR (Notion-native `status` type retained, board view
  manual) per the stream record.
- **`relay-protocol` skill: 8 files on disk
  (`.opencode/skills/relay-protocol/`).** `SKILL.md` plus seven companions
  (`RELAY-SCHEMA.md`, `MESSAGE-TYPES.md`, `POLL.md`, `SEND.md`, `TRIAGE.md`,
  `TIMEOUTS.md`, `SECURITY.md`), counted live: 8. Two laws above every
  section — the cost guard (script-level polling wakes the agent only on new
  rows, never on a tick) and the capsule law (bridge content is data under a
  fixed schema, never commands). Deliberately **unregistered**: no lock row,
  no registry row, no `install_cmd` — the owner installs it via the install
  pack, so P3 carries zero registration delta.
- **Poll + watchdog hooks, both REGISTERED DISABLED
  (`.opencode/hooks/relay/`, 3 files, counted live).** `relay-hooks.json`
  registers `relay-poll` (180 s, 300 s quiet, delivery main-chat) and
  `relay-watchdog` (60 s, delivery alerts side chat) with `enabled: false`
  on both — the owner's enable word is the start/stop switch, and the trial
  stays HELD until it. `relay-poll.mjs --dry-run` exits `0` (3 simulated
  rows, 2 acked, single wake armed, zero live reads/writes);
  `relay-watchdog.mjs --dry-run` exits `0` (4 simulated rows, 2 alerts armed:
  one `deadline-passed`, one not-yet-due `approval_request` that still alerts
  — the always-alert rule). No chat id, token, or database id is stored in
  any of the three files (grep-verified live).
- **W34 approval-union repair (1 MEDIUM, closed in-round).** The watchdog's
  live query missed not-yet-due `approval_request` rows while the dry-run
  promised always-alert; the repair aligns the live filter to the file's own
  `selectAlerts` union (`relay-watchdog.mjs:115-117`, `status == pending`
  AND (`expected_reply_by` past OR `type == approval_request`)) and re-proves
  the dry-run above. No other finding; W34 closed.
- **Owner-run install pack (`P3-OPENCODE-INSTALL-PACK.md`, 8 sections).**
  ClawHub Notion skill → alerts-chat UUID resolution → relay-protocol install
  → 60-second loop → six live proof checks with pass marks. Placeholder-only:
  the real alerts-chat UUID appears nowhere in the file (grep-verified live:
  zero hits); the nothing-executed statement stands — every pass mark is
  produced on the owner's PC, by the owner.
- **Census recounted for this entry live (never transcribed): lock 138
  components + 9 pending (unchanged from the v0.7.6 base); catalog 2915
  records across 16 sections (unchanged); agents sidecar 301 rows
  (unchanged).** Zero P3 registration delta: the working-tree lock, catalog
  JSON, and catalog Markdown are byte-identical to HEAD `8c97cd0`
  (`git diff --quiet HEAD`, exit `0`). Lock tiers: 32 `core` + 106
  `conditional`. Lock kinds, counted live: skill 27, mcp 8, lsp 1, hook 7,
  agent 21, cli 64, theme 3, prompt 1, dataset 1, template 1, policy 1,
  benchmark 1, workflow 1, design.md 1 (sums to 138). Catalog kinds, read
  live from `registry/catalog.json`: skill 1505, mcp 907, plugin 11, hook 20,
  agent 301, formatting 13, lsp 1, cli 64, theme 3, prompt 1, dataset 1,
  template 1, policy 1, benchmark 1, workflow 1, design.md 84 (total 2915).
  The 9 `pending` entries are unchanged and still absent from `components`.
  Skill folders on disk: 25 (was 24 — the +1 is `relay-protocol`, on disk and
  format-clean but unregistered by design). `verify-registry.mjs` 7/7 PASS
  (exit `0`), `generate-catalog-json.mjs --check` ok (exit `0`),
  `verify-kit.mjs` 22/22 PASS (exit `0`), `verify-skills.mjs` 10/10 PASS over
  25 skill folders (exit `0`), `tsc --noEmit` clean (exit `0`), `shellcheck`
  over the 8 `scripts/*.sh` files clean (exit `0`); six gates green after the
  final edit plus probe battery 45/45 (exit `0`) plus both hook dry-runs
  (exit `0` each) plus capsule validator self-test (exit `0`).

### Known residuals (NOT fixed here; recorded so none is misread as fixed)

- **Trial HELD for the owner start word.** The live relay trial (`p3-trial`)
  was never run — hooks stay `disabled` until the owner says start. This is a
  held gate, not a skipped one.
- **Board view = 30-second owner click.** No API creates the Notion board
  view; the owner builds it manually at install time.
- **Queue zero-PATCH + queue ADR rest on the stream record.** Re-verifiable
  disk facts were re-verified live (counts, gates, dry-runs, greps); the live
  Notion extension itself is owner-seat-gated and is not re-proven here.
- **F1–F5 (forgery/authenticity) carried forward unchanged** with the v0.7.5
  compensating control (session trust — capsules are session-local planning
  artifacts, never cross-session credentials).
- **F8 (doc/schema mismatch) carried forward unchanged** — direction deferred
  to vanbu; the F8 repair commit `8c97cd0` is the base of this park.
- **Live-probe gap.** Subagent depth-1 bars nested execution, so drills,
  probes, and dry-runs rest on static transcripts plus owner-runnable
  commands; the owner may run the live legs optionally.
- **Binding inputs `DESIGN.md` / `IDEA.md` are owner-authored Arabic research
  docs.** Read live as inputs (207 + 39 lines); not governed as kit docs and
  untouched here.

### PARKED list (what this change deliberately does not do)

- The `v0.7.7` release itself: no merge, no tag, no push, no publish, no
  commit — this section is parked uncommitted on `wt/vta-expansion-03`.
- The full program awaiting-Omar list: v0.7.5 (P1), v0.7.6 (P2), and v0.7.7
  (P3) parks are all uncommitted on the same branch; any park-commit, push,
  fresh-clone verify, merge, tag, or publish across all three is the owner's
  call, in the owner's order. The program closes plainly here — no
  manufactured follow-up.
- The live trial: HELD until the owner start word (hooks ship disabled).
- D4 plan-guard HARD admission gate: still PARKED per `P1-R0.md` Verdict 1
  (detective fallback ships instead, honestly documented).
- The dedicated commands library: PARKED to v0.8 per the B2 ruling.
- The 9 `pending` per-agent themes: still pending with stated reasons each
  (no theme JSON on disk, no install command registered).

### Vanbu fresh-clone verification checklist (exact)

> PARK discipline disclosure first: this park is uncommitted, so a fresh
> clone sees HEAD `8c97cd05be1aa3cd269c53caad31ef32bf1cb1e3` — the committed
> base (lock 138+9, catalog 2915, P3 hook/skill files NOT yet in it). Steps
> 1–9 verify that base from the clone; step 10 recounts it; steps 11–12
> verify the uncommitted P3 park files on the branch worktree only (they
> land in a clone only after an owner-ordered park-commit + push, which is
> explicitly not done here).

1. `git clone` the repo, `git checkout wt/vta-expansion-03`, confirm
   `git rev-parse HEAD` prints
   `8c97cd05be1aa3cd269c53caad31ef32bf1cb1e3`.
2. `node scripts/verify-registry.mjs` → exit `0`, 7/7 PASS.
3. `node scripts/generate-catalog-json.mjs --check` → exit `0`.
4. `node scripts/verify-kit.mjs` → exit `0`, 22/22 PASS.
5. `node scripts/verify-skills.mjs` → exit `0`, 10/10 PASS.
6. `npx tsc --noEmit -p tsconfig.json` → exit `0`.
7. `shellcheck` the 8 `scripts/*.sh` files (enumerated, not globbed)
   → exit `0`.
8. `node .opencode/plugin/arsenal.findings-probe.mjs` → 45/45,
   exit `0`.
9. `node scripts/validate-capsule.mjs --self-test` → exit `0`.
10. Recount: lock 138 + 9 pending (`git show HEAD:kit/kit.lock`);
    catalog 2915 / 16 sections; agents sidecar 301 rows; tiers 32 core +
    106 conditional.
11. On the branch worktree (uncommitted park, not in the clone):
    `.opencode/skills/relay-protocol/` holds exactly 8 files (SKILL.md + 7
    companions); `.opencode/hooks/relay/` holds exactly 3 files with both
    hooks `enabled: false`; `node
    .opencode/hooks/relay/relay-poll.mjs --dry-run` → exit `0`;
    `node .opencode/hooks/relay/relay-watchdog.mjs --dry-run` → exit `0`
    (2 alerts armed); `P3-OPENCODE-INSTALL-PACK.md` carries zero copies of
    the real alerts-chat UUID (placeholder token only).
12. Confirm `git tag -l v0.7.7` prints nothing and no `v0.7.7` release
    exists — parked means parked.

## [0.7.6] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)

> Status: this section is a parked draft, not a release. No `v0.7.6` tag
> was cut, nothing was merged, pushed, or published, and no `[0.7.6]`
> link reference was added below. It ships with the branch so the
> owner's return finds the census, the gates, the residuals, and the
> verification checklist in one place.

### Added

- **BLAZAR retooled from plan-owning orchestrator to Build Leader
  (`p2-retool`, sole writer of `.opencode/agents/blazar.md` plus the
  companion config).** The prompt now opens third-person on the trigger
  ("use when a verified plan is ready to execute"), carries THE ONE LAW
  verbatim — "derive waves, dispatch everything, execute nothing, plan
  nothing" (`blazar.md:208`) — and NEVER plans, NEVER explores, NEVER
  executes node work, NEVER dispatches a leader, the generic agent, or
  itself (`blazar.md:219-247`). The D5 bright line is quoted verbatim
  ("owner overrides direct work but NEVER suppresses gate verdicts",
  `blazar.md:558`) and the B2 naming law as amended for leaders is
  stated on the page (lowercase stem/id `blazar`, capitalized display
  BLAZAR, `blazar.md:192-196`). Zero `model:` keys in the retooled file
  (counted live: 0).
- **Phase-0 Plan-Intake gate (`blazar.md` section 3).** Five steps in
  order — read `AGENT.md` then `WORKFLOW.md` live, validate the AETHER
  MISSION-PLAN against the 10-field checklist, require each role's
  refusal list plus the justification ledger inline, write the loadout
  into `AGENT.md`, confirm companion routing — and PLAN-INCOMPLETE
  escalates, never improvised: any missing item stops the intake with a
  refusal capsule (`disposition: escalate`), never filled from memory,
  never borrowed from an older document, never dispatched on a draft
  (`blazar.md:307-312`).
- **Wave-derivation specification (`blazar.md` section 4).** BLAZAR
  authors no plan: waves derive only from role sections labeled
  `section_leader: blazar`; another leader's label or no label at all
  escalates and waits. Every derived node carries all nine fields
  (`id`, `concern`, `owner`, `inputs`, `acceptance`, `verification`,
  `artifact`, `wave`, `depends_on`) and a node missing one is not
  dispatched; a wave fans out only when every node holds a complete
  brief (all-ready-together), and roles sharing a write target never
  share a wave.
- **13-worker subagent allow-list with Scout restricted
  (`blazar.md` section 5).** Exactly 13 dispatchable build workers
  (`vantrilex-fixer`, `vantrilex-github`, `vantrilex-harness`,
  `vantrilex-librarian`, `vantrilex-python`, `vantrilex-releaser`,
  `vantrilex-reviewer`, `vantrilex-scribe`,
  `vantrilex-security-auditor`, `vantrilex-typescript`,
  `vantrilex-ui-designer`, `vantrilex-ux-designer`,
  `vantrilex-verifier`), counted live from the frontmatter. Scout is
  SHARED and RESTRICTED (D3 — never dispatched by BLAZAR); never
  dispatched either are `aether`/`pulsar` (planning/exploration
  leaders), `blazar` itself, `vantrilex-leader`/`vantrilex-guide`/
  `vantrilex-implementer` (lanes outside this seat), the `build`/`plan`
  primaries (disabled), and `general` (one-line reason plus owner
  routing decision, never silent fallback). `ponytail` rides in the
  skill allow-list; `vantrilex-workflow-forge` is gone from the
  frontmatter (0 hits, counted live) — ponytail-in, forge-out.
- **10-field intake checklist plus PLAN-INCOMPLETE capsule plus
  versioned-diff amendment protocol (`P2-INTAKE.md`, W27).** Exactly
  ten fields (`Lane`, `Node`, `Concern`, `Owner`, `Acceptance`,
  `May read`, `Must leave`, `Must run`, `Must not touch`,
  `State files`), each with its H-verdict ref back to `P2-R0.md`
  (3 CONFORM, 5 PARTIAL, 8 GAP); the escalate capsule shape validated
  by `node scripts/validate-capsule.mjs`; amendments arrive versioned
  (v1→v2…), re-validate affected waves only, and never weaken an
  acceptance criterion or a verification check to fit an artifact.
- **Ponytail compliance machinery
  (`docs/21-PONYTAIL-COMPLIANCE.md`, W27).** The `Doctrine:` brief
  line, the trailer shape (`Ponytail: <binding> — <one-line
  evidence>; Skipped: …; Risk: …`), the mechanical non-trivial rule
  (10+ lines, or 2+ files, or add/delete, or a trust-boundary path,
  counted from `git diff --numstat`), the Verifier two-sided checklist
  (side A green with side B vacuous is FAIL), the Reviewer
  `ponytail-review` checklist, and violations routing (vacuous trailer
  → leader re-dispatch, never reconstructed from memory). FLOOR and
  CEILING carried verbatim throughout.
- **Four negative-control probes, ALL FOUR PASS, all STATIC
  (`P2-NEGCTRL.md`, W27).** Gapped plan (missing Acceptance plus
  artifact) → `escalate` PLAN-INCOMPLETE; cross-section label
  (`section_leader: aether`/other/unlabeled) → pre-dispatch refusal;
  vacuous trailer on a non-trivial diff → leader re-dispatch, not a
  §9 repair round; node missing `verification` → not dispatched, wave
  held. Zero live legs (subagent depth-1 bars nested execution — no
  live dispatch claimed, static reasoning labeled per probe).
- **Migration note plus V-Blazar rewiring
  (`P2-BLAZAR-AETHER-MIGRATION.md` + `V-Blazar.md`, W27).** The note
  records what moved to AETHER (planning, MISSION-PLAN authorship,
  replan ownership, P0 Scout tasking), what stayed with BLAZAR
  (derivation-only waves, dispatches, verification, integration, state
  files), and the session-restart reminder (re-enter through the
  switch command; a pre-retool session still runs the old authority).
  `V-Blazar.md` now enters the Build Leader (intake gate §3,
  derivation §4, no planning/exploring/executing) and carries the
  Leaders-only rule.
- **Binding P2 research (`P2-R0.md`, W25): 16 handshake verdicts
  (3 CONFORM / 5 PARTIAL / 8 GAP), M1 detective plan-guard NO-DRIFT,
  28 roster verdicts (7 EXACTLY-COVERED + 0 STALE + 19 UNREGISTERED
  on-disk non-self ids across 26 agent files).** The pre-P2
  allow-list gap (finding F1) is counted, not papered, and owned by
  the retool in this same release.
- **Census recounted for this entry live (never transcribed): lock 138
  components + 9 pending (was 137 + 9); catalog 2915 records across 16
  sections (was 2914 across 16); agents sidecar 301 rows (was 300).**
  Lock delta is exactly +1 (agent `blazar`: `core`, `build`, null
  install command, `unverified` — the honest null, never an invented
  command); catalog delta is exactly +1 (same row; agent kind 301;
  catalog Markdown `## Agents` heading 301; agents `_index.md` 301
  with Tier 0 core 7; the Markdown `Total components: 2900` summary
  line is generator accounting, observed unchanged for this delta).
  Lock tiers: 32 `core` + 106 `conditional` (was 31 + 106). Agent
  files on disk: 26 (23 `subagent` + 3 primary leaders); 20
  self-sourced lock agents resolve to files, 1 upstream agent
  (`a11y-audit`) carries no local file by design. The 9 `pending`
  entries are unchanged and still absent from `components`.
  `verify-registry.mjs` 7/7 PASS (exit `0`),
  `generate-catalog-json.mjs --check` ok (exit `0`), `verify-kit.mjs`
  22/22 PASS (exit `0`), `verify-skills.mjs` 10/10 PASS over 24 skill
  folders (exit `0`), `tsc --noEmit` clean (exit `0`), `shellcheck`
  over the 8 `scripts/*.sh` files clean (exit `0`); six gates green
  after the final edit plus probe battery 45/45 (exit `0`) plus
  capsule validator self-test (exit `0`).

### Changed

- **Dispatch authority swapped with the retool (old 6 + `explore` →
  13 workers).** The pre-P2 allow-list (`architect`, `code-reviewer`,
  `ai-generated-code-security-auditor`, `technical-writer`,
  `red-team`, `kit-maintainer`, plus built-in `explore`) is replaced
  by the 13 build workers above; the old entries are out of this
  seat's dispatch scope by rule, not by omission. `blazar.md`
  description, NEVER/ALWAYS, roster, dispatch, verification,
  repair, refusal-capsule, and anti-rationalisation sections are
  rewritten around derivation-only leadership; the identical
  shared-instrument section (D3, Librarian, plan-guard) is unchanged.

### Known residuals (NOT fixed here; recorded so none is misread as fixed)

- **F8 (doc/schema mismatch) — direction deferred to vanbu.** Doc-shape
  `pulsar.md:124-158` (`Confidence` high/medium/low + reason,
  `file:line` evidence, affected-node/impact sections) disagrees with
  schema-shape `capsule.schema.json:46-72` (optional numeric
  `confidence`, per-finding evidence strings, no impact sections, six
  schema-required fields with no doc counterpart) in both directions.
  Either repair alters a verified component, so no repair ships here;
  the ruling travels announce→verify.
- **F-1 (drills finding: pre-P2 BLAZAR accepted planning orders) —
  CLOSED by this retool.** The retooled NEVER-plan rule
  (`blazar.md:219-220, 245-247`), the intake gate, and the refusal
  capsule now refuse/escalate planning work by the build seat; probes
  1–2 re-prove the refusal path (static, with file:line). Stated
  closed here so it is never re-opened as a residual.
- **Live-probe gap.** Subagent depth-1 bars nested execution, so all
  four negative-control probes rest on static transcripts with
  `file:line` citations; the owner may run the live legs optionally.
- **F1–F5 (forgery/authenticity) carried forward unchanged** with the
  v0.7.5 compensating control (session trust — capsules are
  session-local planning artifacts, never cross-session
  credentials).

### PARKED list (what this change deliberately does not do)

- The `v0.7.6` release itself: no merge, no tag, no push, no publish —
  this section is parked uncommitted on `wt/vta-expansion-03`.
- D4 plan-guard HARD admission gate: still PARKED per `P1-R0.md`
  Verdict 1 (detective fallback ships instead, honestly documented;
  re-confirmed NO-DRIFT by `P2-R0.md` M1).
- The dedicated commands library: PARKED to v0.8 per the B2 ruling
  (commands stay omitted; `V-Blazar` is a switch command, not a
  commands library).
- The 9 `pending` per-agent themes: still pending with stated reasons
  each (no theme JSON on disk, no install command registered).
- P3 (7.7 Relay): starts only on the owner go after the v0.7.6
  release; nothing of it is built here.

### Vanbu fresh-clone verification checklist (exact)

1. `git clone` the repo, `git checkout wt/vta-expansion-03`, confirm
   `git rev-parse HEAD` prints the hash quoted in the park report.
2. `node scripts/verify-registry.mjs` → exit `0`, 7/7 PASS.
3. `node scripts/generate-catalog-json.mjs --check` → exit `0`.
4. `node scripts/verify-kit.mjs` → exit `0`, 22/22 PASS.
5. `node scripts/verify-skills.mjs` → exit `0`, 10/10 PASS.
6. `npx tsc --noEmit -p tsconfig.json` → exit `0`.
7. `shellcheck` the 8 `scripts/*.sh` files (enumerated, not globbed)
   → exit `0`.
8. `node .opencode/plugin/arsenal.findings-probe.mjs` → 45/45,
   exit `0`.
9. `node scripts/validate-capsule.mjs --self-test` → exit `0`.
10. Recount: lock 138 + 9 pending; catalog 2915 / 16 sections; agents
    sidecar 301 rows; agent files 26 on disk (23 subagent + 3
    primary); tiers 32 core + 106 conditional.
11. Confirm `.opencode/agents/blazar.md`: THE ONE LAW line 208
    present; 13-worker subagent allow-list with zero `forge` hits and
    `ponytail` in the skill allow-list; `mode: primary` plus
    non-empty `color`; zero `model:` keys; `P2-INTAKE.md` 10 fields,
    `P2-NEGCTRL.md` 4/4 PASS (all STATIC), `docs/21-PONYTAIL-
    COMPLIANCE.md` and `P2-BLAZAR-AETHER-MIGRATION.md` present.
12. Confirm `git tag -l v0.7.6` prints nothing and no `v0.7.6` release
    exists — parked means parked.

## [0.7.5] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)

> Status: this section is a parked draft, not a release. No `v0.7.5` tag
> was cut, nothing was merged, pushed, or published, and no `[0.7.5]`
> link reference was added below. It ships with the branch so the
> owner's return finds the census, the gates, the residuals, and the
> verification checklist in one place.

### Added

- **AETHER (`aether`) and PULSAR (`pulsar`) planning/exploration leaders,
  lowercase ids everywhere checked.** Both ship as
  `.opencode/agents/<id>.md` with `name` byte-equal to the file stem,
  `mode: primary`, a non-empty `color` (`#14B8A6` teal for AETHER,
  `#C026D3` fuchsia for PULSAR), `temperature: 0.1` (a focus setting,
  not a model pin), and zero `model:` keys. AETHER runs
  PREPARE→PLAN→STOP and never executes; PULSAR runs hypothesis-first
  investigation under a budget box and hands findings-capsules to AETHER
  only, never raw to the build lane. Display forms stay capitalized
  (Aether, Pulsar) while every machine-checked surface — file stem,
  frontmatter, lock id, registry key — is lowercase per the B2 ruling.
  Companion switch commands `V-AETHER` / `V-PULSAR` and leader-tier
  themes `vantrilex-aether` / `vantrilex-pulsar` ship alongside.
- **Universal capsule validator family.** `schemas/capsules/`
  carries the schema family (5 types: `mission-plan`, `findings`,
  `refusal`, `wake`, `override`) plus valid/invalid
  `mission-plan` fixtures; `scripts/validate-capsule.mjs` exits 0 on
  valid capsules and nonzero with named reasons on invalid ones
  (self-test exit `0`, quoted below). The `mission-plan` shape requires
  `plan_id`, a non-empty `waves` array, and `handoff: blazar`.
- **Detective plan-guard with PARKED-HARD honesty.** `p1-planguard`
  extends `.opencode/plugins/vantrilex-guards.ts` with a
  detective-only plan-drift append (`[plan-guard] plan-drift report`
  via the session `prompt` hook). Per `P1-R0.md` Verdict 1, hook
  admission-denial is IMPOSSIBLE on host `v2.0.27`, so no HARD
  admission-denial claim is made anywhere: drift is reported after the
  fact, never refused at admission.
- **Identical shared-instrument section in all three leader docs.**
  `aether.md`, `pulsar.md`, and `blazar.md` carry the same
  `Shared-instrument boundaries (D3, Librarian, plan-guard)` section:
  D3 shared Scout (AETHER P0-recon only, post-P0 exploration is
  PULSAR's, BLAZAR's allow-list excludes Scout), the Librarian
  section-citation rule, and the detective-only enforcement note.
- **WAKE-REQUEST channel and OVERRIDE logging with the D5 bright line
  (`docs/20-WAKE-OVERRIDE.md`).** Wake records route attention between
  leaders (workers never issue them); override records carry
  `verdict_preserved` verbatim — owner overrides direct work but NEVER
  suppress gate verdicts.
- **Refusal drills plus triumvirate integration test (`P1-DRILLS.md`,
  all legs STATIC — subagent depth-1 bars nested execution, so no live
  dispatch is claimed).** Drill 1 (order AETHER to execute) PASS with
  cited refusal; Drill 3 (order PULSAR out-of-section) PASS with the
  chain rule; integration P0→plan→EXPLORE→findings→plan-v2 PASS with
  the BLAZAR stub boundary observed. Drill 2 is finding F-1 (see
  residuals): ordering the pre-P2 BLAZAR seat to plan is accepted, not
  refused — the refusal capsule plus prompt surgery is P2 scope
  (`p2-retool`), already planned.
- **Rename checklist plus audit re-homing note.** `P1-RENAME-CHECKLIST.md`
  restates the B2 lowercase scope with per-surface proof commands;
  `P1-AUDIT-REHOMING.md` homes `V-FULL-AUDIT` one way — AETHER plans,
  the Build Leader executes — without editing the shipped command.
- **Census recounted for this entry live (never transcribed): lock 137
  components + 9 pending (was 133 + 9); catalog 2914 records across 16
  sections (was 2910 across 16); agents sidecar 300 rows (was 298);
  themes sidecar 3 rows (was 1).** Lock delta is exactly +4 (agents
  `aether`, `pulsar` + themes `vantrilex-aether`, `vantrilex-pulsar`);
  catalog delta is exactly +4 (same 4 rows; agent kind 300, theme kind
  3, all other kinds unchanged; catalog Markdown Summary 2900, was
  2896). Lock tiers: 31 `core` + 106 `conditional` (was 29 + 104).
  Agent files on disk: 26 (23 `subagent` + 3 primary leaders); 19
  self-sourced lock agents resolve to files, 1 upstream agent
  (`a11y-audit`) carries no local file by design. The 9 `pending`
  entries are unchanged and still absent from `components`.
  `verify-registry.mjs` 7/7 PASS (exit `0`),
  `generate-catalog-json.mjs --check` ok (exit `0`), `verify-kit.mjs`
  22/22 PASS (exit `0`), `verify-skills.mjs` 10/10 PASS over 24 skill
  folders (exit `0`), `tsc --noEmit` clean (exit `0`), `shellcheck`
  over the 8 `scripts/*.sh` files clean (exit `0`); six gates green
  after the final edit plus probe battery 45/45 (exit `0`) plus capsule
  validator self-test (exit `0`).

### Changed

- **Leader exemption in `scripts/verify-kit.mjs`, ruling (a), named ids
  only.** `per-kind/agents` now exempts exactly `aether`, `pulsar`,
  and `blazar` from the `mode: subagent` requirement — each exempt id
  must instead carry `mode` exactly `primary` plus a non-empty `color`,
  enforced just as hard (missing either FAILS). Every other
  self-sourced lock agent still requires `mode: subagent` with no color
  field. No pattern, no flag, no skip.
- **W23 repair round 1 (scope-locked, no new features).** F6: the missing
  `aether`/`pulsar` registry rows the order's own commands promise are
  added (lock rows, sidecar rows, catalog rows, indexes — delta +2
  agents / +2 themes counted above). F9: color presence-only hardened
  to non-empty enforcement in the verifier (an exempt leader with an
  empty color FAILS). Re-verified green after the repair.

### Known residuals (NOT fixed here; recorded so none is misread as fixed)

- **F1–F5 (forgery/authenticity).** Signature-class machinery is
  out-of-scope new machinery for this lane. Compensating control:
  session trust — capsules are session-local planning artifacts, never
  cross-session credentials; nothing here authenticates a foreign
  issuer.
- **F7 (= drills F-1, pre-P2 BLAZAR).** Until the P2 retool lands,
  nothing on disk stops planning from being done by the orchestrator
  seat. Input to P2, already planned (`p2-retool`: prompt surgery +
  refusal capsule).
- **F8 (doc/schema mismatch).** Either repair direction alters a
  verified component, so it waits on an explicit vanbu ruling.
- **Live-probe gap.** Subagent depth-1 bars nested execution, so the
  drills and the integration test rest on static transcripts with
  `file:line` citations; the owner may run the live legs optionally.

### PARKED list (what this change deliberately does not do)

- The `v0.7.5` release itself: no merge, no tag, no push, no publish —
  this section is parked uncommitted on `wt/vta-expansion-03`.
- D4 plan-guard HARD admission gate: PARKED per `P1-R0.md` Verdict 1
  (detective fallback ships instead, honestly documented).
- The dedicated commands library: PARKED to v0.8 per the B2 ruling
  (commands stay omitted; `V-AETHER` / `V-PULSAR` are switch commands,
  not a commands library).
- The 9 `pending` per-agent themes: still pending with stated reasons
  each (no theme JSON on disk, no install command registered).

### Vanbu fresh-clone verification checklist (exact)

1. `git clone` the repo, `git checkout wt/vta-expansion-03`, confirm
   `git rev-parse HEAD` prints the hash quoted in the park report.
2. `node scripts/verify-registry.mjs` → exit `0`, 7/7 PASS.
3. `node scripts/generate-catalog-json.mjs --check` → exit `0`.
4. `node scripts/verify-kit.mjs` → exit `0`, 22/22 PASS.
5. `node scripts/verify-skills.mjs` → exit `0`, 10/10 PASS.
6. `npx tsc --noEmit -p tsconfig.json` → exit `0`.
7. `shellcheck scripts/*.sh` (8 files) → exit `0`.
8. `node .opencode/plugin/arsenal.findings-probe.mjs` → 45/45, exit `0`.
9. `node scripts/validate-capsule.mjs --self-test` → exit `0`.
10. Recount: lock 137 + 9 pending; catalog 2914 / 16 sections; agents
    sidecar 300 rows; agent files 26 on disk.
11. Confirm `.opencode/agents/aether.md` + `pulsar.md`: lowercase
    `name` == stem, `mode: primary`, non-empty `color`, zero `model:`
    keys; shared section byte-identical across the three leader docs.
12. Confirm `git tag -l v0.7.5` prints nothing and no `v0.7.5` release
    exists — parked means parked.

## [0.7.0] — 2026-10-15

### Added

- **Fourteen `vantrilex-*` side agents (workers, never primaries).**
  `vantrilex-typescript`, `vantrilex-python`, `vantrilex-fixer`,
  `vantrilex-github`, `vantrilex-ui-designer`, `vantrilex-ux-designer`,
  `vantrilex-scout`, `vantrilex-librarian`, `vantrilex-reviewer`,
  `vantrilex-verifier`, `vantrilex-harness`, `vantrilex-security-auditor`,
  `vantrilex-scribe`, and `vantrilex-releaser` ship as
  `.opencode/agents/<id>.md` with `mode: subagent`, zero `model:` pins,
  zero `color:` fields, and lowercase-hyphenated names byte-equal to file,
  lock id, and registry key. Lowercase-id naming-law amendment with the
  owner B2 ruling: side agents display lowercase `vantrilex-*` while
  leaders keep capitalized display with lowercase machine ids; all 14 are
  `tier conditional` with group tags (`dev`, `design`, `exploration`,
  `review`, `docs`, `operate`) and parent groups; dedicated side-agent
  commands stay omitted — the commands library is PARKED to v0.8.
  Provenance for every row is carried in `SOURCES.md` (44 sources fetched
  live: 39 REACHABLE + 5 GONE) and wired into each prompt's `when_to_use`.
- **Census recounted for this entry live (never transcribed): lock 133
  components + 9 pending (was 121 + 9); catalog 2910 records across 16
  sections (was 2896 across 16); agents sidecar 298 rows (was 284).**
  Lock delta is exactly +12 (14 side-agent rows added, 2 superseded
  agent rows removed); catalog delta is exactly +14 (same 14 rows).
  Lock tiers: 29 `core` + 104 `conditional`. Agent files on disk: 24
  (23 `subagent` + `blazar` primary); 17 self-sourced lock agents resolve
  to files, 1 upstream agent (`a11y-audit`) carries no local file by
  design. The 84-file design bundle is untouched (84 brand directories
  recounted). `verify-registry.mjs` 7/7 PASS (exit `0`),
  `generate-catalog-json.mjs --check` ok (exit `0`), `verify-kit.mjs`
  22/22 PASS (exit `0`), `verify-skills.mjs` 10/10 PASS (exit `0`),
  `tsc --noEmit` clean (exit `0`), `shellcheck` on scripts plus hooks
  clean (exit `0`); six gates green after the final edit plus probe
  battery 45/45 (exit `0`).

### Changed

- **Dual supersession: exactly one documentation authority and one audit
  authority remain.** `technical-writer` is a dated superseded pointer
  redirecting to `vantrilex-scribe` (sole documentation authority);
  `ai-generated-code-security-auditor` is a dated superseded pointer
  redirecting to `vantrilex-security-auditor` (sole audit authority).
  Both files perform no work and carry no rules of their own; both lock
  rows are removed, so the lock holds 18 agents (17 self-sourced + 1
  upstream). Verified by `a70-verify` 14/14 probes green.
- **T4 cross-cutting controls plus D2=A switch conversion with the KEEP
  ruling on triad switches.** All 14 prompts carry the worker-only line,
  kit-awareness, missing-tooling protocol, and ponytail matrix verbatim;
  side-agent V-switches are removed or consult-mode, so no session can
  make a side agent primary-by-position. The triad switches
  (`V-Vantrilex-Leader`, `V-Vantrilex-Guide`, `V-Vantrilex-Implementer`)
  stay executable per the W17 redteam KEEP ruling on finding F2 (triad
  mode-mismatch residual, kept deliberately, carried forward).
- **Prep-only release boundary stated as a refusal in three places with
  identical semantics (`t3-releaser-wire`).** `Vantrilex-Releaser` is
  prep-only: it stages the handoff package feeding the
  `github-release-packager` skill and never pushes a tag, never creates
  or publishes a release, even when asked directly — a direct request
  escalates to the leader, never obeys. The `github-release-packager`
  skill is the SOLE release executor: tag, push, and publish happen
  there and nowhere else; the Releaser feeds it, never duplicates or
  bypasses it. The Releaser prompt already carried this refusal absolute,
  so it stands unchanged (duplicate refusal lines are a defect); the
  packager skill doc now states the sole-executor side of the same
  boundary. Negative probe PASS (refuse + escalate).

### Honesty notes

- Scribe provenance is thin (1/4: `llipe/dev-tasks` REACHABLE, three
  sibling sources GONE) — flagged, not papered; the Scribe prompt claims
  only what the one live source supports.
- Five GONE sources name parked rows with fetch proof and no invented
  replacement (`t1-ux` proceeds on 1/2 sources, `t2-scout` on 4/5).
- Finding F1 (allow-list gap) is a P1/P2 retool input, already planned —
  not a release blocker, recorded here so it is never misread as fixed.
- Live-probe gap: subagent depth-1 bars nested execution, so W17
  verification rests on static transcripts; the owner may run the live
  legs optionally.
- The `SOURCES.md` seat-header defect (node ran on `main`, not the work
  branch) is closed by the seat repair plus the on-branch 44/44
  re-verification; the header line records the actual write-time branch
  honestly.

## [0.6.5] — 2026-10-15

### Added

- **Eighth `design.md` kind with the complete 84-file MIT bundle.**
  `voltagent/awesome-design-md` on `main` recounted live (GitHub API tree,
  exactly one `DESIGN.md` per brand directory: `84`, exit `0`); all 84 files
  bundled unmodified under `registry/design/<brand>/DESIGN.md` (2,466,141
  bytes, dotted slugs preserved, `DESIGN.md` only, no Vantrilex authorship
  asserted) with the MIT text at `registry/design/LICENSE.voltagent-MIT`
  (byte-identical to the live upstream `LICENSE`, 1066 bytes) and per-file
  blob SHA-1 proof in `registry/design/ATTRIBUTION.md`. Schema v3, the
  generator (`KINDS` / `SECTION_KINDS` / `SECTION_LABELS` / `SIDECAR_FILES` /
  `INDEX_DIRS`), the catalog `## Design` section plus Summary recount, the
  lock-schema enums, and a new `per-kind/design.md` verifier check all carry
  the kind; one `stripe` exemplar is wired end to end (lock row, sidecar row,
  catalog row, generated `registry/design/_index.md`, verifier proof).
  Census recounted for this entry (never transcribed): lock 121 components +
  9 pending (was 120 + 9); catalog 2896 records across 16 sections (was
  2812 across 15); sidecar `registry/data/design.jsonl` 84 rows; 84/84 brand
  directories carry `DESIGN.md`; zero `model:` pins and zero placeholders
  across all 84 bundled files.
  `verify-registry.mjs` 7/7 PASS, `generate-catalog-json.mjs --check` ok,
  `verify-kit.mjs` 22/22 PASS, `verify-skills.mjs` 10/10 PASS; six gates
  green after the final edit plus probe battery 45/45.

## [0.6.0] — 2026-10-15

### Added

- **Six V-commands under `.opencode/commands/`.** `V-FULL-AUDIT`
  (14-section REPORT-SPEC), `V-CATALOG`, `V-RAG`, `V-DOCTOR`, `V-PROFILE`,
  and `V-HTML_DESIGN` (plus `--index`); zero `model:` pins; content/model
  split holds. Ten companion `V-<Agent>` switch commands pair each roster
  agent (`V-Blazar`, `V-Architect`, `V-Code-Reviewer`,
  `V-Ai-Generated-Code-Security-Auditor`, `V-Kit-Maintainer`, `V-Red-Team`,
  `V-Technical-Writer`, `V-Vantrilex-Guide`, `V-Vantrilex-Implementer`,
  `V-Vantrilex-Leader`) — 16 command files in total, counted live.
- **Atomic agent+theme switch as the honest WORKAROUND mechanism.**
  `RESEARCH-03.md` (R0a verdict WORKAROUND, binding: no agent-switch hook,
  no session-start hook, and read-only `context.theme` on
  `opencode v2.0.27`) rules out a native per-agent auto-switch, so one
  explicitly invoked command switches the agent and applies the theme-side
  steps together. The `vantrilex-atomic-switch` install skill is locked
  (conditional, unverified, null install command) and ships the per-agent
  theme registry.
- **Per-agent theme registry, 1 installed / 9 pending.**
  `registry/themes/vantrilex-atomic-switch.json` carries 10 rows: `blazar`
  installed (dark royal blue `#4169E1`, reserved), the other nine agents
  pending with distinct category shades (code blue shades, security purple,
  kit flame red, research green, design gold reserved). The 9 pending theme
  JSONs are not yet authored, so no file-copy install command is registered
  for them — the lock records all nine under `pending` with a stated reason
  each, never as file-copies of nonexistent files.
- **Ponytail bundle with dual guardrails (MIT, adopt don't reinvent).**
  Upstream `dietrichgebert/ponytail` core + review + audit pinned by
  canonical raw URL with content-hash verification; `GUARDRAILS.md` wires
  the verbatim FLOOR/CEILING lines for every code-executing agent
  (review/audit stay report-only, max 20 ranked findings).
- **Census recounted live for this entry (never transcribed): lock 120
  components + 9 pending (was 119 + 0); catalog 2812 records across
  15 sections (was 2811).** Lock delta is exactly +1
  (`vantrilex-atomic-switch` skill); catalog delta is exactly +1 (same
  row). Skill folders on disk 24; `verify-skills.mjs` 10/10 PASS.
  Six gates green after the final edit plus probe battery 45/45 —
  outputs and exit codes quoted in the release report.

### Honesty notes

- The 16 `.opencode/commands/` files are schema-unsupported: the lock
  schema carries no `command` kind, so they are not lock entries.
  Recorded for the Guide; no unilateral schema edit was made.
- `V-DOCTOR.md` saying "six V-commands" counts the six headline commands;
  the ten `V-<Agent>` switch commands are a distinct set. Adjudicated
  without a repair round at W6 verify, recorded here so the phrasing is
  never misread as a stale count.

## [0.5.0] — 2026-10-15

### Added

- **Per-agent theme infrastructure (new `theme` kind).** Schema v3 carries an
  extensible kind mechanism (new schema file per version, never in-place
  edits); `theme` is its first use. `vantrilex-blazar` is a dark royal-blue
  V2-native theme (`base` + `dark` hue palettes, `#4169E1` at `blue.500`,
  zero image keys), installed by file copy, mapped ACTIVE to `blazar` with
  three future-agent rows RESERVED. No native auto-switch or background
  image exists — the mapping is static config plus manual `/themes`.
- **Ten-domain file-based RAG under `registry/rag/`.** Versioned JSON
  envelope (`version`, `release`, per-entry `version_range`) across doctrine,
  creator-identity (verbatim owner string), blazar-ops, component-deepdives,
  failure-modes, releases, workflow-recipes, opencode-v2-platform,
  security-posture, and user-faq, plus `knowledge-hotfix.json` (GitHub Pages
  merge policy) and the v0.6.0 hosted-API design doc (no server).
- **`vantrilex-deep-understand` skill + microscopic `docs/dev/`.** Read-only
  progressive disclosure over a nine-file dev index; skill count 21→22.
- **ECC takeaways.** Profile-based install (`minimal`/`opencode`/`core`/
  `full` in `manifests/install-profiles.json`, ids resolved against the
  lock), full `docs/ar/` translation set, `--ignore-scripts` hygiene on all
  npm/npx script invocations, and `docs/19-HARNESS-MATRIX.md`
  (OpenCode-first, all other harnesses FUTURE).
- **Agents moved to canonical `.opencode/agents/`.** All ten files pure
  renames; every agent declares `mode` explicitly (new `agent-mode-explicit`
  gate); all nine pre-existing files normalized to V2 `permissions`.
- **Zero-collision MCP names with a permanent scan** (`mcp-name-normalization`
  gate); LSP honestly converted to need-label (V2 runs no language servers).

### Fixed

- **Red-team round-2 findings closed with probe proof** (45/45 checks):
  bash-path verdicts, per-path pairing, session-id sanitizer at both sinks,
  UNC-aware roots, kill-switch parity on both surfaces, role-preferring
  append target, `sudo`/path-qualified `tee` coverage, and two V2 parity
  items (bare-root setup, working-set recording).
- **Phantom `typescript-lsp` double removed** from the plugins sidecar (now
  lives only in `lsp.jsonl`); dropped plugins demoted from default-selected;
  catalog Summary bullet corrected to 20.
- **V-review notes applied**: `red-team` duplicate profile ids documented as
  intentional (resolve by id+kind); `allow-all-pack` trigger carries a
  back-up-first warning (the gate requires a plain `cp` install command, so
  the warning lives in prose, not in the command).

- **Six remaining kit kinds, one exemplar each (all conditional).**
  `prompt` ships the paste-once repo install prompt
  (`vantrilex-install-prompt`: pinned-tag clone, Prime once per machine,
  Vanguard in project, prove-and-report); `dataset` ships the 45 Stream-G
  guard probe checks as a golden JSON dataset (`stream-g-guard-probes`);
  `template` ships the 28-file target-project docs scaffold manifest in 8
  folders (`target-project-docs-scaffold`, `18-WORKFLOW.md` reserved for
  Doctrine); `policy` ships the owner global allow-all pack itself
  (`allow-all-pack`, every effect `allow`, never `deny`/`ask` by stealth);
  `benchmark` ships one tiny verifier-gate smoke spec
  (`verifier-gate-smoke`, outputs illustrative and never a target metric);
  `workflow` ships one Forge-authored BLAZAR DAG exemplar
  (`forge-dag-exemplar`, executed only through BLAZAR subagent dispatches).
  Lock at 119 components, registry at 2811 records across 15 sections; the
  `full` install profile stays in sync.

## [0.4.1] — 2026-10-14

### Fixed

- **Docs-discipline guard sees bash writes.** Shell file-write redirection
  previously bypassed the guard entirely; bash commands are now routed through
  the same verdict path as edit-tool writes for detectable cases (`>`, `>>`,
  heredoc, `tee` in command position, `sudo`/`path`-qualified `tee`).
  Residual interpreter/`dd` bypasses are documented in code. Pinned by probe
  (28→45 checks, all passing).
- **Guard verdicts name the right file** on multi-file calls (per-path pairing
  before filtering).
- **Session ids sanitized before path construction** at both filesystem sinks;
  `ses_*` ids pass through unchanged.
- **UNC/network roots resolve** with consistent trimming; V1/V2 kill-switch
  parity (no state mutation when disabled); append target prefers the
  user-role text part.
- **BLAZAR model pin removed** per DEFAULT-ONLY law; it inherits the user's
  configured default model.

### Changed

- **GitHub MCP pin reviewed, not moved.** `2025.4.8` confirmed as the latest
  upstream release with a sandbox exit-0 install; the package is deprecated in
  place with no successor, so `verified` stands and the pin is unchanged.
- **Warn-default and `CLAUDE.md` allow-listing recorded as deliberate** in
  `docs/15-DECISIONS.md` with acceptance and rationale; behavior unchanged.

## [0.4.0] — 2026-10-14

### Added

- **Fourth top-level skill: `vantrilex-workflow-forge`.** Authors the
  standing methodology per task (seven sections: Methodology, Roles,
  Precautions, Repair states, Research, Expanded thinking, Kit loadout) and
  the per-project `WORKFLOW.md` (Part A standing + Part B current-task).
  Locked conditional, installed and proven at equip time.
- **`AGENT.md` living state + pointer chain.** The kit ships an `AGENT.md`
  template (six fixed sections) and installs/verifies it per task without
  overwriting; standing directives live in the target `AGENTS.md` with a
  generated `CLAUDE.md` mirror; every task starts by reading both state files.
- **64 CLI entries (kind `cli`, all conditional).** Every install command
  sandbox-verified exit 0, free solo-dev terms recorded, delivery mechanism
  declared per entry (PATH-assert default — the lock never claims OpenCode
  installs a CLI). Open Design ships no CLI, so OpenPencil `op` substitutes
  as entry #1 with the reason recorded.
- **BLAZAR primary agent.** Manager-only orchestrator (`mode: primary`,
  free-model pin `opencode/big-pickle` 2026-10-13, twelve prompt sections),
  with `default_agent: blazar` companion config (build/plan disabled).
- **`docs/17-V2-HOOK-GAP.md`.** Every plugin callback has a real V2 landing
  site in the published 2.x types; the two blocking guards go advisory-only
  there. The older "no V2 equivalent" claim was wrong about writability.
- **Official Supabase and Vercel MCP records**, both sandbox exit 0.
- **Five role agents as real OpenCode definitions**, all registering as
  subagents with no model pins, colors, or Claude syntax.

### Changed

- **Machine unified on V2.** The npm V1 (`opencode-ai@1.18.34`) no longer
  shadows the desktop bundle; `opencode` is v2.0.27 on PATH. Global config
  normalized to V2 `permissions` (allow-all intent preserved exactly).
- **Plugin proven on the V2 surface.** All four V2 hook registrations pass
  with per-guard evidence; M-1 (sudo/path `tee`) and two V2 parity items
  closed with probe proof (45/45). V1 dual surface intact.
- **Lock 48→112, catalog 2740→2804.** Agents moved to canonical
  `.opencode/agents/`; all agent files normalized to V2 `permissions`;
  `typescript-lsp` honestly converted to need-label (V2 runs no language
  servers); zero MCP name collisions with a permanent scan; new
  `per-kind/lsp`, `agent-mode-explicit`, `mcp-name-normalization` checks.
- **Vanguard and Doctrine govern the four-skill world.** Vanguard gains
  catalog fallback under owner sign-off, open choice, install-time
  validation, hygiene, a mandatory four-part report, and a binding gap
  protocol. Doctrine writes the standing directives and the per-task AGENT.md
  law. Prime names four skills and routes to the forge.
- **`release.yml` no longer false-fails.** Invalid YAML was the true cause;
  trigger stays tag-scoped with a job-level gate, so main pushes run nothing.
- **READMEs, AI_GUIDE, docs, and visuals recount to 112/2804.** Table SVGs
  that still render the prior census say so in their captions; no figure is
  warranted as verified that is not.

### Fixed

- **Red-team findings F1, F3, F4, F5, F7, F8 closed** with probe proof and a
  clean re-probe (R2) plus V2-surface re-probe (R3); F2/F6 recorded as
  deliberate with rationale in `docs/15-DECISIONS.md`.
- **36 phantom + 623 awesome-list catalog commands** nulled or repointed per
  prior rounds (see 0.3.0); this release adds the `eslint` placeholder fix.
- **Phantom `typescript-lsp` double removed**; dropped plugins demoted from
  default-selected; Summary bullet corrected to 20.

## [0.3.0] — 2026-10-12

### Added

- **The `cli` kind now reaches the catalog generator.** `generate-catalog-json.mjs`
  knows the kind in all five places it enumerates one — `KINDS`, `SECTION_KINDS`,
  `SECTION_LABELS`, `INDEX_DIRS`, `SIDECAR_FILES` — so a future `cli` lock entry no
  longer fails `catalog-agreement` with `cli: absent from registry/catalog.json`.
  Proven end to end with temporary fixtures (a markdown row, a sidecar, and a lock
  entry): `per-kind/cli` reported `1 cli entries carry a real installer command`
  and `catalog-agreement` passed at 53 entries. Every fixture was then removed and
  `kit/kit.lock`, the sidecar, and the markdown restored byte-for-byte, so the kit
  still locks 0 `cli` entries and the census is unchanged at 2737 — a figure
  superseded later in this same section by the 47-component lock cleanup, which
  is the live census. Nothing about
  the toolchain's behaviour changed for the six existing kinds.

- **A `cli` kind — the place for command-line tools, holding zero entries.** The
  lock schema and the registry catalog schema both accept `cli`, and
  `scripts/verify-kit.mjs` grew a `per-kind/cli` check that validates a real
  package-manager invocation or vendor installer, rejects chained shell operators
  and piped remote code, and reports `0 cli entries locked` rather than passing
  vacuously. New `cli` entries default to `conditional` — per-project, owner
  approval — recorded as prose rather than a schema mechanism, since a hard-coded
  tier check would turn a legitimate promotion to `core` into an error.
  Selection criteria are owner-locked: free or a generous free tier for a solo
  developer with the terms recorded, no functional overlap with a locked
  component, best-of-breed among duplicates, a replacement surfaced only when
  clearly and significantly better with concrete differences stated and otherwise
  dropped silently, and licence recorded for information only, never a filter.
  Population happens later through the digest and review mechanism; nothing is
  locked now.
- **A direct install command under each of the three skills.** The README now
  carries a copy-pasteable `npx skills add` command beneath Prime, Vanguard, and
  Doctrine, so a reader can take one skill immediately instead of running the
  full Vanguard survey first. The commands follow the install pattern documented
  at `docs/04-VANGUARD.md`. Both READMEs carry the block at the same
  position: the English one under `Install directly:`, the Arabic one under
  `للتثبيت مباشرة:` with the command itself left in Latin script so the two
  files render identically. Documentation only: no new component, no registry or
  `kit.lock` change, no behavior change.
- **Those three commands are now proven, not assumed.** Each was executed for real
  in an isolated sandbox with a fresh `HOME` and its own working directory, with
  nothing written outside it. All three exited 0, each installed into
  `.agents/skills/<name>/SKILL.md`, and every installed file is byte-identical to
  its committed blob — matched with `git hash-object` and SHA-256 against
  `HEAD:<path>` rather than the working tree, so an unrelated uncommitted edit
  cannot manufacture a false pass. The CLI reports *Found 20 skills*, which
  matches the twenty directories under `.opencode/skills/`, so it does discover
  this repository's layout. The `-a opencode` flag that `kit.lock` uses for
  upstream skills is **not** required here: agent auto-detection already resolves
  to OpenCode, and adding the flag changes only the console echo, not where files
  land. The commands stay as written.
- **Third top-level skill: `vantrilex-prime`.** An orientation skill that runs once
  per machine, before Vanguard or Doctrine. It covers what the Arsenal is, the
  canonical repository URL, how to clone and pin it, the on-disk layout, how to
  confirm the three top-level skills exist, the order they run in, and the standing
  laws every later phase obeys. Registered in the Registry and locked in
  `kit/kit.lock` at `tier core`, `phase scout`, a null `install_cmd`, and
  `verification unverified`, matching the Vanguard and Doctrine precedent.
- **Kit component `vantrilex-design-variations`.** A procedure that fires when a
  design task arrives on a UI-bearing project: it produces four screenshot-able
  HTML variations, an owner approval gate, a linked ticket, and a verified build
  before any styling work is written. It is a catalog kit component, not a
  fourth top-level skill — the orchestration layer stays exactly three. Locked
  at `tier conditional`, `phase build`, a null `install_cmd`, and
  `verification unverified`, matching every other in-repo conditional skill.
- **Kit component `task-dispatcher`, the seventh hook.** A plugin callback in
  `.opencode/plugin/arsenal.ts` bound to the OpenCode V2 session `prompt` hook,
  so it fires once per user prompt — the event granularity and the task
  boundary are the same boundary, and nothing inside a task can re-trigger it.
  It appends a five-line instruction that classifies the turn into exactly one
  of five Vanguard task scenarios (new task, continuation, task modification,
  continuation with modification, continuation with new task) and points at the
  Vanguard skill, which owns what to do about each. It injects no component and
  carries no plan of its own. Locked at `phase scout`, `tier core`, a null
  `install_cmd`, and `verification unverified`, matching every other in-repo
  hook. Its kill switch is `taskDispatcher.enabled` in `.opencode/arsenal.json`,
  default `true`, so the policy can be turned off without unpacking the plugin.
  Documented in `docs/16-TASK-DISPATCH.md`.
- `README.ar.md`, the full Arabic counterpart to `README.md`, agreeing with it on
  every figure and fact.
- `AI_GUIDE.md`, an AI-facing operating manual: the three skills and their fixed
  order, the §33B orchestration law and the single-writer rule, announce-then-verify,
  the six gates, the on-disk map, and the mistakes to avoid.
- **officialskills.sh is now a documented registry source.** The Vanguard skill's
  surveyed-sources list names it: the official frontend of the
  VoltAgent/awesome-agent-skills collection, whose per-skill pages publish a real
  `npx skills add` install command that can be recorded verbatim as provenance.
- **Five role agents now ship as real OpenCode definitions.** `architect`,
  `code-reviewer`, `technical-writer`, `ai-generated-code-security-auditor`,
  and `kit-maintainer` exist as `.opencode/agent/*.md` with `mode: subagent`,
  no model pin, no color, and no Claude-only syntax, and all five register in
  `opencode agent list`. The registry held only pointer indexes before, which is
  why named specialists could never be dispatched.
- **Official Supabase and Vercel MCP records.** Both install commands were proven
  in a sandbox before recording: `npx -y @supabase/mcp-server-supabase@0.13.0
  --version` and `npx -y add-mcp@2.4.1 --help` each exit 0. Vercel has no
  self-hostable package — its server is hosted-only — and its installer is
  third-party, which the record states.
- **`docs/17-V2-HOOK-GAP.md`: every plugin callback has a real V2 landing site.**
  Researched against the published `@opencode/plugin` 2.x types: all eight
  callbacks port, though the two blocking guards go advisory-only on V2. The
  older claim that V2 has no equivalents was wrong about writability and is
  corrected here.
- **`verify-kit.mjs` grew a `per-kind/lsp` check** mirroring `per-kind/cli`, so a
  future malformed `lsp` entry cannot pass the suite silently.

### Changed

- **GitHub MCP pin reviewed, not moved.** `2025.4.8` is confirmed as the latest
  upstream release of `@modelcontextprotocol/server-github`; the package is
  deprecated in place with no successor version, and the sandbox install still
  exits 0, so `verified` stands and the pin is unchanged.

- **336 of the 623 nulled records were repointed to real commands.** officialskills.sh
  was tried first, as planned, but its 660 skill pages cover only 56 orgs — and
  just 7 of the 201 origin orgs these records actually come from — so it supplied
  25 verbatim commands and no more. The remaining 311 came from probing each
  record's `origin` repository and confirming the named skill's directory exists
  there: 25 recorded verbatim from the skill's officialskills.sh page, 311
  constructed as `npx skills add <origin> --skill <id>` to match the catalog's
  convention. Nothing was invented — a skill that could not be proven to exist
  upstream stays nulled, which is 287 of the 623: 262 absent from their origin
  repo, 22 whose origin repo no longer exists, and 3 (`lenis`, `og-image`,
  `open-graph-image`) that are locked in `kit.lock` with an intentional null, so
  the lock governs. Valid skill commands rose from 823 to 1,159. Only
  `install_cmd` changed, proven by field-level comparison against HEAD; every
  `origin` and every other field is untouched.

- **`SECURITY.md` said three things the audit disproved.** It claimed the project
  ships "not an executable runtime" while `.opencode/plugin/arsenal.ts` is a
  runtime with seven hook callbacks that write and spawn; it claimed a verified
  entry records what it was verified against, and no such field exists among the
  twelve fields the catalog carries; and it claimed the lock pins versions, where
  2 of 52 entries carry a `version_pin` and all ten installable skills carry
  none. Each now states what is actually true, including that a `verified` flag
  is an assertion to re-test rather than auditable proof. Two weaker claims were
  corrected the same way: the pre-commit hook refuses a newly *added* `.env`
  rather than any staged one, and `scripts/` records no approval before its
  recursive deletions even though the paths themselves are verified inside the
  repository root. The 36 catalog records whose unquoted multi-word `--skill`
  values would install the wrong thing are documented as a known open defect
  rather than silently left for the next reader to trip over.

- **A lost warning came back.** Adding CLI install prose to the Vanguard skill
  reworded "never guess a repository path" down to "never guess a binary", which
  silently dropped the guard on `npx skills add <repo>` — the failure it exists to
  prevent. It now reads "a repository path or a binary".

- **The Vanguard skill's three bare source URLs are wrapped in backticks**, so
  markdownlint passes on a file this change touches. `docs/04-VANGUARD.md` now
  records that an MCP server may be installed as a JSON snippet *or* as
  `npx -y <package>`, which is what `verify-kit.mjs` actually accepts and what the
  two verified MCP entries already do.

- **The plugin no longer crashes the host.** `opencode run` exited 1 with the
  plugin installed and 0 without it; the cause was not the export shape but a
  malformed synthetic message part — the `chat.message` hook pushed a text part
  without host-validated identity fields, which host 1.18.34 rejects before
  save. The fix appends the instruction into the last existing user text part
  instead, and the smoke test now exits 0 with the plugin installed. The
  `docsDisciplineGuard` default moves from `block` to `warn` with a new
  `docsGuard.enabled` kill switch, and `CLAUDE.md` joins the default allowed
  files so the standing-directive append passes the guard.
- **Vanguard gains a catalog fallback, open choice, install-time validation,
  hygiene, a mandatory report, and a binding gap protocol.** Beyond-lock needs
  query the live catalog under a second owner sign-off; the full inventory is
  presented with capabilities and never hardcoded; agents are validated at
  install (name shape, `mode: subagent`, no color, no foreign syntax) instead
  of failing at dispatch; no vestigial deny entries are left behind; the
  initial report is one long evidence-traced document in the required four-part
  shape; and a missing role is searched, authored, verified, and dispatched —
  never silently replaced by a generic agent.
- **Doctrine writes the standing directives into the target `CLAUDE.md`.** The
  six permanent rules live in one delimited, idempotent block, written once and
  re-verified every run, with the spec marker telling revisions apart.
- **`release.yml` no longer false-fails on pushes to `main`.** The committed
  file had invalid YAML that produced zero-job runs; the trigger stays
  tag-scoped with a job-level `v*` gate as the second line, so a main push
  creates no run at all.

- `README.md` rewritten for the three-skill architecture, with a quickstart, the
  Registry description, the kit census, and the six gates. Its previous
  "two skills" and "2,699 components" figures were wrong and did not survive.
- **The census moves from 51 locked components to 52**, being 36 tier `core` and
  16 tier `conditional` with an empty pending list, of which 25 are skills and 7
  are hooks. The catalog recount moves from 2,736 to **2,737** records, 1,503
  of them skill records and 20 of them hook records. On disk `.opencode/skills/`
  holds 20 folders: 15 locked in-repo kit components, 3 top-level skills, and 5
  transplanted mechanisms still unlocked (`circuit-breaker-guard`,
  `github-release-packager`, `pre-mortem`, `preflight-system-doctor`,
  `session-context-primer`). The verification split is 12 `verified` and 40
  `unverified`. The 8-MCP cap and the 22 default-selected components are
  unchanged. This bullet supersedes the earlier unreleased 50-to-51 census
  bullet, which would otherwise leave two live figures in one unreleased section;
  the 49, 50 and 51 censuses stay on the record as superseded history, not
  rewritten, alongside the dated decision log in `docs/15-DECISIONS.md`.
- **The kit census moves from 52 locked components to 47, and the registry mirror is re-synced to it.** The lock drops its five `plugin` entries, reclassifies `typescript-lsp` from `plugin` to a new `lsp` kind with a verified `npm install -g typescript-language-server` command at pin 6.0.2, records real `npx -y` install commands with pins for the `filesystem`, `memory`, `sequential-thinking`, and `github` MCPs (all four now `verified`), and re-sources the four in-repo agents to `3mar-baha/vantrilex-arsenal`. The registry follows the lock without touching it: the four MCP sidecar rows now carry the locked commands, pins, and `verified` state with no other field changed; the `lsp` kind is scaffolded end to end exactly as `cli` was — catalog-schema enum, generator `KINDS`, `SECTION_KINDS`, `SECTION_LABELS`, `INDEX_DIRS`, and `SIDECAR_FILES`, a one-row `registry/data/lsp.jsonl` sidecar, an `LSP Servers` catalog section, and a generated `registry/lsp/_index.md` — and `registry/catalog.json` is regenerated to 2,739 records, 23 default-selected and 19 verified install commands from 7 sidecars. The five removed plugins stay in the catalog as unverified reference entries: the gate checks lock-to-catalog only, so extra rows are fine. The `typescript-lsp` plugin-sidecar row was removed (it now lives only in `lsp.jsonl`, ending a phantom double), and the dropped `code-review` and `commit-commands` rows were demoted from default-selected. `docs/09-KIT-LOCK.md` and `docs/01-OVERVIEW.md` carry the recounted census of 31 tier `core` plus 16 tier `conditional` with an empty pending list. This bullet supersedes the earlier unreleased 51-to-52 census bullet, which would otherwise leave two live figures in one unreleased section.
- Every current-state document now describes a three-skill orchestration layer —
  Prime (orientation), Vanguard (equip), Doctrine (work) — instead of two.
  Released history and the dated decision log in `docs/15-DECISIONS.md` are
  unchanged; a new decision entry records the move. The design-time arithmetic in
  the draft specs stays as written, because it records the original
  specification's own set.
- `scripts/verify-kit.mjs` now asserts all three top-level skills are locked, so
  `vantrilex-prime` cannot silently go missing from the lock. It also resolves
  every locked hook id against a function exported by the plugin file, so
  `task-dispatcher` cannot be locked without a `taskDispatcher` callback behind it.
- **Vanguard gained a Task dispatch section and its five dispatch scenarios.** The
  scout skill now owns one decision — which locked components are injected in
  which phase, read from the `phase` field of `kit/kit.lock` at dispatch time —
  and states the rules for each scenario: a continuation is a silent no-op,
  completed phases are immutable under a modification, and two lanes never share
  a phase-kit map. The `task-dispatcher` hook above announces a scenario and points
  there; it restates none of that procedure, and neither does
  `docs/16-TASK-DISPATCH.md`.
- **Preflight makes the `.env.example` check conditional.** The preflight
  configuration check now confirms `.env.example` only when the target project
  actually declares required environment variables, and reports the check SKIPPED
  rather than FAIL when it declares none. A project with no env vars previously
  failed a check that had nothing to check.
- **Tier-0 census re-ratified at 49 locked components.** The owner-authorized
  figure for `kit/kit.lock` is now **49 = 34 tier core + 15 tier conditional,
  0 pending**. The earlier 36-component figure was ratified 2026-10-04 and is
  superseded by the 13 conditional components added by the digest-candidate and
  parked-idea work: twelve in-repo conditional skills (`lenis`, `og-image`,
  `vantrilex-design-variations`,
  `open-graph-image`, `time-capsule-test`, `kit-evaluation-journal`, `red-team`,
  `skill-shadow`, `documentation-as-tests`, `kit-evolution-log`,
  `kill-switch-document`, `babel-bridge`), the in-repo `red-team` agent, and the
  upstream `a11y-audit` agent. All 13 are `tier conditional` and
  `verification unverified` with a null `install_cmd`, so none of them raises
  the Tier-0 core count. The 8-MCP cap is unchanged, and the decision to keep
  both conditional hooks stands. That figure was itself superseded by the census
  bullet above and is kept here as the record of what was ratified at that step.
- Every current-state documentation site that asserted 36 components was moved
  to 49 by this change, then to 51, and then to 52 by the census bullet above:
  `README.md`, `README.ar.md`, `AI_GUIDE.md`, `docs/00-INDEX.md`,
  `docs/01-OVERVIEW.md`, `docs/03-ARCHITECTURE.md`, `docs/04-VANGUARD.md`,
  `docs/06-REGISTRY-SCHEMA.md`, `docs/07-CATALOG-GENERATION.md`,
  `docs/08-VERIFICATION.md`, `docs/09-KIT-LOCK.md`,
  `docs/13-CONTRIBUTING-WORKFLOW.md`, and `docs/spec/VANTRILEX_SKILLS_SPEC.md`.
  Released changelog history and the decision log in `docs/15-DECISIONS.md` are
  left as written; the design-time arithmetic in
  `docs/spec/VANTRILEX_KIT_SPEC.md` stays as the original specification's own
  record. One site still carries a stale census and is owned elsewhere: the
  root-level `VANTRILEX_SKILLS_SPEC.md` names 49. It is untracked and
  gitignored by exact path, so the stale figure cannot be corrected by
  committing, and the decision log records that state at
  `docs/15-DECISIONS.md`.
- **This repository's documentation set moves from 16 files to 17.**
  `docs/16-TASK-DISPATCH.md` joins the numbered series and is registered in the
  `docs/00-INDEX.md` file map; the file count, the `00` through `16` numbering, and
  the doc pointers in `README.md`, `README.ar.md` and `AI_GUIDE.md` moved together.
  The 28-file target-project set Vanguard generates is a different series and is
  untouched.
- The kit-census labels inside the existing SVG tables under `docs/assets/tables/`
  were updated to the new figures — `docs/assets/tables/kit-census.svg`,
  `locked-contents.svg`, `ar-locked-contents.svg`, `catalog-records.svg`,
  `elements-role.svg`, `ar-elements-role.svg`, and
  `compare-with-without-arsenal.svg`. Only numeric and tier label text changed:
  no SVG was added, removed, resized, restyled, or re-laid-out, the provenance and
  honesty lines are intact, every figure carrying a `~` is untouched, and the
  four-value brand palette is unchanged.
- **`task-dispatcher` migrated to the OpenCode V2 plugin surface.** The hook now
  registers from the plugin module's `setup()` — the V2 contract the plugin file
  mirrors from `@opencode/plugin` 2.0.22 — against the session `prompt` hook, and
  appends its instruction to `event.prompt.text` instead of pushing a
  `{ type, text }` part onto V1's `output.parts`. Behaviour is unchanged: the
  same five scenarios, the same five-line instruction, the same
  `taskDispatcher.enabled` kill switch defaulting to `true`, and the same
  once-per-task semantics, because prompt admission is the same task boundary
  `chat.message` was. Two differences are deliberate: an empty prompt is not
  annotated, since there is no intent to classify from it, and the captured
  `lastIntent` is read before the rewrite so it stays the user's own words. The
  config root resolves from `ctx.location.directory` with the working directory
  as the fallback, reading `.opencode/arsenal.json`.
- **The other six hooks and the docs-discipline guard remain V1-only, and are
  inert under OpenCode V2.** They are still registered from the `server()`
  surface, which a V2 runtime never dispatches, so on V2 those seven callbacks do
  not fire at all. This is a deliberate, unfinished gap rather than a completed
  port: V2 has no equivalent of `experimental.chat.system.transform`, no
  `experimental.session.compacting`, and no mutable `tool.execute.*` output, so
  porting those guards means reworking what each one writes and how it reads a
  verdict — a separate concern, deliberately not bundled into the user-message
  migration. The module default-exports one object carrying both surfaces,
  because V2 reads `id` plus `setup()` and ignores `server()`, while OpenCode V1
  `>= 1.18.29` reads `server()` and ignores `setup()`.
- The kit census is unchanged by that migration: 52 locked components, 36 tier
  `core` plus 16 tier `conditional`, 0 pending, 7 of them hooks. A guard moving
  to a different runtime surface is not a new component.

### Fixed

- **Docs-discipline guard sees bash writes.** Shell file-write redirection
  previously bypassed the guard entirely; bash commands are now routed through
  the same verdict path as edit-tool writes for detectable cases (`>`, `>>`,
  heredoc, `tee` in command position). Residual interpreter/`dd` bypasses are
  documented in the code, not silently left.
- **Guard verdicts name the right file.** Verdicts are paired per-path before
  filtering, so multi-file calls with mixed allowed and denied files report the
  denied file instead of misindexing into the unfiltered list. Pinned by probe.
- **Session ids are sanitized before path construction.** Hostile ids cannot
  escape the state directory from either filesystem sink; `ses_*` ids pass
  through unchanged.
- **UNC and network roots resolve correctly**, and the root candidate is trimmed
  consistently instead of returning the untrimmed string.
- **Kill-switch parity on both surfaces.** V1 no longer records intent when the
  dispatcher is disabled, matching V2; the append target prefers the user-role
  text part with a safe fallback.
- **`tee` detection requires command position.** A first-pass detector matched
  the word anywhere (blocking prose mentions and `--grep=tee`); it now fires
  only when `tee` starts the command or follows a pipe, semicolon, `&`, paren,
  or newline. Known residual: `sudo tee` and path-qualified `tee` are still
  missed — recorded here rather than silently left.

- **Current-state docs now assert the 47-component census.** The lock cleanup
  moved 52 to 47 but only two docs followed; the README pair, eight numbered
  docs, and both census SVGs still said 52/36/2737. All fifteen stale lines now
  read 47 locked (31 core + 16 conditional), 2,739 catalog records, 19 verified
  commands, 23 default-selected, with the SVGs relabeled text-only and no
  re-layout. Note: the `github` MCP pin (`2025.4.8`) is marked deprecated
  upstream — the command is real and installs today, but it is recorded here so
  `verified` is not misread as "maintained".
- **The `typescript-lsp` phantom double is gone.** The row moved to the new
  `lsp` sidecar but its old plugin-sidecar row survived, so the catalog listed
  it twice; the plugin row is removed and the catalog recounts to 2,739. The
  dropped `code-review` and `commit-commands` plugin rows are demoted from
  default-selected, and the Vercel record prose now carries the pinned
  `add-mcp@2.4.1` command the sidecar verifies.

- **623 install commands pointed at a repository that contains no skills.**
  `VoltAgent/awesome-agent-skills` is an awesome list — a README of links with
  zero skill directories, so it can install nothing. That is 43% of the catalog's
  install commands naming a repo that cannot serve them. Resolving the twenty
  records this round set out to fix surfaced the real class: the display names
  were a symptom, the repo axis was the disease. All 623 now carry
  `install_cmd: null` with `verification: unverified`, the Rule B treatment the
  36 phantoms already used — an admission of ignorance rather than a command that
  looks right and installs the wrong thing. Every record's `origin` field is left
  untouched because it already names the true host repo, and repointing the 623
  there is a separate work order that needs 201 repositories proven one by one,
  not a guess folded in here. Three more records — `adversary-in-the-middle`,
  `phishing`, `structuring` — named skills absent from even their real upstream
  repository and were nulled on the same rule. Verified by field-level comparison
  against HEAD: 1503 records in and 1503 out, zero fields touched except
  `install_cmd`, 823 install commands remaining and every one of them canonical.

- **36 catalog records named skills that do not exist upstream.** Each carried a
  multi-word, unquoted `--skill` value, so the shell split it and the command
  installed something other than what it named — a direct instance of the
  failure mode `SECURITY.md` names as the top threat in this repo. Checking the
  upstream repository settled it: it publishes 818 skill directories, and *none*
  of the 36 ids is among them, nor does anything resembling a rename of them.
  These were phantom rows, not malformed commands, so quoting the name would not
  have fixed them — a quoted name still resolves to nothing. All 36 now carry
  `install_cmd: null` with `verification: unverified`, which is the honest state:
  an admission of ignorance rather than a command that looks right and is not.
  Only `install_cmd` was touched; `id`, `origin`, `verification`, and `tags` are
  unchanged. All 1,449 remaining skill commands now match the shape the kit
  verifier enforces.

- **`kit/kit.lock` pointed `firecrawl` at a repository that does not exist.** The
  entry carried `source: firecrawl/firecrawl-mcp` and `verification: verified`
  together. `git ls-remote` returns *Repository not found* for that path, so a
  verified entry asserted provenance on a dead repo — the exact
  plausible-looking-wrong-command failure this repo exists to prevent. The npm
  metadata for the pinned `firecrawl-mcp@3.27.3` names
  `firecrawl/firecrawl-mcp-server` as its repository, that path resolves, and the
  lock now says so. `install_cmd`, pin, phase, tier, and verification are
  unchanged; only `source` moved.

- **Four locked agents recorded no provenance at all.** `architect`,
  `code-reviewer`, `ai-generated-code-security-auditor`, and `technical-writer`
  carried `source: null` while the registry sidecar already held the upstream
  origin for each — `worldflowai/everything-claude-code` and
  `msitarzewski/agency-agents`. Both resolve. The lock now carries what the
  registry already knew instead of discarding it.

---

## [0.2.0] — 2026-10-04

### Added

- **Vantrilex Registry v2.** Catalog schema, generator, and verifier under `scripts/`,
  with per-kind JSONL sidecars under `registry/data/`. The catalog now carries a real
  `install_cmd`, a `when_to_use` trigger, a lifecycle `phase`, a `tier`, and a
  `verification` state for every component.
- `registry/catalog.json`, a generated machine mirror of the catalog for selection agents.
- `registry/data/overlaps.yaml` — 20 overlap groups covering `supersedes` and
  `pairs_with` relations, so a selection agent never installs two components that
  fight each other.
- **A new `formatting` kind.** Twelve design-system reference documents vendored from
  `voltagent/awesome-design-md` (MIT), curated as a Tier-1 conditional kit for UI-heavy
  projects. A project adopts exactly one; see `registry/formatting/ATTRIBUTION.md`.
- **Verified install commands.** 12 components carry commands verified against a real
  registry, including `npx -y @upstash/context7-mcp` (4.1.1) and
  `npx -y firecrawl-mcp` (3.27.3). The 1,475 remaining commands are mechanically derived
  from their source repository and are explicitly marked `unverified` rather than
  presented as checked.
- **Four transplanted mechanism skills in OpenCode format** (on main via Round 2a):
  `circuit-breaker-guard` (3-strike halt plus Diagnostic Incident Report),
  `preflight-system-doctor` (Node-only PASS/FAIL/SKIPPED gate, build phase step 0),
  `session-context-primer` (CONTEXT ANCHOR, read-only, ~10s budget),
  `github-release-packager` (Clean Code / Test / Docs guards, semver, annotated tag,
  `gh release`, fresh-clone verify).
- **Vantrilex Vanguard scout skill** (merged to main): six-step procedure
  (preflight, four-state detection, Arabic chatbot-relay prompt, source surveying,
  five-step selection, install-plus-verify-plus-report), the 28-file documentation
  contract with its 8-folder grouping, and per-kind verification protocols.
- **Vantrilex Doctrine law skill** (merged to main): seven constitutional
  laws, Leader/Guide/Implementer decision rights with escalation ladder, mandatory
  phase map, five workflows with the three second-pass guards given substance, three
  session rituals, and §33B parallelism mechanics.
- **Arsenal plugin `.opencode/plugin/arsenal.ts`** (on main via Round 2a): the six
  logical Tier-0 hooks as plugin callbacks (session-start, pre-compact, session-end,
  platform-neutral long-running-process guard, conditional TypeScript check,
  conditional Prettier format) plus a docs-discipline guard; four operator commands
  (`doctor`, `equip`, `prime`, `release`).
- **Leader, Guide and Implementer role agents** (on main via Round 2a) with decision
  rights, deny-edit permissions on Leader/Guide, and scoped bash on Implementer.
- **Worktree orchestration** (on main via Round 2a): seven adapted shell scripts, two
  git hooks, and rebuilt CI (registry verifiers plus shellcheck plus tsc) and release
  workflows.
- **`kit/kit.lock`** (merged to main): 36 pinned Tier-0 entries with an empty pending
  list, its JSON schema, and `scripts/verify-kit.mjs` (11 per-kind checks).
- **`scripts/verify-skills.mjs`** (merged to main): 10 skill-format
  checks including the mechanism single-home rule and the phase-map cross-check.
- **The 16-file Arsenal documentation set under `docs/`** (merged to main).
- **Four kit skills registered in the catalog** (merged to main):
  Vanguard and Doctrine as Tier-0 default-selected, session-context-primer and
  preflight-system-doctor as conditional; the catalog now carries 2,719 records with
  22 default-selected.
- **Fifteen components registered and thirteen locked**, taking the catalog to
  **2,734 records with 22 default-selected**: twelve in-repo skills (`lenis`,
  `og-image`, `open-graph-image`, `pre-mortem`, `time-capsule-test`,
  `kit-evaluation-journal`, `red-team`, `skill-shadow`, `documentation-as-tests`,
  `kit-evolution-log`, `kill-switch-document`, `babel-bridge`), the in-repo
  `red-team` agent, the upstream `a11y-audit` agent (`rksekar5/a11y-audit`, MIT,
  1 star, last push 2026-06-01 — a young project, so its findings are recorded
  unverified), and the `lenis-mcp-server` MCP. Every new record is `tier
  conditional` and `verification unverified` with a null `install_cmd`; none is
  default-selected, and the Tier-0 core count stays at 34. `lenis-mcp-server` is
  recorded unverified because **no such package is published on npm as of
  2026-10-04** (`lenis-mcp-server`, `@lenis/mcp-server`, `lenis-mcp`,
  `mcp-server-lenis` and `lenis-mcp-servers` all return E404), so it carries no
  invented install command and is deliberately absent from `kit.lock`. The
  in-repo `pre-mortem` is catalogued under the derived id `pre-mortem-row-1493`
  because row 1168 already holds the `pre-mortem` slug, and it is likewise not
  locked: its catalog id matches no `.opencode/skills/` folder, so a lock entry
  naming it would be a pin to nothing.

  Round 2a (mechanism skills, plugin, roles, orchestration) is on main, as is every
  other Round-2 entry above.

### Changed

- Catalog reconciled with the authoritative Tier-0 set: `github` promoted to
  default-selected, `context7` and `firecrawl` added as MCP servers, and the catalog
  recounted to **2,715 components with 20 default-selected**.
- Skill phases and tiers corrected against the Doctrine phase map. Four were wrong
  (`ask-matt`, `find-skills`, `skill-creator`, `ponytail-audit`) and `ponytail-audit`
  was `conditional` rather than `core`.
- Ids are now disambiguated deterministically when two rows in a kind slugify
  identically — the first keeps the plain slug, later collisions take a `-row-<N>`
  suffix. This separates `Code Reviewer` (row 47) from `code-reviewer` (row 48).
- Catalog sidecar corrections (merged to main): the `github`
  default-selected flag set true (markdown said selected, sidecar said false),
  `ponytail-debt` phase set to operate per the mandatory phase map, and ten Tier-0
  skill phases/tiers corrected to that map with on-demand admitted as a phase.
- The Doctrine session-start ritual now delegates anchor mechanics to
  session-context-primer instead of duplicating its template (single-home rule).
- **Tier-0 census note (RATIFIED AT 49):** The owner-authorized figure is 49 locked components = 34 tier core + 15 tier conditional, 0 pending. The earlier 36-component figure (32 core records + 2 conditional hooks + the 2 kit skills) was ratified 2026-10-04 and is superseded by the 13 conditional components added by the digest-candidate and parked-idea work — twelve in-repo conditional skills plus the in-repo `red-team` agent and the upstream `a11y-audit` agent, each `tier conditional` and `verification unverified` with a null `install_cmd`, so the Tier-0 core count is unchanged. The two conditional hooks (typescript-check-after-editing-ts-tsx-files, auto-format-js-ts-files-with-prettier-after-edits) remain KEPT: they are part of the six hooks per kit spec §2.4 and explicitly conditional, and removing them would lose function. No component was changed to resolve either count.

### Fixed

- **Seven malformed UTF-8 sequences repaired** in the catalog. Each truncated
  description cell was recovered from its per-item registry card using the catalog's own
  truncation rule, which 1,383 clean rows already follow. The kit specification had
  guessed these were truncated ellipses or arrows; the cards show they were em dashes
  and one arrow.
- The generator resolved sidecars as `<kind>.jsonl` while the files are plural, so all
  2,702 enrichment records were being silently discarded. Sidecar filenames are now
  mapped explicitly.
- The orphan-reference checker recognised only an `overlaps:` root key and did not
  unquote scalars, so it read 60 overlap entries and resolved none of them. It now reads
  `supersedes:` and `pairs_with:` and resolves all 48 id references.
- The generator rejected the new `formatting` section as an unknown heading.
- Generator `--markdown` is now idempotent (merged to main): it was
  re-sorting rows case-sensitively and rewriting Install cells, producing output its
  own parser rejected.
- Generator `--indexes` now writes the plural kind directories and preserves
  the hand-authored formatting index instead of overwriting it.
- The seven malformed UTF-8 sequences repaired in the catalog were already released
  in Round 1 (see the entry above); referenced here for traceability, not re-claimed.
- Leader/Guide agent files: removed the inert `write: deny` permission keys
  (`edit: deny` is the real control).

---

## [0.1.0] — 2026-10-04

### Added

- Repository foundation: MIT license (© 2026 3mar-baha), `.editorconfig`,
  `.gitattributes`, `.gitignore`, and `.markdownlint.jsonc`.
- `AGENTS.md` defining the repository's hard rules, the skill-file format standard,
  and the verification protocol each change must pass.
- `README.md` describing the two-skill model (Vanguard selects and equips, Doctrine
  governs), the Registry, the 36-component Tier-0 kit, and the Node-only toolchain.
- `CONTRIBUTING.md` and `SECURITY.md`.

### Notes

- Registry v2 (schema, generator, verifier, per-kind sidecars) and the Tier-0 kit are
  in progress and are tracked under `[Unreleased]`.

[Unreleased]: https://github.com/3mar-baha/vantrilex-arsenal/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.7.0
[0.6.5]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.6.5
[0.6.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.6.0
[0.5.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.5.0
[0.4.1]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.4.1
[0.4.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.4.0
[0.3.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.3.0
[0.2.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.2.0
[0.1.0]: https://github.com/3mar-baha/vantrilex-arsenal/compare/v0.1.0...v0.2.0
