
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import AuthGuard from "@/components/AuthGuard";
import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  
  const {
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    showPartnerCompletionOptions,
    shouldShowSignUpModal,
    showSignInModal,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    accessLevel,
    profileCompletion,
    temporaryProfiles,
    temporaryDemographics,
    isAnyModalOpen,
    // Handler functions
    handleGoToProfile,
    handleGoToCoach,
    handleOpenQuestionnaire,
    handleOpenPartnerQuestionnaire,
    handleQuestionnaireComplete,
    handlePartnerQuestionnaireComplete,
    handleQuestionnaireClose,
    handlePartnerQuestionnaireClose,
    handlePersonalCompletionClose,
    handlePartnerCompletionClose,
    handlePersonalAddPartnerProfile,
    handlePersonalStartChatting,
    handlePartnerStartChatting,
    handlePartnerContinueEditing,
    handleProfileUpdate
  } = useDashboardModals();

  // Preload questionnaire chunk for gated users
  useEffect(() => {
    if (accessLevel === 'profile-required' && user) {
      import('@/components/NewPersonalQuestionnaire').catch(() => {});
    }
  }, [accessLevel, user]);

  const handleSignInClick = () => {
    openSignInModal();
  };

  const handleOpenProfile = () => {
    handleOpenQuestionnaire();
  };

  return (
    <AuthGuard>
      <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach}>
        <MobileHeaderVisibilityProvider>
          <div className="h-[100dvh] overflow-hidden">
            {/* Main Dashboard Content - This gets blurred when modals are open */}
            <div className={`h-full flex flex-col relative bg-burgundy-900 ${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
              {/* Ambient glow for chat interface separation */}
              <div className="absolute inset-0 bg-gradient-radial from-coral-500/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>

              {/* Background overlays removed for unified burgundy theme */}

              <DashboardHeader 
                accessLevel={accessLevel}
                profileCompletion={profileCompletion}
                compact={activeTab === 'insights'}
                user={user}
                activeTab={activeTab}
                onValueChange={setActiveTab}
                onSignInClick={handleSignInClick}
                onOpenProfile={handleOpenProfile}
              />

              <DashboardContent
                activeTab={activeTab}
                onValueChange={setActiveTab}
                temporaryProfiles={temporaryProfiles}
                temporaryDemographics={temporaryDemographics}
                onProfileUpdate={handleProfileUpdate}
                onOpenQuestionnaire={handleOpenQuestionnaire}
                onOpenPartnerQuestionnaire={handleOpenPartnerQuestionnaire}
              />
            </div>

          {/* Modals - These stay sharp and are rendered outside the blurred content */}
          <DashboardModals
            shouldShowSignUpModal={shouldShowSignUpModal}
            onCloseSignUpModal={closeSignUpModal}
            showSignInModal={showSignInModal}
            onCloseSignInModal={closeSignInModal}
            blockingAction={blockingAction}
            showQuestionnaireModal={showQuestionnaireModal}
            onQuestionnaireComplete={handleQuestionnaireComplete}
            onQuestionnaireClose={handleQuestionnaireClose}
            onQuestionnaireOpen={handleOpenQuestionnaire}
            showPartnerQuestionnaireModal={showPartnerQuestionnaireModal}
            onPartnerQuestionnaireComplete={handlePartnerQuestionnaireComplete}
            onPartnerQuestionnaireClose={handlePartnerQuestionnaireClose}
            showPersonalCompletionOptions={showPersonalCompletionOptions}
            onPersonalAddPartnerProfile={handlePersonalAddPartnerProfile}
            onPersonalStartChatting={handlePersonalStartChatting}
            onPersonalCompletionClose={handlePersonalCompletionClose}
            showPartnerCompletionOptions={showPartnerCompletionOptions}
            onPartnerStartChatting={handlePartnerStartChatting}
            onPartnerCompletionClose={handlePartnerCompletionClose}
            onPartnerContinueEditing={handlePartnerContinueEditing}
            temporaryProfiles={temporaryProfiles}
          />
        </div>
        </MobileHeaderVisibilityProvider>
      </NavigationProvider>
    </AuthGuard>
  );
};

export default Dashboard;
