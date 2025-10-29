import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

export const useAdminAnalytics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data: summary, error } = await supabase
        .from('user_analytics_summary')
        .select('*');

      if (error) throw error;

      const totalUsers = summary?.length || 0;
      const activeUsers = summary?.filter(u => 
        u.last_activity && new Date(u.last_activity) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0;
      const totalMessages = summary?.reduce((sum, u) => sum + (u.messages_this_month || 0), 0) || 0;
      const totalCost = summary?.reduce((sum, u) => sum + (u.cost_last_30_days || 0), 0) || 0;

      return {
        totalUsers,
        activeUsers,
        totalMessages,
        totalCost,
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
