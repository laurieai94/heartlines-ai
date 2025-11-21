import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingPlans } from "@/data/pricingPlans";
import { Check, Clock, Zap } from "lucide-react";
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

  // Get all plans in display order
  const allPlans = pricingPlans.filter(p => ['begin', 'glow', 'vibe', 'unlimited'].includes(p.id));
  
  // Reorder plans to show current plan last
  const reorderedPlans = [...allPlans].sort((a, b) => {
    const aIsCurrent = a.id === currentTier;
    const bIsCurrent = b.id === currentTier;
    
    if (aIsCurrent) return 1;  // Move current plan to end
    if (bIsCurrent) return -1;
    return 0; // Keep other plans in original order
  });
  
  const usagePercentage = (messagesUsed / messageLimit) * 100;

  const handleUpgrade = async (tier: 'glow' | 'vibe' | 'unlimited') => {
    try {
      await upgrade(tier);
    } catch (error) {
      toast.error("Failed to start upgrade. Please try again.");
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
      <DialogContent 
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-3xl lg:max-w-5xl max-h-[92vh] md:max-h-[90vh] lg:max-h-[88vh] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-burgundy-600/90 via-burgundy-700/85 to-burgundy-800/90 backdrop-blur-xl border-white/25 rounded-3xl p-3 sm:p-4 box-border"
        style={{ '--dialog-max-width': '112rem' } as React.CSSProperties}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-light text-white flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
            time to dive deeper?
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 space-y-4 md:space-y-5 lg:space-y-6 pb-2">
          {/* Current Usage */}
          <Card className="backdrop-blur-xl rounded-2xl p-2.5 md:p-3 bg-gradient-to-br from-white/35 via-white/30 to-white/25 border border-white/50 shadow-xl w-full box-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80">current plan</p>
                <p className="text-lg font-semibold text-white">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/80">messages used</p>
                <p className="text-lg font-semibold text-white">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-1 w-full bg-white/25 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-coral-400 to-pink-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 md:gap-2.5 lg:gap-3 w-full mx-auto items-stretch overflow-x-hidden mt-8 md:mt-9">
            {reorderedPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.id === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`backdrop-blur-xl bg-gradient-to-br from-white/35 via-white/30 to-white/25 relative rounded-3xl shadow-2xl border border-white/50 transition-all duration-300 will-change-transform md:hover:-translate-y-2 flex flex-col w-full box-border ${
                    isPopular ? 'ring-2 ring-coral-400/60 border-coral-400/40' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-coral-400/60 border-coral-400/40' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute top-3 md:top-3.5 left-1/2 -translate-x-1/2 z-20 animate-pulse">
                      <span className="bg-gradient-to-r from-coral-400 via-pink-400 to-coral-400 text-white px-5 sm:px-6 lg:px-7 py-1 rounded-full text-sm font-bold border-2 border-white/50 shadow-[0_0_20px_rgba(251,146,140,0.6),0_0_40px_rgba(251,146,140,0.4)] whitespace-nowrap">
                        ✨ most popular ✨
                      </span>
                    </div>
                  )}
                  
                  <div className="p-3 md:p-3.5 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-1.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full bg-gradient-to-r from-coral-400/40 to-pink-400/40 border border-white/40 shadow-md flex items-center justify-center">
                        <plan.icon className="w-4 h-4 sm:w-5 sm:h-5 text-coral-400" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-base font-light text-white mb-0.5 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-0.5 text-center">
                      <span className="text-2xl font-thin text-white">{plan.price}</span>
                    </div>
                    <p className="text-white/80 text-xs mb-1.5 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="text-white/80 text-xs leading-tight mb-2 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-1.5">
                      <div className="bg-gradient-to-r from-coral-400/35 to-pink-400/35 rounded-lg border border-white/40 shadow-md p-2 text-center">
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-coral-400 to-pink-400 bg-clip-text text-transparent">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="text-xs text-white/70 mt-1">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1 mb-1.5 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-coral-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-white/85 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                      disabled={false}
                      className={`w-full rounded-full text-sm font-semibold mt-auto ${
                        isPopular || isRecommended 
                          ? 'bg-gradient-to-r from-coral-400 to-pink-500 text-white hover:from-coral-500 hover:to-pink-600 shadow-lg' 
                          : 'bg-white/15 text-white hover:bg-white/25 border border-white/30'
                      }`}
                    >
                  {isCurrent ? 'current plan' :
                   !canUpgrade ? 'not available' :
                   plan.buttonText}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};