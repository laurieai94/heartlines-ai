
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
    console.log('[Questionnaire] BEFORE flush - profileData:', JSON.stringify(profileData, null, 2));
    
    try {
      // CRITICAL: Force immediate flush of all pending updates
      if ((saveData as any).flush) {
        console.log('[Questionnaire] Flushing pending updates...');
        (saveData as any).flush();
      }
      
      // Wait for flush to complete and batched storage to sync
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Re-read fresh data from localStorage to ensure we have latest values
      const freshData = (() => {
        try {
          const stored = localStorage.getItem('personal_profile_v2');
          if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.profile || parsed;
          }
        } catch (e) {
          console.error('[Questionnaire] Error reading fresh data:', e);
        }
        return profileData;
      })();
      
      console.log('[Questionnaire] AFTER flush - freshData:', JSON.stringify(freshData, null, 2));
      console.log('[Questionnaire] Fresh name value:', freshData.name);
      
      // Force React state sync by dispatching update event
      window.dispatchEvent(new CustomEvent('profile:forceReload', { 
        detail: { freshData } 
      }));
      
      // Wait for React state to sync
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const completedData = {
        ...freshData,
        completedAt: new Date().toISOString(),
        profileSource: 'personal-questionnaire'
      };
      
      console.log('[Questionnaire] Sending completion data:', completedData);
      
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
