
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
  const { showSignInModal, setShowSignInModal } = modalState;

  const openSignInModal = () => {
    setShowSignInModal(true);
  };

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  const isAnyModalOpen = shouldShowSignUpModal || 
    showSignInModal ||
    modalState.showQuestionnaireModal || 
    modalState.showPartnerQuestionnaireModal || 
    modalState.showPersonalCompletionOptions || 
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
