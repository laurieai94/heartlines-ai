import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, User, Plus, Clock, CheckCircle, Search, ArrowRight, Lightbulb, Star, Target, Sparkles, Brain, Users, MessageSquare, Play, Zap, Shield } from "lucide-react";
import { toast } from "sonner";
import ProfileForm from "@/components/ProfileForm";
import Demographics from "@/components/Demographics";
import PersonalProfileQuestionnaire from "@/components/PersonalProfileQuestionnaire";
import { usePersonalProfileQuestionnaire } from "@/hooks/usePersonalProfileQuestionnaire";

interface ProfileStats {
  completion: number;
  sectionsComplete: number;
  totalSections: number;
}

interface ProfileBuilderProps {
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  initialProfiles?: {your: any[], partner: any[]};
  initialDemographics?: {your: any, partner: any};
}

const ProfileBuilder = ({ 
  onProfileUpdate, 
  initialProfiles = { your: [], partner: [] }, 
  initialDemographics = { your: null, partner: null } 
}: ProfileBuilderProps) => {
  const [profiles, setProfiles] = useState<{your: any[], partner: any[]}>(initialProfiles);
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showDetails, setShowDetails] = useState(false);
  const [demographicsData, setDemographicsData] = useState<{your: any, partner: any}>(initialDemographics);

  const { 
    showQuestionnaire, 
    openQuestionnaire, 
    handleQuestionnaireComplete, 
    handleQuestionnaireClose 
  } = usePersonalProfileQuestionnaire();

  // Get user's name for personalization
  const userName = demographicsData.your?.name || '';

  // Calculate more detailed completion percentages
  const calculateProfileCompletion = (profileData: any[], demographicsData: any) => {
    let totalFields = 0;
    let completedFields = 0;

    // Demographics fields (required for completion)
    const demographicsFields = ['name', 'pronouns', 'age', 'education', 'workSituation'];
    totalFields += demographicsFields.length;
    if (demographicsData) {
      completedFields += demographicsFields.filter(field => demographicsData[field] && demographicsData[field] !== '').length;
    }

    // Background & lifestyle fields (now required)
    const backgroundFields = ['familyBackground', 'parentsRelationship', 'personalityType', 'healthWellness'];
    totalFields += backgroundFields.length;
    if (demographicsData) {
      completedFields += backgroundFields.filter(field => demographicsData[field] && demographicsData[field] !== '').length;
    }

    // Profile fields (core required fields)
    const profileFields = [
      'importantTalkPreference', 'communicationDirectness', 'emotionExpression', 'loveLanguages',
      'conflictResponse', 'stressSpaceNeed', 'stressSupportNeed', 'goSilentWhenUpset', 'needToTalkImmediately',
      'beingRushedMakesWorse', 'feelHeardWithValidation',
      'comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt',
      'relationshipLength', 'relationshipType', 'improvingCommunicationFocus'
    ];
    totalFields += profileFields.length;
    
    if (profileData.length > 0) {
      const profile = profileData[0];
      completedFields += profileFields.filter(field => {
        const value = profile[field];
        return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
      }).length;
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const yourProfileStats: ProfileStats = {
    completion: calculateProfileCompletion(profiles.your, demographicsData.your),
    sectionsComplete: profiles.your.length > 0 ? 4 : 0,
    totalSections: 5
  };

  const partnerProfileStats: ProfileStats = {
    completion: calculateProfileCompletion(profiles.partner, demographicsData.partner),
    sectionsComplete: profiles.partner.length > 0 ? 2 : 0,
    totalSections: 5
  };

  const handleStartProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // Start with demographics if not completed yet
    if (!demographicsData[profileType]) {
      setShowDemographics(true);
    } else {
      setShowForm(true);
    }
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...demographicsData,
      [activeProfileType]: demographics
    };
    setDemographicsData(newDemographics);
    setShowDemographics(false);
    setShowForm(true);
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(profiles, newDemographics);
    }
  };

  const handleDemographicsClose = () => {
    setShowDemographics(false);
  };

  const handleProfileComplete = (profile: any) => {
    const newProfiles = {
      ...profiles,
      [activeProfileType]: [...profiles[activeProfileType], profile]
    };
    setProfiles(newProfiles);
    setShowForm(false);
    toast.success(`${activeProfileType === 'your' ? (userName ? `${userName}'s` : 'Your') : 'Partner'} profile saved successfully!`);
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(newProfiles, demographicsData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          Let's Get to Know the Real You
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build your relationship profiles in just 5 minutes
        </p>
      </div>

      {/* Compact Two-Card Layout */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Card 1: Your Profile */}
        <Card className="group p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  Your Profile
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1">
                    <Progress value={yourProfileStats.completion} className="h-2 bg-white/60" />
                  </div>
                  <span className="text-sm font-semibold text-purple-600">
                    {yourProfileStats.completion}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              This is where we truly get you. Answer a few quick questions about how you love, what shaped you, and what truly matters. Honesty powers more intentional conversations.
            </p>

            <div className="bg-white/70 rounded-lg p-3 border border-purple-200/50">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Target className="w-4 h-4" />
                <span className="font-semibold text-sm">What You'll Unlock:</span>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-500" />
                  Psychologist-level insights
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-500" />
                  Personalized daily support
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-500" />
                  Better advice built around you
                </li>
              </ul>
            </div>

            <Button 
              onClick={openQuestionnaire}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              Begin My Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Card 2: Unlock Their Perspective Too */}
        <Card className="group p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 border-2 border-rose-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-rose-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Unlock Their Perspective Too</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1">
                    <Progress value={partnerProfileStats.completion} className="h-2 bg-white/60" />
                  </div>
                  <span className="text-sm font-semibold text-rose-600">
                    {partnerProfileStats.completion}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              Share what you've observed about your partner's style, needs, and reactions. This isn't about spilling tea; it's about giving RealTalk the insights to bridge the gap between you two truly.
            </p>

            <div className="bg-white/70 rounded-lg p-3 border border-rose-200/50">
              <div className="flex items-center gap-2 text-rose-700 mb-2">
                <Lightbulb className="w-4 h-4" />
                <span className="font-semibold text-sm">What You'll Unlock:</span>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-rose-500" />
                  The power to build lasting, authentic connection
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-rose-500" />
                  Deep, actionable insights (think therapy, but on your schedule)
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-rose-500" />
                  Smarter advice that just gets you and your partner
                </li>
              </ul>
            </div>

            <Button 
              onClick={() => handleStartProfile('partner')}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              Add Partner Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Compact Value Proposition */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">The Questions That Actually Matter</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            How do you really act when you're stressed? What makes you feel most loved? 
            What toxic patterns are you definitely not repeating from your last relationship? 
            (Spoiler: you probably are.) The more honest you are, the less we'll sound like a generic self-help book.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="text-left space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Simple Process:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Play className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Build your profile to capture your unique relationship vibe</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Connect with Kai for AI-powered clarity that just gets it</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Take real action, leveling up your bond with smart advice</span>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">You Get:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Mastering the 'We need to talk'</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Turning arguments into wins</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Making your actions actually count</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expandable Tips Section */}
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-gray-600 hover:text-gray-900 text-base py-2"
        >
          {showDetails ? 'Hide' : 'Show'} Tips
          <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
        </Button>
        
        {showDetails && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {/* Privacy Note */}
            <Card className="p-4 bg-gray-50 border-l-4 border-blue-400">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-gray-500" />
                <p className="text-gray-600 text-sm">
                  <strong>Privacy:</strong> All profile responses stay private to you. Only share insights you choose to share.
                </p>
              </div>
            </Card>

            {/* Profile Building Tips */}
            <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Building Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Be honest</h4>
                      <p className="text-gray-600 text-sm">The AI only works with real data, not aspirational answers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">"Not sure yet" is okay</h4>
                      <p className="text-gray-600 text-sm">Profiles improve as you learn more about each other</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Start with core questions</h4>
                      <p className="text-gray-600 text-sm">Get immediate value, then expand sections over time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Update as you grow</h4>
                      <p className="text-gray-600 text-sm">Relationships evolve, and so should your profiles</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onComplete={handleDemographicsComplete}
          onClose={handleDemographicsClose}
          initialData={demographicsData[activeProfileType]}
        />
      )}

      {/* Profile Form Modal */}
      {showForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowForm(false)}
          onComplete={handleProfileComplete}
          initialProfiles={profiles}
          initialDemographics={demographicsData}
        />
      )}

      {/* Personal Profile Questionnaire Modal */}
      {showQuestionnaire && (
        <PersonalProfileQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onClose={handleQuestionnaireClose}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
