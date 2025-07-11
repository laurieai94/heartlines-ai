import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bot, Send } from "lucide-react";
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

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  loading,
  userName,
  partnerName,
  isConfigured,
  conversationStarter,
  isHistoryLoaded,
  onSendMessage,
  onSpeakResponse
}) => {
  // State management
  const [message, setMessage] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks
  const { accessLevel, canInteract } = useProgressiveAccess();

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  // Focus input when ready
  useEffect(() => {
    if (isHistoryLoaded && canInteract && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isHistoryLoaded, canInteract]);

  // Handle typing indicator
  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (value.trim() && !isUserTyping) {
      setIsUserTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);
  };

  // Send message function
  const handleSendMessage = () => {
    if (!message.trim() || loading || !canInteract) return;
    
    const messageToSend = message.trim();
    setMessage("");
    setIsUserTyping(false);
    
    onSendMessage(messageToSend);
    
    // Refocus input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle quick starters
  const handleQuickStarter = (starter: string) => {
    onSendMessage(starter);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handle voice messages
  const handleVoiceMessage = (voiceMessage: string) => {
    onSendMessage(voiceMessage);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const isInputDisabled = loading || !isConfigured || !canInteract || !isHistoryLoaded;
  const showWelcome = chatHistory.length === 0 && isConfigured && !conversationStarter && isHistoryLoaded;
  const showStarters = chatHistory.length === 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-500 via-coral-500 to-purple-600">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            
            {/* Welcome Section */}
            {showWelcome && (
              <div className="text-center py-8 animate-fade-in">
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
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                </div>
                
                <div className="space-y-3 max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    Hello {userName ? `${userName}` : ''}, I'm Kai 👋
                  </h2>
                  <p className="text-white/90 leading-relaxed">
                    I'm a clinical psychologist specializing in relationships and attachment. I'm here to help you navigate your relationship complexities with professional insight and care.
                  </p>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.map((msg, index) => (
              <div 
                key={msg.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AIChatMessage message={msg} userName={userName} />
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 items-end">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                    <AvatarImage 
                      src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                      alt="Kai" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/15 backdrop-blur-sm rounded-3xl px-5 py-3 shadow-xl border border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6 max-w-3xl mx-auto">
          <ProgressiveAccessWrapper action="chat">
            <div className="space-y-4">
              
              {/* Typing Indicator */}
              {isUserTyping && message.trim() && (
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
              {showStarters && (
                <ConversationStarters onSelectStarter={handleQuickStarter} />
              )}

              {/* Message Input */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation..."}
                    disabled={isInputDisabled}
                    className="border-2 border-coral-200/50 focus:border-coral-300 rounded-2xl px-4 py-3 text-sm resize-none min-h-[50px] max-h-[100px] focus:ring-2 focus:ring-coral-200/30 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white leading-relaxed"
                    rows={1}
                  />
                </div>
                
                {/* Voice Interface */}
                <VoiceInterface
                  onVoiceMessage={handleVoiceMessage}
                  onSpeakResponse={onSpeakResponse}
                  disabled={isInputDisabled}
                />
                
                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isInputDisabled}
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