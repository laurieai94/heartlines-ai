import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { MobileHeaderVisibilityProvider } from '@/contexts/MobileHeaderVisibilityContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardModals from '@/components/dashboard/DashboardModals';
import AccountLayout from '@/components/account/AccountLayout';
import { useDashboardModals } from '@/hooks/useDashboardModals';
import PremiumBackground from '@/components/brand/PremiumBackground';

const Account = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    showPartnerCompletionOptions,
    shouldShowSignUpModal,
    showSignInModal,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    accessLevel,
    profileCompletion,
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
    targetPartnerProfileId
  } = useDashboardModals();

  // Navigation handlers for account page
  const handleGoToProfileAccount = (origin?: 'header' | 'chat') => {
    navigate('/');
    setTimeout(() => setActiveTab('profile'), 100);
  };

  const handleGoToCoachAccount = () => {
    navigate('/');
    setTimeout(() => setActiveTab('insights'), 100);
  };

  const handleGoToPartnerAccount = () => {
    navigate('/');
    setTimeout(() => {
      setActiveTab('profile');
      window.dispatchEvent(new CustomEvent('dashboard:openPartnerQuestionnaire'));
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <NavigationProvider 
      goToProfile={handleGoToProfileAccount} 
      goToCoach={handleGoToCoachAccount} 
      goToPartner={handleGoToPartnerAccount}
    >
      <MobileHeaderVisibilityProvider>
        <div className="min-h-screen min-h-dvh bg-burgundy-800 relative">
          <PremiumBackground />
          <DashboardHeader
            accessLevel={accessLevel}
            profileCompletion={profileCompletion}
            user={user}
            activeTab="account"
            onValueChange={setActiveTab}
            onSignInClick={openSignInModal}
            onOpenProfile={handleGoToProfile}
          />
          <AccountLayout />
          
          <DashboardModals
            showQuestionnaireModal={showQuestionnaireModal}
            showPartnerQuestionnaireModal={showPartnerQuestionnaireModal}
            showPersonalCompletionOptions={showPersonalCompletionOptions}
            showPartnerCompletionOptions={showPartnerCompletionOptions}
            shouldShowSignUpModal={shouldShowSignUpModal}
            onCloseSignUpModal={closeSignUpModal}
            showSignInModal={showSignInModal}
            onCloseSignInModal={closeSignInModal}
            onQuestionnaireComplete={handleQuestionnaireComplete}
            onPartnerQuestionnaireComplete={handlePartnerQuestionnaireComplete}
            onQuestionnaireClose={handleQuestionnaireClose}
            onQuestionnaireOpen={handleOpenQuestionnaire}
            onPartnerQuestionnaireClose={handlePartnerQuestionnaireClose}
            targetPartnerProfileId={targetPartnerProfileId}
            onPersonalCompletionClose={handlePersonalCompletionClose}
            onPartnerCompletionClose={handlePartnerCompletionClose}
            onPersonalAddPartnerProfile={handlePersonalAddPartnerProfile}
            onPersonalStartChatting={handlePersonalStartChatting}
            onPartnerStartChatting={handlePartnerStartChatting}
            onPartnerContinueEditing={handlePartnerContinueEditing}
            temporaryProfiles={{}}
          />
        </div>
      </MobileHeaderVisibilityProvider>
    </NavigationProvider>
  );
};

export default Account;