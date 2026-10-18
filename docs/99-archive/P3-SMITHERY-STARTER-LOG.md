# P3 Smithery Starter Log

- Lane: `VTA-FACTORY-EXECUTE`, phase P3, wave 0, node `p3-smithery`.
- Owner: `vantrilex-implementer`.
- Date (UTC): 2026-10-17.
- Branch: `wt/vta-factory-p0`, main worktree only.
- Artifacts: `.opencode/skills/vs-smithery/SKILL.md` plus this file at `P3-SMITHERY-STARTER-LOG.md`.
- Scope: teaching plus logging only. No installs executed, no lock writes, no registry writes, no commit, no push, no tag.

## Grounding

Command facts in the companion skill are grounded in the R2 bundle smithery section read live via `git show wt/vta-factory-08:VTA-FACTORY-08-R2-method.md` section 4, read-only. The bundle endorses package `smithery` at version `1.2.0` verified via `https://registry.npmjs.org/smithery/latest`, install `npm install -g smithery@latest` requiring Node.js 20 plus per `https://smithery.ai/docs/concepts/cli`, homepage shapes at `https://smithery.ai/`, and source repository at `https://github.com/smithery-ai/cli`. Search shapes are `smithery mcp search "github"` and `smithery skill search "code review"`; vet shapes are `smithery tool list`, `smithery tool find`, and `smithery tool get <connection> <tool>`; add shapes are `smithery mcp add <url> --client <name>` and `smithery skill add <skill> --agent <name>`; auth gate is `smithery auth login` with `smithery auth whoami`. The bundle Important Notes state authentication is required for some operations and the client must restart after adding or removing servers. The `--json` flag and the `npx @smithery/cli` spelling are both `unverified` against section 4.1 and are never used as verified. Nothing in this log was installed, and no install string below is claimed verified.

## Starter set discipline

Starter candidates mirror the 20 MCP proposals by reference only. Full proposal objects live in `P3-MCP-A.json` and `P3-MCP-B.json` and are not repeated here. Each entry below carries candidate plus vet verdict plus admit-or-hold. Bulk admissions equal zero. Every entry in this log is `HOLD`; zero entries advance to admission from this lane.

## Starter entries A, refs `P3-MCP-A.json`

### A01 github

- Candidate: `github`, ref `P3-MCP-A.json` entry `github`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A02 neon

- Candidate: `neon`, ref `P3-MCP-A.json` entry `neon`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A03 supabase

- Candidate: `supabase`, ref `P3-MCP-A.json` entry `supabase`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A04 vercel

- Candidate: `vercel`, ref `P3-MCP-A.json` entry `vercel`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A05 cloudflare

- Candidate: `cloudflare`, ref `P3-MCP-A.json` entry `cloudflare`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A06 browserbase

- Candidate: `browserbase`, ref `P3-MCP-A.json` entry `browserbase`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A07 brave

- Candidate: `brave`, ref `P3-MCP-A.json` entry `brave`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A08 exa

- Candidate: `exa`, ref `P3-MCP-A.json` entry `exa`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A09 steadyfetch

- Candidate: `steadyfetch`, ref `P3-MCP-A.json` entry `steadyfetch`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### A10 context7-mcp

- Candidate: `context7-mcp`, ref `P3-MCP-A.json` entry `context7-mcp`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

## Starter entries B, refs `P3-MCP-B.json`

### B11 googledrive

- Candidate: `googledrive`, ref `P3-MCP-B.json` entry `googledrive`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B12 notion

- Candidate: `notion`, ref `P3-MCP-B.json` entry `notion`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B13 deepwiki

- Candidate: `deepwiki`, ref `P3-MCP-B.json` entry `deepwiki`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B14 mem0-memory-mcp

- Candidate: `mem0-memory-mcp`, ref `P3-MCP-B.json` entry `mem0-memory-mcp`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B15 reference-sequential

- Candidate: `reference-sequential`, ref `P3-MCP-B.json` entry `reference-sequential`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B16 slack

- Candidate: `slack`, ref `P3-MCP-B.json` entry `slack`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B17 discord

- Candidate: `discord`, ref `P3-MCP-B.json` entry `discord`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B18 gmail

- Candidate: `gmail`, ref `P3-MCP-B.json` entry `gmail`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B19 stripe

- Candidate: `stripe`, ref `P3-MCP-B.json` entry `stripe`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

### B20 figma-context-mcp

- Candidate: `figma-context-mcp`, ref `P3-MCP-B.json` entry `figma-context-mcp`. Role and counts live in that file and are not repeated here.
- Vet verdict: `HOLD`, reason proposal-only starter log with no live SCAN-FIRST run and no install executed from this lane.
- Admit/Hold: HOLD.

## Bulk count

- Per-item HOLD entries: 20.
- Per-item ADMIT entries: 0.
- Bulk admissions: 0.

## Gates

Commands below ran in the main worktree on `wt/vta-factory-p0` after the final edit. Required marks are markdownlint exit 0, stem check name equals folder, secret sweep clean, pin sweep clean, ban-token sweep clean, and bulk count zero.

- Markdownlint over both new files:

```text
PS> npx --yes markdownlint-cli .opencode/skills/vs-smithery/SKILL.md P3-SMITHERY-STARTER-LOG.md; echo "markdownlint exit=$LASTEXITCODE"
markdownlint exit=0
```

- Skill-format battery, stem check included (name equals folder is the `frontmatter-name` row):

```text
PS> node scripts/verify-skills.mjs
skill-discovery          PASS     36 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md
frontmatter-keys         PASS     36 skills, every frontmatter holds exactly name and description
frontmatter-name         PASS     36 skills, every name matches its folder and the hyphenated shape
frontmatter-description  PASS     36 skills, every description is one third-person sentence with a front-loaded trigger
body-headings            PASS     36 skills, all seven headings present in order exactly once
no-ban-tokens            PASS     36 skills, zero ban-token matches (check name and four tokens masked here to keep this log sweep-clean)
no-excluded-toolchains   PASS     36 skills, zero references to excluded toolchains and the prior project
file-hygiene             PASS     36 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs
mechanism-single-home    PASS     halt block, incident template and context anchor each live in exactly one home skill
phase-map-cross-check    PASS     13 phase-map names all resolve (3 local skill folders, 10 catalog ids)
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
```

- Stem proof for the new skill:

```text
frontmatter name=vs-smithery folder=vs-smithery match=True
```

- Secret sweep with precise credential shapes, pin sweep, and ban-token sweep, all over both new files:

```text
secret-hits=0 pin-hits=0 ban-token-hits=0
```

- Bulk count from this log:

```text
HOLD=20 ADMIT=0 BULK=0
```

- File hygiene and touch scope:

```text
SKILL has-CR=False ends-single-NL=True
LOG has-CR=False ends-single-NL=True
?? .opencode/skills/vs-smithery/SKILL.md
?? P3-SMITHERY-STARTER-LOG.md
```

## Touch record

- Wrote `.opencode/skills/vs-smithery/SKILL.md`, new file, sole writer.
- Wrote `P3-SMITHERY-STARTER-LOG.md`, new file, sole writer.
- Left untouched: `kit/kit.lock`, `registry/*`, `AGENT.md`, `WORKFLOW.md`, sibling P3 files, any branch, commit, push, or tag.
