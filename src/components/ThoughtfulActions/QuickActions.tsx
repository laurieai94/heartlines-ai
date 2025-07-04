
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Gift, Heart, Calendar, MessageSquare } from "lucide-react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures", icon: Coffee, color: "electric-blue" },
  { value: "special", label: "Special Occasions", icon: Gift, color: "neon-cyan" },
  { value: "support", label: "Emotional Support", icon: Heart, color: "lavender" },
  { value: "quality-time", label: "Quality Time", icon: Calendar, color: "electric-purple" },
  { value: "communication", label: "Communication", icon: MessageSquare, color: "neon-blue" }
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
          
          // Apply different electric colors to different categories
          const getColorClasses = (color: string) => {
            switch (color) {
              case "electric-blue":
                return "bg-electric-blue/10 hover:bg-electric-blue/20 border-electric-blue/30 hover:border-electric-blue/50 text-electric-blue";
              case "neon-cyan":
                return "bg-neon-cyan/10 hover:bg-neon-cyan/20 border-neon-cyan/30 hover:border-neon-cyan/50 text-neon-cyan";
              case "lavender":
                return "bg-lavender/10 hover:bg-lavender/20 border-lavender/30 hover:border-lavender/50 text-lavender";
              case "electric-purple":
                return "bg-electric-purple/10 hover:bg-electric-purple/20 border-electric-purple/30 hover:border-electric-purple/50 text-electric-purple";
              case "neon-blue":
                return "bg-neon-blue/10 hover:bg-neon-blue/20 border-neon-blue/30 hover:border-neon-blue/50 text-neon-blue";
              default:
                return "bg-white/5 hover:bg-white/15 border-white/20 hover:border-white/30 text-white";
            }
          };

          return (
            <Button
              key={category.value}
              variant="outline"
              onClick={() => onSelectAction(category.value)}
              className={`flex items-center gap-3 h-auto py-3.5 px-5 justify-start transition-all duration-200 rounded-xl hover:text-white ${getColorClasses(category.color)}`}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium leading-tight">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
