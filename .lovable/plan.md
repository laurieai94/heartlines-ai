## Goal
On the `/showcase` page, guarantee the hero column (headline + subhead + CTA) and the phone mock are both fully visible at every viewport size — no clipping, no forced scroll — while keeping the current two-column desktop / stacked mobile layout.

## Changes

### 1. `src/pages/Showcase.tsx` — height-aware hero section
- Make the hero section fit within the viewport: `min-h-[100svh]`, `flex flex-col`, so header + hero + footer share the screen intentionally instead of overflowing.
- Cap the headline with viewport-height-aware clamps so it can never push the CTA off screen on short/wide laptops:
  - Headline: `fontSize: clamp(2rem, min(8.5vw, 9vh), 4.75rem)` (keeps two-line rule from last turn, but also shrinks when height is tight).
  - Subhead and CTA gaps: switch `mt-8` / `mt-10` to `mt-[clamp(1rem,3vh,2.5rem)]` so vertical rhythm collapses on short screens.
- Tighten the section's own padding on short viewports: `pt-[clamp(0.5rem,2vh,2.5rem)] pb-[clamp(1rem,4vh,6rem)]`.

### 2. `src/components/showcase/KaiScreenRecording.tsx` — phone always fits
- Replace the current fixed `max-w-[320px]` + `aspectRatio: 9/18` + `maxHeight: min(78vh, 720px)` with a height-first sizing rule so the phone scales down before it can clip:
  - Wrapper: `h-full max-h-[min(82svh,720px)]` and use flexbox to center.
  - Phone element: set `height: 100%`, `aspect-ratio: 9/18`, `width: auto`, and `max-width: 100%` so it shrinks by height on short screens and by width on narrow screens without ever exceeding either.
- Reduce the outer `py-10 sm:py-14 lg:py-16` wrapper padding to `py-[clamp(0.5rem,2vh,2.5rem)]` so the phone gets more vertical room when needed.
- Keep the ambient glow, caption ("texting anxiety" etc.), and progress pips, but move them inside the same height budget by wrapping phone + caption in a single flex column with `min-h-0` so the caption never gets pushed below the fold.

### 3. Two-column layout on desktop
- In `Showcase.tsx`, change the grid row to `md:grid-cols-[1.15fr_1fr] md:items-stretch` and give both columns `min-h-0` so the phone can measure against the row height rather than the page height.
- On mobile (stacked), the order stays phone → text; the section becomes `min-h-[100svh]` with `justify-between` so text + CTA anchor to the bottom while the phone occupies the top portion.

## Result
- Desktop, laptop, tall mobile, short landscape phones: hero copy + CTA + phone mock all render within the initial viewport without cutoff or scroll.
- No copy, colors, or brand elements change — only sizing and layout math.
