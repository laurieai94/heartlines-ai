

## Enhance Bento Grid Cards + Remove Trailing Periods

Two changes: visually elevate the cards while staying within the brand, and strip the periods from subtitle text.

### 1. Remove trailing periods from subtitles
**File: `src/components/LandingPage.tsx`** (lines 873-889)

Remove the `.` at the end of all five subtitle strings:
- `"\"good vibes only\" never fixed a fight."`  -->  `"\"good vibes only\" never fixed a fight"`
- `"every identity, every story, no binaries."`  -->  `"every identity, every story, no binaries"`
- `"your relationship won't wait for your cal to clear."`  -->  `"your relationship won't wait for your cal to clear"`
- `"healthy tension > silent scrolling."`  -->  `"healthy tension > silent scrolling"`
- `"encrypted, never sold—your heartbreak isn't a dataset."`  -->  `"encrypted, never sold—your heartbreak isn't a dataset"`

### 2. Visual enhancements to bento cards
**File: `src/components/ui/timeline.tsx`**

Layer several subtle effects to make the cards feel richer without breaking the brand:

**a) Add a subtle inner glow / light sweep**
- Add a `::before` pseudo-element (via an inner div) with a radial gradient highlight in the top-left corner (`bg-[radial-gradient(ellipse_at_top_left,_rgba(255,132,80,0.15)_0%,_transparent_60%)]`). This gives each card a warm "lit from above" feel.

**b) Increase icon size on hero/wide cards**
- Scale up icons on the larger cards (index 0, 3) from 32x32 to 40x40 by wrapping them in a `scale-125` container, making the hierarchy more pronounced.

**c) Add a subtle decorative accent line**
- Place a small horizontal gradient bar (coral-to-pink, ~40px wide, 2px tall) between the icon and title on each card. This adds visual rhythm and ties into the brand gradient.

**d) Improve card backgrounds with variation**
- Give each card a slightly unique gradient angle or tint so they don't all look identical:
  - Hero card (index 0): `from-burgundy-800/95 via-burgundy-700/85 to-pink-900/75` (slightly brighter)
  - Tall card (index 1): add a subtle coral tint `to-coral-600/10`
  - Accent strip (index 4): use a more horizontal gradient with a hint of orange

**e) Enhance hover state**
- Add `hover:shadow-[0_8px_32px_rgba(255,132,80,0.2),0_0_60px_rgba(236,72,153,0.15)]` for a multi-layer warm glow on hover instead of the single pink shadow.

**f) Typography refinement**
- Make titles use `font-playfair` (Playfair Display) for a more editorial, premium feel that matches the brand's "Modern Nostalgia" language.
- Bump subtitle `tracking-wide` for better readability.

### Technical summary

| File | Changes |
|------|---------|
| `src/components/LandingPage.tsx` | Remove trailing `.` from 5 subtitle strings |
| `src/components/ui/timeline.tsx` | Add inner glow div, accent line, font refinement, enhanced hover shadows, icon scaling, slight gradient variation per card |

