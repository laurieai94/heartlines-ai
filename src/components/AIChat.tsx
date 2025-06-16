
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Bot } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import APIKeyInput from "./APIKeyInput";
import ChatHeader from "./ChatHeader";
import BubbleBackground from "./BubbleBackground";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversationTopics } from "@/hooks/useConversationTopics";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory }: AIChatProps) => {
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0 && userName && partnerName;

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Initialize Supabase configuration on mount
  useEffect(() => {
    console.log('Initializing Supabase configuration...');
    const configured = AICoachEngine.initializeSupabase();
    setIsConfigured(configured);
  }, []);

  const handleSupabaseConfigured = (configured: boolean) => {
    setIsConfigured(configured);
  };

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setChatHistory([...chatHistory, newUserMessage]);
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

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      <BubbleBackground />
      
      {/* Chat Header */}
      <div className="relative z-10">
        <ChatHeader 
          userName={userName}
          partnerName={partnerName}
          userAvatarUrl={profile?.avatar_url || undefined}
          hasProfiles={hasProfiles}
        />
      </div>

      {/* API Configuration */}
      <div className="mb-4 relative z-10">
        <APIKeyInput onSupabaseConfigured={handleSupabaseConfigured} isConfigured={isConfigured} />
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 bg-white/60 backdrop-blur-lg border-0 shadow-2xl overflow-hidden relative z-10 rounded-3xl min-h-0">
        <div className="h-full flex flex-col p-6">
          <ScrollArea className="flex-1 mb-6">
            <div className="space-y-2 pr-4">
              {chatHistory.length === 0 && isConfigured && (
                <div className="text-center py-12 max-w-2xl mx-auto">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  {hasProfiles ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Hey {userName}! 👋
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        I'm Kai, your relationship coach. I know you and {partnerName}'s dynamic, so let's dive into what's on your mind.
                      </p>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <p className="text-gray-600 leading-relaxed">
                          💝 I understand your communication styles, attachment patterns, and relationship background - so this is personalized advice just for you two.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Welcome! I'm Kai, your relationship coach 🌟
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        I'm a PhD-level clinical psychologist with 15+ years of experience, powered by advanced AI and ready to help.
                      </p>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                        <p className="text-gray-600 leading-relaxed">
                          Complete your profiles in the Profile Building tab so I can give you advice that truly fits your relationship.
                        </p>
                      </div>
                    </div>
                  )}
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
                  <div className="flex gap-3 mb-6 animate-fade-in">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500">
                      <AvatarFallback className="text-white border-0">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg max-w-[75%]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm font-medium">
                          Kai is thinking about your situation...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Chat Input */}
      <div className="relative z-10 mt-6">
        <AIChatInput 
          onSendMessage={sendMessage} 
          loading={loading || !isConfigured} 
          userName={userName} 
          partnerName={partnerName} 
        />
        {!isConfigured && (
          <p className="text-xs text-gray-500 mt-3 text-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit">
            Complete the setup above to start chatting
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChat;
