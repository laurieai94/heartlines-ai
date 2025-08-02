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
    messagesEndRef.current?.scrollIntoView({
      behavior
    });
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
  return <div className="flex-1 min-h-0 relative">
      <ScrollArea ref={scrollAreaRef} className="h-full" onScrollCapture={handleScroll}>
        <div className="px-6 pt-6 pb-2">
          <div className="space-y-4 max-w-3xl mx-auto">
            
            {/* Kai's Enhanced Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded && (
              <div className="text-center py-8 animate-fade-in">
                {/* Enhanced Kai Avatar with glow effect */}
                <div className="w-16 h-16 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse"></div>
                  <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/30 shadow-2xl relative z-10 hover:scale-110 transition-transform duration-300">
                    <AvatarImage src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" alt="Kai" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Heart className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Enhanced Welcome Message */}
                <div className="max-w-lg mx-auto space-y-3">
                  <h2 className="text-xl font-bold text-white leading-relaxed tracking-wide">
                    Hi {userName || 'there'}, I'm Kai! 
                  </h2>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Your personal relationship coach, ready to help you navigate love, communication, and connection with confidence.
                  </p>
                </div>
                
                {/* Floating conversation starters hint */}
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md mx-auto">
                  <p className="text-xs text-white/70 leading-relaxed">
                    💬 Try asking about communication, conflict resolution, or any relationship challenge you're facing
                  </p>
                </div>
              </div>
            )}

            
            {/* Chat Messages */}
            {chatHistory.map((message, index) => <div key={message.id} className="animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                 <AIChatMessage message={message} userName={userName} />
                {/* Debug logging for userName */}
                {(() => {
              console.log('ChatContainer - userName passed to AIChatMessage:', userName);
              return null;
            })()}
              </div>)}
            
            {/* Enhanced Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-4 items-end">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-lg animate-pulse"></div>
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10 border-2 border-white/30 shadow-lg">
                      <AvatarImage src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" alt="Kai" className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl border border-white/20 min-w-[80px]">
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                        <div className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                      </div>
                      <span className="text-xs text-white/60 ml-2 animate-pulse">Kai is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Enhanced Scroll to Bottom Button */}
      {showScrollToBottom && (
        <Button 
          onClick={() => scrollToBottom('smooth')} 
          variant="glassy"
          size="sm" 
          className="absolute bottom-6 right-6 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 shadow-xl hover:scale-110 transition-all duration-300 p-3"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      )}
    </div>;
};
export default ChatContainer;