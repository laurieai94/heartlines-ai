

## Increase film grain intensity on hero carousel

### Changes to `src/components/HeroCarousel.tsx`

1. **Boost primary grain opacity** from `0.55` to `0.75`
2. **Increase secondary grain layer opacity** from `0.12` to `0.25`
3. **Add a third grain layer** using `screen` blend mode at `0.15` opacity to wash out digital sharpness
4. **Increase sepia** from `0.2` to `0.3` and reduce saturation from `0.85` to `0.75` on the image filter to further degrade the digital clarity
5. **Strengthen vignette** from `rgba(0,0,0,0.55)` to `rgba(0,0,0,0.65)`

Single file change, all CSS-only.

