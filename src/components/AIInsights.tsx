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
  profiles: { your: any[]; partner: any[] };
  demographicsData: { your: any; partner: any };
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

  // Enhanced response system that uses profile data
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Get profile insights for personalized responses
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    
    // Use profile data to personalize responses
    const getPersonalizedResponse = (baseResponse, profileContext = '') => {
      let response = baseResponse;
      
      // Add personalized context if we have profile data
      if (profileContext && (yourProfile || partnerProfile)) {
        response += `\n\n${profileContext}`;
      }
      
      // Add name personalization
      if (userName) {
        response = response.replace(/you/g, userName);
      }
      
      if (partnerName && partnerName !== 'your partner') {
        response = response.replace(/your partner/g, partnerName);
      }
      
      return response;
    };
    
    if (message.includes("support") || message.includes("help")) {
      let profileContext = '';
      if (partnerProfile.loveLanguage) {
        profileContext = `Based on what you've shared, ${partnerName}'s love language is ${partnerProfile.loveLanguage}. Try expressing support through that language.`;
      } else if (partnerProfile.stressResponse) {
        profileContext = `Remember that ${partnerName} tends to ${partnerProfile.stressResponse} when stressed. Adjust your support approach accordingly.`;
      }
      
      return getPersonalizedResponse(
        "Supporting your partner starts with active listening and showing genuine interest in their feelings. Try asking open-ended questions like 'How can I better support you?' and really listen to their response without trying to fix everything immediately.",
        profileContext
      );
    }
    
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let profileContext = '';
      if (yourProfile.conflictStyle && partnerProfile.conflictStyle) {
        profileContext = `Your conflict styles are ${yourProfile.conflictStyle} and ${partnerName} is ${partnerProfile.conflictStyle}. Understanding these differences can help you approach conflicts more effectively.`;
      } else if (partnerProfile.triggers) {
        profileContext = `Be mindful that ${partnerName} is particularly sensitive about ${partnerProfile.triggers}. Approach these topics with extra care.`;
      }
      
      return getPersonalizedResponse(
        "Recurring arguments often happen when underlying needs aren't being met. Try the 'pause and reflect' approach: when you feel tension rising, take a moment to ask yourself what you really need in this situation, then express that need calmly rather than focusing on what your partner is doing wrong.",
        profileContext
      );
    }
    
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      let profileContext = '';
      if (yourProfile.anxietyTriggers) {
        profileContext = `You've mentioned that ${yourProfile.anxietyTriggers} tends to trigger anxiety for you. It's normal to feel this way, and sharing these specific concerns with ${partnerName} can help them understand and support you better.`;
      }
      
      return getPersonalizedResponse(
        "Relationship anxiety is very common and shows you care deeply. Try sharing your feelings with your partner using 'I' statements like 'I feel anxious when...' rather than 'You make me feel...' This opens up conversation rather than creating defensiveness.",
        profileContext
      );
    }
    
    if (message.includes("communication") || message.includes("talk") || message.includes("communicate")) {
      let profileContext = '';
      if (yourProfile.communicationStyle && partnerProfile.communicationStyle) {
        profileContext = `Your communication styles are ${yourProfile.communicationStyle} and ${partnerName} is ${partnerProfile.communicationStyle}. Recognizing these differences can help you adapt your approach for better understanding.`;
      }
      
      return getPersonalizedResponse(
        "Great communication happens when both people feel heard and understood. Try the 'reflect back' technique: after your partner shares something, repeat back what you heard in your own words before responding. This shows you're really listening and helps prevent misunderstandings.",
        profileContext
      );
    }
    
    if (message.includes("love") || message.includes("appreciate")) {
      let profileContext = '';
      if (partnerProfile.loveLanguage) {
        profileContext = `Since ${partnerName}'s love language is ${partnerProfile.loveLanguage}, try expressing appreciation through that language for maximum impact.`;
      }
      
      return getPersonalizedResponse(
        "Expressing appreciation is one of the most powerful relationship tools. Try being specific about what you appreciate - instead of 'thanks for helping,' try 'I really appreciated how you took care of the dishes without me asking. It made me feel supported and cared for.'",
        profileContext
      );
    }
    
    // Default response with personalization
    return getPersonalizedResponse(
      "That sounds like something important to you. Relationships thrive on understanding, patience, and open communication. What feels most challenging about this situation right now? Remember, every relationship has ups and downs - what matters is how you navigate them together."
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
