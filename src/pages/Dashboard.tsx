
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavigation from "@/components/DashboardNavigation";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import { useDashboardModals } from "@/hooks/useDashboardModals";

const Dashboard = () => {
  const {
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    showPartnerCompletionOptions,
    shouldShowSignUpModal,
    blockingAction,
    closeSignUpModal,
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
    handleProfileUpdate
  } = useDashboardModals();

  return (
    <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach}>
      <div className="min-h-screen h-screen overflow-hidden">
        {/* Main Dashboard Content - This gets blurred when modals are open */}
        <div className={`h-full flex flex-col bg-gradient-to-br from-[#8B2635] via-[#A0334A] to-[#B8405F] ${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
          <DashboardHeader 
            accessLevel={accessLevel}
            profileCompletion={profileCompletion}
          />

          <DashboardNavigation 
            activeTab={activeTab}
            onValueChange={setActiveTab}
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
          blockingAction={blockingAction}
          showQuestionnaireModal={showQuestionnaireModal}
          onQuestionnaireComplete={handleQuestionnaireComplete}
          onQuestionnaireClose={handleQuestionnaireClose}
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
          temporaryProfiles={temporaryProfiles}
        />
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
