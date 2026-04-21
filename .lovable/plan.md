

## Add breathing room between landing page sections

The screenshot shows "meet kai" → "how it works" → "why we're different" stacking with almost no gap. Per the homepage spacing memory, sections currently use `pt-4 pb-4 md:pt-6 md:pb-8` which is too tight.

### Change

Bump vertical padding on the three affected landing sections to give clear separation without feeling sparse.

- **Current:** `pt-4 pb-4 md:pt-6 md:pb-8` (~16–32px)
- **New:** `pt-12 pb-12 md:pt-20 md:pb-20` (~48–80px)

### Files to edit

- `src/components/landing/LandingPage.tsx` — update section wrappers for "meet kai", "how it works", and "why we're different" blocks
- Update `mem://design/homepage-spacing-standardization` to reflect the new standard

### Notes

- Keeps the rhythm consistent across all three sections
- Mobile gets a smaller bump (48px) so it doesn't feel stretched on small screens; desktop gets the full 80px
- No changes to internal section padding — only the gap between sections

