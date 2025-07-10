
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, MessageCircle, Calendar, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface SubscriptionPaywallProps {
  feature: string;
  description: string;
}

const SubscriptionPaywall = ({ feature, description }: SubscriptionPaywallProps) => {
  const { createCheckout, isLoading } = useSubscription();

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
          <p className="text-gray-600">
            Unlock {feature} and strengthen your relationship with personalized reminders
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-coral-500" />
              <span className="text-sm">SMS reminders from your conversations</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-coral-500" />
              <span className="text-sm">Scheduled relationship check-ins</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-coral-500" />
              <span className="text-sm">Advanced AI insights & suggestions</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">$9.99</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
        </div>

        <Button
          onClick={createCheckout}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 text-lg font-semibold"
        >
          {isLoading ? "Loading..." : "Start Premium Subscription"}
        </Button>

        <p className="text-xs text-gray-500">
          Cancel anytime. All existing features remain free.
        </p>
      </div>
    </Card>
  );
};

export default SubscriptionPaywall;
