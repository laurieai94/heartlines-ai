
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
import QuestionnaireModal from "@/components/QuestionnaireModal";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
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
      <div className={`min-h-screen bg-gradient-to-br from-[#8B2635] via-[#A0334A] to-[#B8405F] ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300`}>
        {/* Header with improved spacing and typography */}
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Brand Header - Reduced padding, improved typography scale */}
            <div className="flex items-center justify-between py-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-serif leading-tight">RealTalk</h1>
                  {accessLevel !== 'full-access' && (
                    <p className="text-xs text-pink-200/70 font-medium mt-1 leading-relaxed">
                      {accessLevel === 'profile-required' ? 'Start by building your profile' : 
                       profileCompletion > 0 ? `${profileCompletion}% complete` : 'Complete your profile for full access'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Refined spacing and sizing */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center pb-12">
                <TabsList className="grid grid-cols-4 w-full max-w-3xl h-12 bg-black/15 backdrop-blur-sm border border-white/15 rounded-xl p-1.5 gap-1">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Coach</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conversation" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Practice</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions" 
                    className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Actions</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Content - Improved max-width and spacing */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="profile" className="mt-0">
                <ProfileBuilder 
                  onProfileUpdate={handleProfileUpdate}
                  initialProfiles={temporaryProfiles}
                  initialDemographics={temporaryDemographics}
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

        {/* Sign-up Modal */}
        <SignUpModal
          isOpen={shouldShowSignUpModal}
          onClose={closeSignUpModal}
          blockingAction={blockingAction}
        />

        {/* Questionnaire Modal */}
        <QuestionnaireModal
          isOpen={showQuestionnaireModal}
          onClose={() => setShowQuestionnaireModal(false)}
        />
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
