# 💕 Heartlines AI

**An AI-powered relationship coach that helps couples communicate better, resolve conflicts, and deepen their connection.**

🔗 **Live App:** [heartlines-ai.lovable.app](https://heartlines-ai.lovable.app)

---

## ✨ Features

- **AI Relationship Coach (Kai)** — Conversational AI trained in relationship psychology, offering personalized guidance through voice or text
- **Voice-to-Text & Text-to-Speech** — Talk naturally with Kai using real-time voice transcription and spoken responses
- **Relationship Pattern Detection** — Identifies recurring communication patterns and provides actionable insights
- **Partner Profiles** — Build detailed profiles for context-aware coaching tailored to your unique relationship
- **Conversation Memory** — Kai remembers past conversations, topics, and progress over time
- **Smart Reminders** — Personalized check-ins and relationship exercises delivered on your schedule
- **Usage Analytics Dashboard** — Track engagement, token usage, and cost metrics (admin)
- **Subscription Management** — Tiered plans (Glow, Vibe, Unlimited) with Stripe integration

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5, Vite 5 |
| **Styling** | Tailwind CSS 3, Radix UI (shadcn/ui), CSS custom properties |
| **State Management** | TanStack React Query, React Context |
| **Backend** | Supabase Edge Functions (Deno) |
| **Database** | PostgreSQL via Supabase (RLS-secured) |
| **Auth** | Supabase Auth (email/password, magic link) |
| **AI** | Anthropic Claude API (server-side only) |
| **Payments** | Stripe (subscriptions + webhooks) |
| **Hosting** | Lovable Cloud |

## 🏗 Architecture Highlights

- **Server-side AI processing** — All LLM calls run through Supabase Edge Functions; no API keys are exposed client-side
- **Row-Level Security (RLS)** — Every database table is secured with RLS policies; users can only access their own data
- **Role-based access control** — Admin roles stored in a dedicated `user_roles` table with `SECURITY DEFINER` functions to prevent privilege escalation
- **Prompt caching** — Token-level cache metrics tracked for cost optimization
- **Crisis detection** — Real-time monitoring for user safety with severity-based logging
- **Modular component architecture** — 60+ components organized by feature domain

## 📁 Project Structure

```
src/
├── components/       # UI components organized by feature
├── hooks/            # Custom React hooks (auth, chat, profiles, usage)
├── integrations/     # Supabase client & auto-generated types
├── pages/            # Route-level page components
├── contexts/         # React context providers
└── utils/            # Shared utilities and helpers

supabase/
├── functions/        # Edge Functions (AI chat, voice, payments, etc.)
└── migrations/       # Database schema migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project (for backend services)

### Setup

```sh
# Clone the repository
git clone https://github.com/laurieai94/heartlines-ai.git

# Navigate to the project directory
cd heartlines-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your Supabase project URL and anon key

# Start the development server
npm run dev
```

## 🔐 Environment Variables

See [`.env.example`](.env.example) for required variables. All keys used client-side are **publishable/anon keys only** — private keys are stored as Supabase Edge Function secrets and never appear in the codebase.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
