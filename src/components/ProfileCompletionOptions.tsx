import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { logInfo } from '@/utils/productionLogger';
interface ProfileCompletionOptionsProps {
  completionType: 'personal' | 'partner';
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  onEditProfile: () => void;
  hasPartnerProfile: boolean;
}
const ProfileCompletionOptions = ({
  completionType,
  onAddPartnerProfile,
  onStartChatting,
  onClose,
  onEditProfile,
  hasPartnerProfile
}: ProfileCompletionOptionsProps) => {
  const isPersonalCompletion = completionType === 'personal';

  // Debug logging
  useEffect(() => {
    logInfo('ProfileCompletionOptions rendered', {
      completionType,
      hasPartnerProfile
    });
  }, [completionType, hasPartnerProfile]);
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[60] bg-[hsl(var(--questionnaire-bg))]/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-completion-title"
    >
      {/* Modal backdrop */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative glass-burgundy border-burgundy-500/20 rounded-2xl p-8 max-w-md w-full animate-fade-in shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-burgundy-400/10 rounded-full p-2 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            id="profile-completion-title"
            className="text-3xl font-bold text-white mb-2"
          >
            {isPersonalCompletion ? "Profile Complete!" : "Partner Profile Complete!"}
          </h1>
          <p className="text-white/70">
            {isPersonalCompletion ? "You're set—choose your next step." : "You're ready to start coaching."}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isPersonalCompletion ? <>
              <Button onClick={onStartChatting} className="w-full questionnaire-button-primary">
                start coaching with kai
              </Button>
              
              <Button onClick={onAddPartnerProfile} className="w-full questionnaire-button-secondary">
                Add your person's details
              </Button>

              <div className="text-center mt-4">
                <button onClick={onEditProfile} className="text-white/70 hover:text-white text-sm underline underline-offset-2">
                  Make updates to my profile
                </button>
              </div>
            </> : <>
              <Button onClick={onStartChatting} className="w-full questionnaire-button-primary">
                start coaching with kai
              </Button>
              
              <Button onClick={onAddPartnerProfile} className="w-full questionnaire-button-secondary">
                Continue to update your person's deets
              </Button>

              <div className="text-center mt-4">
                <button onClick={onEditProfile} className="text-white/70 hover:text-white text-sm underline underline-offset-2">
                  Make updates to my profile
                </button>
              </div>
            </>}
        </div>
      </div>
    </div>
  );
};
export default ProfileCompletionOptions;