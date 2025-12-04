/**
 * Opener Library for Kai's response variety
 * 
 * These openers are rotated to prevent repetitive responses.
 * The system tracks usage per-user and globally to ensure variety.
 */

export interface OpenerCategory {
  name: string;
  openers: string[];
}

export const openerLibrary: Record<string, OpenerCategory> = {
  impact: {
    name: "Impact",
    openers: [
      "that's a lonely place to be mid-fight.",
      "getting left mid-conflict hurts—full stop.",
      "being left hanging like that is brutal.",
      "that disconnect is exhausting.",
      "that silence cuts deep.",
    ],
  },
  normalize: {
    name: "Normalize",
    openers: [
      "a lot of couples get stuck in this loop.",
      "this shutdown pattern is common—and workable.",
      "you're describing a cycle, not a one-off.",
      "this dynamic shows up everywhere.",
      "classic escalate-vanish pattern.",
    ],
  },
  appreciation: {
    name: "Appreciation",
    openers: [
      "thanks for saying it straight.",
      "glad you said it plainly.",
      "okay. we can work with this.",
      "i appreciate you naming that.",
      "that takes guts to say out loud.",
    ],
  },
  grounding: {
    name: "Grounding",
    openers: [
      "okay—let's slow this down.",
      "one beat. we'll keep this simple.",
      "alright. let's get the shape of what happened.",
      "deep breath. we'll take this piece by piece.",
      "let's zoom in on one moment.",
    ],
  },
  direct: {
    name: "Direct",
    openers: [
      "got it. walk me through the moment it flipped.",
      "okay—what happened right before they disappeared?",
      "what was the spark this time?",
      "when did it tip?",
      "what kicked it off?",
    ],
  },
};

// Scenario to category mapping for intelligent selection
export const scenarioCategoryMapping: Record<string, string[]> = {
  conflict: ["impact", "normalize", "direct"],
  shutdown: ["impact", "normalize", "grounding"],
  spiral: ["grounding", "impact", "appreciation"],
  betrayal: ["impact", "appreciation", "grounding"],
  jealousy: ["impact", "normalize", "direct"],
  intimacy: ["appreciation", "normalize", "grounding"],
  family: ["impact", "appreciation", "direct"],
  default: ["direct", "appreciation", "grounding"],
};

// Hard-banned phrases that should never appear
export const bannedPhrases = [
  "oh wow",
  "that's really hard",
  "does that land",
  "you got this",
  "that's a lot",
  "that's heavy",
  "i hear that",
];

// Check if text contains any banned phrases
export const containsBannedPhrase = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return bannedPhrases.some((phrase) => lowerText.includes(phrase));
};

// Get all openers as flat array
export const getAllOpeners = (): string[] => {
  return Object.values(openerLibrary).flatMap((cat) => cat.openers);
};

// Select opener based on category, avoiding recently used
export const selectOpener = (
  category: string,
  recentlyUsed: string[] = []
): string | null => {
  const cat = openerLibrary[category];
  if (!cat) return null;

  const available = cat.openers.filter((o) => !recentlyUsed.includes(o));
  if (available.length === 0) return cat.openers[0]; // fallback to first if all used

  return available[Math.floor(Math.random() * available.length)];
};
