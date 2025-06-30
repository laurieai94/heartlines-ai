
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, X, Sparkles, ArrowRight } from "lucide-react";

interface ProfileCompletionOptionsProps {
  completionType: 'personal' | 'partner';
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  hasPartnerProfile?: boolean;
}

const ProfileCompletionOptions = ({ 
  completionType, 
  onAddPartnerProfile, 
  onStartChatting, 
  onClose,
  hasPartnerProfile = false 
}: ProfileCompletionOptionsProps) => {
  const isPersonalCompletion = completionType === 'personal';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isPersonalCompletion ? 'Profile Complete!' : 'Partner Profile Complete!'}
                  </h2>
                  <p className="text-gray-600">
                    {isPersonalCompletion 
                      ? 'Great! Now let\'s unlock even more personalized insights' 
                      : 'Excellent! Now you have both perspectives for better coaching'
                    }
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-700">
              {isPersonalCompletion 
                ? 'What would you like to do next?'
                : 'Ready to start getting personalized relationship insights?'
              }
            </p>
          </div>

          <div className="grid gap-4">
            {/* Start Chatting Option */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Start Chatting with Kai</h3>
                  <p className="text-gray-600 text-sm">
                    Get personalized relationship insights and advice based on your profile
                  </p>
                </div>
                <Button 
                  onClick={onStartChatting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Add Partner Profile Option - Only show for personal completion */}
            {isPersonalCompletion && !hasPartnerProfile && (
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Add Partner Profile</h3>
                    <p className="text-gray-600 text-sm">
                      Get even better insights by adding what you know about your partner
                    </p>
                  </div>
                  <Button 
                    onClick={onAddPartnerProfile}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl font-semibold"
                  >
                    Add Partner
                    <User className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">What you've unlocked:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Personalized coaching conversations with Kai
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Custom relationship insights based on your patterns
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Tailored advice for your unique situation
              </li>
              {hasPartnerProfile && (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Dual-perspective insights for both you and your partner
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
