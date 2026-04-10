

## Regenerate Hero Carousel Images with Photorealistic AI

### Overview
Generate 3 test images using the latest AI image model (Gemini 3 Pro) to see how much more realistic we can get. If you like the results, we can regenerate all 12.

### Test batch — 3 diverse scenes

I'll pick 3 images that represent different couple types and settings:

1. **elderly-native-american-women.webp** — "Two elderly Native American women sharing a warm moment together on their couch, surrounded by traditional art and cultural treasures"
2. **asian-couple-serene-moment.webp** — "Elderly Asian couple in their modern apartment, still together after decades"
3. **warm-embrace-pride.webp** — "Warm embrace in nostalgic space with Progress Pride flag and vintage furniture"

### Prompt strategy
Each prompt will be crafted for photorealism:
- Specify "photorealistic, editorial portrait photography, shot on 35mm film" style cues
- Natural lighting (golden hour, soft window light)
- Authentic skin textures, wrinkles, expressions
- Shallow depth of field, cinematic color grading
- Warm, intimate domestic settings with lived-in detail

### Technical steps
1. Copy the AI gateway script to `/tmp/`
2. Generate 3 images using `google/gemini-3-pro-image-preview` (highest quality model)
3. Save outputs to `/mnt/documents/` as PNGs for your review
4. You compare the new vs old and decide whether to proceed with all 12

### What happens after
If you approve the test images, I'll regenerate all 12 carousel images, convert them to WebP, and replace the existing assets in `src/assets/hero-carousel/`. Both `HeroCarousel.tsx` and `YearCarousel.tsx` use the same image set, so all carousels update automatically.

No code changes needed for the test — just image generation and review.

