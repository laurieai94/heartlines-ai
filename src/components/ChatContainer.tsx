import { useRef, useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, ChevronDown } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const { accessLevel } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  const prevLoadingRef = useRef(loading);
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const distanceToBottom = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);
    
    // Use 'auto' for small distances to avoid bounce, 'smooth' for larger
    const scrollBehavior = distanceToBottom < 48 ? 'auto' : behavior;
    
    messagesEndRef.current?.scrollIntoView({
      behavior: scrollBehavior
    });
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const threshold = 100;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const isNear = distanceToBottom < threshold;
    setIsNearBottom(isNear);
    setShowScrollToBottom(!isNear && chatHistory.length > 0);
  }, [chatHistory.length]);

  // Smart auto-scroll: only when near bottom and something actually changed
  useEffect(() => {
    const chatLengthChanged = prevChatLengthRef.current !== chatHistory.length;
    const loadingChanged = prevLoadingRef.current !== loading;
    
    if (isNearBottom && (chatLengthChanged || (loadingChanged && loading)) && chatHistory.length > 0) {
      const timeoutId = setTimeout(() => scrollToBottom('smooth'), 50);
      
      prevChatLengthRef.current = chatHistory.length;
      prevLoadingRef.current = loading;
      
      return () => clearTimeout(timeoutId);
    }
    
    prevChatLengthRef.current = chatHistory.length;
    prevLoadingRef.current = loading;
  }, [chatHistory.length, loading, isNearBottom, scrollToBottom]);

  // Window resize and ResizeObserver for responsive auto-scroll
  useEffect(() => {
    const handleWindowResize = () => {
      if (isNearBottom) {
        scrollToBottom('auto');
      }
    };

    window.addEventListener('resize', handleWindowResize);

    let resizeObserver: ResizeObserver | undefined;
    if (viewportRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (isNearBottom) {
          scrollToBottom('auto');
        }
      });
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
    };
  }, [isNearBottom, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
    }
  }, [isHistoryLoaded, scrollToBottom]);
  return <div className="flex-1 min-h-0 relative">
      <ScrollArea 
        viewportRef={viewportRef} 
        className="h-full overscroll-contain" 
        onScroll={handleScroll}
      >
        <div className="px-4 pt-3 pb-2">
          <div className="space-y-3 max-w-3xl mx-auto">
            
            {/* Chat Messages */}
            {chatHistory.map((message) => (
              <div key={message.id}>
                <AIChatMessage message={message} userName={userName} />
              </div>
            ))}
            
            {/* Typing indicator - only show when loading */}
            {loading && (
              <div className="flex gap-3 items-end">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-lg animate-pulse"></div>
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10 border border-white/20">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Bot className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl px-5 py-3 shadow-xl border border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{
                      animationDelay: '0.1s'
                    }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{
                      animationDelay: '0.2s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Scroll to Bottom Button */}
      {showScrollToBottom && <Button onClick={() => scrollToBottom('smooth')} size="sm" className="absolute bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-lg">
          <ChevronDown className="w-4 h-4" />
        </Button>}
    </div>;
};
export default ChatContainer;