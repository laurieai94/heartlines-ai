import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

export interface DailyCacheMetrics {
  date: string | null;
  model: string | null;
  request_count: number | null;
  total_cache_creation_tokens: number | null;
  total_cache_read_tokens: number | null;
  total_input_tokens: number | null;
  cache_hit_rate_percent: number | null;
  total_cost_savings: number | null;
}

export const useAdminCacheMetrics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-cache-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_cache_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return (data || []) as DailyCacheMetrics[];
    },
    enabled: isAdmin,
    staleTime: 60000,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
