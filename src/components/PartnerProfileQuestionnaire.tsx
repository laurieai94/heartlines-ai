
import { usePartnerProfileData } from "@/hooks/usePartnerProfileData";
import PartnerQuestionnaireContainer from "./PartnerProfileQuestionnaire/PartnerQuestionnaireContainer";

interface PartnerProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PartnerProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PartnerProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePartnerProfileData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading partner profile...</p>
        </div>
      </div>
    );
  }

  return (
    <PartnerQuestionnaireContainer
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={onComplete}
      onClose={onClose}
      isModal={isModal}
    />
  );
};

export default PartnerProfileQuestionnaire;
