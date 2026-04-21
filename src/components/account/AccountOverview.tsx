import { MessageCircle, Crown, RefreshCw, Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { refreshAllAppData } from '@/utils/globalRefresh';
import AccountUsageAnalytics from './AccountUsageAnalytics';
import { UnlockCoachingButton } from '@/components/landing/UnlockCoachingButton';

const AccountOverview = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { canUnlockCoaching, canUnlockPartnerCoaching } = useProgressiveAccess();
  const navigate = useNavigate();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    message_limit, 
    messages_used, 
    loading, 
    usagePercentage,
    refresh,
    upgrade 
  } = useOptimizedSubscription();

  const getPlanColor = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'glow': return 'text-blue-400';
      case 'vibe': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanName = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'glow': return 'Glow Plan';
      case 'vibe': return 'Vibe Plan';
      default: return 'Free Plan';
    }
  };

  const isHighUsage = usagePercentage > 80;

  const handleRefreshAllData = async () => {
    try {
      // Refresh subscription data first
      await refresh();
      // Then refresh all other app data
      await refreshAllAppData();
      toast({
        title: "Data refreshed",
        description: "All profile and chat data has been updated."
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-base font-semibold text-white mb-1">
          Welcome back, {profile?.name || user?.email?.split('@')[0] || 'there'}!
        </h2>
        <p className="text-white/70 text-xs">
          Here's your account overview and usage summary
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className={`h-3.5 w-3.5 ${getPlanColor(subscription_tier)}`} />
              <CardTitle className="text-white text-sm">Current Plan</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              disabled={loading}
              className="text-white/70 hover:text-white hover:bg-white/10 h-7 w-7 p-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription className="text-white/60 text-xs">
            {subscribed ? `Active until ${subscription_end ? new Date(subscription_end).toLocaleDateString() : 'N/A'}` : 'Free plan with limited features'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-semibold ${getPlanColor(subscription_tier)}`}>
              {getPlanName(subscription_tier)}
            </span>
            {!subscribed && (
              <Button 
                size="sm"
                onClick={() => upgrade('glow')}
                className="questionnaire-button-primary text-xs py-1 px-2"
              >
                <Zap className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <MessageCircle className="h-3.5 w-3.5" />
            Message Usage
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Your monthly message usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/80">Messages used this month</span>
            <span className={`font-medium ${isHighUsage ? 'text-orange-400' : 'text-white'}`}>
              {messages_used} / {message_limit}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-1.5" />
          {isHighUsage && (
            <div className="p-2.5 rounded-lg bg-orange-500/20 border border-orange-400/30">
              <p className="text-orange-200 text-xs">
                ⚠️ You're approaching your monthly limit. Consider upgrading for more messages.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Analytics - Admin Only */}
      <AccountUsageAnalytics />

      {/* Personal Coaching - Show when ready */}
      {canUnlockCoaching && (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="p-2.5">
            <CardTitle className="text-white text-sm">Ready to Start Personal Coaching!</CardTitle>
            <CardDescription className="text-white/60 text-xs">
              You've completed your personal profile. Start chatting with our AI coach now.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2.5 pt-0">
            <UnlockCoachingButton size="compact" />
          </CardContent>
        </Card>
      )}

      {/* Partner Coaching - Show when ready */}
      {canUnlockPartnerCoaching && (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="p-2.5">
            <CardTitle className="text-white text-sm">Ready for Partner Coaching!</CardTitle>
            <CardDescription className="text-white/60 text-xs">
              You've completed your partner's profile. Get relationship insights and advice.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2.5 pt-0">
            <UnlockCoachingButton size="compact" profileType="partner" />
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Common account management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button 
            variant="outline"
            className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 py-2 text-xs"
            onClick={() => navigate('/profile')}
          >
                <User className="h-3.5 w-3.5 mr-1.5" />
            Edit Profile
          </Button>
          <Button 
            variant="outline"
            className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 py-2 text-xs"
            onClick={handleRefreshAllData}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;