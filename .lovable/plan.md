
## Two Changes: Globe Icon + Match "How It Works" Card Colors

### 1. Replace CommunityIcon with a Globe/World Icon

**File: `src/components/ui/timeline.tsx`** (lines 95-116)

Replace the current hands/seedling SVG paths in `CommunityIcon` with a simple globe design:
- A circle for the earth outline
- Horizontal curved latitude lines
- A vertical ellipse for the longitude meridian
- Same 32x32 viewBox, same `community-gradient`, same stroke style

### 2. Match "How It Works" Card Backgrounds to Bento Grid

**File: `src/components/LandingPage.tsx`** (lines 51-56)

The "How It Works" cards currently use `from-white/20 via-white/15 to-white/10` -- a light glassmorphic style. The bento grid ("why we're different") cards use rich burgundy gradients like `from-burgundy-800/90 via-burgundy-700/85 to-pink-900/70`.

Update the card background gradient to match:
- Change `from-white/20 via-white/15 to-white/10` to `from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70`
- Update the hover gradient similarly: `from-burgundy-800/95 via-burgundy-700/85 to-pink-900/75`
- Keep the existing border, shadow, and transition classes

This makes both card sections visually cohesive with the same warm burgundy tone.
