
import { useState } from "react";
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { 
    shouldShowSignUpModal, 
    blockingAction, 
    closeSignUpModal,
    accessLevel 
  } = useProgressiveAccess();
  
  // Use temporary profiles for non-authenticated users
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();

  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300`}>
      {/* Centered Container for Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="flex items-center justify-between py-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RealTalk</h1>
              {accessLevel !== 'full-access' && (
                <p className="text-xs text-gray-500">
                  {accessLevel === 'profile-required' ? 'Start by building your profile' : 'One step away from full access'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-md bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-1">
              <TabsTrigger value="profile" className="flex items-center gap-2 rounded-xl py-3 px-4">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 rounded-xl py-3 px-4">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Coach</span>
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex items-center gap-2 rounded-xl py-3 px-4">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Practice</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2 rounded-xl py-3 px-4">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Actions</span>
              </TabsTrigger>
            </TabsList>
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
              <AIInsights 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </TabsContent>

            <TabsContent value="conversation" className="mt-0">
              <ConversationPractice 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
            </TabsContent>

            <TabsContent value="actions" className="mt-0">
              <ThoughtfulActions 
                profiles={temporaryProfiles}
                demographicsData={temporaryDemographics}
              />
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
  );
};

export default Dashboard;
