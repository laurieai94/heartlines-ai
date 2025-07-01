
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

interface AgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const AgeSelection = ({ selectedAge, onAgeSelect }: AgeSelectionProps) => {
  const ageOptions = [
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50+'
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        What's your age? <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <Lightbulb className="w-3 h-3" />
        <span>Different life stages = different relationship challenges</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ageOptions.map((age) => (
          <button
            key={age}
            onClick={() => onAgeSelect(age)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
              selectedAge === age
                ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white border-orange-400 shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeSelection;
