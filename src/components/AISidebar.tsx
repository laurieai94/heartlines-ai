
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Lightbulb, Heart, MessageCircle, Plus, Settings, Eye, ArrowRight } from "lucide-react";
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

  // Quick start conversation prompts
  const quickStarters = [
    "I feel like we're not connecting lately",
    "We keep having the same fight over and over", 
    "I want to improve our communication",
    "Are we growing apart?",
    "I miss how we used to be",
    "How can we be more supportive of each other?"
  ];

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

  const handleQuickStart = (starter: string) => {
    if (onStartConversation) {
      onStartConversation(starter);
    }
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
      <div className="w-96 space-y-6 p-4">
        {/* Meet Kai */}
        <Card className="p-6 bg-gradient-to-br from-coral-50 via-peach-50 to-coral-100 border-coral-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Lightbulb className="w-6 h-6 text-coral-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Meet Kai</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Built on the expertise of PhD-level clinical psychology—trained on 15+ years of insights to deliver real, effective advice for modern relationships.
          </p>
        </Card>

        {/* Profile Completion Status */}
        <Card className="p-6 bg-gradient-to-br from-white/90 to-coral-50/30 backdrop-blur-md border-coral-200/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-coral-600" />
            <h3 className="text-xl font-bold text-gray-900">Your Profiles</h3>
          </div>
          
          {/* Your Profile */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800">
                  {userName || 'Your'} Profile
                </span>
              </div>
              <span className="text-lg font-bold text-coral-600">{yourCompletion}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={yourCompletion} 
                className="h-3 bg-gray-200" 
                style={{
                  background: `linear-gradient(to right, #FF6B6B ${yourCompletion}%, #e5e7eb ${yourCompletion}%)`
                }}
              />
              {yourCompletion === 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">🎉 Complete!</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-sm font-medium border-coral-300 text-coral-700 hover:bg-coral-50 hover:border-coral-400 transition-all duration-200"
                onClick={() => onOpenProfileForm?.('your')}
              >
                <Plus className="w-4 h-4 mr-2" />
                {yourCompletion > 0 ? 'Keep Going' : 'Start'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              {yourCompletion > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm hover:bg-coral-50"
                  onClick={() => handleViewProfile('your')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Partner Profile */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800">
                  {partnerName || 'Partner'} Profile
                </span>
              </div>
              <span className="text-lg font-bold text-pink-600">{partnerCompletion}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={partnerCompletion} 
                className="h-3 bg-gray-200"
                style={{
                  background: `linear-gradient(to right, #FF8E8E ${partnerCompletion}%, #e5e7eb ${partnerCompletion}%)`
                }}
              />
              {partnerCompletion === 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">🎉 Complete!</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 text-sm font-medium transition-all duration-200 ${
                  partnerCompletion === 0 
                    ? 'border-pink-400 text-pink-700 hover:bg-pink-50 hover:border-pink-500 bg-pink-50/50 shadow-md' 
                    : 'border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400'
                }`}
                onClick={() => onOpenProfileForm?.('partner')}
              >
                <Plus className="w-4 h-4 mr-2" />
                {partnerCompletion > 0 ? 'Keep Going' : 'Start'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              {partnerCompletion > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm hover:bg-pink-50"
                  onClick={() => handleViewProfile('partner')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {userName && partnerName && (yourCompletion > 50 || partnerCompletion > 50) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-coral-50 to-peach-50 rounded-lg border border-coral-200">
              <p className="text-sm text-coral-800 font-medium">
                <strong>Real talk:</strong> I know {userName} and {partnerName}'s actual patterns, not just generic relationship stuff
              </p>
            </div>
          )}
        </Card>

        {/* Quick Start Section */}
        <Card className="p-6 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-md border-purple-200/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Quick Start</h3>
          </div>
          <div className="space-y-3">
            {quickStarters.map((starter, index) => (
              <Card 
                key={index}
                className="p-3 cursor-pointer bg-white/60 border-purple-200/50 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
                onClick={() => handleQuickStart(starter)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                    "{starter}"
                  </p>
                  <ArrowRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* What We've Covered */}
        <Card className="p-6 bg-gradient-to-br from-white/90 to-blue-50/30 backdrop-blur-md border-blue-200/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">What We've Covered</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading topics...</p>
            ) : chatHistory.length === 0 ? (
              <p className="text-sm text-gray-600 italic">Start chatting and I'll track our conversation themes</p>
            ) : sortedTopics.length > 0 ? (
              <>
                <div className="space-y-2">
                  {sortedTopics.slice(0, 8).map((topic) => (
                    <Badge 
                      key={topic.id} 
                      variant="outline" 
                      className="w-full justify-between border-blue-200 text-blue-700 text-sm hover:bg-blue-50 transition-colors py-2 px-3"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3 h-3" />
                        <span className="truncate">{topic.topic}</span>
                      </div>
                      {topic.frequency > 1 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                          {topic.frequency}x
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
                {sortedTopics.length > 8 && (
                  <p className="text-sm text-gray-500 mt-3">
                    +{sortedTopics.length - 8} more topics discussed
                  </p>
                )}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-700">
                    <strong>Patterns emerging:</strong> I'm learning about your relationship dynamics as we talk
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 italic">Keep chatting and I'll identify conversation themes</p>
            )}
          </div>
        </Card>

        {/* Safe Space */}
        <Card className="p-6 bg-gradient-to-br from-white/90 to-green-50/30 backdrop-blur-md border-green-200/30 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Safe Space</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-700 font-medium">No judgment, just support</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-700 font-medium">Your feelings are valid</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-700 font-medium">Messy is normal</p>
            </div>
          </div>
        </Card>

        {/* API Configuration */}
        <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
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
