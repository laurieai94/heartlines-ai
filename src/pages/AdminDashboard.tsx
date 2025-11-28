import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAdminAnalytics, useAdminCostAnalytics } from "@/hooks/useAdminAnalytics";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminCostChart from "@/components/admin/AdminCostChart";
import AdminCacheMetricsChart from "@/components/admin/AdminCacheMetricsChart";
import AdminUserDetailsModal from "@/components/admin/AdminUserDetailsModal";
import CacheAlertBanner from "@/components/admin/CacheAlertBanner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: analytics, isLoading: isLoadingAnalytics } = useAdminAnalytics();
  const { data: costData } = useAdminCostAnalytics();
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

        {/* Overview Cards */}
        {analytics && (
          <AdminOverviewCards
            totalUsers={analytics.totalUsers}
            activeUsers={analytics.activeUsers}
            totalMessages={analytics.totalMessages}
            totalCost={analytics.totalCost}
            avgCostPerUser={analytics.avgCostPerUser}
            subscribersByPlan={analytics.subscribersByPlan}
            avgInputTokens={analytics.avgInputTokens}
            avgOutputTokens={analytics.avgOutputTokens}
            avgMessagesPerConversation={analytics.avgMessagesPerConversation}
            avgConversationDuration={analytics.avgConversationDuration}
            avgSessionDuration={analytics.avgSessionDuration}
          />
        )}

        {/* Cost Chart */}
        {costData && costData.length > 0 && (
          <AdminCostChart data={costData} />
        )}

        {/* Cache Metrics Chart */}
        <AdminCacheMetricsChart />

        {/* Users Table */}
        {analytics && (
          <div className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
            <AdminUsersTable 
              users={analytics.users}
              onUserClick={(userId) => setSelectedUserId(userId)}
            />
          </div>
        )}

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
