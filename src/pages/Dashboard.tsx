
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardContent from "@/components/DashboardContent";
import DashboardModals from "@/components/DashboardModals";
import AuthGuard from "@/components/AuthGuard";
import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
// Performance optimization removed

const Dashboard = () => {
  const { user } = useAuth();
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

  // Auto-open Personal Questionnaire only for brand-new signups
  useEffect(() => {
    // PREVENT LOOP: Don't auto-open if we're completing questionnaire
    const isCompleting = sessionStorage.getItem('questionnaire-completing');
    if (isCompleting) {
      console.log('[Dashboard] Questionnaire completing - skipping auto-open');
      return;
    }
    
    // PREVENT LOOP: Don't auto-open if already completed in this session
    const completedThisSession = sessionStorage.getItem('questionnaire-completed-this-session');
    if (completedThisSession) {
      console.log('[Dashboard] Questionnaire already completed this session - skipping auto-open');
      return;
    }
    
    // PREVENT LOOP: Don't auto-open if modal is already showing
    if (showQuestionnaireModal) {
      console.log('[Dashboard] Modal already open - skipping auto-open');
      return;
    }
    
    // PREVENT LOOP: Don't auto-open if we're on the coach/insights tab
    // The user explicitly chose to go there, so don't interrupt
    if (activeTab === 'insights') {
      console.log('[Dashboard] On coach tab - skipping auto-open logic');
      return;
    }
    
    if (activeTab === 'profile' && 
        accessLevel === 'profile-required' && 
        user) {
      
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
          handleOpenQuestionnaire('header');
        }, 100);
      }
    }
  }, [activeTab, accessLevel, user, showQuestionnaireModal, handleOpenQuestionnaire]);

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
          <div className="h-[100dvh] bg-burgundy-800">
            {/* Main Dashboard Content - This gets blurred when modals are open */}
            <div className={`h-full flex flex-col relative bg-burgundy-800 ${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
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
