

## Align Card Titles and Descriptions Horizontally Across Cards

**File: `src/components/LandingPage.tsx` (StepCard component, lines 51-97)**

### Problem
The icon and title share a `flex-1` container, so cards with longer titles push the description block down unevenly. Titles and descriptions don't line up across the row.

### Solution
Restructure the card's internal layout so the icon has a fixed height, the title has a fixed height allocation, and the description always starts at the same vertical position.

### Changes

1. **Remove `flex-1` from the top content div** (line 73): change `space-y-4 flex-1` to just `space-y-4` so the icon+title section takes only its natural height rather than stretching

2. **Give the icon a fixed height** (line 75): add `h-8` to the icon wrapper so it's consistent

3. **Give the title a minimum height** (line 82): add `min-h-[3.5rem] md:min-h-[4rem] flex items-end` to the title `h3` so all titles occupy the same vertical space regardless of wrapping, and text aligns to the bottom

4. **Keep `flex-1` on the description div** (line 90): this already has `flex-1` which will push the description to fill remaining space consistently

This ensures across all four cards: icons align, titles align at their baseline, and descriptions start at the same vertical position.
