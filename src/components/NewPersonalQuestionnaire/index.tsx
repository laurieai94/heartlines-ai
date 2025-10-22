
import { useState, useEffect, useCallback } from "react";
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

  // Flush pending updates on unmount
  useEffect(() => {
    return () => {
      // Force immediate sync when component unmounts
      if ((saveData as any).flush) {
        (saveData as any).flush();
      }
    };
  }, [saveData]);

  const handleComplete = useCallback(async () => {
    // CRITICAL: Set flag immediately to prevent modal from reopening
    sessionStorage.setItem('questionnaire-completing', 'true');
    console.log('[Questionnaire] Starting completion flow...');
    
    try {
      // STEP 1: Flush all pending debounced updates immediately
      if ((saveData as any).flush) {
        console.log('[Questionnaire] Flushing pending updates...');
        (saveData as any).flush();
      }
      
      // STEP 2: Wait for storage to sync
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // STEP 3: Read fresh data directly from localStorage
      let freshData = profileData;
      try {
        const stored = localStorage.getItem('personal_profile_v2');
        if (stored) {
          const parsed = JSON.parse(stored);
          freshData = parsed.profile || parsed || profileData;
          console.log('[Questionnaire] Fresh data from localStorage:', {
            name: freshData.name,
            pronouns: freshData.pronouns,
            relationshipStatus: freshData.relationshipStatus,
            loveLanguage: freshData.loveLanguage,
            attachmentStyle: freshData.attachmentStyle
          });
        }
      } catch (e) {
        console.error('[Questionnaire] Error reading localStorage:', e);
      }
      
      // STEP 4: Build completion data with fresh values
      const completedData = {
        ...freshData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      console.log('[Questionnaire] Sending completion data:', completedData);
      
      // STEP 5: Pass fresh data to validation
      onComplete({
        type: 'personal',
        completionData: completedData,
        nextStep: 'start-coaching'
      });
    } catch (error) {
      console.error('[Questionnaire] Error completing questionnaire:', error);
    }
  }, [profileData, saveData, onComplete]);

  // Set the auto-complete callback after we have access to handleComplete
  useEffect(() => {
    if (!autoCompleteCallback) {
      setAutoCompleteCallback(() => handleComplete);
    }
  }, [autoCompleteCallback]);


  return (
    <QuestionnaireLayout
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={handleComplete}
      onClose={onClose}
      isModal={isModal}
      onAutoComplete={autoCompleteCallback}
    />
  );
};

export default NewPersonalQuestionnaire;
