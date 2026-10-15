# V06 RAG API Plan (Design Doc Only)

After you read this plan, you know exactly what the v06 API serves, how it
stays correct across kit versions, and how it holds the $0 budget. You run
nothing here: this document designs the API and ships no server code.

## Audience and entry point

You are the implementer who will build the v06 serving layer in a later
change, or the reviewer who checks that design against the file-based RAG
corpus in `registry/rag/`. You already know the R0 envelope (integer
`version`, `release` stamp, `updated_at`, `source`, `entries[]` with
`id`/`url`/`section`/`text` plus `version_range`, `hotfixes[]` overlay) and
the ten versioned domains plus `knowledge-hotfix.json`. If you have not read
the RAG files yet, you start there and return here when serving questions
arise.

## Goals

- You serve the ten domains and the hotfix overlay over HTTP with
  version-aware correctness.
- You keep every served fact traceable to the repository at a stated kit
  version.
- You hold the operating budget at $0 on Cloudflare plus Supabase free tiers.
- You protect asker privacy with a question-only rule.

## Non-goals

- You build no crawler, no embedding retraining pipeline, and no dashboard in
  v06.
- You change no domain file shape in this plan; shape changes ride a version
  bump in the data release that carries them.
- You store no corpus writes from askers; the corpus changes only through the
  repository release process.

## Corpus layout

- You read ten files: `01-doctrine.json`, `02-creator-identity.json`,
  `03-blazar-ops.json`, `04-component-deepdives.json`, `05-failure-modes.json`,
  `06-releases.json`, `07-workflow-recipes.json`, `08-opencode-v2-platform.json`,
  `09-security-posture.json`, `10-user-faq.json`.
- You read `knowledge-hotfix.json` on every request and merge it over the
  versioned base before you rank or quote anything.
- You treat each file's `version` as the shape version and `release` (such as
  `v0.4.1`) as the data release; you treat each entry's `version_range` as the
  applicability gate for the asker's kit version.

## Version-aware serving

- The client sends its kit version on every read: `kit_version` query
  parameter or `x-arsenal-kit` header, using the repository tag form such as
  `v0.4.1`.
- You filter entries to the asker's range first: you serve an entry only when
  the asker's kit version satisfies its `version_range`; you drop the rest
  before ranking.
- You apply hotfixes after filtering: a hotfix whose range matches the asker
  replaces the base text for the same `id`, and a hotfix with a new `id` adds
  an entry for matching askers only.
- You answer every quote with its provenance: domain file, entry `id`, entry
  `url`, `section`, and the entry's `version_range`, plus the hotfix `reason`
  when a hotfix supplied the text.
- You return the `manifest` on demand so a client pins or audits what it read:
  per-domain `version` and `release` plus the hotfix file version.

## Endpoints

| Method | Path | What you get |
|---|---|---|
| GET | `/v06/manifest` | Per-domain `version` and `release`, hotfix file version, and the corpus tip (repo tag and commit such as `v0.4.1` at `012e449`) |
| GET | `/v06/domains` | The domain list with entry counts and each domain's `version` and `release` |
| GET | `/v06/domains/{domain}` | The full domain file for `kit_version`, hotfixes already merged, out-of-range entries dropped |
| GET | `/v06/hotfix` | The raw `knowledge-hotfix.json` merge policy plus the active hotfix list |
| GET | `/v06/search?q=&domain=&kit_version=&k=` | Top-`k` matching entries with quote, `id`, `url`, `section`, `version_range`, and hotfix provenance when present |
| POST | `/v06/ask` | A question-only answer: a short grounded response plus the supporting entries with full provenance |

Example reads (illustrative shapes, unverified against a live server):

```http
GET /v06/domains/04-component-deepdives?kit_version=v0.4.1
x-arsenal-kit: v0.4.1
```

```http
GET /v06/search?q=task-dispatcher%20scenarios&kit_version=v0.4.1&k=5
```

```http
POST /v06/ask
Content-Type: application/json

{"question": "Which hooks run on OpenCode V2?", "kit_version": "v0.4.1", "k": 5}
```

## Question-only privacy rule

- You accept a question and retrieval parameters only; you accept no corpus
  writes, no file uploads, and no stored conversation history through this API.
- You log the minimum needed to operate the free tier: coarse counters and
  error signatures with no question text, no IP retention beyond the edge
  default, and no per-asker profiles.
- You never echo more corpus than the top-`k` supporting entries plus the
  short grounded response; the full-domain fetch stays an explicit endpoint
  the client chooses.
- You answer from the merged corpus only; when nothing in range supports an
  answer, you say so and name the nearest domain instead of guessing.

## Cloudflare and Supabase $0 target

- You host the corpus as static JSON on Cloudflare (Workers Static Assets or
  R2 with cache) and serve reads from the edge cache; you deploy the thin
  merge-filter-rank layer as a Cloudflare Worker on the free plan.
- You use Supabase free-tier Postgres only for what static hosting cannot do:
  optional aggregate counters and per-day abuse tallies with row-level TTL;
  you store no question text there.
- You keep every response cacheable by its full key (`domain`, `kit_version`,
  hotfix version, query terms, `k`) with short TTLs on search and ask and long
  TTLs on manifest and domain reads keyed by release.
- You refresh the edge corpus through the repository release process: a new
  data release bumps file `release` values, the deploy republishes the static
  JSON, and the manifest announces the new tip. (Refresh cadence unverified:
  no source prescribes it yet.)

## Rate limits (proposed)

- You enforce per-IP token buckets at the Worker before any Supabase touch:
  60 reads per minute on search and domain endpoints, 20 asks per minute on
  `/v06/ask`, and 10 manifests per minute per IP.
- You return `429` with `Retry-After` and a machine-readable `limit`,
  `remaining`, and `reset` hint; you never queue or degrade silently.
- You exempt no client in v06; a higher budget rides a later authenticated
  tier, which this plan does not design.

## Error contract

- You return `400` for a missing or unparsable `kit_version`, `404` for an
  unknown domain, `429` for a spent bucket, and `503` with `Retry-After` when
  the static corpus is unreachable.
- Every error names the offending parameter and the accepted form, and every
  successful quote carries its entry provenance.

## Verification (for the implementing change)

- The implementing change proves the design with a schema-conformance check
  over all ten domains plus the hotfix file, a version-filter test matrix
  across the supported kit tags (`v0.1.0` through `v0.4.1`), and a
  markdownlint-clean pass on this document.
