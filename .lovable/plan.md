

## Add grain/worn-in texture to hero carousel images

The screenshot shows the images look too clean and digital. Adding a film grain and vintage texture effect will give them an authentic, editorial feel that matches the Heartlines brand aesthetic.

### Approach
Apply CSS-based grain and vintage effects directly in the HeroCarousel component — no need to regenerate images. This is faster, more controllable, and reversible.

### Changes to `src/components/HeroCarousel.tsx`
1. Add a pseudo-overlay layer on each slide with a CSS noise/grain texture using an SVG filter (`feTurbulence`)
2. Add a subtle vignette overlay (dark edges) for a worn-in look
3. Slightly desaturate and warm the images with CSS filters (`sepia`, `saturate`, `contrast`)

### Technical details
- SVG `feTurbulence` filter defined inline for film grain noise
- Overlay div with `mix-blend-mode: overlay` and low opacity for the grain layer
- Radial gradient vignette overlay (transparent center, dark edges)
- Image CSS filter: `sepia(0.15) saturate(0.9) contrast(1.05)` for a subtle vintage color shift
- All CSS-only — no image regeneration needed

