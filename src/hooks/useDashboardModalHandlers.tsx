
import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';

interface ModalStates {
  setActiveTab: (tab: string) => void;
  setShowQuestionnaireModal: (show: boolean) => void;
  setShowPartnerQuestionnaireModal: (show: boolean) => void;
  setShowPersonalCompletionOptions: (show: boolean) => void;
  setShowPartnerCompletionOptions: (show: boolean) => void;
}

export const useDashboardModalHandlers = (modalStates: ModalStates) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

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
    modalStates.setShowPersonalCompletionOptions(true);
  };

  const handlePartnerQuestionnaireComplete = (questionnaireData: any) => {
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
    
    // Save to localStorage with the key that usePartnerProfileData expects
    try {
      localStorage.setItem('partner_profile_questionnaire', JSON.stringify(mergedData));
      console.log('Successfully saved partner data to localStorage with key "partner_profile_questionnaire":', mergedData);
    } catch (error) {
      console.error('Error saving partner data to localStorage:', error);
    }
    
    modalStates.setShowPartnerQuestionnaireModal(false);
    modalStates.setShowPartnerCompletionOptions(true);
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
    modalStates.setActiveTab("insights");
  };

  const handlePartnerStartChatting = () => {
    console.log('Starting chat from partner completion, navigating to coach');
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setActiveTab("insights");
  };

  const handlePartnerUpdatePersonalProfile = () => {
    console.log('Opening personal questionnaire from partner completion');
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setShowQuestionnaireModal(true);
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
    handlePartnerUpdatePersonalProfile,
    handleProfileUpdate
  };
};
