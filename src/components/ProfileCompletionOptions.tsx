
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect } from "react";

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

  // Debug logging
  useEffect(() => {
    console.log('ProfileCompletionOptions rendered:', { completionType, hasPartnerProfile });
  }, [completionType, hasPartnerProfile]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
      {/* Enhanced Glassmorphism Container - No overlay background but more visible */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        
        {/* Header with Enhanced Glassmorphism */}
        <div className="relative bg-gradient-to-br from-white/15 to-white/10 border-b border-white/25 p-6">
          {/* Decorative gradient circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/30 to-pink-500/30 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/20 to-blue-500/20 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/20">
                <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white drop-shadow-sm">
                  Profile complete! What's your vibe?
                </h2>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-white/70 hover:text-white hover:bg-white/15 rounded-full p-2 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content with Better Contrast */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-white/5 to-white/10">
          {isPersonalCompletion ? (
            <>
              <div className="space-y-4">
                {/* Main Button: Start Coaching */}
                <div 
                  onClick={onStartChatting}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-lg border border-white/30 hover:border-emerald-400/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-emerald-500/30 transition-all duration-300">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">
                        Start Coaching with Kai
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Begin your personalized coaching experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Button: Add Partner Profile */}
                {!hasPartnerProfile && (
                  <div 
                    onClick={onAddPartnerProfile}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-lg border border-white/30 hover:border-pink-400/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-pink-500/30 transition-all duration-300">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">
                          Add your person's details
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          Get even more tailored advice (completely optional)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                <p className="text-white/70 text-xs">
                  Everything's flexible - add details whenever
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-xl font-bold text-white drop-shadow-sm">
                  Partner Profile Added!
                </h3>
                <p className="text-white/90 text-base leading-relaxed font-medium">
                  Now Kai can provide even more personalized guidance.
                </p>
              </div>

              <div 
                onClick={onStartChatting}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/25 hover:border-emerald-400/40 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:shadow-emerald-500/30 transition-all duration-300">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1 drop-shadow-sm">
                      Ready to Start Coaching
                    </h4>
                    <p className="text-white/80 text-xs leading-relaxed">
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
