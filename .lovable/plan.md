

## Regenerate all 12 hero carousel images — extreme wide-angle, mixed emotions

### Core problems from screenshot
- Images are still cropped tight on the subjects — the room is barely visible
- Every person is smiling the same way — feels fake and repetitive
- The couch and room need to be the dominant visual, with people as part of the scene

### Updated global prompt rules (all 12)
- **"Extreme wide-angle architectural photograph, 14mm lens, camera placed 15 feet back from the couch"**
- **"Full room visible: floor, ceiling, all four walls, furniture, decor — the room fills the entire frame"**
- **"Couple seated on a couch perfectly centered in the middle of the frame"**
- **"Subjects occupy no more than 20-25% of the frame height — the room is the star, not the people"**
- "Photorealistic editorial photography, shot on 35mm film, cinematic warm color grading"
- "Leave clean negative space in lower-left for text overlay"
- **No universal emotion directive** — each scene gets its own authentic mood (some joyful, some stoic, some tender, some contemplative)

### The 12 scenes — with varied, authentic emotions

| # | File | Couple | Mood | Room |
|---|------|--------|------|------|
| 1 | elderly-native-american-women | Two women ~65-70. Silver braids + turquoise; short black hair + red shawl | Quiet contentment, gentle smiles | Adobe room, southwestern rugs, golden hour |
| 2 | joyful-heritage-living-room | Man ~75, gray beard, kufi cap; woman ~70, gray afro, kente blouse | Laughing together, animated joy | Rich wood, African masks, warm lamplight |
| 3 | cowboys-with-wheelchair | Man ~80, white mustache, cowboy hat; man ~70, slim, black cowboy hat, wheelchair nearby | Stoic pride, slight grins | Rustic ranch, leather furniture, desert art |
| 4 | warm-gathering-diverse-souls | Asian woman ~68, silver bun; Latino man ~72, glasses, gray mustache | Tender embrace, foreheads close | Eclectic room, cultural art, mixed textiles |
| 5 | manos-unidas | Woman ~75, silver bun, embroidered blouse; man ~78, bald, guayabera | Warm but serious, holding hands | Terracotta walls, santos, hand-painted tiles |
| 6 | warm-embrace-pride | Man ~70, heavyset, bald, thick glasses; man ~68, slim, gray hair, turtleneck | Relaxed happiness, easy smiles | Mid-century modern, Progress Pride flag |
| 7 | couple-on-couch | Woman ~80, permed white hair, floral dress; man ~82, large build, suspenders | Deep contentment, stoic warmth | Wood-paneled den, family photos, amber lamp |
| 8 | asian-couple-serene-moment | Man ~72, salt-and-pepper hair, linen shirt; woman ~68, short bob, simple blouse | Serene, peaceful, her head on his shoulder | Minimalist apartment, bonsai, natural light |
| 9 | man-with-treasured-memory | Man ~85, wire-frame glasses, wool cardigan, holding framed photo of late wife | Nostalgic, bittersweet smile, eyes bright | Cozy den, bookshelves, reading lamp |
| 10 | friends-cats-city-view | Woman ~75, curly red-gray hair, tabby cat; woman ~72 Black, glasses, calico cat | Laughing, playful energy | City apartment, big skyline window |
| 11 | retro-peace-living-room | Woman ~68, long gray hair, headband, tie-dye; woman ~72, curly auburn hair, peace earrings | Big grins, mischievous joy | Retro room, vintage posters, macrame |
| 12 | warm-smiles-vintage-home | Man ~76, combed gray hair, vest; woman ~74, wavy silver hair, knit shawl | Quiet dignity, soft warmth | Floral wallpaper, crocheted blankets, lamp |

### Key prompt changes from previous attempts
1. Switched from "ultra wide-angle" to **"extreme wide-angle architectural photograph, 14mm lens, 15 feet back"** — more aggressive framing language
2. Reduced subject size target from 30-35% to **20-25%** of frame height
3. Added **"full room visible: floor, ceiling, all four walls"** explicitly
4. Removed blanket "joyful smiling" — replaced with **per-scene authentic emotions** (stoic, tender, laughing, contemplative, bittersweet)
5. Added **"couple centered on couch in the middle of the frame"** for consistent composition

### Execution
1. Generate all 12 at 1920x1080 using `google/gemini-3-pro-image-preview` in batches of 3 with delays
2. Convert to WebP
3. Replace all files in `src/assets/hero-carousel/` and sync to `src/assets/`
4. No code changes — filenames stay the same

