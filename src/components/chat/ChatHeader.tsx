
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Plus, Menu, Info } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/branding";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
}

export const ChatHeader = ({
  userName,
  onNewConversation,
  onOpenSidebar
}: ChatHeaderProps) => {
  const [isKaiInfoOpen, setIsKaiInfoOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-40 shrink-0 bg-burgundy-950/60 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)] md:bg-white/10 md:backdrop-blur-lg md:supports-[backdrop-filter]:bg-white/10">
      <div className="w-full px-1 py-2 md:max-w-5xl md:mx-auto md:p-3">
        {/* Mobile Layout - Stacked */}
        {isMobile && (
          <div className="flex flex-col gap-2">
            {/* Top row - Kai info left, New Chat button right */}
            <div className="flex items-center justify-between">
              <Popover open={isKaiInfoOpen} onOpenChange={setIsKaiInfoOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-0 pr-1 py-1 h-auto hover:bg-white/10 transition-colors rounded-lg">
                    {/* Mobile Kai Avatar */}
                    <div className="relative">
                      <Avatar className="bg-gradient-to-br from-coral-400 to-pink-500 shadow-md w-6 h-6 border border-white/20">
                        <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white">
                          <Heart className="w-2.5 h-2.5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-white"></div>
                    </div>
                    <h3 className="text-white font-medium text-sm leading-none">Kai</h3>
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

              {/* Action buttons - New Chat + Hamburger */}
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                        variant="ghost" 
                        onClick={onNewConversation} 
                        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors w-6 h-6 p-0 rounded-xl"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={20} className="text-xs px-2 py-1">
                      <p>Start new conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {onOpenSidebar && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          onClick={onOpenSidebar} 
                          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors w-6 h-6 p-0 rounded-xl"
                        >
                          <Menu className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={20} className="text-xs px-2 py-1">
                        <p>Open chat history</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Layout - Single row */}
        {!isMobile && (
          <div className="flex items-center justify-between gap-2 md:gap-3">
            {/* Desktop: Full Kai section */}
            <div className="flex items-center gap-3">
              {/* Kai Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-lg animate-pulse"></div>
                <Avatar className="bg-gradient-to-br from-coral-400 to-pink-500 shadow-lg relative z-10 w-10 h-10 border-2 border-white/20">
                  <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" onError={e => {
                    console.log('Kai avatar image failed to load');
                    e.currentTarget.style.display = 'none';
                  }} />
                  <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white">
                    <Heart className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
              </div>
              
              {/* Kai Info */}
              <div>
                <h3 className="text-white font-semibold text-sm">Kai</h3>
                <div className="flex items-center gap-1">
                  <span className="text-white/70 text-sm">Your AI Relationship Coach</span>
                  <Popover open={isKaiInfoOpen} onOpenChange={setIsKaiInfoOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="About Kai" className="h-5 w-5 p-0 rounded-full bg-white/10 hover:bg-white/30 text-white/70 hover:text-white transition-all duration-200 ml-1">
                        <Info className="w-3 h-3" />
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
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              {/* Sidebar Button */}
              {onOpenSidebar && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        onClick={onOpenSidebar} 
                        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[32px] min-w-[32px] rounded-xl flex flex-col items-center gap-1"
                      >
                        <Menu className="w-4 h-4" />
                        <span className="text-xs font-medium">Chats</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={20} className="text-xs px-2 py-1">
                      <p>Open chat history</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* New Chat Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      onClick={onNewConversation} 
                      className="text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[32px] min-w-[32px] rounded-xl flex flex-col items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs font-medium">New</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={20} className="text-xs px-2 py-1">
                    <p>Start new conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
