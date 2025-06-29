
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";

interface ProfileCompletionOptionsProps {
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
}

const ProfileCompletionOptions = ({ 
  onAddPartnerProfile, 
  onStartChatting, 
  onClose 
}: ProfileCompletionOptionsProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Complete! 🎉
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Great! You've completed your personal profile. What would you like to do next?
          </p>
        </div>

        <div className="space-y-4">
          {/* Add Partner Profile Option */}
          <Button
            onClick={onAddPartnerProfile}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Add My Partner's Profile</div>
                <div className="text-sm opacity-90">Get more comprehensive relationship insights</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>

          {/* Start Chatting Option */}
          <Button
            onClick={onStartChatting}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Start Talking to Kai Now</div>
                <div className="text-sm opacity-90">Begin your relationship coaching journey</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        {/* Skip for now option */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            I'll decide later
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCompletionOptions;
