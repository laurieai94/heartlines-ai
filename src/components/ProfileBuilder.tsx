import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, User, Plus, Clock, CheckCircle, Search, ArrowRight, Lightbulb, Star, Target, Sparkles, Brain, Users, MessageSquare, Play, Zap, Shield } from "lucide-react";
import { toast } from "sonner";
import ProfileForm from "@/components/ProfileForm";
import Demographics from "@/components/Demographics";
import PersonalProfileQuestionnaire from "@/components/PersonalProfileQuestionnaire";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";
import { usePersonalProfileQuestionnaire } from "@/hooks/usePersonalProfileQuestionnaire";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";

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
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showDetails, setShowDetails] = useState(false);
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);

  const { 
    showQuestionnaire, 
    showCompletionOptions,
    openQuestionnaire, 
    handleQuestionnaireComplete, 
    handleQuestionnaireClose,
    handleCompletionOptionsClose,
    handleAddPartnerProfile,
    handleStartChatting
  } = usePersonalProfileQuestionnaire();

  // Use centralized progress tracking and temporary profile data
  const { profileCompletion } = useProgressiveAccess();
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile, isLoaded } = useTemporaryProfile();

  // Get user's name for personalization
  const userName = temporaryDemographics.your?.name || '';

  const calculateYourCompletion = () => {
    if (!isLoaded) return 0;
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemo = temporaryDemographics.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8;
    
    // Basic info
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    
    // Emotional blueprint - check both profile and demographics
    if (yourProfile?.stressReactions?.length > 0 || yourDemo?.stressReactions?.length > 0) completed++;
    if (yourProfile?.attachmentStyles?.length > 0 || yourDemo?.attachmentStyles?.length > 0) completed++;
    if (yourProfile?.loveLanguages?.length > 0 || yourDemo?.loveLanguages?.length > 0) completed++;
    if (yourProfile?.receiveLove?.length > 0 || yourDemo?.receiveLove?.length > 0) completed++;
    
    // Background
    if (yourProfile?.familyDynamics?.length > 0 || yourDemo?.familyDynamics?.length > 0) completed++;
    if (yourProfile?.relationshipStatus?.length > 0 || yourDemo?.relationshipStatus?.length > 0) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Your profile completion:', { completed, total, completion });
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!isLoaded) return 0;
    
    const partnerProfile = temporaryProfiles.partner[0];
    const partnerDemo = temporaryDemographics.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Partner profile completion:', { completed, total, completion });
    return completion;
  };

  const yourProfileCompletion = calculateYourCompletion();
  const partnerProfileCompletion = calculatePartnerCompletion();

  const handleStartProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // Start with demographics if not completed yet
    if (!temporaryDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowForm(true);
    }
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...temporaryDemographics,
      [activeProfileType]: demographics
    };
    
    // Update temporary profile system
    updateTemporaryProfile(temporaryProfiles, newDemographics);
    setShowDemographics(false);
    setShowForm(true);
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(temporaryProfiles, newDemographics);
    }
  };

  const handleDemographicsClose = () => {
    setShowDemographics(false);
  };

  const handleProfileComplete = (profile: any) => {
    const newProfiles = {
      ...temporaryProfiles,
      [activeProfileType]: [...(temporaryProfiles[activeProfileType] || []).slice(0, 0), profile]
    };
    
    // Update temporary profile system
    updateTemporaryProfile(newProfiles, temporaryDemographics);
    setShowForm(false);
    
    // Check if this is partner profile completion
    if (activeProfileType === 'partner') {
      setShowPartnerCompletionOptions(true);
      toast.success('Partner profile completed!');
    } else {
      toast.success(`${activeProfileType === 'your' ? (userName ? `${userName}'s` : 'Your') : 'Partner'} profile saved successfully!`);
    }
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(newProfiles, temporaryDemographics);
    }
  };

  // Handle completion options from personal profile questionnaire
  const handlePersonalProfileAddPartner = () => {
    handleAddPartnerProfile();
    setActiveProfileType('partner');
    if (!temporaryDemographics.partner) {
      setShowDemographics(true);
    } else {
      setShowForm(true);
    }
  };

  const handlePartnerCompletionClose = () => {
    setShowPartnerCompletionOptions(false);
  };

  const handlePartnerCompletionStartChat = () => {
    setShowPartnerCompletionOptions(false);
    handleStartChatting();
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Main Header - Modern and Clean */}
      <div className="text-center space-y-3 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white">
          Build Your Relationship Profile
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Get personalized insights in just 5 minutes
        </p>
        {/* Real-time overall progress indicator */}
        {profileCompletion > 0 && (
          <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
            <span>Overall Progress:</span>
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <span className="font-semibold text-white">{profileCompletion}%</span>
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 space-y-6">
        {/* Clean Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Your Profile */}
          <Card className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    Your Profile
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1">
                      <Progress value={yourProfileCompletion} className="h-2" />
                    </div>
                    <span className="text-sm font-semibold text-blue-300">
                      {yourProfileCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Answer quick questions about your communication style, love language, and relationship patterns to unlock personalized insights.
              </p>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-blue-300 mb-3">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold text-sm">What You'll Get:</span>
                </div>
                <ul className="space-y-2 text-slate-300 text-xs">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-blue-300" />
                    Psychology-backed insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-blue-300" />
                    Personalized relationship advice
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-blue-300" />
                    Daily support tailored to you
                  </li>
                </ul>
              </div>

              <Button 
                onClick={openQuestionnaire}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
              >
                {yourProfileCompletion > 0 ? 'Continue Profile' : 'Start Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Card 2: Partner Profile */}
          <Card className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Partner Profile</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1">
                      <Progress value={partnerProfileCompletion} className="h-2" />
                    </div>
                    <span className="text-sm font-semibold text-purple-300">
                      {partnerProfileCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Share what you know about your partner's communication style and preferences to get relationship advice that works for both of you.
              </p>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-purple-300 mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-semibold text-sm">Unlock Together:</span>
                </div>
                <ul className="space-y-2 text-slate-300 text-xs">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-purple-300" />
                    Deeper connection strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-purple-300" />
                    Conflict resolution tools
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-purple-300" />
                    Relationship growth plans
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => handleStartProfile('partner')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
              >
                {partnerProfileCompletion > 0 ? 'Continue Partner' : 'Add Partner'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Value Proposition */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl max-w-5xl mx-auto rounded-2xl">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Why This Works</h3>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Our approach is based on relationship psychology research. The more we understand your unique dynamics, the better advice we can provide.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="text-left space-y-3">
                <h4 className="text-lg font-semibold text-white">Simple Process:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300 text-sm">Complete your relationship profiles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300 text-sm">Get AI-powered insights and coaching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300 text-sm">Take action with personalized guidance</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left space-y-3">
                <h4 className="text-lg font-semibold text-white">Relationship Benefits:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300 text-sm">Better communication skills</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300 text-sm">Stronger emotional connection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300 text-sm">More meaningful interactions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Collapsible Tips Section */}
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-slate-300 hover:text-white text-sm py-2 hover:bg-white/10 rounded-xl"
          >
            {showDetails ? 'Hide' : 'Show'} Tips & Privacy Info
            <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
          </Button>
          
          {showDetails && (
            <div className="mt-4 space-y-4 animate-fade-in">
              <Card className="p-4 bg-white/5 backdrop-blur-sm border-l-4 border-blue-400 rounded-xl">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-300" />
                  <p className="text-slate-300 text-sm">
                    <strong className="text-white">Privacy:</strong> Your profile data is private and secure. Only you can see your responses.
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">Tips for Better Results</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Be honest</h4>
                        <p className="text-slate-300 text-xs">Accurate data leads to better insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Take your time</h4>
                        <p className="text-slate-300 text-xs">Think about real situations when answering</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Start simple</h4>
                        <p className="text-slate-300 text-xs">Complete core sections first for immediate value</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Update regularly</h4>
                        <p className="text-slate-300 text-xs">Relationships evolve, and so should your profiles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onComplete={handleDemographicsComplete}
          onClose={handleDemographicsClose}
          initialData={temporaryDemographics[activeProfileType]}
        />
      )}

      {showForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowForm(false)}
          onComplete={handleProfileComplete}
          initialProfiles={temporaryProfiles}
          initialDemographics={temporaryDemographics}
        />
      )}

      {showQuestionnaire && (
        <PersonalProfileQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onClose={handleQuestionnaireClose}
        />
      )}

      {/* Personal Profile Completion Options */}
      {showCompletionOptions && (
        <ProfileCompletionOptions
          completionType="personal"
          onAddPartnerProfile={handlePersonalProfileAddPartner}
          onStartChatting={handleStartChatting}
          onClose={handleCompletionOptionsClose}
          hasPartnerProfile={temporaryProfiles.partner.length > 0}
        />
      )}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && (
        <ProfileCompletionOptions
          completionType="partner"
          onAddPartnerProfile={() => {}} // Not used for partner completion
          onStartChatting={handlePartnerCompletionStartChat}
          onClose={handlePartnerCompletionClose}
          hasPartnerProfile={true}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
