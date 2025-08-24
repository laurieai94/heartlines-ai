
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot, Circle, User, Heart, Info } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/branding";

interface ChatHeaderProps {
  userName?: string;
  partnerName?: string;
  userAvatarUrl?: string;
  hasProfiles: boolean;
}

const ChatHeader = ({ userName, partnerName, userAvatarUrl, hasProfiles }: ChatHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
              src={BRAND.coach.avatarSrc} 
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
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Kai - Your Relationship Coach
            </h2>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                  aria-label="Learn more about Kai"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                side="bottom" 
                align="start" 
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
                className="w-72 p-3 bg-slate-900/95 backdrop-blur-lg border border-slate-700 shadow-2xl z-50"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">Meet Kai</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Your AI relationship coach, trained in PhD-level psychology and real-world clinical care.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Grounded in evidence-based and trauma-informed practices, Kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-coral-300 font-medium">LGBTQ+ inclusive</span> and designed for real life, Kai meets you where you are.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
