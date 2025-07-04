
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
    <Card className="p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-elegant rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-8 leading-tight">Quick Inspiration</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTION_CATEGORIES.map((category, index) => {
          const IconComponent = category.icon;
          // Add lavender accent to Heart/Emotional Support category
          const isEmotionalSupport = category.value === "support";
          return (
            <Button
              key={category.value}
              variant="outline"
              onClick={() => onSelectAction(category.value)}
              className={`flex items-center gap-3 h-auto py-3.5 px-5 justify-start transition-all duration-200 rounded-xl ${
                isEmotionalSupport 
                  ? "bg-lavender/10 hover:bg-lavender/20 border-lavender/30 hover:border-lavender/50 text-white hover:text-white"
                  : "bg-white/5 hover:bg-white/15 border-white/20 hover:border-white/30 text-white hover:text-white"
              }`}
            >
              <IconComponent className={`w-4 h-4 flex-shrink-0 ${
                isEmotionalSupport ? 'text-lavender' : 'text-warm-white'
              }`} />
              <span className="text-sm font-medium leading-tight">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
