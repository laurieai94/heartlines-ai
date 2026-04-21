
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MobileHeaderVisibilityProvider } from "@/contexts/MobileHeaderVisibilityContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardModals from "@/components/dashboard/DashboardModals";
import AuthGuard from "@/components/auth/AuthGuard";
import { useDashboardModals } from "@/hooks/useDashboardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PremiumBackground from "@/components/brand/PremiumBackground";
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
    handleProfileUpdate,
    targetPartnerProfileId
  } = useDashboardModals();


  // Preload questionnaire chunk for gated users
  useEffect(() => {
    if (accessLevel === 'profile-required' && user) {
      import('@/components/new-personal-questionnaire').catch(() => {});
    }
  }, [accessLevel, user]);

  // ROBUST MULTI-LAYER WELCOME DIALOG DETECTION
  useEffect(() => {
    if (!user) return;
    
    const userWelcomeShownKey = `welcomeDialogShown_${user.id}`;
    const hasShownWelcome = localStorage.getItem(userWelcomeShownKey);
    
    // PRIORITY 1: SessionStorage flags (most reliable for same-session)
    const firstTimeVerificationKey = `first_email_verification_${user.id}`;
    const hasFirstTimeVerification = sessionStorage.getItem(firstTimeVerificationKey);
    const hasGenericVerification = sessionStorage.getItem('email_just_verified');
    const hasSessionFlag = hasFirstTimeVerification || hasGenericVerification;
    
    // PRIORITY 2: LocalStorage pending flag (survives navigation/tabs)
    const hasPendingWelcome = localStorage.getItem(`pending_welcome_${user.id}`);
    
    // PRIORITY 3: User age check (brand new user within 5 minutes)
    const userCreatedAt = user.created_at ? new Date(user.created_at) : null;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isBrandNewUser = userCreatedAt && userCreatedAt > fiveMinutesAgo;
    
    // Show welcome if ANY condition is met AND not already shown
    const shouldShowWelcome = (hasSessionFlag || hasPendingWelcome || isBrandNewUser) && !hasShownWelcome;
    
    console.log('[Dashboard] Welcome check:', {
      hasSessionFlag,
      hasPendingWelcome,
      isBrandNewUser,
      hasShownWelcome,
      shouldShow: shouldShowWelcome,
      userCreatedAt: userCreatedAt?.toISOString()
    });
    
    if (shouldShowWelcome) {
      // Clear ALL flags (sessionStorage + localStorage)
      sessionStorage.removeItem(firstTimeVerificationKey);
      sessionStorage.removeItem('email_just_verified');
      sessionStorage.removeItem('verification_timestamp');
      localStorage.removeItem(`pending_welcome_${user.id}`);
      
      // Set permanent "shown" flag
      localStorage.setItem(userWelcomeShownKey, 'true');
      
      console.log('[Dashboard] Showing welcome dialog');
      
      // Show welcome dialog
      setTimeout(() => {
        setShowWelcomeDialog(true);
      }, 100);
    }
  }, [user, setShowWelcomeDialog]);

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
          {activeTab !== 'profile' && (
            <PremiumBackground className={activeTab === 'insights' ? 'md:block hidden' : ''} />
          )}

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
            targetPartnerProfileId={targetPartnerProfileId}
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
