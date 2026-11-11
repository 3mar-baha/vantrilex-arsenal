---
name: curl-patterns
description: Use when an agent needs OpenRouter, Brave Search, or Exa over plain HTTPS, so the call runs as one stateless curl against the REST API instead of an MCP server.
source: 3mar-baha/vantrilex-arsenal
---

# Curl Patterns

## Purpose

One shared file for the three web-API services this kit talks to over plain HTTPS:
OpenRouter (model calls), Brave Search (web results), and Exa (semantic search). Each
pattern is a single stateless `curl` request with the service-specific header, the exact
endpoint, the pagination rules where pagination exists, and a Node-only way to shape the
JSON that comes back. This file replaces the three REST-over-HTTPS MCP servers that W-28
(wave 2) removed from the kit; it is one file, not three files, because the mechanism is
identical for all three and a shared file is the recommendation recorded in D68.
The Arsenal toolchain is Node-only: every JSON-shaping example in this file uses `node`,
never a second runtime or a second JSON tool.

## When to Use

- A task needs one OpenRouter chat completion: draft a reply, run a classifier, probe a model.
- A task needs Brave web results: titles, URLs, snippets, freshness- or language-filtered.
- A task needs Exa semantic search: natural-language queries with ranked results and highlights.
- A task needs one-shot REST reads whose auth is a single static key in an environment variable.
- A pipe needs JSON reshaped before it reaches the model's context.

## Do NOT use

- For model routing. The OpenRouter MCP was never the model router, and this file is not
  one either. The `model` field on each request selects the route, and OpenCode routes
  models through the provider configuration — put OpenRouter in the provider config for
  routing; do not build a router in shell.
- For streaming or stateful sessions. One request, one response. Live event streams and
  long-lived browser sessions are out of scope for this file by design (see the accepted-loss
  records in D68).
- For mailbox, Notion, Slack, or Discord work. Those keep their own REST patterns and their
  own loss records; they are not folded into this file.
- With the key written into the command, the file, or the commit. Keys come from the
  environment; a key in a tracked file is a leak, not a convenience.
- On Windows PowerShell 5.1 as a bare `curl`. That alias invokes `Invoke-WebRequest`, which
  is not curl and does not accept these flags; call `curl.exe` explicitly.
- Anywhere a verified CLI already covers the job (`gh`, `vercel`, `supabase`, `wrangler`,
  `neon`, `stripe`, `rclone`, `curl` itself via `cli/curl`). A CLI row beats a hand-rolled
  curl when one exists for the target service; this file covers only the three services
  above, which have no registry CLI.
- **exa vs eza, said loudly:** `exa` in this file is the Exa search API at `https://api.exa.ai`,
  authenticated with `x-api-key`. `eza` is the unrelated Rust replacement for `ls` that
  appears in package managers and PATH listings everywhere. There is no Exa CLI in this
  registry; if a lookup turns up `eza`, that is the file-listing tool, not a search client,
  and invoking it as one fails. Never substitute one for the other.

## Inputs

- `curl` on PATH (Windows 10+, macOS, and every Linux ship it; `cli/curl` pins `cURL.cURL`
  8.23.0, verified 2026-11-11).
- Node on PATH for JSON shaping (the Arsenal toolchain is Node-only).
- Environment variables, never values in files or commits:
  - `OPENROUTER_API_KEY` — OpenRouter key, create at `openrouter.ai`.
  - `BRAVE_SEARCH_API_KEY` — Brave Search key, create in the Brave API dashboard.
  - `EXA_API_KEY` — Exa key, create at the Exa dashboard (`dashboard.exa.ai`).
- A body you can pass as a single-quoted JSON string (POSIX shells) or a one-shot temp
  file (Windows PowerShell, where quoting rules differ). Blocks tagged `console` in this
  file are illustrative shapes, not executed examples; the three unauthenticated probes
  quoted under Failure Modes were executed on 2026-11-11.

## Procedure

### 1. OpenRouter — POST the chat completions endpoint

```console
curl -sS https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "openai/gpt-4o-mini", "messages": [{"role": "user", "content": "ping"}]}'
```

- Auth is `Authorization: Bearer <OPENROUTER_API_KEY>`. An unauthenticated request was
  probed on 2026-11-11 and answered HTTP 401.
- The `model` field is the route. OpenRouter routes server-side from the slug you send;
  the client picks the model, the provider config picks which provider OpenCode talks to.
  List available slugs with `curl -sS https://openrouter.ai/api/v1/models -H "Authorization: Bearer $OPENROUTER_API_KEY"` before hardcoding a slug.
- Optional attribution headers: `HTTP-Referer` and `X-Title` identify the calling app to
  OpenRouter's rankings; they are not required for the call to succeed.
- A 200 body nests the answer at `choices[0].message.content` and the token accounting at
  `usage`; read `usage` when you need to know what a call cost you.
- Model routing hand-off: for seat-level routing (which provider OpenCode uses for a whole
  project), edit the OpenCode provider configuration; this endpoint call is the per-request
  lane, not the seat-routing lane.

### 2. Brave Search — GET the web search endpoint

```console
curl -sS "https://api.search.brave.com/res/v1/web/search?q=vantrilex&count=10&offset=0" \
  -H "X-Subscription-Token: $BRAVE_SEARCH_API_KEY" \
  -H "Accept: application/json"
```

- The subscription token rides as `X-Subscription-Token` — **not** `Authorization: Bearer`.
  Brave does not read a Bearer header for this endpoint; an unauthenticated request was
  probed on 2026-11-11 and answered HTTP 422 with `"loc": ["header", "x-subscription-token"], "msg": "Field required"`.
- Pagination: `count` is results per page, default 20, maximum 20. `offset` is 0-based page
  index, maximum 9 — ten pages is the ceiling, so the deepest reachable window is results
  181–200. Do not loop blindly: read `query.more_results_available` from the response and
  stop when it is `false`.
- Useful parameters: `safesearch=off|moderate|strict` (default moderate),
  `freshness=pd|pw|pm|py` or a custom `YYYY-MM-DDtoYYYY-MM-DD` range, `country` (two-letter
  code), `search_lang`, `ui_lang`, `extra_snippets=true` (up to five extra excerpts per
  result under `web.results[].extra_snippets`).
- Brave also exposes an LLM-context endpoint tuned for machine consumption; prefer it when
  the consumer is a model, prefer `res/v1/web/search` when the consumer needs human-shaped
  rows (title, url, description).
- Results live at `web.results[]` with `title`, `url`, `description`; `query.original`
  echoes the normalized query.

### 3. Exa — POST the search endpoint

```console
curl -sS -X POST "https://api.exa.ai/search" \
  -H "x-api-key: $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "recent retrieval benchmarks", "type": "auto", "numResults": 5, "contents": {"highlights": true}}'
```

- Auth rides as `x-api-key` per the dispatch brief for this file; the current Exa docs also
  accept `Authorization: Bearer` for the same key. Either is one header; never send both to
  two different services' copy-pasted blocks.
- The 2026-11-11 unauthenticated probe answered HTTP 402 with tag `X402_PAYMENT_REQUIRED`.
  A 402 here means "no valid key", not "the API is down" — create a key and pass it as
  `x-api-key`; do not retry 402 in a loop.
- The one required field is `query`. `type` selects the search mode: `auto` (default,
  balanced), `lite` (fast and cheap, up to 10 results on a $4/1k request price, cached
  content only), `deep-lite` and `deep` (research-style synthesis, seconds of latency).
- `numResults` defaults to 10, maximum 100. Search does not paginate and returns ranked
  results in one call; if ten results will not do, raise `numResults` rather than page.
- `contents.highlights: true` is the recommended output shape for agents: relevant excerpts
  per result without dumping full pages into context. `contents.text.maxCharacters` bounds
  full-page pulls when you genuinely need the body.
- Unsupported parameters on `lite` return HTTP 400 naming each one; a parameter set to
  `false` or an empty list still counts as set. Switch to `auto` when a `lite` request 400s
  on a parameter `lite` does not support.
- Results live at `results[]` with `id`, `title`, `url`, `publishedDate`, and whatever was
  requested under `contents`.

### 4. Shape the JSON with node, never a second runtime

Every response above is JSON. Feed it to `node -e` on stdin and print only what the task
needs; keep raw response bodies out of the model's context unless the task asked for them.

```console
curl -sS "https://api.search.brave.com/res/v1/web/search?q=vantrilex&count=5" \
  -H "X-Subscription-Token: $BRAVE_SEARCH_API_KEY" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const r of j.web?.results??[])console.log(r.title+"\t"+r.url)})'

curl -sS -X POST "https://api.exa.ai/search" -H "x-api-key: $EXA_API_KEY" -H "Content-Type: application/json" \
  -d '{"query": "retrieval benchmarks", "numResults": 3, "contents": {"highlights": true}}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const r of j.results??[])console.log(r.title+"\t"+r.url)})'

curl -sS https://openrouter.ai/api/v1/chat/completions -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" -d '{"model": "openai/gpt-4o-mini", "messages": [{"role": "user", "content": "ping"}]}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(j.choices?.[0]?.message?.content ?? JSON.stringify(j))})'
```

Two shell facts that bite on Windows: the single quotes above are literal in PowerShell
(fine for the `node -e` bodies as written, since the bodies use double quotes inside), and
`\t` inside a double-quoted PowerShell string is a literal backslash-t unless escaped — if
the tab separator renders literally, print a space or use `\t` inside the single-quoted
`node -e` argument, where it is JavaScript and means tab.

### 5. Failure contract — status, not vibe

| Service | Missing or invalid key (probed 2026-11-11) | Malformed request | Rate limit |
| --- | --- | --- | --- |
| OpenRouter | HTTP 401 | HTTP 400 / 422, body carries `error` | HTTP 429 |
| Brave | HTTP 422, `x-subscription-token` `Field required` | HTTP 422 `VALIDATION` naming the parameter | HTTP 429 |
| Exa | HTTP 402 `X402_PAYMENT_REQUIRED` | HTTP 400 `INVALID_REQUEST_BODY` naming the parameter | HTTP 429 |

Treat every non-2xx as a named outcome: parse the body, read the service's error tag, and
report "auth", "validation(<param>)", or "rate-limit" — never "the call failed" with no
status. A 429 is a back-off-and-retry signal, not a reason to raise the request count.

### 6. Pagination — Brave only, check before you page

```console
i=0; ok=true
while [ $i -le 9 ] && [ "$ok" = true ]; do
  r=$(curl -sS "https://api.search.brave.com/res/v1/web/search?q=vantrilex&count=20&offset=$i" \
    -H "X-Subscription-Token: $BRAVE_SEARCH_API_KEY")
  printf '%s' "$r" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const r of j.web?.results??[])console.log(r.title+"\t"+r.url);console.log("more:"+(j.query?.more_results_available??false))})'
  ok=$(printf '%s' "$r" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.stdout.write(String(j.query?.more_results_available??false))})')
  i=$((i+1))
done
```

Exa has no pagination: raise `numResults` instead. OpenRouter has no pagination: one request
is one completion. Only Brave pages, and only ten pages exist.

### 7. Proving the call landed

Before relying on a response, check three things in order: the status is 2xx; the body
parses as JSON; the extracted field is non-empty (`content`, `web.results`, `results`).
If all three hold, the call landed. Record what was actually run — date, endpoint, status —
never "should work". If a step failed, the failure is the named status from §5, not a shrug.

## Outputs

- One curl request per service with env-var auth, a JSON body via single quotes (POSIX) or a
  one-shot temp file (PowerShell), and a `node -e` shaping stage that prints only the fields
  the task needs.
- A named outcome per call (`2xx + field present`, or the §5 status tag) — never a swallowed
  error and never a raw body dumped into context by default.
- Console-tagged blocks in this file are illustrative: they were not executed as a set in
  the landing lane. The three unauthenticated probes quoted in §2, §1 and §3 were executed
  on 2026-11-11 from the Windows worktree and returned 401, 422, and 402 respectively;
  authenticated end-to-end calls remain UNVERIFIED from this lane (no keys exist in it).

## Failure Modes

- **Bearer on Brave.** Copying the OpenRouter header shape onto Brave yields HTTP 422
  `x-subscription-token` `Field required` — the header name is the failure, not the key.
- **402 from Exa, retried forever.** Exa answers 402 `X402_PAYMENT_REQUIRED` without a key;
  retrying never mints one. Fix the env var or stop.
- **401 from OpenRouter with a valid-looking key.** Check the endpoint first: the EU
  in-region endpoint is `eu.openrouter.ai`, and a key from the wrong account tier or an
  expired key looks identical to a wrong-region base URL.
- **exa/eza substitution.** Invoking `eza` (the `ls` replacement) as Exa, or installing a
  package named `exa` expecting a search client, silently does the wrong thing. There is no
  Exa CLI in the registry; this file is the integration, and `eza` is never it.
- **Blind pagination.** Looping Brave offsets without reading `more_results_available`
  spends quota past the `offset=9` ceiling and yields duplicates or nothing.
- **Keys in files.** A key written into a tracked file, a command echoed into a log, or a
  `-H` line with a literal value lands the secret in history. Env vars only; redact in logs.
- **Raw JSON into context.** A full 200 response for 100 Exa results is thousands of tokens
  of noise; shape with `node -e` first or the context pays for every field you did not need.
- **Status-blind success.** A 200 with an `error` object, or a 429 treated as an empty
  result set, both read as "no results" downstream. §7's three checks exist for exactly this.
- **Unversioned curl assumption.** The patterns target curl 8.x flags (`-sS`, `-H`, `-d`,
  `--data-binary`); `cli/curl` pins 8.23.0. On Windows, call `curl.exe`, not the PowerShell
  `curl` alias.
