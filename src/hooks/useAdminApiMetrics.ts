import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

export interface DailyApiHealthSummary {
  date: string;
  model: string;
  total_requests: number;
  successful_requests: number;
  success_rate_percent: number;
  avg_response_time_ms: number;
  p50_response_time_ms: number;
  p95_response_time_ms: number;
  p99_response_time_ms: number;
  avg_retries: number;
  total_retries: number;
  requests_with_retries: number;
  rate_limit_errors: number;
  timeout_errors: number;
  overload_errors: number;
  auth_errors: number;
}

export const useAdminApiMetrics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin_api_metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_api_health_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as DailyApiHealthSummary[];
    },
    enabled: isAdmin,
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
