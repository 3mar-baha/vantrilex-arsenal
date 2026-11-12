# F-05 load-proof bucket dispositions — 2026-11-12

Final FIX lane WS2. Target: the rows that fail `load-proof/existence` at HEAD
`ec09ee4` although their surface resolves locally (or the row is re-pointable
verbatim). Scope of this document: the 37 rows below, one line each. The
remaining 1112 failing rows are `.opencode/skills/<id>/SKILL.md` rows whose
folder is absent from this tree; they are reported-not-gated by the F-04
hybrid scope, are not enumerated here, and are not claimed to resolve.

Total measured at HEAD `ec09ee4`: **37** (32 disk-resolving + 5 prose cli
rows). The plan's "38" does not reproduce: the disk-resolving set is 23
`.opencode/agents/*.md` + 8 `.opencode/plugin/arsenal.ts#<anchor>` (7 anchors,
`sessionEnd` carried by 2 rows) + 1 root `tsconfig.json` = **32**, and 5 + 32 =
**37**, exactly the figure the dispatch brief's own breakdown implies. No 38th
row exists; reconciled and stated.

Bucket definitions (implemented in `scripts/verify-catalog.mjs`
`loadProofExistenceReason`, additive, everything else unchanged and strict):

- Bucket (1): `.opencode/agents/<name>.md` at repo root → file exists.
- Bucket (2): `.opencode/plugin/<name>.ts#<anchor>` → file exists AND the file
  contains the anchor (fixed-string `includes`, i.e. `grep -F`).
- Bucket (3): exact `tsconfig.json` at repo root → file exists.
- Bucket (4): `.agents/skills/<id>/...` → folder exists. (Zero rows exercise
  bucket (4) today; it exists so the WS6 install lane's rows resolve once
  landed. Untainted by this lane.)

Format: `id | surface before | surface after | bucket/reason` — the 32
disk-resolving rows keep their surface string byte-identical; only the gate's
resolution vocabulary changed. The 5 cli rows were re-pointed in
`registry/data/cli.jsonl` (method left `server-bin`, untouched).

## Bucket (1) — 23 rows (`.opencode/agents/<name>.md` → file exists)

```
agent/aether|.opencode/agents/aether.md|.opencode/agents/aether.md|bucket (1)
agent/blazar|.opencode/agents/blazar.md|.opencode/agents/blazar.md|bucket (1)
agent/pulsar|.opencode/agents/pulsar.md|.opencode/agents/pulsar.md|bucket (1)
agent/vantrilex|.opencode/agents/vantrilex.md|.opencode/agents/vantrilex.md|bucket (1)
agent/vantrilex-architect|.opencode/agents/vantrilex-architect.md|.opencode/agents/vantrilex-architect.md|bucket (1)
agent/vantrilex-code-reviewer|.opencode/agents/vantrilex-code-reviewer.md|.opencode/agents/vantrilex-code-reviewer.md|bucket (1)
agent/vantrilex-fixer|.opencode/agents/vantrilex-fixer.md|.opencode/agents/vantrilex-fixer.md|bucket (1)
agent/vantrilex-github|.opencode/agents/vantrilex-github.md|.opencode/agents/vantrilex-github.md|bucket (1)
agent/vantrilex-harness|.opencode/agents/vantrilex-harness.md|.opencode/agents/vantrilex-harness.md|bucket (1)
agent/vantrilex-librarian|.opencode/agents/vantrilex-librarian.md|.opencode/agents/vantrilex-librarian.md|bucket (1)
agent/vantrilex-python|.opencode/agents/vantrilex-python.md|.opencode/agents/vantrilex-python.md|bucket (1)
agent/vantrilex-red-team|.opencode/agents/vantrilex-red-team.md|.opencode/agents/vantrilex-red-team.md|bucket (1)
agent/vantrilex-releaser|.opencode/agents/vantrilex-releaser.md|.opencode/agents/vantrilex-releaser.md|bucket (1)
agent/vantrilex-reviewer|.opencode/agents/vantrilex-reviewer.md|.opencode/agents/vantrilex-reviewer.md|bucket (1)
agent/vantrilex-scout|.opencode/agents/vantrilex-scout.md|.opencode/agents/vantrilex-scout.md|bucket (1)
agent/vantrilex-scribe|.opencode/agents/vantrilex-scribe.md|.opencode/agents/vantrilex-scribe.md|bucket (1)
agent/vantrilex-security-auditor|.opencode/agents/vantrilex-security-auditor.md|.opencode/agents/vantrilex-security-auditor.md|bucket (1)
agent/vantrilex-skill-agent-maker|.opencode/agents/vantrilex-skill-agent-maker.md|.opencode/agents/vantrilex-skill-agent-maker.md|bucket (1)
agent/vantrilex-skill-finder|.opencode/agents/vantrilex-skill-finder.md|.opencode/agents/vantrilex-skill-finder.md|bucket (1)
agent/vantrilex-typescript|.opencode/agents/vantrilex-typescript.md|.opencode/agents/vantrilex-typescript.md|bucket (1)
agent/vantrilex-ui-designer|.opencode/agents/vantrilex-ui-designer.md|.opencode/agents/vantrilex-ui-designer.md|bucket (1)
agent/vantrilex-ux-designer|.opencode/agents/vantrilex-ux-designer.md|.opencode/agents/vantrilex-ux-designer.md|bucket (1)
agent/vantrilex-verifier|.opencode/agents/vantrilex-verifier.md|.opencode/agents/vantrilex-verifier.md|bucket (1)
```

## Bucket (2) — 8 rows (`.opencode/plugin/arsenal.ts#<anchor>` → file exists AND fixed-string anchor hit)

Verified present at HEAD `ec09ee4`: `prettierFormat` x1, `longRunningProcessGuard` x1,
`sessionEnd` x2 rows (persist-session-state-on-end, session-end), `preCompact` x1,
`sessionStart` x1, `taskDispatcher` x1, `typescriptCheck` x1 — 7 anchor tokens, 8 rows;
`Select-String` hit counts 7/9/9/8/7/13/7 respectively.

```
hook/auto-format-js-ts-files-with-prettier-after-edits|.opencode/plugin/arsenal.ts#prettierFormat|.opencode/plugin/arsenal.ts#prettierFormat|bucket (2)
hook/long-running-process-guard|.opencode/plugin/arsenal.ts#longRunningProcessGuard|.opencode/plugin/arsenal.ts#longRunningProcessGuard|bucket (2)
hook/persist-session-state-on-end|.opencode/plugin/arsenal.ts#sessionEnd|.opencode/plugin/arsenal.ts#sessionEnd|bucket (2)
hook/pre-compact|.opencode/plugin/arsenal.ts#preCompact|.opencode/plugin/arsenal.ts#preCompact|bucket (2)
hook/session-end|.opencode/plugin/arsenal.ts#sessionEnd|.opencode/plugin/arsenal.ts#sessionEnd|bucket (2)
hook/session-start|.opencode/plugin/arsenal.ts#sessionStart|.opencode/plugin/arsenal.ts#sessionStart|bucket (2)
hook/task-dispatcher|.opencode/plugin/arsenal.ts#taskDispatcher|.opencode/plugin/arsenal.ts#taskDispatcher|bucket (2)
hook/typescript-check-after-editing-ts-tsx-files|.opencode/plugin/arsenal.ts#typescriptCheck|.opencode/plugin/arsenal.ts#typescriptCheck|bucket (2)
```

## Bucket (3) — 1 row (exact root `tsconfig.json` → file exists)

```
lsp/typescript-lsp|tsconfig.json|tsconfig.json|bucket (3)
```

## Bucket (1) re-point — 5 prose cli rows (sidecar `registry/data/cli.jsonl`, install_cmd checked FIRST, all pass)

Per-row check: the version-stripped surface token must appear verbatim (case-sensitive)
in the row's own `install_cmd`; the re-pointed token is the row's own `version_pin`
prefixed by the package identifier the row's `install_cmd` installs (WinGet package id
for `winget install --id …` rows; the npm package name for `npm i -g`).

```
cli/curl|curl.exe 8.23.0 (WinGet Links, cURL.cURL)|cURL.cURL@8.23.0|bucket (1) re-point — pkg cURL.cURL ∈ install_cmd "winget install --id cURL.cURL"; pin 8.23.0 (row version_pin)
cli/firecrawl-cli|firecrawl-cli@1.29.0 (bin: firecrawl)|firecrawl-cli@1.29.0|bucket (1) re-point — pkg firecrawl-cli ∈ install_cmd "npm i -g firecrawl-cli"; pin 1.29.0 (row version_pin)
cli/gh|gh.exe 2.87.3 (pre-existing at C:/Program Files/GitHub CLI/gh.exe; run 2026-11-11)|GitHub.cli@2.103.3|bucket (1) re-point — pkg GitHub.cli ∈ install_cmd "winget install --id GitHub.cli"; pin 2.103.3 (row version_pin, winget registry 2026-11-11). NOTE: the observed local binary is gh 2.87.3 (pre-existing); the re-pointed surface names the registry-verified pin 2.103.3, never a binary-version claim. The 2.87.3 observation is preserved here verbatim and nowhere else.
cli/stripe|stripe version 1.55.10|Stripe.StripeCli@1.55.10|bucket (1) re-point — pkg Stripe.StripeCli ∈ install_cmd "winget install --id Stripe.StripeCli"; pin 1.55.10 (row version_pin)
cli/rclone|rclone v1.76.0|Rclone.Rclone@1.76.0|bucket (1) re-point — pkg Rclone.Rclone ∈ install_cmd "winget install --id Rclone.Rclone"; pin 1.76.0 (row version_pin)
```

Bucket (4) — 0 rows today. No catalog row carries an `.agents/skills/<id>/...`
surface at HEAD `ec09ee4` (measured catalog-wide: 0). The bucket was added as
specified; it is exercised once the WS6 install lane lands rows/folders.

Final measured count this lane must and does claim: **37 rows** dispositioned
(32 unchanged-surface gate passes + 5 cli re-points), of the 1149 failing at
HEAD. The remaining 1112 failing rows are out of this document's scope
(catalog-only mass, reported-not-gated under F-04's hybrid scope).
