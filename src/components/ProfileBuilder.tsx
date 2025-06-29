
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Plus, Eye, MessageCircle } from "lucide-react";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";
import PersonalProfileQuestionnaire from "./PersonalProfileQuestionnaire";
import ProfileViewer from "./ProfileViewer";
import { usePersonalProfileQuestionnaire } from "@/hooks/usePersonalProfileQuestionnaire";

interface ProfileBuilderProps {
  onProfileUpdate: (profiles: any, demographics: any) => void;
  initialProfiles: any;
  initialDemographics: any;
}

const ProfileBuilder = ({ onProfileUpdate, initialProfiles, initialDemographics }: ProfileBuilderProps) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');

  const { 
    showQuestionnaire, 
    openQuestionnaire, 
    handleQuestionnaireComplete, 
    handleQuestionnaireClose 
  } = usePersonalProfileQuestionnaire();

  // Calculate completion percentages with real-time updates
  const calculateYourCompletion = () => {
    const yourProfile = initialProfiles?.your?.[0];
    const yourDemo = initialDemographics?.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8; // Key fields for personal profile
    
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    if (yourProfile?.stressReactions?.length > 0) completed++;
    if (yourProfile?.attachmentStyles?.length > 0) completed++;
    if (yourProfile?.loveLanguages?.length > 0) completed++;
    if (yourProfile?.receiveLove?.length > 0) completed++;
    if (yourProfile?.familyDynamics?.length > 0) completed++;
    if (yourProfile?.relationshipStatus?.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const calculatePartnerCompletion = () => {
    const partnerProfile = initialProfiles?.partner?.[0];
    const partnerDemo = initialDemographics?.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4; // Key fields for partner profile
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const yourCompletion = calculateYourCompletion();
  const partnerCompletion = calculatePartnerCompletion();
  const overallCompletion = Math.round((yourCompletion + partnerCompletion) / 2);

  const userName = initialDemographics?.your?.name || '';
  const partnerName = initialDemographics?.partner?.name || '';

  const handleOpenProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    if (!initialDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleViewProfile = (profileType: 'your' | 'partner') => {
    setViewingProfileType(profileType);
    setShowProfileViewer(true);
  };

  const handleProfileComplete = (profileData: any) => {
    setShowProfileForm(false);
  };

  const handleDemographicsComplete = (demographicsData: any) => {
    setShowDemographics(false);
    setShowProfileForm(true);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  const handleEditProfile = () => {
    setShowProfileViewer(false);
    handleOpenProfileForm(viewingProfileType);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with overall progress */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Relationship Profile</h1>
          <p className="text-gray-600">Help us understand you and your relationship better</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{overallCompletion}%</span>
          </div>
          <Progress value={overallCompletion} className="h-3" />
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Profile Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {userName || 'Your'} Profile
                </h3>
                <p className="text-sm text-gray-500 font-normal">Personal insights & patterns</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Completion</span>
                <span className="text-sm text-gray-500">{yourCompletion}%</span>
              </div>
              <Progress value={yourCompletion} className="h-2" />
            </div>

            {yourCompletion > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">What we know:</p>
                <div className="flex flex-wrap gap-1">
                  {userName && <Badge variant="secondary" className="text-xs">Name</Badge>}
                  {initialDemographics?.your?.age && <Badge variant="secondary" className="text-xs">Age</Badge>}
                  {initialProfiles?.your?.[0]?.stressReactions?.length > 0 && <Badge variant="secondary" className="text-xs">Stress Style</Badge>}
                  {initialProfiles?.your?.[0]?.loveLanguages?.length > 0 && <Badge variant="secondary" className="text-xs">Love Language</Badge>}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => openQuestionnaire()}
                className="flex-1 text-sm"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                {yourCompletion > 0 ? 'Continue' : 'Start Profile'}
              </Button>
              
              {yourCompletion > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewProfile('your')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Partner Profile Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full -translate-y-16 -translate-x-16 opacity-50"></div>
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {partnerName || 'Partner'} Profile
                </h3>
                <p className="text-sm text-gray-500 font-normal">Understanding their style</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Completion</span>
                <span className="text-sm text-gray-500">{partnerCompletion}%</span>
              </div>
              <Progress value={partnerCompletion} className="h-2" />
            </div>

            {partnerCompletion > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">What we know:</p>
                <div className="flex flex-wrap gap-1">
                  {partnerName && <Badge variant="secondary" className="text-xs">Name</Badge>}
                  {initialProfiles?.partner?.[0]?.communicationStyle && <Badge variant="secondary" className="text-xs">Communication</Badge>}
                  {initialProfiles?.partner?.[0]?.loveLanguages?.length > 0 && <Badge variant="secondary" className="text-xs">Love Language</Badge>}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => handleOpenProfileForm('partner')}
                variant="outline"
                className="flex-1 text-sm"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                {partnerCompletion > 0 ? 'Continue' : 'Start Profile'}
              </Button>
              
              {partnerCompletion > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewProfile('partner')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-coral-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Pro tip:</strong> Complete your personal profile first to unlock chat with Kai, your relationship coach.
              </p>
              <p className="text-xs text-gray-600">
                The more we know, the better personalized advice Kai can provide.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Profile Questionnaire */}
      <PersonalProfileQuestionnaire
        isOpen={showQuestionnaire}
        onClose={handleQuestionnaireClose}
        onComplete={handleQuestionnaireComplete}
      />

      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={initialDemographics[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={initialProfiles}
          initialDemographics={initialDemographics}
        />
      )}

      {/* Profile Viewer Modal */}
      {showProfileViewer && (
        <ProfileViewer
          profileType={viewingProfileType}
          profileData={initialProfiles[viewingProfileType]}
          demographicsData={initialDemographics[viewingProfileType]}
          onEdit={handleEditProfile}
          onClose={() => setShowProfileViewer(false)}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
