
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Lightbulb, Heart, MessageCircle, Plus, Eye, Target, BookOpen } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { useNavigation } from "@/contexts/NavigationContext";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import APIKeyInput from "./APIKeyInput";
import ProfileViewer from "./ProfileViewer";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
  onOpenProfileForm?: (profileType: 'your' | 'partner') => void;
  onStartConversation?: (starter: string) => void;
}

const AISidebar = ({ 
  profiles, 
  demographicsData, 
  chatHistory, 
  isConfigured, 
  onSupabaseConfigured, 
  onOpenProfileForm,
  onStartConversation
}: AISidebarProps) => {
  const { goToProfile } = useNavigation();
  const { updateTemporaryProfile } = useTemporaryProfile();
  
  // Get names from current profile data
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const { topics, loading } = useConversationTopics();
  
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');

  // Handle viewing profiles
  const handleViewProfile = (profileType: 'your' | 'partner') => {
    setViewingProfileType(profileType);
    setShowProfileViewer(true);
  };

  // Handle continuing/starting profiles
  const handleStartContinueProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    if (!demographicsData[profileType]) {
      setShowDemographics(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleProfileComplete = (profileData: any) => {
    setShowProfileForm(false);
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...demographicsData,
      [activeProfileType]: demographics
    };
    updateTemporaryProfile(profiles, newDemographics);
    
    setShowDemographics(false);
    setShowProfileForm(true);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  // Sort topics by frequency and recency
  const sortedTopics = topics.sort((a, b) => {
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency;
    }
    return new Date(b.mentioned_at).getTime() - new Date(a.mentioned_at).getTime();
  });

  // Extract key takeaways from chat history
  const extractTakeaways = () => {
    if (chatHistory.length === 0) return [];
    
    // Simple extraction of potential takeaways from AI messages
    const aiMessages = chatHistory.filter(msg => msg.type === 'ai');
    const takeaways = [];
    
    // Look for patterns in AI responses that suggest insights or advice
    aiMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('pattern') || content.includes('notice') || content.includes('sounds like')) {
        const sentences = msg.content.split('.').filter(s => s.length > 20);
        if (sentences.length > 0) {
          takeaways.push({
            id: msg.id,
            insight: sentences[0].trim() + '.',
            timestamp: msg.timestamp
          });
        }
      }
    });
    
    return takeaways.slice(0, 4); // Show up to 4 recent takeaways
  };

  const takeaways = extractTakeaways();

  return (
    <>
      <div className="w-full h-full overflow-y-auto space-y-3">
        {/* Meet Kai */}
        <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-fade-in hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Lightbulb className="w-3 h-3 text-orange-300" />
                Meet Kai
              </h3>
            </div>
          </div>
          <p className="text-xs text-pink-200/80 leading-relaxed">
            Your AI relationship coach, trained on 15+ years of PhD-level clinical psychology and grounded in evidence-based practices. Built to help you grow, communicate, and connect in the moments that matter most.
          </p>
        </Card>

        {/* Safe Space */}
        <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-3 h-3 text-orange-300 animate-pulse" />
            <h3 className="text-sm font-medium text-white">Safe Space</h3>
          </div>
          <div className="text-xs text-pink-200/80 space-y-1">
            <p>• No judgment, just support</p>
            <p>• Your feelings are valid</p>
            <p>• Messy is normal</p>
          </div>
        </Card>

        {/* What We've Covered */}
        <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3 h-3 text-orange-300" />
            <h3 className="text-sm font-medium text-white">What We've Covered</h3>
          </div>
          <div className="space-y-1">
            {loading ? (
              <p className="text-xs text-pink-200/80">Loading topics...</p>
            ) : chatHistory.length === 0 ? (
              <p className="text-xs text-pink-200/80">Start chatting and I'll track our conversation themes</p>
            ) : sortedTopics.length > 0 ? (
              <>
                <div className="space-y-1">
                  {sortedTopics.slice(0, 4).map((topic, index) => (
                    <Badge 
                      key={topic.id} 
                      variant="outline" 
                      className="w-full justify-between border-white/30 text-white bg-white/10 text-xs h-6 hover:bg-white/20 transition-all duration-200 hover:scale-105 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-2 h-2" />
                        <span className="truncate text-xs">{topic.topic}</span>
                      </div>
                      {topic.frequency > 1 && (
                        <span className="bg-orange-300 text-black px-1 py-0.5 rounded-full text-xs font-medium">
                          {topic.frequency}x
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
                {sortedTopics.length > 4 && (
                  <p className="text-xs text-pink-200/80 mt-1">
                    +{sortedTopics.length - 4} more topics discussed
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-pink-200/80">Keep chatting and I'll identify conversation themes</p>
            )}
          </div>
        </Card>

        {/* Key Takeaways */}
        <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3 h-3 text-orange-300" />
            <h3 className="text-sm font-medium text-white">Key Takeaways</h3>
          </div>
          <div className="space-y-1">
            {chatHistory.length === 0 ? (
              <p className="text-xs text-pink-200/80">Your insights and discoveries will appear here</p>
            ) : takeaways.length > 0 ? (
              <>
                <div className="space-y-2">
                  {takeaways.map((takeaway, index) => (
                    <div 
                      key={takeaway.id}
                      className="p-2 bg-white/5 rounded text-xs text-pink-200/90 border border-white/10 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{takeaway.insight}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-white/5 rounded text-xs text-pink-200/80 animate-fade-in">
                  <strong>Growing together:</strong> These insights help build stronger connection and understanding
                </div>
              </>
            ) : (
              <p className="text-xs text-pink-200/80">Keep exploring together - insights will emerge as we talk</p>
            )}
          </div>
        </Card>

        <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
        </div>
      </div>

      {/* Profile Viewer Modal */}
      {showProfileViewer && (
        <ProfileViewer
          profileType={viewingProfileType}
          profileData={profiles[viewingProfileType]}
          demographicsData={demographicsData[viewingProfileType]}
          onEdit={() => {
            setShowProfileViewer(false);
            setActiveProfileType(viewingProfileType);
            setShowProfileForm(true);
          }}
          onClose={() => setShowProfileViewer(false)}
        />
      )}

      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={demographicsData[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={profiles}
          initialDemographics={demographicsData}
        />
      )}
    </>
  );
};

export default AISidebar;
