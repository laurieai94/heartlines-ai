
import { useTemporaryProfile } from './useTemporaryProfile';
import { useProfileCompletion } from './useProfileCompletion';
import { toast } from 'sonner';

interface ModalStates {
  setActiveTab: (tab: string) => void;
  setShowQuestionnaireModal: (show: boolean) => void;
  setShowPartnerQuestionnaireModal: (show: boolean) => void;
  setShowPersonalCompletionOptions: (show: boolean) => void;
  setShowPartnerCompletionOptions: (show: boolean) => void;
  suppressPartnerCompletionPopup: boolean;
  setSuppressPartnerCompletionPopup: (value: boolean) => void;
}

export const useDashboardModalHandlers = (modalStates: ModalStates) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  const { calculatePartnerCompletion } = useProfileCompletion();

  const handleGoToProfile = () => {
    console.log('Navigating to profile tab');
    modalStates.setActiveTab("profile");
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    modalStates.setActiveTab("insights");
  };

  const handleOpenQuestionnaire = () => {
    console.log('handleOpenQuestionnaire called - setting showQuestionnaireModal to true');
    modalStates.setShowQuestionnaireModal(true);
  };

  const handleOpenPartnerQuestionnaire = () => {
    console.log('handleOpenPartnerQuestionnaire called - setting showPartnerQuestionnaireModal to true');
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal questionnaire completed with data:', questionnaireData);
    
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData.completionData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    const newProfiles = {
      ...temporaryProfiles,
      your: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: mergedData
    };
    
    console.log('Saving complete questionnaire data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    modalStates.setShowQuestionnaireModal(false);
    
    // Check if partner profile is complete - if so, redirect straight to coach
    const partnerCompletion = calculatePartnerCompletion();
    if (partnerCompletion === 100) {
      console.log('Partner profile is complete, redirecting to coach');
      modalStates.setActiveTab("insights");
    } else {
      modalStates.setShowPersonalCompletionOptions(true);
    }
  };

  const handlePartnerQuestionnaireComplete = (questionnaireData: any, skipPopup = false) => {
    console.log('Partner questionnaire completed with data:', questionnaireData);
    
    const existingProfile = temporaryProfiles.partner[0] || {};
    const existingDemographics = temporaryDemographics.partner || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData.completionData,
      completedAt: new Date().toISOString(),
      profileSource: 'partner-questionnaire'
    };
    
    const newProfiles = {
      ...temporaryProfiles,
      partner: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      partner: mergedData
    };
    
    console.log('Saving complete partner questionnaire data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    modalStates.setShowPartnerQuestionnaireModal(false);
    
    if (skipPopup) {
      // Skip the completion modal and go straight to coaching
      modalStates.setActiveTab("insights");
    } else if (modalStates.suppressPartnerCompletionPopup) {
      // Don't show popup if user has chosen to continue editing before
      // Keep questionnaire open - don't close it
      modalStates.setShowPartnerQuestionnaireModal(true);
    } else {
      // Show the completion modal for the first time and mark as seen
      modalStates.setSuppressPartnerCompletionPopup(true);
      modalStates.setShowPartnerCompletionOptions(true);
    }
  };

  const handleQuestionnaireClose = () => {
    console.log('Closing questionnaire modal');
    modalStates.setShowQuestionnaireModal(false);
  };

  const handlePartnerQuestionnaireClose = () => {
    console.log('Closing partner questionnaire modal');
    modalStates.setShowPartnerQuestionnaireModal(false);
  };

  const handlePersonalCompletionClose = () => {
    modalStates.setShowPersonalCompletionOptions(false);
  };

  const handlePartnerCompletionClose = () => {
    modalStates.setShowPartnerCompletionOptions(false);
  };

  const handlePersonalAddPartnerProfile = () => {
    modalStates.setShowPersonalCompletionOptions(false);
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handlePersonalStartChatting = () => {
    console.log('Starting chat, navigating to coach');
    modalStates.setShowPersonalCompletionOptions(false);
    
    // Check if partner profile is complete - if so, redirect straight to coach
    const partnerCompletion = calculatePartnerCompletion();
    if (partnerCompletion === 100) {
      console.log('Partner profile is complete, redirecting to coach');
      modalStates.setActiveTab("insights");
    } else {
      // Partner profile not complete, stay on current tab for now
      modalStates.setActiveTab("insights");
    }
  };

  const handlePartnerStartChatting = () => {
    console.log('Starting chat from partner completion, navigating to coach');
    modalStates.setSuppressPartnerCompletionPopup(true);
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setActiveTab("insights");
  };

  const handlePartnerContinueEditing = () => {
    modalStates.setSuppressPartnerCompletionPopup(true);
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  return {
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile,
    handleGoToProfile,
    handleGoToCoach,
    handleOpenQuestionnaire,
    handleOpenPartnerQuestionnaire,
    handleQuestionnaireComplete,
    handlePartnerQuestionnaireComplete,
    handleQuestionnaireClose,
    handlePartnerQuestionnaireClose,
    handlePersonalCompletionClose,
    handlePartnerCompletionClose,
    handlePersonalAddPartnerProfile,
    handlePersonalStartChatting,
    handlePartnerStartChatting,
    handlePartnerContinueEditing,
    handleProfileUpdate
  };
};
