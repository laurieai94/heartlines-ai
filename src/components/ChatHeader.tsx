
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot, Circle, User, Heart, Info } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

interface ChatHeaderProps {
  userName?: string;
  partnerName?: string;
  userAvatarUrl?: string;
  hasProfiles: boolean;
}

const ChatHeader = ({ userName, partnerName, userAvatarUrl, hasProfiles }: ChatHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useOptimizedMobile();
  
  const getUserInitials = () => {
    return userName ? userName.charAt(0).toLowerCase() : 'u';
  };

  return (
    <div className={`sticky top-0 z-40 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl ring-1 ring-white/10 ${
      isMobile ? 'p-3 mb-3' : 'p-6 mb-6'
    }`}>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
        {/* AI Coach Avatar */}
        <div className={`relative ${!isMobile ? 'ml-8' : ''}`}>
          <Avatar className={`bg-gradient-to-br from-coral-400 to-pink-500 ${
            isMobile ? 'w-10 h-10 border-2' : 'w-16 h-16 border-4'
          } border-white ${isMobile ? 'shadow-md' : 'shadow-lg'}`}>
            <AvatarImage 
              src={BRAND.coach.avatarSrc} 
              alt={BRAND.coach.name} 
              className="object-cover"
              loading="eager" 
              decoding="async"
              fetchPriority="high"
            />
            <AvatarFallback delayMs={Infinity} className={`text-white border-0 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              <Heart className={isMobile ? 'w-5 h-5' : 'w-8 h-8'} />
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator */}
          <div className={`absolute -bottom-1 -right-1 bg-green-400 rounded-full border-white flex items-center justify-center ${
            isMobile ? 'w-4 h-4 border-2' : 'w-6 h-6 border-3'
          }`}>
            <Circle className={`fill-current animate-pulse ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
          </div>
        </div>

        {/* Coach Info */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 ${isMobile ? 'mb-0' : 'mb-1'}`}>
            <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {isMobile ? 'Kai' : 'Kai - Your Relationship Coach'}
            </h2>
            {!isMobile && (
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
                  className="w-72 p-4 bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 rounded-2xl z-50"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg">Meet Kai</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-white/90 leading-relaxed">
                        Your AI relationship coach, trained in PhD-level psychology and real-world clinical care.
                      </p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Grounded in evidence-based and trauma-informed practices, Kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between.
                      </p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        <span className="text-coral-300 font-medium">LGBTQ+ inclusive</span> and designed for real life, Kai meets you where you are.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          {!isMobile && (
            <p className="text-gray-600 font-medium mb-2">
              PhD Clinical Psychologist • Always here to help
            </p>
          )}
          
          {/* Profile Status */}
          {hasProfiles ? (
            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full ${isMobile ? 'text-xs' : ''}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-green-700 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? 'Personalized' : `Personalized for ${userName} & ${partnerName}`}
              </span>
            </div>
          ) : (
            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full ${isMobile ? 'text-xs' : ''}`}>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className={`text-amber-700 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? 'Complete profiles' : 'Complete profiles for personalized advice'}
              </span>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {userName && (
          <div className="relative">
            <Avatar className={`border-white shadow-lg ${
              isMobile ? 'w-8 h-8 border-2' : 'w-12 h-12 border-3'
            }`}>
              <AvatarImage src={userAvatarUrl || undefined} alt={userName} />
              <AvatarFallback className={`bg-gradient-to-br from-pink-400 to-coral-500 text-white font-semibold ${
                isMobile ? 'text-sm' : 'text-lg'
              }`}>
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
