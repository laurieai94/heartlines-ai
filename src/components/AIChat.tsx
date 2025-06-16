import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import APIKeyInput from "./APIKeyInput";
import BubbleBackground from "./BubbleBackground";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory }: AIChatProps) => {
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true); // Default to true since we have hardcoded config
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  // Check if we have sufficient profile data
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

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, chatHistory);
      
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
    <div className="flex-1 flex flex-col relative">
      <BubbleBackground />
      
      {/* Chat Header */}
      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {userName ? `${userName}'s Relationship Coach (Available 24/7)` : 'Your Relationship Coach (Available 24/7)'}
        </h2>
        <p className="text-gray-600">
          {userName && partnerName ? 
            `Secure AI coaching for ${userName} and ${partnerName} via Supabase backend` :
            'Personalized relationship coaching powered by secure Supabase backend'
          }
        </p>
        
        {/* Profile Status Indicator */}
        {hasProfiles ? (
          <p className="text-sm text-green-600 mt-1">
            ✅ Personalized coaching active - I know {userName} and {partnerName}'s actual dynamic
          </p>
        ) : (
          <p className="text-sm text-amber-600 mt-1">
            ⚠️ Limited profile data - complete your profiles for personalized advice
          </p>
        )}
      </div>

      {/* API Configuration */}
      <div className="mb-4 relative z-10">
        <APIKeyInput onSupabaseConfigured={handleSupabaseConfigured} isConfigured={isConfigured} />
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 p-6 mb-4 bg-white/70 backdrop-blur-lg border-0 shadow-xl overflow-hidden relative z-10">
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4 pr-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-8 max-w-2xl mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-coral-500 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  {hasProfiles && isConfigured ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Hey {userName}! 👋
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        I'm your AI relationship coach powered by Anthropic, and I actually know you and {partnerName}'s dynamic.
                      </p>
                      <div className="bg-gradient-to-r from-pink-50 to-coral-50 rounded-xl p-4 border border-pink-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          I have access to your communication styles, attachment patterns, and relationship background - so this isn't generic advice, it's tailored specifically for how you two work together.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full">
                        <span className="text-sm font-medium text-pink-700">💡 Quick tip:</span>
                        <span className="text-xs text-pink-600">Try asking about a specific situation you're dealing with right now</span>
                      </div>
                    </div>
                  ) : isConfigured && !hasProfiles ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Hey! Welcome to your AI relationship coach 🌟
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        I'm powered by Anthropic AI, but I'll need to learn about you and your partner first to give you personalized advice.
                      </p>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Complete your profiles in the Profile Building tab so I can give you advice that actually fits your specific relationship dynamic.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Welcome to AI Relationship Coaching 🤖💕
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        This app uses Anthropic's Claude AI for personalized relationship advice.
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Add your Anthropic API key above to start receiving AI-powered coaching tailored to your relationship.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {chatHistory.map((message) => (
                <AIChatMessage key={message.id} message={message} />
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md border border-pink-100 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-gray-600 ml-2">
                        {hasProfiles ? 
                          `Anthropic AI is analyzing ${userName} and ${partnerName}'s situation...` :
                          'Anthropic AI is analyzing your situation...'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Chat Input */}
      <div className="relative z-10">
        <AIChatInput 
          onSendMessage={sendMessage} 
          loading={loading || !isConfigured} 
          userName={userName} 
          partnerName={partnerName} 
        />
        {!isConfigured && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Complete the Supabase backend setup above to send messages
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChat;
