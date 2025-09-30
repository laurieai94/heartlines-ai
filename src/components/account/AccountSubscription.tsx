import { useState } from 'react';
import { Crown, RefreshCw, ExternalLink, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';

const AccountSubscription = () => {
  const { isMobile, simulateHapticFeedback } = useOptimizedMobile();
  
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    message_limit, 
    messages_used, 
    loading, 
    usagePercentage,
    refresh,
    upgrade,
    manageSubscription 
  } = useOptimizedSubscription();
  
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [managing, setManaging] = useState(false);

  const plans = [
    {
      name: 'Free',
      tier: null,
      price: '$0',
      messages: 50,
      features: ['Basic AI coaching', '50 messages/month', 'Community support'],
      current: !subscribed && !subscription_tier
    },
    {
      name: 'Grow',
      tier: 'grow',
      price: '$15',
      messages: 150,
      features: ['Everything in Free', '150 messages/month', 'Priority support', 'Advanced insights'],
      current: subscription_tier?.toLowerCase() === 'grow',
      popular: true
    },
    {
      name: 'Thrive',
      tier: 'thrive', 
      price: '$29',
      messages: 300,
      features: ['Everything in Grow', '300 messages/month', 'Premium support', 'Exclusive content'],
      current: subscription_tier?.toLowerCase() === 'thrive'
    }
  ];

  const handleUpgrade = async (tier: 'grow' | 'thrive') => {
    setUpgrading(tier);
    try {
      await upgrade(tier);
      toast.success('Redirecting to checkout', {
        description: 'Opening Stripe checkout in a new tab...'
      });
    } catch (error) {
      toast.error('Upgrade failed', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageSubscription = async () => {
    setManaging(true);
    try {
      await manageSubscription();
      toast.success('Opening customer portal', {
        description: 'Manage your subscription in a new tab...'
      });
    } catch (error) {
      toast.error('Failed to open portal', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setManaging(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-white/10" />
                <Skeleton className="h-4 w-64 bg-white/10" />
              </div>
              <Skeleton className="h-8 w-8 bg-white/10 rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-6 w-16 bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-6 w-20 bg-white/10" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2.5'} touch-manipulation`}>
      {/* Consolidated Status & Plans Card */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardContent className={isMobile ? 'p-2' : 'p-2.5'}>
          {/* Current Status Row */}
          <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
            <div className="flex-1">
              <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
                <Crown className={isMobile ? 'h-3 w-3 text-yellow-400' : 'h-4 w-4 text-yellow-400'} />
                <span className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {subscription_tier ? subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1) : 'Free'}
                </span>
              </div>
              <p className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {messages_used} / {message_limit} messages used
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {subscribed && (
                <Button 
                  onClick={(e) => {
                    if (isMobile && e.currentTarget) {
                      simulateHapticFeedback(e.currentTarget, 'medium');
                    }
                    handleManageSubscription();
                  }}
                  disabled={managing}
                  size="sm"
                  variant="outline"
                  className={`bg-white/5 border-white/20 text-white hover:bg-white/10 touch-manipulation ${
                    isMobile ? 'text-[10px] h-6 px-2' : 'text-xs h-7'
                  }`}
                >
                  <ExternalLink className={`${isMobile ? 'h-2 w-2 mr-0.5' : 'h-2.5 w-2.5 mr-1'}`} />
                  {managing ? '...' : 'Manage'}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  if (isMobile && e.currentTarget) {
                    simulateHapticFeedback(e.currentTarget, 'light');
                  }
                  refresh();
                }}
                disabled={loading}
                className={`text-white/70 hover:text-white hover:bg-white/10 p-0 touch-manipulation ${
                  isMobile ? 'h-6 w-6' : 'h-7 w-7'
                }`}
              >
                <RefreshCw className={`${loading ? 'animate-spin' : ''} ${
                  isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'
                }`} />
              </Button>
            </div>
          </div>

          {/* Usage Warning (Inline) */}
          {usagePercentage > 80 && !subscribed && (
            <div className={`bg-orange-500/20 border border-orange-400/30 rounded-lg flex items-center ${
              isMobile ? 'p-1.5 gap-1.5 mb-2' : 'p-2 gap-2 mb-3'
            }`}>
              <div className={`bg-orange-400 rounded-full animate-pulse flex-shrink-0 ${
                isMobile ? 'h-1.5 w-1.5' : 'h-2 w-2'
              }`} />
              <p className={`text-orange-300 ${isMobile ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                {Math.round(usagePercentage)}% used. Upgrade to continue chatting.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/10 my-2" />

          {/* Plans Grid */}
          <div className={`grid ${isMobile ? 'grid-cols-3 gap-1.5' : 'grid-cols-3 gap-2'}`}>
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-lg transition-all ${
                  plan.current 
                    ? 'border-pink-400/50 bg-white/10' 
                    : 'border-white/10'
                } ${isMobile ? 'p-1.5' : 'p-2'}`}
              >
                {plan.popular && (
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-full font-medium ${
                    isMobile ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9px]'
                  }`}>
                    Popular
                  </div>
                )}
                
                <div className={`text-center ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                  <div className={`font-bold text-white ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                    {plan.name}
                  </div>
                  <div className={`font-semibold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {plan.price}
                    <span className={`text-white/60 ${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>/mo</span>
                  </div>
                  <div className={`text-white/60 ${isMobile ? 'text-[9px] leading-tight' : 'text-[10px]'}`}>
                    {plan.messages} msgs
                  </div>
                  
                  {plan.current ? (
                    <div className={`bg-green-500/20 text-green-400 border border-green-400/30 rounded ${
                      isMobile ? 'text-[9px] py-0.5 mt-1' : 'text-[10px] py-1 mt-1.5'
                    }`}>
                      <Check className={`inline ${isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'}`} />
                    </div>
                  ) : plan.tier ? (
                    <Button 
                      onClick={(e) => {
                        if (isMobile && e.currentTarget) {
                          simulateHapticFeedback(e.currentTarget, 'medium');
                        }
                        handleUpgrade(plan.tier as 'grow' | 'thrive');
                      }}
                      disabled={upgrading === plan.tier}
                      className={`w-full questionnaire-button-primary touch-manipulation ${
                        isMobile ? 'text-[9px] h-5 mt-1' : 'text-[10px] h-6 mt-1.5'
                      }`}
                    >
                      {upgrading === plan.tier ? '...' : 'Upgrade'}
                    </Button>
                  ) : (
                    <div className={`text-white/40 ${isMobile ? 'text-[9px] py-0.5 mt-1' : 'text-[10px] py-1 mt-1.5'}`}>
                      Free
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSubscription;