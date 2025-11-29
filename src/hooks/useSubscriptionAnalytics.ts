import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';
import type { SubscriptionAnalyticsSummary, MonthlyRevenueSnapshot } from '@/types/admin';

export const useSubscriptionAnalytics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['subscriptionAnalytics'],
    queryFn: async (): Promise<SubscriptionAnalyticsSummary | null> => {
      console.log('Fetching subscription analytics...');
      
      const { data, error } = await supabase
        .rpc('get_subscription_analytics_summary');

      if (error) {
        console.error('Error fetching subscription analytics:', error);
        throw error;
      }

      console.log('Subscription analytics fetched:', data);
      return data?.[0] || null;
    },
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useRevenueSnapshots = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['revenueSnapshots'],
    queryFn: async (): Promise<MonthlyRevenueSnapshot[]> => {
      console.log('Fetching revenue snapshots...');
      
      const { data, error } = await supabase
        .from('monthly_revenue_snapshots')
        .select('*')
        .order('snapshot_month', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching revenue snapshots:', error);
        throw error;
      }

      console.log('Revenue snapshots fetched:', data);
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
