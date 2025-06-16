
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Lightbulb, Heart, MessageCircle } from "lucide-react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
}

const AISidebar = ({ profiles, demographicsData, chatHistory }: AISidebarProps) => {
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  const recentTopics = [
    "Communication patterns",
    "Supporting each other", 
    "Managing stress together"
  ];

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
  );
};

export default AISidebar;
