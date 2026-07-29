## Goal

Create a beautiful, portfolio-ready showcase of heartlines that leads with the Kai chat interface — something you can drop into a Lovable portfolio site or share as a standalone link.

## Recommended approach: a dedicated `/showcase` case-study page

A single scrollable page inside this project, unlisted (not in nav, `noindex`), that presents heartlines the way a design portfolio would. This is better than a screenshot because it's live, responsive, and stays in sync with the real product.

### Page structure

1. **Hero** — heartlines wordmark, one-line positioning ("relational intelligence, in your pocket"), role/timeline/stack chips (Designer + AI engineer · 2025 · React, Supabase, Claude), and a muted "view live site" link to `heartlines.ai`.

2. **The Kai chat centerpiece** — the hero moment. A polished mock of the chat interface running an on-rails scripted conversation (Kai's real voice, real bubble styling, real typing indicator, autoplay + pause on hover). Rendered inside a device frame (phone on mobile, floating phone + soft burgundy gradient on desktop). No backend calls — a pre-scripted transcript replays so it always looks perfect and costs nothing.

3. **Anatomy of a Kai reply** — one annotated screenshot pulling out the craft details: lowercase voice, partner-name specificity, no therapy-speak, crisis handoff rule, prompt-caching architecture. This is where the AI engineering shows.

4. **Product surfaces** — 3–4 product-shot images (chat, partner profile, weekly reflection, account) in a bento grid, each with a one-line caption. Generated via the product-shot skill on burgundy/cream gradients so they feel cohesive.

5. **Behind the scenes** — short prose + small stat row: tiered memory system, Anthropic prompt caching hit-rate, static/dynamic prompt split, 100-scenario eval harness (42% → target). Positions you as someone who ships and measures, not just designs.

6. **Footer** — quiet links: live site, contact, back to portfolio.

### Style

Reuses the existing heartlines design system (Deep Burgundy, Cream, Warm Gold, serif display) so the case study feels like the product. No new palette. Generous whitespace, editorial rhythm — closer to a Linear/Vercel case study than a marketing landing.

### Routing & privacy

- New route `/showcase` — not linked from the main site nav.
- `<meta name="robots" content="noindex">` on this route via `react-helmet-async` so it stays off search.
- Share by direct link only.

## Technical notes

- New files: `src/pages/Showcase.tsx`, `src/components/showcase/KaiChatDemo.tsx` (scripted replay, no LLM call), `src/components/showcase/AnatomyCallouts.tsx`, `src/components/showcase/ProductBento.tsx`.
- Scripted conversation lives in `src/data/showcaseConversation.ts` — reuses existing `ChatMessage` bubble components so styling stays 1:1 with production.
- Product-shot images generated with the product-shot skill (burgundy preset), saved under `src/assets/showcase/`.
- Route added to `src/App.tsx` inside the existing router, wrapped so it bypasses `AuthGuard`.
- Helmet added for `<title>heartlines — case study</title>`, description, and `noindex`.

## Alternatives (say which you prefer)

- **A. Live case-study page inside this app** (recommended above) — best fidelity, always current, one link to share.
- **B. Standalone Lovable portfolio project** — a separate small Lovable site that embeds screenshots, a video, and links back here. Better if you want multiple projects on one portfolio domain.
- **C. Static assets only** — I generate polished product shots + a 10-second scripted screen recording of Kai; you drop them into whatever portfolio you already have.

## Out of scope

- No changes to production chat, auth, or the marketing landing.
- No new backend, no LLM calls from the showcase page.
- No SEO / indexing of the showcase route.

## Questions before I build

1. **A, B, or C?** (Recommend A.)
2. Should the Kai demo autoplay a scripted convo, or stay static with 3–4 pre-rendered message screenshots?
3. Include the "behind the scenes" engineering section, or keep it purely visual/product-focused?
