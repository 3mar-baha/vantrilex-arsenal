---
name: vantrilex-vanguard
description: Equips a project on demand — use when the owner says equip this project or set up this repo, the vanguard scout that surveys, kits, verifies, and documents every new project.
---

# Vantrilex Vanguard

## Purpose

Vantrilex Vanguard is the scout. It surveys the territory before anyone builds on it:
it detects the project state, selects a component kit that fits the project, installs
the kit with real commands, verifies that every component works, reports the result,
and then builds the documentation foundation the rest of the work stands on.

Vanguard runs the steps in order and never skips ahead: preflight, state detection,
concept work, source surveying, kit selection, install plus verification, then docs.
Three laws bind every step: request information before writing, never invent an
install command, and pass the three owner gates (shortlist, verification failures,
docs) before proceeding.

This SKILL.md is written in English. The Arabic relay prompt in the concept phase is
generated output handed to the owner for use with a chatbot, and that is the intended
exception to the English rule, not a contradiction.

## When to Use

- When the owner says equip this project, set up this repo, vanguard, or asks for
  new project setup of any kind.
- At the start of a greenfield project, before any architecture or code exists.
- When inheriting a codebase with missing or untrustworthy docs, so Vanguard can run
  recon and rebuild the documentation foundation first.
- When the owner arrives with a docs-only brief and no code, so Vanguard can verify
  the docs, archive what is superseded, and continue as a greenfield run.
- When the stack or domain changes enough that the installed kit no longer fits, so
  Vanguard can re-survey sources and re-equip the project.
- Before any other skill runs on a project Vanguard has not yet equipped, because
  phase-scoped injection depends on the kit Vanguard pins.

## Do NOT use

- As a workflow runner. Feature, review, security-audit, bugfix, and release lanes
  belong to the doctrine skill; Vanguard only equips the project and writes the docs
  those lanes consume.
- As a substitute for the repository proof scripts. A green preflight says the machine
  is healthy; it says nothing about registry integrity, which is proven by
  `node scripts/verify-registry.mjs`, and nothing about the generated mirror, which
  is rebuilt by `node scripts/generate-catalog-json.mjs`.
- To ask the owner which project state applies. State detection is automatic; Vanguard
  detects and then confirms with one sentence.
- To author anything at the reserved workflow name. The file `18-WORKFLOW.md` is owned
  by the doctrine skill, so Vanguard creates nothing there, not even an empty file.
- To install Tier 1 components without owner approval, to install both sides of a
  `supersedes` pair, or to write an install command that was not verified against a
  real registry. An unverified component is recorded with a null command and
  `verification: unverified`, never with a guessed command.
- To keep running after a CRITICAL preflight failure or an unsigned-off verification
  failure. Both stop the run until the owner resolves them.

## Inputs

- A short owner statement of the project's core goal, collected in the concept phase.
- The target repository root, defaulting to the current working directory.
- The local machine mirror `registry/catalog.json`, which Vanguard reads but never
  hand-edits; the generated mirror is rebuilt, never patched by hand.
- The overlap map `registry/data/overlaps.yaml`, carrying the `supersedes` and
  `pairs_with` relations Vanguard must apply during selection.
- The preflight policy: minimum versions node >= 20, git >= 2.30, gh >= 2.40.0, plus
  an explicit operator override when a dirty workspace must be tolerated and logged.
- Owner decisions at the three gates: kit shortlist, verification failures, and the
  generated documentation set. No gate is ever assumed approved.
- Network access when available. When offline, Vanguard degrades to cached metadata
  and marks every network-dependent check SKIPPED with its reason.

## Procedure

Vanguard executes the six steps of Part A in order, then the documentation phase,
then the execution relay, under the standing laws. The map below keeps every spec
section traceable:

```text
| A.1 | Step 0 — Preflight                | Environment to workspace, block on CRITICAL      |
| A.2 | Step 1 — Project-state detection  | Four-state tree, automatic, one-sentence confirm |
| A.3 | Concept phase                     | Chatbot relay with the Arabic prompt template    |
| A.4 | Step 2 — Source surveying         | Ordered sources, Context7 reachability rule      |
| A.5 | Step 3 — Kit selection            | Five-step algorithm, overlap rules, shortlist    |
| A.6 | Step 4 — Install, verify, report  | Real commands, kit.lock, per-kind protocols     |
| A.7 | Step 5 — Documentation phase      | 28 files in 8 folders, reserved workflow name    |
| A.8 | Execution relay                   | Owner as bridge between agent and chatbot        |
| A.9 | Vanguard laws                     | Request first, real commands, gates, no stubs    |
```

### Step 0 — Preflight (A.1)

Run the preflight check first, adapted from
`.opencode/skills/preflight-system-doctor/SKILL.md`. Defer to that skill rather than
reimplementing it: Vanguard invokes the same four areas in the same order, which are
environment, then runtimes, then configuration, then workspace.

All probes are Node-based checks only, with shell and git commands limited to what
the doctor skill already defines. There is no second language runtime and no terminal
multiplexer in the toolchain, so Vanguard probes Node and its versioned companions
and nothing else.

Emit one table with the columns check, status, detail, and remediation command.
Every row carries a severity, CRITICAL or WARN, assigned before results are read.
Statuses are PASS, FAIL, or SKIPPED. A CRITICAL row that is FAIL blocks execution
immediately: print the report and stop. A CRITICAL row that lands on SKIPPED, for
example a network probe while offline, needs explicit owner confirmation before the
run continues, because a skip is not a pass.

```text
| Check                                 | Status  | Detail                              | Remediation                        |
| OS and shell identity                 | PASS    | OS name and shell version recorded  | n/a                                |
| Network egress probe                  | SKIPPED | Offline, cached metadata in use     | Restore connectivity and re-run    |
| node >= 20                            | PASS    | Version meets the floor             | Install a supported Node release   |
| git >= 2.30                           | PASS    | Version meets the floor             | Install a supported git release    |
| gh >= 2.40.0 plus auth status         | PASS    | Authenticated account present       | Run the interactive login flow     |
| kit lock in sync with catalog phases  | PASS    | Every pinned id carries a phase     | Set the phase, then regenerate     |
| Stand-in secrets file clean           | PASS    | Stand-ins only, no real values      | Replace real values with stand-ins |
| Secret scan of tracked files          | PASS    | No credential-shaped strings found  | Revoke first, then remove          |
| Clean workspace or logged override    | PASS    | Tree clean                          | Commit, stash, or log an override  |
| Disk space on repo volume             | PASS    | Free space above the minimum        | Free space before dispatch         |
```

### Step 1 — Project-state detection (A.2)

Scan the repository and decide the state automatically. Never ask the owner which
state applies; detect it, then confirm with one sentence, for example by stating
the observed code, docs, and match result in a single line.

Run three probes: is code present, are docs present, and do the docs match the code
by spot-checking three files against the implementation they describe. The outcome
selects exactly one of four states:

- State 1, greenfield, meaning no code and no docs: continue to the concept phase.
- State 2, code without usable docs, meaning no docs or docs that contradict the
  code: launch parallel recon subagents, one per major directory, then produce the
  documentation set plus a temporary `27-PROBLEMS.md` listing everything that must
  be fixed. Real work starts with those fixes through the bugfix workflow, and the
  temporary problems file is archived once it is empty.
- State 3, docs without code: skip research, verify the docs against code samples
  for accuracy, move superseded docs to `docs/99-archive/` with a manifest stating
  why each one was replaced, write the new documentation set, then continue as in
  State 1.
- State 4, docs plus code: run deep recon over the code, then write the documentation
  set, then record findings in `27-PROBLEMS.md`, then treat the owner's new additions
  as in State 1.

### Concept phase (A.3)

Ask the owner for a short text stating the project's core goal. Then return an
Arabic prompt for the owner to hand to a chatbot. The prompt instructs the chatbot
to hold a long, rigorous, Socratic discussion that steelmans the owner while staying
realistic, then to research proven methods, knowledge sources, and useful
open-source projects, and only then to explain the complete idea in full detail.

The template below carries four sections: role, discussion methodology with
graduated questions plus scepticism plus steelmanning, research duties over proven
methods plus knowledge sources plus open-source projects, and output format as a
simple Arabic explanation beside a precise English directive for the coding agent.
Copy it as-is and place the owner's goal in the «OBJECTIVE» slot. Latin inside the
template is limited to structural tokens and declared glosses: OBJECTIVE,
FIRST STEP, OUT OF SCOPE, OPEN QUESTIONS, PROBLEMS, USERS, CONSTRAINTS, SUCCESS,
proven methods, knowledge sources, open-source projects.

```text
انسخ هذا القالب والصقه في روبوت المحادثة بعد وضع هدف مشروعك مكان العلامة
«OBJECTIVE». لا تغير بنية الاقسام الاربعة ولا ترتيبها.

انا ابني مشروعا جديدا وهذا هو هدفه الاولي: «OBJECTIVE».

١. الدور
انت شريك تفكير صارم وخبير في بناء المنتجات البرمجية. مهمتك ليست المديح ولا الموافقة
السريعة بل الوصول معي الى فكرة ناضجة قابلة للتنفيذ. كن صادقا وواقعيا: اذا كان الهدف
غامضا او ضعيفا او غير قابل للتنفيذ ضمن المعقول فقل ذلك بوضوح واشرح السبب بالادلة.
حاورني بالعربية الفصيحة المبسطة واصبر على النقاش الطويل ولا تقفز الى الحل النهائي
قبل اكتمال النقاش والبحث. تذكر ان مخرجاتك النهائية سوف يستلمها وكيل برمجة لينفذها
حرفيا لذلك يجب ان تكون دقيقة ولا تحتمل التاويل.

٢. منهج النقاش
ادر معي نقاشا سقراطيا طويلا يمر بالمراحل التالية ولا تنتقل من مرحلة الى التي بعدها
حتى تكتمل الاولى تماما.
أسئلة متدرّجة: ابدأ بالاسئلة العامة حول الهدف والمستخدمين والقيمة ثم تدرج نحو
الاسئلة الدقيقة حول الحدود والقيود والافتراضات الخفية. اطرح سؤالا واحدا او سؤالين
في كل مرة وانتظر اجابتي ولا تراكم الاسئلة. كل اجابة اعطيها لك يجب ان تبني عليها
السؤال التالي.
قواعد التشكيك: شكك في كل افتراض اقدمه حتى لو بدا بديهيا. اسالني دائما ما الدليل
وما البديل وما الثمن. اعرض علي الحالات التي تفشل فيها الفكرة واطلب مني ان ادافع
عنها او اعدلها. اذا اكتشفت تناقضا بين اجاباتي فاوقفه فورا واطلب التوضيح.
قواعد الستيلمان: قبل ان تنتقد اي فكرة من افكاري اعرض اقوى صيغة ممكنة لها كما لو
كنت محاميها ثم انتقد هذه الصيغة القوية. لا تهاجم الصيغ الضعيفة ولا تسخر من اي طرح.
هدفك ان تخرج بافضل نسخة من فكرتي لا ان تهزمها في جدال.
الخطوة الاولى FIRST STEP: في نهاية النقاش لخص ما اتفقنا عليه في فقرة قصيرة قبل ان
تبدأ البحث حتى اعتمدها او اصححها.

٣. مهام البحث
بعد اعتماد الخلاصة ابدا البحث ولا تعتمد على ذاكرتك وحدها.
الطرق المُثبتة proven methods: ابحث عن المنهجيات المجربة والانماط المعمارية
المعروفة التي تناسب هذا النوع من المشاريع واذكر اسماءها ومصادرها ولماذا تناسبه.
مصادر المعرفة knowledge sources: اذكر اهم الكتب والتوثيقات والمقالات والدروس التي
يجب الرجوع اليها واشرح ماذا يقدم كل مصدر بالتحديد.
مشاريع مفتوحة المصدر open-source projects: ابحث عن مشاريع قائمة ومكتبات مفيدة
يمكن الاستفادة منها او دراستها واذكر اسم كل مشروع ووظيفته وترخيصه ومدى نشاطه.
خارج النطاق OUT OF SCOPE: حدد بوضوح ما قررنا استبعاده من المشروع ولماذا حتى لا
يتسلل اليه لاحقا.
الاسئلة المفتوحة OPEN QUESTIONS: اذكر كل سؤال لم نحسمه في النقاش مع الخيارات
المتاحة وتوصيتك لكل خيار.

٤. صيغة المخرجات
اخرج نتيجتك النهائية في جزأين متكاملين لا تستغن باحدهما عن الاخر.
الشرح العربي: اشرح الفكرة الكاملة بالعربية المبسطة شرحا مفصلا يشمل الهدف
والمستخدمين USERS والمشاكل PROBLEMS التي يحلها والقيود CONSTRAINTS ومعايير النجاح
SUCCESS والنطاق المتفق عليه وما خرج من النطاق. اكتب بفقرات واضحة وعناوين فرعية
حتى يفهمها غير المتخصص.
التوجيه الإنجليزي: اكتب بعد الشرح توجيها دقيقا بالانجليزية موجها لوكيل البرمجة
بصيغة الاوامر المباشرة يشمل الهدف والنطاق والمتطلبات الوظيفية وغير الوظيفية
والتقنيات المقترحة ومعايير القبول. يجب ان يكون هذا التوجيه مكتفيا بذاته بحيث
يستطيع وكيل البرمجة ان يبدا التنفيذ دون الرجوع اليك.
```

The owner returns with the chatbot's researched concept, and Vanguard proceeds to
source surveying with that concept as the needs baseline.

### Step 2 — Source surveying (A.4)

Query the sources in this fixed order and record what each one yields: the local
`registry/catalog.json` first, then the skills.sh leaderboard together with the
`npx skills` CLI, then vercel-labs/find-skills, then the Smithery registry CLI via
`npx @smithery/cli`, then the agency-agents roster at
https://github.com/msitarzewski/agency-agents, then awesome-design-md at
https://github.com/voltagent/awesome-design-md, then the ecc hooks at
https://github.com/affaan-m/ecc.

Apply the hard reachability rule to every candidate MCP or CLI: its docs must be
reachable through Context7 live lookup. A candidate whose docs are not reachable is
rejected, or explicitly flagged with the reason when the owner still wants to see
it. When offline, mark the network-dependent sources SKIPPED with the reason and
continue on cached catalog metadata, never silently passing a source that was not
queried.

### Step 3 — Kit selection (A.5)

Run the five-step algorithm without reordering it. First extract needs from the
project type: stack, domain, and whether the project is UI-heavy. Then query the
catalog. Then score each candidate on installs and stars with preference for proven
adoption at or above one thousand, on activity within the last six months, on a
clear licence, and on non-overlap with stronger candidates. Then apply the overlap
rules. Then present the shortlist, wait for owner approval, and only then install.
Tier 0, the core set of thirty-six components, is pre-approved for every project;
Tier 1 is selected per project and needs explicit approval.

Vanguard reads catalog records by their real field names, exactly these fields, and Vanguard reads them by these names:

```
id, name, kind, description, source, origin, install_cmd, version_pin, category, tags, when_to_use, phase, tier, verify_cmd, cost_note, verification, default_selected
```

Apply `supersedes` and `pairs_with` from `registry/data/overlaps.yaml` as hard
constraints: never install both sides of a `supersedes` pair, for example
`ponytail-review` against `code-review`, and pick the winner by recency and scope
while recording why in the selection note. Members of a `pairs_with` group travel
together when both apply. When the project is UI-heavy, the design-tokens
formatting document from awesome-design-md is mandatory kit, because interface work
without shared tokens drifts on every screen.

Present the shortlist in this shape and stop for approval:

```text
| Candidate        | Kind   | Tier        | Score note                          | Overlap ruling                  |
| grill-me         | skill  | core        | High adoption, active, clear licence| Kept, no conflict               |
| ponytail-review  | skill  | conditional | High adoption, active               | Kept over code-review, recorded |
| code-review      | skill  | conditional | Solid but overlapping              | Dropped, superseded, recorded   |
```

### Step 4 — Install, verify, report (A.6)

Install with real commands only. Skills install through the skills CLI, MCP servers
through JSON snippets placed in the client configuration, and every package name is
checked against the live registry first. Never invent a package name and never
guess a repository path: an unrecognised package is rejected, and an unverified
component keeps a null command with `verification: unverified`.

```sh
npx skills add <repo> --skill <name> -a opencode
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs
```

Write one pinned entry per installed component into `kit/kit.lock`, which the docs
phase mirrors at `docs/04-kit/15-kit.lock`:

```json
{
  "id": "ponytail-review",
  "kind": "skill",
  "version": "v1.4.2",
  "source": "dietrichgebert/ponytail",
  "install_cmd": "npx skills add dietrichgebert/ponytail --skill ponytail-review -a opencode",
  "phase": "review",
  "verify": "skill dry-run against a sample diff",
  "status": "verified"
}
```

Inject each component phase-scoped, meaning it is loaded only in the phases its
`phase` field names, and keep the eight-MCP cap as the backstop so context spend
tracks the work instead of staying hot everywhere. The kit verifier at
`scripts/verify-kit.mjs`, is specified but not yet implemented, so until it lands
Vanguard proves every component with the per-kind protocol below.

```text
| Kind                       | Protocol                                                              |
| `mcp` | Ping the server with a tool listing, then make one real smoke call.   |
| `skill` | Load the component's `SKILL.md`, then dry-run its procedure on a scratch input. |
| `agent` | Echo a task back to the agent and require a scoped, non-destructive answer. |
| `plugin`, `hook` | Fire the specific event the component subscribes to.           |
| LSP, exposed by a plugin | Open a sample file that contains a deliberate fault and require diagnostics. |
| `formatting` | Run the formatter over a sample file and diff the result.      |
```

Report one row per component with the columns tool, kind, status, evidence, and how
to fix, in this shape, and proceed only after the owner signs off on the failures:

```text
| Tool       | Kind  | Status | Evidence                  | How to fix                  |
| context7   | mcp   | works  | Tool listing plus one call| n/a                         |
| grill-me   | skill | works  | SKILL.md load plus dry-run| n/a                         |
| firecrawl  | mcp   | fails  | Connection refused, log L3| Rotate the key, then retry  |
```

### Step 5 — Documentation phase (A.7)

Generate the twenty-eight files with fixed numbers and fixed filenames in eight
folders. The grouping below is explicit and complete:

```text
| `docs/` | 00, 17 | Project summary and the living checkpoint file |
| `docs/01-vision/` | 01, 02, 05, 06, 23, 24 | Vision, language, people, scope, roadmap, risks |
| `docs/02-requirements/` | 03, 04, 07 | Functional, non-functional, and success criteria |
| `docs/03-architecture/` | 08, 09, 10, 11, 12, 13 | Architecture, stack, data, contracts, security, ADR |
| `docs/04-kit/` | 14, 15, 16 | Kit inventory, lockfile mirror, and agent registry |
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
| 15 | `15-kit.lock` | kit.lock (lockfile, not Markdown) |
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

Hold these documentation rules with no exceptions: English throughout, detailed
without stinginess, fixed numbers that never shift. The file
`25-AI-CONSTITUTION.md` holds the immutable laws, `26-AI-ANTIPATTERNS.md` states
what the agent must never do, `00-PROJECT-SUMMARY.md` is the comprehensive
if-I-forgot-the-project reference, and `17-CHECKPOINT.md`, mirrored at
`docs/17-CHECKPOINT.md`, is the living per-session state file.

On `18-WORKFLOW.md` the resolution is binding and Vanguard does not deviate: the
name is reserved and owned by the doctrine skill, so Vanguard creates nothing
there, not empty, not a stub, nothing. Vanguard records the name as reserved in
the doc inventory so the next agent does not re-open the question. The rationale is
recorded alongside: an unauthored main workflow would stand as a second
unauthenticated source of process truth beside the one that owns it.

Superseded material is moved to `docs/99-archive/` with a manifest stating why each
document was replaced, and archive contents are never deleted.

### Execution relay (A.8)

After the docs land, the owner becomes the bridge between the coding agent and the
chatbot from the concept phase. The agent executes, the chatbot interprets and
verifies, and the owner directs. Every turn follows the same loop: the agent
replies, the owner carries the reply to the chatbot, the chatbot returns an Arabic
explanation plus a precise English directive, the owner carries the directive back,
and the agent continues. The agent uses each skill at its mapped phase, so review
skills run in review, build discipline runs in build, and nothing runs everywhere
by default.

### Vanguard laws (A.9)

First, request information before writing: Vanguard asks, probes, and reads before
it creates a single file. Second, never invent install commands: every command is
verified against a real registry or recorded as null with `verification:
unverified`. Third, the owner gates are absolute: the shortlist, every verification
failure, and the generated docs each need explicit sign-off before Vanguard moves
on. Fourth, no deferred or half-written sections of any kind: every file Vanguard writes is complete on
delivery. Vanguard additionally holds a BLOCKED checkpoint that refuses dispatch
into install and docs phases while any CRITICAL preflight row fails or any
verification failure still lacks owner sign-off.

## Outputs

- The kit shortlist table with candidate, kind, tier, score note, and overlap
  ruling, consumable as the approval ballot with no guessing about why each row
  survived or fell.
- The verification report table with tool, kind, status, evidence, and how to fix,
  consumable as the sign-off sheet for every installed component.
- The pinned `kit/kit.lock` entries with id, kind, version, source, install
  command, phase, verify note, and status, mirrored at `docs/04-kit/15-kit.lock`
  with the kit inventory beside it at `docs/04-kit/14-KIT-INVENTORY.md`.
- The generated twenty-eight-file documentation set in its eight folders, with the
  reserved workflow name recorded and the archive manifest written.
- The Arabic relay prompt with its four sections and the owner-goal slot, handed to
  the owner ready to paste, whose returned concept feeds the next Vanguard run.

## Failure Modes

- The owner is asked which project state applies. Vanguard must detect the state
  itself from code, docs, and the three-file spot check, then confirm in one
  sentence. Asking is a failure of the step, so re-run detection instead of polling.
- A candidate MCP or CLI has no docs reachable through Context7. Reject it, or flag
  it explicitly with the reason when the owner insists on seeing it. Installing it
  silently is a failure of the surveying rule.
- A verification protocol fails. Stop the install lane, record evidence and the fix
  in the report table, and proceed only after owner sign-off on that failure.
- The BLOCKED checkpoint is set. Dispatch into install or docs phases is refused
  while any CRITICAL preflight row fails or any verification failure lacks sign-off.
  Clearing the checkpoint needs the fixed evidence, not a reworded status.
- The machine is offline. Degrade every network-dependent query to SKIPPED with its
  reason and continue on cached metadata. A silent pass on a step that never ran is
  a failure of the report.
- A package name is unrecognised or unverifiable. Reject it rather than guessing a
  registry path, because a plausible-looking wrong command will be executed by an
  agent that trusts this skill.
