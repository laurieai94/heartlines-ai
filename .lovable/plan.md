

## Regenerate all 12 hero carousel images — intimate couples, joyful, full-room framing

The user clarified: these are ALL intimate couples. The solo man (image 9) is holding a framed photo of his late wife — that's still a couple scene, just a poignant one. No need to add a second living person to that image.

### Global prompt rules (all 12)
- "Ultra wide-angle lens, camera 12 feet back, entire room visible wall-to-wall, floor to ceiling"
- "Subjects occupy no more than 25-30% of frame height — the room is the co-star"
- "Photorealistic editorial portrait photography, shot on 35mm film"
- "Cinematic warm color grading"
- "Leave clean negative space in lower-left for text overlay"
- "Genuine warm smiles, joyful, intimate, loving"

### The 12 scenes

| # | File | Scene |
|---|------|-------|
| 1 | elderly-native-american-women | Two women ~65-70, intimate couple laughing together on a couch. Long silver braids + turquoise jewelry; short black hair + red woven shawl. Adobe room, southwestern rugs, golden hour |
| 2 | joyful-heritage-living-room | Intimate couple: man ~75 tall, gray beard, kufi cap, earth-tone tunic; woman ~70 petite, gray afro, kente blouse. Beaming, leaning into each other. African masks, warm lamplight |
| 3 | cowboys-with-wheelchair | Intimate couple: man ~80 stocky, white mustache, brown cowboy hat; man ~70 slim, black cowboy hat, wheelchair beside couch. Grinning proudly, arms around each other. Rustic ranch room |
| 4 | warm-gathering-diverse-souls | Intimate couple: Asian woman ~68 silver bun; Latino man ~72 glasses, gray mustache. Warm embrace, foreheads close, joyful. Eclectic living room, cultural art |
| 5 | manos-unidas | Intimate couple: woman ~75 curvy, silver bun, embroidered Mexican blouse; man ~78 thin, bald, guayabera. Holding hands lovingly, warm smiles. Terracotta walls, santos |
| 6 | warm-embrace-pride | Intimate couple: man ~70 heavyset, bald, thick glasses, cardigan; man ~68 slim, gray hair, turtleneck. Happy, relaxed, holding hands. Mid-century room, Progress Pride flag |
| 7 | couple-on-couch | Intimate couple: woman ~80, permed white hair, floral dress; man ~82 large build, suspenders. Arm around her, content smiles. Wood-paneled den, family photos |
| 8 | asian-couple-serene-moment | Intimate couple: man ~72 Japanese, salt-and-pepper hair, linen shirt; woman ~68 Korean, short bob, simple blouse. Peaceful happy smiles, her head on his shoulder. Minimalist apartment, bonsai |
| 9 | man-with-treasured-memory | Single man ~85, wire-frame glasses, wool cardigan, sitting on couch holding ornate framed photo of his late wife close to his chest. Warm nostalgic smile, eyes bright with love. Cozy den, bookshelves, warm reading lamp |
| 10 | friends-cats-city-view | Intimate couple: woman ~75 white, curly red-gray hair, blue sweater, tabby cat in lap; woman ~72 Black, short gray hair, glasses, floral top, calico cat. Laughing together. City apartment, skyline window |
| 11 | retro-peace-living-room | Intimate couple: woman ~68 thin, long straight gray hair, headband, tie-dye; woman ~72 curvy, short curly auburn hair, peace earrings. Big grins, playful energy. Retro room, vintage posters, macrame |
| 12 | warm-smiles-vintage-home | Intimate couple: man ~76 neatly combed gray hair, vest; woman ~74 plump, wavy silver hair, hand-knit shawl. Radiating warmth, her hand on his knee. Floral wallpaper, crocheted blankets |

### Execution
1. Generate all 12 at 1920x1080 using `google/gemini-3-pro-image-preview` in batches of 3
2. Convert to WebP
3. Replace all files in `src/assets/hero-carousel/` and sync to `src/assets/`
4. No code changes — filenames stay the same

