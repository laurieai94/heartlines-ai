## Change

Replace the current styled chat mockup on `/showcase` with a "GIF-style" scripted screen recording that plays automatically on loop: rapid flip through 3 partner profiles → fast Kai chat about a tough Thanksgiving dinner (user brought new boyfriend, family reacted badly).

## Approach

Build it as a self-contained React component that mimics a screen recording — no actual GIF file, no Remotion render. Faster to iterate, stays crisp at any size, and matches the real product 1:1 because it reuses the same design tokens and layout.

The component runs a scripted timeline (`useCurrentFrame`-style with `setTimeout`) inside the phone frame:

**Act 1 — profile flip-through (~2s)**
- Show a "People" screen with a stack of 3 partner cards (Marcus, Priya, Jordan)
- Card swaps every ~500ms with a quick slide/fade — feels like scrolling fast through profiles
- User "taps" Jordan → card zooms

**Act 2 — transition (~0.4s)**
- Screen wipes/fades to the chat view (Jordan's avatar + name in the header)

**Act 3 — Thanksgiving conversation (~9s)**
- Messages appear rapidly (typing indicator ~600ms, message ~800ms, next after ~700ms)
- Scripted 6-turn convo about the Thanksgiving dinner scenario
- Auto-scrolls as it fills
- Ends holding on the last Kai reply for ~2s
- Loops back to Act 1

**Loop:** total ~12s, restarts cleanly.

## Scripted conversation (Thanksgiving)

1. **user:** thanksgiving was a disaster. brought marcus home and my mom barely looked at him.
2. **kai:** (typing…) that's a specific kind of pain — being unseen while the person you love watches it happen. what part is sitting with you the most right now?
3. **user:** that i didn't say anything. i just let it happen.
4. **kai:** you froze to keep the peace. that's a survival move, not a failure. but marcus was in that room too — what do you think he needed from you?
5. **user:** for me to have his back.
6. **kai:** yeah. so the repair isn't with your mom yet — it's with marcus. one sentence, tonight: "i saw what happened. i should have said something. i'm sorry."

Names/tone match the existing kai voice memory (lowercase, direct, no therapy-speak, partner name used).

## Visual details

- Phone frame stays the same (already looks good).
- Profile cards use existing brand palette — cream card on burgundy, avatar circle, name, "partner · 2y" style meta line, one small emotional-tag chip.
- Fast micro-motion: cards translate 40px + fade in 200ms; taps show a brief scale-down.
- Chat bubbles reuse the current bubble styling.
- A subtle "REC" style dot + timer in the top corner of the phone (optional, adds "screen recording" feel) — or leave off for cleanness. Will include off by default; easy toggle.

## Files touched

- **New:** `src/components/showcase/KaiScreenRecording.tsx` — the whole scripted recording
- **New:** `src/data/showcaseThanksgiving.ts` — profile list + convo script
- **Edit:** `src/pages/Showcase.tsx` — swap `<KaiChatDemo />` for `<KaiScreenRecording />`
- **Delete:** `src/components/showcase/KaiChatDemo.tsx` and `src/data/showcaseConversation.ts` (replaced)

Copy under the phone changes to: "autoplays a scripted flow · hover to pause".

## Out of scope

- No actual `.gif` or `.mp4` file (adds weight, harder to update, worse on retina).
- No changes to real product routes or chat logic.
- No changes to the rest of the showcase page (hero, anatomy, engineering stats, footer stay as-is).
