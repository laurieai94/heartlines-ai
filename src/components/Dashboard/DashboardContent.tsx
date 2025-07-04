
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProfileBuilder from "@/components/ProfileBuilder";
import AIInsights from "@/components/AIInsights";
import ConversationPractice from "@/components/ConversationPractice";
import ThoughtfulActions from "@/components/ThoughtfulActions";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";

interface DashboardContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  temporaryProfiles: any;
  temporaryDemographics: any;
  onProfileUpdate: (newProfiles: any, newDemographics: any) => void;
  onOpenQuestionnaire: () => void;
}

const DashboardContent = ({ 
  activeTab, 
  onTabChange, 
  temporaryProfiles, 
  temporaryDemographics, 
  onProfileUpdate, 
  onOpenQuestionnaire 
}: DashboardContentProps) => {
  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsContent value="profile" className="mt-0">
            <ProfileBuilder 
              onProfileUpdate={onProfileUpdate}
              initialProfiles={temporaryProfiles}
              initialDemographics={temporaryDemographics}
              onOpenQuestionnaire={onOpenQuestionnaire}
            />
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <ProgressiveAccessWrapper action="insights">
              <AIInsights 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </TabsContent>

          <TabsContent value="conversation" className="mt-0">
            <ProgressiveAccessWrapper action="practice">
              <ConversationPractice 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </TabsContent>

          <TabsContent value="actions" className="mt-0">
            <ProgressiveAccessWrapper action="actions">
              <ThoughtfulActions 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </ProgressiveAccessWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardContent;
