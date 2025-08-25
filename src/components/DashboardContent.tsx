
import React, { Suspense } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHome from "@/components/DashboardHome";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";

// Lazy load heavy components to improve initial render
const ProfileBuilder = React.lazy(() => import("@/components/ProfileBuilder"));
const AIInsights = React.lazy(() => import("@/components/AIInsights"));
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
  // Only render the active tab content to reduce initial mount cost
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "profile":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading profile...</div></div>}>
              <ProfileBuilder 
                onProfileUpdate={onProfileUpdate}
                initialProfiles={temporaryProfiles}
                initialDemographics={temporaryDemographics}
                onOpenQuestionnaire={onOpenQuestionnaire}
                onOpenPartnerQuestionnaire={onOpenPartnerQuestionnaire}
              />
            </Suspense>
          </div>
        );
      case "insights":
        return (
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressiveAccessWrapper action="insights">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading AI coach...</div></div>}>
                <AIInsights 
                  profiles={temporaryProfiles}
                  demographicsData={temporaryDemographics}
                />
              </Suspense>
            </ProgressiveAccessWrapper>
          </div>
        );
      case "privacy":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading privacy settings...</div></div>}>
              <PrivacySettings />
            </Suspense>
          </div>
        );
      case "company":
        return (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading...</div></div>}>
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
