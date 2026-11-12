# Step 5 — Documentation phase — vantrilex-vanguard satellite

Satellite of [vantrilex-vanguard](SKILL.md) (split 2026-11-12, F-09). The content below is the A.7 through A.8 procedure subsections
that used to live in the skill body, moved verbatim so every file stays under 500 lines.

### Step 5 — Documentation phase (A.7)

Generate the twenty-eight files with fixed numbers and fixed filenames in eight folders. The grouping
below is explicit and complete:

```text
| `docs/` | 00, 17 | Project summary and the living checkpoint file |
| `docs/01-vision/` | 01, 02, 05, 06, 23, 24 | Vision, language, people, scope, roadmap, risks |
| `docs/02-requirements/` | 03, 04, 07 | Functional, non-functional, and success criteria |
| `docs/03-architecture/` | 08, 09, 10, 11, 12, 13 | Architecture, stack, data, contracts, security, ADR |
| `docs/04-kit/` | 14, 15, 16 | Kit inventory, selection record mirror, and agent registry |
| `docs/05-workflows/` | 18, 19, 20, 21, 22 | Main lane plus feature, review, audit, and bugfix lanes |
| `docs/06-governance/` | 25, 26, 27 | Constitution, antipatterns, and the problems ledger |
| `docs/99-archive/` | superseded docs plus manifest | Retired docs with reasons, never deleted |
```

Write one contract row per file, all twenty-eight, with no row added or removed:

```text
| 00 | `00-PROJECT-SUMMARY.md` | Project Summary |
| 01 | `01-VISION.md` | Vision |
| 02 | `02-GLOSSARY.md` | Glossary |
| 03 | `03-FUNCTIONAL-REQUIREMENTS.md` | Functional Requirements |
| 04 | `04-NON-FUNCTIONAL-REQUIREMENTS.md` | Non-Functional Requirements |
| 05 | `05-PERSONAS.md` | Personas |
| 06 | `06-SCOPE.md` | Scope |
| 07 | `07-SUCCESS-CRITERIA.md` | Success Criteria |
| 08 | `08-ARCHITECTURE-OVERVIEW.md` | Architecture Overview |
| 09 | `09-TECHNOLOGY-STACK.md` | Technology Stack |
| 10 | `10-DATA-MODEL.md` | Data Model |
| 11 | `11-API-CONTRACTS.md` | API Contracts |
| 12 | `12-SECURITY-MODEL.md` | Security Model |
| 13 | `13-ARCHITECTURE-DECISION-RECORD.md` | Architecture Decision Record |
| 14 | `14-KIT-INVENTORY.md` | Kit Inventory |
| 15 | `15-SELECTION-RECORD.json` | Selection record mirror (JSON, not Markdown) |
| 16 | `16-AGENT-REGISTRY.md` | Agent Registry |
| 17 | `17-CHECKPOINT.md` | Checkpoint (living state file, updated every session) |
| 18 | `18-WORKFLOW.md` | Main Workflow (left EMPTY for Doctrine to fill) |
| 19 | `19-FEATURE-WORKFLOW.md` | Feature Workflow |
| 20 | `20-REVIEW-WORKFLOW.md` | Review Workflow |
| 21 | `21-SECURITY-AUDIT-WORKFLOW.md` | Security Audit Workflow |
| 22 | `22-BUGFIX-WORKFLOW.md` | Bugfix Workflow |
| 23 | `23-ROADMAP.md` | Roadmap |
| 24 | `24-RISKS.md` | Risks |
| 25 | `25-AI-CONSTITUTION.md` | AI Constitution (immutable laws) |
| 26 | `26-AI-ANTIPATTERNS.md` | AI Antipatterns (what the agent must never do) |
| 27 | `27-PROBLEMS.md` | Problems |
```

Hold these documentation rules with no exceptions: English throughout, detailed without stinginess,
fixed numbers that never shift. The file `25-AI-CONSTITUTION.md` holds the immutable laws,
`26-AI-ANTIPATTERNS.md` states what the agent must never do, `00-PROJECT-SUMMARY.md` is the
comprehensive if-I-forgot-the-project reference, and `17-CHECKPOINT.md`, mirrored at
`docs/17-CHECKPOINT.md`, is the living per-session state file. Fixed numbers matter because every
later skill, gate, and ritual addresses these files by number; renumbering one file silently breaks
every reference to it.

On `18-WORKFLOW.md` the resolution is binding and Vanguard does not deviate: the name is reserved
and owned by the doctrine skill, so Vanguard creates nothing there, not empty, not a stub, nothing.
Vanguard records the name as reserved in the doc inventory so the next agent does not re-open the
question. The rationale is recorded alongside: an unauthored main workflow would stand as a second
unauthenticated source of process truth beside the one that owns it.

Superseded material is moved to `docs/99-archive/` with a manifest stating why each document was
replaced, and archive contents are never deleted — deletion destroys the evidence of what was
decided and why.

### Root file AGENT.md (A.7b)

Vanguard seeds the target project root `AGENT.md` in the docs lane from the
canonical template beside this skill at `assets/agent-md-template.md`. The
template carries six sections in this fixed order, and a seeded file keeps
them:

```text
| # | Section | Holds |
| 1 | Identity | What the project is, in project words |
| 2 | Current state | Where the work stands at the last update |
| 3 | Task log | Dated entries, one per unit of work |
| 4 | Decisions | Rulings with reasons and dates |
| 5 | Open items & next actions | Pending work with owners |
| 6 | Known risks & defects | Ranked, with evidence or dates |
```

One rule covers all four project states: Vanguard never overwrites. When
the file is absent, Vanguard creates it from the template. When the file
exists, Vanguard verifies the six sections, adds the missing ones
additively, leaves every owner line untouched, and reports each section as
created or kept. An overwrite that destroys the task log is unrecoverable,
which is why repair stays additive.

### Root file WORKFLOW.md (A.7c)

Vanguard seeds the target project root `WORKFLOW.md` in the docs lane from
the template beside this skill at `assets/workflow-md-template.md`. The
file is a two-part artifact. Part A is the standing methodology, items A1
through A7, copied from the canonical text the forge skill carries and read
live at seed time. Part B is the current-task workflow, written per task and
replaced as tasks turn over. The parts keep separate revision discipline:
Part B changes freely with the work, while every Part A change carries a
dated note stating what changed and why, so a later reader can tell
standing method from recent edit.

When the forge canonical copy is unreadable at seed time, Vanguard blocks
the docs gate and reports the block. Seeding Part A from memory invents the
very method the run exists to pin down, so the run stops instead of
guessing.

### Root directives and mirror (A.7d)

Standing directives live in the target project root `AGENTS.md`, because
the V2 runtime auto-loads that file and that file alone: not the generated
mirror, not `AGENT.md`, and not the accepted-but-inert instructions array.
Vanguard merges the canonical directive text into `AGENTS.md` inside a
delimited kit region, preserving every owner line outside the sentinels and
replacing only the region between them:

```text
<!-- vantrilex:agents-directives:begin spec=agents-directives@v1 -->
<!-- vantrilex:agents-directives:end -->
```

The canonical directive text lives with the doctrine skill, which remains
its only home. Vanguard reads it live at merge time and carries no copy, so
the merged region can never describe different rules from the source. When
the file is absent, Vanguard creates it holding the region. When the region
is absent, Vanguard appends it after one blank line. When the region is
present, Vanguard replaces exactly the text between the sentinels.

The mirror file is generated from the merged `AGENTS.md` region on every
run and is never hand-maintained. The doctrine skill states the exact
mirror filename once, so this file carries no second copy of it. Vanguard
regenerates the mirror from the single source, reads both files back, and
reports drift instead of editing the mirror by hand.

Every merged `AGENTS.md` carries the pointer line verbatim, inside the kit
region, so each task starts from the live project files:

```text
At the start of every task, read AGENT.md and WORKFLOW.md in this project root before planning or dispatching anything.
```

### Execution relay (A.8)

After the docs land, the owner becomes the bridge between the coding agent and the chatbot from the
concept phase. The agent executes, the chatbot interprets and verifies, and the owner directs. Every
turn follows the same loop: the agent replies, the owner carries the reply to the chatbot, the
chatbot returns an Arabic explanation plus a precise English directive, the owner carries the
directive back, and the agent continues. The loop looks slow, and that is the point: each directive
arrives challenged and researched instead of improvised. The agent uses each skill at its mapped
phase, so review skills run in review, build discipline runs in build, and nothing runs everywhere
by default.

