
import { useState } from "react";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import QuestionnaireSuccess from "./PersonalProfileQuestionnaire/QuestionnaireSuccess";
import QuestionnaireContainer from "./PersonalProfileQuestionnaire/QuestionnaireContainer";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PersonalProfileQuestionnaireProps) => {
  const { profileData, isLoading, updateField, handleMultiSelect } = usePersonalProfileData();
  const [showSuccess, setShowSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return <QuestionnaireSuccess isModal={isModal} />;
  }

  return (
    <QuestionnaireContainer
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

export default PersonalProfileQuestionnaire;
