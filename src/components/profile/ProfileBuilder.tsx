import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Heart, Star, Search, Lock, MessageSquare, ChevronDown, ArrowRight, Sparkles, Shield, Database, Eye, Trash2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BRAND } from "@/branding";
// Direct imports for instant loading - no lazy loading
import ProfileForm from "@/components/profile-form";
import Demographics from "@/components/demographics";
import MemoizedProfileCard from "@/components/profile-builder/MemoizedProfileCard";
import PartnerProfileManager from "@/components/profile/PartnerProfileManager";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useOptimizedProfileCompletion } from '@/hooks/useOptimizedProfileCompletion';
import { usePersonalProfileData } from '@/hooks/usePersonalProfileData';
import { usePartnerProfileData } from '@/hooks/usePartnerProfileData';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { usePartnerProfiles } from '@/hooks/usePartnerProfiles';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import OnboardingStepNudge from "@/components/profile/OnboardingStepNudge";
import { getCompletedRequiredFieldsCount, getTotalRequiredFieldsCount } from '@/components/new-personal-questionnaire/utils/requirements';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ProfileTips from "@/components/profile-builder/ProfileTips";
import { UnlockCoachingButton } from '@/components/landing/UnlockCoachingButton';
import { batchedStorage } from '@/utils/batchedStorage';
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
  onOpenPartnerQuestionnaire?: (profileId?: string) => void;
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
  const { user } = useAuth();
  
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Partner profiles management
  const { limits: partnerLimits } = usePartnerProfiles();
  const subscription = useOptimizedSubscription();
  
  // Profile update counter for real-time button state updates
  const [profileUpdateCounter, setProfileUpdateCounter] = useState(0);
  
  // Cache required fields for instant updates - initialize with real data
  const [cachedRequiredFields, setCachedRequiredFields] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('personal_profile_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        const profileData = parsed.profile || {};
        return {
          name: profileData.name,
          pronouns: profileData.pronouns,
          relationshipStatus: profileData.relationshipStatus,
          loveLanguage: profileData.loveLanguage,
          attachmentStyle: profileData.attachmentStyle,
          _timestamp: Date.now()
        };
      }
    } catch (e) {
      console.error('[ProfileBuilder] Error initializing cached fields:', e);
    }
    return {};
  });

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
    const completed = cachedRequiredFields._timestamp 
      ? getCompletedRequiredFieldsCount(cachedRequiredFields as any)
      : personalProfileData 
        ? getCompletedRequiredFieldsCount(personalProfileData as any) 
        : 0;
    const total = getTotalRequiredFieldsCount();
    console.log('[ProfileBuilder] Completion check:', { 
      completed, 
      total, 
      canUnlock: completed >= total,
      fields: {
        name: !!(cachedRequiredFields.name || personalProfileData?.name),
        pronouns: !!(cachedRequiredFields.pronouns || personalProfileData?.pronouns),
        relationshipStatus: !!(cachedRequiredFields.relationshipStatus || personalProfileData?.relationshipStatus),
        loveLanguage: !!(cachedRequiredFields.loveLanguage || personalProfileData?.loveLanguage),
        attachmentStyle: !!(cachedRequiredFields.attachmentStyle || personalProfileData?.attachmentStyle)
      }
    });
    return {
      completedRequiredFields: completed,
      totalRequiredFields: total,
      canUnlockCoaching: completed >= total
    };
  }, [
    cachedRequiredFields.name || personalProfileData?.name,
    cachedRequiredFields.pronouns || personalProfileData?.pronouns,
    cachedRequiredFields.relationshipStatus || personalProfileData?.relationshipStatus,
    cachedRequiredFields.loveLanguage || personalProfileData?.loveLanguage,
    cachedRequiredFields.attachmentStyle || personalProfileData?.attachmentStyle,
    cachedRequiredFields._timestamp, // Force recalc when fresh data arrives
    personalProfileData,
    profileUpdateCounter
  ]);

  // Listen for required field updates - read fresh data directly from batchedStorage
  useEffect(() => {
    const handleRequiredFieldUpdate = () => {
      console.log('[ProfileBuilder] Required field updated - reading fresh data from batchedStorage');
      
      if (!user?.id) {
        console.log('[ProfileBuilder] No user ID, skipping update');
        return;
      }
      
      // Read directly from batchedStorage for absolute freshest data
      const userStorageKey = `personal_profile_v2_${user.id}`;
      const stored = batchedStorage.getItem(userStorageKey);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const profileData = parsed.profile || parsed;
          
          const freshRequired = {
            name: profileData.name,
            pronouns: profileData.pronouns,
            relationshipStatus: profileData.relationshipStatus,
            loveLanguage: profileData.loveLanguage,
            attachmentStyle: profileData.attachmentStyle,
            _timestamp: Date.now()
          };
          
          console.log('[ProfileBuilder] Fresh required fields from batchedStorage:', freshRequired);
          setCachedRequiredFields(freshRequired);
        } catch (e) {
          console.error('[ProfileBuilder] Error parsing storage data:', e);
        }
      }
      
      // Increment counter to trigger useMemo recalculation
      setProfileUpdateCounter(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleRequiredFieldUpdate);
    
    // Also update on mount
    handleRequiredFieldUpdate();
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleRequiredFieldUpdate);
    };
  }, [user?.id]); // Depend on user ID only

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
      
      <div className="space-y-4 md:space-y-5 lg:space-y-8 pb-6 md:pb-12 lg:pb-16 pb-safe pt-6 md:pt-10 lg:pt-8" style={{
      paddingBottom: isMobileDevice ? 'calc(1.5rem + env(safe-area-inset-bottom, 20px))' : undefined
    }}>
        {/* Main Header - Responsive */}
        <div className="text-center space-y-6 md:space-y-8 lg:space-y-12 flex-shrink-0 px-2 md:px-4">
          <h1 
            className="text-3xl md:text-5xl lg:text-[3.5rem] font-brand bg-gradient-to-r from-orange-200 via-peach-200 to-pink-200 bg-clip-text text-transparent tracking-wide leading-relaxed"
            style={{
              textShadow: '0 2px 10px rgba(251, 146, 120, 0.7), 0 4px 20px rgba(236, 72, 153, 0.6), 0 8px 40px rgba(251, 146, 120, 0.5)'
            }}
          >
            let's get to know your<br className="md:hidden" /> situationship
          </h1>
          
          {/* Unlock Coaching Button - Only show when ready */}
          {canUnlockCoaching && (
            <div className="my-6 md:mt-10 md:mb-6 lg:mt-14 lg:mb-8 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <UnlockCoachingButton />
            </div>
          )}
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Step 1 Nudge - Only show if 5 required questions aren't complete */}
        {!canUnlockCoaching && <div className="px-3 md:px-4 lg:px-6 my-8 md:my-10 lg:my-12">
            <OnboardingStepNudge completion={Math.round(completedRequiredFields / totalRequiredFields * 100)} onStartProfile={handleStartPersonalProfile} />
          </div>}
        {/* Responsive Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-3 lg:gap-4 max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 mt-0 md:mt-2 lg:mt-4 [&>*]:transition-all [&>*]:duration-300" data-profile-cards-container>
          {/* Your Profile Card */}
          <MemoizedProfileCard title="your profile" subheader="the real you → real advice" completion={yourProfileCompletion} description="just 5 required questions" benefits={[{
            icon: <Star className="w-3 h-3 text-orange-300" />,
            text: "5 quick qs, big feels"
          }, {
            icon: <Search className="w-3 h-3 text-orange-300" />,
            text: "deep dive if it feels right"
          }, {
            icon: <Lock className="w-3 h-3 text-orange-300" />,
            text: "private by design"
          }]} onStartProfile={handleStartPersonalProfile} buttonText="keep it real" iconElement={userInitial ? <span className="text-white font-bold text-2xl sm:text-3xl leading-none">{userInitial}</span> : <Heart className="w-5 h-5 text-white" />} progressColor="text-orange-300" benefitColor="text-orange-300" optionalPillImage={!canUnlockCoaching ? <span className="bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  first step: 5 qs
                </span> : undefined} motivationText="the realer you, the smarter kai" />

          {/* Partner Profiles Manager */}
          <div className="md:col-span-1">
            <PartnerProfileManager 
              onEditProfile={(partnerProfileId) => {
                // Open the partner questionnaire with the specific profile ID
                if (onOpenPartnerQuestionnaire) {
                  onOpenPartnerQuestionnaire(partnerProfileId);
                }
              }}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
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

      {/* Upgrade Modal for Partner Profile Limits */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentTier={subscription.subscription_tier || 'begin'}
        messagesUsed={subscription.messages_used}
        messageLimit={subscription.message_limit}
        reason="partner-profiles"
        partnerProfileCount={partnerLimits.current}
        partnerProfileLimit={partnerLimits.limit}
      />

      </div>
    </div>;
};
export default ProfileBuilder;