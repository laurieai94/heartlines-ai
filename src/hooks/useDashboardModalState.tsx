
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardModalState = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPartnerQuestionnaireModal, setShowPartnerQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);

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

  const modalStates = {
    activeTab,
    showQuestionnaireModal,
    showPartnerQuestionnaireModal,
    showPersonalCompletionOptions,
    showPartnerCompletionOptions
  };

  const modalSetters = {
    setActiveTab,
    setShowQuestionnaireModal,
    setShowPartnerQuestionnaireModal,
    setShowPersonalCompletionOptions,
    setShowPartnerCompletionOptions
  };

  return {
    ...modalStates,
    ...modalSetters
  };
};
