import { useState, useEffect } from "react";
import { usePartnerProfileData } from "./hooks/usePartnerProfileData";
import PartnerQuestionnaireLayout from "./components/PartnerQuestionnaireLayout";
import PartnerFlow from "./Flow/PartnerFlow";
interface NewPartnerProfileProps {
  onComplete: (profileData: any, skipPopup?: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
}

const NewPartnerProfile = ({ onComplete, onClose, isModal = false }: NewPartnerProfileProps) => {
  const { profileData, updateField, handleMultiSelect } = usePartnerProfileData();

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


  const USE_NEW_FLOW = true;

  if (USE_NEW_FLOW) {
    return (
      <PartnerFlow
        profileData={profileData as any}
        updateField={updateField as any}
        handleMultiSelect={handleMultiSelect as any}
        onComplete={handleComplete}
        onClose={onClose}
      />
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
    />
  );
};

export default NewPartnerProfile;