# heartlines ai

**An AI relationship coach for messy, modern love.**

![Status](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

**For engineers:** heartlines combines profile-based context injection, structured conversation flows, and server-side AI orchestration to turn open-ended chat into deterministic, real-world actions.

**Live app** · [heartlines.ai](https://heartlines.ai)

---

## Why I Built heartlines

I kept seeing the same moment happen, to me and to people around me.

You're staring at a text, rewriting it over and over, trying to figure out if you're overreacting or if something actually feels off. It's happening in real time, and most support just isn't there when you need it.

You either spiral on your own or wait for clarity that comes too late.

At the same time, I've seen how quickly AI becomes careless when it touches something this personal.

heartlines is my answer to that.

It's built for the messy middle, the texts, the silence, the moments that feel small but aren't. To help you slow down, make sense of what you're feeling, and find words you can actually use.

So you can show up in a way you feel good about later.

Stronger relationships build stronger communities.

## Core Capabilities

The system moves from "what just happened?" to "what do I say?" to "what do I do next?"

- **Context injection** Starts with your patterns, attachment style, relationship history, and partner profiles. Kai uses this to ask sharper questions without you having to re-explain.

- **Conversation flow** Structured phases: understand, reflect, steer, execute.

- **Script co-creation** Draft the text, shape the conversation, pressure-test tone and boundaries. Not just advice, something you can actually say.

- **Scenario-based entry points** Kai starts with the moment you're in. The same fight again, the silence, the spiral, the message that feels off.

- **Topic-specific playbooks** Guided by structured domains: conflict and repair, intimacy, trust, family, identity, and transitions.

- **Response design** Concise and usable. Built for texts, calls, or in-person. You leave with something to use, not more to process.

- **Private by architecture** Encrypted at rest. No selling or training on emotional data. Server-side execution only.

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

- **Server-side AI execution** All LLM interactions run through secure edge functions. No client-side exposure of API keys or prompts.
- **Row-level security** Strict per-user data isolation enforced at the database layer. Prevents cross-user data access by design.
- **Role-based access control** Admin roles isolated in dedicated tables with security definer functions to prevent privilege escalation.
- **Safety and monitoring** Real-time crisis detection with severity-based logging and guardrails for unsafe outputs.
- **Performance and cost efficiency** Prompt caching with token-level metrics and usage analytics for optimization.

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

MIT. See [LICENSE](LICENSE) for details.
