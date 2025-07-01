
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
      <div className={`min-h-screen questionnaire-bg ${shouldShowSignUpModal ? 'blur-sm' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="w-full px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white font-serif">RealTalk</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-4 w-full max-w-2xl h-14 questionnaire-card p-2 gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === "profile" 
                      ? 'questionnaire-button-selected text-white' 
                      : 'questionnaire-text-muted hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === "insights" 
                      ? 'questionnaire-button-selected text-white' 
                      : 'questionnaire-text-muted hover:bg-white/10'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Coach</span>
                </button>
                <button
                  onClick={() => setActiveTab("conversation")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === "conversation" 
                      ? 'questionnaire-button-selected text-white' 
                      : 'questionnaire-text-muted hover:bg-white/10'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Practice</span>
                </button>
                <button
                  onClick={() => setActiveTab("actions")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === "actions" 
                      ? 'questionnaire-button-selected text-white' 
                      : 'questionnaire-text-muted hover:bg-white/10'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Actions</span>
                </button>
              </div>
            </div>

            {/* Main Content based on active tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold questionnaire-text">Let's Get to Know the Real You</h2>
                  <p className="text-lg questionnaire-text-muted">Build your relationship profiles to unlock personalized insights</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <span className="questionnaire-text-muted">Overall Progress:</span>
                    <div className="w-64 h-3 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <span className="questionnaire-text font-semibold">{profileCompletion}%</span>
                  </div>
                </div>

                {/* Profile Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Your Personal Profile Card */}
                  <div className="questionnaire-card p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold questionnaire-text">Your Personal Profile</h3>
                        <div className="w-48 h-2 bg-black/20 rounded-full mt-2">
                          <div className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                        <span className="text-sm questionnaire-text-muted">100%</span>
                      </div>
                    </div>
                    
                    <p className="questionnaire-text-muted">
                      Complete our comprehensive questionnaire to unlock personalized relationship insights from Kai, your AI coach.
                    </p>

                    <div className="space-y-3">
                      <h4 className="questionnaire-text font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full" />
                        What You'll Get:
                      </h4>
                      <ul className="space-y-2 questionnaire-text-muted text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-orange-300 rounded-full" />
                          Personalized coaching tailored to your patterns
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-orange-300 rounded-full" />
                          Deep insights into your relationship style
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-orange-300 rounded-full" />
                          Custom advice that actually gets you
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full questionnaire-button-primary py-4 text-lg font-semibold">
                      Continue Your Profile
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  {/* Partner Profile Card */}
                  <div className="questionnaire-card p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold questionnaire-text">Partner Profile</h3>
                        <div className="w-48 h-2 bg-black/20 rounded-full mt-2">
                          <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                        <span className="text-sm questionnaire-text-muted">75%</span>
                      </div>
                    </div>
                    
                    <p className="questionnaire-text-muted">
                      Share what you know about your partner's communication style and preferences for even better insights.
                    </p>

                    <div className="space-y-3">
                      <h4 className="questionnaire-text font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-400 rounded-full" />
                        What You'll Unlock:
                      </h4>
                      <ul className="space-y-2 questionnaire-text-muted text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-pink-300 rounded-full" />
                          Dual-perspective relationship insights
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-pink-300 rounded-full" />
                          Bridge-building communication tips
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-pink-300 rounded-full" />
                          Advice that considers both of you
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full questionnaire-button-primary py-4 text-lg font-semibold">
                      Continue Partner Profile
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                  <div>
                    <h3 className="text-2xl font-bold questionnaire-text mb-4">The Questions That Actually Matter</h3>
                    <p className="text-lg questionnaire-text-muted leading-relaxed">
                      How do you really act when you're stressed? What makes you feel most loved? The more honest you are, the less we'll sound like a generic self-help book.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold questionnaire-text">Simple Process:</h4>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                          <span className="questionnaire-text-muted">Build your profile to capture your unique relationship vibe</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                          <span className="questionnaire-text-muted">Connect with Kai for AI-powered clarity that just gets it</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                          <span className="questionnaire-text-muted">Take real action, leveling up your bond with smart advice</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold questionnaire-text">You Get:</h4>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-orange-400 rounded-full" />
                          <span className="questionnaire-text-muted">Mastering the 'We need to talk'</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-pink-400 rounded-full" />
                          <span className="questionnaire-text-muted">Turning arguments into wins</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-orange-400 rounded-full" />
                          <span className="questionnaire-text-muted">Making your actions actually count</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="questionnaire-button-secondary py-3 px-8">
                    Show Tips
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Other tab content */}
            {activeTab === "insights" && (
              <ProgressiveAccessWrapper action="insights">
                <AIInsights 
                  profiles={temporaryProfiles}
                  demographicsData={temporaryDemographics}
                />
              </ProgressiveAccessWrapper>
            )}

            {activeTab === "conversation" && (
              <ProgressiveAccessWrapper action="practice">
                <ConversationPractice 
                  profiles={temporaryProfiles}
                  demographicsData={temporaryDemographics}
                />
              </ProgressiveAccessWrapper>
            )}

            {activeTab === "actions" && (
              <ProgressiveAccessWrapper action="actions">
                <ThoughtfulActions 
                  profiles={temporaryProfiles}
                  demographicsData={temporaryDemographics}
                />
              </ProgressiveAccessWrapper>
            )}
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
