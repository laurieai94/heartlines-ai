
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Check, X } from "lucide-react";

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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Clean Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Complete
              </h2>
              <p className="text-gray-500 text-sm">
                {isPersonalCompletion ? "Nice work! What's next?" : "Great! You're all set."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isPersonalCompletion ? (
            <>
              {!hasPartnerProfile && (
                <Button
                  onClick={onAddPartnerProfile}
                  className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-medium"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add Partner Profile
                </Button>
              )}
              
              <Button
                onClick={onStartChatting}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Coaching with Kai
              </Button>
            </>
          ) : (
            <Button
              onClick={onStartChatting}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Coaching with Kai
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
