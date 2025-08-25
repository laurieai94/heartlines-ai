
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
  return (
    <div className="flex-1 min-h-0 max-h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-full h-full">
        <TabsContent value="home" className="mt-0 h-full overflow-auto p-0">
          <DashboardHome />
        </TabsContent>

        <TabsContent value="profile" className="mt-0 h-full overflow-auto">
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
        </TabsContent>

        <TabsContent value="insights" className="mt-0 h-full overflow-hidden">
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
        </TabsContent>

        <TabsContent value="privacy" className="mt-0 h-full overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading privacy settings...</div></div>}>
              <PrivacySettings />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="company" className="mt-0 h-full overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-card-foreground">Loading...</div></div>}>
              <Company />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default DashboardContent;
