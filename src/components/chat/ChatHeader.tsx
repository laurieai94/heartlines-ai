
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Plus, Menu, Info } from "lucide-react";
import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useState } from "react";

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
  const { isMobile } = useOptimizedMobile();

  return (
    <div className="chat-header sticky top-0 z-50 md:z-[70] shrink-0 bg-burgundy-800 md:bg-burgundy-800/50 backdrop-blur-none md:backdrop-blur-md border-b border-pink-400/10 shadow-lg">
      <div className="w-full px-0 py-3 md:py-4 lg:py-5 transition-transform duration-200 ease-out">
        <div className="flex items-center justify-between gap-3 md:gap-4 max-w-3xl lg:max-w-4xl mx-auto md:px-6">
          
          {/* Mobile Layout (< 768px) */}
          {isMobile ? (
            <>
              {/* Kai Avatar & Name - Left */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-coral-400/20 to-burgundy-400/20 rounded-full blur-md animate-pulse"></div>
                  <Avatar className="bg-gradient-to-br from-coral-400 to-burgundy-500 shadow-lg relative z-10 w-[44px] h-[44px] border-2 border-white/20">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" loading="eager" decoding="async" fetchPriority="high" />
                    <AvatarFallback className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white">
                      <Heart className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-base truncate">kai</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          aria-label="about kai" 
                          className="h-5 w-5 p-0 rounded-full bg-white/10 hover:bg-white/30 text-white/70 hover:text-white transition-all duration-200 flex-shrink-0"
                        >
                          <Info className="w-3 h-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        side="bottom" 
                        align="start" 
                        sideOffset={8}
                        className="w-[280px] max-w-[calc(100vw-32px)] p-4 bg-burgundy-900/85 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 rounded-2xl z-[100]"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-burgundy-500 rounded-full flex items-center justify-center shadow-lg">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
            <h3 className="font-semibold text-white/90 text-lg">meet kai</h3>
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm text-white/90 leading-relaxed">
                              your ai relationship coach, trained in phd-level psychology and real-world clinical care.
                            </p>
                            <p className="text-sm text-white/80 leading-relaxed">
                              grounded in evidence-based and trauma-informed practices, kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between.
                            </p>
                            <p className="text-sm text-white/80 leading-relaxed">
                              <span className="text-coral-300 font-medium">lgbtq+ inclusive</span> and designed for real life, kai meets you where you are.
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <span className="text-white/70 text-xs truncate block">your ai coach</span>
                </div>
              </div>

              {/* Action Buttons - Right */}
              <div className="flex items-center gap-1">
                {/* New Conversation Button */}
                <Button 
                  variant="ghost"
                  onClick={onNewConversation}
                  className="text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all min-h-[44px] min-w-[44px] rounded-xl flex-shrink-0 touch-manipulation p-0"
                  aria-label="new conversation"
                >
                  <Plus className="w-5 h-5" />
                </Button>
                
                {/* Chat History Button */}
                {onOpenSidebar && (
                  <Button 
                    variant="ghost"
                    onClick={onOpenSidebar}
                    className="text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all min-h-[44px] min-w-[44px] rounded-xl flex-shrink-0 touch-manipulation p-0"
                    aria-label="open chat history"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Desktop/Tablet Layout (≥ 768px) - Keep Original */
            <>
              {/* Kai Avatar - Far Left */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-coral-400/20 to-burgundy-400/20 rounded-full blur-md animate-pulse"></div>
                <Avatar className="bg-gradient-to-br from-coral-400 to-burgundy-500 shadow-lg relative z-10 w-[56px] h-[56px] border-3 border-white/20">
                  <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" loading="eager" decoding="async" fetchPriority="high" />
                  <AvatarFallback className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white">
                    <Heart className="w-7 h-7" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
              </div>
              
              {/* Kai Info - Center */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold text-base lg:text-lg truncate">kai</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="about kai" className="h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/30 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-all duration-200 flex-shrink-0">
                        <Info className="w-3.5 h-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="start" sideOffset={8} avoidCollisions collisionPadding={16} className="w-72 p-4 max-w-[calc(100vw-32px)] bg-burgundy-900/85 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 rounded-2xl z-50">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-burgundy-500 rounded-full flex items-center justify-center shadow-lg">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-white/90 text-lg">meet kai</h3>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-white/90 leading-relaxed">
                            your ai relationship coach, trained in phd-level psychology and real-world clinical care.
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed">
                            grounded in evidence-based and trauma-informed practices, kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between.
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed">
                            <span className="text-coral-300 font-medium">lgbtq+ inclusive</span> and designed for real life, kai meets you where you are.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="text-white/70 text-sm truncate block">your ai relationship coach</span>
              </div>

              {/* Sidebar Button */}
              {onOpenSidebar && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        onClick={onOpenSidebar} 
                        className="text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-coral-500/15 hover:to-pink-500/15 transition-colors min-h-[44px] min-w-[44px] rounded-xl flex flex-col items-center gap-0.5 touch-manipulation flex-shrink-0"
                      >
                        <Menu className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">chats</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={20} className="text-xs px-2 py-1">
                      <p>open chat history</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* New Chat Button - Far Right */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      onClick={onNewConversation} 
                      className="text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-coral-500/15 hover:to-pink-500/15 transition-colors min-h-[44px] min-w-[44px] rounded-xl flex flex-col items-center gap-0.5 touch-manipulation flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">new</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={20} className="text-xs px-2 py-1">
                    <p>start new conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
