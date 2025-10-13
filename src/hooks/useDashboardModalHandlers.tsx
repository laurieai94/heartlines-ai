import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';
import { flushSync } from 'react-dom';

interface ModalStates {
  setActiveTab: (tab: string) => void;
  setShowQuestionnaireModal: (show: boolean) => void;
  setShowPartnerQuestionnaireModal: (show: boolean) => void;
  setShowPersonalCompletionOptions: (show: boolean) => void;
  setShowPartnerCompletionOptions: (show: boolean) => void;
  questionnaireOrigin: 'header' | 'chat' | null;
  setQuestionnaireOrigin: (origin: 'header' | 'chat' | null) => void;
  suppressPartnerCompletionPopup: boolean;
  setSuppressPartnerCompletionPopup: (value: boolean) => void;
  suppressPersonalCompletionPopup: boolean;
  setSuppressPersonalCompletionPopup: (value: boolean) => void;
}

export const useDashboardModalHandlers = (modalStates: ModalStates) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  const handleGoToProfile = (origin: 'header' | 'chat' = 'header') => {
    console.log('Opening profile questionnaire modal from:', origin);
    modalStates.setQuestionnaireOrigin(origin);
    modalStates.setShowQuestionnaireModal(true);
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    modalStates.setActiveTab("insights");
  };

  const handleOpenQuestionnaire = (origin: 'header' | 'chat' = 'header') => {
    console.log('handleOpenQuestionnaire called - setting showQuestionnaireModal to true from:', origin);
    modalStates.setQuestionnaireOrigin(origin);
    modalStates.setShowQuestionnaireModal(true);
  };

  const handleOpenPartnerQuestionnaire = () => {
    console.log('handleOpenPartnerQuestionnaire called - setting showPartnerQuestionnaireModal to true');
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal questionnaire completed with data:', questionnaireData);
    
    // CRITICAL: Validate that ALL required fields have actual values
    const completionData = questionnaireData.completionData || {};
    const requiredFields = {
      name: completionData.name,
      pronouns: completionData.pronouns,
      relationshipStatus: completionData.relationshipStatus,
      loveLanguage: completionData.loveLanguage,
      attachmentStyle: completionData.attachmentStyle
    };
    
    // Check each required field for actual values
    const missingFields: string[] = [];
    if (!requiredFields.name || requiredFields.name.trim() === '') missingFields.push('name');
    if (!requiredFields.pronouns || requiredFields.pronouns.trim() === '') missingFields.push('pronouns');
    if (!requiredFields.relationshipStatus || requiredFields.relationshipStatus.trim() === '') missingFields.push('relationship status');
    if (!requiredFields.loveLanguage || !Array.isArray(requiredFields.loveLanguage) || requiredFields.loveLanguage.length === 0) missingFields.push('love language');
    if (!requiredFields.attachmentStyle || requiredFields.attachmentStyle.trim() === '') missingFields.push('attachment style');
    
    if (missingFields.length > 0) {
      console.error('[Validation] Cannot complete - missing required fields:', missingFields);
      toast.error(`Please complete these required fields: ${missingFields.join(', ')}`);
      return; // Block completion and keep modal open
    }
    
    console.log('[Validation] All required fields present:', requiredFields);
    
    // CRITICAL: Close modal IMMEDIATELY after validation passes (optimistic UI)
    console.log('[Complete] Closing modal immediately with flushSync');
    flushSync(() => {
      modalStates.setShowQuestionnaireModal(false);
      modalStates.setQuestionnaireOrigin(null);
      modalStates.setSuppressPersonalCompletionPopup(true);
    });
    
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData.completionData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    const newProfiles = {
      ...temporaryProfiles,
      your: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: mergedData
    };
    
    console.log('Saving complete questionnaire data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    // CRITICAL: Force immediate cache clear and profile update event
    window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
    try {
      const { profileCompletionCache, validationCache, requirementCache } = require('@/utils/calculationCache');
      profileCompletionCache?.clear();
      validationCache?.clear();
      requirementCache?.clear();
    } catch (e) {
      console.error('Cache clear error:', e);
    }
    
    // Multiple dispatches to ensure all listeners catch it
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
    }, 0);
    
    // Store completion flag to prevent modal from reopening during navigation
    sessionStorage.setItem('questionnaire-completing', 'true');
    if (typeof window !== 'undefined' && (window as any).user?.id) {
      sessionStorage.setItem(`questionnaire-completed-${(window as any).user.id}`, Date.now().toString());
    }
    
    // Longer delay to ensure modal is fully closed and state is settled
    setTimeout(() => {
      console.log('[Complete] Navigating to insights tab');
      modalStates.setActiveTab("insights");
      
      // Clear completion flag and focus chat input
      setTimeout(() => {
        sessionStorage.removeItem('questionnaire-completing');
        console.log('[Complete] Completion flow finished');
        
        const chatInput = document.querySelector('textarea[placeholder]') as HTMLTextAreaElement;
        if (chatInput) {
          chatInput.focus();
        }
      }, 150);
    }, 150);
  };

  const handlePartnerQuestionnaireComplete = (questionnaireData: any, skipPopup = false) => {
    console.log('Partner questionnaire completed with data:', questionnaireData);
    
    const existingProfile = temporaryProfiles.partner[0] || {};
    const existingDemographics = temporaryDemographics.partner || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData.completionData,
      completedAt: new Date().toISOString(),
      profileSource: 'partner-questionnaire'
    };
    
    const newProfiles = {
      ...temporaryProfiles,
      partner: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      partner: mergedData
    };
    
    console.log('Saving complete partner questionnaire data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    modalStates.setShowPartnerQuestionnaireModal(false);
    
    if (skipPopup) {
      // Skip the completion modal and go straight to coaching
      modalStates.setActiveTab("insights");
    } else if (modalStates.suppressPartnerCompletionPopup) {
      // Don't show popup if user has chosen to continue editing before
      // Keep questionnaire open - don't close it
      modalStates.setShowPartnerQuestionnaireModal(true);
    } else {
      // Show the completion modal for the first time and mark as seen
      modalStates.setSuppressPartnerCompletionPopup(true);
      modalStates.setShowPartnerCompletionOptions(true);
    }
  };

  const handleQuestionnaireClose = () => {
    console.log('Closing questionnaire modal');
    
    // CRITICAL: Clear completion flag to ensure nudge shows correctly
    sessionStorage.removeItem('questionnaire-completing');
    console.log('[Close] Cleared questionnaire-completing flag');
    
    modalStates.setShowQuestionnaireModal(false);
    modalStates.setQuestionnaireOrigin(null);
  };

  const handlePartnerQuestionnaireClose = () => {
    console.log('Closing partner questionnaire modal');
    modalStates.setShowPartnerQuestionnaireModal(false);
  };

  const handlePersonalCompletionClose = () => {
    modalStates.setShowPersonalCompletionOptions(false);
  };

  const handlePartnerCompletionClose = () => {
    modalStates.setShowPartnerCompletionOptions(false);
  };

  const handlePersonalAddPartnerProfile = () => {
    modalStates.setShowPersonalCompletionOptions(false);
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handlePersonalStartChatting = () => {
    console.log('Starting chat, navigating to coach');
    modalStates.setShowPersonalCompletionOptions(false);
    modalStates.setActiveTab("insights");
  };

  const handlePartnerStartChatting = () => {
    console.log('Starting chat from partner completion, navigating to coach');
    modalStates.setSuppressPartnerCompletionPopup(true);
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setActiveTab("insights");
  };

  const handlePartnerContinueEditing = () => {
    modalStates.setSuppressPartnerCompletionPopup(true);
    modalStates.setShowPartnerCompletionOptions(false);
    modalStates.setShowPartnerQuestionnaireModal(true);
  };

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  return {
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile,
    handleGoToProfile,
    handleGoToCoach,
    handleOpenQuestionnaire,
    handleOpenPartnerQuestionnaire,
    handleQuestionnaireComplete,
    handlePartnerQuestionnaireComplete,
    handleQuestionnaireClose,
    handlePartnerQuestionnaireClose,
    handlePersonalCompletionClose,
    handlePartnerCompletionClose,
    handlePersonalAddPartnerProfile,
    handlePersonalStartChatting,
    handlePartnerStartChatting,
    handlePartnerContinueEditing,
    handleProfileUpdate
  };
};
