
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
          <h2 className="text-4xl font-bold text-white font-sans tracking-tight">Turn Insights Into Action</h2>
          <p className="text-xl text-pink-200 max-w-2xl mx-auto font-medium">
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
        <Card className="p-8 lg:p-10 bg-gradient-to-br from-white/10 via-pink-50/20 to-orange-50/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-3 font-sans tracking-tight">Create Your Own Action</h3>
              <p className="text-pink-200 max-w-xl mx-auto text-lg font-medium">
                Have a specific idea for connecting with {partnerName}? Let's plan it together and get personalized tips.
              </p>
            </div>
            <Button
              onClick={() => setShowCustomForm(true)}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 h-auto"
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
