import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateTokenCost, type ModelName } from '@/utils/modelPricing';

interface TokenUsageData {
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  created_at: string;
}

interface TokenAnalytics {
  totalMessages: number;
  totalTokens: number;
  totalCost: number;
  averageTokensPerMessage: number;
  averageCostPerMessage: number;
  costByModel: Record<string, { tokens: number; cost: number; messages: number }>;
  last30Days: {
    totalMessages: number;
    totalCost: number;
    averageCostPerMessage: number;
  };
}

export const useTokenAnalytics = (options?: { enabled?: boolean }) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tokenAnalytics', user?.id],
    queryFn: async (): Promise<TokenAnalytics> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_token_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usage = data as TokenUsageData[];
      
      // Calculate 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recent = usage.filter(u => new Date(u.created_at) >= thirtyDaysAgo);

      // Aggregate by model
      const costByModel: Record<string, { tokens: number; cost: number; messages: number }> = {};
      
      usage.forEach(u => {
        if (!costByModel[u.model]) {
          costByModel[u.model] = { tokens: 0, cost: 0, messages: 0 };
        }
        costByModel[u.model].tokens += u.total_tokens;
        costByModel[u.model].cost += u.estimated_cost;
        costByModel[u.model].messages += 1;
      });

      const totalMessages = usage.length;
      const totalTokens = usage.reduce((sum, u) => sum + u.total_tokens, 0);
      const totalCost = usage.reduce((sum, u) => sum + u.estimated_cost, 0);

      const recentMessages = recent.length;
      const recentCost = recent.reduce((sum, u) => sum + u.estimated_cost, 0);

      return {
        totalMessages,
        totalTokens,
        totalCost,
        averageTokensPerMessage: totalMessages > 0 ? totalTokens / totalMessages : 0,
        averageCostPerMessage: totalMessages > 0 ? totalCost / totalMessages : 0,
        costByModel,
        last30Days: {
          totalMessages: recentMessages,
          totalCost: recentCost,
          averageCostPerMessage: recentMessages > 0 ? recentCost / recentMessages : 0,
        }
      };
    },
    enabled: !!user?.id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};