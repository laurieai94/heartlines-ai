import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  message_limit: number;
  messages_used: number;
}

export const useOptimizedSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getMessageLimit = (tier: string | null): number => {
    switch (tier?.toLowerCase()) {
      case 'grow': return 100;
      case 'thrive': return 300;
      default: return 25; // free tier
    }
  };

  // Query to load subscription data from Supabase first
  const {
    data: subscriptionData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async (): Promise<SubscriptionData> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, try to load from Supabase subscribers table (fast)
      const { data: subData } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Also get message usage for current month
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01 format
      const { data: usageData } = await supabase
        .from('user_message_usage')
        .select('current_month_usage, subscription_tier')
        .eq('user_id', user.id)
        .eq('usage_month', currentMonth)
        .maybeSingle();

      const tier = subData?.subscription_tier || usageData?.subscription_tier || null;
      const messageLimit = getMessageLimit(tier);
      const messagesUsed = usageData?.current_month_usage || 0;

      // Return cached data immediately
      const cachedData: SubscriptionData = {
        subscribed: subData?.subscribed || false,
        subscription_tier: tier,
        subscription_end: subData?.subscription_end || null,
        message_limit: messageLimit,
        messages_used: messagesUsed
      };

      // For paid users, revalidate in background with Stripe
      if (subData?.subscribed) {
        // Background revalidation with Stripe
        setTimeout(async () => {
          try {
            const { data: freshData } = await supabase.functions.invoke('check-subscription');
            if (freshData && JSON.stringify(freshData) !== JSON.stringify(cachedData)) {
              queryClient.setQueryData(['subscription', user.id], {
                ...cachedData,
                ...freshData
              });
            }
          } catch (error) {
            console.warn('Background subscription refresh failed:', error);
          }
        }, 100);
      }

      return cachedData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent excessive refetching
  });

  const upgrade = async (tier: 'grow' | 'thrive') => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      throw err;
    }
  };

  const manageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Customer portal error:', err);
      throw err;
    }
  };

  const refresh = async () => {
    await refetch();
  };

  const defaultData: SubscriptionData = {
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    message_limit: 25,
    messages_used: 0
  };

  const data = subscriptionData || defaultData;

  return {
    ...data,
    loading: isLoading,
    error: error?.message || null,
    refresh,
    upgrade,
    manageSubscription,
    usagePercentage: data.message_limit > 0 ? (data.messages_used / data.message_limit) * 100 : 0
  };
};