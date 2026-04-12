

## Zoom out on the Asian couple hero slide

**File**: `src/components/HeroCarousel.tsx`

**What changes**: Add per-slide optional styling support so the `imageAsianCouple` slide renders at a slightly zoomed-out scale, showing more of the scene. 

1. Add an optional `imageStyle` property to the `Slide` interface
2. On the Asian couple slide (index 3, year "2071"), set `transform: 'scale(0.85)'` so the image pulls back, revealing more of the couple and room
3. Apply `slide.imageStyle` to the `<img>` tag's inline `style` prop, merged with the existing sepia/contrast filter

This only affects the one slide — all others remain unchanged.

