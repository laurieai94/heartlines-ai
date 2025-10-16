
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface AgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const AgeSelection = ({ selectedAge, onAgeSelect }: AgeSelectionProps) => {
  const ageOptions = [
    'under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50-60', '65+'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2 space-y-1">
      <div>
        <Label className="text-sm font-semibold text-white">
          what's your age? <span className="text-red-400">*</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal">
          <Calendar className="w-3 h-3 text-orange-300" />
          <span>different life stages = different relationship challenges</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ageOptions.map((age) => (
          <button
            key={age}
            onClick={() => onAgeSelect(age)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
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
