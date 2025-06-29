
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
      <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300`}>
        {/* Clean Navigation Header */}
        <div className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            {/* Brand Header */}
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-coral-500 rounded-2xl flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-serif">RealTalk</h1>
                  {accessLevel !== 'full-access' && (
                    <p className="text-sm text-gray-500 font-medium">
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
                <TabsList className="grid grid-cols-4 w-full max-w-2xl h-12 bg-gray-50/50 backdrop-blur-sm border-0 rounded-xl p-1 gap-1">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-gray-600 hover:text-purple-600 hover:bg-white/50"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-gray-600 hover:text-purple-600 hover:bg-white/50"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="hidden sm:inline">Coach</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conversation" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-gray-600 hover:text-purple-600 hover:bg-white/50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Practice</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-gray-600 hover:text-purple-600 hover:bg-white/50"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="profile" className="mt-0 h-full">
                <ProfileBuilder 
                  onProfileUpdate={handleProfileUpdate}
                  initialProfiles={temporaryProfiles}
                  initialDemographics={temporaryDemographics}
                />
              </TabsContent>

              <TabsContent value="insights" className="mt-0 h-full">
                <ProgressiveAccessWrapper action="insights">
                  <AIInsights 
                    profiles={temporaryProfiles}
                    demographicsData={temporaryDemographics}
                  />
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="conversation" className="mt-0 h-full">
                <ProgressiveAccessWrapper action="practice">
                  <ConversationPractice 
                    profiles={temporaryProfiles}
                    demographicsData={temporaryDemographics}
                  />
                </ProgressiveAccessWrapper>
              </TabsContent>

              <TabsContent value="actions" className="mt-0 h-full">
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
