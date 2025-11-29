import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAdminAnalytics, useAdminCostAnalytics } from "@/hooks/useAdminAnalytics";
import { useSubscriptionAnalytics, useRevenueSnapshots } from "@/hooks/useSubscriptionAnalytics";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";
import { AdminRevenueCards } from "@/components/admin/AdminRevenueCards";
import { AdminSubscriptionBreakdown } from "@/components/admin/AdminSubscriptionBreakdown";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminCostChart from "@/components/admin/AdminCostChart";
import AdminCacheMetricsChart from "@/components/admin/AdminCacheMetricsChart";
import AdminUserDetailsModal from "@/components/admin/AdminUserDetailsModal";
import CacheAlertBanner from "@/components/admin/CacheAlertBanner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: analytics, isLoading: isLoadingAnalytics, error: analyticsError } = useAdminAnalytics();
  const { data: costData, error: costError } = useAdminCostAnalytics();
  const { data: subscriptionData, isLoading: subscriptionLoading, error: subscriptionError } = useSubscriptionAnalytics();
  const { data: revenueSnapshots, isLoading: revenueSnapshotsLoading, error: revenueSnapshotsError } = useRevenueSnapshots();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Redirect if not admin
  if (!isLoadingAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-burgundy-800 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-pink-300 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-white/60">You don't have permission to view this page.</p>
          <Button 
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-pink-500 to-coral-500 hover:from-pink-600 hover:to-coral-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingAdmin || isLoadingAnalytics) {
    return (
      <div className="min-h-screen bg-burgundy-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-burgundy-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-200 via-coral-200 to-orange-200 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-white/80">Monitor users, costs, and platform analytics</p>
          </div>
          <Button 
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        {/* Cache Alert Banner */}
        <CacheAlertBanner />

        {/* Error Display */}
        {(analyticsError || costError || subscriptionError || revenueSnapshotsError) && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
            <p className="text-red-200 text-sm">
              {analyticsError && `Analytics Error: ${analyticsError.message}`}
              {costError && `Cost Data Error: ${costError.message}`}
              {subscriptionError && `Subscription Error: ${subscriptionError.message}`}
              {revenueSnapshotsError && `Revenue Snapshots Error: ${revenueSnapshotsError.message}`}
            </p>
          </div>
        )}

        {/* Overview Cards - Always show, even with empty data */}
        <AdminOverviewCards
          totalUsers={analytics?.totalUsers || 0}
          activeUsers={analytics?.activeUsers || 0}
          totalMessages={analytics?.totalMessages || 0}
          totalCost={analytics?.totalCost || 0}
          avgCostPerUser={analytics?.avgCostPerUser || 0}
          subscribersByPlan={analytics?.subscribersByPlan || {}}
          avgInputTokens={analytics?.avgInputTokens || 0}
          avgOutputTokens={analytics?.avgOutputTokens || 0}
          avgMessagesPerConversation={analytics?.avgMessagesPerConversation || 0}
          avgConversationDuration={analytics?.avgConversationDuration || 0}
          avgSessionDuration={analytics?.avgSessionDuration || 0}
        />

        {/* Revenue & Subscriptions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-coral-200 to-orange-200 bg-clip-text text-transparent">
            Revenue & Subscriptions
          </h2>
          
          <AdminRevenueCards
            data={subscriptionData}
            isLoading={subscriptionLoading}
            error={subscriptionError}
          />

          <AdminSubscriptionBreakdown
            data={subscriptionData}
            isLoading={subscriptionLoading}
            error={subscriptionError}
          />

          <AdminRevenueChart
            data={revenueSnapshots || []}
            isLoading={revenueSnapshotsLoading}
            error={revenueSnapshotsError}
          />
        </div>

        {/* Cost Chart - Always show, even with empty data */}
        <AdminCostChart data={costData || []} />

        {/* Cache Metrics Chart */}
        <AdminCacheMetricsChart />

        {/* Users Table - Always show, even with empty data */}
        <div className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
          <AdminUsersTable 
            users={analytics?.users || []}
            onUserClick={(userId) => setSelectedUserId(userId)}
          />
        </div>

        {/* User Details Modal */}
        <AdminUserDetailsModal 
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
