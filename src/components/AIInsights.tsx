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
    return {
      relationship: {
        length: yourDemographics.relationshipLength,
        livingTogether: yourDemographics.livingTogether,
        stage: yourDemographics.relationshipStage
      },
      yourTraits: {
        name: userName,
        loveLanguage: yourProfile.loveLanguage,
        communicationStyle: yourProfile.communicationStyle,
        conflictStyle: yourProfile.conflictStyle,
        stressResponse: yourProfile.stressResponse,
        attachmentStyle: yourProfile.attachmentStyle,
        triggers: yourProfile.triggers || [],
        strengths: yourProfile.strengths || [],
        growthAreas: yourProfile.growthAreas || []
      },
      partnerTraits: {
        name: partnerName,
        loveLanguage: partnerProfile.loveLanguage,
        communicationStyle: partnerProfile.communicationStyle,
        conflictStyle: partnerProfile.conflictStyle,
        stressResponse: partnerProfile.stressResponse,
        attachmentStyle: partnerProfile.attachmentStyle,
        triggers: partnerProfile.triggers || [],
        strengths: partnerProfile.strengths || [],
        growthAreas: partnerProfile.growthAreas || []
      },
      dynamics: {
        loveLanguageMatch: yourProfile.loveLanguage === partnerProfile.loveLanguage,
        loveLanguageGap: yourProfile.loveLanguage !== partnerProfile.loveLanguage,
        communicationMatch: yourProfile.communicationStyle === partnerProfile.communicationStyle,
        conflictDynamic: yourProfile.conflictStyle && partnerProfile.conflictStyle ? `${yourProfile.conflictStyle}-${partnerProfile.conflictStyle}` : undefined
      }
    };
  };

  // Millennial-friendly AI Relationship Coach Response System
  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    const context = buildPersonContext();
    
    const youName = userName || 'you';
    const theirName = partnerName || 'your partner';
    
    // Support and care responses
    if (message.includes("support") || message.includes("help")) {
      let response = `Okay, first - I love that you're thinking about how to show up better for ${theirName}. That already says so much about who you are.\n\n`;
      
      response += `Here's what I'm seeing: `;
      if (context.dynamics.loveLanguageMatch) {
        response += `You both speak ${context.partnerTraits.loveLanguage} as your love language, which is honestly such a gift. You naturally get how to love each other.`;
      } else if (context.dynamics.loveLanguageGap && context.partnerTraits.loveLanguage) {
        response += `${theirName}'s love language is ${context.partnerTraits.loveLanguage} while yours is ${context.yourTraits.loveLanguage}. So you might be loving them in your language instead of theirs - super common, and totally fixable.`;
      } else {
        response += `support isn't one-size-fits-all, and what feels good to you might not be what ${theirName} needs most right now.`;
      }

      response += `\n\n`;
      
      if (context.partnerTraits.stressResponse) {
        response += `Real talk: when ${theirName} is stressed, they tend to ${context.partnerTraits.stressResponse}. So your support needs to account for that pattern, not fight against it.\n\n`;
      }

      response += `**Try this:**\n`;
      
      if (context.partnerTraits.loveLanguage === 'acts_of_service') {
        response += `• **Handle the stuff that stresses them out** - Look for tasks they usually do and just... do them. No announcement needed. The dishes, their laundry, that thing they've been putting off.\n`;
        response += `• **Ask specifically**: "${theirName}, what would actually make your day easier right now?" Then do that thing.\n`;
      } else if (context.partnerTraits.loveLanguage === 'words_of_affirmation') {
        response += `• **Get specific with your words** - Instead of "you're great," try "${theirName}, I really love how you handled [specific thing]. It showed me [specific quality]."\n`;
        response += `• **Text them something real** - Send them something appreciative in the middle of their day, not just when you want something.\n`;
      } else if (context.partnerTraits.loveLanguage === 'quality_time') {
        response += `• **Phone away, full attention** - Even 15 minutes of being completely present beats hours of distracted hanging out.\n`;
        response += `• **Ask what they want to do together** - Let them pick the activity and follow their lead.\n`;
      } else {
        response += `• **Pay attention to how they show love** - That's probably how they want to receive it too.\n`;
        response += `• **Ask directly**: "${theirName}, I want to support you better. What would feel most helpful right now?"\n`;
      }

      response += `\n**Your next move:** Pick one specific thing that would make ${theirName}'s day easier and handle it without being asked. Notice how they respond and adjust from there.\n\n`;
      response += `You've got this. The fact that you're asking shows you're already on the right track.`;

      return response;
    }

    // Conflict and argument responses
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let response = `Oof, yeah. Recurring arguments are exhausting as hell, and I bet you're both feeling frustrated about this cycle you're stuck in.\n\n`;

      response += `Here's what I think is really happening: `;
      if (context.dynamics.conflictDynamic) {
        const yourStyle = context.yourTraits.conflictStyle;
        const theirStyle = context.partnerTraits.conflictStyle;
        
        if (yourStyle === 'confrontational' && theirStyle === 'avoidant') {
          response += `You want to hash things out immediately, and ${theirName} needs to retreat and process. So you chase, they withdraw, you chase harder, they shut down more. It's like a really shitty dance nobody enjoys.`;
        } else if (yourStyle === 'avoidant' && theirStyle === 'confrontational') {
          response += `${theirName} wants to talk it out right now, and you need time to think. They see your need for space as rejection, and you see their urgency as pressure. Classic mismatch.`;
        } else if (yourStyle === theirStyle && yourStyle === 'confrontational') {
          response += `You're both wanting to be heard RIGHT NOW. Which means you're talking over each other instead of actually listening. Both valid, but the timing is all wrong.`;
        } else {
          response += `there's a pattern here that goes deeper than whatever you're actually arguing about.`;
        }
      } else {
        response += `most fights aren't really about the thing you're fighting about. They're about the feelings underneath - feeling unheard, unvalued, misunderstood, or disconnected.`;
      }

      response += `\n\n`;
      response += `**Real talk:** The content of your arguments probably changes, but the emotional pattern stays the same. `;
      
      if (context.yourTraits.attachmentStyle || context.partnerTraits.attachmentStyle) {
        response += `This is your attachment stuff showing up - the deep fears about safety, connection, and being enough.\n\n`;
      }

      response += `**Here's what to try differently:**\n`;
      
      if (context.yourTraits.conflictStyle === 'confrontational' && context.partnerTraits.conflictStyle === 'avoidant') {
        response += `• **Give them a heads up**: "${theirName}, there's something I'd like to talk through with you. When would feel good for you? No rush, but it matters to me."\n`;
        response += `• **When they retreat, don't chase**: "I can see you need some space. I'm here when you're ready."\n`;
      } else if (context.yourTraits.conflictStyle === 'avoidant' && context.partnerTraits.conflictStyle === 'confrontational') {
        response += `• **Bridge the gap**: "This matters to me too. Can I have [specific time] to process, and then we can talk about it?"\n`;
        response += `• **Reassure them**: "I need time to think, but that doesn't mean I don't care or that I'm dismissing what you're saying."\n`;
      } else {
        response += `• **Pause the pattern**: When you feel it escalating, try "I can feel us getting into that thing we do. Can we take 20 minutes and come back to this?"\n`;
      }

      response += `• **Get to the feelings first**: Before diving into the issue, each person says "What I really need right now is..." Address that first.\n`;
      response += `• **Focus on the need, not being right**: Ask yourself "What is each of us trying to get our needs met here?"\n\n`;

      response += `**Your next step:** The next time you feel an argument building, pause and ask yourself: "What am I actually needing right now?" Then share that instead of the complaint.\n\n`;
      response += `This shit is hard, but you can absolutely learn to fight better. It just takes practice.`;

      return response;
    }

    // Anxiety and relationship security
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      let response = `First of all, take a breath. What you're feeling makes total sense, and you're not being dramatic or needy for feeling this way.\n\n`;

      if (context.yourTraits.attachmentStyle === 'anxious') {
        response += `I know you mentioned your attachment style is anxious, so your nervous system is literally wired to be more sensitive to relationship threats. This isn't your fault - it's how your brain learned to keep you safe.\n\n`;
        response += `The tricky thing is that sometimes your anxiety is picking up on real issues, and sometimes it's just... anxiety being anxiety. `;
      } else {
        response += `Relationship anxiety can hit anyone, especially when something matters this much to you. `;
      }

      response += `The key is figuring out if this is about something ${theirName} actually did/said, or if it's your brain spiraling.\n\n`;

      response += `**Let's reality-check this:**\n`;
      response += `• What specifically happened that triggered this feeling?\n`;
      response += `• Is this based on ${theirName}'s actual behavior or your interpretation of it?\n`;
      response += `• What story is your brain telling you right now?\n\n`;

      if (context.yourTraits.attachmentStyle === 'anxious') {
        response += `**For your anxious attachment brain:**\n`;
        response += `• **Name it**: "My attachment system is activated right now, and I'm feeling scared about us."\n`;
        response += `• **Ask directly**: "${theirName}, I'm feeling insecure and could use some reassurance. Can you help me understand [specific concern]?"\n`;
        response += `• **Ground yourself**: What evidence do you have that your relationship is actually solid?\n\n`;
      }

      response += `**What to do right now:**\n`;
      response += `• Write down exactly what you're worried about - get it out of your head\n`;
      response += `• Ask yourself: "What would help me feel more secure right now?"\n`;
      response += `• Share that specific need with ${theirName} instead of the anxiety spiral\n\n`;

      response += `**Your next step:** Be specific about what you need. Instead of "I'm anxious about us," try "${theirName}, I'm feeling disconnected and would love to spend some focused time together tonight."\n\n`;
      response += `Your feelings are valid, AND you have more control over this than it feels like right now. You've got this.`;

      return response;
    }

    // Communication improvement
    if (message.includes("communication") || message.includes("talk")) {
      let response = `Yes! Honestly, the fact that you want to improve how you two connect is already huge. Most people just accept shitty communication as "normal."\n\n`;

      if (context.dynamics.communicationMatch === false) {
        response += `So here's the thing - you're ${context.yourTraits.communicationStyle} and ${theirName} is ${context.partnerTraits.communicationStyle}. `;
        response += `This isn't good or bad, but it means you're basically speaking different dialects of the same language. `;
        response += `You can learn to translate between your styles without losing yourselves.\n\n`;
      } else if (context.dynamics.communicationMatch === true) {
        response += `You both have a ${context.yourTraits.communicationStyle} communication style, which creates natural understanding but might also create some blind spots.\n\n`;
      }

      response += `**Here's what actually works:**\n`;
      response += `• **Meta-communication** - Talk about how you talk: "${theirName}, when I [your pattern], I mean [your intention]. How does that land for you?"\n`;
      response += `• **Style flexibility** - Occasionally adapt to their style. If they need details and you prefer brevity, give more context. If they're direct and you're indirect, try being more straightforward.\n`;
      response += `• **Check understanding** - End important convos with "What did you hear me say?" and "What's most important for me to understand about your perspective?"\n\n`;

      response += `**Real talk:** Good communication isn't about never misunderstanding each other. It's about catching misunderstandings quickly and fixing them together.\n\n`;

      response += `**Your next step:** Pick one conversation this week where you consciously try communicating more like ${theirName} does. Notice what happens to the quality of your connection.\n\n`;
      response += `You're already doing the work just by thinking about this. Communication is a skill, not a talent - and you can absolutely get better at it.`;

      return response;
    }

    // Default millennial-friendly response
    let response = `Thanks for sharing what's going on with you and ${theirName}. I can tell this matters a lot to you, which honestly says everything about who you are as a partner.\n\n`;

    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      response += `I know you bring ${context.yourTraits.strengths.join(', ')} to this relationship, and those are real assets. `;
    }

    if (context.relationship.length) {
      response += `After ${context.relationship.length} together, you've built something real - something worth investing in and figuring out together.\n\n`;
    } else {
      response += `You're building something meaningful together, and that's worth investing in.\n\n`;
    }

    response += `**Here's what I want you to remember:**\n`;
    response += `• Every relationship has its unique rhythm and challenges - that's not a bug, it's a feature\n`;
    response += `• You two are on the same team, even when it doesn't feel like it\n`;
    response += `• Working on your relationship doesn't mean it's broken - it means you want it to be great\n\n`;

    response += `**Some things to try:**\n`;
    response += `• **Get curious instead of defensive** - When stuff comes up, ask "${theirName}, help me understand your perspective here"\n`;
    response += `• **Weekly check-ins** - 15 minutes every week to address small stuff before it becomes big stuff\n`;
    response += `• **Daily appreciation** - One specific thing you appreciate about ${theirName} each day (focus on what they do, not just who they are)\n\n`;

    response += `**Tell me more:** What specific situation or feeling brought you here today? The more context you give me about what's actually happening, the more personalized guidance I can offer based on your unique dynamic.\n\n`;
    response += `You've got this. Seriously.`;

    return response;
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
                      <span className="text-sm text-gray-600 ml-2">Getting real about your situation...</span>
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
            <p className="text-sm text-gray-600 mb-2">Start with something that's actually on your mind:</p>
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
              `What's actually happening with you and ${partnerName}?` :
              "What's going on in your relationship that you want to talk through?"
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

      {/* Sidebar */}
      <div className="w-80 space-y-4">
        {/* Profile Status */}
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-4 h-4 text-coral-600" />
              <h3 className="font-medium text-gray-900">Your Profiles</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {profiles.your.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{userName || 'Your'} profile loaded</span>
                </div>
              )}
              {profiles.partner.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{partnerName || 'Partner'} profile loaded</span>
                </div>
              )}
            </div>
            {userName && partnerName && (
              <div className="mt-3 p-2 bg-coral-50 rounded text-xs text-coral-700">
                <strong>Real talk:</strong> I know {userName} and {partnerName}'s actual patterns, not just generic relationship stuff
              </div>
            )}
          </Card>
        )}

        {/* Coach Vibe */}
        <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Your Coach</h3>
          </div>
          <p className="text-sm text-gray-600">
            Real advice that actually works for millennials navigating modern relationships
          </p>
        </Card>

        {/* Safe Space */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Safe Space</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• No judgment, just support</p>
            <p>• Your feelings are valid</p>
            <p>• Messy is normal</p>
          </div>
        </Card>

        {chatHistory.length > 0 && (
          <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <h3 className="font-medium text-gray-900 mb-3">What We've Covered</h3>
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
