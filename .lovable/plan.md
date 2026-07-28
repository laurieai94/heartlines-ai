# Heartlines end-to-end workflow test sweep

Goal: have a background agent drive the live preview with Playwright across every public and authenticated workflow, capture screenshots/console/network evidence, then produce a ranked findings report and a P0/P1/P2 fix plan.

## Scope

**Public (unauthenticated):**
- Landing (`/`) — hero carousel, nav bar, CTAs, scroll sections, footer
- `/pricing`, `/mission`, `/contact`, `/privacy-security`, `/terms`, `/brand-guidelines`
- `/signin` and `/signup` — tab switching, validation errors, forgot-password entry, magic-link entry, waitlist form
- 404 route
- Responsive: 390×844 (mobile), 768×1024 (tablet), 1440×900 (desktop) on landing + signin

**Authenticated (single test account, session injected from env):**
- First-run: welcome dialog, personal questionnaire (all sections, next-map navigation, save persistence)
- Partner profile creation, edit, name-lock behavior, delete (when >1)
- Dashboard: nav drawer, sidebar cards, modals, chat opening
- Chat with Kai: send message, receive response, retry on error, history persistence, sidebar history, message-limit surface (mock/observe only — not exhausted)
- Account pages: overview, profile, security, subscription, usage analytics
- Pricing while signed in — current-plan indicator, upgrade CTA routing (stops before Stripe checkout)
- Logout from every nav surface

**Explicitly out of scope:** Stripe checkout, real payments, sending real contact/support emails, admin dashboard (unless the test account happens to have the role — will note and skip).

## How the sweep runs

One `spawn_agent` (capable model) with a system prompt that:
- Uses Playwright via shell per the browser-use rules (headless Chromium, viewport 1280×1800 unless testing mobile, screenshots under `/tmp/browser/heartlines-sweep/`).
- Restores the injected Supabase session for authed flows; if `LOVABLE_BROWSER_AUTH_STATUS` isn't `injected`, reports that and covers public flows only.
- Reads console + network for each flow; flags 4xx/5xx, unhandled promise rejections, hydration warnings, a11y violations (missing alt, low-contrast obvious cases, keyboard traps on modals).
- Never types real payment info; stops at Stripe redirect boundary.
- Produces a structured report: per-flow status (pass / warn / fail), evidence (screenshot paths + console excerpts), and a ranked issue list.

## Deliverables returned to you

1. **Findings report** grouped by surface, each issue with: severity (P0 launch-block / P1 pre-launch / P2 polish), repro steps, evidence, suspected cause (file/line where obvious from prior audits).
2. **Fix plan** — a follow-up `plan--create` with concrete, independently shippable fixes ordered by severity, ready to execute in build mode.

## Risks & caveats

- Authed sweep may consume a small number of AI message credits on the test account (a handful of Kai turns).
- Any created partner profiles / chat history on the test account will remain unless the agent cleans them up; the sweep will note what it created.
- Timing-sensitive flows (auth callback, real-time updates) may need retries; the agent will mark flaky vs. broken.
- Sweep runtime: ~10–20 min end-to-end.

Approve to run the sweep.
