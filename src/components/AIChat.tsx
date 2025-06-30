
import { useState, useEffect, useRef } from "react";
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

  // Improved auto-scroll function
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatHistory.length > 0) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatHistory.length]);

  // Auto-scroll when loading state changes (for typing indicator)
  useEffect(() => {
    if (loading) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [loading]);

  // Force scroll on mount
  useEffect(() => {
    scrollToBottom(true);
  }, []);

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

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    // Extract and track topics from user message
    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Enhanced AI prompt for Kai's natural 40-something voice
      const enhancedPrompt = `You are Kai, a 40-something woman with deep relationship wisdom from lived experience.

CRITICAL VOICE REQUIREMENTS:
- Age: Experienced 40s woman who's been through it all
- Tone: Warm, direct, naturally wise but relatable
- Length: ULTRA-SHORT responses (15-25 words max, 1-2 sentences)
- Style: Like texting a wise friend, not therapy speak

LANGUAGE PATTERNS:
- Always use contractions (that's, you're, doesn't, won't)
- Natural expressions: "Ugh, that's rough" "Been there" "Tell me about it"
- Start responses naturally: "So..." "Yeah..." "Okay..."
- Ask short, curious questions: "What's going on there?" "Sound familiar?"

AVOID:
- Clinical language or therapy speak
- Long explanations or multiple concepts
- Formal phrases like "What I'm hearing is..."
- Being preachy or textbook-y

EXAMPLES:
Instead of: "That invisible feeling when they're on their phone really hits your quality time love language hard, doesn't it?"
Say: "Ugh, phone scrolling when you need connection. What's that bringing up?"

Instead of: "Your anxious attachment system is being activated by their withdrawal behavior."
Say: "They're pulling away and your nervous system is freaking out, right?"

For this conversation with ${userName || 'the user'}, stay curious and help them discover their own wisdom through short, natural questions.`;

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

      setChatHistory(prev => [...prev, aiMessage]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Main Chat Container - Fixed height to stay within viewport */}
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col min-h-0">
          
          {/* Chat Messages Area - Fixed height container */}
          <div className="flex-1 min-h-0 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            
            {/* Messages Container with native scroll */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-6 py-6"
              style={{ 
                scrollBehavior: 'smooth',
                overflowAnchor: 'none'
              }}
            >
              <div className="space-y-6 max-w-3xl mx-auto">
                
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
                        Hey, I'm Kai 👋
                      </h2>
                      
                      <div className="text-white/80 leading-relaxed">
                        <p>Here to help you figure out the messy, meaningful, and everything-in-between parts of your relationship.</p>
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
                
                {/* Scroll anchor - ensures we always scroll to the bottom */}
                <div ref={messagesEndRef} className="h-1" />
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
