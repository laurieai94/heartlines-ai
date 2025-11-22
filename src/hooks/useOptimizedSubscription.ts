import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo } from 'react';

// Timeout wrapper for queries
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    )
  ]);
};

// Detect mobile network
const isMobileNetwork = (): boolean => {
  if (!('connection' in navigator)) return false;
  const conn = (navigator as any).connection;
  return conn?.effectiveType === '2g' || conn?.effectiveType === '3g' || conn?.saveData;
};

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
  
  const isMobile = useMemo(() => isMobileNetwork(), []);

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
      
      try {
        // Wrap query with timeout (5 seconds)
        const queries = Promise.all([
          supabase
            .from('subscribers')
            .select('subscribed, subscription_tier, subscription_end')
            .eq('user_id', user.id)
            .maybeSingle(),
          
          supabase
            .from('account_overrides')
            .select('unlimited_messages')
            .eq('email', user.email)
            .eq('unlimited_messages', true)
            .maybeSingle(),
          
          supabase
            .from('user_message_usage')
            .select('current_month_usage, subscription_tier')
            .eq('user_id', user.id)
            .eq('usage_month', currentMonth)
            .maybeSingle()
        ]);

        const [subResult, overrideResult, usageResult] = await withTimeout(queries, 5000);

        if (!import.meta.env.PROD) {
          performance.mark('subscription-query-end');
        }

        const { data: subData } = subResult;
        const { data: override } = overrideResult;
        const { data: usageData } = usageResult;

        const tier = subData?.subscription_tier || usageData?.subscription_tier || null;
        const messageLimit = override ? 0 : getMessageLimit(tier);
        const messagesUsed = usageData?.current_month_usage || 0;

        return {
          subscribed: subData?.subscribed || false,
          subscription_tier: tier,
          subscription_end: subData?.subscription_end || null,
          message_limit: messageLimit,
          messages_used: messagesUsed
        };
      } catch (err) {
        console.warn('Subscription query failed or timed out:', err);
        // Return cached data if available
        const cached = queryClient.getQueryData<SubscriptionData>(['subscription', user.id]);
        if (cached) return cached;
        
        // Return default data
        throw err;
      }
    },
    enabled: !!user,
    staleTime: isMobile ? 5 * 60 * 1000 : 2 * 60 * 1000, // 5min mobile, 2min desktop
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: !isMobile, // Disable on mobile
    refetchOnMount: !isMobile, // Disable on mobile
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  // Subscribe to realtime updates (skip on very slow networks)
  useEffect(() => {
    if (!user?.id || isMobile) return;
    
    try {
      const channel = supabase
        .channel(`subscription-changes:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscribers',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Subscription updated via realtime:', payload);
            queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
          }
        )
        .subscribe();

      const usageChannel = supabase
        .channel(`usage-changes:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_message_usage',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Message usage updated via realtime:', payload);
            queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(usageChannel);
      };
    } catch (error) {
      console.warn('Failed to set up realtime subscription:', error);
    }
  }, [user?.id, queryClient, isMobile]);

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