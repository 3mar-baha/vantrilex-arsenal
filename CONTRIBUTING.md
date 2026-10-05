# Contributing to Vantrilex Arsenal

Thanks for helping equip the next project.

## Read `AGENTS.md` first

It carries the hard rules. The two that surprise people most:

1. **Never invent an install command.** If you cannot verify it against a real registry,
   set `install_cmd: null` and `verification: unverified`. A wrong command that looks
   plausible is worse than an admitted gap, because an agent will run it.
2. **The catalog Markdown is generated.** Edit `registry/data/*.jsonl` or the generator,
   never the table in `VANTRILEX_CATALOG.md`.

## One concern per branch

```
wt/<concern-slug>
```

Never two branches writing one `registry/data/*.jsonl` file. That is how merges conflict
and how registry data gets silently lost.

## Before you open a pull request

Run the checks that apply to your change. A check you could not run is a failed check —
say so in the PR description rather than leaving it green-looking.

```bash
node scripts/verify-registry.mjs      # schema + UTF-8 + orphan references
node scripts/generate-catalog-json.mjs # catalog.json and _index.md regenerate cleanly
node scripts/verify-kit.mjs            # each Tier-0 component resolves
shellcheck scripts/*.sh                # POSIX shell correctness
npx tsc --noEmit                       # plugin TypeScript
npx markdownlint-cli "**/*.md"         # documentation lint
```

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add when_to_use backfill for Tier-0 skills
fix: correct firecrawl-mcp install command scope
docs: explain the single-writer sidecar rule
```

A `!` after the type, or a `BREAKING CHANGE:` footer, forces a MAJOR bump at release.

## Adding a component

1. Find or create the record in the owning `registry/data/*.jsonl` sidecar.
2. Verify the install command against the real registry — `npm view <pkg>`, the GitHub
   repo, or the vendor's own docs. Record what you checked.
3. Fill `when_to_use`, `phase`, and `tier`. `tier: core` is for Tier-0 only and needs
   a slot in the 49-component budget.
4. If the component overlaps an existing one, record `supersedes` or `pairs_with` in
   `registry/data/overlaps.yaml`.
5. Update `CHANGELOG.md` in the same change.
6. Run `node scripts/verify-registry.mjs` and `node scripts/generate-catalog-json.mjs`.

## Reporting a wrong install command

Open an issue with the component id, the command that is wrong, and the registry output
that proves it. Wrong commands are treated as correctness bugs, not documentation nits —
they are the one class of error in this repo that an agent will execute.

## License

Contributions are accepted under the MIT license in [LICENSE](LICENSE).