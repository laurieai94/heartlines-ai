
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import AIInsights from "@/components/AIInsights";
import OnboardingFlow from "@/components/OnboardingFlow";
import BubbleBackground from "@/components/BubbleBackground";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { status, loading: statusLoading } = useOnboardingStatus();
  const { profiles, loading: profilesLoading } = useUserProfiles();
  const { clearTemporaryProfile } = useTemporaryProfile();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Clear any temporary profile data when user reaches dashboard
    clearTemporaryProfile();
    
    if (!statusLoading && status && !status.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [status, statusLoading, clearTemporaryProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (statusLoading || profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Transform profiles data to match expected format
  const transformedProfiles = {
    your: profiles.your ? [profiles.your.profile_data] : [],
    partner: profiles.partner ? [profiles.partner.profile_data] : []
  };

  const transformedDemographics = {
    your: profiles.your?.demographics_data || null,
    partner: profiles.partner?.demographics_data || null
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 relative">
      <BubbleBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">RealTalk</h1>
            {user && (
              <span className="text-sm text-gray-600">
                Welcome back, {user.user_metadata?.name || user.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AIInsights 
          profiles={transformedProfiles}
          demographicsData={transformedDemographics}
        />
      </div>
    </div>
  );
};

export default Dashboard;
