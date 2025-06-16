import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Heart, Lightbulb, User } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface AIInsightsProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickStarters = [
    "How can I support my partner better?",
    "We keep having the same argument...",
    "I'm feeling anxious about us..."
  ];

  const recentTopics = [
    "Communication patterns",
    "Supporting each other", 
    "Managing stress together"
  ];

  // Get user and partner names from demographics
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || 'your partner';

  // Enhanced response system that deeply uses profile data
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Get comprehensive profile insights for personalized responses
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemographics = demographicsData.your || {};
    const partnerDemographics = demographicsData.partner || {};
    
    // Build comprehensive context from all available data
    const buildPersonalizedContext = () => {
      let context = [];
      
      // Your profile insights
      if (yourProfile.loveLanguage) {
        context.push(`Your love language is ${yourProfile.loveLanguage}`);
      }
      if (yourProfile.communicationStyle) {
        context.push(`You communicate in a ${yourProfile.communicationStyle} style`);
      }
      if (yourProfile.conflictStyle) {
        context.push(`During conflicts, you tend to be ${yourProfile.conflictStyle}`);
      }
      if (yourProfile.stressResponse) {
        context.push(`When stressed, you typically ${yourProfile.stressResponse}`);
      }
      if (yourProfile.attachmentStyle) {
        context.push(`Your attachment style is ${yourProfile.attachmentStyle}`);
      }
      
      // Partner profile insights
      if (partnerProfile.loveLanguage) {
        context.push(`${partnerName}'s love language is ${partnerProfile.loveLanguage}`);
      }
      if (partnerProfile.communicationStyle) {
        context.push(`${partnerName} communicates in a ${partnerProfile.communicationStyle} style`);
      }
      if (partnerProfile.conflictStyle) {
        context.push(`During conflicts, ${partnerName} tends to be ${partnerProfile.conflictStyle}`);
      }
      if (partnerProfile.stressResponse) {
        context.push(`When stressed, ${partnerName} typically ${partnerProfile.stressResponse}`);
      }
      if (partnerProfile.attachmentStyle) {
        context.push(`${partnerName}'s attachment style is ${partnerProfile.attachmentStyle}`);
      }
      
      // Demographics context
      if (yourDemographics.relationshipLength) {
        context.push(`You've been together for ${yourDemographics.relationshipLength}`);
      }
      if (yourDemographics.livingTogether) {
        context.push(`You ${yourDemographics.livingTogether ? 'live together' : 'don\'t live together yet'}`);
      }
      
      return context;
    };
    
    const personalContext = buildPersonalizedContext();
    
    // Generate highly personalized responses based on context
    const getPersonalizedResponse = (baseResponse, specificContext = '') => {
      let response = baseResponse;
      
      // Add specific profile-based advice
      if (specificContext) {
        response += `\n\n${specificContext}`;
      }
      
      // Add general profile context if we have it
      if (personalContext.length > 0) {
        response += `\n\n**Based on your profiles:** ${personalContext.slice(0, 2).join(', ')}.`;
      }
      
      // Add name personalization
      if (userName) {
        response = response.replace(/\byou\b/g, userName);
      }
      
      if (partnerName && partnerName !== 'your partner') {
        response = response.replace(/your partner/g, partnerName);
      }
      
      return response;
    };
    
    // Highly contextual responses based on message content and profiles
    if (message.includes("support") || message.includes("help")) {
      let specificContext = '';
      
      if (partnerProfile.loveLanguage) {
        if (partnerProfile.loveLanguage === 'acts_of_service') {
          specificContext = `Since ${partnerName}'s love language is acts of service, the most supportive thing you can do is take care of tasks that matter to them without being asked.`;
        } else if (partnerProfile.loveLanguage === 'words_of_affirmation') {
          specificContext = `Since ${partnerName}'s love language is words of affirmation, verbal encouragement and specific appreciation will be most supportive.`;
        } else if (partnerProfile.loveLanguage === 'quality_time') {
          specificContext = `Since ${partnerName}'s love language is quality time, being fully present and engaged when together is the best support.`;
        } else if (partnerProfile.loveLanguage === 'physical_touch') {
          specificContext = `Since ${partnerName}'s love language is physical touch, appropriate physical comfort and affection will be most supportive.`;
        } else if (partnerProfile.loveLanguage === 'receiving_gifts') {
          specificContext = `Since ${partnerName}'s love language is receiving gifts, thoughtful tokens of care will be most meaningful.`;
        }
      } else if (partnerProfile.stressResponse) {
        specificContext = `When ${partnerName} is stressed, they tend to ${partnerProfile.stressResponse}. Adjust your support approach to match this pattern.`;
      }
      
      return getPersonalizedResponse(
        "Supporting your partner effectively means understanding their unique needs and communication style. Start by asking them directly what kind of support would be most helpful right now, then listen without trying to fix everything immediately.",
        specificContext
      );
    }
    
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let specificContext = '';
      
      if (yourProfile.conflictStyle && partnerProfile.conflictStyle) {
        if (yourProfile.conflictStyle === 'confrontational' && partnerProfile.conflictStyle === 'avoidant') {
          specificContext = `Your conflict styles are very different - you're confrontational while ${partnerName} is avoidant. Try approaching discussions more gently and give them time to process before expecting responses.`;
        } else if (yourProfile.conflictStyle === 'avoidant' && partnerProfile.conflictStyle === 'confrontational') {
          specificContext = `${partnerName} is confrontational while you're avoidant. They likely need to talk things through immediately while you need processing time. Try setting a specific time to discuss after you've had time to think.`;
        } else if (yourProfile.conflictStyle === partnerProfile.conflictStyle) {
          specificContext = `You both have a ${yourProfile.conflictStyle} conflict style, which can amplify tensions. Be aware of this similarity and take turns stepping back to break the cycle.`;
        }
      } else if (partnerProfile.triggers && partnerProfile.triggers.length > 0) {
        specificContext = `Be especially mindful that ${partnerName} is sensitive about ${partnerProfile.triggers}. Approach these topics with extra care and validation.`;
      }
      
      return getPersonalizedResponse(
        "Recurring arguments often signal unmet needs or different communication styles. Try the 'pause and reflect' approach: when tension rises, ask yourself what you really need in this moment, then express that need calmly rather than focusing on what went wrong.",
        specificContext
      );
    }
    
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      let specificContext = '';
      
      if (yourProfile.attachmentStyle) {
        if (yourProfile.attachmentStyle === 'anxious') {
          specificContext = `With an anxious attachment style, it's normal to need extra reassurance. Consider sharing this with ${partnerName} so they can provide the specific comfort you need.`;
        } else if (yourProfile.attachmentStyle === 'avoidant') {
          specificContext = `Your avoidant attachment style might make you withdraw when anxious. Try to communicate your needs to ${partnerName} rather than pulling away.`;
        }
      } else if (yourProfile.stressResponse) {
        specificContext = `When you're stressed, you tend to ${yourProfile.stressResponse}. Recognizing this pattern can help you communicate your needs more clearly to ${partnerName}.`;
      }
      
      return getPersonalizedResponse(
        "Relationship anxiety shows you care deeply about your connection. Share your specific worries with your partner using 'I' statements like 'I feel anxious when...' This opens dialogue rather than creating defensiveness.",
        specificContext
      );
    }
    
    if (message.includes("communication") || message.includes("talk") || message.includes("communicate")) {
      let specificContext = '';
      
      if (yourProfile.communicationStyle && partnerProfile.communicationStyle) {
        if (yourProfile.communicationStyle !== partnerProfile.communicationStyle) {
          specificContext = `Your communication styles differ - you're ${yourProfile.communicationStyle} while ${partnerName} is ${partnerProfile.communicationStyle}. Try adapting to their style occasionally for better understanding.`;
        } else {
          specificContext = `You both have a ${yourProfile.communicationStyle} communication style, which can be great for understanding but watch for blind spots that come with similarity.`;
        }
      } else if (partnerProfile.communicationPreferences) {
        specificContext = `${partnerName} prefers ${partnerProfile.communicationPreferences} when communicating. Adapting to this can improve your conversations significantly.`;
      }
      
      return getPersonalizedResponse(
        "Effective communication happens when both people feel heard and understood. Try the 'reflect back' technique: after your partner shares something, repeat what you heard in your own words before responding.",
        specificContext
      );
    }
    
    if (message.includes("love") || message.includes("appreciate") || message.includes("affection")) {
      let specificContext = '';
      
      if (partnerProfile.loveLanguage && yourProfile.loveLanguage) {
        if (partnerProfile.loveLanguage === yourProfile.loveLanguage) {
          specificContext = `You both share the same love language (${partnerProfile.loveLanguage}), which makes expressing love easier once you both understand this strength.`;
        } else {
          specificContext = `Your love languages are different - yours is ${yourProfile.loveLanguage} while ${partnerName}'s is ${partnerProfile.loveLanguage}. Try expressing love in their language for maximum impact.`;
        }
      } else if (partnerProfile.loveLanguage) {
        specificContext = `Focus on ${partnerName}'s love language (${partnerProfile.loveLanguage}) when showing appreciation for the greatest emotional impact.`;
      }
      
      return getPersonalizedResponse(
        "Expressing appreciation effectively means being specific about what you value. Instead of 'thanks for helping,' try 'I really appreciated how you handled that situation. It made me feel supported and cared for.'",
        specificContext
      );
    }
    
    // Default response with comprehensive personalization
    let defaultContext = '';
    if (personalContext.length > 0) {
      defaultContext = `Given what I know about you both - ${personalContext.slice(0, 3).join(', ')} - I'd suggest focusing on understanding each other's perspectives first.`;
    }
    
    return getPersonalizedResponse(
      "That sounds important to you. Every relationship has its unique challenges and strengths. What feels most difficult about this situation right now? Remember, growth happens when both people feel safe to be vulnerable.",
      defaultContext
    );
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleQuickStarter = (starter) => {
    setCurrentMessage(starter);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Main Chat Interface - 75% */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {userName ? `${userName}'s Relationship Coach (Available 24/7)` : 'Your Relationship Coach (Available 24/7)'}
          </h2>
          <p className="text-gray-600">Here to listen, understand, and guide</p>
          {(profiles.your.length > 0 || profiles.partner.length > 0) && (
            <p className="text-sm text-coral-600 mt-1">
              💡 Personalized advice based on your profiles
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
                  <p>
                    {userName ? `${userName}, your` : 'Your'} relationship coach is here and ready to listen.
                  </p>
                  <p className="text-sm">Share what's on your mind about your relationship.</p>
                  {profiles.your.length > 0 && (
                    <p className="text-xs text-coral-600 mt-2">
                      I have your profile information to give you personalized advice
                    </p>
                  )}
                </div>
              )}
              
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-coral-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Starters */}
        {chatHistory.length === 0 && (
          <div className="mb-4">
            <div className="flex gap-2 flex-wrap">
              {quickStarters.map((starter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickStarter(starter)}
                  className="text-coral-700 border-coral-200 hover:bg-coral-50 hover:text-coral-800"
                >
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's on your mind about your relationship?"
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || loading}
            className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Minimal Sidebar - 25% */}
      <div className="w-80 space-y-4">
        {/* Profile Status */}
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-4 h-4 text-coral-600" />
              <h3 className="font-medium text-gray-900">Profile Connected</h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              {profiles.your.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{userName || 'Your'} profile active</span>
                </div>
              )}
              {profiles.partner.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{partnerName} profile active</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Status Check */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="font-medium text-gray-900">Your AI Coach Status</h3>
          </div>
          <p className="text-sm text-gray-600">Ready to chat</p>
        </Card>

        {/* Trust Signal */}
        <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Private & Secure</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your conversations stay between you and your AI coach
          </p>
        </Card>

        {/* Recent Topics */}
        {chatHistory.length > 0 && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-medium text-gray-900 mb-3">We've talked about</h3>
            <div className="space-y-2">
              {recentTopics.slice(0, 3).map((topic, index) => (
                <Badge key={index} variant="outline" className="w-full justify-start border-coral-200 text-coral-700">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {topic}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
