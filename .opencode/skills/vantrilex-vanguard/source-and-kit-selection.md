# Source surveying and kit selection — vantrilex-vanguard satellite

Satellite of [vantrilex-vanguard](SKILL.md) (split 2026-11-12, F-09). The content below is the A.4 and A.5 procedure subsections
that used to live in the skill body, moved verbatim so every file stays under 500 lines.

### Step 2 — Source surveying (A.4)

Query the sources in this fixed order and record what each one yields: the local
`registry/catalog.json` first, then the skills.sh leaderboard together with the `npx skills` CLI,
then vercel-labs/find-skills, then the Smithery registry CLI via `npx @smithery/cli`, then the
agency-agents roster at `https://github.com/msitarzewski/agency-agents`, then awesome-design-md at
`https://github.com/voltagent/awesome-design-md`, then the ecc hooks at
`https://github.com/affaan-m/ecc`, then officialskills.sh at `https://officialskills.sh` — the
official frontend of the VoltAgent/awesome-agent-skills collection, whose per-skill pages publish a
real `npx skills add` install command that can be recorded verbatim as provenance. Fixed order keeps
two runs comparable: the same project surveyed twice yields the same evidence in the same places.

Apply the hard reachability rule to every candidate MCP or CLI: its docs must be reachable through
Context7 live lookup. A candidate whose docs are not reachable is rejected, or explicitly flagged
with the reason when the owner still wants to see it. The reasoning is simple: a component the
agent cannot read docs for at install time is a component the agent will misuse at work time. When
offline, mark the network-dependent sources SKIPPED with the reason and continue on cached catalog
metadata, never silently passing a source that was not queried.

### Step 3 — Kit selection (A.5)

Run the five-step algorithm without reordering it. First extract needs from the project type: stack,
domain, and whether the project is UI-heavy. Then query the catalog. Then score each candidate on
installs and stars with preference for proven adoption at or above one thousand, on activity within
the last six months, on a clear licence, and on non-overlap with stronger candidates. Then apply the
overlap rules. Then present the shortlist, wait for owner approval, and only then install. Tier 0 is
pre-approved for every project: it is the 30 core components of the 145 selected in
`.opencode/equip.manifest.json` from the 2,889-row catalog. Tier 1, the 115 conditional components, is selected
per project and needs explicit approval — conditional exists so projects carry what they use and
nothing they do not.

A `cli` entry is a locally installed command-line tool the kit can rely on, recorded in
`registry/catalog.json` with kind `cli`. The catalog carries 64 of them, each with a verified
installer command: population happens through the digest, the Saturday review, and the weekly
work-order mechanism, never through an equip run. Vanguard still governs an entry when a project
needs one, because an unmanaged binary on a developer's machine is not a kit.

CLI tools sit in the conditional tier, are selected per project, and need the same explicit owner
approval every conditional component needs. Vanguard proposes; it never installs a command-line
tool into someone's machine on its own authority.

Selection of a CLI tool follows a fixed owner policy rather than a judgement call in the moment.
Five rules hold:

- The tool is free, or carries a generous free tier, for a solo developer. The entry records the
  actual terms — pricing, free-tier limits, and the date recorded — so the claim stays auditable
  when the vendor changes them.
- The tool has no functional overlap with a component already in the lock.
- The tool is best-of-breed. Among duplicates, only the strongest is kept.
- A candidate that would replace a locked component is surfaced only when it is clearly and
  significantly better, and only with the concrete differences stated. Otherwise it is dropped
  silently: no entry, no report, no nagging.
- The licence is recorded for information only and is never a filter.

Read catalog records by their real field names, exactly these fields:

```text
id, name, kind, description, source, origin, install_cmd, version_pin, category, tags, when_to_use, phase, tier, verify_cmd, cost_note, verification, default_selected
```

Apply `supersedes` and `pairs_with` from `registry/data/overlaps.yaml` as hard constraints: never
install both sides of a `supersedes` pair, for example `ponytail-review` against `code-review`, and
pick the winner by recency and scope while recording why in the selection note. Members of a
`pairs_with` group travel together when both apply. When the project is UI-heavy, the design-tokens
formatting document from awesome-design-md is mandatory kit, because interface work without shared
tokens drifts on every screen.

Present the shortlist in this shape and stop for approval:

```text
| Candidate        | Kind   | Tier        | Score note                          | Overlap ruling                  |
| grill-me         | skill  | core        | High adoption, active, clear licence| Kept, no conflict               |
| ponytail-review  | skill  | conditional | High adoption, active               | Kept over code-review, recorded |
| code-review      | skill  | conditional | Solid but overlapping              | Dropped, superseded, recorded   |
```

When the locked set cannot meet a proven need, Vanguard opens the catalog
fallback. It queries the generated mirror live, scores candidates with the
same adoption and activity and licence and non-overlap tests, applies the same
overlap rules, and presents fallback candidates apart from the locked rows.
Nothing installs from beyond the lock without a second explicit owner sign-off
that names the fallback rows being accepted beside their evidence and overlap
ruling. Selection reads the full inventory with capabilities before narrowing
anything: kind plus phase plus tier plus trigger shown per candidate, taken
from the lock and the mirror live. No mapping frozen in this file governs the
choice; a printed table illustrates the shape while the lock entry in force
decides what installs and what stays out.

Doctrinal outfitter repair (LD-03): for leader-craft runs Vanguard acts as
outfitter under doctrine, not as picker by feel. It computes the loadout
from the book doctrine skill and the golden-equipment doctrine skill, writes
the computed loadout log with origin and task-class and payload template,
and the origin confirms by dispatch before anything installs. A loadout
without a log is refused, and a log without origin dispatch confirm stays
pending.

