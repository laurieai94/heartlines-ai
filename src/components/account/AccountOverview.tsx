import { MessageCircle, Crown, RefreshCw, Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';

const AccountOverview = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
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
      case 'grow': return 'text-blue-400';
      case 'thrive': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanName = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'grow': return 'Grow Plan';
      case 'thrive': return 'Thrive Plan';
      default: return 'Free Plan';
    }
  };

  const isHighUsage = usagePercentage > 80;

  return (
    <div className="space-y-3">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-white mb-1">
          Welcome back, {profile?.name || user?.email?.split('@')[0] || 'there'}!
        </h2>
        <p className="text-white/70 text-sm">
          Here's your account overview and usage summary
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className={`h-4 w-4 ${getPlanColor(subscription_tier)}`} />
              <CardTitle className="text-white text-base">Current Plan</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              disabled={loading}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription className="text-white/60">
            {subscribed ? `Active until ${subscription_end ? new Date(subscription_end).toLocaleDateString() : 'N/A'}` : 'Free plan with limited features'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${getPlanColor(subscription_tier)}`}>
              {getPlanName(subscription_tier)}
            </span>
            {!subscribed && (
              <Button 
                size="sm"
                onClick={() => upgrade('grow')}
                className="questionnaire-button-primary"
              >
                <Zap className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4" />
            Message Usage
          </CardTitle>
          <CardDescription className="text-white/60 text-sm">
            Your monthly message usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Messages used this month</span>
            <span className={`font-medium ${isHighUsage ? 'text-orange-400' : 'text-white'}`}>
              {messages_used} / {message_limit}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          {isHighUsage && (
            <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-400/30">
              <p className="text-orange-200 text-sm">
                ⚠️ You're approaching your monthly limit. Consider upgrading for more messages.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-3">
          <CardTitle className="text-white text-base">Quick Actions</CardTitle>
          <CardDescription className="text-white/60 text-sm">
            Common account management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 py-2.5"
            onClick={() => navigate('/profile')}
          >
                <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant="outline"
            className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 py-2.5"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;