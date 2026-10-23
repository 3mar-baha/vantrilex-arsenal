# فهرس توثيق Vantrilex Arsenal

يُسقط هذا الفهرس مجموعة التوثيق المكوّنة من سبعة عشر ملفًا الخاصة بمستودع
Vantrilex Arsenal نفسه: إضافة OpenCode مع سجلّ المكوّنات. وهو لا يوثّق أي
مشروع هدف. فتوثيق المشروع الهدف مجموعة منفصلة مولّدة وقت التشغيل (نظام
الملفات الثمانية والعشرين الموصوف بالإحالة في
[04-VANGUARD.md](04-VANGUARD.md))؛ ولا شيء في هذه المجموعة يكرّره.

تقسّم المهارات الأربع العليا العمل، وتغطيها هذه المجموعة بالترتيب:
Prime، مهارة التوجيه التي تعمل مرة واحدة لكل جهاز، في
[01-OVERVIEW.md](01-OVERVIEW.md)؛ وVanguard، مهارة التجهيز التي تعمل مرة
واحدة لكل مشروع، في [04-VANGUARD.md](04-VANGUARD.md)؛ وWorkflow-Forge،
مصمّمة سير عمل كل مهمة التي يثبّتها Vanguard وقت التجهيز، وعقدها هو
`.opencode/skills/vantrilex-workflow-forge/SKILL.md`؛ وDoctrine، مهارة العمل
والبوابات، في [05-DOCTRINE.md](05-DOCTRINE.md). وPrime للتوجيه فقط وليس
لها ملف خاص بها في السلسلة المرقّمة، فعقدها هو
`.opencode/skills/vantrilex-prime/SKILL.md`.

تعيش مواصفتا الإدخال المعتمدتان في `spec/` بجانب هذه المجموعة:
`spec/VANTRILEX_KIT_SPEC.md` و`spec/VANTRILEX_SKILLS_SPEC.md`. وهما
للتوثيق والنسب: تُقرآن ولا تُعاد كتابتهما أبدًا.

## خريطة الملفات

| الملف | عمّا يجيب |
|---|---|
| [00-INDEX.md](00-INDEX.md) | أين كل شيء، وبأي ترتيب يُقرأ |
| [01-OVERVIEW.md](01-OVERVIEW.md) | ما هي Vantrilex Arsenal، وما حصر المكوّنات الصادق |
| [02-INSTALLATION.md](02-INSTALLATION.md) | ماذا تثبّت وتشغّل للعمل مع هذا المستودع |
| [03-ARCHITECTURE.md](../03-ARCHITECTURE.md) | كيف تتركّب الطبقات معًا وماذا يقرأ ماذا |
| [04-VANGUARD.md](04-VANGUARD.md) | ماذا تفعل مهارة الاستطلاع Vanguard خطوة بخطوة |
| [05-DOCTRINE.md](05-DOCTRINE.md) | ماذا تشترط مهارة القانون Doctrine: القوانين والأدوار والمراحل وسير العمل والطقوس |
| [06-REGISTRY-SCHEMA.md](../06-REGISTRY-SCHEMA.md) | ماذا يحمل سجلّ الفهرس v2، وماذا يعني كل حقل |
| [07-CATALOG-GENERATION.md](../07-CATALOG-GENERATION.md) | كيف تُولَّد النسخة الآلية للفهرس والفهارس، وقواعد الدمج |
| [08-VERIFICATION.md](08-VERIFICATION.md) | أي البوابات يجب أن تجتاز قبل أن يُسمّى أي تغيير منجزًا |
| [09-KIT-LOCK.md](09-KIT-LOCK.md) | ماذا يثبّت قفل الطقم، وكيف يُحدَّد نطاق الطقم لكل مرحلة |
| [10-ROLE-MODEL.md](../10-ROLE-MODEL.md) | من يقرّر ماذا: القائد والدليل والمنفّذ |
| [11-WORKTREES.md](../11-WORKTREES.md) | كيف يُعزَل العمل المتوازي، شاغل واحد لكل شجرة عمل |
| [12-QUALITY-GATES.md](../12-QUALITY-GATES.md) | أي حرّاس التمرّرة الثانية يحمون الإصدار، وقاعدة الإيقاف |
| [13-CONTRIBUTING-WORKFLOW.md](../13-CONTRIBUTING-WORKFLOW.md) | كيف تُرسَّخ المساهمة: الفروع والالتزامات والمكوّنات والتصحيحات |
| [14-CI-RELEASE.md](../14-CI-RELEASE.md) | ماذا يشغّل CI، وكيف يُوسَم الإصدار ويُنشر |
| [15-DECISIONS.md](../15-DECISIONS.md) | أي القرارات صُدِّق عليها فعلًا، مع التاريخ والسياق والنتائج |
| [16-TASK-DISPATCH.md](../16-TASK-DISPATCH.md) | ما هو خطاف task-dispatcher، وخطاف `prompt` في OpenCode V2 الذي يرتبط به، والخطافات الستة التي بقيت على V1، ومفتاح إيقافه |
| [17-V2-HOOK-GAP.md](../17-V2-HOOK-GAP.md) | أي ردّات نداء الإضافة لها موقع هبوط حقيقي في OpenCode V2 وأي اثنين يفقدان أسنانهما الحاجبة، مع الدليل من الأنواع المنشورة |
| [spec/VANTRILEX_KIT_SPEC.md](../spec/VANTRILEX_KIT_SPEC.md) | للنسب فقط، للقراءة: التسمية، ومجموعة Tier-0 المحدّدة، والفهرس v2، وبيان المنقولات |
| [spec/VANTRILEX_SKILLS_SPEC.md](../spec/VANTRILEX_SKILLS_SPEC.md) | للنسب فقط، للقراءة: Vanguard في الجزء A، وDoctrine في الجزء B، وخريطة المراحل، ومجموعة ملفات المشروع الهدف الثمانية والعشرين |

## مسارات القراءة

يقرأ الوافد الجديد للتوجّه:

1. [01-OVERVIEW.md](01-OVERVIEW.md) ليعرف ما هو هذا المستودع.
2. [03-ARCHITECTURE.md](../03-ARCHITECTURE.md) ليعرف كيف يتركّب معًا.
3. [04-VANGUARD.md](04-VANGUARD.md) ليعرف ماذا تفعل مهارة الاستطلاع.
4. [05-DOCTRINE.md](05-DOCTRINE.md) ليعرف القوانين التي تضبط استخدام الطقم.
5. [10-ROLE-MODEL.md](../10-ROLE-MODEL.md) ليعرف من يقرّر ماذا.

ويقرأ المشغّل لتشغيل المشاريع:

1. [02-INSTALLATION.md](02-INSTALLATION.md) للمتطلبات والإعداد.
2. [04-VANGUARD.md](04-VANGUARD.md) لتجهيز مشروع هدف.
3. [09-KIT-LOCK.md](09-KIT-LOCK.md) ليعرف ما هو مثبَّت وكيف يُحدَّد نطاق الطقم.
4. [08-VERIFICATION.md](08-VERIFICATION.md) لإثبات أن الطقم يعمل.
5. [11-WORKTREES.md](../11-WORKTREES.md) لعزل العمل المتوازي.
6. [14-CI-RELEASE.md](../14-CI-RELEASE.md) لشحن إصدار.

ويقرأ المساهم لترسيخ التغييرات:

1. [13-CONTRIBUTING-WORKFLOW.md](../13-CONTRIBUTING-WORKFLOW.md) لانضباط الفروع والالتزامات.
2. [06-REGISTRY-SCHEMA.md](../06-REGISTRY-SCHEMA.md) لعقد السجلّ.
3. [07-CATALOG-GENERATION.md](../07-CATALOG-GENERATION.md) للمولِّد وقواعد الدمج.
4. [08-VERIFICATION.md](08-VERIFICATION.md) للبوابات التي يجب أن يجتازها التغيير.
5. [12-QUALITY-GATES.md](../12-QUALITY-GATES.md) لحرّاس الإصدار.
6. [11-WORKTREES.md](../11-WORKTREES.md) لقاعدة شجرة العمل أحادية الكاتب.
7. [15-DECISIONS.md](../15-DECISIONS.md) للقرارات المحسومة فعلًا.
8. [16-TASK-DISPATCH.md](../16-TASK-DISPATCH.md) للخطاف الذي يصنّف كل
   رسالة مستخدم في واحد من سيناريوهات المهام الخمسة.
9. [17-V2-HOOK-GAP.md](../17-V2-HOOK-GAP.md) ليعرف أي ردّات نداء الإضافة
   تُرحَّل إلى OpenCode V2 وأي اثنين يفقدان أسنانهما الحاجبة.

## الاتفاقيات المستعملة عبر المجموعة

- الأعداد صادقة وقابلة للفحص: 2,889 سجلًّا في الفهرس، و39 سجلًّا من المستوى
  `core` منها Prime وVanguard وDoctrine، و20 مكوّنًا مُحدَّدًا افتراضيًا،
  و1,210 أمر تثبيت متحقَّقًا منه، و16 ملفًا جانبيًا مدمجًا. انظر
  [01-OVERVIEW.md](01-OVERVIEW.md).
- كل أمر مسيَّج موجود في هذا المستودع أو في سير CI التي تعمل عليه. ولا أمر
  مُختلق للتوضيح.
- كل رابط نسبي يصل إلى ملف موجود. ومدخلات `spec/` مربوطة للنسب لا للتحرير.
