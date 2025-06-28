
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, Heart, Sparkles } from "lucide-react";
import ProfileBuilder from "./ProfileBuilder";
import AIInsights from "./AIInsights";
import SignUpModal from "./SignUpModal";
import BubbleBackground from "./BubbleBackground";

const ExploreFirst = () => {
  const { user } = useAuth();
  const { tempProfile, updateTemporaryProfile, clearTemporaryProfile, hasTemporaryData } = useTemporaryProfile();
  const { profiles, saveProfile } = useUserProfiles();
  const [activeTab, setActiveTab] = useState("profile");
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Handle temporary profile updates
  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    const updatedProfile = {
      your: newProfiles.your || [],
      partner: newProfiles.partner || [],
      demographics: newDemographics || { your: null, partner: null }
    };
    updateTemporaryProfile('your', newProfiles.your?.[0], newDemographics.your);
    updateTemporaryProfile('partner', newProfiles.partner?.[0], newDemographics.partner);
  };

  // Handle coach tab access
  const handleCoachAccess = () => {
    if (!user) {
      setShowSignUpModal(true);
    } else {
      setActiveTab("coach");
    }
  };

  // Handle successful sign up
  const handleSignUpComplete = async () => {
    setShowSignUpModal(false);
    
    // Transfer temporary data to user account if available
    if (hasTemporaryData()) {
      try {
        if (tempProfile.your.length > 0 || tempProfile.demographics.your) {
          await saveProfile('your', tempProfile.your[0] || {}, tempProfile.demographics.your || {});
        }
        if (tempProfile.partner.length > 0 || tempProfile.demographics.partner) {
          await saveProfile('partner', tempProfile.partner[0] || {}, tempProfile.demographics.partner || {});
        }
        clearTemporaryProfile();
      } catch (error) {
        console.error('Error transferring temporary profile:', error);
      }
    }
    
    setActiveTab("coach");
  };

  // Use authenticated profiles if available, otherwise use temporary profiles
  const currentProfiles = user ? {
    your: profiles.your ? [profiles.your.profile_data] : [],
    partner: profiles.partner ? [profiles.partner.profile_data] : []
  } : tempProfile;

  const currentDemographics = user ? {
    your: profiles.your?.demographics_data || null,
    partner: profiles.partner?.demographics_data || null
  } : tempProfile.demographics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 relative">
      <BubbleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-coral-500" />
            <h1 className="text-3xl font-bold text-gray-900">RealTalk</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your AI relationship coach built on real psychology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Build Your Profile
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="flex items-center gap-2"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  handleCoachAccess();
                }
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat with Kai
              {!user && <Sparkles className="w-3 h-3 text-coral-500" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Start Building Your Relationship Profile
                </h2>
                <p className="text-gray-600">
                  No account needed yet - explore freely and see what RealTalk can do for you
                </p>
              </div>
              
              <ProfileBuilder 
                onProfileUpdate={handleProfileUpdate}
                initialProfiles={currentProfiles}
                initialDemographics={currentDemographics}
              />
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            {user ? (
              <AIInsights 
                profiles={currentProfiles}
                demographicsData={currentDemographics}
              />
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600">Please sign up to access Kai.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sign-up modal with blurred background */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50">
          {/* Blurred background showing Kai interface */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50">
            <BubbleBackground />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
            
            {/* Preview of Kai interface */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="max-w-4xl w-full mx-4">
                <Card className="p-8 bg-white/80 backdrop-blur-md border-0 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-coral-400 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Meet Kai</h3>
                      <p className="text-gray-600">Your AI relationship coach</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-gray-700">
                        Hi! I'm Kai, your personal relationship coach. I can help you with...
                      </p>
                    </div>
                    <div className="bg-coral-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        • Personalized conversation scripts based on your communication style
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        • Stress support strategies tailored to your needs
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <SignUpModal 
            isOpen={showSignUpModal}
            onClose={() => setShowSignUpModal(false)}
            onSignUpComplete={handleSignUpComplete}
          />
        </div>
      )}
    </div>
  );
};

export default ExploreFirst;
