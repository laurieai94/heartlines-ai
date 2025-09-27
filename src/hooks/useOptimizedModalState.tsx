import { useState, useCallback, useMemo } from 'react';

// Simplified modal state management without complex URL synchronization
export const useOptimizedModalState = () => {
  // Core modal states
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showPartnerQuestionnaireModal, setShowPartnerQuestionnaireModal] = useState(false);
  const [showPersonalCompletionOptions, setShowPersonalCompletionOptions] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [questionnaireOrigin, setQuestionnaireOrigin] = useState<'header' | 'chat' | null>(null);
  
  // Persistent suppress flags (lightweight localStorage usage)
  const [suppressPartnerCompletionPopup, setSuppressPartnerCompletionPopupState] = useState(() => {
    try {
      return localStorage.getItem('suppressPartnerCompletionPopup') === 'true';
    } catch {
      return false;
    }
  });

  const [suppressPersonalCompletionPopup, setSuppressPersonalCompletionPopupState] = useState(() => {
    try {
      return localStorage.getItem('suppressPersonalCompletionPopup') === 'true';
    } catch {
      return false;
    }
  });

  // Optimized setters with localStorage persistence
  const setSuppressPartnerCompletionPopup = useCallback((value: boolean) => {
    setSuppressPartnerCompletionPopupState(value);
    try {
      localStorage.setItem('suppressPartnerCompletionPopup', value.toString());
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setSuppressPersonalCompletionPopup = useCallback((value: boolean) => {
    setSuppressPersonalCompletionPopupState(value);
    try {
      localStorage.setItem('suppressPersonalCompletionPopup', value.toString());
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Memoized body scroll management
  const isAnyModalOpen = useMemo(() => 
    showQuestionnaireModal || showPartnerQuestionnaireModal || showSignInModal,
    [showQuestionnaireModal, showPartnerQuestionnaireModal, showSignInModal]
  );

  // Simple body scroll effect without complex dependencies
  useState(() => {
    const updateBodyScroll = () => {
      document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'unset';
    };
    
    updateBodyScroll();
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  });

  return {
    // Modal states
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
    
    // Suppress flags
    suppressPartnerCompletionPopup,
    setSuppressPartnerCompletionPopup,
    suppressPersonalCompletionPopup,
    setSuppressPersonalCompletionPopup,
    
    // Utility
    isAnyModalOpen
  };
};