
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHome from "@/components/DashboardHome";
import ProfileBuilder from "@/components/ProfileBuilder";
import AIInsights from "@/components/AIInsights";

import ThoughtfulActions from "@/components/ThoughtfulActions";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";

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
        <TabsContent value="home" className="mt-0 h-full p-0">
          <DashboardHome />
        </TabsContent>

        <TabsContent value="profile" className="mt-0 h-full">
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileBuilder 
              onProfileUpdate={onProfileUpdate}
              initialProfiles={temporaryProfiles}
              initialDemographics={temporaryDemographics}
              onOpenQuestionnaire={onOpenQuestionnaire}
              onOpenPartnerQuestionnaire={onOpenPartnerQuestionnaire}
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-0 h-full overflow-hidden">
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressiveAccessWrapper action="insights">
              <AIInsights 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </div>
        </TabsContent>


        <TabsContent value="actions" className="mt-0 h-full">
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProgressiveAccessWrapper action="actions">
              <ThoughtfulActions 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default DashboardContent;
