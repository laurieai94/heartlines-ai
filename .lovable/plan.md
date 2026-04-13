

## Zoom in on the Asian couple slide

The slide currently has `transform: 'scale(0.85)'` which shrinks the image — that's why it doesn't fill the hero. Remove the scale entirely so it behaves like every other slide and covers the full viewport.

### Change in `src/components/HeroCarousel.tsx`

**Line 27**: Remove the `imageStyle` property from the Asian couple slide:

```
// Before
{ year: "2071", image: imageAsianCouple, tagline: "what it's all for", imageStyle: { transform: 'scale(0.85)' } }

// After
{ year: "2071", image: imageAsianCouple, tagline: "what it's all for" }
```

This lets `object-cover` do its job and fill the hero area completely, matching all other slides.

