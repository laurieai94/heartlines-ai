import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
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
    console.log('ProfileCompletionOptions rendered:', {
      completionType,
      hasPartnerProfile
    });
  }, [completionType, hasPartnerProfile]);
  return <div className="fixed inset-0 flex items-center justify-center p-4 z-[60] questionnaire-bg">
      {/* Animated orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-coral-400/20 to-peach-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-peach-400/15 to-coral-400/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-coral-300/10 to-peach-300/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="questionnaire-card p-8 max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
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
                Start Coaching with Kai
              </Button>
              
              {!hasPartnerProfile && (
                <Button onClick={onAddPartnerProfile} className="w-full questionnaire-button-secondary">
                  Add your person's details
                </Button>
              )}

              <div className="text-center mt-4">
                <button onClick={onEditProfile} className="text-white/70 hover:text-white text-sm underline underline-offset-2">
                  Make updates to my profile
                </button>
              </div>
            </> : <>
              <Button onClick={onStartChatting} className="w-full questionnaire-button-primary">
                Start Coaching with Kai
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
    </div>;
};
export default ProfileCompletionOptions;