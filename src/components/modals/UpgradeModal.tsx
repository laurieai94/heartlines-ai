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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-pink-50 to-orange-50 border-orange-200/60 p-2 sm:p-3">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-light text-burgundy-900 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-coral-500" />
            time to dive deeper?
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-1.5">
          {/* Current Usage */}
          <Card className="bg-white/95 backdrop-blur-sm border border-orange-200/60 p-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-burgundy-600">current plan</p>
                <p className="text-base font-semibold text-burgundy-900 capitalize">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-burgundy-600">messages used</p>
                <p className="text-base font-semibold text-burgundy-900">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-1 w-full bg-orange-100 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-orange-400 to-pink-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-stretch">
            {allPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.tier === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <div key={plan.id} className="relative">
                  {isPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-3 sm:px-4 py-0.5 rounded-full text-[10px] font-bold border border-white/40 whitespace-nowrap shadow-md">
                        most popular
                      </span>
                    </div>
                  )}
                  <Card 
                    className={`bg-white/95 backdrop-blur-sm border border-orange-200/60 relative rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
                      isPopular ? 'ring-2 ring-orange-400/60' : ''
                    } ${isRecommended && !isPopular ? 'ring-2 ring-orange-300/60' : ''}`}
                  >
                    <div className="p-2 sm:p-2.5 pb-3 sm:pb-4 flex-1 flex flex-col">
                      {/* Icon */}
                      <div className="mb-2">
                        <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-pink-100 border border-orange-200/60 flex items-center justify-center">
                          <plan.icon className="w-4 h-4 text-orange-500" />
                        </div>
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-sm font-medium text-burgundy-900 mb-0.5 text-center">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-0.5 text-center">
                        <span className="text-xl font-semibold text-burgundy-900">{plan.price}</span>
                      </div>
                      <p className="text-burgundy-600 text-xs mb-2 text-center">
                        per {plan.period}
                      </p>

                      {/* Description */}
                      <p className="text-burgundy-600 text-xs leading-snug mb-2 text-center">
                        {plan.description}
                      </p>

                      {/* Message Count Badge */}
                      <div className="mb-2">
                        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border border-orange-200/60 p-1.5 sm:p-2 text-center">
                          <div className="text-lg sm:text-xl font-bold text-orange-500">
                            {plan.messages === 0 ? '∞' : plan.messages}
                          </div>
                          <div className="text-xs text-burgundy-500 mt-0.5">
                            per month
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1 mb-2 flex-1">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-burgundy-700 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                        disabled={upgrading !== null || isCurrent || !canUpgrade}
                        className={`w-full rounded-full text-xs sm:text-sm font-semibold mt-auto ${
                          isPopular || isRecommended 
                            ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white shadow-md hover:shadow-lg' 
                            : 'bg-burgundy-100 hover:bg-burgundy-200 text-burgundy-900 border border-burgundy-200'
                        }`}
                      >
                        {upgrading === plan.tier ? 'processing...' : 
                         isCurrent ? 'current plan' :
                         !canUpgrade ? 'not available' :
                         plan.buttonText}
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-1">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-burgundy-600 hover:text-burgundy-900 hover:bg-burgundy-50 text-xs"
            >
              maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};