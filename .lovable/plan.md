
## Increase film grain intensity on hero carousel

### Changes to `src/components/HeroCarousel.tsx`

1. **Boost grain overlay opacity** from `0.35` to `0.55` for a much more visible worn-in texture
2. **Switch blend mode** from `overlay` to `soft-light` which lets more grain show through on darker areas
3. **Add a second grain layer** with `multiply` blend mode at `0.12` opacity to simulate dust/scratches in shadows
4. **Strengthen vignette** — darken edges from `rgba(0,0,0,0.45)` to `rgba(0,0,0,0.55)` for a more aged feel
5. **Slightly increase sepia** on images from `0.15` to `0.2` to complement the heavier grain

All CSS-only changes in one file.
