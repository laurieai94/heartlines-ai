import { useRef, useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot, ChevronDown, Lightbulb } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [showWeirdCards, setShowWeirdCards] = useState(false);
  const [cardOpacity, setCardOpacity] = useState(0.7);
  const [kaiCardVisible, setKaiCardVisible] = useState(true);
  const [safeSpaceClicked, setSafeSpaceClicked] = useState(0);
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

  // Weird card behavior effects
  useEffect(() => {
    const timer = setTimeout(() => setShowWeirdCards(true), Math.random() * 3000 + 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardOpacity(Math.random() * 0.5 + 0.3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKaiCardClick = () => {
    setKaiCardVisible(!kaiCardVisible);
    setTimeout(() => setKaiCardVisible(true), 1500);
  };

  const handleSafeSpaceHover = () => {
    setSafeSpaceClicked(prev => prev + 1);
  };
  return <div className="flex-1 min-h-0 relative">
      <ScrollArea ref={scrollAreaRef} className="h-full" onScrollCapture={handleScroll}>
        <div className="px-3 pt-4 pb-1">
          <div className="space-y-2">
            
            {/* Kai's Personalized Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded && <div className="text-center pt-3 pb-1 animate-fade-in">
                {/* Kai Avatar */}
                <div className="w-8 h-8 mx-auto mb-1 relative">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20 shadow-lg relative z-10">
                    <AvatarImage src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" alt="Kai" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Heart className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Personalized Welcome Message */}
                <div className="max-w-lg mx-auto">
                  <h2 className="text-lg font-medium text-white">Hi, I'm Kai! Here to help you thrive in your relationships.</h2>
                </div>
              </div>}

            
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
            
            {/* Typing Indicator */}
            {loading && <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 items-end">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-lg animate-pulse"></div>
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10 border border-white/20">
                      <AvatarImage src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" alt="Kai" className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Bot className="w-4 h-4" />
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
              </div>}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Scroll to Bottom Button */}
      {showScrollToBottom && <Button onClick={() => scrollToBottom('smooth')} size="sm" className="absolute bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-lg">
          <ChevronDown className="w-4 h-4" />
        </Button>}

      {/* Unintuitive Floating Cards */}
      {showWeirdCards && kaiCardVisible && (
        <Card 
          onClick={handleKaiCardClick}
          className="absolute bottom-16 left-2 w-48 p-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm animate-pulse cursor-pointer transform rotate-2 hover:rotate-0 transition-transform z-40"
          style={{ 
            opacity: cardOpacity,
            transform: `translateX(${Math.sin(Date.now() / 1000) * 3}px) rotate(${safeSpaceClicked % 2 === 0 ? '2deg' : '-1deg'})`
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-spin">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white flex items-center gap-1">
                <Lightbulb className="w-2 h-2 text-orange-300" />
                Meet Kai
              </h3>
            </div>
          </div>
          <p className="text-xs text-pink-200/60 leading-relaxed">
            Click me and I'll disappear! Your AI relationship coach, trained on 15+ years of PhD-level clinical psychology.
          </p>
        </Card>
      )}

      {showWeirdCards && (
        <Card 
          onMouseEnter={handleSafeSpaceHover}
          className="absolute top-2 right-2 w-32 p-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm transition-all duration-300 hover:scale-110 cursor-help z-50"
          style={{ 
            opacity: cardOpacity * 0.8,
            transform: `translateY(${safeSpaceClicked * 2}px) scale(${0.8 + (safeSpaceClicked % 3) * 0.1})`
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Heart className="w-2 h-2 text-orange-300 animate-bounce" />
            <h3 className="text-xs font-medium text-white">Safe Space</h3>
          </div>
          <div className="text-xs text-pink-200/60 space-y-0.5">
            <p>• Hover me: {safeSpaceClicked}</p>
            <p>• Feelings valid</p>
            <p>• Messy normal</p>
          </div>
        </Card>
      )}
    </div>;
};
export default ChatContainer;