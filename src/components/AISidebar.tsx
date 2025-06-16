
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Lightbulb, Heart, MessageCircle } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import APIKeyInput from "./APIKeyInput";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
}

const AISidebar = ({ profiles, demographicsData, chatHistory, isConfigured, onSupabaseConfigured }: AISidebarProps) => {
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const { topics, loading } = useConversationTopics();

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
          <h3 className="font-medium text-gray-900">Meet Kai</h3>
        </div>
        <p className="text-sm text-gray-600">
          Built on the expertise of PhD-level clinical psychology—trained on 15+ years of insights to deliver real, effective advice for modern relationships.
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
    </div>
  );
};

export default AISidebar;
