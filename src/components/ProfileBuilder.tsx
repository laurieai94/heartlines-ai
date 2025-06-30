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
    <div className="h-full flex flex-col space-y-4">
      {/* Main Header - Compact */}
      <div className="text-center space-y-2 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">
          Let's Get to Know the Real You
        </h1>
        <p className="text-base text-pink-200/80 max-w-2xl mx-auto">
          Build your relationship profiles in just 5 minutes
        </p>
        {/* Real-time overall progress indicator */}
        {profileCompletion > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-pink-200/80">
            <span>Overall Progress:</span>
            <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <span className="font-semibold text-white">{profileCompletion}%</span>
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 space-y-4">
        {/* Compact Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Card 1: Your Profile */}
          <Card className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    Your Profile
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1">
                      <Progress value={yourProfileCompletion} className="h-2 bg-black/40" />
                    </div>
                    <span className="text-sm font-semibold text-orange-300">
                      {yourProfileCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-pink-200/80 text-sm leading-relaxed">
                This is where we truly get you. Answer a few quick questions about how you love, what shaped you, and what truly matters.
              </p>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 text-orange-300 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold text-sm">What You'll Unlock:</span>
                </div>
                <ul className="space-y-1 text-pink-200/80 text-xs">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-orange-300" />
                    Psychologist-level insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-orange-300" />
                    Personalized daily support
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-orange-300" />
                    Better advice built around you
                  </li>
                </ul>
              </div>

              <Button 
                onClick={openQuestionnaire}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
              >
                {yourProfileCompletion > 0 ? 'Continue My Profile' : 'Begin My Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Card 2: Unlock Their Perspective Too */}
          <Card className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">Unlock Their Perspective Too</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1">
                      <Progress value={partnerProfileCompletion} className="h-2 bg-black/40" />
                    </div>
                    <span className="text-sm font-semibold text-pink-300">
                      {partnerProfileCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-pink-200/80 text-sm leading-relaxed">
                Share what you've observed about your partner's style, needs, and reactions. This gives RealTalk the insights to bridge the gap between you two.
              </p>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 text-pink-300 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-semibold text-sm">What You'll Unlock:</span>
                </div>
                <ul className="space-y-1 text-pink-200/80 text-xs">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-pink-300" />
                    Build lasting, authentic connection
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-pink-300" />
                    Deep, actionable insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-pink-300" />
                    Smarter advice that gets you both
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => handleStartProfile('partner')}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
              >
                {partnerProfileCompletion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Compact Value Proposition */}
        <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-white">The Questions That Actually Matter</h3>
            <p className="text-base text-pink-200/80 max-w-3xl mx-auto leading-relaxed">
              How do you really act when you're stressed? What makes you feel most loved? 
              The more honest you are, the less we'll sound like a generic self-help book.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="text-left space-y-2">
                <h4 className="text-base font-semibold text-white">Simple Process:</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-green-300" />
                    <span className="text-pink-200/80 text-sm">Build your profile to capture your unique relationship vibe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-green-300" />
                    <span className="text-pink-200/80 text-sm">Connect with Kai for AI-powered clarity that just gets it</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-green-300" />
                    <span className="text-pink-200/80 text-sm">Take real action, leveling up your bond with smart advice</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left space-y-2">
                <h4 className="text-base font-semibold text-white">You Get:</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-orange-300" />
                    <span className="text-pink-200/80 text-sm">Mastering the 'We need to talk'</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-orange-300" />
                    <span className="text-pink-200/80 text-sm">Turning arguments into wins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-orange-300" />
                    <span className="text-pink-200/80 text-sm">Making your actions actually count</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Collapsible Tips Section */}
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-pink-200/80 hover:text-white text-sm py-2 hover:bg-white/10"
          >
            {showDetails ? 'Hide' : 'Show'} Tips
            <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
          </Button>
          
          {showDetails && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <Card className="p-3 bg-white/5 backdrop-blur-sm border-l-4 border-orange-400">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-pink-200/80" />
                  <p className="text-pink-200/80 text-sm">
                    <strong className="text-white">Privacy:</strong> All profile responses stay private to you. Only share insights you choose to share.
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Profile Building Tips</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Be honest</h4>
                        <p className="text-pink-200/80 text-xs">The AI only works with real data, not aspirational answers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">"Not sure yet" is okay</h4>
                        <p className="text-pink-200/80 text-xs">Profiles improve as you learn more about each other</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Start with core questions</h4>
                        <p className="text-pink-200/80 text-xs">Get immediate value, then expand sections over time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Update as you grow</h4>
                        <p className="text-pink-200/80 text-xs">Relationships evolve, and so should your profiles</p>
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
