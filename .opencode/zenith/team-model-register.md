# Team-Model Register

Zenith team-model register. Live board refreshed at every session anchor.
A register older than the current session anchor is stale, and a stale
register means the lead is blind: stop, refresh, then proceed.

- Anchor: w5-model-menu-2026-11-07
- Refreshed: 2026-11-07
- Verification behind the dates: measured live on this host on
  2026-11-07 at branch `wt/v2-consolidation`, HEAD
  `264d3ff298cf4a0e95026061ef0c8cce35677413` (0.9.78). Seat inventory
  from `git ls-files .opencode/agents` and live reads of each frontmatter.
  Free-list from `opencode models` (454 rows) on this host. Pin sweep
  `Select-String -Path .opencode\agents\*.md -Pattern '^\s*model\s*:'`

## Refresh rule

Refresh triggers at the session-start anchor, the first anchor block of
every session. Procedure: reload all six fields below from live state, set
`Anchor` to the current anchor id, set `Refreshed` to today in
`YYYY-MM-DD` form, and append one line to
`.opencode/zenith/refresh-log.md`. The refresh is demonstrated, never
asserted: the gate harness runs the procedure on a copy and shows all six
fields updated.

## Model-selection rule (owner ruling 5)

> Models stay DEFAULT (no pins). The user chooses the model per session,
> freely. Do not pin models.

- Agent seat files carry no `model:` key. The session runs whatever model
  the user selected at pick time. If the host offers no picker, the host's
  default model runs and the hook records `model: unknown (host default)`
  rather than a guessed id.
- Craft picker seats (`.opencode/craft/seats/`, `.opencode/zenith/seats/`)
  state "seat default and owner-overridable at pick time". That default is
  an overridable suggestion, not a pin: overriding it at pick time is the
  rule working, not a violation. This node adds no `model:` key anywhere.
- A model name appearing in prose (for example "No `model:` key appears
  in this file") is documentation about the absence of a pin, not a pin.
- Paid, non-free, or unverified models are never listed as approved for a
  seat. The only approved set per seat is the verified free list below.

## Seat-season coverage

Team-model coverage counts every tracked agent seat file under
`.opencode/agents/`.

- `AGENT.md` current state at `AGENT.md:26` records "Agents: 29 files under .opencode/agents/"; the "Agents: 28 files under .opencode/agents/" string is the historical task-log entry at `AGENT.md:118`.
- `git ls-files .opencode/agents` on 2026-11-07 returns 29 tracked files:
  the 28 recorded plus `.opencode/agents/vantrilex.md`, the primary
  Zenith seat. Coverage below is 29/29, so the brief's 28/28 acceptance
  holds with the extra primary listed rather than hidden.
- Voice for the table: `Seat` is the `name:` stem the dispatcher routes by;
  `Mode` is the frontmatter `mode:`; `Pin` reports the measured
  `model:`-key sweep (0 hits — all pass); `Free tier` names the provider
  pool every row may pick from and is identical on every row by the rule
  above.

| Seat file | Seat (name) | Mode | Pin | Free tier |
|---|---|---|---|---|
| `.opencode/agents/aether.md` | aether | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/blazar.md` | blazar | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/pulsar.md` | pulsar | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-agent-maker.md` | vantrilex-agent-maker | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-architect.md` | vantrilex-architect | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-code-reviewer.md` | vantrilex-code-reviewer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-facet.md` | vantrilex-facet | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-fixer.md` | vantrilex-fixer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-github.md` | vantrilex-github | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-guide.md` | vantrilex-guide | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-harness.md` | vantrilex-harness | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-implementer.md` | vantrilex-implementer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-kit-maintainer.md` | vantrilex-kit-maintainer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-leader.md` | vantrilex-leader | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-librarian.md` | vantrilex-librarian | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-puller.md` | vantrilex-puller | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-python.md` | vantrilex-python | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-red-team.md` | vantrilex-red-team | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-releaser.md` | vantrilex-releaser | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-reviewer.md` | vantrilex-reviewer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-scout.md` | vantrilex-scout | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-scribe.md` | vantrilex-scribe | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-security-auditor.md` | vantrilex-security-auditor | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-typescript.md` | vantrilex-typescript | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-ui-designer.md` | vantrilex-ui-designer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-uploader.md` | vantrilex-uploader | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-ux-designer.md` | vantrilex-ux-designer | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex-verifier.md` | vantrilex-verifier | subagent | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |
| `.opencode/agents/vantrilex.md` | vantrilex (Zenith, primary) | primary | none (0 hits) | opencode / opencode-go + openrouter free pool, user picks per session |

- Picking a seat picks only the seat's permissions, skill allow-list, and
  capabilities. The model is chosen by the user in the picker per session;
  a seat never forces one.
- Picker seats are not agent seats and are listed separately so their
  overridable "Model:" suggestions are not mistaken for pins:

| Picker seat | Suggested default (overridable at pick time) | Variables carried on selection |
|---|---|---|
| `.opencode/craft/seats/aether-seat.md` | muse-spark-1.3-contributor via opencode-go, free tier | plan-depth, source-breadth, assumption-cap, t12-scope, evidence-ledger, stop-note |
| `.opencode/craft/seats/blazar-seat.md` | muse-spark-1.3-contributor via opencode-go, free tier | wave-budget, dispatch-width, verify-depth, anchor-cadence, tool-surface, accept-note |
| `.opencode/craft/seats/pulsar-seat.md` | muse-spark-1.3-contributor via opencode-go, free tier | probe-budget, hypothesis-cap, cheapest-first, capsule-shape, read-only-scope, stop-note |
| `.opencode/zenith/seats/zenith-seat-a.md` | muse-spark-1.3-contributor via opencode-go, free tier | depth, lane-scope, anchor-cadence, refresh-scope, arbitration, tool-surface |
| `.opencode/zenith/seats/zenith-seat-b.md` | muse-spark-1.3-contributor via opencode-go, free tier | depth, lane-scope, anchor-cadence, refresh-scope, arbitration, tool-surface |
| `.opencode/zenith/seats/zenith-seat-c.md` | muse-spark-1.3-contributor via opencode-go, free tier | depth, lane-scope, anchor-cadence, refresh-scope, arbitration, tool-surface |

## Verified free list (2026-11-07)

Verified by `opencode models` on this host (454 rows). A row is verified
free only when its id carries an explicit free marker: `*-free`,
`*-contributor`, or `:free`. Everything else is conservatively
`unverified` — never listed as approved for a seat.

OpenCode / OpenCode-Go free pool (15):

- opencode-go/beam-free, opencode-go/crouton-alpha-free,
  opencode-go/iceman-contributor-free,
  opencode-go/muse-spark-1.2-contributor,
  opencode-go/muse-spark-1.3-contributor
- opencode/beam-free, opencode/crouton-alpha-free,
  opencode/deepseek-v4.1-flash-free, opencode/flint-40b-free,
  opencode/glm-5.3-flash-free, opencode/iceman-free,
  opencode/inkling-2-small-free, opencode/mimo-v2.6-flash-free,
  opencode/nemotron-3.5-lightning-free,
  opencode/nemotron-3.5-super-vl-free

OpenRouter free pool (14) plus tokenrouter (1):

- openrouter/cohere/north-mini-code:free,
  openrouter/google/gemma-4-26b-a4b-it:free,
  openrouter/google/gemma-4-31b-it:free,
  openrouter/liquid/lfm-2.5-2.6b:free, openrouter/liquid/lfm-3-1.7b:free,
  openrouter/meta/muse-spark-1.2-contributor,
  openrouter/meta/muse-spark-1.3-contributor,
  openrouter/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free,
  openrouter/nvidia/nemotron-3-ultra-550b-a55b:free,
  openrouter/nvidia/nemotron-3.5-lightning:free,
  openrouter/nvidia/nemotron-3.5-super-vl:free,
  openrouter/openrouter/free, openrouter/recursive/flint-v1.0:free,
  openrouter/xingchen-agi/xing4.0-29b-a4b:free
- tokenrouter/z-ai/glm-5.3-free

Per V2 `setup()` observation on 2026-11-07 (`ctx.storage` available;
`ctx.model.hook`, `ctx.permission.hook` absent on this host), a seat may
only pick from this list with the host's affordance; a seat with no picker
runs the host default and the hook records `unknown (host default)`.
Listings without a free marker are unverified and excluded, whatever the
provider row claims.

## Recording hook

A guard-style hook records what the user picked. It never selects: when
no model value is observable, it writes `unknown (host default)` rather
than guessing.

- Surface (V1): `chat.message` carries
  `model?: { providerID: string; modelID: string }` and `agent?: string`.
  The handler extracts and records them.
- Surface (V2): the `prompt` event carries no model (mirrored type has
  `sessionID` + `prompt.text` only). The hook does not invent one: under
  V2 the record stays the last V1-observed value, or
  `unknown (host default)`. A future `ctx.model.hook` would close this
  gap; today it is reported SKIPPED, never PASS.
- Destination: `<stateDir>/model-choices/<sanitized-session>.md`, one
  entry per observation (`date, session, agent, provider, model,
  note`). `stateDir` is ignored cache/temp — the plugin's resolved
  `VANTRILEX_STATE_DIR` / `node_modules/.cache/vantrilex-arsenal` /
  OS temp — with `.opencode/state` as the in-tree fallback.
- Behaviour: pure helpers `modelChoiceFrom` / `formatModelChoice` /
  `recordModelChoice` (testable without a host) plus the `chat.message`
  wiring. Deterministic, dependency-free, best-effort: filesystem
  failures only log, never throw; the kill switch disarms before any
  record is written; a state-dir construction that already exists for
  `latest-session.md` is reused, not duplicated. Writes stay inside the
  state directory (project law).
- Verification (verification command): `node scripts/probe-model-record.mjs`
  drives the pure helpers with valid and invalid inputs (extraction,
  unknown-fallback, no-pin invariant) and with a temp state-dir fixture
  that an entry is actually written per observation, exiting 0 only when
  all hold. The doc-checker run for this file is the `markdownlint-cli`
  pinned invocation `npx --yes markdownlint-cli <file>`.

## 1. Live directives

Directives in force as of this anchor.

- Owner ruling 5 (2026-11-07): models default, no pins, user picks per
  session. Enforced by the zero-hit pin sweep above, not by trust.
- LD-02 Zenith control skills build on branch `wt/0.9.2-zenith-control`.
- V3 slot 0.9.2 treatment at
  `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3224`, carried as data.
- Fallback FBLD-02: carry both verbatim, install nothing, never resolved
  here. Registration parked with the owner; zero registry, catalog, or
  lock writes by build nodes.

## 2. Live load

Load Zenith carries as of this anchor.

- Live load: wave 1 of 9, node b092-build, concern LD-02 single atomic commit.
- Open lanes: none observed beyond this build node; arbitration queue
  empty, so no contention is scheduled against this load.

## 3. Equipment baselines

Pinned observations, re-taken at every refresh.

- Runtime Node v25.0.0, standard library only, zero dependencies added.
- Gate binaries observed on this seat: `node --check`, `markdownlint-cli`
  0.50.0 via the local runner, `git`, and
  `scripts/verify-skills.mjs` with its `--root` flag for worktrees.
- Skill equipment: `vs-zenith-team-control` plus `vs-zenith-refresh-guard`, both
  read back from disk after landing, both format-gated.

## 4. Failure log

Every failure remembered, so no plan repeats one.

- No open failures at seed time. Simulated-anchor and guard runs are
  recorded in `.opencode/zenith/refresh-log.md` with their exact outcomes.
- Standing entry: a silent absorption stays open here until the weekly T14
  review writes its absorb-or-rule decision.

## 5. Arbitration queue

Pending contentions and their owners.

- Empty at seed time. New contention enters here with its owner and its
  trigger before any lead decision touches it.

## 6. Tier-granted inventory

Stock granted per tier, spent only by authority.

- Tier 0 baseline: local skills, local records, gate scripts. No installs
  performed, no install command shipped, no network fetch run by this
  node. Anything beyond Tier 0 needs a separate explicit owner sign-off
  naming the rows accepted with their evidence.
