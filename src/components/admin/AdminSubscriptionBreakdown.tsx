import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, UserPlus, UserX } from 'lucide-react';
import type { SubscriptionAnalyticsSummary } from '@/types/admin';

interface AdminSubscriptionBreakdownProps {
  data: SubscriptionAnalyticsSummary | null;
  isLoading: boolean;
  error: Error | null;
}

export const AdminSubscriptionBreakdown = ({ data, isLoading, error }: AdminSubscriptionBreakdownProps) => {
  if (error) {
    return (
      <div className="text-destructive text-sm">
        Error loading subscription breakdown: {error.message}
      </div>
    );
  }

  const totalSubs = data?.total_paid_subscribers || 0;
  const glowPercent = totalSubs > 0 ? ((data?.glow_subscribers || 0) / totalSubs * 100).toFixed(1) : '0.0';
  const vibePercent = totalSubs > 0 ? ((data?.vibe_subscribers || 0) / totalSubs * 100).toFixed(1) : '0.0';
  const unlimitedPercent = totalSubs > 0 ? ((data?.unlimited_subscribers || 0) / totalSubs * 100).toFixed(1) : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Subscribers by Tier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Glow</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{data?.glow_subscribers || 0}</span>
                  <span className="text-xs text-muted-foreground">({glowPercent}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Vibe</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{data?.vibe_subscribers || 0}</span>
                  <span className="text-xs text-muted-foreground">({vibePercent}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Unlimited</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{data?.unlimited_subscribers || 0}</span>
                  <span className="text-xs text-muted-foreground">({unlimitedPercent}%)</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This Month Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">New Subscriptions</span>
                </div>
                <span className="text-sm text-muted-foreground">{data?.new_subscriptions_this_month || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Upgrades</span>
                </div>
                <span className="text-sm text-muted-foreground">{data?.upgrades_this_month || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Downgrades</span>
                </div>
                <span className="text-sm text-muted-foreground">{data?.downgrades_this_month || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Cancellations</span>
                </div>
                <span className="text-sm text-muted-foreground">{data?.cancellations_this_month || 0}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
