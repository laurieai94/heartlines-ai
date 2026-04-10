
## Move "Meet Kai" Above "How It Works"

Swap the two sections in `src/components/LandingPage.tsx`:

1. **Cut the "Meet Kai" section** (lines 718–829) and **paste it before the "How It Works" section** (currently at line 646)
2. **Adjust spacing** — the Meet Kai section currently uses `py-10 md:py-16` and How It Works uses `pt-6 pb-4`. After swapping, tweak padding so the flow feels seamless:
   - Meet Kai: change to `pt-6 pb-8 md:pt-8 md:pb-12` (tighter top since it follows the previous section, moderate bottom before How It Works)
   - How It Works: keep `pt-6 pb-4 md:pt-6 md:pb-8` as-is since it now sits below Meet Kai naturally

One file changed: `src/components/LandingPage.tsx` — section reorder + minor padding tweaks.
