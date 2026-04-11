

## Regenerate all 12 hero carousel images — wider framing

All 12 images will be regenerated with significantly wider compositions showing more of the room environment.

### Updated style rules (every prompt)
- "Both subjects looking straight ahead directly into the camera lens"
- "Seated side by side on a couch, perfectly centered in the frame"
- "Symmetrical composition, wide shot showing the FULL living room from wall to wall"
- "Photorealistic editorial portrait photography, shot on 35mm film"
- "Cinematic warm color grading"
- **NEW**: "Wide-angle lens, pulled back far enough to see floor, ceiling, and both walls"
- **NEW**: "Subjects occupy no more than 40-50% of the frame height"
- **NEW**: "Show furniture, decor, and architectural details of the full room"
- **NEW**: "Two clearly different people — different facial structure, hairstyle, clothing, not twins or mirrored"
- **NEW**: "Leave clean negative space in the lower-left for text overlay"

### The 12 scenes (unchanged)

| # | File | Scene |
|---|------|-------|
| 1 | elderly-native-american-women | Two Native American women, southwestern art, woven blankets, golden hour |
| 2 | joyful-heritage-living-room | African heritage couple, kente cloth accents, warm lamplight |
| 3 | cowboys-with-wheelchair | Two cowboys, desert landscape art, leather furniture |
| 4 | warm-gathering-diverse-souls | Four diverse elderly friends, cultural art, unity symbols |
| 5 | manos-unidas | Latino couple, terracotta tones, religious art, hand-painted tiles |
| 6 | warm-embrace-pride | Two elderly men, Progress Pride flag, vintage furniture |
| 7 | couple-on-couch | Vintage couple, wood-paneled room, family photos, amber light |
| 8 | asian-couple-serene-moment | Asian couple, modern minimalist apartment, plants, large windows |
| 9 | man-with-treasured-memory | Single elderly man holding photo frame, cozy den |
| 10 | friends-cats-city-view | Two elderly women with cats, city apartment, big window |
| 11 | retro-peace-living-room | Two elderly women, peace symbols, colorful retro decor |
| 12 | warm-smiles-vintage-home | Couple, floral wallpaper, crocheted blankets, soft lamplight |

### Execution
1. Copy `lovable_ai.py` to `/tmp/`
2. Generate all 12 images at 1920x1080 using `google/gemini-3-pro-image-preview`
3. Save as PNGs to `/mnt/documents/` for review
4. Generate in batches of 3 with delays between batches

### After generation
- Convert to WebP and replace all files in `src/assets/hero-carousel/` and `src/assets/`
- No code changes needed — same filenames

