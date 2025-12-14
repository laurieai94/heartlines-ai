import { useState, useEffect } from "react";
import { usePartnerProfileData } from "./hooks/usePartnerProfileData";
import PartnerQuestionnaireLayout from "./components/PartnerQuestionnaireLayout";
import { PartnerFlowProvider } from "./context/FlowContext";

interface NewPartnerProfileProps {
  onComplete: (profileData: any, skipPopup?: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
  targetProfileId?: string | null;
}

const NewPartnerProfile = ({ onComplete, onClose, isModal = false, targetProfileId }: NewPartnerProfileProps) => {
  // Pass explicit profile ID to prevent race conditions with async activeProfileId state
  const { profileData, updateField, handleMultiSelect, saveProfile } = usePartnerProfileData(undefined, targetProfileId);

  // Flush pending updates on unmount
  useEffect(() => {
    return () => {
      // Force immediate sync when component unmounts
      if ((saveProfile as any).flush) {
        (saveProfile as any).flush();
      }
    };
  }, [saveProfile]);

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


  return (
    <PartnerFlowProvider
      profileData={profileData}
      updateField={updateField}
      handleMultiSelect={handleMultiSelect}
      onComplete={handleComplete}
    >
      <PartnerQuestionnaireLayout
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
        onComplete={handleComplete}
        onClose={onClose}
        isModal={isModal}
      />
    </PartnerFlowProvider>
  );
};

export default NewPartnerProfile;