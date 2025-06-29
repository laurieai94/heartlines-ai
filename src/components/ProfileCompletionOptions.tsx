
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, User, MessageCircle, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

interface ProfileCompletionOptionsProps {
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  hasPartnerProfile?: boolean;
  completionType: 'personal' | 'partner';
}

const ProfileCompletionOptions = ({ 
  onAddPartnerProfile, 
  onStartChatting, 
  onClose,
  hasPartnerProfile = false,
  completionType
}: ProfileCompletionOptionsProps) => {
  
  const isPersonalCompletion = completionType === 'personal';
  const isPartnerCompletion = completionType === 'partner';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>
        
        <div className="relative text-center space-y-6">
          {/* Success icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title and description based on completion type */}
          {isPersonalCompletion && (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Great! You've completed your profile.
                </h2>
                <p className="text-lg text-gray-600">
                  What would you like to do next?
                </p>
              </div>

              {/* Options for personal profile completion */}
              <div className="grid gap-4 mt-8">
                {/* Option 1: Add Partner Profile */}
                <Card className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200/50 hover:border-rose-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                      onClick={onAddPartnerProfile}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Add My Partner's Profile
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Get deeper insights by adding your partner's perspective and communication style
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Card>

                {/* Option 2: Start Chatting */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200/50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                      onClick={onStartChatting}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Start Talking to Kai Now
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Begin your personalized coaching session with AI relationship expert Kai
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Card>
              </div>
            </>
          )}

          {isPartnerCompletion && (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Excellent! You've completed both profiles.
                </h2>
                <p className="text-lg text-gray-600">
                  Ready to start talking to your relationship coach Kai?
                </p>
              </div>

              {/* Single option for partner profile completion */}
              <div className="mt-8">
                <Button 
                  onClick={onStartChatting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
                >
                  <MessageCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Start Talking to Kai
                  <Sparkles className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </div>
            </>
          )}

          {/* Skip/Later option */}
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              I'll decide later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCompletionOptions;
