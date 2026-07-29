## Goal
Replace the scripted `KaiScreenRecording` in `/showcase` with the **actual app interface** running inside the phone frame — driven by mock data so it works offline without auth.

## Approach
Build a dedicated demo route `/showcase/demo` that mounts the real production components (People grid → Chat) with a mock data provider, then embed that route as an `<iframe>` inside the phone frame on `/showcase`.

This gives pixel-identical fidelity to the live product (same components, styles, animations) without needing auth or a seeded backend.

## Steps

1. **Mock data layer** — `src/data/showcaseMockData.ts`
   - 3 partners: Priya, Sam, Marcus (with avatars, relationship types)
   - Scripted Thanksgiving conversation with Marcus (user + Kai turns)
   - Timing script for autoplay

2. **Demo route** — `src/pages/ShowcaseDemo.tsx` + register in `src/App.tsx`
   - Renders the real `PeopleGrid` / partner cards component with mock partners
   - After ~3s, programmatically "navigates" to the real `ChatInterface` component pre-loaded with Marcus
   - Feeds scripted messages into the chat UI with realistic typing delays (no backend calls — intercept `useConversationalKai` via a mock provider prop or wrapper)
   - Loops back to the people grid after the conversation ends
   - No nav, no auth guard, no analytics — clean chrome-free surface sized for the phone frame (390×844)

3. **Iframe embed** — update `src/components/showcase/KaiScreenRecording.tsx`
   - Replace scripted internals with `<iframe src="/showcase/demo" />` sized to the phone frame
   - Keep the phone frame chrome (bezel, notch, glow)
   - `loading="eager"`, `sandbox` scoped for safety, `title` for a11y
   - Pause-on-hover: reload iframe or postMessage a pause signal

4. **Route hygiene**
   - `/showcase/demo` gets `noindex, nofollow` via helmet
   - Skip auth redirects for this route in any auth guard
   - Not linked from main nav

## Technical Notes
- The real chat component (`ChatInterface` or equivalent) needs to accept an optional `messagesOverride` + `disableBackend` prop, or we wrap it in a `MockKaiProvider` that short-circuits `useConversationalKai` to yield scripted replies with typing delays.
- Iframe approach isolates the demo's routing/state from the parent `/showcase` page, so autoplay loops and re-renders don't leak.
- Fixed viewport inside iframe (e.g., 390×844) matches the phone frame exactly — no responsive reflow surprises.

## Out of Scope
- No changes to the actual production People/Chat components beyond adding an optional mock-mode prop.
- No new backend, no seeded accounts, no real Kai calls.
