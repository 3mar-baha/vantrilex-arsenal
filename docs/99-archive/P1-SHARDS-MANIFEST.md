# P1 Shards Manifest (p1-split, wave 0 mechanical prep)

Source: `registry/data/skills.jsonl` (read-only, never modified).
Source SHA256: `B8B279B830353202A2239984F48C8E023BE6C483E39A3B95D91E141B8CEF4F82`
Source file length: `446471` bytes.
Source row count: `1505` nonempty lines.

Split rule: file order, contiguous, disjoint, byte-identical rows.
Each shard row is byte-identical to the corresponding source line.
Shards 1–6 end with a trailing newline; shard 7 has no trailing newline,
so direct concatenation of shard bytes 1→7 equals the source bytes exactly.

Range note: the brief text lists the last shard as 1296–1505, which yields
only 210 rows and a 1500 total. To satisfy the acceptance (1505 total, zero
overlap, file-order coverage) the implemented ranges use equal 215-row
shards with the last shard at 1291–1505. Flagged for LEADER confirmation.

| shard file | row range (1-based, file order) | row count |
|---|---|---|
| `P1-SHARD-1.jsonl` | 1–215 | 215 |
| `P1-SHARD-2.jsonl` | 216–430 | 215 |
| `P1-SHARD-3.jsonl` | 431–645 | 215 |
| `P1-SHARD-4.jsonl` | 646–860 | 215 |
| `P1-SHARD-5.jsonl` | 861–1075 | 215 |
| `P1-SHARD-6.jsonl` | 1076–1290 | 215 |
| `P1-SHARD-7.jsonl` | 1291–1505 | 215 |
| total | 1–1505 | 1505 |

Per-shard integrity (read live after write):

| shard file | bytes | SHA256 |
|---|---|---|
| `P1-SHARD-1.jsonl` | 63519 | `F18BA2DFC718430B6DBBEEE788E041D57CBEBF07A7661327D773759451D4AFBF` |
| `P1-SHARD-2.jsonl` | 63881 | `6ECF28DE4C9E950C5F02DCDA7929E27A18DE3925A33927CAC3F7EC24D48F5FF7` |
| `P1-SHARD-3.jsonl` | 65521 | `16B5A8D797186CDBF7DA0AABAEA753772776DAC0C188FB5A2A2AEA2B900C88D982` |
| `P1-SHARD-4.jsonl` | 69174 | `B58442BF103C2755E0240342677D26D7BC82376E08AB04A903132D23B52DFF54` |
| `P1-SHARD-5.jsonl` | 61514 | `ED5EDD92DE119C4395F42A03E7ED4EA200F61D6B699B71D418DA03EDF675405C` |
| `P1-SHARD-6.jsonl` | 64260 | `E6019D6ECE6F85ADA49CAC6D3FB61B82CF8288AC7941424B9C77AAFABC81325E` |
| `P1-SHARD-7.jsonl` | 58602 | `C624EE2F9106F9D3779D9D0ACD5ACBB1FBD3FC41AC522909F3440D70170C6076` |

Disjointness proof (quoted from verification run, exit 0):
`concat_byte_identical_to_source=true`, `concat_nonempty_total=1505`,
`id_total=1505`, `id_distinct=1505`, `zero_overlap=true`.
Concatenated shard SHA256 equals source SHA256 above.

No eval, no polish, no registry writes. No commit or push.
