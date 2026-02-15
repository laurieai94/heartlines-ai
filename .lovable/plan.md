

## Update Bento Card Titles and Subtitles

Simple text update to the five bento grid cards in `src/components/LandingPage.tsx` (around lines 871-890).

### Changes

| Current Title | New Title | Subtitle (unchanged) |
|---|---|---|
| real talk only | no fake positivity | "good vibes only" never fixed a fight |
| queer- and trauma-informed | for actual humans | every identity, every story, no binaries |
| built for busy | made for right now | your relationship won't wait for your calendar to clear |
| tough talks welcome | conflict-ready | healthy tension > silent scrolling |
| private by design | private, always | encrypted, never sold—your heartbreak isn't a dataset |

Note: The subtitle for "made for right now" also changes slightly -- "cal" becomes "calendar".

### Technical detail

Single file edit in `src/components/LandingPage.tsx`, updating the `title` property on all five `stops` objects and the `subtitle` on the third card. The pill badges above the section (lines ~810-830) that reference "private by design" will also be updated to "private, always" for consistency.

