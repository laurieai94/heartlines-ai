# Hero carousel: distinct faces, varied outfits

Regenerate the carousel images where subjects read as look-alikes or where a face is partly hidden. Keep the same cheesy posed 90s living-room style, filenames, slide order, and year labels.

## What changes

Five slides get regenerated with explicit variation:

- retro-peace (three women) — currently near-identical beehives, same sweat-set silhouette in three pastels. Give each a different hairstyle, face shape, age, skin tone, and a different top style (sweatshirt vs zip cardigan vs turtleneck).
- native-american-women (two women) — differentiate hair, glasses shape, build, and swap one velour tracksuit for a cardigan-and-slacks combo.
- friends-with-cats — currently mirrored poses and matching curlers; vary hair, glasses, and one wears a floral sweatshirt instead of a second velour tracksuit. Cats held lower so both faces are fully clear.
- pride-couple — both in the same windbreaker cut; keep the colors playful but change one to a knit sweater with a rainbow pin.
- warm-gathering (group) — verify every face is unobstructed and no two people share the same outfit; regenerate with staggered heights so no face is blocked by a shoulder.

## Rules applied to every prompt

- Every person's full face visible, unobstructed, eyes toward the camera.
- No two people in a frame share hairstyle, glasses, or outfit; only loosely coordinated, never matching.
- Different ages, builds, and skin tones within each group.
- Same warm tungsten 90s film grade, wood paneling, framed-photo walls, grain.

## Technical

- Regenerate into `src/assets/hero-carousel/cheesy/` over the existing filenames so `HeroCarousel.tsx` imports need no changes.
- Visually review each result and re-roll any frame that still shows twinning or a hidden face.
