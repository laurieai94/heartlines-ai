# Hero carousel: cheesier, more character-forward portraits

Regenerate the hero carousel imagery so it matches the uploaded reference: stiff, posed, straight-to-camera family-portrait energy with real personality — matching tracksuits and sweatsuits, suspenders, curlers, loud floral prints, crocheted couch throws, wall-to-wall framed photos, wood paneling, shag rugs. Warm, funny, human. Not the current serious/cinematic-tender look.

## Direction

- Everyone faces camera, seated or standing in a slightly awkward posed line-up, the way a real family photo gets taken in a living room.
- Wardrobe does the comedy: velour tracksuits, matching sweat sets, holiday sweaters, socks with loafers, suspenders, oversized glasses.
- Interiors stay maximalist and lived-in: dense photo walls, doilies, plastic-covered furniture, ceramic figurines, houseplants.
- Keep the warm 90s film grade already used across the site (soft golden tungsten, warm shadows, no orange-cast). Grain, vignette, and overlay treatment in the component stay unchanged.
- Keep the same diversity of subjects the carousel currently has (Native American women, Black couples, Asian couple, cowboys, pride couple, friends with cats, group gathering).

## Scope

- Replace all 10 hero carousel images with newly generated versions in this style, keeping the existing filenames, slide order, and year labels so nothing else changes.
- No copy, layout, animation, or timing changes.

## Technical

- Generate 10 images into `src/assets/hero-carousel/`, one per existing import in `src/components/landing/HeroCarousel.tsx`.
- Reuse the current import names; only the underlying files change (new files added alongside if the format differs, with imports repointed).
- Verify with a build and a preview screenshot of the hero at desktop and mobile widths.
