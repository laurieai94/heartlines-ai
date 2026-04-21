import { useState, useEffect, useCallback } from "react";
import { usePersonalProfileData } from "../../hooks/usePersonalProfileData";
import QuestionnaireLayout from "./components/QuestionnaireLayout";
import { toast } from "@/hooks/use-toast";
import { batchedStorage } from "@/utils/batchedStorage";
import { useAuth } from "@/contexts/AuthContext";

interface NewPersonalQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPersonalQuestionnaire = ({ onComplete, onClose, isModal = false }: NewPersonalQuestionnaireProps) => {
  const [autoCompleteCallback, setAutoCompleteCallback] = useState<(() => void) | undefined>();
  const { user } = useAuth();
  
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

  // Wrap onClose to ensure all data is flushed to localStorage immediately
  const handleClose = useCallback(() => {
    console.log('[Questionnaire] Closing - flushing all pending data');
    
    // Flush profile store
    if ((saveData as any).flush) {
      (saveData as any).flush();
    }
    
    // CRITICAL: Flush batchedStorage to write to actual localStorage
    batchedStorage.flush();
    
    console.log('[Questionnaire] All data flushed to localStorage');
    
    // CRITICAL: Dispatch event so ProfileBuilder updates immediately
    window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated', {
      detail: { source: 'questionnaire-close', timestamp: Date.now() }
    }));
    console.log('[Questionnaire] Dispatched profile:requiredFieldUpdated event');
    
    // Now close
    onClose();
  }, [saveData, onClose]);

  // Listen for close request from modal handler
  useEffect(() => {
    const handleCloseRequest = () => {
      console.log('[Questionnaire] Received close request - executing handleClose');
      handleClose();
      
      // Signal that close is complete
      window.dispatchEvent(new CustomEvent('questionnaire:closeComplete'));
    };

    window.addEventListener('questionnaire:requestClose', handleCloseRequest);
    return () => window.removeEventListener('questionnaire:requestClose', handleCloseRequest);
  }, [handleClose]);

  const handleComplete = useCallback(async () => {
    console.log('[Questionnaire] Starting completion flow...');
    
    try {
      // STEP 1: Flush all pending debounced updates immediately
      if ((saveData as any).flush) {
        console.log('[Questionnaire] Flushing pending updates...');
        (saveData as any).flush();
      }
      
      // STEP 2: Wait longer for all storage operations to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // STEP 3: ALWAYS read fresh data directly from localStorage (not from profileData prop)
      let freshData;
      try {
        // CRITICAL: Use user-specific localStorage key
        const userStorageKey = user?.id ? `personal_profile_v2_${user.id}` : 'personal_profile_v2';
        console.log('[Questionnaire] Reading from user-specific key:', userStorageKey);
        const stored = localStorage.getItem(userStorageKey);
        if (!stored) {
          console.error('[Questionnaire] ERROR: No data in localStorage!');
          toast({
            title: "Error",
            description: "Profile data not found. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        const parsed = JSON.parse(stored);
        freshData = parsed.profile || {};
        
        console.log('[Questionnaire] Fresh data from localStorage:', {
          name: freshData.name,
          pronouns: freshData.pronouns,
          relationshipStatus: freshData.relationshipStatus,
          loveLanguage: freshData.loveLanguage,
          loveLanguageLength: freshData.loveLanguage?.length,
          attachmentStyle: freshData.attachmentStyle
        });
        
        // Validate that we have all required fields BEFORE sending
        const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
        const missing = requiredFields.filter(field => {
          const value = freshData[field];
          if (Array.isArray(value)) {
            return !value || value.length === 0;
          }
          return !value || value.trim() === '';
        });
        
        if (missing.length > 0) {
          console.error('[Questionnaire] Missing required fields:', missing);
          toast({
            title: "Missing Required Fields",
            description: `Please complete: ${missing.join(', ')}`,
            variant: "destructive"
          });
          return; // Don't proceed with completion
        }
        
      } catch (e) {
        console.error('[Questionnaire] Error reading localStorage:', e);
        toast({
          title: "Error",
          description: "Error reading profile data. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // STEP 4: Build completion data with ONLY fresh values
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
      toast({
        title: "Error",
        description: "Error completing questionnaire. Please try again.",
        variant: "destructive"
      });
    }
  }, [saveData, onComplete]);

  // Set the auto-complete callback after we have access to handleComplete
  useEffect(() => {
    if (!autoCompleteCallback) {
      setAutoCompleteCallback(() => handleComplete);
    }
  }, [autoCompleteCallback, handleComplete]);

  return (
    <QuestionnaireLayout
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={handleComplete}
      onClose={handleClose}
      isModal={isModal}
      onAutoComplete={autoCompleteCallback}
    />
  );
};

export default NewPersonalQuestionnaire;
