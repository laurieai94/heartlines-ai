
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";

interface ProfileCompletionOptionsProps {
  completionType: 'personal' | 'partner';
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  hasPartnerProfile: boolean;
}

const ProfileCompletionOptions = ({ 
  completionType, 
  onAddPartnerProfile, 
  onStartChatting, 
  onClose,
  hasPartnerProfile 
}: ProfileCompletionOptionsProps) => {
  const isPersonalCompletion = completionType === 'personal';

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Glassmorphism Container - No overlay background */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header with Glassmorphism */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 border-b border-white/15 p-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  🎉 Profile Complete!
                </h2>
                <p className="text-white/80 text-sm">
                  What's next?
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isPersonalCompletion ? (
            <>
              <div className="text-center space-y-2 mb-6">
                <p className="text-white/90 text-base leading-relaxed">
                  Great work! Ready to unlock deeper insights?
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Add Partner Profile */}
                {!hasPartnerProfile && (
                  <div 
                    onClick={onAddPartnerProfile}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-pink-400/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-500/80 to-pink-600/80 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-pink-500/25">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm mb-1">
                          Add Partner Profile
                        </h3>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Get personalized insights for both of you
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 2: Start Coaching */}
                <div 
                  onClick={onStartChatting}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-emerald-400/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-emerald-500/25">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        Start Coaching with Kai
                      </h3>
                      <p className="text-white/70 text-xs leading-relaxed">
                        Jump into personalized relationship guidance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-white/50 text-xs">
                  💡 You can always add more details later
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-xl font-bold text-white">
                  Partner Profile Added!
                </h3>
                <p className="text-white/80 text-base leading-relaxed">
                  Now Kai can provide even more personalized guidance.
                </p>
              </div>

              <div 
                onClick={onStartChatting}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-emerald-400/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-emerald-500/25">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1">
                      Ready to Start Coaching
                    </h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Get comprehensive relationship guidance for both of you
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
