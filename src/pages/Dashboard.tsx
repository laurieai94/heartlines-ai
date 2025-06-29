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
        {/* Centered Container for Desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal Header */}
          <div className="flex items-center justify-between py-6 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RealTalk</h1>
                {accessLevel !== 'full-access' && (
                  <p className="text-xs text-gray-500">
                    {accessLevel === 'profile-required' ? 'Start by building your profile' : 
                     profileCompletion > 0 ? `${profileCompletion}% complete - one step away from full access` : 'One step away from full access'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Professional Navigation Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <TabsList className="grid grid-cols-4 w-full h-12 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100/50 rounded-xl p-1.5 gap-1">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="hidden sm:inline">Coach</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conversation" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Practice</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <TabsContent value="profile" className="mt-0">
                <ProfileBuilder 
                  onProfileUpdate={handleProfileUpdate}
                  initialProfiles={temporaryProfiles}
                  initialDemographics={temporaryDemographics}
                />
              </TabsContent>

              <TabsContent value="insights" className="mt-0 h-[calc(100vh-200px)]">
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
            </div>
          </Tabs>

          {/* Sign-up Modal */}
          <SignUpModal
            isOpen={shouldShowSignUpModal}
            onClose={closeSignUpModal}
            blockingAction={blockingAction}
          />
        </div>
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
