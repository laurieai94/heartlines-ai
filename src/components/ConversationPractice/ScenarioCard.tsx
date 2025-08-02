
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
      className={`p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group ${
        isSelected 
          ? 'ring-2 ring-coral-500 bg-gradient-to-br from-coral-50 to-coral-100 shadow-md shadow-coral-200/50' 
          : 'bg-white/80 backdrop-blur-md hover:bg-white/90 border border-gray-200/50'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
          isSelected 
            ? 'bg-coral-500 text-white shadow-coral-500/25 scale-110' 
            : 'bg-coral-100 text-coral-600 group-hover:bg-coral-200 group-hover:scale-105'
        }`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1.5 tracking-wide">{title}</h4>
          <p className="text-sm text-gray-700 mb-2 font-medium">{subtitle}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Subtle selected indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-coral-200">
          <div className="flex items-center gap-2 text-coral-600">
            <div className="w-2 h-2 bg-coral-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Selected for practice</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ScenarioCard;
