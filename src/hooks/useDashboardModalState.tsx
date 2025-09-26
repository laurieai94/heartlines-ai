
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useDashboardModalState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Map URL paths to tab values
  const getTabFromPath = (pathname: string) => {
    if (pathname.includes('/coach')) return 'insights';
    if (pathname.includes('/practice')) return 'conversation';
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/privacy')) return 'privacy';
    return 'home'; // default
  };

  // Map tab values to URL paths
  const getPathFromTab = (tab: string) => {
    switch (tab) {
      case 'insights': return '/coach';
      case 'conversation': return '/practice';
      case 'profile': return '/profile';
      case 'privacy': return '/privacy';
      default: return '/';
    }
  };

  const [activeTab, setActiveTabState] = useState(() => getTabFromPath(location.pathname));
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPartnerQuestionnaireModal, setShowPartnerQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [questionnaireOrigin, setQuestionnaireOrigin] = useState<'header' | 'chat' | null>(null);
  
  // Persistent suppress flag for partner completion popup
  const [suppressPartnerCompletionPopup, setSuppressPartnerCompletionPopupState] = useState(() => {
    const stored = localStorage.getItem('suppressPartnerCompletionPopup');
    return stored === 'true';
  });

  const setSuppressPartnerCompletionPopup = (value: boolean) => {
    setSuppressPartnerCompletionPopupState(value);
    localStorage.setItem('suppressPartnerCompletionPopup', value.toString());
  };
  
  // Persistent suppress flag for personal completion popup
  const [suppressPersonalCompletionPopup, setSuppressPersonalCompletionPopupState] = useState(() => {
    const stored = localStorage.getItem('suppressPersonalCompletionPopup');
    return stored === 'true';
  });

  const setSuppressPersonalCompletionPopup = (value: boolean) => {
    setSuppressPersonalCompletionPopupState(value);
    localStorage.setItem('suppressPersonalCompletionPopup', value.toString());
  };

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

  // EMERGENCY: Throttled body scroll management to prevent blocking
  useEffect(() => {
    const isAnyModalOpen = showQuestionnaireModal || showPartnerQuestionnaireModal || showSignInModal;
    
    // EMERGENCY: Use requestAnimationFrame to prevent blocking
    requestAnimationFrame(() => {
      if (isAnyModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    });

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuestionnaireModal, showPartnerQuestionnaireModal, showSignInModal]);

  // EMERGENCY: Simplified URL synchronization to prevent cascading updates
  useEffect(() => {
    const tabFromPath = getTabFromPath(location.pathname);
    if (tabFromPath !== activeTab) {
      setActiveTabState(tabFromPath);
    }
  }, [location.pathname]);

  // EMERGENCY: Separate effect for state handling to prevent loops
  useEffect(() => {
    if (location.state?.activeTab && location.state.activeTab !== activeTab) {
      const newTab = location.state.activeTab;
      setActiveTabState(newTab);
      // EMERGENCY: Use timeout to prevent blocking
      requestAnimationFrame(() => {
        navigate(getPathFromTab(newTab), { replace: true });
      });
    }
  }, [location.state?.activeTab]);

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
    setShowSignInModal,
    questionnaireOrigin,
    setQuestionnaireOrigin,
    suppressPartnerCompletionPopup,
    setSuppressPartnerCompletionPopup,
    suppressPersonalCompletionPopup,
    setSuppressPersonalCompletionPopup
  };
};
