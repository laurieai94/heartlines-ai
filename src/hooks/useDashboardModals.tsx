
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
    setShowPartnerCompletionOptions: modalState.setShowPartnerCompletionOptions
  });

  const isAnyModalOpen = shouldShowSignUpModal || 
    modalState.showQuestionnaireModal || 
    modalState.showPartnerQuestionnaireModal || 
    modalState.showPersonalCompletionOptions || 
    modalState.showPartnerCompletionOptions;

  return {
    // Modal state
    ...modalState,
    shouldShowSignUpModal,
    blockingAction,
    closeSignUpModal,
    accessLevel,
    profileCompletion,
    isAnyModalOpen,
    // Handler functions and data
    ...modalHandlers
  };
};
