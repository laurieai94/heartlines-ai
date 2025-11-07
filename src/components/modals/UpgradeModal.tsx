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
  const [upgrading, setUpgrading] = useState<string | null>(null);

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
      <DialogContent 
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-3xl lg:max-w-7xl max-h-[90vh] md:max-h-[96vh] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-burgundy-600/90 via-burgundy-700/85 to-burgundy-800/90 backdrop-blur-xl border-white/25 rounded-3xl p-4 sm:p-6 box-border"
        style={{ '--dialog-max-width': '112rem' } as React.CSSProperties}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-light text-white flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
            time to dive deeper?
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 md:mt-2 space-y-2 md:space-y-1.5">
          {/* Current Usage */}
          <Card className="backdrop-blur-xl rounded-2xl p-2.5 md:p-2 bg-gradient-to-br from-white/20 via-white/15 to-white/10 border border-white/30 shadow-lg w-full box-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">current plan</p>
                <p className="text-lg font-semibold text-white">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">messages used</p>
                <p className="text-lg font-semibold text-white">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-1.5 w-full bg-white/15 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-coral-400 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mx-auto items-stretch overflow-x-hidden">
            {reorderedPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.id === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/15 to-white/10 relative rounded-3xl shadow-3xl border border-white/30 transition-all duration-300 md:hover:-translate-y-2 flex flex-col w-full box-border ${
                    isPopular ? 'ring-2 ring-coral-400/50 border-coral-400/30' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-coral-400/50 border-coral-400/30' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-2 lg:-top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-coral-400 to-pink-400 text-white px-4 sm:px-5 lg:px-6 py-0.5 rounded-full text-xs font-semibold border border-white/10 whitespace-nowrap">
                        most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-3 md:p-3.5 lg:p-3 pb-5 md:pb-4 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-2 md:mb-2.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-gradient-to-r from-coral-400/30 to-pink-400/30 border border-white/30 flex items-center justify-center">
                        <plan.icon className="w-4 h-4 sm:w-5 sm:h-5 text-coral-400" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-base font-light text-white mb-1 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-1 text-center">
                      <span className="text-2xl font-thin text-white">{plan.price}</span>
                    </div>
                    <p className="text-white/60 text-xs mb-2 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-xs leading-tight mb-4 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-2 md:mb-2.5">
                      <div className="bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-lg border border-white/20 p-2.5 sm:p-3 text-center">
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-coral-400 to-pink-400 bg-clip-text text-transparent">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-2 md:mb-2.5 flex-1">
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
                      className={`w-full rounded-full text-sm font-semibold mt-auto ${
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

          <div className="text-center pt-2 md:pt-1">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white hover:bg-white/10 text-sm"
            >
              maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};