

## Changes

### 1. All carousel slides use the new tagline
In `src/components/HeroCarousel.tsx`, change every slide's `tagline` to `"this is what it's all for"`.

### 2. Center "How It Works" steps on mobile
In `src/components/LandingPage.tsx` line 711, the mobile layout uses `items-start text-left pl-14`. Change to `items-center text-center pl-0` on mobile so the step dots and titles are centered. Move the dot from `absolute left-3` to a centered flow position on mobile.

### 3. Remove "no fake positivity" card
In `src/components/LandingPage.tsx`, remove the "no fake positivity" entry from the Timeline stops array (lines 788-791). Update the bento grid layout in `src/components/ui/timeline.tsx` to work with 6 cards instead of 7 (adjust `gridPlacements` and `cardGradients` arrays).

### 4. Center the globe icon on "built to give back"
In `src/components/ui/timeline.tsx` line 212, the last card (accent) uses `justify-start` for its icon. Since "built to give back" will now be the last card, change the accent card's icon alignment and text alignment to centered (remove the `isAccent` left-alignment logic, or adjust so it centers).

### Files to edit
- `src/components/HeroCarousel.tsx` — all taglines to `"this is what it's all for"`
- `src/components/LandingPage.tsx` — remove "no fake positivity" stop, center steps on mobile
- `src/components/ui/timeline.tsx` — update grid placements for 6 cards, center accent card icon/text

