
import SignUpModal from "@/components/SignUpModal";
import NewPersonalQuestionnaire from "@/components/NewPersonalQuestionnaire";
import PartnerProfileQuestionnaire from "@/components/PartnerProfileQuestionnaire";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";

interface DashboardModalsProps {
  shouldShowSignUpModal: boolean;
  onCloseSignUpModal: () => void;
  blockingAction?: string;
  showQuestionnaireModal: boolean;
  onQuestionnaireComplete: (data: any) => void;
  onQuestionnaireClose: () => void;
  showPartnerQuestionnaireModal: boolean;
  onPartnerQuestionnaireComplete: (data: any) => void;
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
  blockingAction,
  showQuestionnaireModal,
  onQuestionnaireComplete,
  onQuestionnaireClose,
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
      {/* Sign-up Modal */}
      <SignUpModal
        isOpen={shouldShowSignUpModal}
        onClose={onCloseSignUpModal}
        blockingAction={blockingAction}
      />

      {/* Personal Questionnaire Modal */}
      {showQuestionnaireModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6"
          style={{ zIndex: 99999 }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto max-h-[95vh] sm:max-h-[92vh] lg:max-h-[90vh]">
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
          className="fixed inset-0 z-[99999] flex items-center justify-center px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6"
          style={{ zIndex: 99999 }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onPartnerQuestionnaireClose}
            onWheel={(e) => e.preventDefault()}
          />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto max-h-[95vh] sm:max-h-[92vh] lg:max-h-[90vh]">
            <PartnerProfileQuestionnaire 
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
          hasPartnerProfile={true}
        />
      )}
    </>
  );
};

export default DashboardModals;
