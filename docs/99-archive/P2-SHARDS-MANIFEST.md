# P2 Shards Manifest — p2-split (wave 0, mechanical prep)

Source: `registry/data/agents.jsonl` (read-only)
- Non-empty rows: 301
- Total split parts (incl. trailing empty): 302
- Empty rows inside data: 0
- Bytes: 85360
- SHA256: `ee12861dfd7a03e0b62d35df6ca9504e3da49dc4fdbad7d803a33bb66d467686`
- Line endings: LF-only (301 LF, 0 CRLF), ends with LF
- Fields (rows 1-3): `id,name,origin,tags,default_selected,when_to_use,phase,tier,install_cmd,verification,version_pin,cost_note`
- No eval content. No renames. No registry writes.

## Shards (contiguous file-order quarters, byte-identical rows)

| File | Range (1-indexed) | Rows | Bytes | SHA256 |
|---|---|---|---|---|
| `P2-SHARD-1.jsonl` | 1–76 | 76 | 21067 | `3356e5a793b0e0341ab2e3947501093afb7e015255cea2016adbab40a6df17bd` |
| `P2-SHARD-2.jsonl` | 77–151 | 75 | 20731 | `0499e0b0c139aa5f2832bf33f1209f8ab1f68e3a162487f55da075281038d5ee` |
| `P2-SHARD-3.jsonl` | 152–226 | 75 | 20522 | `dde8d743615e7ab11af9fb69a1f409d93d1674c7455f18984de8fb9b2fcff15e` |
| `P2-SHARD-4.jsonl` | 227–301 | 75 | 23040 | `4bf04b187d03e01dc53a7fb9dbe2624d670bf091d1cbf1b90b2e4e866dd60b99` |
| Total | 1–301 | 301 | 85360 | concat SHA matches source |

## Disjointness proof

- Concatenated bytes == source bytes: `true`
- Concatenated SHA256: `ee12861dfd7a03e0b62d35df6ca9504e3da49dc4fdbad7d803a33bb66d467686`
- SHA match (concat vs source): `true`
- ID counts: shard1 76 unique, shard2 75 unique, shard3 75 unique, shard4 75 unique
- Total IDs: 301, unique total: 301, disjoint: `true`
- Boundary IDs: shard1 `3d-scene-developer` … `e2e-runner`; shard2 `economy-designer` … `mobile-app-builder`; shard3 `mobile-release-engineer` … `statistician`; shard4 `strategy-duel-agent` … `blazar`
- Each row byte-identical to source row. No reordering. No edits.

Branch: `wt/vta-factory-p0` in `O:\vantrilex-arsenal`. No commit. No push.
