
import { useState, useEffect } from "react";
import ProfileErrorBoundary from "@/components/ProfileErrorBoundary";
import { usePersonalProfileData } from "../../hooks/usePersonalProfileData";
import QuestionnaireLayout from "./components/QuestionnaireLayout";

interface NewPersonalQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPersonalQuestionnaire = ({ onComplete, onClose, isModal = false }: NewPersonalQuestionnaireProps) => {
  const [autoCompleteCallback, setAutoCompleteCallback] = useState<(() => void) | undefined>();
  
  const { profileData, updateField, handleMultiSelect, saveData } = usePersonalProfileData();

  const handleComplete = async () => {
    try {
      await saveData(profileData);
      
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      onComplete({
        type: 'personal',
        completionData: completedData,
        nextStep: 'start-coaching'
      });
    } catch (error) {
      console.error('Error completing questionnaire:', error);
    }
  };

  // Set the auto-complete callback after we have access to handleComplete
  useEffect(() => {
    if (!autoCompleteCallback) {
      setAutoCompleteCallback(() => handleComplete);
    }
  }, [autoCompleteCallback, handleComplete]);


  return (
    <ProfileErrorBoundary>
      <QuestionnaireLayout
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
        onComplete={handleComplete}
        onClose={onClose}
        isModal={isModal}
        onAutoComplete={autoCompleteCallback}
      />
    </ProfileErrorBoundary>
  );
};

export default NewPersonalQuestionnaire;
