
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
      <Label className="text-sm font-semibold text-white mb-1 block">
        How do you identify your gender? <span className="text-red-400">*</span>
        <span className="text-electric-blue font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
        <Heart className="w-3 h-3 text-electric-purple" />
        <span>We get that gender is complex and personal</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`p-2 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
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
          <Label className="text-xs font-medium text-white mb-1 block">
            Please describe your gender identity:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 min-h-[60px] resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default GenderSelection;
