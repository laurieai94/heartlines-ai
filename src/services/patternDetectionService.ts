import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const detectPatterns = async (
  conversationId: string,
  messages: ChatMessage[],
  userId: string
): Promise<void> => {
  try {
    // Only detect patterns for conversations with 5+ messages
    if (messages.length < 5) {
      return;
    }

    const { error } = await supabase.functions.invoke('detect-patterns', {
      body: {
        conversationId,
        messages,
        userId,
      },
    });

    if (error) {
      console.error('Error detecting patterns:', error);
    }
  } catch (error) {
    console.error('Failed to detect patterns:', error);
  }
};

export const generateConversationSummary = async (
  conversationId: string,
  messages: ChatMessage[],
  userId: string
): Promise<void> => {
  try {
    // Only generate summaries for conversations with 5+ messages
    if (messages.length < 5) {
      return;
    }

    // Build conversation text
    const conversationText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Call Anthropic to generate summary WITH specific topic tags
    const { data, error } = await supabase.functions.invoke('anthropic-chat', {
      body: {
        userMessage: `Analyze this relationship coaching conversation and return a JSON object with:
1. "summary": 50-100 word summary focusing on the main issue, any patterns, and outcome
2. "topics": 2-4 SPECIFIC topic tags (not generic)

Topic tags should be SPECIFIC situations, not generic categories:
- Use "affair-discovery" not just "trust"
- Use "partner-shutdown-pattern" not just "conflict"  
- Use "family-dinner-incident" not just "family"
- Use "jealousy-about-ex" not just "jealousy"
- Use "intimacy-after-baby" not just "intimacy"
- Use "lying-about-finances" not just "money"

Conversation:
${conversationText}

Return ONLY valid JSON: {"summary": "...", "topics": ["specific-tag-1", "specific-tag-2"]}`,
        systemPrompt: 'You are a conversation analyzer. Return ONLY valid JSON, no other text.',
        conversationHistory: [],
      },
    });

    if (error) throw error;

    let summaryText = '';
    let topics: string[] = [];
    
    try {
      // Try to parse JSON response
      const responseText = data?.response || '{}';
      const parsed = JSON.parse(responseText);
      summaryText = parsed.summary || '';
      topics = parsed.topics || [];
    } catch {
      // Fallback: use response as plain text summary
      summaryText = data?.response || '';
      
      // Fallback topic extraction with more specific patterns
      const specificPatterns = [
        { pattern: /\b(affair|cheating|cheated|unfaithful)\b/i, tag: 'infidelity-discovered' },
        { pattern: /\b(shut down|shutdown|stonewalling|silent treatment)\b/i, tag: 'partner-shutdown' },
        { pattern: /\b(lying|lied|lie|dishonest)\b/i, tag: 'trust-broken-lying' },
        { pattern: /\b(jealous|jealousy|insecure about)\b/i, tag: 'jealousy-issue' },
        { pattern: /\b(family dinner|in-laws|parents visited)\b/i, tag: 'family-conflict' },
        { pattern: /\b(sex|intimacy|physical)\b/i, tag: 'intimacy-concerns' },
        { pattern: /\b(fight|argument|blowup)\b/i, tag: 'conflict-escalation' },
        { pattern: /\b(anxiety|anxious|worried|spiraling)\b/i, tag: 'anxiety-spiral' },
        { pattern: /\b(boundary|boundaries)\b/i, tag: 'boundary-setting' },
        { pattern: /\b(commitment|future|where this is going)\b/i, tag: 'commitment-clarity' },
      ];
      
      specificPatterns.forEach(({ pattern, tag }) => {
        if (pattern.test(conversationText) && !topics.includes(tag)) {
          topics.push(tag);
        }
      });
    }

    // Upsert conversation summary with specific topics
    await supabase
      .from('conversation_summaries')
      .upsert({
        user_id: userId,
        summary_text: summaryText,
        key_topics: topics.slice(0, 4), // Limit to 4 specific topics
        conversation_count: 1,
      });

  } catch (error) {
    console.error('Failed to generate summary:', error);
  }
};
