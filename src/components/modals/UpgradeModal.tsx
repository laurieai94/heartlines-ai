import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingPlans } from "@/data/pricingPlans";
import { Check, Sparkles, Zap } from "lucide-react";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
import { useState } from "react";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier?: string;
  messagesUsed?: number;
  messageLimit?: number;
  reason?: 'limit-reached' | 'near-limit' | 'upgrade';
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  currentTier = 'freemium',
  messagesUsed = 0,
  messageLimit = 50,
  reason = 'upgrade'
}: UpgradeModalProps) => {
  const { upgrade } = useOptimizedSubscription();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  // Get all plans in display order
  const allPlans = pricingPlans.filter(p => ['begin', 'glow', 'vibe', 'unlimited'].includes(p.id));
  
  const usagePercentage = (messagesUsed / messageLimit) * 100;

  const handleUpgrade = async (tier: 'glow' | 'vibe' | 'unlimited') => {
    setUpgrading(tier);
    try {
      await upgrade(tier);
    } catch (error) {
      toast.error("Failed to start upgrade. Please try again.");
      setUpgrading(null);
    }
  };

  const getReasonMessage = () => {
    switch (reason) {
      case 'limit-reached':
        return `you've reached your ${messageLimit} message limit. upgrade to continue your journey.`;
      case 'near-limit':
        return `you're using ${messagesUsed} of ${messageLimit} messages. upgrade to keep the conversation flowing.`;
      default:
        return "choose the plan that matches your relationship goals.";
    }
  };

  const getRecommendedTier = () => {
    if (currentTier === 'unlimited') return null;
    if (currentTier === 'vibe') return null;
    if (usagePercentage > 80) return 'vibe';
    return 'glow';
  };

  const recommendedTier = getRecommendedTier();
  
  const tierOrder = ['begin', 'glow', 'vibe', 'unlimited'];
  const currentTierIndex = tierOrder.indexOf(currentTier);
  
  const canUpgradeTo = (planTier: string) => {
    const planIndex = tierOrder.indexOf(planTier);
    return planIndex > currentTierIndex;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto questionnaire-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light questionnaire-text flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-coral-400" />
            upgrade your journey
          </DialogTitle>
          <DialogDescription className="text-base questionnaire-text-muted mt-2 text-center">
            {getReasonMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Current Usage */}
          <Card className="questionnaire-card p-4 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm questionnaire-text-muted">Current Plan</p>
                <p className="text-xl font-semibold questionnaire-text capitalize">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-sm questionnaire-text-muted">Messages Used</p>
                <p className="text-xl font-semibold questionnaire-text">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-coral-400 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {allPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.tier === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`questionnaire-card relative rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                    isPopular ? 'questionnaire-card-glow ring-2 ring-coral-400/50' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-coral-400/50' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 lg:-top-5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-coral-400 to-pink-400 text-white px-6 sm:px-6 lg:px-8 py-1 rounded-full text-xs sm:text-sm font-semibold border border-white/10 shadow-neon whitespace-nowrap">
                        most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-6 sm:mb-8">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-questionnaire-border flex items-center justify-center">
                        <plan.icon className="w-7 h-7 sm:w-8 sm:h-8 text-coral-400" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-xl font-light questionnaire-text mb-2 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-2 text-center">
                      <span className="text-4xl font-thin questionnaire-text">{plan.price}</span>
                    </div>
                    <p className="questionnaire-text-muted text-sm mb-4 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="questionnaire-text-muted text-sm leading-tight mb-6 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-6 sm:mb-8">
                      <div className="bg-gradient-to-r from-coral-400/10 to-pink-400/10 rounded-lg border border-questionnaire-border/50 p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl font-light questionnaire-text mb-1">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="questionnaire-text-muted text-xs">
                          messages per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6 sm:mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-coral-400 flex-shrink-0 mt-1" />
                          <span className="text-sm questionnaire-text-muted leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                      disabled={upgrading !== null || isCurrent || !canUpgrade}
                      className={`w-full rounded-full ${
                        isPopular || isRecommended 
                          ? 'questionnaire-button-primary' 
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {upgrading === plan.tier ? 'processing...' : 
                       isCurrent ? 'current plan' :
                       !canUpgrade ? 'not available' :
                       `upgrade to ${plan.name.toLowerCase()}`}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="questionnaire-text-muted hover:questionnaire-text"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};