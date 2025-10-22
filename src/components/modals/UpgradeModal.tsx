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
      <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-pink-50 to-orange-50 border-orange-200 rounded-3xl p-3 sm:p-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-light text-burgundy-900 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            time to dive deeper?
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-1.5">
          {/* Current Usage */}
          <Card className="bg-white/80 backdrop-blur-sm p-2.5 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-burgundy-600">current plan</p>
                <p className="text-lg font-semibold text-burgundy-900">{currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-burgundy-600">messages used</p>
                <p className="text-lg font-semibold text-burgundy-900">
                  {messagesUsed} / {messageLimit}
                </p>
              </div>
            </div>
            <div className="mt-1.5 w-full bg-orange-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((messagesUsed / messageLimit) * 100, 100)}%` }}
              />
            </div>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-7xl mx-auto items-stretch">
            {allPlans.map((plan) => {
              const isRecommended = plan.tier === recommendedTier;
              const isCurrent = plan.tier === currentTier;
              const canUpgrade = canUpgradeTo(plan.tier || '');
              const isPopular = plan.tier === 'vibe';
              
              return (
                <Card 
                  key={plan.id}
                  className={`bg-white/90 backdrop-blur-sm relative rounded-3xl shadow-lg border border-orange-200 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    isPopular ? 'ring-2 ring-orange-400' : ''
                  } ${isRecommended && !isPopular ? 'ring-2 ring-orange-400' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 lg:-top-5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 sm:px-5 lg:px-6 py-0.5 rounded-full text-xs font-semibold border border-orange-300 whitespace-nowrap">
                        most popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-2.5 sm:p-3 pb-4 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-2">
                      <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 flex items-center justify-center">
                        <plan.icon className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-sm font-light text-burgundy-900 mb-1 text-center">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-1 text-center">
                      <span className="text-xl font-thin text-burgundy-900">{plan.price}</span>
                    </div>
                    <p className="text-burgundy-600 text-xs mb-2 text-center">
                      per {plan.period}
                    </p>

                    {/* Description */}
                    <p className="text-burgundy-600 text-xs leading-tight mb-3 text-center">
                      {plan.description}
                    </p>

                    {/* Message Count Badge */}
                    <div className="mb-2">
                      <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 p-2 text-center">
                        <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                          {plan.messages === 0 ? '∞' : plan.messages}
                        </div>
                        <div className="text-xs text-burgundy-500 mt-1">
                          per month
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1 mb-2 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-burgundy-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(plan.tier as 'glow' | 'vibe' | 'unlimited')}
                      disabled={upgrading !== null || isCurrent || !canUpgrade}
                      className={`w-full rounded-full text-sm font-semibold mt-auto ${
                        isPopular || isRecommended 
                          ? 'questionnaire-button-primary shadow-lg' 
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

          <div className="text-center pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-burgundy-600 hover:text-burgundy-900 hover:bg-burgundy-50 text-sm"
            >
              maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};