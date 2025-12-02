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

    // Call Anthropic to generate summary
    const { data, error } = await supabase.functions.invoke('anthropic-chat', {
      body: {
        messages: [
          {
            role: 'user',
            content: `Summarize this relationship coaching conversation in 50-100 words. Focus on the main issue discussed, any patterns identified, and the outcome or decision made. Be concise and specific.

Conversation:
${conversationText}

Return only the summary text, no additional formatting.`
          }
        ],
        systemPrompt: 'You are a conversation summarizer. Create brief, focused summaries.',
      },
    });

    if (error) throw error;

    const summaryText = data?.response || '';

    // Extract key topics (simple keyword extraction)
    const topics: string[] = [];
    const topicKeywords = [
      'communication', 'intimacy', 'trust', 'boundaries', 'conflict', 
      'family', 'jealousy', 'commitment', 'sex', 'money', 'parenting',
      'identity', 'trauma', 'infidelity', 'depression', 'anxiety'
    ];
    
    topicKeywords.forEach(keyword => {
      if (conversationText.toLowerCase().includes(keyword)) {
        topics.push(keyword);
      }
    });

    // Upsert conversation summary
    await supabase
      .from('conversation_summaries')
      .upsert({
        user_id: userId,
        summary_text: summaryText,
        key_topics: topics.slice(0, 5), // Limit to 5 topics
        conversation_count: 1,
      });

  } catch (error) {
    console.error('Failed to generate summary:', error);
  }
};
