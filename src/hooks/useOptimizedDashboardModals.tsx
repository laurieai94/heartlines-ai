import { useCallback, useState } from 'react';
import { useOptimizedModalState } from './useOptimizedModalState';
import { useOptimizedProgressiveAccess } from './useOptimizedProgressiveAccess';

export const useOptimizedDashboardModals = () => {
  const modalState = useOptimizedModalState();
  const progressiveAccess = useOptimizedProgressiveAccess();
  
  // Add missing state for dashboard functionality
  const [activeTab, setActiveTab] = useState<'profile' | 'coach' | 'insights'>('profile');
  
  // Type-safe activeTab setter
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'profile' | 'coach' | 'insights');
  }, []);

  // Optimized modal handlers with proper memoization
  const handleSignInClick = useCallback(() => {
    modalState.setShowSignInModal(true);
  }, [modalState.setShowSignInModal]);

  const handleOpenProfile = useCallback(() => {
    if (progressiveAccess.checkInteractionPermission('profile')) {
      modalState.setShowQuestionnaireModal(true);
      modalState.setQuestionnaireOrigin('header');
    }
  }, [progressiveAccess.checkInteractionPermission, modalState.setShowQuestionnaireModal, modalState.setQuestionnaireOrigin]);

  const goToPartner = useCallback(() => {
    if (progressiveAccess.checkInteractionPermission('partner')) {
      modalState.setShowPartnerQuestionnaireModal(true);
    }
  }, [progressiveAccess.checkInteractionPermission, modalState.setShowPartnerQuestionnaireModal]);

  // Navigation handlers
  const handleGoToProfile = useCallback(() => {
    setActiveTab('profile');
  }, []);

  const handleGoToCoach = useCallback(() => {
    setActiveTab('coach');
  }, []);

  // Optimized modal close handlers
  const handleCloseQuestionnaire = useCallback(() => {
    modalState.setShowQuestionnaireModal(false);
  }, [modalState.setShowQuestionnaireModal]);

  const handleClosePartnerQuestionnaire = useCallback(() => {
    modalState.setShowPartnerQuestionnaireModal(false);
  }, [modalState.setShowPartnerQuestionnaireModal]);

  const handleCloseSignIn = useCallback(() => {
    modalState.setShowSignInModal(false);
  }, [modalState.setShowSignInModal]);

  const handleClosePersonalCompletionOptions = useCallback(() => {
    modalState.setShowPersonalCompletionOptions(false);
  }, [modalState.setShowPersonalCompletionOptions]);

  const handleClosePartnerCompletionOptions = useCallback(() => {
    modalState.setShowPartnerCompletionOptions(false);
  }, [modalState.setShowPartnerCompletionOptions]);

  // Questionnaire handlers
  const handleOpenQuestionnaire = useCallback((origin?: 'header' | 'chat') => {
    modalState.setShowQuestionnaireModal(true);
    if (origin) modalState.setQuestionnaireOrigin(origin);
  }, [modalState.setShowQuestionnaireModal, modalState.setQuestionnaireOrigin]);

  const handleOpenPartnerQuestionnaire = useCallback(() => {
    modalState.setShowPartnerQuestionnaireModal(true);
  }, [modalState.setShowPartnerQuestionnaireModal]);

  const handleQuestionnaireComplete = useCallback(() => {
    modalState.setShowQuestionnaireModal(false);
  }, [modalState.setShowQuestionnaireModal]);

  const handlePartnerQuestionnaireComplete = useCallback(() => {
    modalState.setShowPartnerQuestionnaireModal(false);
  }, [modalState.setShowPartnerQuestionnaireModal]);

  // Completion handlers - simplified for optimization
  const handlePersonalAddPartnerProfile = useCallback(() => {
    modalState.setShowPersonalCompletionOptions(false);
    modalState.setShowPartnerQuestionnaireModal(true);
  }, [modalState.setShowPersonalCompletionOptions, modalState.setShowPartnerQuestionnaireModal]);

  const handlePersonalStartChatting = useCallback(() => {
    modalState.setShowPersonalCompletionOptions(false);
    setActiveTab('coach');
  }, [modalState.setShowPersonalCompletionOptions]);

  const handlePartnerStartChatting = useCallback(() => {
    modalState.setShowPartnerCompletionOptions(false);
    setActiveTab('coach');
  }, [modalState.setShowPartnerCompletionOptions]);

  const handlePartnerContinueEditing = useCallback(() => {
    modalState.setShowPartnerCompletionOptions(false);
    modalState.setShowPartnerQuestionnaireModal(true);
  }, [modalState.setShowPartnerCompletionOptions, modalState.setShowPartnerQuestionnaireModal]);

  // Placeholder handlers for compatibility
  const handleProfileUpdate = useCallback(() => {
    // Optimized: minimal profile update handling
  }, []);

  return {
    // Modal state
    ...modalState,
    
    // Progressive access
    ...progressiveAccess,
    
    // Tab management
    activeTab,
    setActiveTab: handleTabChange,
    
    // Compatibility properties - simplified for optimization
    temporaryProfiles: {},
    temporaryDemographics: {},
    shouldShowSignUpModal: progressiveAccess.shouldShowSignUpModal,
    blockingAction: progressiveAccess.blockingAction,
    closeSignUpModal: progressiveAccess.closeSignUpModal,
    closeSignInModal: handleCloseSignIn,
    openSignInModal: handleSignInClick,
    
    // Optimized handlers
    handleSignInClick,
    handleOpenProfile,
    goToPartner,
    handleGoToProfile,
    handleGoToCoach,
    handleCloseQuestionnaire,
    handleClosePartnerQuestionnaire,
    handleCloseSignIn,
    handleClosePersonalCompletionOptions,
    handleClosePartnerCompletionOptions,
    handleOpenQuestionnaire,
    handleOpenPartnerQuestionnaire,
    handleQuestionnaireComplete,
    handlePartnerQuestionnaireComplete,
    handleQuestionnaireClose: handleCloseQuestionnaire,
    handlePartnerQuestionnaireClose: handleClosePartnerQuestionnaire,
    handlePersonalCompletionClose: handleClosePersonalCompletionOptions,
    handlePartnerCompletionClose: handleClosePartnerCompletionOptions,
    handlePersonalAddPartnerProfile,
    handlePersonalStartChatting,
    handlePartnerStartChatting,
    handlePartnerContinueEditing,
    handleProfileUpdate
  };
};