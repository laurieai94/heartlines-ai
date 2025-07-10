
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        toast.error('Failed to check subscription status');
        return;
      }

      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null
      });
    } catch (error) {
      console.error('Subscription check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('Please sign in to manage subscription');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Customer portal error:', error);
        toast.error('Failed to open customer portal');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Customer portal failed:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      });
    }
  }, [user]);

  return {
    ...subscriptionData,
    isLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    isPremium: subscriptionData.subscribed && subscriptionData.subscription_tier === 'Premium'
  };
};
