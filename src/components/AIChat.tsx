import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory }: AIChatProps) => {
  const [loading, setLoading] = useState(false);

  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setChatHistory([...chatHistory, newUserMessage]);
    setLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      const aiResponse = AICoachEngine.getAIResponse(userMessage, context);
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {userName ? `${userName}'s Relationship Coach (Available 24/7)` : 'Your Relationship Coach (Available 24/7)'}
        </h2>
        <p className="text-gray-600">
          {userName && partnerName ? 
            `Real talk relationship coaching for ${userName} and ${partnerName}` :
            'The relationship coach millennials actually want to talk to'
          }
        </p>
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <p className="text-sm text-coral-600 mt-1">
            💡 {userName && partnerName ? 
              `Personalized coaching using ${userName} and ${partnerName}'s profiles - I actually know your dynamic` :
              'Coaching that knows your actual relationship patterns, not generic advice'
            }
          </p>
        )}
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 p-4 mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-coral-400" />
                <p className="font-medium">
                  {userName ? 
                    `Hey ${userName}! I'm your AI relationship coach - think of me as that friend who went to therapy, read all the books, and actually has their shit together.` :
                    'Hey! I\'m your AI relationship coach - the one millennials actually want to talk to.'
                  }
                </p>
                <p className="text-sm mt-2">
                  {userName && partnerName ?
                    `I know about ${userName} and ${partnerName}'s dynamic, and I'm here to give you real, actionable advice that actually works for your situation.` :
                    'I have access to your relationship profiles, so this isn\'t generic advice - it\'s tailored to your actual patterns and needs.'
                  }
                </p>
                <p className="text-xs text-coral-600 mt-3">
                  Evidence-based coaching that doesn't feel like reading a psychology textbook
                </p>
              </div>
            )}
            
            {chatHistory.map((message) => (
              <AIChatMessage key={message.id} message={message} />
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-sm text-gray-600 ml-2">Getting real about your situation...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Chat Input */}
      {chatHistory.length === 0 ? (
        <AIChatInput 
          onSendMessage={sendMessage} 
          loading={loading} 
          userName={userName} 
          partnerName={partnerName} 
        />
      ) : (
        <AIChatInput 
          onSendMessage={sendMessage} 
          loading={loading} 
          userName={userName} 
          partnerName={partnerName} 
        />
      )}
    </div>
  );
};

export default AIChat;
