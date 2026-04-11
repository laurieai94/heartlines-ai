

## Regenerate all 12 hero carousel images — more distinct subjects and wider framing

The current images look too similar to each other across slides. This regeneration pass will make each scene visually unique by specifying distinct physical characteristics, clothing, body types, and room aesthetics per image.

### Global style rules (every prompt)
- "Wide-angle lens, full room visible from wall to wall, floor to ceiling"
- "Subjects occupy no more than 40-50% of frame height"
- "Photorealistic editorial portrait photography, shot on 35mm film"
- "Cinematic warm color grading"
- "Leave clean negative space in the lower-left for text overlay"

### Key change: unique subject descriptions per scene

Each prompt will now specify **distinct physical traits** (age range, build, skin tone, hair style/color, clothing) so no two slides share similar-looking people.

| # | File | Subjects | Room |
|---|------|----------|------|
| 1 | elderly-native-american-women | Woman ~70 with long silver braids, turquoise jewelry, denim vest; woman ~65 with short black hair, round face, red woven shawl | Adobe-style room, southwestern rugs, golden hour |
| 2 | joyful-heritage-living-room | Man ~75 tall and lean, gray beard, kufi cap, earth-tone tunic; woman ~70 petite, natural gray afro, bright kente-print blouse | Rich wood furniture, African masks, warm lamplight |
| 3 | cowboys-with-wheelchair | Man ~80 stocky, white mustache, brown cowboy hat, denim jacket; man ~70 slim, clean-shaven, black cowboy hat, plaid shirt, wheelchair | Rustic ranch room, leather furniture, desert art |
| 4 | warm-gathering-diverse-souls | Four friends: Asian woman with bun, Latino man with glasses, Black woman with locs, white man with beard — all different builds/heights | Eclectic living room, cultural art, mixed textiles |
| 5 | manos-unidas | Woman ~75 curvy, silver bun, embroidered Mexican blouse; man ~78 thin, bald, reading glasses, guayabera shirt | Terracotta walls, santos, hand-painted tiles |
| 6 | warm-embrace-pride | Man ~70 heavyset, bald, thick-rimmed glasses, cardigan; man ~68 slim, full gray hair, turtleneck sweater | Mid-century modern room, Progress Pride flag, books |
| 7 | couple-on-couch | Woman ~80 small frame, permed white hair, floral dress; man ~82 large build, thick gray hair, suspenders and button-down | Wood-paneled den, family photos, amber lamplight |
| 8 | asian-couple-serene-moment | Man ~72 Japanese, salt-and-pepper hair, linen shirt; woman ~68 Korean, short bob with bangs, simple blouse | Minimalist apartment, bonsai, large windows, natural light |
| 9 | man-with-treasured-memory | Single man ~85, deep wrinkles, wire-frame glasses, wool cardigan, holding ornate photo frame | Cozy den, bookshelves, warm reading lamp |
| 10 | friends-cats-city-view | Woman ~75 white, tall, curly red-gray hair, blue sweater, tabby cat; woman ~72 Black, short natural gray hair, glasses, floral top, calico cat | City apartment, big window with skyline |
| 11 | retro-peace-living-room | Woman ~68 thin, long straight gray hair, headband, tie-dye shirt; woman ~72 curvy, short curly auburn hair, peace-sign earrings, peasant blouse | Colorful retro room, vintage posters, macrame |
| 12 | warm-smiles-vintage-home | Man ~76 medium build, neatly combed gray hair, vest over shirt; woman ~74 plump, wavy silver hair, hand-knit shawl | Floral wallpaper, crocheted blankets, soft lamp |

### Execution
1. Generate all 12 at 1920x1080 using `google/gemini-3-pro-image-preview`
2. Save to `/mnt/documents/` for review
3. Batches of 3 with delays between
4. Convert to WebP and replace files in `src/assets/hero-carousel/` and `src/assets/`

