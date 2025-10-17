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
        return "your free messages are done, but your story's just getting started.";
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-burgundy-900 border-white/20 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-white flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-coral-400" />
            you've been opening up (big fan of that) — time to go deeper?
          </DialogTitle>
          <DialogDescription className="text-sm text-white/70 mt-2 text-center">
            {getReasonMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {/* Current Usage */}
          <Card className="questionnaire-card p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Current Plan</p>
                <p className="text-lg font-semibold text-white capitalize">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Messages Used</p>
                <p className="text-lg font-semibold text-white">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-coral-400 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto items-stretch">
            {allPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.tier === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`questionnaire-card relative rounded-3xl shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                    isPopular ? 'ring-2 ring-coral-400/50' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-coral-400/50' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-2 lg:-top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-coral-400 to-pink-400 text-white px-4 sm:px-5 lg:px-6 py-0.5 rounded-full text-xs font-semibold border border-white/10 whitespace-nowrap">
                        most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/20 flex items-center justify-center">
                        <plan.icon className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-lg font-light text-white mb-1 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-1 text-center">
                      <span className="text-3xl font-thin text-white">{plan.price}</span>
                    </div>
                    <p className="text-white/60 text-xs mb-3 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-xs leading-tight mb-4 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-coral-400/10 to-pink-400/10 rounded-lg border border-white/10 p-3 sm:p-4 text-center">
                        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-coral-400 to-pink-400 bg-clip-text text-transparent">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-4 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-coral-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-white/70 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                      disabled={upgrading !== null || isCurrent || !canUpgrade}
                      className={`w-full rounded-full text-sm font-semibold ${
                        isPopular || isRecommended 
                          ? 'bg-gradient-to-r from-coral-400 to-pink-500 text-white hover:from-coral-500 hover:to-pink-600 shadow-lg' 
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {upgrading === plan.tier ? 'processing...' : 
                       isCurrent ? 'current plan' :
                       !canUpgrade ? 'not available' :
                       plan.buttonText}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center pt-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white text-sm"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};