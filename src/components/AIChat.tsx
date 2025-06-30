
import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Bot, Handshake } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import BubbleBackground from "./BubbleBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isConfigured: boolean;
  conversationStarter?: string;
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory, isConfigured, conversationStarter }: AIChatProps) => {
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { saveConversation } = useChatHistory();
  const { accessLevel, canInteract } = useProgressiveAccess();
  const processedStarters = useRef(new Set<string>());

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0 && userName && partnerName;

  // BULLETPROOF SCROLL FUNCTION - Multiple Methods
  const scrollToBottom = useCallback((force = false) => {
    console.log('🔄 Attempting scroll to bottom...');
    
    // Method 1: scrollIntoView on messages end ref
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      console.log('✅ scrollIntoView executed');
    }
    
    // Method 2: Direct container scroll
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      console.log(`📊 Container - Height: ${container.scrollHeight}, Current: ${container.scrollTop}`);
      
      if (force) {
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
      console.log(`✅ Container scroll executed - New position: ${container.scrollTop}`);
    }
    
    // Method 3: DOM query backup
    const chatElement = document.getElementById('chat-messages-container');
    if (chatElement) {
      chatElement.scrollTop = chatElement.scrollHeight;
      console.log('✅ DOM query scroll executed');
    }
    
    // Method 4: Messages end element backup
    const messagesEndElement = document.getElementById('messages-end-anchor');
    if (messagesEndElement) {
      messagesEndElement.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth',
        block: 'end'
      });
      console.log('✅ Messages end anchor scroll executed');
    }
  }, []);

  // FORCE SCROLL WITH MULTIPLE ATTEMPTS
  const forceScrollToBottom = useCallback(() => {
    console.log('🚀 Force scroll initiated...');
    // Multiple attempts with different delays
    [0, 50, 100, 200, 300, 500, 1000].forEach(delay => {
      setTimeout(() => {
        scrollToBottom(delay === 0);
      }, delay);
    });
  }, [scrollToBottom]);

  // MUTATION OBSERVER FOR DOM CHANGES
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const observer = new MutationObserver((mutations) => {
      let shouldScroll = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldScroll = true;
        }
      });
      
      if (shouldScroll) {
        console.log('🔍 DOM mutation detected, scrolling...');
        setTimeout(() => scrollToBottom(), 50);
      }
    });

    observer.observe(chatContainer, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });

    return () => observer.disconnect();
  }, [scrollToBottom]);

  // SCROLL ON MESSAGES CHANGE
  useEffect(() => {
    if (chatHistory.length > 0) {
      console.log(`📨 Messages changed (${chatHistory.length} total), scrolling...`);
      forceScrollToBottom();
    }
  }, [chatHistory.length, forceScrollToBottom]);

  // SCROLL ON LOADING STATE CHANGE
  useEffect(() => {
    if (loading) {
      console.log('⏳ Loading state changed, scrolling...');
      setTimeout(() => forceScrollToBottom(), 100);
    }
  }, [loading, forceScrollToBottom]);

  // INITIAL SCROLL ON MOUNT
  useEffect(() => {
    console.log('🏁 Component mounted, initial scroll...');
    setTimeout(() => forceScrollToBottom(), 100);
  }, [forceScrollToBottom]);

  // WINDOW RESIZE HANDLER
  useEffect(() => {
    const handleResize = () => {
      console.log('📐 Window resized, scrolling...');
      setTimeout(() => forceScrollToBottom(), 300);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forceScrollToBottom]);

  // MOBILE KEYBOARD HANDLER
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page visibility changed, scrolling...');
        setTimeout(() => forceScrollToBottom(), 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [forceScrollToBottom]);

  // Handle conversation starter
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract) {
      processedStarters.current.add(conversationStarter);
      sendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract]);

  // Save conversation with debouncing
  useEffect(() => {
    if (chatHistory.length > 0 && canInteract) {
      const timeoutId = setTimeout(() => {
        saveConversation(chatHistory);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory, saveConversation, canInteract]);

  const sendMessage = async (userMessage: string) => {
    if (!canInteract) return;

    console.log('💬 Sending message, will scroll after...');
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    // Scroll after user message is added
    setTimeout(() => forceScrollToBottom(), 100);

    // Extract and track topics from user message
    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Enhanced AI prompt for Kai's professional clinical voice
      const enhancedPrompt = `You are Kai, a PhD-level clinical psychologist and certified relationship therapist with deep expertise in attachment theory, EFT, and the Gottman Method.

CRITICAL PROFESSIONAL TONE REQUIREMENTS:
- PhD-level clinical expertise always evident
- Warm but professional - never overly casual
- Use appropriate psychological terminology naturally
- Show therapeutic competence in every response
- Maintain clinical authority while being approachable

FORBIDDEN CASUAL EXPRESSIONS - NEVER USE:
- "Oh honey" "Been there" "Tell me about it" "That's rough" 
- "Yeah, feels messy" "Ugh" or any overly informal language

REQUIRED PROFESSIONAL LANGUAGE:
- "That sounds challenging" "Your response makes complete sense"
- "That's a significant stressor" "I can understand why that would be difficult"
- "Those feelings are completely valid" "That's a normal attachment response"

CLINICAL RESPONSE PATTERNS:
- "That sounds like an attachment response to their behavior"
- "Your nervous system is likely activated by this dynamic"
- "This pattern suggests underlying attachment needs"
- "Your ${context.yourTraits?.attachmentStyle || 'attachment'} style makes this response understandable"

VOICE REQUIREMENTS:
- Length: ULTRA-SHORT responses (15-25 words max, 1-2 sentences)
- Style: Clinical expertise delivered warmly and accessibly
- Always end with a clinically informed question

EXAMPLES OF PROFESSIONAL TONE:
Instead of: "Ugh, phone scrolling when you need connection. What's that bringing up?"
Say: "That disconnect when you need attention activates attachment fears. What emotions surface?"

Instead of: "They're pulling away and your nervous system is freaking out, right?"
Say: "Their withdrawal likely triggers your attachment system. What's your body telling you?"

For this conversation with ${userName || 'the user'}, provide clinical insights while staying warm and help them understand their attachment patterns with professional expertise.`;

      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, chatHistory, enhancedPrompt);
      
      // Extract topics from AI response as well
      const aiTopics = extractTopicsFromMessage(aiResponse);
      aiTopics.forEach(topic => addOrUpdateTopic(topic));
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      console.log('🤖 AI response received, adding message...');
      setChatHistory(prev => [...prev, aiMessage]);

      // Force scroll after AI message
      setTimeout(() => forceScrollToBottom(), 200);

      // Automatically speak Kai's response if voice function is available
      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      // Force scroll after error message
      setTimeout(() => forceScrollToBottom(), 200);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  const handleInputFocus = () => {
    console.log('🎯 Input focused, scrolling...');
    setTimeout(() => forceScrollToBottom(), 300);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Chat Container - Uses full screen height */}
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col min-h-0">
          
          {/* Chat Messages Area - Fixed height container with bulletproof scrolling */}
          <div className="flex-1 min-h-0 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            
            {/* Messages Container with native scroll and multiple IDs for targeting */}
            <div 
              ref={chatContainerRef}
              id="chat-messages-container"
              className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6"
              style={{ 
                scrollBehavior: 'smooth',
                overflowAnchor: 'none',
                height: '100%',
                maxHeight: '100%'
              }}
            >
              <div className="space-y-6 max-w-3xl mx-auto pb-4">
                
                {/* Kai's Welcome Section */}
                {chatHistory.length === 0 && isConfigured && !conversationStarter && (
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
                    
                    {/* Welcome Message */}
                    <div className="space-y-3 max-w-lg mx-auto">
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        Hello, I'm Dr. Kai 👋
                      </h2>
                      
                      <div className="text-white/80 leading-relaxed">
                        <p>I'm a clinical psychologist specializing in relationships and attachment. I'm here to help you navigate the complexities of your partnership with professional insight and care.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Chat Messages */}
                {chatHistory.map((message, index) => (
                  <div key={message.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <AIChatMessage 
                      message={message} 
                      userAvatarUrl={profile?.avatar_url || undefined}
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
                
                {/* MULTIPLE SCROLL ANCHORS - Bulletproof approach */}
                <div ref={messagesEndRef} className="h-1 w-1" />
                <div id="messages-end-anchor" className="h-1 w-1" />
                <div className="scroll-anchor h-4" />
              </div>
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="p-6 max-w-3xl mx-auto">
                <ProgressiveAccessWrapper action="chat">
                  <AIChatInput 
                    onSendMessage={sendMessage} 
                    loading={loading || !isConfigured || !canInteract} 
                    userName={userName} 
                    partnerName={partnerName}
                    chatHistory={chatHistory}
                    onSpeakResponse={handleSpeakResponse}
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
        </div>
      </div>
    </div>
  );
};

export default AIChat;
