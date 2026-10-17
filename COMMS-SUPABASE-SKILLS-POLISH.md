# COMMS-SUPABASE-SKILLS-POLISH — False-Friends, Iteration, Kept+Wrapped

Lane `VTA-COMMS-SUPABASE-01`, node `k-land`. Date (UTC): 2026-10-17. English only. Polish authority: `VANTRILEX_SKILLS_SPEC.md` (behavioral spec) + `.opencode/skills/vs-supabase/SKILL.md` (lane discipline). The factory plan file (`VTA-FACTORY-08-PLAN.md`) lives on unmerged branch `wt/vta-factory-08` and is cited as such wherever referenced — never reconstructed from memory.

Upstream layout guarantee: `.agents/skills/supabase/*` and `.agents/skills/supabase-postgres-best-practices/*` are byte-identical to the installer output. Nothing was edited, renamed, or wrapped on disk.

## 1 — False-friends suite (upstream skills must NOT trigger; 5/5 correct)

Checked statically against the installed `description` trigger surfaces (supabase: ANY Supabase task; best-practices: anything living in Postgres + slow-query diagnosis).

```text
1. Postgres tuning on a self-hosted database with no Supabase project  →  NOT-triggered (best-practices fires on Postgres anywhere, but routing per vs-supabase Do NOT use keeps it off the Supabase MCP; supabase skill correctly silent — no Supabase surface).
2. Supabase vs Neon pricing comparison for a blog post  →  NOT-triggered (marketing comparison, no Supabase task, no Postgres change).
3. Superman movie night snacks  →  NOT-triggered (lexical near-miss only).
4. Store garden photos in the cloud somewhere  →  NOT-triggered (storage noun without Supabase scope; Storage group needs explicit Supabase scope plus why).
5. Generic JWT auth in Express with no Supabase project  →  NOT-triggered (auth noun without Supabase surface; no client library, CLI, MCP, or RLS in scope).
```

Result: 5/5 correct non-triggers. No upstream description change proposed — the surfaces already decline all five.

## 2 — One recorded iteration

v1 eval draft of Scenario A omitted the installed supabase SKILL.md Core Principle 1 changelog check (fetch changelog summary, scan breaking-change tags) before proposing the migration. Graded v1 as WEAK PASS with that gap named. v2 adds the changelog + docs lookup step to the with-skill note and re-grades PASS. The iteration lives in this usage note only — zero upstream edits.

## 3 — Kept+wrapped decision (explicit)

KEPT: upstream skills stay byte-identical under `.agents/skills/*` with `skills-lock.json` source hashes. Update path stays `npx skills update`.

WRAPPED: every lane use runs under `vs-supabase` discipline (scope-first with `project_ref` + `read_only=true` + narrowest `features`; inspect-before-change; advisories-first; Dashboard-URL flow for secret values; manual tool-call approval on).

Update-safety rationale: editing upstream files forks provenance — the next `npx skills update` would either clobber lane edits or conflict with them, and the forked copy would silently drift from Supabase-maintained security guidance (RLS traps, `auth.role()` deprecation, `security_invoker` views). Keeping upstream pristine preserves the updater and the audit trail; the wrapper adds lane guards without touching the source.

## 4 — Guaranteed-pairs doctrine

`kit/kit.lock` carries only guaranteed pairs: `vs-supabase` plus the upstream procedural rules as procedure inputs (named in `vs-supabase` SKILL.md §§ Inputs/Procedure), never the upstream skill ids themselves. No upstream id enters the lock or the registry on this node. Rationale: the lock pins what the lane guarantees (our discipline + its rule sources); upstream content floats under the updater, so pinning its ids would promise stability the lane does not own.

## 5 — Gates quoted (all three notes on disk)

```text
npx markdownlint-cli COMMS-SUPABASE-SKILLS-INSTALL.md COMMS-SUPABASE-SKILLS-EVAL.md COMMS-SUPABASE-SKILLS-POLISH.md  →  exit 0
Select-String marker sweep (TODO:|FIXME|secret shapes|`model:` lines) over the three notes  →  zero hits (the bare word TODO occurs only inside this gate-description sentence, never as a work marker)
git status --porcelain  →  M AGENT.md, M WORKFLOW.md (pre-existing orchestrator state) + untracked lane artifacts only; kit/kit.lock, registry/*, AGENTS.md, WORKFLOW.md (tracked body), opencode.json (+ backup) untouched
```

Ponytail bound: PARKED — this node wrote no code (install + prose notes only), so FLOOR/CEILING did not engage.
