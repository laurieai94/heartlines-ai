
import { useState } from "react";
import { useProfileData } from "./hooks/useProfileData";
import QuestionnaireLayout from "./components/QuestionnaireLayout";
import QuestionnaireCompletion from "./components/QuestionnaireCompletion";

interface NewPersonalQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPersonalQuestionnaire = ({ onComplete, onClose, isModal = false }: NewPersonalQuestionnaireProps) => {
  const { profileData, updateField, handleMultiSelect, isLoading, saveProfile } = useProfileData();
  const [showCompletion, setShowCompletion] = useState(false);

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

  if (showCompletion) {
    return (
      <QuestionnaireCompletion
        onAddPartner={() => {
          const completedData = {
            ...profileData,
            completedAt: new Date().toISOString(),
            profileSource: 'personal-questionnaire'
          };
          
          onComplete({
            type: 'personal',
            completionData: completedData,
            nextStep: 'partner-profile'
          });
        }}
        onStartCoaching={() => {
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
        }}
        isModal={isModal}
      />
    );
  }

  const handleComplete = async () => {
    try {
      await saveProfile();
      setShowCompletion(true);
    } catch (error) {
      console.error('Error completing questionnaire:', error);
    }
  };

  return (
    <QuestionnaireLayout
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={handleComplete}
      onClose={onClose}
      isModal={isModal}
    />
  );
};

export default NewPersonalQuestionnaire;
