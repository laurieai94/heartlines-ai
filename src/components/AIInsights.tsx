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

interface PersonContext {
  relationship: {
    length?: string;
    livingTogether?: boolean;
    stage?: string;
  };
  yourTraits: {
    name?: string;
    loveLanguage?: string;
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string;
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
  };
  partnerTraits: {
    name?: string;
    loveLanguage?: string;
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string;
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
  };
  dynamics: {
    loveLanguageMatch?: boolean;
    loveLanguageGap?: boolean;
    communicationMatch?: boolean;
    conflictDynamic?: string;
  };
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

  // Extract specific person details
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const yourProfile = profiles.your[0] || {};
  const partnerProfile = profiles.partner[0] || {};
  const yourDemographics = demographicsData.your || {};
  const partnerDemographics = demographicsData.partner || {};

  // Build comprehensive person-specific context
  const buildPersonContext = (): PersonContext => {
    let context: PersonContext = {
      relationship: {},
      yourTraits: {},
      partnerTraits: {},
      dynamics: {}
    };

    // Relationship context
    if (yourDemographics.relationshipLength) {
      context.relationship.length = yourDemographics.relationshipLength;
    }
    if (yourDemographics.livingTogether !== undefined) {
      context.relationship.livingTogether = yourDemographics.livingTogether;
    }
    if (yourDemographics.relationshipStage) {
      context.relationship.stage = yourDemographics.relationshipStage;
    }

    // Your specific traits
    context.yourTraits = {
      name: userName,
      loveLanguage: yourProfile.loveLanguage,
      communicationStyle: yourProfile.communicationStyle,
      conflictStyle: yourProfile.conflictStyle,
      stressResponse: yourProfile.stressResponse,
      attachmentStyle: yourProfile.attachmentStyle,
      triggers: yourProfile.triggers || [],
      strengths: yourProfile.strengths || [],
      growthAreas: yourProfile.growthAreas || []
    };

    // Partner specific traits
    context.partnerTraits = {
      name: partnerName,
      loveLanguage: partnerProfile.loveLanguage,
      communicationStyle: partnerProfile.communicationStyle,
      conflictStyle: partnerProfile.conflictStyle,
      stressResponse: partnerProfile.stressResponse,
      attachmentStyle: partnerProfile.attachmentStyle,
      triggers: partnerProfile.triggers || [],
      strengths: partnerProfile.strengths || [],
      growthAreas: partnerProfile.growthAreas || []
    };

    // Analyze dynamics between specific people
    if (yourProfile.loveLanguage && partnerProfile.loveLanguage) {
      context.dynamics.loveLanguageMatch = yourProfile.loveLanguage === partnerProfile.loveLanguage;
      context.dynamics.loveLanguageGap = yourProfile.loveLanguage !== partnerProfile.loveLanguage;
    }

    if (yourProfile.communicationStyle && partnerProfile.communicationStyle) {
      context.dynamics.communicationMatch = yourProfile.communicationStyle === partnerProfile.communicationStyle;
    }

    if (yourProfile.conflictStyle && partnerProfile.conflictStyle) {
      context.dynamics.conflictDynamic = `${yourProfile.conflictStyle}-${partnerProfile.conflictStyle}`;
    }

    return context;
  };

  // Enhanced response system with deep personalization
  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    const context = buildPersonContext();
    
    // Use actual names when available
    const youName = userName || 'you';
    const theirName = partnerName || 'your partner';
    
    const buildPersonalizedResponse = (baseResponse: string, specificAdvice = '') => {
      let response = baseResponse;
      
      // Add specific advice based on their unique profiles
      if (specificAdvice) {
        response += `\n\n${specificAdvice}`;
      }
      
      // Add relationship-specific context
      if (context.relationship.length) {
        response += `\n\n**Given that ${youName} and ${theirName} have been together for ${context.relationship.length}**, this is a crucial time to deepen your understanding of each other.`;
      }
      
      // Add living situation context
      if (context.relationship.livingTogether === true) {
        response += ` Living together adds another layer to navigate - daily interactions matter even more.`;
      } else if (context.relationship.livingTogether === false) {
        response += ` Since you don't live together yet, focus on quality communication during your time apart.`;
      }
      
      return response;
    };

    // Highly specific responses based on their actual traits
    if (message.includes("support") || message.includes("help")) {
      let specificAdvice = '';
      
      if (context.partnerTraits.loveLanguage) {
        const partnerLove = context.partnerTraits.loveLanguage;
        if (partnerLove === 'acts_of_service') {
          specificAdvice = `${theirName}'s love language is acts of service. Instead of just asking "how can I help?", observe what ${theirName} does for others and do those same things for them. Take care of tasks they mention or struggle with without being asked.`;
        } else if (partnerLove === 'words_of_affirmation') {
          specificAdvice = `${theirName} thrives on words of affirmation. Be specific: instead of "you're great," try "${theirName}, I really admire how you handled that situation today. It showed your strength and thoughtfulness."`;
        } else if (partnerLove === 'quality_time') {
          specificAdvice = `${theirName}'s love language is quality time. Put away distractions and be fully present. Even 15 minutes of undivided attention will mean more than hours of distracted togetherness.`;
        } else if (partnerLove === 'physical_touch') {
          specificAdvice = `${theirName} feels loved through physical touch. Small gestures matter - a hand on their shoulder, holding hands while talking, or a hug when they're stressed will provide comfort.`;
        } else if (partnerLove === 'receiving_gifts') {
          specificAdvice = `${theirName} appreciates receiving gifts. Focus on thoughtfulness over expense - something that shows you were thinking of them or remembered something they mentioned.`;
        }
      }
      
      if (context.partnerTraits.stressResponse) {
        specificAdvice += ` When ${theirName} is stressed, they tend to ${context.partnerTraits.stressResponse}. Adjust your support approach accordingly.`;
      }
      
      return buildPersonalizedResponse(
        `Supporting ${theirName} effectively means understanding their unique patterns and needs.`,
        specificAdvice
      );
    }
    
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let specificAdvice = '';
      
      if (context.dynamics.conflictDynamic) {
        const yourStyle = context.yourTraits.conflictStyle;
        const theirStyle = context.partnerTraits.conflictStyle;
        
        if (yourStyle === 'confrontational' && theirStyle === 'avoidant') {
          specificAdvice = `${youName}, you're confrontational while ${theirName} is avoidant. This creates a pursue-withdraw cycle. Try approaching ${theirName} more gently: "I'd like to understand your perspective on something when you're ready to talk about it."`;
        } else if (yourStyle === 'avoidant' && theirStyle === 'confrontational') {
          specificAdvice = `${theirName} is confrontational while you're avoidant, ${youName}. They need to process out loud while you need time to think. Try: "This is important to me too. Can we set a time to discuss this after I've had time to process?"`;
        } else if (yourStyle === theirStyle && yourStyle === 'confrontational') {
          specificAdvice = `Both ${youName} and ${theirName} are confrontational. You both want to be heard immediately, which can escalate quickly. Take turns: one person speaks for 2 minutes uninterrupted, then switch.`;
        } else if (yourStyle === theirStyle && yourStyle === 'avoidant') {
          specificAdvice = `Both ${youName} and ${theirName} avoid conflict. Important issues may go unaddressed. Schedule regular "relationship check-ins" to discuss things before they build up.`;
        }
      }
      
      if (context.partnerTraits.triggers && context.partnerTraits.triggers.length > 0) {
        specificAdvice += ` Be especially careful about ${theirName}'s triggers: ${context.partnerTraits.triggers.join(', ')}. Approach these topics with extra validation.`;
      }
      
      return buildPersonalizedResponse(
        `Conflicts between ${youName} and ${theirName} follow predictable patterns once you understand each other's styles.`,
        specificAdvice
      );
    }
    
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      let specificAdvice = '';
      
      if (context.yourTraits.attachmentStyle) {
        if (context.yourTraits.attachmentStyle === 'anxious') {
          specificAdvice = `${youName}, with your anxious attachment style, you likely need more reassurance than ${theirName} naturally provides. Be direct: "I'm feeling insecure about us right now and could use some reassurance."`;
        } else if (context.yourTraits.attachmentStyle === 'avoidant') {
          specificAdvice = `${youName}, your avoidant attachment style makes you pull away when anxious. ${theirName} might interpret this as rejection. Try sharing: "I'm feeling overwhelmed and need some space, but this isn't about you."`;
        }
      }
      
      if (context.yourTraits.stressResponse) {
        specificAdvice += ` When you're stressed, ${youName}, you tend to ${context.yourTraits.stressResponse}. Let ${theirName} know this pattern so they can support you better.`;
      }
      
      return buildPersonalizedResponse(
        `${youName}, your anxiety about the relationship with ${theirName} shows how much you care.`,
        specificAdvice
      );
    }
    
    if (message.includes("communication") || message.includes("talk")) {
      let specificAdvice = '';
      
      if (context.dynamics.communicationMatch === false) {
        const yourStyle = context.yourTraits.communicationStyle;
        const theirStyle = context.partnerTraits.communicationStyle;
        specificAdvice = `${youName}, you're ${yourStyle} while ${theirName} is ${theirStyle}. Try adapting to their style occasionally - if they're direct and you're indirect, be more straightforward. If they're detailed and you're brief, give more context.`;
      } else if (context.dynamics.communicationMatch === true) {
        specificAdvice = `${youName} and ${theirName} both have a ${context.yourTraits.communicationStyle} communication style. While this creates understanding, watch for blind spots that come with similarity.`;
      }
      
      return buildPersonalizedResponse(
        `Communication between ${youName} and ${theirName} can be improved by understanding each other's natural styles.`,
        specificAdvice
      );
    }
    
    if (message.includes("love") || message.includes("appreciate")) {
      let specificAdvice = '';
      
      if (context.dynamics.loveLanguageMatch === true) {
        specificAdvice = `${youName} and ${theirName} both have ${context.yourTraits.loveLanguage} as your love language. This is a strength - you naturally understand how to love each other.`;
      } else if (context.dynamics.loveLanguageGap === true) {
        const yourLang = context.yourTraits.loveLanguage;
        const theirLang = context.partnerTraits.loveLanguage;
        specificAdvice = `${youName}, your love language is ${yourLang} while ${theirName}'s is ${theirLang}. Express love in their language for maximum impact, and teach them about yours.`;
      }
      
      return buildPersonalizedResponse(
        `Showing love effectively between ${youName} and ${theirName} means being specific and intentional.`,
        specificAdvice
      );
    }
    
    // Default response with their specific context
    let contextualResponse = `${youName}, every relationship has unique challenges and strengths.`;
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      contextualResponse += ` Your relationship strengths include ${context.yourTraits.strengths.join(', ')}.`;
    }
    
    if (context.relationship.length) {
      contextualResponse += ` After ${context.relationship.length} together, you and ${theirName} are building something meaningful.`;
    }
    
    return buildPersonalizedResponse(
      contextualResponse,
      "What feels most challenging about this situation right now? Remember, growth happens when both people feel safe to be vulnerable."
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
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickStarter = (starter: string) => {
    setCurrentMessage(starter);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          <p className="text-gray-600">
            {userName && partnerName ? 
              `Here to help ${userName} and ${partnerName} build a stronger relationship` :
              'Here to listen, understand, and guide'
            }
          </p>
          {(profiles.your.length > 0 || profiles.partner.length > 0) && (
            <p className="text-sm text-coral-600 mt-1">
              💡 {userName && partnerName ? 
                `Personalized advice based on ${userName} and ${partnerName}'s profiles` :
                'Personalized advice based on your profiles'
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
                  <p>
                    {userName ? 
                      `${userName}, I'm here and ready to help you and ${partnerName || 'your partner'}.` :
                      'Your relationship coach is here and ready to listen.'
                    }
                  </p>
                  <p className="text-sm">Share what's on your mind about your relationship.</p>
                  {(profiles.your.length > 0 || profiles.partner.length > 0) && (
                    <p className="text-xs text-coral-600 mt-2">
                      {userName && partnerName ?
                        `I know about ${userName} and ${partnerName}'s relationship patterns` :
                        'I have your profile information to give you personalized advice'
                      }
                    </p>
                  )}
                </div>
              )}
              
              {/* ... keep existing code (chat history rendering and loading indicator) */}
              {chatHistory.map((message: any) => (
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
            placeholder={userName && partnerName ? 
              `Tell me about you and ${partnerName}...` :
              "What's on your mind about your relationship?"
            }
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
              <h3 className="font-medium text-gray-900">
                {userName && partnerName ? 'People I Know' : 'Profile Connected'}
              </h3>
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
                  <span>{partnerName || 'Partner'} profile active</span>
                </div>
              )}
            </div>
            {userName && partnerName && (
              <p className="text-xs text-coral-600 mt-2">
                I understand {userName} and {partnerName}'s unique dynamic
              </p>
            )}
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
