
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  userName?: string;
  onNewConversation: () => void;
}

export const ChatHeader = ({ userName, onNewConversation }: ChatHeaderProps) => {
  return (
    <div className="shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Kai Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-lg animate-pulse"></div>
              <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/20 shadow-lg relative z-10">
                <AvatarImage 
                  src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                  alt="Kai" 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Heart className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white animate-pulse shadow-sm"></div>
            </div>
            
            {/* Kai Info */}
            <div>
              <h3 className="text-white font-semibold text-sm">Dr. Kai</h3>
              <p className="text-white/70 text-xs">Your Relationship Guide</p>
            </div>
          </div>

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
  );
};
