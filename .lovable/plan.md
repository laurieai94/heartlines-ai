## Mobile section spacing — small tighten

### What I observed on a 390×844 mobile viewport

All four landing sections (`meet kai`, `how it works`, `why we're different`, `HowItWorksSwipe`) currently use:

```
pt-12 pb-12 md:pt-20 md:pb-20
```

That's **48px top + 48px bottom = 96px between sections on mobile**. On a narrow phone screen, content rows are tall (stacked single-column) so 96px of empty space between sections reads as a noticeable gap — particularly between the swipe carousel and the footer, and between the timeline CTA and the swipe carousel. Desktop (80+80=160px) is fine because the content is wider and visually denser.

### Proposed change

Reduce mobile padding by one step, leave desktop alone:

```
pt-10 pb-10 md:pt-20 md:pb-20
```

That's **40px + 40px = 80px between sections on mobile**, still clearly separated but no longer feeling stretched. Desktop rhythm unchanged.

### Files

- `src/components/landing/LandingPage.tsx` — update the four `<section>` tags at lines 575, 687, 754, 829
- `.lovable/memory/design/homepage-spacing-standardization.md` — update standard to `pt-10 pb-10 md:pt-20 md:pb-20` (40px mobile / 80px desktop)

### Not changing

- Hero section padding (uses its own layout)
- Internal section padding, headings, container widths
- Footer spacing
