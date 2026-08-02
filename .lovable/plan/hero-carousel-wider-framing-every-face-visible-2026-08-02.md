# Hero carousel: wider framing, every face visible

The screenshot shows the problem: the man's head is cropped by the top of the frame and the room is tight around the subject. This happens across the set because the images were generated as close/medium shots, so the carousel's fill-crop clips heads.

## What changes

Regenerate all 10 cheesy hero carousel images as **full-room wide shots**:

- Camera pulled back so the entire living room reads: ceiling line, wood paneling, shag carpet, side tables, lamps, photo walls, TV console.
- Subjects placed in the middle third of the frame with clear headroom above every head, and space below the feet, so the carousel's crop never cuts a face.
- Every person turned toward the camera with their full face unobstructed. Nothing (frames, cats, hats, other people) covers a face.
- Keep everything already dialed in: cheesy 90s studio-portrait stiffness, sweatsuits/velour/matching sets, distinct faces and slightly differing outfits per person, warm faded film grade.
- Wider aspect (landscape) so horizontal room detail survives the crop.

Same 10 files, same paths, so no import or component changes are needed:
`native-american-women`, `joyful-heritage-living-room`, `cowboys-with-wheelchair`, `asian-couple`, `warm-gathering`, `man-with-framed-memory`, `friends-with-cats`, `pride-couple`, `retro-peace`, `couple-on-couch`.

## Technical notes

- Overwrite in place at `src/assets/hero-carousel/cheesy/*.jpg`; `HeroCarousel.tsx` imports stay untouched.
- After regeneration, review each image and reshoot any where a head is still near an edge.
- If the carousel's `object-cover` still crops heads on short viewports, adjust `object-position` toward center-top per slide via the existing `imageStyle` field rather than re-cropping the source.
- Verify with a build.
