

## Add Scroll-Triggered Reveal Animations to the Landing Page

### Approach

Create a lightweight `ScrollReveal` wrapper component that uses IntersectionObserver to fade+slide elements in as they enter the viewport. Then wrap each major section of the landing page with it.

### New Component

**File: `src/components/ScrollReveal.tsx`**

A simple wrapper that starts elements as invisible (opacity-0, translated down ~20px) and transitions them to visible when they scroll into view. Props:
- `delay` (optional) -- stagger delay in ms
- `direction` -- fade from bottom (default), left, or right
- `className` -- pass-through

Uses IntersectionObserver with `threshold: 0.15` and `rootMargin: '0px 0px -50px 0px'` so elements animate just before they're fully in view. Once triggered, it stays visible (no re-hiding).

### Landing Page Updates

**File: `src/components/LandingPage.tsx`**

Wrap these sections with `<ScrollReveal>`:

1. **"How It Works" section header** (line ~638-643) -- fade up the "how it works" heading
2. **"How It Works" step cards grid** (line ~646-673) -- fade up with slight stagger per card (handled by existing `animationDelay` on StepCard, so just wrap the grid)
3. **"Get Started" CTA button** (line ~676-698) -- fade up
4. **"Meet Kai" section** (line ~705-852) -- fade up the left column (avatar) and right column (copy) separately with a slight stagger
5. **"Why We're Different" section header + timeline** (line ~855-927) -- fade up heading, then timeline
6. **HowItWorksSwipe section** (line ~931-935) -- fade up

### Technical Details

- CSS transition approach (not keyframe): `transition: opacity 0.6s ease-out, transform 0.6s ease-out`
- Initial state: `opacity: 0; transform: translateY(24px)`
- Revealed state: `opacity: 1; transform: translateY(0)`
- `once: true` -- observer disconnects after first trigger to avoid re-animations
- No external dependencies needed
- Keeps existing `animate-fade-in` classes on elements that already have them (those fire on mount for above-fold content, which is correct)

