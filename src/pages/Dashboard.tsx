
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useSubscription } from "@/hooks/useSubscription";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavigation from "@/components/DashboardNavigation";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import BubbleBackground from "@/components/BubbleBackground";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkSubscription } = useSubscription();
  
  const {
    temporaryProfiles,
    temporaryDemographics,
    isLoaded,
    updateProfiles
  } = useTemporaryProfile();

  const {
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    ...modalProps
  } = useDashboardModals();

  // Handle subscription success/cancel
  useEffect(() => {
    const subscription = searchParams.get('subscription');
    if (subscription === 'success') {
      toast.success('Welcome to Premium! Your SMS reminders are now active.');
      checkSubscription(); // Refresh subscription status
      setSearchParams({}); // Clear URL params
    } else if (subscription === 'cancelled') {
      toast.info('Subscription cancelled. You can upgrade anytime.');
      setSearchParams({}); // Clear URL params
    }
  }, [searchParams, setSearchParams, checkSubscription]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <BubbleBackground />
      
      <div className="relative z-10 flex flex-col h-screen">
        <DashboardHeader onSignOut={() => navigate("/")} />
        
        <div className="flex flex-1 min-h-0">
          <DashboardNavigation
            activeTab={activeTab}
            onValueChange={setActiveTab}
            profileCompletion={modalProps.profileCompletion}
          />
          
          <DashboardContent
            activeTab={activeTab}
            onValueChange={setActiveTab}
            temporaryProfiles={temporaryProfiles}
            temporaryDemographics={temporaryDemographics}
            onProfileUpdate={updateProfiles}
            onOpenQuestionnaire={modalProps.openPersonalQuestionnaire}
            onOpenPartnerQuestionnaire={modalProps.openPartnerQuestionnaire}
          />
        </div>
      </div>

      <DashboardModals
        showQuestionnaireModal={showQuestionnaireModal}
        showPartnerQuestionnaireModal={showPartnerQuestionnaireModal}
        {...modalProps}
      />
    </div>
  );
};

export default Dashboard;
