## Goal

Replace the current Thanksgiving demo inside the `/showcase` phone frame with an auto-playing product tour that walks through the four real screens from the screenshots, using production components wherever they can render standalone.

## Flow (loops end to end, ~55s)

1. **Landing hero** (~7s): full-bleed year image (`2063 what's it all for`) with the top nav lockup. Auto-tap `get started`.
2. **Situationship setup** (~10s): neon "let's get to know your situationship" heading, `unlock coaching with kai` pill, your-profile + partner-profiles cards. Auto-tap `cam`'s edit or the `partner profiles` card.
3. **Sam's profile form** (~14s): profile modal at 100%, tabs, name field pre-typed as `sam`, pronoun chip `she/her` highlighted. Auto-tap `next` a couple times then close.
4. **Kai chat empty state** (~4s): kai header, `what's on your mind?`, six topic buttons. Auto-tap `Hard-to-Say Feelings`.
5. **Scripted convo** (~20s): reuse the existing Thanksgiving script rendered with real `ChatBubble` and kai avatar.

Then reload the iframe to loop.

## Implementation

### `src/pages/ShowcaseDemo.tsx` (rewrite)

Turn the file into a phase state machine: `hero → situationship → profile-form → chat-empty → chat-convo`. Each phase is a self-contained view that fills the 9:19.5 frame. Advance on timers; add subtle simulated taps (scale + ring flash) at each transition.

Reuse presentational components directly, driven by props/mock data (no auth, no supabase, no network):

- **Hero phase:** import `YearCarousel` from `@/components/landing/YearCarousel` if it can render standalone with a fixed year; otherwise render a static `<img>` of the 2063 frame with `heartlines` wordmark (`FlipPhoneIcon` + `font-brand`), `get started` pill, and a small user icon. Match the burgundy top-nav strip in the screenshot.
- **Situationship phase:** rebuild with `ProfileCard` from `@/components/profile-builder/ProfileCard` for the your-profile card if it accepts plain props; otherwise use lightweight local cards that mirror the exact styling (heart-avatar chip, progress bar, gradient CTA `keep it real`, partner card with `cam` + edit pencil, `upgrade for more` footer). Use the exact copy from the screenshot.
- **Profile-form phase:** import `NewPartnerProfileModal` from `@/components/new-partner-profile` only if it can mount without side effects. If it pulls context (auth/supabase), fall back to a scripted static replica: header `sam's profile · 100%`, four tab chips (`the basics`, `your situationship`, `how you operate`, `your foundation` all checked), name input with `sam`, pronoun chips with `she/her` active, `optional +better insights` accordion, footer nav (`previous`, dots, `your person`, `unlock coaching`, `next`).
- **Chat-empty phase:** reuse `ConversationStarters` from `@/components/chat/ConversationStarters` if props-driven; use `ChatHeader` in mobile variant with kai info. Otherwise mirror the empty-state layout with the six category buttons.
- **Chat-convo phase:** keep the current `ChatBubble` + kai avatar rendering using `THANKSGIVING_CONVO`.

Explore each candidate production component first. If it depends on router/context/supabase, replace with a screenshot-accurate scripted replica in the same file and note the reason inline. Do not add mock providers.

### `src/components/showcase/KaiScreenRecording.tsx`

Bump the reload interval from 42s to ~60s to fit the full tour. No other structural changes; the iframe already renders `/showcase/demo`.

### Data

Extend `src/data/showcaseThanksgiving.ts` (or add a sibling `showcaseTour.ts`) with:
- The four phase timing constants.
- Mock partner list already present.
- Kai's opening reply after the user "taps" `Hard-to-Say Feelings` bridges into the existing convo.

## Constraints

- Everything renders inside the phone frame (390x844 area, 9:19.5 aspect). No horizontal scroll.
- No em dashes in any new copy; match the app's lowercase voice.
- No network, no auth, no supabase, no writes to localStorage.
- Loop cleanly; pause when the user hovers the phone (already implemented in `KaiScreenRecording`).
- No changes to `/showcase` layout, copy, or nav.

## Out of scope

- Real product data or live gateway calls.
- Voice/rehearsal/weekly-reflection surfaces.
- Any new routes beyond the existing `/showcase/demo`.
