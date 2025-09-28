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

// Memoize ProfileBuilder to prevent unnecessary re-renders
const MemoizedProfileBuilder = React.memo(ProfileBuilder, (prevProps, nextProps) => {
  // Only re-render if profiles or demographics data actually changes
  const profilesChanged = 
    prevProps.initialProfiles?.your?.length !== nextProps.initialProfiles?.your?.length ||
    prevProps.initialProfiles?.partner?.length !== nextProps.initialProfiles?.partner?.length;
  
  const demographicsChanged = 
    prevProps.initialDemographics?.your !== nextProps.initialDemographics?.your ||
    prevProps.initialDemographics?.partner !== nextProps.initialDemographics?.partner;
  
  return !profilesChanged && !demographicsChanged;
});

MemoizedProfileBuilder.displayName = 'MemoizedProfileBuilder';

export default MemoizedProfileBuilder;