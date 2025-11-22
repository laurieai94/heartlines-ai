import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Users, Heart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ToastAction } from "@/components/ui/toast";
import DashboardHeader from "@/components/DashboardHeader";
import { pricingPlans } from "@/data/pricingPlans";
import PremiumBackground from "@/components/PremiumBackground";
import { SubscriptionStatusBanner } from "@/components/account/SubscriptionStatusBanner";
import { MobileHeaderVisibilityProvider } from '@/contexts/MobileHeaderVisibilityContext';
import { useCheckoutSuccess } from "@/hooks/useCheckoutSuccess";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
const faqs = [{
  question: "can i change or cancel my plan anytime?",
  answer: "yep. no contracts, no weird fine print. cancel, upgrade, or downgrade whenever you want."
}, {
  question: "what happens to unused messages?",
  answer: "they don't roll over — but think of it as a nudge to keep checking in with yourself (and others). growth happens in the using, not the saving. 😊"
}, {
  question: "is my data secure and private?",
  answer: "totally. everything's encrypted and locked down. your convos = your business, not ours."
}, {
  question: "do you offer refunds?",
  answer: "yup. we've got a 14-day money-back guarantee. if it's not your vibe, no stress."
}];
const Pricing = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const { subscription_tier, loading: subscriptionLoading } = useOptimizedSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  // Handle checkout success with shared hook
  useCheckoutSuccess();

  const isCurrentPlan = (planTier: string) => {
    if (!user) return false;
    // Wait for subscription data to load before comparing
    if (subscriptionLoading) return false;
    // Normalize tier comparison (subscription_tier might be null for freemium)
    const currentTier = subscription_tier || 'freemium';
    return currentTier.toLowerCase() === planTier.toLowerCase();
  };
  // Auto-trigger checkout if user just signed in with intended plan
  useEffect(() => {
    if (user) {
      const intendedPlanTier = localStorage.getItem('intended_plan_tier');
      const returnPath = localStorage.getItem('intended_plan_return');
      
      if (intendedPlanTier && returnPath === '/plans') {
        // Clear the stored values
        localStorage.removeItem('intended_plan_tier');
        localStorage.removeItem('intended_plan_return');
        
        // Find the plan and trigger checkout
        const plan = pricingPlans.find(p => p.tier === intendedPlanTier);
        if (plan) {
          // Small delay to ensure user sees they're signed in
          setTimeout(() => {
            handlePlanSelect(plan);
          }, 500);
        }
      }
    }
  }, [user]);

  const handlePlanSelect = async (plan: typeof pricingPlans[0]) => {
    if (!user) {
      // Store the intended plan tier in localStorage
      localStorage.setItem('intended_plan_tier', plan.tier);
      localStorage.setItem('intended_plan_return', '/plans');
      
      // Immediately navigate to sign-in page
      navigate('/signin', { state: { returnTo: '/plans', planTier: plan.tier } });
      return;
    }
    
    // User is signed in - handle plan selection
    if (plan.tier === "freemium") {
      // For free plan, navigate to coach with welcome message
      toast.success("welcome to begin!", {
        description: "you have 25 free messages to start your journey."
      });
      navigate("/coach");
      return;
    }
    
    setLoading(plan.tier);
    
    // Show immediate feedback
    toast.loading("creating checkout session...", {
      id: 'checkout-loading'
    });
    
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: plan.tier
        }
      });
      
      if (error) throw error;

      console.log('Checkout URL received:', data?.url);
      
      if (data?.url) {
        // Dismiss loading toast
        toast.dismiss('checkout-loading');
        
        // Show success and redirect
        toast.success("redirecting to checkout...", {
          description: "you'll be redirected to stripe in a moment",
          duration: 2000
        });
        
        // Use replace for more reliable redirect
        setTimeout(() => {
          window.location.replace(data.url);
        }, 500);
        
        // Fallback: Reset loading and show manual button if redirect fails
        setTimeout(() => {
          setLoading(null);
          toast.info("having trouble redirecting?", {
            description: "click below to open checkout manually",
            duration: 10000,
            action: <ToastAction altText="Open checkout" onClick={() => window.location.replace(data.url)}>
              Open Checkout
            </ToastAction>
          });
        }, 3000);
      } else {
        throw new Error('no checkout url returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.dismiss('checkout-loading');
      toast.error("error", {
        description: "failed to create checkout session. please try again."
      });
      setLoading(null);
    }
  };
  return <MobileHeaderVisibilityProvider>
    <div className="min-h-screen bg-burgundy-800 landing-page-scroll">
      <PremiumBackground />

      <DashboardHeader
        accessLevel="full" 
        profileCompletion={100}
        user={user}
        activeTab="plans"
        onValueChange={(tab) => {
          if (tab === 'profile') navigate('/profile');
          else if (tab === 'insights') navigate('/coach');
          else if (tab === 'home') navigate('/');
        }}
        onSignInClick={() => navigate('/signin')}
        onOpenProfile={() => navigate('/profile')}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-24 pb-12 lg:pt-28">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-8 lg:mb-10">
            <h1 className="font-brand text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent leading-none tracking-wider mb-6 md:mb-8 lg:mb-10" style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.6), 0 4px 20px rgba(251, 146, 60, 0.5), 0 8px 30px rgba(236, 72, 153, 0.3)'
            }}>
              choose your growth plan
            </h1>
            
            {/* Trust Badges - Inline */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base lg:text-lg text-white/90 tracking-wide">
              <div className="flex items-center gap-1.5">
                <Shield className="h-5 w-5 md:h-6 md:w-6" />
                <span>your data, your rules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-5 w-5 md:h-6 md:w-6" />
                <span>break up anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
                <span>built for humans, not rom-coms</span>
              </div>
            </div>
          </div>

          {/* Subscription Status Banner */}
          {user && (
            <div className="mb-8 md:mb-10 mt-2 md:mt-4">
              <SubscriptionStatusBanner />
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12 items-stretch">
            {pricingPlans.map(plan => {
            const IconComponent = plan.icon;
            return <Card key={plan.id} className={`flex flex-col h-full questionnaire-card rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-coral-400/50 scale-[1.02] questionnaire-card-glow' : ''}`}>
                  {plan.popular && <Badge className="absolute -top-3 lg:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-400 to-pink-400 text-white px-6 sm:px-6 lg:px-8 py-1 rounded-full border border-white/10 shadow-neon text-xs sm:text-sm font-medium whitespace-nowrap z-40">
                      most popular
                    </Badge>}
                  
                  <CardHeader className="text-center pb-2 md:pb-3 p-3 md:p-4">
                    <div className="mx-auto mb-2 md:mb-3 p-2 md:p-2.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border w-fit">
                      <IconComponent className="h-7 w-7 md:h-8 md:w-8 questionnaire-text" />
                    </div>
                    <CardTitle className="text-xl font-light questionnaire-text mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mb-1 md:mb-2">
                      <span className="text-4xl font-thin questionnaire-text">{plan.price}</span>
                      <span className="questionnaire-text-muted text-sm md:text-sm text-base">/{plan.period}</span>
                    </div>
                    <p className="questionnaire-text-muted text-sm md:text-xs leading-tight">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-3 md:space-y-4 p-3 md:p-4 pt-0">
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
                        onClick={() => handlePlanSelect(plan)} 
                        disabled={loading === plan.tier || isCurrentPlan(plan.tier)} 
                        className={`w-full rounded-full py-2.5 md:py-3 text-sm ${
                          isCurrentPlan(plan.tier)
                            ? 'opacity-50 cursor-not-allowed bg-white/5 text-white/40'
                            : plan.popular
                            ? 'questionnaire-button-primary'
                            : 'questionnaire-button-secondary'
                        }`}
                      >
                        {loading === plan.tier
                          ? "loading..."
                          : isCurrentPlan(plan.tier)
                          ? "current plan"
                          : plan.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-brand questionnaire-text text-center mb-6">
              faqs
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="questionnaire-card border-none">
                  <AccordionTrigger className="questionnaire-text text-sm font-medium px-4 py-3 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="questionnaire-text-muted text-xs leading-relaxed px-4 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  </MobileHeaderVisibilityProvider>;
};
export default Pricing;