# POST87-BLUEPRINT-ERRATA — سجل تطبيق ورقة قرارات المالك

## 1. الثوابت (facts)

| البند | القيمة |
| --- | --- |
| Target | `docs/spec/post87/BLUEPRINT.md` (one blueprint, no fork) |
| Original sha256 (filed copy, PRESERVE) | `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D` |
| Original size | 123,461 UTF-8 bytes · 82,849 characters · 290 lines |
| Post-application sha256 | `01017A3C80668F5DD561846AB2D8B7EDBAA2D0429380389E8F779DFA66826C39` |
| Post-application size | 131,078 UTF-8 bytes · 338 lines |
| Gate evidence | markdownlint-cli 0.49.1 with `.markdownlint.jsonc` → exit 0; `node scripts/verify-skills.mjs` → 10/10 exit 0 (no skill touched) |
| Unstruck occurrences of the four struck hexes | 0 |
| `arrives v0.8` in the blueprint | 0 |

## 2. قاعدة الطريقة (method)

- المواضع بأرقام الأسطر تشير إلى النسخة المودعة (قبل التطبيق) — 290 سطراً.
- كل تعديل موضعي يُطبّق مرة واحدة فقط، وبنص حرفي مطابق لما هو مودع.
- الشطب (§1 meta) يُعلّم بالنص المطلوب `[STRUCK per owner ruling 2026-10-21 — drafting defect]`، ولا يُكتب نص بديل من عند الكاتب.
- نصوص البنود المشطوبة محفوظة حرفياً في هذا السجل (عمودي old)، فلا يضيع شيء.

- GATE-FMT — سطران فارغان (:44، :51) وسطر جديد في نهاية الملف: إصلاحات شكلية إلزامية لبوابة markdownlint، وليست من ورقة القرارات (الأصل كان 7 أخطاء lint قبل التعديل).

## 2.1 ملاحظات على المواضع

- :149 — صف المخطط F-COLOR-05 (24 وكيلاً بلا color) مغطى تعريفاً بـ F-COLOR-01، فلا صف مستقل؛ وتسوية تعداد الوكلاء (27 = 24 + 3، وبعد الإيداع 31) مثبتة في :132 وفي جدول المطابقة داخل كتلة Q-28.
- :172 — الصف مرحّل كـ C-14 بنصه الحرفي؛ و«27 ملفاً» هو القياس الحي = 24 وكيلاً فرعياً + 3 أساسيين، وتصحيح H-18 مثبت في مقدمة جدول C.
- :226 — لا يحمل أياً من الألوان الأربعة المشطوبة (Vercel وSupabase فقط)، فلا يحتاج شطباً.
- Q-33 — الإحالة الأصلية arsenal.ts:2173 لا تحل إلى خطاف الطلب في الشجرة الحية؛ القياس الفعلي draft.text في arsenal.ts:2664-2680، وهو المذكور في التصحيح.

## 3. التعديلات الحرفية (exact old → new)

| الحكم | الموضع | الطريقة |
| --- | --- | --- |
| Q-31 (header provenance) | :1 | سطر/فراغ مُدرج بعد الكتلة |
| Q-33 | :11 | استبدال موضعي (find → replace) |
| Q-09 (meta) | :14 | سطر شطب مُدرج قبل الكتلة |
| Q-33 | :16 | استبدال موضعي (find → replace) |
| Q-09 (meta) | :19 | سطر/فراغ مُدرج بعد الكتلة |
| Q-02 | :21 | استبدال السطر كاملاً |
| Q-02 | :21 | سطر/فراغ مُدرج بعد الكتلة |
| Q-12 | :24 | إضافة تصحيحية في نهاية السطر (append) |
| Q-12 | :25 | استبدال موضعي (find → replace) |
| Q-17 | :29 | استبدال موضعي (find → replace) |
| Q-24 + Q-26 | :36 | استبدال موضعي (find → replace) |
| Q-24 + Q-26 | :36 | استبدال موضعي (find → replace) |
| Q-25 | :37 | استبدال موضعي (find → replace) |
| Q-03 (meta) | :42 | إضافة تصحيحية في نهاية السطر (append) |
| Q-26 | :45 | استبدال موضعي (find → replace) |
| Q-11 | :50 | استبدال موضعي (find → replace) |
| Q-21 | :53 | استبدال موضعي (find → replace) |
| Q-16 | :57 | إضافة تصحيحية في نهاية السطر (append) |
| Q-14 | :75 | استبدال موضعي (find → replace) |
| Q-16 | :80 | استبدال موضعي (find → replace) |
| Q-13 | :85 | استبدال موضعي (find → replace) |
| Q-14 | :89 | استبدال موضعي (find → replace) |
| Q-13 | :90 | استبدال موضعي (find → replace) |
| Q-18 | :99 | إضافة تصحيحية في نهاية السطر (append) |
| Q-10 (meta) | :103 | استبدال موضعي (find → replace) |
| Q-04 | :125 | سطر/فراغ مُدرج بعد الكتلة |
| Q-08 | :132 | استبدال موضعي (find → replace) |
| Q-31 | :136 | إضافة تصحيحية في نهاية السطر (append) |
| Q-30 | :137 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :137 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :137 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :137 | استبدال كل تكرار في السطر (find → replace) |
| Q-28 | :143-152 | استبدال كتلة جدول كاملة (re-key) |
| Q-29 | :168-176 | استبدال كتلة جدول كاملة (re-key) |
| Q-25 | :184 | استبدال موضعي (find → replace) |
| Q-25 | :195 | استبدال موضعي (find → replace) |
| Q-13 | :198 | استبدال موضعي (find → replace) |
| Q-19 | :200 | استبدال موضعي (find → replace) |
| Q-06 (meta) | :224 | سطر شطب مُدرج قبل الكتلة |
| Q-06 (meta) | :229 | سطر/فراغ مُدرج بعد الكتلة |
| Q-05 (meta) | :233 | استبدال السطر كاملاً |
| Q-25 + Q-27 (meta) | :238 | استبدال موضعي (find → replace) |
| Q-25 + Q-27 (meta) | :238 | استبدال موضعي (find → replace) |
| Q-30 | :239 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :239 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :239 | استبدال كل تكرار في السطر (find → replace) |
| Q-30 | :239 | استبدال كل تكرار في السطر (find → replace) |
| Q-07 (meta) | :251 | إضافة تصحيحية في نهاية السطر (append) |
| Q-07 (meta) | :267 | استبدال السطر كاملاً |

### 1. Q-31 (header provenance) — :1 — سطر/فراغ مُدرج بعد الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> **ملاحظة تاريخية (2026-10-21):** هذه النسخة المنقّحة تطبّق ورقة قرارات المالك (Q-01 … Q-33)؛ سجل التصحيحات الكامل (قديم ← جديد، وكل موضع) في `.opencode/audit/POST87-BLUEPRINT-ERRATA.md`، وأصل النسخة المودعة محفوظ البصمة `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D`.
```

### 2. Q-33 — :11 — استبدال موضعي (find → replace)

OLD:

```text
بينما الخطافات الستة المذكورة في 17-V2-HOOK-GAP.md خاملة حالياً في المستودع المثبت (مثبت)، وتوفّر أحداثها المقابلة في نسخ OpenCode 2.x الأحدث يظل غير مُتحقق منه بعد على بيئة التشغيل المثبتة (Unverified on pinned runtime)؛
```

NEW:

```text
بينما الخطافات الستة المذكورة في 17-V2-HOOK-GAP.md خاملة على مستوى تسجيلنا المحلي (our-side dormancy) لا على مستوى توفّر المضيف: مواقع هبوطها في V2 موثقة في docs/17 (FOUND)، وتوفّرها على المضيف غير مُتحقق منه بعد (pending U1 probe evidence)؛
```

### 3. Q-09 (meta) — :14 — سطر شطب مُدرج قبل الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 4. Q-33 — :16 — استبدال موضعي (find → replace)

OLD:

```text
صلبة برمجياً داخل العملية عبر session.prompt (Throw) وPreToolUse وPreCompact
```

NEW:

```text
صلبة برمجياً داخل العملية على خطافات الأدوات والصدفة فقط (Throw من tool.execute.before/after وحارس exit code 2)؛ واعتراض session.prompt تعديل نصي (draft.text) لا حاجز يرمي (قياس حي: arsenal.ts:2664-2680)
```

### 5. Q-09 (meta) — :19 — سطر/فراغ مُدرج بعد الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 6. Q-02 — :21 — استبدال السطر كاملاً

OLD:

```text
### **القرارات المعمارية الحاكمة للسرج والنماذج (ق-1، ق-4، ق-5، ق-6، ق-7)**
```

NEW:

```text
### **القرارات المعمارية الحاكمة للسرج والنماذج (ق-1، ق-3، ق-4، ق-5، ق-6، ق-7)**
```

### 7. Q-02 — :21 — سطر/فراغ مُدرج بعد الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> **ق-3 (إضافة تصحيحية 2026-10-21):** الفئة الثامنة `mcp-specialist` معتمدة بقرار المالك الصريح — انظر :137 و:226.
```

### 8. Q-12 — :24 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 24)
```

NEW:

```text
**تصحيح 2026-10-21:** dsh هو المحطة الثانية في تسلسل ق-6، وهو أيضاً أحد الأساسين المرشحين لبناء سرج Zenith (ق-7)؛ وكونه محطة ثانية لا يستبعده كأساس، ويُحسم اختيار الأساس وقت البناء.
```

### 9. Q-12 — :25 — استبدال موضعي (find → replace)

OLD:

```text
في المعمارية الحالية؛
```

NEW:

```text
في المعمارية الحالية (تصحيح 2026-10-21: dsh محطة ثانية وأحد الأساسين المرشحين في الوقت نفسه)؛
```

### 10. Q-17 — :29 — استبدال موضعي (find → replace)

OLD:

```text
(مثبت كتشخيص تاريخي للوضع الملغى) أن تقسيم المكونات سابقاً بين ملف قفل (كان يضم 157 مكوناً
```

NEW:

```text
(تركيب القفل حالة حية قائمة، لا ماضٍ ملغى) أن تقسيم المكونات بين ملف قفل (يضم 157 مكوناً
```

### 11. Q-24 + Q-26 — :36 — استبدال موضعي (find → replace)

OLD:

```text
المصدر الوحيد لكافة المكونات هو الكتالوج الموحد الكامل (registry/catalog.json وشظاياه registry/data/\*.jsonl المحكومة بالمخطط registry/schema/catalog-v3.schema.json)
```

NEW:

```text
المصدر الوحيد المعترف به لكافة المكونات هو كتالوج Markdown (registry/VANTRILEX_CATALOG.md)، وregistry/catalog.json مرآته المولّدة، وشظاياه registry/data/\*.jsonl المحكومة بالمخطط registry/schema/catalog-v3.schema.json؛ والهدف المعتمد للوصول إلى 100% هو catalog v4، ويُحظر اختراع أوامر التثبيت الـ 1,690
```

### 12. Q-24 + Q-26 — :36 — استبدال موضعي (find → replace)

OLD:

```text
لا عناصر unverified ولا pending في الكتالوج الحي إطلاقاً
```

NEW:

```text
لا عناصر unverified ولا pending في الكتالوج الحي إطلاقاً (الواقع المقاس: 2,849 unverified / 82 verified؛ ولا يُعلن 100% قبل catalog v4)
```

### 13. Q-25 — :37 — استبدال موضعي (find → replace)

OLD:

```text
يبقى بيان التجهيز
```

NEW:

```text
يُنشأ بيان التجهيز في المرحلة الأولى
```

### 14. Q-03 (meta) — :42 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 42)
```

NEW:

```text
[STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 15. Q-26 — :45 — استبدال موضعي (find → replace)

OLD:

```text
(السعة في الكتالوج \`1,505+\` مفحوصة 100%)
```

NEW:

```text
(السعة في الكتالوج \`1,505+\`؛ التحقق 100% هدف يتحقق عبر catalog v4 لا بإعلان، واختراع أوامر التثبيت الـ 1,690 محظور)
```

### 16. Q-11 — :50 — استبدال موضعي (find → replace)

OLD:

```text
Stage\_Floor \= 0 أو 1
```

NEW:

```text
Stage\_Floor \= 1
```

### 17. Q-21 — :53 — استبدال موضعي (find → replace)

OLD:

```text
AND covers\_gap(c\_j, D\_proj) \==\> Include\_Pair(c\_i, c\_j)
```

NEW:

```text
\==\> Include\_Pair(c\_i, c\_j) [STRUCK — covers\_gap has no real data; re-admit only with data, fabrication forbidden]
```

### 18. Q-16 — :57 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 57)
```

NEW:

```text
**تصحيح 2026-10-21:** العدد الحاكم هو العدد الحي المقاس للثغرات في المستودع، لا «ست» ولا «أربع»؛ والقياس الحي يثبت غياب أزواج المعالجة الأربعة على أسطحها الأربعة، فيُثبَت العدد النهائي بالقياس لا بالنص.
```

### 19. Q-14 — :75 — استبدال موضعي (find → replace)

OLD:

```text
لدورتين متتاليتين أو تكرر
```

NEW:

```text
لدورتين متتاليتين (0.92 مقياس كسر الحلقة حصراً) أو تكرر
```

### 20. Q-16 — :80 — استبدال موضعي (find → replace)

OLD:

```text
الثغرات الأربع الكبرى
```

NEW:

```text
الثغرات الأربع الكبرى (العدد الحي المقاس يحكم؛ والأربعة عدد أزواج المعالجة المقترحة لا حصر الثغرات)
```

### 21. Q-13 — :85 — استبدال موضعي (find → replace)

OLD:

```text
**28k–30k توكن**
```

NEW:

```text
28,000 توكن (الحد الصلب 30,000 توكن)
```

### 22. Q-14 — :89 — استبدال موضعي (find → replace)

OLD:

```text
نسبة 80%
```

NEW:

```text
نسبة 80% (مقياس إعادة الاستخدام في سياقه المستقل؛ لا توحيد مع 0.92)
```

### 23. Q-13 — :90 — استبدال موضعي (find → replace)

OLD:

```text
حاجز 30,000 توكن1
```

NEW:

```text
عتبة التفريغ 28,000 توكن والحد الصلب 30,000 توكن1
```

### 24. Q-18 — :99 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 99)
```

NEW:

```text
**تصحيح 2026-10-21:** الحظر على كود التشغيل والملفات القابلة للتنفيذ؛ أمثلة التوثيق مستثناة صراحةً.
```

### 25. Q-10 (meta) — :103 — استبدال موضعي (find → replace)

OLD:

```text
(POSIX)1 |  | 
```

NEW:

```text
(POSIX)1 | [STRUCK per owner ruling 2026-10-21 — drafting defect] | 
```

### 26. Q-04 — :125 — سطر/فراغ مُدرج بعد الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> **حالة تحريرية (2026-10-21):** المرحلتان الثالثة والرابعة كما هما مودعتان هنا هما النص التشغيلي المعتمد؛ وافتتاحية المرحلة الثالثة المبتورة عيب تحريري محال لإصلاح النص البديل فيه عبر Aether واعتماد المالك.
```

### 27. Q-08 — :132 — استبدال موضعي (find → replace)

OLD:

```text
فإن 0 من أصل 24 ملف وكيل فرعي في الشجرة الحية
```

NEW:

```text
فإن 0 من أصل 24 ملف وكيل فرعي (من أصل 27 ملف وكيل = 24 وكيلاً فرعياً \+ 3 وكلاء أساسيين) في الشجرة الحية
```

### 28. Q-31 — :136 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 136)
```

NEW:

```text
**تصحيح 2026-10-21:** Zenith يصل في v0.9؛ وفئة supreme-orchestrator تُنشأ عند v0.9 ولا قبلها.
```

### 29. Q-30 — :137 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#24292F
```

NEW:

```text
\#24292F [STRUCK — no official source; re-admit only with a source]
```

### 30. Q-30 — :137 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#635BFF
```

NEW:

```text
\#635BFF [STRUCK — no official source; re-admit only with a source]
```

### 31. Q-30 — :137 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#F38020
```

NEW:

```text
\#F38020 [STRUCK — no official source; re-admit only with a source]
```

### 32. Q-30 — :137 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#F24E1E
```

NEW:

```text
\#F24E1E [STRUCK — no official source; re-admit only with a source]
```

### 33. Q-28 — :143-152 — استبدال كتلة جدول كاملة (re-key)

OLD:

```text
| معرف العيب (Finding ID) | الوصف الموثق والدليل (file:line) | الملفات المستهدفة بالتعديل الجراحي | التعديل الميكانيكي الحاسم (Exact Remediation Spec) |
| ----: | ----: | ----: | ----: |
| **F-COLOR-01** | عدم تطابق حالة الأحرف (Case Mismatch) للون القائد aether: مكتوب \#14B8A6 في .opencode/agents/aether.md:5 مقابل \#14b8a6 في registry/themes/vantrilex-atomic-switch.json:1 \[cite: 17\] | registry/themes/vantrilex-atomic-switch.json وregistry/schema/catalog-v3.schema.json | توحيد كافة قيم color وaccentHex إلى صيغة الأحرف الكبيرة الصارمة ^\#\[0-9A-F\]{6}\$؛ تعديل \#14b8a6 إلى \#14B8A6 \[cite: 17\] |
| **F-COLOR-02** | تناقض تعريف فئة "reserved" في vantrilex-atomic-switch.json:1 التي تنص على "dark royal blue, BLAZAR only" بينما تُسند لثلاثة صفوف (blazar, aether, pulsar) بألوان مختلفة17 | registry/themes/vantrilex-atomic-switch.json:1 | تخصيص فئة "supreme-orchestrator" لـ Zenith مدير الجلسة الأساسية، وإعادة تسمية فئة القادة الثلاثة إلى "sovereign-leader" بوصف "Tier-1 Leader Sub-Agent colors (AETHER \#14B8A6, BLAZAR \#4169E1, PULSAR \#C026D3)" \[cite: 1, 17\] |
| **F-COLOR-03** | البادئة المزدوجة vantrilex-vantrilex-\* في 6 صفوف داخل vantrilex-atomic-switch.json لا تطابق أي ملف في .opencode/agents/ (red-team, a11y-audit, typescript, python, fixer, github)1 | registry/themes/vantrilex-atomic-switch.json و.opencode/plugin/arsenal.ts | إزالة البادئة المكررة لتصبح المعرفات vantrilex-red-team, vantrilex-a11y-audit, vantrilex-typescript, vantrilex-python, vantrilex-fixer, vantrilex-github وإضافة دالة تطبيع id.replace(/^(vantrilex-)+/, 'vantrilex-') \[cite: 17\] |
| **F-COLOR-04** | بقاء 9 سمات معلقة (verification: "pending") في kit/kit.lock وعدم وجود ملفات JSON فعلية لبعضها في registry/themes/ \[cite: 1, 17\] | registry/catalog.json وregistry/themes/\*.json | توليد ملفات السمات التسع وصقلها بالبوتقة لتدخل جميعها بحالة verified بنسبة 100% في الكتالوج الموحد الكامل registry/catalog.json مع إلغاء kit.lock نهائياً (وفق ق-2) \[cite: 1, 17\] |
| **F-COLOR-05** | افتقار 24 وكيلاً فرعياً في .opencode/agents/vantrilex-\*.md لحقل color: في ترويسة YAML رغم أن RESEARCH.md:108 يثبت أن حقل color مسموح ومدعوم في OpenCode v21 | جميع ملفات .opencode/agents/vantrilex-\*.md (24 ملفاً \+ الـ 4 الجدد) | حقن حقل color: "\#RRGGBB" وحقل category: في ترويسة الـ YAML لكل ملف وكيل فرعي وفق جدول التصنيف الثلاثي الجديد1 |
| **F-COLOR-06** | التناقض النصي الصارخ بين 12 ملف وكيل فرعي تحظر اللون نصياً في متونها وبين قانون AGENT.md:106 وvantrilex-doctrine اللذين يفرضان لوناً لكل وكيل1 | الـ 12 ملفاً في .opencode/agents/\*.md و.opencode/skills/vantrilex-doctrine/SKILL.md | حذف سطر حظر اللون القديم من متون الوكلاء الـ 12، وتثبيت قاعدة أن كل وكيل فرعي يحمل حقل color ثابتاً في ترويسته للتمييز البصري في الطرفية، لكنه لا يبدل السمة الكلية للجلسة (D2=A)17 |
| **F-COLOR-07** | وجود صفوف سمات يتيمة في vantrilex-atomic-switch.json لوكلاء تم نسخهم وإحلالهم (مثل vantrilex-ai-generated-code-security-auditor وtechnical-writer)1 | registry/themes/vantrilex-atomic-switch.json | تحديث الصفوف لتشير إلى الوكلاء الناسخين الحقيقيين (vantrilex-scribe, vantrilex-security-auditor) مع وضع علامة superseded\_by على المعرفات التاريخية1 |
| **F-COLOR-08** | غياب التحقق من المخطط (Schema Validation) لحقول الألوان والفئات (self-scoped وmcp-specialist) وربط design\_ref في مخطط القفل والكتالوج1 | registry/schema/catalog-v3.schema.json | إضافة نمط color: { "type": "string", "pattern": "^\#\[0-9A-F\]{6}\$" }، وتوسيع category ليقبل الفئات السبع وsovereign-leader وmcp-specialist والنمط ^self:\[a-z0-9-\]+\$ مع حقل design\_ref اختياري1 |
```

NEW:

```text
| معرف السجل المعياري | التعريف المعياري (نص السجل) | الدليل | الجهة المالكة |
| ----: | ----: | ----: | ----: |
| **F-COLOR-01** | 24/27 agents have no `color:`; 0/27 have a group field. | §1.1, §1.2, §2 | Guide / change author |
| **F-COLOR-02** | The Part-2 palette has no on-disk definition; 7-group taxonomy exists only in the brief. | §4.1, §4.4 C6 | Guide |
| **F-COLOR-03** | Registry `category` is a 5-value taxonomy with hexes that do not match the palette; `#8B5CF6` collides across `external` and `operate`. | §1.5, §4.2, §4.4 C3 | Kit maintainer |
| **F-COLOR-04** | `#22D3EE` (exploration) occurs 0 times repo-wide. | §1.4 | Kit maintainer |
| **F-COLOR-05** | 9/12 registry rows are pending and dangle on absent theme files; 6 have stale stems, 3 have double-prefix ids. | §5 | Kit maintainer |
| **F-COLOR-06** | A live doctrine conflict: 12 subagent files forbid `color`, while `docs/18-THEMES.md:95` and `AGENT.md:106` require per-agent color. | §0, §4.4 C7 | Guide (owner ruling) |
| **F-COLOR-07** | `docs/18-THEMES.md` per-agent mapping is stale: only `blazar` + 3 nonexistent `RESERVED` agents; `aether` and `pulsar` omitted. | §4.4 C6 | Scribe / kit maintainer |
| **F-COLOR-08** | 4 of 7 proposed group assignments are estimations (`leader`, `librarian`, `red-team`; and the `guide` review/audit boundary). | §2 rows 9, 13, 14, 17 | Guide |

**إعادة الترقيم (Q-28، 2026-10-21):** السجل المعياري في `V87-COLOR-FINDINGS.md:319-326` و`V87-DEFECTS.md:66-78` هو الحاكم؛ معرفاته وتعريفاته تحل محل ترقيم المخطط الخاص، والسجل المعياري لا يُعاد تسميته. البنود الثلاثة المميزة في المخطط — غير المغطاة تعريفاً في السجل المعياري — تحمل معرّفات جديدة غير متصادمة: `F-COLOR-09` و`F-COLOR-10` و`F-COLOR-11`. البنود الأربعة المغطاة تعريفاً لا تحصل على صف مستقل، وتُسجّل مطابقتها أدناه؛ ونصوصها القديمة محفوظة حرفياً في `.opencode/audit/POST87-BLUEPRINT-ERRATA.md`.

| المعرف الجديد | البند المميز المرحّل من المخطط | الملفات المستهدفة | التعديل الميكانيكي |
| ----: | ----: | ----: | ----: |
| **F-COLOR-09** | عدم تطابق حالة الأحرف (Case Mismatch) للون القائد aether: مكتوب \#14B8A6 في .opencode/agents/aether.md:5 مقابل \#14b8a6 في registry/themes/vantrilex-atomic-switch.json:1 \[cite: 17\] | registry/themes/vantrilex-atomic-switch.json وregistry/schema/catalog-v3.schema.json | توحيد كافة قيم color وaccentHex إلى صيغة الأحرف الكبيرة الصارمة ^\#\[0-9A-F\]{6}\$؛ تعديل \#14b8a6 إلى \#14B8A6 \[cite: 17\] |
| **F-COLOR-10** | تناقض تعريف فئة "reserved" في vantrilex-atomic-switch.json:1 التي تنص على "dark royal blue, BLAZAR only" بينما تُسند لثلاثة صفوف (blazar, aether, pulsar) بألوان مختلفة17 | registry/themes/vantrilex-atomic-switch.json:1 | تخصيص فئة "supreme-orchestrator" لـ Zenith مدير الجلسة الأساسية، وإعادة تسمية فئة القادة الثلاثة إلى "sovereign-leader" بوصف "Tier-1 Leader Sub-Agent colors (AETHER \#14B8A6, BLAZAR \#4169E1, PULSAR \#C026D3)" \[cite: 1, 17\] |
| **F-COLOR-11** | غياب التحقق من المخطط (Schema Validation) لحقول الألوان والفئات (self-scoped وmcp-specialist) وربط design\_ref في مخطط القفل والكتالوج1 | registry/schema/catalog-v3.schema.json | إضافة نمط color: { "type": "string", "pattern": "^\#\[0-9A-F\]{6}\$" }، وتوسيع category ليقبل الفئات السبع وsovereign-leader وmcp-specialist والنمط ^self:\[a-z0-9-\]+\$ مع حقل design\_ref اختياري1 |

| البند القديم المغطى تعريفاً | السجل المعياري المطابق |
| ----: | ----: |
| المخطط `F-COLOR-03` (بادئة مزدوجة في ستة صفوف) | `F-COLOR-05` — والقياس الحي يثبت ثلاثة معرفات مضاعفة فقط (`guide` و`implementer` و`leader`) — H-16 |
| المخطط `F-COLOR-04` (تسع سمات معلقة) | `F-COLOR-05` |
| المخطط `F-COLOR-05` (24 وكيلاً بلا `color:`) | `F-COLOR-01` |
| المخطط `F-COLOR-07` (صفوف سمات يتيمة) | `F-COLOR-05` |
```

### 34. Q-29 — :168-176 — استبدال كتلة جدول كاملة (re-key)

OLD:

```text
| رقم التعارض | السطح الأول (Surface A — file:line) | السطح الثاني المناقض (Surface B — file:line) | طبيعة التناقض والأثر التشغيلي (Impact Analysis) | قرار الحسم المعماري (Canonical Resolution) |
| ----: | ----: | ----: | ----: | ----: |
| **C-01** | AGENT.md:106 وvantrilex-doctrine: يفرضان أن يحتفظ كل وكيل بلونه الخاص من اللوحة17 | 12 ملف وكيل في .opencode/agents/vantrilex-\*.md: تنص صراحةً على حظر الألوان، و0 من 24 وكيلاً فرعياً يحمل حقل color: \[cite: 1, 17\] | فشل فاحص التوافق اللوني (F-COLOR-05, F-COLOR-06) وانكسار التمييز البصري للوكلاء الفرعيين في الطرفية17 | اعتماد AGENT.md:106 للون ترويسة كل وكيل (color: "\#HEX") مع إدارة الجلسة الأساسية بواسطة Zenith وتوسيع الفئات والألوان لمئات الوكلاء الجانبيين والفئة الثامنة mcp-specialist (ق-3 وق-4) |
| **C-02** | .opencode/commands/V-Technical-Writer.md و.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md: يوجهان لقراءة .opencode/agents/technical-writer.md وai-generated-code-security-auditor.md \[cite: 1, 17\] | .opencode/agents/vantrilex-scribe.md ينص على نسخ وإحلال technical-writer.md (SUPERSEDES the locked generic technical-writer) والملفان القديمان محذوفان من الشجرة الحية1 | أوامر الاستشارة V-\* تفشل عند التشغيل لأنها تحاول قراءة ملفات محذوفة (ENOENT Dangling Reference)1 | تحديث أوامر V-\* لتشير إلى .opencode/agents/vantrilex-scribe.md وvantrilex-security-auditor.md أو أرشفتها في docs/99-archive/ \[cite: 1, 17\] |
| **C-03** | .opencode/command/equip.md:96 و.opencode/skills/red-team/SKILL.md: يشيران للمسار المفرد .opencode/agent/ (مثل .opencode/agent/red-team.md)1، ووجود 4 أوامر في .opencode/command/ | الشجرة الحية تستخدم المسار الجمعي .opencode/agents/ (27 ملفاً) و.opencode/commands/ (18 ملفاً)1 | انقسام المسارات (Singular vs Plural Split) يؤدي لعدم عثور المهارات والأوامر على ملفات الوكلاء وتشتت الأوامر الـ 22 عبر مجلدين1 | توحيد كافة المراجع والمجلدات نحو الصيغة الجمعية القياسية .opencode/agents/ و.opencode/commands/ ونقل الأوامر الـ 4 إليها1 |
| **C-04** | registry/themes/vantrilex-atomic-switch.json:1: يسجل 6 وكلاء ببادئة مزدوجة vantrilex-vantrilex-\* (مثل vantrilex-vantrilex-red-team)17 | .opencode/agents/ وregistry/catalog.json: يعرفان الوكلاء ببادئة مفردة vantrilex-red-team, vantrilex-fixer, إلخ1 | فشل ربط السمات والألوان للوكلاء الستة الأهم في النظام (Red Team, A11y, TS, Python, Fixer, GitHub)17 | تصحيح الأسماء الستة في vantrilex-atomic-switch.json إلى البادئة المفردة vantrilex-\* \[cite: 17\] |
| **C-05** | git tag: يضم 12 وسماً تنتهي عند v0.7.7 مع وجود وسم شاذ v7.5 \[cite: 1\] | CHANGELOG.md: يعنون الإصدار بـ \[0.7.5\]، ويترك عبارة PARKED, UNRELEASED خطأً على إصدارات 0.7.5 و0.7.6 و0.7.7 المشحونة فعلياً1 | اضطراب فاحص semver check في سير عمل الإصدار (Release workflow) وتضليل الوكلاء حول حالة الإصدارات المنشورة1 | إزالة عبارة PARKED, UNRELEASED من الإصدارات المشحونة في CHANGELOG.md وإضافة وسم توافقي v0.7.5 يشير لنفس commit الوسم v7.5 \[cite: 1\] |
| **C-06** | بوابة الفحص §14 R-4 تقرأ شجرة العمل الحية (Working Tree) وتعلن وجود 37 skill folders \[cite: 1\] | فهرس Git (git status \--porcelain) يظهر ملفات ومجلدات غير متتبعة (?? Untracked entries) من بينها V87-COLOR-FINDINGS.md وبعض مجلدات المهارات (L13-07-036)1 | أي استنساخ جديد للمستودع (Fresh Clone في خطوة التحقق بعد الإصدار) يرى مجموعة مهارات وملفات مختلفة عما فحصه التدقيق1 | إلزام بوابات الفحص بقراءة الفهرس المتتبع (git ls-files) وتثبيت كافة الملفات المعتمدة في Git أو حذف المؤقتات قبل إغلاق المهمة1 |
| **C-07** | .opencode/skills/skill-maker/SKILL.md:90: يفرض سقف 500 سطر، و7 أقسام H2 فقط، وبادئة Use when في بداية الوصف1 | .opencode/skills/vantrilex-vanguard/SKILL.md (814 سطراً)، وvantrilex-doctrine/SKILL.md (782 سطراً، وعنوان H2 ثامن في :86، ووصف لا يبدأ بـ Use when في :3)1 | المهارات الدستورية الكبرى للأرسنال تكسر القوانين التي تفرضها مهارة skill-maker على بقية المهارات (L13-07-054..057)1 | إعادة هيكلة vantrilex-vanguard وvantrilex-doctrine بنقل الجداول المرجعية الطويلة إلى ملفات مرافقة (companion files) لينخفض حجم SKILL.md تحت 450 سطراً مع إصلاح الترويسة والعناوين1 |
```

NEW:

```text
| رقم التعارض المعياري | الشدة | التعريف المعياري (نص السجل) | الدليل (file:line) | الجهة المالكة |
| ----: | ----: | ----: | ----: | ----: |
| **C-01** | MEDIUM | No named agent can load any `vs-*` skill: 0 of 27 agent files grant one, while the three leaders deny `skill "*"` and allow only unprefixed names. | `aether.md:14-28`, `blazar.md:59,65,86,92,98,116`; count of `vs-` in agent files = 0 | kit maintainer + Guide |
| **C-02** | MEDIUM | Duplicate trigger surface: twin pairs carry byte-identical `description:` lines, so selection between `X` and `vs-X` cannot be deterministic. | `SKILL.md:3` of the eight twin files | kit maintainer |
| **C-03** | MEDIUM | No command entry point names a `vs-*` skill: 0 hits across all 22 command files. | `.opencode/command/doctor.md:2`, `equip.md:2`, `prime.md:2`, `release.md:2` | Guide |
| **C-04** | LOW | Leader frontmatter uses two temperature shapes: nested `request.body` on blazar, top level on aether and pulsar. | `blazar.md:6-8` vs `aether.md:6`, `pulsar.md:6` | kit maintainer |
| **C-05** | LOW | Aether accent case mismatch (`#14B8A6` in the agent vs `#14b8a6` in the registry) and reserved-category semantics conflict (`"BLAZAR only"` while aether and pulsar rows carry `"category":"reserved"`). | `aether.md:5`; `registry/themes/vantrilex-atomic-switch.json` | kit maintainer |
| **C-06** | LOW | markdownlint MD037: two unescaped literal asterisks in prose (`RELAY_*`, `vs-* admissions`). | `AGENT.md:112`, `AGENT.md:207` | docs author |
| **C-07** | LOW | markdownlint MD032: list not surrounded by blank lines. | `WORKFLOW.md:76` | docs author |
| **C-08** | LOW | markdownlint MD034 ×8 plus MD032 ×1 in the generated mirror; identical content exists at HEAD, so the defect is generator-caused. | `registry/VANTRILEX_CATALOG.md:1604,1712,1855,1887,2014,2031,2117,2139,3026` | kit maintainer (generator) |
| **C-09** | LOW | Two command roots coexist: `.opencode/command` (4) and `.opencode/commands` (18); no gate asserts which root V2 loads. | both roots; `docs/99-archive/P1-RENAME-CHECKLIST.md:41` | Guide |
| **C-10** | INFO | 19 of 37 skill folders have no `kit.lock` row and all 8 `vs-*` ids have no `registry/catalog.json` record; registration is explicitly parked. | `V87-COMPAT-FINDINGS.md:278`; `AGENT.md:158` items 5–6 | owner (registration parked) |
| **C-11** | INFO | 7 of 27 agent files have no `kit.lock` row. | `vantrilex-agent-maker`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-kit-maintainer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-uploader` | owner (registration parked) |

**البنود المميزة المرحّلة من المخطط (C-12 إلى C-17، Q-29 2026-10-21):** بترقيم غير متصادم، ونصوصها كما وردت في المخطط، مع تصحيحين مقاسين: (أ) قانون لون الوكيل في `AGENT.md:102` لا `:106` (H-17)؛ (ب) `equip.md:96` يشير إلى المسار الجمعي أصلاً، والمخالف الحقيقي `red-team/SKILL.md:15,:64` وقد أُصلح في `u2-paths` (H-18). الإحالات الداخلية داخل هذه الصفوف إلى `F-COLOR-05/06` صارت تُحيل إلى السجل المعياري بعد إعادة الترقيم؛ وتوحيدها مهمة Aether/Guide.

| رقم التعارض | السطح الأول (Surface A — file:line) | السطح الثاني المناقض (Surface B — file:line) | طبيعة التناقض والأثر التشغيلي (Impact Analysis) | قرار الحسم المعماري (Canonical Resolution) |
| ----: | ----: | ----: | ----: | ----: |
| **C-12** | AGENT.md:106 وvantrilex-doctrine: يفرضان أن يحتفظ كل وكيل بلونه الخاص من اللوحة17 | 12 ملف وكيل في .opencode/agents/vantrilex-\*.md: تنص صراحةً على حظر الألوان، و0 من 24 وكيلاً فرعياً يحمل حقل color: \[cite: 1, 17\] | فشل فاحص التوافق اللوني (F-COLOR-05, F-COLOR-06) وانكسار التمييز البصري للوكلاء الفرعيين في الطرفية17 | اعتماد AGENT.md:106 للون ترويسة كل وكيل (color: "\#HEX") مع إدارة الجلسة الأساسية بواسطة Zenith وتوسيع الفئات والألوان لمئات الوكلاء الجانبيين والفئة الثامنة mcp-specialist (ق-3 وق-4) |
| **C-13** | .opencode/commands/V-Technical-Writer.md و.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md: يوجهان لقراءة .opencode/agents/technical-writer.md وai-generated-code-security-auditor.md \[cite: 1, 17\] | .opencode/agents/vantrilex-scribe.md ينص على نسخ وإحلال technical-writer.md (SUPERSEDES the locked generic technical-writer) والملفان القديمان محذوفان من الشجرة الحية1 | أوامر الاستشارة V-\* تفشل عند التشغيل لأنها تحاول قراءة ملفات محذوفة (ENOENT Dangling Reference)1 | تحديث أوامر V-\* لتشير إلى .opencode/agents/vantrilex-scribe.md وvantrilex-security-auditor.md أو أرشفتها في docs/99-archive/ \[cite: 1, 17\] |
| **C-14** | .opencode/command/equip.md:96 و.opencode/skills/red-team/SKILL.md: يشيران للمسار المفرد .opencode/agent/ (مثل .opencode/agent/red-team.md)1، ووجود 4 أوامر في .opencode/command/ | الشجرة الحية تستخدم المسار الجمعي .opencode/agents/ (27 ملفاً) و.opencode/commands/ (18 ملفاً)1 | انقسام المسارات (Singular vs Plural Split) يؤدي لعدم عثور المهارات والأوامر على ملفات الوكلاء وتشتت الأوامر الـ 22 عبر مجلدين1 | توحيد كافة المراجع والمجلدات نحو الصيغة الجمعية القياسية .opencode/agents/ و.opencode/commands/ ونقل الأوامر الـ 4 إليها1 |
| **C-15** | git tag: يضم 12 وسماً تنتهي عند v0.7.7 مع وجود وسم شاذ v7.5 \[cite: 1\] | CHANGELOG.md: يعنون الإصدار بـ \[0.7.5\]، ويترك عبارة PARKED, UNRELEASED خطأً على إصدارات 0.7.5 و0.7.6 و0.7.7 المشحونة فعلياً1 | اضطراب فاحص semver check في سير عمل الإصدار (Release workflow) وتضليل الوكلاء حول حالة الإصدارات المنشورة1 | إزالة عبارة PARKED, UNRELEASED من الإصدارات المشحونة في CHANGELOG.md وإضافة وسم توافقي v0.7.5 يشير لنفس commit الوسم v7.5 \[cite: 1\] |
| **C-16** | بوابة الفحص §14 R-4 تقرأ شجرة العمل الحية (Working Tree) وتعلن وجود 37 skill folders \[cite: 1\] | فهرس Git (git status \--porcelain) يظهر ملفات ومجلدات غير متتبعة (?? Untracked entries) من بينها V87-COLOR-FINDINGS.md وبعض مجلدات المهارات (L13-07-036)1 | أي استنساخ جديد للمستودع (Fresh Clone في خطوة التحقق بعد الإصدار) يرى مجموعة مهارات وملفات مختلفة عما فحصه التدقيق1 | إلزام بوابات الفحص بقراءة الفهرس المتتبع (git ls-files) وتثبيت كافة الملفات المعتمدة في Git أو حذف المؤقتات قبل إغلاق المهمة1 |
| **C-17** | .opencode/skills/skill-maker/SKILL.md:90: يفرض سقف 500 سطر، و7 أقسام H2 فقط، وبادئة Use when في بداية الوصف1 | .opencode/skills/vantrilex-vanguard/SKILL.md (814 سطراً)، وvantrilex-doctrine/SKILL.md (782 سطراً، وعنوان H2 ثامن في :86، ووصف لا يبدأ بـ Use when في :3)1 | المهارات الدستورية الكبرى للأرسنال تكسر القوانين التي تفرضها مهارة skill-maker على بقية المهارات (L13-07-054..057)1 | إعادة هيكلة vantrilex-vanguard وvantrilex-doctrine بنقل الجداول المرجعية الطويلة إلى ملفات مرافقة (companion files) لينخفض حجم SKILL.md تحت 450 سطراً مع إصلاح الترويسة والعناوين1 |

**مطابقة البند المغطى:** المخطط `C-04` (ستة معرفات مضاعفة) مغطى في `F-COLOR-05`، والقياس الحي يثبت ثلاثة معرفات مضاعفة فقط (`guide`، `implementer`، `leader`) — H-16.
```

### 35. Q-25 — :184 — استبدال موضعي (find → replace)

OLD:

```text
\`.opencode/equip.manifest.json\` من الكتالوج
```

NEW:

```text
\`.opencode/equip.manifest.json\` (يُنشأ في المرحلة الأولى) من الكتالوج
```

### 36. Q-25 — :195 — استبدال موضعي (find → replace)

OLD:

```text
وسجل الاختيارات .opencode/equip.manifest.json،
```

NEW:

```text
وسجل الاختيارات .opencode/equip.manifest.json (يُنشأ في المرحلة الأولى)،
```

### 37. Q-13 — :198 — استبدال موضعي (find → replace)

OLD:

```text
عند 28k توكن
```

NEW:

```text
عند 28,000 توكن (الحد الصلب 30,000)
```

### 38. Q-19 — :200 — استبدال موضعي (find → replace)

OLD:

```text
داخل .opencode/plugin/arsenal.ts وWORKFLOW.md Part A1.
```

NEW:

```text
داخل .opencode/plugin/arsenal.ts وWORKFLOW.md Part A1. **تصحيح 2026-10-21:** هذا القانون غير معتمد؛ القاعدة الحاكمة هي AGENTS.md:130 («لا كوميت ولا دفع») حتى يعدّلها المالك رسمياً.
```

### 39. Q-06 (meta) — :224 — سطر شطب مُدرج قبل الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 40. Q-06 (meta) — :229 — سطر/فراغ مُدرج بعد الكتلة

OLD:

```text
(nothing)
```

NEW:

```text
> [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 41. Q-05 (meta) — :233 — استبدال السطر كاملاً

OLD:

```text
1. 
```

NEW:

```text
1. [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 42. Q-25 + Q-27 (meta) — :238 — استبدال موضعي (find → replace)

OLD:

```text
إلى سجل اختيارات فقط
```

NEW:

```text
إلى سجل اختيارات فقط (يُنشأ في المرحلة الأولى)
```

### 43. Q-25 + Q-27 (meta) — :238 — استبدال موضعي (find → replace)

OLD:

```text
kit.core.lock,
```

NEW:

```text
kit.core.lock [STRUCK per owner ruling 2026-10-21 — drafting defect],
```

### 44. Q-30 — :239 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#24292F
```

NEW:

```text
\#24292F [STRUCK — no official source; re-admit only with a source]
```

### 45. Q-30 — :239 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#635BFF
```

NEW:

```text
\#635BFF [STRUCK — no official source; re-admit only with a source]
```

### 46. Q-30 — :239 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#F38020
```

NEW:

```text
\#F38020 [STRUCK — no official source; re-admit only with a source]
```

### 47. Q-30 — :239 — استبدال كل تكرار في السطر (find → replace)

OLD:

```text
\#F24E1E
```

NEW:

```text
\#F24E1E [STRUCK — no official source; re-admit only with a source]
```

### 48. Q-07 (meta) — :251 — إضافة تصحيحية في نهاية السطر (append)

OLD:

```text
(end of line 251)
```

NEW:

```text
[STRUCK per owner ruling 2026-10-21 — drafting defect]
```

### 49. Q-07 (meta) — :267 — استبدال السطر كاملاً

OLD:

```text
> 18.   
```

NEW:

```text
> 18. [STRUCK per owner ruling 2026-10-21 — drafting defect]
```

## 4. تمشيط Zenith: v0.8 → v0.9 (الملفات الحية)

| الملف | السطر | old (حرفي) | new (حرفي) |
| --- | --- | --- | --- |
| `.opencode/agents/aether.md` | 222 | `(arrives v0.8)` | `(arrives v0.9)` |
| `.opencode/agents/blazar.md` | 576 | `(arrives v0.8)` | `(arrives v0.9)` |
| `.opencode/agents/pulsar.md` | 275 | `(arrives v0.8)` | `(arrives v0.9)` |

كل ملف: تكرار واحد، وبقية الملف لم تتغير (residual `v0.8` = 0 في الثلاثة). `BLUEPRINT.md` لا يحمل أصلاً أي إثبات `v0.8` لوصول Zenith؛ فالجانب المخططي معالج بإضافة تصحيح :136 (v0.9). المواضع خارج نطاق التمشيط المسمى (`.opencode/audit/V-FULL-AUDIT.md:6066,6658,6949` و`.opencode/audit/POST87-PHASE0.md:568`) تركت كما هي وأُبلغ بها.
