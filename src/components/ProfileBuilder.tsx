
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Users, Sparkles, MessageCircle, ArrowRight, Plus } from "lucide-react";
import ProfileViewer from "./ProfileViewer";
import Demographics from "./Demographics";
import ProfileForm from "./ProfileForm";
import PersonalProfileQuestionnaire from "./PersonalProfileQuestionnaire";
import ProfileCompletionOptions from "./ProfileCompletionOptions";
import { usePersonalProfileQuestionnaire } from "@/hooks/usePersonalProfileQuestionnaire";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useLocation } from "react-router-dom";

interface ProfileBuilderProps {
  onProfileUpdate: (profiles: any, demographics: any) => void;
  initialProfiles: any;
  initialDemographics: any;
}

const ProfileBuilder = ({ onProfileUpdate, initialProfiles, initialDemographics }: ProfileBuilderProps) => {
  const location = useLocation();
  const [showDemographics, setShowDemographics] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const { temporaryProfiles, temporaryDemographics } = useTemporaryProfile();
  const { profileCompletion } = useProgressiveAccess();
  
  const {
    showQuestionnaire,
    showCompletionOptions,
    openQuestionnaire,
    handleQuestionnaireComplete,
    handleQuestionnaireClose,
    handleAddPartnerProfile,
    handleStartChatting,
    handleCloseCompletionOptions
  } = usePersonalProfileQuestionnaire();

  // Check if we should auto-open partner profile creation
  useEffect(() => {
    if (location.state?.addPartnerProfile) {
      handleOpenProfileForm('partner');
    }
  }, [location.state]);

  const getProfileCount = () => {
    let count = 0;
    if (temporaryProfiles.your?.length > 0) count++;
    if (temporaryProfiles.partner?.length > 0) count++;
    return count;
  };

  const hasYourProfile = temporaryProfiles.your?.length > 0;
  const hasPartnerProfile = temporaryProfiles.partner?.length > 0;

  const handleOpenProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    
    // If no demographics data exists for this profile type, show demographics first
    if (!temporaryDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleProfileComplete = (profileData: any) => {
    setShowProfileForm(false);
    onProfileUpdate(temporaryProfiles, temporaryDemographics);
  };

  const handleDemographicsComplete = (demographicsData: any) => {
    setShowDemographics(false);
    setShowProfileForm(true);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Your Relationship Profile</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The more RealTalk knows about you and your relationship dynamics, the better it can support your journey.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-sm text-purple-600 font-medium">{profileCompletion}% Complete</span>
        </div>
        <Progress value={profileCompletion} className="h-3 mb-2" />
        <p className="text-sm text-gray-600">
          {profileCompletion < 50 
            ? "Start with your personal profile to unlock RealTalk's features"
            : profileCompletion < 100
            ? "Great progress! Consider adding your partner's profile for deeper insights"
            : "Amazing! You've completed both profiles and unlocked all features"
          }
        </p>
      </Card>

      {/* Profile Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Profile Card */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10"></div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Profile</h3>
                <p className="text-sm text-gray-600">Personal insights & preferences</p>
              </div>
            </div>
            {hasYourProfile && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {hasYourProfile ? (
            <div className="space-y-4">
              <ProfileViewer 
                profileType="your" 
                profiles={temporaryProfiles} 
                demographics={temporaryDemographics} 
              />
              <Button 
                variant="outline" 
                onClick={() => handleOpenProfileForm('your')}
                className="w-full"
              >
                Edit Your Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Share your communication style, attachment patterns, and relationship goals to get personalized insights.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={openQuestionnaire}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Quick Profile (Recommended)
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenProfileForm('your')}
                  className="w-full py-3 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Detailed Profile Builder
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Partner Profile Card */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full -translate-y-10 translate-x-10"></div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Partner Profile</h3>
                <p className="text-sm text-gray-600">Understand your partner's style</p>
              </div>
            </div>
            {hasPartnerProfile && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {hasPartnerProfile ? (
            <div className="space-y-4">
              <ProfileViewer 
                profileType="partner" 
                profiles={temporaryProfiles} 
                demographics={temporaryDemographics} 
              />
              <Button 
                variant="outline" 
                onClick={() => handleOpenProfileForm('partner')}
                className="w-full"
              >
                Edit Partner Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Add your partner's communication style and preferences for more accurate relationship insights and advice.
              </p>
              
              {!hasYourProfile ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    💡 Complete your profile first to unlock partner profile creation
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={() => handleOpenProfileForm('partner')}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Partner Profile
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Start Actions */}
      {hasYourProfile && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-gray-600">Your profile is complete! Start getting personalized relationship insights.</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/dashboard?tab=insights'}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Chat with Kai
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Modals */}
      {showQuestionnaire && (
        <PersonalProfileQuestionnaire 
          onComplete={handleQuestionnaireComplete}
          onClose={handleQuestionnaireClose}
        />
      )}

      {showCompletionOptions && (
        <ProfileCompletionOptions
          onAddPartnerProfile={handleAddPartnerProfile}
          onStartChatting={handleStartChatting}
          onClose={handleCloseCompletionOptions}
        />
      )}
      
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={temporaryDemographics[activeProfileType]}
        />
      )}
      
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={temporaryProfiles}
          initialDemographics={temporaryDemographics}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
