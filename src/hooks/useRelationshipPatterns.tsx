import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RelationshipPattern {
  id: string;
  pattern_type: string;
  pattern_description: string;
  frequency: number;
  first_seen: string;
  last_seen: string;
  context_snippets: string[];
  is_resolved: boolean;
}

export interface ConversationSummary {
  id: string;
  summary_text: string;
  key_topics: string[];
  last_updated: string;
  conversation_count: number;
}

export interface CrossSessionMemory {
  stableFacts: string;
  pastSituations: Array<{
    date: string;
    topics: string[];
    summary: string;
  }>;
}

export const useRelationshipPatterns = () => {
  const { user } = useAuth();

  const { data: patterns = [], isLoading: patternsLoading } = useQuery({
    queryKey: ['relationship_patterns', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('relationship_patterns')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('frequency', { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data || []) as RelationshipPattern[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: summaries = [], isLoading: summariesLoading } = useQuery({
    queryKey: ['conversation_summaries', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false })
        .limit(3);

      if (error) throw error;
      return (data || []) as ConversationSummary[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Format cross-session memory into STABLE FACTS (always available) 
   * and PAST SITUATIONS (gated, only used when relevant)
   */
  const formatCrossSessionMemory = (): string => {
    if (patterns.length === 0 && summaries.length === 0) {
      return '';
    }

    let memory = '\n## CROSS-SESSION MEMORY\n\n';

    // STABLE FACTS: Abstract patterns without specific event details
    // These can be used freely in any conversation
    if (patterns.length > 0) {
      memory += '### STABLE FACTS (learned from past conversations - use freely):\n';
      patterns.forEach(pattern => {
        // Abstract pattern only - no specific event details or quotes
        memory += `- **${pattern.pattern_type}**: ${pattern.pattern_description} (recurring ${pattern.frequency} time${pattern.frequency > 1 ? 's' : ''})\n`;
      });
      memory += '\n';
    }

    // PAST SITUATIONS: Specific conversations with topic tags
    // These are GATED - only use when explicitly relevant
    if (summaries.length > 0) {
      memory += '### PAST SITUATIONS (GATED - see rules below):\n';
      summaries.forEach(summary => {
        const date = new Date(summary.last_updated).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        const topicTags = summary.key_topics?.length > 0 
          ? `[${summary.key_topics.join(', ')}]` 
          : '[general]';
        memory += `- ${topicTags} ${date}: "${summary.summary_text.substring(0, 120)}${summary.summary_text.length > 120 ? '...' : ''}"\n`;
      });
      memory += '\n';
    }

    // Add context gating rules
    memory += `### CROSS-SESSION MEMORY RULES (CRITICAL):

**STABLE FACTS (use freely):**
- Recurring patterns, relationship dynamics, communication styles
- Use these invisibly like a friend who remembers

**PAST SITUATIONS (GATED - use ONLY when):**
1. User explicitly references it: "remember when we talked about..."
2. User's current message CLEARLY relates: Same topic, same people, same dynamic
3. You ask first: "is this connected to what happened with [past situation]?"

**NEVER:**
- Assume a new conversation is about the same topic as last time
- Reference specific past events unless user brings them up
- Apply past situation context to unrelated topics
- Say "last time we talked about X" unless they mention it first

**CONTEXT CHECK (do this silently before each response):**
1. Is this the FIRST message of the conversation?
   → YES: Treat as fresh topic. Use stable facts only.
2. Does user's message explicitly connect to past?
   → YES: Reference that specific past situation.
3. Does current topic MATCH a past situation's topic tags?
   → MAYBE: Ask "is this related to [past topic]?" before assuming
4. Unrelated topic?
   → Use stable facts only. Fresh response.

`;

    return memory;
  };

  /**
   * Get structured memory for more granular control
   */
  const getStructuredMemory = (): CrossSessionMemory => {
    return {
      stableFacts: patterns.map(p => `${p.pattern_type}: ${p.pattern_description}`).join('\n'),
      pastSituations: summaries.map(s => ({
        date: new Date(s.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        topics: s.key_topics || [],
        summary: s.summary_text
      }))
    };
  };

  return {
    patterns,
    summaries,
    isLoading: patternsLoading || summariesLoading,
    formatCrossSessionMemory,
    getStructuredMemory,
  };
};
