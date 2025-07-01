
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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-3">
      <Label className="text-lg font-semibold text-white">
        What's your age? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
        <Lightbulb className="w-4 h-4" />
        <span>Different life stages = different relationship challenges</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ageOptions.map((age) => (
          <button
            key={age}
            onClick={() => onAgeSelect(age)}
            className={`p-3 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
              selectedAge === age
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
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
