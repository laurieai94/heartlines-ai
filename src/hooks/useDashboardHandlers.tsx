
import { useDashboardModals } from './useDashboardModals';

export const useDashboardHandlers = () => {
  const {
    setActiveTab,
    setShowQuestionnaireModal,
    setShowPartnerQuestionnaireModal,
    setShowPersonalCompletionOptions,
    setShowPartnerCompletionOptions,
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile
  } = useDashboardModals();

  const handleGoToProfile = () => {
    console.log('Navigating to profile tab');
    setActiveTab("profile");
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    setActiveTab("insights");
  };

  const handleOpenQuestionnaire = () => {
    console.log('handleOpenQuestionnaire called - setting showQuestionnaireModal to true');
    setShowQuestionnaireModal(true);
  };

  const handleOpenPartnerQuestionnaire = () => {
    console.log('handleOpenPartnerQuestionnaire called - setting showPartnerQuestionnaireModal to true');
    setShowPartnerQuestionnaireModal(true);
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
    
    setShowQuestionnaireModal(false);
    setShowPersonalCompletionOptions(true);
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
    
    setShowPartnerQuestionnaireModal(false);
    setShowPartnerCompletionOptions(true);
  };

  const handleQuestionnaireClose = () => {
    console.log('Closing questionnaire modal');
    setShowQuestionnaireModal(false);
  };

  const handlePartnerQuestionnaireClose = () => {
    console.log('Closing partner questionnaire modal');
    setShowPartnerQuestionnaireModal(false);
  };

  const handlePersonalCompletionClose = () => {
    setShowPersonalCompletionOptions(false);
  };

  const handlePartnerCompletionClose = () => {
    setShowPartnerCompletionOptions(false);
  };

  const handlePersonalAddPartnerProfile = () => {
    setShowPersonalCompletionOptions(false);
    setShowPartnerQuestionnaireModal(true);
  };

  const handlePersonalStartChatting = () => {
    console.log('Starting chat, navigating to coach');
    setShowPersonalCompletionOptions(false);
    setActiveTab("insights");
  };

  const handlePartnerStartChatting = () => {
    console.log('Starting chat from partner completion, navigating to coach');
    setShowPartnerCompletionOptions(false);
    setActiveTab("insights");
  };

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  return {
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
    handleProfileUpdate
  };
};
