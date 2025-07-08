import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProgressiveAccess } from './useProgressiveAccess';
import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';

export const useDashboardModals = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPartnerQuestionnaireModal, setShowPartnerQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);
  
  const { 
    shouldShowSignUpModal, 
    blockingAction, 
    closeSignUpModal,
    accessLevel,
    profileCompletion
  } = useProgressiveAccess();
  
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  // Debug logging for modal state changes
  useEffect(() => {
    console.log('Modal state changed - showQuestionnaireModal:', showQuestionnaireModal);
  }, [showQuestionnaireModal]);

  useEffect(() => {
    console.log('Modal state changed - showPartnerQuestionnaireModal:', showPartnerQuestionnaireModal);
  }, [showPartnerQuestionnaireModal]);

  // Prevent body scroll when questionnaire modal is open
  useEffect(() => {
    if (showQuestionnaireModal || showPartnerQuestionnaireModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuestionnaireModal, showPartnerQuestionnaireModal]);

  // Handle redirect from profile completion
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const isAnyModalOpen = shouldShowSignUpModal || showQuestionnaireModal || showPartnerQuestionnaireModal || showPersonalCompletionOptions || showPartnerCompletionOptions;

  // Handler functions - merged from useDashboardHandlers
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
    
    // CRITICAL FIX: Also save to localStorage with the key that usePartnerProfileData expects
    try {
      localStorage.setItem('partner_profile_questionnaire', JSON.stringify(mergedData));
      console.log('Successfully saved partner data to localStorage with key "partner_profile_questionnaire":', mergedData);
    } catch (error) {
      console.error('Error saving partner data to localStorage:', error);
    }
    
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
    activeTab,
    setActiveTab,
    showQuestionnaireModal,
    setShowQuestionnaireModal,
    showPartnerQuestionnaireModal,
    setShowPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    setShowPersonalCompletionOptions,
    showPartnerCompletionOptions,
    setShowPartnerCompletionOptions,
    shouldShowSignUpModal,
    blockingAction,
    closeSignUpModal,
    accessLevel,
    profileCompletion,
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile,
    isAnyModalOpen,
    // Handler functions
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
