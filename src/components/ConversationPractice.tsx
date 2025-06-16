
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart } from "lucide-react";

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface ConversationPracticeProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

const ConversationPractice = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: ConversationPracticeProps) => {
  const [currentScenario, setCurrentScenario] = useState("");

  // Get user and partner names from demographics
  const userName = demographicsData.your?.name || '';
  const partnerName = demographicsData.partner?.name || 'your partner';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation Practice</h2>
        <p className="text-gray-600">
          Practice difficult conversations with personalized scenarios and scripts
        </p>
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <p className="text-sm text-coral-600 mt-1">
            💡 Scenarios personalized using your relationship profiles
          </p>
        )}
      </div>

      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="text-center space-y-4">
          <MessageCircle className="w-16 h-16 mx-auto text-coral-500" />
          <h3 className="text-xl font-semibold text-gray-900">Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Practice conversations tailored to {userName ? `${userName} and ${partnerName}` : 'you and your partner'}'s communication styles and relationship dynamics.
          </p>
          <Button disabled className="mt-4">
            Start Practice Session
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConversationPractice;
