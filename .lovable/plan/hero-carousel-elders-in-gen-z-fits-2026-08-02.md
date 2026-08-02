# hero carousel: elders in gen z fits

Same people, same rooms, same cheesy posed portrait energy. Only the wardrobe changes: these elders are dressed like they raided a 2026 gen z closet.

## The look

- Baggy wide-leg jeans and cargo pants, oversized graphic tees, cropped puffers, zip-up hoodies layered under vests.
- Chunky dad sneakers, tube socks pulled high, crossbody sling bags, bucket hats, beanies worn high.
- Tiny wire sunglasses, layered silver chains, claw clips, ribbon bows, chrome nails.
- Y2K-revival colors and washes: butter yellow, sage, washed denim, faded black, muted pastels. No true orange.
- Still stiff, straight-to-camera, hands folded awkwardly. The comedy is the contrast between the fit and the pose.

## What stays exactly the same

- All 10 filenames, slide order, year labels, taglines in `HeroCarousel.tsx`.
- Two people per photo (except `man-with-framed-memory.jpg`, still solo holding his framed photo).
- Same pairings: 3 heterosexual couples, 3 male couples, 3 female couples.
- Same ten distinct interiors (wood-panel den, floral parlor, southwestern room, photo-wall apartment, mint sitting room, green study, sunroom, brick apartment with cats, yellow living room, rec room).
- Wide full-room framing with generous headroom so the nav bar never clips a head.
- Warm faded film grade. Grain, vignette, and overlay treatment in the component untouched.
- Distinct faces and outfits within each frame, no twinning, every face fully visible.

## Technical

- Regenerate all 10 files in place at `src/assets/hero-carousel/cheesy/`, overwriting existing images.
- No edits to `HeroCarousel.tsx`.
- Review each result, reshoot any frame with a clipped head, hidden face, or a third person.
- Verify with a build and a hero screenshot at desktop and mobile widths.
