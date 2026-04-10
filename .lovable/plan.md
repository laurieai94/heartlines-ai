

## Make Your GitHub Repo Job-Application Ready

### 1. Rewrite README.md
Replace the Lovable boilerplate with a professional project README:
- **Hero section**: Project name, one-line description, link to live site (heartlines-ai.lovable.app)
- **Screenshot/demo**: Add a screenshot of the landing page or dashboard
- **Features list**: AI relationship coach, voice-to-text, real-time insights, Supabase backend
- **Tech stack section**: React 18, TypeScript, Vite, Tailwind CSS, Supabase (Auth, Edge Functions, Database), Radix UI
- **Architecture highlights**: Server-side AI processing via Edge Functions, RLS-secured database, PWA support
- **Getting started**: Keep the setup instructions but with actual repo name

### 2. Fix package.json name
Change `"name": "vite_react_shadcn_ts"` to `"name": "heartlines-ai"`

### 3. Add .env.example, sanitize .env
- Create `.env.example` with placeholder values (no real keys)
- Add `.env` to `.gitignore` (it may already be there — but the file is already committed, so we need to note that the keys are public/anon-only in the README or remove the file from git tracking)

### 4. Add LICENSE file
MIT license with your name, unless you prefer keeping it proprietary (in which case, add a note in the README saying "All rights reserved")

### Risk level
Zero — documentation-only changes, no code logic affected.

