# C2-P1 Amendments — R3, R6, R7

Lane `POST87-APPLY`, node `c2-schema-amend`. Continues P1 (`c2-schema`, commit `7af716d`) without
reopening it: the P1 decision record `.opencode/audit/C2-P1-CATALOG-V4-SCHEMA.md` is the historical
record and is not edited. This file records only the three owner-authorized amendments to the
**unpublished** `registry/schema/catalog-v4.schema.json`.

## The ruling implemented (verbatim)

> "R3 = B (data is command-free; the generic equip copy documented once in V4-5) · R5 = A (the five
> codes, plus `evidence-lapsed` as the sixth under R7) · R6 = A (`id` required) · R7 = C (per-class
> TTL: command_registry 90d · load_proof 180d · source_proof 365d; lapse → candidate at the next
> audit)."

R5's answer (A) confirms the five P1 reason codes and adds a sixth; it therefore lands as part of
the R7 amendment below rather than as a separate change.

## R3 — data is command-free

**Before** (`properties.install_cmd.description`): "Required (non-null) for class 'installable'.
Null by contract for class 'upstream' and for a loadable record whose source is null
(self-shipped). **Optional for class 'data'.** Whenever it is non-null, evidence.command_registry
must name the registry that proved it."

**After**: the same sentence without the allowance — "Null by contract for class 'upstream', for
class 'data' (R3: a data record installs nothing, and the one generic equip copy that provisions
shipped artifacts is documented once in V4-5 rather than repeated per record), and for a loadable
record whose source is null (self-shipped)."

New `allOf` rule, inserted immediately after the upstream rule and before the self-shipped rule:

```json
{
  "$comment": "DATA IS COMMAND-FREE (R3, owner ruling): ...",
  "if": { "properties": { "class": { "const": "data" } } },
  "then": { "properties": { "install_cmd": { "type": "null" } } }
}
```

`properties.class.description` also now states that a data record is command-free and that its
provisioning is the single generic equip copy documented in V4-5.

The upstream-null and self-shipped-null rules are untouched; all three are asserted present exactly
once each.

## R6 — `id` is required

**Before**: `"required": ["kind", "class", "verification", "evidence"]`

**After**: `"required": ["id", "kind", "verification", "class", "evidence"]` — ordered to match the
property list, so a reader walking `properties` meets the required names in the same sequence.

`properties.id.description` now opens with the ruling: every live record carries an id, because the
id is both the merge key against `registry/data/<kind>.jsonl` and the identity a standalone record
is validated under. A record that cannot be addressed cannot be live.

## R7 — per-class evidence TTL and the sixth reason code

**Policy (recorded, not enforced here):**

| proof | window | why it is short or long |
|---|---|---|
| `command_registry` | 90 days | registries and package versions move fastest |
| `load_proof` | 180 days | a surface outlives a version but not a refactor |
| `source_proof` | 365 days | a repository coordinate is the slowest fact to change |

A proof past its window makes the record **evidence-lapsed**: it becomes a candidate at the next
audit. Enforcement is P4 verifier scope; JSON Schema carries no clock, and this amendment does not
pretend otherwise.

Where the policy is written:

1. Top-level `$comment` — all three windows, the lapse consequence, the sixth code, and the
   assignment of the clock to the P4 verifier.
2. `$defs.sourceProof.checked_at.description` — "R7 TTL: a source_proof stays valid for 365 days
   from this date; past the window the record is evidence-lapsed and becomes a candidate at the
   next audit."
3. `$defs.loadProof.checked_at.description` — the same sentence at 180 days.
4. `$defs.commandRegistry.checked_at.description` — the same sentence at 90 days, noting that this
   is the shortest-lived of the three.
5. `$defs.candidate.reason.code` — `"evidence-lapsed"` appended (six codes total), with the lapse
   rule stated in the enum description so a candidate row explains itself without the schema.

## What this amendment changes for P2

Measured consequence, not a decision taken here: **six live data-class rows carry an `install_cmd`
today**, and all six are `unverified`:

| row | current command |
|---|---|
| `dataset/stream-g-guard-probes` | `cp registry/datasets/stream-g-guard-probes.json eval/golden/stream-g-guard-probes.json` |
| `template/target-project-docs-scaffold` | `cp registry/templates/target-project-docs-scaffold.json docs/target-project-docs-scaffold.json` |
| `policy/allow-all-pack` | `cp registry/policies/allow-all-pack.json ~/.config/opencode/opencode.json` |
| `benchmark/verifier-gate-smoke` | `cp registry/benchmarks/verifier-gate-smoke.json eval/verifier-gate-smoke.json` |
| `workflow/forge-dag-exemplar` | `cp registry/workflows/forge-dag-exemplar.yaml .opencode/workflows/forge-dag-exemplar.yaml` |
| `design.md/stripe` | `cp registry/design/stripe/DESIGN.md docs/design/stripe-DESIGN.md` |

Under R3 those commands must become `null`, with the copy expressed once in the V4-5 generic equip
path. The other 84 data rows are already command-free. That work belongs to P2's migration, not to
this node; it is recorded so the migration does not discover it by failing.

The R6 change also means the generator's sidecar contract and the standalone validator now agree on
identity: a sidecar line without `id` already fails at load, and a v4 record without `id` now fails
at validation for the same reason.

## Scope statement

Only `registry/schema/catalog-v4.schema.json` was modified, plus this new record. Byte-unchanged and
proven by `git diff --exit-code`:

- `registry/schema/catalog-v3.schema.json` — published history, never edited in place.
- every `registry/data/*.jsonl` sidecar.
- `scripts/generate-catalog-json.mjs`, `scripts/verify-catalog.mjs`, `scripts/verify-registry.mjs`,
  `scripts/verify-skills.mjs` and every other script.
- `.opencode/audit/C2-P1-CATALOG-V4-SCHEMA.md` — the P1 historical record.
- the state files, the switch, the release queue and the audit log.

No candidate file was created, no install command was authored or repaired, no kind was added, and
no record was migrated.
