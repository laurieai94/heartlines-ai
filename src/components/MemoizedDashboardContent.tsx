import React from 'react';
import DashboardContent from './DashboardContent';

interface DashboardContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  temporaryProfiles: any;
  temporaryDemographics: any;
  onProfileUpdate: (newProfiles: any, newDemographics: any) => void;
  onOpenQuestionnaire: () => void;
  onOpenPartnerQuestionnaire: () => void;
}

// Memoize DashboardContent to prevent unnecessary re-renders on tab switches
const MemoizedDashboardContent = React.memo(DashboardContent, (prevProps, nextProps) => {
  // Only re-render if activeTab or profile data changes
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.temporaryProfiles === nextProps.temporaryProfiles &&
    prevProps.temporaryDemographics === nextProps.temporaryDemographics &&
    prevProps.onValueChange === nextProps.onValueChange &&
    prevProps.onProfileUpdate === nextProps.onProfileUpdate
  );
});

MemoizedDashboardContent.displayName = 'MemoizedDashboardContent';

export default MemoizedDashboardContent;