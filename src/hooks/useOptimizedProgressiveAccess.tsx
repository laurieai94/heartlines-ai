import { useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedProfileStore, PersonalProfileOptimized } from "./useOptimizedProfileStore";

export type AccessLevel = 'preview' | 'profile-required' | 'signup-required' | 'full-access';

export interface ProgressiveAccessState {
  accessLevel: AccessLevel;
  canNavigate: boolean;
  canInteract: boolean;
  profileCompletion: number;
  shouldShowSignUpModal: boolean;
  blockingAction?: string;
}

// Lightweight profile completion calculation
const calculateCompletion = (profileData: any): number => {
  if (!profileData || Object.keys(profileData).length === 0) return 0;
  
  const requiredFields = ['name', 'age', 'relationshipStatus'];
  const completedFields = requiredFields.filter(field => 
    profileData[field] && profileData[field] !== ''
  );
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

// Check if profile is sufficient for chat
const isProfileChatReady = (profileData: PersonalProfileOptimized): boolean => {
  if (!profileData) return false;
  
  return !!(
    profileData.name &&
    profileData.age &&
    profileData.relationshipStatus
  );
};

export const useOptimizedProgressiveAccess = () => {
  const { user } = useAuth();
  const { profileData, isReady } = useOptimizedProfileStore('personal');
  
  // Memoized calculations to prevent unnecessary recalculations
  const profileCompletion = useMemo(() => 
    isReady ? calculateCompletion(profileData) : 0,
    [profileData, isReady]
  );
  
  const hasPersonalProfileForChat = useMemo(() => 
    isReady ? isProfileChatReady(profileData as PersonalProfileOptimized) : false,
    [profileData, isReady]
  );
  
  const accessLevel = useMemo((): AccessLevel => {
    if (!user) return 'signup-required';
    if (!hasPersonalProfileForChat) return 'profile-required';
    return 'full-access';
  }, [user, hasPersonalProfileForChat]);
  
  // Memoized permission checker
  const checkInteractionPermission = useCallback((action: string): boolean => {
    return accessLevel === 'full-access';
  }, [accessLevel]);
  
  // Memoized missing fields for chat
  const missingFieldsForChat = useMemo(() => {
    if (hasPersonalProfileForChat) return [];
    
    const personalData = profileData as PersonalProfileOptimized;
    const missing: string[] = [];
    if (!personalData?.name) missing.push('Name');
    if (!personalData?.age) missing.push('Age');
    if (!personalData?.relationshipStatus) missing.push('Relationship Status');
    
    return missing;
  }, [profileData, hasPersonalProfileForChat]);
  
  return {
    accessLevel,
    canNavigate: true,
    canInteract: accessLevel === 'full-access',
    profileCompletion,
    shouldShowSignUpModal: false,
    blockingAction: null,
    checkInteractionPermission,
    closeSignUpModal: () => {},
    hasPersonalProfileForChat,
    missingFieldsForChat,
    incompleteSections: hasPersonalProfileForChat ? [] : [1],
    detailedProgress: profileCompletion
  };
};