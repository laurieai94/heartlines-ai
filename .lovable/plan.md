

## Reduce gaps between hero and Meet Kai sections only

The extra spacing lives in two places — everything else is already tight:

### Changes in `src/components/LandingPage.tsx`

1. **Carousel-to-hero spacer** (line 440): Reduce `h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28` → `h-6 sm:h-8 md:h-12 lg:h-16 xl:h-20`

2. **Meet Kai section top padding** (line 575): Reduce `pt-6 pb-8 md:pt-8 md:pb-12` → `pt-2 pb-8 md:pt-4 md:pb-12`

These two changes close the gaps between the carousel → hero → Meet Kai without touching anything else.

