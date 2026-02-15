

## Two Changes: Remove Periods from Subtitles + Add 3D Glow to Section Headers

### 1. Remove Periods from Bento Grid Subtitles

**File: `src/components/LandingPage.tsx`** (lines 871-899)

Remove the trailing period from all 7 subtitle strings:

| Current | Updated |
|---|---|
| "healthy tension > silent scrolling." | "healthy tension > silent scrolling" |
| "every identity, every story, no binaries." | "every identity, every story, no binaries" |
| "encrypted, never sold--your heartbreak isn't a dataset." | "encrypted, never sold--your heartbreak isn't a dataset" |
| "your relationship won't wait for your calendar to clear." | "your relationship won't wait for your calendar to clear" |
| "\"good vibes only\" never fixed a fight." | "\"good vibes only\" never fixed a fight" |
| "advice that knows the lore, no recaps needed." | "advice that knows the lore, no recaps needed" |
| "revenue funds community tools, not investor decks." | "revenue funds community tools, not investor decks" |

### 2. Add Subtle 3D Glow Effect to Section Headers

The reference images show a soft glossy/embossed look -- lighter pink highlight on top fading to a slightly deeper tone, with a warm diffused glow underneath. The current headers use `bg-clip-text text-transparent` which makes `textShadow` invisible since the text itself is transparent.

**Fix approach**: Wrap each header text in a `<span>` structure that layers:
- The gradient text (existing `bg-clip-text` technique) as the visible layer
- A duplicate behind it using `absolute` positioning with a soft pink `textShadow` to create the glow/depth effect

**File: `src/components/LandingPage.tsx`** -- Update all 3 section headers ("how it works", "meet kai", "why we're different"):

For each `h2`, replace the inline `style={{ textShadow }}` approach with a wrapper pattern:

```text
<h2 className="relative ...existing classes minus style...">
  {/* Glow layer behind */}
  <span className="absolute inset-0 text-pink-200/40 blur-[2px]"
    style={{ textShadow: '0 2px 12px rgba(236,72,153,0.5), 0 6px 20px rgba(251,146,60,0.3)' }}>
    how it works
  </span>
  {/* Gradient text on top */}
  <span className="relative bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent">
    how it works
  </span>
</h2>
```

This creates the subtle 3D depth: a soft diffused glow sits behind the crisp gradient text, giving the embossed/glossy look from the reference images without being too bold.

All 3 headers get the same treatment with their respective text content.

