
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Bot } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import BubbleBackground from "./BubbleBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { Button } from "@/components/ui/button";

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
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const processedStarters = useRef(new Set<string>());

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0 && userName && partnerName;

  // Conversation starters - moved from sidebar to chat interface
  const conversationStarters = [
    "I feel like we're not connecting lately",
    "We keep having the same fight over and over",
    "I want to improve our communication",
    "Are we growing apart?",
    "I miss how we used to be",
    "I want to get back what we had.",
    "How can we be more supportive of each other?"
  ];

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Handle conversation starter - improved to avoid duplicates
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured) {
      processedStarters.current.add(conversationStarter);
      sendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured]);

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleString()
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
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toLocaleString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterClick = (starter: string) => {
    if (isConfigured) {
      sendMessage(starter);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0 bg-gradient-to-br from-coral-50/30 via-peach-50/20 to-pink-50/30 rounded-3xl p-6">
      <BubbleBackground />

      {/* Main Chat Area */}
      <div className="flex-1 bg-white/70 backdrop-blur-lg border-0 shadow-2xl overflow-hidden relative z-10 rounded-3xl min-h-0 flex flex-col">
        <div className="flex-1 p-8 flex flex-col">
          <ScrollArea className="flex-1 mb-6">
            <div className="space-y-3 pr-4">
              {chatHistory.length === 0 && isConfigured && !conversationStarter && (
                <div className="text-center py-12 max-w-xl mx-auto">
                  {/* Enhanced Hero Section */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-coral-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl relative">
                      <Heart className="w-10 h-10 text-white animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral-400 to-pink-500 animate-pulse opacity-30"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-coral-50 via-peach-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Hey! I'm Kai. Tell me what's happening with you two, and let's figure this out together.
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      What's on your mind about your relationship?
                    </p>
                  </div>
                  
                  {/* Conversation Starters */}
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Or start with one of these:</p>
                    <div className="grid gap-3">
                      {conversationStarters.map((starter, index) => (
                        <Card
                          key={index}
                          className="p-4 cursor-pointer bg-white/60 border-coral-200/50 hover:bg-coral-50 hover:border-coral-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                          onClick={() => handleStarterClick(starter)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-coral-700 transition-colors text-left">
                              "{starter}"
                            </p>
                            <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center group-hover:bg-coral-200 transition-colors">
                              <Heart className="w-4 h-4 text-coral-600" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {chatHistory.map((message) => (
                <AIChatMessage 
                  key={message.id} 
                  message={message} 
                  userAvatarUrl={profile?.avatar_url || undefined}
                  userName={userName}
                />
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-4 mb-6 animate-fade-in">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-coral-400 to-pink-500 shadow-lg">
                      <AvatarImage 
                        src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="text-white border-0">
                        <Bot className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-br from-coral-500 to-pink-500 text-white rounded-3xl rounded-bl-lg px-6 py-4 shadow-xl max-w-[75%]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm font-medium">
                          Kai is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Enhanced Chat Input */}
          <div className="relative z-10">
            <AIChatInput 
              onSendMessage={sendMessage} 
              loading={loading || !isConfigured} 
              userName={userName} 
              partnerName={partnerName} 
            />
            {!isConfigured && (
              <p className="text-sm text-gray-500 mt-4 text-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 mx-auto w-fit shadow-lg">
                Complete the setup in the sidebar to start chatting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
