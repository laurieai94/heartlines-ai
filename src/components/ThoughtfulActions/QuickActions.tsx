
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
    <Card className="p-8 glass-botanical border border-orange-400/25 shadow-orange rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-8 leading-tight">Quick Inspiration</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTION_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.value}
              variant="outline"
              onClick={() => onSelectAction(category.value)}
              className="flex items-center gap-3 h-auto py-3.5 px-5 justify-start glass-orange hover:bg-orange-500/20 border-orange-400/30 hover:border-orange-300/50 text-white hover:text-white transition-all duration-200 rounded-xl hover:shadow-orange"
            >
              <IconComponent className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span className="text-sm font-medium leading-tight">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
