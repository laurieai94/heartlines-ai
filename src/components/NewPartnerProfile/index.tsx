import { useState, useEffect } from "react";
import { usePartnerProfileData } from "./hooks/usePartnerProfileData";
import PartnerQuestionnaireLayout from "./components/PartnerQuestionnaireLayout";
import { PartnerFlowProvider } from "./context/FlowContext";
import PartnerStepper from "@/components/PartnerStepper";

// Feature flag for new stepper system
const USE_STEPPER_FLOW = true;

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


  // Use new stepper system if flag is enabled
  if (USE_STEPPER_FLOW) {
    return (
      <PartnerStepper
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
        onComplete={handleComplete}
      />
    );
  }

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