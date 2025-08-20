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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every relationship is unique. Find the coaching level that fits your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-primary shadow-elegant scale-105' 
                    : 'border-border/50'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-sm italic text-primary/80">
                    ✨ "{plan.tagline}"
                  </CardDescription>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-primary">
                      {plan.messages} messages
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={loading === plan.tier}
                    className={`w-full transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {loading === plan.tier ? "Loading..." : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Questions about our plans? We're here to help.
          </p>
          <Button variant="ghost" onClick={() => navigate("/dashboard/home")}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;