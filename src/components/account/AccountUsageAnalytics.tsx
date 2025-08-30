import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenAnalytics } from "@/hooks/useTokenAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import { formatCost } from "@/utils/modelPricing";

const AccountUsageAnalytics = () => {
  const { user } = useAuth();
  
  // Check if current user is admin
  const isAdmin = user?.email?.toLowerCase() === 'swortman1994@gmail.com';
  
  const { data: tokenAnalytics, isLoading } = useTokenAnalytics({ 
    enabled: isAdmin 
  });

  // Don't render if not admin or no data
  if (!isAdmin || !tokenAnalytics || tokenAnalytics.totalMessages === 0 || isLoading) {
    return null;
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
                " Grow plan suits your level." :
                " Thrive plan gives you room to grow."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountUsageAnalytics;