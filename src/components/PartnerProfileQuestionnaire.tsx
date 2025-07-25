
import NewPartnerProfile from "./NewPartnerProfile";

interface PartnerProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PartnerProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PartnerProfileQuestionnaireProps) => {
  return (
    <NewPartnerProfile
      onComplete={onComplete}
      onClose={onClose}
      isModal={isModal}
    />
  );
};

export default PartnerProfileQuestionnaire;
