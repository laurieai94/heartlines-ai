
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";

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

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [loading]);

  useEffect(() => {
    scrollToBottom(true);
  }, []);

  return (
    <div className="flex-1 min-h-0 relative">
      <ScrollArea className="h-full">
        <div className="px-6 py-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Kai's Personalized Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded && (
              <div className="text-center py-8 animate-fade-in">
                {/* Kai Avatar */}
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
                  <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/20 shadow-2xl relative z-10">
                    <AvatarImage 
                      src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                      alt="Kai" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Heart className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                </div>
                
                {/* Personalized Welcome Message */}
                <div className="space-y-3 max-w-lg mx-auto">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    Hello {userName ? `${userName}` : ''}, I'm Kai
                  </h2>
                  
                  <div className="text-white/80 leading-relaxed">
                    <p>I'm a clinical psychologist specializing in relationships and attachment. I'm here to help you navigate your relationship complexities with professional insight and care.</p>
                  </div>
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
    </div>
  );
};

export default ChatContainer;
