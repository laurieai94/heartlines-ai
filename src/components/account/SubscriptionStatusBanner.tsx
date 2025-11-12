import React from "react";
import { Sprout, Zap, Heart, Infinity } from "lucide-react";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
import { format } from "date-fns";

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
  } = useOptimizedSubscription();

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
    <div className="mb-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white/5 bg-white/3 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
        {/* Icon + Plan */}
        <div className="flex items-center gap-1.5">
          <TierIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-coral-300" />
          <span className="text-xs sm:text-sm font-medium text-white/90">
            {tierName}<span className="hidden sm:inline"> plan</span>
          </span>
        </div>

        {/* Bullet separator */}
        <span className="text-white/30 text-xs">•</span>

        {/* Usage - compact */}
        {isUnlimited ? (
          <span className="flex items-center gap-1 text-xs sm:text-sm text-emerald-400">
            <Infinity className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">unlimited </span>
            <span className="sm:hidden">∞ </span>messages
          </span>
        ) : (
          <span className={`text-xs sm:text-sm ${getUsageColor()}`}>
            {messagesRemaining}<span className="hidden sm:inline"> messages</span> left
          </span>
        )}

        {/* Bullet separator */}
        <span className="text-white/30 text-xs">•</span>

        {/* Renewal/Upgrade - compact */}
        <span className="text-xs text-white/60">
          {subscribed && subscription_end ? (
            <>renews {format(new Date(subscription_end), 'MMM d')}</>
          ) : (
            <span className="text-coral-300">upgrade anytime</span>
          )}
        </span>
      </div>
    </div>
  );
};
