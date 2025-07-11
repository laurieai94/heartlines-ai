import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName: string;
  partnerName: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  onSendMessage: (message: string) => void;
  onSpeakResponse: (speakFunction: (text: string) => void) => void;
}

const ChatInterface = ({ 
  chatHistory, 
  loading, 
  userName,
  partnerName,
  isConfigured, 
  conversationStarter, 
  isHistoryLoaded,
  onSendMessage,
  onSpeakResponse
}: ChatInterfaceProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { accessLevel, canInteract } = useProgressiveAccess();

  // Auto-scroll to bottom when new messages arrive or loading changes
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (loading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [loading]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="px-4 py-4">
            <div className="space-y-4 max-w-2xl mx-auto">
              
              {/* Kai's Personalized Welcome Section */}
              {chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded && (
                <div className="text-center py-6 animate-fade-in">
                  {/* Kai Avatar */}
                  <div className="w-14 h-14 mx-auto mb-3 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
                    <Avatar className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/20 shadow-2xl relative z-10">
                      <AvatarImage 
                        src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Heart className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                  </div>
                  
                  {/* Personalized Welcome Message */}
                  <div className="space-y-2 max-w-md mx-auto">
                    <h2 className="text-xl font-bold text-white leading-tight">
                      Hello {userName ? `${userName}` : ''}, I'm Kai 👋
                    </h2>
                    
                    <div className="text-white/80 leading-relaxed text-sm">
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
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Section */}
      <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6 max-w-3xl mx-auto">
          <ProgressiveAccessWrapper action="chat">
            <AIChatInput 
              onSendMessage={onSendMessage} 
              loading={loading || !isConfigured || !canInteract || !isHistoryLoaded} 
              userName={userName} 
              partnerName={partnerName}
              chatHistory={chatHistory}
              onSpeakResponse={onSpeakResponse}
            />
          </ProgressiveAccessWrapper>
          {!isConfigured && accessLevel === 'full-access' && (
            <p className="text-sm text-white/60 mt-3 text-center font-light">
              Complete setup to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;