
import React, { Suspense, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHome from "@/components/DashboardHome";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";
import SplashScreen from "@/components/SplashScreen";
import { performanceMonitor } from "@/utils/performanceMonitor";

// Import AIInsights directly to avoid dynamic loading issues
import AIInsights from "@/components/AIInsights";
// Temporarily import ProfileBuilder directly to fix loading issue
import ProfileBuilder from "@/components/ProfileBuilder";

// Lazy load other heavy components to improve initial render
const PrivacySettings = React.lazy(() => import("@/components/PrivacySettings").then(m => ({ default: m.PrivacySettings })));
const Company = React.lazy(() => import("@/components/Company"));

interface DashboardContentProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  temporaryProfiles: any;
  temporaryDemographics: any;
  onProfileUpdate: (newProfiles: any, newDemographics: any) => void;
  onOpenQuestionnaire: () => void;
  onOpenPartnerQuestionnaire: () => void;
}

const DashboardContent = ({
  activeTab,
  onValueChange,
  temporaryProfiles,
  temporaryDemographics,
  onProfileUpdate,
  onOpenQuestionnaire,
  onOpenPartnerQuestionnaire
}: DashboardContentProps) => {
  
  // Performance monitoring for tab switches
  useEffect(() => {
    if (activeTab === 'profile') {
      performanceMonitor.mark('profile-chunk-load');
    } else if (activeTab === 'insights') {
      performanceMonitor.mark('insights-chunk-load');
    }
  }, [activeTab]);
  
  // Only render the active tab content to reduce initial mount cost
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "profile":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileBuilder 
              onProfileUpdate={onProfileUpdate}
              initialProfiles={temporaryProfiles}
              initialDemographics={temporaryDemographics}
              onOpenQuestionnaire={onOpenQuestionnaire}
              onOpenPartnerQuestionnaire={onOpenPartnerQuestionnaire}
            />
          </div>
        );
      case "insights":
        return (
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressiveAccessWrapper action="insights">
              <AIInsights 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </div>
        );
      case "privacy":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<SplashScreen message="privacy settings loading" wordmarkSize="sm" showWordmark={false} />}>
              <PrivacySettings />
            </Suspense>
          </div>
        );
      case "company":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SplashScreen message="company info loading" wordmarkSize="sm" showWordmark={false} />}>
              <Company />
            </Suspense>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex-1 min-h-0 max-h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-full h-full">
        <div className="mt-0 h-full overflow-auto p-0">
          {renderActiveTabContent()}
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
