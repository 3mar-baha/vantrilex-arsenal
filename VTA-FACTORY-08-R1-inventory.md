# VTA-FACTORY-08 R1 — Kit Ground Truth Inventory

Branch: `wt/vta-factory-08`.
HEAD (short): `772c693`.
Date: 2026-10-16.
Seat: worker `vantrilex-scribe`, node `r1-inventory`.

Every count below was recounted live on this branch.
Zero numbers are transcribed from older documents.
Each count quotes its exact command and exit code.

## 1 Skills

Count: **25** `SKILL.md` files under `.opencode/skills/`.

Command:

```text
Get-ChildItem .opencode/skills/*/SKILL.md | Measure-Object | Select-Object -ExpandProperty Count
```

Output: `25`. Exit code: `0`.

Files (25):

```text
babel-bridge, circuit-breaker-guard, documentation-as-tests,
github-release-packager, kill-switch-document, kit-evaluation-journal,
kit-evolution-log, lenis, og-image, open-graph-image, ponytail,
pre-mortem, preflight-system-doctor, red-team, relay-protocol,
session-context-primer, skill-shadow, time-capsule-test,
vantrilex-atomic-switch, vantrilex-deep-understand,
vantrilex-design-variations, vantrilex-doctrine, vantrilex-prime,
vantrilex-vanguard, vantrilex-workflow-forge
```

## 2 Agents

Count: **26** files under `.opencode/agents/`.

Command:

```text
Get-ChildItem .opencode/agents/*.md | Measure-Object | Select-Object -ExpandProperty Count
```

Output: `26`. Exit code: `0`.

Split, recounted live:

- Leaders: **3** (`aether.md`, `blazar.md`, `pulsar.md`).
- `vantrilex-*` workers: **17**.
- Other named specialists: **6**
  (`ai-generated-code-security-auditor.md`, `architect.md`,
  `code-reviewer.md`, `kit-maintainer.md`, `red-team.md`,
  `technical-writer.md`).
- Check: 3 + 17 + 6 = 26.

Commands:

```text
Get-ChildItem .opencode/agents/vantrilex-*.md | Measure-Object | Select-Object -ExpandProperty Count
```

Output: `17`. Exit code: `0`.

```text
Get-ChildItem .opencode/agents/aether.md,.opencode/agents/blazar.md,.opencode/agents/pulsar.md | Select-Object -ExpandProperty Name
```

Output: `aether.md blazar.md pulsar.md`. Exit code: `0`.

## 3 Commands (plural dir)

Count: **18** files under `.opencode/commands/`.

Command:

```text
Get-ChildItem .opencode/commands/*.md | Measure-Object | Select-Object -ExpandProperty Count
```

Output: `18`. Exit code: `0`.

Files (18):

```text
V-AETHER.md, V-Ai-Generated-Code-Security-Auditor.md, V-Architect.md,
V-Blazar.md, V-CATALOG.md, V-Code-Reviewer.md, V-DOCTOR.md,
V-FULL-AUDIT.md, V-HTML_DESIGN.md, V-Kit-Maintainer.md, V-PROFILE.md,
V-PULSAR.md, V-RAG.md, V-Red-Team.md, V-Technical-Writer.md,
V-Vantrilex-Guide.md, V-Vantrilex-Implementer.md, V-Vantrilex-Leader.md
```

## 4 Command (singular dir)

Count: **4** files under `.opencode/command/`.

Command:

```text
Get-ChildItem .opencode/command/*.md | Measure-Object | Select-Object -ExpandProperty Count
```

Output: `4`. Exit code: `0`.

Files (4): `doctor.md, equip.md, prime.md, release.md`.

## 5 kit/kit.lock census

Locked components: **138**. Pending entries: **9**.

Command:

```text
node -e "const fs=require('fs');const l=JSON.parse(fs.readFileSync('kit/kit.lock','utf8'));const k={};for(const c of l.components){k[c.kind]=(k[c.kind]||0)+1;}console.log(JSON.stringify(k));console.log('total='+l.components.length+' pending='+l.pending.length)"
```

Output:

```text
{"skill":27,"mcp":8,"lsp":1,"hook":7,"agent":21,"cli":64,"theme":3,"prompt":1,"dataset":1,"template":1,"policy":1,"benchmark":1,"workflow":1,"design.md":1}
total=138 pending=9
```

Exit code: `0`.

Verification split (same file, same run family):

```text
verified=80 unverified=58
```

Command:

```text
node -e "const fs=require('fs');const l=JSON.parse(fs.readFileSync('kit/kit.lock','utf8'));console.log('components='+l.components.length);console.log('pending='+l.pending.length);console.log('verified='+l.components.filter(c=>c.verification==='verified').length);console.log('unverified='+l.components.filter(c=>c.verification==='unverified').length)"
```

Output: `components=138 pending=9 verified=80 unverified=58`.
Exit code: `0`.

Pending ids (9, all kind `theme`, read live from `kit/kit.lock`):

```text
vantrilex-architect, vantrilex-code-reviewer,
vantrilex-ai-generated-code-security-auditor, vantrilex-kit-maintainer,
vantrilex-red-team, vantrilex-technical-writer,
vantrilex-vantrilex-guide, vantrilex-vantrilex-implementer,
vantrilex-vantrilex-leader
```

## 6 Registry sidecars

16 files under `registry/data/`. Row counts are non-empty lines,
recounted live per file.

Command family (one per file, example):

```text
node -e "const fs=require('fs');const f='registry/data/skills.jsonl';const n=fs.readFileSync(f,'utf8').split('\n').filter(x=>x.trim().length>0).length;console.log('skills.jsonl rows='+n)"
```

Per-file outputs, each exit code `0`:

| File | Rows |
|---|---:|
| `agents.jsonl` | 301 |
| `benchmarks.jsonl` | 1 |
| `cli.jsonl` | 64 |
| `datasets.jsonl` | 1 |
| `design.jsonl` | 84 |
| `formatting.jsonl` | 13 |
| `hooks.jsonl` | 20 |
| `lsp.jsonl` | 1 |
| `mcp.jsonl` | 907 |
| `plugins.jsonl` | 11 |
| `policies.jsonl` | 1 |
| `prompts.jsonl` | 1 |
| `skills.jsonl` | 1505 |
| `templates.jsonl` | 1 |
| `themes.jsonl` | 3 |
| `workflows.jsonl` | 1 |

Bulk command used for the table:

```text
(Get-Content registry/data/agents.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/benchmarks.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/cli.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/datasets.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/design.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/formatting.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/hooks.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/lsp.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/mcp.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/plugins.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/policies.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/prompts.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/skills.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/templates.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/themes.jsonl | Measure-Object -Line).Lines; (Get-Content registry/data/workflows.jsonl | Measure-Object -Line).Lines
```

Output sequence: `301 1 64 1 84 13 20 1 907 11 1 1 1505 1 3 1`.
Exit code: `0`.

## 7 Verify scripts

Present: **3** files matching `scripts/verify-*.mjs`.

Command:

```text
Get-ChildItem scripts/verify-*.mjs | Select-Object -ExpandProperty Name
```

Output: `verify-kit.mjs verify-registry.mjs verify-skills.mjs`.
Exit code: `0`.

## 8 Leader charter states

Read live from frontmatter, quoted verbatim:

- `.opencode/agents/aether.md`: `mode: primary`,
  `color: "#14B8A6"`, `temperature: 0.1`.
- `.opencode/agents/blazar.md`: `mode: primary`,
  `color: "#4169E1"`, `request.body.temperature: 0.1`.
- `.opencode/agents/pulsar.md`: `mode: primary`,
  `color: "#C026D3"`, `temperature: 0.1`.

No `model:` key appears in any of the three files
(`unverified` beyond this read: full-repo grep not run).

## 9 V-command mechanism state

Mechanism for all three leaders: explicit command invocation.
No native per-agent automatic theme switch exists in this runtime.
Quoted key lines (verbatim):

V-AETHER.md:

> `Continue this session under the AETHER planning leader as defined in '.opencode/agents/aether.md'.`
>
> `Apply the theme-side steps for theme 'vantrilex-aether' (accent '#14B8A6', dark teal, reserved for AETHER)`
>
> `There is no native per-agent automatic theme switch in this runtime.`

V-Blazar.md:

> `Continue this session under the BLAZAR Build Leader as defined in '.opencode/agents/blazar.md'.`
>
> `Apply the theme-side steps for theme 'vantrilex-blazar' (accent '#4169E1', dark royal blue, reserved for BLAZAR)`
>
> `This command is the mechanism: one explicit invocation switches the agent and applies the theme-side steps together.`

V-PULSAR.md (same mechanism, quoted for completeness):

> `Continue this session under the PULSAR exploration leader as defined in '.opencode/agents/pulsar.md'.`
>
> `Apply the theme-side steps for theme 'vantrilex-pulsar' (accent '#C026D3', deep magenta, reserved for PULSAR)`
>
> `It never waits on a background hook event, because no such event exists.`

## 10 Unverifiable items

- `docs/defects/identity-divergence-2026-10-16.md` §5–§6: `unverified`.
  The file is absent from this branch (no `docs/defects/` directory
  exists). Nothing from it is quoted or assumed.
- Full-repo `model:`-pin grep: `unverified` (not run in this node).
- Registry JSONL semantic validity (schema conformance): `unverified`.
  Only line counts were established here; content validation belongs
  to `scripts/verify-registry.mjs`, not run in this node.
- `registry/catalog.json` entry count vs sidecars: `unverified`
  (mirror regeneration not run in this node).

## 11 Lint gate

```text
npx --yes markdownlint-cli VTA-FACTORY-08-R1-inventory.md
```

Result: exit `0`, zero findings (output quoted in the Scribe report).
