import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot, Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { ConversationStarters } from "./chat-input/ConversationStarters";
import VoiceInterface from "./VoiceInterface";

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
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { accessLevel, canInteract } = useProgressiveAccess();

  // Reliable auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll when messages change or loading state changes
  useLayoutEffect(() => {
    scrollToBottom();
  }, [chatHistory.length, loading]);

  // Focus management
  const focusTextarea = () => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    });
  };

  // Initial focus
  useEffect(() => {
    if (isHistoryLoaded && canInteract) {
      focusTextarea();
    }
  }, [isHistoryLoaded, canInteract]);

  // Handle typing indicator
  const handleInputChange = (value: string) => {
    setCurrentMessage(value);
    
    // Show typing indicator when user starts typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout and set new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Hide typing indicator after user stops typing for 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Clear typing indicator when message is sent
  useEffect(() => {
    if (currentMessage === "") {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [currentMessage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Send message and maintain focus
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
    focusTextarea();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickStarter = (starter: string) => {
    onSendMessage(starter);
    focusTextarea();
  };

  const handleVoiceMessage = (message: string) => {
    onSendMessage(message);
    focusTextarea();
  };

  const showQuickStarters = chatHistory.length === 0;
  const placeholder = chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation...";

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area - Fixed height with reliable scrolling */}
      <div className="flex-1 min-h-0">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
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
        </div>
      </div>

      {/* Input Section */}
      <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6 max-w-3xl mx-auto">
          <ProgressiveAccessWrapper action="chat">
            <div className="space-y-3">
              {/* Kai is Listening Indicator */}
              {isTyping && currentMessage.trim() && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 animate-fade-in">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-white/70 font-light">Kai is listening...</span>
                </div>
              )}

              {/* Conversation Starters */}
              {showQuickStarters && (
                <ConversationStarters onSelectStarter={handleQuickStarter} />
              )}

              {/* Chat Input */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    disabled={loading || !isConfigured || !canInteract || !isHistoryLoaded}
                    className="border-2 border-coral-200/50 focus:border-coral-300 rounded-2xl px-4 py-3 text-sm resize-none min-h-[50px] max-h-[100px] focus:ring-2 focus:ring-coral-200/30 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white leading-relaxed"
                    rows={1}
                  />
                </div>
                
                {/* Voice Interface */}
                <VoiceInterface
                  onVoiceMessage={handleVoiceMessage}
                  onSpeakResponse={onSpeakResponse}
                  disabled={loading || !isConfigured || !canInteract || !isHistoryLoaded}
                />
                
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || loading || !isConfigured || !canInteract || !isHistoryLoaded}
                  className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 rounded-2xl w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
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