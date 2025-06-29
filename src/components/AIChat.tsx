
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
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { saveConversation } = useChatHistory();
  const { accessLevel, canInteract } = useProgressiveAccess();
  const processedStarters = useRef(new Set<string>());

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0 && userName && partnerName;

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Handle conversation starter - improved to avoid duplicates
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract) {
      processedStarters.current.add(conversationStarter);
      sendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract]);

  // Save conversation whenever chat history changes (with debouncing)
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
    <div className="h-full flex flex-col bg-white">
      {/* Messages Area - Takes up available space with proper scrolling */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4 py-6">
            
            {/* Kai's Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && (
              <div className="flex justify-center mb-8">
                <div className="text-center max-w-md">
                  {/* Kai Avatar */}
                  <div className="w-12 h-12 mx-auto mb-4 relative">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white shadow-lg">
                      <AvatarImage 
                        src="/lovable-uploads/242d0015-a32d-4eaf-9252-c22dc3e01345.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Heart className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Ready indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  {/* Welcome Message */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Hey, I'm Kai 👋
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Here to help you figure out the messy, meaningful, and everything-in-between parts of your relationship.
                    </p>
                    <p className="text-gray-600 text-sm">
                      What's going on today?
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chat Messages */}
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <AIChatMessage 
                  key={message.id}
                  message={message} 
                  userAvatarUrl={profile?.avatar_url || undefined}
                  userName={userName}
                />
              ))}
            </div>
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start mt-4">
                <div className="flex gap-3 items-end">
                  <div className="relative">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500">
                      <AvatarImage 
                        src="/lovable-uploads/242d0015-a32d-4eaf-9252-c22dc3e01345.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Thinking indicator */}
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Listening indicator */}
            {!loading && chatHistory.length > 0 && canInteract && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
                  <span>Kai is listening...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto p-4">
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              Complete setup to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
