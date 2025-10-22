import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';

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
    console.log('[Handler] Personal questionnaire completed with data:', questionnaireData);
    
    // Extract completion data
    const completionData = questionnaireData.completionData || {};
    
    // Log what we received
    console.log('[Handler] Validation check - received fields:', {
      name: completionData.name,
      pronouns: completionData.pronouns,
      relationshipStatus: completionData.relationshipStatus,
      loveLanguage: completionData.loveLanguage,
      attachmentStyle: completionData.attachmentStyle
    });
    
    // CRITICAL: Validate required fields
    const requiredFields = {
      name: completionData.name,
      pronouns: completionData.pronouns,
      relationshipStatus: completionData.relationshipStatus,
      loveLanguage: completionData.loveLanguage,
      attachmentStyle: completionData.attachmentStyle
    };
    
    // Check each required field
    const missingFields: string[] = [];
    if (!requiredFields.name || requiredFields.name.trim() === '') {
      missingFields.push('name');
      console.error('[Validation] Missing name:', requiredFields.name);
    }
    if (!requiredFields.pronouns || requiredFields.pronouns.trim() === '') {
      missingFields.push('pronouns');
      console.error('[Validation] Missing pronouns:', requiredFields.pronouns);
    }
    if (!requiredFields.relationshipStatus || requiredFields.relationshipStatus.trim() === '') {
      missingFields.push('relationship status');
      console.error('[Validation] Missing relationshipStatus:', requiredFields.relationshipStatus);
    }
    if (!requiredFields.loveLanguage || !Array.isArray(requiredFields.loveLanguage) || requiredFields.loveLanguage.length === 0) {
      missingFields.push('love language');
      console.error('[Validation] Missing loveLanguage:', requiredFields.loveLanguage);
    }
    if (!requiredFields.attachmentStyle || requiredFields.attachmentStyle.trim() === '') {
      missingFields.push('attachment style');
      console.error('[Validation] Missing attachmentStyle:', requiredFields.attachmentStyle);
    }
    
    if (missingFields.length > 0) {
      console.error('[Validation] BLOCKING completion - missing required fields:', missingFields);
      console.error('[Validation] Full completion data:', completionData);
      toast.error(`Please complete these required fields: ${missingFields.join(', ')}`);
      return; // Block completion and keep modal open
    }
    
    console.log('[Validation] ✅ All required fields present - proceeding with completion');
    
    // STEP 1: Set completing flag and close modal with slight delay for state stability
    console.log('[Complete] Closing modal');
    sessionStorage.setItem('questionnaire-completing', 'true');
    
    setTimeout(() => {
      modalStates.setShowQuestionnaireModal(false);
      modalStates.setQuestionnaireOrigin(null);
      modalStates.setSuppressPersonalCompletionPopup(true);
    }, 50);
    
    // STEP 2: Clear session flag after delay to prevent reopening
    setTimeout(() => {
      sessionStorage.removeItem('questionnaire-completing');
    }, 150);
    
    // STEP 3: Merge and save data
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...completionData,
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
    
    // STEP 4: SIGNIFICANTLY DELAY cache clear and events to allow modal to fully unmount
    setTimeout(() => {
      // Clear caches after modal has had time to fully unmount
      try {
        const { profileCompletionCache, validationCache, requirementCache } = require('@/utils/calculationCache');
        profileCompletionCache?.clear();
        validationCache?.clear();
        requirementCache?.clear();
        console.log('[Complete] Caches cleared after delay');
      } catch (e) {
        console.error('[Complete] Error clearing caches:', e);
      }
      
      // Dispatch event after modal has fully unmounted
      console.log('[Complete] Dispatching profile:requiredFieldUpdated event');
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
    }, 500);
    
    // STEP 5: Store completion marker
    if (typeof window !== 'undefined' && (window as any).user?.id) {
      sessionStorage.setItem(`questionnaire-completed-${(window as any).user.id}`, Date.now().toString());
    }
    
    // STEP 6: Smart navigation - only if not already on coach page
    const currentPath = window.location.pathname;
    const isOnCoachPage = currentPath.includes('/coach');
    
    if (!isOnCoachPage) {
      console.log('[Complete] Navigating to insights tab');
      modalStates.setActiveTab("insights");
    } else {
      console.log('[Complete] Already on coach page, staying here');
    }
    
    // Focus chat input after brief delay for DOM updates
    setTimeout(() => {
      const chatInput = document.querySelector('textarea[placeholder]') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.focus();
      }
      console.log('[Complete] Completion flow finished');
    }, 300);
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
