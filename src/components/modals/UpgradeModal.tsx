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
  currentTier = 'begin',
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
      <DialogContent className="max-w-7xl max-h-[85vh] overflow-hidden bg-burgundy-800 border-white/20 rounded-3xl p-2 sm:p-3">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-light text-white flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-coral-300" />
            time to dive deeper?
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(85vh-80px)] overflow-y-auto px-2 sm:px-3 pb-2">
          <div className="space-y-2">
          {/* Current Usage */}
          <Card className="questionnaire-card p-2 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">current plan</p>
                <p className="text-sm font-semibold text-white">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/70">messages used</p>
                <p className="text-sm font-semibold text-white">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-1 w-full bg-white/15 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-coral-300 to-pink-400 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 max-w-7xl mx-auto items-stretch">
            {allPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.tier === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`questionnaire-card relative rounded-2xl shadow-2xl border border-white/30 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    isPopular ? 'ring-2 ring-coral-300/60' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-coral-300/60' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-coral-400 to-pink-400 text-white px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] font-bold border border-white/20 whitespace-nowrap shadow-lg">
                        most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-1.5 sm:p-2 pb-2.5 sm:pb-3 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-1.5">
                      <div className="w-7 h-7 mx-auto rounded-full bg-gradient-to-r from-coral-400/30 to-pink-400/30 border border-white/25 flex items-center justify-center">
                        <plan.icon className="w-3.5 h-3.5 text-coral-300" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-xs sm:text-sm font-medium text-white mb-0.5 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-0.5 text-center">
                      <span className="text-lg sm:text-xl font-semibold text-white">{plan.price}</span>
                    </div>
                    <p className="text-white/80 text-[10px] mb-1.5 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="text-white/80 text-[10px] leading-snug mb-2 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-1.5">
                      <div className="bg-gradient-to-r from-coral-400/15 to-pink-400/15 rounded-lg border border-white/15 p-1.5 text-center">
                        <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-coral-300 to-pink-300 bg-clip-text text-transparent">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="text-[9px] text-white/60 mt-0.5">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-0.5 sm:space-y-1 mb-2 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-coral-300 flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] sm:text-xs text-white/80 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                      disabled={upgrading !== null || isCurrent || !canUpgrade}
                      className={`w-full rounded-full text-[11px] sm:text-xs font-semibold mt-auto py-1.5 ${
                        isPopular || isRecommended 
                          ? 'questionnaire-button-primary shadow-md' 
                          : 'questionnaire-button-secondary'
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

          <div className="text-center pt-1">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 text-[11px] sm:text-xs py-1.5"
            >
              maybe later
            </Button>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};