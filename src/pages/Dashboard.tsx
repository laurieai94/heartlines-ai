
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import AuthGuard from "@/components/AuthGuard";
import { useOptimizedDashboardModals } from "@/hooks/useOptimizedDashboardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  
  const dashboardModals = useOptimizedDashboardModals();

  // Preload questionnaire chunk for gated users
  useEffect(() => {
    if (dashboardModals.accessLevel === 'profile-required' && user) {
      import('@/components/NewPersonalQuestionnaire').catch(() => {});
    }
  }, [dashboardModals.accessLevel, user]);

  // Auto-open Personal Questionnaire only for brand-new signups
  useEffect(() => {
    if (dashboardModals.accessLevel === 'profile-required' && 
        user && 
        !dashboardModals.showQuestionnaireModal) {
      
      // Check if user is brand new (signed up within 24 hours)
      const userCreatedAt = new Date(user.created_at);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isBrandNew = userCreatedAt > twentyFourHoursAgo;
      
      // Use per-user localStorage key to avoid cross-user conflicts
      const userAutoOpenKey = `profileAutoOpenedOnce_${user.id}`;
      const hasAutoOpened = localStorage.getItem(userAutoOpenKey);
      
      if (isBrandNew && !hasAutoOpened) {
        // Set per-user flag to avoid reopening repeatedly
        localStorage.setItem(userAutoOpenKey, 'true');
        
        // Small delay to ensure component is mounted
        setTimeout(() => {
          dashboardModals.setShowQuestionnaireModal(true);
          dashboardModals.setQuestionnaireOrigin('header');
        }, 100);
      }
    }
  }, [dashboardModals.accessLevel, user, dashboardModals.showQuestionnaireModal, dashboardModals.setShowQuestionnaireModal, dashboardModals.setQuestionnaireOrigin]);

  const handleSignInClick = () => {
    dashboardModals.handleSignInClick();
  };

  const handleOpenProfile = () => {
    dashboardModals.handleOpenProfile();
  };

  const goToPartner = () => {
    dashboardModals.goToPartner();
  };

  return (
    <AuthGuard>
        <NavigationProvider goToProfile={dashboardModals.handleGoToProfile} goToCoach={dashboardModals.handleGoToCoach} goToPartner={goToPartner}>
          <MobileHeaderVisibilityProvider>
            <div className="h-[100dvh] overflow-hidden">
              {/* Main Dashboard Content - This gets blurred when modals are open */}
              <div className={`h-full flex flex-col relative bg-burgundy-900 ${dashboardModals.isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
                {/* Ambient glow for chat interface separation */}
                <div className="absolute inset-0 bg-gradient-radial from-coral-500/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                {/* Background overlays removed for unified burgundy theme */}

                <DashboardHeader 
                  accessLevel={dashboardModals.accessLevel}
                  profileCompletion={dashboardModals.profileCompletion}
                  compact={dashboardModals.activeTab === 'insights'}
                  user={user}
                  activeTab={dashboardModals.activeTab}
                  onValueChange={dashboardModals.setActiveTab}
                  onSignInClick={handleSignInClick}
                  onOpenProfile={handleOpenProfile}
                />

                <DashboardContent
                  activeTab={dashboardModals.activeTab}
                  onValueChange={dashboardModals.setActiveTab}
                  temporaryProfiles={dashboardModals.temporaryProfiles}
                  temporaryDemographics={dashboardModals.temporaryDemographics}
                  onProfileUpdate={dashboardModals.handleProfileUpdate}
                  onOpenQuestionnaire={dashboardModals.handleOpenQuestionnaire}
                  onOpenPartnerQuestionnaire={dashboardModals.handleOpenPartnerQuestionnaire}
                />
              </div>

            {/* Modals - These stay sharp and are rendered outside the blurred content */}
            <DashboardModals
              shouldShowSignUpModal={dashboardModals.shouldShowSignUpModal}
              onCloseSignUpModal={dashboardModals.closeSignUpModal}
              showSignInModal={dashboardModals.showSignInModal}
              onCloseSignInModal={dashboardModals.closeSignInModal}
              blockingAction={dashboardModals.blockingAction}
              showQuestionnaireModal={dashboardModals.showQuestionnaireModal}
              onQuestionnaireComplete={dashboardModals.handleQuestionnaireComplete}
              onQuestionnaireClose={dashboardModals.handleQuestionnaireClose}
              onQuestionnaireOpen={dashboardModals.handleOpenQuestionnaire}
              showPartnerQuestionnaireModal={dashboardModals.showPartnerQuestionnaireModal}
              onPartnerQuestionnaireComplete={dashboardModals.handlePartnerQuestionnaireComplete}
              onPartnerQuestionnaireClose={dashboardModals.handlePartnerQuestionnaireClose}
              showPersonalCompletionOptions={dashboardModals.showPersonalCompletionOptions}
              onPersonalAddPartnerProfile={dashboardModals.handlePersonalAddPartnerProfile}
              onPersonalStartChatting={dashboardModals.handlePersonalStartChatting}
              onPersonalCompletionClose={dashboardModals.handlePersonalCompletionClose}
              showPartnerCompletionOptions={dashboardModals.showPartnerCompletionOptions}
              onPartnerStartChatting={dashboardModals.handlePartnerStartChatting}
              onPartnerCompletionClose={dashboardModals.handlePartnerCompletionClose}
              onPartnerContinueEditing={dashboardModals.handlePartnerContinueEditing}
              temporaryProfiles={dashboardModals.temporaryProfiles}
            />
          </div>
        </MobileHeaderVisibilityProvider>
      </NavigationProvider>
    </AuthGuard>
  );
};

export default Dashboard;
