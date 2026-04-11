

## Regenerate all 12 hero carousel images

### Style rules (applied to every prompt)
All prompts will include:
- "Both subjects looking straight ahead directly into the camera lens"
- "Seated side by side on a couch, perfectly centered in the frame"
- "Symmetrical composition, medium-wide shot showing the full living room"
- "Photorealistic editorial portrait photography, shot on 35mm film"
- "Cinematic warm color grading"

### The 12 scenes

| # | Scene | Unique details |
|---|-------|---------------|
| 1 | Native American women | Southwestern art, woven blankets, golden hour light |
| 2 | Heritage couple | African cultural art, kente cloth accents, warm lamplight |
| 3 | Cowboys southwestern | Cowboy hats, desert landscape art, leather furniture |
| 4 | Diverse gathering | Four diverse elderly friends, cultural art, unity symbols |
| 5 | Latino couple (manos unidas) | Warm terracotta tones, religious art, hand-painted tiles |
| 6 | Pride couple | Two elderly men, Progress Pride flag, vintage furniture |
| 7 | Vintage couple | Wood-paneled room, family photos, warm amber light |
| 8 | Asian couple | Modern minimalist apartment, indoor plants, large windows |
| 9 | Man with framed memory | Single elderly man holding photo frame, cozy den |
| 10 | Friends with cats | Two elderly women, cats on laps, city apartment, big window |
| 11 | Retro peace women | Two elderly women, peace symbols, colorful retro decor |
| 12 | Warm vintage couple | Floral wallpaper, crocheted blankets, soft lamplight |

### Execution
1. Copy `lovable_ai.py` to `/tmp/`
2. Generate all 12 images using `google/gemini-3-pro-image-preview` with delays between calls to avoid rate limits
3. Save as PNGs to `/mnt/documents/` for review before converting to WebP and replacing assets
4. Generate in batches of 3 with pauses between batches

### After review
Once you approve the generated images, I will:
- Convert all to WebP format
- Replace the 12 files in `src/assets/hero-carousel/`
- Update the corresponding files in `src/assets/` (used by YearCarousel)

No code changes until images are approved.

