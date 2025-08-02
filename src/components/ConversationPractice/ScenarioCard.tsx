
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ScenarioCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ScenarioCard = ({ id, icon: IconComponent, title, subtitle, description, isSelected, onSelect }: ScenarioCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-coral-500 bg-coral-50' : 'bg-white/60 backdrop-blur-md'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-coral-500 text-white' : 'bg-coral-100 text-coral-600'
        }`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default ScenarioCard;
