

## Fix Card Text Alignment in "How It Works" Section

**Problem**: In the 2x2 grid of step cards, the description text and italic secondary text don't line up horizontally across cards in the same row. For example, card 01 ("build your profile") has a longer description than card 02 ("add your person"), causing the italic text below to sit at different heights.

**Solution**: Restructure the card's internal flex layout so each text section occupies a consistent vertical zone, with the italic secondary text always pinned to the bottom of the card.

---

### Technical Changes

**File: `src/components/LandingPage.tsx` (StepCard component, lines 47-104)**

1. Change the bottom description section (currently a plain `div`) into a flex column with `flex-1` so it stretches to fill remaining space.
2. Add `mt-auto` to the secondary italic text so it always sits at the card's bottom edge, regardless of how many lines the description takes.

Specifically:
- Line 90: Change `<div className="relative z-10">` to `<div className="relative z-10 flex flex-col flex-1">`
- Line 91: Add `flex-1` to the description `<p>` so it absorbs extra space
- Line 96: Add `mt-auto` to the secondary text `<p>` so it pins to the bottom

This ensures:
- Titles align across cards (already working via the top `flex-1` section)
- Description text starts at the same height
- Italic secondary text always sits at the bottom of each card, perfectly aligned across the row
