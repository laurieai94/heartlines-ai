
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Gift, Heart, Calendar, MessageSquare } from "lucide-react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures", icon: Coffee },
  { value: "special", label: "Special Occasions", icon: Gift },
  { value: "support", label: "Emotional Support", icon: Heart },
  { value: "quality-time", label: "Quality Time", icon: Calendar },
  { value: "communication", label: "Communication", icon: MessageSquare }
];

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface QuickActionsProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  onSelectAction: (actionType: string) => void;
}

const QuickActions = ({ profiles, demographicsData, onSelectAction }: QuickActionsProps) => {
  return (
    <Card className="p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
      <h3 className="text-2xl font-semibold text-white mb-6">Quick Inspiration</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTION_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.value}
              variant="outline"
              onClick={() => onSelectAction(category.value)}
              className="flex items-center gap-3 h-auto py-4 px-6 justify-start bg-white/5 hover:bg-white/15 border-white/20 hover:border-white/30 text-white hover:text-white transition-all duration-200 rounded-xl"
            >
              <IconComponent className="w-5 h-5 text-orange-400" />
              <span className="text-base font-medium">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
