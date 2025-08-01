
import { useRef, useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot, ChevronDown } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";


interface ChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  
}

const ChatContainer = ({ 
  chatHistory, 
  loading, 
  userName, 
  isConfigured, 
  conversationStarter, 
  isHistoryLoaded
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const threshold = 100;
    const isNear = target.scrollHeight - target.scrollTop - target.clientHeight < threshold;
    
    setIsNearBottom(isNear);
    setShowScrollToBottom(!isNear && chatHistory.length > 0);
  }, [chatHistory.length]);

  // Auto-scroll only when user is near bottom or when loading
  useEffect(() => {
    if ((isNearBottom || loading) && chatHistory.length > 0) {
      const timeoutId = setTimeout(() => scrollToBottom('smooth'), 50);
      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory.length, loading, isNearBottom, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
    }
  }, [isHistoryLoaded, scrollToBottom]);

  return (
    <div className="flex-1 min-h-0 relative">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-full"
        onScrollCapture={handleScroll}
      >
        <div className="px-3 pt-4 pb-1">
          <div className="space-y-2">
            
            {/* Kai's Personalized Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded && (
              <div className="text-center pt-3 pb-1 animate-fade-in">
                {/* Kai Avatar */}
                <div className="w-8 h-8 mx-auto mb-1 relative">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20 shadow-lg relative z-10">
                    <AvatarImage 
                      src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                      alt="Kai" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Heart className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Personalized Welcome Message */}
                <div className="max-w-lg mx-auto">
                  <h2 className="text-lg font-medium text-white">
                    Hello {userName ? `${userName}` : ''}, I'm Kai - your AI relationship coach
                  </h2>
                </div>
              </div>
            )}

            
            {/* Chat Messages */}
            {chatHistory.map((message, index) => (
              <div key={message.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                 <AIChatMessage 
                  message={message} 
                  userName={userName}
                />
                {/* Debug logging for userName */}
                {(() => {
                  console.log('ChatContainer - userName passed to AIChatMessage:', userName);
                  return null;
                })()}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 items-end">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-lg animate-pulse"></div>
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10 border border-white/20">
                      <AvatarImage 
                        src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl px-5 py-3 shadow-xl border border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <Button
          onClick={() => scrollToBottom('smooth')}
          size="sm"
          className="absolute bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-lg"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatContainer;
