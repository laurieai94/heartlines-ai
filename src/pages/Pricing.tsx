import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Heart, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const pricingPlans = [
  {
    id: "begin",
    name: "Begin",
    price: "$0",
    period: "month",
    description: "Light check-ins to start building awareness",
    tagline: "From first steps to stronger bonds.",
    messages: 25,
    icon: Sparkles,
    features: [
      "25 messages per month",
      "Basic relationship insights",
      "Try-before-you-commit"
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
    tagline: "Build momentum in your relationship.",
    messages: 100,
    icon: Heart,
    features: [
      "100 messages per month",
      "Advanced relationship coaching",
      "Conversation starters & reminders",
      "Progress tracking"
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
    tagline: "Turn insights into transformation.",
    messages: 300,
    icon: Zap,
    features: [
      "300 messages per month (~10 per day)",
      "Priority AI coaching",
      "Unlimited conversation scenarios",
      "Advanced insights & analytics",
      "Custom relationship goals"
    ],
    buttonText: "Start Thriving",
    popular: false,
    tier: "thrive"
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof pricingPlans[0]) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    if (plan.tier === "freemium") {
      navigate("/dashboard/home");
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
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-700">
      {/* Animated background overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-coral-600/30 via-coral-500/20 to-coral-500/25 animate-gradient" />
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-400/10 via-coral-400/10 to-coral-600/10 animate-gradient delay-1000" />
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/10 via-coral-400/5 to-burgundy-600/10 animate-gradient delay-2000" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-thin text-white mb-4">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-gray-300/90 font-light max-w-2xl mx-auto">
            Every relationship is unique. Find the coaching level that fits your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`glass rounded-3xl border-white/10 shadow-3xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-3xl ${
                  plan.popular 
                    ? 'ring-1 ring-pink-400/30 scale-[1.02]' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-400 to-pink-400 text-white px-4 py-1 rounded-full border border-white/10 shadow-neon text-sm">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/10 w-fit">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-light text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-thin text-white">{plan.price}</span>
                    <span className="text-pink-200/70">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-sm italic text-coral-200">
                    ✨ "{plan.tagline}"
                  </CardDescription>
                  <p className="text-gray-300/90 text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-light text-white">
                      {plan.messages} messages
                    </div>
                    <div className="text-sm text-pink-200/70">per month</div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-coral-300 flex-shrink-0" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={loading === plan.tier}
                    className={`w-full rounded-full py-5 text-base ${
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

        <div className="text-center mt-16">
          <p className="text-pink-200/70 mb-4">
            Questions about our plans? We're here to help.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard/home")}
            className="rounded-full text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;