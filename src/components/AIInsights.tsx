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

  // Professional AI Relationship Coach Response System
  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    const context = buildPersonContext();
    
    // Use actual names when available
    const youName = userName || 'you';
    const theirName = partnerName || 'your partner';
    
    // Professional coaching response framework
    const buildCoachingResponse = (
      acknowledgment: string,
      patternAnalysis: string,
      insight: string,
      strategies: string[],
      nextSteps: string
    ) => {
      let response = `**Acknowledgment & Validation:**\n${acknowledgment}\n\n`;
      response += `**Pattern Analysis:**\n${patternAnalysis}\n\n`;
      response += `**Insight:**\n${insight}\n\n`;
      response += `**Strategies:**\n`;
      strategies.forEach((strategy, index) => {
        response += `${index + 1}. ${strategy}\n`;
      });
      response += `\n**Next Steps:**\n${nextSteps}`;
      
      return response;
    };

    // Support and care responses
    if (message.includes("support") || message.includes("help")) {
      const acknowledgment = `I can see you want to be the best partner possible for ${theirName}, which shows how much you care about your relationship.`;
      
      let patternAnalysis = `Based on what I know about both of you, `;
      if (context.partnerTraits.loveLanguage && context.yourTraits.loveLanguage) {
        if (context.dynamics.loveLanguageMatch) {
          patternAnalysis += `you both share ${context.partnerTraits.loveLanguage} as your love language, which is a real strength. You naturally understand how to love each other.`;
        } else {
          patternAnalysis += `${theirName}'s love language is ${context.partnerTraits.loveLanguage} while yours is ${context.yourTraits.loveLanguage}. This difference means you might be showing love in your language instead of theirs.`;
        }
      } else {
        patternAnalysis += `understanding each person's unique needs is key to providing effective support.`;
      }

      let insight = `Support isn't one-size-fits-all. What feels supportive to you might not be what ${theirName} needs most. `;
      if (context.partnerTraits.stressResponse) {
        insight += `When stressed, ${theirName} tends to ${context.partnerTraits.stressResponse}, so your support approach should account for this pattern.`;
      }

      const strategies = [];
      if (context.partnerTraits.loveLanguage === 'acts_of_service') {
        strategies.push(`**Acts of Service Focus:** Look for tasks that ${theirName} finds stressful or time-consuming and handle them without being asked. Pay attention to what they do for others and reciprocate.`);
      } else if (context.partnerTraits.loveLanguage === 'words_of_affirmation') {
        strategies.push(`**Verbal Affirmation:** Be specific with your appreciation. Instead of "you're great," try "${theirName}, I really admire how you handled [specific situation]. It showed your [specific quality]."`);
      } else if (context.partnerTraits.loveLanguage === 'quality_time') {
        strategies.push(`**Focused Attention:** Put away distractions and be fully present. Even 15 minutes of undivided attention will mean more than hours of distracted togetherness.`);
      } else {
        strategies.push(`**Learn Their Language:** Pay attention to how ${theirName} naturally shows love to others - that's likely how they want to receive it too.`);
      }

      strategies.push(`**Ask Directly:** "${theirName}, I want to support you better. What would feel most helpful to you right now?" This shows care while gathering important information.`);
      
      if (context.partnerTraits.communicationStyle) {
        strategies.push(`**Match Their Style:** Since ${theirName} is ${context.partnerTraits.communicationStyle}, adapt your approach accordingly. Direct communicators appreciate straightforward offers, while indirect communicators might prefer gentle observations.`);
      }

      const nextSteps = `Today, observe one thing that seems to stress ${theirName} and either handle it for them or ask specifically how you can help with it. Notice their reaction and adjust your approach based on what you learn.`;

      return buildCoachingResponse(acknowledgment, patternAnalysis, insight, strategies, nextSteps);
    }

    // Conflict and argument responses
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let acknowledgment = `Recurring arguments are frustrating and emotionally draining. It makes sense that you're looking for a way to break this cycle with ${theirName}.`;

      let patternAnalysis = `From what I know about you both, `;
      if (context.dynamics.conflictDynamic) {
        const yourStyle = context.yourTraits.conflictStyle;
        const theirStyle = context.partnerTraits.conflictStyle;
        
        if (yourStyle === 'confrontational' && theirStyle === 'avoidant') {
          patternAnalysis += `you tend to be confrontational while ${theirName} is avoidant. This creates a classic pursue-withdraw cycle where your directness triggers their need to retreat, which then increases your urgency to resolve things.`;
        } else if (yourStyle === 'avoidant' && theirStyle === 'confrontational') {
          patternAnalysis += `${theirName} is confrontational while you're avoidant. They need to process out loud while you need time to think, creating tension when timing doesn't align.`;
        } else if (yourStyle === theirStyle && yourStyle === 'confrontational') {
          patternAnalysis += `you're both confrontational, which means you both want to be heard immediately. This can escalate quickly when you're both activated.`;
        } else {
          patternAnalysis += `your conflict styles create a specific dynamic that we can work with once we understand the underlying pattern.`;
        }
      } else {
        patternAnalysis += `there's likely an underlying pattern to these arguments that goes beyond the surface topic.`;
      }

      const insight = `Most recurring arguments aren't really about the topic you're discussing - they're about unmet underlying needs. The content changes, but the emotional pattern stays the same. Understanding your attachment styles and triggers can help break this cycle.`;

      const strategies = [];
      
      if (context.yourTraits.conflictStyle === 'confrontational' && context.partnerTraits.conflictStyle === 'avoidant') {
        strategies.push(`**Gentle Approach:** Try: "${theirName}, I'd like to understand your perspective on something when you're ready to talk about it. No rush, but it's important to me." This reduces their defensive response.`);
        strategies.push(`**Time Buffer:** Give ${theirName} advance notice about difficult conversations. "I'd like to discuss [topic] sometime this week. When would feel good for you?"`);
      } else if (context.yourTraits.conflictStyle === 'avoidant' && context.partnerTraits.conflictStyle === 'confrontational') {
        strategies.push(`**Bridge Statement:** "This is important to me too, and I want to give it the attention it deserves. Can we set a time to discuss this after I've had some time to process?"`);
        strategies.push(`**Reassurance:** Let ${theirName} know that your need for time isn't rejection: "I need to think about this, but that doesn't mean I don't care or that I'm dismissing your concerns."`);
      } else {
        strategies.push(`**Pause Pattern:** When you feel the familiar escalation, try: "I can feel us getting into our usual pattern. Can we take a 20-minute break and come back to this?"`);
      }

      strategies.push(`**Underlying Needs:** Before discussing the topic, each person shares: "What I really need right now is..." This addresses the emotion behind the content.`);

      const nextSteps = `The next time you feel an argument starting, try to identify what need each of you is trying to meet. Focus on that need rather than being "right" about the surface issue.`;

      return buildCoachingResponse(acknowledgment, patternAnalysis, insight, strategies, nextSteps);
    }

    // Anxiety and relationship security
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      const acknowledgment = `Feeling anxious about your relationship with ${theirName} shows how much this relationship means to you. These feelings are valid and worth addressing.`;

      let patternAnalysis = `Based on your profiles, `;
      if (context.yourTraits.attachmentStyle) {
        if (context.yourTraits.attachmentStyle === 'anxious') {
          patternAnalysis += `your anxious attachment style means you're naturally more sensitive to relationship threats and need more reassurance than ${theirName} might naturally think to provide.`;
        } else if (context.yourTraits.attachmentStyle === 'avoidant') {
          patternAnalysis += `your avoidant attachment style means you might be feeling anxious because intimacy itself feels threatening, even when the relationship is actually secure.`;
        } else {
          patternAnalysis += `your attachment patterns influence how you interpret ${theirName}'s behavior and what you need to feel secure.`;
        }
      } else {
        patternAnalysis += `relationship anxiety often stems from attachment needs not being clearly communicated or met.`;
      }

      const insight = `Anxiety in relationships usually signals either a real issue that needs addressing or an attachment wound being triggered. The key is distinguishing between the two and responding appropriately.`;

      const strategies = [];
      
      if (context.yourTraits.attachmentStyle === 'anxious') {
        strategies.push(`**Direct Communication:** Try: "${theirName}, I'm feeling insecure about us right now and could use some reassurance. Could you help me understand [specific concern]?"`);
        strategies.push(`**Reality Check:** Before assuming the worst, ask yourself: "Is this about something ${theirName} actually did, or is this my anxiety talking?"`);
      }

      strategies.push(`**Anxiety Mapping:** Write down specifically what's triggering your anxiety. Often it's not the relationship itself but external stressors affecting how secure you feel.`);
      strategies.push(`**Partner Insight:** Share your anxiety pattern with ${theirName}: "When I get anxious about us, I tend to [behavior]. It's not about you, but here's how you can help..."`);

      const nextSteps = `Identify one specific thing that would help you feel more secure right now, and communicate that clearly to ${theirName}. Focus on what you need rather than what they're doing wrong.`;

      return buildCoachingResponse(acknowledgment, patternAnalysis, insight, strategies, nextSteps);
    }

    // Communication improvement
    if (message.includes("communication") || message.includes("talk")) {
      const acknowledgment = `Good communication is the foundation of strong relationships, and wanting to improve how you and ${theirName} connect shows real relationship wisdom.`;

      let patternAnalysis = `Looking at both your communication styles, `;
      if (context.dynamics.communicationMatch === false) {
        patternAnalysis += `you and ${theirName} have different natural communication styles. You're ${context.yourTraits.communicationStyle} while ${theirName} is ${context.partnerTraits.communicationStyle}. This difference can create misunderstandings if not navigated thoughtfully.`;
      } else if (context.dynamics.communicationMatch === true) {
        patternAnalysis += `you both share a ${context.yourTraits.communicationStyle} communication style, which creates natural understanding but might also create blind spots.`;
      } else {
        patternAnalysis += `understanding each other's communication needs is key to deeper connection.`;
      }

      const insight = `Great communication isn't about speaking the same language - it's about learning to translate between your natural styles while staying true to yourselves.`;

      const strategies = [
        `**Style Flexibility:** Occasionally adapt to ${theirName}'s style. If they're direct and you're indirect, try being more straightforward. If they need details and you prefer brevity, provide more context.`,
        `**Meta-Communication:** Talk about how you communicate: "${theirName}, when I [communication pattern], I mean [intention]. How does that land for you?"`,
        `**Check Understanding:** End important conversations with: "What did you hear me say?" and "What's most important for me to understand about your perspective?"`
      ];

      const nextSteps = `Choose one conversation this week where you consciously adapt your communication style to better match ${theirName}'s needs. Notice how it affects the quality of your connection.`;

      return buildCoachingResponse(acknowledgment, patternAnalysis, insight, strategies, nextSteps);
    }

    // Default professional response
    let acknowledgment = `Thank you for sharing what's on your mind about your relationship with ${theirName}. Every relationship challenge is an opportunity for deeper understanding and connection.`;

    let patternAnalysis = `Based on your unique dynamic as a couple, `;
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      patternAnalysis += `you bring strengths like ${context.yourTraits.strengths.join(', ')} to this relationship. `;
    }
    if (context.relationship.length) {
      patternAnalysis += `After ${context.relationship.length} together, you've built a foundation that can support working through challenges.`;
    } else {
      patternAnalysis += `you're building something meaningful together that's worth investing in.`;
    }

    const insight = `Every relationship has its unique rhythm and challenges. The key is approaching difficulties as a team rather than adversaries, using your individual strengths to support your shared goals.`;

    const strategies = [
      `**Curiosity Over Judgment:** When issues arise, get curious about ${theirName}'s perspective rather than defending your own position.`,
      `**Regular Check-ins:** Schedule weekly 15-minute relationship check-ins to address small issues before they become big ones.`,
      `**Appreciation Practice:** Share one specific thing you appreciate about ${theirName} each day, focusing on their actions or character rather than general qualities.`
    ];

    const nextSteps = `Share more about what specific situation or feeling brought you here today. The more context you provide, the more personalized guidance I can offer based on your unique relationship dynamic.`;

    return buildCoachingResponse(acknowledgment, patternAnalysis, insight, strategies, nextSteps);
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
              `Expert relationship coaching for ${userName} and ${partnerName}` :
              'Professional relationship guidance tailored to your unique dynamic'
            }
          </p>
          {(profiles.your.length > 0 || profiles.partner.length > 0) && (
            <p className="text-sm text-coral-600 mt-1">
              💡 {userName && partnerName ? 
                `Evidence-based coaching using ${userName} and ${partnerName}'s relationship profiles` :
                'Professional coaching based on your detailed relationship profiles'
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
                      `Hello ${userName}, I'm your AI relationship coach with expertise in couples therapy, attachment theory, and evidence-based interventions.` :
                      'Hello, I\'m your AI relationship coach with professional training in relationship psychology.'
                    }
                  </p>
                  <p className="text-sm mt-2">
                    {userName && partnerName ?
                      `I know about ${userName} and ${partnerName}'s unique relationship dynamic and I'm here to provide personalized, research-backed guidance.` :
                      'I have access to your relationship profiles and can provide personalized, professional guidance.'
                    }
                  </p>
                  <p className="text-xs text-coral-600 mt-3">
                    Drawing from Gottman Method, EFT, Attachment Theory, and other evidence-based approaches
                  </p>
                </div>
              )}
              
              {chatHistory.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-coral-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-gray-600 ml-2">Analyzing your relationship dynamic...</span>
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
            <p className="text-sm text-gray-600 mb-2">Start with a common relationship topic:</p>
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
              `Tell me about what's happening with you and ${partnerName}...` :
              "What's happening in your relationship that you'd like guidance on?"
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

      {/* Professional Sidebar - 25% */}
      <div className="w-80 space-y-4">
        {/* Profile Status */}
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-4 h-4 text-coral-600" />
              <h3 className="font-medium text-gray-900">Relationship Profiles</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
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
              <div className="mt-3 p-2 bg-coral-50 rounded text-xs text-coral-700">
                <strong>Coaching Focus:</strong> Using {userName} and {partnerName}'s attachment styles, communication patterns, and relationship dynamics
              </div>
            )}
          </Card>
        )}

        {/* Expertise Badge */}
        <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Expert Guidance</h3>
          </div>
          <p className="text-sm text-gray-600">
            Evidence-based coaching from Gottman Method, EFT, and Attachment Theory
          </p>
        </Card>

        {/* Privacy & Trust */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Professional Standards</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Confidential and secure</p>
            <p>• Non-judgmental approach</p>
            <p>• Culturally sensitive guidance</p>
          </div>
        </Card>

        {chatHistory.length > 0 && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-medium text-gray-900 mb-3">Session Topics</h3>
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
