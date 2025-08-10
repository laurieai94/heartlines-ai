
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Heart, RotateCcw, Menu, Info } from "lucide-react";

interface ChatHeaderProps {
  userName?: string;
  onNewConversation: () => void;
  onOpenSidebar?: () => void;
}

export const ChatHeader = ({ userName, onNewConversation, onOpenSidebar }: ChatHeaderProps) => {
  return (
    <div className="shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="p-3 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Kai Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-lg animate-pulse"></div>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-coral-400 to-pink-500 border-2 border-white/20 shadow-lg relative z-10">
                <AvatarImage 
                  src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                  alt="Kai" 
                  className="object-cover"
                  onError={(e) => {
                    console.log('Kai avatar image failed to load');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white">
                  <Heart className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
            </div>
            
            {/* Kai Info */}
            <div>
              <h3 className="text-white font-semibold text-sm">Kai</h3>
              <p className="text-white/70 text-xs flex items-center">
                Your AI Relationship Coach
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="w-3 h-3 ml-1 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <Info className="w-2 h-2 text-white/60 hover:text-white/80" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl" sideOffset={8}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-coral-400 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="font-semibold text-white">Meet Kai</h3>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Your AI relationship coach, trained in PhD-level psychology and real-world clinical care. Grounded in evidence-based and trauma-informed practices, Kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between. LGBTQ+ inclusive and designed for real life, Kai meets you where you are.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sidebar Button */}
            {onOpenSidebar && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onOpenSidebar}
                      className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Menu className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Refresh Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNewConversation}
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start new conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
