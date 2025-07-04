
import SignUpModal from "@/components/SignUpModal";
import PersonalProfileQuestionnaire from "@/components/PersonalProfileQuestionnaire";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";

interface DashboardModalsProps {
  shouldShowSignUpModal: boolean;
  blockingAction: string;
  onCloseSignUpModal: () => void;
  showQuestionnaireModal: boolean;
  onQuestionnaireComplete: (questionnaireData: any) => void;
  onQuestionnaireClose: () => void;
  showPersonalCompletionOptions: boolean;
  onPersonalAddPartnerProfile: () => void;
  onPersonalStartChatting: () => void;
  onPersonalCompletionClose: () => void;
  hasPartnerProfile: boolean;
}

const DashboardModals = ({
  shouldShowSignUpModal,
  blockingAction,
  onCloseSignUpModal,
  showQuestionnaireModal,
  onQuestionnaireComplete,
  onQuestionnaireClose,
  showPersonalCompletionOptions,
  onPersonalAddPartnerProfile,
  onPersonalStartChatting,
  onPersonalCompletionClose,
  hasPartnerProfile
}: DashboardModalsProps) => {
  return (
    <>
      {/* Sign-up Modal */}
      <SignUpModal
        isOpen={shouldShowSignUpModal}
        onClose={onCloseSignUpModal}
        blockingAction={blockingAction}
      />

      {/* Questionnaire Modal */}
      {showQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto h-[85vh] bg-black backdrop-blur-xl rounded-3xl shadow-2xl border border-electric-blue/40 overflow-hidden">
            <div className="h-full w-full">
              <PersonalProfileQuestionnaire 
                onComplete={onQuestionnaireComplete} 
                onClose={onQuestionnaireClose} 
                isModal={true} 
              />
            </div>
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
          hasPartnerProfile={hasPartnerProfile}
        />
      )}
    </>
  );
};

export default DashboardModals;
