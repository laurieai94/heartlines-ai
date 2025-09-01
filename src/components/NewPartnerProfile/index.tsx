import { useState, useEffect } from "react";
import { usePartnerProfileData } from "./hooks/usePartnerProfileData";
import PartnerQuestionnaireLayout from "./components/PartnerQuestionnaireLayout";
import BrandLoadingText from "../BrandLoadingText";

interface NewPartnerProfileProps {
  onComplete: (profileData: any, skipPopup?: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPartnerProfile = ({ onComplete, onClose, isModal = false }: NewPartnerProfileProps) => {
  const [autoCompleteCallback, setAutoCompleteCallback] = useState<(() => void) | undefined>();
  
  const { profileData, updateField, handleMultiSelect, isLoading } = usePartnerProfileData(autoCompleteCallback);

  const handleComplete = async (skipPopup?: boolean) => {
    try {
      // Rely on incremental saves from useProfileStoreV2 to avoid overwriting fields on completion
      
      const completedData = {
        ...profileData,
        completedAt: new Date().toISOString(),
        profileSource: 'partner-questionnaire'
      };
      
      onComplete({
        type: 'partner',
        completionData: completedData,
        nextStep: 'start-coaching'
      }, skipPopup);
    } catch (error) {
      console.error('Error completing partner questionnaire:', error);
    }
  };

  // Set the auto-complete callback after we have access to handleComplete
  useEffect(() => {
    if (!autoCompleteCallback) {
      setAutoCompleteCallback(() => handleComplete);
    }
  }, [autoCompleteCallback, handleComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <BrandLoadingText text="profile loading..." color="light" />
      </div>
    );
  }

  return (
    <PartnerQuestionnaireLayout
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

export default NewPartnerProfile;