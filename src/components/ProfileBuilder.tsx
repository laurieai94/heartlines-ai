import { useState } from "react";
import { toast } from "sonner";
import { Brain, Heart, Target, Lightbulb, Star } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";
import Demographics from "@/components/Demographics";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";
import ProfileCard from "@/components/ProfileBuilder/ProfileCard";
import ValueProposition from "@/components/ProfileBuilder/ValueProposition";
import ProfileTips from "@/components/ProfileBuilder/ProfileTips";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useUnifiedProfileStorage } from "@/hooks/useUnifiedProfileStorage";
interface ProfileBuilderProps {
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  initialProfiles?: {
    your: any[];
    partner: any[];
  };
  initialDemographics?: {
    your: any;
    partner: any;
  };
  onOpenQuestionnaire?: () => void;
  onOpenPartnerQuestionnaire?: () => void;
}
const ProfileBuilder = ({
  onProfileUpdate,
  initialProfiles = {
    your: [],
    partner: []
  },
  initialDemographics = {
    your: null,
    partner: null
  },
  onOpenQuestionnaire,
  onOpenPartnerQuestionnaire
}: ProfileBuilderProps) => {
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);

  // Use centralized progress tracking and temporary profile data
  const {
    profileCompletion
  } = useProgressiveAccess();
  const {
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile,
    isLoaded
  } = useTemporaryProfile();
  const {
    calculateYourCompletion,
    calculatePartnerCompletion
  } = useProfileCompletion();

  // Get actual personal profile data for accurate progress calculation
  const personalProfileStorage = useUnifiedProfileStorage('personal');
  
  // Get user's name for personalization
  const userName = temporaryDemographics.your?.name || personalProfileStorage.profileData?.name || '';
  
  // Use consistent completion calculation for both profiles
  const yourProfileCompletion = calculateYourCompletion();
  const partnerProfileCompletion = calculatePartnerCompletion();
  const handleStartPersonalProfile = () => {
    console.log('handleStartPersonalProfile called, onOpenQuestionnaire exists:', !!onOpenQuestionnaire);
    // Call the callback to open the questionnaire modal in Dashboard
    if (onOpenQuestionnaire) {
      onOpenQuestionnaire();
    } else {
      console.error('onOpenQuestionnaire callback not provided');
    }
  };
  const handleStartPartnerProfile = () => {
    console.log('handleStartPartnerProfile called, onOpenPartnerQuestionnaire exists:', !!onOpenPartnerQuestionnaire);
    // Call the callback to open the partner questionnaire modal in Dashboard
    if (onOpenPartnerQuestionnaire) {
      onOpenPartnerQuestionnaire();
    } else {
      console.error('onOpenPartnerQuestionnaire callback not provided');
    }
  };
  const handleStartProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // For partner profiles, still use the old flow
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
      toast.success(`${activeProfileType === 'your' ? userName ? `${userName}'s` : 'Your' : 'Partner'} profile saved successfully!`);
    }

    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(newProfiles, temporaryDemographics);
    }
  };
  const handlePartnerCompletionClose = () => {
    setShowPartnerCompletionOptions(false);
  };
  const handlePartnerCompletionStartChat = () => {
    setShowPartnerCompletionOptions(false);
    // This would need to be handled by the parent component
  };
  const yourProfileBenefits = [{
    icon: <Target className="w-4 h-4" />,
    text: "What You'll Get:"
  }, {
    icon: <Star className="w-3 h-3 text-orange-300" />,
    text: "Personalized coaching tailored to your patterns"
  }, {
    icon: <Star className="w-3 h-3 text-orange-300" />,
    text: "Deep insights into your relationship style"
  }, {
    icon: <Star className="w-3 h-3 text-orange-300" />,
    text: "Custom advice that actually gets you"
  }];
  const partnerProfileBenefits = [{
    icon: <Lightbulb className="w-4 h-4" />,
    text: "What You'll Unlock:"
  }, {
    icon: <Star className="w-3 h-3 text-pink-300" />,
    text: "Dual-perspective relationship insights"
  }, {
    icon: <Star className="w-3 h-3 text-pink-300" />,
    text: "Bridge-building communication tips"
  }, {
    icon: <Star className="w-3 h-3 text-pink-300" />,
    text: "Advice that considers both of you"
  }];
  return <div className="flex flex-col space-y-4 pb-6">
      {/* Main Header - Compact */}
      <div className="text-center space-y-2 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Let's Get to Know Your Situationship</h1>
        <p className="text-base text-pink-200/80 max-w-2xl mx-auto">
          Build your relationship profiles to unlock personalized insights
        </p>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="space-y-4">
        {/* Compact Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Your Profile Card */}
          <ProfileCard title="Your Profile" completion={yourProfileCompletion} description="Complete our comprehensive questionnaire to unlock personalized relationship insights from Kai, your AI coach." benefits={yourProfileBenefits} onStartProfile={handleStartPersonalProfile} buttonText={yourProfileCompletion > 0 ? 'Continue Your Profile' : 'Start Your Profile'} iconElement={<Heart className="w-5 h-5 text-white" />} progressColor="text-orange-300" benefitColor="text-orange-300" />

          {/* Partner Profile Card */}
          <ProfileCard title="Partner Profile" completion={partnerProfileCompletion} description="Share what you know about your partner's communication style and preferences for even better insights." benefits={partnerProfileBenefits} onStartProfile={handleStartPartnerProfile} buttonText={partnerProfileCompletion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'} iconElement={<Heart className="w-5 h-5 text-white" />} progressColor="text-pink-300" benefitColor="text-pink-300" />
        </div>

        {/* Compact Value Proposition */}
        <ValueProposition />

        {/* Collapsible Tips Section */}
        <ProfileTips />
      </div>

      {/* Modals for partner profile only */}
      {showDemographics && <Demographics profileType={activeProfileType} onComplete={handleDemographicsComplete} onClose={handleDemographicsClose} initialData={temporaryDemographics[activeProfileType]} />}

      {showForm && <ProfileForm profileType={activeProfileType} onClose={() => setShowForm(false)} onComplete={handleProfileComplete} initialProfiles={temporaryProfiles} initialDemographics={temporaryDemographics} />}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && <ProfileCompletionOptions completionType="partner" onAddPartnerProfile={() => {}} // Not used for partner completion
    onStartChatting={handlePartnerCompletionStartChat} onClose={handlePartnerCompletionClose} onEditProfile={() => {}} // Not used in ProfileBuilder context
    hasPartnerProfile={true} />}
    </div>;
};
export default ProfileBuilder;