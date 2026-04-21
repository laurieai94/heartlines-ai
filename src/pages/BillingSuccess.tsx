import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PremiumBackground from "@/components/brand/PremiumBackground";

const BillingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    // Log session_id for debugging (optional)
    if (sessionId) {
      console.log('Stripe session_id:', sessionId);
    }

    // Refresh subscription status
    const refreshSubscription = async () => {
      try {
        // First try with Stripe validation
        let response = await supabase.functions.invoke('check-subscription');
        
        // If Stripe validation fails, try with cached data from database
        if (response.error) {
          console.log('Stripe validation failed, using cached data:', response.error);
          response = await supabase.functions.invoke('check-subscription', {
            body: { skipStripe: true }
          });
        }
        
        if (response.error) throw response.error;
        
        setSubscriptionDetails(response.data);
        
        // Invalidate subscription cache globally so all components refresh
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        
        toast.success("Welcome to your new plan! 🎉", {
          description: `You now have ${response.data.message_limit} messages per month.`
        });
        
        // Redirect to coach page after successful subscription
        setTimeout(() => {
          navigate('/coach?upgraded=true&from=billing');
        }, 2000);
      } catch (error: any) {
        console.error('Error refreshing subscription:', error);
        toast.error("Unable to load subscription details", {
          description: error.message || "Please try refreshing the page or contact support."
        });
        
        // Don't redirect on error, let user see the error and retry
      } finally {
        setLoading(false);
      }
    };

    // Wait a moment for webhook to process, then refresh
    setTimeout(refreshSubscription, 2000);
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-burgundy-800 relative overflow-hidden flex items-center justify-center">
        <PremiumBackground />
        <Card className="w-full max-w-md mx-4 relative z-10 bg-burgundy-700/50 backdrop-blur-lg border-pink-400/20">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-coral-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Processing your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPlanName = (tier: string) => {
    switch (tier) {
      case 'glow': return 'Glow Plan';
      case 'vibe': return 'Vibe Plan';
      default: return 'Your Plan';
    }
  };

  const getPlanEmoji = (tier: string) => {
    switch (tier) {
      case 'glow': return '⚡';
      case 'vibe': return '📻';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen bg-burgundy-800 relative overflow-hidden flex items-center justify-center">
      <PremiumBackground />
      <div className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-2xl mx-auto bg-burgundy-700/50 backdrop-blur-lg border-pink-400/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral-300 via-pink-400 to-coral-400 mb-2">
              Subscription Successful! 🎉
            </CardTitle>
            <p className="text-gray-200">
              Welcome to {subscriptionDetails ? getPlanName(subscriptionDetails.subscription_tier) : 'your new plan'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {subscriptionDetails && (
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">
                  {getPlanEmoji(subscriptionDetails.subscription_tier)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {getPlanName(subscriptionDetails.subscription_tier)}
                </h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-500 mb-1">
                  {subscriptionDetails.message_limit} messages
                </p>
                <p className="text-sm text-gray-300">
                  per month • {subscriptionDetails.messages_used || 0} used
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-coral-400" />
                What's next?
              </h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-start gap-2">
                  <span className="text-coral-400">•</span>
                  Your subscription is now active and ready to use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-400">•</span>
                  Start having deeper conversations with your AI relationship coach
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-400">•</span>
                  Access advanced features and personalized insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-400">•</span>
                  Manage your subscription anytime from your dashboard
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/coach')}
                className="flex-1"
              >
                Start Coaching
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingSuccess;