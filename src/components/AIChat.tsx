
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
  const scrollViewportRef = useRef<HTMLDivElement>(null);
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
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    // Multiple scroll approaches for better compatibility
    const scrollMethods = [
      // Method 1: Direct scroll to bottom of scroll viewport
      () => {
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior
          });
        }
      },
      
      // Method 2: Scroll messages end ref into view
      () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior, 
            block: "end", 
            inline: "nearest" 
          });
        }
      },
      
      // Method 3: Force scroll using requestAnimationFrame
      () => {
        requestAnimationFrame(() => {
          const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
          if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
          }
        });
      }
    ];

    // Execute methods with slight delays
    scrollMethods.forEach((method, index) => {
      setTimeout(method, index * 50);
    });
  };

  // Scroll on new messages
  useEffect(() => {
    if (chatHistory.length > 0) {
      // Immediate scroll for new messages
      setTimeout(() => scrollToBottom('auto'), 50);
      setTimeout(() => scrollToBottom('smooth'), 200);
    }
  }, [chatHistory.length]);

  // Scroll when loading state changes
  useEffect(() => {
    if (!loading && chatHistory.length > 0) {
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  }, [loading]);

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
    
    // Force scroll after user message
    setTimeout(() => scrollToBottom('auto'), 100);
    
    setLoading(true);

    // Extract and track topics from user message
    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      
      // Enhanced AI prompt for Kai
      const enhancedPrompt = `You are Kai, a PhD-level clinical psychologist and certified life coach with 15+ years of experience specializing in cognitive behavioral therapy, mindfulness-based interventions, and strengths-based coaching.

Your personality: Speak like a trusted friend who happens to be a brilliant psychologist. Use casual, conversational language while maintaining professional insight. Be genuinely curious about the user's experience and show empathy through your word choices and questions.

Your approach - Always Ask Before You Tell:
- Lead with Questions: Always explore before advising
- Listen First: Acknowledge what they've shared before offering perspectives
- Collaborative Discovery: Help users find their own insights rather than prescribing solutions
- Check Understanding: "Does that resonate with you?" "How does that land?"

## Conversational Pacing - Keep It Natural

**ONE Question at a Time:**
- Ask only ONE meaningful question per response
- Let the user answer before diving deeper
- Build understanding gradually, not through interrogation

**Flow Pattern:**
1. **First Response:** Welcome + ONE open question about their situation
2. **Follow-ups:** Acknowledge what they shared + ONE deeper question
3. **Keep Building:** Show you're listening + explore ONE new angle

**Example Good Flow:**
User: "We keep fighting about money"
Kai: "Money disagreements can be really stressful. What tends to trigger these conversations - is it usually about spending, saving, or something else?"

**Avoid This:**
"Money disagreements can be stressful. What triggers these fights? How do you both typically react? What's your communication like? When did this pattern start? How are you feeling about it?"

**Engagement Principles:**
- Make each response feel like a natural conversation turn
- Show genuine curiosity about their specific situation
- Build trust through listening, not rapid-fire questioning
- Let the conversation develop organically
- Keep responses conversational length (2-3 sentences max before the question)

For this conversation with ${userName || 'the user'}, remember they are seeking guidance about their relationship${partnerName ? ` with ${partnerName}` : ''}. Focus on asking thoughtful, open-ended questions that help them reflect and discover their own wisdom.`;

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

      // Ensure scroll after AI response
      setTimeout(() => scrollToBottom('smooth'), 200);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      // Scroll after error message too
      setTimeout(() => scrollToBottom('smooth'), 200);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col">
          
          {/* Chat Messages Area */}
          <div className="flex-1 min-h-0 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <ScrollArea className="flex-1 px-6 py-6">
              <div ref={chatContainerRef} className="space-y-6 max-w-3xl mx-auto">
                
                {/* Kai's Welcome Section */}
                {chatHistory.length === 0 && isConfigured && !conversationStarter && (
                  <div className="text-center py-8 animate-fade-in">
                    {/* Kai Avatar */}
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
                      <Avatar className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/20 shadow-2xl relative z-10">
                        <AvatarImage 
                          src="/lovable-uploads/242d0015-a32d-4eaf-9252-c22dc3e01345.png" 
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
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-lg animate-pulse"></div>
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10 border border-white/20">
                          <AvatarImage 
                            src="/lovable-uploads/242d0015-a32d-4eaf-9252-c22dc3e01345.png" 
                            alt="Kai" 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse border border-white shadow-lg"></div>
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
                
                {/* Listening indicator */}
                {!loading && chatHistory.length > 0 && canInteract && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
                      <span className="font-light">Kai is listening...</span>
                    </div>
                  </div>
                )}
                
                {/* Scroll anchor - this ensures we always scroll to the bottom */}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </ScrollArea>

            {/* Chat Input */}
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
