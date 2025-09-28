import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Heart, Zap, Shield, Star, Users, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import DashboardHeader from "@/components/DashboardHeader";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";


const pricingPlans = [
  {
    id: "begin",
    name: "Begin",
    price: "$0",
    period: "month",
    description: "Light check-ins to start building awareness",
    tagline: "From first steps to stronger bonds",
    messages: 50,
    icon: Sparkles,
    features: [
      "50 messages per month",
      "Basic relationship insights",
      "Try-before-you-commit approach",
      "Email support"
    ],
    buttonText: "Get Started Free",
    popular: false,
    tier: "freemium"
  },
  {
    id: "grow",
    name: "Grow",
    price: "$15",
    period: "month", 
    description: "Steady coaching to strengthen daily connection",
    tagline: "Build momentum in your relationship",
    messages: 150,
    icon: Heart,
    features: [
      "150 messages per month",
      "Advanced relationship coaching", 
      "Conversation starters",
      "Progress tracking",
      "Priority support"
    ],
    buttonText: "Start Growing",
    popular: true,
    tier: "grow"
  },
  {
    id: "thrive",
    name: "Thrive", 
    price: "$29",
    period: "month",
    description: "Ongoing guidance for deeper conversations and lasting growth",
    tagline: "Turn insights into transformation",
    messages: 300,
    icon: Zap,
    features: [
      "300 messages per month (~10 per day)",
      "Priority AI coaching",
      "Unlimited conversation scenarios",
      "Advanced insights & analytics",
      "Custom relationship goals",
      "Premium support"
    ],
    buttonText: "Start Thriving",
    popular: false,
    tier: "thrive"
  }
];

const faqs = [
  {
    question: "Can I change or cancel my plan anytime?",
    answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect at your next billing cycle."
  },
  {
    question: "What happens to unused messages?",
    answer: "Unused messages don't roll over to the next month. Each plan resets your message count monthly to encourage consistent relationship growth."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use enterprise-grade encryption and never share your personal conversations. Your privacy and trust are our top priority."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund within the first two weeks."
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof pricingPlans[0]) => {
    if (!user) {
      toast.error("Please sign in", {
        description: "You need to sign in to subscribe to a plan."
      });
      return;
    }

    if (plan.tier === "freemium") {
      navigate("/");
      return;
    }

    setLoading(plan.tier);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier: plan.tier }
      });

      if (error) throw error;

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Error", {
        description: "Failed to create checkout session. Please try again."
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <MobileHeaderVisibilityProvider>
      <div className="min-h-screen bg-burgundy-900">
      <div className="relative z-10">
        <DashboardHeader 
          accessLevel="freemium"
          profileCompletion={0}
          compact={false}
          user={user}
          activeTab="pricing"
          onValueChange={(tab) => {
            if (tab === 'home') navigate('/');
            else if (tab === 'profile') navigate('/profile');
            else if (tab === 'insights') navigate('/coach');
            else if (tab === 'mission') navigate('/mission');
          }}
          onSignInClick={() => navigate('/auth')}
          onOpenProfile={() => navigate('/profile')}
        />
        
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-thin questionnaire-text mb-3">
              Choose Your Growth Plan
            </h1>
            <p className="text-lg questionnaire-text-muted font-light max-w-2xl mx-auto mb-4">
              Every relationship is unique. Find the coaching level that fits your journey.
            </p>
            {/* Trust Badges - Inline */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs questionnaire-text-muted">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>14-Day Money Back</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>10,000+ Happy Couples</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id} 
                  className={`questionnaire-card rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 ${
                    plan.popular 
                      ? 'ring-2 ring-coral-400/50 scale-[1.02] questionnaire-card-glow' 
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-400 to-pink-400 text-white px-4 py-1 rounded-full border border-white/10 shadow-neon text-sm">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-3 p-4">
                    <div className="mx-auto mb-3 p-2.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border w-fit">
                      <IconComponent className="h-5 w-5 questionnaire-text" />
                    </div>
                    <CardTitle className="text-xl font-light questionnaire-text mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-thin questionnaire-text">{plan.price}</span>
                      <span className="questionnaire-text-muted text-sm">/{plan.period}</span>
                    </div>
                    <p className="questionnaire-text-muted text-xs leading-tight">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 p-4 pt-0">
                    <div className="text-center py-2 bg-gradient-to-r from-coral-400/10 to-pink-400/10 rounded-lg border border-questionnaire-border/50">
                      <div className="text-lg font-light questionnaire-text">
                        {plan.messages} messages
                      </div>
                      <div className="text-xs questionnaire-text-muted">per month</div>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-coral-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs questionnaire-text-muted leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      disabled={loading === plan.tier}
                      className={`w-full rounded-full py-3 text-sm ${
                        plan.popular 
                          ? 'questionnaire-button-primary' 
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {loading === plan.tier ? "Loading..." : plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-thin questionnaire-text text-center mb-6">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="questionnaire-card">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium questionnaire-text mb-1">
                      {faq.question}
                    </h3>
                    <p className="questionnaire-text-muted text-xs leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              size="sm"
              className="rounded-full questionnaire-text-muted hover:questionnaire-text questionnaire-button-ghost text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
    </MobileHeaderVisibilityProvider>
  );
};

export default Pricing;