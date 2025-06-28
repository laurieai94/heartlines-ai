import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, User, Plus, Clock, CheckCircle, Search, ArrowRight, Lightbulb, Star, Target, Sparkles, Brain, Users, MessageSquare } from "lucide-react";
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
    <div className="space-y-8">
      {/* Main Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Let's Get to Know the Real You
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Build your relationship profiles in just 5 minutes
        </p>
      </div>

      {/* Streamlined Two-Card Layout */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Card 1: Build Your RealTalk Profile */}
        <Card className="group p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-300">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  Build Your RealTalk Profile
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <Progress value={yourProfileStats.completion} className="h-3 bg-white/60" />
                  </div>
                  <span className="text-lg font-semibold text-purple-600">
                    {yourProfileStats.completion}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              This is where it starts. Answer a few quick questions to help RealTalk understand you—how you love, what shaped you, and what matters most. The more you share, the smarter your guidance becomes.
            </p>

            <div className="bg-white/70 rounded-xl p-4 border border-purple-200/50">
              <div className="flex items-center gap-3 text-purple-700 mb-3">
                <Target className="w-5 h-5" />
                <span className="font-semibold">What You'll Unlock:</span>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  Psychologist-level insights
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  Personalized daily support
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  Better advice built around you
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={openQuestionnaire}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                Begin My Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Just 5 minutes to start, with deep dives if you're up for it</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Add Their Side Too? (Keep as-is) */}
        <Card className="group p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 border-2 border-rose-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-rose-300">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">Add Their Side Too?</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <Progress value={partnerProfileStats.completion} className="h-3 bg-white/60" />
                  </div>
                  <span className="text-lg font-semibold text-rose-600">
                    {partnerProfileStats.completion}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              You know them best. Share what you've observed about their style, needs, and reactions so RealTalk can offer insights that work for both of you.
            </p>

            <div className="bg-white/70 rounded-xl p-4 border border-rose-200/50">
              <div className="flex items-center gap-3 text-rose-700 mb-3">
                <Lightbulb className="w-5 h-5" />
                <span className="font-semibold">What You'll Unlock:</span>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-rose-500" />
                  Specific ways to support them
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-rose-500" />
                  Scripts tuned to their communication style
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-rose-500" />
                  Compatibility insights based on patterns
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => handleStartProfile('partner')}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                Add Partner Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-center text-gray-500">
                Based on your observations (or fill it out together!)
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Value Proposition */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg max-w-5xl mx-auto">
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-gray-900">The Questions That Actually Matter</h3>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            How do you really act when you're stressed? What makes you feel most loved? 
            What toxic patterns are you definitely not repeating from your last relationship? 
            (Spoiler: you probably are.) The more honest you are, the less we'll sound like a generic self-help book.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="text-left space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">Simple Process:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">5 minutes for core insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Optional deep dives for advanced features</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Update anytime as you grow</span>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">You Get:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Personalized conversation scripts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Stress support strategies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Love language insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expandable Tips Section */}
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-gray-600 hover:text-gray-900 text-lg py-3"
        >
          {showDetails ? 'Hide' : 'Show'} Tips
          <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
        </Button>
        
        {showDetails && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Privacy Note */}
            <Card className="p-6 bg-gray-50 border-l-4 border-blue-400">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-500" />
                <p className="text-gray-600">
                  <strong>Privacy:</strong> All profile responses stay private to you. Only share insights you choose to share.
                </p>
              </div>
            </Card>

            {/* Profile Building Tips */}
            <Card className="p-8 bg-white/60 backdrop-blur-md border-0 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Profile Building Tips</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Be honest</h4>
                      <p className="text-gray-600">The AI only works with real data, not aspirational answers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">"Not sure yet" is okay</h4>
                      <p className="text-gray-600">Profiles improve as you learn more about each other</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Start with core questions</h4>
                      <p className="text-gray-600">Get immediate value, then expand sections over time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Update as you grow</h4>
                      <p className="text-gray-600">Relationships evolve, and so should your profiles</p>
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
