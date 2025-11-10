import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Heart, Star, Search, Lock, MessageSquare, ChevronDown, ArrowRight, Sparkles, Shield, Database, Eye, Trash2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BRAND } from "@/branding";
// Direct imports for instant loading - no lazy loading
import ProfileForm from "@/components/ProfileForm";
import Demographics from "@/components/Demographics";
import MemoizedProfileCard from "@/components/ProfileBuilder/MemoizedProfileCard";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useOptimizedProfileCompletion } from '@/hooks/useOptimizedProfileCompletion';
import { usePersonalProfileData } from '@/hooks/usePersonalProfileData';
import { usePartnerProfileData } from '@/hooks/usePartnerProfileData';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import OnboardingStepNudge from "@/components/OnboardingStepNudge";
import { getCompletedRequiredFieldsCount, getTotalRequiredFieldsCount } from '@/components/NewPersonalQuestionnaire/utils/requirements';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';
import ProfileTips from "@/components/ProfileBuilder/ProfileTips";
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
  
  // Profile update counter for real-time button state updates
  const [profileUpdateCounter, setProfileUpdateCounter] = useState(0);

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
  } = useOptimizedProfileCompletion();

  // Get actual personal profile data for accurate progress calculation
  const {
    profileData: personalProfileData
  } = usePersonalProfileData();
  const {
    profileData: partnerProfileData
  } = usePartnerProfileData();

  // Helper function for getting initials
  const getInitial = (name?: string) => name?.trim()?.charAt(0)?.toLowerCase() || null;

  // Get user's name for personalization - prioritize V2 profile data (always up-to-date)
  const userName = (personalProfileData as any)?.name || temporaryDemographics.your?.name || '';

  // Get user's first initial for icon
  const userInitial = getInitial(userName);
  
  // Get partner's name for personalization - prioritize V2 profile data
  const partnerName = (partnerProfileData as any)?.partnerName || temporaryDemographics.partner?.name || '';

  // Memoized completion calculations for better performance
  const yourProfileCompletion = useMemo(() => calculateYourCompletion(), [calculateYourCompletion]);
  const partnerProfileCompletion = useMemo(() => calculatePartnerCompletion(), [calculatePartnerCompletion]);

  // Memoized requirement calculations
  const {
    completedRequiredFields,
    totalRequiredFields,
    canUnlockCoaching
  } = useMemo(() => {
    const completed = personalProfileData ? getCompletedRequiredFieldsCount(personalProfileData as any) : 0;
    const total = getTotalRequiredFieldsCount();
    console.log('[ProfileBuilder] Completion check:', { 
      completed, 
      total, 
      canUnlock: completed >= total,
      fields: {
        name: !!personalProfileData?.name,
        pronouns: !!personalProfileData?.pronouns,
        relationshipStatus: !!personalProfileData?.relationshipStatus,
        loveLanguage: !!personalProfileData?.loveLanguage,
        attachmentStyle: !!personalProfileData?.attachmentStyle
      }
    });
    return {
      completedRequiredFields: completed,
      totalRequiredFields: total,
      canUnlockCoaching: completed >= total
    };
  }, [
    personalProfileData?.name,
    personalProfileData?.pronouns,
    personalProfileData?.relationshipStatus,
    personalProfileData?.loveLanguage,
    personalProfileData?.attachmentStyle,
    personalProfileData,
    profileUpdateCounter  // Force recalculation on any profile update
  ]);

  // Listen for required field updates to force immediate UI update
  useEffect(() => {
    const handleRequiredFieldUpdate = () => {
      console.log('[ProfileBuilder] Required field updated - forcing recalculation');
      setProfileUpdateCounter(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleRequiredFieldUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleRequiredFieldUpdate);
    };
  }, []);

  // Get partner's first initial for icon
  const partnerInitial = getInitial(partnerName);

  // Navigation hook for coaching
  const {
    goToCoach
  } = useNavigation();

  // Mobile optimizations removed for better performance

  // Memoized handlers to prevent unnecessary re-renders
  const handleRefresh = useCallback(async () => {
    // Refresh profile data
    if (onProfileUpdate) {
      onProfileUpdate(temporaryProfiles, temporaryDemographics);
    }
  }, [onProfileUpdate, temporaryProfiles, temporaryDemographics]);
  const handleStartPersonalProfile = useCallback(() => {
    // Call the callback to open the questionnaire modal in Dashboard
    if (onOpenQuestionnaire) {
      onOpenQuestionnaire();
    }
  }, [onOpenQuestionnaire]);
  const handleStartPartnerProfile = useCallback(() => {
    // Call the callback to open the partner questionnaire modal in Dashboard
    if (onOpenPartnerQuestionnaire) {
      onOpenPartnerQuestionnaire();
    }
  }, [onOpenPartnerQuestionnaire]);
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
  // Use consolidated mobile optimization hook
  const {
    isMobile: isMobileDevice
  } = useOptimizedMobile();

  // Add touch event listeners for pull-to-refresh - DISABLED for performance
  useEffect(() => {
    // No mobile optimizations - they were causing freezing
    return () => {};
  }, []);
  return <div className="flex flex-col min-h-dvh" data-profile-container>
      {/* Mobile optimization disabled for performance */}
      {/* Pull-to-refresh indicator removed - was causing freezing */}
      
      <div className="space-y-6 md:space-y-7 lg:space-y-10 pb-6 md:pb-12 lg:pb-16 pb-safe pt-6 md:pt-8 lg:pt-12" style={{
      paddingBottom: isMobileDevice ? 'calc(1.5rem + env(safe-area-inset-bottom, 20px))' : undefined
    }}>
        {/* Main Header - Responsive */}
        <div className="text-center space-y-8 md:space-y-10 lg:space-y-12 flex-shrink-0 px-2 md:px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-brand bg-gradient-to-r from-orange-300 via-peach-300 to-pink-300 bg-clip-text text-transparent tracking-wide [text-shadow:0_2px_20px_rgba(251,146,120,0.4)]">let's get to know your situationship</h1>
          
          {/* Unlock Coaching Button - Only show when ready */}
          {canUnlockCoaching && <div className="my-10 md:mt-16 md:mb-8 lg:mt-24 lg:mb-10 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <Button variant="glass" onClick={goToCoach} className="w-auto h-12 px-6 rounded-full font-semibold text-white transition-all duration-300 glass-cta bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 shadow-[0_0_30px_rgba(251,146,120,0.5)] hover:shadow-xl hover:scale-105 border border-white/20">
                <Avatar className="w-8 h-8 ring-2 ring-white/30 animate-pulse">
                  <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white font-bold text-sm">
                    {BRAND.coach.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex items-center gap-1">
                  unlock coaching with {BRAND.coach.name}
                  <MessageSquare className="w-4 h-4" />
                </span>
              </Button>
            </div>}
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Step 1 Nudge - Only show if 5 required questions aren't complete */}
        {!canUnlockCoaching && <div className="px-3 md:px-4 lg:px-6">
            <OnboardingStepNudge completion={Math.round(completedRequiredFields / totalRequiredFields * 100)} onStartProfile={handleStartPersonalProfile} />
          </div>}
        {/* Responsive Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-3 lg:gap-4 max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-3 lg:py-4 -mt-4 md:mt-4 lg:mt-6 [&>*]:transition-all [&>*]:duration-300 [&>*]:hover:scale-[1.02]" data-profile-cards-container>
          {/* Your Profile Card */}
          <MemoizedProfileCard title="your profile" subheader="the real you → real advice" completion={yourProfileCompletion} description="just 5 required questions" benefits={[{
            icon: <Star className="w-3 h-3 text-orange-300" />,
            text: "5 qs, big feels"
          }, {
            icon: <Search className="w-3 h-3 text-orange-300" />,
            text: "deep dive if you're down"
          }]} onStartProfile={handleStartPersonalProfile} buttonText="keep it real" iconElement={userInitial ? <span className="text-white font-bold text-2xl sm:text-3xl leading-none">{userInitial}</span> : <Heart className="w-5 h-5 text-white" />} progressColor="text-orange-300" benefitColor="text-orange-300" optionalPillImage={!canUnlockCoaching ? <span className="bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  first step: 5 qs
                </span> : undefined} motivationText="the realer you, the smarter kai" />

          {/* Partner Profile Card */}
        <MemoizedProfileCard title="your person" subheader="see your story from both povs" completion={partnerProfileCompletion} description="" benefits={[{
            icon: <Star className="w-3 h-3 text-pink-300" />,
            text: "dual pov magic"
          }, {
            icon: <Star className="w-3 h-3 text-pink-300" />,
            text: "hacks unlocked"
          }]} onStartProfile={handleStartPartnerProfile} buttonText="add player 2" iconElement={partnerInitial ? <span className="text-white font-bold text-2xl sm:text-3xl leading-none">{partnerInitial}</span> : <Heart className="w-5 h-5 text-white" />} progressColor="text-pink-300" benefitColor="text-pink-300" optionalPillImage={<span className="bg-white/20 text-white/80 px-2 py-0.5 rounded-full text-xs font-medium">optional</span>} motivationText="bring your +1 for hotter takes" />
        </div>


        {/* Privacy Banner - Clean Collapsible */}
        <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-1 md:py-3 lg:py-4 -mt-8 md:-mt-6 lg:-mt-8">
          <div className="rounded-xl ring-1 ring-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/8 hover:ring-white/15">
            <Collapsible>
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm text-white/90 transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/10 p-1.5 rounded-full ring-1 ring-white/25">
                      <Lock className="w-3.5 h-3.5 text-white/80" />
                    </div>
                  </div>
                  <span className="font-medium text-white">private by design</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-3 pt-1">
                <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80">
                  <p className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-white/60" />no ai training on chats</p>
                  <p className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-white/60" />your data = yours only</p>
                  <p className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-white/60" />encrypted at rest + transit</p>
                  <p className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-white/60" />row-level security on all data</p>
                  <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-white/60" />choose history: 30 / 90 / 365 / forever</p>
                  <p className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5 text-white/60" />delete everything anytime, no hassle</p>
                  <Link to="/privacy-and-security" className="inline-flex items-center gap-1.5 mt-4 text-xs text-coral-400 hover:text-coral-300 transition-colors group" aria-label="Learn more about our privacy and security practices">
                    <span>learn more</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Tips Section - Instant render */}
        <ProfileTips />
      </div>

      {/* Modals - Instant render without Suspense */}
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

      </div>
    </div>;
};
export default ProfileBuilder;