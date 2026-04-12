

## Add Motion Throughout the Landing Page

The page currently has ScrollReveal on major sections and hover effects on buttons, but between those moments everything feels static. Here's a layered approach to add life without overwhelming.

### 1. Staggered pill/tag entrance (Meet Kai section)
The five tags (inclusive for all, evidence-based care, etc.) currently appear all at once. Wrap each in its own ScrollReveal with incremental delays (0ms, 80ms, 160ms...) so they cascade in one by one from left to right.

**File**: `src/components/LandingPage.tsx` (lines 653-669)

### 2. Floating accent blobs that drift on scroll
The static decorative blurs in the hero section (lines 453-454) should use the existing `animate-float` class with staggered delays so they gently bob, giving the background subtle movement.

**File**: `src/components/LandingPage.tsx` (lines 453-454)

### 3. How It Works step dots: staggered pop-in
Each of the four step circles currently appears together inside one ScrollReveal. Move each step into its own ScrollReveal with increasing delay (0, 150, 300, 450ms) so they cascade across the screen.

**File**: `src/components/LandingPage.tsx` (lines 703-724)

### 4. Section headings: subtle gradient animation
Add a slow-moving gradient shimmer to the "meet kai", "how it works", and "why we're different" headings using a CSS `background-size: 200%` with a keyframe that shifts the gradient position. This makes the headings feel alive without being distracting.

**Files**: `src/components/LandingPage.tsx` (heading elements), `tailwind.config.ts` (new `text-shimmer` keyframe)

### 5. Hero phone mockup: gentle float
The `HeroPhoneScroll` component wrapper already has `animate-fade-in`. Add `animate-float` alongside it so the phone gently bobs up and down after its entrance, giving the hero persistent motion.

**File**: `src/components/LandingPage.tsx` (line 507)

### 6. CTA buttons: subtle breathing glow
The "get started" and "find clarity, not chaos" buttons already have static glows. Add the existing `animate-soft-pulse-glow` class to their wrappers so the glow pulses gently, drawing the eye.

**File**: `src/components/LandingPage.tsx` (CTA button elements)

### Summary of new code
- **1 new keyframe** in `tailwind.config.ts`: `text-shimmer` (background-position shift)
- **All other changes** in `src/components/LandingPage.tsx`: wrapping elements in ScrollReveal, adding existing animation classes

### Files to edit
- `tailwind.config.ts` -- add `text-shimmer` keyframe + animation
- `src/components/LandingPage.tsx` -- staggered tags, floating blobs, staggered steps, heading shimmer, phone float, CTA glow

