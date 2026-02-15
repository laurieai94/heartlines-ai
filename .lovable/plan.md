

## Update "Why We're Different" Subtitles

Two small changes needed: update the subtitle text in LandingPage.tsx and fix the rendering logic in timeline.tsx that currently only shows parenthetical text.

### 1. Update subtitle data
**File: `src/components/LandingPage.tsx` (lines 871-891)**

Replace the five subtitle strings with the new copy:

| Card | New subtitle |
|------|-------------|
| real talk only | "good vibes only" never fixed a fight. |
| queer- and trauma-informed | every identity, every story, no binaries. |
| built for busy | your relationship won't wait for your cal to clear. |
| tough talks welcome | healthy tension > silent scrolling. |
| private by design | encrypted, never sold--your heartbreak isn't a dataset. |

### 2. Fix subtitle rendering logic
**File: `src/components/ui/timeline.tsx` (lines 183-190)**

The current code only renders text inside parentheses (`subtitle.split('(')[1]`). Since the new subtitles have no parentheses, update the render to simply display `stop.subtitle` directly -- remove the parenthetical extraction logic and the wrapping conditional.
