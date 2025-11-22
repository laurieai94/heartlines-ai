import { useState } from 'react';
import { Crown, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';
import { pricingPlans } from '@/data/pricingPlans';
const AccountSubscription = () => {
  const { isMobile } = useOptimizedMobile();
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
  const plans = pricingPlans.map(plan => ({
    name: plan.name,
    tier: plan.tier === 'freemium' ? null : plan.tier,
    price: plan.price,
    messages: plan.messages,
    description: plan.description,
    icon: plan.icon,
    features: plan.features,
    current: plan.tier === 'freemium' ? !subscribed && !subscription_tier : subscription_tier?.toLowerCase() === plan.tier,
    popular: plan.popular
  }));
  const handleUpgrade = async (tier: 'glow' | 'vibe') => {
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
    return <div className="space-y-6">
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
            {[1, 2, 3].map(i => <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader className="text-center space-y-2">
                  <Skeleton className="h-6 w-16 bg-white/10 mx-auto" />
                  <Skeleton className="h-8 w-20 bg-white/10 mx-auto" />
                  <Skeleton className="h-4 w-32 bg-white/10 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => <Skeleton key={j} className="h-4 w-full bg-white/10" />)}
                  </div>
                  <Skeleton className="h-10 w-full bg-white/10" />
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
  return <div className={`${isMobile ? 'space-y-2' : 'space-y-2.5'}`}>
      {/* Current Subscription Status */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
          <CardTitle className={`text-white flex items-center gap-2 ${isMobile ? 'text-base' : 'text-base'}`}>
            <Crown className={isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
            subscription status
          </CardTitle>
          
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-3 pt-0 space-y-3' : 'p-2.5 pt-0 space-y-2.5'}`}>
          <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-3'}`}>
            <div>
              <p className={`text-white/60 ${isMobile ? 'text-sm mb-1' : 'text-sm'}`}>
                current plan
              </p>
              <p className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-base'}`}>
                {subscription_tier ? subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1) : 'Free'}
              </p>
            </div>
            <div>
              <p className={`text-white/60 ${isMobile ? 'text-sm mb-1' : 'text-sm'}`}>
                messages used
              </p>
              <p className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-base'}`}>
                {messages_used} / {message_limit}
              </p>
            </div>
          </div>
          
          {subscribed && subscription_end && <div>
              <p className={`text-white/60 ${isMobile ? 'text-sm mb-1' : 'text-sm'}`}>
                next billing date
              </p>
              <p className={`text-white ${isMobile ? 'text-sm' : 'text-sm'}`}>
                {new Date(subscription_end).toLocaleDateString()}
              </p>
            </div>}

          {subscribed && <Button onClick={handleManageSubscription} disabled={managing} className={`questionnaire-button-secondary touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm py-1.5'}`}>
              <ExternalLink className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
              {managing ? 'opening...' : 'manage subscription'}
            </Button>}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className={isMobile ? 'mt-1' : ''}>
        <h3 className={`font-medium text-white px-1 ${isMobile ? 'text-sm mb-1.5' : 'text-base mb-1.5'}`}>available plans</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-4 gap-2.5 md:items-start'}`}>
          {plans.map(plan => {
            const matchingPlan = pricingPlans.find(p => p.tier === (plan.tier || 'freemium'));
            return <Card key={plan.name} className={`flex flex-col h-full questionnaire-card rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 ${plan.current ? 'ring-2 ring-coral-400/50 scale-[1.02] questionnaire-card-glow' : ''} ${isMobile ? 'plan-card' : ''}`}>
              {plan.popular && <Badge className="absolute -top-3 lg:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-400 to-pink-400 text-white px-6 sm:px-6 lg:px-8 py-1 rounded-full border border-white/10 shadow-neon text-xs sm:text-sm font-medium whitespace-nowrap z-40">
                  most popular
                </Badge>}
              
              <CardHeader className={`text-center pb-2 md:pb-3 ${isMobile ? 'p-3 md:p-4' : 'p-3 md:p-4'}`}>
                {plan.icon && <div className="mx-auto mb-2 md:mb-3 p-2 md:p-2.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border w-fit">
                    <plan.icon className={`questionnaire-text ${isMobile ? 'h-7 w-7 md:h-8 md:w-8' : 'h-7 w-7 md:h-8 md:w-8'}`} />
                  </div>}
                <CardTitle className={`text-xl font-light questionnaire-text mb-2`}>
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center gap-1 mb-1 md:mb-2">
                  <span className="text-4xl font-thin questionnaire-text">{plan.price}</span>
                  <span className="questionnaire-text-muted text-sm md:text-sm text-base">/month</span>
                </div>
                <p className="questionnaire-text-muted text-sm md:text-xs leading-tight">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className={`flex-1 flex flex-col space-y-3 md:space-y-4 ${isMobile ? 'p-3 md:p-4 pt-0' : 'p-3 md:p-4 pt-0'}`}>
                <div className="text-center py-1.5 md:py-2 bg-gradient-to-r from-coral-400/10 to-pink-400/10 rounded-lg border border-questionnaire-border/50">
                  <div className="text-lg font-light questionnaire-text">
                    {plan.messages === 0 ? '∞' : plan.messages} messages
                  </div>
                  <div className="text-xs questionnaire-text-muted">per month</div>
                </div>

                <ul className="space-y-1.5 md:space-y-2 flex-1">
                  {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-coral-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-xs questionnaire-text-muted leading-relaxed">{feature}</span>
                    </li>)}
                </ul>
                
                <div className="mt-auto">
                  <Button 
                    variant="ghost" 
                    onClick={plan.tier ? () => handleUpgrade(plan.tier as 'glow' | 'vibe') : undefined} 
                    disabled={plan.current || upgrading === plan.tier || !plan.tier} 
                    className={`w-full rounded-full py-2.5 md:py-3 text-sm ${
                      plan.current
                        ? 'opacity-50 cursor-not-allowed bg-white/5 text-white/40'
                        : plan.popular
                        ? 'questionnaire-button-primary'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                {upgrading !== null && upgrading === plan.tier
                  ? "loading..."
                  : plan.current
                  ? "current plan"
                  : matchingPlan?.buttonText || `upgrade to ${plan.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>;
          })}
        </div>
      </div>

      {/* Usage Warning */}
      {usagePercentage > 80 && !subscribed && <Card className={`bg-orange-500/20 border border-orange-400/30 ${isMobile ? 'rounded-lg' : ''}`}>
          <CardContent className={isMobile ? 'p-3' : 'pt-5'}>
            <div className={`flex items-start ${isMobile ? 'gap-2.5' : 'gap-3'}`}>
              <div className={`bg-orange-400 rounded-full animate-pulse flex-shrink-0 ${isMobile ? 'h-2 w-2 mt-1' : 'h-2 w-2 mt-1'}`} />
              <div className="min-w-0">
                <h4 className={`font-medium text-orange-200 ${isMobile ? 'text-base mb-1' : 'text-sm'}`}>usage alert</h4>
                <p className={`text-orange-300/80 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                  you've used {Math.round(usagePercentage)}% of your monthly messages. 
                  {isMobile ? ' ' : ' '}upgrade to continue chatting without interruption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default AccountSubscription;