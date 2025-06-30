
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Turn Insights Into Action</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
        <Card className="p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Own Action</h3>
              <p className="text-gray-600 max-w-xl mx-auto">
                Have a specific idea for connecting with {partnerName}? Let's plan it together and get personalized tips.
              </p>
            </div>
            <Button
              onClick={() => setShowCustomForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Plan Custom Action
              <Heart className="w-5 h-5 ml-2" />
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
