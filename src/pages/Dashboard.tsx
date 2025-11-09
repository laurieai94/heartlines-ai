
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import AuthGuard from "@/components/AuthGuard";
import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PremiumBackground from "@/components/PremiumBackground";
import { useCheckoutSuccess } from "@/hooks/useCheckoutSuccess";
// Performance optimization removed

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  // Handle checkout success with shared hook
  useCheckoutSuccess();
  // Performance optimization removed for better stability
  
  const {
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    showPartnerCompletionOptions,
    shouldShowSignUpModal,
    showSignInModal,
    showWelcomeDialog,
    setShowWelcomeDialog,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    closeWelcomeDialog,
    handleWelcomeDialogContinue,
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

  // Show welcome dialog for brand-new signups, then auto-open questionnaire
  useEffect(() => {
    // PREVENT LOOP: Don't auto-open if we're completing questionnaire
    const isCompleting = sessionStorage.getItem('questionnaire-completing');
    if (isCompleting) {
      console.log('[Dashboard] Questionnaire completing - skipping auto-open');
      return;
    }
    
    // PREVENT LOOP: Don't auto-open if we're on the coach/insights tab
    if (activeTab === 'insights') {
      console.log('[Dashboard] On coach tab - skipping auto-open logic');
      return;
    }
    
    if (activeTab === 'profile' && 
        accessLevel === 'profile-required' && 
        user && 
        !showQuestionnaireModal &&
        !showWelcomeDialog) {
      
      // Use per-user localStorage keys to avoid cross-user conflicts
      const userAutoOpenKey = `profileAutoOpenedOnce_${user.id}`;
      const userWelcomeShownKey = `welcomeDialogShown_${user.id}`;
      const hasAutoOpened = localStorage.getItem(userAutoOpenKey);
      const hasShownWelcome = localStorage.getItem(userWelcomeShownKey);
      
      if (!hasAutoOpened && !hasShownWelcome) {
        // Set per-user flags
        localStorage.setItem(userAutoOpenKey, 'true');
        localStorage.setItem(userWelcomeShownKey, 'true');
        
        // Small delay to ensure component is mounted, then show welcome dialog
        setTimeout(() => {
          setShowWelcomeDialog(true);
        }, 100);
      }
    }
  }, [activeTab, accessLevel, user, showQuestionnaireModal, showWelcomeDialog, setShowWelcomeDialog]);

  const handleSignInClick = () => {
    openSignInModal();
  };

  const handleOpenProfile = () => {
    handleOpenQuestionnaire();
  };

  const goToPartner = () => {
    handleQuestionnaireClose();
    setTimeout(handleOpenPartnerQuestionnaire, 100);
  };

  return (
    <AuthGuard>
      <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach} goToPartner={goToPartner}>
        <MobileHeaderVisibilityProvider>
          <div className={`h-[100dvh] ${activeTab === 'insights' ? 'chat-page' : ''}`}>
            {/* Main Dashboard Content - This gets blurred when modals are open */}
            <div className={`h-full flex flex-col relative ${isAnyModalOpen ? 'blur-sm md:blur-sm' : ''} transition-all duration-300`}>
          <PremiumBackground className={activeTab === 'insights' ? 'md:block hidden' : ''} />

              <DashboardHeader 
                accessLevel={accessLevel}
                profileCompletion={profileCompletion}
                compact={activeTab === 'insights'}
                user={user}
                activeTab={activeTab}
                onValueChange={(newTab) => {
                  setActiveTab(newTab);
                  // Notify hooks when switching tabs for immediate access level updates
                  window.dispatchEvent(new CustomEvent('dashboard:tabChange', {
                    detail: { tab: newTab }
                  }));
                }}
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
            showWelcomeDialog={showWelcomeDialog}
            onWelcomeDialogContinue={handleWelcomeDialogContinue}
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
