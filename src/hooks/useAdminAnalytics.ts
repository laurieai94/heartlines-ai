import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

export const useAdminAnalytics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data: summary, error } = await supabase
        .rpc('get_user_analytics_summary');

      if (error) throw error;

      const totalUsers = summary?.length || 0;
      const activeUsers = summary?.filter(u => 
        u.last_activity && new Date(u.last_activity) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0;
      const totalMessages = summary?.reduce((sum, u) => sum + (u.messages_this_month || 0), 0) || 0;
      const totalCost = summary?.reduce((sum, u) => sum + (u.cost_last_30_days || 0), 0) || 0;
      
      // Calculate average cost per user
      const avgCostPerUser = totalUsers > 0 ? totalCost / totalUsers : 0;
      
      // Get subscriber counts by plan
      const { data: subscriberData } = await supabase
        .from('subscribers')
        .select('subscription_tier')
        .eq('subscribed', true);
      
      const subscribersByPlan = subscriberData?.reduce((acc, sub) => {
        const tier = sub.subscription_tier || 'free';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      // Calculate platform-wide token averages
      const usersWithMessages = summary?.filter(u => u.messages_this_month > 0) || [];
      const avgInputTokens = usersWithMessages.length > 0
        ? usersWithMessages.reduce((sum, u) => sum + (u.avg_input_tokens || 0), 0) / usersWithMessages.length
        : 0;
      const avgOutputTokens = usersWithMessages.length > 0
        ? usersWithMessages.reduce((sum, u) => sum + (u.avg_output_tokens || 0), 0) / usersWithMessages.length
        : 0;
      
      // Calculate conversation and session metrics
      const usersWithConversations = summary?.filter(u => u.total_conversations > 0) || [];
      const avgMessagesPerConversation = usersWithConversations.length > 0
        ? usersWithConversations.reduce((sum, u) => sum + (u.avg_messages_per_conversation || 0), 0) / usersWithConversations.length
        : 0;
      const avgConversationDuration = usersWithConversations.length > 0
        ? usersWithConversations.reduce((sum, u) => sum + (u.avg_conversation_duration_minutes || 0), 0) / usersWithConversations.length
        : 0;
      const avgSessionDuration = usersWithConversations.length > 0
        ? usersWithConversations.reduce((sum, u) => sum + (u.avg_session_duration_minutes || 0), 0) / usersWithConversations.length
        : 0;

      return {
        totalUsers,
        activeUsers,
        totalMessages,
        totalCost,
        avgCostPerUser,
        subscribersByPlan,
        avgInputTokens,
        avgOutputTokens,
        avgMessagesPerConversation,
        avgConversationDuration,
        avgSessionDuration,
        users: summary || []
      };
    },
    enabled: isAdmin,
    staleTime: 60000,
  });
};

export const useAdminCostAnalytics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-cost-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_cost_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 60000,
  });
};
