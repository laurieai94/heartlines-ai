
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Bot, User, Lightbulb, MessageCircle, Plus, Eye, Settings } from "lucide-react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigation } from "@/contexts/NavigationContext";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";
import APIKeyInput from "./APIKeyInput";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isConfigured: boolean;
  conversationStarter?: string;
  onSupabaseConfigured?: (configured: boolean) => void;
  onOpenProfileForm?: (profileType: 'your' | 'partner') => void;
  onStartConversation?: (starter: string) => void;
}

const AIChat = ({ 
  profiles, 
  demographicsData, 
  chatHistory, 
  setChatHistory, 
  isConfigured, 
  conversationStarter,
  onSupabaseConfigured,
  onOpenProfileForm,
  onStartConversation
}: AIChatProps) => {
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { saveConversation } = useChatHistory();
  const { accessLevel, canInteract, profileCompletion } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { topics } = useConversationTopics();
  const processedStarters = useRef(new Set<string>());

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Handle conversation starter - improved to avoid duplicates
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract) {
      processedStarters.current.add(conversationStarter);
      sendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract]);

  // Save conversation whenever chat history changes (with debouncing)
  useEffect(() => {
    if (chatHistory.length > 0 && canInteract) {
      const timeoutId = setTimeout(() => {
        saveConversation(chatHistory);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory, saveConversation, canInteract]);

  const sendMessage = async (userMessage: string) => {
    if (!canInteract) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
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
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, aiMessage]);

      // Automatically speak Kai's response if voice function is available
      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  // Calculate profile completions
  const calculateYourCompletion = () => {
    const yourProfile = profiles.your[0];
    const yourDemo = demographicsData.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8;
    
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    if (yourProfile?.stressReactions?.length > 0 || yourDemo?.stressReactions?.length > 0) completed++;
    if (yourProfile?.attachmentStyles?.length > 0 || yourDemo?.attachmentStyles?.length > 0) completed++;
    if (yourProfile?.loveLanguages?.length > 0 || yourDemo?.loveLanguages?.length > 0) completed++;
    if (yourProfile?.receiveLove?.length > 0 || yourDemo?.receiveLove?.length > 0) completed++;
    if (yourProfile?.familyDynamics?.length > 0 || yourDemo?.familyDynamics?.length > 0) completed++;
    if (yourProfile?.relationshipStatus?.length > 0 || yourDemo?.relationshipStatus?.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const calculatePartnerCompletion = () => {
    const partnerProfile = profiles.partner[0];
    const partnerDemo = demographicsData.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const yourCompletion = calculateYourCompletion();
  const partnerCompletion = calculatePartnerCompletion();

  // Sort topics by frequency and recency
  const sortedTopics = topics.sort((a, b) => {
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency;
    }
    return new Date(b.mentioned_at).getTime() - new Date(a.mentioned_at).getTime();
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative">
      {/* Header with profile info and settings */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Kai Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-lg opacity-40 animate-pulse"></div>
                <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white shadow-lg relative z-10">
                  <AvatarImage 
                    src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                    alt="Kai" 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Heart className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Kai</h2>
                <p className="text-sm text-gray-600">Your AI relationship coach</p>
              </div>
            </div>

            {/* Profile completion and settings */}
            <div className="flex items-center gap-4">
              {profileCompletion > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">Profile: {profileCompletion}%</div>
                  <Progress value={profileCompletion} className="w-16 h-2" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick profile actions */}
          {profileCompletion < 100 && (
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenProfileForm?.('your')}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {yourCompletion > 0 ? 'Continue Profile' : 'Setup Profile'}
              </Button>
              {yourCompletion > 0 && partnerCompletion === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenProfileForm?.('partner')}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Partner
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
            
            {/* Kai's Welcome Section */}
            {chatHistory.length === 0 && isConfigured && !conversationStarter && (
              <div className="text-center py-12 animate-fade-in">
                <div className="space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-3xl font-semibold text-gray-800 leading-relaxed">
                    Hey, I'm Kai 👋
                  </h2>
                  
                  <div className="text-lg text-gray-600 leading-relaxed font-light space-y-3">
                    <p>Here to help you figure out the messy, meaningful, and everything-in-between parts of your relationship.</p>
                    <p>What's going on today?</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chat Messages */}
            {chatHistory.map((message, index) => (
              <div key={message.id} className="animate-fade-in">
                <AIChatMessage 
                  message={message} 
                  userAvatarUrl={profile?.avatar_url || undefined}
                  userName={userName}
                />
              </div>
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 items-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-md opacity-60 animate-pulse"></div>
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 relative z-10">
                      <AvatarImage 
                        src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                        alt="Kai" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl px-5 py-4 shadow-lg border border-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Waiting indicator */}
            {!loading && chatHistory.length > 0 && canInteract && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                  <span className="font-light">Kai is listening...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="px-6 py-4 max-w-4xl mx-auto">
          <ProgressiveAccessWrapper action="chat">
            <AIChatInput 
              onSendMessage={sendMessage} 
              loading={loading || !isConfigured || !canInteract} 
              userName={userName} 
              partnerName={partnerName}
              chatHistory={chatHistory}
              onSpeakResponse={handleSpeakResponse}
            />
          </ProgressiveAccessWrapper>
          {!isConfigured && accessLevel === 'full-access' && (
            <p className="text-sm text-gray-500 mt-3 text-center font-light">
              Complete setup to start chatting
            </p>
          )}
        </div>
      </div>

      {/* Sidebar overlay */}
      {showSidebar && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Profile & Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                  className="p-2"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Profile completion */}
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Your Profiles</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{userName || 'Your Profile'}</span>
                      <span className="text-sm text-gray-500">{yourCompletion}%</span>
                    </div>
                    <Progress value={yourCompletion} className="h-2" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenProfileForm?.('your')}
                      className="w-full mt-2 text-xs"
                    >
                      {yourCompletion > 0 ? 'Continue' : 'Start Profile'}
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{partnerName || 'Partner Profile'}</span>
                      <span className="text-sm text-gray-500">{partnerCompletion}%</span>
                    </div>
                    <Progress value={partnerCompletion} className="h-2" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenProfileForm?.('partner')}
                      className="w-full mt-2 text-xs"
                    >
                      {partnerCompletion > 0 ? 'Continue' : 'Add Partner'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Conversation topics */}
              <Card className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">What We've Covered</h4>
                <div className="space-y-2">
                  {sortedTopics.length > 0 ? (
                    sortedTopics.slice(0, 6).map((topic) => (
                      <Badge 
                        key={topic.id} 
                        variant="outline" 
                        className="w-full justify-between text-xs"
                      >
                        <span className="truncate">{topic.topic}</span>
                        {topic.frequency > 1 && (
                          <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">
                            {topic.frequency}x
                          </span>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Start chatting to see conversation themes</p>
                  )}
                </div>
              </Card>

              {/* API Configuration */}
              <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
