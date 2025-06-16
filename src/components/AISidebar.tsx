
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Lightbulb, Heart, MessageCircle } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useConversationTopics } from "@/hooks/useConversationTopics";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
}

const AISidebar = ({ profiles, demographicsData, chatHistory }: AISidebarProps) => {
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  const { topics, loading } = useConversationTopics();

  return (
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
          <h3 className="font-medium text-gray-900">Meet Kai</h3>
        </div>
        <p className="text-sm text-gray-600">
          PhD-level clinical psychologist with 15+ years experience. Real advice that actually works for modern relationships.
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

      {/* Dynamic Topics */}
      {(chatHistory.length > 0 || topics.length > 0) && (
        <Card className="p-4 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <h3 className="font-medium text-gray-900 mb-3">What We've Covered</h3>
          <div className="space-y-2">
            {loading ? (
              <p className="text-xs text-gray-500">Loading topics...</p>
            ) : topics.length > 0 ? (
              topics.slice(0, 5).map((topic, index) => (
                <Badge key={topic.id} variant="outline" className="w-full justify-start border-coral-200 text-coral-700 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {topic.topic} {topic.frequency > 1 && `(${topic.frequency}x)`}
                </Badge>
              ))
            ) : chatHistory.length > 0 ? (
              <p className="text-xs text-gray-500">Keep chatting and I'll track our conversation themes</p>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AISidebar;
