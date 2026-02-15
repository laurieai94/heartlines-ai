

## Fix Number Badge and Card Colors to Match Heartlines Brand

### Problem
The "How It Works" step number badges use `from-pink-500 via-orange-500 to-pink-600` -- that bright `orange-500` middle stop looks too orange and clashes with the heartlines warm burgundy/coral palette. The cards and numbers should feel cohesive with the bento grid cards further down the page, which use burgundy/pink tones.

### Changes

**File: `src/components/LandingPage.tsx`**

1. **Number badges (line 63)**: Replace `from-pink-500 via-orange-500 to-pink-600` with `from-pink-500 via-coral-500 to-rose-600` -- shifting from bright orange to a warm coral that matches the brand
2. **Badge shadow (line 64)**: Keep `shadow-pink-500/40` as-is (already on-brand)

This one-line gradient swap brings the number circles in line with the warm coral/pink/burgundy tones used in the bento grid cards, the CTA buttons, and the rest of the heartlines visual identity. No other files need changes.

### Result
The number badges shift from a jarring bright orange to a warm coral-to-rose gradient that blends naturally with the card backgrounds and the bento grid further down the page.

