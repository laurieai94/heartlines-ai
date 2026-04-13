

## Expand the README "architecture highlights" section

The current section (lines 69–75) has the right bullets but they're one-liners. The user wants them fleshed out to match the depth of the core capabilities section, with real technical detail from the codebase.

### Updated text for lines 69–75

```markdown
## architecture highlights

- **server-side ai execution** all llm interactions run through secure edge functions. no client-side exposure of api keys or prompts.
- **row-level security** strict per-user data isolation enforced at the database layer. prevents cross-user data access by design.
- **role-based access control** admin roles isolated in dedicated tables with security definer functions to prevent privilege escalation.
- **safety and monitoring** real-time crisis detection with severity-based logging and guardrails for unsafe outputs.
- **performance and cost efficiency** prompt caching with token-level metrics and usage analytics for optimization.
```

becomes:

```markdown
## architecture highlights

- **server-side ai execution** — all llm interactions execute through supabase edge functions running on deno. the client never touches api keys, system prompts, or raw model responses. prompt construction, context injection, and response post-processing all happen server-side before anything reaches the browser.

- **row-level security** — every user-facing table enforces row-level security at the postgres layer. policies bind rows to `auth.uid()` so one user's conversations, profiles, and usage data are invisible to another — not by application logic, but by database constraint. no shared queries, no leaked context.

- **role-based access control** — admin roles live in a dedicated `user_roles` table with an `app_role` enum, never on the profile or users table. a `security definer` function (`has_role`) checks permissions without triggering recursive rls evaluation. authenticated users are explicitly blocked from self-assigning roles.

- **safety and monitoring** — the system prompt includes hard-coded crisis detection patterns (suicidal ideation, self-harm, psychotic symptoms, active substance abuse). when triggered, kai stops coaching immediately and surfaces crisis resources (988 lifeline, crisis text line, rainn). crisis events are logged to a dedicated `crisis_logs` table with severity typing, and critical alerts route through a debounced email notification system with 5-minute cooldowns.

- **performance and cost efficiency** — the system prompt is split into a static component (~6,000–8,000 tokens) and dynamic user context (~500–1,000 tokens). the static prompt is cached using anthropic's `cache_control: ephemeral` header, achieving ~85% cost reduction on subsequent messages within a 5-minute ttl window. every request logs input tokens, output tokens, cache creation tokens, cache read tokens, and estimated cost to `user_token_usage` for per-user and aggregate cost analytics.
```

### What changed

Each bullet now includes the actual mechanism from the codebase — edge function runtime (deno), `auth.uid()` binding in RLS, the `has_role` security definer pattern, the crisis detection flow with `crisis_logs` table and debounced alerts, and the static/dynamic prompt split with specific token counts and cache metrics. Matches the precision level of the core capabilities section.

### File to edit

`README.md` — replace lines 69–75.

