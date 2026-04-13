<h1><img src="docs/flip-phone.svg" alt="flip phone icon" width="42" height="42" style="vertical-align: middle;" /> heartlines </h1>

**an ai relationship coach for messy, modern love.**

![Status](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

**for engineers:** heartlines combines profile-based context injection, structured conversation flows, and server-side ai orchestration to turn open-ended chat into deterministic, real-world actions.

**live app** · [heartlines.ai](https://heartlines.ai)

## product

<p align="center">
  <img src="docs/kai-chat-screenshot.png" alt="kai — ai relationship coach" width="600" />
</p>

---

## why i built heartlines

i kept seeing the same moment happen, to me and to people around me.

you're staring at a text, rewriting it over and over, trying to figure out if you're overreacting or if something actually feels off. it's happening in real time, and most support just isn't there when you need it.

you either spiral on your own or wait for clarity that comes too late.

at the same time, i've seen how quickly ai becomes careless when it touches something this personal.

heartlines is my answer to that.

it's built for the messy middle, the texts, the silence, the moments that feel small but aren't. to help you slow down, make sense of what you're feeling, and find words you can actually use.

so you can show up in a way you feel good about later.

stronger relationships build stronger communities.

## core capabilities

the system moves from "what just happened?" to "what do i say?" to "what do i do next?"

- **context injection** — profiles capture attachment style, love language, conflict patterns, family background, and partner data. kai uses this as a pre-loaded knowledge base so users never re-explain themselves. context is injected server-side into every prompt via structured person-context objects.

- **conversation flow** — four structured phases per session: understand (3–4 discovery questions to map context, pattern, and stakes), reflect (1–2 sentence mirror naming the core tension), steer (options, logistics, channel/timing), execute (co-created scripts with iteration and contingency). phase transitions are governed by internal checkpoints, not vibes.

- **script co-creation** — kai drafts the actual text, conversation opener, or boundary statement. users choose tone, channel, and length. every script includes a reality check ("will they actually honor this?") and a contingency ("if they shut down, try this").

- **scenario playbooks** — 13 structured playbooks run silently as a compass: conflict loops, intimacy mismatch, trust spirals, betrayal, third-party hostility, ambiguous proposals, boundaries, attachment spirals, safety risk, mental load, money conflict, breakup ambivalence, and trust-pattern combos. kai detects the scenario from user input and routes discovery accordingly.

- **response design** — hard-capped at 60 words with sentence-aware truncation. built for texts, calls, or in-person. every response ends with a single question or actionable next step — never two questions, never a wall of text.

- **private by architecture** — all llm interactions execute server-side through supabase edge functions. row-level security enforces per-user data isolation at the database layer. no client-side api key exposure. no training on user data. role-based access uses security definer functions in a dedicated table to prevent privilege escalation.

## tech stack

| layer | technology |
|-------|-----------|
| frontend | React 18, TypeScript 5, Vite 5 |
| styling | Tailwind CSS 3, Radix UI (shadcn/ui) |
| state | TanStack React Query, React Context |
| backend | Supabase Edge Functions (Deno) |
| database | PostgreSQL via Supabase (RLS-secured) |
| auth | Supabase Auth (email/password, magic link) |
| ai | Anthropic Claude (server-side only) |
| payments | Stripe (subscriptions + webhooks) |
| hosting | Lovable Cloud |

## architecture highlights

- **server-side ai execution** all llm interactions run through secure edge functions. no client-side exposure of api keys or prompts.
- **row-level security** strict per-user data isolation enforced at the database layer. prevents cross-user data access by design.
- **role-based access control** admin roles isolated in dedicated tables with security definer functions to prevent privilege escalation.
- **safety and monitoring** real-time crisis detection with severity-based logging and guardrails for unsafe outputs.
- **performance and cost efficiency** prompt caching with token-level metrics and usage analytics for optimization.

## project structure

```
src/
├── components/       UI components organized by feature
├── hooks/            Custom React hooks
├── integrations/     Supabase client and generated types
├── pages/            Route-level page components
├── contexts/         React context providers
└── utils/            Shared utilities

supabase/
├── functions/        Edge Functions (AI chat, voice, payments)
└── migrations/       Database schema migrations
```

## getting started

```sh
git clone https://github.com/laurieai94/heartlines-ai.git
cd heartlines-ai
npm install
cp .env.example .env
npm run dev
```

## environment and security

client-side keys are limited to publishable/anon access. all sensitive operations are handled server-side through Supabase Edge Functions. secrets are stored as edge function environment variables and never appear in the codebase. identity data and relational data are strictly separated. see [`.env.example`](.env.example) for required variables.

## license

MIT. see [LICENSE](LICENSE) for details.
