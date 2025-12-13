import { useState } from 'react';
import { usePartnerProfiles, PartnerProfile } from '@/hooks/usePartnerProfiles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Users, Plus, Trash2, Check, Crown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerProfileManagerProps {
  onEditProfile: (partnerProfileId: string) => void;
  onUpgrade: () => void;
}

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
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 bg-white/5 border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">partner profiles</h3>
              <p className="text-sm text-white/60">
                {limits.current} of {limits.limit === 9999 ? '∞' : limits.limit} profiles used
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleCreateProfile}
            disabled={isCreating}
            variant="outline"
            size="sm"
            className={cn(
              "border-white/20 text-white hover:bg-white/10",
              !limits.canAdd && "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            )}
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : !limits.canAdd ? (
              <Crown className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {!limits.canAdd ? 'upgrade for more' : 'add partner'}
          </Button>
        </div>

        {/* Profiles List */}
        <div className="space-y-3">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>no partner profiles yet</p>
              <p className="text-sm mt-1">add a partner to get personalized coaching</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.partner_profile_id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  activeProfileId === profile.partner_profile_id
                    ? "bg-white/10 border-white/30"
                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
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
                    <p className="text-xs text-white/50">
                      {profile.profile_data?.partnerAttachmentStyle 
                        ? `${profile.profile_data.partnerAttachmentStyle} attachment`
                        : 'tap to complete profile'}
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
            ))
          )}
        </div>

        {/* Limit indicator */}
        {!limits.canAdd && limits.limit !== 9999 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400 text-center">
              upgrade to {limits.tierName === 'begin' ? 'glow' : limits.tierName === 'glow' ? 'vibe' : 'unlimited'} for more partner profiles
            </p>
          </div>
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
