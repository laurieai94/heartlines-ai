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

  const glowPlan = pricingPlans.find(p => p.tier === 'glow');
  const vibePlan = pricingPlans.find(p => p.tier === 'vibe');

  const handleUpgrade = async (tier: 'glow' | 'vibe') => {
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
        return `You've used all ${messageLimit} messages this month. Upgrade to continue your growth journey.`;
      case 'near-limit':
        return `You've used ${messagesUsed} of ${messageLimit} messages. Upgrade now to avoid interruptions.`;
      default:
        return "Choose the plan that fits your relationship goals.";
    }
  };

  const getRecommendedTier = (): 'glow' | 'vibe' => {
    // If user is at 80%+ usage on freemium, suggest Glow
    // If user is already on Glow or at high usage, suggest Vibe
    const usagePercent = (messagesUsed / messageLimit) * 100;
    if (currentTier === 'freemium' && usagePercent < 90) return 'glow';
    return 'vibe';
  };

  const recommendedTier = getRecommendedTier();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto questionnaire-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold questionnaire-text flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-coral-400" />
            Upgrade Your Journey
          </DialogTitle>
          <DialogDescription className="text-lg questionnaire-text-muted mt-2">
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
          <div className="grid md:grid-cols-2 gap-4">
            {/* Glow Plan */}
            {glowPlan && (
              <Card className={`questionnaire-card p-6 relative ${
                recommendedTier === 'glow' ? 'border-2 border-coral-400' : 'border-white/10'
              }`}>
                {recommendedTier === 'glow' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-coral-400 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <glowPlan.icon className="w-6 h-6 text-coral-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold questionnaire-text">{glowPlan.name}</h3>
                    <p className="text-sm questionnaire-text-muted">{glowPlan.tagline}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold questionnaire-text">{glowPlan.price}</span>
                  <span className="questionnaire-text-muted">/{glowPlan.period}</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-coral-400" />
                    <span className="font-semibold questionnaire-text">{glowPlan.messages} messages/month</span>
                  </div>
                  <p className="text-sm questionnaire-text-muted">{glowPlan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {glowPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm questionnaire-text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade('glow')}
                  disabled={upgrading !== null || currentTier === 'glow' || currentTier === 'vibe'}
                  className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white"
                >
                  {upgrading === 'glow' ? 'Processing...' : 
                   currentTier === 'glow' ? 'Current Plan' :
                   currentTier === 'vibe' ? 'Downgrade Not Available' :
                   'Upgrade to Glow'}
                </Button>
              </Card>
            )}

            {/* Vibe Plan */}
            {vibePlan && (
              <Card className={`questionnaire-card p-6 relative ${
                recommendedTier === 'vibe' ? 'border-2 border-coral-400' : 'border-white/10'
              }`}>
                {recommendedTier === 'vibe' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-coral-400 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <vibePlan.icon className="w-6 h-6 text-coral-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold questionnaire-text">{vibePlan.name}</h3>
                    <p className="text-sm questionnaire-text-muted">{vibePlan.tagline}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold questionnaire-text">{vibePlan.price}</span>
                  <span className="questionnaire-text-muted">/{vibePlan.period}</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-coral-400" />
                    <span className="font-semibold questionnaire-text">{vibePlan.messages} messages/month</span>
                  </div>
                  <p className="text-sm questionnaire-text-muted">{vibePlan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {vibePlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm questionnaire-text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade('vibe')}
                  disabled={upgrading !== null || currentTier === 'vibe'}
                  className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white"
                >
                  {upgrading === 'vibe' ? 'Processing...' : 
                   currentTier === 'vibe' ? 'Current Plan' :
                   'Upgrade to Vibe'}
                </Button>
              </Card>
            )}
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