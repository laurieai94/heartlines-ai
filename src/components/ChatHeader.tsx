
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Bot, Circle, User, Heart } from "lucide-react";

interface ChatHeaderProps {
  userName?: string;
  partnerName?: string;
  userAvatarUrl?: string;
  hasProfiles: boolean;
}

const ChatHeader = ({ userName, partnerName, userAvatarUrl, hasProfiles }: ChatHeaderProps) => {
  const getUserInitials = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-4">
        {/* AI Coach Avatar */}
        <div className="relative">
          <Avatar className="w-16 h-16 bg-gradient-to-br from-coral-400 to-pink-500 border-4 border-white shadow-lg">
            <AvatarImage 
              src="/lovable-uploads/242d0015-a32d-4eaf-9252-c22dc3e01345.png" 
              alt="Kai" 
              className="object-cover"
            />
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
          <HoverCard>
            <HoverCardTrigger asChild>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-gray-700 transition-colors">
                Kai - Your Relationship Coach
              </h2>
            </HoverCardTrigger>
            <HoverCardContent 
              side="top" 
              align="start" 
              sideOffset={20} 
              avoidCollisions={true}
              collisionPadding={16}
              className="w-72 bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-coral-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Meet Kai</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your AI relationship coach, trained in PhD-level psychology and real-world clinical care. Grounded in evidence-based and trauma-informed practices, Kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between. LGBTQ+ inclusive and designed for real life, Kai meets you where you are.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
          <p className="text-gray-600 font-medium mb-2">
            PhD Clinical Psychologist • Always here to help
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
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-coral-500 text-white text-lg font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
