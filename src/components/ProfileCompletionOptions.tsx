
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Check, X, User } from "lucide-react";

interface ProfileCompletionOptionsProps {
  completionType: 'personal' | 'partner';
  onAddPartnerProfile: () => void;
  onStartChatting: () => void;
  onClose: () => void;
  hasPartnerProfile: boolean;
  onUpdatePersonalProfile?: () => void;
}

const ProfileCompletionOptions = ({ 
  completionType, 
  onAddPartnerProfile, 
  onStartChatting, 
  onClose,
  hasPartnerProfile,
  onUpdatePersonalProfile 
}: ProfileCompletionOptionsProps) => {
  const isPersonalCompletion = completionType === 'personal';

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-md w-full">
        {/* Premium Header */}
        <div className="p-6 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold questionnaire-text">
                Profile Complete!
              </h2>
              <p className="questionnaire-text-muted text-sm">
                {isPersonalCompletion ? "Great work! What's next?" : "Awesome! You're all set."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isPersonalCompletion ? (
            <>
              <button
                onClick={onStartChatting}
                className="w-full h-12 questionnaire-button-primary rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start Relationship Coaching with Kai
              </button>
              
              <button
                onClick={onAddPartnerProfile}
                className="w-full h-12 bg-gradient-to-r from-rose-500/80 to-pink-500/80 hover:from-rose-600/80 hover:to-pink-600/80 text-white font-medium rounded-xl transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <Heart className="w-4 h-4" />
                Add Your Partner Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onStartChatting}
                className="w-full h-12 questionnaire-button-primary rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start Relationship Coaching with Kai
              </button>
              
              <button
                onClick={onUpdatePersonalProfile}
                className="w-full h-12 bg-gradient-to-r from-purple-500/80 to-violet-500/80 hover:from-purple-600/80 hover:to-violet-600/80 text-white font-medium rounded-xl transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <User className="w-4 h-4" />
                Update Personal Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionOptions;
