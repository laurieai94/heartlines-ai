import { useState, Suspense, lazy, useEffect } from "react";
import { toast } from "sonner";
import { Brain, Heart, Target, Lightbulb, Star, Search } from "lucide-react";
// Lazy load heavy components to reduce initial bundle size
const ProfileForm = lazy(() => import("@/components/ProfileForm"));
const Demographics = lazy(() => import("@/components/Demographics"));
const ProfileCompletionOptions = lazy(() => import("@/components/ProfileCompletionOptions"));
import ProfileCard from "@/components/ProfileBuilder/ProfileCard";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { usePersonalProfileData } from '@/hooks/usePersonalProfileData';
import { performanceMonitor } from "@/utils/performanceMonitor";
import OnboardingStepNudge from "@/components/OnboardingStepNudge";
import { logEvent } from "@/utils/analytics";

// Lazy load secondary components to reduce initial bundle size
const ProfileTips = lazy(() => import("@/components/ProfileBuilder/ProfileTips"));
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
  const { profileData: personalProfileData } = usePersonalProfileData();
  
  // Get user's name for personalization
  const userName = temporaryDemographics.your?.name || (personalProfileData as any)?.name || '';
  
  // Performance monitoring
  useEffect(() => {
    performanceMonitor.mark('profile-data-load');
    performanceMonitor.measure('profile-chunk-load', 100); // Measure chunk load time
    
    if (personalProfileData) {
      performanceMonitor.measure('profile-data-load', 100);
    }
  }, [personalProfileData]);
  
  // Use consistent completion calculation for both profiles
  const yourProfileCompletion = calculateYourCompletion();
  const partnerProfileCompletion = calculatePartnerCompletion();
  const handleStartPersonalProfile = () => {
    logEvent('onboarding_step_nudge_clicked', { 
      completion: yourProfileCompletion,
      action: yourProfileCompletion > 0 ? 'continue' : 'start'
    });
    
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

    // Show success message only
    toast.success(`${activeProfileType === 'your' ? userName ? `${userName}'s` : 'Your' : 'Partner'} profile saved successfully!`);

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
  return <div className="flex flex-col">
      <div className="space-y-4 pb-6">
        {/* Main Header - Compact */}
        <div className="text-center space-y-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white">Let's Get to Know Your Situationship</h1>
          <p className="text-base text-pink-200/80 max-w-2xl mx-auto">
            4 quick questions → Kai can start coaching.
          </p>
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="space-y-4">
        {/* Step 1 Nudge - Only show if personal profile is incomplete */}
        {yourProfileCompletion < 100 && (
          <OnboardingStepNudge 
            completion={yourProfileCompletion}
            onStartProfile={handleStartPersonalProfile}
          />
        )}
        {/* Compact Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Your Profile Card */}
          <ProfileCard 
            title="Your Profile" 
            completion={yourProfileCompletion} 
            description="Just 4 required questions" 
            benefits={[
              { icon: <Target className="w-4 h-4" />, text: "Add extra details if you want deeper insights" },
              { icon: <Star className="w-3 h-3 text-orange-300" />, text: "Full profile takes ~5 minutes max" }
            ]} 
            onStartProfile={handleStartPersonalProfile} 
            buttonText="Continue Profile" 
            iconElement={<Heart className="w-5 h-5 text-white" />} 
            progressColor="text-orange-300" 
            benefitColor="text-orange-300" 
          />

          {/* Partner Profile Card */}
          <ProfileCard 
            title="Your Person's Profile (Optional)" 
            completion={partnerProfileCompletion} 
            description="Add what you know about them so Kai sees both sides." 
            benefits={[
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Dual-perspective coaching" },
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Better back-and-forth tips" },
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Advice that considers both of you" }
            ]} 
            onStartProfile={handleStartPartnerProfile} 
            buttonText="Add Your Person" 
            iconElement={<Heart className="w-5 h-5 text-white" />} 
            progressColor="text-pink-300" 
            benefitColor="text-pink-300" 
          />
        </div>

        {/* Privacy Banner - Always visible */}
        <div className="max-w-4xl mx-auto sticky top-4 z-20">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-white/70" />
              <p className="text-sm text-white/80">
                <span className="font-medium">Privacy:</span> Private by design — only you (and Kai) see your profiles. Everything's encrypted, private, and in your hands.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Tips Section */}
        <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-xl h-24" />}>
          <ProfileTips />
        </Suspense>
      </div>

      {/* Modals for partner profile only */}
      {showDemographics && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <Demographics profileType={activeProfileType} onComplete={handleDemographicsComplete} onClose={handleDemographicsClose} initialData={temporaryDemographics[activeProfileType]} />
        </Suspense>
      )}

      {showForm && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <ProfileForm profileType={activeProfileType} onClose={() => setShowForm(false)} onComplete={handleProfileComplete} initialProfiles={temporaryProfiles} initialDemographics={temporaryDemographics} />
        </Suspense>
      )}

      </div>
    </div>;
};
export default ProfileBuilder;