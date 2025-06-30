
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
      <div className={`h-screen flex flex-col bg-gradient-to-br from-red-900 via-rose-900 to-pink-800 ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300 overflow-hidden`}>
        {/* Clean Navigation Header */}
        <div className="flex-shrink-0 w-full bg-gradient-to-b from-black/30 via-red-900/40 to-transparent backdrop-blur-sm border-b border-red-800/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            {/* Brand Header */}
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white font-sans tracking-tight">RealTalk</h1>
                  {accessLevel !== 'full-access' && (
                    <p className="text-sm text-pink-200 font-medium mt-1">
                      {accessLevel === 'profile-required' ? 'Start by building your profile' : 
                       profileCompletion > 0 ? `${profileCompletion}% complete` : 'Complete your profile for full access'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center pb-6">
                <TabsList className="grid grid-cols-4 w-full max-w-3xl h-14 bg-black/20 backdrop-blur-md border border-red-800/30 rounded-2xl p-1.5 gap-1 shadow-xl">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200 hover:text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200 hover:text-white hover:bg-white/10"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="hidden sm:inline">Coach</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conversation" 
                    className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200 hover:text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Practice</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions" 
                    className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200 hover:text-white hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Content - Optimized for full height usage */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsContent value="profile" className="mt-0 flex-1 min-h-0">
                <div className="h-full">
                  <ProfileBuilder 
                    onProfileUpdate={handleProfileUpdate}
                    initialProfiles={temporaryProfiles}
                    initialDemographics={temporaryDemographics}
                  />
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-0 flex-1 min-h-0">
                <ProgressiveAccessWrapper action="insights">
                  <div className="h-full">
                    <AIInsights 
                      profiles={temporaryProfiles}
                      demographicsData={temporaryDemographics}
                    />
                  </div>
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="conversation" className="mt-0 flex-1 min-h-0">
                <ProgressiveAccessWrapper action="practice">
                  <div className="h-full">
                    <ConversationPractice 
                      profiles={temporaryProfiles}
                      demographicsData={temporaryDemographics}
                    />
                  </div>
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="actions" className="mt-0 flex-1 min-h-0">
                <ProgressiveAccessWrapper action="actions">
                  <div className="h-full">
                    <ThoughtfulActions 
                      profiles={temporaryProfiles}
                      demographicsData={temporaryDemographics}
                    />
                  </div>
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
