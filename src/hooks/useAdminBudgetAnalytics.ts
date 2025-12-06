import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

interface LaunchLimits {
  max_daily_ai_spend: number;
  max_concurrent_users: number;
  waitlist_active: boolean;
  auto_throttle_enabled: boolean;
  waitlist_message: string | null;
}

interface BudgetAnalytics {
  // Daily metrics
  todaySpend: number;
  dailyLimit: number;
  dailyPercentUsed: number;
  dailyRemaining: number;
  
  // Monthly metrics
  monthSpend: number;
  monthlyBudget: number;
  monthlyPercentUsed: number;
  monthlyRemaining: number;
  
  // Projections
  avgDailySpend: number;
  projectedMonthlySpend: number;
  runwayDays: number;
  
  // Capacity estimates (based on ~$0.30 per trial user)
  trialsLeftToday: number;
  trialsLeftMonthly: number;
  costPerTrial: number;
  
  // Launch status
  waitlistActive: boolean;
  autoThrottleEnabled: boolean;
  currentUserCount: number;
  maxConcurrentUsers: number;
  waitlistMessage: string | null;
  
  // Health status
  budgetHealth: 'healthy' | 'warning' | 'critical';
}

export const useAdminBudgetAnalytics = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['adminBudgetAnalytics'],
    queryFn: async (): Promise<BudgetAnalytics> => {
      console.log('Fetching budget analytics...');
      
      // Fetch launch limits
      const { data: launchLimits, error: limitsError } = await supabase
        .from('launch_limits')
        .select('*')
        .limit(1)
        .single();

      if (limitsError) {
        console.error('Error fetching launch limits:', limitsError);
        throw limitsError;
      }

      const limits = launchLimits as LaunchLimits;

      // Fetch today's spend
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData, error: todayError } = await supabase
        .from('daily_ai_spend_summary')
        .select('total_cost')
        .eq('spend_date', today)
        .single();

      if (todayError && todayError.code !== 'PGRST116') {
        console.error('Error fetching today spend:', todayError);
      }

      const todaySpend = todayData?.total_cost || 0;

      // Fetch this month's spend
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: monthData, error: monthError } = await supabase
        .from('user_token_usage')
        .select('estimated_cost')
        .gte('created_at', startOfMonth.toISOString());

      if (monthError) {
        console.error('Error fetching month spend:', monthError);
      }

      const monthSpend = monthData?.reduce((sum, row) => sum + (row.estimated_cost || 0), 0) || 0;

      // Fetch last 7 days for average calculation
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: weekData, error: weekError } = await supabase
        .from('daily_ai_spend_summary')
        .select('total_cost, spend_date')
        .gte('spend_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('spend_date', { ascending: false });

      if (weekError) {
        console.error('Error fetching week data:', weekError);
      }

      const weekSpend = weekData?.reduce((sum, row) => sum + (row.total_cost || 0), 0) || 0;
      const daysWithData = weekData?.length || 1;
      const avgDailySpend = weekSpend / daysWithData;

      // Fetch user count
      const { count: userCount, error: userCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userCountError) {
        console.error('Error fetching user count:', userCountError);
      }

      // Constants
      const monthlyBudget = 100;
      const costPerTrial = 0.30; // Average cost per trial user

      // Calculate metrics
      const dailyLimit = limits.max_daily_ai_spend;
      const dailyPercentUsed = (todaySpend / dailyLimit) * 100;
      const dailyRemaining = Math.max(0, dailyLimit - todaySpend);
      
      const monthlyPercentUsed = (monthSpend / monthlyBudget) * 100;
      const monthlyRemaining = Math.max(0, monthlyBudget - monthSpend);
      
      const projectedMonthlySpend = avgDailySpend * 30;
      const runwayDays = avgDailySpend > 0 ? monthlyRemaining / avgDailySpend : 30;
      
      const trialsLeftToday = Math.floor(dailyRemaining / costPerTrial);
      const trialsLeftMonthly = Math.floor(monthlyRemaining / costPerTrial);

      // Determine budget health
      let budgetHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (dailyPercentUsed >= 90 || monthlyPercentUsed >= 90) {
        budgetHealth = 'critical';
      } else if (dailyPercentUsed >= 70 || monthlyPercentUsed >= 70) {
        budgetHealth = 'warning';
      }

      return {
        todaySpend,
        dailyLimit,
        dailyPercentUsed,
        dailyRemaining,
        monthSpend,
        monthlyBudget,
        monthlyPercentUsed,
        monthlyRemaining,
        avgDailySpend,
        projectedMonthlySpend,
        runwayDays,
        trialsLeftToday,
        trialsLeftMonthly,
        costPerTrial,
        waitlistActive: limits.waitlist_active,
        autoThrottleEnabled: limits.auto_throttle_enabled,
        currentUserCount: userCount || 0,
        maxConcurrentUsers: limits.max_concurrent_users,
        waitlistMessage: limits.waitlist_message,
        budgetHealth,
      };
    },
    enabled: isAdmin,
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};
