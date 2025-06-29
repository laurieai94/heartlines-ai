import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Lightbulb, Heart, MessageCircle, Plus, Settings, Eye } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
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
  const { profileCompletion } = useProgressiveAccess();
  
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');

  // Calculate individual profile completion percentages with real-time updates
  const calculateYourCompletion = () => {
    const yourProfile = profiles.your[0];
    const yourDemo = demographicsData.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8; // Core fields for personal profile
    
    // Basic info
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    
    // Emotional blueprint
    if (yourProfile?.stressReactions?.length > 0 || yourDemo?.stressReactions?.length > 0) completed++;
    if (yourProfile?.attachmentStyles?.length > 0 || yourDemo?.attachmentStyles?.length > 0) completed++;
    if (yourProfile?.loveLanguages?.length > 0 || yourDemo?.loveLanguages?.length > 0) completed++;
    if (yourProfile?.receiveLove?.length > 0 || yourDemo?.receiveLove?.length > 0) completed++;
    
    // Background
    if (yourProfile?.familyDynamics?.length > 0 || yourDemo?.familyDynamics?.length > 0) completed++;
    if (yourProfile?.relationshipStatus?.length > 0 || yourDemo?.relationshipStatus?.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const calculatePartnerCompletion = () => {
    const partnerProfile = profiles.partner[0];
    const partnerDemo = demographicsData.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4; // Key fields for partner profile
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const yourCompletion = calculateYourCompletion();
  const partnerCompletion = calculatePartnerCompletion();

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
        {/* Meet Kai with enhanced messaging */}
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
            Your AI relationship coach trained on 15+ years of clinical psychology expertise. 
            {profileCompletion > 0 ? ` I already know some things about ${userName || 'you'} and can provide personalized guidance.` : ' Complete your profile to unlock personalized insights.'}
          </p>
        </Card>

        {/* Profile Completion Status with real-time updates */}
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-4 h-4 text-coral-600" />
            <h3 className="font-medium text-gray-900">Your Profiles</h3>
            <div className="ml-auto text-xs text-gray-500">{profileCompletion}% overall</div>
          </div>
          
          {/* Your Profile with real-time progress */}
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
                {yourCompletion > 0 ? 'Continue' : 'Start Profile'}
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
                {partnerCompletion > 0 ? 'Continue' : 'Add Partner'}
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

          {/* Dynamic messaging based on progress */}
          {yourCompletion >= 30 && (
            <div className="mt-4 p-2 bg-coral-50 rounded text-xs text-coral-700 animate-fade-in">
              <strong>Ready to chat!</strong> I have enough info about {userName || 'you'} to provide personalized relationship guidance.
            </div>
          )}
          
          {yourCompletion > 0 && yourCompletion < 30 && (
            <div className="mt-4 p-2 bg-amber-50 rounded text-xs text-amber-700 animate-fade-in">
              <strong>Keep going!</strong> Complete a bit more of your profile for better personalized advice.
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
