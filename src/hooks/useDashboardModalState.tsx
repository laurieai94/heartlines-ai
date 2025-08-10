
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useDashboardModalState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Map URL paths to tab values
  const getTabFromPath = (pathname: string) => {
    if (pathname.includes('/dashboard/home')) return 'home';
    if (pathname.includes('/dashboard/profile')) return 'profile';
    if (pathname.includes('/dashboard/coach')) return 'insights';
    if (pathname.includes('/dashboard/practice')) return 'conversation';
    if (pathname.includes('/dashboard/actions')) return 'actions';
    return 'home'; // default
  };

  // Map tab values to URL paths
  const getPathFromTab = (tab: string) => {
    switch (tab) {
      case 'home': return '/dashboard/home';
      case 'profile': return '/dashboard/profile';
      case 'insights': return '/dashboard/coach';
      case 'conversation': return '/dashboard/practice';
      case 'actions': return '/dashboard/actions';
      default: return '/dashboard/home';
    }
  };

  const [activeTab, setActiveTabState] = useState(() => getTabFromPath(location.pathname));
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPartnerQuestionnaireModal, setShowPartnerQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Debug logging for modal state changes
  useEffect(() => {
    console.log('Modal state changed - showQuestionnaireModal:', showQuestionnaireModal);
  }, [showQuestionnaireModal]);

  useEffect(() => {
    console.log('Modal state changed - showPartnerQuestionnaireModal:', showPartnerQuestionnaireModal);
  }, [showPartnerQuestionnaireModal]);

  // Debug logging for completion options
  useEffect(() => {
    console.log('Modal state changed - showPersonalCompletionOptions:', showPersonalCompletionOptions);
  }, [showPersonalCompletionOptions]);

  useEffect(() => {
    console.log('Modal state changed - showPartnerCompletionOptions:', showPartnerCompletionOptions);
  }, [showPartnerCompletionOptions]);

  // Prevent body scroll when questionnaire modal is open
  useEffect(() => {
    if (showQuestionnaireModal || showPartnerQuestionnaireModal || showSignInModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuestionnaireModal, showPartnerQuestionnaireModal, showSignInModal]);

  // Sync activeTab with URL
  useEffect(() => {
    const tabFromPath = getTabFromPath(location.pathname);
    setActiveTabState(tabFromPath);
  }, [location.pathname]);

  // Handle redirect from profile completion
  useEffect(() => {
    if (location.state?.activeTab) {
      const newTab = location.state.activeTab;
      setActiveTabState(newTab);
      navigate(getPathFromTab(newTab), { replace: true });
    }
  }, [location.state, navigate]);

  // Custom setActiveTab that also updates URL
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    navigate(getPathFromTab(tab));
  };

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
    showSignInModal,
    setShowSignInModal
  };
};
