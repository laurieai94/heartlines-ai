import React from 'react';
import ProfileBuilder from './ProfileBuilder';

interface ProfileBuilderProps {
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  initialProfiles?: {
    your: any[];
    partner: any[];
  };
  initialDemographics?: {
    your: any;
    partner: any;
  };
  onOpenQuestionnaire?: () => void;
  onOpenPartnerQuestionnaire?: () => void;
}

// Enhanced memo with granular comparison - only re-render on significant changes
const MemoizedProfileBuilder = React.memo(ProfileBuilder, (prevProps, nextProps) => {
  // Check if profiles actually changed (shallow comparison is faster)
  const profilesChanged = 
    prevProps.initialProfiles?.your !== nextProps.initialProfiles?.your ||
    prevProps.initialProfiles?.partner !== nextProps.initialProfiles?.partner;
  
  // Check if demographics actually changed
  const demographicsChanged = 
    prevProps.initialDemographics?.your !== nextProps.initialDemographics?.your ||
    prevProps.initialDemographics?.partner !== nextProps.initialDemographics?.partner;
  
  // Check if callbacks changed (they shouldn't if properly memoized)
  const callbacksChanged =
    prevProps.onOpenQuestionnaire !== nextProps.onOpenQuestionnaire ||
    prevProps.onOpenPartnerQuestionnaire !== nextProps.onOpenPartnerQuestionnaire ||
    prevProps.onProfileUpdate !== nextProps.onProfileUpdate;
  
  // Only re-render if something actually changed
  return !profilesChanged && !demographicsChanged && !callbacksChanged;
});

MemoizedProfileBuilder.displayName = 'MemoizedProfileBuilder';

export default MemoizedProfileBuilder;