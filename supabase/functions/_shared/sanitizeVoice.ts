/**
 * Shared voice sanitizer for Kai responses.
 *
 * Layer 3 safety net: the prompt bans em dashes and AI-sounding constructions,
 * this strips anything that slips through before it reaches the user.
 */

const AI_PHRASES: string[] = [
  "it's not just",
  "it is not just",
  "not just about",
  "i'm here for you",
  "you're not alone in this",
  "you are not alone in this",
  "it's completely valid",
  "it is completely valid",
  "take all the time you need",
  "let's unpack",
  "let's dive into",
  "that's a great question",
  "happy to help",
  "it sounds like",
  "it seems like",
  "delve",
  "tapestry",
  "testament to",
  "at the end of the day",
  "navigating the complexities",
];

/**
 * Remove em dashes, en dashes and double hyphens.
 * A dash that joins two independent clauses becomes a period, everything else
 * becomes a comma.
 */
export function stripDashes(text: string): string {
  let out = text;

  // Words that almost always start a new independent clause after a dash.
  const clauseStarters =
    "(?:i|you|we|they|he|she|it|that|this|there|but|so|and|then|now|which|what|who|when|where|why|how|let|just|either|maybe|honestly|yeah|no|not|if)";

  // Long left-hand clause + clause starter => sentence break.
  out = out.replace(
    new RegExp(`(\\w[^.!?\\n]{25,}?)\\s*(?:[\u2014\u2013]|--)\\s*(${clauseStarters}\\b)`, "gi"),
    (_m, left: string, right: string) => `${left}. ${right}`,
  );

  // Everything else becomes a comma.
  out = out.replace(/\s*(?:[\u2014\u2013]|--)\s*/g, ", ");

  // Clean up punctuation collisions the replacement can create.
  out = out.replace(/\s+([,.!?;:])/g, "$1");
  out = out.replace(/([,.!?;:])\s*,\s*/g, "$1 ");
  out = out.replace(/,\s*,+/g, ",");
  out = out.replace(/[ \t]{2,}/g, " ");
  out = out.replace(/(^|\n)\s*,\s*/g, "$1");

  return out.trim();
}

/** Return any banned AI constructions present in the text. */
export function findAiPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return AI_PHRASES.filter((phrase) => lower.includes(phrase));
}

/**
 * Full pass: strip dashes and log (do not rewrite) AI-sounding phrasing so we
 * can tell whether the prompt rule is holding.
 */
export function sanitizeVoice(text: string): string {
  const cleaned = stripDashes(text);

  const hits = findAiPhrases(cleaned);
  if (hits.length > 0) {
    console.warn(`[VOICE] AI phrasing detected in response: ${hits.join(", ")}`);
  }

  return cleaned;
}
