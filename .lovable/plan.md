
## Zoom out on the retro-peace slide (2088)

The subjects in the "2088" slide (retro-peace-living-room) are getting cropped. To zoom out on just this image, I'll add an optional `style` override to the slide data and apply a CSS `transform: scale(0.85)` on that specific image so more of the scene is visible.

### Changes in `src/components/HeroCarousel.tsx`

1. **Add optional `imageStyle` to the `Slide` interface** -- e.g. `imageStyle?: React.CSSProperties`
2. **Set `imageStyle: { transform: 'scale(0.85)' }` on the 2088 slide** to pull the camera back
3. **Apply `slide.imageStyle` to the `<img>` tag's style prop**, merged with the existing filter styles
