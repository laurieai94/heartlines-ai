
import SignUpModal from "@/components/SignUpModal";
import NewPersonalQuestionnaire from "@/components/NewPersonalQuestionnaire";
import NewPartnerProfile from "@/components/NewPartnerProfile";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";

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
  console.log('DashboardModals render - showQuestionnaireModal:', showQuestionnaireModal);
  console.log('DashboardModals render - showPartnerQuestionnaireModal:', showPartnerQuestionnaireModal);

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
          
          <div className="relative z-10 w-full max-w-6xl mx-auto max-h-[90vh]">
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
          className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          style={{ zIndex: 99999 }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onPartnerQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto max-h-[90vh]">
            <NewPartnerProfile 
              onComplete={onPartnerQuestionnaireComplete} 
              onClose={onPartnerQuestionnaireClose} 
              isModal={true} 
            />
          </div>
        </div>
      )}

      {/* Personal Profile Completion Options */}
      {showPersonalCompletionOptions && (
        <ProfileCompletionOptions
          completionType="personal"
          onAddPartnerProfile={onPersonalAddPartnerProfile}
          onStartChatting={onPersonalStartChatting}
          onClose={onPersonalCompletionClose}
          onEditProfile={onQuestionnaireOpen}
          hasPartnerProfile={temporaryProfiles.partner.length > 0}
        />
      )}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && (
        <ProfileCompletionOptions
          completionType="partner"
          onAddPartnerProfile={() => {}}
          onStartChatting={onPartnerStartChatting}
          onClose={onPartnerCompletionClose}
          onEditProfile={onQuestionnaireOpen}
          hasPartnerProfile={true}
        />
      )}
    </>
  );
};

export default DashboardModals;
