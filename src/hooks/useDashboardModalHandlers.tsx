
import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';

interface ModalStates {
  setActiveTab: (tab: string) => void;
  setShowQuestionnaireModal: (show: boolean) => void;
  setShowPartnerQuestionnaireModal: (show: boolean) => void;
  setShowPersonalCompletionOptions: (show: boolean) => void;
  setShowPartnerCompletionOptions: (show: boolean) => void;
  questionnaireOrigin: 'header' | 'chat' | null;
  setQuestionnaireOrigin: (origin: 'header' | 'chat' | null) => void;
  suppressPartnerCompletionPopup: boolean;
  setSuppressPartnerCompletionPopup: (value: boolean) => void;
  suppressPersonalCompletionPopup: boolean;
  setSuppressPersonalCompletionPopup: (value: boolean) => void;
}

export const useDashboardModalHandlers = (modalStates: ModalStates) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  const handleGoToProfile = (origin: 'header' | 'chat' = 'header') => {
    console.log('Opening profile questionnaire modal from:', origin);
    modalStates.setQuestionnaireOrigin(origin);
    modalStates.setShowQuestionnaireModal(true);
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    modalStates.setActiveTab("insights");
  };

  const handleOpenQuestionnaire = (origin: 'header' | 'chat' = 'header') => {
    console.log('handleOpenQuestionnaire called - setting showQuestionnaireModal to true from:', origin);
    modalStates.setQuestionnaireOrigin(origin);
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
    modalStates.setQuestionnaireOrigin(null);
    
    // If opened from chat, go directly back to chat without popup
    if (modalStates.questionnaireOrigin === 'chat') {
      modalStates.setSuppressPersonalCompletionPopup(true);
      modalStates.setActiveTab("insights");
      // Focus chat input after a brief delay
      setTimeout(() => {
        const chatInput = document.querySelector('textarea[placeholder]') as HTMLTextAreaElement;
        if (chatInput) {
          chatInput.focus();
        }
      }, 100);
    } else if (modalStates.suppressPersonalCompletionPopup) {
      // User has completed profile before, go directly to coach
      modalStates.setActiveTab("insights");
    } else {
      // First time completion from header, show modal and mark as seen
      modalStates.setSuppressPersonalCompletionPopup(true);
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
    modalStates.setQuestionnaireOrigin(null);
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
    modalStates.setActiveTab("insights");
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
