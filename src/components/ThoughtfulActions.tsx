
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
      <div className="space-y-10">
        {/* Header - Improved typography hierarchy and spacing */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">Turn Insights Into Action</h2>
          <p className="text-lg text-pink-200/80 max-w-xl mx-auto leading-relaxed">
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

        {/* Custom Action Creator - Reduced padding and improved proportions */}
        <Card className="p-10 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl max-w-2xl mx-auto">
          <div className="text-center space-y-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white leading-tight">Create Your Own Action</h3>
              <p className="text-pink-200/80 max-w-md mx-auto leading-relaxed">
                Have a specific idea for connecting with {partnerName}? Let's plan it together and get personalized tips.
              </p>
            </div>
            <Button
              onClick={() => setShowCustomForm(true)}
              className="bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 hover:from-orange-500 hover:via-pink-600 hover:to-pink-700 text-white px-8 py-3 text-base font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 rounded-xl"
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
