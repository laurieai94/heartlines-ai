## Goal
Bring `/showcase` into brand lockstep with the live app — same logo, same fonts, same voice as the landing page, footer, and `HeartlinesWordmark`.

## What's off today
- **Logo**: uses generic lucide `Heart` icon + "font-serif" wordmark. The app uses `FlipPhoneIcon` + `font-brand` (Shrikhand) everywhere (nav header, footer, wordmark).
- **Fonts**: showcase uses `font-serif` (Crimson Text) for every headline. The app uses `font-brand` (Shrikhand) for the wordmark and section H2s, and `font-playfair` for hero display text.
- **Copy**: showcase says "relational intelligence, in your pocket" — not language the app uses. Product tagline is `powered by laurie ai`; landing hero uses "heartlines helps you connect"; product voice is lowercase, warm, direct.

## Changes to `src/pages/Showcase.tsx` only

1. **Nav header**
   - Replace `<Heart />` + `font-serif` wordmark with `<FlipPhoneIcon size={28} />` + `<span className="font-brand">heartlines</span>` (matches `SiteFooter`).
   - Add small `powered by laurie ai` line under wordmark using `font-glacial` (matches `HeartlinesWordmark`).

2. **Hero**
   - Replace `font-serif` H1 with `font-playfair` (landing hero convention).
   - Rewrite copy to match app voice:
     - Chips: `case study`, `2026`, `react · supabase · claude sonnet`
     - H1: `heartlines helps you connect.` (mirrors landing) with italic second line `a case study.`
     - Subhead in lowercase app voice — no "professional friend" invented phrase; use language already on the site (kai as ai relationship coach, remembers partners, lowercase voice, evidence-based).
     - Primary CTA: `try heartlines` → keep. Secondary: `read the mission` → keep.

3. **Section headings**
   - `anatomy of a kai reply` and `behind the scenes` H2s: swap `font-serif` → `font-brand` with the same pink-to-orange shimmer gradient the landing page uses on section headers, so they read as "heartlines" section titles.
   - Callout titles + body: keep lowercase, already aligned.

4. **Stats numerals**
   - Keep large numerals in `font-playfair` (matches landing display treatment) instead of `font-serif`.

5. **Footer**
   - Replace `<Heart />` + `font-serif` with `<FlipPhoneIcon />` + `font-brand` lockup, matching `SiteFooter` exactly.

## Out of scope
- No changes to `/showcase/demo` (already uses real `ChatBubble`, real avatar, real burgundy tokens).
- No changes to layout, section structure, or animation.
- No new assets — reuses existing `FlipPhoneIcon`, `font-brand`, `font-playfair`, `font-glacial`.
