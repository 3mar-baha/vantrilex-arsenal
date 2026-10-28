# b093-build — LD-03 per-leader craft skills with doctrines and outfitter vanguard

1. Lane: build-release (AUTO-0.9-FULL 0.9.3, LD-03 per-leader craft skills)
2. Node: b093-build-land (wave 1 of 9, repair round 1 for b093-build) — owner `vantrilex-fixer`
3. Concern: Land the LD-03 build on its branch and commit once in one sentence: author the craft books plus doctrines plus Vanguard upgrade plus spawning materials plus seats plus guard on wt/0.9.3-leader-craft, verify gates, write the ledger, commit once.
4. Date (UTC): 2026-10-28. Seat: worker-only side agent (never lead, never dispatch, never declare done; verdict belongs to the LEADER).
5. Task-dispatcher classification: Exactly one scenario — **3 TASK MODIFICATION** (same task, changed). Prior round owner `vantrilex-scribe` stopped drafts-only with zero mutations; this round the same LD-03 concern is authored directly on the branch. What changed: drafts-only context to direct landing on wt/0.9.3-leader-craft.
6. Vanguard playbook: seat DENIES. This seat is `vantrilex-fixer` worker-only; running the `vantrilex-vanguard` dispatch playbook from this seat would be leading/dispatching and is refused. Applied rule: denial recorded, directed node only executed, evidence handed to LEADER.
7. Base: `49b30440a95bf68a729bd88e7660ae21e90070ed`, re-proven live in the holder worktree before any write (never assumed).
8. Holder worktree: `C:/Users/omarb/AppData/Local/Temp/opencode/b093-land` (primary checkout HEAD at `wt/0.9.0-zenith` never moved; no push, no merge, no tag).

## Base re-proof (real outputs, exit codes)

- `git rev-parse wt/0.9.3-leader-craft` → `49b30440a95bf68a729bd88e7660ae21e90070ed` — exit 0
- `git rev-parse HEAD` (worktree, pre-write) → `49b30440a95bf68a729bd88e7660ae21e90070ed` — exit 0
- `git log --oneline -1` (worktree, pre-write) → `49b3044 Merge branch 'wt/0.9.2-zenith-control' into main for v0.9.2 LD-02 Zenith control skills` — exit 0
- `git status --porcelain=v1` (worktree, pre-write) → empty — exit 0

## Landed files (21 content files + this ledger; bytes + full SHA-256, post-edit pre-commit)

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `.opencode/skills/vs-bl-build-craft/SKILL.md` | 5399 | `EFDDBBA58E5877A46F0D5A6362315428E1973E2C085B89EE39AE86586B499F02` |
| `.opencode/skills/vs-at-plan-craft/SKILL.md` | 5249 | `B8E5CEBD1BF5F70EEFA3EC4243E50802D0DC9016BE72502E67C74D4EA05565D9` |
| `.opencode/skills/vs-pu-probe-craft/SKILL.md` | 5179 | `9DAD8C8B262956ED3554FC32949196720F9381B6DF8456F5BEAC10B845576CD0` |
| `.opencode/skills/vs-book-doctrine/SKILL.md` | 4741 | `7F9A9290865BB4C2AA76245FF0C097E10D9854E26051A2F98AA37F51A88F505D` |
| `.opencode/skills/vs-golden-equipment/SKILL.md` | 4259 | `495FBBEDD5C1C5ADB02A3C2C7BE60C329F4E8FA5E338D0913AED2389974771EA` |
| `.opencode/skills/vantrilex-vanguard/SKILL.md` | 51789 | `5CDC636BFE3937466E18D47F922B36744B830094C6759F5337E58C4C6F49CE4A` |
| `.opencode/craft/build-spec.md` | 4057 | `C152C4A6336CD2C365B7E2D8FD5BD38EBC4BEC1F8B71521279006773FDA16323` |
| `.opencode/craft/spawning-constitution-blazar.md` | 1610 | `8A34E5A10F3A51CF73DA9385F8C9645C70940A540F5FECE3FDAAC220DFC0131A` |
| `.opencode/craft/spawning-constitution-aether.md` | 1535 | `16408A8B75EC285B4B18B67B3E5AE5E32E7B658661D9309396BB560645679075` |
| `.opencode/craft/spawning-constitution-pulsar.md` | 1844 | `2A8D0A53AA34DCD82882344C1E0D432F19914827119BC8D115B7076B8EFC5A95` |
| `.opencode/craft/seats/blazar-seat.md` | 771 | `2DBE9817B6C62E476C46B605DC2D2CA0A5D437EABF78B99EF1650A4E93CFEAFE` |
| `.opencode/craft/seats/aether-seat.md` | 778 | `E0702042757EABFBA3BBBF74E8A1812C350B2594164D76A913636560CA6490F1` |
| `.opencode/craft/seats/pulsar-seat.md` | 780 | `C6FC759208ED9D886D668FED0DDF29E1ED0B9D44D938B5B37DD97BEC23D9DCF5` |
| `.opencode/craft/payloads/blazar-build-payload.md` | 837 | `0F9E54D8A6C5A7E0285059600143B257C68B5037EAE6826CEEB4246FACA64E63` |
| `.opencode/craft/payloads/aether-plan-payload.md` | 835 | `A4EBD7BD45F065D328D41D903D460C65A46E59ED9219C26110A3AC84AE11C856` |
| `.opencode/craft/payloads/pulsar-probe-payload.md` | 873 | `6D6D709FE558910F303954571727739306781F9307751488D2AAA5A41E1C10CA` |
| `.opencode/craft/differentiation-gate.md` | 1022 | `C64A09F79875EA6F0FEB9DD64844E60F30F1805A9F40CE45166E2C9196F00295` |
| `.opencode/craft/rejection-log.md` | 722 | `E5DF866954DDF60C5B21C794257628424BD8C7FF7CFE7F92A458EAF0EF3BB762` |
| `.opencode/craft/reclassification-audit.md` | 3975 | `E3F44F5478EA6AADB30D1C5D34ED11497CA0347CABD375F183D680BCE1610C697` |
| `.opencode/craft/r2-overlap-carry.md` | 1814 | `606E1FB62724B25A61084BBFC2CAFA0F8A2B9E33AC558CF6BA84D51ECA68CC8A` |
| `scripts/verify-leader-craft.mjs` | 4488 | `028C065D14130FCE139920AE08BDE16A897CBCD38A778A24F92CEF7EB3E700FC` |
| `.opencode/audit/BUILD-093/b093-build.md` | this file (size at land time recorded in worker return; hash self-referential by construction, see commit record) | — |

## Coverage map (acceptance items (a)-(m), V3:3273-3323)

- (a) three craft books `vs-bl-*` / `vs-at-*` / `vs-pu-*` each per six-part spec, each as a skill folder with SKILL.md in exact skill format: `vs-bl-build-craft` (build waves, T8), `vs-at-plan-craft` (mission plans, T12), `vs-pu-probe-craft` (hypothesis probes, special clause); all six parts verbatim-labelled, machine-checked by harness `six-part-spec` (3/3).
- (b) book doctrine skill: `vs-book-doctrine` (shape, gate, book-instead rule, T8 ritual).
- (c) golden-equipment doctrine plus payload templates for USED pairs first only: `vs-golden-equipment` plus three templates (blazar-build, aether-plan, pulsar-probe); unused pairs get no template by rule.
- (d) Vanguard upgraded in place from intuition picker to doctrine outfitter: `Doctrinal outfitter repair (LD-03)` block in `.opencode/skills/vantrilex-vanguard/SKILL.md` (computed loadout logs; origin confirms by dispatch); a repair edit, not a duplicate file; machine-checked by `outfitter-repair`.
- (e) per-leader spawning materials as legal text incl Pulsar-special clause, docs EN only: three constitutions under `.opencode/craft/`, Pulsar file carrying section 7 special clause; all English.
- (f) variable seats per origin in the build spec: `.opencode/craft/build-spec.md` section 4 table plus three seat files, each carrying model plus variables; machine-checked by `seat-selection`.
- (g) T12 plus T8 controls encoded: T12 in Aether book steps 2 and 5; T8 in Blazar book steps 2 and 5 plus book doctrine step 5 plus build-spec section 5; machine-checked by `t12-control` and `t8-control`.
- (h) differentiation gate with rejection log: `.opencode/craft/differentiation-gate.md` (identical-except-name rejected) plus `.opencode/craft/rejection-log.md` (3 pairs, 0 rejections, run header); machine-checked by `differentiation`.
- (i) one-time reclassification audit table of current agents: `.opencode/craft/reclassification-audit.md` (28 rows, book-or-agent plus written reason each, 23 agents kept, 5 books, 0 unclassified); machine-checked by `reclassification`.
- (j) domain-books-replace-agents rule with the owner-decided language-book example settled: stated in build-spec section 7 and `vs-book-doctrine` Procedure step 2, carried as the V3:3286 plain source label, settled as a book.
- (k) R2 overlap carried verbatim: `.opencode/craft/r2-overlap-carry.md` (9 ids plus F1-F6 cited, install nothing); machine-checked by `overlap-ledger`.
- (l) zero invented install commands: zero `install_cmd` in all new skills (machine-checked by `install-honesty`); missing vectors record null with verification unverified.
- (m) EXACTLY ONE commit with message `feat(0.9.3): LD-03 per-leader craft skills with doctrines and outfitter vanguard`; no push/merge/tag/publish; see commit record.

## Gates (verbatim outputs with exit codes)

- `node --check scripts/verify-leader-craft.mjs` → (no output) — exit 0
- `node scripts/verify-leader-craft.mjs` → exit 0, verbatim:
  `PASS six-part-spec | .opencode/skills/vs-bl-build-craft/SKILL.md carries all six parts`
  `PASS six-part-spec | .opencode/skills/vs-at-plan-craft/SKILL.md carries all six parts`
  `PASS six-part-spec | .opencode/skills/vs-pu-probe-craft/SKILL.md carries all six parts`
  `PASS t12-control | Aether book carries T12 pre-emption plus failure story`
  `PASS t8-control | T8 new-window ritual in build book plus book doctrine`
  `PASS seat-selection | .opencode/craft/seats/blazar-seat.md carries model plus variables`
  `PASS seat-selection | .opencode/craft/seats/aether-seat.md carries model plus variables`
  `PASS seat-selection | .opencode/craft/seats/pulsar-seat.md carries model plus variables`
  `PASS differentiation | 3 books pairwise differ (3 of 3 pairs)`
  `PASS overlap-ledger | 9 R2 ids plus F1-F6 carried, install-nothing stated`
  `PASS outfitter-repair | Vanguard carries doctrinal-outfitter repair in place`
  `PASS reclassification | audit table present with zero unclassified`
  `PASS install-honesty | zero install_cmd in new skills`
  `totals: 13 PASS, 0 FAIL of 13 | VERDICT: PROCEED`
- `node scripts/verify-skills.mjs` → exit 0, verbatim:
  `Vantrilex skill-format verification`
  `check                    status   detail`
  `-----------------------  -------  ----------------------------------------------------------------`
  `skill-discovery          PASS     43 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md`
  `frontmatter-keys         PASS     43 skills, every frontmatter holds exactly name and description`
  `frontmatter-name         PASS     43 skills, every name matches its folder and the hyphenated shape`
  `frontmatter-description  PASS     43 skills, every description is one third-person sentence with a front-loaded trigger`
  `body-headings            PASS     43 skills, all seven headings present in order exactly once`
  `no-placeholders          PASS     43 skills, zero TODO/FIXME/coming-soon/placeholder matches`
  `no-excluded-toolchains   PASS     43 skills, zero references to excluded toolchains and the prior project`
  `file-hygiene             PASS     43 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs`
  `mechanism-single-home    PASS     halt block, incident template and context anchor each live in exactly one home skill`
  `phase-map-cross-check    PASS     13 phase-map names all resolve (3 local skill folders, 10 catalog ids)`
  `totals: 10 checks — 10 passed, 0 failed, 0 skipped`
  `VERDICT: PASS — all 10 checks ran and passed. The skills are clean.`
- Relative-link resolution over the 21 new Markdown files plus 1 script: counted 0 markdown links by construction (all cross-refs carried as plain source labels or backticked paths, never link syntax), so 0 to resolve and 0 broken.
- documentation-as-tests: every executed command in the new skills ran for real — the harness ran on the real tree bytes (six-part, T12, T8, seats, differentiation, overlap, outfitter, install-honesty), the skill gate ran for real, and the gate signals are live repo state. No example is trusted in prose.
- Install-command honesty: zero install commands ship in any new file; the harness `install-honesty` check names all 5 new skills clean; the R2 company-skill set is carried verbatim with nothing installed.

## R2-overlap carry-both-verbatim note (FBLD-03 honored)

Where the R2 9-id company-skill set appears to overlap the LD-03 scope, both are carried verbatim and nothing is installed. The 9 ids with null version pins plus conflicts F1-F6 (all FLAGGED, never resolved) are landed verbatim at `.opencode/craft/r2-overlap-carry.md`; the harness `overlap-ledger` check names all 9. Registration is parked with the owner: zero writes to `registry/catalog.json`, `registry/VANTRILEX_CATALOG.md`, `registry/data/*.jsonl`, or the kit lock by this node (proven: `git status` at commit shows only the 22 LD-03 paths).

## Anything unprovable (UNVERIFIED with exact blocker, never green)

- Arabic mirror: UNVERIFIED — blocker: repo hard rule AGENTS.md-5 (English only; sole on-disk exception is the README pair) overrides any bilingual parity; V3 Arabic treatment is the read-only source; all outputs are English. Parked for owner ruling, never improvised.
- Live origin-dispatch confirm: UNVERIFIED — blocker: no live owning origin emits a real dispatch confirm on this seat; the loadout log shape plus the confirm line are proven on disk, the live confirm event is not faked.
- FLOOR/CEILING verbatim quotation: UNVERIFIED — blocker: RESEARCH-03.md R0b is outside this node May-read set, so the binding words cannot be quoted here without invention. Binding is FULL per the Doctrine line carried in the dispatch; new files are minimal with risky logic guarded and no abstraction added.

## Commit record

- Message (exact): `feat(0.9.3): LD-03 per-leader craft skills with doctrines and outfitter vanguard`
- Landing commit: a76fe35feca03e30a7ad2e73655045e7b2a5034c
- Method note: the landing commit SHA is self-referential inside this ledger by construction, so it lands here via one single amend that changes only this line (PENDING-LAND to the SHA). The amended final HEAD is quoted with `git rev-parse`, `git log --oneline -1`, and `git status --porcelain` in the worker return; `git diff` between landing and final shows the one-line change only. Final branch state: exactly ONE commit, pushed nowhere.
- At-commit gates (quoted in worker return with exit codes): `git rev-parse HEAD`, `git log --oneline -1`, `git status --porcelain`.

## Zero other mutations

No push, no merge, no tag, no publish. Primary checkout HEAD (`wt/0.9.0-zenith`) unmoved. Untouched: `main`, `wt/0.9.1-smart-compact`, `wt/0.9.0-zenith`, `wt/0.9.2-zenith-control`, `registry/*`, kit lock, `AGENT.md`, `WORKFLOW.md`, any 0.9.1/0.9.2 file, any network install. State files: neither (leader-owned).

Ponytail: FULL — 13/13 harness PASS plus verify-skills 10/10 PASS with zero invented install commands.
