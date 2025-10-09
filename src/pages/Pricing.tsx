import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Users, Heart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { pricingPlans } from "@/data/pricingPlans";
const faqs = [{
  question: "Can I change or cancel my plan anytime?",
  answer: "Yep. No contracts, no weird fine print. Cancel, upgrade, or downgrade whenever you want."
}, {
  question: "What happens to unused messages?",
  answer: "They don't roll over — but think of it as a nudge to keep checking in with yourself (and others). Growth happens in the using, not the saving. 😊"
}, {
  question: "Is my data secure and private?",
  answer: "Totally. Everything's encrypted and locked down. Your convos = your business, not ours."
}, {
  question: "Do you offer refunds?",
  answer: "Yup. We've got a 14-day money-back guarantee. If it's not your vibe, no stress."
}];
const Pricing = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
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
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: plan.tier
        }
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
  return <div className="min-h-screen bg-burgundy-900 overflow-y-auto">
      <div className="relative z-10">
        <SimpleHeader user={user} activeTab="plans" onSignInClick={() => navigate('/signin')} />
        
        <div className="container mx-auto px-4 pt-20 pb-6 lg:pt-24">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-brand questionnaire-text mb-3">
              Choose Your Growth Plan
            </h1>
            
            {/* Trust Badges - Inline */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs questionnaire-text-muted">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span>Your data, your rules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>Break up anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Built for humans, not rom-coms</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            {pricingPlans.map(plan => {
            const IconComponent = plan.icon;
            return <Card key={plan.id} className={`questionnaire-card rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-coral-400/50 scale-[1.02] questionnaire-card-glow' : ''}`}>
                  {plan.popular && <Badge className="absolute -top-3 lg:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral-400 to-pink-400 text-white px-6 sm:px-6 lg:px-8 py-1 rounded-full border border-white/10 shadow-neon text-xs sm:text-sm font-medium whitespace-nowrap z-40">
                      Most Popular
                    </Badge>}
                  
                  <CardHeader className="text-center pb-3 p-4">
                    <div className="mx-auto mb-3 p-2.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border w-fit">
                      <IconComponent className="h-8 w-8 questionnaire-text" />
                    </div>
                    <CardTitle className="text-xl font-light questionnaire-text mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-thin questionnaire-text">{plan.price}</span>
                      <span className="questionnaire-text-muted text-sm md:text-sm text-base">/{plan.period}</span>
                    </div>
                    <p className="questionnaire-text-muted text-sm md:text-xs leading-tight">
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
                      {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-coral-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-xs questionnaire-text-muted leading-relaxed">{feature}</span>
                        </li>)}
                    </ul>

                    <Button variant="ghost" onClick={() => handlePlanSelect(plan)} disabled={loading === plan.tier} className={`w-full rounded-full py-3 text-sm mt-6 ${plan.popular ? 'questionnaire-button-primary' : 'questionnaire-button-secondary'}`}>
                      {loading === plan.tier ? "Loading..." : plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-brand questionnaire-text text-center mb-6">
              FAQs
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

        <SiteFooter />
      </div>
    </div>;
};
export default Pricing;