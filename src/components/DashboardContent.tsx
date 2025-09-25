
import React, { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHome from "@/components/DashboardHome";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";
import SplashScreen from "@/components/SplashScreen";
import { performanceMonitor } from "@/utils/performanceMonitor";

// Import AIInsights directly to avoid dynamic loading issues
import AIInsights from "@/components/AIInsights";
// Temporarily import ProfileBuilder directly to fix loading issue
import ProfileBuilder from "@/components/ProfileBuilder";
import AIChat from "@/components/AIChat";

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
  // Chat state management for the coach tab
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [conversationStarter, setConversationStarter] = useState("");
  
  // Performance monitoring for tab switches
  useEffect(() => {
    if (activeTab === 'profile') {
      performanceMonitor.mark('profile-chunk-load');
    } else if (activeTab === 'insights') {
      performanceMonitor.mark('insights-chunk-load');
    }
  }, [activeTab]);

  // Handle new conversation
  const handleNewConversation = () => {
    setChatHistory([]);
    setConversationStarter("");
  };

  // Handle sidebar actions
  const handleOpenSidebar = () => {
    // Could add sidebar logic here if needed
  };

  const handleSupabaseConfigured = () => {
    // Handle Supabase configuration if needed
  };
  
  // Only render the active tab content to reduce initial mount cost
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "coach":
        return (
          <div className="h-full flex flex-col">
            <AIChat 
              profiles={temporaryProfiles}
              demographicsData={temporaryDemographics}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              isConfigured={true}
              conversationStarter={conversationStarter}
              onNewConversation={handleNewConversation}
              onOpenSidebar={handleOpenSidebar}
              onSupabaseConfigured={handleSupabaseConfigured}
            />
          </div>
        );
      case "profile":
        return (
          <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 -mt-2 md:mt-0">
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
        <div className={`mt-0 h-full overflow-auto p-0 ${activeTab === 'profile' ? 'no-scrollbar' : ''}`}>
          {renderActiveTabContent()}
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
