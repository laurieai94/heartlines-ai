
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
  const [apiKey, setApiKey] = useState<string | null>(null);

  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  // Check if we have sufficient profile data
  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0 && userName && partnerName;

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      AICoachEngine.setAPIKey(savedApiKey);
    }
  }, []);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('anthropic_api_key', newApiKey);
    AICoachEngine.setAPIKey(newApiKey);
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
            `Real talk relationship coaching for ${userName} and ${partnerName}` :
            'The relationship coach millennials actually want to talk to'
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

      {/* API Key Input */}
      <div className="mb-4 relative z-10">
        <APIKeyInput onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} />
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 p-6 mb-4 bg-white/70 backdrop-blur-lg border-0 shadow-xl overflow-hidden relative z-10">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-coral-200 to-peach-200 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-coral-600" />
                </div>
                {hasProfiles ? (
                  <>
                    <p className="font-medium">
                      Hey {userName}! I'm your AI relationship coach, and I actually know you and {partnerName}'s dynamic.
                    </p>
                    <p className="text-sm mt-2">
                      {apiKey ? 
                        "I'm powered by real AI and have access to your communication styles, attachment patterns, and relationship background - so this isn't generic advice, it's tailored specifically for how you two work together." :
                        "Connect your AI for personalized responses, or use the simulated coach for basic guidance."
                      }
                    </p>
                    <p className="text-xs text-coral-600 mt-3">
                      Try asking about a specific situation you're dealing with right now
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">
                      Hey! I'm your AI relationship coach - but I'll need to learn about you and your partner first.
                    </p>
                    <p className="text-sm mt-2">
                      Complete your profiles in the Profile Building tab so I can give you advice that actually fits your specific relationship dynamic.
                    </p>
                    <p className="text-xs text-coral-600 mt-3">
                      Generic advice sucks - let's make this personal
                    </p>
                  </>
                )}
              </div>
            )}
            
            {chatHistory.map((message) => (
              <AIChatMessage key={message.id} message={message} />
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md border border-coral-100 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-sm text-gray-600 ml-2">
                      {apiKey ? 
                        (hasProfiles ? 
                          `AI is thinking about ${userName} and ${partnerName}'s situation...` :
                          'AI is analyzing your situation...'
                        ) :
                        (hasProfiles ? 
                          `Thinking about ${userName} and ${partnerName}'s situation...` :
                          'Getting real about your situation...'
                        )
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Chat Input */}
      <div className="relative z-10">
        <AIChatInput 
          onSendMessage={sendMessage} 
          loading={loading} 
          userName={userName} 
          partnerName={partnerName} 
        />
      </div>
    </div>
  );
};

export default AIChat;
