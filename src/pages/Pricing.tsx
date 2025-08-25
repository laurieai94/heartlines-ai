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


const pricingPlans = [
  {
    id: "begin",
    name: "Begin",
    price: "$0",
    period: "month",
    description: "Light check-ins to start building awareness",
    tagline: "From first steps to stronger bonds",
    messages: 25,
    icon: Sparkles,
    features: [
      "25 messages per month",
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
    messages: 100,
    icon: Heart,
    features: [
      "100 messages per month",
      "Advanced relationship coaching",
      "Conversation starters & reminders",
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
        
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-thin questionnaire-text mb-4">
              Choose Your Growth Plan
            </h1>
            <p className="text-xl questionnaire-text-muted font-light max-w-2xl mx-auto">
              Every relationship is unique. Find the coaching level that fits your journey.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
            <div className="flex items-center gap-2 questionnaire-text-muted">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 questionnaire-text-muted">
              <Star className="h-5 w-5" />
              <span className="text-sm">14-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2 questionnaire-text-muted">
              <Users className="h-5 w-5" />
              <span className="text-sm">10,000+ Happy Couples</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
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
                  
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border w-fit">
                      <IconComponent className="h-6 w-6 questionnaire-text" />
                    </div>
                    <CardTitle className="text-2xl font-light questionnaire-text">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-thin questionnaire-text">{plan.price}</span>
                      <span className="questionnaire-text-muted">/{plan.period}</span>
                    </div>
                    <p className="questionnaire-text-muted text-sm">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-2xl font-light questionnaire-text">
                        {plan.messages} messages
                      </div>
                      <div className="text-sm questionnaire-text-muted">per month</div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-coral-400 flex-shrink-0" />
                          <span className="text-sm questionnaire-text-muted">{feature}</span>
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

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-thin questionnaire-text text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="questionnaire-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium questionnaire-text mb-2">
                      {faq.question}
                    </h3>
                    <p className="questionnaire-text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-12">
            <div className="questionnaire-card rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-coral-400 text-coral-400" />
                ))}
              </div>
              <p className="questionnaire-text-muted italic mb-4">
                "RealTalk has transformed how my partner and I communicate. We've never been closer!"
              </p>
              <p className="questionnaire-text text-sm">— Sarah & Mike, Grow plan subscribers</p>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="rounded-full questionnaire-text-muted hover:questionnaire-text questionnaire-button-ghost"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;