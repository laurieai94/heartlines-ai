
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";

import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  
  const {
    activeTab,
    setActiveTab,
    setActiveTabGuard,
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
    handlePersonalUnlockCoaching,
    handlePersonalStartChatting,
    handlePartnerStartChatting,
    handlePartnerContinueEditing,
    handleProfileUpdate
  } = useDashboardModals();

  const handleSignInClick = () => {
    openSignInModal();
  };

  const handleOpenProfile = () => {
    handleOpenQuestionnaire();
  };

  return (
    <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach}>
        <div className="h-[100dvh] overflow-hidden">
          {/* Main Dashboard Content - This gets blurred when modals are open */}
          <div className={`h-full flex flex-col relative bg-burgundy-900 ${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>

            {/* Background overlays removed for unified burgundy theme */}

            <DashboardHeader 
              accessLevel={accessLevel}
              profileCompletion={profileCompletion}
              compact={false}
              user={user}
              activeTab={activeTab}
              onValueChange={setActiveTabGuard}
              onSignInClick={handleSignInClick}
              onOpenProfile={handleOpenProfile}
            />

            <DashboardContent
              activeTab={activeTab}
              onValueChange={setActiveTabGuard}
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
            onPersonalStartChatting={handlePersonalUnlockCoaching}
            onPersonalCompletionClose={handlePersonalCompletionClose}
            showPartnerCompletionOptions={showPartnerCompletionOptions}
            onPartnerStartChatting={handlePartnerStartChatting}
            onPartnerCompletionClose={handlePartnerCompletionClose}
            onPartnerContinueEditing={handlePartnerContinueEditing}
            temporaryProfiles={temporaryProfiles}
          />
        </div>
      </NavigationProvider>
  );
};

export default Dashboard;
