

## Update Card Description Text

**Changes in `src/components/LandingPage.tsx` (lines 652-679):**

- **Card 01** ("build your profile"): Change description from "show how you really vibe—calm, stressed, or full chaos." to "show how you really vibe: calm, stressed, or full chaos." (em dash to colon). Also remove the period from secondaryText: "(no fake bios here.)" becomes "(no fake bios here)"
- **Card 02** ("add your person"): Change description from "bring them in too, so kai sees the full picture." to "spill it, vent it, practice it. then get advice that actually slaps."
- **Card 03** ("chat with kai"): Change description from "show how you really vibe: calm, stressed, or full chaos." to "spill it, vent it, practice it. then get advice that actually slaps."
- **Card 04** ("try it irl"): Change description from "test it out in the wild—less fights, more feels." to "test it out in the wild: less fights, more feels."

All parenthesized secondary text remains untouched.

### Technical Details

Single file edit to `src/components/LandingPage.tsx`, updating 4 description strings and removing one period from a secondaryText string in the step cards array (lines ~652-679).
