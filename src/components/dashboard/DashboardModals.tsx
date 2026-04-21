
import React, { Suspense, Component, ReactNode } from "react";
import SignUpModal from "@/components/landing/SignUpModal";
import SplashScreen from "@/components/layout/SplashScreen";
import NewPersonalQuestionnaire from "@/components/new-personal-questionnaire";
import BrandLoadingText from "@/components/brand/BrandLoadingText";
import WelcomeToKaiDialog from "@/components/chat/WelcomeToKaiDialog";

// Simple error boundary for chunk loading failures
class ChunkErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void }, 
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="questionnaire-modal-card w-full h-[90vh] max-h-[90vh] flex items-center justify-center">
          <div className="text-center">
            <p className="questionnaire-text-muted mb-4">Couldn't load profile. Please try again.</p>
            <button 
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry();
              }}
              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load heavy modal components (except NewPartnerProfile for faster loading)
import NewPartnerProfile from "@/components/new-partner-profile";
const ProfileCompletionOptions = React.lazy(() => import("@/components/profile/ProfileCompletionOptions"));

interface DashboardModalsProps {
  shouldShowSignUpModal: boolean;
  onCloseSignUpModal: () => void;
  showSignInModal?: boolean;
  onCloseSignInModal?: () => void;
  showWelcomeDialog?: boolean;
  onWelcomeDialogContinue?: () => void;
  blockingAction?: string;
  showQuestionnaireModal: boolean;
  onQuestionnaireComplete: (data: any) => void;
  onQuestionnaireClose: () => void;
  onQuestionnaireOpen: () => void;
  showPartnerQuestionnaireModal: boolean;
  onPartnerQuestionnaireComplete: (data: any, skipPopup?: boolean) => void;
  onPartnerQuestionnaireClose: () => void;
  targetPartnerProfileId?: string | null;
  showPersonalCompletionOptions: boolean;
  onPersonalAddPartnerProfile: () => void;
  onPersonalStartChatting: () => void;
  onPersonalCompletionClose: () => void;
  showPartnerCompletionOptions: boolean;
  onPartnerStartChatting: () => void;
  onPartnerCompletionClose: () => void;
  onPartnerContinueEditing: () => void;
  temporaryProfiles: any;
}

const DashboardModals = ({
  shouldShowSignUpModal,
  onCloseSignUpModal,
  showSignInModal,
  onCloseSignInModal,
  showWelcomeDialog,
  onWelcomeDialogContinue,
  blockingAction,
  showQuestionnaireModal,
  onQuestionnaireComplete,
  onQuestionnaireClose,
  onQuestionnaireOpen,
  showPartnerQuestionnaireModal,
  onPartnerQuestionnaireComplete,
  onPartnerQuestionnaireClose,
  targetPartnerProfileId,
  showPersonalCompletionOptions,
  onPersonalAddPartnerProfile,
  onPersonalStartChatting,
  onPersonalCompletionClose,
  showPartnerCompletionOptions,
  onPartnerStartChatting,
  onPartnerCompletionClose,
  onPartnerContinueEditing,
  temporaryProfiles
}: DashboardModalsProps) => {
  // Removed debug logs for better performance

  return (
    <>
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={shouldShowSignUpModal}
        onClose={onCloseSignUpModal}
        blockingAction={blockingAction}
      />

      {/* Sign In Modal */}
      {showSignInModal && onCloseSignInModal && (
        <SignUpModal
          isOpen={showSignInModal}
          onClose={onCloseSignInModal}
          initialMode="signIn"
        />
      )}

      {/* Welcome Dialog */}
      {showWelcomeDialog && onWelcomeDialogContinue && (
        <WelcomeToKaiDialog
          isOpen={showWelcomeDialog}
          onGetStarted={onWelcomeDialogContinue}
        />
      )}

      {/* Personal Questionnaire Modal */}
      {showQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              // Prevent close if completing
              if (!sessionStorage.getItem('questionnaire-completing')) {
                onQuestionnaireClose();
              }
            }}
          />
          
          <div className="relative z-10 w-full h-[92dvh] max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <NewPersonalQuestionnaire 
              onComplete={onQuestionnaireComplete} 
              onClose={onQuestionnaireClose} 
              isModal={true} 
            />
          </div>
        </div>
      )}

      {/* Partner Questionnaire Modal */}
      {showPartnerQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onPartnerQuestionnaireClose}
          />
          
          <div className="relative z-10 w-full h-[92dvh] max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <NewPartnerProfile 
              onComplete={onPartnerQuestionnaireComplete} 
              onClose={onPartnerQuestionnaireClose} 
              isModal={true}
              targetProfileId={targetPartnerProfileId}
            />
          </div>
        </div>
      )}

      {/* Personal Profile Completion Options */}
      {showPersonalCompletionOptions && (
        <Suspense fallback={<div className="fixed inset-0 z-50"><SplashScreen message="profile loading..." showWordmark={false} messageSize="lg" /></div>}>
          <ProfileCompletionOptions
            completionType="personal"
            onAddPartnerProfile={onPersonalAddPartnerProfile}
            onStartChatting={onPersonalStartChatting}
            onClose={onPersonalCompletionClose}
            onEditProfile={onQuestionnaireOpen}
            hasPartnerProfile={temporaryProfiles.partner.length > 0}
          />
        </Suspense>
      )}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && (
        <Suspense fallback={<div className="fixed inset-0 z-50"><SplashScreen message="profile loading..." showWordmark={false} messageSize="lg" /></div>}>
          <ProfileCompletionOptions
            completionType="partner"
            onAddPartnerProfile={onPartnerContinueEditing}
            onStartChatting={onPartnerStartChatting}
            onClose={onPartnerCompletionClose}
            onEditProfile={onQuestionnaireOpen}
            hasPartnerProfile={true}
          />
        </Suspense>
      )}
    </>
  );
};

export default DashboardModals;
