import { useCallback, useMemo } from 'react';
import { useProgressiveAccess } from './useProgressiveAccess';
import { useDashboardModalState } from './useDashboardModalState';
import { useDashboardModalHandlers } from './useDashboardModalHandlers';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardModals = () => {
  const modalState = useDashboardModalState();
  const { user } = useAuth();
  
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
    questionnaireOrigin: modalState.questionnaireOrigin,
    setQuestionnaireOrigin: modalState.setQuestionnaireOrigin,
    suppressPartnerCompletionPopup: modalState.suppressPartnerCompletionPopup,
    setSuppressPartnerCompletionPopup: modalState.setSuppressPartnerCompletionPopup,
    suppressPersonalCompletionPopup: modalState.suppressPersonalCompletionPopup,
    setSuppressPersonalCompletionPopup: modalState.setSuppressPersonalCompletionPopup,
    user
  });

  // Add sign-in modal state management
  const { showSignInModal, setShowSignInModal } = modalState;

  const openSignInModal = useCallback(() => {
    setShowSignInModal(true);
  }, [setShowSignInModal]);

  const closeSignInModal = useCallback(() => {
    setShowSignInModal(false);
  }, [setShowSignInModal]);

  const isAnyModalOpen = useMemo(() => 
    shouldShowSignUpModal || 
    showSignInModal ||
    modalState.showQuestionnaireModal || 
    modalState.showPartnerQuestionnaireModal || 
    modalState.showPersonalCompletionOptions || 
    modalState.showPartnerCompletionOptions,
    [
      shouldShowSignUpModal,
      showSignInModal,
      modalState.showQuestionnaireModal,
      modalState.showPartnerQuestionnaireModal,
      modalState.showPersonalCompletionOptions,
      modalState.showPartnerCompletionOptions
    ]
  );

  return useMemo(() => ({
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
  }), [
    modalState,
    shouldShowSignUpModal,
    showSignInModal,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    accessLevel,
    profileCompletion,
    isAnyModalOpen,
    modalHandlers
  ]);
};
