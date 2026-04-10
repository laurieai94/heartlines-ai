

## Fix em-dashes and condense Core Capabilities

### Changes to `README.md`

**1. Remove all em-dashes (`—`)**

Replace every `—` with either a period, comma, or line break depending on context. Roughly 20 instances throughout the file.

**2. Condense Core Capabilities into a single section**

Instead of 7 separate `###` subsections each with a full paragraph, collapse them into a compact list format. Each capability gets a bold title and one sentence. Example:

```
## Core Capabilities

- **Context injection** Starts with your patterns, attachment style, relationship history, and partner profiles. Kai uses this in the background to ask sharper questions without you having to re-explain.

- **Conversation flow** Structured phases: understand what's happening, reflect back patterns, steer toward clarity, execute with language you can actually use.

- **Script co-creation** Draft the text, shape the conversation, pressure-test tone and boundaries. Not just advice, something you can actually say.

- **Scenario-based entry points** Kai starts with the moment you're in. The same fight again, the silence, the spiral, the message that feels off.

- **Topic-specific playbooks** Guided by structured domains: conflict and repair, intimacy, trust, family, identity, and transitions.

- **Response design** Concise and usable. Built for texts, calls, or in-person. You leave with something to use, not more to process.

- **Private by architecture** Encrypted at rest. No selling or training on emotional data. Server-side execution only.
```

This cuts the section from ~28 lines to ~14 lines while keeping all the substance.

**3. Clean up em-dashes in other sections too**

Architecture highlights, product philosophy, "Why I Built This", and system design all have em-dashes that will be replaced with cleaner punctuation.

### Files changed
- `README.md` only

