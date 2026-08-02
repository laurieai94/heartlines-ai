# hero carousel: two people per photo, varied lives

Every slide becomes exactly two people, except the one kept as-is. Rooms get pulled apart so no two slides feel like the same house.

## Slide assignments

Same 10 filenames, same order, so no component changes.

| file | who |
| --- | --- |
| `man-with-framed-memory.jpg` | keep exactly as it is, one man holding up the framed photo |
| `couple-on-couch.jpg` | heterosexual couple |
| `joyful-heritage-living-room.jpg` | heterosexual couple |
| `pride-couple.jpg` | two men |
| `cowboys-with-wheelchair.jpg` | two men (one using a wheelchair, keep the western character) |
| `native-american-women.jpg` | two women |
| `retro-peace.jpg` | two women |
| `asian-couple.jpg` | heterosexual couple |
| `friends-with-cats.jpg` | two men with their cats |
| `warm-gathering.jpg` | two women |

That lands 3 heterosexual couples, 3 male couples, 3 female couples, plus the solo framed-photo slide.

## Room variety

Each slide gets a distinct interior so the set reads as ten different lives, not one set redressed:

- 70s wood-panel den with orange shag and a console TV
- pale blue floral wallpaper parlor with lace doilies and plastic-covered sofa
- southwestern adobe room with saddle blankets and cow skull
- dense photo-wall apartment with houseplants everywhere and a fire escape window
- mint-green kitchen-adjacent sitting room with formica and hanging spoons
- dark green study with bookcases, brass lamps, taxidermy trout
- sunroom with wicker furniture, jalousie windows, terracotta pots
- red-brick city apartment with a radiator, cats, and a record collection
- yellow-wallpaper living room with a crocheted afghan and church fan collection
- rec room with wood-grain paneling, bowling trophies, and a bar cart

## What stays the same

- Cheesy posed 90s studio-portrait stiffness, both people facing camera.
- Velour tracksuits, matching sets, loud florals, oversized glasses, suspenders. Distinct faces, distinct outfits, no twinning.
- Wide full-room framing with generous headroom above every head so the nav bar and the carousel crop never clip a face.
- Warm faded film grade. Grain, vignette, and overlay treatment in `HeroCarousel.tsx` untouched.

## Technical

- Overwrite the nine files in place at `src/assets/hero-carousel/cheesy/`; `man-with-framed-memory.jpg` is not regenerated.
- No edits to `HeroCarousel.tsx` (imports, slide order, year labels, taglines all unchanged).
- Review each result and reshoot any where a head sits near an edge or a third person creeps in.
- Verify with a build and a hero screenshot at desktop and mobile widths.
