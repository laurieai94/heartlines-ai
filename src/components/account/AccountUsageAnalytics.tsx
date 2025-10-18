import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTokenAnalytics } from "@/hooks/useTokenAnalytics";
import { useIsAdmin } from "@/hooks/useUserRole";
import { formatCost } from "@/utils/modelPricing";

const AccountUsageAnalytics = () => {
  // Check if current user is admin using database role
  const { isAdmin, isLoading: isLoadingRole } = useIsAdmin();
  
  const { data: tokenAnalytics, isLoading } = useTokenAnalytics({ 
    enabled: isAdmin 
  });

  // Don't render if not admin or still checking role
  if (!isAdmin || isLoadingRole) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/20">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <CardTitle className="text-white text-sm">Usage & Cost Analysis</CardTitle>
          </div>
          <CardDescription className="text-white/60 text-xs">
            Loading your conversation analytics...
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-white/5">
                <Skeleton className="h-4 w-8 mx-auto mb-1 bg-white/20" />
                <Skeleton className="h-3 w-16 mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tokenAnalytics || tokenAnalytics.totalMessages === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/20">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <CardTitle className="text-white text-sm">Usage & Cost Analysis</CardTitle>
          </div>
          <CardDescription className="text-white/60 text-xs">
            No conversation data yet
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <div className="text-center py-4">
            <p className="text-white/60 text-sm">Start chatting with your AI coach to see usage analytics here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="p-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-coral-400/20 to-pink-400/20 border border-white/20">
            <BarChart3 className="h-3.5 w-3.5 text-white" />
          </div>
          <CardTitle className="text-white text-sm">Usage & Cost Analysis</CardTitle>
        </div>
        <CardDescription className="text-white/60 text-xs">
          Based on your conversation history with our AI coach
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2.5 pt-0 space-y-2.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-medium text-white">
              {tokenAnalytics.totalMessages}
            </div>
            <div className="text-xs text-white/60">Total Messages</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-medium text-white">
              {formatCost(tokenAnalytics.averageCostPerMessage)}
            </div>
            <div className="text-xs text-white/60">Avg Cost/Message</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-medium text-white">
              {Math.round(tokenAnalytics.averageTokensPerMessage)}
            </div>
            <div className="text-xs text-white/60">Avg Tokens/Message</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-medium text-white">
              {formatCost(tokenAnalytics.last30Days.totalCost)}
            </div>
            <div className="text-xs text-white/60">Last 30 Days</div>
          </div>
        </div>
        
        {tokenAnalytics.last30Days.totalMessages > 0 && (
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-coral-400/10 to-pink-400/10 border border-coral-400/20">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-coral-400" />
              <span className="text-xs font-medium text-white">Usage Insight</span>
            </div>
            <p className="text-xs text-white/80">
              At {tokenAnalytics.last30Days.totalMessages} messages in 30 days, 
              averaging {formatCost(tokenAnalytics.last30Days.averageCostPerMessage)} per message. 
              {tokenAnalytics.last30Days.totalMessages <= 25 ? 
                " Begin plan covers your usage." :
                tokenAnalytics.last30Days.totalMessages <= 100 ?
                " Glow plan suits your level." :
                " Vibe plan gives you room to grow."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountUsageAnalytics;