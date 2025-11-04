import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Sprout, Zap, Heart, Infinity } from "lucide-react";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
import { format } from "date-fns";

const STORAGE_KEY = 'subscription_status_banner_dismissed';

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
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const {
    subscribed,
    subscription_tier,
    subscription_end,
    message_limit,
    messages_used,
    usagePercentage,
    loading,
  } = useOptimizedSubscription();

  if (loading || isDismissed) return null;

  const tier = subscription_tier || 'freemium';
  const TierIcon = tierIcons[tier as keyof typeof tierIcons] || Sprout;
  const tierName = tierNames[tier as keyof typeof tierNames] || 'begin';
  const isUnlimited = message_limit === 0;
  const isHighUsage = usagePercentage > 80;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  const getUsageColor = () => {
    if (isUnlimited) return 'from-green-400 via-emerald-500 to-green-600';
    if (usagePercentage > 80) return 'from-orange-400 via-red-500 to-red-600';
    if (usagePercentage > 50) return 'from-yellow-400 via-amber-500 to-orange-500';
    return 'from-green-400 via-emerald-500 to-green-600';
  };

  return (
    <Card className="relative mb-8 overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-burgundy-900/90 via-burgundy-800/80 to-burgundy-900/90 backdrop-blur-xl shadow-2xl">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4 text-white/60" />
      </button>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Left: Current Plan */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-coral-400/20 to-pink-400/20 border border-white/10">
              <TierIcon className="h-8 w-8 text-coral-300" />
            </div>
            <div>
              <h3 className="text-2xl font-brand text-white tracking-wide">{tierName}</h3>
              <p className="text-sm text-white/60">
                {subscribed ? 'premium plan' : 'free plan'}
              </p>
            </div>
          </div>

          {/* Center: Usage */}
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">
                  {isUnlimited ? (
                    <span className="flex items-center gap-2">
                      <Infinity className="h-4 w-4" />
                      unlimited messages
                    </span>
                  ) : (
                    <>
                      {messages_used} / {message_limit} messages used
                    </>
                  )}
                </span>
                {!isUnlimited && (
                  <span className={`text-sm font-medium ${
                    isHighUsage ? 'text-orange-400' : 'text-emerald-400'
                  }`}>
                    {Math.round(usagePercentage)}%
                  </span>
                )}
              </div>
              
              {!isUnlimited && (
                <Progress 
                  value={usagePercentage} 
                  className={`h-2 bg-white/10 ${isHighUsage ? 'animate-pulse' : ''}`}
                />
              )}
              
              {isHighUsage && !isUnlimited && (
                <p className="text-xs text-orange-400 animate-pulse">
                  Running low on messages - Consider upgrading
                </p>
              )}
            </div>
          </div>

          {/* Right: Renewal/Upgrade Info */}
          <div className="text-center md:text-right min-w-[200px]">
            {subscribed && subscription_end ? (
              <div>
                <p className="text-sm text-white/60 mb-1">Renews on</p>
                <p className="text-lg font-medium text-white">
                  {format(new Date(subscription_end), 'MMMM dd, yyyy')}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-white/60 mb-2">Ready to grow?</p>
                <p className="text-lg font-medium bg-gradient-to-r from-coral-300 to-pink-300 bg-clip-text text-transparent">
                  Upgrade anytime
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-coral-500/5 via-transparent to-pink-500/5 pointer-events-none" />
    </Card>
  );
};
