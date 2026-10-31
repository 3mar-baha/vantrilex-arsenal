# LD-30 Autonomous weekly cycle plus draft-version assembler (0.9.30)

Lane: build-release (AUTO-0.9-FULL 0.9.30 ONLY, never any other slot).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:6212` through `:6365`
(slot heading `0.9.30 — Autonomous weekly cycle (to the ruling) plus
draft-version assembler`), carried as data. Open questions decided here are
`V3:6333` through `:6351`, each with its evidence line in §9.
Slot identity: LD-30 — Slot 0.9.30 — Autonomous weekly cycle plus
draft-version assembler. The slot label is carried LD identity data, never a
version-number promise: any number in a draft is advisory only (see §5).
Status: mechanism definition, working-copy-only. Nothing here edits the shipped
product and nothing here assigns a version number.

The probe (`verify-weekly-cycle-0930.mjs`) re-runs every claim below; a claim
the probe cannot recompute is prose, not a claim.

## 1. What this mechanism is

The improvement-and-check-and-release cycle runs unsupervised up to the owner
ruling, and a draft-version assembler builds candidate versions from approved
improvements only. The owner session becomes: read one bundle, rule, done —
no step-chasing, no report-hunting. Automation that creates owner duties has
failed its goal no matter how productive it looks: the single bundle is the
measure.

Unsupervised steps are exactly four, each bounded: receive, dedup-into-origin,
cluster, study-packs (§3). Gates run only on what was ruled, and landing
writes only what was ruled (§4). The assembler builds candidates from approved
improvements only, with an inspectable diff per draft, a ledger-sourced
changelog where every line traces to a ledger entry, and an advisory-only
version number per the numbering law (§5). Naming and renumbering are never
automated and stay outside the assembler (§6). The periodic shape is one
by-exception bundle: harvest plus gaps plus drafts plus exceptions, exactly
one bundle, with exception thresholds owner-proposed and owner-ruled (§7).
Clean supervised cycles are recorded before any wider mandate (§8).

## 2. Treatment source (Arabic carried verbatim)

Sole-authority treatment, quoted verbatim from V3 (never from memory):

- "هذا البند يجعل دورة التحسين والفحص والإصدار تعمل بلا إشراف حتى حكم المالك."
- "جلسة المالك تصبح: قراءة حزمة، وحكم، وانتهاء، لا متابعة خطوات ولا مطاردة تقارير."
- "خطوات الحصاد التي تعمل بلا إشراف محددة: الاستقبال، وإزالة التكرار، والتجميع، وحزم الدراسة."
- "ثم تشغيل البوابات، وهبوط ما حُكم به، فلا تعمل الدورة بلا إشراف إلا ما حُكم به أو ما هو ميكانيكي."
- "مجمع النسخ المسودة يبني نسخا مرشحة من تحسينات معتمدة، لا من أمنيات."
- "سجل التغييرات يُصاغ من السجل نفسه، لا يُكتب حرا، فكل سطر فيه يتتبع إلى مدخل سجل."
- "ورقم الإصدار مقترح فقط، وفق قانون الترقيم، والترقيم يُعيَّن عند الإغلاق لا عند التجميع."
- "وشكل القبول هو ما صُممت التقارير نحوه: حزمة دورية واحدة، بالإستثناء فقط."
- "والنسخة المسودة ليست إصدارا، بل مرشحا ينتظر الإغلاق والتعيين، حتى لا يُعامل المرشح معاملة المُصدر."
- "والحد هنا واضح: ما حُكم به أو ما هو ميكانيكي يعمل بلا إشراف، وما عداه يتوقف عند الحكم."
- "والسطر اليتيم في سجل التغييرات، بلا مدخل يتتبع إليه، ادعاء لا إثبات."
- "والعتبات التي تحدد ما يستحق انتباه المالك تقترحها الخطة ويحكم فيها المالك، لا تُفرض عليه."
- "والتسمية والترقيم خارج المجمع تماما، لأن أتمتتهما تلغي الحكم الذي وجد المالك ليصدره."

Owner amendments (V3:6318-6320, decided by Omar, carried as rulings):

- رقم الإصدار مقترح فقط عند التجميع، والتعيين عند الإغلاق وفق القانون.
- تسمية وتغيير الترقيم فعل لا يُؤتمت أبدا، ويبقى خارج المجمع تماما.
- سجل التغييرات من السجل لا من الكتابة الحرة: كل سطر يتتبع إلى مدخل.

## 3. Harvest bounds (four steps, each stopping at the ruling)

The four unsupervised harvest steps, each defined by its stop line:

1. Receive: harvest inputs are received and recorded without waiting for the
   owner. Recording is mechanical; judging an input is not — an unjudged
   input waits.
2. Dedup-into-origin: a duplicate entry merges into its origin, never two
   entries planned twice. Merging needs a ruled origin; without one the entry
   waits at the ruling.
3. Cluster: converging inputs gather into one topic, never scattered. The
   grouping is mechanical over recorded entries; a grouping that needs
   judgment waits at the ruling.
4. Study-packs: grouped topics are shaped into study-ready packs, never raw
   lists. Shaping is mechanical; choosing what matters is a ruling and waits.

The bound holds for all four: a step runs unsupervised only on a ruled item
or a mechanical step; anything else stops at the owner ruling. A step that
overruns its bound is recorded as a breach, never excused as mechanical.

## 4. Gates and landing (ruled items only)

Gates run only on what was ruled: a gate on a non-ruled item is a hidden
ruling without an owner, and it is refused. Landing writes only what was
ruled: landing a non-ruled item fixes into the system what was never ruled,
and it is rejected. Every harvest entry in a cycle carries exactly one state:
ruled, mechanical, or stopped-at-ruling.

## 5. Draft-version assembler (approved improvements only)

A draft is assembled from approved improvements only, never from wishes or
raw inputs; each improvement enters with its approval record. Every draft
carries three things:

1. An inspectable diff showing exactly what changed against the approved set —
   a diff that does not match the approved improvements lies to the reviewer
   and fails review.
2. A changelog written from the ledger, never free prose: every line traces
   to a ledger entry, and an orphan line with no entry is rejected.
3. An advisory-only version number per the numbering law: proposed at
   assembly, never binding. Advisory number only; assigned at close.

The law governs the number: proposal at assembly, assignment at close, never
the reverse. A draft is a candidate awaiting close and assignment, never a
release — the candidate must never be treated as the released thing.

## 6. Naming and renumbering stay outside

Naming and renumbering are never automated and stay outside the assembler
entirely: automating them cancels the ruling the owner exists to issue. Any
request to name or renumber through the assembler is refused.

## 7. One by-exception bundle (exactly one)

The periodic shape is a single by-exception bundle carrying harvest, the gap
report, drafts, and exceptions — four sections, one bundle, never several
reports under one cover. What deserves attention arrives; the rest waits.
Exception thresholds are proposed by the plan and ruled by the owner, never
self-imposed: a threshold nobody ruled is a threshold that steers the owner's
attention without a ruling, and it is refused.

## 8. Clean supervised cycles first

The cycle runs supervised first: full cycles where the owner touches the
ruling step only, recorded with the owner's touches, before any wider
mandate. A wider mandate with no recorded clean supervised cycle is refused.
Clean is proven by the record, never claimed: every changelog line tracing,
no non-ruled landing, one bundle, owner touches on the ruling step only.

## 9. Open questions V3:6333-6351 (decided here, each with evidence)

- [6333] Exception thresholds: the plan proposes, the owner rules; a
  self-imposed threshold is refused. Evidence: V3:6291 + §7 threshold record.
- [6334] Rejected drafts: preserved whole as read-only records with a fate
  line ruled by the owner, never silently deleted. Evidence: V3:6290, 6303.
- [6335] Mechanical test: a step is mechanical only if its rule is declared
  up front and replayable with identical output; the harness replay is the
  review. Evidence: V3:6335 + probe replay.
- [6336] Unruled harvest entries after cycles: keep waiting, never
  auto-closed; closure needs an owner ruling. Evidence: V3:6336 stop-at-ruling.
- [6337] One-bundle proof: the bundle object carries exactly the four
  sections; any other count fails. Evidence: V3:6337 + bundle count check.
- [6338] Clean-cycle measure: a full cycle with owner touches on the ruling
  step only and every changelog line tracing; minimum one recorded clean
  cycle before any wider mandate, more if the owner demands. Evidence:
  V3:6338 + mandate gate.
- [6339] Draft whose approvals changed after assembly: reassembled, never
  patched. Evidence: V3:6339 + assembler approval re-check.
- [6340] Diff reviewer: machine check first (diff matches the approved set),
  owner confirms at ruling. Evidence: V3:6340 + diff-match check.
- [6341] Exception announcement: a ruling-first list where each exception
  names the ruling it needs; the owner reads exceptions only. Evidence:
  V3:6341 + §7 bundle shape.
- [6342] Cycle with no exceptions: the bundle is still issued with the
  exceptions section stating none; rhythm proves the habit. Evidence: V3:6340
  habit rule + bundle shape.
- [6343] Overreach logging: the overrunning step is recorded as a breach
  with step name and item; the owner reviews it at the next ruling.
  Evidence: V3:6343 + §3 breach rule.
- [6344] Mechanical proof: the step declares its rule up front; the probe
  replays it on fixtures. Evidence: V3:6344 + harness fixtures.
- [6345] Cycle where the owner touched more than the ruling: recorded as a
  breach, not counted clean; the owner rules whether it repeats. Evidence:
  V3:6345 + §8 touch record.
- [6346] Threshold review: the owner re-rules thresholds at each cycle
  ruling; no other cadence imposed. Evidence: V3:6346 + owner-ruled record.
- [6347] Rejected-draft storage: full draft preserved read-only with its
  fate line, reachable by the owner. Evidence: V3:6347 + [6334] record.
- [6348] Approved improvement changed before close: the draft is
  reassembled; the change re-enters as a new approval. Evidence: V3:6348 +
  assembler approval re-check.
- [6349] Clean versus successful: clean means every criterion met with
  evidence; success alone never equals clean. Evidence: V3:6349 + §8 record.
- [6350] Bundle announcement: to the parties each exception's scope names,
  never broadcast-all. Evidence: V3:6350 by-exception rule.
- [6351] Late inputs: held to the next cycle, never shipped partial; the
  bundle states what was held. Evidence: V3:6351 + receive stop-line.

## 10. Fallback, install honesty, and touch limits

FBLD-30 carried verbatim (FLAGGED, never resolved here):

FBLD-30 — Slot 0.9.30 — Conflict: V3 slot scope versus pre-assigned number promise — Fallback: advisory number only; assigned at close — Matches LD-30 — Status FLAGGED, never resolved.

The slot label 0.9.30 above is LD identity data only; the draft number rule
(advisory number only; assigned at close) is enforced by harness check
`advisory-number-only`, which fails on any assigning reading.

install_cmd: null, verification: unverified. No install command exists for
this mechanism; nothing here is provisioned, fetched, or installed.

This node touches only its 3 files; it never touches README.md,
README.ar.md, main, tags, state files, or any other version branch.
