# Heartlines sweep — fix plan

Based on the E2E sweep. Two of the reported P0s are false positives (routes exist under different names) but are worth turning into redirects. Auth-gated coverage was skipped because the sandbox reports `LOVABLE_BROWSER_AUTH_STATUS=external_unmanaged` — see §Follow-up.

## P0 — ship first

**1. Fix `fetchPriority` → `fetchpriority` casing across the app**
- Verified in code. React (pre-19) warns on every image on landing, chat, and auth pages.
- Files: `src/pages/Auth.tsx:381`, `src/components/chat/ChatContainer.tsx:251`, `src/components/chat/ChatHeader.tsx:37,123`, `src/components/chat/AIChatMessage.tsx:126,148`, `src/components/landing/YearCarousel.tsx:153`, `src/components/ui/avatar.tsx`, `src/utils/imageOptimizer.ts` (keep camelCase in the imperative `link.fetchPriority` DOM assignment — only JSX attributes are affected).
- Change: JSX attribute `fetchPriority` → `fetchpriority` (lowercase HTML attr passthrough) or gate on React version. Verify by loading `/` and `/signin` and confirming the warning is gone in console logs.

**2. Add URL aliases for the common wrong paths**
- The sweep 404ed on `/pricing` and `/privacy-security` because the real routes are `/plans` and `/privacy-and-security`. External links, search engines, and muscle memory will hit the shorter forms.
- Add two `<Route>` redirects in `src/App.tsx` alongside the existing `/privacy → /privacy-and-security` and `/dashboard → /profile` redirects:
  - `/pricing → /plans`
  - `/privacy-security → /privacy-and-security`
- Also audit `SiteFooter.tsx`, `SimpleHeader.tsx`, and any landing CTAs to confirm they use the canonical paths.

## P1 — pre-launch polish

**3. Confirm the "landing renders only splash" report is a test-timing artifact, not a real bug**
- The sweep took the screenshot right after `networkidle` + 1s. `FirstVisitSplash.tsx` may hold render longer than that on first paint.
- Action: manually load `/` in the preview at 1440×900 and 390×844 with a cleared `localStorage` (`localStorage.clear()`), watch time-to-content. If content appears within ~2s, close as WAI and add a note to the sweep script to wait for a landing sentinel selector (e.g. hero copy) before screenshotting. If it takes longer, cap the splash duration and/or render `LandingPage` behind an opacity fade so SEO/crawlers get the DOM immediately.

**4. Confirm scroll-reveal sections aren't hiding content from bots/reduced-motion users**
- Sweep's programmatic `scrollTo(bottom)` showed a mostly-empty page. Likely just IntersectionObserver not firing on jump-scroll.
- Action: verify `ScrollReveal.tsx` starts with content in the DOM (opacity: 0 is fine; `display: none` is not) and respects `prefers-reduced-motion`. If content is `display: none` until observed, switch to opacity/translate only.

**5. Verify magic-link + waitlist entry points against current spec**
- Sweep flagged both as missing on `/signin`/`/signup`. Before building anything, confirm with product whether they are in-scope for launch — the Auth page today is email+password + "locked out?" only.
- If in-scope: add a "email me a sign-in link" button on `/signin` that calls `supabase.auth.signInWithOtp`, and surface `WaitlistForm.tsx` on `/signup` behind the existing launch-cap logic.
- If out-of-scope: drop from the spec, no code change.

## P2 — nice to have

**6. Polish the 404 page**
- Keep the branded feel (lowercase copy, warm gold accent). Add a small "back to sign in" or "chat with kai" secondary link so the page isn't a dead end. File: `src/pages/NotFound.tsx`.

**7. Add a lightweight route smoke test**
- One vitest that mounts `<App/>` under `MemoryRouter` for each path in a hardcoded list (`/`, `/plans`, `/pricing`, `/mission`, `/contact`, `/privacy-and-security`, `/privacy-security`, `/terms`, `/brand-guidelines`, `/signin`, `/signup`, `/account`, `/nonsense`) and asserts the result is not `NotFound` for the ones that should resolve. Catches the aliasing regressions above.

## Follow-up — authenticated coverage

Auth flows (onboarding, questionnaires, partner profile CRUD, Kai chat, `/account`, signed-in `/plans`, logout) were not exercised this run. To close the loop, either:
- Sign in through the Lovable preview once so a managed session is minted (`LOVABLE_BROWSER_AUTH_STATUS=injected` on the next turn), then re-run the sweep, OR
- Explicitly accept that authed coverage is out of scope for this pass.

Ready to implement P0 #1 and #2 in one pass, then #6 + #7 if you want them in this cycle. Say the word and I'll ship them.
