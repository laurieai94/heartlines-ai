import { useState } from 'react';
import { Crown, RefreshCw, ExternalLink, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { toast } from 'sonner';

const AccountSubscription = () => {
  
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
    <div className="space-y-2.5">
      {/* Current Subscription Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Crown className="h-3.5 w-3.5" />
                Subscription Status
              </CardTitle>
              <CardDescription className="text-white/60 text-xs">
                Current plan and usage information
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              disabled={loading}
              className="text-white/70 hover:text-white hover:bg-white/10 h-7 w-7 p-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/60">Current Plan</p>
              <p className="text-sm font-semibold text-white">
                {subscription_tier ? subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1) : 'Free'}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Messages Used</p>
              <p className="text-sm font-semibold text-white">
                {messages_used} / {message_limit}
              </p>
            </div>
          </div>
          
          {subscribed && subscription_end && (
            <div>
              <p className="text-xs text-white/60">Next Billing Date</p>
              <p className="text-white text-xs">{new Date(subscription_end).toLocaleDateString()}</p>
            </div>
          )}

          {subscribed && (
            <Button 
              onClick={handleManageSubscription}
              disabled={managing}
              className="questionnaire-button-secondary text-xs py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              {managing ? 'Opening...' : 'Manage Subscription'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1.5 px-1">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white/10 backdrop-blur-sm border transition-all duration-300 ${
                plan.current 
                  ? 'border-pink-400/50 bg-white/15' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-coral-500 text-white px-2.5 py-[3px] rounded-full text-[10px] font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center p-2.5">
                <CardTitle className="text-white text-sm">{plan.name}</CardTitle>
                <div className="text-lg font-bold text-white">
                  {plan.price}
                  <span className="text-[11px] font-normal text-white/60">/month</span>
                </div>
                <CardDescription className="text-white/60 text-xs">
                  {plan.messages} messages per month
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-2.5 pt-0 space-y-1.5">
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1.5 text-xs text-white/80">
                      <Check className="h-3 w-3 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button 
                    disabled 
                    className="w-full bg-green-500/20 text-green-400 border border-green-400/30 mt-3 text-xs py-1.5"
                  >
                    <Check className="h-3 w-3 mr-1.5" />
                    Current Plan
                  </Button>
                ) : plan.tier ? (
                  <Button 
                    onClick={() => handleUpgrade(plan.tier as 'grow' | 'thrive')}
                    disabled={upgrading === plan.tier}
                    className="w-full questionnaire-button-primary mt-3 text-xs py-1.5"
                  >
                    <Zap className="h-3 w-3 mr-1.5" />
                    {upgrading === plan.tier ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white/60 mt-3 text-xs py-1.5"
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
        <Card className="bg-orange-500/20 border border-orange-400/30">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
              <div>
                <h4 className="font-medium text-orange-200 text-xs">Usage Alert</h4>
                <p className="text-xs text-orange-300/80">
                  You've used {Math.round(usagePercentage)}% of your monthly messages. 
                  Upgrade to continue chatting without interruption.
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