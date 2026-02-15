

## Update Bento Grid: New Card Text + Two New Cards

### Overview
Update all five existing card texts and add two new cards ("context-aware" and "built to give back") to the bento grid, expanding from 5 to 7 cards. The grid layout needs to be adjusted to accommodate the extra cards.

### Changes

#### 1. `src/components/LandingPage.tsx` -- Update stops array

Update existing 5 cards and add 2 new entries:

| # | Title | Subtitle | Icon |
|---|---|---|---|
| 1 | no fake positivity | "good vibes only" never fixed a fight. | HeartSupportIcon |
| 2 | for actual humans | every identity, every story, no binaries. | InclusiveIcon |
| 3 | made for right now | your relationship won't wait for your calendar to clear. | ClockIcon |
| 4 | conflict-ready | healthy tension > silent scrolling. | ConversationIcon |
| 5 | private, always | encrypted, never sold -- your heartbreak isn't a dataset. | ShieldIcon |
| 6 (new) | context-aware | advice that knows the lore, no recaps needed. | PersonalIcon |
| 7 (new) | built to give back | revenue funds community tools, not investor decks. | New icon (e.g. a simple community/give-back SVG) |

Will need to import or create an icon for card 7. PersonalIcon is already exported and fits "context-aware" well.

#### 2. `src/components/ui/timeline.tsx` -- Expand grid config

**gridPlacements** -- add 2 more entries for a balanced 7-card bento on a 3-column grid:

```text
Current (5 cards):        New (7 cards):
[  2-col  ] [ tall ]      [  2-col  ] [ tall ]
[ 1-col  ] [ tall ]      [ 1-col  ] [ tall ]
[   2-col wide   ]       [   2-col wide   ]
[    3-col full    ]      [ 1-col ] [  2-col  ]
                          [    3-col full    ]
```

New placements:
- Card 6: `md:col-span-1 md:row-span-1` (standard)
- Card 7: `md:col-span-2 md:row-span-1` (wide)
- Move the full-width "private, always" card to position 7 (last) as the accent strip, or keep order as-is and assign new cards at the end

**cardGradients** -- add 2 more gradient entries for visual variety

**Card logic** -- the `isAccent` check (`index === stops.length - 1`) already targets the last card dynamically, so the full-width accent strip will automatically apply to "built to give back" as card 7

#### 3. New icon for "built to give back"

Create a simple community/giving SVG icon (e.g. hands or a sprout) in the same gradient line-art style as the existing icons, exported from `timeline.tsx`.

### Files Modified
- `src/components/ui/timeline.tsx` -- new icon, expanded gridPlacements and cardGradients arrays
- `src/components/LandingPage.tsx` -- two new entries in the stops array

