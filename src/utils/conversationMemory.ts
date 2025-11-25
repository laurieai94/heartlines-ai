import { supabase } from "@/integrations/supabase/client";

export interface ConversationSummary {
  id: string;
  user_id: string;
  summary_text: string;
  key_topics: string[];
  last_updated: string;
  conversation_count: number;
}

export class ConversationMemory {
  /**
   * Fetch the user's conversation summary for cross-session memory
   */
  static async fetchConversationSummary(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return ''; // No previous conversations
      }

      // Format summary for inclusion in prompt
      return this.formatSummaryForPrompt(data);
    } catch (error) {
      console.error('Error fetching conversation summary:', error);
      return '';
    }
  }

  /**
   * Format the summary data into a concise prompt section
   */
  private static formatSummaryForPrompt(summary: ConversationSummary): string {
    const topicsText = summary.key_topics.length > 0 
      ? `\n**Key Topics Discussed**: ${summary.key_topics.join(', ')}`
      : '';

    return `
## Previous Conversations Memory
You've previously talked with this user about their relationship. Here's what you learned:

**Summary from ${summary.conversation_count} previous conversation(s)**:
${summary.summary_text}${topicsText}

**Last conversation**: ${new Date(summary.last_updated).toLocaleDateString()}

Use this context to provide continuity, reference past discussions naturally, and track their relationship journey over time. Don't explicitly say "last time we talked" unless relevant - just let this context inform your understanding of their situation.
`;
  }
}
