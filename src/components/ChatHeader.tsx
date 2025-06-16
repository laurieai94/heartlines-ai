
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Circle, User } from "lucide-react";

interface ChatHeaderProps {
  userName?: string;
  partnerName?: string;
  userAvatarUrl?: string;
  hasProfiles: boolean;
}

const ChatHeader = ({ userName, partnerName, userAvatarUrl, hasProfiles }: ChatHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-4">
        {/* AI Coach Avatar */}
        <div className="relative">
          <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 border-4 border-white shadow-lg">
            <AvatarFallback className="text-white border-0 text-lg">
              <Bot className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white flex items-center justify-center">
            <Circle className="w-2 h-2 fill-current animate-pulse" />
          </div>
        </div>

        {/* Coach Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {userName ? `${userName}'s Relationship Coach` : 'Your Relationship Coach'}
          </h2>
          <p className="text-gray-600 font-medium mb-2">
            Always here to help • Powered by Kai, your AI coach
          </p>
          
          {/* Profile Status */}
          {hasProfiles ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">
                Personalized for {userName} & {partnerName}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-700 font-medium">
                Complete profiles for personalized advice
              </span>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {userName && (
          <div className="relative">
            <Avatar className="w-12 h-12 border-3 border-white shadow-lg">
              <AvatarImage src={userAvatarUrl || undefined} alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-coral-500 text-white">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
