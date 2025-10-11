
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Plus, Menu, Info } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
  isMobilePhone?: boolean;
}

export const ChatHeader = ({
  userName,
  onNewConversation,
  onOpenSidebar,
  isMobilePhone
}: ChatHeaderProps) => {
  const [isKaiInfoOpen, setIsKaiInfoOpen] = useState(false);
  const { isMobile, isTablet, simulateHapticFeedback } = useOptimizedMobile();
  const { visible } = useMobileHeaderVisibility();

  // Enhanced mobile button handlers with haptic feedback
  const handleNewConversation = () => {
    if (isMobile) {
      simulateHapticFeedback(document.body as HTMLElement, 'medium');
    }
    onNewConversation();
  };

  const handleOpenSidebar = () => {
    if (isMobile && onOpenSidebar) {
      simulateHapticFeedback(document.body as HTMLElement, 'light');
      onOpenSidebar();
    } else if (onOpenSidebar) {
      onOpenSidebar();
    }
  };

  return (
    <div className="sticky top-0 z-[70] shrink-0 bg-burgundy-950 backdrop-blur-md border-b border-white/10 shadow-lg md:pt-[env(safe-area-inset-top)] md:bg-white/10 md:backdrop-blur-md">
      <div className="w-full px-1 py-2 md:px-0 md:py-4 lg:py-5 transition-transform duration-200 ease-out will-change-transform">
        {/* Mobile Layout - Single row */}
        {(isMobilePhone ?? (isMobile && !isTablet)) && (
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            {/* Left: Kai avatar + name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <Avatar className="w-6 h-6 border-2 border-white/20 shadow-md bg-gradient-to-br from-coral-400 to-pink-500">
                  <AvatarImage 
                    src={BRAND.coach.avatarSrc} 
                    alt={BRAND.coach.name} 
                    className="object-cover"
                    loading="eager" 
                    decoding="async" 
                    fetchPriority="high" 
                  />
                  <AvatarFallback className="text-white">
                    <Heart className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-burgundy-950">
                  <div className="w-full h-full rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
              
              <div className="flex flex-col min-w-0">
                <h3 className="text-white font-semibold text-base leading-tight truncate">Kai</h3>
                <span className="text-white/70 text-xs leading-tight truncate">Your AI Relationship Coach</span>
              </div>
            </div>

            {/* Right: Hamburger (chat history) + Plus (new chat) */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {onOpenSidebar && (
                <Button 
                  onClick={handleOpenSidebar}
                  variant="ghost" 
                  size="icon"
                  className="h-10 w-10 text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 touch-manipulation active:scale-95 transition-all rounded-lg"
                  aria-label="Open chat history"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              
              <Button 
                onClick={handleNewConversation}
                variant="ghost" 
                size="icon"
                className="h-10 w-10 text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 touch-manipulation active:scale-95 transition-all rounded-lg"
                aria-label="Start new conversation"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Layout - Single row */}
        {!(isMobilePhone ?? (isMobile && !isTablet)) && (
          <div className="flex items-center gap-2 md:gap-3 md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6">
            {/* Kai Avatar - Far Left */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
              <Avatar className="bg-gradient-to-br from-coral-400 to-pink-500 shadow-lg relative z-10 w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 border-3 border-white/20">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" loading="eager" decoding="async" fetchPriority="high" />
                <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white">
                  <Heart className="w-4 h-4 md:w-6 md:h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
            </div>
            
            {/* Kai Info - Center, aligned with messages */}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm md:text-base lg:text-lg">Kai</h3>
              <div className="flex items-center gap-1">
                <span className="text-white/70 text-sm">Your AI Relationship Coach</span>
                <Popover open={isKaiInfoOpen} onOpenChange={setIsKaiInfoOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="About Kai" className="h-4 w-4 p-0 rounded-full bg-white/10 hover:bg-white/30 text-white/70 hover:text-white transition-all duration-200 ml-1">
                      <Info className="w-2.5 h-2.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="start" sideOffset={8} avoidCollisions collisionPadding={16} className="w-72 p-4 max-w-[calc(100vw-32px)] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 rounded-2xl z-50">
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
              </div>
            </div>

            {/* Sidebar Button */}
            {onOpenSidebar && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      onClick={handleOpenSidebar} 
                      className="text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] rounded-xl flex flex-col items-center gap-0.5 touch-manipulation"
                    >
                      <Menu className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">Chats</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={20} className="text-xs px-2 py-1">
                    <p>Open chat history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* New Chat Button - Far Right, aligned with user avatars */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={handleNewConversation} 
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] rounded-xl flex flex-col items-center gap-0.5 touch-manipulation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">New</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={20} className="text-xs px-2 py-1">
                  <p>Start new conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};
