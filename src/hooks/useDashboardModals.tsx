
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProgressiveAccess } from './useProgressiveAccess';
import { useTemporaryProfile } from './useTemporaryProfile';

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
    isAnyModalOpen
  };
};
