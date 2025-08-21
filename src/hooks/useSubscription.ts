import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  message_limit: number;
  messages_used: number;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    message_limit: 25, // Default free tier
    messages_used: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMessageLimit = (tier: string | null): number => {
    switch (tier?.toLowerCase()) {
      case 'grow': return 100;
      case 'thrive': return 300;
      default: return 25; // free tier
    }
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: subscriptionData, error: subError } = await supabase.functions.invoke('check-subscription');
      
      if (subError) throw subError;

      // Get message usage
      const { data: usageData, error: usageError } = await supabase
        .from('user_message_usage')
        .select('current_month_usage, subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError;
      }

      const tier = subscriptionData?.subscription_tier || usageData?.subscription_tier || null;
      const messageLimit = getMessageLimit(tier);
      const messagesUsed = usageData?.current_month_usage || 0;

      setData({
        subscribed: subscriptionData?.subscribed || false,
        subscription_tier: tier,
        subscription_end: subscriptionData?.subscription_end || null,
        message_limit: messageLimit,
        messages_used: messagesUsed
      });
    } catch (err) {
      console.error('Subscription check error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, [user]);

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

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user, refresh]);

  return {
    ...data,
    loading,
    error,
    refresh,
    upgrade,
    manageSubscription,
    usagePercentage: data.message_limit > 0 ? (data.messages_used / data.message_limit) * 100 : 0
  };
};