
Goal

- Make the homepage section spacing feel intentional and consistent without undoing the tighter hero → Meet Kai spacing you already approved.

What I found

- The uneven feel is coming from a mix of:
  1. different `pt/pb/py` values on each top-level section in `src/components/LandingPage.tsx`
  2. large internal CTA margins, especially in How It Works
  3. extra vertical padding inside `src/components/ui/timeline.tsx`
- The biggest offenders are:
  - Meet Kai → How It Works
  - How It Works → Why We’re Different

Plan

1. Keep the top of the page mostly intact
   - Preserve the tighter carousel → hero → Meet Kai handoff so the first fold still feels compact.

2. Standardize the main content-section rhythm in `src/components/LandingPage.tsx`
   - Normalize the outer spacing for:
     - Meet Kai
     - How It Works
     - Why We’re Different
     - HowItWorksSwipe
   - Use one shared medium rhythm for these content sections instead of a different padding recipe for each one.

3. Remove “fake section spacing” caused by inner margins
   - Reduce the large `Get Started` CTA wrapper margins in How It Works so that section spacing is controlled by the section wrapper, not by a big `mt/mb` block.
   - Trim the top margin before the “find clarity, not chaos” CTA for the same reason.

4. Tighten the Timeline wrapper
   - In `src/components/ui/timeline.tsx`, reduce/remove the wrapper’s vertical `py-4` so the Why We’re Different section no longer has hidden extra whitespace inside it.

Files

- `src/components/LandingPage.tsx`
- `src/components/ui/timeline.tsx`

Technical details

- Current values are mixed:
  - Meet Kai: `pt-2 pb-8 md:pt-4 md:pb-12`
  - How It Works: `pt-6 pb-4 md:pt-6 md:pb-8`
  - How It Works CTA: `mt-12 md:mt-16 mb-8 md:mb-16`
  - Why We’re Different: `py-3 md:py-5`
  - HowItWorksSwipe: `pt-4 pb-3 md:pt-8 md:pb-6`
  - Timeline wrapper: `px-4 py-4`
- I’ll make the section wrappers own the vertical rhythm, then scale back the internal margins/padding that are distorting it.

Expected result

- The hero transition stays intentionally tighter.
- The rest of the homepage sections will have a much more even, polished rhythm.
- The page should feel cleaner and less “randomly spaced” at both mobile and the current tablet/desktop width.
