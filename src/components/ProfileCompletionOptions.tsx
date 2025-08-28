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

      <div className="questionnaire-card max-w-md w-full p-6 md:p-8 ring-1 ring-white/15 shadow-3xl animate-fade-in relative z-10 overflow-hidden">
        {/* Gradient top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-400 via-pink-400 to-peach-400 opacity-80" />
        
        {/* Header */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-coral-400 to-peach-500 rounded-2xl flex items-center justify-center ring-1 ring-white/20 shadow-lg shadow-coral-200/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="questionnaire-text text-2xl md:text-3xl font-bold leading-tight">
                  {isPersonalCompletion ? "Profile Complete!" : "Partner Profile Complete!"}
                </h2>
                <p className="text-white/70 text-sm md:text-base mt-1">
                  {isPersonalCompletion ? "You're set—choose your next step." : "You're ready to start coaching."}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 focus-visible:ring-2 focus-visible:ring-white/30">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isPersonalCompletion ? <>
              <div className="space-y-4">
                {/* Main Button: Start Coaching */}
                <button onClick={onStartChatting} className="questionnaire-button-primary w-full p-5 rounded-xl shadow-neon hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ring-1 ring-white/15 shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="questionnaire-text font-semibold text-xl mb-2 leading-tight">
                        Start Coaching with Kai
                      </h3>
                      <p className="text-white/80 text-base leading-normal">
                        Begin your personalized coaching experience
                      </p>
                    </div>
                  </div>
                </button>

                {/* Add Partner Profile Button */}
                <button onClick={onAddPartnerProfile} className="w-full p-5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/20 hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center ring-1 ring-white/15 shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="questionnaire-text font-semibold text-xl mb-2 leading-tight">
                        Add your person's details
                      </h3>
                      <p className="text-white/70 text-base leading-normal">
                        Get even more tailored advice (completely optional)
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center pt-2">
                <button onClick={onEditProfile} className="text-white/70 hover:text-white text-xs underline underline-offset-2 hover:no-underline transition-all duration-200">
                  Make updates to my profile
                </button>
              </div>
            </> : <>
              <button onClick={onStartChatting} className="questionnaire-button-primary w-full p-5 rounded-xl shadow-neon hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ring-1 ring-white/15 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="questionnaire-text font-semibold text-lg mb-2 leading-tight">
                      Ready to Start Coaching
                    </h4>
                    <p className="text-white/80 text-sm leading-normal">
                      Get comprehensive relationship guidance for both of you
                    </p>
                  </div>
                </div>
              </button>
            </>}
        </div>
      </div>
    </div>;
};
export default ProfileCompletionOptions;