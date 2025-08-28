
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedProfileStorage } from "./useUnifiedProfileStorage";

export type AccessLevel = 'preview' | 'profile-required' | 'signup-required' | 'full-access';

export interface ProgressiveAccessState {
  accessLevel: AccessLevel;
  canNavigate: boolean;
  canInteract: boolean;
  profileCompletion: number;
  shouldShowSignUpModal: boolean;
  blockingAction?: string;
}

export const useProgressiveAccess = () => {
  // Be resilient if AuthProvider isn't mounted (e.g., during early render or outside tree)
  let user: any = null;
  try {
    user = useAuth().user;
  } catch {
    user = null;
  }
  const personalStorage = useUnifiedProfileStorage('personal');
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [blockingAction, setBlockingAction] = useState<string>('');

  // Calculate profile completion percentage based on actual data
  const calculateProfileCompletion = () => {
    // Don't calculate until data is loaded
    if (!personalStorage.isReady) {
    return 0;
  }

  let totalFields = 0;
  let completedFields = 0;

  const profileData = personalStorage.profileData;

    if (profileData && Object.keys(profileData).length > 0) {
      // Core personal fields - matching the new questionnaire structure
      const personalFields = [
        'name', 'age', 'gender', 'orientation', 'relationshipStatus',
        'stressResponse', 'loveLanguage', 'attachmentStyle'
      ];
      
      totalFields += personalFields.length;
      
      // Check each field completion
      personalFields.forEach(field => {
        const value = profileData[field];
        if (value && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
          completedFields++;
        }
      });
    }

    const completion = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    return completion;
  };

  // Compute essential info for chat access, resilient to legacy fields
  const computeChatReadiness = () => {
    if (!personalStorage.isReady) return { isComplete: false, missingFields: ['profile loading'] };

    const pd = personalStorage.profileData || {} as any;

    // Basic requirements
    const hasName = !!(pd.name && pd.name.trim() !== '');
    const hasAge = !!(pd.age && pd.age !== '');

    // Coalesce new and legacy fields
    const loveLangArr: any[] = Array.isArray(pd.loveLanguage)
      ? pd.loveLanguage
      : Array.isArray(pd.feelLovedWhen)
        ? pd.feelLovedWhen
        : (pd.loveLanguage || pd.feelLovedWhen ? [pd.loveLanguage || pd.feelLovedWhen] : []);

    const hasStressResponse = Array.isArray(pd.stressResponse) && pd.stressResponse.length > 0;
    const hasAttachmentStyle = !!(pd.attachmentStyle && pd.attachmentStyle !== '');
    const hasLoveLanguage = loveLangArr.length > 0;
    const hasRelationshipStatus = !!(pd.relationshipStatus && pd.relationshipStatus !== '');

    const hasBasicInfo = hasName && hasAge;
    const coreResponses = [hasStressResponse, hasAttachmentStyle, hasLoveLanguage, hasRelationshipStatus].filter(Boolean).length;
    const hasEnoughData = coreResponses >= 3;
    const isComplete = hasBasicInfo && hasEnoughData;

    const missing: string[] = [];
    if (!hasName) missing.push('name');
    if (!hasAge) missing.push('age');

    const coreMissing: string[] = [];
    if (!hasStressResponse) coreMissing.push('stress response');
    if (!hasAttachmentStyle) coreMissing.push('attachment style');
    if (!hasLoveLanguage) coreMissing.push('love language');
    if (!hasRelationshipStatus) coreMissing.push('relationship status');

    console.log('🔐 Chat access check:', {
      hasName, hasAge, hasStressResponse, hasAttachmentStyle, hasLoveLanguage, hasRelationshipStatus,
      coreResponses, isComplete, keys: Object.keys(pd || {})
    });

    // Only include the instruction for core fields if basic info is present
    if (hasBasicInfo && coreMissing.length > 0) {
      missing.push(`add any 3: ${coreMissing.join(', ')}`);
    }

    return { isComplete, missingFields: missing.length ? missing : [] };
  };

  const profileCompletion = calculateProfileCompletion();
  const readiness = computeChatReadiness();
  const hasPersonalProfileForChat = readiness.isComplete;
  const missingFieldsForChat = readiness.missingFields;
  
  // Determine access level based on authentication and profile completion
  const getAccessLevel = (): AccessLevel => {
    // If no user is logged in, require signup
    if (!user) {
      return 'signup-required';
    }
    
    // If user is logged in but doesn't have essential personal profile, require profile completion
    if (!hasPersonalProfileForChat) {
      return 'profile-required';
    }
    
    // User is authenticated and has completed their personal profile
    return 'full-access';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features based on access level
  const checkInteractionPermission = (action: string): boolean => {
    if (accessLevel === 'full-access') {
      return true;
    }
    
    if (action === 'chat') {
      return false;
    }
    
    return true;
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setBlockingAction('');
  };

  return {
    accessLevel,
    canNavigate: true,
    canInteract: accessLevel === 'full-access',
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal,
    hasPersonalProfileForChat,
    missingFieldsForChat
  };
};
