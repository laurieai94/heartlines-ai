

## Move text overlay down and increase grain intensity

### Changes to `src/components/HeroCarousel.tsx`

1. **Move year + tagline lower**: Shift the text container from `bottom-20 md:bottom-32` down to `bottom-6 md:bottom-10` so it sits at the very bottom of the viewport and doesn't overlap the couple on the couch.

2. **Increase grain opacity**: Bump the film grain overlay opacity from `0.18` to `0.35` for a more pronounced worn-in texture.

3. **Increase grain frequency**: Adjust `feTurbulence baseFrequency` from `0.65` to `0.8` for finer, denser grain.

