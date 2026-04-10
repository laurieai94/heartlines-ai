

## Re-generate test images with stricter composition rules

One or more of the v2 images still has subjects not looking directly at the camera. I'll regenerate all 3 with even more explicit prompt constraints.

### Prompt changes
Every prompt will now include these exact phrases:
- "Both subjects looking straight ahead directly into the camera lens"
- "Seated side by side on a couch, perfectly centered in the frame"
- "Symmetrical composition, medium-wide shot showing the full living room"

### Updated prompts

**Image 1 — Native American women**
"Photorealistic editorial portrait photography, shot on 35mm film. Two elderly Native American women seated side by side on a couch, perfectly centered in the frame, both looking straight ahead directly into the camera lens with warm smiles. Symmetrical composition, medium-wide shot showing the full living room — traditional Southwestern art on walls, woven blankets, cultural treasures on shelves. Natural golden hour window light. Authentic weathered skin with natural wrinkles and laugh lines. Cinematic warm color grading."

**Image 2 — Asian couple**
"Photorealistic editorial portrait photography, shot on 35mm film. An elderly Asian couple seated side by side on a couch, perfectly centered in the frame, both looking straight ahead directly into the camera lens with gentle expressions. Symmetrical composition, medium-wide shot showing the full living room — modern minimalist apartment, indoor plants, soft natural light from large windows. Authentic skin textures. Cinematic warm color grading."

**Image 3 — Pride embrace**
"Photorealistic editorial portrait photography, shot on 35mm film. Two elderly men seated side by side on a vintage sofa, perfectly centered in the frame, both looking straight ahead directly into the camera lens with proud warm expressions. A Progress Pride flag on the wall behind them. Symmetrical composition, medium-wide shot showing the full living room — vintage furniture, framed photos, warm lamplight. Authentic weathered skin with natural wrinkles. Cinematic warm color grading."

### Execution
1. Copy AI gateway script to `/tmp/`
2. Generate 3 images as v3 PNGs using `google/gemini-3-pro-image-preview`
3. Save to `/mnt/documents/` for review

No code changes — image generation only.

