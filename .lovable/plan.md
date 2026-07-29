## Goal

Turn `/showcase` from a "case study" page into a clean product showcase, keep the phone constrained with breathing room on every screen, and scrub em dashes / off-brand copy.

## Changes

### 1. Phone always has padding (no matter screen size)

In `src/components/showcase/KaiScreenRecording.tsx`:
- Replace the `max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px]` sizing with a cap of `max-w-[300px]` (or `320px`) plus explicit horizontal padding on the wrapper so the phone never touches the viewport or column edge.
- Wrap the phone in a container with `px-6 sm:px-8` and a smaller absolute max width so the frame stays comfortably inside its column on mobile, tablet, and desktop.
- Also cap the height with `max-h-[80vh]` fallback so it never overflows short viewports.

In `src/pages/Showcase.tsx`:
- The hero column that hosts the phone gets its own `px-4 sm:px-6` and center alignment so the phone sits inside a padded card, not flush to the grid edge.

### 2. Reframe as a showcase, not a case study

In `src/pages/Showcase.tsx`:
- Remove all "case study" language: `<title>`, meta description, the `case study` chip, the italic `a case study.` subhead, and the footer `· a case study` tag.
- New `<title>`: `heartlines · showcase`. Meta description reuses the app tagline.
- Hero headline reduces to the brand line only: `heartlines helps you connect.` (no italic subhead).
- Delete the "anatomy of a kai reply" 6-card section and the "behind the scenes" stats section entirely. A showcase does not need engineering breakdowns or eval numbers.
- Keep only: nav, hero (copy + phone), footer.

### 3. Use app copy and branding

- Sub-copy under the hero headline becomes the actual product voice used on the live site, e.g.: `kai is your ai friend for the relationships that matter. she remembers the people in your life, notices your patterns, and meets you where you are.`
- Chips reduce to brand-consistent ones: `powered by laurie ai`, `2026`. Drop the tech-stack chip (`react · supabase · claude sonnet`) since this is a showcase, not a case study.
- Primary CTA stays `try heartlines`. Secondary link `read the mission` stays (it points to a real app route).
- Footer keeps the `FlipPhoneIcon` + `heartlines` lockup with the `powered by laurie ai` tagline underneath, matching `SiteFooter`.

### 4. No em dashes anywhere on the page

Replace every `—` in `Showcase.tsx` with either a period, a comma, or "and", whichever reads best. Sweep hero copy, section copy, and any remaining strings. Same sweep in `src/data/showcaseThanksgiving.ts` conversation lines and in `KaiScreenRecording.tsx` caption.

## Out of scope

- No changes to `/showcase/demo` behavior beyond removing em dashes from the scripted Kai lines.
- No changes to the live app, landing page, or shared components.
