
import { useState } from "react";
import { usePartnerProfileData } from "@/hooks/usePartnerProfileData";
import PartnerQuestionnaireSuccess from "./PartnerProfileQuestionnaire/PartnerQuestionnaireSuccess";
import PartnerQuestionnaireContainer from "./PartnerProfileQuestionnaire/PartnerQuestionnaireContainer";

interface PartnerProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PartnerProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PartnerProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePartnerProfileData();
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Success state
  if (showSuccess) {
    return <PartnerQuestionnaireSuccess isModal={isModal} />;
  }

  return (
    <PartnerQuestionnaireContainer
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={onComplete}
      onClose={onClose}
      isModal={isModal}
      setShowSuccess={setShowSuccess}
    />
  );
};

export default PartnerProfileQuestionnaire;
