
import { useProgressiveAccess } from './useProgressiveAccess';
import { useDashboardModalState } from './useDashboardModalState';
import { useDashboardModalHandlers } from './useDashboardModalHandlers';
import { useProfileCompletion } from './useProfileCompletion';
import { useEffect } from 'react';

export const useDashboardModals = () => {
  const modalState = useDashboardModalState();
  const { calculateYourCompletion, calculatePartnerCompletion } = useProfileCompletion();
  
  const { 
    shouldShowSignUpModal, 
    blockingAction, 
    closeSignUpModal,
    accessLevel,
    profileCompletion
  } = useProgressiveAccess();

  const modalHandlers = useDashboardModalHandlers({
    setActiveTab: modalState.setActiveTab,
    setShowQuestionnaireModal: modalState.setShowQuestionnaireModal,
    setShowPartnerQuestionnaireModal: modalState.setShowPartnerQuestionnaireModal,
    setShowPersonalCompletionOptions: modalState.setShowPersonalCompletionOptions,
    setShowPartnerCompletionOptions: modalState.setShowPartnerCompletionOptions,
    suppressPartnerCompletionPopup: modalState.suppressPartnerCompletionPopup,
    setSuppressPartnerCompletionPopup: modalState.setSuppressPartnerCompletionPopup
  });

  // Add sign-in modal state management
  const { showSignInModal, setShowSignInModal } = modalState;

  const openSignInModal = () => {
    setShowSignInModal(true);
  };

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  // Auto-hide personal completion popup when both profiles are complete
  useEffect(() => {
    const yourCompletion = calculateYourCompletion();
    const partnerCompletion = calculatePartnerCompletion();
    
    if (yourCompletion === 100 && partnerCompletion === 100 && modalState.showPersonalCompletionOptions) {
      console.log('Both profiles complete, auto-hiding personal completion popup');
      modalState.setShowPersonalCompletionOptions(false);
    }
  }, [calculateYourCompletion, calculatePartnerCompletion, modalState.showPersonalCompletionOptions, modalState.setShowPersonalCompletionOptions]);

  // Don't blur background when personal completion popup shows but both profiles are complete
  const bothProfilesComplete = calculateYourCompletion() === 100 && calculatePartnerCompletion() === 100;
  const shouldIgnorePersonalPopup = bothProfilesComplete && modalState.showPersonalCompletionOptions;

  const isAnyModalOpen = shouldShowSignUpModal || 
    showSignInModal ||
    modalState.showQuestionnaireModal || 
    modalState.showPartnerQuestionnaireModal || 
    (modalState.showPersonalCompletionOptions && !shouldIgnorePersonalPopup) || 
    modalState.showPartnerCompletionOptions;

  return {
    // Modal state
    ...modalState,
    shouldShowSignUpModal,
    showSignInModal,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    accessLevel,
    profileCompletion,
    isAnyModalOpen,
    // Handler functions and data
    ...modalHandlers
  };
};
