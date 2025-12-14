import { useState } from 'react';
import { usePartnerProfiles, PartnerProfile } from '@/hooks/usePartnerProfiles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, Plus, Trash2, Check, Crown, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import CardAvatar from '@/components/ProfileBuilder/CardAvatar';

interface PartnerProfileManagerProps {
  onEditProfile: (partnerProfileId: string) => void;
  onUpgrade: () => void;
}

const getProfileDescription = (profileData: Record<string, any> | null): string => {
  if (!profileData) return 'tap to complete profile';
  
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
  
  if (parts.length === 0) return 'tap to complete profile';
  
  return parts.join(' • ');
};

const PartnerProfileManager = ({ onEditProfile, onUpgrade }: PartnerProfileManagerProps) => {
  const {
    profiles,
    activeProfileId,
    isLoading,
    limits,
    createProfile,
    deleteProfile,
    switchProfile
  } = usePartnerProfiles();

  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PartnerProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    await deleteProfile(deleteTarget.partner_profile_id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleProfileClick = (profile: PartnerProfile) => {
    switchProfile(profile.partner_profile_id);
    onEditProfile(profile.partner_profile_id);
  };

  if (isLoading) {
    return (
      <Card className="questionnaire-card p-4 md:p-5 lg:p-6 min-h-[240px] md:min-h-[260px] lg:min-h-[280px]">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="group questionnaire-card p-4 md:p-5 lg:p-6 min-h-[240px] md:min-h-[260px] lg:min-h-[280px] hover:scale-[1.02] transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CardAvatar size="sm">
              <Users className="w-4 h-4 text-white" />
            </CardAvatar>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">partner profiles</h3>
              <p className="text-xs md:text-sm lg:text-base text-white/70 font-medium mt-1 md:mt-2 leading-tight">
                help kai understand them
              </p>
            </div>
          </div>
          
          <div className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
            {limits.current}/{limits.limit === 9999 ? '∞' : limits.limit}
          </div>
        </div>

        {/* Profiles List */}
        {profiles.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>no partner profiles yet</p>
            <p className="text-sm mt-1">add a partner to get personalized coaching</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[200px] pr-2">
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.partner_profile_id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01]",
                    activeProfileId === profile.partner_profile_id
                      ? "bg-white/15 border-white/30 ring-1 ring-white/20 shadow-inner"
                      : "bg-white/10 border-white/20 ring-1 ring-white/10 shadow-inner hover:bg-white/15 hover:border-white/25"
                  )}
                  onClick={() => handleProfileClick(profile)}
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

                  {profiles.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(profile);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Add Partner CTA - only show when user can add */}
        {limits.canAdd && (
          <Button
            onClick={handleCreateProfile}
            disabled={isCreating}
            className="w-full mt-6 relative overflow-hidden bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-2 md:py-2.5 lg:py-3 rounded-xl font-semibold text-sm md:text-base lg:text-lg shadow-lg glass-cta-gradient min-h-[44px] md:min-h-[48px] lg:min-h-[52px]"
          >
            {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            add partner
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Subtle upgrade CTA - only when at subscription limit */}
        {!limits.canAdd && (
          <Button
            onClick={onUpgrade}
            variant="ghost"
            className="w-full mt-6 text-white/50 hover:text-white/70 hover:bg-white/5 text-sm font-medium"
          >
            <Crown className="w-4 h-4 mr-2 text-amber-400/60" />
            upgrade for more
          </Button>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-background border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">delete partner profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              this will permanently delete {deleteTarget?.partner_profile_name}'s profile and all associated data. this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isDeleting}
            >
              cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500/80 hover:bg-red-500 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PartnerProfileManager;
