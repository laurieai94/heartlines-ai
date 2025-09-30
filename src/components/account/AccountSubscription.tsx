import { useState } from 'react';
import { Crown, RefreshCw, ExternalLink, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';
import { pricingPlans } from '@/data/pricingPlans';

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

  // Map pricing plans to account format
  const plans = pricingPlans.map((plan) => ({
    name: plan.name,
    tier: plan.tier === 'freemium' ? null : plan.tier,
    price: plan.price,
    messages: plan.messages,
    description: plan.description,
    icon: plan.icon,
    features: plan.features,
    current: plan.tier === 'freemium' 
      ? !subscribed && !subscription_tier 
      : subscription_tier?.toLowerCase() === plan.tier,
    popular: plan.popular
  }));

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
        
        <div>
          <Skeleton className="h-6 w-32 bg-white/10 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader className="text-center space-y-2">
                  <Skeleton className="h-6 w-16 bg-white/10 mx-auto" />
                  <Skeleton className="h-8 w-20 bg-white/10 mx-auto" />
                  <Skeleton className="h-4 w-32 bg-white/10 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-4 w-full bg-white/10" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full bg-white/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? '' : 'space-y-2.5'} touch-manipulation`}>
      {/* Current Subscription Status */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardHeader className={isMobile ? 'p-1.5' : 'p-2.5'}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-white flex items-center gap-1.5 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                <Crown className={isMobile ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} />
                Subscription Status
              </CardTitle>
              <CardDescription className={`text-white/60 ${
                isMobile ? 'text-xs leading-tight' : 'text-sm'
              }`}>
                Current plan and usage information
              </CardDescription>
            </div>
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
                isMobile ? 'h-5 w-5' : 'h-7 w-7'
              }`}
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''} ${
                isMobile ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
              }`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-1.5 pt-0 space-y-1.5' : 'p-2.5 pt-0 space-y-2.5'}`}>
          <div className={`grid grid-cols-2 ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
            <div>
              <p className={`text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Current Plan
              </p>
              <p className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                {subscription_tier ? subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1) : 'Free'}
              </p>
            </div>
            <div>
              <p className={`text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Messages Used
              </p>
              <p className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                {messages_used} / {message_limit}
              </p>
            </div>
          </div>
          
          {subscribed && subscription_end && (
            <div>
              <p className={`text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Next Billing Date
              </p>
              <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {new Date(subscription_end).toLocaleDateString()}
              </p>
            </div>
          )}

          {subscribed && (
            <Button 
              onClick={(e) => {
                if (isMobile && e.currentTarget) {
                  simulateHapticFeedback(e.currentTarget, 'medium');
                }
                handleManageSubscription();
              }}
              disabled={managing}
              className={`questionnaire-button-secondary touch-manipulation ${
                isMobile ? 'text-[13px] py-1 h-7' : 'text-sm py-1.5'
              }`}
            >
              <ExternalLink className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'}`} />
              {managing ? 'Opening...' : 'Manage Subscription'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className={isMobile ? 'mt-2' : ''}>
        <h3 className={`font-medium text-white px-1 ${
          isMobile ? 'text-sm mb-1.5' : 'text-base mb-1.5'
        }`}>Available Plans</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-3 gap-2.5'}`}>
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white/10 backdrop-blur-sm border transition-all duration-300 ${
                plan.current 
                  ? 'border-pink-400/50 bg-white/15' 
                  : 'border-white/20 hover:border-white/30'
              } ${isMobile ? 'plan-card' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className={`bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-full font-medium ${
                    isMobile ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-[3px] text-xs'
                  }`}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className={`text-center ${isMobile ? 'p-1.5' : 'p-2.5'}`}>
                {plan.icon && (
                  <div className="mx-auto mb-2 p-2 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/10 w-fit">
                    <plan.icon className={`questionnaire-text ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </div>
                )}
                <CardTitle className={`text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {plan.name}
                </CardTitle>
                <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {plan.price}
                  <span className={`font-normal text-white/60 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>/month</span>
                </div>
                <CardDescription className={`text-white/60 ${
                  isMobile ? 'text-xs leading-tight' : 'text-sm'
                }`}>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className={`${isMobile ? 'p-1.5 pt-0 space-y-1' : 'p-2.5 pt-0 space-y-1.5'}`}>
                <ul className={`${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`flex items-center gap-2 text-white/80 ${
                      isMobile ? 'text-xs leading-relaxed' : 'text-sm'
                    }`}>
                      <Check className={`text-green-400 ${isMobile ? 'h-2 w-2 flex-shrink-0' : 'h-3 w-3'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button 
                    disabled 
                    className={`w-full bg-green-500/20 text-green-400 border border-green-400/30 touch-manipulation ${
                      isMobile ? 'text-[13px] py-1 h-7 mt-2' : 'text-sm py-1.5 mt-3'
                    }`}
                  >
                    <Check className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
                    Current Plan
                  </Button>
                ) : plan.tier ? (
                  <Button 
                    onClick={(e) => {
                      if (isMobile && e.currentTarget) {
                        simulateHapticFeedback(e.currentTarget, 'medium');
                      }
                      handleUpgrade(plan.tier as 'grow' | 'thrive');
                    }}
                    disabled={upgrading === plan.tier}
                    className={`w-full questionnaire-button-primary touch-manipulation touch-feedback ${
                      isMobile ? 'text-[13px] py-1 h-7 mt-2' : 'text-sm py-1.5 mt-3'
                    }`}
                  >
                    <Zap className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
                    {upgrading === plan.tier ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    variant="outline"
                    className={`w-full bg-white/5 border-white/20 text-white/60 touch-manipulation ${
                      isMobile ? 'text-[13px] py-1 h-7 mt-2' : 'text-sm py-1.5 mt-3'
                    }`}
                  >
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage Warning */}
      {usagePercentage > 80 && !subscribed && (
        <Card className={`bg-orange-500/20 border border-orange-400/30 ${
          isMobile ? 'rounded-lg' : ''
        }`}>
          <CardContent className={isMobile ? 'p-1.5' : 'pt-5'}>
            <div className={`flex items-start ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
              <div className={`bg-orange-400 rounded-full animate-pulse flex-shrink-0 ${
                isMobile ? 'h-1.5 w-1.5 mt-0.5' : 'h-2 w-2 mt-1'
              }`} />
              <div className="min-w-0">
                <h4 className={`font-medium text-orange-200 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>Usage Alert</h4>
                <p className={`text-orange-300/80 ${
                  isMobile ? 'text-xs leading-tight' : 'text-sm'
                }`}>
                  You've used {Math.round(usagePercentage)}% of your monthly messages. 
                  {isMobile ? ' ' : ' '}Upgrade to continue chatting without interruption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountSubscription;