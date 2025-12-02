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

  const formatCrossSessionMemory = (): string => {
    if (patterns.length === 0 && summaries.length === 0) {
      return '';
    }

    let memory = '\n## CROSS-SESSION MEMORY\n\n';

    // Add recurring patterns
    if (patterns.length > 0) {
      memory += '### RECURRING PATTERNS (from past conversations):\n';
      patterns.forEach(pattern => {
        const firstSeenDate = new Date(pattern.first_seen).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        const lastSeenDate = new Date(pattern.last_seen).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        const latestContext = pattern.context_snippets?.[pattern.context_snippets.length - 1] || '';
        
        memory += `- **${pattern.pattern_type}** (${pattern.frequency} occurrence${pattern.frequency > 1 ? 's' : ''} since ${firstSeenDate}): ${pattern.pattern_description}. Last discussed ${lastSeenDate}`;
        if (latestContext) {
          memory += `: "${latestContext.substring(0, 80)}${latestContext.length > 80 ? '...' : ''}"`;
        }
        memory += '\n';
      });
      memory += '\n';
    }

    // Add recent conversation summaries
    if (summaries.length > 0) {
      memory += '### RECENT CONVERSATION SUMMARIES:\n';
      summaries.forEach(summary => {
        const date = new Date(summary.last_updated).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        memory += `- **${date}**: ${summary.summary_text}\n`;
      });
      memory += '\n';
    }

    return memory;
  };

  return {
    patterns,
    summaries,
    isLoading: patternsLoading || summariesLoading,
    formatCrossSessionMemory,
  };
};
