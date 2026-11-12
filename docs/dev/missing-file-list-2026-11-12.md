# Missing-file list — catalog skill rows lacking an exact-id card (2026-11-12)

Final-fix lane F-19. Companion record for the F-07/F-08 follow-ups; no fixes are applied here.
Disposition for every row below: **for the F-07/owner follow-up**.

## Method and reproduction

Measured 2026-11-12 in the `O:\vantrilex-arsenal-0.9.84` worktree (branch `wt/v2-consolidation`, HEAD `f849e16` at measurement time) by a read-only Node script:

1. Load every row in `registry/data/skills.jsonl` (1489 rows, all `kind: skill` — measured, see below).
2. For each row `id`, test existence of `registry/skills/<id>.md` (exact-id card).
3. For misses, test the normalised fallback: a `registry/skills/*.md` file whose basename slugifies (NFKD, lowercase, `[^a-z0-9]+` → `-`, edge dashes trimmed — the generator's own `slugify` in `scripts/generate-catalog-json.mjs`) to the id.
4. For remaining misses, test `.opencode/skills/<id>/SKILL.md`.
5. Classify remainder; cross-checked against `registry/agents`, `registry/cli`, `registry/hooks`, `registry/lsp`, `registry/plugins` for the kind-misplaced case.

No output of this command was hand-transcribed; every filename in this file was read from disk.

## Measured summary

- **Measured missing exact-id rows: 87** (matches the investigation's 87).
- All 87 are `kind: skill` rows from `registry/data/skills.jsonl`. **Zero** rows whose id starts with a non-skill kind prefix and **zero** rows misplaced from another kind sidecar were measured in the 87 (class (d) = 0). The brief's expectation of non-skill-kind rows inside the 87 ("agents/cli/hook/lsp/plugin rows … kind-misplaced entries") did **not** reproduce: the 87 is entirely skill rows. The normalised-name hit count is **56**, not the 31 implied by the brief's "31-normalized-miss list" phrasing — the re-measured decomposition is 56 / 30 / 1 / 0 (a/b/c/d). [UNVERIFIED: the investigation document behind "31" was not located in the tree; this file records only the re-measured numbers.]
- (c) exists-nowhere: exactly one row — `skill/pre-mortem-row-1451` — as expected. Verified: no `registry/skills/pre-mortem-row-1451.md`; no `.opencode/skills/pre-mortem-row-1451/SKILL.md`; the nearest card, `registry/skills/pre-mortem.md`, is the card for the canonical `pre-mortem` row (the row-1452 twin has its own card, `registry/skills/pre-mortem-row-1452.md`) and is not a row-1451 card under any mapping.

## Decomposition (a/b/c/d)

| Class | Count | Meaning |
|---|---|---|
| (a) | 56 | Exact-id card missing; display-name (normalized) card exists — filename listed per row |
| (b) | 30 | No card anywhere; `.opencode/skills/<id>/SKILL.md` exists (rowless installed skills) |
| (c) | 1 | Exists-nowhere: `pre-mortem-row-1451` |
| (d) | 0 | Non-skill-kind rows / kind-misplaced entries measured in the 87 |

## The 87 rows, exact-id

| id | kind | class | file evidence | disposition |
|---|---|---|---|---|
| `abuse-of-public-facing-api-mobile-api-abuse` | skill | (a) normalized-name file | `registry/skills/Abuse of Public-Facing API_ Mobile API Abuse.md` | for the F-07/owner follow-up |
| `access-with-stolen-session-cookie` | skill | (a) normalized-name file | `registry/skills/Access with Stolen Session Cookie.md` | for the F-07/owner follow-up |
| `account-access-removal` | skill | (a) normalized-name file | `registry/skills/Account Access Removal.md` | for the F-07/owner follow-up |
| `account-manipulation` | skill | (a) normalized-name file | `registry/skills/Account Manipulation.md` | for the F-07/owner follow-up |
| `account-manipulation-account-linking` | skill | (a) normalized-name file | `registry/skills/Account Manipulation_ Account Linking.md` | for the F-07/owner follow-up |
| `account-manipulation-add-authorized-user` | skill | (a) normalized-name file | `registry/skills/Account Manipulation_ Add Authorized User.md` | for the F-07/owner follow-up |
| `account-manipulation-change-account-details` | skill | (a) normalized-name file | `registry/skills/Account Manipulation_ Change Account Details.md` | for the F-07/owner follow-up |
| `account-manipulation-change-of-payment-details` | skill | (a) normalized-name file | `registry/skills/Account Manipulation_ Change of Payment Details.md` | for the F-07/owner follow-up |
| `account-manipulation-enable-account-features` | skill | (a) normalized-name file | `registry/skills/Account Manipulation_ Enable Account Features.md` | for the F-07/owner follow-up |
| `account-takeover` | skill | (a) normalized-name file | `registry/skills/Account Takeover.md` | for the F-07/owner follow-up |
| `account-takeover-exposed-api-key` | skill | (a) normalized-name file | `registry/skills/Account Takeover_ Exposed API Key.md` | for the F-07/owner follow-up |
| `account-takeover-exposed-login-credential` | skill | (a) normalized-name file | `registry/skills/Account Takeover_ Exposed Login Credential.md` | for the F-07/owner follow-up |
| `account-takeover-password-reset` | skill | (a) normalized-name file | `registry/skills/Account Takeover_ Password Reset.md` | for the F-07/owner follow-up |
| `adversary-in-the-browser-malicious-javascript-injection` | skill | (a) normalized-name file | `registry/skills/Adversary-in-the-Browser_ Malicious JavaScript Injection.md` | for the F-07/owner follow-up |
| `adversary-in-the-middle` | skill | (a) normalized-name file | `registry/skills/Adversary-in-the-Middle.md` | for the F-07/owner follow-up |
| `aegis` | skill | (a) normalized-name file | `registry/skills/Aegis.md` | for the F-07/owner follow-up |
| `agent-reach` | skill | (a) normalized-name file | `registry/skills/Agent-Reach.md` | for the F-07/owner follow-up |
| `ai-research-skills` | skill | (a) normalized-name file | `registry/skills/AI-Research-SKILLs.md` | for the F-07/owner follow-up |
| `anthropic-cybersecurity-skills` | skill | (a) normalized-name file | `registry/skills/Anthropic-Cybersecurity-Skills.md` | for the F-07/owner follow-up |
| `auto-claude-code-research-in-sleep` | skill | (a) normalized-name file | `registry/skills/Auto-claude-code-research-in-sleep.md` | for the F-07/owner follow-up |
| `babel-bridge` | skill | (b) installed, no card | `.opencode/skills/babel-bridge/SKILL.md` | for the F-07/owner follow-up |
| `beautiful-prose` | skill | (a) normalized-name file | `registry/skills/beautiful_prose.md` | for the F-07/owner follow-up |
| `browser-session-hijacking` | skill | (a) normalized-name file | `registry/skills/Browser Session Hijacking.md` | for the F-07/owner follow-up |
| `brute-force-credential-stuffing` | skill | (a) normalized-name file | `registry/skills/Brute Force_  Credential Stuffing.md` | for the F-07/owner follow-up |
| `brute-force-password-cracking` | skill | (a) normalized-name file | `registry/skills/Brute Force_ Password Cracking.md` | for the F-07/owner follow-up |
| `conversion-to-physical-monetary-instruments-cash` | skill | (a) normalized-name file | `registry/skills/Conversion to Physical Monetary Instruments_ Cash.md` | for the F-07/owner follow-up |
| `convert-to-cryptocurrency` | skill | (a) normalized-name file | `registry/skills/Convert to Cryptocurrency.md` | for the F-07/owner follow-up |
| `create-fake-materials-fake-website` | skill | (a) normalized-name file | `registry/skills/Create Fake Materials_ Fake Website.md` | for the F-07/owner follow-up |
| `curl-patterns` | skill | (b) installed, no card | `.opencode/skills/curl-patterns/SKILL.md` | for the F-07/owner follow-up |
| `delete-relevant-emails` | skill | (a) normalized-name file | `registry/skills/Delete Relevant Emails.md` | for the F-07/owner follow-up |
| `device-fingerprint-spoofing` | skill | (a) normalized-name file | `registry/skills/Device Fingerprint Spoofing.md` | for the F-07/owner follow-up |
| `documentation-as-tests` | skill | (b) installed, no card | `.opencode/skills/documentation-as-tests/SKILL.md` | for the F-07/owner follow-up |
| `dorothy` | skill | (a) normalized-name file | `registry/skills/Dorothy.md` | for the F-07/owner follow-up |
| `electronic-funds-transfer-wire-transfer` | skill | (a) normalized-name file | `registry/skills/Electronic Funds Transfer_ Wire Transfer.md` | for the F-07/owner follow-up |
| `email-spoofing` | skill | (a) normalized-name file | `registry/skills/Email Spoofing.md` | for the F-07/owner follow-up |
| `gather-customer-information` | skill | (a) normalized-name file | `registry/skills/Gather Customer Information.md` | for the F-07/owner follow-up |
| `impersonate-account-holder` | skill | (a) normalized-name file | `registry/skills/Impersonate Account Holder.md` | for the F-07/owner follow-up |
| `impersonate-official` | skill | (a) normalized-name file | `registry/skills/Impersonate Official.md` | for the F-07/owner follow-up |
| `indicator-removal` | skill | (a) normalized-name file | `registry/skills/Indicator Removal.md` | for the F-07/owner follow-up |
| `insider-access-abuse` | skill | (a) normalized-name file | `registry/skills/Insider Access Abuse.md` | for the F-07/owner follow-up |
| `ios-accessibility-audit-skill` | skill | (a) normalized-name file | `registry/skills/iOS-Accessibility-Audit-Skill.md` | for the F-07/owner follow-up |
| `kill-switch-document` | skill | (b) installed, no card | `.opencode/skills/kill-switch-document/SKILL.md` | for the F-07/owner follow-up |
| `kit-evaluation-journal` | skill | (b) installed, no card | `.opencode/skills/kit-evaluation-journal/SKILL.md` | for the F-07/owner follow-up |
| `kit-evolution-log` | skill | (b) installed, no card | `.opencode/skills/kit-evolution-log/SKILL.md` | for the F-07/owner follow-up |
| `lenis` | skill | (b) installed, no card | `.opencode/skills/lenis/SKILL.md` | for the F-07/owner follow-up |
| `nanobanana-ppt-skills` | skill | (a) normalized-name file | `registry/skills/NanoBanana-PPT-Skills.md` | for the F-07/owner follow-up |
| `og-image` | skill | (b) installed, no card | `.opencode/skills/og-image/SKILL.md` | for the F-07/owner follow-up |
| `phishing` | skill | (a) normalized-name file | `registry/skills/Phishing.md` | for the F-07/owner follow-up |
| `phishing-for-information` | skill | (a) normalized-name file | `registry/skills/Phishing for Information.md` | for the F-07/owner follow-up |
| `phone-number-spoofing-official-phone-number-spoofing` | skill | (a) normalized-name file | `registry/skills/Phone Number Spoofing_ Official Phone Number Spoofing.md` | for the F-07/owner follow-up |
| `pre-mortem-row-1451` | skill | (c) exists-nowhere | none under any mapping checked | for the F-07/owner follow-up |
| `preflight-system-doctor` | skill | (b) installed, no card | `.opencode/skills/preflight-system-doctor/SKILL.md` | for the F-07/owner follow-up |
| `red-team` | skill | (b) installed, no card | `.opencode/skills/red-team/SKILL.md` | for the F-07/owner follow-up |
| `remote-access-tools` | skill | (a) normalized-name file | `registry/skills/Remote Access Tools.md` | for the F-07/owner follow-up |
| `resumeskills` | skill | (a) normalized-name file | `registry/skills/ResumeSkills.md` | for the F-07/owner follow-up |
| `session-context-primer` | skill | (b) installed, no card | `.opencode/skills/session-context-primer/SKILL.md` | for the F-07/owner follow-up |
| `skill-color-expert` | skill | (a) normalized-name file | `registry/skills/skill.color-expert.md` | for the F-07/owner follow-up |
| `skill-maker` | skill | (b) installed, no card | `.opencode/skills/skill-maker/SKILL.md` | for the F-07/owner follow-up |
| `skill-seekers` | skill | (a) normalized-name file | `registry/skills/Skill_Seekers.md` | for the F-07/owner follow-up |
| `skill-shadow` | skill | (b) installed, no card | `.opencode/skills/skill-shadow/SKILL.md` | for the F-07/owner follow-up |
| `stage-capabilities-seo-poisoning` | skill | (a) normalized-name file | `registry/skills/Stage Capabilities_ SEO Poisoning.md` | for the F-07/owner follow-up |
| `steal-web-session-cookie` | skill | (a) normalized-name file | `registry/skills/Steal Web Session Cookie.md` | for the F-07/owner follow-up |
| `structuring` | skill | (a) normalized-name file | `registry/skills/Structuring.md` | for the F-07/owner follow-up |
| `supercmo-skills` | skill | (a) normalized-name file | `registry/skills/superCMO-skills.md` | for the F-07/owner follow-up |
| `time-capsule-test` | skill | (b) installed, no card | `.opencode/skills/time-capsule-test/SKILL.md` | for the F-07/owner follow-up |
| `transfer-of-funds` | skill | (a) normalized-name file | `registry/skills/Transfer of funds.md` | for the F-07/owner follow-up |
| `use-alternate-authentication-material-application-access-token` | skill | (a) normalized-name file | `registry/skills/Use Alternate Authentication Material_ Application Access Token.md` | for the F-07/owner follow-up |
| `vantrilex-design-variations` | skill | (b) installed, no card | `.opencode/skills/vantrilex-design-variations/SKILL.md` | for the F-07/owner follow-up |
| `vantrilex-doctrine` | skill | (b) installed, no card | `.opencode/skills/vantrilex-doctrine/SKILL.md` | for the F-07/owner follow-up |
| `vantrilex-prime` | skill | (b) installed, no card | `.opencode/skills/vantrilex-prime/SKILL.md` | for the F-07/owner follow-up |
| `vantrilex-vanguard` | skill | (b) installed, no card | `.opencode/skills/vantrilex-vanguard/SKILL.md` | for the F-07/owner follow-up |
| `vantrilex-workflow-forge` | skill | (b) installed, no card | `.opencode/skills/vantrilex-workflow-forge/SKILL.md` | for the F-07/owner follow-up |
| `vibe-skills` | skill | (a) normalized-name file | `registry/skills/Vibe-Skills.md` | for the F-07/owner follow-up |
| `vmware-aiops` | skill | (a) normalized-name file | `registry/skills/VMware-AIops.md` | for the F-07/owner follow-up |
| `vs-asterism-muster` | skill | (b) installed, no card | `.opencode/skills/vs-asterism-muster/SKILL.md` | for the F-07/owner follow-up |
| `vs-at-plan-craft` | skill | (b) installed, no card | `.opencode/skills/vs-at-plan-craft/SKILL.md` | for the F-07/owner follow-up |
| `vs-bl-build-craft` | skill | (b) installed, no card | `.opencode/skills/vs-bl-build-craft/SKILL.md` | for the F-07/owner follow-up |
| `vs-book-doctrine` | skill | (b) installed, no card | `.opencode/skills/vs-book-doctrine/SKILL.md` | for the F-07/owner follow-up |
| `vs-golden-equipment` | skill | (b) installed, no card | `.opencode/skills/vs-golden-equipment/SKILL.md` | for the F-07/owner follow-up |
| `vs-pu-probe-craft` | skill | (b) installed, no card | `.opencode/skills/vs-pu-probe-craft/SKILL.md` | for the F-07/owner follow-up |
| `vs-smithery` | skill | (b) installed, no card | `.opencode/skills/vs-smithery/SKILL.md` | for the F-07/owner follow-up |
| `vs-syzygy-muster` | skill | (b) installed, no card | `.opencode/skills/vs-syzygy-muster/SKILL.md` | for the F-07/owner follow-up |
| `vs-zenith-muster` | skill | (b) installed, no card | `.opencode/skills/vs-zenith-muster/SKILL.md` | for the F-07/owner follow-up |
| `vs-zenith-refresh-guard` | skill | (b) installed, no card | `.opencode/skills/vs-zenith-refresh-guard/SKILL.md` | for the F-07/owner follow-up |
| `vs-zenith-team-control` | skill | (b) installed, no card | `.opencode/skills/vs-zenith-team-control/SKILL.md` | for the F-07/owner follow-up |
| `wellally-health` | skill | (a) normalized-name file | `registry/skills/WellAlly-health.md` | for the F-07/owner follow-up |
| `youtube-clipper-skill` | skill | (a) normalized-name file | `registry/skills/Youtube-clipper-skill.md` | for the F-07/owner follow-up |

## Data-quality notes (recorded, not fixed)

- (a)-class filenames are the display names, not slugs: Windows-illegal `:` in display names was written as `_` by the card-writing path (e.g. `Account Takeover_ Exposed API Key.md` for display name `Account Takeover: Exposed API Key`); colons were replaced with underscores throughout (`Account Manipulation_ Account Linking.md` …).
- Separator drift in (a) filenames: `beautiful_prose.md`, `Skill_Seekers.md`, `skill.color-expert.md` (underscores/dots where the slug uses hyphens).
- Double-space artifact: `Brute Force_  Credential Stuffing.md` (two spaces before `Credential`).
- Case drift vs the slug: `AI-Research-SKILLs.md`, `ResumeSkills.md`, `superCMO-skills.md`, `VMware-AIops.md`, `iOS-Accessibility-Audit-Skill.md`, `Transfer of funds.md`, `Youtube-clipper-skill.md` — slugify folds case; the exact-id check fails on case alone for these.
- (b) rows are the installed-but-rowless skills this same lane is adding rows for under F-16 (vs-* twins mirror their plain twin; installed curated rows); the exact-id card gap persists after that landing and stays with F-07/owner.
- `pre-mortem-row-1451` remains the only catalog row with no file under any mapping (see F-18 in the same lane's report).
- 10 card files under `registry/skills/` carry uncommitted modifications (trailing-newline deletions) from a parallel lane at measurement time; this file does not touch them.

## Out-of-scope observation (measured, not fixed)

Catalog-wide exact-id card-miss counts per kind (same measurement applied to every sidecar; **not** part of the 87, which is skill-only): mcp 874; agent 304; formatting 13; cli 71; theme 12; hook 2 (`long-running-process-guard`, `task-dispatcher`); lsp 1 (`typescript-lsp`); dataset 1; template 1; policy 2; benchmark 1; workflow 1; design.md 84; skill 87. Whether non-skill kinds are supposed to carry per-row cards is a question for the owner; noted here so the gap is not invisible. [UNVERIFIED: no policy document located in this pass requiring cards for non-skill kinds.]

## Honest gaps

- The investigation document behind the numbers "87" and "31-normalized-miss" was not re-located in the tree; this file re-measures from the sidecars and reports what it measured. The 87 total reproduced; the 31 did not (56 measured).
- Origin of the (a)-class divergence (display-name cards vs exact-id cards) is recorded here as observed fact, not as a ruling.
