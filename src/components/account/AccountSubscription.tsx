import { useState } from 'react';
import { Crown, RefreshCw, ExternalLink, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const AccountSubscription = () => {
  const { toast } = useToast();
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
  } = useSubscription();
  
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [managing, setManaging] = useState(false);

  const plans = [
    {
      name: 'Free',
      tier: null,
      price: '$0',
      messages: 25,
      features: ['Basic AI coaching', '25 messages/month', 'Community support'],
      current: !subscribed && !subscription_tier
    },
    {
      name: 'Grow',
      tier: 'grow',
      price: '$15',
      messages: 100,
      features: ['Everything in Free', '100 messages/month', 'Priority support', 'Advanced insights'],
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
      toast({
        title: 'Redirecting to checkout',
        description: 'Opening Stripe checkout in a new tab...'
      });
    } catch (error) {
      toast({
        title: 'Upgrade failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageSubscription = async () => {
    setManaging(true);
    try {
      await manageSubscription();
      toast({
        title: 'Opening customer portal',
        description: 'Manage your subscription in a new tab...'
      });
    } catch (error) {
      toast({
        title: 'Failed to open portal',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setManaging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Status
              </CardTitle>
              <CardDescription className="text-white/60">
                Current plan and usage information
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              disabled={loading}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60">Current Plan</p>
              <p className="text-lg font-semibold text-white">
                {subscription_tier ? subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1) : 'Free'}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Messages Used</p>
              <p className="text-lg font-semibold text-white">
                {messages_used} / {message_limit}
              </p>
            </div>
          </div>
          
          {subscribed && subscription_end && (
            <div>
              <p className="text-sm text-white/60">Next Billing Date</p>
              <p className="text-white">{new Date(subscription_end).toLocaleDateString()}</p>
            </div>
          )}

          {subscribed && (
            <Button 
              onClick={handleManageSubscription}
              disabled={managing}
              className="questionnaire-button-secondary"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {managing ? 'Opening...' : 'Manage Subscription'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-coral-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-white">
                  {plan.price}
                  <span className="text-sm font-normal text-white/60">/month</span>
                </div>
                <CardDescription className="text-white/60">
                  {plan.messages} messages per month
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="h-4 w-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button 
                    disabled 
                    className="w-full bg-green-500/20 text-green-400 border border-green-400/30"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : plan.tier ? (
                  <Button 
                    onClick={() => handleUpgrade(plan.tier as 'grow' | 'thrive')}
                    disabled={upgrading === plan.tier}
                    className="w-full questionnaire-button-primary"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {upgrading === plan.tier ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white/60"
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
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
              <div>
                <h4 className="font-medium text-orange-200">Usage Alert</h4>
                <p className="text-sm text-orange-300/80">
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