import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

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
      case 'glow': return 150;
      case 'vibe': return 300;
      case 'unlimited': return 0; // 0 = unlimited
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

      if (!import.meta.env.PROD) {
        performance.mark('subscription-query-start');
      }

      const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01 format
      
      // Parallelize all Supabase queries for faster loading
      const [subResult, overrideResult, usageResult] = await Promise.all([
        // Subscription data (minimal select)
        supabase
          .from('subscribers')
          .select('subscribed, subscription_tier, subscription_end')
          .eq('user_id', user.id)
          .maybeSingle(),
        
        // Account override check
        supabase
          .from('account_overrides')
          .select('unlimited_messages')
          .eq('email', user.email)
          .eq('unlimited_messages', true)
          .maybeSingle(),
        
        // Message usage (minimal select)
        supabase
          .from('user_message_usage')
          .select('current_month_usage, subscription_tier')
          .eq('user_id', user.id)
          .eq('usage_month', currentMonth)
          .maybeSingle()
      ]);

      if (!import.meta.env.PROD) {
        performance.mark('subscription-query-end');
      }

      const { data: subData } = subResult;
      const { data: override } = overrideResult;
      const { data: usageData } = usageResult;

      const tier = subData?.subscription_tier || usageData?.subscription_tier || null;
      // If user has unlimited override, set message limit to 0 (unlimited)
      const messageLimit = override ? 0 : getMessageLimit(tier);
      const messagesUsed = usageData?.current_month_usage || 0;

      // Return cached data immediately
      const cachedData: SubscriptionData = {
        subscribed: subData?.subscribed || false,
        subscription_tier: tier,
        subscription_end: subData?.subscription_end || null,
        message_limit: messageLimit,
        messages_used: messagesUsed
      };

      return cachedData;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for faster updates
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Update when user returns to tab
    refetchOnMount: true, // Update on component mount
  });

  // Subscribe to realtime updates on subscribers table
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'subscribers',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Subscription updated via realtime:', payload);
          // Invalidate cache to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const upgrade = async (tier: 'glow' | 'vibe' | 'unlimited', returnUrl?: string) => {
    if (!user) return;

    try {
      // Use current path as return URL if not provided
      const finalReturnUrl = returnUrl || window.location.pathname;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          tier,
          returnUrl: finalReturnUrl
        }
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

  // On-demand Stripe revalidation for when users need fresh data
  const revalidateWithStripe = async () => {
    if (!user) return;
    
    try {
      if (!import.meta.env.PROD) {
        performance.mark('stripe-revalidation-start');
      }
      const { data: freshData } = await supabase.functions.invoke('check-subscription');
      
      if (freshData) {
        queryClient.setQueryData(['subscription', user.id], {
          ...defaultData,
          ...freshData
        });
        if (!import.meta.env.PROD) {
          performance.mark('stripe-revalidation-end');
        }
      }
    } catch (error) {
      console.warn('Stripe revalidation failed:', error);
    }
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
    revalidateWithStripe,
    upgrade,
    manageSubscription,
    usagePercentage: data.message_limit > 0 ? (data.messages_used / data.message_limit) * 100 : 0
  };
};