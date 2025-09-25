
import { useCallback } from "react";
import { usePersonalProfileData } from "../../hooks/usePersonalProfileData";
import QuestionnaireLayout from "./components/QuestionnaireLayout";
import ErrorBoundary from "../ErrorBoundary";
import { performanceMonitor } from "../../utils/performanceMonitor";

interface NewPersonalQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPersonalQuestionnaire = ({ onComplete, onClose, isModal = false }: NewPersonalQuestionnaireProps) => {
  // Initialize performance monitoring
  performanceMonitor.init();
  performanceMonitor.mark('questionnaire-start');
  
  const { profileData, updateField, handleMultiSelect, saveData } = usePersonalProfileData();

  // Fix infinite re-render by using useCallback with stable dependencies
  const handleComplete = useCallback(async () => {
    performanceMonitor.mark('questionnaire-complete');
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
      
      performanceMonitor.measure('questionnaire-complete', 100);
    } catch (error) {
      console.error('Error completing questionnaire:', error);
    }
  }, [saveData, profileData, onComplete]);

  // Create stable auto-complete callback
  const autoCompleteCallback = useCallback(() => {
    handleComplete();
  }, [handleComplete]);


  return (
    <ErrorBoundary>
      <QuestionnaireLayout
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
        onComplete={handleComplete}
        onClose={onClose}
        isModal={isModal}
        onAutoComplete={autoCompleteCallback}
      />
    </ErrorBoundary>
  );
};

export default NewPersonalQuestionnaire;
