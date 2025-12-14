
import React, { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHome from "@/components/DashboardHome";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";
import SplashScreen from "@/components/SplashScreen";
import { performanceMonitor } from "@/utils/performanceMonitor";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";

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
  onOpenPartnerQuestionnaire: (profileId?: string) => void;
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
  const { forceVisible, setNavigationOpened } = useMobileHeaderVisibility();
  
  // Performance monitoring for tab switches
  useEffect(() => {
    if (activeTab === 'profile') {
      performanceMonitor.mark('profile-chunk-load');
    } else if (activeTab === 'insights') {
      performanceMonitor.mark('insights-chunk-load');
    }
  }, [activeTab]);

  // Handle new conversation
  const handleNewConversation = useCallback(() => {
    setChatHistory([]);
    setConversationStarter("");
  }, []);

  // Handle sidebar actions - open mobile navigation
  const handleOpenSidebar = useCallback(() => {
    // Force mobile header visible
    forceVisible();
    
    // Mark navigation as opened to hide the arrow
    setNavigationOpened(true);
    
    // Scroll to top to ensure navigation is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Wait a brief moment for header to appear, then open dropdown
    setTimeout(() => {
      const menuButton = document.querySelector('[data-mobile-header] button[role="button"]') ||
                        document.querySelector('[aria-haspopup="true"]') ||
                        document.querySelector('button[data-dropdown-toggle]');
      
      if (menuButton) {
        (menuButton as HTMLElement).click();
        
        // Listen for dropdown close to reset navigation state
        const handleClickOutside = (event: Event) => {
          const dropdown = document.querySelector('[data-radix-popper-content-wrapper]') ||
                          document.querySelector('[role="menu"]') ||
                          document.querySelector('[data-state="open"]');
          if (dropdown && !dropdown.contains(event.target as Node)) {
            setNavigationOpened(false);
            document.removeEventListener('click', handleClickOutside);
          }
        };
        
        // Also use MutationObserver to detect when dropdown disappears from DOM
        const observer = new MutationObserver(() => {
          const dropdown = document.querySelector('[data-radix-popper-content-wrapper]') ||
                          document.querySelector('[role="menu"]');
          if (!dropdown) {
            setNavigationOpened(false);
            observer.disconnect();
            document.removeEventListener('click', handleClickOutside);
          }
        });
        
        const timeoutId = setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
          observer.observe(document.body, { childList: true, subtree: true });
        }, 100);
        
        // Cleanup on unmount
        return () => {
          clearTimeout(timeoutId);
          observer.disconnect();
          document.removeEventListener('click', handleClickOutside);
        };
      } else {
        // Try alternative selectors for menu button
        const headerButtons = document.querySelectorAll('[data-mobile-header] button');
        if (headerButtons.length > 0) {
          (headerButtons[0] as HTMLElement).click();
        }
      }
    }, 100);
  }, [forceVisible, setNavigationOpened]);

  const handleSupabaseConfigured = () => {
    // Handle Supabase configuration if needed
  };
  
  // Only render the active tab content to reduce initial mount cost
  const renderActiveTabContent = useMemo(() => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "coach":
        return (
          <div className="h-full max-h-full flex flex-col mobile-coach-stretch">
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
          <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 md:mt-0 overflow-y-auto h-full scrollbar-hide">
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
          <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col">
            <AIInsights 
              profiles={temporaryProfiles}
              demographicsData={temporaryDemographics}
            />
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
  }, [
    activeTab,
    temporaryProfiles,
    temporaryDemographics,
    chatHistory,
    conversationStarter,
    handleNewConversation,
    handleOpenSidebar,
    onProfileUpdate,
    onOpenQuestionnaire,
    onOpenPartnerQuestionnaire
  ]);

  return (
    <div className={`flex-1 min-h-0 dashboard-container scrollbar-hide ${
      activeTab === 'coach' || activeTab === 'insights'
        ? 'overflow-hidden h-[100dvh] md:h-[calc(100vh-5rem)] md:pt-20 lg:pt-24' 
        : 'pt-16 md:pt-16 overflow-y-auto min-h-[100dvh]'
    }`}>
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-full h-full flex flex-col">
        <div className="flex-1 min-h-0">
          {renderActiveTabContent}
        </div>
      </Tabs>
    </div>
  );
};

export default React.memo(DashboardContent, (prev, next) => {
  return (
    prev.activeTab === next.activeTab &&
    prev.temporaryProfiles === next.temporaryProfiles &&
    prev.temporaryDemographics === next.temporaryDemographics &&
    prev.onValueChange === next.onValueChange &&
    prev.onProfileUpdate === next.onProfileUpdate &&
    prev.onOpenQuestionnaire === next.onOpenQuestionnaire &&
    prev.onOpenPartnerQuestionnaire === next.onOpenPartnerQuestionnaire
  );
});
