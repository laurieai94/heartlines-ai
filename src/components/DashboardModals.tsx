
import React, { Suspense } from "react";
import SignUpModal from "@/components/SignUpModal";
import SplashScreen from "@/components/SplashScreen";

// Lazy load heavy modal components
const NewPersonalQuestionnaire = React.lazy(() => import("@/components/NewPersonalQuestionnaire"));
const NewPartnerProfile = React.lazy(() => import("@/components/NewPartnerProfile"));
const ProfileCompletionOptions = React.lazy(() => import("@/components/ProfileCompletionOptions"));

interface DashboardModalsProps {
  shouldShowSignUpModal: boolean;
  onCloseSignUpModal: () => void;
  showSignInModal?: boolean;
  onCloseSignInModal?: () => void;
  blockingAction?: string;
  showQuestionnaireModal: boolean;
  onQuestionnaireComplete: (data: any) => void;
  onQuestionnaireClose: () => void;
  onQuestionnaireOpen: () => void;
  showPartnerQuestionnaireModal: boolean;
  onPartnerQuestionnaireComplete: (data: any, skipPopup?: boolean) => void;
  onPartnerQuestionnaireClose: () => void;
  showPersonalCompletionOptions: boolean;
  onPersonalAddPartnerProfile: () => void;
  onPersonalStartChatting: () => void;
  onPersonalCompletionClose: () => void;
  showPartnerCompletionOptions: boolean;
  onPartnerStartChatting: () => void;
  onPartnerCompletionClose: () => void;
  temporaryProfiles: any;
}

const DashboardModals = ({
  shouldShowSignUpModal,
  onCloseSignUpModal,
  showSignInModal,
  onCloseSignInModal,
  blockingAction,
  showQuestionnaireModal,
  onQuestionnaireComplete,
  onQuestionnaireClose,
  onQuestionnaireOpen,
  showPartnerQuestionnaireModal,
  onPartnerQuestionnaireComplete,
  onPartnerQuestionnaireClose,
  showPersonalCompletionOptions,
  onPersonalAddPartnerProfile,
  onPersonalStartChatting,
  onPersonalCompletionClose,
  showPartnerCompletionOptions,
  onPartnerStartChatting,
  onPartnerCompletionClose,
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

      {/* Personal Questionnaire Modal */}
      {showQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          style={{ zIndex: 99999 }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto max-h-[92vh]">
            <Suspense fallback={<div className="fixed inset-0 z-[99999]"><SplashScreen message="profile loading..." /></div>}>
              <NewPersonalQuestionnaire 
                onComplete={onQuestionnaireComplete} 
                onClose={onQuestionnaireClose} 
                isModal={true} 
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Partner Questionnaire Modal */}
      {showPartnerQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          style={{ zIndex: 99999 }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onPartnerQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto max-h-[92vh]">
            <Suspense fallback={<div className="fixed inset-0 z-[99999]"><SplashScreen message="profile loading..." /></div>}>
              <NewPartnerProfile 
                onComplete={onPartnerQuestionnaireComplete} 
                onClose={onPartnerQuestionnaireClose} 
                isModal={true} 
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Personal Profile Completion Options */}
      {showPersonalCompletionOptions && (
        <Suspense fallback={<div className="fixed inset-0 z-50"><SplashScreen message="profile loading..." /></div>}>
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
        <Suspense fallback={<div className="fixed inset-0 z-50"><SplashScreen message="profile loading..." /></div>}>
          <ProfileCompletionOptions
            completionType="partner"
            onAddPartnerProfile={() => {}}
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
