
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Lightbulb, Heart, MessageCircle, Plus, Settings, Eye } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import APIKeyInput from "./APIKeyInput";
import ProfileViewer from "./ProfileViewer";

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
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const { topics, loading } = useConversationTopics();
  
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');

  // Calculate profile completion percentages
  const calculateProfileCompletion = (profileData: any[], demographicsData: any) => {
    let totalFields = 0;
    let completedFields = 0;

    // Demographics fields (required for completion)
    const demographicsFields = ['name', 'pronouns', 'age', 'education', 'workSituation'];
    totalFields += demographicsFields.length;
    if (demographicsData) {
      completedFields += demographicsFields.filter(field => demographicsData[field] && demographicsData[field] !== '').length;
    }

    // Background & lifestyle fields (now required)
    const backgroundFields = ['familyBackground', 'parentsRelationship', 'personalityType', 'healthWellness'];
    totalFields += backgroundFields.length;
    if (demographicsData) {
      completedFields += backgroundFields.filter(field => demographicsData[field] && demographicsData[field] !== '').length;
    }

    // Profile fields (core required fields)
    const profileFields = [
      'importantTalkPreference', 'communicationDirectness', 'emotionExpression', 'loveLanguages',
      'conflictResponse', 'stressSpaceNeed', 'stressSupportNeed', 'goSilentWhenUpset', 'needToTalkImmediately',
      'beingRushedMakesWorse', 'feelHeardWithValidation',
      'comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt',
      'relationshipLength', 'relationshipType', 'improvingCommunicationFocus'
    ];
    totalFields += profileFields.length;
    
    if (profileData.length > 0) {
      const profile = profileData[0];
      completedFields += profileFields.filter(field => {
        const value = profile[field];
        return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
      }).length;
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const yourCompletion = calculateProfileCompletion(profiles.your, demographicsData.your);
  const partnerCompletion = calculateProfileCompletion(profiles.partner, demographicsData.partner);

  const handleViewProfile = (profileType: 'your' | 'partner') => {
    setViewingProfileType(profileType);
    setShowProfileViewer(true);
  };

  const handleEditProfile = () => {
    setShowProfileViewer(false);
    onOpenProfileForm?.(viewingProfileType);
  };

  // Sort topics by frequency and recency
  const sortedTopics = topics.sort((a, b) => {
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency;
    }
    return new Date(b.mentioned_at).getTime() - new Date(a.mentioned_at).getTime();
  });

  return (
    <>
      <div className="w-80 space-y-4">
        {/* Meet Kai with avatar */}
        <Card className="p-4 bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200/50 animate-fade-in hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-coral-600" />
                Meet Kai
              </h3>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Built on the expertise of PhD-level clinical psychology—trained on 15+ years of insights to deliver real, effective advice for modern relationships.
          </p>
        </Card>

        {/* Profile Completion Status with animated progress */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Your Profiles</h3>
          </div>
          
          {/* Your Profile */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                {userName || 'Your'} Profile
              </span>
              <span className="text-sm text-gray-500">{yourCompletion}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={yourCompletion} 
                className="h-3 transition-all duration-1000 ease-out hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs hover:scale-105 transition-transform duration-200"
                onClick={() => onOpenProfileForm?.('your')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {yourCompletion > 0 ? 'Keep Going' : 'Start'}
              </Button>
              {yourCompletion > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:scale-105 transition-transform duration-200"
                  onClick={() => handleViewProfile('your')}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Partner Profile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                {partnerName || 'Partner'} Profile
              </span>
              <span className="text-sm text-gray-500">{partnerCompletion}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={partnerCompletion} 
                className="h-3 transition-all duration-1000 ease-out hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-coral-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs hover:scale-105 transition-transform duration-200"
                onClick={() => onOpenProfileForm?.('partner')}
              >
                <Plus className="w-3 h-3 mr-1" />
                {partnerCompletion > 0 ? 'Keep Going' : 'Start'}
              </Button>
              {partnerCompletion > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:scale-105 transition-transform duration-200"
                  onClick={() => handleViewProfile('partner')}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {userName && partnerName && (yourCompletion > 50 || partnerCompletion > 50) && (
            <div className="mt-4 p-2 bg-coral-50 rounded text-xs text-coral-700 animate-fade-in">
              <strong>Real talk:</strong> I know {userName} and {partnerName}'s actual patterns, not just generic relationship stuff
            </div>
          )}
        </Card>

        {/* What We've Covered with fade-in animation */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
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
                  {sortedTopics.slice(0, 8).map((topic, index) => (
                    <Badge 
                      key={topic.id} 
                      variant="outline" 
                      className="w-full justify-between border-coral-200 text-coral-700 text-xs hover:bg-coral-50 transition-all duration-200 hover:scale-105 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
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
                <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded text-xs text-gray-600 animate-fade-in">
                  <strong>Patterns emerging:</strong> I'm learning about your relationship dynamics as we talk
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-500">Keep chatting and I'll identify conversation themes</p>
            )}
          </div>
        </Card>

        {/* Safe Space with fade-in */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg animate-slide-up hover:shadow-lg transition-all duration-300" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-coral-600 animate-pulse" />
            <h3 className="font-medium text-gray-900">Safe Space</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• No judgment, just support</p>
            <p>• Your feelings are valid</p>
            <p>• Messy is normal</p>
          </div>
        </Card>

        {/* API Configuration */}
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
          onEdit={handleEditProfile}
          onClose={() => setShowProfileViewer(false)}
        />
      )}
    </>
  );
};

export default AISidebar;
