

## Improve Visual Separation Between Description and Parenthesized Text

**File: `src/components/LandingPage.tsx` (lines 91-100)**

### Changes

1. **Increase spacing** between description and secondary text: bump `mt-2` to `mt-4` (16px gap instead of 8px) on the secondary text element (line 96)

2. **Tighten description line-height**: change the description from `leading-loose` to `leading-relaxed` (line 91) so it reads as a cohesive paragraph rather than sprawling text

3. **Reduce secondary text size slightly**: keep `text-sm` but remove `md:text-base` on the secondary text (line 96) so the parenthesized copy is visually distinct from the main description at all screen sizes

These three adjustments create a clear visual hierarchy: the description reads as a tight block, then a generous gap separates it from the lighter, smaller parenthesized line below.

### Technical Details

- Line 91: change `leading-loose` to `leading-relaxed` on the description `<p>`
- Line 96: change `mt-2` to `mt-4` and remove `md:text-base` on the secondary text `<p>`

