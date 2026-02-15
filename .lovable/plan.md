

## Add Subtle Idle Movements to Bento Cards (Desktop)

Add gentle, continuous micro-animations to the bento grid cards on desktop to make the section feel alive and dynamic.

### Approach

Apply CSS `@keyframes` animations that create a slow, floating/breathing effect on each card. Each card gets a slightly different animation delay and subtle variation so they don't all move in sync -- this creates an organic, living feel.

### Animations

- **Gentle float**: Cards slowly drift up/down by ~3-4px on a long cycle (6-8 seconds)
- **Staggered timing**: Each card gets a different `animation-delay` based on its index so the movement feels natural, not robotic
- **Desktop only**: Wrap in `md:` responsive prefix or use a media query check -- no movement on mobile to avoid jank on touch devices

### Technical Details

**File: `src/components/ui/timeline.tsx`**

1. Add a `float` keyframe animation via inline styles or Tailwind arbitrary values:
   - `@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }`
   - Duration: ~6s per card, with `ease-in-out` for smoothness
   - Each card gets `animation-delay: ${index * 1.2}s` for stagger

2. Apply the animation only on `md:` breakpoint using a wrapper class or media query check

3. Ensure hover transforms (`hover:-translate-y-1`) still layer properly on top of the float by using separate transform properties or combining them

### Result

Cards will gently bob in place like they're floating, each slightly out of phase with the others -- creating a premium, polished feel without being distracting.

