## Goal

Replace the current `/showcase` design with the layout in the reference: a two-column hero with a bold split headline on the left and a glassy, floating phone on the right playing a scripted kai chat. Keep brand voice, tokens, and lowercase copy.

## Layout (desktop, `≥md`)

```text
┌───────────────────────────────────────────────────────────┐
│  heartlines · powered by laurie ai              view site │
│                                                           │
│                                            ╭───────────╮  │
│                                            │ 9:41  💬  │  │
│  relationships                             │ kai       │  │
│  aren't rom-coms.                          │ communi…  │  │
│                                            │           │  │
│  heartlines helps you connect.             │ [user]    │  │
│                                            │ [kai]     │  │
│  ( let's get real → )                      │ [typing…] │  │
│                                            │           │  │
│                                            │ chat…  ▲  │  │
│                                            ╰───────────╯  │
│                                            texting anxiety│
│                                            ▂▁▁▁▁          │
└───────────────────────────────────────────────────────────┘
```

Mobile stacks: hero copy first, phone below.

## Left column (hero)

- Headline in two color-graded lines using existing brand gradient tokens (rose→coral→gold):
  - line 1: `relationships`
  - line 2: `aren't rom-coms.`
- Serif display (`font-playfair`), oversized, tight tracking.
- Sub-headline underneath in white: `heartlines helps you connect.` with `heartlines` in `font-brand`.
- Primary CTA pill with the brand rose→coral gradient + soft glow: `let's get real →`, links to `https://heartlines.ai`.
- Drop the two chips (`powered by laurie ai`, `2026`) and the secondary `read the mission` link to match the reference's cleaner composition.

## Right column (phone mockup)

Rework `KaiScreenRecording` from a dark iframe device into a **glassmorphic floating frame** that matches the reference:

- No black phone bezel; instead a translucent rounded rectangle (`rounded-[2.25rem]`, `border border-white/15`, `bg-white/[0.04]`, backdrop-blur), with a soft ambient rose/gold outer glow.
- Small `9:41` status text + a subtle chat glyph badge in the top-right corner (glowing pill, decorative).
- Header row inside: circular kai avatar, `kai` bold, `communication` muted label underneath.
- Message stream using the real `ChatBubble` component so styling stays production-accurate.
- Composer at bottom: pill input reading `chat with kai…` with a circular gradient send button (decorative).
- Under the phone, centered: category label `texting anxiety` + a 5-segment progress bar (first segment lit in coral, rest dim) — purely decorative, hints at "category 1 of 5".

## Scripted conversation

Replace the Thanksgiving multi-phase tour with a single, short, looping "texting anxiety" scene that matches the reference beats:

1. user: `kai, he hasn't texted me all day.`
2. kai: `that feels rough. what's the first thought that hit you?`
3. typing dots (kai)
4. user: `that he's losing interest.`
5. kai: `okay. is that a familiar thought, or new with him?`
6. hold ~2s, fade, loop.

- Lowercase throughout, no em dashes, tight cadence (~800ms typing per bubble, ~1.6s read hold).
- Reuse existing `ChatBubble` for exact production fidelity (avatars, bubble colors).
- Auto-loops in place — no more 5-phase iframe tour, no more `/showcase/demo` iframe.

## Files

- `src/pages/Showcase.tsx` — new two-column layout, updated copy, single CTA.
- `src/components/showcase/KaiScreenRecording.tsx` — rewrite as an in-page glass phone (no iframe) that renders header, scripted messages via `ChatBubble`, composer, and the `texting anxiety` progress caption.
- `src/data/showcaseThanksgiving.ts` → rename intent by adding a new `src/data/showcaseTextingAnxiety.ts` with the 5-turn script; leave the old file untouched for now (safe to remove later if unused).
- `src/pages/ShowcaseDemo.tsx` and its route: no longer used by the new mockup. Keep the file and route in place this pass to avoid unrelated churn; we can prune in a follow-up.

## Technical notes

- All colors via existing brand tokens / rose+coral+gold gradients already used in the app. No hardcoded hex.
- Glow: layered `radial-gradient` behind the phone container plus `blur-3xl` opacity ~0.5.
- Progress bar: 5 × `h-1 w-10 rounded-full`, first uses coral gradient, rest `bg-white/15`.
- Accessibility: real headings, decorative chrome marked `aria-hidden`, chat messages remain readable text.
- Keep `noindex` meta and route unchanged.
