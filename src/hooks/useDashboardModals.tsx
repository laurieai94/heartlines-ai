import { useCallback, useMemo } from 'react';
import { useProgressiveAccess } from './useProgressiveAccess';
import { useDashboardModalState } from './useDashboardModalState';
import { useDashboardModalHandlers } from './useDashboardModalHandlers';

export const useDashboardModals = () => {
  const modalState = useDashboardModalState();
  
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
    setSuppressPersonalCompletionPopup: modalState.setSuppressPersonalCompletionPopup
  });

  // Add sign-in modal state management
  const { showSignInModal, setShowSignInModal, showWelcomeDialog, setShowWelcomeDialog } = modalState;

  const openSignInModal = useCallback(() => {
    setShowSignInModal(true);
  }, [setShowSignInModal]);

  const closeSignInModal = useCallback(() => {
    setShowSignInModal(false);
  }, [setShowSignInModal]);

  // Welcome dialog handlers
  const closeWelcomeDialog = useCallback(() => {
    setShowWelcomeDialog(false);
  }, [setShowWelcomeDialog]);

  const handleWelcomeDialogContinue = useCallback(() => {
    setShowWelcomeDialog(false);
    // Small delay to ensure welcome dialog closes before questionnaire opens
    setTimeout(() => {
      modalHandlers.handleOpenQuestionnaire('header');
    }, 100);
  }, [setShowWelcomeDialog, modalHandlers]);

  const isAnyModalOpen = useMemo(() => 
    shouldShowSignUpModal || 
    showSignInModal ||
    showWelcomeDialog ||
    modalState.showQuestionnaireModal || 
    modalState.showPartnerQuestionnaireModal || 
    modalState.showPersonalCompletionOptions || 
    modalState.showPartnerCompletionOptions,
    [
      shouldShowSignUpModal,
      showSignInModal,
      showWelcomeDialog,
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
    showWelcomeDialog,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    closeWelcomeDialog,
    handleWelcomeDialogContinue,
    accessLevel,
    profileCompletion,
    isAnyModalOpen,
    // Handler functions and data
    ...modalHandlers
  }), [
    modalState,
    shouldShowSignUpModal,
    showSignInModal,
    showWelcomeDialog,
    blockingAction,
    closeSignUpModal,
    closeSignInModal,
    openSignInModal,
    closeWelcomeDialog,
    handleWelcomeDialogContinue,
    accessLevel,
    profileCompletion,
    isAnyModalOpen,
    modalHandlers
  ]);
};
