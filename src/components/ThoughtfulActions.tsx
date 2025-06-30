
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Calendar, MessageSquare, Gift, Coffee, Phone, Star } from "lucide-react";
import QuickActions from "./ThoughtfulActions/QuickActions";
import SuggestionsList from "./ThoughtfulActions/SuggestionsList";
import ActionForm from "./ThoughtfulActions/ActionForm";
import RelationshipAlerts from "./ThoughtfulActions/RelationshipAlerts";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface ThoughtfulActionsProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

const ThoughtfulActions = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: ThoughtfulActionsProps) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<string>("");

  // Get partner name
  const partnerName = demographicsData.partner?.name || 'your partner';
  const userName = demographicsData.your?.name || 'You';

  const handleQuickAction = (actionType: string) => {
    console.log('Quick action selected:', actionType);
    // This would trigger the action or show confirmation
  };

  const handleCustomAction = (actionData: any) => {
    console.log('Custom action created:', actionData);
    setShowCustomForm(false);
  };

  return (
    <div className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Turn Insights Into Action</h2>
          <p className="text-xl text-pink-200/80 max-w-2xl mx-auto">
            Small, thoughtful actions that strengthen your connection with {partnerName}
          </p>
        </div>

        {/* Relationship Alerts */}
        <RelationshipAlerts 
          profiles={profiles}
          demographicsData={demographicsData}
        />

        {/* Quick Actions */}
        <QuickActions 
          profiles={profiles}
          demographicsData={demographicsData}
          onSelectAction={handleQuickAction}
        />

        {/* Personalized Suggestions */}
        <SuggestionsList 
          profiles={profiles}
          demographicsData={demographicsData}
        />

        {/* Custom Action Creator */}
        <Card className="p-8 lg:p-12 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-3">Create Your Own Action</h3>
              <p className="text-pink-200/80 max-w-xl mx-auto text-lg">
                Have a specific idea for connecting with {partnerName}? Let's plan it together and get personalized tips.
              </p>
            </div>
            <Button
              onClick={() => setShowCustomForm(true)}
              className="bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 hover:from-orange-500 hover:via-pink-600 hover:to-pink-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 rounded-xl"
            >
              Plan Custom Action
              <Heart className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Custom Action Form Modal */}
        {showCustomForm && (
          <ActionForm
            profiles={profiles}
            demographicsData={demographicsData}
            onClose={() => setShowCustomForm(false)}
            onSubmit={handleCustomAction}
          />
        )}
      </div>
    </div>
  );
};

export default ThoughtfulActions;
