# POST87-INTAKE — Structure Map of the Owner-Verified Post-v8.7 Blueprint

- Mission lane: `POST87-APPLY` (all prior lanes closed/parked; this is new mission work)
- Node: `p87-intake` (wave 0, Phase 0 intake)
- Concern: file the owner-verified post-v8.7 architecture blueprint faithfully and produce the
  structure map that Phase 0 reconciliation will follow (work order §2.1)
- Owner: `vantrilex-librarian` (worker-only; proposes nothing, applies nothing beyond the two
  artifacts named in the brief)
- Scenario classification: **1 — NEW TASK**. No task was in flight, so no checkpoint/park step
  applies. The brief also excludes Scenario 2 explicitly and declares Scenario 1 by name.
- Date: 2026-10-21

---

## 1. Version context

| Field | Value | Read live from |
|---|---|---|
| Kit identity | `vantrilex-core` | `kit/kit.lock` key `kit` |
| Lockfile format version | `1` | `kit/kit.lock` key `lockfileVersion` |
| Kit semver | not carried | `kit/kit.lock` exposes only `lockfileVersion`, `kit`, `mcp_cap`, `components`, `pending` |
| Mission subject | post-v8.7 | `docs/spec/post87/BLUEPRINT.md:1` and the work order title |

No kit semver is asserted anywhere in this report. `kit/kit.lock` carries no version
string, so any semver claim here would be invented. This node is qualified by mission
subject (`post-v8.7`) plus lock identity (`vantrilex-core`, lockfileVersion 1).
Version-range fit of RAG entries is wave-1 reconciliation work and is not scored here.

---

## 2. Source verification (task 1)

Source path (external, reading explicitly authorized by the brief for this node only):

`O:\opencode-Vantrilex\docs\مخطط معمارية وتطوير Vantrilex Arsenal.md`

| Check | Command | Output | Exit |
|---|---|---|---|
| Exists | `Test-Path -LiteralPath <source>` | `True` | `0` |
| Size | `(Get-Item -LiteralPath <source>).Length` | `123461` bytes | `0` |
| SHA-256 | `(Get-FileHash -LiteralPath <source> -Algorithm SHA256).Hash` | `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D` | `0` |
| Line feeds | byte scan for `0x0A` | `LF_count=289` | `0` |
| Carriage returns | byte scan for `0x0D` | `CR_count=0` | `0` |
| Encoding | `UTF8Encoding(false, throwOnInvalidBytes: true).GetString(bytes)` | `strictUTF8Decode=OK`, `charCount=82849` | `0` |
| BOM | first 3 bytes | `UTF8_BOM_present=False`, `first3bytes=23 20 2A` (`# *`) | `0` |
| Line count | split on `0x0A` | `290` lines; file does **not** end with a newline | `0` |
| Last line | `lines[289]` | `> 41. asgeirtj/system\_prompts\_leaks: Documented system ...` (length `175`) | `0` |

Encoding verdict: **UTF-8 without BOM, LF-only line endings, no CR characters, no invalid
byte sequences.** No anomaly was found at the container level. Two container notes are
recorded rather than corrected: the file has no trailing newline, and `90` lines carry a
trailing double space (Markdown hard-break markers inherited from a document export).
Content carries literal backslash escapes (`\#` appears `69` times, `\.` and `\_` likewise),
so quoted text below preserves those backslashes exactly.

---

## 3. Filing (task 2)

| Step | Command | Output | Exit |
|---|---|---|---|
| Create directory | `New-Item -ItemType Directory -Force -Path docs/spec/post87` | `True` | `0` |
| Byte-exact copy | `Copy-Item -LiteralPath <source> -Destination docs/spec/post87/BLUEPRINT.md -Force` | (no output) | `0` |
| Destination SHA-256 | `(Get-FileHash -LiteralPath docs/spec/post87/BLUEPRINT.md -Algorithm SHA256).Hash` | `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D` | `0` |
| Destination size | `(Get-Item -LiteralPath docs/spec/post87/BLUEPRINT.md).Length` | `123461` bytes | `0` |

Equality proof: source hash `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D`
equals destination hash `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D`;
source byte count `123461` equals destination byte count `123461`. No text change, no
wrapping, no normalization, no added header.

---

## 4. Integrity gate

This report asserts **no catalog id**. The blueprint's own component identifiers
(`vantrilex-*`, `vs-*`, `Tier-1`/`Tier-2` names) appear only inside verbatim quoted blocks
and are the blueprint's claims, not librarian-resolved facts. The gate therefore had no id
to resolve for this report, and resolution of any of those identifiers is wave-1 work. No
claim in this report depends on an id that was not quoted from the filed artifact.

Method note: every Arabic block below was injected mechanically from
`docs/spec/post87/BLUEPRINT.md` by line range, not retyped, and then re-checked as a
substring of the artifact. The anchor after each block names the exact line.

---

## 5. (a) Binding decisions — ق-1 to ق-7

### ق-1 — Staged model selection with cost transparency and zero pins

Anchor: `docs/spec/post87/BLUEPRINT.md:23`

```ar
1. **آلية اختيار النماذج المرحلية بشفافية الكلفة وبدون أي دبابيس (ق-1):** يُحذف أي تثبيت لنماذج محددة (لا نماذج ثابتة للقادة أو للوكلاء الجانبيين كقانون نظام، ولا أي حقل model: في أي ملف وكيل). وعند بداية كل مرحلة، يعرض مدير الجلسة على المستخدم اختيار نموذج كل طبقة من الطبقات الثلاث: (أ) طبقة Zenith، (ب) طبقة القادة الثلاثة (PULSAR / AETHER / BLAZAR)، (ج) طبقة الوكلاء الجانبيين، أو الإبقاء على الترتيب المحفوظ الحالي إن وُجد — والافتراضي دائماً هو الإبقاء، ولا يُعاد السؤال داخل المرحلة الواحدة. وعند عرض الاختيارات تُذكر حالة كلفة كل نموذج (مجاني / مدفوع) صراحةً ليكون اختيار المستخدم مستنيراً دون منع أي اختيار.
```

Gloss: every fixed model choice is deleted and any per-agent model pin is forbidden; at the
start of each phase the session manager offers the user a model choice per layer (Zenith,
the three leaders, the subagent layer) with each model's free/paid cost shown, the default
is to keep the saved arrangement, and the question is not repeated inside one phase.

Also carried at `:66`, `:184`, `:224`, `:237`.

### ق-2 — Lock abolished; one complete 100%-verified catalog is the sole source

Anchor: `docs/spec/post87/BLUEPRINT.md:33–38`

```ar
بموجب القرار الإلزامي (ق-2)، تُحسم معمارية المكونات عبر أربع قواعد قطعية:

1. **إلغاء القفل نهائياً (Zero Lockfiles):** يُلغى مفهوم القفل نهائياً؛ فلا وجود لـ kit.lock ولا core lock ولا نواة مجمّدة في المعمارية المعتمدة، وتُحذف كافة مراجع القفل من شجرة التشغيل.
2. **المصدر الوحيد — كتالوج واحد كامل ومفحوص 100%:** المصدر الوحيد لكافة المكونات هو الكتالوج الموحد الكامل (registry/catalog.json وشظاياه registry/data/\*.jsonl المحكومة بالمخطط registry/schema/catalog-v3.schema.json)، ويضم كل المهارات والوكلاء (Zenith والقادة الثلاثة ومئات الوكلاء الجانبيين) وخوادم MCP وأنظمة التصميم والخطافات والسمات. وكل عنصر في الكتالوج الحي مفحوص بالكامل ومصقول بآلية البوتقة بنسبة 100% (verification: "verified" حصراً — لا عناصر unverified ولا pending في الكتالوج الحي إطلاقاً).
3. **بيان تجهيز المشروع كسجل اختيارات لا كقفل (.opencode/equip.manifest.json):** يبقى بيان التجهيز سجلاً توثيقياً لما اختير لمشروع أو مرحلة (Selection Record) وليس قفلاً يجمّد النظام.
4. **التوسع لمئات الوكلاء الجانبيين (ق-4):** نظراً لأن المصنع سيغذي الكتالوج بمئات الوكلاء الجانبيين، يُفهرَس الكتالوج بفهرس قدرات عكسي متعدد المفاتيح (Inverted Index by \[dimension, stage, category, brand\_mcp\]) يتيح استخلاص المرشحين في زمن O(1) للمجموعة الوظيفية دون تحميل مئات الوكلاء في سياق النموذج.
```

Gloss: `kit.lock`, any core lock, and every frozen core are abolished and all lock
references leave the operating tree; the sole source of components becomes the complete
unified catalog (`registry/catalog.json` plus `registry/data/*.jsonl` under
`registry/schema/catalog-v3.schema.json`) whose every live element is verified with zero
`unverified` or `pending` entries; `.opencode/equip.manifest.json` remains a documentation
record of selections, not a lock; and the catalog is indexed to absorb hundreds of
factory-produced subagents.

Also carried at `:29`, `:53`, `:128`, `:225`, `:238`.

### ق-3 — Eighth category `mcp-specialist`, colored by official platform brand colors

Anchor: `docs/spec/post87/BLUEPRINT.md:226`

```ar
9. **اعتماد الفئة الثامنة (mcp-specialist) بألوان شعارات المنصات (ق-3):** احتفاظ وكلاء المنصات المخصصة بألوان شعارات منصاتهم (Vercel أبيض \#FFFFFF، Supabase أخضر فيروزي \#3ECF8E، إلخ) مع إغلاق العيوب الميكانيكية F-COLOR-01..08 وC-01..07.
```

Gloss: platform-dedicated agents keep their platform's official logo color, and this is the
decision that establishes `category: "mcp-specialist"` as the eighth category, coupled with
closing the mechanical color defects `F-COLOR-01..08` and the cross-surface conflicts
`C-01..07`.

Operative detail lives at `:137` (the third pillar, which names `ق-3` as the explicit owner
decision) and at `:239`. ق-3 has no standalone entry in the governing-decisions block of
`:21`; see open item `O-2`.

### ق-4 — Zenith leads the base session; design for hundreds of subagents

Anchor: `docs/spec/post87/BLUEPRINT.md:38`

```ar
4. **التوسع لمئات الوكلاء الجانبيين (ق-4):** نظراً لأن المصنع سيغذي الكتالوج بمئات الوكلاء الجانبيين، يُفهرَس الكتالوج بفهرس قدرات عكسي متعدد المفاتيح (Inverted Index by \[dimension, stage, category, brand\_mcp\]) يتيح استخلاص المرشحين في زمن O(1) للمجموعة الوظيفية دون تحميل مئات الوكلاء في سياق النموذج.
```

Gloss: because the factory will feed hundreds of subagents into the catalog, the catalog is
indexed by a multi-key inverted capability index over `[dimension, stage, category, brand_mcp]`
yielding `O(1)` candidate retrieval for a functional set without loading hundreds of agents
into the model context.

Also carried at `:66`, `:184`, `:227`, `:240`.

### ق-5 — Harness² is never adopted operationally; patterns only

Anchor: `docs/spec/post87/BLUEPRINT.md:12` and `docs/spec/post87/BLUEPRINT.md:241`

```ar
وتقدم المعمارية الرابعة، وهي Google Research Harness² (google-research/harness2)، مفهوم فصل تحسين السرج عن تدريب أوزان النموذج عبر حلقة تكرار تطبق خطوة التحسين التبايني (Propose–Probe–Compose) وسجل الدروس المستفادة EXPERIENCE.md. وتُكتب صيغة التحسين التبايني نصاً قابلاً للقراءة الآلية (وفق م-2) كالتالي: Phi(x, H, E, R\_t) \-\> (H\_prime, E\_prime, L)، حيث يمثل x المهمة الحالية، وH سرج التنفيذ الحالي، وE \= (tau, y) سجل التنفيذ المحلي، وR\_t آلية التحسين الثابتة، بينما يعيد المشغل Phi السرج المحسّن H\_prime وسجل تنفيذه E\_prime \= (tau\_prime, y\_prime) وسجل الأدلة L. ويكشف التدقيق الاقتصادي أن تشغيل السبر المتوازي بميزانية K يتطلب Total\_Runs(K) \= 1 (H\_0) \+ K (Invariant Probes) \+ K (Domain Probes) \+ K (Composed Runs) \= 3K \+ 1 تشغيلاً كاملاً للمهمة (بكلفة مضاعفة 6x–8x)، فضلاً عن فتح الشبكة وتعطيل صندوق الرمل افتراضياً أثناء السبر. وبموجب القرار الإلزامي (ق-5)، لا تُعتمد أداة Harness² نفسها في أي موضع في المعمارية الحالية (لا بوابة، ولا محرك، ولا تشغيل)، بل تُستخلص أنماطها المفيدة فقط (Propose–Probe–Compose وسجل التعلم) لبناء آلياتنا الذاتية الخاصة.
```

```ar
| **إصلاح 5** | إزالة أي اعتماد تشغيلي لأداة Harness² في المعمارية الحالية (لا محرك ولا بوابة ولا تشغيل)، واستخلاص أنماطها المفيدة فقط (Propose–Probe–Compose وسجل التعلم EXPERIENCE.md) لبناء بوابة الصقل التبايني الذاتية الخاصة بنا في البوتقة وحلقة التعلم المستقبلية في سرج Zenith | **ق-5** \+ **م-1** | المحور 1 (تحليل المعمارية الرابعة والجدول والقرارات الحاكمة)، المحور 5 (البوابة الثالثة والمرحلة الثالثة)، المحور 8 (vantrilex-intake-send)، المحور 9 (توصية 3)، والخلاصة التنفيذية |
```

Gloss: Harness² is not adopted anywhere in the current architecture — not as a gate, not as
an engine, not as a run; only its useful patterns (`Propose–Probe–Compose` and the learning
record `EXPERIENCE.md`) are extracted to build our own native mechanisms.

Also carried at `:25`, `:123`, `:215`.

### ق-6 — Fixed, final harness sequence

Anchor: `docs/spec/post87/BLUEPRINT.md:24`

```ar
2. **تسلسل السرج المعتمد الثابت والنهائي (ق-6):** التسلسل المعتمد حصراً هو: **OpenCode v2 حالياً ← ثم dsh ← ثم سرجنا الخاص Zenith**. المراحل التي تسبق سرج Zenith هي مراحل اعتماد مؤقت، والوجهة النهائية هي سرجنا الخاص Zenith. وفي المرحلة الحالية على OpenCode v2، يُدمج .opencode/plugins/vantrilex-guards.ts (328 سطراً) داخل .opencode/plugin/arsenal.ts (2,371 سطراً) لإنهاء ازدواجية الخطافات، مع فحص توافر الخطافات الستة الموثقة في 17-V2-HOOK-GAP.md.
```

Gloss: the adopted sequence is exclusively OpenCode v2 now, then dsh, then our own Zenith
harness; every stage before Zenith is a temporary adoption and Zenith is the final
destination; in the current OpenCode v2 stage `vantrilex-guards.ts` (328 lines) is merged
into `arsenal.ts` (2,371 lines) to end hook duplication, together with probing the six
documented hooks.

Also carried at `:229`, `:242`.

### ق-7 — Future Zenith harness sits on dsh or Harness², decided at build time

Anchor: `docs/spec/post87/BLUEPRINT.md:25`

```ar
3. **قاعدة السرج المستقبلي Zenith (ق-7) وحظر تشغيل Harness² وRuflo كمكونات (ق-5 وم-5):** عندما يحين بناء سرجنا الخاص Zenith، سيُبنى فوق أحد أساسين: **dsh أو Harness²** — ويُختار الأساس وقتها حسب حالة كل منهما عند البناء (النضج، ثبات الواجهات، الملاءمة). وهذا قرار مؤجل عمداً لا يُحسم الآن ولا يعني اعتماد أيٍّ منهما في المعمارية الحالية؛ فحتى ذلك الحين يبقى تسلسل ق-6 سارياً، ويبقى كل من Harness² وRuflo مصدر أنماط مفاهيمية فقط لبناء آلياتنا الذاتية الخاصة دون إدخال أدواتهما أو مكوناتهما في التصميم الحالي.
```

Gloss: when Zenith's own harness is built it will sit on one of two bases, dsh or Harness²,
chosen at that time by maturity, interface stability and fit; this is deliberately deferred
and does not adopt either base now, does not disturb the ق-6 sequence, and keeps both
Harness² and Ruflo as conceptual pattern sources only.

Also carried at `:229`, `:243`.

---

## 6. (b) Methodology rules — م-1 to م-6

The blueprint never carries a dedicated methodology section. Each rule is defined
operationally by the closing "change ledger" row that applies it, and م-1 is the exception
that has no definition at all.

### م-1 — Undefined in the source

Anchor: `docs/spec/post87/BLUEPRINT.md:237` (co-citation only)

```ar
| **إصلاح 1** | حذف كافة النماذج الثابتة (Muse Spark 1.3, DeepSeek V4.1 FLASH, Opus 4.8) وحظر حقل model:، واستبدالها بآلية سؤال المستخدم في بداية كل مرحلة لاختيار نموذج كل طبقة (Zenith / القادة / الوكلاء الجانبيين) مع عرض حالة الكلفة (مجاني/مدفوع) صراحةً، وجعل الافتراضي هو الإبقاء دون إعادة السؤال داخل المرحلة | **ق-1** \+ **م-1** | المحور 1 (النص والجدول والقرارات الحاكمة)، المحور 3 (بند 4 وجدول الوكلاء الجدد)، المحور 8 (جدول المستويات الأربعة وvantrilex-agent-maker)، والخلاصة التنفيذية |
```

Status: **undefined**. م-1 is cited as co-applied with `ق-1` at `:237`, `ق-2` at `:238`,
`ق-5` at `:241`, and `ق-6` at `:242`, and it is named in the executive framing at `:222`,
but no line in the filed artifact states what rule م-1 is. No gloss is offered here because
a gloss would be an invention; see open item `O-1`.

### م-2 — All mathematics and quantitative limits written as explicit text

Anchor: `docs/spec/post87/BLUEPRINT.md:244`

```ar
| **إصلاح 8** | كتابة جميع الصيغ الرياضية والحدود الكمية نصاً صريحاً وجداول مقروءة آلياً (Phi(x, H, E, R\_t)، 3K \+ 1، D\_proj، قيد صفر تجويع، S\_next \= S (+) Delta\_S، CosineSimilarity \>= 0.92، N\_cluster \>= 3، وصيغ جدول المحور الثاني) | **م-2** | المحور 1، المحور 2 (النص والجدول)، المحور 3 (فقرتا AETHER وBLAZAR)، المحور 5 (المرحلة 2 و4)، المحور 8 (الجدول)، والمحور 9 |
```

Gloss: every formula and quantitative bound is written out as explicit text and as
machine-readable tables — `Phi(x, H, E, R_t)`, `3K + 1`, `D_proj`, the zero-starvation
constraint, `S_next = S (+) Delta_S`, `CosineSimilarity >= 0.92`, `N_cluster >= 3`, and the
provisioning-limit table.

Also applied at `:12`, `:42`, `:44`, `:75`, `:128`, `:249`.

### م-3 — Capability claims tagged by evidence class

Anchor: `docs/spec/post87/BLUEPRINT.md:245`

```ar
| **إصلاح 9** | وسم ادعاءات قدرات OpenCode الحالية بدقة (مثبت على نسخة المستودع المثبتة لخطافي tool.execute.before/after ولكون الخطافات الستة خاملة في 17-V2-HOOK-GAP.md، مقابل غير مُتحقق بعد على النسخة المثبتة لأحداث OpenCode 2.x الجديدة) مع إضافة فاحص قدرات حي (Hook Capability Probe) وبوابة بديلة | **م-3** | المحور 1 (تحليل المعمارية الثالثة، وجدول المقارنة، والقرارات الحاكمة)، والخلاصة التنفيذية |
```

Gloss: claims about current OpenCode capability are labelled precisely — proven on the
pinned repository build for `tool.execute.before`/`tool.execute.after` and for the six
hooks being dormant in `17-V2-HOOK-GAP.md`, versus "unverified on the pinned runtime" for
the newer OpenCode 2.x events — and a live Hook Capability Probe plus a fallback gate is
added.

Also applied at `:11`.

### م-4 — Per-project kill switch / opt-out gate

Anchor: `docs/spec/post87/BLUEPRINT.md:246`

```ar
| **إصلاح 10** | إضافة مفتاح إيقاف/استثناء لكل مشروع (Per-Project Kill-Switch & Opt-Out Gate: vantrilex.enabled: false أو .vantrilex-disable أو VANTRILEX\_DISABLED=1 أو excludedProjects) يُفحص قبل تشغيل أي خطاف عالمي في المشروع | **م-4** | المحور 4 (قسم محرك الفحص وفلاتر الرؤية والاستعادة)، والخلاصة التنفيذية |
```

Gloss: a per-project stop and exclusion switch — `vantrilex.enabled: false` in
`.opencode/config.json`, the file `.opencode/.vantrilex-disable`, the environment variable
`VANTRILEX_DISABLED=1`, or a project path in the global `excludedProjects` list — is checked
before any global hook runs in that project.

Also applied at `:109`.

### م-5 — External components enter only through the factory and crucible

Anchor: `docs/spec/post87/BLUEPRINT.md:247`

```ar
| **إصلاح 11** | إلزام أي مكون خارجي (مثل RAG-Anything, LightRAG, إلخ) بالمرور بمسار قبول المصنع والبوتقة كمرشح كتالوج أولاً قبل دخوله التصميم، وحصر Ruflo (ruvnet/ruflo) في استلهام الأنماط فقط دون استيراد أي مكون برمجي منه (حذف اعتماد AgentDB وReasoningBank واستبدالهما بفهرس محلي ذاتي) | **م-5** | المحور 1، المحور 3 (فقرة PULSAR وفقرة vantrilex-context-offloader)، المحور 5 (البوابة الرابعة)، المحور 8، المحور 9 (التوصيات 1 و4 و5)، والخلاصة التنفيذية |
```

Gloss: any external component (RAG-Anything, LightRAG and the like) must first pass the
factory and crucible acceptance path as a catalog candidate before entering the design, and
Ruflo (`ruvnet/ruflo`) is confined to pattern inspiration with no component imported — the
AgentDB and ReasoningBank dependencies are dropped in favour of a self-built local index.

Also applied at `:74`, `:123`, `:191`, `:216`, `:217`.

### م-6 — Full preservation of the report's engineering strengths

Anchor: `docs/spec/post87/BLUEPRINT.md:248`

```ar
| **إصلاح 12** | الحفاظ الكامل على نقاط قوة التتقرير الهندسية (التدقيق الخصومي ومصائد الأداء الخمس، الوكلاء الأربعة الجدد وفي مقدمتهم vantrilex-journey-verifier، أقفال Blocking Diffs، الكوميت الذري لكل تحسين ولقطة ما قبل إعادة الهيكلة، كبسولات الحالة المتدحرجة، وإصلاحات F-COLOR-01..08 وC-01..07) | **م-6** | المحاور 3 و6 و7 و8 و9 بالكامل |
```

Gloss: the adversarial audit, the five performance traps, the four new agents led by
`vantrilex-journey-verifier`, `Blocking Diffs` locks, the commit-per-improvement law with its
pre-refactor snapshot, rolling state capsules, and the `F-COLOR-01..08` / `C-01..07` repairs
are all preserved in full.

Also applied at `:239`, `:240`.

---

## 7. (c) Named axes, domains and phases, with every explicit limit

### 7.1 The nine axes (المحاور)

| # | Title as named | Anchor |
|---|---|---|
| 1 | Comparative study of the target harness architectures (4-way trade-off) | `:3` |
| 2 | Abolishing the lock, adopting the single complete catalog, Goldilocks provisioning | `:27` |
| 3 | Developing the three leaders (AETHER, BLAZAR, PULSAR) plus Zenith, and new agents/skills for the six video gaps | `:55` |
| 4 | Global user-scope provisioning | `:93` |
| 5 | The Arsenal Factory and Crucible pipeline | `:112` |
| 6 | New taxonomy and colors for subagents (self-scoped and MCP-dedicated) | `:130` |
| 7 | Critical deep audit and cross-surface conflict detection | `:154` |
| 8 | Flexible four-tier hierarchical workflow and the golden standard for skills and agents | `:178` |
| 9 | Additional strategic engineering recommendations | `:209` |

Followed by the executive summary and roadmap (`:220`) and the closing change ledger
(`:231`).

### 7.2 Domains, stages and phases

| Structure | Members | Anchor |
|---|---|---|
| Technical dimensions `D_proj` | `{UI_UX, Backend_API, Database_ORM, Auth_Security, Testing_E2E, DevOps_CI, AI_RAG, Observability}` | `:52` |
| Work lifecycle stages `S` | `{scout, plan, build, review, audit, release}` | `:52` |
| Coverage grid | `8 * 6 = 48` cells | `:52` |
| Leadership chain | user → Zenith (`mode: primary`) → three Tier-1 leaders (PULSAR, AETHER, BLAZAR, `mode: subagent`) → Tier-2 workers (`vantrilex-*`) | `:63`–`:65` |
| Workflow tiers | Project, Task, Feature, Phase | `:193`–`:198` |
| Size classes | `Nano <= 20 lines`, `Micro <= 100 lines`, `Standard`, `Macro` | `:191` |
| AETHER protocols | 75% interactive planning, LangGraph single-responsibility nodes, sequential-business-logic and production-parity gate | `:70`–`:72` |
| BLAZAR controls | Blocking Diffs locks, `checkRunLimits` plus cosine similarity, Parallel Dev Bridge | `:75`–`:76` |
| New agent/skill pairs | `vantrilex-reuse-guard`, `vantrilex-context-offloader`, `vantrilex-journey-verifier`, `vantrilex-prod-parity` (each with one companion skill) | `:82`–`:87` |
| Functional categories | seven standard groups (`dev, design, review, audit, docs, operate, exploration`) plus `self:<domain>` fallback, plus the eighth `mcp-specialist` | `:137` |
| Color pillars | base-session leadership (`supreme-orchestrator`), seven functional groups plus `self:<domain>`, `mcp-specialist` | `:136`–`:137` |
| Crucible stages | intake and quarantine triage, evaluation-driven polish, staged upload, dynamic assimilation | `:116`, `:120`, `:125`, `:128` |
| Polish gates | four consecutive gates (reformat + `verify-skills.mjs`, simplicity filter, native contrastive polish, schema derivation) | `:122`–`:123` |
| Provisioning gates | three announced, two defined (anti-starvation coverage; anti-excess DAG pruning) | `:42`, `:52`–`:53` |
| Global-install mechanisms | visibility filters, per-project kill switch, non-destructive doctor, safe restore | `:108`–`:110` |
| Golden-standard pillars | live-source grounding and escalation, hard negative constraints, read-before-write ladder plus risk footer, `verify-skills.mjs` structural purity | `:204` |
| Performance traps | five (read-only tool tax, false-positive tsc path, double hook registration, `vs-*` duplication, review agents as hard gates) | `:160`–`:162` |
| Source videos | `z-2IVs3PrvU`, `nr68Qx7iits`, `NapBxmn1Zpo`, `MI73eGOmuZU`, `6r1T5i0i39s`, `bn0OERtDocE` | `:57` |
| Fixed harnesses to compare | Claude Code official plugin, dsh, OpenCode v2 (`arsenal.ts`), Google Harness² | `:14`–`:19` |

### 7.3 Verbatim provisioning law (the densest numeric block)

Anchor: `docs/spec/post87/BLUEPRINT.md:44–53`

```ar
5. وبفرض أن \`d \= |D\_proj|\` يمثل عدد الأبعاد التقنية المكتشفة حيث \`1 \<= d \<= 8\`، وأن \`L\_lang\` يمثل عدد لغات البرمجة النشطة، تُفرَض صيغ حدود الأرضية والسقف القابلة للقراءة الآلية (مع تقدم **منع التقتير كأولوية أولى** عند أي تعارض وفق ق-2) على النحو التالي:
* **فئة \`skill\` (السعة في الكتالوج \`1,505+\` مفحوصة 100%):** الحد الأدنى لسجل المشروع \`L\_min \= 2\*d \+ 4\` | السقف الإرشادي لسجل المشروع \`U\_max \= 4\*d \+ 12\` | الحد الأدنى للمرحلة \`Stage\_Floor \= 2\` | الحد الأقصى للعقدة/المرحلة \`Stage\_Ceiling \= 12\`.
* **فئة \`agent\` (السعة \`301+\` وتتسع لمئات الوكلاء الجانبيين عبر المصنع — ق-4):** الحد الأدنى لسجل المشروع \`L\_min \= 1 (Zenith) \+ 3 (Leaders) \+ d \+ 4\` | السقف الإرشادي \`U\_max \= 4 \+ 3\*d \+ 10\` (يتمدد لمنع التقتير) | الحد الأدنى للمرحلة \`Stage\_Floor \= 1 (Leader) \+ 2 (Workers)\` | الحد الأقصى للدفعة المتزامنة \`Stage\_Ceiling \= 6 Concurrent Workers\`.
* **فئة \`mcp\` (السعة \`923+\` مفحوصة 100%):** الحد الأدنى لسجل المشروع \`L\_min \= min(d, 3)\` | السقف الإرشادي \`U\_max \= 14\` (أو بعدد المنصات الفعلية) | الحد الأدنى للمرحلة \`Stage\_Floor \= 1\` | الحد الأقصى اللحظي \`Stage\_Ceiling \= 8 (mcp\_cap \= 8)\`.
* **فئة \`cli\` (السعة \`64+\`):** الحد الأدنى لسجل المشروع \`L\_min \= L\_lang\` | السقف الإرشادي \`U\_max \= 2\*L\_lang \+ 4\` | الحد الأدنى للمرحلة \`Stage\_Floor \= 1\` | الحد الأقصى اللحظي \`Stage\_Ceiling \= 4\`.
* **فئة \`lsp\` (كافة خوادم اللغات بالكتالوج الموحد):** الحد الأدنى لسجل المشروع \`L\_min \= L\_lang\` | السقف \`U\_max \= L\_lang\` | الحد الأدنى للمرحلة \`Stage\_Floor \= 1\` | الحد الأقصى اللحظي \`Stage\_Ceiling \= L\_lang (\<= 3)\`.
* **فئة \`design.md\` (السعة \`84+\`):** الحد الأدنى لسجل المشروع \`L\_min \= 1 (للواجهة) \+ مراجع منصات mcp-specialist\` | السقف \`U\_max \= 1 \+ عدد وكلاء المنصات المختارين\` | الحد الأدنى للمرحلة \`Stage\_Floor \= 0 أو 1\` | الحد الأقصى اللحظي \`Stage\_Ceiling \= 2\`.
* **فئة \`hook & formatting\` (السعة \`20 \+ 13 \= 33+\`):** الحد الأدنى لسجل المشروع \`L\_min \= 7 (حراس الكتالوج الأساسيون بدون قفل)\` | السقف \`U\_max \= 7 \+ 2\*L\_lang\` | الحد الأدنى للمرحلة \`Stage\_Floor \= 3\` | الحد الأقصى اللحظي \`Stage\_Ceiling \= 7\`.
6. **البوابة الأولى — منع التقتير كأولوية أولى عبر مصفوفة التغطية الإلزامية:** يمسح vantrilex-vanguard ملفات المستودع (package.json, pyproject.toml, Cargo.toml, go.mod, docker-compose.yml, .github/workflows, prisma/schema.prisma) لاستخلاص متجه الأبعاد النشطة للمشروع D\_proj من بين الأبعاد الثمانية القياسية:\`D\_proj subset\_of {UI\_UX, Backend\_API, Database\_ORM, Auth\_Security, Testing\_E2E, DevOps\_CI, AI\_RAG, Observability}\`وتُقاطع هذه الأبعاد مع المراحل الست لدورة حياة العمل \`S \= {scout, plan, build, review, audit, release}\` لتشكيل شبكة تغطية من \`8 \* 6 \= 48\` خلية. ويُفرَض قيد صفر تجويع (Zero-Starvation Hard Constraint) الذي يشترط لكل بُعد مكتشف \`d in D\_proj\` أن تحتوي مجموعة الاختيار \`E\_selected\` على ثلاثية مكتملة على الأقل من الكتالوج الموحد تضم مهارة ووكيلاً جانبياً مختصاً وأداة تنفيذية:\`For\_All d in D\_proj : |E\_selected intersect Skill(d)| \>= 1 AND |E\_selected intersect Agent(d)| \>= 1 AND |E\_selected intersect Tool(d)| \>= 1\`وعند أي تعارض بين سقف التقليم وبين تغطية بُعد تقني في المشروع، **يتقدم منع التقتير وجوباً** فلا يُترك أي بُعد عارياً.
7. **البوابة الثانية — منع الإسراف عبر تقليم الرسم البياني الموجه اللاحلقي (DAG Overlap Pruning):** عقب تأمين تغطية كافة أبعاد D\_proj، تُطبق قواعد registry/data/overlaps.yaml لحذف التكرار المتطابق وظيفياً فقط وفق الصيغتين:\`supersedes(c\_i, c\_j) \==\> Remove(c\_j)\` (مثل إحلال vantrilex-scribe محل technical-writer العام)، و\`pairs\_with(c\_i, c\_j) AND covers\_gap(c\_j, D\_proj) \==\> Include\_Pair(c\_i, c\_j)\`.
```

### 7.4 Verbatim workflow-scaling and commit law

Anchor: `docs/spec/post87/BLUEPRINT.md:191`

```ar
(حيث تُستلهم أنماط بوابات المراحل فقط من تجارب الهندسة البرمجية دون استيراد أي مكون برمجي من \`ruflo\` وفق القاعدة م-5). متمثلاً القصور الأول في جمود المقياس (Scale Rigidity) والقصور الثاني في غياب التمييز بين المستويات الأربعة. ولمعالجة هذين القصورين وتوسيع النظام لمئات الوكلاء الجانبيين (ق-4)، يُدار العمل عبر أربعة مستويات متداخلة تتكيف مراسمها تلقائياً حسب تصنيف حجم التغيير (\`Nano \<= 20 lines\`, \`Micro \<= 100 lines\`, \`Standard\`, \`Macro\`) وفق المصفوفة التالية:
```

Anchor: `docs/spec/post87/BLUEPRINT.md:200`

```ar
وبالتزامن مع هذا التدرج الرباعي، يُلغى الخطأ الجسيم المتمثل في تجميع عشرات التعديلات وإعادة الهيكلة في commit واحد ضخم في نهاية المهمة عبر دمج قانون الكوميت الذري لكل تحسين (Commit-per-Improvement & Pre-Refactor Snapshot Law) داخل .opencode/plugin/arsenal.ts وWORKFLOW.md Part A1. يفرض هذا القانون أولاً لقطة ما قبل إعادة الهيكلة (Mandatory Pre-Refactor Snapshot)؛ حيث يُحظر على BLAZAR أو أي وكيل فرعي البدء في أي عملية إعادة هيكلة أو نقل دوال أو تغيير أسماء إذا كانت شجرة العمل غير نظيفة (git status \--porcelain غير فارغ)، ويلتقط النظام تلقائياً كوميت نظيفاً (chore(snapshot): pre-refactor clean state \[skip-release\]) لتأمين نقطة رجوع فورية1. ويفرض ثانياً إجراء كوميت ذري بعد كل تحسين صغير ناجح (Micro-Improvement Atomic Commit) فور اجتيازه للحارس الميكانيكي المحلي (tsc والاختبار المرتبط). كما يفرض ثالثاً حارس حجم التغيير (Diff Size Guard) في خطاف tool.execute.before داخل arsenal.ts؛ فإذا تجاوزت التعديلات غير المثبتة في شجرة العمل عتبة 120 سطراً أو 4 ملفات دون إجراء commit ذري، يطلق الخطاف تنبيهاً حاجزاً يجبر الوكيل على التحقق وتثبيت التحسين الجزئي الحالي قبل متابعة تعديل ملفات جديدة.
```

### 7.5 Verbatim capsule, index-threshold and spawn-threshold limits

Anchor: `docs/spec/post87/BLUEPRINT.md:213`

```ar
1. **بروتوكول كبسولة الحالة المتدحرجة (Rolling State Capsule Hand-off):** استناداً إلى محاضرة حلقة الوكيل (NapBxmn1Zpo)، يُحظر تمرير تاريخ المحادثة الكامل بين Zenith والقادة الثلاثة ومئات الوكلاء الجانبيين؛ بل يتبادلون حصراً كبسولات حالة موجزة (\< 200 كلمة) تتضمن: الهدف النشط، والقرارات المقفلة، والملفات المعدلة، والمسارات الفاشلة المستبعدة (Dead Ends)، والخطوة التالية، مما يمنع تعفن السياق ويخفض هدر التوكنز بنسبة 40%.
```

Anchor: `docs/spec/post87/BLUEPRINT.md:216`

```ar
4. **استلهام نمط عتبة التقاطع لفهرس HNSW وحلبة التنافس المعماري (تطبيقاً لـ م-5: Ruflo أنماط فقط لا مكونات):** باستلهام النمط الرياضي فقط من تجارب الفهرسة دون استيراد أي مكون من Ruflo، يستخدم الفهرس المحلي لـ vantrilex-context-offloader البحث الخطي المباشر في الذاكرة عندما يكون عدد عقد الرسم البياني في المشروع N\_nodes \< 1,000 عقدة، ويفعّل فهرس HNSW المحلي الخاص بنا تلقائياً عند N\_nodes \>= 1,000 عقدة، مع تطبيق نمط المفاضلة التنافسية بين مقترحات AETHER المعمارية بإشراف Zenith في المهام الحرجة.
```

Anchor: `docs/spec/post87/BLUEPRINT.md:218`

```ar
6. **اقتصاد تفريخ الوكلاء الجانبيين عند التوسع للمئات (Subagent Spawning Threshold — ق-4):** يُمنع إطلاق وكيل جانبي جديد للمهام الميكروية التي يمكن للقائد الفرعي حسمها بخطوة قراءة واحدة (rg \-n) أو تعديل أقل من 15 سطراً في ملف واحد، لتفادي كلفة تهيئة الوكيل الفرعي (Startup Overhead).
```

### 7.6 Verbatim inventory counts the blueprint asserts

Anchor: `docs/spec/post87/BLUEPRINT.md:132`

```ar
أثبت تدقيق الهوية البصرية والألوان (V87-COLOR-FINDINGS.md وتقارير FULL-AUDIT-3 §6.2–§6.4) وجود تصدع هيكلي بين النصوص الدستورية وبين الشجرة الحية للأرسنال (مثبت)1؛ فبينما ينص دستور الأرسنال وملف AGENT.md:106 على أن كل وكيل يحتفظ بسمته الخاصة ولونه المشتق من اللوحة حسب الوسم (every agent keeps its OWN theme, COLOR from palette by tag)، فإن 0 من أصل 24 ملف وكيل فرعي في الشجرة الحية (.opencode/agents/vantrilex-\*.md) يحمل حقل color: في ترويسة الـ YAML، بل إن 12 ملف وكيل فرعي تحتوي على نص صريح يحظر وجود اللون1. يضاف إلى ذلك وجود 9 سمات معلقة (pending) في kit/kit.lock، و6 أسماء وكلاء مشوهة ببادئة مزدوجة (vantrilex-vantrilex-\*) داخل registry/themes/vantrilex-atomic-switch.json، وتضارب حالة الأحرف في لون aether (\#14b8a6 مقابل \#14B8A6)، وتناقض وصف الفئة "reserved": "dark royal blue, BLAZAR only" في حين أنها مسندة للقادة الثلاثة معاً1.
```

Anchor: `docs/spec/post87/BLUEPRINT.md:149`

```ar
| **F-COLOR-05** | افتقار 24 وكيلاً فرعياً في .opencode/agents/vantrilex-\*.md لحقل color: في ترويسة YAML رغم أن RESEARCH.md:108 يثبت أن حقل color مسموح ومدعوم في OpenCode v21 | جميع ملفات .opencode/agents/vantrilex-\*.md (24 ملفاً \+ الـ 4 الجدد) | حقن حقل color: "\#RRGGBB" وحقل category: في ترويسة الـ YAML لكل ملف وكيل فرعي وفق جدول التصنيف الثلاثي الجديد1 |
```

Anchor: `docs/spec/post87/BLUEPRINT.md:99`

```ar
يُحظر في جميع ملفات الأرسنال (.opencode/plugin/arsenal.ts، والمهارات، والخطافات) كتابة مسارات مطلقة ثابتة مثل C:\\Users\\specific\_user\\... أو /Users/you/repos/... لأنها تكسر الإضافة فور انتقالها لجهاز آخر2. بدلاً من ذلك، تعتمد أداة التثبيت والنواة البرمجية دالة حسم موحدة resolveGlobalOpenCodeDir() تقرأ في نظام ويندوز (Windows NT) متغير البيئة %USERPROFILE%\\.config\\opencode (أو path.join(os.homedir(), '.config', 'opencode') في Node.js/Bun و\$env:USERPROFILE\\.config\\opencode في PowerShell)، مما يترجم تلقائياً إلى C:\\Users\\\<user\>\\.config\\opencode أياً كان اسم حساب المستخدم النشط \<user\>، بينما تقرأ في نظامي macOS وLinux (POSIX) المسار \${XDG\_CONFIG\_HOME:-\$HOME/.config}/opencode أي \~/.config/opencode1. وتمنع طوبولوجيا الطبقات المتراكبة (Two-Tier Overlay Architecture) تكرار نسخ الـ 27 وكيلاً والـ 37 مهارة داخل كل مشروع محلي عبر الفصل الواضح بين النطاقين كما يوضح الجدول التالي:
```

### 7.7 Machine-readable limit inventory

Derived, normalized notation. The authoritative form of each value is the verbatim block or
source line named in the anchor column; this table is a lookup aid, not a second source of
truth.

| Quantity | Value | Anchor |
|---|---|---|
| Active technical dimensions | `d`, `1 <= d <= 8` | `:44` |
| Active languages | `L_lang` | `:44` |
| `skill` catalog capacity | `1,505+` (100% verified) | `:45` |
| `skill` project floor / ceiling | `L_min = 2*d + 4` / `U_max = 4*d + 12` | `:45` |
| `skill` stage floor / ceiling | `2` / `12` | `:45` |
| `agent` catalog capacity | `301+` | `:46` |
| `agent` project floor / ceiling | `1 + 3 + d + 4` / `4 + 3*d + 10` | `:46` |
| `agent` stage floor / ceiling | `1 Leader + 2 Workers` / `6 concurrent workers` | `:46` |
| `mcp` catalog capacity | `923+` | `:47` |
| `mcp` project floor / ceiling | `min(d, 3)` / `14` (or actual platform count) | `:47` |
| `mcp` stage floor / ceiling | `1` / `8` (`mcp_cap = 8`) | `:47` |
| `cli` catalog capacity | `64+` | `:48` |
| `cli` project floor / ceiling | `L_lang` / `2*L_lang + 4` | `:48` |
| `cli` stage floor / ceiling | `1` / `4` | `:48` |
| `lsp` project floor / ceiling | `L_lang` / `L_lang` | `:49` |
| `lsp` stage ceiling | `L_lang (<= 3)` | `:49` |
| `design.md` capacity | `84+` | `:50` |
| `design.md` stage floor / ceiling | `0 or 1` / `2` | `:50` |
| `hook & formatting` capacity | `20 + 13 = 33+` | `:51` |
| `hook & formatting` project floor / ceiling | `7` / `7 + 2*L_lang` | `:51` |
| `hook & formatting` stage floor / ceiling | `3` / `7` | `:51` |
| Coverage cells | `48` | `:52` |
| Parallel-probe run budget | `Total_Runs(K) = 3K + 1` | `:12` |
| Probe cost multiplier | `6x–8x` | `:12` |
| Contrastive acceptance | `Delta_Score > 0` | `:123` |
| New-kind quorum | `N_cluster >= 3` homogeneous components | `:128` |
| Existing kinds | `16` | `:128` |
| Planning weight before build | `75%` of design weight | `:70` |
| Loop-cut similarity | `CosineSimilarity >= 0.92` for `2` consecutive rounds | `:75` |
| Loop-cut repeated error | same tool error `3` times | `:75` |
| Reuse-guard block threshold | `80%` functional similarity | `:89` |
| Offload trigger (three stated forms) | `28k–30k`, `28,000`, `28k` tokens | `:85`, `:90`, `:198` |
| Attention-degradation barrier | `30,000` tokens | `:90` |
| Post-offload summary cap | `< 2,500` tokens | `:90` |
| Rolling state capsule cap | `< 200` words | `:213` |
| Claimed token-waste reduction | `40%` | `:213` |
| HNSW activation threshold | `N_nodes >= 1,000` (linear below) | `:216` |
| Subagent spawn floor | one `rg -n` step, or `< 15` lines in one file | `:218` |
| Size-class bounds | `Nano <= 20 lines`, `Micro <= 100 lines`, then `Standard`, `Macro` | `:191` |
| Nano/Micro shortcut card | `15` lines | `:196` |
| Diff Size Guard | `120` lines or `4` files without an atomic commit | `:200` |
| Skill structural cap | `500` advisory, `450` target; `7` exact H2 headings | `:122`, `:204` |
| Reuse-guard AST probe | `80%`, `335`-line calendar component anecdote | `:74`, `:89` |
| vanguard size, current / target | `814` / `380` lines | `:206` |
| doctrine size, current / target | `782` / `410` lines | `:207` |
| Duplicate `vs-*` skills | `8`, of which `5` share a byte-identical description | `:162` |
| Agent files with `color:` | `0 of 24` | `:132` |
| Agent files in `.opencode/agents/` | `27`; separately `24 + 4` new | `:172`, `:149` |
| Commands | `18` in `.opencode/commands/`, `22` split across two dirs, `4` in the singular dir | `:172` |
| Pending themes | `9` | `:132` |
| Double-prefixed agent names | `6` | `:132` |
| Historically abolished lock split | `157` = `32` core + `125` conditional, `77` unverified, `9` pending | `:29` |
| Color findings / conflicts / lint defects | `F-COLOR-01..08` = `8`, `C-01..07` = `7`, `L13-07-054..057` = `4` | `:143`–`:152`, `:168`–`:176`, `:122` |
| Closing change ledger | fixes `1..13` | `:235`–`:249` |
| Core harness facts | `arsenal.ts` `2,371` lines / `95,885` bytes / `18` functions / `45` tests; `vantrilex-guards.ts` `328` lines | `:5` |
| Embedded images removed | `31` | `:249` |
| Reference list | entries `2`–`41` present; entry `1` absent; entry `18` empty | `:251`, `:267`, `:290` |

---

## 8. (d) Open items and ambiguity candidates

Listed only. Nothing here is resolved, ranked for correctness, or guessed.

| # | Observation | Anchor |
|---|---|---|
| O-1 | Rule `م-1` has no definition anywhere in the artifact. It is only co-cited with `ق-1`, `ق-2`, `ق-5` and `ق-6`, and named once in the executive framing. Its content is undefined. | `:222`, `:237`, `:238`, `:241`, `:242` |
| O-2 | `ق-3` has no standalone entry in the governing-decisions block, which enumerates only `ق-1`, `ق-4`, `ق-5`, `ق-6`, `ق-7`. `ق-3`'s only operative statements are the third color pillar and the executive summary item. | `:21`, `:137`, `:226`, `:239` |
| O-3 | The provisioning algorithm is announced as three consecutive gates but only two gates are defined; no third gate text exists. | `:42`, `:52`, `:53` |
| O-4 | The Crucible section heading promises a third and fourth stage, but the body opens mid-sentence with a dangling clause and carries no stage-three text before stage four begins. | `:125`, `:127`, `:128` |
| O-5 | The closing ledger opens with an orphan list item whose body is empty, then continues with the fix table. | `:233`, `:235` |
| O-6 | Executive-summary items are numbered `7`–`12`; items `1`–`6` are absent from the list. | `:224`–`:229` |
| O-7 | The reference list starts at entry `2`; entry `1` is missing and entry `18` is empty. | `:251`, `:267` |
| O-8 | Agent-file counts conflict: `27` files in `.opencode/agents/` versus `24` agent files versus `24 + 4` new. | `:99`, `:132`, `:149`, `:172` |
| O-9 | The four-way comparison table is structurally malformed: the header declares six columns, at least three body rows carry shifted or stray cells, and one row is almost empty. | `:14`–`:19` |
| O-10 | The global-scope row of the two-tier overlay table leaves its "components residing in this scope" cell empty, while the surrounding text says `27` agents and `37` skills live there. | `:99`, `:103` |
| O-11 | The `design.md` provisioning floor is stated as `0 or 1`, which is non-deterministic in an algorithm the same section calls deterministic. | `:42`, `:50` |
| O-12 | The harness sequence makes dsh the second adopted stage, while the future-base rule also names dsh as one of two candidate bases for Zenith. The relationship between "second stage" and "candidate base" is not stated. | `:10`, `:24`, `:25` |
| O-13 | The context-offload trigger appears three ways (`28k–30k`, `28,000`, `28k`); whether `28,000` is the trigger with `30,000` as a ceiling is not stated. | `:85`, `:90`, `:198` |
| O-14 | Two similarity mechanisms with different scales coexist — an `80%` functional-similarity reuse block and a `0.92` cosine loop cut — with no stated relation between them. | `:75`, `:89` |
| O-15 | The `vs-*` duplicate skills are addressed by three overlapping instructions: delete the eight twins immediately, restructure vanguard below the cap, and delete the vanguard twin while splitting an companion file. Ordering and ownership are not stated. | `:162`, `:176`, `:206` |
| O-16 | The gap count is inconsistent: six architectural gaps are named from the videos, while the remediation is described as four major gaps with four agent/skill pairs. | `:57`, `:80`, `:82`–`:87` |
| O-17 | The lock's historical composition (`157` components, `9` pending themes) is presented as an abolished past state, yet the same `9` pending themes are cited as a live defect in the color audit. | `:29`, `:132` |
| O-18 | The artifact forbids absolute paths in all Arsenal files while itself illustrating state with absolute `C:\Users\<user>...` examples; whether documentation examples are exempt is not stated. | `:99`, `:103` |

---

## 9. (e) Proposed reconciliation axes for the Phase 0 fan-out

Ordered so that later axes rest on earlier ones. One line each, with the anchor that governs
the axis. These are proposals for the dispatcher; none is executed here.

1. Runtime truth — establish which hooks actually fire on the pinned build before any design depends on them. `:11`, `:24`, `:229`
2. Harness sequence and deferred base choice — fix `ق-6` ordering and the `ق-7` deferral as one authority. `:24`, `:25`, `:229`
3. Model-selection law — confirm zero pins and the per-phase per-layer prompt protocol. `:23`, `:66`, `:184`, `:224`
4. Lock abolition — enumerate every lock-consuming surface that must be removed or rewritten. `:33`–`:38`, `:225`, `:238`
5. Catalog as sole source — establish the verified-only invariant and the schema/kind enum state. `:36`, `:128`, `:238`
6. Provisioning algorithm — reconcile the category limit table and the gate count against the vanguard skill. `:42`–`:53`, `:206`
7. Inventory reconciliation — settle agent, skill, command and theme counts. `:99`, `:132`, `:149`, `:172`
8. Color and category taxonomy — close `F-COLOR-01..08` against the three-pillar taxonomy. `:136`–`:152`
9. Cross-surface contradictions — close `C-01..07` in dependency order. `:168`–`:176`
10. Workflow tiers and commit law — align the four tiers, size classes and the diff guard with the workflow skill. `:191`–`:200`
11. Golden standard — apply the four structural pillars to the skill corpus, including the shard decisions for vanguard and doctrine. `:204`–`:207`
12. Factory and Crucible — reconcile the stage count, gate count and quarantine paths. `:116`, `:120`, `:122`–`:123`, `:125`–`:128`
13. Global install scope — reconcile superproject path resolution, overlay precedence and the kill switch. `:95`–`:110`
14. New component filings — resolve the four agent/skill pairs as catalog proposals with evidence bundles. `:80`–`:91`
15. Path pluralization — resolve the singular/plural command and agent directory split. `:172`
16. Context and state machinery — reconcile offload thresholds, capsule caps and the HNSW activation point. `:85`, `:90`, `:198`, `:213`, `:216`

---

## 10. Routing and compliance

Routing: routine checks (existence, size, hash, byte-class scan, copy equality) ran on the
cheap path; verbatim law extraction and the ambiguity enumeration ran on the full path
because the artifact has no methodology section and one rule proved undefined, which is a
rubric-splitting finding rather than a routine lookup.

Missing-tooling protocol: not triggered. Every surface needed for this node
(filesystem read, PowerShell, Node ESM, git) was present and permitted. No external
retrieval surface was required, and none was substituted.

Scope compliance: the only repository writes are `docs/spec/post87/BLUEPRINT.md` and this
file. No reconciliation was run, no plan was drafted, no lock, catalog, generated Markdown
or kit file was touched. The commit is scoped to exactly those two paths.

Dispatch-brief note: the brief carried no `Doctrine:` line naming the binding. This node
applied its own standing binding as stated in the trailer below rather than inferring a
generation posture from the absence.

Ponytail: curation spirit only (binding is FULL on code-writing nodes only; this node wrote
no code, so generation FLOOR and CEILING do not apply) — evidence: source and destination
SHA-256 are both `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D` with
equal byte count `123461`; every Arabic block in this report was injected from the filed
artifact by line range and re-checked as a substring of it; no repair was applied and no
drift table was produced because reconciliation belongs to wave 1.
