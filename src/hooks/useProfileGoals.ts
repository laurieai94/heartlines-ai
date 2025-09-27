import { useMemo } from 'react';
import { ProfileGoalsUtility, DerivedGoals, ProfileGoals } from '@/utils/profileGoals';
import { PersonalProfileV2, PartnerProfileV2 } from '@/hooks/useProfileStoreV2';

/**
 * Profile Goals Hook - Provides derived goals and coaching priorities
 * Caches derived goals to prevent unnecessary recalculation
 */

export interface UseProfileGoalsReturn {
  derivedGoals: DerivedGoals | null;
  partnerGoals: ProfileGoals | null;
  goalsSummary: string[];
  priorityChallenges: string[];
  hasGoals: boolean;
  isPersonalComplete: boolean;
  isPartnerComplete: boolean;
}

export const useProfileGoals = (
  personalProfile?: PersonalProfileV2,
  partnerProfile?: PartnerProfileV2
): UseProfileGoalsReturn => {
  // Derive personal goals (memoized to prevent recalculation)
  const derivedGoals = useMemo(() => {
    if (!personalProfile || !personalProfile.name) {
      return null;
    }
    
    try {
      return ProfileGoalsUtility.derivePersonalGoals(personalProfile);
    } catch (error) {
      console.warn('Error deriving personal goals:', error);
      return null;
    }
  }, [
    personalProfile?.name,
    personalProfile?.relationshipStatus,
    personalProfile?.loveLanguage,
    personalProfile?.stressResponse,
    personalProfile?.conflictStyle,
    personalProfile?.attachmentStyle,
    personalProfile?.relationshipChallenges,
    personalProfile?.relationshipWorking,
    personalProfile?.datingChallenges
  ]);

  // Derive partner goals (memoized)
  const partnerGoals = useMemo(() => {
    if (!partnerProfile || !partnerProfile.partnerName) {
      return null;
    }
    
    try {
      return ProfileGoalsUtility.derivePartnerGoals(partnerProfile);
    } catch (error) {
      console.warn('Error deriving partner goals:', error);
      return null;
    }
  }, [
    partnerProfile?.partnerName,
    partnerProfile?.partnerLoveLanguage,
    partnerProfile?.partnerCommunicationResponse,
    partnerProfile?.partnerSelfAwareness,
    partnerProfile?.partnerConflictStyle
  ]);

  // Get consolidated goals summary (memoized)
  const goalsSummary = useMemo(() => {
    if (!derivedGoals) return [];
    
    try {
      return ProfileGoalsUtility.getGoalsSummary(derivedGoals);
    } catch (error) {
      console.warn('Error getting goals summary:', error);
      return [];
    }
  }, [derivedGoals]);

  // Get priority challenges (memoized)  
  const priorityChallenges = useMemo(() => {
    if (!derivedGoals) return [];
    
    try {
      return ProfileGoalsUtility.getPriorityChallenges(derivedGoals);
    } catch (error) {
      console.warn('Error getting priority challenges:', error);
      return [];
    }
  }, [derivedGoals]);

  // Check if we have meaningful goals data
  const hasGoals = useMemo(() => {
    return goalsSummary.length > 0 || priorityChallenges.length > 0;
  }, [goalsSummary.length, priorityChallenges.length]);

  // Check profile completeness for goals derivation
  const isPersonalComplete = useMemo(() => {
    return !!(personalProfile?.name && 
             personalProfile?.relationshipStatus && 
             personalProfile?.loveLanguage?.length > 0);
  }, [personalProfile?.name, personalProfile?.relationshipStatus, personalProfile?.loveLanguage]);

  const isPartnerComplete = useMemo(() => {
    return !!(partnerProfile?.partnerName && 
             partnerProfile?.partnerLoveLanguage?.length > 0);
  }, [partnerProfile?.partnerName, partnerProfile?.partnerLoveLanguage]);

  return {
    derivedGoals,
    partnerGoals,
    goalsSummary,
    priorityChallenges,
    hasGoals,
    isPersonalComplete,
    isPartnerComplete
  };
};

/**
 * Debug hook for development - logs goals derivation
 */
export const useProfileGoalsDebug = (
  personalProfile?: PersonalProfileV2,
  partnerProfile?: PartnerProfileV2
) => {
  const goals = useProfileGoals(personalProfile, partnerProfile);
  
  // Log goals in development
  if (process.env.NODE_ENV === 'development' && goals.hasGoals) {
    console.group('🎯 Profile Goals Debug');
    console.log('Personal Profile Complete:', goals.isPersonalComplete);
    console.log('Partner Profile Complete:', goals.isPartnerComplete);
    console.log('Derived Goals:', goals.derivedGoals);
    console.log('Partner Goals:', goals.partnerGoals);
    console.log('Goals Summary:', goals.goalsSummary);
    console.log('Priority Challenges:', goals.priorityChallenges);
    console.groupEnd();
  }
  
  return goals;
};