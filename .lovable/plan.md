
## Re-generate 3 test images with adjusted composition

### Prompt adjustments
All three prompts will be updated with:
- "Looking directly at the camera" — eye contact with viewer
- "Centered composition, medium-wide shot" — subjects centered in frame, pulled back enough to see the full room/environment
- "Full body or three-quarter framing" — not cropped tight on faces

### Execution
1. Copy the AI gateway script to `/tmp/`
2. Re-generate all 3 images using `google/gemini-3-pro-image-preview` with the updated prompts
3. Save to `/mnt/documents/` as v2 PNGs for comparison

### Updated prompts

**Image 1 — Native American women**
"Photorealistic editorial portrait photography, shot on 35mm film. Two elderly Native American women sitting together on a couch in their living room, looking directly at the camera with warm smiles. Centered composition, medium-wide shot showing the full room — traditional Southwestern art on walls, woven blankets, cultural treasures on shelves. Natural golden hour window light. Authentic weathered skin with natural wrinkles and laugh lines. Shallow depth of field, cinematic warm color grading."

**Image 2 — Asian couple**
"Photorealistic editorial portrait photography, shot on 35mm film. An elderly Asian couple sitting together in their modern minimalist apartment, looking directly at the camera with gentle expressions. Centered composition, medium-wide shot showing the living space — clean lines, indoor plants, soft natural light from large windows, minimal decor. Authentic skin textures. Shallow depth of field, cinematic warm color grading."

**Image 3 — Pride embrace**
"Photorealistic editorial portrait photography, shot on 35mm film. Two elderly men sitting together on a vintage sofa in their nostalgic living room, looking directly at the camera with proud warm expressions. A Progress Pride flag hangs on the wall behind them. Centered composition, medium-wide shot showing the full room — vintage furniture, framed photos, warm lamplight. Authentic weathered skin with natural wrinkles. Shallow depth of field, cinematic warm color grading."

One script run, 3 output files. No code changes.
