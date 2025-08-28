
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

  // Check if personal profile has essential information for chat access
  const hasEssentialPersonalProfile = () => {
    if (!personalStorage.isReady) {
      return false;
    }
    
    const profileData = personalStorage.profileData;
    
    // Basic requirements
    const hasName = profileData?.name && profileData.name.trim() !== '';
    const hasAge = profileData?.age && profileData.age !== '';
    
    // Core questionnaire fields that indicate completion
    const hasStressResponse = Array.isArray(profileData?.stressResponse) && profileData.stressResponse.length > 0;
    const hasAttachmentStyle = profileData?.attachmentStyle && profileData.attachmentStyle !== '';
    const hasLoveLanguage = Array.isArray(profileData?.loveLanguage) && profileData.loveLanguage.length > 0;
    const hasRelationshipStatus = profileData?.relationshipStatus && profileData.relationshipStatus !== '';
    
    
    // Must have basic info AND at least 3 core questionnaire responses
    const hasBasicInfo = hasName && hasAge;
    const coreResponses = [hasStressResponse, hasAttachmentStyle, hasLoveLanguage, hasRelationshipStatus].filter(Boolean).length;
    const hasEnoughData = coreResponses >= 3;
    
    const isComplete = hasBasicInfo && hasEnoughData;
    return isComplete;
  };

  const profileCompletion = calculateProfileCompletion();
  const hasPersonalProfileForChat = hasEssentialPersonalProfile();
  
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
    hasPersonalProfileForChat
  };
};
