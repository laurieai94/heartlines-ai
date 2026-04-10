

## Remove repetition from README.md

The problem: "Core Capabilities" (lines 38-52) and "System Design" (lines 54-64) repeat the same five concepts (context injection, conversation flow, script co-creation, scenario entry points, playbooks). The tagline, product philosophy, and "Why I Built This" also echo similar phrases about "the moment" and "make sense of what you're feeling."

### Changes

**1. Merge System Design into Core Capabilities**

Delete the System Design section entirely. Its content is already covered in Core Capabilities. Move the one unique line ("what just happened?" to "what do I say?" to "what do I do next?") into the intro sentence for the section.

**2. Tighten Product Philosophy + Why I Built This**

Combine into a single "Why heartlines" section. Cut repeated phrases about "the moment" and "make sense of what you're feeling" down to one occurrence each. Target: ~4 lines total instead of 8.

**3. Trim the hook**

Lines 13-14 ("Most tools help you find relationships...heartlines exists in the moment") repeat the same idea as the tagline and philosophy. Remove those two lines since the hook (lines 9-11) already sets the tone.

### Result

README drops from 120 lines to ~100, with zero repeated ideas. Same substance, tighter read.

### Files changed
- `README.md` only

