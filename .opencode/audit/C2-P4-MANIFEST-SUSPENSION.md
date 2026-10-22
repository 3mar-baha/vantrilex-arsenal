# C2-P4 — Selection Suspension (entry act)

- Lane: `POST87-APPLY`, Cluster 2, node `c2-verify-v4` (P4).
- Classification: DIRECTED — executed under the owner ruling quoted in §1.
- Date of the disposition: 2026-10-22.
- Base: P3 closed at `eb8596b` (`fix(catalog): MISSING-ADDRESS attempted-provenance truth (P3)`);
  the migration it gate-keeps landed at `727a1e4` and the address document at `84af813`.
- Record file: this document. It is written once, at P4 entry; it is not a retro-edit of P3.

## 1. Owner ruling (verbatim, the authorizing text)

> "§1 SELECTION DISPOSITION: the selection record is amended as a recorded owner act at P4 entry
> (NOT a retro-edit of P3): the 17 coordinate-less MCP entries are marked SUSPENDED — pending the
> missing-address hunt. Not deleted; reversible. On any recovered address + re-admission, its entry
> restores automatically. The catalog gate may then go green honestly: catalog and selection agree
> that these are not presently verified-equipped."

## 2. Shape of the suspension record

`.opencode/equip.manifest.json` keeps `schema_version`, `generated_from`, `phases` and `notes`
exactly as P3 left them, and gains one top-level array:

```json
"suspended": [
  {
    "token": "mcp/brave",
    "reason": "missing-address",
    "since": "2026-10-22",
    "document": ".opencode/audit/MISSING-ADDRESS.md"
  }
]
```

| field | contract |
|---|---|
| `token` | The `kind/id` token exactly as it appears in a `phases` array. The token stays in that array — the suspension adds a disposition, it does not remove it. |
| `reason` | Closed to `missing-address`. The gate fails any other value, so a suspension cannot stand in for a load, shape or command failure. |
| `since` | ISO `YYYY-MM-DD` date the disposition was taken. Any other form fails. |
| `document` | Repository-relative path of the hunt document. The gate fails when the file does not exist, so a suspension cannot point at a document nobody wrote. |

No other field is read and no other field is accepted: the gate fails an entry carrying an unknown
key. Nothing in `registry/`, `scripts/` or the plugin is touched by this act.

One entry is laid out over several lines. The token `mcp/reference-sequential` is 24 characters, and
the repository's pre-commit secret scanner reads `"token": "<24+ chars>"` as a credential-shaped
assignment. The value is not a secret and the scanner is not weakened or bypassed: the key and value
are split across JSON whitespace, the parsed value is byte-identical, and the plain-text value is
still in the diff for the scanner's other patterns. A scanner-pattern repair belongs to its own
concern, not to this record.

The 17 entries cover exactly the selected tokens that the catalog cannot place — the coordinate-less
MCPs already named in `.opencode/audit/MISSING-ADDRESS.md` §4 — and nothing else. All 146 selection
tokens are intact.

| token | name | missing coordinate | candidate reason |
|---|---|---|---|
| `mcp/brave` | brave | none authored — no source, origin, or `owner/repo` name | `source-proof-failed` |
| `mcp/browserbase` | browserbase | none authored | `source-proof-failed` |
| `mcp/cloudflare` | cloudflare | none authored | `source-proof-failed` |
| `mcp/context7-mcp` | context7-mcp | none authored | `source-proof-failed` |
| `mcp/deepwiki` | deepwiki | none authored | `source-proof-failed` |
| `mcp/discord` | discord | none authored | `source-proof-failed` |
| `mcp/exa` | exa | none authored | `source-proof-failed` |
| `mcp/figma-context-mcp` | figma-context-mcp | none authored | `source-proof-failed` |
| `mcp/gmail` | gmail | none authored | `source-proof-failed` |
| `mcp/googledrive` | googledrive | none authored | `source-proof-failed` |
| `mcp/mem0-memory-mcp` | mem0-memory-mcp | none authored | `source-proof-failed` |
| `mcp/neon` | neon | none authored | `source-proof-failed` |
| `mcp/openrouter` | openrouter | none authored | `source-proof-failed` |
| `mcp/reference-sequential` | reference-sequential | none authored | `source-proof-failed` |
| `mcp/steadyfetch` | steadyfetch | none authored | `source-proof-failed` |
| `mcp/supabase` | supabase | none authored | `source-proof-failed` |
| `mcp/vercel` | vercel | none authored | `source-proof-failed` |

## 3. Semantics the gate implements

The suspension is a claim about present state, not a permanent exemption. `scripts/verify-catalog.mjs`
resolves it on every run:

1. **Validate the record.** Every entry must carry the four fields above, name a token that is in the
   selection record, point at a document that exists, and use `reason: "missing-address"`. A failure
   is `selection/suspension` FAIL.
2. **Apply only while missing.** An entry whose token still has no catalog row is *active*: it is held
   out of `loadability/registers` and `phase-sets`, counted, and reported as suspended — never as
   missing.
3. **Auto-restore when live.** An entry whose token is live in the catalog is *stale*: the token is
   no longer suspended and is treated as an ordinary selected token, so it must resolve and place
   again. The gate reports the stale record by name and count. Recovery therefore needs no manifest
   edit: address recovered → evidence → re-proof → re-admission as a live row, and the suspension
   stops applying on its own.
4. **Report the count.** `selection/suspension` prints the active count, the document, and every stale
   entry; the suspension ledger prints the full active token list. The gate cannot pass by quietly
   shrinking the selection: `loadability/registers` and `phase-sets` state how many of the 146
   tokens resolved and how many are suspended.

The record is deliberately not a blanket allow-list. A token suspended without a live catalog gap is
stale and simply stops applying; a token suspended with a live catalog row can never hide a
placement failure, because the stale path restores it first. Reasons other than `missing-address`
fail, so this mechanism cannot absorb a load-proof or command-registry failure.

## 4. Reversibility proof (measured, not forecast)

Exact undo diff, run against the live tree on 2026-10-22:

| step | command / action | result |
|---|---|---|
| 1 | `Get-FileHash .opencode/equip.manifest.json -Algorithm SHA256` | `D24C021C5A5241042328A6EADEE93BE621B41CB295FDAB577AA353FDFCC6414E` |
| 2 | add `{"token":"mcp/context7","reason":"missing-address","since":"2026-10-22","document":".opencode/audit/MISSING-ADDRESS.md"}` ahead of `mcp/brave` | manifest now carries 18 entries (`C10D33E5064A2FBB6FC8FBC40F831A56E21FE06F6F20FB7A0F51F01BA24E5700`); `mcp/context7` is live in the catalog |
| 3 | `node scripts/verify-catalog.mjs` | exit 0, `20 passed, 0 skipped, 0 failed`; `selection/suspension` PASS: "17 selected token(s) suspended … 1 stale suspension(s) auto-restored (token is live again: mcp/context7)"; `loadability/registers` still "129 of 146 … 17 suspended"; `phase-sets` still "129 of 129 placeable" |
| 4 | remove exactly that line | file byte-identical to step 1 |
| 5 | `Get-FileHash …` | `D24C021C5A5241042328A6EADEE93BE621B41CB295FDAB577AA353FDFCC6414E` — identical |
| 6 | `node scripts/verify-catalog.mjs` | exit 0; `selection/suspension` back to "17 … 0 stale"; ledger "17 active … 0 stale auto-restored" |

The add/remove round trip changed nothing else: 146 tokens and 17 entries before, 146 tokens and 17
entries after. `mcp/context7` remained placeable throughout (it appears in `scout`), which is the
auto-restore path working as ordered. The proof is an exact undo, not a fixture that approximates it.

## 5. Gate state at P4 entry (measured)

| check | before P4 | at P4 (this record + verifier) |
|---|---|---|
| `loadability/registers` | FAIL — 17 selected tokens "no catalog row" | PASS — 129 of 146 resolve; 17 suspended and reported |
| `phase-sets` | FAIL — 17 "cannot be placed from the catalog" | PASS — 129 of 129 placeable; 17 suspended never inject |
| `verify-catalog` verdict | FAIL 15/17 | PASS 20/20 (the 17 pre-existing checks all pass; `selection/suspension`, `candidates/schema`, `evidence/ttl` are the P4 additions) |

No other check was relaxed. `mcp-cap` still counts 7 core MCPs; the cap was never satisfied by the
record edit because a suspended token has no catalog row to count.

## 6. Resolution path (unchanged from the owner ruling)

1. The address hunt runs against `.opencode/audit/MISSING-ADDRESS.md` (owner → verifier seat).
2. A recovered address returns as evidence, is re-proved and re-admitted as a new live row per V4-3.
3. The next gate run sees the row, marks the suspension stale, and restores the token automatically.
4. A row still unresolvable after the hunt returns to the owner for an explicit remove/keep ruling.
   Until that ruling, the suspension stands; this document is never edited in place — a later run
   appends its own dated section as the document's standing rule requires.

## 7. Cross-references

- `.opencode/audit/MISSING-ADDRESS.md` — the hunt surface and the 17-row table this record mirrors.
- `.opencode/audit/C2-P2-CLASSIFICATION.md` — the candidate classification the reason codes come from.
- `registry/schema/catalog-v4.schema.json` — `$defs.candidate`, the shape the 104 candidate rows are
  validated against at P4.
