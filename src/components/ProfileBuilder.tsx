import { useState, Suspense, lazy, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Heart, Target, Lightbulb, Star, Search, Lock, Clock, MessageSquare, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BRAND } from "@/branding";
// Lazy load heavy components to reduce initial bundle size
const ProfileForm = lazy(() => import("@/components/ProfileForm"));
const Demographics = lazy(() => import("@/components/Demographics"));
const ProfileCompletionOptions = lazy(() => import("@/components/ProfileCompletionOptions"));
import ProfileCard from "@/components/ProfileBuilder/ProfileCard";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { usePersonalProfileData } from '@/hooks/usePersonalProfileData';
import { usePartnerProfileData } from '@/hooks/usePartnerProfileData';
import { performanceMonitor } from "@/utils/performanceMonitor";
import OnboardingStepNudge from "@/components/OnboardingStepNudge";
import { logEvent } from "@/utils/analytics";
import { getCompletedRequiredFieldsCount, getTotalRequiredFieldsCount } from '@/components/NewPersonalQuestionnaire/utils/requirements';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';
import { useProfileMobileOptimizations } from '@/hooks/useProfileMobileOptimizations';

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
  const { profileData: partnerProfileData } = usePartnerProfileData();
  
  // Helper function for getting initials
  const getInitial = (name?: string) => name?.trim()?.charAt(0)?.toUpperCase() || null;
  
  // Get user's name for personalization
  const userName = temporaryDemographics.your?.name || (personalProfileData as any)?.name || '';
  
  // Get user's first initial for icon
  const userInitial = getInitial(userName);
  
  // Memoized completion calculations for better performance
  const yourProfileCompletion = useMemo(() => {
    return calculateYourCompletion();
  }, [calculateYourCompletion]);
  
  const partnerProfileCompletion = useMemo(() => {
    return calculatePartnerCompletion();
  }, [calculatePartnerCompletion]);
  
  // Memoized requirement calculations
  const { completedRequiredFields, totalRequiredFields, canUnlockCoaching } = useMemo(() => {
    const completed = personalProfileData ? getCompletedRequiredFieldsCount(personalProfileData as any) : 0;
    const total = getTotalRequiredFieldsCount();
    return {
      completedRequiredFields: completed,
      totalRequiredFields: total,
      canUnlockCoaching: completed >= total
    };
  }, [personalProfileData]);
  
  // Get partner's first initial for icon
  const partnerInitial = getInitial(partnerProfileData?.partnerName);

  // Navigation hook for coaching
  const { goToCoach } = useNavigation();
  
  // Mobile optimizations
  const { 
    isMobile, 
    isRefreshing, 
    simulateProfileFeedback, 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd 
  } = useProfileMobileOptimizations();
  
  // Handle pull-to-refresh
  const handleRefresh = async () => {
    // Refresh profile data
    if (onProfileUpdate) {
      onProfileUpdate(temporaryProfiles, temporaryDemographics);
    }
  };
  
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
  // Add touch event listeners for pull-to-refresh
  useEffect(() => {
    if (!isMobile) return;
    
    const handleStart = (e: TouchEvent) => handleTouchStart(e);
    const handleMove = (e: TouchEvent) => handleTouchMove(e);
    const handleEnd = (e: TouchEvent) => handleTouchEnd(e, handleRefresh);
    
    document.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchmove', handleMove, { passive: true });
    document.addEventListener('touchend', handleEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd, handleRefresh]);

  return <div className="flex flex-col min-h-dvh" data-profile-container>
      {/* Pull-to-refresh indicator */}
      {isMobile && (
        <div 
          data-refresh-indicator
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm opacity-0 transition-all duration-200 z-50 border border-white/20"
        >
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}
      
      <div className="space-y-6 md:space-y-7 lg:space-y-10 pb-6 md:pb-12 lg:pb-16 pb-safe pt-1 md:pt-2 lg:pt-4"
           style={{ paddingBottom: isMobile ? 'calc(1.5rem + env(safe-area-inset-bottom, 20px))' : undefined }}>
        {/* Main Header - Responsive */}
        <div className="text-center space-y-4 md:space-y-5 lg:space-y-6 flex-shrink-0 px-2 md:px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-brand text-white">Let's Get to Know Your Situationship</h1>
          
          {/* Unlock Coaching Button - Only show when ready */}
          {canUnlockCoaching && (
            <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <Button
                variant="glass"
                onClick={goToCoach}
                className="w-auto h-12 px-6 rounded-full font-semibold text-white transition-all duration-300 glass-cta bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
              >
                <Avatar className="w-8 h-8 ring-2 ring-white/30 animate-pulse">
                  <AvatarImage 
                    src={BRAND.coach.avatarSrc} 
                    alt={BRAND.coach.name}
                    className="object-cover" 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white font-bold text-sm">
                    {BRAND.coach.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex items-center gap-1">
                  Unlock Coaching with {BRAND.coach.name}
                  <MessageSquare className="w-4 h-4" />
                </span>
              </Button>
            </div>
          )}
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Step 1 Nudge - Only show if 4 required questions aren't complete */}
        {!canUnlockCoaching && (
          <div className="px-3 md:px-4 lg:px-6">
            <OnboardingStepNudge 
              completion={Math.round((completedRequiredFields / totalRequiredFields) * 100)}
              onStartProfile={handleStartPersonalProfile}
            />
          </div>
        )}
        {/* Responsive Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-2 md:gap-3 lg:gap-5 max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-1 md:py-3 lg:py-5 -mt-4 md:mt-0" data-profile-cards-container>
          {/* Your Profile Card */}
          <ProfileCard 
            title="Your Profile"
            subheader="The real you → real advice"
            completion={yourProfileCompletion} 
            description="Just 4 required questions" 
            benefits={[
              { icon: <Star className="w-3 h-3 text-orange-300" />, text: "4 Qs, big feels" },
              { icon: <Search className="w-3 h-3 text-orange-300" />, text: "Deep dive if you're down" },
              { icon: <Clock className="w-3 h-3 text-orange-300" />, text: "Done before your latte's cold" }
            ]}
            onStartProfile={handleStartPersonalProfile} 
            buttonText="Keep It Real" 
            iconElement={
              userInitial 
                ? <span className="text-white font-bold text-base leading-none">{userInitial}</span>
                : <Heart className="w-5 h-5 text-white" />
            }
            progressColor="text-orange-300" 
            benefitColor="text-orange-300"
            motivationText="The realer you, the smarter Kai"
          />

          {/* Partner Profile Card */}
        <ProfileCard 
          title="Your Person" 
          subheader="See your story from both POVs"
            completion={partnerProfileCompletion} 
            description="" 
            benefits={[
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Dual POV magic" },
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Convo hacks unlocked" },
              { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Tips for both hearts" }
            ]} 
            onStartProfile={handleStartPartnerProfile} 
            buttonText="Add Player 2" 
            iconElement={
              partnerInitial 
                ? <span className="text-white font-bold text-base leading-none">{partnerInitial}</span>
                : <Heart className="w-5 h-5 text-white" />
            }
            progressColor="text-pink-300" 
            benefitColor="text-pink-300"
            optionalPillImage={<span className="bg-white/20 text-white/80 px-2 py-0.5 rounded-full text-xs font-medium">Optional</span>}
            motivationText="Bring your +1 for hotter takes"
          />
        </div>


        {/* Privacy Banner - Clean Collapsible */}
        <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 -mt-4 md:-mt-6 lg:-mt-8">
          <div className="rounded-xl ring-1 ring-white/20 bg-gradient-to-r from-white/8 via-white/5 to-white/8 backdrop-blur-sm shadow-lg shadow-white/5">
            <Collapsible>
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm text-white/90 hover:bg-white/5 transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/10 p-1.5 rounded-full ring-1 ring-white/25">
                      <Lock className="w-3.5 h-3.5 text-white/80" />
                    </div>
                  </div>
                  <span className="font-medium text-white">Private by design</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-3 pt-1">
                <div className="pl-10 space-y-1 text-sm text-white/80">
                  <p>• Only you and Kai see your profiles</p>
                  <p>• Everything is encrypted and secure</p>  
                  <p>• You control your data completely</p>
                  <Link 
                    to="/privacy-security" 
                    className="inline-flex items-center gap-1.5 mt-4 text-xs text-coral-400 hover:text-coral-300 transition-colors group"
                    aria-label="Learn more about our privacy and security practices"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>
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