# Heartlines AI

**An AI relationship coach for messy, modern love — helping you make sense of your feelings so you can show up as someone you're proud of, no matter what you're in.**

![Status](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

The text you rewrite ten times before hitting send.
The version of "we're good" that doesn't feel true.
The screenshot you take just to ask, "am I crazy?"

Most tools help you find relationships or process them later.
Heartlines exists in the moment where you actually need help.

**For engineers:** Heartlines combines profile-based context injection, structured conversation flows, and server-side AI orchestration to turn open-ended chat into deterministic, real-world actions.

**Live app** — [heartlines.ai](https://heartlines.ai)

---

![Heartlines AI](./docs/demo.png)

---

## Product Philosophy

Heartlines is built on a simple belief: stronger relationships build stronger communities.

Most people don't need more advice. They need help in the moment everything feels loud. Heartlines is built for that moment — to help you slow down, make sense of what you're feeling, and choose how you show up.

## Why I Built This

I built Heartlines because I kept seeing the same moment happen — to me and to people around me. You're staring at a text, rewriting it over and over, trying to figure out if you're overreacting or if something actually feels off. Most support doesn't exist in that moment.

I've spent my career in AI and data, and I've seen how quickly these systems become careless when applied to something this personal. Heartlines is my answer to that — built to help you make sense of what you're feeling and show up in a way you feel good about later.

## Core Capabilities

### Context Injection

Heartlines starts with context, not a blank chat. Your patterns, attachment style, history, the relationship you're in, and partner profiles for the specific people you're navigating. Kai uses this quietly in the background — never quoting your profile back, just asking sharper questions and offering guidance that fits your actual dynamic. Less explaining, more progressing.

### Conversation Flow

Structured around how real relationship moments unfold: understand what's happening, reflect back patterns and context, steer toward clarity, execute with language you can actually use. From "what just happened?" to "what do I say?" to "what do I do next?"

### Script Co-Creation

Heartlines doesn't just give advice — it helps you say the thing. Draft the text you're about to send. Shape what you'll say in a real conversation. Pressure-test tone, clarity, and boundaries. Not just something to think about — something you can actually say.

### Scenario-Based Entry Points

Kai doesn't start with a blank box. It starts with the moment you're in — the same fight again, the silence that doesn't feel real, the spiral you can't get out of, the message that feels off but you can't prove why. It meets you in the moment, not after the fact.

### Topic-Specific Playbooks

Under the surface, Kai is guided by structured relationship domains: conflict and repair, intimacy and communication, trust and betrayal, family, identity, and transitions. Each domain reflects real patterns in how relationships unfold — not abstract advice.

### Response Design

Concise, usable responses — not long essays. Built for texts, calls, or in-person conversations. Focused on clarity, not overwhelm. You don't leave with more to process — you leave with something you can actually use.

### Private by Architecture

This only works if people feel safe being fully honest. Conversations encrypted at rest. Minimal internal access by design. No selling or training on emotional data. Server-side AI execution only. No ghost audience — just you, Kai, and encryption.

## System Design

Heartlines isn't just AI chat. It's a structured coaching system built for how relationship moments actually unfold.

- Scenario-based entry points aligned to real-world moments
- Guided conversation phases: understand, reflect, steer, execute
- Script co-creation for real-world communication
- Profile-based context injection across sessions
- Domain-specific playbooks ensuring consistency and depth

This system moves from "what just happened?" to "what do I say?" to "what do I do next?"

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS 3, Radix UI (shadcn/ui) |
| State | TanStack React Query, React Context |
| Backend | Supabase Edge Functions (Deno) |
| Database | PostgreSQL via Supabase (RLS-secured) |
| Auth | Supabase Auth (email/password, magic link) |
| AI | Anthropic Claude (server-side only) |
| Payments | Stripe (subscriptions + webhooks) |
| Hosting | Lovable Cloud |

## Architecture Highlights

- **Server-side AI execution** — All LLM interactions run through secure edge functions. No client-side exposure of API keys or prompts.
- **Row-level security** — Strict per-user data isolation enforced at the database layer. Prevents cross-user data access by design.
- **Role-based access control** — Admin roles isolated in dedicated tables with security definer functions to prevent privilege escalation.
- **Safety and monitoring** — Real-time crisis detection with severity-based logging and guardrails for unsafe outputs.
- **Performance and cost efficiency** — Prompt caching with token-level metrics and usage analytics for optimization.

## Project Structure

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

## Getting Started

```sh
git clone https://github.com/laurieai94/heartlines-ai.git
cd heartlines-ai
npm install
cp .env.example .env
npm run dev
```

## Environment and Security

Client-side keys are limited to publishable/anon access. All sensitive operations are handled server-side through Supabase Edge Functions. Secrets are stored as edge function environment variables and never appear in the codebase. Identity data and relational data are strictly separated. See [`.env.example`](.env.example) for required variables.

## License

MIT — see [LICENSE](LICENSE) for details.
