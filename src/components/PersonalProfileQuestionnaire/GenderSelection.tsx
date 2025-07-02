
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What's your gender identity? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <Heart className="w-3 h-3 text-purple-300" />
          <span>We get that gender is complex and personal</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => onGenderSelect(gender)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
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
        <div className="mt-1.5">
          <Label className="text-xs font-medium text-white mb-1 block">
            Please describe your gender identity:
          </Label>
          <Textarea
            value={selfDescribe}
            onChange={(e) => onSelfDescribeChange(e.target.value)}
            placeholder="How do you identify?"
            className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 min-h-[50px] resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default GenderSelection;
