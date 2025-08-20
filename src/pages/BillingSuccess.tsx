import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BillingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      toast({
        title: "Invalid session",
        description: "No session ID found. Redirecting to pricing.",
        variant: "destructive"
      });
      navigate('/pricing');
      return;
    }

    // Refresh subscription status
    const refreshSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        
        setSubscriptionDetails(data);
        
        toast({
          title: "Welcome to your new plan! 🎉",
          description: `You now have ${data.message_limit} messages per month.`,
        });
      } catch (error) {
        console.error('Error refreshing subscription:', error);
        toast({
          title: "Error",
          description: "Failed to refresh subscription status.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Wait a moment for Stripe to process, then refresh
    setTimeout(refreshSubscription, 2000);
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPlanName = (tier: string) => {
    switch (tier) {
      case 'grow': return 'Grow Plan';
      case 'thrive': return 'Thrive Plan';
      default: return 'Your Plan';
    }
  };

  const getPlanEmoji = (tier: string) => {
    switch (tier) {
      case 'grow': return '💬';
      case 'thrive': return '🌟';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Subscription Successful! 🎉
            </CardTitle>
            <p className="text-muted-foreground">
              Welcome to {subscriptionDetails ? getPlanName(subscriptionDetails.subscription_tier) : 'your new plan'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {subscriptionDetails && (
              <div className="bg-accent/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">
                  {getPlanEmoji(subscriptionDetails.subscription_tier)}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {getPlanName(subscriptionDetails.subscription_tier)}
                </h3>
                <p className="text-2xl font-bold text-primary mb-1">
                  {subscriptionDetails.message_limit} messages
                </p>
                <p className="text-sm text-muted-foreground">
                  per month • {subscriptionDetails.messages_used || 0} used
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What's next?
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Your subscription is now active and ready to use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Start having deeper conversations with your AI relationship coach
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Access advanced features and personalized insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Manage your subscription anytime from your dashboard
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/dashboard/home')}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/pricing')}
                className="flex-1"
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingSuccess;