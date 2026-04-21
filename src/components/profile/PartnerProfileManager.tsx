import { useState } from 'react';
import { usePartnerProfiles, PartnerProfile } from '@/hooks/usePartnerProfiles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Plus, Check, Crown, Loader2, Pencil, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CardAvatar from '@/components/profile-builder/CardAvatar';

interface PartnerProfileManagerProps {
  onEditProfile: (partnerProfileId: string) => void;
  onUpgrade: () => void;
}

const getProfileDescription = (profileData: Record<string, any> | null): string => {
  if (!profileData) return 'tap ✏️ to complete';
  
  const parts: string[] = [];
  
  // Attachment style - just the key word
  if (profileData.partnerAttachmentStyle) {
    const attachmentKey = profileData.partnerAttachmentStyle.split(' - ')[0];
    parts.push(attachmentKey);
  }
  
  // Love language - first one, shortened
  if (profileData.partnerLoveLanguage?.length > 0) {
    const firstLove = profileData.partnerLoveLanguage[0];
    const shortLove = firstLove.split(' - ')[0] || firstLove.substring(0, 25);
    parts.push(shortLove);
  }
  
  // Conflict style - just the key phrase
  if (profileData.partnerConflictStyle?.length > 0) {
    const firstConflict = profileData.partnerConflictStyle[0];
    const shortConflict = firstConflict.split(' — ')[0];
    parts.push(shortConflict);
  }
  
  if (parts.length === 0) return 'tap ✏️ to complete';
  
  return parts.join(' • ');
};

const PartnerProfileManager = ({ onEditProfile, onUpgrade }: PartnerProfileManagerProps) => {
  const {
    profiles,
    activeProfileId,
    isLoading,
    limits,
    createProfile,
    switchProfile
  } = usePartnerProfiles();

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProfile = async () => {
    if (!limits.canAdd) {
      onUpgrade();
      return;
    }
    
    setIsCreating(true);
    const newProfileId = await createProfile();
    setIsCreating(false);
    
    if (newProfileId) {
      onEditProfile(newProfileId);
    }
  };

  // Just select the profile for Kai conversations
  const handleSelectProfile = (profile: PartnerProfile) => {
    switchProfile(profile.partner_profile_id);
  };

  // Open the profile editor (separate action)
  const handleEditProfile = (e: React.MouseEvent, profile: PartnerProfile) => {
    e.stopPropagation();
    onEditProfile(profile.partner_profile_id);
  };

  if (isLoading) {
    return (
      <Card className="group questionnaire-card p-4 md:p-5 lg:p-6 pb-2 md:pb-3 lg:pb-3 h-full flex flex-col">
        {/* Header - always show immediately */}
        <div className="flex items-start justify-between mb-3 lg:mb-3">
          <div className="flex items-start gap-3 md:gap-4">
            <CardAvatar>
              <Users className="w-5 h-5 text-white" />
            </CardAvatar>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">partner profiles</h3>
              <p className="text-xs md:text-sm lg:text-base text-white/70 font-medium mt-1 md:mt-2 lg:mt-2 leading-tight">
                help kai understand them
              </p>
            </div>
          </div>
          <div className="w-10 h-6 bg-white/10 rounded-full animate-pulse" />
        </div>
        
        {/* Skeleton profile cards */}
        <div className="flex-1 space-y-2 lg:space-y-2">
          <div className="p-3 lg:p-4 rounded-xl border border-white/20 bg-white/10 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-white/20 rounded" />
                  <div className="w-32 h-3 bg-white/10 rounded" />
                </div>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group questionnaire-card p-4 md:p-5 lg:p-6 pb-2 md:pb-3 lg:pb-3 hover:scale-[1.02] transition-transform duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 lg:mb-3">
          <div className="flex items-start gap-3 md:gap-4">
          <CardAvatar>
            <Users className="w-5 h-5 text-white" />
          </CardAvatar>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">partner profiles</h3>
        <p className="text-xs md:text-sm lg:text-base text-white/70 font-medium mt-1 md:mt-2 lg:mt-2 leading-tight">
          help kai understand them
        </p>
          </div>
        </div>
        
        <div className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
          {limits.current}/{limits.limit === 9999 ? '∞' : limits.limit}
        </div>
      </div>

      {/* Profiles List */}
      <div className="flex flex-col flex-1">
        {profiles.length === 0 ? (
          <div className="h-[100px] lg:h-[120px] flex flex-col items-center justify-center text-white/60">
            <Users className="w-12 h-12 mb-3 opacity-40" />
            <p>no partner profiles yet</p>
            <p className="text-sm mt-1">add a partner to get personalized coaching</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <ScrollArea className="h-[150px] lg:h-[170px] pr-2">
                <div className="space-y-2 lg:space-y-2">
                  {profiles.map((profile) => (
                    <div
                      key={profile.partner_profile_id}
                      className={cn(
                        "flex items-center justify-between p-3 lg:p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01]",
                        activeProfileId === profile.partner_profile_id
                          ? "bg-white/15 border-white/30 ring-1 ring-white/20 shadow-inner"
                          : "bg-white/10 border-white/20 ring-1 ring-white/10 shadow-inner hover:bg-white/15 hover:border-white/25"
                      )}
                      onClick={() => handleSelectProfile(profile)}
                    >
                      <div className="flex items-center gap-3">
                        {activeProfileId === profile.partner_profile_id && (
                          <div className="p-1 rounded-full bg-green-500/20">
                            <Check className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {profile.partner_profile_name}
                          </p>
                          <p className="text-xs text-white/50 line-clamp-1">
                            {getProfileDescription(profile.profile_data)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Edit button - separate from selection */}
                      <button
                        onClick={(e) => handleEditProfile(e, profile)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label={`Edit ${profile.partner_profile_name}'s profile`}
                      >
                        <Pencil className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* Scroll indicator - below cards, only show when 3+ profiles */}
            {profiles.length >= 3 && (
              <div className="flex justify-center mt-1" aria-hidden="true">
                <ChevronDown className="w-4 h-4 text-white/20" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Partner CTA - only show when user can add */}
      {limits.canAdd && (
        <Button
          onClick={handleCreateProfile}
          disabled={isCreating}
          className="w-full mt-0 relative overflow-hidden bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 hover:scale-[1.02] text-white py-2 md:py-2.5 lg:py-3 rounded-xl font-semibold text-sm md:text-base lg:text-lg shadow-lg glass-cta-gradient min-h-[44px] md:min-h-[48px] lg:min-h-[52px] transition-all duration-400 border-0"
        >
          {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          add partner
        </Button>
      )}

      {/* Subtle upgrade CTA - only when at subscription limit */}
      {!limits.canAdd && (
        <Button
          onClick={onUpgrade}
          variant="ghost"
          className="w-full mt-0 py-0.5 text-white/50 hover:text-white/70 hover:bg-white/5 text-xs font-medium"
        >
          <Crown className="w-4 h-4 mr-2 text-amber-400/60" />
          upgrade for more
        </Button>
      )}
    </Card>
  );
};

export default PartnerProfileManager;
