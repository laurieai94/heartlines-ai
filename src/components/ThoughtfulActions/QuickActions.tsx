
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

interface QuickActionsProps {
  onQuickAction: (category: string) => void;
}

const QuickActions = ({ onQuickAction }: QuickActionsProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-pink-50 to-fuchsia-50 border-pink-200/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Inspiration</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACTION_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Button
              key={cat.value}
              variant="outline"
              onClick={() => onQuickAction(cat.value)}
              className="flex items-center gap-2 h-auto py-3 px-4 justify-start"
            >
              <IconComponent className="w-4 h-4 text-pink-600" />
              <span className="text-sm">{cat.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
