

## Regenerate all 12 hero carousel images — joyful expressions, full-room framing

### Problems to fix
- Subjects look sad/stoic — need genuine joy, warmth, smiles
- Still too zoomed in — need to see the entire couch, floor, walls, ceiling
- Subjects still look too similar across slides

### Updated global style rules (every prompt)
- "Genuine warm smiles, laughing, joyful expressions, eyes crinkled with happiness"
- "Ultra wide-angle lens, entire room visible including floor, ceiling, all walls, and full couch"
- "Subjects occupy no more than 30-35% of the frame height"
- "Camera placed 10-12 feet back from the couch"
- "Photorealistic editorial portrait photography, shot on 35mm film"
- "Cinematic warm color grading"
- "Two clearly different people — different facial structure, hairstyle, build, clothing"
- "Leave clean negative space in the lower-left for text overlay"

### The 12 scenes (same subjects/rooms, adding joy + pulling camera way back)

| # | File | Key additions to prompt |
|---|------|----------------------|
| 1 | elderly-native-american-women | Laughing together, sharing a joyful moment |
| 2 | joyful-heritage-living-room | Beaming smiles, warm eye contact with camera |
| 3 | cowboys-with-wheelchair | Grinning proudly, relaxed and happy |
| 4 | warm-gathering-diverse-souls | All four laughing, animated conversation |
| 5 | manos-unidas | Warm smiles, holding hands lovingly |
| 6 | warm-embrace-pride | Happy and relaxed, genuine smiles |
| 7 | couple-on-couch | Glowing with warmth, content smiles |
| 8 | asian-couple-serene-moment | Peaceful happy smiles, serene joy |
| 9 | man-with-treasured-memory | Warm nostalgic smile, eyes bright |
| 10 | friends-cats-city-view | Laughing, cats in laps, cheerful |
| 11 | retro-peace-living-room | Big grins, playful energy |
| 12 | warm-smiles-vintage-home | Radiating warmth and contentment |

### Execution
1. Generate all 12 at 1920x1080 using `google/gemini-3-pro-image-preview`
2. Batches of 3 with delays between
3. Convert to WebP and replace files in both `src/assets/hero-carousel/` and `src/assets/`

