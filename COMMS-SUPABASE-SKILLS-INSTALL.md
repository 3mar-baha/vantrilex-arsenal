# COMMS-SUPABASE-SKILLS-INSTALL — Upstream Agent-Skills Install Evidence

Lane `VTA-COMMS-SUPABASE-01`, node `k-land` (wave 5 close). Date (UTC): 2026-10-17. Seat: `vantrilex-github` worker. English only per `AGENTS.md` hard rule 5.

Deviation recorded: the scribe `k-skills` landing plan proposed EN+AR mirrors. Shipped ENGLISH-ONLY: hard rule 5 overrides the scribe plan, per prior-lanes precedent (recorded here, not silently dropped).

Live Supabase: zero MCP calls on this node. OAuth-gated probes stay `unverified`. No tokens or secrets entered the repo.

## 1 — Install-path guard (ran first, quoted)

Guard rule: run `npx skills add supabase/agent-skills` ONLY if its target avoids tracked kit dirs (`.opencode/skills/*`, `kit/`, `registry/*`).

```text
git status --porcelain  →  exit 0
 M AGENT.md
 M WORKFLOW.md
?? COMMS-SUPABASE-BUS.md
?? COMMS-SUPABASE-DASHBOARD.md
?? COMMS-SUPABASE-SCHEMA.sql
?? COMMS-SUPABASE-WATCHERS.md
?? docs/comms-hub-01-escalation.capsule.json
```

Pre-install probes (all exit quoted):

```text
Get-ChildItem .opencode/skills  →  26 folders incl. vs-supabase (tracked kit dir)
git ls-files .opencode/skills/vs-supabase/  →  exit 0 (tracked: EVALS.md, SKILL.md)
git check-ignore -v .opencode/skills/supabase/SKILL.md  →  exit 1 (NOT ignored — forbidden target)
git check-ignore -v skills/supabase/SKILL.md  →  exit 0 (.gitignore:21:/skills/ — ignored, safe shape)
npx skills add supabase/agent-skills -l  →  exit 0 (2 skills listed, nothing written)
gh auth status  →  exit 0 (3mar-baha, scopes gist/read:org/repo/workflow)
node --version  →  v25.0.0, exit 0; npx --version  →  11.6.2, exit 0
```

## 2 — Install (exact command, quoted)

```text
npx skills add supabase/agent-skills  →  EXIT:0
Agent detected (opencode) — non-interactive install, 2 skills, Installation complete.
```

Installed paths as the installer left them (untouched afterwards):

```text
.\.agents\skills\supabase
.\.agents\skills\supabase-postgres-best-practices
skills-lock.json (root, installer-written lock of source hashes)
```

Installed tree verified by `Get-ChildItem -Recurse .agents/skills` (supabase: SKILL.md, CHANGELOG.md, assets/, references/; best-practices: SKILL.md, CHANGELOG.md, references/ with 30+ rule files).

Guard verdict: PASS. Target `.agents/skills/*` is outside every tracked kit dir (`.opencode/skills/*`, `kit/`, `registry/*`). Post-install `git status --porcelain` shows `?? .agents/` and `?? skills-lock.json` only — zero tracked files modified by the install.

## 3 — Version and commit observed (actual, never transcribed)

The installer printed no commit SHA. Recorded as not-observed, not filled from memory.

```text
supabase CHANGELOG.md head: [0.1.9] (2026-09-28); SKILL.md frontmatter version: "0.1.2"
supabase-postgres-best-practices CHANGELOG.md head: [1.6.0] (2026-07-30); SKILL.md frontmatter version: "1.1.1"
skills-lock.json: source supabase/agent-skills (github) + computedHash per skill (hashes quoted in §2 source file)
Upstream HEAD c9be0e9 (2026-10-02): prior U-bundle observation (SUPABASE-U-understand.md §2, read live 2026-10-17) — cited as reference, NOT transcribed as this install's proof.
```

Frontmatter/CHANGELOG version skew (0.1.2 vs 0.1.9) is reported as observed, not reconciled.

## 4 — Standing files untouched by this node

This node wrote no commits and modified no tracked files. `M AGENT.md` / `M WORKFLOW.md` are orchestrator state predating the node. `kit/kit.lock`, `registry/*`, `AGENTS.md`, `WORKFLOW.md`, `opencode.json` (+ backup) untouched — full `git status` proof in the gate section of the eval companion note.
