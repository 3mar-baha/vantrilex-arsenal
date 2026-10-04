---
name: time-capsule-test
description: Use when code reads the clock, checks an expiry, compares a date, or stores when something happened, so a test written now still passes years from now.
---

# Time-Capsule Test

## Purpose

Write one test today whose whole purpose is to **still pass far in the future**, and make the
passing condition express the invariant instead of today's date. The owner idea (اختبار الكبسولة
الزمنية) is a test sealed against time itself: it fails the moment a date, an expiry, a clock, or
a staleness window silently becomes wrong.

Interpretation, stated plainly: most time bugs are invisible for years. A token expiring in 30
days, a cache with a 90-day window, a certificate, a "created within the last week" query. A
normal test written today passes today and says nothing about 2031. A time-capsule test fixes a
horizon (ten years, or the longest date the domain admits) and asserts the behaviour at that
horizon, so ordinary maintenance cannot quietly consume the assumption.

## When to Use

- Code calls a clock, reads the current date, or accepts a timestamp from outside.
- Anything expires: tokens, certificates, licences, leases, subscriptions, signed URLs.
- Anything goes stale: caches, denormalised copies, reports with an as-of date, revalidation.
- A window is compared, such as recent, current, last month, within N days.
- A migration or fixture contains a hard date that will eventually be in the past.

## Do NOT use

- Ordinary logic that takes a date as input and does arithmetic on it. Inject the clock and test
  the arithmetic; no horizon is needed.
- Tests that must fail once a real deadline passes. That is an expiry test with a real date, and
  the time capsule is the wrong instrument.
- Performance tests, timing-sensitive benchmarks, or anything whose result depends on machine
  load rather than on the calendar.
- A one-line date swap with no expiry or staleness semantics anywhere in the path.

## Inputs

- The code path under test, and the exact place the clock is read.
- The invariant that must hold at the far horizon, stated without any date from today.
- The horizon: a fixed future date, or the longest interval the domain permits.
- The injection seam. If the code calls the clock directly, that is the first thing to change.

### Step zero is mandatory

A test can only be sealed if the clock is injectable. If the code under test reads the system
clock directly, build the seam first — a clock parameter, or an exported time source — and prove
the existing tests still pass through it. A time-capsule test that cannot move time proves
nothing about time.

## Procedure

1. **Locate every clock read** in the path: system time, injected now, parsed dates, epoch
   arithmetic. List them. Two or more sources that disagree are a defect this skill will expose.
2. **Choose the horizon.** Prefer a named constant far out (ten years from authoring) over a date
   you compute at runtime. A runtime-computed horizon moves, and a moving horizon tests nothing.
3. **State the invariant without a date.** One sentence: what remains true no matter when the test
   runs. If the sentence needs today's date to make sense, the invariant has not been found.
4. **Freeze time at the horizon.** Through the injection seam, set the clock to the horizon date
   and run the path.
5. **Assert the invariant, not the value.** Compare the observable outcome to what the invariant
   demands. Asserting a hardcoded expected string that merely happens to be correct in 2031 is a
   snapshot, not a capsule; it will break on an unrelated format change and teach you nothing.
6. **Also assert the far past.** Set the clock well before the horizon and assert the same
   invariant still governs. Code that is correct only for dates in the present passes this step
   and fails step 4, and that asymmetry is the whole signal.
7. **Make the capsule fail on regression.** Introduce the specific defect the capsule exists to
   catch — widen a window by one unit, compare against the present instead of the horizon — and
   watch the test go red. A capsule that has never been seen red is unproven.
8. **Name the expiry it protects.** Write one line beside the test naming the real-world event
   that makes it matter, and the date or condition that event is expected on.

## Outputs

- One test per time-dependent path, clock injected at a fixed far horizon, asserting the invariant.
- A named clock seam, if one had to be introduced.
- The red-proof: the deliberate regression and the observed failure.
- One line per capsule naming the real event it defends against.

## Failure Modes

- **The horizon is recomputed at runtime.** The test then passes for a different reason each run.
  Pin the horizon as a constant.
- **The capsule freezes time and asserts a snapshot.** It breaks on every unrelated change and
  trains the team to delete it. Assert the invariant.
- **Only the future is tested.** Plenty of defects only misbehave for past dates. Both directions
  are required.
- **Timezone and locale leak in.** A horizon date crossing a DST boundary or a locale-format
  default produces a failure that has nothing to do with the invariant. Pin the timezone in the
  test when the path formats a date.
- **The seam was skipped.** Without clock injection the test cannot move time, and what looks
  like a capsule is an ordinary test with a long name.
- **Capsules rot into permanent failures.** When one fails, decide whether the invariant or the
  horizon is wrong. Changing the horizon to make it green is a silent deletion of the guard.
