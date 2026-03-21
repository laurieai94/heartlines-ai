

## Fix: Embla Carousel Version Mismatch

The build error is caused by a version mismatch between `embla-carousel-autoplay` (8.6.0) and `embla-carousel-react` (8.3.0). They bundle different versions of the core `embla-carousel` types, causing a type conflict.

### Fix
Update `embla-carousel-react` from `^8.3.0` to `^8.6.0` in `package.json` so both packages use the same core version.

Single line change, no other files affected.

