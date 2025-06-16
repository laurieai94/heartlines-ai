
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Lightbulb, Heart, MessageCircle, Plus, Settings } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import APIKeyInput from "./APIKeyInput";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
  onOpenProfileForm?: (profileType: 'your' | 'partner') => void;
}

const AISidebar = ({ profiles, demographicsData, chatHistory, isConfigured, onSupabaseConfigured, onOpenProfileForm }: AISidebarProps) => {
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const { topics, loading } = useConversationTopics();

  // Calculate profile completion percentages
  const calculateProfileCompletion = (profileData: any[], demographicsData: any) => {
    const totalQuestions = 15; // Approximate total questions across all forms
    let answeredQuestions = 0;
    
    if (demographicsData) answeredQuestions += 3; // Demographics questions
    if (profileData.length > 0) {
      const profile = profileData[0];
      const fields = Object.keys(profile);
      answeredQuestions += fields.filter(field => profile[field] && profile[field] !== '').length;
    }
    
    return Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 100);
  };

  const yourCompletion = calculateProfileCompletion(profiles.your, demographicsData.your);
  const partnerCompletion = calculateProfileCompletion(profiles.partner, demographicsData.partner);

  // Sort topics by frequency and recency
  const sortedTopics = topics.sort((a, b) => {
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency; // Higher frequency first
    }
    return new Date(b.mentioned_at).getTime() - new Date(a.mentioned_at).getTime(); // More recent first
  });

  return (
    <div className="w-80 space-y-4">
      {/* API Configuration */}
      <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />

      {/* Profile Completion Status */}
      <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-4 h-4 text-coral-600" />
          <h3 className="font-medium text-gray-900">Your Profiles</h3>
        </div>
        
        {/* Your Profile */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {userName || 'Your'} Profile
            </span>
            <span className="text-sm text-gray-500">{yourCompletion}%</span>
          </div>
          <Progress value={yourCompletion} className="h-2" />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => onOpenProfileForm?.('your')}
          >
            <Plus className="w-3 h-3 mr-1" />
            {yourCompletion > 0 ? 'Add More Details' : 'Start Profile'}
          </Button>
        </div>

        {/* Partner Profile */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {partnerName || 'Partner'} Profile
            </span>
            <span className="text-sm text-gray-500">{partnerCompletion}%</span>
          </div>
          <Progress value={partnerCompletion} className="h-2" />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => onOpenProfileForm?.('partner')}
          >
            <Plus className="w-3 h-3 mr-1" />
            {partnerCompletion > 0 ? 'Add More Details' : 'Start Profile'}
          </Button>
        </div>

        {userName && partnerName && (yourCompletion > 50 || partnerCompletion > 50) && (
          <div className="mt-4 p-2 bg-coral-50 rounded text-xs text-coral-700">
            <strong>Real talk:</strong> I know {userName} and {partnerName}'s actual patterns, not just generic relationship stuff
          </div>
        )}
      </Card>

      {/* Coach Vibe */}
      <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-coral-600" />
          <h3 className="font-medium text-gray-900">Meet Kai</h3>
        </div>
        <p className="text-sm text-gray-600">
          Built on the expertise of PhD-level clinical psychology—trained on 15+ years of insights to deliver real, effective advice for modern relationships.
        </p>
      </Card>

      {/* What We've Covered - Enhanced */}
      <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-coral-600" />
          <h3 className="font-medium text-gray-900">What We've Covered</h3>
        </div>
        <div className="space-y-2">
          {loading ? (
            <p className="text-xs text-gray-500">Loading topics...</p>
          ) : chatHistory.length === 0 ? (
            <p className="text-xs text-gray-500">Start chatting and I'll track our conversation themes</p>
          ) : sortedTopics.length > 0 ? (
            <>
              <div className="space-y-2">
                {sortedTopics.slice(0, 8).map((topic) => (
                  <Badge 
                    key={topic.id} 
                    variant="outline" 
                    className="w-full justify-between border-coral-200 text-coral-700 text-xs hover:bg-coral-50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span className="truncate">{topic.topic}</span>
                    </div>
                    {topic.frequency > 1 && (
                      <span className="bg-coral-100 text-coral-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                        {topic.frequency}x
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
              {sortedTopics.length > 8 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{sortedTopics.length - 8} more topics discussed
                </p>
              )}
              <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded text-xs text-gray-600">
                <strong>Patterns emerging:</strong> I'm learning about your relationship dynamics as we talk
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500">Keep chatting and I'll identify conversation themes</p>
          )}
        </div>
      </Card>

      {/* Safe Space - Moved to bottom */}
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
    </div>
  );
};

export default AISidebar;
