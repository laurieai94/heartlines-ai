

## Rewrite the README "core capabilities" section

The current section is good but can be tightened with more technical precision based on what the codebase actually does. Here's the proposed replacement for the core capabilities section in `README.md`:

### Updated text

```markdown
## core capabilities

the system moves from "what just happened?" to "what do i say?" to "what do i do next?"

- **context injection** — profiles capture attachment style, love language, conflict patterns, family background, and partner data. kai uses this as a pre-loaded knowledge base so users never re-explain themselves. context is injected server-side into every prompt via structured person-context objects.

- **conversation flow** — four structured phases per session: understand (3–4 discovery questions to map context, pattern, and stakes), reflect (1–2 sentence mirror naming the core tension), steer (options, logistics, channel/timing), execute (co-created scripts with iteration and contingency). phase transitions are governed by internal checkpoints, not vibes.

- **script co-creation** — kai drafts the actual text, conversation opener, or boundary statement. users choose tone, channel, and length. every script includes a reality check ("will they actually honor this?") and a contingency ("if they shut down, try this").

- **scenario playbooks** — 13 structured playbooks run silently as a compass: conflict loops, intimacy mismatch, trust spirals, betrayal, third-party hostility, ambiguous proposals, boundaries, attachment spirals, safety risk, mental load, money conflict, breakup ambivalence, and trust-pattern combos. kai detects the scenario from user input and routes discovery accordingly.

- **response design** — hard-capped at 60 words with sentence-aware truncation. built for texts, calls, or in-person. every response ends with a single question or actionable next step — never two questions, never a wall of text.

- **private by architecture** — all llm interactions execute server-side through supabase edge functions. row-level security enforces per-user data isolation at the database layer. no client-side api key exposure. no training on user data. role-based access uses security definer functions in a dedicated table to prevent privilege escalation.
```

### What changed and why

1. **Context injection** — added specifics (love language, family background, person-context objects) and noted server-side injection, which is accurate per `promptTemplate.ts` and `relationshipMapper.ts`.

2. **Conversation flow** — replaced generic "understand, reflect, steer, execute" with the actual phase definitions and rules from the prompt template (3–4 questions, checkpoint logic, 1–2 sentence mirror, etc.).

3. **Script co-creation** — added reality-check and contingency details, which are mandatory per the Phase 4 rules in the prompt.

4. **Scenario playbooks** — replaced the vague 6-domain list with the actual 13 playbooks (A through M) from the codebase. More accurate and more impressive.

5. **Response design** — added the 60-word hard cap and sentence-aware truncation from `enforceResponseBrevity()` in `aiResponseCoordinator.ts`. This is a real technical detail that differentiates the system.

6. **Private by architecture** — expanded with specific mechanisms: edge functions, RLS, no client-side keys, security definer functions, dedicated roles table. All verified in migrations.

7. **Removed "topic-specific playbooks"** as a separate bullet — merged into scenario playbooks since that's what actually exists. The "6 domains" were aspirational; the 13 playbooks are real.

### File to edit

`README.md` — replace the existing core capabilities section (roughly lines 42–60) with the updated text above.

