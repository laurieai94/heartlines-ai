
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, MessageCircle, Lightbulb, ArrowRight, Search } from "lucide-react";
import ProfileBuilder from "@/components/ProfileBuilder";
import AIInsights from "@/components/AIInsights";
import ConversationPractice from "@/components/ConversationPractice";
import ThoughtfulActions from "@/components/ThoughtfulActions";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import SignUpModal from "@/components/SignUpModal";
import ProgressiveAccessWrapper from "@/components/ProgressiveAccessWrapper";
import { NavigationProvider } from "@/contexts/NavigationContext";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const { 
    shouldShowSignUpModal, 
    blockingAction, 
    closeSignUpModal,
    accessLevel,
    profileCompletion
  } = useProgressiveAccess();
  
  // Use temporary profiles for non-authenticated users
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  // Handle redirect from profile completion
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  const handleGoToProfile = () => {
    console.log('Navigating to profile tab');
    setActiveTab("profile");
  };

  const handleGoToCoach = () => {
    console.log('Navigating to coach tab');
    setActiveTab("insights");
  };

  return (
    <NavigationProvider goToProfile={handleGoToProfile} goToCoach={handleGoToCoach}>
      <div className={`h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Enhanced Navigation Header - Always Visible */}
        <div className="flex-shrink-0 w-full bg-gradient-to-r from-white/95 via-white/98 to-white/95 backdrop-blur-lg border-b border-gradient-to-r from-purple-100/50 via-pink-100/30 to-purple-100/50 shadow-lg shadow-purple-100/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            {/* Enhanced Header with Better Typography */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-pink-500 to-coral-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/40 ring-2 ring-white/50">
                  <Heart className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">RealTalk</h1>
                  {accessLevel !== 'full-access' && (
                    <p className="text-sm text-purple-600/80 font-medium">
                      {accessLevel === 'profile-required' ? 'Start by building your profile' : 
                       profileCompletion > 0 ? `${profileCompletion}% complete - one step away from full access` : 'One step away from full access'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center pb-5">
                <div className="w-full max-w-3xl">
                  <TabsList className="grid grid-cols-4 w-full h-14 bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-lg shadow-xl border-2 border-white/50 rounded-2xl p-2 gap-2">
                    <TabsTrigger 
                      value="profile" 
                      className="flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-pink-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-100/50 data-[state=active]:ring-2 data-[state=active]:ring-purple-200/50 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:shadow-md"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="insights" 
                      className="flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-pink-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-100/50 data-[state=active]:ring-2 data-[state=active]:ring-purple-200/50 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:shadow-md"
                    >
                      <Lightbulb className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Coach</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="conversation" 
                      className="flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-pink-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-100/50 data-[state=active]:ring-2 data-[state=active]:ring-purple-200/50 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:shadow-md"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Practice</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="actions" 
                      className="flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-pink-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-100/50 data-[state=active]:ring-2 data-[state=active]:ring-purple-200/50 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:shadow-md"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Actions</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Content with Proper Top Spacing */}
        <div className="flex-1 min-h-0 overflow-hidden pt-12">
          <div className="h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="profile" className="mt-0 h-full overflow-auto">
                <ProfileBuilder 
                  onProfileUpdate={handleProfileUpdate}
                  initialProfiles={temporaryProfiles}
                  initialDemographics={temporaryDemographics}
                />
              </TabsContent>

              <TabsContent value="insights" className="mt-0 h-full overflow-hidden">
                <ProgressiveAccessWrapper action="insights">
                  <AIInsights 
                    profiles={temporaryProfiles}
                    demographicsData={temporaryDemographics}
                  />
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="conversation" className="mt-0 h-full overflow-auto">
                <ProgressiveAccessWrapper action="practice">
                  <ConversationPractice 
                    profiles={temporaryProfiles}
                    demographicsData={temporaryDemographics}
                  />
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="actions" className="mt-0 h-full overflow-auto">
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

        {/* Sign-up Modal */}
        <SignUpModal
          isOpen={shouldShowSignUpModal}
          onClose={closeSignUpModal}
          blockingAction={blockingAction}
        />
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
