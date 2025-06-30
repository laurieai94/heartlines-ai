
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, User, ArrowRight, Sparkles, X } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b bg-gradient-to-br from-[#8B2635] via-[#A0334A] to-[#B8405F] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  🎉 Profile Complete!
                </h2>
                <p className="text-pink-200 mt-1">
                  You're ready to start your RealTalk journey
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-pink-200 hover:text-white hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isPersonalCompletion ? (
            <>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Nice work! You've covered the essentials.
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Want to unlock even deeper insights? Adding more context helps 
                  our relationship coach give you more personalized guidance.
                </p>
              </div>

              <div className="grid gap-4">
                {/* Option 1: Add Partner Profile */}
                {!hasPartnerProfile && (
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-rose-100 hover:border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Add Partner Profile
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Share what you know about your partner's communication style for even better insights
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-rose-500" />
                    </div>
                  </Card>
                )}

                {/* Option 2: Start Coaching */}
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-green-100 hover:border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Start Coaching with Kai
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Jump right into personalized relationship coaching based on your profile
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-500" />
                  </div>
                </Card>
              </div>

              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                💡 You can always add more details later in your profile
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-4">
                {!hasPartnerProfile && (
                  <Button
                    onClick={onAddPartnerProfile}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    Yes, let's add partner details
                    <Heart className="w-5 h-5 ml-2" />
                  </Button>
                )}
                
                <Button
                  onClick={onStartChatting}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  I'm ready to start coaching
                  <MessageCircle className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Partner Profile Added!
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Great! Now Kai can provide even more personalized guidance that considers both perspectives.
                </p>
              </div>

              <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Ready to Start Coaching
                    </h4>
                    <p className="text-gray-600 text-sm">
                      With both profiles complete, you'll get the most comprehensive relationship guidance
                    </p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={onStartChatting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Start Coaching with Kai
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
