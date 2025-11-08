import React, { useState } from "react";
import { Sprout, Zap, Heart, Infinity, RefreshCw } from "lucide-react";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { format } from "date-fns";
import { toast } from "sonner";

const tierIcons = {
  glow: Zap,
  vibe: Heart,
  unlimited: Infinity,
  freemium: Sprout,
};

const tierNames = {
  glow: 'glow',
  vibe: 'vibe',
  unlimited: 'unlimited',
  freemium: 'begin',
};

export const SubscriptionStatusBanner: React.FC = () => {
  const {
    subscribed,
    subscription_tier,
    subscription_end,
    message_limit,
    messages_used,
    usagePercentage,
    loading,
    revalidateWithStripe,
  } = useOptimizedSubscription();
  
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await revalidateWithStripe();
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      toast.success("Subscription refreshed!");
    } catch (error) {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return null;

  const tier = subscription_tier || 'freemium';
  const TierIcon = tierIcons[tier as keyof typeof tierIcons] || Sprout;
  const tierName = tierNames[tier as keyof typeof tierNames] || 'begin';
  const isUnlimited = message_limit === 0;
  const messagesRemaining = message_limit - messages_used;
  const isHighUsage = usagePercentage > 80;

  const getUsageColor = () => {
    if (isUnlimited) return 'text-emerald-400';
    if (usagePercentage > 80) return 'text-orange-400';
    if (usagePercentage > 50) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="mb-6 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6">
        {/* Left: Current Plan */}
        <div className="flex items-center gap-2">
          <TierIcon className="h-4 w-4 text-coral-300" />
          <span className="text-sm font-medium text-white/90">{tierName} plan</span>
          <button 
            onClick={handleRefresh}
            className="ml-1 opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
            disabled={refreshing}
            title="Refresh subscription status"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-white/80 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Center: Usage */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">•</span>
          {isUnlimited ? (
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <Infinity className="h-3.5 w-3.5" />
              <span>unlimited messages</span>
            </span>
          ) : (
            <span className={`text-sm ${getUsageColor()}`}>
              {messagesRemaining} messages left
            </span>
          )}
        </div>

        {/* Right: Renewal/Upgrade Info */}
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="hidden sm:inline">•</span>
          {subscribed && subscription_end ? (
            <span>
              renews {format(new Date(subscription_end), 'MMM d')}
            </span>
          ) : (
            <span className="text-coral-300">upgrade anytime</span>
          )}
        </div>
      </div>
    </div>
  );
};
