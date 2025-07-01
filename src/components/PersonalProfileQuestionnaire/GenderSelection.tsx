
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";

interface GenderSelectionProps {
  selectedGenders: string[];
  selfDescribe: string;
  onGenderSelect: (gender: string) => void;
  onSelfDescribeChange: (value: string) => void;
}

const GenderSelection = ({ selectedGenders, selfDescribe, onGenderSelect, onSelfDescribeChange }: GenderSelectionProps) => {
  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-3">
      <Label className="text-lg font-semibold text-white">
        How do you identify your gender? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-sm ml-2">✨ Check all that apply</span>
      </Label>
      <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
        <Lightbulb className="w-4 h-4" />
        <span>We get that gender is complex and personal</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`p-3 rounded-xl text-sm font-medium transition-all text-left hover:scale-105 ${
              selectedGenders.includes(gender)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
      
      {selectedGenders.includes('Prefer to self-describe') && (
        <div className="mt-2">
          <Label className="text-sm font-medium text-white mb-1 block">
            Please describe your gender identity:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default GenderSelection;
