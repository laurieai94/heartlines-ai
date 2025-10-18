import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from './useUserRole';
import { calculateTokenCost, type ModelName } from '@/utils/modelPricing';

interface AdminCostAnalytics {
  totalMessages: number;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  averageCostPerMessage: number;
  modelBreakdown: Array<{
    model: string;
    messages: number;
    cost: number;
    tokens: number;
    percentage: number;
  }>;
  dailySpending: Array<{
    date: string;
    cost: number;
    messages: number;
  }>;
  topUsers: Array<{
    userId: string;
    email: string;
    totalCost: number;
    messages: number;
    averageCostPerMessage: number;
  }>;
  last30Days: {
    totalCost: number;
    totalMessages: number;
  };
  thisMonth: {
    totalCost: number;
    totalMessages: number;
  };
}

export const useAdminCostAnalytics = (options?: { enabled?: boolean }) => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['adminCostAnalytics'],
    queryFn: async (): Promise<AdminCostAnalytics> => {
      if (!user?.id || !isAdmin) {
        throw new Error('Unauthorized - admin access required');
      }

      // Fetch all token usage data
      const { data: allUsage, error } = await supabase
        .from('user_token_usage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate date thresholds
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Filter data by time periods
      const last30DaysData = allUsage.filter(u => new Date(u.created_at) >= thirtyDaysAgo);
      const thisMonthData = allUsage.filter(u => new Date(u.created_at) >= firstOfMonth);

      // Calculate overall metrics
      const totalMessages = allUsage.length;
      const totalCost = allUsage.reduce((sum, u) => sum + u.estimated_cost, 0);
      const totalInputTokens = allUsage.reduce((sum, u) => sum + u.input_tokens, 0);
      const totalOutputTokens = allUsage.reduce((sum, u) => sum + u.output_tokens, 0);
      const averageCostPerMessage = totalMessages > 0 ? totalCost / totalMessages : 0;

      // Model breakdown
      const modelStats = allUsage.reduce((acc, u) => {
        if (!acc[u.model]) {
          acc[u.model] = { messages: 0, cost: 0, tokens: 0 };
        }
        acc[u.model].messages += 1;
        acc[u.model].cost += u.estimated_cost;
        acc[u.model].tokens += (u.total_tokens || 0);
        return acc;
      }, {} as Record<string, { messages: number; cost: number; tokens: number }>);

      const modelBreakdown = Object.entries(modelStats)
        .map(([model, stats]) => ({
          model,
          messages: stats.messages,
          cost: stats.cost,
          tokens: stats.tokens,
          percentage: totalCost > 0 ? (stats.cost / totalCost) * 100 : 0,
        }))
        .sort((a, b) => b.cost - a.cost);

      // Daily spending (last 30 days)
      const dailyStats = last30DaysData.reduce((acc, u) => {
        const date = new Date(u.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { cost: 0, messages: 0 };
        }
        acc[date].cost += u.estimated_cost;
        acc[date].messages += 1;
        return acc;
      }, {} as Record<string, { cost: number; messages: number }>);

      const dailySpending = Object.entries(dailyStats)
        .map(([date, stats]) => ({
          date,
          cost: stats.cost,
          messages: stats.messages,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Top users by cost
      const userStats = allUsage.reduce((acc, u) => {
        if (!acc[u.user_id]) {
          acc[u.user_id] = { totalCost: 0, messages: 0 };
        }
        acc[u.user_id].totalCost += u.estimated_cost;
        acc[u.user_id].messages += 1;
        return acc;
      }, {} as Record<string, { totalCost: number; messages: number }>);

      // Fetch user emails for top users
      const topUserIds = Object.entries(userStats)
        .sort((a, b) => b[1].totalCost - a[1].totalCost)
        .slice(0, 10)
        .map(([userId]) => userId);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', topUserIds);

      const { data: authUsers } = await supabase.auth.admin.listUsers();

      const userEmailMap = new Map<string, string>(
        authUsers.users.map(u => [u.id, u.email || 'Unknown'] as [string, string])
      );

      const topUsers = Object.entries(userStats)
        .map(([userId, stats]) => ({
          userId,
          email: userEmailMap.get(userId) || 'Unknown' as string,
          totalCost: stats.totalCost,
          messages: stats.messages,
          averageCostPerMessage: stats.messages > 0 ? stats.totalCost / stats.messages : 0,
        }))
        .sort((a, b) => b.totalCost - a.totalCost)
        .slice(0, 10);

      return {
        totalMessages,
        totalCost,
        totalInputTokens,
        totalOutputTokens,
        averageCostPerMessage,
        modelBreakdown,
        dailySpending,
        topUsers,
        last30Days: {
          totalCost: last30DaysData.reduce((sum, u) => sum + u.estimated_cost, 0),
          totalMessages: last30DaysData.length,
        },
        thisMonth: {
          totalCost: thisMonthData.reduce((sum, u) => sum + u.estimated_cost, 0),
          totalMessages: thisMonthData.length,
        },
      };
    },
    enabled: !!user?.id && isAdmin && (options?.enabled ?? true),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
